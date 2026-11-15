import { pageMetadata } from "@/lib/metadata";
import { WorkPage } from "@/views/WorkPage";

export const metadata = pageMetadata("en", "work");

export default function Page() {
  return <WorkPage locale="en" />;
}
