import { direction, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/paths";
import type { Update } from "@/lib/content";
import { contentPath } from "@/lib/pages";
import { Photo } from "./Photo";
import { UpdateMeta } from "./UpdateMeta";
import styles from "./UpdateList.module.css";

/**
 * Updates in a list, newest first: a square photo, when and where, the title (a link to the
 * update's page) and the summary. An update not yet translated is shown in its own language,
 * marked as such, and links to its page in that language.
 */
export function UpdateList({
  updates,
  locale,
  headingLevel,
}: {
  updates: Update[];
  locale: Locale;
  /** h2 where the list is the page's main content, h3 inside a section. */
  headingLevel: 2 | 3;
}) {
  const t = getDictionary(locale);
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <ul role="list" className={styles.list}>
      {updates.map((update) => {
        const foreign = update.textLocale !== locale;
        return (
          <li key={update.slug} className={styles.item}>
            <article
              className={styles.article}
              lang={foreign ? update.textLocale : undefined}
              dir={foreign ? direction[update.textLocale] : undefined}
            >
              <Photo
                photo={update.cover}
                alt={update.coverAlt}
                sizes="(min-width: 48em) 14rem, 6rem"
                className={styles.photo}
              />
              <div className={styles.head}>
                <UpdateMeta update={update} className={styles.meta} />
                <Heading className={styles.title}>
                  <a href={localePath(update.textLocale, contentPath("updates", update.slug))}>
                    {update.title}
                  </a>
                </Heading>
              </div>
              <div className={styles.body}>
                <p>{update.summary}</p>
                {foreign && (
                  <p className={styles.language} lang={locale} dir={direction[locale]}>
                    {t.common.inEnglish}
                  </p>
                )}
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
