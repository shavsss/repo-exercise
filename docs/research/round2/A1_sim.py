"""A1 part 4: Monte Carlo schedule simulation for finishing BOTH curricula (Gilua + Lanchester).

All structural inputs come from the measured data (cache/A1_stats.json, A1_units.json, A1_results.json).
Behavioural parameters are ranges, sampled per run (uniform unless noted). Every assumption is listed in
PARAMS / the policy table and is printed with the results.

Unit of work
  * 'section' = a numbered contents section inside a taught range (measured: Gilua core 2,537 content
    sections, adv 808; Lanchester core 1,486 parsed + 639 imputed for unparsed books, adv 299 + 238).
  * A section is a CENTRAL result (gets the full 7-facet level-2.5 treatment) with probability f_central,
    otherwise SUPPORTING (definition/example/application: compact treatment).
Learner minutes per unit = reading (words / wpm) + active work (attempt, estimate, derivation skeleton,
own summary) + generation wait, then x (1 + review share) for spaced retrieval, / (1 - project share).

Depth metrics (per policy)
  D_t  treatment depth = share of central results that receive >= the full 2.5 word/attempt budget,
       relative to the status quo (status quo = 1.0 by definition for the tiers it teaches).
  R    end-of-course retention of central results (forgetting model below).
  D_r  retained depth = D_t x R, averaged over core+adv central results (adv weight = its share).
"""
import json, os, math, random, statistics as st, itertools, collections

HERE = os.path.dirname(os.path.abspath(__file__)); CACHE = os.path.join(HERE, "cache")
STATS = json.load(open(os.path.join(CACHE, "A1_stats.json")))
UNITS = json.load(open(os.path.join(CACHE, "A1_units.json")))
RED = json.load(open(os.path.join(CACHE, "A1_redundancy.json")))
DEDUP_LEVEL = os.environ.get("A1_DEDUP", "MID")   # LOW | MID | HIGH (HIGH is an upper bound, includes progression)

# ------------------------------------------------------------- measured structure
def measured():
    sec = collections.Counter(); pages = collections.Counter()
    for u in UNITS["units"]:
        if u["admin"]: continue
        sec[(u["app"], u["tier"])] += 1
    for x in UNITS["imputed"]:
        sec[("mil", x["tier"])] += x["units"]
    # teaching pages (main + supp; Lanchester articles counted at 25%: integrated into lessons, per syllabus)
    for app in ("eng", "mil"):
        P = STATS[app]["stats"]["pages"]
        for t in ("core", "adv"):
            p = P[t].get("main", 0) + P[t].get("supp", 0) + 0.25 * P[t].get("article", 0)
            pages[(app, t)] = p
    return sec, pages
SEC, PAGES = measured()
# re-taught share of content pages per app/tier (A1_redundancy.py)
def rep_share(app, tier, level=None):
    lv = RED[level or DEDUP_LEVEL]
    tot = RED["tot_app"].get(f"{app}/{tier}", 0)
    return lv["by"].get(f"{app}/{tier}", 0) / tot if tot else 0.0

# status-quo lesson facts (round-1 measurements, C_lesson_critique.md): Gilua 11.2-14.3k words, Lanchester 7.9-9.2k
SQ_WORDS = {"eng": (11000, 15000), "mil": (7900, 9200)}
PAGES_PER_LESSON = 15            # syllabus estimate used by both apps

PARAMS = dict(
    wpm=(150, 220),               # dense Hebrew technical reading
    hours=(4, 7),                 # study hours per study day (scenario grid overrides)
    days_per_week=6,
    lost_days=(0.03, 0.10),       # illness, travel, life
    f_central=(0.30, 0.50),       # share of sections that are central results
    w_central=(1300, 2200),       # words for a full 2.5 treatment of one central result (lean, no padding)
    w_support=(300, 550),         # words for a supporting section
    w_frame=(400, 700),           # per-lesson framing: refresh, roadmap, keep-box
    act_central=(12, 22),         # min of active work per central result (attempt, estimate, own summary)
    act_support=(2, 5),
    sq_active=(10, 25),           # min of active work per status-quo lesson (think + exercises as practised)
    gen_wait=(10, 25),            # min per lesson, in-page sequential
    review_share=(0.15, 0.25),    # spaced-retrieval time as share of new-study time
    delta_factor=(0.20, 0.40),    # cost of a delta lesson relative to a full one
    project_share=(0.10, 0.20),   # of study time spent on projects (when projects are on)
)

def U(rng, k):
    a, b = PARAMS[k]; return rng.uniform(a, b)

# ------------------------------------------------------------- retention model
def retention(months, review, rng):
    """Probability of recalling a central result at the end of the course.
    No review: power-law forgetting from ~0.85 after the lesson, half-life ~ 1-2 months for dense material
    read once, averaged over learning times spread uniformly across the course.
    With spaced retrieval (expanding intervals) plateau 0.80-0.90 (typical figure for well-run SRS)."""
    if review:
        return rng.uniform(0.80, 0.90)
    hl = rng.uniform(1.0, 2.0)           # months
    # average over age a ~ U(0, months): 0.85 * (1 + a/hl)^-0.8
    n = 50; tot = 0
    for i in range(n):
        a = months * (i + .5) / n
        tot += 0.85 * (1 + a / hl) ** -0.8
    return tot / n

# ------------------------------------------------------------- one run
def run(policy, hours, rng):
    """policy keys:
       lesson: 'sq' (status quo length) | 'lean' (concept budget)
       gen: 'seq' | 'pipe' | 'offline'
       dedup: bool, review: bool, projects: bool
       adv: 'full' | 'delta' | 'none'    (ref is never taught as lessons)
       testout: share of core sections skipped after a passed diagnostic (prior knowledge)"""
    wpm = U(rng, "wpm"); lost = U(rng, "lost_days")
    fc = U(rng, "f_central")
    minutes = 0.0; lessons = 0.0
    central_total = 0.0; central_full = 0.0
    adv_weight = 0.0
    for app in ("eng", "mil"):
        for tier in ("core", "adv"):
            n_sec = SEC[(app, tier)]; pages = PAGES[(app, tier)]
            if tier == "adv" and policy["adv"] == "none":
                central_total += n_sec * fc; continue
            scale = 1.0
            if policy["dedup"]:
                d = U(rng, "delta_factor")
                scale *= 1 - rep_share(app, tier) * (1 - d)
            if tier == "core" and policy.get("testout"):
                to = policy["testout"] if app == "mil" else policy["testout"] / 2
                scale *= 1 - to
            adv_scale = 1.0
            if tier == "adv" and policy["adv"] == "delta":
                adv_scale = U(rng, "delta_factor") * 1.5   # survey-level: ~30-60% of full cost
            n_les = pages / PAGES_PER_LESSON * scale * adv_scale
            nc = n_sec * fc * scale; ns = n_sec * (1 - fc) * scale
            if policy["lesson"] == "sq":
                w = rng.uniform(*SQ_WORDS[app])
                read = n_les * w / wpm
                act = n_les * U(rng, "sq_active")
            elif policy["lesson"] == "lean45":   # fixed 4-5k-word core lesson per 15 source pages + full active work
                read = n_les * rng.uniform(4000, 5000) / wpm
                act = (nc * U(rng, "act_central") + ns * U(rng, "act_support")) * adv_scale
            else:
                w_tot = (nc * U(rng, "w_central") + ns * U(rng, "w_support")) * adv_scale + n_les * U(rng, "w_frame")
                read = w_tot / wpm
                act = (nc * U(rng, "act_central") + ns * U(rng, "act_support")) * adv_scale
            g = {"seq": U(rng, "gen_wait"), "pipe": max(0.0, U(rng, "gen_wait") - 0.8 * (read / max(n_les, 1))) , "offline": 0.0}[policy["gen"]]
            wait = n_les * g
            m = read + act + wait
            minutes += m; lessons += n_les
            central_total += n_sec * fc
            full = 1.0 if tier == "core" or policy["adv"] == "full" else 0.35
            central_full += n_sec * fc * full
    if policy["review"]:
        minutes *= 1 + U(rng, "review_share")
    if policy["projects"]:
        minutes /= 1 - U(rng, "project_share")
    per_month = hours * 60 * PARAMS["days_per_week"] * 52 / 12 * (1 - lost)
    months = minutes / per_month
    D_t = central_full / central_total
    R = retention(months, policy["review"], rng)
    return dict(months=months, hours_total=minutes / 60, lessons=lessons, D_t=D_t, R=R, D_r=D_t * R)

def mc(policy, hours, n=2000, seed=1):
    rng = random.Random(seed)
    rs = [run(policy, hours, rng) for _ in range(n)]
    q = lambda k, f: sorted(r[k] for r in rs)[int(f * (n - 1))]
    return dict(p10=q("months", .1), p50=q("months", .5), p90=q("months", .9),
                hours=st.median(r["hours_total"] for r in rs), lessons=st.median(r["lessons"] for r in rs),
                D_t=st.median(r["D_t"] for r in rs), R=st.median(r["R"] for r in rs), D_r=st.median(r["D_r"] for r in rs))

BASE = dict(lesson="sq", gen="seq", dedup=False, review=False, projects=False, adv="full", testout=0)
LADDER = [
    ("S0 status quo (core+adv, 11-15k-word lessons, wait in page)", {}),
    ("S1 + pipelined in-page generation", dict(gen="pipe")),
    ("S2 + pre-generated offline (nightly)", dict(gen="offline")),
    ("S3 + lean concept-budget lessons (4-5k core, same central results)", dict(gen="offline", lesson="lean")),
    ("S3b variant: fixed 4-5k-word lessons + full active work", dict(gen="offline", lesson="lean45")),
    ("S4 + teach-once dedup (repeats -> delta lessons)", dict(gen="offline", lesson="lean", dedup=True)),
    ("S5 + spaced retrieval (review load)", dict(gen="offline", lesson="lean", dedup=True, review=True)),
    ("S6 + projects (10-20% of time)", dict(gen="offline", lesson="lean", dedup=True, review=True, projects=True)),
    ("S7 + Lanchester test-out 15% (Gilua 7.5%)", dict(gen="offline", lesson="lean", dedup=True, review=True, projects=True, testout=0.15)),
    ("S8 = S7 with adv tier as delta/survey", dict(gen="offline", lesson="lean", dedup=True, review=True, projects=True, testout=0.15, adv="delta")),
    ("S9 = S7 with adv tier deferred (core only)", dict(gen="offline", lesson="lean", dedup=True, review=True, projects=True, testout=0.15, adv="none")),
]

if __name__ == "__main__":
    print("measured sections", {f"{a}/{t}": round(v) for (a, t), v in SEC.items()})
    print("teaching pages", {f"{a}/{t}": round(v) for (a, t), v in PAGES.items()})
    print("dedup level", DEDUP_LEVEL, {f"{a}/{t}": round(rep_share(a, t), 3) for a in ("eng", "mil") for t in ("core", "adv")})
    out = {}
    print("\n== ladder (months p10/p50/p90 to finish both) ==")
    for h in (4, 5, 6, 7):
        for name, ch in LADDER:
            r = mc({**BASE, **ch}, h)
            out[f"{name}|{h}"] = r
            print(f"h={h} {name[:62]:62s} {r['p10']:5.1f} {r['p50']:5.1f} {r['p90']:5.1f}  hrs={r['hours']:6.0f} les={r['lessons']:5.0f} Dt={r['D_t']:.2f} R={r['R']:.2f} Dr={r['D_r']:.2f}")
    # one-at-a-time lever sizes from the S6 design (realistic, projects on), h = 5
    print("\n== lever sizes (hours of learner time removed vs status quo, h-independent) ==")
    sq = mc(BASE, 5)["hours"]
    lev = {}
    for name, ch in [("offline generation", dict(gen="offline")), ("pipelined generation", dict(gen="pipe")),
                     ("lean lessons", dict(lesson="lean")), ("dedup", dict(dedup=True)),
                     ("adv as delta", dict(adv="delta")), ("adv deferred", dict(adv="none")),
                     ("test-out 15%", dict(testout=0.15)), ("review (+)", dict(review=True)), ("projects (+)", dict(projects=True))]:
        r = mc({**BASE, **ch}, 5); lev[name] = sq - r["hours"]
        print(f"   {name:22s} {sq - r['hours']:+8.0f} h ({(sq - r['hours'])/sq:+.0%})")
    # marginal levers on top of each other (from S5 design)
    L = {n.split()[0]: {**BASE, **c} for n, c in LADDER}
    s5 = L["S5"]
    base5 = mc(s5, 5)["hours"]
    print(f"\n== marginal levers on top of S5 ({base5:.0f} h) ==")
    for name, ch in [("back to status-quo length", dict(lesson="sq")), ("no dedup", dict(dedup=False)),
                     ("in-page sequential gen", dict(gen="seq")), ("adv deferred", dict(adv="none")), ("test-out 15%", dict(testout=0.15))]:
        r = mc({**s5, **ch}, 5)
        print(f"   {name:28s} {r['hours'] - base5:+8.0f} h")
    # frontier: which (design, hours/day) finish in T months at P50 and P80 with D_t >= 0.95 and R >= 0.8
    print("\n== frontier: min hours/day to finish both at P50 / P80, depth kept (D_t>=0.95, R>=0.8) ==")
    designs = {
        "S5 full (core+adv), no projects": L["S5"],
        "S6 full + projects": L["S6"],
        "S6' as S6 but 4-5k fixed lessons": {**L["S6"], "lesson": "lean45"},
        "S7 full + projects + test-out": L["S7"],
        "S8 adv as delta (D_t<1)": L["S8"],
        "S9 core only (adv later)": L["S9"],
    }
    front = {}
    for dn, pol in designs.items():
        row = {}
        for T in (4, 6, 8, 12):
            best50 = best80 = None
            for h in [x / 2 for x in range(6, 25)]:   # 3.0 .. 12.0 h/day
                rng = random.Random(7); rs = [run(pol, h, rng) for _ in range(800)]
                ms = sorted(r["months"] for r in rs)
                if best50 is None and ms[400] <= T: best50 = h
                if best80 is None and ms[640] <= T: best80 = h
                if best80 is not None: break
            row[T] = (best50, best80)
        dt = mc(pol, 5)["D_t"]
        front[dn] = row
        print(f"   {dn:34s} D_t={dt:.2f}  " + "  ".join(f"{T}mo: {row[T][0]}/{row[T][1]}" for T in row))
    json.dump(dict(ladder=out, levers=lev, frontier={k: {str(t): v for t, v in r.items()} for k, r in front.items()}),
              open(os.path.join(CACHE, "A1_sim.json"), "w"), indent=1)
