# Plan: Bahira Foundation website

**Status:** approved by Bilal on 1 November 2026 and revised with Bilal on 14 November 2026. **Phase 1 is done** (14 November 2026; results in sections 4, 5 and 6). **Phase 2 is done** (14 November 2026): Bilal approved the Home page in English, Urdu and Saraiki, and Nastaliq at 118%. Phase 3 starts when Bilal says go.

**No dates.** Bilal sets the pace. The phases follow in order and each waits for its gate, but none is tied to a calendar date.

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
- **Photos:** there are plenty of real ones, so the design leads with photos. Bilal shares only photos that are fine to publish. They are taken openly and the people in them know they will be posted online, so there is no per-photo consent paperwork.
- **Forms:** they send email through a form service (Web3Forms).
- **Contact:** no phone or WhatsApp number is published for now, because there is no SIM in the foundation's name. People write through the forms, and Bilal calls back on the number they give.
- **Languages side by side:** English, Urdu and Saraiki are treated equally. Every page, preview and template is built in all three at the same time. Bilal reviews the Urdu and Saraiki.
- **Writing:** I write all the copy, including the introduction, mission and values, volunteer roles and policies, and Bilal approves it. When I need a fact I can't know, I ask; I never invent one.
- **Donations:** JazzCash / Easypaisa, in a **personal account**. It is shown with the holder's name and role, e.g. "Bilal, Founder", until there is a foundation account.
- **Donations switch:** the Donate page is built behind one switch, `donations.open`. **Bilal decides when to open it**; it is not tied to registration.
- **Registration:** Bahira is not registered with the Punjab Charity Commission yet. Bilal plans to register it soon. The site says so honestly and never claims registration. (Noted while planning: ProPakistani reported on 13 May 2026 that the Commission bans collecting donations before registration, under the Punjab Charities Act 2018. See the risks in section 10.)
- **Hosting:** Vercel's free plan. Whether to buy a domain of our own is decided once the website is finalised, and so is the check on Vercel's free-plan rules (section 10).

**Verified**
- **Fonts:** Noto Nastaliq Urdu (in `brand/fonts`) has every Saraiki letter (ٻ ڄ ݙ ڳ ݨ, plus ڋ ڻ). HarfBuzz shapes them correctly in their initial, medial and final forms. Onest has no Arabic-script letters, so each script gets its own font.
- **Brand deck:** the header mock-up (slide "In use") reads About · Our work · Get involved · **Donate**. The type scale (slide 10) is H1 Onest Bold 48/56, H2 32/40, body 18/28, labels 14 px capitals with 0.14 em spacing.
- **Tools:** Phase 1 pinned `next` 16.4.6 and `react` 19.3.1, with TypeScript 5.9 and ESLint 9, the versions Next 16.4 is built and tested with. Node 24, pnpm 10, Python 3.12 and git are installed, and a GitHub remote exists.

---

## 1. Approach and stack

**Next.js 16 (App Router, React 19, TypeScript strict), built with `output: 'export'`.** At build time every page in every language becomes a plain HTML file in `out/`.

- **A stack developers know:** React is the most used frontend library and Next.js its most used framework. Any React developer in Pakistan can pick this project up.
- **No server, no database:** hosting is free and there is nothing to hack or patch on a server. Visitors' details never sit in an online database; forms go straight to email. The site also previews on the laptop.
- **Room to grow without a rewrite:** if Bahira later needs logins, a staff admin screen, card donations or event sign-ups, the same codebase can switch to server hosting and add API routes, authentication and Supabase.
- **The honest trade-off:** every page loads React's runtime (about 100 KB of JavaScript, cached after the first visit). To keep pages fast on mobile data:
  - Server Components are the default, and only three tiny pieces run in the browser (menu, copy button, form). Phase 2 added a few lines on Urdu and Saraiki pages that hold the page body back until its font has arrived (section 4);
  - the budgets in section 5 are set accordingly.
- **Styling:** plain CSS (global design tokens + CSS Modules, both built into Next.js), not Tailwind/shadcn. Those defaults are the look most "vibe-coded" sites share, and the RTL and Nastaliq rules stay clearer in plain CSS.
- **Built in phases:** there is an approval gate after a single design preview, following the "preview before package" rule.

(Astro, the lighter alternative, was set aside because far fewer developers know it.)

## 2. Pages and navigation (every page in en / ur / skr)

| Page | URL | Purpose and main sections |
|---|---|---|
| Home | `/` | **First screen:** a real photo saying who Bahira is, what it does and where, with two actions: Volunteer, and Donate (or "Donations open soon").<br>**Below** (as built in Phase 2):<ul><li>"Bahira at a glance": founded date, Bahawalpur, registration status, email</li><li>the six causes as a short list. A cause gets a real example and photo here once it has real work to show; so far only the first has</li><li>"Founded on Human Rights Day, 10 Dec 2025", what باہِرہ means, and the sign</li><li>the 3 latest dated updates, one photo each</li><li>volunteer, and the closed donations block</li></ul> |
| About | `/about/` | <ul><li>Bilal's introduction, which I draft in Bilal's voice and Bilal approves</li><li>the name ("luminous") and the symbol (B, flame, diya)</li><li>why Human Rights Day</li><li>mission, vision, values</li><li>Bahawalpur → South Punjab</li><li>founder and team, with photos</li></ul> |
| Our work | `/work/` + `/work/<cause>/` ×6 | **Overview plus one template for every cause:** why it matters here, what we do, what we've done (dated, with photos and related updates), how to help.<br>**Provisional slugs:** `people-in-need`, `womens-rights`, `stray-animals`, `trees`, `intersex-rights`, `youth`.<br>A cause without enough real content stays a section on `/work/` until it has some. |
| Updates | `/updates/`, `/updates/<slug>/` | The proof of work: what, where, when and photos. Upcoming events are pinned. |
| Get involved | `/get-involved/` | Volunteer roles and process, the **volunteer form**, youth skills and events, partners (schools, businesses, NGOs), spreading the word. |
| Donate | `/donate/` | **Closed (until Bilal opens it):** "Donations opening soon" and ways to help today.<br>**Open (one switch, whenever Bilal decides):**<ul><li>JazzCash / Easypaisa cards: account title, holder's name and role, number, copy button</li><li>a **Zakat policy:** Zakat only for eligible people, kept separate, wording checked by a scholar</li><li>how to get a receipt</li><li>honest registration and tax status, with no claim that Bahira is registered or that donations are tax-deductible</li><li>"Bahira only uses the accounts on this page"</li><li>FAQ, including giving from abroad</li></ul> |
| Need help? | `/help/` | **For people who need help:** who we can help, what happens next, and the **help form** (name, phone, city, message). Bilal calls back on the number they give.<br>**Also:** official helplines (Rescue 1122, Police 15, Punjab Women Helpline 1043, each verified before publishing).<br>Written in Urdu and Saraiki first. |
| Accountability | `/accountability/` | Registration status, who runs Bahira, how money is handled, policies (photos, safeguarding, complaints), and the annual report once the first one is written. |
| Contact | `/contact/` | Email, area, socials, the **contact form**, and a map *link* (not an embedded map). No phone number for now; one is added once the foundation has its own SIM. |
| Privacy | `/privacy/` | What the forms collect and where it goes. No cookies or trackers, enforced by the site's Content Security Policy. |
| Thank you | `/thanks/` | Where every form lands after sending, in the sender's language: the message arrived, and what happens next. Kept out of search engines. |
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
- **Icons** appear only if they earn their place. **Phase 2: none.** The causes read clearly as a list of words in all three languages, and six icons in a row is one of the template looks we avoid. A custom set can still be drawn later if Bilal wants one, previewed first. No emoji.
- **Built in Phase 2 (the Home page):**
  - The hero puts the text first on phones, with the photo below it. From tablet width the text and photo sit side by side. The caption names the event and the month.
  - Each section has its own surface: hairlines for the facts and causes, the one Deep Blue band for the founding story, and a Sky panel for volunteering and donations.
  - New tokens: muted text `#404B57` (8.2:1 on Paper), H3 20 px, a lead size of 18–20 px, and section spacing of 64–96 px.
  - Four photos in all, one per event plus the hero, because every photo costs prepaid data. The other photos go on each event's own page (Phase 3).
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
  - **Long text:** Markdown, `content/{pages,causes,updates}/{en,ur,skr}/<slug>.md`, read at build time: front matter with `yaml` and `zod` (Phase 2), the text itself with remark (Phase 3).
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
- **Nastaliq typesetting** (values measured on the font file), through `next/font/local` `declarations`:
  - **Size:** `size-adjust` 118%. Phase 2 compared the Urdu Home page on a phone at 110, 118 and 126% (`shots/phase-2/nastaliq-sizes-110-118-126.png`). At 126% the opening text runs a line longer and the button drops below its note; 110% looks small beside English. **118%, approved by Bilal** on 14 November 2026.
  - **Line height:** 2.35 for body text and 2 for headings (unitless multiples of the font size).
  - **`unicode-range`:** only the characters Urdu and Saraiki use, plus space, NBSP, ZWNJ, ZWJ, LRM and RLM. English inside Urdu then falls back to Onest, and word spaces come from Nastaliq (its space is half as wide as Onest's).
  - **Labels (done in Phase 2):** buttons, menus and labels use a second face of the same Nastaliq file, with ascent 115%, descent 65% and no line gap, at line height 1.6 (`--font-ui`). Urdu buttons are 50 px tall (English 48) with the label centred. Both faces point to one file, so phones download it once; `check-site` fails if a font is ever downloaded twice.
  - **Line breaks (Phase 2):**
    - Running text never ends on one word alone (`text-wrap: pretty`). This matters most in Urdu and Saraiki, whose sentences end in short words like ہے۔ On the Home page it cleared every one from the paragraphs, in all three languages and at all four widths.
    - A date never splits across lines: its parts are joined by no-break spaces.
    - A word in another font or a larger size, like the Arabic باهرة, takes line height 1, so its line keeps the same spacing as the rest.
  - **Links:** `text-underline-offset` of 0.3 em, so the underline clears the dots below letters.
  - **While the font downloads (Phase-1 spike, measured):** the test used a 390 px phone, slow 4G and a 4× slower CPU, median of three runs, in Urdu and Saraiki.
    - With the first 195 KB file, Nastaliq arrived after about 3.5 s. "swap" and "fallback" made the page jump (CLS 0.22–0.24). "block" was still too late (LCP 4 s). "optional" never showed Nastaliq on a first visit.
    - So the file was cut to what Urdu and Saraiki use and to the Regular weight alone: **107 KB**, arriving after about 2.2 s. With **`font-display: block`** the page no longer jumps (CLS 0.00 Urdu, 0.05 Saraiki) and the text shows by about 2.4 s.
    - Chosen: the 107 KB file with "block". The cost is no bold Nastaliq; Urdu and Saraiki headings stand out by size and colour.
    - The local test server cannot put the font ahead of the JavaScript; Vercel can, so the live site should do better than this.
    - **Phase 2, on the designed Home page:** with "block" the text is invisible while the font downloads, but it is still laid out in a narrower stand-in font. When Nastaliq arrived, lines rewrapped and the page jumped (CLS 0.093 in Urdu). Two fixes brought every page to **CLS 0.000**:
      - nothing in the header takes its height from the font;
      - on Urdu and Saraiki pages the body (not the header) stays hidden until the fonts have arrived, 3 s at most, then appears in its final layout. Its text would be invisible until then anyway. Without JavaScript the page loads as before.
  - **Never:** letter-spacing, capitals, italics (`font-synthesis: none`) or justified text. Urdu and Saraiki labels use colour or size instead of tracked capitals or bold.
- **Mixed-direction text:** phone numbers, emails and URLs go in `<bdi dir="ltr">`. Digits are Western 0–9 (Bilal confirms in review). Saraiki dates use Urdu month names, because Node's `Intl` has no Saraiki data and silently falls back to US English.
- **RTL:** CSS logical properties only (a check catches any left/right). `:dir(rtl)` flips arrows only; the logo and photos are never mirrored.
- **Fonts per language (Phase 1, built):**
  - **Onest:** subset to Latin, 84 → 37 KB, weights 100–900, on every page.
  - **Nastaliq:** 107 KB, Regular only. It is loaded and preloaded only by the `[lang]` layout; `check-site` fails the build if an English page ever preloads it.
  - **Chooser labels on English pages:** اردو / سرائیکی use the phone's built-in Noto Nastaliq Urdu, with a 21 KB file of just those letters as fallback.
  - Subsetting uses fontTools (4.68.0, in a project `.venv`). The output is committed, so building the site never needs Python.

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
content/photos/crops.yaml     which original each crop comes from, its shape and focus point
data/org.yaml                 site address, contacts, wallets, socials, registration, donations.open
public/                       favicons + site.webmanifest (from brand/icons), generated img/
vercel.json                   host settings: headers (CSP, caching)
scripts/
  sync-brand.mjs              copies logo SVGs, fonts and icons out of brand/ (never redrawn)
  crop-photos.mjs             pnpm photos: makes the crops in crops.yaml from _photos/inbox/, with no metadata
  build-images.mjs            sharp: AVIF/WebP at several widths + size manifest; JPEG share images; strips GPS and other metadata
  subset-fonts.py             Onest Latin subset, Nastaliq subset with coverage check
  check-content.mjs           translations, review status, lints, [[TODO]], GPS left in content/photos
  check-site.mjs              over out/: links, hreflang pairs, lang/dir per folder, outside domains, GPS, page-weight budgets
  shots.mjs                   Playwright screenshots + axe accessibility scan
src/
  app/(en)/layout.tsx         English root layout; (en)/page.tsx = /, (en)/about/page.tsx = /about/ …
  app/[lang]/layout.tsx       Urdu/Saraiki root layout (RTL, Nastaliq); generateStaticParams → ur, skr
  app/[lang]/…/page.tsx       /ur/…, /skr/…
  app/sitemap.ts  robots.ts
  views/                      HomePage + home/ (its sections), PlaceholderPage; AboutPage, CausePage … in Phase 3
                              (shared by both layouts; page files are 3-line wrappers)
  components/                 TopBar, LanguageLinks, Header, MenuDisclosure, Footer, Photo, ArrowLink, Email,
                              Template; WalletCard, Form… in Phase 3
  i18n/en.ts ur.ts skr.ts get-dictionary.ts paths.ts format.ts
  lib/content.ts              Markdown loader with zod schemas; lib/photos.ts reads the image manifest
  styles/tokens.css fonts.css base.css (+ *.module.css next to components)
```

- **Reused from `brand/`:**
  - `colours/bahira-colours.css` becomes the tokens.
  - `fonts/*/…woff2`.
  - Logos: `logo/svg/bahira-horizontal-blue.svg` (header), `bahira-urdu-english-white.svg` (Urdu and Saraiki footers), `bahira-primary-white.svg` (English footer).
  - Icons: `icons/*` and the `head-snippet.html` lines (through the Metadata API).
  - Share image: `social/link-preview-1200x630.png`.
- **Dependencies (few, pinned exactly):**
  - **runtime:** `next`, `react`, `react-dom`, `zod`, `yaml`. `remark`/`rehype` arrive when Markdown text is rendered (Phase 3). Phase 2 added no dependency.
  - **dev:** TypeScript, ESLint (`eslint-config-next`), Prettier, `sharp`, Playwright, `@axe-core/playwright`. The Lighthouse CLI is added for the quality pass (Phase 5).
  - **Changed in Phase 1:**
    - `gray-matter` was dropped: it has not been updated since 2021, and `yaml` reads front matter just as well.
    - `serve` was dropped for a small server of our own (`scripts/lib/static-server.mjs`). It also sends the `vercel.json` headers, so the Content Security Policy is tested locally.
- **Static-export rules (Next.js):**
  - **Not available:** proxy/middleware, server-side redirects and headers, and Next's built-in image optimiser.
  - **Instead:**
    - headers and the Content Security Policy go in `vercel.json` (Vercel does not read a `_headers` file);
    - images come from `build-images.mjs` through our `<Photo>` component (`<picture>`, dimensions set);
    - every dynamic route has `generateStaticParams` and `dynamicParams = false`.
- **Phase-1 spike:** it proves the risky parts before anything is built on them.
  - **Routing (done, works):**
    - Two root layouts put English at `/`, and `/ur/` and `/skr/` under `[lang]`. All 30 pages export as `…/index.html` with trailing slashes.
    - Each page has the right `lang` and `dir`, and the right canonical and `hreflang` tags (none for Saraiki).
    - The trilingual 404 is `src/app/global-not-found.tsx`, behind the documented experimental flag for apps with several root layouts.
  - **Font loading (done):** see section 4. Two Next.js traps were found and fixed; `check-site` now guards both.
    - The 404 page is bundled with every route, so it must not use `next/font`.
    - The default CSS merging carried the Nastaliq preload onto English pages; `experimental.cssChunking` set to `graph` keeps each page to its own CSS. Phase 2 raised `requestCost` from 0 to 1: stylesheets that always load together now merge (the Home page loads 4 instead of 13), and still no page gets CSS it doesn't use.
  - **Forms (moved to the start of Phase 3):** it needs the Web3Forms access key. A test submission without JavaScript should return to our own `/thanks/` page on Web3Forms' free plan. If the free plan doesn't allow that, the form's script shows the thank-you message and only visitors without JavaScript see Web3Forms' own page.
- **Photos:**
  - **Intake:** Bilal drops originals into `_photos/inbox/<activity>/` with a short note (what, where, when). I select and crop them to 3:2, 4:5 or 1:1 into `content/photos/`. GPS and other metadata are removed at that step, because this folder goes to GitHub.
  - **Crops (Phase 2):** each crop is one entry in `content/photos/crops.yaml` (the original, the shape, the point to keep in the centre), and `pnpm photos` makes them. So any crop can be remade or adjusted later.
  - **Never published:** another organisation's banner or account numbers. Several orphanage photos show one, so only a photo without it is used.
  - **Output:** `build-images.mjs` writes the web versions; only those are served. AVIF at quality 42 (no visible difference from 50 at full size) and WebP at 72, from 360 to 1920 px wide, so each phone loads the smallest that fits its screen.
  - **Share images:** for each update the build also makes a 1200×630 JPEG of the cover photo, because JPEG is the safe format for WhatsApp and Facebook link previews. This is automatic; Bilal only shares photos as usual.
  - **Location data:** stripped twice, at the crop and at the build. `check-content` scans `content/photos/` and `check-site` scans `out/` for any left.
  - **Which photos:** Bilal chooses what to share, and shares only photos that are fine to publish. Dignity first, no pity framing.
- **Forms (volunteer, contact, help):**
  - They post to Web3Forms, using the key in `org.yaml`, and emails arrive at the foundation inbox.
  - **Fields:** name, phone or email, city, interests, message. The help form asks for a phone number, so Bilal can call back. **Never CNIC or gender.**
  - A honeypot field blocks spam, and the form works as plain HTML before JavaScript loads.
  - Labels and errors appear in all three languages.
  - After sending, the visitor lands on `/thanks/` in their own language.
  - **Why a form service and not our own:** a form needs a server to receive it and a mail service to pass it on. The site has neither, on purpose, so there is nothing to hack, patch or pay for. Our own version would still depend on an outside mail service, and would add secret keys and spam handling to look after. All three forms share one component, so moving to our own endpoint later (a Vercel function) is a small change.
- **Donations switch:** `donations.open: false` in `org.yaml` until Bilal says to open. Flipping it to `true` shows the wallet cards (provider, account title, holder name and role, number, copy button) everywhere.
- **SEO and sharing:**
  - Metadata API: titles and descriptions per page and language, canonical URLs, `alternates.languages`.
  - `app/sitemap.ts` with language alternates.
  - Structured data marking Bahira as an NGO (founded 2025-12-10, Bahawalpur).
  - Each update's cover photo becomes its WhatsApp / Facebook share image (the 1200×630 JPEG). Other pages use `social/link-preview-1200x630.png`.
  - The site's address is stored once, as `site.url` in `org.yaml`. It starts as the free `…vercel.app` address and is changed in that one place if a domain is bought.
- **Privacy:**
  - **Content Security Policy** (in `vercel.json`): images, fonts and connections come only from our own domain, and forms post only to Web3Forms. Scripts need `'unsafe-inline'` because Next.js inlines its page data.
  - No analytics at launch.
- **Budgets** (Lighthouse mobile, slow 4G):
  - **Data:** first view ≤ 300 KB in English (React runtime included) and ≤ 550 KB in Urdu or Saraiki; repeat visit ≤ 60 KB.
  - **Code and images:** our own browser JavaScript ≤ 10 KB beyond the framework; hero image ≤ 70 KB (AVIF).
  - **Speed:** LCP < 2.5 s, CLS ≤ 0.05, zero third-party requests.
  - **Accessibility:** WCAG 2.2 AA.
  - **Enforcement:** `check-site` adds up what each page downloads (compressed) and fails the build when a data, code or image budget is broken. Lighthouse measures the speed figures.
  - **Measured after Phase 1:**
    - **English pages:** about 226 KB of 300. The framework's JavaScript is about 159 KB of that, more than the 100 KB first estimated.
    - **Urdu and Saraiki pages:** about 312 KB of 550.
    - **Our own JavaScript** (the phone menu): under 1 KB. It is measured as what a page loads beyond the 404 page, which loads only the framework.
  - **Measured after Phase 2** (the designed Home page):
    - **Images are counted as a phone loads them:** `check-site` models the phone in Lighthouse's mobile test (412 px wide, 1.75 pixel density), which picks the 800 px hero.
    - **English Home:** 268 KB of 300. The hero photo is 36 KB of that; the photos further down load only when a reader scrolls to them.
    - **Urdu and Saraiki Home:** 355 KB of 550.
    - **Hero:** the largest version is 59 KB AVIF, within the 70 KB limit.
    - **Speed, measured on the laptop:**
      - The test used a 412 px phone, slow 4G (Lighthouse's settings), a 4× slower CPU, compressed files and the host's cache headers. Each figure is the median of three cold loads.
      - **CLS:** 0.000 in all three languages.
      - **LCP:** English 2.6 s (the hero photo); Urdu and Saraiki 3.0–3.3 s across runs (the opening paragraph, which waits for Nastaliq).
      - This local server can't use HTTP/2 or send the font ahead of the 159 KB of framework JavaScript, so these LCP figures are pessimistic. The real figure is measured on Vercel in Phase 5.
      - If Urdu is still over 2.5 s there, the levers are: font before JavaScript on the host, and a lighter hero on Urdu and Saraiki phones.

## 6. Build phases

**Right after this plan is approved (no website code yet):** write `CLAUDE.md` at the repo root, save this plan as `docs/website-plan.md`, and create `docs/content-checklist.md`. Phase 1 starts when Bilal says go.

| # | Phase | Output | Gate |
|---|---|---|---|
| 1 | **Setup and guardrails** (done 14 Nov 2026) | <ul><li>Next.js scaffold (TypeScript, App Router, static export); routing spike</li><li>tokens; font subsets</li><li>both root layouts with top bar, header and footer</li><li>`org.yaml`; all scripts; README</li></ul> | **Passed:** clean build; 30 placeholder pages and the 404 in en / ur / skr with the right `lang` and `dir`; no outside requests; axe clean on all 124 screenshots |
| 2 | **Design preview** (done 14 Nov 2026) | <ul><li>The **Home page fully designed** with real photos from Bilal's 20, in English, Urdu and Saraiki, with the closed Donate block</li><li>Screenshots at 360 / 390 / 768 / 1280 px, with a short written rationale</li><li>Nastaliq size chosen on Bilal's phone</li></ul> | **Passed:** approved by Bilal on 14 Nov 2026. Build, lint, axe on all 124 screenshots and the page-weight budgets pass; no layout shift (CLS 0.000) |
| 3 | **Templates** | All other pages, the cause template, updates, the three forms wired to Web3Forms, the thank-you and 404 pages. Each is built in English, Urdu and Saraiki at the same time, with draft text | Review together |
| 4 | **Content** | <ul><li>Final text in all three languages, written by me</li><li>Bilal's review rounds for Urdu and Saraiki on the review page</li><li>Photos placed, with alt text in all three languages</li><li>Launch posts, e.g. "Our first year"</li></ul> | All core pages `reviewed` |
| 5 | **Quality pass** | <ul><li>axe, keyboard, NVDA / TalkBack, 200% zoom</li><li>Lighthouse on every page</li><li>RTL and Nastaliq on real phones</li><li>GPS scan; links and hreflang; CSP; share previews</li></ul> | All green |
| 6 | **Launch** (on Bilal's go-ahead only) | <ul><li>Hosting on **Vercel's free plan**, deployed from GitHub, with 2FA on the account. The site goes live on a free `…vercel.app` address</li><li>Optional, now or later: a domain of our own (a `.com` costs about $10–15 a year), connected to Vercel</li><li>Live form test and WhatsApp preview test</li></ul> | Bilal deploys |
| 7 | **After launch** | <ul><li>Flip `donations.open` whenever Bilal decides (this can also happen at launch)</li><li>A foundation SIM, then a published phone / WhatsApp number</li><li>A foundation account, bank account and Raast</li><li>Simpler update posting</li><li>The annual report</li><li>Server features (logins, admin, Supabase) only if they're really needed</li></ul> | — |

**No target date.** Bilal works at his own pace, so no phase has a deadline. The part that takes longest is content: photos, facts, and the Urdu and Saraiki review.

## 7. What I need from Bilal (tracked in `docs/content-checklist.md`)

I write the copy myself (section "Decided with Bilal"). This list is only the photos and the facts I can't know; anything else I need, I ask as it comes up.

1. **For the preview:** about 15 strong photos (received: 20 from three events). Then the rest, by activity, with what, where and when.
2. **Contacts:**
   - the foundation email, for forms and to show on the site (received);
   - the area or address to show;
   - social media links;
   - no phone number for now (added once the foundation has its own SIM).
3. **Registration:** nothing for now. Bilal tells me when Bahira is registered, and I update the site.
4. **Wallet:** JazzCash / Easypaisa account title, number, and the holder's role (needed when Bilal decides to open donations).
5. **Zakat:** whether Bahira accepts it, and what it is used for.
6. **The story so far:** activities since 10 Dec 2025 (date, place, what, real counts), plus upcoming events.
7. **People:** the founder's photo, and the names and roles of any team members or trustees to show. I write the bios from what Bilal tells me.
8. **Review:**
   - the Urdu and Saraiki drafts;
   - the terms for "intersex";
   - Saraiki spelling choices;
   - the tagline in Urdu and Saraiki.
9. **By Phase 3:** a Web3Forms access key, created with the foundation email.
10. **Optional:** a domain name, if Bilal wants one instead of the free `…vercel.app` address.

## 8. CLAUDE.md (repo root, written for me, about 100 lines)

- **Project:** the organisation, its causes and tagline, its audiences, and that Bilal reviews Urdu and Saraiki.
- **Non-negotiables:**
  - everything stays local (no claude.ai, Docs or Drive, no publishing);
  - commit, push or deploy only when asked;
  - never alter the logo or edit `brand/`;
  - preview before building out;
  - never invent facts, numbers, quotes or claims (use `[[TODO: …]]`);
  - donations stay closed until Bilal says to open them, and the site never claims registration;
  - all three languages are built side by side;
  - I write the copy and ask Bilal only for facts;
  - no blue + gold, no egg or teardrop shapes.
- **Stack and commands:** Next.js 16 static export; `pnpm dev | build | preview | lint | check | sync:brand | images | shots`.
- **Next.js rules:**
  - Server Components by default; `'use client'` only for the menu, copy button and form;
  - no proxy/middleware and no next.config headers (static export; headers live in `vercel.json`);
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
- **Design system:** tokens and the deck's type scale, the grid, the banned AI tells, and the photo rules (GPS stripped, no originals served).
- **Forms:** minimal fields only; never CNIC or gender.
- **Voice:** plain, warm, specific; Bilal's voice; the tagline.
- **Done means:**
  - build, lint and both checks pass;
  - screenshots of the changed pages in en, ur and skr at 360 and 1280 px have been looked at;
  - axe is clean;
  - budgets are met.

## 9. Verification

- **Build:** `pnpm build` runs `sync-brand`, `build-images`, `check-content`, `next build` (types), and then `check-site` over `out/`. `pnpm lint` runs ESLint.
- **Local preview:** `pnpm preview` serves `out/` exactly as a host would.
- **Screenshots and accessibility:** `pnpm shots` uses Playwright with the Edge already on Windows 11 (no Chromium download). It captures every page × 3 languages at 360 / 390 / 768 / 1280 px and runs axe. I look at the screenshots before showing Bilal.
- **Performance:** Lighthouse CLI on every page in all three languages, against the budgets in section 5.
- **Real phones:** run `pnpm dev -H 0.0.0.0` and open the site on a phone on the same Wi-Fi (mainly Android Chrome), including the Nastaliq size choice.
- **After launch:** a real form submission arrives by email, and the WhatsApp and Facebook link previews look right.

## 10. Main risks

| Risk | Mitigation |
|---|---|
| Collecting donations before registration | Bilal's decision: he opens donations when he chooses, and plans to register Bahira with the Commission soon. The May 2026 report (see "Decided with Bilal") says the Commission bans collecting before registration, so this is a legal risk Bilal has accepted; a quick check with the Commission or a lawyer before opening would settle it. The site never claims registration, and the switch closes donations again in one line. |
| Donations to a personal wallet | Show the holder's name and role openly; move to a foundation account later |
| Scammers using Bahira's name | A warning on the Donate page; account details live in one data file. Anyone can register a look-alike `vercel.app` name, so a domain of our own is recommended before donations open. |
| Vercel's free plan is for non-commercial use | Sources disagree on whether asking for donations counts as commercial. Check Vercel's fair-use page before donations open. The site is plain files, so it can move to Cloudflare's free hosting if needed; only the headers file changes. |
| Content arrives slowly | There are no deadlines, so nothing breaks. Phases 1–2 need only about 15 photos. |
| Saraiki quality | I draft, Bilal reviews; draft status blocks the production build; spelling-variant lint |
| Nastaliq breaking or loading slowly | Measured font settings; screenshots and real-phone checks; budgets |
| React's weight on mobile data | Server Components by default, three tiny client pieces, budgets checked on every build |
| Next.js changes quickly (a major version roughly every year) | Exact version pins and few dependencies; the exported site is plain files and never needs upgrading |
| Privacy of vulnerable people | GPS removed at the crop and scanned for; originals never committed; no personal details of people helped; forms never ask for CNIC or gender |
| Sensitive causes (women's and intersex rights) | Dignified, factual wording agreed with Bilal; no personal details of people helped |
