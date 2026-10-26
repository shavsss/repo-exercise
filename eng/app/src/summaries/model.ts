// The summaries notebook: one summary per module, made of blocks. The same file is in both
// labs (core/app and eng/app); keep the copies identical.

export type BoxKind = "def" | "eq" | "ex" | "err" | "q" | "con";
export type MarkColor = "y" | "r" | "b" | "g";
export type ShapeColor = MarkColor | "k";
export interface Shape {
  t: "arrow" | "rect" | "ellipse" | "text";
  /** corners in a 0–1000 box over the picture, so the shapes follow its size */
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: ShapeColor;
  text?: string;
}
export interface ListItem {
  html: string;
  level: number;
}
export type ImgSize = "s" | "m" | "l";
export type Block =
  /** cont: more text of the section above it (after a box), drawn under its text, no number */
  | { id: string; t: "h"; level: 1 | 2 | 3; html: string; plain?: boolean; emoji?: string; cont?: boolean }
  | { id: string; t: "p"; html: string }
  | { id: string; t: "list"; ordered: boolean; items: ListItem[] }
  | { id: string; t: "box"; kind: BoxKind; html: string; latex?: string }
  | { id: string; t: "math"; latex: string; plain?: boolean }
  | { id: string; t: "img"; src: string; w: number; h: number; size: ImgSize; side?: boolean; caption: string; marks: Shape[] }
  | { id: string; t: "fig"; doc: string; key: string; size: ImgSize; side?: boolean; caption: string; marks: Shape[] }
  | { id: string; t: "hr" };
export type BlockType = Block["t"];

export type SummaryStatus = "none" | "draft" | "done";
export interface Summary {
  moduleId: string;
  blocks: Block[];
  status: SummaryStatus;
  updatedAt: number;
}
/** what the tree needs, kept apart so the tree does not load every summary */
export interface SummaryMeta {
  status: SummaryStatus;
  updatedAt: number;
  words: number;
}

export const BOX_LABEL: Record<BoxKind, string> = { def: "הגדרה", eq: "נוסחה מרכזית", ex: "דוגמה מספרית", err: "טעות נפוצה", q: "שאלה פתוחה", con: "מסקנה" };
export const BOX_EMOJI: Record<BoxKind, string> = { def: "📘", eq: "🧮", ex: "🔢", err: "⚠️", q: "❓", con: "✅" };
/** emojis offered beside a heading */
export const HEAD_EMOJI = ["📡", "🎯", "🛰️", "🚀", "✈️", "🛡️", "⚡", "🔋", "📶", "🔭", "🌡️", "🌊", "🧲", "⚙️", "🔧", "🧮", "📐", "📊", "📈", "🗺️", "🧭", "💡", "🧠", "🔍", "⚠️", "✅", "❓", "📌", "🔥", "⭐", "📘", "📝", "🎓", "🏁", "⏱️", "💰"];
export const MARK_LABEL: Record<MarkColor, string> = { y: "חשוב", r: "טעות או אזהרה", b: "הגדרה", g: "תובנה" };
export const STATUS_LABEL: Record<SummaryStatus, string> = { none: "לא התחיל", draft: "טיוטה", done: "מוכן" };

export const uid = () => Math.random().toString(36).slice(2, 10);

export function emptyBlock(t: BlockType, extra: Partial<Block> = {}): Block {
  const id = uid();
  const b: Record<BlockType, Block> = {
    h: { id, t: "h", level: 1, html: "" },
    p: { id, t: "p", html: "" },
    list: { id, t: "list", ordered: false, items: [{ html: "", level: 0 }] },
    box: { id, t: "box", kind: "def", html: "" },
    math: { id, t: "math", latex: "" },
    img: { id, t: "img", src: "", w: 0, h: 0, size: "m", caption: "", marks: [] },
    fig: { id, t: "fig", doc: "", key: "", size: "m", caption: "", marks: [] },
    hr: { id, t: "hr" },
  };
  return { ...b[t], ...extra } as Block;
}

/** The first blocks of a new summary: the module's title and a section per lesson. */
export function seedBlocks(title: string, lessons: string[]): Block[] {
  const out: Block[] = [{ ...(emptyBlock("h") as Extract<Block, { t: "h" }>), html: esc(title), plain: true }];
  if (!lessons.length) out.push(emptyBlock("p"));
  for (const l of lessons) out.push({ ...(emptyBlock("h") as Extract<Block, { t: "h" }>), html: esc(l) }, emptyBlock("p"));
  return out;
}

export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Plain text of a fragment of the block HTML. */
const unq = (s: string) => s.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
/** equations inside a line, as $…$ */
const dollars = (html: string) => html.replace(/<span[^>]*data-tex="([^"]*)"[^>]*>.*?<\/span>/g, (_, t) => `$${unq(t)}$`);

/**
 * Lists inside a block, as lines: each item with its number (1., 1.1, 1.1.1, as the editor
 * draws them) or a bullet, indented by its depth.
 */
export function flatLists(html: string, pad: (depth: number) => string = (d) => "   ".repeat(d)) {
  if (!/<(ol|ul)[ >]/.test(html)) return html;
  const stack: { ordered: boolean; n: number }[] = [];
  let out = "";
  for (const part of html.split(/(<\/?(?:ol|ul|li)(?: start="\d+")?>)/)) {
    const m = /^<(\/?)(ol|ul|li)(?: start="(\d+)")?>$/.exec(part);
    if (!m) {
      // the break that holds an empty item open, or ends an item, is not a line of its own
      out += stack.length ? part.replace(/<br>$/, "") : part;
      continue;
    }
    const [, close, tag] = m;
    if (tag !== "li") {
      if (close) stack.pop();
      else stack.push({ ordered: tag === "ol", n: Number(m[3] ?? 1) - 1 });
      out += "\u0004";
    } else if (close) out += "\u0004";
    else if (stack.length) {
      const top = stack[stack.length - 1];
      top.n++;
      const nums = stack.filter((x) => x.ordered).map((x) => x.n);
      out += `\u0004${pad(stack.length - 1)}${top.ordered ? (nums.length === 1 ? `${nums[0]}.` : nums.join(".")) : "•"} `;
    }
  }
  return out.replace(/(<br>)?\u0004(<br>)?/g, "\u0004").replace(/\u0004+/g, "<br>").replace(/^<br>|<br>$/g, "");
}

export function textOf(html: string) {
  return dollars(flatLists(html))
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
}

/**
 * Numbers of the headings (1, 1.1, 1.1.1) and of the display equations, by block id. A section's
 * continuation (cont) gets its section's number in `conts`, to be drawn hidden, for alignment.
 */
export function numbering(blocks: Block[]) {
  const heads = new Map<string, string>();
  const conts = new Map<string, string>();
  const last: (string | undefined)[] = [];
  const eqs = new Map<string, number>();
  const c = [0, 0, 0];
  let eq = 0;
  for (const b of blocks) {
    if (b.t === "h" && b.cont) {
      const n = last[b.level - 1];
      if (n) conts.set(b.id, n);
    } else if (b.t === "h" && !b.plain) {
      const i = b.level - 1;
      c[i]++;
      for (let j = i + 1; j < 3; j++) c[j] = 0;
      const n = c.slice(0, i + 1).map((x) => x || 1).join(".");
      heads.set(b.id, n);
      last[i] = n;
      last.length = i + 1;
    } else if ((b.t === "math" && !b.plain && b.latex.trim()) || (b.t === "box" && b.kind === "eq" && b.latex?.trim())) {
      eqs.set(b.id, ++eq);
    }
  }
  return { heads, eqs, conts };
}

/** Numbers of the items of a numbered list: 1, 2 at the top level; a, b below; i, ii below that. */
export function itemNumbers(items: ListItem[]) {
  const c = [0, 0, 0];
  const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii"];
  return items.map((it) => {
    const l = Math.min(2, it.level);
    c[l]++;
    for (let j = l + 1; j < 3; j++) c[j] = 0;
    return l === 0 ? `${c[0]}.` : l === 1 ? `${String.fromCharCode(0x5d0 + c[1] - 1)}.` : `${roman[c[2] - 1] ?? c[2]}.`;
  });
}

export function wordCount(blocks: Block[]) {
  let n = 0;
  const w = (s: string) => (n += textOf(s).split(/\s+/).filter(Boolean).length);
  for (const b of blocks) {
    if (b.t === "p" || b.t === "h" || b.t === "box") w(b.html);
    if (b.t === "list") b.items.forEach((i) => w(i.html));
    if (b.t === "img" || b.t === "fig") w(b.caption);
  }
  return n;
}

/** Inline HTML (b, i, mark, br) as Markdown; marks stay as <mark>, which GitHub shows. */
export function inlineMd(html: string) {
  return textOf(
    html
      .replace(/<(b|strong)>/gi, "**")
      .replace(/<\/(b|strong)>/gi, "**")
      .replace(/<(i|em)>/gi, "*")
      .replace(/<\/(i|em)>/gi, "*")
      .replace(/<mark class="hl-(\w)">/gi, "\u0001$1\u0002")
      .replace(/<\/mark>/gi, "\u0003"),
  )
    .replace(/\u0001(\w)\u0002/g, (_, c) => `<mark title="${MARK_LABEL[c as MarkColor] ?? ""}">`)
    .replace(/\u0003/g, "</mark>")
    .replace(/\*\*\s*\*\*/g, "");
}

/** The summary as Markdown, with $$…$$ math: for the tutor, and the same shape as the backup. */
export function toMarkdown(title: string, blocks: Block[]) {
  const { heads, eqs } = numbering(blocks);
  const out: string[] = [];
  let first = true;
  for (const b of blocks) {
    if (b.t === "h" && b.cont) {
      if (textOf(b.html).trim()) out.push(inlineMd(b.html));
    } else if (b.t === "h") {
      const n = heads.get(b.id);
      const hashes = first && b.plain ? "#" : "#".repeat(Math.min(6, b.level + 1));
      out.push(`${hashes} ${b.emoji ? b.emoji + " " : ""}${n ? n + " " : ""}${inlineMd(b.html)}`);
    } else if (b.t === "p") {
      if (textOf(b.html).trim()) out.push(inlineMd(b.html));
    } else if (b.t === "list") {
      const nums = itemNumbers(b.items);
      out.push(b.items.map((it, i) => `${"   ".repeat(it.level)}${b.ordered ? nums[i] : "-"} ${inlineMd(it.html)}`).join("\n"));
    } else if (b.t === "box") {
      const body = [b.latex?.trim() ? `$$${b.latex}$$${eqs.get(b.id) ? ` (${eqs.get(b.id)})` : ""}` : "", inlineMd(b.html)].filter(Boolean).join("\n> ");
      out.push(`> ${BOX_EMOJI[b.kind]} **${BOX_LABEL[b.kind]}:** ${body}`);
    } else if (b.t === "math") {
      if (b.latex.trim()) out.push(`$$${b.latex}$$${eqs.get(b.id) ? ` (${eqs.get(b.id)})` : ""}`);
    } else if (b.t === "img") {
      out.push(`![${b.caption}](${b.src})${b.marks.length ? " (עם סימונים)" : ""}`);
    } else if (b.t === "fig") {
      out.push(`[איור מהספר ${b.doc}, ${b.key}]${b.caption ? ` ${b.caption}` : ""}`);
    } else if (b.t === "hr") out.push("---");
    first = false;
  }
  return `${out.join("\n\n")}\n`.replace(/^/, title && !(blocks[0]?.t === "h") ? `# ${title}\n\n` : "");
}
