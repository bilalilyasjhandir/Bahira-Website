import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { org } from "@/lib/org";
import styles from "./Helplines.module.css";

/**
 * The official helplines (data/org.yaml), each number a large link that starts a call on a
 * phone. These are the only phone numbers on the site: Bahira has none of its own yet.
 */
export function Helplines({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <ul role="list" className={styles.list}>
      {org.helplines.map((helpline) => {
        const words = t.helplines[helpline.id];
        return (
          <li key={helpline.id} className={styles.item}>
            <div className={styles.text}>
              <p className={styles.name}>{words.name}</p>
              <p>{words.text}</p>
            </div>
            <a
              href={`tel:${helpline.number}`}
              className={styles.number}
              aria-label={`${t.helpPage.call} ${words.name}: ${helpline.number}`}
            >
              <bdi dir="ltr">{helpline.number}</bdi>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
