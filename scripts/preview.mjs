// pnpm preview: serves the built site (out/) exactly as the host will, with the headers in
// vercel.json. Run pnpm build first; Ctrl+C stops it.
//   PORT=4001 pnpm preview        another port
//   HOST=0.0.0.0 pnpm preview     also reachable from a phone on the same Wi-Fi

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startServer } from "./lib/static-server.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "out");
if (!fs.existsSync(path.join(out, "index.html"))) {
  console.error("preview: there is no built site in out/. Run pnpm build first.");
  process.exit(1);
}

const server = await startServer({
  root: out,
  projectRoot: root,
  port: Number(process.env.PORT ?? 4000),
  host: process.env.HOST ?? "127.0.0.1",
});
console.log(`Bahira website, as built in out/:`);
console.log(`  English  ${server.url}/`);
console.log(`  Urdu     ${server.url}/ur/`);
console.log(`  Saraiki  ${server.url}/skr/`);
console.log("Ctrl+C stops it.");
