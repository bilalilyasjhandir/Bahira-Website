import { Email } from "@/components/Email";
import type { Locale } from "@/i18n/config";
import { formatDate } from "@/i18n/format";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import { org } from "@/lib/org";
import styles from "./Facts.module.css";

/** The facts a careful visitor looks for first: when, where, registration, and how to write. */
export function Facts({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  if (org.organisation.registration.registered) {
    // The site must never claim registration loosely: write the wording first.
    throw new Error(
      "Bahira is registered: add the registration text to the dictionaries and show it here.",
    );
  }

  return (
    <section aria-labelledby="facts-title">
      <div className="container">
        <h2 id="facts-title" className="visually-hidden">
          {t.home.factsTitle}
        </h2>
        <dl className={styles.list}>
          <div className={styles.item}>
            <dt className={`label ${styles.term}`}>{t.home.factFounded}</dt>
            <dd>
              {fill(t.home.factFoundedValue, {
                date: formatDate(org.organisation.founded, locale),
              })}
            </dd>
          </div>
          <div className={styles.item}>
            <dt className={`label ${styles.term}`}>{t.home.factBase}</dt>
            <dd>{t.home.factBaseValue}</dd>
          </div>
          <div className={styles.item}>
            <dt className={`label ${styles.term}`}>{t.home.factRegistration}</dt>
            <dd>{t.home.factNotRegistered}</dd>
          </div>
          <div className={styles.item}>
            <dt className={`label ${styles.term}`}>{t.home.factEmail}</dt>
            <dd>
              <Email />
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
