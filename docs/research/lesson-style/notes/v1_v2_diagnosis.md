# Diagnosis: quantum chapter v1 vs v2 vs current lesson

**Correction first:** the current quantum chapter is not in M0.2-03, which holds chapters 6–7 (averaging, life/stars). It is **פרק 4 in `eng/notes/lessons/M0.2-02-…w9wfuj.md`** on origin/study-notes, lines 689–1127. This comparison uses that chapter. Extracts are in `tmp/lesson/`: `current_ch4.md`, `core_55.md`, the script `stats.py` and the output `stats.log`.

## 1. Measurements

The counts are heuristic. Words exclude math and tags. "Dense" means a paragraph with ≥3 inline math or ≥4 numbers, not counting years or section/equation refs. "Narrative" means paragraphs that are not next to a display equation, have fewer than 3 inline math, and carry no step label.

| metric | v1 | v2 | current ch4 | core 5.5 (ASR-9) |
|---|---|---|---|---|
| prose words / incl. text blocks | 2299 / 2820 | 4397 / 5330 | 2523 / 4090 | 1052 / 2221 |
| display eqs in prose / in blocks | 3 / 4 | **108 / 23** | 3 / 11 | 3 / 3 |
| display eqs per 100 prose words | 0.13 | **2.46** | 0.12 | 0.29 |
| inline math | 96 | 185 | 153 | 40 |
| paragraphs | 37 | **215** | 71 | 25 |
| avg / max words per paragraph | **70 / 148** | 23 / 74 | 41 / 114 | 48 / 117 |
| paragraphs ≤15 words | 1 | **102** | 5 | 2 |
| dense paragraphs | **22 (59%)** | 30 (14%) | 26 (37%) | 11 (44%) |
| fenced blocks | 11 | 23 | 33 | 16 |
| headings h3 / h4 | 6 / 0 | 7 / **14** | 6 / 0 | 1 / 0 |
| "**צעד N**"/"**הנחה N**" labels | 0 | **46** | 0 (uses prose "ראשית…חמישית") | 0 |
| narrative share of prose words | 0.50 | 0.54 | 0.55 | 0.57 |
| longest run of display eqs without a ≥20-word "why" paragraph | 1 | **11** (Larmor collapse; 7-step minimum) | 1 | 3 |
| paragraphs mentioning a year (history in the body) | **16/37 (43%)** | 25/220 (11%) | 8/71 (11%) | 1/25 |
| definition blocks | 1 (+~7 terms defined in one narrative sentence each) | 7 (+8 bold inline) | 8 | 3 |

**The key finding: v2 is not denser than v1. It is broken into pieces.**
- v1's problem is density: 59% of its paragraphs are dense, and they average 70 words.
- v2 solved density by chopping. It has 215 paragraphs, half of them 15 words or fewer, 20× more display equations, 14 h4 sub-headings and 46 template labels.
- By words, the narrative share is about the same in all three (~0.5). So the story is still there in v2, but display equations cut it every 1–2 lines. History drops from 43% of paragraphs to 11%, because each story paragraph gets diluted by derivation lines.

**Target for v3:**
- average 35–50 words per paragraph;
- ≤10–15% dense paragraphs;
- ~0.4–0.8 display equations per 100 words in the main flow;
- long derivations in ```derivation blocks. Rule 5 of `docs/ENG_TEACHING_RULES.md` already says "גזירה ארוכה בבלוק derivation, כדי שאפשר לדלג". Neither v2 nor the current ch4 does this.

## 2. Passage pairs: v1 enjoyable, v2 heavy

**A. Energy at the point of need vs a prerequisite module inside the cliffhanger.**
- v1, 4.3: "עכשיו אפשר לענות על השאלה. אילו האלקטרון ישב על הפרוטון, $\Delta x$ היה כמעט אפס… הנפילה עולה כסף. כדי לשקול את המחיר מול המשיכה צריך מטבע אחד, האנרגיה…"
- v2, 4.1: "השאלה ההנדסית היא לא 'האם הוא מאבד אנרגיה' אלא 'כמה מהר'. כדי לענות צריך הנהלת חשבונות של אנרגיה, ונבנה אותה עכשיו…" Then comes "#### מטבע אחד: אנרגיה": the work definition, KE in 5 display lines, the PE definition, conservation and an eV block. That is about 80 lines, and it suspends the Rutherford story right at its tension point.
- What changed: the motivation went from the central question ("falling costs money") to a weak local hook ("how fast"). Energy arrives before the reader needs it.

**B. Classical collapse.**
- v1: "הוא מאבד אנרגיה, נופל מעט פנימה, נע מהר יותר, משדר חזק יותר, והחישוב הקלאסי נותן קריסה… בתוך $1.6\times10^{-11}$ שניות… כל החומר ביקום היה צריך להיעלם לפני שאור עובר סנטימטר."
- v2: "**צעד 1: אנרגיית המסלול.** בתנועה מעגלית כוח קולון מספק את התאוצה המרכזית: $$\frac{mv^2}{r}=\frac{ke^2}{r^2}$$ נכפול ב-$r/2$…". It runs 6 steps and 11 display equations, each connected only by fragments like "נוסיף את (10):" or "נציב ב-(11):".
- What changed: a derivation of something the reader already believes, with no payoff until step 6. There is one good why-sentence ("ה-$r^4$ במכנה הוא הסיפור כולו"), and it is buried in the middle.

**C. Spread (standard deviation).**
- v1, one sentence inside the Heisenberg story: "כדי לנסח אותו צריך מדד ל'כמה לא ידוע': נכין את אותו מצב פעמים רבות, נמדוד… ונחשב את ה-RMS של הסטיות מהממוצע (M0.1). זה **הפיזור**…"
- v2: "#### פיזור", then a definition block, then "ההגדרה בנויה בארבעה צעדים, ולכל אחד סיבה: 1. מחסירים… 2. מעלים בריבוע…", then an example, then "נצטרך עוד זהות אחת", with the variance identity in 3 display lines.
- What changed: the definition is stacked in template form (heading → block → numbered list → example → identity). This is rule 5א applied literally. The voice becomes list-like. "נצטרך עוד זהות אחת" gives no goal; the why (the $\langle p^2\rangle=(\Delta p)^2$ bridge) comes only afterwards.

**D. The minimum of $E(r)$.**
- v1: "נגזור ונשווה לאפס: $dE/dr=-\hbar^2/m_er^3+ke^2/r^2=0$, ומכאן", then the result block, then the payoff "זה הרדיוס של בוהר, אבל הפעם בלי שום כלל על מסלולים…".
- v2: "**הנחה 1.** … $$\Delta x\approx a$$ **הנחה 2.** … $$\Delta p\approx\frac{\hbar}{a}$$ …", then "**צעד 3.** כופלים ב-$a^3$, כדי להיפטר מהמכנים: $$-\frac{\hbar^2}{m}+ke^2\,a=0$$". Steps 1–7 each get their own bold line and display equation.
- What changed: trivial relations are displayed. Rule 5ב says illustrative steps stay in the text. The rhythm becomes staccato, with no running sentence. The real gems (stiffness 97 eV/Å², $K=-E$) are hidden inside steps.

**E. The radar domain block.**
- v1 (the learner called it too dense): "(9) הוא בעצם משפט על גלים: חבילת גל שאורכה $\Delta x$ מכילה בהכרח טווח של מספרי גל… **באטום:** $\Delta x=0.5$ Å נותן $\Delta k\ge10^{10}$ מ'⁻¹…". One paragraph carries ~10 numbers and 6 inline expressions.
- v2: "**הגזירה של כושר ההפרדה בטווח, צעד-צעד:** 1. פולס שנמשך $\tau$ תופס במרחב אורך $c\tau$. 2. …", then single-sentence paragraphs like "כדי לרדת ל-15 מ' צריך פס של 10 MHz." and "זה אותו יחס כמו באטום…".
- What changed: v2 swapped density for fragmentation. In both versions ASR-9 stays a side box. In core 5.5, by contrast, ASR-9 is the *question* of the section.

**F. Localizing an atom vs an electron.**
- v1: "המכה שהאלומה נותנת… היא אותה מכה של הייזנברג… למקם אלקטרון עד 0.5 Å עולה 15 eV… למקם אטום פחמן… 0.7 meV". This is one dense 122-word paragraph, but it is a single argument.
- v2: "לאלקטרון, עד 0.5 Å, המחיר הוא 15 eV, יותר מאנרגיית הקשר." and "אטום פחמן כבד פי 21,900 מהאלקטרון, ואותו מיקום עולה לו 0.7 meV." are separate one-line paragraphs.
- What changed: one argument became bullet-like lines. The right fix is 2–3 sentences per number inside one flowing paragraph, not one line per number.

Where v2 *succeeds* (keep the voice): "שני כפתורי התכנון, $\lambda$ ו-$\theta$, מצטמצמים לגמרי. זו חתימה שמהנדס לומד לזהות…", the error budget, "מהנדס שקורא משפט אי-אפשרות מחפש את ההנחה שאפשר לשבור", and "מה החזקות אומרות למתכנן". That is the engineer's critique woven into the tone, which v1 lacked.

## 3. What v1 cut and v2 restored (v3 must keep)

1. **Work:** definition $w=Fd$ plus the variable-force $dw=F\,dx$.
2. **Kinetic energy:** derivation of $K=\tfrac12mv^2=p^2/2m$ from a constant force.
3. **Potential energy:** definition $F=-dU/dr$, verified by differentiating $U=-ke^2/r$.
4. **Conservation:** $dK+dU=0$; bound state $E<0$; binding energy.
5. **Voltage and eV:** definitions; $ke^2=14.40$ eV·Å.
6. **Classical collapse:** Larmor $P=\tfrac23 ke^2a^2/c^3$; the derivation $E=-ke^2/2r$, $dr/dt$, $r_e$, $d(r^3)/dt=-4r_e^2c$, $t=a_0^3/4r_e^2c=1.56\times10^{-11}$ s. Plus the assumption check (4×10⁻⁵ eV per orbit, ~200k orbits) and the line-spectrum evidence.
7. **Dimensional analysis as an exponent system:** no solution without ħ; the unique solution $\hbar^2/mke^2$ = 7.62/14.40 = 0.529 Å.
8. **Photon energy:** $E=hf$, $hc=1240$ eV·nm.
9. **Bohr model:** $mvr=n\hbar$ → $r_n=n^2a_0$, $E_n=-13.6/n^2$; Balmer 3→2 = 1.89 eV → 656 nm.
10. **de Broglie closure:** $n\lambda=2\pi r$ → $pr=n\hbar$.
11. **Spread:** definition, the four-step rationale, the 1-2-3 cm example, the identity $\sigma^2=\langle x^2\rangle-\langle x\rangle^2$.
12. **Exact uncertainty form:** Kennard's version; Gaussian packet via the Gaussian integral → $\sigma_x\sigma_k=\tfrac12$ → $\hbar/2$; the FWHM caveat; the chart.
13. **Dust vs electron:** $\Delta v$ computations, $5.3\times10^{-14}$ vs $5.8\times10^5$ m/s.
14. **Heisenberg microscope with aperture:** $\Delta x\approx\lambda/2\sin\theta$, $\Delta p\approx2h\sin\theta/\lambda$, product $h$.
15. **Radar range resolution:** $\Delta R=c\tau/2=c/2B$; chirp as the counterexample.
16. **The estimate with explicit assumptions:** first and second derivative (stiffness ~97 eV/Å²); $E_{min}=-m(ke^2)^2/2\hbar^2$; $K=-E$, $U=2E$.
17. **Relativity check:** $v/c=ke^2/\hbar c=1/137$.
18. **Error budget:** reduced mass → 13.598 eV; next correction $\alpha^2$.
19. **Critique of the estimate:** the ground state has $\Delta x\Delta p_x=\hbar/\sqrt3$, so it is not a minimum-uncertainty state; the ½ factor gives 0.132 Å and 54.4 eV; the $h$-vs-$\hbar$ error (20.9 Å, 0.345 eV).
20. **Abbe limit:** $d=\lambda/2n\sin\theta$, NA ≈ 1.4 → 200 nm.
21. **Electron wavelength:** $\lambda=1.226\,\text{nm}/\sqrt V$; relativistic derivation (eq. 18); the 10/100/300 kV table; the 200 kV numeric question.
22. **Seeing the atom:** 537 V ↔ $h$ vs $\hbar$; localization cost $\hbar^2/2M\Delta x^2$, 15 eV for the electron vs 0.7 meV for carbon.
23. **Scherzer lens optimum:** the theorem; $d(\alpha)=0.61\lambda/\alpha+\tfrac12C_s\alpha^3$ → $\alpha_{opt}$, $d_{min}\approx C_s^{1/4}\lambda^{3/4}$ (0.36 vs 0.23 nm); what the exponents imply for design; the assumptions → 1998 corrector → chromatic limit next.
24. **Sample damage:** $E_{max}=2K(K+2mc^2)/Mc^2$ (15.8 eV at 80 keV, 71 eV at 300 keV); graphene threshold and thermal correction; cryo-EM.
25. **Photon vs electron:** $E_\gamma/K_e=2mc^2/pc\approx10$.
26. **Shot noise:** SNR $=C\sqrt N$, Rose $N\ge25/C^2$ → 2,500; cryo-EM averaging closes the loop to Maxwell's "manufactured article".
27. **Fine-structure constant:** $\alpha$ definition, QED; nucleus confinement $(\hbar c)^2/2m_pc^2r^2=20.7$ MeV.

## 4. What the current lesson does better than v2

- **Running-sentence derivations.**
  - KE is one paragraph: "התאוצה קבועה, $a=F/m$. אחרי זמן $t$… נציב $t=v/a$… התאוצה מצטמצמת, ולכן התוצאה לא תלויה באיך הגענו למהירות." It is the same math as v2's 5 display lines, in one breath.
  - The estimate uses prose ordinals ("נבנה את האומדן בחמישה צעדים. ראשית… שנית…") instead of 9 labelled lines.
- **Display math only for results:** 14 display equations vs 131 in v2.
- **Goal first:** every section opens with "**השאלה.**", and goals are stated before derivations ("כדי להשתמש ב-(8) באטום צריך להשוות את 'המחיר'…").
- **Per-term meaning after each formula:** "$p$ בריבוע אומר שתנע כפול נותן אנרגיה פי 4, ו-$m$ במכנה…".
- **Chart-reading cues:** "בגרף כדאי להסתכל…".
- **Bridges:** each section ends with a forward hook ("כדי לשקול אותו מול המשיכה, צריך מטבע משותף." / "**מה הושג.**").
- **Energy is placed after uncertainty**, motivated by price vs gain (its own section 4.3), not inserted into 4.1.
- **More checkpoints with diagnostic wrong answers:** 4 mcq, 5 numeric, 1 explain, 2 tables, 4 charts, including the $U$ + slope chart that v2 dropped. v2 has 3 numeric and 1 mcq.
- **No h4 sub-headings:** the section reads as one block.

The current lesson's weaknesses, which v1 fixed:
- syllabus-like intro ("נתחיל ב… (4.1), נלמד… (4.2)");
- thin history;
- the microscope anchor appears only in a casestudy at the end;
- a weak domain analogy (hand clap / tuning fork);
- a few dense paragraphs ("גרעין זעיר", "אלקטרון מול גרגר אבק").

Core 5.5 shows what the learner likes. The anchor *is* the section's question ("ההד… כ-‎−97 dBm… המספר הזה לבדו לא אומר אם המטרה התגלתה"). Each display equation has a one-line "what I just did" ("כפלנו את קבוע בולצמן בטמפרטורת הייחוס."). The casestudy compares model vs design spec, then "משמעות מבצעית", then a decide block.

## 5. Block syntax (fenced, reusable)

**General form:** ```` ```type ```` on its own line, then `@key: value` header lines, then a Markdown body with `$…$` / `$$…$$` and `\tag{n}`. A line with `---` separates question from solution.

**Text and structure blocks:**
- `definition`: `@title`, `@mark: summary|aid`. Uses context → general definition → how it is built.
- `formula`: `@title`, `@mark: summary`. The body is the equation plus a validity/units line. Use only for results that recur later (rule 5ב).
- `derivation`: `@title`. Body lines like `**צעד 1: …**` with `$$`. This is meant to be skippable (rule 5).
- `domain`: `@field: signals|space…`, `@title`. Its internal labels: **באטום:** / **במכ"ם:** / **איפה זה נשבר:**.
- `casestudy`: `@title`. Its internal labels: **השאלה/הקלטים/השרשרת/ההשוואה/ידוע לעומת מוערך**.
- `history`: `@title`, `@who`, `@when`.
- `story`: `@title`, for an opening scenario.

**Question and check blocks:**
- `numeric`: `@answer`, `@unit`, `@tol: 2%`; question, `---`, solution, then `- wrong: value :: diagnosis` lines.
- `mcq`: options `- [ ]` / `- [x]` with ` :: feedback`.
- `explain`: question, `---`, key-point bullets, `===`, model answer.
- `think`: question, `---`, hidden answer; at most ~6 per lesson, at decision points.
- `predict`: `@title`, `@value`, `@unit`; asks for an estimate with a 90% range, then `---` answer.
- `verify`: `@result`, then checklist bullets (dimensions, limit case, known case…).
- `decide`: `@kind: trade`, `@title`; question, `---` analysis.

**Media blocks:**
- `chart`: JSON with `title`, `caption`, `type`, `scope`, `x`, `series[{name, expr}]`, `yLabel`.
- `table`: JSON with `columns`, `rows`, `scope`, and `format()` expressions.
- `svg`: `@caption` plus raw svg.
- `figure`: source id line plus caption.

Also in use: `keep` (summary), `refresh`, `scene3d`, `erratum`, `errorhunt`, `lab`.

**Inline tags:** `[[ודאות: גבוהה|בינונית]]`, `[[F1:26]]` (source page), `[[2.5: פשרה|מקור|מבנה|גבולות|ביקורת|סדר גודל|מבנה משותף]]`, `[[מונח: term | gloss]]`, `[[היפותטי]]`. The renderer's names are in `docs/research/lesson-style/md2html.py` (`NAMES`).

## 6. v2 outline and derivation content per section

- **Intro:** Maxwell's "manufactured article"; the question (why no fall, why identical); microscope anchor; a bulleted prior-knowledge list.
- **4.1, 1911–1913:** Rutherford.
  - #### Energy: work def; KE derivation (8); PE def (9); $U=-ke^2/r$ check (10); conservation, bound state, binding energy; eV def.
  - #### Collapse: Larmor (11); 6-step collapse time; assumption check; svg; spectral evidence.
  - #### No size: exponent system with no solution; $r_e$.
- **4.2, Planck/Einstein/Millikan:** $E=hf$ (12); dimensional analysis with ħ → $a_0$; Bohr derivation $r_n$, $E_n$, Balmer 656 nm; engineer's suspicion; Pauli quote.
- **4.3, de Broglie:** $\lambda=h/p$ (13) → $pr=n\hbar$; Heisenberg, Schrödinger, Born.
  - #### Spread: def, 4 reasons, example, identity.
  - #### The law: (14) with Kennard; Gaussian packet derivation; chart; dust vs electron.
  - #### Heisenberg microscope: 3 steps → $h$; Bohr's correction; "state, not instrument".
  - Domain block: radar $\Delta R=c/2B$; chirp.
- **4.4, price vs gain:** assumptions 1–4 → (15); chart; 7-step minimum incl. second derivative and stiffness → (16), (17); dependence on constants; $K=-E$, $U=2E$; relativity check $v/c=1/137$; error budget with reduced mass; critique ($\hbar/\sqrt3$, factor ½); $h$-vs-$\hbar$ error; He⁺ numeric.
- **4.5, the real microscope:** Knoll/Ruska.
  - #### Abbe: def, 200 nm.
  - #### Electron λ: 5 steps → 1.226/√V.
  - #### Relativistic correction: 5 steps → (18); table; 200 kV numeric.
  - #### Seeing without destroying: 537 V numeric; localization cost 15 eV vs 0.7 meV.
  - #### Lenses: Scherzer optimum, 4 steps, design exponents, corrector, chromatic limit.
  - #### Damage: 4 steps $E_{max}$; graphene; cryo; why not photons.
- **4.6, probability:** Tonomura 1989; probabilistic-prediction def; Einstein/Solvay/Bell/2022.
  - #### Designer's cost: shot noise SNR $=C\sqrt N$, Rose → 2,500, cryo-EM averaging.
  - #### Zero-point motion: helium; mcq.
- **4.7, same price at another scale:** α def; QED, Dirac, positron; nucleus confinement in 3 steps → 20.7 MeV → next chapter.

## Recommendation for v3

- Use v2's outline and math.
- Write the main flow in v1's/current's running-sentence voice: goal sentence → 1–3 key display equations → payoff sentence.
- Move the long step-by-step chains into ```derivation blocks: collapse time, Gaussian packet, Bohr levels, relativistic λ, Scherzer optimum, damage, nucleus.
- Introduce energy at the point of need (4.4), not in 4.1.
- Drop the h4 sub-headings and the "**צעד/הנחה N**" labels in the main text.
- Cap each paragraph at ~3 numbers.
- Make ASR-9/microscope the question of a section rather than a side box.
