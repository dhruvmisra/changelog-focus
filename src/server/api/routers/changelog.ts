import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import puppeteer from "puppeteer";
import TurndownService from "turndown";
import { Release } from "@/types";

const scrapeReleasesFromPage = async (url: string) => {
    const releases: Release[] = [];

    const turndownService = new TurndownService();
    const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: "domcontentloaded",
    });

    // Get page data
    const headingsFollowedByLists = await page.evaluate(() => {
        function isSemanticVersion(text: string): boolean {
            // Regular expression to check if the text matches a semantic version pattern (e.g., 1.0.0)
            const semanticVersionPattern = /\d+\.\d+\.\d+/;
            return semanticVersionPattern.test(text);
        }

        function getHeadingLevel(heading: Element): number {
            const tagName = heading.tagName.toLowerCase();
            return parseInt(tagName.charAt(1));
        }

        function getSiblingsUntilNextVersionHeading(heading: Element) {
            const siblings = [];
            let currentElement = heading.nextElementSibling;
            const headingLevel = getHeadingLevel(heading);

            while (currentElement) {
                const tagName = currentElement.tagName.toLowerCase();
                if (tagName.startsWith("h")) {
                    const currentHeadingLevel = getHeadingLevel(currentElement);

                    if (currentHeadingLevel <= headingLevel) {
                        // If the current element is a heading with the same level or a lower level, stop traversing
                        break;
                    }
                }

                siblings.push(currentElement.outerHTML);
                currentElement = currentElement.nextElementSibling;
            }

            return siblings.join("\n");
        }

        function findSemanticVersionHeadingsAndSiblings() {
            const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
            const result: {
                [Key: string]: string;
            } = {};

            for (const heading of headings) {
                const headingText = heading.textContent!.trim();

                if (isSemanticVersion(headingText)) {
                    result[headingText] = getSiblingsUntilNextVersionHeading(heading);
                }
            }

            return result;
        }

        // Usage
        const semanticVersionHeadingsAndSiblings = findSemanticVersionHeadingsAndSiblings();
        return semanticVersionHeadingsAndSiblings;
    });

    for (const [heading, content] of Object.entries(headingsFollowedByLists)) {
        const markdown =
            turndownService.turndown(heading) + "\n" + turndownService.turndown(content);
        const release: Release = {
            id: Math.floor(Math.random() * 10000000000000000),
            name: heading,
            body: markdown,
            url: url,
            prerelease: false,
            draft: false,
            created_at: "",
        };
        releases.push(release);
    }
    return releases;
};

export const changelogRouter = createTRPCRouter({
    getScrapedReleases: publicProcedure
        .input(z.object({ link: z.string().url() }))
        .query(async ({ input }) => {
            let releases = [];
            try {
                releases = await scrapeReleasesFromPage(input.link);
            } catch (error) {
                console.log(error)
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "An error occurred while scraping the changelog.",
                });
            }
            return releases;
        }),
});
