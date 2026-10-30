# C. Lesson critique: Gilua M0.1 (lessons 1–3) and Lanchester M0.1 (lessons 1–2)

Reviewer stance: senior engineer/physicist and educator. I read all five lessons in full and both `prompt.ts` files. I checked about 70 numbers by hand or in Python, and they hold up (details in §2). Line numbers refer to the review files:

- **G1** = `lesson_ktrbl523bg4ofmod6i5b.md`
- **G2** = `lesson_th61kmg6g4x3pme9m0vi.md`
- **G3** = `lesson_06x36q0uxkua5ggoifkz.md`
- **L1** = `7bttypv4wjoxwlsdobdy.md`
- **L2** = `jf4i0q22nh5mfqcytk2m.md`

Some of these lessons were clearly written before recent rules. None of them has a `keep` or `definition` block, and G1 and G2 have no `[[מונח]]` tags. I note gaps like these but don't hold them against the lessons. Following the brief, I don't revisit the newly added rules on definitions, linking and key-versus-illustration formulas.

---

## 0. Size and pace: the finding that frames the rest

| | Hebrew words (excluding JSON) | ≈ numbers in text | think | exercises | reading time at 150–200 wpm |
|---|---|---|---|---|---|
| G1 | 11,200 | ~770 | 4 | 4 | 56–75 min |
| G2 | 11,800 | ~690 | 4 | 5 | 59–79 min |
| G3 | 14,300 (truncated) | ~830 | **12** | 4 (last one cut off) | 71–95 min |
| L1 | 7,900 | ~1,060 (mostly tables) | 5 | 4 | 39–53 min |
| L2 | 9,200 | ~920 | 4 | 4 | 46–61 min |

The rule asks for "at least ~4000 words". The Gilua lessons run **three times** that, and Lanchester about twice. At the planned pace of ~5 lessons a day, that is 45–70k words a day, or 5–9 hours of reading before any thinking. No reader can absorb that density at that pace. Most of the problems below come from this: the tutor treats the word count as a floor to exceed rather than a budget.

---

## 1. Would an attentive reader reach level 2.5?

### What the lessons do well (and it is a lot)

- **The seven 2.5 sections are present and often excellent.** The best critique passages are as good as a strong professor's:
  - G2:301 dismantles "just use double" with three real failures: float32 stalls at 2^21 s, the Boeing 787 hits 248.55 days, and Windows 95 hits 49.7 days.
  - G3:626 covers the V-shaped error of a numerical derivative.
  - L2:325 explains why a higher frequency does *not* fade faster in a vacuum: the f² term enters at the receiving aperture, not in propagation.
  - G1:515 corrects "60 dB + 60 dB = 120 dB" with a limiting case.

  These teach the right *reflexes*: ask what is conserved, ask which derivation step brings in the variable, find the dimensionless number that sets the regime.

- **Several case studies are real judgment lessons, not decoration.**
  - The SINCGARS case (L2:496–526) shows the budget gives 10,689 km while the horizon gives 11.6 km, so the advice is to invest in a mast, not in power. That is exactly the cross-domain insight a senior engineer has and a junior one lacks.
  - The flat optimum of the tank (G3:705–745) teaches that "a 50% deviation from h=d costs <2%; the assumptions decide, not the optimization". This generalizes to every design review.
  - The stress-limited tank height is independent of volume (G3:741–743). That is a lovely, surprising, checkable result.

- **Numbers are woven in honestly.** G2:282 openly admits it cannot reconcile GAO's 687 m with v·Δt = 575 m, and does not invent an explanation. That is a model of the epistemic behaviour the learner needs for articles.

### Where the learner falls short of level 2.5

1. **Breadth crowds out mastery.** G1 alone covers:
   - the FDIV divider, Neptune, the inverse problem and Bayesian estimation
   - Maxwell, Joukowski lift (Γ = 241 m²/s), Lobachevsky and GPS
   - pigeonhole compression, Peano and abstract data types
   - Table 1 numeral systems, positional notation, carry-lookahead adders, Karatsuba, Schönhage–Strassen
   - zero, radix economy, Setun, MLC flash, BCD and decimal FP, Ariane 5 and Y2K, thermometer DACs
   - Euclid, Euler, Fermat and Pólya
   - excess and partial molar volume, reliability chains, dB addition, seL4, CompCert and AlphaProof

  That is more than 25 topics. Each is correct, but none gets the repetition needed to become the learner's *own* tool. The reader comes away having *seen* level-2.5 reasoning about 25 things, not able to *do* it about 3.

2. **The 2.5 sections are performed by the tutor, not by the learner.** Each `[[2.5: …]]` paragraph hands over the finished judgment. The learner never practises "find the assumption that breaks" on new material before being told.

3. **Mental estimation is demonstrated, not drilled.** "אומדן בראש" appears often (G1:48, G1:95, G3:680, L2:304), but the answer always follows in the same sentence.

4. **The professional layer is thin.** There is almost no "how practitioners actually do this":
   - no tools or standards (ITU-R P.525/P.676/P.838/P.1546 are named once, if at all)
   - nothing on typical margin allocations or the spreadsheet conventions of a link budget
   - no vocabulary traps that separate insiders from outsiders (EIRP vs ERP, dBi vs dBd, dBc vs dBFS, SNR vs SFDR, noise figure)

  A senior engineer is defined less by deriving Friis than by knowing where real budgets leak 10 dB.

### Test: 8 questions a real senior engineer would ask

| # | Question | Prepared? |
|---|---|---|
| 1 | "Verification ran 10¹² random vectors through the new divider with no failures. Tape out?" | **Yes.** G1 exercise 2 and the case study give the rule of three (p ≲ 3×10⁻¹²), coverage of 2.9×10⁻²⁷, and the point that structured bugs aren't sampled uniformly. The learner can answer like an expert. |
| 2 | "Our 16-bit ADC has 98 dB SNR. Can we detect a −120 dBFS tone next to a full-scale blocker?" | **No, and actively misled.** G2 eq. (8) and the L1 `fieldsystems` block teach "every bit buys 6 dB" and treat 6.02N+1.76 as *the* dynamic range. Neither mentions FFT processing gain (10·log(N/2)), SFDR versus SNR, or dBFS/dBc. The learner would likely say "impossible". A practitioner says "with a 64k FFT, yes, if spurs allow". |
| 3 | "The VHF budget gives 190 km. Can we promise 50 km to the battalion in hilly terrain?" | **Partly.** L2 teaches horizon versus budget and names two-ray and diffraction. It gives no numbers for terrain or vegetation loss (typically 20–40 dB), fade margins or availability. The learner can say "don't trust 190" but can't size the margin. |
| 4 | "If we move the drone link from 2.4 to 5.8 GHz, how much range do we lose?" | **Yes, very well.** L2:325 and the uas domain (L2:563): it depends on whether either end has fixed aperture or fixed gain, 7.66 dB and ×2.42. Better than many working engineers. |
| 5 | "What step h should we use to differentiate a 1 kHz IMU signal with 10⁻³ relative noise?" | **Partly.** G3:626 teaches the V-shaped error with ε = machine epsilon, and h ≈ √ε = 1.5×10⁻⁸. A strong learner could generalize to ε = sensor noise, but the lesson never says that measurement noise, not roundoff, dominates in practice. A careless reader carries over "10⁻⁸". |
| 6 | "At what elevation does a 155 mm gun reach maximum range? And a mortar?" | **Misled.** G3:556 says that with drag the optimum "goes below 45° in dense air". That holds for low-velocity projectiles. For high-velocity long-range artillery the max-range elevation is typically *above* 45° (roughly 50–55°), for the same reason as the Paris Gun: the shell climbs to thinner air. The lesson presents the Paris Gun as an extreme exception rather than the rule for its own 155 mm example. |
| 7 | "The data sheet says ERP 50 dBm. Your budget uses EIRP. Any difference?" | **No.** L2:92–96 defines ERP as P_T·G_T with G in dBi, which is EIRP. The 2.15 dB dipole reference is never mentioned. That is a classic interview trap and a real source of 2 dB budget errors. |
| 8 | "A supplier offers to re-optimize our storage-tank geometry to save 3% steel. Worth a redesign?" | **Yes, excellent.** G3 eq. (30), (32) and the exercises (h/d = k; a 3% gain sits inside the flat optimum; land, wind and foundations dominate). The learner can answer like a senior. |

**Score: 3 strong, 2 partial, 3 unprepared or misled.** The pattern: the lessons prepare well for questions *inside the textbook model*. They prepare poorly for questions where practice adds a layer the book doesn't have (processing gain, ERP conventions, terrain margins, firing tables). Level 2.5 lives in that layer.

### What the learner will be able to do afterwards

- Explain test versus proof with numbers.
- Do dB arithmetic in their head to about 1%, and catch "dBm + dBm" and the 20-versus-10 log trap.
- Derive and invert the one-way link equation and explain the f² paradox.
- Recognize 1/√N noise, N·ε versus √N·ε accumulation, Knudsen regimes and flat optima.
- Spot float timestamp and counter-overflow errors.

### What they won't be able to do

- Produce a realistic link budget with margins.
- Answer the "insider" questions above.
- Recall most of the 700-plus numbers per lesson a week later.
- Run a level-2.5 analysis unprompted on a new system, because they never practised it.

---

## 2. Correctness

I checked about 70 numbers: FDIV values, 256 residual, 2¹²⁸ timing, Neptune mass ratio and 171.3-year synodic period, Γ = 241 m²/s, radix-economy values, Karatsuba ×17.6, the Patriot 9.537×10⁻⁸ s, 0.3433 s and 575 m, ADC SNRs, ε values, float32 stall at 2²¹ s, molecular flux and λ = 64.5 nm, kT/C = 2.0 mV, shot noise of 17.9 nA, YBC 7289 error, Archimedes' geometric series, Napier NL values, isothermal work of 1729 J, 155 mm vacuum range of 69.7 km and 381 m curvature drop, drag/weight 5.6, tennis serve 6.43, optimal can 76.7 mm and 2.1%, tank h_opt 13.99/15.17 m, brachistochrone 1.003 versus 1.189 s, GPS budget −158.5 dBW, FSPL 182.5/184.4 dB, 25,247 km slant range, Voyager 318.9 dB and −153.4 dBm, far-field 767 m/274 km, 50 GHz transcendental solution 58.2 km, the 69.4 km extension, SINCGARS 10,689 km and 11.65 km, Koschmieder 17/V dB/km, and GEO 195.57/209.54 dB.

**All of them are right.** This is unusually clean work for generated text, and the compute-every-number rule is clearly paying off.

### Shaky or wrong claims, by severity

1. **Optimal elevation with drag (G3:556).** "באוויר צפוף היא יורדת מתחת ל-45°" (in dense air it drops below 45°) is stated as general. It is true for low-velocity projectiles (balls, bullets, mortars at low charge). For high-velocity artillery the max-range elevation is typically above 45°, and the lesson's own 155 mm example falls in that regime. *Confidence: medium-high.*
2. **ERP defined as EIRP (L2:92–96, L2:600).** This is acceptable inside Adamy's convention, but a level-2.5 lesson should flag that ITU/FCC ERP is referenced to a half-wave dipole (EIRP = ERP + 2.15 dB). This is exactly the kind of "catch the book" item rule 14/40 asks for.
3. **GPS "works only because it corrects per this geometry" (G1:184)**, right after Lobachevsky. GPS clock corrections (+45 µs/day gravitational, −7 µs/day velocity) come from GR's pseudo-Riemannian spacetime, not from Lobachevskian hyperbolic geometry. This is a conflation the learner could repeat in an article.
4. **FDIV overclaims (G1:68).** "טיעון כזה היה מגלה את 5 התאים בתוך דקות של ניתוח" (such an argument would have revealed the 5 cells within minutes of analysis) is plausible but rhetorical. Also, Nicely found the anomaly in June 1994 and it became public at the end of October; the story says "October".
5. **Story framing (G3:12).** Tartaglia's "45° — and the answer is correct" is correct only in a vacuum, which the lesson later shows does not hold for cannons. The story should say so at the start, or it plants the error it later corrects.
6. **Minor items:**
   - al-Kashi's 2π record "~180 years" is closer to ~170 (van Ceulen, 1596).
   - "δp/p ≈ 1/√N" for pressure ignores the spread of momentum transfer per impact. It is fine as an order of magnitude but should say so.
   - G2:336 uses the "1 fF capacitor and kT/C noise" example that rule 24 names verbatim as *forbidden* in the gateway stage. That is a rules violation, not a factual error.
7. **G3 is truncated.** It ends mid-exercise ("…"), with no coverage, `today` or next-lesson sentence. The app should detect this; a learner might think the lesson is complete.

None of these undermines the lessons. Items 1–3 matter because they are exactly what an expert interviewee would pounce on.

---

## 3. Signal-to-noise

**Carries the learning (≈40–50% of Gilua text, ≈55–65% of Lanchester):**

- the central argument chains (test vs proof; real number as bounded-error measurement; derivative and integral as mirror numerical errors; dB rules; link equation derivation)
- the `[[2.5: ביקורת]]` and `[[2.5: גבולות]]` paragraphs
- 1–2 case studies per lesson
- the exercises

**Decoration or overhead (≈50–60% of Gilua):**

- **Certainty tags:** 43 in G1 and 45 in G2. Most are on uncontroversial facts ("Ariane 5 1996 [[ודאות: גבוהה]]"). They add visual noise and dilute the signal when a tag really matters.
- **Coverage blocks:** 200–330 words each. These are app bookkeeping, useless to a reader.
- **OCR errata for trivia.** "Ostrogradskil", "Vi£te", "120112-74" (G3:268, G3:611). The rule now limits these to one line; still, they should be collapsed by default.
- **History and Kolmogorov-paraphrase paragraphs** that don't feed a skill: Setun, Archimedes' Sand Reckoner, the Neptune priority dispute, Table 1 numeral systems, Roman abacus, Viète's vowels, al-Khwarizmi's title page.
- **`today` and `fieldsystems` catalogues.** For example, the AlphaProof/Aristotle scores (G1:594) and E-band, Starlink, LCRD and DSOC (L2:647–657) read as briefings, not as reasoning.
- **Fieldmaps listing future modules.** Some are useful as advance organizers, but at 5–7 lines each they get skimmed.
- **Large 3D scenes.** The Neptune scene (G1:99–135) is a beautiful but heavy visual for a 1.6×10⁻⁴ effect. The dome-and-patch spreading scene in L2 does earn its place.

**Retention one week later (no retrieval practice, 5 lessons a day):**

- **Gilua: ~10–15% of propositions, under 5% of the numbers.** What survives:
  - the anchor stories (FDIV, Patriot, cannon/Paris Gun, tank and soda can)
  - two or three slogans ("a proof is a claim about the generating rule", "N·ε versus √N·ε", "a flat minimum — the assumptions decide")
  - one or two numbers that were repeated: 2¹⁰ ≈ 10³, 6 dB per bit
- **Lanchester: ~25–35%**, because the material is narrower, heavily repeated across L1 and L2 (3 dB, 30 dBm, −174 dBm/Hz, 32.44/92.45, 6 dB per doubling, 20 versus 40 log) and procedural.

The reasons are standard: the forgetting curve without retrieval; interference from five dense lessons a day; topic counts far beyond working-memory chunking; and answers revealed before the learner commits. Novelty also competes with core content. The striking aside (Shechtman, Setun) is remembered *instead of* the central result.

---

## 4. Active versus passive

| Lesson | think | exercises | in-text "estimate in your head" (answer given immediately) | genuine produce-before-reveal moments | words per active moment |
|---|---|---|---|---|---|
| G1 | 4 | 4 | ~6 | 8 | ~1,400 |
| G2 | 4 | 5 | ~5 | 9 | ~1,300 |
| G3 | 12 (rule says ≤6) | 4 | ~5 | 16 | ~900 |
| L1 | 5 | 4 | ~6 | 9 | ~880 |
| L2 | 4 | 4 | ~4 | 8 | ~1,150 |

### Quality of the think blocks

**Strong** (genuine decision points, transferable):

- G1:148, "Is the discovery of Neptune a proof? What was proven and what verified?"
- G2:291, Patriot: what if both times used the same truncated function?
- G2:358, "Is the heat equation 'wrong'?"
- G3:729, "Guess before deriving: end caps cost k×".
- L2:319, "Double the frequency: where did the energy go?"
- L2:451, "Does +6 dB double range at 50 GHz?"

**Weak** (rhetorical, drill or answered by the preceding text):

- L1:176, "What is 0 dB?"
- L1:460, "−13 dB in your head"
- L2:147, "Why do professionals insist on dB?"
- G3:88, "Why x²+ax=b²?"
- G3:283, "Why odd numbers?"

### Exercises

They are good: estimation, trade-off and error-finding, with full solutions. Some are excellent:

- G1 exercise 2, "we ran a trillion divisions"
- G2 exercise 3, optical-clock timestamps in double
- G3, "the manufacturers are wrong" (soda can)
- L2 exercise 3, metres instead of km, and the doubling that doesn't happen

But they all sit at the end. They are *self-graded*, the hint and solution are one click away, and none asks the learner to **design** something (pick a margin, write the questions they would ask the vendor, sketch a test plan).

### Structural gaps

- **No commitment step.** A `think` answer is revealed without the learner writing anything.
- **No retrieval of earlier lessons.** `refresh` blocks *tell* the old number rather than *asking* for it.
- **Simulations come with the answer in the caption.** For example, L1:585: "The curve will rise 10 dB but range grows only ×1.78". That turns an experiment into an illustration.
- **No open "judgment" question** where several answers are defensible and the tutor critiques the learner's reasoning. Lanchester rule 35 does mandate this, but only for modules with `ref` sources.

---

## 5. What an expert mentor would add

1. **"The 5–7 numbers to remember", each with its mental derivation.** For example:
   - Gilua: 2¹⁰ ≈ 10³; ε₆₄ = 2.2×10⁻¹⁶ (16 digits) and ε₃₂ = 1.2×10⁻⁷; 6 dB per bit; 1/√N; λ_air ≈ 65 nm; 63/95/99% at τ/3τ/5τ; a flat optimum costs ≈ (Δ)²/9
   - Lanchester: 30 dBm = 1 W; −174 dBm/Hz; 92.45 dB at 1 km/1 GHz; 6 dB per doubling (one-way) and 12 dB (radar); 4.12√h km horizon; 3 dB = ×2 and 1 dB = ×1.26

   The current `keep` rule covers formulas, not numbers with their estimation path.
2. **Common professional misconceptions as an explicit list**, framed as interview traps:
   - EIRP vs ERP (2.15 dB); dBi vs dBd; dBc vs dBFS
   - SNR vs SFDR vs processing gain
   - "margin" vs "fade margin" vs "implementation loss"
   - float epsilon is relative, not absolute
   - "random testing coverage" vs "structural coverage"
3. **How practitioners actually use it**, made concrete:
   - what a real link-budget spreadsheet's line items are and where the 10 dB usually hides (cable and connector loss, pointing, polarization, implementation loss, interference)
   - which ITU-R recommendation one would open
   - how a verification lead splits budget between constrained-random testing and formal methods
4. **Interview kit**, written into the lesson rather than only into the notebook: 2–3 questions with "what a strong answer contains" and "a follow-up that separates experts from talkers". Example: "Your link closes with 6 dB margin. Walk me through what you'd expect to eat it in the field, in order of size."
5. **Article angles** with thesis, counter-thesis and the key number. Example: "High frequency doesn't fade faster in a vacuum — the antenna does."
6. **"What I'd ask the author/vendor"**: three skeptical questions about the lesson's own sources. For example, Adamy's ERP convention, or the GAO table's 687 m.
7. **Calibration exercises**: "give a 90% interval for X", then reveal, then track the learner's hit rate over weeks. That trains the estimate-within-10–20% goal directly.
8. **Failure taxonomy across lessons**: a running ledger of "how models broke" (FDIV specification gap, Patriot uptime assumption, Ariane reuse, Shechtman periodicity, VHF horizon). It becomes the backbone of the learner's articles on model failure, which the notebook already hints at.

---

## 6. Gilua versus Lanchester

| Dimension | Gilua (Kolmogorov ch. 1) | Lanchester (Adamy dB and link equation) |
|---|---|---|
| Source fit | Historical and philosophical; the tutor grafts engineering onto it | Technical and procedural; the source *is* the skill |
| Focus | 15–25 topics per lesson | 1 skill per lesson, deeply drilled |
| Coherence | Strong per section, weak across the lesson (FDIV → Joukowski → Karatsuba → water–alcohol) | Strong: one thread (Voyager → link → budget → horizon), numbers reused between L1 and L2 |
| Density | 11–14k words, ~700–800 numbers | 8–9k words; numbers mostly in tables |
| Level of explanation | Assumes too much at times (kT/C, SRT, RTL, DSMC, MX formats, all untagged in G1/G2) | Over-explains for an adult (logarithms built by counting zeros, L1:41–91; every arithmetic step on its own line) |
| Critique quality | Excellent and varied | Very good, practical (unit constants, f² paradox, 6 dB at 50 GHz) |
| Operational/system meaning | Implicit | Explicit and good (listener advantage L2:60, height vs power L2:548) |
| Correctness | Very high; three shaky claims | Very high; ERP/EIRP omission |
| Retention outlook | Low (~10–15%) | Moderate (~25–35%) |

**Verdict:** Lanchester is the better *teaching* product. It is narrower, more repetitive in the right places, and builds a usable skill. Gilua is the more *impressive* product, with dazzling cross-domain breadth and better critique writing, but it reads like a superb essay collection rather than a course. Each would gain from the other's strength: Gilua needs Lanchester's single thread and repetition, and Lanchester needs Gilua's insider-level critique and should drop the high-school scaffolding.

---

## 7. Twelve recommendations, in priority order

1. **Commit before reveal.** A `think` block should require a typed answer, a numeric guess or a multiple-choice pick before showing the solution. Store the answer and the hit/miss in course memory, and have the tutor refer back to misses next lesson. *(App change, then a rule.)* This is the largest single gain in learning per minute.

2. **Swap the word floor for a scope budget.** Rule 22/12 currently reads as "at least 4000 words", and the tutor writes 8–14k. Replace it with:
   - one central result (two at most)
   - at most two new anchor cases (reuse earlier ones)
   - at most two full `domain` blocks
   - a core path of about 2,500–3,500 words
   - everything else (history colour, extra domains, `today` catalogue) in a collapsed "for the curious" block

   At 5 lessons a day, total reading must fit about 2.5–3 hours.

3. **Open each lesson with a retrieval warm-up.** Ask three questions from the last 3–10 lessons (one number, one "why", one "spot the error"), answered before the story. Convert `refresh` blocks into questions first ("What was the radix-economy cost of base 10? → 4.34").

4. **Add a "numbers to remember" card to `keep`.** Five to seven numbers, each with its mental derivation and error (for example, "−174 dBm/Hz = kT₀; ×BW ⇒ +10 log B"). Formulas without their reference magnitudes don't produce estimates within 10–20%.

5. **Add a practitioner layer: one required paragraph per central result.** It should cover how the result is used in industry (tools, standards, typical values) and the two or three **professional misconceptions** around it (for example, EIRP vs ERP, SNR vs processing gain, noise vs ε in finite differences). It should end with one interview question and "what a strong answer contains".

6. **Make judgment exercises mandatory in every module, not only in `ref` modules.** At least one per lesson should be under-specified and multi-answer: "you are the reviewer; list the five questions you'd ask; which number would change your decision?" The tutor critiques the learner's answer in the next turn. Extend Lanchester rule 35's analysis-design format to both apps.

7. **Plant one deliberate error per lesson as a "red-team" task.** It goes in a marked paragraph, and the learner must find it before the reveal at the end. This trains the 7th section (critique) on fresh material rather than on errors the tutor has already exposed.

8. **Rewrite simulation and animation captions as predictions.** "Before moving RCS ×10, predict the range factor; then check." Ban captions that state the outcome.

9. **Put certainty tags on a diet.** Tag only decision-relevant or non-obvious claims, say five to ten per lesson, and separate *verified by compute*, *from source page* and *from memory*. Forty-plus tags per lesson hide the few that matter.

10. **Lint the gateway stage and lesson completeness in the app.**
    - Flag untagged foreign terms and the examples the rules forbid (G2 used kT/C, which rule 24 names explicitly).
    - Flag `think` blocks over the limit (G3 has 12).
    - Detect missing closing blocks (G3 is truncated: no coverage, `today` or next-lesson line) and auto-continue the draft.

11. **Teach practice-level correctives for key "book" models.** When a lesson uses a textbook convention (Adamy's ERP, vacuum ballistics, √ε with machine noise), add a one-line "in the field this differs because…". A `today` block exists for technology; the equivalent for *conventions and practice* is missing.

12. **Run a module oral exam in the senior-engineer style, and track calibration.** At the end of each module, ask 6–8 questions like those in §1 that mix in-model and practice-layer items. Score them, and log the learner's 90% interval hit rate over time. This measures progress toward level 2.5 rather than coverage, and it shows which practice gaps the tutor rules must close.

Smaller items:

- Fix the shaky claims in §2 in the lessons themselves (ballistics optimum, ERP/EIRP, GPS geometry).
- Collapse `coverage` and `erratum` blocks by default.
- Show the notebook's saved interview and article items inline at the end of the lesson so the learner sees them in context.
