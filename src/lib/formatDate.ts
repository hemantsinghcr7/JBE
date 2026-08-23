const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// DB date columns come back as plain "YYYY-MM-DD" strings. Passing those to
// `new Date()` parses them as UTC midnight, which can render as the previous
// day in some timezones — so split the parts instead of round-tripping a Date.
function parts(value: string): [number, number, number] | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/** "2026-08-10" → "10 Aug 2026" */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const p = parts(value);
  if (!p) return value;
  const [year, month, day] = p;
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

/** "2026-08-10" → "10 August 2026" — for detail pages, where there is room. */
export function formatDateLong(value: string | null | undefined): string {
  if (!value) return "—";
  const p = parts(value);
  if (!p) return value;
  const [year, month, day] = p;
  const full = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return full;
}
