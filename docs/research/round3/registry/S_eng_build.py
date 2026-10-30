"""Step 1+2: parse TOCs, map module page ranges to sections, extract section text features, classify type.
Writes S_eng_sections.json (all sections with features) and S_eng_map.json (module x section rows).
Run: python3 -I S_eng_build.py
"""
import json, re, os, glob, math, collections
REPO = '/home/user/repo-exercise'
OUT = os.path.dirname(os.path.abspath(__file__))
SYL = json.load(open(f'{REPO}/library/engineering/syllabus/syllabus.json'))
TEXTDIR = f'{REPO}/eng/app/artifact/lib/text'

LINE = re.compile(r'^(\s*)(CH|S|APP|BACK|FRONT)\s+(.*)$')

def parse_toc(path):
    doc = os.path.basename(path)[:-3]
    secs, chap = [], None
    npages = None
    for ln in open(path, encoding='utf-8'):
        ln = ln.rstrip('\n')
        if ln.startswith('#'):
            m = re.search(r'pdf_pages=(\d+)', ln)
            if m: npages = int(m.group(1))
            continue
        m = LINE.match(ln)
        if not m: continue
        ind, kind, rest = m.groups()
        if kind in ('CH', 'APP'):
            mm = re.match(r'(\S+)\s+(\d+)-(\d+)\s*(.*)', rest)
            if not mm: continue
            cid, a, b, t = mm.group(1), int(mm.group(2)), int(mm.group(3)), mm.group(4)
            chap = dict(kind=kind, id=cid, a=a, b=b, title=t, secs=[])
            secs.append(chap)
        elif kind in ('FRONT', 'BACK'):
            mm = re.match(r'(\d+)-(\d+)\s*(.*)', rest)
            if not mm: continue
            secs.append(dict(kind=kind, id=kind, a=int(mm.group(1)), b=int(mm.group(2)), title=mm.group(3), secs=[]))
            chap = None
        elif kind == 'S' and chap is not None:
            mm = re.match(r'(\S+)\s+(\d+)\s*(.*)', rest)
            if not mm: continue
            chap['secs'].append(dict(id=mm.group(1), p=int(mm.group(2)), title=mm.group(3), depth=len(ind)))
    # flatten to leaf sections with continuous spans [start, end)
    out = []
    for c in secs:
        if not c['secs']:
            out.append(dict(doc=doc, ch=c['id'], sid=f"{c['kind']}:{c['id']}", title=c['title'], chtitle=c['title'],
                            s=float(c['a']), e=float(c['b'] + 1), ckind=c['kind']))
            continue
        ss = c['secs']
        # only leaves: a section is a leaf if next section is not deeper
        first = ss[0]['p']
        if first > c['a']:  # chapter opener pages before first section
            out.append(dict(doc=doc, ch=c['id'], sid=f"{c['id']}/open", title=c['title'] + ' (opener)', chtitle=c['title'],
                            s=float(c['a']), e=float(first), ckind=c['kind']))
        for i, s in enumerate(ss):
            nxt = ss[i + 1]['p'] if i + 1 < len(ss) else c['b'] + 1
            nxt = min(max(nxt, s['p']), c['b'] + 1)
            st = float(s['p'])
            en = float(nxt)
            # sections that start on the same page as the next one: give 0.3 page, carve from the following
            out.append(dict(doc=doc, ch=c['id'], sid=f"{c['id']}/{s['id']}", title=s['title'], chtitle=c['title'],
                            s=st, e=en, ckind=c['kind'], depth=s['depth']))
    # fix zero-length: shift boundaries by 0.3 within the same page
    for i, x in enumerate(out):
        if x['e'] - x['s'] < 0.3:
            x['e'] = x['s'] + 0.3
            if i + 1 < len(out) and out[i + 1]['s'] < x['e'] and out[i + 1]['doc'] == x['doc']:
                out[i + 1]['s'] = x['e']
    # dedupe ids
    seen = collections.Counter()
    for x in out:
        seen[x['sid']] += 1
        if seen[x['sid']] > 1: x['sid'] += f"#{seen[x['sid']]}"
        x['pages'] = round(max(x['e'] - x['s'], 0.0), 2)
        x['key'] = f"{x['doc']}:{x['sid']}"
    return out

TYPES = ['front', 'notes_biblio', 'problems', 'summary', 'history', 'appendix_ref', 'examples', 'derivation', 'theory']

def classify(sec, f):
    t = (sec['title'] + ' ').lower()
    sid = sec['sid']
    if sec['ckind'] == 'FRONT' or re.search(r'\b(preface|foreword|contents|acknowledg|dedication|about chapter|roadmap|how to use this)', t):
        return 'front'
    if sec['ckind'] == 'BACK' or (re.search(r'\b(bibliograph|references|further reading|suggested reading|reading list|notes and references|index|glossary|acronyms|endnotes|answers? to|solutions to|bibliographic)', t)):
        return 'notes_biblio'
    if re.search(r'/P(#\d+)?$', sid) or (re.search(r'\b(problems|exercises|exercise|homework|questions|self-study|check yourself)\b', t)
                                           and not re.search(r'problems? (of|in|with)|the [a-z\- ]+ problem|problem solving|optimization problems', t)):
        return 'problems'
    if re.search(r'\b(summary|concluding|conclusions?|recap|closing remarks|chapter in review|key points|lessons learned)\b', t):
        return 'summary'
    if sec['ckind'] == 'APP' or re.search(r'\b(appendix|tables? of|list of symbols|notation|data sheet|catalog)\b', t):
        return 'appendix_ref'
    if re.search(r'\b(histor\w*|perspective|biograph\w*|age of|fallacies and pitfalls|real stuff|going faster|war story|war stories|in more depth)\b', t) or (
            f['histd'] >= 1.5 and f['eqld'] < 1):
        return 'history'
    if re.search(r'\b(introduction|overview|preview|motivation|opener|outlook|the future|concluding)\b', t) and f['eqld'] < 1.0 and f['thmd'] < 0.5:
        return 'history'
    if re.search(r'\b(examples?|case stud\w*|design example|worked|illustrative|sample problems?|applications?|circuit ideas|bad circuits)\b', t) or f['exd'] >= 1.0:
        return 'examples'
    if f['eqld'] >= 6 or f['eqd'] >= 3:
        return 'derivation'
    return 'theory'

def features(text, pages):
    pages = max(pages, 0.3)
    words = len(re.findall(r'[A-Za-z]{2,}', text))
    lines = text.split('\n')
    eql = sum(1 for l in lines if 2 < len(l.strip()) < 90 and (re.search(r'[=≈≤≥∝]| D ', l)) and len(re.findall(r'[A-Za-z]{4,}', l)) <= 6)
    eqn = len(re.findall(r'\((?:[A-Z]?\d{1,2}[\.\-–]\d{1,3}[a-z]?|\d{1,3})\)\s*$', text, re.M))
    thm = len(re.findall(r'\b(Theorem|Lemma|Proposition|Corollary|Law|Principle|THEOREM|LEMMA)\b', text))
    dfn = len(re.findall(r'\b(Definition|DEFINITION|is defined as|we define|is called|are called|is known as)\b', text))
    ex = len(re.findall(r'\b(Example|EXAMPLE|Solution|SOLUTION|Worked|Exercise)\b', text))
    fig = len(re.findall(r'\b(Figure|Fig\.|FIGURE|Table)\s*\d', text))
    mathch = len(re.findall(r'[=+∫∑∂√≈≤≥±×·αβγδεθλμπσφωΔΩ]', text))
    hist = len(re.findall(r'\b(1[5-9]\d\d|century|centuries|history|historical|invented|discovered)\b', text))
    prob = len(re.findall(r'^\s*(?:Problem\s+)?\d{1,2}[\.\-]\d{1,3}\.?\s', text, re.M))
    P = pages
    return dict(words=words, wpp=round(words / P, 1), eql=eql, eqld=round(eql / P, 2), eqn=eqn, eqd=round(eqn / P, 2),
                thm=thm, thmd=round(thm / P, 2), dfn=dfn, dfnd=round(dfn / P, 2), ex=ex, exd=round(ex / P, 2), figd=round(fig / P, 2),
                mathd=round(mathch / max(len(text), 1), 4), histd=round(hist / P, 2), probd=round(prob / P, 2), chars=len(text))

_text_cache = {}
def gettext(doc):
    if doc not in _text_cache:
        p = f'{TEXTDIR}/{doc}.json'
        _text_cache[doc] = json.load(open(p)) if os.path.exists(p) else {}
    return _text_cache[doc]

def section_text(sec):
    T = gettext(sec['doc'])
    a, b = int(math.floor(sec['s'])), int(math.ceil(sec['e'])) - 1
    if b < a: b = a
    parts = []
    for p in range(a, b + 1):
        v = T.get(str(p))
        if isinstance(v, dict): parts.append(v.get('t', ''))
        elif isinstance(v, str): parts.append(v)
    txt = '\n'.join(parts)
    # trim text before the title on the first page (shared pages)
    key = re.sub(r'\W+', ' ', sec['title']).strip()[:28]
    if key and len(key) > 6:
        m = re.search(re.escape(key).replace(r'\ ', r'\W+'), txt[:6000], re.I)
        if m: txt = txt[max(m.start() - 20, 0):]
    return txt

def main():
    secs = []
    for p in sorted(glob.glob(f'{REPO}/library/engineering/syllabus/toc/*.md')):
        secs += parse_toc(p)
    bykey = {s['key']: s for s in secs}
    # map modules
    rows = []
    docs_seen = collections.Counter()
    for m in SYL['modules']:
        for src in m['sources']:
            if src['role'] not in ('main', 'supp'): continue
            a, b = src['pages']
            A, B = float(a), float(b + 1)
            for s in secs:
                if s['doc'] != src['doc']: continue
                ov = min(B, s['e']) - max(A, s['s'])
                if ov <= 0.01: continue
                frac = ov / max(s['e'] - s['s'], 0.01)
                rows.append(dict(module=m['id'], tier=m['tier'], part=m['part'], role=src['role'], doc=s['doc'], key=s['key'],
                                 sid=s['sid'], title=s['title'], pages=round(ov, 2), frac=round(min(frac, 1), 3), note=src.get('note', '')))
    used = {r['key'] for r in rows}
    for s in secs:
        if s['key'] in used or True:
            txt = section_text(s)
            s['f'] = features(txt, s['pages'])
            s['type'] = classify(s, s['f'])
            s['used'] = s['key'] in used
    json.dump(secs, open(f'{OUT}/S_eng_sections.json', 'w'), ensure_ascii=False)
    json.dump(rows, open(f'{OUT}/S_eng_map.json', 'w'), ensure_ascii=False)
    # coverage check: module page totals vs mapped pages
    tot = collections.defaultdict(float); mp = collections.defaultdict(float)
    for m in SYL['modules']:
        for src in m['sources']:
            if src['role'] in ('main', 'supp'):
                tot[src['role']] += src['pages'][1] - src['pages'][0] + 1
    for r in rows: mp[r['role']] += r['pages']
    print('sections parsed', len(secs), 'used', len(used))
    print('source pages', dict(tot), 'mapped pages', {k: round(v) for k, v in mp.items()})
    print(collections.Counter(s['type'] for s in secs if s['used']))

if __name__ == '__main__':
    main()
