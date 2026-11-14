"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The menu on phones. It is a native <details> element, so it opens and closes before any
 * JavaScript has loaded, which matters on slow connections. Once the script runs it adds
 * two small things: Escape closes the menu, and so does a tap outside it.
 */
export function MenuDisclosure({
  label,
  className,
  panelClassName,
  children,
}: {
  label: string;
  className?: string;
  panelClassName?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const details = ref.current;
    if (!details) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && details?.open) {
        details.open = false;
        details.querySelector("summary")?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (details?.open && event.target instanceof Node && !details.contains(event.target)) {
        details.open = false;
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <details ref={ref} className={className}>
      <summary>
        <span aria-hidden="true" data-menu-icon="" />
        {label}
      </summary>
      <div className={panelClassName}>{children}</div>
    </details>
  );
}
