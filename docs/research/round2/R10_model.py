#!/usr/bin/env python3
"""R10: tier-aware time model. R8_model.py's inventory, dedup, calendar, fatigue curve and mobile hour are
reused unchanged; only the work per page is replaced:

  R8 : strict CRs/page x (one full level-2.5 treatment each, size-scaled) + 250 lesson words/page flat
  R10: per page,  K items x full treatment  +  S items x supporting treatment  +  C items x context treatment
       lesson words = K*wK + S*wS + C*wC + w0 (figures, book examples, story, keep, exercises)

Tier densities per book class are MEASURED (R10_classify.py, adjudicated labels, 119 items / 192 pages).
K items get exactly R8's per-CR minutes (active, dialogue, forge, notebook, spaced review), with R8's own
size scaling evaluated at the K-item granularity. S and C minutes and all word budgets are derived
bottom-up from A2 (26.5 words per depth unit after compression; units per facet), see R10_tiers.md s3.

Scenarios: R8 reference; LITERAL (every item, all tiers, gets the K treatment); TIERED (adjudicated);
TIERED-MAX (disagreements resolved upward); TIERED+SAFEGUARDS (promotion of S to K, all-tier exams).
Run: python3 -I R10_model.py      (needs cache/R10_classify.json; ~10 s)
"""
import json, os, sys, math
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import R8_model as R8

CL = json.load(open(os.path.join(HERE, 'cache', 'R10_classify.json')))
N = 20000

def tier_density(label='final'):
    d = {c: dict(v) for c, v in CL['rater_density'][label].items()}
    f = d['F']; hf = 0.08 / R8.DENS['F'] if R8.DENS['F'] > 0 else 1   # articles: like class F, scaled as R8 did
    d['H'] = {t: f[t] * hf for t in 'KSC'}
    return d

# (low, mode, high). Minutes are learner minutes per item; words are lesson words per item.
TP = {
    'wK':        (500, 750, 1100),   # ~22 depth units (7 facets + definition + derivation skeleton) x 26.5 w + formula blocks
    'wS':        (180, 280, 420),    # ~9 units: definition, structure, origin/assumptions, limits, one number, link to its K
    'wC':        (50, 80, 130),      # ~3 units: precise definition with conditions + where it is used
    'w0':        (25, 50, 90),       # per page: figures and book worked examples (rule 8), story, keep, exercises
    'les_words': (2600, 3200, 4000), # words per lesson (R8 implied ~3,230 at its mode)
    'actS':      (2, 3.5, 6),        # one commit: predict the number or locate the assumption
    'dialS':     (0, 0.3, 1.0),      # the logged dialogue (R8 s2.4) already covered satellites: K carries it
    'noteS':     (0, 0.3, 1.0),
    'revS':      (0.3, 0.8, 1.5),    # reviewed through its keystone + sampled in held-out exams
    'actC':      (0, 0.5, 1.5),
    'dialC':     (0, 0, 0.3),
    'revC':      (0, 0.2, 0.5),
    'tier_shift': (-0.15, 0, 0.15),  # boundary judgement: K density x e^t, S absorbs the difference
    'r10_save_h': (0, 20, 50),       # R7's project certification only; facet collapse is what tiering does
    'promote':   (0.05, 0.15, 0.30), # share of S the learner promotes to K (safeguard scenario only)
    'exam_extra_h': (10, 25, 45),
    'cl_share':  (0.25, 0.40, 0.50), # share of a K item's work that is per CLUSTER (trade-off, shared structure,
                                     # critique, forge across co-taught keystones) [P]: cluster scenario only    # extra held-out exam hours to sample all tiers (safeguard scenario only)
}
CLASS_SD = R8.CLASS_SD

def sample_tp(n, rng):
    out = {}
    for k, (a, c, b) in TP.items():
        u = rng.random(n)
        out[k] = R8._tri_ppf(u, a, c, b)
    out['class_noise'] = {c: np.exp(rng.normal(0, CLASS_SD / math.sqrt(max(CL['class_n'].get(c, 1), 1)), n))
                          for c in 'ABCDEFGH'}
    return out

def mode_tp():
    out = {k: np.array([float(v[1])]) for k, v in TP.items()}
    out['class_noise'] = {c: np.array([1.0]) for c in 'ABCDEFGH'}
    return out

def hours_tiered(p, q, dens, scope=('core', 'adv'), literal=False, promote=False, exams=False,
                 kgran='measured', s_on=True, c_on=True, flat_words=False, save_h=None, cluster=False):
    """p: R8 parameter draws; q: R10 draws; dens: {class: {K,S,C}}.
    Waterfall switches: kgran='strict' counts K at R8's strict CR density; s_on / c_on give S / C items their
    minutes (off = R8's implicit treatment: read only); flat_words = R8's flat words per page."""
    eff = 0.0; nK = 0.0; nS = 0.0; nC = 0.0; mods = 0; lanmods = 0
    for (app, tier, c), r in R8.INV.items():
        if tier not in scope:
            continue
        pages = r['main'] + p['w_supp'] * r['supp'] + p['w_art'] * r['article']
        dd = np.clip(p['dedup'] * R8.DEDUP_SHAPE[(app, tier)], 0, 0.6)
        pages = pages * (1 - dd * (1 - p['delta_cost']))
        pages = pages * (1 - (p['testout_L'] if app == 'L' else p['testout_G']))
        eff = eff + pages
        cn = q['class_noise'].get(c, 1.0)
        k = dens[c]['K'] * cn * p['sel_bias']; s = dens[c]['S'] * cn * p['sel_bias']; cc = dens[c]['C'] * cn
        if kgran == 'strict':
            k = p['dens_' + c] * p['sel_bias']
        k2 = k * np.exp(q['tier_shift']); s2 = np.maximum(s + k - k2, 0)
        nK = nK + pages * k2; nS = nS + pages * s2; nC = nC + pages * cc
    for (app, tier), m in R8.MODS.items():
        if tier in scope:
            mods += m; lanmods += m if app == 'L' else 0
    # R8's size scaling, evaluated at the measured K-item granularity (K items are ~0.6x an R8 strict CR)
    sizeK = (0.09 / (nK / eff)) ** p['size_exp']
    if promote:
        moved = nS * q['promote']; nK = nK + moved; nS = nS - moved
    if literal:          # every item gets the K treatment at the K-item size (no further shrink for finer items)
        nK, nS, nC = nK + nS + nC, 0 * nS, 0 * nC
    if not s_on:
        nS = 0 * nS
    if not c_on:
        nC = 0 * nC
    words = eff * p['wpp'] if flat_words else nK * q['wK'] + nS * q['wS'] + nC * q['wC'] + eff * q['w0']
    lessons = words / q['les_words']
    if cluster:   # facets 5-7 + forge written once per cluster of co-taught keystones, each K still named in them
        csize = np.maximum(nK / lessons, 1)
        f = (1 - q['cl_share']) + q['cl_share'] / csize
        sizeK = sizeK * f
        words = words - nK * q['wK'] * (1 - f)
        lessons = words / q['les_words']
    h = {}
    h['reading'] = words / p['wpm'] / 60
    h['active_K'] = nK * p['act_cr'] * sizeK / 60
    h['active_S'] = nS * q['actS'] / 60
    h['active_C'] = nC * q['actC'] / 60
    h['active_supp'] = eff * p['act_supp_pp'] / 60
    h['review_K'] = nK * p['rev_items'] * p['rev_n'] * p['rev_min'] * sizeK * (1 - p['rev_credit']) / 60
    h['review_SC'] = (nS * q['revS'] + nC * q['revC']) / 60
    h['modchecks'] = mods * p['modcheck'] / 60 + 0 * eff
    h['dialogue'] = (nK * p['dialog_cr'] * sizeK + nS * q['dialS'] + nC * q['dialC']) / 60
    h['forge_K'] = nK * p['forge_cr'] * sizeK / 60
    h['notebook'] = (nK * p['notebook_cr'] * sizeK + nS * q['noteS']) / 60
    h['lesson_ovh'] = lessons * p['les_ovh'] / 60
    h['gen_wait'] = lessons * ((1 - p['p_fact_fail']) * p['live_share'] * p['live_wait'] + p['p_fact_fail'] * p['pipe_wait']) / 60
    h['testout_diag'] = lanmods * p['diag_min'] / 60 + 0 * eff
    h['projects'] = p['projects_h'] + 0 * eff
    h['articles'] = p['articles_h'] + 0 * eff
    h['build_pilot'] = p['build_h'] + 0 * eff
    h['exams_extra'] = (q['exam_extra_h'] if exams else 0 * q['exam_extra_h']) + 0 * eff
    h['savings'] = -(q['r10_save_h'] if save_h is None else p[save_h]) * (1.0 if 'adv' in scope else 0.75) + 0 * eff
    h['_K'] = nK; h['_S'] = nS; h['_C'] = nC; h['_eff'] = eff; h['_words'] = words; h['_lessons'] = lessons
    return h

def total(h):
    return sum(v for k, v in h.items() if not k.startswith('_'))

def pct(x, q):
    return float(np.percentile(x, q))

D1 = ('reading', 'active_K', 'active_S', 'active_C', 'active_supp', 'lesson_ovh', 'gen_wait')

def main():
    dens = tier_density('final')
    print('== Tier densities used (items per page, adjudicated; H = F x 0.08/strict_F) ==')
    for c in sorted(dens):
        print(f"  {c}: K {dens[c]['K']:.3f}  S {dens[c]['S']:.3f}  C {dens[c]['C']:.3f}")
    # page-weighted mix per app/tier
    print('\n== Page-weighted tier mix per app/tier (main + 0.5 supp + 0.35 art, before dedup) ==')
    for app in 'GL':
        for tier in ('core', 'adv'):
            w = {c: r['main'] + 0.5 * r['supp'] + 0.35 * r['article'] for (a, t, c), r in R8.INV.items() if a == app and t == tier}
            W = sum(w.values())
            k = sum(w[c] * dens[c]['K'] for c in w) / W; s = sum(w[c] * dens[c]['S'] for c in w) / W; cc = sum(w[c] * dens[c]['C'] for c in w) / W
            print(f"  {app} {tier:4s}: K {k:.3f} S {s:.3f} C {cc:.3f} per page -> shares K {k/(k+s+cc):.0%} S {s/(k+s+cc):.0%} C {cc/(k+s+cc):.0%}")

    md = R8.modes(); mq = mode_tp()
    scen = [('TIERED (adjudicated)', dict(dens=dens)),
            ('TIERED, rater A labels', dict(dens=tier_density('A'))),
            ('TIERED, rater B labels', dict(dens=tier_density('B'))),
            ('TIERED-MAX (disagreement -> higher tier)', dict(dens=tier_density('maxrule'))),
            ('TIERED + SAFEGUARDS (promote 15% of S, all-tier exams)', dict(dens=dens, promote=True, exams=True)),
            ('TIERED + SAFEGUARDS + KEYSTONE CLUSTERS [P]', dict(dens=dens, promote=True, exams=True, cluster=True)),
            ('LITERAL (every item gets all 7 facets + forge + review)', dict(dens=dens, literal=True))]
    print('\n== Deterministic mode: hours by component ==')
    r8b = R8.hours(md, ('core', 'adv')); r8c = R8.hours(md, ('core',))
    print(f"  R8 reference: BOTH {float(R8.total(r8b)[0]):.0f} h ({float(r8b['_crs'][0]):.0f} strict CRs), CORE {float(R8.total(r8c)[0]):.0f} h")
    for name, kw in scen:
        for scope, sn in ((('core', 'adv'), 'BOTH'), (('core',), 'CORE')):
            h = hours_tiered(md, mq, scope=scope, **kw); T = float(total(h)[0])
            line = (f"  {name:58s} {sn}: {T:5.0f} h | K {float(h['_K'][0]):5.0f} S {float(h['_S'][0]):5.0f} C {float(h['_C'][0]):5.0f}"
                    f" | words/page {float(h['_words'][0]/h['_eff'][0]):4.0f} | lessons {float(h['_lessons'][0]):5.0f}")
            print(line)
            if name.startswith('TIERED (adj') and sn == 'BOTH':
                comp = h
    print('  component breakdown, TIERED (adjudicated), BOTH:')
    for k, v in comp.items():
        if not k.startswith('_'):
            print(f'     {k:13s} {float(v[0]):6.0f}')
    Tm = float(total(comp)[0]); d1 = sum(float(comp[k][0]) for k in D1)
    print(f'  D1 dense share {d1/Tm:.0%} (reading, active work, lesson overhead, generation wait)')
    kmin = (float(comp['active_K'][0] + comp['review_K'][0] + comp['forge_K'][0]) * 60 / float(comp['_K'][0]))
    print(f'  per K item (active+review+forge, mode): {kmin:.1f} min; K words read {float(mq["wK"][0]):.0f} -> {float(mq["wK"][0])/145:.1f} min')

    S = R8.sample(N, np.random.default_rng(10)); Q = sample_tp(N, np.random.default_rng(11))
    print('\n== Waterfall: from R8 to TIERED (BOTH apps; hours at mode | MC P50 months at 8+1) ==')
    steps = [('W0 R8 regime in this code: K = strict CRs, S/C read only, 250 w/page, R7 savings',
              dict(kgran='strict', s_on=False, c_on=False, flat_words=True, save_h='r7_save_h')),
             ('W1 + keystones at the measured K granularity (rubric), full treatment each',
              dict(s_on=False, c_on=False, flat_words=True, save_h='r7_save_h')),
             ('W2 + S items get their supporting treatment (commit, review via keystone)',
              dict(c_on=False, flat_words=True, save_h='r7_save_h')),
             ('W3 + C items get definition + where-used minutes', dict(flat_words=True, save_h='r7_save_h')),
             ('W4 + lesson words built per tier (not a flat 250/page); R7 savings -> 20 h (= TIERED)', dict())]
    for name, kw in steps:
        hm = total(hours_tiered(md, mq, dens=dens, **kw)); hs = total(hours_tiered(S, Q, dens=dens, **kw))
        print(f'  {name:88s} {float(hm[0]):5.0f} h | {pct(R8.months(S, 8, 1, T=hs), 50):4.1f} mo')
    res = {}
    print(f'\n== Monte Carlo N={N}: months P10 / P50 / P90 (R8 calendar: fatigue curve, adherence, lost days, light weeks) ==')
    rows = [('R8 reference', None)] + scen
    for name, kw in rows:
        for scope, sn in ((('core', 'adv'), 'EVERYTHING'), (('core',), 'CORE')):
            if kw is None:
                T = R8.total(R8.hours(S, scope))
            else:
                T = total(hours_tiered(S, Q, scope=scope, **kw))
            line = f"  {name[:44]:44s} {sn:10s} h {pct(T,10):5.0f}/{pct(T,50):5.0f}/{pct(T,90):5.0f} |"
            for H in (7, 8, 9, 10):
                m = R8.months(S, H, 1, scope, T=T); res[(name, sn, H)] = m
                line += f" {H}+1: {pct(m,10):4.1f}/{pct(m,50):4.1f}/{pct(m,90):4.1f}"
            print(line)
    print('\n== P(finish <= 12 / 15 / 18 months), 8+1 and 10+1 ==')
    for name, _ in rows:
        for sn in ('EVERYTHING', 'CORE'):
            print(f"  {name[:44]:44s} {sn:10s} " + '  '.join(
                f"{H}+1: " + ' '.join(f"{np.mean(res[(name, sn, H)] <= d):.2f}" for d in (12, 15, 18)) for H in (8, 10)))
    print('\n== no mobile hour, P50 months (for comparison with R8 s0) ==')
    for name, kw in rows:
        out = []
        for scope, sn in ((('core', 'adv'), 'EVERYTHING'), (('core',), 'CORE')):
            T = R8.total(R8.hours(S, scope)) if kw is None else total(hours_tiered(S, Q, scope=scope, **kw))
            out.append(f"{sn} " + ' '.join(f"{H}: {pct(R8.months(S, H, 0, scope, T=T),50):4.1f}" for H in (7, 8, 9, 10)))
        print(f"  {name[:44]:44s} " + ' | '.join(out))
    print('\n== R9 effective-hours curve (no separate mobile hour), P50 months ==')
    rr = np.random.default_rng(92)
    for name, kw in [('R8 reference', None), scen[0], scen[4], scen[5], scen[6]]:
        out = []
        for scope, sn in ((('core', 'adv'), 'EVERYTHING'), (('core',), 'CORE')):
            if kw is None:
                ms = [pct(R8.months_r9(S, H, scope, rng=rr)[0], 50) for H in (7, 8, 10)]
            else:
                hh = hours_tiered(S, Q, scope=scope, **kw)
                ms = [pct(months_r9_T(S, hh, H, rr), 50) for H in (7, 8, 10)]
            out.append(f"{sn} 7h {ms[0]:4.1f} 8h {ms[1]:4.1f} 10h {ms[2]:4.1f}")
        print(f"  {name[:44]:44s} " + ' | '.join(out))

    print('\n== Tornado, TIERED both apps, 8+1, others at mode ==')
    base = float(R8.months(md, 8, 1, T=total(hours_tiered(md, mq, dens=dens)))[0]); print(f'  base {base:.1f}')
    out = []
    for k, (lo, _, hi) in list(TP.items()):
        if k in ('promote', 'exam_extra_h'):
            continue
        a = dict(mq); b = dict(mq); a[k] = np.array([float(lo)]); b[k] = np.array([float(hi)])
        ml = float(R8.months(md, 8, 1, T=total(hours_tiered(md, a, dens=dens)))[0])
        mh = float(R8.months(md, 8, 1, T=total(hours_tiered(md, b, dens=dens)))[0])
        out.append((abs(mh - ml), k, lo, hi, ml, mh))
    for k in ('wpm', 'act_cr', 'size_exp', 'rev_min', 'dialog_cr', 'forge_cr', 'sel_bias'):
        lo, _, hi = R8.PARAMS[k]; a = dict(md); b = dict(md); a[k] = np.array([float(lo)]); b[k] = np.array([float(hi)])
        ml = float(R8.months(a, 8, 1, T=total(hours_tiered(a, mq, dens=dens)))[0])
        mh = float(R8.months(b, 8, 1, T=total(hours_tiered(b, mq, dens=dens)))[0])
        out.append((abs(mh - ml), k, lo, hi, ml, mh))
    for sw, k, lo, hi, ml, mh in sorted(out, reverse=True)[:12]:
        print(f'  {k:12s} [{lo} .. {hi}]  {ml:5.1f} -> {mh:5.1f}  swing {sw:.1f}')

def months_r9_T(p, hh, H, rng):
    """R8.months_r9 with a precomputed hour dict (same logic, D1 keys of this model)."""
    T = total(hh); n = T.shape[0]
    factor = np.clip(rng.normal(1, 0.15 / 1.2816, n), 0.6, 1.4)
    days = R8.DAYS_PER_MONTH * (1 - p['lost']) * R8.R9_LIGHT_WEEK * R8.R9_FRIDAY
    d1 = sum(hh[k] for k in D1)
    cap = rng.uniform(R8.D1_CAP_EFH[0], R8.D1_CAP_EFH[2], n)
    done = np.zeros(n); m = np.zeros(n); finished = np.zeros(n, bool)
    curve = R8.R9_EFH[H]
    for month in range(1, 121):
        efh = curve[min(month, 4) - 1] * factor
        tot_cap = efh * days - p['exam_month']
        d1_cap = np.minimum(cap * factor, efh) * days
        share = d1 / T
        prog = np.minimum(tot_cap, d1_cap / share)
        frac = np.where(~finished, np.minimum(1, (T - done) / prog), 0)
        m = m + frac; done = done + prog * frac
        finished = finished | (done >= T - 1e-6)
        if finished.all():
            break
    return m + R8.PILOT_MONTHS

if __name__ == '__main__':
    main()
