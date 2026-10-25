"""Extract page text, page labels and figures from the military-core library.

For every document in library/military/syllabus/syllabus.py this writes
core/build/lib/<doc>/pages.json (text per PDF page, printed page label, whether
the text came from OCR) and core/build/lib/<doc>/fig/*.webp with an index in
figures.json. Pages without a text layer are OCR'd. Figures are found from
their captions ("Figure 2-8", "FIGURE 2.1", "Fig. 3") and from embedded
images, then cropped from a page render with the body text masked out.

Run with the OCR venv: python extract.py [DOC ...] [--pages A-B] [--force]
"""
import argparse
import html
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[3]
LIB = ROOT / "library" / "military"
OUT = ROOT / "core" / "build" / "lib"
sys.path.insert(0, str(LIB / "syllabus"))
from syllabus import DOCS  # noqa: E402

CAPTION = re.compile(r"^\s*(FIGURE|Figure|FIG\.|Fig\.|Plate|PLATE)\s*[A-Z]?\d+([-.–]\d+[a-z]?)?\b|^\s*(ABOVE|BELOW|LEFT|RIGHT|TOP|BOTTOM|OPPOSITE)\s*[•·]")
RUNNING = re.compile(r"^\s*(Figure|Fig\.)\s*[\d.\-–]+\.?,?\s+(shows|show|illustrates|depicts|is|are|was|gives|presents|compares|plots|summarizes|contains|and|also|indicates|represents|describes)\b")
DETECT_DPI = 100
CROP_DPI = 150
MAX_W = 1100

_ocr = None


def ocr_engine():
    global _ocr
    if _ocr is None:
        from rapidocr_onnxruntime import RapidOCR
        _ocr = RapidOCR()
    return _ocr


def run(*cmd):
    return subprocess.run(cmd, capture_output=True, text=True, check=False).stdout


def page_count(pdf):
    return int(re.search(r"Pages:\s+(\d+)", run("pdfinfo", str(pdf))).group(1))


def bbox_lines(pdf, first, last):
    """Lines with geometry from pdftotext -bbox-layout, per page (points)."""
    raw = run("pdftotext", "-bbox-layout", "-f", str(first), "-l", str(last), str(pdf), "-")
    pages = []
    for pm in re.finditer(r'<page width="([\d.]+)" height="([\d.]+)">(.*?)</page>', raw, re.S):
        w, h, body = float(pm.group(1)), float(pm.group(2)), pm.group(3)
        lines = []
        for lm in re.finditer(r'<line xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*?)</line>', body, re.S):
            words = [html.unescape(x) for x in re.findall(r"<word[^>]*>(.*?)</word>", lm.group(5), re.S)]
            if words:
                lines.append({"box": [float(lm.group(i)) for i in range(1, 5)], "text": " ".join(words), "n": len(words)})
        pages.append({"w": w, "h": h, "lines": lines})
    return pages


def page_text(pdf, page):
    return run("pdftotext", "-f", str(page), "-l", str(page), str(pdf), "-").strip()


def render(pdf, page, dpi, gray=True):
    with tempfile.TemporaryDirectory() as tmp:
        base = Path(tmp) / "p"
        args = ["pdftoppm", "-f", str(page), "-l", str(page), "-r", str(dpi), "-png"]
        if gray:
            args.append("-gray")
        subprocess.run(args + [str(pdf), str(base)], check=True, capture_output=True)
        f = next(Path(tmp).glob("p*.png"))
        return Image.open(f).copy()


def ocr_page(pdf, page):
    """OCR a page; returns (text, lines in points)."""
    img = render(pdf, page, 200, gray=False)
    res, _ = ocr_engine()(np.array(img))
    if not res:
        return "", []
    scale = 72 / 200
    lines = []
    for box, text, _conf in res:
        xs, ys = [p[0] for p in box], [p[1] for p in box]
        lines.append({"box": [min(xs) * scale, min(ys) * scale, max(xs) * scale, max(ys) * scale], "text": text, "n": len(text.split())})
    lines.sort(key=lambda l: (round(l["box"][1] / 6), l["box"][0]))
    text = "\n".join(l["text"] for l in lines)
    return text, lines


def label_candidates(lines, h):
    """Numbers printed in the running head or foot (years left out)."""
    out = []
    for l in lines:
        if l["box"][1] < h * 0.12 or l["box"][3] > h * 0.9:
            for tok in re.split(r"[\s|·•]+", l["text"]):
                if re.fullmatch(r"\d{1,4}", tok) and not re.fullmatch(r"(19|20)\d\d", tok):
                    out.append(int(tok))
                elif re.fullmatch(r"[A-K0-9]{1,2}-\d{1,3}", tok):
                    out.append(tok)  # manual style page numbers: 4-7, B-2
    return out


def resolve_labels(pages):
    """Pick for each page the printed number that agrees with its neighbours' offset."""
    keys = sorted(int(k) for k in pages)
    offs = {k: [c - k for c in pages[str(k)].get("cands", []) if isinstance(c, int)] for k in keys}
    for k in keys:
        dashed = [c for c in pages[str(k)].get("cands", []) if isinstance(c, str)]
        if dashed:
            pages[str(k)]["label"] = dashed[0]
            continue
        window = [o for j in range(k - 12, k + 13) for o in offs.get(j, [])]
        best = None
        if window:
            vals, counts = np.unique(window, return_counts=True)
            if counts.max() >= 3:
                best = int(vals[counts.argmax()])
        pages[str(k)]["label"] = str(k + best) if best is not None and k + best > 0 else None


def image_pages(pdf):
    """Pages with an embedded raster larger than a thumbnail."""
    out = set()
    for line in run("pdfimages", "-list", str(pdf)).splitlines()[2:]:
        parts = line.split()
        if len(parts) > 4 and parts[0].isdigit():
            w, h = int(parts[3]), int(parts[4])
            if w * h > 120_000:
                out.add(int(parts[0]))
    return out


def is_caption(l, lines, col):
    """A caption line, not a sentence in running text that starts with "Figure 9.4"."""
    if not CAPTION.match(l["text"]) or RUNNING.match(l["text"]):
        return False
    x0, y0, x1, y1 = l["box"]
    if l["n"] >= 5 and (x1 - x0) >= 0.85 * col:
        above = any(abs(m["box"][0] - x0) < 6 and 0 <= y0 - m["box"][3] < 5 and m["n"] >= 5 for m in lines if m is not l)
        below = any(abs(m["box"][0] - x0) < 6 and 0 <= m["box"][1] - y1 < 5 and m["n"] >= 5 for m in lines if m is not l)
        if above and below:
            return False
    return True


def find_figures(pdf, page, info, scanned):
    """Return a list of (crop box in points, caption)."""
    W, H = info["w"], info["h"]
    lines = info["lines"]
    img = render(pdf, page, DETECT_DPI)
    a = np.array(img)
    s = DETECT_DPI / 72
    ink = a < 190
    # running head and foot are never part of a figure
    ink[: int(H * 0.06 * s)] = False
    ink[int(H * 0.95 * s):] = False
    widths = sorted(l["box"][2] - l["box"][0] for l in lines if l["n"] >= 6)
    col = widths[int(len(widths) * 0.8)] if widths else W * 0.6
    captions = [l for l in lines if is_caption(l, lines, col)]
    for l in lines:
        x0, y0, x1, y1 = l["box"]
        is_par = l["n"] >= 5 and (x1 - x0) >= 0.55 * col
        if (is_par or scanned and l["n"] >= 5) and l not in captions:
            ink[int(y0 * s) - 1: int(y1 * s) + 2, int(x0 * s) - 1: int(x1 * s) + 2] = False
    grown = ndimage.binary_dilation(ink, iterations=int(0.12 * DETECT_DPI))
    lab, n = ndimage.label(grown)
    comps = []
    for i, sl in enumerate(ndimage.find_objects(lab), 1):
        if sl is None:
            continue
        y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
        area = (y1 - y0) * (x1 - x0)
        density = ink[sl][lab[sl] == i].mean() if area else 0
        if (y1 - y0) / s > 40 and (x1 - x0) / s > 60 and area / (s * s) > 6000 and density > 0.004:
            comps.append([x0 / s, y0 / s, x1 / s, y1 / s])
    if not comps:
        return []
    figs = []
    used = set()
    for c in captions:
        cx0, cy0, cx1, cy1 = c["box"]
        best, bd = None, 1e9
        for k, b in enumerate(comps):
            if k in used:
                continue
            # vertical gap between caption and component, or horizontal for side captions
            vg = max(0, b[1] - cy1, cy0 - b[3])
            hg = max(0, b[0] - cx1, cx0 - b[2])
            d = vg + 0.5 * hg
            if d < bd:
                best, bd = k, d
        if best is not None and bd < 140:
            used.add(best)
            box = comps[best][:]
            grew = True
            while grew:  # multi-part figures: (a), (b) panels next to each other
                grew = False
                for k, b in enumerate(comps):
                    if k in used:
                        continue
                    gap = max(b[0] - box[2], box[0] - b[2], b[1] - box[3], box[1] - b[3])
                    if gap < 22:
                        used.add(k)
                        box = [min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3])]
                        grew = True
            # the caption text often sits on the same row as the label, as its own line
            row = [l for l in lines if l is not c and abs(l["box"][1] - cy0) < 3 and 0 <= l["box"][0] - cx1 < 30]
            cap_lines = [c] + row
            text_x0 = row[0]["box"][0] if row else cx0
            for l in sorted(lines, key=lambda m: m["box"][1]):  # continuation lines right below, aligned with the caption text
                last = max(m["box"][3] for m in cap_lines)
                aligned = abs(l["box"][0] - text_x0) < 8 or abs(l["box"][0] - cx0) < 8
                if l not in cap_lines and aligned and 0 <= l["box"][1] - last < 4.5 and len(cap_lines) < 8 and not CAPTION.match(l["text"]):
                    cap_lines.append(l)
            for l in cap_lines:
                box = [min(box[0], l["box"][0]), min(box[1], l["box"][1]), max(box[2], l["box"][2]), max(box[3], l["box"][3])]
            figs.append((box, " ".join(l["text"] for l in cap_lines)))
    return figs


def crop(pdf, page, box, out):
    img = render(pdf, page, CROP_DPI, gray=False)
    s = CROP_DPI / 72
    pad = 8
    x0, y0, x1, y1 = [int(v * s) for v in box]
    im = img.crop((max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad), min(img.height, y1 + pad)))
    if im.width > MAX_W:
        im = im.resize((MAX_W, int(im.height * MAX_W / im.width)), Image.LANCZOS)
    im.save(out, "WEBP", quality=72, method=6)
    return im.size


def process(doc, page_range=None, force=False):
    rel, title = DOCS[doc]
    pdf = LIB / rel
    n = page_count(pdf)
    out = OUT / doc
    (out / "fig").mkdir(parents=True, exist_ok=True)
    pages_file, figs_file = out / "pages.json", out / "figures.json"
    pages = json.loads(pages_file.read_text()) if pages_file.exists() and not force else {}
    figs = json.loads(figs_file.read_text()) if figs_file.exists() and not force else {}
    a, b = page_range or (1, n)
    img_pages = image_pages(pdf)
    step = 40
    for start in range(a, b + 1, step):
        stop = min(b, start + step - 1)
        geo = bbox_lines(pdf, start, stop)
        for i, page in enumerate(range(start, stop + 1)):
            key = str(page)
            if key in pages and not force:
                continue
            info = geo[i] if i < len(geo) else {"w": 612, "h": 792, "lines": []}
            text = page_text(pdf, page)
            scanned = len(text.split()) < 15
            if scanned:
                text, olines = ocr_page(pdf, page)
                if olines:
                    info = dict(info, lines=olines)
            pages[key] = {"text": text, "cands": label_candidates(info["lines"], info["h"]), "ocr": scanned}
            has_caption = any(CAPTION.match(l["text"]) for l in info["lines"])
            if has_caption or page in img_pages:
                found = find_figures(pdf, page, info, scanned)
                entries = []
                for j, (box, cap) in enumerate(found):
                    name = f"p{page:04d}_{j}.webp"
                    w, h = crop(pdf, page, box, out / "fig" / name)
                    entries.append({"file": name, "caption": cap, "w": w, "h": h, "box": [round(v, 1) for v in box]})
                if entries:
                    figs[key] = entries
        resolve_labels(pages)
        pages_file.write_text(json.dumps(pages, ensure_ascii=False))
        figs_file.write_text(json.dumps(figs, ensure_ascii=False))
        print(f"{doc}: pages {start}-{stop} done; figures so far {sum(len(v) for v in figs.values())}", flush=True)
    return pages, figs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("docs", nargs="*")
    ap.add_argument("--pages")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()
    rng = tuple(map(int, args.pages.split("-"))) if args.pages else None
    for doc in args.docs or list(DOCS):
        process(doc, rng, args.force)


if __name__ == "__main__":
    main()
