// Noto Nastaliq Urdu Regular, only what Urdu and Saraiki text uses (107 KB), made from the
// brand font by scripts/subset-fonts.py. Only the Urdu/Saraiki layout imports this file, so
// English pages never download it. (The 404 page has its own copy of this @font-face in
// src/styles/nastaliq-404.css, for the reason given there.)
//
// On Urdu and Saraiki pages Nastaliq comes first in the font list. Its unicode-range leaves
// out Latin letters and digits, so those fall through to Onest.
//
// The unicode-range is copied from src/fonts/coverage.json; check-content stops the build if
// they differ. Next.js needs font options written out literally, so it cannot be imported.

import localFont from "next/font/local";

export const nastaliq = localFont({
  src: "./nastaliq.woff2",
  // Regular only: the weight range would make the file 170 KB. Urdu and Saraiki headings
  // stand out by size and colour instead of bold.
  weight: "400",
  style: "normal",
  // Text waits for Nastaliq (at most 3 seconds) instead of showing a stand-in font first.
  // Measured on slow 4G (Phase-1 spike): "swap" made Urdu pages jump (CLS 0.22) when
  // Nastaliq replaced the stand-in; "block" kept them still (CLS 0.00–0.05) and showed the
  // text by about 2.4 s; "optional" never showed Nastaliq on a first visit.
  display: "block",
  variable: "--font-nastaliq",
  // Next.js would build a size-matched stand-in from Arial, whose Latin measurements say
  // nothing useful about Nastaliq. With display "block" none is needed.
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0020, U+00A0, U+060C, U+060E-0614, U+061B, U+061F, U+0621-0658, U+0660-066D, U+0670, U+0679, U+067B, U+067E, U+0684, U+0686, U+0688, U+068B, U+0691, U+0698, U+06A9, U+06AF, U+06B3, U+06BA-06BB, U+06BE, U+06C1-06C3, U+06CC, U+06D2-06D4, U+06F0-06F9, U+0759, U+0768, U+200C-200F, U+2018-2019, U+201C-201D, U+2026, U+25CC, U+FDF2, U+FDFA, U+FDFD",
    },
    // Nastaliq letters are small for their size. 118% matches them to Onest; the final
    // value (110, 118 or 126%) is chosen on Bilal's phone in Phase 2.
    { prop: "size-adjust", value: "118%" },
  ],
});

// The same font file for one-line labels: buttons, menus, the language bar, small labels.
// Noto Nastaliq Urdu keeps a very tall space above its letters (1.9 em) and a short one
// below (0.6 em), so in a button the letters sat well below the middle (24 px above them,
// 11 px below). These metrics, measured in Phase 2, centre them (about 11 px and 13 px) and
// keep Urdu buttons as tall as English ones. Paragraphs keep the font's own metrics, which
// they need for their tall line spacing.
export const nastaliqUi = localFont({
  src: "./nastaliq.woff2",
  weight: "400",
  style: "normal",
  display: "block",
  variable: "--font-nastaliq-ui",
  adjustFontFallback: false,
  // Preloaded like the face above, so both name the same file and it downloads only once
  // (Next.js names preloaded and other font files differently).
  preload: true,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0020, U+00A0, U+060C, U+060E-0614, U+061B, U+061F, U+0621-0658, U+0660-066D, U+0670, U+0679, U+067B, U+067E, U+0684, U+0686, U+0688, U+068B, U+0691, U+0698, U+06A9, U+06AF, U+06B3, U+06BA-06BB, U+06BE, U+06C1-06C3, U+06CC, U+06D2-06D4, U+06F0-06F9, U+0759, U+0768, U+200C-200F, U+2018-2019, U+201C-201D, U+2026, U+25CC, U+FDF2, U+FDFA, U+FDFD",
    },
    { prop: "size-adjust", value: "118%" },
    { prop: "ascent-override", value: "115%" },
    { prop: "descent-override", value: "65%" },
    { prop: "line-gap-override", value: "0%" },
  ],
});
