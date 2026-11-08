"""Word counts for A3 v3 vs original (blind X) and v2. Excludes JSON payload blocks (scene3d, chart).
heb = tokens containing a Hebrew letter; all = \\S+ tokens (A2 convention). Also splits out erratum and keep blocks."""
import re, sys
HEB = re.compile(r'[א-ת]')
def blocks(t):
    out, pos = [], 0
    for m in re.finditer(r'^```(\w*)\n(.*?)^```$', t, flags=re.S | re.M):
        out.append(('prose', t[pos:m.start()])); out.append((m.group(1), m.group(2))); pos = m.end()
    out.append(('prose', t[pos:])); return out
def count(path):
    t = open(path, encoding='utf-8').read()
    t = re.sub(r'\s*⟦[^⟧]*⟧', '', t)
    r = dict(all=0, heb=0, err_heb=0, keep_heb=0)
    for k, b in blocks(t):
        if k in ('scene3d', 'chart'): continue
        toks = re.findall(r'\S+', b); h = sum(1 for x in toks if HEB.search(x))
        r['all'] += len(toks); r['heb'] += h
        if k == 'erratum': r['err_heb'] += h
        if k == 'keep': r['keep_heb'] += h
    return r
rows = {}
for sec in ('log', 'lagrange'):
    o = count(f'blind/{sec}_X.md'); v2 = count(f'A2_src/{sec}_v2.md'); v3 = count(f'A3v3_{sec}.md')
    for name, r in (('orig', o), ('v2', v2), ('v3', v3)):
        core = r['heb'] - r['err_heb'] - r['keep_heb']
        print(f"{sec:9s} {name:5s} heb={r['heb']:5d} all={r['all']:5d} errata={r['err_heb']:4d} keep={r['keep_heb']:4d} "
              f"core(heb-err-keep)={core:5d}  ratio_heb={r['heb']/o['heb']:.3f}  ratio_core={core/(o['heb']-o['err_heb']-o['keep_heb']):.3f} ratio_all={r['all']/o['all']:.3f}")
