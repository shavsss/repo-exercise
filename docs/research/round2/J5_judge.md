# J5: Blind judge, round 2, blind3 (A vs B)

The reader: an Israeli adult with a strong military-systems background and weaker formal math. He wants a definition before the example, one thread, key formulas kept apart from illustrations, and questions he must commit to before he reads the answer. He hates length that adds no depth, but he will not accept any loss of depth.

Size: A is one lesson covering K1:29 to K1:44, about 139 KB. B is split into two lessons over the same pages, about 76 KB. A is roughly 1.8 times longer.

## 1. Reading notes

### A
- **Delight:**
  - The Dhahran opening ("השגיאה בכל טיק הייתה זעירה... המערכת הסיקה שאין שם מטרה") hooked me at once. It is my world.
  - The crystallographic restriction gives a real reason ("2cosθ∈ℤ") for why order 5 is forbidden. Then Shechtman: "מה בדיוק נשבר כאן? לא המשפט... מה שנשבר הוא ההנחה שכל מוצק מסודר הוא מחזורי". This is the best moment in either text for someone who wants to write about broken models.
  - The think block on the unreduced fraction shows "הצמצום והירידה הם אותו טיעון בשני לבושים". That is real depth.
  - The Patriot case study notices that the GAO's 687 m does not match v·Δt = 575 m and says so honestly. The idea that a partial fix turned an error that cancels into a full error ("התיקון החלקי הפך שגיאה מתקזזת לשגיאה מלאה") is a lesson I will repeat in interviews.
- **Lost or bored:**
  - From "תוצאה מרכזית (א)" onward the lesson turns into an engineering textbook: ADC SNR 6.02N+1.76, SAR versus flash, fixed versus floating point, the Boeing 787, Windows 95, Knudsen, the heat equation, Cattaneo, phonons, FIR, Nyquist, CFL stability.
  - Each item is correct and interesting. Together they are a second lesson stuck inside the first, and the thread Kolmogorov → real number → continuity disappears.
  - I reached §4.4 tired.
- **Missing:**
  - Formal definitions. "Incommensurable" and "real number" are given in prose, with no definition block before the example.
  - Questions that make me commit. There are only about four think blocks, all open-ended, with long answers.
  - A "keep" summary at the end of the lesson.
  - The formula numbering runs (1) to (13) and mixes key results such as (4) and (6) with side results such as (7), (8) and (11).

### B
- **Delight:**
  - The landing-pad story with tape measures (28.28 → 28.284) poses the exact question of the lesson in my own field.
  - The think blocks force a choice: "כן, לא, או תלוי? התחייבו". Examples: the atom model, √3 versus √4, an instrument with 10⁻⁹ precision, A4 paper.
  - "זרות במידה היא תכונה של המודל, לא של מדידה" is short and sharp.
  - The A4 case study (99/70 and 41/29 are Pell-equation fractions) is a small, delightful discovery.
  - The adjustment of fire by bracketing ("מצלב") as base-2 nested intervals is a perfect bridge to my background, and it states where the analogy breaks (shell dispersion).
  - The defined pair "grain and resolution" gives a usable working rule, D ≈ log₁₀(L/q).
- **Flaw:**
  - In the A4 think block the choices are 1%, 0.1% and 0.01%, but the answer is 0.005%, "הקטנה מבין האפשרויות". The reader commits to an option that is not the right one. Fix the options.
- **Padding:**
  - Very little. Some of the "today" blocks and the second erratum blocks are not needed.
- **Missing or thin:**
  - The crystallographic restriction and Shechtman.
  - Babylonian YBC 7289.
  - The link between reducing a fraction, infinite descent and well-ordering.
  - Democritus' cone computation (it is mentioned but not computed).
  - The Patriot case is shorter and less critical: there is no discussion of the 687 m figure, and the "difference cancels" point gets one sentence.
- **Lost:**
  - Nowhere. The thread holds.

## 2. Reconstruction after closing each text

### A
1. Abstraction is born from practice and leads to proof.
2. The crystallographic restriction and Shechtman: an observation exposes a hidden assumption.
3. √2 is irrational. The proof counts factors of 2, and reduction is the same argument as descent.
4. Convergents give error ≈ 1/(2√2q²).
5. A real number is an unending measurement with a bounded error, and continuity means nested intervals.
6. Patriot: a systematic error grows linearly. Partial fixes are dangerous.
7. The continuum fails when Kn and 1/√N are no longer small. There are three discretizations, each with its own error budget.

My recall of the first half was strong. The second half came back as a cloud of facts.

### B
1. Geometric bodies and figures are abstractions, and proof follows from abstraction.
2. Two magnitudes are commensurable exactly when their ratio is rational.
3. (p/q)² ≠ 2, and the reason is the count of prime factors.
4. Formula (2): 100 times more precision costs a denominator 10 times larger (A4 paper, gears).
5. No finite measurement can decide whether a ratio is rational.
6. A real number is a decimal expansion that comes from measuring. Continuity holds in ℝ and fails in ℚ.
7. Meaningful digits are D ≈ log(L/q), set by the physical grain. Patriot is linear accumulation.

My recall was precise and every item was anchored to a definition.

**Verdict:** B was clearly easier. A left deeper "aha" moments in a few places (Shechtman, descent as well-ordering, cancellation in a difference). B left a more connected understanding, because every idea hangs on a numbered definition or formula.

## 3. Eight hours a day for months

**B.** Its rhythm (definition → commit → structure → limit → field) is sustainable. A at this length would wear me down. Within a week I would start skimming the engineering sections, and skimming is exactly how depth gets lost.

## 4. What each should adopt (without adding length)

### B should take from A
- The crystallographic restriction plus Shechtman, in about 6 lines in place of the Fedorov sentence. It is the best "a theorem does not fail inside its assumptions" example for this reader.
- A's unreduced-fraction think block, in place of the √3/√4 block or alongside it as a single block. It turns "reduction" into well-ordering and descent.
- In the Patriot case, one more sentence: the GAO's 687 m against 575 m, and that the partial fix turned a cancelling error into a full one. Trade it for the second erratum block.
- Democritus' cone in one line, Σk²/n³ → 1/3 + 1/(2n), in place of the general term-tag sentence.

### A should take from B
- Definition blocks before the examples: commensurable, rational, real (descriptive and formal), continuity, grain and resolution.
- Multiple-choice think blocks with "התחייבו", about 8 to 10 short ones, in place of 2 of the 4 long open ones.
- A "keep" block at the end, and a split into two lessons.
- Cut the ADC/SNR/flash, Knudsen/heat-equation/Cattaneo and Boeing/Windows material. They belong to the signals, fluids and computing nodes. Leave one line in a fieldmap, the way B does. That alone saves about 35% of the length with no loss of depth on the topic of this assignment.
- B's fire-adjustment bracketing example and its A4 example. Both are shorter and closer to the reader than SAR.

## 5. Verdict

| | Score |
|---|---|
| A | **6.5/10** |
| B | **8.5/10** |

A has rich depth and strong delight in its first half, but it is too long and its thread breaks in the second half. It is missing definitions and commit questions.

B is precise and well paced, and it is built for exactly this reader.

**What B loses that I would miss:**
- Shechtman and the crystallographic restriction. This hurts most, because it is material for an article.
- The equivalence of reduction and descent.
- The honest discussion of 687 m against 575 m, and of a partial fix that makes things worse.

All of these can be moved into B by swapping them for existing blocks, with no change in length.
