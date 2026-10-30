"""Word counts of the new-design answers in C_experiment.md (text between <!--A:id--> and <!--/A-->, chips included)."""
import re, sys, statistics
t = open(sys.argv[1], encoding="utf-8").read()
res = {}
for m in re.finditer(r"<!--A:([RN][\w-]*)-->(.*?)<!--/A-->", t, flags=re.S):
    body = re.sub(r"^```\w*|^```|^@\w+:", "", m.group(2), flags=re.M)
    res[m.group(1)] = len(body.split())
for k, v in res.items(): print(f"{k:<7} {v:>4}")
real = {"R1":1705,"R2":1205,"R3":1171,"R4":189,"R6":1079,"R7":2177,"R8":2002}
new = sum(res[k] for k in real)
print("real total", sum(real.values()), "new total", new, f"share {new/sum(real.values()):.0%}")
for k in real: print(k, f"ratio {res[k]/real[k]:.2f}")
ns = [res[k] for k in res if k.startswith("N")]
print("N median", statistics.median(ns), "min", min(ns), "max", max(ns))
