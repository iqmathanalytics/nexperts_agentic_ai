/** Agentic AI Engineering — cohort schedule (single source of truth for the landing page). */

export const AGENTIC_COURSE_PRICE = {
  amount: 799,
  display: "RM\u00A0799",
  marketValueDisplay: "RM 12,000+",
  savingsAmount: 11201,
  savingsDisplay: "RM 11,200",
  sstNote: "excluding 8% SST",
} as const;

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

/** Most recently filled cohort — shown struck-through in the hero badge. */
export const FULL_COHORT: CohortSlot = {
  label: "Cohort 5",
  startDate: "26 October 2026",
  dateRange: "26 Oct – 11 Dec 2026",
  dateRangeShort: "26/10 – 11/12",
  status: "full",
  statusLabel: "Full",
};

/** Active enrolling cohort — checkout, stats pills, and schedule copy. */
export const NEXT_COHORT: CohortSlot = {
  label: "Cohort 6",
  startDate: "16 November 2026",
  dateRange: "16 Nov 2026 – 2 Jan 2027",
  dateRangeShort: "16/11 – 2/1",
  status: "open",
  statusLabel: "Enrolling",
};

export const NEXT_COHORT_WEEKS = 7;
export const NEXT_COHORT_WEEKS_LABEL = "7 weeks";

/** Limited intake callout — highlighted with bump animation in the hero. */
export const COHORT_SEATS = {
  count: 100,
  label: "100 seats only",
  highlight: "100 seats only available",
} as const;

export const AGENTIC_COHORT = {
  ...COHORT_SCHEDULE,
  ...NEXT_COHORT,
  weeks: NEXT_COHORT_WEEKS,
  weeksLabel: NEXT_COHORT_WEEKS_LABEL,
  seats: COHORT_SEATS.count,
};

export const AGENTIC_COHORT_SCHEDULE_LINE = `${COHORT_SCHEDULE.days} · ${COHORT_SCHEDULE.time} · ${NEXT_COHORT_WEEKS_LABEL}`;

export const AGENTIC_COHORT_SUMMARY = `${FULL_COHORT.label} (${FULL_COHORT.dateRange}) is full. ${NEXT_COHORT.label} ${NEXT_COHORT.dateRange} (${AGENTIC_COHORT_SCHEDULE_LINE}). ${COHORT_SEATS.highlight}.`;

export const COHORT_BULLETS = [
  `${FULL_COHORT.label} · ${FULL_COHORT.dateRange} — ${FULL_COHORT.statusLabel}`,
  `${NEXT_COHORT.label} · ${NEXT_COHORT.dateRange} — ${NEXT_COHORT.statusLabel}`,
  COHORT_SEATS.highlight,
] as const;
