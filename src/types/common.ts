export enum AppEnvironment {
    LOCALHOST = "localhost",
    STAGING = "staging",
    PRODUCTION = "production",
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
