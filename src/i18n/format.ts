import type { Locale } from "./config";

// Intl has no Saraiki data and silently falls back to US English ("December 10, 2025"),
// so Saraiki dates use the Urdu month names. Urdu output keeps Western digits:
// "10 دسمبر، 2025".
const dateLocale: Record<Locale, string> = { en: "en-GB", ur: "ur-PK", skr: "ur-PK" };

/** Formats a calendar date written as "YYYY-MM-DD", e.g. "10 December 2025". */
export function formatDate(isoDate: string, locale: Locale): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) throw new Error(`Not a date: "${isoDate}"`);
  return new Intl.DateTimeFormat(dateLocale[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
