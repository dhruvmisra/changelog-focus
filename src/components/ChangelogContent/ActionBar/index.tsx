import type { ChangelogMetadata, SegregatedChangelog } from "@/types";
import { FocusButton } from "./FocusButton";
import { ChangelogShareButton } from "./ShareButton";
import { ChangelogSearch } from "./SearchBar";

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

export const ChangelogContentActionBar = ({
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
                            className="ml-auto block w-auto rounded-md px-2 py-1 text-center text-xs font-medium text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
                            onClick={restoreSections}
                        >
                            Restore sections
                        </button>
                    )}
                    <ChangelogShareButton />
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
