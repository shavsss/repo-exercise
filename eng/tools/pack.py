"""Pack the extracted engineering library and the syllabus for the published page.

Reads eng/build/lib/<doc>/{pages,figures}.json (from eng/tools/extract.py) and the
syllabus, and writes eng/app/artifact/lib/ in the same format as the Core Lab:
  index.json            documents, parts, modules (with the section headings in each module's pages)
  text/<doc>.json       page text, printed labels, OCR flags
  fig/<doc>-<k>.json    figure crops as data URIs, in bundles of about 6 MB
  pg/<doc>-<k>.json     page images of OCR'd pages (their equations are unreliable as text)
Section headings come from the syllabus maps (library/engineering/syllabus/toc/), which
were checked by hand, rather than from the PDF outline.
"""
import base64
import hashlib
import json
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SYL = ROOT / "library" / "engineering" / "syllabus"
BUILD = ROOT / "eng" / "build" / "lib"
OUT = ROOT / "eng" / "app" / "artifact" / "lib"
# Documents whose figure and page-image bundles live in the artifact's asset store
# instead of lib/, because the published files of one version are limited to 256 MB.
# Chosen in main(): the heaviest documents move there until lib/ fits LIB_BUDGET.
ASSET_DOCS = set()
LIB_BUDGET = 215_000_000
# asset-store bundles are larger (one upload call each; an asset may be up to 20 MiB)
ASSET_BUNDLE = 18_000_000
ASSETS = ROOT / "eng" / "app" / "artifact" / "assets"
ASSET_URLS = ROOT / "eng" / "tools" / "asset_urls.json"
sys.path.insert(0, str(SYL))
from syllabus import DOCS, MODULES, PARTS, SKIP  # noqa: E402
from toc import load  # noqa: E402

BUNDLE = 6_000_000

SHORT = {
    "K1": "קולמוגורוב א", "K2": "קולמוגורוב ב", "K3": "קולמוגורוב ג", "F1": "פיינמן I", "F2": "פיינמן II", "F3": "פיינמן III",
    "E01": "Oppenheim", "E02": "MIT 6.011", "E03": "Åström", "E04": "MacKay ITILA", "E05": "Wasserman", "E06": "Boyd",
    "E07": "Trefethen", "E08": "Langtangen", "E09": "Horowitz", "E09a": "Horowitz SM", "E10": "Hughes", "E11": "Anderson",
    "E12": "Ashby", "E13": "Gere", "E13a": "Gere SM", "E14": "MacKay SE", "E15": "Çengel", "E16": "Lienhard",
    "E17": "Prince", "E18": "Sutton", "E19": "Lynch", "E20": "MCS", "E21": "Skiena", "E22": "Patterson",
    "E23": "Tse", "E24": "Hu", "E25": "Weste", "E26": "NASA SE",
}


def dumps(value):
    """Compact JSON; U+FFFD is escaped because the artifact publisher rejects it."""
    return json.dumps(value, ensure_ascii=False, separators=(",", ":")).replace("\ufffd", "\\ufffd")

def short(doc):
    return SHORT.get(doc, doc)


def kind(doc):
    return "book"


def toc_sections(doc):
    """Chapters (depth 0) and sections (depth 1) from the syllabus map; problem blocks are left out."""
    out = []
    for u in load(doc):
        if u["kind"] not in ("CH", "APP"):
            continue
        secs = [x for x in u["secs"] if x[0] != "P"]
        # a chapter without mapped sections is itself the unit a lesson covers
        out.append({"page": u["a"], "title": f"{u['num']} {u['title']}".strip(), "depth": 0 if secs else 1})
        for num, page, title in u["secs"]:
            if num != "P":
                out.append({"page": page, "title": f"{num} {title}".strip(), "depth": 1})
    return out


def source_pdf(rel):
    p = ROOT / rel
    return p if p.suffix == ".pdf" else None


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
        if cur and size + n > (ASSET_BUNDLE if prefix in ASSET_DOCS else BUNDLE):
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
        print(f"not in the asset store yet (upload from {ASSETS.relative_to(ROOT)}, then add to {ASSET_URLS.name}):", ", ".join(missing))
    return {n: urls[n] for n in names if n in urls}


def heavy_bytes(doc):
    """Estimated size of a document's figure and page-image bundles (base64 inflates by 4/3)."""
    src = BUILD / doc
    fig = sum(f.stat().st_size for f in (src / "fig").glob("*.webp")) * 4 / 3 if (src / "fig").exists() else 0
    pg = sum(f.stat().st_size for f in (src / "pg").glob("*.json")) if (src / "pg").exists() else 0
    return fig + pg


def choose_asset_docs():
    text = sum((BUILD / d / "pages.json").stat().st_size for d in DOCS if (BUILD / d / "pages.json").exists())
    heavy = {d: heavy_bytes(d) for d in DOCS if (BUILD / d).exists()}
    total = text + sum(heavy.values())
    chosen = set()
    for d in sorted(heavy, key=heavy.get, reverse=True):
        if total <= LIB_BUDGET:
            break
        chosen.add(d)
        total -= heavy[d]
    print(f"asset store: {sorted(chosen)}; lib/ about {total / 1e6:.0f} MB")
    return chosen


def main():
    global ASSET_DOCS
    ASSET_DOCS = choose_asset_docs()
    for root in (OUT, ASSETS):
        for d in ("fig", "pg"):
            for f in (root / d).glob("*.json") if (root / d).exists() else []:
                f.unlink()
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

        pdf = source_pdf(rel)
        ocr_pages = [k for k in sorted(pages, key=int) if pages[k].get("ocr")] if pdf else []
        cache = src / "pg"
        cache.mkdir(exist_ok=True)
        pg_items = []
        for k in ocr_pages:
            f = cache / f"p{int(k):04d}.json"
            if not f.exists():
                # a book photographed page by page is all page images: a little smaller each
                f.write_text(json.dumps(page_image(pdf, int(k))))
            pg_items.append((k, json.loads(f.read_text())))
        pg_files, pg_index = bundle(doc, pg_items, "pg")

        secs = toc_sections(doc)
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
                if a <= h["page"] <= b and s["role"] not in ("article", "ex") and h["depth"] > 0:
                    heads.append({"doc": s["doc"], "page": h["page"], "title": h["title"], "depth": h["depth"]})
        m["sections"] = heads
        modules.append(m)
    index = {"docs": docs, "parts": [{"id": i, "title": t} for i, t in PARTS], "modules": modules}
    index["assets"] = asset_urls(docs)
    digest = hashlib.sha1()
    for f in sorted([*OUT.rglob("*.json"), *ASSETS.rglob("*.json")]):
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
