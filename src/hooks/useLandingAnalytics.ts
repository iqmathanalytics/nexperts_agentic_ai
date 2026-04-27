import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

const SCROLL_MILESTONES = [25, 50, 75, 90];

const ctaLabelFromElement = (element: Element | null) => {
  if (!element) return null;
  const target = element.closest("a,button");
  if (!target) return null;

  const text = target.textContent?.trim().replace(/\s+/g, " ") ?? "";
  if (!text) return null;

  const lowered = text.toLowerCase();
  const ctaKeywords = ["reserve", "enquire", "whatsapp", "stripe", "checkout", "seat", "send my enquiry"];
  if (!ctaKeywords.some((keyword) => lowered.includes(keyword))) return null;

  return text;
};

export const useLandingAnalytics = () => {
  useEffect(() => {
    const fired = new Set<number>();
    const pageStartMs = Date.now();
    let maxDepth = 0;
    let timeOnPageSent = false;

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const totalScrollable = doc.scrollHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const depth = Math.min(100, Math.round((scrollTop / totalScrollable) * 100));
      if (depth > maxDepth) maxDepth = depth;

      SCROLL_MILESTONES.forEach((milestone) => {
        if (depth >= milestone && !fired.has(milestone)) {
          fired.add(milestone);
          trackEvent("scroll_depth", {
            page: "landing",
            percent: milestone,
          });
        }
      });
    };

    const onClick = (event: MouseEvent) => {
      const label = ctaLabelFromElement(event.target as Element | null);
      if (!label) return;

      trackEvent("cta_click", {
        page: "landing",
        label,
      });
    };

    const trackTimeOnPage = (reason: "visibility_hidden" | "pagehide" | "beforeunload") => {
      if (timeOnPageSent) return;
      timeOnPageSent = true;
      const seconds = Math.max(1, Math.round((Date.now() - pageStartMs) / 1000));
      trackEvent("time_on_page", {
        page: "landing",
        seconds,
        max_scroll_depth: maxDepth,
        reason,
      });
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        trackTimeOnPage("visibility_hidden");
      }
    };

    const onPageHide = () => trackTimeOnPage("pagehide");
    const onBeforeUnload = () => trackTimeOnPage("beforeunload");

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);
};
