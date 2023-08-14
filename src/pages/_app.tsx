import { type AppType } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { Toaster } from "react-hot-toast";
import NProgress from "nprogress";
import { api } from "@/utils/api";
import * as gtag from "@/utils/gtag";

import "@/styles/globals.css";
import "@/styles//nprogress.css";

const MyApp: AppType = ({ Component, pageProps }) => {
    const router = useRouter();

    useEffect(() => {
        NProgress.configure({ showSpinner: false });
    }, []);

    useEffect(() => {
        const handleRouteChange = (url: URL, { shallow }: { shallow: boolean }) => {
            if (!shallow) {
                gtag.pageView(url);
            }
        };
        router.events.on("routeChangeComplete", handleRouteChange);
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, [router.events]);

    return (
        <>
            <Toaster position="bottom-center" />
            <Component {...pageProps} />
        </>
    );
};

export default api.withTRPC(MyApp);
