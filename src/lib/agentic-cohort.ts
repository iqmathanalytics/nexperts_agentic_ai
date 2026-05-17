/** Agentic AI Engineering — cohort schedule (single source of truth for the landing page). */

export const COHORT_SCHEDULE = {
  days: "Mon, Wed, Fri",
  daysPill: "Mon · Wed · Fri",
  time: "6pm–10pm",
  delivery: "Microsoft Teams",
} as const;

export type CohortSlot = {
  label: string;
  startDate: string;
  dateRange: string;
  dateRangeShort: string;
  status: "full" | "open";
  statusLabel: string;
};

export const FIRST_COHORT: CohortSlot = {
  label: "Cohort 1",
  startDate: "6 June 2026",
  dateRange: "6 Jun – 14 Jul 2026",
  dateRangeShort: "6/6 – 14/7",
  status: "full",
  statusLabel: "Full",
};

export const NEXT_COHORT: CohortSlot = {
  label: "Next cohort",
  startDate: "6 July 2026",
  dateRange: "6 Jul – 21 Aug 2026",
  dateRangeShort: "6/7 – 21/8",
  status: "open",
  statusLabel: "Enrolling",
};

export const NEXT_COHORT_WEEKS = 7;
export const NEXT_COHORT_WEEKS_LABEL = "7 weeks";

/** Active cohort used for checkout, stats pills, and schedule copy. */
export const AGENTIC_COHORT = {
  ...COHORT_SCHEDULE,
  ...NEXT_COHORT,
  weeks: NEXT_COHORT_WEEKS,
  weeksLabel: NEXT_COHORT_WEEKS_LABEL,
};

export const AGENTIC_COHORT_SCHEDULE_LINE = `${COHORT_SCHEDULE.days} · ${COHORT_SCHEDULE.time} · ${NEXT_COHORT_WEEKS_LABEL}`;

export const AGENTIC_COHORT_SUMMARY = `${FIRST_COHORT.label} (${FIRST_COHORT.dateRange}) is full. ${NEXT_COHORT.label} ${NEXT_COHORT.dateRange} (${AGENTIC_COHORT_SCHEDULE_LINE}).`;

export const COHORT_BULLETS = [
  `${FIRST_COHORT.label} · ${FIRST_COHORT.dateRange} — ${FIRST_COHORT.statusLabel}`,
  `${NEXT_COHORT.label} · ${NEXT_COHORT.dateRange} — ${NEXT_COHORT.statusLabel}`,
] as const;
