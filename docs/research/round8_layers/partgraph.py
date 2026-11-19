import re,sys
from collections import defaultdict
def load(app):
    mods={};order=[];part=None;ptitle={}
    for line in open(f"tmp/syllabus/{app}_modules.txt"):
        if line.startswith("## "):
            part=line.split()[1]; ptitle[part]=line[3:].strip(); order.append(part); continue
        m=re.match(r"(M[\d.]+) \[(\w*)\] (.*?) \| pre: (.*?) \| (\d+)p",line)
        if m: mods[m[1]]=dict(part=part,tier=m[2],title=m[3],pre=[x for x in m[4].split(",") if x and x!="-"],pages=int(m[5]))
    return mods,order,ptitle
for app in sys.argv[1:]:
    mods,order,pt=load(app)
    print("=====",app)
    dep=defaultdict(set); back=[]
    for k,m in mods.items():
        for p in m["pre"]:
            if p not in mods: continue
            q=mods[p]["part"]
            if q!=m["part"]: dep[m["part"]].add(q)
            if order.index(q)>order.index(m["part"]): back.append(f"{k}({m['part']}) needs {p}({q})")
    # layer = longest path
    layer={}
    def L(p,seen=()):
        if p in layer: return layer[p]
        if p in seen: return 0
        layer[p]=1+max([L(q,seen+(p,)) for q in dep[p]] or [0]); return layer[p]
    for p in order: L(p)
    for p in order:
        core=sum(1 for m in mods.values() if m["part"]==p and m["tier"]=="cor")
        pg=sum(m["pages"] for m in mods.values() if m["part"]==p and m["tier"] in("cor","adv"))
        print(f"L{layer[p]:<2} {pt[p][:55]:55} needs: {' '.join(sorted(dep[p],key=order.index))}  [{core} core, {pg}p]")
    print("BACKWARD:",*back,sep="\n  ")
