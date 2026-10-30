#!/usr/bin/env python3
"""I. Integrated bottom-up time model for BOTH curricula at full depth, durable recall >= 90%.

Learner minutes per source page are built from the NEW design, not from R8's priced lesson:
 (a)+(b) the active lesson flow measured on the real rules-v2 lesson (round2/ruletest2 + L_flow_example):
         K1:29-44, 15.5 pp, 6,282 words, 89 units, 2 strict CRs; scripted 47 (fast) / 87 (slow) min,
         L's Monte Carlo 62 (55-71) fast / 80 (72-89) slow. Scaled to each book class with R8's
         measured strict-CR density (fixed share phi + variable share ~ density).
 (c) consultation: R8's log-based 2/6/12 min per CR, re-priced for answers at ~18-25% of the old words
     (round3/C_consultation: 1,761 vs 9,528 words on the 7 real turns).
 (d) retention: P's FSRS model (best design vs FSRS-default memory, all tiers r = 0.90), turned into a
     per-item cumulative-cost curve C(age) (I_work/ret_curves.npz, from I_work/ret_curves.py), convolved
     with the actual learning schedule week by week. Hooks partly already inside the measured lesson;
     pocket share of explicit review can go to the phone hour.
 (e) projects/articles/build; from-memory project work credited against explicit review (capped).
 (f) factory (no generation wait except late lessons), dedup + delta lessons, test-out probes.
Calendar: R9 effective full-depth hours (EFH) for an 8-h day by month, person factor +-15%, a cap on
dense (D1) lesson hours before 15:00, 6 study days/week, lost days, light Fridays, light week in 7,
monthly held-out exams, pilot week. Optional +1 phone hour that only absorbs movable (pocket) work.
Run: python3 -I I_model.py > I_model.out
"""
import os
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
RC = np.load(os.path.join(HERE, 'I_work', 'ret_curves.npz'))
N = 6000
WEEKS = 260
DPW = 7.0
M_DAYS = 30.44


def smooth_cum(x, k=21):
    y = np.convolve(np.pad(x, (k // 2, k // 2), mode='edge'), np.ones(k) / k, mode='valid')
    y = np.maximum.accumulate(y)
    y = np.concatenate([[0.0], y])                      # C(0) = 0
    return y


def weekly_delta(name):
    C = smooth_cum(RC[name])
    days = np.arange(0, 7 * (WEEKS + 2), 7)
    Cx = np.interp(days, np.arange(len(C)), C)          # flat beyond 700 d (conservative-low)
    return np.diff(Cx)                                   # cost in week k after learning (k = 0 is own week)


DEX = {v: weekly_delta(v + '_exp') for v in ('best', 'pess', 'flash')}
DIM = {v: weekly_delta(v + '_imp') for v in ('best', 'pess', 'flash')}

# ---------------------------------------------------------------- inventory (R8 weighted pages)
SEG = {  # raw weighted pages (main + 0.5 supp + 0.35 article) and class shares (R8_model.out)
    'Gc': (12380, dict(A=.056, B=.079, C=.251, D=.518, F=.096)),
    'Ga': (3978, dict(A=.095, B=.144, C=.246, D=.442, F=.073)),
    'Lc': (5848, dict(E=.577, F=.224, G=.050, H=.150)),
    'La': (2156, dict(E=.560, F=.186, G=.248, H=.006)),
}
DENS = dict(A=.188, B=.200, C=.250, D=.097, E=.159, F=.096, G=.020, H=.080)   # R8 strict CR/page [M]
NSAMP = dict(A=1, B=1, C=1, D=2, E=3, F=4, G=2, H=1)
MATH = set('ABCD')
ANCHOR_PP, ANCHOR_D = 15.5, 2 / 15.5
ITEMS_PER_RAW = 13600 / 24362                                                # R10 K+S+C, both apps


def tri(rng, lo, mo, hi, n):
    return rng.triangular(lo, mo, hi, n) if n > 1 or rng is not None else np.array([mo])


PARAMS = {  # name: (low, mode, high)  -- triangular unless noted
    'fast_min': (55, 62, 71), 'slow_min': (72, 80, 89),          # L MC, anchor lesson minutes
    'ffast_math': (.15, .35, .60), 'ffast_mil': (.35, .60, .85),  # share of lessons on the fast path
    'wpm': (110, 145, 190),
    'read_share': (.50, .55, .60),
    'repr': (.85, 1.0, 1.30),         # is K1 M0.1 lesson 2 representative of a dense page?
    'topup': (1.0, 1.05, 1.20),       # full R10 keystone count vs the lesson's 2 results
    'phi': (.30, .40, .50),           # density-independent share of lesson time
    'bias': (.75, .87, 1.0),          # R8 selection bias on measured densities
    'cons_old': (2, 6, 12),           # old consult min per CR (logs)
    'cons_read': (.45, .55, .65), 'cons_words': (.18, .25, .40), 'cons_q': (.60, .85, 1.20),
    'forge': (0, 2.5, 6), 'notebook': (.5, 2, 5),                # min per CR beyond the lesson
    'late': (0, .04, .12),            # factory: share of lessons not on the shelf (20-min wait)
    'dedup': (.06, .13, .20), 'to_L': (.03, .10, .20), 'to_G': (0, .02, .05),
    'delta': (.15, .25, .40), 'probe': (.05, .10, .20),
    'diag_h': (20, 35, 60), 'proj_h': (80, 120, 200), 'art_h': (10, 40, 120), 'build_h': (10, 25, 60),
    'proj_credit': (.2, .4, .7),
    'mem': (0, .4, 1.0),              # 0 = P best (schema memory), 1 = FSRS default memory
    'items': (.80, 1.0, 1.15),
    'hook_in': (.3, .5, .7),          # share of hook minutes already inside the measured lesson
    'pocket': (.40, .55, .70),        # share of explicit review that works on the phone
    'preq': (1, 1.5, 2.5),            # min per lesson of pre-questions movable to the phone
    'lost': (.05, .10, .18),
    'd1cap': (4.1, 4.4, 4.75),        # EFH of dense lesson work possible before 15:00
    'ph_done': (.6, .8, .95), 'ph_yield': (.70, .85, .95),
}
KNOB = {'k_lesson': 1.0, 'k_light': 1.0, 'k_ret': 1.0, 'no_d1cap': False}
LOGN = {'pf': .117, 'rubric': .15}   # person factor (+-15% P10/P90), CR rubric judgement
EFH8 = [6.3, 6.2, 6.1, 6.0]          # R9 EFH per study day at 8 h, months 1..4+


def sample(n, rng):
    s = {k: rng.triangular(*v, n) for k, v in PARAMS.items()}
    s['pf'] = np.exp(rng.normal(0, LOGN['pf'], n))
    s['rubric'] = np.exp(rng.normal(0, LOGN['rubric'], n))
    for c in DENS:
        s['cls_' + c] = np.exp(rng.normal(0, .45 / np.sqrt(NSAMP[c]), n))
    return s


def modes(over=None):
    s = {k: np.array([v[1]], float) for k, v in PARAMS.items()}
    s['pf'] = np.array([1.0]); s['rubric'] = np.array([1.0])
    for c in DENS:
        s['cls_' + c] = np.array([1.0])
    for k, v in (over or {}).items():
        s[k] = np.array([v], float)
    return s


def seg_costs(s, seg):
    """Per raw page: D1 minutes, light minutes (excl. projects), CRs, new-item count."""
    pages, mix = SEG[seg]
    mil = seg.startswith('L')
    ff = s['ffast_mil'] if mil else s['ffast_math']
    anchor = (ff * s['fast_min'] + (1 - ff) * s['slow_min']) / ANCHOR_PP
    speed = (1 - s['read_share']) + s['read_share'] * 145 / s['wpm']
    m1 = 0; cr = 0
    for c, w in mix.items():
        d = DENS[c] * s['bias'] * s['rubric'] * s['cls_' + c]
        r = d / ANCHOR_D
        m1 = m1 + w * anchor * s['repr'] * s['topup'] * speed * (s['phi'] + (1 - s['phi']) * r)
        cr = cr + w * d
    cons = s['cons_old'] * (s['cons_read'] * s['cons_words'] + (1 - s['cons_read']) * s['cons_q'])
    m2 = cr * (cons + s['forge'] + s['notebook']) + s['late'] * 20 / ANCHOR_PP
    to = s['to_L'] if mil else s['to_G']
    dd = s['dedup']
    new = 1 - dd - to
    D1 = m1 * (new + dd * s['delta'] + to * s['probe'])
    L = m2 * (new + dd * s['delta'])
    items = ITEMS_PER_RAW * s['items'] * (s['bias'] / .87) * (1 - dd)
    lessons = (new + dd * s['delta']) / ANCHOR_PP
    return dict(pages=pages, D1=D1, L=L, cr=cr * new, items=items, lessons=lessons,
                m1=m1, m2=m2, cons=cons * cr)


def run(s, scope='all', phone=False, n=None, detail=False):
    n = len(s['wpm'])
    segs = ['Gc', 'Lc'] + (['Ga', 'La'] if scope == 'all' else [])
    C = {g: seg_costs(s, g) for g in segs}
    core_pages = C['Gc']['pages'] + C['Lc']['pages']
    def blend(keys, f):
        tot = sum(C[g]['pages'] for g in keys)
        return sum(C[g][f] * C[g]['pages'] for g in keys) / tot
    phases = [(core_pages, {f: blend(['Gc', 'Lc'], f) for f in ('D1', 'L', 'items', 'lessons')})]
    if scope == 'all':
        adv = C['Ga']['pages'] + C['La']['pages']
        phases.append((adv, {f: blend(['Ga', 'La'], f) for f in ('D1', 'L', 'items', 'lessons')}))
    total_pages = sum(p for p, _ in phases)
    fixed_h = s['diag_h'] * (1 if scope == 'all' else .75) + s['build_h']
    proj_h = s['proj_h'] + s['art_h']
    proj_pp = 60 * (proj_h + fixed_h) / total_pages            # spread over the pages (light work)
    # calendar
    days_wk = 6 * (1 - s['lost']) * .953 * .936
    dex = KNOB['k_ret'] * ((1 - s['mem'])[:, None] * DEX['best'][None, :] + s['mem'][:, None] * DEX['pess'][None, :])
    dim = KNOB['k_ret'] * ((1 - s['mem'])[:, None] * DIM['best'][None, :] + s['mem'][:, None] * DIM['pess'][None, :])
    hret = np.zeros((n, WEEKS))
    learned = np.zeros((n, WEEKS))
    done = np.zeros(n); fin = np.full(n, np.nan); core_fin = np.full(n, np.nan)
    hist = np.zeros((n, WEEKS))
    acc = dict(lesson=0, light=0, ret_exp=0, ret_imp=0, proj=0, exams=0, phone=0, d1_bind=0, cap=0)
    for w in range(WEEKS):
        month = w * DPW / M_DAYS
        efh = EFH8[min(int(month), 3)] * s['pf']
        cap = efh * days_wk * 60                                  # EFH minutes this week
        d1cap = np.minimum(s['d1cap'] * s['pf'], efh) * days_wk * 60
        if w == 0:                                                # pilot week: setup, calibration
            cap = cap * 0.0
            d1cap = d1cap * 0.0
        # retention load from earlier cohorts (own-week cost charged with the page below)
        if w > 0:
            past = learned[:, :w][:, ::-1]                        # lag 1..w
            ex = (past * dex[:, 1:w + 1]).sum(1)
            im = (past * dim[:, 1:w + 1]).sum(1)
        else:
            ex = im = np.zeros(n)
        active = np.isnan(fin)
        im_desk = im * (1 - s['hook_in'])
        exam = 1.67 * 60 * 7 / M_DAYS * active
        movable = ex * s['pocket']
        if phone:
            ph = 60 * 6 * s['ph_done'] * s['ph_yield']
        else:
            ph = np.zeros(n)
        # phase costs for the current position
        D1 = KNOB['k_lesson'] * np.where(done < phases[0][0], phases[0][1]['D1'], phases[-1][1]['D1'])
        Lp = KNOB['k_light'] * (np.where(done < phases[0][0], phases[0][1]['L'], phases[-1][1]['L']) + proj_pp)
        it = np.where(done < phases[0][0], phases[0][1]['items'], phases[-1][1]['items'])
        les = np.where(done < phases[0][0], phases[0][1]['lessons'], phases[-1][1]['lessons'])
        own = it * (dex[:, 0] + dim[:, 0] * (1 - s['hook_in']))  # same-week review per page
        # project work done from memory replaces explicit review (credit, capped at 30% of explicit)
        proj_cred = np.minimum(s['proj_credit'] * 60 * proj_h / total_pages, 0.3 * it * dex.sum(1))
        # phone absorbs movable work: pocket review + pre-questions of this week's lessons
        pre_pp = les * s['preq']
        ph_left = np.maximum(ph - movable, 0)
        used_ph = np.minimum(ph, movable)
        ret_desk = ex - used_ph + im_desk
        free = np.maximum(cap - ret_desk - exam, 0)
        per_page_total = np.maximum(D1 + Lp + own - proj_cred, D1)
        pg0 = np.maximum(free / per_page_total, 1e-9)
        per_page_total = np.maximum(per_page_total - np.minimum(pre_pp, ph_left / pg0), D1 - pre_pp)
        D1 = np.where(ph_left > 0, D1 - np.minimum(pre_pp, ph_left / pg0), D1)
        pg_tot = free / per_page_total
        pg_d1 = np.inf * np.ones(n) if KNOB['no_d1cap'] else d1cap / D1
        pg = np.minimum(pg_tot, pg_d1)
        pg = np.where(active, np.minimum(pg, total_pages - done), 0)
        acc['d1_bind'] += ((pg_d1 < pg_tot) & active).astype(float)
        before = done.copy()
        done = done + pg
        learned[:, w] = pg * it
        hist[:, w] = done
        hret[:, w] = (ex + im) / 6.0
        cf = np.isnan(core_fin) & (done >= phases[0][0] - 1e-6)
        frac = np.where(pg > 0, (phases[0][0] - before) / np.maximum(pg, 1e-9), 1)
        core_fin = np.where(cf, (w + np.clip(frac, 0, 1)) * DPW / M_DAYS, core_fin)
        fn = active & (done >= total_pages - 1e-6)
        frac2 = np.where(pg > 0, (total_pages - before) / np.maximum(pg, 1e-9), 1)
        fin = np.where(fn, (w + np.clip(frac2, 0, 1)) * DPW / M_DAYS, fin)
        if detail:
            acc['lesson'] += pg * D1; acc['light'] += pg * (Lp - proj_pp); acc['proj'] += pg * proj_pp
            acc['ret_exp'] += ex + pg * it * dex[:, 0]; acc['ret_imp'] += im + pg * it * dim[:, 0]
            acc['exams'] += exam; acc['phone'] += used_ph; acc['cap'] += cap * active
        if not np.isnan(fin).any():
            break
    fin = np.where(np.isnan(fin), WEEKS * DPW / M_DAYS, fin)
    # share done by months 6 and 8
    def share_at(m):
        w = min(int(round(m * M_DAYS / DPW)) - 1, WEEKS - 1)
        return hist[:, w] / total_pages, np.minimum(hist[:, w] / core_pages, 1)
    out = dict(fin=fin, core_fin=core_fin, s6=share_at(6), s8=share_at(8), s10=share_at(10),
               s12=share_at(12), C=C, total_pages=total_pages, core_pages=core_pages,
               d1_bind_weeks=acc['d1_bind'],
               maint=hret[np.arange(n), np.clip(np.round(fin * M_DAYS / DPW).astype(int) - 1, 0, WEEKS - 1)])
    # end-of-course maintenance load (min/day) from the stock
    if detail:
        out['acc'] = acc
    return out


def q(x, p):
    return np.nanpercentile(x, p)


def summarize(label, x):
    return (f"{label}: P10 {q(x,10):.1f} / P50 {q(x,50):.1f} / P90 {q(x,90):.1f} months; "
            f"P(<=6) {np.mean(x<=6):.2f}  P(<=8) {np.mean(x<=8):.2f}  P(<=10) {np.mean(x<=10):.2f}  "
            f"P(<=12) {np.mean(x<=12):.2f}  P(<=15) {np.mean(x<=15):.2f}")


def allin_mpp(s, scope):
    """Deterministic all-in learner minutes per effective page (mode reporting)."""
    r = run(s, scope=scope, phone=False, detail=True)
    a = r['acc']
    return r, a


if __name__ == '__main__':
    rng = np.random.default_rng(31)
    print('=== I. Integrated model, N =', N, '===')
    # ---------------- mode breakdown
    m = modes()
    for scope in ('all', 'core'):
        r, a = allin_mpp(m, scope)
        tot = sum(float(a[k][0]) for k in ('lesson', 'light', 'proj', 'ret_exp', 'ret_imp', 'exams'))
        print(f"\n[mode, {scope}] months (8 h, no phone) {r['fin'][0]:.1f}" +
              (f"; core reached at {r['core_fin'][0]:.1f}" if scope == 'all' else ''))
        for k in ('lesson', 'light', 'proj', 'ret_exp', 'ret_imp', 'exams'):
            print(f"   {k:8s} {a[k][0]/60:7.0f} h")
        print(f"   gross total {tot/60:.0f} h (hooks inside lessons not subtracted here: "
              f"{a['ret_imp'][0]*0.5/60:.0f} h of the hook line is already in 'lesson')")
        print(f"   gross min per raw page {tot/r['total_pages']:.2f}; EFH capacity used {a['cap'][0]/60:.0f} h; "
              f"weeks D1-cap binding {r['d1_bind_weeks'][0]:.0f}")
        for g, c in r['C'].items():
            print(f"   seg {g}: lesson {float(c['m1'][0]):.2f} min/new page, light {float(c['m2'][0]):.2f} "
                  f"(consult {float(c['cons'][0]):.2f}), CR/page {float(c['cr'][0]/(1-.13-(.10 if g[0]=='L' else .02))):.3f}")
    # ---------------- Monte Carlo
    S = sample(N, rng)
    res = {}
    for scope in ('all', 'core'):
        for phone in (False, True):
            res[(scope, phone)] = run(S, scope=scope, phone=phone)
    print('\n=== Monte Carlo: months to finish (8 h/day on R9 curve; "+1" = extra phone hour) ===')
    for scope, lab in (('all', 'EVERYTHING'), ('core', 'CORE of both')):
        for phone in (False, True):
            print(summarize(f"{lab:12s} 8 h{' + 1 phone' if phone else '          '}",
                            res[(scope, phone)]['fin']))
    for phone in (False, True):
        r = res[('all', phone)]
        print(f"\nEverything plan (core first), {'8 + 1' if phone else '8 h'}: share of ALL pages done by month "
              f"6: P50 {q(r['s6'][0]*100,50):.0f}% (P10-P90 {q(r['s6'][0]*100,10):.0f}-{q(r['s6'][0]*100,90):.0f}); "
              f"month 8: {q(r['s8'][0]*100,50):.0f}% ({q(r['s8'][0]*100,10):.0f}-{q(r['s8'][0]*100,90):.0f}); "
              f"month 12: {q(r['s12'][0]*100,50):.0f}%")
        print(f"   share of CORE done by month 6: {q(r['s6'][1]*100,50):.0f}% ({q(r['s6'][1]*100,10):.0f}-"
              f"{q(r['s6'][1]*100,90):.0f}); month 8: {q(r['s8'][1]*100,50):.0f}% ({q(r['s8'][1]*100,10):.0f}-"
              f"{q(r['s8'][1]*100,90):.0f}); month 10: {q(r['s10'][1]*100,50):.0f}%")
        print(f"   core reached inside the everything plan: P50 {q(r['core_fin'],50):.1f} months")
    # ---------------- what must be true: conditional draws
    print('\n=== What the fastest draws look like (everything, 8 + 1) ===')
    r = res[('all', True)]
    f = r['fin']
    for lab, mask in (('fastest 5%', f <= q(f, 5)), ('fastest 1%', f <= q(f, 1)), ('median band', (f > q(f, 45)) & (f < q(f, 55)))):
        print(f"{lab} (months {f[mask].min():.1f}-{f[mask].max():.1f}): " + ', '.join(
            f"{k}={np.median(S[k][mask]):.2f}" for k in ('ffast_math', 'ffast_mil', 'wpm', 'repr', 'bias', 'pf', 'mem', 'cons_old', 'forge', 'notebook', 'lost', 'd1cap')))
    # ---------------- tornado (everything, 8 + 1, others at mode)
    print('\n=== Tornado: everything, 8 + 1 phone, others at mode ===')
    base = run(modes(), 'all', True)['fin'][0]
    print(f"base at modes: {base:.1f} months")
    rows = []
    for k, (lo, mo, hi) in PARAMS.items():
        a = run(modes({k: lo}), 'all', True)['fin'][0]
        b = run(modes({k: hi}), 'all', True)['fin'][0]
        rows.append((abs(b - a), k, lo, hi, a, b))
    for k, sd in (('pf', .117), ('rubric', .15)):
        a = run(modes({k: np.exp(-1.2816 * sd)}), 'all', True)['fin'][0]
        b = run(modes({k: np.exp(1.2816 * sd)}), 'all', True)['fin'][0]
        rows.append((abs(b - a), k, 'P10', 'P90', a, b))
    for sw, k, lo, hi, a, b in sorted(rows, reverse=True)[:16]:
        print(f"  {k:12s} {lo!s:>6} -> {hi!s:<6}  {a:5.1f} -> {b:5.1f}   swing {sw:.1f}")
    # ---------------- required corners
    print('\n=== Corners: everything / core at 8 + 1 ===')
    corners = {
        'optimistic-plausible (fast path 60%/80%, 170 wpm, repr .9, mem .2, consult 4, forge 1.5, notebook 1, lost 6%, pf 1.1)':
            dict(ffast_math=.6, ffast_mil=.8, wpm=170, repr=.9, mem=.2, cons_old=4, forge=1.5, notebook=1, lost=.06, pf=1.1),
        'everything-at-best (all favourable ends at once)':
            {k: (v[0] if k not in ('ffast_math', 'ffast_mil', 'wpm', 'd1cap', 'dedup', 'to_L', 'to_G', 'proj_credit', 'hook_in', 'pocket', 'ph_done', 'ph_yield') else v[2]) for k, v in PARAMS.items()} | {'pf': 1.2},
    }
    for lab, ov in corners.items():
        a = run(modes(ov), 'all', True); c = run(modes(ov), 'core', True)
        print(f"  {lab}: everything {a['fin'][0]:.1f}, core {c['fin'][0]:.1f} months")
    # pure-lesson floor: in-lesson time only, nothing else (no consult, forge, notebook, review, projects)
    ov = dict(cons_old=0, forge=0, notebook=0, proj_h=0, art_h=0, build_h=0, diag_h=0, items=1e-6)
    a = run(modes(ov), 'all', True); c = run(modes(ov), 'core', True)
    print(f"  lessons only (no consultation, forge, notebook, review, projects): everything {a['fin'][0]:.1f}, core {c['fin'][0]:.1f}")
    ov2 = dict(ov, ffast_math=.85, ffast_mil=.95, wpm=190, fast_min=55, slow_min=72, repr=.85, topup=1.0, pf=1.2, lost=.05, d1cap=4.75)
    a = run(modes(ov2), 'all', True); c = run(modes(ov2), 'core', True)
    print(f"  lessons only, everything favourable: everything {a['fin'][0]:.1f}, core {c['fin'][0]:.1f}")

    # ---------------- what must be true: uniform speed-up needed at modes (8 + 1)
    print('\n=== Required: factor on ALL learner minutes per page (lesson, light, retention) at modes, 8 + 1 ===')
    def fin_at(k, scope, nocap=False, which=('k_lesson', 'k_light', 'k_ret')):
        for w in which:
            KNOB[w] = k
        KNOB['no_d1cap'] = nocap
        v = run(modes(), scope, True)['fin'][0]
        for w in ('k_lesson', 'k_light', 'k_ret'):
            KNOB[w] = 1.0
        KNOB['no_d1cap'] = False
        return v
    def need(target, scope, nocap=False, which=('k_lesson', 'k_light', 'k_ret')):
        lo, hi = 0.05, 1.5
        for _ in range(40):
            mid = (lo + hi) / 2
            if fin_at(mid, scope, nocap, which) > target:
                hi = mid
            else:
                lo = mid
        return lo
    m0 = modes()
    for scope in ('all', 'core'):
        r, a = allin_mpp(m0, scope)
        tot = sum(float(a[k][0]) for k in ('lesson', 'light', 'proj', 'ret_exp', 'ret_imp', 'exams')) - 0.5 * float(a['ret_imp'][0])
        mpp = tot / r['total_pages']
        lmpp = float(a['lesson'][0]) / r['total_pages']
        for T in (6, 8, 10, 12):
            k = need(T, scope)
            kn = need(T, scope, nocap=True)
            kl = need(T, scope, which=('k_lesson',))
            print(f"  {scope:4s} <= {T:2d} mo: all minutes x{k:.2f} (all-in ~{mpp*k:.1f} min/raw page, lessons ~{lmpp*k:.1f}); "
                  f"without the D1 cap x{kn:.2f}; lessons alone x{kl:.2f} (others at mode)")
        print(f"  [{scope}] mode all-in net {mpp:.2f} min/raw page, lessons {lmpp:.2f}; maintenance at finish "
              f"{float(run(m0, scope, True)['maint'][0]):.0f} min/day")
    for scope in ('all', 'core'):
        r = res[(scope, True)]
        print(f"  MC {scope} 8+1: review load at finish P50 {q(r['maint'],50):.0f} min/day (P10-P90 {q(r['maint'],10):.0f}-{q(r['maint'],90):.0f})")
    # sensitivity: no dense cap at all (he is right that 8 h of lessons is fine)
    for scope in ('all', 'core'):
        KNOB['no_d1cap'] = True
        rr = run(S, scope, True)['fin']
        KNOB['no_d1cap'] = False
        print(summarize(f"  no D1 cap, {scope} 8+1", rr))
    # sensitivity: strong individual (EFH 7.3 at 8 h, R9), i.e. pf = 1.21 for everyone
    S2 = dict(S); S2['pf'] = np.full(N, 7.3 / 6.05)
    for scope in ('all', 'core'):
        print(summarize(f"  strong individual (EFH 7.3), {scope} 8+1", run(S2, scope, True)['fin']))
