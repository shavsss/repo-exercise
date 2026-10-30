"""Project whole-lesson length under the dense template: words = units x w_u + exercises + keep (5%).
w_u = 26.5 (mean of the two measured rewrites, 25.8 and 27.1). Sections whose original density is already
below w_u are kept as they are (never 'expand'). Usage: python3 -I A2_project.py"""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.path.join(HERE, 'A2_measure_out.json'), encoding='utf-8'))
W_U = 26.5
for k, v in d.items():
    s = v['summary']; prose = s['prose_words']
    proj = 0
    for sec in s['by_section']:
        if sec['units']:
            proj += min(sec['prose_words'], sec['units'] * W_U)
    ex = sum(r['cat']['practice'] for r in v['blocks'])
    proj = proj * 1.05 + ex
    print(f"{k:14s} prose {prose:6d}  units {s['new_units']:3d}  projected {proj:6.0f}  ratio {proj/prose:.2f}  saved {prose-proj:5.0f} words")
