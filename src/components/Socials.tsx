import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { org } from "@/lib/org";
import styles from "./Socials.module.css";

/** The names of the social networks, as each writes its own. */
const NETWORKS = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
  linkedin: "LinkedIn",
} as const;

/**
 * Bahira's social media accounts (data/org.yaml) as plain links: no icons and no buttons
 * loaded from the networks, so nothing comes from another website until someone taps one.
 */
export function Socials({ locale, className }: { locale: Locale; className?: string }) {
  if (org.socials.length === 0) return null;
  const t = getDictionary(locale);
  return (
    <ul
      role="list"
      aria-label={t.a11y.socialNav}
      className={className ? `${styles.list} ${className}` : styles.list}
    >
      {org.socials.map((social) => (
        <li key={social.url}>
          <a href={social.url} lang="en" dir="ltr" className={styles.link}>
            {NETWORKS[social.network]}
          </a>
        </li>
      ))}
    </ul>
  );
}
