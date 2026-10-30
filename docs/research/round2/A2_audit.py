"""Audit a rewrite against the unit checklist and measure the word ratio.
Usage: python3 -I A2_audit.py log|lagrange v1|v2
 - every unit id (N*/E*) must appear as a marker ⟦id⟧ in the rewrite
 - word ratio vs the original section (prose words; payload JSON excluded; errata reported separately)
 - number fidelity: numbers in the original section that do not occur in the rewrite (for manual review)
 - per-unit location (paragraph index + first words) for the checklist JSON
"""
import os, re, sys, json
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from A2_blocks import split_blocks, words
from A2_coding import NAPIER, EXTREMUM, L3, P

SECTIONS = {'log': (NAPIER, range(44, 60)), 'lagrange': (EXTREMUM, range(131, 149))}
MARK = re.compile(r'⟦([NE]\d+)⟧')
HEDGE = re.compile(r'\[\[(?:ודאות|היפותטי)[^\]]*\]\]')
NUMRE = re.compile(r'(?<![\w.])\d+(?:[.,]\d+)*(?:\\{,\})?\d*')

def norm_num(s):
    s = s.replace('{,}', '').replace(',', '')
    try:
        v = float(s)
    except ValueError:
        return None
    return round(v, 6)

def nums(text):
    out = set()
    for m in re.findall(r'\d{1,3}(?:(?:\{,\}|,)\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?', text):
        v = norm_num(m)
        if v is not None and v not in (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10):
            out.add(v)
    return out

def audit(sec, ver):
    units, rng = SECTIONS[sec]
    src = open(os.path.join(HERE, 'A2_src', f'{sec}_{ver}.md'), encoding='utf-8').read()
    review = os.path.join(HERE, '..', '..', 'review', 'lesson_06x36q0uxkua5ggoifkz.md')
    blocks = split_blocks(open(review, encoding='utf-8').read())
    orig_blocks = [b for b in blocks if b['id'] in rng]
    o_all = sum(b['words'] for b in orig_blocks)
    o_payload = sum(b['words'] for b in orig_blocks if P(L3[b['id']][1]).get('p'))
    o_err = sum(b['words'] for b in orig_blocks if b['type'] == 'erratum')
    o_prose = o_all - o_payload
    present = MARK.findall(src)
    missing = [u for u in units if u not in present]
    clean = MARK.sub('', src)
    paras = [p for p in re.split(r'\n\s*\n', src) if p.strip()]
    loc = {}
    for k, p in enumerate(paras):
        for u in MARK.findall(p):
            first = re.sub(r'\s+', ' ', MARK.sub('', p)).strip()[:60]
            loc.setdefault(u, f'¶{k}: {first}')
    w_all = words(clean)
    keep = re.search(r'```keep\n(.*?)```', clean, re.S)
    w_keep = words(keep.group(1)) if keep else 0
    w_hedge = sum(words(h) for h in HEDGE.findall(clean))
    o_nums = set().union(*[nums(b['text']) for b in orig_blocks if not P(L3[b['id']][1]).get('p')])
    r_nums = nums(clean)
    lost_nums = sorted(o_nums - r_nums)
    res = dict(section=sec, version=ver, units=len(units), missing_units=missing,
               orig_words_all=o_all, orig_prose=o_prose, orig_prose_no_errata=o_prose - o_err,
               rewrite_words=w_all, rewrite_words_no_keep=w_all - w_keep, keep_words=w_keep, hedge_words=w_hedge,
               ratio_vs_prose=round(w_all / o_prose, 3), ratio_no_keep=round((w_all - w_keep) / o_prose, 3),
               ratio_vs_prose_no_errata=round(w_all / (o_prose - o_err), 3),
               words_per_unit_orig=round(o_prose / len(units), 1), words_per_unit_rewrite=round(w_all / len(units), 1),
               numbers_in_orig=len(o_nums), numbers_lost=lost_nums, locations=loc)
    return res

if __name__ == '__main__':
    sec, ver = sys.argv[1], sys.argv[2]
    r = audit(sec, ver)
    print(json.dumps({k: v for k, v in r.items() if k != 'locations'}, ensure_ascii=False, indent=1))
    json.dump(r, open(os.path.join(HERE, 'A2_src', f'audit_{sec}_{ver}.json'), 'w'), ensure_ascii=False, indent=1)
