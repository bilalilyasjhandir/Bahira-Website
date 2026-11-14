// Checks the built site in out/ after next build: what a visitor's browser would get.
// Any problem stops the build.
//
// Every page:   the right lang and dir for its folder; a title and description; the right
//               canonical address and hreflang alternates; noindex only where intended;
//               every link and file it uses exists; nothing loads from another website;
//               forms send only to Web3Forms; no phone links while there is no number;
//               English pages never preload the Nastaliq font, Urdu and Saraiki pages do;
//               every character can be shown by the site's fonts; the page-weight budgets.
// The site:     sitemap.xml lists every page once with the right alternates; robots.txt
//               points to it; no image anywhere carries a location (GPS).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import zlib from "node:zlib";
import { locationProblem } from "./lib/gps.mjs";
import { markupOnly, srcsetUrls, startTags, visibleText } from "./lib/html.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "out");
const importTs = (file) => import(pathToFileURL(path.join(root, file)).href);

if (!fs.existsSync(path.join(out, "index.html"))) {
  console.error("check-site: out/ has no built site. Run pnpm build.");
  process.exit(1);
}

const { org } = await importTs("src/lib/org.ts");
const { locales, direction } = await importTs("src/i18n/config.ts");
const { pages } = await importTs("src/lib/pages.ts");
const coverage = JSON.parse(fs.readFileSync(path.join(root, "src/fonts/coverage.json"), "utf8"));
const site = new URL(org.site.url);

/** Page-weight budgets (KB, compressed as sent): see docs/website-plan.md, section 5. */
const BUDGET = { en: 300, rtl: 550, repeat: 60, ownJs: 10, heroAvif: 70 };
const WEB3FORMS = "https://api.web3forms.com/submit";

const errors = [];
const error = (m) => errors.push(m);
const kb = (bytes) => Math.round(bytes / 102.4) / 10;

// --- Helpers -----------------------------------------------------------------------------

const localePath = (locale, p) => (locale === "en" ? p : `/${locale}${p}`);
const pageUrl = (p) => new URL(p, site).href;

/** The file in out/ that serves a same-site URL, or null for other websites. */
function fileFor(href, base = "/") {
  if (/^(mailto|tel|data|javascript):/i.test(href)) return null;
  const url = new URL(href, new URL(base, site));
  if (url.origin !== site.origin) return null;
  const p = decodeURIComponent(url.pathname);
  return path.join(out, p.endsWith("/") ? `${p}index.html` : p);
}
const isOutside = (href, base = "/") => {
  if (/^(mailto|tel|data|#)/i.test(href)) return false;
  return new URL(href, new URL(base, site)).origin !== site.origin;
};

const sizeCache = new Map();
/** Size in bytes as sent: text files brotli-compressed, everything else as is. */
function sentSize(file) {
  if (!sizeCache.has(file)) {
    const buf = fs.readFileSync(file);
    const text = /\.(html|css|js|json|txt|xml|svg|webmanifest)$/.test(file);
    sizeCache.set(
      file,
      text
        ? zlib.brotliCompressSync(buf, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 9 } })
            .length
        : buf.length,
    );
  }
  return sizeCache.get(file);
}

const covered = (...names) => new Set(names.flatMap((n) => coverage.files[n].codepoints));
const fontsFor = {
  en: covered("onest-latin.woff2", "nastaliq-labels.woff2"),
  ur: covered("onest-latin.woff2", "nastaliq.woff2"),
  skr: covered("onest-latin.woff2", "nastaliq.woff2"),
  404: covered("onest-latin.woff2", "nastaliq.woff2"),
};

/** The JavaScript files a page loads. */
function scriptsOf(html) {
  const found = new Set();
  for (const s of startTags(html, "script")) if (s.src) found.add(s.src);
  for (const l of startTags(html, "link")) {
    if ((l.rel === "preload" && l.as === "script") || l.rel === "modulepreload") found.add(l.href);
  }
  return [...found];
}

// --- The pages ---------------------------------------------------------------------------

const expected = [];
for (const [key, info] of Object.entries(pages)) {
  for (const locale of locales)
    expected.push({
      key,
      locale,
      path: localePath(locale, info.path),
      noindex: Boolean(info.noindex),
    });
}
const notFoundPage = { key: "404", locale: "404", path: "/404.html", noindex: true };

// Next.js also writes copies of the 404 page at these addresses; they are not our pages.
const NEXT_EXTRAS = new Set(["404/index.html", "_not-found/index.html"]);
const knownFiles = new Set([
  ...expected.map((p) => `${p.path.slice(1)}index.html`),
  "404.html",
  ...NEXT_EXTRAS,
]);
function listHtml(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === "_next" ? [] : listHtml(full);
    return e.name.endsWith(".html") ? [path.relative(out, full).split(path.sep).join("/")] : [];
  });
}
for (const file of listHtml(out))
  if (!knownFiles.has(file)) error(`out/${file}: a page that is not in src/lib/pages.ts`);

const frameworkJs = new Set(scriptsOf(fs.readFileSync(path.join(out, "404.html"), "utf8")));
const weights = [];

for (const page of [...expected, notFoundPage]) {
  const file =
    page.key === "404"
      ? path.join(out, "404.html")
      : path.join(out, page.path.slice(1), "index.html");
  const where = page.key === "404" ? "/404.html" : page.path;
  if (!fs.existsSync(file)) {
    error(`${where}: page is missing from out/`);
    continue;
  }
  const raw = fs.readFileSync(file, "utf8");
  const html = markupOnly(raw);
  const htmlTag = startTags(html, "html")[0] ?? {};
  const meta = startTags(html, "meta");
  const links = startTags(html, "link");
  const metaContent = (name) => meta.find((m) => m.name === name || m.property === name)?.content;

  // Language and direction
  const lang = page.key === "404" ? "en" : page.locale;
  const dir = page.key === "404" ? "ltr" : direction[page.locale];
  if (htmlTag.lang !== lang || htmlTag.dir !== dir) {
    error(
      `${where}: <html lang="${htmlTag.lang}" dir="${htmlTag.dir}">, expected lang="${lang}" dir="${dir}"`,
    );
  }

  // Title, description, indexing
  if (!/<title>[^<]+<\/title>/.test(html)) error(`${where}: no <title>`);
  if (!metaContent("description")) error(`${where}: no meta description`);
  const noindex = /noindex/.test(metaContent("robots") ?? "");
  if (page.noindex !== noindex)
    error(
      `${where}: ${page.noindex ? "should be" : "should not be"} kept out of search engines (noindex)`,
    );

  // Canonical and hreflang
  const canonical = links.find((l) => l.rel === "canonical")?.href;
  const alternates = Object.fromEntries(
    links.filter((l) => l.rel === "alternate" && l.hreflang).map((l) => [l.hreflang, l.href]),
  );
  if (page.key !== "404") {
    if (canonical !== pageUrl(page.path))
      error(`${where}: canonical is ${canonical}, expected ${pageUrl(page.path)}`);
    const englishPath = pages[page.key].path;
    const wanted =
      page.locale === "skr"
        ? {}
        : {
            en: pageUrl(englishPath),
            ur: pageUrl(localePath("ur", englishPath)),
            "x-default": pageUrl(englishPath),
          };
    if (JSON.stringify(alternates) !== JSON.stringify(wanted)) {
      error(
        `${where}: hreflang alternates are ${JSON.stringify(alternates)}, expected ${JSON.stringify(wanted)}`,
      );
    }
    for (const href of Object.values(alternates))
      if (!fs.existsSync(fileFor(href)))
        error(`${where}: hreflang points to a missing page: ${href}`);
  }

  // Links
  const ids = new Set([...raw.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const a of startTags(html, "a")) {
    const href = a.href ?? "";
    if (href.startsWith("#")) {
      if (href.length > 1 && !ids.has(href.slice(1)))
        error(`${where}: link to ${href}, but nothing has that id`);
    } else if (/^tel:/i.test(href)) {
      if (!org.contact.phone)
        error(`${where}: phone link ${href}, but there is no published number (data/org.yaml)`);
    } else if (!/^mailto:/i.test(href) && !isOutside(href, page.path)) {
      const target = fileFor(href, page.path);
      if (!target || !fs.existsSync(target)) error(`${where}: broken link to ${href}`);
    }
  }

  // Files the page loads: same site only, and present
  const resources = [
    ...links
      .filter((l) =>
        /^(stylesheet|preload|modulepreload|icon|apple-touch-icon|manifest)$/.test(l.rel),
      )
      .map((l) => l.href),
    ...startTags(html, "script")
      .map((s) => s.src)
      .filter(Boolean),
    ...["img", "source", "video", "audio", "iframe", "embed"].flatMap((t) =>
      startTags(html, t)
        .flatMap((x) => [x.src, ...(x.srcset ? srcsetUrls(x.srcset) : [])])
        .filter(Boolean),
    ),
    ...["og:image", "twitter:image"].map(metaContent).filter(Boolean),
  ];
  for (const href of new Set(resources)) {
    if (isOutside(href, page.path)) error(`${where}: loads ${href} from another website`);
    else if (!fs.existsSync(fileFor(href, page.path)))
      error(`${where}: uses ${href}, which is not in out/`);
  }
  for (const form of startTags(html, "form")) {
    const action = form.action ?? "";
    if (action && isOutside(action, page.path) && action !== WEB3FORMS)
      error(`${where}: a form sends to ${action}`);
  }

  // Fonts
  const fontPreloads = links
    .filter((l) => l.rel === "preload" && l.as === "font")
    .map((l) => l.href);
  const preloadsNastaliq = fontPreloads.some((h) => /nastaliq/i.test(h));
  if (page.locale === "en" && preloadsNastaliq)
    error(`${where}: English page preloads the Nastaliq font (195 KB it never uses)`);
  if ((page.locale === "ur" || page.locale === "skr") && !preloadsNastaliq)
    error(`${where}: Urdu/Saraiki page does not preload Nastaliq`);

  // Characters the fonts cannot show
  const chars = fontsFor[page.locale];
  const missing = new Set();
  for (const ch of visibleText(raw)) {
    const cp = ch.codePointAt(0);
    if (cp > 0x20 && cp !== 0xa0 && !chars.has(cp))
      missing.add(`${ch} U+${cp.toString(16).toUpperCase().padStart(4, "0")}`);
  }
  if (missing.size)
    error(`${where}: characters not in the page's fonts: ${[...missing].join(", ")}`);

  // Weight of the first view
  const stylesheets = links
    .filter((l) => l.rel === "stylesheet")
    .map((l) => fileFor(l.href, page.path));
  const cssBytes = stylesheets.reduce((n, f) => n + sentSize(f), 0);
  const fonts = new Set();
  for (const css of stylesheets) {
    const text = fs.readFileSync(css, "utf8");
    for (const face of text.match(/@font-face\{[^}]*\}/g) ?? []) {
      for (const m of face.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
        const font = fileFor(m[1], `/${path.relative(out, css).split(path.sep).join("/")}`);
        if (font && fs.existsSync(font)) fonts.add(font);
        else error(`${path.relative(out, css)}: font ${m[1]} is missing`);
      }
    }
  }
  const scripts = scriptsOf(html).map((s) => [s, fileFor(s, page.path)]);
  const jsBytes = scripts.reduce((n, [, f]) => n + sentSize(f), 0);
  const ownJsBytes = scripts
    .filter(([s]) => !frameworkJs.has(s))
    .reduce((n, [, f]) => n + sentSize(f), 0);
  const eagerImages = new Set([
    ...startTags(html, "img")
      .filter((i) => i.loading !== "lazy" && i.src)
      .map((i) => i.src),
    ...links.filter((l) => l.rel === "preload" && l.as === "image").map((l) => l.href),
  ]);
  const imageFiles = [...eagerImages]
    .map((h) => fileFor(h, page.path))
    .filter((f) => f && fs.existsSync(f));
  const fontBytes = [...fonts].reduce((n, f) => n + sentSize(f), 0);
  const imageBytes = imageFiles.reduce((n, f) => n + sentSize(f), 0);
  const htmlBytes = sentSize(file);
  const total = htmlBytes + cssBytes + jsBytes + fontBytes + imageBytes;
  const notCached =
    htmlBytes +
    imageFiles.filter((f) => !/[\\/](_next|img)[\\/]/.test(f)).reduce((n, f) => n + sentSize(f), 0);
  const budget = page.locale === "en" ? BUDGET.en : BUDGET.rtl;
  weights.push({ where, htmlBytes, cssBytes, jsBytes, fontBytes, imageBytes, total, budget });
  if (kb(total) > budget)
    error(`${where}: first view is ${kb(total)} KB, over the ${budget} KB budget`);
  if (kb(notCached) > BUDGET.repeat)
    error(`${where}: a repeat visit downloads ${kb(notCached)} KB, over ${BUDGET.repeat} KB`);
  if (kb(ownJsBytes) > BUDGET.ownJs)
    error(`${where}: our own JavaScript is ${kb(ownJsBytes)} KB, over ${BUDGET.ownJs} KB`);

  // The hero photo (fetchpriority="high"): its AVIF sizes up to 1080 px wide stay small.
  for (const picture of raw.match(/<picture\b[\s\S]*?<\/picture>/g) ?? []) {
    if (!/fetchpriority="high"/i.test(picture)) continue;
    for (const source of startTags(picture, "source").filter((s) => s.type === "image/avif")) {
      for (const candidate of source.srcset.split(",").map((c) => c.trim().split(/\s+/))) {
        const width = parseInt(candidate[1], 10);
        const f = fileFor(candidate[0], page.path);
        if (width <= 1080 && f && fs.existsSync(f) && kb(sentSize(f)) > BUDGET.heroAvif) {
          error(
            `${where}: hero image ${candidate[0]} is ${kb(sentSize(f))} KB, over ${BUDGET.heroAvif} KB`,
          );
        }
      }
    }
  }
}

// --- Sitemap and robots.txt --------------------------------------------------------------

const sitemapFile = path.join(out, "sitemap.xml");
if (!fs.existsSync(sitemapFile)) error("sitemap.xml is missing");
else {
  const xml = fs.readFileSync(sitemapFile, "utf8");
  const listed = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const indexed = expected.filter((p) => !p.noindex).map((p) => pageUrl(p.path));
  for (const url of indexed) if (!listed.includes(url)) error(`sitemap.xml does not list ${url}`);
  for (const url of listed) {
    if (!indexed.includes(url)) error(`sitemap.xml lists ${url}, which is not an indexed page`);
    if (listed.filter((u) => u === url).length > 1) error(`sitemap.xml lists ${url} twice`);
  }
  for (const m of xml.matchAll(/hreflang="([^"]+)"/g)) {
    if (!["en", "ur", "x-default"].includes(m[1]))
      error(`sitemap.xml uses hreflang="${m[1]}"; only en, ur and x-default are valid`);
  }
}
const robots = fs.existsSync(path.join(out, "robots.txt"))
  ? fs.readFileSync(path.join(out, "robots.txt"), "utf8")
  : "";
if (!robots.includes(`Sitemap: ${pageUrl("/sitemap.xml")}`))
  error("robots.txt does not point to the sitemap");

// --- Images: no location data ------------------------------------------------------------

let images = 0;
(function scan(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) scan(full);
    else if (/\.(jpe?g|png|webp|avif)$/i.test(e.name)) {
      images += 1;
      const problem = locationProblem(fs.readFileSync(full));
      if (problem) error(`out/${path.relative(out, full).split(path.sep).join("/")} ${problem}`);
    }
  }
})(out);

// --- Report ------------------------------------------------------------------------------

console.log(`check-site: ${expected.length + 1} pages, ${images} images`);
const pad = (s, n) => String(s).padStart(n);
console.log("  page                        HTML   CSS     JS  fonts images  total / budget (KB)");
// Every page is checked; the table shows a sample: home and About in each language, and 404.
const SHOWN = new Set(["/", "/ur/", "/skr/", "/about/", "/ur/about/", "/skr/about/", "/404.html"]);
for (const w of weights.filter((x) => SHOWN.has(x.where))) {
  console.log(
    `  ${w.where.padEnd(26)}${pad(kb(w.htmlBytes), 6)}${pad(kb(w.cssBytes), 6)}${pad(kb(w.jsBytes), 7)}${pad(kb(w.fontBytes), 7)}${pad(kb(w.imageBytes), 7)}${pad(kb(w.total), 7)} / ${w.budget}`,
  );
}
const heaviest = weights.reduce(
  (a, b) => (b.total / b.budget > a.total / a.budget ? b : a),
  weights[0],
);
console.log(
  `  (all ${weights.length} pages checked; closest to its budget: ${heaviest.where}, ${kb(heaviest.total)} of ${heaviest.budget} KB)`,
);
for (const line of errors) console.log(`  ✖ ${line}`);
console.log(`  ${errors.length} errors`);
process.exit(errors.length ? 1 : 0);
