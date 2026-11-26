"""Round 9 (19.11.2026): systems architecture, software and the socio-technical side, as a spiral.

Applied after round 8 at the end of each syllabus.py:
  DOCS.update(round9.docs(app)); MODULES, PARTS = round9.apply(app, MODULES, PARTS)
and merged by build_curriculum.py (items, reading lists, item promotions).

The placement (docs/research/round8/ARCH_SOFTWARE_SOURCES.md, section 5):
  1. early: right after P1, the architecture vocabulary (M27.1 moves up; M27.12, M27.13 new);
  2. after the probability block and M27.3: the quantitative management tools (M27.4, M27.5, M27.8 move up);
  3. after the computing and networking modules: software design, the internet's design rationale,
     distributed systems papers, systems at scale, middleware (M22.17-M22.20, M23.20);
  4. recurring: the last core module of each technical part closes with an architecture case (items);
  5. late: the business side and a cross-domain capstone (M27.16, M27.17).
Round 10 (21.11.2026) is merged into the same data (ids R10:*): software and systems security (M22.21, after M22.15)
and security of AI systems (M29.9, after M29.7), sources W99 and W100; Lanchester M15.5 gets AI-enabled cyber items.
Round 11 (26.11.2026, the learner): one AI stage (P17 holds P18 and P29), RL right after deep learning, graphical
models and variational inference in the core, and items for the master's-level gaps (learning theory, kernels and SVM,
EM and HMM, mechanistic interpretability), ids R11:*.
Nothing is removed. A module never comes before one of its prerequisites (checked here).
The two apps stay separate: Lanchester gets its own module (M15.8), with no prerequisite across apps.
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
DATA = json.loads((HERE / "round9.json").read_text())


def docs(app):
    """{doc: (path, title)} that round 9 adds to this app's library."""
    return {d: tuple(v) for d, v in DATA["docs"].get(app, {}).items()}


def _check(order, by):
    pos = {k: i for i, k in enumerate(order)}
    for k in order:
        late = [p for p in by[k].get("prereq", []) if pos[p] > pos[k]]
        assert not late, f"round9: {k} comes before its prerequisites {late}"


def apply(app, modules, parts):
    spec = DATA["modules"].get(app, {})
    by = {m["id"]: m for m in modules}
    for mid, s in spec.get("new", {}).items():
        assert mid not in by, f"round9: {mid} exists"
        by[mid] = dict(id=mid, part=s["part"], tier=s["tier"], title=s["he"], en=s["en"], prereq=list(s["prereq"]),
                       sources=[dict(x) for x in s.get("sources", [])])
    for mid, tier in spec.get("tier", {}).items():
        by[mid]["tier"] = tier
    for mid, part in spec.get("part", {}).items():
        by[mid]["part"] = part
    for mid, srcs in spec.get("sources", {}).items():
        have = by[mid].setdefault("sources", [])
        have += [dict(x) for x in srcs if x not in have]
    for mid, pre in spec.get("prereq", {}).items():
        have = by[mid].get("prereq", [])
        by[mid]["prereq"] = have + [p for p in pre if p not in have]
    for m in by.values():
        missing = [p for p in m.get("prereq", []) if p not in by]
        assert not missing, f"round9: {m['id']}: unknown prerequisites {missing}"
    # placement: each listed module (new or moved) goes right after its anchor, in the listed order
    order = [m["id"] for m in modules]
    place = spec.get("place", [])
    placed = {mid for mid, _ in place}
    order = [k for k in order if k not in placed]
    for mid, anchor in place:
        order.insert(order.index(anchor) + 1, mid)
    missing = [k for k in by if k not in order]
    assert not missing, f"round9: not placed {missing}"
    _check(order, by)
    # parts: a new title, or null to drop a part whose modules moved to another
    titles = spec.get("parts", {})
    used = {m["part"] for m in by.values()}
    parts = [(pid, titles.get(pid) or t) for pid, t in parts if titles.get(pid, t) is not None]
    assert all(pid in used for pid, _ in parts if pid in titles), "round9: a retitled part has no modules"
    assert not [p for p in used if p not in {pid for pid, _ in parts}], "round9: a module's part was dropped"
    return [by[k] for k in order], parts


def items(app):
    """{module id: [new curriculum items]} (new modules, items added to existing modules, architecture cases)."""
    return DATA["items"].get(app, {})


def reading(app):
    """{module id: [reading-list entries]}."""
    return DATA["reading"].get(app, {})


def promote(app):
    """{item id: importance}: items whose importance changes (S to K)."""
    return DATA["promote"].get(app, {})
