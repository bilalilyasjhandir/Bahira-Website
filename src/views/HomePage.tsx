import { Shell } from "@/components/Shell";
import type { Locale } from "@/i18n/config";
import { en } from "@/i18n/en";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/paths";
import { ur } from "@/i18n/ur";
import { getUpdates } from "@/lib/content";
import { org } from "@/lib/org";
import { Causes } from "./home/Causes";
import { Facts } from "./home/Facts";
import { Hero } from "./home/Hero";
import { RecentWork } from "./home/RecentWork";
import { Story } from "./home/Story";
import { Support } from "@/components/Support";

/**
 * The home page: who Bahira is and the two ways to help (Hero), the facts at a glance,
 * what Bahira works for, the story of the name, the work so far, and how to join in.
 */
export function HomePage({ locale }: { locale: Locale }) {
  const updates = getUpdates(locale);
  return (
    <Shell locale={locale} path="/" current="home">
      <OrganisationData locale={locale} />
      <Hero locale={locale} updates={updates} />
      <Facts locale={locale} />
      <Causes locale={locale} />
      <Story locale={locale} />
      <RecentWork locale={locale} updates={updates} />
      <Support locale={locale} />
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
    founder: { "@type": "Person", name: org.organisation.founder.name },
    address: {
      "@type": "PostalAddress",
      addressLocality: org.organisation.city,
      addressRegion: "Punjab",
      postalCode: org.organisation.postcode,
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
