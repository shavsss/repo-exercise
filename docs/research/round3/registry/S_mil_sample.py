"""Step 3a: stratified sample (book group x type) of >= 88 units, and reading digests for hand counting.
Writes S_mil_sample.json (uids) and digests/batchN.txt."""
import json, os, re, random
from collections import defaultdict
H = os.path.dirname(os.path.abspath(__file__))
R2 = os.path.join(H, "..", "..", "round2")
txt = json.load(open(os.path.join(R2, "cache", "mil_text.json")))
units = json.load(open(os.path.join(H, "S_mil_units_f.json")))
GROUP = {"B02": "radar", "B02a": "radar", "B02b": "radar", "B01": "ew", "B04": "ew", "B03": "eo", "B05": "gnss",
         "B06": "missile", "B07": "systems", "B08": "systems", "B09": "systems", "B10": "systems",
         "B11": "history", "D5": "doctrine", "D6": "doctrine", "D8": "doctrine", "D9": "doctrine"}
random.seed(20261030)
strata = defaultdict(list)
seen = set()
for u in units:
    if u["doc"] == "B12" or u["f"]["text_ok"] < 0.5 or u["pages"] > 25:
        continue
    k = (u["doc"], u["p0"], u["p1"])
    if k in seen: continue  # same pages used by two modules
    seen.add(k)
    strata[(GROUP[u["doc"]], u["type"])].append(u)
# allocation: sqrt(pages) proportional, min 1 per stratum with >= 2 units, total ~90
tot = {k: sum(x["pages"] for x in v) for k, v in strata.items()}
Z = sum(v ** 0.5 for v in tot.values())
sample = []
for k, v in sorted(strata.items()):
    n = max(1 if len(v) >= 1 else 0, round(92 * tot[k] ** 0.5 / Z))
    n = min(n, len(v))
    sample += random.sample(v, n)
print(len(sample), sum(u["pages"] for u in sample))
json.dump([u["uid"] for u in sample], open(os.path.join(H, "S_mil_sample.json"), "w"), indent=0)

EQ = re.compile(r'\(\s*[A-Z]?\d{1,2}[.\-]\d{1,3}(?:[.\-]\d{1,3})?[a-z]?\s*\)\s*$|[=≈∝]|ﬃ|¼')
KEY = re.compile(r'\b(is defined|defined as|is given by|equation|law|theorem|rule of thumb|we define|known as|called|model|principle|method|ratio|probability|range|limit)\b', re.I)
HEAD = re.compile(r'^\s{0,14}(\d{1,2}(?:\.\d{1,2}){1,3}|[A-H]\.\d)\.?\s{1,5}[A-Z]')
os.makedirs(os.path.join(H, "digests"), exist_ok=True)
for b in range(0, len(sample), 15):
    out = []
    for i, u in enumerate(sample[b:b + 15], start=b):
        body = [txt[u["doc"]].get(str(p), "") for p in range(u["p0"], u["p1"] + 1)]
        lines = [l.strip() for l in "\n".join(body).split("\n") if l.strip()]
        heads = [l[:80] for l in lines if HEAD.match(l) and not re.search(r'\s{3,}\d+$', l)]
        eqs = [re.sub(r'\s{2,}', ' ', l)[:100] for l in lines if EQ.search(l) and 6 < len(l) < 140]
        keys = [re.sub(r'\s{2,}', ' ', l)[:110] for l in lines if KEY.search(l) and len(l) > 40]
        out.append(f"#### [{i}] {u['uid']} | {u['type']} | {u['pages']}pp | {u['num']} {u['title']} | mod {u['module']} {u['mtitle']}")
        out.append("H: " + " || ".join(heads[:12]))
        out.append("EQ(" + str(len(eqs)) + "): " + " || ".join(eqs[:10]))
        step = max(1, len(keys) // 10)
        out.append("K(" + str(len(keys)) + "): " + " || ".join(keys[::step][:10]))
    open(os.path.join(H, "digests", f"batch{b // 15}.txt"), "w").write("\n".join(out))
