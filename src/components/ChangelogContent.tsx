import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { type Release } from "@/utils/github";
import { useState, useEffect } from "react";
import { type MouseEvent } from "react";
import { marked } from "marked";
import * as DOMPurify from "dompurify";
import { useMap } from "react-use";
import { slugify } from "@/utils/common";
import { useAutoAnimate } from "@formkit/auto-animate/react";

dayjs.extend(relativeTime);

type ChangelogContentProps = {
    releases: Release[];
};

type SegregatedChangelogSectionChild = marked.Token & {
    slug: string;
    selected: boolean;
    tokens: any[];
};

type SegregatedChangelogSection = {
    children: SegregatedChangelogSectionChild[];
    displayName: string | null;
};

type SegregatedChangelog = {
    [key: string]: SegregatedChangelogSection;
};

const OTHER_SECTION_HEADING = "Other";

const ChangelogContent = ({ releases }: ChangelogContentProps) => {
    const [listRef] = useAutoAnimate();
    const [segregatedChangelog, { set, setAll, remove }] = useMap<SegregatedChangelog>();
    const [isFocused, setIsFocused] = useState<boolean>(false);

    let focusAvailable = false;
    for (const section of Object.values(segregatedChangelog)) {
        for (const child of section.children) {
            if (child.selected) {
                focusAvailable = true;
                break;
            }
        }
        if (focusAvailable) break;
        // section.children.sort((a, b) => Number(b.selected) - Number(a.selected))
    }

    useEffect(() => {
        let tokens: marked.Token[] = [];
        for (const release of releases) {
            const releaseTokens = marked.lexer(release.body);
            tokens = tokens.concat(releaseTokens);
        }

        const localSegregatedChangelog: SegregatedChangelog = {};
        localSegregatedChangelog[OTHER_SECTION_HEADING] = { children: [], displayName: "Other" };
        traverseTokensTree(tokens, localSegregatedChangelog, OTHER_SECTION_HEADING);
        if (localSegregatedChangelog[OTHER_SECTION_HEADING]?.children.length === 0) {
            delete localSegregatedChangelog[OTHER_SECTION_HEADING];
        }

        setAll(localSegregatedChangelog);
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

            const newSection = localSegregatedChangelog[currentHeading] || {
                children: [],
                displayName: currentHeading,
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

    // const handleHeadingInput = (
    //     e: FormEvent<HTMLHeadingElement>,
    //     heading: string
    // ) => {
    //     e.preventDefault();
    //     const updatedSection = segregatedChangelog[heading]!;
    //     updatedSection.displayName = e.currentTarget.textContent;
    //     set(heading, updatedSection);
    // };

    const handleListItemClick = (
        e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>,
        headingKey: string
    ) => {
        if (!isFocused) {
            const id = e.currentTarget.id;
            const section = segregatedChangelog[headingKey]!;
            const index = section.children.findIndex((item) => item.slug === id);
            const newSection = { ...section };
            newSection.children[index]!.selected = !newSection.children[index]!.selected;
            set(headingKey, newSection);
        }
    };

    return (
        <div className={`release-container container px-4 pb-10 ${isFocused ? "focus" : ""}`}>
            <button
                type="button"
                className={`ml-auto mt-2 block w-auto rounded-md px-2 py-1 text-center text-sm font-medium text-white focus:outline-none focus:ring-2 disabled:bg-transparent disabled:font-normal disabled:text-slate-400 ${isFocused
                        ? "bg-red-700 hover:bg-red-800 focus:ring-red-300"
                        : "bg-green-700 hover:bg-green-800 focus:ring-green-300"
                    }`}
                onClick={() => setIsFocused(!isFocused)}
                disabled={!focusAvailable}
            >
                {isFocused ? "Unfocus" : focusAvailable ? "Focus" : "Select items to focus"}
            </button>
            {Object.entries(segregatedChangelog).map(
                ([headingKey, section], i) =>
                    (!isFocused ||
                        (isFocused &&
                            section.children.reduce(
                                (acc, child) => acc || child.selected,
                                false
                            ))) && (
                        <div
                            className="release-section prose my-2 max-w-full dark:prose-invert"
                            key={i}
                        >
                            <div className="flex items-center mb-2.5">
                                <h3 className="mt-0 mb-0">{section.displayName}</h3>{" "}
                                {isFocused && (
                                    <span className="focus-info text-xs ml-4 text-slate-500">
                                        {/* FOCUSING ON{" "} */}
                                        <b>
                                            {section.children.reduce(
                                                (acc, child) => acc + Number(child.selected),
                                                0
                                            )}
                                        </b>{" "}
                                        OUT OF <b>{section.children.length}</b> ITEMS
                                    </span>
                                )}
                            </div>
                            <ul className="release-section-list mt-0" ref={listRef}>
                                {section.children.map(
                                    (child) =>
                                        (!isFocused || (isFocused && child.selected)) && (
                                            <li
                                                className={`release-section-list-item ${child.selected ? "selected" : ""
                                                    } hover:bg-gray-900`}
                                                key={child.slug}
                                                id={child.slug}
                                                onClick={(e) => handleListItemClick(e, headingKey)}
                                                title={
                                                    isFocused ? "" : "Click to select for focus"
                                                }
                                                dangerouslySetInnerHTML={{
                                                    __html: DOMPurify.sanitize(
                                                        marked.parser(child.tokens)
                                                    ),
                                                }}
                                            ></li>
                                        )
                                )}
                            </ul>
                        </div>
                    )
            )}
        </div>
    );
};

export default ChangelogContent;
