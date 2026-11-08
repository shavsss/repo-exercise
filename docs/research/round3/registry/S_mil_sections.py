"""Step 1: build a section structure for every Lanchester doc used as main/supp, and map module ranges to sections.
Sources of structure (in priority order):
  outline : PDF bookmarks (S_mil_outline.json, from S_mil_outline.py)
  text    : numbered headings 'X.Y Title' / 'X.Y.Z Title' detected in body pages (TOC/skip pages excluded,
            first occurrence of each number kept, running headers removed by monotonic order)
  note    : image-only scan (SMAD): section numbers parsed from module notes, pages split evenly (flagged)
  block   : no detectable numbering: fixed ~6-page heading blocks (flagged)
Output: S_mil_units.json  list of units {uid, module, tier, part, role, doc, num, title, p0, p1, pages,
        nsub (number of X.Y.Z subsections inside), method}
"""
import json, os, re
from collections import defaultdict
H = os.path.dirname(os.path.abspath(__file__))
REPO = "/home/user/repo-exercise/library/military"
R2 = os.path.join(H, "..", "..", "round2")
syl = json.load(open(f"{REPO}/syllabus/syllabus.json"))
txt = json.load(open(os.path.join(R2, "cache", "mil_text.json")))
outl = json.load(open(os.path.join(H, "S_mil_outline.json")))

skip = defaultdict(set)
for s in syl["skip"]:
    if s.get("pages"):
        for p in range(s["pages"][0], s["pages"][1] + 1):
            skip[s["doc"]].add(p)

NUM = re.compile(r'^\s*(?:Chapter\s+|CHAPTER\s+|Section\s+)?((?:\d{1,2}|[A-H])(?:\.\d{1,2}){0,3})\.?\s+(.{3,})$')

def depth(n):
    return n.count('.') + 1

def key(n):
    out = []
    for x in n.split('.'):
        out.append(int(x) if x.isdigit() else 100 + ord(x))
    return tuple(out)

def from_outline(doc):
    hs = []
    for o in outl.get(doc, []):
        if not o["page"]:
            continue
        t = o["title"]
        m = NUM.match(t)
        if m:
            hs.append((o["page"], m.group(1), m.group(2).strip()[:80]))
        elif o["lvl"] > 1:
            continue
        else:
            hs.append((o["page"], None, t[:80]))
    return hs

HEAD = re.compile(r'^\s{0,14}((?:\d{1,2}|[A-H])(?:\.\d{1,2}){1,3})\.?\s{1,5}([A-Z][^\n]{2,90})$')
def from_text(doc):
    hs, seen = [], set()
    pages = txt.get(doc, {})
    for p in sorted(pages, key=int):
        pi = int(p)
        if pi in skip[doc]:
            continue
        for ln in pages[p].split('\n'):
            if '. . .' in ln or '....' in ln or re.search(r'\s{4,}\d+\s*$', ln):
                continue  # TOC line
            m = HEAD.match(ln)
            if not m:
                continue
            n, t = m.group(1), m.group(2).strip()
            if re.match(r'(Figure|Table|Fig|Equation)', t) or len(t) > 85 or t.endswith(',') or n in seen:
                continue
            if re.search(r'[=<>]|\d\s*[x×]\s*\d', t):
                continue
            seen.add(n)
            hs.append((pi, n, t[:80]))
    # synthesize missing parents: X.Y from first X.Y.Z (or running header 'X.Y Title  page')
    have = {h[1] for h in hs}
    extra = []
    for p in sorted(pages, key=int):
        pi = int(p)
        if pi in skip[doc]: continue
        for ln in pages[p].split('\n')[:4] + pages[p].split('\n')[-4:]:
            m = re.match(r'^\s{0,60}(\d{1,2}\.\d{1,2})\s{2,}([A-Z][^\n]{3,80}?)\s{2,}\d+\s*$', ln)
            if m and m.group(1) not in have:
                have.add(m.group(1)); extra.append((pi, m.group(1), m.group(2).strip()+" (hdr)"))
    for h in list(hs):
        if depth(h[1]) == 3:
            par = h[1].rsplit('.', 1)[0]
            if par not in have:
                have.add(par); extra.append((h[0], par, "(from " + h[2] + ")"))
    hs = sorted(hs + extra, key=lambda h: (h[0], key(h[1])))
    # monotonic filter: drop numbers that go backwards in key order relative to the running max at depth<=2
    out, last = [], None
    for h in hs:
        k = key(h[1])
        if last is not None and k < last:
            continue
        out.append(h)
        last = k
    return out

def doc_headings(doc):
    o = from_outline(doc)
    if sum(1 for h in o if h[1] and '.' in h[1]) >= 10:
        return o, "outline"
    t = from_text(doc)
    if len(t) >= 10:
        return t, "text"
    if o:
        return o, "outline"
    return [], None

H_CACHE = {d: doc_headings(d) for d in syl["docs"]}

# sections: numbered depth-2 heads (X.Y). If a depth-2 section > 22 pages and has depth-3 children, split at depth 3.
def units_for_range(doc, p0, p1, note):
    hs, method = H_CACHE[doc]
    hs = sorted([h for h in hs if h[0] is not None], key=lambda h: h[0])
    if doc == "B12" or method is None:
        return block_units(doc, p0, p1, note)
    # candidate boundaries: depth<=2 numbered heads, or unnumbered outline entries (articles/chapters)
    cands = [h for h in hs if (h[1] is None) or depth(h[1]) <= 2]
    deep = [h for h in hs if h[1] and depth(h[1]) == 3]
    # find the head in effect at p0
    before = [h for h in cands if h[0] <= p0]
    inside = [h for h in cands if p0 < h[0] <= p1]
    starts = ([before[-1]] if before else [(p0, None, "(opening)")]) + inside
    us = []
    for i, h in enumerate(starts):
        a = max(p0, h[0])
        b = (starts[i + 1][0] - 1) if i + 1 < len(starts) else p1
        if starts[i + 1:] and starts[i + 1][0] == h[0]:
            b = a - 1  # head shares its page with the next head: fold into it as a subsection
            if i + 1 < len(starts): starts[i + 1] = (starts[i + 1][0], starts[i + 1][1], starts[i + 1][2])
            continue
        if b < a:
            continue
        sub = [d for d in deep if a <= d[0] <= b and (h[1] is None or d[1].startswith(h[1] + '.'))]
        if b - a + 1 > 22 and len(sub) >= 2:
            # split at depth-3 heads
            pts = [(a, h[1], h[2])] + [s for s in sub if s[0] > a]
            for j, s in enumerate(pts):
                aa = s[0]; bb = (pts[j + 1][0] - 1) if j + 1 < len(pts) else b
                if bb < aa: continue
                us.append(dict(num=s[1], title=s[2], p0=aa, p1=bb, nsub=0, method=method))
        else:
            us.append(dict(num=h[1], title=h[2], p0=a, p1=b, nsub=len(sub), method=method))
    # chapter-level only docs (depth-1 numbers or unnumbered) with huge units: split into ~8-page blocks
    out = []
    for u in us:
        n = u["p1"] - u["p0"] + 1
        if n > 30 and (u["num"] is None or depth(u["num"]) == 1):
            k = max(2, round(n / 10))
            step = n / k
            for j in range(k):
                aa = u["p0"] + round(j * step); bb = u["p0"] + round((j + 1) * step) - 1
                out.append(dict(u, p0=aa, p1=bb, title=f"{u['title']} [block {j+1}/{k}]", method=u["method"] + "+block"))
        else:
            out.append(u)
    return out

def block_units(doc, p0, p1, note):
    n = p1 - p0 + 1
    if doc == "B12":
        # SMAD: note gives chapters ('פרקים 11–13', 'פרק 22', '24.1–24.3'); typical SMAD section ~8 pp
        nums = re.findall(r'\d+\.\d+', note or "")
        k = max(1, round(n / 8))
        meth = "note(SMAD image-only)"
    else:
        k = max(1, round(n / 6)); nums = []; meth = "block"
    step = n / k
    out = []
    for j in range(k):
        aa = p0 + round(j * step); bb = p0 + round((j + 1) * step) - 1
        out.append(dict(num=None, title=f"{note[:50] if note else doc} [block {j+1}/{k}]", p0=aa, p1=bb, nsub=0, method=meth))
    return out

units = []
for m in syl["modules"]:
    for si, s in enumerate(m["sources"]):
        if s["role"] not in ("main", "supp") or not s.get("pages"):
            continue
        for u in units_for_range(s["doc"], s["pages"][0], s["pages"][1], s.get("note", "")):
            u.update(module=m["id"], tier=m["tier"], part=m["part"], role=s["role"], doc=s["doc"],
                     mtitle=m.get("en", ""), snote=s.get("note", ""))
            u["pages"] = u["p1"] - u["p0"] + 1
            u["uid"] = f"{m['id']}/{si}/{s['doc']}:{u['p0']}-{u['p1']}"
            units.append(u)
json.dump(units, open(os.path.join(H, "S_mil_units.json"), "w"), ensure_ascii=False, indent=0)
from collections import Counter
print("units", len(units), "pages", sum(u["pages"] for u in units))
c = Counter(); pg = Counter()
for u in units:
    c[(u["doc"], u["method"])] += 1; pg[(u["doc"], u["method"])] += u["pages"]
for k in sorted(c):
    print(k, c[k], pg[k], round(pg[k] / c[k], 1))
