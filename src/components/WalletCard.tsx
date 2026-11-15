import { Fragment } from "react";
import type { Locale } from "@/i18n/config";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import { founderName, type Org } from "@/lib/org";
import { CopyButton } from "./CopyButton";
import styles from "./WalletCard.module.css";

type Wallet = Org["donations"]["wallets"][number];

/**
 * One account to send donations to, from data/org.yaml: shown only while donations are open.
 * One mobile number works with several apps (JazzCash, Easypaisa, NayaPay, SadaPay). The
 * account is in a person's name until Bahira has one of its own, so the card says whose it
 * is, plainly.
 */
export function WalletCard({ wallet, locale }: { wallet: Wallet; locale: Locale }) {
  const t = getDictionary(locale);
  const d = t.donatePage;
  const comma = locale === "en" ? ", " : "، ";
  return (
    <div className={styles.card}>
      <dl className={styles.list}>
        <div>
          <dt>{d.number}</dt>
          <dd className={styles.number}>
            <bdi dir="ltr" lang="en">
              {wallet.number}
            </bdi>
            <CopyButton
              text={wallet.number.replace(/\D/g, "")}
              label={d.copy}
              copiedLabel={d.copied}
              className={styles.copy}
            />
          </dd>
        </div>
        <div>
          <dt>{d.apps}</dt>
          <dd>
            {wallet.apps.map((app, i) => (
              <Fragment key={app}>
                {i > 0 && (i === wallet.apps.length - 1 ? ` ${d.or} ` : comma)}
                <bdi lang="en">{app}</bdi>
              </Fragment>
            ))}
          </dd>
        </div>
        <div>
          <dt>{d.accountTitle}</dt>
          <dd>
            <bdi lang="en">{wallet.accountTitle}</bdi>
          </dd>
        </div>
        <div>
          <dt>{d.holder}</dt>
          <dd>{fill(d.holderNote, { name: founderName(locale), role: d.roles[wallet.holder] })}</dd>
        </div>
      </dl>
    </div>
  );
}
