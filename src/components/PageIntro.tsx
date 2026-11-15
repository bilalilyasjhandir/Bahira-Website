import type { ReactNode } from "react";
import styles from "./PageIntro.module.css";

/**
 * The top of an inner page: a link back to where it belongs, a small label, the title, the
 * opening paragraph and any actions. With a photo, the photo stands beside the text from
 * tablet width, as on the home page; on phones it comes after the text.
 */
export function PageIntro({
  title,
  lead,
  label,
  back,
  photo,
  children,
}: {
  title: string;
  lead?: ReactNode;
  label?: ReactNode;
  back?: ReactNode;
  photo?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className={`container ${styles.intro} ${photo ? styles.withPhoto : ""}`}>
      <div className={styles.text}>
        {back && <div className={styles.back}>{back}</div>}
        {label && <div className={styles.label}>{label}</div>}
        <h1 className={styles.title}>{title}</h1>
        {lead && <div className={styles.lead}>{lead}</div>}
        {children && <div className={styles.actions}>{children}</div>}
      </div>
      {photo && <div className={styles.photo}>{photo}</div>}
    </div>
  );
}
