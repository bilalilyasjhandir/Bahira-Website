import { pageMetadata } from "@/lib/metadata";
import { DonatePage } from "@/views/DonatePage";

export const metadata = pageMetadata("en", "donate");

export default function Page() {
  return <DonatePage locale="en" />;
}
