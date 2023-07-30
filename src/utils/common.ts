import type { NextRouter } from "next/router";
import type Fuse from "fuse.js";
import { FetchMechanism, type ChangelogItemMetadata, type ChangelogMetadata, type SegregatedChangelog } from "@/types";
import { SLUG_LENGTH } from "@/constants";
import { GITHUB_BASE_URL } from "@/constants/endpoints";

export const urlEncode = (link: string): string => {
    return encodeURIComponent(link).replace(/'/g, "%27").replace(/"/g, "%22");
};

export const urlDecode = (encodedLink: string): string => {
    return decodeURIComponent(encodedLink.replace(/\+/g, " "));
};

export const updateQueryParams = (
    router: NextRouter,
    queryParams: Record<string, string>
): void => {
    const query = {
        ...router.query,
        ...queryParams,
    };
    router.push({ query: query }, undefined, { shallow: true });
};

export const base64Encode = (text: string): string => {
    return Buffer.from(text).toString("base64");
};

export const base64Decode = (encodedText: string): string => {
    return Buffer.from(encodedText, "base64").toString("utf-8");
};

export const slugify = (text: string): string =>
    text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .substring(0, SLUG_LENGTH) +
    "-" +
    String(Math.floor(Math.random() * 10000000000000000));

export const getSearchableChangelogList = (segregatedChangelog: SegregatedChangelog): string[] => {
    const list: string[] = [];
    for (const section of Object.values(segregatedChangelog)) {
        list.push(...section.children.map((child) => child.raw));
    }
    return list;
};

export const getFetchMechanism = (repositoryLink: string): FetchMechanism => {
    const splitUrl = repositoryLink.split(GITHUB_BASE_URL);
    if (splitUrl.length < 2) {
        return FetchMechanism.SCRAPING;
    } else {
        return FetchMechanism.GITHUB;
    }
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
