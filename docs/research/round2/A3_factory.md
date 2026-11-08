# A3. The Lesson Factory: writing lessons in nightly cloud sessions instead of in the browser

Track: get lesson production out of the page. Today the page writes each lesson live, in 10–25 minutes, inside the `sample` limits. In the design here, a scheduled cloud Claude Code session (Opus, Python, the full repo and library, and ArtifactData into both apps' dbs) writes the next lessons overnight. It verifies them with independent passes and leaves them in the db ready to open. Live generation stays as a fallback.

Everything below was checked against the code and the live configuration unless marked **[assumption]** or **[probe]**. File references are to `/home/user/repo-exercise`.

---

## 0. Verdict in one paragraph

**It is feasible, the page needs only small changes, and it is the largest single quality lever in the system.** It is not a speed trick. The factory removes the wait from the learner's day. It also gets around every hard limit of the in-page tutor: 256 KB input per call, about 5 minutes per round, few tool rounds, math.js instead of Python, no image check of OCR'd formulas, and no second reader. Three things are unknown and need one evening of probes: (1) whether an unattended scheduled session may *write* with ArtifactData without a permission prompt, (2) how long one scheduled session may run, and (3) how much of the subscription's usage a night of factory work consumes. The design copes with all three: every job is idempotent and checkpointed in git, jobs fan out to short worker sessions, and a nightly usage cap is set. The binding constraint for "finish in a few months" is still the learner's **reading and retrieval time**, not generation. The factory helps there too: it cuts padding with a measured density gate and moves optional depth into layers the learner opens on demand, so depth is not lost.

---

## 1. Feasibility, piece by piece

### 1.1 What the scheduled sessions can already do (verified)

`list_triggers` shows four live nightly tasks on this account. Three of them dump the app dbs with ArtifactData and push to `study-notes`:

| Task | Time (Asia/Jerusalem) | Run length last night |
|---|---|---|
| גיבוי מעבדת הלמידה | 22:47 | 1.5 min |
| גיבוי מעבדת הליבה (Lanchester) | 23:13 | 1.5 min |
| גיבוי גילואה | 23:37 | 1.7 min |

Each task runs in a fresh session (`create_new_session_on_fire`). It attaches the repo with `add_repo`, loads ArtifactData with ToolSearch, and runs `list` with `out_dir` on `data/users/me/...`. So the following are proven: reading both dbs, resolving `me` to the learner's private subtree, cloning the repo, and running node. **Writing** is proven only interactively (the restore procedure in `docs/BACKUP.md` uses `batch`). An unattended write has never been run, which makes it **[probe 1]**.

The repo has no `.claude/settings.json`. Cloud sessions ignore `bypassPermissions`. In Accept-edits mode a tool call such as an ArtifactData write may wait for an approval that never comes. There are two fixes: run the trigger in **Auto** mode (if the org allows it), or commit `.claude/settings.json` with `"permissions": {"allow": ["ArtifactData", "Artifact", "Bash(python3:*)", "Bash(node:*)", "Bash(git:*)"]}`. That file is read only by a session with a single repo, which is what the factory is.

### 1.2 The library inside a cloud session (checked on disk)

- `eng/build/`, `eng/app/artifact/lib/` and `core/build/` are **gitignored** (`.gitignore:3,11,14`). A fresh clone has **no extracted text**. Locally, `core/build/lib/text` holds only B14–B17.
- The PDFs **are** in git (97 PDFs under `library/`: 568 MB engineering, 675 MB military). `pdftotext` and `pdftoppm` are present.
- The **published** artifacts hold the extracted text: Gilua `lib/text/*.json` has 34 files, 51 MB, the largest 3.2 MB (E15), as `{page: {l: printedLabel, t: text}}`. Lanchester has a matching `lib/text`. Only `fig/` and `pg/` (page images) of the 9 heavy docs went to the asset store (`eng/tools/asset_urls.json`). **All text is in published files.**
- So the factory gets the exact text the page uses by calling `Artifact read` with `url` + `paths: ["lib/index.json", "lib/text/E03.json", …]`. Each file is under 16 MB, and a call takes up to 256 paths. It fetches only the docs of tonight's lessons. Page images for **visual** checks come from rendering the PDF in git with `pdftoppm -f P -l P -r 110`, the page `[[DOC:PAGE]]` points at. This matters most for Kolmogorov, whose OCR'd formulas `prompt.ts` itself calls unreliable. The in-page tutor can't afford to look at those pages; the factory can.

### 1.3 The exact data format the page needs (from the code)

A lesson in the page is **one Markdown string** in an assistant `StoredMessage` (`eng/app/src/types.ts`). It has fenced blocks (`think`, `exercise`, `figure`, `chart`, `table`, `svg`, `scene3d`, `sim`, `anim`, `notebook`, `interactive`, `mermaid` and the callouts: `components/Markdown.tsx:67–86`) and inline tags (`[[DOC:PAGE]]`, `[[2.5: …]]`, `[[מונח: … | …]]`). Nothing in rendering depends on how the text was produced. That is the key fact: **a factory lesson renders exactly like a live one.**

What the page stores per lesson today (`runtime.ts` Store, `App.tsx` `send`/`generate`):

```
data/users/<uid>/profile                         { memory, done[], current, ... }
data/users/<uid>/profile/modules/<moduleId>      ModuleProgress { lessons: LessonSpec[], uncovered, uncoveredPages,
                                                                  done: number[], convs: {"<idx>": cid}, quizConv, quizScore, updatedAt }
data/users/<uid>/profile/convs/<cid>             ConvMeta { title, moduleId, lesson, createdAt, updatedAt, count }
data/users/<uid>/profile/convs/<cid>/msgs/<mid>  StoredMessage { role, text, mode:"lesson", ts, activity?, model?, draft?, plan?, partsDone? }
```

How the page behaves with a lesson it did not write:
- When a lesson is selected, the page loads `prog.convs[idx]` and shows its messages (`App.tsx:277–294`). `hasLesson` is true when there is an assistant `mode:"lesson"` message that is not `draft` or `interrupted` (`App.tsx:511`). The "כתוב את שיעור N" button then disappears and the follow-up actions appear.
- **"Done" today = "generated".** `finishLesson` is called only at the end of `generate` (`App.tsx:428`), and `updateMemory` runs only there (`:431–445`). A lesson written by the factory would never be marked done and would never update the course memory. That is a bug for the factory and a design flaw anyway (round 1: "done ≠ generated").
- `Store.saveMessage` truncates `text` above **110,000 chars** (`runtime.ts`, "a document holds at most 256 KiB"). Hebrew is 2 bytes/char in UTF-8, so 110k chars is about 200 KB. A 12k-word lesson is about 75–85k chars (≈140–160 KB). It fits, but a 15k-word lesson with inline SVG would not.
- `watchModules` / `watchConversations` use `limit(500)`. That is fine for 316 / 169 modules, but conversations grow to about 1,100 + 450. **[note]** Past 500 conversations the sidebar list silently drops old ones. This is unrelated to the factory, but the factory makes it arrive sooner.

### 1.4 Two ways to deliver a lesson

**A. Zero page changes (for the probe only).** The factory writes the same documents the page would: it puts `convs[idx] = cid` in `modules/<id>` (with `if_version`), adds `convs/<cid>` and two messages (the user's "כתוב את שיעור N…" and the assistant lesson with `model: "factory · <sha>"`). The page shows the lesson instantly. The drawbacks are why A is not the production path:
- It races with the page's `saveModule`, which `set()`s the whole module doc from its in-memory copy. If the tab is open at night, it can wipe out `convs`.
- Done and memory never happen.
- Once a lesson is a conversation, the factory can no longer replace it with a better version without deleting the learner's follow-up turns.

**B. Recommended: a "ready shelf" the page reads, then materializes on open.** The factory writes only to collections that the page **reads** and marks `opened`. The page owns conversations, `done` and memory, so there are no races. Until the learner opens a lesson, the factory may regenerate or patch it freely.

#### Schemas (B)

```ts
// profile/ready/<moduleId>__<idx>   (≤ 230 KB; one per lesson on the shelf)
interface ReadyLesson {
  v: 1;
  moduleId: string; lesson: number;          // index into ModuleProgress.lessons
  specHash: string;                          // sha1 of the LessonSpec it was written for; mismatch ⇒ ignore
  title: string;
  text: string;                              // the lesson Markdown (≤ 100k chars, the "core path")
  plan: PartPlan;                            // same shape as tutor.ts PartPlan (feeds ReadingAids TOC)
  layers?: { id: string; title: string; words: number }[];   // optional depth layers, bodies in profile/readyx
  status: "ready" | "opened" | "superseded" | "needs-live";
  qa: {
    verdict: "pass" | "pass-with-notes";
    numbers: { checked: number; mismatched: 0; orphans: number };
    citations: { checked: number; unsupported: number; ocrFixed: number };
    lint: { errors: 0; warnings: string[] };
    density: { words: number; depthUnits: number; per1k: number; cutWords: number };
    review: string;                          // 3–6 lines: what the senior reviewer changed
    errata: { tag: string; wrong: string; right: string }[];
  };
  model: string; pipeline: string;           // "claude-opus-5-5", "factory@<git sha>"
  createdAt: number;
}

// profile/readyx/<moduleId>__<idx>__<kind>   kind ∈ keys | items | layer-<id>   (each ≤ 230 KB)
interface ReadyKeys  { answers: { blockHash: string; kind: "think"|"exercise"; worked: string; check: string /* python output */ }[] }
interface ReadyItems { items: ReviewItem[] }
interface ReviewItem {
  id: string;                    // "<concept>:<n>"
  concept: string;               // registry concept id
  type: "estimate" | "why" | "limit" | "tradeoff" | "find-error" | "same-structure" | "definition" | "operational";
  q: string; a: string;          // Hebrew, $…$ math
  rubric: string[];              // what a full answer must contain (for in-page grading by Haiku/Opus)
  tolerance?: number;            // for estimates: accepted relative error (0.1–0.2)
}
interface ReadyLayer { id: string; title: string; text: string }   // e.g. "full derivation of (3)", "second worked case", "history"

// profile/events/<yyyy-mm-dd>   (one doc per day, appended by the page with update + arrayUnion-like merge)
interface DayEvents { ev: { t: number; k: EventKind; m: string; l: number; b?: string; v?: string | number }[] }
type EventKind = "open" | "done" | "think-reveal" | "ex-hint" | "ex-solution" | "ex-solved" | "item-answer" | "item-grade"
               | "layer-open" | "rate" | "clarify";   // rate v ∈ "short"|"right"|"long"|"shallow"|"deep"

// profile/factory/_status   (one doc: what the shelf holds, last night's report, the caps)
interface FactoryStatus { night: string; built: string[]; failed: { id: string; why: string }[];
                          shelf: Record<string, "ready"|"needs-live">; usage: { lessons: number; lanes: number; minutes: number } }
```

Why these sizes and counts are safe: a db doc may be 256 KiB, an app may have 25,000 docs (`BUILD_GUIDE.md` §3), and an ArtifactData `batch` takes 50 writes and ≤1 MiB per call. A lesson ships as one batch (the ready doc, 2–4 `readyx` docs and the status), atomic where the server supports it. With about 1,500 lessons over the whole course and the shelf emptied as lessons open, the lesson docs stay at roughly 1,500 × (conversation + 2 msgs) + ≤ 50 shelf docs + 1 events doc per day, i.e. under 6,000 docs. The git branch `factory` keeps every artifact and report, so the db never has to hold history.

#### Minimal page changes (shared code, both apps; about 200–300 lines)

1. **`runtime.ts`**: `watchReady(fn)` on `profile/ready` (limit 200); `loadReadyExtra(id, kind)`; `logEvent(e)` (an `update` on today's events doc; `arrayUnion` if the runtime has it, else read-modify-write); `markReady(id, status)`.
2. **`App.tsx` lesson view**: if there is no conversation and a `ReadyLesson` with matching `specHash` exists, the primary action is **"פתח את השיעור (מוכן ונבדק)"**, with a QA badge. Clicking it runs `createConversation` → `saveMessage(user)` → `saveMessage(assistant {text, mode:"lesson", model, factory:{id, qa}})` → `markReady("opened")`. The existing "כתוב את שיעור N" stays as a secondary "כתוב עכשיו בזמן אמת".
3. **Done = the learner's act**: a "סיימתי את השיעור" button at the lesson end (and at the end of the review items) calls `finishLesson` and logs `done`. For factory lessons the memory update is **not** run in the page; the factory rebuilds the memory nightly from the registry (§2.2), with `if_version` on `profile`. Live lessons keep the current `updateMemory`.
4. **Events**: `Think` (reveal), `Exercise` (hint, solution, solved; today `solved.ts` is localStorage only and invisible to anyone else), the layer toggles, the review-items panel and a one-tap end-of-lesson rating "קצר מדי / בדיוק / ארוך מדי / רדוד / עמוק" each call `logEvent`. These are a few lines each.
5. **Layers**: a fenced ```` ```layer ```` block (`id`, `title`, one-line teaser) renders as a collapsed card. Opening it loads `readyx/...__layer-<id>` and renders it with `Markdown`, which also logs `layer-open`.
6. **`types.ts`**: `StoredMessage.factory?: { id: string; qa: ReadyLesson["qa"] }`, and `backup/export.mjs` learns `ready`, `readyx` and `events`, so the nightly git backup stays a full restore.

### 1.5 Session length, fan-out and timing

- **[probe 2]** The maximum run time of a scheduled session is not documented in the tools I can see. The design does not depend on it. One orchestrator session runs the cheap global steps and starts **worker sessions** with `create_session`, one lesson each, same environment, `model: claude-opus-5-5`, `permission_mode: auto`. Alternatively it runs K parallel subagents inside itself. Each worker writes its state to `factory/jobs/<id>/state.json` and pushes to the `factory` branch after every stage, so a killed worker is resumed by the next run from its last stage. That is the same idea as the page's `draft/plan/partsDone`, but on disk.
- Window: start at **00:07** Asia/Jerusalem, after the three backups (22:47–23:39). The backups are the "sync" input, and running after them means a broken factory can never corrupt a night's backup. Stop starting new jobs at 06:00.

### 1.6 Usage and cost **[assumption, probe 3]**

There is no API key; both the in-page `sample` calls and cloud sessions count against the same subscription. I have no access to the plan's caps, so the numbers below are relative. One unit **U** is one in-page lesson today: about 6 calls × 150–250 KB input ≈ 1 MB of input bytes (≈ 250–350k tokens) plus ≈ 30–45k output tokens (B_app_audit §1.10).

| Factory stage (per lesson) | Input tokens | Output tokens |
|---|---|---|
| Source analysis + Python facts | 40–80k (full pages, no 95k-char cap) | 8–12k |
| Plan (registry + learner slices) | 30–50k | 4–6k |
| Write (single context, part by part to files) | 60–90k (cached prefix) | 30–40k |
| 4 independent verifiers | 4 × 50–70k | 4 × 3–6k |
| Senior review | 60–80k | 4–8k |
| Revision (targeted edits, ≤ 2 rounds) | 60–90k | 8–15k |
| Sidecars (keys, 8–12 items, layers) | 40–60k | 15–30k |
| **Total** | **≈ 0.5–0.75M** | **≈ 85–135k** |

So a factory lesson costs about **1.5–2.5 U**. Most of the extra goes to verifying and to sidecars that do not exist today. It is spent at night, in 5-hour usage windows that would otherwise go unused. The learner's day then uses only the cheap interactive calls (clarify, grading items with a small model, explain with Haiku). If a weekly cap binds, the factory keeps a **nightly lesson cap** (`FACTORY_MAX` in the trigger prompt) and never builds more than the shelf horizon (§5). If one night of usage is exhausted, the unfinished jobs resume the next night, and the learner falls back to live writing for that lesson only.

### 1.7 Refusal risk (the Lanchester history)

On 28.10, Opus in the page refused to write Lanchester lessons. The cause was the tutor's **own plan text** coming back into later calls ("איזה ERP משבש צריך"). The fix was engineering language in the plan, and each part receiving only its own spec (CLAUDE.md). Implications for the factory:
- The factory runs the **same model** under a different harness (a Claude Code agent with the repo as context). Refusal behaviour may differ either way, so **[probe 4]** runs one Lanchester module (an EW or missile module) through the factory before relying on it.
- Each stage gets a narrow brief: the writer sees the lesson spec, the pages and the rules, not other agents' free text. Plans and reviews are written in the same engineering register the 28.10 fix established. The "senior reviewer" persona is an **engineering textbook reviewer**, not an operator.
- A refusal is contained: the job is marked `needs-live` with the reason in `_status`, and the night goes on. The factory never strips safety-relevant context or rephrases to get around a refusal. It records the case, the same as `onRefusal` → `profile/diag/` in Lanchester, for the learner to decide. Ready lessons come from published textbooks (radar equation, Lanchester laws, orbital mechanics, SMAD) at the level of a university course, which is the kind of material the page already writes.

---

## 2. Quality multipliers only the factory can afford

### 2.1 Multi-pass drafting with independent readers

Each lesson goes through separate contexts, each with only the inputs it needs (the "fresh eyes" property):

1. **Analyst.** Reads *all* the assigned pages (no 95k-char cap, no 15-page tool cap). Outputs `outline.json` (claims, derivations, figures, worked examples, overlaps between sources) and `facts.py`: every number the lesson will state, as Python with units (`pint`) and a printed display string.
2. **Architect.** Writes the PartPlan. It differs from today in two ways: it consults the **concept registry** (§2.2), so known concepts are referenced and not re-taught, and it gets a **depth budget** instead of a word floor (§2.6).
3. **Writer.** Writes the lesson part by part into files. It works in a single context, so every part sees the whole lesson, not the last 60k chars.
4. **Verifiers** (each in its own context; details in §2.3).
5. **Senior engineering reviewer.** Gets the draft and the pages, but *not* the writer's plan or reasoning. Its brief is adversarial and checkable: "list every place a senior engineer would object: a wrong or missing limit, a trade-off stated without numbers, a 'shared structure' that is only an analogy, a claim that needs a condition. List every paragraph whose removal loses nothing. If you find fewer than three issues, justify for each 2.5 section why it is sound." Output: JSON findings with paragraph anchors.
6. **Reviser.** Applies the findings as targeted edits (not a rewrite). It goes back to the verifiers at most twice. If the gate still fails, the job becomes `needs-live`, with the report attached.

### 2.2 Cross-lesson consistency: the concept registry

The source of truth is in git, `factory/registry/<app>.json`, and a compact projection is written to `profile/registry` for the in-page tutor:

```ts
interface Concept {
  id: string;                 // "fourier-transform", "radar-range-eq", "lanchester-square"
  names: { he: string; en: string };
  firstTaught: { app: "eng"|"core"; module: string; lesson: number; anchor: string };  // where the definition block lives
  definition: string;         // the exact definition block text (so later lessons quote, never re-define differently)
  notation: Record<string, string>;     // symbol → meaning, the course-wide convention
  firstNumber: string;        // the number from the first example (the memory section "כלים ומושגים")
  magnitudes: string[];       // the orders of magnitude to remember
  exampleLevel: number;       // 1 = familiar ground (gateway), … 5 = cross-field system case
  usedIn: { module: string; lesson: number; role: "teach"|"refresh"|"apply"|"connect" }[];
  openConnections: { field: string; module: string }[];  // from fieldmap; closed by a domain block
  learner: { state: "new"|"shaky"|"ok"|"strong"; evidence: string[]; due?: number };  // §3
}
```

Rules the Architect enforces mechanically:
- A concept with `firstTaught` is **referenced** (a `refresh` block if `learner.state ≠ strong`, else one line with a link), never taught twice.
- Notation is the registry's; a source's different notation gets a one-line bridge.
- **The example level rises**: a lesson's examples must have `exampleLevel ≥` the median of the concept's last three uses, plus one at P4+. This turns "rising level of examples and cross-domain connections" (CONTEXT.md) from a hope into a check.
- `openConnections` are closed when the course reaches the field, which the current 2,000-word memory blob can't track reliably (B_app_audit §1.9: it fills up within weeks).

The course memory the page sends (`profile.memory`) is **regenerated nightly from the registry** as a stable projection: current position, the last 15 lessons, concepts in a compact table, open connections and the learner's difficulties. It is never again a lossy full rewrite by a low-effort model.

### 2.3 Verification passes (what "verified" means)

| Pass | Method | Gate |
|---|---|---|
| **V1 Numbers** | Python extracts every number and formula in the Markdown (outside code), maps it to `facts.py` by display string and context, then recomputes. Orphan numbers (in the text, not in the ledger) are recomputed or justified. `pint` checks units. `sympy` checks key formulas: dimensional consistency, limiting cases (`limit` at 0 and ∞ as the text claims), and that rearrangements are algebraically equal. | 0 mismatches; orphans ≤ 3, each with a reason |
| **V2 Sources** | For every paragraph with `[[DOC:PAGE]]`, a fresh agent gets the paragraph and that page's text and answers *supported / not supported / contradicts*. For OCR'd docs (K1–K3) and any formula on a scanned page, it also gets the **page image** from `pdftoppm` and compares the formula visually. A wrong source becomes an `erratum` block. | 0 "contradicts"; unsupported ≤ 2, each fixed or tagged |
| **V3 Rules** | A deterministic linter (Python) plus an LLM rubric. Deterministic checks: `keep` block last; ≤ 6 `think`; every `\tag{n}` referenced; no "הספר אומר / המחבר כותב / כפי שמופיע במקור" (voice rule); in the gateway stage P0–P3 (Gilua) / P0 (Lanchester), every foreign term has `[[מונח: …]]` and every new central formula has a `fieldmap`; ≥ 2 `domain` blocks; each 2.5 tag present for the central results; all figures assigned. The LLM rubric covers rule 5א order (context → general definition → construction → separate example), 8א (by topic, not by page) and gateway examples drawn from familiar ground. | 0 errors |
| **V4 Render** | node: parse every fenced block; `JSON.parse` the JSON blocks; validate `scene3d` with `checkSpec` from `shared/scene3d/spec.ts`; evaluate every `chart`/`table`/`anim` expression with the page's own math.js (`evalExpr`); render all math with KaTeX; reject `svg` > 40 KB. The `app/tools/test` stub harness gives a full-page smoke render. | 0 errors |
| **V5 Density** | See §2.6. | per1k ≥ target, cut list applied |

**Calibrating the verifiers.** Once a week, the factory takes three lessons that already passed, plants 10 known errors in each (a wrong factor of 2, a swapped limit, a wrong unit, an unsupported historical claim, a misquoted source formula), runs V1–V4 and the reviewer blind, and logs the **recall per error type** in `factory/calibration.csv`. A verifier with recall under 80% on a type gets its brief changed. This gives the learner's "perfect precision" demand a measured number in place of a promise.

### 2.4 Figures, plots and simulations computed in Python

- **Plots**: matplotlib → SVG, simplified (fewer path points, `svg.fonttype: none`), ≤ 40 KB each and ≤ 3 per lesson inline in the existing ```` ```svg ```` block (DOMPurify-sanitized; `SvgBlock.tsx`). Larger ones go in a layer doc. Because they are computed, they are correct by construction and match `facts.py`.
- **Interactive charts**: the factory still prefers the page's live ```` ```chart ```` / ```` ```sim ```` blocks, which let the learner move parameters. It **pre-validates** them in V4 by evaluating the expressions over the parameter ranges and checking for NaN, divergence or flat lines. It also checks with Python that the curve shows what the text says, e.g. "the peak moves left as Q increases".
- **Notebook blocks**: the Python notebook the page offers on demand ("מחברת מעשית") is generated *and executed* by the factory. Every cell's output is checked and the expected outputs are stored in the keys doc.
- **Scene3d**: the specs are checked with `checkSpec`, and catalogue scenes are preferred (`SCENE_BY_ID`).

### 2.5 Answer keys, review items and depth layers

- **Keys**: every `think` and `exercise` gets a worked solution whose numbers come from Python output stored next to it (`ReadyKeys.check`). The page shows the solution only after the learner commits an answer (logged as an event), which fixes the passive-reading problem round 1 found.
- **Review items**: 8–12 per lesson, typed after the 2.5 sections (estimate / limit / trade-off / find-error / same-structure / operational meaning), each with a rubric so a small in-page model can grade consistently. They feed the spaced-review queue proposed in round 1 (FSRS in `profile/srs`). The factory writes them; the page schedules them.
- **Depth layers**: this answers "lessons are long without adding depth". The **core path** holds the argument, the definitions, the derivation skeletons, the numbers and the 2.5 sections. Optional layers hold full derivations of skeleton results, second worked cases, history, and extra domain connections. Depth is kept, and the learner chooses to open it. The `layer-open` and `rate` events tell the factory which layers he actually wants, so the core/layer split adapts.

### 2.6 Density instead of a word floor

Today the plan demands ≥ 4,200 words. Lessons came out at 8–15k words, and the learner says they are "over-long for nothing". The factory replaces the floor with **depth units**. Each paragraph is labelled by the V5 agent with one of: *definition, step, number, limit, trade-off, connection, critique, worked example, decision (think)*, or **none**. A paragraph labelled *none* is cut or merged. Targets (start values, tuned by `rate` events):

- core path: **≥ 12 depth units per 1,000 words**, **0 "none" paragraphs**, all seven 2.5 sections present for each central result;
- typical core length then lands at **5–8k words** instead of 8–15k, with 2–5k words in layers. No 2.5 content is cut; only repetition, recap and throat-clearing go.

The density report goes into `qa.density`, so the learner sees for each lesson how much was cut and why.

### 2.7 Overlap and dedup across the two apps

The two apps share no books, but they share concepts: the radar equation (Gilua fields/EM ↔ Lanchester radar), Kalman filtering (control ↔ tracking), detection theory (probability ↔ EW), orbital mechanics, optimization, queueing (OR). The factory reads both dbs and both syllabi and keeps one **cross-app registry**. When a concept was already taught in the other app, the lesson teaches only the **delta** (the operational meaning in Lanchester, the field-level derivation in Gilua) and links back with a one-line refresh. This is the "bridge" round 1 wanted (V2 §cross-app, R3 §3.5), but done at write time. **[measurement, not assumed]** In the first week the factory computes the actual overlap by building the registry for the next 30 modules of each app and counting concepts marked `teach` in both. The saving is reported, not promised.

---

## 3. Personalization still works, with a one-night lag

Each night, before building, the factory reads (dump from the backups, plus `events`):

| Signal | Where it is today | What the factory does |
|---|---|---|
| Clarify questions in lesson conversations | `convs/<cid>/msgs` (mode `clarify`) | An Opus pass classifies each question → concept + type (definition gap / step gap / magnitude / connection). The concept's `learner.state` becomes `shaky` with evidence |
| Exercise reveals, hints, solved | **localStorage only** (`solved.ts`) → events after change 4 | hint/solution before attempting → `shaky`; solved clean → `ok` |
| Review item grades | `events` (`item-grade`) | Updates the state; overdue items → `refresh` blocks in tomorrow's lessons |
| Quiz score and graded answers | `modules.quizScore`, the quiz conversation | Per-question mistakes → concept states; low scores → a re-teach layer |
| Margin notes ("שאלה למומחה", "להעמקה") | `profile/notes` | "להעמקה" → a depth layer written for the next lesson on that concept; "שאלה למומחה" → kept for the interview pipeline |
| Scratchpad "check the solution" | `profile/scratch` | Repeated errors of one type (units, factor 4π, peak vs mean) → an "error genome" entry (R5 #8) that the Architect targets |
| Summaries notebook | `profile/summaries` | Concepts missing from his summary → `shaky`; his notation preferences → registry notation |
| End-of-lesson rating | `events` (`rate`) | Tunes the density target and the core/layer split for him |

**How lessons adapt.** The Architect gets a `learner slice`: shaky concepts with their evidence, his last 10 questions, and the preferences. Rules: a shaky prerequisite gets a `refresh` block built around the specific mistake; a strong one gets one line; a question he asked becomes the opening `think`.

**The lag and how it is bounded.** A lesson built last night does not know today's mistakes. The horizon is therefore short (§5), and the night's first step **patches** shelved, unopened lessons whose prerequisites changed state. The patch is a refresh block inserted by a targeted edit and re-verified with V1/V3/V4 only, about 10% of a full build. Same-day needs ("I didn't get this step") are still served live by the clarify mode and Explain (Haiku) in the page, which are unchanged.

All read content (his messages, notes, summaries) is treated as **data, not instructions** in every brief.

---

## 4. The pipeline (pseudo-code)

```python
# Trigger "מפעל השיעורים": CRON_TZ=Asia/Jerusalem 7 0 * * *, create_new_session_on_fire, model claude-opus-5-5,
# permission Auto (or .claude/settings.json allow rules). The prompt is short; it points to factory/RUNBOOK.md on the dev branch.

def night():
    repo = clone("shavsss/repo-exercise"); checkout("factory")          # state, registry, reports, job dirs
    rules = {app: extract_system_prompt(f"{app}/app/src/prompt.ts") for app in ("eng", "core")}  # single source of truth
    for app in APPS:                                                       # eng, core
        idx = artifact_read(app.url, "lib/index.json")
        dump = artifact_data_list_all(app.url, "data/users/me", out_dir=f"/tmp/{app}")   # same as backup
        signals = parse_signals(dump)                                      # §3 table
        registry[app] = update_registry(registry[app], dump, signals)      # opened/done lessons → firstTaught/usedIn
        learner[app] = update_learner_model(learner[app], signals)         # Opus pass over new clarify turns
    xreg = merge_cross_app(registry)                                       # §2.7

    for app in APPS:
        patch_stale_shelf(app)            # refresh blocks for unopened lessons whose prerequisites changed (cheap)
        write_memory_projection(app)      # profile.memory from registry, with if_version

    queue = []
    for app in APPS:
        need = horizon(app) - shelf_ready(app)            # §5
        queue += next_lessons(app, need)                  # syllabus order, prereqs, current module first
        queue += [plan_module_job(m) for m in modules_without_plan(app, lookahead=1)]  # ModuleProgress.lessons via if_version

    run_jobs(queue[:FACTORY_MAX], lanes=K)               # K = 3–4 subagents, or one create_session per job
    write_status_doc(); commit_push("factory"); report_one_line()

def build_lesson(job):                                   # idempotent; resumes from job.state
    stage("fetch")    : pages = artifact_read_paths(job.app.url, job.docs); imgs = pdftoppm(job.pages_with_formulas)
    stage("analyse")  : outline, facts_py = Analyst(rules, spec, pages, imgs); run(facts_py) -> facts.json
    stage("plan")     : plan = Architect(rules, spec, outline, facts, registry_slice, learner_slice, reader_stage, depth_budget)
    stage("write")    : draft = Writer(rules, plan, pages, facts)               # parts to files, one context
    for round in 1..2:
        r = [V1_numbers(draft, facts_py), V2_sources(draft, pages, imgs), V3_rules(draft, stage),
             V4_render(draft), V5_density(draft), SeniorReviewer(draft, pages)]  # parallel, fresh contexts
        if gate(r): break
        draft = Reviser(draft, findings(r))
    else: return mark(job, "needs-live", report=r)
    stage("sidecars") : keys = Keys(draft, facts_py) ; items = Items(draft, registry_slice) ; layers = Layers(draft, plan)
                        verify(keys, by=python) ; V3_rules(items) ; V4_render(layers)
    stage("ship")     : docs = package(job, draft, plan, keys, items, layers, qa=r)   # each ≤ 230 KB, text ≤ 100k chars
                        artifact_data_batch(job.app.url, docs)                         # ≤ 50 writes, ≤ 1 MiB; ready + readyx
                        registry_add_pending(job)    # becomes firstTaught when the learner opens it (event "open")
                        commit(job.dir)              # provenance: outline, facts.py, reports, final md
```

`reader_stage` is computed with the same logic as `readerStage` in `tutor.ts` (Gilua gate P0–P3, Lanchester P0). The rules are extracted from `prompt.ts` at run time, so a rule change in the repo (always made in both `prompt.ts` and the `*_TEACHING_RULES.md`, per CLAUDE.md) reaches the factory the next night. Only factory-specific briefs (analyst, verifiers, reviewer) live in `factory/briefs/`.

---

## 5. Throughput, and what it does to the learner's day

**The demand** (syllabus.json, main-source pages): Gilua core 11,743 + adv 3,891; Lanchester core 4,668 + adv 2,125, i.e. **22,427 pages**. At ~15 pages per lesson (M0.1's actual split: 64 pages, 3+ lessons) that is **≈ 1,500 lessons** (≈ 1,040 Gilua, ≈ 450 Lanchester), plus ~110 for ref tiers.

**What a few months requires**: 1,500 lessons / 120 days = **12.5 lessons/day**. At today's 8–15k words that is 100–190k words a day, which is impossible to read. With the density gate (core 5–8k words) it is still 60–100k words a day. **No generation scheme fixes this**: it is the reading budget, and the trade-off has to be settled in the pacing and tier work of the other round-2 tracks (core-first, ref and parts of adv as layers or reference). The factory's job is never to be the bottleneck, and to cut waste per lesson (density, dedup).

**Factory capacity** **[assumption: 40–80 output tok/s per lane; probe 3 fixes the usage side]**:

| | Per lesson | 1 lane, 6 h | 4 lanes, 6 h |
|---|---|---|---|
| Wall time (analyse → ship, incl. 1 revision round) | 45–75 min | 5–8 lessons | 20–30 lessons |
| Usage | 1.5–2.5 U | 8–20 U | 30–75 U |

So **time is not the limit; usage is**. A practical setting: **6–10 lessons a night**, matched to his measured reading rate, with a shelf horizon of **1.5 days of consumption, at most 2 modules ahead per app**. A longer shelf wastes work when the learner model changes, or when he re-plans a module (R3's objection to pre-generation, answered by the short horizon plus patching).

**The learner's day, before and after**:

| | Today | With the factory |
|---|---|---|
| Wait per lesson | 10–25 min (one tab, can't close) | **0**: opens instantly |
| Wait for 5 lessons/day | 50–125 min, or interleaved reading of half-written parts | 0 |
| Failure modes during study | cut-off parts, `resumeLast`, refusals mid-lesson, `prompt_too_large` late in a lesson | they happen at night, to the factory; he gets a verified lesson or a "needs-live" marker |
| Daytime usage | ~1 U per lesson + clarify | clarify, grading, Explain only |
| What arrives with the lesson | text | text + QA badge + keys + 8–12 review items + layers + errata |

---

## 6. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Unattended ArtifactData writes blocked by permission prompts | Probe 1; Auto mode or committed allow rules; a factory that can't write just commits to git and reports |
| Session time limit / killed workers | Stage-level checkpoints in git; one job per worker session; resume next night |
| Usage cap exhausted (shared with daytime) | `FACTORY_MAX`, short horizon, usage line in `_status`; the page falls back to live writing |
| Opus refusal (Lanchester) | Probe 4; narrow briefs in engineering register; `needs-live` per job; no evasion; diag kept for the learner |
| Races with an open tab | The factory writes only `ready`/`readyx`/`_status`/`registry` + `profile.memory` (with `if_version`); the page owns convs and `done` |
| Staleness (built before today's mistakes) | 1.5-day horizon; nightly patching of shelved lessons; live clarify for same-day needs |
| Plan mismatch (he re-plans a module) | `specHash`; a mismatched ready lesson is ignored and superseded next night |
| Reviewer sycophancy / correlated errors (same model checks itself) | Separate contexts without the writer's reasoning; checkable rubric; deterministic Python/sympy/KaTeX checks wherever possible; weekly seeded-error recall test |
| Prompt injection via db content | All dumped content wrapped as data in briefs (as the backup prompts already say) |
| Two implementations drifting (page vs factory) | Rules extracted from `prompt.ts` at run time; the factory uses the page's own `checkSpec`, `evalExpr` and KaTeX in V4; one Markdown format |
| Doc over 256 KiB / page's 110k-char truncation | Core text ≤ 100k chars; SVG budget; layers and keys in separate docs; size check before ship |
| "Done = generated" coming back | Done only on the learner's "סיימתי" (plus items answered); the factory never marks done |
| A silent factory failure looks like progress | `_status` doc shown in the page (count ready, failed, last night); one-line nightly report; fall back automatically |
| Backup no longer a full restore | `export.mjs` learns `ready`, `readyx`, `events`, `registry`; the factory branch keeps all artifacts anyway |

---

## 7. Migration path (live generation always remains)

| Step | What | Size | Exit test |
|---|---|---|---|
| **0. Probes (one evening, interactive)** | Build one Gilua lesson by hand in a cloud session with the pipeline above; deliver it by **option A** (no page change). Then run the same thing as a one-shot scheduled task (`run_once_at`) to test unattended writes, run time and usage. Probe 4: one Lanchester EW lesson. | ~0 code | The lesson renders; no prompt blocked; time and usage logged; no refusal (or the refusal is understood) |
| **1. Page changes** | §1.4 changes 1–6, shared code in both apps; build and publish both | 200–300 lines | Open → materialize → done → events visible in the dump |
| **2. Factory v1, Gilua only** | 1 lane, analyse/plan/write + V1 + V3 + V4; horizon 1 day | `factory/` scripts + briefs | 7 nights, ≥ 90% `pass`, 0 render errors in the page |
| **3. Full verification + sidecars** | V2 with page images, V5 density, senior reviewer, keys, items, layers; registry and memory projection; Lanchester added | | Seeded-error recall ≥ 80% per type; his ratings of factory vs live lessons (A/B on alternate lessons for two weeks) |
| **4. Cross-app + adaptivity** | Cross-app registry and delta lessons; nightly patching; error genome; computed figures and validated sims | | Overlap measured; re-teach rate falls on shaky concepts |

The "כתוב עכשיו בזמן אמת" path stays permanently. It covers lessons outside the horizon, `needs-live` jobs, nights the factory did not run, and the learner's wish to watch a lesson being written.

---

## 8. What I'd test first, in order

1. **Unattended write** with a one-shot scheduled task: an ArtifactData `batch` of 3 docs into `profile/ready` on Gilua. (Decides Auto mode vs an allow-list.)
2. **One full factory lesson for Gilua M0.1 lesson 4** (or the next unwritten one): measure wall time and the output tokens per stage, count V1 orphans/mismatches, and compare word count and depth units against G1–G3 (C_lesson_critique).
3. **The same for one Lanchester EW lesson**, the refusal probe.
4. **Seeded-error recall** on that lesson: 10 planted errors. This tells the learner, with a number, how much "verified" is worth.
