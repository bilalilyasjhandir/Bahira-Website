import { rtlLocale, type RtlPageProps } from "@/i18n/route";
import { pageMetadata } from "@/lib/metadata";
import { PlaceholderPage } from "@/views/PlaceholderPage";

export async function generateMetadata({ params }: RtlPageProps) {
  return pageMetadata(await rtlLocale(params), "work");
}

export default async function Page({ params }: RtlPageProps) {
  return <PlaceholderPage locale={await rtlLocale(params)} page="work" />;
}
