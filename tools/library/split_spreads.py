"""Split the two-page scanned spreads of Kassakian into single book pages.

Each sheet holds one 1-bit scan of two facing pages, stored sideways (/Rotate 90 or 270). The scan is
turned upright, cut at the gutter (the emptiest column run in the middle band), and each half saved as
its own page at the scan's 200 dpi. Usage: split_kass.py in.pdf out.pdf
"""
import io
import sys
import numpy as np
import pymupdf as fitz
from PIL import Image

src = fitz.open(sys.argv[1])
out = fitz.open()
DPI = 200
for i, p in enumerate(src):
    xref = p.get_images(full=True)[0][0]
    pix = fitz.Pixmap(src, xref)
    im = Image.frombytes("L", (pix.width, pix.height), pix.samples).rotate(-p.rotation, expand=True)
    a = np.asarray(im)
    ink = np.convolve((a < 128).sum(axis=0).astype(float), np.ones(15) / 15, "same")
    lo, hi = int(a.shape[1] * 0.38), int(a.shape[1] * 0.62)
    band = ink[lo:hi]
    empty = band <= band.min() + max(2, 0.02 * band.max())
    best, run, start = (0, 0), 0, 0
    for j, e in enumerate(empty):
        run = run + 1 if e else 0
        if run == 1:
            start = j
        if run > best[0]:
            best = (run, start)
    x = lo + best[1] + best[0] // 2
    for box in ((0, 0, x, a.shape[0]), (x, 0, a.shape[1], a.shape[0])):
        half = im.crop(box).convert("1")
        buf = io.BytesIO()
        half.save(buf, "PNG", optimize=True)
        w, h = half.size[0] * 72 / DPI, half.size[1] * 72 / DPI
        page = out.new_page(width=w, height=h)
        page.insert_image(page.rect, stream=buf.getvalue())
out.save(sys.argv[2], garbage=4, deflate=True)
print(out.page_count)
