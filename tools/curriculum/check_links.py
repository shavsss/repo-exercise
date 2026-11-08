"""Check the links of the P2-H sources (tools/curriculum/sources_p2h.json) and print one line each.

  python3 tools/curriculum/check_links.py [--write]

HEAD with redirects, then a ranged GET when HEAD is refused. Sites that answer scripts with
403/202 (gao.gov, jcs.mil, dia.mil, irp.fas.org, publishers) are reported as such; their titles
were confirmed by web search, and they open in a browser. --write stores the result in each
item's "status" (ok / doi / blocked / dead), keeping "doi" for DOI links that resolve.
"""
import json
import subprocess
import sys
from pathlib import Path

H = Path(__file__).resolve().parent / "sources_p2h.json"
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"


def probe(url, head=True):
    args = ["curl", "-sSL", "-o", "/dev/null", "-m", "30", "-A", UA, "-w", "%{http_code} %{url_effective}"]
    args += ["-I"] if head else ["-r", "0-2000"]
    out = subprocess.run([*args, url], capture_output=True, text=True).stdout.strip().split(" ", 1)
    return int(out[0] or 0), (out[1] if len(out) > 1 else "")


def main():
    data = json.loads(H.read_text())
    bad = 0
    for x in data["items"]:
        code, final = probe(x["url"])
        if code not in (200, 206):
            code, final = probe(x["url"], head=False)
        if code in (200, 206) and "/maint" in final:
            st = "blocked"  # DTIC answers with its maintenance page; the record exists (web search)
        elif code in (200, 206):
            st = "doi" if x.get("doi") and x["url"].startswith("https://doi.org/") else "ok"
        elif code in (202, 403, 405) or (x.get("doi") and final and "doi.org" not in final):
            st = "doi" if x.get("doi") else "blocked"
        else:
            st, bad = "dead", bad + 1
        print(f"{x['id']} {x['module']:7} {code} {st:8} {x['url']}" + (f" -> {final}" if final and final != x["url"] else ""))
        if "--write" in sys.argv:
            x["status"] = st
    if "--write" in sys.argv:
        H.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    print(f"{len(data['items'])} links, {bad} dead")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
