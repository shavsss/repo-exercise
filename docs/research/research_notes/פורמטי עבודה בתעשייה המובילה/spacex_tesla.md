# SpaceX / Tesla engineering work formats (research notes, Nov 2026)

Certainty key: [H] = primary source or multiple credible sources agree; [M] = credible secondary source or book excerpt quoted by secondary sites, or my recall of a book passage that secondary sources corroborate; [L] = anecdotal / blog / unverified.
Method note: ~20 searches and fetches. Wired, Ars Technica and the books themselves could not be fetched directly, so book content comes via excerpts and summaries. Treat the exact book wording as needing a check against the print edition.

## 1. "The Algorithm" (5 steps): wording, sources, daily use

### Takeaway
The best primary source is Musk's own spoken version on the Everyday Astronaut Starbase tour (Part 1, summer 2021), available as an auto-transcript. Isaacson (2023) gives a written version and says Musk repeated it at production meetings. The order of the steps is the core of the format: question, then delete, then simplify, then accelerate, then automate. Musk names doing the steps in reverse order as his own repeated mistake.

### Cited Findings
- [H] Spoken version, Starbase tour Part 1 (auto-transcript; errors in the original): "make your requirements less dumb"; "it's particularly dangerous if a smart person gave you the requirements because you might not question them enough"; "everyone's wrong no matter who you are everyone's wrong some of the time"; "whatever requirement or constraint you have it must come with a name not a department"; "that person who's putting forward the requirement or constraint must agree that they must take responsibility" — [Everyday Astronaut Starbase tour Pt 1 transcript, rosetta.to](https://rosetta.to/u/everydayastronaut/starbase-tour-with-elon-musk-part-1-summer-2021)
- [H] Step 2 (delete), same source: "try very hard to delete the part or process"; "if you're not occasionally adding things back in you're not deleting enough"; "if you're not adding things back in 10 percent of the time you're clearly not deleting enough" (the transcript garbles "ten percent" as "ten per time") — [rosetta.to transcript](https://rosetta.to/u/everydayastronaut/starbase-tour-with-elon-musk-part-1-summer-2021)
- [H] Step 3: "the third step is simplify or optimize, the third step not the first step"; "possibly the most common error of a smart engineer is to optimize the thing that should not exist" — [same](https://rosetta.to/u/everydayastronaut/starbase-tour-with-elon-musk-part-1-summer-2021)
- [H] Steps 4 and 5: "step four which is accelerate cycle time"; "don't go faster until you have worked on the other three things first"; "the final step is automate" — [same](https://rosetta.to/u/everydayastronaut/starbase-tour-with-elon-musk-part-1-summer-2021)
- [H] Musk's self-correction, on the Tesla Model 3 line: "I have personally made the mistake of going backwards on all five steps multiple times"; "automating was a mistake then accelerating was a mistake then optimizing was a mistake"; "delete the reverse 720 degrees on the bolt because that's unnecessary"; "we just deleted them and just bypassed this two million dollar robot cell". He also says "another mistake that tends to happen in production is too much in-process testing" — [same](https://rosetta.to/u/everydayastronaut/starbase-tour-with-elon-musk-part-1-summer-2021)
- [H] "you really want everyone to be chief engineer ... people need to understand" the whole system — [same](https://rosetta.to/u/everydayastronaut/starbase-tour-with-elon-musk-part-1-summer-2021)
- [M] Isaacson's written version, as paraphrased by secondary summaries. Step 1: question every requirement, and each comes with the name of the person who made it, never "the legal department" or "the safety department". Step 2: delete, and if you don't add back at least 10% you didn't delete enough. Step 3: simplify and optimize, but only after step 2. Step 4: accelerate, but "only do this after you have followed the first three steps". Step 5: automate last. Musk on Fremont and Nevada: "the big mistake ... was that I began by trying to automate every step" — [techbooks substack summary](https://techbooks.substack.com/p/why-visionaries-are-always-jerks); [geekway](https://geekway.substack.com/p/an-ultimate-guide-to-elon-musks-algorithm); [codenote reading notes](https://codenote.net/en/posts/reading-log-9784163917306-elon-musk/)
- [M, from recall of Isaacson; verify in book] Isaacson attaches "corollaries" to the Algorithm. Examples: all technical managers must have hands-on experience; comradery is dangerous because it makes people reluctant to challenge each other; it's OK to be wrong, just don't be confident and wrong; do skip-level meetings when there are problems; "a maniacal sense of urgency is our operating principle"; "the only rules are the ones dictated by the laws of physics. Everything else is a recommendation." The last line is widely quoted — [futureoftuesday substack (quote)](https://futureoftuesday.substack.com/p/from-the-atom-to-mars); the rest needs a check against the book.
- [L] An anonymous ex-engineer, relayed on a blog, says the Algorithm produced perverse incentives: "With all that Accelerating and Automating, if my parts got on the rocket on time, I succeeded". The same account says reviews and process milestones were added to catch mistakes — [greaterwrong shortform](https://www.greaterwrong.com/posts/3LcyoqNTJuCZ65MbL/mo-putera-s-shortform/comment/v8EBSA3xxFxGzrS3b)

### Inferences
- Exercise format: give the learner a list of 6–10 requirements or parts for a small subsystem, such as a seeker or radar spec. For each one: (a) who owns it (a name, not a department) and why it exists, (b) delete or keep, then (c) simplify only the survivors. The learner then picks the one requirement they would "add back", which tests the 10% rule. Scoring penalizes optimizing an item that should have been deleted.
- "Smart person gave you the requirement" is a natural lesson twist: present a requirement framed as coming from an authority, for example "MIL-STD says" or "the chief engineer says", and ask the learner to trace its physical basis.

### Gaps
- Exact printed wording of Isaacson's list and page numbers: not fetched. Secondary sites cite Kindle pp. 284–285 and 363–365 inconsistently.
- No primary source found for "the best part is no part". It is commonly attributed to Musk but did not appear in the tour transcript fetched.

## 2. First-principles thinking and the "idiot index"

### Takeaway
At SpaceX, first principles is practiced in two concrete ways. One is a materials-cost floor: compute what the raw atoms cost, then ask why the part costs N times that (the "idiot index"). The other is design-to-cost targets stated in physical units, such as Raptor cost per ton of thrust and steel versus carbon cost per kg.

### Cited Findings
- [M] Musk on rocket raw materials: "the materials cost of a rocket was around 2 percent of the typical price—which is a crazy ratio for a large mechanical product". This is commonly attributed to the 2012 Wired interview with Chris Anderson; the original was not reachable, and several summaries carry the same text — [qz.com](https://qz.com/972118/simple-math-is-why-elon-musks-companies-keep-doing-what-others-dont-even-consider-possible/); [futureblind](https://futureblind.com/p/atoms-are-cheap-process-is-pricey)
- [M] Isaacson defines the idiot index as the ratio of a part's total cost to the cost of its raw materials. His illustration is a $1,000 part made from $100 of aluminum. A high index signals a design that's too complex or an inefficient process — [manassaloi Isaacson summary](https://manassaloi.com/booksummaries/2023/10/12/musk-isaacson.html); [officechai](https://officechai.com/stories/elon-musk-idiot-index/)
- [M] In-book example from the Raptor cost-down, as relayed by summaries: an engineer cited about $13,000 for a half nozzle jacket made from one piece of steel. Musk asked the raw-material cost; the engineer knew the cost chart down to the smallest part but not the material cost, and guessed a few thousand dollars. This shows the format: the owner must know both numbers — [summary of Isaacson via search results; isegoria](https://www.isegoria.net/?p=50874)
- [H] Raptor target stated in physical-cost units: "what is super hard about raptor is how do we make a raptor where the cost per ton of thrust is under a thousand dollars" and "the hard part is not can you design a staged combustion rocket engine, this has been done" — [Starbase tour transcript](https://rosetta.to/u/everydayastronaut/starbase-tour-with-elon-musk-part-1-summer-2021)
- [H/M] The Starship material decision (late 2018 to January 2019) was argued in per-kg cost and producibility terms. Carbon fiber cost about $135/kg, with roughly 35% scrap, giving an effective ~$200/kg. Stainless steel cost about $3/kg. Steel was heavier but had better cryogenic and high-temperature behavior and was easier to work — [Space.com, Musk explains stainless steel](https://www.space.com/43101-elon-musk-explains-stainless-steel-starship.html); [Teslarati interview](https://www.teslarati.com/spacex-ceo-elon-musk-starship-transpiring-steel-heat-shield-interview). Some secondary sources say $150/kg for carbon — [ozgurnevres](https://ozgurnevres.com/spacex-starship-stainless-steel/)
- [M] The idiot index drove vertical integration, with roughly 80% of hardware built in-house according to a secondary claim. In one case, when a supplier would not deliver a critical engine valve, Mueller's team made it themselves — [search summary of Isaacson / fasterthannormal](https://fasterthannormal.co/companies/spacex) [L for the 80% figure]
- [H] NASA's COTS lessons-learned briefing (2013) noted that SpaceX paid much more attention to the cost of parts, and that fixed-price milestone payments maximized the incentive to control cost — [NASA COTS lessons learned (slideshare copy)](https://es.slideshare.net/tseitlin/cots-lessons-learned2013nov13-36942346)

### Inferences
- Exercise format, "idiot index" card: give a component (a T/R module, a seeker gimbal, a solid-motor case) with a market price and a mass/material breakdown. The learner computes the index, names the top 2 cost drivers (process, tolerance, certification, volume), and proposes one deletion or simplification. One honest caveat should be built in: a critic notes the index ignores labor, safety, certification and QC.
- "Cost per unit of physical output" targets transfer well: $/W of radiated power, $/dB of jammer J/S, $/m/s of delta-v.

### Gaps
- The original Wired 2012 text could not be fetched, so the exact quote attribution is [M].
- I found no documented internal SpaceX template for idiot-index reviews; it is described only through Isaacson anecdotes.

## 3. Hardware-rich development / test-fly-fix vs waterfall; when to test vs analyze

### Takeaway
SpaceX builds and flies early, accepts the loss of test articles, and treats each flight as a data source. This approach is documented in Starship flight tests and in Musk's own remarks: "unknown unknowns" were not on the risk list. NASA's own cost model estimated a traditional Falcon 9 development cost several times higher than SpaceX's NASA-verified spend. No explicit, published decision rule for "test vs analyze" was found. The working heuristic visible in sources is to test when the risk is an unknown unknown or the cost of hardware is low relative to the information gained, and to analyze when public safety or a customer payload is at stake.

### Cited Findings
- [H] On Starship prototypes: "none of the reasons that blew up were on the risk list". Tim Dodd's reply: "The unknown unknowns are the big ones." Musk: "let's just get it out there see what works see what doesn't and iterate" — [Starbase tour transcript](https://rosetta.to/u/everydayastronaut/starbase-tour-with-elon-musk-part-1-summer-2021)
- [H] NASA's NAFCOM cost model estimated Falcon 9 development at about $4.0B under a traditional approach and $1.7B with inputs adjusted for a commercial approach. SpaceX's NASA-verified spend was about $390M ($300M Falcon 9 + $90M Falcon 1). The NASA author cautions that the difference may reflect fewer NASA processes, reduced oversight and less overhead, among other factors — [NASA NTRS, Zapata](https://ntrs.nasa.gov/api/citations/20170008895/downloads/20170008895.pdf); [Shotwell 2011 testimony](https://democrats-science.house.gov/imo/media/doc/2011%2005%2026%20SpaceX%20Shotwell%20Testimony%20Final.pdf)
- [H] Falcon 1's first three flights failed: a leaky valve or fuel leak (2006), propellant slosh (2007), and stage separation recontact (2008). Each was analyzed and the design changed. The fourth flight succeeded in Sept 2008; the company would likely have folded otherwise — [Free Beacon review of Liftoff](https://freebeacon.com/culture/review-liftoff/); [NSS review](https://nss.org/?p=53203); [Shortform Liftoff summary](https://www.shortform.com/summary/liftoff-summary-eric-berger)
- [M] Berger contrasts this with traditional aerospace, where engineers can spend careers on paperwork without touching hardware; "engineering rockets faster ... means eschewing traditional aerospace processes" — [Free Beacon review](https://freebeacon.com/culture/review-liftoff/)
- [M] Berger on Starship test flights: they "blew up their hardware very spectacularly", but NASA understands SpaceX's approach: "they certainly don't see these as failures. They see them as successful test flights" — [Texas Standard interview](https://texasstandard.org/stories/spacex-launch-starship-rocket-explosion-data-progress/)
- [M] Limits and criticism: before a May 2025 flight Musk told Berger "we've got about an 80 percent chance of having solved" the earlier issues, and that flight also failed. 2025 commentary questioned whether iteration was converging — [Futurism](https://futurism.com/elon-musk-starship-improvements-failure.md); [Scientific American](https://scientificamerican.com/article/why-do-spacexs-starships-keep-exploding); [Bloomberg opinion](https://www.bloomberg.com/opinion/articles/2025-05-28/spacex-s-failed-test-proves-musk-needs-to-refocus)
- [L] An ex-SpaceX-adjacent heuristic: "It's faster to get something wrong quickly 3 times and then right the 4th." This is from a vendor blog, not SpaceX — [Flow Engineering blog](https://flowengineering.com/blog/spacex-systems-engineering-five-tips)

### Inferences
- The test-vs-analyze logic visible in the record (my synthesis, not a SpaceX document): uninstrumented risk plus cheap hardware → fly it with heavy telemetry. A payload or crew on board, or public safety → full analysis and corrective-action closure first. Falcon 9 with customer payloads behaves conservatively; Starship test articles do not.
- Exercise format: give a design question with two paths and their numbers. Path (a) is analysis: cost, time, residual uncertainty. Path (b) is a test: hardware cost, turnaround, expected information. The learner chooses, states what telemetry the test must capture, and states what result would kill the design.

### Gaps
- No SpaceX-authored statement of a test-vs-analysis decision rule was found.
- No Raptor test-stand cadence figures were verified for these notes.

## 4. Responsible engineer, requirements ownership, design reviews, alternatives decisions

### Takeaway
SpaceX uses a "Responsible Engineer" (RE) model. One named engineer owns a component or system end to end, including safety, per SpaceX's own statement. Requirements carry a person's name. Internal lower-level requirements are reportedly called "design criteria" and are negotiable between REs. Formal PDR/CDR-style reviews are not documented publicly. Ex-employee accounts describe frequent RE reviews with intense questioning, rather than phase-gate reviews.

### Cited Findings
- [H] SpaceX statement, as reported by Reuters in 2023: REs are ultimately responsible for all aspects of their components and systems, including safety. Reuters reported, based on more than a dozen current and former employees, that this places accountability for failures and injuries on REs — [Insurance Journal (Reuters)](https://www.insurancejournal.com/news/national/2023/11/13/747927.htm)
- [H] Requirement owner principle: a requirement "must come with a name not a department", and its owner "must take responsibility" — [Starbase tour](https://rosetta.to/u/everydayastronaut/starbase-tour-with-elon-musk-part-1-summer-2021)
- [L/M] Vendor blog, not SpaceX-endorsed and by a non-SpaceX author. It says SpaceX has no traditional systems engineers. An RE is a blend of domain engineer, systems engineer and chief engineer: "either everyone is a systems engineer, or no one is." REs "design the global system first, and their local sub-system second", with the hypothetical of accepting 115 kg instead of a 100 kg limit to save 50 kg vehicle-wide. Systems engineers are reportedly renamed "design reliability engineers", often former REs, who speed information flow. Lower-level requirements are called "design criteria"; external NASA/DoD constraints stay "requirements" with full V&V — [Flow Engineering](https://flowengineering.com/blog/spacex-systems-engineering-five-tips)
- [L] An anonymous ex-engineer describes RE meetings as "endless questions" and says process milestones and reviews were added over time to catch mistakes — [greaterwrong](https://www.greaterwrong.com/posts/3LcyoqNTJuCZ65MbL/mo-putera-s-shortform/comment/v8EBSA3xxFxGzrS3b)
- [L] Glassdoor reviews titled "Responsible Engineer" exist and are mixed: "A Job Experience Unlike Any Other" alongside "Poor Management, Toxic Environment" — [Glassdoor](https://www.glassdoor.ie/Reviews/Employee-Review-SpaceX-E40371-RVW4796466.htm)
- [H/M] Alternatives decision example: steel vs carbon fiber for Starship, argued on $/kg, scrap rate, cryogenic and high-temperature strength, and manufacturability; Musk acknowledged the mass penalty — [Space.com](https://www.space.com/43101-elon-musk-explains-stainless-steel-starship.html)
- [H] Engine cycle: Raptor is a full-flow staged combustion engine at higher chamber pressure than before; Musk framed the hard problem as cost per ton of thrust, not cycle feasibility — [Starbase tour](https://rosetta.to/u/everydayastronaut/starbase-tour-with-elon-musk-part-1-summer-2021)

### Inferences
- Exercise format, "RE card": the learner is the RE for one subsystem (e.g., a radome or a pulse-Doppler processor). Write a one-paragraph ownership statement covering interfaces, mass/power budget, the top 3 risks, and how it is verified (test or analysis). Then defend one design criterion that you would trade against a neighbor RE for a global gain (the 115 kg / 50 kg pattern).
- Trade exercise: a two-option comparison table in physical units ($/kg, scrap %, temperature limits, process time), finishing with a one-line decision and what would reverse it.

### Gaps
- No primary documentation of SpaceX design-review structure (participants, cadence, artifacts) was found. The PDR/CDR comparison remains unsourced. For NASA programs (Commercial Crew), SpaceX did go through NASA milestone reviews, but details were not fetched.
- The Raptor cycle-selection reasoning, including the methane choice, was not sourced in this pass.

## 5. Anomaly / failure investigations

### Takeaway
SpaceX leads its own investigations: an Accident Investigation Team, with NASA, FAA or USAF participating or overseeing depending on the mission. It publishes short public updates within days to weeks: a most-probable cause, then confirmation, then corrective actions. These investigations produce lists of root causes and corrective actions; Starship Flight 1 produced 63. Independent reviews sometimes disagree with SpaceX's root cause; NASA's IRT did on CRS-7.

### Cited Findings
- [H] CRS-7 (June 28, 2015). By July 20, 2015, SpaceX named a failed steel strut holding a helium COPV in the second-stage LOX tank as the "most probable, but not definitive" cause. Struts were rated for about 10,000 lbf; the failed one gave way at about 2,000 lbf. The fix was to switch struts and test each one individually — [NASA blog (SpaceX preliminary findings)](https://blogs.nasa.gov/spacex/2015/07/21/spacex-details-preliminary-investigation-findings/); [AmericaSpace](https://www.americaspace.com/2015/07/20/failed-strut-doomed-crs-7-mission-no-falcon-9-launches-before-september-says-elon-musk/)
- [H] NASA's Independent Review Team (public summary in March 2018) agreed on the immediate cause: a liberated COPV and LOX tank rupture. It disagreed on a material flaw and instead found a design error: an industrial-grade (not aerospace-grade) rod end used without proper modeling or load testing under flight conditions, and without following the manufacturer's 4:1 factor recommendation. Findings were corrected or mitigated before Jason-3 in January 2016 — [NASASpaceflight](https://www.nasaspaceflight.com/2018/03/nasas-irt-publishes-crs-7-failure/)
- [H] Amos-6 (Sept 1, 2016, pad explosion during propellant load before a static fire). The investigation reviewed more than 3,000 channels of video and telemetry; the event took about 93 ms from COPV failure to destruction of the stage. Root cause: buckles in a COPV liner let super-chilled LOX pool under the overwrap, where it could ignite through friction or breaking fibers. The helium loading temperature was cold enough to form solid oxygen, which made this worse. Corrective actions: change the COPV configuration to allow warmer helium, return to a flight-proven loading procedure, and long-term redesign the COPVs. The conclusion was announced around Jan 2, 2017, with return to flight Jan 2017, about 4 months after the event — [Satellite Today](https://www.satellitetoday.com/launch/2017/01/05/spacex-completes-anomaly-investigation-announces-jan-8-return-flight/); [Seradata](https://www.seradata.com/spacex-confirms-that-falcon-9-helium-tank-exploded-and-it-will-have-to-revise-its-loading-procedures); [SpacePolicyOnline](https://spacepolicyonline.com/news/spacex-narrows-investigation-but-still-no-root-cause)
- [H] Starship Flight 1 (April 20, 2023). The investigation was SpaceX-led and FAA-overseen, following SpaceX's FAA-approved mishap plan. It closed Sept 8, 2023 with multiple root causes and 63 corrective actions written by SpaceX. Closure did not by itself permit flight; public-safety-related actions and a license modification were required — [FAA](https://www.faa.gov/newsroom/faa-closes-spacex-starship-mishap-investigation); [Space.com](https://www.space.com/faa-closes-spacex-starship-mishap-investigation)
- [H] Later Starship closures followed the same pattern with fewer actions: 17 for Flight 2 (Nov 2023), and 4 for Flight 12, which included hardware and software configuration updates — [Satellite Today](https://www.satellitetoday.com/launch/2023/09/08/faas-mishap-investigation-into-starship-launch-ends-with-63-action-items/); [Barchart](https://www.barchart.com/story/news/3263559/faa-closes-spacex-starship-flight-12-investigation-clears-flight-13-for-launch)

### Inferences
- The observable public format: (1) an immediate statement; (2) within days to weeks, a "most probable cause" with explicit uncertainty wording; (3) a root cause plus contributing factors; (4) a numbered corrective-action list; (5) closure by the regulator or customer, separate from approval to fly. Fault trees are implied: Amos-6 went through a "narrowing" phase before root cause, and CRS-7 and Amos-6 both involved candidate causes being eliminated. The trees themselves were not published.
- Exercise format, "5-minute mishap memo": give telemetry snippets from a missile or radar failure, for example a pressure trace that ends 93 ms after an event. The learner writes a most-probable cause with a confidence level, two alternatives that are not yet excluded and the data that would kill each, and 3 corrective actions split into immediate and long-term. A follow-up twist mirrors the IRT disagreement: an independent reviewer proposes a "design error" rather than a "material flaw" root cause, and the learner must respond.

### Gaps
- The actual fault-tree documents are not public. The full CRS-7 IRT report was not fetched in full.
- No details were found on internal anomaly-board composition or cadence.

## 6. Tesla: production hell, engineers on the line, cost-down

### Takeaway
The best-documented lesson comes from Musk himself. Over-automation of the Model 3 line was a mistake; the fixes were deletion of steps and robot cells, plus a temporary manual line in a tent. These match the Algorithm applied in reverse order of the error.

### Cited Findings
- [H] Musk: "we just deleted them and just bypassed this two million dollar robot cell"; "delete the reverse 720 degrees on the bolt"; "automating was a mistake then accelerating was a mistake then optimizing was a mistake" — [Starbase tour](https://rosetta.to/u/everydayastronaut/starbase-tour-with-elon-musk-part-1-summer-2021)
- [H] In 2018 Tesla built a tent at Fremont, about 50 ft high and several hundred feet long, housing a third Model 3 general assembly line. It was put up in about three weeks, and part of it was reportedly assembled from spare parts — [WRAL (WSJ/AP-style report)](https://www.wral.com/archive/17665668/); [WSWS](https://www.wsws.org/en/articles/2018/07/31/tesl-j31.pdf) (WSWS is a partisan outlet [M])
- [H] Musk slept at the factory during the Model 3 ramp and called it "production hell"; in 2016 he said he moved his desk to wherever the factory problems were worst — [Bloomberg](https://www.bloomberg.com/news/articles/2018-04-02/elon-musk-is-back-to-sleeping-at-the-factory); [Electrek](https://electrek.co/2018/04/03/elon-musk-sleeping-tesla-factory-floor-oversee-model-3-production-denies-report-doug-field/)
- [M] Isaacson: Musk's big mistake in Nevada and Fremont was trying to automate every step first — [techbooks summary](https://techbooks.substack.com/p/why-visionaries-are-always-jerks)

### Inferences
- Exercise format, "line walk": give a 6–8 step assembly or test process with times, for instance a missile final-assembly or an antenna-range test sequence. The learner deletes, merges, then finds the bottleneck. Only then may they automate one step, and must justify why.

### Gaps
- No verified sources were found for specific Isaacson anecdotes (fiberglass mats, "surge" details), for Tesla cost-down examples such as the gigacasting part-count reduction, or for organized "engineers on the line" practices. These were not researched in depth.

## 7. What distinguishes the top level (ex-employees, books, press)

### Takeaway
Credible sources point to a few things. A single named owner per requirement or part. Deletion before optimization. Cost tied to physics floors (materials, $/ton thrust). Very fast build-test cycles that accept hardware loss. Investigations that are fast and public but still subject to independent review. The same sources document real costs: injuries reported by Reuters, burnout, failures that repeat, and root causes contested by NASA's IRT.

### Cited Findings
- [H] Commercial partners funded over 50% of COTS development; fixed-price milestones; SpaceX attended unusually closely to part cost — [NASA COTS lessons learned](https://es.slideshare.net/tseitlin/cots-lessons-learned2013nov13-36942346); [CGO on COTS](https://www.thecgo.org/news/a-2006-nasa-program-shows-how-government-can-move-at-the-speed-of-startups/)
- [H] Reuters (2023) documented 600+ previously unreported worker injuries and attributed them partly to speed and the RE accountability structure — [Insurance Journal / Reuters](https://www.insurancejournal.com/news/national/2023/11/13/747927.htm)
- [M] An ex-SpaceX founder describes a culture in which ideas survive only through harsh testing and frequent design changes — [DevX](https://www.devx.com/daily-news/ex-spacex-engineer-applies-musk-lessons/)
- [M] Berger's *Reentry* credits Mueller with a culture of careful design and testing, and traces Falcon 1 lessons (Merlin 1C regenerative cooling, pintle injector) into Falcon 9 — [Shortform Reentry summary](https://www.shortform.com/summary/reentry-summary-eric-berger)

### Inferences
- For exercises, the distinguishing behaviors are measurable at small scale: (1) every requirement has an owner field; (2) at least one item is deleted per review, with an add-back note; (3) every cost or performance target is tied to a physical floor; (4) every test states beforehand what result would change the design; (5) every failure memo has a confidence level and a corrective-action list.

### Gaps
- Direct Tom Mueller interview quotes were not retrieved. A full *Liftoff* or *Reentry* text check was not possible. Late-2026 Starship and organizational changes were not researched beyond the Flight 12 closure.
