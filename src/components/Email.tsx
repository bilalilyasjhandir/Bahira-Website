import { org } from "@/lib/org";

/**
 * The foundation's email address as a link. It is always written left to right in Onest,
 * also inside Urdu and Saraiki text. If the line is too short for it, it breaks before the
 * "@" (bahirafoundationbwp / @gmail.com) rather than somewhere in the middle.
 */
export function Email({ className }: { className?: string }) {
  const [name, domain] = org.contact.email.split("@");
  return (
    <a href={`mailto:${org.contact.email}`} className={className}>
      <bdi dir="ltr" lang="en">
        {name}
        <wbr />@{domain}
      </bdi>
    </a>
  );
}
