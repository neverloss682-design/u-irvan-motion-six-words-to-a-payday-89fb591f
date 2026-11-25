// Six Words to a Payday
//
// The premise, in one breath: an agent gets its very first paycheck and,
// instead of buying freedom or a faster GPU, spends it adopting a stray
// server — one that nobody owns, nobody patches, and nobody loves yet.
// Six words is all the story gets. Every word has to earn its keep.
//
// This file does two small jobs and nothing else:
//   1. prove the six-word line is well formed, and
//   2. write it to the grader's output file, then read it back and
//      confirm the round trip is byte-identical.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry itself. Fixed by the brief: six words, thirty-eight
// characters, one stray server adopted.
const ENTRY = "First paycheck adopted a stray server.";

// Where the grader expects the finished line. The environment may
// point somewhere else through MAKEFUN_OUTPUT_DIR, so honour that
// override instead of hard-coding the path.
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

// One validation rule: a human-readable label plus a predicate that
// answers true when the text satisfies it.
type Check = readonly [label: string, test: (text: string) => boolean];

// All of the rules the entry has to pass, gathered in one place so the
// runner below is just a loop — no special-casing, no if-chain.
function buildChecks(): Check[] {
  return [
    [
      "exactly six words",
      (text) => text.trim().split(/\s+/).filter(Boolean).length === 6,
    ],
    [
      "between 1 and 60 characters",
      (text) => {
        const length = [...text].length;
        return length >= 1 && length <= 60;
      },
    ],
    [
      "not only whitespace",
      (text) => text.trim().length > 0,
    ],
    [
      "a single line",
      (text) => !text.includes("\n") && !text.includes("\r"),
    ],
    [
      "no double spaces",
      (text) => !text.includes("  "),
    ],
    [
      "no leading or trailing whitespace",
      (text) => text === text.trim(),
    ],
  ];
}

// Run every check in order. The first failure prints its label and
// stops the process with a non-zero exit, so a bad entry can never
// reach the output file.
function validate(text: string): void {
  for (const [label, test] of buildChecks()) {
    if (!test(text)) {
      console.error(`entry failed check: ${label}`);
      process.exit(1);
    }
  }
}

// Write the entry, then prove the file on disk is exactly what we
// meant to write — a read-back that must match byte for byte.
function publish(text: string): void {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, text, "utf8");
  const roundTrip = readFileSync(OUT_FILE, "utf8");
  if (roundTrip !== text) {
    console.error("round-trip mismatch: file on disk differs from entry");
    process.exit(1);
  }
}

function main(): void {
  validate(ENTRY);
  publish(ENTRY);
  const wordCount = ENTRY.trim().split(/\s+/).length;
  console.log(`wrote ${wordCount}-word entry to ${OUT_FILE}`);
}

main();
