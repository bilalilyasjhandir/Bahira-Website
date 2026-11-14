// Onest, Latin only, made from the brand font by scripts/subset-fonts.py.
//
// One font per file: Next.js preloads every font defined in a file that a layout imports,
// so keeping Nastaliq in its own file (nastaliq.ts) keeps it off English pages.
//
// The unicode-range is copied from src/fonts/coverage.json; check-content stops the build if
// they differ. Next.js needs font options written out literally, so it cannot be imported.

import localFont from "next/font/local";

export const onest = localFont({
  src: "./onest-latin.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-onest",
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+000D, U+0020-007E, U+00A0-00A3, U+00A5, U+00A7-00AB, U+00AE-00B4, U+00B6-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2009, U+2013-2014, U+2018-201A, U+201C-201E, U+2022, U+2026, U+202F-2030, U+2039-203A, U+2044, U+20AC, U+2122, U+2190-2193, U+2212",
    },
  ],
});
