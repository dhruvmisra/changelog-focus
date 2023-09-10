import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState, type FormEvent } from "react";
import { FetchMechanism } from "@/types";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useInterval } from "react-use";

dayjs.extend(relativeTime);

type LinkFormProps = {
    repositoryLink: string;
    isLoading: boolean;
    fetchMechanism: FetchMechanism | null;
    setRepositoryLink: (repositoryLink: string) => void;
    onSubmit?: () => void;
};

const PLACEHOLDER_VALUES = ["GitHub repository link", "Any link with changelog (experimental)"];

export const LinkForm = ({
    repositoryLink,
    isLoading,
    fetchMechanism,
    setRepositoryLink,
    onSubmit,
}: LinkFormProps) => {
    const [formRef] = useAutoAnimate();
    const [formInputRef] = useAutoAnimate();
    const [placeholderIndex, setPlaceholderIndex] = useState<number>(0);
    const isLinkEmpty = repositoryLink === "";

    useInterval(
        () => {
            setPlaceholderIndex((placeholderIndex + 1) % PLACEHOLDER_VALUES.length);
        },
        isLinkEmpty ? 4000 : null
    );

    const handleRepositoryLinkChange = (e: FormEvent<HTMLInputElement>) => {
        setRepositoryLink(e.currentTarget.value);
    };

    const handleReleasesSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit && onSubmit();
    };

    return (
        <form className=" mb-4 w-full" onSubmit={handleReleasesSubmit} ref={formRef}>
            <div className="w-100 relative flex overflow-hidden" ref={formInputRef}>
                <input
                    type="text"
                    id="repository-link"
                    className="peer w-full rounded-l-lg border border-gray-300 bg-gray-100 p-2.5 text-sm text-gray-900 outline-none focus:border-violet-500 focus:ring-violet-500"
                    value={repositoryLink}
                    onChange={handleRepositoryLinkChange}
                    required
                />
                {isLinkEmpty && (
                    <label
                        htmlFor="repository-link"
                        className="pointer-events-none absolute left-3 top-3 w-full select-none overflow-hidden whitespace-nowrap text-sm text-gray-500 peer-autofill:opacity-0"
                        key={placeholderIndex}
                    >
                        {PLACEHOLDER_VALUES[placeholderIndex]}
                    </label>
                )}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="z-10 w-10 rounded-r-lg bg-violet-600 p-2.5 text-sm font-medium text-white hover:bg-violet-700 focus:ring-violet-800 disabled:bg-gray-700"
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
                    <span className="sr-only">Submit</span>
                </button>
            </div>
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
    );
};
