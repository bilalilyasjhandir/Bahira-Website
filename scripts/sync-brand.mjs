// Copies the files the website uses out of the brand kit. brand/ stays the only source:
// nothing is redrawn or edited, and the copies in public/ are not committed (.gitignore).
// pnpm dev and pnpm build run this first.

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const brand = path.join(root, "brand");
const pub = path.join(root, "public");

/** [file in brand/, where the site serves it from public/] */
const copies = [
  // Favicon and app icons, at the site root as brand/icons/head-snippet.html expects.
  ["icons/favicon.ico", "favicon.ico"],
  ["icons/favicon.svg", "favicon.svg"],
  ["icons/apple-touch-icon.png", "apple-touch-icon.png"],
  ["icons/icon-192.png", "icon-192.png"],
  ["icons/icon-512.png", "icon-512.png"],
  ["icons/icon-maskable-512.png", "icon-maskable-512.png"],
  ["icons/site.webmanifest", "site.webmanifest"],
  // Logos: the header (all languages), the English footer, the Urdu and Saraiki footer.
  ["logo/svg/bahira-horizontal-blue.svg", "brand/logo/bahira-horizontal-blue.svg"],
  ["logo/svg/bahira-primary-white.svg", "brand/logo/bahira-primary-white.svg"],
  ["logo/svg/bahira-urdu-english-white.svg", "brand/logo/bahira-urdu-english-white.svg"],
  // The logo search engines show (structured data on the home page).
  ["logo/png/bahira-primary-blue-600.png", "brand/logo/bahira-primary-blue-600.png"],
  // The picture shown when a page is shared on WhatsApp or Facebook.
  ["social/link-preview-1200x630.png", "brand/link-preview-1200x630.png"],
];

const hash = (file) => createHash("sha256").update(fs.readFileSync(file)).digest("hex");

let copied = 0;
for (const [from, to] of copies) {
  const source = path.join(brand, from);
  const target = path.join(pub, to);
  if (!fs.existsSync(source)) {
    console.error(`sync-brand: brand/${from} is missing. The brand kit must not be changed.`);
    process.exit(1);
  }
  if (fs.existsSync(target) && hash(source) === hash(target)) continue;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  copied += 1;
}

// Remove copies the site no longer uses, so public/brand/ only ever holds the list above.
const wanted = new Set(copies.map(([, to]) => path.join(pub, to)));
let removed = 0;
function prune(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) prune(full);
    else if (!wanted.has(full)) {
      fs.rmSync(full);
      removed += 1;
    }
  }
}
prune(path.join(pub, "brand"));

console.log(
  `sync-brand: ${copies.length} brand files in public/` +
    (copied ? `, ${copied} copied` : ", all up to date") +
    (removed ? `, ${removed} old copies removed` : ""),
);
