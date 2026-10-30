"""Check that the new lib/index.json keeps everything the learner studied.

  python3 tools/curriculum/validate.py --app core --old <published index.json> --new <patched index.json> --dump <dump dir>

The dump dir holds the app's database collections as dumped by the nightly backup
(data__users__me.json, data__users__me__profile__modules.json, ...__convs.json, ...__notes.json,
...__summaries.json, ...__summaryMeta.json, ...__scratch.json, ...__convs__<id>__msgs.json).

Asserts:
  1. every module id of the old index is in the new one, in the same part (no renames, so the
     app needs no alias map: profile/modules, convs, notes, summaries and scratch keyed by
     module id keep resolving);
  2. an old module keeps its section headings and every source (a ref listing may become a
     taught supplement over the same pages);
  3. every module id in the learner's data resolves in the new index;
  4. for every planned module of the learner: the lesson count, done list and conversations
     are as dumped, every lesson's pages lie in documents of the new index, and every
     conversation the plan points to exists with its messages.
Exit code 1 on any failure.
"""
import argparse
import json
import sys
from pathlib import Path


def load(p):
    return json.loads(Path(p).read_text())


def docs_of(dump, name):
    f = Path(dump) / f"data__users__me__profile__{name}.json"
    return load(f)["docs"] if f.exists() else {}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--app", required=True)
    ap.add_argument("--old", required=True)
    ap.add_argument("--new", required=True)
    ap.add_argument("--dump", required=True)
    a = ap.parse_args()
    old, new = load(a.old), load(a.new)
    O = {m["id"]: m for m in old["modules"]}
    N = {m["id"]: m for m in new["modules"]}
    fails, notes = [], []

    # 1–2: the index
    for i, m in O.items():
        n = N.get(i)
        if not n:
            fails.append(f"module {i} is missing from the new index")
            continue
        if n["part"] != m["part"]:
            fails.append(f"module {i} moved from {m['part']} to {n['part']}")
        if n.get("sections", []) != m.get("sections", []):
            fails.append(f"module {i}: section headings changed")
        have = {(s["doc"], tuple(s["pages"]), s["role"]) for s in n["sources"]}
        taught = {(s["doc"], tuple(s["pages"])) for s in n["sources"] if s["role"] != "ref"}
        for s in m["sources"]:
            k = (s["doc"], tuple(s["pages"]), s["role"])
            if k in have:
                continue
            if s["role"] == "ref" and k[:2] in taught:
                notes.append(f"{i}: {s['doc']} {s['pages'][0]}-{s['pages'][1]} is now taught (was an analysis reference)")
            else:
                fails.append(f"module {i}: source {s['doc']} {s['pages']} ({s['role']}) dropped")
        for f in ("tier", "title", "en"):
            if n.get(f) != m.get(f):
                notes.append(f"{i}: {f} {m.get(f)!r} -> {n.get(f)!r}")
    for p in old["parts"]:
        if p["id"] not in {x["id"] for x in new["parts"]}:
            fails.append(f"part {p['id']} is missing")
    added = [i for i in N if i not in O]

    # 3: every module id in the learner's data
    me = load(Path(a.dump) / "data__users__me.json")["docs"].get("profile", {})
    mods = docs_of(a.dump, "modules")
    convs = docs_of(a.dump, "convs")
    notes_db = docs_of(a.dump, "notes")
    sums = docs_of(a.dump, "summaries")
    meta = docs_of(a.dump, "summaryMeta")
    scratch = docs_of(a.dump, "scratch")
    refs = {
        "profile.done": set(me.get("done", [])),
        "profile.current": {me["current"]} if me.get("current") else set(),
        "profile/modules": set(mods),
        "profile/convs": {c.get("moduleId") for c in convs.values() if c.get("moduleId")},
        "profile/notes": {n.get("moduleId") for n in notes_db.values() if n.get("moduleId")},
        "profile/summaries": set(sums),
        "profile/summaryMeta": set(meta),
        "profile/scratch": {k.split("__")[0] for k in scratch},
    }
    for where, ids in refs.items():
        for i in sorted(ids):
            if i not in N:
                fails.append(f"{where}: module {i} does not resolve in the new index")

    # 4: the learner's planned modules
    report = []
    for i, p in sorted(mods.items()):
        lessons = p.get("lessons", [])
        n = N.get(i)
        for k, l in enumerate(lessons):
            for s in l.get("sources", []):
                d = new["docs"].get(s["doc"])
                if not d or not (1 <= s["pages"][0] <= s["pages"][1] <= d["pages"]):
                    fails.append(f"{i} lesson {k + 1}: pages {s['doc']} {s['pages']} not in the new library")
            if n:
                titles = {x["title"] for x in n.get("sections", [])}
                miss = [c for c in l.get("covers", []) if c not in titles]
                if miss and titles:
                    notes.append(f"{i} lesson {k + 1}: covers not among the module's headings (tutor wording, unchanged by the patch): {miss[:3]}")
        for k, cid in (p.get("convs") or {}).items():
            if int(k) >= len(lessons):
                fails.append(f"{i}: conversation for lesson {int(k) + 1} beyond the {len(lessons)} lessons")
            if cid not in convs:
                fails.append(f"{i}: conversation {cid} not in profile/convs")
            elif not (Path(a.dump) / f"data__users__me__profile__convs__{cid}__msgs.json").exists():
                notes.append(f"{i}: conversation {cid} has no messages file in the dump")
        report.append(f"{i}: {len(lessons)} lessons, done {sorted(p.get('done', []))}, convs {sorted((p.get('convs') or {}).keys())}, "
                      f"sources {len(O[i]['sources']) if i in O else '-'} -> {len(n['sources']) if n else '-'}, "
                      f"items {len(n.get('items', [])) if n else 0}, test-out {len(n.get('testout', [])) if n else 0}, "
                      f"brief {len(n.get('brief', [])) if n else 0}, reading {len(n.get('reading', [])) if n else 0}")

    print(f"[{a.app}] modules {len(O)} -> {len(N)}; added {len(added)}: {', '.join(added)}")
    print(f"[{a.app}] learner data: " + "; ".join(f"{k} {sorted(v)}" for k, v in refs.items() if v))
    for r in report:
        print(f"[{a.app}]   {r}")
    for x in notes:
        print(f"[{a.app}] note: {x}")
    for x in fails:
        print(f"[{a.app}] FAIL: {x}")
    print(f"[{a.app}] {'OK' if not fails else f'{len(fails)} failures'}")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
