import json,re,html,sys
S=sys.argv[1]; OUT=sys.argv[2]
exec(open("tmp/syllabus/partgraph.py").read().split("for app in sys.argv")[0])
E={}; exec(open("tmp/syllabus/eng_plan.py").read(),E)
M={}; exec(open("tmp/syllabus/mil_plan.py").read(),M)
idx={a:json.load(open(f"{S}/{d}/lib/index.json")) for a,d in [("eng","a10e7cf7-ad7b-4aab-ab60-0d52b18381af"),("mil","072f5e57-e913-47c7-87c2-2161f0c1a8c6")]}
he={a:{m["id"]:m["title"] for m in idx[a]["modules"]} for a in idx}
ptitle={a:{p["id"]:re.sub(r"^[^:]*:\s*","",p["title"]) if ":" in p["title"] else p["title"] for p in idx[a]["parts"]} for a in idx}
emods,_,_=load("eng"); mmods,_,_=load("mil")
for k,v in E["NEW"].items(): emods[k]=dict(part="NEW",tier="cor",title=v[0],pre=v[2],pages=v[1],origin=v[3])
for k,v in M["NEW"].items(): mmods[k]=dict(part="NEW",tier="cor",title=v[0],pre=[],pages=v[1],origin=v[2])
def expand(ids,mods):
    out=[]
    for x in ids:
        m=re.match(r"(M\d+)\.(\d+)-(\d+)$",x)
        if m: out+=[f"{m[1]}.{i}" for i in range(int(m[2]),int(m[3])+1) if f"{m[1]}.{i}" in mods]
        elif re.match(r"P\d+$",x): out+=[k for k,v in mods.items() if v["part"]==x and v["tier"]!="ref"]
        else: out.append(x)
    return [k for k in out if k in mods and mods[k]["tier"]!="ref"]
pg=lambda mods,ks: sum(mods[k]["pages"] for k in ks if mods[k]["tier"] in("cor","adv") and mods[k]["part"]!="NEW")
hr=lambda mods,ks: pg(mods,ks)*10/60+sum(nh(k) for k in ks if mods[k]["part"]=="NEW")
mon=lambda p: p*10/60/154
esc=html.escape
ORIG={"user":("הצעה שלך","o-user"),"gap":("פער שנמצא","o-gap"),"should":("פער משלים","o-gap"),"naval":("הנדסה ימית","o-naval")}
sys.path.insert(0,"tmp/syllabus"); from item_cost import hours as ihours
ITEMS={**json.load(open("tmp/syllabus/eng_items.json")),**json.load(open("tmp/syllabus/mil_items.json"))}
def nh(k): return ihours(ITEMS[k]["items"]) if k in ITEMS else 0
def items_html(k):
    li="".join(f'<li><span class="imp imp-{i["imp"]}">{i["imp"]}</span><span class="st">{"חדש" if i.get("status")=="missing" else "העמקה"}</span><span class="in">{esc(i["n"])}</span></li>' for i in ITEMS.get(k,{}).get("items",[]))
    return f'<ul class="items">{li}</ul>' 
def chip(app,mods,k):
    m=mods[k]
    if m["part"]=="NEW":
        lab,cls=ORIG[m["origin"]]
        n=len(ITEMS.get(k,{}).get("items",[]))
        return f'<li class="chip new {cls}"><span class="mid">{esc(k)}</span><details class="sub"><summary><span class="mt">{esc(m["title"])}</span><span class="tag">{lab} · {n} תתי-נושאים · כ-{nh(k):.1f} שעות</span></summary>{items_html(k)}</details></li>'
    adv=' <span class="adv">מתקדם</span>' if m["tier"]=="adv" else ""
    return f'<li class="chip"><span class="mid">{esc(k)}</span><span class="mt">{esc(he[app].get(k,m["title"]))}{adv}</span></li>'
def summary(app,mods,ks):
    parts=[];seen=[]
    for k in ks:
        p=mods[k]["part"]
        if p!="NEW" and p not in seen: seen.append(p)
    s=" · ".join(f"{p} {ptitle[app][p]}" for p in seen)
    n=sum(1 for k in ks if mods[k]["part"]=="NEW")
    if n: s+=(" · " if s else "")+("מודול חדש" if n==1 else f"{n} מודולים חדשים")
    return s
# Gilua layer per module
elayer={}
for li,(n,tr) in enumerate(E["LAYERS"]):
    for tn,ids in tr:
        for k in expand(ids,emods): elayer[k]=li
# Lanchester block start
byname={b[0]:b for b in M["BLOCKS"]}; start={}
def St(name):
    if name in start: return start[name]
    b=byname[name]
    # the apps are learned separately: a block waits only for the Lanchester blocks it needs
    start[name]=max([0]+[St(n)+1 for n in b[2]]); return start[name]
for b in M["BLOCKS"]: St(b[0])
nst=len(E["LAYERS"])
nmil=max(start.values())+1
stages=[]
cum=0
for li in range(max(nst,nmil)):
    tracks=[]
    if li<nst:
        for tn,ids in E["LAYERS"][li][1]:
            ks=expand(ids,emods); tracks.append((ks,hr(emods,ks)))
    blocks=[b for b in M["BLOCKS"] if start[b[0]]==li]
    pe=sum(t[1] for t in tracks); pm=sum(hr(mmods,expand(b[1],mmods)) for b in blocks)
    stages.append((li,tracks,blocks,pe,pm))
tot_e=sum(st[3] for st in stages); tot_m=sum(st[4] for st in stages); total=(tot_e+tot_m)/154
# should-gaps (not in plan)
cur_p=pg(emods,list(emods))+pg(mmods,list(mmods))
newk=list(E["NEW"])+list(M["NEW"])
new_h=sum(nh(k) for k in newk)
allit=[i for k in newk for i in ITEMS.get(k,{}).get("items",[])]
miss=sum(1 for i in allit if i.get("status")=="missing")
org=lambda o: sum(1 for v in E["NEW"].values() if v[3]==o)+sum(1 for v in M["NEW"].values() if v[2]==o)
def track_html(lab,ks,tp):
    return f'<details class="track"><summary><span class="tl">{lab}</span><span class="ts">{esc(summary("eng",emods,ks))}</span><span class="tp">{tp:,.0f} ש\'</span></summary><ol class="chips">{"".join(chip("eng",emods,k) for k in ks)}</ol></details>'
def gil_html(li,tracks,pe):
    out=[f'<section class="stage gil" id="g{li}"><header class="sh"><span class="sn">שכבה {li}</span><h2>{esc(E["LAYERS"][li][0])}</h2><span class="sm">כ-{pe:,.0f} שעות</span></header><div class="col">']
    for i,(ks,tp) in enumerate(tracks): out.append(track_html("מסלול ראשי" if i==0 else "במקביל",ks,tp))
    out.append('</div></section>'); return "".join(out)
def lan_html(li,blocks,pm):
    out=[f'<section class="stage lan" id="l{li}"><header class="sh"><span class="sn">שלב {li}</span><h2>{"במקביל: " if len(blocks)>1 else ""}{esc(" · ".join(b[0] for b in blocks))}</h2><span class="sm">כ-{pm:,.0f} שעות</span></header><div class="col">']
    for b in blocks:
        ks=expand(b[1],mmods); bp=hr(mmods,ks)
        why=f'<p class="why">אחרי: {esc(" · ".join(b[2]))}</p>' if b[2] else '<p class="why">בלי דרישות קודמות.</p>'
        rel=b[3]+b[4]
        if rel: why+=f'<p class="why deep">קשור בגילואה (לא חוסם; מה שצריך נלמד כאן ברמה הדרושה): {esc(", ".join(rel))}</p>'
        out.append(f'<details class="track"><summary><span class="tl">{esc(b[0])}</span><span class="ts">{esc(summary("mil",mmods,ks))}</span><span class="tp">{bp:,.0f} ש\'</span></summary>{why}<ol class="chips">{"".join(chip("mil",mmods,k) for k in ks)}</ol></details>')
    out.append('</div></section>'); return "".join(out)
gbody="".join(gil_html(st[0],st[1],st[3]) for st in stages if st[1])
lbody="".join(lan_html(st[0],st[2],st[4]) for st in stages if st[2])
tpl=open("tmp/syllabus/map_template.html").read()
tpl=tpl.replace("{{TOCG}}","".join(f"<a href=\"#g{st[0]}\">{st[0]}</a>" for st in stages if st[1])).replace("{{TOCL}}","".join(f"<a href=\"#l{st[0]}\">{st[0]}</a>" for st in stages if st[2]))
for k,v in {"GBODY":gbody,"LBODY":lbody,"TOTAL":f"{total:.0f}","CUR":f"{mon(cur_p):.0f}","TE":f"{tot_e/154:.0f}","TM":f"{tot_m/154:.0f}","NEWH":f"{new_h:,.0f}","NEWM":f"{new_h/154:.1f}","NMOD":str(len(newk)),"NIT":str(len(allit)),"NMISS":str(miss),"NPART":str(len(allit)-miss),"NU":str(org("user")),"NG":str(org("gap")+org("should")),"NN":str(org("naval"))}.items():
    tpl=tpl.replace("{{"+k+"}}",v)
open(OUT,"w").write(tpl)
print("total months",round(total,1),"current",round(mon(cur_p),1),"new hours",round(new_h),"items",len(allit),"missing",miss)
