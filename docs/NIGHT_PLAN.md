# Night build plan: from research to apps ready for learning (night of 30–31.10.2026)

The learner gave explicit approval and autonomy for tonight: "start deep work on all our plans at 01:00 Israel time and don't stop until everything is ready for learning tomorrow morning, or until you hit the time limit. You have approval now that you understand the goals, the plan and the preferences. Make sure everything is at the highest possible level: no 'no', no compromises." (verbatim in `docs/research/round5/decisions/user_messages.md`).

Talk to the learner ONLY in Hebrew, short and direct. Code identifiers in English. Never put a model name in commits. Never frame anything as "no" or "missing": anything important is simply added.

## 0. Read first (in this order)
1. `CLAUDE.md`, plus `docs/BUILD_GUIDE.md` (how the apps are built, tested and published, and the Artifact limits).
2. `docs/research/round5/decisions/` (all of the learner's choices; re-read the live boards with ArtifactData in case he changed something).
3. `docs/research/README.md`, then whatever each work package below points to.

## 1. The goal (keep it in mind for every decision)
- Two apps: Gilua (engineering, `eng/app/`, https://claude.ai/artifact/LtW5eytwQFZ4wAXhDSAw3k) and Lanchester (military-technical, `core/app/`, https://claude.ai/artifact/1tTftT3T7L7p67ofNzvfc9).
- The target is expertise above the average junior or senior engineer, and at MSc or PhD level in parts. That means breadth plus depth across ~36 domains, for superiority in any industry he chooses. It is not the job of a single-function engineer.
- Depth is never cut. **Never trade depth in one domain for another** (`docs/research/round5/expert/S3_no_tradeoff.md`). All 36 domains are core; waves set only the order.
- Lessons cover topics, not pages. Level 2.5 for each central result, plus level 3: predict, lab, verify and errorhunt (`docs/research/round5/expert/E5_pedagogy_apps.md`). The researcher's path (who, how, why) and case studies are core content.
- Learning is AI-native: AI does the calculations and the technical grunt work, and he owns the understanding, the choices, the verification and the judgment. A market-grade product every month (`S2_product_track.md`). It is verified with open-source professional simulators. A legality check runs before every idea or project. Every repo meets the standard of the best GitHub projects.
- **External, objective review every week** is a fixed requirement. The aim is the top.
- Hours: 8 h/day plus 1 phone hour.

## 2. Ground rules for tonight
- **Safety first:**
  - Before ANY publish, dump both apps' user data with ArtifactData into the scratchpad. Follow the procedure of the nightly backup routines: collections `data/users/me`, `.../profile/modules`, `notes`, `summaries`, `scratch`, `convs` and msgs.
  - Never delete or rewrite the learner's data. Schema changes must be additive and backward compatible.
  - Lessons and conversations he already has must keep opening and continuing.
- **Never leave a broken app in the morning:**
  - Publish only after the build passes and the tests run: the mock runtime under `app/tools/test/` and the apps' own tools. Take Playwright screenshots at 1300 px and 400 px, light and dark, and look at them.
  - Publish in increments, so each publish is a working app.
  - A package that is not finished stays off (behind a flag or unmerged). Never ship half of one.
- **Publishing:** same URLs, same capabilities, as in `CLAUDE.md`. `lib/` and asset files stay published; republish them only if they change.
- **Rules:** every teaching-rule change goes into BOTH `*/app/src/prompt.ts` (and `tutor.ts` plan rules) AND `docs/CORE_TEACHING_RULES.md` / `docs/ENG_TEACHING_RULES.md`.
  - Keep the engineering wording that fixed Lanchester's refusals (`CLAUDE.md`, "סירוב של Claude"). Run a refusal smoke test on 3 Lanchester modules after rule changes, if a real Claude call is possible from the session. If it is not, review the plan and part prompts for the patterns that caused refusals.
- **Shared code:** whatever is "identical in both apps" (`sound.ts`, `reading.ts`, `summaries/`, `MarginNotes`, `Explain`, `Scratchpad`, `ReadingAids`, `shared/scene3d/`) is changed in both, and both are built and published.
- **Git:** commit often. Push to `claude/confident-heisenberg-4r8fha` and fast-forward `claude/compassionate-meitner-dx0zxf` to it (the nightly backup routines take scripts from that branch). Never rewrite history.
- **No updates to the learner during the night:** he is asleep. Send him only the final summary in the morning (section 4). Keep a running log in `docs/NIGHT_LOG.md`: for each package, what is done, published and tested, and what is in progress. Commit and push it after every package, so that a restarted session can continue from it. When the morning handoff is done, write the line `HANDOFF_DONE` at the end of the log.
- **Watchdog:** a watchdog checks every 10 minutes that this session is still working. If it sends "continue", read `docs/NIGHT_LOG.md` and `git log`, then continue from where the work stopped. Never redo published work.
- **Work style:** use subagents in parallel per app or package, and finish each package with an adversarial review pass. Spend effort where the learner will feel it tomorrow morning.

## 3. Work packages (priority order; P1 must be live by morning)

### P1-A. Phase 0: truth and robustness (both apps)
Source: `docs/research/round2/V3_vision.md` ("Step 0"), `docs/research/B_app_audit.md`, `docs/research/round2/UX_audit.md`, `docs/research/round3/U_critique.md`.
- **Refusal protection in Gilua:** the same mechanism as Lanchester (`onRefusal`, diagnostics, partial text on refusal). Each part gets only its own spec plus the headings of the other parts.
- **Truncation detection:** a lesson part that ends mid-sentence, mid-exercise or with an unclosed block is detected and auto-continued.
- **Fixes:** the cost-tier bug, the memory race, and the usage counter. Add a version log for course memory.
- **Facts:** the 3 factual claims and the arrow ratio in the tank scene flagged in round 3.
- **Mobile layout:** the floating dock must not cover text, and the lesson must work at phone width (400 px).

### P1-B. Lesson rules v3 plus level 3 (both apps)
Source:
- `docs/research/round2/RULES_v3.md` (the final rules, with the J-judge fixes);
- `docs/research/round3/I_integrated.md` (depth gate, central results);
- `docs/research/round5/expert/E5_pedagogy_apps.md` (level 3 blocks `predict`, `lab`, `verify`, `errorhunt`);
- the status decision `rules` (researcher path and case studies are core).

What to do:
- Replace the ≥4,200-word floor with: 1–2 central results per lesson, 100% coverage of depth units, the density lint, and the depth gate.
- Keep rules 5א–5ד / 6א–6ד, 8א / 9ב and about 6 think questions.
- Add the new block types to the renderers (Callout and blocks), each with a light, quiet style per the design choices.
- **`lab` tasks** are hands-on work with AI and open-source tools (`S2_product_track.md` §4). They feed the month's product.

### P1-C. UI per the learner's choices (both apps)
Choices: `docs/research/round5/decisions/design_choices.json` and `ux5_choices.json`. Prototypes:
- `docs/research/round4/design/options.html`;
- `docs/research/round5/ux/proto_*.html`, with specs in `F1`–`F5`;
- `docs/research/round3/U_sketches_v3.html` (the approved v3 prototype: https://claude.ai/artifact/GPjuTuzYDLDoEdyg94jxcH).

Each choice and what it means:

| Choice | What to build |
|---|---|
| Layout | Center column, lesson contents in a drawer. Margin notes stay visible on the side. |
| Margin notes | Style B, the tab card (`proto_margin.html`). He did NOT like the old look. |
| Blocks | Three tiers with a side bar. |
| Commit before reveal | Three confidence buttons. Confident-wrong gets an amber card. |
| Consultation | An anchored card under the paragraph, with L0–L3 answer levels (short and direct by default) and a "דיון" (discussion) mode in the same card, saved with the lesson. Source: `docs/research/round3/C_consultation.md`. It replaces the weak side chat. Its long answers to small questions were his main complaint. |
| Typography | Line length about 68 characters, 18.5 px. Dark mode ink is softer (about 10.9:1) and small grey text is stronger. Zero looping animations. |
| Theme, density, cursor | Theme cream/graphite, density comfortable, cursor per lab (keep). |
| Progress | Section dots. |
| Sound | Soft typing with variation (v2), at his volume (94). The soft two-tone chimes pair, with both issues found in round 5 fixed. Background noise is "library room v2", generative with no loop, at noise volume 35. Focus noise is off by default. Day sound on. Spec: `F3_sound.md`, `proto_sound_v2.html`. |
| While a lesson is written | The lesson plan plus one pre-question. While a part streams: calm, with one question from the previous part. |
| Prefetch | Prefetch the next lesson at the break and at "close the day". |
| Breaks | A quiet line at a part boundary after 75 minutes. No nagging; anti-nag rules N1–N8 in `F2`. |
| Morning card | One card: where you stopped, 2 questions, and the step you wrote. |
| End of day | A "סגור את היום" (close the day) button with no suggestion. The day clock is counted quietly and not shown. The stamp (signature moment) in `proto_reading.html`. |

### P1-D. Commit-before-reveal and the events log (both apps)
Confidence capture on think questions, a calibration record in the db, and the amber confident-wrong card. Additive db documents only.

### P2-A. Retention v0
- A review queue (FSRS-style) seeded from central results, keep blocks and notebook markers, capped at about 25 min a day.
- The phone-hour flow: a 400 px layout for review.
- The morning card pulls from it.
- Source: `docs/research/round2/P_retention_practice.md` and the retention model in `round3`.

### P2-B. Topic-based curriculum
- Bring `docs/research/round3/final/F_curriculum.json` into both syllabi (`library/*/syllabus/syllabus.json` and whatever the apps load). The 13 new modules and 566 added items are taught by the tutor.
- Test-out exams, never removal.
- Map every old module id so the learner's progress, lessons and notes stay attached. Validate with the dumped data that nothing he studied disappears.
- This includes manned aircraft (Lanchester P8, plus the new M8.8 and M8.9), AI and ML, and the classical engineering domains, all as core.

### P2-C. Reading lists in the module view
`docs/research/round4/reading/R_eng.json` and `R_mil.json`: each module shows its fixed reading items. The tutor proposes them at the right moment.

### P2-D. Weekly newspaper tab
- Design: `docs/research/round4/news/N_design.md` and `N_prototype.html`. Gilua is engineering-first; defense sources go only in Lanchester.
- Add the tab, plus a weekly scheduled task that writes the issue into each app's db.

### P2-E. Products and weekly external review
- **Products tab:** the monthly product workspace (`S2_product_track.md` §2). It has:
  - the idea;
  - the legality check (`E2` `legal_he`, `E6`);
  - spec and market;
  - design and predictions;
  - the verification plan (two independent checks);
  - packaging against a "best GitHub projects" checklist (`S3_no_tradeoff.md` §4);
  - the retrospective.
- **Weekly external review (fixed):** a scheduled task. Independent reviewer sessions in "senior engineer / domain expert" personas review the week's lessons, his answers and calibration, and the product. They score them objectively against the domain targets (`E2_domain_targets.json`, `LV2_benchmark.json`) and write a Hebrew report into the app.
- Human reviewers (mentors, PRs merged upstream, public benchmarks) are added when available (`E4_external_validation.md`).

### P2-F. Nightly factory and evaluator agents
Source: `docs/research/round2/A3_factory.md`.
- **Factory:** run the 3 probes first (unattended db write permission, session length, usage). Then a nightly scheduled task pre-writes and verifies the next lessons onto a "ready shelf" in the app.
- **Evaluators:** nightly evaluator agents update the live level per domain.
- Use the remote trigger tools.

### P2-G. The lead-and-decide track (approved by the learner, 30.10)
His target is to lead and decide across many domains, not to be a single-function engineer. Give that a fixed place in both apps, at the same depth as everything else:
- **Cross-domain trade studies:** each one has a decision, alternatives, numbers per domain, and a sensitivity analysis.
- **Architecture choice:** pick an architecture against alternatives and defend it.
- **Design review:** review someone else's design. Planted errors span several domains.
- **Leading a team of agents:** run a large task with a team of agents. He sets the split, the interfaces and the acceptance tests.

How it is built:
- As lesson blocks and periodic exercises, built from what he has already learned.
- The weekly external review scores it.
- "Systems engineering" and "engineering judgment" feed it, but do not replace it.
- Add it to the teaching rules in both apps and to the docs.
- Do not add a separate quarterly integration-project rule: the learner said the cross-domain projects will come naturally as he learns.

### P2-H. Stronger sources for domains whose material is mostly tutor-written (approved by the learner, 30.10)
- **Domains:** C4ISR and kill chains, logistics and sustainment, adversary systems and doctrine, weapons effects and lethality. Also check the other domains with low confidence in `docs/research/round4/LV_benchmark.md` and `round5/expert/LV2_benchmark.md`.
- **Sources:** for each domain, add authoritative open sources to the fixed reading lists and to the material the tutor receives. Examples: doctrine publications, GAO, CBO and RAND studies, textbooks, peer-reviewed papers. Link each source to its module and topic, and check every link.
- **First review:** schedule the first external review of these domains early, in the first weekly review that reaches them. Do not wait until the end.
- **Same depth:** the depth target is the same as in every other domain.

### P3. Data fixes (heavy; start them in the background early, finish if time allows)
- OCR for Trefethen & Bau (Gilua M8.3–M8.10), Fleeman B13 and SMAD B12 (image-only).
- The chapters that are not extracted yet: SMAD ch.18, Feynman II ch.40 and ch.42, Horowitz & Hill ch.1.
- Library outputs are not in git: re-run the extraction and pack tools as `CLAUDE.md` says.

## 4. Morning handoff (must be done even if time runs out)
- Update the status board https://claude.ai/artifact/Cbp7n6ognmbFzrnn7LUeQ8 (source `docs/research/status/status.html`): what is live, what is next, what needs him. Keep its db decisions intact.
- Publish a short Hebrew morning report artifact:
  - what changed in each app and how to use it, with screenshots;
  - what still runs or is pending;
  - which scheduled tasks now exist.
- Update `CLAUDE.md` and the docs to match. Push both branches.
- If a package is unfinished, say exactly where it stands and what remains.
