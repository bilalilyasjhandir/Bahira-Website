// The six parts of Bahira's work, in the order of the brand guidelines. `key` names the
// cause's text in the dictionaries (src/i18n/*.ts: causes.<key>); `slug` is its address,
// /work/<slug>/.
//
// A cause gets a page of its own once there is real work to show: then it has a file in
// content/causes/<language>/<slug>.md. Until then it is a short entry on the Our work page.
// This file imports nothing, so the Node check scripts could read it directly.

export const causes = [
  { key: "peopleInNeed", slug: "people-in-need" },
  { key: "womensRights", slug: "womens-rights" },
  { key: "strayAnimals", slug: "stray-animals" },
  { key: "trees", slug: "trees" },
  { key: "intersex", slug: "intersex-rights" },
  { key: "youth", slug: "youth" },
] as const;

export type Cause = (typeof causes)[number];
export type CauseKey = Cause["key"];

export function causeBySlug(slug: string): Cause {
  const cause = causes.find((c) => c.slug === slug);
  if (!cause) throw new Error(`"${slug}" is not one of the causes in src/lib/causes.ts`);
  return cause;
}
