"""Recall check for 'missing' labels: count raw phrase hits of the head phrase across section bodies."""
import json, pickle, random, re, collections
cw = json.load(open('MG_crosswalk.json')); D = json.load(open('MG_scores.json')); S = {s['sid']: s for s in D['subs']}
bodies = pickle.load(open('MG_bodies.pkl', 'rb'))
random.seed(21)
smp = random.sample([g for g in cw['gaps']], 24)
for g in smp:
    head = S[g['id']]['head'].lower()
    kw = head if len(head) > 3 else g['name'].lower()
    hits = collections.Counter()
    for k, b in bodies:
        n = b.lower().count(kw)
        if n: hits[k] = n
    print(f"[{g['imp']}] {g['app']} {g['name'][:65]!r} head={kw!r}: secs_with_hit={len(hits)} top={hits.most_common(3)}")
