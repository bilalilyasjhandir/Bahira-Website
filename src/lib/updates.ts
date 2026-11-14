// Updates are the dated posts about Bahira's work (content/updates/<language>/<slug>.md).
// They arrive in Phase 3. Until there are at least three, the menu leaves "Updates" out,
// so nobody lands on a nearly empty page.

import fs from "node:fs";
import path from "node:path";
import { locales } from "@/i18n/config";

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
  return updateCount() >= UPDATES_IN_MENU_FROM;
}
