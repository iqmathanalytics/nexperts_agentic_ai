const objectives = [
  "Build multi-agent AI systems where specialised agents collaborate to solve complex, real-world tasks autonomously",
  "Design and implement end-to-end RAG pipelines — from document ingestion to production-grade retrieval and generation",
  "Apply advanced retrieval techniques: semantic chunking, hybrid search, reranking, query rewriting and adaptive routing",
  "Develop production-ready LLM applications using LangChain, LangGraph, CrewAI, AutoGen and Azure AI platforms",
  "Integrate AI agents with external tools, APIs, databases and real-time data sources via MCP and function calling",
  "Implement short-term and long-term memory in agents and orchestrate multi-agent workflows using LangGraph state machines",
  "Evaluate and debug AI agent systems using LangSmith tracing, LLM-as-a-judge, hallucination detection and guardrails",
  "Optimise AI systems for latency, cost and performance — caching, retrieval tuning, model selection strategy",
  "Deploy and monitor scalable AI applications with FastAPI, Streamlit, Hugging Face and observability tools",
  "Build safe, responsible AI systems with guardrails, privacy controls and ethical governance frameworks",
];

const Objectives = () => (
  <section className="px-[5vw] py-20 md:py-24 bg-background">
    <div className="reveal">
      <div className="eyebrow mb-3.5">Programme Objectives</div>
      <h2 className="display text-foreground text-balance">
        10 things you will be able to<br />
        <em>do when you finish.</em>
      </h2>
      <p className="body-prose mt-3 max-w-xl">
        Not theory goals. Not "you will understand." Actual skills you can demonstrate on Day 1 after you leave.
      </p>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border mt-12 reveal">
      {objectives.map((o, i) => (
        <div key={i} className="bg-card p-7 hover:bg-paper transition-colors group">
          <div className="font-display text-2xl font-light text-primary mb-3 leading-none">
            {String(i + 1).padStart(2, "0")} <span className="text-ink-faint">—</span>
          </div>
          <p className="text-sm font-light text-ink-soft leading-[1.7]">
            <strong className="font-semibold text-foreground">{o.split("—")[0].split(" using ")[0].split(" with ")[0].split(":")[0]}</strong>
            {o.includes("—") && <> — {o.split("—").slice(1).join("—")}</>}
            {!o.includes("—") && o.includes(" using ") && <> using {o.split(" using ")[1]}</>}
            {!o.includes("—") && !o.includes(" using ") && o.includes(" with ") && <> with {o.split(" with ")[1]}</>}
            {!o.includes("—") && !o.includes(" using ") && !o.includes(" with ") && o.includes(":") && <>: {o.split(":")[1]}</>}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export default Objectives;
