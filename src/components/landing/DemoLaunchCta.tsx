import { type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bot, Sparkles, Zap } from "lucide-react";

type Props = {
  className?: string;
  style?: CSSProperties;
};

const scrollDemoPageToTop = () => {
  window.scrollTo(0, 0);
};

const DemoLaunchCta = ({ className = "", style }: Props) => (
  <Link
    to="/demo"
    style={style}
    onClick={scrollDemoPageToTop}
    className={`demo-launch-cta group relative flex w-full max-w-2xl flex-col gap-3 overflow-hidden rounded-2xl border sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${className}`}
    aria-label="Explore free live AI demos — Agentic AI and Vibe Coding"
  >
    <span className="demo-launch-cta__shine" aria-hidden />
    <span className="demo-launch-cta__glow" aria-hidden />

    <div className="demo-launch-cta__inner relative z-[2] flex min-w-0 flex-1 flex-col gap-2.5 px-4 py-4 sm:px-5 sm:py-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="demo-launch-cta__live inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.58rem] font-bold uppercase tracking-[0.14em]">
          <span className="demo-launch-cta__live-dot" aria-hidden />
          Free live demos
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[0.55rem] font-semibold uppercase tracking-wider text-white/50">
          <Zap className="h-3 w-3 text-[#00d4aa]" aria-hidden />
          50 seats each
        </span>
      </div>

      <div className="min-w-0 space-y-1">
        <p className="demo-launch-cta__headline text-balance font-display text-lg font-medium leading-snug text-white sm:text-xl">
          See AI <em className="not-italic text-[#00d4aa]">think</em>, watch apps <em className="not-italic text-[#38bdf8]">appear</em> — live.
        </p>
        <p className="text-pretty text-[0.8rem] font-light leading-relaxed text-white/55 sm:text-[0.8125rem]">
          Two free 2-hour Microsoft Teams sessions · Interactive · No commitment
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="demo-launch-cta__chip demo-launch-cta__chip--agentic inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.65rem] font-medium text-white/85">
          <Bot className="h-3.5 w-3.5 shrink-0 text-[#00d4aa]" aria-hidden />
          Agentic AI · 8 Jun · Mon
        </span>
        <span className="demo-launch-cta__chip demo-launch-cta__chip--vibe inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.65rem] font-medium text-white/85">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#38bdf8]" aria-hidden />
          Vibe Coding · 12 Jun · Fri
        </span>
      </div>
    </div>

    <span className="demo-launch-cta__action relative z-[2] mx-4 mb-4 inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl px-5 py-3.5 font-mono text-[0.68rem] font-bold uppercase tracking-[0.12em] sm:mx-0 sm:mb-0 sm:mr-5 sm:self-center">
      Register free
      <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
    </span>
  </Link>
);

export default DemoLaunchCta;
