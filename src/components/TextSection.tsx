import type { ReactNode } from "react";
import { direction, type Locale } from "@/i18n/config";
import { section, type LongText } from "@/lib/content";
import { Prose } from "./Prose";
import { Section } from "./Section";

/**
 * A section of a page made from its long text: the "## Heading {#key}" part of
 * content/pages/<language>/<page>.md with that key. `children` come after the text.
 */
export function TextSection({
  text,
  id,
  locale,
  tone,
  aside,
  children,
}: {
  text: LongText;
  id: string;
  locale: Locale;
  tone?: "plain" | "tint" | "dark";
  aside?: ReactNode;
  children?: ReactNode;
}) {
  const part = section(text, id);
  return (
    <Section
      id={id}
      title={part.heading}
      tone={tone}
      aside={aside}
      textLocale={text.textLocale !== locale ? text.textLocale : undefined}
    >
      <Prose blocks={part.blocks} locale={locale} textLocale={text.textLocale} />
      {children}
    </Section>
  );
}

/** The opening paragraph of a page's long text, for PageIntro. */
export function Lead({ text, locale }: { text: LongText; locale: Locale }) {
  if (text.lead.length === 0) return null;
  const foreign = text.textLocale !== locale;
  return (
    <div
      lang={foreign ? text.textLocale : undefined}
      dir={foreign ? direction[text.textLocale] : undefined}
    >
      <Prose blocks={text.lead} locale={locale} textLocale={text.textLocale} />
    </div>
  );
}
