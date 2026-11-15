"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

// Whether this browser can copy: never true on the server or before the script has run.
const noChanges = () => () => {};
const canCopy = () => typeof navigator !== "undefined" && Boolean(navigator.clipboard);
const notYet = () => false;

/**
 * Copies a wallet number, so a donor can paste it into their JazzCash or Easypaisa app.
 * It appears only once the script has loaded and only where copying works: without it the
 * button could do nothing, and the number is written out beside it anyway.
 */
export function CopyButton({
  text,
  label,
  copiedLabel,
  className,
}: {
  text: string;
  label: string;
  copiedLabel: string;
  className?: string;
}) {
  const ready = useSyncExternalStore(noChanges, canCopy, notYet);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      className={className}
      hidden={!ready}
      onClick={() => {
        navigator.clipboard.writeText(text).then(
          () => setCopied(true),
          () => setCopied(false),
        );
      }}
    >
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
