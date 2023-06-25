import { type NextPage } from "next";
import { useQuery } from "@tanstack/react-query";
import { type Release, GitHub } from "@/utils/github";

import Head from "next/head";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "@/utils/api";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import ChangelogContent from "@/components/ChangelogContent";
import { GITHUB_BASE_URL } from "@/constants/endpoints";

dayjs.extend(relativeTime);

type Selectable = {
    selected: boolean;
};

type SelectableRelease = Release & Selectable;

const Home: NextPage = () => {
    const [mainRef] = useAutoAnimate();
    const [repositoryLink, setRepositoryLink] = useState("");

    // const getReleases = async (e: FormEvent<HTMLFormElement>) => {
    const getReleases = async () => {
        const splitUrl = repositoryLink.split(GITHUB_BASE_URL);
        if (splitUrl.length < 2) {
            throw new Error("Not a GitHub URL");
        }

        const path = splitUrl[1]!;
        const splitPath = path.split("/");
        if (splitPath.length < 3) {
            throw new Error("Not a valid GitHub URL");
        }
        const owner = splitPath[1]!;
        const repo = splitPath[2]!;

        const localReleases = await GitHub.getReleases(owner, repo, 5);
        return localReleases;
    };

    const {
        data: releases,
        refetch: refetchReleases,
        isFetched: releasesFetched,
        isInitialLoading,
        isRefetching
    } = useQuery<Release[]>(["releases"], getReleases, {
        enabled: false,
        onError: (error: any) => {
            const requestSpecificError = error.message || "";
            // const repositoryError = error.data?.zodError?.fieldErrors.repositoryLink;
            // toast.error(`Oops, somehting went wrong! ${repositoryError?.join(", ")}`);
            toast.error(`Oops, somehting went wrong! ${requestSpecificError}`);
        },
        retry: false,
    });
    const isLoading = isInitialLoading || isRefetching;
    const [filteredReleases, setFilteredReleases] = useState<SelectableRelease[]>([]);
    const selectedReleases = filteredReleases.filter((release) => release.selected);
    const firstSelectedRelease = selectedReleases.length > 0 ? selectedReleases[0] : undefined;
    const lastSelectedRelease =
        selectedReleases.length > 0 ? selectedReleases[selectedReleases.length - 1] : undefined;

    useEffect(() => {
        const localReleases: SelectableRelease[] = [];
        if (releases) {
            for (const release of releases) {
                localReleases.push({
                    selected: false,
                    ...release,
                });
            }
        }
        setFilteredReleases(localReleases);
    }, [releases]);

    const handleRepositoryLinkChange = (e: FormEvent<HTMLInputElement>) => {
        setRepositoryLink(e.currentTarget.value);
    };

    const handleReleasesSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await refetchReleases();
    };

    const handleReleaseSelection = (e: FormEvent<HTMLInputElement>, releaseId: number) => {
        e.preventDefault();
        let newFilteredReleases = [...filteredReleases];
        let index = newFilteredReleases.findIndex((release) => release.id == releaseId);

        if (index === -1) {
            return;
        }

        let indexOfGroupBefore = -1;
        let indexOfGroupAhead = -1;
        for (let i = index; i >= 0; i--) {
            if (newFilteredReleases[i]!.selected) {
                indexOfGroupBefore = i;
                break;
            }
        }
        for (let i = index; i < newFilteredReleases.length; i++) {
            if (newFilteredReleases[i]!.selected) {
                indexOfGroupAhead = i;
                break;
            }
        }

        if (indexOfGroupBefore != -1 && indexOfGroupAhead != -1) {
            for (let i = 0; i < newFilteredReleases.length; i++) {
                if (i === index) {
                    newFilteredReleases[i]!.selected = true;
                } else {
                    newFilteredReleases[i]!.selected = false;
                }
            }
        } else if (indexOfGroupBefore == -1 && indexOfGroupAhead == -1) {
            newFilteredReleases[index]!.selected = true;
        } else if (indexOfGroupBefore != -1) {
            for (let i = indexOfGroupBefore + 1; i <= index; i++) {
                newFilteredReleases[i]!.selected = true;
            }
        } else if (indexOfGroupAhead != -1) {
            for (let i = index; i < indexOfGroupAhead; i++) {
                newFilteredReleases[i]!.selected = true;
            }
        }
        setFilteredReleases(newFilteredReleases);
    };

    return (
        <>
            <Head>
                <title>Changelog Simplify</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center" ref={mainRef}>
                <div className="container flex flex-col items-center justify-center py-4 ">
                    <h1 className="py-8 text-5xl font-extrabold tracking-tight drop-shadow-md text-white sm:text-[5rem]">
                        Changelog <span className="text-violet-600 drop-shadow-md">Simplify</span>
                    </h1>

                    <form className="w-full" onSubmit={handleReleasesSubmit}>
                        <div className="mb-6">
                            <input
                                type="text"
                                id="repository-link"
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-violet-500 focus:ring-violet-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50"
                                placeholder="Repository link"
                                value={repositoryLink}
                                onChange={handleRepositoryLinkChange}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mx-auto block w-full rounded-lg bg-violet-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300 sm:w-auto disabled:bg-gray-800 disabled:text-gray-400 disabled:border-gray-600 disabled:font-normal"
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        aria-hidden="true"
                                        role="status"
                                        className="mr-3 inline h-4 w-4 animate-spin text-white"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="#E5E7EB"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Getting releases
                                </>
                            ) : (
                                "Get releases"
                            )}
                        </button>
                    </form>
                </div>

                <div className="releases-changelog-container container w-full">
                    {releasesFetched && (
                        <div className="releases-container h-fit pt-2">
                            <p className="mb-2 font-medium text-gray-900 dark:text-white">
                                Releases
                            </p>
                            <ul>
                                {filteredReleases?.map((release) => (
                                    <li key={`${release.id}-${release.selected}`}>
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
                                            role="checkbox"
                                        >
                                            <div className="block">
                                                <div className="text-md font-semibold">
                                                    {release.name}
                                                </div>
                                            </div>
                                            <div className="block">
                                                <div className="text-sm text-gray-700">
                                                    {`${dayjs(release.created_at).fromNow()}`}
                                                </div>
                                            </div>
                                        </label>
                                    </li>
                                ))}
                            </ul>

                            {releases && firstSelectedRelease && lastSelectedRelease && (
                                <div className="mt-4">
                                    <p className="mb-4 text-center text-white">
                                        {firstSelectedRelease.id == lastSelectedRelease.id
                                            ? firstSelectedRelease.name
                                            : `${lastSelectedRelease.name} → ${firstSelectedRelease.name}`}
                                    </p>
                                    <button
                                        type="button"
                                        className="mx-auto block w-full rounded-lg bg-violet-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300 sm:w-auto"
                                    >
                                        Show changelog
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    {releases && <ChangelogContent releases={selectedReleases} />}
                </div>
            </main>
        </>
    );
};

export default Home;
