// Titles, descriptions, language alternates and link previews for every page.

import type { Metadata, Viewport } from "next";
import { locales, openGraphLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath, searchAlternates } from "@/i18n/paths";
import { causeBySlug } from "./causes";
import { availableLocales, getUpdate } from "./content";
import { org } from "./org";
import { contentPath, isIndexed, pages, type PageKey } from "./pages";
import { getShareImage } from "./photos";

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

type PageMeta = {
  locale: Locale;
  /** The page's English address. */
  path: string;
  /** The page's own title; the site's name is added after it. */
  title: string;
  description: string;
  /** The languages the page exists in. Fixed pages exist in all three. */
  available?: readonly Locale[];
  noindex?: boolean;
  /** The link-preview image; the brand's own image when not given. */
  image?: { url: string; width: number; height: number; alt: string };
  /** For an update: the date it happened. */
  published?: string;
};

function buildMetadata(page: PageMeta, isHome = false): Metadata {
  const t = getDictionary(page.locale);
  const url = localePath(page.locale, page.path);
  const title = isHome ? t.site.name : `${page.title} · ${t.site.name}`;
  const ogLocale = openGraphLocale[page.locale];

  return {
    title: isHome ? { absolute: t.site.name } : page.title,
    description: page.description,
    alternates: {
      canonical: url,
      // Saraiki pages carry no hreflang: search engines accept two-letter codes only.
      languages:
        page.locale === "skr" ? undefined : searchAlternates(page.path, page.available ?? locales),
    },
    openGraph: {
      ...(page.published
        ? { type: "article", publishedTime: page.published }
        : { type: "website" }),
      siteName: t.site.name,
      title,
      description: page.description,
      url,
      ...(ogLocale ? { locale: ogLocale } : {}),
      images: [page.image ?? { ...SHARE_IMAGE, alt: t.site.name }],
    },
    twitter: { card: "summary_large_image" },
    robots: page.noindex ? { index: false, follow: true } : undefined,
  };
}

/** The metadata of a fixed page (src/lib/pages.ts) in one language. */
export function pageMetadata(locale: Locale, key: PageKey): Metadata {
  const t = getDictionary(locale);
  return buildMetadata(
    {
      locale,
      path: pages[key].path,
      title: t.pages[key].title,
      description: t.pages[key].description,
      noindex: !isIndexed(key),
    },
    key === "home",
  );
}

/**
 * An update's page. Shared on WhatsApp or Facebook, it shows the update's own cover photo
 * (the 1200×630 JPEG made by scripts/build-images.mjs).
 */
export function updateMetadata(locale: Locale, slug: string): Metadata {
  const update = getUpdate(locale, slug);
  const share = getShareImage(update.cover);
  return buildMetadata({
    locale,
    path: contentPath("updates", slug),
    title: update.title,
    description: update.summary,
    available: availableLocales("updates", slug),
    image: { url: share.src, width: share.width, height: share.height, alt: update.coverAlt },
    published: update.date,
  });
}

/** A cause's own page: its name and its one-line description. */
export function causeMetadata(locale: Locale, slug: string): Metadata {
  const t = getDictionary(locale);
  const cause = causeBySlug(slug);
  return buildMetadata({
    locale,
    path: contentPath("causes", slug),
    title: t.causes[cause.key].title,
    description: t.causes[cause.key].text,
    available: availableLocales("causes", slug),
  });
}
