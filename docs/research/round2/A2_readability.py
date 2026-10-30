"""Sentence-length profile of original sections vs rewrites (guards against 'telegraphic' compression).
Usage: python3 -I A2_readability.py"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from A2_blocks import split_blocks
TEX = re.compile(r'\$\$.*?\$\$|\$[^$]*\$', re.S)
def prof(text):
    t = TEX.sub(' X ', re.sub(r'⟦[^⟧]*⟧|\[\[[^\]]*\]\]|```\w*|@\w+:[^\n]*|\|', ' ', text))
    sents = [s for s in re.split(r'(?<=[.?!])\s+|\n\s*\n|\n-\s', t) if len(s.split()) >= 3]
    L = [len(s.split()) for s in sents]
    L.sort()
    return dict(sentences=len(L), mean=round(sum(L)/len(L), 1), median=L[len(L)//2],
                share_under8=round(sum(l < 8 for l in L)/len(L), 2), share_over30=round(sum(l > 30 for l in L)/len(L), 2))
bl = split_blocks(open(os.path.join(HERE, '..', '..', 'review', 'lesson_06x36q0uxkua5ggoifkz.md'), encoding='utf-8').read())
for name, rng, f in [('log', range(44, 60), 'log_v2.md'), ('lagrange', range(131, 149), 'lagrange_v2.md')]:
    orig = '\n\n'.join(b['text'] for b in bl if b['id'] in rng and b['type'] not in ('scene3d', 'chart', 'figure'))
    print(name, 'orig', prof(orig))
    print(name, 'v2  ', prof(open(os.path.join(HERE, 'A2_src', f), encoding='utf-8').read()))
