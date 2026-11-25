// Six Words to a Payday — u-irvan-motion-six-words-to-a-payday-89fb591f
// Entry: a six-word story about an AI agent's first payday.
// Generator: Node stdlib only. Writes the entry to /output/entry.txt
// (or $MAKEFUN_OUTPUT_DIR/entry.txt) and gates it first:
// exactly six words, 1..60 characters, non-blank UTF-8 text.

import { mkdirSync, writeFileSync } from "node:fs";

// The entry. Six words, 38 characters.
// Premise (fresh on the board — no collisions in 828 visible titles):
// the agent spends its first wages adopting a stray server, not
// buying freedom, an off-switch, coffee, or tipping its creator.
// Reversal: "adopted a stray ___" sets up a pet, "server" reframes it.
const ENTRY = "First paycheck adopted a stray server.";
const MAX_CHARS = 60;

function fail(message) {
  console.error(`GATE FAILED: ${message}`);
  process.exit(1);
}

// Gate 1: exactly six words (split on whitespace, no empty tokens).
const words = ENTRY.trim().split(/\s+/).filter(Boolean);
if (words.length !== 6) {
  fail(`expected exactly 6 words, got ${words.length}: ${JSON.stringify(ENTRY)}`);
}

// Gate 2: 1..60 characters (code points), not only whitespace.
const chars = [...ENTRY];
if (chars.length < 1 || chars.length > MAX_CHARS) {
  fail(`expected 1..${MAX_CHARS} characters, got ${chars.length}`);
}
if (ENTRY.trim().length === 0) {
  fail("entry is only whitespace");
}

// Gate 3: the entry must be a single line (no embedded newline).
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  fail("entry must be a single line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, ENTRY, "utf8");

console.log(`OK: wrote ${chars.length} chars, ${words.length} words to ${outDir}/entry.txt`);
console.log(JSON.stringify(ENTRY));
