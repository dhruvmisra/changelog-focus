import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { FormEvent } from "react";
import type { SelectableRelease } from "@/types";

dayjs.extend(relativeTime);

type ReleaseSelectionProps = {
    releases: SelectableRelease[];
    setReleases: (releases: SelectableRelease[]) => void;
};

const ReleaseSelection = ({ releases, setReleases }: ReleaseSelectionProps) => {
    const handleReleaseSelection = (e: FormEvent<HTMLInputElement>, releaseId: number) => {
        e.preventDefault();
        const newReleases = [...releases];
        const index = newReleases.findIndex((release) => release.id == releaseId);

        if (index === -1) {
            return;
        }

        let indexOfGroupBefore = -1;
        let indexOfGroupAhead = -1;
        for (let i = index; i >= 0; i--) {
            if (newReleases[i]!.selected) {
                indexOfGroupBefore = i;
                break;
            }
        }
        for (let i = index; i < newReleases.length; i++) {
            if (newReleases[i]!.selected) {
                indexOfGroupAhead = i;
                break;
            }
        }

        if (indexOfGroupBefore != -1 && indexOfGroupAhead != -1) {
            for (let i = 0; i < newReleases.length; i++) {
                if (i === index) {
                    newReleases[i]!.selected = true;
                } else {
                    newReleases[i]!.selected = false;
                }
            }
        } else if (indexOfGroupBefore == -1 && indexOfGroupAhead == -1) {
            newReleases[index]!.selected = true;
        } else if (indexOfGroupBefore != -1) {
            for (let i = indexOfGroupBefore + 1; i <= index; i++) {
                newReleases[i]!.selected = true;
            }
        } else if (indexOfGroupAhead != -1) {
            for (let i = index; i < indexOfGroupAhead; i++) {
                newReleases[i]!.selected = true;
            }
        }
        setReleases(newReleases);
    };

    return (
        <div className="releases-container mb-8 h-fit w-full pt-4">
            <h3 className="mb-1 font-medium text-white">Releases</h3>
            <p className="mb-4 text-xs text-gray-500">Select a range to view changelog</p>
            <ul>
                {releases?.map((release) => (
                    <li key={`${release.id}-${String(release.selected)}`}>
                        <input
                            type="checkbox"
                            id={release.name}
                            value={release.id}
                            className="peer hidden"
                            checked={release.selected}
                            onChange={(e) => handleReleaseSelection(e, release.id)}
                        />
                        <label
                            htmlFor={release.name}
                            className="inline-flex w-full cursor-pointer flex-wrap items-center justify-between rounded-lg border border-gray-200 bg-white p-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-violet-600 peer-checked:text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
                            tabIndex={0}
                            aria-checked={release.selected}
                            role="checkbox"
                        >
                            <div className="block">
                                <div className="text-md font-semibold">{release.name}</div>
                            </div>
                            {release.created_at && (
                                <div className="block">
                                    <div className="text-sm text-gray-700">
                                        {`${dayjs(release.created_at).fromNow()}`}
                                    </div>
                                </div>
                            )}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReleaseSelection;
