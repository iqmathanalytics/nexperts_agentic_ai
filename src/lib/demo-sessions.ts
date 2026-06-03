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
      id: "2026-06-08",
      dateDisplay: "08.06.2026",
      day: "Monday",
      time: "8:00 PM – 10:00 PM",
      label: "Monday, 8 June 2026 · 8:00 PM – 10:00 PM (MYT)",
      shortLabel: "8 June 2026",
    },
  },
  "vibe-coding-demo": {
    key: "vibe-coding-demo",
    title: "Vibe Coding Demo",
    registerLabel: "Register for Vibe Coding Demo",
    accentClass: "vibe",
    session: {
      id: "2026-06-12",
      dateDisplay: "12.06.2026",
      day: "Friday",
      time: "8:00 PM – 10:00 PM",
      label: "Friday, 12 June 2026 · 8:00 PM – 10:00 PM (MYT)",
      shortLabel: "12 June 2026",
    },
  },
};

export const DEMO_TIME_SLOT = "8:00 PM – 10:00 PM Malaysian Time";
export const DEMO_SEATS_NOTE = "50 seats · Free · Online via Microsoft Teams";
