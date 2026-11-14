import { Fragment } from "react";
import { Photo } from "@/components/Photo";
import { direction, type Locale } from "@/i18n/config";
import { formatDate, formatDateRange } from "@/i18n/format";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Update } from "@/lib/content";
import styles from "./RecentWork.module.css";

/**
 * The three latest updates: the proof of work. The newest leads with a large photo; the
 * other two follow with small ones. They link to their own pages once those exist (Phase 3).
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
  const when = update.dateEnd
    ? formatDateRange(update.date, update.dateEnd, locale)
    : formatDate(update.date, locale);
  // An update not yet translated is shown in its own language, marked as such.
  const foreign = update.textLocale !== locale;

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
        <p className={styles.meta}>
          <span className={styles.unit}>
            <time dateTime={update.date}>{when}</time>
            <span aria-hidden="true">{" ·"}</span>
          </span>
          {placeParts(update.place).map((part, i) => (
            <Fragment key={i}>
              {" "}
              <span className={styles.unit}>{part}</span>
            </Fragment>
          ))}
        </p>
        <h3 className={styles.title}>{update.title}</h3>
      </div>
      <p className={styles.summary}>{update.summary}</p>
    </article>
  );
}

/**
 * A place split after each comma (English , or Urdu ،), so each part can be kept whole:
 * "Daykh Bhaal Shelter Home, Bahawalpur" → "Daykh Bhaal Shelter Home," and "Bahawalpur".
 */
function placeParts(place: string): string[] {
  return place.split(/(?<=[,،])\s+/);
}
