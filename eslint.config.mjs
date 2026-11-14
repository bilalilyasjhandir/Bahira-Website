import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // The build and check scripts run in Node, not in the browser.
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: { process: "readonly", console: "readonly", URL: "readonly" },
    },
  },
  {
    rules: {
      // The site uses plain links between pages on purpose: every page is a normal page
      // load, so phones never prefetch other pages and spend data on them.
      "@next/next/no-html-link-for-pages": "off",
      // In a static export next/image cannot optimise anything. Photos go through the
      // site's own <Photo> component (scripts/build-images.mjs); logos are small SVGs.
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated or copied files:
    "public/**",
    "shots/**",
    ".venv/**",
    "brand/**",
  ]),
]);

export default eslintConfig;
