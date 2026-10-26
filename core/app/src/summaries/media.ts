// Pictures in the summaries: upload to the artifact's asset store (or, where there is none,
// a reduced copy kept in the summary itself), and drawing the marks onto a picture for export.
import type { Shape, ShapeColor } from "./model";

/** Fixed colours for the marks drawn on pictures, readable on any picture. */
export const SHAPE_HEX: Record<ShapeColor, string> = { y: "#e0a800", r: "#d32f2f", b: "#1f6fb2", g: "#2e7d32", k: "#222222" };

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
    const im = await loadImage(url);
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

/** Stores a picture; returns its address and size. */
export async function storeImage(file: Blob): Promise<{ src: string; w: number; h: number }> {
  const assets = window.__assets;
  if (assets) {
    const { blob, w, h } = await reduce(file);
    const r = await assets.upload(blob);
    return { src: r.url, w, h };
  }
  // no asset store here: a smaller copy inside the summary
  const { blob, w, h } = await reduce(file, 1100);
  return { src: await toDataUrl(blob), w, h };
}

function arrowHead(g: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, size: number) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  g.beginPath();
  g.moveTo(x2, y2);
  g.lineTo(x2 - size * Math.cos(a - 0.45), y2 - size * Math.sin(a - 0.45));
  g.lineTo(x2 - size * Math.cos(a + 0.45), y2 - size * Math.sin(a + 0.45));
  g.closePath();
  g.fill();
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
  const lw = Math.max(2, Math.round(Math.max(w, h) / 260));
  for (const s of marks) {
    const x1 = (s.x1 / 1000) * w;
    const y1 = (s.y1 / 1000) * h;
    const x2 = (s.x2 / 1000) * w;
    const y2 = (s.y2 / 1000) * h;
    g.strokeStyle = g.fillStyle = SHAPE_HEX[s.color];
    g.lineWidth = lw;
    if (s.t === "arrow") {
      g.beginPath();
      g.moveTo(x1, y1);
      g.lineTo(x2, y2);
      g.stroke();
      arrowHead(g, x1, y1, x2, y2, lw * 5);
    } else if (s.t === "rect") g.strokeRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
    else if (s.t === "ellipse") {
      g.beginPath();
      g.ellipse((x1 + x2) / 2, (y1 + y2) / 2, Math.abs(x2 - x1) / 2, Math.abs(y2 - y1) / 2, 0, 0, Math.PI * 2);
      g.stroke();
    } else if (s.t === "text" && s.text) {
      const fs = Math.max(14, Math.round(h / 22));
      g.font = `600 ${fs}px "IBM Plex Sans Hebrew", Arial, sans-serif`;
      g.direction = "rtl";
      g.textBaseline = "top";
      const tw = g.measureText(s.text).width;
      g.fillStyle = "rgba(255,255,255,0.85)";
      g.fillRect(x1 - tw - 6, y1 - 3, tw + 12, fs + 8);
      g.fillStyle = SHAPE_HEX[s.color];
      g.fillText(s.text, x1, y1);
    }
  }
  const url = c.toDataURL("image/png");
  const bin = atob(url.split(",")[1]);
  const png = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) png[i] = bin.charCodeAt(i);
  return { png, url, w, h };
}
