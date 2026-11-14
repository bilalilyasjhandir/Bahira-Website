// The web versions of the photos in content/photos/, as listed by scripts/build-images.mjs
// in src/generated/photos.json. Server only: it reads the file system while the site is built.

import fs from "node:fs";
import path from "node:path";

type Source = { width: number; src: string };

export type PhotoVersions = {
  width: number;
  height: number;
  avif: Source[];
  webp: Source[];
};

type Manifest = {
  photos: Record<string, PhotoVersions>;
  share: Record<string, { width: number; height: number; src: string }>;
};

function manifest(): Manifest {
  const file = path.join(process.cwd(), "src", "generated", "photos.json");
  if (!fs.existsSync(file)) {
    throw new Error(
      "src/generated/photos.json is missing: run pnpm images (pnpm dev and pnpm build do).",
    );
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

/** The versions of a photo, by its name in content/photos/ (e.g. "2026-03-iftar/serving.jpg"). */
export function getPhoto(name: string): PhotoVersions {
  const photo = manifest().photos[name];
  if (!photo) {
    throw new Error(
      `No photo "${name}" in content/photos/ (or pnpm images has not run since it was added).`,
    );
  }
  return photo;
}
