export enum QueryParam {
    LINK = "link",
    RELEASE_RANGE = "releaseRange",
    SELECTED_CHANGELOG = "selectedChangelog",
}

export type ReleaseRangeQuery = {
    first: string;
    last: string;
}

export type SelectedChangelogQuery = string[]
