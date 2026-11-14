import { Shell } from "@/components/Shell";
import type { Locale } from "@/i18n/config";
import { en } from "@/i18n/en";
import { formatDate } from "@/i18n/format";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/paths";
import { ur } from "@/i18n/ur";
import { org } from "@/lib/org";
import styles from "./PlaceholderPage.module.css";

/** The home page. Phase 2 designs it; for now it says who Bahira is. */
export function HomePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <Shell locale={locale} path="/" current="home">
      <OrganisationData locale={locale} />
      <div className={`container ${styles.page}`}>
        <h1>{t.site.name}</h1>
        <p className={styles.tagline}>{t.site.tagline}</p>
        <p>{fill(t.site.founded, { date: formatDate(org.organisation.founded, locale) })}</p>
      </div>
    </Shell>
  );
}

/**
 * Structured data that tells search engines who Bahira is (schema.org NGO). Every value
 * comes from data/org.yaml or the dictionaries; nothing here claims a registration.
 */
function OrganisationData({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const data = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: en.site.name,
    alternateName: ur.site.name,
    url: new URL(localePath(locale, "/"), org.site.url).href,
    logo: new URL("/brand/logo/bahira-primary-blue-600.png", org.site.url).href,
    description: t.site.description,
    slogan: t.site.tagline,
    foundingDate: org.organisation.founded,
    address: {
      "@type": "PostalAddress",
      addressLocality: org.organisation.city,
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    email: org.contact.email,
    ...(org.socials.length > 0 ? { sameAs: org.socials.map((s) => s.url) } : {}),
  };
  return (
    <script
      type="application/ld+json"
      // JSON-LD as the Next.js docs show it; "<" is escaped so the data can never close the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
