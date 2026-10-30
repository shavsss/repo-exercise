"""Steps 2-5: classifier validation, count model + CV, overlap detection, registry + totals.
Run: python3 -I S_eng_model.py  (needs S_eng_build.py + S_eng_sample.py outputs; ~1 min)
Writes S_eng_registry.json, S_eng_model.out (stdout), S_eng_overlap_pairs.json
"""
import json, os, re, sys, math, random, collections
import numpy as np
D = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, D)
from S_eng_build import section_text, SYL
from S_eng_counts import COUNTS

secs = json.load(open(f'{D}/S_eng_sections.json'))
rows = json.load(open(f'{D}/S_eng_map.json'))
samp = json.load(open(f'{D}/S_eng_sample.json'))
bykey = {s['key']: s for s in secs}
used = [s for s in secs if s['used']]

CLASS = {}
for d in 'K1 K2 K3'.split(): CLASS[d] = 'A_math_survey'
for d in 'F1 F2 F3'.split(): CLASS[d] = 'B_feynman'
for d in 'E02 E04 E05 E06 E07 E20'.split(): CLASS[d] = 'C_theorem_dense'
for d in 'E01 E03 E08 E11 E13 E15 E16 E17 E18 E19 E23 E24'.split(): CLASS[d] = 'D_eng_textbook'
for d in 'E09 E09a E10 E12 E13a E14 E21 E22 E25 E26'.split(): CLASS[d] = 'E_descriptive_practice'
NONTEACH = {'front', 'notes_biblio', 'problems', 'summary', 'appendix_ref'}
def tgroup(t):
    return 'nonteach' if t in NONTEACH else t   # theory / derivation / examples / history / nonteach

# ---------------------------------------------------------------- 2. classifier validation
print('=' * 70, '\n2. CLASSIFIER VALIDATION (125 random sections, hand-labelled true type)')
R = [(i, x) for i, x in enumerate(samp) if x['random']]
TYPES = ['theory', 'derivation', 'examples', 'history', 'summary', 'notes_biblio', 'problems', 'appendix_ref', 'front']
conf = collections.Counter((COUNTS[i][4], x['type']) for i, x in R)
acc = sum(v for (a, b), v in conf.items() if a == b) / len(R)
acc_g = sum(v for (a, b), v in conf.items() if tgroup(a) == tgroup(b)) / len(R)
acc_t = sum(v for (a, b), v in conf.items() if (a in NONTEACH) == (b in NONTEACH)) / len(R)
print(f'exact 9-type accuracy {acc:.2f}; 5-group accuracy {acc_g:.2f}; teach-vs-nonteach accuracy {acc_t:.2f}')
print('rows = true, cols = auto')
print('%-13s' % '' + ''.join('%6s' % t[:5] for t in TYPES))
for a in TYPES:
    print('%-13s' % a + ''.join('%6d' % conf[(a, b)] for b in TYPES))
for t in TYPES:
    tp = conf[(t, t)]; pp = sum(conf[(a, t)] for a in TYPES); ap = sum(conf[(t, b)] for b in TYPES)
    if ap or pp: print(f'  {t:13s} precision {tp / pp if pp else float("nan"):.2f} recall {tp / ap if ap else float("nan"):.2f} (n true {ap})')

# ---------------------------------------------------------------- 3. count model
print('=' * 70, '\n3. COUNT MODEL (Poisson GLM, offset-free, ridge 1.0)')
GROUPS = ['theory', 'derivation', 'examples', 'history', 'nonteach']
CLS = sorted(set(CLASS.values()))
def X_of(s, ttype):
    f = s['f']; g = tgroup(ttype)
    v = [1.0]
    v += [1.0 if g == G else 0.0 for G in GROUPS[1:]]
    v += [1.0 if CLASS[s['doc']] == C else 0.0 for C in CLS[1:]]
    p = max(s['pages'], 0.3)
    v += [math.log(p), math.log1p(f['eqld']), math.log1p(f['thmd'] + f['dfnd']), math.log1p(f['exd'])]
    return v
NAMES = ['const'] + ['type:' + g for g in GROUPS[1:]] + ['class:' + c for c in CLS[1:]] + ['log_pages', 'log1p_eql/p', 'log1p_thm+dfn/p', 'log1p_ex/p']

def fit(X, y, lam=1.0, it=60):
    X = np.asarray(X); y = np.asarray(y, float)
    b = np.zeros(X.shape[1]); b[0] = math.log(max(y.mean(), 0.05))
    P = lam * np.eye(X.shape[1]); P[0, 0] = 0
    for _ in range(it):
        mu = np.exp(np.clip(X @ b, -10, 6))
        g = X.T @ (y - mu) - P @ b
        H = X.T @ (X * mu[:, None]) + P
        step = np.linalg.solve(H, g)
        b += step
        if np.abs(step).max() < 1e-7: break
    return b
def pred(b, X): return np.exp(np.clip(np.asarray(X) @ b, -10, 6))

TARGETS = {'strict': 0, 'K': 1, 'S': 2, 'C': 3}
train_idx = list(range(len(samp)))
Xtr_auto = [X_of(bykey[samp[i]['key']], samp[i]['type']) for i in train_idx]  # predicted type: what is available for all sections
models = {}
for t, j in TARGETS.items():
    y = [COUNTS[i][j] for i in train_idx]
    models[t] = fit(Xtr_auto, y)
print('coefficients (strict CR model):')
for n, c in zip(NAMES, models['strict']): print(f'  {n:24s} {c:+.3f}')

# held-out CV on the random sample only (calibration-only sections always stay in training)
rand = [i for i, x in enumerate(samp) if x['random']]
cal_only = [i for i, x in enumerate(samp) if not x['random']]
R8_RATE = 0.124
def classrate_fit(tr, j):
    num = collections.defaultdict(float); den = collections.defaultdict(float)
    for i in tr:
        s = bykey[samp[i]['key']]; c = CLASS[s['doc']]
        if samp[i]['type'] in NONTEACH: continue
        num[c] += COUNTS[i][j]; den[c] += s['pages']
    allr = sum(num.values()) / sum(den.values())
    return {c: (num[c] + 2 * allr) / (den[c] + 2) for c in CLS}, allr
print('\nheld-out error, 5-fold x 40 repeats on the 125 random sections:')
for t, j in TARGETS.items():
    rng = random.Random(7)
    mae = collections.defaultdict(list); agg = collections.defaultdict(list)
    for rep in range(40):
        r = rand[:]; rng.shuffle(r)
        for k in range(5):
            te = r[k::5]; tr = [i for i in r if i not in te] + cal_only
            b = fit([X_of(bykey[samp[i]['key']], samp[i]['type']) for i in tr], [COUNTS[i][j] for i in tr])
            p = pred(b, [X_of(bykey[samp[i]['key']], samp[i]['type']) for i in te])
            y = np.array([COUNTS[i][j] for i in te], float)
            pages = np.array([bykey[samp[i]['key']]['pages'] for i in te])
            cr, allr = classrate_fit(tr, j)
            pc = np.array([0 if samp[i]['type'] in NONTEACH else cr[CLASS[samp[i]['key'].split(':')[0]]] * bykey[samp[i]['key']]['pages'] for i in te])
            meanrate = sum(COUNTS[i][j] for i in tr) / sum(bykey[samp[i]['key']]['pages'] for i in tr)
            pf = pages * meanrate
            pe = np.array([(p[k] + pc[k]) / 2 if samp[i]['type'] not in NONTEACH else p[k] for k, i in enumerate(te)])
            for nm, pp in [('GLM', p), ('class-rate x pages (teaching types)', pc), ('ENSEMBLE mean(GLM, class-rate)', pe), ('flat rate x pages', pf)]:
                mae[nm].append(np.abs(pp - y).mean())
                agg[nm].append((pp.sum() - y.sum()) / max(y.sum(), 1))
            if t == 'strict':
                pr = pages * R8_RATE
                mae['R8 0.124 x pages'].append(np.abs(pr - y).mean()); agg['R8 0.124 x pages'].append((pr.sum() - y.sum()) / max(y.sum(), 1))
    for nm in mae:
        a = np.array(agg[nm])
        print(f'  {t:6s} {nm:36s} MAE/section {np.mean(mae[nm]):.2f} | fold-total error mean {a.mean():+.0%}, |err| median {np.median(np.abs(a)):.0%}, P90 {np.percentile(np.abs(a), 90):.0%}')

# sample-level summary by true type
print('\nsample (125 random) by TRUE type: n, pages, strict/K/S/C per page')
bt = collections.defaultdict(lambda: np.zeros(6))
for i in rand:
    s = bykey[samp[i]['key']]; c = COUNTS[i]
    bt[c[4]] += np.array([1, s['pages'], c[0], c[1], c[2], c[3]])
for t, v in sorted(bt.items(), key=lambda kv: -kv[1][1]):
    print(f'  {t:13s} n={int(v[0]):3d} pp={v[1]:6.1f}  strict {v[2] / v[1]:.3f}  K {v[3] / v[1]:.3f}  S {v[4] / v[1]:.3f}  C {v[5] / v[1]:.3f}')
tot = sum(bt.values())
print(f'  ALL           n={int(tot[0])} pp={tot[1]:.1f}  strict {tot[2] / tot[1]:.3f}  K {tot[3] / tot[1]:.3f}  S {tot[4] / tot[1]:.3f}  C {tot[5] / tot[1]:.3f}')
bc = collections.defaultdict(lambda: np.zeros(4))
for i in rand:
    s = bykey[samp[i]['key']]; c = COUNTS[i]
    bc[CLASS[s['doc']]] += np.array([1, s['pages'], c[0], c[1]])
print('sample by book class: n, pages, strict/page, K/page')
for c, v in sorted(bc.items()): print(f'  {c:24s} n={int(v[0]):3d} pp={v[1]:6.1f} strict {v[2] / v[1]:.3f} K {v[3] / v[1]:.3f}')

# ---------------------------------------------------------------- predictions for all used sections
hand = {samp[i]['key']: COUNTS[i] for i in range(len(samp))}
CR_FULL = {t: classrate_fit(list(range(len(samp))), j)[0] for t, j in TARGETS.items()}
for s in used:
    x = X_of(s, s['type'])
    g = {t: float(pred(models[t], [x])[0]) for t in TARGETS}
    cr = {t: CR_FULL[t][CLASS[s['doc']]] * s['pages'] for t in TARGETS}
    # per-target choice by held-out error: strict = ensemble, K = class-rate, S and C = GLM; non-teaching sections = GLM
    s['pred'] = g if s['type'] in NONTEACH else dict(strict=(g['strict'] + cr['strict']) / 2, K=cr['K'], S=g['S'], C=g['C'])
    if s['key'] in hand:
        h = hand[s['key']]
        s['hand'] = dict(strict=h[0], K=h[1], S=h[2], C=h[3], true_type=h[4])
        s['est'] = dict(strict=h[0], K=h[1], S=h[2], C=h[3])
    else:
        s['est'] = dict(s['pred'])

# ---------------------------------------------------------------- 4. overlap
print('=' * 70, '\n4. SECTION-LEVEL OVERLAP')
STOP = set('''the and for that with this are from which this these those have has was were will can not but its into than then also such each where when what there their they them more most some only other over under very many much any all may one two three our out use used using given gives let thus hence since same both case form shown figure fig section chapter example equation equations eq value values number numbers result results first second new however way thus show see now just like well must would could should does done make made take called define defined simple problem problems page note notes table above below follow following obtain obtained get write written point points part parts here time''' .split())
GARBLED = {'E07'}   # Trefethen-Bau text layer is unreadable (see digests batch_01 [33]-[35]); excluded from text similarity
content = [s for s in used if s['type'] in ('theory', 'derivation', 'examples', 'history') and s['pages'] >= 0.3
           and s['doc'] not in GARBLED and s['f']['wpp'] >= 80]
GENERIC = re.compile(r'introduction|synopsis|opener|pitfalls|fallacies|overview|definitions?$|summary|concluding|preview|motivation|background|basics|war story|solutions?|software|implementation|training|real stuff|exercises|historical', re.I)
print('content sections compared:', len(content))
def toks(t): return [w for w in re.findall(r'[a-z]{3,}', t.lower()) if w not in STOP]
docs_t = []
for s in content:
    tx = section_text(s)[:20000]
    tt = toks(tx) + toks(s['title']) * 6
    docs_t.append(collections.Counter(tt))
df = collections.Counter()
for c in docs_t: df.update(c.keys())
N = len(content)
vocab = [w for w, n in df.items() if 3 <= n <= N * 0.08]
vocab = sorted(vocab, key=lambda w: -df[w])[:12000]
vi = {w: k for k, w in enumerate(vocab)}
M = np.zeros((N, len(vocab)), np.float32)
for r, c in enumerate(docs_t):
    for w, n in c.items():
        k = vi.get(w)
        if k is not None: M[r, k] = (1 + math.log(n)) * math.log(N / df[w])
M /= (np.linalg.norm(M, axis=1, keepdims=True) + 1e-9)
S = M @ M.T
np.fill_diagonal(S, 0)
def ttoks(t): return set(w for w in re.findall(r'[a-z]{3,}', t.lower()) if w not in STOP)
# module order (syllabus order = teaching order)
morder = {m['id']: k for k, m in enumerate(SYL['modules'])}
first_mod = {}
for r_ in rows:
    k = r_['key']
    if k not in first_mod or morder[r_['module']] < morder[first_mod[k]]: first_mod[k] = r_['module']
pairs = []
for a in range(N):
    js = np.where(S[a] > 0.30)[0]
    for b in js:
        if b <= a: continue
        sa, sb = content[a], content[b]
        if sa['doc'] == sb['doc'] and sa['ch'] == sb['ch']: continue  # neighbours in one chapter share vocabulary
        ta, tb = ttoks(sa['title']), ttoks(sb['title'])
        jac = 0.0 if (GENERIC.search(sa['title']) or GENERIC.search(sb['title'])) else len(ta & tb) / max(len(ta | tb), 1)
        if (GENERIC.search(sa['title']) and GENERIC.search(sb['title'])): continue  # two generic intros: vocabulary overlap, not a shared result
        score = 0.7 * float(S[a, b]) + 0.3 * jac
        ma, mb = first_mod[sa['key']], first_mod[sb['key']]
        if ma == mb: continue
        early, late = (sa, sb) if morder[ma] <= morder[mb] else (sb, sa)
        pairs.append(dict(score=round(score, 3), cos=round(float(S[a, b]), 3), jac=round(jac, 2), early=early['key'], early_title=early['title'],
                          early_mod=first_mod[early['key']], late=late['key'], late_title=late['title'], late_mod=first_mod[late['key']],
                          cross_book=sa['doc'] != sb['doc']))
pairs.sort(key=lambda p: -p['score'])
json.dump(pairs[:3000], open(f'{D}/S_eng_overlap_pairs.json', 'w'), ensure_ascii=False, indent=0)
print('pairs with score >= 0.30:', len(pairs))
for lo, hi in [(0.55, 9), (0.45, 0.55), (0.38, 0.45), (0.30, 0.38)]:
    P = [p for p in pairs if lo <= p['score'] < hi]
    print(f'  score [{lo},{hi}): {len(P)} pairs, cross-book {sum(p["cross_book"] for p in P)}')
# thresholds set after reading the pairs (see S_eng.md §4): strong >= 0.45 -> delta keeps 50% of its CR/K/S/C;
# moderate 0.38-0.45 -> keeps 80%. A section takes the max overlap over its earlier partners.
T_HI, T_MID, T_LO, KEEP_HI, KEEP_MID, KEEP_LO = 0.45, 0.38, 0.33, 0.50, 0.75, 0.90
delta = {}
for p in pairs:
    if p['score'] < T_LO: break
    k = p['late']
    keep = KEEP_HI if p['score'] >= T_HI else KEEP_MID if p['score'] >= T_MID else KEEP_LO
    if k not in delta or keep < delta[k][0]: delta[k] = (keep, p['early'], p['score'])
print(f'sections marked as deltas: strong {sum(1 for v in delta.values() if v[0] == KEEP_HI)}, moderate {sum(1 for v in delta.values() if v[0] == KEEP_MID)}, weak {sum(1 for v in delta.values() if v[0] == KEEP_LO)}')
cb = [p for p in pairs if p['score'] >= T_LO and p['cross_book']]
print(f'cross-book delta pairs (score >= {T_LO}): {len(cb)}; examples:')
for p in cb[:12]: print(f"   {p['score']:.2f} {p['early_mod']} {p['early']} {p['early_title'][:40]} => {p['late_mod']} {p['late']} {p['late_title'][:40]}")

# ---------------------------------------------------------------- 5. registry + totals
print('=' * 70, '\n5. TOTALS')
mods = collections.defaultdict(list)
for r_ in rows: mods[r_['key']].append(r_)
registry = []
for s in used:
    rr = sorted(mods[s['key']], key=lambda r_: morder[r_['module']])
    d = delta.get(s['key'])
    registry.append(dict(key=s['key'], doc=s['doc'], book_class=CLASS[s['doc']], chapter=s['ch'], section=s['sid'].split('/', 1)[-1],
                         title=s['title'], chapter_title=s['chtitle'], pdf_pages=[s['s'], s['e']], pages=s['pages'], type=s['type'],
                         features=s['f'], est={k: round(v, 3) for k, v in s['est'].items()}, hand=s.get('hand'),
                         modules=[dict(module=r_['module'], tier=r_['tier'], role=r_['role'], pages=r_['pages'], frac=r_['frac']) for r_ in rr],
                         delta_of=(dict(key=d[1], keep=d[0], score=d[2]) if d else None)))
json.dump(dict(meta=dict(desc='Gilua section-level registry: every TOC leaf section touched by a main/supp source of a module',
                         rubric='strict CR = R8 §2.1; K/S/C = R10 §1.3', est='hand counts where sampled, else Poisson GLM prediction',
                         n_sections=len(registry)), sections=registry), open(f'{D}/S_eng_registry.json', 'w'), ensure_ascii=False)

# allocation: each (module,row) gets est * frac; repeats of the same section (second module covering it) = exact reuse
def totals(role_set, tiers, dedup):
    T = collections.Counter(); seen = collections.defaultdict(float)
    for r_ in sorted(rows, key=lambda r_: morder[r_['module']]):
        if r_['role'] not in role_set or r_['tier'] not in tiers: continue
        s = bykey[r_['key']]
        frac = r_['frac']
        if dedup:
            new = max(0.0, min(1.0, frac) - seen[r_['key']])
            seen[r_['key']] += new
            frac = new
            d = delta.get(r_['key'])
            if d: frac *= d[0]
        for t in TARGETS: T[t] += s['est'][t] * frac
        T['pages'] += r_['pages']
    return T
for label, roles in [('main', {'main'}), ('supp', {'supp'})]:
    for tiers in [('core',), ('adv',), ('ref',), ('core', 'adv', 'ref')]:
        raw = totals(roles, tiers, False); dd = totals(roles, tiers, True)
        print(f'{label:5s} {"+".join(tiers):13s} pages {raw["pages"]:7.0f} | strict {raw["strict"]:6.0f} -> dedup {dd["strict"]:6.0f} | '
              f'K {raw["K"]:6.0f}->{dd["K"]:6.0f}  S {raw["S"]:6.0f}->{dd["S"]:6.0f}  C {raw["C"]:6.0f}->{dd["C"]:6.0f} | '
              f'strict/page {raw["strict"] / raw["pages"]:.3f}; R8 0.124 x pages = {0.124 * raw["pages"]:6.0f}')

print('\nsections by type (used sections; pages = unique section pages):')
tc = collections.defaultdict(lambda: np.zeros(6))
for s in used:
    tc[s['type']] += np.array([1, s['pages'], s['est']['strict'], s['est']['K'], s['est']['S'], s['est']['C']])
for t, v in sorted(tc.items(), key=lambda kv: -kv[1][1]):
    print(f'  {t:13s} n={int(v[0]):5d} pages={v[1]:7.0f} strict={v[2]:6.0f} K={v[3]:6.0f} S={v[4]:6.0f} C={v[5]:6.0f}')
v = sum(tc.values())
print(f'  ALL           n={int(v[0]):5d} pages={v[1]:7.0f} strict={v[2]:6.0f} K={v[3]:6.0f} S={v[4]:6.0f} C={v[5]:6.0f}')

print('\nby book (unique used sections): pages, est strict, strict/page, R8-at-0.124, ratio')
bb = collections.defaultdict(lambda: np.zeros(3))
for s in used: bb[s['doc']] += np.array([s['pages'], s['est']['strict'], s['est']['K']])
for d_, v in sorted(bb.items(), key=lambda kv: kv[1][1] / kv[1][0]):
    print(f'  {d_:5s} {CLASS[d_]:24s} pp {v[0]:6.0f} strict {v[1]:6.1f} ({v[1] / v[0]:.3f}/p) K {v[2]:6.1f}  R8 {0.124 * v[0]:6.1f}  ratio {v[1] / (0.124 * v[0]):.2f}')
cls_t = collections.defaultdict(lambda: np.zeros(2))
for s in used: cls_t[CLASS[s['doc']]] += np.array([s['pages'], s['est']['strict']])
print('by class:', {c: f'{v[1] / v[0]:.3f}/p over {v[0]:.0f} pp' for c, v in sorted(cls_t.items())})
nt_pages = sum(s['pages'] for s in used if s['type'] in NONTEACH)
print(f'non-teaching section pages (summary/notes/problems/appendix/front) inside module ranges: {nt_pages:.0f} of {sum(s["pages"] for s in used):.0f}')
