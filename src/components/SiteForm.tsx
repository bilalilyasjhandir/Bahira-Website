import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { en } from "@/i18n/en";
import { getDictionary } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/paths";
import { causes } from "@/lib/causes";
import { org, walletApps } from "@/lib/org";
import { pagePath } from "@/lib/pages";
import { Email } from "./Email";
import { FormEnhance } from "./FormEnhance";
import { Template } from "./Template";
import styles from "./SiteForm.module.css";

/** Web3Forms passes each message on to the foundation's email (docs/website-plan.md, 5). */
const WEB3FORMS = "https://api.web3forms.com/submit";

export type FormKind = "volunteer" | "contact" | "help" | "donation";

// The email Bilal receives is in English whatever the page's language, so he can sort it.
const SUBJECT: Record<FormKind, string> = {
  volunteer: "New volunteer",
  contact: "New message",
  help: "Help request",
  donation: "Donation report",
};
const LANGUAGE: Record<Locale, string> = { en: "English", ur: "Urdu", skr: "Saraiki" };

/**
 * The four forms: volunteer (Get involved), contact (Contact), help (Need help?) and the
 * donation report (Donate, once donations are open). They ask only for what is needed: a
 * name, a way to reach the sender, the city, the message; for a donation, what it is needed
 * to find the payment and spend it as the donor wished. Never a CNIC number or gender
 * (check-site stops the build if one appears).
 */
export function SiteForm({
  kind,
  locale,
  labelledBy,
}: {
  kind: FormKind;
  locale: Locale;
  /** The id of the heading that names the form. */
  labelledBy: string;
}) {
  const t = getDictionary(locale);
  const f = t.forms;
  const id = (name: string) => `${kind}-${name}`;
  const thanks = localePath(locale, pagePath("thanks"));
  const optional = <span className={styles.optional}> ({f.optional})</span>;

  const phone = (required: boolean, hint?: string) => (
    <Field
      id={id("phone")}
      name="phone"
      type="tel"
      label={f.phone}
      hint={hint}
      errors={{ missing: required ? f.errors.phone : undefined, invalid: f.errors.phoneShort }}
      autoComplete="tel"
      required={required}
      maxLength={20}
    />
  );
  const email = (
    <Field
      id={id("email")}
      name="email"
      type="email"
      label={f.email}
      errors={{ invalid: f.errors.email }}
      autoComplete="email"
      maxLength={120}
    />
  );

  return (
    <FormEnhance action={WEB3FORMS} thanks={thanks} className={styles.form} labelledBy={labelledBy}>
      {/* Filled in by the script when something needs fixing; it then takes the focus. */}
      <div className={styles.summary} data-summary="" tabIndex={-1} hidden>
        <p className={styles.summaryTitle}>{f.errorTitle}</p>
        <ul role="list" />
      </div>

      {/* For Web3Forms: whose inbox (the key), the email's subject, and where a visitor
          without JavaScript goes after sending. */}
      <input type="hidden" name="access_key" value={org.forms.web3formsKey ?? ""} />
      <input
        type="hidden"
        name="subject"
        value={`${SUBJECT[kind]} (${LANGUAGE[locale]} page) · Bahira website`}
      />
      <input type="hidden" name="from_name" value="Bahira website" />
      <input type="hidden" name="redirect" value={new URL(thanks, org.site.url).href} />
      <input type="hidden" name="language" value={LANGUAGE[locale]} />

      {/* A trap for spam robots. People never see it, so only a robot ticks it, and
          Web3Forms then drops the message. */}
      <div className={styles.trap}>
        <label>
          {f.trap} <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {kind === "donation" ? (
        <Field
          id={id("name")}
          name="name"
          label={f.name}
          optionalMark={optional}
          hint={f.nameDonationHint}
          errors={{}}
          autoComplete="name"
          maxLength={100}
        />
      ) : (
        <Field
          id={id("name")}
          name="name"
          label={f.name}
          errors={{ missing: f.errors.name }}
          autoComplete="name"
          required
          maxLength={100}
        />
      )}

      {kind === "help" && phone(true, f.phoneHelpHint)}
      {(kind === "volunteer" || kind === "contact") && (
        <fieldset className={styles.group} data-reach="" aria-describedby={id("reach-hint")}>
          <legend className={styles.label}>{f.reach}</legend>
          <p id={id("reach-hint")} className={styles.hint}>
            {f.reachHint}
          </p>
          <p
            id={id("reach-error")}
            className={styles.error}
            data-reach-error=""
            data-missing={f.errors.reach}
            hidden
          />
          {phone(false)}
          {email}
        </fieldset>
      )}

      {(kind === "volunteer" || kind === "help") && (
        <Field
          id={id("city")}
          name="city"
          label={f.city}
          errors={{ missing: f.errors.city }}
          autoComplete="address-level2"
          required
          maxLength={100}
        />
      )}

      {kind === "donation" && (
        <>
          <Field
            id={id("amount")}
            name="amount"
            type="amount"
            label={f.amount}
            errors={{ missing: f.errors.amount, invalid: f.errors.amount }}
            required
            maxLength={12}
          />
          <Choices
            id={id("app")}
            name="app"
            legend={f.app}
            options={walletApps
              .filter((app) => org.donations.wallets.some((w) => w.apps.includes(app)))
              .map((app) => ({ value: app, label: app, latin: true }))}
            errors={{ missing: f.errors.app }}
            required
          />
          <Field
            id={id("tid")}
            name="transaction_id"
            type="code"
            label={f.tid}
            hint={f.tidHint}
            errors={{ missing: f.errors.tid }}
            required
            maxLength={40}
          />
          <Choices
            id={id("cause")}
            name="cause"
            legend={f.cause}
            options={[
              { value: en.forms.causeGeneral, label: f.causeGeneral },
              ...causes.map((cause) => ({
                value: en.causes[cause.key].title,
                label: t.causes[cause.key].title,
              })),
            ]}
            checked={en.forms.causeGeneral}
          />
          {org.donations.zakat && (
            <div className={styles.field}>
              <label className={styles.choice}>
                {/* Sent only when ticked; the email then says "zakat: Yes". */}
                <input
                  type="checkbox"
                  name="zakat"
                  value="Yes"
                  aria-describedby={id("zakat-hint")}
                />
                <span>{f.zakat}</span>
              </label>
              <p id={id("zakat-hint")} className={styles.hint}>
                {f.zakatHint}
              </p>
            </div>
          )}
          <fieldset className={styles.group} aria-describedby={id("confirm-hint")}>
            <legend className={styles.label}>
              {f.confirm}
              {optional}
            </legend>
            <p id={id("confirm-hint")} className={styles.hint}>
              {f.confirmHint}
            </p>
            {phone(false)}
            {email}
          </fieldset>
        </>
      )}

      {kind === "volunteer" && (
        <fieldset className={styles.group} aria-describedby={id("interests-hint")}>
          <legend className={styles.label}>
            {f.interests}
            {optional}
          </legend>
          <p id={id("interests-hint")} className={styles.hint}>
            {f.interestsHint}
          </p>
          <ul role="list" className={styles.choices}>
            {causes.map((cause) => (
              <li key={cause.key}>
                <label className={styles.choice}>
                  {/* The value is in English, for Bilal's inbox; the label is the reader's. */}
                  <input type="checkbox" name="interests" value={en.causes[cause.key].title} />
                  <span>{t.causes[cause.key].title}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      )}

      {(kind === "volunteer" || kind === "donation") && (
        <Field
          id={id("message")}
          name="message"
          type="textarea"
          label={f.messageVolunteer}
          optionalMark={optional}
          hint={kind === "volunteer" ? f.messageVolunteerHint : undefined}
          errors={{}}
          maxLength={3000}
        />
      )}
      {kind === "contact" && (
        <Field
          id={id("message")}
          name="message"
          type="textarea"
          label={f.message}
          errors={{ missing: f.errors.message }}
          required
          maxLength={3000}
        />
      )}
      {kind === "help" && (
        <Field
          id={id("message")}
          name="message"
          type="textarea"
          label={f.messageHelp}
          hint={f.messageHelpHint}
          errors={{ missing: f.errors.need }}
          required
          maxLength={3000}
        />
      )}

      <p className={styles.note}>
        <Template
          text={f.note}
          values={{
            privacy: <a href={localePath(locale, pagePath("privacy"))}>{f.noteLink}</a>,
          }}
        />
      </p>

      {/* Shown, and given the focus, if sending fails. */}
      <p className={styles.failed} data-failed="" tabIndex={-1} hidden>
        <Template text={f.failed} values={{ email: <Email /> }} />
      </p>
      <p className="visually-hidden" role="status" data-status="" />

      <button type="submit" className={`button ${styles.send}`} data-sending={f.sending}>
        {f.send}
      </button>
    </FormEnhance>
  );
}

/** One field: its label, a hint, a place for an error message, and the box itself. */
function Field({
  id,
  name,
  label,
  hint,
  type = "text",
  required = false,
  optionalMark,
  errors,
  autoComplete,
  maxLength,
}: {
  id: string;
  name: string;
  label: string;
  hint?: string;
  /** "amount": rupees, digits only; "code": a transaction ID, typed left to right. */
  type?: "text" | "tel" | "email" | "textarea" | "amount" | "code";
  required?: boolean;
  optionalMark?: ReactNode;
  errors: { missing?: string; invalid?: string };
  autoComplete?: string;
  maxLength: number;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const props = {
    id,
    name,
    required,
    maxLength,
    autoComplete,
    "aria-describedby": hintId,
    // Numbers, codes and email addresses are typed left to right, also on Urdu pages; other
    // fields follow what the visitor types.
    dir: type === "text" || type === "textarea" ? "auto" : "ltr",
    className: styles.input,
  };
  return (
    <div className={styles.field} data-field="">
      <label htmlFor={id} className={styles.label}>
        {label}
        {optionalMark}
      </label>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      <p
        id={`${id}-error`}
        className={styles.error}
        data-error=""
        data-missing={errors.missing}
        data-invalid={errors.invalid}
        hidden
      />
      {type === "textarea" ? (
        <textarea {...props} rows={6} />
      ) : type === "amount" ? (
        // Without JavaScript the browser checks it: digits, with commas if the donor likes.
        <input {...props} type="text" inputMode="numeric" pattern="[0-9][0-9,]*" data-amount="" />
      ) : type === "code" ? (
        <input {...props} type="text" autoCapitalize="characters" spellCheck={false} />
      ) : (
        <input
          {...props}
          type={type}
          // Without JavaScript the browser checks the number: 10 to 20 digits, spaces,
          // dashes, brackets or a plus.
          pattern={type === "tel" ? "[0-9+\\(\\)\\- ]{10,20}" : undefined}
        />
      )}
    </div>
  );
}

/**
 * One question answered by choosing one of a few options (radio buttons). The first option
 * carries the question's id, so the list of problems can link to it.
 */
function Choices({
  id,
  name,
  legend,
  options,
  errors,
  required = false,
  checked,
}: {
  id: string;
  name: string;
  legend: string;
  /** `value` is sent (in English, for Bilal's inbox); `label` is shown. `latin` marks names
   *  written in English letters (app names). */
  options: { value: string; label: string; latin?: boolean }[];
  errors?: { missing?: string };
  required?: boolean;
  /** The option chosen to begin with. */
  checked?: string;
}) {
  return (
    <fieldset className={styles.group} data-field="">
      <legend className={styles.label}>{legend}</legend>
      <p
        id={`${id}-error`}
        className={styles.error}
        data-error=""
        data-missing={errors?.missing}
        hidden
      />
      <ul role="list" className={styles.choices}>
        {options.map((option, i) => (
          <li key={option.value}>
            <label className={styles.choice}>
              <input
                type="radio"
                name={name}
                value={option.value}
                id={i === 0 ? id : undefined}
                required={required}
                defaultChecked={option.value === checked}
              />
              {option.latin ? (
                <bdi lang="en" dir="ltr">
                  {option.label}
                </bdi>
              ) : (
                <span>{option.label}</span>
              )}
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
