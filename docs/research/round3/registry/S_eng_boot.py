"""Bootstrap CI for registry totals (main pages, all tiers): resample the 125 random hand-counted sections within book class,
re-estimate class x {teaching, non-teaching} per-page rates, apply to the registry's unique main-section pages. Run: python3 -I S_eng_boot.py"""
import json, random, collections, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
D = os.path.dirname(os.path.abspath(__file__))
from S_eng_counts import COUNTS
samp = json.load(open(f'{D}/S_eng_sample.json'))
reg = json.load(open(f'{D}/S_eng_registry.json'))['sections']
NT = {'front', 'notes_biblio', 'problems', 'summary', 'appendix_ref'}
CL = {s['doc']: s['book_class'] for s in reg}
pages = collections.Counter()
for s in reg:
    if any(m['role'] == 'main' for m in s['modules']):
        pages[(s['book_class'], s['type'] in NT)] += sum(m['pages'] for m in s['modules'] if m['role'] == 'main')
strata = collections.defaultdict(list)
for i, x in enumerate(samp):
    if x['random']: strata[(CL[x['doc']], x['type'] in NT)].append(i)
rng = random.Random(11); out = collections.defaultdict(list)
for _ in range(4000):
    tot = collections.Counter()
    for k, pp in pages.items():
        L = strata.get(k) or [i for (c, nt), v in strata.items() if nt == k[1] for i in v]
        b = [rng.choice(L) for _ in L]
        pg = sum(samp[i]['pages'] for i in b) or 1
        for j, t in enumerate(['strict', 'K', 'S', 'C']):
            tot[t] += pp * sum(COUNTS[i][j] for i in b) / pg
    for t in tot: out[t].append(tot[t])
for t, v in out.items():
    v.sort(); n = len(v)
    print(f'{t:6s} main all tiers (with repeats): P10 {v[n // 10]:.0f}  P50 {v[n // 2]:.0f}  P90 {v[9 * n // 10]:.0f}')
