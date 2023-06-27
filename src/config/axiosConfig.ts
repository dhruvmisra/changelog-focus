import axios, { type AxiosInstance } from "axios";

/* ///////////////////////////////////////////////// */
/* INSTANCE SETUPS ///////////////////////////////// */
/* ///////////////////////////////////////////////// */

const GithubAxiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_GITHUB_BASE_URL,
});

export { GithubAxiosInstance };
