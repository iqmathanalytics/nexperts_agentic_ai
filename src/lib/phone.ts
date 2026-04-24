/** Malaysia mobile: user enters local digits after +60 (e.g. 11-1221-6870). */
export function normalizeMalaysiaPhone(localRaw: string): string | null {
  const digits = localRaw.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("60")) return `+${digits}`;
  if (digits.startsWith("0")) return `+60${digits.slice(1)}`;
  return `+60${digits}`;
}
