"""Step 3a: stratified random sample of used sections + reading digests.
Strata: every book (>=3), every type (>=8). Seed fixed. Writes S_eng_sample.json and digests/batch_*.txt.
Run: python3 -I S_eng_sample.py
"""
import json, random, re, os, collections, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from S_eng_build import section_text
OUT = os.path.dirname(os.path.abspath(__file__))
S = [s for s in json.load(open(f'{OUT}/S_eng_sections.json')) if s['used']]
rnd = random.Random(20261030)
by_doc = collections.defaultdict(list)
for s in S: by_doc[s['doc']].append(s)
pick = {}
for d, L in sorted(by_doc.items()):
    # page-weighted draw within book so long sections are represented as in the time model
    L2 = [x for x in L if x['pages'] >= 0.3]
    for x in rnd.sample(L2, min(3, len(L2))): pick[x['key']] = x
by_type = collections.defaultdict(list)
for s in S: by_type[s['type']].append(s)
for t, L in by_type.items():
    have = sum(1 for x in pick.values() if x['type'] == t)
    need = max(0, 9 - have)
    cand = [x for x in L if x['key'] not in pick]
    for x in rnd.sample(cand, min(need, len(cand))): pick[x['key']] = x
rest = [x for x in S if x['key'] not in pick]
for x in rnd.sample(rest, 125 - len(pick)): pick[x['key']] = x
# R8 calibration sections (pages hand-counted in R8): sections overlapping these ranges
R8 = {'S1': ('K2', 127, 142, 3), 'S2': ('F1', 221, 235, 3), 'S3': ('E01', 316, 330, 1), 'S4': ('E05', 64, 75, 3),
      'S8': ('E13', 325, 340, 2), 'S11': ('E22', 734, 745, 1), 'S12': ('E26', 53, 62, 0)}
calib = {}
for k, (d, a, b, n) in R8.items():
    calib[k] = [x['key'] for x in S if x['doc'] == d and x['e'] > a and x['s'] < b + 1]
sample = sorted(pick.values(), key=lambda x: (x['doc'], x['s']))

KEY = re.compile(r'(Theorem|THEOREM|Lemma|Law|Principle|Definition|DEFINITION|is called|is defined|we define|is known as|equation|Equation|formula|rule|Corollary|Proposition|Example|EXAMPLE|[=≈∝])')
def digest(x):
    txt = section_text(x)
    cap = int(min(700 + 260 * x['pages'], 2600))
    lines = [l.strip() for l in txt.split('\n') if l.strip()]
    head = ' '.join(lines[:6])[:300]
    keep, n = [], len(head)
    for l in lines[6:]:
        if KEY.search(l) and len(l) > 3:
            l = re.sub(r'\s+', ' ', l)[:140]
            if n + len(l) > cap: break
            keep.append(l); n += len(l) + 3
    return head + '\n  | ' + '\n  | '.join(keep)

allkeys = set(pick) | {k for v in calib.values() for k in v}
bykey = {s['key']: s for s in S}
items = [bykey[k] for k in sorted(allkeys)]
json.dump([dict(random=x['key'] in pick, key=x['key'], doc=x['doc'], title=x['title'], pages=x['pages'], type=x['type'], f=x['f'],
                calib=[c for c, v in calib.items() if x['key'] in v]) for x in items],
          open(f'{OUT}/S_eng_sample.json', 'w'), ensure_ascii=False, indent=0)
os.makedirs(f'{OUT}/digests', exist_ok=True)
B = 25
for i in range(0, len(items), B):
    with open(f'{OUT}/digests/batch_{i // B:02d}.txt', 'w') as fh:
        for j, x in enumerate(items[i:i + B]):
            f = x['f']
            fh.write(f"\n##### [{i + j}] {x['key']} | {x['title']} | {x['pages']} pp | auto={x['type']} | eql/p={f['eqld']} thm={f['thm']} dfn={f['dfn']} ex={f['ex']}\n")
            fh.write(digest(x) + '\n')
print(len(pick), 'random +', len(allkeys) - len(pick), 'calibration-only =', len(items))
print(collections.Counter(x['type'] for x in pick.values()))
print({k: len(v) for k, v in calib.items()})
