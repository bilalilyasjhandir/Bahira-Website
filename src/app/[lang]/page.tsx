import { rtlLocale, type RtlPageProps } from "@/i18n/route";
import { pageMetadata } from "@/lib/metadata";
import { HomePage } from "@/views/HomePage";

export async function generateMetadata({ params }: RtlPageProps) {
  return pageMetadata(await rtlLocale(params), "home");
}

export default async function Page({ params }: RtlPageProps) {
  return <HomePage locale={await rtlLocale(params)} />;
}
