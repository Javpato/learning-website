import type { Metadata } from "next";
import { EB_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Learning",
  description:
    "Plateforme de mathématiques interactive et rigoureuse — les formules prennent vie sans rien céder sur la rigueur.",
};

// Content-Security-Policy. This site is a static export on GitHub Pages, which
// cannot set HTTP response headers, so the CSP is delivered via <meta>. It is a
// genuine second layer of XSS defence on top of React's output escaping.
//   * 'wasm-unsafe-eval' — required to compile the sql.js SQLite WebAssembly.
//   * 'unsafe-inline' (script) — unavoidable here: static export cannot mint a
//     per-request nonce for Next's inline bootstrap. Documented trade-off.
//   * 'unsafe-inline' (style) — KaTeX / Mafs / Tailwind inject inline styles.
//   * everything else is locked to same-origin; no third-party runtime origins.
// Limitation: frame-ancestors / HSTS / X-Frame-Options cannot be set via <meta>
// nor on GitHub Pages — see platform/CLAUDE.md › Security.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${garamond.variable} ${inter.variable} ${mono.variable}`}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={CSP} />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body>{children}</body>
    </html>
  );
}
