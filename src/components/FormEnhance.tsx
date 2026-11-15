"use client";

import { useEffect, useRef, type FormEvent, type ReactNode } from "react";

/**
 * The forms work as plain HTML before any JavaScript has loaded: the browser checks the
 * fields and posts to Web3Forms, which sends the visitor on to our thank-you page. Once
 * this script runs it adds three things:
 * - error messages in the page's language (the browser's own are in the phone's language),
 *   listed at the top of the form and shown beside each field;
 * - the rule that a volunteer or contact form needs a phone number or an email address;
 * - sending in the background, then the thank-you page; if sending fails, the message stays
 *   and a note gives the email address instead.
 * All the words it shows are already in the page (data-* attributes and hidden elements),
 * so this file holds no text of its own.
 */
export function FormEnhance({
  action,
  thanks,
  className,
  labelledBy,
  children,
}: {
  action: string;
  /** The thank-you page in the page's language, e.g. /ur/thanks/ */
  thanks: string;
  className?: string;
  labelledBy: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLFormElement>(null);

  // The browser's own checks stay on until this script has loaded, then hand over to it.
  useEffect(() => {
    if (ref.current) ref.current.noValidate = true;
  }, []);

  // A field's error goes away as soon as the visitor changes it.
  function onInput(event: FormEvent<HTMLFormElement>) {
    const target = event.target as HTMLElement;
    for (const selector of ["[data-field]", "[data-reach]"]) {
      const field = target.closest<HTMLElement>(selector);
      if (field) showError(field, "");
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const failed = form.querySelector<HTMLElement>("[data-failed]");
    if (failed) failed.hidden = true;

    const problems = check(form);
    const summary = form.querySelector<HTMLElement>("[data-summary]");
    if (summary) {
      const list = summary.querySelector("ul");
      list?.replaceChildren(
        ...problems.map(({ message, input }) => {
          const link = document.createElement("a");
          link.href = `#${input.id}`;
          link.textContent = message;
          link.addEventListener("click", (e) => {
            e.preventDefault();
            input.focus();
          });
          const item = document.createElement("li");
          item.append(link);
          return item;
        }),
      );
      summary.hidden = problems.length === 0;
      if (problems.length > 0) {
        summary.focus();
        return;
      }
    }

    const button = form.querySelector<HTMLButtonElement>("button[type=submit]");
    const status = form.querySelector<HTMLElement>("[data-status]");
    const label = button?.textContent ?? "";
    const sending = button?.dataset.sending ?? "";
    if (button) {
      button.disabled = true;
      button.textContent = sending;
    }
    if (status) status.textContent = sending;

    // Repeated fields (the volunteer's interests) are joined into one line, as Web3Forms
    // does with a plain form. The redirect is only for visitors without JavaScript.
    const data: Record<string, string> = {};
    for (const [name, value] of new FormData(form)) {
      if (name === "redirect" || typeof value !== "string") continue;
      data[name] = data[name] ? `${data[name]}, ${value}` : value;
    }
    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json().catch(() => null)) as { success?: boolean } | null;
      if (response.ok && result?.success) {
        window.location.assign(thanks);
        return;
      }
    } catch {
      // Offline, or Web3Forms could not be reached: handled below.
    }
    if (button) {
      button.disabled = false;
      button.textContent = label;
    }
    if (status) status.textContent = "";
    if (failed) {
      failed.hidden = false;
      failed.focus();
    }
  }

  return (
    <form
      ref={ref}
      action={action}
      method="post"
      className={className}
      aria-labelledby={labelledBy}
      onSubmit={onSubmit}
      onInput={onInput}
    >
      {children}
    </form>
  );
}

type Problem = { message: string; input: HTMLInputElement | HTMLTextAreaElement };

/** Checks every field and shows its error; returns the problems, in the order of the form. */
function check(form: HTMLFormElement): Problem[] {
  const problems: Problem[] = [];
  for (const field of form.querySelectorAll<HTMLElement>("[data-field]")) {
    const error = field.querySelector<HTMLElement>("[data-error]");
    if (!error) continue;
    // A question answered by choosing one option (radio buttons).
    const radios = [...field.querySelectorAll<HTMLInputElement>("input[type=radio]")];
    if (radios.length > 0) {
      const missing = radios.some((r) => r.required) && !radios.some((r) => r.checked);
      const message = missing ? (error.dataset.missing ?? "") : "";
      showError(field, message);
      if (message) problems.push({ message, input: radios[0]! });
      continue;
    }
    const input = field.querySelector<HTMLInputElement | HTMLTextAreaElement>(
      "input:not([type=checkbox]), textarea",
    );
    if (!input) continue;
    const value = input.value.trim();
    let message = "";
    if (!value) {
      if (input.required) message = error.dataset.missing ?? "";
    } else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = error.dataset.invalid ?? "";
    } else if (input.type === "tel" && value.replace(/\D/g, "").length < 10) {
      message = error.dataset.invalid ?? "";
    } else if (
      input.dataset.amount !== undefined &&
      !(/^\d[\d,]*$/.test(value) && Number(value.replace(/,/g, "")) > 0)
    ) {
      message = error.dataset.invalid ?? "";
    }
    showError(field, message);
    if (message) problems.push({ message, input });
  }
  // A volunteer or contact form needs at least one way to reach the sender.
  const reach = form.querySelector<HTMLElement>("[data-reach]");
  const inputs = reach ? [...reach.querySelectorAll<HTMLInputElement>("input")] : [];
  if (reach && inputs.length > 0 && inputs.every((input) => !input.value.trim())) {
    const message = reach.querySelector<HTMLElement>("[data-reach-error]")?.dataset.missing ?? "";
    showError(reach, message);
    problems.unshift({ message, input: inputs[0]! });
    problems.sort((a, b) =>
      a.input.compareDocumentPosition(b.input) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    );
  } else if (reach) {
    showError(reach, "");
  }
  return problems;
}

/** Shows a message under a field's label (or hides it when the message is empty). */
function showError(field: HTMLElement, message: string) {
  const error = field.querySelector<HTMLElement>(
    field.hasAttribute("data-reach") ? "[data-reach-error]" : "[data-error]",
  );
  if (!error) return;
  error.textContent = message;
  error.hidden = !message;
  const inputs = field.hasAttribute("data-reach")
    ? [...field.querySelectorAll<HTMLInputElement>("input")]
    : [...field.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea")];
  for (const input of inputs) {
    const described = (input.getAttribute("aria-describedby") ?? "")
      .split(" ")
      .filter((id) => id && id !== error.id);
    if (message) {
      input.setAttribute("aria-invalid", "true");
      described.push(error.id);
    } else if (!input.closest("[data-field]")?.querySelector("[data-error]:not([hidden])")) {
      input.removeAttribute("aria-invalid");
    }
    if (described.length) input.setAttribute("aria-describedby", described.join(" "));
    else input.removeAttribute("aria-describedby");
  }
}
