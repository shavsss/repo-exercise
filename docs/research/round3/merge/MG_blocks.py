"""Biggest confidently-not-needed blocks (N-only + unmapped non-teaching), and N-only section list."""
import json, collections
cw = json.load(open('MG_crosswalk.json'))['sections']; D = json.load(open('MG_scores.json')); S = {s['sid']: s for s in D['subs']}
blk = collections.defaultdict(lambda: [0.0, 0, collections.Counter(), []])
for k, s in cw.items():
    if s['cls'] in ('N_only', 'unmapped_nonteaching'):
        key = (s['app'], s['doc'], k.split(':')[1].split('/')[0] if s['app'] == 'eng' else s['modules'][0])
        b = blk[key]; b[0] += s['pages']; b[1] += 1; b[2][s['type']] += s['pages']; b[3].append(s['title'][:40])
out = []
for (a, d, ch), (pg, n, ty, tt) in sorted(blk.items(), key=lambda x: -x[1][0])[:25]:
    out.append(f'| {a} | {d} | {ch} | {pg:.0f} | {n} | {", ".join(f"{t} {v:.0f}" for t, v in ty.most_common(3))} | {"; ".join(tt[:3])} |')
print('\n'.join(out))
print('\nN-only sections:')
for k, s in sorted(cw.items(), key=lambda x: -x[1]['pages']):
    if s['cls'] == 'N_only' and s['pages'] >= 4:
        print(f"  {k} {s['pages']}pp {s['title'][:50]!r} -> {[S[x]['name'][:40] for x, _ in s['subtopics'][:2]]}")
