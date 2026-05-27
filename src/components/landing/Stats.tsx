import { AGENTIC_COHORT } from "@/lib/agentic-cohort";

const stats = [
  { n: "20", l: "Live instructor-led sessions" },
  { n: "80h", l: "Total hands-on training" },
  { n: String(AGENTIC_COHORT.weeks), l: `Weeks · ${AGENTIC_COHORT.daysPill}` },
  { n: "4h", l: `Per session · ${AGENTIC_COHORT.time}` },
  { n: "5+", l: "Frameworks mastered" },
  { n: "RM 799", l: "Limited offer · Save RM 11,201", success: true },
];

const Stats = () => (
  <div className="grid grid-cols-2 gap-px border-b border-border bg-border reveal sm:grid-cols-3 md:flex">
    {stats.map((s, i) => (
      <div
        key={i}
        className="bg-card px-4 py-6 transition-colors hover:bg-paper sm:px-5 sm:py-7 md:flex-1 md:border-r md:border-border md:last:border-r-0"
      >
        <div
          className={`font-display text-3xl font-light leading-none mb-1 ${
            s.success ? "text-success" : "text-primary"
          }`}
        >
          {s.n}
        </div>
        <div className="text-[0.7rem] text-ink-faint leading-snug">{s.l}</div>
      </div>
    ))}
  </div>
);

export default Stats;
