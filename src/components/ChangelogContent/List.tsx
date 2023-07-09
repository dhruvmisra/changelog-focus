import { type MouseEvent } from "react";
import { marked } from "marked";
import * as DOMPurify from "dompurify";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import type {
    SegregatedChangelogSection,
    SegregatedChangelogSectionChild,
    ChangelogMetadata,
} from "@/types";

type ChangelogContentListProps = {
    section: SegregatedChangelogSection;
    changelogMetadata: ChangelogMetadata;
    isFocused: boolean;
    setChangelogMetadata: <K extends string | number>(key: K, value: ChangelogMetadata[K]) => void;
};

const ChangelogContentList = ({
    section,
    changelogMetadata,
    isFocused,
    setChangelogMetadata,
}: ChangelogContentListProps) => {
    const [autoAnimateRef] = useAutoAnimate();
    const sortedChildren = section.children.sort(
        (a, b) => changelogMetadata[a.id]!.matchScore - changelogMetadata[b.id]!.matchScore
    );

    const handleListItemClick = (e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>) => {
        if (!isFocused) {
            const id = e.currentTarget.id;
            const newMetadata = { ...changelogMetadata[id]! };
            newMetadata.selected = !newMetadata.selected;
            setChangelogMetadata(id, newMetadata);
        }
    };

    const isChildVisible = (child: SegregatedChangelogSectionChild) => {
        const isSelected = changelogMetadata[child.id]!.selected;
        const isMatchingSearch = changelogMetadata[child.id]!.matched;

        if (isFocused) {
            return isSelected && isMatchingSearch;
        }

        return isMatchingSearch;
    };

    return (
        <ul className="release-section-list mt-0" ref={autoAnimateRef}>
            {sortedChildren.map(
                (child) =>
                    isChildVisible(child) && (
                        <li
                            className={`release-section-list-item ${
                                changelogMetadata[child.id]!.selected ? "selected" : ""
                            } hover:bg-gray-900`}
                            key={child.id}
                            id={child.id}
                            onClick={handleListItemClick}
                            title={isFocused ? "" : "Click to select for focus"}
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(marked.parser(child.tokens)),
                            }}
                        ></li>
                    )
            )}
        </ul>
    );
};

export default ChangelogContentList;
