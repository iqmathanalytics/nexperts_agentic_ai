import { WHATSAPP_HREF } from "@/lib/whatsapp";

type TeamMember = {
  i: string;
  n: string;
  r: string;
  b: string;
  linkedin?: string;
  linkedinUrl?: string;
  whatsapp?: string;
};

const team: TeamMember[] = [
  {
    i: "N",
    n: "Nazreen",
    r: "Director",
    b: "Leads Nexperts Academy's strategic direction. Driving Malaysia's AI training ecosystem.",
    linkedinUrl: "https://www.linkedin.com/in/nazreen-abdul-ghani-8b36145a/",
  },
  {
    i: "V",
    n: "Vaheed",
    r: "CEO · +60 111-221-6870",
    b: "10+ years in IT training and technology. Leads operations and business development.",
    linkedinUrl: "https://www.linkedin.com/in/abdul-vaheed-2b5a5720/",
    whatsapp: "601112216870",
  },
  {
    i: "A",
    n: "Ajith Kumar",
    r: "AI Trainer · LangChain · LangGraph",
    b: "AI practitioner with hands-on production AI experience. Leads the Agentic AI Engineering programme.",
    linkedinUrl: "https://www.linkedin.com/in/ajithkumar54",
  },
  {
    i: "Y",
    n: "Yash Sharma",
    r: "AI Trainer · Python · RAG · Multi-Agent",
    b: "Specialises in Python, RAG and multi-agent systems. Co-leads the technical sessions.",
    linkedinUrl: "https://www.linkedin.com/in/yash-sharma2426",
  },
];

const About = () => (
  <section id="about" className="px-[5vw] py-20 md:py-24 bg-obsidian relative overflow-hidden">
    <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
         style={{ background: "radial-gradient(circle, hsl(var(--primary-glow) / 0.08), transparent 70%)" }} />

    <div className="relative reveal">
      <div className="flex items-center gap-2.5 mb-3.5">
        <span className="w-3.5 h-px bg-primary-glow/60" />
        <span className="font-mono text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-primary-glow">
          About Nexperts Academy
        </span>
      </div>
      <h2 className="font-display text-3xl md:text-5xl font-light text-white leading-[1.1] mb-10 text-balance">
        10+ years training<br />
        <em className="not-italic italic text-primary-glow">Malaysia's best IT talent.</em>
      </h2>
    </div>

    <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
      <div className="reveal">
        <p className="text-[0.95rem] font-light text-white/50 leading-[1.85] mb-5">
          Nexperts Academy has been Malaysia's trusted IT training provider since 2013. Based in Petaling Jaya,
          we've trained thousands of professionals from corporations, government agencies and startups in Cisco,
          Microsoft Azure, cybersecurity, data science — and now, Agentic AI Engineering.
        </p>

        <div className="rounded-md p-5 mb-7" style={{ background: "hsl(var(--primary-glow) / 0.05)", border: "1px solid hsl(var(--primary-glow) / 0.15)" }}>
          <div className="font-mono text-[0.58rem] font-semibold tracking-widest uppercase text-primary-glow mb-3">
            Our Two Platforms
          </div>
          <a href="https://www.nexpertsacademy.com" target="_blank" rel="noopener"
             className="flex items-center gap-3 p-2.5 mb-1.5 rounded-sm bg-white/[0.03] border border-white/[0.06] hover:border-primary-glow/30 transition-colors">
            <span className="text-base">🌐</span>
            <div>
              <div className="font-mono text-[0.7rem] text-white/85 font-medium">nexpertsacademy.com</div>
              <div className="text-[0.65rem] text-white/30">Networking · Cloud · Cybersecurity · Data Science · All IT</div>
            </div>
          </a>
          <div className="flex items-center gap-3 p-2.5 rounded-sm" style={{ background: "hsl(var(--primary-glow) / 0.06)", border: "1px solid hsl(var(--primary-glow) / 0.22)" }}>
            <span className="text-base">🤖</span>
            <div>
              <div className="font-mono text-[0.7rem] text-primary-glow font-medium">This page — AI Programmes Hub</div>
              <div className="text-[0.65rem] text-white/35">All Agentic AI · LLM · AI Engineering courses</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-px bg-white/[0.06] border border-white/[0.06] rounded-sm overflow-hidden">
          {[
            ["10+", "Years"],
            ["5k+", "Alumni"],
            ["50+", "Courses"],
            ["RM15k", "Top Prog."],
          ].map(([n, l]) => (
            <div key={l} className="bg-obsidian px-2 py-4 text-center">
              <div className="font-display text-2xl font-light text-primary-glow leading-none">{n}</div>
              <div className="font-mono text-[0.55rem] text-white/40 uppercase mt-1.5 tracking-wider">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div id="instructor" className="reveal scroll-mt-24">
        <div className="font-mono text-[0.58rem] font-semibold tracking-widest uppercase text-white/40 mb-4">
          Meet The Team
        </div>
        <div className="flex flex-col gap-2.5">
          {team.map((m) => (
            <div key={m.n}
                 className="flex gap-3.5 bg-obsidian-soft border border-white/[0.06] rounded-md p-4 hover:border-primary-glow/25 transition-colors">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-display text-xl text-primary-glow shrink-0"
                   style={{ background: "hsl(var(--primary-glow) / 0.12)", border: "1px solid hsl(var(--primary-glow) / 0.25)" }}>
                {m.i}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white/90 mb-0.5">{m.n}</div>
                <div className="font-mono text-[0.6rem] text-primary-glow mb-2">{m.r}</div>
                <div className="text-xs text-white/40 leading-[1.6] mb-2.5">{m.b}</div>
                <div className="flex gap-1.5 flex-wrap">
                  <a
                    href={m.linkedinUrl ?? (m.linkedin ? `https://www.linkedin.com/in/${m.linkedin}` : "#")}
                    target="_blank"
                    rel="noopener"
                     className="font-mono text-[0.58rem] text-primary-glow border border-primary-glow/25 bg-primary-glow/[0.06] px-2 py-0.5 rounded-sm hover:bg-primary-glow/15 transition-colors">
                    LinkedIn ↗
                  </a>
                  {m.whatsapp && (
                    <a href={WHATSAPP_HREF} target="_blank" rel="noopener"
                       className="font-mono text-[0.58rem] text-success border border-success/25 bg-success/[0.06] px-2 py-0.5 rounded-sm hover:bg-success/15 transition-colors">
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default About;
