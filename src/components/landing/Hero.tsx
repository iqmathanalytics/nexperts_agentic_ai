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
    <section id="top" className="relative min-h-screen flex items-center px-[5vw] pt-28 pb-24 bg-obsidian overflow-hidden">
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

      <div className="relative z-10 max-w-6xl w-full grid lg:grid-cols-[1.18fr_0.82fr] gap-8 xl:gap-10 items-center">
        <div className="min-w-0">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-7 animate-fade-up"
            style={{ background: "hsl(var(--primary-glow) / 0.1)", borderColor: "hsl(var(--primary-glow) / 0.25)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary-glow animate-pulse-dot" />
            <span className="font-mono text-[0.62rem] font-semibold tracking-[0.14em] uppercase text-primary-glow">
              Founding Cohort · Malaysia · 2026
            </span>
          </div>

          <h1 className="display-xl text-white mb-5 text-balance xl:whitespace-nowrap animate-fade-up" style={{ animationDelay: ".1s", opacity: 0 }}>
            <span className="block md:inline">Professional </span>
            <span className="block md:inline font-semibold">Agentic AI </span>
            <em className="block md:inline not-italic italic text-primary-glow">Engineering</em>
          </h1>

          <p className="text-base md:text-lg font-light text-white/45 leading-[1.85] max-w-xl mb-9 animate-fade-up" style={{ animationDelay: ".2s", opacity: 0 }}>
            A rigorous, live instructor-led programme that takes you from Python basics to building and deploying
            production-grade multi-agent AI systems — in 20 intensive sessions.
          </p>

          <div className="flex flex-wrap gap-2 mb-10 animate-fade-up" style={{ animationDelay: ".3s", opacity: 0 }}>
            <span className="pill-hl">20 Live Sessions</span>
            <span className="pill-hl">80 Hours</span>
            <span className="pill-hl">6pm–10pm</span>
            <span className="pill">Live Online · Microsoft Teams</span>
            <span className="pill">Python Basics Included</span>
            <span className="pill">Certificate of Completion</span>
          </div>

          <div
            className="relative inline-flex w-full max-w-md flex-col rounded-md p-6 pb-6 pt-7 md:p-7 md:pt-8 mb-10 animate-fade-up"
            style={{
              animationDelay: ".4s",
              opacity: 0,
              background: "hsl(var(--primary-glow) / 0.06)",
              border: "1px solid hsl(var(--primary-glow) / 0.22)",
            }}
          >
            <aside
              className="pointer-events-none absolute right-0 top-0 z-[2] w-[11.25rem] max-w-[min(100%,calc(100%-0.5rem))] translate-x-[calc(50%+0.3rem)] translate-y-[calc(-50%+0.7rem)] sm:w-[12rem] sm:translate-x-[calc(50%+0.4rem)] sm:translate-y-[calc(-50%+0.8rem)]"
              aria-label="Expected start date 9 June 2026; scheduled 9 June through 16 July 2026, seven weeks"
            >
              <div className="relative">
                <div className="hero-intake-badge__ornament" aria-hidden>
                  <span className="hero-intake-badge__gem" />
                  <span className="hero-intake-badge__gem" />
                  <span className="hero-intake-badge__gem" />
                </div>
                <div className="hero-intake-badge__panel rounded-lg border border-amber-400/55 bg-gradient-to-br from-[#1c1508] via-[#2a1f0c] to-[#3d2a0a] px-3 py-2.5 shadow-[0_12px_36px_-8px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)]">
                <div className="flex items-center gap-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-amber-200/95">
                  <Calendar className="h-3 w-3 shrink-0 text-amber-300" strokeWidth={2.25} />
                  <span>Expected date</span>
                </div>
                <p className="mt-1 font-display text-lg font-semibold leading-none tracking-tight text-[#fde68a] drop-shadow-sm">
                  9 June 2026
                </p>
                <p className="mt-1 font-mono text-[0.62rem] leading-snug text-amber-100/80">
                  9 Jun – 16 Jul 2026
                </p>
                <p className="mt-0.5 font-mono text-[0.58rem] font-medium uppercase tracking-wider text-amber-200/75">
                  7 weeks · Teams live
                </p>
                </div>
              </div>
            </aside>

            <span className="font-mono text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-primary-glow/80 mb-2 pr-[9rem] sm:pr-[11rem]">
              Founding Cohort — Limited Seats
            </span>
            <div className="font-mono text-xs text-white/25 line-through mb-1">International market value: RM 12,000+</div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-display text-5xl md:text-6xl font-semibold text-success leading-none">RM 399</span>
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[0.6rem] text-white/30">excluding 8% SST</span>
                <span className="font-mono text-[0.6rem] text-white/30">next cohort: RM 4,000</span>
              </div>
            </div>
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm w-fit mb-2.5"
              style={{ background: "hsl(var(--success) / 0.12)", border: "1px solid hsl(var(--success) / 0.25)" }}
            >
              <span className="font-mono text-[0.58rem] font-semibold tracking-widest uppercase text-success">
                ✦ Limited offer — Save RM 11,601
              </span>
            </div>
            <p className="text-xs font-light text-white/35 leading-relaxed border-t border-white/[0.08] pt-2.5 mt-1">
              <b className="text-primary-glow font-medium">This is our founding cohort.</b> International-quality live
              training at a nominal fee in exchange for your commitment and feedback.{" "}
              <b className="text-primary-glow font-medium">This price will never exist again.</b>
            </p>
          </div>

          <div
            className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 animate-fade-up"
            style={{ animationDelay: ".5s", opacity: 0 }}
          >
            <CourseCheckout />
            <a
              href="#enquire"
              className="cta-medium group inline-flex items-center justify-center gap-2 rounded-sm bg-success px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-obsidian transition-all hover:bg-success/90 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-4px_hsl(var(--success)/0.5)]"
            >
              Enquire Now
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener"
              className="cta-medium inline-flex items-center justify-center gap-2 rounded-sm border border-whatsapp/30 px-7 py-3.5 text-xs font-medium uppercase tracking-wider text-whatsapp transition-colors hover:bg-whatsapp/10"
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
