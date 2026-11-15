import { PageIntro } from "@/components/PageIntro";
import { Shell } from "@/components/Shell";
import { Lead, TextSection } from "@/components/TextSection";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getPageText } from "@/lib/content";
import { pagePath } from "@/lib/pages";

/** The sections of content/pages/<language>/privacy.md, in order. */
const SECTIONS = ["collect", "where", "who", "keep", "website", "choices"] as const;

/** Privacy: what the forms collect, where it goes, who reads it, and what the site does not do. */
export function PrivacyPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const text = getPageText(locale, "privacy");
  return (
    <Shell locale={locale} path={pagePath("privacy")} current="privacy">
      <PageIntro title={t.pages.privacy.title} lead={<Lead text={text} locale={locale} />} />
      {SECTIONS.map((id) => (
        <TextSection key={id} text={text} id={id} locale={locale} />
      ))}
    </Shell>
  );
}
