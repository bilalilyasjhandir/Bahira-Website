import type { ReactNode } from "react";
import { locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/paths";
import type { PageKey } from "@/lib/pages";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { TopBar } from "./TopBar";

/**
 * The frame of every page: skip link, top bar, header, the page itself and the footer.
 *
 * `path` is the page's English address ("/about/"); the language chooser links to the same
 * page in the other languages. A page that does not exist in every language (an update not
 * yet translated) gives `languagePaths`: where each language's link goes instead.
 * `current` is the menu item the page belongs to.
 */
export function Shell({
  locale,
  path,
  current,
  languagePaths,
  children,
}: {
  locale: Locale;
  path: string;
  current: PageKey;
  languagePaths?: Record<Locale, string>;
  children: ReactNode;
}) {
  const t = getDictionary(locale);
  const paths =
    languagePaths ??
    (Object.fromEntries(locales.map((code) => [code, localePath(code, path)])) as Record<
      Locale,
      string
    >);
  return (
    <>
      <a className="skip-link" href="#main">
        {t.a11y.skipToContent}
      </a>
      <header>
        <TopBar locale={locale} languagePaths={paths} current={current} />
        <Header locale={locale} current={current} />
      </header>
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer locale={locale} />
    </>
  );
}
