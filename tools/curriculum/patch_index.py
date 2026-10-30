"""Write a new lib/index.json from the published one, with the current syllabus and the
topic-based curriculum, without the library on disk (the PDF extraction outputs are not in git).

  python3 tools/curriculum/patch_index.py --app core --base <published lib/index.json> --out <new index.json>
  python3 tools/curriculum/patch_index.py --app eng  --base ... --out ...

What changes, module by module:
  - modules new in the syllabus are added (their part too); sources whose document is not in
    the published library (B13 before its OCR) wait for it, so such a module may have none;
  - an existing module keeps its section headings and every source it had (never removal),
    and takes the syllabus's tier, titles, prerequisites and added sources;
  - every module gets its curriculum fields (enrich.attach): items, testout, brief, reading.
The documents, the asset map and the version stay as published: no text, figure or page-image
file changes, so the copies browsers keep under that version stay valid. Only index.json is
republished.
"""
import argparse
import importlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SYL = {"core": ROOT / "library/military/syllabus", "eng": ROOT / "library/engineering/syllabus"}
sys.path.insert(0, str(Path(__file__).resolve().parent))
from enrich import attach  # noqa: E402


def dumps(value):
    """Compact JSON, as pack.py writes it (U+FFFD escaped: the artifact publisher rejects it)."""
    return json.dumps(value, ensure_ascii=False, separators=(",", ":")).replace("�", "\\ufffd")


def key(s):
    return (s["doc"], tuple(s["pages"]), s["role"])


def patch(app, base):
    sys.path.insert(0, str(SYL[app]))
    syl = importlib.import_module("syllabus")
    docs = base["docs"]
    old = {m["id"]: m for m in base["modules"]}
    modules = []
    for m in syl.MODULES:
        m = json.loads(json.dumps(m))
        sources = []
        for s in m["sources"]:
            if s["doc"] not in docs:
                continue
            s["pages"] = list(s["pages"] or (1, docs[s["doc"]]["pages"]))
            sources.append(s)
        prev = old.get(m["id"])
        if prev:
            have = {key(s) for s in sources}
            # a published source the syllabus no longer lists (e.g. a ref now taught as a
            # supplement over the same pages) stays, unless the same pages are now taught
            taught = {(s["doc"], tuple(s["pages"])) for s in sources if s["role"] != "ref"}
            for s in prev["sources"]:
                if key(s) not in have and not (s["role"] == "ref" and (s["doc"], tuple(s["pages"])) in taught):
                    sources.append(s)
            m["sections"] = prev.get("sections", [])
        else:
            m["sections"] = []
        m["sources"] = sources
        modules.append(m)
    ids = {m["id"] for m in modules}
    lost = [i for i in old if i not in ids]
    if lost:
        raise SystemExit(f"modules of the published index missing from the syllabus: {lost}")
    out = dict(base)
    out["parts"] = [{"id": i, "title": t} for i, t in syl.PARTS]
    out["modules"] = attach(modules, app)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--app", choices=["core", "eng"], required=True)
    ap.add_argument("--base", required=True, help="the published lib/index.json")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    base = json.loads(Path(a.base).read_text())
    new = patch(a.app, base)
    Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    Path(a.out).write_text(dumps(new))
    added = [m["id"] for m in new["modules"] if m["id"] not in {x["id"] for x in base["modules"]}]
    print(f"{a.app}: {len(base['modules'])} -> {len(new['modules'])} modules (added {', '.join(added)}); "
          f"{len(new['parts'])} parts; {Path(a.out).stat().st_size / 1e6:.2f} MB -> {a.out}")


if __name__ == "__main__":
    main()
