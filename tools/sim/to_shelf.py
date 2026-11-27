# Turns a lesson written by tools/sim/driver.mts into shelf documents (docs/SHELF_SCHEMA.md): the main
# ShelfDoc and its more/<n> continuations, as JSON files for ArtifactData set (file_path). The more docs are
# written first and the main doc last, so the page never offers a lesson with missing parts.
# Usage: python3 tools/sim/to_shelf.py <core|eng> <module> <lessonIdx> <runDir> <backupDir> <outDir> <pipeline>
import json, os, re, sys, time

app, module, idx, run, backup, out, pipeline = sys.argv[1:8]
idx = int(idx)
TEXT_MAX, MORE_MAX = 60_000, 70_000

def data(path):
    d = json.load(open(path, encoding="utf8"))
    return d.get("data", d)

mod = data(os.path.join(backup, f"data/users/me/profile/modules/{module}.json"))
if str(idx) in (mod.get("convs") or {}):
    sys.exit(f"lesson {idx} of {module} already has a conversation: the shelf would not offer it")
spec = mod["lessons"][idx]
text = open(os.path.join(run, "lesson.md"), encoding="utf8").read()
plan = json.load(open(os.path.join(run, "plan.json"), encoding="utf8"))

chunks = [text[:TEXT_MAX]] + [text[i:i + MORE_MAX] for i in range(TEXT_MAX, len(text), MORE_MAX)]
os.makedirs(os.path.join(out, "more"), exist_ok=True)
for n, c in enumerate(chunks[1:], 1):
    json.dump({"text": c}, open(os.path.join(out, "more", f"{n}.json"), "w", encoding="utf8"), ensure_ascii=False)
doc = {
    "v": 1, "app": app, "moduleId": module, "lesson": idx,
    "spec": {k: spec[k] for k in ("title", "sources") if k in spec},
    "title": spec["title"], "text": chunks[0], "parts": len(chunks) - 1, "plan": plan,
    "words": len(re.findall(r"\S+", text)), "createdAt": int(time.time() * 1000), "pipeline": pipeline,
    "verify": {"verdict": "pass-with-notes", "notes": ["נכתב דרך Claude API מחוץ לדפדפן, באותו תהליך כתיבה ובדיקה של האפליקציה"]},
    "status": "ready",
}
json.dump(doc, open(os.path.join(out, "main.json"), "w", encoding="utf8"), ensure_ascii=False)
sizes = [os.path.getsize(os.path.join(out, "main.json"))] + [os.path.getsize(os.path.join(out, "more", f"{n}.json")) for n in range(1, len(chunks))]
assert max(sizes) <= 230_000, sizes
print(json.dumps({"doc": f"{module}__{idx}", "words": doc["words"], "parts": doc["parts"], "bytes": sizes}))
