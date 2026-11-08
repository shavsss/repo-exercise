#!/usr/bin/env python3
"""F. Final curriculum for both apps (Gilua = eng, Lanchester = mil).

Inputs: round3/panels/P*.json (panels win), round3/registry/S_*_registry.json (sections, CR/K/S/C),
round3/merge/MG_topics.json (crosswalk classes, for the 'kept by default' count), the two syllabi.
Applies the learner's decisions (see DECISIONS below). Writes F_curriculum.json and F_curriculum.md.
Run: python3 -I F_build.py
"""
import json, os, re, collections

HERE = os.path.dirname(os.path.abspath(__file__))
R3 = os.path.dirname(HERE)
REPO = '/home/user/repo-exercise'
J = lambda p: json.load(open(p))

SYL = {'eng': J(f'{REPO}/library/engineering/syllabus/syllabus.json'),
       'mil': J(f'{REPO}/library/military/syllabus/syllabus.json')}
EREG = J(f'{R3}/registry/S_eng_registry.json')['sections']
MREG = J(f'{R3}/registry/S_mil_registry.json')['units']
MG = J(f'{R3}/merge/MG_topics.json')
PANELS = ['P1_math_physics', 'P2_signals_control_comms_electronics', 'P3_thermo_fluids_structures_systems',
          'P4_ml_rl_robotics_periphery', 'P5_sensors_ew_comms_pnt', 'P6a_space_unmanned_platforms_naval',
          'P6b_guidance_airdefense_c4isr', 'P7_or_logistics_acquisition_analysis']
P = {p: J(f'{R3}/panels/{p}.json') for p in PANELS}
PANEL_APP = {p: ('eng' if p[:2] in ('P1', 'P2', 'P3', 'P4') else 'mil') for p in PANELS}


# ------------------------------------------------------------------ page-range parsing
def ranges(pg):
    """-> list of (a, b) inclusive-ish float ranges from the many formats panels used."""
    out = []
    if pg is None:
        return out
    if isinstance(pg, (int, float)):
        return [(float(pg), float(pg))]
    if isinstance(pg, list):
        if all(isinstance(x, (int, float)) for x in pg):
            for i in range(0, len(pg) - 1, 2):
                out.append((float(pg[i]), float(pg[i + 1])))
            return out
        for x in pg:
            out += ranges(x)
        return out
    s = str(pg).replace('~', '').replace('–', '-')
    s = s.split('@')[-1]
    for part in re.split(r'[;,]', s):
        m = re.findall(r'\d+(?:\.\d+)?', part)
        if len(m) >= 2:
            out.append((float(m[0]), float(m[1])))
        elif len(m) == 1:
            out.append((float(m[0]), float(m[0])))
    return out


def npages(rr):
    return sum(max(b - a + 1, 0) for a, b in rr)


def overlap(a0, a1, rr):
    """pages of [a0, a1] (inclusive) covered by ranges rr."""
    tot = 0.0
    for b0, b1 in rr:
        lo, hi = max(a0, b0), min(a1 + 1, b1 + 1)
        tot += max(0.0, hi - lo)
    return tot


# ------------------------------------------------------------------ 1. section decisions
# decision per registry row: 'keep' (default), 'nn' (not needed), 'testout' (diagnostic; never removed)
ekeys = {s['key']: s for s in EREG}
muids = {u['uid']: u for u in MREG}
DEC_E = {}   # key -> (decision, reason, panel)
DEC_M = {}   # uid -> list of (frac, decision, reason, panel)
RANGE_E = collections.defaultdict(list)   # doc -> [(ranges, decision, reason, panel)]
RANGE_M = collections.defaultdict(list)
OUTSIDE = []   # decisions on pages outside the syllabus registry (ref books B14-B17, unlinked B16)


def add_decision(panel, x, decision, reason):
    k = x.get('key')
    if not k:
        s = str(x.get('section', '')).split(' ')[0]
        k = s if ':' in s else f"{x.get('doc')}:{s}"
    if k in ekeys:
        DEC_E[k] = (decision, reason, panel)
        return
    if k in muids:
        DEC_M.setdefault(k, []).append((1.0, decision, reason, panel))
        return
    rr = ranges(x.get('pages'))
    doc = x.get('doc')
    if not rr or not doc:
        return
    if doc.startswith(('E', 'K', 'F')) and doc[1:2].isdigit():
        RANGE_E[doc].append((rr, decision, reason, panel, x.get('module')))
    else:
        RANGE_M[doc].append((rr, decision, reason, panel, x.get('module')))


for p, d in P.items():
    for x in d['sections_not_needed']:
        reason = x.get('reason', '')
        dec = 'nn'
        if x.get('test_out') or 'test-out' in reason.lower():
            dec = 'testout'          # learner rule: test-out candidates are never removed
        add_decision(p, x, dec, reason)
    for x in d['sections_kept_unmatched']:
        dd = str(x.get('decision', '')) + ' ' + str(x.get('reason', ''))
        dec = 'testout' if ('test-out' in dd.lower() or 'test out' in dd.lower()) else 'keep'
        add_decision(p, x, dec, (x.get('serves') or x.get('reason') or x.get('decision') or ''))

# P6b explicit test-out sections (from its report: never removal)
P6B_TO = [('B08', [(357, 387)]), ('B07', [(24, 37)]), ('B07', [(228, 245)])]
for doc, rr in P6B_TO:
    RANGE_M[doc].append((rr, 'testout', 'P6b test-out section (platform descriptions / SE overlap / WGS-84)',
                         'P6b_guidance_airdefense_c4isr', None))


def mil_unit_decisions(u):
    """-> list of (frac, decision, reason, panel) covering the unit; remainder keep."""
    out = list(DEC_M.get(u['uid'], []))
    for rr, dec, reason, panel, mod in RANGE_M.get(u['doc'], []):
        if mod and isinstance(mod, str) and re.match(r'M\d', mod) and u['module'] not in re.findall(r'M\d+\.\d+', mod):
            continue
        ov = overlap(u['p0'], u['p1'], rr)
        if ov > 0:
            out.append((min(1.0, ov / max(u['pages'], 1)), dec, reason, panel))
    return out


def eng_section_decision(s):
    if s['key'] in DEC_E:
        return [(1.0,) + DEC_E[s['key']]]
    out = []
    a, b = s['pdf_pages']
    for rr, dec, reason, panel, mod in RANGE_E.get(s['doc'], []):
        ov = overlap(a, b - 1 if b > a else b, rr)
        if ov > 0:
            out.append((min(1.0, ov / max(s['pages'], 0.3)), dec, reason, panel))
    return out


# ------------------------------------------------------------------ 2. module skeleton + tier moves
MODS = {}
ORDER = {'eng': [], 'mil': []}
for app in ('eng', 'mil'):
    for i, m in enumerate(SYL[app]['modules']):
        MODS[(app, m['id'])] = dict(app=app, id=m['id'], part=m['part'], title=m['en'], tier=m['tier'],
                                    tier_was=m['tier'], status='existing', prereq=m.get('prereq', []),
                                    sources=m['sources'], kept=[], not_needed=[], testout=[], rehosted_in=[],
                                    added=[], notes=[],
                                    c=collections.Counter())
        ORDER[app].append(m['id'])

NEW_MODULES = [
    # app, id, after, part, title, tier, prereq, note
    ('eng', 'M10.10', 'M10.9', 'P10', 'Finite elements and finite volumes: Galerkin/Ritz, meshing, FEM in practice and how to read an FEM result',
     'core', ['M10.6', 'M10.1'], 'P1 (K, no book teaches FEM/FV; seeds K2 VI/5 Galerkin, K2 VIII/3 Ritz) + P3 (FEM in practice)'),
    ('eng', 'M13.19', 'M13.18', 'P13', 'Power systems and the grid: per-unit and three-phase, power flow, faults and protection, stability and frequency control, grid vulnerability',
     'core', ['M13.17', 'M12.1'], 'P2: largest structural hole in electric power; no Gilua book teaches grids'),
    ('mil', 'M6.12', 'M6.11', 'P6', 'Tactical missile conceptual design (Fleeman B13): drivers, sizing, propulsion trades, heating and domes, cost',
     'core', ['M6.2', 'M6.4'], 'P6b: B13 is in the library but in no module; needs OCR first'),
    ('mil', 'M6.13', 'M6.12', 'P6', 'Tactical missile design, advanced chapters (Fleeman ch.8-9)', 'adv', ['M6.12'], 'P6b'),
    ('mil', 'M8.8', 'M8.7', 'P8', 'Combat survivability (Ball): susceptibility, vulnerability, kill trees, mission and campaign attrition, historical loss rates',
     'core', ['M0.4', 'M2.4', 'M11.4'], 'P6a + P7 (P7+.11): Ball ch.1, 5.1-5.2, 6.1-6.2 attached to nothing today'),
    ('mil', 'M8.9', 'M8.8', 'P8', 'Air campaign capacity: sortie generation, basing and air-base attack, tankers',
     'core', ['M8.8', 'M9.2'], 'P6a + P7 (P7+.1)'),
    ('mil', 'M9.9', 'M9.8', 'P9', 'One-way attack drones, FPV and drone-war economics (Shahed-class, FPV, fiber-optic, mass production, C-UAS cost-exchange)',
     'core', ['M9.7', 'M9.5', 'M8.8'], 'P6a + P5 + P6b + P7 (Ukraine lessons)'),
    ('mil', 'M13.23', 'M13.22', 'P13', 'Space control: counterspace taxonomy, SDA, RPO, resilience and proliferation, commercial dependence',
     'core', ['M13.5', 'M13.6', 'M7.6'], 'P6a'),
    ('mil', 'M14.1', None, 'P14', 'Combat modeling: model types and MOEs, Lanchester and salvo attrition, exchange ratios, models and wargames as evidence',
     'core', ['M0.4', 'M7.1'], 'P7 NEW-A2 + NEW-A3 merged into ONE module (Lanchester has no OR host; decision: attrition and evidence are lessons, not separate modules). Lanchester laws move here from adv M12.2'),
    ('mil', 'M14.2', 'M14.1', 'P14', 'Acquisition, cost and industrial base: cost definitions, LCC, learning curves, budgets as data, TRL/MRL, surge and critical materials',
     'core', ['M14.1', 'M7.10'], 'P7 NEW-Q1 (cost stays K, decision)'),
    ('mil', 'M14.3', 'M14.2', 'P14', 'Logistics and sustainment: consumption, LOC capacity, munitions vs stockpiles, readiness, contested and drone-war logistics (van Creveld promoted)',
     'core', ['M14.1'], 'P7 NEW-L1'),
    ('mil', 'M14.4', 'M14.3', 'P14', 'OSINT and capability assessment: imagery, geolocation, verification, ADS-B/AIS, OOB estimation, net assessment, analytic bias',
     'core', ['M3.10', 'M13.11', 'M5.5', 'M8.4'], 'P7 NEW-C1 + the method half of NEW-V1 (ADV.4.x); the Iran half is dropped by decision'),
    ('mil', 'M14.5', 'M14.4', 'P14', 'Writing and interviewing as an analyst (capstone): article structure, expert interviews, uncertainty, honest charts, think-tank critique, AI-checking',
     'core', ['M14.1', 'M14.2', 'M14.3', 'M14.4'], 'P7 NEW-C2'),
]
for app, mid, after, part, title, tier, prereq, note in NEW_MODULES:
    MODS[(app, mid)] = dict(app=app, id=mid, part=part, title=title, tier=tier, tier_was=None, status='new',
                            prereq=prereq, sources=[], kept=[], not_needed=[], testout=[], rehosted_in=[], added=[],
                            notes=[note], c=collections.Counter())
    if after and after in ORDER[app]:
        ORDER[app].insert(ORDER[app].index(after) + 1, mid)
    else:
        ORDER[app].append(mid)

TIER_MOVES = [  # (app, module, new tier, note)
    ('mil', 'M7.4', 'core', 'P6b: B07 ch.7 is the quantitative core of AMD; module also hosts raid/magazine/cost-exchange (P7 NEW-A1, merged here)'),
    ('mil', 'M7.10', 'core', 'Hosts T&E and test evidence (P7 NEW-Q2 merged here: DT/OT/LFT&E, test realism, few-shot statistics, reading DOT&E/GAO)'),
]
for app, mid, t, note in TIER_MOVES:
    MODS[(app, mid)]['tier'] = t
    MODS[(app, mid)]['status'] = 're-hosted'
    MODS[(app, mid)]['notes'].append(note)
MODS[('mil', 'M7.4')]['title'] += ' + raids, magazines and cost-exchange'
MODS[('mil', 'M7.10')]['title'] += ' + T&E and test evidence'

# section-level moves to core (adv-held K material); (app, from_module, doc, page range, to_module, note)
SECTION_MOVES = [
    ('eng', 'M8.14', 'K3', (None, None), 'M8.14', 'K3 XIX/1-4 (Hilbert space, operators) made core (P1)', r'^XIX/[1-4]'),
    ('eng', 'M9.16', 'F2', (None, None), 'M9.9', 'F2 27 Poynting and field energy taught as core delta in M9.9 (P1)', r'^27'),
    ('eng', 'M9.14', 'F2', (None, None), 'M9.9', 'F2 32-33 Fresnel reflection, skin depth as core delta in M9.9 (P1)', r'^3[23]'),
    ('eng', 'M9.14', 'F1', (None, None), 'M9.9', 'F1 34-6/7 Doppler as core delta (P1)', r'^34'),
    ('eng', 'M6.9', 'E05', (None, None), 'M6.2', 'Multivariate Gaussian conditioning as core delta in M6.2 (P1)', r'(?i)multivariate normal|^2/2\.10|^14/14\.[23]'),
    ('eng', 'M6.10', 'E05', (None, None), 'M6.2', 'Causal confounding as core delta in M6.2 (P1)', r'^16/16\.[12]'),
    ('eng', 'M23.8', 'E23', (None, None), 'M23.3', 'Shannon-Hartley E23 5.1-5.2 taught in core M23.3 (P2)', r'^5/5\.[12]'),
    ('eng', 'M11.14', 'E09', (None, None), 'M11.1', 'Oscilloscope / measurement appendix pulled into core M11.1 (P2)', r'(?i)oscillo|load.?line'),
    ('mil', 'M12.2', 'D5', (164, 176), 'M12.1', 'D5 recon-strike complexes pulled into core M12.1 (P7)', None),
    ('mil', 'M12.4', 'D6', (59, 74), 'M12.3', 'D6 PLA system warfare pulled into core M12.3 (P7)', None),
]
MOVED_E = {}   # registry key -> (to_module, note)
MOVED_M = {}   # uid -> (to_module, note)
for app, frm, doc, (a, b), to, note, rx in SECTION_MOVES:
    if app == 'eng':
        for s in EREG:
            if s['doc'] == doc and any(r['module'] == frm for r in s['modules']):
                lab = f"{s['chapter']}/{s['section']}" if s['section'] else s['chapter']
                if rx and (re.search(rx, s['key'].split(':', 1)[1]) or re.search(rx, s['title'])):
                    MOVED_E[s['key']] = (to, note, frm)
    else:
        for u in MREG:
            if u['doc'] == doc and u['module'] == frm and overlap(u['p0'], u['p1'], [(a, b)]) > 0:
                MOVED_M[u['uid']] = (to, note, frm)

# ------------------------------------------------------------------ 3. per-module aggregation from the registries
TIER = lambda app, mid: MODS[(app, mid)]['tier']


def bump(mod, role, pages, cr, K, S, C, dec, dup, testout_flag=False):
    c = mod['c']
    w = 1.0 if role == 'main' else 0.5
    if dec == 'nn':
        c['nn_pages'] += pages
        c['nn_cr'] += cr
        return
    c['pages_' + role] += pages
    c['wpages'] += w * pages
    c['cr'] += cr * (1 - dup); c['K'] += K * (1 - dup); c['S'] += S * (1 - dup); c['C'] += C * (1 - dup)
    c['cr_delta'] += cr * dup
    c['dup_wpages'] += w * pages * dup
    if dec == 'testout' or testout_flag:
        c['to_wpages'] += w * pages
        c['to_cr'] += cr * (1 - dup)


ECLASS = {'A_math_survey': 'A', 'B_feynman': 'B', 'C_theorem_dense': 'C', 'D_eng_textbook': 'D',
          'E_descriptive_practice': 'F'}
MG_CLS = {k: v['cls'] for k, v in MG['crosswalk_sections'].items()}
default_kept_unreviewed = collections.Counter()

for s in EREG:
    decs = eng_section_decision(s)
    for row in s['modules']:
        mid = row['module']
        tgt = mid
        if s['key'] in MOVED_E and MOVED_E[s['key']][2] == mid:
            tgt = MOVED_E[s['key']][0]
        mod = MODS[('eng', tgt)]
        f = row['pages'] / max(s['pages'], 1e-9)
        est = s['est']
        keep_frac = 1.0
        for frac, dec, reason, panel in decs:
            if dec in ('nn', 'testout'):
                fr = min(frac, keep_frac)
                keep_frac -= fr
                bump(mod, row['role'], row['pages'] * fr, est['strict'] * f * fr, est['K'] * f * fr, est['S'] * f * fr,
                     est['C'] * f * fr, dec, 0.0)
                tgtlist = mod['not_needed'] if dec == 'nn' else mod['testout']
                tgtlist.append(dict(doc=s['doc'], key=s['key'], title=s['title'], pages=round(row['pages'] * fr, 1),
                                    pdf=s['pdf_pages'], reason=reason, panel=panel[:3]))
        if keep_frac > 1e-6:
            dup = 0.0
            if s.get('delta_of'):
                dup = 1 - s['delta_of'].get('keep', 1.0)
            pg = row['pages'] * keep_frac
            bump(mod, row['role'], pg, est['strict'] * f * keep_frac, est['K'] * f * keep_frac, est['S'] * f * keep_frac,
                 est['C'] * f * keep_frac, 'keep', dup)
            mod['c']['cls_' + ECLASS[s['book_class']]] += (1.0 if row['role'] == 'main' else 0.5) * pg
            mod['kept'].append(dict(doc=s['doc'], key=s['key'], title=s['title'], pages=round(pg, 1), role=row['role'],
                                    moved_from=(MOVED_E[s['key']][2] if tgt != mid else None)))
            if not decs and MG_CLS.get(s['key']) in ('unmapped_nonteaching', 'N_only'):
                default_kept_unreviewed['eng'] += pg
            if tgt != mid:
                MODS[('eng', tgt)]['rehosted_in'].append(f"{s['key']} from {mid} ({MOVED_E[s['key']][1]})")

MIL_TYPECLS = {'theory': 'E', 'derivation': 'E', 'examples': 'E', 'history': 'G', 'doctrine': 'G', 'descriptive': 'G',
               'summary': 'F', 'problems': 'F', 'appendix': 'F'}
for u in MREG:
    mid = u['module']
    tgt = MOVED_M[u['uid']][0] if u['uid'] in MOVED_M else mid
    mod = MODS[('mil', tgt)]
    decs = mil_unit_decisions(u)
    keep_frac = 1.0
    for frac, dec, reason, panel in decs:
        if dec in ('nn', 'testout'):
            fr = min(frac, keep_frac)
            if fr <= 0:
                continue
            keep_frac -= fr
            bump(mod, u['role'], u['pages'] * fr, u['cr'] * fr, u['K'] * fr, u['S'] * fr, u['C'] * fr, dec,
                 (0.315 if u['delta'] else 0.0) * (dec != 'nn'))
            if dec == 'testout':
                mod['c']['cls_' + ('H' if u['doc'] == 'B12' else MIL_TYPECLS[u['type']])] += (1 if u['role'] == 'main' else .5) * u['pages'] * fr
            (mod['not_needed'] if dec == 'nn' else mod['testout']).append(
                dict(doc=u['doc'], uid=u['uid'], title=u['title'], pages=round(u['pages'] * fr, 1), reason=reason, panel=panel[:3]))
    if keep_frac > 1e-6:
        dup = 0.315 if u['delta'] else 0.0       # S_mil: 32% of K+S in flagged units duplicate Gilua
        dup = max(dup, u.get('internal_repeat', 0.0))
        to_flag = bool(u['testout_candidate'])
        pg = u['pages'] * keep_frac
        bump(mod, u['role'], pg, u['cr'] * keep_frac, u['K'] * keep_frac, u['S'] * keep_frac, u['C'] * keep_frac,
             'keep', dup, testout_flag=to_flag)
        mod['c']['cls_' + ('H' if u['doc'] == 'B12' else MIL_TYPECLS[u['type']])] += (1 if u['role'] == 'main' else .5) * pg
        rec = dict(doc=u['doc'], uid=u['uid'], title=u['title'], pages=round(pg, 1), role=u['role'],
                   moved_from=(mid if tgt != mid else None))
        (mod['testout'] if to_flag else mod['kept']).append(rec if not to_flag else dict(rec, reason='registry test-out candidate (descriptive/doctrine/history; operational background)', panel='S_mil'))
        if tgt != mid:
            mod['rehosted_in'].append(f"{u['uid']} from {mid} ({MOVED_M[u['uid']][1]})")

# ------------------------------------------------------------------ 4. ref-book pages re-hosted into lessons (outside the registry)
# class rates per page from the Lanchester registry: math-bearing vs narrative vs all
def rate(types):
    us = [u for u in MREG if u['type'] in types and u['doc'] != 'B12']
    pg = sum(u['pages'] for u in us)
    return {k: sum(u[k] for u in us) / pg for k in ('cr', 'K', 'S', 'C')}


RATE = {'math': rate({'theory', 'derivation', 'examples'}), 'narr': rate({'history', 'doctrine', 'descriptive'}),
        'mix': rate({'theory', 'derivation', 'examples', 'history', 'doctrine', 'descriptive', 'summary', 'problems', 'appendix'})}
REHOST = [  # module, doc, (a, b), role, rate class, test-out?, note
    ('M14.1', 'B14', (84, 114), 'main', 'math', True, 'Lanchester laws, moved from adv M12.2 (rule 33: already read -> diagnostic)'),
    ('M14.1', 'B15', (92, 141), 'main', 'math', True, 'Przemieniecki attrition, moved from adv M12.2'),
    ('M14.1', 'B14', (8, 20), 'main', 'math', True, 'B14 1.2-1.3 model types and shortcuts'),
    ('M14.1', 'B15', (22, 31), 'supp', 'narr', True, 'B15 ch.1 scientific methods'),
    ('M14.1', 'B15', (320, 329), 'main', 'math', True, 'B15 ch.12 modeling of military operations'),
    ('M14.1', 'B14', (214, 238), 'supp', 'math', True, 'B14 ch.10 terror and insurgency models'),
    ('M7.3', 'B15', (142, 163), 'supp', 'math', True, 'B15 5.3-5.5 stochastic attrition, SLS assignment'),
    ('M7.3', 'B14', (53, 83), 'supp', 'math', True, 'B14 ch.3-4 shoot-look-shoot, salvo Pk (ref -> supp)'),
    ('M7.1', 'B15', (164, 185), 'supp', 'math', True, 'B15 6.1-6.2 layered defense Pk (ref -> supp)'),
    ('M7.1', 'B15', (206, 219), 'supp', 'math', True, 'B15 7.1-7.3 penetration, PRA (ref -> supp)'),
    ('M10.3', 'B14', (146, 161), 'supp', 'math', True, 'B14 7.4 barrier patrol, 7.6 moving targets (ASW search)'),
    ('M8.8', 'B16', (25, 105), 'main', 'mix', False, 'Ball 1.1 survivability fundamentals, P_S = 1 - P_H P_K|H, campaign survivability'),
    ('M8.8', 'B16', (106, 141), 'main', 'narr', False, 'Ball 1.2 historical loss rates'),
    ('M8.8', 'B16', (198, 226), 'supp', 'mix', False, 'Ball 1.7 conclusions and problems'),
    ('M8.8', 'B16', (227, 256), 'supp', 'narr', True, 'Ball ch.2 aircraft anatomy'),
    ('M8.8', 'B16', (303, 338), 'main', 'mix', False, 'Ball 3.3-3.4 terminology, threat characteristics, damage mechanisms'),
    ('M8.8', 'B16', (469, 473), 'supp', 'mix', False, 'Ball 4.1-4.2 susceptibility program'),
    ('M8.8', 'B16', (608, 626), 'supp', 'mix', False, 'Ball 4.4.6-4.4.7 threat suppression, tactics'),
    ('M8.8', 'B16', (627, 678), 'main', 'mix', False, 'Ball 5.1-5.2 vulnerability, critical components, FMECA, kill trees'),
    ('M8.8', 'B16', (763, 788), 'main', 'mix', False, 'Ball 6.1-6.2 survivability assessment, mission/campaign'),
    ('M8.8', 'B16', (797, 801), 'supp', 'mix', False, 'Ball 6.4 conclusions'),
    ('M4.10', 'B16', (561, 565), 'supp', 'mix', False, 'Ball 4.4.1-4.4.3 threat warning, jammers'),
    ('M14.2', 'B16', (139, 155), 'supp', 'narr', False, 'Ball 1.3.1-1.3.6 DoD 5000 / acquisition deskbook'),
    ('M14.3', 'B17', (158, 204), 'main', 'narr', False, 'van Creveld ch.4 Schlieffen logistics (ref -> main)'),
    ('M14.3', 'B17', (205, 333), 'main', 'narr', False, 'van Creveld ch.5-8 (Barbarossa, Patton, conclusions; page split approximate, unpaginated e-book) - ch.6 kept as supp share'),
    ('M14.3', 'B17', (16, 110), 'supp', 'narr', False, 'van Creveld ch.1-2 (magazine system, Napoleon)'),
    ('M6.12', 'B13', (19, 236), 'main', 'math', False, 'Fleeman ch.1-7 (PDF 19-236), image-only scan -> OCR first'),
    ('M6.13', 'B13', (237, 262), 'main', 'math', False, 'Fleeman ch.8-9 (PDF 237-262)'),
]
for mid, doc, (a, b), role, rc, to, note in REHOST:
    mod = MODS[('mil', mid)]
    pg = b - a + 1
    r = RATE[rc]
    bump(mod, role, pg, r['cr'] * pg, r['K'] * pg, r['S'] * pg, r['C'] * pg, 'testout' if to else 'keep', 0.0)
    mod['c']['cls_' + ('E' if rc == 'math' else 'G')] += (1 if role == 'main' else .5) * pg
    mod['c']['rehost_pages'] += pg
    rec = dict(doc=doc, pages=pg, pdf=[a, b], role=role, note=note, rehosted_from='ref (outside the registry)')
    (mod['testout'] if to else mod['kept']).append(dict(rec, reason='already read (rule 33) -> diagnostic' if to else ''))
    mod['rehosted_in'].append(f"{doc} {a}-{b} ({role}): {note}")
    if mod['status'] == 'existing':
        mod['status'] = 're-hosted'

# M13.7 SMAD ch.11 cost pages -> supp for M14.2 (the module stays ref; pages counted once, in M14.2)
m137 = MODS[('mil', 'M13.7')]
cost_units = [u for u in MREG if u['module'] == 'M13.7' and re.search(r'(?i)11|cost|עלות', u['title'])]
cpg = sum(u['pages'] for u in cost_units)
MODS[('mil', 'M14.2')]['rehosted_in'].append(f"SMAD ch.11 cost estimating ({cpg} pp of M13.7, image-only) as supp; M13.7 itself stays ref")
MODS[('mil', 'M14.2')]['c']['wpages'] += 0.5 * cpg
MODS[('mil', 'M14.2')]['c']['pages_supp'] += cpg
MODS[('mil', 'M14.2')]['c']['cls_H'] += 0.5 * cpg
for k in ('cr', 'K', 'S', 'C'):
    MODS[('mil', 'M14.2')]['c'][k] += sum(u[k] for u in cost_units)

# not-needed decisions on pages outside the syllabus (ref books) - reported only
for p in ('P6a_space_unmanned_platforms_naval', 'P7_or_logistics_acquisition_analysis'):
    for x in P[p]['sections_not_needed']:
        if x['doc'] in ('B14', 'B15', 'B16', 'B17') and (x['module'] in ('-',) or 'unlinked' in str(x['module'])):
            OUTSIDE.append(dict(doc=x['doc'], pages=x['pages'], n=npages(ranges(x['pages'])), section=x['section'], panel=p[:3]))
# dedup overlapping outside ranges per doc
od = collections.defaultdict(set)
for o in OUTSIDE:
    for a, b in ranges(o['pages']):
        od[o['doc']] |= set(range(int(a), int(b) + 1))
OUTSIDE_PAGES = {d: len(s) for d, s in od.items()}

# ------------------------------------------------------------------ 5. subtopics, gaps and added lesson items
NEWMAP = {'NEW-A1': ('mil', 'M7.4'), 'NEW-A2': ('mil', 'M14.1'), 'NEW-A3': ('mil', 'M14.1'), 'NEW-Q1': ('mil', 'M14.2'),
          'NEW-Q2': ('mil', 'M7.10'), 'NEW-L1': ('mil', 'M14.3'), 'NEW-C1': ('mil', 'M14.4'), 'NEW-C2': ('mil', 'M14.5'),
          'NEW-C3': ('mil', 'M9.9'), 'NEW-V1': ('mil', 'M14.4'), 'NEW-Q3': ('mil', 'M14.5')}
# learner decisions and conflict resolution by subtopic id: (app, module, importance or None, note)
OVR = {
    # region: lower priority -> C mention inside an existing module, no new module
    'M:ADV.3.1': ('mil', 'M6.8', 'C', 'decision: region -> C mention'), 'M:ADV.3.2': ('mil', 'M9.9', 'C', 'decision: region -> C mention'),
    'M:ADV.3.3': ('mil', 'M9.9', 'C', 'decision: region -> C mention'), 'P7+.7': ('mil', 'M14.4', 'C', 'decision: region -> C mention'),
    'P7+.8': ('mil', 'M6.8', 'C', 'decision: region -> C mention'), 'M:CRAFT.4.2': ('mil', 'M7.4', 'C', 'decision: Israel 2023-25 -> C mention'),
    'M:CRAFT.4.3': ('mil', 'M10.5', 'C', 'decision: Red Sea -> C mention'),
    'M:CRAFT.4.1': ('mil', 'M9.9', None, 'NEW-C3 dropped; Ukraine lessons distributed (M9.9, M4.1, M14.3)'),
    'M:CRAFT.4.4': ('mil', 'M9.9', None, 'NEW-C3 dropped'), 'M:CRAFT.4.5': ('mil', 'M12.1', None, 'NEW-C3 dropped; SEAD history in M12.1 (2006 as C)'),
    # publication duties: C mentions
    'M:ACQ.5.1': ('mil', 'M14.2', 'C', 'decision: publication/export -> C mention'), 'M:ACQ.5.2': ('mil', 'M6.8', 'C', 'decision: MTCR -> C mention'),
    'M:ACQ.5.3': ('mil', 'M14.5', 'C', 'decision: censorship -> C mention'), 'M:ACQ.5.4': ('mil', 'M14.5', 'C', 'decision: mosaic effect -> C mention'),
    'M:ACQ.6.1': ('mil', 'M6.8', 'C', 'decision: arms-control regimes grouped with MTCR -> C mention'),
    'M:ACQ.6.2': ('mil', 'M6.8', None, 'NEW-Q3 dropped; deterrence/escalation kept S in M6.8'),
    'M:ACQ.6.3': ('mil', 'M9.3', None, 'NEW-Q3 dropped; IHL/Art.36 kept S with autonomy in M9.3'),
    # evidence judgment -> existing hosts
    'M:OR.9.1': ('mil', 'M7.10', None, 'evidence: few-shot statistics in T&E'), 'M:ACQ.3.3': ('mil', 'M7.10', None, 'evidence'),
    'M:ACQ.3.1': ('mil', 'M7.10', None, 'evidence'), 'M:ACQ.3.2': ('mil', 'M7.10', None, 'evidence'), 'M:ACQ.3.4': ('mil', 'M7.10', None, 'evidence'),
    'M:CRAFT.2.4': ('mil', 'M7.10', None, 'evidence'), 'M:OR.9.3': ('mil', 'M14.1', None, 'evidence: survivorship/selection bias'),
    'M:OR.6.2': ('mil', 'M14.1', None, 'evidence: wargames'), 'M:OR.6.3': ('mil', 'M14.1', None, 'evidence: wargames as evidence'),
    'M:CRAFT.2.2': ('mil', 'M7.4', None, 'evidence: intercept-claim denominators in AMD'), 'M:CRAFT.2.1': ('mil', 'M14.1', None, 'evidence: physics sanity checks of claims'),
    # attrition -> OR module
    'M:OR.4.5': ('mil', 'M14.1', None, 'attrition: Hughes salvo (link M10.5)'), 'M:OR.4.6': ('mil', 'M14.1', None, 'attrition: 3:1 critique'),
    'M:OR.4.7': ('mil', 'M14.1', None, 'attrition: exchange ratios'), 'M:OR.13.1': ('mil', 'M14.1', None, 'attrition: scouting/VoI'),
    'E:Information |2.6': ('eng', 'M23.7', None, 'host assigned (no panel host)'),
    'E:Fluids, aero|1.7': ('eng', 'M14.7', None, 'host assigned (no panel host)'),
    'E:Structures a|1.6': ('eng', 'M16.10', None, 'host assigned (no panel host)'),
    'E:Engineering |3.3': ('eng', 'M27.5', None, 'host assigned (no panel host)'),
    'P7+.11': ('mil', 'M8.8', None, 'merged with P6a survivability module'), 'P7+.1': ('mil', 'M8.9', None, 'merged with P6a air-campaign module'),
}
EST = {('K', 'missing'): (1.5, 1.5, 3.0, 3.0), ('S', 'missing'): (0.8, 0.5, 2.5, 3.0),
       ('K', 'partial'): (0.6, 0.6, 1.5, 1.5), ('S', 'partial'): (0.3, 0.2, 1.0, 1.5),
       ('C', 'missing'): (0, 0, 0, 1.0), ('C', 'partial'): (0, 0, 0, 0.5)}
RANK = {'K': 3, 'S': 2, 'C': 1, 'N': 0}
SRANK = {'missing': 2, 'partial': 1, 'full': 0}


def norm_status(st, x):
    s = str(st or '').lower()
    if s.startswith('missing'):
        return 'missing'
    if s.startswith('partial') or s.startswith('in library'):
        return 'partial'
    if s.startswith('full'):
        return 'full'
    if s in ('n/a', 'not_needed'):
        return 'na'
    if st is None:   # P5 added items
        return 'partial' if x.get('where_partial') and 'none' not in str(x.get('where_partial')).lower() else 'missing'
    return 'partial'


def first_where_module(x):
    w = x.get('where') or []
    if isinstance(w, list):
        for e in w:
            m = re.findall(r'M\d+\.\d+', json.dumps(e)) if not isinstance(e, str) else re.findall(r'M\d+\.\d+', e)
            if m:
                return m[0]
    return None


def norm_host(panel, x, app0):
    h = str(x.get('host_for_gap') or x.get('host') or '')
    for k, v in NEWMAP.items():
        if k in h:
            return v
    if 'power-systems' in h or (panel.startswith('P2') and re.match(r'^M13\.17', h) and 'Electric mac' in str(x.get('id', '')) + str(x.get('domain', ''))):
        return ('eng', 'M13.19')
    app = app0
    if h.startswith('G:'):
        app = 'eng'
    elif h.startswith(('L:', 'MIL:')) or 'Lanchester' in h:
        app = 'mil'
    if '(Gilua)' in h:
        app = 'eng'
    m = re.findall(r'M\d+\.\d+', h)
    if not m:
        if re.search(r'(?i)acquisition|industrial|cost', h):
            return ('mil', 'M14.2')
        if re.search(r'(?i)craft|osint', h):
            return ('mil', 'M14.1')
        if 'EO/IR' in h:
            return ('mil', 'M3.4')
        if 'missiles' in h:
            return ('mil', 'M6.2')
        wm = first_where_module(x)
        if wm:
            mm = wm
            if panel.startswith('P4'):
                ww = json.dumps(x.get('where'))
                app = 'mil' if 'L:' + wm in ww else 'eng'
            return (app, mm)
        return (app, None)
    mid = m[0]
    if (app, mid) not in MODS:
        other = 'eng' if app == 'mil' else 'mil'
        if (other, mid) in MODS:
            app = other
    return (app, mid)


SUB = {}   # id -> merged record
for p in PANELS:
    d = P[p]
    for x in d['subtopics'] + [dict(a, _added=True) for a in d['added']]:
        sid = x.get('id') or f"{p[:3]}:{x['name'][:40]}"
        imp = x.get('importance', 'S')
        st = norm_status(x.get('status'), x)
        app0 = PANEL_APP[p]
        if str(sid).startswith('M:'):
            app0 = 'mil'
        host = norm_host(p, x, app0) if st in ('partial', 'missing') else None
        miss = x.get('missing_items') or x.get('missing') or ''
        if isinstance(miss, list):
            miss = '; '.join(map(str, miss))
        rec = dict(id=sid, name=x['name'], importance=imp, status=st, host=host, missing=str(miss)[:400],
                   panels=[p[:3]], added=bool(x.get('_added')), test_out=bool(x.get('test_out') or x.get('test_out_candidate')),
                   reason=str(x.get('reason', ''))[:200], domain=x.get('domain', ''))
        if sid in SUB:   # same subtopic in two panels: round importance up, keep worst status
            o = SUB[sid]
            if RANK.get(imp, 0) > RANK.get(o['importance'], 0):
                o['importance'] = imp
            if SRANK.get(st, 0) > SRANK.get(o['status'], 0):
                o['status'] = st; o['host'] = host or o['host']; o['missing'] = rec['missing'] or o['missing']
            o['panels'].append(p[:3]); o['test_out'] |= rec['test_out']
        else:
            SUB[sid] = rec
for sid, (app, mid, imp, note) in OVR.items():
    if sid in SUB:
        r = SUB[sid]
        r['host'] = (app, mid)
        if imp:
            r['importance'] = imp
            if r['status'] == 'full':
                r['status'] = 'partial'
        r['decision'] = note
        if r['status'] == 'full' and 'Lanchester laws' in r['name']:
            pass

# duplicate clusters among the gap items (merged across panels and apps: teach once, delta elsewhere)
CLUSTERS = [
    ('fermi', r'(?i)fermi|back-of-envelope|mental estimation|order-of-magnitude physics|by-heart numbers'),
    ('crb', r'(?i)cram[eé]r'),
    ('salvo', r'(?i)salvo model|hughes'),
    ('sortie', r'(?i)sortie'),
    ('surviv', r'(?i)survivability discipline|survivability strateg|combat survivab|campaign survivab|mission loss rate'),
    ('costx', r'(?i)cost.exchange|marginal dollar|cost per shot'),
    ('magazine', r'(?i)magazine|stockpile|production rate vs expenditure|interceptor .*production|expenditure'),
    ('fewshot', r'(?i)few shots|small.sample|success.run|limited test shots'),
    ('fmea', r'(?i)fmea|fmeca|fault tree'),
    ('learning', r'(?i)learning curve'),
    ('linkbudget', r'(?i)link budget'),
    ('dimanal', r'(?i)dimensional analysis|buckingham|nondimensional'),
    ('uncprop', r'(?i)uncertainty propagation|error propagation|\bGUM\b'),
    ('killchain', r'(?i)kill chain as series|kill-chain time-sensitive|time-sensitive target'),
    ('owa', r'(?i)shahed|one-way attack|low-cost long-range strike'),
    ('intclaim', r'(?i)interception rate|interceptor-performance claims|claims vs verified|kill claim'),
    ('quantum', r'(?i)quantum sens|quantum sensors'),
    ('reliab', r'(?i)reliability mathematics|reliability and redundancy|reliability and availability'),
    ('sanity', r'(?i)sanity.check'),
    ('hover', r'(?i)hover|multirotor'),
    ('dv', r'(?i)hohmann|delta-v budget'),
    ('aicompute', r'(?i)AI compute|scaling laws'),
    ('advml', r'(?i)adversarial'),
    ('wargame', r'(?i)wargam'),
    ('sens', r'(?i)sensitivity analysis|tornado'),
    ('voi', r'(?i)value of information'),
    ('cid', r'(?i)combat identification|\bIFF\b'),
    ('interview', r'(?i)interview'),
    ('timing', r'(?i)holdover|allan'),
    ('manet', r'(?i)MANET'),
    ('heavytail', r'(?i)heavy.tail|power law'),
    ('fem', r'(?i)finite element|\bFEM\b'),
    ('compound', r'(?i)compounding|1-\(1-p\)|independence failure'),
    ('starlink', r'(?i)starlink|mega-constellation|proliferated LEO'),
]
gap_items = [r for r in SUB.values() if r['status'] in ('partial', 'missing') and r['importance'] in ('K', 'S', 'C')
             and not (r['importance'] == 'C' and not r.get('decision') and r['status'] == 'partial' and not r['added'])]
cl_of = {}
for r in gap_items:
    for cid, rx in CLUSTERS:
        if re.search(rx, r['name']):
            cl_of[r['id']] = cid
            break
ITEMS = []
by_cl = collections.defaultdict(list)
for r in gap_items:
    if r['id'] in cl_of:
        by_cl[cl_of[r['id']]].append(r)
    else:
        ITEMS.append(dict(r, cluster=None, role='primary'))
for cid, rs in by_cl.items():
    rs.sort(key=lambda r: (-RANK.get(r['importance'], 0), -SRANK.get(r['status'], 0), r['panels'][0]))
    imp = rs[0]['importance']
    st = rs[0]['status']
    prim = dict(rs[0], cluster=cid, role='primary', importance=imp, status=st,
                merged=[f"{x['id']} ({','.join(x['panels'])})" for x in rs[1:]])
    ITEMS.append(prim)
    seen = {prim['host']}
    for x in rs[1:]:
        if x['host'] and x['host'] not in seen:
            seen.add(x['host'])
            ITEMS.append(dict(x, cluster=cid, role='delta', primary_host=prim['host']))
n_unhosted = 0
for it in ITEMS:
    imp, st = it['importance'], it['status']
    cr, K, S, C = EST.get((imp, st), (0, 0, 0, 0))
    f = 0.25 if it['role'] == 'delta' else 1.0
    it['est'] = dict(cr=round(cr * f, 2), K=round(K * f, 2), S=round(S * f, 2), C=round(C * f, 2))
    it['kind'] = ('C-level mention' if imp == 'C' else
                  'delta link to primary' if it['role'] == 'delta' else
                  'new lesson item' if st == 'missing' else 'deepen existing lesson')
    h = it['host']
    if not h or h[1] is None or h not in MODS:
        n_unhosted += 1
        it['host_note'] = f'host unresolved ({h}); assigned to the app part default'
        h = (h[0] if h else 'mil', None)
        continue
    MODS[h]['added'].append(it)
    c = MODS[h]['c']
    c['add_cr'] += it['est']['cr']; c['add_K'] += it['est']['K']; c['add_S'] += it['est']['S']; c['add_C'] += it['est']['C']
    c['add_n'] += 1

# subtopic-level test-out flags (subtopic, not removal)
TO_SUBS = [r for r in SUB.values() if r['test_out']]

for mod in MODS.values():
    if mod['rehosted_in'] and mod['status'] == 'existing':
        mod['status'] = 're-hosted'
UNHOSTED = [dict(id=it['id'], name=it['name'], host=it['host']) for it in ITEMS if it.get('host_note')]
print('unhosted:', UNHOSTED)
print('moved eng sections:', len(MOVED_E), 'moved mil units:', len(MOVED_M))
# ------------------------------------------------------------------ 6. totals
def seg_of(mod):
    t = mod['tier']
    return ('G' if mod['app'] == 'eng' else 'L') + {'core': 'c', 'adv': 'a', 'ref': 'r'}[t]


TOT = collections.defaultdict(collections.Counter)
for (app, mid), mod in MODS.items():
    s = seg_of(mod)
    for k, v in mod['c'].items():
        TOT[s][k] += v
        TOT[app][k] += v
    TOT[s]['modules'] += 1
    TOT[app]['modules'] += 1
    TOT[s]['new_modules'] += mod['status'] == 'new'
    TOT[app]['new_modules'] += mod['status'] == 'new'
for k in list(TOT):
    TOT[k] = {kk: round(v, 1) for kk, v in TOT[k].items()}

DATA_FIXES = [
    # (app, item, action, source panel)
    ('eng', 'E07 Trefethen & Bau: Type-3 fonts with no Unicode map, lib/text/E07.json is garbage (only 17 pages have OCR images); M8.3-M8.10 (~330 pp core) send noise to the tutor', 'Re-extract with OCR like K1-K3 (eng/tools/extract.py); then re-type the E07 registry sections (whole lectures were typed history/problems)', 'P1'),
    ('mil', 'B13 Fleeman, Tactical Missile Design: image-only scan, in the library but in no module and not in syllabus docs', 'OCR (core/tools/extract/extract.py; tesseract/RapidOCR not installed in the research container), add to docs, create M6.12 (PDF 19-236 core) and M6.13 (PDF 237-262 adv). PDF page = book page + 18', 'P6b'),
    ('mil', 'B12 SMAD: image-only scan, no text layer (958 pp); every SMAD-only item (Delta-V, cost and learning curves, mass/thermal margins, random vibration, mission geometry) is unverifiable by text', 'OCR the whole book; book->PDF offset +17 through ch.17, +13 from ch.19', 'P3, P5, P6a, P7'),
    ('mil', 'SMAD ch.18 Propulsion (book pp. 527-564) is missing from the scan; PDF 544-577 duplicates ch.17', 'Obtain a clean copy of ch.18 and re-scan; until then in-space/electric propulsion (ADD:SP.3) is tutor-written in M13.12', 'P6a'),
    ('eng', 'Feynman Vol. II ch.40 (Flow of Dry Water) missing from the library copy', 'Restore the chapter (feyn2.json / PDF); until then Euler, vorticity and potential flow rest on Anderson and Kolmogorov', 'P1, P3'),
    ('eng', 'Feynman Vol. II ch.42 (Curved Space) missing from the library copy', 'Restore; GR clocks / GPS correction (S, M24.1) depends on it', 'P1'),
    ('eng', 'Horowitz & Hill (E09) ch.1 Foundations missing from the PDF', 'Restore ch.1; until then KCL/KVL, node/mesh, AC power rest on E09a class notes and F2 ch.22 (gap item in M11.1)', 'P2'),
    ('mil', 'library/military/syllabus/syllabus.py line ~614: comment says M13.12 uses Fleeman; B13 is not even in docs', 'Fix the stale comment when B13 is added', 'P6b'),
    ('mil', 'Rule 37 makes B14-B17 "ref, not lesson material, not coverage-checked", so Ball (B16) and van Creveld (B17) are never taught; rule 33 says B14/B15 are already read', 'Give B14-B17 supplementary/main roles in specific modules (list in rehosted_in: M14.1, M7.1, M7.3, M10.3, M8.8, M4.10, M14.2, M14.3); keep rule 33 as the test-out diagnostic, not as exclusion; add B14-B17 to the coverage registry', 'P5, P6a, P6b, P7'),
    ('mil', 'Lanchester laws (B14:84-114, B15:92-163) sit only in adv M12.2 (Russian tactics)', 'Move to core M14.1 (combat modeling); B15:142-163 to M7.3', 'P7'),
    ('mil', 'B07 ch.7 (PDF 192-219) battlespace performance typed "summary" and held in adv M7.4', 'Promote M7.4 to core; re-type the section as theory', 'P6b'),
    ('mil', 'Ball (B16) ch.1.1-1.2, 5.1-5.2, 6.1-6.2 attached to no module; pp. 44-70 worked SEAD package unlinked', 'Attach to new M8.8 (main) and as ref to M4.7 and M12.1', 'P5, P6a, P7'),
    ('mil', 'B14 7.4 and 7.6 (PDF 146-161, ASW barrier and moving-target search) linked only to radar/EO modules', 'Link to M10.3 as supp', 'P6a'),
    ('mil', 'D5:164-176 recon-strike complexes in adv M12.2; D6:59-74 PLA system warfare in adv M12.4', 'Pull into core M12.1 and M12.3', 'P7'),
    ('mil', 'van Creveld ch.3 attached to M12.4 (Chinese tactics), which does not fit; ch.4,5,7,8 ref-only', 'Promote to main in M14.3 logistics; detach ch.3 from M12.4', 'P7'),
    ('eng', 'Shannon-Hartley (E23 5.1-5.2) sits only in adv M23.8', 'Teach it in core M23.3', 'P2'),
    ('eng', 'Measurement practice (oscilloscope, load line) only in ref appendix M11.14', 'Pull into core M11.1', 'P2'),
    ('eng', 'K-level physics held in adv modules: Poynting (F2 27, M9.16), Fresnel and skin depth (F2 32-33, M9.14), Doppler (F1 34-6/7); multivariate Gaussian conditioning (M6.9), confounding (M6.10); K3 XIX/1-4 Hilbert space (M8.14)', 'Move to core as deltas (M9.9, M6.2) or make the sections core', 'P1'),
    ('eng', 'MacKay E14 chapter bodies sit in units titled "(opener)" and were typed history (~223 pp of the best OOM material)', 'Re-type as teaching (all KEEP)', 'P3'),
    ('eng', 'P&H (E22) 4.5 pipelining, 1.10/6.13 Amdahl, 6.10-6.11 roofline, 1.7 power wall typed history/notes; Skiena 1.9 Estimation typed history; E21 2.2 big-O typed appendix', 'Re-type as teaching (KEEP)', 'P4'),
    ('eng', 'E22 pages are reflowed e-book pages (599 not-needed E22 pages ~ 300 printed pages)', 'Normalise page counts for E22 before using pages as a measure', 'P4'),
    ('both', 'MG host IDs mix the two apps (e.g. M2.x, M9.5, M13.20 are Lanchester; "M17.2" for power systems is a neural-network module; CRB/DOP/CEP sent to Lanchester M8.5 Displays)', 'Use app-qualified IDs (G:/L:) everywhere; the panels reassigned every host', 'P2, P4, P7'),
    ('mil', 'Several Lanchester K ideas exist only in Lanchester while their engineering foundation is missing in Gilua (link budget, windowing, quantization noise, DFT practice, adaptive filters)', 'Teach the foundation in Gilua (gap items in M4.6, M4.8, M23.5) and make the Lanchester modules deltas', 'P2'),
    ('mil', 'B10 Hebrew blocks and SMAD units were split into ~6-8 page heading blocks without real section numbers', 'Recover true headings when OCR is done, so sections can be kept/dropped individually', 'S_mil, P5'),
    ('mil', 'Dated sources need explicit update notes: Kaplan 2006 (BeiDou-3, Galileo FOC, M-code), Moir 2006 (AESA, MADL), EW101 2001 (DRFM, digital receivers), Driggers 2012 (T2SL/HOT), SMAD 2011 (launch $/kg, mega-constellations), E17 2023 (stops at GPT-3), power books (SiC/GaN, grid-forming inverters)', 'Add an "update since the book" note per module (tutor-written, dated)', 'P2, P4, P5, P6a'),
    ('mil', 'Articles and B14-B17 are outside the S_mil registry, so their CR/K/S/C are estimated here from class rates', 'Add them to the registry with real section counts', 'P7, F'),
]
out = dict(
    meta=dict(desc='Final curriculum (round 3): books as a map, panels win, learner decisions applied',
              counts_basis='book CR/K/S/C from the section registries (kept sections only; cross-app and internal duplicates moved to cr_delta), plus added lesson items at fixed per-item estimates',
              add_item_estimates={f'{a}/{b}': v for (a, b), v in EST.items()},
              ref_rates_per_page=RATE, default_kept_unreviewed_pages=dict(default_kept_unreviewed),
              unhosted_items=n_unhosted, outside_syllabus_not_needed_pages=OUTSIDE_PAGES),
    totals=TOT,
    modules={app: [dict({k: v for k, v in MODS[(app, mid)].items() if k != 'c'},
                        counts={k: round(v, 2) for k, v in MODS[(app, mid)]['c'].items()}, segment=seg_of(MODS[(app, mid)]))
                   for mid in ORDER[app]] for app in ('eng', 'mil')},
    items=ITEMS, unhosted=UNHOSTED, data_fixes=[dict(app=a, item=b, action=c, source=d) for a, b, c, d in DATA_FIXES],
    subtopic_testout=[dict(id=r['id'], name=r['name'], importance=r['importance']) for r in TO_SUBS],
    subtopics_merged=len(SUB),
)
json.dump(out, open(os.path.join(HERE, 'F_curriculum.json'), 'w'), ensure_ascii=False, indent=1)
print('modules', {a: len(ORDER[a]) for a in ORDER}, 'items', len(ITEMS), 'unhosted', n_unhosted)
for s in ('Gc', 'Ga', 'Gr', 'Lc', 'La', 'Lr', 'eng', 'mil'):
    t = TOT[s]
    print(s, {k: t.get(k, 0) for k in ('modules', 'new_modules', 'pages_main', 'pages_supp', 'wpages', 'nn_pages', 'to_wpages',
                                        'dup_wpages', 'cr', 'cr_delta', 'K', 'S', 'C', 'add_n', 'add_cr', 'add_K', 'add_S', 'add_C')})
print('outside not-needed', OUTSIDE_PAGES, 'default kept unreviewed', dict(default_kept_unreviewed))
print('subtopics merged', len(SUB), 'test-out subtopics', len(TO_SUBS))
print('rates', {k: {kk: round(vv, 3) for kk, vv in v.items()} for k, v in RATE.items()})
