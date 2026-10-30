"""Check the engineering syllabus and write syllabus.json and SYLLABUS.md.

Checks: every page of every book belongs to a module or to SKIP (and not to
both), every prerequisite exists and comes earlier, and every page range is
inside its document. Feynman I and II are text files; their pages are the
units of app/artifact/books/feyn*.json.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

from syllabus import DOCS, GAPS, MODULES, PARTS, SKIP

ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
TIER = {"core": "ליבה", "adv": "מתקדם", "ref": "עיון"}


def page_count(path):
    if path.endswith(".json"):
        return len(json.loads((ROOT / path).read_text())["pages"])
    out = subprocess.run(["pdfinfo", str(ROOT / path)], capture_output=True, text=True).stdout
    return int(re.search(r"Pages:\s+(\d+)", out).group(1))


def main():
    pages = {k: page_count(v[0]) for k, v in DOCS.items()}
    errors = []
    covered = {k: set() for k in DOCS}
    used = set()
    seen = set()

    for m in MODULES:
        for p in m.get("prereq", []):
            if p not in seen:
                errors.append(f"{m['id']}: prerequisite {p} is missing or comes later")
        seen.add(m["id"])
        for src in m["sources"]:
            d = src["doc"]
            if d not in DOCS:
                errors.append(f"{m['id']}: unknown document {d}")
                continue
            used.add(d)
            a, b = src["pages"] or (1, pages[d])
            if not (1 <= a <= b <= pages[d]):
                errors.append(f"{m['id']}: {d} pages {a}-{b} outside 1-{pages[d]}")
            covered[d].update(range(a, b + 1))
    for d, a, b, reason in SKIP:
        taught = covered[d] & set(range(a, b + 1))
        if taught:
            errors.append(f"{d}: pages {min(taught)}-{max(taught)} are both in a module and skipped ({reason})")
        covered[d].update(range(a, b + 1))

    gaps = {}
    for d in DOCS:
        missing = sorted(set(range(1, pages[d] + 1)) - covered[d])
        if missing:
            runs, start = [], missing[0]
            for x, y in zip(missing, missing[1:] + [None]):
                if y != x + 1:
                    runs.append(f"{start}-{x}" if start != x else f"{start}")
                    if y:
                        start = y
            gaps[d] = runs
            errors.append(f"{d}: pages not mapped: {', '.join(runs)}")

    data = {
        "docs": {k: {"file": v[0], "title": v[1], "pages": pages[k]} for k, v in DOCS.items()},
        "parts": [{"id": i, "title": t} for i, t in PARTS],
        "modules": MODULES,
        "skip": [{"doc": d, "pages": [a, b], "reason": r} for d, a, b, r in SKIP],
        "gaps": GAPS,
    }
    (HERE / "syllabus.json").write_text(json.dumps(data, ensure_ascii=False, indent=1))
    (HERE / "SYLLABUS.md").write_text(render(data, pages, gaps))

    for e in errors:
        print("ERROR", e)
    counts = {t: sum(1 for m in MODULES if m["tier"] == t) for t in TIER}
    print(f"{len(MODULES)} modules: {counts}; errors: {len(errors)}")
    return 1 if errors else 0


def size(m, pages, kinds=("main", "supp")):
    """Pages of the given source roles in a module. Lessons are estimated from book pages only."""
    total = 0
    for src in m["sources"]:
        if src["role"] in kinds:
            a, b = src["pages"] or (1, pages[src["doc"]])
            total += b - a + 1
    return total


def lessons(n):
    return max(1, round(n / 15))


def cite(src, docs):
    title = docs[src["doc"]]["title"]
    if src["pages"] is None:
        where = f"{title} (כולו)"
    else:
        a, b = src["pages"]
        where = f"{title}, עמ' PDF {a}–{b}" if a != b else f"{title}, עמ' PDF {a}"
    return f"{where}" + (f": {src['note']}" if src["note"] else "")


def render(data, pages, gaps):
    docs = data["docs"]
    out = ["# תוכנית הלימודים: הנדסה (טיוטה)", ""]
    out.append("נבנתה מתוכני העניינים של כל הספרים. כל נושא נלמד פעם אחת, במקום שבו המקור הכי טוב, ונשען על עמודים מוגדרים. "
               "מספרי העמודים הם עמודי ה-PDF בקבצים שב-`library/engineering/books/` וב-`library/math-physics/`; בפיינמן I ו-II אלה יחידות העמוד של מעבדת הלמידה (`app/artifact/books/feyn*.json`).")
    out.append("")
    out.append("**דרגות:** ליבה = נלמד במלואו. מתקדם = אחרי הליבה של אותו חלק. עיון = לא נלמד כשיעור, זמין לפי צורך.")
    out.append("")
    out.append("**תפקיד המקור:** ★ מקור ראשי. ◇ השלמה מספר אחר. ✎ תרגילים (לא נספרים באומדן השיעורים).")
    out.append("")
    counts = {t: sum(1 for m in data["modules"] if m["tier"] == t) for t in TIER}
    out.append(f"**סה\"כ:** {len(data['modules'])} מודולים: {counts['core']} ליבה, {counts['adv']} מתקדם, {counts['ref']} עיון.")
    out.append("")
    out.append("| חלק | מודולים | עמ' בליבה | שיעורי ליבה (אומדן) | עמ' במתקדם | עמ' בעיון |")
    out.append("|---|---|---|---|---|---|")
    tot = [0, 0, 0, 0, 0]
    for p in data["parts"]:
        mods = [m for m in data["modules"] if m["part"] == p["id"]]
        core = [m for m in mods if m["tier"] == "core"]
        bp = sum(size(m, pages) for m in core)
        les = sum(lessons(size(m, pages)) for m in core)
        adv = sum(size(m, pages) for m in mods if m["tier"] == "adv")
        ref = sum(size(m, pages) for m in mods if m["tier"] == "ref")
        row = [len(mods), bp, les, adv, ref]
        tot = [x + y for x, y in zip(tot, row)]
        out.append(f"| {p['id']} {p['title']} | " + " | ".join(map(str, row)) + " |")
    out.append("| **סה\"כ** | " + " | ".join(map(str, tot)) + " |")
    out.append("")
    out.append("האומדן: שיעור לכל כ-15 עמודי מקור, כולל השלמות. בהשלמות המורה מלמד רק את מה שחדש לעומת המקור הראשי.")
    out.append("")
    mark = {"main": "★", "supp": "◇", "ex": "✎"}
    for pid, ptitle in [(p["id"], p["title"]) for p in data["parts"]]:
        mods = [m for m in data["modules"] if m["part"] == pid]
        out.append(f"## {pid.replace('P', 'חלק ')}: {ptitle}")
        out.append("")
        for m in mods:
            pre = f" · דרישות: {', '.join(m['prereq'])}" if m.get("prereq") else ""
            n = size(m, pages)
            amount = f"{n} עמ'"
            out.append(f"### {m['id']} {m['title']}")
            out.append(f"*{m['en']}* · **{TIER[m['tier']]}** · {amount} · כ-{lessons(n)} שיעורים{pre}")
            out.append("")
            for src in m["sources"]:
                out.append(f"- {mark[src['role']]} {cite(src, docs)}")
            out.append("")
    out.append("## פערים ידועים במקורות")
    out.append("")
    for g in data["gaps"]:
        out.append(f"- {g}")
    out.append("")
    out.append("## עמודים שלא נלמדים")
    out.append("")
    out.append("| מקור | עמודים | סיבה |")
    out.append("|---|---|---|")
    for sk in data["skip"]:
        a, b = sk["pages"]
        out.append(f"| {docs[sk['doc']]['title']} | {a}–{b} | {sk['reason']} |")
    out.append("")
    out.append("## בדיקת כיסוי")
    out.append("")
    if gaps:
        for d, runs in gaps.items():
            out.append(f"- ⚠️ {docs[d]['title']}: עמודים לא ממופים {', '.join(runs)}")
    else:
        out.append("כל עמוד בכל ספר שייך למודול או מסומן כלא נלמד.")
    out.append("")
    return "\n".join(out)


if __name__ == "__main__":
    sys.exit(main())
