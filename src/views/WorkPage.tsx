import { ArrowLink } from "@/components/ArrowLink";
import { Figure, INTRO_PHOTO_SIZES } from "@/components/Figure";
import { PageIntro } from "@/components/PageIntro";
import { Section } from "@/components/Section";
import { Shell } from "@/components/Shell";
import { Support } from "@/components/Support";
import type { Locale } from "@/i18n/config";
import { formatDate, formatDateRange } from "@/i18n/format";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/paths";
import { causes, type Cause } from "@/lib/causes";
import { getCauseText, getUpdates, type Update } from "@/lib/content";
import { contentPath, contentSlugs, pagePath } from "@/lib/pages";
import styles from "./WorkPage.module.css";

/**
 * Our work: the six causes. A cause with real work to show leads, with a photo, the events
 * so far and a link to its own page; the others are listed, plainly, as not started yet.
 */
export function WorkPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const updates = getUpdates(locale);
  const withPages = new Set(contentSlugs("causes", "en"));
  const active = causes.filter((cause) => withPages.has(cause.slug));
  const planned = causes.filter((cause) => !withPages.has(cause.slug));

  return (
    <Shell locale={locale} path={pagePath("work")} current="work">
      <PageIntro title={t.pages.work.title} lead={<p>{t.workPage.lead}</p>} />
      {active.map((cause) => (
        <ActiveCause key={cause.slug} cause={cause} locale={locale} updates={updates} />
      ))}
      {planned.length > 0 && (
        <Section id="next" title={t.workPage.nextTitle}>
          <p className={styles.nextText}>{t.workPage.nextText}</p>
          <ul role="list" className={styles.planned}>
            {planned.map((cause) => (
              <li key={cause.slug} className={styles.plannedItem}>
                <h3 className={styles.plannedTitle}>{t.causes[cause.key].title}</h3>
                <p>{t.causes[cause.key].text}</p>
              </li>
            ))}
          </ul>
          <ArrowLink href={localePath(locale, pagePath("getInvolved"))}>
            {t.workPage.nextLink}
          </ArrowLink>
        </Section>
      )}
      <Support locale={locale} />
    </Shell>
  );
}

function ActiveCause({
  cause,
  locale,
  updates,
}: {
  cause: Cause;
  locale: Locale;
  updates: Update[];
}) {
  const t = getDictionary(locale);
  const text = getCauseText(locale, cause.slug);
  const href = localePath(locale, contentPath("causes", cause.slug));
  const done = updates.filter((update) => update.cause === cause.slug);
  const titleId = `${cause.slug}-title`;

  return (
    <section className={styles.cause} aria-labelledby={titleId}>
      {/* The text comes first, as read on a phone or by a screen reader; on wide screens the
          photo moves to the start side (CSS). */}
      <div className={`container ${styles.grid}`}>
        <div className={styles.text}>
          <h2 id={titleId}>
            <a href={href} className={styles.titleLink}>
              {t.causes[cause.key].title}
            </a>
          </h2>
          <p className={styles.lead}>{t.causes[cause.key].text}</p>
          {done.length > 0 && (
            <>
              <h3 className={`label ${styles.label}`}>{t.workPage.eventsSoFar}</h3>
              <ul role="list" className={styles.events}>
                {done.map((update) => (
                  <li key={update.slug}>
                    <a href={localePath(update.textLocale, contentPath("updates", update.slug))}>
                      {update.title}
                    </a>
                    <time dateTime={update.date} className={styles.date}>
                      {update.dateEnd
                        ? formatDateRange(update.date, update.dateEnd, update.textLocale)
                        : formatDate(update.date, update.textLocale)}
                    </time>
                  </li>
                ))}
              </ul>
            </>
          )}
          <ArrowLink href={href}>{t.workPage.more}</ArrowLink>
        </div>
        <div className={styles.photo}>
          <Figure
            photo={text.photo}
            alt={text.photoAlt}
            updates={updates}
            locale={locale}
            sizes={INTRO_PHOTO_SIZES}
          />
        </div>
      </div>
    </section>
  );
}
