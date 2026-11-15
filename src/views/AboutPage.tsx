import { PageIntro } from "@/components/PageIntro";
import { Photo } from "@/components/Photo";
import { Prose } from "@/components/Prose";
import { Section } from "@/components/Section";
import { Shell } from "@/components/Shell";
import { Support } from "@/components/Support";
import { Lead, TextSection } from "@/components/TextSection";
import type { Locale } from "@/i18n/config";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import { getPageText, section } from "@/lib/content";
import { founderName } from "@/lib/org";
import { pagePath } from "@/lib/pages";
import styles from "./AboutPage.module.css";

/** Bilal's photo, beside his note. */
const FOUNDER_PHOTO = "founder/bilal.jpg";

/**
 * About us (content/pages/<language>/about.md): the founder's note, the name and the sign
 * (the page's one dark band, as on the home page), why Human Rights Day, what we want, what
 * we hold to, where we work, and who runs Bahira.
 */
export function AboutPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const text = getPageText(locale, "about");
  const note = section(text, "founder");
  const foreign = text.textLocale !== locale ? text.textLocale : undefined;

  return (
    <Shell locale={locale} path={pagePath("about")} current="about">
      <PageIntro title={t.pages.about.title} lead={<Lead text={text} locale={locale} />} />

      <Section
        id="founder"
        title={note.heading}
        textLocale={foreign}
        aside={
          <Photo
            photo={FOUNDER_PHOTO}
            alt={fill(t.aboutPage.photoAlt, { name: founderName(locale) })}
            sizes="(min-width: 64em) 20rem, 16rem"
            // In the first screen on phones and laptops alike, and the largest thing there.
            priority
            className={styles.founder}
          />
        }
      >
        <div className={styles.note}>
          <Prose blocks={note.blocks} locale={locale} textLocale={text.textLocale} />
          <p className={styles.signature}>
            {fill(t.aboutPage.signature, { name: founderName(locale) })}
          </p>
        </div>
      </Section>

      <TextSection
        text={text}
        id="name"
        locale={locale}
        tone="dark"
        aside={
          // The text beside it describes the sign, so the picture needs no description.
          <img
            className={styles.symbol}
            src="/brand/logo/bahira-symbol-white.svg"
            alt=""
            width={343}
            height={495}
            loading="lazy"
          />
        }
      />
      <TextSection text={text} id="human-rights-day" locale={locale} />
      <TextSection text={text} id="mission" locale={locale} />
      <TextSection text={text} id="values" locale={locale} />
      <TextSection text={text} id="where" locale={locale} />
      <TextSection text={text} id="who" locale={locale} />
      <Support locale={locale} />
    </Shell>
  );
}
