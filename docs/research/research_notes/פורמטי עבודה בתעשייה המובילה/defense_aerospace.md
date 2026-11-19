# Work formats of top defense/aerospace engineering organizations (NASA/DoD SE, Skunk Works, Anduril, Palantir FDE)

Legend: [P] = primary source (the standard/report/org itself), [S] = secondary. Certainty: H/M/L.
"Fetched" = text read in this session. "Not fetched" = canonical source named from prior knowledge; the claim was NOT re-verified this session. Treat those as M at best and check before quoting numbers verbatim.

## 1. Trade studies (NASA SE Handbook SP-2016-6105 Rev2, DoD), pathologies, what excellent looks like

### Takeaway
NASA's handbook gives a concrete, copyable format: decision need and criteria, then alternatives (pruned with a trade tree), then evaluation methods, then a scored matrix with uncertainty, then a recommendation plus a robustness check, then a 9-section decision report that includes a **Dissent** section. The step that separates excellent from average is the explicit test: "could reducing uncertainty change the ranking?" A second marker: a lower-scoring pick forces the team to re-examine the criteria themselves, not only the weights.

### Cited Findings
- [P, H, fetched] Basic trade steps: "Devise some alternative means to meet the functional requirements… Evaluate these alternatives in terms of the MOPs and system life cycle cost… Rank the alternatives according to appropriate selection criteria… Drop less promising alternatives and proceed to the next level of resolution." — [NASA SE Handbook Rev2, §4.4.1.2.3, p.69](https://www.nasa.gov/wp-content/uploads/2018/09/nasa_systems_engineering_handbook_0.pdf)
- [P, H] Participants: "systems engineers, design engineers, crosscutting specialty discipline and domain engineers, program analysts, system end users, decision scientists, maintainers, operators, and project managers". The process "should be done openly and inclusively. While quantitative techniques and rules are used, subjectivity also plays a significant role." — same, p.69–70
- [P, H] Interface check questions inside trades: "Did you include the cabling?" "Did you consider how the maintainers can repair the system?" Concepts should be described "in terms of controllable design parameters so that each represents as wide a class of designs as is reasonable." Output is "bounds on the relative cost-effectiveness", not final values. — same, p.69–70
- [P, H] Criteria: typical criteria are cost, schedule, risk, safety, mission success and supportability, plus technical criteria. Criteria "should be objective and measurable" and "should also permit differentiating among options". They may be **mandatory ("shall have") or enhancing**: "An option that does not meet mandatory criteria should be disregarded." (This is NASA's version of kill criteria.) Also "Sometimes doing nothing or not making a decision is an option." — same, §6.8.1.2.1–2, p.167–168
- [P, H] Pruning: a "trade tree" is "an excellent way to prune the set of variations before extensive analysis… and to convey to other stakeholders the basis for that pruning." — same, p.168
- [P, H] Uncertainty rule: "Uncertainty matters in a particular analysis only if there is a non-zero probability that uncertainty reduction could alter the ranking of alternatives. If this condition is obtained, then it is necessary to consider the value of reducing that uncertainty." — same, §6.8.1.2.4, p.168
- [P, H] Normalization needs operational definitions. Scales can be informal L/M/H or 1-3-9, but "the most important thing… is to have operational definitions of the scale… 'high' could mean 'a probability of 67 percent and above.'" — same, p.169
- [P, H] Recommendation: give the decision maker "an assessment of the robustness of the ranking". If alternatives are close, or uncertainty reduction could alter the ranking, recommend all the closely ranked ones. If a lower-scoring option is preferred, "the decision criteria should be reevaluated, not only the weights, but the basic definitions of what is being measured." — same, §6.8.1.2.5, p.169–170
- [P, H] Decision report (Table 6.8-1): 1 Executive Summary (1-sentence recommendation + 1-sentence problem); 2 Problem/Issue (including decision maker and team); 3 Decision Matrix Setup Rationale (criteria, options, weights, evaluation methods); 4 Scoring Rationale; 5 Final Matrix; 6 Risks/Benefits; 7 Recommendation/Final Decision; 8 **Dissent** ("document any dissent… how dissent was addressed"); 9 References; Appendices (literature search, previous related decisions *and previous dissent*). — same, p.171
- [P, H] Glossary "Trade Study Report" must include the system, goals/constraints, measures and models, "all data sources used", alternatives, "computational results, including uncertainty ranges and sensitivity analyses performed; the selection rule used; and the recommended alternative." — same, App. B, p.195
- [P, H] Other methods the handbook names: cost-benefit, influence diagrams, decision trees, AHP, Borda counting, utility analysis (see NASA RP-1358 "toolbox"). — same, §6.8.2, p.170
- [S, M] NASA-hosted survey of trade-study methods (Baker et al.) catalogs methods, including Pugh and weighted sums. — [Survey of trade study methods, nasa.gov](https://www.nasa.gov/wp-content/uploads/2016/10/survey_of_trade_study_methods_-_baker.pdf) (not fetched)
- [S, M] SEBoK recommends sensitivity analysis because a global score "is not absolute". — [SEBoK, Systems Analysis Approach](https://sebokwiki.org/wiki/Systems_Analysis_Approach) (snippet)
- [P-ish, H, not fetched] Pugh concept selection (Stuart Pugh, *Total Design*, 1991): pick a datum concept. Score each other concept +/−/S per criterion with no weights. Then attack the strongest concept's minuses, hybridize, re-run against a new datum. It is a convergence tool, not a one-shot scorer. — [Baker survey](https://www.nasa.gov/wp-content/uploads/2016/10/survey_of_trade_study_methods_-_baker.pdf)
- [S, M, not fetched] Known pathologies of weighted sums:
  - weights tuned after the fact to reach a preferred answer
  - ordinal scores (1-3-9) added as if cardinal
  - double-counting correlated criteria
  - rank reversal when an alternative is added (AHP)
  - Hazelrigg's argument, via Arrow's theorem, that group-weighted matrices can be logically inconsistent

  — Hazelrigg, "The implications of Arrow's impossibility theorem on approaches to optimal engineering design", J. Mech. Des. 1996 (no URL verified; treat as a gap for exact citation).

### Inferences
- An average trade study is a matrix whose weights nobody can defend, and its winner never changes. An excellent one:
  - names its mandatory (kill) criteria up front and states what was dropped and why (trade tree)
  - defines every scale operationally
  - shows one "weight-swing" sensitivity plot or a statement like "ranking flips only if W_cost > 0.45"
  - computes the uncertainty-reduction test, i.e. the value of more information
  - records dissent
- A 10-minute exercise format: 3 alternatives (e.g., radar band X vs S vs Ku for a fire-control role), 4 criteria with 1 mandatory, then find the weight at which the winner flips, then write a 2-sentence executive summary and one dissent line.

### Gaps
- I did not fetch DoD-specific trade guidance (DAU SE Guidebook / AcqNotes "Trade Study"). [AcqNotes trade study page](https://acqnotes.com/acqnote/careerfields/trade-study) exists but was not read. I did not find the exact text of Hazelrigg or a published "kill criteria" term from DoD; "kill criteria" as a phrase is industry or VC usage, and NASA's equivalent is "mandatory criteria".

## 2. Design reviews (SRR, PDR, CDR, TRR), red team / murder board, lean compression (Skunk Works, Anduril)

### Takeaway
Each formal review is a gate tied to a baseline:
- SRR freezes requirements
- PDR approves the "design-to" baseline
- CDR approves the "build-to" baseline
- TRR confirms readiness to test

Review boards are independent (NASA Standing Review Boards) and log issues as RFAs. Skunk Works compresses this through authority, tiny teams, minimal reports, a monthly cost-to-complete review, contractor-run flight test and a written list of specs it will knowingly not comply with. It does not compress by skipping thinking.

### Cited Findings
- [P, H, fetched] SRR "evaluates the functional and performance requirements… and ensures that the requirements and selected concept will satisfy the mission"; success "freezes program/project requirements". — [NASA SE Handbook Rev2, Table 6.7-x, p.160–161](https://www.nasa.gov/wp-content/uploads/2018/09/nasa_systems_engineering_handbook_0.pdf)
- [P, H] MDR/SDR: architecture responsive to requirements, "requirements have been allocated to all functional elements". — same
- [P, H] PDR "demonstrates that the preliminary design meets all system requirements with acceptable risk and within the cost and schedule constraints… shows that the correct design options have been selected, interfaces have been identified, and verification methods have been described… should address and resolve critical, system-wide issues". Result: "the design-to baseline is approved". — same, p.161
- [P, H] CDR "demonstrates that the maturity of the design is appropriate to support proceeding with full scale fabrication, assembly, integration, and test… on track… within the identified cost and schedule constraints". Result: "build-to baseline, production, and verification plans are approved… authorizes coding of deliverable software… All open issues should be resolved with closure actions and schedules." — same, p.162
- [P, H] TRR "ensures that the test article (hardware/software), test facility, support personnel, and test procedures are ready for testing and data acquisition, reduction, and control." — same, Glossary p.195
- [P, H] Entrance and success criteria for every review are tabulated in NPR 7123.1 Appendix G (Table G-1…G-9). Independent Standing Review Boards (SRBs) conduct life-cycle reviews; issues are captured as Requests for Action (RFA). — same, p.160–162, App. A acronyms
- [P, H, fetched] Kelly Johnson's 14 rules, from Lockheed's own PDF:
  1. practically complete control, reporting to a division president or higher
  2. strong but small project offices
  3. restrict people "in an almost vicious manner… (10% to 25% compared to the so-called normal systems)"
  4. a very simple drawing and release system
  5. "a minimum number of reports required, but important work must be recorded thoroughly"
  6. a monthly cost review including "projected costs to the conclusion of the program"
  7. commercial-style vendor bids
  8. no duplicated inspection; push it to vendors
  9. contractor flight-tests its product ("If he doesn't, he rapidly loses his competency to design other vehicles")
  10. specs agreed in advance, with "a specification section stating clearly which important military specification items will not knowingly be complied with and reasons therefore"
  11. timely funding
  12. mutual trust and day-to-day liaison
  13. security-controlled access
  14. pay not based on headcount supervised

  — [Lockheed Martin, Kelly's 14 Rules PDF](https://sustainability.lockheedmartin.com/content/dam/lockheed-martin/aero/photo/skunkworks/kellys-14-rules.pdf)
- [S, M] The rules date to 1954 per Ben Rich's *Skunk Works* (1994). Other accounts say they grew from the 1943 XP-80 and were formalized in the early 1950s. — [Sadki summary](https://redasadki.me/2015/10/19/skunk-works-14-rules-to-live-and-die-by/); [Wikipedia, Skunkworks project](https://en.wikipedia.org/wiki/Skunkworks_project) (search snippets)
- [P, M] A NATO/AGARD lessons-learned paper on Skunk Works operating rules says the PM has "total control of all program aspects including engineering, test, manufacturing, quality assurance, security, plans and schedules, budget control". — [AGARD-CP-602 ch.1](https://www.sto.nato.int/publications/AGARD/AGARD-CP-602/04CHAP01.pdf) (snippet)
- [S, M, not fetched] DoD equivalent (DAU Systems Engineering Technical Reviews): SRR, then SFR (functional baseline), PDR (allocated baseline), CDR (initial product baseline), then TRR, SVR/FCA, PRR. PDR is tied to Milestone B. — DAU Defense Acquisition Guidebook ch.3 / AcqNotes (not fetched)
- [S, L] A "murder board" is a hostile rehearsal review before the real board, used in the military and at NASA. I found no authoritative definition this session.

### Inferences
- An average review is a slide parade: success criteria are not stated, and RFAs are unowned or undated. A top-tier review is a gate:
  - it uses explicit entrance and success criteria
  - an independent board actively attacks the riskiest assumptions
  - every RFA gets an owner and a date
  - the outcome is a binary "baseline approved / not approved"
- Lean organizations keep the gate questions (are requirements frozen? are interfaces identified? verification methods? cost to complete?) and drop the paperwork.
- Exercise: a "PDR in 10 min". The learner gets a 1-page design (e.g., a missile seeker), must state 3 success criteria from the NASA PDR definition, the board raises 3 RFAs with owner and date, and the learner writes the "spec deviation" line in the Kelly rule-10 style.

### Gaps
- NPR 7123.1 Appendix G tables were not fetched (exact entrance-criteria lists). Anduril's internal review cadence is not public. I found no primary description of Anduril design reviews.

## 3. Failure investigation / root cause (NPR 8621.1, FTA, FMEA/FMECA, 8D, 5-whys, FRACAS, Ishikawa) and famous cases

### Takeaway
Good investigations separate three layers:
- **proximate cause**, the physics or code
- **root and contributing causes**, process and organization
- **corrective actions with owners**

The canonical cases each teach one move:
- Patriot: numeric drift with uptime
- Ariane 501: reused-software assumption outside its envelope
- MCO: interface units, plus warnings that were not escalated
- Challenger/Feynman: engineers' vs management's failure probability
- Columbia: model used outside its validated range, plus organizational cause

### Cited Findings
- [P, H, metadata fetched] GAO IMTEC-92-26, "Patriot Missile Defense: Software Problem Led to System Failure at Dhahran, Saudi Arabia", dated 4 Feb 1992, released 27 Feb 1992. — [GAO](https://www.gao.gov/products/imtec-92-26). The full PDF is a scanned image, so its text was not extracted. Prior-knowledge numbers, which the learner should verify against the PDF:
  - 25 Feb 1991, 28 US soldiers killed
  - time kept in 0.1 s ticks in a 24-bit register, with truncation error ≈0.000000095 s per tick
  - after ~100 h of continuous operation, the error is ≈0.34 s, shifting the range gate ≈687 m, so the Scud fell outside the gate
  - Israeli data had flagged a range-gate shift after ~8 h of operation
  - the modified software reached Dhahran on 26 Feb, one day later

  (M)
- [P, M, not fetched] Ariane 501 Inquiry Board (chair J.-L. Lions), report 19 Jul 1996:
  - ~37 s after liftoff on 4 Jun 1996, an operand error in the inertial reference system (SRI)
  - the error came from converting a 64-bit float (horizontal bias, BH) to a 16-bit signed integer
  - the backup SRI had already failed identically a few tens of ms earlier
  - the OBC read the diagnostic word as flight data, which commanded full nozzle deflection
  - the alignment function was useful only before liftoff but ran ~40 s into flight, a holdover from Ariane 4
  - the variable was left unprotected on Ariane 4 trajectory assumptions
  - Ariane 5 trajectory data were never in the SRI test specification
  - 14 recommendations; R1: switch off the alignment function immediately after liftoff
  - reports are structured as: The failure → Analysis of the failure chain → Comments on failure scenario → Conclusions (findings + cause) → Recommendations

  — [ESA report mirror (scanned PDF downloaded, not text-extractable)](https://esamultimedia.esa.int/docs/esa-x-1819eng.pdf); [UMN text mirror (503 this session)](https://www-users.cse.umn.edu/~arnold/disasters/ariane5rep.html)
- [P, M, not fetched] Mars Climate Orbiter (lost 23 Sep 1999), MIB Phase I report Nov 1999. Root cause: a ground software file ("Small Forces"/AMD) produced impulse in pound-force-seconds where newton-seconds were specified, a factor of 4.45. Contributing factors included navigation anomalies noticed but not escalated through a formal process, and a trajectory correction maneuver (TCM-5) considered but not executed. — NASA MCO MIB report (not fetched)
- [P, M, not fetched] Feynman, Rogers Commission Appendix F, "Personal observations on the reliability of the Shuttle":
  - working engineers' estimates of failure probability were ~1 in 100, against management's ~1 in 100,000
  - he criticizes treating partial O-ring erosion as a "safety factor"
  - closing line: "For a successful technology, reality must take precedence over public relations, for nature cannot be fooled."

  — [KSC mirror of Appendix F (503 this session)](https://science.ksc.nasa.gov/shuttle/missions/51-l/docs/rogers-commission/Appendix-F.txt)
- [P, M, not fetched] CAIB (Aug 2003):
  - physical cause: foam from the left bipod ramp struck left-wing RCC (panel ~8) at ~82 s
  - the report devotes equal weight to organizational causes ("normalization of deviance", schedule pressure, denied imagery requests)
  - the CRATER impact model was applied to debris hundreds of times larger than its test-data basis, a textbook "validity envelope" violation (exact ratio: verify)

  — CAIB Report Vol. 1 (not fetched)
- [P, M, not fetched] NPR 8621.1 (NASA mishap and close-call reporting and investigating):
  - mishaps are classified Type A–D by cost and injury severity
  - an appointed Mishap Investigation Board determines proximate cause, root cause(s) and contributing factors
  - it produces a Mishap Investigation Report with findings and recommendations, and a Corrective Action Plan
  - root cause is defined roughly as a factor that, "if eliminated or modified, would have prevented the undesired outcome"

  (not fetched; verify wording)
- [P, M, not fetched] Tool facts from prior knowledge:
  - **FTA**: top-down, AND/OR gates, minimal cut sets. See NASA *Fault Tree Handbook with Aerospace Applications* (2002) and NUREG-0492 (1981).
  - **FMEA/FMECA**: bottom-up per failure mode, with effects at local, next and end level. MIL-STD-1629A (1980) uses severity categories I–IV and a criticality number. Automotive RPN = S×O×D (each 1–10) is criticized because ordinal numbers get multiplied, and AIAG-VDA (2019) replaced RPN with "Action Priority".
  - **8D**: Ford, late 1980s. Steps D0 plan, D1 team, D2 problem, D3 containment, D4 root cause, D5 choose corrective action, D6 implement/validate, D7 prevent recurrence, D8 recognize team.
  - **5-whys**: from Toyota (Ohno). It is criticized as a single linear chain that stops early at a convenient cause and isn't reproducible; see Card, "The problem with '5 whys'", BMJ Qual Saf 2017.
  - **FRACAS**: closed-loop failure reporting, analysis and corrective action system, per MIL-HDBK-2155.
  - **Ishikawa**: fishbone categories such as the 6M (Man, Machine, Method, Material, Measurement, Mother-nature/environment).

### Inferences
- A 10–20 min exercise template, with the "investigation board" structure taken from Ariane, MCO and CAIB:
  1. timeline of the event
  2. proximate (physical/software) cause with a numeric check, e.g. recompute the Patriot drift: 100 h × 3600 × 10 ticks × 9.5e-8 s ≈ 0.34 s, times Scud speed ≈1.7 km/s, gives ≈0.6–0.7 km
  3. why it wasn't caught (test envelope, assumptions)
  4. organizational or contributing factors
  5. 2–3 recommendations each with owner, verification, and an "R1"
- Contrast with 5-whys to show branching (fishbone/FTA) beats a single chain.
- A top-tier investigation quantifies, names the violated assumption, and gives a fix that removes the class of error (e.g., protect all conversions), not just this instance.

### Gaps
- None of the primary failure reports were text-readable this session: the GAO and ESA PDFs are scanned images, and the UMN and KSC mirrors returned 503. All numbers above should be verified from the PDFs before being placed in lesson content. NPR 8621.1 and the CAIB were not fetched.

## 4. Model validity: DoD VV&A, domain of applicability, NASA-STD-7009

### Takeaway
DoD VV&A treats a model's correctness as relative to a **specific intended use**:
- verification: built right versus its specification
- validation: accurate enough for the real world for that use
- accreditation: an official accepts it for that purpose

NASA-STD-7009 adds a credibility assessment over 8 factors.

### Cited Findings
- [P, H] NASA-STD-7009 credibility assessment requirements:
  - eight factors: Verification, Validation, Input Pedigree, Results Uncertainty, Results Robustness, Use History, M&S Management, People Qualifications
  - "Shall assess the credibility of M&S results for each of the eight factors… Shall justify and document"
  - the scale "does not purport to measure credibility; rather, it assesses the M&S results, and the rigor of the processes used to produce them"
  - applicability is "based upon the risk posed by the anticipated use"

  — [NTRS 20160011121](https://ntrs.nasa.gov/api/citations/20160011121/downloads/20160011121.pdf); [NTRS 20090005963](https://ntrs.nasa.gov/api/citations/20090005963/downloads/20090005963.pdf); [NTRS 20130012748](https://ntrs.nasa.gov/api/citations/20130012748/downloads/20130012748.pdf) (search snippets)
- [S, M] NASA-STD-7009B approved 5 Mar 2024 (vendor glossary, unverified on NASA site). — [validas.de](https://www.validas.de/resources/glossary/nasa-std-7009b)
- [P, H, not fetched] DoDI 5000.61 definitions:
  - Verification: "process of determining that a model or simulation implementation and its associated data accurately represent the developer's conceptual description and specifications"
  - Validation: "…degree to which a model or simulation and its associated data are an accurate representation of the real world from the perspective of the intended uses"
  - Accreditation: "official certification that a model or simulation and its associated data are acceptable for use for a specific purpose"
  - MIL-STD-3022 gives the documentation templates (V&V plan/report, accreditation plan/report)

  (Quoted from memory; verify.)

### Inferences
- The "validity envelope" is the region of inputs where the validation data exists: CRATER for Columbia, the Ariane 4 trajectory for the Ariane 5 SRI, the Patriot uptime assumption. Each lesson model can therefore carry a three-line "accreditation card":
  - intended use
  - validated range, with the data that supports it
  - known out-of-range behavior

  An exercise could ask "is this radar-range-equation result accredited for clutter-limited conditions?"

### Gaps
- DoDI 5000.61 and MIL-STD-3022 text were not fetched. The NASA-STD-7009 CAS level definitions (0–4) were not confirmed.

## 5. Anduril: how they work, public statements, "Rebooting the Arsenal of Democracy"

### Takeaway
Anduril's public process claims rest on four principles: build to mission, not to spec; spend its own money (IR&D) before contracts; software-first (Lattice) with hardware as a sensor/effector on it; and speed. Little has been published about its internal engineering reviews.

### Cited Findings
- [P via S, M] The mission document "Rebooting the Arsenal of Democracy" (2022, rebootingthearsenal.com) lists principles "Outpacing the Threat; Building to the Mission, Not to Spec; Software-First; Controlling Defense Budgets". It names failure sources including "Working off Onerous System Specifications", "Spending Little on Internal Research & Development" and "Adherence to a Lengthy Bureaucratic Process". Recommendations include "Always have a meaningful contract at the end of a competition, and issue it quickly" and "Awarding prime contracts to software companies." — [Acquisition Talk (Eric Lofgren) summary](https://acquisitiontalk.com/2022/06/anduril-releases-mission-document-rebooting-the-arsenal-of-democracy/)
- [S, M] Critique: Lofgren found the "Controlling Defense Budgets" principle "a bit confusing", read it as self-funding pushing costs down, and noted that portfolio-management recommendations were missing. — same
- [S, M] Trae Stephens' companion op-ed in War on the Rocks, 6 Jun 2022, "It's time to reboot the arsenal of democracy". — [War on the Rocks](https://warontherocks.com/rebooting-the-arsenal-of-democracy/) (not fetched; the Anduril URL returned 404)
- [P, M] Brian Schimpf (CEO) gave written testimony to the HASC CITI subcommittee in Sep 2023, citing the document. — [HASC PDF](https://armedservices.house.gov/sites/republicans.armedservices.house.gov/files/Statement%20of%20Brian%20Schimpf%20-%20Full%20Statement%20-%20CITI%20Sep%202023%20%28FINAL%29.pdf) (not fetched)
- [S, L] Later material refers to "Rebuilding the Arsenal" and the Arsenal-1 hyperscale factory; the relation to the 2022 document is unclear. — [TWZ](https://www.twz.com/air/hyperscale-weapons-factory-vision-outlined-by-anduril)

### Inferences
- The exercise analog of "build to mission, not to spec" is rewriting a spec-style requirement ("radar shall have 200 km range") as a mission outcome ("detect and hand off a low-RCS cruise missile in time for one intercept attempt"). It contrasts nicely with Kelly rule 10, which lists the specs you will knowingly not comply with.

### Gaps
- No primary Anduril description of internal design reviews, team size or test cadence was found. Anduril's own article page 404'd. Palmer Luckey quotes were not retrieved.

## 6. Palantir Forward Deployed Engineers

### Takeaway
FDEs ("Deltas") sit with a single customer, own technical outcomes end to end like a startup CTO, and feed fixes back into the core product. Palantir's slogan contrasts "one customer, many capabilities" with core developers' "one capability, many customers".

### Cited Findings
- [S quoting P, M] Deltas sit in Business Development. Responsibilities resemble a startup CTO's: they "own end-to-end execution of high-stakes projects". About 25% of time is onsite, per a job ad. They configure data models, contribute fixes or new capabilities to the platform, and around 2016 (Foundry) many moved back to core engineering, bringing field experience. — [Pragmatic Engineer, "Forward deployed engineers"](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers)
- [S, M] The "one customer, many capabilities" framing is attributed to Palantir. Origin dates conflict across sources (mid-2000s vs early 2010s). — [WebSearch summary of multiple career guides](https://www.paraform.com/blog/forward-deployed-engineer-palantir-runway-greptile)
- [P, not fetched] Palantir blog, "A Day in the Life of a Palantir Forward Deployed Software Engineer" (2 Nov 2020) returned 403. — [Palantir blog](https://blog.palantir.com/a-day-in-the-life-of-a-palantir-forward-deployed-software-engineer-45ef2de257b1)

### Inferences
- Exercise format, the "FDE sprint": a user statement (e.g., a battalion S2 who can't fuse ESM bearings with radar tracks) goes through these steps:
  1. restate the mission outcome
  2. list the data actually available
  3. find the smallest working workflow by tomorrow
  4. decide what is a one-off vs what goes back to the product

### Gaps
- Palantir's own description of how FDEs decompose problems was not retrieved. The Echo (business-side) vs Delta split is reported elsewhere but was not confirmed here.

## 7. Requirements writing (INCOSE GtWR, NASA App. C) and requirements with owners

### Takeaway
A good requirement is singular, verifiable, solution-free, toleranced, and carries a rationale. Unknown values are marked TBR with an owner and a due date. NASA's Appendix C checklist is a ready-made grading rubric.

### Cited Findings
- [P, H, fetched] NASA SE Handbook, Appendix C:
  - "Shall = requirement; Will = facts…; Should = goal"
  - form: "product ABC shall XYZ"
  - "Complete with tolerances… (e.g., …3 sigma root sum squares)"
  - "Requirements should state WHAT is needed, NOT HOW"
  - "Ask, 'Why do you need the requirement?'"
  - "'The operator shall…' are almost always operational statements"
  - stated positively, not "shall not"
  - minimize TBD; use a best estimate marked TBR "with the rationale… who is responsible for its elimination, and by when"
  - "accompanied by an intelligible rationale, including any assumptions"
  - "only one thought per requirement… one subject and one predicate"
  - avoid "as appropriate," "etc.," "and/or," "but not limited to"
  - "What is the worst that could happen if the requirement was not included?"
  - "What is the worst thing that could happen if the tolerance was doubled or tripled?"
  - bidirectional traceability

  — [NASA SE Handbook Rev2 App. C, p.197–199](https://www.nasa.gov/wp-content/uploads/2018/09/nasa_systems_engineering_handbook_0.pdf)
- [P, M, not fetched] INCOSE Guide to Writing Requirements (v3 2019 / v4 2023) lists the characteristics of an individual requirement: Necessary, Appropriate, Unambiguous, Complete, Singular, Feasible, Verifiable, Correct, Conforming. A requirement set should be Complete, Consistent, Feasible, Comprehensible, Able to be validated and Correct. The guide also has ~40 writing rules (e.g., avoid vague terms, escape clauses, open-ended clauses).
- [S, M, not fetched] "Requirements with owners": Elon Musk's "algorithm", step 1, says requirements must come with a named person, not a department, and should be made "less dumb". — W. Isaacson, *Elon Musk* (2023) (not fetched)

### Inferences
- The rubric for a requirement-writing exercise is NASA C.4 plus "owner + verification method (test/analysis/inspection/demonstration)". The learner rewrites "the radar should have good range and low false alarms as appropriate" into two singular, toleranced, verifiable shall-statements with rationale and owner.

### Gaps
- INCOSE guide text not fetched (paywalled for non-members).

## 8. Pre-mortem (Klein, HBR 2007) and red teaming (UK MoD, UFMCS)

### Takeaway
A pre-mortem assumes the plan has already failed and has each member list reasons. It legitimizes dissent. Its oft-quoted "30%" figure means about 30% more reasons were generated, not 30% better accuracy. Red-team handbooks package similar techniques (key assumptions check, devil's advocacy, alternative analysis) for military planning.

### Cited Findings
- [P, H] Klein HBR (Sept 2007), "Performing a Project Premortem": team members "assume that the project they are planning has just failed" and generate plausible reasons. The aim is to make it "safe for dissenters who are knowledgeable about the undertaking and worried about its weaknesses to speak up." — [HBR](https://hbr.org/2007/09/performing-a-project-premortem) (preview)
- [P via S, M] Klein cites Mitchell, Russo & Pennington (1989): prospective hindsight "increases the ability to correctly identify reasons for future outcomes by 30%". Jason Collins notes the study measured the *number* of reasons, not their quality. — [Collins, "The premortem"](https://corporate.jasoncollins.blog/premortem)
- [S, M, not fetched] Klein's procedure, from prior knowledge of the full article:
  1. the leader briefs the plan
  2. "imagine it's months later and the project failed spectacularly"
  3. each person writes reasons independently (~2 min)
  4. the leader goes round the room collecting one reason at a time
  5. the PM reviews the list to strengthen the plan
- [P, M, not fetched] UK MoD DCDC *Red Teaming Handbook* (3rd ed., 2021) and US Army UFMCS *The Red Team Handbook* / *Applied Critical Thinking Handbook* catalog techniques including key assumptions check, pre-mortem, devil's advocacy, Team A/Team B, "what if?" analysis, alternative futures, stakeholder mapping and the "4 ways of seeing". The UK handbook defines red teaming roughly as challenging plans and assumptions from an alternative perspective to improve decision making. (not fetched)

### Inferences
- A 5-minute pre-mortem fits at the end of any design or trade exercise: "it's 2 years later, the SAM site was suppressed; list 3 causes, rank by likelihood × detectability, pick one mitigation." Pair it with a key-assumptions check, listing every assumption the trade rests on and marking each as solid, caveated or unsupported. That maps directly onto the NASA "Dissent" section and the CAIB lesson.

### Gaps
- The full Klein article, the UK MoD handbook and the UFMCS handbook were not fetched, so the exact technique lists and definitions need verification.
