"""Export the unit coding and the two rewrite checklists to A2_units.json.
Usage: python3 -I A2_units_export.py   (run A2_audit.py log v2 / lagrange v2 first)"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from A2_coding import LESSONS, NAPIER, EXTREMUM, L3, __doc__ as SCHEME
out = {'scheme': SCHEME.strip(), 'lessons': {}, 'rewrite_checklists': {}}
for key, (fname, cod) in LESSONS.items():
    units = []
    for b, (us, alloc) in sorted(cod.items()):
        for u in us:
            full = NAPIER.get(u) or EXTREMUM.get(u)
            units.append({'id': u if full else f'{key}:b{b}:{len(units)}', 'block': b,
                          'type': (full or u).split()[0], 'desc': full or u, 'alloc_of_block': alloc})
    out['lessons'][key] = {'file': fname, 'n_units': len(units), 'units': units}
for sec, table in [('log', NAPIER), ('lagrange', EXTREMUM)]:
    aud = json.load(open(os.path.join(HERE, 'A2_src', f'audit_{sec}_v2.json'), encoding='utf-8'))
    blk = {u: b for b, (us, _) in L3.items() for u in us if u in table}
    out['rewrite_checklists'][sec] = {
        'rewrite_file': f'A2_rewrite_{sec}.md', 'missing_in_v2': aud['missing_units'],
        'orig_prose_words': aud['orig_prose'], 'v2_words': aud['rewrite_words'], 'ratio': aud['ratio_vs_prose'],
        'units': [{'id': u, 'desc': d, 'orig_block': blk.get(u), 'v2_location': aud['locations'].get(u)} for u, d in table.items()]}
json.dump(out, open(os.path.join(HERE, 'A2_units.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print({k: v['n_units'] for k, v in out['lessons'].items()}, {k: (v['ratio'], v['missing_in_v2']) for k, v in out['rewrite_checklists'].items()})
