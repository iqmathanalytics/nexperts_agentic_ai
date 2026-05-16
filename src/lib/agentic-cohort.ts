/** Agentic AI Engineering — founding cohort schedule (single source of truth for the landing page). */
export const AGENTIC_COHORT = {
  label: "Next cohort",
  startDate: "6 June 2026",
  dateRange: "6 Jun – 14 Jul 2026",
  dateRangeShort: "6/6 – 14/7",
  days: "Mon, Wed, Fri",
  daysPill: "Mon · Wed · Fri",
  time: "6pm–10pm",
  weeks: 7,
  weeksLabel: "7 weeks",
  delivery: "Microsoft Teams",
} as const;

export const AGENTIC_COHORT_SCHEDULE_LINE = `${AGENTIC_COHORT.days} · ${AGENTIC_COHORT.time} · ${AGENTIC_COHORT.weeksLabel}`;

export const AGENTIC_COHORT_SUMMARY = `Next cohort ${AGENTIC_COHORT.dateRange} (${AGENTIC_COHORT_SCHEDULE_LINE})`;
