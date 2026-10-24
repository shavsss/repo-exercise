// Extracts the books at the repo root into per-page JSON (app/data/books/<id>.json).
// PDFs need `pdftotext` (poppler-utils). The output is committed, so this only
// has to run again when a book is added or replaced.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../..");
const outDir = path.resolve(here, "../data/books");
const catalog = JSON.parse(fs.readFileSync(path.resolve(here, "../data/catalog.json"), "utf8"));

fs.mkdirSync(outDir, { recursive: true });

function pdfPageCount(file) {
  const info = execFileSync("pdfinfo", [file], { encoding: "utf8" });
  return Number(/Pages:\s+(\d+)/.exec(info)[1]);
}

function pdfPages(file) {
  const n = pdfPageCount(file);
  // One pdftotext run; pages are separated by form feeds.
  const all = execFileSync("pdftotext", ["-layout", "-f", "1", "-l", String(n), file, "-"], {
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
  });
  return all.split("\f").slice(0, n);
}

function txtPages(file) {
  const raw = fs.readFileSync(file, "utf8");
  const parts = raw.split(/^===== \[PDF page (\d+)\] =====$/m);
  const pages = [];
  for (let i = 1; i < parts.length; i += 2) pages[Number(parts[i]) - 1] = parts[i + 1];
  return Array.from(pages, (p) => p ?? "");
}

// Printed page number in a running head: "240   III. ANALYTIC GEOMETRY" or "§13. PROJECTIVE GEOMETRY   245".
function numericLabel(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 2);
  for (const line of lines) {
    const m = /^(\d{1,4})\s{2,}\S/.exec(line) || /\S\s{2,}(\d{1,4})$/.exec(line) || /^(\d{1,4})$/.exec(line);
    if (m) return m[1];
  }
  return null;
}

// Feynman pages carry "chapter-page" labels such as "1-13" on a line of their own.
function chapterLabel(text) {
  const m = /^\s*(\d{1,2}-\d{1,2})\s*$/m.exec(text);
  return m ? m[1] : null;
}

// Fill gaps in numeric labels from the nearest detected neighbour, but only when
// neighbours agree on a constant offset (so OCR noise does not spread).
function smoothNumeric(labels) {
  const offsets = labels.map((l, i) => (l && /^\d+$/.test(l) ? Number(l) - (i + 1) : null));
  const counts = new Map();
  for (const o of offsets) if (o !== null) counts.set(o, (counts.get(o) ?? 0) + 1);
  return labels.map((l, i) => {
    if (l) return l;
    for (let d = 1; d <= 6; d++) {
      for (const j of [i - d, i + d]) {
        const o = offsets[j];
        if (o !== null && o !== undefined && (counts.get(o) ?? 0) >= 5 && i + 1 + o > 0) return String(i + 1 + o);
      }
    }
    return null;
  });
}

for (const book of catalog.books) {
  const file = path.join(repoRoot, book.file);
  if (!fs.existsSync(file)) {
    console.warn(`skip ${book.id}: ${book.file} not found`);
    continue;
  }
  const texts = book.file.endsWith(".pdf") ? pdfPages(file) : txtPages(file);
  let labels = texts.map((t) => (book.labels === "chapter" ? chapterLabel(t) : numericLabel(t)));
  if (book.labels !== "chapter") labels = smoothNumeric(labels);
  const pages = texts.map((text, i) => ({
    pdf: i + 1,
    label: labels[i],
    text: text.replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").trim(),
  }));
  fs.writeFileSync(path.join(outDir, `${book.id}.json`), JSON.stringify({ id: book.id, pages }));
  const labelled = labels.filter(Boolean).length;
  console.log(`${book.id}: ${pages.length} pages, ${labelled} with printed labels`);
}
