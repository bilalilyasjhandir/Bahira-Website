import type { Locale } from "@/i18n/config";
import { formatMonth } from "@/i18n/format";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import type { Update } from "@/lib/content";
import { Photo } from "./Photo";
import styles from "./Figure.module.css";

/**
 * A photo with its caption: the event it was taken at and the month ("Iftar at Bahawalpur
 * Railway Station, March 2026."), found from the update the photo belongs to.
 */
export function Figure({
  photo,
  alt,
  updates,
  locale,
  sizes,
  priority = false,
}: {
  photo: string;
  alt: string;
  /** Every update, in the page's language: one of them has this photo. */
  updates: Update[];
  locale: Locale;
  sizes: string;
  priority?: boolean;
}) {
  const t = getDictionary(locale);
  const update = updates.find((u) => u.cover === photo || u.photos.some((p) => p.photo === photo));
  if (!update) throw new Error(`The photo ${photo} belongs to no update, so it has no caption.`);
  return (
    <figure className={styles.figure}>
      <Photo photo={photo} alt={alt} sizes={sizes} priority={priority} className={styles.photo} />
      <figcaption className={styles.caption}>
        {fill(t.home.photoCaption, {
          title: update.title,
          month: formatMonth(update.date, update.textLocale),
        })}
      </figcaption>
    </figure>
  );
}

/** How wide a photo beside a page's opening text is drawn: as on the home page. */
export const INTRO_PHOTO_SIZES =
  "(min-width: 80em) 486px, (min-width: 48em) 40vw, calc(100vw - 2rem)";
