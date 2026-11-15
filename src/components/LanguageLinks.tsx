import { direction, localeNames, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import styles from "./LanguageLinks.module.css";

/**
 * English · اردو · سرائیکی. Each name is written in its own script, so a reader finds their
 * language without knowing the others. Each link goes to the same page in that language, or,
 * where the page has no translation, to its section (`paths`, made by Shell).
 * Plain links: no flags, no automatic redirect, no cookies.
 */
export function LanguageLinks({
  locale,
  paths,
}: {
  locale: Locale;
  paths: Record<Locale, string>;
}) {
  const t = getDictionary(locale);
  return (
    <nav aria-label={t.a11y.languageNav} className={styles.languages}>
      <ul role="list">
        {locales.map((code) => {
          // On English pages, the Urdu-script names use the small label font.
          const label =
            direction[code] === "rtl" && direction[locale] === "ltr" ? styles.nastaliqLabel : "";
          return (
            <li key={code}>
              {code === locale ? (
                <span
                  aria-current="true"
                  lang={code}
                  dir={direction[code]}
                  className={`${styles.current} ${label}`}
                >
                  {localeNames[code]}
                </span>
              ) : (
                <a
                  href={paths[code]}
                  lang={code}
                  hrefLang={code}
                  dir={direction[code]}
                  className={label}
                >
                  {localeNames[code]}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
