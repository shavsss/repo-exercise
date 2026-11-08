"""Build report.html from report_template.html + LV2_benchmark.json. Run: python3 -I report_build.py"""
import json, os
H = os.path.dirname(os.path.abspath(__file__))
lv2 = json.load(open(os.path.join(H, "LV2_benchmark.json")))
ms = {"base": {}, "ai_trend": {}}
for d in lv2["domains"]:
    for scn in ms:
        ms[scn][d["wave"]] = {m: d[m + "_months"][scn] for m in ("senior", "expert", "principal")}
keep = ("name_he", "role", "wave", "old", "target", "hold_in_head_he", "delegate_he", "must_verify_he",
        "thesis_verdict", "extra_hours", "lab_hours", "real_build_he")
doms = [{k: d[k] for k in keep} for d in lv2["domains"]]
ladder = [  # E4_external_validation.json 'ladder', in Hebrew
    {"level": "junior", "months_est": "6–12", "signals": ["2–3 קורסים עם ציון באוניברסיטה הפתוחה", "רישיון חובב רדיו", "2–3 PR קטנים שמוזגו (GNU Radio, GNSS-SDR)", "פתרון מלא על נתוני Decimeter או MAFAT מול הזוכים"]},
    {"level": "mid", "months_est": "12–24", "signals": ["פיצ'ר ב-GNSS-SDR או בלוק ב-gr-radar", "רבע עליון ב-CTF של RF", "INCOSE ASEP", "ביקורת בתשלום של דוח תכן ע\"י מהנדס מכ\"ם", "GSoC", "הרצאה ב-GRCon או IACAS"]},
    {"level": "senior", "months_est": "24–40", "signals": ["2–3 מאמרי כנס עם ביקורת (RadarConf, ION GNSS+, EuRAD, COMCAS, IEEE Aerospace)", "דירוג גבוה בתחרות חיה", "בחינה בעל פה מול פרופסור", "JOSS לכלי עם משתמשים"]},
    {"level": "expert", "months_est": "40–60", "signals": ["סוקר ב-IEEE או ION", "מאמר בכתב עת (TAES, TSP, NAVIGATION)", "מתחזק או committer", "פתרון ממומן ל-AESS Challenge Problem", "ציטוטים של אחרים", "לקוחות משלמים"]},
    {"level": "principal", "months_est": "60+", "signals": ["מארגן תחרות או בעיית אתגר", "יו\"ר מושב, הדרכה מוזמנת", "ייעוץ בתשלום לארגון", "מוצר עם הכנסה חוזרת", "אנליסט: שנתיים של רקורד Brier פומבי ופרסומים"]},
]
data = {"milestones": ms, "domains": doms, "ladder": ladder}
t = open(os.path.join(H, "report_template.html")).read()
open(os.path.join(H, "report.html"), "w").write(t.replace("/*DATA*/null", json.dumps(data, ensure_ascii=False)))
print("ok", len(doms))
