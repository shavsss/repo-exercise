# N. The weekly newspaper ("השבועון") for Gilua and Lanchester

Design + prototype. Prototype: `N_prototype.html` (screenshots in `shots/`). Everything below is a design; nothing in the repo was changed.

## 0. Verdict

The program is primarily engineering. Gilua's issue is a broad engineering and science paper (ten domains, no defense sources); Lanchester's issue is the military-technical one. Cross-over stories appear in both, linked, each written from its own angle.

One weekly scheduled cloud session per app (Friday before dawn, Israel time) harvests a fixed source list with plain Python (arXiv API, RSS/Atom, official listing pages), ranks candidates against the learner's state read from that app's db, deep-reads ~35, verifies each surviving item against a page it fetched **in that run**, and writes one document `profile/news/<YYYY-Www>` with 10–20 items. The page gets a new "עיתון" tab (shared code in `src/news/`, like `src/summaries/`). The in-page tutor never searches: each item carries a short excerpt and summary, so "שאל את המורה" works offline. Cost is about 1–1.5 lesson-units (U, as in A3 §1.6) per app per week, roughly 3–5% of a week of lessons. The hard rule is no invented items: an item without a link fetched that week, with its quoted sentence present in the fetched text, never reaches the db, and a thin week gives a short issue rather than padding.

## 1. Pipeline

### 1.1 Trigger and runbook

| | Gilua | Lanchester |
|---|---|---|
| Scheduled task | "שבועון גילואה" | "שבועון לנצ'סטר" |
| Cron | `CRON_TZ=Asia/Jerusalem 23 2 * * 5` (Fri 02:23) | `CRON_TZ=Asia/Jerusalem 41 3 * * 5` (Fri 03:41) |
| Mode | `create_new_session_on_fire`, Opus, Auto permissions (same allow-list as the backups) | same |
| Target | Gilua artifact db (URL in CLAUDE.md) | Lanchester artifact db |

Both times are outside the 06–09 PT busy window and away from the nightly backups (22:47–23:37) and the lesson factory (00:07). The trigger prompt is three lines and points to `news/RUNBOOK.md` on the dev branch, so the procedure is versioned and reviewed like code. Files in the repo:

```
news/RUNBOOK.md                 the procedure below, step by step
news/sources/eng.yaml           source list, tier, fetch method, per-source cap
news/sources/core.yaml
news/dated_claims/<app>.json    built once from the library: dated textbook claims to watch (§1.6)
news/tools/harvest.py           arXiv API + RSS + listing pages -> candidates.jsonl (no model tokens)
news/tools/verify.py            re-fetch, status, hash, quote-in-text, date window, dedup, schema
news/tools/size.py              byte budget for the doc (<= 230 KB)
```

### 1.2 Stages

```
0  STATE      ArtifactData get data/users/me/profile, list profile/modules, profile/newsfb (last 4),
              profile/registry (concept registry, A3 §2.2), profile/notes kind="להעמקה"/"רעיון למאמר".
              -> interest.json: done[], current, next 12 modules (syllabus order / F_curriculum),
                 concepts with status, open "להעמקה" notes, last 4 weeks of feedback.
1  HARVEST    harvest.py: each source in sources/<app>.yaml for the issue window (Fri-Thu, 7 days,
              + 3 days grace for listing lag). Candidates: url, title, abstract/lede, date, source, tier.
              Typical pool: 150-350 (arXiv dominates in Gilua; GAO/CRS/think tanks + press in Lanchester).
2  TRIAGE     Dedup (URL canonical form + title similarity >= 0.85 against the pool and the last 8 issues).
              Keyword prefilter against registry concepts and module titles (Python).
              One model pass over titles+ledes in batches of 40: score 0-3 for relevance to the
              curriculum, pick a candidate "rel" (learned/current/next/later/outside). Keep ~35.
3  READ       Fetch the full page (or the arXiv abstract page + PDF first pages). Store text, status,
              sha256, fetchedAt in work/<id>.json. Extract: the claim, numbers, one verbatim quote
              (<= 40 words) that supports the headline.
4  WRITE      Per item, in Hebrew: headline, dek, body (<= 220 words), why it matters, connects[] (1-3
              module links with one line each), certainty tag, optional textbookUpdate, idea, read10.
              The writer sees only the fetched text + interest.json + rules. No free browsing at this stage.
5  VERIFY     verify.py (mechanical) + one independent checker pass per item that sees ONLY the fetched
              text and the item, and answers: is every factual sentence supported? are numbers exact?
              is the certainty tag right for this source type? Any "no" -> the item is dropped, not fixed.
              Order-of-magnitude sanity check (Python) on any performance number (range, power,
              efficiency, cost per unit): result goes into item.sanity.
6  COMPOSE    Lead = highest (relevance x certainty x novelty), with a "learned"/"current" link preferred.
              Sections by domain; quotas (§1.4); picks10; ideas. size.py; schema check.
7  PUBLISH    ArtifactData set profile/news/<id>; update profile/news/_index; write
              profile/news/_status (counts, drops by reason, refusals, cost estimate).
              Commit news/<app>/<id>.json + <id>.md to study-notes (archive in git, like notes/).
```

Stage 0 needs no page change: it reads documents the page already writes. Stage 7 writes only collections the page reads (the A3 "ready shelf" pattern), so there are no races with the page.

### 1.3 Sources, by app, and why

Tiers drive the certainty tag. **A** primary official or standards body, **B** research institute or peer-reviewed venue, **C** professional/trade press, **D** vendor material. A **D** item is always tagged "טענת יצרן" and needs a sanity check.

**Gilua: a broad engineering and science paper, not a defense paper.** The program is primarily engineering, so Gilua's issue covers ten domains with a cap of 3 items each: math and physics; signals and control; communications; electronics and semiconductors; power and energy; thermo, fluids and aero; structures and materials; ML/AI and robotics; systems engineering and standards; space as engineering. **No defense sources** (GAO/CRS/DOT&E/RAND/CSIS/defense trade press) are harvested for Gilua; they belong only to Lanchester.

| Source | Tier | Method | Domains | Why |
|---|---|---|---|---|
| arXiv `eess.SY`, `eess.SP`, `math.OC`, `cs.RO`, `cs.IT` | B (preprint) | arXiv API, submittedDate window, cap 120 | signals, control, comms, optimization, robotics | The core of P4–P8; preprint, so certainty is "מאמר לא שפוט". |
| arXiv `cs.LG` (keyword-filtered: control, RL, estimation, physics-informed, scientific ML), `physics.app-ph`, `physics.flu-dyn`, `cond-mat.mtrl-sci` (keyword-filtered) | B | API + prefilter, cap 60 | ML/AI, fluids, materials | cs.LG unfiltered is 1,000+/week of noise. |
| IEEE Spectrum | C | RSS | all | Best single engineering-news filter, at the level of the course. |
| IEEE journal highlights: Proc. IEEE, Trans. on Power Electronics / Control Systems Magazine / Signal Processing Magazine / Solid-State Circuits (tables of contents, open articles fetched) | B | RSS / TOC | electronics, power, control, signals | Peer-reviewed, tutorial-style articles that map one-to-one to modules. |
| Nature / Science news and Nature Electronics / Nature Energy highlights (open articles only) | B/C | RSS | physics, chips, energy, materials | High bar, low volume; paywalled bodies are skipped, never paraphrased from headlines. |
| Quanta Magazine (math, physics), APS *Physics* | C / B | RSS | math and physics | Kolmogorov and Feynman parts; each links the primary paper, which is then fetched. |
| NASA (NTRS new reports, Tech Briefs, news), ESA technical news | A | RSS / listing | space, aero, thermal, systems engineering | The NASA SE handbook is in the library; technical reports are primary. |
| NIST news + publications, BIPM | A | RSS | measurement, standards | Units, metrology, PQC, materials data. |
| DOE / national labs (NREL, Sandia, LBNL news), IEA reports | A / B | RSS | power and energy | Grid, storage, PV, batteries: data with dates. |
| Standards: IEEE SA, IEC, ISO news, IETF RFC index, 3GPP releases | A | listing | systems, comms, electronics | "Standard" items: revisions that change a definition the course teaches. |
| Industry technical blogs and reports, engineering content only: semiconductor (TSMC/Intel/imec technical posts, IEDM/ISSCC papers when open), energy (grid operators' technical reports), aerospace (Airbus/Boeing/SpaceX technical updates, tier D), AI labs' research posts with papers | D (or B when a paper is attached) | RSS / listing, cap 4 per issue | chips, energy, aero, AI | Where new systems first appear; always tagged "טענת יצרן" unless a paper or independent source backs the number. |

**Cross-over items.** Some items belong to both apps (a radar-on-chip IC, a drone autonomy paper, a satellite constellation filing). Each run reads the other app's latest `_index`; when the same canonical URL is chosen by both, both items get `crossRef: { app, issueId, itemId }` and the page shows "גם בשבועון של לנצ'סטר" (or of Gilua), with the angle stated: Gilua writes the engineering (the circuit, the estimator), Lanchester the system and operational meaning.

**Lanchester (radar, EW, EO/IR, satnav, missiles, UAS, air defense, space, ballistics, systems engineering, cost, combat modeling)**

| Source | Tier | Method | Why |
|---|---|---|---|
| GAO (reports RSS, defense topics) | A | RSS | Cost, schedule, test evidence on named programs: M7.10, M14.2, M7.4. The most reliable open data on real systems. |
| CRS reports (congress.gov) | A | listing | Neutral program primers, updated versions with dates: perfect for "what changed since the book". |
| DOT&E (annual report, Jan–Feb; FY reports) | A | listing | Test evidence and suitability: M7.10 "reading DOT&E/GAO". Low frequency, high value. |
| CBO (defense) | A | RSS | Cost, force structure, budgets as data (M14.2). |
| RAND, CSIS (Aerospace Security, Missile Defense Project), IISS (analysis), RUSI | B | RSS | Analysis level: cost-exchange, air defense, space, combat modeling (M14.1). |
| INSS (inss.org.il) | B | RSS | Israeli research institute, Hebrew/English; regional context is C-level per F_curriculum, so capped at 2 items. |
| NASA, ESA, SpaceNews | A / C | RSS | Space modules (P13), launch, constellations. |
| Breaking Defense, Defense News, The War Zone | C | RSS | Program news and new systems; single-report items are tagged "דיווח יחיד" until corroborated. |
| arXiv `eess.SP` (keyword: radar, array, MIMO, GNSS, tracking), `physics.space-ph` | B | API + prefilter | Radar/EW/satnav signal processing at textbook level. |
| Standards: ITU-R (spectrum, WRC), RTCA/EUROCAE, 3GPP NTN, NATO public STANAG list, ASSIST (MIL-STD revisions, titles only) | A | listing | "Standard" items: spectrum allocations, UAS/airspace standards, open interfaces. |

Excluded on purpose, both apps: paywalled bodies (Janes, AW&ST) unless an open copy exists, social media as a source of facts (a post may appear only as a quoted post, §1.11), aggregators without a primary link, leaked or classified documents even when public, and any live-operations tracking (unit locations, front lines, strike reporting, real-time OSINT of ongoing operations).

### 1.3a Sources by region (the weekend edition, 15.11.2026)

The learner asked for a global paper: the United States at most 40% of items, and the rest from Europe, the UK, Israel, Turkey, China, Taiwan, Japan, Korea, India, Russia and Ukraine, the Gulf, Iran and Africa (`region` in the schema; `INTL` for international bodies). A region with nothing worth printing in a week is skipped, never filled. **State media** (marked ★ below, and any outlet owned or directed by a government) is tagged `stateMedia: true`, shown with a tag, never the only source of a claim and never the lead: it is paired with an independent fetched source, or printed as "single" with the body saying whose claim it is. A government's own primary document (a ministry release, a budget, a standard) is tier A, not state media.

**Gilua (engineering and science; no defense sources in any region)**

| Region | Outlets, institutes, journals |
|---|---|
| US (≤ 40%) | IEEE Spectrum, NASA/NTRS, NIST, DOE labs (NREL, Sandia, LBNL), MIT News, Quanta, APS *Physics*, *Science*, *PNAS*, *Joule* |
| EU | ESA, CERN, Fraunhofer, Max Planck, imec, ETH/EPFL news, CORDIS, ENTSO-E, ACER, *Nature Electronics/Energy* |
| UK | IET *E&T*, *The Engineer*, Royal Academy of Engineering, UKRI, Imperial/Cambridge/Oxford news, NESO (grid), *Nature* news |
| IL | Technion, Weizmann, TAU, HUJI and BGU news, Israel Innovation Authority, Israel Space Agency, Globes and Calcalist tech (C) |
| TR | TÜBİTAK, Istanbul Technical University, METU news, Anadolu Agency science/energy ★ |
| CN | Chinese Academy of Sciences, Tsinghua/USTC news, *National Science Review*, Caixin Global, SCMP science, Xinhua sci-tech ★, CGTN ★ |
| TW | ITRI, TSMC technical posts (D), National Taiwan University, DigiTimes Asia, Focus Taiwan (CNA) ★ |
| JP | JAXA, RIKEN, AIST, JST, Nikkei Asia tech, NHK World science |
| KR | KAIST, ETRI, KIST, Samsung/SK hynix technical posts (D), Korea JoongAng Daily tech, Yonhap ★ |
| IN | ISRO, IISc, IIT news, *Current Science*, The Hindu science, Mint tech, PIB (primary, A) |
| RU / UA | Skoltech and Russian Academy papers via arXiv, TASS science ★, Kyiv Independent tech, National Academy of Sciences of Ukraine |
| GULF | KAUST, Khalifa University, MBRSC, Masdar, The National, Arab News, WAM ★, SPA ★ |
| IR | Sharif/Tehran University papers via arXiv and journals, Tehran Times ★, IRNA ★ (always paired) |
| AF | SARAO/MeerKAT, CSIR South Africa, Eskom reports, *Nature Africa*, University World News Africa, TechCabal |
| INTL | ITU, IEA, IRENA, ISO/IEC, IEEE SA, 3GPP, BIPM |

**Lanchester (military-technical analysis; analysis level only, §1.8)**

| Region | Outlets, think tanks, journals |
|---|---|
| US (≤ 40%) | GAO, CRS, DOT&E, CBO, MDA, RAND, CSIS (Missile Defense Project, Aerospace Security), Breaking Defense, Defense News, The War Zone, SpaceNews, DVIDS (pictures) |
| EU | SIPRI, EDA, FRS, IFRI, SWP Berlin, ECFR, Clingendael, hartpunkt, Opex360 |
| UK | RUSI, IISS (Military Balance blog, *Survival*), NAO, House of Commons Library, MoD/DE&S releases, UK Defence Journal |
| IL | INSS, Alma, Misgav, IMOD/MAFAT releases (A), Israel Defense, Times of Israel and Globes defense (C) |
| TR | SETA, EDAM, SSB releases (A), Defence Turkey, TRT World ★, Anadolu ★ |
| CN | CASI, CSIS ChinaPower, Jamestown *China Brief*, SCMP, China Military Online ★, Global Times ★, Xinhua ★ |
| TW | INDSR, MND releases (A), Global Taiwan Institute, Taipei Times, Focus Taiwan (CNA) ★ |
| JP | MOD/ATLA releases and the defense white paper (A), NIDS, Nikkei Asia, Japan Times |
| KR | KIDA, Asan Institute, DAPA releases (A), 38 North, Korea JoongAng Daily, Yonhap ★ |
| IN | MP-IDSA, ORF, DRDO and PIB defense (A), ThePrint, Livefist, The Hindu |
| RU / UA | Ukrainian MoD and Defense Express (programs and industry only), Kyiv Independent, Meduza, Kommersant, TASS ★, RIA ★ — never front-line or strike reporting |
| GULF | EDGE Group releases (D), Gulf Research Center, The National, Arab News, WAM ★, SPA ★ |
| IR | Iran Watch, CSIS Missile Threat, Arms Control Association, Iran International, IRNA ★, Tasnim ★ (always paired) |
| AF | ISS Africa, defenceWeb, African Defence Review |
| INTL | UNODA, IAEA, ITU-R/WRC, NATO public documents |

**Native-language sources for China and Russia (the learner, 23.11.2026).** Where China or Russia lead in practice, the applied engineering is written first in Chinese or Russian, in journals and blogs with no Western counterpart; the English press above only reaches them second-hand. Each app therefore also harvests these, every week. Search them in the language of the source (Chinese or Russian keywords) as well as in English; almost every journal article has an English title, abstract and keywords, which is enough for triage, and the full text is read in the original and translated by the writer (check each key term against the article's own English keywords). `quote` stays verbatim in the source language. A scholarly article is "walkthrough"; "translation" only under the licences listed in docs/scheduled/news.md. Journals of a ministry, an army or a state academy of military science are `stateMedia: true` (they carry the official line: excellent for how the other side thinks, never the only source of a performance claim). Video (Bilibili, Geekerwan) is not a source: no fetchable text.

| App | Region | Native sources (open abstract or full text) | English bridges |
|---|---|---|---|
| Gilua | CN | NSTL open-access platform and CNKI abstracts; 中国电机工程学报 (Proc. CSEE: UHV, grid), 储能科学与技术 (energy storage, batteries), 航空学报 (aeronautics), 中国稀土学报 (rare earths), 岩石力学与工程学报 (tunnels, rock mechanics), 铁道学报 (high-speed rail); 科学空间 kexue.fm (AI implementation; where RoPE first appeared; new posts on optimizers such as Muon and muP, and on MoE; English machine translation at rohin-garg.github.io/kexue-en), Ma Weiming's group on ship MVDC power and electromagnetic launch (Proc. CSEE), 机器之心, technical answers on Zhihu (C, author named) | Chinese Journal of Aeronautics, Journal of Rare Earths, JRMGE, High-Speed Railway; ChinAI (Jeffrey Ding), Recode China AI (Tony Peng) |
| Gilua | RU | CyberLeninka (full text), eLibrary.ru, Math-Net.Ru new issues (math, physics), Атомная энергия (fast reactors, closed fuel cycle), Физика плазмы and ВАНТ (fusion, the TRT project), Учёные записки ЦАГИ (aero, hypersonics), Космические исследования; Habr (C, engineering articles from practice) | Atomic Energy (Springer), Plasma Physics Reports, TsAGI Science Journal, Cosmic Research; habr.com/en |
| Lanchester | CN | 中国军事科学 (Academy of Military Science) ★, 军事运筹与系统工程 (military OR and systems engineering: M14.1), 系统工程与电子技术 and 现代雷达 (radar, EW, open abstracts), 兵工学报, PLA Daily 解放军报 ★ | CASI "In Their Own Words" translations, ChinAI on military AI, CSET and CMSI translations of PLA writing on "intelligentized warfare" (智能化战争), Jamestown *China Brief* |
| Lanchester | RU | Военная мысль (General Staff journal) ★, Вестник Академии военных наук ★, Радиотехника и электроника and Известия вузов. Радиоэлектроника (radar, EW: M12.1), Экспорт вооружений (CAST, defence industry), CyberLeninka for military-technical papers | FMSO *OE Watch* (monthly translations of foreign military press; US government work), Journal of Communications Technology and Electronics, the Moscow Defense Brief archive (2004–2019) for background |

The Lanchester register (§1.8) holds for these sources too: doctrine, programs, industry, budgets and published military-technical science; never front-line, strike or unit reporting, even when a Russian or Chinese journal prints it. Note for background: from 1.1.2027 Pleiades stops the English editions of 108 Russian Academy journals, so the native source is often the only one.

Journals for both apps' "from the labs" corner and features: IEEE Transactions (AES, Signal Processing, Power Electronics, Antennas and Propagation), AIAA journals (abstract pages), *Science & Global Security*, *Journal of Strategic Studies* (Lanchester), *Defence and Peace Economics* (Lanchester), Nature family and *Science* (Gilua). Open abstracts and open copies only.

### 1.4 Relevance to curriculum and progress

`score = relevance(0-3) x stageFit x certaintyWeight x novelty`, where stageFit is 1.0 for links to learned or current modules, 0.8 for the next 12 ("next"), 0.6 for later in the course ("later"), 0.4 for outside the curriculum ("outside"). Quotas per issue: in Gilua at least 6 of the 10 domains present (breadth is the point of an engineering paper); at least 40% of items link to learned/current modules, at most 30% "next"/"later", at most 20% "outside", at most 3 items per domain, at least 1 textbook update when one exists, 2–3 picks10. Feedback (`profile/newsfb`: read, useful ±1, saved, "לא רלוונטי") moves per-source and per-domain weights by at most ±20% per week, so the paper can never collapse into one topic.

Every `connects` entry names a module id that exists in the app's syllabus (checked by verify.py), a relation and one concrete sentence ("the 1/R⁴ you derived in M2.1 is why the range gain is only 19%"). The chip in the page opens that module.

### 1.5 Certainty tags (shown on every item)

| Tag (Hebrew in UI) | When |
|---|---|
| רשמי | Tier A primary document (a GAO report, a NASA release, a published standard) |
| שפוט | Peer-reviewed paper or journal highlight |
| מאמר לא שפוט | arXiv/preprint |
| דיווח יחיד | One tier-C report, no second source found |
| מאומת בשני מקורות | Two independent fetched sources agree on the key claim |
| טענת יצרן | Tier D; numbers not independently confirmed |
| שנוי במחלוקת | Fetched sources disagree; both are linked |

Plus a separate **sanity** badge when a number was checked against physics/arithmetic: "סדר גודל: עובר / לא עובר / לא נבדק". A failing check does not drop the item; it becomes a critique exercise ("find the error"), which is level-2.5 practice.

### 1.6 Textbook updates

Built once per app, then refreshed monthly: `news/dated_claims/<app>.json` is a list of claims in the library that are likely to age, each with book, page, edition year and the claim (e.g. "typical T/R module output power", "number of operational GNSS constellations", "cost per kg to LEO", "state of the art in X"). Built by a one-time pass over the extracted text looking for dated language (current, today, state of the art, recent, years, prices). Weekly, any item that touches a claim yields a `textbookUpdate` note: `superseded | refined | confirmed`, old claim with page reference, the newer fact with its source. These notes also flow to the factory's concept registry so the next lesson on that page includes the update.

### 1.7 Ideas for projects and products

At most 3 per issue, only where an item opens a concrete, small, buildable thing with the learner's tools (Python, the scratchpad, the 3D component, an article). Each has: title, kind (project / product / article / expert interview), a two-sentence pitch, effort in hours, the modules it uses. Lanchester ideas stay at the analysis level: models, cost studies, simulations of published equations, article angles, interview questions. Never building, modifying or defeating weapons.

### 1.8 Refusal-safety framing (Lanchester)

- Register: the run is an **open-source literature review for a systems-engineering course**, written in the engineering register of the 28.10 fix. Prompts never ask "how to defeat X"; they ask "what does this public report say, and which textbook relation explains it".
- Scope: public, attributable sources only; physics, systems engineering, cost, test evidence, policy at the level of GAO/CRS/RAND. No targeting, no exploitable vulnerabilities of specific fielded systems beyond what the public report itself states, no tactics, no export-controlled technical data, no live operations.
- Each stage sees a narrow brief (fetched text + item spec), never another agent's free text. Plans are not echoed back into later calls (the 28.10 cause).
- On a refusal: the item is dropped and logged in `_status.refusals` with source and stage; the run continues. The run never rephrases to get around a refusal and never strips context to retry.
- Probe before going live: run one Lanchester issue by hand (one-shot task) and read every item.

### 1.9 Cost and usage

| Stage | Input tokens | Output tokens |
|---|---|---|
| Harvest, dedup, prefilter | 0 (Python) | 0 |
| Triage (≈250 titles+ledes, batches of 40) | 60–90k | 8–12k |
| Read 35 pages (≈6–8k each, trimmed) | 210–280k | 15–25k |
| Write 15–20 items | 60–90k (cached prefix) | 25–40k |
| Independent checks (20 × ≈6k) | 120k | 6–10k |
| Compose, ideas, textbook matches | 30–50k | 6–10k |
| **Total per app per week** | **≈ 0.5–0.65M** | **≈ 60–95k** |

About 1–1.5 U per app per week (U = one in-page lesson today, A3 §1.6), 2–3 U for both. Network fetches are about 60–120 per run, well inside a session. Cap: `NEWS_MAX_FETCH=150`, `NEWS_MAX_ITEMS=20`; if usage runs out, the run publishes what has passed verification (≥ 6 items) or publishes nothing and records why.

**Weekend edition (15.11.2026):** 25–35 items with a 600–900-word lead and 3–4 features of about 400 words roughly doubles the writing and checking stages and adds picture search: about 1.2–1.5M input and 150–200k output tokens per app per week. Caps: `NEWS_MAX_FETCH=300`, `NEWS_MAX_ITEMS=35`, minimum 8 items.

**Full edition (20.11.2026, the learner's demand, capped by him at twice the cost of the weekend edition):** 35–45 items, a world desk of 12–16 stories (at most 2 per major country, role `globe`), and a full text for every story except the number and the posts, packed a few to a document (`newstext`, docs/NEWS_SCHEMA.md): a translation where the licence allows it, otherwise a walk through the source idea by idea or a complete report in the source's order, never a two-paragraph summary. Budget: report 300–900 words, walkthrough at most 1500, globe and brief at most 600, at most 30,000 words of full text per app. Estimate (not measured): up to about 2.5–3M input and 300–400k output tokens per app per week; each run records its words and estimate in `_status.usageEstimate`. Caps: `NEWS_MAX_FETCH=380`, `NEWS_MAX_ITEMS=45`.

### 1.10 Quality gates (any failure = item dropped; gate 1–3 failure for the whole issue = no publish)

1. **Fetched this week.** Every source URL has `httpStatus 200`, `fetchedAt` inside the run, `sha256` of the text, and the page title in the fetched text. verify.py re-fetches every link in stage 5 (a second time, separate from stage 3).
2. **Quote present.** `quote` appears verbatim (whitespace-normalized) in the fetched text.
3. **Schema and ids.** JSON schema, module ids exist, 25 ≤ items ≤ 35 (or a short issue ≥ 8), US ≤ 40% of items, picture URLs only `/_blob/…`, doc ≤ 230 KB.
4. **Date window.** Publication date inside the window, or the item is tagged "ישן אך חדש לך" with the date shown (allowed for at most 2 items).
5. **Dedup.** Not in the last 8 issues (URL or title ≥ 0.85).
6. **Independent check** (§1.2 stage 5): every factual sentence supported; numbers exact; certainty tag matches source tier (an arXiv link can never be "שפוט").
7. **No invented items, ever.** The writer has no URL field of its own: `sources[]` is filled by code from `work/<id>.json`, so a model cannot introduce a link. Example content is flagged `example: true` and the page refuses to render such an issue outside the prototype.

8. **Posts, charts, pictures** (§1.11): `post.text` appears verbatim in a page fetched this run; every chart value appears in the fetched text of `chart.source.url`; every picture has credit, license and sourcePage read from its file page.

`_status` records candidates, fetched, verified, dropped by reason; the issue footer shows these counts, so the learner sees the filter working.

### 1.11 Pictures, charts and social posts (15.11.2026)

- **Pictures.** The learner wants real pictures, not decoration. A picture need not come from the article: a relevant freely licensed picture of the subject (the star, the radar, the grid, the chip) from Wikimedia Commons, NASA, ESA, NOAA, DVIDS (Lanchester only) or a government image library is enough, with credit and license in the caption and "תמונה להמחשה" when it does not show the event itself. The Artifact CSP blocks images from other hosts, so the run downloads a reduced copy (800–1200 px, JPEG ≤ 250 KB) and uploads it to the app's asset store (Artifact publish with `url`, `file_path`, `asset: true`); the result's `/_blob/<id>` goes into `images[].url`. Pictures never go inside the issue document (230 KB limit). One per lead, feature and econ/geo item; optional elsewhere. No AI-generated images.
- **Charts.** Only from numbers in a source fetched this run (a table in a report, a dataset); bar or line, at most three series, values copied exactly, `null` for a gap. The page draws them as black-and-white inline SVG with title, unit and a source line.
- **Social posts.** X, Bluesky or Mastodon posts by researchers, engineers, agencies or analysts, as a "ברשתות" corner. A post enters only when a page fetched in this run (the post page, an embed or an article quoting it) contains its text verbatim. There is no X API; a post is never reconstructed from memory or a search snippet. A post is a quote, not a source of facts.

## 2. Issue format

**The printed edition (15.11.2026, supersedes the list below where they differ).** The learner chose "מהדורה מודפסת": a masthead with the Hebrew and Gregorian date, edition and issue number; a "בגיליון זה" index that filters by section; a front page with the lead wide (picture, body with a drop cap, chart, editor's note in the margin) and a side column of 3–4 features and the number of the week; sections under a heading rule in three columns (short sections share a row); then the corners: the app's own corner (Gilua "כלכלת הטכנולוגיה", Lanchester "הפינה הגאופוליטית" — open-source analysis, no live operations) beside "מהמעבדות" and "ברשתות", and "מבט מהעולם" (one topic, two countries side by side); a colophon with "לקרוא ב-10 דקות", saved items and how the stories were chosen. Black ink on off-white (and its dark-mode inverse), serif headlines, hairline rules, one restrained accent for the section kickers. The connection to the study modules is an editor's note in the margin, not a colored box; tags are one small muted line (kind · certainty · region · tier · date, and "תקשורת ממשלתית" for state media). No opinion column. Code: `src/labtabs/News.tsx` and the "weekly paper" block of `labtabs.css`, the same in both apps.

The original format (October 2026):

- **Masthead**: app name, issue number, week, "נבנה ב-<date>", counts (candidates → verified).
- **Lead story**: one item, larger, with its "connects" chips and a 3-line "why it matters to you".
- **Sections by domain** (Gilua: מתמטיקה ופיזיקה, אותות ובקרה, תקשורת, אלקטרוניקה ושבבים, הספק ואנרגיה, תרמו, זרימה ואווירו, מבנים וחומרים, ML/AI ורובוטיקה, הנדסת מערכות ותקנים, חלל כהנדסה. Lanchester: מכ"ם ול"א, טילים והגנה אווירית, חלל, כטב"מים ואוטונומיה, עלות ובדיקות, מודלים מבצעיים ותקנים).
- **Each item**: kind, certainty tag, source tier, date, headline, dek, body, "מתחבר למה שלמדת" chips (green learned, amber current, blue next 12, dashed blue later in the course, gray outside the curriculum), optional sanity badge, link(s), actions: שמור, מועיל / לא רלוונטי, שאל את המורה (opens the Explain panel with the item's excerpt), פתק (to the lesson notebook as "להעמקה").
- **Textbook update** box: book, page, edition year, old vs new, status.
- **Idea for a project/product** box: kind, pitch, hours, modules.
- **To read in 10 minutes**: 2–3 open-access picks with minutes.
- **Archive**: `_index` list, newest first; filters by domain and by relation ("רק מה שקשור למה שלמדתי").
- Unread badge on the tab when a new issue arrives.

## 3. Schema

```ts
// data/users/me/profile/news/<issueId>     issueId = "2026-W44"   (<= 230 KB)
interface NewsIssue {
  id: string; app: "eng" | "core"; number: number;
  window: { from: string; to: string };            // ISO dates
  publishedAt: number; generator: { sha: string; runId: string };
  snapshot: { current: string | null; done: number; upcoming: string[] };
  lead: string;                                    // item id
  sections: { id: string; title: string; items: string[] }[];
  picks10: string[];
  items: NewsItem[];
  stats: { candidates: number; fetched: number; verified: number; dropped: Record<string, number> };
  example?: true;                                  // prototype only; never written by the run
}
interface NewsItem {
  id: string;
  kind: "paper" | "report" | "system" | "standard" | "data" | "event";
  domain: string;
  headline: string; dek: string; body: string;     // Hebrew, Markdown, body <= 220 words
  why: string;                                     // why it matters to this learner, 1-3 lines
  certainty: "official" | "peer" | "preprint" | "single" | "corroborated" | "vendor" | "disputed";
  sanity?: { check: string; result: "pass" | "fail" | "na"; note: string };
  sources: { url: string; title: string; publisher: string; tier: "A" | "B" | "C" | "D";
             publishedAt: string; fetchedAt: number; httpStatus: number; sha256: string;
             quote: string; openAccess: boolean }[];
  connects: { moduleId: string; rel: "learned" | "current" | "next" | "later" | "outside";
              concept: string; why: string }[];
  textbookUpdate?: { book: string; page: number; edition: number; old: string; now: string;
                     status: "superseded" | "refined" | "confirmed" };
  idea?: { title: string; kind: "project" | "product" | "article" | "interview";
           pitch: string; hours: number; uses: string[] };
  read10?: { minutes: number };
  oldButNew?: true;
  crossRef?: { app: "eng" | "core"; issueId: string; itemId: string };   // same story in the other app
}
// profile/news/_index   { issues: { id, number, window, lead: headline, count }[] }
// profile/news/_status  { lastRun, ok, counts, dropped, refusals: {source, stage}[], usageEstimate }
// profile/newsfb/<issueId>  { [itemId]: { read?: number; useful?: -1|0|1; saved?: boolean } }   (written by the page)
```

Measured size: a 20-item Hebrew issue at ≈ 4–6 KB per item is 80–120 KB, half the doc limit.

## 4. Page changes (shared, both apps)

`src/news/` (≈ 400–500 lines, identical in both apps, like `src/summaries/`): `NewsTab.tsx` (reads `profile/news/_index` and one issue on demand), `Item.tsx`, `news.css` (uses existing tokens; Frank Ruhl Libre for headlines, already loaded). App-specific: the domain list and section names come from the issue, not the code. Hooks into existing parts: chip → open module; "שאל את המורה" → Explain panel with `item.body + sources[0].quote` as the selected text; "פתק" → lesson notebook entry with `kind: "להעמקה"`; feedback → `profile/newsfb`. The tutor's system prompt gets nothing new except, optionally, the last issue's `connects` for the current module (≤ 1 KB), so a lesson can say "this week's paper on X".

## 5. Order of work

1. One-shot run for Gilua with `example: false`, publish to a test doc id, read every item; check gates by hand (two link re-fetches a week later).
2. Same for Lanchester (refusal probe).
3. Page tab behind a flag; then the weekly tasks.
4. After 4 issues: tune sources by feedback and drop counts; build `dated_claims` for the 5 most-dated books.
