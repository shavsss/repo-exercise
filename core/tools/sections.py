"""Section headings of a PDF without a hand-made map: its outline when it reaches section level,
else numbered headings in the extracted text, else headings told apart by font (used by both
core/tools/pack.py and eng/tools/pack.py)."""
import re

import pymupdf
import pypdf


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


def detect(pdf, pages, skip):
    """The PDF outline when it reaches section level (about one heading per 8 pages); else
    numbered headings in the text; else headings by font, without bold-only ones when those
    make it denser than one heading per 2 pages."""
    enough = len(pages) / 8
    secs = outline_sections(pdf)
    if len(secs) < enough:
        secs = text_sections(pages, skip)
    if len(secs) < enough:
        secs = font_sections(pdf, skip)
        if len(secs) > len(pages) / 2:
            secs = font_sections(pdf, skip, bold=False)
    return secs
