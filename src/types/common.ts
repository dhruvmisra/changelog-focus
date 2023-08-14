export enum AppEnvironment {
    LOCALHOST = "localhost",
    STAGING = "staging",
    PRODUCTION = "production",
}

export enum FetchMechanism {
    GITHUB = "GITHUB",
    SCRAPING = "SCRAPING",
}

export interface GitHubUrls {
    [AppEnvironment.LOCALHOST]: string;
    [AppEnvironment.STAGING]: string;
    [AppEnvironment.PRODUCTION]: string;
}

export interface AppConfiguration {
    environment: AppEnvironment;
    githubBaseUrl: string;
}

export type Selectable = {
    selected: boolean;
};

export type Searchable = {
    matched: boolean;
    matchScore: number;
};
