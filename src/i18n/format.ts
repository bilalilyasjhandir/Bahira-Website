import type { Locale } from "./config";

// Dates are written the way each language prints them:
//   English          10 December 2025    25–26 June 2026    June 2026
//   Urdu, Saraiki    10 دسمبر 2025       25 تا 26 جون 2026   جون 2026
// Intl has no Saraiki data and silently falls back to US English, so Saraiki uses the Urdu
// month names. Urdu keeps Western digits. Intl's Urdu style adds a comma after the month
// in full dates and none in ranges; it is left out everywhere so all dates match. In
// right-to-left text a range written "25–26" can be read either way, so Urdu and Saraiki
// say "25 تا 26" (25 to 26), as Urdu print does.
// The parts of a date are joined with no-break spaces, so a line never ends on "10" with
// "December 2025" below it. A range of two months or years may break after its dash or تا.
const intlLocale: Record<Locale, string> = { en: "en-GB", ur: "ur-PK", skr: "ur-PK" };
const toWord: Record<Locale, string> = { en: "–", ur: "تا", skr: "تا" };
const NBSP = " ";

function parse(isoDate: string): Date {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate) || Number.isNaN(date.getTime())) {
    throw new Error(`Not a date: "${isoDate}"`);
  }
  return date;
}

function parts(date: Date, locale: Locale) {
  const found = new Intl.DateTimeFormat(intlLocale[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).formatToParts(date);
  const part = (type: string) => found.find((p) => p.type === type)?.value ?? "";
  return { day: part("day"), month: part("month"), year: part("year") };
}

/** A calendar date written "YYYY-MM-DD", e.g. "10 December 2025". */
export function formatDate(isoDate: string, locale: Locale): string {
  const { day, month, year } = parts(parse(isoDate), locale);
  return `${day}${NBSP}${month}${NBSP}${year}`;
}

/** Two dates, e.g. "25–26 June 2026", "30 June – 1 July 2026" or "25 تا 26 جون 2026". */
export function formatDateRange(startIso: string, endIso: string, locale: Locale): string {
  const a = parts(parse(startIso), locale);
  const b = parts(parse(endIso), locale);
  const to = toWord[locale];
  const end = `${b.day}${NBSP}${b.month}${NBSP}${b.year}`;
  // Two days of one month stay on one line. A dash between two numbers takes no spaces.
  if (a.year === b.year && a.month === b.month) {
    return `${a.day}${locale === "en" ? to : `${NBSP}${to}${NBSP}`}${end}`;
  }
  // Between words the dash takes spaces, and the line may break only after it.
  const start = `${a.day}${NBSP}${a.month}${a.year === b.year ? "" : `${NBSP}${a.year}`}`;
  return `${start}${NBSP}${to} ${end}`;
}

/** The month and year, for photo captions: "March 2026". */
export function formatMonth(isoDate: string, locale: Locale): string {
  const { month, year } = parts(parse(isoDate), locale);
  return `${month}${NBSP}${year}`;
}
