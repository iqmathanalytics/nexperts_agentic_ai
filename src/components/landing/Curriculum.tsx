const curriculum = [
  { n: 1, title: "Python Setup & Foundations for AI", sub: "Python environments (venv/conda), VS Code setup, pip, variables, data types, strings, loops, functions. Build a simple prompt formatter.", tools: "Python · VS Code" },
  { n: 2, title: "Python for Data & APIs", sub: "Lists, dicts, JSON, file I/O, try-except, requests library, API keys, environment variables. Call a live API.", tools: "requests · json · os" },
  { n: 3, title: "OOP, Async & Data Handling for AI Systems", sub: "Classes for AI components, async/await for parallel API calls, pandas basics, regex text processing. Mini AI pipeline.", tools: "pandas · asyncio" },
  { n: 4, title: "NLP Foundations & Text Processing", sub: "Tokenization, lemmatization, embeddings, Word2Vec, TF-IDF, classification, sentiment, NER, POS, ingestion with pandas.", tools: "NLTK · SpaCy" },
  { n: 5, title: "Language Models & Transformers", sub: "RNN→LSTM→Transformers evolution, attention, BPE/WordPiece, pretraining vs fine-tuning, RLHF, LLMs vs SLMs.", tools: "TensorFlow · HuggingFace" },
  { n: 6, title: "Generative AI, Prompting & Multi-Modal", sub: "Prompt engineering, temperature/top-k/top-p, hallucination control, multi-modal (text+vision+audio), GPT vision, voice AI, STT.", tools: "Azure AI · Copilot" },
  { n: 7, title: "AI Platforms & LangChain Foundations", sub: "OpenAI API, LangChain — chat models, prompt templates, chains, tools, memory. AutoGen intro. Build quiz bot and chatbot.", tools: "LangChain · AutoGen" },
  { n: 8, title: "Vector Databases & Introduction to RAG", sub: "Embeddings, vector DBs (ChromaDB, FAISS, Pinecone), similarity search, document loaders, chunking. Build a retrieval pipeline.", tools: "ChromaDB · LangChain" },
  { n: 9, title: "Production RAG", sub: "Document ingestion, chunking, query transformation, hybrid retrieval, context optimisation, caching, RAGAS evaluation.", tools: "LangChain · Azure OpenAI" },
  { n: 10, title: "Advanced RAG", sub: "Multi-hop reasoning, knowledge graphs, Naïve vs Advanced vs Agentic RAG, cost optimisation, guardrails, Corrective RAG, Graph RAG.", tools: "LangChain · Azure OpenAI" },
  { n: 11, title: "Agentic AI Foundations", sub: "Agent lifecycle, tool use, API connections, router vs autonomous architectures, single vs multi-agent systems, state, failure handling.", tools: "LangChain · CrewAI · AutoGen" },
  { n: 12, title: "Decision Making, Planning & MCP", sub: "Goal setting, hierarchical vs reactive planning, MCP fundamentals vs OpenAI function calling, MCP setup, IDE agents, multi-tool orchestration.", tools: "Anthropic Claude · AutoGen" },
  { n: 13, title: "Custom Copilots & Multi-Modal Case Study", sub: "Custom copilots with Azure AI Studio. Project: Multi-modal travel planner — 7 agents (User, Planner, Vision, RAG, Speech, Summariser, Weather).", tools: "Azure AI Studio · CrewAI" },
  { n: 14, title: "Memory & Knowledge Retrieval in Agents", sub: "Memory architectures (short/long-term, vector vs symbolic, episodic vs semantic), compression, Agentic RAG, customer support case study.", tools: "LangChain · ChromaDB" },
  { n: 15, title: "LangGraph Orchestration & Multi-Agent Systems", sub: "LangGraph state machines, agent graphs, CrewAI orchestration, comparing LangGraph vs CrewAI vs Flowise, resilient workflows.", tools: "LangGraph · CrewAI · Flowise" },
  { n: 16, title: "Learning, Adaptation & Deployment", sub: "RL fundamentals, RLHF, reward systems. App structure (API+Worker+VectorDB), hosting, latency, observability with LangSmith.", tools: "Streamlit · HuggingFace · LangSmith" },
  { n: 17, title: "Advanced Multi-Agent Orchestration", sub: "Build a full LangGraph multi-agent system. Router → Planner → parallel Research+Analysis → Synthesis. Deploy end-to-end.", tools: "LangGraph · FastAPI" },
  { n: 18, title: "Evaluation, Debugging & Ethics", sub: "Agent evaluation metrics, logging, tracing, LLM-as-a-judge, hallucination detection, guardrails, failure modes, responsible AI.", tools: "LangSmith" },
  { n: 19, title: "Capstone — Build Phase", sub: "AI Financial Advisor: Data → Analysis → Risk → Advisory → QA agents. Full LangGraph orchestration, evaluation, FastAPI + Streamlit.", tools: "LangGraph · FastAPI · Streamlit" },
  { n: 20, title: "Capstone — Present, Deploy & Graduate ★", sub: "Final deployment, live Q&A, peer showcase. Each participant presents. Evaluation against production criteria. Certificate awarded.", tools: "All Tools · Certificate", capstone: true },
];

const tools = ["Python","LangChain","LangGraph","CrewAI","AutoGen","Flowise","Azure OpenAI","Azure AI Studio","HuggingFace","ChromaDB · FAISS","FastAPI","Streamlit","LangSmith","Anthropic Claude","TensorFlow","NLTK · SpaCy"];

const Curriculum = () => (
  <section id="curriculum" className="px-[5vw] py-20 md:py-24 bg-paper">
    <div className="reveal">
      <div className="eyebrow mb-3.5">The Curriculum</div>
      <h2 className="display text-foreground text-balance">
        20 sessions. 80 hours.<br />
        <em>From Python to production.</em>
      </h2>
      <p className="body-prose mt-3 max-w-xl">
        Each session is 4 hours of live, hands-on training. You build alongside the instructor — no passive watching.
      </p>
    </div>

    <div className="mt-12 border border-border bg-card reveal">
      <div className="hidden md:grid grid-cols-[64px_1fr_220px] bg-foreground/5 border-b border-border">
        <div className="px-4 py-3 font-mono text-[0.6rem] font-semibold tracking-widest uppercase text-ink-faint text-center">#</div>
        <div className="px-5 py-3 font-mono text-[0.6rem] font-semibold tracking-widest uppercase text-ink-faint border-l border-border">Session</div>
        <div className="px-5 py-3 font-mono text-[0.6rem] font-semibold tracking-widest uppercase text-ink-faint border-l border-border">Tools</div>
      </div>
      {curriculum.map((s) => (
        <div
          key={s.n}
          className={`grid grid-cols-[52px_1fr] md:grid-cols-[64px_1fr_220px] border-b border-border last:border-b-0 group hover:bg-paper transition-colors ${
            s.capstone ? "bg-primary/[0.04]" : ""
          }`}
        >
          <div className={`flex items-center justify-center font-display text-2xl font-light leading-none border-r border-border py-5 transition-colors ${
            s.capstone ? "text-primary" : "text-border group-hover:text-primary"
          }`}>
            {s.n}
          </div>
          <div className="px-5 py-4">
            <div className={`text-sm font-semibold leading-snug mb-1 ${s.capstone ? "text-primary" : "text-foreground"}`}>
              {s.title}
            </div>
            <div className="text-xs font-light text-ink-faint leading-[1.6]">{s.sub}</div>
          </div>
          <div className="hidden md:flex items-center px-5 py-4 border-l border-border">
            <span className="font-mono text-[0.65rem] text-ink-muted bg-paper border border-border px-2.5 py-1 rounded-sm">
              {s.tools}
            </span>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-9 flex flex-wrap gap-1.5 items-center reveal">
      <span className="text-xs text-ink-faint mr-2">Frameworks & Tools:</span>
      {tools.map((t) => (
        <span key={t} className="font-mono text-[0.66rem] text-ink-muted bg-card border border-border px-2.5 py-1 rounded-sm">
          {t}
        </span>
      ))}
    </div>
  </section>
);

export default Curriculum;
