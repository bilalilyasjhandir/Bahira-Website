// pnpm shots: screenshots of every page in every language, plus the axe accessibility check.
//   pnpm shots                              every page, en ur skr, at 360 390 768 1280 px
//   pnpm shots -- --pages=home,about --locales=en,ur --widths=360,1280
//   pnpm shots -- --no-axe                  screenshots only
// Pages are named as in src/lib/pages.ts: home, about, getInvolved, … for the fixed pages,
// and updates/2026-03-iftar or work/people-in-need for the pages made from content/.
// It uses the Microsoft Edge already installed on Windows (Playwright's msedge channel), so
// no browser is downloaded. The built site in out/ is served with the live site's headers
// (vercel.json). It fails on console errors, failed or blocked requests (the Content
// Security Policy), and serious or critical accessibility problems; axe runs at 360 and
// 1280 px unless --widths is given. Screenshots go to shots/<language>/ (not committed).

import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { startServer } from "./lib/static-server.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "out");
const shotsDir = path.join(root, "shots");
if (!fs.existsSync(path.join(out, "index.html"))) {
  console.error("shots: there is no built site in out/. Run pnpm build first.");
  process.exit(1);
}

const option = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const { allPages } = await import(pathToFileURL(path.join(root, "src/lib/pages.ts")).href);
const widths = (option("widths") ?? "360,390,768,1280").split(",").map(Number);
const axeWidths = new Set(option("widths") ? widths : [360, 1280]);
const locales = (option("locales") ?? "en,ur,skr").split(",");
const everyPage = allPages(["en", "ur", "skr"]);
const chosen = option("pages")
  ? option("pages")
      .split(",")
      .map((name) => {
        const page = everyPage.find((p) => p.name === name);
        if (page) return page;
        console.error(
          `shots: no page called "${name}". Pages: ${everyPage.map((p) => p.name).join(", ")}`,
        );
        process.exit(1);
      })
  : everyPage;
const runAxe = !process.argv.includes("--no-axe");

const localePath = (locale, p) => (locale === "en" ? p : `/${locale}${p}`);
const nameOf = (p) => (p === "/" ? "home" : p.replaceAll("/", "-").replace(/^-|-$/g, ""));

/** Every visit: [label, URL path, expected status, file name]. Content pages exist only in
 *  the languages they have been translated into. */
const visits = locales.flatMap((locale) =>
  chosen
    .filter((page) => page.locales.includes(locale))
    .map((page) => [
      `${locale} ${page.path}`,
      localePath(locale, page.path),
      200,
      path.join(locale, nameOf(page.path)),
    ]),
);
if (!option("pages")) visits.push(["404", "/this-page-does-not-exist/", 404, "404"]);

const server = await startServer({ root: out, projectRoot: root });
const browser = await chromium.launch({ channel: "msedge" });
const failures = [];
const notes = [];
let shotCount = 0;

async function visit([label, urlPath, status, file], width) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  const problems = [];
  const url = server.url + urlPath;
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    // Visiting a missing address on purpose: the browser reports the 404 of the page itself.
    if (status === 404 && m.location()?.url === url && /status of 404/.test(m.text())) return;
    problems.push(`console: ${m.text()}`);
  });
  page.on("pageerror", (e) => problems.push(`script error: ${e.message}`));
  page.on("requestfailed", (r) => {
    // The browser sometimes cancels an image request itself (net::ERR_ABORTED) while the page
    // is scrolled through and captured, and loads the image again. That is no error: whether
    // every image really loaded is checked below.
    if (r.resourceType() === "image" && r.failure()?.errorText === "net::ERR_ABORTED") return;
    problems.push(`request failed: ${r.url()} (${r.failure()?.errorText})`);
  });
  await page.addInitScript(() => {
    window.__blocked = [];
    document.addEventListener("securitypolicyviolation", (e) =>
      window.__blocked.push(`${e.violatedDirective} blocked ${e.blockedURI || "inline code"}`),
    );
  });

  const response = await page.goto(url, { waitUntil: "networkidle" });
  if (response?.status() !== status)
    problems.push(`status ${response?.status()}, expected ${status}`);
  await page.evaluate(() => document.fonts.ready);
  // Photos below the fold load only when a reader scrolls near them, so scroll through the
  // page like a reader would, then wait for every image before taking the screenshot.
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo(0, y);
      await new Promise((done) => setTimeout(done, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() => [...document.images].every((img) => img.complete), null, {
    timeout: 15000,
  });
  for (const img of await page.$$eval("img", (imgs) =>
    imgs.filter((i) => i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
  ))
    problems.push(`image did not load: ${img}`);
  for (const blocked of await page.evaluate(() => window.__blocked))
    problems.push(`Content Security Policy: ${blocked}`);

  const target = path.join(shotsDir, `${file}-${width}.png`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  await page.screenshot({ path: target, fullPage: true });
  shotCount += 1;

  if (runAxe && axeWidths.has(width)) {
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
      .analyze();
    for (const v of results.violations) {
      const where = v.nodes
        .slice(0, 2)
        .map((n) => n.target.join(" "))
        .join("; ");
      const line = `${label} @${width}: ${v.id} (${v.impact}): ${v.help} [${where}]`;
      if (v.impact === "serious" || v.impact === "critical") failures.push(line);
      else notes.push(line);
    }
  }
  for (const p of problems) failures.push(`${label} @${width}: ${p}`);
  await context.close();
}

// A few pages at a time keeps it quick without overloading the laptop.
const jobs = visits.flatMap((v) => widths.map((w) => [v, w]));
let next = 0;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (next < jobs.length) {
      const [v, w] = jobs[next++];
      await visit(v, w);
    }
  }),
);

await browser.close();
await server.close();

console.log(
  `shots: ${shotCount} screenshots in shots/${runAxe ? `, axe at ${[...axeWidths].join(" and ")} px` : ""}`,
);
for (const line of notes) console.log(`  ! ${line}`);
for (const line of failures) console.log(`  ✖ ${line}`);
console.log(`  ${failures.length} problems, ${notes.length} minor accessibility notes`);
process.exit(failures.length ? 1 : 0);
