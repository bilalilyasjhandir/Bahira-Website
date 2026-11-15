import { pageMetadata } from "@/lib/metadata";
import { PrivacyPage } from "@/views/PrivacyPage";

export const metadata = pageMetadata("en", "privacy");

export default function Page() {
  return <PrivacyPage locale="en" />;
}
