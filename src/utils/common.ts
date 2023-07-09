import type Fuse from "fuse.js";
import type { ChangelogItemMetadata, ChangelogMetadata, SegregatedChangelog } from "@/types";
import { SLUG_LENGTH } from "@/constants";

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
