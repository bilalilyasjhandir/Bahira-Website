import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/paths";
import { org } from "@/lib/org";
import { pagePath } from "@/lib/pages";
import styles from "./Support.module.css";

/**
 * How to help, at the end of the page: volunteering, and donations. While donations are
 * closed (data/org.yaml) this says so plainly and points to what people can do today.
 */
export function Support({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section className={styles.band} aria-labelledby="support-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.block}>
          <h2 id="support-title">{t.home.volunteerTitle}</h2>
          <p>{t.home.volunteerText}</p>
          <a className="button" href={localePath(locale, pagePath("getInvolved"))}>
            {t.home.volunteerLink}
          </a>
        </div>
        {org.donations.open ? (
          <div className={styles.block}>
            <h2>{t.pages.donate.title}</h2>
            <p>{t.pages.donate.description}</p>
            <a className="button" href={localePath(locale, pagePath("donate"))}>
              {t.nav.donate}
            </a>
          </div>
        ) : (
          <div className={styles.block}>
            <h2>{t.home.donateTitle}</h2>
            <p>{t.home.donateText}</p>
          </div>
        )}
      </div>
    </section>
  );
}
