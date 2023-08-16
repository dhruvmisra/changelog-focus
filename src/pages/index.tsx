import Head from "next/head";
import type { NextPage } from "next";
import { useQuery } from "@tanstack/react-query";
import { GitHub } from "@/utils/github";
import type { AxiosError } from "axios";

import { type FormEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import ChangelogContent from "@/components/ChangelogContent";
import { GITHUB_BASE_URL } from "@/constants/endpoints";
import type { Release, SelectableRelease } from "@/types";
import { FetchMechanism } from "@/types";
import ReleaseSelection from "@/components/ReleaseSelection";
import NProgress from "nprogress";
import { RELEASES_FETCH_LIMIT } from "@/constants";
import { getFetchMechanism } from "@/utils/common";
import { api } from "@/utils/api";
import {
    getLinkFromQueryParams,
    getReleaseRangeFromQueryParams,
    setLinkInQueryParams,
} from "@/utils/query";

const Home: NextPage = () => {
    const [mainRef] = useAutoAnimate();
    const [containerRef] = useAutoAnimate();
    const [formRef] = useAutoAnimate();
    const [repositoryLink, setRepositoryLink] = useState("");
    const [fetchMechanism, setFetchMechanism] = useState<FetchMechanism | null>(null);
    const [initialFetch, setInitialFetch] = useState<boolean>(true);

    const {
        data: scrapedReleases,
        refetch: refetchScrapedReleases,
        isInitialLoading: isInitialLoadingScrapedReleases,
        isRefetching: isRefreshingScrapedReleases,
    } = api.changelog.getScrapedReleases.useQuery(
        {
            link: repositoryLink,
        },
        {
            enabled: false,
            retry: false,
            onError: (error: unknown) => {
                console.log(error);
                toast.error(`Oops, somehting went wrong!`);
            },
        }
    );

    const getGitHubReleases = async () => {
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

        const localReleases = await GitHub.getReleases(owner, repo, RELEASES_FETCH_LIMIT);
        return localReleases;
    };

    const {
        data: githubReleases,
        refetch: refetchGithubReleases,
        isInitialLoading: isInitialLoadingGithubReleases,
        isRefetching: isRefetchingGithubReleases,
    } = useQuery<Release[]>([`releases_${repositoryLink}`], getGitHubReleases, {
        enabled: false,
        retry: false,
        onError: (error: unknown) => {
            const axiosError = error as AxiosError;
            const requestSpecificError: string = axiosError.message;
            toast.error(`Oops, somehting went wrong! ${requestSpecificError}`);
        },
    });
    const releases = scrapedReleases || githubReleases;
    const isLoading =
        isInitialLoadingGithubReleases ||
        isRefetchingGithubReleases ||
        isInitialLoadingScrapedReleases ||
        isRefreshingScrapedReleases;
    const [filteredReleases, setFilteredReleases] = useState<SelectableRelease[]>([]);
    const selectedReleases = filteredReleases.filter((release) => release.selected);

    if (isLoading) {
        NProgress.start();
    } else {
        NProgress.done();
    }

    useEffect(() => {
        const linkQuery = getLinkFromQueryParams();
        linkQuery && setRepositoryLink(linkQuery);
    }, []);

    useEffect(() => {
        setFetchMechanism(null);
        const linkQuery = getLinkFromQueryParams();
        if (initialFetch && linkQuery && repositoryLink) {
            const mechanism = getFetchMechanism(repositoryLink);
            setFetchMechanism(mechanism);
            getReleases(mechanism);
            setInitialFetch(false);
        }
    }, [repositoryLink]);

    useEffect(() => {
        const localReleases: SelectableRelease[] = [];

        if (releases) {
            for (const release of releases) {
                localReleases.push({
                    selected: false,
                    ...release,
                });
            }
            setLinkInQueryParams(repositoryLink);

            const releaseRangeQuery = getReleaseRangeFromQueryParams();
            if (releaseRangeQuery) {
                const { first, last } = releaseRangeQuery;
                let foundFirst = false;
                for (const release of localReleases) {
                    if (String(release.id) === first) {
                        foundFirst = true;
                    }
                    if (foundFirst) {
                        release.selected = true;
                    }
                    if (String(release.id) === last) {
                        break;
                    }
                }
            }
        }
        setFilteredReleases(localReleases);
    }, [scrapedReleases, githubReleases]);

    const getReleases = (mechanism: FetchMechanism) => {
        switch (mechanism) {
            case FetchMechanism.GITHUB:
                void refetchGithubReleases();
                break;
            case FetchMechanism.SCRAPING:
                void refetchScrapedReleases();
                break;
        }
    };

    const handleRepositoryLinkChange = (e: FormEvent<HTMLInputElement>) => {
        setRepositoryLink(e.currentTarget.value);
    };

    const handleReleasesSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const mechanism = getFetchMechanism(repositoryLink);
        setFetchMechanism(mechanism);
        getReleases(mechanism);
        setInitialFetch(false);
        setLinkInQueryParams(repositoryLink);
    };

    return (
        <>
            <Head>
                <title>Changelog Focus</title>
                <meta name="description" content="Focus on the changelog relevant to you" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
            </Head>
            <main className="mx-4 flex min-h-screen flex-col items-center" ref={mainRef}>
                <div className="container flex flex-col items-center justify-center py-4 ">
                    <h1 className="py-8 text-5xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-[5rem]">
                        Changelog <span className="text-violet-600 drop-shadow-md">Focus</span>
                        {process.env.NEXT_PUBLIC_PRE_RELEASE && (
                            <span className="prerelease-tag text-sm font-bold tracking-normal">
                                {process.env.NEXT_PUBLIC_PRE_RELEASE}
                            </span>
                        )}
                    </h1>

                    <form
                        className="relative w-full"
                        onSubmit={handleReleasesSubmit}
                        ref={formRef}
                    >
                        <input
                            type="text"
                            id="repository-link"
                            className="w-full rounded-lg border border-gray-800 bg-gray-900 p-2.5 text-sm text-gray-50 focus:border-violet-500 focus:ring-violet-500"
                            placeholder="Repository link"
                            value={repositoryLink}
                            onChange={handleRepositoryLinkChange}
                            required
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="absolute right-0 top-[1px] w-10 rounded-r-lg bg-violet-600 p-2.5 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none  focus:ring-4 focus:ring-violet-800 disabled:bg-gray-700 disabled:hover:bg-gray-800"
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        aria-hidden="true"
                                        role="status"
                                        className="inline h-4 w-4 animate-spin"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        stroke="currentColor"
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
                                </>
                            ) : (
                                <span>&rarr;</span>
                            )}
                            <span className="sr-only">Search</span>
                        </button>
                        {fetchMechanism === FetchMechanism.GITHUB && (
                            <p
                                className="mt-1 rounded-sm bg-[#14191d] text-center text-xs font-semibold uppercase tracking-wide text-gray-400"
                                title="Scraping page to fetch releases"
                            >
                                GitHub
                            </p>
                        )}
                        {fetchMechanism === FetchMechanism.SCRAPING && (
                            <p
                                className="mt-1 rounded-sm bg-yellow-500 text-center text-xs font-semibold uppercase tracking-wide text-yellow-900"
                                title="Scraping page to fetch releases"
                            >
                                Scraping - Experimental
                            </p>
                        )}
                    </form>
                </div>

                <div className="container block w-full gap-4 sm:flex" ref={containerRef}>
                    {releases &&
                        (releases.length > 0 ? (
                            <div className="grow">
                                <ReleaseSelection
                                    releases={filteredReleases}
                                    setReleases={setFilteredReleases}
                                />
                            </div>
                        ) : (
                            <div className="grow">
                                <p
                                    className="mt-6 rounded-lg border border-red-600 bg-red-600/40 p-2 text-center text-sm text-red-100"
                                    title="Scraping page to fetch releases"
                                >
                                    Could not find releases. Please verify the link.
                                </p>
                            </div>
                        ))}
                    {selectedReleases.length > 0 && (
                        <div className="grow basis-3/5">
                            <ChangelogContent releases={selectedReleases} />
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default Home;
