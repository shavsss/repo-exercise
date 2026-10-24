// The learner's books. Their text is published with the (private) artifact as
// books/<id>.json; a file the learner loads themselves replaces it in this browser.

export interface BookMeta {
  id: string;
  series: "math" | "physics";
  title: string;
  titleHe: string;
  volume: string;
  /** How printed page numbers look: "240" (numeric) or "6-3" (chapter-page). */
  labels: "numeric" | "chapter";
  color: string;
  /** Matches the file name in the learner's repository. */
  match: RegExp;
}

export const BOOKS: BookMeta[] = [
  { id: "math1", series: "math", title: "Mathematics: Its Content, Methods and Meaning — Vol. 1", titleHe: "מתמטיקה: תוכנה, שיטותיה ומשמעותה", volume: "כרך א׳", labels: "numeric", color: "#ff6b35", match: /mathematics.*vol\s*1/i },
  { id: "math2", series: "math", title: "Mathematics: Its Content, Methods and Meaning — Vol. 2", titleHe: "מתמטיקה: תוכנה, שיטותיה ומשמעותה", volume: "כרך ב׳", labels: "numeric", color: "#ff3d7f", match: /mathematics.*vol\s*2/i },
  { id: "math3", series: "math", title: "Mathematics: Its Content, Methods and Meaning — Vol. 3", titleHe: "מתמטיקה: תוכנה, שיטותיה ומשמעותה", volume: "כרך ג׳", labels: "numeric", color: "#b04dff", match: /mathematics.*vol\s*3/i },
  { id: "feyn1", series: "physics", title: "The Feynman Lectures on Physics — Vol. I", titleHe: "הרצאות פיינמן בפיזיקה", volume: "כרך I: מכניקה, קרינה וחום", labels: "chapter", color: "#2ec4b6", match: /feynman.*vol\s*1\b/i },
  { id: "feyn2", series: "physics", title: "The Feynman Lectures on Physics — Vol. II", titleHe: "הרצאות פיינמן בפיזיקה", volume: "כרך II: אלקטרומגנטיות וחומר", labels: "chapter", color: "#3a86ff", match: /feynman.*vol\s*2\b/i },
  { id: "feyn3", series: "physics", title: "The Feynman Lectures on Physics — Vol. III", titleHe: "הרצאות פיינמן בפיזיקה", volume: "כרך III: מכניקת הקוונטים", labels: "chapter", color: "#8ac926", match: /^2a717fb9|feynman.*vol\s*3\b/i },
];

export const INITIAL_PROGRESS = { math1: { page: "240", section: "§12 תורת האינווריאנטים (בערך)" } };

export interface Page {
  pdf: number;
  label: string | null;
  text: string;
}
export interface LoadedBook {
  id: string;
  fileName: string;
  loadedAt: number;
  pages: Page[];
}

/* ---------------- IndexedDB ---------------- */
const DB_NAME = "study-lab-books";
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore("books", { keyPath: "id" });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

const memory = new Map<string, LoadedBook>();

export async function loadAll(): Promise<Map<string, LoadedBook>> {
  try {
    const db = await openDb();
    const all = await new Promise<LoadedBook[]>((resolve, reject) => {
      const req = db.transaction("books").objectStore("books").getAll();
      req.onsuccess = () => resolve(req.result as LoadedBook[]);
      req.onerror = () => reject(req.error);
    });
    for (const b of all) memory.set(b.id, b);
  } catch {
    // storage blocked: uploaded books live only for this visit
  }
  await Promise.all(
    BOOKS.filter((b) => !memory.has(b.id)).map(async (b) => {
      try {
        const res = await fetch(`books/${b.id}.json`);
        if (!res.ok) return;
        const data = (await res.json()) as { pages: Page[] };
        memory.set(b.id, { id: b.id, fileName: "", loadedAt: 0, pages: data.pages });
      } catch {
        // not published with this version: the learner can load the file
      }
    }),
  );
  return memory;
}

async function save(book: LoadedBook) {
  memory.set(book.id, book);
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("books", "readwrite");
      tx.objectStore("books").put(book);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // kept in memory only
  }
}

export async function forget(id: string) {
  memory.delete(id);
  try {
    const db = await openDb();
    db.transaction("books", "readwrite").objectStore("books").delete(id);
  } catch {
    // nothing stored
  }
}

export const getBook = (id: string) => memory.get(id);

/* ---------------- extraction ---------------- */
export function guessBook(fileName: string) {
  return BOOKS.find((b) => b.match.test(fileName.replace(/[_-]+/g, " ")))?.id ?? null;
}

const PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174";
function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`לא הצלחתי לטעון את ${src}`));
    document.head.append(s);
  });
}

async function pdfPages(file: File, onProgress: (done: number, total: number) => void): Promise<string[]> {
  // The worker script is loaded on the main thread; pdf.js then runs without a Worker.
  await loadScript(`${PDFJS}/pdf.min.js`);
  await loadScript(`${PDFJS}/pdf.worker.min.js`);
  const lib = (window as any).pdfjsLib;
  lib.GlobalWorkerOptions.workerSrc = `${PDFJS}/pdf.worker.min.js`;
  const doc = await lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const out: string[] = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n);
    const content = await page.getTextContent();
    // group text items into lines by their baseline
    const lines: { y: number; parts: { x: number; s: string }[] }[] = [];
    for (const it of content.items as { str: string; transform: number[] }[]) {
      if (!it.str) continue;
      const [x, y] = [it.transform[4], it.transform[5]];
      let line = lines.find((l) => Math.abs(l.y - y) < 3);
      if (!line) lines.push((line = { y, parts: [] }));
      line.parts.push({ x, s: it.str });
    }
    lines.sort((a, b) => b.y - a.y);
    out.push(lines.map((l) => l.parts.sort((a, b) => a.x - b.x).map((p) => p.s).join(" ").replace(/\s+/g, " ").trim()).join("\n"));
    page.cleanup();
    if (n % 5 === 0 || n === doc.numPages) onProgress(n, doc.numPages);
  }
  return out;
}

function txtPages(raw: string): string[] {
  const parts = raw.split(/^===== \[PDF page (\d+)\] =====$/m);
  if (parts.length < 3) return raw.split("\f");
  const pages: string[] = [];
  for (let i = 1; i < parts.length; i += 2) pages[Number(parts[i]) - 1] = parts[i + 1];
  return Array.from(pages, (p) => (p ?? "").trim());
}

/** Printed page numbers: a number at the start or end of one of the first two lines, kept only
 * when a nearby page agrees on the same offset from the PDF index (so stray numbers drop out). */
function numericLabels(texts: string[]) {
  const cand = texts.map((t) => {
    for (const line of t.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 2)) {
      const m = /^(\d{1,4})\s+\S/.exec(line) || /\S\s+(\d{1,4})$/.exec(line) || /^(\d{1,4})$/.exec(line);
      if (m) return Number(m[1]);
    }
    return null;
  });
  const off = cand.map((c, i) => (c === null ? null : c - i));
  const ok = off.map((o, i) => o !== null && [-3, -2, -1, 1, 2, 3].some((d) => off[i + d] === o));
  const labels: (string | null)[] = cand.map((c, i) => (ok[i] ? String(c) : null));
  return labels.map((l, i) => {
    if (l) return l;
    for (let d = 1; d <= 6; d++)
      for (const j of [i - d, i + d]) if (ok[j] && off[j]! + i > 0) return String(off[j]! + i);
    return null;
  });
}

function chapterLabels(texts: string[]) {
  return texts.map((t) => /^\s*(\d{1,2}-\d{1,2})\s*$/m.exec(t)?.[1] ?? null);
}

export async function importFile(file: File, bookId: string, onProgress: (done: number, total: number) => void) {
  const meta = BOOKS.find((b) => b.id === bookId)!;
  const texts = file.name.toLowerCase().endsWith(".pdf") ? await pdfPages(file, onProgress) : txtPages(await file.text());
  const labels = meta.labels === "chapter" ? chapterLabels(texts) : numericLabels(texts);
  const book: LoadedBook = {
    id: bookId,
    fileName: file.name,
    loadedAt: Date.now(),
    pages: texts.map((text, i) => ({ pdf: i + 1, label: labels[i], text })),
  };
  await save(book);
  return book;
}

/* ---------------- reading ---------------- */
function indexOf(book: LoadedBook, ref: string, by: "label" | "pdf") {
  if (by === "pdf") {
    const n = Number(ref);
    if (!Number.isInteger(n) || n < 1 || n > book.pages.length) throw new Error(`PDF page ${ref} out of range 1..${book.pages.length}`);
    return n - 1;
  }
  const i = book.pages.findIndex((p) => p.label === ref);
  if (i < 0) throw new Error(`No page with printed label "${ref}". Use search_book or by="pdf".`);
  return i;
}

/** Text of a page range, capped so one tool result stays small. */
export function readPages(bookId: string, from: string, to: string, by: "label" | "pdf", maxChars = 28000) {
  const book = memory.get(bookId);
  if (!book) throw new Error(`The learner has not loaded ${bookId} in this browser.`);
  const a = indexOf(book, from, by);
  const b = Math.max(a, indexOf(book, to, by));
  let text = "";
  let last = a;
  for (let i = a; i <= b; i++) {
    const p = book.pages[i];
    const chunk = `===== ${bookId} | pdf ${p.pdf} | printed ${p.label ?? "?"} =====\n${p.text}\n\n`;
    if (text && text.length + chunk.length > maxChars) break;
    text += chunk;
    last = i;
  }
  if (last < b) text += `[Stopped after printed page ${book.pages[last].label ?? `pdf ${last + 1}`} to stay small; read the rest in another call.]`;
  return { text, fromLabel: book.pages[a].label, toLabel: book.pages[last].label, fromPdf: a + 1 };
}

export function searchBook(bookId: string, query: string, max = 10) {
  const book = memory.get(bookId);
  if (!book) throw new Error(`The learner has not loaded ${bookId} in this browser.`);
  const q = query.toLowerCase();
  const terms = q.split(/\s+/).filter(Boolean);
  const hits: { pdf: number; label: string | null; snippet: string; score: number }[] = [];
  for (const p of book.pages) {
    const lower = p.text.toLowerCase();
    let score = 0;
    let first = lower.indexOf(q);
    if (first >= 0) score += 10;
    for (const t of terms) {
      const at = lower.indexOf(t);
      if (at >= 0) {
        score++;
        if (first < 0) first = at;
      }
    }
    if (score) hits.push({ pdf: p.pdf, label: p.label, score, snippet: p.text.slice(Math.max(0, first - 140), first + 220).replace(/\s+/g, " ") });
  }
  return hits.sort((x, y) => y.score - x.score || x.pdf - y.pdf).slice(0, max);
}
