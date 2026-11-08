#!/usr/bin/env python3
"""R10: classify the 119 items of R10_items.py into tiers K / S / C with two raters, measure agreement,
and compute the objective keystone signals:
  F1 textual fan-out : number of OTHER modules (both apps, core + adv) whose assigned source text
                       (main / supp / article roles) mentions the item's signature phrase >= 3 times;
  F2 project use     : the item is part of an A6 project model or validation table;
  prereq fan-out     : number of modules downstream of the item's home module in its app's prereq graph;
  cross-app          : the item's phrase is used (>= 3 hits) in modules of BOTH apps.
Output: printed tables + cache/R10_classify.json (consumed by R10_model.py).
Run: python3 -I R10_classify.py   (about 20-40 s; reads the library text once)
"""
import json, os, re, sys, collections, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import R10_items as I

R = '/home/user/repo-exercise'
CACHE = os.path.join(HERE, 'cache')
MIL_TEXT = json.load(open(os.path.join(CACHE, 'mil_text.json')))
ENG_DIR = R + '/eng/app/artifact/lib/text/'
_eng = {}
def page_text(app, doc, p):
    if app == 'C':
        d = MIL_TEXT.get(doc, {})
        t = d.get(str(p), '')
        return t if isinstance(t, str) else t.get('t', '')
    if doc not in _eng:
        f = ENG_DIR + doc + '.json'
        _eng[doc] = json.load(open(f)) if os.path.exists(f) else {}
    v = _eng[doc].get(str(p), {})
    return v.get('t', '') if isinstance(v, dict) else str(v)

SYL = {'E': json.load(open(R + '/library/engineering/syllabus/syllabus.json')),
       'C': json.load(open(R + '/library/military/syllabus/syllabus.json'))}
ARTICLE_CAP = 80   # pages read from a whole-document source (long reports would dominate otherwise)

def module_texts():
    out = {}
    for app, d in SYL.items():
        for m in d['modules']:
            if m['tier'] not in ('core', 'adv'):
                continue
            chunks = []
            for s in m.get('sources', []):
                if s.get('role') not in ('main', 'supp', 'article'):
                    continue
                pg = s.get('pages')
                if not pg:
                    n = d['docs'].get(s['doc'], {}).get('pages', 0) or 0
                    rngs = [(1, min(n, ARTICLE_CAP))]
                elif isinstance(pg[0], list):
                    rngs = [tuple(x) for x in pg]
                else:
                    rngs = [tuple(pg)]
                for a, b in rngs:
                    for p in range(a, b + 1):
                        chunks.append(page_text(app, s['doc'], p))
            out[f'{app}:{m["id"]}'] = ' '.join(chunks)
    return out

def descendants():
    out = {}
    for app, d in SYL.items():
        kids = collections.defaultdict(set)
        for m in d['modules']:
            for p in m.get('prereq', []) or []:
                kids[p].add(m['id'])
        for m in d['modules']:
            seen, st = set(), [m['id']]
            while st:
                x = st.pop()
                for k in kids[x]:
                    if k not in seen:
                        seen.add(k); st.append(k)
            out[f'{app}:{m["id"]}'] = len(seen)
    return out

F1_THRESHOLD = 8      # other modules; fixed before computing agreement: ~ the number of modules in one
                      # mid-size part, i.e. "used beyond its own part". Sensitivity at 4/12/20 printed below.

def rule_B(f1, f2, f3, f4, f6):
    obj = f1 or f2
    if obj and (f3 or f4) and (not f6 or f4):
        return 'K'
    return 'C' if f6 else 'S'

def kappa(a, b, cats=('K', 'S', 'C')):
    n = len(a); po = sum(x == y for x, y in zip(a, b)) / n
    pa = collections.Counter(a); pb = collections.Counter(b)
    pe = sum(pa[c] * pb[c] for c in cats) / n / n
    return po, (po - pe) / (1 - pe)

def weighted_kappa(a, b, cats=('K', 'S', 'C')):
    idx = {c: i for i, c in enumerate(cats)}; k = len(cats); n = len(a)
    w = lambda i, j: 1 - abs(i - j) / (k - 1)
    po = sum(w(idx[x], idx[y]) for x, y in zip(a, b)) / n
    pa = collections.Counter(a); pb = collections.Counter(b)
    pe = sum(pa[x] * pb[y] * w(idx[x], idx[y]) for x in cats for y in cats) / n / n
    return (po - pe) / (1 - pe)

def main():
    fan_cache = os.path.join(CACHE, 'R10_fanout.json')
    FC = json.load(open(fan_cache)) if os.path.exists(fan_cache) else {}
    need = [it for it in I.ITEMS if FC.get(it[0], {}).get('rx') != it[4]]
    if need:
        print('reading module texts ...', file=sys.stderr)
        MT = module_texts()
        for it in need:
            r = re.compile(it[4], re.I); home = I.HOME[it[1]]
            FC[it[0]] = dict(rx=it[4], mods=sorted(m for m, t in MT.items() if m != home and len(r.findall(t)) >= 3))
        json.dump(FC, open(fan_cache, 'w'), indent=0)
    DESC = descendants()
    rows = []
    for (iid, smp, kind, name, rx, proj, A, f3, f4, f5, f6) in I.ITEMS:
        home = I.HOME[smp]
        mods = set(FC[iid]['mods'])
        apps = {m[0] for m in mods}
        rows.append(dict(id=iid, sample=smp, cls=I.SAMPLE_CLASS[smp], kind=kind, name=name, home=home,
                         fan=len(mods), fanE=sum(m[0] == 'E' for m in mods), fanC=sum(m[0] == 'C' for m in mods),
                         both=int(len(apps) == 2), proj=proj, desc=DESC.get(home, 0), A=A,
                         F3=f3, F4=f4, F5=f5, F6=f6, strict=int(iid in I.R8_STRICT)))
    for x in rows:
        x['F1'] = int(x['fan'] >= F1_THRESHOLD); x['F2'] = int(bool(x['proj']))
        x['B'] = rule_B(x['F1'], x['F2'], x['F3'], x['F4'], x['F6'])
        order = {'K': 0, 'S': 1, 'C': 2}
        x['maxrule'] = min(x['A'], x['B'], key=lambda t: order[t])    # disagreement -> the higher tier
        x['final'] = x['A'] if x['A'] == x['B'] else I.ADJ[x['id']][0]  # disagreement -> adjudicated
        x['adj_note'] = '' if x['A'] == x['B'] else I.ADJ[x['id']][1]

    A = [x['A'] for x in rows]; B = [x['B'] for x in rows]
    po, k = kappa(A, B); wk = weighted_kappa(A, B)
    pa=[x['A'] for x in rows]; pf=[x['final'] for x in rows]; pb=[x['B'] for x in rows]
    print(f'adjudicated vs A: kappa {kappa(pa,pf)[1]:.2f}; adjudicated vs B: kappa {kappa(pb,pf)[1]:.2f}')
    print(f'== {len(rows)} items over {sum(I.SAMPLE_PAGES.values())} pages ==')
    print(f'agreement A vs B: raw {po:.2f}, Cohen kappa {k:.2f}, linear-weighted kappa {wk:.2f}')
    ct = collections.Counter((a, b) for a, b in zip(A, B))
    print('confusion (rows A, cols B):      K    S    C')
    for a in 'KSC':
        print(f'                         {a}   ' + ''.join(f'{ct[(a, b)]:5d}' for b in 'KSC'))
    print('disagreements:')
    for x in rows:
        if x['A'] != x['B']:
            print(f"   {x['id']:6s} A={x['A']} B={x['B']} fan={x['fan']:3d} proj={','.join(x['proj']) or '-':12s} F3..F6={x['F3']}{x['F4']}{x['F5']}{x['F6']}  {x['name'][:70]}")
    for th in (4, 12, 20):
        Bt = [rule_B(int(x['fan'] >= th), x['F2'], x['F3'], x['F4'], x['F6']) for x in rows]
        p2, k2 = kappa(A, Bt)
        print(f'   F1 threshold {th:2d}: kappa {k2:.2f}; B distribution {dict(collections.Counter(Bt))}')

    # objective signals by final tier
    print('\n== objective keystone signals by FINAL tier (median / mean) ==')
    for t in 'KSC':
        xs = [x for x in rows if x['final'] == t]
        fan = sorted(x['fan'] for x in xs)
        print(f"  {t}: n={len(xs):3d}  fan-out median {fan[len(fan)//2]:3d} mean {sum(fan)/len(fan):5.1f};"
              f"  in both apps {sum(x['both'] for x in xs)/len(xs):.0%};  used by a project {sum(x['F2'] for x in xs)/len(xs):.0%};"
              f"  home-module descendants mean {sum(x['desc'] for x in xs)/len(xs):.1f}")
    # does fan-out separate tiers? (rank-biserial-ish: P(fan_K > fan_S))
    def p_greater(t1, t2):
        a = [x['fan'] for x in rows if x['final'] == t1]; b = [x['fan'] for x in rows if x['final'] == t2]
        return sum((u > v) + 0.5 * (u == v) for u in a for v in b) / (len(a) * len(b))
    print(f"  P(fan-out of a K item > that of an S item) = {p_greater('K','S'):.2f};  K > C: {p_greater('K','C'):.2f};  S > C: {p_greater('S','C'):.2f}")

    print('\n== R8 strict CRs vs final tier ==')
    st = collections.Counter(x['final'] for x in rows if x['strict'])
    ns = collections.Counter(x['final'] for x in rows if not x['strict'])
    print(f'  R8 strict ({sum(st.values())}): {dict(st)};   not strict ({sum(ns.values())}): {dict(ns)}')

    print('\n== distribution per sample and per book class (FINAL tier; items per page) ==')
    per = collections.defaultdict(collections.Counter)
    for x in rows:
        per[x['sample']][x['final']] += 1
    for s in sorted(per, key=lambda z: int(z[1:])):
        c = per[s]; pp = I.SAMPLE_PAGES[s]
        print(f"  {s:4s} {I.SAMPLE_CLASS[s]} {pp:3d} pp  K {c['K']:2d}  S {c['S']:2d}  C {c['C']:2d}")
    cls = collections.defaultdict(collections.Counter); cpages = collections.Counter(); cn = collections.Counter()
    for s, c in per.items():
        cl = I.SAMPLE_CLASS[s]; cls[cl].update(c); cpages[cl] += I.SAMPLE_PAGES[s]; cn[cl] += 1
    dens = {}
    names = {'A': 'Kolmogorov survey math', 'B': 'Feynman', 'C': 'theorem-dense text', 'D': 'engineering textbook',
             'E': 'radar/EW/missile technical', 'F': 'applied / systems / descriptive-technical', 'G': 'doctrine / roles'}
    for cl in sorted(cls):
        c = cls[cl]; p = cpages[cl]; tot = sum(c.values())
        dens[cl] = {t: c[t] / p for t in 'KSC'}
        print(f"  class {cl} {names[cl]:42s} n={cn[cl]} {p:3d} pp: K {c['K']/p:.3f}  S {c['S']/p:.3f}  C {c['C']/p:.3f}  per page;"
              f"  shares K {c['K']/tot:.0%} S {c['S']/tot:.0%} C {c['C']/tot:.0%}")
    tot = collections.Counter(x['final'] for x in rows); P = sum(I.SAMPLE_PAGES.values())
    print(f"  pooled: K {tot['K']} ({tot['K']/len(rows):.0%}), S {tot['S']} ({tot['S']/len(rows):.0%}), C {tot['C']} ({tot['C']/len(rows):.0%});"
          f" per page K {tot['K']/P:.3f} S {tot['S']/P:.3f} C {tot['C']/P:.3f}")
    for lab in ('A', 'B', 'maxrule'):
        t = collections.Counter(x[lab] for x in rows)
        print(f"  rater {lab} alone: K {t['K']} S {t['S']} C {t['C']}")
    by_app = collections.defaultdict(collections.Counter)
    for x in rows:
        by_app[x['home'][0]][x['final']] += 1
    for a, c in by_app.items():
        n = sum(c.values())
        print(f"  home app {'Gilua' if a=='E' else 'Lanchester'}: K {c['K']/n:.0%} S {c['S']/n:.0%} C {c['C']/n:.0%} (n={n})")
    by_kind = collections.defaultdict(collections.Counter)
    for x in rows:
        by_kind[x['kind']][x['final']] += 1
    print('  by kind: ' + '; '.join(f"{k}: " + ' '.join(f"{t}{c[t]}" for t in 'KSC') for k, c in sorted(by_kind.items())))

    json.dump(dict(rows=rows, class_density=dens, class_n=dict(cn), class_pages=dict(cpages),
                   rater_density={lab: {cl: {t: sum(1 for x in rows if x['cls'] == cl and x[lab] == t) / cpages[cl]
                                             for t in 'KSC'} for cl in cpages} for lab in ('A', 'B', 'maxrule', 'final')},
                   kappa=k, weighted_kappa=wk, raw=po),
              open(os.path.join(CACHE, 'R10_classify.json'), 'w'), indent=1, ensure_ascii=False)

if __name__ == '__main__':
    main()
