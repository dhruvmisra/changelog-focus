import Fuse from "fuse.js";
import type { ChangelogMetadata, SegregatedChangelog } from "@/types";
import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import { updateChangelogMetadataMatches, getSearchableChangelogList } from "@/utils/common";
import { SEARCH_DEBOUNCE_TIMEOUT } from "@/constants";

type ChangelogSearchProps = {
    segregatedChangelog: SegregatedChangelog;
    changelogMetadata: ChangelogMetadata;
    setAllChangelogMetadata: (newMap: ChangelogMetadata) => void;
};

export const ChangelogSearch = ({
    segregatedChangelog,
    changelogMetadata,
    setAllChangelogMetadata,
}: ChangelogSearchProps) => {
    const [searchText, setSearchText] = useState("");
    const [fuse, setFuse] = useState<Fuse<string> | null>(null);

    useEffect(() => {
        if (Object.keys(segregatedChangelog).length === 0) return;

        const searchableList = getSearchableChangelogList(segregatedChangelog);
        const options = {
            includeScore: true,
            ignoreLocation: true,
        };
        const fuse = new Fuse(searchableList, options);
        setFuse(fuse);
        setSearchText("");
    }, [segregatedChangelog]);

    const handleSearch = () => {
        if (fuse === null) return;

        const results = fuse.search(searchText);
        const newChangelogMetadata = updateChangelogMetadataMatches(
            segregatedChangelog,
            changelogMetadata,
            results,
            searchText !== ""
        );
        setAllChangelogMetadata(newChangelogMetadata);
    };

    useDebounce(handleSearch, SEARCH_DEBOUNCE_TIMEOUT, [searchText]);

    return (
        <div className="relative">
            <form onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    id="search"
                    className="w-full bg-transparent p-1 text-sm text-white outline-none"
                    placeholder="Search"
                    disabled={fuse === null}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </form>
        </div>
    );
};
