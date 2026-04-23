const stats = [
  { n: "20", l: "Live instructor-led sessions" },
  { n: "80h", l: "Total hands-on training" },
  { n: "4h", l: "Per session · 6pm–10pm" },
  { n: "5+", l: "Frameworks mastered" },
  { n: "RM 1,899", l: "Founding cohort · Save RM 11,601", success: true },
];

const Stats = () => (
  <div className="bg-card border-b border-border flex flex-wrap reveal">
    {stats.map((s, i) => (
      <div
        key={i}
        className="flex-1 min-w-[50%] sm:min-w-[33%] md:min-w-0 px-5 py-7 border-r border-border last:border-r-0 hover:bg-paper transition-colors"
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
