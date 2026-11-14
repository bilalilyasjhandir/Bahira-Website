import { direction, localeNames, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/paths";
import styles from "./LanguageLinks.module.css";

/**
 * English · اردو · سرائیکی. Each name is written in its own script, so a reader finds their
 * language without knowing the others. Each link goes to the same page in that language.
 * Plain links: no flags, no automatic redirect, no cookies.
 */
export function LanguageLinks({ locale, path }: { locale: Locale; path: string }) {
  const t = getDictionary(locale);
  return (
    <nav aria-label={t.a11y.languageNav} className={styles.languages}>
      <ul role="list">
        {locales.map((code) => {
          // On English pages, the Urdu-script names use the small label font.
          const label =
            direction[code] === "rtl" && direction[locale] === "ltr" ? "nastaliq-label" : "";
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
                  href={localePath(code, path)}
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
