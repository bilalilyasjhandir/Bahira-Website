import { ArrowLink } from "@/components/ArrowLink";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/paths";
import { pagePath } from "@/lib/pages";
import styles from "./Causes.module.css";

/** The six parts of Bahira's work, in the order of the brand guidelines. */
const CAUSES = [
  "peopleInNeed",
  "womensRights",
  "strayAnimals",
  "trees",
  "intersex",
  "youth",
] as const;

/**
 * What Bahira works for. Written as commitments, not as achievements: so far Bahira's work
 * has been help for people in need, and the other five are where it is growing.
 */
export function Causes({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section className={styles.section} aria-labelledby="causes-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.head}>
          <h2 id="causes-title">{t.home.causesTitle}</h2>
          <p className={styles.intro}>{t.home.causesIntro}</p>
          <ArrowLink href={localePath(locale, pagePath("work"))}>{t.home.causesLink}</ArrowLink>
        </div>
        <ul role="list" className={styles.list}>
          {CAUSES.map((key) => (
            <li key={key} className={styles.item}>
              <h3 className={styles.title}>{t.causes[key].title}</h3>
              <p>{t.causes[key].text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
