/** Agentic AI Engineering — cohort schedule (single source of truth for the landing page). */

export const AGENTIC_COURSE_PRICE = {
  amount: 1500,
  display: "RM\u00A01,500",
  marketValueDisplay: "RM 12,000+",
  savingsAmount: 10500,
  savingsDisplay: "RM 10,500",
  sstNote: "+ 8% SST",
} as const;

export const COHORT_SCHEDULE = {
  days: "Mon, Wed, Fri",
  daysPill: "Mon · Wed · Fri",
  time: "6:00 PM – 10:00 PM",
  timeShort: "6pm–10pm",
  delivery: "Microsoft Teams",
  hoursTotal: 96,
  hoursPerSession: 4,
  sessionsTotal: 24,
  daysPerWeek: 3,
  pythonWeekNote: "Includes a full week of Python programming training",
  ramadanNote:
    "Timings during Ramadhan can be affected. Final dates will be shared upon confirmation.",
} as const;

export type CohortSlot = {
  label: string;
  startDate: string;
  endDate: string;
  dateRange: string;
  dateRangeShort: string;
  status: "full" | "open";
  statusLabel: string;
};

/** Most recently filled cohort — shown struck-through in the hero badge. */
export const FULL_COHORT: CohortSlot = {
  label: "Cohort 6",
  startDate: "16 November 2026",
  endDate: "8 January 2027",
  dateRange: "16 Nov 2026 – 8 Jan 2027",
  dateRangeShort: "16/11 – 8/1",
  status: "full",
  statusLabel: "Full",
};

/** Active enrolling cohort — checkout, stats pills, and schedule copy. */
export const NEXT_COHORT: CohortSlot = {
  label: "Cohort 7",
  startDate: "25 January 2027",
  endDate: "19 March 2027",
  dateRange: "25 Jan 2027 – 19 Mar 2027",
  dateRangeShort: "25/1 – 19/3",
  status: "open",
  statusLabel: "Enrolling",
};

export const NEXT_COHORT_WEEKS = 8;
export const NEXT_COHORT_WEEKS_LABEL = "8 weeks";

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

export const AGENTIC_COHORT_SCHEDULE_LINE = `${COHORT_SCHEDULE.days} · ${COHORT_SCHEDULE.timeShort} · ${NEXT_COHORT_WEEKS_LABEL}`;

export const AGENTIC_COHORT_SUMMARY = `${FULL_COHORT.label} (${FULL_COHORT.dateRange}) is full. ${NEXT_COHORT.label} ${NEXT_COHORT.dateRange} (${AGENTIC_COHORT_SCHEDULE_LINE}). ${COHORT_SEATS.highlight}. ${COHORT_SCHEDULE.pythonWeekNote}. ${COHORT_SCHEDULE.ramadanNote}`;

export const COHORT_BULLETS = [
  `${FULL_COHORT.label} · ${FULL_COHORT.dateRange} — ${FULL_COHORT.statusLabel}`,
  `${NEXT_COHORT.label} · ${NEXT_COHORT.dateRange} — ${NEXT_COHORT.statusLabel}`,
  COHORT_SEATS.highlight,
  COHORT_SCHEDULE.pythonWeekNote,
  COHORT_SCHEDULE.ramadanNote,
] as const;
