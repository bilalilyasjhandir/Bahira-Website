// Titles, descriptions, language alternates and link previews for every page.

import type { Metadata, Viewport } from "next";
import { openGraphLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath, searchAlternates } from "@/i18n/paths";
import { org } from "./org";
import { isIndexed, pages, type PageKey } from "./pages";

/** The image shown when a page is shared on WhatsApp or Facebook (from brand/social). */
const SHARE_IMAGE = { url: "/brand/link-preview-1200x630.png", width: 1200, height: 630 };

/** Shared by every page of a language; set in its root layout. */
export function layoutMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(org.site.url),
    title: { template: `%s · ${t.site.name}`, default: t.site.name },
    description: t.site.description,
    applicationName: t.site.name,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    // Phones should not turn numbers or addresses in the text into links by themselves.
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const siteViewport: Viewport = {
  themeColor: "#084F97", // Bahira Blue
  colorScheme: "light",
};

/** The metadata of one page in one language. */
export function pageMetadata(locale: Locale, key: PageKey): Metadata {
  const t = getDictionary(locale);
  const path = pages[key].path;
  const url = localePath(locale, path);
  const isHome = key === "home";
  const title = isHome ? t.site.name : `${t.pages[key].title} · ${t.site.name}`;
  const ogLocale = openGraphLocale[locale];

  return {
    title: isHome ? { absolute: t.site.name } : t.pages[key].title,
    description: t.pages[key].description,
    alternates: {
      canonical: url,
      // Saraiki pages carry no hreflang: search engines accept two-letter codes only.
      languages: locale === "skr" ? undefined : searchAlternates(path),
    },
    openGraph: {
      type: "website",
      siteName: t.site.name,
      title,
      description: t.pages[key].description,
      url,
      ...(ogLocale ? { locale: ogLocale } : {}),
      images: [{ ...SHARE_IMAGE, alt: t.site.name }],
    },
    twitter: { card: "summary_large_image" },
    robots: isIndexed(key) ? undefined : { index: false, follow: true },
  };
}
