import { Shell } from "@/components/Shell";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pages, type PageKey } from "@/lib/pages";
import styles from "./PlaceholderPage.module.css";

/** A page that is not designed yet: its title, and a note that it is being written. */
export function PlaceholderPage({ locale, page }: { locale: Locale; page: PageKey }) {
  const t = getDictionary(locale);
  return (
    <Shell locale={locale} path={pages[page].path} current={page}>
      <div className={`container ${styles.page}`}>
        <h1>{t.pages[page].title}</h1>
        <p className={styles.note}>{t.placeholder.body}</p>
      </div>
    </Shell>
  );
}
