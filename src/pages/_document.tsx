import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/utils/gtag";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {/* Conditionally render script only if in production */}
                {process.env.NODE_ENV === "production" && (
                    <>
                        <Script
                            id={GA_MEASUREMENT_ID}
                            strategy="afterInteractive"
                            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                        />
                        <Script
                            id={GA_MEASUREMENT_ID}
                            strategy="afterInteractive"
                            dangerouslySetInnerHTML={{
                                __html: `
                                    window.dataLayer = window.dataLayer || [];
                                    function gtag(){dataLayer.push(arguments);}
                                    gtag('js', new Date());
                                    gtag('config', '${GA_MEASUREMENT_ID}', {
                                    page_path: window.location.pathname,
                                    });
                                `,
                            }}
                        />
                    </>
                )}
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
