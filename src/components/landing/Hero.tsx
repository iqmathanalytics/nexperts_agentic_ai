import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Building2,
  Calendar,
  CheckCircle2,
  Layers,
  Network,
  Sparkles,
  Workflow,
} from "lucide-react";
import {
  AGENTIC_COHORT,
  AGENTIC_COHORT_SCHEDULE_LINE,
  AGENTIC_COURSE_PRICE,
  COHORT_SCHEDULE,
  COHORT_SEATS,
  FULL_COHORT,
  NEXT_COHORT,
} from "@/lib/agentic-cohort";
import { WHATSAPP_HREF } from "@/lib/whatsapp";
import HeroSocialLinks from "@/components/landing/HeroSocialLinks";
import { useHeroFxPause } from "@/hooks/useHeroFxPause";

const CourseCheckout = lazy(() => import("@/components/landing/CourseCheckout"));

const PIPELINE = [
  { icon: Layers, label: "Python & LLMs", sub: "Foundations" },
  { icon: Network, label: "RAG Systems", sub: "Retrieval" },
  { icon: Workflow, label: "Multi-Agents", sub: "LangGraph" },
  { icon: Bot, label: "Deploy Live", sub: "Production" },
] as const;

const Hero = () => {
  const sectionRef = useHeroFxPause<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="top"
      className="hero-section relative flex w-full items-start overflow-clip bg-obsidian px-5 pb-12 pt-20 sm:px-8 sm:pb-14 sm:pt-24 lg:min-h-[calc(100svh-0.5rem)] lg:items-center lg:px-10 lg:pb-16 lg:pt-28 xl:px-12 2xl:px-16"
    >
      <div className="absolute inset-0 grid-bg hero-grid hero-section__bg opacity-90" aria-hidden />
      <div className="absolute inset-0 hero-aurora hero-section__bg opacity-80" aria-hidden />
      <div className="absolute inset-0 hero-scanlines hero-section__bg opacity-40" aria-hidden />
      <div
        className="absolute -top-40 -right-20 w-[520px] h-[520px] rounded-full pointer-events-none hero-orb hero-orb-a hero-section__bg"
        style={{ background: "radial-gradient(circle, hsl(var(--primary-glow) / 0.16), transparent 65%)" }}
        aria-hidden
      />
      <div
        className="absolute -bottom-28 -left-16 w-[420px] h-[420px] rounded-full pointer-events-none hero-orb hero-orb-b hero-section__bg"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.12), transparent 65%)" }}
        aria-hidden
      />
      <div className="hero-bottom-fade hero-section__bg" aria-hidden />

      <div className="hero-section__content relative z-10 mx-auto grid w-full max-w-[90rem] grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center lg:gap-12 xl:gap-14">
        {/* ── Left: story + actions ── */}
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-5">
            <div
              className="inline-flex min-w-0 max-w-full animate-fade-up items-center gap-2 rounded-full border px-3 py-1.5"
              style={{ background: "hsl(var(--primary-glow) / 0.1)", borderColor: "hsl(var(--primary-glow) / 0.25)" }}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-glow animate-pulse-dot" />
              <span className="min-w-0 text-balance font-mono text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-primary-glow sm:text-[0.62rem] sm:tracking-[0.14em]">
                Founding Cohort · Malaysia · 2026
              </span>
            </div>
            <a
              href="/Vibe%20coding.html"
              className="vibe-banner group inline-flex min-h-[40px] max-w-full items-center gap-2 rounded-lg px-3 py-2 animate-fade-up sm:min-h-[44px]"
              style={{ animationDelay: ".06s" }}
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#fde68a]" />
              <span className="min-w-0 truncate font-mono text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-[#fff7d4] sm:text-[0.62rem]">
                Vibe Coding Masterclass
              </span>
              <span className="vibe-banner__cta inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[0.52rem] font-semibold uppercase tracking-[0.12em] text-[#1f1300]">
                Explore
              </span>
            </a>
            <Link
              to="/generative-ai-corporate"
              className="corporate-banner group inline-flex min-h-[40px] max-w-full items-center gap-2 rounded-lg px-3 py-2 animate-fade-up sm:min-h-[44px]"
              style={{ animationDelay: ".09s" }}
            >
              <Building2 className="h-3.5 w-3.5 shrink-0 text-[#a5f3fc]" />
              <span className="min-w-0 truncate font-mono text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-[#ecfeff] sm:text-[0.62rem]">
                Corporate Gen AI
              </span>
              <span className="corporate-banner__cta inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[0.52rem] font-semibold uppercase tracking-[0.12em] text-[#042f2e]">
                Explore
              </span>
            </Link>
          </div>

          <h1
            className="display-xl mb-4 max-w-[18ch] text-balance text-pretty text-white animate-fade-up sm:mb-5"
            style={{ animationDelay: ".1s" }}
          >
            Professional Agentic AI Engineering{" "}
            <span className="font-semibold text-primary-glow">Course in Malaysia</span>
          </h1>

          <p
            className="mb-5 max-w-xl text-pretty text-[0.95rem] font-light leading-[1.75] text-white/45 sm:mb-6 md:text-base animate-fade-up"
            style={{ animationDelay: ".18s" }}
          >
            Live instructor-led training from Python basics to production multi-agent systems — 20 intensive sessions,
            portfolio-ready builds.
          </p>

          <div className="mb-5 animate-fade-up sm:mb-6" style={{ animationDelay: ".22s" }}>
            <a
              href="/demo"
              className="group relative inline-flex min-h-[48px] w-full max-w-sm items-center justify-center overflow-hidden rounded-xl border border-primary-glow/45 bg-gradient-to-r from-primary-glow via-success to-[#fde68a] px-5 py-3 text-center font-mono text-[0.68rem] font-black uppercase tracking-[0.14em] text-obsidian shadow-[0_0_28px_-8px_hsl(var(--primary-glow)/0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_-6px_hsl(var(--primary-glow)/0.95)] sm:w-auto sm:px-6"
              aria-label="Run the live Agentic AI demo"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative inline-flex items-center gap-2">
                <Bot className="h-3.5 w-3.5 shrink-0" />
                Run Live Agentic AI Demo
                <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          </div>

          <div className="mb-6 flex flex-wrap gap-1.5 animate-fade-up sm:mb-7" style={{ animationDelay: ".28s" }}>
            <span className="pill-hl">20 Live Sessions</span>
            <span className="pill-hl">80 Hours</span>
            <span className="pill-hl">{AGENTIC_COHORT.weeksLabel}</span>
            <span className="pill-hl">{AGENTIC_COHORT.daysPill}</span>
            <span className="pill-hl">{AGENTIC_COHORT.time}</span>
            <span className="pill">Live Online · Teams</span>
            <span className="pill">Certificate</span>
          </div>

          <div
            className="flex flex-col flex-wrap items-stretch gap-2.5 animate-fade-up sm:flex-row sm:items-center"
            style={{ animationDelay: ".34s" }}
          >
            <Suspense
              fallback={
                <span className="inline-flex min-h-[44px] items-center justify-center rounded-sm border border-primary-glow/30 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-primary-glow/70">
                  Reserve Your Seat
                </span>
              }
            >
              <CourseCheckout />
            </Suspense>
            <a
              href="#enquire"
              className="cta-medium group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-success px-5 py-3 text-xs font-semibold uppercase tracking-wider text-obsidian transition-all hover:bg-success/90 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-4px_hsl(var(--success)/0.5)] sm:min-h-0 sm:px-6"
            >
              Enquire Now
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener"
              className="cta-medium inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-whatsapp/30 px-5 py-3 text-xs font-medium uppercase tracking-wider text-whatsapp transition-colors hover:bg-whatsapp/10 sm:min-h-0 sm:px-6"
            >
              <svg viewBox="0 0 32 32" className="h-3.5 w-3.5 fill-current" aria-hidden>
                <path d="M16 3.2c-7 0-12.8 5.6-12.8 12.6 0 2.2.6 4.3 1.7 6.1L3 28.8l7.1-1.9c1.8 1 3.8 1.5 5.9 1.5 7 0 12.8-5.6 12.8-12.6S23 3.2 16 3.2zm0 22.9c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.2 1.1 1.1-4.1-.3-.4c-1.1-1.6-1.6-3.4-1.6-5.3 0-5.9 4.9-10.8 10.9-10.8S26.9 9.8 26.9 15.7 22 26.1 16 26.1zm5.9-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.3-.7.1c-.3-.2-1.4-.5-2.6-1.7-1-1-1.7-2.1-1.9-2.4-.2-.3 0-.5.2-.7.2-.2.3-.4.5-.6.2-.2.2-.4.3-.6.1-.2 0-.5 0-.6s-.7-1.7-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1-1.1 2.4s1.1 2.8 1.3 3c.2.2 2.2 3.4 5.2 4.7.7.3 1.3.5 1.8.6.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.6.3-.8.3-1.5.2-1.6 0-.1-.2-.2-.5-.4z" />
              </svg>
              WhatsApp Us
            </a>
          </div>

          <HeroSocialLinks className="mt-5 animate-fade-up sm:mt-6" style={{ animationDelay: ".4s" }} />
        </div>

        {/* ── Right: enrolment + journey panel (replaces globe) ── */}
        <aside
          className="hero-enrol-panel relative min-w-0 animate-fade-up"
          style={{ animationDelay: ".2s" }}
          aria-label={`${FULL_COHORT.label} full. ${NEXT_COHORT.label} ${NEXT_COHORT.dateRange}. ${COHORT_SEATS.highlight}. ${AGENTIC_COHORT_SCHEDULE_LINE}`}
        >
          <div className="hero-enrol-panel__glow" aria-hidden />

          <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-b from-white/[0.07] to-white/[0.02] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.75)] backdrop-blur-sm">
            {/* Unified intake story — one flow, not two boxes */}
            <div className="relative border-b border-white/[0.08] px-5 py-5 sm:px-6 sm:py-6">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.14),transparent_55%)]"
                aria-hidden
              />

              <div className="relative">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[0.65rem] tracking-wide text-white/40">
                    <span className="line-through decoration-white/35">
                      {FULL_COHORT.label} · {FULL_COHORT.dateRangeShort}
                    </span>
                    <span className="rounded-full bg-red-500/20 px-1.5 py-px text-[0.58rem] font-bold uppercase tracking-wider text-red-200/90">
                      {FULL_COHORT.statusLabel}
                    </span>
                  </span>
                  <span className="font-mono text-[0.7rem] text-white/25" aria-hidden>
                    →
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/15 px-2.5 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-amber-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300 animate-pulse-dot" />
                    Now enrolling
                  </span>
                </div>

                <div
                  className="seats-bump-tab mb-4 inline-flex max-w-full items-center gap-2 rounded-md border border-success/45 bg-gradient-to-r from-success/25 via-success/15 to-amber-400/20 px-3 py-2 shadow-[0_0_22px_-6px_hsl(var(--success)/0.75)]"
                  role="status"
                >
                  <span className="seats-bump-tab__dot h-2 w-2 shrink-0 rounded-full bg-success" aria-hidden />
                  <span className="font-mono text-[0.72rem] font-black uppercase tracking-[0.14em] text-success sm:text-[0.78rem]">
                    {COHORT_SEATS.highlight}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/35 bg-gradient-to-br from-amber-500/25 to-amber-700/10 text-amber-200 shadow-[0_0_24px_-6px_rgba(251,191,36,0.55)]">
                    <Calendar className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-amber-200/90">
                      {NEXT_COHORT.label}
                    </p>
                    <p className="mt-1 font-display text-3xl font-semibold leading-none tracking-tight text-[#fde68a] sm:text-4xl">
                      {NEXT_COHORT.startDate}
                    </p>
                    <p className="mt-2 text-[0.95rem] font-light text-amber-50/75">
                      {NEXT_COHORT.dateRange}
                    </p>
                    <p className="mt-1.5 font-mono text-[0.72rem] font-medium uppercase tracking-[0.08em] text-amber-100/65">
                      {AGENTIC_COHORT_SCHEDULE_LINE} · {COHORT_SCHEDULE.delivery}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="border-b border-white/[0.08] px-5 py-5 sm:px-6 sm:py-6">
              <p className="mb-2 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-primary-glow/90">
                Limited founding offer
              </p>
              <p className="mb-1.5 font-mono text-[0.8rem] text-white/30 line-through">
                Market value {AGENTIC_COURSE_PRICE.marketValueDisplay}
              </p>
              <div className="mb-3 flex flex-wrap items-end gap-3">
                <span className="whitespace-nowrap font-display text-5xl font-semibold leading-none text-success sm:text-6xl">
                  {AGENTIC_COURSE_PRICE.display}
                </span>
                <span className="pb-1 font-mono text-[0.7rem] leading-[1.3] text-white/55">
                  excl. 8% SST
                </span>
              </div>
              <div
                className="mb-3.5 inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5"
                style={{ background: "hsl(var(--success) / 0.12)", border: "1px solid hsl(var(--success) / 0.25)" }}
              >
                <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-wide text-success">
                  ✦ Save {AGENTIC_COURSE_PRICE.savingsDisplay}
                </span>
              </div>
              <p className="text-[0.95rem] font-light leading-relaxed text-white/45">
                <b className="font-medium text-primary-glow">Founding cohort pricing</b> — international-quality live
                training. This price will not return.
              </p>
              <p className="mt-2.5 font-mono text-[0.68rem] uppercase tracking-wider text-white/35">
                {COHORT_SCHEDULE.delivery} · Live online
              </p>
            </div>

            {/* Agent journey */}
            <div className="px-5 py-5 sm:px-6 sm:py-6">
              <div className="mb-4 flex items-center justify-between gap-2">
                <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-primary-glow">
                  Your build path
                </p>
                <span className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-success/85">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
                  Agent stack
                </span>
              </div>

              <ol className="hero-pipeline space-y-0">
                {PIPELINE.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <li key={step.label} className="hero-pipeline__step relative flex gap-3.5 pb-4 last:pb-0">
                      {i < PIPELINE.length - 1 && (
                        <span className="hero-pipeline__rail absolute left-[17px] top-9 bottom-0 w-px bg-gradient-to-b from-primary-glow/40 to-primary-glow/5" aria-hidden />
                      )}
                      <span className="relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary-glow/35 bg-primary-glow/10 text-primary-glow">
                        <Icon className="h-4 w-4" strokeWidth={2} />
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-[0.95rem] font-medium text-white/90">{step.label}</p>
                        <p className="font-mono text-[0.68rem] uppercase tracking-wider text-white/40">{step.sub}</p>
                      </div>
                      <CheckCircle2 className="ml-auto mt-2 h-4 w-4 shrink-0 text-success/55" aria-hidden />
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Hero;
