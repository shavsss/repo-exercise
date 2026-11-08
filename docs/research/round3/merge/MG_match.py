"""Step 1: build section corpus (Gilua sections + Lanchester units) and BoK subtopic queries; TF-IDF cosine on
title field and body field (unigram+bigram, crude stemming); write top matches both ways -> MG_scores.json"""
import json, re, math, os, collections, pickle
H = os.path.dirname(os.path.abspath(__file__))
R3 = os.path.dirname(H); R2 = os.path.join(os.path.dirname(R3), 'round2')
REPO = '/home/user/repo-exercise'
SE = json.load(open(f'{R3}/registry/S_eng_registry.json'))['sections']
SM = json.load(open(f'{R3}/registry/S_mil_registry.json'))
UM = SM['units']
UF = {u['uid']: u for u in json.load(open(f'{R3}/registry/S_mil_units_f.json'))}
SYE = {m['id']: m for m in json.load(open(f'{REPO}/library/engineering/syllabus/syllabus.json'))['modules']}
SYM = {m['id']: m for m in json.load(open(f'{REPO}/library/military/syllabus/syllabus.json'))['modules']}
BE = json.load(open(f'{R3}/bok/B_eng_map.json'))
BM = json.load(open(f'{R3}/bok/B_mil_map.json'))

STOP = set("""a an the of and or in on to for with by from as at is are be it its this that these those which into via vs
using use used their his her our we you they he she not no can may will than then also such how what why when where
who more most less very each per all any both between within without about over under one two three first second new
chapter section part introduction figure fig table example examples problem problems exercise exercises summary notes
eq equation page pp i ii iii iv v vi vii viii ix x e g etc s t""".split())
def stem(w):
    for suf in ('ization','isation','ations','ation','ments','ment','ings','ing','ities','ity','ness','ies','es','ed','al','s'):
        if len(w) > len(suf) + 3 and w.endswith(suf):
            w = w[:-len(suf)]; break
    return w
def toks(text):
    ws = [stem(w) for w in re.findall(r'[a-z][a-z0-9\-]+', text.lower().replace('-', ' ')) if w not in STOP and len(w) > 1]
    ws = [w for w in ws if w not in STOP]
    return ws + [ws[i] + '_' + ws[i + 1] for i in range(len(ws) - 1)]

etext = {}
def eng_body(sec):
    d = sec['doc']
    if d not in etext:
        p = f'{REPO}/eng/app/artifact/lib/text/{d}.json'
        etext[d] = json.load(open(p)) if os.path.exists(p) else {}
    T = etext[d]; a, b = sec['pdf_pages']; a = int(math.floor(a)); b = max(a, int(math.ceil(b)) - 1)
    out = []
    for p in range(a, b + 1):
        v = T.get(str(p))
        if isinstance(v, dict): v = v.get('t', '')
        if v: out.append(v)
    return '\n'.join(out)[:40000]
mtext = json.load(open(f'{R2}/cache/mil_text.json'))
def mil_body(u):
    T = mtext.get(u['doc'], {})
    return '\n'.join(T.get(str(p), '') or '' for p in range(u['p0'], u['p1'] + 1))[:40000]

docs = []  # (id, app, titlefield, body)
for s in SE:
    mods = [m['module'] for m in s['modules']]
    mt = ' '.join(SYE[m].get('en', '') for m in mods if m in SYE)
    notes = ' '.join(src.get('note', '') for m in mods if m in SYE for src in SYE[m]['sources'] if src['doc'] == s['doc'])
    tf = (s['title'] + ' ') * 3 + (s['chapter_title'] + ' ') * 2 + mt + ' ' + notes
    docs.append((s['key'], 'eng', tf, eng_body(s)))
for u in UM:
    f = UF.get(u['uid'], {})
    tf = ((u['title'] or '') + ' ') * 3 + (f.get('mtitle', '') + ' ') * 2 + ' ' + f.get('snote', '')
    docs.append((u['uid'], 'mil', tf, mil_body(u)))
print('docs', len(docs))

subs = []  # (sid, app, imp, name, query_main, query_ctx)
for field, ts in BE.items():
    for ti, t in enumerate(ts):
        for si, s in enumerate(t['subtopics']):
            sid = f"E:{field[:12]}|{ti}.{si}"
            subs.append(dict(sid=sid, app='eng', imp=s['importance'], name=s['name'], topic=t['topic'], domain=field,
                             why=s.get('why', ''), cm=bool(s.get('commonly_missing')), sources=s.get('sources', [])))
for d in BM['domains']:
    for t in d['topics']:
        for s in t['subtopics']:
            subs.append(dict(sid='M:' + s['id'], app='mil', imp=s['imp'], name=s['name'], topic=t['name'], domain=d['name'],
                             why=s.get('why', ''), cm=bool(s.get('commonly_missing')), op_bg=s.get('op_bg'),
                             test_out=s.get('test_out'), lab_part=t.get('lab_part')))
print('subs', len(subs))

def build(field_texts):
    tfs = [collections.Counter(toks(t)) for t in field_texts]
    df = collections.Counter(); [df.update(c.keys()) for c in tfs]
    N = len(tfs); idf = {w: math.log((N + 1) / (n + 0.5)) for w, n in df.items()}
    inv = collections.defaultdict(list)
    for i, c in enumerate(tfs):
        vec = {w: (1 + math.log(n)) * idf[w] for w, n in c.items()}
        nrm = math.sqrt(sum(v * v for v in vec.values())) or 1
        for w, v in vec.items(): inv[w].append((i, v / nrm))
    return idf, inv
def qvec(text, idf, extra=None):
    c = collections.Counter(toks(text))
    if extra:
        for w, n in collections.Counter(toks(extra)).items(): c[w] += 0.3 * n
    vec = {w: (1 + math.log(n) if n >= 1 else n) * idf[w] for w, n in c.items() if w in idf}
    nrm = math.sqrt(sum(v * v for v in vec.values())) or 1
    return {w: v / nrm for w, v in vec.items()}
def score(q, inv, n):
    sc = collections.defaultdict(float)
    for w, v in q.items():
        for i, dv in inv.get(w, ()): sc[i] += v * dv
    return sc

idf_t, inv_t = build([d[2] for d in docs]); print('title index')
idf_b, inv_b = build([d[2] + ' ' + d[3] for d in docs]); print('body index')
res = {}; headres = {}
for s in subs:
    qt = s['name'] + ' ' + s['name']; ctx = s['topic'] + ' ' + s['why']
    st = score(qvec(qt, idf_t, ctx), inv_t, len(docs)); sb = score(qvec(qt, idf_b, ctx), inv_b, len(docs))
    comb = {i: 0.55 * st.get(i, 0) + 0.45 * sb.get(i, 0) * 2.2 for i in set(st) | set(sb)}
    top = sorted(comb.items(), key=lambda x: -x[1])[:150]
    res[s['sid']] = [(docs[i][0], docs[i][1], round(v, 4), round(st.get(i, 0), 4), round(sb.get(i, 0), 4)) for i, v in top]
    head = re.split(r'\s*(?:[:,;(]| vs\.? | and | = )\s*', s['name'])[0].strip()
    s['head'] = head
    if head and head != s['name'] and len([w for w in toks(head) if '_' not in w]) >= 1:
        st2 = score(qvec(head + ' ' + head, idf_t, ctx), inv_t, 0); sb2 = score(qvec(head + ' ' + head, idf_b, ctx), inv_b, 0)
        comb2 = {i: 0.55 * st2.get(i, 0) + 0.45 * sb2.get(i, 0) * 2.2 for i in set(st2) | set(sb2)}
        top2 = sorted(comb2.items(), key=lambda x: -x[1])[:60]
        headres[s['sid']] = [(docs[i][0], docs[i][1], round(v, 4)) for i, v in top2]
# BoK-BoK similarity (cross-app unification): eng vs mil names
def simple_index(texts):
    tfs = [collections.Counter(toks(t)) for t in texts]
    return tfs
alltexts = [s['name'] + ' ' + s['name'] + ' ' + s['topic'] + ' ' + s['why'] for s in subs]
idf_s, inv_s = build(alltexts)
bb = {}
for k, s in enumerate(subs):
    if s['app'] != 'mil': continue
    sc = score(qvec(s['name'] + ' ' + s['name'], idf_s, s['topic'] + ' ' + s['why']), inv_s, len(subs))
    top = sorted(((i, v) for i, v in sc.items() if subs[i]['app'] == 'eng'), key=lambda x: -x[1])[:5]
    bb[s['sid']] = [(subs[i]['sid'], round(v, 4)) for i, v in top]
json.dump(dict(subs=subs, top=res, head=headres, bokbok=bb, docs=[(d[0], d[1], d[2][:300]) for d in docs]), open(f'{H}/MG_scores.json', 'w'), ensure_ascii=False)
pickle.dump([(d[0], d[3][:20000]) for d in docs], open(f'{H}/MG_bodies.pkl', 'wb'))
print('done')
