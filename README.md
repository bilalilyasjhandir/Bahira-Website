# Bahira Foundation website

The website of Bahira Foundation (باہِرہ), a welfare organisation in Bahawalpur, in English, Urdu and Saraiki.

It's built with Next.js 16 as a **static site**: every page, in every language, is a plain HTML file in `out/`. There is no server and no database.

**Status:** Phase 1 (setup) is done. Every page exists in all three languages as a placeholder until the design is approved in Phase 2. The plan is in [docs/website-plan.md](docs/website-plan.md), and what is still needed from Bilal is in [docs/content-checklist.md](docs/content-checklist.md).

## Running it on the laptop

It needs Node.js 24 and pnpm 10. Run `pnpm install` once, and again whenever `package.json` changes.

| Command | What it does |
|---|---|
| `pnpm dev` | Live preview while editing, at http://localhost:3000. English is at `/`, Urdu at `/ur/`, Saraiki at `/skr/`. |
| `pnpm build` | Builds the site into `out/` and runs every check (below). |
| `pnpm preview` | Serves the built site exactly as the host will, at http://127.0.0.1:4000. |
| `pnpm shots` | Screenshots of every page in every language at phone, tablet and desktop widths, into `shots/`. Also checks accessibility. Uses Microsoft Edge. |
| `pnpm lint` | Checks the code. |
| `pnpm format` | Tidies the code's layout. |
| `pnpm build:release` | The build for the live site. Unlike `pnpm build`, it also stops on unfinished work: draft translations and `[[TODO]]` notes. |

**To see the site on a phone:** connect the phone to the same Wi-Fi as the laptop. Run `pnpm dev -H 0.0.0.0` and open `http://<the laptop's IP address>:3000` on the phone.

## Where things are

| What | Where |
|---|---|
| Facts: email, site address, donation accounts, registration, the donations switch | `data/org.yaml` |
| Menu, button and page text, in each language | `src/i18n/en.ts`, `ur.ts`, `skr.ts` |
| Pages | `src/app/(en)/` (English) and `src/app/[lang]/` (Urdu and Saraiki). Each page file is a three-line wrapper around a view in `src/views/`. |
| Header, footer, language links | `src/components/` |
| Colours, text sizes, spacing | `src/styles/tokens.css` (the colours come from the brand kit) |
| Fonts | `src/fonts/` (smaller copies of the brand fonts) |
| Photos | Originals go in `_photos/inbox/`, which is never uploaded. The chosen, cropped ones live in `content/photos/`. |
| Host settings: security headers, caching | `vercel.json` |
| The brand kit (never edited) | `brand/` |
| Build and check scripts | `scripts/` |

## Common changes

- **Open donations:** in `data/org.yaml`, set `donations.open: true` and fill in `wallets`. Then build. Until then the Donate page says donations are opening soon, and no account details appear anywhere.
- **Add the phone number,** once the foundation has its own SIM: set `contact.phone` in `data/org.yaml`. Until then the site shows no phone number, and the check fails if a phone link slips in.
- **Change text:**
  - Edit `src/i18n/*.ts`. The build stops if Urdu or Saraiki is missing a text that English has.
  - When English text changes, raise `revision` in `en.ts`; the check then lists the translations that need another look.
  - Each translation stays `status: "draft"` until Bilal approves it.
- **Add photos:** put the originals in `_photos/inbox/<event>/` with a short note: what, where and when. They are then selected, cropped and stripped of location data into `content/photos/`.

## What the build checks

Before building, `check-content` looks at the source:
- Urdu and Saraiki have every English text, with the same placeholders.
- Urdu and Saraiki use Urdu letters (ی ک ہ), not the look-alike Arabic ones.
- The Saraiki spellings are not mixed.
- Every character can be shown by the site's fonts.
- The CSS never uses left or right, so Urdu and Saraiki pages mirror correctly.
- No photo carries a GPS location.

After building, `check-site` looks at every page in `out/`:
- the right language and direction;
- titles, descriptions and search-engine tags;
- no broken links and no files loaded from other websites;
- English pages never download the Urdu font;
- page weight within budget: 300 KB for English and 550 KB for Urdu and Saraiki on a first visit;
- a complete sitemap.

## Fonts

The site uses smaller copies of the brand fonts, made by `scripts/subset-fonts.py`:

| Font | Size | Notes |
|---|---|---|
| Onest | 37 KB | Latin only |
| Noto Nastaliq Urdu | 107 KB | Urdu and Saraiki only, Regular weight |
| Chooser label font | 21 KB | Holds only اردو and سرائیکی, for English pages |

The copies are committed. Remake them only if a brand font changes (Windows):

```
python -m venv .venv
.venv\Scripts\python -m pip install -r scripts\requirements.txt
.venv\Scripts\python scripts\subset-fonts.py
```

The fonts are licensed under the SIL Open Font License; the licences are in `src/fonts/`.
