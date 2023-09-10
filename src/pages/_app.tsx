import { type AppType } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { Toaster } from "react-hot-toast";
import { DefaultSeo } from "next-seo";
import NProgress from "nprogress";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api } from "@/utils/api";
import * as gtag from "@/utils/gtag";
import { DEFAULT_SEO } from "@/utils/seo";

import "@/styles/globals.css";
import "@/styles//nprogress.css";

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
        <div className="container mx-auto min-h-screen px-4 flex flex-col">
            <DefaultSeo {...DEFAULT_SEO} />
            <Header />
            <Toaster position="bottom-center" />
            <Component {...pageProps} />
            <Footer />
        </div>
    );
};

export default api.withTRPC(MyApp);
