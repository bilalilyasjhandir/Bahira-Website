import { rtlLocale, type RtlPageProps } from "@/i18n/route";
import { pageMetadata } from "@/lib/metadata";
import { HelpPage } from "@/views/HelpPage";

export async function generateMetadata({ params }: RtlPageProps) {
  return pageMetadata(await rtlLocale(params), "help");
}

export default async function Page({ params }: RtlPageProps) {
  return <HelpPage locale={await rtlLocale(params)} />;
}
