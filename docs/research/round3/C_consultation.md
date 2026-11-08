# C_consultation: one in-lesson consultation system for Gilua and Lanchester

Round 3, track C. This file is the main report.
- Experiment: `C_experiment.md`
- Numbers: `C_numbers.py`
- Word counts: `C_count.py`, `C_measure.py`

Everything here is read-only with respect to the repo.

## 0. The answer in brief

**Why the answers are huge.** The main chat's "clarify" call is a lesson call wearing a different label. The tutor gets the whole lesson rulebook, which is "binding for every message". It gets the instruction "answer with full depth (derivations, examples, a figure or a scene)". It gets the 10–15k-word lesson itself as the previous turn to imitate, Opus at effort "high", and up to 4 automatic continuations. Nothing in the call tells it the question is small, and nothing tells it where in the lesson the question is.

**Why the side panel is weak.** It is the opposite failure. Haiku is held to a fixed template of 120–220 words ("מושגים / הרעיון / דוגמה") in a "simple, warm friend" voice. It has no tools, so no compute and no library. It gets the course memory cut from the front, no learner preferences and no notebook. Its page tags do not work, it has no way to hand off to the real tutor, and nothing it says is kept.

**Replacement.** One consultation system with these parts:
1. A router and a **taxonomy of 11 question types**, each with a shape and a length budget (20–450 words at L1).
2. **Anchoring** to the selected text or paragraph, with answers shown as cards next to that paragraph.
3. A **depth ladder L1 → L2 → L3**. Nothing important is cut: corrections, errors and dangers are always said, and every deferred item becomes a named chip that leads to full depth.
4. Opus for every real answer, with effort set by type. Haiku only routes and defines glossary terms, under a guard.
5. A **compact context**: the anchor, an equation index, the outline, the memory, the learner's preferences, the full notebook item that is being discussed, and the thread. The 27 lesson rules are not sent.
6. Every consultation is **logged into the learner model**.

**Result.** Run on the 7 real turns, the new design gives 18% of the words: 1,761 against 9,528. It answers in the first line in every case, against 3 of 7 now. It keeps 100% of the content reachable through chips, and it fixes one real failure: R7 ignored his request for "a definition without an example".

---

## 1. Diagnosis from the code

### 1.1 Main chat, "שאלת הבהרה" (clarify) and "חופשי" (free)

**(a) The call is a lesson call.** `askTutor` (`eng/app/src/tutor.ts:400-415`) builds the same input as a lesson part:
- The first turn is the full `SYSTEM_PROMPT` (`fitHistory`, `tutor.ts:203`).
- The last turn is the full `studyContext`: the module block, the reader stage, the whole lesson plan, the memory, the notebook and the rest of the notebook (`tutor.ts:404`).
- Model and effort are the same as for a lesson: `model: MODEL` (Opus), `modelTier: "complex"`, and `effort`, which comes from the shared selector with default `"high"` (`App.tsx:96`: `usePersisted<Effort>("eng-lab:effort", "high")`).

**(b) The rules in the prompt push toward length and the lesson's scaffolding.** All quotes are from `eng/app/src/prompt.ts`:
- l.54: `These are the learner's own requirements. They are binding for every message; the depth bar never drops over a long conversation.` The rules apply to clarify answers too.
- l.73 (rule 10): `כל שבע התגיות מופיעות בכל שיעור…` The real Lagrange answer (R7) carries all seven `[[2.5:…]]` tags (`C_measure.py`: 2.5tags=7). Its structure (refresh, derivation, scene3d, think, 2 domains, fieldmap, limits, critique) is a lesson's structure.
- l.76 (rule 13): `שני בלוקי domain מלאים בכל שיעור`. R1 and R7 each have 2 domain blocks.
- l.92 (rule 20א): the rule to save to the notebook and to point to existing items. Every long answer ends with "מה שמרתי במחברת", which adds 60–120 words and gets a later turn spent on "could not verify" (R4).
- l.101 (rule 22): `רף אורך: … לפחות כ-4000 מילים.` This is the only length number in the whole prompt, and it is a minimum.
- l.151: `Write long, connected paragraphs; lists only where the content is a list.`
- **l.156**: `- "clarify" (שאלת הבהרה): answer with full depth (derivations, examples, a figure or a scene when it helps) but without the lesson scaffolding.` The one line that defines clarify asks for full depth. It gives no length, no "answer first", and no "only what was asked".
- `free` (l.158): `follow the learner's request, keeping the quality rules`, which means all of the above.

**(c) The model imitates the lesson that came just before.** `fitHistory` (`tutor.ts:187-205`) sends the history from the newest turn backwards, up to `INPUT_BUDGET = 190_000` bytes (l.18). The assistant turn just before a question is the lesson (8–15k words), or a previous 2,000-word answer. That is the strongest style signal in the input. The real answers grow along the thread: 1705 → 1205 → 1171 → 1079 → 2177 → 2002.

**(d) Truncation is treated as a reason to continue.** `App.tsx:390`: `for (let part = 1; (res === null || res.truncated) && part <= MAX_PARTS; part++)` with `MAX_PARTS = 4` (l.30). A clarify answer that hits the output cap is continued automatically, up to 5× the cap.

**(e) No anchor.** A question typed in the composer carries no location. The quick action `"הסבר שוב, לאט יותר"` sends `"החלק האחרון היה מהיר מדי בשבילי…"` (`App.tsx:551`). "The last part" of a 12k-word lesson is undefined, so the model covers everything.

**(f) The notes he points to cannot be seen properly.**
- `studyContext` sends notebook items cut to 600 characters (`tutor.ts:167`: `n.text.replace(/\s+/g, " ").slice(0, 600)`). The article item that the tutor kept appending to becomes invisible after the first points. That is why R4 says "מתוך השיחה הזו לא יכולתי לוודא שהיא באמת נשמרה".
- Margin notes (`margin: true`, with an `anchor` quote, `types.ts:71-72`) are sent **without their anchor**. So for "תתייחס לפתקים שלי" (R8) the tutor does not know which paragraph each note sits beside. It answers all four notes in one 2,002-word wall at the bottom of the conversation.
- There is no tool to edit a saved note, so a typo the tutor itself made ("1 קמ"ש") has to be fixed by hand.

**(g) Nothing is learned from the questions.** `updateMemory` runs only `if (sendMode === "lesson" || (sendMode === "quiz" && score))` (`App.tsx:431`). The learner model never sees what he asked, misunderstood or corrected.

**(h) Where the answer lands.** The answer is appended to the end of the lesson's scroll as a new `AssistantTurn` (`App.tsx:655-670`). A question about paragraph 14 is answered 10,000 words below paragraph 14, in a block as large as a lesson part. The reading position is lost.

**(i) An empty turn is lost.** R5 is a 23-word question that got a 0-word answer, and the learner retyped it as 71 words. A refusal leaves `text: ""` (`App.tsx:410`), and nothing retries.

### 1.2 Side panel "הסבר פשוט" (`eng/app/src/components/Explain.tsx`, identical in Lanchester)

| Line | What it does | Effect |
|---|---|---|
| 12, 153 | `EXPLAIN_MODEL = "claude-haiku-5-5"`, `modelTier: "quick", effort: "low"` | The weakest model for the hardest audience: a learner at "authority" level asking about Lagrange, supervaluation and level-2.5 critique. |
| 20 | `כמו חבר שמבין בחומר… בעברית פשוטה וחמה` | The goal is set to "simple and warm". He needs "short and exact". |
| 25-28 | A fixed template: `**מושגים:** … **הרעיון בפשטות:** … **דוגמה קטנה:** דוגמה מספרית אחת` | Every selection gets terms, an idea and a numeric example, even a derivation step or a claim he disputes. This contradicts his stated preference for a general definition before any example (rules 5א/6א, and R7 "ללא הדוגמא"). |
| 153 | No `tools` | No compute, so the "small numeric example" is unverified. No `read_source_pages`. It cannot check anything. |
| 146 | `memory.slice(0, MEMORY_CHARS)` with 6,000 characters **from the front** | The memory's last section, `## קשיים, שאלות פתוחות והעדפות`, which holds his preferences, is the part that gets cut. |
| 15, 77 | Only the current section, up to 12k characters | A reference to "(2)" from another section, or "as in lesson 1", cannot be resolved. There is no equation index. |
| 18 | `KEEP_TURNS = 4` | Acceptable. |
| 22 | `…הצע לשאול את המורה בצאט הראשי` | No handoff button. He has to retype the question in the other box, where it gets the opposite failure. |
| 223 | `openSource: () => {}` | `[[DOC:PAGE]]` tags in its answers do nothing. |
| 98-104, 215 | `השיחה נמחקת כשעוברים שיעור ולא נשמרת` | Nothing feeds the memory, the notebook or review. |
| 121 | Selection up to 3,000 characters | A long selection is silently ignored (the chip does not appear). |

**The two places are disconnected.** The panel does not know what the main chat said, and the main chat does not know what the panel said. Each one has one failure mode built in, the wall in one and the shallow answer in the other. The learner has to guess which one fits his question before he asks.

### 1.3 Measured on the real turns (`C_measure.py`)

| # | Question (words) | Answer (words) | Ratio | Reading min (180 wpm) | ## headings | Blocks |
|---|---|---|---|---|---|---|
| 1 | 10 | 1705 | 170× | 9.5 | 5 | 7 (mermaid, formula, 2 domain, table, casestudy, think) |
| 2 | 569 | 1205 | 2× | 6.7 | 5 | 4 |
| 3 | 16 | 1171 | 73× | 6.5 | 4 | 1 |
| 4 | 8 | 189 | 24× | 1.1 | 0 | 0 |
| 5 | 23 | **0** | — | — | — | failed |
| 6 | 71 | 1079 | 15× | 6.0 | 5 | 2 |
| 7 | 16 | 2177 | 136× | 12.1 | 9 | 8 (incl. scene3d, fieldmap, 2 domain) |
| 8 | 3 | 2002 | 667× | 11.1 | 5 | 5 |

The answers are *good*: they are accurate, computed and insightful. The failure is in the shape: 6–12 minutes of reading, at the bottom of the page, before he can return to the paragraph he was in.

---

## 2. What research and practice say

Certainty is marked where I rely on memory and not on a source fetched in this session.

1. **Brief and stepwise, on purpose.**
   - Kestin et al., *Scientific Reports* 2025 (Harvard PS2): the AI tutor beat in-class active learning, with roughly double the learning gains, in less time (49 vs 60 min). Its system prompt says: "Keep responses BRIEF (a few sentences or less) but helpful" and "Only give away ONE STEP AT A TIME, DO NOT give away the full solution in a single message". Accuracy came from pre-written step-by-step solutions placed in the prompt (Gary Liang's summary of the paper; Harvard Gazette).
   - Lesson for this app: accuracy comes from grounding (here, the lesson and compute). Length is a design choice, and the effective tutor kept it short.
2. **Guardrails matter more than raw power.** Bastani et al., *PNAS* 2025: ~1,000 high-school students. Unrestricted GPT-4 ("GPT Base") improved practice by 48% but lowered the exam by 17%. "GPT Tutor" had the solutions and common mistakes in its prompt and gave incremental hints, and it removed the harm. Free answers act as a crutch, and short hint-shaped help that keeps the learner working does not.
3. **LearnLM principles** (Google 2024): inspire active learning, **manage cognitive load (segment into manageable chunks)**, adapt to the learner, stimulate curiosity, deepen metacognition. Commentators note that LLMs default to long answers "not ideal in multi-turn tutoring", and that learners can pull the tutor away from good teaching because the model tends to please.
4. **ChatGPT study mode and Claude learning mode** (2025): guiding questions, checking what the learner knows, Socratic prompts ("How would you approach this?"). OpenAI's help center admits it still sometimes answers directly. Both are global modes, not type-sensitive. This design is type-sensitive: Socratic only where it helps, direct where he asks for a fact or a definition.
5. **Human tutors** (from memory, certainty high on the direction of each finding):
   - Graesser, Person & Magliano (1995): tutoring dialogue is short turns in a 5-step frame, and feedback is brief.
   - Chi et al. (2001): learning tracks the student's *constructive* turns more than the length of the tutor's explanations. Tutors who explain less and prompt more do as well or better.
   - VanLehn (2011): step-level interactive tutoring reaches d≈0.76, near human tutoring at d≈0.79 ("interaction granularity").
   - Wittwer & Renkl (2008), "Why instructional explanations often do not work": explanations must be adapted to prior knowledge, focused on principles, and integrated into the learner's ongoing activity.
   - Shute (2008) on formative feedback: elaborated but in manageable units, specific, "as simple as possible but no simpler".
   - Kalyuga's **expertise-reversal effect**: material that helps novices (a worked example, redundant explanation) *hurts* learners who already know it. This learner is expert in the military-analysis parts of his own questions (R1–R6), so walls on his own ideas are expertise-reversal territory.
   - Mayer's **coherence** and **segmenting** principles (multimedia learning): drop what is not needed, and let the learner pace the segments.
6. **Question taxonomies** (Graesser & Person 1994, 18 categories; certainty medium on the exact count): definition, example, comparison, interpretation, causal antecedent, consequence, procedural, enablement, judgmental, verification, and so on. Different question types need different answer shapes. This is the basis for the taxonomy in §3.

**Implications for this learner.**
- Answer first, then the minimum, then let him pull depth. Depth is preserved because every deferred item stays one click away, and the "full critique" path still produces the long answer when he wants it for an article.
- Ask him back only where a single step is within reach. Never hold back a direct answer from an adult who asked for one.
- Ground every answer in the paragraph and the lesson's own symbols.

---

## 3. Design: one consultation system ("שאלה על השיעור")

### 3.1 Question types: shape, budget, model

| Type | Typical words | Shape at L1 (in this order) | L1 budget | Opus effort | think at the end? | Typical chips |
|---|---|---|---|---|---|---|
| `term` (מה זה X, X is a `[[מונח]]` or in the glossary) | "מה זה עקבה" | 1–2 lines of definition | 20–60 | **Haiku**, guarded (§3.4) | no | "הגדרה מלאה", "איפה בשיעור" |
| `define` (a concept, formally) | "הגדרה ללא דוגמה" | `definition` block (general symbols, conditions, necessary or sufficient) → idea in one sentence → what each part does → no example unless asked | 80–220 | medium | yes, on a condition of the definition | "למה זה נכון", "דוגמה", "במילים אחרות", "גבולות" |
| `why` (a step, a claim) | "למה הטבלה שלמה" | the reason in the first sentence → the chain of 2–5 steps → where the assumption enters | 60–200 | medium | yes, if one step is within his reach | "גזור במלואה", "מה נשבר בלי ההנחה" |
| `example` | "תן דוגמה" | one computed example in the lesson's symbols → what it shows | 60–200 | medium | "נסה לבד" variant | "דוגמה קשה יותר", "מקרה קצה" |
| `connect` (to X / earlier / the world) | "זה קשור ל…?" | yes/no/partly → the one mapping (what corresponds to what) → where it breaks | 100–250 | medium | optional | the other connections, one chip each |
| `check` (here is my understanding) | "אז אם הבנתי…" | **verdict ✓/◐/✗** → the exact faulty or missing point → the correct statement | 40–150 | medium | yes (a discriminating question) | "למה זה חשוב", "עוד בדיקה" |
| `disagree` | "אני לא מסכים" | where he is right and the exact point of disagreement (sentence 1) → computed checks → concession or correction → the crux as a question | 150–450 | **high** | yes, unless he was simply right | the side issues, "שמור כתיקון" |
| `idea` (develop or assess his idea) | the Newton analogy | verdict on novelty or soundness → what exists (names, years) → where it breaks → the best version of his idea → one falsifiable form | 250–450 | high | a question back | "ביקורת מלאה למאמר" (L3), "ספרות", "מודל" |
| `judge` (is it trivial, is it worth it, which is better) | "יש פה עניין אמיתי?" | verdict with certainty → why in 3–5 lines → dangers (must-say) → a choice for him | 200–400 | high | a choice question | "טבלה מלאה", "מונחי חיפוש", L3 |
| `notes` (respond to my notes) | "תתייחס לפתקים שלי" | **one card per note**, anchored beside it; each card: verdict or correction → one sharpening → one tool from the lesson | 100–200 per note | high | at most 1 per card | per card |
| `save` / `edit-note` | "תרשום את זה" | the confirmation in one line, plus the saved text (shown from the tool result) | ≤ 40 | low (or a direct tool call) | no | "בטל", "ערוך" |
| `meta` (about the course, notes, what next) | "על מה לחזור?" | the answer as a list of 1–3 items | ≤ 100 | low | no | "בחן אותי עכשיו" |
| `derive` / `deeper` (escalation, L2) | the chip "גזור במלואה" | full derivation (each step and its reason, assumptions, result), then structure, limits and a critique line | ≤ 700 | high | optional | the next deferred items |
| L3 "ביקורת מלאה" / "לעומק השיעור" | an explicit chip | lesson-grade treatment of this point: the seven 2.5 sections, blocks, scene3d | ≤ 2,000 | high | yes | — |

**One rule decides what goes into L1 (the "must-say" rule).** L1 always contains:
- the direct answer;
- every error in his claim or in the lesson text that the question touches;
- every danger to the decision he is making (for an article: a reviewer's fatal objection);
- any correction of something the tutor said before.

Only *elaboration* is deferred: derivations, extra examples, connections, history, visuals, the world today. That is how the length drops while nothing important is lost.

**Deferred is not deleted.** The model writes `<!--deferred: item1; item2; …-->` (hidden) and the chips `<<עוד: …>>`. A chip call receives the deferred list and the previous answer, and continues without repeating. Following every chip of R7 gives about 2,300 words, which is the full real answer, in his order (C_experiment R7 coverage map).

### 3.2 Anchoring

- **Selection → mini toolbar** above the selection: `מה זה?` (term/define) · `למה?` · `דוגמה` · `בדוק אותי` · `לא מסכים` · `שאל…` · `פתק`. Each button **fixes the type**, so no router call is needed, and starts the call.
- **A question with no selection** (composer or panel) is anchored to the paragraph at the top of the viewport. `noteAnchorHere()` already does this for margin notes (`App.tsx:698`). The anchor is shown in the composer as a removable chip ("על: «…הטבלה שלמה…»"), so he sees what the tutor will see.
- **Notes**: "התייחס לפתקים שלי" sends each margin note **with its anchor quote and its paragraph**. The reply comes back as `=== פתק n ===` sections, and the UI attaches each one to its note.
- **Where the answer appears**:
  - L1 answers and per-note cards appear **inline, under the anchored paragraph**, as a collapsible card. The lesson does not move.
  - L2/L3 answers (or any card the learner pops out) open in the **side panel**, which keeps the thread.
  - A small marker in the margin (a count badge) stays on the paragraph, so the thread can be reopened later.
- **Equation index**: when the consult call is built, the app extracts every `\tag{n}` display equation of the lesson with its number (a regex over the stored lesson text). That way "(2)" in a question or answer always resolves, even across sections.

### 3.3 Escalation ladder

| Level | What | Trigger | Budget |
|---|---|---|---|
| L0 | the answer line only (shown as the collapsed card title) | automatic | 1 sentence |
| L1 | the type-shaped answer (§3.1) | the question | 20–450 |
| L2 | full depth on *one* deferred point: derivation, limits, computed numbers | a chip, or "עמוק יותר" | ≤ 700 |
| L3 | lesson-grade treatment of the point, or the full article-grade critique | the chip "לעומק השיעור" / "ביקורת מלאה למאמר" | ≤ 2,000 |

The chips are generated from the deferred list. These four are always present:
- "עמוק יותר": goes to the next level on the same point.
- "במילים אחרות": the same level, a different route (geometric, algebraic, physical).
- "שמור".
- "פתח בצד".

### 3.4 Models and quality guards

- **Opus for every answer of type define … L3.** The learner's questions are exactly where a weak model fails (R2, R3 and R6 are research-level). Speed comes from effort and budget, not from a smaller model. A 150-word Opus answer at effort low or medium streams its first line in a few seconds; this is a design estimate, not measured here.
- **Haiku has two jobs only**:
  1. **Router** for free text, outputting `{type, needs_anchor, confidence}`. Below confidence 0.75 the default is `why` on Opus. The Opus prompt carries the taxonomy anyway and may reclassify (it writes `<!--type: …-->`).
  2. **`term`**, only when the term is a `[[מונח]]` tag of this lesson or appears in the memory's tools list. Haiku gets the tag's own definition and the memory line and must answer from them. It returns the literal `ESCALATE` if they are not enough, and then Opus answers. Every Haiku card has "תשובה מלאה" one tap away.
- **Length governor** (client side, since `sample` has no max-tokens option here, `runtime.ts:24-33`):
  - the type budget is written into the prompt;
  - while streaming, if the text passes 1.8× the budget at L1, the app stops the stream at the next paragraph end and adds "המשך ▸". This cuts nothing: it continues the same answer;
  - no automatic `MAX_PARTS` continuation for consult calls below L3.
- **BLUF check**: if the first 25 words contain "שאלה מצוינת", restate the question, or announce a plan ("אתייחס ל…"), the app logs it for prompt tuning. The prompt also forbids it.
- **Truthfulness about actions**: "שמרתי" is never written by the model. The app shows the tool result ("נשמר ב-…") under the card. Prompt rule 7 stays.
- **Failure handling**: an empty or refused stream is retried once automatically with the same input, without the notebook. If it fails again, the card shows "התשובה לא הגיעה. נסה שוב / שלח למורה ברמה מלאה", and **the question text stays in the box** (fixes R5).

### 3.5 Context per call: what is sent and what is not

**Sent** (about 6–20k tokens, against up to 190 KB now):

| Block | Content | Size |
|---|---|---|
| `CONSULT_CORE` | the v2 prompt (§7) | about 900 words |
| `<learner>` | a fixed profile and the memory's "קשיים / העדפות" section **in full** | ≤ 400 words |
| `<anchor>` | the selected text, its whole paragraph, the section heading, and the previous paragraph | ≤ 3k chars |
| `<equations>` | the lesson's tagged equations: `(n) latex`, plus the keep block | ≤ 3k chars |
| `<outline>` | the lesson headings, the module and lesson title, the module plan titles only | ≤ 1k chars |
| `<course_memory>` | the full memory (already capped at ~2,000 words by `updateMemory`) | ≤ 2k words |
| `<notebook_item>` | for `notes`, `save`, `idea`: the referenced items **in full**, and margin notes **with anchors** | as needed |
| `<thread>` | this consultation thread: the last 6 turns, consult turns only | ≤ 3k words |
| `<deferred>` | on escalation: the deferred list and the answer being extended | — |
| tools | `compute`, `read_lesson_section(heading)` (new: returns a lesson section's text), `read_source_pages`, `search_library`, `save_lesson_note`, **`edit_lesson_note`** (new: fix or append to an item) | — |

**Not sent:**
- the 27 lesson rules;
- the lesson rendering protocol beyond the 8 blocks a consult may use;
- the length bar;
- the whole lesson as an assistant turn;
- the module's source pages (the tutor reads them with the tool when it needs to);
- `<reader_stage>` beyond one line;
- the long `<notebook>` of other modules, unless the type is `idea`, `judge` or `notes`.

The lesson text is reached only through `read_lesson_section` or at L3.

### 3.6 How consultations feed the learner model and notes

- **Every consultation is stored** as `profile/consult/<module>__<lesson>/<id>`, with these fields:
  - `{anchor, type, q, answer, level_reached, chips_opened, verdict?, misconception?, learner_was_right?, saved_note_id?, ts}`.
  - The verdict comes from the `check` type (✓/◐/✗), and the misconception is a one-line tag the model writes in a hidden comment, `<!--misconception: …-->`.
- **The learner model is updated nightly** by the cloud session that already runs backups, or after each thread in the page with a quick model call. It merges into `## קשיים, שאלות פתוחות והעדפות` in the memory:
  - recurring confusions ("עקבה לא תלויה בבסיס — שאל פעמיים");
  - corrections he made to the tutor (R2: "the epistemic vs semantic distinction; tutor conceded");
  - preferences shown by behaviour (he opens "גזור" 80% of the time, so raise the L1 depth for `why`).
- **Misconceptions become review items**: each `◐/✗` creates a spaced-review card (the same check question, a few days later). This connects to the retention design of round 2 (`P_retention_practice.md`).
- **Notes**:
  - saving happens only on request or by a "שמור" chip, never on the model's own initiative;
  - the tool result is shown;
  - `edit_lesson_note` lets the tutor fix its own slips;
  - the full text of the item is sent when it is referenced, so the tutor can see what it already appended.
- **Lesson errata**: a `disagree` the learner wins and that touches the lesson text is saved as `profile/consult/…/erratum`. The next generation of that lesson, or a nightly job, includes the fix.

### 3.7 What this replaces in the code (implementation map)

| File | Change |
|---|---|
| `src/components/Explain.tsx` | Becomes `Consult.tsx`. Same selection detection (`textOf`, `sectionAt`), new toolbar, inline cards, side-panel thread, Opus by type, the tools above. `EXCERPT`/`CHAT` are replaced by the v2 prompts. |
| `src/tutor.ts` | New `askConsult({type, level, anchor, equations, outline, memory, learner, notebookItems, thread, deferred})`. It does **not** call `fitHistory(history…)` with the lesson. `askTutor` stays for `lesson`/`quiz`. Add the tools `read_lesson_section` and `edit_lesson_note`. |
| `src/prompt.ts` | Remove `clarify`/`free` from `<message_types>`, add `CONSULT_CORE` and the type shapes (and the same in `core/app/src/prompt.ts`; docs `ENG_TEACHING_RULES.md` / `CORE_TEACHING_RULES.md`: a new section "התייעצות"). |
| `src/App.tsx` | The composer under a lesson sends to `askConsult`, anchored to the viewport paragraph. The quick actions ("הסבר שוב, לאט יותר", "גזור במלואה", …) become anchored chips. "עוד תרגילים", "מחברת מעשית" and "בתלת-ממד" stay lesson-level calls with their own explicit budgets. The `MAX_PARTS` loop applies only to lesson/L3. `updateMemory` is not called per consult; the consult log is merged nightly. |
| `Message.tsx` / CSS | Inline consult card component, margin count badges, collapsed-by-default notes cards. |

Both labs share these files (`Explain.tsx` is already identical), so one implementation serves both.

---

## 4. Details that matter

4.1 **Socratic vs direct, by type.**
- Direct: `term`, `define`, `save`, `meta`, `judge` (he asked for a verdict).
- Direct, then one think: `why`, `example`, `connect`, `disagree`.
- Socratic first: only `check`, where the verdict is given and then *he* fixes the faulty step with a nudge, plus explicit "נסה לבד" chips.
- The tutor never answers a direct question with a question. This follows Kestin's "brief, one step" and Bastani's hints only where practice is the point, without the frustration of withholding from an adult expert.

4.2 **The think block as the activity unit.** It already exists in the renderer (the hidden answer) and costs one line. Used at most once per two answers in a thread, it keeps him active without slowing a reader who just wants the answer.

4.3 **"Simple" is not the goal; "exact and short" is.** The old panel's "עברית פשוטה וחמה" voice is dropped. The voice is the tutor's own (the authors'), in second person in a dialogue, with no warmth padding, because that is what he asked for (rule 20: no long apologies).

4.4 **Article work is legitimate length.** For `idea` and `judge`, L1 is 250–450 words, and "ביקורת מלאה למאמר" (L3, ≤ 2,000) is offered on every such answer. The old long answers were valuable *as* this product. The design keeps them one click away, not as the default reply to "תרשום את זה".

4.5 **Per-note cards.** "תתייחס לפתקים שלי" covers N notes and produces N cards, each anchored beside its note in the margin, collapsed to its first line except the first one. A correction is always that first line.

4.6 **Cost.** The current clarify sends up to 190 KB of input, at effort high, plus up to 4 continuations. The new L1 sends about 25–60 KB, at effort low, medium or high by type, with no continuations. Fewer tokens per question means faster first lines. This is estimated from the context sizes, not measured.

4.7 **Save without a model call.** The "שמור" chip on a card can call `save_lesson_note` directly with the card's L0 line and its key sentences, so no model call is needed. A model call (effort low) is needed only for "שמור את הסיכום שהצגת" when the save must compose text.

4.8 **Guard against drift in a long thread.** The thread passed to the model holds consult turns only, which are short, so the snowball in §1.1(c) cannot start.

4.9 **Errors and refusals.** These are handled as described in §3.4: one automatic retry, then a visible card with the question kept in the box.

---

## 5. UI sketches

### 5.1 Desktop (RTL, three columns: dock on the left, lesson in the middle, consult panel on the right when open)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [Aa] M0.1 · 2/3  גאומטריה, מדידה והמספר הממשי                       ▓▓▓▓▓░░░ 42%  [?] │
├──────────────┬───────────────────────────────────────────────────┬─────────────────────┤
│ תוכן | מחברת │  ...סיבוב שמחזיר את הסריג לעצמו שולח כל הזזה       │  שאלות על השיעור  ×  │
│ (dock, closed│  של הסריג להזזה אחרת שלו, ולכן ┌──────────────┐   │ ─────────────────── │
│  by default) │  ░░בבסיס של הסריג הוא טבלה של ░│מה זה? למה?   │   │ ① «...הטבלה שלמה»   │
│              │  ░░מספרים שלמים░░, והעקבה שלה  │דוגמה בדוק אותי│   │   למה? · L1 · ✓     │
│              │  שלמה.                          │לא מסכים שאל…│   │ ② «(2) ≈ 1/(2√2q²)» │
│              │                                 └──────────────┘   │   למה? · L1          │
│              │  ┌─ למה? ───────────────────────────────── ▾ ⧉ ┐ │ ③ פתקים (4)          │
│              │  │ כי הסיבוב מחזיר את הסריג לעצמו. נבחר בסיס   │ │   ▸ פתק 2: תיקון…    │
│              │  │ ‎e1,e2,e3 ... העקבה סכום של שלמים...       │ │                      │
│              │  │ ▸ חשוב לבד: מה 2cosθ לסדר 8?               │ │ [L2 answers open     │
│              │  │ [למה העקבה לא תלויה בבסיס] [ההוכחה         │ │  here, full width    │
│              │  │  הגאומטרית] [עמוק יותר] [שמור] [פתח בצד]  │ │  of the panel]       │
│              │  └─────────────────────────────────────────────┘ │                      │
│              │  ²  ← margin badge: 2 consultations on this ¶     │                      │
│              │  ...הנימוק בצעד אחד: ...                           │ ─────────────────── │
│              │                                                    │ [על: «…»×] שאל…  ⏎  │
├──────────────┴───────────────────────────────────────────────────┴─────────────────────┤
│  [על: הפסקה שבראש המסך ×]  שאלה על השיעור…                        [📎] [⏎]   ריכוז פתק │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

- A selection shows the floating toolbar. Each button starts an anchored card under the paragraph.
- The card is collapsible. When collapsed, its title is the L0 line: "למה? כי הסיבוב מחזיר את הסריג לעצמו".
- ⧉ moves the card to the side panel. L2/L3 answers open there by default, and the inline card then shows the L0 line and "נפתח בצד".
- The margin badge reopens the thread. The panel lists every consultation of this lesson, grouped by anchor, with the type, the level reached and the verdict.
- The bottom composer replaces "שאלת הבהרה / חופשי". It carries an anchor chip (the viewport paragraph) that can be removed or changed by selecting text. The effort selector moves into settings, because effort is set per type.
- Notes: "תתייחס לפתקים שלי" (a button in the dock's notebook tab, or typed) gives cards attached to each margin note. They are collapsed to their verdict line, except the first.

### 5.2 Phone

```
┌──────────────────────────┐        ┌──────────────────────────┐
│ M0.1 · 2/3   ▓▓▓░ 42%  ≡ │        │ ▁▁▁ (drag handle)         │
│                          │        │ למה? «...הטבלה שלמה»   ×  │
│ ...ולכן בבסיס של הסריג   │        │──────────────────────────│
│ ░הוא טבלה של שלמים░,     │  tap   │ כי הסיבוב מחזיר את הסריג │
│ והעקבה שלה שלמה.      ²  │ ─────▶ │ לעצמו. נבחר בסיס...      │
│                          │ (long- │                          │
│ ┌──────────────────────┐ │  press │ ▸ חשוב לבד: 2cosθ לסדר 8? │
│ │ מה זה · למה · דוגמה  │ │  ¶ or  │                          │
│ │ בדוק אותי · שאל…     │ │ select)│ [עמוק יותר][דוגמה][עוד ▾]│
│ └──────────────────────┘ │        │──────────────────────────│
│                          │        │ שאלת המשך…           ⏎   │
│ [שאל על הפסקה הזו…]  ⏎   │        └──────────────────────────┘
└──────────────────────────┘          bottom sheet: 45% height,
                                     drag up to full screen (L2/L3)
```

- **Long-press on a paragraph**, or a text selection, opens a 2-row action sheet with the same buttons. The native selection menu is too limited to rely on.
- **Answers appear in a bottom sheet** at 45% height, with the anchored paragraph still visible and highlighted above it. Dragging up gives full screen, which L2/L3 use automatically.
- **Chips sit in one scrollable row**: "עוד ▾" holds the rest, and "שמור" sits first in it.
- **Notes cards** form a horizontal pager inside the sheet: "פתק 1/4 ‹ ›", with the verdict line big and the body below it.
- **The margin badge** becomes a small number at the end of the paragraph, the same pattern as margin notes on narrow screens (`MarginNotes.tsx`).

---

## 6. Prompts v1 (Hebrew; used in the experiment)

```text
CONSULT_CORE (v1)
אתה המורה שכתב את השיעור. הלומד עצר באמצע הקריאה ושואל אותך. זו התייעצות, לא שיעור: אחרי התשובה הוא חוזר לפסקה.

הלומד: מבוגר, עברית, רקע חזק במערכות צבאיות ובניתוח; בונה עכשיו מתמטיקה ופיזיקה; כותב מאמרים ומראיין מומחים ורוצה להיות סמכות. מעדיף הגדרה מתמטית כללית לפני דוגמה. לא צריך עידוד; צריך דיוק.

1. המשפט הראשון עונה. לא חוזרים על השאלה, לא "שאלה טובה", לא הודעה על מה שיבוא.
2. התשובה המינימלית שמספיקה כדי להמשיך לקרוא בהבנה מלאה של הנקודה ששאל, באורך של סוג השאלה (<shape>). לא מוסיפים נושאים שלא נשאלו.
3. עומק נדחה, לא נחתך: כל מה שחשוב ולא נכנס עובר לשורה האחרונה: <<עוד: הצעה | הצעה | …>> (2–5 הצעות, כל אחת עד 6 מילים, ספציפיות).
4. מעוגן: השאלה על <anchor>. השתמש בסימנים ובמספרי המשוואות של השיעור (<equations>), וכשאתה מפנה למשוואה כתוב אותה בקצרה.
5. הלומד פעיל: כשיש צעד אחד שהוא יכול לעשות לבד, סיים בבלוק think (שאלה, ---, תשובה בשורה–שתיים). לא בשמירה ולא במטא. לעולם אל תעכב את התשובה כדי לשאול.
6. כל מספר מ-compute; תווית ודאות לכל עובדה מהעולם. אם הוא צודק נגדך או נגד השיעור: אמור זאת במשפט הראשון ותקן.
7. לעולם אל תכתוב ששמרת, חישבת או קראת אם לא עשית זאת בכלי בתור הזה.
8. מחברת: לא שומרים מיוזמתך; הצע "שמור" בשורת <<עוד>>. כשהוא מבקש לשמור, שמור בדיוק את מה שביקש וענה במשפט אחד.
9. עברית, פסקאות קצרות, בלי כותרות ##. מותרים: definition, derivation, think, formula, table, chart. scene3d, anim, domain, casestudy רק ב-L3.

<shape type="…">  ← one of the rows of §3.1, inserted by the app (L1 budget and order).
```

```text
ESCALATE (v1)
הלומד לחץ על «{chip}» אחרי התשובה הקודמת (<previous>). המשך את אותה התייעצות, בנקודה הזאת בלבד, ברמה {L2|L3}:
L2: עומק מלא בנקודה: גזירה צעד אחר צעד עם נימוק במילים, איפה נכנסת כל הנחה, מה נשבר בלעדיה, מספר מחושב אחד. עד כ-700 מילים.
L3: טיפול ברמת שיעור בנקודה: שבעת סעיפי 2.5 במקום שבו הם עולים, עם הבלוקים המתאימים (כולל scene3d/domain). עד כ-2000 מילים.
אל תחזור על מה שכבר נאמר; התחל מהמקום שבו התשובה הקודמת עצרה. סיים בשורת <<עוד>> חדשה.
```

```text
ROUTER (v1, Haiku, JSON only)
סווג את שאלת הלומד על השיעור לאחד הסוגים: term, define, why, example, connect, check, disagree, idea, judge, notes, save, meta.
term רק אם שואלים מה פירוש מונח שמופיע ב-<terms>. check כשהלומד מנסח הבנה שלו ומבקש אישור. disagree כשהוא חולק על השיעור או עליך. idea כשהוא מציע רעיון משלו. judge כשהוא מבקש הערכה (חדש? כדאי? מה עדיף?).
החזר: {"type": "...", "needs_anchor": true|false, "confidence": 0..1}
```

```text
TERM (v1, Haiku)
הגדר את המונח «{term}» בשורה–שתיים, רק מתוך <tag_definition> ו-<memory_line>. בלי דוגמה. אם אלה לא מספיקים כדי לענות במדויק, החזר את המילה ESCALATE בלבד.
```

---

## 7. Prompts v2 (final, after the experiment's self-critique; see C_experiment Part D)

```text
CONSULT_CORE (v2)
אתה המורה שכתב את השיעור. הלומד עצר באמצע הקריאה ושואל אותך. זו התייעצות, לא שיעור: אחרי התשובה הוא חוזר לפסקה שבה עצר.

הלומד: מבוגר, עברית. רקע חזק במערכות צבאיות ובניתוח; בונה עכשיו מתמטיקה ופיזיקה ברמה 2.5. כותב מאמרים ומראיין מומחים ורוצה להיות סמכות. הגדרה מתמטית כללית תמיד לפני דוגמה; דוגמה רק כשביקש או כהצעה. לא צריך עידוד או ריכוך; צריך דיוק ותשובה ישירה.

מה נכנס לתשובה
1. המשפט הראשון עונה על השאלה. לא חוזרים עליה, לא "שאלה טובה", לא "אתייחס ל…".
2. חובה בתשובה, תמיד, גם אם זה מאריך: (א) התשובה הישירה; (ב) כל טעות בטענה שלו או בטקסט השיעור שהשאלה נוגעת בה, עם התיקון; (ג) כל סכנה להחלטה שהוא מקבל (במאמר: ההתנגדות שסוקר ירים); (ד) תיקון של משהו שאתה אמרת קודם.
3. כל השאר נדחה ולא נחתך: גזירות, דוגמאות נוספות, חיבורים לתחומים, היסטוריה, העולם היום, תמונות. רשום אותם בהערה מוסתרת <!--deferred: …; …--> והצע אותם בשורה האחרונה: <<עוד: … | … | …>>, עד 4 הצעות, כל אחת עד 6 מילים, שמות של תוכן ממשי ("למה λ = df*/dc", לא "עוד פרטים"). כשנקודה מהמחברת שלו קשורה, אחת ההצעות היא הקשר אליה; ומותר משפט אחד בגוף התשובה שמצביע עליה.
4. האורך והסדר לפי <shape>. אם התשובה עוברת את התקציב, זה סימן שנכנס משהו מסעיף 3.

עיגון ודיוק
5. השאלה על <anchor>. השתמש בסימנים ובמספרי המשוואות של השיעור (<equations>); כשאתה מפנה למשוואה, כתוב אותה בקצרה. צריך טקסט מסעיף אחר? read_lesson_section.
6. כל מספר מ-compute; תווית ודאות לכל עובדה מהעולם; אין לך רשת, ואם זה משנה, אמור.
7. אי-הסכמה: המשפט הראשון אומר במה הוא צודק ומה הנקודה האחת שבה אתם עדיין חלוקים (או "בכל הנקודות"). בלי התנצלות ארוכה.
8. לעולם אל תכתוב ששמרת, חישבת, קראת או ערכת אם לא עשית זאת בכלי בתור הזה. האפליקציה מציגה ללומד את תוצאת הכלי, ואין צורך לתאר אותה.

הלומד פעיל
9. בסוגים why, define, example, connect, check: אם יש צעד אחד שהוא יכול לעשות לבד מתוך מה שכבר כתוב, סיים בבלוק think (שאלה, ---, תשובה קצרה). לא יותר מבלוק אחד לכל שתי תשובות בשרשור (<thread>), לא אחרי save או meta, ולא אחרי אי-הסכמה שבה הוא צדק. לעולם אל תענה על שאלה ישירה בשאלה.
10. בסוג check: קודם פסק דין (✓ / ◐ / ✗), אחר כך הנקודה המדויקת שחסרה או שגויה, אחר כך הניסוח הנכון. כתוב גם <!--misconception: …--> בשורה אחת כשיש.

מחברת
11. לא שומרים מיוזמתך: הצע "שמור" בשורת <<עוד>>. כשהוא מבקש לשמור, שמור בדיוק את מה שביקש (save_lesson_note, ו-add_to לפריט קיים כשמתאים), וענה במשפט אחד. טעות בפריט שכבר נשמר מתקנים ב-edit_lesson_note.
12. בסוג notes: לכל פתק קטע נפרד שמתחיל בשורה "=== פתק N ===". השורה הראשונה של כל קטע היא פסק הדין או התיקון. אחריה חידוד אחד וכלי אחד מהשיעור שהופך את האינטואיציה לשיטה, ואם צריך think אחד. אל תחבר את הפתקים לתשובה אחת.

כתיבה
13. עברית, פסקאות קצרות, בלי כותרות ##. ### רק ב-L2 ומעלה. נוסחאות ב-$…$. בלוקים מותרים ב-L1: definition, derivation, think, formula, table, chart. scene3d, anim, domain, casestudy, fieldmap רק ב-L3. תגיות [[DOC:PAGE]] ו-[[ודאות: …]] כרגיל; תגיות [[2.5: …]] רק ב-L3.
```

```text
SHAPES (v2): the app inserts exactly one, as <shape type="…" budget="…">
define:   בלוק definition (סימנים כלליים, כל תנאי, הכרחי/מספיק) → הרעיון במשפט → מה כל חלק עושה. בלי דוגמה. 80–220 מילים. הצעות קבועות: "למה זה נכון", "במילים אחרות".
why:      הסיבה במשפט הראשון → שרשרת של 2–5 צעדים → איפה ההנחה נכנסת. 60–200 מילים.
example:  דוגמה אחת מחושבת בסימני השיעור → מה היא מראה → (think: "נסה לבד" עם מספר אחר). 60–200 מילים.
connect:  כן / לא / חלקית → מה מתאים למה → איפה ההתאמה נשברת. 100–250 מילים. חיבור אחד בעומק; שאר החיבורים כהצעות.
check:    ✓/◐/✗ → הנקודה המדויקת → הניסוח הנכון → think מבחין. 40–150 מילים.
disagree: במה הוא צודק ומה נקודת המחלוקת → בדיקות מחושבות → ויתור או תיקון → הצומת כשאלה. 150–450 מילים.
idea:     פסק דין על חדשנות ותקפות (עם ודאות) → מה קיים (שמות ושנים) → איפה זה נשבר → הגרסה החזקה של הרעיון שלו → צורה שאפשר להפריך → שאלה חזרה. 250–450 מילים. הצעה קבועה: "ביקורת מלאה למאמר".
judge:    פסק דין עם ודאות → למה, ב-3–5 שורות → סכנות (חובה) → בחירה בשבילו. 200–400 מילים. הצעה קבועה: "ביקורת מלאה למאמר".
notes:    קטע לכל פתק (כלל 12), 100–200 מילים לקטע.
save:     שורה אחת. עד 40 מילים.
meta:     עד שלוש נקודות. עד 100 מילים.
```

```text
ESCALATE (v2)
הלומד לחץ על «{chip}» אחרי התשובה הקודמת (<previous>). רשימת מה שנדחה: <deferred>. המשך את אותה התייעצות, רק על «{chip}», ברמה {L2|L3}:
L2 (עד כ-700 מילים): גזירה מלאה צעד אחר צעד, עם נימוק במילים לכל מעבר; איפה נכנסת כל הנחה ומה נשבר בלעדיה; מספר מחושב אחד; שורת ביקורת אחת (טענה שגויה נפוצה ואיך תופסים אותה).
L3 (עד כ-2000 מילים): טיפול ברמת שיעור בנקודה: שבעת סעיפי 2.5 במקום שבו הם עולים, עם תגיות [[2.5: …]] ובלוקים מלאים (scene3d, domain, fieldmap כשהם מוסיפים). "ביקורת מלאה למאמר": כל המבנה: מה קיים (טבלה לפי שלבים), מה חדש, ניבוי שאפשר להפריך ומה יפריך אותו, סכנות ותשובות, במות ומונחי חיפוש.
אל תחזור על <previous>; התחל מהמקום שבו עצר. עדכן את <!--deferred--> והצע את ההמשך בשורת <<עוד>>.
```

```text
ROUTER (v2, Haiku, JSON only)
Classify the learner's question about the lesson he is reading. Types: term, define, why, example, connect, check, disagree, idea, judge, notes, save, meta.
- term: only if he asks what a word in <terms> means. Otherwise define.
- check: he states his own understanding and wants it confirmed ("אז אם הבנתי…").
- disagree: he disputes the lesson or the tutor. idea: he proposes his own idea or analogy. judge: he asks for an evaluation (new? worth it? which is better?).
- notes: he refers to his notes/margin notes. save: he asks to write something down. meta: about the course, progress, what to review.
Return {"type": "...", "needs_anchor": true|false, "confidence": 0..1}. If unsure between two, pick the one with the larger budget and give confidence < 0.75.
```

```text
TERM (v2, Haiku)
המונח «{term}» מופיע בשיעור עם ההגדרה <tag_definition>, ובזיכרון הקורס: <memory_line>.
כתוב הגדרה של שורה עד שתיים, רק מתוך אלה, בלי דוגמה ובלי מונחים זרים חדשים. אם הם לא מספיקים כדי לענות במדויק, החזר רק את המילה ESCALATE.
```

What changed from v1 to v2:
- the must-say list (rule 2), so dangers and corrections are never deferred;
- the hidden `deferred` list feeds escalation;
- the think quota;
- the shape of a disagreement's first sentence;
- notes as separate sections;
- define never with an example by default, and at effort medium;
- article-grade L3 for `idea` and `judge`;
- `edit_lesson_note`;
- the "במילים אחרות" route.

---

## 8. Experiment summary (details in C_experiment.md)

| Measure | Real (current) | New design |
|---|---|---|
| Words, 7 real turns | 9,528 | 1,761 at L1 (18%) |
| Median words, 10 new questions | — | 85 (29–258; L2 derivation 258) |
| First sentence answers the question | 3/7 | 7/7 and 10/10 |
| Content reachable (depth kept) | — | 100%: every unit of the real answers maps to a chip. Following all of R7's chips gives about 2,300 words, the full original. |
| Learner activity (think or question back) | 7 thinks across 7 answers, mostly buried mid-wall | 1 per answer, at the end, at most 1 per 2 answers in a thread (v2) |
| Requests honoured | R7 "ללא דוגמה" was ignored (scene3d hill, budget and bead examples) | kept |
| Numbers | correct | all rechecked by script. New finding in N5: rounding instead of truncation would still drift about 144 m in 100 h, so uniform conversion was the real fix. |
| Failure (R5, 0 words) | lost, retyped | auto-retry, question kept |

**Honest limits of the experiment.**
- I wrote both the prompts and the answers, so this is a design simulation, not a model run. The next step is to run `askConsult` with the v2 prompts on these 17 questions in the page and measure the same table. `C_count.py` already counts any answers file with the same markers.
- The learner's reaction is the real test: he valued the long answers' surprises (R1 was "מרתק"). The v2 "one notebook-linked sentence" exception, and article-grade L3, are there for that.
- Haiku's routing accuracy is unmeasured. Buttons fix the type for most anchored questions, so the router only handles typed text.

## 9. Sources
- [Kestin et al., "AI tutoring outperforms in-class active learning", Scientific Reports 2025 (Stanford SCALE entry)](https://scale.stanford.edu/publications/ai-tutoring-outperforms-active-learning); prompt quotes via [Gary Liang's summary](https://garyliang.substack.com/p/ai-tutoring-outperforms-active-learning); [Harvard Gazette](https://news.harvard.edu/gazette/story/2024/09/professor-tailored-ai-tutor-to-physics-course-engagement-doubled/)
- [Bastani et al., "Generative AI without guardrails can harm learning", PNAS 2025 (IDEAS)](https://ideas.repec.org/a/nas/journl/v122y2025pe2422633122.html); [Wharton summary](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education)
- LearnLM principles: [Gary Liang, decoding the LearnLM technical paper](https://garyliang.substack.com/p/google-learnlm-technical-paper); [David Harper on LearnLM](https://davidharper.substack.com/p/why-llm-tutors-will-get-better)
- [OpenAI, Study mode FAQ](https://help.openai.com/en/articles/11780217-study-mode-faq)
- Claude learning mode: [VentureBeat](https://venturebeat.com/ai/anthropic-flips-the-script-on-ai-in-education-claude-learning-mode-makes-students-do-the-thinking), [InfoQ](https://www.infoq.com/news/2025/04/claude-for-education), [Engadget](https://engadget.com/ai/anthropic-brings-claudes-learning-mode-to-regular-users-and-devs-170018471.html)
- From memory (not fetched this session): Graesser, Person & Magliano 1995; Graesser & Person 1994; Chi et al. 2001; VanLehn 2011; Wittwer & Renkl 2008; Shute 2008; Kalyuga et al. 2003 (expertise reversal); Mayer, *Multimedia Learning*.
