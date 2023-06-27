import type { SegregatedChangelog } from "@/types";
import { FocusButton } from "./FocusButton";

type ChangelogContentActionBarProps = {
    title: string;
    segregatedChangelog: SegregatedChangelog;
    isFocused: boolean;
    focusAvailable: boolean;
    setIsFocused: (val: boolean) => void;
    setAllSegregatedChangelog: (newMap: SegregatedChangelog) => void;
};

const ChangelogContentActionBar = ({
    title,
    segregatedChangelog,
    isFocused,
    focusAvailable,
    setIsFocused,
    setAllSegregatedChangelog,
}: ChangelogContentActionBarProps) => {
    let isAnySectionHidden = false;
    for (const section of Object.values(segregatedChangelog)) {
        if (section.hidden) {
            isAnySectionHidden = true;
            break;
        }
    }

    const handleRestoreSectionsClick = () => {
        const localSegregatedChangelog: SegregatedChangelog = {};
        for (const [headingKey, section] of Object.entries(segregatedChangelog)) {
            localSegregatedChangelog[headingKey] = { ...section, hidden: false };
        }
        setAllSegregatedChangelog(localSegregatedChangelog);
    };

    return (
        <div className="action-bar sticky top-0 z-10 mb-4 pt-1 backdrop-blur-md">
            <div className="flex items-center p-2">
                <p className="text-xs text-white">{title}</p>
                <div className="ml-auto flex w-fit items-center gap-2">
                    {isAnySectionHidden && (
                        <button
                            type="button"
                            className="ml-auto block w-auto rounded-md px-2 text-center text-xs font-medium text-gray-500 transition-colors hover:text-white"
                            onClick={handleRestoreSectionsClick}
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
            <hr className="h-px border-0 bg-gray-200 dark:bg-gray-700" />
        </div>
    );
};

export default ChangelogContentActionBar;
