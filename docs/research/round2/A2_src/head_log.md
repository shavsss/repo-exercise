# A2 rewrite 1: the logarithm (Napier) section of Gilua M0.1 L3

**Source:** Gilua M0.1 lesson 3, section "הלוגריתם של נאפייר: משוואה דיפרנציאלית לפני החשבון הדיפרנציאלי" (blocks 44–59 in `A2_coding.py`, 16 blocks).
**Checklist:** 40 depth units, N1–N40 (`A2_units.json` → `rewrite_checklists.log`). Source with unit markers: `A2_src/log_v2.md`. The audit script is `A2_audit.py log v2`.

## Result

| | original | v1 | v2 (final) |
|---|---|---|---|
| prose words | 1,880 | 1,043 | **1,032** |
| ratio to original | 1.00 | 0.555 | **0.549** |
| ratio, without the `keep` block | – | 0.518 | 0.521 |
| ratio, if the original's off-topic names erratum is not counted (1,681) | – | 0.620 | 0.614 |
| depth units kept | 40/40 | 40/40 | **40/40** |
| words per depth unit | 47.0 | 26.1 | **25.8** |
| sentences, mean words / share under 8 words | 13.9 / 15% | – | 16.6 / 16% |

The sentence profile hardly changes, so the text is not telegraphic. The words were saved by removing whole functions, not by squeezing sentences:
- the section recap (block 59, 73 words);
- an erratum about names and dates from §5.1–5.2 that does not belong to this topic (block 58, 95 words);
- meta paragraphs ("[[2.5: מבנה משותף]] משוואה (5) ותכונה (7) מופיעות בכל מקום... בבלוק הבא שלוש דוגמאות", block 55);
- a repeat of the lesson-1 values of $b/\ln b$;
- the check of $\mathrm{NL}(10^6)-\mathrm{NL}(2\times10^6)$, an illustration of N14 with no new unit;
- prose that was turned into one mapping table. The domain block and the fieldmap had said the same mappings twice.

## Format used (the "dense lesson" template)
1. **One question as the thread** (one sentence). History appears only where it carries a unit (N6, N8, N16, N23, N26).
2. **Definition first** (`formula` block with its domain of validity), then the derivation skeleton. Each assumption is bolded at the step where it enters.
3. **Commit-before-reveal** `think` blocks placed *before* the result they test. One comes before the derivation, one after the slide rule.
4. **"לזכור" anchors** kept apart from illustrations. Only anchors go into `keep`.
5. **The trade-off, the limits and the critique** as short paragraphs, each opening with its claim in bold.
6. **Cross-domain mappings as one table**: field | what is multiplied | what follows. One row per field, and each row is a testable unit.
7. **No** recaps, signposting, page narration or certainty tags on settled history.

## v1 → v2 audit
- Marker audit: v1 already contained all 40 markers.
- Number-fidelity audit: every number in the original that is missing from v1 is one of these: a page number, a date from the unrelated erratum, the lesson-1 values of $b/\ln b$ (restatement), the $\mathrm{NL}$ arithmetic checks (illustration), or a rounding ($0.301$→$0.30103$, $2.718$→$2.71828$, $1024$→$2^{10}$). None of them carries a unit.
- Content audit: one partial loss. N23 lost "the table was then used for centuries", the reason the one-time cost was worth it. Restored in v2.
- v2 also merged the `keep` block from 5 lines to 3. Net result: −11 words.

## Final text (v2)
