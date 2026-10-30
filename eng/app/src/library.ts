// The library published with the page: documents (books, articles, doctrine),
// the syllabus, page text, figure crops and page images of OCR'd pages. Files are
// fetched on demand from lib/ next to the page and kept in IndexedDB, so a page is
// downloaded once per browser.
import type { CurriculumFields } from "./curriculum";

export interface DocMeta {
  title: string;
  short: string;
  kind: "book" | "article" | "doctrine";
  pages: number;
  /** page → captions of the figures on it */
  figs: Record<string, string[]>;
  figFiles: string[];
  figIndex: Record<string, number>;
  pgFiles: string[];
  pgIndex: Record<string, number>;
}
export interface Source {
  doc: string;
  pages: [number, number];
  note: string;
  role: "main" | "supp" | "article" | "ex";
}
export interface Section {
  doc: string;
  page: number;
  title: string;
  depth: number;
}
/** A module of the syllabus; the curriculum fields (topic items, test-out, reading list) are optional. */
export interface Module extends CurriculumFields {
  id: string;
  part: string;
  tier: "core" | "adv" | "ref";
  title: string;
  en: string;
  prereq?: string[];
  sources: Source[];
  sections: Section[];
}
export interface Part {
  id: string;
  title: string;
}
export interface LibraryIndex {
  version?: string;
  docs: Record<string, DocMeta>;
  parts: Part[];
  modules: Module[];
  /** bundle name → URL, for bundles kept in the artifact's asset store instead of lib/ */
  assets?: Record<string, string>;
}
export interface PageText {
  /** printed page label, if detected */
  l: string | null;
  t: string;
  /** text came from OCR (formulas unreliable) */
  o?: 1;
}
export interface Figure {
  c: string;
  w: number;
  h: number;
  d: string;
}

const DB_NAME = "eng-lab";
const STORE = "files";
let index: LibraryIndex | null = null;
const memory = new Map<string, unknown>();

function idb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}
const dbp = idb();

async function cached<T>(name: string, version: string): Promise<T> {
  const key = `${version}:${name}`;
  if (memory.has(key)) return memory.get(key) as T;
  const db = await dbp;
  if (db) {
    const hit = await new Promise<T | undefined>((resolve) => {
      try {
        const r = db.transaction(STORE).objectStore(STORE).get(key);
        r.onsuccess = () => resolve(r.result as T | undefined);
        r.onerror = () => resolve(undefined);
      } catch {
        resolve(undefined);
      }
    });
    if (hit !== undefined) {
      memory.set(key, hit);
      return hit;
    }
  }
  const res = await fetch(index?.assets?.[name] ?? `lib/${name}`);
  if (!res.ok) throw new Error(`לא הצלחתי לטעון את ${name} (${res.status})`);
  const data = (await res.json()) as T;
  memory.set(key, data);
  if (db) {
    try {
      db.transaction(STORE, "readwrite").objectStore(STORE).put(data, key);
    } catch {
      // not cached; fetched again next visit
    }
  }
  return data;
}

/** The packer's content hash: cached files from another version are not used. */
let LIB_VERSION = "0";

export async function loadIndex() {
  if (!index) {
    const res = await fetch("lib/index.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`לא הצלחתי לטעון את הספרייה (${res.status})`);
    index = (await res.json()) as LibraryIndex;
    LIB_VERSION = index.version ?? "0";
  }
  return index;
}
export function getIndex() {
  return index;
}
export function moduleById(id: string) {
  return index?.modules.find((m) => m.id === id);
}
export function docMeta(doc: string) {
  return index?.docs[doc];
}

export async function docText(doc: string) {
  return cached<Record<string, PageText>>(`text/${doc}.json`, LIB_VERSION);
}

export async function figure(doc: string, key: string): Promise<Figure | null> {
  const meta = docMeta(doc);
  const file = meta?.figIndex[key];
  if (meta == null || file == null) return null;
  const bundle = await cached<Record<string, Figure>>(meta.figFiles[file], LIB_VERSION);
  return bundle[key] ?? null;
}

export async function pageImage(doc: string, page: number): Promise<string | null> {
  const meta = docMeta(doc);
  const file = meta?.pgIndex[String(page)];
  if (meta == null || file == null) return null;
  const bundle = await cached<Record<string, string>>(meta.pgFiles[file], LIB_VERSION);
  return bundle[String(page)] ?? null;
}

/** "POMR I · עמ' 78" for a PDF page, using the printed label when known. */
export function pageName(doc: string, page: number, label?: string | null) {
  const meta = docMeta(doc);
  const name = meta?.short ?? doc;
  if (meta?.kind === "article") return `${name} · עמ' ${page}`;
  return `${name} · עמ' ${label ?? page}`;
}

/** Page text for the tutor: a header per page with its tag, the text, and the figures on it. */
export async function readPages(doc: string, from: number, to: number, maxChars = 60000) {
  const meta = docMeta(doc);
  if (!meta) throw new Error(`אין מסמך ${doc}`);
  const text = await docText(doc);
  const a = Math.max(1, Math.min(from, to));
  const b = Math.min(meta.pages, Math.max(from, to));
  const parts: string[] = [];
  let used = 0;
  let last = a - 1;
  for (let p = a; p <= b; p++) {
    const pg = text[String(p)];
    if (!pg) continue;
    const figs = (meta.figs[String(p)] ?? []).map((c, j) => `[figure ${doc}:${p}:${j}] ${c}`).join("\n");
    const head = `=== [[${doc}:${p}]] ${meta.short}, PDF page ${p}${pg.l ? `, printed page ${pg.l}` : ""}${pg.o ? ", OCR text: formulas may be garbled; the page image is shown to the learner" : ""} ===`;
    const chunk = `${head}\n${pg.t.trim()}${figs ? `\nFigures on this page:\n${figs}` : ""}`;
    if (used + chunk.length > maxChars && parts.length) {
      parts.push(`[… stopped at PDF page ${last} to fit; read ${doc} from page ${p} with read_source_pages]`);
      break;
    }
    parts.push(chunk);
    used += chunk.length;
    last = p;
  }
  return { text: parts.join("\n\n"), last };
}

/** Case-insensitive search across the given documents (all loaded on demand). */
export async function searchLibrary(query: string, docs: string[], limit = 20) {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);
  if (!terms.length) return [];
  const hits: { doc: string; page: number; label: string | null; snippet: string; score: number }[] = [];
  for (const doc of docs) {
    const text = await docText(doc);
    for (const [k, pg] of Object.entries(text)) {
      const low = pg.t.toLowerCase();
      const score = terms.reduce((s, t) => s + (low.includes(t) ? 1 : 0), 0);
      if (score === terms.length || (terms.length > 2 && score >= terms.length - 1)) {
        const at = low.indexOf(terms[0]);
        hits.push({ doc, page: Number(k), label: pg.l, snippet: pg.t.slice(Math.max(0, at - 120), at + 200).replace(/\s+/g, " "), score });
      }
    }
  }
  return hits.sort((x, y) => y.score - x.score).slice(0, limit);
}

/** Module states from the learner's progress: learned, available (prerequisites learned) or locked. */
export type ModuleState = "done" | "open" | "locked";
export function moduleState(m: Module, done: Set<string>): ModuleState {
  if (done.has(m.id)) return "done";
  return (m.prereq ?? []).every((p) => done.has(p)) ? "open" : "locked";
}
