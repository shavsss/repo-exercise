"""R8: dump sampled chapter pages (pdf page numbers) to R8_samples/*.txt for manual CR counting."""
import json, re, sys, os
R2 = os.path.dirname(os.path.abspath(__file__))
ENG = '/home/user/repo-exercise/eng/app/artifact/lib/text/'
MIL = json.load(open(R2 + '/cache/mil_text.json'))
SAMPLES = [  # id, doc, first, last, kind, module
    ('S1', 'K2', 127, 142, 'math derivation (Kolmogorov calc. of variations)', 'Gilua K2 ch VIII'),
    ('S2', 'F1', 221, 235, 'Feynman (resonance + transients)', 'Gilua F1 ch 23-24'),
    ('S3', 'E01', 316, 330, 'signals (Oppenheim CTFT 4.1-4.2)', 'Gilua P4'),
    ('S4', 'E05', 64, 75, 'probability (Wasserman ch 3)', 'Gilua P6'),
    ('S5', 'B02', 96, 110, 'radar (Richards radar equation)', 'Lanchester M2.2'),
    ('S6', 'B01', 199, 212, 'EW (EW101 jamming J/S, burn-through)', 'Lanchester M4.7'),
    ('S7', 'B06', 189, 203, 'missiles (Siouris PN)', 'Lanchester M6.4'),
    ('S8', 'E13', 325, 340, 'engineering bridge (Gere beams 5.2-5.6)', 'Gilua P16'),
    ('S9', 'B07', 44, 58, 'OR / systems (AMD SE effectiveness)', 'Lanchester M7.1'),
    ('S10', 'B09', 103, 117, 'descriptive (UAV performance)', 'Lanchester M9.2'),
]
def page(doc, p):
    if doc in MIL:
        t = MIL[doc].get(str(p), '')
        return t if isinstance(t, str) else t.get('t', '')
    d = json.load(open(ENG + doc + '.json'))
    v = d.get(str(p), {})
    return v.get('t', '') if isinstance(v, dict) else str(v)
def clean(t):
    lines = [l.strip() for l in t.split('\n')]
    lines = [l for l in lines if len(l) > 2 and not re.fullmatch(r'[\d\s.,\-–]+', l)]
    return ' '.join(lines)
if __name__ == '__main__':
    out = {}
    for sid, doc, a, b, kind, mod in SAMPLES:
        txt = []; w = 0
        for p in range(a, b + 1):
            c = clean(page(doc, p)); w += len(c.split())
            txt.append(f'\n[[p{p}]] ' + c)
        open(f'{R2}/R8_samples/{sid}_{doc}_{a}-{b}.txt', 'w').write(f'# {sid} {doc} pdf {a}-{b} | {kind} | {mod}\n' + '\n'.join(txt))
        out[sid] = dict(doc=doc, pages=b - a + 1, words=w, kind=kind)
        print(sid, doc, a, b, b - a + 1, 'pp', w, 'words |', clean(page(doc, a))[:160])
    json.dump(out, open(R2 + '/R8_samples/index.json', 'w'), indent=1)
