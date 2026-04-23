import { useState, type CSSProperties, type MouseEvent } from "react";
import { ArrowRight, Bot, MessageCircle, Orbit, Radar } from "lucide-react";
import { WHATSAPP_HREF } from "@/lib/whatsapp";

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
            className="inline-flex flex-col rounded-md p-6 md:p-7 mb-10 max-w-md animate-fade-up"
            style={{
              animationDelay: ".4s",
              opacity: 0,
              background: "hsl(var(--primary-glow) / 0.06)",
              border: "1px solid hsl(var(--primary-glow) / 0.22)",
            }}
          >
            <span className="font-mono text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-primary-glow/80 mb-2">
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

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 animate-fade-up" style={{ animationDelay: ".5s", opacity: 0 }}>
            <a
              href="#enquire"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-sm bg-success text-obsidian font-semibold text-xs tracking-wider uppercase hover:bg-success/90 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-4px_hsl(var(--success)/0.5)] transition-all"
            >
              Enquire Now — Fill the Form
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-sm border border-whatsapp/30 text-whatsapp font-medium text-xs tracking-wider uppercase hover:bg-whatsapp/10 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Us
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
