import { rtlLocale } from "@/i18n/route";
import { updateMetadata } from "@/lib/metadata";
import { contentSlugs } from "@/lib/pages";
import { UpdatePage } from "@/views/UpdatePage";

type Props = { params: Promise<{ lang: string; slug: string }> };

// One page for each file in content/updates/<language>/: only what has been translated
// into Urdu or Saraiki gets a page in that language. Any other address is a 404.
export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return contentSlugs("updates", params.lang).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  return updateMetadata(await rtlLocale(params), (await params).slug);
}

export default async function Page({ params }: Props) {
  return <UpdatePage locale={await rtlLocale(params)} slug={(await params).slug} />;
}
