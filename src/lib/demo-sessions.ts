export type DemoProgramme = "agentic-ai-demo" | "vibe-coding-demo";

export type DemoSession = {
  id: string;
  dateDisplay: string;
  day: string;
  time: string;
  label: string;
  shortLabel: string;
};

export type DemoProgrammeConfig = {
  key: DemoProgramme;
  title: string;
  registerLabel: string;
  accentClass: "agentic" | "vibe";
  session: DemoSession;
};

export const DEMO_PROGRAMMES: Record<DemoProgramme, DemoProgrammeConfig> = {
  "agentic-ai-demo": {
    key: "agentic-ai-demo",
    title: "Agentic AI Demo",
    registerLabel: "Register for Agentic AI Demo",
    accentClass: "agentic",
    session: {
      id: "2026-06-20",
      dateDisplay: "20.06.2026",
      day: "Saturday",
      time: "10:00 AM – 12:00 PM",
      label: "Saturday, 20 June 2026 · 10:00 AM – 12:00 PM (MYT)",
      shortLabel: "20 June 2026",
    },
  },
  "vibe-coding-demo": {
    key: "vibe-coding-demo",
    title: "Vibe Coding Demo",
    registerLabel: "Register for Vibe Coding Demo",
    accentClass: "vibe",
    session: {
      id: "2026-06-21",
      dateDisplay: "21.06.2026",
      day: "Sunday",
      time: "10:00 AM – 12:00 PM",
      label: "Sunday, 21 June 2026 · 10:00 AM – 12:00 PM (MYT)",
      shortLabel: "21 June 2026",
    },
  },
};

export const DEMO_TIME_SLOT = "10:00 AM – 12:00 PM Malaysian Time";
export const DEMO_SEATS_NOTE = "50 seats · Free · Online via Microsoft Teams";
