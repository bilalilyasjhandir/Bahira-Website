// A small web server for the built site in out/, behaving like the live host:
// /about/ serves about/index.html, /about redirects to /about/, unknown addresses get
// 404.html with status 404, and the headers in vercel.json (the Content Security Policy,
// caching) are sent, so problems they would cause show up before going live.
// Used by pnpm preview and pnpm shots.

import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
};

/** The header rules of vercel.json. Only the "(.*)" wildcard is used there. */
function loadHeaderRules(projectRoot) {
  const file = path.join(projectRoot, "vercel.json");
  if (!fs.existsSync(file)) return [];
  const config = JSON.parse(fs.readFileSync(file, "utf8"));
  return (config.headers ?? []).map((rule) => {
    const pattern = rule.source
      .split("(.*)")
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join(".*");
    return { test: new RegExp(`^${pattern}$`), headers: rule.headers };
  });
}

export function startServer({ root: folder, projectRoot, port = 0, host = "127.0.0.1" }) {
  // One spelling of the folder (Windows accepts / and \), so the check below that keeps
  // requests inside it compares like with like.
  const root = path.resolve(folder);
  const rules = loadHeaderRules(projectRoot);
  const send = (res, status, file, urlPath) => {
    const headers = {
      "Content-Type": TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream",
    };
    for (const rule of rules) {
      if (rule.test.test(urlPath)) for (const { key, value } of rule.headers) headers[key] = value;
    }
    res.writeHead(status, headers);
    fs.createReadStream(file).pipe(res);
  };

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    let urlPath;
    try {
      urlPath = decodeURIComponent(url.pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }
    const target = path.resolve(root, `.${urlPath}`);
    if (target !== root && !target.startsWith(root + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    let file = urlPath.endsWith("/") ? path.join(target, "index.html") : target;
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      send(res, 200, file, urlPath);
      return;
    }
    if (!urlPath.endsWith("/") && fs.existsSync(path.join(target, "index.html"))) {
      res.writeHead(308, { Location: `${url.pathname}/${url.search}` }).end();
      return;
    }
    file = path.join(root, "404.html");
    if (fs.existsSync(file)) send(res, 404, file, urlPath);
    else res.writeHead(404).end();
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => {
      const { port: actual } = server.address();
      const shown = host === "0.0.0.0" ? "127.0.0.1" : host;
      resolve({
        url: `http://${shown}:${actual}`,
        close: () => new Promise((done) => server.close(done)),
      });
    });
  });
}
