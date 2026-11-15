import { ArrowLink } from "@/components/ArrowLink";
import { Figure, INTRO_PHOTO_SIZES } from "@/components/Figure";
import { PageIntro } from "@/components/PageIntro";
import { Section } from "@/components/Section";
import { Shell } from "@/components/Shell";
import { Lead, TextSection } from "@/components/TextSection";
import { UpdateList } from "@/components/UpdateList";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { languagePaths, localePath } from "@/i18n/paths";
import { causeBySlug } from "@/lib/causes";
import { availableLocales, getCauseText, getUpdates } from "@/lib/content";
import { contentPath, pagePath } from "@/lib/pages";
import styles from "./CausePage.module.css";

/**
 * The page of one cause (content/causes/<language>/<slug>.md): why it matters here, what we
 * do, what we have done (the updates that belong to it), and how to help.
 */
export function CausePage({ locale, slug }: { locale: Locale; slug: string }) {
  const t = getDictionary(locale);
  const cause = causeBySlug(slug);
  const text = getCauseText(locale, slug);
  const updates = getUpdates(locale);
  const done = updates.filter((update) => update.cause === slug);
  const path = contentPath("causes", slug);

  return (
    <Shell
      locale={locale}
      path={path}
      current="work"
      languagePaths={languagePaths(path, availableLocales("causes", slug), pagePath("work"))}
    >
      <PageIntro
        back={
          <ArrowLink back href={localePath(locale, pagePath("work"))}>
            {t.nav.work}
          </ArrowLink>
        }
        title={t.causes[cause.key].title}
        lead={<Lead text={text} locale={locale} />}
        photo={
          <Figure
            photo={text.photo}
            alt={text.photoAlt}
            updates={updates}
            locale={locale}
            sizes={INTRO_PHOTO_SIZES}
            priority
          />
        }
      />
      <TextSection text={text} id="why" locale={locale} />
      <TextSection text={text} id="what" locale={locale} />
      {done.length > 0 && (
        <Section id="done" title={t.causePage.doneTitle}>
          <UpdateList updates={done} locale={locale} headingLevel={3} />
        </Section>
      )}
      <TextSection text={text} id="help" locale={locale}>
        <div className={styles.actions}>
          <a className="button" href={localePath(locale, pagePath("getInvolved"))}>
            {t.home.volunteerAction}
          </a>
          <ArrowLink href={localePath(locale, pagePath("help"))}>{t.nav.help}</ArrowLink>
        </div>
      </TextSection>
    </Shell>
  );
}
