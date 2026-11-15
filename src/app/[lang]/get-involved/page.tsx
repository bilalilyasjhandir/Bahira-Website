import { rtlLocale, type RtlPageProps } from "@/i18n/route";
import { pageMetadata } from "@/lib/metadata";
import { GetInvolvedPage } from "@/views/GetInvolvedPage";

export async function generateMetadata({ params }: RtlPageProps) {
  return pageMetadata(await rtlLocale(params), "getInvolved");
}

export default async function Page({ params }: RtlPageProps) {
  return <GetInvolvedPage locale={await rtlLocale(params)} />;
}
