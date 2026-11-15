import type { ReactNode } from "react";
import { direction, type Locale } from "@/i18n/config";
import styles from "./Section.module.css";

/**
 * A section of an inner page. Its heading stands on the start side and its text beside it
 * on wide screens, one under the other on phones.
 *
 * - "plain": on the page, below a hairline (most sections);
 * - "tint": on a Sky band, for the one thing the page asks of the reader (a form, a list of
 *   helplines);
 * - "dark": the page's one Deep Blue band.
 *
 * `textLocale` marks a section whose text is in another language than the page (an English
 * text standing in for a missing translation).
 */
export function Section({
  id,
  title,
  tone = "plain",
  textLocale,
  aside,
  children,
}: {
  id: string;
  title: string;
  tone?: "plain" | "tint" | "dark";
  textLocale?: Locale;
  /** Shown under the heading on wide screens, such as a picture. */
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`${styles.section} ${styles[tone]}`}
      lang={textLocale}
      dir={textLocale ? direction[textLocale] : undefined}
    >
      <div className={`container ${styles.grid}`}>
        <div className={styles.head}>
          <h2 id={`${id}-title`}>{title}</h2>
          {aside}
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </section>
  );
}
