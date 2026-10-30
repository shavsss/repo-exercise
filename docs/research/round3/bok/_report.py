import json, collections, os
H=os.path.dirname(os.path.abspath(__file__))
M=json.load(open(os.path.join(H,"B_mil_map.json")))
rows=[(d,t,s) for d in M["domains"] for t in d["topics"] for s in t["subtopics"]]
c=M["meta"]["counts"]; n=len(rows)
L=[]
A=L.append
A("# B_mil: independent reference map for a technical-military authority (Lanchester scope)\n")
A("Date: 2026-10-30. Machine-readable map: `B_mil_map.json` (same folder). Built from external curricula and standard references, not from the app's syllabus. The syllabus was used only to set the scope and to tag each topic with the nearest Lanchester part (`lab_part`).\n")
A("## 1. Goal and grading\n")
A("The target reader is an authority on the technical-military core at level 2.5 with operational meaning. He should be able to derive the skeleton, estimate to 10-20%, name the limits and critique claims, and say what a result means for system and force performance. He writes articles and interviews experts. Importance is graded for that goal only:\n")
for k,v in M["meta"]["importance"].items(): A(f"- **{k}**: {v}")
A(f"\n`op_bg` says whether a strong operational background probably already covers the subtopic (likely / partial / unlikely). `test_out` = true for K/S items rated *likely*. These are candidates for a short diagnostic test. They are not candidates for removal.\n")
A("`commonly_missing` = true marks a must-know item that standard engineering textbooks and most university curricula leave out or treat thinly. These items come from think-tank, DOT&E, acquisition and OSINT practice rather than from textbooks.\n")
A("## 2. Counts\n")
A(f"{n} subtopics in {M['meta']['n_topics']} topics and {M['meta']['n_domains']} domains.\n")
A("| Importance | Count | Share |\n|---|---|---|")
for k in "KSCN": A(f"| {k} | {c.get(k,0)} | {100*c.get(k,0)/n:.0f}% |")
miss=[r for r in rows if r[2]["commonly_missing"]]; to=[r for r in rows if r[2]["test_out"]]
A(f"\nCommonly missing: **{len(miss)}** (K: {sum(r[2]['imp']=='K' for r in miss)}). Test-out candidates: **{len(to)}**. With no home in the current Lanchester syllabus (`lab_part` = '-'): **{sum(r[1]['lab_part']=='-' for r in rows)}**.\n")
A("The share of K is high on purpose. The map lists only what an authority needs, plus explicit *skip-lists* (the N/C items, most of them in topics named '(skip-list)'). The skip-lists cover the engineering detail that the app's books spend many pages on.\n")
A("### By domain\n\n| Domain | Subtopics | K | S | C | N | Missing | Test-out |\n|---|---|---|---|---|---|---|---|")
for d in M["domains"]:
    ss=[s for t in d["topics"] for s in t["subtopics"]]; cc=collections.Counter(s["imp"] for s in ss)
    A(f"| {d['id']} {d['name']} | {len(ss)} | {cc['K']} | {cc['S']} | {cc['C']} | {cc['N']} | {sum(s['commonly_missing'] for s in ss)} | {sum(s['test_out'] for s in ss)} |")
A("\n## 3. Main findings\n")
A("""1. **Physics textbooks miss the force-level layer of the authority's knowledge.** Skolnik, Richards, Adamy, Zarchan and SMAD give the physics. NPS OA (Search, Joint Combat Modeling, Joint Campaign Analysis, Wargaming, Cost Estimation), DAU, DOT&E and CSIS/CSBA/RAND work give the *force-level* layer, and the authority is judged on that layer: cost-exchange, magazine depth, production rates, kill-chain timing, test realism. The app's syllabus is book-driven, so it is strong on the first layer and weak on the second.
2. **There are four clusters of gaps** (lab_part '-' or thin): (a) acquisition, cost, T&E and industrial base; (b) export, publication and responsible-disclosure constraints; (c) OSINT and claims-checking craft; (d) Iran and proxy threat systems plus recent-war case studies. Without them the learner cannot write credible articles, even with perfect physics.
3. **Every domain has a 'force terms' layer.** This layer links an engineering result to an operational quantity: the radar equation to emit-and-die survivability, J/S to EW density per km of front, PN to salvo sizing, the rocket equation to stockpile and production arithmetic. Lessons should end each central result with this step. The operational meaning rule in the app already points this way, and the map lists the specific links.
4. **The skip-lists are large and match the app's heaviest page counts.** Examples: CFAR variant algebra, SAR image-formation algorithms, waveform-design mathematics, autopilot design, strapdown mechanization, spacecraft thermal, mechanisms and computers, avionics bus standards, tank powertrains, and EW microwave component design. This is where the learner's principle "do not spend time on unimportant things" saves the most time.
5. **Test-out candidates are mostly doctrine vocabulary and field practice.** Examples: F2T2EA, the targeting cycle, SEAD history, flares and DIRCM practice, shoot-and-scoot, camouflage, proxies' arsenals. The physics and arithmetic behind these items are almost never covered by operational experience, so they stay in the course.
""")
A("## 4. Commonly missing must-know items\n")
cur=None
for d,t,s in miss:
    if d["id"]!=cur: cur=d["id"]; A(f"\n**{d['name']}**\n")
    A(f"- [{s['imp']}] {s['name']} ({t['name']}; lab: {t['lab_part']}). {s['why']}")
A("\n## 5. Test-out candidates (K/S, operational background likely covers)\n")
for d,t,s in to: A(f"- [{s['imp']}] {s['name']} ({d['id']})")
A("\n## 6. Skip-list (N) and context-only (C)\n")
for k in "NC":
    A(f"\n**{k}**: "+"; ".join(f"{s['name']} ({d['id']})" for d,t,s in rows if s['imp']==k))
A("\n\n## 7. Full map (K items in bold)\n")
for d in M["domains"]:
    A(f"\n### {d['id']} {d['name']}\n")
    for t in d["topics"]:
        A(f"- **{t['name']}** (lab {t['lab_part']}; evidence: {', '.join(t['evidence'])})")
        for s in t["subtopics"]:
            nm=f"**{s['name']}**" if s['imp']=="K" else s['name']
            fl=(" `missing`" if s['commonly_missing'] else "")+(" `test-out`" if s['test_out'] else "")
            A(f"  - [{s['imp']}] {nm}{fl}: {s['why']}")
A("\n## 8. Evidence sources\n")
for k,v in M["sources"].items(): A(f"- **{k}**: {v}")
A("""
## 9. Method and caveats

- Curricula checked on the web (2026-10): the NPS OA 360 matrix (OA3602, OA4655, OA4602, OA4604, OA4702, OA3304, ESR 3211P incl. 'Analysis of Military Applications'); NPS 533 Applied Physics of Combat Systems; the NPS EW certificates 292/293; NPS Space Systems Operations 366 (SS3011/SS3051/SS3613/SS4055); the Cranfield GWS and MESE module lists; GTRI Principles of Modern Radar (DEF 3502) and Radar EP (DEF 2505); the Washburn & Kress chapter list; the scope and method of Ball's book via DTIC case studies; the CSIS Missile Defense Project work on cost/value of intercepts and interceptor depletion; CNS OSINT course topics. The other reference tables of contents (Skolnik, Richards, Adamy EW101-104, Zarchan, Fleeman, SMAD, Przemieniecki, Hughes, Glasstone, DAU) come from my knowledge of those books and were not re-fetched.
- Sources often list modules without weights. The importance grades are my judgment for *this* goal, explained per item in `why`. They are not a consensus ranking.
- `op_bg` is a prior about an experienced operator, not knowledge of this learner. Use it to choose diagnostic tests, never to drop content.
- Granularity is aimed at one subtopic = one idea that can be tested (roughly a 20-60 minute learning unit at 2.5 depth). Skip-list items are kept coarse on purpose.
- Source links: https://nps.smartcatalogiq.com/en/current/academic-catalog/departments/department-of-operations-research/operations-analysis-curriculum-360 ; https://nps.smartcatalogiq.com/en/current/academic-catalog/departments/department-of-physics/applied-physics-of-combat-systems-curriculum-533 ; https://online.nps.edu/-/292-electronic-warfare-engineer-academic-certificate ; https://nps.smartcatalogiq.com/en/current/academic-catalog/groups-and-committees/space-systems-academic-group/space-systems-operations-curriculum-366 ; https://da.mod.uk/courses/guided-weapon-systems-msc ; https://www.cranfield.ac.uk/courses/taught/military-electronic-systems-engineering ; https://production.pe.gatech.edu/courses/principles-modern-radar ; https://ideas.repec.org/b/spr/isorms/978-1-4419-0790-5.html ; https://apps.dtic.mil/sti/pdfs/ADA183335.pdf ; https://www.csis.org/analysis/cost-and-value-air-and-missile-defense-intercepts ; https://nonproliferation.org/short-course-tracking-north-koreas-wmd-and-sanctions-evasion-with-open-sources/
- Build files (also in this folder): `_src_sources.py`, `_src_data1..4.py`, `_build.py`, `_report.py`.
""")
open(os.path.join(H,"B_mil.md"),"w").write("\n".join(L))
print(len(L))
