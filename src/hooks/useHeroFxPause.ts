import { useEffect, useRef } from "react";

/**
 * Pauses expensive hero decorative CSS animations when the hero is off-screen
 * or the tab is hidden — same visuals, less main-thread / GPU work while scrolling.
 */
export function useHeroFxPause<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const sync = (inView: boolean) => {
      const paused = !inView || document.visibilityState === "hidden";
      el.classList.toggle("hero-fx-paused", paused);
    };

    let inView = true;
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              inView = entry.isIntersecting;
              sync(inView);
            },
            { rootMargin: "80px 0px", threshold: 0.01 },
          )
        : null;

    io?.observe(el);

    const onVis = () => sync(inView);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return ref;
}
