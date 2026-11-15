import { ArrowLink } from "@/components/ArrowLink";
import { PageIntro } from "@/components/PageIntro";
import { Shell } from "@/components/Shell";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/paths";
import { pagePath } from "@/lib/pages";
import styles from "./ThanksPage.module.css";

/**
 * Where every form lands after sending, in the sender's language: the message arrived, and
 * what happens next. Kept out of search engines (src/lib/pages.ts).
 */
export function ThanksPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <Shell locale={locale} path={pagePath("thanks")} current="thanks">
      <div className={styles.page}>
        <PageIntro
          title={t.pages.thanks.title}
          lead={
            <>
              <p>{t.thanksPage.lead}</p>
              <p className={styles.text}>{t.thanksPage.text}</p>
            </>
          }
        >
          <a className="button" href={localePath(locale, "/")}>
            {t.thanksPage.homeLink}
          </a>
          <ArrowLink href={localePath(locale, pagePath("updates"))}>
            {t.thanksPage.updatesLink}
          </ArrowLink>
        </PageIntro>
      </div>
    </Shell>
  );
}
