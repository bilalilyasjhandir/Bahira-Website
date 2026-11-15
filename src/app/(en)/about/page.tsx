import { pageMetadata } from "@/lib/metadata";
import { AboutPage } from "@/views/AboutPage";

export const metadata = pageMetadata("en", "about");

export default function Page() {
  return <AboutPage locale="en" />;
}
