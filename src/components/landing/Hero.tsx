import { useState, type CSSProperties, type MouseEvent } from "react";
import { ArrowRight, Bot, Calendar, Orbit, Radar } from "lucide-react";
import { WHATSAPP_HREF } from "@/lib/whatsapp";
import CourseCheckout from "@/components/landing/CourseCheckout";

const Hero = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (0.5 - py) * 14, y: (px - 0.5) * 16 });
  };

  return (
    <section
      id="top"
      className="relative flex min-h-0 items-start bg-obsidian px-4 pb-16 pt-24 overflow-hidden sm:min-h-screen sm:px-[5vw] sm:pb-24 sm:pt-28 lg:items-center"
    >
      <div className="absolute inset-0 grid-bg hero-grid opacity-90" />
      <div className="absolute inset-0 hero-aurora opacity-80" />
      <div className="absolute inset-0 hero-scanlines opacity-55" />
      <div
        className="absolute -top-48 -right-24 w-[600px] h-[600px] rounded-full pointer-events-none hero-orb hero-orb-a"
        style={{ background: "radial-gradient(circle, hsl(var(--primary-glow) / 0.18), transparent 65%)" }}
      />
      <div
        className="absolute -bottom-32 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none hero-orb hero-orb-b"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.14), transparent 65%)" }}
      />
      <div className="absolute bottom-0 inset-x-0 h-20 bg-background" style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }} />

      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-[1.18fr_0.82fr] xl:gap-10">
        <div className="min-w-0">
          <div
            className="mb-6 inline-flex min-w-0 max-w-full animate-fade-up items-center gap-2 rounded-full border px-3 py-1.5 sm:mb-7 sm:px-3.5 sm:py-1.5"
            style={{ background: "hsl(var(--primary-glow) / 0.1)", borderColor: "hsl(var(--primary-glow) / 0.25)" }}
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-glow animate-pulse-dot" />
            <span className="min-w-0 text-balance font-mono text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-primary-glow sm:text-[0.62rem] sm:tracking-[0.14em]">
              Founding Cohort · Malaysia · 2026
            </span>
          </div>

          <h1
            className="display-xl mb-5 text-balance text-pretty text-white xl:whitespace-nowrap animate-fade-up"
            style={{ animationDelay: ".1s", opacity: 0 }}
          >
            <span className="block md:inline">Professional </span>
            <span className="block md:inline font-semibold">Agentic AI </span>
            <em className="block md:inline not-italic italic text-primary-glow">Engineering</em>
          </h1>

          <p
            className="mb-8 max-w-xl text-pretty text-base font-light leading-[1.85] text-white/45 sm:mb-9 md:text-lg animate-fade-up"
            style={{ animationDelay: ".2s", opacity: 0 }}
          >
            A rigorous, live instructor-led programme that takes you from Python basics to building and deploying
            production-grade multi-agent AI systems — in 20 intensive sessions.
          </p>

          <div className="mb-10 flex flex-wrap gap-1.5 sm:gap-2 animate-fade-up" style={{ animationDelay: ".3s", opacity: 0 }}>
            <span className="pill-hl">20 Live Sessions</span>
            <span className="pill-hl">80 Hours</span>
            <span className="pill-hl">6pm–10pm</span>
            <span className="pill">Live Online · Microsoft Teams</span>
            <span className="pill">Python Basics Included</span>
            <span className="pill">Certificate of Completion</span>
          </div>

          <div
            className="relative mb-10 inline-flex w-full max-w-md flex-col rounded-md p-5 pb-5 pt-6 max-sm:pt-12 sm:p-6 sm:pb-6 sm:pt-7 md:p-7 md:pt-8 animate-fade-up"
            style={{
              animationDelay: ".4s",
              opacity: 0,
              background: "hsl(var(--primary-glow) / 0.06)",
              border: "1px solid hsl(var(--primary-glow) / 0.22)",
            }}
          >
            <aside
              className="pointer-events-none absolute right-2 top-0 z-[2] w-[min(9.75rem,calc(100%-1.25rem))] max-sm:-translate-y-1/2 max-sm:translate-x-0 sm:right-0 sm:top-0 sm:w-[11.25rem] sm:max-w-[min(100%,calc(100%-0.5rem))] sm:translate-x-[calc(50%+0.3rem)] sm:translate-y-[calc(-50%+0.7rem)] md:w-[12rem] md:translate-x-[calc(50%+0.4rem)] md:translate-y-[calc(-50%+0.8rem)]"
              aria-label="Expected start date 9 June 2026; scheduled 9 June through 16 July 2026, seven weeks"
            >
              <div className="relative">
                <div className="hero-intake-badge__ornament max-sm:scale-90" aria-hidden>
                  <span className="hero-intake-badge__gem" />
                  <span className="hero-intake-badge__gem" />
                  <span className="hero-intake-badge__gem" />
                </div>
                <div className="hero-intake-badge__panel rounded-lg border border-amber-400/55 bg-gradient-to-br from-[#1c1508] via-[#2a1f0c] to-[#3d2a0a] px-2.5 py-1.5 shadow-[0_12px_36px_-8px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)] sm:px-3 sm:py-2.5">
                  <div className="flex items-center gap-1 text-[0.52rem] font-semibold uppercase tracking-[0.12em] text-amber-200/95 sm:gap-1.5 sm:text-[0.58rem] sm:tracking-[0.18em]">
                    <Calendar className="h-2.5 w-2.5 shrink-0 text-amber-300 sm:h-3 sm:w-3" strokeWidth={2.25} />
                    <span>Expected date</span>
                  </div>
                  <p className="mt-0.5 font-display text-[0.95rem] font-semibold leading-none tracking-tight text-[#fde68a] drop-shadow-sm sm:mt-1 sm:text-lg">
                    9 June 2026
                  </p>
                  <p className="mt-0.5 font-mono text-[0.55rem] leading-snug text-amber-100/80 sm:mt-1 sm:text-[0.62rem]">
                    9 Jun – 16 Jul 2026
                  </p>
                  <p className="mt-0 font-mono text-[0.5rem] font-medium uppercase tracking-wider text-amber-200/75 sm:mt-0.5 sm:text-[0.58rem]">
                    7 weeks · Teams live
                  </p>
                </div>
              </div>
            </aside>

            <span className="mb-2 max-sm:pr-[min(10rem,calc(100%-1rem))] text-pretty font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-primary-glow/80 sm:pr-[9rem] sm:text-[0.6rem] sm:tracking-[0.16em] md:pr-[11rem]">
              Founding Cohort — Limited Seats
            </span>
            <div className="mb-1 font-mono text-[0.65rem] text-white/25 line-through sm:text-xs">
              International market value: RM 12,000+
            </div>
            <div className="mb-2 flex flex-wrap items-baseline gap-2 max-sm:flex-col max-sm:items-start max-sm:gap-1 sm:gap-3">
              <span className="font-display text-4xl font-semibold leading-none text-success sm:text-5xl md:text-6xl">
                RM 399
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="font-mono text-[0.58rem] text-white/30 sm:text-[0.6rem]">excluding 8% SST</span>
                <span className="font-mono text-[0.58rem] text-white/30 sm:text-[0.6rem]">next cohort: RM 4,000</span>
              </div>
            </div>
            <div
              className="mb-2.5 inline-flex max-w-full items-center gap-1.5 rounded-sm px-2 py-1 sm:w-fit sm:px-2.5"
              style={{ background: "hsl(var(--success) / 0.12)", border: "1px solid hsl(var(--success) / 0.25)" }}
            >
              <span className="text-pretty font-mono text-[0.52rem] font-semibold uppercase tracking-wide text-success sm:text-[0.58rem] sm:tracking-widest">
                ✦ Limited offer — Save RM 11,601
              </span>
            </div>
            <p className="mt-1 border-t border-white/[0.08] pt-2.5 text-xs font-light leading-relaxed text-white/35 text-pretty">
              <b className="text-primary-glow font-medium">This is our founding cohort.</b> International-quality live
              training at a nominal fee in exchange for your commitment and feedback.{" "}
              <b className="text-primary-glow font-medium">This price will never exist again.</b>
            </p>
          </div>

          <div
            className="flex flex-col flex-wrap items-stretch gap-3 animate-fade-up sm:flex-row sm:items-center"
            style={{ animationDelay: ".5s", opacity: 0 }}
          >
            <CourseCheckout />
            <a
              href="#enquire"
              className="cta-medium group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-success px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-obsidian transition-all hover:bg-success/90 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-4px_hsl(var(--success)/0.5)] sm:min-h-0 sm:px-7"
            >
              Enquire Now
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener"
              className="cta-medium inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-whatsapp/30 px-6 py-3.5 text-xs font-medium uppercase tracking-wider text-whatsapp transition-colors hover:bg-whatsapp/10 sm:min-h-0 sm:px-7"
            >
              <svg viewBox="0 0 32 32" className="h-3.5 w-3.5 fill-current" aria-hidden>
                <path d="M16 3.2c-7 0-12.8 5.6-12.8 12.6 0 2.2.6 4.3 1.7 6.1L3 28.8l7.1-1.9c1.8 1 3.8 1.5 5.9 1.5 7 0 12.8-5.6 12.8-12.6S23 3.2 16 3.2zm0 22.9c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.2 1.1 1.1-4.1-.3-.4c-1.1-1.6-1.6-3.4-1.6-5.3 0-5.9 4.9-10.8 10.9-10.8S26.9 9.8 26.9 15.7 22 26.1 16 26.1zm5.9-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.3-.7.1c-.3-.2-1.4-.5-2.6-1.7-1-1-1.7-2.1-1.9-2.4-.2-.3 0-.5.2-.7.2-.2.3-.4.5-.6.2-.2.2-.4.3-.6.1-.2 0-.5 0-.6s-.7-1.7-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1-1.1 2.4s1.1 2.8 1.3 3c.2.2 2.2 3.4 5.2 4.7.7.3 1.3.5 1.8.6.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.6.3-.8.3-1.5.2-1.6 0-.1-.2-.2-.5-.4z" />
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>

        <div className="hidden lg:flex justify-center min-w-0">
          <div
            className="hero-globe-scene hero-globe-real reveal in"
            onMouseMove={onMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            style={
              {
                "--hero-tilt-x": `${tilt.x}deg`,
                "--hero-tilt-y": `${tilt.y}deg`,
              } as CSSProperties
            }
          >
            <div className="hero-earth-atmosphere" />
            <div className="hero-earth">
              <div className="hero-earth-map" />
              <div className="hero-earth-clouds" />
              <div className="hero-earth-specular" />
              <div className="hero-earth-night" />
              <div className="hero-earth-rim" />
              <div className="hero-earth-core-label">
                <Orbit className="w-3.5 h-3.5" />
                GLOBAL AGENT GRID
              </div>
            </div>
            <div className="hero-orbit hero-orbit-one">
              <span className="hero-sat-dot" />
            </div>
            <div className="hero-orbit hero-orbit-two">
              <span className="hero-sat-dot" />
            </div>
            <div className="hero-bot-card hero-bot-card-a">
              <Bot className="w-4 h-4 text-primary-glow shrink-0" />
              <div>
                <div className="text-[0.62rem] uppercase tracking-wider text-white/85">Ops Bot</div>
                <div className="text-[0.55rem] uppercase tracking-[0.18em] text-success">Live</div>
              </div>
            </div>
            <div className="hero-bot-card hero-bot-card-b">
              <Radar className="w-4 h-4 text-primary-glow shrink-0" />
              <div>
                <div className="text-[0.62rem] uppercase tracking-wider text-white/85">Retriever</div>
                <div className="text-[0.55rem] uppercase tracking-[0.18em] text-success">Scanning</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
