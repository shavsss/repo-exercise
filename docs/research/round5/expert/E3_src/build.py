# -*- coding: utf-8 -*-
import json, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from data import EQUIP, DOMAINS, LEVELS, FX, VAT, OPTIONAL, GENERAL, DEFER_W1

TIER_RANK = {"min": 0, "rec": 1, "full": 2}
TIER_HE = {"min": "מינימלי", "rec": "מומלץ", "full": "מלא"}
WAVE_HE = {0: "רציף", 1: "גל 1", 2: "גל 2", 3: "גל 3", 4: "גל 4"}

def ils(usd, landed=True):
    return round(usd * FX * (VAT if landed else 1) / 10) * 10

order = sorted(DOMAINS, key=lambda d: (1 if d["wave"] == 0 else d["wave"]))
seen = set()
out_domains = []
tot_hours = 0
hours_by_wave = {}
hours_by_level = {}
expert_path = 0
core_w1 = [0]
seen.update(GENERAL)
for d in order:
    new_items, labs = [], []
    dh = 0
    for (lid, title, lvl, h, tools, eq, ai, ver, outp) in d["labs"]:
        for e in eq:
            assert e in EQUIP, e
            if e not in seen:
                seen.add(e); new_items.append(e)
        tier = max([EQUIP[e][2] for e in eq], key=lambda t: TIER_RANK[t]) if eq else "min"
        opt = OPTIONAL.get(lid, [])
        for e in opt:
            seen.add(e)
        if d["wave"] == 1 and lid not in DEFER_W1:
            core_w1[0] += h
        labs.append({"id": lid, "title": title, "level": lvl, "level_he": LEVELS[lvl], "hours": h,
                     "tools": tools, "equipment": eq, "tier_needed": tier, "optional_upgrades": opt,
                     "wave1_core": (d["wave"] == 1 and lid not in DEFER_W1),
                     "ai_role": ai, "verification": ver, "portfolio_output": outp})
        dh += h
        hours_by_level[lvl] = hours_by_level.get(lvl, 0) + h
        if lvl <= 4 or d["wave"] in (0, 1):
            expert_path += h
    w = d["wave"]
    hours_by_wave[w] = hours_by_wave.get(w, 0) + dh
    tot_hours += dh
    new_cost = sum(EQUIP[e][1] for e in new_items)
    all_items = sorted({e for l in labs for e in l["equipment"]})
    out_domains.append({"domain": d["key"], "domain_he": d["he"], "wave": w, "wave_he": WAVE_HE[w],
                        "required_real_build": d["build"], "hours": dh,
                        "new_equipment": new_items, "new_equipment_cost_usd": new_cost,
                        "new_equipment_cost_ils_landed": ils(new_cost),
                        "all_equipment": all_items,
                        "all_equipment_cost_usd": sum(EQUIP[e][1] for e in all_items),
                        "labs": labs})

unused = set(EQUIP) - seen
tiers = {}
for t in ("min", "rec", "full"):
    items = [k for k, v in EQUIP.items() if TIER_RANK[v[2]] <= TIER_RANK[t]]
    usd = sum(EQUIP[k][1] for k in items)
    tiers[t] = {"usd": usd, "ils_list": ils(usd, False), "ils_landed": ils(usd), "items": items}

# labs runnable per tier
lab_tier_hours = {"min": 0, "rec": 0, "full": 0}
for d in out_domains:
    for l in d["labs"]:
        for t in lab_tier_hours:
            if TIER_RANK[l["tier_needed"]] <= TIER_RANK[t]:
                lab_tier_hours[t] += l["hours"]

meta = {
  "title": "E3 practice track: AI-native labs per domain",
  "date": "2026-10-30",
  "fx_ils_per_usd": FX, "fx_mark": "evidence (moneyexchangerate.org, early Oct 2026)",
  "vat": VAT, "ils_landed_note": "USD x 3.05 x 1.18 VAT, shipping not included [estimate]",
  "levels": LEVELS,
  "lab_protocol": ["frame", "predict (number + interval)", "error budget", "AI builds (code, SCPI, processing)",
                   "known-case check", "measure", "compare to theory, residuals", "AI error log", "portfolio output"],
  "totals": {"domains": len(out_domains), "labs": sum(len(d["labs"]) for d in out_domains),
             "hours_all": tot_hours, "hours_wave1_core": core_w1[0], "wave1_deferred_labs": sorted(DEFER_W1), "hours_expert_path": expert_path,
             "hours_by_wave": {WAVE_HE[k]: v for k, v in sorted(hours_by_wave.items())},
             "hours_by_level": {LEVELS[k]: v for k, v in sorted(hours_by_level.items())},
             "hours_runnable_by_tier": lab_tier_hours},
  "budget_tiers": tiers,
  "unused_equipment": sorted(unused),
}
equip_json = {k: {"name": v[0], "usd": v[1], "ils_landed": ils(v[1]), "tier": v[2], "mark": v[3], "source": v[4]} for k, v in EQUIP.items()}
OUT = "/home/user/repo-exercise/docs/research/round5/expert/"
json.dump({"_meta": meta, "equipment": equip_json, "domains": out_domains},
          open(OUT + "E3_practice_track.json", "w"), ensure_ascii=False, indent=1)

# ---------- markdown pieces ----------
def eqnames(eq):
    return ", ".join(EQUIP[e][0].split(" (")[0] for e in eq) if eq else "מחשב בלבד"

def table_full(d):
    rows = ["| # | מעבדה | רמה | שעות | ציוד (שכבה) | תפקיד ה-AI / הלומד | אימות | תוצר |", "|---|---|---|---|---|---|---|---|"]
    for l in d["labs"]:
        rows.append(f"| {l['id']} | {l['title']} | {l['level']} {l['level_he']} | {l['hours']} | {eqnames(l['equipment'])} ({TIER_HE[l['tier_needed']]}) | {l['ai_role']} | {l['verification']} | {l['portfolio_output']} |")
    return "\n".join(rows)

def table_short(d):
    rows = ["| # | מעבדה | רמה | שעות | ציוד (שכבה) | אימות → תוצר |", "|---|---|---|---|---|---|"]
    for l in d["labs"]:
        rows.append(f"| {l['id']} | {l['title']} | {l['level']} | {l['hours']} | {eqnames(l['equipment'])} ({TIER_HE[l['tier_needed']]}) | {l['verification']} → {l['portfolio_output']} |")
    return "\n".join(rows)

parts = {}
for w in (1, 2, 3, 4, 0):
    s = []
    for d in out_domains:
        if d["wave"] != w: continue
        s.append(f"### {d['domain_he']} ({d['domain']})\n")
        s.append(f"**בנייה/מדידה אמיתית חובה:** {d['required_real_build']}. **שעות:** {d['hours']}. **ציוד חדש בתחום:** ${d['new_equipment_cost_usd']:,} (≈ ₪{d['new_equipment_cost_ils_landed']:,}) [estimate].\n")
        s.append((table_full(d) if w in (1, 0) else table_short(d)) + "\n")
    parts[w] = "\n".join(s)

def tier_table():
    rows = ["| פריט | USD | ₪ (כולל מע\"מ) | שכבה | סימון | מקור |", "|---|---|---|---|---|---|"]
    for k, v in EQUIP.items():
        src = f"[קישור]({v[4]})" if v[4] else ""
        rows.append(f"| {v[0]} | {v[1]:,} | {ils(v[1]):,} | {TIER_HE[v[2]]} | [{v[3]}] | {src} |")
    return "\n".join(rows)

def summary_table():
    rows = ["| תחום | גל | מעבדות | שעות | ציוד חדש USD |", "|---|---|---|---|---|"]
    for d in out_domains:
        rows.append(f"| {d['domain_he']} | {d['wave_he']} | {len(d['labs'])} | {d['hours']} | {d['new_equipment_cost_usd']:,} |")
    rows.append(f"| **סה\"כ** | | **{meta['totals']['labs']}** | **{tot_hours:,}** | **{tiers['full']['usd']:,}** |")
    return "\n".join(rows)

tpl = open(os.path.join(os.path.dirname(__file__), "template.md"), encoding="utf-8").read()
T = meta["totals"]
rep = {
 "{{W1}}": parts[1], "{{W2}}": parts[2], "{{W3}}": parts[3], "{{W4}}": parts[4], "{{W0}}": parts[0],
 "{{EQUIP_TABLE}}": tier_table(), "{{SUMMARY_TABLE}}": summary_table(),
 "{{H_ALL}}": f"{tot_hours:,}", "{{H_CORE1}}": f"{core_w1[0]:,}", "{{H_EXP}}": f"{expert_path:,}", "{{N_LABS}}": str(T["labs"]),
 "{{T_MIN}}": f"{tiers['min']['usd']:,}", "{{T_REC}}": f"{tiers['rec']['usd']:,}", "{{T_FULL}}": f"{tiers['full']['usd']:,}",
 "{{T_MIN_ILS}}": f"{tiers['min']['ils_landed']:,}", "{{T_REC_ILS}}": f"{tiers['rec']['ils_landed']:,}", "{{T_FULL_ILS}}": f"{tiers['full']['ils_landed']:,}",
 "{{H_TMIN}}": f"{lab_tier_hours['min']:,}", "{{H_TREC}}": f"{lab_tier_hours['rec']:,}", "{{H_TFULL}}": f"{lab_tier_hours['full']:,}",
}
for w in (0, 1, 2, 3, 4):
    rep["{{HW%d}}" % w] = f"{hours_by_wave.get(w,0):,}"
for k, v in rep.items():
    tpl = tpl.replace(k, v)
assert "{{" not in tpl, [x for x in tpl.split("{{")[1:3]]
open(OUT + "E3_practice_track.md", "w", encoding="utf-8").write(tpl)
print(json.dumps(meta["totals"], ensure_ascii=False, indent=1))
print({t: (tiers[t]["usd"], tiers[t]["ils_landed"]) for t in tiers}, "unused:", unused)
print({d["domain_he"]: d["hours"] for d in out_domains if d["wave"] in (0,1)})
