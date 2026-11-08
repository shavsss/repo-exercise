"""Print stratified sample of (subtopic, top section) pairs for hand-checking precision."""
import json, pickle, random, re, sys
D = json.load(open('MG_scores.json')); RR = json.load(open('MG_rr.json'))
bodies = dict(pickle.load(open('MG_bodies.pkl', 'rb'))); title = {d[0]: d[2] for d in D['docs']}
subs = D['subs']; random.seed(int(sys.argv[1]) if len(sys.argv) > 1 else 7)
bins = [tuple(map(float, b.split(":"))) for b in (sys.argv[2] if len(sys.argv) > 2 else "0.20:9,0.13:0.20,0.09:0.13,0:0.09").split(",")]
for lo, hi in bins:
    pool = [s for s in subs if lo <= RR[s['sid']][0][2] < hi]
    print(f'\n######## bin {lo}-{hi}: n={len(pool)}')
    for i, s in enumerate(random.sample(pool, min(16, len(pool)))):
        k, app, f, cov, comb = RR[s['sid']][0]
        b = bodies.get(k, ''); words = [w for w in re.findall(r'[A-Za-z]{5,}', s['name'])]; words = words or [s['name']]
        pos = -1
        for w in sorted(words, key=len, reverse=True):
            pos = b.lower().find(w.lower()[:7])
            if pos >= 0: break
        snip = re.sub(r'\s+', ' ', b[max(0, pos - 80): pos + 170]) if pos >= 0 else ''
        print(f'{lo}#{i} [{s["imp"]}] {s["name"]}  ->  {k} f={f} cov={cov} | {title[k][:70]!r}\n      ~ {snip!r}')
