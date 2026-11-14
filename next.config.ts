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
    // rules into CSS that English pages load too, so they downloaded the 195 KB Nastaliq
    // font for nothing. requestCost 0 keeps each page to its own CSS. check-site fails the
    // build if an English page ever preloads Nastaliq again.
    cssChunking: { type: "graph", requestCost: 0 },
  },
};

export default nextConfig;
