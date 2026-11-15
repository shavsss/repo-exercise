"""Extract the round-8 documents, only the page ranges mapped to modules (scans get OCR there only).

Gilua's documents go to eng/build/lib, Lanchester's to core/build/lib; a document both apps use
is extracted once and copied. Usage: python3 extract_new.py [eng|mil ...]   (log: tmp/r8/extract.log)
"""
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
SRC = json.loads((ROOT / "tools/curriculum/round8_sources.json").read_text())
BUILD = {"eng": ROOT / "eng/build/lib", "mil": ROOT / "core/build/lib"}
TOOL = {"eng": ["python3", str(ROOT / "eng/tools/extract.py")], "mil": ["python3", str(ROOT / "core/tools/extract/extract.py")]}
LOG = open(ROOT / "tmp/r8/extract.log", "a")


def ranges(app, doc):
    """Merged page ranges of this document over the app's modules, one page of margin."""
    rs = sorted((max(1, s["pages"][0] - 1), s["pages"][1] + 1) for ms in SRC["modules"][app].values() for s in ms if s["doc"] == doc)
    out = []
    for a, b in rs:
        if out and a <= out[-1][1] + 1:
            out[-1][1] = max(out[-1][1], b)
        else:
            out.append([a, b])
    return out


def done(app, doc, rs):
    f = BUILD[app] / doc / "pages.json"
    if not f.exists():
        return False
    have = set(json.loads(f.read_text()))
    return all(str(p) in have for a, b in rs for p in range(a, b + 1))


for app in sys.argv[1:] or ["eng", "mil"]:
    for doc in SRC["docs"][app]:
        rs = ranges(app, doc)
        if not rs or done(app, doc, rs):
            continue
        other = BUILD["eng" if app == "mil" else "mil"] / doc
        if other.exists() and done("eng" if app == "mil" else "mil", doc, rs):
            shutil.copytree(other, BUILD[app] / doc, dirs_exist_ok=True)
            print(app, doc, "copied", flush=True)
            continue
        rel = SRC["docs"][app][doc][0]
        pdf = ROOT / rel if app == "eng" else ROOT / "library/military" / rel
        info = subprocess.run(["pdfinfo", str(pdf)], capture_output=True, text=True).stdout
        n = int(next(l.split()[-1] for l in info.splitlines() if l.startswith("Pages:")))
        for a, b in rs:
            a, b = min(a, n), min(b, n)  # the margin may run past the last page
            r = subprocess.run([*TOOL[app], doc, "--pages", f"{a}-{b}"], cwd=ROOT, stdout=LOG, stderr=subprocess.STDOUT)
            print(app, doc, f"{a}-{b}", "ok" if r.returncode == 0 else f"FAILED {r.returncode}", flush=True)
