import { rtlLocale } from "@/i18n/route";
import { causeMetadata } from "@/lib/metadata";
import { contentSlugs } from "@/lib/pages";
import { CausePage } from "@/views/CausePage";

type Props = { params: Promise<{ lang: string; slug: string }> };

// One page for each file in content/causes/<language>/: only what has been translated
// into Urdu or Saraiki gets a page in that language. Any other address is a 404.
export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return contentSlugs("causes", params.lang).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  return causeMetadata(await rtlLocale(params), (await params).slug);
}

export default async function Page({ params }: Props) {
  return <CausePage locale={await rtlLocale(params)} slug={(await params).slug} />;
}
