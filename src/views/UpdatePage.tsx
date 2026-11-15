import { ArrowLink } from "@/components/ArrowLink";
import { INTRO_PHOTO_SIZES } from "@/components/Figure";
import { Gallery } from "@/components/Gallery";
import { PageIntro } from "@/components/PageIntro";
import { Photo } from "@/components/Photo";
import { Prose } from "@/components/Prose";
import { Shell } from "@/components/Shell";
import { UpdateList } from "@/components/UpdateList";
import { UpdateMeta } from "@/components/UpdateMeta";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { languagePaths, localePath } from "@/i18n/paths";
import { causeBySlug } from "@/lib/causes";
import { availableLocales, getUpdate, getUpdates } from "@/lib/content";
import { contentPath, contentSlugs, pagePath } from "@/lib/pages";
import styles from "./UpdatePage.module.css";

/** How many other updates the end of an update's page lists. */
const MORE = 3;

/**
 * One update (content/updates/<language>/<slug>.md): when and where, the cover photo, the
 * story, more photos from the day, the cause it belongs to, and other updates.
 */
export function UpdatePage({ locale, slug }: { locale: Locale; slug: string }) {
  const t = getDictionary(locale);
  const update = getUpdate(locale, slug);
  const others = getUpdates(locale)
    .filter((other) => other.slug !== slug)
    .slice(0, MORE);
  const path = contentPath("updates", slug);
  const cause = update.cause ? causeBySlug(update.cause) : undefined;
  const causeHref =
    cause && contentSlugs("causes", "en").includes(cause.slug)
      ? localePath(locale, contentPath("causes", cause.slug))
      : localePath(locale, pagePath("work"));

  return (
    <Shell
      locale={locale}
      path={path}
      current="updates"
      languagePaths={languagePaths(path, availableLocales("updates", slug), pagePath("updates"))}
    >
      <article>
        <PageIntro
          back={
            <ArrowLink back href={localePath(locale, pagePath("updates"))}>
              {t.common.allUpdates}
            </ArrowLink>
          }
          label={<UpdateMeta update={update} />}
          title={update.title}
          // The story, beside the photo. Its opening says what the summary says, so the
          // summary is left for lists and link previews.
          lead={
            update.story.length > 0 ? (
              <Prose blocks={update.story} locale={locale} textLocale={update.textLocale} />
            ) : (
              <p>{update.summary}</p>
            )
          }
          photo={
            <Photo
              photo={update.cover}
              alt={update.coverAlt}
              sizes={INTRO_PHOTO_SIZES}
              priority
              className={styles.cover}
            />
          }
        />
        <Gallery id="photos-title" title={t.common.photos} photos={update.photos} />
        {cause && (
          <div className={`container ${styles.cause}`}>
            <p className={`label ${styles.causeLabel}`}>{t.common.partOf}</p>
            <ArrowLink href={causeHref}>{t.causes[cause.key].title}</ArrowLink>
          </div>
        )}
      </article>
      {others.length > 0 && (
        <section className={`container ${styles.more}`} aria-labelledby="more-title">
          <h2 id="more-title" className={styles.moreTitle}>
            {t.common.moreUpdates}
          </h2>
          <UpdateList updates={others} locale={locale} headingLevel={3} />
        </section>
      )}
    </Shell>
  );
}
