import { Photo } from "./Photo";
import styles from "./Gallery.module.css";

/**
 * More photos from one day, two across on phones and three on wider screens. They load only
 * when a reader scrolls near them, and phones get small versions, to save prepaid data.
 */
export function Gallery({
  id,
  title,
  photos,
}: {
  id: string;
  title: string;
  photos: { photo: string; alt: string }[];
}) {
  if (photos.length === 0) return null;
  return (
    <section className={`container ${styles.section}`} aria-labelledby={id}>
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      <ul role="list" className={styles.grid}>
        {photos.map((p) => (
          <li key={p.photo}>
            <Photo
              photo={p.photo}
              alt={p.alt}
              sizes="(min-width: 80em) 389px, (min-width: 48em) calc(33vw - 1.5rem), calc(50vw - 1.25rem)"
              className={styles.photo}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
