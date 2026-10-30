#!/usr/bin/env python3
"""R8 arbiter: reconciled time model for Gilua + Lanchester at full level-2.5 depth.

Differences from R6_model.py (whose inventory helpers it reuses):
  * CR density is no longer one triangular guess. It is MEASURED on 14 sampled chapters
    (R8_samples/, counted by hand with the rubric in R8_reconciled.md section 2) and
    weighted by the page share of each book class in each app/tier.
  * Fatigue above 5 h/day is an explicit declining marginal-yield curve (hour k>5 yields
    1 - a*(k-5), a ~ tri(0.07, 0.13, 0.20)), plus an adherence loss per planned hour above 6.
  * An optional mobile hour (R7) that can only absorb the movable share of the work.
  * R7's extra work savings (facet collapse, instance compression, project certification).
  * Post-lesson dialogue re-anchored on the two real logs (36 and 47 min after 2 of 5 lessons).
Run:  python3 -I R8_model.py
"""
import json, math, os, sys, collections
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
LIB = '/home/user/repo-exercise/library/'
N = 20000
RNG = np.random.default_rng(8)

# ---------------------------------------------------------------------------
# 1. Measured central-result counts (hand count; rubric in R8_reconciled.md s2)
#    id: (doc, pages, strict, standard, liberal, class)
# ---------------------------------------------------------------------------
SAMPLES = {
    'S1':  ('K2 calc. of variations',      16, 3, 4, 6,  'A'),
    'S2':  ('F1 resonance + transients',   15, 3, 6, 9,  'B'),
    'S3':  ('E01 CTFT 4.1-4.2',            15, 1, 3, 5,  'D'),
    'S4':  ('E05 expectation ch.3',        12, 3, 7, 13, 'C'),
    'S5':  ('B02 radar range equation',    15, 3, 5, 10, 'E'),
    'S6':  ('B01 jamming J/S, burn-through', 14, 2, 3, 5, 'E'),
    'S7':  ('B06 EOM + pursuit/collision', 15, 2, 4, 7,  'E'),
    'S8':  ('E13 beams 5.2-5.5',           16, 2, 3, 6,  'D'),
    'S9':  ('B07 missile-defense problem + pre-phase A', 15, 1, 2, 5, 'F'),
    'S10': ('B09 UAV performance',         15, 3, 6, 9,  'F'),
    'S11': ('E22 memory hierarchy intro',  12, 1, 2, 3,  'F'),
    'S12': ('E26 NASA SE design process',  10, 0, 1, 2,  'F'),
    'S13': ('D5 Russian IADS / REB',       11, 0, 1, 2,  'G'),
    'S14': ('B08 avionics intro + roles',  11, 0, 0, 1,  'G'),
}
CLASS_DOC = {
    'A': ['K1', 'K2', 'K3'],
    'B': ['F1', 'F2', 'F3'],
    'C': ['E02', 'E04', 'E05', 'E06', 'E07', 'E17', 'E18', 'E20', 'E21', 'E23'],
    'D': ['E01', 'E03', 'E08', 'E09', 'E09a', 'E10', 'E11', 'E12', 'E13', 'E13a', 'E14',
          'E15', 'E16', 'E19', 'E24', 'E25'],
    'E': ['B01', 'B02', 'B02a', 'B02b', 'B03', 'B04', 'B05', 'B06'],
    'F': ['E22', 'E26', 'B07', 'B08', 'B09', 'B10', 'B12'],
    'G': ['B11', 'D5', 'D6', 'D8', 'D9'],
}
CLASS_NAME = {'A': 'Kolmogorov survey math', 'B': 'Feynman', 'C': 'theorem-dense text (prob/opt/LA/ML/CS math)',
              'D': 'engineering textbook with worked examples', 'E': 'radar/EW/EO/GNSS/missile technical',
              'F': 'applied / systems / descriptive-technical', 'G': 'doctrine / history / roles',
              'H': 'articles, theses (not sampled)'}
DOC_CLASS = {d: c for c, ds in CLASS_DOC.items() for d in ds}

def class_density(which=2):
    """Measured CRs/page per class (which: 2 strict, 3 standard, 4 liberal)."""
    num = collections.Counter(); den = collections.Counter(); n = collections.Counter()
    for s in SAMPLES.values():
        num[s[5]] += s[which]; den[s[5]] += s[1]; n[s[5]] += 1
    d = {c: num[c] / den[c] for c in den}
    d['G'] = max(d['G'], 0.02 if which == 2 else d['G'])   # floor: doctrine is not empty
    if which == 2:
        d['H'] = 0.08          # assumption (articles unsampled), like class F
    else:
        d['H'] = d['F']
    return d, n

# ---------------------------------------------------------------------------
# 2. Inventory by (app, tier, class)
# ---------------------------------------------------------------------------
def _pages(src, docs):
    p = src.get('pages')
    if not p:
        return docs.get(src['doc'], {}).get('pages', 0)
    if isinstance(p[0], list):
        return sum(b - a + 1 for a, b in p)
    return p[1] - p[0] + 1

def inventory():
    inv = collections.defaultdict(collections.Counter); mods = collections.Counter()
    for app, path in (('G', 'engineering'), ('L', 'military')):
        d = json.load(open(LIB + path + '/syllabus/syllabus.json'))
        for m in d['modules']:
            if m['tier'] == 'ref':
                continue
            mods[(app, m['tier'])] += 1
            for s in m.get('sources', []):
                role = s.get('role')
                if role not in ('main', 'supp', 'article'):
                    continue
                c = 'H' if role == 'article' else DOC_CLASS.get(s['doc'], 'F')
                inv[(app, m['tier'], c)][role] += _pages(s, d['docs'])
    return inv, mods

INV, MODS = inventory()
DENS, NCLS = class_density(2)
DENS_STD, _ = class_density(3)
DENS_LIB, _ = class_density(4)

# ---------------------------------------------------------------------------
# 3. Reconciled parameters (low, mode, high). Reasons in R8_reconciled.md s3.
# ---------------------------------------------------------------------------
PARAMS = {
    'w_supp':      (0.30, 0.50, 0.70),
    'w_art':       (0.20, 0.35, 0.50),
    'dedup':       (0.06, 0.13, 0.20),
    'delta_cost':  (0.20, 0.30, 0.45),
    'testout_L':   (0.03, 0.10, 0.20),
    'testout_G':   (0.00, 0.02, 0.05),
    'diag_min':    (10, 15, 30),
    'r7_save_h':   (0, 60, 150),        # facet collapse, instance compression, project certification
    'sel_bias':    (0.75, 0.87, 1.00),  # sampled chapters were chosen for having results
    'wpp':         (160, 250, 400),
    'wpm':         (110, 145, 190),
    'act_cr':      (10, 15, 22),        # active minutes per CR at reference density 0.09/page
    'size_exp':    (0.3, 0.5, 0.8),     # finer CR tagging -> smaller CRs
    'act_supp_pp': (0.2, 0.4, 0.7),
    'cr_per_les':  (1.3, 1.6, 2.0),
    'les_ovh':     (2, 4, 7),
    'dialog_cr':   (2, 6, 12),          # logs: 36 + 47 min after 2 of 5 lessons
    'notebook_cr': (0, 1.5, 5),
    'forge_cr':    (0, 4, 10),
    'rev_items':   (1.1, 1.3, 1.5),
    'rev_n':       (4, 5, 6),
    'rev_min':     (0.8, 1.5, 3.0),
    'rev_credit':  (0.20, 0.35, 0.50),
    'modcheck':    (8, 15, 25),
    'exam_month':  (1.5, 2.5, 4.0),
    'projects_h':  (80, 120, 200),
    'articles_h':  (10, 40, 120),
    'build_h':     (15, 40, 90),
    'p_fact_fail': (0.15, 0.30, 0.50),
    'live_share':  (0.03, 0.07, 0.15),
    'live_wait':   (10, 15, 25),
    'pipe_wait':   (3, 8, 15),
    # calendar and fatigue
    'lost':        (0.05, 0.10, 0.18),
    'light':       (0.90, 0.93, 0.96),
    'net_eff':     (0.85, 0.93, 1.00),
    'adh0':        (0.85, 0.92, 1.00),  # share of planned hours delivered at <= 6 h/day
    'adh_slope':   (0.00, 0.025, 0.05), # per planned hour above 6
    'fat_a':       (0.07, 0.13, 0.20),  # marginal yield of hour k>5 = 1 - a(k-5)
    'mob_yield':   (0.70, 0.85, 0.95),
    'mob_days':    (0.60, 0.80, 0.95),
    'movable':     (0.10, 0.15, 0.18),  # share of all hours that can be done away from the desk
}
CORR = {('wpp', 'sel_bias'): 0.4}
DAYS_PER_MONTH = 365.25 / 12 / 7 * 6
PILOT_MONTHS = 0.25
DEDUP_SHAPE = {('G', 'core'): 0.94, ('G', 'adv'): 0.43, ('L', 'core'): 1.6, ('L', 'adv'): 0.94}
CLASS_SD = 0.45            # lognormal sd of a class mean measured on one sample (/sqrt(n))
RUBRIC_SD = 0.15           # judgement spread of the hand count itself

def _tri_ppf(u, a, c, b):
    fc = (c - a) / (b - a) if b > a else 0.5
    return np.where(u < fc, a + np.sqrt(u * (b - a) * (c - a)), b - np.sqrt((1 - u) * (b - a) * (b - c)))

def _phi(z):
    return 0.5 * (1 + np.vectorize(math.erf)(z / math.sqrt(2)))

def sample(n=N, rng=RNG):
    keys = list(PARAMS)
    z = rng.standard_normal((n, len(keys)))
    for (a, b), rho in CORR.items():
        i, j = keys.index(a), keys.index(b)
        z[:, j] = rho * z[:, i] + math.sqrt(1 - rho ** 2) * z[:, j]
    u = _phi(z)
    p = {k: _tri_ppf(u[:, i], *PARAMS[k]) for i, k in enumerate(keys)}
    rub = np.exp(rng.normal(0, RUBRIC_SD, n))
    for c in DENS:
        sd = CLASS_SD / math.sqrt(max(NCLS.get(c, 1), 1))
        p['dens_' + c] = DENS[c] * np.exp(rng.normal(0, sd, n)) * rub
    return p

def modes():
    p = {k: np.array([float(v[1])]) for k, v in PARAMS.items()}
    for c in DENS:
        p['dens_' + c] = np.array([DENS[c]])
    return p

# ---------------------------------------------------------------------------
# 4. Hours
# ---------------------------------------------------------------------------
def hours(p, scope=('core', 'adv')):
    eff = 0.0; crs = 0.0; lanmods = 0; mods = 0
    for (app, tier, c), r in INV.items():
        if tier not in scope:
            continue
        pages = r['main'] + p['w_supp'] * r['supp'] + p['w_art'] * r['article']
        d = np.clip(p['dedup'] * DEDUP_SHAPE[(app, tier)], 0, 0.6)
        pages = pages * (1 - d * (1 - p['delta_cost']))
        pages = pages * (1 - (p['testout_L'] if app == 'L' else p['testout_G']))
        eff = eff + pages
        crs = crs + pages * p['dens_' + c] * p['sel_bias']
    for (app, tier), k in MODS.items():
        if tier in scope:
            mods += k; lanmods += k if app == 'L' else 0
    crpp = crs / eff
    size = (0.09 / crpp) ** p['size_exp']
    lessons = crs / p['cr_per_les']
    h = {}
    h['reading'] = eff * p['wpp'] / p['wpm'] / 60
    h['active_cr'] = crs * p['act_cr'] * size / 60
    h['active_supp'] = eff * p['act_supp_pp'] / 60
    h['review'] = (crs * p['rev_items'] * p['rev_n'] * p['rev_min'] * size * (1 - p['rev_credit'])
                   + mods * p['modcheck']) / 60
    h['dialogue'] = crs * p['dialog_cr'] * size / 60
    h['forge'] = crs * p['forge_cr'] * size / 60
    h['notebook'] = crs * p['notebook_cr'] * size / 60
    h['lesson_ovh'] = lessons * p['les_ovh'] / 60
    h['gen_wait'] = lessons * ((1 - p['p_fact_fail']) * p['live_share'] * p['live_wait']
                               + p['p_fact_fail'] * p['pipe_wait']) / 60
    h['testout_diag'] = lanmods * p['diag_min'] / 60 + 0 * eff
    h['projects'] = p['projects_h'] + 0 * eff
    h['articles'] = p['articles_h'] + 0 * eff
    h['build_pilot'] = p['build_h'] + 0 * eff
    share = eff / sum((r['main'] + r['supp'] + r['article']) for r in INV.values()) if False else 1
    h['r7_savings'] = -p['r7_save_h'] * (1.0 if 'adv' in scope else 0.75) + 0 * eff
    h['_crs'] = crs; h['_eff'] = eff; h['_lessons'] = lessons; h['_crpp'] = crpp
    return h

def total(h):
    return sum(v for k, v in h.items() if not k.startswith('_'))

# ---------------------------------------------------------------------------
# 5. Calendar with explicit fatigue curve and an optional mobile hour
# ---------------------------------------------------------------------------
def eff_desk_hours(H, a):
    """Effective hours of an H-hour desk day: hours 1-5 at full yield, hour k>5 at 1-a(k-5)."""
    e = np.minimum(H, 5) + 0 * a
    for k in range(6, int(H) + 1):
        e = e + np.maximum(0, 1 - a * (k - 5))
    return e

def desk_cap(p, H, ideal=False):
    if ideal:   # V3/A1 calendar: every planned hour, full yield, 6.5% lost, no light weeks
        return H * DAYS_PER_MONTH * (1 - 0.065) + 0 * p['lost']
    adh = np.clip(p['adh0'] - p['adh_slope'] * max(0, H - 6), 0.5, 1)
    return (eff_desk_hours(H, p['fat_a']) * p['net_eff'] * adh * DAYS_PER_MONTH
            * (1 - p['lost']) * p['light'] - p['exam_month'])

def months(p, H, mob=0, scope=('core', 'adv'), ideal=False, T=None):
    T = total(hours(p, scope)) if T is None else T
    D = desk_cap(p, H, ideal)
    if mob:
        M = mob * p['mob_yield'] * p['mob_days'] * DAYS_PER_MONTH * (1 - p['lost'])
        m = np.maximum(T / (D + M), (1 - p['movable']) * T / D)
    else:
        m = T / D
    return m + PILOT_MONTHS

def pct(x, q):
    return float(np.percentile(x, q))

# ---------------------------------------------------------------------------
# 5b. R9 effective-hours curve (R9_long_days.md s4): EFH per study day by month,
#     already including plan adherence and multi-month sustainment; +-15% (P10-P90).
#     The R9 day already contains its mobile/walk block (D4), so no separate mobile hour.
#     9 h is interpolated between 8 and 10. Dense first-pass (D1) work is capped at
#     4.3-5 h/day before 15:00; later hours absorb only lighter modes.
# ---------------------------------------------------------------------------
R9_EFH = {7: (5.9, 5.8, 5.8, 5.7), 8: (6.3, 6.2, 6.1, 6.0), 10: (6.8, 6.4, 6.0, 5.8)}
R9_EFH[9] = tuple((a + b) / 2 for a, b in zip(R9_EFH[8], R9_EFH[10]))
R9_LIGHT_WEEK = (6 + 0.55) / 7          # one light week in 7 at ~55%
R9_FRIDAY = (5 + 4.3 / 6.0) / 6         # light Friday (4-5 h, ~4.3 EFH) in a 6-day week
D1_KEYS = ('reading', 'active_cr', 'active_supp', 'lesson_ovh', 'gen_wait')   # dense first pass
D1_CAP_EFH = (4.1, 4.4, 4.75)           # EFH of the first 4.3-5 h of the day (R9 marginal yields)

def months_r9(p, H, scope=('core', 'adv'), rng=None, factor=None):
    hh = hours(p, scope); T = total(hh)
    n = T.shape[0]
    if factor is None:
        rng = rng or np.random.default_rng(9)
        factor = np.clip(rng.normal(1, 0.15 / 1.2816, n), 0.6, 1.4)      # +-15% at P10/P90
    days = DAYS_PER_MONTH * (1 - p['lost']) * R9_LIGHT_WEEK * R9_FRIDAY
    d1 = sum(hh[k] for k in D1_KEYS)
    cap = rng.uniform(D1_CAP_EFH[0], D1_CAP_EFH[2], n) if rng is not None else np.full(n, D1_CAP_EFH[1])
    done = np.zeros(n); d1done = np.zeros(n); m = np.zeros(n); finished = np.zeros(n, bool)
    curve = R9_EFH[H]
    for month in range(1, 61):
        efh = curve[min(month, 4) - 1] * factor
        tot_cap = efh * days - p['exam_month']
        d1_cap = np.minimum(cap * factor, efh) * days
        # the month's work: D1 limited by its cap, the rest of the capacity goes to light work
        share_d1 = np.where(T > 0, d1 / T, 0)
        prog = np.minimum(tot_cap, np.where(share_d1 > 0, d1_cap / share_d1, tot_cap))   # balanced progress
        need = T - done
        frac = np.where(~finished, np.minimum(1, need / prog), 0)
        m = m + frac; done = done + prog * frac
        finished = finished | (done >= T - 1e-6)
        if finished.all():
            break
    return m + PILOT_MONTHS, d1 / T

# ---------------------------------------------------------------------------
def main():
    print('== Measured CR density (CRs per page) by class: strict / standard / liberal; n samples ==')
    for c in sorted(DENS):
        print(f'  {c} {CLASS_NAME[c]:45s} {DENS[c]:.3f} / {DENS_STD[c]:.3f} / {DENS_LIB[c]:.3f}   n={NCLS.get(c, 0)}')
    tp = sum(s[1] for s in SAMPLES.values())
    print(f'  pooled over {len(SAMPLES)} samples, {tp} pages: strict {sum(s[2] for s in SAMPLES.values())/tp:.3f}, '
          f'standard {sum(s[3] for s in SAMPLES.values())/tp:.3f}, liberal {sum(s[4] for s in SAMPLES.values())/tp:.3f}')

    print('\n== Page share by class (main + 0.5 supp + 0.35 article), and weighted strict density ==')
    for app in 'GL':
        for tier in ('core', 'adv'):
            w = {c: r['main'] + 0.5 * r['supp'] + 0.35 * r['article'] for (a, t, c), r in INV.items() if a == app and t == tier}
            W = sum(w.values())
            dens = sum(w[c] * DENS[c] for c in w) / W
            print(f'  {app} {tier:4s} {W:6.0f} pp  ' + ' '.join(f'{c}:{w[c]/W*100:4.1f}%' for c in sorted(w))
                  + f'   strict {dens:.3f}  standard {sum(w[c]*DENS_STD[c] for c in w)/W:.3f}')

    md = modes()
    print('\n== Deterministic mode, hour breakdown ==')
    for scope, name in ((('core', 'adv'), 'BOTH'), (('core',), 'CORE')):
        h = hours(md, scope); T = float(total(h)[0])
        print(f"{name}: eff pages {float(h['_eff'][0]):.0f}, CR/page {float(h['_crpp'][0]):.3f}, CRs {float(h['_crs'][0]):.0f}, "
              f"lessons {float(h['_lessons'][0]):.0f}, total {T:.0f} h, all-in min/CR {T*60/float(h['_crs'][0]):.0f}, "
              f"learner min per effective page {T*60/float(h['_eff'][0]):.1f}")
        for k, v in h.items():
            if not k.startswith('_'):
                print(f'    {k:13s} {float(v[0]):7.0f}')

    print('\n== Fatigue curve (mode a=0.13; low 0.07, high 0.20): effective hours per desk day ==')
    for H in range(4, 11):
        print(f'  {H:2d} h -> {float(eff_desk_hours(H, np.array([0.13]))[0]):.2f}  '
              f'(a=.07: {float(eff_desk_hours(H, np.array([0.07]))[0]):.2f}, a=.20: {float(eff_desk_hours(H, np.array([0.20]))[0]):.2f});'
              f' delivered h/month at mode incl. adherence {float(desk_cap(md, H)[0]):.0f}')

    S = sample()
    res = {}
    print('\n== Monte Carlo N=%d: months P10/P50/P90 and P(<= 6/8/10/12) ==' % N)
    for scope, name in ((('core',), 'CORE of both'), (('core', 'adv'), 'BOTH, everything')):
        hh = hours(S, scope); T = total(hh)
        print(f"{name}: hours P10/P50/P90 {pct(T,10):.0f}/{pct(T,50):.0f}/{pct(T,90):.0f}; CRs {pct(hh['_crs'],10):.0f}/"
              f"{pct(hh['_crs'],50):.0f}/{pct(hh['_crs'],90):.0f}; all-in min/CR P50 {pct(T*60/hh['_crs'],50):.0f}")
        for H in range(5, 11):
            for mob in (0, 1):
                m = months(S, H, mob, scope, T=T)
                res[(name, H, mob)] = m
                print(f'   {H:2d}+{mob}  {pct(m,10):5.1f} / {pct(m,50):5.1f} / {pct(m,90):5.1f}   '
                      + '  '.join(f'<={d}: {np.mean(m <= d):.2f}' for d in (6, 8, 10, 12, 15, 18)))
        print(f'  [ideal V3/A1 calendar, same hours] 7+0: P50 {pct(months(S, 7, 0, scope, ideal=True, T=T),50):.1f}'
              f'   10+0: P50 {pct(months(S, 10, 0, scope, ideal=True, T=T),50):.1f}')

    print('\n== R9 effective-hours curve (EFH/day by month, +-15%), light Friday + light week in 7, D1 cap 4.3-5 h ==')
    rr = np.random.default_rng(91)
    for scope, name in ((('core',), 'CORE of both'), (('core', 'adv'), 'BOTH, everything')):
        for H in (7, 8, 9, 10):
            m, sh = months_r9(S, H, scope, rng=rr)
            res[(name, 'R9', H)] = m
            print(f'   {name:17s} {H:2d} h  {pct(m,10):5.1f} / {pct(m,50):5.1f} / {pct(m,90):5.1f}   '
                  + '  '.join(f'<={d}: {np.mean(m <= d):.2f}' for d in (6, 8, 10, 12, 15, 18))
                  + f'   D1 share of work P50 {pct(sh,50):.2f}')
    md_h = hours(md, ('core', 'adv')); Tm = float(total(md_h)[0])
    d1m = sum(float(md_h[k][0]) for k in D1_KEYS)
    print(f'  mode split: D1 (dense first pass) {d1m:.0f} h = {d1m/Tm:.0%}; lighter modes {Tm-d1m:.0f} h = {1-d1m/Tm:.0%}')
    for H in (7, 8, 10):
        e = R9_EFH[H][3]
        print(f'   {H} h steady: EFH {e:.1f}/day; D1 needs {d1m/Tm*e:.2f} EFH/day (cap 4.1-4.75) -> '
              f'{"total EFH binds" if d1m/Tm*e <= 4.4 else "D1 cap binds"}; light work absorbs {(1-d1m/Tm)*e:.2f} EFH/day')
    print(f'  D1 cap binds only if D1 share > 4.4/EFH = {4.4/6.0:.0%} (8 h) / {4.4/5.8:.0%} (10 h).'
          f' With D1 at 61%, extra late hours can only be used for the {Tm-d1m:.0f} h of light work.')

    print('\n== Share done at full depth by month 6 and 8 (P50; core first, then adv; both apps interleaved) ==')
    Tc = total(hours(S, ('core',))); Tb = total(hours(S, ('core', 'adv')))
    for H in (6, 7, 8, 9, 10):
        for mob in (0, 1):
            row = []
            for d in (6, 8):
                done = d / (months(S, H, mob, ('core', 'adv'), T=Tb) - PILOT_MONTHS) * Tb   # hours done by d (pilot ignored)
                core_frac = np.minimum(done / Tc, 1)
                adv_frac = np.clip((done - Tc) / (Tb - Tc), 0, 1)
                row.append(f'{d} mo: core {pct(core_frac,50)*100:3.0f}% (P10 {pct(core_frac,10)*100:3.0f}, P90 {pct(core_frac,90)*100:3.0f})'
                           f', adv {pct(adv_frac,50)*100:3.0f}%, all {pct(np.minimum(done/Tb,1),50)*100:3.0f}%')
            print(f'  {H}+{mob}:  ' + ' | '.join(row))

    print('\n== h/day needed (desk, +1 mobile) to finish everything by deadline, P50 / P80 ==')
    for d in (8, 10, 12, 15, 18):
        out = []
        for q in (50, 80):
            hit = '>10'
            for H in range(5, 11):
                if pct(res[('BOTH, everything', H, 1)], q) <= d:
                    hit = str(H); break
            out.append(hit)
        print(f'  {d:2d} months: {out[0]} / {out[1]}')

    print('\n== Tornado: BOTH, 8+1 h, others at mode ==')
    base = float(months(md, 8, 1)[0]); print(f'  base {base:.1f}')
    rows = []
    keys = list(PARAMS) + ['dens_all']
    for k in keys:
        a = dict(md); b = dict(md)
        if k == 'dens_all':
            for c in DENS:
                a['dens_' + c] = md['dens_' + c] * math.exp(-0.35); b['dens_' + c] = md['dens_' + c] * math.exp(0.35)
            lo, hi = 'x0.70', 'x1.42'
        else:
            lo, _, hi = PARAMS[k]; a[k] = np.array([float(lo)]); b[k] = np.array([float(hi)])
        ml, mh = float(months(a, 8, 1)[0]), float(months(b, 8, 1)[0])
        rows.append((abs(mh - ml), k, lo, hi, ml, mh))
    for sw, k, lo, hi, ml, mh in sorted(rows, reverse=True)[:14]:
        print(f'  {k:12s} [{lo} .. {hi}]  {ml:5.1f} -> {mh:5.1f}  swing {sw:.1f}')

    print('\n== Scenario: pilot finds the optimistic corner on the 3 measurable unknowns ==')
    for label, upd in (('wpm 190, act_cr 10, dialog 2', dict(wpm=190, act_cr=10, dialog_cr=2)),
                       ('+ density x0.7, wpp 180', dict(wpm=190, act_cr=10, dialog_cr=2, wpp=180, sel_bias=0.75)),
                       ('+ fatigue a=0.07, adherence 1.0, lost 5%', dict(wpm=190, act_cr=10, dialog_cr=2, wpp=180, sel_bias=0.75,
                                                                        fat_a=0.07, adh0=1.0, adh_slope=0, lost=0.05))):
        p = dict(md); p.update({k: np.array([float(v)]) for k, v in upd.items()})
        print(f'  {label:45s} BOTH ' + ' / '.join(f'{H}+1: {float(months(p, H, 1)[0]):.1f}' for H in (6, 8, 10))
              + '   CORE ' + ' / '.join(f'{H}+1: {float(months(p, H, 1, ("core",))[0]):.1f}' for H in (6, 8, 10)))

if __name__ == '__main__':
    main()
