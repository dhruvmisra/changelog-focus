import { useState, useEffect, useCallback } from "react";
import { marked } from "marked";
import { useMap } from "react-use";
import { digest } from "@/utils/common";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { OTHER_SECTION_HEADING } from "@/constants";
import {
    type SegregatedChangelog,
    type Release,
    type SegregatedChangelogSection,
    type ChangelogMetadata,
} from "@/types";
import ChangelogContentHeading from "@/components/ChangelogContent/Heading";
import ChangelogContentList from "@/components/ChangelogContent/List";
import ChangelogContentActionBar from "./ActionBar";
import { FloatingFocusButton } from "./FocusButton";
import {
    getIsFocusedFromQueryParams,
    getSelectedChangelogFromQueryParams,
    setIsFocusedInQueryParams,
    setReleaseRangeInQueryParams,
    setSelectedChangelogInQueryParams,
} from "@/utils/query";

type ChangelogContentProps = {
    releases: Release[];
};

type TraversableToken = marked.Token & { tokens?: marked.Token[] };

const ChangelogContent = ({ releases }: ChangelogContentProps) => {
    const [autoAnimateRef] = useAutoAnimate();
    const [
        segregatedChangelog,
        { set: setSegregatedChangelog, setAll: setAllSegregatedChangelog },
    ] = useMap<SegregatedChangelog>();
    const [changelogMetadata, { set: setChangelogMetadata, setAll: setAllChangelogMetadata }] =
        useMap<ChangelogMetadata>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isInitialSelection, setIsInitialSelection] = useState<boolean>(true);
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

    const isFocusAvailable = (
        segregatedChangelog: SegregatedChangelog,
        changelogMetadata: ChangelogMetadata
    ) => {
        for (const section of Object.values(segregatedChangelog)) {
            if (section.hidden) continue;
            for (const child of section.children) {
                if (changelogMetadata[child.id]?.selected) {
                    return true;
                }
            }
        }
        return false;
    };
    const focusAvailable = isFocusAvailable(segregatedChangelog, changelogMetadata);
    const selectedIds = Object.entries(changelogMetadata)
        .filter(([_, v]) => v.selected)
        .map(([k, _]) => k);

    const traverseListItems = useCallback(
        async (
            listItems: marked.Tokens.ListItem[],
            localSegregatedChangelog: SegregatedChangelog,
            localChangelogMetadata: ChangelogMetadata,
            currentHeading: string
        ): Promise<marked.Tokens.ListItem[]> => {
            for (const [i, item] of listItems.entries()) {
                item.tokens = await traverseTokensTree(
                    item.tokens,
                    localSegregatedChangelog,
                    localChangelogMetadata,
                    currentHeading
                );

                const newSection = localSegregatedChangelog[currentHeading] ?? {
                    children: [],
                    displayName: currentHeading,
                    hidden: false,
                };
                const id = await digest(item.text);
                if (!(id in localChangelogMetadata)) {
                    newSection.children.push({
                        id: id,
                        originalSortScore: i,
                        ...item,
                    });
                    localChangelogMetadata[id] = {
                        selected: false,
                        matched: true,
                        matchScore: i,
                    };
                    localSegregatedChangelog[currentHeading] = newSection;
                }
            }
            return listItems;
        },
        []
    );

    const traverseTokensTree = useCallback(
        async (
            tokens: TraversableToken[],
            localSegregatedChangelog: SegregatedChangelog,
            localChangelogMetadata: ChangelogMetadata,
            currentHeading: string
        ): Promise<marked.Token[]> => {
            for (const token of tokens) {
                if (token.tokens) {
                    token.tokens = await traverseTokensTree(
                        token.tokens as TraversableToken[],
                        localSegregatedChangelog,
                        localChangelogMetadata,
                        currentHeading
                    );
                }

                if (token.type == "heading") {
                    currentHeading = token.text;
                } else if (token.type == "list") {
                    token.items = await traverseListItems(
                        token.items,
                        localSegregatedChangelog,
                        localChangelogMetadata,
                        currentHeading
                    );
                }
            }
            return tokens;
        },
        [traverseListItems]
    );

    const resetChangelogState = async (tokens: marked.Token[]) => {
        const localSegregatedChangelog: SegregatedChangelog = {};
        const localChangelogMetadata: ChangelogMetadata = {};
        localSegregatedChangelog[OTHER_SECTION_HEADING] = {
            children: [],
            displayName: "Other",
            hidden: false,
        };
        await traverseTokensTree(
            tokens,
            localSegregatedChangelog,
            localChangelogMetadata,
            OTHER_SECTION_HEADING
        );
        if (localSegregatedChangelog[OTHER_SECTION_HEADING]?.children.length === 0) {
            delete localSegregatedChangelog[OTHER_SECTION_HEADING];
        }

        const selectedChangelogList = getSelectedChangelogFromQueryParams();
        if (selectedChangelogList) {
            for (const id of selectedChangelogList) {
                if (id in localChangelogMetadata) {
                    localChangelogMetadata[id] = {
                        ...localChangelogMetadata[id]!,
                        selected: true,
                    };
                }
            }
        }

        const isFocusedQuery = getIsFocusedFromQueryParams();
        const focusAvailable = isFocusAvailable(localSegregatedChangelog, localChangelogMetadata);
        if (isInitialSelection && focusAvailable && isFocusedQuery) {
            setIsFocused(true);
        } else {
            setIsFocused(false);
        }
        setAllChangelogMetadata(localChangelogMetadata);
        setAllSegregatedChangelog(localSegregatedChangelog);
        setIsLoading(false);
        setIsInitialSelection(false);
    };

    useEffect(() => {
        let tokens: marked.Token[] = [];
        for (const release of releases) {
            const releaseTokens = marked.lexer(release.body);
            tokens = tokens.concat(releaseTokens);
        }

        setIsLoading(true);
        void resetChangelogState(tokens);
    }, [releases]);

    useEffect(() => {
        if (!isInitialSelection) {
            setIsFocusedInQueryParams(isFocused);
        }
    }, [isFocused, isInitialSelection]);

    useEffect(() => {
        if (!isInitialSelection) {
            setSelectedChangelogInQueryParams(selectedIds);
        }
    }, [selectedIds, isInitialSelection]);

    useEffect(() => {
        if (!isInitialSelection && firstSelectedRelease && lastSelectedRelease) {
            setReleaseRangeInQueryParams(firstSelectedRelease.id, lastSelectedRelease.id);
        }
    }, [firstSelectedRelease, lastSelectedRelease, isInitialSelection]);

    const restoreSections = () => {
        const localSegregatedChangelog: SegregatedChangelog = {};
        for (const [headingKey, section] of Object.entries(segregatedChangelog)) {
            localSegregatedChangelog[headingKey] = { ...section, hidden: false };
        }
        setAllSegregatedChangelog(localSegregatedChangelog);
    };

    const isSectionVisible = (section: SegregatedChangelogSection) => {
        const isAnyChildMatchingSearch = section.children.reduce(
            (acc, child) => acc || changelogMetadata[child.id]!.matched,
            false
        );
        if (isFocused) {
            const isAnyChildSelected = section.children.reduce(
                (acc, child) => acc || changelogMetadata[child.id]!.selected,
                false
            );
            return isAnyChildSelected && isAnyChildMatchingSearch;
        }

        return isAnyChildMatchingSearch;
    };

    return (
        <div
            className={`release-container container relative pb-10 ${isFocused ? "focus" : ""} ${
                isLoading ? "pointer-events-none select-none blur-sm" : ""
            }`}
        >
            <ChangelogContentActionBar
                title={title}
                segregatedChangelog={segregatedChangelog}
                changelogMetadata={changelogMetadata}
                isFocused={isFocused}
                setIsFocused={setIsFocused}
                focusAvailable={focusAvailable}
                restoreSections={restoreSections}
                setAllChangelogMetadata={setAllChangelogMetadata}
            />
            {Object.entries(segregatedChangelog).map(
                ([headingKey, section]) =>
                    isSectionVisible(section) && (
                        <div
                            className="release-section prose my-2 max-w-full dark:prose-invert"
                            key={headingKey}
                            ref={autoAnimateRef}
                        >
                            <ChangelogContentHeading
                                section={section}
                                headingKey={headingKey}
                                isFocused={isFocused}
                                changelogMetadata={changelogMetadata}
                                setSegregatedChangelog={setSegregatedChangelog}
                            />
                            {!section.hidden && (
                                <ChangelogContentList
                                    section={section}
                                    changelogMetadata={changelogMetadata}
                                    isFocused={isFocused}
                                    setChangelogMetadata={setChangelogMetadata}
                                />
                            )}
                        </div>
                    )
            )}
            {focusAvailable && (
                <FloatingFocusButton
                    isFocused={isFocused}
                    focusAvailable={focusAvailable}
                    handleFocusClick={() => setIsFocused(!isFocused)}
                />
            )}
        </div>
    );
};

export default ChangelogContent;
