# Bahira Foundation: brand package

Start with **Bahira-Brand-Guidelines.html**. It opens in any browser and works offline; move between slides with the ← → keys. **Bahira-Brand-Guidelines.pdf** is the same presentation as a PDF, for sharing or printing.

## The logo

This is the original Bahira logo, redrawn as vector artwork so that it stays sharp at any size. The design has not changed. Every edge was measured on the original 659 × 659 px picture and rebuilt as clean lines and curves. The letters of BAHIRA were redrawn one by one, because they are not a font you can type.

When the new artwork is drawn at the size of the original picture, not one of its 434,281 pixels differs by more than half a shade.

### Which file should I use?

| You need the logo for… | Use |
|---|---|
| A website or any screen design | `logo/svg/bahira-primary-blue.svg` |
| Word, PowerPoint, Canva, WhatsApp | `logo/png/bahira-primary-blue-1200.png` |
| A printer (banner, visiting card, letterhead, shirt) | `logo/print/bahira-primary-blue-cmyk.pdf`, or the `.eps` for CorelDRAW |
| A blue or dark background | the `white` files |
| One-colour printing (stamps, photocopies, newspaper) | the `black` files |
| The website header | `logo/svg/bahira-horizontal-blue.svg` |
| Material entirely in Urdu | the `urdu` files, e.g. `logo/png/bahira-urdu-blue-600.png` |
| Material in Urdu and English (signboards, banners, certificates) | the `urdu-english` files, e.g. `logo/png/bahira-urdu-english-blue-1200.png` |
| A profile picture | `social/profile-symbol-white-on-blue-1080.png` |
| A ready-made image with a background | `logo/on-background/` |

**Versions.** Six versions are supplied, each in blue, white and black:

- `primary`: the original stacked logo
- `horizontal`: symbol and name side by side
- `symbol`: the symbol alone
- `wordmark`: the name alone
- `urdu`: the symbol above the name in Urdu, باہِرہ
- `urdu-english`: the original logo with the Urdu name under BAHIRA

PNG file names end in their width in pixels. For example, `bahira-symbol-blue-512.png` is 512 px wide. PNGs have transparent backgrounds.

**The Urdu name.** It is written باہِرہ, with a zer so it is read Baa-hi-ra. The lettering is Noto Nastaliq Urdu Bold, in the Nastaliq style Urdu readers know from books and newspapers. It is sized to look the same size as BAHIRA: the font is designed to sit beside capital letters of a set height, and that height is matched to BAHIRA's letters. Like BAHIRA, it is part of the artwork, so always use the files and never retype it.

**Clear space.** Leave empty space around the logo at least as tall as the letters of BAHIRA. For the Urdu version, use a fifth of the height of the symbol, which is about the same.

**Smallest sizes:**

| Version | On screen | In print |
|---|---|---|
| Primary | 80 px wide | 25 mm wide |
| Horizontal | 120 px wide | 35 mm wide |
| Symbol | 16 px tall | 6 mm tall |
| Urdu | 50 px wide | 15 mm wide |
| Urdu + English | 80 px wide | 25 mm wide |

**Please don't:**

- stretch, rotate or recolour the logo
- add shadows or other effects
- rearrange its parts
- retype BAHIRA or باہِرہ in another font
- use the old low-resolution picture

## Colours

| Name | HEX | RGB | CMYK | Use |
|---|---|---|---|---|
| Bahira Blue | `#084F97` | 8 79 151 | 97 64 3 12 | logo, headings, buttons, links |
| Deep Blue | `#00316B` | 0 49 107 | 99 83 13 44 | hover states, dark sections |
| Ink | `#132030` | 19 32 48 | print text in 100% K | body text |
| Sky | `#E8F1FC` | 232 241 252 | 13 2 2 0 | tinted panels |
| Paper | `#F6F5F3` | 246 245 243 | 3 3 5 0 | page background (the warm white of the original artwork) |
| White | `#FFFFFF` | 255 255 255 | 0 0 0 0 | cards, the reversed logo |

Bahira Blue is taken directly from the original logo. The closest Pantone is **2945 C**; check it against a printed Pantone guide.

The CMYK values were converted for coated paper (SWOP). Treat them as a starting point and always ask the printer for a proof.

## Fonts

| Font | Use |
|---|---|
| **Onest** | headings and text. It is the closest free typeface to the logo's lettering. |
| **Noto Nastaliq Urdu** | Urdu text. Its Bold weight is the lettering of the Urdu name in the logo. |

Both fonts are free for any use under the SIL Open Font License; the licence is in each font folder. To install a font on Windows, right-click the `.ttf` file and choose **Install**. The `.woff2` files are for the website.

## For the website

- `icons/`: favicon, app icons and `site.webmanifest`. Copy the lines from `head-snippet.html` into the page `<head>`.
- `colours/bahira-colours.css`: the palette as CSS variables.
- `fonts/*/…woff2`: web fonts.
- `social/link-preview-1200x630.png`: the image shown when the site is shared on WhatsApp or Facebook.
