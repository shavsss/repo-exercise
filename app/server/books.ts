import fs from "node:fs";
import path from "node:path";
import { DATA_DIR } from "./paths.js";

export interface BookMeta {
  id: string;
  series: "math" | "physics";
  title: string;
  titleHe: string;
  authors: string;
  file: string;
  labels: "numeric" | "chapter";
  color: string;
}

interface Page {
  pdf: number;
  label: string | null;
  text: string;
}

export const catalog: { books: BookMeta[]; initialProgress: Record<string, { page: string; note?: string }> } =
  JSON.parse(fs.readFileSync(path.join(DATA_DIR, "catalog.json"), "utf8"));

const cache = new Map<string, Page[]>();

function pages(bookId: string): Page[] {
  let p = cache.get(bookId);
  if (!p) {
    const file = path.join(DATA_DIR, "books", `${bookId}.json`);
    if (!fs.existsSync(file)) throw new Error(`Unknown book "${bookId}" (or its text was not extracted)`);
    p = JSON.parse(fs.readFileSync(file, "utf8")).pages as Page[];
    cache.set(bookId, p);
  }
  return p;
}

export function bookSummaries() {
  return catalog.books.map((b) => {
    let pageCount = 0;
    let lastLabel: string | null = null;
    try {
      const p = pages(b.id);
      pageCount = p.length;
      lastLabel = [...p].reverse().find((x) => x.label)?.label ?? null;
    } catch {
      // book text missing: still list it
    }
    return { ...b, pageCount, lastLabel };
  });
}

/** Resolve a page reference to a 0-based index. `by` is "label" (printed page) or "pdf". */
function indexOf(bookId: string, ref: string, by: "label" | "pdf"): number {
  const p = pages(bookId);
  if (by === "pdf") {
    const n = Number(ref);
    if (!Number.isInteger(n) || n < 1 || n > p.length) throw new Error(`PDF page ${ref} is out of range 1..${p.length}`);
    return n - 1;
  }
  const i = p.findIndex((x) => x.label === ref);
  if (i < 0) throw new Error(`No page with printed label "${ref}" in ${bookId}. Use search_book, or by="pdf".`);
  return i;
}

const MAX_PAGES_PER_CALL = 20;

export function readPages(bookId: string, from: string, to: string, by: "label" | "pdf") {
  const p = pages(bookId);
  const a = indexOf(bookId, from, by);
  let b = indexOf(bookId, to, by);
  if (b < a) throw new Error("`to` comes before `from`");
  let note = "";
  if (b - a + 1 > MAX_PAGES_PER_CALL) {
    b = a + MAX_PAGES_PER_CALL - 1;
    note = `\n[Truncated to ${MAX_PAGES_PER_CALL} pages; call again for the rest.]`;
  }
  const body = p
    .slice(a, b + 1)
    .map((x) => `===== ${bookId} | pdf ${x.pdf} | printed ${x.label ?? "?"} =====\n${x.text}`)
    .join("\n\n");
  return { text: body + note, range: { fromPdf: a + 1, toPdf: b + 1, fromLabel: p[a].label, toLabel: p[b].label } };
}

export function searchBook(bookId: string, query: string, maxResults = 12) {
  const p = pages(bookId);
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const hits: { pdf: number; label: string | null; score: number; snippet: string }[] = [];
  for (const page of p) {
    const lower = page.text.toLowerCase();
    let score = 0;
    let first = -1;
    // whole phrase counts most; then individual terms
    const phraseAt = lower.indexOf(query.toLowerCase());
    if (phraseAt >= 0) {
      score += 10;
      first = phraseAt;
    }
    for (const t of terms) {
      const at = lower.indexOf(t);
      if (at >= 0) {
        score += 1;
        if (first < 0) first = at;
      }
    }
    if (score > 0) {
      const s = Math.max(0, first - 160);
      hits.push({ pdf: page.pdf, label: page.label, score, snippet: page.text.slice(s, s + 360).replace(/\s+/g, " ") });
    }
  }
  hits.sort((x, y) => y.score - x.score || x.pdf - y.pdf);
  return hits.slice(0, maxResults);
}
