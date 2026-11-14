// pnpm photos: makes the photos the site uses (content/photos/) from Bilal's originals in
// _photos/inbox/, following content/photos/crops.yaml.
//
// Each photo is turned upright, cropped to its shape around its focus point, made at most
// 2400 px on its long side, and saved as a high-quality JPEG with no metadata at all: no
// location (GPS), no camera details. The originals never leave the laptop; the crops are
// committed, and the build (scripts/build-images.mjs) makes the web sizes from them.
// Run it after adding or changing an entry in crops.yaml.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { parse } from "yaml";
import { locationProblem } from "./lib/gps.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inbox = path.join(root, "_photos", "inbox");
const photosDir = path.join(root, "content", "photos");
const listFile = path.join(photosDir, "crops.yaml");
const LONG_EDGE = 2400;

const list = parse(fs.readFileSync(listFile, "utf8")) ?? [];
const problems = [];
let made = 0;
let kept = 0;

for (const [i, entry] of list.entries()) {
  const where = `crops.yaml entry ${i + 1} (${entry?.photo ?? "no photo name"})`;
  const ratio = /^(\d+):(\d+)$/.exec(String(entry?.ratio ?? ""));
  const [fx, fy] = Array.isArray(entry?.focus) ? entry.focus : [];
  const zoom = entry?.zoom ?? 1;
  if (!entry?.photo || !/\.jpe?g$/i.test(entry.photo) || !entry?.from || !ratio) {
    problems.push(`${where}: needs photo (a .jpg name), from and ratio such as "4:5"`);
    continue;
  }
  if (![fx, fy].every((v) => typeof v === "number" && v >= 0 && v <= 1) || !(zoom >= 1)) {
    problems.push(`${where}: focus must be two numbers from 0 to 1, and zoom 1 or more`);
    continue;
  }

  const source = path.join(inbox, entry.from);
  const target = path.join(photosDir, entry.photo);
  if (!fs.existsSync(source)) {
    // The originals live only on Bilal's laptop. Elsewhere, an existing crop is kept as is.
    if (fs.existsSync(target)) kept += 1;
    else
      problems.push(`${where}: the original _photos/inbox/${entry.from} is not on this computer`);
    continue;
  }

  const upright = await sharp(source).rotate().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = upright.info;
  const shape = Number(ratio[1]) / Number(ratio[2]);
  // The largest box of this shape that fits, made smaller by zoom, centred on the focus.
  let w = Math.min(W, H * shape);
  let h = w / shape;
  w = Math.round(w / zoom);
  h = Math.round(h / zoom);
  const left = Math.round(Math.min(Math.max(fx * W - w / 2, 0), W - w));
  const top = Math.round(Math.min(Math.max(fy * H - h / 2, 0), H - h));
  const scale = Math.min(1, LONG_EDGE / Math.max(w, h));

  fs.mkdirSync(path.dirname(target), { recursive: true });
  await sharp(upright.data)
    .extract({ left, top, width: w, height: h })
    .resize({ width: Math.round(w * scale), height: Math.round(h * scale) })
    .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(target);
  const problem = locationProblem(fs.readFileSync(target));
  if (problem) problems.push(`${where}: the crop ${problem}`);
  made += 1;
  console.log(`  ${entry.photo}: ${Math.round(w * scale)}×${Math.round(h * scale)} from ${W}×${H}`);
}

// Photos in content/photos/ that no entry makes any more.
const listed = new Set(list.map((e) => path.join(photosDir, e?.photo ?? "")));
(function scan(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) scan(full);
    else if (/\.(jpe?g|png|webp)$/i.test(e.name) && !listed.has(full)) {
      problems.push(
        `content/photos/${path.relative(photosDir, full).split(path.sep).join("/")} is not in crops.yaml`,
      );
    }
  }
})(photosDir);

console.log(
  `photos: ${made} made` + (kept ? `, ${kept} kept (originals not on this computer)` : ""),
);
for (const p of problems) console.log(`  ✖ ${p}`);
process.exit(problems.length ? 1 : 0);
