# B. App audit: Gilua (eng) and Lanchester (core), capability map and weaknesses

Scope: read-only audit of `/home/user/repo-exercise` as of commit `751e8ce` (2026-10-30). Both apps are claude.ai Artifacts (React + Vite, no server). The tutor is `window.claude.use("sample")`, storage is the Artifact `db`, and the library ships as published files. Paths below are relative to the repo root. Where I say "eng" the same is true of "core" unless noted, because 46 of the source files are byte-identical (section 4.3).

---

## 0. Bottom line

The apps are very good **textbook generators** with good reading tools around them. They are weak **learning systems**. Almost all of the engineering effort and prompt text goes into producing long, high-quality, source-anchored lessons (4,200+ Hebrew words, seven "level 2.5" tags, figures, computed numbers, 3D scenes). Very little goes into finding out what the learner can actually do and adapting to it. Specifically:

- A lesson counts as "done", and a module as "learned" (which unlocks its dependents), when the lesson **text finished generating** without error (`finishLesson` in `eng/app/src/App.tsx`, called from `generate` when `sendMode === "lesson"`). Reading, answering or passing a check plays no part.
- The only number the system records about mastery is the free-text `quizScore` string (`ModuleProgress.quizScore`, from the regex `[[ציון: N/100]]`). It is shown on the module card and nowhere else: it does not gate anything, schedule anything or change any prompt.
- No spaced review, no retrieval schedule, no list of errors per concept. Old material comes back only when the tutor happens to write a `refresh` block, based on an LLM-written memory capped at ~2,000 words.
- The learner's most informative signals are **thrown away**: clarify-mode questions never reach the course memory (it is updated only after `lesson` or a graded `quiz`), the Explain panel conversation is not stored, the "I solved it" checkbox on exercises lives in `localStorage`, and the answers to the summary-review quiz live in React state only.

---

## 1. The learning loop as implemented

Legend: **A** = learner active (produces something), **P** = passive (reads or clicks), **T** = what the tutor sees of the learner at that step.

### 1.1 Module map → module selection
- **Code:** `components/ModuleMap.tsx`, `components/RingMap.tsx` (eng only), `Overview` and `ModulePage` in `App.tsx`; `moduleState` in `library.ts` (locked/open/done by `prereq`).
- **Learner:** P. Picks a module. 316 eng modules (234 core, 66 adv, 16 ref) in 28 parts. P0–P10 hold 114 modules and 4,452 main-source pages (4,875 with supplements; the plan in `docs/ENG_LAB_PLAN.md` says ~4,150).
- **Stored:** `profile.current`, plus `localStorage eng-lab:sel`.
- **T:** nothing yet.

### 1.2 Module → lessons (`planModule`, `tutor.ts`)
- One `sample.json` call (Opus, `modelTier: "complex"`, tools) gets the section list from the syllabus `toc/` maps and the first two pages of each source (`peek`). It returns `LessonSpec[]` (title, covers, sources, focus). The app checks coverage (`uncoveredSections`, `uncoveredPages`), retries once with the gaps, and then attaches anything still missing to the nearest lesson (`attachPages`).
- **Learner:** P (can click "חלק מחדש לשיעורים" before any lesson is done).
- **Stored:** `profile/modules/<id>`: `lessons`, `uncovered`, `uncoveredPages`, `done: []`, `convs`.
- **T:** `course_memory` and `reader_stage` (finished module ids). Learner performance is not an input.
- Design note: the split is driven by **page coverage** ("every page must fall inside some lesson") and a 10–20 pages/lesson rule. It does not look at what the learner already knows or at the concepts.

### 1.3 Lesson generation (`composeLesson`)
- **Planning call:** `sample.json<PartPlan>` with `<study_context>` (module block, `readerStage`, lesson plan, memory, the lesson's notebook items and 50 other notebook items, and up to 95,000 characters of source pages from `lessonPages`), plus `PART_PLAN_INSTRUCTIONS`. Tools: `read_source_pages`, `search_library`, `compute`, `save_lesson_note`. Output: 3–5 parts, word targets (≥4,200 total), figure assignment, computed `facts`.
- **Part calls:** one `sample` call per part, each resending the full context, the plan (eng: the whole JSON; core: titles only, a refusal fix from `ccdd258`), and up to the last 60,000 characters of the text written so far. A truncated part gets one continuation.
- **Checkpoints:** the draft is saved after the plan, after each part, and every 8 s of streamed text (`SAVE_EVERY`). `resumeLast` continues from `partsDone`.
- **Then:** `finishLesson` marks it done, and `updateMemory` rewrites the course memory (section 1.9).
- **Learner:** P. Presses "כתוב את שיעור N" and waits.
- **Stored:** `profile/convs/<cid>/msgs/<mid>` (text capped at 110,000 chars in `Store.saveMessage`, activity log of tool calls).
- **T:** memory, notebook items, finished-modules list, and earlier turns of *this lesson's* conversation (`fitHistory`).
- **Depth bar:** `depthBar` in `segments.ts` checks the **form** of the output (word count, story first, seven `[[2.5: …]]` tags, ≥2 `domain`, `today`, `figure`, `coverage`, ≥2 `exercise`). It never checks the learner. A "fill the gaps" button sends the missing items back as a clarify request.

### 1.4 Reading aids
- `ReadingAids.tsx` (progress bar, resume position in `localStorage reading-pos`, TOC with minutes left), `reading.ts` (font, spacing, focus mode), `sound.ts`, background noise, `SourceViewer.tsx` (the original page with its figures, from `[[DOC:PAGE]]` tags), `[[מונח: …]]` hover definitions, `scene3d`/`sim`/`anim`/`chart`/`interactive` blocks.
- **Learner:** P (navigation and manipulation of scenes and sliders).
- **Stored:** browser only. Reading position and time are **not** in the db, so the tutor cannot tell whether a lesson was read.

### 1.5 Questions: clarify / free modes, quick actions, Explain panel
- The composer (`Composer.tsx`) sends `askTutor` in `clarify` or `free` mode (Opus, tools, images). Quick actions: explain again more slowly, more exercises, full derivation, Python notebook, article/interview angles, 3D (eng) or another case study (core).
- **Explain panel** (`components/Explain.tsx`): select text → "הסבר פשוט", or a short chat, on Haiku (`claude-haiku-5-5`, falling back to Opus). It gets the current section's text, memory truncated to `MEMORY_CHARS`, and the last 4 turns. **Not stored**, and reset on every lesson switch.
- **Learner:** A (asks). This is the richest signal of confusion in the system.
- **Stored:** clarify/free turns go into the lesson conversation. Explain turns are not stored.
- **T:** the main tutor sees earlier clarify turns of the same lesson only while they fit the budget. **`updateMemory` is not called after clarify/free** (`if (sendMode === "lesson" || (sendMode === "quiz" && score))`), so the learner's questions never reach later lessons.

### 1.6 Think questions and exercises
- `think` blocks (`blocks/Think.tsx`): question, then a "חשבתי. הראו תשובה" reveal. **No input field**: the learner can reveal without committing to an answer.
- `exercise` blocks (`blocks/Exercise.tsx`): problem, hint, full solution, and a "פתרתי" checkbox stored in `localStorage eng-lab:solved` keyed by a hash of the text (`solved.ts`). There is no place to type an answer. The checkbox is invisible to the tutor and the backup, and it is lost if the lesson is regenerated or the browser storage is cleared.
- **Learner:** nominally A, in practice self-graded P.

### 1.7 Scratchpad "check my solution" (`components/Scratchpad.tsx`)
- Per-lesson pages with drawings (pen/line/arrow), text and MathLive lines, stored at `profile/scratch/<module>__<lesson>`. "בדוק את הפתרון" sends the page (drawings rasterized to PNG when `canSendImages`) plus the current section's text (8,000 characters) to Opus at `effort: "low"` with a fixed ~200-word critique prompt (`CHECK`).
- **Learner:** A. This is the only place where the learner's own work is checked against the lesson.
- **Stored:** the check text is kept on the scratch page. It is **not** linked to which exercise was attempted, not scored, and not fed to memory or to the main tutor.

### 1.8 End-of-module quiz
- Lesson index −1, `askTutor` in `quiz` mode with `QUIZ_INSTRUCTIONS`: 6–8 questions (eng: estimates, trade-offs, find-the-error, shared structure, 1–2 calculations; core: about half calculations). The learner answers **all of them in one message**. The tutor grades, explains, writes `[[ציון: N/100]]` and says which lessons to revisit.
- **Stored:** `quizConv`, and `quizScore` as a string. No score per question, no tags per concept, no date.
- **T:** the graded answer goes through `updateMemory`, so a few weaknesses may survive in "קשיים" if the memory model keeps them.
- **Gating:** none. The module is already "learned" before the quiz, and its dependents are already open.

### 1.9 Course memory (`updateMemory`, `INITIAL_MEMORY`)
- After every lesson or graded quiz, one call (`modelTier: "default"`, `effort: "low"`, **no model pinned**, no tools) rewrites the **whole** memory from the old memory, the request, `where`, and up to 90,000 characters of the answer. Fixed sections: current state, what was learned (one entry per lesson), tools and concepts with first-example numbers, notation, shared structures, open connections (fieldmap → module), cases used, source errors, difficulties/preferences. The cap is "about 2000 words".
- It is sent in full with every main-tutor call, and it can be edited by hand in `MemoryPanel.tsx`.
- **Weaknesses:** (a) it is built mostly from **what the tutor wrote**, not from what the learner did; (b) "one entry per lesson" under 2,000 words cannot hold ~300–450 lessons, so the memory will be lossy within the first few weeks, and the "never drop open connections" rule competes for the same space; (c) a full rewrite by a low-effort model each time lets errors and drops pile up with no diff or validation; (d) `generate` closes over `memory`, so a manual edit made during a lesson is overwritten by the post-lesson update; (e) the memory has no structure a program can query, so the app cannot use it.

### 1.10 Summaries notebook (`#summary`, `src/summaries/`)
- A full block editor (numbered headings, lists, proof lists, six box types, MathLive with a Word-like ribbon, figures from the books, marked-up images, Hebrew spell-checker, export to Word and HTML). One summary per module at `profile/summaries/<module>`.
- **AI in it** (`summaries/Panels.tsx`): `reviewSummary` (Opus with tools: what is wrong or missing, with page tags), `quizFromSummary` (6 Q/A pairs from the learner's own text), `checkSummaryAnswer` (✓/◐/✗ feedback).
- **Learner:** A, the most active part of the app (generation and elaboration).
- **Stored:** the summary itself. The review result, the questions, the answers and the feedback are **not** stored (component state only), so they reach neither memory nor any schedule.

### 1.11 Margin notes and the lesson notebook
- `MarginNotes.tsx`: a "פתק" button anchors a note to a quote from a paragraph. Kinds: note / deepen / interview question / article idea. They are kept in `profile/notes/<id>` with `margin: true`.
- The tutor writes to the same notebook with `save_lesson_note`. `<lesson_notebook>` (60 items) and `<notebook>` (50 items from other lessons; articles in full) go into every call.
- **Learner:** A. Well suited to the article and interview goal, and the one learner artifact the tutor reliably sees.

### 1.12 Backups
- Nightly scheduled Claude Code tasks (22:47, 23:13 and 23:37 Israel time) dump the db with ArtifactData and run `*/app/tools/backup/export.mjs` into the `study-notes` branch: MEMORY, PROGRESS, lessons, NOTEBOOK, SUMMARIES, SCRATCH (+ SVG), raw JSON (`docs/BACKUP.md`).
- Not backed up: anything in `localStorage` (solved exercises, reading positions), the Explain conversations, the summary-quiz answers.

---

## 2. What the system knows about mastery

| Signal | Exists? | Where | Used for adaptation? |
|---|---|---|---|
| Lesson generated | yes | `ModuleProgress.done` | Unlocks dependent modules (a proxy for coverage, not mastery) |
| Lesson read / time on text | no (scroll position only, in localStorage) | `reading-pos` | No |
| Think-question answers | no input exists | — | — |
| Exercise attempts / correctness | self-checkbox only | `localStorage eng-lab:solved` | No |
| Scratchpad checks | free text, per page | `profile/scratch/*` | No |
| Quiz score | one string per module | `quizScore` | Displayed only. Memory may mention weak spots |
| Per-question / per-concept errors | no | — | — |
| Confidence ratings | no | — | — |
| Clarify questions | stored in the conversation | `profile/convs` | Only inside the same lesson's history. Not in memory |
| Explain-panel questions | no | — | — |
| Summary quality / review | not stored | — | — |
| Time since last contact with a concept | no | — | — |

**Adaptation that exists:** (1) `reader_stage` (gateway P0–P3 vs full level) is chosen by **module position**, not by performance; (2) refresh blocks and "connections" come from the memory text; (3) the tutor reads the notebook. Nothing changes lesson length, difficulty, pace, the number of exercises or review based on measured performance.

**Spaced review / retrieval:** none. There is no review queue, no "due today", and no interleaving of old material. The only retrieval practice is the optional end-of-module quiz (once, with no follow-up) and the optional summary quiz (only on what the learner already wrote, with results discarded). The "open connections" in memory are the closest thing to resurfacing, but they resurface **formulas into later lessons** for cross-domain linking. They do not test the learner.

---

## 3. Artifact runtime constraints (from `docs/BUILD_GUIDE.md` §3 and the code)

| Constraint | Effect |
|---|---|
| `sample` has no system prompt and no state between calls | The ~39 KB eng system prompt (`SYSTEM_PROMPT`, measured 39,155 bytes, plus the library list and scene catalog) is resent as the first user turn of **every** call. With tools, caching is not allowed (`cache: false` only), so the lesson input is paid for in full on every part |
| ≤256 KiB input per call, tool results included | `INPUT_BUDGET = 190_000` caps only the *history*. Fixed context per part ≈ 42 KB system + up to 95 K chars of pages + memory (~2,000 Hebrew words ≈ 20–25 KB) + notebooks (up to ~25 KB) + up to 60 K chars of prior text (Hebrew ≈ 2 bytes/char, ≈ 110 KB). Late parts can therefore approach or pass 256 KB before any tool result: a latent `prompt_too_large` risk. (BUILD_GUIDE says 170 KB; the code says 190 KB.) |
| ~5 min per round; long outputs get `truncated` | This is why lessons are written in parts (1 plan + 3–5 parts + continuations) |
| Few tool rounds; ≤32 KB per tool result | `read_source_pages` is capped at ~16 pages and 50,000 chars. Tools must be batched |
| No internet; no Python in the page | `today` blocks rest on model knowledge with certainty tags; `compute` = math.js; notebooks are exported to Colab |
| Images: supported when `limits().images` | Used for learner uploads and scratchpad drawings. The tutor **never sees the book figures** it places (only captions in the page headers) |
| db: doc ≤256 KB, ≤25,000 docs, private per user | Ample for an event log of attempts and a review queue (one small doc per attempt) |
| Model: Opus by name for the tutor; `modelTier` for the rest | Memory updates run on the default tier at low effort; Explain runs on Haiku |
| No background execution in the page | Generation happens only while the tab is open (`beforeunload` warning) |
| `confirm/alert/prompt` blocked; CSP limits CDNs | UI workarounds already in place |

**Available but unused or underused:**
- **Structured outputs** (`sample.json`): used only for the module plan, the lesson plan and the summary quiz. The quiz grading, scratch checks and memory could all return JSON (per-question score, concept tags, error type), so the app could store and act on them.
- **App-side tools** with `execute`: the pattern exists (`save_lesson_note`). A `record_attempt` / `get_learner_model` / `schedule_review` tool would let the tutor read and write a real learner model.
- **Cheap parallel calls**: a quick Haiku or Sonnet call could grade a typed think/exercise answer in seconds, the way Explain already does.
- **The db as analytics**: no attempt log, no timestamps per concept.
- **Pre-generation**: the page cannot run in the background, but the next lesson's plan, or the whole next lesson, could be generated while the learner reads the current one (the same tab, one more `sample` stream). Outside the page, a scheduled Claude Code task (the backup tasks already use ArtifactData) could in principle write prepared content into the db overnight.
- **Images to the tutor**: figure crops (`lib/fig/`) could be attached to planning calls so the explanations of figures rest on the figure itself.

---

## 4. Friction and failure points

### 4.1 Length, latency, cost
- A lesson takes 1 planning call (with tool rounds: reading pages and `compute`) + 3–5 part calls, each at Opus `effort: high` by default, each resending ~150–250 KB of input. Rough estimate (not measured): **10–25 minutes of generation per lesson**, and ≈1 MB of input tokens per lesson.
- **Pace arithmetic for the stated goal:** 4,452–4,875 pages in P0–P10 at 10–20 pages per lesson is ≈250–480 lessons. Over ~60 days that is 4–8 lessons a day. At ≥4,200 Hebrew words each, that is 17,000–34,000 words of dense reading a day (≈2.5–5 h at a technical reading speed), plus generation waits and the quizzes. The design scales up **reading volume**, and the elements that build durable recall (retrieval, spacing, feedback) are missing. The 4,000-word bar is enforced by `depthBar` and the prompts. Nothing measures whether a shorter lesson with more retrieval would teach as well.
- Rate limits (`rate_limited`) on the account are the binding constraint at 5+ lessons a day. Nothing shows the learner the budget or tells them to plan around it.

### 4.2 Refusals
- On 28.10 Opus refused Lanchester lessons (CLAUDE.md). The fix: rewrite the goal and rules, plan text in engineering language, send each part only its own spec plus the other titles (`partInstructions` in `core/app/src/tutor.ts`), `retryRefused` (one retry without history), a lean-prompt retry for `planModule`, and `onRefusal` diagnostics.
- **Finding:** the `onRefusal` diagnostics are now **dead code**. `onRefusal` returns early unless `cb.onDiag` is set, and the only place that passed `onDiag` (`core/app/src/App.tsx`) lost it in commit `ccdd258`. CLAUDE.md still says the results are saved to `profile/diag/`. `Store.saveDiag` exists but nothing calls it.
- Eng has **no** refusal handling at all (no `retryRefused`, no lean retry). It also still sends the full plan JSON to every part, the pattern that caused the core refusals.
- After a refusal the UI blanks the text (`e.code === "refused" ? ""`) and shows a generic error. The learner cannot do anything except retry.

### 4.3 Code duplication
- `diff` of `eng/app/src` against `core/app/src`: **46 files are byte-identical** (all the summaries code, Scratchpad, Explain, MarginNotes, ReadingAids, sound, all blocks and sims, types, ≈9,000+ lines). Real differences are limited to `tutor.ts` (259 diff lines), `prompt.ts` (225), `styles.css` (132), `App.tsx` (53, mostly `localStorage` keys, quick actions and the viewer-minimize feature that core lacks), and `Callout.tsx`/`Badge.tsx`/`segments.ts`.
- Only `shared/scene3d/` is actually shared. Every fix is ported by hand, and they already drift: refusal handling is core-only, plan trimming is core-only, viewer minimize is eng-only, the runtime `Window` typing differs. CLAUDE.md asks for every rule change to be made in two places (code and doc) per app, so a rule change touches 4 places.
- The original learning lab (`app/`) is a third, older fork.

### 4.4 Other fragile points
- **Progress = generation.** A crash after the last part but before `finishLesson` leaves the lesson undone. A successful generation the learner never read counts as done.
- **Quiz score parsing** relies on the exact `[[ציון: N/100]]` token. If it is missing, nothing is stored and the memory is not updated (`sendMode === "quiz" && score`).
- **Exercise identity** is a hash of the text, so regenerating a lesson resets the "solved" state.
- **Memory race and drift** (section 1.9 d). There is also no history of memory versions in the db (only the nightly git snapshot).
- **Message size:** `saveMessage` silently truncates text over 110,000 characters and keeps only the last 20 activity entries.
- **Module re-split** is allowed only before any lesson is done. Afterwards, a bad split is permanent.
- **No automated tests.** `tools/test/stub.js` plus a manual Playwright harness only. The coverage checks (`uncoveredSections`/`uncoveredPages`) and `depthBar` are pure functions that could be unit-tested.
- **Doc drift:** BUILD_GUIDE says a 170 KB history budget (code: 190 KB) and describes the original lab's `record_progress`; CLAUDE.md describes the dead diag path.

---

## 5. The 15 biggest gaps (ideal system vs. today), with feasibility

1. **Mastery should drive progress, not generation.** Today, "done" = text generated, and dependents unlock at once. *Feasible:* add `ModuleProgress.mastery` and gate on a passed quiz or retrieval check (or at least show "generated vs. mastered"). This is pure app logic plus db fields.

2. **A real learner model per concept.** Today there is only a free-text memory. *Feasible:* the lesson plan already lists `facts`, `keep` items and the 2.5 sections, so a `sample.json` call at lesson end can emit a concept list (id, formula, module). Store `profile/concepts/<id>` with attempts, last seen, ease and errors. That is well within the 25,000-doc limit.

3. **Spaced retrieval and a daily review queue.** Nothing resurfaces today. *Feasible:* an SM-2/FSRS schedule computed in the page over the concept docs. A "today's review" screen generates 5–10 retrieval items (estimates, find-the-error, "which field shares this structure") with a cheap model and grades them in JSON.

4. **Answer-before-reveal for think and exercise blocks.** Today the learner only reveals answers or ticks a box. *Feasible:* add a text/math input to `Think.tsx`/`Exercise.tsx`, grade with Haiku/Sonnet through `sample.json` ({verdict, error_type, concept}), and store it in the db. This turns ~6 think questions + ≥3 exercises per lesson into measurement.

5. **Quiz results as structured data that act.** Today a single string is stored. *Feasible:* ask for JSON grading (per question: concept, verdict, misconception), store it per question, re-queue the failed concepts (gap 3), and show the "lessons to revisit" as buttons, not prose.

6. **Feed the learner's questions and errors into memory.** Today clarify, Explain, scratch checks and summary reviews never reach `updateMemory`. *Feasible:* after a clarify turn, or in a batched end-of-day call, add a short "difficulties" update. Better still, write the difficulties to structured docs (gap 2) and send the top N to the tutor.

7. **Make the memory scale past ~30 lessons.** A single rewritten 2,000-word blob will lose most of a 300–450-lesson course. *Feasible:* split it into structured docs (concepts, open connections, cases used, notation), each retrieved by relevance (the module's prereqs, fieldmap targets) when building `<study_context>`. Keep a short narrative summary. Pin a capable model for the update and keep its versions.

8. **Adapt lesson depth and length to the learner.** Today it is always ≥4,200 words with a fixed block quota. *Feasible:* pass a "known / shaky / new" concept list into `PART_PLAN_INSTRUCTIONS` so the tutor compresses known material and expands shaky material. Let the learner choose "short / standard / deep". `depthBar` thresholds become parameters.

9. **Throughput: pre-generate and pipeline.** Today the learner waits 10–25 min per lesson, and at 5+ lessons/day rate limits bind. *Feasible:* start the next lesson's plan and parts in the background of the same tab while the current one is read. Optionally a scheduled Claude Code task could prepare lessons into the db overnight (ArtifactData is already used by the backups; this needs testing against message-size limits). Show a usage budget.

10. **Cut input bytes per call.** Today the 39 KB system prompt, 95 K chars of pages and up to 60 K chars of prior text are resent for every part, which costs money and time and risks the 256 KB cap. *Feasible:* send each part only its own pages (the plan already assigns them), a structured summary of earlier parts instead of their raw text, and only the rule sections the block types of that part need. Add an explicit byte guard on the fixed context, not only on history.

11. **Refusal resilience in both apps.** Eng has none, and the core diagnostics are disconnected. *Feasible:* port `retryRefused` and the plan trimming to eng, re-wire `onDiag` → `Store.saveDiag`, and on refusal fall back automatically to the lean prompt (or another model tier) instead of blanking the answer.

12. **One shared codebase for the two labs.** 46 identical files are maintained twice, and they already drift. *Feasible:* move identical code to `shared/` (as `scene3d` already is), with per-lab config (keys, quick actions, prompt, CSS theme). The Vite/tsconfig setup already includes `../../shared`. This cuts the cost of every later gap fix in half.

13. **Training "level 2.5" skills directly, especially critique and estimation.** The seven sections are *written into* lessons and checked by tag presence. The learner is not drilled on them. *Feasible:* generate drills by type (Fermi estimates with a tolerance band graded numerically by `compute`, find-the-error items, trade-off decisions with a rubric), track accuracy per skill type, and show calibration (estimate vs. truth) over time.

14. **The tutor should see figures and the learner's work in context.** Today figures reach the tutor only as captions, and scratch checks are not tied to an exercise. *Feasible:* attach the lesson's figure crops (WebP from `lib/fig`) to the planning call within `limits().images`. Link scratch pages to an exercise id and store the verdict (gap 4).

15. **Close the loop for the article and interview goal.** Notebook items are saved but not developed further. *Feasible:* a notebook view that clusters article ideas across modules, a "draft outline from these 5 notes + sources" action, and interview-prep packs (questions ranked by what the learner got wrong or flagged "deepen"). It uses existing data (`profile/notes`) and one `sample` call.

---

## 6. Smaller observations

- `reader_stage` is set by part number (P0–P3 vs P4+). A learner who already knows a field still gets gateway treatment, and one who struggles gets the full level.
- Module locking is strict (all prereqs). There is no "skip with placement test" path, even though placement could use the same quiz machinery.
- `today` blocks rely on model knowledge with no internet. The prompt handles this honestly with certainty tags and `@asof`, but nothing helps the learner paste sources (for example a "paste a source" field that stores it per module and injects it).
- The scratchpad check uses Opus at low effort and gives a ~200-word critique: good, but isolated.
- Positive: the source anchoring (`[[DOC:PAGE]]`, SourceViewer), the coverage checks on the module split, the draft and resume machinery, and the notebook integration are robust and well designed. The gaps above are about the *learning* layer, not the *content* layer.
