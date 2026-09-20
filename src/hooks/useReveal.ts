import { useEffect } from "react";

/** Adds `.in` to `.reveal` elements when scrolled into view (including lazy-mounted sections). */
export function useReveal() {
  useEffect(() => {
    const show = (el: Element) => el.classList.add("in");

    if (typeof IntersectionObserver === "undefined") {
      document.querySelectorAll(".reveal").forEach(show);
      return;
    }

    const seen = new WeakSet<Element>();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    const watch = (root: ParentNode = document) => {
      root.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        if (seen.has(el) || el.classList.contains("in")) return;
        seen.add(el);
        obs.observe(el);
      });
    };

    watch();

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          const el = node as HTMLElement;
          if (el.classList?.contains("reveal")) {
            if (!seen.has(el) && !el.classList.contains("in")) {
              seen.add(el);
              obs.observe(el);
            }
          }
          if (el.querySelectorAll) watch(el);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const fallback = window.setTimeout(() => {
      document.querySelectorAll(".reveal:not(.in)").forEach(show);
    }, 4000);

    return () => {
      window.clearTimeout(fallback);
      mo.disconnect();
      obs.disconnect();
    };
  }, []);
}
