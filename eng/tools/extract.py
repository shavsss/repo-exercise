"""Extract page text, page labels and figures for the engineering library.

Reuses the Core Lab extractor (core/tools/extract/extract.py) on the documents of
library/engineering/syllabus/syllabus.py, writing eng/build/lib/<doc>/. Three
sources need no PDF work: Feynman I and II exist only as text (app/artifact/books/
feyn1.json, feyn2.json), and Kolmogorov's three volumes are scans whose OCR text
the learning lab already has (math1-3.json). Their pages are taken from those
files; the Kolmogorov pages are flagged as OCR, so pack.py adds page images.

Run with the OCR venv: python eng/tools/extract.py [DOC ...] [--pages A-B] [--force]
"""
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(os.environ.get("EXTRACT_OUT", ROOT / "eng" / "build" / "lib"))
sys.path.insert(0, str(ROOT / "library" / "engineering" / "syllabus"))
from syllabus import DOCS  # noqa: E402

sys.path.insert(0, str(ROOT / "core" / "tools" / "extract"))
import extract as core  # noqa: E402

core.LIB = ROOT
core.OUT = OUT
core.DOCS = DOCS

# documents taken from the learning lab's text files: doc → (file, OCR'd scan)
TEXT_ONLY = {
    "F1": ("app/artifact/books/feyn1.json", False),
    "F2": ("app/artifact/books/feyn2.json", False),
    "K1": ("app/artifact/books/math1.json", True),
    "K2": ("app/artifact/books/math2.json", True),
    "K3": ("app/artifact/books/math3.json", True),
}


def from_text(doc):
    rel, scanned = TEXT_ONLY[doc]
    src = json.loads((ROOT / rel).read_text())
    pages = {}
    for i, p in enumerate(src["pages"]):
        n = p.get("pdf") or i + 1
        pages[str(n)] = {"text": p.get("text", ""), "label": p.get("label"), "cands": [], "ocr": scanned}
    out = OUT / doc
    out.mkdir(parents=True, exist_ok=True)
    (out / "pages.json").write_text(json.dumps(pages, ensure_ascii=False))
    (out / "figures.json").write_text("{}")
    print(f"{doc}: {len(pages)} pages from {rel}", flush=True)


def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("docs", nargs="*")
    ap.add_argument("--pages")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()
    docs = args.docs or list(DOCS)
    for doc in [d for d in docs if d in TEXT_ONLY]:
        from_text(doc)
    rng = tuple(map(int, args.pages.split("-"))) if args.pages else None
    for doc in [d for d in docs if d not in TEXT_ONLY]:
        core.process(doc, rng, args.force)


if __name__ == "__main__":
    main()
