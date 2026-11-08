"""Round 5, after the conversation of 30.10: what a monthly product costs in calendar months,
daily hours fixed at 8 h + 1 phone hour.

F_model.py (round3/final) cannot be re-run here: its retention curves (round3/I_work/ret_curves.npz)
are not in git. So this is the same arithmetic F uses for project hours, done directly:
  extra months = (product hours - hours already in F) x (1 - review credit) / desk capacity per month
F already holds 120 h of projects + 40 h of articles for the whole course (PARAMS proj_h, art_h).
Review credit: project work done from memory replaces explicit review, F's proj_credit 0.2/0.4/0.7,
capped at 30% of review; we use 0.2 (the low end, so the estimate is not optimistic).
Desk capacity: 6.3 EFH/day (R9, 8 h) x 24.5 study days = 154 h/month. The phone hour does not
carry product work.
Offset by lesson labs: when the month's product is built on the month's lessons, the level-3 `lab`
tasks of those lessons become product work instead of separate work. Range 0 / 0.25 / 0.4 [J].
Run: python3 -I X2_product.py > X2_product.out
"""
import random
random.seed(7)
N = 20000
IN_F = 160.0
CAP = 6.3 * 24.5
BASE = (23.5, 28.5, 35.4)  # F, everything, 8 + 1


def tri(a, m, b):
    return random.triangular(a, b, m)


def pct(xs, q):
    xs = sorted(xs)
    return xs[int(q * (len(xs) - 1))]


print("Months added to the 28.5-month plan (P10 / P50 / P90), 8 h + 1 phone hour")
for label, per_month in (("product ~15 h/month (the 10-15% slot)", (10, 15, 22)),
                         ("product ~25 h/month", (18, 25, 35)),
                         ("product ~40 h/month", (30, 40, 55))):
    add = []
    for _ in range(N):
        months = 28.5
        for _ in range(3):  # fixed point: longer course = more months of product
            h = tri(*per_month) * months
            extra = max(0.0, h - IN_F) * (1 - 0.2) * (1 - tri(0, 0.25, 0.4)) / (CAP * tri(0.9, 1.0, 1.1))
            months = 28.5 + extra
        add.append(extra)
    print(f"  {label:<40} +{pct(add, .1):.1f} / +{pct(add, .5):.1f} / +{pct(add, .9):.1f} months"
          f"  -> everything at P50 ~{28.5 + pct(add, .5):.1f}")
