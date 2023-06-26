import { type MouseEvent } from "react";
import { marked } from "marked";
import * as DOMPurify from "dompurify";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { SegregatedChangelogSection, SegregatedChangelog } from "@/types";

type ChangelogContentListProps = {
    section: SegregatedChangelogSection;
    headingKey: string;
    isFocused: boolean;
    setSegregatedChangelog: <K extends string | number>(
        key: K,
        value: SegregatedChangelog[K]
    ) => void;
};

const ChangelogContentList = ({
    section,
    headingKey,
    isFocused,
    setSegregatedChangelog,
}: ChangelogContentListProps) => {
    const [autoAnimateRef] = useAutoAnimate();

    const handleListItemClick = (e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>) => {
        if (!isFocused) {
            const id = e.currentTarget.id;
            const index = section.children.findIndex((item) => item.slug === id);
            const newSection = { ...section };
            newSection.children[index]!.selected = !newSection.children[index]!.selected;
            setSegregatedChangelog(headingKey, newSection);
        }
    };

    return (
        <ul className="release-section-list mt-0" ref={autoAnimateRef}>
            {section.children.map(
                (child) =>
                    (!isFocused || (isFocused && child.selected)) && (
                        <li
                            className={`release-section-list-item ${
                                child.selected ? "selected" : ""
                            } hover:bg-gray-900`}
                            key={child.slug}
                            id={child.slug}
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
