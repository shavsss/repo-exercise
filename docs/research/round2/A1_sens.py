"""A1 part 5: sensitivity (tornado), hour breakdown, floors, and the required hours/day per deadline.
Uses the model in A1_sim.py. Deterministic runs pin every range at its low end, midpoint or high end."""
import random, os, json
import A1_sim as M

class Pin(random.Random):
    """rng whose uniform(a, b) returns a fixed quantile; used for deterministic what-ifs."""
    def __init__(self, q=0.5, over=None):
        super().__init__(0); self.q = q; self.over = over or {}
    def uniform(self, a, b):
        for (lo, hi), q in self.over.items():
            if (a, b) == (lo, hi): return a + (b - a) * q
        return a + (b - a) * self.q

def det(policy, h, q=0.5, over=None):
    return M.run(policy, h, Pin(q, over))

L = {n.split()[0]: {**M.BASE, **c} for n, c in M.LADDER}
S6 = L["S6"]

if __name__ == "__main__":
    # 1. breakdown of learner hours at the midpoint
    print("== hour breakdown at midpoint (h independent) ==")
    for name in ("S0", "S2", "S3", "S4", "S5", "S6"):
        r = det(L[name], 5)
        print(f"  {name}: total {r['hours_total']:.0f} h, lessons {r['lessons']:.0f}")
    # component split for S0 and S5 by zeroing parts
    for name in ("S0", "S5"):
        pol = L[name]
        full = det(pol, 5)["hours_total"]
        nowait = det({**pol, "gen": "offline"}, 5)["hours_total"]
        print(f"  {name}: generation wait = {full - nowait:.0f} h")
    # lean lesson length actually implied
    P = M.PARAMS; mid = lambda k: sum(P[k]) / 2
    for app in ("eng", "mil"):
        n_sec = M.SEC[(app, "core")]; n_les = M.PAGES[(app, "core")] / 15
        fc = mid("f_central")
        w = (n_sec * fc * mid("w_central") + n_sec * (1 - fc) * mid("w_support")) / n_les + mid("w_frame")
        print(f"  lean lesson length {app}/core: {w:.0f} words per 15-page lesson; sections/lesson {n_sec/n_les:.2f}; central/lesson {n_sec*fc/n_les:.2f}")
    # 2. tornado on S6 at 5 h/day, months at P50-like midpoint
    base = det(S6, 5)["months"]
    print(f"\n== tornado: S6 (full depth + projects + review), 5 h/day, midpoint = {base:.1f} months ==")
    rows = []
    for k, rng_ in M.PARAMS.items():
        if not isinstance(rng_, tuple): continue
        lo = det(S6, 5, over={rng_: 0.0})["months"]; hi = det(S6, 5, over={rng_: 1.0})["months"]
        rows.append((abs(hi - lo), k, lo, hi))
    for d, k, lo, hi in sorted(rows, reverse=True):
        print(f"  {k:14s} low-end {lo:5.1f}  high-end {hi:5.1f}  swing {d:4.1f}")
    for lv in ("LOW", "MID", "HIGH"):
        M.DEDUP_LEVEL = lv
        print(f"  dedup estimate {lv:4s}: {det(S6, 5)['months']:.1f} months")
    M.DEDUP_LEVEL = "MID"
    for d in (5, 6, 7):
        M.PARAMS["days_per_week"] = d
        print(f"  study days/week {d}: {det(S6, 5)['months']:.1f} months")
    M.PARAMS["days_per_week"] = 6
    # 3. required hours/day per deadline (midpoint and optimistic floor)
    print("\n== hours/day needed to finish BOTH by deadline (6 days/wk) ==")
    designs = [("S5 full depth, no projects", L["S5"]), ("S6 full depth + projects", S6), ("S7 + test-out", L["S7"]),
               ("S8 adv as delta", L["S8"]), ("S9 core only", L["S9"]), ("S0 status quo", L["S0"])]
    out = {}
    for name, pol in designs:
        row = []
        for q, lab in ((0.0, "optimistic"), (0.5, "mid"), (1.0, "pessimistic")):
            # optimistic = every range at its time-minimising end
            over = {}
            for k, r in M.PARAMS.items():
                if isinstance(r, tuple):
                    shorter_at_low = k not in ("wpm",)
                    over[r] = (0.0 if shorter_at_low else 1.0) if q == 0.0 else ((1.0 if shorter_at_low else 0.0) if q == 1.0 else 0.5)
            hrs = det(pol, 5, over=over)["hours_total"]
            lost = 0.03 if q == 0 else (0.065 if q == .5 else 0.10)
            need = {T: hrs / (T * 6 * 52 / 12 * (1 - lost)) for T in (4, 6, 8, 12)}
            row.append((lab, hrs, need))
        out[name] = row
        for lab, hrs, need in row:
            print(f"  {name:28s} {lab:11s} {hrs:6.0f} h  " + "  ".join(f"{T}mo {v:4.1f}h/d" for T, v in need.items()))
    json.dump({k: [(a, b, c) for a, b, c in v] for k, v in out.items()}, open(os.path.join(M.CACHE, "A1_need.json"), "w"), indent=1)
