// The site's three languages. English, Urdu and Saraiki are equal: every page exists in all
// three. This file has no imports on purpose, so the Node check scripts can read it directly.

export const locales = ["en", "ur", "skr"] as const;
export type Locale = (typeof locales)[number];

/** English pages live at the root (/about/); the others under their code (/ur/about/). */
export const defaultLocale: Locale = "en";

/** Urdu and Saraiki share one root layout, written right to left. */
export const rtlLocales = ["ur", "skr"] as const;
export type RtlLocale = (typeof rtlLocales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function isRtlLocale(value: string): value is RtlLocale {
  return (rtlLocales as readonly string[]).includes(value);
}

export const direction: Record<Locale, "ltr" | "rtl"> = { en: "ltr", ur: "rtl", skr: "rtl" };

/** Each language's own name, written in its own script. These are never translated. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  ur: "اردو",
  skr: "سرائیکی",
};

/**
 * Codes for <link rel="alternate" hreflang>. Google accepts only two-letter language codes
 * there, and Saraiki has only the three-letter code skr, so Saraiki pages are left out of
 * hreflang. They are still linked from every page and listed in the sitemap.
 */
export const searchHreflang: Record<Locale, string | null> = { en: "en", ur: "ur", skr: null };

/** Locale codes for link previews (Open Graph). There is no code for Saraiki. */
export const openGraphLocale: Record<Locale, string | null> = {
  en: "en_GB",
  ur: "ur_PK",
  skr: null,
};
