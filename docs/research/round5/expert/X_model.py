"""Round 5 time model: the level-2.5 curriculum (round3 F model) plus the expert track.

Run: python3 -I X_model.py > X_model.out   (from this folder)
Inputs: E2_domain_targets.json (extra_hours per domain, role), E3_practice_track.json (lab hours, cross-check).

Model (all in effective learning hours, EFH):
- Curriculum: lognormal fitted to F_model.out, 8 h + 1 phone hour: P10 23.5 / P50 28.5 / P90 35.4 months.
  Converted to hours with the same monthly capacity, so it shares the capacity draw.
- Expert track: sum over domains of extra_hours (lognormal from p10/p50/p90 per domain), with one shared
  "optimism" factor (correlation between domains, since one estimator wrote them all).
- Overlap: share of expert-track hours that also serve the curriculum (projects that replace reading
  of the same material, AI-run checks that replace review). Range 0.05 / 0.15 / 0.30 [J].
- AI leverage on the expert track: the estimates in E2 already assume AI agents write code and run tools.
  A further factor 0.8 / 1.0 / 1.3 covers how much faster or slower AI-run work is than estimated
  (METR 2025 found experienced developers 19% slower with AI on familiar code) [J].
- Capacity: EFH per month = EFH/day x study days. EFH/day at 8 h + 1 h phone: 5.6 / 6.3 / 7.0 (R9 curve),
  study days 24.5 per month (6-day week, light Fridays, lost days are inside the F fit).
  For the extra track, the phone hour is excluded (labs are desk/bench work): 5.0 / 5.6 / 6.2.
- Waves: wave 1 = deep domains of wave 1 + backbone. Its curriculum share comes from F (backbone + wave-1
  books ~ 0.38 of all curriculum hours) [estimate from F_curriculum segment pages].
"""
import json, math, os, random, statistics as st

HERE = os.path.dirname(os.path.abspath(__file__))
random.seed(5)
N = 6000
Z90 = 1.2815515655446004


def lognorm_from(p10, p50, p90):
    """Draw from a skewed lognormal matching P50 and the wider of the two tails."""
    p10 = max(p10, 1e-6)
    s = max(math.log(p90 / p50), math.log(p50 / p10)) / Z90
    return lambda z: p50 * math.exp(s * z)


def tri(a, m, b):
    return random.triangular(a, b, m)


def pct(xs, q):
    xs = sorted(xs)
    return xs[min(len(xs) - 1, int(q * len(xs)))]


doms = json.load(open(os.path.join(HERE, "E2_domain_targets.json")))
labs = None
try:
    labs = json.load(open(os.path.join(HERE, "E3_practice_track.json")))
except Exception:
    pass

W1_KEYS = ("Radar", "Electronic warfare", "Positioning", "Antennas", "Signals and systems",
           "Control and estimation", "Mathematics foundations", "Foundations: the quantitative")


def wave1(d):
    return any(k in d["id"] for k in W1_KEYS)


def hours(d):
    h = d["extra_hours_estimate"]
    return float(h["p10"]), float(h["p50"]), float(h["p90"])


curr_m = lognorm_from(23.5, 28.5, 35.4)

res = {k: [] for k in ("total", "curr", "extra", "w1", "w1_extra_h", "extra_h", "senior_all")}
for _ in range(N):
    zc = random.gauss(0, 1)
    efh_cur = tri(5.6, 6.3, 7.0) * 24.5
    efh_lab = efh_cur * (5.6 / 6.3)
    cur_months = curr_m(zc)
    cur_h = cur_months * 6.3 * 24.5  # F fit is in calendar months at the mode capacity
    zshared = random.gauss(0, 1)
    ai = tri(0.8, 1.0, 1.3)
    ov = tri(0.05, 0.15, 0.30)
    ext = 0.0
    ext_w1 = 0.0
    for d in doms:
        z = 0.6 * zshared + 0.8 * random.gauss(0, 1)
        x = lognorm_from(*hours(d))(z) * ai
        ext += x
        if wave1(d):
            ext_w1 += x
    ext_net = ext * (1 - ov)
    months_cur = cur_h / efh_cur
    months_ext = ext_net / efh_lab
    res["curr"].append(months_cur)
    res["extra"].append(months_ext)
    res["total"].append(months_cur + months_ext)
    res["extra_h"].append(ext)
    res["w1_extra_h"].append(ext_w1)
    res["w1"].append(0.38 * months_cur + ext_w1 * (1 - ov) / efh_lab)


def line(name, xs, unit="months"):
    return f"  {name:<38} P10 {pct(xs, .1):7.1f}  P50 {pct(xs, .5):7.1f}  P90 {pct(xs, .9):7.1f}  {unit}"


print("=== Round 5 time model (N = %d) ===" % N)
print(f"domains: {len(doms)}, wave-1 deep: {sum(wave1(d) for d in doms)}")
roles = {}
for d in doms:
    roles[d.get("role", "?")] = roles.get(d.get("role", "?"), 0) + 1
print("roles:", roles)
s50 = sum(hours(d)[1] for d in doms)
print(f"sum of domain P50 extra hours (as estimated): {s50:,.0f} h")
print(line("curriculum (F, 8 h + 1 phone)", res["curr"]))
print(line("expert track hours (gross)", res["extra_h"], "h"))
print(line("expert track months (net of overlap)", res["extra"]))
print(line("EVERYTHING to target", res["total"]))
print(line("wave 1 at expert (backbone + wave 1)", res["w1"]))
print(line("wave-1 expert-track hours", res["w1_extra_h"], "h"))
for m in (36, 48, 60, 72, 84):
    p = sum(t <= m for t in res["total"]) / N
    print(f"  P(everything <= {m} months) = {p:.2f}")
for m in (12, 18, 24, 30):
    p = sum(t <= m for t in res["w1"]) / N
    print(f"  P(wave 1 expert <= {m} months) = {p:.2f}")

print("\n=== Per role, P50 extra hours (as estimated) ===")
for r in sorted(roles):
    print(f"  {r:<12} {sum(hours(d)[1] for d in doms if d.get('role') == r):9,.0f} h")

print("\n=== Top 12 domains by P50 extra hours ===")
for d in sorted(doms, key=lambda d: -hours(d)[1])[:12]:
    p10, p50, p90 = hours(d)
    print(f"  {d['id']:<70} {d.get('role','?'):<11} {p10:6.0f} {p50:6.0f} {p90:6.0f}")

if labs:
    try:
        lab_h = labs.get("total_lab_hours") if isinstance(labs, dict) else None
        print(f"\nE3 cross-check: total lab hours reported by E3 = {lab_h}")
    except Exception:
        pass

# Scenario: what if he studies 10 h/day (EFH 7.3 mode) — the 'strong individual' line in F.
tot10 = []
for i in range(N):
    tot10.append(res["total"][i] * 6.3 / 7.3)
print("\n" + line("EVERYTHING at 10 h/day (EFH x 7.3/6.3)", tot10))
