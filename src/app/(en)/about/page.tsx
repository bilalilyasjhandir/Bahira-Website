import { pageMetadata } from "@/lib/metadata";
import { PlaceholderPage } from "@/views/PlaceholderPage";

export const metadata = pageMetadata("en", "about");

export default function Page() {
  return <PlaceholderPage locale="en" page="about" />;
}
