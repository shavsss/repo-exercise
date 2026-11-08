# UX / visual audit: the lesson screen today, the sketches, and the active flow

Screenshots are in `round2/UX/`. The harness is in `round2/UX/harness/`: `test.html` is the scripted sample lesson with every block type, and `long.html` is the same harness with the real 110k-character lesson `lesson_06x36q0uxkua5ggoifkz.md` injected as part 1. Gilua (eng) was built from the current source, and no source files were changed.
Prefixes: `s_` = sample lesson, `L_` = real long lesson, `sk_` = sketches.html, `*_p_*` = panels.

## Measured facts
- Body: IBM Plex Sans Hebrew 17px / 1.9 line height, ink #22261d on #ece4d6 (12.2:1). Muted text #676a58 on bg = **4.4:1**, which fails AA for the 11–12px meta text it is used on (page chips, "עמ' 2", figure meta).
- Reading column 608px at 1300 wide (about 70 Hebrew characters, good). With "תוכן השיעור" and "הסבר פשוט" both open it drops to ~380px, about 40 characters (`s_p_explain.png`).
- The long lesson shows "עוד כ-93 דק'" for part 1 alone.
- 19 block kinds, each with its own hue, all drawn as a **2px dashed full frame with a label tab** (`styles.css:1323`).
- `prefers-reduced-motion` covers only 3 rules (progress bar, busy icon, noise wave). It does not cover scroll animation, 3D tours, anim blocks or the resume chip.
- Mobile 400px: **document scrollWidth 445 > 400**, so the page overflows horizontally. The header loses the hamburger and logo, and text is clipped at the right edge (`s_400_initial.png`, `L_m400_light_q1.png`). The module drawer is also clipped on its right side (`s_400_light_q1.png`).

## What is wrong, concretely
1. **The floating dock (חלק · פתק · רעש רקע · ריכוז) sits on top of the text.** It is translucent, so its labels overprint the body text, and "רעש רקע" wraps to two lines (`L_1300_light_q1.png`, `s_1300_light_top.png`, `L_m400_dark_mid.png`).
2. **The composer takes about 150px permanently** (120px plus the chips row), so the usable reading height is about 690 of 900px, or about 560 of 850 on mobile.
3. **Frames everywhere.** Dashed boxes in brown, green, blue, olive and teal stack one after another (`s_1300_light_q3.png`, `s_p_scratch.png`). Every block shouts at the same volume: a key formula is no louder than a "מסלול מעשי" notebook card. The colours stop carrying meaning.
4. **Math inside Hebrew prose breaks the line.** Long inline LaTeX chains wrap mid-expression and flip direction (`L_1300_light_q1.png`: the Cardano check spans 4 lines with "= 20." orphaned). The refresh meta line has garbled bidi (`L_1300_light_q3.png`). "since" leaks English into a display equation. Trivial equations get numbers (`y=f(x)` (14), `L_1300_dark_mid.png`).
5. **A source chip at the start of almost every paragraph** ("קולמוגורוב א · עמ' 44"). It is useful, but it is the first thing the eye hits on every paragraph.
6. **Think blocks are click-to-reveal with no commitment** ("חשבתי. הראו תשובה", `s_p_think_after.png`). This is the core of the "passive wall" complaint. Explaining something to himself costs one click and gets nothing back.
7. **The lesson TOC shows "חלק 1/2/3"** with no titles, no position inside a part and no map of the key results (`s_p_toc.png`). In a 93-minute part there is nothing to orient by.
8. The resume toast covers the text and stays up (`s_1300_light_top.png`). The vertical-rl rail labels at both edges read sideways.
9. Dark mode: the 3D membrane surface almost disappears against the dark scene (`s_1300_dark_mid.png`). The rest of dark mode is good.
10. Bidi in the module page: "Introduction · 1.2 Very Early Developments 1.1" has its numbers detached from their titles (`s_01_module.png`).

## The sketches (sk_*) and the flow
- **Much better visual language:** one 4px coloured spine on the right plus a small coloured label, on a paper sheet (`sk_lesson_1300_light.png`). The 3-part keep cards (נלמד/חושל/הוכח) and the calibration rail make progress visible.
- **The commit flow works and feels good:** the option fills, the verdict pill shows "צדקת · ביטחון 80%", the side rail updates, and the gated derivation is blurred until he commits (`sk_flow_2_revealed.png`, `sk_flow_3_second.png`).
- **The friction is the confidence slider.** It must be dragged from an "untouched" 50 before the commit button enables, and nothing says so until the button sits disabled (`sk_flow_0/1`). The L-flow specifies 3 buttons (מנחש/די בטוח/בטוח); use those.
- **A wrong answer gets weak feedback:** "לא הפעם · ביטחון 90%" and then the correct answer, with no "why yours was attractive" line and no special treatment for a confident error (`sk_flow_wrong_400.png`). High-confidence errors are the best learning moment, and the sketch passes over them.
- **On mobile, display formulas wrap into a stack** with an orphaned ")" (`sk_lesson_400_dark_mid.png`).
- The sketch uses HTML-italic math and the app uses KaTeX. The look has to be ported to the app, not left as a separate style.
- **The L-flow's "collapse" is the main risk to the no-cut rule.** About 2,400 of 6,282 words are hidden on the fast path. It is acceptable only if the collapsed state reads as "you proved this, here it is folded" and never as "removed".

## Top 20 improvements (ranked by impact on learning × joy; nothing is cut)
1. **Commit widgets replace click-reveal thinks.** Choice, number with tolerance, or one line, plus 3 confidence buttons in a single row: `.commit{display:grid;grid-template-columns:1fr auto}`. Enter commits. The tutor already writes the `think` blocks; only the renderer changes.
2. **Confident-error moment.** When the answer is wrong and confidence is "בטוח", show a red-spine card: "למה התשובה שלך מפתה" plus the one line that fixes it, which goes straight into the review queue. A soft sound, not a buzzer.
3. **Replace dashed frames with spine callouts.** Use `border:0;border-inline-start:4px solid var(--k);background:color-mix(in oklab,var(--k) 6%,var(--paper))`. Keep a full frame for only 3 "anchor" roles: definition, formula and keep.
4. **Three colour tiers instead of 19 hues.** Tier A (structural: definition, formula, keep) gets ink plus a strong accent. Tier B (active: think, exercise, derivation step) gets the action colour. Tier C (context: story, history, domain, today, casestudy, notebook) gets muted spines. Each kind keeps its own label and icon.
5. **Fix the bottom chrome.** Merge the floating dock into the composer bar as one opaque 44px strip, and shrink the composer to a single-line pill that expands on focus. This gains about 110px on desktop and 150px on mobile.
6. **Fix mobile overflow.** Hide the left rail under 700px (`.left-rail{display:none}`) and move it into a bottom sheet. Set `min-width:0` on the grid children. Make the drawer `width:min(88vw,360px)` with `inset-inline-start:0`.
7. **A real lesson outline:** headings plus the key-result names, with a ✓ on each committed probe and a "you are here" dot. Show "עוד 12 דק' בחלק" per section, not 93 minutes per part.
8. **Inline math hygiene.** Wrap each inline `.katex` in `<bdi dir=ltr>` with `white-space:nowrap`. Promote chains longer than about 40 characters to display math in the renderer. Give display math `overflow-x:auto` and never wrap it. Number only `formula`-block equations (a prompt rule as well).
9. **Source chips move to the margin.** Use `float:inline-end;margin-inline-end:-7rem` on wide screens and a tiny superscript "¹" on narrow ones, so the text starts with words.
10. **Gated derivations with blur** (from the sketch). `.gated{filter:blur(4px);pointer-events:none}` until commit. The full content is always there one tap later, which makes the no-cut rule visible.
11. **Collapsed units styled as "earned".** A green check, "הוכחת · 2 שורות", and a dotted underline to expand. Count expanded words in the progress bar so depth is visibly whole.
12. **Faded steps in derivation blocks.** One `[צעד]` input per derivation, with a hint ladder whose rungs are visible as 3 small dots.
13. **A display-formula card for key results:** centred, larger KaTeX (1.25em), and a small "תחום תקפות" footer. This makes them distinct from illustrative equations.
14. **Session rhythm for 8-hour days.** After about 25 minutes, a quiet chip in the status strip ("הפסקה? 5 דק'"), plus an optional end-of-part "3 שאלות שליפה" card. Also give the dark theme a warmer night variant.
15. **Calibration rail in the app** (from the sketch): the running ✓/✗ × confidence for the lesson, shown in the left dock.
16. **Contrast:** raise `--muted` to about #5a5d4c (≥5.3:1), make meta text at least 12.5px, and push the dark 3D materials to `emissive` or more light.
17. **Reduced motion:** a global `@media (prefers-reduced-motion){*{scroll-behavior:auto!important;animation-duration:.01ms!important}}`. 3D tours and anim blocks must not autoplay. Typing sounds stay opt-in.
18. **Focus states:** audit the 10 `outline:none` rules and give every widget `:focus-visible{outline:2px solid var(--accent);outline-offset:2px}`. Commit widgets must work fully from the keyboard (1–4 choose, Enter commits).
19. **Rails and toasts:** use horizontal icon-plus-label tabs instead of vertical-rl text, and let the resume toast auto-hide after 4 seconds.
20. **One token sheet shared by both apps** (`shared/theme.css`), with the lab accent as the only difference. Lanchester's 7 `--l25-*` colours are missing from Gilua, so 2.5 tags look different in the two apps.

## Keep (excellent)
- The cream/graphite palette and the IBM Plex Hebrew 17px/1.9 body.
- The Aa panel (font, size, spacing, width, background, focus mode, sounds, cursor, noise), which is complete and well grouped (`s_p_aa.png`).
- Margin notes with their 4 kinds (`s_p_note.png`).
- The Explain panel's plain-explanation structure.
- Live 3D, charts and anim blocks with their figure captions.
- The real source figures with page and doc metadata.
- The resume-reading position and the progress hairline.
- The `[[מונח]]` hover terms and the fieldmap lists.
- From the sketches: spine callouts, the blur gate, the verdict pill, the keep cards and the "היום" day plan.
