"""Merge a document extracted in page ranges by several processes (EXTRACT_OUT=<dir>
extract.py DOC --pages A-B) into eng/build/lib/<DOC>, then re-resolve its page labels.

    python eng/tools/merge_parts.py DOC eng/build/part-a eng/build/part-b ...
"""
import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "core" / "tools" / "extract"))
import extract as core  # noqa: E402

doc, parts = sys.argv[1], sys.argv[2:]
dst = ROOT / "eng" / "build" / "lib" / doc
(dst / "fig").mkdir(parents=True, exist_ok=True)
pages = json.loads((dst / "pages.json").read_text()) if (dst / "pages.json").exists() else {}
figs = json.loads((dst / "figures.json").read_text()) if (dst / "figures.json").exists() else {}
for part in parts:
    src = Path(part) / doc
    pages.update(json.loads((src / "pages.json").read_text()))
    figs.update(json.loads((src / "figures.json").read_text()))
    for f in (src / "fig").glob("*.webp"):
        shutil.copy2(f, dst / "fig" / f.name)
core.resolve_labels(pages, doc)
(dst / "pages.json").write_text(json.dumps(pages, ensure_ascii=False))
(dst / "figures.json").write_text(json.dumps(figs, ensure_ascii=False))
print(f"{doc}: {len(pages)} pages, {sum(len(v) for v in figs.values())} figures")
