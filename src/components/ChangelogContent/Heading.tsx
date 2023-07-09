import { type MouseEvent } from "react";
import type { SegregatedChangelogSection, SegregatedChangelog, ChangelogMetadata } from "@/types";

type ChangelogContentHeadingProps = {
    section: SegregatedChangelogSection;
    changelogMetadata: ChangelogMetadata;
    headingKey: string;
    isFocused: boolean;
    setSegregatedChangelog: <K extends string | number>(
        key: K,
        value: SegregatedChangelog[K]
    ) => void;
};

const ChangelogContentHeading = ({
    section,
    headingKey,
    isFocused,
    changelogMetadata,
    setSegregatedChangelog,
}: ChangelogContentHeadingProps) => {
    // const handleHeadingInput = (
    //     e: FormEvent<HTMLHeadingElement>,
    //     heading: string
    // ) => {
    //     e.preventDefault();
    //     const updatedSection = segregatedChangelog[heading]!;
    //     updatedSection.displayName = e.currentTarget.textContent;
    //     set(heading, updatedSection);
    // };

    const handleRemoveSectionClick = (_: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        const newSection = { ...section };
        newSection.hidden = true;
        setSegregatedChangelog(headingKey, newSection);
    };

    const handleRestoreSectionClick = (
        _: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => {
        const newSection = { ...section };
        newSection.hidden = false;
        setSegregatedChangelog(headingKey, newSection);
    };

    return (
        <div className="release-section-heading mb-2.5 flex items-center">
            {!section.hidden && <h3 className="mb-0 mr-2 mt-0">{section.displayName}</h3>}
            {isFocused && (
                <span className="focus-info text-xs text-slate-500">
                    <b>
                        {section.children.reduce(
                            (acc, child) => acc + Number(changelogMetadata[child.id]!.selected),
                            0
                        )}
                    </b>{" "}
                    OUT OF <b>{section.children.length}</b> ITEMS
                </span>
            )}

            {!isFocused &&
                (section.hidden ? (
                    <button
                        type="button"
                        className="release-section-heading-btn restore-btn -ml-2 rounded-full border border-transparent text-left text-xs text-white hover:border-green-300 hover:bg-green-700"
                        onClick={handleRestoreSectionClick}
                    >
                        <span className="icon">&#10095;</span>
                        <span className="text ml-1">Restore section: {headingKey}</span>
                    </button>
                ) : (
                    <button
                        type="button"
                        className="release-section-heading-btn remove-btn rounded-full border border-transparent text-left text-xs text-white hover:border-orange-300 hover:bg-orange-500"
                        onClick={handleRemoveSectionClick}
                    >
                        <span className="icon">&#10005;</span>
                        <span className="text ml-1">Remove section</span>
                    </button>
                ))}
        </div>
    );
};

export default ChangelogContentHeading;
