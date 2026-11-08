"""Step 2: rerank top-60 candidates by idf-weighted coverage of the subtopic's own name terms in the section
(title+body) and a type factor. -> MG_rr.json  {sid: [(key, app, final, cov, comb)]}"""
import json, os, pickle, math, re, collections, sys
H = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, H)
from MG_match_util import toks
D = json.load(open(f'{H}/MG_scores.json'))
bodies = dict(pickle.load(open(f'{H}/MG_bodies.pkl', 'rb')))
title = {d[0]: d[2] for d in D['docs']}
R3 = os.path.dirname(H)
SE = {s['key']: s for s in json.load(open(f'{R3}/registry/S_eng_registry.json'))['sections']}
UM = {u['uid']: u for u in json.load(open(f'{R3}/registry/S_mil_registry.json'))['units']}
NONTEACH = {'history', 'notes_biblio', 'appendix_ref', 'summary', 'problems', 'appendix'}
def typ(k): return (SE.get(k) or UM.get(k))['type']
# document frequency over unigram tokens of titles+bodies (for idf weights of query terms)
need = set()
for s in D['subs']: need.update(w for w in toks(s['name']) if '_' not in w)
df = collections.Counter(); tokcache = {}
for k in title:
    ts = set(w for w in toks(title[k] + ' ' + bodies.get(k, '')) if '_' not in w)
    tokcache[k] = ts & need
    df.update(tokcache[k])
N = len(title)
idf = {w: math.log((N + 1) / (df[w] + 0.5)) for w in need}
out = {}
for s in D['subs']:
    q = [w for w in dict.fromkeys(toks(s['name'])) if '_' not in w]
    tot = sum(idf[w] for w in q) or 1
    rows = []
    for k, app, comb, ct, cb in D['top'][s['sid']]:
        cov = sum(idf[w] for w in q if w in tokcache[k]) / tot
        tf = 0.6 if typ(k) in NONTEACH else 1.0
        rows.append((k, app, round(comb * (0.25 + 0.75 * cov) * tf, 4), round(cov, 2), comb))
    hq = [w for w in dict.fromkeys(toks(s.get('head', ''))) if '_' not in w]
    htot = sum(idf[w] for w in hq) or 1
    best = {r[0]: r for r in rows}
    for k, app, comb in D['head'].get(s['sid'], []):
        hcov = sum(idf[w] for w in hq if w in tokcache[k]) / htot
        tf = 0.6 if typ(k) in NONTEACH else 1.0
        # head-only match: discounted 0.8, and needs the head fully present
        f = round(0.8 * comb * (0.25 + 0.75 * hcov) * tf * (1 if hcov >= 0.99 else 0.5), 4)
        if k not in best or best[k][2] < f: best[k] = (k, app, f, round(hcov, 2), comb)
    rows = list(best.values())
    rows.sort(key=lambda r: -r[2])
    out[s['sid']] = rows
json.dump(out, open(f'{H}/MG_rr.json', 'w'))
print('ok')
