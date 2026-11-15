// The long texts in content/ are written in a small, fixed part of Markdown, read here:
//
//   ### Heading            a subheading
//   - item                 a bulleted list, one item per line (a long item may go on over
//                          the next lines if they start with two spaces)
//   1. item                a numbered list
//   [text](/get-involved/) a link: a page of the site, written with its English address and
//                          shown in the reader's language; or https://…; or #id on the page
//   {email} {founded}      facts from data/org.yaml, filled in when the site is built:
//   {arabic} {founder}     the email address, the founding date, the Arabic word the name
//                          comes from (set in an Arabic font, never in Nastaliq), and the
//                          founder's full name (in Urdu letters on Urdu and Saraiki pages)
//   a blank line           ends a paragraph, a list or a heading
//
// "## Heading {#key}" lines start the sections of a page; content.ts splits them off before
// the text reaches this file.
//
// Anything else (bold, italics, images, tables, quotes, HTML) stops the build with the file
// and line number, so a slip never reaches the site unnoticed. Bold and italics are left out
// on purpose: the site's Nastaliq font has neither, so they would vanish on Urdu and Saraiki
// pages. No Markdown library is needed for this much (none is added without Bilal's OK).

export const FACTS = ["email", "founded", "arabic", "founder"] as const;
export type Fact = (typeof FACTS)[number];

export type Inline =
  | { type: "text"; text: string }
  | { type: "link"; href: string; text: string }
  | { type: "fact"; name: Fact };

export type Block =
  | { type: "paragraph"; content: Inline[] }
  | { type: "heading"; content: Inline[] }
  | { type: "list"; ordered: boolean; items: Inline[][] };

const ITEM = /^(?:(- )|(\d+)\. )(.*)$/;
const NOT_SUPPORTED = /^(?:>|\||```|~~~|<|!\[|\* |\+ |\t)/;

/**
 * Reads Markdown text. `where` names the file, and `firstLine` is the line of the file the
 * text starts on, so errors point to the right line.
 */
export function parseMarkdown(source: string, where: string, firstLine = 1): Block[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const fail = (index: number, message: string): never => {
    throw new Error(`${where}:${firstLine + index}: ${message}`);
  };
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i]!;
    if (line.trim() === "") {
      i += 1;
      continue;
    }
    if (/^\s/.test(line)) fail(i, "a line starts with spaces; only a list item may go on so");
    if (NOT_SUPPORTED.test(line)) fail(i, `"${line.slice(0, 20)}…" is not used on this site`);

    const heading = /^### (.+)$/.exec(line);
    if (heading) {
      blocks.push({ type: "heading", content: inline(heading[1]!, i) });
      i += 1;
      continue;
    }
    if (line.startsWith("#")) {
      fail(i, 'only "### " subheadings go here ("## Heading {#key}" starts a section)');
    }

    const first = ITEM.exec(line);
    if (first) {
      const ordered = !first[1];
      const items: Inline[][] = [];
      while (i < lines.length && lines[i]!.trim() !== "") {
        const item = ITEM.exec(lines[i]!);
        if (!item) fail(i, "every line of a list starts with - or a number (or two spaces)");
        if (!item![1] !== ordered) fail(i, "a list mixes - and numbers");
        const start = i;
        let text = item![3]!;
        i += 1;
        while (i < lines.length && /^ {2,}\S/.test(lines[i]!)) {
          text += ` ${lines[i]!.trim()}`;
          i += 1;
        }
        items.push(inline(text, start));
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    const start = i;
    let text = line;
    i += 1;
    while (i < lines.length && lines[i]!.trim() !== "" && !/^(?:#|- |\d+\. )/.test(lines[i]!)) {
      if (/^\s/.test(lines[i]!)) fail(i, "a line inside a paragraph starts with spaces");
      text += ` ${lines[i]!}`;
      i += 1;
    }
    blocks.push({ type: "paragraph", content: inline(text, start) });
  }
  return blocks;

  /** Links and {facts} in one line of text. */
  function inline(text: string, index: number): Inline[] {
    const out: Inline[] = [];
    const plain = (value: string) => {
      const bad = /[*`<>[\]{}]/.exec(value);
      if (bad) {
        fail(
          index,
          `"${bad[0]}" in "${value.trim().slice(0, 40)}": bold, italics and HTML are not used, and links are [text](address)`,
        );
      }
      if (value) out.push({ type: "text", text: value });
    };
    const token = /\[([^\]]+)\]\(([^)\s]+)\)|\{(\w+)\}/g;
    let last = 0;
    for (let m = token.exec(text); m; m = token.exec(text)) {
      plain(text.slice(last, m.index));
      last = m.index + m[0].length;
      if (m[3] !== undefined) {
        if (!(FACTS as readonly string[]).includes(m[3])) {
          fail(index, `{${m[3]}} is not a fact the site knows (${FACTS.join(", ")})`);
        }
        out.push({ type: "fact", name: m[3] as Fact });
        continue;
      }
      const [label, href] = [m[1]!, m[2]!];
      const internal = /^\/(?:[a-z0-9-]+\/)*$/.test(href);
      if (!internal && !/^#[\w-]+$/.test(href) && !/^https:\/\/[^\s]+$/.test(href)) {
        fail(
          index,
          `the link address "${href}" should be a page such as /about/, #id or https://…`,
        );
      }
      if (/[*`<>[\]{}]/.test(label))
        fail(index, `the link text "${label}" has a mark it cannot use`);
      out.push({ type: "link", href, text: label });
    }
    plain(text.slice(last));
    return out;
  }
}

/** The text of a heading or a line, without links or facts (for a section's <h2>). */
export function plainText(content: Inline[]): string {
  return content.map((part) => (part.type === "fact" ? `{${part.name}}` : part.text)).join("");
}
