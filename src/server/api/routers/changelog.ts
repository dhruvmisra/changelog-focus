import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { GitHub } from "@/utils/github";

const GITHUB_BASE_URL = "github.com";

export const changelogRouter = createTRPCRouter({
    getReleases: publicProcedure
        .input(z.object({ repositoryLink: z.string().url() }))
        .query(async ({ input }) => {
            const splitUrl = input.repositoryLink.split(GITHUB_BASE_URL);
            if (splitUrl.length < 2) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Not a GitHub URL",
                });
            }

            const path = splitUrl[1]!;
            const splitPath = path.split("/");
            if (splitPath.length < 3) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Not a valid GitHub URL",
                });
            }
            const owner = splitPath[1]!;
            const repo = splitPath[2]!;

            const releases = await GitHub.getReleases(owner, repo, 5);

            return releases;
        }),
});
