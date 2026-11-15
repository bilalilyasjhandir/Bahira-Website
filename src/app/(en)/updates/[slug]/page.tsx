import { updateMetadata } from "@/lib/metadata";
import { contentSlugs } from "@/lib/pages";
import { UpdatePage } from "@/views/UpdatePage";

type Props = { params: Promise<{ slug: string }> };

// One page for each file in content/updates/en/; any other address is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return contentSlugs("updates", "en").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  return updateMetadata("en", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <UpdatePage locale="en" slug={(await params).slug} />;
}
