import { causeMetadata } from "@/lib/metadata";
import { contentSlugs } from "@/lib/pages";
import { CausePage } from "@/views/CausePage";

type Props = { params: Promise<{ slug: string }> };

// One page for each file in content/causes/en/; any other address is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return contentSlugs("causes", "en").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  return causeMetadata("en", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <CausePage locale="en" slug={(await params).slug} />;
}
