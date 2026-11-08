"""Attach the topic-based curriculum (library/*/syllabus/curriculum.json) to the modules of
lib/index.json. Used by core/tools/pack.py, eng/tools/pack.py and patch_index.py.

Fields added to a module (all optional; the apps treat a missing field as empty):
  items    lesson items the tutor teaches beyond the pages (566 across both apps)
  testout  sections or subtopics opened with a short diagnostic (never removed)
  brief    sections taught as a short overview, with the full text one click away
  reading  the module's fixed reading list (R_mil / R_eng plus the P2-H sources)
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CURRICULUM = {"core": ROOT / "library/military/syllabus/curriculum.json", "eng": ROOT / "library/engineering/syllabus/curriculum.json"}
FIELDS = ("items", "testout", "brief", "reading")


def load(app):
    return json.loads(CURRICULUM[app].read_text())["modules"]


def attach(modules, app):
    """Adds the curriculum fields to each module dict in place, and returns the list."""
    cur = load(app)
    for m in modules:
        for f in FIELDS:
            m.pop(f, None)
            if cur.get(m["id"], {}).get(f):
                m[f] = cur[m["id"]][f]
    return modules
