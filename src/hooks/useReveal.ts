import { useEffect } from "react";

/** Adds `.in` to all `.reveal` elements when scrolled into view. */
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    if (!els.length) return;

    const showAll = () => {
      els.forEach((el) => el.classList.add("in"));
    };

    if (typeof IntersectionObserver === "undefined") {
      showAll();
      return;
    }

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
    els.forEach((el) => obs.observe(el));

    // Fallback: never leave sections invisible if IO does not fire (layout/embed edge cases).
    const fallback = window.setTimeout(showAll, 2500);

    return () => {
      window.clearTimeout(fallback);
      obs.disconnect();
    };
  }, []);
}
