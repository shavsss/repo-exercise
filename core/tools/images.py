"""Images in the packed library as WebP data URIs (shared by core/tools/pack.py and eng/tools/pack.py)."""
import base64
import subprocess
import tempfile
from pathlib import Path

from PIL import Image

# A page image wider than this is scaled down: scans with oversized pages (about 2,400 px wide at
# 110 dpi) stay readable at this width and take about a quarter of the space.
MAX_WIDTH = 1200


def webp_data(path):
    return "data:image/webp;base64," + base64.b64encode(Path(path).read_bytes()).decode()


def page_image(pdf, page, dpi=110, quality=50):
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(["pdftoppm", "-f", str(page), "-l", str(page), "-r", str(dpi), "-gray", "-png", str(pdf), f"{tmp}/p"], check=True, capture_output=True)
        im = Image.open(next(Path(tmp).glob("p*.png")))
        if im.width > MAX_WIDTH:
            im = im.resize((MAX_WIDTH, round(im.height * MAX_WIDTH / im.width)), Image.LANCZOS)
        out = Path(tmp) / "p.webp"
        im.save(out, "WEBP", quality=quality, method=6)
        return webp_data(out)
