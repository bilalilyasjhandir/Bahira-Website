// Reads data/org.yaml, the one place where facts about Bahira are written, and checks it.
// The build stops with a clear message if the file is missing something or has a mistake.
// Server only: it reads the file system while the site is built.

import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { z } from "zod";

/** The apps a donor can send money with, as each writes its own name. */
export const walletApps = ["JazzCash", "Easypaisa", "NayaPay", "SadaPay"] as const;

const walletSchema = z.strictObject({
  number: z.string().regex(/^03\d{2}-?\d{7}$/, "a Pakistani mobile number such as 0300-1234567"),
  accountTitle: z.string().min(1),
  apps: z
    .array(z.enum(walletApps))
    .min(1)
    .refine((apps) => new Set(apps).size === apps.length, { message: "an app is listed twice" }),
  // Whose account it is. Only the founder's so far; their name is under organisation.
  holder: z.enum(["founder"]),
});

const latinName = z.string().regex(/^[A-Za-z][A-Za-z .'-]*$/, "a name in English letters");
const urduName = z.string().regex(/^[؀-ۿ][؀-ۿ ]*$/, "a name in Urdu letters");

/** The helplines the Need help? page lists; their names are in the dictionaries. */
export const helplineIds = ["rescue", "police", "women", "children"] as const;

const helplineSchema = z.strictObject({
  id: z.enum(helplineIds),
  number: z.string().regex(/^\d{2,5}$/, "a short helpline number such as 1122"),
  checked: z.iso.date(),
  source: z.url({ protocol: /^https$/ }),
});

const orgSchema = z.strictObject({
  site: z.strictObject({
    url: z.url({ protocol: /^https$/ }),
  }),
  organisation: z.strictObject({
    founded: z.iso.date(),
    city: z.string().min(1),
    postcode: z.string().regex(/^\d{5}$/, "a Pakistani postcode, five digits"),
    nameArabic: z.string().regex(/^[ء-ي]+$/, "Arabic letters only"),
    founder: z.strictObject({ name: latinName, nameUrdu: urduName }),
    registration: z.strictObject({
      registered: z.boolean(),
      authority: z.string().min(1).optional(),
      number: z.string().min(1).optional(),
      date: z.iso.date().optional(),
    }),
  }),
  contact: z.strictObject({
    email: z.email(),
    phone: z.string().min(1).nullable(),
  }),
  socials: z.array(
    z.strictObject({
      network: z.enum(["facebook", "instagram", "tiktok", "youtube", "x", "linkedin"]),
      url: z.url({ protocol: /^https$/ }),
    }),
  ),
  donations: z
    .strictObject({
      open: z.boolean(),
      received: z.boolean(),
      zakat: z.boolean(),
      wallets: z.array(walletSchema),
    })
    .refine((d) => !d.open || d.wallets.length > 0, {
      message: "donations.open is true, but no wallet is listed",
    }),
  forms: z.strictObject({
    web3formsKey: z
      .string()
      .regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
        "the access key from web3forms.com (like 12345678-abcd-…)",
      )
      .nullable(),
  }),
  helplines: z
    .array(helplineSchema)
    .refine((list) => new Set(list.map((h) => h.id)).size === list.length, {
      message: "a helpline is listed twice",
    }),
});

export type Org = z.infer<typeof orgSchema>;

function load(): Org {
  const file = path.join(process.cwd(), "data", "org.yaml");
  const result = orgSchema.safeParse(parse(fs.readFileSync(file, "utf8")));
  if (!result.success) {
    throw new Error(`data/org.yaml has a mistake:\n${z.prettifyError(result.error)}`);
  }
  const registration = result.data.organisation.registration;
  if (registration.registered && !(registration.authority && registration.number)) {
    throw new Error("data/org.yaml: registered is true, so add the authority and the number.");
  }
  return result.data;
}

export const org: Org = load();

/** The founder's full name in a language's script: Urdu letters on Urdu and Saraiki pages. */
export function founderName(locale: string): string {
  return locale === "en" ? org.organisation.founder.name : org.organisation.founder.nameUrdu;
}
