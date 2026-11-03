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
  const els = Array.from(root.querySelectorAll("img, canvas, svg")).filter((el) => {
    if (el instanceof SVGSVGElement && el.parentElement?.closest("svg")) return false;
    if (el.closest(".icon, .btn, .icon-btn, .block-tab, .bk-ribbon, .composer, nav, header.block-head, .bk-plate-svg")) return false;
    const { w, h } = size(el);
    return w >= MIN_W && h >= MIN_H;
  });
  const out: LessonVisual[] = [];
  const seen = new Set<string>();
  for (const el of els) {
    const box = el.closest(".viz, .sim, .block, figure") ?? el.parentElement;
    const title = clean(box?.querySelector(".viz-title, .block-title, .tb-title, .sim-caption, h4")?.textContent) || clean(el.getAttribute("aria-label")) || clean((el as HTMLImageElement).alt);
    // a book figure's title block: its cells (kind, number, source, page) after the title
    const cells = Array.from(box?.querySelectorAll(".tb-cell") ?? []).map((c) => clean(c.textContent)).filter(Boolean);
    const caption = cells.length ? cells.join(" · ") : clean(box?.querySelector("figcaption")?.textContent);
    try {
      const r = await rasterize(el);
      if (!r) continue;
      const key = `${title}|${caption}|${el.tagName}|${Math.round(r.w / 40)}|${Math.round(r.h / 40)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ ...r, title: title.slice(0, 160), caption: caption.slice(0, 240) });
    } catch {
      // a picture that cannot be read back (another origin) is left out
    }
    if (out.length >= 40) break;
  }
  return out;
}
