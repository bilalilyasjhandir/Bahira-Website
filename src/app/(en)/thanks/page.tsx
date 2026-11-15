import { pageMetadata } from "@/lib/metadata";
import { ThanksPage } from "@/views/ThanksPage";

export const metadata = pageMetadata("en", "thanks");

export default function Page() {
  return <ThanksPage locale="en" />;
}
