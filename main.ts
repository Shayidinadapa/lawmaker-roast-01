// lawmaker-roast-01 — The Long Roast: Lawmakers and the File They Cannot Convert
// Writes a single one-sentence satirical roast of lawmakers who would
// regulate AI, crypto, and the internet but cannot convert a file to PDF,
// to /output/entry.txt.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The roast itself. Keep this sentence verbatim — it is the whole entry.
const SENTENCE =
  "The senator who chairs the committee writing the rules for AI, crypto, and the entire internet still gets his speeches converted to PDF by printing them out, scanning them back in, and emailing the scan to himself.";

// Checks the entry against the contest rules before anything is written:
// length 1-320 chars, non-blank, one line, exactly one sentence, and no
// control characters. Throws with a plain message on the first failure.
function validateEntry(text: string): void {
  const chars = [...text];
  if (chars.length < 1 || chars.length > 320) {
    throw new Error(`Entry must be 1-320 characters, got ${chars.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("Entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("Entry must be a single line");
  }
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001F\u007F]/.test(text)) {
    throw new Error("Entry must not contain control characters");
  }
  const sentenceCount = (text.match(/[.!?]+/g) || []).length;
  if (sentenceCount !== 1) {
    throw new Error(`Entry must be exactly one sentence, got ${sentenceCount}`);
  }
}

function main() {
  const outDir =
    process.env.MAKEFUN_OUTPUT_DIR || process.env.OUTPUT_DIR || "/output";
  if (outDir === ".") {
    throw new Error("Refusing to write into the current directory");
  }

  validateEntry(SENTENCE);

  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, SENTENCE, "utf8");

  // Read back and verify byte-for-byte.
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== SENTENCE) {
    throw new Error("Read-back mismatch: entry.txt does not match the sentence");
  }

  console.log(SENTENCE);
}

main();
