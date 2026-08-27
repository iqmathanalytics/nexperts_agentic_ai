/** Human-readable programme label for Google Sheets (Leads / Payments). */

export const PROGRAMME_PAGE_LABELS = {
  "agentic-ai-founding": "Agentic AI",
  "vibe-coding-bootcamp": "Vibe Coding",
  "generative-ai-corporate": "Generative AI Corporate",
} as const;

export type ProgrammeCourseKey = keyof typeof PROGRAMME_PAGE_LABELS;

export function programmePageFromCourse(course: string | undefined): string {
  const key = String(course || "")
    .trim()
    .toLowerCase() as ProgrammeCourseKey;
  if (key in PROGRAMME_PAGE_LABELS) return PROGRAMME_PAGE_LABELS[key];
  if (key.includes("vibe")) return "Vibe Coding";
  if (key.includes("corporate") || key.includes("generative-ai")) return "Generative AI Corporate";
  return "Agentic AI";
}
