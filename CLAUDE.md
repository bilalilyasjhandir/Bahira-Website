# Bahira Foundation website

The public website of **Bahira Foundation** (باہِرہ, "luminous"), a welfare organisation founded on 10 December 2025 (Human Rights Day) in Bahawalpur, South Punjab, Pakistan. Its causes: help for people in need, women's rights, stray animals, tree planting, intersex rights, and youth skills and events. Tagline: "Just doing the human thing."

- **Owner:** Bilal, the founder. Writes casual English, reads Urdu, and reviews every Urdu and Saraiki text. Explain design decisions briefly and plainly, the way a real designer would.
- **Visitors:**
  - donors and volunteers (English, Urdu);
  - people who need help (Urdu, Saraiki);
  - partners.

  Most are on phones with prepaid data, arriving from WhatsApp and Facebook links.
- **Plan:** [docs/website-plan.md](docs/website-plan.md) is the approved plan (1 Nov 2026, revised 14 Nov 2026). Follow it, and update it when a decision changes. What Bilal still has to supply is tracked in [docs/content-checklist.md](docs/content-checklist.md).
- **Status:** Phases 1 (setup and guardrails) and 2 (the Home page design) are done. Bilal approved the Home page in all three languages, and Nastaliq at 118%, on 14 Nov 2026. Every other page is still a placeholder. Phase 3 (the other pages, the forms, the cause template) starts when Bilal says go.
- **Pace:** there are no dates or deadlines. Bilal sets the pace, so never tie a phase to a calendar date.
- **Copy:** I write all the text (introduction, mission, values, roles, policies) and Bilal approves it. Ask Bilal only for facts I can't know.

## Non-negotiables

- **Everything stays local.**
  - Never publish to claude.ai (artifacts, Claude Docs), Google Drive or any other cloud service.
  - Commit, push or deploy only when Bilal asks.
- **The logo is final.**
  - Never redraw, recolour, stretch, crop, mirror or retype it, and never edit anything in `brand/`.
  - Use the copies that `scripts/sync-brand.mjs` makes.
  - Follow the clear space and minimum sizes in `brand/README.md`.
- **Preview before building out.** For any new look, show one preview (screenshots plus a short rationale). Get approval before making variants, more pages or asset sets.
- **Never invent facts.**
  - Never invent numbers, people, partners, quotes or testimonials, and never claim registration, Zakat eligibility or tax status that isn't confirmed.
  - Write `[[TODO: …]]` instead. The production build fails while any remain.
- **Bilal controls the donations switch.**
  - `donations.open` in `data/org.yaml` stays `false` until Bilal says to open it. It is not tied to registration.
  - Bahira is not registered yet, so never write or imply that it is.
- **No phone number on the site** until the foundation has its own SIM. People write through the forms and Bilal calls back.
- **The wallet is personal.** The JazzCash/Easypaisa account is in Bilal's name, so show it with the holder's name and role until a foundation account exists.
- **Things Bilal dislikes:**
  - blue + gold/yellow (it reads as the Sabroso chicken brand);
  - egg/yolk shapes;
  - Vodafone-like teardrops;
  - anything that looks AI-generated.
- **Mainstream tech only.**
  - Bilal wants a stack any developer recognises.
  - Ask before adding a dependency, and pin exact versions.

## Stack and commands

- **Framework:** Next.js 16 (App Router), React 19, TypeScript strict.
- **Static export:** `output: 'export'` writes the site to `out/`. No backend, no database.
- **Package manager:** pnpm.
- **Styling:** plain CSS (design tokens plus CSS Modules). No Tailwind or shadcn.

Commands (keep this list in step with package.json):

- `pnpm dev`: live preview while editing (copies the brand files and makes the images first).
- `pnpm build`: sync-brand, build-images, check-content, `next build`, check-site. Unfinished work (drafts, `[[TODO]]`) only warns.
- `pnpm build:release`: the same for the live site; unfinished work stops it.
- `pnpm preview`: serves `out/` with the headers in `vercel.json`, at http://127.0.0.1:4000.
- `pnpm shots`: screenshots of every page in every language in `shots/`, plus axe, console errors and CSP. It uses the installed Edge. Options: `--pages=home,about` (page names from `src/lib/pages.ts`), `--locales=en,ur`, `--widths=360,1280`, `--no-axe`.
- `pnpm photos`: makes the crops listed in `content/photos/crops.yaml` from the originals in `_photos/inbox/`, without metadata.
- `pnpm lint` · `pnpm format` (Prettier) · `pnpm check` (both checks on the last build) · `pnpm sync:brand` · `pnpm images`.
- Fonts, only when a brand font changes: `.venv/Scripts/python scripts/subset-fonts.py` (set up with `scripts/requirements.txt`). The output in `src/fonts/` is committed, so the build never needs Python.

## Next.js rules

- **Server Components by default.** `'use client'` only for the menu, the copy button and the form enhancement. The only other script of ours is FontWait's inline script on Urdu and Saraiki pages.
- **Static export limits:**
  - no proxy/middleware;
  - no headers, redirects or rewrites in next.config (host headers live in `vercel.json`; the host is Vercel's free plan);
  - no built-in image optimiser.
- **Dynamic routes:** every one has `generateStaticParams` and `dynamicParams = false`. `trailingSlash` is `true`.
- **Images:** only through `<Photo>`, using the versions `scripts/build-images.mjs` generates. Originals are never served.
- **Links between pages are plain `<a>`, not `next/link`:** every page is a normal page load, so phones never prefetch other pages on prepaid data.
- **Linting:** ESLint runs directly; `next lint` no longer exists in Next 16.
- **Read the version-matched docs** in `node_modules/next/dist/docs/` before using a Next.js API. Next 16.4 is newer than my training, and `next dev` would write an AGENTS.md saying so; `agentRules: false` turns that off in favour of this file.

Lessons from the Phase-1 spike (don't undo these):

- **Font preloading leaks easily.** Next.js preloads every font whose rules sit in a page's CSS, and every `next/font` font that a route's modules import.
  - One font per file in `src/fonts/`. Only `src/app/[lang]/layout.tsx` imports `@/fonts/nastaliq`.
  - `src/app/global-not-found.tsx` is bundled with every route, so it must never use `next/font`. It loads Nastaliq through `src/styles/nastaliq-404.css` instead.
  - `experimental.cssChunking: { type: "graph", requestCost: 1 }` must stay. The default merging put the Nastaliq rules into CSS that English pages load. `check-site` fails if an English page ever preloads Nastaliq again.
  - Phase 2 changed `requestCost` from 0 to 1. At 0 nothing merged, and the Home page loaded 13 tiny render-blocking stylesheets. At 1, stylesheets that always load together merge (4 files), but no page gets CSS it doesn't import. All 124 screenshots were pixel-identical after the change.
- **The Node scripts import some TypeScript files directly** (Node strips the types): `src/i18n/config.ts`, `en.ts`, `ur.ts`, `skr.ts`, `src/lib/pages.ts`, `src/lib/org.ts`.
  - Keep them free of `@/` imports and of value imports from other `src/` files. Type-only imports are fine.
- **Windows:**
  - Never leave a shell inside `out/` during a build; the build cannot replace it (EBUSY).
  - Git Bash rewrites arguments that start with `/`, so `pnpm shots` takes page names.
- **Our own JavaScript is measured as what a page loads beyond the 404 page**, which has no client components and so loads only the framework (about 159 KB compressed). Keep the 404 page free of client components.

Lessons from Phase 2 (don't undo these):

- **Buttons, menus and labels use `--font-ui` and `--leading-ui`.**
  - On Urdu and Saraiki pages `--font-ui` is `nastaliqUi`: the same Nastaliq file with ascent 115%, descent 65% and no line gap, at line height 1.6, so short labels sit centred.
  - `nastaliqUi` must keep `preload: true`. With `false`, next/font gives the file a different name, and phones download Nastaliq twice. `check-site` fails if any page loads the same font twice.
  - `check-content` keeps these metrics equal to those in `labels-font.css`.
- **Budgets count images as a phone loads them.** `check-site` models Lighthouse's test phone (412 px wide, 1.75 pixel density): an eager photo counts as the AVIF that phone picks, and lazy photos do not count. AVIF is quality 42 with 4:2:0 colour, which looks the same as 50 and keeps the English Home under 300 KB.
- **Line breaks:**
  - Dates join their parts with no-break spaces (`src/i18n/format.ts`), so "10 December 2025" never splits.
  - `p, li, dd, figcaption` use `text-wrap: pretty`, so Urdu sentences don't end with ہے۔ alone on a line.
  - A word set in another font or at a larger size inside a sentence (the Arabic باهرة) needs `line-height: 1`; otherwise its line spreads 4–8 px wider than the others.
  - In a date-and-place line, the date, the venue and the city each stay whole (`.unit` in `RecentWork.module.css`: an inline-block no wider than its line), so a name never breaks in the middle. Reuse it for the updates list in Phase 3.
- **Full-page screenshots** scroll through the page first, because lazy photos load only near the screen.
  - The browser sometimes cancels an image request itself during that scroll (`net::ERR_ABORTED`) and loads the image again. `shots` ignores that one case, because it checks separately that every image loaded. Any other failed request still fails the run.
- **No layout shift while Nastaliq downloads.** The stand-in font is narrower, so text rewraps when Nastaliq arrives, and the Urdu Home measured CLS 0.093 against a 0.05 budget. Two fixes, both needed:
  - Nothing in the header or top bar may take its height from the font. Links and the menu summary are `display: flex`, never `inline-flex`: an inline box sits on a line of the page font, and Nastaliq's taller line made the menu button 7 px taller.
  - `src/components/FontWait.tsx`, first in `<body>` of the `[lang]` layout, sets `font-wait` on `<html>`, which hides `main` and `footer` until the fonts load (3 s at most). Hence `suppressHydrationWarning` on that `<html>`. It is our only inline script. Without JavaScript the page shows as usual.
  - Result: CLS 0.000 in every language. Measure it with a throttled phone (slow 4G, CPU 4× slower), compressed responses and the host's cache headers. The preview server sends neither, so a run without them can hide or invent problems.

## Structure

```
src/app/(en)/…            English pages at /… (root layout: <html lang="en" dir="ltr">)
src/app/[lang]/…          Urdu /ur/… and Saraiki /skr/… (root layout: <html lang dir="rtl">)
src/app/global-not-found.tsx   the one 404 page, in all three languages
src/app/sitemap.ts  robots.ts
src/views/                page bodies; page files are three-line wrappers
src/views/home/           the Home sections: Hero, Facts, Causes, Story, RecentWork, Support
src/components/           Shell, TopBar, LanguageLinks, Header, MenuDisclosure (client), Footer,
                          Photo, ArrowLink, Email (<bdi> + a break before @), Template (text with elements),
                          FontWait (Urdu/Saraiki: the body waits for the fonts)
src/i18n/                 config.ts, en.ts ur.ts skr.ts, get-dictionary.ts, paths.ts, format.ts, route.ts
src/lib/                  org.ts (reads data/org.yaml), pages.ts (every page), metadata.ts, updates.ts,
                          content.ts (Markdown front matter), photos.ts (reads the image manifest)
src/generated/photos.json the image manifest, written by build-images (not committed)
src/fonts/                onest.ts, nastaliq.ts, the subset .woff2 files, coverage.json, licences
src/styles/               tokens.css, base.css, labels-font.css, nastaliq-404.css
content/updates/{en,ur,skr}/*.md   facts and English text in en/, translations in ur/ and skr/
content/{pages,causes}/…  long text, from Phase 3
content/photos/<topic>/   the crops; crops.yaml says which original and how each is cut
data/org.yaml             site address, contacts, wallets, socials, registration, donations switch
public/                   copies from brand/ and generated images (not committed)
scripts/                  sync-brand, crop-photos, build-images, subset-fonts.py, check-content,
                          check-site, shots, preview, lib/ (gps, html, static-server)
_photos/inbox/            git-ignored originals from Bilal (may contain GPS data)
```

## Languages

- **Side by side:** English, Urdu and Saraiki are equal. Build every page, preview and template in all three at the same time, never English first.
- **URLs:** English at `/…`, Urdu at `/ur/…`, Saraiki at `/skr/…` (ISO 639-3 `skr`). Slugs are English in every language.
- **`hreflang`:** en, ur and `x-default` (pointing to en). Never `skr`, because Google accepts only two-letter codes.
- **Where text lives:**
  - UI strings go in `src/i18n/*.ts`, with ur and skr typed against en's keys.
  - Long text goes in Markdown.
  - Facts are stored once in `data/org.yaml` and never retyped inside translations.
- **Versions and review:**
  - English entries carry `revision`; translations carry `sourceRevision` and `status: draft | reviewed`.
  - Core pages must exist, reviewed, in all three languages.
  - Updates may be in one language only. The other languages list them, labelled with the original language.
  - I draft Urdu and Saraiki; only Bilal marks them `reviewed`.
- **Spelling:**
  - Spell the name باہِرہ, with the zer.
  - Use the Urdu letters ی ک ہ, never the Arabic ي ك ه ى ة, except inside `lang="ar"` (such as the Arabic باهرة).
  - Use one variant of each Saraiki letter consistently (ݙ or ڋ, ݨ or ڻ, as agreed with Bilal).
- **Saraiki dates:** use Urdu month names. `Intl` has no Saraiki data and silently falls back to US English.
- **Inside right-to-left text:** phone numbers, emails and URLs go in `<bdi dir="ltr">`. Digits are Western 0–9.

## Typography and RTL

- **Fonts:**
  - English is set in Onest: a 37 KB Latin subset, weights 100–900.
  - Urdu and Saraiki are set in Noto Nastaliq Urdu, loaded only on ur and skr pages, with Latin runs in Onest.
  - On English pages, the chooser's اردو and سرائیکی use a 21 KB label font (`src/styles/labels-font.css`) or the phone's own Nastaliq.
- **Nastaliq** (measured in the Phase-1 spike):
  - **File:** 107 KB, Regular only, holding just the letters, marks, digits and punctuation Urdu and Saraiki use. The weight range would make it 170 KB, so there is no bold Nastaliq: Urdu and Saraiki headings stand out by size and colour (`--weight-heading: 400`).
  - **`font-display: block`:** on slow 4G, "swap" made pages jump (CLS 0.22). "block" kept them still (0.00–0.05) and showed the text by about 2.4 s.
  - **`unicode-range`:** exactly the subset's characters, from `src/fonts/coverage.json`; Latin letters and digits fall through to Onest. `check-content` compares the ranges in `nastaliq.ts`, `nastaliq-404.css` and `labels-font.css` with that file.
  - **`size-adjust`:** 118% in all three places, kept equal by `check-content`. Bilal approved 118% in Phase 2, after a comparison with 110 and 126%.
  - **Spacing and links:** line-height 2.35 for body text and 2 for headings (unitless, in `tokens.css`); `text-underline-offset` 0.3em.
  - **Labels and buttons:** `--font-ui` (see the Phase-2 lessons). Urdu buttons are 50 px tall, English 48.
- **Never in Urdu or Saraiki:** letter-spacing, capitals, italics (`font-synthesis: none`) or justified text. Labels use weight or colour instead.
- **Direction:**
  - Use CSS logical properties only, never left or right.
  - `:dir(rtl)` flips arrows only, never the logo or photos.

## Design system

- **Colours:** tokens in `src/styles/tokens.css`, taken from `brand/colours/bahira-colours.css`.
  - Bahira Blue `#084F97`: headings, links and primary buttons.
  - Deep Blue `#00316B`: the footer and one dark band per page.
  - Ink `#132030`: text.
  - Sky `#E8F1FC`: tinted panels.
  - Paper `#F6F5F3`: the page background.
  - Red and green: form states only.
- **Type** (brand deck, slide 10):
  - H1 Onest Bold 48/56, H2 32/40, body 18/28;
  - labels 14px capitals with 0.14em spacing;
  - one display size for the hero.

  Sizes scale down smoothly on phones. Text is start-aligned, 60–72 characters per line.
- **Layout:**
  - 12-column grid, 1200px at most;
  - 16px mobile gutter, spacing in steps of 8px;
  - hairlines and tints, not shadows.
- **Logo files:**
  - header: `bahira-horizontal-blue.svg` in every language, at the start edge;
  - footer: `bahira-primary-white.svg` on English pages, `bahira-urdu-english-white.svg` on Urdu and Saraiki pages.
- **Never use (the AI tells):**
  - visual: gradients or gradient text, glassmorphism, blurred blobs, sparkles, emoji as icons;
  - layout: everything centred, rows of three identical icon cards, huge corner radii, pills everywhere, the default shadcn/Tailwind look;
  - content: filler copy ("empowering communities"), fake stats or testimonials, stock or AI images.

## Photos

- **Source:** only real Bahira photos.
- **Processing:**
  - Selected crops (3:2, 4:5, 1:1) are listed in `content/photos/crops.yaml` and made by `pnpm photos` into `content/photos/<topic>/`. GPS and other metadata are removed at the crop, because that folder goes to GitHub.
  - Never publish another organisation's banner or account numbers. Most of the orphanage photos (16 Dec 2025) show one, so crop it out or use a different photo.
  - The build strips metadata again. `check-content` scans `content/photos/` and `check-site` scans `out/` for any GPS data left behind.
  - Each update also gets a 1200×630 JPEG share image, made by the build.
- **Which photos:**
  - Bilal shares only photos that are fine to publish, so there is no consent tracking.
  - Dignity first, never pity.
- **Captions and alt text:** captions give the place and month. Alt text is written in all three languages.

## Forms

- There are three: volunteer, contact and help. They post to Web3Forms, with the key kept in `data/org.yaml`.
- **Fields:** name, phone or email, city, interests, message. The help form asks for a phone number so Bilal can call back. Never ask for a CNIC number or gender.
- A honeypot field blocks spam, and the form works without JavaScript.
- After sending, the visitor lands on `/thanks/` in their own language.

## Voice

Plain, warm and specific, in short sentences and in Bilal's voice. Use numbers only when they are real.

## Done means

- `pnpm build` (including `check-content` and `check-site`) and `pnpm lint` pass.
- `pnpm shots` screenshots of the changed pages, in en, ur and skr at 360 and 1280px, have been looked at before reporting.
- axe reports no serious or critical issues.
- Budgets are met (`check-site` fails the build on the data, code and image budgets; Lighthouse mobile on slow 4G measures speed):
  - **Data:** first view ≤ 300 KB in English and ≤ 550 KB in Urdu or Saraiki; repeat visit ≤ 60 KB.
  - **Code and images:** our own browser JavaScript ≤ 10 KB; hero image ≤ 70 KB AVIF.
  - **Speed:** LCP < 2.5s, CLS ≤ 0.05, no third-party requests.
