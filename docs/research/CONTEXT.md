# Shared brief for all research agents (round 2 of the research)

## The learner
- Hebrew speaker, adult. Strong military-systems background; weaker formal math/physics (needs math built up, wants mathematical definitions before examples).
- Writes articles and interviews experts; wants to become an *authority*.
- Uses two self-built AI tutor apps (claude.ai Artifacts) — both must be COMPLETED, WITHOUT reducing depth, within "a few months", while also building nice projects along the way.
- He just said: Gilua lessons are "terribly long, sometimes over-long for nothing, without adding special depth" (module 1 may be partly background).
- His demands for this research: no limits, the best possible, iterate with critique loops, explore directions, sketches, simulations, until "perfect precision". Do not settle for safe or generic advice.
- Preferences: Opus as tutor; depth never cut; rising level of examples and cross-domain connections as the course advances; cares about experience (look, sound, notes, summaries notebook he writes himself).

## The two apps
- **Gilua (engineering)**: 316 modules in 28 parts. Tiers: core 234 modules (~11,700 main source pages), adv 66 (~3,900), ref 16 (~730). Total ~16,400 main pages. Syllabus: /home/user/repo-exercise/library/engineering/syllabus/syllabus.json (+ toc/, SYLLABUS.md, README in library/engineering). Books: Kolmogorov "Mathematics: Its Content, Methods and Meaning" (K1–K3), Feynman Lectures (F1–F3), signals, control, probability, linear algebra/optimization, fields, electronics, motors, thermo, heat, aero, structures, ML, RL, robotics, systems engineering (NASA), periphery.
- **Lanchester (military-technical core)**: 169 modules in 14 parts. Tiers: core 119 (~4,700 pages), adv 35 (~2,100), ref 15 (~880). Total ~7,700. Syllabus: /home/user/repo-exercise/library/military/syllabus/syllabus.json. Topics: radar, EW, missiles, space, operations research, etc.
- Together: ~485 modules, ~24,000 main pages (~16,400 core).
- Target level "2.5": for each central result — structure, derivation skeleton & where assumptions enter, limits, orders of magnitude (mental estimate within 10–20%), trade-offs, the same structure across fields, critique (catching errors of AI/books/engineers). Lanchester adds "operational meaning".
- Current lesson generation: in-page, Claude Opus via window.claude.use("sample"); a planning call (3–5 parts, ≥4,200 words) + one call per part; 10–25 min generation per lesson; lessons came out 8–15k Hebrew words. Course memory = one text blob. No mastery measurement, no spaced review. Rules in eng/app/src/prompt.ts, core/app/src/prompt.ts; generation in */app/src/tutor.ts.
- Infrastructure available: the Artifact page (React, no server; Claude calls with tools, images, JSON; a per-app db; files and assets published with the page; downloads). ALSO: scheduled cloud Claude Code sessions (they already run nightly backups and can read/write both apps' databases through an ArtifactData tool, with full access to the repo, the library PDFs/text, Python, and Opus). The in-page tutor has no internet.

## Round 1 research (read for background; don't repeat it)
Same folder: A_learning_science.md, B_app_audit.md, C_lesson_critique.md, D_landscape.md, V1_vision.md, R1–R5 critiques, V2_vision.md. Published summary report: report.html.
Round-1 key points: lessons are accurate but passive; "done" = "generated"; retrieval/spacing/generation/comparison/calibration are the strongest levers; AI tutors help when the learner attempts first and the AI works from correct material; T-shaped authority; measurement must be external; cost/time realism.

## Round 2 goal
Find the BEST possible design that achieves ALL of: (1) finish both curricula, (2) no loss of depth, (3) in a few months, (4) with projects, (5) real authority — or prove precisely what trade-off is unavoidable and find the design that minimizes it. Use numbers, experiments, simulations and prototypes, not just opinions.

Output folder for everything: /tmp/claude-0/-home-user-repo-exercise/1182bd04-1883-513e-b518-62829045d01a/scratchpad/research/round2/
Never modify files in /home/user/repo-exercise.
