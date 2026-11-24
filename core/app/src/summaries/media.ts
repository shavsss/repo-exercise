// Pictures in the summaries: upload to the artifact's asset store (or, where there is none,
// a reduced copy kept in the summary itself), and drawing the marks onto a picture for export.
import type { Shape } from "./model";
import { SHAPE_HEX, TEXT_MIN_PX, TEXT_SCALE, textInk } from "./markStyle";
import { drawMark } from "./marks";


function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => resolve(im);
    im.onerror = () => reject(new Error("התמונה לא נטענה"));
    im.src = src;
  });
}

async function reduce(file: Blob, max = 1600): Promise<{ blob: Blob; w: number; h: number }> {
  const url = URL.createObjectURL(file);
  try {
    // where blob: pictures are not allowed, the same bytes as a data URL
    const im = await loadImage(url).catch(async () => loadImage(await toDataUrl(file)));
    const s = Math.min(1, max / Math.max(im.naturalWidth, im.naturalHeight));
    const w = Math.round(im.naturalWidth * s);
    const h = Math.round(im.naturalHeight * s);
    if (s === 1 && file.size < 2_500_000) return { blob: file, w, h };
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    c.getContext("2d")!.drawImage(im, 0, 0, w, h);
    const blob = await new Promise<Blob>((res) => c.toBlob((b) => res(b ?? file), "image/webp", 0.86));
    return { blob, w, h };
  } finally {
    URL.revokeObjectURL(url);
  }
}

const toDataUrl = (b: Blob) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = () => rej(r.error);
    r.readAsDataURL(b);
  });

/** A data URL as bytes, without fetch (the page's policy may not let fetch read data: URLs). */
export function dataUrlBlob(url: string): Blob {
  const [head, body] = url.split(",", 2);
  const type = /data:([^;,]+)/.exec(head)?.[1] ?? "image/png";
  const bin = /;base64/.test(head) ? atob(body) : decodeURIComponent(body);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type });
}

/** Stores a picture; returns its address and size. */
export async function storeImage(file: Blob, note?: (step: string, err: unknown) => void): Promise<{ src: string; w: number; h: number }> {
  const assets = window.__assets;
  if (assets) {
    const { blob, w, h } = await reduce(file);
    try {
      const r = await assets.upload(blob);
      return { src: r.url, w, h };
    } catch (e) {
      // the store refused it: a smaller copy inside the summary, so the picture is not lost
      note?.("upload", e);
    }
  }
  // no asset store here: a smaller copy inside the summary
  const { blob, w, h } = await reduce(file, 1100);
  return { src: await toDataUrl(blob), w, h };
}

/** A text box as picText.tsx draws it: a white card with a coloured edge, its letters scaled to the picture. */
function textBox(g: CanvasRenderingContext2D, s: Shape, w: number, h: number) {
  // the picture is drawn at its natural size; on screen the letters are TEXT_SCALE of the shown width
  const fs = Math.max(TEXT_MIN_PX, w * TEXT_SCALE * (s.size ?? 1));
  const pad = fs * 0.45;
  const lh = fs * 1.35;
  const right = (s.x1 / 1000) * w;
  const top = (s.y1 / 1000) * h;
  g.font = `600 ${fs}px "IBM Plex Sans Hebrew", Arial, sans-serif`;
  const rtl = /[\u0590-\u05FF]/.test(s.text ?? "");
  g.direction = rtl ? "rtl" : "ltr";
  const boxW = s.x2 < s.x1 ? ((s.x1 - s.x2) / 1000) * w : 0;
  const lines: string[] = [];
  for (const para of (s.text ?? "").split("\n")) {
    if (!boxW) {
      lines.push(para);
      continue;
    }
    let cur = "";
    for (const word of para.split(" ")) {
      const next = cur ? `${cur} ${word}` : word;
      if (cur && g.measureText(next).width > boxW - 2 * pad) {
        lines.push(cur);
        cur = word;
      } else cur = next;
    }
    lines.push(cur);
  }
  // as on screen: the box hugs its text, up to its width
  const bw = Math.min(boxW || Infinity, Math.max(...lines.map((l) => g.measureText(l).width)) + 2 * pad);
  const bh = lines.length * lh + 2 * pad - (lh - fs);
  const left = right - bw;
  const r = fs * 0.35;
  g.beginPath();
  g.roundRect(left, top, bw, bh, r);
  g.fillStyle = "rgba(255,255,255,0.94)";
  g.fill();
  g.lineWidth = Math.max(1.5, fs / 9);
  g.strokeStyle = SHAPE_HEX[s.color];
  g.stroke();
  g.fillStyle = textInk(s.color);
  g.textBaseline = "top";
  g.textAlign = rtl ? "right" : "left";
  lines.forEach((l, k) => g.fillText(l, rtl ? right - pad : left + pad, top + pad + k * lh));
}

/** The picture with its marks drawn on it, as PNG bytes (for Word) and a data URL (for HTML). */
export async function flatten(src: string, marks: Shape[]): Promise<{ png: Uint8Array; url: string; w: number; h: number }> {
  const im = await loadImage(src);
  const w = im.naturalWidth;
  const h = im.naturalHeight;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  g.fillStyle = "#fff";
  g.fillRect(0, 0, w, h);
  g.drawImage(im, 0, 0);
  for (const s of marks) {
    if (s.t !== "text") drawMark(g, s, w, h);
    else if (s.text) textBox(g, s, w, h);
  }
  const url = c.toDataURL("image/png");
  const bin = atob(url.split(",")[1]);
  const png = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) png[i] = bin.charCodeAt(i);
  return { png, url, w, h };
}
