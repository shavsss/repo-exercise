import json
exec(open('closure.py').read().split('projects=json.load')[0].replace('import json,sys',''))
import json
R='/home/user/repo-exercise/library/'
order={}
for k,p in [('C','military/syllabus/syllabus.json'),('E','engineering/syllabus/syllabus.json')]:
    order[k]=[m['id'] for m in json.load(open(R+p))['modules']]
projects=json.load(open('projects.json'))
W=26
for pid,(t,req) in projects.items():
    c=closure(req); out=[]
    for a in 'CE':
        need={x.split(':')[1] for x in c if x[0]==a}
        if not need: out.append(0); continue
        # naive: syllabus order over core modules + needed ones
        cum=0; last=0
        for i in order[a]:
            m=apps[a][i]
            if m['tier']=='core' or i in need: cum+=m['pages']
            if i in need: last=cum
        out.append(last/tot[a])
    naive=max(out)*W
    best=max(sum(apps[x[0]][x[2:]]['pages'] for x in c if x[0]==a)/tot[a] for a in 'CE')*W
    print('%s %-36s naive wk %4.1f (C %.0f%% E %.0f%%)  JIT-best wk %4.1f'%(pid,t,naive,out[0]*100,out[1]*100,best))
