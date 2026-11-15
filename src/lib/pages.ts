// Every page of the site, in one place. Menus, the sitemap and the checks read this file,
// so a page added here appears everywhere it should.
//
// - Fixed pages are listed in `pages`. Each key matches a key in the dictionaries' `pages`
//   section, which holds the page's title and description.
// - Pages made from content files are found in content/ by allPages(): one for each update
//   (/updates/<slug>/) and one for each cause that has a page of its own (/work/<slug>/).
//
// This file imports nothing from src/, so the Node check scripts can read it directly.

import fs from "node:fs";
import path from "node:path";

export type PageInfo = {
  /** The English address. Urdu and Saraiki add /ur or /skr in front of it. */
  path: string;
  /** Kept out of search engines and the sitemap. */
  noindex?: boolean;
};

export const pages = {
  home: { path: "/" },
  about: { path: "/about/" },
  work: { path: "/work/" },
  updates: { path: "/updates/" },
  getInvolved: { path: "/get-involved/" },
  donate: { path: "/donate/" },
  help: { path: "/help/" },
  accountability: { path: "/accountability/" },
  contact: { path: "/contact/" },
  privacy: { path: "/privacy/" },
  thanks: { path: "/thanks/", noindex: true },
} as const satisfies Record<string, PageInfo>;

export type PageKey = keyof typeof pages;

export function pagePath(key: PageKey): string {
  return pages[key].path;
}

export function isIndexed(key: PageKey): boolean {
  return !("noindex" in pages[key] && pages[key].noindex);
}

/**
 * The folders in content/ that have a page for each Markdown file, and the section each
 * page belongs to: content/updates/en/2026-03-iftar.md is /updates/2026-03-iftar/.
 */
export const collections = {
  updates: { section: "updates" },
  causes: { section: "work" },
} as const satisfies Record<string, { section: PageKey }>;

export type Collection = keyof typeof collections;

/**
 * The language a content page's facts are written in. Every update and cause has an English
 * file; a page exists in another language only where that language has a translation.
 */
const SOURCE_LOCALE = "en";

/** The slugs of a collection that have a file in one language, e.g. ["2026-03-iftar"]. */
export function contentSlugs(collection: Collection, locale: string): string[] {
  const dir = path.join(process.cwd(), "content", collection, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.slice(0, -".md".length))
    .sort();
}

/** The English address of a content page, e.g. "/updates/2026-03-iftar/". */
export function contentPath(collection: Collection, slug: string): string {
  return `${pages[collections[collection].section].path}${slug}/`;
}

export type SitePage = {
  /** A fixed page's key ("about"), or a content page's address without slashes
   *  ("updates/2026-03-iftar"). `pnpm shots --pages=` takes these names. */
  name: string;
  /** The English address. */
  path: string;
  /** The languages the page exists in. */
  locales: string[];
  noindex: boolean;
  /** The menu item the page belongs to. */
  section: PageKey;
};

/** Every page of the site, with the languages it exists in. */
export function allPages(locales: readonly string[]): SitePage[] {
  const fixed = (Object.keys(pages) as PageKey[]).map((key): SitePage => ({
    name: key,
    path: pages[key].path,
    locales: [...locales],
    noindex: !isIndexed(key),
    section: key,
  }));
  const fromContent = (Object.keys(collections) as Collection[]).flatMap((collection) =>
    contentSlugs(collection, SOURCE_LOCALE).map((slug): SitePage => {
      const pagePath = contentPath(collection, slug);
      return {
        name: pagePath.slice(1, -1),
        path: pagePath,
        locales: locales.filter(
          (locale) => locale === SOURCE_LOCALE || contentSlugs(collection, locale).includes(slug),
        ),
        noindex: false,
        section: collections[collection].section,
      };
    }),
  );
  return [...fixed, ...fromContent];
}
