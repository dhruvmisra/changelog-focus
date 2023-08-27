import { type AppType } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { Toaster } from "react-hot-toast";
import NProgress from "nprogress";
import { api } from "@/utils/api";
import * as gtag from "@/utils/gtag";

import "@/styles/globals.css";
import "@/styles//nprogress.css";
import { Header } from "@/components/Header";

const MyApp: AppType = ({ Component, pageProps }) => {
    const router = useRouter();

    useEffect(() => {
        NProgress.configure({ showSpinner: false });
    }, []);

    useEffect(() => {
        const handleRouteChange = (url: URL, { shallow }: { shallow: boolean }) => {
            if (process.env.NODE_ENV !== "production") {
                return;
            }
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
        <div className="container mx-auto min-h-screen px-2 sm:px-4">
            <Header />
            <Toaster position="bottom-center" />
            <Component {...pageProps} />
        </div>
    );
};

export default api.withTRPC(MyApp);
