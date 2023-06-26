import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState, useEffect, MouseEvent } from "react";
import { marked } from "marked";
import { useMap } from "react-use";
import { slugify } from "@/utils/common";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { OTHER_SECTION_HEADING } from "@/constants";
import { SegregatedChangelog, Release } from "@/types";
import ChangelogContentHeading from "@/components/ChangelogContentHeading";
import ChangelogContentList from "@/components/ChangelogContentList";

dayjs.extend(relativeTime);

type ChangelogContentProps = {
    releases: Release[];
};

const ChangelogContent = ({ releases }: ChangelogContentProps) => {
    const [autoAnimateRef] = useAutoAnimate();
    const [
        segregatedChangelog,
        { set: setSegregatedChangelog, setAll: setAllSegregatedChangelog },
    ] = useMap<SegregatedChangelog>();
    const [isFocused, setIsFocused] = useState<boolean>(false);

    let focusAvailable = false;
    for (const section of Object.values(segregatedChangelog)) {
        if (section.hidden) continue;
        for (const child of section.children) {
            if (child.selected) {
                focusAvailable = true;
                break;
            }
        }
        if (focusAvailable) break;
        // section.children.sort((a, b) => Number(b.selected) - Number(a.selected))
    }
    let isAnySectionHidden = false;
    for (const section of Object.values(segregatedChangelog)) {
        if (section.hidden) {
            isAnySectionHidden = true;
            break;
        }
    }

    useEffect(() => {
        let tokens: marked.Token[] = [];
        for (const release of releases) {
            const releaseTokens = marked.lexer(release.body);
            tokens = tokens.concat(releaseTokens);
        }

        const localSegregatedChangelog: SegregatedChangelog = {};
        localSegregatedChangelog[OTHER_SECTION_HEADING] = {
            children: [],
            displayName: "Other",
            hidden: false,
        };
        traverseTokensTree(tokens, localSegregatedChangelog, OTHER_SECTION_HEADING);
        if (localSegregatedChangelog[OTHER_SECTION_HEADING]?.children.length === 0) {
            delete localSegregatedChangelog[OTHER_SECTION_HEADING];
        }

        setAllSegregatedChangelog(localSegregatedChangelog);
    }, [releases]);

    const traverseListItems = (
        listItems: marked.Tokens.ListItem[],
        localSegregatedChangelog: SegregatedChangelog,
        currentHeading: string
    ): marked.Tokens.ListItem[] => {
        for (const item of listItems) {
            item.tokens = traverseTokensTree(
                item.tokens,
                localSegregatedChangelog,
                currentHeading
            );

            const newSection = localSegregatedChangelog[currentHeading] ?? {
                children: [],
                displayName: currentHeading,
                hidden: false,
            };
            newSection.children.push({
                slug: slugify(item.text),
                selected: false,
                ...item,
            });
            localSegregatedChangelog[currentHeading] = newSection;
        }
        return listItems;
    };

    const traverseTokensTree = (
        tokens: marked.Token[],
        localSegregatedChangelog: SegregatedChangelog,
        currentHeading: string
    ): marked.Token[] => {
        for (const token of tokens) {
            if (token.tokens) {
                token.tokens = traverseTokensTree(
                    token.tokens,
                    localSegregatedChangelog,
                    currentHeading
                );
            }

            if (token.type == "heading") {
                currentHeading = token.text;
            } else if (token.type == "list") {
                token.items = traverseListItems(
                    token.items,
                    localSegregatedChangelog,
                    currentHeading
                );
            }
        }
        return tokens;
    };

    const handleRestoreSectionsClick = (
        _: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
        const localSegregatedChangelog: SegregatedChangelog = {};
        for (const [headingKey, section] of Object.entries(segregatedChangelog)) {
            localSegregatedChangelog[headingKey] = { ...section, hidden: false };
        }
        setAllSegregatedChangelog(localSegregatedChangelog);
    };

    return (
        <div className={`release-container container px-4 pb-10 ${isFocused ? "focus" : ""}`}>
            <div className="action-bar sticky top-0 z-10 mb-4 pt-1 backdrop-blur-md">
                <div className="ml-auto mt-2 flex w-fit items-center gap-2">
                    {isAnySectionHidden && (
                        <button
                            type="button"
                            className="ml-auto block w-auto rounded-md px-2 py-1 text-center text-xs font-medium text-gray-500 transition-colors hover:text-white"
                            onClick={handleRestoreSectionsClick}
                        >
                            Restore sections
                        </button>
                    )}
                    {focusAvailable ? (
                        <button
                            type="button"
                            className={`block w-auto rounded-md px-2 py-1 text-center text-xs font-medium text-white shadow-md focus:outline-none focus:ring-2 disabled:bg-transparent disabled:font-normal disabled:text-slate-400 ${
                                isFocused
                                    ? "bg-red-700 shadow-red-700/50 hover:bg-red-800 focus:ring-red-300"
                                    : "bg-green-600 shadow-green-600/50 hover:bg-green-500 focus:ring-green-400"
                            }`}
                            onClick={() => setIsFocused(!isFocused)}
                        >
                            {isFocused ? "Unfocus" : "Focus"}
                        </button>
                    ) : (
                        <p className="w-fit py-1 text-left text-xs text-gray-500">
                            Select items to focus
                        </p>
                    )}
                </div>
                <hr className="mt-2 h-px border-0 bg-gray-200 dark:bg-gray-700" />
            </div>
            {Object.entries(segregatedChangelog).map(
                ([headingKey, section]) =>
                    (!isFocused ||
                        (isFocused &&
                            section.children.reduce(
                                (acc, child) => acc || child.selected,
                                false
                            ))) && (
                        <div
                            className="release-section prose my-2 max-w-full dark:prose-invert"
                            key={headingKey}
                            ref={autoAnimateRef}
                        >
                            <ChangelogContentHeading
                                section={section}
                                headingKey={headingKey}
                                isFocused={isFocused}
                                setSegregatedChangelog={setSegregatedChangelog}
                            />
                            {!section.hidden && (
                                <ChangelogContentList
                                    section={section}
                                    headingKey={headingKey}
                                    isFocused={isFocused}
                                    setSegregatedChangelog={setSegregatedChangelog}
                                />
                            )}
                        </div>
                    )
            )}
        </div>
    );
};

export default ChangelogContent;
