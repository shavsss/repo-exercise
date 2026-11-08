"""Copy documents from one packed lib/index.json into another, for either lab.

pack.py --only writes an index with new or re-extracted documents; this applies the same
document entries onto any other index (the published one, or one another change already
patched with new modules), so the two changes can land in either order. Modules, parts and
the other documents are left as they are in the base.

    python core/tools/merge_index.py --base <published lib/index.json> --src <packed lib/index.json> \
        --docs B13 [--asset-urls core/tools/asset_urls.json] --out <lib/index.json>

The asset-store URLs of the copied documents' bundles come from --asset-urls (once uploaded)
or from --src; a bundle with no URL is loaded from lib/. The version changes, so the page
reloads its cached files.
"""
import argparse
import hashlib
import json
from pathlib import Path


def dumps(value):
    """Compact JSON; U+FFFD is escaped because the artifact publisher rejects it."""
    return json.dumps(value, ensure_ascii=False, separators=(",", ":")).replace("�", "\\ufffd")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", required=True)
    ap.add_argument("--src", required=True)
    ap.add_argument("--docs", nargs="+", required=True)
    ap.add_argument("--asset-urls")
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    base = json.loads(Path(args.base).read_text())
    src = json.loads(Path(args.src).read_text())
    urls = json.loads(Path(args.asset_urls).read_text()) if args.asset_urls else {}
    assets = base.setdefault("assets", {})
    from_lib = []
    for doc in args.docs:
        old = base["docs"].get(doc, {})
        entry = src["docs"][doc]
        for name in old.get("figFiles", []) + old.get("pgFiles", []):
            assets.pop(name, None)  # bundles of the replaced entry
        for name in entry["figFiles"] + entry["pgFiles"]:
            url = urls.get(name) or src.get("assets", {}).get(name)
            if url:
                assets[name] = url
            else:
                from_lib.append(name)
        base["docs"][doc] = entry
    digest = hashlib.sha1((base.get("version", "") + dumps({d: base["docs"][d] for d in args.docs}) + dumps(assets)).encode())
    base["version"] = digest.hexdigest()[:12]
    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    Path(args.out).write_text(dumps(base))
    print(f"{args.out}: {', '.join(args.docs)} copied; version {base['version']}")
    if from_lib:
        print("no asset URL, so the page loads these from lib/ (publish them there, or upload them"
              " to the asset store and pass --asset-urls):", ", ".join(from_lib))


if __name__ == "__main__":
    main()
