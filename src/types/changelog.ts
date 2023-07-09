import type { marked } from "marked";
import type { Searchable, Selectable } from "./common";

export type SegregatedChangelogSectionChild = marked.Token & {
    id: string;
    originalSortScore: number;
    tokens: marked.Token[];
};

export type SegregatedChangelogSection = {
    children: SegregatedChangelogSectionChild[];
    displayName: string | null;
    hidden: boolean;
};

export type SegregatedChangelog = {
    [key: string]: SegregatedChangelogSection;
};

export type ChangelogItemMetadata = Selectable & Searchable

export type ChangelogMetadata = {
    [key: string]: ChangelogItemMetadata;
};
