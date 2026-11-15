import { pageMetadata } from "@/lib/metadata";
import { ContactPage } from "@/views/ContactPage";

export const metadata = pageMetadata("en", "contact");

export default function Page() {
  return <ContactPage locale="en" />;
}
