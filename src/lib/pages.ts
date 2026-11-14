// Every page of the site, in one place. Menus, the sitemap and the checks read this list,
// so a page added here appears everywhere it should. Each key matches a key in the
// dictionaries' `pages` section, which holds the page's title and description.

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
