"""Checks a layered plan: every prereq of a module is in an earlier layer, or earlier in the same track.
Usage: python3 check_layers.py <app> <plan.py>   (plan.py defines LAYERS=[(name,[(track,[ids...]),...]),...] and NEW={id:(title,pages,[pre])})"""
import sys,re
exec(open("tmp/syllabus/partgraph.py").read().split("for app in sys.argv")[0])
app,planf=sys.argv[1],sys.argv[2]
mods,order,pt=load(app)
ns={}; exec(open(planf).read(),ns)
LAYERS,NEW=ns["LAYERS"],ns.get("NEW",{})
ext=ns.get("EXTERNAL",set())   # ids from the other app, assumed done (checked separately)
for k,v in NEW.items(): mods[k]=dict(part="NEW",tier="cor",title=v[0],pre=v[2],pages=v[1])
for k,v in ns.get("EXTRA",{}).items():
    if k in mods: mods[k]["pre"]=mods[k]["pre"]+v
def expand(ids):
    out=[]
    for x in ids:
        m=re.match(r"(M\d+)\.(\d+)-(\d+)$",x)
        if m: out+= [f"{m[1]}.{i}" for i in range(int(m[2]),int(m[3])+1) if f"{m[1]}.{i}" in mods]
        elif re.match(r"P\d+$",x): out+=[k for k,v in mods.items() if v["part"]==x and v["tier"]!="ref"]
        else: out.append(x)
    return out
where={}; errs=[]; seen=set()
for li,(lname,tracks) in enumerate(LAYERS):
    for tn,ids in tracks:
        for pos,k in enumerate(expand(ids)):
            if k in seen: errs.append(f"duplicate {k}")
            seen.add(k); where[k]=(li,tn,pos)
for k,m in mods.items():
    if m["tier"]=="ref": continue
    if k not in where: errs.append(f"unplaced {k} ({m['part']}) {m['title'][:40]}"); continue
    li,tn,pos=where[k]
    for p in m["pre"]:
        if p in ext: continue
        if p not in where:
            if p in mods and mods[p]["tier"]=="ref": continue
            errs.append(f"{k}: prereq {p} not placed"); continue
        pl,ptn,ppos=where[p]
        if pl>li or (pl==li and (ptn!=tn or ppos>pos)):
            errs.append(f"{k} (L{li} {tn}) needs {p} (L{pl} {ptn})")
for li,(lname,tracks) in enumerate(LAYERS):
    tot=0; parts=[]
    for tn,ids in tracks:
        pg=sum(mods[k]["pages"] for k in expand(ids) if k in mods and mods[k]["tier"] in("cor","adv"))
        tot+=pg; parts.append(f"{tn}:{pg}p")
    print(f"L{li} {lname}: {' | '.join(parts)}")
print(f"{len(errs)} problems"); print(*errs,sep="\n")
