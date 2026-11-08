import re,json,sys
s=open("lesson_1.md",encoding="utf-8").read()
plan=json.load(open("plan.json",encoding="utf-8"))
ids=[u["id"] for u in plan["units"]]
marks=re.findall(r"<!--(U\d+)-->",s)
from collections import Counter
c=Counter(marks)
print("marked",len(c),"dups",[k for k,v in c.items() if v>1],"missing",[i for i in ids if i not in c],"extra",[k for k in c if k not in ids])
tags=re.findall(r"\[\[2\.5: ([^\]]+)\]\]",s); print("2.5 tags",Counter(tags))
print("think",s.count("```think"))
# split parts by audit lines
parts=re.split(r"<!--audit:[^>]*-->",s)[:4]
NOT={"plan","keep","exercise","today","coverage","table","chart","figure","anim","scene3d","mermaid","svg","notebook"}
heb=re.compile(r"[֐-׿]")
def counted(t):
    out=[];total_heb=0
    # handle fenced blocks
    pos=0
    for m in re.finditer(r"```(\w+)\n(.*?)```",t,re.S):
        out.append(t[pos:m.start()]); pos=m.end()
        kind,body=m.group(1),m.group(2)
        if kind in NOT: continue
        if kind=="think": body=body.split("\n---\n",1)[1] if "\n---\n" in body else ""
        if kind=="erratum" and "שגיאות קטנות" in body: continue
        body="\n".join(l for l in body.split("\n") if not l.startswith("@"))
        out.append(body)
    out.append(t[pos:])
    txt="\n".join(out)
    txt=re.sub(r"<!--.*?-->","",txt,flags=re.S)
    txt=re.sub(r"\$\$.*?\$\$","",txt,flags=re.S)
    txt=re.sub(r"\$[^$]*\$"," X ",txt)
    txt=re.sub(r"\[\[(K1|2\.5|ודאות)[^\]]*\]\]","",txt)
    toks=txt.split()
    return len(toks), sum(1 for w in toks if heb.search(w))
def allheb(t):
    t2=re.sub(r"<!--.*?-->","",t,flags=re.S)
    return sum(1 for w in t2.split() if heb.search(w))
tot=0
for i,p in enumerate(parts,1):
    n,h=counted(p); units=[u for u in plan["units"] if u["part"]==i]
    print(f"part {i}: counted tokens {n}, hebrew counted {h}, units {len(units)}, w/u {n/len(units):.1f}, all hebrew words {allheb(p)}")
    tot+=allheb(p)
print("total hebrew words in file",allheb(s), "counted all parts", sum(counted(p)[0] for p in parts))
# story words
st=re.search(r"```story\n(.*?)```",s,re.S).group(1); print("story words",len(re.sub(r'<!--.*?-->','',st).split()))
td=re.search(r"```today\n(.*?)```",s,re.S).group(1); print("today words",len(td.split()))
