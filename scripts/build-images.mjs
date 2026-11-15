// Makes the web versions of the photos in content/photos/ (selected and cropped from
// Bilal's originals in _photos/inbox/, which are never served):
// - AVIF and WebP at several widths, never wider than the photo itself;
// - a 1200×630 JPEG of each update's cover photo, the safe format for WhatsApp and
//   Facebook link previews;
// - src/generated/photos.json, the list the <Photo> component reads.
// File names carry a short hash of the photo, so a changed photo gets a new name and the
// long browser cache set in vercel.json can never show an old version.
// No metadata is copied into any file it writes: no location (GPS), no camera details.
// pnpm dev and pnpm build run this first.

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { parse } from "yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const photosDir = path.join(root, "content", "photos");
const updatesDir = path.join(root, "content", "updates");
const outDir = path.join(root, "public", "img");
const manifestFile = path.join(root, "src", "generated", "photos.json");

const WIDTHS = [360, 480, 640, 800, 1080, 1280, 1600, 1920];
const SHARE = { width: 1200, height: 630 };
// The file-name hash includes these settings, so changing any of them makes every image
// again. Raise `version` to force that for any other reason.
// AVIF quality 60 with 4:2:0 colour (Phase 3, when Bilal found the photos too soft). At 42,
// the Phase 2 setting, faces looked waxy and hair, beards and cloth smeared; at 60 they look
// natural. It costs about twice the bytes, so phones are given at most the 800 px version
// (src/components/Photo.tsx), and the versions phones load keep the hero budget below.
const SETTINGS = {
  version: 1,
  avif: { quality: 60, effort: 6, chromaSubsampling: "4:2:0" },
  // A photo at the top of a page loads first, so each AVIF version a phone can load (up to
  // 800 px) must stay within the hero budget (70 KB; check-site checks it, and it keeps
  // English pages under 300 KB). A busy photo can go over at quality 60; only those versions
  // are then made at a lower quality, two steps at a time, until they fit. That costs little:
  // busy detail hides compression, and the 800 px versions land between quality 48 and 60,
  // where 42 to 50 is the step the eye sees. Any photo can become a hero (every cover is one
  // on its update's page), so this applies to all of them.
  heroBudget: { maxWidth: 800, maxBytes: 68 * 1024, minQuality: 40 },
  webp: { quality: 72 },
  jpeg: { quality: 80, mozjpeg: true },
};
const PHOTO_TYPES = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const toPosix = (p) => p.split(path.sep).join("/");

function listPhotos(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listPhotos(full);
    return PHOTO_TYPES.has(path.extname(entry.name).toLowerCase()) ? [full] : [];
  });
}

/** Cover photos named in the updates' front matter: `cover: events/iftar.jpg`. */
function listCovers() {
  if (!fs.existsSync(updatesDir)) return new Map();
  const covers = new Map();
  for (const locale of fs.readdirSync(updatesDir)) {
    const dir = path.join(updatesDir, locale);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(
        fs.readFileSync(path.join(dir, file), "utf8"),
      );
      const cover = match ? parse(match[1])?.cover : undefined;
      if (typeof cover === "string") covers.set(cover, path.basename(file, ".md"));
    }
  }
  return covers;
}

const produced = new Set();
const lowered = [];

async function write(pipeline, file) {
  produced.add(file);
  if (fs.existsSync(file)) return; // same hash, same settings: already made
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await pipeline.toFile(file);
}

/** An AVIF version of a photo, kept within the hero budget (SETTINGS.heroBudget). */
async function writeAvif(buffer, width, file) {
  produced.add(file);
  if (fs.existsSync(file)) return;
  const { maxWidth, maxBytes, minQuality } = SETTINGS.heroBudget;
  let quality = SETTINGS.avif.quality;
  let data;
  for (;;) {
    data = await sharp(buffer)
      .rotate()
      .resize({ width })
      .avif({ ...SETTINGS.avif, quality })
      .toBuffer();
    if (width > maxWidth || data.length <= maxBytes || quality <= minQuality) break;
    quality -= 2;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data);
  if (quality !== SETTINGS.avif.quality) {
    lowered.push(`${toPosix(path.relative(outDir, file))} at quality ${quality}`);
  }
}

const photos = listPhotos(photosDir);
const covers = listCovers();
const manifest = { photos: {}, share: {} };

for (const file of photos) {
  const key = toPosix(path.relative(photosDir, file));
  const buffer = fs.readFileSync(file);
  const hash = createHash("sha256")
    .update(buffer)
    .update(JSON.stringify(SETTINGS))
    .digest("hex")
    .slice(0, 10);
  const base = key.slice(0, -path.extname(key).length);

  // Phone photos are often stored sideways with a note saying how to turn them;
  // rotate() turns them upright before that note is dropped with the rest.
  const meta = await sharp(buffer).metadata();
  const sideways = (meta.orientation ?? 1) >= 5;
  const width = sideways ? meta.height : meta.width;
  const height = sideways ? meta.width : meta.height;

  const widths = WIDTHS.filter((w) => w < width);
  if (width <= WIDTHS.at(-1)) widths.push(width);
  else widths.push(WIDTHS.at(-1));

  const entry = { width, height, avif: [], webp: [] };
  for (const w of widths) {
    for (const format of ["avif", "webp"]) {
      const out = path.join(outDir, `${base}-${hash}-${w}.${format}`);
      if (format === "avif") await writeAvif(buffer, w, out);
      else await write(sharp(buffer).rotate().resize({ width: w }).webp(SETTINGS.webp), out);
      entry[format].push({ width: w, src: `/img/${toPosix(path.relative(outDir, out))}` });
    }
  }
  manifest.photos[key] = entry;

  if (covers.has(key)) {
    const out = path.join(outDir, "share", `${covers.get(key)}-${hash}.jpg`);
    await write(
      sharp(buffer)
        .rotate()
        .resize({ ...SHARE, fit: "cover", position: sharp.strategy.attention })
        .jpeg(SETTINGS.jpeg),
      out,
    );
    manifest.share[key] = { ...SHARE, src: `/img/${toPosix(path.relative(outDir, out))}` };
  }
}

const missingCovers = [...covers.keys()].filter((cover) => !manifest.photos[cover]);
if (missingCovers.length) {
  console.error(
    `build-images: these cover photos are not in content/photos/: ${missingCovers.join(", ")}`,
  );
  process.exit(1);
}

// Remove images from photos that were changed or deleted.
let removed = 0;
function prune(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      prune(full);
      if (fs.readdirSync(full).length === 0) fs.rmdirSync(full);
    } else if (!produced.has(full)) {
      fs.rmSync(full);
      removed += 1;
    }
  }
}
prune(outDir);

fs.mkdirSync(path.dirname(manifestFile), { recursive: true });
fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 1)}\n`);
console.log(
  photos.length === 0
    ? "build-images: no photos in content/photos/ yet"
    : `build-images: ${photos.length} photos, ${produced.size} image files` +
        (removed ? `, ${removed} old files removed` : ""),
);
// Shown only when the files are made; later builds reuse them.
for (const line of lowered) console.log(`  within the hero budget: ${line}`);
