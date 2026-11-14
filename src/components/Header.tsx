import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/paths";
import { pagePath, type PageKey } from "@/lib/pages";
import styles from "./Header.module.css";
import { MenuDisclosure } from "./MenuDisclosure";

type NavKey = "about" | "work" | "getInvolved" | "contact" | "help";

/** Logo, main menu and the Donate button, as in the brand guidelines' "In use" slide. */
export function Header({ locale, current }: { locale: Locale; current: PageKey }) {
  const t = getDictionary(locale);
  // "Updates" joins this menu with the Updates page in Phase 3 (see showUpdatesInMenu in
  // src/lib/updates.ts).
  const main: NavKey[] = ["about", "work", "getInvolved"];
  const link = (key: NavKey | "donate") => localePath(locale, pagePath(key));
  const currentIf = (key: PageKey) => (key === current ? ("page" as const) : undefined);

  return (
    <div className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href={localePath(locale, "/")} className={styles.logo}>
          {/* The logo is the same in every language and is never mirrored. */}
          <img
            src="/brand/logo/bahira-horizontal-blue.svg"
            alt={t.a11y.homeLink}
            width={1434}
            height={495}
          />
        </a>

        <nav aria-label={t.a11y.mainNav} className={styles.nav}>
          <ul role="list">
            {main.map((key) => (
              <li key={key}>
                <a href={link(key)} aria-current={currentIf(key)}>
                  {t.nav[key]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={link("donate")}
          className={`button ${styles.donate}`}
          aria-current={currentIf("donate")}
        >
          {t.nav.donate}
        </a>

        <MenuDisclosure label={t.a11y.menu} className={styles.menu} panelClassName={styles.panel}>
          <nav aria-label={t.a11y.mainNav}>
            <ul role="list">
              {[...main, "contact" as const].map((key) => (
                <li key={key}>
                  <a href={link(key)} aria-current={currentIf(key)}>
                    {t.nav[key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </MenuDisclosure>
      </div>
    </div>
  );
}
