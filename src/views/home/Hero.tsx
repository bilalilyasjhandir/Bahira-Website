import { Photo } from "@/components/Photo";
import type { Locale } from "@/i18n/config";
import { formatMonth } from "@/i18n/format";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/paths";
import type { Update } from "@/lib/content";
import { org } from "@/lib/org";
import { pagePath } from "@/lib/pages";
import styles from "./Hero.module.css";

/** The photo at the top of the home page, and the update it belongs to (for its caption). */
const HERO = { photo: "2026-03-iftar/serving.jpg", update: "2026-03-iftar" };

/** Who Bahira is, what it does and where, with a real photo and the two ways to help. */
export function Hero({ locale, updates }: { locale: Locale; updates: Update[] }) {
  const t = getDictionary(locale);
  const update = updates.find((u) => u.slug === HERO.update);
  if (!update)
    throw new Error(
      `The home page photo belongs to the update "${HERO.update}", which is missing.`,
    );

  return (
    <section className={styles.hero} aria-labelledby="home-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.text}>
          <p className={`label ${styles.label}`}>{t.home.heroLabel}</p>
          <h1 id="home-title" className={styles.title}>
            {t.site.tagline}
          </h1>
          <p className={styles.lead}>{t.home.heroLead}</p>
          <div className={styles.actions}>
            <a className="button" href={localePath(locale, pagePath("getInvolved"))}>
              {t.home.volunteerAction}
            </a>
            {org.donations.open ? (
              <a className={styles.secondary} href={localePath(locale, pagePath("donate"))}>
                {t.nav.donate}
              </a>
            ) : (
              <p className={styles.soon}>{t.home.donationsSoon}</p>
            )}
          </div>
        </div>
        <figure className={styles.figure}>
          <Photo
            photo={HERO.photo}
            alt={t.home.heroPhotoAlt}
            sizes="(min-width: 80em) 486px, (min-width: 48em) 40vw, calc(100vw - 2rem)"
            priority
            className={styles.photo}
          />
          <figcaption className={styles.caption}>
            {fill(t.home.photoCaption, {
              title: update.title,
              month: formatMonth(update.date, locale),
            })}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
