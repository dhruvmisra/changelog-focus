import { useAutoAnimate } from "@formkit/auto-animate/react";

export const Features = () => {
    const [animationRef] = useAutoAnimate();

    return (
        <article className="features mt-16">
            {/* <hr className="my-6 h-px border-0 bg-gray-200 dark:bg-gray-700" /> */}

            <ul className="relative border-gray-200 text-gray-500 dark:text-gray-400">
                <li className="mb-10">
                    <div className="flex flex-wrap items-center justify-center gap-20">
                        <div className="grow basis-full md:basis-1/3">
                            <h3 className="mb-4 text-xl font-medium text-white ">
                                Add a GitHub repository link
                            </h3>
                            <p className="mb-2 text-gray-400">
                                All GitHub repositories which maintain releases are supported.
                            </p>
                            <p className="text-gray-400">
                                Some organisations don&apos;t maintain changelog in GitHub releases. For
                                those cases, you can add a URL to the changelog page.
                                (experimental)
                            </p>
                        </div>
                        <div className="basis-full md:basis-1/2">
                            <div className="illustration-bg relative w-full px-8 py-16">
                                <input
                                    className="pointer-events-none w-full rounded-lg border border-gray-800 bg-gray-900 p-2.5 text-sm"
                                    type="text"
                                    value="https://github.com/pydantic/pydantic"
                                    disabled
                                ></input>
                            </div>
                        </div>
                    </div>
                    <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-800" />
                </li>
                <li className="mb-10">
                    <div className="flex flex-row-reverse flex-wrap items-center justify-center gap-20">
                        <div className="grow basis-full md:basis-1/3">
                            <h3 className="mb-4 text-xl font-medium text-white">
                                Select releases
                            </h3>
                            <p className="mb-2 text-gray-400">
                                Pick all the releases for which you&apos;d like to view the changelog.
                            </p>
                            <p className="text-gray-400">
                                Let&apos;s say your application uses <code>v1.0.3</code> and you wish to
                                upgrade to <code>v2.0.0</code>. You can then select all releases
                                from the version after <code>v1.0.3</code> till <code>v2.0.0</code>
                                .
                            </p>
                        </div>
                        <div className="basis-full md:basis-1/2">
                            <div className="illustration-bg relative w-full p-8">
                                <div className="w-full rounded-lg border border-violet-600 bg-white p-2.5 text-gray-300 dark:bg-gray-950 dark:text-gray-400">
                                    <div className="text-md font-semibold">v2.0.0</div>
                                </div>
                                <div className="w-full rounded-lg border border-violet-600 bg-white p-2.5 text-gray-300 dark:bg-gray-950 dark:text-gray-400">
                                    <div className="text-md font-semibold">v1.1.1</div>
                                </div>
                                <div className="w-full rounded-lg border border-violet-600 bg-white p-2.5 text-gray-300 dark:bg-gray-950 dark:text-gray-400">
                                    <div className="text-md font-semibold">v1.1.0</div>
                                </div>
                                <div className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
                                    <div className="text-md font-semibold">v1.0.3</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-800" />
                </li>
                <li className="mb-10">
                    <div className="flex flex-wrap items-center justify-center gap-20">
                        <div className="grow basis-full md:basis-1/3">
                            <h3 className="mb-4 text-xl font-medium text-white">
                                Select items to focus on from categorized changelog
                            </h3>
                            <p className="mb-2 text-gray-400">
                                All changelog items across releases will automatically be grouped
                                under their respective categories.
                            </p>
                            <ul className="text-gray-400">
                                <li>
                                    <span className="mr-2 inline-block text-white">&#9633;</span>{" "}
                                    Select important line items and click on{" "}
                                    <span className="rounded-md bg-green-600 px-2 py-1 text-xs font-semibold text-white">
                                        FOCUS
                                    </span>{" "}
                                    to view only those items
                                </li>
                                <li>
                                    <span className="mr-2 inline-block font-thin text-white">
                                        &#10005;
                                    </span>{" "}
                                    Remove irrelevant categories (for e.g. Documentation)
                                </li>
                                <li>
                                    <svg
                                        className="mr-1 inline-block h-4 w-4 text-white"
                                        viewBox="0 0 50 50"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z" />
                                    </svg>{" "}
                                    Fuzzy search through line items
                                </li>
                                <li>
                                    <svg
                                        className="mr-1 inline-block h-4 w-4 text-white"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M13.2218 3.32234C15.3697 1.17445 18.8521 1.17445 21 3.32234C23.1479 5.47022 23.1479 8.95263 21 11.1005L17.4645 14.636C15.3166 16.7839 11.8342 16.7839 9.6863 14.636C9.48752 14.4373 9.30713 14.2271 9.14514 14.0075C8.90318 13.6796 8.97098 13.2301 9.25914 12.9419C9.73221 12.4688 10.5662 12.6561 11.0245 13.1435C11.0494 13.1699 11.0747 13.196 11.1005 13.2218C12.4673 14.5887 14.6834 14.5887 16.0503 13.2218L19.5858 9.6863C20.9526 8.31947 20.9526 6.10339 19.5858 4.73655C18.219 3.36972 16.0029 3.36972 14.636 4.73655L13.5754 5.79721C13.1849 6.18774 12.5517 6.18774 12.1612 5.79721C11.7706 5.40669 11.7706 4.77352 12.1612 4.383L13.2218 3.32234Z" />
                                        <path d="M6.85787 9.6863C8.90184 7.64233 12.2261 7.60094 14.3494 9.42268C14.7319 9.75083 14.7008 10.3287 14.3444 10.685C13.9253 11.1041 13.2317 11.0404 12.7416 10.707C11.398 9.79292 9.48593 9.88667 8.27209 11.1005L4.73655 14.636C3.36972 16.0029 3.36972 18.219 4.73655 19.5858C6.10339 20.9526 8.31947 20.9526 9.6863 19.5858L10.747 18.5251C11.1375 18.1346 11.7706 18.1346 12.1612 18.5251C12.5517 18.9157 12.5517 19.5488 12.1612 19.9394L11.1005 21C8.95263 23.1479 5.47022 23.1479 3.32234 21C1.17445 18.8521 1.17445 15.3697 3.32234 13.2218L6.85787 9.6863Z" />
                                    </svg>{" "}
                                    Share focused changelog
                                </li>
                            </ul>
                            <p></p>
                        </div>
                        <div className="basis-full md:basis-1/2">
                            <div className="illustration-bg relative w-full px-8 py-6">
                                <div className="w-full bg-gray-950 p-4" ref={animationRef}>
                                    <button
                                        type="button"
                                        disabled
                                        className="ml-auto block w-auto rounded-md bg-green-600 px-2 py-1 text-center text-[0.5rem] font-bold text-white shadow-md shadow-green-600/50 focus:ring-green-400"
                                    >
                                        FOCUS
                                    </button>
                                    <p className="font-semibold">Features</p>
                                    <div className="mb-1 h-4 w-full rounded border border-green-600 bg-white p-2.5 text-gray-300 dark:bg-gray-900 dark:text-gray-400"></div>
                                    <div className="mb-1 h-4 w-full rounded border border-green-600 bg-white p-2.5 text-gray-300 dark:bg-gray-900 dark:text-gray-400"></div>
                                    <div className="mb-1 h-4 w-full rounded bg-white p-2.5 text-gray-300 dark:bg-gray-900 dark:text-gray-400"></div>
                                    <div className="mb-1 h-4 w-full rounded bg-white p-2.5 text-gray-300 dark:bg-gray-900 dark:text-gray-400"></div>
                                    <p className="mt-4 font-semibold">Fixes</p>
                                    <div className="mb-1 h-4 w-full rounded bg-white p-2.5 text-gray-300 dark:bg-gray-900 dark:text-gray-400"></div>
                                    <div className="mb-1 h-4 w-full rounded border border-green-600 bg-white p-2.5 text-gray-300 dark:bg-gray-900 dark:text-gray-400"></div>
                                    <div className="mb-1 h-4 w-full rounded bg-white p-2.5 text-gray-300 dark:bg-gray-900 dark:text-gray-400"></div>
                                    <div className="mb-1 h-4 w-full rounded bg-white p-2.5 text-gray-300 dark:bg-gray-900 dark:text-gray-400"></div>
                                    <div className="mb-1 h-4 w-full rounded bg-white p-2.5 text-gray-300 dark:bg-gray-900 dark:text-gray-400"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </article>
    );
};
