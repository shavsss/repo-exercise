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
# Reconciled staged plan (v2, after the red team R_redteam.md).
# E2 hours (35k P50) are the road to PRINCIPAL in each domain, summed domain by domain.
# The red team built 'expert' from E3's expert-path labs (6,265 h) and got wave-1 expert at ~38 months.
# Both are right about different levels, so the model now has three milestones per wave:
#   senior    = wave curriculum + SEN of the wave's expert work, plus 1 external signal
#   expert    = wave curriculum + expert work: E3 expert-path lab hours x (1 + research overhead)
#               (papers, customers, iteration, write-up, mentors: 0.5 / 0.9 / 1.4 [J]),
#               then an external-validation lag (review/acceptance cycle) of 3 / 6 / 10 months [J]
#               that runs in parallel with the next wave (it delays the milestone, not the work)
#   principal = E2 hours for the domain (at least the expert hours); the remainder after 'expert'
#               is done as a 30% 'deepening' share while the next waves take 70% [J]
# Red-team changes that add time: ~40 hand derivations per wave (~120 h wave 1) [R], mentors and
# mock quals (~80 h per wave) [R], one full hardware cycle in wave 1 (~300 h) [R]: ADD_H below.
# ---------------------------------------------------------------------------
CURR_SHARE = {1: 0.38, 2: 0.37, 3: 0.25}
ADD_H = {1: 120 + 80 + 300, 2: 100 + 80, 3: 80 + 80}
LAB_PATH = 6265 / 7375  # expert-path share of E3 lab hours
lab_by_dom = {}
if labs:
    for x in labs["domains"]:
        lab_by_dom[x["domain"]] = x["hours"] * LAB_PATH
WAVE = {d["id"]: d["wave"] for d in doms}


def staged(scn):
    keys = [(w, m) for w in (1, 2, 3) for m in ("senior", "expert", "principal")]
    out = {k: [] for k in keys}
    for _ in range(N):
        efh = tri(5.6, 6.3, 7.0) * 24.5
        cur_h = curr_m(random.gauss(0, 1)) * 6.3 * 24.5
        zs = random.gauss(0, 1)
        ai = tri(0.8, 1.0, 1.3)
        ov = tri(0.05, 0.15, 0.30)
        sen = tri(0.35, 0.45, 0.55)
        rov = tri(0.5, 0.9, 1.4)
        lag = tri(3, 6, 10)
        exp_h = {1: 0.0, 2: 0.0, 3: 0.0}
        pri_h = {1: 0.0, 2: 0.0, 3: 0.0}
        for d in doms:
            w = d["wave"]
            z = 0.6 * zs + 0.8 * random.gauss(0, 1)
            e2h = lognorm_from(*hours(d))(z) * ai * (1 - ov)
            eh = lab_by_dom.get(d["id"], 0.3 * e2h) * (1 + rov) * ai
            exp_h[w] += eh
            pri_h[w] += max(0.0, e2h - eh)
        for w in (1, 2, 3):
            exp_h[w] += ADD_H[w]
        # work queue: stage tasks per wave (main share), deepening pool (side share)
        t = 0.0
        pool = 0.0
        pool_owner = []  # (wave, hours remaining) in order
        done_pri = {}

        def rate(t):
            f = max(0.55, 0.93 ** (t / 12)) if scn == "ai_trend" else 1.0
            cap = efh + (2 * 24.5 * 0.85 if scn == "paid" and t > 24 else 0.0)
            return cap / f  # hours of 'estimated work' per month

        def run(main_h, t):
            # run main_h of main-stage work; deepening pool gets 30% when it has work
            nonlocal pool_owner
            while main_h > 1e-6:
                r = rate(t)
                share = 0.7 if pool_owner else 1.0
                step = min(1.0, main_h / (r * share))
                main_h -= step * r * share
                side = step * r * (1 - share)
                while side > 1e-9 and pool_owner:
                    w, h = pool_owner[0]
                    use = min(side, h)
                    side -= use
                    h -= use
                    if h <= 1e-6:
                        pool_owner.pop(0)
                        done_pri[w] = t + step
                    else:
                        pool_owner[0] = (w, h)
                t += step
            return t
        for w in (1, 2, 3):
            t = run(CURR_SHARE[w] * cur_h, t)
            t_s = run(sen * exp_h[w], t)
            t = run((1 - sen) * exp_h[w], t_s)
            out[(w, "senior")].append(t_s)
            out[(w, "expert")].append(t + lag)
            pool_owner.append((w, pri_h[w]))
        # after wave 3, all capacity to the pool
        while pool_owner:
            r = rate(t)
            w, h = pool_owner[0]
            step = min(1.0, h / r)
            h -= step * r
            t += step
            if h <= 1e-6:
                pool_owner.pop(0)
                done_pri[w] = t
            else:
                pool_owner[0] = (w, h)
        for w in (1, 2, 3):
            out[(w, "principal")].append(done_pri[w])
    return out


for scn in ("base", "ai_trend", "paid"):
    o = staged(scn)
    print(f"\n=== Staged waves, scenario '{scn}' (months from today) ===")
    for w in (1, 2, 3):
        for m in ("senior", "expert", "principal"):
            print(line(f"wave {w} {m}", o[(w, m)]))
    if scn == "base":
        for m in (24, 36, 48, 60):
            print(f"  P(wave 1 expert <= {m}) = {sum(x <= m for x in o[(1, 'expert')]) / N:.2f}")
        for m in (60, 72, 96, 120):
            print(f"  P(all waves senior <= {m}) = {sum(x <= m for x in o[(3, 'senior')]) / N:.2f}")
