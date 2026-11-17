"""Build tools/curriculum/round8_sources.json from the fetch manifests (tmp/r8/manifest/*.json).

Each new module gets its mapped page ranges as "main" sources. A document goes into an app's
DOCS when that app does not have it yet (free and uploaded documents, and library documents of
the other app). Failed entries are skipped. Run from the repo root.
"""
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
sys.path[:0] = [str(ROOT / "tools/curriculum")]
import round8  # noqa: E402

MAN = ROOT / "tmp/r8/manifest"
APP_OF = {mid: app for app in ("eng", "mil") for mid in round8.NEW[app]}


def have_docs(app):
    """Doc ids already in the app's syllabus.py DOCS (read as text, before round 8 adds its own)."""
    p = ROOT / f"library/{'engineering' if app == 'eng' else 'military'}/syllabus/syllabus.py"
    s = p.read_text()
    block = s[s.index("DOCS = {"): s.index("\n}\n", s.index("DOCS = {"))]
    return set(re.findall(r'^\s*"([^"]+)"\s*:', block, re.M))


def main():
    have = {a: have_docs(a) for a in ("eng", "mil")}
    out = {"docs": {"eng": {}, "mil": {}}, "modules": {"eng": {}, "mil": {}}}
    # one entry per document; gaps.json (refetches of failed or partial entries) wins
    files = sorted(MAN.glob("*.json"), key=lambda f: (f.name == "gaps.json", f.name))
    entries = {e["doc"]: e for f in files for e in json.loads(f.read_text())}
    for e in entries.values():
        if True:
            if e.get("status") == "failed" or not e.get("path"):
                continue
            if not (ROOT / e["path"]).exists():
                print(f"missing file, skipped: {e['doc']} {e['path']}")
                continue
            for mid, ranges in e.get("modules", {}).items():
                app = APP_OF.get(mid)
                if not app:
                    print(f"{e['doc']}: {mid} is not a new module, skipped")
                    continue
                if e["doc"] not in have[app]:
                    # Lanchester's DOCS paths are relative to library/military, Gilua's to the repo root
                    rel = e["path"] if app == "eng" else os.path.relpath(e["path"], "library/military")
                    out["docs"][app][e["doc"]] = [rel, e.get("title") or e["doc"]]
                lst = out["modules"][app].setdefault(mid, [])
                for r in ranges:
                    a, b = r["pages"]
                    lst.append({"doc": e["doc"], "pages": [int(a), int(b)], "note": r.get("note", ""), "role": "main"})
    dst = ROOT / "tools/curriculum/round8_sources.json"
    dst.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
    for app in ("eng", "mil"):
        n = len(round8.NEW[app])
        got = out["modules"][app]
        print(app, f"modules with sources {len(got)}/{n}", "without:", sorted(set(round8.NEW[app]) - set(got)), "new docs", len(out["docs"][app]))


main()
