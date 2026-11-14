import type { NextConfig } from "next";

// A static site: `next build` writes every page, in every language, as plain HTML into out/.
// Server features are not available, so host headers live in vercel.json and photos are
// made by scripts/build-images.mjs.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // `next dev` would otherwise write an AGENTS.md file. The project's rules for AI agents
  // live in CLAUDE.md.
  agentRules: false,
  experimental: {
    // English and Urdu/Saraiki have separate root layouts, so the 404 page needs its own
    // full document. See src/app/global-not-found.tsx.
    // Note: Next.js bundles this 404 page with every route, so any font it loads through
    // next/font gets preloaded on every page. It loads Nastaliq through plain CSS instead.
    globalNotFound: true,
    // Never put CSS a page does not import into that page's CSS. Next.js preloads every
    // font whose rules sit in a page's CSS, and the default merging moved the Nastaliq font
    // rules into CSS that English pages load too, so they downloaded the Nastaliq font for
    // nothing. requestCost is what one more CSS file is worth, in bytes of CSS a page does
    // not need. At 1, stylesheets that always load together are merged into one file, but
    // no page ever gets CSS it does not import. (At 0 nothing merged, and the Home page
    // loaded 13 small stylesheets before it could show anything.) check-site fails the build
    // if an English page ever preloads Nastaliq again.
    cssChunking: { type: "graph", requestCost: 1 },
  },
};

export default nextConfig;
