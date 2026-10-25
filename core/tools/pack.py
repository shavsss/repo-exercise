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
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import pypdf
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
LIB = ROOT / "library" / "military"
BUILD = ROOT / "core" / "build" / "lib"
OUT = ROOT / "core" / "app" / "artifact" / "lib"
sys.path.insert(0, str(LIB / "syllabus"))
from syllabus import DOCS, MODULES, PARTS  # noqa: E402

BUNDLE = 6_000_000

SHORT = {
    "B01": "EW 101", "B02": "POMR I", "B02a": "POMR II", "B02b": "POMR III", "B03": "Driggers", "B04": "EW 102",
    "B05": "Kaplan GPS", "B06": "Siouris", "B07": "AMD SE", "B08": "Avionics", "B09": "UAV", "B10": "Naval Weapons",
    "B11": "Tanks", "D5": "ATP 7-100.1", "D6": "ATP 7-100.3", "D8": "ATP 3-09.12", "D9": "ATP 3-01.81",
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


HEADING = re.compile(r"^\s*((?:[A-Z]\.)?\d{1,2}(?:\.\d{1,2}){1,2})\s+([A-Z][^\n]{2,90})$")


def text_sections(pages):
    """Numbered section headings ("9.5 Range Deceptive Jamming") found in page text."""
    out, seen = [], set()
    for k in sorted(pages, key=int):
        for line in pages[k]["text"].splitlines()[:60]:
            m = HEADING.match(line)
            if not m:
                continue
            num, title = m.group(1), m.group(2).strip()
            if num in seen or len(title.split()) > 12 or title.endswith((".", ",")) or re.search(r"\.{3,}|\d+$", title):
                continue
            seen.add(num)
            out.append({"page": int(k), "title": f"{num} {title}", "depth": num.count(".")})
    return out


def webp_data(path):
    return "data:image/webp;base64," + base64.b64encode(Path(path).read_bytes()).decode()


def page_image(pdf, page):
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(["pdftoppm", "-f", str(page), "-l", str(page), "-r", "110", "-gray", "-png", str(pdf), f"{tmp}/p"], check=True, capture_output=True)
        im = Image.open(next(Path(tmp).glob("p*.png")))
        out = Path(tmp) / "p.webp"
        im.save(out, "WEBP", quality=50, method=6)
        return webp_data(out)


def bundle(prefix, items, folder):
    """Split (key, data URI, meta) items into files under folder; returns file names and key→file index."""
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
        (OUT / name).write_text(dumps(content))
        names.append(name)
        for key in content:
            index[key] = i
    return names, index


def main():
    for d in ("text", "fig", "pg"):
        (OUT / d).mkdir(parents=True, exist_ok=True)
    docs = {}
    sections = {}
    for doc, (rel, title) in DOCS.items():
        src = BUILD / doc
        if not (src / "pages.json").exists():
            print("not extracted yet:", doc)
            continue
        pages = json.loads((src / "pages.json").read_text())
        figs = json.loads((src / "figures.json").read_text()) if (src / "figures.json").exists() else {}
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

        pdf = LIB / rel
        ocr_pages = [k for k in sorted(pages, key=int) if pages[k].get("ocr")]
        cache = src / "pg"
        cache.mkdir(exist_ok=True)
        pg_items = []
        for k in ocr_pages:
            f = cache / f"p{int(k):04d}.json"
            if not f.exists():
                f.write_text(json.dumps(page_image(pdf, int(k))))
            pg_items.append((k, json.loads(f.read_text())))
        pg_files, pg_index = bundle(doc, pg_items, "pg")

        secs = outline_sections(pdf)
        if len(secs) < 10:
            secs = text_sections(pages)
        sections[doc] = secs
        docs[doc] = {
            "title": title, "short": short(doc), "kind": kind(doc), "pages": len(pages),
            "figs": fig_pages, "figFiles": fig_files, "figIndex": fig_index,
            "pgFiles": pg_files, "pgIndex": pg_index,
        }
        print(f"{doc}: {len(pages)} pages, {len(fig_items)} figures in {len(fig_files)} files, {len(pg_items)} page images, {len(secs)} sections")

    modules = []
    for m in MODULES:
        m = json.loads(json.dumps(m))
        heads = []
        for s in m["sources"]:
            if s["doc"] not in docs:
                continue
            a, b = s["pages"] or (1, docs[s["doc"]]["pages"])
            s["pages"] = [a, b]
            for h in sections.get(s["doc"], []):
                if a <= h["page"] <= b and s["role"] != "article":
                    heads.append({"doc": s["doc"], "page": h["page"], "title": h["title"], "depth": h["depth"]})
        m["sections"] = heads
        modules.append(m)
    index = {"docs": docs, "parts": [{"id": i, "title": t} for i, t in PARTS], "modules": modules}
    digest = hashlib.sha1()
    for f in sorted(OUT.rglob("*.json")):
        if f.name != "index.json":
            digest.update(f.name.encode())
            digest.update(str(f.stat().st_size).encode())
    digest.update(json.dumps(index, sort_keys=True).encode())
    index["version"] = digest.hexdigest()[:12]
    (OUT / "index.json").write_text(dumps(index))
    total = sum(f.stat().st_size for f in OUT.rglob("*.json"))
    print(f"wrote {sum(1 for _ in OUT.rglob('*.json'))} files, {total / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
