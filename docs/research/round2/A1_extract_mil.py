"""Extract per-page text of every Lanchester source PDF with pdftotext (read-only on repo).
Output: round2/cache/mil_text.json  {doc: {pdf_page(str): text}}"""
import json, os, subprocess, sys
REPO = "/home/user/repo-exercise/library/military"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cache", "mil_text.json")
syl = json.load(open(f"{REPO}/syllabus/syllabus.json"))
res = {}
def pdf_pages(path):
    r = subprocess.run(["pdftotext", "-layout", "-q", path, "-"], capture_output=True, text=True, errors="ignore")
    return r.stdout.split("\f")
for doc, info in syl["docs"].items():
    p = os.path.join(REPO, info["file"])
    pages = {}
    if os.path.isdir(p):  # SMAD split in 100-page files
        for f in sorted(os.listdir(p)):
            a = int(f.split("_")[1].split("-")[0])
            for i, t in enumerate(pdf_pages(os.path.join(p, f))):
                pages[str(a + i)] = t
    else:
        for i, t in enumerate(pdf_pages(p)):
            pages[str(i + 1)] = t
    res[doc] = pages
    print(doc, len(pages), file=sys.stderr)
json.dump(res, open(OUT, "w"))
