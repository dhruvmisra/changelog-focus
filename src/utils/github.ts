import { GithubAxiosInstance } from "@/config/axiosConfig";
import { GITHUB_RELEASES } from "@/config/endpoints";

export type Release = {
    id: number;
    name: string;
    body: string;
    url: string;
    prerelease: true;
    draft: true;
    created_at: string;
};

export const GitHub = {
    getReleases: async (owner: string, repo: string, limit: number = 10): Promise<Release[]> => {
        const response = await GithubAxiosInstance.get<Release[]>(
            `${GITHUB_RELEASES(owner, repo)}?per_page=${limit}`
        );
        return response.data;
    },
};
