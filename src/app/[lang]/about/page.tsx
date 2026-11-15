import { rtlLocale, type RtlPageProps } from "@/i18n/route";
import { pageMetadata } from "@/lib/metadata";
import { AboutPage } from "@/views/AboutPage";

export async function generateMetadata({ params }: RtlPageProps) {
  return pageMetadata(await rtlLocale(params), "about");
}

export default async function Page({ params }: RtlPageProps) {
  return <AboutPage locale={await rtlLocale(params)} />;
}
