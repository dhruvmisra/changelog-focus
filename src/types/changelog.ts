import type { marked } from "marked";

export type SegregatedChangelogSectionChild = marked.Token & {
    slug: string;
    selected: boolean;
    tokens: any[];
};

export type SegregatedChangelogSection = {
    children: SegregatedChangelogSectionChild[];
    displayName: string | null;
    hidden: boolean;
};

export type SegregatedChangelog = {
    [key: string]: SegregatedChangelogSection;
};
