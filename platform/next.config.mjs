import createMDX from "@next/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

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
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});

export default withMDX(nextConfig);
