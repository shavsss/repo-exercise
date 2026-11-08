#!/usr/bin/env python3
"""R6 independent recount: months to finish Gilua + Lanchester at full depth.

Built from raw data only (no A1 scripts or caches):
  - page inventory from library/{engineering,military}/syllabus/syllabus.json
  - Gilua section granularity from library/engineering/syllabus/toc/*.md
  - lesson facts from A2_density.md (words/unit, units/page) and from the real
    lessons in scratchpad/review/*.md (own unit count on K1 pp.34-37, CR headings,
    message timestamps for post-lesson dialogue).

Every assumption is a (low, mode, high) triangular range in PARAMS below.
Run:  python3 R6_model.py            (prints all tables used in R6_recount.md)
"""
import json, math, re, collections
import numpy as np

LIB = '/home/user/repo-exercise/library/'
N = 20000
RNG = np.random.default_rng(6)

# ----------------------------------------------------------------------------
# 1. Inventory (raw)
# ----------------------------------------------------------------------------
def _pages(src, docs):
    p = src.get('pages')
    if not p:
        return docs.get(src['doc'], {}).get('pages', 0)
    if isinstance(p[0], list):
        return sum(b - a + 1 for a, b in p)
    return p[1] - p[0] + 1

def inventory():
    inv = {}
    for app, path in (('G', 'engineering'), ('L', 'military')):
        d = json.load(open(LIB + path + '/syllabus/syllabus.json'))
        for m in d['modules']:
            if m['tier'] == 'ref':
                continue
            k = (app, m['tier'])
            row = inv.setdefault(k, collections.Counter())
            row['modules'] += 1
            for s in m.get('sources', []):
                row[s.get('role')] += _pages(s, d['docs'])
    return inv

def gilua_sections():
    """Content sections per main range (granularity check only)."""
    L = LIB + 'engineering/syllabus/'
    d = json.load(open(L + 'syllabus.json'))
    admin = re.compile(r'^(problems?|exercises?|summary|references|bibliography|further|'
                       r'introduction|notes|solutions|appendix|review|key terms|historical)', re.I)
    toc = {}
    for doc in d['docs']:
        try:
            lines = open(L + f'toc/{doc}.md').read().split('\n')
        except OSError:
            continue
        toc[doc] = [(int(m.group(1)), m.group(2).strip()) for l in lines
                    for m in [re.match(r'^\s+S\s+\S+\s+(\d+)\s+(.*)$', l)] if m]
    per = collections.Counter(); pages = collections.Counter()
    for m in d['modules']:
        if m['tier'] == 'ref':
            continue
        for s in m['sources']:
            if s['role'] != 'main':
                continue
            a, b = s['pages']
            per[m['tier']] += sum(1 for p, t in toc.get(s['doc'], []) if a <= p <= b and not admin.match(t))
            pages[m['tier']] += b - a + 1
    return per, pages

# ----------------------------------------------------------------------------
# 2. Parameters: (low, mode, high). Sources in R6_recount.md section 2.
# ----------------------------------------------------------------------------
PARAMS = {
    # scope weights
    'w_supp':      (0.30, 0.50, 0.70),   # share of supp pages actually taught
    'w_art':       (0.20, 0.35, 0.50),   # Lanchester article pages taught (A1 used 0.25)
    # overlap and test-out
    'dedup':       (0.06, 0.13, 0.20),   # share of pages re-teaching a result (overall)
    'delta_cost':  (0.20, 0.30, 0.45),   # delta lesson cost vs full
    'testout_L':   (0.03, 0.10, 0.20),   # Lanchester pages tested out (strong mil background)
    'testout_G':   (0.00, 0.02, 0.05),   # Gilua (K1 to p.240 read before)
    'diag_min':    (10, 15, 30),         # diagnostic minutes per Lanchester module
    # reading
    'wpp':         (150, 240, 400),      # dense Hebrew words per effective source page
    'wpm':         (110, 140, 190),      # reading speed, dense technical Hebrew
    # active work
    'cr_pp':       (0.06, 0.09, 0.16),   # central results per effective page
    'act_cr':      (10, 15, 22),         # in-lesson active minutes per CR (at cr_pp=0.09)
    'act_supp_pp': (0.2, 0.4, 0.7),      # support-section active minutes per page
    'cr_per_les':  (1.3, 1.6, 2.0),
    'les_ovh':     (2, 4, 7),            # open/commit/done/transition per lesson
    'dialog_cr':   (2, 5, 12),           # clarify / Explain / discussion per CR
    'notebook_cr': (0, 1.5, 5),          # his own summaries notebook per CR (beyond A1 'own summary')
    'forge_cr':    (0, 4, 10),           # forge beyond in-lesson active, per CR
    # review
    'rev_items':   (1.1, 1.3, 1.5),
    'rev_n':       (4, 5, 6),
    'rev_min':     (0.8, 1.5, 3.0),
    'rev_credit':  (0.20, 0.35, 0.50),
    'modcheck':    (8, 15, 25),          # module-end check minutes
    'exam_month':  (1.5, 2.5, 4.0),      # monthly held-out exam hours
    # projects and authority work
    'projects_h':  (80, 120, 200),
    'articles_h':  (10, 40, 120),
    'build_h':     (15, 40, 90),         # learner hours driving build + pilot overhead
    # generation
    'p_fact_fail': (0.15, 0.30, 0.50),
    'live_share':  (0.03, 0.07, 0.15),   # lessons needing live generation when factory works
    'live_wait':   (10, 15, 25),
    'pipe_wait':   (3, 8, 15),           # mean wait per lesson if factory fails (pipelined)
    # calendar
    'lost':        (0.05, 0.10, 0.18),   # illness, holidays, life, reserve duty
    'light':       (0.90, 0.93, 0.96),   # light week every ~7th week
    'net_eff':     (0.85, 0.93, 1.00),   # net study share of nominal hours
    'adherence':   (0.82, 0.92, 1.00),   # share of planned hours delivered at 5 h/day
    'adh_slope':   (0.00, 0.03, 0.05),   # adherence lost per planned hour above 5
    'fatigue':     (0.60, 0.80, 0.95),   # yield of hours above 5/day
}
CORR = {('wpp', 'cr_pp'): 0.5}           # denser books carry more CRs
DAYS_PER_MONTH = 365.25 / 12 / 7 * 6     # 6 study days a week
HMAX = 14.0
PILOT_MONTHS = 0.25                      # 2-week pilot at ~50% yield

# relative overlap shape by app/tier (lexical MID shape; Lanchester core highest)
DEDUP_SHAPE = {('G', 'core'): 0.94, ('G', 'adv'): 0.43, ('L', 'core'): 1.6, ('L', 'adv'): 0.94}

# ----------------------------------------------------------------------------
def _tri_ppf(u, a, c, b):
    u = np.asarray(u, float)
    fc = (c - a) / (b - a) if b > a else 0.5
    return np.where(u < fc, a + np.sqrt(u * (b - a) * (c - a)),
                    b - np.sqrt((1 - u) * (b - a) * (b - c)))

def _phi(z):
    return 0.5 * (1 + np.vectorize(math.erf)(z / math.sqrt(2)))

def sample(n=N, rng=RNG):
    z = rng.standard_normal((n, len(PARAMS)))
    keys = list(PARAMS)
    for (a, b), rho in CORR.items():
        i, j = keys.index(a), keys.index(b)
        z[:, j] = rho * z[:, i] + math.sqrt(1 - rho ** 2) * z[:, j]
    u = _phi(z)
    return {k: _tri_ppf(u[:, i], *PARAMS[k]) for i, k in enumerate(keys)}

def modes():
    return {k: np.array([v[1]]) for k, v in PARAMS.items()}

# ----------------------------------------------------------------------------
# 3. Hours
# ----------------------------------------------------------------------------
INV = inventory()

def hours(p, scope=('core', 'adv'), level='full'):
    """Learner hours by component. level='v3' keeps only what V3/A1 count."""
    eff = 0; mods = 0; lan_mods = 0
    for (app, tier), r in INV.items():
        if tier not in scope:
            continue
        pages = r['main'] + p['w_supp'] * r['supp'] + p['w_art'] * r['article']
        d = np.clip(p['dedup'] * DEDUP_SHAPE[(app, tier)], 0, 0.6)
        pages = pages * (1 - d * (1 - p['delta_cost']))
        t = p['testout_L'] if app == 'L' else p['testout_G']
        eff = eff + pages * (1 - t)
        mods += r['modules']
        if app == 'L':
            lan_mods += r['modules']
    crs = eff * p['cr_pp']
    lessons = crs / p['cr_per_les']
    size = (0.09 / p['cr_pp']) ** p.get('size_exp', 0.5)  # finer CR tagging -> smaller CRs
    act_cr = p['act_cr'] * size
    h = {}
    h['reading'] = eff * p['wpp'] / p['wpm'] / 60
    h['active_cr'] = crs * act_cr / 60
    h['active_supp'] = eff * p['act_supp_pp'] / 60
    h['review'] = crs * p['rev_items'] * p['rev_n'] * p['rev_min'] * size * (1 - p['rev_credit']) / 60 \
        + mods * p['modcheck'] / 60
    h['projects'] = p['projects_h'] + 0 * eff
    if level == 'full':
        h['lesson_ovh'] = lessons * p['les_ovh'] / 60
        h['dialogue'] = crs * p['dialog_cr'] * size / 60
        h['notebook'] = crs * p['notebook_cr'] * size / 60
        h['forge'] = crs * p['forge_cr'] * size / 60
        h['articles'] = p['articles_h'] + 0 * eff
        h['build_pilot'] = p['build_h'] + 0 * eff
        h['testout_diag'] = lan_mods * p['diag_min'] / 60 + 0 * eff
        wait_ok = p['live_share'] * p['live_wait']
        h['gen_wait'] = lessons * ((1 - p['p_fact_fail']) * wait_ok
                                   + p['p_fact_fail'] * p['pipe_wait']) / 60
    h['_crs'] = crs; h['_eff_pages'] = eff; h['_lessons'] = lessons
    return h

def total(h):
    return sum(v for k, v in h.items() if not k.startswith('_'))

def capacity(p, H, level='full'):
    """Learner hours delivered per calendar month at nominal H h/day."""
    if level == 'v3':   # A1/T calendar: 6 d/wk, ~6.5% lost, nothing else
        return H * DAYS_PER_MONTH * (1 - 0.065)
    adh = np.clip(p['adherence'] - p['adh_slope'] * max(0, H - 5), 0.5, 1)
    h_eff = min(H, 5) + p['fatigue'] * max(0, H - 5)
    return (h_eff * p['net_eff'] * adh * DAYS_PER_MONTH * (1 - p['lost']) * p['light']
            - p['exam_month'])

def months(p, H, scope=('core', 'adv'), level='full'):
    T = total(hours(p, scope, level))
    m = T / capacity(p, H, level)
    return m + (PILOT_MONTHS if level == 'full' else 0)

def need_H(p, deadline, scope, level='full'):
    """Nominal h/day needed to finish by deadline (vectorised bisection)."""
    T = total(hours(p, scope, level))
    lo = np.full_like(T, 1.0); hi = np.full_like(T, HMAX)
    for _ in range(40):
        mid = (lo + hi) / 2
        cap = np.array([0.0])
        # capacity is piecewise in H, compute elementwise
        adh = np.clip(p['adherence'] - p['adh_slope'] * np.maximum(0, mid - 5), 0.5, 1)
        h_eff = np.minimum(mid, 5) + p['fatigue'] * np.maximum(0, mid - 5)
        cap = h_eff * p['net_eff'] * adh * DAYS_PER_MONTH * (1 - p['lost']) * p['light'] - p['exam_month']
        ok = T / cap + PILOT_MONTHS <= deadline
        hi = np.where(ok, mid, hi); lo = np.where(ok, lo, mid)
    return np.where(hi >= HMAX - 0.01, np.inf, hi)

# ----------------------------------------------------------------------------
# 4. Reports
# ----------------------------------------------------------------------------
def pct(x, q):
    return float(np.percentile(x, q))

def calendar_A1(p):
    """A1/T calendar: 6 d/wk, 6.5% lost, no fatigue, full adherence, no light weeks."""
    q = dict(p)
    one = np.ones_like(p['lost'])
    q.update(lost=0.065 * one, light=one, net_eff=one, adherence=one, fatigue=one, adh_slope=0 * one,
             exam_month=0 * one)
    return q

def v3_inputs():
    v = {k: np.array([float(x[1])]) for k, x in PARAMS.items()}
    v.update(w_supp=np.array([1.0]), w_art=np.array([0.25]), wpp=np.array([225.]), wpm=np.array([185.]),
             cr_pp=np.array([0.074]), act_cr=np.array([17.]), act_supp_pp=np.array([0.35]),
             rev_items=np.array([1.3]), rev_n=np.array([5.]), rev_min=np.array([1.0]),
             rev_credit=np.array([0.35]), modcheck=np.array([0.]), projects_h=np.array([110.]),
             testout_L=np.array([0.15]), testout_G=np.array([0.075]), dedup=np.array([0.138]),
             size_exp=0.0)
    return v

def main():
    print('== Inventory (core+adv, raw syllabus) ==')
    for k, r in sorted(INV.items()):
        print(k, dict(r))
    per, pg = gilua_sections()
    print('Gilua content sections in main ranges:', dict(per), 'pages:', dict(pg))

    md = modes()
    print('\n== Deterministic mode: hour breakdown ==')
    for scope, name in ((('core', 'adv'), 'BOTH core+adv'), (('core',), 'CORE only')):
        h = hours(md, scope)
        print(name, f"eff pages {h['_eff_pages'][0]:.0f}  CRs {h['_crs'][0]:.0f}  lessons {h['_lessons'][0]:.0f}")
        for k, v in h.items():
            if not k.startswith('_'):
                print(f'   {k:13s} {float(v[0]):7.0f}')
        print(f'   TOTAL         {float(total(h)[0]):7.0f}   (v3-scope accounting: {float(total(hours(md, scope, "v3"))[0]):.0f})')
        for H in (5, 6, 7):
            print(f'   months @{H}h: realistic {float(months(md, H, scope)[0]):.1f} (cap {float(capacity(md, H)[0]):.0f} h/mo);'
                  f' A1 calendar {float(months(calendar_A1(md), H, scope)[0]):.1f} (cap {float(capacity(calendar_A1(md), H)[0]):.0f} h/mo)')

    print('\n== Reproduction check: V3/A1 inputs through the R6 model ==')
    v3 = v3_inputs()
    for scope, name in ((('core', 'adv'), 'BOTH'), (('core',), 'CORE')):
        h = hours(v3, scope, 'v3')
        T = float(total(h)[0])
        print(f"{name}: CRs {float(h['_crs'][0]):.0f}, hours {T:.0f}; months @5/6/7 h: " +
              ' / '.join(f'{T / float(capacity(v3, H, "v3")):.1f}' for H in (5, 6, 7)))

    print('\n== Waterfall V3 -> R6 mode (BOTH, months at 7 h/day) ==')
    cur = v3_inputs(); level = 'v3'
    def m7(p, lvl, cal):
        T = float(total(hours(p, ('core', 'adv'), lvl))[0])
        if cal == 'A1':
            return T / float(capacity(p, 7, 'v3')), T
        return T / float(capacity(p, 7)[0]) + PILOT_MONTHS, T
    prev, Tprev = m7(cur, 'v3', 'A1')
    print(f'  start (V3 inputs)                         {prev:5.1f} mo  {Tprev:5.0f} h')
    steps = [
        ('scope: supp 50%, articles 35%, test-out L10% G2%, dedup 13%',
         dict(w_supp=md['w_supp'], w_art=md['w_art'], testout_L=md['testout_L'], testout_G=md['testout_G'], dedup=md['dedup'])),
        ('CR density 0.074 -> 0.09/page (with smaller CRs)', dict(cr_pp=md['cr_pp'], size_exp=0.5, act_cr=md['act_cr'])),
        ('reading: 225 w/p @185 wpm -> 240 @140', dict(wpp=md['wpp'], wpm=md['wpm'])),
        ('review: 1.0 -> 1.5 min/review + module checks', dict(rev_min=md['rev_min'], modcheck=md['modcheck'])),
        ('support active 0.35->0.4 min/p; projects 110->120 h', dict(act_supp_pp=md['act_supp_pp'], projects_h=md['projects_h'])),
    ]
    for name, upd in steps:
        cur.update(upd); m, T = m7(cur, 'v3', 'A1')
        print(f'  + {name:52s} {m:5.1f} mo  {T:5.0f} h  ({m - prev:+.1f})'); prev = m
    m, T = m7(cur, 'full', 'A1')
    print(f'  + {"hidden sinks (forge, dialogue, notebook, overhead, wait, articles, build, diag)":52s} {m:5.1f} mo  {T:5.0f} h  ({m - prev:+.1f})'); prev = m
    m, T = m7(cur, 'full', 'R6')
    print(f'  + {"realistic calendar (lost 10%, light wk, net 93%, adherence, fatigue, pilot)":52s} {m:5.1f} mo  {T:5.0f} h  ({m - prev:+.1f})')

    S = sample()
    SA = calendar_A1(S)
    print('\n== Monte Carlo, N=%d ==' % N)
    for scope, name in ((('core', 'adv'), 'BOTH'), (('core',), 'CORE')):
        hh = hours(S, scope); T = total(hh); Tv = total(hours(S, scope, 'v3'))
        print(f'{name}: hours full P10/P50/P90 = {pct(T,10):.0f}/{pct(T,50):.0f}/{pct(T,90):.0f}; '
              f'v3-scope {pct(Tv,10):.0f}/{pct(Tv,50):.0f}/{pct(Tv,90):.0f}; '
              f'CRs {pct(hh["_crs"],10):.0f}/{pct(hh["_crs"],50):.0f}/{pct(hh["_crs"],90):.0f}')
        for cal, P in (('realistic', S), ('A1-calendar', SA)):
            print(f'  [{cal} calendar]')
            for H in (5, 6, 7):
                m = months(P, H, scope)
                probs = ' '.join(f'P(<={d})={np.mean(m <= d):.2f}' for d in (6, 8, 10, 12, 15, 18))
                print(f'    {H} h/day: months P10/P50/P90 {pct(m,10):5.1f}/{pct(m,50):5.1f}/{pct(m,90):5.1f}   {probs}')
        for d in (4, 6, 8, 10, 12, 18):
            nh = need_H(S, d, scope)
            f = lambda q: (f'{pct(nh, q):.1f}' if np.isfinite(pct(nh, q)) else f'>{HMAX:.0f}')
            print(f'  deadline {d:2d} mo (realistic): h/day needed P50 {f(50)}  P80 {f(80)}')


    print('\n== Bracket: V3-claim checks under four accountings (MC P(months <= deadline)) ==')
    claims = [('BOTH', ('core', 'adv'), 7, 8), ('BOTH', ('core', 'adv'), 5, 12), ('BOTH', ('core', 'adv'), 6, 10),
              ('CORE', ('core',), 6, 7.4), ('CORE', ('core',), 7, 6.3), ('CORE', ('core',), 6, 10), ('CORE', ('core',), 6, 12)]
    print('  claim                         V3scope+A1cal  V3scope+real  full+A1cal  full+real   (P50 months, each)')
    for name, scope, H, d in claims:
        out = []
        for lvl in ('v3', 'full'):
            T = total(hours(S, scope, lvl))
            mA = T / capacity(SA, H, 'v3') + (PILOT_MONTHS if lvl == 'full' else 0)
            mR = T / capacity(S, H) + PILOT_MONTHS
            out.append((mA, mR))
        cells = [out[0][0], out[0][1], out[1][0], out[1][1]]
        print(f'  {name} {H}h <= {d:4} mo           ' + '  '.join(f'{np.mean(c <= d):.2f} ({pct(c,50):4.1f})' for c in cells))
    print('\n  h/day needed for BOTH under V3-scope + A1 calendar (most V3-friendly), P50/P80:')
    for scope, name in ((('core', 'adv'), 'BOTH'), (('core',), 'CORE')):
        T = total(hours(S, scope, 'v3'))
        row = []
        for d in (4, 6, 8, 10, 12):
            nh = T / (d * DAYS_PER_MONTH * (1 - 0.065))
            row.append(f'{d}mo {pct(nh,50):.1f}/{pct(nh,80):.1f}')
        print(f'    {name}: ' + '  '.join(row))

    print('\n== Probability grid: P(finish <= d months) ==')
    for lvl, cal, label in (('v3', 'A1', 'V3-scope hours + A1 calendar (most V3-friendly)'),
                            ('full', 'A1', 'full hours + A1 calendar'),
                            ('full', 'R', 'full hours + realistic calendar (R6 best estimate)')):
        print('  ' + label)
        for scope, name in ((('core', 'adv'), 'BOTH'), (('core',), 'CORE')):
            T = total(hours(S, scope, lvl))
            for H in (5, 6, 7):
                if cal == 'A1':
                    m = T / capacity(SA, H, 'v3') + (PILOT_MONTHS if lvl == 'full' else 0)
                else:
                    m = T / capacity(S, H) + PILOT_MONTHS
                print(f'    {name} {H}h  P50 {pct(m,50):5.1f}  ' + '  '.join(f'<= {d}: {np.mean(m <= d):.2f}' for d in (6, 8, 10, 12, 15, 18, 24)))

    print('\n== Optimistic corner (every parameter at its favourable end) ==')
    good = {}
    for k, (lo, mo, hi) in PARAMS.items():
        a = dict(md); a[k] = np.array([lo]); b = dict(md); b[k] = np.array([hi])
        good[k] = a[k] if float(months(a, 6)[0]) <= float(months(b, 6)[0]) else b[k]
    for scope, name in ((('core', 'adv'), 'BOTH'), (('core',), 'CORE')):
        T = float(total(hours(good, scope))[0])
        print(f'  {name}: {T:.0f} h; months @5/6/7 realistic-cal ' + ' / '.join(f'{float(months(good, H, scope)[0]):.1f}' for H in (5, 6, 7))
              + '; A1-cal ' + ' / '.join(f'{float(months(calendar_A1(good), H, scope)[0]):.1f}' for H in (5, 6, 7)))
    hb = hours(S, ('core', 'adv')); T = total(hb)
    print('\nMean share of hours (BOTH, full):')
    for k, v in hb.items():
        if not k.startswith('_'):
            print(f'   {k:13s} mean {np.mean(v):6.0f} h  ({np.mean(v / T) * 100:4.1f}%)')

    print('\n== Tornado: BOTH, 6 h/day, realistic calendar, others at mode ==')
    base = float(months(md, 6)[0]); print(f'base {base:.2f}')
    rows = []
    for k, (lo, mo, hi) in PARAMS.items():
        a = dict(md); a[k] = np.array([lo]); b = dict(md); b[k] = np.array([hi])
        ml, mh = float(months(a, 6)[0]), float(months(b, 6)[0])
        rows.append((abs(mh - ml), k, lo, hi, ml, mh))
    for sw, k, lo, hi, ml, mh in sorted(rows, reverse=True)[:20]:
        print(f'  {k:12s} [{lo:>5} .. {hi:>5}]  {ml:5.1f} -> {mh:5.1f}   swing {sw:.2f}')

    m6 = months(S, 6)
    rank = lambda x: np.argsort(np.argsort(x))
    print('\n== Spearman rho with months (BOTH, 6 h/day, MC) ==')
    rr = sorted(((float(np.corrcoef(rank(S[k]), rank(m6))[0, 1]), k) for k in PARAMS), key=lambda t: -abs(t[0]))
    for r, k in rr[:12]:
        print(f'  {k:12s} {r:+.2f}')

    print('\n== Scenarios (mode values; months @5/6/7, realistic calendar) ==')
    def show(name, p, scope=('core', 'adv')):
        print(f'  {name:58s} ' + ' / '.join(f'{float(months(p, H, scope)[0]):.1f}' for H in (5, 6, 7)))
    show('R6 mode, BOTH', md); show('R6 mode, CORE', md, ('core',))
    s = dict(md); s['p_fact_fail'] = np.array([0.0]); show('factory surely works', s)
    s = dict(md); s['p_fact_fail'] = np.array([1.0]); show('factory fails (pipelined in page)', s)
    s = dict(md)
    for k in ('dialog_cr', 'notebook_cr', 'forge_cr', 'articles_h', 'build_h'):
        s[k] = np.array([0.])
    show('no dialogue/notebook/forge/articles/build', s)
    s = dict(md); s.update(testout_L=np.array([0.25]), testout_G=np.array([0.05]), dedup=np.array([0.20]))
    show('max savings: test-out L25% G5%, dedup 20%', s)
    s = dict(md); s['lost'] = np.array([0.18]); show('heavy reserve duty / illness (lost 18%)', s)
    s = dict(md); s['cr_pp'] = np.array([0.074]); show('CR density = V3 (0.074/page)', s)
    s = dict(md); s['cr_pp'] = np.array([0.06]); s['wpp'] = np.array([180.]); show('lean content: 0.06 CR/p, 180 w/p', s)
    hc = total(hours(md, ('core',)))
    ha = total(hours(md, ('adv',))) - md['projects_h'] - md['articles_h'] - md['build_h']
    print('  CORE + 25% of adv pulled by projects                        ' + ' / '.join(
        f'{float(((hc + 0.25 * ha) / capacity(md, H))[0] + PILOT_MONTHS):.1f}' for H in (5, 6, 7)))
    print('  adv phase 2 alone (after core)                              ' + ' / '.join(
        f'{float((ha / capacity(md, H))[0]):.1f}' for H in (5, 6, 7)))
    hb = hours(md, ('core', 'adv'))
    print(f"\n  per-CR all-in minutes at mode (BOTH): {float(total(hb)[0]) * 60 / float(hb['_crs'][0]):.0f}"
          f"  (V3: ~1,400 h / ~1,680 CR = 50)")

if __name__ == '__main__':
    main()
