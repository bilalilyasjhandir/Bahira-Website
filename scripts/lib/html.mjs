// Small helpers for reading the HTML that next build writes. The pages are machine-written
// and well formed, so reading start tags with a regular expression is enough here.

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0" };

export function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === "#") {
      const n =
        code[1] === "x" || code[1] === "X"
          ? parseInt(code.slice(2), 16)
          : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : match;
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

/** The HTML without comments, and without the contents of <script> and <style>. */
export function markupOnly(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, "$1</script>")
    .replace(/(<style\b[^>]*>)[\s\S]*?<\/style>/gi, "$1</style>");
}

function parseAttributes(source) {
  const attributes = {};
  const re = /([^\s"'=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let m;
  while ((m = re.exec(source))) {
    attributes[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? "");
  }
  return attributes;
}

/** Every start tag named `name` (e.g. "a", "link"), as an object of lower-case attributes. */
export function startTags(html, name) {
  const re = new RegExp(`<${name}(?=[\\s/>])([^>]*)>`, "gi");
  const found = [];
  let m;
  while ((m = re.exec(html))) found.push(parseAttributes(m[1]));
  return found;
}

/** The text a visitor reads: the <body>, without tags, scripts and styles. */
export function visibleText(html) {
  const body = /<body\b[^>]*>([\s\S]*)<\/body>/i.exec(html)?.[1] ?? html;
  return decodeEntities(
    markupOnly(body)
      .replace(/<script\b[^>]*><\/script>/gi, " ")
      .replace(/<style\b[^>]*><\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  );
}

/** The URLs in a srcset attribute. */
export function srcsetUrls(srcset) {
  return srcset
    .split(",")
    .map((part) => part.trim().split(/\s+/)[0])
    .filter(Boolean);
}
