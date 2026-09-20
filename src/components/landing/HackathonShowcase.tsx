import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Sparkles, Trophy } from "lucide-react";
import { HACKATHON_EVENT, HACKATHON_SLIDES } from "@/lib/hackathon-gallery";

const AUTO_MS = 5500;

const HackathonShowcase = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [autoplayReady, setAutoplayReady] = useState(false);
  const total = HACKATHON_SLIDES.length;

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + total) % total);
    },
    [total],
  );

  useEffect(() => {
    const section = document.getElementById("hackathon");
    if (!section || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "80px 0px", threshold: 0.12 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // Delay autoplay so hard-refresh / PSI don't cycle through every full image.
  useEffect(() => {
    if (!inView) {
      setAutoplayReady(false);
      return;
    }
    const id = window.setTimeout(() => setAutoplayReady(true), 4000);
    return () => window.clearTimeout(id);
  }, [inView]);

  useEffect(() => {
    if (paused || !inView || !autoplayReady || total <= 1) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const id = window.setInterval(() => go(1), AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, inView, autoplayReady, go, total]);

  const slide = HACKATHON_SLIDES[index];

  return (
    <section
      id="hackathon"
      className="section-x perf-cv relative overflow-hidden border-t border-border bg-obsidian py-14 md:py-20"
      aria-labelledby="hackathon-heading"
    >
      <div
        className="pointer-events-none absolute -right-24 top-0 h-[420px] w-[420px] rounded-full opacity-80"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary-glow) / 0.14), transparent 68%)",
        }}
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-0 h-[360px] w-[360px] rounded-full opacity-70"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.1), transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 reveal lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-14">
        <div className="min-w-0">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-glow/25 bg-primary-glow/[0.08] px-3 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary-glow" aria-hidden />
            <span className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-primary-glow">
              On the ground · Malaysia
            </span>
          </div>

          <div className="eyebrow mb-3 text-primary-glow">Community &amp; competition</div>
          <h2 id="hackathon-heading" className="display mb-4 text-balance text-white">
            <span className="block">{HACKATHON_EVENT.name}</span>
            <em className="not-italic italic text-primary-glow">{HACKATHON_EVENT.chapter}</em>
          </h2>

          <p className="body-prose mb-6 max-w-lg text-[0.96rem] text-white/50">
            Nexperts was at the heart of Malaysia&apos;s AI builder community for the grand finale in{" "}
            <span className="font-medium text-white/75">{HACKATHON_EVENT.location}</span> — teams shipping
            real agentic systems, mentors on the floor, and the energy of a global hackathon now in KL.
          </p>

          <ul className="mb-6 flex flex-col gap-2.5 text-sm text-white/55">
            <li className="flex items-start gap-2.5">
              <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-amber-300/90" aria-hidden />
              <span>
                <strong className="font-medium text-white/80">Global AI Hackathon 2026</strong> — international
                programme, local grand finale.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow/90" aria-hidden />
              <span>
                <strong className="font-medium text-white/80">{HACKATHON_EVENT.location}</strong> ·{" "}
                {HACKATHON_EVENT.when}
              </span>
            </li>
          </ul>

          <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-white/30">
            {total} moments from the floor · swipe or use arrows
          </p>
        </div>

        <div
          className="min-w-0"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="hackathon-stage relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.65)] ring-1 ring-primary-glow/15 md:rounded-3xl">
            <div className="relative aspect-[16/10] w-full sm:aspect-[5/3]">
              {inView ? (
                <img
                  key={slide.src}
                  src={slide.src}
                  alt={slide.alt}
                  width={1100}
                  height={700}
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority="low"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" aria-hidden />
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/25 to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-obsidian/50 via-transparent to-transparent" />

              <div className="absolute left-3 top-3 flex flex-wrap gap-2 sm:left-4 sm:top-4">
                <span className="rounded-md border border-amber-400/35 bg-amber-500/15 px-2 py-1 font-mono text-[0.5rem] font-bold uppercase tracking-wider text-amber-100 sm:text-[0.52rem]">
                  Grand finale
                </span>
                <span className="rounded-md border border-white/15 bg-black/35 px-2 py-1 font-mono text-[0.5rem] font-semibold uppercase tracking-wider text-white/80 sm:text-[0.52rem]">
                  {HACKATHON_EVENT.when}
                </span>
              </div>

              <div className="absolute bottom-0 inset-x-0 px-4 pb-4 pt-16 sm:px-5 sm:pb-5">
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-primary-glow/90">
                  {HACKATHON_EVENT.location}
                </p>
                <p className="font-display text-lg font-light text-white sm:text-xl">
                  {HACKATHON_EVENT.name}
                </p>
              </div>

              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/90 backdrop-blur-md transition hover:border-primary-glow/40 hover:bg-black/70 sm:left-3 sm:h-10 sm:w-10"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/90 backdrop-blur-md transition hover:border-primary-glow/40 hover:bg-black/70 sm:right-3 sm:h-10 sm:w-10"
                aria-label="Next photo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-white/[0.03] px-3 py-3 sm:px-4">
              <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {HACKATHON_SLIDES.map((s, i) => (
                  <button
                    key={s.src}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`relative h-11 w-14 shrink-0 overflow-hidden rounded-md border transition sm:h-12 sm:w-[4.25rem] ${
                      i === index
                        ? "border-primary-glow/60 ring-2 ring-primary-glow/35"
                        : "border-white/10 opacity-65 hover:border-white/25 hover:opacity-100"
                    }`}
                    aria-label={`Show photo ${i + 1} of ${total}`}
                    aria-current={i === index ? "true" : undefined}
                  >
                    {/* Tiny thumbs only — mount after section is visible so hard-refresh stays light */}
                    {inView ? (
                      <img
                        src={s.thumb}
                        alt=""
                        width={160}
                        height={100}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span className="block h-full w-full bg-white/5" aria-hidden />
                    )}
                  </button>
                ))}
              </div>
              <span className="shrink-0 font-mono text-[0.62rem] tabular-nums tracking-wider text-white/45">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HackathonShowcase;
