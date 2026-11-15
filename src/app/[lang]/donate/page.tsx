import { rtlLocale, type RtlPageProps } from "@/i18n/route";
import { pageMetadata } from "@/lib/metadata";
import { DonatePage } from "@/views/DonatePage";

export async function generateMetadata({ params }: RtlPageProps) {
  return pageMetadata(await rtlLocale(params), "donate");
}

export default async function Page({ params }: RtlPageProps) {
  return <DonatePage locale={await rtlLocale(params)} />;
}
