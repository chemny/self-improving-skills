#!/usr/bin/env node
import { existsSync, readFileSync, appendFileSync } from "node:fs";
import { extname, isAbsolute, relative, resolve, sep } from "node:path";

const [target, ...ruleParts] = process.argv.slice(2);
const rule = ruleParts.join(" ").trim();

if (!target || !rule) {
  console.error('Usage: node scripts/promote-rule.mjs <target-file> "Rule text"');
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

const normalizedRule = rule.startsWith("- ") ? rule : `- ${rule}`;
const existing = existsSync(resolvedTarget) ? readFileSync(resolvedTarget, "utf8") : "";

if (existing.includes(rule) || existing.includes(normalizedRule)) {
  console.log(`Rule already exists in ${resolvedTarget}`);
  process.exit(0);
}

const prefix = existing.endsWith("\n") || existing.length === 0 ? "" : "\n";
appendFileSync(resolvedTarget, `${prefix}${normalizedRule}\n`, "utf8");
console.log(resolvedTarget);
