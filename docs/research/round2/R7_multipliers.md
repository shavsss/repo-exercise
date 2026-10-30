# R7. Multipliers: how close to "a few months" can we get without losing depth?

Critic's brief: attack V3's "~8 months at 7 h/day" from the optimistic side, and keep every claim honest. Inputs: CONTEXT, V3, T, A1 (simulation and frontier), A2 (unit coding, recounted here), A3, A6, and round-1 A/D. Evidence tags: **[V]** = verified in round 1 (A_learning_science.md); **[U]** = cited from memory, not checked in this session; **[calc]** = my arithmetic on A1/A2 numbers; **[guess]** = a judgment call.

## 0. Verdict

V3 is right that the per-hour arithmetic has no slack. Dense lessons, the factory and dedup are already priced in. V3 is too pessimistic in two places:
1. **It counts only desk hours.** Roughly 15% of the hybrid's hours are retrieval-type work: review, estimate drills and oral teach-back. That work does not need a desk, and the evidence says it works just as well done in the head (covert retrieval ≈ overt retrieval [U: Smith, Roediger & Karpicke 2013]).
2. **It reports the P50 and leaves out the tail.** A1's own P10 for "both curricula at 7 h/day" is 7.2 months, and the 2-week pilot is exactly what tells us which tail we are in.

With the multipliers below, run at 7 desk hours plus about 1 mobile hour a day:
- **Core of both: ~5 months at P50 (4.3 at P10, 5.9 at P90).**
- **Everything: ~6.7 months at P50 (5.7 / 7.9).**

That takes about 1.3 months off V3's figures for each. "Three to four months for everything" is still not honest at full depth.

The biggest gain is not audio lessons. It is **moving retrieval off the desk** and **letting what he already knows collapse lessons inside Lanchester**.

## 1. Time multipliers: turning dead time into learning time

### 1.1 What in a level-2.5 lesson survives audio? (measured on A2's coded units)
I recounted the 462 depth units that A2 coded by hand [calc, `A2_units.json`]:

| Unit type | Gilua L3 | Gilua L1 | Lanchester L1 | Survives audio? |
|---|---|---|---|---|
| STR structure, MAP cross-field, PRX practice, CRT critique, TRD trade-off, LIM limits, OPS operational meaning | 52% | 62% | 49% | **Yes, as a second exposure.** These are claims in words. |
| OOM order-of-magnitude anchors | 10% | 11% | 19% | **Partly.** A heard number is fine; deriving it needs paper once. |
| DEF definitions, RES formulas, STEP derivation steps | 38% | 27% | 31% | **No.** Symbols, structure and where an assumption enters need eyes and a pencil. |

So about half of the depth units can be carried by voice. But they all *point at* the equations in the bottom row: "the R⁴ is what makes jamming cheap" means nothing if you have never seen the equation.

Evidence on listening versus reading:
- Comprehension of expository text is at best equal when listening, and usually a little worse, because reading is self-paced and you can look back [U: Clinton-Lisell 2022 meta-analysis; Daniel & Woody 2010, podcast vs text].
- Listening while walking adds a dual-task cost.
- Listening while driving should not be used for new material at all.

**Conclusion.** First exposure stays at the desk. Audio has two legitimate jobs:
- **Pre-listen (priming)**, on the evening walk before the next day's lesson. Pre-questions improve memory for the material they target, g ≈ 0.54, and more when the learner generates an answer [V: St. Hilaire 2024]. A spoken "here are the 3 questions tomorrow's lesson answers; guess now" is the cheapest form of this.
- **Re-listen (consolidation)** of an *ear script*. This is a 600–900-word digest written for the ear: no equations, assumptions and limits in words, trade-offs, critique, the cross-field map. It is not TTS of the lesson. Reading a lesson aloud is the worst version, because Hebrew TTS will mangle LaTeX, unvoweled terms and English acronyms.

Neither job saves desk minutes directly. Both raise yield per desk minute. I credit audio with **0 h saved** and a small retention gain.

### 1.2 Moving retrieval off the desk (the real time multiplier)
The hybrid's hours (S7, ~1,400 h, from A1's split) [calc]:
- reading ~430 h;
- active work ~620 h;
- review ~210 h;
- projects ~110 h.

| Movable to phone or walk | Share | Hours |
|---|---|---|
| Review items: "rebuild the structure", "which assumption fails", "estimate X" | ~60% (the rest need writing a derivation) | ~125 |
| Estimate and Fermi drills from the forge (interval answers, ~2 min each) | ~10% of active work | ~60 |
| Teach-back on walks (spoken, or dictated into the phone and graded later) | replaces part of the delayed checks | ~20–30 |
| **Total** | **~15%** | **~200–215 h** |

These hours are moved, not deleted, so the gain is in the calendar. At 7 desk hours plus 1 mobile hour, the movable work (about 30 h/month available) more than fills the mobile hour. **Effective throughput rises by about 8/7, which is −12 to −14% on the calendar** [calc].

Cost to retention: none expected, as long as items are *production* prompts (said aloud or in the head), not recognition [V: retrieval works on structure when it requires producing it].

### 1.3 The guardrail: don't fill every gap
Brief wakeful rest right after learning improves retention [U: Dewar et al. 2012]. Also, mind-wandering rises with time on task [V: 2025 Psych Bull IPD meta-analysis]. So the rules are:
- **one** fixed mobile slot (a walk or commute of 40–60 min);
- the 10 minutes after each lesson stay empty;
- no review in bed.

If the learner has no natural dead time, this multiplier is close to zero. Converting rest time into study time is not a multiplier; it is just more hours.

### 1.4 Sleep, spacing and rhythm
- **Sleep-timed relearning.** Learning in the evening and relearning the next morning, after sleep, roughly halved the relearning trials needed and improved long-term retention [U: Mazza et al. 2016, *Psych Science*].
  - **Change:** the morning warm-up is seeded by *yesterday's last lesson*, not only by the 1–3–7 queue.
  - Cost: nothing. Effect: retention, maybe −10% on review load [guess].
- **Interleaving the two apps** (Gilua morning, Lanchester afternoon, forge between):
  - Evidence for interleaving is moderate and domain-dependent [V]. The bigger reason here is that changing task and modality counters time-on-task decline [V].
  - This does not save hours. It is what might make **7 h sustainable instead of 6**, and that alone is worth about −14% on the calendar.
  - Unproven: pilot U4 must measure late-hour yield.
- **Sprint plus consolidation.** Three sprint weeks (7 + 1 h) and then one week at about 4 h, filled with the project, the article and module-end checks.
  - Average desk time is about 6.2 h, so on paper this is *slower* than flat 7 h. In practice it is probably faster than flat 7 h that collapses in month 3 (T §3e).
  - Recommendation: keep T's light week every 7th week as the minimum, and let the pilot decide between 3+1 and 6+1.
- **Weekends.** Keep the rest day. A1 shows that going from 6 to 7 days saves about 15%. That figure ignores burnout, which is the main risk T names.

## 2. Work multipliers: doing less work without doing less depth

### 2.1 Test-out: what share of Lanchester can he place out?
I counted Lanchester's core pages (main + article, 7,172) by source [calc, syllabus.json]:
- **Mathematical or physical, where his field experience does not substitute for 2.5 depth:** Richards I–III (1,461), Siouris (567), Driggers EO/IR (471), APS boost-phase (463), SMAD (362), GPS (334), Ufimtsev, STAP, DRFM, cross-eye. Together about 70% of the pages. **Module test-out there is close to 0%.** Knowing how a radar is employed is not knowing where the R⁴ or the Swerling assumption enters.
- **Descriptive, operational or doctrinal, where he can place out:** avionics (212), UAV (192), naval weapons (164), tanks (74), the ATP doctrine (~200), P12 doctrine (78), Boyd (155), Link 16 operations (~230), and the descriptive parts of EW101 and AMD SE. Together about 1,500–1,700 pages (~22%). At a 50–65% pass rate on a *production* diagnostic, that is **11–14% of Lanchester core.**

That matches A1's assumption of 15%, so **module-level test-out adds nothing beyond V3.** Gilua's 7.5% in A1 is probably optimistic for a learner who is weak in formal math. One exception: he has already read Kolmogorov vol. 1 up to p. 240, which covers M0.1 and M1.1–M1.3 (pp. 11–236).
- A diagnostic there will probably convert those modules into **delta lessons** (limits, OOM, cross-field, critique only) rather than skips.
- Saving: about 15–25 h.

**Where the real test-out gain is: facet-level collapse inside lessons.**
- OPS and PRX units are about 14% of Lanchester units, and his expertise covers many of them. Long explanations for an expert are redundant or even harmful (expertise reversal) [V: Kalyuga 2003].
- **Design.** Every lesson opens with 3–5 pre-questions, which double as priming. Expansion blocks of type OPS, PRX, illustration and context collapse when he answers the matching pre-question right. DEF, RES and STEP **never** collapse.
- **Saving:** 15–25% of Lanchester reading (~150 h), so **25–40 h**. In later Gilua parts, as he becomes expert there too, perhaps another 10–20 h [calc + guess].

### 2.2 Teach a structure once, beyond page dedup
- MID dedup (13.8%) is already in V3. Beyond it, D3's "assumption-delta" instance lessons cover repeated structures: 39 structures modules (Gere/Ashby/Anderson), Doppler/MTI across apps, heat transfer twice.
- Instance compression is unmeasured: T gives cs 0.30–0.55.
- My estimate: an extra **3–6% (40–80 h)**, with real risk of false identities. Use the equation-match rule only, and measure it in pilot U1.

### 2.3 Projects certify mastery
- A project's validation table (book examples reproduced to tolerance) marks the CRs it uses as *proven*. That retires their delayed checks and stretches their review intervals.
- 8 projects × 8–12 CRs gives about 80 CRs, so **15–25 h**.
- Projects must **not** replace lessons: that is D2's closure debt.

### 2.4 Things that look like work multipliers but aren't
- **Pre-reading or skimming the source PDF.** It duplicates the lesson.
- **The factory.** It is already fully counted (−490 h in V3). What is left is to make sure the shelf never runs dry on mobile items too (§4).

**Net new work saved: ~95–170 h (7–12%)** [calc], before the time multipliers.

## 3. Re-sequencing for early wins and authority

The principle: **lead with the spike where his existing expertise multiplies the new math, and publish critique before synthesis.**

| Weeks | Gilua | Lanchester | Public output / interviews |
|---|---|---|---|
| 0 | diagnostic on K1 pp. 11–236 → M1.x as deltas; skip ahead to P4 if passed | diagnostic on descriptive modules (P8–P12 sources) | — |
| 1–4 | P4 Fourier/sampling → P6 probability, M6.6 detection | M0.1 dB/link → M2.1–M2.11 radar detection (P0 as deltas after the matching Gilua module) | wk 2: "Three numbers to check any range claim" (P12 claims checker, standing 1 h/week) |
| 4–8 | P5 control, P7 random processes | M2.12–M2.15 tracking → P4 EW core | wk 5: salvo/square-law piece; **wk 8: Flagship A Radar–EW Budget Lab**. First expert interview, built from the lab's assumption ledger |
| 8–12 | P8 optimisation/LA, P9 fields | P6 missiles/PN → M7.1–7.3 | **wk 12: Flagship B Track-to-Intercept**; second interview |

Why this order gives authority by month 2–3:
- **Critique pieces need fewer CRs than synthesis pieces.** A claims check needs about 5 CRs plus his domain knowledge.
- **Interviews at a high level need an assumption ledger, not completed curricula.** A6's project ledger is that ledger.

The only change to A6/T's order is the **week-0 diagnostic that skips Kolmogorov's general survey (the material he finds "long for nothing") when he passes it**. It is also the cheapest motivation gain on offer.

## 4. What to build, and what it costs

These sessions come on top of V3's ~25–30 build sessions.

| # | Feature | Where | Sessions | Notes / risk |
|---|---|---|---|---|
| 1 | **Pocket mode** (`#pocket`): phone layout of the review queue + estimate drills (interval entry, calibration logged) + one-tap self-grade + optional typed or dictated answer graded at the default tier | page | 1–1.5 | Highest value. Needs review v0 first. |
| 2 | **Dictated teach-back**: a "confused student" persona with a seeded misconception; he answers through his phone keyboard's dictation (Hebrew works on iOS and Gboard), not the page mic. **No microphone capability is available to Artifacts on this account** | page | 0.5–1 | Grading against the CR key; Opus on dispute |
| 3 | **Ear scripts**: factory writes a 600–900-word spoken-register digest + 3 pre-questions for tomorrow, per lesson | factory | 0.5 | Its V3 lint: no LaTeX, no symbol without a spoken name |
| 4 | Ear playback: (a) `speechSynthesis` he-IL in the page (0.3 session; voice quality varies by device; **stops when the screen locks on iOS**); or (b) factory renders MP3 with an open Hebrew TTS model and uploads it as assets, playable with the screen locked (1–2 sessions, quality and storage **unverified: probe first**) | page / factory | 0.3 or 1–2 | Try (a) for a week. Build (b) only if he actually listens. |
| 5 | **Adaptive collapse**: tagged expansion blocks + pre-question gate; DEF/RES/STEP never collapse; collapsed units still enter the review queue | factory schema + page | 1.5–2 | Second most valuable. A collapse must be logged so the coverage proof still holds. |
| 6 | Module diagnostics (12–15 production items, ≥85% and no structural miss; a delayed re-check at day 10) | factory + page | 1 | Recognition items are forbidden |
| 7 | Project-certifies-CR link in the ledger | factory | 0.5 | |
| 8 | Sleep-timed warm-up (yesterday's last lesson first) + sprint/rhythm planner | page | 0.5 | |
| | **Total** | | **~6–9** | Items 1, 5 and 8 first (~3.5 sessions) |

## 5. Revised calendar

Method [calc]:
- A1's S7 (both, everything, projects, test-out) and S9 (core only) hour distributions;
- minus 6–12% for new work multipliers (§2);
- throughput of 7 desk h + 1 mobile h, where the mobile hour is real because movable work of ~30 h/month exceeds it;
- A1's 24.2 study days/month.

| Plan | V3 (7 h desk) | **With multipliers (7 + 1)** P10 / **P50** / P90 | At 6 + 1 (P50) |
|---|---|---|---|
| Core of both (adv later) | 6.3 mo | 4.3 / **5.0** / 5.9 | 5.9 |
| Both, everything + 8 projects | 8.5 mo (S7) / ~8.2 (hybrid) | 5.7 / **6.7** / 7.9 | 7.8 |

Honest uncertainty:
- **The two unmeasured numbers** (CRs per page, minutes per CR) still dominate. Each is worth ±1.7 months at 5 h/day (A1's tornado). My multipliers are second-order beside them.
- **Total load.** 7 + 1 = 8 h of learning a day is above the ~7 h at which A1 expects yield to fall. The mobile hour is lower-intensity retrieval, but it is not free. **If pilot U4 shows late-hour yield below 80%, use the 6 + 1 column.**
- **Audio.** I credited 0 h. If he turns out to be a strong listener, the pre-listen might shorten desk reading by a few percent. Do not plan on it.
- **Best defensible "few months": the core of both, at full depth, with review and the first 5–6 projects, in ~5 months.** Everything takes ~6.5–7 months, and only if 7 + 1 is sustainable.

## 6. Ideas that would harm depth (reject)

| Idea | Why it is harmful |
|---|---|
| Audio-only first exposure to derivations, definitions or formulas | About a third of the units are DEF/RES/STEP, and every other unit refers to them. TTS of LaTeX and of unvoweled Hebrew terms is error-prone. You get familiarity without structure. |
| Speed reading, RSVP, or 1.5–2× playback of *new* technical content | Comprehension is the bottleneck, not eye movement [V: Rayner 2016]. Speed-up is tolerable only for re-listening known material [U]. |
| Skipping or capping review below ~15 min/day | Retention falls from 0.85 to ~0.25 (A1). Every hour "saved" is mostly forgotten. |
| Multiple-choice or recognition test-out | It places him out on familiarity. Test-out must use production items plus a delayed re-check. |
| Collapsing DEF/RES/STEP for "expert" material | His expertise is operational, not derivational. Expertise reversal does not apply to the math. |
| Projects replacing lessons (full JIT) | Closure debt (T §2.1). The flagship works and the surrounding results go untaught. |
| Claude writing the project's physics | It becomes a demo he watched (A6 §0.4) and is worth nothing as certification. |
| Cutting sleep or adding a 7th day | Sleep loss impairs next-day encoding [U: Yoo et al. 2007]. The 7th day costs more in month 3 than it buys. |
| Filling every gap with drills | It removes wakeful rest and consolidation, and it is the fastest route to the month-3 collapse. |
| Learning while driving | Safety, and divided attention. Pre-questions on a walk are fine. Nothing new at the wheel. |

## 7. What the pilot should add

Add to T's 2-week pilot:
- **(U6)** mobile minutes per day actually done, and recall on items reviewed on the move vs at the desk (same items, randomised);
- **(U7)** collapse rate and delayed recall on collapsed vs expanded OPS/PRX units;
- **(U8)** whether he listens to ear scripts at all.

These three numbers decide whether the 5- and 6.7-month figures hold, or whether we fall back to V3's 6.3 and 8.2.
