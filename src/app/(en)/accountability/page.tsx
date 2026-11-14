import { pageMetadata } from "@/lib/metadata";
import { PlaceholderPage } from "@/views/PlaceholderPage";

export const metadata = pageMetadata("en", "accountability");

export default function Page() {
  return <PlaceholderPage locale="en" page="accountability" />;
}
