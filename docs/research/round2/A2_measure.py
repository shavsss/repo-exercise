"""A2 depth-density measurement.
Reads the three lessons, applies the manual coding in A2_coding.py, and reports
 - words per lesson by function (core / illus / restate / narr / hist / meta / hedge / scaf / dup / err / payload / practice)
 - words per NEW depth unit, by lesson, by section and by block type
 - automatic features per block (certainty tags, meta phrases, 4-gram overlap with earlier text, number density)
   and how well an automatic 'fluff score' predicts the manual non-core share (Spearman).
Usage: python3 -I A2_measure.py  (writes A2_measure_out.json next to it)
"""
import json, os, re, sys
from collections import defaultdict
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from A2_blocks import split_blocks, words
from A2_coding import LESSONS, P

REVIEW = os.path.join(HERE, '..', '..', 'review')
CATS = ['c', 'i', 'r', 'n', 'h', 'm', 's', 'd', 'e', 'p', 'x']
NAMES = dict(c='core', i='illus', r='restate', n='narr', h='hist', m='meta', s='scaf', d='dup',
             e='err', p='payload', x='practice', hedge='hedge')

HEDGE = re.compile(r'\[\[(?:ודאות|היפותטי)[^\]]*\]\]')
TAG25 = re.compile(r'\[\[2\.5:[^\]]*\]\]')
PAGE = re.compile(r'\[\[[A-Z]\d+:\d+\]\]')
META = re.compile('|'.join([
    r'בחלק הבא', r'בחלק הקודם', r'בשיעור הבא', r'בהמשך השיעור', r'נעבור', r'נחזור', r'נעצור', r'נתחיל',
    r'נראה (?:מיד|בהמשך|עכשיו|את)', r'כפי שראינו', r'ראינו (?:כבר|בשיעור|את)', r'כדאי לשים לב', r'שימו לב',
    r'לסיכום', r'סיכום', r'אפשר לסכם', r'בכך סיימנו', r'עד כאן', r'עכשיו (?:אפשר|נ)', r'הבטחנו',
    r'בשיעור [1-4]', r'בצומת', r'בגשר', r'נגזור (?:אותה|את זה)', r'דילגנו']))
NUM = re.compile(r'\d')
YEAR = re.compile(r'\b1\d{3}\b|המאה ה-')

def ngrams(ws, n=4):
    return {tuple(ws[k:k+n]) for k in range(len(ws)-n+1)}

def spearman(a, b):
    def rank(v):
        o = sorted(range(len(v)), key=lambda k: v[k]); r = [0]*len(v)
        k = 0
        while k < len(o):
            j = k
            while j+1 < len(o) and v[o[j+1]] == v[o[k]]: j += 1
            for t in range(k, j+1): r[o[t]] = (k+j)/2
            k = j+1
        return r
    ra, rb = rank(a), rank(b); n = len(a)
    ma, mb = sum(ra)/n, sum(rb)/n
    cov = sum((x-ma)*(y-mb) for x, y in zip(ra, rb))
    va = sum((x-ma)**2 for x in ra) ** .5; vb = sum((y-mb)**2 for y in rb) ** .5
    return cov/(va*vb)

def analyse(key):
    fname, coding = LESSONS[key]
    text = open(os.path.join(REVIEW, fname), encoding='utf-8').read()
    blocks = split_blocks(text)
    assert len(blocks) == len(coding), (key, len(blocks), len(coding))
    seen = set()
    rows = []
    for b in blocks:
        units, alloc = coding[b['id']]
        al = P(alloc)
        hedge_w = sum(words(m) for m in HEDGE.findall(b['text']))
        tag_w = sum(words(m) for m in TAG25.findall(b['text'])) + sum(words(m) for m in PAGE.findall(b['text']))
        rest = b['words'] - hedge_w - tag_w
        cat = {k: rest * al.get(k, 0) / 100 for k in CATS}
        cat['hedge'] = hedge_w
        cat['m'] += tag_w            # inline [[2.5: ...]] and [[K1:..]] labels are reader-invisible scaffolding
        ws = re.findall(r'\S+', b['text'])
        g = ngrams(ws)
        overlap = len(g & seen) / max(1, len(g))
        seen |= g
        sents = [s for s in re.split(r'(?<=[.?!:])\s+', b['text']) if s.strip()]
        meta_hits = sum(1 for s in sents if META.search(s))
        rows.append(dict(id=b['id'], type=b['type'], section=b['section'], words=b['words'], units=units,
                         n_units=len(units), cat=cat, hedge_tags=len(HEDGE.findall(b['text'])),
                         overlap4=overlap, meta_sent_share=meta_hits/max(1, len(sents)),
                         num_density=len(NUM.findall(b['text']))/max(1, b['words']),
                         year_hits=len(YEAR.findall(b['text']))))
    return rows

def summarise(key, rows):
    tot = defaultdict(float)
    for r in rows:
        for k, v in r['cat'].items(): tot[k] += v
    W = sum(r['words'] for r in rows)
    prose = W - tot['p']
    U = sum(r['n_units'] for r in rows)
    out = dict(lesson=key, words=W, prose_words=round(prose), new_units=U,
               words_per_unit_all=round(W/U, 1), words_per_unit_prose=round(prose/U, 1),
               core_words_per_unit=round(tot['c']/U, 1),
               share={NAMES[k]: round(100*v/prose, 1) for k, v in tot.items() if k != 'p'},
               hedge_tags=sum(r['hedge_tags'] for r in rows))
    # by section
    sec = defaultdict(lambda: [0, 0, 0.0])
    for r in rows:
        if r['type'] in ('notebook', 'scene3d', 'anim', 'chart', 'sim'): pass
        s = sec[r['section']]; s[0] += r['words'] - r['cat']['p']; s[1] += r['n_units']; s[2] += r['cat']['c']
    out['by_section'] = [dict(section=k, prose_words=round(v[0]), units=v[1],
                              wpu=(round(v[0]/v[1], 1) if v[1] else None),
                              core_share=round(100*v[2]/max(1, v[0]), 1)) for k, v in sec.items()]
    bt = defaultdict(lambda: [0, 0, 0.0, 0])
    for r in rows:
        t = bt[r['type']]; t[0] += r['words'] - r['cat']['p']; t[1] += r['n_units']; t[2] += r['cat']['c']; t[3] += 1
    out['by_type'] = sorted([dict(type=k, blocks=v[3], prose_words=round(v[0]), units=v[1],
                                  wpu=(round(v[0]/v[1], 1) if v[1] else None),
                                  core_share=round(100*v[2]/max(1, v[0]), 1)) for k, v in bt.items()],
                            key=lambda d: -d['prose_words'])
    # automatic predictor of manual non-core share (prose blocks only)
    xs, ys = [], []
    for r in rows:
        pw = r['words'] - r['cat']['p']
        if pw < 15 or r['type'] in ('notebook', 'scene3d', 'anim', 'chart', 'sim', 'exercise', 'erratum'):
            continue
        noncore = 1 - r['cat']['c'] / pw
        fluff = (0.9*r['overlap4'] + 0.6*r['meta_sent_share'] + 0.15*min(r['year_hits'], 4)/4
                 + 0.3*(r['hedge_tags'] > 0) - 1.2*r['num_density'] - 0.4*min(r['n_units'] if False else 0, 1))
        xs.append(fluff); ys.append(noncore)
    out['auto_vs_manual_spearman'] = round(spearman(xs, ys), 3)
    out['auto_n_blocks'] = len(xs)
    return out

if __name__ == '__main__':
    result = {}
    for key in LESSONS:
        rows = analyse(key)
        s = summarise(key, rows)
        result[key] = dict(summary=s, blocks=[{k: (v if k != 'cat' else {NAMES[c]: round(x, 1) for c, x in v.items()})
                                               for k, v in r.items()} for r in rows])
        print(f"\n=== {key}: {s['words']} words ({s['prose_words']} prose), {s['new_units']} new units")
        print(f"  words/unit (prose) {s['words_per_unit_prose']}   core words/unit {s['core_words_per_unit']}")
        print('  shares % of prose:', ', '.join(f"{k} {v}" for k, v in sorted(s['share'].items(), key=lambda kv: -kv[1])))
        print('  auto-fluff vs manual non-core: spearman', s['auto_vs_manual_spearman'], 'n', s['auto_n_blocks'])
        print('  by section:')
        for d in s['by_section']:
            print(f"    {d['section'][:44]:44s} {d['prose_words']:5d} w {d['units']:3d} u  wpu {d['wpu']}  core {d['core_share']}%")
        print('  by block type:')
        for d in s['by_type']:
            print(f"    {d['type']:12s} n={d['blocks']:3d} {d['prose_words']:5d} w {d['units']:3d} u  wpu {d['wpu']}  core {d['core_share']}%")
    json.dump(result, open(os.path.join(HERE, 'A2_measure_out.json'), 'w'), ensure_ascii=False, indent=1)
