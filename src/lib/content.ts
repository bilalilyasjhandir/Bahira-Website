// Reads the long texts in content/ and checks them. Server only: it reads the file system
// while the site is built.
//
//   content/updates/<language>/<slug>.md   dated posts about Bahira's work (/updates/<slug>/)
//   content/causes/<language>/<slug>.md    a cause's own page (/work/<slug>/)
//   content/pages/<language>/<page>.md     the long text of a fixed page (About, Privacy…)
//
// Facts (dates, photos, which cause an update belongs to) are written once, in the English
// file; the Urdu and Saraiki files hold only their own words. A text that has no version in
// the reader's language is shown in English and marked as English (lang="en").
//
// Page and cause texts are split into sections by "## Heading {#key}" lines. The key is the
// same in every language, so each page's design can place each section; check-content stops
// the build if a translation's sections differ from the English ones.

import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { z } from "zod";
import { locales, type Locale } from "@/i18n/config";
import { causes } from "./causes";
import { parseMarkdown, plainText, type Block } from "./markdown";
import { contentSlugs, type Collection } from "./pages";

/** The languages a content page exists in: English, and each language with a translation. */
export function availableLocales(collection: Collection, slug: string): Locale[] {
  return locales.filter(
    (locale) => locale === "en" || contentSlugs(collection, locale).includes(slug),
  );
}

const contentDir = path.join(process.cwd(), "content");
const rel = (file: string) => path.relative(process.cwd(), file).split(path.sep).join("/");

const photoName = z
  .string()
  .regex(/^[\w-]+\/[\w.-]+\.jpe?g$/, "a photo in content/photos/, e.g. 2026-03-iftar/serving.jpg");
const photoList = z.array(z.strictObject({ photo: photoName, alt: z.string().min(1) }));
// A text that is true only until donations open, or until the first donations arrive, says
// so; check-content lists it once data/org.yaml says that has happened (CLAUDE.md, "When
// things change").
const rewriteWhen = z.array(z.enum(["donations-open", "donations-received"])).optional();
const english = { revision: z.number().int().min(1), rewriteWhen };
const translated = {
  sourceRevision: z.number().int().min(1),
  status: z.enum(["draft", "reviewed"]),
  rewriteWhen,
};

type File<T> = { data: T; body: string; bodyLine: number; file: string };

/** A Markdown file: its front matter (checked against `schema`) and the text below it. */
function readFile<T extends z.ZodType>(schema: T, file: string): File<z.infer<T>> {
  const source = fs.readFileSync(file, "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---[^\S\r\n]*(?:\r?\n|$)([\s\S]*)$/.exec(source);
  if (!match) throw new Error(`${rel(file)}: front matter (between --- lines) is missing`);
  const result = schema.safeParse(parse(match[1]!) ?? {});
  if (!result.success) {
    throw new Error(`${rel(file)} has a mistake:\n${z.prettifyError(result.error)}`);
  }
  const bodyLine = source.slice(0, source.length - match[2]!.length).split("\n").length;
  return { data: result.data, body: match[2]!, bodyLine, file: rel(file) };
}

const fileOf = (collection: string, locale: Locale, slug: string) =>
  path.join(contentDir, collection, locale, `${slug}.md`);

// --- Sections ------------------------------------------------------------------------------

export type Section = { key: string; heading: string; blocks: Block[] };

export type LongText = {
  /** The text before the first section: the page's opening paragraph. */
  lead: Block[];
  sections: Section[];
  /** The language the text is in: the reader's, or English when there is no translation. */
  textLocale: Locale;
};

const SECTION = /^## (.+?) \{#([a-z0-9]+(?:-[a-z0-9]+)*)\}[^\S\n]*$/;

function readSections(file: File<unknown>, textLocale: Locale): LongText {
  const lines = file.body.replace(/\r\n?/g, "\n").split("\n");
  const starts: number[] = [];
  lines.forEach((line, i) => {
    if (line.startsWith("## ")) {
      if (!SECTION.test(line)) {
        throw new Error(
          `${file.file}:${file.bodyLine + i}: a section heading needs its key: ## Heading {#key}`,
        );
      }
      starts.push(i);
    }
  });
  const chunk = (from: number, to: number) => lines.slice(from, to).join("\n");
  const lead = parseMarkdown(chunk(0, starts[0] ?? lines.length), file.file, file.bodyLine);
  const sections = starts.map((start, n): Section => {
    const [, heading, key] = SECTION.exec(lines[start]!)!;
    const blocks = parseMarkdown(
      chunk(start + 1, starts[n + 1] ?? lines.length),
      file.file,
      file.bodyLine + start + 1,
    );
    const title = parseMarkdown(heading!, file.file, file.bodyLine + start)[0];
    if (title?.type !== "paragraph" || title.content.some((part) => part.type !== "text")) {
      throw new Error(`${file.file}:${file.bodyLine + start}: a section heading is plain text`);
    }
    return { key: key!, heading: plainText(title.content), blocks };
  });
  const keys = sections.map((s) => s.key);
  const repeated = keys.find((key, i) => keys.indexOf(key) !== i);
  if (repeated) throw new Error(`${file.file}: the section {#${repeated}} appears twice`);
  return { lead, sections, textLocale };
}

/** One section of a text, by its key. The build stops if the text has no such section. */
export function section(text: LongText, key: string): Section {
  const found = text.sections.find((s) => s.key === key);
  if (!found) throw new Error(`A page text has no section {#${key}}`);
  return found;
}

// --- Pages ---------------------------------------------------------------------------------

/** The long text of a fixed page, from content/pages/<language>/<page>.md. */
export function getPageText(locale: Locale, page: string): LongText {
  const own = fileOf("pages", locale, page);
  if (locale !== "en" && fs.existsSync(own)) {
    return readSections(readFile(z.strictObject(translated), own), locale);
  }
  return readSections(readFile(z.strictObject(english), fileOf("pages", "en", page)), "en");
}

// --- Causes --------------------------------------------------------------------------------

const causeEnglish = z.strictObject({ ...english, photo: photoName, photoAlt: z.string().min(1) });
const causeTranslation = z.strictObject({ ...translated, photoAlt: z.string().min(1) });

export type CauseText = LongText & { photo: string; photoAlt: string };

/** A cause's own page, from content/causes/<language>/<slug>.md. */
export function getCauseText(locale: Locale, slug: string): CauseText {
  if (!causes.some((c) => c.slug === slug)) {
    throw new Error(`content/causes/: "${slug}" is not one of the causes in src/lib/causes.ts`);
  }
  const source = readFile(causeEnglish, fileOf("causes", "en", slug));
  const own = fileOf("causes", locale, slug);
  if (locale !== "en" && fs.existsSync(own)) {
    const file = readFile(causeTranslation, own);
    return {
      ...readSections(file, locale),
      photo: source.data.photo,
      photoAlt: file.data.photoAlt,
    };
  }
  return {
    ...readSections(source, "en"),
    photo: source.data.photo,
    photoAlt: source.data.photoAlt,
  };
}

// --- Updates -------------------------------------------------------------------------------

const updateText = {
  title: z.string().min(1),
  place: z.string().min(1),
  summary: z.string().min(1),
  coverAlt: z.string().min(1),
  photos: photoList.default([]),
};

const updateEnglish = z
  .strictObject({
    ...english,
    date: z.iso.date(),
    dateEnd: z.iso.date().optional(),
    cover: photoName,
    cause: z.enum(causes.map((c) => c.slug) as [string, ...string[]]).optional(),
    ...updateText,
  })
  .refine((u) => !u.dateEnd || u.dateEnd > u.date, { message: "dateEnd must come after date" });

const updateTranslation = z.strictObject({ ...translated, ...updateText });

export type Update = {
  slug: string;
  date: string;
  dateEnd?: string;
  cover: string;
  /** The cause it belongs to (a slug in src/lib/causes.ts). */
  cause?: string;
  title: string;
  place: string;
  summary: string;
  coverAlt: string;
  /** More photos from the day, shown on the update's own page. */
  photos: { photo: string; alt: string }[];
  /** The story, shown on the update's own page. */
  story: Block[];
  /** The language the text is in: the reader's, or English when there is no translation. */
  textLocale: Locale;
};

function readUpdate(locale: Locale, slug: string): Update {
  const source = readFile(updateEnglish, fileOf("updates", "en", slug));
  const own = fileOf("updates", locale, slug);
  const file = locale !== "en" && fs.existsSync(own) ? readFile(updateTranslation, own) : source;
  const photos = file.data.photos;
  const names = (list: { photo: string }[]) => list.map((p) => p.photo).join(", ");
  if (names(photos) !== names(source.data.photos)) {
    throw new Error(
      `${file.file}: its photos must be the English file's, in the same order (${names(source.data.photos) || "none"})`,
    );
  }
  if (file.body.includes("## ")) {
    throw new Error(`${file.file}: an update's story has no sections; use ### for a subheading`);
  }
  return {
    slug,
    date: source.data.date,
    dateEnd: source.data.dateEnd,
    cover: source.data.cover,
    cause: source.data.cause,
    title: file.data.title,
    place: file.data.place,
    summary: file.data.summary,
    coverAlt: file.data.coverAlt,
    photos,
    story: parseMarkdown(file.body, file.file, file.bodyLine),
    textLocale: file === source ? "en" : locale,
  };
}

/** Every update, newest first, with its text in `locale` where there is a translation. */
export function getUpdates(locale: Locale): Update[] {
  const dir = path.join(contentDir, "updates", "en");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => readUpdate(locale, path.basename(file, ".md")))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** One update, with its text in `locale` where there is a translation. */
export function getUpdate(locale: Locale, slug: string): Update {
  return readUpdate(locale, slug);
}
