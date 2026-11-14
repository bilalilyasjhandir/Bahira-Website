import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { onest } from "@/fonts/onest";
import { layoutMetadata, siteViewport } from "@/lib/metadata";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/labels-font.css";

export const metadata: Metadata = layoutMetadata("en");
export const viewport: Viewport = siteViewport;

/** The root layout of every English page: /, /about/, … */
export default function EnglishLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={onest.variable}>
      <body>{children}</body>
    </html>
  );
}
