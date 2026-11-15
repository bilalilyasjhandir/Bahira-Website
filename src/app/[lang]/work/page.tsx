import { rtlLocale, type RtlPageProps } from "@/i18n/route";
import { pageMetadata } from "@/lib/metadata";
import { WorkPage } from "@/views/WorkPage";

export async function generateMetadata({ params }: RtlPageProps) {
  return pageMetadata(await rtlLocale(params), "work");
}

export default async function Page({ params }: RtlPageProps) {
  return <WorkPage locale={await rtlLocale(params)} />;
}
