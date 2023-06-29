import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars.
     */
    server: {
        NODE_ENV: z.enum(["development", "test", "production"]),
        // GITHUB_BASE_URL: z.string().url().default("https://api.github.com"),
    },

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars. To expose them to the client, prefix them with
     * `NEXT_PUBLIC_`.
     */
    client: {
        NEXT_PUBLIC_PRE_RELEASE: z.string(),
        NEXT_PUBLIC_GITHUB_BASE_URL: z.string().url().default("https://api.github.com"),
        NEXT_PUBLIC_MEASUREMENT_ID: z.string(),
    },

    /**
     * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
     * middlewares) or client-side so we need to destruct manually.
     */
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_PRE_RELEASE: process.env.NEXT_PUBLIC_PRE_RELEASE,
        NEXT_PUBLIC_GITHUB_BASE_URL: process.env.NEXT_PUBLIC_GITHUB_BASE_URL,
        NEXT_PUBLIC_MEASUREMENT_ID: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
    },
});
