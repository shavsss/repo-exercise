# Answers the requests of tools/sim/driver.mts with realistic sizes, and logs each one (kind, chars in/out).
import json, os, re, sys, time
out, plan_file, audit_pass, reader_pass = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
plan = json.loads(json.load(open(plan_file))['plan'])
for c in plan['outline']['chapters']:
    for s in c['sections']:
        if not s.get('depth') or s['depth'].strip() == 'נכתב': s['depth'] = 'לחשב את הגודל המרכזי של הסעיף ולהחליט לפיו'
        s['title'] = s['title'].replace(' (נכתב)', '')
        s.setdefault('role', 'core' if any(d.get('mark') == 's' for d in s.get('defines', [])) else 'support')
        s.setdefault('key', ['$R = c\\Delta T/2$', '$\\lambda f = c$', 'מספר מחושב: 12.3 dB'])
W = "המילה העברית הזו ממלאת את השיעור כדי למדוד גודל בקשה אמיתי ".split()
def words(n):
    return " ".join(W[i % len(W)] for i in range(n))
log = open(os.path.join(out, 'log.jsonl'), 'a')
k, audits, readers = 0, 0, 0
checks = 0
while True:
    k += 1
    req = os.path.join(out, f'req-{k}.json')
    while not os.path.exists(req):
        if open(os.path.join(out, 'pending')).read().strip() == 'done' if os.path.exists(os.path.join(out, 'pending')) else False:
            sys.exit(0)
        time.sleep(0.3)
    time.sleep(0.3)
    r = json.load(open(req))
    msgs = r['messages']
    if isinstance(msgs, str): msgs = [{'role': 'user', 'content': msgs}]
    text_in = "".join(m['content'] if isinstance(m['content'], str) else json.dumps(m['content'], ensure_ascii=False) for m in msgs)
    last = msgs[-1]['content'] if isinstance(msgs[-1]['content'], str) else json.dumps(msgs[-1]['content'], ensure_ascii=False)
    if '<outline_check>' in last:
        checks += 1
        kind = 'outline_check'
        res = json.dumps({"problems": [] if checks > 1 else [{"where": "1.2", "kind": "depth", "problem": "p", "fix": "f"}], "verdict": "pass" if checks > 1 else "fix"})
    elif r['json']:
        kind = 'plan' if 'checked for order' not in last else 'plan_fix'
        res = json.dumps(plan, ensure_ascii=False)
        # LATEX=1: the plan as the model wrote it on 21.11, LaTeX with single backslashes (invalid JSON)
        if os.environ.get('LATEX') == '1': res = res.replace('\\\\', '\\')
    elif '<lesson_tighten>' in last:
        kind = 'tighten'; res = ''
    elif '<lesson_audit' in last:
        audits += 1; kind = 'audit_review'
        res = json.dumps({"missing": [] if audits >= audit_pass else [{"quote": "x", "problem": "חסר", "fix": "להוסיף"}], "verdict": "pass" if audits >= audit_pass else "fix"})
    elif '<reader_audit' in last:
        readers += 1; kind = 'reader_review'
        res = json.dumps({"issues": [] if readers >= reader_pass else [{"kind": "jump", "where": "1.1", "problem": "קפיצה"}]})
    elif '<lesson_repair' in last:
        kind = 'repair'
        m = re.search(r'^### (\d+\.\d+)[^\n]*$', last, re.M)
        res = f"<<<REPLACE>>>\n{m.group(0)}\n<<<WITH>>>\n{m.group(0)}\n\n{words(350)} {k}\n<<<END>>>" if m else ''
    elif 'WRITING STEP' in last:
        kind = 'part'
        mine = re.search(r'Now write ONLY part \d+: subsections ([0-9., ]+?)\. It covers', last)
        secs = [x.strip() for x in mine.group(1).split(',')] if mine else []
        wl = dict(re.findall(r'(\d+\.\d+) ≈(\d+)', last))
        res = "\n\n".join(f"### {n} כותרת\n\n" + words(int(int(wl.get(n, 800)) * 1.1)) + "\n\n```chart\n" + '{"x":[1,2,3],"y":[4,5,6]}' * 30 + "\n```" for n in secs)
    else:
        kind = 'other'; res = '{}'
    log.write(json.dumps({"k": k, "kind": kind, "in": len(text_in), "out": len(res), "msgs": len(msgs)}) + "\n"); log.flush()
    open(os.path.join(out, f'res-{k}.txt'), 'w').write(res)
