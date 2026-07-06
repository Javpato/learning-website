// Copies the Pyodide *base interpreter* runtime out of node_modules into
// public/pyodide/ so it is self-hosted (no runtime CDN — see platform/CLAUDE.md
// › Security). Re-run after bumping the pinned `pyodide` version in package.json.
//
//   npm run vendor:pyodide
//
// We deliberately vendor ONLY the files loadPyodide() needs for plain Python
// (print / variables / control flow / `random`). We do NOT copy the package
// wheels (numpy, pandas, …) — the beginner course never imports them, and they
// would add ~200 MB. If a later chapter needs a package, vendor its wheel then.
const fs = require("fs");
const path = require("path");

const SRC = path.dirname(require.resolve("pyodide/package.json"));
const DEST = path.join(__dirname, "..", "public", "pyodide");

// The minimal runtime set. pyodide.js is the UMD loader (defines loadPyodide);
// pyodide.asm.{js,wasm} is the interpreter; python_stdlib.zip is the CPython
// standard library; pyodide-lock.json is the package index loadPyodide reads.
const FILES = [
  "pyodide.js",
  "pyodide.asm.js",
  "pyodide.asm.wasm",
  "python_stdlib.zip",
  "pyodide-lock.json",
];

fs.mkdirSync(DEST, { recursive: true });
const version = require("pyodide/package.json").version;
for (const f of FILES) {
  const from = path.join(SRC, f);
  const to = path.join(DEST, f);
  if (!fs.existsSync(from)) throw new Error(`Missing Pyodide file: ${from}`);
  fs.copyFileSync(from, to);
  const kb = (fs.statSync(to).size / 1024).toFixed(0);
  console.log(`  ${f}  (${kb} KB)`);
}
console.log(`Vendored Pyodide ${version} → public/pyodide/`);
