"""Images in the packed library as WebP data URIs (shared by core/tools/pack.py and eng/tools/pack.py)."""
import base64
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageChops

# A page image wider than this is scaled down: scans with oversized pages (about 2,400 px wide at
# 110 dpi) stay readable at this width and take about a quarter of the space.
MAX_WIDTH = 1000


def webp_data(path):
    return "data:image/webp;base64," + base64.b64encode(Path(path).read_bytes()).decode()


def save_webp(im, out, quality):
    """Save as WebP, lossy or lossless, whichever is smaller. A scan of black text on white is
    smaller lossless and stays sharp; a photo is smaller lossy. An image with no colour is saved gray."""
    if im.mode != "L":
        rgb = im.convert("RGB")
        r, g, b = rgb.split()
        if ImageChops.difference(r, g).getbbox() is None and ImageChops.difference(g, b).getbbox() is None:
            im = r
    out = Path(out)
    lossless = out.with_suffix(".lossless.webp")
    im.save(out, "WEBP", quality=quality, method=6)
    im.save(lossless, "WEBP", lossless=True, method=6)
    if lossless.stat().st_size < out.stat().st_size:
        lossless.replace(out)
    else:
        lossless.unlink()
    return im.size


def page_image(pdf, page, dpi=110, quality=50):
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(["pdftoppm", "-f", str(page), "-l", str(page), "-r", str(dpi), "-gray", "-png", str(pdf), f"{tmp}/p"], check=True, capture_output=True)
        im = Image.open(next(Path(tmp).glob("p*.png")))
        if im.width > MAX_WIDTH:
            im = im.resize((MAX_WIDTH, round(im.height * MAX_WIDTH / im.width)), Image.LANCZOS)
        out = Path(tmp) / "p.webp"
        save_webp(im, out, quality)
        return webp_data(out)
