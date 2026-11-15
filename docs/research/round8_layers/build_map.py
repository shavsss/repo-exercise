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
pg=lambda mods,ks: sum(mods[k]["pages"] for k in ks if mods[k]["tier"] in("cor","adv"))
mon=lambda p: p*10/60/154
esc=html.escape
ORIG={"user":("הצעה שלך","o-user"),"gap":("פער שנמצא","o-gap"),"naval":("הנדסה ימית","o-naval")}
def chip(app,mods,k):
    m=mods[k]
    if m["part"]=="NEW":
        lab,cls=ORIG[m["origin"]]
        return f'<li class="chip new {cls}"><span class="mid">{esc(k)}</span><span class="mt">{esc(m["title"])}</span><span class="tag">{lab} · ~{m["pages"]} עמ\'</span></li>'
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
    e=max([elayer[p]+1 for p in b[3]] or [0])
    start[name]=max([e]+[St(n) for n in b[2]]); return start[name]
for b in M["BLOCKS"]: St(b[0])
nst=len(E["LAYERS"])
stages=[]
cum=0
for li in range(nst+1):
    tracks=[]
    if li<nst:
        for tn,ids in E["LAYERS"][li][1]:
            ks=expand(ids,emods); tracks.append((ks,pg(emods,ks)))
    blocks=[b for b in M["BLOCKS"] if start[b[0]]==li]
    p=sum(t[1] for t in tracks)+sum(pg(mmods,expand(b[1],mmods)) for b in blocks)
    cum+=mon(p)
    stages.append((li,tracks,blocks,p,cum))
total=cum
# should-gaps (not in plan)
SHOULD_E=[("C ותכנות מערכות (K&R, CS:APP)",220),("ODE נומרי, קשיחות וגזירה אוטומטית",170),("משוואות דיפרנציאליות סטוכסטיות",150),("בקרה רב-משתנית ועמידה (Skogestad)",220),("בקרה ספרתית",170),("5G NR",180),("חישה קוונטית",70),("פוטוניקה (Saleh & Teich)",220),("PLL וסינתזת תדר",150),("חיישנים (Fraden)",200),("מערכות מבוזרות",200),("מערכות ML ו-MLOps",250),("מדחפים ורוטורים",130),("CFD",230),("הנדסת אמינות",200),("אומדנים מהירים (Mahajan)",200)]
SHOULD_M=[("SATCOM מוגן",120),("Weaponeering ונזק נלווה",180),("חתימת IR ורב-ספקטרלית",80),("C-RAM",60),("הערכת הפצת נשק גרעיני",200),("משחקי מלחמה",200),("ארטילריה ואש מדויקת",130),("תכן מטוסי קרב (Raymer)",150),("CBRN",100)]
sh_p=sum(p for _,p in SHOULD_E+SHOULD_M)
cur_p=sum(pg(emods,[k for k,v in emods.items() if v["part"]!="NEW"]) for _ in [0])+sum(pg(mmods,[k for k,v in mmods.items() if v["part"]!="NEW"]) for _ in [0])
new_p=sum(v[1] for v in E["NEW"].values())+sum(v[1] for v in M["NEW"].values())
nu=sum(1 for v in list(E["NEW"].values()) if v[3]=="user")+sum(1 for v in M["NEW"].values() if v[2]=="user")
ng=sum(1 for v in list(E["NEW"].values()) if v[3]=="gap")+sum(1 for v in M["NEW"].values() if v[2]=="gap")
nn=sum(1 for v in E["NEW"].values() if v[3]=="naval")
def stage_html(li,tracks,blocks,p,cum):
    name=E["LAYERS"][li][0] if li<nst else "אחרי שגילואה מסתיימת"
    out=[f'<section class="stage" id="s{li}"><header class="sh"><span class="sn">שכבה {li}</span><h2>{esc(name)}</h2><span class="sm">{p:,} עמ\' · כ-{mon(p):.1f} חודשים · מצטבר {cum:.1f}</span></header><div class="cols">']
    out.append('<div class="col gil"><h3>גילואה</h3>')
    if tracks:
        for i,(ks,tp) in enumerate(tracks):
            lab="מסלול ראשי" if i==0 else "במקביל"
            out.append(f'<details class="track"><summary><span class="tl">{lab}</span><span class="ts">{esc(summary("eng",emods,ks))}</span><span class="tp">{tp:,} עמ\'</span></summary><ol class="chips">{"".join(chip("eng",emods,k) for k in ks)}</ol></details>')
    else: out.append('<p class="empty">גילואה הסתיימה.</p>')
    out.append('</div><div class="col lan"><h3>לנצ\'סטר</h3>')
    if blocks:
        for b in blocks:
            ks=expand(b[1],mmods); bp=pg(mmods,ks)
            why=f'<p class="why">מחכה בגילואה ל: {esc(", ".join(b[3]))}</p>' if b[3] else '<p class="why">בלי תלות בגילואה.</p>'
            if b[4]:
                d=max(elayer[x] for x in b[4])
                why+=f'<p class="why deep">העמקה (שיעור הפרש) אחרי שכבה {d}: {esc(", ".join(b[4]))}</p>'
            if b[2]: why+=f'<p class="why">אחרי: {esc(" · ".join(b[2]))}</p>'
            out.append(f'<details class="track"><summary><span class="tl">{esc(b[0])}</span><span class="ts">{esc(summary("mil",mmods,ks))}</span><span class="tp">{bp:,} עמ\'</span></summary>{why}<ol class="chips">{"".join(chip("mil",mmods,k) for k in ks)}</ol></details>')
    else: out.append('<p class="empty">אין בלוק חדש שמתחיל כאן. ממשיכים בבלוקים שהתחילו קודם, או חזרה ופרויקטים.</p>')
    out.append('</div></div></section>')
    return "".join(out)
body="".join(stage_html(*s) for s in stages)
should="".join(f"<li>{esc(n)} <span class='tp'>~{p} עמ'</span></li>" for n,p in SHOULD_E)
shouldm="".join(f"<li>{esc(n)} <span class='tp'>~{p} עמ'</span></li>" for n,p in SHOULD_M)
tpl=open("tmp/syllabus/map_template.html").read()
toc="".join(f"<a href=\"#s{s[0]}\">{s[0]}</a>" for s in stages)
tpl=tpl.replace("{{TOC}}",toc)
for k,v in {"BODY":body,"SHOULD_E":should,"SHOULD_M":shouldm,"TOTAL":f"{total:.0f}","CUR":f"{mon(cur_p):.0f}","ADD":f"{mon(new_p):.0f}","NEWP":f"{new_p:,}","SHP":f"{sh_p:,}","SHM":f"{mon(sh_p):.0f}","NU":str(nu),"NG":str(ng),"NN":str(nn)}.items():
    tpl=tpl.replace("{{"+k+"}}",v)
open(OUT,"w").write(tpl)
print("total months",round(total,1),"current",round(mon(cur_p),1),"new pages",new_p,"should",sh_p)
