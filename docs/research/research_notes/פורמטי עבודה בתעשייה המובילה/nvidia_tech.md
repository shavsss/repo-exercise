# Engineering thinking and decision formats at top tech/compute organizations (NVIDIA first)

Scope: formats usable as 5-20 min in-lesson exercises for a self-learner in radar, antennas, missiles, propulsion, EW, control, military OR. Certainty tags: [H] high, [M] medium, [L] low. Source type tags: (P) primary = the person/org itself or the original paper; (S) secondary = journalist/book summary/blog; (F) folklore = widely repeated, weakly sourced.
Research date: 2026-11-17. ~22 tool calls. Books (Kim 2024, Witt 2025) were NOT accessible in full text; all book content below is via reviews/summaries/interviews.

## 1. NVIDIA: "speed of light", first principles, T5T, no 1:1s, public reasoning, CUDA argument

### Takeaway
The best-sourced NVIDIA practices are (a) no 1:1s + reasoning through problems in front of the whole staff and (b) "Top-5 Things" emails as a weak-signal sensor; both come from Huang himself or WSJ/Fortune citing Kim. "Speed of light" (benchmark each task against its physical/theoretical minimum, not against last time or competitors) is consistently attributed to Kim's book but I could only reach it through secondary summaries; in Huang's own Acquired interview the phrase appears as a literal physical latency limit used the same way (remove all other obstacles until physics is the only constraint).

### Cited Findings
- Speed of light (method): "each project must be broken down into its component tasks, and each task must have a target time-to-completion that assumes no delays, queues, or downtime" — this theoretical maximum is "the speed of light". [M] (S) — [David Senra / Founders podcast on X, summarizing The Nvidia Way](https://x.com/FoundersPodcast/status/2031138155135648151); same in [Founders #376 transcript](https://podscripts.co/podcasts/founders/376-jensen-huang-founder-of-nvidia)
- Work should be constrained "only by the laws of physics – not by internal politics or financial concerns" (paraphrase of Kim). [M] (S) — [Kyle Nazario review of The Nvidia Way](https://kylenazario.com/blog/nvidia-way-review-work-life-balance)
- Kim interview describes the principle as "not comparing ourselves to other competitors, or to what we did last time". [M] (S) — [Motley Fool interview with Tae Kim](https://www.fool.com/investing/2025/01/29/interview-tae-kim-author-of-the-nvidia-way/)
- Huang himself (Acquired, on GeForce Now cloud gaming): "You're not going to overcome the speed of light" and "if you could remove the obstacles everywhere else, then the speed of light should be perfectly fine" (~120 ms end-to-end latency budget). This is the same logic as a physics-limited latency budget. [H] (P) — [Acquired: Jensen Huang episode](https://www.acquired.fm/episodes/jensen-huang)
- Lex Fridman #494: Huang reportedly urged engineers to engineer "from first principles ... with speed of light thinking"; only available via unverified secondary page. [L] (S) — [stationlm summary of Lex Fridman #494](https://stationlm.com/analysis/79e2e1eb-ecf8-4467-acbc-c4f31581c177)
- RIVA 128 "done in 9 months vs 2 years" and "$1M Ikos emulator so drivers developed before silicon" are given as the speed-of-light example, unsourced in the blog. [L] (S/F) — [Howard Yu, One Inch Ahead](https://howardyu.substack.com/p/achieve-light-speed-like-nvidia-welcome). Huang on Acquired confirms the mindset: for RIVA 128 "we assumed that we taped out a perfect chip" [H] (P) — [Acquired](https://www.acquired.fm/episodes/jensen-huang)
- Supply-chain cycle compressed "from months to thirteen days" (Deb Shoquist) as a speed-of-light application. [L] (S) — mentioned in search summary of [rationalflaneur](https://rationalflaneur.com/the-nvidia-way-meets-the-intelligent-fanatic/)
- No 1:1s: "I don't do one-on-ones and my staff is quite large." "I really discourage one-on-ones." ~60 direct reports. [H] (P) — [Stripe Sessions 2024, conversation with Patrick Collison](https://stripe.com/en-fr/sessions/2024/a-conversation-with-nvidias-jensen-huang)
- Public reasoning: "I give you feedback right there in front of everybody." "for me to reason through it in front of everybody helps everybody learn how to reason through it." "Almost everything that I say, I say to everybody all at the same time." [H] (P) — [Stripe Sessions 2024](https://stripe.com/en-fr/sessions/2024/a-conversation-with-nvidias-jensen-huang)
- Reasoning over numbers: "the reasoning of it is much, much more important to me than a spreadsheet." "Words are reasoning." "you really have to be careful to distill down the first principle instead of 'I want something.'" "The first principles by which you reasoned about your strategies, those first principles are easy to remember." [H] (P) — [Stripe Sessions 2024](https://stripe.com/en-fr/sessions/2024/a-conversation-with-nvidias-jensen-huang)
- No status meetings: "No reporting. No reporting meetings. I hate reporting meetings." [H] (P) — [Stripe Sessions 2024](https://stripe.com/en-fr/sessions/2024/a-conversation-with-nvidias-jensen-huang)
- T5T: employees email brief bulleted "Top-5 Things" for decades; Huang reads them daily incl. Sunday evenings; distrusts formal reports as diluted; does not send his own so others won't mimic his format; "I'm looking to detect the weak signals... I want to intercept them when they are weak." Reading T5Ts reportedly helped the decision to expand GPU workloads. Source chain: Fortune <- WSJ <- Kim's book. [H for existence, M for details] (S) — [Fortune, Dec 2024](https://fortune.com/2024/12/13/jensen-huang-email-nvidia-management-leadership-top-5-things-t5t)
- Org principle: "mission is the boss"; "Nobody has more power than anybody else" (in meetings). [H] (P) — [Acquired](https://www.acquired.fm/episodes/jensen-huang)
- CUDA argument (Huang): pre-CUDA question was "how do we create an abstraction layer above our chip that is expressible in a higher level language"; compatibility "is the only unnegotiable rule in our company"; "I believed in CUDA because you reasoned about it"; it was "an incredible disaster overnight" (margin/stock hit) and took "probably 10 years" to pay off; "We spent about a decade in zero billion dollar markets". [H] (P) — [Stripe Sessions 2024](https://stripe.com/en-fr/sessions/2024/a-conversation-with-nvidias-jensen-huang); [Acquired](https://www.acquired.fm/episodes/jensen-huang)
- Deep learning pivot: team went "back to first principles and ask, what is it about this thing that made it so successful?" [H] (P) — [Acquired](https://www.acquired.fm/episodes/jensen-huang)
- Witt (The Thinking Machine, 2025): CUDA launched 2006 with skepticism/low adoption, aimed at niche scientific users ("zero-billion-dollar" market); 2012 Toronto group (AlexNet) trained on two consumer GPUs, pulling NVIDIA into AI. [M] (S) — [Shortform summary](https://www.shortform.com/pdf/the-thinking-machine-pdf-stephen-witt); [Unite.ai review](https://www.unite.ai/?p=230042)

### Inferences
- The NVIDIA "format" is not a document template but a reasoning pattern: (1) state the physical floor (latency, bandwidth, FLOPs, task duration with zero waiting), (2) measure current state against floor, (3) attribute the gap to named obstacles, (4) argue a bet from first principles in words, in public. This maps directly to radar/EW exercises: e.g., "speed of light" for a radar = thermal-noise-limited detection range from the radar equation; for propulsion = ideal Isp; for control = bandwidth limited by actuator rate/delay (Bode). Exercise: student writes floor -> current design -> gap ledger (each loss in dB) -> which gap to attack first.
- T5T suggests an exercise format: end-of-lesson "top 5 things" with weak signals (things that surprised me / might matter later), not a status report.
- "Public reasoning" suggests: student narrates reasoning aloud/in writing step by step so it can be critiqued, rather than giving only an answer.
- Top-tier vs average (inferred): average compares to last version or competitor ("10% better"); top-tier compares to the physical bound and explains each dB/ms of gap.

### Gaps
- Could not access text of Kim (2024) or Witt (2025); exact wording of "speed of light" passages, and how tensor cores were argued internally, not found. Tensor cores not mentioned in the Acquired transcript per fetch.
- No primary Huang quote found using "speed of light" as a management method (only as physical latency). Lex Fridman #494 quote unverified.
- Context flag (unverified, out of scope): Bloomberg (2026-11-09) headline reports a Huang scandal; one outlet (wionews) claims he left as CEO around Nov 12, 2026. Not verified; does not change historical practices — [Bloomberg](https://www.bloomberg.com/news/features/2026-11-09/nvidia-ceo-jensen-huang-s-affair-with-alleged-spy-raises-succession-concerns), [WION](https://www.wionews.com/world/i-ve-decided-to-leave-nvidia-robotics-engineer-writes-social-media-post-supporting-jensen-huang-who-left-as-ceo-after-affairs-came-to-light-1794818373967).

## 2. Design docs / RFCs (Google) and ADRs (Nygard)

### Takeaway
Google design doc = Context & scope, Goals & non-goals, The design (with trade-offs, constraints), Alternatives considered ("one of the most important" sections), Cross-cutting concerns; 10-20 pages for large projects, 1-3 page mini docs OK; only worth writing when the problem is ambiguous. Nygard ADR = Title, Context, Decision ("We will..."), Status, Consequences (all, not only positive); 1-2 pages.

### Cited Findings
- Google sections and guidance: "Rule #1 is: Write them in whatever form makes the most sense"; Context "isn't a requirements doc. Keep it succinct!"; non-goals are things that could reasonably be goals but are explicitly excluded (example: "ACID compliance"); the design doc is "the place to write down the trade-offs"; "degree of constraint" (greenfield vs tightly bounded); alternatives considered "is one of the most important ones" and should show why the chosen solution fits the goals better; length "10-20ish pages", "1-3 page 'mini design doc'"; don't write one if not ambiguous; docs that read like "implementation manuals" without trade-offs signal no doc needed; "'I tried it out and it works' is one of the best arguments for choosing a design"; reviews "are also a dangerous trap of overhead"; "re-read your own design docs a year or 2 later." [H] (P, Google engineer Malte Ubl) — [Design Docs at Google, industrialempathy.com](https://www.industrialempathy.com/posts/design-docs-at-google/)
- Nygard ADR (Nov 15, 2011): Title (short noun phrase, e.g. "ADR 9: LDAP for Multitenant Integration"); Context = forces (technological, political, social, project-local), call out tensions, value-neutral; Decision in active voice "We will..."; Status = proposed/accepted/deprecated/superseded; Consequences: "All consequences should be listed here, not just the 'positive' ones"; "one or two pages long"; numbered sequentially, never reuse; superseded records are kept; written as a conversation with a future developer, full sentences ("Bullets are acceptable only for visual style"). [H] (P) — [Nygard, Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)

### Inferences
- Excellent "alternatives considered" (from Ubl's criteria): each alternative is a genuinely reasonable design, evaluated against the same stated goals, with the decisive trade-off named; average = strawmen or a list without the deciding reason.
- Non-goals map well to "domain of validity" statements: e.g., "this radar range model does NOT cover multipath, clutter-limited regimes, or ducting".
- ADR "Consequences incl. negative" + "Status: superseded" is a natural format for 5-min exercises: "choose monopulse vs conical scan; write an ADR; next lesson, a new requirement supersedes it."

### Gaps
- Uber RFC process and other company RFC templates were not researched (tool budget). Known publicly (e.g., Uber's "Scaling Engineering Teams via RFCs" by Gergely Orosz) but not verified here.

## 3. Amazon: 6-pager, PR/FAQ, working backwards, one-way/two-way doors

### Takeaway
Bezos letters (primary) define Type 1 (one-way door, irreversible, slow careful) vs Type 2 (reversible, fast, small group) decisions, warn against applying Type 1 process to Type 2 decisions, and recommend deciding with ~70% of desired information plus "disagree and commit". 6-pager and PR/FAQ structure is known only via ex-Amazonians' book Working Backwards (Bryar & Carr) and secondary guides — no official Amazon template.

### Cited Findings
- 2015 letter: "Some decisions are consequential and irreversible or nearly irreversible – one-way doors"; "Type 2 decisions can and should be made quickly by high judgment individuals or small groups"; large orgs tend "to use the heavy-weight Type 1 decision-making process on most decisions ... including many Type 2 decisions" leading to "slowness, unthoughtful risk aversion, failure to experiment sufficiently". [H] (P) — [Amazon 2015 shareholder letter, SEC exhibit](https://www.sec.gov/Archives/edgar/data/1018724/000119312516530910/d168744dex991.htm)
- 2016 letter: "Many decisions are reversible, two-way doors"; "most decisions should probably be made with somewhere around 70% of the information you wish you had"; "disagree and commit ... I disagree and commit all the time"; "high-quality, high-velocity decisions". [H] (P) — [Amazon 2016 letter](https://www.aboutamazon.com/news/company-news/2016-letter-to-shareholders)
- 6-pager: narrative prose, no bullets/slides, ≤6 pages + unlimited appendices, read silently at meeting start (~20 min). PR/FAQ: 1-page press release dated in the future announcing the launched product, followed by FAQ (customer + internal/skeptic questions); no official Amazon template exists. [M] (S) — [search summary of Bryar & Carr-based guides, e.g. Commoncog](https://commoncog.com/working-backwards/); [Dave Limp on the six-page memo](https://amazonchronicles.substack.com/p/working-backwards-dave-limp-on-amazons)
- "5-10 revisions" per PR/FAQ is from a single secondary guide. [L] (S) — [koji.so guide](https://www.koji.so/docs/working-backwards-pr-faq-guide)

### Inferences
- Exercise mapping: "door classification" before any choice (e.g., choosing a seeker band for a missile = one-way door; choosing a filter gain = two-way door) to decide how much analysis to spend. PR/FAQ maps to "write the test-range report / user's statement for the finished system first, then the FAQ of skeptic questions (What's Pd at 50 km in rain? What if jammed?)".

### Gaps
- Bezos 2004 email banning PowerPoint and exact 6-pager rules not fetched from primary sources.

## 4. Back-of-envelope / Fermi estimation (Jeff Dean, Mahajan)

### Takeaway
Dean frames estimation of alternative designs "without having to build them" as an essential engineering skill, illustrated with a canonical two-design comparison; Mahajan's MIT course teaches the toolkit (extreme cases, dimensional analysis, successive approximation, discretization, generalization, pictorial analysis).

### Cited Findings
- Dean: "an important skill for every software engineer is the ability to estimate the performance of alternative systems, using back of the envelope calculations, without having to build them." Worked example: page with 30 image thumbnails (256 KB each). Serial: 30 seeks×10 ms + 30×256KB/30MB/s ≈ 560 ms. Parallel: 10 ms + 256KB/30MB/s ≈ 18 ms (realistically 30-60 ms with variance). Advice: know your building blocks ("You can't make decent back-of-the-envelope calculations if you don't know what's going on"), prototype unknowns that could flip the answer, measure to calibrate future estimates. [H] (S quoting Dean's talk) — [HighScalability](https://highscalability.com/google-pro-tip-use-back-of-the-envelope-calculations-to-choo/); slides [Dean LADIS 2009 keynote](https://research.cs.cornell.edu/ladis2009/talks/dean-keynote-ladis2009.pdf), [Stanford 295 talk](https://research.google.com/people/jeff/stanford-295-talk.pdf)
- Numbers list (L1 0.5 ns, branch mispredict 5 ns, L2 7 ns, mutex 25 ns, main memory 100 ns, ...); originated with Peter Norvig's "Teach Yourself Programming in Ten Years"; dates conflict (2009 Google all-hands / LADIS 2009 vs Stanford 2010); numbers now >10 years stale. [M] (S) — [Julian Hyde blog](https://julianhyde.blogspot.com/2010/11/numbers-everyone-should-know.html); [Princeton COS518 copy](https://www.cs.princeton.edu/courses/archive/spr17/cos518/papers/jeff-dean-numbers.pdf)
- Mahajan, MIT 18.098 Street-Fighting Mathematics (IAP 2008): teaches guessing results without proof: extreme-cases reasoning, dimensional analysis, successive approximation, discretization, generalization, pictorial analysis; "No epsilons or deltas are harmed by taking this course." [H] (P) — [MIT OCW 18.098](https://ocw.mit.edu/courses/18-098-street-fighting-mathematics-january-iap-2008/)

### Inferences
- Direct transfer: a "numbers every radar/missile engineer should know" card (kTB = -174 dBm/Hz, c, λ at X-band 3 cm, typical RCS, g-limits, Isp ranges, atmospheric attenuation dB/km) used exactly like Dean's list to compare two designs in 5 minutes before any detailed analysis.
- Mahajan's "extreme cases" = natural format for validity-limit questions (what happens to the formula when R→0, when SNR→∞, when target is in the near field?).

### Gaps
- "Guesstimation" (Weinstein & Adam, 2008) and Mahajan's book license not verified; the phrase "too much rigor teaches rigor mortis" not found on the OCW page.

## 5. Roofline / limit analysis

### Takeaway
Roofline (Williams, Waterman, Patterson, CACM 52(4), Apr 2009) bounds attainable performance = min(peak compute, peak bandwidth × operational intensity); ridge point = minimum intensity needed for peak. It is the formal cousin of NVIDIA's "speed of light".

### Cited Findings
- Formula, operational intensity (ops per byte of DRAM traffic), ridge point definition. [H] (P) — [Williams et al. CACM 2009 (copy)](https://www.cs.colostate.edu/~cs475/f19/more_assignments/Labs/L10/RooflineCACM2009.pdf); [Berkeley tech report EECS-2008-134](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2008/EECS-2008-134.pdf)

### Inferences
- Generalizable exercise: "which roof binds?" Radar: detection range bounded by min(noise-limited range, clutter-limited range, horizon, ambiguity). Missile: min(kinematic range, seeker acquisition range, fuze/datalink limit). Student identifies the binding bound and the "ridge point" where the binding constraint switches.
- NVIDIA tools (e.g., Nsight Compute) report "speed of light" % of peak throughput — a known naming link, but not verified in this session.

### Gaps
- Did not verify NVIDIA Nsight "SOL" terminology from primary docs.

## 6. Apple hardware: EVT/DVT/PVT, DRI, design reviews

### Takeaway
Only weak sources found. EVT proves engineering concept, DVT proves finished design meets requirements, PVT proves the production process (generic industry definitions). Apple specifics (ANPP, weekly Monday exec reviews) come from a news site; DRI at Apple not confirmed by fetched sources.

### Cited Findings
- Apple New Product Process (ANPP); weekly (Monday) exec design review approve/reject loop; proto -> EVT -> DVT. [L] (S) — [iDrop News](https://www.idropnews.com/news/inside-apples-manufacturing-process-how-a-product-idea-becomes-a-reality/171513); [AppleInsider forum](https://forums.appleinsider.com/discussion/236865)
- Generic gates: EVT proves concept, DVT proves design vs requirements, PVT proves production; end of DVT = high confidence yield issues fixed. [M] (S) — [EWM Manufacturing](https://www.ewmfg.com/post/evt-v-dvt-v-pvt-explained)

### Inferences
- Gate format maps to missile development (lab -> captive carry -> guided flight) and to exercises like "what must be true to exit this gate?".

### Gaps
- DRI concept (widely attributed to Apple via Adam Lashinsky's "Inside Apple", 2012) not verified here — treat as folklore-level until checked [F].

## 7. Jane Street / quant judgment training; DeepMind

### Takeaway
Jane Street officially tests probability, expected value and making markets; specific make-a-market drills (bid/ask around an EV, width expressing uncertainty) come from candidate reports. DeepMind method-choice process: no sources gathered.

### Cited Findings
- Jane Street's own prep guide covers "the basic concepts we ask about – probability, expected value, making markets"; "This isn't required reading by any means." [H] (P) — [Jane Street, Probability & Markets](https://www.janestreet.com/probability-markets/)
- Make-a-market prompts: e.g., sum of two dice (EV 7, quote 6 bid / 8 ask); random integer 1-100 (EV 50.5, ~47/54); width trades frequency vs exposure to estimation error; interviewer then trades against you and you revise. [L-M] (S, prep sites) — [techinterview.org market-making](https://www.techinterview.org/post/3233474563/market-making-interview-questions/); [quantt.co.uk](https://www.quantt.co.uk/resources/jane-street-interview)

### Inferences
- Exercise: "make a market" on an engineering quantity (e.g., "detection range of this radar vs 1 m² target: give 90% interval"), then reveal answer; spread width = calibration; track hit rate over lessons (calibration score).

### Gaps
- DeepMind research-review / method-selection practices: not researched (budget); no claims made.
- Jane Street PDF content not read.

## Summary table for exercise design (inferred)
| Format | Core move | 5-20 min exercise |
|---|---|---|
| Speed of light (NVIDIA) | compare to physical floor, not past | floor -> current -> gap ledger in dB |
| Public reasoning / T5T | reason aloud; weak signals | narrated solution; "top 5 surprises" |
| Design doc alternatives | ≥2 real alternatives vs stated goals + non-goals | choose method/component with deciding trade-off |
| ADR | context/decision/status/consequences (incl. negative) | 1-page ADR, later superseded |
| One/two-way door | match analysis depth to reversibility | classify decision first |
| PR/FAQ | write end result first, then skeptic FAQ | test-report-first + FAQ |
| BotE (Dean/Mahajan) | known numbers -> compare designs pre-build; extreme cases | 2-design estimate; limits check |
| Roofline | min of bounds; ridge point | which bound binds and where it switches |
| Make a market | interval + revision | calibrated estimate with spread |
