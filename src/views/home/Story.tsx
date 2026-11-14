import { ArrowLink } from "@/components/ArrowLink";
import { Template } from "@/components/Template";
import type { Locale } from "@/i18n/config";
import { formatDate } from "@/i18n/format";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/paths";
import { org } from "@/lib/org";
import { pagePath } from "@/lib/pages";
import styles from "./Story.module.css";

/**
 * The page's one dark band: founded on Human Rights Day, what the name means, and the sign.
 * Light on deep blue is the idea of the name itself. The meaning of the sign follows the
 * brand guidelines ("One shape, four ideas").
 */
export function Story({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section className={styles.band} aria-labelledby="story-title">
      <div className={`container ${styles.grid}`}>
        {/* The text beside it describes the sign, so the picture needs no description. */}
        <img
          className={styles.symbol}
          src="/brand/logo/bahira-symbol-white.svg"
          alt=""
          width={343}
          height={495}
          loading="lazy"
        />
        <div className={styles.text}>
          <h2 id="story-title" className={styles.title}>
            {t.home.storyTitle}
          </h2>
          <p>{fill(t.home.storyText, { date: formatDate(org.organisation.founded, locale) })}</p>
          <p>
            <Template
              text={t.home.nameText}
              values={{
                arabic: (
                  <span lang="ar" dir="rtl" className={styles.arabic}>
                    {org.organisation.nameArabic}
                  </span>
                ),
              }}
            />
          </p>
          <p>{t.home.signText}</p>
          <ArrowLink href={localePath(locale, pagePath("about"))} className={styles.link}>
            {t.home.aboutLink}
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
