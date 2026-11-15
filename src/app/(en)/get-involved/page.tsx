import { pageMetadata } from "@/lib/metadata";
import { GetInvolvedPage } from "@/views/GetInvolvedPage";

export const metadata = pageMetadata("en", "getInvolved");

export default function Page() {
  return <GetInvolvedPage locale="en" />;
}
