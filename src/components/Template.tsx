import { Fragment, type ReactNode } from "react";

/**
 * A translated sentence with {placeholders} filled by elements, e.g.
 *   <Template text="Bahira comes from the Arabic word {arabic}." values={{ arabic: <span lang="ar">…</span> }} />
 * For plain text, fill() in src/i18n/get-dictionary.ts is enough.
 */
export function Template({ text, values }: { text: string; values: Record<string, ReactNode> }) {
  return text.split(/(\{\w+\})/).map((part, i) => {
    const key = /^\{(\w+)\}$/.exec(part)?.[1];
    if (key && !(key in values)) throw new Error(`No value for {${key}} in "${text}"`);
    return <Fragment key={i}>{key ? values[key] : part}</Fragment>;
  });
}
