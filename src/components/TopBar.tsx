import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/paths";
import { pagePath, type PageKey } from "@/lib/pages";
import { LanguageLinks } from "./LanguageLinks";
import styles from "./TopBar.module.css";

/** The slim bar above the header: Need help?, Contact, and the language chooser. */
export function TopBar({
  locale,
  languagePaths,
  current,
}: {
  locale: Locale;
  languagePaths: Record<Locale, string>;
  current: PageKey;
}) {
  const t = getDictionary(locale);
  return (
    <div className={styles.bar}>
      <div className={`container ${styles.inner}`}>
        <ul role="list" className={styles.links}>
          <li>
            <a
              href={localePath(locale, pagePath("help"))}
              aria-current={current === "help" ? "page" : undefined}
            >
              {t.nav.help}
            </a>
          </li>
          <li className={styles.contact}>
            <a
              href={localePath(locale, pagePath("contact"))}
              aria-current={current === "contact" ? "page" : undefined}
            >
              {t.nav.contact}
            </a>
          </li>
        </ul>
        <LanguageLinks locale={locale} paths={languagePaths} />
      </div>
    </div>
  );
}
