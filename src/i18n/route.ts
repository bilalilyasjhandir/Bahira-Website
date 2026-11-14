// Helpers for the Urdu and Saraiki routes under src/app/[lang]/.

import { notFound } from "next/navigation";
import { isRtlLocale, rtlLocales, type RtlLocale } from "./config";

export type RtlParams = Promise<{ lang: string }>;

export type RtlPageProps = { params: RtlParams };

/** The language of an Urdu or Saraiki page, read from its address (/ur/… or /skr/…). */
export async function rtlLocale(params: RtlParams): Promise<RtlLocale> {
  const { lang } = await params;
  if (!isRtlLocale(lang)) notFound();
  return lang;
}

/** Builds every page under src/app/[lang]/ twice: once at /ur/, once at /skr/. */
export function rtlStaticParams(): { lang: RtlLocale }[] {
  return rtlLocales.map((lang) => ({ lang }));
}
