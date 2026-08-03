import createMDX from "@next/mdx";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";

// When building for GitHub Pages (GITHUB_PAGES=true, set by the deploy workflow),
// emit a fully static export under the project subpath
// https://javpato.github.io/learning-website/platform/. Local dev/build are
// unaffected (normal SSG, served at the root).
const PAGES = process.env.GITHUB_PAGES === "true";
const BASE = "/learning-website/platform";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow .mdx files to be treated as pages/routes.
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactStrictMode: true,
  // three.js ships untranspiled ESM helpers; let Next transpile them.
  transpilePackages: ["three"],
  // Exposed to client code so runtime-loaded public/ assets (e.g. the sql.js
  // worker + wasm) can be addressed with the correct prefix. Empty in dev.
  env: { NEXT_PUBLIC_BASE_PATH: PAGES ? BASE : "" },
  // Static export forks one worker per CPU, each with its own V8 heap. On a
  // 12-core machine that is ~12 heaps rendering KaTeX-heavy MDX at once, and
  // the build gets OOM-killed even at --max-old-space-size=14336. CI runners
  // have 2 cores and never hit it, so this only ever bit local builds. Cap the
  // fan-out; it costs wall-clock, not correctness.
  experimental: { cpus: 4 },
  ...(PAGES
    ? {
        output: "export",
        basePath: BASE,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

const withMDX = createMDX({
  options: {
    // remark-gfm is what makes pipe TABLES render as tables. Without it every
    // markdown table on the site — the decision fiches, the formulaire, the
    // hypothesis passports — came out as literal "| a | b |" text, even though
    // `.prose-page table` styling had been written for them all along.
    remarkPlugins: [remarkMath, remarkGfm],
    // rehype-slug gives h2/h3 stable ids so the lesson <Toc> can link to them.
    rehypePlugins: [rehypeKatex, rehypeSlug],
  },
});

export default withMDX(nextConfig);
