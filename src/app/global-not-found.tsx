import type { Metadata } from "next";
import { onest } from "@/fonts/onest";
import { direction, locales } from "@/i18n/config";
import { en } from "@/i18n/en";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/paths";
import { layoutMetadata } from "@/lib/metadata";
import { pagePath } from "@/lib/pages";
import "@/styles/tokens.css";
import "@/styles/base.css";
// Not @/fonts/nastaliq: see the note in this stylesheet.
import "@/styles/nastaliq-404.css";
import styles from "./global-not-found.module.css";

// One 404 page for the whole site. A missing address does not say which language the
// visitor reads, so the page speaks all three, each with a link to its own home page.
export const metadata: Metadata = {
  ...layoutMetadata("en"),
  title: `${en.notFound.title} · ${en.site.name}`,
};

export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr" className={onest.variable}>
      <body>
        <main className={`container ${styles.page}`}>
          <a href="/" className={styles.logo}>
            <img
              src="/brand/logo/bahira-horizontal-blue.svg"
              alt={en.a11y.homeLink}
              width={1434}
              height={495}
            />
          </a>
          {locales.map((locale) => {
            const t = getDictionary(locale);
            const rtl = direction[locale] === "rtl";
            return (
              <section
                key={locale}
                lang={locale}
                dir={direction[locale]}
                className={`${styles.block} ${rtl ? "script-nastaliq" : ""}`}
              >
                <h1>{t.notFound.title}</h1>
                <p>{t.notFound.body}</p>
                <p className={styles.links}>
                  <a href={localePath(locale, "/")}>{t.notFound.home}</a>
                  <a href={localePath(locale, pagePath("help"))}>{t.nav.help}</a>
                </p>
              </section>
            );
          })}
        </main>
      </body>
    </html>
  );
}
