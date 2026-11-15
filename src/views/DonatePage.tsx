import { PageIntro } from "@/components/PageIntro";
import { Section } from "@/components/Section";
import { Shell } from "@/components/Shell";
import { SiteForm } from "@/components/SiteForm";
import { Lead, TextSection } from "@/components/TextSection";
import { WalletCard } from "@/components/WalletCard";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getPageText } from "@/lib/content";
import { org } from "@/lib/org";
import { pagePath } from "@/lib/pages";
import styles from "./DonatePage.module.css";

/**
 * Donate. While donations are closed (data/org.yaml; Bilal decides when they open) the page
 * says so and shows what people can do today (content/pages/<language>/donate.md). Once open,
 * it shows the account, the form to report a donation, Zakat, and how giving works
 * (donate-open.md).
 */
export function DonatePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  if (org.organisation.registration.registered) {
    // The texts say Bahira is not registered: they must be rewritten before this changes.
    throw new Error("Bahira is registered: update the Donate and Accountability texts first.");
  }
  const shell = { locale, path: pagePath("donate"), current: "donate" as const };

  if (org.donations.open) {
    const text = getPageText(locale, "donate-open");
    return (
      <Shell {...shell}>
        <PageIntro title={t.pages.donate.title} lead={<Lead text={text} locale={locale} />} />
        <Section id="wallets" title={t.donatePage.walletsTitle} tone="tint">
          <div className={styles.wallets}>
            {org.donations.wallets.map((wallet) => (
              <WalletCard key={wallet.number} wallet={wallet} locale={locale} />
            ))}
          </div>
        </Section>
        {/* Each donation is reported, so it can be kept apart from the account holder's own
            money and spent as the donor wished. */}
        <TextSection text={text} id="report" locale={locale}>
          <SiteForm kind="donation" locale={locale} labelledBy="report-title" />
        </TextSection>
        {org.donations.zakat && <TextSection text={text} id="zakat" locale={locale} />}
        <TextSection text={text} id="tax" locale={locale} />
        <TextSection text={text} id="abroad" locale={locale} />
        <TextSection text={text} id="careful" locale={locale} />
      </Shell>
    );
  }

  const text = getPageText(locale, "donate");
  return (
    <Shell {...shell}>
      <PageIntro title={t.pages.donate.title} lead={<Lead text={text} locale={locale} />} />
      <TextSection text={text} id="today" locale={locale} />
      <TextSection text={text} id="careful" locale={locale} />
      <TextSection text={text} id="registration" locale={locale} />
    </Shell>
  );
}
