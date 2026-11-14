// The "dictionaries" pattern from the Next.js internationalisation guide. Dictionaries are
// read on the server while the site is built, so none of this text is sent as JavaScript.

import type { Locale } from "./config";
import { en, type Dictionary } from "./en";
import { skr } from "./skr";
import { ur } from "./ur";

const dictionaries: Record<Locale, Dictionary> = { en, ur, skr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Fills {name} placeholders, e.g. fill("© {year}", { year: "2026" }). */
export function fill(text: string, values: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}
