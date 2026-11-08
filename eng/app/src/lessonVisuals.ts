// The pictures of the lesson open in this window, as PNG images: charts, drawn figures (SVG), book figures,
// simulations and animations (canvas). The summaries window (#summary) asks for them over the lesson channel
// ("visuals?") to put one in the summary as a picture. In the book the hidden galley holds every block of the
// lesson, so the whole lesson is there, not only the open pages. Same file in both apps.

export interface LessonVisual {
  /** PNG data URL */
  url: string;
  w: number;
  h: number;
  title: string;
  caption: string;
}

const MAX = 1600;
const MIN_W = 120;
const MIN_H = 80;

/** SVG painted standalone loses the page's CSS (variables, classes): copy the computed look onto each element. */
// not visibility or display: the book's hidden galley copy would come out empty
const SVG_PROPS = ["fill", "fill-opacity", "stroke", "stroke-width", "stroke-opacity", "stroke-dasharray", "stroke-linecap", "stroke-linejoin", "opacity", "font-family", "font-size", "font-weight", "font-style", "text-anchor", "dominant-baseline", "letter-spacing", "color", "marker-end", "marker-start"];

function inlineSvg(src: SVGSVGElement): { text: string; w: number; h: number } {
  const r = src.getBoundingClientRect();
  const vb = src.viewBox?.baseVal;
  const w = Math.round(r.width || vb?.width || Number(src.getAttribute("width")) || 600);
  const h = Math.round(r.height || vb?.height || Number(src.getAttribute("height")) || 400);
  const clone = src.cloneNode(true) as SVGSVGElement;
  const a = [src, ...Array.from(src.querySelectorAll("*"))];
  const b = [clone, ...Array.from(clone.querySelectorAll("*"))];
  a.forEach((el, i) => {
    const cs = getComputedStyle(el);
    const t = b[i] as SVGElement;
    let style = "";
    for (const p of SVG_PROPS) {
      const v = cs.getPropertyValue(p);
      if (v) style += `${p}:${v};`;
    }
    t.setAttribute("style", style + (t.getAttribute("style") ?? ""));
  });
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(w));
  clone.setAttribute("height", String(h));
  return { text: new XMLSerializer().serializeToString(clone), w, h };
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((ok, bad) => {
    const im = new Image();
    im.onload = () => ok(im);
    im.onerror = () => bad(new Error("image"));
    im.src = src;
  });
}

/** the background the visual sits on in the lesson, so light ink stays readable in the dark theme */
function backdrop(el: Element): string {
  for (let e: Element | null = el; e; e = e.parentElement) {
    const c = getComputedStyle(e).backgroundColor;
    if (c && c !== "transparent" && !/rgba\(.*,\s*0\)$/.test(c)) return c;
  }
  return "#ffffff";
}

function paint(src: CanvasImageSource, w: number, h: number, bg: string) {
  const s = Math.min(2, MAX / Math.max(w, h));
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w * s));
  c.height = Math.max(1, Math.round(h * s));
  const g = c.getContext("2d")!;
  g.fillStyle = bg;
  g.fillRect(0, 0, c.width, c.height);
  g.drawImage(src, 0, 0, c.width, c.height);
  return { url: c.toDataURL("image/png"), w: c.width, h: c.height };
}

/** a canvas that draws nothing (a 3D scene without a kept buffer) reads back as one flat color */
function blank(c: HTMLCanvasElement) {
  try {
    const t = document.createElement("canvas");
    t.width = 24;
    t.height = 24;
    const g = t.getContext("2d")!;
    g.drawImage(c, 0, 0, 24, 24);
    const d = g.getImageData(0, 0, 24, 24).data;
    for (let i = 4; i < d.length; i += 4) if (d[i] !== d[0] || d[i + 1] !== d[1] || d[i + 2] !== d[2] || d[i + 3] !== d[3]) return false;
    return true;
  } catch {
    return true;
  }
}

/** a cell's text, with each formula as its TeX source (KaTeX keeps it in an annotation) */
function cellText(c: HTMLTableCellElement) {
  const k = c.cloneNode(true) as HTMLElement;
  k.querySelectorAll(".katex").forEach((m) => {
    const tex = m.querySelector("annotation")?.textContent ?? "";
    m.replaceWith(document.createTextNode(tex ? ` ${tex} ` : ""));
  });
  return clean(k.textContent);
}

/** A table drawn on a canvas cell by cell, in the colors and direction it has in the lesson. */
function tableImage(t: HTMLTableElement, bg: string) {
  const cs = getComputedStyle(t);
  const rtl = cs.direction === "rtl";
  const ink = cs.color || "#222";
  const firstCell = t.querySelector("td, th");
  const line = (firstCell && getComputedStyle(firstCell).borderBottomColor) || "#bbb";
  const family = cs.fontFamily || "sans-serif";
  const rows = Array.from(t.rows).map((r) => Array.from(r.cells).map((c) => ({ text: cellText(c), head: c.tagName === "TH" || r.parentElement?.tagName === "THEAD" })));
  if (!rows.length) return null;
  const cols = Math.max(...rows.map((r) => r.length));
  const S = 2, FS = 14, PAD = 9, LH = 20, MAXW = 300;
  const g0 = document.createElement("canvas").getContext("2d")!;
  const fontOf = (head: boolean) => `${head ? 700 : 400} ${FS}px ${family}`;
  const wrap = (text: string, head: boolean) => {
    g0.font = fontOf(head);
    const out: string[] = [];
    let cur = "";
    for (const w of text.split(" ")) {
      const next = cur ? `${cur} ${w}` : w;
      if (cur && g0.measureText(next).width > MAXW) {
        out.push(cur);
        cur = w;
      } else cur = next;
    }
    out.push(cur);
    return out;
  };
  const cells = rows.map((r) => r.map((c) => ({ ...c, lines: wrap(c.text, c.head) })));
  const widths = Array.from({ length: cols }, (_, j) =>
    Math.min(MAXW, Math.max(36, ...cells.map((r) => (r[j] ? Math.max(...r[j].lines.map((l) => (g0.font = fontOf(r[j].head), g0.measureText(l).width))) : 0)))) + 2 * PAD,
  );
  const heights = cells.map((r) => Math.max(...r.map((c) => c.lines.length)) * LH + 2 * PAD - 6);
  const W = widths.reduce((a, b) => a + b, 0) + 1;
  const H = heights.reduce((a, b) => a + b, 0) + 1;
  const c = document.createElement("canvas");
  c.width = Math.round(W * S);
  c.height = Math.round(H * S);
  const g = c.getContext("2d")!;
  g.scale(S, S);
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);
  g.textBaseline = "top";
  let y = 0.5;
  cells.forEach((r, i) => {
    let x = rtl ? W - 0.5 : 0.5;
    r.forEach((cell, j) => {
      const w = widths[j];
      const left = rtl ? x - w : x;
      if (cell.head) {
        g.fillStyle = "rgba(127,127,127,0.13)";
        g.fillRect(left, y, w, heights[i]);
      }
      g.strokeStyle = line;
      g.lineWidth = 1;
      g.strokeRect(left, y, w, heights[i]);
      g.fillStyle = ink;
      g.font = fontOf(cell.head);
      const strong = /[\u0590-\u05FF]/.test(cell.text);
      g.direction = strong || rtl ? "rtl" : "ltr";
      g.textAlign = g.direction === "rtl" ? "right" : "left";
      cell.lines.forEach((l, k) => g.fillText(l, g.direction === "rtl" ? left + w - PAD : left + PAD, y + PAD - 2 + k * LH));
      x = rtl ? x - w : x + w;
    });
    y += heights[i];
  });
  return { url: c.toDataURL("image/png"), w: c.width, h: c.height };
}

async function rasterize(el: Element): Promise<{ url: string; w: number; h: number } | null> {
  const bg = backdrop(el);
  if (el instanceof HTMLImageElement) {
    // a lazy picture the reader has not scrolled to yet (or the book's hidden galley) is loaded here
    const im = el.complete && el.naturalWidth ? el : el.currentSrc || el.src ? await loadImg(el.currentSrc || el.src) : null;
    if (!im || !im.naturalWidth) return null;
    return paint(im, im.naturalWidth, im.naturalHeight, bg);
  }
  if (el instanceof HTMLCanvasElement) {
    if (!el.width || !el.height || blank(el)) return null;
    return paint(el, el.width, el.height, bg);
  }
  if (el instanceof HTMLTableElement) return tableImage(el, bg);
  if (el instanceof SVGSVGElement) {
    const { text, w, h } = inlineSvg(el);
    const url = URL.createObjectURL(new Blob([text], { type: "image/svg+xml" }));
    try {
      const im = await loadImg(url);
      return paint(im, w, h, bg);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  return null;
}

const size = (el: Element) => {
  const r = el.getBoundingClientRect();
  if (r.width) return { w: r.width, h: r.height };
  if (el instanceof HTMLImageElement) return { w: el.naturalWidth || el.width, h: el.naturalHeight || el.height };
  if (el instanceof HTMLCanvasElement) return { w: el.width, h: el.height };
  return { w: 0, h: 0 };
};

const clean = (s?: string | null) => (s ?? "").replace(/\s+/g, " ").trim();

/** Every picture of the lesson in this window, in reading order, without repeats. */
export async function collectVisuals(): Promise<LessonVisual[]> {
  const root = document.querySelector("main.main") ?? document.body;
  const els = Array.from(root.querySelectorAll("img, canvas, svg, table")).filter((el) => {
    if (el instanceof SVGSVGElement && el.parentElement?.closest("svg")) return false;
    if (el.closest(".icon, .btn, .icon-btn, .block-tab, .bk-ribbon, .composer, nav, header.block-head, .bk-plate-svg")) return false;
    if (el instanceof HTMLTableElement) return el.rows.length >= 2 && !el.closest(".katex");
    const { w, h } = size(el);
    return w >= MIN_W && h >= MIN_H;
  });
  const out: LessonVisual[] = [];
  const seen = new Set<string>();
  for (const el of els) {
    const box = el.closest(".viz, .sim, .block, figure") ?? el.parentElement;
    const title = clean(box?.querySelector(".viz-title, .block-title, .tb-title, .sim-caption, h4")?.textContent) || clean(el.getAttribute("aria-label")) || clean((el as HTMLImageElement).alt);
    const tableTitle = el instanceof HTMLTableElement && !box?.querySelector(".viz-title, .block-title") ? `טבלה: ${Array.from(el.rows[0]?.cells ?? []).map((c) => clean(c.textContent)).filter(Boolean).slice(0, 4).join(" · ")}` : "";
    // a book figure's title block: its cells (kind, number, source, page) after the title
    const cells = Array.from(box?.querySelectorAll(".tb-cell") ?? []).map((c) => clean(c.textContent)).filter(Boolean);
    const caption = cells.length ? cells.join(" · ") : clean(box?.querySelector("figcaption")?.textContent);
    try {
      const r = await rasterize(el);
      if (!r) continue;
      const key = `${title}|${caption}|${el.tagName}|${Math.round(r.w / 40)}|${Math.round(r.h / 40)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ ...r, title: (tableTitle || title).slice(0, 160), caption: caption.slice(0, 240) });
    } catch {
      // a picture that cannot be read back (another origin) is left out
    }
    if (out.length >= 40) break;
  }
  return out;
}
