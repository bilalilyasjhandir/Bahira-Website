// Makes review/index.html (git-ignored): every text of the site in English, Urdu and
// Saraiki side by side, for Bilal's review rounds (Phase 4). Run it with `pnpm review` and
// open the file in a browser.
//
// - Each text has a box for Bilal's correction or note. Notes stay in that browser until he
//   clears them. A note written for a text that has changed since is set aside, so a fixed
//   text never carries an old note.
// - "Copy my notes" puts every note and approval into one plain message for the chat.
// - Approval is per file and language, like `status` in the files: Bilal ticks, Claude sets
//   `status: reviewed`. A file already reviewed shows as such.
// - The sheet reads the same files as the site, with the site's Markdown reader, and stops
//   if a text is missing, so nothing can be left out of a round.
// - It is a separate file, not a page of the site, so it can never reach the live site.

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parse as parseYaml } from "yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const importTs = (file) => import(pathToFileURL(path.join(root, file)).href);
const outFile = path.join(root, "review", "index.html");

const { en, revision } = await importTs("src/i18n/en.ts");
const dictionaries = {
  ur: await importTs("src/i18n/ur.ts").then((m) => ({ text: m.ur, meta: m.translation })),
  skr: await importTs("src/i18n/skr.ts").then((m) => ({ text: m.skr, meta: m.translation })),
};
const { parseMarkdown } = await importTs("src/lib/markdown.ts");
const { org } = await importTs("src/lib/org.ts");

const LANGS = ["ur", "skr"];
const LANG_NAME = { en: "English", ur: "Urdu", skr: "Saraiki" };

// --- Reading the texts ---------------------------------------------------------------------

const hash = (...parts) =>
  createHash("sha256").update(parts.join("\u0000")).digest("hex").slice(0, 10);

const escape = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/** What a {placeholder} stands for, shown as a grey box. */
function chip(name, lang) {
  const value = {
    email: org.contact.email,
    founder: lang === "en" ? org.organisation.founder.name : org.organisation.founder.nameUrdu,
    postcode: org.organisation.postcode,
  }[name];
  if (name === "arabic")
    return `<span class="chip" lang="ar" dir="rtl">${escape(org.organisation.nameArabic)}</span>`;
  const label = value ?? `${name === "founded" ? "founding date" : name}`;
  return `<span class="chip" title="Filled in by the site: {${escape(name)}}"><bdi>${escape(label)}</bdi></span>`;
}

/** A short text with {placeholders} (the interface strings). */
const line = (text, lang) => escape(text).replace(/\{(\w+)\}/g, (_, name) => chip(name, lang));

function inline(parts, lang) {
  return parts
    .map((p) => {
      if (p.type === "fact") return chip(p.name, lang);
      if (p.type === "link")
        return `<span class="link" title="${escape(p.href)}">${escape(p.text)}</span>`;
      return escape(p.text);
    })
    .join("");
}

/** Markdown blocks, read with the site's own reader. */
function blocks(source, where, lang) {
  return parseMarkdown(source, where)
    .map((b) => {
      if (b.type === "heading") return `<h5>${inline(b.content, lang)}</h5>`;
      if (b.type === "paragraph") return `<p>${inline(b.content, lang)}</p>`;
      const tag = b.ordered ? "ol" : "ul";
      return `<${tag}>${b.items.map((i) => `<li>${inline(i, lang)}</li>`).join("")}</${tag}>`;
    })
    .join("");
}

const SECTION_LINE = /^## (.+?) \{#([a-z0-9]+(?:-[a-z0-9]+)*)\}[^\S\n]*$/;

/** A content file: its front matter, and its text split into the opening and ## sections. */
function readContent(file) {
  if (!fs.existsSync(file)) return null;
  const source = fs.readFileSync(file, "utf8").replace(/\r\n?/g, "\n");
  const match = /^---\n([\s\S]*?)\n---[^\S\n]*(?:\n|$)([\s\S]*)$/.exec(source);
  if (!match) throw new Error(`${file}: front matter (between --- lines) is missing`);
  const data = parseYaml(match[1]) ?? {};
  const sections = [{ key: "opening", heading: null, lines: [] }];
  for (const l of match[2].split("\n")) {
    const s = SECTION_LINE.exec(l);
    if (s) sections.push({ key: s[2], heading: s[1], lines: [] });
    else sections.at(-1).lines.push(l);
  }
  return {
    data,
    sections: sections
      .map((s) => ({ ...s, body: s.lines.join("\n").trim() }))
      .filter((s) => s.heading !== null || s.body !== ""),
  };
}

// --- The interface strings, grouped by where they appear ----------------------------------

const GROUPS = [
  [
    "Every page: menus, footer, and labels for screen readers",
    ["site", "a11y", "nav", "footer", "common"],
  ],
  ["Home page", ["pages.home", "home", "causes"]],
  ["Need help?", ["pages.help", "helpPage", "helplines"]],
  ["The forms (help, contact, volunteer, donation report)", ["forms"]],
  ["Contact", ["pages.contact", "contactPage"]],
  ["Thank you (after a form is sent)", ["pages.thanks", "thanksPage"]],
  ["Page not found", ["notFound"]],
  ["About us", ["pages.about", "aboutPage"]],
  ["Our work", ["pages.work", "workPage", "causePage"]],
  ["Updates", ["pages.updates", "updatesPage"]],
  ["Get involved", ["pages.getInvolved", "getInvolvedPage"]],
  ["Donate", ["pages.donate", "donatePage"]],
  ["Accountability", ["pages.accountability"]],
  ["Privacy", ["pages.privacy"]],
];

function flatten(value, prefix = "") {
  if (typeof value === "string") return [[prefix, value]];
  return Object.entries(value).flatMap(([k, v]) => flatten(v, prefix ? `${prefix}.${k}` : k));
}

/** What a string is, when that is not obvious from where it sits. */
function describe(key) {
  if (key === "site.tagline") return "The tagline";
  if (/^pages\.\w+\.title$/.test(key)) return "Page title: browser tab and Google";
  if (/^(pages\.\w+|site)\.description$/.test(key))
    return "Shown in Google results and in WhatsApp and Facebook link previews";
  // The menu's label is also the button people see on phones.
  if (key === "a11y.menu") return "The menu button on phones (also read aloud)";
  if (key === "helpPage.callLabel")
    return "Read aloud for blind visitors on each helpline's number; {name} is the helpline";
  if (key.startsWith("a11y.")) return "Read aloud for blind visitors";
  if (/(Alt|photoAlt)$/.test(key)) return "Photo description, read aloud for blind visitors";
  if (key.startsWith("forms.errors.")) return "Error message when a field is wrong";
  if (/Hint$/.test(key)) return "Small help text under a form field";
  if (key.startsWith("nav.")) return "Menu link";
  if (key === "forms.trap") return "Hidden spam trap; only screen readers say it";
  return "";
}

function interfaceUnit() {
  const english = flatten(en);
  const texts = Object.fromEntries(
    LANGS.map((lang) => [lang, new Map(flatten(dictionaries[lang].text))]),
  );
  const placed = new Set();
  const groups = GROUPS.map(([title, prefixes]) => {
    const rows = english
      .filter(
        ([key]) => !placed.has(key) && prefixes.some((p) => key === p || key.startsWith(`${p}.`)),
      )
      .map(([key, value]) => {
        placed.add(key);
        const row = { id: key, label: describe(key), en: line(value, "en"), hash: {} };
        for (const lang of LANGS) {
          const t = texts[lang].get(key);
          if (t === undefined) throw new Error(`src/i18n/${lang}.ts has no text for ${key}`);
          row[lang] = line(t, lang);
          row.hash[lang] = hash(value, t);
        }
        return row;
      });
    return { title, rows };
  });
  const left = english.filter(([key]) => !placed.has(key)).map(([key]) => key);
  if (left.length) throw new Error(`review-sheet: put these in a group: ${left.join(", ")}`);
  return {
    id: "interface",
    title: "All the short texts",
    where: "src/i18n/ur.ts and skr.ts: menus, buttons, the Home page, form labels",
    note: "One approval covers all of these, at the end of this part.",
    groups,
    status: Object.fromEntries(LANGS.map((l) => [l, dictionaries[l].meta.status])),
    stale: Object.fromEntries(
      LANGS.map((l) => [l, dictionaries[l].meta.sourceRevision < revision]),
    ),
  };
}

// --- The long texts (content/) -------------------------------------------------------------

const PAGE_TITLES = {
  "pages/help": "Need help?",
  "pages/about": "About us",
  "pages/get-involved": "Get involved",
  "pages/donate": "Donate, while donations are closed (shown now)",
  "pages/donate-open": "Donate, once donations open (not shown yet)",
  "pages/accountability": "Accountability",
  "pages/privacy": "Privacy",
  "causes/people-in-need": "Help for people in need (its own page under Our work)",
};
const FIELD_LABEL = {
  title: "Title",
  place: "Place",
  summary: "Summary: on the list of updates, and in link previews",
  coverAlt: "Main photo's description, read aloud for blind visitors",
  photoAlt: "Photo's description, read aloud for blind visitors",
};

function contentUnit(id) {
  const [collection, slug] = id.split("/");
  const fileOf = (lang) => path.join(root, "content", collection, lang, `${slug}.md`);
  const source = readContent(fileOf("en"));
  if (!source) throw new Error(`content/${id}.md is missing in English`);
  const trans = Object.fromEntries(LANGS.map((l) => [l, readContent(fileOf(l))]));
  const rows = [];
  const add = (rowId, label, enHtml, enRaw, get) => {
    const row = { id: rowId, label, en: enHtml, hash: {} };
    for (const lang of LANGS) {
      const got = trans[lang] ? get(trans[lang], lang) : null;
      row[lang] = got ? got.html : null;
      row.hash[lang] = hash(enRaw, got?.raw ?? "");
    }
    rows.push(row);
  };

  for (const field of ["title", "place", "summary", "coverAlt", "photoAlt"]) {
    const value = source.data[field];
    if (typeof value !== "string") continue;
    add(`${id}@${field}`, FIELD_LABEL[field], line(value, "en"), value, (t, lang) =>
      typeof t.data[field] === "string"
        ? { html: line(t.data[field], lang), raw: t.data[field] }
        : null,
    );
  }
  for (const [i, p] of (source.data.photos ?? []).entries()) {
    const name = path.basename(p.photo);
    add(
      `${id}@photo:${name}`,
      `Description of photo ${i + 2} (${name}), read aloud for blind visitors`,
      line(p.alt, "en"),
      p.alt,
      (t, lang) => {
        const match =
          (t.data.photos ?? []).find((q) => q.photo === p.photo) ?? (t.data.photos ?? [])[i];
        return match?.alt ? { html: line(match.alt, lang), raw: match.alt } : null;
      },
    );
  }
  for (const section of source.sections) {
    const label = section.heading ?? (collection === "updates" ? "The story" : "Opening paragraph");
    const render = (s, lang, file) =>
      (s.heading ? `<h4>${line(s.heading, lang)}</h4>` : "") + blocks(s.body, file, lang);
    add(
      `${id}#${section.key}`,
      label,
      render(section, "en", `content/${collection}/en/${slug}.md`),
      `${section.heading ?? ""}\n${section.body}`,
      (t, lang) => {
        const s = t.sections.find((x) => x.key === section.key);
        return s
          ? {
              html: render(s, lang, `content/${collection}/${lang}/${slug}.md`),
              raw: `${s.heading ?? ""}\n${s.body}`,
            }
          : null;
      },
    );
  }

  const status = {};
  const stale = {};
  for (const lang of LANGS) {
    status[lang] = trans[lang] ? (trans[lang].data.status ?? "draft") : "missing";
    stale[lang] = Boolean(trans[lang]) && trans[lang].data.sourceRevision < source.data.revision;
  }
  return {
    id,
    title: PAGE_TITLES[id] ?? source.data.title ?? slug,
    where: `content/${collection}/{ur,skr}/${slug}.md`,
    groups: [{ title: null, rows }],
    status,
    stale,
  };
}

const slugs = (collection) =>
  fs
    .readdirSync(path.join(root, "content", collection, "en"))
    .filter((f) => f.endsWith(".md"))
    .map((f) => `${collection}/${f.slice(0, -3)}`)
    .sort();

// --- The rounds ----------------------------------------------------------------------------

const updates = slugs("updates");
const ROUNDS = [
  {
    title: "Round 1: words to settle, all the short texts, and Need help?",
    units: ["words", "interface", "pages/help"],
  },
  {
    title: "Round 2: About, Get involved, our work and the updates",
    units: ["pages/about", "pages/get-involved", ...slugs("causes"), ...updates],
  },
  {
    title: "Round 3: Donate, Accountability and Privacy",
    units: ["pages/donate", "pages/donate-open", "pages/accountability", "pages/privacy"],
  },
];
// Any long text not named above goes in a last round, so none can be missed.
const named = new Set(ROUNDS.flatMap((r) => r.units));
const others = [...slugs("pages"), ...slugs("causes"), ...updates].filter((u) => !named.has(u));
if (others.length) ROUNDS.push({ title: "Other texts", units: others });

// The decisions of round 1 (docs/content-checklist.md, section 7).
const WORDS = [
  {
    id: "words.intersex",
    title: "The word for “intersex”",
    body: `<p>The drafts use <span lang="ur" dir="rtl">انٹرسیکس</span>, the English word, as rights groups and the news write it: <span lang="ur" dir="rtl">انٹرسیکس افراد</span> in Urdu, <span lang="skr" dir="rtl">انٹرسیکس لوک</span> in Saraiki. The traditional word is <span lang="ur" dir="rtl">خنثیٰ</span>, used in religious and legal writing. Which should the site use? Both on first mention, <span lang="ur" dir="rtl">انٹرسیکس (خنثیٰ)</span>, is also possible.</p>`,
  },
  {
    id: "words.tagline",
    title: "The tagline, “Just doing the human thing.”",
    body: `<p>Urdu draft: <span lang="ur" dir="rtl">بس انسانیت نبھا رہے ہیں۔</span> Saraiki draft: <span lang="skr" dir="rtl">بس انسانیت نبھیندے پئے ہیں۔</span> Keep them, or write your own.</p>`,
  },
  {
    id: "words.letters",
    title: "Two Saraiki letters",
    body: `<p>The Saraiki drafts write <span class="big" lang="skr" dir="rtl">ݙ</span> and <span class="big" lang="skr" dir="rtl">ݨ</span>. Some Saraiki writing uses <span class="big" lang="skr" dir="rtl">ڋ</span> and <span class="big" lang="skr" dir="rtl">ڻ</span> for the same sounds. Now: <span lang="skr" dir="rtl">ساݙا کم، ݙیوو، رضاکار بݨو</span>. The other way: <span lang="skr" dir="rtl">ساڋا کم، ڋیوو، رضاکار بڻو</span>. Which one?</p>`,
  },
  {
    id: "words.digits",
    title: "Digits on Urdu and Saraiki pages",
    body: `<p>The site writes 0–9, as phones and payment apps do: <span lang="ur" dir="rtl">ریسکیو 1122، 10 دسمبر 2025</span>. Urdu digits would look like this: <span lang="ur" dir="rtl">ریسکیو ۱۱۲۲، ۱۰ دسمبر ۲۰۲۵</span>. Phone numbers and amounts people type stay 0–9 either way. Which one?</p>`,
  },
  {
    // Found by the proofread of 15 Nov 2026: both forms are in the drafts.
    id: "words.tell",
    title: "Saraiki: “to tell”",
    body: `<p>The Saraiki drafts use two forms. Mostly <span lang="skr" dir="rtl">ݙساوݨ</span>: <span lang="skr" dir="rtl">ساکوں ݙساؤ، ݙساوݨ چاہو، ݙسائے بغیر، اساں ݙسیسوں</span>. In three places <span lang="skr" dir="rtl">ݙسݨ</span>: <span lang="skr" dir="rtl">اوہو ݙسݨا، کھل کے ݙسݨا چاہیدا اے، اساں تہاکوں کتھاں ݙسوں</span>. Both Saraiki proofreaders suggest <span lang="skr" dir="rtl">ݙساوݨ</span> everywhere, because the site also uses <span lang="skr" dir="rtl">ݙسدے</span> for “to look, to seem” (<span lang="skr" dir="rtl">لوک بے وس ݙسدے ہوون</span>), so <span lang="skr" dir="rtl">ݙسݨا</span> can be misread. Which is right in Bahawalpur?</p>`,
  },
  {
    // Found by the second proofread (15 Nov 2026): two readers found سرورق bookish.
    id: "words.home",
    title: "“Home page” in Urdu and Saraiki",
    body: `<p>The drafts say <span lang="ur" dir="rtl">سرورق</span>: on the links back to the Home page (<span lang="ur" dir="rtl">سرورق پر جائیں</span>) and in the logo's label for blind visitors. It is correct, but to many readers it means the cover of a book or a magazine. The plainer <span lang="ur" dir="rtl">ہوم پیج</span> is the English word most phone users know. Which one?</p>`,
  },
  {
    // Found by the second proofread (15 Nov 2026); the build cannot check a missing implosive.
    id: "words.sit",
    title: "Saraiki: “to sit”",
    body: `<p>The drafts wrote “sit” the Urdu way, <span lang="skr" dir="rtl">بیٹھا</span>, in eleven places (photo descriptions and the APS story). Saraiki <span lang="skr" dir="rtl">ٻہݨ</span> starts with the same <span class="big" lang="skr" dir="rtl">ٻ</span> as <span lang="skr" dir="rtl">ٻال</span>, so they now read <span lang="skr" dir="rtl">ٻیٹھے، ٻیٹھا، ٻہہ کے</span>: <span lang="skr" dir="rtl">دیگچیاں کول ٻیٹھے، رل کے ٻہہ کے</span>. Is that how Bahawalpur says it, or with a plain <span class="big" lang="skr" dir="rtl">ب</span>?</p>`,
  },
];

const units = new Map();
const unitFor = (id) => {
  if (!units.has(id)) units.set(id, id === "interface" ? interfaceUnit() : contentUnit(id));
  return units.get(id);
};

// --- The page ------------------------------------------------------------------------------

const font = (file) => fs.readFileSync(path.join(root, file)).toString("base64");
const nastaliq = font("brand/fonts/NotoNastaliqUrdu/NotoNastaliqUrdu[wght].woff2");
const onest = font("brand/fonts/Onest/Onest[wght].woff2");

function statusBadge(unit, lang) {
  const s = unit.status[lang];
  if (s === "missing")
    return `<span class="badge missing">${LANG_NAME[lang]}: not translated</span>`;
  const extra = unit.stale[lang] ? " (English has changed since)" : "";
  return s === "reviewed"
    ? `<span class="badge ok">${LANG_NAME[lang]}: reviewed${extra}</span>`
    : `<span class="badge">${LANG_NAME[lang]}: draft${extra}</span>`;
}

function rowHtml(row) {
  const cell = (lang) => {
    const dir = lang === "en" ? "ltr" : "rtl";
    if (row[lang] === null) return `<div class="cell ${lang} absent">Not translated</div>`;
    const box =
      lang === "en"
        ? ""
        : `<textarea class="note" rows="1" dir="auto" placeholder="Fix or note (${LANG_NAME[lang]})" aria-label="Note on the ${LANG_NAME[lang]} text, ${escape(row.id)}" data-row="${escape(row.id)}" data-lang="${lang}" data-hash="${row.hash[lang]}"></textarea><p class="old" hidden></p>`;
    return `<div class="cell ${lang}"><div class="text" lang="${lang}" dir="${dir}">${row[lang]}</div>${box}</div>`;
  };
  return `<div class="row" id="${escape(row.id)}"><div class="meta"><code>${escape(row.id)}</code>${row.label ? ` <span>${escape(row.label)}</span>` : ""}</div>${cell("en")}${cell("ur")}${cell("skr")}</div>`;
}

function unitHtml(id) {
  if (id === "words") {
    return `<section class="unit" id="words" data-unit="words"><header><h3>Words to settle</h3><p class="where">Your answers decide how these are written everywhere on the site.</p></header>${WORDS.map(
      (w) =>
        `<div class="word" id="${w.id}"><h4>${w.title}</h4>${w.body}<textarea class="answer" rows="2" dir="auto" placeholder="Your answer" aria-label="Your answer: ${escape(w.title)}" data-word="${w.id}" data-title="${escape(w.title)}"></textarea></div>`,
    ).join("")}</section>`;
  }
  const unit = unitFor(id);
  const unitHash = Object.fromEntries(
    LANGS.map((l) => [l, hash(...unit.groups.flatMap((g) => g.rows.map((r) => r.hash[l])))]),
  );
  const approvals = LANGS.map((lang) => {
    if (unit.status[lang] === "missing") return "";
    if (unit.status[lang] === "reviewed" && !unit.stale[lang])
      return `<p class="done">${LANG_NAME[lang]}: already reviewed</p>`;
    return `<label class="approve"><input type="checkbox" data-unit="${escape(id)}" data-lang="${lang}" data-hash="${unitHash[lang]}" data-title="${escape(unit.title)}"> ${LANG_NAME[lang]} is right${id === "interface" ? " (all the short texts)" : ""}</label>`;
  }).join("");
  return `<section class="unit" id="${escape(id)}" data-unit="${escape(id)}" data-title="${escape(unit.title)}"><header><h3>${escape(unit.title)}</h3><p class="where">${escape(unit.where)}</p><p class="badges">${LANGS.map((l) => statusBadge(unit, l)).join(" ")}</p>${unit.note ? `<p class="where">${escape(unit.note)}</p>` : ""}</header><div class="heads" aria-hidden="true"><span></span><span>English</span><span>اردو</span><span>سرائیکی</span></div>${unit.groups
    .map(
      (g) =>
        (g.title ? `<h4 class="group">${escape(g.title)}</h4>` : "") + g.rows.map(rowHtml).join(""),
    )
    .join("")}<footer class="approvals">${approvals}</footer></section>`;
}

const made = new Date();
const madeLabel = made.toLocaleString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const body = ROUNDS.map(
  (round, i) =>
    `<section class="round" id="round-${i + 1}"><h2>${escape(round.title)}</h2>${round.units.map(unitHtml).join("")}</section>`,
).join("");
const contents = ROUNDS.map(
  (round, i) =>
    `<li><a href="#round-${i + 1}">${escape(round.title)}</a><ul>${round.units
      .map(
        (u) =>
          `<li><a href="#${escape(u)}">${escape(u === "words" ? "Words to settle" : unitFor(u).title)}</a></li>`,
      )
      .join("")}</ul></li>`,
).join("");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bahira text review</title>
<style>
@font-face { font-family: "Onest"; src: url(data:font/woff2;base64,${onest}) format("woff2"); font-weight: 100 900; }
@font-face { font-family: "Nastaliq"; src: url(data:font/woff2;base64,${nastaliq}) format("woff2"); size-adjust: 118%;
  unicode-range: U+0020, U+00A0, U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF, U+200C-200F; }
:root { --blue: #084F97; --deep: #00316B; --ink: #132030; --sky: #E8F1FC; --paper: #F6F5F3; --line: #D5D9DF; --grey: #5B6573; --green: #1E6B3A; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--paper); color: var(--ink); font: 16px/1.55 "Onest", system-ui, sans-serif; }
main { max-width: 1440px; margin: 0 auto; padding: 24px 16px 120px; }
h1 { font-size: 32px; line-height: 1.2; color: var(--blue); margin: 0 0 8px; }
h2 { font-size: 26px; color: var(--deep); margin: 56px 0 8px; padding-top: 16px; border-top: 3px solid var(--deep); }
h3 { font-size: 21px; color: var(--blue); margin: 0; }
h4.group { font-size: 15px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--grey); margin: 28px 0 4px; }
.intro { max-width: 760px; }
.intro ol { padding-inline-start: 20px; }
.contents { columns: 2 320px; font-size: 15px; }
.contents > li { break-inside: avoid; margin-bottom: 8px; }
a { color: var(--blue); }
.unit { margin: 32px 0; padding: 20px 0 8px; border-top: 1px solid var(--line); }
.unit header { margin-bottom: 8px; }
.where { color: var(--grey); font-size: 14px; margin: 2px 0; }
.badge { display: inline-block; font-size: 13px; padding: 2px 8px; border: 1px solid var(--line); border-radius: 4px; background: #fff; }
.badge.ok { border-color: var(--green); color: var(--green); }
.badge.missing { color: var(--grey); }
.heads, .row { display: grid; grid-template-columns: 1fr; gap: 8px 24px; }
.heads { display: none; }
.row { padding: 14px 0; border-bottom: 1px solid var(--line); }
.meta { font-size: 13px; color: var(--grey); }
.meta code { color: var(--ink); background: #fff; border: 1px solid var(--line); border-radius: 3px; padding: 0 4px; font-size: 12px; }
.text p, .text ul, .text ol, .text h4, .text h5 { margin: 0 0 8px; }
.text h4 { font-size: 17px; color: var(--blue); }
.text h5 { font-size: 16px; }
.text ul, .text ol { padding-inline-start: 22px; }
[lang="ur"], [lang="skr"] { font-family: "Nastaliq", "Onest", sans-serif; line-height: 2.35; font-size: 17px; font-synthesis: none; }
.text[lang="ur"] h4, .text[lang="skr"] h4 { line-height: 2; font-weight: 400; }
.text[lang="ur"] h5, .text[lang="skr"] h5 { font-weight: 400; color: var(--blue); }
.cell.en .text { font-size: 16px; }
.absent { color: var(--grey); font-style: italic; }
.chip { display: inline-block; font-family: "Onest", "Nastaliq", sans-serif; font-size: 13px; line-height: 1.5; padding: 0 6px; margin: 0 2px; border-radius: 3px; background: #E3E6EA; color: var(--ink); vertical-align: 0.1em; }
.chip[lang="ar"] { font-family: system-ui, sans-serif; font-size: 15px; }
.link { text-decoration: underline; text-underline-offset: 0.3em; color: var(--blue); }
.note, .answer { display: block; width: 100%; margin-top: 6px; padding: 6px 8px; border: 1px solid var(--line); border-radius: 4px; background: #fff; color: var(--ink); font: 15px/1.6 "Onest", "Nastaliq", sans-serif; resize: vertical; }
.note:focus, .answer:focus { outline: 2px solid var(--blue); outline-offset: 1px; }
.note.has, .answer.has { border-color: var(--blue); background: var(--sky); }
.big { font-size: 30px; line-height: 1; padding: 0 4px; }
.old { font-size: 13px; color: var(--grey); margin: 4px 0 0; }
.word { padding: 12px 0 16px; border-bottom: 1px solid var(--line); max-width: 900px; }
.word h4 { margin: 0 0 4px; font-size: 17px; }
.word p { margin: 0; }
.approvals { display: flex; flex-wrap: wrap; gap: 12px 32px; padding: 16px 0; }
.approve { display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer; }
.approve input { width: 20px; height: 20px; }
.done { color: var(--green); font-weight: 600; margin: 0; }
.bar { position: fixed; inset-inline: 0; bottom: 0; background: var(--deep); color: #fff; padding: 10px 16px; display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; justify-content: flex-end; }
.bar span { margin-inline-end: auto; }
.bar button { font: 600 15px "Onest", sans-serif; padding: 8px 16px; border: 0; border-radius: 4px; cursor: pointer; background: #fff; color: var(--deep); }
.bar button.quiet { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.6); }
dialog { width: min(760px, calc(100vw - 32px)); border: 0; border-radius: 6px; padding: 20px; }
dialog button { font: 600 15px "Onest", sans-serif; padding: 8px 16px; border: 0; border-radius: 4px; cursor: pointer; background: var(--deep); color: #fff; }
dialog textarea { width: 100%; height: 50vh; font: 14px/1.6 "Onest", "Nastaliq", monospace; }
@media (min-width: 900px) {
  .heads, .row { grid-template-columns: 160px 1fr 1fr 1fr; }
  .heads { display: grid; position: sticky; top: 0; background: var(--paper); padding: 6px 0; border-bottom: 1px solid var(--line); font-weight: 600; z-index: 1; }
  .heads span:nth-child(n+3) { font-family: "Nastaliq", sans-serif; font-weight: 400; text-align: end; }
  .meta { word-break: break-word; }
}
</style>
</head>
<body>
<main>
<h1>Bahira text review</h1>
<p class="where">Made ${escape(madeLabel)} from the site's own files. English revision ${revision}.</p>
<div class="intro">
<ol>
<li>Read each row: English, then Urdu and Saraiki. Grey boxes are filled in by the site (the email, a date, a name), so leave them as they are.</li>
<li>If something is wrong or sounds unnatural, write the fix in the box under it, in Urdu or English, whichever is easier.</li>
<li>At the end of each part, tick “Urdu is right” and “Saraiki is right” when they are, or will be once your fixes are made.</li>
<li>Press <b>Copy my notes</b> at the bottom and paste them into the chat. You can send notes as often as you like; they stay in this browser until you clear them.</li>
</ol>
</div>
<h2 id="contents">Contents</h2>
<ul class="contents">${contents}</ul>
${body}
</main>
<div class="bar" role="region" aria-label="Your notes">
<span id="count">No notes yet</span>
<button type="button" class="quiet" id="clear">Clear notes</button>
<button type="button" id="copy">Copy my notes</button>
</div>
<dialog id="out"><p><b id="out-title">Your notes</b></p><textarea id="out-text" readonly></textarea><p><button type="button" id="out-close">Close</button></p></dialog>
<script>
(() => {
  const KEY = "bahira-review";
  let store = { notes: {}, approved: {}, words: {} };
  try { store = Object.assign(store, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch {} };
  const notes = [...document.querySelectorAll("textarea.note")];
  const answers = [...document.querySelectorAll("textarea.answer")];
  const ticks = [...document.querySelectorAll(".approve input")];
  const grow = (t) => { t.style.height = "auto"; t.style.height = t.scrollHeight + 2 + "px"; };

  for (const t of notes) {
    const id = t.dataset.row + "|" + t.dataset.lang;
    const saved = store.notes[id];
    if (saved && saved.hash === t.dataset.hash) t.value = saved.text;
    else if (saved && saved.text) {
      const old = t.nextElementSibling;
      old.hidden = false;
      old.textContent = "Your earlier note (the text has changed since): " + saved.text;
    }
    t.classList.toggle("has", t.value.trim() !== "");
    t.addEventListener("input", () => {
      store.notes[id] = { text: t.value, hash: t.dataset.hash };
      t.classList.toggle("has", t.value.trim() !== "");
      grow(t); save(); count();
    });
  }
  for (const t of answers) {
    t.value = store.words[t.dataset.word] || "";
    t.classList.toggle("has", t.value.trim() !== "");
    t.addEventListener("input", () => {
      store.words[t.dataset.word] = t.value;
      t.classList.toggle("has", t.value.trim() !== "");
      save(); count();
    });
  }
  for (const c of ticks) {
    const id = c.dataset.unit + "|" + c.dataset.lang;
    c.checked = store.approved[id] === c.dataset.hash;
    c.addEventListener("change", () => {
      if (c.checked) store.approved[id] = c.dataset.hash; else delete store.approved[id];
      save(); count();
    });
  }
  requestAnimationFrame(() => [...notes, ...answers].forEach((t) => t.value && grow(t)));

  function count() {
    const n = notes.filter((t) => t.value.trim()).length + answers.filter((t) => t.value.trim()).length;
    const a = ticks.filter((c) => c.checked).length;
    document.getElementById("count").textContent =
      (n ? n + (n === 1 ? " note" : " notes") : "No notes yet") + (a ? ", " + a + " approved" : "");
  }
  count();

  function message() {
    const lines = [${JSON.stringify(`Bahira review notes (sheet made ${madeLabel})`)}];
    const words = answers.filter((t) => t.value.trim());
    if (words.length) {
      lines.push("", "WORDS TO SETTLE");
      for (const t of words) lines.push("- " + t.dataset.title + ": " + t.value.trim());
    }
    for (const unit of document.querySelectorAll("section.unit[data-title]")) {
      const unitNotes = [...unit.querySelectorAll("textarea.note")].filter((t) => t.value.trim());
      const ok = [...unit.querySelectorAll(".approve input")].filter((c) => c.checked);
      if (!unitNotes.length && !ok.length) continue;
      lines.push("", unit.dataset.title.toUpperCase() + " [" + unit.dataset.unit + "]");
      for (const t of unitNotes)
        lines.push("- " + t.dataset.row + ", " + (t.dataset.lang === "ur" ? "Urdu" : "Saraiki") + ": " + t.value.trim().replace(/\\n+/g, " / "));
      for (const c of ok)
        lines.push("Approved: " + (c.dataset.lang === "ur" ? "Urdu" : "Saraiki") + " (version " + c.dataset.hash + ")");
    }
    return lines.length > 1 ? lines.join("\\n") : "";
  }

  const dialog = document.getElementById("out");
  document.getElementById("copy").addEventListener("click", async () => {
    const text = message();
    const title = document.getElementById("out-title");
    const box = document.getElementById("out-text");
    if (!text) { title.textContent = "There are no notes or approvals yet."; box.value = ""; dialog.showModal(); return; }
    box.value = text;
    try { await navigator.clipboard.writeText(text); title.textContent = "Copied. Paste it into the chat with Claude."; }
    catch { title.textContent = "Select all of this (Ctrl+A), copy it (Ctrl+C) and paste it into the chat."; }
    dialog.showModal();
    box.focus(); box.select();
  });
  document.getElementById("out-close").addEventListener("click", () => dialog.close());
  document.getElementById("clear").addEventListener("click", () => {
    if (!confirm("Clear all your notes, answers and ticks in this sheet?")) return;
    store = { notes: {}, approved: {}, words: {} };
    save();
    location.reload();
  });
})();
</script>
</body>
</html>
`;

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, html);
const rowCount = [...units.values()].reduce(
  (n, u) => n + u.groups.reduce((m, g) => m + g.rows.length, 0),
  0,
);
console.log(
  `review-sheet: ${rowCount} texts in ${units.size} parts, plus ${WORDS.length} words to settle\n  ${outFile}`,
);
