# How great technical texts combine rigor and narrative, paragraph by paragraph

## What I could actually read
- **Read in full or in large part:** Knuth's *Mathematical Writing* notes; David Tong's Cambridge *Quantum Mechanics* notes (all ~43k words, including the harmonic-oscillator derivation); about 40% of Halmos's *How to Write Mathematics*; Strang's 6th-edition preface (official MIT PDF); Bret Victor's *Kill Math*; the 3Blue1Brown FAQ; Kalid Azad's ADEPT article.
- **Read through a summarizing fetch tool, so the quotes are reliable but chosen by that tool:** Wigner's essay; Hamming's 1980 reply to it; Arnold's *On teaching mathematics*.
- **Feynman:** feynmanlectures.caltech.edu returns 403 to this environment, so I could not read the chapters directly. My Feynman quotes come from verbatim reproductions in teaching notes and a reading blog. I mark the one line I could not verify.
- **Not examined:** Purcell, Skolnik, Spivak, Strogatz and Tao are behind copyright or I found no legitimate copy. Needham I know only from reviews of his preface. I make no textual claims about any of them.

## Findings by text

### Wigner, *Unreasonable Effectiveness* (https://math.dartmouth.edu/~matc/MathDrama/reading/Wigner.html)
- **A puzzle opens the argument, not a definition.** He starts with a statistician whose friend objects to π in a population formula: "surely the population has nothing to do with the circumference of the circle." That anecdote becomes thesis 1.
- **The theses are announced and then followed.** "The first point is that the enormous usefulness of mathematics…"; "Second, it is just this uncanny usefulness…". The section headings are questions he then answers: "WHAT IS MATHEMATICS?", "IS THE SUCCESS OF PHYSICAL THEORIES TRULY SURPRISING?".
- **History is evidence, with numbers.**
  - Newton's gravitation was first checked "with an accuracy of about 4%" and later proved accurate to "less than a ten thousandth of a per cent."
  - For helium, which Heisenberg's rules did not cover, the computed ground level matches observation "within… one part in ten million."
  - Each case supports one claim and is followed by an interpretation. None is decoration.
- **Doubt is stated outright.** "We do not know why our theories work so well… their accuracy may not prove their truth." The free-electron theory is "a crude approximation."
- **Caveat for your design:** Wigner has almost no equations. He shows how an argument flows, not how to pace equations. Your lessons need his narrative arc combined with Tong's or Feynman's handling of equations.

### Hamming, reply to Wigner, 1980 (https://ned.ipac.caltech.edu/level5/March02/Hamming/Hamming.html)
- **The engineer's voice opens by naming a weakness.** He promises to address "what I think Wigner evaded." Other lines: "Never mind what the theories are supposed to be"; "It is ridiculous to think that is the way things go."
- **A derivation is told as a thought experiment.** Galileo ties two falling balls together and asks "How tightly must I do it to make them one piece?" Hamming concludes: "the only possible thing is that they all fall at the same speed." The question, the attempt, the contradiction and the law come in that order.
- **The critique is built into the structure.** His section headings are partial explanations, each examined and found insufficient: "We see what we look for", "We select the kind of mathematics to use", "Science in fact answers comparatively few problems". He then sums up the residue honestly: "the residue is still so large as to leave the question essentially unanswered."

### Feynman, Vol. I ch. 37 / Vol. III ch. 1 and Vol. I ch. 4
Sources: verbatim excerpts at https://web.pdx.edu/~pmoeck/lectures/311/feynman-1.pdf and https://readfeynman.blogspot.com/2024/09/section-372-experiment-with-bullets.html.
- **He promises the payoff up front and limits it.** "We choose to examine a phenomenon which is impossible, absolutely impossible, to explain in any classical way, and which has in it the heart of quantum mechanics. In reality, it contains the only mystery… We will tell you how it works." This states the central question and the honest boundary (how it works, not why) in one paragraph.
- **One recurring setup carries the chapter.** The same apparatus is run three times: bullets, then water waves, then electrons. A light watcher is added at the end. Each run produces one formula, and each formula is set against the previous one.
- **Idealizations are announced, not hidden.** "imagine a somewhat idealized experiment in which the bullets are not real bullets, but are indestructible bullets."
- **A formula arrives only after the observation it summarizes.** "The probabilities just add together. The effect with both holes open is the sum of the effects with each hole open alone." Only then comes P₁₂ = P₁ + P₂. He also names the result in advance: "We shall call this result an observation of 'no interference,' for a reason that you will see later." That sentence is a small promise paid off one section later.
- **Each part closes with a summary.** "So much for bullets. They come in lumps, and their probability of arrival shows no interference."
- **Vol. I ch. 4 builds intuition with a story before the abstraction.** "Imagine a child, perhaps 'Dennis the Menace,' who has blocks which are absolutely indestructible." Each new hiding place for the blocks becomes a new term in the bookkeeping equation, and then the analogy is taken away: energy "is an abstract thing in that it does not tell us the mechanism." The widely quoted line "we have no knowledge of what energy is" I could not verify verbatim.

### Tong, Cambridge QM notes (https://www.damtp.cam.ac.uk/user/tong/qm/qm.pdf)
- **The opening gives stakes and a strategy.** It starts with "the single greatest achievement in the history of human civilisation," then old questions ("why is matter stable?… why does the sun shine and why is it yellow?"), then a strategy statement: "embrace this mathematical description and leverage it to build a new intuition."
- **Every step of the oscillator derivation gets a reason in plain words.**
  1. Goal: "Our goal is to find solutions…", followed by a definition of what "solution" means here.
  2. Rescaling: "There are a bunch of constants sitting in (2.21) and life is simpler if we can just get rid of them. To this end, define…"
  3. A first answer: "Before we get going, we can find one solution just by staring."
  4. Asymptotics: "This motivates the general ansatz…"
  5. Payoff: "But this is the spectrum of the theory that we were looking for!"
  - Displays are short. There is roughly one numbered equation per ~340 words, and an unnumbered display about every 100–150 words. Every display is preceded and followed by a full sentence.
- **Critique is voiced as an imagined reader objection.** "You might think that it's not particularly realistic as a potential, and there is some merit to that. But there are situations – such as impurities in solids – where… it is useful to have a simple toy model." On measurement: "it seems like there should be a more unified description… We'll make a few further comments about this in Section 3.5."
- **Emphasis is scarce, so it counts.** "I don't put many things in boxes in my lecture notes, but this statement is so special that I'm going to make an exception: The outcome of any measurement of Ô lies in the spectrum of Ô."
- **History comes with a verdict.** On the uncertainty principle: "look up the intellectual jousting of the original Einstein-Bohr debates. Einstein's thinking is pellucid in its clarity; Bohr appears muddled, bordering on obscurantist. Yet Bohr had the overwhelming advantage of being right."
- **He comes back to earlier examples.** A section titled "The Gaussian Wavepacket Revisited" opens: "We already met a baby version… We can return to this example now that we have a better idea of what we're doing."

### Strang, ILA 6th-edition preface (https://math.mit.edu/~gs/linearalgebra/ila6/)
- **A concrete object comes first and the name comes last.** He starts with two specific vectors, (2,3,1) and (1,4,2), draws combinations, then: "Here is the key! The combinations ca₁ + da₂ fill a whole plane." Only after that: "There is a natural name for that plane. It is the column space."
- **Progress is recapped in a numbered list.** "Here are the four ideas introduced so far." Then he adds columns to the same matrix and reasons "a column at a time, left to right": "Column 3 contributes nothing new because a₃ is on that plane."

### Knuth, *Mathematical Writing* (http://jmlr.csail.mit.edu/reviewing-papers/knuth_mathematical_writing.pdf)
Operational rules:
- "Don't use the style of homework papers, in which a sequence of formulas is merely listed. Tie the concepts together with a running commentary." (rule 10)
- "Try to state things twice, in complementary ways, especially when giving a definition." (rule 11)
- "Motivate the reader… Definition 1 is motivated only by decree; this is somewhat riskier… What does the reader know so far? What does the reader expect next and why?" (rule 12)
- "Your sentences should flow smoothly when all but the simplest formulas are replaced by 'blah'." (rule 13)
- "Symbols in different formulas must be separated by words." (rule 1)
- "Display important formulas on a line by themselves." (rule 16)
- The worst opening is "An x is y." (rule 24)

### Halmos (https://sites.stat.columbia.edu/liam/teaching/HalmosWrite.pdf)
- **Promise plus surprise.** "The reader's attention is held because he was told early what to expect, and, at the same time and in apparent contradiction, pleasant surprises keep happening."
- **Organize around examples.** "The heart of mathematics consists of concrete examples… organize your work around the central, crucial examples and counterexamples." The reader most needs guidance on "the things the proof does not prove."
- **Against over-completeness.** "Too much detail can be as discouraging as none." The Bourbaki "last dotting of the last i… for most serious-minded readers it is worse than useless."
- **Order for the reader, not the discoverer.** The discoverer "stumbled on it helter-skelter"; exposition arranges it to "minimize the resistance and maximize the insight."
- **Notation is designed in advance.** "Think about the alphabet."

### Arnold (https://karlin.mff.cuni.cz/~spurny/doc/articles/arnold.htm)
- "It is impossible to understand an unmotivated definition."
- The determinant should be taught as "an (oriented) volume of the parallelepiped whose edges are its columns."
- The group "axioms" are "just (obvious) properties of groups of transformations," as opposed to "a load of easily-forgettable axioms."
- "Mathematics is the part of physics where experiments are cheap."

### 3Blue1Brown (https://www.3blue1brown.com/faq/)
- "Concrete before abstract… Open with the key exercise; don't put it at the end."
- "Topic definitions should not be seen as a starting point, but an ending point."
- The best order for teaching ideas often differs from their logical order.

### Azad, ADEPT (https://betterexplained.com/articles/adept-method/)
- The order is Analogy, Diagram, Example, Plain-English, then Technical.
- "Analogies are fuzzy, not 100% accurate, and yet astoundingly useful."

### Victor, *Kill Math* (http://worrydream.com/KillMath/)
- "Relationships between values, exponential blow-ups and negligible terms, should be plainly seen, not imagined."
- For on-screen lessons: put the numbers into a figure or table, not into prose.

## Twelve principles for reconciling depth with flow

1. **Open with a question the reader feels, and promise the answer within its limits.** Do not open with a definition: avoid "An x is y" (Knuth 24). One paragraph should say what will be shown and what will not. Feynman: "We will tell you how it works," not why. Tong: stakes plus strategy. Wigner: the π puzzle.

2. **Keep one apparatus or system throughout and run it repeatedly under changed conditions.** Feynman: bullets, then waves, then electrons, then a watcher. Strang: the same matrix with one more column. Tong: "…Revisited." Each new section changes one knob on the same system (for you, ASR-9: range, then PRF, then clutter…). Each run should yield one formula and one contrast with the previous run.

3. **Make every derivation a short story of question, attempt, obstacle and resolution.**
   - Name the goal ("Our goal is…").
   - Try the obvious move ("find one solution just by staring").
   - Let the obstacle motivate the next step ("This motivates the ansatz…").
   - Mark the payoff ("But this is the spectrum… we were looking for!").
   - Hamming's Galileo is the same pattern told as a thought experiment.
   - Depth is kept in full: every step appears. The flow comes from the connecting sentences, not from cutting steps.

4. **Pace equations by rule.**
   - One idea per display. Never two formulas without words between them (Knuth 1).
   - Every display has a full sentence before it saying why and a sentence after it saying what it means.
   - The "blah" test: the paragraph must still read if formulas are replaced by "blah" (Knuth 13).
   - Rough target from Tong: one display per 100–150 words in derivation sections, fewer in narrative ones.
   - Numbers go in a table or figure, not in a sentence (Victor; your rule (e)).

5. **Show the phenomenon first, give the formula second, give the name last.** Feynman: "The probabilities just add together" comes before P₁₂ = P₁ + P₂. Strang: the plane comes before the words "column space." 3B1B: a definition is "an ending point." Arnold: an unmotivated definition cannot be understood.

6. **State each definition twice, once formally and once as plain meaning or picture.** Knuth 11; Arnold's determinant as a volume. The formal statement stays complete and precise; the second phrasing stops it from feeling dropped in from nowhere.

7. **Use history to explain why the next step was needed, never as decoration.**
   - Wigner uses history as evidence with numbers (4%, then one part in ten million).
   - Tong uses it as a verdict (Bohr "muddled… Yet… right").
   - Hamming uses it as a reconstructed argument (Galileo).
   - The useful pattern: who got stuck, on what, what they tried, and why it failed. That failure is the motivation for the formula that follows.

8. **Voice critique as named assumptions and imagined reader objections, in the body text.**
   - Feynman announces his idealizations ("indestructible bullets").
   - Tong: "You might think that it's not particularly realistic… and there is some merit to that. But…"
   - Hamming's section headings are themselves objections.
   - Put the engineering critique ("which assumption fails first in a real radar?") right after the formula it attacks, not in an end-of-chapter "limitations" box.

9. **Signpost often and summarize locally.**
   - Feynman: "So much for bullets…"; "for a reason that you will see later."
   - Strang: "Here are the four ideas introduced so far."
   - Wigner: "The first point… Second…"
   - Halmos: tell the reader early what to expect, then still deliver surprises.

10. **Make emphasis scarce so it means something.** Tong boxes one statement in the whole course and says why. Reserve a highlight or box for at most one or two results per chapter, not for every definition.

11. **Organize around the key example and its counterexample, and say what the result does not cover.** Halmos: readers need guidance on "the things the proof does not prove." Wigner and Hamming each end with what remains unexplained. That honesty is part of the enjoyment.

12. **Fix notation and units in advance and never reuse a symbol.** Halmos: "Think about the alphabet." Knuth 14. Continuous prose can only stay light if symbols never need re-explaining.

## Where these texts clash with possible rigid rules

- **"Every concept gets a fixed definition template."** None of the good texts do this. Feynman, Strang, Arnold and 3B1B introduce a concept after the phenomenon, and the timing differs every time. Halmos and Knuth warn against "homework style" and strings of lemmas. A template turns the chapter into a list of parts, which is exactly what your learner rejects.
  - Compromise: require the content (a precise statement, a plain restatement, a motivation before it), not the layout. A reference glossary can live outside the main text.
- **"Keep history to one line."** This conflicts with Wigner (history is his evidence), Hamming (his central derivation is a historical reconstruction) and Tong (history as a judgment on how science works). One line can only decorate. Motivation needs the obstacle and the failed attempt, typically a paragraph placed exactly where the next formula is needed.
  - Better rule: history is allowed only when it motivates or tests the next step, but then it gets the space it needs.
- **"Separate sections for theory, history and critique."** All of these texts weave the three together. Separating them is what produces the "heavy" feel, because the derivation loses its reason for existing.
- **"Wigner as the only model."** Wigner shows the argument arc but not how to handle equations. Pair his arc (thesis, evidence, doubt) with Tong's derivation voice and Feynman's recurring apparatus.

## Further sources
- 3B1B in secondary accounts: https://blog.dropbox.com/topics/work-culture/grant-sanderson-channels-his-passion-for-math-into-marvelously-i
- Needham's apology for rigor, as reported in a review: https://www.timeshighereducation.com/node/87300
