"""Chapter and section maps of every source (toc/<DOC>.md), and helpers that
turn "chapter 4, sections 4.12–4.14" into PDF page ranges.

Map format, one entry per line:
  FRONT|BACK a-b what           front or back matter
  CH|APP num a-b title          a chapter or appendix (inclusive PDF range)
    S num a title               a section starting at PDF page a
The CH/APP/FRONT/BACK ranges of a map cover the whole document.
"""
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
_maps = {}


def load(doc):
    if doc not in _maps:
        units = []
        for line in (HERE / "toc" / f"{doc}.md").read_text().splitlines():
            m = re.match(r"^(FRONT|BACK|CH|APP) (?:(\S+) )?(\d+)-(\d+) ?(.*)$", line)
            if m and not (m.group(1) in ("CH", "APP") and m.group(2) is None):
                kind, num, a, b, title = m.groups()
                units.append({"kind": kind, "num": num, "a": int(a), "b": int(b), "title": title, "secs": []})
                continue
            m = re.match(r"^\s+S (\S+) (\d+) ?(.*)$", line)
            if m and units:
                units[-1]["secs"].append((m.group(1), int(m.group(2)), m.group(3)))
        _maps[doc] = units
    return _maps[doc]


def unit(doc, num):
    """A chapter by number, or an appendix as "APP:<num>" (or by its own
    number when no chapter shares it)."""
    num = str(num)
    kinds = ("CH", "APP")
    if num.startswith("APP:"):
        kinds, num = ("APP",), num[4:]
    for u in load(doc):
        if u["kind"] in kinds and u["num"] == num:
            return u
    raise KeyError(f"{doc}: no chapter {num}")


def title(doc, num):
    return unit(doc, num)["title"]


def chapter_pages(doc, num):
    u = unit(doc, num)
    return u["a"], u["b"]


def chapters_pages(doc, first, last):
    return unit(doc, first)["a"], unit(doc, last)["b"]


def section_pages(doc, num, first=None, last=None):
    """Pages of chapter `num` from section `first` (None: the chapter start) to
    the end of section `last` (None: the chapter end). The end of a section is
    the page before the next listed section starts."""
    u = unit(doc, num)
    secs = u["secs"]
    keys = [s[0] for s in secs]
    a = u["a"]
    if first is not None:
        a = secs[keys.index(str(first))][1]
    b = u["b"]
    if last is not None:
        i = keys.index(str(last), keys.index(str(first)) if first is not None else 0)
        nxt = [s[1] for s in secs[i + 1:] if s[1] > secs[i][1]]
        if nxt:
            b = nxt[0] - 1
    if not (u["a"] <= a <= b <= u["b"]):
        raise ValueError(f"{doc} ch {num}: sections {first}–{last} give {a}-{b}")
    return a, b


def matter(doc, kind):
    """All FRONT or BACK ranges of a document."""
    return [(u["a"], u["b"], u["title"]) for u in load(doc) if u["kind"] == kind]
