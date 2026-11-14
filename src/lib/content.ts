// Reads the updates in content/updates/<language>/<slug>.md and checks them.
// Server only: it reads the file system while the site is built.
//
// An update's facts (its dates and cover photo) are written once, in the English file; the
// Urdu and Saraiki files hold only their own text. An update that has no version in the
// reader's language is shown in its original language, marked as such.

import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { z } from "zod";
import type { Locale } from "@/i18n/config";

const text = {
  title: z.string().min(1),
  place: z.string().min(1),
  summary: z.string().min(1),
  coverAlt: z.string().min(1),
};

const englishSchema = z
  .strictObject({
    revision: z.number().int().min(1),
    date: z.iso.date(),
    dateEnd: z.iso.date().optional(),
    cover: z
      .string()
      .regex(
        /^[\w-]+\/[\w.-]+\.jpe?g$/,
        "a photo in content/photos/, e.g. 2026-03-iftar/serving.jpg",
      ),
    ...text,
  })
  .refine((u) => !u.dateEnd || u.dateEnd > u.date, { message: "dateEnd must come after date" });

const translationSchema = z.strictObject({
  sourceRevision: z.number().int().min(1),
  status: z.enum(["draft", "reviewed"]),
  ...text,
});

export type Update = {
  slug: string;
  date: string;
  dateEnd?: string;
  cover: string;
  title: string;
  place: string;
  summary: string;
  coverAlt: string;
  /** The language the text is in: the reader's, or English when there is no translation. */
  textLocale: Locale;
};

const updatesDir = path.join(process.cwd(), "content", "updates");

function frontMatter(file: string): unknown {
  const yaml = /^---\r?\n([\s\S]*?)\r?\n---/.exec(fs.readFileSync(file, "utf8"))?.[1];
  if (yaml === undefined) throw new Error(`${file}: front matter (between --- lines) is missing`);
  return parse(yaml);
}

function read<T extends z.ZodType>(schema: T, file: string): z.infer<T> {
  const result = schema.safeParse(frontMatter(file));
  if (!result.success) {
    throw new Error(
      `${path.relative(process.cwd(), file)} has a mistake:\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}

/** Every update, newest first, with its text in `locale` where there is a translation. */
export function getUpdates(locale: Locale): Update[] {
  const englishDir = path.join(updatesDir, "en");
  if (!fs.existsSync(englishDir)) return [];
  return fs
    .readdirSync(englishDir)
    .filter((file) => file.endsWith(".md"))
    .map((file): Update => {
      const slug = path.basename(file, ".md");
      const english = read(englishSchema, path.join(englishDir, file));
      const translated = path.join(updatesDir, locale, file);
      const own =
        locale !== "en" && fs.existsSync(translated) ? read(translationSchema, translated) : null;
      const words = own ?? english;
      return {
        slug,
        date: english.date,
        dateEnd: english.dateEnd,
        cover: english.cover,
        title: words.title,
        place: words.place,
        summary: words.summary,
        coverAlt: words.coverAlt,
        textLocale: own ? locale : "en",
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
