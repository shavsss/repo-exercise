#!/usr/bin/env python3
"""Z. Calendar effect of (A) retention policies and (B) lesson levers, on F_model.py unchanged.

F_model is imported as is; only its retention curves (DEX/DIM) and some PARAMS/KNOB entries are replaced.
Retention curves come from Z_ret.py (per tier, age-based, F's real K/S/C mix 12.6/34.9/52.4%).
Run: python3 -I Z_ret.py > Z_ret.out && python3 -I Z_model.py > Z_model.out
"""
import os, sys, copy, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import F_model as F

Z = np.load(os.path.join(HERE, 'Z_ret_curves.npz'))
MIX = dict(K=2354, S=6512, C=9723); TOT = sum(MIX.values())
R10 = dict(K=5.3 / 17, S=6.0 / 17, C=5.7 / 17)


def wd(arr):
    C = F.smooth_cum(arr)
    days = np.arange(0, 7 * (F.WEEKS + 2), 7)
    return np.diff(np.interp(days, np.arange(len(C)), C))


def set_curves(pol, mix=None):
    mix = mix or {t: v / TOT for t, v in MIX.items()}
    for m in ('best', 'pess'):
        F.DEX[m] = wd(sum(mix[t] * Z[f'{pol}_{m}_{t}_exp'] for t in 'KSC'))
        F.DIM[m] = wd(sum(mix[t] * Z[f'{pol}_{m}_{t}_imp'] for t in 'KSC'))


ORIG = (copy.deepcopy(F.DEX), copy.deepcopy(F.DIM), copy.deepcopy(F.PARAMS), dict(F.KNOB))


def reset():
    F.DEX.clear(); F.DEX.update(copy.deepcopy(ORIG[0])); F.DIM.clear(); F.DIM.update(copy.deepcopy(ORIG[1]))
    F.PARAMS.clear(); F.PARAMS.update(copy.deepcopy(ORIG[2])); F.KNOB.clear(); F.KNOB.update(ORIG[3])


def mc(label, n=F.N, seed=31):
    rng = np.random.default_rng(seed)
    S = F.sample(n, rng)
    row = [label]
    for scope in ('all', 'core'):
        f = F.run(S, scope=scope, phone=True)['fin']
        row.append('%.1f / %.1f / %.1f' % tuple(np.percentile(f, [10, 50, 90])))
    m = F.modes()
    r = F.run(m, 'all', False, detail=True); a = r['acc']
    row.append('L %4.0f  ret %4.0f+%4.0f h' % (a['lesson'][0] / 60, a['ret_exp'][0] / 60, a['ret_imp'][0] / 60))
    print(' | '.join(row)); sys.stdout.flush()


# lesson levers: (param or knob, new value) -- each one alone on top of the chosen retention policy
LEV = {
    'B1 reading speed practice (wpm 145->160 mode, 115-200)': ('P', 'wpm', (115, 160, 200)),
    'B2 worked-example fading on CR part (x0.95, 0.90-1.0)': ('K', 'k_lesson', 0.95),
    'B3 tables/diagrams for structure units (x0.97)': ('K', 'k_lesson', 0.97),
    'B4 pretest fast path grows (math .35->.42, mil .60->.65)': ('P2', None, None),
    'B5 phone pre-read of narrative + C glossary (preq 1.5->6 min/lesson)': ('P', 'preq', (3, 6, 10)),
    'B6 nap / two dense blocks (D1 cap +0.5 h)': ('P', 'd1cap', (4.6, 4.9, 5.25)),
}


def apply(kind, key, val):
    if kind == 'P':
        F.PARAMS[key] = val
    elif kind == 'K':
        F.KNOB[key] = F.KNOB.get(key, 1.0) * val
    elif kind == 'P2':
        F.PARAMS['ffast_math'] = (.20, .42, .65); F.PARAMS['ffast_mil'] = (.40, .65, .88)


if __name__ == '__main__':
    print('scenario | everything 8+1 P10/P50/P90 | core 8+1 P10/P50/P90 | mode, 8 h: lesson, explicit+hook hours')
    reset(); mc('F as published (I curves, R10 tier mix)')
    reset(); set_curves('P0', R10); mc('P0 clean age-based curves, R10 mix (method check)')
    for p, lab in (('P0', 'all tiers r=.90'), ('P1', 'C floor .75'), ('P2', 'C use-only'),
                   ('P3', 'C use-only + S via keystone .85'), ('P4', 'C use-only + S .80'),
                   ('P5', 'S via keystone .85 + C floor .75')):
        reset(); set_curves(p); mc(f'{p} F tier mix, {lab}')
    print('\n-- lesson levers, each alone, on P5 --')
    for lab, (k, key, val) in LEV.items():
        reset(); set_curves('P5'); apply(k, key, val); mc(lab)
    print('\n-- combined best defensible plan: P5 + B1 + B2 + B3 + B4 + B5 (not B6) --')
    reset(); set_curves('P5')
    for lab in list(LEV)[:5]:
        apply(*LEV[lab])
    mc('BEST (P5 + B1..B5)')
    # B with every lever at its low end (pessimistic realisation)
    reset(); set_curves('P5'); F.PARAMS['wpm'] = (110, 150, 190); F.KNOB['k_lesson'] = 0.98 * 0.99
    F.PARAMS['ffast_math'] = (.15, .38, .60); F.PARAMS['preq'] = (2, 3.5, 6)
    mc('BEST, levers at low end')
    reset(); set_curves('P5')
    for lab in list(LEV)[:5]:
        apply(*LEV[lab])
    F.PARAMS['mem'] = (0, .2, .6)
    mc('BEST + pilot confirms schema memory (mem mode .4->.2)')
