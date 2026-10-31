# Night build 2 (night of 31.10–1.11.2026): everything we planned, verified against the real tutor

The learner's words tonight: "Pay real attention to all the goals we planned yesterday. After all the tests, implement to our standards, with nothing missed or reduced, exactly on the path and plan from yesterday. You have an OK for everything. Tomorrow morning I hope to wake up and really find everything ready, not like today, when you disappointed me. About the book: I expect to say 'wow'."

Talk to the learner only in Hebrew. He is asleep: send no updates during the night, only the morning report. Never put a model name in commits. Never frame anything as "no" or "missing": anything important is simply added.

## 0. Read first
1. `CLAUDE.md`, `docs/BUILD_GUIDE.md`, `docs/NIGHT_PLAN.md` (last night's plan), `docs/NIGHT_LOG.md` (what happened).
2. The goals and decisions:
   - `docs/research/round5/decisions/` (all his choices and his own words);
   - `docs/research/round5/expert/S2_product_track.md` and `S3_no_tradeoff.md`;
   - `docs/research/round3/final/F_curriculum.md` (topic-based curriculum);
   - `docs/research/round2/RULES_v3.md` and `docs/research/round5/expert/E5_pedagogy_apps.md` (lesson rules, level 3).

## 1. What happened today (lessons you must apply)
- **The v3 lesson rules from last night broke both apps.** They were published without ever being run against the real tutor:
  - Gilua: the planning JSON grew so large that it came back empty.
  - Lanchester: the tutor's own free text was sent back into every part, which triggers refusals.
- **Lesson writing was rolled back** to the 30.10 version (`tutor.ts`, `prompt.ts` in both apps). Everything else from last night stayed live:
  - look, sound, review, tabs, consult, confidence, shelf, factory, backups.
- **Lanchester had a second cause.** Since about 30.10 claude.ai refused EVERY Lanchester request, even "write one line about waves". The bench diagnosis found the cause: the field list "(radar, electronic warfare, EO/IR, navigation, guidance and control, air defense, air platforms, UAS, naval systems, armor)" in the first line of `core/app/src/prompt.ts`. It was replaced with "(physics, signals and engineering)" (v89).
  - Treat any similar wording in what the tutor receives as a refusal risk.
- **The real-tutor test bench now exists in both apps** (`src/components/Bench.tsx`, route `#bench`, button "בדיקה" in the top bar):
  - It writes test lessons with the real tutor and stores each result in `profile/bench/<id>`: words, minutes, error, split, plan or text, and for plan steps the exact request (`-request-` docs).
  - After its first automatic run it waits for commands: `profile/bench/_cmd` = `{ "id": "<new id>", "steps": [{ "rules": "current"|"lite", "planOnly": true|false, "module": "M0.1", "lesson": 3 }] }`. Write it with ArtifactData (`set`, with `if_version` from a read). The page sets `done: true` when it finishes.
  - The learner leaves BOTH bench tabs open tonight, so you can test as often as you need.
  - A publish reloads the open tab. After a reload it waits for commands, so **never publish an app while its `_cmd` is not `done`**. Lanchester (v89+) has the command channel. Gilua gets it on its next publish: its tab still runs the old automatic sequence, a full "lite" lesson for M0.1 lesson 4, started about 21:41 UTC. Let that finish before you publish Gilua.
  - Read bench docs with `out_dir` and summarize them in bash. Lesson texts are large: read them in a subagent, not in your own context.
- **Candidate "lite" rules exist behind `setLessonRules("lite")` in `tutor.ts`.** They are:
  - 1–2 central results at full depth;
  - 3500–5000 words;
  - no restating;
  - "split, never delete" into a continuation lesson.
  
  The app now inserts that continuation lesson (`insertSplit` in `App.tsx`). Planning with lite already passed in Gilua: 4 parts, a split into lesson "(ב)", 1.5 minutes.

## 2. The iron rule tonight
Nothing that changes what the tutor receives goes live until the bench shows it works with the real tutor in BOTH apps. That covers `prompt.ts`, `tutor.ts`, `consultPrompt.ts`, the curriculum block and the Lanchester wording.
- Use plan-only steps (seconds to minutes) for every change.
- Use one full lesson per app before switching the lesson rules.
- A refusal or an empty answer means it is not done: fix it and test again.
- Keep `docs/NIGHT_LOG.md` current and pushed after every step, and finish with `HANDOFF_DONE`.


## 2א. The learner's last words before sleep (above everything)
"Above all: do not drop even one section of the material learned, and do not lower the level. Everything serves our track." And: "Moving material into a continuation lesson also lengthens the track, and the track has a deadline. Go to the plan we made yesterday, and let it be your compass: that is what we changed and planned everything for."

**The compass is yesterday's plan (`docs/NIGHT_PLAN.md` P1-B, `docs/research/round2/RULES_v3.md` §5 and rule 12), not the night-2 "lite" word range.**
- There is no word target and no floor. The length follows from the depth units: about 30 counted words per unit; one central result is about 80–120 units, two are about 130–180.
- **Too long means padding, and the fix is to remove padding only:** the density band is 20–45 counted words per unit. Above 45, scan the part against the padding list (rule 28: restating, recaps, empty transitions, repeated motivation) and delete only what is on it. Never delete a unit, shorten a unit below rule 29, or drop a section.
- **Split only by rule 5.4/12:** more than two central results, or more than 180 units after the authority layer. A split is NOT the tool for a lesson that is merely long. Every extra lesson lengthens the track (about 30 months, `S2_product_track.md`, `S3_no_tradeoff.md` §3).
- The bench Gilua "lite" lesson: 10,482 words, 16 min, it split into "(ב)". Judge it with this compass. How much of the 10,482 is padding or restating, and how much is real units? Was the split justified by rule 5.4, or only by the word range? Rewrite the candidate rules in compact form from RULES_v3 §5 (units, density band, padding list, split threshold), keeping the plan JSON small (the lesson of night 1). Then bench it again in both apps.
- The independent judge checks: every topic item and section of the original lesson is covered, at full level. Nothing is dropped. No padding. No unnecessary split.

## 2ב. Before every action: read the plan and check every section
The learner's words: "Before every action, read the plan and show that you meet every section of it before a change."
- Before each change, re-read this file, §2א and yesterday's plan (`docs/NIGHT_PLAN.md`, `RULES_v3.md`). In `docs/NIGHT_LOG.md`, write a short checklist for that step: each relevant section of the plan, with "met" and how. No change goes in without that checklist.

## 2ג. Writing style: research the best technical writers
The learner's words: "I struggle with the explanations and Claude's usual style. Research this too, and find the writing style of the best writer or writers on technical topics. There are quite a few good ones."
- **Research (a subagent, with the web):** who writes technical explanations best, and what exactly they do. Candidates include Feynman (Lectures), Richard Hamming, Gilbert Strang, Tristan Needham (Visual Complex Analysis), Kleppner & Kolenkow, Horowitz & Hill, Sanjoy Mahajan (Street-Fighting Mathematics), Charles Petzold, Steven Strogatz, Grant Sanderson (3Blue1Brown), Bret Victor, Paul Graham's and Steven Pinker's rules on clear prose (The Sense of Style), Hebrew science writing at its best. Also the research on explanations: worked examples, concreteness fading, "curse of knowledge", signposting.
- **Diagnose Claude's usual style against them:** what makes it hard to follow. For example: abstraction before a concrete hook, long hedged sentences, lists instead of an argument, many new terms per paragraph, missing "why we care", skipped steps, generic phrasing. Use the learner's own complaints in `docs/research/round5/decisions/user_messages.md` and the M0.1 feedback.
- **Output:** `docs/research/round6/style/STYLE.md`. It holds the writers studied, with short quoted examples and what each does. It also holds 10–15 concrete, testable style rules, written as tutor instructions in compact wording. Add a before/after rewrite of one paragraph from a real bench lesson.
- **Apply them as one more bench-verified item** (iron rule, §2), inside the compact lesson rules (§2א). They must never cut depth or units: style changes how a unit is written, not whether it is there. The independent judge also grades style against `STYLE.md`. The before/after example is only evidence in the report. The deliverable is the new style live in both apps.
- Update `docs/*_TEACHING_RULES.md` and `CLAUDE.md` when they go live.

## 2ד. The finish line: the whole product, live, "wow"
The learner's words: "Not an example in the morning. I expect the complete product, so that I wake up and say 'wow' about everything. Nothing less. Don't stop before you reach 'wow' on every rule. There is no such thing as 'there is no solution'."
- The deliverable is everything in §3, live and bench-verified in both apps: lesson rules (compass §2א), the writing style (§2ג), everything the rollback removed, and the book. Not samples, not drafts, not "next steps".
- When something fails, find another way, and keep going until it passes. "No solution" is not an answer. Escalate only by trying a different approach, never by lowering the bar or dropping an item.
- Do not write HANDOFF_DONE while any §3 item is not live and verified, unless the session limit really ends the night. In that case, the report says exactly what remains and what was tried.

## 3. The work, in order (all of it; nothing from yesterday's plan is dropped)
1. **Lesson rules.** Read the bench results:
   - the Gilua full "lite" lesson;
   - the Lanchester plans after the fix (v89 runs its automatic sequence when the tab reloads: current plan, lite plan, then a full lesson).

   Have an independent subagent judge each lesson against the standards:
   - full depth for each central result, all seven level-2.5 sections woven into the argument;
   - the definition before the example (rules 5א–5ד / 6א–6ד);
   - topics, not pages;
   - the researcher's path and the case study as core;
   - no restating;
   - about six think questions;
   - the keep block;
   - a correct split that loses no material.

   Fix the rules until both pass. Then make "lite" the default in both apps: set `LESSON_RULES` and put the rules into `prompt.ts` properly. Update `docs/*_TEACHING_RULES.md` and `CLAUDE.md`.
2. **Bring back what the rollback removed.** Do it one item at a time, each bench-verified in both apps:
   - `curriculumBlock` (topic items, including the missing-chapter items GAP:F2.40, GAP:F2.42, GAP:HH1 and GAP:SMAD18; test-out; reading list), with the Lanchester wording from `tools/curriculum/wording_mil.json`;
   - the level-3 blocks (predict, errorhunt, verify, lab), in compact wording;
   - the lead-and-decide track (`decide` block; rules 58–59 / 40–41 in the docs);
   - stronger sources for the weak domains (P2-H);
   - Gilua refusal protection (code only).

   The renderers for these blocks already exist in the code. Only the tutor's instructions were rolled back.
3. **The book (option A).** It must make him say "wow".
   - Use the design session's work in `docs/research/round6/book/` (session "עיצוב: השיעור כספר (אפשרות א) עם עומק"). If he made choices on its board, read them from its db. Otherwise use its recommendations.
   - Implement the lesson as a real book in both apps. Everything adapts to the page:
     - two pages and a spine;
     - 3D page turns (arrows, keys, drag);
     - typography and colors;
     - figures;
     - scene3d;
     - think questions with confidence;
     - the consult card and discussion mode;
     - margin notes;
     - the contents ribbon;
     - streaming lessons;
     - sound;
     - phone layout: one page;
     - reduced-motion.
   - Test it with the local harness (`core/tools/test-check/check.mjs`): 1300 and 400 px, light and dark, every block type, and look at the screenshots.
   - Make it the default only if it is flawless. Keep a toggle in the Aa settings.
4. **Morning handoff.**
   - Update the status board https://claude.ai/artifact/Cbp7n6ognmbFzrnn7LUeQ8 and keep its db.
   - Write a short honest Hebrew morning report artifact with screenshots. It must cover:
     - what was verified with the real tutor (with the numbers: words, minutes, passes);
     - what is live;
     - what is not done and why.
   - Update the docs, push both branches (`claude/confident-heisenberg-4r8fha`, and fast-forward `claude/compassionate-meitner-dx0zxf`), and write `HANDOFF_DONE`.

## 4. Rules for publishing
- Build, typecheck, run the unit tests (`node --test` per file in `tools/test/`) and the harness. Then publish both apps, to the same URLs and with the same capabilities (CLAUDE.md).
- Before any publish, check that the target app's bench `_cmd` is done.
- The learner's data is never deleted or rewritten. Additive changes only.
