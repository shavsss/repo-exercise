#!/usr/bin/env python3
"""Writes F_curriculum.md from F_curriculum.json. Run after F_build.py: python3 -I F_report.py"""
import json, os, collections
HERE = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.path.join(HERE, 'F_curriculum.json')))
T = d['totals']
r = lambda x: f"{x:,.0f}"
L = []
w = L.append
w('# F. The final curriculum for both apps\n')
w('Built by `F_build.py` (data in `F_curriculum.json`), report by `F_report.py`. Panels win over the merge; where panels disagree, importance is rounded up and the material is kept. The learner\'s decisions are applied (section 1). The weapons-effects domain had no panel: all its book material is kept as is, with no additions.\n')
w('## 1. Decisions applied, and the one structural judgement\n')
w('- **Region and publication duties are lower priority.** No module for them. Iran and proxies, Israel 2023-25, the Red Sea, tunnels, North Korea, MTCR, censorship, mosaic effect, export control and arms-control regimes become **C-level mentions** inside existing modules (M6.8, M9.9, M7.4, M10.5, M14.2, M14.5). P7\'s NEW-Q3, NEW-V1 and NEW-C3 are dropped as modules. Deterrence/escalation (S, M6.8) and IHL/Art. 36 (S, with autonomy in M9.3) are kept as items, not modules. The assessment *methods* of NEW-V1 (OOB estimation, net assessment, analytic bias) move to M14.4. Ukraine and Nagorno-Karabakh lessons go to M9.9, classic SEAD cases to M12.1.')
w('- **Cost stays K and is in the plan:** new core module M14.2 (cost definitions, LCC, learning curves, budgets as data, surge, critical materials), with SMAD ch.11 and Ball 1.3 as sources. Cost-exchange and interceptor stocks/production are lessons in M7.4 (AMD, promoted to core) and M14.3 (logistics).')
w('- **Evidence judgment and attrition are not separate modules.** Each item has a host:')
w('  - few-shot test statistics (OR.9.1, ACQ.3.3, P3 success-run, P4 MF.1: one merged item), DT/OT/LFT&E, test realism, combat claims, reading DOT&E/GAO -> **M7.10** (SE lifecycle, promoted ref -> core, now "+ T&E and test evidence");')
w('  - intercept-claim denominators (CRAFT.2.2 + P6b ADD.7) -> **M7.4** (AMD);')
w('  - survivorship/selection bias, wargames as evidence, physics sanity checks of claims -> **M14.1**;')
w('  - salvo model, 3:1 critique, exchange ratios, scouting/VoI, Lanchester laws (moved from adv M12.2) -> **M14.1**.')
w('  - **Judgement call:** Lanchester has no OR/combat-modeling module at all (OR lives only in ref books B14/B15). The plan therefore has exactly one: **M14.1 "Combat modeling"**, which merges P7\'s NEW-A2 and NEW-A3. Attrition and evidence are lessons inside it, not modules. P7\'s NEW-A1 (raid, magazine, cost-exchange) is merged into M7.4, NEW-Q2 into M7.10.')
w('- **Test-out is never removal.** Each test-out page gets a short diagnostic: pass -> condensed lesson with the full text one click away plus a delayed recheck; fail -> full lesson. P6a\'s in-syllabus "not needed" blocks were all flagged test-out by P6a, so they are test-out here, not removed. P3\'s E11 history is test-out too.\n')
w('## 2. Totals\n')
w('Pages are book pages in module sources: main + supp (weighted pages = main + 0.5 supp). Counts are after dedup: the duplicate share of cross-app delta units (32% of K+S in S_mil\'s flagged units) and of Gilua internal repeats is moved to `CR delta` (taught as a short delta). Lanchester K is on the strict basis (K = CR in S_mil; R10 granularity would be about 1.5x).\n')
w('| | Gilua core | Gilua adv | Gilua ref | **Gilua** | Lanch. core | Lanch. adv | Lanch. ref | **Lanchester** |')
w('|---|---|---|---|---|---|---|---|---|')
segs = ['Gc', 'Ga', 'Gr', 'eng', 'Lc', 'La', 'Lr', 'mil']
rows = [('modules', 'modules'), ('of which new', 'new_modules'), ('kept pages, main', 'pages_main'), ('kept pages, supp', 'pages_supp'),
        ('kept weighted pages', 'wpages'), ('not-needed pages', 'nn_pages'), ('test-out weighted pages', 'to_wpages'),
        ('ref pages re-hosted into lessons', 'rehost_pages'),
        ('book CR in scope (after dedup)', 'cr'), ('book CR taught as delta', 'cr_delta'), ('book K', 'K'), ('book S', 'S'), ('book C', 'C'),
        ('added lesson items', 'add_n'), ('added CR', 'add_cr'), ('added K', 'add_K'), ('added S', 'add_S'), ('added C', 'add_C')]
for lab, k in rows:
    w(f'| {lab} | ' + ' | '.join(r(T[s].get(k, 0)) if s not in ('eng', 'mil') else f"**{r(T[s].get(k, 0))}**" for s in segs) + ' |')
E, M = T['eng'], T['mil']
w('')
w(f"- **Kept vs not needed.** Gilua keeps {r(E['pages_main'] + E['pages_supp'])} pp and drops {r(E['nn_pages'])} pp ({E['nn_pages'] / (E['pages_main'] + E['pages_supp'] + E['nn_pages']) * 100:.0f}%). Lanchester keeps {r(M['pages_main'] + M['pages_supp'])} pp (including {r(M.get('rehost_pages', 0))} pp of ref books now taught) and drops {r(M['nn_pages'])} pp ({M['nn_pages'] / (M['pages_main'] + M['pages_supp'] - M.get('rehost_pages', 0) + M['nn_pages']) * 100:.0f}% of its syllabus pages). Outside the syllabus, {r(sum(d['meta']['outside_syllabus_not_needed_pages'].values()))} pp of ref books are not needed ({d['meta']['outside_syllabus_not_needed_pages']}).")
w(f"- **In scope after dedup and additions:** CR {r(E['cr'] + E['add_cr'])} Gilua + {r(M['cr'] + M['add_cr'])} Lanchester = **{r(E['cr'] + E['add_cr'] + M['cr'] + M['add_cr'])}**, plus {r(E['cr_delta'] + M['cr_delta'])} taught as cross-app or internal deltas. K/S/C items: Gilua {r(E['K'] + E['add_K'])} / {r(E['S'] + E['add_S'])} / {r(E['C'] + E['add_C'])}; Lanchester {r(M['K'] + M['add_K'])} / {r(M['S'] + M['add_S'])} / {r(M['C'] + M['add_C'])}; together **{r(E['K'] + E['S'] + E['C'] + M['K'] + M['S'] + M['C'] + E['add_K'] + E['add_S'] + E['add_C'] + M['add_K'] + M['add_S'] + M['add_C'])}**.")
kinds = collections.Counter(x['kind'] for x in d['items'])
w(f"- **Added lesson items: {len(d['items'])}** ({', '.join(f'{v} {k}' for k, v in kinds.items())}). They come from {d['subtopics_merged']} merged subtopics; duplicates across panels and apps were merged into one primary item, with a delta link where the other app needs it. Per-item estimates: {d['meta']['add_item_estimates']} (CR, K, S, C; judgement).")
w(f"- **Test-out:** {r(E['to_wpages'])} weighted pp in Gilua, {r(M['to_wpages'])} in Lanchester; {len(d['subtopic_testout'])} subtopics flagged test-out by panels.\n")
w('## 3. New and re-hosted modules\n')
for app, name in (('eng', 'Gilua'), ('mil', 'Lanchester')):
    w(f'### {name}\n')
    w('| module | tier | status | prereq | weighted pp | book CR | added items (CR) | what changed |')
    w('|---|---|---|---|---|---|---|---|')
    for m in d['modules'][app]:
        if m['status'] == 'existing':
            continue
        c = m['counts']
        chg = '; '.join(m['notes'] + m['rehosted_in'][:4] + ([f"+{len(m['rehosted_in']) - 4} more"] if len(m['rehosted_in']) > 4 else []))
        w(f"| **{m['id']}** {m['title']} | {m['tier']}{' (was ' + m['tier_was'] + ')' if m['tier_was'] and m['tier_was'] != m['tier'] else ''} | {m['status']} | {', '.join(m['prereq'])} | {c.get('wpages', 0):.0f} | {c.get('cr', 0):.1f} | {c.get('add_n', 0):.0f} ({c.get('add_cr', 0):.1f}) | {chg[:600]} |")
    w('')
w('## 4. Added lesson items by host module (what must be taught)\n')
w('K first. "new" = a lesson item with no book source; "deepen" = the book is partial; "delta" = taught in the primary host, linked here; "C" = a mention.\n')
for app, name in (('eng', 'Gilua'), ('mil', 'Lanchester')):
    w(f'### {name}\n')
    for m in d['modules'][app]:
        if not m['added']:
            continue
        w(f"**{m['id']} {m['title'][:90]}**")
        for it in sorted(m['added'], key=lambda x: ({'K': 0, 'S': 1, 'C': 2}[x['importance']], x['kind'])):
            tag = {'new lesson item': 'new', 'deepen existing lesson': 'deepen', 'delta link to primary': 'delta', 'C-level mention': 'C'}[it['kind']]
            extra = f" [{it['decision']}]" if it.get('decision') else ''
            mg = f" (merged: {', '.join(it['merged'])})" if it.get('merged') else ''
            ph = f" -> primary {it['primary_host'][0]}:{it['primary_host'][1]}" if it.get('primary_host') else ''
            w(f"- {it['importance']} {tag}: {it['name'][:110]}{ph}{extra}{mg}. Teach: {it['missing'][:220] or '(see subtopic)'} ({','.join(it['panels'])})")
        w('')
w('## 5. Data fixes the library needs\n')
for i, f in enumerate(d['data_fixes'], 1):
    w(f"{i}. **[{f['app']}] {f['item']}.** Fix: {f['action']}. ({f['source']})")
w('')
w('## 6. Every module: kept / not needed / test-out\n')
w('Per module: weighted kept pp; not-needed pp with the main reasons; test-out pp; book CR/K/S/C in scope; CR taught as delta; added items. Section-level lists (every kept, not-needed and test-out section, with reasons and panel) are in `F_curriculum.json`.\n')
for app, name in (('eng', 'Gilua'), ('mil', 'Lanchester')):
    w(f'### {name}\n')
    w('| module | tier | kept wpp | not needed pp (top reasons) | test-out pp | CR | K | S | C | CR delta | added (CR) |')
    w('|---|---|---|---|---|---|---|---|---|---|---|')
    for m in d['modules'][app]:
        c = m['counts']
        rs = collections.Counter()
        for x in m['not_needed']:
            rs[str(x.get('reason', ''))[:40]] += x['pages']
        nn = f"{c.get('nn_pages', 0):.0f}" + (f" ({'; '.join(f'{k} {v:.0f}' for k, v in rs.most_common(2))})" if rs else '')
        w(f"| {m['id']} {m['title'][:48]} | {m['tier']} | {c.get('wpages', 0):.0f} | {nn} | {c.get('to_wpages', 0):.0f} | {c.get('cr', 0):.1f} | {c.get('K', 0):.1f} | {c.get('S', 0):.0f} | {c.get('C', 0):.0f} | {c.get('cr_delta', 0):.1f} | {c.get('add_n', 0):.0f} ({c.get('add_cr', 0):.1f}) |")
    w('')
w('## 7. Limits\n')
w('- Book CR/K/S/C come from the section registries (hand-counted samples + GLM); fold-level error is large for CR (about 40% per 90 pages) but corpus totals are within about +-12%.')
w('- Added-item counts are fixed per-item estimates by importance and status, not counted lessons.')
w('- Ref-book pages re-hosted into lessons (B13-B17) are outside the registries; their counts use Lanchester class rates per page. B17 chapter page splits are approximate (unpaginated e-book). B13 and B12 are image-only, so their sections were judged from tables of contents.')
w('- Panel section decisions were partly title-level (P2, P4 mark these in their JSON).')
open(os.path.join(HERE, 'F_curriculum.md'), 'w').write('\n'.join(L) + '\n')
print('lines', len(L))
