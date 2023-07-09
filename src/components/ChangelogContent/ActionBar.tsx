import Fuse from "fuse.js";
import type { ChangelogMetadata, SegregatedChangelog } from "@/types";
import { FocusButton } from "./FocusButton";
import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import { updateChangelogMetadataMatches, getSearchableChangelogList } from "@/utils/common";
import { SEARCH_DEBOUNCE_TIMEOUT } from "@/constants";

type ChangelogContentActionBarProps = {
    title: string;
    segregatedChangelog: SegregatedChangelog;
    changelogMetadata: ChangelogMetadata;
    isFocused: boolean;
    focusAvailable: boolean;
    setIsFocused: (val: boolean) => void;
    restoreSections: () => void;
    setAllChangelogMetadata: (newMap: ChangelogMetadata) => void;
};

type ChangelogSearchProps = {
    segregatedChangelog: SegregatedChangelog;
    changelogMetadata: ChangelogMetadata;
    setAllChangelogMetadata: (newMap: ChangelogMetadata) => void;
};

const ChangelogSearch = ({
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

const ChangelogContentActionBar = ({
    title,
    segregatedChangelog,
    changelogMetadata,
    isFocused,
    focusAvailable,
    setIsFocused,
    restoreSections,
    setAllChangelogMetadata,
}: ChangelogContentActionBarProps) => {
    let isAnySectionHidden = false;
    for (const section of Object.values(segregatedChangelog)) {
        if (section.hidden) {
            isAnySectionHidden = true;
            break;
        }
    }

    return (
        <div className="action-bar sticky top-0 z-10 mb-4 pt-1 backdrop-blur-md">
            <div className="flex items-center p-2">
                <p className="text-xs text-white">{title}</p>
                <div className="ml-auto flex w-fit items-center gap-2">
                    {isAnySectionHidden && (
                        <button
                            type="button"
                            className="ml-auto block w-auto rounded-md px-2 text-center text-xs font-medium text-gray-500 transition-colors hover:text-white"
                            onClick={restoreSections}
                        >
                            Restore sections
                        </button>
                    )}
                    {focusAvailable ? (
                        <div className="hidden sm:block">
                            <FocusButton
                                isFocused={isFocused}
                                handleFocusClick={() => setIsFocused(!isFocused)}
                            />
                        </div>
                    ) : (
                        <p className="w-fit text-left text-xs text-gray-500">
                            Select items to focus
                        </p>
                    )}
                </div>
            </div>
            <div className="">
                <ChangelogSearch
                    segregatedChangelog={segregatedChangelog}
                    changelogMetadata={changelogMetadata}
                    setAllChangelogMetadata={setAllChangelogMetadata}
                />
            </div>
            <hr className="h-px border-0 bg-gray-200 dark:bg-gray-700" />
        </div>
    );
};

export default ChangelogContentActionBar;
