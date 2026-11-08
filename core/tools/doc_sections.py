"""Section headings of packed documents, from their text/<doc>.json, for modules added onto a
published index (pack.py --only and merge_index.py keep no headings).

    python core/tools/doc_sections.py --text <lib>/text/B13.json [...] --out headings.json

Uses pack.py's own heading finders (the PDF outline, else numbered headings in the text), then
drops OCR noise: a numbered heading is kept only if its number comes after the last one kept
(chapter by chapter), so table values read as "0.07 lb/in." or "3.0 FOS" are left out.
Writes {doc: [{"page", "title", "depth"}, ...]}, for patch_index.py --headings.
"""
import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import pack  # noqa: E402
from syllabus import DOCS, SKIP  # noqa: E402  (pack.py puts the syllabus on the path)


def number(title):
    m = re.match(r"^(?:[A-Z]\.)?(\d{1,2}(?:\.\d{1,2}){1,3})\b", title)
    return tuple(int(x) for x in m.group(1).split(".")) if m else None


def ordered(secs):
    out, last = [], (0,)
    for h in secs:
        n = number(h["title"])
        if n is None:
            out.append(h)
        elif n[0] >= 1 and n[-1] >= 1 and n > last and n[0] <= last[0] + 1:
            out.append(h)
            last = n
    return out


def headings(doc, text):
    pages = {k: {"text": v["t"]} for k, v in text.items()}
    skip = {p for d, a, b, _ in SKIP if d == doc for p in range(a, b + 1)}
    secs = pack.outline_sections(pack.source_pdf(pack.LIB, DOCS[doc][0]))
    if len(secs) < len(pages) / 8:
        secs = ordered(pack.text_sections(pages, skip))
    return secs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--text", nargs="+", required=True, help="text/<doc>.json files")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    out = {}
    for f in a.text:
        doc = Path(f).stem
        out[doc] = headings(doc, json.loads(Path(f).read_text()))
        print(f"{doc}: {len(out[doc])} headings")
    Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    Path(a.out).write_text(json.dumps(out, ensure_ascii=False, indent=0))


if __name__ == "__main__":
    main()
