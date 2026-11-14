// Reads data/org.yaml, the one place where facts about Bahira are written, and checks it.
// The build stops with a clear message if the file is missing something or has a mistake.
// Server only: it reads the file system while the site is built.

import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { z } from "zod";

const walletSchema = z.strictObject({
  provider: z.enum(["JazzCash", "Easypaisa"]),
  accountTitle: z.string().min(1),
  number: z.string().regex(/^03\d{2}-?\d{7}$/, "a Pakistani mobile number such as 0300-1234567"),
  holderName: z.string().min(1),
  holderRole: z.string().min(1),
});

const orgSchema = z.strictObject({
  site: z.strictObject({
    url: z.url({ protocol: /^https$/ }),
  }),
  organisation: z.strictObject({
    founded: z.iso.date(),
    city: z.string().min(1),
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
      wallets: z.array(walletSchema),
    })
    .refine((d) => !d.open || d.wallets.length > 0, {
      message: "donations.open is true, but no wallet is listed",
    }),
  forms: z.strictObject({
    web3formsKey: z.string().min(1).nullable(),
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
