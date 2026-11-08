"""A1 part 3b: three estimates of genuinely redundant teaching (same result taught twice).

  LOW   near-duplicate section titles in different books (token Jaccard >= 0.6), non-first members.
  MID   section whose TITLE names a result (from the 48-result list in A1_overlap.py) that an EARLIER
        module already taught from a DIFFERENT book (>= 3 pages). Curriculum order: Gilua, then Lanchester.
  HIGH  section whose text is dominated by a result family already seen earlier in any module
        (includes legitimate progression inside a topic: an upper bound, NOT redundancy).
Outputs cache/A1_redundancy.json and the cross-app overlap map (result -> modules in each app).
"""
import json, os, collections
HERE = os.path.dirname(os.path.abspath(__file__)); CACHE = os.path.join(HERE, "cache")
import A1_concepts as C

A = json.load(open(os.path.join(CACHE, "A1_assign.json")))
UN = json.load(open(os.path.join(CACHE, "A1_units.json")))
import A1_stats as S
order = {}
for a, off in (("eng", 0), ("mil", 100000)):
    for i, m in enumerate(S.APPS[a]["modules"]):
        order[(a, m["id"])] = off + i
content = [u for u in UN["units"] if not u["admin"]]
TOTAL = sum(u["pages"] for u in content)
TOT_APP = collections.Counter();
for u in content: TOT_APP[(u["app"], u["tier"])] += u["pages"]

# LOW
n, lab = C.cluster_titles(content, 0.6)
cl = collections.defaultdict(list)
for u, l in zip(content, lab): cl[l].append(u)
low = collections.Counter()
for v in cl.values():
    if len({x["doc"] for x in v}) < 2: continue
    v = sorted(v, key=lambda x: order[(x["app"], x["mod"])])
    first_doc = v[0]["doc"]
    for x in v[1:]:
        if x["doc"] != first_doc: low[(x["app"], x["tier"])] += x["pages"]

# MID / HIGH
A.sort(key=lambda x: (order[(x["app"], x["mod"])], x["a"]))
seen = collections.defaultdict(list)    # result -> [(doc, mod, pages)]
mid = collections.Counter(); high = collections.Counter()
mid_by_res = collections.defaultdict(lambda: collections.Counter())
for x in A:
    prev = seen[x["result"]]
    if prev:
        high[(x["app"], x["tier"])] += x["pages"]
        if x["title_match"] and any(d != x["doc"] and p >= 3 and m != x["mod"] for d, m, p, _ in prev):
            mid[(x["app"], x["tier"])] += x["pages"]
            mid_by_res[x["result"]][(x["app"], "cross" if prev[0][3] != x["app"] else "same")] += x["pages"]
    seen[x["result"]].append((x["doc"], x["mod"], x["pages"], x["app"]))

def show(name, c):
    tot = sum(c.values())
    print(f"{name:5s} total {tot:6.0f} pages = {tot/TOTAL:5.1%} of {TOTAL} content pages | " +
          " ".join(f"{a}/{t}:{c[(a,t)]:.0f} ({c[(a,t)]/TOT_APP[(a,t)]:.0%})" for a, t in sorted(TOT_APP)))
    return tot
res = {}
for name, c in (("LOW", low), ("MID", mid), ("HIGH", high)):
    res[name] = dict(total=show(name, c), by={f"{a}/{t}": c[(a, t)] for a, t in TOT_APP}, share=sum(c.values()) / TOTAL)
print("\nMID by result (pages re-taught; same-app / cross-app):")
rows = []
for r, c in sorted(mid_by_res.items(), key=lambda kv: -sum(kv[1].values())):
    same = c[("eng", "same")] + c[("mil", "same")]; cross = c[("eng", "cross")] + c[("mil", "cross")]
    rows.append(dict(result=r, same=same, cross=cross))
    print(f"   {r[:52]:52s} same-app {same:4d}  cross-app {cross:4d}")
res["mid_by_result"] = rows
res["total_content_pages"] = TOTAL
res["tot_app"] = {f"{a}/{t}": v for (a, t), v in TOT_APP.items()}

# cross-app map: result -> modules (pages) in each app, from the dominant-topic assignment
cmap = collections.defaultdict(lambda: dict(eng=collections.Counter(), mil=collections.Counter()))
for x in A:
    cmap[x["result"]][x["app"]][x["mod"]] += x["pages"]
res["map"] = {r: dict(eng=d["eng"].most_common(6), mil=d["mil"].most_common(6),
                      eng_mods=len(d["eng"]), mil_mods=len(d["mil"]),
                      eng_pages=sum(d["eng"].values()), mil_pages=sum(d["mil"].values())) for r, d in cmap.items()}
json.dump(res, open(os.path.join(CACHE, "A1_redundancy.json"), "w"), ensure_ascii=False, indent=1)
