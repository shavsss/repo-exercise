"""Step 3: crosswalk, coverage, section classes, cross-app unification, unified topic map, totals.
-> MG_topics.json, MG_crosswalk.json, MG_build.out"""
import json, os, collections, re
H = os.path.dirname(os.path.abspath(__file__)); R3 = os.path.dirname(H); REPO = '/home/user/repo-exercise'
D = json.load(open(f'{H}/MG_scores.json')); RR = json.load(open(f'{H}/MG_rr.json'))
subs = D['subs']; S = {s['sid']: s for s in subs}
SE = {s['key']: s for s in json.load(open(f'{R3}/registry/S_eng_registry.json'))['sections']}
UM = {u['uid']: u for u in json.load(open(f'{R3}/registry/S_mil_registry.json'))['units']}
SYE = {m['id']: m for m in json.load(open(f'{REPO}/library/engineering/syllabus/syllabus.json'))['modules']}
SYM = {m['id']: m for m in json.load(open(f'{REPO}/library/military/syllabus/syllabus.json'))['modules']}
T_FULL, T_PART, T_WEAK = 0.20, 0.13, 0.09
RANK = {'K': 3, 'S': 2, 'C': 1, 'N': 0}
NONTEACH = {'history', 'notes_biblio', 'appendix_ref', 'summary', 'problems', 'appendix'}
OUT = []
def P(*a): OUT.append(' '.join(str(x) for x in a)); print(*a)

def sec(k): return SE.get(k) or UM.get(k)
def app_of(k): return 'eng' if k in SE else 'mil'
def mods(k):
    if k in SE: return [m['module'] for m in SE[k]['modules']]
    return [UM[k]['module']]
def est(k):
    s = sec(k)
    if k in SE: e = s['est']; return dict(cr=e['strict'], K=e['K'], S=e['S'], C=e['C'])
    return dict(cr=s['cr'], K=s['K'], S=s['S'], C=s['C'])
def pages(k): return sec(k)['pages']
def mtitle(m): return (SYE.get(m) or SYM.get(m) or {}).get('en', '')
def eff(rows):  # SMAD (image-only) rule: title-level hit counts as partial
    out = []
    for k, app, f, cov, comb in rows:
        if '/B12:' in k and f >= T_WEAK: f = max(f, T_PART)
        out.append((k, app, f, cov))
    return out
RRe = {sid: eff(r) for sid, r in RR.items()}

# ---------- 1. subtopic coverage and hosting ----------
cover = {}
for s in subs:
    rows = RRe[s['sid']]
    best = rows[0][2] if rows else 0
    bapp = {a: max([r[2] for r in rows if r[1] == a] or [0]) for a in ('eng', 'mil')}
    status = 'full' if best >= T_FULL else 'partial' if best >= T_PART else 'missing'
    hits = [r for r in rows if r[2] >= T_PART]
    modsc = collections.Counter()
    for k, a, f, cov in hits:
        for m in mods(k): modsc[m] += f * min(pages(k), 10) ** 0.5
    cover[s['sid']] = dict(status=status, best=round(best, 3), best_eng=round(bapp['eng'], 3), best_mil=round(bapp['mil'], 3),
                           hits=hits, modules=[m for m, _ in modsc.most_common(4)], weak=[r for r in rows if T_WEAK <= r[2] < T_PART][:3])
# host for missing: siblings in same topic (same app) -> their most common module; else lab_part / weak best
bytopic = collections.defaultdict(list)
for s in subs: bytopic[(s['app'], s['domain'], s['topic'])].append(s['sid'])
for s in subs:
    c = cover[s['sid']]
    if c['status'] != 'missing': c['host'] = c['modules'][:2]; continue
    sib = collections.Counter()
    for o in bytopic[(s['app'], s['domain'], s['topic'])]:
        if o != s['sid'] and cover[o]['status'] != 'missing':
            for m in cover[o]['modules'][:2]: sib[m] += 1
    own = 'E' if s['app'] == 'eng' else 'M'
    if sib: c['host'] = [sib.most_common(1)[0][0]]; c['host_how'] = 'sibling subtopics'
    else:
        lp = s.get('lab_part')
        cand = [r for r in RR[s['sid']] if app_of(r[0]) == s['app']]
        if lp and lp not in ('-', 'ref'):
            cand2 = [r for r in cand if (SYM.get(mods(r[0])[0], {}).get('part') == lp)]
            cand = cand2 or cand
        c['host'] = [mods(cand[0][0])[0]] if cand else []; c['host_how'] = 'lab_part/weak best' if cand else 'none'

# ---------- 2. cross-app unification ----------
unify = {}
for msid, lst in D['bokbok'].items():
    if not lst: continue
    esid, sim = lst[0]
    mt = set(r[0] for r in RRe[msid][:12]); et = set(r[0] for r in RRe[esid][:12])
    if sim >= 0.28 or (sim >= 0.18 and len(mt & et) >= 1):
        unify[msid] = (esid, sim, len(mt & et))
P('unified pairs (mil<->eng BoK):', len(unify))
for s in subs:
    c = cover[s['sid']]; c['delta'] = None
    if s['app'] == 'mil':
        if s['sid'] in unify:
            esid = unify[s['sid']][0]; c['unified_with'] = esid
            # host = the app with the stronger match for the eng twin + this item; Gilua hosts generic theory
            if max(cover[esid]['best_eng'], c['best_eng']) >= T_PART:
                c['delta'] = 'taught in Gilua; Lanchester gets operational delta'
            else:
                c['delta'] = 'taught in Lanchester; Gilua twin points here'
        elif c['best_eng'] >= T_FULL and c['best_mil'] < T_PART:
            c['delta'] = 'covered only in Gilua sections; Lanchester gets delta'
        c['test_out'] = bool(s.get('test_out')) or (s.get('op_bg') == 'likely' and s['imp'] in 'KS')

# ---------- 3. section -> subtopic crosswalk ----------
secmap = collections.defaultdict(list); secbest = collections.defaultdict(float)
for sid, rows in RRe.items():
    for k, a, f, cov in rows:
        secbest[k] = max(secbest[k], f)
        if f >= T_PART: secmap[k].append((sid, round(f, 3)))
allkeys = list(SE) + list(UM)
cls = {}
for k in allkeys:
    s = sec(k); t = s['type']; m = secmap.get(k, [])
    imp = max((RANK[S[x]['imp']] for x, _ in m), default=-1)
    if imp >= 2: c = 'KS'
    elif imp == 1: c = 'C_only'
    elif imp == 0 and max(f for _, f in m) >= T_FULL: c = 'N_only'
    elif imp == 0: c = 'unmapped_weakhit_keep'
    elif k in UM and t in ('doctrine', 'descriptive', 'history') and (UM[k].get('testout_candidate') or t == 'history'): c = 'unmapped_testout'  # conservative: mil history = skim/test-out, not removal
    elif t in NONTEACH: c = 'unmapped_nonteaching'
    elif secbest.get(k, 0) >= T_WEAK: c = 'unmapped_weakhit_keep'
    else: c = 'unmapped_teaching_review'
    cls[k] = c
NOTNEEDED = {'N_only', 'unmapped_nonteaching'}
PROBABLE = {'unmapped_teaching_review'}

def agg(keys, dedup=False):
    a = collections.Counter()
    for k in keys:
        e = est(k); fac_cr = fac_ks = 1.0
        if dedup:
            s = sec(k)
            if k in SE and s.get('delta_of'): fac_cr = fac_ks = s['delta_of']['keep']
            if k in UM:
                ks = (s['K'] + s['S']) or 1
                fac_ks = max(0, 1 - s.get('eng_dup_KS', 0) / ks) if s.get('delta') else 1
                fac_ks *= (1 - s.get('internal_repeat', 0)); fac_cr = fac_ks
        a['units'] += 1; a['pages'] += pages(k)
        a['cr'] += e['cr'] * fac_cr; a['K'] += e['K'] * fac_ks; a['S'] += e['S'] * fac_ks; a['C'] += e['C'] * fac_cr
    return {x: round(v, 1) for x, v in a.items()}

P('\n== Section classes (pages; raw estimates) ==')
for app, keys in (('eng', list(SE)), ('mil', list(UM))):
    tot = agg(keys); P(f'[{app}] total', tot)
    for c in ('KS', 'C_only', 'N_only', 'unmapped_nonteaching', 'unmapped_testout', 'unmapped_weakhit_keep', 'unmapped_teaching_review'):
        g = agg([k for k in keys if cls[k] == c]); P(f'   {c:28s} units={g.get("units",0):6} pages={g.get("pages",0):8} ({100*g.get("pages",0)/tot["pages"]:.1f}%) cr={g.get("cr",0)} K={g.get("K",0)} S={g.get("S",0)} C={g.get("C",0)}')

# ---------- 4. per-subtopic item estimates (distribute in-scope section items by score) ----------
inscope = [k for k in allkeys if cls[k] not in NOTNEEDED]
items = collections.defaultdict(collections.Counter)
for k in inscope:
    m = [(sid, f) for sid, f in secmap.get(k, []) if S[sid]['imp'] != 'N']
    if not m: continue
    tot = sum(f for _, f in m); e = est(k)
    for sid, f in m:
        for x in ('cr', 'K', 'S', 'C'): items[sid][x] += e[x] * f / tot
        items[sid]['pages'] += pages(k) * f / tot

# ---------- 5. unified topic map ----------
topics = collections.OrderedDict()
for s in subs:
    dom = ('ENG · ' if s['app'] == 'eng' else 'MIL · ') + s['domain']
    topics.setdefault(dom, collections.OrderedDict()).setdefault(s['topic'], [])
    c = cover[s['sid']]
    secs = sorted(c['hits'], key=lambda r: -r[2])[:6]
    rec = dict(id=s['sid'], name=s['name'], importance=s['imp'], commonly_missing=s['cm'], coverage=c['status'],
               best_score=c['best'], host_modules=[f'{"Gilua" if m in SYE and app_of(secs[0][0]) == "eng" else "Lanchester" if m in SYM else "Gilua"}:{m}' for m in []] or None,
               modules=c['modules'][:4] if c['status'] != 'missing' else [], host=c.get('host', []),
               sections=[dict(key=k, app=a, score=round(f, 3), pages=pages(k), title=(sec(k).get('title') or '')[:80]) for k, a, f, cov in secs],
               est_items={x: round(v, 2) for x, v in items[s['sid']].items()})
    rec.pop('host_modules')
    if s['app'] == 'mil':
        rec.update(delta=c['delta'], unified_with=c.get('unified_with'), test_out=c['test_out'], op_bg=s.get('op_bg'), lab_part=s.get('lab_part'))
    topics[dom][s['topic']].append(rec)
eng_twin_of = collections.defaultdict(list)
for msid, (esid, sim, ov) in unify.items(): eng_twin_of[esid].append(msid)
for dom in topics:
    for t in topics[dom]:
        for r in topics[dom][t]:
            if r['id'] in eng_twin_of: r['military_twins'] = eng_twin_of[r['id']]

# ---------- 6. totals ----------
P('\n== Subtopics by importance x coverage ==')
for app in ('eng', 'mil', 'all'):
    cc = collections.Counter((s['imp'], cover[s['sid']]['status']) for s in subs if app == 'all' or s['app'] == app)
    for imp in 'KSCN':
        P(f'  {app:3s} {imp}: total={sum(v for (i,_),v in cc.items() if i==imp):4d} full={cc[(imp,"full")]:4d} partial={cc[(imp,"partial")]:4d} missing={cc[(imp,"missing")]:4d}')
P('unified (teach once):', len(unify), ' of which K/S:', sum(1 for m in unify if S[m]['imp'] in 'KS'))
P('Unified BoK after merge: subtopics =', len(subs) - len(unify), ' K/S/C/N =',
  dict(collections.Counter(s['imp'] for s in subs if s['sid'] not in unify)))
delta_cnt = collections.Counter(cover[s['sid']]['delta'] for s in subs if s['app'] == 'mil')
P('mil delta flags:', dict(delta_cnt))
P('mil test-out subtopics:', sum(1 for s in subs if s['app'] == 'mil' and cover[s['sid']]['test_out']),
  ' by imp', dict(collections.Counter(s['imp'] for s in subs if s['app'] == 'mil' and cover[s['sid']]['test_out'])))
P('\n== Items in scope (after removing N-only + non-teaching unmapped; dedup = Gilua deltas keep factor, Lanchester eng_dup/internal repeat) ==')
for app, keys in (('eng', list(SE)), ('mil', list(UM))):
    ins = [k for k in keys if cls[k] not in NOTNEEDED]
    P(f'[{app}] raw all ', agg(keys)); P(f'[{app}] in scope raw', agg(ins)); P(f'[{app}] in scope dedup', agg(ins, True))
    P(f'[{app}] in scope dedup, also minus probable-not-needed', agg([k for k in ins if cls[k] not in PROBABLE], True))
    P(f'[{app}] in scope dedup core tier only', agg([k for k in ins if (SE[k]['modules'][0]['tier'] if k in SE else UM[k]['tier']) == 'core'], True))
# cross-app further dedup: mil units whose mapped subtopics are all 'taught in Gilua'
xdup = [k for k in UM if cls[k] not in NOTNEEDED and secmap.get(k) and all(cover[sid].get('delta', '') and 'Gilua' in (cover[sid].get('delta') or '') or S[sid]['app'] == 'eng' for sid, _ in secmap[k])]
P('mil units whose every mapped subtopic is Gilua-hosted (delta only):', agg(xdup, True))

gaps = [s for s in subs if cover[s['sid']]['status'] == 'missing' and s['imp'] in 'KS']
P('\n== GAPS to ADD (K/S missing):', len(gaps), dict(collections.Counter((s['app'], s['imp']) for s in gaps)))
P('   of which commonly_missing in BoK:', sum(1 for s in gaps if s['cm']))
partialKS = [s for s in subs if cover[s['sid']]['status'] == 'partial' and s['imp'] in 'KS']
P('   partial K/S (deepen):', len(partialKS))

# biggest not-needed blocks
blk = collections.defaultdict(lambda: [0.0, 0, set(), set()])
for k in allkeys:
    if cls[k] in NOTNEEDED | PROBABLE:
        s = sec(k)
        ch = (s['doc'], s.get('chapter') or s.get('module'))
        b = blk[ch]; b[0] += pages(k); b[1] += 1; b[2].add(cls[k]); b[3].add((s.get('chapter_title') or s.get('title') or '')[:60])
P('\n== Biggest not-needed / probable blocks (doc, chapter/module) ==')
for (d, ch), (pg, n, cs, tt) in sorted(blk.items(), key=lambda x: -x[1][0])[:30]:
    P(f'  {d:5s} {str(ch):10s} {pg:6.1f} pp  {n:3d} secs  {sorted(cs)}  {sorted(tt)[:2]}')
nn_by_type = collections.Counter()
for k in allkeys:
    if cls[k] in NOTNEEDED: nn_by_type[(app_of(k), sec(k)['type'], cls[k])] += pages(k)
P('\nnot-needed pages by (app,type,class):', {f'{a}/{t}/{c}': round(v) for (a, t, c), v in sorted(nn_by_type.items(), key=lambda x: -x[1])[:16]})

json.dump(dict(meta=dict(desc='Unified topic map: domain -> topic -> subtopic, importance, coverage, modules, sections, delta/test-out, est items',
                         thresholds=dict(full=T_FULL, partial=T_PART, weak=T_WEAK)), domains=topics), open(f'{H}/MG_topics.json', 'w'), ensure_ascii=False, indent=1)
cw = dict(sections={k: dict(app=app_of(k), cls=cls[k], type=sec(k)['type'], pages=pages(k), modules=mods(k),
                            title=(sec(k).get('title') or ''), doc=sec(k)['doc'], pp=(sec(k).get('pdf_pages') or [sec(k).get('p0'), sec(k).get('p1')]),
                            best=round(secbest.get(k, 0), 3), subtopics=sorted(secmap.get(k, []), key=lambda x: -x[1])[:6],
                            importance=max((S[x]['imp'] for x, _ in secmap.get(k, [])), key=lambda i: RANK[i], default=None)) for k in allkeys},
          gaps=[dict(id=s['sid'], name=s['name'], imp=s['imp'], app=s['app'], domain=s['domain'], topic=s['topic'], cm=s['cm'],
                     host=cover[s['sid']].get('host'), host_how=cover[s['sid']].get('host_how'),
                     weak_hits=[(k, round(f, 3)) for k, a, f, c in cover[s['sid']]['weak']]) for s in gaps],
          unify={m: dict(eng=e, sim=round(v, 3), shared_sections=o, mil_name=S[m]['name'], eng_name=S[e]['name']) for m, (e, v, o) in unify.items()})
json.dump(cw, open(f'{H}/MG_crosswalk.json', 'w'), ensure_ascii=False, indent=0)
open(f'{H}/MG_build.out', 'w').write('\n'.join(OUT))
