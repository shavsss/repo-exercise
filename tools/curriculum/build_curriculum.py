"""Build the per-module curriculum data of both apps from the research outputs.

Reads
  docs/research/round3/final/F_curriculum.json   added lesson items, test-out sections, brief sections
  docs/research/round4/reading/R_eng.json, R_mil.json   the fixed reading lists
  tools/curriculum/sources_p2h.json               stronger sources for tutor-written domains (P2-H)
and writes library/military/syllabus/curriculum.json and library/engineering/syllabus/curriculum.json:
  {"meta": ..., "modules": {"M7.9": {"items": [...], "testout": [...], "brief": [...], "reading": [...]}}}

pack.py (both apps) and tools/curriculum/patch_index.py attach these fields to the modules of
lib/index.json. Nothing is removed: test-out and brief sections stay in the module's pages;
the tutor opens them with a short diagnostic or a condensed lesson (teaching rules).
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
F = ROOT / "docs/research/round3/final/F_curriculum.json"
R = {"mil": ROOT / "docs/research/round4/reading/R_mil.json", "eng": ROOT / "docs/research/round4/reading/R_eng.json"}
H = ROOT / "tools/curriculum/sources_p2h.json"
OUT = {"mil": ROOT / "library/military/syllabus/curriculum.json", "eng": ROOT / "library/engineering/syllabus/curriculum.json"}

KIND = {"deepen existing lesson": "deepen", "new lesson item": "new", "delta link to primary": "delta", "C-level mention": "mention"}

# Panel test-out subtopics that F_curriculum leaves without a host (the books already teach
# them; most are B14/B15 material the learner has read): the module whose pages teach each one.
SUBTOPIC_HOST = {
    "M:AP.1.3": "M1.1", "M:R.1.1": "M2.1", "M:R.6.4": "M2.22", "M:EO.3.4": "M3.13", "M:EO.4.4": "M3.8", "M:EO.5.1": "M3.13",
    "M:EW.2.4": "M4.5", "M:EW.4.6": "M5.5", "M:EW.5.3": "M4.9", "M:EW.9.3": "M4.13", "M:COM.2.1": "M7.9", "M:COM.3.1": "M9.5",
    "M:PNT.1.2": "M5.3", "M:UAS.1.1": "M9.1", "M:UAS.1.5": "M9.8", "M:UAS.2.4": "M9.4", "M:UAS.4.4": "M9.7", "M:SUR.2.2": "M4.10",
    "M:SUR.4.5": "M8.4", "M:SUR.4.6": "M8.3", "M:MSL.1.1": "M6.3", "M:MSL.10.1": "M6.7", "M:MSL.10.3": "M6.7",
    "M:OR.1.1": "M14.1", "M:OR.1.4": "M14.1", "M:OR.2.1": "M11.4", "M:OR.2.2": "M7.3", "M:OR.2.3": "M11.4", "M:OR.3.1": "M7.4",
    "M:OR.3.2": "M7.6", "M:OR.3.3": "M7.1", "M:OR.4.1": "M14.1", "M:OR.4.2": "M14.1", "M:OR.4.3": "M14.1", "M:OR.4.4": "M14.1",
    "M:OR.5.1": "M2.3", "M:OR.5.2": "M3.10", "M:OR.5.3": "M4.4", "M:OR.5.4": "M10.3", "M:OR.6.1": "M12.3", "M:OR.7.1": "M0.4",
    "M:OR.8.1": "M7.4", "M:OR.8.4": "M7.4", "M:OR.9.2": "M0.6", "M:OR.10.1": "M10.4", "M:OR.10.3": "M7.10", "M:OR.13.3": "M4.9",
    "M:ADV.1.4": "M12.2", "M:ADV.2.4": "M12.4",
}


def pages_of(sec):
    """[a, b] PDF pages of a section record: its pdf range, or the range at the end of its uid."""
    if sec.get("pdf"):
        a, b = sec["pdf"]
        return [int(a), int(b)]
    m = re.search(r":(\d+)-(\d+)$", sec.get("uid") or "")
    return [int(m.group(1)), int(m.group(2))] if m else None


def section(sec):
    out = {"t": sec.get("title") or sec.get("note") or sec.get("key") or "", "d": sec["doc"], "p": pages_of(sec)}
    if sec.get("reason"):
        out["why"] = sec["reason"]
    return out


def item(x):
    out = {"id": x["id"], "n": x["name"], "imp": x["importance"], "k": KIND.get(x["kind"], "new")}
    if x.get("missing"):
        out["teach"] = x["missing"]
    if x.get("primary_host"):
        out["primary"] = ":".join(x["primary_host"])
    if x.get("test_out"):
        out["to"] = 1
    return out


def reading_mil(x):
    st = x["link_status"]
    return {
        "id": x["id"], "t": x["title"], "a": x["authors"], "o": x.get("org") or "", "y": x["year"], "u": x["url"],
        "core": x["tier"] == "core", "why": x["why"], "focus": x["focus"], "h": x["hours"], "kind": x["kind"],
        "st": "ok" if st.startswith("ok") else "blocked" if st.startswith("exists") else "rough" if st.startswith("rough") else "timeout",
    }


def reading_eng(i, x):
    st = x["link_check"]
    out = {
        "id": f"RE{i:03d}", "t": x["title"], "a": x["authors"], "o": "", "y": x["year"], "u": x["link"],
        "core": x["level"] == "core", "why": x["why"], "focus": x["focus"], "h": round(x["minutes"] / 60, 2),
        "st": "doi" if "DOI" in st else "ok" if st.startswith("ok") else "blocked" if st.startswith("exists") else "timeout",
    }
    if x.get("paywall"):
        out["pay"] = 1
    if x.get("open_alternative"):
        out["alt"] = x["open_alternative"]
    return out


def reading_h(x):
    out = {
        "id": x["id"], "t": x["title"], "a": x["authors"], "o": x.get("org") or "", "y": x["year"], "u": x["url"],
        "core": x["core"], "why": x["why"], "focus": x["focus"], "h": x["hours"], "kind": x["kind"], "st": x["status"],
        "topic": x["topic"], "p2h": 1,
    }
    if x.get("paywall"):
        out["pay"] = 1
    return out


def main():
    f = json.loads(F.read_text())
    h = json.loads(H.read_text())
    items_by_id = {x["id"]: x for x in f["items"]}
    for app in ("mil", "eng"):
        mods = {}
        for m in f["modules"][app]:
            e = {
                "items": [item(x) for x in m["added"]],
                "testout": [section(s) for s in m["testout"]],
                "brief": [section(s) for s in m["not_needed"]],
                "reading": [],
            }
            mods[m["id"]] = e
        for s in f["subtopic_testout"]:
            x = items_by_id.get(s["id"])
            host = x["host"] if x and x.get("host") else (["mil", SUBTOPIC_HOST[s["id"]]] if s["id"] in SUBTOPIC_HOST else None)
            if host and host[0] == app and host[1] in mods:
                mods[host[1]]["testout"].append({"t": s["name"], "imp": s["importance"], "sub": 1})
        r = json.loads(R[app].read_text())["items"]
        for i, x in enumerate(r, 1):
            mods[x["module"]]["reading"].append(reading_mil(x) if app == "mil" else reading_eng(i, x))
        for x in h["items"]:
            if x["app"] == app:
                mods[x["module"]]["reading"].append(reading_h(x))
        mods = {k: {f: v for f, v in e.items() if v} for k, e in mods.items()}
        out = {
            "meta": {
                "built_by": "tools/curriculum/build_curriculum.py",
                "from": [str(F.relative_to(ROOT)), str(R[app].relative_to(ROOT)), str(H.relative_to(ROOT))],
                "fields": {
                    "items": "lesson items added by the topic-based curriculum: n name, imp K/S/C, k new|deepen|delta|mention, teach what to add, primary (for delta) the module that teaches it in full, to 1 = test-out candidate",
                    "testout": "sections (t, d doc, p PDF pages) or subtopics (sub 1) taught after a short diagnostic: pass = condensed lesson with the full text one click away and a later recheck; otherwise the full lesson",
                    "brief": "sections taught as a short overview, with the full text one click away (never dropped)",
                    "reading": "fixed reading list: core = read with the module; st ok|doi|blocked|timeout|rough is the link check; p2h 1 = stronger source for a tutor-written domain, with its topic",
                },
            },
            "modules": mods,
        }
        OUT[app].write_text(json.dumps(out, ensure_ascii=False, indent=0) + "\n")
        n = {k: sum(len(e.get(k, [])) for e in mods.values()) for k in ("items", "testout", "brief", "reading")}
        print(app, OUT[app].relative_to(ROOT), n)


if __name__ == "__main__":
    main()
