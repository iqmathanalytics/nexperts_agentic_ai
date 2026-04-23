const outcomes = [
  { t: "A Deployed Multi-Agent AI Financial Advisor", d: "Your capstone is a production-grade system with 5 specialised agents — Data, Analysis, Risk, Advisory, QA — orchestrated via LangGraph, deployed on FastAPI with Streamlit UI. Goes directly into your portfolio." },
  { t: "End-to-End RAG Pipeline You Built and Evaluated", d: "Not a tutorial pipeline — a production RAG with hybrid search, cross-encoder reranking, query rewriting, metadata filtering, and RAGAS evaluation. Built from scratch — you know why every component exists." },
  { t: "Hands-on Fluency in 5+ AI Frameworks", d: "LangChain, LangGraph, CrewAI, AutoGen, Flowise — real projects with each, not just demos. You'll know when to use which framework and why." },
  { t: "Production-Grade Skills Most Tutorials Skip", d: "Evaluation, observability, guardrails, cost optimisation, latency tuning, deployment, monitoring — the unglamorous things that separate hobbyists from engineers." },
  { t: "Professional Certificate of Completion", d: "Upon successful completion of the 20-session programme and capstone evaluation, you receive a Nexperts Academy Professional Certificate in Agentic AI Engineering." },
  { t: "Lifetime Access to Course Materials & Community", d: "Slides, notebooks, recordings, and our private alumni community. Stay connected with peers and instructors after the cohort ends." },
];

const Outcomes = () => (
  <section className="px-[5vw] py-20 md:py-24 bg-background">
    <div className="reveal">
      <div className="eyebrow mb-3.5">What You Walk Away With</div>
      <h2 className="display text-foreground text-balance">
        Real outcomes.<br />
        <em>Not just a certificate.</em>
      </h2>
      <p className="body-prose mt-3 max-w-xl">
        By the end of 80 hours, here's exactly what you'll have built, learned and be able to demonstrate to any
        employer or client.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-6 mt-12 reveal">
      {outcomes.map((o, i) => (
        <article
          key={i}
          className="group relative bg-card border border-border p-7 md:p-8 hover:border-primary/30 hover:shadow-soft transition-all"
        >
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="font-display text-4xl font-light text-primary leading-none mb-4">
            {String(i + 1).padStart(2, "0")}
          </div>
          <h3 className="font-display text-xl md:text-2xl font-medium text-foreground leading-tight mb-3">{o.t}</h3>
          <p className="text-sm font-light text-ink-muted leading-[1.75]">{o.d}</p>
        </article>
      ))}
    </div>
  </section>
);

export default Outcomes;
