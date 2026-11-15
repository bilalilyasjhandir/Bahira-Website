import { Fragment } from "react";
import { formatDate, formatDateRange } from "@/i18n/format";
import type { Update } from "@/lib/content";
import styles from "./UpdateMeta.module.css";

/**
 * When and where an update happened: "11 March 2026 · Bahawalpur Railway Station". The
 * date, a venue and a city each stay whole, so the line breaks between them and never
 * inside a name ("Mohalla / Nawaban"). Dates follow the language of the update's text.
 */
export function UpdateMeta({ update, className }: { update: Update; className?: string }) {
  const locale = update.textLocale;
  const when = update.dateEnd
    ? formatDateRange(update.date, update.dateEnd, locale)
    : formatDate(update.date, locale);
  return (
    <p className={className}>
      <span className={styles.unit}>
        <time dateTime={update.date}>{when}</time>
        <span aria-hidden="true">{" ·"}</span>
      </span>
      {placeParts(update.place).map((part, i) => (
        <Fragment key={i}>
          {" "}
          <span className={styles.unit}>{part}</span>
        </Fragment>
      ))}
    </p>
  );
}

/**
 * A place split after each comma (English , or Urdu ،), so each part can be kept whole:
 * "Daykh Bhaal Shelter Home, Bahawalpur" → "Daykh Bhaal Shelter Home," and "Bahawalpur".
 */
function placeParts(place: string): string[] {
  return place.split(/(?<=[,،])\s+/);
}
