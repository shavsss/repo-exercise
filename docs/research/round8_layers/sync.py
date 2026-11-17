import re
exec(open("tmp/syllabus/partgraph.py").read().split("for app in sys.argv")[0])
E={}; exec(open("tmp/syllabus/eng_plan.py").read(),E)
M={}; exec(open("tmp/syllabus/mil_plan.py").read(),M)
emods,_,_=load("eng")
for k,v in E["NEW"].items(): emods[k]=dict(part="NEW",tier="cor",title=v[0],pre=v[2],pages=v[1])
def expand(ids,mods):
    out=[]
    for x in ids:
        m=re.match(r"(M\d+)\.(\d+)-(\d+)$",x)
        if m: out+=[f"{m[1]}.{i}" for i in range(int(m[2]),int(m[3])+1) if f"{m[1]}.{i}" in mods]
        elif re.match(r"P\d+$",x): out+=[k for k,v in mods.items() if v["part"]==x and v["tier"]!="ref"]
        else: out.append(x)
    return out
elayer={}
for li,(n,tr) in enumerate(E["LAYERS"]):
    for tn,ids in tr:
        for k in expand(ids,emods): elayer[k]=li
mmods,_,_=load("mil")
for k,v in M["NEW"].items(): mmods[k]=dict(part="NEW",tier="cor",title=v[0],pre=[],pages=v[1])
start={}; byname={b[0]:b for b in M["BLOCKS"]}
def S(name):
    if name in start: return start[name]
    _,ids,needs,epre,deep=byname[name]
    miss=[p for p in epre+deep if p not in elayer]
    if miss: print("UNKNOWN eng prereq",name,miss)
    e=max([elayer.get(p,0)+1 for p in epre] or [0])
    start[name]=max([e]+[S(n) for n in needs]); return start[name]
rows=[]
for b in M["BLOCKS"]:
    s=S(b[0]); pg=sum(mmods[k]["pages"] for k in expand(b[1],mmods) if k in mmods and mmods[k]["tier"] in("cor","adv"))
    deep=max([elayer[p]+1 for p in b[4]] or [0])
    rows.append((s,b[0],pg,sum(1 for k in b[1] if k in M["NEW"]),deep))
for s,n,pg,nc,d in sorted(rows): print(f"with Gilua L{s:<2} {n:36} {pg:5}p new:{nc}" + (f"  deepen after L{d-1}" if d>s else ""))
placed={k for b in M["BLOCKS"] for k in expand(b[1],mmods)}
print("unplaced:",[k for k,v in mmods.items() if v["tier"]!="ref" and k not in placed])
# time: pages per stage (Gilua layer + Lanchester blocks that start with it), 10 min/page, 154 h/month
epg={}
for li,(n,tr) in enumerate(E["LAYERS"]):
    epg[li]=sum(emods[k]["pages"] for tn,ids in tr for k in expand(ids,emods) if k in emods and emods[k]["tier"] in("cor","adv"))
mpg={}
for s,n,pg,nc,d in rows: mpg[s]=mpg.get(s,0)+pg
tot=0
for li in sorted(epg):
    t=epg[li]+mpg.get(li,0); tot+=t
    print(f"stage L{li}: eng {epg[li]}p + mil {mpg.get(li,0)}p = {t}p  ~{t*10/60/154:.1f} months  (cum {tot*10/60/154:.1f})")
