import { QueryParam, type ReleaseRangeQuery, type SelectedChangelogQuery } from "@/types";
import { urlEncode, urlDecode } from "./common";

const getQueryParams = (key: string): string | null => {
    const currentUrl = new URL(window.location.href);
    return currentUrl.searchParams.get(key);
};

const setQueryParams = (key: string, value: string): void => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set(key, value);
    const newUrl = currentUrl.href.split(currentUrl.origin)[1];
    window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);
};

export const setLinkInQueryParams = (link: string): void => {
    setQueryParams(QueryParam.LINK, urlEncode(link));
};

export const setReleaseRangeInQueryParams = (
    first: string | number,
    last: string | number
): void => {
    setQueryParams(QueryParam.RELEASE_RANGE, `${first}-${last}`);
};

export const setSelectedChangelogInQueryParams = (selectedChangelogIds: string[]): void => {
    setQueryParams(QueryParam.SELECTED_CHANGELOG, selectedChangelogIds.join(","));
};

export const setIsFocusedInQueryParams = (isFocused: boolean): void => {
    setQueryParams(QueryParam.IS_FOCUSED, JSON.stringify(isFocused));
};

export const getLinkFromQueryParams = (): string => {
    const link = getQueryParams(QueryParam.LINK);
    return link ? urlDecode(link) : "";
};

export const getReleaseRangeFromQueryParams = (): ReleaseRangeQuery | null => {
    const releaseRange = getQueryParams(QueryParam.RELEASE_RANGE);
    if (!releaseRange) return null;

    const [first, last] = releaseRange.split("-");
    return first && last ? { first, last } : null;
};

export const getSelectedChangelogFromQueryParams = (): SelectedChangelogQuery | null => {
    const selectedChangelog = getQueryParams(QueryParam.SELECTED_CHANGELOG);
    return selectedChangelog ? selectedChangelog.split(",") : null;
};

export const getIsFocusedFromQueryParams = (): boolean | null => {
    const isFocused = getQueryParams(QueryParam.IS_FOCUSED);
    return isFocused ? isFocused === "true" : null;
};
