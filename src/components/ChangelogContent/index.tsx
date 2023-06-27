import { useState, useEffect } from "react";
import { marked } from "marked";
import { useMap } from "react-use";
import { slugify } from "@/utils/common";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { OTHER_SECTION_HEADING } from "@/constants";
import { SegregatedChangelog, Release } from "@/types";
import ChangelogContentHeading from "@/components/ChangelogContent/Heading";
import ChangelogContentList from "@/components/ChangelogContent/List";
import ChangelogContentActionBar from "./ActionBar";
import { FloatingFocusButton } from "./FocusButton";

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
    const firstSelectedRelease = releases.length > 0 ? releases[0] : undefined;
    const lastSelectedRelease = releases.length > 0 ? releases[releases.length - 1] : undefined;
    let title = "";
    if (firstSelectedRelease && lastSelectedRelease) {
        if (firstSelectedRelease.id == lastSelectedRelease.id) {
            title = firstSelectedRelease.name;
        } else {
            title = `${lastSelectedRelease.name} → ${firstSelectedRelease.name}`;
        }
    }
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

    return (
        <div className={`release-container container pb-10 ${isFocused ? "focus" : ""}`}>
            <ChangelogContentActionBar
                title={title}
                segregatedChangelog={segregatedChangelog}
                isFocused={isFocused}
                setIsFocused={setIsFocused}
                focusAvailable={focusAvailable}
                setAllSegregatedChangelog={setAllSegregatedChangelog}
            />
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
            <FloatingFocusButton
                isFocused={isFocused}
                focusAvailable={focusAvailable}
                handleFocusClick={() => setIsFocused(!isFocused)}
            />
        </div>
    );
};

export default ChangelogContent;
