# R3. Technical feasibility review of Vision v1

Reviewer stance: senior engineer, read-only. Sources: `V1_vision.md`, `B_app_audit.md`, the code at `751e8ce` (`eng/app/src`, `core/app/src`, `shared/scene3d`), `docs/BUILD_GUIDE.md`, and the runtime type definitions for contract 0.2.90 (`db.d.ts`, `sample.d.ts`, `user.d.ts`). I checked the audit's main claims against the code. They hold: `finishLesson` runs on generation (`eng/app/src/App.tsx:428`); `updateMemory` runs only for `lesson` or a scored `quiz` (`App.tsx:431`); `Think.tsx` has no input; eng `partInstructions` sends the whole plan JSON (`eng/app/src/tutor.ts:449`); core `onRefusal` exits early without `cb.onDiag` (`core/app/src/tutor.ts:729`) and nothing passes `onDiag` in `core/app/src/App.tsx`.

## 0. Verdict

Sections 4 and 5 (lesson v3, learner model, review queue) can be built inside the Artifact runtime as it is, with `sample.json`, page-side tools and the per-artifact `db`. Section 6 can mostly be built the same way. Three parts of the vision rest on assumptions the runtime does not support:

1. **A learner model shared by the two apps.** Each Artifact has its own database, and `user.id()` is "your id on this artifact: an opaque token" (`user.d.ts:101`). Two pages cannot read the same document, and they cannot even agree on the learner's id. Sharing has to go through a bridge outside the pages (§3.5).
2. **Pre-generation as background work.** Nothing runs unless the tab is open, and the runtime runs "a couple of calls at once for a viewer, a few more wait their turn" (`sample.d.ts:52`). A lesson pre-generated in the same tab competes with the cheap grading calls the new loop depends on.
3. **"Structured JSON calls" with a schema.** `sample.json` takes no schema. It parses tolerantly, and "nothing is validated at run time" (`sample.d.ts:~170`). Every learner-model write needs validation in the app.

The vision also leaves out a large cost problem that already exists (§2.2).

## 1. Component-by-component feasibility

| Vision item | Feasible as-is? | Mechanism | Blockers / caveats |
|---|---|---|---|
| §3.1 Warm-up retrieval (6–10 items) | Yes | One `sample.json` call that returns an array of items for the due nodes (the runtime advises one call returning an array rather than one call per item), then one batched grading call. Deterministic grading for numbers (log-error with `runCompute`/math.js, already in `tutor.ts:33`) and for multiple choice | Needs the concept nodes (§5) first. Until they exist, items can come from `keep` blocks of finished lessons |
| §4 Scope budget + depth layers | Yes (prompt + `segments.ts`) | `PART_PLAN_INSTRUCTIONS` (`tutor.ts:430–440`), `depthBar`, a new collapsible `depth` fence in `Segments.tsx` | Rule text changes in 4 places (2 prompts, 2 docs). The ≥4,200-word rule appears in the plan instructions *and* in `prompt.ts`, and both must change together or the planner and writer will contradict each other |
| §4 Opening retrieval + pre-question | Yes | Add `<due_review>` (short structured list) to `studyContext`; the plan assigns them to part 1 | The answers must be collected by the page, not just written into prose (needs input blocks) |
| §4 Commit-before-reveal | Yes | Add an input + confidence to `blocks/Think.tsx`, `blocks/Exercise.tsx`; the reveal is enabled after submit; grade with `sample.json` on `modelTier:"quick"`/`"default"` | Block identity: today a solved exercise is keyed by a text hash (`solved.ts`). Use `convId:msgId:blockIndex` plus a hash, so regeneration orphans attempts visibly rather than silently |
| §4 Completeness lint + auto-continue | Yes | `depthBar` already computes missing items; after the last part, if `keep`/`coverage`/`exercise` are missing, run one continuation part | Bounded to one extra call; never loop (runtime warns against loops) |
| §4 Red-team paragraph, practitioner layer | Yes (prompt) | Plan field per part | Refusal surface in Lanchester (§3.2) |
| §5 Concept graph | Yes | `keep` blocks (rule 5ד, `prompt.ts:65`, a Markdown list "name, formula, when it holds") are parseable client-side with no model call; edges from one `sample.json` call at lesson end | Only lessons written after `1ba81d6` have `keep` blocks; older ones need a backfill call |
| §5 FSRS per node | Yes | `ts-fsrs` (pure TS, small) bundled; state in node docs | Items are generated each time, so difficulty varies between reviews; schedule the *node*, not the item |
| §5 Structured memory | Yes | Split into docs, retrieve by prereq/module | Migration of the blob (§3.1) |
| §5 Mastery gate | Yes | New `ModuleProgress.mastery`; `moduleState` (`library.ts:219`) gates on it | Do **not** redefine `profile.done`; it is "generated" in all existing data |
| §6 Calibration log | Yes, per app | Attempt events with `{estimate, lo, hi, conf, truth}` | The cross-app dashboard needs the bridge |
| §6 Decision cases, black boxes | Yes | Black boxes are pure page code (`components/sims/` exists); cases are one generation + one grading call | Hidden "truth" must come from a source page or a computation, not from model memory, or the grade is noise |
| §6 War-game turns (Lanchester) | Risky | Multi-role calls | Highest refusal risk in the whole vision |
| §6 Oral exam | Yes | `sample.json` grading with a rubric per question | Should not resend the 39 KB system prompt each turn: use a lean exam prompt |
| §7 Article/interview pipeline | Yes | `profile/notes` already holds the items; one call per step | None structural. Cheap, independent of the rest |
| §8 Shared codebase | Yes, with build work | `shared/lab/` like `shared/scene3d` | React and other npm packages must resolve from `shared/` (§4.4) |
| §8 Pre-generation | Partly | In-tab only, with cancel; overnight only through a Claude Code scheduled task, which means a second implementation of `composeLesson` outside the page | See §3.6 |
| §8 Figures to the tutor | Yes | `images` on the **plan call only** | Images "are re-sent every round" (`sample.d.ts:~77`), so on tool calls this multiplies input |
| §8 Verification pass | Yes | Second call per lesson | Cost multiplier (§2.2) |
| §8 Usage meter | Partly | Count calls by `modelTierApplied` in the db | There is no API for remaining quota; only `rate_limited` after the fact |

## 2. Cost and latency

### 2.1 Baseline today
Per lesson: 1 plan call + 3–5 part calls (+ continuations), all `model: "claude-opus-5-5"`, `modelTier: "complex"`, with tools (so `cache` is impossible). Each call resends the ~39 KB system prompt, up to 95 K chars of pages, memory, notebooks, and up to 60 K chars of earlier text. That is roughly 150–250 KB per call, about 1 MB per lesson, or ~250–350 K input tokens (my estimate for mixed Hebrew/English, not measured). At 4–8 lessons a day this is 1.3–2.5 M Opus input tokens and ~30 Opus calls a day, before any of the vision. `rate_limited` is already the binding constraint (audit §4.1). The runtime gives no quota reading.

### 2.2 Cost bugs and multipliers that exist now
- **The model name decides the tier for "cheap" calls.** Per `sample.d.ts` (`model` doc), a call that names a model "counts as that model's tier … or as `modelTier` if that is higher". So `checkSummaryAnswer` (`eng/app/src/tutor.ts:639`, `model: MODEL, modelTier: "quick"`) and `quizFromSummary` (`:627`, `model: MODEL, modelTier: "default"`) count as **Opus** usage, and so does the Explain fallback. Any new grader that copies this pattern will make the "cheap model for grading" plan cost Opus. Fix: no `model` field for graders, `modelTier: "quick"` or `"default"` only.
- **Refusal diagnostics** (`core/app/src/tutor.ts:743–760`) run up to 5 + 16 Opus calls after one refusal. If they are re-wired as the audit suggests, cap them to 3–4 variants and to once per module per day.
- **Images on tool calls** are resent in every round.
- **A verification pass per part** roughly doubles lesson cost. Run it once per lesson, on the plan's `facts` and the `keep` block only (small input, default tier), not over the whole text.
- **Pre-generation** of lessons that are then re-planned or never read is pure waste. Pre-generate only the plan, plus at most part 1.

### 2.3 Daily cost of the new loop (estimate)
| Step | Calls/day | Tier | Relative input |
|---|---|---|---|
| Lessons (v3: 3–4 K core words, per-part pages, lean rules) | 3 × (1 + 3–4) | Opus | ~60–70% of today per lesson |
| Think/exercise grading | ~20–30 | quick/default, **batched per part** where possible | small (question + rubric + answer, 2–5 KB each) |
| Warm-up generate + grade | 2 | default | small |
| Judgment drill | 2 | default | small |
| Teach-back / oral exam | 6–10 turns | default (Opus only for the final scoring) | medium; lean prompt |
| End-of-day learner-model update | 1–2 | default | medium |

Net: if the lessons get shorter and their input leaner, the day costs about the same Opus budget as today, plus ~40 cheap calls. If the lesson stays at 4,200+ words and is merely layered (the vision keeps "all assigned material" as depth layers that are still *generated*), the Opus cost does not fall, and the new loop is added on top. **The decision that matters for cost is whether depth layers are generated up front or on demand.** I recommend on demand: the plan lists the depth topics, and a "deepen" button writes one when it is clicked (one Opus call, with the lesson already in context). This also shortens the 10–25 minutes of waiting per lesson.

Latency: quick-tier grading answers in 1–2 s, default tier in 5–60 s. Use quick for verdict-only grading and default for rubric grading. With "a couple of calls at once", grading will queue behind a running lesson part. The UI must show "grading after the current part" rather than appear stuck.

## 3. Risks

### 3.1 Data migration
- `profile.done`, `ModuleProgress.done` mean "generated". Keep them, add `mastery`, and show "written / mastered" separately. The unlock rule should become configurable (generated vs mastered), defaulting to today's behaviour, so the dependency graph does not suddenly lock up.
- Old lessons have no block ids, no `keep` (before `1ba81d6`), and no answers. Do not rewrite stored messages. Instead, run a **lazy backfill**: when a finished lesson is first needed for review, one default-tier `sample.json` call extracts its nodes from the stored text (≤110 K chars, `Store.saveMessage`), and the result is stored as nodes with `source: "backfill"` and no evidence.
- The memory blob stays as a short narrative (`profile.memory`), and structured docs grow beside it. `updateMemory` should get a version doc (`profile/memoryLog/<ts>`, pruned to 30) and should re-read the latest memory before writing (fixes the race in audit §1.9d).
- Backups: `*/app/tools/backup/export.mjs` and `docs/BACKUP.md` must learn the new collections, or the nightly git snapshot silently stops being a full restore.

### 3.2 Refusals
The Lanchester refusals were caused by model-written plan text being fed back in every part call. The vision adds several new channels of model-written text that is fed back: concept-node notes, "planted error" paragraphs, decision cases, war-game moves, a "confused student" persona, and a "simulated expert". Rules:
- Feed learner-model state as **short structured fields** (`{node, state: "shaky", lastError: "sign of drag term"}`), never model prose.
- Lanchester: write drills in the engineering register used since 28.10. Defer the war-game until a refusal probe passes, and keep `onRefusal`-style probes, capped.
- Port core's protections to eng first: `retryRefused`, titles-only plan per part, lean retry for `planModule`, and re-wire `onDiag` → `Store.saveDiag` (eng has no `saveDiag`; core has it but nothing calls it).
- After a refusal, keep the partial text and offer a lean retry. Do not blank it (`e.code === "refused" ? ""`).

### 3.3 Grading reliability
- Use deterministic grading wherever possible: numbers (log-error, interval hit), choices, matching structures. **Calibration statistics must use deterministic items only**, or grader noise ends up recorded as miscalibration.
- Free-text grading: the item carries its rubric ("strong answer contains"), the grader returns `{verdict: "full"|"partial"|"none", missing: [...], misconception?: string}`, and the app validates the shape. Low-confidence verdicts (`partial`) do not move FSRS stability much.
- Add an "I disagree" button that logs the dispute and re-grades once on default tier. The dispute rate per grader prompt is the quality metric. A golden set of ~30 answered items per app, re-graded after every grader-prompt change, is the regression test.
- Haiku must not grade derivations or Hebrew mathematical argument; use default tier.

### 3.4 FSRS in the browser
This is low risk. `ts-fsrs` is pure computation, and the state per node (`stability, difficulty, due, reps, lapses, lastReview`) fits in a few hundred bytes. Risks: (a) generated items have uneven difficulty, so map the grade to FSRS ratings conservatively; (b) at 300+ modules × ~5 nodes = 1,500–2,500 nodes, the due query is a scan ("keep queried collections modest — hundreds to low thousands", `db.d.ts:430`). Keep a single `profile/reviewIndex` doc (node id → due, ~60 KB) that the page reads once, rather than querying the collection.

### 3.5 Sync between the two apps
The runtime does not allow it (separate databases, per-artifact user ids). Options:
- **(Recommended) Nightly bridge.** The existing scheduled backup tasks already read both databases through ArtifactData. Add one step that writes a compact `profile/peer` doc into each app (the other app's nodes as `{id, title, state}`, calibration summary, bridge candidates). One day of lag is fine for calibration dashboards and weekly bridge sessions. The task must find each app's opaque uid by listing `data/users`.
- Merge the two apps into one Artifact. This is not realistic: the eng `lib/` alone is budgeted at 215 MB of the 256 MB version limit, and core is already in the assets store.
- `files`/`mcp` capabilities: they can be declared, but they depend on the viewer and are fragile. Not worth it.
Keep concept ids namespaced (`eng:…`, `core:…`) and keep cross-app edges in the bridge doc only.

### 3.6 Pre-generation without a server
- In-tab: when part N of the current lesson is displayed and no grading is queued, plan the next lesson (one Opus call) and store it as a draft with `plan`, `partsDone: 0`. The existing `resumeLast` path then continues it. This reuses the draft machinery and needs no new storage.
- Overnight (Claude Code scheduled task writing into the db): possible, but it would reimplement `studyContext`/`composeLesson` in Node, with different tool semantics, and a write must fit in a 256 KB document. Defer.

### 3.7 Document budget
The database holds 25,000 documents, and the runtime explicitly warns against one document per event (`db.d.ts:489`). Today's usage is roughly one per message + modules + notes + scratch + summaries: about 3–5 K by the end of the course. One document per attempt (~40/day × 120 days ≈ 5 K) is survivable but wasteful. Use **day-session shards** instead.

## 4. Proposed architecture

### 4.1 Learner-model collections (under `data/users/<uid>/profile/`)
```
nodes/<nodeId>        { id, lab, moduleId, lesson, kind: "definition"|"result"|"number"|"method",
                        title, statement, validity?, number?: {value, unit, derivation},
                        edges: [{to, type: "prereq"|"same-structure"|"used-by"}],
                        fsrs: {stability, difficulty, due, reps, lapses, last},
                        stats: {attempts, correct, partial, hintUsed, lastError?},
                        source: "keep"|"plan"|"backfill", createdAt }
reviewIndex           { v, nodes: { <nodeId>: [due, stability, state] } }   // one doc, read on load
events/<yyyymmdd>_<session>  { day, session, items: Event[] }   // ≤ ~200 events, ≤ 200 KB; new shard when full
calib/<yyyymm>        { items: [{nodeId?, lo, hi, point, conf, truth, logErr, hit}] }
mastery/<moduleId>    { central: [nodeId], checks: [{at, score, passed}], recheckDue }
peer                  { lab, at, nodes: [...], calib: {...} }       // written by the nightly bridge
memoryLog/<ts>        { memory }                                    // last 30
```
Event: `{t, type: "think"|"exercise"|"warmup"|"quiz"|"clarify"|"explain"|"scratch"|"teachback"|"estimate", nodeIds, blockId?, answer, conf?, verdict?, misconception?, grader: {tier, promptV}, ms}`. Explain and clarify become events of type `confusion` (the question text plus the section), so the signal is kept without storing the whole chat.

Writes follow "one write at a time per doc": a small in-page queue per document, and the session id in the shard name so two tabs never write the same shard.

### 4.2 Concept extraction
1. At the end of a lesson (`finishLesson`), parse `keep` blocks client-side → candidate nodes (name, formula, validity). Parse `facts` from the stored `plan` → `number` nodes.
2. One `sample.json` call (default tier, no tools, input = the keep list + the titles of existing nodes in the module and its prereqs, ≤10 KB) returns `{merge: [...], edges: [...]}`. The app validates the ids and drops unknown ones.
3. The mastery check of a module uses the nodes of kind `result`.
No model prose is stored in nodes except `statement`, which is copied from the `keep` line.

### 4.3 Using the model
`studyContext` gets `<learner_state>`: ≤20 lines of `nodeId | title | strong/shaky/new | last error`, chosen from the lesson's module and its prereqs. This replaces the growth of the memory blob. The planner uses it to compress or expand material.

### 4.4 Shared code organization
- `shared/lab/` for the 46 identical files (blocks, summaries, Scratchpad, Explain, MarginNotes, ReadingAids, sound, reading, types, Store) and the new `shared/learner/` (model, FSRS wrapper, graders, event queue, validation). The rest stays per app: `prompt.ts`, `tutor.ts` context building, `styles.css`/`eng.css`, quick actions, and a `labConfig` (storage keys, lab id, prompts).
- Build: today `shared/scene3d` works because it has no npm imports. For React code in `shared/`, add `resolve.alias` for `react`, `react-dom`, `katex`, `mathlive`, … to each app's `node_modules` (or a root npm workspace) and `resolve.dedupe: ["react","react-dom"]`, or two React copies will end up in the bundle. Add `../../shared` to `include` (already there).
- Move files in one commit per group, after checking with `diff -r` that they are still identical, and run `npm run typecheck && npm run build` in both apps.

### 4.5 Test strategy
- Add `vitest` (dev only). Unit tests for the pure functions that exist today: `depthBar`, `uncoveredSections`/`uncoveredPages`, `fitHistory`, segment parsing. Add tests for the new ones: keep-block parser, event-shard roller, FSRS mapping, grader-output validator, `moduleState` with mastery.
- Prompt snapshots: build `systemPrompt()` and a `studyContext` for 3 fixed modules per app, snapshot them, and assert byte budgets (fixed context < 200 KB), so a rule change that blows the 256 KB cap fails the build instead of a lesson.
- Runtime harness: extend `tools/test/stub.js` with `where`, `limit`, `add`, scripted `sample.json` replies, and injectable `refused`/`rate_limited`/`invalid_json`, then run the Playwright harness for the warm-up, a think submission, and a migration of a seeded old profile.
- A golden set for graders (§3.3), run by hand (it costs usage) whenever a grader prompt changes.
- A refusal probe: before a Lanchester prompt change ships, run the plan + one part on 3 sensitive modules.

## 5. Re-ordered roadmap (by dependency and risk)

One "session" = one focused Claude Code session (~2–4 h) including build, publish and a live check in both apps.

| Phase | Work | Depends on | Sessions |
|---|---|---|---|
| 0. Hardening | Eng refusal port + diag re-wire (capped); fixed-context byte guard; per-part pages; grader tier fix; vitest + stub `where`; keep partial text on refusal | — | 3 |
| 1. Shared package | `shared/lab` for the files the next phases touch (blocks, Explain, Scratchpad, summaries Panels, Store) | 0 (tests) | 2–3 |
| 2. Evidence layer | Think/Exercise input + confidence + quick grading; event shards; structured quiz grading (JSON per question) + `mastery`; persist summary-quiz, scratch verdict, Explain/clarify as events | 1 | 3–4 |
| 3. Learner model | Nodes from keep/facts; edge call; lazy backfill; FSRS + `reviewIndex`; warm-up screen; `<learner_state>` in context; memory log | 2 | 4–5 |
| 4. Lesson v3 | Scope budget; depth on demand; opening retrieval from the due queue; completeness lint; red-team paragraph; practitioner layer; refusal probe per app | 3 (for the retrieval), 0 | 3–4 (+ live tuning) |
| 5. Judgment + mastery | Calibration (deterministic items) + dashboard; Fermi item; mastery gate (opt-in) + oral exam; black boxes (eng first) | 2–3 | 4–6 |
| 6. Cross-app + production | Nightly bridge (`peer` doc); bridge session; article/interview pipeline; in-tab plan pre-generation; facts verification pass | 3 | 4–5 |
| Later / only if a probe passes | Lanchester war-game; decision cases with hidden outcomes; overnight generation | — | — |

Total: about 23–30 sessions. The vision's "Phase 1 in 1–2 weeks" mixes prompt work (fast) with the evidence layer (which needs storage, grading and UI in two apps). Without the shared package it costs twice as much.

The article/interview pipeline (§7) depends on almost nothing and can be slotted in anywhere for motivation.

## 6. The three changes to ship first (best value / effort, nothing breaks)

1. **Commit-before-reveal on `think` blocks, with a logged, cheaply graded answer** (`blocks/Think.tsx`, identical in both apps; a new `Store.logEvent` writing `events/<day>_<session>`; grading via `sample.json` with `modelTier: "quick"` and no `model`). Old lessons render unchanged, because the block format does not change. The reveal stays available after a submission or an explicit "skip" (also logged). This turns ~6 passive moments per lesson into measurement, and it is the foundation of everything in §5. ~1.5 sessions.
2. **Structured quiz grading and a `mastery` field beside `done`.** `QUIZ_INSTRUCTIONS` asks for the prose *and* a fenced JSON block (per question: topic, verdict, misconception). The app parses it, falls back to the `[[ציון]]` regex, stores `ModuleProgress.quizItems` and `mastery`, and shows "written / mastered" on the module card. No unlock change yet. In the same change, stop naming Opus in `quizFromSummary`/`checkSummaryAnswer` and save the summary quiz results as events. ~1 session.
3. **Eng refusal and input hardening.** Port `retryRefused` and the titles-only `partInstructions` from core, wire `onDiag` → `saveDiag` in both apps with ≤4 probe variants, send each part only its own pages, and add a byte guard on the fixed context. This removes the most likely way a whole day's loop fails (eng refusals, `prompt_too_large`), and it reduces cost before the new loop adds calls. ~1 session.

Runners-up: the completeness lint with one auto-continuation (half a session, pure `segments.ts` + `App.tsx`), and the version log for memory plus the fix for the race where a post-lesson update overwrites a manual edit.
