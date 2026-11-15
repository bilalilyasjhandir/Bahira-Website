import { pageMetadata } from "@/lib/metadata";
import { HelpPage } from "@/views/HelpPage";

export const metadata = pageMetadata("en", "help");

export default function Page() {
  return <HelpPage locale="en" />;
}
