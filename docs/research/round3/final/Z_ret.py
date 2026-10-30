#!/usr/bin/env python3
"""Z. Per-tier retention cost curves under alternative retention POLICIES, on the FINAL tier mix.

Uses P_retention_model.simulate unchanged except for bookkeeping (per-tier daily cost and per-tier recall
probes), injected by source patching. Pace = 17 items/day split by the F curriculum's real K/S/C mix
(K 12.6% / S 34.9% / C 52.4%), not R10's 31/35/34 mix that I_work/ret_curves.npz was built on.

Policies (all keep K explicit at r = .90):
  P0  F's policy: K, S, C explicit at r = .90 (+ designed hooks, bundles)
  P1  C explicit only as a safety floor (r = .75); hooks/glossary carry the rest
  P2  C use-only: no scheduled C review at all; uses in later lessons are recall-first hooks; a failed
      hook = on-demand lookup + relearn (lapse cost 0.8 min); S as P0
  P3  P2 + S reviewed through its keystone: S explicit floor r = .85, bundle hook on every K review
  P4  P3 but S floor r = .80 (aggressive; shown to locate the edge)
  P5  S through keystone (floor .85) + C safety floor .75 (recall kept >= .90 mean)
Output: Z_ret_curves.npz (per policy x memory variant x tier: daily per-item explicit / hook cost by age)
and the recall probes per tier (mean R and 5th pct at 180 and 365 days after learning).
"""
import os, sys, re, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
R2 = os.path.join(os.path.dirname(os.path.dirname(HERE)), 'round2')
src = open(os.path.join(R2, 'P_retention_model.py')).read()
src = src.split('\nif __name__ == "__main__":')[0]
src = src.replace('out[kind][today] += cost.sum()',
                  'out[kind][today] += cost.sum()\n'
                  '        for _t in "KSC":\n'
                  '            out[kind + "_" + _t][today] += cost[tiers[idx] == _t].sum()\n'
                  '            _m = tiers[idx] == _t\n'
                  '            np.add.at(AGE[kind + "_" + _t], (today - learn[idx][_m]).astype(int), cost[_m])')
src = src.replace('lapses=np.zeros(T), meanR=np.zeros(T))',
                  'lapses=np.zeros(T), meanR=np.zeros(T), **{k + "_" + t: np.zeros(T) for k in ("exp_min", "imp_min") for t in "KSC"})')
src = src.replace('probe[a].append(R_of(today - last[i], S[i]))',
                  'probe[a].append(R_of(today - last[i], S[i])); TP.setdefault((a, tiers[i]), []).append(R_of(today - last[i], S[i]))')
ns = {'TP': {}, 'AGE': {}}
exec(compile(src, 'P_patched', 'exec'), ns)
simulate = ns['simulate']

MIX = dict(K=2354, S=6512, C=9723)          # F_curriculum.json totals, book + added, Gc+Ga+Lc+La
tot = sum(MIX.values())
PACE = {t: 17.0 * v / tot for t, v in MIX.items()}
DAYS = 700
OFF = 1e-3                                  # r so low that the item is never scheduled
POL = {
    'P0': dict(K=.90, S=.90, C=.90),
    'P1': dict(K=.90, S=.90, C=.75),
    'P2': dict(K=.90, S=.90, C=OFF),
    'P3': dict(K=.90, S=.85, C=OFF),
    'P4': dict(K=.90, S=.80, C=OFF),
    'P5': dict(K=.90, S=.85, C=.75),
}
MEM = {'best': dict(s0_mult=2.0, sinc_mult=1.3, cost_mult=0.6, hooks_per_use=1.5),
       'pess': dict(cost_mult=0.6, hooks_per_use=1.5)}

if __name__ == '__main__':
    out = {}
    print('pace items/day', {k: round(v, 2) for k, v in PACE.items()})
    for p, rt in POL.items():
        for m, kw in MEM.items():
            ns['TP'].clear()
            for k in ('exp_min', 'imp_min'):
                for t in 'KSC':
                    ns['AGE'][k + '_' + t] = np.zeros(DAYS + 2)
            o = simulate(PACE, DAYS, post_days=1, r=.90, r_tier=rt, seed=7, **kw)
            nt = {t: (o['tiers'] == t).sum() / DAYS for t in 'KSC'}   # realised pace
            line = f'{p} {m:4s}'
            tot_e = tot_i = 0
            for t in 'KSC':
                reach = nt[t] * (DAYS - np.arange(DAYS))                # items that reached age a
                e = np.cumsum(ns['AGE']['exp_min_' + t][:DAYS] / reach); i = np.cumsum(ns['AGE']['imp_min_' + t][:DAYS] / reach)
                out[f'{p}_{m}_{t}_exp'] = e; out[f'{p}_{m}_{t}_imp'] = i
                pr = {a: (np.mean(ns['TP'].get((a, t), [np.nan])), np.quantile(ns['TP'].get((a, t), [np.nan]), .05)) for a in (180, 365)}
                line += f' | {t}: C180 {e[180]:4.2f}+{i[180]:4.2f} C365 {e[365]:5.2f}+{i[365]:4.2f} C600 {e[600]:5.2f}+{i[600]:4.2f} R180 {pr[180][0]:.3f}({pr[180][1]:.2f}) R365 {pr[365][0]:.3f}({pr[365][1]:.2f})'
                tot_e += o['exp_min_' + t][:DAYS].sum(); tot_i += o['imp_min_' + t][:DAYS].sum()
            print(line + f' | all 700 d: exp {tot_e/60:.0f} h hooks {tot_i/60:.0f} h')
    for m, kw in MEM.items():
        for k in ('exp_min', 'imp_min'):
            for t in 'KSC':
                ns['AGE'][k + '_' + t] = np.zeros(DAYS + 2)
        A = dict(K=5.3, S=6.0, C=5.7)
        o = simulate(A, DAYS, post_days=1, r=.90, seed=7, **kw)
        nt = {t: (o['tiers'] == t).sum() / DAYS for t in 'KSC'}
        cur = {}
        for k in ('exp_min', 'imp_min'):
            cur[k] = sum(A[t] / 17 * np.cumsum(ns['AGE'][k + '_' + t][:DAYS] / (nt[t] * (DAYS - np.arange(DAYS)))) for t in 'KSC')
        print(f'check R10 mix, P0 {m}: age-based C365 {cur["exp_min"][365]:.2f}+{cur["imp_min"][365]:.2f} C600 {cur["exp_min"][600]:.2f}+{cur["imp_min"][600]:.2f}')
    np.savez(os.path.join(HERE, 'Z_ret_curves.npz'), **out)
