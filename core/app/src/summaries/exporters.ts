// Export of a summary: Word (.docx, with native Word equations) and a single HTML file.
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  Math as DMath,
  MathCurlyBrackets,
  MathFraction,
  MathIntegral,
  MathRadical,
  MathRoundBrackets,
  MathRun,
  MathSquareBrackets,
  MathSubScript,
  MathSubSuperScript,
  MathSum,
  MathSuperScript,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { convertLatexToMathMl } from "mathlive";
import { figure } from "../library";
import type { Block, BoxAlign, BoxKind, ImgSize, MarkColor } from "./model";
import { tidyTex } from "./rich";
import { BOX_EMOJI, BOX_LABEL, BULLET_SIGN, PROOF_LABEL, esc, flatLists, headParts, itemNumbers, numbering, textOf } from "./model";
import { flatten } from "./media";

type MathComponent = ConstructorParameters<typeof DMath>[0]["children"][number];

const PROOF_HEX: Record<string, string> = { def: "#355f7d", hyp: "#b0590c", giv: "#555", dev: "#6a4c8c", con: "#2e7d32" };
const MARK_FILL: Record<MarkColor, string> = { y: "FFF1A6", r: "F7C9C3", b: "CFE1F2", g: "D2EBD4", p: "E6D6F2", o: "FBDDBF" };
const BOX_COLOR: Record<BoxKind, [string, string]> = {
  def: ["355F7D", "E4ECF1"],
  eq: ["6A4C8C", "ECE6F1"],
  ex: ["8A6100", "F4EBD6"],
  err: ["A3161A", "F6E0DD"],
  q: ["9A4F12", "F4E5D6"],
  con: ["2E7D32", "E2F0E3"],
};
const WIDTH: Record<ImgSize, number> = { s: 200, m: 380, l: 600 };
const FONT = "Arial";
const hasRtl = (s: string) => /[֐-׿]/.test(s);

/* ---------------- MathML → Word equations ---------------- */
function mathml(latex: string): Element | null {
  try {
    const xml = `<math xmlns="http://www.w3.org/1998/Math/MathML">${convertLatexToMathMl(latex)}</math>`;
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    return doc.querySelector("parsererror") ? null : doc.documentElement;
  } catch {
    return null;
  }
}
function toWord(n: Element): MathComponent[] {
  const kids = Array.from(n.children);
  const all = () => kids.flatMap(toWord);
  const at = (i: number) => (kids[i] ? toWord(kids[i]) : []);
  switch (n.localName) {
    case "mi":
    case "mn":
    case "mo":
    case "mtext":
    case "ms":
      return n.textContent ? [new MathRun(n.textContent)] : [];
    case "mspace":
      return [new MathRun(" ")];
    case "mfrac":
      return [new MathFraction({ numerator: at(0), denominator: at(1) })];
    case "msup":
      return [new MathSuperScript({ children: at(0), superScript: at(1) })];
    case "msub":
      return [new MathSubScript({ children: at(0), subScript: at(1) })];
    case "msubsup":
      return [new MathSubSuperScript({ children: at(0), subScript: at(1), superScript: at(2) })];
    case "msqrt":
      return [new MathRadical({ children: all() })];
    case "mroot":
      return [new MathRadical({ children: at(0), degree: at(1) })];
    case "munderover":
    case "munder":
    case "mover": {
      const base = kids[0]?.textContent ?? "";
      const lo = n.localName === "mover" ? [] : at(1);
      const hi = n.localName === "munderover" ? at(2) : n.localName === "mover" ? at(1) : [];
      if (base === "∑") return [new MathSum({ children: [], subScript: lo, superScript: hi })];
      if (base === "∫") return [new MathIntegral({ children: [], subScript: lo, superScript: hi })];
      return [new MathSubSuperScript({ children: at(0), subScript: lo, superScript: hi })];
    }
    case "mfenced": {
      const open = n.getAttribute("open") ?? "(";
      const B = open === "[" ? MathSquareBrackets : open === "{" ? MathCurlyBrackets : MathRoundBrackets;
      return [new B({ children: all() })];
    }
    case "annotation":
    case "annotation-xml":
      return [];
    case "semantics":
      return at(0);
    default:
      return all();
  }
}
function wordMath(latex: string): DMath {
  const m = mathml(tidyTex(latex));
  return new DMath({ children: m ? toWord(m) : [new MathRun(latex)] });
}

/* ---------------- inline HTML → runs ---------------- */
function runs(html: string, base: { bold?: boolean; color?: string } = {}): (TextRun | DMath)[] {
  const box = document.createElement("div");
  box.innerHTML = html;
  const out: (TextRun | DMath)[] = [];
  const walk = (node: Node, st: { bold?: boolean; italics?: boolean; mark?: MarkColor; sub?: boolean; sup?: boolean }) => {
    if (node.nodeType === 3) {
      const text = node.textContent ?? "";
      if (!text) return;
      out.push(
        new TextRun({
          text,
          font: FONT,
          size: 23,
          bold: st.bold || base.bold,
          italics: st.italics,
          color: base.color,
          subScript: st.sub,
          superScript: st.sup,
          rightToLeft: hasRtl(text),
          ...(st.mark ? { shading: { type: ShadingType.CLEAR, color: "auto", fill: MARK_FILL[st.mark] } } : {}),
        }),
      );
      return;
    }
    if (node.nodeType !== 1) return;
    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    if (tag === "span" && el.classList.contains("im")) {
      out.push(wordMath(el.getAttribute("data-tex") ?? ""));
      return;
    }
    if (tag === "br") {
      out.push(new TextRun({ text: "", break: 1 }));
      return;
    }
    const next = { ...st };
    if (tag === "b" || tag === "strong") next.bold = true;
    if (tag === "i" || tag === "em") next.italics = true;
    if (tag === "sub") next.sub = true;
    if (tag === "sup") next.sup = true;
    if (tag === "mark") next.mark = (el.className.match(/hl-([yrbgpo])/)?.[1] as MarkColor) ?? "y";
    el.childNodes.forEach((c) => walk(c, next));
  };
  box.childNodes.forEach((c) => walk(c, {}));
  return out;
}
const para = (children: (TextRun | DMath | ImageRun)[], extra: Record<string, unknown> = {}) => new Paragraph({ bidirectional: true, alignment: AlignmentType.START, spacing: { after: 120, line: 300 }, children, ...extra });

/**
 * A block's text as Word paragraphs: its lines, and each item of a list inside it as a paragraph
 * of its own with its number (1., 1.1) or bullet, indented by depth.
 */
function paras(html: string, base: { bold?: boolean; color?: string } = {}, align?: BoxAlign) {
  const al = align && align !== "start" ? { alignment: { center: AlignmentType.CENTER, end: AlignmentType.END, justify: AlignmentType.JUSTIFIED }[align] } : {};
  if (!/<(ol|ul)[ >]/.test(html)) return [para(runs(html, base), al)];
  return flatLists(html, (d) => `\u0005${d}\u0005`)
    .split(/<br>/)
    .map((line) => {
      const m = /^\u0005(\d+)\u0005/.exec(line);
      if (!m) return para(runs(line, base), { spacing: { after: 40, line: 300 }, ...al });
      const d = Number(m[1]);
      return para(runs(line.slice(m[0].length), base), { indent: { start: 360 * (d + 1), hanging: 300 }, spacing: { after: 40, line: 300 } });
    });
}

async function picture(b: Extract<Block, { t: "img" } | { t: "fig" }>) {
  const src = b.t === "img" ? b.src : (await figure(b.doc, b.key))?.d;
  if (!src) return null;
  return flatten(src, b.marks);
}

/** The summary as a Word document. */
export async function toDocx(title: string, blocks: Block[]) {
  const { heads, eqs } = numbering(blocks);
  const children: (Paragraph | Table)[] = [];
  for (const b of blocks) {
    if (b.t === "h" && b.cont) {
      if (textOf(b.html).trim()) children.push(...paras(b.html));
    } else if (b.t === "h") {
      const n = heads.get(b.id);
      const level = b.plain && b === blocks[0] ? HeadingLevel.TITLE : [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3][b.level - 1];
      const { head, rest } = headParts(b.html);
      children.push(para([new TextRun({ text: `${b.emoji ? b.emoji + " " : ""}${n ? n + " " : ""}`, font: FONT, rightToLeft: true, bold: b.level < 3 }), ...runs(head, { bold: b.level < 3 })], { heading: level, spacing: { before: 240, after: 120 } }));
      if (rest) children.push(...paras(rest));
    } else if (b.t === "p") {
      if (textOf(b.html).trim()) children.push(...paras(b.html));
    } else if (b.t === "list") {
      const nums = itemNumbers(b.items);
      b.items.forEach((it, i) => children.push(para([new TextRun({ text: `${b.ordered ? nums[i] : "•"} `, font: FONT, rightToLeft: true }), ...runs(it.html)], { indent: { start: 360 * (it.level + 1), hanging: 280 }, spacing: { after: 60, line: 300 } })));
    } else if (b.t === "box") {
      const [fg, bg] = BOX_COLOR[b.kind];
      const inner: Paragraph[] = [
        para(
          [
            new TextRun({ text: `${BOX_EMOJI[b.kind]} ${BOX_LABEL[b.kind]}`, font: FONT, bold: true, color: fg, size: 20, rightToLeft: true }),
            ...(b.title?.trim() ? [new TextRun({ text: `  ${b.title.trim()}`, font: FONT, bold: true, color: fg, size: 23, rightToLeft: true })] : []),
          ],
          { spacing: { after: 60 } },
        ),
      ];
      if (b.latex?.trim()) inner.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [wordMath(b.latex), ...(eqs.get(b.id) ? [new TextRun({ text: `   (${eqs.get(b.id)})`, font: FONT })] : [])] }));
      if (textOf(b.html).trim()) inner.push(...paras(b.html, {}, b.align));
      const side = { style: BorderStyle.SINGLE, size: 18, color: fg };
      const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          visuallyRightToLeft: true,
          rows: [new TableRow({ children: [new TableCell({ children: inner, shading: { type: ShadingType.CLEAR, color: "auto", fill: bg }, margins: { top: 100, bottom: 100, left: 160, right: 160 }, borders: { top: none, bottom: none, left: none, right: side } })] })],
        }),
        para([]),
      );
    } else if (b.t === "math") {
      if (b.latex.trim()) children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 120 }, children: [wordMath(b.latex), ...(eqs.get(b.id) ? [new TextRun({ text: `   (${eqs.get(b.id)})`, font: FONT })] : [])] }));
    } else if (b.t === "img" || b.t === "fig") {
      const pic = await picture(b).catch(() => null);
      if (pic) {
        const w = WIDTH[b.size];
        children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: "png", data: pic.png, transformation: { width: w, height: Math.round((w * pic.h) / pic.w) } })] }));
      }
      if (b.caption.trim()) children.push(para([new TextRun({ text: b.caption, font: FONT, size: 19, italics: true, color: "555555", rightToLeft: true })], { alignment: AlignmentType.CENTER }));
    } else if (b.t === "hr") children.push(new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "999999", space: 4 } }, children: [] }));
  }
  const doc = new Document({ creator: "סיכומים", title, sections: [{ properties: {}, children }] });
  return new Uint8Array(await (await Packer.toBlob(doc)).arrayBuffer());
}

/* ---------------- one HTML file ---------------- */
const HTML_CSS = `
:root{--ink:#22261d;--muted:#676a58;--line:#d8d4c3;--paper:#fbfaf4;--bg:#e6e3d7;--accent:#b3261e}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.9 "IBM Plex Sans Hebrew",Arial,sans-serif;direction:rtl}
main{max-width:46rem;margin:24px auto;padding:32px 40px;background:var(--paper);border:1px solid var(--line);
background-image:linear-gradient(to left,transparent 2.4rem,#e8a4a0 2.4rem,#e8a4a0 calc(2.4rem + 1px),transparent calc(2.4rem + 1px));}
h1,h2,h3,h4{line-height:1.35;margin:1.4em 0 .4em}h4{font-weight:400}.num{color:var(--accent);font-family:"IBM Plex Mono",monospace;margin-inline-end:.4em;font-weight:500}
p{margin:0 0 .6em}mark{color:inherit;padding:0}.hl-y{background:#fff1a6}.hl-r{background:#f7c9c3}.hl-b{background:#cfe1f2}.hl-g{background:#d2ebd4}.hl-p{background:#e6d6f2}.hl-o{background:#fbddbf}
.box{border-radius:6px;padding:10px 14px;margin:14px 0;border-inline-start:4px solid}.box .lbl{display:block;font-size:.78em;font-weight:700;letter-spacing:.02em}
.box .ttl{color:inherit;font-size:1.25em;margin-inline-start:.6em}.box-def{background:#e4ecf1;border-color:#355f7d}.box-def .lbl{color:#355f7d}.box-eq{background:#ece6f1;border-color:#6a4c8c}.box-eq .lbl{color:#6a4c8c}
.box-ex{background:#f4ebd6;border-color:#8a6100}.box-ex .lbl{color:#8a6100}.box-err{background:#f6e0dd;border-color:#a3161a}.box-err .lbl{color:#a3161a}
.box-q{background:#f4e5d6;border-color:#9a4f12}.box-q .lbl{color:#9a4f12}
.box-con{background:#e2f0e3;border-color:#2e7d32}.box-con .lbl{color:#2e7d32}
.eq{display:flex;justify-content:center;align-items:center;gap:1.2em;margin:.8em 0;direction:ltr}.eqn{color:var(--muted);font-size:.85em}
math{font-size:1.1em}figure{margin:1em auto;text-align:center}figure img{max-width:100%}figcaption{font-size:.85em;color:var(--muted)}
figure.s{max-width:33%}figure.m{max-width:62%}figure.l{max-width:100%}ul.l,ol.l{padding-inline-start:1.4em;margin:.2em 0 .8em}li.lv1{margin-inline-start:1.4em}li.lv2{margin-inline-start:2.8em}
hr{border:none;border-top:1px solid var(--line);margin:1.4em 0}.p{margin:0 0 .6em}
.p ol,.p ul{margin:.1em 0 .2em;padding-inline-start:2.1em}.p ol{list-style:none;counter-reset:li}.p ol>li{counter-increment:li;position:relative}
.p ol>li::before{content:counters(li,".") ".";position:absolute;inset-inline-end:100%;margin-inline-end:.45em;color:var(--accent);font-family:"IBM Plex Mono",monospace;font-size:.86em}
.p li ol>li::before{content:counters(li,".")}.p li ol,.p li ul{margin:0;padding-inline-start:2.4em}.p li ul{list-style:circle}
${Object.entries(BULLET_SIGN).filter(([k]) => k).map(([k, c]) => `.p ul.b-${k}{list-style-type:"${c}  "}`).join("")}
.p ol.n-heb>li::before{content:counter(li,hebrew) "."}.p ol.n-alpha>li::before{content:counter(li,lower-alpha) "."}.p ol.n-roman>li::before{content:counter(li,lower-roman) "."}
.p li ol.proof{padding-inline-start:2.4em}.p ol.proof{padding-inline-start:0;counter-reset:def hyp giv dev con}.p ol.proof>li{counter-increment:none}.p ol.proof>li::before{position:static;margin-inline-end:.4em;font-family:inherit;font-weight:700;font-size:1em}
${Object.entries(PROOF_LABEL).map(([k, l]) => `.p ol.proof>li.k-${k}{counter-increment:${k}}.p ol.proof>li.k-${k}::before{content:"${l} " counter(${k}) ":";color:${PROOF_HEX[k]}}`).join("")}`;

const mathHtml = (latex: string, display = true) => {
  try {
    return `<math${display ? ' display="block"' : ""}>${convertLatexToMathMl(tidyTex(latex))}</math>`;
  } catch {
    return `<code>${esc(latex)}</code>`;
  }
};
const unq = (s: string) => s.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
/** equations inside a line, as MathML */
const inl = (html: string) => html.replace(/<ol start="(\d+)">/g, (_, n) => `<ol start="${n}" style="counter-reset:li ${Number(n) - 1}">`).replace(/<span[^>]*data-tex="([^"]*)"[^>]*>.*?<\/span>/g, (_, t) => mathHtml(unq(t), false));

/** The summary as one HTML file that opens in any browser, pictures included. */
export async function toHtml(title: string, blocks: Block[]) {
  const { heads, eqs } = numbering(blocks);
  const out: string[] = [];
  for (const b of blocks) {
    if (b.t === "h" && b.cont) {
      if (textOf(b.html).trim()) out.push(`<div class="p">${inl(b.html)}</div>`);
    } else if (b.t === "h") {
      const n = heads.get(b.id);
      const tag = b.plain && b === blocks[0] ? "h1" : `h${b.level + 1}`;
      const { head, rest } = headParts(b.html);
      out.push(`<${tag}>${b.emoji ? `${b.emoji} ` : ""}${n ? `<span class="num">${n}</span>` : ""}${inl(head)}</${tag}>`);
      if (rest) out.push(`<div class="p">${inl(rest)}</div>`);
    } else if (b.t === "p") {
      if (textOf(b.html).trim()) out.push(`<div class="p">${inl(b.html)}</div>`);
    } else if (b.t === "list") {
      const nums = itemNumbers(b.items);
      out.push(`<ul class="l" style="list-style:none">${b.items.map((it, i) => `<li class="lv${it.level}">${b.ordered ? nums[i] : "•"} ${inl(it.html)}</li>`).join("")}</ul>`);
    } else if (b.t === "box") {
      out.push(`<div class="box box-${b.kind}"><span class="lbl">${BOX_EMOJI[b.kind]} ${BOX_LABEL[b.kind]}${b.title?.trim() ? `<b class="ttl">${esc(b.title.trim())}</b>` : ""}</span>${b.latex?.trim() ? `<div class="eq">${mathHtml(b.latex)}${eqs.get(b.id) ? `<span class="eqn">(${eqs.get(b.id)})</span>` : ""}</div>` : ""}${textOf(b.html).trim() ? `<div class="p"${b.align && b.align !== "start" ? ` style="text-align:${b.align}"` : ""}>${inl(b.html)}</div>` : ""}</div>`);
    } else if (b.t === "math") {
      if (b.latex.trim()) out.push(`<div class="eq">${mathHtml(b.latex)}${eqs.get(b.id) ? `<span class="eqn">(${eqs.get(b.id)})</span>` : ""}</div>`);
    } else if (b.t === "img" || b.t === "fig") {
      const pic = await picture(b).catch(() => null);
      out.push(`<figure class="${b.size}">${pic ? `<img src="${pic.url}" alt="${esc(b.caption)}">` : ""}${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ""}</figure>`);
    } else if (b.t === "hr") out.push("<hr>");
  }
  return `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Hebrew:wght@400;600;700&family=IBM+Plex+Mono&display=swap"><style>${HTML_CSS}</style></head><body><main>${out.join("\n")}</main></body></html>`;
}

/** Hands a file to the viewer through the artifact's downloads capability. */
export async function saveFile(filename: string, data: Uint8Array | string) {
  const dl = window.__downloads;
  if (!dl) throw new Error("ההורדות לא זמינות בתצוגה הזו");
  return dl.save({ filename, data });
}
