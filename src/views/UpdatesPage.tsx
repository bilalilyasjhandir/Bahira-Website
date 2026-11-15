import { PageIntro } from "@/components/PageIntro";
import { Shell } from "@/components/Shell";
import { Support } from "@/components/Support";
import { UpdateList } from "@/components/UpdateList";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getUpdates } from "@/lib/content";
import { pagePath } from "@/lib/pages";
import styles from "./UpdatesPage.module.css";

/** Updates: every post about Bahira's work, newest first, each linking to its own page. */
export function UpdatesPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <Shell locale={locale} path={pagePath("updates")} current="updates">
      <PageIntro title={t.pages.updates.title} lead={<p>{t.updatesPage.lead}</p>} />
      <div className={`container ${styles.list}`}>
        <UpdateList updates={getUpdates(locale)} locale={locale} headingLevel={2} />
      </div>
      <Support locale={locale} />
    </Shell>
  );
}
