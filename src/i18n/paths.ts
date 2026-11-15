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
 * Where the language chooser links on a page that does not exist in every language (an
 * update not yet translated): the same page where it exists, else `fallback`, the page of
 * its section ("/updates/") in that language.
 */
export function languagePaths(
  path: string,
  available: readonly Locale[],
  fallback: string,
): Record<Locale, string> {
  return Object.fromEntries(
    locales.map((locale) => [
      locale,
      localePath(locale, available.includes(locale) ? path : fallback),
    ]),
  ) as Record<Locale, string>;
}

/**
 * The hreflang alternates of a page for search engines: English, Urdu and x-default, for
 * the languages the page exists in (`available`; every page exists in English). Saraiki has
 * no two-letter code, so it is not listed (see searchHreflang).
 */
export function searchAlternates(
  path: string,
  available: readonly Locale[] = locales,
): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    const code = searchHreflang[locale];
    if (code && available.includes(locale)) languages[code] = localePath(locale, path);
  }
  languages["x-default"] = localePath("en", path);
  return languages;
}
