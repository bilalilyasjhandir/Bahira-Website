import { ArrowLink } from "@/components/ArrowLink";
import { Email } from "@/components/Email";
import { PageIntro } from "@/components/PageIntro";
import { Section } from "@/components/Section";
import { Shell } from "@/components/Shell";
import { SiteForm } from "@/components/SiteForm";
import { Socials } from "@/components/Socials";
import type { Locale } from "@/i18n/config";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/paths";
import { org } from "@/lib/org";
import { pagePath } from "@/lib/pages";
import styles from "./ContactPage.module.css";

/**
 * Contact: the email address, where we are, why there is no phone number yet, social media,
 * and the contact form. People who need help are pointed to the help form instead.
 */
export function ContactPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const c = t.contactPage;
  return (
    <Shell locale={locale} path={pagePath("contact")} current="contact">
      <PageIntro title={t.pages.contact.title} lead={<p>{c.lead}</p>} />
      <div className={`container ${styles.details}`}>
        <dl className={styles.list}>
          <div className={styles.item}>
            <dt className={`label ${styles.term}`}>{c.email}</dt>
            <dd>
              <Email />
            </dd>
          </div>
          <div className={styles.item}>
            <dt className={`label ${styles.term}`}>{c.where}</dt>
            <dd>{fill(c.whereValue, { postcode: org.organisation.postcode })}</dd>
          </div>
          <div className={styles.item}>
            <dt className={`label ${styles.term}`}>{c.phone}</dt>
            <dd>
              {org.contact.phone ? (
                <a href={`tel:${org.contact.phone.replace(/[^\d+]/g, "")}`}>
                  <bdi dir="ltr">{org.contact.phone}</bdi>
                </a>
              ) : (
                c.phoneValue
              )}
            </dd>
          </div>
          {org.socials.length > 0 && (
            <div className={styles.item}>
              <dt className={`label ${styles.term}`}>{c.social}</dt>
              <dd>
                <Socials locale={locale} />
              </dd>
            </div>
          )}
        </dl>
      </div>
      <Section id="contact-form" title={c.formTitle} tone="tint">
        <p className={styles.help}>
          {c.helpText}{" "}
          <ArrowLink href={localePath(locale, pagePath("help"))}>{c.helpLink}</ArrowLink>
        </p>
        <SiteForm kind="contact" locale={locale} labelledBy="contact-form-title" />
      </Section>
    </Shell>
  );
}
