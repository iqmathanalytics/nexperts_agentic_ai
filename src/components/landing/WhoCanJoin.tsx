const forYou = [
  "You're a software developer, IT pro, or data analyst wanting to specialise in AI engineering",
  "You're a fresh graduate or career switcher with basic programming who wants to enter AI",
  "You're a business owner or technical lead who wants to build AI systems for your organisation",
  "You've tried YouTube AI tutorials but want structured, deep, hands-on live instruction",
  "You can commit to Mon–Fri 6pm–10pm for 4 weeks — no excuses, full presence",
  "You want to leave with a portfolio-ready, deployed AI system — not just a certificate",
];

const notForYou = [
  "You want passive video content you can watch whenever you feel like it",
  "You can't commit to attending daily — this is a rigorous intensive, not a casual course",
  "You expect to learn without doing — every session requires you to build, not just listen",
  "You have zero interest in writing any code — some Python is involved and required",
];

const prereqs = [
  {
    tag: "Must Have",
    color: "success",
    items: [
      "Basic programming knowledge in any language",
      "Basic understanding of what an API is",
      "A laptop with internet access",
      "Commitment to attend every daily session",
    ],
  },
  {
    tag: "Good to Have",
    color: "primary",
    items: [
      "Prior exposure to Python — even basic",
      "Familiarity with JSON or CSV data files",
      "Basic understanding of cloud tools or APIs",
      "Intro to machine learning concepts",
    ],
  },
  {
    tag: "Not Required",
    color: "muted",
    items: [
      "Deep learning or AI expertise",
      "Advanced mathematics or statistics",
      "Prior experience with LLMs or agents",
      "University computer science degree",
    ],
  },
];

const tagClasses: Record<string, string> = {
  success: "bg-success/10 text-success border-success/20",
  primary: "bg-primary/10 text-primary border-primary/20",
  muted: "bg-ink-faint/10 text-ink-faint border-ink-faint/20",
};

const WhoCanJoin = () => (
  <section id="who" className="px-[5vw] py-20 md:py-24 bg-paper">
    <div className="reveal">
      <div className="eyebrow mb-3.5">Who Can Join</div>
      <h2 className="display text-foreground text-balance">
        Built for people who want to<br />
        <em>build AI, not just use it.</em>
      </h2>
    </div>

    <div className="grid md:grid-cols-2 gap-px bg-border border border-border mt-12 reveal">
      <div className="bg-paper p-8 md:p-9">
        <div className="font-mono text-[0.65rem] font-semibold tracking-widest uppercase text-ink-muted pb-3 mb-5 border-b border-border">
          // This programme is for you if —
        </div>
        <ul className="flex flex-col gap-3.5">
          {forYou.map((t, i) => (
            <li key={i} className="flex gap-3 text-sm font-light text-ink-soft leading-[1.65]">
              <span className="text-primary text-xs mt-1 font-semibold shrink-0">↗</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-paper p-8 md:p-9">
        <div className="font-mono text-[0.65rem] font-semibold tracking-widest uppercase text-ink-muted pb-3 mb-5 border-b border-border">
          // Look elsewhere if —
        </div>
        <ul className="flex flex-col gap-3.5">
          {notForYou.map((t, i) => (
            <li key={i} className="flex gap-3 text-sm font-light text-ink-soft leading-[1.65]">
              <span className="text-ink-faint text-xs mt-1 shrink-0">—</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-px bg-border border border-border mt-12 reveal">
      {prereqs.map((p) => (
        <div key={p.tag} className="bg-card p-7">
          <span
            className={`inline-block font-mono text-[0.6rem] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-sm mb-3.5 border ${tagClasses[p.color]}`}
          >
            {p.tag}
          </span>
          <ul className="flex flex-col gap-2">
            {p.items.map((it, i) => (
              <li key={i} className="text-sm font-light text-ink-soft leading-[1.65] pl-3 relative before:content-['·'] before:absolute before:left-0 before:text-ink-faint">
                {it}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);

export default WhoCanJoin;
