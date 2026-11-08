"""Step 2: text features + section type for every unit (S_mil_units.json -> S_mil_units_f.json).
Types: theory, derivation, examples, history, doctrine, descriptive, summary, problems, appendix.
('descriptive' = system/equipment description without results; added because ~1/4 of the corpus is that
 and it is neither doctrine nor theory.)"""
import json, os, re
H = os.path.dirname(os.path.abspath(__file__))
R2 = os.path.join(H, "..", "..", "round2")
txt = json.load(open(os.path.join(R2, "cache", "mil_text.json")))
units = json.load(open(os.path.join(H, "S_mil_units.json")))

EQLAB = re.compile(r'\(\s*[A-Z]?\d{1,2}[.\-]\d{1,3}(?:[.\-]\d{1,3})?[a-z]?\s*\)\s*$')
EQSYM = re.compile(r'[=≈∝∫∑√≤≥±]|ﬃ|¼')
YEAR = re.compile(r'\b(1[5-9]\d\d|20[0-2]\d)\b')
DOCTR = re.compile(r'\b(doctrine|tactic\w*|battalion|brigade|division|regiment|company|platoon|command(er)?s?|mission|operation(al|s)?|maneuver|enemy|friendly|commander|deploy\w*|concept of operations|threat|reconnaissance|air defense|CONOPS|echelon|logistic\w*)\b', re.I)
EXAMPLE = re.compile(r'\b(Example|EXAMPLE|Worked example|Sample Problem|Solution:|For example)\b')
DERIV = re.compile(r'\b(substitut\w+|therefore|hence|we obtain|it follows|differentiat\w+|integrat\w+|solving|derive\w*|yields)\b', re.I)
LAW = re.compile(r'\b(equation|law|theorem|is given by|is defined as|defined as|rule of thumb|formula)\b', re.I)

def kind(u, f):
    t = (u["title"] + " " + u["snote"]).lower()
    if u["doc"].startswith("D"):
        t = re.sub(r'appendix|נספח', '', u["title"].lower())
    if re.search(r'appendix|glossary|acronym|abbreviation|references|bibliograph|index\b|list of symbols|נספח', t):
        return "appendix"
    if re.search(r'problem|exercise|questions\b|review questions', u["title"].lower()):
        return "problems"
    if re.search(r'summary|conclusion|further reading|closing remarks', u["title"].lower()):
        return "summary"
    if u["doc"] == "B12":
        if re.search(r'cost|law|financ|operations|management|policy|history|launch|ground', (u["mtitle"]+" "+u["snote"]).lower()):
            return "descriptive"
        return "theory"  # image-only: SMAD is design-equation/handbook text; flagged
    if u["doc"].startswith("D"):
        return "doctrine"
    if u["doc"] in ("B11", "B17") or (f["years_pp"] >= 2.0 and f["eq_pp"] < 0.5) or re.search(r'histor|evolution|background', t) and f["eq_pp"] < 0.5:
        return "history"
    if f["ex_pp"] >= 0.5 and f["eq_pp"] >= 0.5:
        return "examples"
    if f["eq_pp"] >= 3.0 and f["deriv_pp"] >= 1.0:
        return "derivation"
    if f["eq_pp"] >= 0.6 or f["law_pp"] >= 1.5:
        return "theory"
    if f["doctr_pp"] >= 4.0:
        return "doctrine"
    return "descriptive"

for u in units:
    pages = [txt.get(u["doc"], {}).get(str(p), "") for p in range(u["p0"], u["p1"] + 1)]
    body = "\n".join(pages)
    n = max(1, u["pages"])
    lines = body.split("\n")
    eqlab = sum(1 for l in lines if EQLAB.search(l))
    eqsym = sum(1 for l in lines if EQSYM.search(l) and len(l.strip()) < 90)
    words = len(body.split())
    f = dict(words=words, wpp=round(words / n), text_ok=sum(1 for p in pages if len(p.strip()) > 200) / n,
             eqlab=eqlab, eq_pp=round(max(eqlab, eqsym * 0.5) / n, 2),
             ex_pp=round(len(EXAMPLE.findall(body)) / n, 2), years_pp=round(len(YEAR.findall(body)) / n, 2),
             doctr_pp=round(len(DOCTR.findall(body)) / n, 2), deriv_pp=round(len(DERIV.findall(body)) / n, 2),
             law_pp=round(len(LAW.findall(body)) / n, 2))
    u["f"] = f
    u["type"] = kind(u, f)
    u["flag"] = []
    if u["doc"] == "B12": u["flag"].append("image-only: estimated from note + page count")
    elif f["text_ok"] < 0.5: u["flag"].append("mostly image/figure pages")
    if "block" in u["method"]: u["flag"].append("inferred heading block")
json.dump(units, open(os.path.join(H, "S_mil_units_f.json"), "w"), ensure_ascii=False, indent=0)
from collections import Counter
c = Counter(u["type"] for u in units); pg = Counter()
for u in units: pg[u["type"]] += u["pages"]
for k in c: print(k, c[k], pg[k])
