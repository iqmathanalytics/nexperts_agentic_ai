export type DemoType = "agentic-ai-demo" | "vibe-coding-demo";

export type DemoRegistrationDetails = {
  key: DemoType;
  title: string;
  subtitle: string;
  sessionId: string;
  dateDisplay: string;
  day: string;
  time: string;
  timezone: string;
  sessionLabel: string;
  teamsJoinUrl: string;
  meetingId: string;
  passcode: string;
  accent: string;
  accentSoft: string;
  topics: string[];
  highlights: string[];
};

export const DEMO_REGISTRATION_DETAILS: Record<DemoType, DemoRegistrationDetails> = {
  "agentic-ai-demo": {
    key: "agentic-ai-demo",
    title: "Agentic AI Demo",
    subtitle: "Stock Market Intelligence Agent — live, autonomous AI in action",
    sessionId: "2026-06-20",
    dateDisplay: "20.06.2026",
    day: "Saturday",
    time: "10:00 AM – 12:00 PM",
    timezone: "Malaysian Time (MYT)",
    sessionLabel: "Saturday, 20 June 2026 · 10:00 AM – 12:00 PM (MYT)",
    teamsJoinUrl: "https://teams.microsoft.com/meet/47248050328262?p=Qtjmv8Pikhsy8hUdtX",
    meetingId: "472 480 503 282 62",
    passcode: "FB9Gu9RV",
    accent: "#00d4aa",
    accentSoft: "rgba(0,212,170,0.12)",
    topics: [
      "How an AI agent receives a goal, plans steps, and executes without manual intervention",
      "Live connection to Yahoo Finance & Google Finance — real market data, real time",
      "Autonomous stock screening: undervalued picks, rankings, and buy/hold signal reports",
      "Hands-on Q&A — ask the agent questions and watch it respond live",
      "Tools in focus: LangGraph, LangChain, Python, and production-grade LLM workflows",
    ],
    highlights: [
      "2-hour interactive live session",
      "50 seats · Free · Online via Microsoft Teams",
      "No prior AI engineering experience required to follow along",
    ],
  },
  "vibe-coding-demo": {
    key: "vibe-coding-demo",
    title: "Vibe Coding Demo",
    subtitle: "Build a live dashboard from plain English — no syntax required",
    sessionId: "2026-06-21",
    dateDisplay: "21.06.2026",
    day: "Sunday",
    time: "10:00 AM – 12:00 PM",
    timezone: "Malaysian Time (MYT)",
    sessionLabel: "Sunday, 21 June 2026 · 10:00 AM – 12:00 PM (MYT)",
    teamsJoinUrl: "https://teams.microsoft.com/meet/45030800142514?p=nbuotlbpylaU9XedP0",
    meetingId: "450 308 001 425 14",
    passcode: "fX9Hd2bj",
    accent: "#38bdf8",
    accentSoft: "rgba(56,189,248,0.12)",
    topics: [
      "Start from a blank screen — no template, no pre-written code",
      "Describe layouts, charts, and data in plain English; AI writes the full frontend live",
      "Iterate in real time: colours, tables, chart types, and UX tweaks by conversation",
      "Deploy a working app with a live URL before the session ends",
      "Tools in focus: Cursor, Claude / GPT-4o, React, and Tailwind — the modern vibe-coding stack",
    ],
    highlights: [
      "2-hour interactive live session",
      "50 seats · Free · Online via Microsoft Teams",
      "Ideal for leaders, analysts, and builders who want to ship faster with AI",
    ],
  },
};

export function isDemoType(value: string): value is DemoType {
  return value === "agentic-ai-demo" || value === "vibe-coding-demo";
}

export function getDemoDetails(demoType: string): DemoRegistrationDetails | null {
  if (!isDemoType(demoType)) return null;
  return DEMO_REGISTRATION_DETAILS[demoType];
}
