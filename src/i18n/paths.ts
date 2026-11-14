import { locales, searchHreflang, type Locale } from "./config";

/**
 * The address of a page in a language. Paths are written with a trailing slash, as the
 * site is exported with one: localePath("ur", "/about/") is "/ur/about/".
 */
export function localePath(locale: Locale, path: string): string {
  if (!path.startsWith("/") || !path.endsWith("/")) {
    throw new Error(`Page paths start and end with "/": got "${path}"`);
  }
  return locale === "en" ? path : `/${locale}${path}`;
}

/**
 * The hreflang alternates of a page for search engines: English, Urdu and x-default.
 * Saraiki has no two-letter code, so it is not listed (see searchHreflang).
 */
export function searchAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    const code = searchHreflang[locale];
    if (code) languages[code] = localePath(locale, path);
  }
  languages["x-default"] = localePath("en", path);
  return languages;
}
