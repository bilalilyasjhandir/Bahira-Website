import { Figure, INTRO_PHOTO_SIZES } from "@/components/Figure";
import { PageIntro } from "@/components/PageIntro";
import { Section } from "@/components/Section";
import { Shell } from "@/components/Shell";
import { SiteForm } from "@/components/SiteForm";
import { Socials } from "@/components/Socials";
import { Lead, TextSection } from "@/components/TextSection";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getPageText, getUpdates } from "@/lib/content";
import { pagePath } from "@/lib/pages";

/** The photo beside the opening text: volunteers at work. */
const PHOTO = "2026-03-iftar/preparing.jpg";

/**
 * Get involved (content/pages/<language>/get-involved.md): what volunteers do, how it works,
 * the volunteer form, skills for young people, working with us, and spreading the word.
 */
export function GetInvolvedPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const text = getPageText(locale, "get-involved");
  return (
    <Shell locale={locale} path={pagePath("getInvolved")} current="getInvolved">
      <PageIntro
        title={t.pages.getInvolved.title}
        lead={<Lead text={text} locale={locale} />}
        photo={
          <Figure
            photo={PHOTO}
            alt={t.getInvolvedPage.photoAlt}
            updates={getUpdates(locale)}
            locale={locale}
            sizes={INTRO_PHOTO_SIZES}
            priority
          />
        }
      >
        <a className="button" href="#volunteer-form">
          {t.getInvolvedPage.formTitle}
        </a>
      </PageIntro>
      <TextSection text={text} id="roles" locale={locale} />
      <TextSection text={text} id="steps" locale={locale} />
      <Section id="volunteer-form" title={t.getInvolvedPage.formTitle} tone="tint">
        <p>{t.getInvolvedPage.formText}</p>
        <SiteForm kind="volunteer" locale={locale} labelledBy="volunteer-form-title" />
      </Section>
      <TextSection text={text} id="youth" locale={locale} />
      <TextSection text={text} id="partners" locale={locale} />
      <TextSection text={text} id="share" locale={locale}>
        <Socials locale={locale} />
      </TextSection>
    </Shell>
  );
}
