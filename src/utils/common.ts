import type Fuse from "fuse.js";
import {
    FetchMechanism,
    type ChangelogItemMetadata,
    type ChangelogMetadata,
    type SegregatedChangelog,
} from "@/types";
import { SCRAPING_SUPPORTED_HOSTS } from "@/constants";
import { GITHUB_BASE_URL } from "@/constants/endpoints";

export const urlEncode = (link: string): string => {
    return encodeURIComponent(link).replace(/'/g, "%27").replace(/"/g, "%22");
};

export const urlDecode = (encodedLink: string): string => {
    return decodeURIComponent(encodedLink.replace(/\+/g, " "));
};

export const base64Encode = (text: string): string => {
    return Buffer.from(text).toString("base64");
};

export const base64Decode = (encodedText: string): string => {
    return Buffer.from(encodedText, "base64").toString("utf-8");
};

export const digest = async (message: string): Promise<string> => {
    let subtle;
    if (typeof window === "undefined") {
        const nodeCrypto = await import("crypto");
        subtle = nodeCrypto.webcrypto.subtle;
    } else {
        subtle = window.crypto.subtle;
    }
    return Array.prototype.map
        .call(
            new Uint8Array(await subtle.digest("SHA-1", new TextEncoder().encode(message))),
            (x: number) => ("0" + x.toString(16)).slice(-2)
        )
        .join("");
};

export const getSearchableChangelogList = (segregatedChangelog: SegregatedChangelog): string[] => {
    const list: string[] = [];
    for (const section of Object.values(segregatedChangelog)) {
        list.push(...section.children.map((child) => child.raw));
    }
    return list;
};

const isHostSupported = (url: URL, supportedUrls: string[]) => {
    const host = url.host;

    return supportedUrls.some((supportedHost) => {
        const regex = new RegExp("^(.*\\.)?" + supportedHost + "$");
        return regex.test(host);
    });
};

export const getFetchMechanism = (url: URL): FetchMechanism => {
    if (url.host === GITHUB_BASE_URL) {
        return FetchMechanism.GITHUB;
    } else if (isHostSupported(url, SCRAPING_SUPPORTED_HOSTS)) {
        return FetchMechanism.SCRAPING;
    }
    return FetchMechanism.UNSUPPORTED;
};

export const updateChangelogMetadataMatches = (
    segregatedChangelog: SegregatedChangelog,
    changelogMetadata: ChangelogMetadata,
    searchResults: Fuse.FuseResult<string>[],
    isSearching: boolean
): ChangelogMetadata => {
    const newChangelogMetadata: ChangelogMetadata = {};

    for (const section of Object.values(segregatedChangelog)) {
        for (const child of section.children) {
            let metadata: ChangelogItemMetadata = { ...changelogMetadata[child.id]! };
            if (searchResults.length === 0) {
                metadata = {
                    ...metadata,
                    matched: !isSearching,
                    matchScore: child.originalSortScore,
                };
            } else {
                const searchResult = searchResults.find((result) => result.item === child.raw);
                if (searchResult) {
                    metadata = {
                        ...metadata,
                        matched: true,
                        matchScore: section.children.length + (searchResult.score ?? 0),
                    };
                } else {
                    metadata = {
                        ...metadata,
                        matched: false,
                        matchScore: child.originalSortScore,
                    };
                }
            }

            newChangelogMetadata[child.id] = metadata;
        }
    }
    return newChangelogMetadata;
};
