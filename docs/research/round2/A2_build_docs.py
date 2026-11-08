"""Build A2_rewrite_log.md and A2_rewrite_lagrange.md: header + clean v2 text + unit checklist table.
Usage: python3 -I A2_build_docs.py"""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from A2_coding import NAPIER, EXTREMUM, L3
from A2_audit import audit
for sec, table in [('log', NAPIER), ('lagrange', EXTREMUM)]:
    head = open(os.path.join(HERE, 'A2_src', f'head_{sec}.md'), encoding='utf-8').read()
    src = open(os.path.join(HERE, 'A2_src', f'{sec}_v2.md'), encoding='utf-8').read()
    clean = re.sub(r' ?⟦[NE]\d+⟧', '', src)
    a = audit(sec, 'v2')
    blk = {u: b for b, (us, _) in L3.items() for u in us if u in table}
    paras = [p for p in re.split(r'\n\s*\n', src) if p.strip()]
    rows = ['| unit | content (from the coding) | original block | where in v2 (paragraph ¶, first words) |', '|---|---|---|---|']
    for u, d in table.items():
        rows.append(f"| {u} | {d.replace('|', '/')} | {blk[u]} | {a['locations'].get(u, 'MISSING').replace('|', '/')} |")
    doc = head + '\n' + clean.strip() + '\n\n## Unit checklist (v2)\n\nParagraph indices count blank-line-separated blocks of `A2_src/' + sec + '_v2.md`.\n\n' + '\n'.join(rows) + '\n'
    open(os.path.join(HERE, f'A2_rewrite_{sec}.md'), 'w', encoding='utf-8').write(doc)
    print(sec, 'missing', a['missing_units'], 'ratio', a['ratio_vs_prose'], 'words', a['rewrite_words'])
