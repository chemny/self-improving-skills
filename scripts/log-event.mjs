#!/usr/bin/env node
import { mkdirSync, appendFileSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";

const [type, summary, details = "", action = ""] = process.argv.slice(2);

if (!type || !summary) {
  console.error('Usage: node scripts/log-event.mjs <type> <summary> [details] [suggested action]');
  process.exit(1);
}

const valid = new Set([
  "preference",
  "correction",
  "tool_gotcha",
  "workflow",
  "feature_gap",
  "experiment",
  "archive_only",
]);

if (!valid.has(type)) {
  console.error(`Invalid type: ${type}`);
  console.error(`Valid types: ${Array.from(valid).join(", ")}`);
  process.exit(1);
}

function resolveWorkspacePath(input) {
  if (isAbsolute(input) || input.split(/[\\/]+/).includes("..")) {
    throw new Error("Output directory must be a relative path inside the current workspace.");
  }

  const cwd = process.cwd();
  const resolved = resolve(cwd, input);
  const rel = relative(cwd, resolved);
  if (rel === "" || rel.startsWith("..") || rel.includes(`..${sep}`) || isAbsolute(rel)) {
    throw new Error("Output directory must stay inside the current workspace.");
  }
  return resolved;
}

let root;
try {
  root = resolveWorkspacePath(process.env.SELF_IMPROVING_SKILLS_DIR || ".learnings");
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

mkdirSync(root, { recursive: true });

const targetByType = {
  preference: "LEARNINGS.md",
  correction: "ERRORS.md",
  tool_gotcha: "LEARNINGS.md",
  workflow: "LEARNINGS.md",
  feature_gap: "FEATURE_REQUESTS.md",
  experiment: "EXPERIMENTS.md",
  archive_only: "ARCHIVE.md",
};

const target = resolve(root, targetByType[type]);
const now = new Date().toISOString();
const entry = [
  `\n## ${now} - ${type}`,
  "",
  `Summary: ${summary}`,
  details ? `Details: ${details}` : "",
  action ? `Suggested action: ${action}` : "",
  "",
].filter(Boolean).join("\n");

appendFileSync(target, entry, "utf8");
console.log(target);
