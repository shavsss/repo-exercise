"""Extract PDF bookmarks (outline) for every Lanchester doc -> S_mil_outline.json {doc:[{lvl,title,page}]}"""
import json, os, glob, pypdf, sys
REPO="/home/user/repo-exercise/library/military"
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),"S_mil_outline.json")
syl=json.load(open(f"{REPO}/syllabus/syllabus.json"))
res={}
def walk(r,ol,lvl,acc):
    for it in ol:
        if isinstance(it,list): walk(r,it,lvl+1,acc); continue
        try: p=r.get_destination_page_number(it)+1
        except Exception: p=None
        acc.append({"lvl":lvl,"title":str(it.title).strip(),"page":p})
for doc,info in syl["docs"].items():
    path=f"{REPO}/{info['file']}"
    files=sorted(glob.glob(path+"/*.pdf")) if os.path.isdir(path) else [path]
    acc=[]; off=0
    for f in files:
        try:
            r=pypdf.PdfReader(f); tmp=[]; walk(r,r.outline,0,tmp)
            for x in tmp:
                if x["page"]: x["page"]+=off
            acc+=tmp; off+=len(r.pages)
        except Exception as e: print(doc,"ERR",e,file=sys.stderr)
    res[doc]=acc
    print(doc,len(acc),max([a['lvl'] for a in acc],default=-1))
json.dump(res,open(OUT,"w"),ensure_ascii=False,indent=0)
