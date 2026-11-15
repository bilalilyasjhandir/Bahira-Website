import { PageIntro } from "@/components/PageIntro";
import { Shell } from "@/components/Shell";
import { Lead, TextSection } from "@/components/TextSection";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getPageText } from "@/lib/content";
import { org } from "@/lib/org";
import { pagePath } from "@/lib/pages";

/** The sections of content/pages/<language>/accountability.md, in order. */
const SECTIONS = [
  "registration",
  "who",
  "money",
  "photos",
  "safeguarding",
  "complaints",
  "reports",
] as const;

/**
 * Accountability: where registration stands, who runs Bahira, where the money comes from,
 * and the promises we make about photos, children, complaints and reports.
 */
export function AccountabilityPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  if (org.organisation.registration.registered) {
    // The text says Bahira is not registered: it must be rewritten before this changes.
    throw new Error("Bahira is registered: update the Accountability and Donate texts first.");
  }
  const text = getPageText(locale, "accountability");
  return (
    <Shell locale={locale} path={pagePath("accountability")} current="accountability">
      <PageIntro title={t.pages.accountability.title} lead={<Lead text={text} locale={locale} />} />
      {SECTIONS.map((id) => (
        <TextSection key={id} text={text} id={id} locale={locale} />
      ))}
    </Shell>
  );
}
