import type { NextPage } from "next";
import { useQuery } from "@tanstack/react-query";
import { GitHub } from "@/utils/github";
import type { AxiosError } from "axios";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { GITHUB_BASE_URL } from "@/constants/endpoints";
import type { Release, SelectableRelease } from "@/types";
import { FetchMechanism } from "@/types";
import { ChangelogContent } from "@/components/ChangelogContent";
import { ReleaseSelection } from "@/components/ReleaseSelection";
import { LinkForm } from "@/components/LinkForm";
import { Features } from "@/components/Features";
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
    const [repositoryLink, setRepositoryLink] = useState("");
    const [fetchMechanism, setFetchMechanism] = useState<FetchMechanism | null>(null);
    const [initialFetch, setInitialFetch] = useState<boolean>(true);
    const [showFeatures, setShowFeatures] = useState<boolean>(true);

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
                toast.error(`Oops, something went wrong!`);
            },
        }
    );

    const getGitHubReleases = async () => {
        let url: URL;
        try {
            url = new URL(repositoryLink);
        } catch (e) {
            throw new Error("Invalid URL");
        }

        if (url.host !== GITHUB_BASE_URL) {
            throw new Error("Not a GitHub URL");
        }

        const splitPath = url.pathname.split("/");
        if (splitPath.length < 3) {
            throw new Error("Not a valid GitHub repository URL");
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
    } = useQuery<Release[]>(["releases", repositoryLink], getGitHubReleases, {
        enabled: false,
        retry: false,
        onError: (error: unknown) => {
            const axiosError = error as AxiosError;
            const requestSpecificError: string = axiosError.message;
            toast.error(`Oops, something went wrong! ${requestSpecificError}`);
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

    if (typeof window !== "undefined") {
        if (isLoading) {
            NProgress.start();
        } else {
            NProgress.done();
        }
    }

    useEffect(() => {
        const linkQuery = getLinkFromQueryParams();
        setRepositoryLink(linkQuery);
        setShowFeatures(linkQuery === "");
    }, [typeof window !== "undefined" && window.location.search]);

    useEffect(() => {
        setFetchMechanism(null);

        if (repositoryLink) {
            let url: URL;
            try {
                url = new URL(repositoryLink);
            } catch (e) {
                return;
            }
            const mechanism = getFetchMechanism(url);
            const linkQuery = getLinkFromQueryParams();

            if (initialFetch && linkQuery) {
                setFetchMechanism(mechanism);
                getReleases(mechanism);
                setInitialFetch(false);
            } else if (releases) {
                setFetchMechanism(mechanism);
            }
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

    const handleLinkSubmit = () => {
        let url: URL;
        try {
            url = new URL(repositoryLink);
        } catch (e) {
            toast.error("Invalid URL");
            return;
        }
        const mechanism = getFetchMechanism(url);
        setFetchMechanism(mechanism);
        getReleases(mechanism);
        setInitialFetch(false);
        setLinkInQueryParams(repositoryLink);
    };

    return (
        <main className="pt-8" ref={mainRef}>
            <article className="hero">
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-5xl">
                    Changelog <span className="text-violet-600 drop-shadow-md">Focus</span>
                    {process.env.NEXT_PUBLIC_PRE_RELEASE_TAG && (
                        <span className="prerelease-tag text-xs font-bold tracking-normal sm:text-sm">
                            {" "}
                            [{process.env.NEXT_PUBLIC_PRE_RELEASE_TAG}]
                        </span>
                    )}
                </h1>
                <p className="mb-6 text-lg text-gray-400">
                    Focus on the changelog relevant to you.
                </p>

                <LinkForm
                    repositoryLink={repositoryLink}
                    setRepositoryLink={setRepositoryLink}
                    isLoading={isLoading}
                    fetchMechanism={fetchMechanism}
                    onSubmit={handleLinkSubmit}
                />
            </article>

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
                        <div className="mt-6 grow rounded-lg border border-red-600 bg-red-600/20 p-2 text-center text-sm text-red-50">
                            <p className="mb-2 font-semibold">Could not find releases</p>
                            <p className="text-sm">Please verify the link.</p>
                        </div>
                    ))}
                {fetchMechanism === FetchMechanism.UNSUPPORTED && (
                    <div className="mt-6 grow rounded-lg border border-red-600 bg-red-600/20 p-2 text-center text-sm text-red-50">
                        <p className="mb-2 font-semibold">Unsupported link</p>
                        <p className="text-sm">
                            This app currently only supports a few hosts which can be scraped.
                        </p>
                    </div>
                )}
                {selectedReleases.length > 0 && (
                    <div className="grow basis-3/5">
                        <ChangelogContent releases={selectedReleases} />
                    </div>
                )}
            </div>

            {showFeatures && <Features />}
        </main>
    );
};

export default Home;
