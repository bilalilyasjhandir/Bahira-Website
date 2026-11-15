import { rtlLocale, type RtlPageProps } from "@/i18n/route";
import { pageMetadata } from "@/lib/metadata";
import { AccountabilityPage } from "@/views/AccountabilityPage";

export async function generateMetadata({ params }: RtlPageProps) {
  return pageMetadata(await rtlLocale(params), "accountability");
}

export default async function Page({ params }: RtlPageProps) {
  return <AccountabilityPage locale={await rtlLocale(params)} />;
}
