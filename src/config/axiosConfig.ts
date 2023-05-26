import axios, { AxiosInstance } from "axios";

/* ///////////////////////////////////////////////// */
/* INSTANCE SETUPS ///////////////////////////////// */
/* ///////////////////////////////////////////////// */

const GithubAxiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.GITHUB_BASE_URL,
});

export { GithubAxiosInstance };
