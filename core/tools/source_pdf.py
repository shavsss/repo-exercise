"""The PDF of a library document. A document too large for one file in git is kept
as a folder of parts (e.g. books/12_SMAD/SMAD_0001-0100.pdf, ...); its pages are
then read from one merged copy under core/build/merged/, made on first use."""
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1].parent
MERGED = ROOT / "core" / "build" / "merged"


def source_pdf(lib, rel):
    path = Path(lib) / rel
    if not path.is_dir():
        return path
    parts = sorted(path.glob("*.pdf"))
    merged = MERGED / f"{path.name}.pdf"
    if not merged.exists() or merged.stat().st_mtime < max(p.stat().st_mtime for p in parts):
        MERGED.mkdir(parents=True, exist_ok=True)
        subprocess.run(["pdfunite", *map(str, parts), str(merged)], check=True)
    return merged
