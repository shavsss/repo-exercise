"""Throughput model for directions D3 (Structure Atlas First) and D4 (Dual Track).
Reads the two syllabi (read-only), applies explicit assumptions, prints weeks to finish.
Run: python3 -I A5_throughput_model.py  [all assumptions are constants below]"""
import json, collections
LIB = "/home/user/repo-exercise/library"
E = json.load(open(f"{LIB}/engineering/syllabus/syllabus.json"))["modules"]
L = json.load(open(f"{LIB}/military/syllabus/syllabus.json"))["modules"]

# ---- assumptions ---------------------------------------------------------
CR = {"core": 3.5, "adv": 3.0, "ref": 1.5}      # central results per module
CR_PER_LESSON = 2.0                              # depth-dense lesson carries <=2 CRs (V2 rule)
LESSON_DAYS_PER_WEEK = 5                         # + 1 consolidation day + 1 rest
HOURS_PER_DAY = 5.0
# share of each part's CRs that are instances of an atlas structure
FS_E = dict(P11=.5,P12=.6,P13=.6,P14=.7,P15=.6,P16=.5,P17=.6,P18=.6,P19=.6,P20=.3,P21=.3,
            P22=.2,P23=.8,P24=.5,P25=.3,P26=.2,P27=.3)
FS_L = dict(P1=.8,P2=.8,P3=.7,P4=.8,P5=.7,P6=.8,P7=.6,P8=.3,P9=.5,P10=.7,P11=.4,P12=.1,P13=.6)
ATLAS_E = {f"P{i}" for i in range(0, 11)}       # Gilua P0-P10 are absorbed into the atlas
ATLAS_L = {"P0"}                                 # Lanchester P0 (tools) absorbed too

def run(tiers, label):
    mods = [("E", m) for m in E] + [("L", m) for m in L]
    mods = [(a, m) for a, m in mods if m["tier"] in tiers]
    atlas_cr = sum(CR[m["tier"]] for a, m in mods
                   if (a == "E" and m["part"] in ATLAS_E) or (a == "L" and m["part"] in ATLAS_L))
    inst = [(a, m) for a, m in mods
            if not ((a == "E" and m["part"] in ATLAS_E) or (a == "L" and m["part"] in ATLAS_L))]
    tot_cr = sum(CR[m["tier"]] for _, m in mods)
    print(f"\n=== {label}: {len(mods)} modules, {tot_cr:.0f} central results "
          f"({atlas_cr:.0f} in atlas-source parts, {len(inst)} instance modules)")

    # ---- D3 --------------------------------------------------------------
    for name, cs, cd, atl_lessons in [("D3 optimistic", .55, .15, 220),
                                      ("D3 central",    .45, .10, 240),
                                      ("D3 pessimistic",.30, .05, 270)]:
        inst_cr_eff = 0.0
        for a, m in inst:
            f = (FS_E if a == "E" else FS_L).get(m["part"], .3)
            inst_cr_eff += CR[m["tier"]] * (f * (1 - cs) + (1 - f) * (1 - cd))
        inst_lessons = inst_cr_eff / CR_PER_LESSON
        # atlas lesson 80 min incl. drills; instance lesson 55 min; 1.0 h/day review+production
        h = atl_lessons * 80 / 60 + inst_lessons * 55 / 60
        lesson_h_per_week = (HOURS_PER_DAY - 1.0) * LESSON_DAYS_PER_WEEK
        print(f"  {name:15s} atlas {atl_lessons} + instance {inst_lessons:4.0f} lessons = "
              f"{h:4.0f} h -> {h/lesson_h_per_week:4.1f} weeks ({h/lesson_h_per_week/4.33:3.1f} months)")

    # ---- D4 --------------------------------------------------------------
    for name, reuse, fast_min, fast_h in [("D4 optimistic", .20, 38, 3.0),
                                          ("D4 central",    .15, 45, 3.0),
                                          ("D4 pessimistic",.10, 55, 2.75)]:
        lessons = tot_cr * (1 - reuse) / CR_PER_LESSON
        h = lessons * fast_min / 60
        print(f"  {name:15s} fast {lessons:4.0f} lessons x {fast_min} min = {h:4.0f} h at "
              f"{fast_h} h/day -> {h/(fast_h*LESSON_DAYS_PER_WEEK):4.1f} weeks "
              f"({h/(fast_h*LESSON_DAYS_PER_WEEK)/4.33:3.1f} months); "
              f"lessons/day = {fast_h*60/fast_min:.1f}")

    # baseline: today's page-driven lessons (15 pp per lesson, 65 min each, 3/day)
    pages = 0
    for a, m in mods:
        pages += sum(s["pages"][1] - s["pages"][0] + 1 for s in m["sources"]
                     if s.get("role") == "main" and s.get("pages"))
    bl = pages / 15
    print(f"  baseline (V2, page-driven): {pages} pp / 15 = {bl:.0f} lessons, 3/day -> "
          f"{bl/3/LESSON_DAYS_PER_WEEK:.0f} weeks ({bl/3/LESSON_DAYS_PER_WEEK/4.33:.1f} months)")

run({"core"}, "CORE only")
run({"core", "adv"}, "CORE + ADV")
run({"core", "adv", "ref"}, "ALL tiers")

# ---- hard floor and the hybrid ------------------------------------------
print("\n=== Floors and hybrid")
for tiers, label in [({"core"}, "core"), ({"core", "adv", "ref"}, "all")]:
    mods = [m for m in E + L if m["tier"] in tiers]
    cr = sum(CR[m["tier"]] for m in mods)
    words = cr * 2000                       # ~2,000 words per CR keeps all 7 depth sections (~285 w each)
    h = words / 175 / 60                    # 175 wpm dense Hebrew technical text
    print(f"  reading-only floor ({label}): {cr:.0f} CR x 2000 w = {words/1e6:.2f}M words = {h:.0f} h "
          f"-> {h/(4*5):.1f} weeks at 4 h/day x 5 ({h/20/4.33:.1f} months)")
# Hybrid: D3 atlas (220 x 80 min) + instance lessons in D4 fast format (38 min) + D4 forge
for label, inst in [("core", 270), ("all", 362)]:
    h = 220 * 80 / 60 + inst * 38 / 60
    print(f"  hybrid atlas+fast-instance ({label}): {h:.0f} h at 3.25 h/day x 5 -> "
          f"{h/16.25:.1f} weeks ({h/16.25/4.33:.1f} months)")
