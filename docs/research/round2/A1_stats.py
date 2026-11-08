"""A1 part 1: exact curriculum statistics for Gilua (engineering) and Lanchester (military).

Read-only on the repo. Inputs:
  library/engineering/syllabus/{syllabus.json,toc/*.md}
  library/military/syllabus/syllabus.json
  eng/app/artifact/lib/text/*.json   (extracted page text, Gilua)
  round2/cache/mil_text.json         (pdftotext of every Lanchester source, made by A1_extract_mil.py)
Outputs: round2/cache/A1_stats.json and printed tables.
"""
import json, os, re, glob, statistics as st, collections

R = "/home/user/repo-exercise"
HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, "cache")
os.makedirs(CACHE, exist_ok=True)

ENG = json.load(open(f"{R}/library/engineering/syllabus/syllabus.json"))
MIL = json.load(open(f"{R}/library/military/syllabus/syllabus.json"))
APPS = {"eng": ENG, "mil": MIL}

# ---------- page text ----------
def load_eng_text():
    out = {}
    for f in glob.glob(f"{R}/eng/app/artifact/lib/text/*.json"):
        doc = os.path.basename(f)[:-5]
        d = json.load(open(f))
        out[doc] = {int(k): v["t"] for k, v in d.items()}
    return out

def load_mil_text():
    d = json.load(open(os.path.join(CACHE, "mil_text.json")))
    return {doc: {int(k): t for k, t in pages.items()} for doc, pages in d.items()}

TEXT = {"eng": load_eng_text(), "mil": load_mil_text()}
WORD = re.compile(r"[A-Za-z֐-׿][A-Za-z֐-׿'\-]+")
def words(t):
    return len(WORD.findall(t or ""))

# ---------- TOC (Gilua) ----------
def parse_toc(doc):
    p = f"{R}/library/engineering/syllabus/toc/{doc}.md"
    if not os.path.exists(p):
        return []
    rows = []
    cur_ch = None
    for line in open(p):
        s = line.rstrip("\n")
        m = re.match(r"^(CH|APP|BACK|FRONT)\s+(\S+)\s+(\d+)-(\d+)\s*(.*)$", s)
        if m:
            kind, num, a, b, title = m.groups()
            if kind in ("BACK", "FRONT"):  # BACK has no number token
                m2 = re.match(r"^(BACK|FRONT)\s+(\d+)-(\d+)\s*(.*)$", s)
                if m2:
                    kind, a, b, title = m2.groups(); num = ""
            cur_ch = dict(kind=kind, num=num, a=int(a), b=int(b), title=title)
            rows.append(dict(level=0, **cur_ch))
            continue
        m = re.match(r"^\s+S\s+(\S+)\s+(\d+)\s+(.*)$", s)
        if m and cur_ch:
            num, a, title = m.groups()
            rows.append(dict(level=1, kind="S", num=num, a=int(a), b=None, title=title, ch=cur_ch["num"], chb=cur_ch["b"]))
    # section ends
    secs = [r for r in rows if r["level"] == 1]
    for i, r in enumerate(secs):
        nxt = secs[i + 1]["a"] if i + 1 < len(secs) and secs[i + 1]["ch"] == r["ch"] else r["chb"] + 1
        r["b"] = max(r["a"], min(nxt - 1 if nxt > r["a"] else r["a"], r["chb"]))
    return rows

TOC = {doc: parse_toc(doc) for doc in ENG["docs"]}

ADMIN = re.compile(r"^(problems?|exercises?|additional exercises|notes( and further reading)?|summary|references.*|bibliograph.*|further reading|concluding remarks|wrap-up.*|introduction( and synopsis)?|index|review.*|questions)\b", re.I)
PROB = re.compile(r"^(problems?|exercises?|additional exercises|questions)", re.I)
HIST = re.compile(r"histor|biograph|bibliographical and historical", re.I)

def eng_page_class(doc, page):
    """Classify a Gilua page by the TOC section it falls in."""
    for r in TOC.get(doc, []):
        if r["level"] == 1 and r["a"] <= page <= r["b"]:
            t = r["title"]
            if PROB.match(t) or r["num"] == "P":
                return "problems"
            if HIST.search(t):
                return "history"
            if re.match(r"^(summary|notes|references|bibliograph|further reading|concluding|wrap-up)", t, re.I):
                return "summary/notes"
            return "body"
    for r in TOC.get(doc, []):
        if r["level"] == 0 and r["a"] <= page <= r["b"]:
            if r["kind"] == "APP":
                return "appendix"
            if r["kind"] in ("BACK", "FRONT"):
                return "front/back"
            return "body"
    return "body"

# ---------- Lanchester heuristics ----------
MIL_PROB_HDR = re.compile(r"^\s*(PROBLEMS|Problems|EXERCISES|Exercises|QUESTIONS|Review Questions|Study Questions)\s*$", re.M)
MIL_REF_HDR = re.compile(r"^\s*(REFERENCES|References|BIBLIOGRAPHY|Bibliography)\s*$", re.M)
MIL_CH_HDR = re.compile(r"^\s*(CHAPTER|Chapter)\s+\d+", re.M)
YEAR = re.compile(r"\b(1[6-9]\d\d|20[0-2]\d)\b")
EXAMPLE = re.compile(r"^\s*(EXAMPLE|Example)\s+\d+([.\-]\d+)*", re.M)
EQ = re.compile(r"=")

def mil_classify_range(doc, a, b):
    """State machine over consecutive pages: problems/references mode until next chapter."""
    pages = TEXT["mil"].get(doc, {})
    mode = "body"; out = {}
    for p in range(a, b + 1):
        t = pages.get(p, "")
        if MIL_CH_HDR.search(t[:400]):
            mode = "body"
        if MIL_PROB_HDR.search(t):
            mode = "problems"
        elif MIL_REF_HDR.search(t):
            mode = "references"
        c = mode
        if c == "body":
            yrs = len(YEAR.findall(t)); eqs = len(EQ.findall(t))
            if yrs >= 4 and eqs <= 1:
                c = "history"
        out[p] = c
    return out

def generic_flags(t):
    return dict(example=bool(EXAMPLE.search(t or "")), n_examples=len(EXAMPLE.findall(t or "")),
                eqs=len(EQ.findall(t or "")))

# ---------- page accounting ----------
DOCPAGES = {**{k: v["pages"] for k, v in ENG["docs"].items()}, **{k: v["pages"] for k, v in MIL["docs"].items()}}
def rng(s):
    """Page range of a source; pages=None means the whole document (articles)."""
    if not s.get("pages"):
        return 1, DOCPAGES[s["doc"]]
    a, b = s["pages"]
    return a, b

def module_pages(m, roles):
    return sum(rng(s)[1] - rng(s)[0] + 1 for s in m["sources"] if s["role"] in roles)

def stats_app(app):
    S = APPS[app]
    mods = S["modules"]
    tiers = collections.Counter(m["tier"] for m in mods)
    roles = sorted({s["role"] for m in mods for s in m["sources"]})
    # pages by tier x role (sum) and distinct (union)
    tab = collections.defaultdict(lambda: collections.defaultdict(int))
    distinct = collections.defaultdict(set)
    for m in mods:
        for s in m["sources"]:
            a, b = rng(s)
            tab[m["tier"]][s["role"]] += b - a + 1
            for p in range(a, b + 1):
                distinct[(m["tier"], s["role"])].add((s["doc"], p))
    # distinct teaching pages (main+supp+article) across all tiers
    teach_roles = {"main", "supp", "article"}
    all_teach = set().union(*[v for (t, r), v in distinct.items() if r in teach_roles])
    # pages per module (main+article)
    mp = {m["id"]: module_pages(m, {"main", "article"}) for m in mods}
    def dist(xs):
        xs = sorted(xs)
        q = lambda f: xs[min(len(xs) - 1, int(f * len(xs)))]
        return dict(n=len(xs), min=xs[0], p10=q(.1), p25=q(.25), median=st.median(xs), mean=round(st.mean(xs), 1),
                    p75=q(.75), p90=q(.9), max=xs[-1], sum=sum(xs))
    by_tier_dist = {t: dist([mp[m["id"]] for m in mods if m["tier"] == t]) for t in tiers}
    # parts
    parts = collections.OrderedDict()
    for p in S["parts"]:
        ms = [m for m in mods if m["part"] == p["id"]]
        parts[p["id"]] = dict(title=p["title"], n=len(ms),
                              core=sum(mp[m["id"]] for m in ms if m["tier"] == "core"),
                              adv=sum(mp[m["id"]] for m in ms if m["tier"] == "adv"),
                              ref=sum(mp[m["id"]] for m in ms if m["tier"] == "ref"))
    return dict(tiers=dict(tiers), roles=roles,
                pages={t: dict(v) for t, v in tab.items()},
                distinct={f"{t}/{r}": len(v) for (t, r), v in distinct.items()},
                distinct_teach_pages=len(all_teach),
                module_pages=mp, dist=by_tier_dist, parts=parts)

# ---------- prerequisite graph ----------
def graph(app, tiers=("core", "adv", "ref"), weight="pages"):
    S = APPS[app]; mods = [m for m in S["modules"] if m["tier"] in tiers]
    ids = {m["id"] for m in mods}
    pre = {m["id"]: [p for p in m.get("prereq", []) if p in ids] for m in mods}
    w = {m["id"]: module_pages(m, {"main", "article"}) for m in mods}
    order = {m["id"]: i for i, m in enumerate(S["modules"])}
    depth, cp, cpw, best = {}, {}, {}, {}
    def dep(i):
        if i in depth: return depth[i]
        depth[i] = 1 + max([dep(p) for p in pre[i]] or [0]); return depth[i]
    def crit(i):
        if i in cpw: return cpw[i]
        opts = [(crit(p), p) for p in pre[i]]
        if opts:
            v, p = max(opts); cpw[i] = v + w[i]; best[i] = p
        else:
            cpw[i] = w[i]; best[i] = None
        return cpw[i]
    for i in pre: dep(i); crit(i)
    end = max(cpw, key=cpw.get)
    path = []; x = end
    while x: path.append(x); x = best[x]
    path.reverse()
    levels = collections.Counter(depth.values())
    no_pre = sum(1 for i in pre if not pre[i])
    edges = sum(len(v) for v in pre.values())
    # longest chain in modules
    dend = max(depth, key=depth.get); chain = []; x = dend
    while x:
        chain.append(x); ps = pre[x]; x = max(ps, key=lambda p: depth[p]) if ps else None
    chain.reverse()
    return dict(n=len(mods), edges=edges, roots=no_pre, depth=max(depth.values()),
                width=max(levels.values()), levels=dict(sorted(levels.items())),
                crit_pages=cpw[end], crit_path=path, crit_modules=len(path),
                longest_chain=chain, total_pages=sum(w.values()),
                parallelism=round(sum(w.values()) / cpw[end], 2),
                missing_prereq_field=sum(1 for m in mods if "prereq" not in m))

# ---------- words per page & page types ----------
def page_profile(app, tiers=("core", "adv")):
    S = APPS[app]
    seen = set(); rows = []
    for m in S["modules"]:
        if m["tier"] not in tiers: continue
        for s in m["sources"]:
            if s["role"] not in ("main", "article"): continue
            a, b = rng(s); doc = s["doc"]
            cls = mil_classify_range(doc, a, b) if app == "mil" else None
            for p in range(a, b + 1):
                if (doc, p) in seen: continue
                seen.add((doc, p))
                t = TEXT[app].get(doc, {}).get(p)
                c = cls[p] if cls else eng_page_class(doc, p)
                f = generic_flags(t)
                rows.append(dict(doc=doc, p=p, tier=m["tier"], mod=m["id"], w=words(t) if t is not None else None, c=c, **f))
    have = [r for r in rows if r["w"] is not None]
    textual = [r for r in have if r["w"] >= 60]
    per_doc = collections.defaultdict(list)
    for r in textual: per_doc[r["doc"]].append(r["w"])
    cls = collections.Counter(r["c"] for r in rows)
    ex_pages = sum(1 for r in rows if r["example"])
    n_ex = sum(r["n_examples"] for r in rows)
    body_tx = [r["w"] for r in textual if r["c"] == "body"]
    return dict(pages=len(rows), with_text=len(have), textual=len(textual),
                low_text=len(have) - len(textual),
                words_total=sum(r["w"] for r in have),
                wpp_median=st.median([r["w"] for r in textual]) if textual else None,
                wpp_mean=round(st.mean([r["w"] for r in textual]), 1) if textual else None,
                wpp_body_median=st.median(body_tx) if body_tx else None,
                classes=dict(cls), example_pages=ex_pages, examples=n_ex,
                per_doc={d: dict(n=len(v), median=st.median(v)) for d, v in sorted(per_doc.items())},
                rows=rows)

if __name__ == "__main__":
    out = {}
    for app in APPS:
        s = stats_app(app)
        g_all = graph(app); g_core = graph(app, ("core",))
        prof = page_profile(app)
        out[app] = dict(stats={k: v for k, v in s.items() if k != "module_pages"}, module_pages=s["module_pages"],
                        graph_all=g_all, graph_core=g_core,
                        profile={k: v for k, v in prof.items() if k != "rows"})
        json.dump(prof["rows"], open(os.path.join(CACHE, f"A1_pages_{app}.json"), "w"))
        print("=" * 30, app)
        print("tiers", s["tiers"])
        print("pages tier x role", json.dumps(s["pages"]))
        print("distinct", s["distinct"], "distinct teach", s["distinct_teach_pages"])
        print("dist", json.dumps(s["dist"]))
        for k in ("n", "edges", "roots", "depth", "width", "crit_pages", "crit_modules", "total_pages", "parallelism", "missing_prereq_field"):
            print(f"graph {k}: all={g_all[k]} core={g_core[k]}")
        print("crit path core", g_core["crit_path"])
        print("longest chain core", g_core["longest_chain"])
        print("levels core", g_core["levels"])
        pr = out[app]["profile"]
        print({k: v for k, v in pr.items() if k != "per_doc"})
        print("per doc", json.dumps(pr["per_doc"]))
    json.dump(out, open(os.path.join(CACHE, "A1_stats.json"), "w"), ensure_ascii=False, indent=1)
