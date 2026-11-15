import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/i18n/config";
import { localePath, searchAlternates } from "@/i18n/paths";
import { org } from "@/lib/org";
import { allPages } from "@/lib/pages";

export const dynamic = "force-static";

/**
 * Every page in every language it exists in. Saraiki pages are listed without hreflang
 * (see config); an update not yet translated is listed only in the languages it has.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const absolute = (path: string) => new URL(path, org.site.url).href;

  return allPages(locales)
    .filter((page) => !page.noindex)
    .flatMap((page) => {
      const available = page.locales as Locale[];
      const languages = Object.fromEntries(
        Object.entries(searchAlternates(page.path, available)).map(([code, href]) => [
          code,
          absolute(href),
        ]),
      );
      return available.map((locale) => ({
        url: absolute(localePath(locale, page.path)),
        ...(locale === "skr" ? {} : { alternates: { languages } }),
      }));
    });
}
