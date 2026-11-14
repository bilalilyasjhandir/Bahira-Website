import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { FontWait } from "@/components/FontWait";
import { nastaliq, nastaliqUi } from "@/fonts/nastaliq";
import { onest } from "@/fonts/onest";
import { rtlLocale, rtlStaticParams, type RtlParams } from "@/i18n/route";
import { layoutMetadata, siteViewport } from "@/lib/metadata";
import "@/styles/tokens.css";
import "@/styles/base.css";

// Only /ur/ and /skr/ exist; any other code is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return rtlStaticParams();
}

export async function generateMetadata({ params }: { params: RtlParams }): Promise<Metadata> {
  return layoutMetadata(await rtlLocale(params));
}

export const viewport: Viewport = siteViewport;

/** The root layout of every Urdu and Saraiki page: /ur/…, /skr/… */
export default async function RtlLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: RtlParams;
}) {
  const locale = await rtlLocale(params);
  return (
    // FontWait adds a class to <html> before React starts, so React must not object to it.
    <html
      lang={locale}
      dir="rtl"
      className={`${onest.variable} ${nastaliq.variable} ${nastaliqUi.variable}`}
      suppressHydrationWarning
    >
      <body>
        <FontWait
          families={[
            nastaliq.style.fontFamily,
            nastaliqUi.style.fontFamily,
            onest.style.fontFamily,
          ]}
        />
        {children}
      </body>
    </html>
  );
}
