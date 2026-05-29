#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { extname, isAbsolute, relative, resolve, sep } from "node:path";

const [target] = process.argv.slice(2);

if (!target) {
  console.error("Usage: node scripts/prune-rules.mjs <markdown-file>");
  process.exit(1);
}

function resolveMarkdownPath(input) {
  if (isAbsolute(input) || input.split(/[\\/]+/).includes("..")) {
    throw new Error("Target must be a relative Markdown path inside the current workspace.");
  }
  if (extname(input).toLowerCase() !== ".md") {
    throw new Error("Target must be a Markdown file ending in .md.");
  }

  const cwd = process.cwd();
  const resolved = resolve(cwd, input);
  const rel = relative(cwd, resolved);
  if (rel === "" || rel.startsWith("..") || rel.includes(`..${sep}`) || isAbsolute(rel)) {
    throw new Error("Target must stay inside the current workspace.");
  }
  return resolved;
}

let resolvedTarget;
try {
  resolvedTarget = resolveMarkdownPath(target);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

if (!existsSync(resolvedTarget)) {
  console.error(`File not found: ${resolvedTarget}`);
  process.exit(1);
}

const text = readFileSync(resolvedTarget, "utf8");
const lines = text.split(/\r?\n/);
const bullets = lines.filter((line) => /^\s*-\s+/.test(line));
const seen = new Map();
const duplicates = [];

for (const bullet of bullets) {
  const normalized = bullet.trim().toLowerCase();
  if (seen.has(normalized)) {
    duplicates.push(bullet.trim());
  } else {
    seen.set(normalized, bullet.trim());
  }
}

console.log(JSON.stringify({
  file: resolvedTarget,
  bullet_count: bullets.length,
  duplicate_count: duplicates.length,
  duplicates,
}, null, 2));
