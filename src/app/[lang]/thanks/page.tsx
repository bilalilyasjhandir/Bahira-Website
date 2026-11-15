import { rtlLocale, type RtlPageProps } from "@/i18n/route";
import { pageMetadata } from "@/lib/metadata";
import { ThanksPage } from "@/views/ThanksPage";

export async function generateMetadata({ params }: RtlPageProps) {
  return pageMetadata(await rtlLocale(params), "thanks");
}

export default async function Page({ params }: RtlPageProps) {
  return <ThanksPage locale={await rtlLocale(params)} />;
}
