import json, collections, importlib.util, os, sys
H=os.path.dirname(os.path.abspath(__file__))
def load(n):
    s=importlib.util.spec_from_file_location(n,os.path.join(H,n+".py")); m=importlib.util.module_from_spec(s); s.loader.exec_module(m); return m
S=load("_src_sources").SOURCES
D=[]
for n in ["_src_data1","_src_data2","_src_data3"]+[x[:-3] for x in sorted(os.listdir(H)) if x.startswith("_src_data4")]:
    for did,dn,tps in load(n).D:
        ex=[x for x in D if x[0]==did]
        if ex: ex[0][2].extend(tps)
        else: D.append((did,dn,list(tps)))
OPN={"Y":"likely","P":"partial","N":"unlikely"}
out={"meta":{},"sources":S,"domains":[]}
rows=[]
for di,(did,dname,topics) in enumerate(D):
    dom={"id":did,"name":dname,"topics":[]}
    for ti,(tname,ev,lab,subs) in enumerate(topics):
        tp={"id":f"{did}.{ti+1}","name":tname,"lab_part":lab,"evidence":ev,"subtopics":[]}
        for si,line in enumerate(subs):
            f=line.split("|"); assert len(f)==5,line
            name,imp,op,m,why=f; assert imp in "KSCN" and op in "YPN",line
            for e in ev: assert e in S,e
            r={"id":f"{did}.{ti+1}.{si+1}","name":name,"imp":imp,"why":why,"op_bg":OPN[op],"test_out":op=="Y" and imp in "KS","commonly_missing":m=="m","evidence":ev}
            tp["subtopics"].append(r); rows.append((dname,tname,lab,r))
        dom["topics"].append(tp)
    out["domains"].append(dom)
c=collections.Counter(r["imp"] for *_,r in rows)
out["meta"]={"title":"Independent reference map: technical-military core authority (level 2.5 + operational meaning)","date":"2026-10-30",
 "importance":{"K":"Key: master at full 2.5 depth (structure, derivation skeleton, limits, orders of magnitude, trade-offs, critique, operational meaning)","S":"Supporting: solid working use; know the result, its assumptions and how it is misused; no full derivation","C":"Context: conversant; vocabulary, order of magnitude, who to ask","N":"Not needed for this goal (engineer/implementer detail)"},
 "op_bg":"likely/partial/unlikely that a strong operational background already covers the subtopic; 'test_out' = K/S items marked likely: verify with a short test rather than skip",
 "lab_part":"nearest Lanchester syllabus part (P0..P13), 'ref' = analysis reference books, '-' = no home in current syllabus",
 "counts":dict(c),"n_subtopics":len(rows),"n_topics":sum(len(d["topics"]) for d in out["domains"]),"n_domains":len(out["domains"])}
json.dump(out,open(os.path.join(H,"B_mil_map.json"),"w"),ensure_ascii=False,indent=1)
print(len(rows),dict(c),"missing",sum(r["commonly_missing"] for *_,r in rows),"testout",sum(r["test_out"] for *_,r in rows))
for d in out["domains"]:
    cc=collections.Counter(s["imp"] for t in d["topics"] for s in t["subtopics"]); print(d["id"],sum(cc.values()),dict(cc))
