import { Helplines } from "@/components/Helplines";
import { PageIntro } from "@/components/PageIntro";
import { Section } from "@/components/Section";
import { Shell } from "@/components/Shell";
import { SiteForm } from "@/components/SiteForm";
import { Lead, TextSection } from "@/components/TextSection";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getPageText } from "@/lib/content";
import { pagePath } from "@/lib/pages";

/**
 * Need help? (content/pages/<language>/help.md), for people who need help, often reading in
 * Urdu or Saraiki on a phone: emergency helplines first, then the help form, what happens
 * next, and who we can help. No photos, so it loads quickly on any connection.
 */
export function HelpPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const text = getPageText(locale, "help");
  return (
    <Shell locale={locale} path={pagePath("help")} current="help">
      <PageIntro title={t.pages.help.title} lead={<Lead text={text} locale={locale} />} />
      <Section id="emergency" title={t.helpPage.emergencyTitle} tone="tint">
        <p>{t.helpPage.emergencyText}</p>
        <Helplines locale={locale} />
      </Section>
      <Section id="help-form" title={t.helpPage.formTitle}>
        <p>{t.helpPage.formText}</p>
        <SiteForm kind="help" locale={locale} labelledBy="help-form-title" />
      </Section>
      <TextSection text={text} id="next" locale={locale} />
      <TextSection text={text} id="who" locale={locale} />
    </Shell>
  );
}
