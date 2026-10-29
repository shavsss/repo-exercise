"""Builds the Hebrew dictionary of the summaries notebook (spelling and word completion), shared by
both labs: eng/app/artifact/dict/he.txt and core/app/artifact/dict/he.txt (build outputs, not in git).

Sources:
  * a word-frequency list of Hebrew (hermitdave/FrequencyWords, OpenSubtitles 2018, he_full.txt),
    words seen at least 3 times;
  * the Hebrew words of this repository's syllabi, rules and docs (the course vocabulary), which
    rank high in completion.

Format (one word a line, sorted): the length of the prefix shared with the previous word (one base-36
character), the rest of the word, and its frequency band ('a' rare … 'j' very common).

    python3 tools/dict/build_dict.py [path/to/he_full.txt]
"""
import math
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
URL = "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/he/he_full.txt"
WORD = re.compile(r'[א-ת]+(?:["\'][א-ת]+)?')
B36 = "0123456789abcdefghijklmnopqrstuvwxyz"


def frequency_list(path: str | None) -> dict[str, int]:
    text = Path(path).read_text(encoding="utf-8") if path else urllib.request.urlopen(URL).read().decode("utf-8")
    words: dict[str, int] = {}
    for line in text.splitlines():
        parts = line.split()
        if len(parts) != 2 or int(parts[1]) < 3:
            continue
        w = parts[0].replace("״", '"').replace("׳", "'")
        if WORD.fullmatch(w):
            words[w] = max(words.get(w, 0), int(parts[1]))
    return words


def course_words() -> set[str]:
    found: set[str] = set()
    for base in ["library", "docs", "notes", "eng/app/src", "core/app/src"]:
        for p in (ROOT / base).rglob("*"):
            if p.suffix in {".md", ".json", ".ts", ".tsx"} and "node_modules" not in p.parts and p.stat().st_size < 5_000_000:
                found.update(w for w in WORD.findall(p.read_text(encoding="utf-8", errors="ignore")) if len(w) > 1)
    return found


def main():
    words = frequency_list(sys.argv[1] if len(sys.argv) > 1 else None)
    band = {w: min(9, int(math.log10(c) * 1.6)) for w, c in words.items()}
    for w in course_words():
        band[w] = max(band.get(w, 0), 6)
    out, prev = [], ""
    for w in sorted(band):
        k = 0
        while k < min(len(prev), len(w), 35) and prev[k] == w[k]:
            k += 1
        out.append(B36[k] + w[k:] + chr(97 + band[w]))
        prev = w
    data = "\n".join(out) + "\n"
    for lab in ["eng", "core"]:
        dest = ROOT / lab / "app/artifact/dict/he.txt"
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(data, encoding="utf-8")
        print(dest.relative_to(ROOT), len(band), "words", len(data.encode()), "bytes")


if __name__ == "__main__":
    main()
