import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import type { PageKey } from "@/lib/pages";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { TopBar } from "./TopBar";

/**
 * The frame of every page: skip link, top bar, header, the page itself and the footer.
 * `path` is the page's English address ("/about/"); the language chooser uses it to link
 * to the same page in the other languages.
 */
export function Shell({
  locale,
  path,
  current,
  children,
}: {
  locale: Locale;
  path: string;
  current: PageKey;
  children: ReactNode;
}) {
  const t = getDictionary(locale);
  return (
    <>
      <a className="skip-link" href="#main">
        {t.a11y.skipToContent}
      </a>
      <header>
        <TopBar locale={locale} path={path} current={current} />
        <Header locale={locale} current={current} />
      </header>
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer locale={locale} />
    </>
  );
}
