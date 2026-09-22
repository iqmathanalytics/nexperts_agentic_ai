/**
 * Remove obsolete free-demo CTA from Vibe Coding page and restyle hero
 * to mirror the Agentic AI enrolment-panel layout.
 * Run: node scripts/restyle-vibe-hero.mjs
 */
import { readFileSync, writeFileSync, copyFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const path = resolve(root, "public/Vibe coding.html");
const rootCopy = resolve(root, "Vibe coding.html");

let html = readFileSync(path, "utf8");

html = html.replace(/\s*<link rel="stylesheet" href="\/demo-launch-cta\.css" \/>\s*/g, "\n");

html = html.replace(
  /\s*<div class="demo-launch-cta-wrap">[\s\S]*?<\/div>\s*(?=<div class="pill-row">)/,
  "\n\n",
);

const layoutCss = `
/* ===== Agentic-aligned hero layout ===== */
.hero{
  padding:88px 20px 72px!important;
}
.hero-layout{
  display:grid;
  grid-template-columns:1fr;
  gap:28px;
  align-items:start;
  max-width:90rem;
  margin:0 auto;
}
@media (min-width:1024px){
  .hero-layout{
    grid-template-columns:minmax(0,1.08fr) minmax(0,0.92fr);
    gap:48px;
    align-items:center;
  }
}
.hero-copy{min-width:0}
.hero-banners{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 18px}
.prog-banner{
  display:inline-flex;align-items:center;gap:8px;min-height:40px;
  border-radius:10px;padding:8px 12px;text-decoration:none;
  border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);
  transition:transform .2s,border-color .2s,background .2s;
}
.prog-banner:hover{transform:translateY(-1px);border-color:rgba(255,255,255,.28);background:rgba(255,255,255,.07)}
.prog-banner__label{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#e2e8f0}
.prog-banner__cta{
  font-size:9px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;
  border-radius:6px;padding:3px 8px;background:#fde68a;color:#1f1300;
}
.prog-banner--agentic{border-color:rgba(96,165,250,.35);background:rgba(59,130,246,.12)}
.prog-banner--agentic .prog-banner__label{color:#bfdbfe}
.prog-banner--corp{border-color:rgba(34,211,238,.35);background:rgba(8,145,178,.14)}
.prog-banner--corp .prog-banner__label{color:#cffafe}
.prog-banner--corp .prog-banner__cta{background:#a5f3fc;color:#042f2e}
.hero-enrol{position:relative;min-width:0}
.hero-enrol__glow{
  position:absolute;inset:-10% -6% auto auto;width:70%;height:50%;
  border-radius:999px;pointer-events:none;
  background:radial-gradient(circle,rgba(96,165,250,.22),transparent 68%);
  filter:blur(2px);
}
.hero-enrol__card{
  position:relative;overflow:hidden;border-radius:18px;
  border:1px solid rgba(255,255,255,.1);
  background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,.02));
  box-shadow:0 24px 60px -28px rgba(0,0,0,.75);backdrop-filter:blur(6px);
}
.hero-enrol__top{
  position:relative;padding:22px 20px;border-bottom:1px solid rgba(255,255,255,.08);
}
.hero-enrol__top::before{
  content:"";position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse at top right,rgba(245,158,11,.14),transparent 55%);
}
.hero-enrol__status{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:12px;position:relative}
.hero-enrol__chip{
  display:inline-flex;align-items:center;gap:6px;border-radius:999px;
  border:1px solid rgba(251,191,36,.4);background:rgba(245,158,11,.15);
  padding:6px 10px;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#fde68a;
}
.hero-enrol__chip-dot{width:6px;height:6px;border-radius:50%;background:#fcd34d;animation:pulse 1.4s ease-in-out infinite}
.hero-enrol__date-kicker{font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(253,230,138,.9);margin:0 0 6px;position:relative}
.hero-enrol__date{font-family:var(--serif);font-size:clamp(1.7rem,3vw,2.35rem);font-weight:300;line-height:1.05;color:#fde68a;margin:0 0 8px;position:relative}
.hero-enrol__range{font-size:14px;color:rgba(255,247,237,.75);margin:0 0 6px;position:relative}
.hero-enrol__meta{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:rgba(253,230,138,.65);position:relative}
.hero-enrol__price{padding:22px 20px;border-bottom:1px solid rgba(255,255,255,.08)}
.hero-enrol__price .price-block{display:block;margin:0}
.hero-enrol__price .seats-bump-tab{display:inline-flex;margin-bottom:14px}
.hero-enrol__price .save-pill{display:inline-flex;margin:14px 0 12px}
.hero-enrol__price .found-note{display:block;margin:0}
.hero-enrol__journey{padding:20px}
.journey-title{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:14px}
.journey-title > span:first-child{font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#93c5fd}
.journey-live{display:inline-flex;align-items:center;gap:6px;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#4ade80}
.journey-live i{width:6px;height:6px;border-radius:50%;background:#22c55e;display:inline-block;animation:pulse 1.2s ease-in-out infinite}
.journey-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0}
.journey-item{display:grid;grid-template-columns:28px 1fr;gap:12px;padding:10px 0;border-top:1px solid rgba(255,255,255,.06)}
.journey-item:first-child{border-top:none;padding-top:0}
.journey-num{
  width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:800;color:#bfdbfe;background:rgba(59,130,246,.18);border:1px solid rgba(147,197,253,.3);
}
.journey-label{font-size:13px;font-weight:600;color:#f8fafc}
.journey-sub{font-size:11px;color:rgba(226,232,240,.5);margin-top:2px}
.hero .ctas{flex-direction:row;flex-wrap:wrap;align-items:stretch}
.hero .cta-reserve,.hero .cta-enrol,.hero .cta-wa{flex:1 1 160px;min-height:46px;padding:12px 16px;font-size:11px}
.hero-copy > .sched-card,
.hero-copy > .price-block,
.hero-copy > .save-pill,
.hero-copy > .found-note,
.hero-copy > .seats-bump-tab{display:none}
.hero-desc{margin-bottom:22px}
.pill-row{margin-bottom:22px}
.hero-enrol .seats-bump-tab{display:inline-flex;margin-bottom:14px}
.hero-enrol .price-block{display:block;margin-bottom:0}
.hero-enrol .save-pill{display:inline-flex}
.hero-enrol .found-note{display:block}
@media (max-width:640px){
  .hero .ctas{flex-direction:column}
}
`;

if (!html.includes("Agentic-aligned hero layout")) {
  html = html.replace("/* Bumping seats tab */", `${layoutCss}\n/* Bumping seats tab */`);
}

const heroStart = html.indexOf('<div class="hero-content">');
const heroEnd = html.indexOf("</section>", heroStart);
if (heroStart < 0 || heroEnd < 0) {
  throw new Error("hero markers missing");
}

const newHero = `<div class="hero-content">
  <div class="hero-layout">
    <div class="hero-copy">
      <div class="founding-badge"><span class="founding-dot"></span>FOUNDING COHORT · 16 NOV 2026 – 2 JAN 2027 · 100 SEATS</div>

      <div class="hero-banners">
        <a class="prog-banner prog-banner--agentic" href="/">
          <span class="prog-banner__label">Agentic AI Engineering</span>
          <span class="prog-banner__cta">Explore</span>
        </a>
        <a class="prog-banner prog-banner--corp" href="/generative-ai-corporate">
          <span class="prog-banner__label">Corporate Gen AI</span>
          <span class="prog-banner__cta">Explore</span>
        </a>
      </div>

      <h1>Software Development<br>Bootcamp</h1>
      <div class="hero-sub">with Generative AI &amp; Vibe Coding</div>

      <p class="hero-desc">A serious, live instructor-led programme. 10 weeks, 2 sessions per week, 4 hours each — you leave with a fully deployed AI-powered SaaS application, a GitHub portfolio, and the ability to build any software product using AI as your development engine.</p>

      <div class="pill-row">
        <span class="pill hi">10 Weeks</span>
        <span class="pill hi">20 Sessions</span>
        <span class="pill hi">80 Hours</span>
        <span class="pill hi">100 Seats Only</span>
        <span class="pill">Mon · Wed · 6pm–10pm</span>
        <span class="pill">Live on Microsoft Teams</span>
        <span class="pill">Certificate of Completion</span>
      </div>

      <div class="ctas">
        <a href="#" class="cta-reserve" onclick="openVibeCheckout(event)">💳 RESERVE YOUR SEAT — RM 799</a>
        <a href="#" class="cta-enrol" onclick="openVibeEnquiry(event)">ENQUIRE NOW →</a>
        <a href="https://wa.me/601112216870" class="cta-wa" target="_blank" rel="noopener">WHATSAPP US</a>
      </div>
    </div>

    <aside class="hero-enrol" aria-label="Vibe Coding intake — 16 Nov 2026 to 2 Jan 2027. 100 seats only. RM 799.">
      <div class="hero-enrol__glow" aria-hidden="true"></div>
      <div class="hero-enrol__card">
        <div class="hero-enrol__top">
          <div class="hero-enrol__status">
            <span class="hero-enrol__chip"><span class="hero-enrol__chip-dot"></span> Now enrolling</span>
          </div>
          <div class="seats-bump-tab" role="status">
            <span class="seats-bump-tab__dot" aria-hidden="true"></span>
            <span>100 seats only available</span>
          </div>
          <p class="hero-enrol__date-kicker">Next intake</p>
          <p class="hero-enrol__date">16 November 2026</p>
          <p class="hero-enrol__range">16 Nov 2026 – 2 Jan 2027</p>
          <p class="hero-enrol__meta">Mon · Wed · 6pm–10pm · 10 weeks · Microsoft Teams</p>
        </div>
        <div class="hero-enrol__price">
          <div class="price-label">FOUNDING OFFER — 100 SEATS ONLY</div>
          <div class="price-old">Market value: RM 10,000</div>
          <div class="price-big">RM 799</div>
          <div class="price-note">excluding 8% SST · next cohort: RM 10,000</div>
          <div class="save-pill">✦ FOUNDING OFFER — SAVE RM 9,201</div>
          <p class="found-note" style="margin-bottom:0"><strong>Founding cohort pricing</strong> — 80 hours of live instructor-led training. This price will not return.</p>
        </div>
        <div class="hero-enrol__journey">
          <div class="journey-title">
            <span>Your build path</span>
            <span class="journey-live"><i></i> Ship stack</span>
          </div>
          <ol class="journey-list">
            <li class="journey-item"><span class="journey-num">01</span><div><div class="journey-label">Vibe Coding Foundations</div><div class="journey-sub">Cursor · prompts · AI IDE</div></div></li>
            <li class="journey-item"><span class="journey-num">02</span><div><div class="journey-label">Full-stack build</div><div class="journey-sub">React · FastAPI · Supabase</div></div></li>
            <li class="journey-item"><span class="journey-num">03</span><div><div class="journey-label">AI features &amp; automation</div><div class="journey-sub">GPT-4o · digests · alerts</div></div></li>
            <li class="journey-item"><span class="journey-num">04</span><div><div class="journey-label">Deploy live</div><div class="journey-sub">Vercel · Railway · Demo Day</div></div></li>
          </ol>
        </div>
      </div>
    </aside>
  </div>
</div>
`;

html = html.slice(0, heroStart) + newHero + html.slice(heroEnd);

writeFileSync(path, html, "utf8");
copyFileSync(path, rootCopy);

const c = readFileSync(path, "utf8");
console.log("demo-launch left:", (c.match(/demo-launch-cta/g) || []).length);
console.log("hero-enrol:", (c.match(/hero-enrol/g) || []).length);
console.log("href /demo:", (c.match(/href="\/demo"/g) || []).length);
console.log("demo css link:", c.includes("demo-launch-cta.css"));
console.log("done");
