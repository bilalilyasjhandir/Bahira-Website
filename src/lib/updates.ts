// Updates are the dated posts about Bahira's work (content/updates/<language>/<slug>.md).
// "Updates" is in the menu once there are at least three, so nobody lands on a nearly empty
// page. Until then the Updates page still exists, linked from the home page.

import { contentSlugs } from "./pages";

export const UPDATES_IN_MENU_FROM = 3;

/** How many updates exist (each has an English file, where its facts are written). */
export function updateCount(): number {
  return contentSlugs("updates", "en").length;
}

export function showUpdatesInMenu(): boolean {
  return updateCount() >= UPDATES_IN_MENU_FROM;
}
