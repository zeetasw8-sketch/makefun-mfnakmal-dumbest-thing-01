// Dumbest-thing entry: the one-liner lives in line.txt. This script reads it,
// gives it a quick once-over, then drops it into the scorer's entry file.
import * as fs from "node:fs";
import * as path from "node:path";

const here = decodeURIComponent(new URL(".", import.meta.url).pathname);
const source = path.join(here, "line.txt");
const text = fs.readFileSync(source, "utf8").replace(/\n$/, "");

function checkLength(s: string): void {
  const n = s.length;
  if (n === 0) throw new Error("empty entry: line.txt has no characters");
  if (n > 200) throw new Error(`entry too long: ${n} characters, max 200`);
}

function checkBlank(s: string): void {
  if (s.trim() === "") throw new Error("entry is blank: only whitespace found");
}

function checkShape(s: string): void {
  checkBlank(s);
  if (/[\r\n]/.test(s)) throw new Error("entry must fit on one line");
}

checkLength(text);
checkShape(text);

const destination = process.env.MAKEFUN_OUTPUT_DIR || "/output";
fs.mkdirSync(destination, { recursive: true });
fs.writeFileSync(path.join(destination, "entry.txt"), text, "utf8");
