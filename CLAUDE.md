# Bahira Foundation website

The public website of **Bahira Foundation** (باہِرہ, "luminous"), a welfare organisation founded on 10 December 2025 (Human Rights Day) in Bahawalpur, South Punjab, Pakistan. Its causes: help for people in need, women's rights, stray animals, tree planting, intersex rights, and youth skills and events. Tagline: "Just doing the human thing."

- **Owner:** Bilal, the founder. Writes casual English, reads Urdu, and reviews every Urdu and Saraiki text. Explain design decisions briefly and plainly, the way a real designer would.
- **Visitors:**
  - donors and volunteers (English, Urdu);
  - people who need help (Urdu, Saraiki);
  - partners.

  Most are on phones with prepaid data, arriving from WhatsApp and Facebook links.
- **Plan:** [docs/website-plan.md](docs/website-plan.md) is the approved plan (1 Nov 2026). Follow it, and update it when a decision changes. What Bilal still has to supply is tracked in [docs/content-checklist.md](docs/content-checklist.md).
- **Status:** planning is done and there is no website code yet. Phase 1 starts only when Bilal says go.

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
- **Donations stay closed** (`donations.open: false` in `data/org.yaml`) until Bilal confirms registration with the Punjab Charity Commission. Since May 2026 the Commission bans collecting donations before registration.
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

Commands: `pnpm dev` · `build` · `preview` · `lint` · `check` · `sync:brand` · `images` · `shots`. They are created in Phase 1; keep this list in step with package.json.

## Next.js rules

- **Server Components by default.** `'use client'` only for the menu, the copy button and the form enhancement.
- **Static export limits:**
  - no proxy/middleware;
  - no headers, redirects or rewrites in next.config (host headers live in `public/_headers`);
  - no built-in image optimiser.
- **Dynamic routes:** every one has `generateStaticParams` and `dynamicParams = false`. `trailingSlash` is `true`.
- **Images:** only through `<Photo>`, using the versions `scripts/build-images.mjs` generates. Originals are never served.
- **Linting:** ESLint runs directly; `next lint` no longer exists in Next 16.

## Structure (planned)

```
src/app/(en)/…          English pages at /… (root layout: <html lang="en" dir="ltr">)
src/app/[lang]/…        Urdu /ur/… and Saraiki /skr/… (root layout: <html lang dir="rtl">)
src/views/              page bodies shared by both layouts; page files are thin wrappers
src/components/  src/i18n/{en,ur,skr}.ts  src/lib/content.ts  src/styles/
content/{pages,causes,updates}/{en,ur,skr}/*.md    content/photos/<topic>/
data/org.yaml           contacts, wallets, socials, registration, donations switch
scripts/                sync-brand, build-images, subset-fonts, check-content, check-site, shots
_photos/inbox/          git-ignored originals from Bilal (may contain GPS data)
```

## Languages

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
  - English is set in Onest.
  - Urdu and Saraiki are set in Noto Nastaliq Urdu, loaded only on ur and skr pages, with Latin runs in Onest.
- **Nastaliq `@font-face`:**
  - `unicode-range`: the Arabic blocks plus U+0020, U+00A0, ZWNJ, ZWJ, LRM and RLM;
  - `size-adjust` about 118% (the final value is chosen on Bilal's phone);
  - line-height about 2.35 for body text and 1.7 for headings;
  - ascent/descent overrides for buttons;
  - `text-underline-offset` about 0.3em.
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
  - Selected crops (3:2, 4:5, 1:1) go in `content/photos/<topic>/`.
  - The build strips metadata, and `check-site` scans `out/` for any GPS data left behind.
- **Consent:**
  - Show identifiable women, children, intersex people and aid recipients only with their consent; otherwise use backs, hands or wide shots.
  - Dignity first, never pity.
- **Captions and alt text:** captions give the place and month. Alt text is written in all three languages.

## Forms

- They post to Web3Forms, with the key kept in `data/org.yaml`.
- **Fields:** name, phone or email, city, interests, message. Never ask for a CNIC number or gender.
- A honeypot field blocks spam, and the form works without JavaScript.

## Voice

Plain, warm and specific, in short sentences and in Bilal's voice. Use numbers only when they are real.

## Done means

- `pnpm build` (including `check-content` and `check-site`) and `pnpm lint` pass.
- `pnpm shots` screenshots of the changed pages, in en and ur at 360 and 1280px, have been looked at before reporting.
- axe reports no serious or critical issues.
- Budgets are met (Lighthouse mobile, slow 4G):
  - **Data:** first view ≤ 300 KB in English and ≤ 550 KB in Urdu or Saraiki; repeat visit ≤ 60 KB.
  - **Code and images:** our own browser JavaScript ≤ 10 KB; hero image ≤ 70 KB AVIF.
  - **Speed:** LCP < 2.5s, CLS ≤ 0.05, no third-party requests.
