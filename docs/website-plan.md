# Plan: Bahira Foundation website

**Status:** approved by Bilal on 1 November 2026. Phase 1 starts when Bilal says go.

## Context

The logo and brand kit are final and committed in `brand/`: logo SVG/PNG/print files, colours, Onest and Noto Nastaliq Urdu web fonts, favicons, social images and the 15-slide guidelines deck. The repo has no website code yet.

Bilal wants the foundation's public website:
- in **English, Urdu and Saraiki**, with a language chooser in the header;
- clearly a **welfare organisation** at first sight;
- built around the **logo's blue**;
- never "cheap vibe-coded";
- on a **mainstream stack that any developer understands**.

Which pages it has, and what goes on them, is left to me. **This step is the plan only. No website code until Bilal says go.**

**Decided with Bilal while planning**
- **Stack:** **Next.js (React + TypeScript), exported as a static site**: no backend and no database for now.
- **Photos:** there are plenty of real ones, so the design leads with photos.
- **Forms:** they send email through a form service (Web3Forms).
- **Translation:** I draft all three languages; Bilal reviews the Urdu and Saraiki.
- **Donations:** JazzCash / Easypaisa, in a **personal account**. It is shown with the holder's name and role, e.g. "Bilal, Founder", until there is a foundation account.
- **Registration:** with the Punjab Charity Commission, **applied / not yet**. Since May 2026 the Commission bans collecting donations before registration (Punjab Charities Act 2018, reported by ProPakistani on 13 May 2026). So the Donate page is built but **stays closed behind one switch** until Bahira is registered.

**Verified**
- **Fonts:** Noto Nastaliq Urdu (in `brand/fonts`) has every Saraiki letter (ٻ ڄ ݙ ڳ ݨ, plus ڋ ڻ). HarfBuzz shapes them correctly in their initial, medial and final forms. Onest has no Arabic-script letters, so each script gets its own font.
- **Brand deck:** the header mock-up (slide "In use") reads About · Our work · Get involved · **Donate**. The type scale (slide 10) is H1 Onest Bold 48/56, H2 32/40, body 18/28, labels 14 px capitals with 0.14 em spacing.
- **Tools:** current versions are `next` 16.4.3 and `react` 19.3.1. Node 24, pnpm 10, Python 3.12 and git are installed, and a GitHub remote exists.

---

## 1. Approach and stack

**Next.js 16 (App Router, React 19, TypeScript strict), built with `output: 'export'`.** At build time every page in every language becomes a plain HTML file in `out/`.

- **A stack developers know:** React is the most used frontend library and Next.js its most used framework. Any React developer in Pakistan can pick this project up.
- **No server, no database:** hosting is free and there is nothing to hack or patch on a server. Visitors' details never sit in an online database; forms go straight to email. The site also previews on the laptop.
- **Room to grow without a rewrite:** if Bahira later needs logins, a staff admin screen, card donations or event sign-ups, the same codebase can switch to server hosting and add API routes, authentication and Supabase.
- **The honest trade-off:** every page loads React's runtime (about 100 KB of JavaScript, cached after the first visit). To keep pages fast on mobile data:
  - Server Components are the default, and only three tiny pieces run in the browser (menu, copy button, form);
  - the budgets in section 5 are set accordingly.
- **Styling:** plain CSS (global design tokens + CSS Modules, both built into Next.js), not Tailwind/shadcn. Those defaults are the look most "vibe-coded" sites share, and the RTL and Nastaliq rules stay clearer in plain CSS.
- **Built in phases:** there is an approval gate after a single design preview, following the "preview before package" rule.

(Astro, the lighter alternative, was set aside because far fewer developers know it.)

## 2. Pages and navigation (every page in en / ur / skr)

| Page | URL | Purpose and main sections |
|---|---|---|
| Home | `/` | **First screen:** a real photo saying who Bahira is, what it does and where, with two actions: Volunteer, and Donate (or "Donations opening soon").<br>**Below:**<ul><li>the six causes, each with a real example and photo</li><li>"Founded on Human Rights Day, 10 Dec 2025" and what باہِرہ means</li><li>the 3 latest dated updates</li><li>a trust strip: founded date, Bahawalpur, registration status, contact</li></ul> |
| About | `/about/` | <ul><li>Bilal's introduction in Bilal's own words (light copy-edit only with approval)</li><li>the name ("luminous") and the symbol (B, flame, diya)</li><li>why Human Rights Day</li><li>mission, vision, values</li><li>Bahawalpur → South Punjab</li><li>founder and team, with photos and consent</li></ul> |
| Our work | `/work/` + `/work/<cause>/` ×6 | **Overview plus one template for every cause:** why it matters here, what we do, what we've done (dated, with photos and related updates), how to help.<br>**Provisional slugs:** `people-in-need`, `womens-rights`, `stray-animals`, `trees`, `intersex-rights`, `youth`.<br>A cause without enough real content stays a section on `/work/` until it has some. |
| Updates | `/updates/`, `/updates/<slug>/` | The proof of work: what, where, when and photos. Upcoming events are pinned. |
| Get involved | `/get-involved/` | Volunteer roles and process, the **volunteer form**, youth skills and events, partners (schools, businesses, NGOs), spreading the word. |
| Donate | `/donate/` | **Closed (now):** "Donations opening soon" and ways to help today.<br>**Open (one switch, once registered):**<ul><li>JazzCash / Easypaisa cards: account title, holder's name and role, number, copy button</li><li>a **Zakat policy:** Zakat only for eligible people, kept separate, wording checked by a scholar</li><li>how to get a receipt</li><li>honest tax status, with no claim that donations are tax-deductible</li><li>"Bahira only uses the accounts on this page"</li><li>FAQ, including giving from abroad</li></ul> |
| Need help? | `/help/` | **For people who need help:** who we can help, how to ask, what happens next.<br>**Also:** official helplines (Rescue 1122, Police 15, Punjab Women Helpline 1043, each verified before publishing).<br>Written in Urdu and Saraiki first. |
| Accountability | `/accountability/` | Registration status, who runs Bahira, how money is handled, policies (photo consent, safeguarding, complaints), and the first annual report after December 2026. |
| Contact | `/contact/` | Email, phone / WhatsApp, area, socials, the **contact form**, and a map *link* (not an embedded map). |
| Privacy | `/privacy/` | What the forms collect and where it goes. No cookies or trackers, enforced by the site's Content Security Policy. |
| 404 | — | One page, written in all three languages. |

- **Top bar** (slim, on every screen): `Need help? · Contact · English · اردو · سرائیکی`. Each language name is in its own script, so an Urdu-only reader finds it without knowing English. On phones, Contact moves into the menu.
- **Header** (as in the brand deck): logo · About · Our work · Updates (once there are 3+ posts) · Get involved · **Donate** button. The header uses `bahira-horizontal-blue.svg` in all three languages. It sits at the start edge and is never mirrored.
- **Footer:** Deep Blue, with the mission line, all links (including Accountability and Privacy), contact and socials. Urdu and Saraiki pages use `bahira-urdu-english-white.svg` there.
- **Left out on purpose:**
  - a gallery page (photos live in updates and on cause pages);
  - impact counters, testimonials, partner-logo walls;
  - sliders, autoplay video, embedded maps or social feeds;
  - a newsletter, popups, a chat widget, search, dark mode, a cookie banner;
  - stock or AI images.

## 3. Design direction: "light, given form"

The logo is a diya inside a B. The site should feel **calm, warm and luminous**, and read like a serious humanitarian organisation (editorial, documentary), not a template.

- **Type:** the brand deck's scale (H1 48/56, H2 32/40, body 18/28, labels 14 px capitals), plus one display size for the hero.
  - On phones the sizes scale smoothly (H1 32→48, body 17→18).
  - Text is left-aligned, with lines of 60–72 characters.
- **Colour:**
  - Paper `#F6F5F3` background and Ink `#132030` text.
  - Bahira Blue `#084F97` for headings, links and primary buttons. Its contrast is 7.5:1 on Paper, and white text on it is 8.2:1: both WCAG AAA.
  - Deep Blue `#00316B` for the footer and one dark band per page; Sky `#E8F1FC` for tinted panels.
  - **No gold or yellow** (no Sabroso-style blue + gold). Red and green appear only for form states.
- **Photos lead:** large, natural documentary photos, captioned with place and month. No stock, no filters.
- **Structure:**
  - a 12-column grid, 1200 px wide at most, with a 16 px mobile margin;
  - spacing in steps of 8 px;
  - asymmetric layouts, separated by hairlines and tints instead of shadows.
- **Icons** appear only if they earn their place: one custom set of six cause icons, shown in the preview first. No emoji.
- **Motion:** hover and focus states only; `prefers-reduced-motion` is respected.
- **Banned "AI tells":**
  - visual: gradients, gradient text, glassmorphism, blurred blobs, sparkles;
  - layout: everything centred, rows of three identical icon cards, giant rounded corners, pills everywhere;
  - copy: filler like "empowering communities", fake numbers or testimonials;
  - code: default shadcn/Tailwind styling.

## 4. Languages: Urdu and Saraiki done properly

- **URLs:** English at `/…`, Urdu at `/ur/…`, Saraiki at `/skr/…`. Slugs are the same in English for every language, so links shared on WhatsApp stay readable.
- **Two root layouts** (a standard App Router feature), sharing the same page components:
  - `(en)` renders `<html lang="en" dir="ltr">`;
  - `[lang]` renders `<html lang="ur|skr" dir="rtl">` (`skr` is Saraiki's ISO 639-3 code).
- **`hreflang` tags** (set through Next's Metadata API): en, ur and `x-default` → English. Saraiki is left out because Google accepts only two-letter codes there; its pages are still linked and in the sitemap.
- **Chooser:** plain links that go to the *same page* in the other language, or to that language's section index if the page is missing.
  - Each link carries `lang` and `hreflang`.
  - No flags, no automatic redirect, no cookies.
- **Where text lives:**
  - **UI strings:** the "dictionaries" pattern from the official Next.js i18n guide, `src/i18n/{en,ur,skr}.ts`. The Urdu and Saraiki files are typed against the English keys, so a missing string fails the build.
  - **Long text:** Markdown, `content/{pages,causes,updates}/{en,ur,skr}/<slug>.md`, read at build time (gray-matter + zod + remark).
  - **Facts** (contacts, wallets, socials, registration, donations switch): written once in `data/org.yaml`.
- **Keeping translations in step:**
  - English entries carry a `revision` number. Translations carry `sourceRevision` and `status: draft | reviewed`.
  - The production build fails if a core page is missing or still a draft in any language, and warns when a translation is older than its English source.
- **Updates** may exist in one language only. The other languages list them labelled "(English)" and link to the original; no automatic copies of English text under `/ur/`.
- **Review:** a dev-only page shows every string in three columns (EN | UR | SKR), so Bilal can review quickly.
- **Automatic checks** (`check-content`) flag:
  - Arabic letters in Urdu or Saraiki text (ي ك ه ى ة instead of ی ک ہ), except inside `lang="ar"`, such as the Arabic باهرة;
  - mixed Saraiki letter variants (ݙ/ڋ, ݨ/ڻ; we pick one of each together);
  - stray English sentences;
  - any `[[TODO]]` left.
- **Nastaliq typesetting** (values measured on the font file), through `next/font/local` `declarations`, or hand-written `@font-face` if those can't express everything:
  - **Size:** `size-adjust` around 118%. The final value (110, 118 or 126%) is chosen on Bilal's phone.
  - **Line height:** about 2.35 for body text and 1.7 for headings.
  - **`unicode-range`:** Arabic blocks plus space, NBSP, ZWNJ, ZWJ, LRM and RLM. English inside Urdu then falls back to Onest, and word spaces come from Nastaliq (its space is half as wide as Onest's).
  - **Labels:** ascent/descent overrides so short labels sit centred in buttons.
  - **Links:** `text-underline-offset` of about 0.3 em, so the underline clears the dots below letters.
  - **Never:** letter-spacing, capitals, italics (`font-synthesis: none`) or justified text. Urdu and Saraiki labels use weight or colour instead of tracked capitals.
- **Mixed-direction text:** phone numbers, emails and URLs go in `<bdi dir="ltr">`. Digits are Western 0–9 (Bilal confirms in review). Saraiki dates use Urdu month names, because Node's `Intl` has no Saraiki data and silently falls back to US English.
- **RTL:** CSS logical properties only (a check catches any left/right). `:dir(rtl)` flips arrows only; the logo and photos are never mirrored.
- **Fonts per language:**
  - **Onest:** subset to Latin, 84 → 41 KB, on every page.
  - **Nastaliq:** 261 KB, or a 212 KB subset that is checked against the built site. It is loaded and preloaded only by the `[lang]` layout.
  - **Chooser labels on English pages:** اردو / سرائیکی use the phone's built-in Noto Nastaliq Urdu, with a tiny subset as fallback.
  - Subsetting uses fontTools, a one-time `pip` download.

## 5. Technical architecture

```
CLAUDE.md                     my working rules (section 8)
README.md                     run the site, edit text, add photos, post an update, open donations
brand/                        source of truth, never edited
docs/website-plan.md          this plan, kept with the project
docs/content-checklist.md     what Bilal provides (section 7)
_photos/                      git-ignored inbox for original photos (they may contain GPS location data)
next.config.ts                output 'export', trailingSlash true, images.unoptimized
package.json (exact versions) tsconfig.json (strict) eslint.config.mjs
content/{pages,causes,updates}/{en,ur,skr}/*.md
content/photos/<topic>/       selected, cropped masters (not served directly)
data/org.yaml                 contacts, wallets, socials, registration, donations.open
public/                       favicons + site.webmanifest (from brand/icons), _headers (CSP, caching), generated img/
scripts/
  sync-brand.mjs              copies logo SVGs, fonts and icons out of brand/ (never redrawn)
  build-images.mjs            sharp: AVIF/WebP at several widths + size manifest; strips GPS and other metadata
  subset-fonts.py             Onest Latin subset, Nastaliq subset with coverage check
  check-content.mjs           translations, review status, lints, [[TODO]]
  check-site.mjs              over out/: links, hreflang pairs, lang/dir per folder, outside domains, GPS
  shots.mjs                   Playwright screenshots + axe accessibility scan
src/
  app/(en)/layout.tsx         English root layout; (en)/page.tsx = /, (en)/about/page.tsx = /about/ …
  app/[lang]/layout.tsx       Urdu/Saraiki root layout (RTL, Nastaliq); generateStaticParams → ur, skr
  app/[lang]/…/page.tsx       /ur/…, /skr/…
  app/sitemap.ts  robots.ts
  views/                      HomePage, AboutPage, CausePage … (shared by both layouts; page files are 3-line wrappers)
  components/                 TopBar, LanguageLinks, Header, Footer, Button, CauseIndex, UpdateCard, Photo, WalletCard, Form…
  i18n/en.ts ur.ts skr.ts get-dictionary.ts paths.ts
  lib/content.ts              Markdown loader with zod schemas
  styles/tokens.css fonts.css base.css (+ *.module.css next to components)
```

- **Reused from `brand/`:**
  - `colours/bahira-colours.css` becomes the tokens.
  - `fonts/*/…woff2`.
  - Logos: `logo/svg/bahira-horizontal-blue.svg` (header), `bahira-urdu-english-white.svg` (Urdu and Saraiki footers), `bahira-primary-white.svg` (English footer).
  - Icons: `icons/*` and the `head-snippet.html` lines (through the Metadata API).
  - Share image: `social/link-preview-1200x630.png`.
- **Dependencies (few, pinned exactly):**
  - runtime: `next`, `react`, `react-dom`, `gray-matter`, `zod`, `remark`/`rehype`, `yaml`;
  - dev: TypeScript, ESLint (`eslint-config-next`), Prettier, `sharp`, Playwright, `@axe-core/playwright`, Lighthouse CLI, `serve` (local preview of `out/`).
- **Static-export rules (Next.js):**
  - **Not available:** proxy/middleware, server-side redirects and headers, and Next's built-in image optimiser.
  - **Instead:**
    - headers and the Content Security Policy go in the host's `public/_headers`;
    - images come from `build-images.mjs` through our `<Photo>` component (`<picture>`, dimensions set);
    - every dynamic route has `generateStaticParams` and `dynamicParams = false`.
- **Phase-1 routing spike (about 1 hour):** two root layouts, English at `/`, and `/ur/` + `/skr/` under `[lang]` all export correctly. `hreflang` metadata, trailing slashes, the trilingual 404 and the font descriptors also work.
- **Photos:**
  - **Intake:** Bilal drops originals into `_photos/inbox/<activity>/` with a note (what, where, when, consent). I select and crop them to 3:2, 4:5 or 1:1 into `content/photos/`.
  - **Output:** `build-images.mjs` writes the web versions; only those are served.
  - **Location data:** stripped, and `check-site` scans `out/` for any left.
  - **Consent:** identifiable women, children, intersex people and aid recipients appear only with consent; otherwise from behind, hands or wide shots. No pity framing.
- **Forms (volunteer, contact):**
  - They post to Web3Forms, using the key in `org.yaml`, and emails arrive at the foundation inbox.
  - **Fields:** name, phone or email, city, interests, message. **Never CNIC or gender.**
  - A honeypot field blocks spam, and the form works as plain HTML before JavaScript loads.
  - Labels and errors appear in all three languages.
- **Donations switch:** `donations.open: false` in `org.yaml`. Flipping it to `true` shows the wallet cards (provider, account title, holder name and role, number, copy button) everywhere.
- **SEO and sharing:**
  - Metadata API: titles and descriptions per page and language, canonical URLs, `alternates.languages`.
  - `app/sitemap.ts` with language alternates.
  - Structured data marking Bahira as an NGO (founded 2025-12-10, Bahawalpur).
  - Each update's cover photo becomes its WhatsApp / Facebook share image.
- **Privacy:**
  - **Content Security Policy** (in `_headers`): images, fonts and connections come only from our own domain, and forms post only to Web3Forms. Scripts need `'unsafe-inline'` because Next.js inlines its page data.
  - No analytics at launch.
- **Budgets** (Lighthouse mobile, slow 4G):
  - **Data:** first view ≤ 300 KB in English (React runtime included) and ≤ 550 KB in Urdu or Saraiki; repeat visit ≤ 60 KB.
  - **Code and images:** our own browser JavaScript ≤ 10 KB beyond the framework; hero image ≤ 70 KB (AVIF).
  - **Speed:** LCP < 2.5 s, CLS ≤ 0.05, zero third-party requests.
  - **Accessibility:** WCAG 2.2 AA.

## 6. Build phases

**Right after this plan is approved (no website code yet):** write `CLAUDE.md` at the repo root, save this plan as `docs/website-plan.md`, and create `docs/content-checklist.md`. Phase 1 starts when Bilal says go.

| # | Phase | Output | Gate |
|---|---|---|---|
| 1 | **Setup and guardrails** | <ul><li>Next.js scaffold (TypeScript, App Router, static export); routing spike</li><li>tokens; font subsets</li><li>both root layouts with top bar, header and footer</li><li>`org.yaml`; all scripts; README</li></ul> | Clean build; skeleton pages in en / ur / skr with the right `lang` and `dir`; no outside requests |
| 2 | **Design preview** | <ul><li>The **Home page fully designed** with about 15 real photos, in English and Urdu, plus the Saraiki header and hero and the closed Donate block</li><li>Screenshots at 360 / 390 / 768 / 1280 px, with a short written rationale</li><li>Nastaliq size chosen on Bilal's phone</li></ul> | **Bilal approves before anything else is built** |
| 3 | **Templates (English)** | All other pages, the cause template, updates, both forms wired to Web3Forms, the 404 page | Review together |
| 4 | **Content** | <ul><li>Final English</li><li>Urdu, then Saraiki drafts, with review rounds on the review page</li><li>Photos placed, with alt text in all three languages</li><li>Launch posts, e.g. "Our first year"</li></ul> | All core pages `reviewed` |
| 5 | **Quality pass** | <ul><li>axe, keyboard, NVDA / TalkBack, 200% zoom</li><li>Lighthouse on every page</li><li>RTL and Nastaliq on real phones</li><li>GPS scan; links and hreflang; CSP; share previews</li></ul> | All green |
| 6 | **Launch** (on Bilal's go-ahead only) | <ul><li>Domain and hosting in the foundation's name, with 2FA. Recommended: **Cloudflare**, which is free, has had servers in Pakistan, reads `_headers`, deploys from the laptop or GitHub, and offers free email forwarding for info@</li><li>Live form test and WhatsApp preview test</li></ul> | Bilal deploys |
| 7 | **After launch** | <ul><li>Flip `donations.open` once registered</li><li>A foundation account, bank account and Raast</li><li>Simpler update posting</li><li>The annual report</li><li>Server features (logins, admin, Supabase) only if they're really needed</li></ul> | — |

**Target: 10 December 2026**, Bahira's first anniversary and Human Rights Day, about 5½ weeks away.
- **Critical path:** content (photos, facts, the Urdu and Saraiki review).
- **If registration isn't through by then:** the site launches with donations closed. Aim to open them before Ramadan (about 8 Feb 2027), Pakistan's peak giving season.

## 7. What I need from Bilal (tracked in `docs/content-checklist.md`)

1. **For the preview:** about 15 strong photos. Then the rest, by activity, with what, where, when and consent.
2. **Contacts:**
   - the foundation email (for forms and to show on the site);
   - a phone or WhatsApp number to publish (an organisation number is better than a personal one);
   - the area or address to show;
   - social media links.
3. **Registration:** the date of the application and its status. I'll update the site when it comes through.
4. **Wallet:** JazzCash / Easypaisa account title, number, and the holder's role (shown only once donations open).
5. **Zakat:** whether Bahira accepts it, and what it is used for.
6. **The story so far:** activities since 10 Dec 2025 (date, place, what, real counts), plus upcoming events.
7. **People:** the founder's bio and photo; the team or trustees to show, with consent.
8. **Review:**
   - the Urdu and Saraiki drafts;
   - the terms for "intersex";
   - Saraiki spelling choices;
   - the tagline in Urdu and Saraiki.
9. **By Phase 3:** a Web3Forms access key, created with the foundation email.

## 8. CLAUDE.md (repo root, written for me, about 100 lines)

- **Project:** the organisation, its causes and tagline, its audiences, and that Bilal reviews Urdu and Saraiki.
- **Non-negotiables:**
  - everything stays local (no claude.ai, Docs or Drive, no publishing);
  - commit, push or deploy only when asked;
  - never alter the logo or edit `brand/`;
  - preview before building out;
  - never invent facts, numbers, quotes or claims (use `[[TODO: …]]`);
  - donations stay closed until Bilal confirms registration;
  - no blue + gold, no egg or teardrop shapes.
- **Stack and commands:** Next.js 16 static export; `pnpm dev | build | preview | lint | check | sync:brand | images | shots`.
- **Next.js rules:**
  - Server Components by default; `'use client'` only for the menu, copy button and form;
  - no proxy/middleware and no next.config headers (static export);
  - images only through `<Photo>`;
  - every dynamic route has `generateStaticParams`;
  - ESLint runs directly (`next lint` is gone in Next 16);
  - plus any gotchas found in the spike.
- **Structure:** where pages, views, content, dictionaries, `org.yaml` and styles live.
- **Language rules:**
  - the URL scheme, both root layouts, `hreflang` and review status;
  - the spelling باہِرہ and the Nastaliq rules;
  - `<bdi>` for numbers, emails and URLs inside right-to-left text;
  - logical CSS properties only;
  - Saraiki dates.
- **Design system:** tokens and the deck's type scale, the grid, the banned AI tells, and the photo rules (consent, no originals served).
- **Forms:** minimal fields only; never CNIC or gender.
- **Voice:** plain, warm, specific; Bilal's voice; the tagline.
- **Done means:**
  - build, lint and both checks pass;
  - screenshots of the changed pages in en and ur at 360 and 1280 px have been looked at;
  - axe is clean;
  - budgets are met.

## 9. Verification

- **Build:** `pnpm build` runs `sync-brand`, `build-images`, `check-content`, `next build` (types), and then `check-site` over `out/`. `pnpm lint` runs ESLint.
- **Local preview:** `pnpm preview` serves `out/` exactly as a host would.
- **Screenshots and accessibility:** `pnpm shots` uses Playwright with the Edge already on Windows 11 (no Chromium download). It captures every page × 3 languages at 360 / 390 / 768 / 1280 px and runs axe. I look at the screenshots before showing Bilal.
- **Performance:** Lighthouse CLI on every page in English and Urdu, against the budgets in section 5.
- **Real phones:** run `pnpm dev -H 0.0.0.0` and open the site on a phone on the same Wi-Fi (mainly Android Chrome), including the Nastaliq size choice.
- **After launch:** a real form submission arrives by email, and the WhatsApp and Facebook link previews look right.

## 10. Main risks

| Risk | Mitigation |
|---|---|
| Collecting donations before registration | Donate stays closed behind `donations.open` until Bilal confirms. In-kind appeals may count as collecting donations too, so check with the Commission before they're published. |
| Donations to a personal wallet | Show the holder's name and role openly; move to a foundation account later |
| Scammers using Bahira's name | A warning on the Donate page; account details live in one data file |
| Late content | Phases 1–2 need only about 15 photos; the checklist is tracked from day 1 |
| Saraiki quality | I draft, Bilal reviews; draft status blocks the production build; spelling-variant lint |
| Nastaliq breaking or loading slowly | Measured font settings; screenshots and real-phone checks; budgets |
| React's weight on mobile data | Server Components by default, three tiny client pieces, budgets checked on every build |
| Next.js changes quickly (a major version roughly every year) | Exact version pins and few dependencies; the exported site is plain files and never needs upgrading |
| Privacy of vulnerable people | Consent rule; GPS removed and scanned for; originals never committed; organisation phone number |
| Sensitive causes (women's and intersex rights) | Dignified, factual wording agreed with Bilal; no personal details of people helped |
