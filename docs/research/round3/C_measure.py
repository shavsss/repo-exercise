"""Measure the real clarify turns: words, blocks, headings, question/answer ratio, reading time."""
import re, sys
p = sys.argv[1]
t = open(p, encoding="utf-8").read()
parts = re.split(r"^===== (user|assistant) \| words=(\d+) =====$", t, flags=re.M)
turns = []
for i in range(1, len(parts), 3):
    turns.append((parts[i], int(parts[i+1]), parts[i+2].strip()))
print(f"{'#':>2} {'Q words':>7} {'A words':>7} {'ratio':>6} {'read min':>8} {'##':>3} {'blocks':>6}  block kinds")
q = None
for role, w, body in turns:
    if role == "user":
        q = (w, body)
        continue
    blocks = re.findall(r"^```(\w+)", body, flags=re.M)
    heads = len(re.findall(r"^#{2,3} ", body, flags=re.M))
    tags = len(re.findall(r"\[\[2\.5:", body))
    kinds = {}
    for b in blocks: kinds[b] = kinds.get(b, 0) + 1
    ratio = w / max(q[0], 1)
    print(f"{len([1 for x in turns[:turns.index((role,w,body))] if x[0]=='assistant'])+1:>2} {q[0]:>7} {w:>7} {ratio:>6.0f} {w/180:>8.1f} {heads:>3} {len(blocks):>6}  {kinds} 2.5tags={tags} | Q: {q[1][:60]!r}")
