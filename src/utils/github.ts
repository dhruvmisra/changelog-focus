import { GithubAxiosInstance } from "@/config/axiosConfig";
import { GITHUB_RELEASES } from "@/constants/endpoints";
import type { Release } from "@/types";

export const GitHub = {
    getReleases: async (owner: string, repo: string, limit = 10): Promise<Release[]> => {
        const response = await GithubAxiosInstance.get<Release[]>(
            `${GITHUB_RELEASES(owner, repo)}?per_page=${limit}`
        );
        return response.data;
    },
};
