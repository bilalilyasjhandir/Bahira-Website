import type { ReactNode } from "react";
import styles from "./ArrowLink.module.css";

/**
 * A text link with an arrow: after the text, or before it for a link back to where the page
 * belongs ("← All updates"). On Urdu and Saraiki pages the arrows point the other way.
 */
export function ArrowLink({
  href,
  children,
  className,
  back = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  back?: boolean;
}) {
  const arrow = (
    <span aria-hidden="true" className={styles.arrow}>
      {back ? "←" : "→"}
    </span>
  );
  return (
    <a href={href} className={className ? `${styles.link} ${className}` : styles.link}>
      {back && arrow}
      {children}
      {!back && arrow}
    </a>
  );
}
