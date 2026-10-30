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
tot10 = [t * 6.3 / 7.3 for t in res["total"]]
print("\n" + line("EVERYTHING at 10 h/day (EFH x 7.3/6.3)", tot10))

# ---------------------------------------------------------------------------
# Staged plan: waves in order (E2 'wave' field), curriculum interleaved by wave.
# Curriculum share per wave [J]: wave 1 (backbone + sensing/EW/PNT) 0.38, wave 2 0.37, wave 3 0.25.
# Milestones per wave: 'senior' = curriculum of the wave + SENIOR_SHARE of its expert-track hours,
# 'expert' = all of them. SENIOR_SHARE 0.30 / 0.40 / 0.50 [J] (senior is reached well before expert;
# industry ladders put senior at ~5 y and principal at ~10–15 y, i.e. ~40% of the way [estimate]).
# Scenarios:
#   base      E2 hours as estimated (they already assume AI saves 30–50% on software work)
#   ai_trend  agents keep improving: the hours of month m are multiplied by max(0.55, 0.93**(m/12)) [J]
#             (METR task horizon doubling ~4–7 months; we assume only a 7%/yr gain in his hours,
#             because framing, verification, bench and field time do not shrink with agents)
#   paid      from the start of wave 2, 30% of expert-track hours are done as paid project work
#             (products, contracts) that adds 2 h/day of capacity he would not study otherwise [J]
# ---------------------------------------------------------------------------
CURR_SHARE = {1: 0.38, 2: 0.37, 3: 0.25}


def staged(scn):
    out = {(w, m): [] for w in (1, 2, 3) for m in ("senior", "expert")}
    for _ in range(N):
        zc = random.gauss(0, 1)
        efh = tri(5.6, 6.3, 7.0) * 24.5
        cur_h = curr_m(zc) * 6.3 * 24.5
        zs = random.gauss(0, 1)
        ai = tri(0.8, 1.0, 1.3)
        ov = tri(0.05, 0.15, 0.30)
        ss = tri(0.30, 0.40, 0.50)
        ext = {1: 0.0, 2: 0.0, 3: 0.0}
        for d in doms:
            z = 0.6 * zs + 0.8 * random.gauss(0, 1)
            ext[d["wave"]] += lognorm_from(*hours(d))(z) * ai * (1 - ov)
        t = 0.0  # months

        def spend(h, t):
            # advance time t (months) by h effective hours under the scenario
            while h > 1e-6:
                cap = efh
                if scn == "paid" and t >= t_w2:
                    cap = efh + 2 * 24.5 * 0.85
                f = max(0.55, 0.93 ** (t / 12)) if scn == "ai_trend" else 1.0
                step = min(1.0, h * f / cap)
                h -= step * cap / f
                t += step
            return t
        t_w2 = 1e9
        for w in (1, 2, 3):
            if w == 2:
                t_w2 = t
            t = spend(CURR_SHARE[w] * cur_h, t)
            t_sen = spend(ss * ext[w], t)
            t = spend((1 - ss) * ext[w], t_sen)
            out[(w, "senior")].append(t_sen)
            out[(w, "expert")].append(t)
    return out


for scn in ("base", "ai_trend", "paid"):
    o = staged(scn)
    print(f"\n=== Staged waves, scenario '{scn}' (months from today) ===")
    for w in (1, 2, 3):
        for m in ("senior", "expert"):
            print(line(f"wave {w} {m}", o[(w, m)]))
