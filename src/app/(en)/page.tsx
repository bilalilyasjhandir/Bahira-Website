import { pageMetadata } from "@/lib/metadata";
import { HomePage } from "@/views/HomePage";

export const metadata = pageMetadata("en", "home");

export default function Page() {
  return <HomePage locale="en" />;
}
