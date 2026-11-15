import { Fragment } from "react";
import type { Locale } from "@/i18n/config";
import { formatDate } from "@/i18n/format";
import { localePath } from "@/i18n/paths";
import type { Block, Inline } from "@/lib/markdown";
import { founderName, org } from "@/lib/org";
import { Email } from "./Email";
import styles from "./Prose.module.css";

/**
 * Long text from content/, read by src/lib/markdown.ts: paragraphs, subheadings, lists and
 * links. A link to a page of the site goes to that page in the reader's language.
 *
 * `locale` is the language of the page; `textLocale` is the language the text is written in,
 * which differs only where a translation is missing and the English text stands in.
 */
export function Prose({
  blocks,
  locale,
  textLocale = locale,
  className,
}: {
  blocks: Block[];
  locale: Locale;
  textLocale?: Locale;
  className?: string;
}) {
  const parts = (content: Inline[]) =>
    content.map((part, i) => <Part key={i} part={part} locale={locale} textLocale={textLocale} />);
  return (
    <div className={className ? `${styles.prose} ${className}` : styles.prose}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return <p key={i}>{parts(block.content)}</p>;
          case "heading":
            return <h3 key={i}>{parts(block.content)}</h3>;
          case "list": {
            const List = block.ordered ? "ol" : "ul";
            return (
              <List key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{parts(item)}</li>
                ))}
              </List>
            );
          }
        }
      })}
    </div>
  );
}

function Part({ part, locale, textLocale }: { part: Inline; locale: Locale; textLocale: Locale }) {
  switch (part.type) {
    case "text":
      return <Fragment>{part.text}</Fragment>;
    case "link":
      return (
        <a href={part.href.startsWith("/") ? localePath(locale, part.href) : part.href}>
          {part.text}
        </a>
      );
    case "fact":
      switch (part.name) {
        case "email":
          return <Email />;
        case "founded":
          return <Fragment>{formatDate(org.organisation.founded, textLocale)}</Fragment>;
        case "arabic":
          // Arabic, not Urdu: set in the reader's own Arabic font (base.css), never in Nastaliq.
          return (
            <span lang="ar" dir="rtl" className={styles.arabic}>
              {org.organisation.nameArabic}
            </span>
          );
        case "founder":
          return <Fragment>{founderName(textLocale)}</Fragment>;
      }
  }
}
