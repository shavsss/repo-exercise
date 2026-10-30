"""Build LV2_benchmark.json/.md: targets vs projection per domain, AI-augmented yardstick.

Run (from this folder, after X_model.py):  python3 -I LV2_build.py
Inputs: E2_domain_targets.json, E3_practice_track.json, X_model.out, ../../round4/LV_benchmark.json
"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
P = lambda *a: os.path.join(HERE, *a)

e2 = json.load(open(P("E2_domain_targets.json")))
e3 = {d["domain"]: d for d in json.load(open(P("E3_practice_track.json")))["domains"]}
lv = json.load(open(P("..", "..", "round4", "LV_benchmark.json")))
out = open(P("X_model.out")).read()
# old grades come from the summary table of LV_benchmark.md
old_grades = {}
for ln in open(P("..", "..", "round4", "LV_benchmark.md")).read().splitlines():
    c = [x.strip() for x in ln.strip().strip("|").split("|")]
    if len(c) == 6 and (c[0].startswith("ENG ·") or c[0].startswith("MIL ·")):
        old_grades[c[0]] = {"knowledge": c[1], "fluency": c[2], "industry": c[3]}

# milestone months per scenario/wave from X_model.out
ms = {}
scn = None
for ln in out.splitlines():
    m = re.match(r"=== Staged waves, scenario '(\w+)'", ln)
    if m:
        scn = m.group(1)
        continue
    m = re.match(r"\s+wave (\d) (senior|expert|principal)\s+P10\s+([\d.]+)\s+P50\s+([\d.]+)\s+P90\s+([\d.]+)", ln)
    if m and scn:
        ms[(scn, int(m.group(1)), m.group(2))] = tuple(float(m.group(i)) for i in (3, 4, 5))

ROLE_HE = {"deep": "עומק", "core": "ליבה", "supporting": "תומך"}
VERDICT_HE = {"supported": "נתמכת", "partial": "חלקית", "not_yet": "עדיין לא"}


def yrs(x):
    return f"{x / 12:.1f}"


rows = []
for d in e2:
    w = d["wave"]
    lab = e3.get(d["id"], {})
    old = lv.get(d["id"], {})
    tt = d.get("thesis_test", {})
    v = tt.get("verdict", "")
    rows.append({
        "id": d["id"],
        "name_he": lab.get("domain_he", d["id"]),
        "role": d["role"],
        "wave": w,
        "old": old_grades.get(d["id"], {}),
        "target": d["target"],
        "hold_in_head_he": d["hold_in_head_he"],
        "delegate_he": d["delegate_he"],
        "must_verify_he": d["must_verify_he"],
        "thesis_verdict": v,
        "extra_hours": d["extra_hours_estimate"],
        "lab_hours": lab.get("hours"),
        "real_build_he": lab.get("required_real_build"),
        "senior_months": {"base": ms.get(("base", w, "senior")), "ai_trend": ms.get(("ai_trend", w, "senior"))},
        "expert_months": {"base": ms.get(("base", w, "expert")), "ai_trend": ms.get(("ai_trend", w, "expert"))},
        "principal_months": {"base": ms.get(("base", w, "principal")), "ai_trend": ms.get(("ai_trend", w, "principal"))},
        "confidence": d.get("confidence"),
    })

json.dump({"_meta": {
    "question": "Per domain: the expert target for an AI-augmented practitioner, the old projection (LV, round 4), and when the plan reaches senior and expert in role.",
    "yardstick": "Fluency = solves and verifies with AI tools under timed exam conditions and finds planted errors in agent output. Industry = the designer/builder role done with AI, not only the reviewer role.",
    "milestones": "Months from 30.10.2026, P10/P50/P90, from X_model.py (staged waves). 'base' = E2 hours as estimated; 'ai_trend' = agents keep improving (his hours shrink 7%/yr, floor 0.55). senior/expert/principal as defined in X_model.py v2.",
    "sources": ["E2_domain_targets.json", "E3_practice_track.json", "X_model.out", "round4/LV_benchmark.json"],
}, "domains": rows}, open(P("LV2_benchmark.json"), "w"), ensure_ascii=False, indent=1)

# ---- markdown
L = []
L.append("# LV2. יעד מומחה בכל תחום: יעד מול תחזית, במדד של עולם ה-AI\n")
L.append("סבב 5 (30.10.2026). מחליף את `round4/LV_benchmark.md` כמדד היעד. המקורות: `E2_domain_targets` (יעד ושעות), `E3_practice_track` (מעבדות), `X_model.py` (לוח זמנים), `R_redteam.md` (ביקורת).\n")
L.append("## מה השתנה במדד\n")
L.append("- **שטף:** לא \"עובר מבחן סופי ביד\", אלא פותר ומאמת עם כלי AI במבחן בזמן, ומוצא טעויות שתולות בפלט של סוכן. ובנוסף, מבחן קצר בלי AI על תוצאות העוגן של התחום.")
L.append("- **תעשייה:** תפקיד המתכנן והבונה, שעובד עם סוכנים, ולא רק תפקיד הבודק. \"מתחת לג'וניור כמתכנן\" של LV היה תוצאה של המדד הישן (בלי קוד, בלי כלים); בעולם החדש הקוד והכלים מואצלים, והשאלה היא אם הוא יודע לנסח, לבחור, לאמת ולחתום.")
L.append("- **שלוש שכבות בכל תחום:** מה בראש, מה מאצילים, מה חייבים לדעת לבדוק. הן ב-JSON לכל תחום.\n")
L.append("## אבני דרך (חודשים מהיום, P50, בסוגריים P10–P90)\n")
L.append("שלוש רמות לכל גל. **בכיר**: תוכנית הלימודים של הגל ועוד כ-45% מעבודת המומחה, עם אות חיצוני ראשון. **מומחה**: כל מסלול המעבדות של E3 ועוד מחקר, לקוחות, מנטורים ושחזורים ביד, ואחרי זה מחזור שיפוט חיצוני (מאמר, לקוח, בחינה בעל פה). **מוביל (principal)**: כל השעות של E2, שנעשות כ-30% מהזמן אחרי שהגל הבא מתחיל.\n")
L.append("| גל | בכיר | מומחה | מוביל | אם הסוכנים ממשיכים להשתפר (בכיר / מומחה / מוביל) |")
L.append("|---|---|---|---|---|")
def cell(k):
    v = ms.get(k)
    return f"{v[1]:.0f} ({v[0]:.0f}–{v[2]:.0f}), כ-{yrs(v[1])} ש'" if v else ""
for w in (1, 2, 3):
    a = "/".join(f"{ms[('ai_trend', w, m)][1]:.0f}" for m in ("senior", "expert", "principal"))
    L.append(f"| {w} | {cell(('base', w, 'senior'))} | {cell(('base', w, 'expert'))} | {cell(('base', w, 'principal'))} | {a} |")
L.append("\nגל 1 הוא 14 התחומים שסומנו לגל 1 ב-E2: שמונת תחומי העומק, ועוד אלקטרוניקה, הנדסת מערכות, שיפוט הנדסי, מחשוב ושבבים, כטב\"מים ונגד-כטב\"מים, ואומנות הניתוח. הצוות האדום העריך מומחה בגל 1 ב-38 חודשים (28–54), והמודל כאן נותן 57 (50–66): ההפרש הוא תקורת המחקר והשיפוט החיצוני, שהמודל מוסיף על שעות המעבדה. שני המספרים מוצגים בדוח.\n")
L.append("## טבלת התחומים\n")
L.append("| תחום | תפקיד | גל | LV (ידע / תעשייה) | יעד בתעשייה | התזה | שעות נוספות P50 | מתוכן מעבדה |")
L.append("|---|---|---|---|---|---|---|---|")
for r in sorted(rows, key=lambda r: (r["wave"], ["deep", "core", "supporting"].index(r["role"]))):
    L.append(f"| {r['name_he']} | {ROLE_HE[r['role']]} | {r['wave']} | {r['old'].get('knowledge','')} / {r['old'].get('industry','')} | {r['target']['industry_role']} | {VERDICT_HE.get(r['thesis_verdict'], r['thesis_verdict'])} | {r['extra_hours']['p50']:,} | {r['lab_hours'] or ''} |")
tot = sum(r["extra_hours"]["p50"] for r in rows)
labs = sum(r["lab_hours"] or 0 for r in rows)
L.append(f"| **סה\"כ** | | | | | | **{tot:,}** | **{labs:,}** |\n")
L.append("## לכל תחום: בראש, מאצילים, בודקים\n")
for r in sorted(rows, key=lambda r: (r["wave"], ["deep", "core", "supporting"].index(r["role"]))):
    L.append(f"### {r['name_he']} ({ROLE_HE[r['role']]}, גל {r['wave']})\n")
    L.append(f"- **יעד:** {r['target']['industry_role']}. ידע {r['target']['academia_knowledge']}; שטף {r['target']['academia_fluency']}.")
    L.append(f"- **בראש:** {r['hold_in_head_he']}")
    L.append(f"- **מאצילים:** {r['delegate_he']}")
    L.append(f"- **בודקים:** {r['must_verify_he']}")
    if r["real_build_he"]:
        L.append(f"- **בנייה אמיתית:** {r['real_build_he']}")
    L.append("")
open(P("LV2_benchmark.md"), "w").write("\n".join(L))
print("rows", len(rows), "extra P50", tot, "lab", labs)
