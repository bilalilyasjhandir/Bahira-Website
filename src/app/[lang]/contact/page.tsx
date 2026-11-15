import { rtlLocale, type RtlPageProps } from "@/i18n/route";
import { pageMetadata } from "@/lib/metadata";
import { ContactPage } from "@/views/ContactPage";

export async function generateMetadata({ params }: RtlPageProps) {
  return pageMetadata(await rtlLocale(params), "contact");
}

export default async function Page({ params }: RtlPageProps) {
  return <ContactPage locale={await rtlLocale(params)} />;
}
