"""Pack the extracted library and the syllabus for the published page.

Reads core/build/lib/<doc>/{pages,figures}.json (from tools/extract) and the
syllabus, and writes core/app/artifact/lib/:
  index.json            documents, parts, modules (with the section headings in each module's pages)
  text/<doc>.json       page text, printed labels, OCR flags
  fig/<doc>-<k>.json    figure crops as data URIs, in bundles of about 6 MB
  pg/<doc>-<k>.json     page images of OCR'd pages (their equations are unreliable as text)
"""
import base64
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import pymupdf
import pypdf
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
LIB = ROOT / "library" / "military"
BUILD = ROOT / "core" / "build" / "lib"
# PACK_OUT=<dir>/lib writes the files elsewhere (the asset bundles then go to <dir>/assets)
OUT = Path(os.environ.get("PACK_OUT", ROOT / "core" / "app" / "artifact" / "lib"))
# Documents whose figure and page-image bundles live in the artifact's asset store instead of
# lib/, because the published files of one version are limited to 256 MB. Their bundles are
# written to ASSETS, uploaded by hand (Artifact publish with asset: true), and the URLs the
# upload returns are kept in ASSET_URLS, from which index.json maps each bundle to its URL.
ASSET_DOCS = {"B12", "B13"}
ASSETS = OUT.parent / "assets"
ASSET_URLS = ROOT / "core" / "tools" / "asset_urls.json"
sys.path.insert(0, str(LIB / "syllabus"))
from syllabus import DOCS, MODULES, PARTS, REF_DOCS, SKIP  # noqa: E402
from source_pdf import source_pdf  # noqa: E402
sys.path.insert(0, str(ROOT / "tools" / "curriculum"))
from enrich import attach  # noqa: E402  (topic items, test-out, reading lists)

BUNDLE = 6_000_000

SHORT = {
    "B01": "EW 101", "B02": "POMR I", "B02a": "POMR II", "B02b": "POMR III", "B03": "Driggers", "B04": "EW 102",
    "B05": "Kaplan GPS", "B06": "Siouris", "B07": "AMD SE", "B08": "Avionics", "B09": "UAV", "B10": "Naval Weapons",
    "B11": "Tanks", "B12": "SMAD", "B13": "Fleeman", "B14": "Washburn & Kress", "B15": "Przemieniecki", "B16": "Ball", "B17": "Van Creveld", "D5": "ATP 7-100.1", "D6": "ATP 7-100.3", "D8": "ATP 3-09.12", "D9": "ATP 3-01.81",
}



def dumps(value):
    """Compact JSON; U+FFFD is escaped because the artifact publisher rejects it."""
    return json.dumps(value, ensure_ascii=False, separators=(",", ":")).replace("\ufffd", "\\ufffd")

def short(doc):
    if doc in SHORT:
        return SHORT[doc]
    title = DOCS[doc][1]
    author = re.split(r"[ ,]", title)[0]
    year = re.findall(r"\((?:[^)]*?)(\d{4})\)", title)
    return f"{author} {year[-1]}" if year else author


def kind(doc):
    return "book" if doc.startswith("B") else "article" if doc.startswith("A") else "doctrine"


def outline_sections(pdf):
    try:
        r = pypdf.PdfReader(str(pdf))
    except Exception:
        return []
    out = []

    def walk(items, depth):
        for x in items:
            if isinstance(x, list):
                walk(x, depth + 1)
            elif depth <= 2:
                try:
                    out.append({"page": r.get_destination_page_number(x) + 1, "title": x.title.strip(), "depth": depth})
                except Exception:
                    pass

    try:
        walk(r.outline, 0)
    except Exception:
        return []
    return out


NUMBER = r"((?:[A-Z]\.)?\d{1,2}(?:\.\d{1,2}){1,3})\.?"
HEADING = re.compile(r"^" + NUMBER + r"\s+([A-Z][^\n]{2,90})$")
NUMBER_ONLY = re.compile(r"^" + NUMBER + r"$")


def plausible_title(title):
    return len(title.split()) <= 12 and not title.endswith((".", ",", ";")) and not re.search(r"\.{3,}|\s\d+$|=", title)


def text_sections(pages, skip):
    """Numbered section headings ("9.5 Range Deceptive Jamming", or the number on its own line
    with the title on the next) found in page text. Skipped pages (contents) are left out, and
    running heads, which repeat on many pages, are never taken as titles."""
    lines_of = {int(k): [l.strip() for l in v["text"].splitlines() if l.strip()][:70] for k, v in pages.items() if int(k) not in skip}
    freq = {}
    for lines in lines_of.values():
        for l in set(lines):
            freq[l] = freq.get(l, 0) + 1
    out, seen = [], set()
    for k in sorted(lines_of):
        lines = lines_of[k]
        for i, l in enumerate(lines):
            m = HEADING.match(l)
            if m:
                num, title = m.group(1), m.group(2).strip()
            elif NUMBER_ONLY.match(l):
                num = NUMBER_ONLY.match(l).group(1)
                nxt = [x for x in lines[i + 1 : i + 3] if freq.get(x, 0) < 3 and re.match(r"^[A-Z][A-Za-z]", x)]
                if not nxt:
                    continue
                title = nxt[0]
            else:
                continue
            if num in seen or freq.get(title, 0) >= 3 or not plausible_title(title):
                continue
            seen.add(num)
            out.append({"page": k, "title": f"{num} {title}", "depth": num.count(".")})
    return out


def font_sections(pdf, skip, bold=True):
    """Unnumbered headings, told apart from body text by a larger (or, with bold=True, bold) font."""
    try:
        doc = pymupdf.open(str(pdf))
    except Exception:
        return []
    sizes, lines = {}, []
    for pno in range(doc.page_count):
        if pno + 1 in skip:
            continue
        for b in doc[pno].get_text("dict")["blocks"]:
            for l in b.get("lines", []):
                t = "".join(s["text"] for s in l["spans"]).strip()
                if not t:
                    continue
                size = round(max(s["size"] for s in l["spans"]), 1)
                is_bold = any(s["flags"] & 16 or "Bold" in s["font"] for s in l["spans"])
                sizes[size] = sizes.get(size, 0) + len(t)
                lines.append((pno + 1, t, size, is_bold, l["bbox"][1]))
    if not sizes:
        return []
    body = max(sizes, key=sizes.get)
    out, prev = [], None
    for page, t, size, is_bold, y in lines:
        words = len(t.split())
        if not (size >= body * 1.15 or (bold and is_bold)) or words < 2 or not re.search(r"[A-Za-z]{3}", t):
            continue
        if re.match(r"^(Figure|Table|FIGURE|TABLE|Fig\.)", t) or not plausible_title(t):
            continue
        if prev and prev[0] == page and abs(prev[1] - y) < size * 1.6:
            out[-1]["title"] += " " + t  # a heading wrapped onto a second line
        else:
            out.append({"page": page, "title": t, "depth": 1 if size >= body * 1.4 else 2})
        prev = (page, y)
    return [h for h in out if len(h["title"].split()) <= 14]


def webp_data(path):
    return "data:image/webp;base64," + base64.b64encode(Path(path).read_bytes()).decode()


def page_image(pdf, page, dpi=110, quality=50):
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(["pdftoppm", "-f", str(page), "-l", str(page), "-r", str(dpi), "-gray", "-png", str(pdf), f"{tmp}/p"], check=True, capture_output=True)
        im = Image.open(next(Path(tmp).glob("p*.png")))
        out = Path(tmp) / "p.webp"
        im.save(out, "WEBP", quality=quality, method=6)
        return webp_data(out)


def bundle(prefix, items, folder):
    """Split (key, data URI, meta) items into files under folder (in lib/, or in the asset folder
    for ASSET_DOCS); returns file names and key→file index."""
    root = ASSETS if prefix in ASSET_DOCS else OUT
    (root / folder).mkdir(parents=True, exist_ok=True)
    files, index, cur, size = [], {}, {}, 0
    for key, value in items:
        n = len(json.dumps(value))
        if cur and size + n > BUNDLE:
            files.append(cur)
            cur, size = {}, 0
        cur[key] = value
        size += n
    if cur:
        files.append(cur)
    names = []
    for i, content in enumerate(files):
        name = f"{folder}/{prefix}-{i}.json"
        (root / name).write_text(dumps(content))
        names.append(name)
        for key in content:
            index[key] = i
    return names, index


def asset_urls(docs):
    """bundle name → asset URL for the bundles of ASSET_DOCS (warns about any not uploaded yet)."""
    urls = json.loads(ASSET_URLS.read_text()) if ASSET_URLS.exists() else {}
    names = [n for d in ASSET_DOCS if d in docs for n in docs[d]["figFiles"] + docs[d]["pgFiles"]]
    missing = [n for n in names if n not in urls]
    if missing:
        print(f"not in the asset store yet (upload from {ASSETS}, then add to {ASSET_URLS.name}):", ", ".join(missing))
    return {n: urls[n] for n in names if n in urls}


def pack_doc(doc, rel, title, with_images=True):
    """Writes the text (and figure and page-image bundles) of one extracted document; returns
    its index entry and its section headings, or None when it is not extracted yet."""
    src = BUILD / doc
    if not (src / "pages.json").exists():
        print("not extracted yet:", doc)
        return None
    pages = json.loads((src / "pages.json").read_text())
    figs = json.loads((src / "figures.json").read_text()) if (src / "figures.json").exists() and with_images else {}
    text = {k: {"l": v.get("label"), "t": v["text"], **({"o": 1} if v.get("ocr") else {})} for k, v in pages.items()}
    (OUT / "text" / f"{doc}.json").write_text(dumps(text))

    fig_items = []
    fig_pages = {}
    for k in sorted(figs, key=int):
        for j, e in enumerate(figs[k]):
            f = src / "fig" / e["file"]
            if f.exists():
                fig_items.append((f"{k}-{j}", {"c": e["caption"], "w": e["w"], "h": e["h"], "d": webp_data(f)}))
                fig_pages.setdefault(k, []).append(e["caption"][:140])
    fig_files, fig_index = bundle(doc, fig_items, "fig")

    pdf = source_pdf(LIB, rel)
    ocr_pages = [k for k in sorted(pages, key=int) if pages[k].get("ocr")] if with_images else []
    cache = src / "pg"
    cache.mkdir(exist_ok=True)
    pg_items = []
    for k in ocr_pages:
        f = cache / f"p{int(k):04d}.json"
        if not f.exists():
            # a book photographed page by page is all page images: a little smaller each
            f.write_text(json.dumps(page_image(pdf, int(k), *((100, 40) if doc in ASSET_DOCS else ()))))
        pg_items.append((k, json.loads(f.read_text())))
    pg_files, pg_index = bundle(doc, pg_items, "pg")

    # The PDF outline when it reaches section level (about one heading per 8 pages);
    # else numbered headings in the text; else headings by font, without bold-only
    # ones when those make it denser than one heading per 2 pages.
    skip = {p for d, a, b, _ in SKIP if d == doc for p in range(a, b + 1)}
    enough = len(pages) / 8
    secs = outline_sections(pdf)
    if len(secs) < enough:
        secs = text_sections(pages, skip)
    if len(secs) < enough:
        secs = font_sections(pdf, skip)
        if len(secs) > len(pages) / 2:
            secs = font_sections(pdf, skip, bold=False)
    entry = {
        "title": title, "short": short(doc), "kind": kind(doc), "pages": len(pages),
        "figs": fig_pages, "figFiles": fig_files, "figIndex": fig_index,
        "pgFiles": pg_files, "pgIndex": pg_index,
    }
    print(f"{doc}: {len(pages)} pages, {len(fig_items)} figures in {len(fig_files)} files, {len(pg_items)} page images, {len(secs)} sections")
    return entry, secs


def module_list(docs, sections, base_modules=None):
    """The syllabus modules with their page ranges and the section headings in their taught
    pages. With base_modules (from a published index), headings are kept from there."""
    base = {m["id"]: m for m in base_modules or []}
    out = []
    for m in MODULES:
        m = json.loads(json.dumps(m))
        heads = []
        for s in m["sources"]:
            if s["doc"] not in docs:
                continue
            a, b = s["pages"] or (1, docs[s["doc"]]["pages"])
            s["pages"] = [a, b]
            for h in sections.get(s["doc"], []):
                if a <= h["page"] <= b and s["role"] not in ("article", "ref"):
                    heads.append({"doc": s["doc"], "page": h["page"], "title": h["title"], "depth": h["depth"]})
        m["sections"] = base[m["id"]]["sections"] if m["id"] in base else heads
        m["sources"] = [s for s in m["sources"] if s["doc"] in docs]
        out.append(m)
    return out


def write_index(docs, modules):
    index = {"docs": docs, "parts": [{"id": i, "title": t} for i, t in PARTS], "modules": attach(modules, "core")}
    index["assets"] = asset_urls(docs)
    digest = hashlib.sha1()
    for f in sorted([*OUT.rglob("*.json"), *ASSETS.rglob("*.json")]):
        if f.name != "index.json":
            digest.update(f.name.encode())
            digest.update(str(f.stat().st_size).encode())
    digest.update(json.dumps(index, sort_keys=True).encode())
    index["version"] = digest.hexdigest()[:12]
    (OUT / "index.json").write_text(dumps(index))


def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*", help="pack only these documents, onto --base")
    ap.add_argument("--base", help="the published lib/index.json, for --only")
    ap.add_argument("--keep-modules", action="store_true",
                    help="with --only: keep the base index's modules as they are (only documents change)")
    args = ap.parse_args()
    for d in ("text", "fig", "pg"):
        (OUT / d).mkdir(parents=True, exist_ok=True)
    if args.only:
        # Adds documents to an index already published, without the rest of the library on
        # disk: their files are written to lib/, and index.json is the published one with these
        # documents and the current syllabus. Analysis references (REF_DOCS) are packed as text only.
        base = json.loads(Path(args.base).read_text())
        docs = base["docs"]
        for doc in args.only:
            rel, title = DOCS[doc]
            r = pack_doc(doc, rel, title, with_images=doc not in REF_DOCS)
            if r:
                docs[doc] = r[0]
        write_index(docs, base["modules"] if args.keep_modules else module_list(docs, {}, base["modules"]))
        print("wrote", ", ".join(f"text/{d}.json" for d in args.only), "and index.json")
        return
    docs = {}
    sections = {}
    for doc, (rel, title) in DOCS.items():
        r = pack_doc(doc, rel, title)
        if r:
            docs[doc], sections[doc] = r
    write_index(docs, module_list(docs, sections))
    total = sum(f.stat().st_size for f in OUT.rglob("*.json"))
    print(f"wrote {sum(1 for _ in OUT.rglob('*.json'))} files, {total / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
