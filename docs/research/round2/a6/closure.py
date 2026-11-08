import json,sys
R='/home/user/repo-exercise/library/'
apps={}
for k,p in [('C','military/syllabus/syllabus.json'),('E','engineering/syllabus/syllabus.json')]:
    d=json.load(open(R+p)); mods={}
    for m in d['modules']:
        pg=sum((s['pages'][1]-s['pages'][0]+1) for s in m['sources'] if s.get('role')=='main' and s.get('pages'))
        mods[m['id']]=dict(pre=m.get('prereq',[]),pages=pg,tier=m['tier'],en=m['en'])
    apps[k]=mods
tot={k:sum(v['pages'] for v in m.values() if v['tier']=='core') for k,m in apps.items()}
print('core pages',tot, 'all', {k:sum(v['pages'] for v in m.values()) for k,m in apps.items()})
def closure(ids):
    seen=set(); st=list(ids)
    while st:
        x=st.pop(); a,i=x.split(':')
        if x in seen: continue
        seen.add(x); st+= [a+':'+p for p in apps[a][i]['pre']]
    return seen
projects=json.load(open(sys.argv[1]))
rows=[]
for pid,(title,req) in projects.items():
    c=closure(req)
    pg={'C':0,'E':0}; n={'C':0,'E':0}
    for x in c:
        a,i=x.split(':'); pg[a]+=apps[a][i]['pages']; n[a]+=1
    rows.append((pid,title,n['C'],pg['C'],n['E'],pg['E'],round(pg['C']/tot['C']*100),round(pg['E']/tot['E']*100)))
for r in sorted(rows,key=lambda r:r[3]+r[5]):
    print('%-4s %-40s C:%3d mods %5d pp (%3d%%)  E:%3d mods %5d pp (%3d%%)'%(r[0],r[1],r[2],r[3],r[6],r[4],r[5],r[7]))
