export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_MEASUREMENT_ID as string;

/**
 * This function is used to track page views.
 * https://developers.google.com/analytics/devguides/collection/gtagjs/pages
 * */
export const pageView = (url: URL) => {
    window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: url,
    });
};

/**
 * https://developers.google.com/analytics/devguides/collection/gtagjs/events
 * If you want to track events, you can use the gtag.js event method.
 * */
export const event = (
    action: Gtag.EventNames,
    { event_category, event_label, value }: Gtag.EventParams
) => {
    window.gtag("event", action, {
        event_category,
        event_label,
        value,
    });
};
