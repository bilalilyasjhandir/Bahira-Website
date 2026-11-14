// Checks the site's text, styles and photos before every build.
// Errors stop the build. Warnings are listed and the build goes on, except with --release
// (pnpm build:release, for the live site), where unfinished work stops it too: a [[TODO]],
// a missing translation, or a translation Bilal has not reviewed yet.
//
//  1. Interface text (src/i18n): Urdu and Saraiki have exactly the English texts and
//     {placeholders}; their review status; whether they follow the current English.
//  2. Long text (content/{pages,causes,updates}/{en,ur,skr}/*.md): front matter, and core
//     pages present in all three languages.
//  3. Urdu and Saraiki writing: Arabic letters typed in place of Urdu ones, mixed Saraiki
//     spellings, English sentences left in, and characters the site's fonts cannot show.
//  4. [[TODO]] markers left in src/, content/ or data/.
//  5. CSS: logical properties only, never left or right.
//  6. Fonts: the unicode-range and size-adjust settings match src/fonts/coverage.json.
//  7. Photos in content/photos/: no location (GPS) data.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parse as parseYaml } from "yaml";
import { locationProblem } from "./lib/gps.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const release = process.argv.includes("--release");
const rel = (file) => path.relative(root, file).split(path.sep).join("/");

const errors = [];
const warnings = [];
const passed = [];
const unfinishedErrors = new Set();
const error = (message) => errors.push(message);
/** Unfinished work: a warning while building, an error for the live site. */
const unfinished = (message) => {
  if (!release) return warnings.push(message);
  unfinishedErrors.add(message);
  errors.push(message);
};
/** Reports a section as passed if it added no errors other than unfinished work. */
const pass = (mark, message) => {
  if (errors.slice(mark).every((e) => unfinishedErrors.has(e))) passed.push(message);
};

function walk(dir, keep) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "generated" ? [] : walk(full, keep);
    return keep(entry.name) ? [full] : [];
  });
}

const importTs = (file) => import(pathToFileURL(path.join(root, file)).href);

// --- 1. Interface text -------------------------------------------------------------------

const { en, revision } = await importTs("src/i18n/en.ts");
const translations = {
  ur: await importTs("src/i18n/ur.ts").then((m) => ({ text: m.ur, meta: m.translation })),
  skr: await importTs("src/i18n/skr.ts").then((m) => ({ text: m.skr, meta: m.translation })),
};
const { locales } = await importTs("src/i18n/config.ts");

function flatten(value, prefix = "", out = new Map()) {
  for (const [key, child] of Object.entries(value)) {
    const name = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object") flatten(child, name, out);
    else out.set(name, child);
  }
  return out;
}
const placeholders = (text) =>
  [...String(text).matchAll(/\{(\w+)\}/g)]
    .map((m) => m[1])
    .sort()
    .join(",");

const english = flatten(en);
/** Text to lint, per language: [where, text]. */
const corpus = { en: [...english].map(([k, v]) => [`src/i18n/en.ts ${k}`, v]), ur: [], skr: [] };

let mark = errors.length;
for (const [locale, { text, meta }] of Object.entries(translations)) {
  const file = `src/i18n/${locale}.ts`;
  const strings = flatten(text);
  const missing = [...english.keys()].filter((k) => !strings.has(k));
  const extra = [...strings.keys()].filter((k) => !english.has(k));
  if (missing.length) error(`${file}: missing ${missing.join(", ")}`);
  if (extra.length) error(`${file}: not in English: ${extra.join(", ")}`);
  for (const [key, value] of strings) {
    if (typeof value !== "string" || value.trim() === "") error(`${file}: ${key} is empty`);
    else if (english.has(key) && placeholders(value) !== placeholders(english.get(key))) {
      error(
        `${file}: ${key} must use the same {placeholders} as English (${placeholders(english.get(key)) || "none"})`,
      );
    }
    corpus[locale].push([`${file} ${key}`, value]);
  }
  if (meta?.status !== "reviewed") unfinished(`${file}: draft, not yet reviewed by Bilal`);
  if (!Number.isInteger(meta?.sourceRevision))
    error(`${file}: translation.sourceRevision must be a whole number`);
  else if (meta.sourceRevision < revision) {
    warnings.push(
      `${file}: made from English revision ${meta.sourceRevision}; English is now revision ${revision}`,
    );
  }
}
pass(mark, `Interface text: Urdu and Saraiki have all ${english.size} English texts`);

// --- 2. Long text ------------------------------------------------------------------------

const CORE = ["pages", "causes"]; // must exist in every language; updates may not
let contentFiles = 0;
mark = errors.length;
for (const collection of ["pages", "causes", "updates"]) {
  /** Front matter of every file in this collection, by language and then by slug. */
  const frontMatter = Object.fromEntries(locales.map((locale) => [locale, new Map()]));
  for (const locale of locales) {
    for (const file of walk(path.join(root, "content", collection, locale), (n) =>
      n.endsWith(".md"),
    )) {
      contentFiles += 1;
      const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(
        fs.readFileSync(file, "utf8"),
      );
      if (!match) {
        error(`${rel(file)}: front matter (between --- lines) is missing`);
        continue;
      }
      let data;
      try {
        data = parseYaml(match[1]) ?? {};
      } catch (e) {
        error(`${rel(file)}: front matter is not valid YAML (${e.message.split("\n")[0]})`);
        continue;
      }
      frontMatter[locale].set(path.basename(file, ".md"), data);
      if (locale === "en") {
        if (!Number.isInteger(data.revision) || data.revision < 1)
          error(`${rel(file)}: needs revision: 1 (or higher)`);
      } else {
        if (!["draft", "reviewed"].includes(data.status))
          error(`${rel(file)}: needs status: draft or reviewed`);
        else if (data.status !== "reviewed")
          unfinished(`${rel(file)}: draft, not yet reviewed by Bilal`);
        if (!Number.isInteger(data.sourceRevision))
          error(`${rel(file)}: needs sourceRevision (the English revision it follows)`);
      }
      corpus[locale].push([rel(file), match[2]]);
      for (const value of Object.values(data))
        if (typeof value === "string") corpus[locale].push([rel(file), value]);
    }
  }
  for (const locale of locales.filter((l) => l !== "en")) {
    for (const [slug, data] of frontMatter[locale]) {
      const file = `content/${collection}/${locale}/${slug}.md`;
      const original = frontMatter.en.get(slug);
      if (!original) {
        if (CORE.includes(collection)) error(`${file} has no English original`);
        continue;
      }
      if (
        Number.isInteger(original.revision) &&
        Number.isInteger(data.sourceRevision) &&
        data.sourceRevision < original.revision
      ) {
        warnings.push(
          `${file} follows English revision ${data.sourceRevision}; English is now ${original.revision}`,
        );
      }
    }
    if (CORE.includes(collection)) {
      for (const slug of frontMatter.en.keys()) {
        if (!frontMatter[locale].has(slug))
          unfinished(
            `content/${collection}/${locale}/${slug}.md is missing (there is an English version)`,
          );
      }
    }
  }
}
pass(
  mark,
  contentFiles
    ? `Long text: ${contentFiles} Markdown files in order`
    : "Long text: no Markdown content yet",
);

// --- 3. Urdu and Saraiki writing ---------------------------------------------------------

const ARABIC_ONLY = { ي: "ی", ك: "ک", ه: "ہ", ى: "ی", ة: "ہ or ت" };
const SARAIKI_ONLY = ["ٻ", "ڄ", "ݙ", "ڳ", "ݨ", "ڋ", "ڻ"];
const SARAIKI_PAIRS = [
  ["ݙ", "ڋ"],
  ["ݨ", "ڻ"],
];
const coverage = JSON.parse(fs.readFileSync(path.join(root, "src/fonts/coverage.json"), "utf8"));
const covered = (name) => new Set(coverage.files[name].codepoints);
const onestChars = covered("onest-latin.woff2");
const nastaliqChars = covered("nastaliq.woff2");
const labelChars = covered("nastaliq-labels.woff2");

/**
 * The text without what may rightly be in another script: Arabic quotations and English
 * marked with lang, <bdi> runs, web and email addresses, link targets and {placeholders}.
 */
const withoutForeign = (text) =>
  String(text)
    .replace(/<(span|bdi|i|q)\b[^>]*lang="(ar|en)"[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<bdi\b[^>]*>[\s\S]*?<\/bdi>/gi, " ")
    .replace(/https?:\/\/\S+|[\w.+-]+@[\w-]+\.[\w.]+/g, " ")
    .replace(/\]\([^)]*\)/g, "]")
    .replace(/\{\w+\}/g, " ");

mark = errors.length;
for (const locale of ["ur", "skr"]) {
  const all = corpus[locale];
  for (const [where, text] of all) {
    const clean = withoutForeign(text);
    for (const [letter, correct] of Object.entries(ARABIC_ONLY)) {
      if (clean.includes(letter))
        error(`${where}: Arabic "${letter}" where Urdu writes "${correct}"`);
    }
    if (locale === "ur") {
      const saraiki = SARAIKI_ONLY.filter((l) => clean.includes(l));
      if (saraiki.length)
        warnings.push(`${where}: Saraiki letter ${saraiki.join(" ")} in Urdu text`);
    }
    const english = clean.match(/[A-Za-z]{2,}(?:[\s,.'’-]+[A-Za-z]{2,}){2,}/g);
    if (english) warnings.push(`${where}: English words left in: "${english[0]}"`);
    for (const char of String(text)) {
      const cp = char.codePointAt(0);
      if (cp < 0x20 || nastaliqChars.has(cp) || onestChars.has(cp)) continue;
      error(
        `${where}: "${char}" (U+${cp.toString(16).toUpperCase().padStart(4, "0")}) is not in the site's fonts`,
      );
    }
  }
  if (locale === "skr") {
    const text = all.map(([, t]) => withoutForeign(t)).join(" ");
    for (const [a, b] of SARAIKI_PAIRS) {
      if (text.includes(a) && text.includes(b))
        error(`Saraiki text mixes ${a} and ${b}: choose one spelling`);
    }
  }
}
for (const [where, text] of corpus.en) {
  for (const char of String(text)) {
    const cp = char.codePointAt(0);
    if (cp >= 0x20 && !onestChars.has(cp) && !labelChars.has(cp)) {
      error(
        `${where}: "${char}" (U+${cp.toString(16).toUpperCase().padStart(4, "0")}) is not in Onest`,
      );
    }
  }
}
pass(mark, "Writing: Urdu letters, Saraiki spellings and font coverage are right");

// --- 4. [[TODO]] markers ----------------------------------------------------------------

const textFile = (n) => /\.(tsx?|css|md|ya?ml|json)$/.test(n);
let todos = 0;
for (const dir of ["src", "content", "data"]) {
  for (const file of walk(path.join(root, dir), textFile)) {
    fs.readFileSync(file, "utf8")
      .split(/\r?\n/)
      .forEach((line, i) => {
        if (line.includes("[[TODO")) {
          todos += 1;
          unfinished(`${rel(file)}:${i + 1}: ${line.trim().replace(/^.*?(\[\[TODO)/, "$1")}`);
        }
      });
  }
}
if (!todos) passed.push("No [[TODO]] markers left");

// --- 5. CSS: logical properties only -----------------------------------------------------

const PHYSICAL = [
  [
    /(?<![\w-])(?:margin|padding|border|inset|scroll-margin|scroll-padding)-(?:left|right)(?![\w-])/,
    "use -inline-start / -inline-end",
  ],
  [/(?<![\w-])(?:left|right)\s*:/, "use inset-inline-start / inset-inline-end"],
  [/text-align\s*:\s*(?:left|right)\b/, "use text-align: start / end"],
  [/(?:float|clear)\s*:\s*(?:left|right)\b/, "use inline-start / inline-end"],
  [/border-(?:top|bottom)-(?:left|right)-radius/, "use border-start-start-radius and the like"],
];
let cssFiles = 0;
mark = errors.length;
for (const file of walk(path.join(root, "src"), (n) => n.endsWith(".css"))) {
  cssFiles += 1;
  const css = fs
    .readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "));
  css.split("\n").forEach((line, i) => {
    for (const [re, fix] of PHYSICAL) {
      if (re.test(line))
        error(
          `${rel(file)}:${i + 1}: "${line.trim()}": left/right breaks Urdu and Saraiki pages; ${fix}`,
        );
    }
  });
}
pass(mark, `CSS: ${cssFiles} files use logical directions only`);

// --- 6. Fonts ----------------------------------------------------------------------------

const normaliseRange = (range) =>
  range
    .split(",")
    .map((part) =>
      part
        .trim()
        .toUpperCase()
        .replace(
          /U\+([0-9A-F]+)(?:-([0-9A-F]+))?/,
          (_, a, b) => `U+${a.padStart(4, "0")}${b ? `-${b.padStart(4, "0")}` : ""}`,
        ),
    )
    .join(",");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
/** Every value of a font setting in a file: a next/font declaration or a CSS descriptor. */
const settings = (file, prop) => {
  const source = read(file);
  const re = file.endsWith(".ts")
    ? new RegExp(`prop:\\s*"${prop}",\\s*value:\\s*"([^"]+)"`, "g")
    : new RegExp(`${prop}:\\s*([^;]+);`, "g");
  return [...source.matchAll(re)].map((m) => m[1]);
};
mark = errors.length;
const fontChecks = [
  ["src/fonts/onest.ts", "onest-latin.woff2", 1],
  ["src/fonts/nastaliq.ts", "nastaliq.woff2", 2], // the text face and the one-line-label face
  ["src/styles/nastaliq-404.css", "nastaliq.woff2", 1],
  ["src/styles/labels-font.css", "nastaliq-labels.woff2", 1],
];
for (const [file, font, faces] of fontChecks) {
  const ranges = settings(file, "unicode-range");
  if (ranges.length !== faces)
    error(`${file}: expected ${faces} unicode-range, found ${ranges.length}`);
  for (const range of ranges) {
    if (normaliseRange(range) !== normaliseRange(coverage.files[font].unicodeRange)) {
      error(
        `${file}: unicode-range differs from src/fonts/coverage.json (${font}); copy it from there`,
      );
    }
  }
}
const sizes = [
  "src/fonts/nastaliq.ts",
  "src/styles/nastaliq-404.css",
  "src/styles/labels-font.css",
].flatMap((file) => settings(file, "size-adjust").map((size) => `${file} ${size}`));
if (new Set(sizes.map((s) => s.split(" ")[1])).size !== 1) {
  error(`Nastaliq size-adjust differs: ${sizes.join(", ")}`);
}
// One-line Nastaliq labels are centred by the same ascent and descent everywhere.
const metrics = ["src/fonts/nastaliq.ts", "src/styles/labels-font.css"].map((file) =>
  ["ascent-override", "descent-override"].map((prop) => settings(file, prop).join()).join("/"),
);
if (metrics[0] !== metrics[1]) {
  error(`Nastaliq label metrics differ: nastaliq.ts ${metrics[0]}, labels-font.css ${metrics[1]}`);
}
pass(mark, "Fonts: settings match the font files");

// --- 7. Photos ---------------------------------------------------------------------------

const photos = walk(path.join(root, "content", "photos"), (n) =>
  /\.(jpe?g|png|webp|avif)$/i.test(n),
);
mark = errors.length;
for (const file of photos) {
  const problem = locationProblem(fs.readFileSync(file));
  if (problem)
    error(`${rel(file)} ${problem}. Remove it before committing (the crop step strips it).`);
}
pass(
  mark,
  photos.length
    ? `Photos: ${photos.length} in content/photos/, none with a location`
    : "Photos: none in content/photos/ yet",
);

// --- Report ------------------------------------------------------------------------------

console.log(`check-content${release ? " (release)" : ""}`);
for (const line of passed) console.log(`  ✓ ${line}`);
for (const line of warnings) console.log(`  ! ${line}`);
for (const line of errors) console.log(`  ✖ ${line}`);
console.log(`  ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
