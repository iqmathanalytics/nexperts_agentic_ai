/** Server-side course keys → Stripe Price env var names (values set in Pages secrets / .dev.vars). */
export const CHECKOUT_COURSES = {
  "agentic-ai-founding": "STRIPE_PRICE_ID",
  "vibe-coding-bootcamp": "STRIPE_VIBE_PRICE_ID",
} as const;

export type CheckoutCourse = keyof typeof CHECKOUT_COURSES;

export function parseCheckoutCourse(raw: unknown): CheckoutCourse {
  const value = String(raw || "agentic-ai-founding").trim();
  if (value in CHECKOUT_COURSES) return value as CheckoutCourse;
  return "agentic-ai-founding";
}

export function priceIdForCourse(
  course: CheckoutCourse,
  env: Record<string, string | undefined>,
): string | null {
  const key = CHECKOUT_COURSES[course];
  const id = env[key]?.trim();
  return id || null;
}
