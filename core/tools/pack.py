"""Pack the extracted library and the syllabus for the published page.

Reads core/build/lib/<doc>/{pages,figures}.json (from tools/extract) and the
syllabus, and writes core/app/artifact/lib/:
  index.json            documents, parts, modules (with the section headings in each module's pages)
  text/<doc>.json       page text, printed labels, OCR flags
  fig/<doc>-<k>.json    figure crops as data URIs, in bundles of about 6 MB
  pg/<doc>-<k>.json     page images of OCR'd pages (their equations are unreliable as text)
"""
import hashlib
import json
import os
import re
import sys
from pathlib import Path


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
sys.path.insert(0, str(ROOT / "core" / "tools"))
from sections import detect  # noqa: E402
from images import page_image, webp_data  # noqa: E402
sys.path.insert(0, str(ROOT / "tools" / "curriculum"))
from enrich import attach  # noqa: E402  (topic items, test-out, reading lists)

BUNDLE = 6_000_000
# asset-store bundles are larger (one upload call each), as in eng/tools/pack.py
ASSET_BUNDLE = 18_000_000

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

    skip = {p for d, a, b, _ in SKIP if d == doc for p in range(a, b + 1)}
    secs = detect(pdf, pages, skip)
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
        kept = base[m["id"]]["sections"] if m["id"] in base else None
        if kept is None or not kept:
            m["sections"] = heads
        elif any(s["doc"] in sections for s in m["sources"]):
            # documents packed in this run bring their own headings, in the order of the sources
            order = {}
            for s in m["sources"]:
                order.setdefault(s["doc"], len(order))
            m["sections"] = sorted([h for h in kept if h["doc"] not in sections] + heads, key=lambda h: (order.get(h["doc"], 99), h["page"]))
        else:
            m["sections"] = kept
        m["sources"] = [s for s in m["sources"] if s["doc"] in docs]
        out.append(m)
    return out


def write_index(docs, modules, base_assets=None, keep_version=None):
    """keep_version: the published version, kept when this run only adds new documents, so the files
    browsers keep (cached under the version) stay valid and nothing is downloaded again."""
    index = {"docs": docs, "parts": [{"id": i, "title": t} for i, t in PARTS], "modules": attach(modules, "core")}
    # the published asset map stays; this run adds its own bundles
    index["assets"] = {**(base_assets or {}), **asset_urls(docs)}
    digest = hashlib.sha1()
    for f in sorted([*OUT.rglob("*.json"), *ASSETS.rglob("*.json")]):
        if f.name != "index.json":
            digest.update(f.name.encode())
            digest.update(str(f.stat().st_size).encode())
    digest.update(json.dumps(index, sort_keys=True).encode())
    index["version"] = keep_version or digest.hexdigest()[:12]
    (OUT / "index.json").write_text(dumps(index))


def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*", help="pack only these documents, onto --base")
    ap.add_argument("--base", help="the published lib/index.json, for --only")
    ap.add_argument("--keep-modules", action="store_true",
                    help="with --only: keep the base index's modules as they are (only documents change)")
    ap.add_argument("--assets", nargs="*", default=[],
                    help="with --only: these documents' figure and page-image bundles go to the asset store")
    ap.add_argument("--text-only", nargs="*", default=[],
                    help="with --only: these documents are packed without figure and page-image bundles, like REF_DOCS")
    args = ap.parse_args()
    ASSET_DOCS.update(args.assets)
    for d in ("text", "fig", "pg"):
        (OUT / d).mkdir(parents=True, exist_ok=True)
    if args.only:
        # Adds documents to an index already published, without the rest of the library on
        # disk: their files are written to lib/, and index.json is the published one with these
        # documents and the current syllabus. Analysis references (REF_DOCS) are packed as text only.
        base = json.loads(Path(args.base).read_text())
        # only new documents: the existing files are unchanged, so the published version stays
        keep = base.get("version") if not set(args.only) & set(base["docs"]) else None
        docs = base["docs"]
        fresh = {}
        for doc in args.only:
            rel, title = DOCS[doc]
            r = pack_doc(doc, rel, title, with_images=doc not in REF_DOCS and doc not in args.text_only)
            if r:
                docs[doc], fresh[doc] = r
        write_index(docs, base["modules"] if args.keep_modules else module_list(docs, fresh, base["modules"]), base.get("assets", {}), keep)
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
