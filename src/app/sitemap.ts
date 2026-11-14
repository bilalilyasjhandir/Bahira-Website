import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { localePath, searchAlternates } from "@/i18n/paths";
import { org } from "@/lib/org";
import { isIndexed, pages, type PageKey } from "@/lib/pages";

export const dynamic = "force-static";

/** Every page in every language. Saraiki pages are listed without hreflang (see config). */
export default function sitemap(): MetadataRoute.Sitemap {
  const absolute = (path: string) => new URL(path, org.site.url).href;
  const keys = (Object.keys(pages) as PageKey[]).filter(isIndexed);

  return keys.flatMap((key) => {
    const path = pages[key].path;
    const languages = Object.fromEntries(
      Object.entries(searchAlternates(path)).map(([code, href]) => [code, absolute(href)]),
    );
    return locales.map((locale) => ({
      url: absolute(localePath(locale, path)),
      ...(locale === "skr" ? {} : { alternates: { languages } }),
    }));
  });
}
