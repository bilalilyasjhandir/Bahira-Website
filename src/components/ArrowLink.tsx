import type { ReactNode } from "react";
import styles from "./ArrowLink.module.css";

/** A text link with an arrow after it. On Urdu and Saraiki pages the arrow points left. */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={className ? `${styles.link} ${className}` : styles.link}>
      {children}
      <span aria-hidden="true" className={styles.arrow}>
        →
      </span>
    </a>
  );
}
