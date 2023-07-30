import type { Selectable } from "./common";

export type Release = {
    id: number;
    name: string;
    body: string;
    url: string;
    prerelease: boolean;
    draft: boolean;
    created_at: string;
};
export type SelectableRelease = Release & Selectable;
