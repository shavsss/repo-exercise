# A2 rewrite 2: the extremum / Lagrange section of Gilua M0.1 L3

**Source:** Gilua M0.1 lesson 3, section "בעיות קיצון: המכל שצורך הכי מעט פח" (blocks 131–148, 18 blocks, of which the `scene3d` and the `chart` are interactive payload and are kept unchanged).
**Checklist:** 43 depth units, E1–E43 (`A2_units.json` → `rewrite_checklists.lagrange`). Source with unit markers: `A2_src/lagrange_v2.md`. The audit script is `A2_audit.py lagrange v2`.

## Result

| | original | v1 | v2 (final) |
|---|---|---|---|
| prose words (without the scene and chart JSON) | 1,692 | 1,142 | **1,167** |
| ratio to original | 1.00 | 0.675 | **0.690** |
| ratio, without the `keep` block | – | 0.639 | 0.662 |
| depth units kept | 43/43 | 43/43 (one partly) | **43/43** |
| words per depth unit | 39.3 | 26.6 | **27.1** |
| sentences, mean words / share under 8 words | 12.6 / 23% | – | 14.4 / 19% |

This was already the densest section of the lesson (77% core words, against 50% for the lesson as a whole), so the gain is smaller than in the Napier section. The words were saved by:
- removing the page narration ("היישום השלישי ב-K1:62 הוא החלק שבו נתעמק", 40% of block 131);
- removing the figure walk-through ("באיור רואים גליל 'ריבועי'...");
- removing announcements ("ולכן נגזור את השיטה הכללית... השיטה תחזור בצומת האופטימיזציה...");
- removing the repeated "we skipped the algebra" notes and the "המספרים מפתיעים" lead-ins;
- moving the generalisations into one mapping table.

## v1 → v2 audit
- Marker audit: all 43 markers were present in v1.
- Number-fidelity audit: it found a real partial loss in **E16**. The mental route to the *area*, $6\pi r^2=1.5\pi d^2\approx4.7\times1.17\approx5.5$ m², had been dropped, and only the route to the diameter was left. Restored in v2.
- The audit also flagged the gradient numbers $\nabla S=(13.62,3.405)$ and $\nabla V=(3.69,0.923)$. They are illustration, not a unit, but they are the only place where $\lambda$ becomes a number you can see. Restored as one sentence.
- Content audit: v1 dropped the link to the learner's own note ("נקודה 2 בחידוד הלוגי"). It is not a depth unit, but it ties the critique to his article work. It is the kind of personal hook that keeps a dense text engaging, so it was restored (+28 words).
- The `keep` block was cut from 5 lines to 3.
- Net result: +25 words. v2 is slightly *longer* than v1, by choice: the one unit that was partly lost and the one personal hook are worth more than 2% of length.

## Final text (v2)
