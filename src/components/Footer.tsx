import type { Locale } from "@/i18n/config";
import { formatDate } from "@/i18n/format";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/paths";
import { org } from "@/lib/org";
import { pagePath } from "@/lib/pages";
import { showUpdatesInMenu } from "@/lib/updates";
import { Email } from "./Email";
import styles from "./Footer.module.css";
import { Socials } from "./Socials";

type FooterKey =
  | "about"
  | "work"
  | "updates"
  | "getInvolved"
  | "donate"
  | "help"
  | "contact"
  | "accountability"
  | "privacy";

/** Every page, in the order of the menus. */
function footerLinks(): FooterKey[] {
  const links: FooterKey[] = ["about", "work", "updates", "getInvolved", "donate"];
  return [
    ...links.filter((key) => key !== "updates" || showUpdatesInMenu()),
    "help",
    "contact",
    "accountability",
    "privacy",
  ];
}

/**
 * Deep Blue footer: the logo, what Bahira is, its social media, every page, and how to write
 * to us.
 */
export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  // Urdu and Saraiki pages show the logo with the Urdu name under BAHIRA (brand kit).
  const logo =
    locale === "en"
      ? { src: "/brand/logo/bahira-primary-white.svg", width: 627, height: 654 }
      : { src: "/brand/logo/bahira-urdu-english-white.svg", width: 627, height: 894 };
  const year = String(new Date().getFullYear());

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.about}>
          <a href={localePath(locale, "/")} className={styles.logo}>
            {/* Lazy: the footer is below the fold, so the logo loads only when it is near. */}
            <img
              src={logo.src}
              alt={t.a11y.homeLink}
              width={logo.width}
              height={logo.height}
              loading="lazy"
            />
          </a>
          <p className={styles.tagline}>{t.site.tagline}</p>
          <p>{fill(t.site.founded, { date: formatDate(org.organisation.founded, locale) })}</p>
          <Socials locale={locale} />
        </div>

        <nav aria-label={t.a11y.footerNav} className={styles.nav}>
          <ul role="list">
            {footerLinks().map((key) => (
              <li key={key}>
                <a href={localePath(locale, pagePath(key))}>{t.nav[key]}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.meta}>
          <p>
            {t.footer.email}: <Email />
          </p>
          <p>{fill(t.site.copyright, { year })}</p>
        </div>
      </div>
    </footer>
  );
}
