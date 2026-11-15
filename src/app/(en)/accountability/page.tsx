import { pageMetadata } from "@/lib/metadata";
import { AccountabilityPage } from "@/views/AccountabilityPage";

export const metadata = pageMetadata("en", "accountability");

export default function Page() {
  return <AccountabilityPage locale="en" />;
}
