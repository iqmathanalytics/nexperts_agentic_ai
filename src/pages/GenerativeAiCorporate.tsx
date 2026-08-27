import { useEffect } from "react";
import { ArrowRight, Building2, Check, Sparkles } from "lucide-react";
import CorporateNav from "@/components/generative-ai-corporate/CorporateNav";
import CorporateEnquire from "@/components/generative-ai-corporate/CorporateEnquire";
import Footer from "@/components/landing/Footer";
import { useReveal } from "@/hooks/useReveal";
import { useHeroFxPause } from "@/hooks/useHeroFxPause";
import { useLandingAnalytics } from "@/hooks/useLandingAnalytics";
import {
  CUSTOMISATION_DEPARTMENTS,
  GENERATIVE_AI_CORPORATE_META,
  GENERATIVE_AI_CORPORATE_PRICE,
  GENERATIVE_AI_DEPARTMENTS,
  LEARNING_JOURNEY,
  MONDAY_SCENARIOS,
  PARTICIPANT_DELIVERABLES,
} from "@/lib/generative-ai-corporate";
import { WHATSAPP_HREF } from "@/lib/whatsapp";

const stats = [
  { n: "2", l: "Intensive training days" },
  { n: "16h", l: "Total hands-on learning" },
  { n: "70%", l: "Practical exercises & scenarios" },
  { n: "0", l: "Coding required" },
  { n: GENERATIVE_AI_CORPORATE_PRICE.display, l: `Per pax · ${GENERATIVE_AI_CORPORATE_PRICE.sstNote}`, success: true },
  { n: "HRD", l: "Corp claimable programme", success: true },
];

const GenerativeAiCorporate = () => {
  useReveal();
  useLandingAnalytics();
  const heroRef = useHeroFxPause<HTMLElement>();

  useEffect(() => {
    document.title = GENERATIVE_AI_CORPORATE_META.title;

    const ensureMeta = (name: string, content: string) => {
      let m = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!m) {
        m = document.createElement("meta");
        m.name = name;
        document.head.appendChild(m);
      }
      m.content = content;
    };

    ensureMeta("description", GENERATIVE_AI_CORPORATE_META.description);
    ensureMeta("robots", "index, follow");

    for (const [property, content] of [
      ["og:title", GENERATIVE_AI_CORPORATE_META.title],
      ["og:description", GENERATIVE_AI_CORPORATE_META.description],
    ] as const) {
      let m = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!m) {
        m = document.createElement("meta");
        m.setAttribute("property", property);
        document.head.appendChild(m);
      }
      m.content = content;
    }
  }, []);

  return (
    <>
      <CorporateNav />
      <main className="min-w-0 overflow-x-hidden">
        <section
          ref={heroRef}
          id="overview"
          className="hero-section section-x relative flex items-start overflow-clip bg-obsidian pb-16 pt-24 sm:min-h-[85vh] sm:pb-24 sm:pt-28 lg:items-center"
        >
          <div className="absolute inset-0 grid-bg hero-grid hero-section__bg opacity-90" aria-hidden />
          <div className="absolute inset-0 hero-aurora hero-section__bg opacity-80" aria-hidden />
          <div className="hero-bottom-fade hero-section__bg" aria-hidden />

          <div className="hero-section__content relative z-10 mx-auto w-full max-w-6xl min-w-0">
            <div className="mb-6 flex flex-wrap items-center gap-2.5 sm:mb-7">
              <div
                className="inline-flex min-w-0 max-w-full animate-fade-up items-center gap-2 rounded-full border px-3 py-1.5"
                style={{ background: "hsl(var(--primary-glow) / 0.1)", borderColor: "hsl(var(--primary-glow) / 0.25)" }}
              >
                <Building2 className="h-3.5 w-3.5 shrink-0 text-primary-glow" />
                <span className="min-w-0 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-primary-glow sm:text-[0.62rem]">
                  Corporate AI Upskilling · 2026
                </span>
              </div>
            </div>

            <h1 className="display-xl mb-5 max-w-4xl text-balance text-white animate-fade-up" style={{ animationDelay: ".08s" }}>
              Generative AI for{" "}
              <span className="font-semibold text-primary-glow">Workplace Productivity</span>
              {" "}& Business Automation
            </h1>

            <p
              className="mb-6 max-w-2xl text-pretty text-base font-light leading-[1.85] text-white/45 md:text-lg animate-fade-up"
              style={{ animationDelay: ".14s" }}
            >
              Your team is already using AI. This programme turns scattered usage into a smarter, safer way of working —
              built around emails, reports, meetings, presentations, spreadsheets and business processes. No coding required.
            </p>

            <div className="mb-8 flex flex-wrap gap-1.5 sm:gap-2 animate-fade-up" style={{ animationDelay: ".2s" }}>
              <span className="pill-hl">2 Days</span>
              <span className="pill-hl">16 Hours</span>
              <span className="pill-hl">Hands-On</span>
              <span className="pill-hl">Beginner Friendly</span>
              <span className="pill">No Coding Required</span>
              <span className="pill">HRD Corp Claimable</span>
            </div>

            <div
              className="relative mb-10 max-w-lg rounded-md p-5 sm:p-6 animate-fade-up"
              style={{
                animationDelay: ".26s",
                background: "hsl(var(--primary-glow) / 0.06)",
                border: "1px solid hsl(var(--primary-glow) / 0.22)",
              }}
            >
              <span className="mb-2 block font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-primary-glow/80">
                Investment per participant
              </span>
              <div className="mb-2 flex flex-nowrap items-end gap-2.5">
                <span className="shrink-0 whitespace-nowrap font-display text-4xl font-semibold leading-none text-success sm:text-5xl">
                  {GENERATIVE_AI_CORPORATE_PRICE.display}
                </span>
                <span className="font-mono text-[0.55rem] leading-[1.25] text-white/55 sm:text-[0.58rem]">
                  per pax · {GENERATIVE_AI_CORPORATE_PRICE.sstNote}
                </span>
              </div>
              <p className="text-sm font-light leading-relaxed text-white/40">
                Not another "how to use ChatGPT" class. Practical prompts, workflows and responsible-AI practices your
                team can apply from Monday.
              </p>
            </div>

            <div className="flex flex-col flex-wrap items-stretch gap-3 animate-fade-up sm:flex-row sm:items-center" style={{ animationDelay: ".32s" }}>
              <a
                href="#enquire"
                className="cta-medium group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-success px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-obsidian transition-all hover:bg-success/90 hover:-translate-y-0.5 sm:min-h-0 sm:px-7"
              >
                Request Proposal
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href={GENERATIVE_AI_CORPORATE_META.brochurePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-medium inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-primary-glow/35 px-6 py-3.5 text-xs font-medium uppercase tracking-wider text-primary-glow transition-colors hover:bg-primary-glow/10 sm:min-h-0 sm:px-7"
              >
                Download Brochure
              </a>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener"
                className="cta-medium inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-whatsapp/30 px-6 py-3.5 text-xs font-medium uppercase tracking-wider text-whatsapp transition-colors hover:bg-whatsapp/10 sm:min-h-0 sm:px-7"
              >
                WhatsApp Us
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-2 animate-fade-up" style={{ animationDelay: ".36s" }}>
              {GENERATIVE_AI_DEPARTMENTS.map((dept) => (
                <span
                  key={dept}
                  className="rounded-sm border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-wider text-white/45"
                >
                  {dept}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-px border-b border-border bg-border reveal sm:grid-cols-3 md:flex">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-card px-4 py-6 transition-colors hover:bg-paper sm:px-5 sm:py-7 md:flex-1 md:border-r md:border-border md:last:border-r-0"
            >
              <div className={`font-display text-3xl font-light leading-none mb-1 ${s.success ? "text-success" : "text-primary"}`}>
                {s.n}
              </div>
              <div className="text-[0.7rem] text-ink-faint leading-snug">{s.l}</div>
            </div>
          ))}
        </div>

        <section className="section-x bg-paper py-20 md:py-24">
          <div className="reveal max-w-3xl">
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="w-3.5 h-px bg-primary/60" />
              <span className="font-mono text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-primary">
                The Shift This Programme Builds
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-light text-foreground leading-[1.1] mb-6 text-balance">
              From one-off prompts to<br />
              <em className="not-italic italic text-primary">reusable AI-assisted ways of working.</em>
            </h2>
            <p className="text-[0.95rem] font-light text-ink-soft leading-[1.85] max-w-2xl">
              Participants learn to use modern Generative AI tools with better prompting, stronger judgement and
              responsible data practices. The goal is practical prompts, use cases and workflows they can apply
              immediately — while understanding where AI requires human review.
            </p>
          </div>
        </section>

        <section id="scenarios" className="section-x bg-obsidian py-20 md:py-24">
          <div className="reveal mb-10 max-w-3xl">
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="w-3.5 h-px bg-primary-glow/60" />
              <span className="font-mono text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-primary-glow">
                Making the Value Real
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-light text-white leading-[1.1] mb-4 text-balance">
              What could your team<br />
              <em className="not-italic italic text-primary-glow">do differently on Monday?</em>
            </h2>
          </div>

          <div className="reveal overflow-hidden rounded-md border border-white/[0.08]">
            <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] bg-white/[0.04] px-5 py-3 font-mono text-[0.58rem] font-semibold uppercase tracking-wider text-white/40">
              <span>Today's challenge</span>
              <span className="px-4">→</span>
              <span>With this programme</span>
            </div>
            {MONDAY_SCENARIOS.map((row, i) => (
              <div
                key={row.before}
                className={`grid gap-2 border-t border-white/[0.06] px-4 py-4 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4 md:px-5 ${
                  i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
                }`}
              >
                <p className="text-sm font-light text-white/45 leading-relaxed">{row.before}</p>
                <ArrowRight className="hidden h-4 w-4 shrink-0 text-primary-glow md:block" />
                <p className="text-sm font-light text-white/75 leading-relaxed">{row.after}</p>
              </div>
            ))}
          </div>

          <div className="reveal mt-12 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div>
              <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary-glow mb-2">
                Programme Balance
              </p>
              <p className="text-sm text-white/50 leading-relaxed max-w-md">
                Hands-on exercises · department scenarios · prompt building · workflow design · responsible-AI
                decisions. Productivity and transformation — not a list of course modules.
              </p>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <div className="text-center">
                <div className="font-display text-4xl font-light text-white">30%</div>
                <div className="font-mono text-[0.58rem] uppercase tracking-wider text-white/40">Concept</div>
              </div>
              <div className="h-px w-12 bg-primary-glow/40" />
              <div className="text-center">
                <div className="font-display text-4xl font-light text-success">70%</div>
                <div className="font-mono text-[0.58rem] uppercase tracking-wider text-white/40">Practical</div>
              </div>
            </div>
          </div>
        </section>

        <section id="journey" className="section-x bg-paper py-20 md:py-24">
          <div className="reveal mb-10">
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="w-3.5 h-px bg-primary/60" />
              <span className="font-mono text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-primary">
                The Learning Journey
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-light text-foreground leading-[1.1] mb-3 text-balance">
              Understand → Prompt → Apply → Analyse → Automate → Govern
            </h2>
            <p className="text-sm text-ink-soft max-w-xl">What participants will actually learn across 2 intensive days.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border reveal">
            {LEARNING_JOURNEY.map((item) => (
              <div key={item.step} className="bg-card p-6 hover:bg-paper transition-colors">
                <div className="font-display text-2xl font-light text-primary mb-2">{item.step}</div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-[0.82rem] font-light text-ink-soft leading-[1.65]">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="reveal mt-14 grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-display text-2xl font-light text-foreground">What participants leave with</h3>
              </div>
              <ul className="space-y-3">
                {PARTICIPANT_DELIVERABLES.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-ink-soft">
                    <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="rounded-md p-6 md:p-8"
              style={{ background: "hsl(var(--primary) / 0.04)", border: "1px solid hsl(var(--primary) / 0.12)" }}
            >
              <h3 className="font-display text-2xl font-light text-foreground mb-3">Customisable for your organisation</h3>
              <p className="text-sm text-ink-soft leading-relaxed mb-5">
                Delivered organisation-wide or customised for individual departments — with client-specific exercises
                built around your tools, terminology and business scenarios.
              </p>
              <div className="flex flex-wrap gap-2">
                {CUSTOMISATION_DEPARTMENTS.map((dept) => (
                  <span
                    key={dept}
                    className="rounded-sm border border-border bg-card px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-wider text-ink-faint"
                  >
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <CorporateEnquire />
      </main>
      <Footer />
    </>
  );
};

export default GenerativeAiCorporate;
