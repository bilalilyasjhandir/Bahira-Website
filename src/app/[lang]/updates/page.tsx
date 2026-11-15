import { rtlLocale, type RtlPageProps } from "@/i18n/route";
import { pageMetadata } from "@/lib/metadata";
import { UpdatesPage } from "@/views/UpdatesPage";

export async function generateMetadata({ params }: RtlPageProps) {
  return pageMetadata(await rtlLocale(params), "updates");
}

export default async function Page({ params }: RtlPageProps) {
  return <UpdatesPage locale={await rtlLocale(params)} />;
}
