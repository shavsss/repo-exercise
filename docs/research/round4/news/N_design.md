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

Excluded on purpose, both apps: paywalled bodies (Janes, AW&ST) unless an open copy exists, social media, aggregators without a primary link, leaked or classified documents even when public, and any live-operations tracking (unit locations, real-time OSINT of ongoing operations).

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

### 1.10 Quality gates (any failure = item dropped; gate 1–3 failure for the whole issue = no publish)

1. **Fetched this week.** Every source URL has `httpStatus 200`, `fetchedAt` inside the run, `sha256` of the text, and the page title in the fetched text. verify.py re-fetches every link in stage 5 (a second time, separate from stage 3).
2. **Quote present.** `quote` appears verbatim (whitespace-normalized) in the fetched text.
3. **Schema and ids.** JSON schema, module ids exist, 10 ≤ items ≤ 20 (or a marked short issue ≥ 6), doc ≤ 230 KB.
4. **Date window.** Publication date inside the window, or the item is tagged "ישן אך חדש לך" with the date shown (allowed for at most 2 items).
5. **Dedup.** Not in the last 8 issues (URL or title ≥ 0.85).
6. **Independent check** (§1.2 stage 5): every factual sentence supported; numbers exact; certainty tag matches source tier (an arXiv link can never be "שפוט").
7. **No invented items, ever.** The writer has no URL field of its own: `sources[]` is filled by code from `work/<id>.json`, so a model cannot introduce a link. Example content is flagged `example: true` and the page refuses to render such an issue outside the prototype.

`_status` records candidates, fetched, verified, dropped by reason; the issue footer shows these counts, so the learner sees the filter working.

## 2. Issue format

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
