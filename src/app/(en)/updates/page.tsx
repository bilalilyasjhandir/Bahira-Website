import { pageMetadata } from "@/lib/metadata";
import { UpdatesPage } from "@/views/UpdatesPage";

export const metadata = pageMetadata("en", "updates");

export default function Page() {
  return <UpdatesPage locale="en" />;
}
