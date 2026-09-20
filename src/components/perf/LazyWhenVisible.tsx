import { lazy, Suspense, type ComponentType, type ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type LazyWhenVisibleProps = {
  children: ReactNode;
  /** Approximate height reserved before mount (reduces CLS). */
  minHeight?: number | string;
  rootMargin?: string;
  className?: string;
};

/** Mount children only when near the viewport — keeps above-the-fold JS lean. */
export function LazyWhenVisible({
  children,
  minHeight = 480,
  rootMargin = "200px 0px",
  className,
}: LazyWhenVisibleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      className={className}
      style={show ? undefined : { minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight }}
    >
      {show ? children : null}
    </div>
  );
}

export function lazyNamed<T extends ComponentType<unknown>>(factory: () => Promise<{ default: T }>) {
  return lazy(factory);
}

export function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center bg-obsidian text-white/40" aria-hidden>
      <span className="font-mono text-[0.7rem] uppercase tracking-widest">Loading…</span>
    </div>
  );
}

export function withSuspense(node: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{node}</Suspense>;
}
