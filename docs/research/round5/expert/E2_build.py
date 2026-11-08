# -*- coding: utf-8 -*-
import json, sys, os
sys.path.insert(0, os.path.dirname(__file__))
import E2_data_b  # noqa: registers MIL domains
from E2_data_a import D, EV

REPO = "/home/user/repo-exercise"
OUT = REPO + "/docs/research/round5/expert/"
lv = json.load(open(REPO + "/docs/research/round4/LV_benchmark.json"))
keys = [k for k in lv if k != "_meta"]
ids = [d["id"] for d in D]
assert sorted(ids) == sorted(keys), (set(ids) ^ set(keys))
assert len(D) == 36

order = {k: i for i, k in enumerate(keys)}
D.sort(key=lambda d: order[d["id"]])
FIELDS = ["id", "role", "wave", "expert_definition_he", "ai_covers_he", "human_value_he",
          "hold_in_head_he", "delegate_he", "must_verify_he", "risks_he", "protection_he",
          "thesis_test", "target", "projected_old", "gap_he", "closing_plan_he", "legal_he",
          "extra_hours_estimate", "evidence", "confidence"]
out = []
for d in D:
    d["projected_old"] = lv[d["id"]]
    h = d["extra_hours_estimate"]
    assert h["p10"] <= h["p50"] <= h["p90"]
    out.append({f: d[f] for f in FIELDS})
json.dump(out, open(OUT + "E2_domain_targets.json", "w"), ensure_ascii=False, indent=2)

roles = {"deep": 0, "core": 0, "supporting": 0}
verd = {"supported": 0, "partial": 0, "not_yet": 0}
sums = {r: [0, 0, 0] for r in roles}
for d in out:
    roles[d["role"]] += 1
    verd[d["thesis_test"]["verdict"]] += 1
    h = d["extra_hours_estimate"]
    for i, p in enumerate(("p10", "p50", "p90")):
        sums[d["role"]][i] += h[p]
tot = [sum(s[i] for s in sums.values()) for i in range(3)]
wave = {}
for d in out:
    wave[d["wave"]] = wave.get(d["wave"], 0) + d["extra_hours_estimate"]["p50"]
print(roles, verd, sums, tot, wave)

ROLE_HE = {"deep": "עומק", "core": "ליבה", "supporting": "תומך"}
VER_HE = {"supported": "נתמכת", "partial": "חלקית", "not_yet": "עוד לא"}
CONF_HE = {"high": "גבוה", "medium": "בינוני", "low": "נמוך"}
YEAR_H = 2300  # effective hours/year at 8h + 1 phone hour [estimate]

def short(k):
    return k.split(" · ")[1].split(":")[0].split(",")[0]

L = []
A = L.append
A("# E2. יעדי מומחיות לכל תחום בעולם עם AI\n")
A("סבב 5, 30.10.2026. הנתונים: `E2_domain_targets.json` (36 רשומות, אותם מפתחות כמו `round4/LV_benchmark.json`). נבנה ב-`E2_build.py` מתוך `E2_data_a.py` ו-`E2_data_b.py`; המספרים בטבלאות מחושבים מה-JSON.\n")
A("סימון: [evidence] עדות עם מקור, [inference] הסקה, [estimate] אומדן.\n")
A("## 0. התשובה\n")
A(f"- **תפקידים:** {roles['deep']} עומק, {roles['core']} ליבה, {roles['supporting']} תומך. היעד בכל תחום הוא מומחה בתפקידו, כולל תכן ובנייה עם AI, לא רק ביקורת.")
A(f"- **שעות נוספות** מעבר לתוכנית רמה 2.5: P10 / **P50** / P90 = {tot[0]:,} / **{tot[1]:,}** / {tot[2]:,} שעות. לפי גלים (P50): גל 1 {wave[1]:,}, גל 2 {wave[2]:,}, גל 3 {wave[3]:,}.")
A(f"- בפילוח: עומק {sums['deep'][1]:,} ש' (P50), ליבה {sums['core'][1]:,}, תומך {sums['supporting'][1]:,}.")
A(f"- **לוח זמנים:** בכ-{YEAR_H:,} שעות אפקטיביות בשנה (8 ש' + שעת טלפון, כ-255 ימים) [estimate], P50 הוא כ-{tot[1]/YEAR_H:.0f} שנים מעבר ל-28.5 החודשים של התוכנית הקיימת; תחומי העומק לבדם כ-{sums['deep'][1]/YEAR_H:.1f} שנים. זה ארוך, וזה כנה: מומחה עומק בנישה הוא בערך מחקר PhD ועוד כמה שנות עבודה מעשית [estimate].")
A(f"- **התזה 'אדם אחד + AI ≈ צוות של פעם':** נתמכת ב-{verd['supported']} תחומים, חלקית ב-{verd['partial']}, עוד לא ב-{verd['not_yet']}. היא נתמכת היכן שהעבודה היא קוד, סימולציה ונתונים פתוחים; היא חלקית היכן שיש חומרה, שטח או ידע שבעל פה; היא עוד לא נבדקה היכן שהמומחיות נשענת על נתונים מסווגים ותרגול מבצעי (EW). כל פער כזה מקבל פריט בתוכנית.\n")

A("## 1. שיטה\n")
A("### 1.1 קנה המידה החדש\n")
A("LV מדד בכלים של העולם הישן: שטף = פתרון ידני במבחן, ומתכנן = מי שכותב קוד ומחזיק מעבדה בעצמו. כאן:")
A("- **academia_knowledge**: אותו סולם A1–A5 של LV.")
A("- **academia_fluency**: 'פותר ומאמת עם כלי AI בתנאי מבחן': מבחן בזמן, כלים מותרים, כל צעד מוסבר בעל פה, ושגיאות שתולות בפלט הסוכן נמצאות. זה מחליף את 'פתרון ביד'.")
A("- **industry_role / defense_role**: התפקיד שהוא יכול למלא בפועל, עם AI, כולל תכן ובנייה.")
A("- לכל תחום שלוש שאלות: מה הוא מחזיק בראש, מה הוא מאציל, ומה הוא חייב לדעת לבדוק ואיך. ועוד: סיכונים (שחיקה, ביטחון שווא, טעויות AI) והגנות.\n")
A("### 1.2 תפקידים\n")
A("- **עומק (deep)**: מתכנן-חוקר, principal בנישה. גל 1 כולו: מכ\"ם, EW, PNT, אנטנות, אותות, אומדן, מתמטיקה, ארגז הכלים הכמותי. הנישה המשותפת: חישה, EW וניווט נגד מטרות קטנות (רחפנים).")
A("- **ליבה (core)**: מומחה בכיר, מתכנן ובונה עם AI ברמת senior.")
A("- **תומך (supporting)**: אינטגרטור ובודק בכיר שעובד בידיים עם כלי AI. אף תחום לא נגמר מתחת ל-senior בתפקידו.\n")
A("### 1.3 מה עושים מומחים היום (מקורות)\n")
A("- מכ\"ם: Lincoln Lab דורשת PhD או MS עם 3–5 שנות ניסיון; Lockheed 5+ שנות SE ו-3+ שנות MATLAB; HRL משתמשת ב-MATLAB לתכן צורות גל ולניתוח נתונים; Elbit 3+ שנים רב-תחומי עם RF, ויחידת המכ\"ם מחפשת מהנדסי אלגוריתמים שמיישמים AI [evidence].")
A("- EW ו-RF: Anduril (EW) מבקשת SDR, Python ואוטומציית בדיקות; תפקידי staff דורשים 8+ שנים ב-waveform/DSP/SDR [evidence]. NPS: תעודות EW 292/294 עם מעבדות, ומסלול 590 עם תזה [evidence].")
A("- ניווט: משרות GNSS/INS דורשות EKF, צימוד הדוק ורופף, שלמות, C/C++ ו-Python [evidence].")
A("- אנליסטים: RAND דורשת הכשרה בשיטות כמותיות, ובכירים צריכים ניסיון עבודה מול מפקדים [evidence].")
A("- מסגרות כשירות: INCOSE SECF מגדירה חמש רמות (Awareness, Supervised Practitioner, Practitioner, Lead Practitioner, Expert) [evidence]; ל-AOC יש הסמכת EW בדרגות Apprentice עד Expert [evidence].\n")
A("### 1.4 מה AI כבר עושה, ואיפה הוא נכשל\n")
A("- חישוב: מודלים זכו בזהב באולימפיאדה במתמטיקה 2025 [evidence]. מבחן הנדסת חשמל רב-מודלי (EEE-Bench, מודלים של 2024) נתן 19–47%, ויותר ממחצית הטעויות הן טעויות היסק [evidence].")
A("- כלים: MATLAB Copilot (R2025b), Ansys SimAI ו-Engineering Copilot, Synopsys.ai Copilot, תכן אנלוגי בסוכנים (AnalogCoder ו-AnalogAgent), פריסת PCB אוטונומית (Quilter, טענות יצרן), סיווג RF (OmniSIG) [evidence].")
A("- תפוקה: בתוך 'החזית' יועצים עם GPT-4 היו מהירים ב-25% ואיכותיים יותר; מחוץ לה צדקו ב-19 נקודות פחות, והטיעונים השגויים נשמעו משכנעים יותר [evidence]. מפתחים ותיקים היו איטיים ב-19% עם AI במאגרים שהכירו, אף שהרגישו מהירים יותר [evidence].")
A("- שחיקה: אחרי חשיפה ל-AI, שיעור הגילוי של רופאים בלי AI ירד מ-28.4% ל-22.4% [evidence, מחקר תצפיתי]. ככל שהאמון ב-AI גבוה יותר, פחות חשיבה ביקורתית מדווחת [evidence, סקר].")
A("- המסקנה [inference]: הערך האנושי עובר לניסוח, בחירה, אימות ושיפוט. אבל זה לא קורה מעצמו: צריך פרוטוקול אימות, תרגול בלי AI על הליבה, ומבחנים חיצוניים.\n")
A("### 1.5 איך חושבו השעות\n")
A("- השעות הן **מעבר** לתוכנית רמה 2.5 (שמכסה את הידע), ומודדות עבודה מעשית: פרויקטים, ספסל, נתונים, אימות, מבחנים חיצוניים ופרסום.")
A("- עוגנים: 1 ECTS ≈ 25–30 ש' עבודה [evidence]; קורס תואר שני של 5–7.5 ECTS ≈ 125–225 ש'; תזה לתואר שני (30 ECTS) ≈ 750–900 ש', ובפועל 800–1,000; PhD ≈ 3–4 שנים מלאות ≈ 5,000–7,000 ש' [estimate]. משרות בכירות דורשות 5–10 שנות ניסיון [evidence], אבל רוב שעות העבודה אינן תרגול מכוון [inference].")
A("- ספרות התרגול המכוון: Ericsson טוען שתרגול מכוון נחוץ לרכישה ולשימור מומחיות [evidence]; המטא-אנליזה של Macnamara מצאה שהתרגול מסביר פחות מ-1% מהשונות במקצועות (ובוויכוח על ההגדרה, Ericsson ו-Harwell מגיעים ל-29–61% בתחומים אחרים) [evidence]. 'חוק 10,000 השעות' אינו עדות. Accelerated Expertise: תוכניות מוצלחות מאיצות מקצוענות, לא שליטה, ומומחיות לקחה היסטורית עד כ-10 שנים [evidence]. לכן האומדנים בנויים מיחידות עבודה מוחשיות (פרויקט, תזה, ספסל), לא ממספר קסם.")
A("- AI: הנחתי שהוא חוסך 30–50% משעות המימוש בפרויקט תוכנה ומעט מאוד בחומרה ובשטח, ומוסיף זמן אימות [estimate]. METR מראה שהחיסכון לא מובטח [evidence].")
A("- ספירה כפולה: פרויקט משותף (שרשרת DSP, GNSS/INS, רחפן) נספר בתחום המארח בלבד; בשאר התחומים נספרת רק התוספת. הנחה נוספת של חיסכון משילוב לא הוכנסה. אם השיעורים ייבנו מחדש כך שחלק מזמנם יהיה עבודה מעשית עם AI (סעיף 3 בבריף), חלק מהשעות יחפוף לזמן השיעורים [inference].")
A("- P10/P90: P10 הוא פרויקטים שהולכים לפי התוכנית; P90 כולל איטרציות חומרה, נתונים שלא עובדים, וביקורת חיצונית שדורשת עבודה חוזרת [estimate].\n")
A("### 1.6 מגבלות חוק בישראל (פריט בתוכנית)\n")
A("- רדיו: קליטה מותרת; שידור דורש רישיון משרד התקשורת (רישיון חובב דורש מבחן) [evidence]. לחובבים הוגבל רוב התחום 1–6 GHz ב-2020 [evidence]. לכן: עבודה בכבלים ומנחתים, כלוב מסוכך, מודולים עם אישור סוג, וקליטה בלבד מאותות קיימים (ADS-B, GNSS, FM/DVB-T, לוויינים). שיבוש או הטעיה רק בכבל.")
A("- ייצוא ביטחוני: חוק הפיקוח על יצוא ביטחוני (2007) מחייב רישיון אפ\"י גם על ידע ביטחוני; הנחיה מנובמבר 2025 מבהירה שהעברת ידע מפוקח לגורם זר גם בתוך ישראל נחשבת יצוא [evidence]. לכן: מפרסמים רק מה שנגזר ממקורות פתוחים, ובודקים לפני פרסום עבודות EW וטילים.")
A("- רחפנים: טיסה לפי כללי רת\"א (רישום, אזורים מוגבלים) [inference: לבדוק את הכללים העדכניים].")
A("- צנזורה צבאית: על פרסומים בנושאי ישראל.\n")

A("## 2. טבלת סיכום\n")
A("| תחום | תפקיד | גל | יעד בתעשייה | התזה | P10 | P50 | P90 | ביטחון |")
A("|---|---|---|---|---|---|---|---|---|")
for d in out:
    h = d["extra_hours_estimate"]
    A(f"| {d['id']} | {ROLE_HE[d['role']]} | {d['wave']} | {d['target']['industry_role']} | {VER_HE[d['thesis_test']['verdict']]} | {h['p10']:,} | {h['p50']:,} | {h['p90']:,} | {CONF_HE[d['confidence']]} |")
A(f"| **סך הכל** | | | | | **{tot[0]:,}** | **{tot[1]:,}** | **{tot[2]:,}** | |\n")
A("הערה: P50 של הסכום הוא כאן סכום ה-P50, וכך גם P10 ו-P90. בפועל הסכום של P10 נמוך מה-P10 של הסכום, ושל P90 גבוה ממנו, כך שהטווח האמיתי צר יותר [inference].\n")
A("### 2.1 התזה לפי תחום\n")
for v in ("supported", "partial", "not_yet"):
    names = [short(d["id"]) for d in out if d["thesis_test"]["verdict"] == v]
    A(f"- **{VER_HE[v]}** ({len(names)}): " + ", ".join(names) + ".")
A("")
A("מה סוגר את הפערים בתוכנית: ספסל RF ומדידה מוקדמים (חומרה); טיסות ומדידות שטח (UAS, EO/IR, אווירו); ראיונות ומבקרים מהתחום (C4ISR, לוגיסטיקה, יריב); ותקרת הסיווג נכתבת במפורש בכל עבודת EW, טילים, ימי וקטלניות, כי היא לא נסגרת במקור פתוח. אחריות על תוכנית והובלת צוות לא נבדקות לבד, ונבדקות דרך מוצר אמיתי ולקוח אמיתי.\n")

A("## 3. לפי תחום\n")
for d in out:
    t = d["target"]; h = d["extra_hours_estimate"]; tt = d["thesis_test"]
    A(f"### {d['id']}\n")
    A(f"**תפקיד:** {ROLE_HE[d['role']]} · **גל:** {d['wave']} · **ביטחון:** {CONF_HE[d['confidence']]}\n")
    A(f"**מומחה ב-2027–2030:** {d['expert_definition_he']}\n")
    A(f"- **מה AI עושה:** {d['ai_covers_he']}")
    A(f"- **מה עולה בערכו:** {d['human_value_he']}")
    A(f"- **בראש:** {d['hold_in_head_he']}")
    A(f"- **מאציל:** {d['delegate_he']}")
    A(f"- **חייב לבדוק, ואיך:** {d['must_verify_he']}")
    A(f"- **סיכונים:** {d['risks_he']}")
    A(f"- **הגנות:** {d['protection_he']}")
    A(f"- **התזה ({VER_HE[tt['verdict']]}):** {tt['evidence_he']} סוגר: {tt['closes_he']}")
    A(f"- **יעד:** ידע {t['academia_knowledge']}; שטף {t['academia_fluency']}; תעשייה: {t['industry_role']}; ביטחון: {t['defense_role']}.")
    A(f"- **הצפי הקודם (LV):** {d['projected_old']['summary_he']}")
    A(f"- **הפער:** {d['gap_he']}")
    A(f"- **התוכנית:** {d['closing_plan_he']}")
    if d["legal_he"]:
        A(f"- **חוק:** {d['legal_he']}")
    A(f"- **שעות נוספות:** {h['p10']:,} / **{h['p50']:,}** / {h['p90']:,}. {h['basis_he']}")
    srcs = [u for u in d["evidence"] if u.startswith("http")]
    A("- **מקורות:** " + ", ".join(f"<{u}>" for u in srcs) + "\n")

A("## 4. מקורות\n")
for k, u in EV.items():
    if u.startswith("http"):
        A(f"- `{k}`: <{u}>")
A("\nהערה: חלק ממודעות הדרושים הן עותקים באתרי צבירה, ועלולות להיות סגורות; טענות יצרן (Quilter, SimAI, OmniSIG) לא אומתו באופן בלתי תלוי.")
open(OUT + "E2_domain_targets.md", "w").write("\n".join(L) + "\n")
