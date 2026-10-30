"""Builds A3v3_checklist.md: every unit (A2 checklist N/E, judge J1 inventories, judges' lost/weakened lists, J2 fixes,
factual fixes) -> location in v3 + a probe string that must occur in the v3 file. Fails loudly if a probe is missing."""
import re
LOG=open('A3v3_log.md',encoding='utf-8').read(); LAG=open('A3v3_lagrange.md',encoding='utf-8').read()
L=[ # (id, unit, location, probe)
('N1','Log defined by rate y\'=c/x, not as inverse of a^y','definition block (5)',"y'=\\frac{c}{x}"),
('N2','Domain x>0; x→0 rate diverges, y→−∞','definition block (5)','הקצב מתבדר'),
('N3','y(1)=0 → unique y=c ln x','definition block (5)','הפתרון יחיד'),
('N4','P speed = remaining x → 1/x; never arrives','"איך נאפייר" ¶, הנחה ראשונה','ולעולם אינה מגיעה'),
('N5','Q constant speed = clock; NL = Q distance','"איך נאפייר" ¶, הנחה שנייה','הדרך שלה היא שעון'),
('N6','10^7 = sine-table radius, integer sines','"איך נאפייר" ¶','רדיוס המעגל של טבלאות הסינוסים'),
('N7','NL(x)=10^7 ln(10^7/x), c=−10^7, y=0 at 10^7; NL(5e6)','(6)','6{,}931{,}472\\tag{6}'),
('N8','No instantaneous velocity; motion intuition','after (6)','בלי מושג של מהירות רגעית'),
('N9','Need: 7-digit multiplication → addition','opening ¶','מספרים בני שבע ספרות'),
('N10','k cancels: where 1/x works','derivation steps 2–3','כאן עובדת הצורה $1/x$'),
('N11','y(kx)=y(x)+y(k)','derivation step 4 (7)','y(kx)=y(x)+y(k)\\tag{7}'),
('N12','y(k^m)=m y(k); base b with y(b)=1','derivation step 5','y(k^m)=m\\,y(k)'),
('N13','c=1→ln, e=2.71828; log10 needs 0.4343','derivation step 6','0.4343'),
('N14','Scale invariance; ratio not difference; ratios as distances (continuous-only qualifier added)','"העיקרון" ¶','בין הפונקציות הרציפות'),
('N15','ln=2.3026 log10; c only a unit','(8)','2.3026'),
('N16','NL decreasing, NL(x)+NL(y)=NL(xy/10^7); powers of 10^7; Briggs log1=0, log10=1','¶ after (8)','\\mathrm{NL}(xy/10^7)'),
('N17','ln x ≤ x−1 by slope argument','refresh block','\\ln x\\le x-1'),
('N18','b/ln b ≥ e, min at e','refresh block','b/\\ln b\\ge e'),
('N19','base 3 +0.46%, 2 +6.1%, 10 +60%','refresh block','0.46%'),
('N20','2^10≈10^3 → log2≈0.30 (0.34%); log5, log8, log6','"עוגנים" bullet 1','0.34%'),
('N21','dB: ×2=3.01, ×10^6=60; voltage ×2=6.02 (P∝V²)','"עוגנים" bullet 2','ההספק הולך כריבוע'),
('N22','ADC bit = +6.02 dB','"עוגנים" bullet 2','כל ביט בממיר'),
('N23','Table: 14 digits, 3 lookups+add+interp, one-time cost used for centuries','"הפשרה" ¶','שלושה עיונים'),
('N24','0.1 mm on 25 cm → 9.2e-4 → ~3 digits','"הפשרה" ¶','9.2\\times10^{-4}'),
('N25','Constant relative error = floating point (uniform rel. precision, few digits, max speed)','"הפשרה" ¶','דיוק יחסי אחיד, מעט ספרות ומהירות מרבית'),
('N26','3 digits sufficed 300 years: loads/material data no better','"הפשרה" ¶','שלוש מאות שנה'),
('N27','No 0, no negatives; left end 1','think 2 answer','בקצה השמאלי עומד 1'),
('N28','log(a+b) not simple','think 2 answer','\\log(a+b)'),
('N29','Every transform: one op cheap, another dear','think 2 answer','מוזילה פעולה אחת ומייקרת אחרת'),
('N30','User tracks sign & power of 10 = mantissa/exponent','think 2 answer','מנטיסה ומעריך'),
('N31','Two 60 dB → 63.0 dB; chain +20−6+20=34','domain block, דציבל','63.0 dB'),
('N32','Octave ×2, 12 equal semitones, log2 f, transposition = scale invariance','domain block, אוקטבה','12 חצאי הטונים'),
('N33','Richter ×10 amplitude, E∝A^1.5 → ×31.6, ×1000','domain block, ריכטר','31.6'),
('N34','Log scale when many orders of magnitude & ratios; senses; ear = biological slide rule','domain block, last ¶','סרגל חישוב ביולוגי'),
('N35','Digit count ≈ log','fieldmap line 1','מספר הספרות של מספר'),
('N36','Log-log plots: cascades add','fieldmap line 3','שרשור של מערכות'),
('N37','Information = log of possibilities; adds','fieldmap line 4','המידע הוא הלוגריתם'),
('N38','Isothermal work ∝ ln(V2/V1)','fieldmap line 5','יחס הנפחים'),
('N39','Diode-type log circuit','fieldmap line 6','מעגלים שמחשבים לוגריתם'),
('N40','Binary search: ×1000 → ~10 steps','fieldmap line 7','כעשרה צעדים'),
('J1L#1','Contrast with the modern definition x=a^y','opening ¶','אם $x=a^y$'),
('J1L#3','y\' used intuitively, defined in part 4','definition block','ההגדרה המדויקת תבוא בחלק 4'),
('J1L#15','§5 cites the log as the variable concept before Newton–Leibniz','opening ¶','§5 מביא אותו'),
('J1L#25','NL numeric check: ratio ½ gives the same distance','"העיקרון" ¶','23{,}025{,}851-16{,}094{,}379'),
('J1L#28ex','Example 2×6,931,472=NL(2.5×10^6)','¶ after (8)','2\\times6{,}931{,}472=\\mathrm{NL}(2.5\\times10^6)'),
('J1L#30','WHY C(b)∝b/ln b: price per digit ∝ b × digits ∝ 1/ln b','refresh block','מספר המצבים שהיא מבחינה ביניהם'),
('J1L#27','K1:52 OCR formula erratum with verification','erratum block, line 1','K1:52'),
('J1L#51tags','Fieldmap status tags (נלמד / צומת / גשר / פריפריה) = open-connections record','fieldmap block','(גשר תרמודינמיקה)'),
('J1L#52','Names/dates errata (Tusi, Viète, al-Kashi, 158 years, cubic history)','erratum block, lines 2–4','158'),
('J1L#53','Closing synthesis and transition to §6','closing ¶','ב-§6 נעבור'),
('J1L-w42','"few digits, max speed" restored','"הפשרה" ¶','מהירות מרבית'),
('J1L-wstep1','"approximately" kept in derivation step 1','derivation step 1','גדל בערך'),
('J2L-dt','dt removed; "בפרק זמן קצר" instead; every symbol named at first use','"איך נאפייר" ¶','בפרק זמן קצר'),
('J2L-NL','NL paragraph linked into the thread','¶ after (8), opening clause','הפרשים של $\\mathrm{NL}$ מתנהגים יפה, אבל סכומים לא'),
('J2L-link','Link sentence "why is c/x useful?" before the derivation','end of Napier ¶','אבל למה קצב $c/x$ שימושי'),
('J2L-commit','Commit-before-reveal think placed just before its derivation','think 1','התחייבו לפני שתפתחו'),
('FMT-def','Definition before example (definition block before Napier instance)','definition block','```definition'),
('FMT-keep','Key vs illustration: keep block only key formulas','keep block','```keep'),
]
G=[
('E1','Closed cylinder, fixed V: min surface at h=d (K1:62–63)','opening ¶','[[K1:63]]'),
('E1fig','Book figure K1:63:0, verbatim','figure block','K1:63:0'),
('E2','Squat pays ends, tall pays wall → interior min','¶ after figure','גליל נמוך ורחב'),
('E3','Two variables tied by a constraint','¶ after figure','**שני** משתנים'),
('E4','Substitution: S(r)=2πr²+2V/r → V=2πr³ → h=2r','"דרך ההצבה" ¶','S(r)=2\\pi r^2+2V/r'),
('E5','Substitution fails for trajectories/robots/systems; Lagrange recurs in optimisation, thermo, learning','"דרך ההצבה" ¶','באופטימיזציה, בתרמודינמיקה ובלמידה'),
('E6','Partial derivative (other held fixed); each an ordinary derivative as in (20); values for S','definition block + derivation step 1','כמו ב-(20)'),
('E7','Gradient: steepest ascent, ⊥ level curves','definition block','ניצב לקווי הגובה'),
('E8','First-order move along constraint leaves S unchanged (else move downhill) → ∇S=λ∇V; smoothness assumption named','derivation step 2','היינו זזים לכיוון שבו $S$ יורד'),
('E8b','Explicit assumption: S, V smooth, first order (v2 gain kept)','derivation step 2','$S$ ו-$V$ חלקות'),
('E9','Lagrangian L; stationarity gives (28) and constraint','derivation step 3','\\mathcal L(r,h,\\lambda)'),
('E10','λ=2/r; h=2r; V0=2πr³ (steps split)','derivation steps 4–6','V_0=2\\pi r^3'),
('E11','r=(V/2π)^{1/3}, S_min=6πr²','formula (29)','S_{\\min}=6\\pi r^2'),
('E12','Validity: closed, uniform price & thickness, area only','formula (29) body','ורק השטח נספר'),
('E13','λ = shadow price','"מה λ אומר" ¶','מחיר הצל'),
('E14','S∝V^{2/3}; ×1.59; dS/dV=(2/3)S/V=3.69=2/r','"מה λ אומר" ¶','2^{2/3}=1.59'),
('E15','Balance ends ∝r² vs wall ∝rh','"מה λ אומר" ¶','שגדל כמו $rh$'),
('E16','1 m³: 0.5419, 1.084, 5.536; π/4 mental route ×1.08','"עוגנים" ¶','(1/0.79)^{1/3}'),
('E17','Cube 6 m² (+8%); sphere 4.836 (×0.874); isoperimetric (dating corrected); cylinder 14% worse','"עוגנים" ¶','4.836'),
('E18','Cylinder: rolled sheet, stands on floor','"עוגנים" ¶','מגלגלים אותו מפח'),
('E19','Level curve touches, not crosses','¶ after scene','**נוגע**'),
('E20','∇S∝(4,1); slides along h=2r; scale invariance (Napier link)','¶ after scene','\\nabla S\\propto(4,1)'),
('E21','κ=h/d; r∝κ^{-1/3}; S=2πr²(1+2κ); (30); ln-derivatives 0 and 2/9','¶ before (30) + after','r\\propto\\kappa^{-1/3}'),
('E22','Penalties 1.1→0.10%, 1.5→1.75%, 2→5.0%, 0.5→5.8%','¶ after chart','0.10%'),
('E23','Smooth min quadratic: cannot lose/gain much; cannon 30° vs 45° = 13%','¶ after chart','30° במקום 45°'),
('E24','Real limit = assumptions; broken one moves the optimum','¶ after chart','מזיזה את האופטימום עצמו'),
('E25','Quadratic bowl in control tuning, squared-error training, position fix','fieldmap line 1','ריבוע השגיאה'),
('E26','Iso-cost tangent to budget; λ = value of one more budget unit','fieldmap line 2','קו שווה-מחיר'),
('E27','Thermo multiplier — CORRECTED to 1/(k_B T)','fieldmap line 3','1/(k_BT)'),
('E28','Ends ×k → λ unchanged, h/d=k (31)','think 3','\\frac hd=k\\tag{31}'),
('E29','k=2 built h=d → +5.8% (third chart curve)','think 3','העקומה השלישית'),
('E30','Shape reveals price ratio; "flat but moves"','think 3','המינימום שטוח, אבל זז'),
('E31','Can 66×122, h/d≈1.85; (29) says 76.7','"פחית" ¶','76.7'),
('E32','Ends thicker/harder alloy → k≈2 → h/d≈2','"פחית" ¶','k\\approx2'),
('E33','Body 66.2 mm → 103 mm, h/d 1.56; neck/dome/headspace; +2.1%','"פחית" ¶','103 מ"מ'),
('E34','Other cost terms: lid metal saving, grip, filling & vending machines, shelf','"פחית" ¶','מכסה צר חוסך מתכת יקרה'),
('E35','Hoop stress: t=ρgzr/σ; ρ, g, z, σ named','"מכל אגירה" ¶','\\rho gzr/\\sigma'),
('E36','Steel = V(2t_min/h+ρgh/σ) WITH intermediate wall integral πr²ρgh²/σ','"מכל אגירה" ¶','\\pi r^2\\rho gh^2/\\sigma'),
('E37','h_opt=√(2t_min σ/ρg), independent of V','(32)','אינו תלוי בנפח'),
('E38','13.99 m water, 15.17 m oil','after (32)','15.17'),
('E38b','Oil lighter → taller (∝1/√ρ), ρ≈850','after (32)','נוזל קל לוחץ פחות'),
('E39','Real tanks 15–20 m, grow in diameter; 1 ML vs 100 ML','after (32)','מאה מיליון'),
('E40','Ignores wind, quakes, foundations, land; assumptions enter in two places','after (32)','בשני מקומות'),
('E41','Critique: what is minimised; limits free floor (k=½) → ½, depth → h/d≪1','"ביקורת" ¶','k=\\tfrac12'),
('E42','Flatness (CORRECTED, asymmetric) → outside constraints decide; correct formulation','"ביקורת" ¶','גבוה ב-50% או נמוך בשליש'),
('E43','Flat min: wrong assumption moves decision more than numbers; notebook link','"ביקורת" ¶','חידוד הלוגי'),
('J1G#21','3D scene + tour, verbatim','scene3d block','"type": "surface"'),
('J1G#22','Numeric gradients (13.62, 3.405), (3.69, 0.923)','¶ after scene','13.62'),
('J1G#29','(30) ↔ (13): x=κ−1, a=2/9','¶ after (30)','a=2/9'),
('J1G#34','Chart (exact, quadratic, k=2), verbatim','chart block','"type": "line"'),
('J2G-sym','Every symbol named at first use (ρ, g, z, σ, t_min, d, S_min, λ, κ, k_B, T)','tank ¶, (29), fieldmap','$\\rho$ צפיפות'),
('FIX-asym','"50% costs <2%" made correct and asymmetric (+50%: 1.75%; −50%: 5.8%; <2% only for 0.66<κ<1.54)','¶ after chart + critique + keep','0.66<\\kappa<1.54'),
('FIX-asym2','Why asymmetric: symmetric in ratio; ln-κ approximation (5.3% vs 11% at κ=2)','¶ after chart','(\\ln\\kappa)^2/9'),
('FIX-can','Can: compare body h/d 1.56 (not 1.85) with model; 2.1% vs k=1, 0.7% vs k=2','"פחית" ¶','0.7%'),
('FIX-iso','Isoperimetric: Greeks claimed, full proof 19th c.','"עוגנים" ¶','במאה ה-19'),
('FMT-def','Definition block (general f(x,y)) before the tank example','definition block','f(x,y)'),
('FMT-think','Commit-first thinks just before their answers (angle; κ=1.5/0.5; ends ×k)','3 think blocks','התחייבו לפני שתפתחו'),
('FMT-keep','keep block: key formulas only','keep block','```keep'),
]
_o=open('blind/lagrange_X.md',encoding='utf-8').read().split('\n')
for _a,_b in ((4,8),(44,64),(75,86)): assert '\n'.join(_o[_a:_b]) in LAG, 'visual block not verbatim'
def run(rows, text, name):
    out=[]; miss=[]
    for i,u,loc,p in rows:
        ok = p in text; (miss.append(i) if not ok else None)
        out.append(f"| {i} | {u} | {loc} | {'✓' if ok else 'MISSING'} |")
    return out, miss
lo,lm=run(L,LOG,'log'); go,gm=run(G,LAG,'lag')
assert not lm and not gm, (lm,gm)
md=f"""# A3 v3 unit checklist

Every unit of the original (the A2 checklist N1–N40 / E1–E43, plus the judges' inventories) and every item on the judges' lost/weakened lists → where it sits in v3. Each row has a probe string that `A3v3_checklist_build.py` checks is present in the v3 file; the build fails if one is missing. Result: **log {len(L)}/{len(L)}, Lagrange {len(G)}/{len(G)} present.**

## Napier / logarithm (`A3v3_log.md`)

| id | unit | location in v3 | probe |
|---|---|---|---|
""" + '\n'.join(lo) + """

J1's other log units (#2, #4–14, #16–24, #26, #29, #31–50) are the same content as N1–N40 above. J1 #51 (fieldmap) is covered by N35–N40 plus the status tags.

## Tank / Lagrange (`A3v3_lagrange.md`)

| id | unit | location in v3 | probe |
|---|---|---|---|
""" + '\n'.join(go) + """

J1's other Lagrange units (#1–20, #23–33, #35–46) are the same content as E1–E43 above.

## Notes
- **Verbatim blocks.** `figure` K1:63:0, `scene3d` and `chart` were copied byte-for-byte from `blind/lagrange_X.md` (the build script asserts it). The log section had no visual blocks.
- **Block semantics kept.** `domain`, `fieldmap` (with status tags, which feed the course memory's open connections), `refresh` (@first) and `erratum` stay as typed blocks rather than the v2 table, because the app uses them. Duplication was removed inside them instead.
- **Placement.** The erratum and fieldmap come at the end of the section (rule 3). The two K1:49–51 name/date slips are one-liners in the same erratum block (the rule for trivial OCR slips).
- **Think budget.** 2 (log) + 3 (Lagrange) = 5 think blocks. The rule allows about 6 per lesson, so the rest of lesson 3 has room for about one more.
- **Word counts** (`A3v3_count.py`; Hebrew-letter tokens, JSON of scene3d/chart excluded; v2 with its ⟦⟧ markers stripped):

| section | original | v2 | v3 | v3/orig | v3/orig, without errata and keep | v2/orig |
|---|---|---|---|---|---|---|
| log | 1,601 | 776 | 1,093 | 0.68 | 0.70 | 0.48 |
| Lagrange | 1,457 | 896 | 1,131 | 0.78 | 0.76 | 0.62 |
| both | 3,058 | 1,672 | 2,224 | 0.73 | 0.73 | 0.55 |

  Counting all tokens, LaTeX included (the A2 convention), the ratios are 0.72 for log and 0.84 for Lagrange.
- **Numbers.** `A3v3_numbers.py` recomputes every number in both files: 78/78 OK.
"""
open('A3v3_checklist.md','w',encoding='utf-8').write(md); print('log',len(L),'lag',len(G),'all present')
