#!/usr/bin/env node
/*
 * Compile lib/cs/*.ts standalone and assert the engines reproduce the
 * networking course's corrigé numbers (see verify-reseaux-assertions.cjs).
 * Usage: node scripts/verify-reseaux.cjs
 */
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const out = fs.mkdtempSync(path.join(os.tmpdir(), "reseaux-engines-"));
const files = ["delays", "lineCoding", "ipv4", "routing", "arq", "tcp"].map(
  (f) => path.join(ROOT, "lib", "cs", `${f}.ts`),
);
execFileSync(
  path.join(ROOT, "node_modules", ".bin", "tsc"),
  [...files, "--outDir", out, "--module", "commonjs", "--target", "es2020", "--skipLibCheck"],
  { stdio: "inherit" },
);
process.env.RESEAUX_BUILD = out;
require("./verify-reseaux-assertions.cjs");
