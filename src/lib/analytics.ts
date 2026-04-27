export const GA_MEASUREMENT_ID = "G-KNCRXRJ85Q";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean | null | undefined>;

const hasGtag = () => typeof window !== "undefined" && typeof window.gtag === "function";

export const trackPageView = (path?: string) => {
  if (!hasGtag()) return;
  window.gtag!("event", "page_view", {
    page_path: path ?? `${window.location.pathname}${window.location.search}`,
    page_location: window.location.href,
    page_title: document.title,
  });
};

export const trackEvent = (eventName: string, params: EventParams = {}) => {
  if (!hasGtag()) return;
  window.gtag!("event", eventName, params);
};

export const trackConversion = (eventName: string, params: EventParams = {}) => {
  trackEvent(eventName, {
    conversion: true,
    ...params,
  });
};
