/** Global AI Hackathon 2026 — Grand Finale, Kuala Lumpur (public/hackathon). */

const HACKATHON_FILES = [
  "WhatsApp Image 2026-05-13 at 11.53.20.jpeg",
  "WhatsApp Image 2026-05-13 at 11.53.20 (1).jpeg",
  "WhatsApp Image 2026-05-13 at 11.53.20 (3).jpeg",
  "WhatsApp Image 2026-05-13 at 11.53.20 (4).jpeg",
  "WhatsApp Image 2026-05-13 at 11.53.20 (5).jpeg",
  "WhatsApp Image 2026-05-13 at 11.53.20 (6).jpeg",
  "WhatsApp Image 2026-05-13 at 11.53.20 (7).jpeg",
  "WhatsApp Image 2026-05-13 at 11.53.20 (8).jpeg",
  "WhatsApp Image 2026-05-13 at 11.53.20 (9).jpeg",
  "WhatsApp Image 2026-05-13 at 11.53.20 (10).jpeg",
  "WhatsApp Image 2026-05-13 at 11.53.20 (11).jpeg",
  "WhatsApp Image 2026-05-13 at 11.53.20 (12).jpeg",
  "WhatsApp Image 2026-05-13 at 11.53.21.jpeg",
] as const;

export const HACKATHON_EVENT = {
  name: "Global AI Hackathon 2026",
  chapter: "Grand Finale",
  location: "Kuala Lumpur, Malaysia",
  when: "May 2026",
} as const;

export type HackathonSlide = {
  src: string;
  alt: string;
};

export const HACKATHON_SLIDES: HackathonSlide[] = HACKATHON_FILES.map((file, index) => ({
  src: `/hackathon/${encodeURIComponent(file)}`,
  alt: `${HACKATHON_EVENT.name} — ${HACKATHON_EVENT.chapter}, ${HACKATHON_EVENT.location}. Photo ${index + 1}.`,
}));
