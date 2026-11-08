// The lesson as a book (round 6): the text of a conversation cut into its top-level blocks, the units the book
// lays out on pages. A paragraph, a heading, a list, a display equation or one fenced block is one chunk; each is
// rendered by the same Markdown component as the scrolling view, on its own. The cut is made by the same parser
// react-markdown uses (remark, with GFM and math), so a chunk is exactly the source of one block. Identical in
// both labs.
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export type ChunkKind =
  /** the lesson's opening: module line and title, drawn by the book */
  | "title"
  /** a later question of the learner in the same conversation, as an epigraph before its answer */
  | "question"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "list"
  | "quote"
  | "math"
  | "fence"
  | "table"
  | "hr"
  /** the end of an answer: the "continue" banner of a cut answer */
  | "cut"
  /** the back of the book: the next lesson and the close of the day */
  | "end";

export interface Chunk {
  /** stable while the text grows: message and place in it */
  key: string;
  /** a position id that survives a new page size: kind and the first words */
  id: string;
  kind: ChunkKind;
  /** fenced block language */
  lang?: string;
  /** Markdown source of the block */
  text: string;
  /** figures numbered before this chunk in its message (Markdown numbers figure blocks in order) */
  figBase: number;
  /** index of the conversation item the chunk belongs to */
  item: number;
  /** the first chunk of an answer, which starts on a new page */
  first?: boolean;
  /** the last chunk of an answer that is still being written: it may grow */
  open?: boolean;
  /** heading text, for the running heads and the contents */
  head?: string;
}

/** Fenced blocks the learner works in: their space is kept for their largest state, and they are never cut. */
export const INTERACTIVE = new Set(["think", "exercise", "predict", "errorhunt", "verify", "lab", "decide", "mcq", "numeric", "explain"]);
/** Live blocks that sit on the page as a plate and come alive on the facing page. */
export const PLATES = new Set(["scene3d", "sim", "anim", "interactive", "notebook"]);
/** Frames that hold one thing to remember whole: never cut (B3 §2, §12). */
export const WHOLE = new Set(["definition", "formula", "refresh", "erratum", "plan"]);
/** Pictures: never cut, and allowed to float to the next page of the same spread. */
export const FIGURES = new Set(["figure", "svg", "chart", "mermaid", "table"]);

const proc = unified().use(remarkParse).use(remarkGfm).use(remarkMath, { singleDollarTextMath: true });

/** A small stable hash (FNV-1a) as base 36. */
export function hash(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return (h >>> 0).toString(36);
}

const plain = (s: string) =>
  s
    .replace(/```[\w-]*\n?/g, "")
    .replace(/^@\w+:.*$/gm, "")
    .replace(/[#*_`>$\\]/g, "")
    .replace(/\s+/g, " ")
    .trim();

interface MdNode {
  type: string;
  depth?: number;
  lang?: string | null;
  value?: string;
  children?: MdNode[];
  position?: { start: { offset?: number }; end: { offset?: number } };
}

/** The chunks of one answer's Markdown. `item` is its place in the conversation. */
export function chunkText(text: string, item: number, open = false): Chunk[] {
  const out: Chunk[] = [];
  if (!text.trim()) return out;
  let tree: MdNode;
  try {
    tree = proc.parse(text) as unknown as MdNode;
  } catch {
    tree = { type: "root", children: [{ type: "paragraph", position: { start: { offset: 0 }, end: { offset: text.length } } }] };
  }
  let figs = 0;
  let n = 0;
  const kids = tree.children ?? [];
  for (let k = 0; k < kids.length; k++) {
    const node = kids[k];
    const a = node.position?.start.offset;
    const b = node.position?.end.offset;
    if (a === undefined || b === undefined) continue;
    const src = text.slice(a, b);
    let kind: ChunkKind;
    let lang: string | undefined;
    let head: string | undefined;
    switch (node.type) {
      case "heading": {
        const d = node.depth ?? 2;
        kind = d <= 2 ? "h2" : d === 3 ? "h3" : "h4";
        head = plain(src.replace(/^#+\s*/, ""));
        break;
      }
      case "paragraph":
        // a one-line $$…$$ paragraph is display math (Markdown.tsx turns it into a block)
        kind = /^\s*\$\$[^\n]+\$\$\s*$/.test(src) ? "math" : "p";
        break;
      case "math":
        kind = "math";
        break;
      case "list":
        kind = "list";
        break;
      case "blockquote":
        kind = "quote";
        break;
      case "table":
        kind = "table";
        break;
      case "thematicBreak":
        kind = "hr";
        break;
      case "code":
        kind = "fence";
        lang = (node.lang ?? "").trim() || undefined;
        break;
      case "html":
        // hidden unit markers and audit lines (<!--U7-->) show nothing
        if (/^\s*(<!--[\s\S]*?(-->|$)\s*)+$/.test(src)) continue;
        kind = "p";
        break;
      case "definition":
      case "footnoteDefinition":
        continue;
      default:
        kind = "p";
    }
    const id = `${item}-${kind}-${hash(plain(src).slice(0, 80) || src.slice(0, 80))}`;
    out.push({ key: `${item}:${n++}`, id, kind, lang, text: src, figBase: figs, item, head });
    if (kind === "fence" && lang === "figure") figs++;
  }
  if (out.length) {
    out[0].first = true;
    if (open) out[out.length - 1].open = true;
  }
  return out;
}

/** The same id twice in one book (a repeated line) gets a counter, so a saved place finds the right one. */
export function uniqueIds(chunks: Chunk[]) {
  const seen = new Map<string, number>();
  for (const c of chunks) {
    const k = seen.get(c.id) ?? 0;
    seen.set(c.id, k + 1);
    if (k) c.id = `${c.id}~${k}`;
  }
  return chunks;
}
