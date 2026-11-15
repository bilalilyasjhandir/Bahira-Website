import { rtlLocale, type RtlPageProps } from "@/i18n/route";
import { pageMetadata } from "@/lib/metadata";
import { PrivacyPage } from "@/views/PrivacyPage";

export async function generateMetadata({ params }: RtlPageProps) {
  return pageMetadata(await rtlLocale(params), "privacy");
}

export default async function Page({ params }: RtlPageProps) {
  return <PrivacyPage locale={await rtlLocale(params)} />;
}
