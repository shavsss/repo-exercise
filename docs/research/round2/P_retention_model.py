"""P. Retention load model: FSRS-4.5 memory model + Math-Academy-style encompassing credit.

Simulates every item (K/S/C tiers from R10) day by day:
- explicit reviews when predicted recall R falls to the desired retention r;
- implicit reviews ("recall-first hooks") when a later lesson / forge / project / article
  uses the item: the learner must retrieve it before the text shows it. Credit is fractional
  (w by tier) and zero when the hit comes too early (R > 0.95: no hook, no cost);
- bundle credit: when a K is reviewed explicitly, its attached S items with R < 0.95 get a
  30-s hook inside the same review (credit 0.7);
- lapses (failed retrieval) cost relearning minutes and reset stability (FSRS failure formula).

Output: review minutes per day by month, recall probes at 6 and 12 months after learning,
steady-state maintenance after the course ends. Run: python3 -I P_retention_model.py
"""
import numpy as np

W = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367,
     1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755]  # FSRS-4.5 defaults
DECAY, FACTOR = -0.5, 19 / 81


def R_of(t, S):
    return (1 + FACTOR * t / S) ** DECAY


def interval(S, r):
    return S / FACTOR * (r ** (1 / DECAY) - 1)


def s_success(S, D, R):
    inc = np.exp(W[8]) * (11 - D) * S ** (-W[9]) * (np.exp(W[10] * (1 - R)) - 1)
    return S * (1 + inc), inc


def s_fail(S, D, R):
    return np.minimum(S, W[11] * D ** (-W[12]) * ((S + 1) ** W[13] - 1) * np.exp(W[14] * (1 - R)))


# tier parameters [M]=from R10, [J]=judgement, [P]=pilot must measure
TIERS = {
    #     share  D    S0(d) fanout median/mean  credit w  min/review  lapse extra  hook min
    "K": dict(D=7.0, S0=4.0, fo_med=16, fo_mean=25.5, w=0.5, rev=3.0, lapse=6.0, hook=0.75),
    "S": dict(D=6.5, S0=3.0, fo_med=3, fo_mean=9.7, w=0.4, rev=1.3, lapse=2.5, hook=0.4),
    "C": dict(D=5.5, S0=3.0, fo_med=9, fo_mean=10.7, w=0.25, rev=0.5, lapse=0.8, hook=0.15),
}


def simulate(per_day, course_days, post_days=365, r=0.90, encompass=True, bundle=True,
             post_use_rate=1 / 45, post_use_share=0.35, use_span=150, seed=1,
             init_retrieval=True, s0_mult=1.0, sinc_mult=1.0, cost_mult=1.0, hooks_per_use=0.6,
             r_tier=None):
    rng = np.random.default_rng(seed)
    tiers, learn = [], []
    for d in range(course_days):
        for t, n in per_day.items():
            k = int(n) + (rng.random() < n - int(n))
            tiers += [t] * k
            learn += [d] * k
    tiers = np.array(tiers)
    learn = np.array(learn)
    N = len(tiers)
    D = np.array([TIERS[t]["D"] for t in tiers])
    S = np.array([TIERS[t]["S0"] for t in tiers], float)
    if init_retrieval:  # same-day closed-book rebuild + next-morning sleep-timed relearning
        S *= 1.6
    S *= s0_mult
    rr = np.array([(r_tier or {}).get(t, r) for t in tiers])
    last = learn.astype(float)
    due = learn + interval(S, rr)
    wcred = np.array([TIERS[t]["w"] for t in tiers])
    rev = np.array([TIERS[t]["rev"] for t in tiers]) * cost_mult
    lapse = np.array([TIERS[t]["lapse"] for t in tiers])
    hook = np.array([TIERS[t]["hook"] for t in tiers]) * cost_mult
    isK, isS = tiers == "K", tiers == "S"
    # implicit use events during the course: count ~ lognormal(median, mean), times ~ exp(span)
    T = course_days + post_days
    events = [[] for _ in range(T)]
    if encompass:
        for i in range(N):
            p = TIERS[tiers[i]]
            mu = np.log(p["fo_med"])
            sig = np.sqrt(max(2 * (np.log(p["fo_mean"]) - mu), 0.01))
            # a module that uses the item yields ~0.6 retrieval hooks on it [J]
            n = rng.poisson(hooks_per_use * rng.lognormal(mu, sig))
            ts = learn[i] + 2 + rng.exponential(use_span, n)
            for tt in ts[ts < course_days]:
                events[int(tt)].append(i)
        # after the course: projects, articles, interviews keep using a share of K and S
        users = np.where((isK | isS) & (rng.random(N) < post_use_share))[0]
        for i in users:
            tt = course_days + rng.exponential(1 / post_use_rate)
            while tt < T:
                events[int(tt)].append(i)
                tt += rng.exponential(1 / post_use_rate)
    # bundle: each S attached to a K learned the same day
    attach = {}
    if bundle:
        for d in range(course_days):
            ks = np.where((learn == d) & isK)[0]
            ss = np.where((learn == d) & isS)[0]
            if len(ks):
                for s in ss:
                    attach.setdefault(int(rng.choice(ks)), []).append(int(s))
    out = dict(exp_min=np.zeros(T), imp_min=np.zeros(T), new=np.zeros(T), n_exp=np.zeros(T),
               lapses=np.zeros(T), meanR=np.zeros(T))
    per_item = np.zeros(N)
    probe = {180: [], 365: []}
    probe_days = {}
    for a in probe:
        for i in range(N):
            probe_days.setdefault(int(learn[i]) + a, []).append((a, i))

    def review(idx, credit, cost_ok, today, kind):
        idx = np.asarray(idx, int)
        if len(idx) == 0:
            return
        R = R_of(today - last[idx], S[idx])
        ok = rng.random(len(idx)) < R
        Sn, _ = s_success(S[idx], D[idx], R)
        Sn = S[idx] + sinc_mult * (Sn - S[idx])
        Sn = S[idx] + credit * (Sn - S[idx])
        Sf = s_fail(S[idx], D[idx], R)
        S[idx] = np.where(ok, Sn, Sf)
        # a failed hook is relearned on the spot (lapse cost); it counts as a lapse
        last[idx] = today
        due[idx] = today + interval(S[idx], rr[idx])
        cost = cost_ok + np.where(ok, 0, lapse[idx])
        out[kind][today] += cost.sum()
        np.add.at(per_item, idx, cost)
        out["lapses"][today] += (~ok).sum()

    for today in range(T):
        out["new"][today] = (learn == today).sum()
        # 1) implicit hooks (only for learned items whose R <= 0.95: otherwise no hook)
        ev = np.array(sorted(set(events[today])), int)
        if len(ev):
            ev = ev[learn[ev] < today]
            Rv = R_of(today - last[ev], S[ev])
            ev = ev[Rv <= 0.95]
            review(ev, wcred[ev], hook[ev], today, "imp_min")
        # 2) explicit reviews for items due
        dd = np.where((due <= today) & (learn < today))[0]
        out["n_exp"][today] = len(dd)
        review(dd, 1.0, rev[dd], today, "exp_min")
        # 3) bundle hooks for S attached to K reviewed today
        if bundle and len(dd):
            att = [s for k in dd[isK[dd]] for s in attach.get(int(k), [])]
            att = np.array(att, int)
            if len(att):
                att = att[(R_of(today - last[att], S[att]) <= 0.95) & (due[att] > today)]
                review(att, 0.7, np.full(len(att), 0.5), today, "exp_min")
        L = learn < today
        out["meanR"][today] = R_of(today - last[L], S[L]).mean() if L.any() else 1
        for a, i in probe_days.get(today, []):
            probe[a].append(R_of(today - last[i], S[i]))
    out["probe"] = {a: (np.mean(v) if v else np.nan, np.quantile(v, 0.05) if v else np.nan)
                    for a, v in probe.items()}
    out["N"] = N
    out["per_item"] = per_item
    out["tiers"] = tiers
    return out


def monthly(out, T, days=30):
    rows = []
    for m in range(0, T, days):
        sl = slice(m, min(m + days, T))
        rows.append((m // days + 1, out["exp_min"][sl].mean(), out["imp_min"][sl].mean(),
                     out["n_exp"][sl].mean(), out["meanR"][sl].mean()))
    return rows


def report(name, out, course_days, post=365):
    T = course_days + post
    e, i = out["exp_min"], out["imp_min"]
    print(f"\n=== {name}: N items {out['N']}, course {course_days} d ===")
    tot_e, tot_i = e.sum() / 60, i.sum() / 60
    print(f"total explicit {tot_e:.0f} h, implicit hooks {tot_i:.0f} h (during course "
          f"{e[:course_days].sum()/60:.0f}+{i[:course_days].sum()/60:.0f} h)")
    print(f"min/item to 12 mo post-course: {(e.sum()+i.sum())/out['N']:.1f}")
    print(f"peak month explicit+hook min/day: "
          f"{max(r[1]+r[2] for r in monthly(out, T)):.0f}")
    last90 = slice(course_days - 90, course_days)
    print(f"last 90 course days: explicit {e[last90].mean():.0f} + hooks {i[last90].mean():.0f} min/day")
    for lab, sl in [("post m1-3", slice(course_days, course_days + 90)),
                    ("post m10-12", slice(course_days + 270, course_days + 365))]:
        print(f"{lab}: explicit {e[sl].mean():.0f} + hooks {i[sl].mean():.0f} min/day; "
              f"lapses/day {out['lapses'][sl].mean():.1f}")
    for a, (m, q) in out["probe"].items():
        print(f"recall {a} d after learning: mean {m:.3f}, 5th pct {q:.3f}")
    for t in "KSC":
        m = out["tiers"] == t
        print(f"  tier {t}: {out['per_item'][m].mean():.1f} min/item to 12 mo post-course")
    print(f"mean R over all learned items at course end: {out['meanR'][course_days-1]:.3f}")
    return monthly(out, T)


if __name__ == "__main__":
    # Scenario A, R10 pace: 13,600 items (K 31 / S 35 / C 34 %) in ~800 study days ~ 17 items/day
    A = dict(K=5.3, S=6.0, C=5.7)
    # Scenario B, the stated pace: 17 R8-CRs/day, each CR = 1.53 K + 1.73 S + 1.70 C items
    B = dict(K=26.0, S=29.4, C=28.9)
    res = {}
    cfg = [
        ("A_r90_full", A, 800, dict()),
        ("A_r90_noencompass", A, 800, dict(encompass=False, bundle=False)),
        ("A_r85_full", A, 800, dict(r=0.85)),
        ("A_r95_full", A, 800, dict(r=0.95)),
        ("B_r90_full", B, 162, dict()),
        # optimistic memory for well-understood, schema-integrated items (lesson + forge +
        # notebook): S0 x2, stability gain x1.3 [J; pilot must fit FSRS weights on his own data]
        ("A_r90_schema", A, 800, dict(s0_mult=2.0, sinc_mult=1.3)),
        ("A_r80_schema", A, 800, dict(r=0.80, s0_mult=2.0, sinc_mult=1.3)),
        # BEST design: schema memory + composite interleaved tasks (one 5-min task retrieves
        # ~3 items -> cost x0.6) + designed recall-first hooks (1.5 per using module)
        # + per-tier target K .90 / S .87 / C .85
        ("A_best", A, 800, dict(s0_mult=2.0, sinc_mult=1.3, cost_mult=0.6, hooks_per_use=1.5,
                                r_tier=dict(K=0.90, S=0.87, C=0.85))),
        ("A_best_r90all", A, 800, dict(s0_mult=2.0, sinc_mult=1.3, cost_mult=0.6, hooks_per_use=1.5)),
        ("A_best_fsrsdefault", A, 800, dict(cost_mult=0.6, hooks_per_use=1.5,
                                r_tier=dict(K=0.90, S=0.87, C=0.85))),
        ("B_best", B, 162, dict(s0_mult=2.0, sinc_mult=1.3, cost_mult=0.6, hooks_per_use=1.5,
                                r_tier=dict(K=0.90, S=0.87, C=0.85))),
        ("B_r90_noencompass", B, 162, dict(encompass=False, bundle=False)),
    ]
    import sys
    only = sys.argv[1:] or [c[0] for c in cfg]
    for name, pdy, days, kw in cfg:
        if name not in only:
            continue
        out = simulate(pdy, days, **kw)
        res[name] = report(name, out, days)
        print("month | explicit min/d | hook min/d | explicit items/d | mean R")
        for row in res[name]:
            if row[0] % 3 == 1 or row[0] <= 6:
                print(" %3d | %6.0f | %5.0f | %5.0f | %.3f" % row)
