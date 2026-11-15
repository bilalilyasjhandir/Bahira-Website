import { ArrowLink } from "@/components/ArrowLink";
import { Photo } from "@/components/Photo";
import { UpdateMeta } from "@/components/UpdateMeta";
import { direction, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/paths";
import type { Update } from "@/lib/content";
import { contentPath, pagePath } from "@/lib/pages";
import styles from "./RecentWork.module.css";

/**
 * The three latest updates: the proof of work. The newest leads with a large photo; the
 * other two follow with small ones. Each title links to the update's own page.
 */
export function RecentWork({ locale, updates }: { locale: Locale; updates: Update[] }) {
  const t = getDictionary(locale);
  const [lead, ...rest] = updates.slice(0, 3);
  if (!lead) return null;

  return (
    <section className={styles.section} aria-labelledby="recent-title">
      <div className="container">
        <h2 id="recent-title" className={styles.heading}>
          {t.home.recentTitle}
        </h2>
        <div className={styles.grid}>
          <Item update={lead} locale={locale} lead />
          <div className={styles.more}>
            {rest.map((update) => (
              <Item key={update.slug} update={update} locale={locale} />
            ))}
            <ArrowLink href={localePath(locale, pagePath("updates"))} className={styles.all}>
              {t.common.allUpdates}
            </ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function Item({
  update,
  locale,
  lead = false,
}: {
  update: Update;
  locale: Locale;
  lead?: boolean;
}) {
  // An update not yet translated is shown in its own language, marked as such, and links to
  // its page in that language.
  const t = getDictionary(locale);
  const foreign = update.textLocale !== locale;
  const href = localePath(update.textLocale, contentPath("updates", update.slug));

  return (
    <article
      className={lead ? styles.lead : styles.item}
      lang={foreign ? update.textLocale : undefined}
      dir={foreign ? direction[update.textLocale] : undefined}
    >
      <Photo
        photo={update.cover}
        alt={update.coverAlt}
        sizes={
          lead
            ? "(min-width: 80em) 486px, (min-width: 64em) 40vw, (min-width: 48em) 48vw, calc(100vw - 2rem)"
            : "(min-width: 64em) 10rem, 6rem"
        }
        className={styles.photo}
      />
      <div className={styles.head}>
        <UpdateMeta update={update} className={styles.meta} />
        <h3 className={styles.title}>
          <a href={href}>{update.title}</a>
        </h3>
      </div>
      <p className={styles.summary}>{update.summary}</p>
      {foreign && (
        <p className={styles.language} lang={locale} dir={direction[locale]}>
          {t.common.inEnglish}
        </p>
      )}
    </article>
  );
}
