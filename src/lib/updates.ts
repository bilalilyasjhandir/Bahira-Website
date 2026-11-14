// Updates are the dated posts about Bahira's work (content/updates/<language>/<slug>.md).
// "Updates" joins the menu once there are at least three, so nobody lands on a nearly
// empty page, and once the Updates page itself exists (Phase 3).

import fs from "node:fs";
import path from "node:path";
import { locales } from "@/i18n/config";
import { pages } from "./pages";

export const UPDATES_IN_MENU_FROM = 3;

/** How many different updates exist, in any language. */
export function updateCount(): number {
  const slugs = new Set<string>();
  for (const locale of locales) {
    const dir = path.join(process.cwd(), "content", "updates", locale);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (file.endsWith(".md")) slugs.add(file);
    }
  }
  return slugs.size;
}

export function showUpdatesInMenu(): boolean {
  return "updates" in pages && updateCount() >= UPDATES_IN_MENU_FROM;
}
