import { Selectable } from "./common";

export type Release = {
    id: number;
    name: string;
    body: string;
    url: string;
    prerelease: true;
    draft: true;
    created_at: string;
};
export type SelectableRelease = Release & Selectable;
