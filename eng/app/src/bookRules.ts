// The lesson as chapters of a book (5.11, docs/LESSON_BOOK_SPEC.md): the course is one book, a module is a booklet,
// a lesson is one or more chapters, a chapter is numbered subsections that build on each other, and each subsection
// is paragraphs with short run-in headings. The plan holds a full outline (what each subsection asks, what it needs,
// what it defines and whether it is for the summary or an aid); the outline is checked for order before a word is
// written; each part gets the outline and the terms defined up to it. Same file in both apps.
import type { CaseAid } from "./caseBlock";

export interface OutlineSection {
  n: string;
  title: string;
  /** the question this subsection answers */
  question: string;
  /** what of the previous subsection it continues (the open question, the limit found, the tool now available) */
  from_prev: string;
  /** terms and symbols it uses that it does not define */
  needs: string[];
  /** terms, symbols, formulas and results it defines; "s" = for the summary, "a" = an aid to this development only */
  defines: { term: string; mark: "s" | "a" }[];
  /** the run-in paragraph headings, in order (e.g. הקדמה, …, מה מחבר ביניהן) */
  paragraphs?: string[];
  compare?: string;
  critique?: string;
  case?: string;
  /** what the reader can do after it that he could not before (21.11: the depth its words come from) */
  depth?: string;
  /** the word budget of the subsection (from its depth) */
  words?: number;
  /** its weight in the lesson (21.11): "core" (a result the lesson is built around), "support" (used by a named later subsection),
   *  "background" (enables a named later step), "anchor" (taught in full by a named later module) */
  role?: string;
  /** the topics of the lesson's "covers" that this subsection teaches, exactly as listed (24.11: no topic of the lesson is skipped) */
  covers?: string[];
  /** what it establishes, exactly: each formula or result in its final form with its symbols, and each number it computes */
  key?: string[];
  /** the visualizations that carry its ideas (10.11: one or more per subsection): chart, svg diagram, mermaid, table, figure, anim or sim, each with what it shows */
  visuals?: string[];
  /** a single planned visualization (plans written before 10.11) */
  visual?: string;
  /** its practice questions: kind and the aspect each tests (practice.ts) */
  questions?: string[];
  /** what the chapter's anchor system asks or shows in this subsection */
  anchor_q?: string;
  /** the history that drives it: who, what blocked them, what they tried, and what that explains */
  history?: string;
  /** assumptions it brings in, and the subsection where each is checked or breaks */
  assumptions?: { text: string; settled_in: string }[];
  /** results it uses before they are derived (as a stated debt), and the subsection that derives them */
  iou?: { result: string; derived_in: string }[];
}
export interface OutlineChapter {
  n: number;
  title: string;
  /** the opening question of the chapter */
  question: string;
  /** the one story the chapter tells, in a sentence: from which problem to which ability (10.11) */
  thread?: string;
  sections: OutlineSection[];
  /** the chapter's comparison and its closing case study */
  comparison?: string;
  case_study?: string;
  /** the one real system that returns in every subsection and carries its question */
  anchor?: string;
}
/** The size of the topic, decided before the outline (24.11): what kind of pages these are and which ideas the lesson is about. */
export interface LessonScope {
  /** overview: the pages survey many fields or ideas to show how they connect; development: they build results step by step */
  kind: "overview" | "development";
  /** the ideas (overview: one or two) or results the lesson is about */
  central: string[];
  /** what in the pages makes it so, in one sentence */
  why?: string;
}
export interface BookOutline {
  /** what the learner already knows (from the course memory and earlier lessons) that this lesson uses */
  known: string[];
  scope?: LessonScope;
  chapters: OutlineChapter[];
}
/** A subsection's words: a central result with its derivation at most, and a supporting idea at most (21.11). */
const MAX_SECTION_WORDS = 2000;
const MAX_SUPPORT_WORDS = 900;
/** An anchor: the claim, one assumption or structure, and one number or case, in one or two paragraphs (24.11). */
const MAX_ANCHOR_WORDS = 300;

export const BOOK_PLAN = (chapterStart: number) => `
THE LESSON AS CHAPTERS OF A BOOK (these rules override every earlier rule about the lesson's structure, its opening and closing blocks, and which blocks to use; the completeness, depth and question rules stay):
- The course is one book, this module a booklet in it, this lesson one or more chapters of it. Number the chapters from ${chapterStart}. A chapter is 3 to 7 numbered subsections (${chapterStart}.1, ${chapterStart}.2, …) that build on each other; each subsection is paragraphs that flow as one argument, with a short bold run-in heading only at a turn of the argument (about one per 3 to 5 paragraphs, for example **הקדמה.** … **מה מחבר ביניהן.**), never on every paragraph.
- These rules change how the material is presented, never what is covered: every planned subsection, topic and depth unit stays, and the word budget below (which follows the depth) stays as it is.
- First decide the size of the topic, in "outline.scope" (24.11, the learner: a survey chapter of ten pages became a lesson of 31,000 words, every stop of the survey developed as if it were the lesson; every topic is different, so there is no word target: the size comes from the topic). "kind": "overview" when the assigned pages survey many fields or ideas to show how they connect (a map chapter), "development" when they build results step by step. "central": the ideas the lesson is about (an overview has one or two) or the results it develops, each a short phrase. "why": one sentence on what in the pages makes it so. Only a subsection that develops a central idea or result is "core". Every other stop is explained until the reader really understands it, filling in what the pages condense (the steps, the reason, the example they skip: the books are sometimes very short), but it is not developed into a topic of its own: "support: N.k" or "background: N.k" with the words that step needs, or "anchor: <module id>" when a later module of the course (listed in <later_modules> when given) teaches it. A definition marked "s", a derivation or a case study of its own belongs to the subsection that is core, or to the module that teaches the topic. Material beyond the pages enters only where it helps the reader understand, never as an early start on a topic a later module teaches. Every topic of the lesson's "covers" (in the lesson plan) is taught: each is named, exactly as listed, in the "covers" of the subsection that teaches it, and is explained there until understood; a topic of the lesson is never an anchor. The lesson's words are the sum of what its subsections need, never filled toward a usual size.
- Plan the full outline before anything else, in "outline". For each subsection: the one question it answers; "from_prev", what of the previous subsection it continues (the question left open, the limit just found, the tool now available); "needs", every term or symbol it uses without defining it; "defines", every term, symbol, formula and result it defines, each marked "s" (for the summary: a result, formula, method or central definition the learner will use as a working tool in later lessons; about 5 to 12 per chapter) or "a" (an aid: scaffolding for this development, and plain vocabulary the prose defines on the way, such as a device name or an everyday unit); "paragraphs", its run-in headings in order; and where it has one, its comparison, its critique and its short case. Per chapter, "anchor": one real system (a radar like the ASR-9, a microscope, a bridge, a launcher) that returns in every subsection and carries part of its question, when the chapter has a real engineering context; per subsection, "anchor_q" (what the anchor asks or shows here), "history" (who was stuck, on what, what they tried, where they erred, and what that explains; empty when no history explains the step), "assumptions" (each assumption it brings in, and "settled_in": the subsection where it is checked or breaks) and "iou" (a result it uses before it is derived, and "derived_in").
- Order: every term, symbol, unit and measure in "needs" is in "known" or defined by an earlier subsection, or is an "iou" of an earlier subsection that a named later one derives. Nothing is used before it is defined, and no subsection explains what an earlier one already used. If a subsection cannot say what of the previous one it continues, the order is wrong or it belongs to another chapter. Organize by the logic of the development, not by the order of the pages.
- The learner knows no physics and only the mathematics he has studied (see the course memory). Background he lacks (charge, energy, momentum, a field, a bound, a unit, a device, standard deviation) is explained where the story first needs it, in a sentence or a short paragraph, with its picture when it has one; it goes into "defines" as "a" and never gets a definition block of its own. "known" lists only what the course memory or an earlier lesson really taught.
- The thread (10.11, the learner's decision): the lesson reads as one continuous story, not a run of definitions. Give each chapter a "thread": one sentence, from which real problem to which ability. Every subsection opens by placing itself on that thread in plain words: where we are, what is still missing for the problem, and why the next idea is needed now (the practical stake: what an engineer could not do without it), never only "to connect formula A with B". Background comes before it is needed: if the problem needs a picture of the world first (what a wave is, what an antenna does), that picture is the start of the chapter, told as background, not a list of terms.
- Density: a subsection introduces at most one central new concept and the result it leads to (at most two "s" items) and about four new terms in all. Never two definitions in a row: between two definition blocks stands the development that needs the second. When the material needs more, split it into more subsections, or move the background earlier.
- Each new concept in this order: the need (in plain words); the picture (its visual) and the idea in plain words; only then the precise general definition (a definition block, for an "s" concept); how it is built; and what it lets us do now, with one short computed case. The definition stays general and comes before any example of it.
- Each central idea follows its development: why the problem is interesting and what did not work without it; how it was approached; the development step by step and why each step is needed; what came out, what it means, and where it breaks or stays open. An analogy only where it helps, never in place of the development.
- Every chapter has at least one comparison (methods, models or alternatives, in prose or a table), a critical look at each central idea (the assumptions it rests on, who disputes it, where it fails), short cases with numbers inside the subsections, and one case study, planned as its own subsection or as the closing part of the subsection it quantifies ("case" holds the system, its question and its comparative alternative where the real context matters). The case study is written in the prose, never in a casestudy block or a box: its own numbered subsection ("### N.k מקרה בוחן: <the system>") or the closing part of the subsection it quantifies, built like the ASR-9 case. (1) The subsection opens with the real system's question and a concrete number that does not yet answer it ("the echo is about −97 dBm; that alone does not say whether the target is detected"), so the tools the subsection builds are built to answer it. (2) **השאלה.** the real system, its published design requirement, and what is tested (does the model, built without knowing this system, give its published performance?). (3) **הקלטים.** every input with its source tag and certainty; when sources disagree, both values and the effect of the difference. (4) **השרשרת.** the computation step by step with numbers from compute, each step naming the equation it uses (a short list where the steps are parallel). (5) **ההשוואה.** the model against the published value, the gap and its reason, and what the model leaves out and in which direction. (6) a consequence the reader would not have guessed (as "what the aircraft sees"). (7) **ידוע לעומת מוערך.** (8) what it means for the system and for decisions: which parameter moves the result, and how much. (9) where the real context matters, a comparative alternative computed the same way (as ADS-B against the primary radar), the trade-off between them (a table where several items are compared), and the false claims an engineer would hear and the check that catches each. With an anchor system, the case study is the anchor's decisive computation.
- Length follows depth (21.11, the learner's decision: depth is the point; words that add no depth are time taken from the course). Every subsection carries depth and names it in "depth", in a form a program checks: one verb of the closed list (in Hebrew: לגזור/להוכיח, לחשב/לאמוד/לפתור, לעקוב אחרי המנגנון של…, להחליט/לבחור בין…) and the tangible product (the formula, the number or the decision), e.g. "לגזור את L_s = (4πd/λ)² משטח אפקטיבי" or "להחליט בין הספק לאנטנה לפי 6 dB = פי 2"; "להבין", "להכיר" or a topic name is not depth. Background the reader needs to follow the argument (the learner knows no physics) is depth: it enables the next step, and it keeps the words it needs, with its picture; its "depth" says "רקע ל-N.k: " and what it enables there. A side topic the argument does not use (a survey or catalog with no mechanism, number or decision) is not a subsection: fold it into one anchor sentence where the story touches it, and leave the rest to the module that teaches it. The thread, the linking sentences between subsections, and the history that explains why a step was needed are part of the depth, never cut as padding. Its "words" come from that depth: a central result with its derivation 1,200 to 2000 words, a supporting idea 400 to 900, a topic a later module of the course (listed in <later_modules> when given) teaches in full a short anchor (about 300 words at most: what it says, why it matters here, one number or case, and where the course teaches it), an enrichment and never its development: no derivation, no formula block, no questions on it. Its development enters here only as far as the central result of this lesson cannot be understood or derived without it, and then as "background: N.k" with only what that step needs (24.11, the learner: a lesson on a narrow topic developed the Navier-Stokes equation, which a later module teaches). A long, complex topic gets the words its depth needs, a topic the course needs less gets fewer; breadth never adds words, and a long lesson is never split for its length. The budget is kept by cutting repetition, second examples, long cases and connections, never a definition, a derivation step or the explanation of a formula's factors. The case study is depth (the learner's decision: the real system brings the equations down to practice): it gets the words its chain of computation needs and is never cut as padding. Every visual replaces prose inside the budget, never adds to it.
- Weight and content of each subsection (21.11: the parts are written apart, from this outline, without the text before them): "role" is "core" (a result the lesson is built around), "support: N.k" (the later subsection that uses it), "background: N.k" (the later step it enables) or "anchor: <module id>" (a later module of the course (listed in <later_modules> when given) teaches it in full; name its id); its words follow from it: a core subsection gets the derivation, the reading of every factor and the computed case at full depth, support and background only what their named step needs. "key" lists what it establishes, exactly: each formula or result in its final form with its symbols, and each number it computes with its value, so that the writer of a later part uses the same symbols and numbers and never repeats them. Inside the JSON, write a formula's LaTeX with every backslash doubled ("$L_s = (4\\\\pi d/\\\\lambda)^2$"), or in plain words and symbols with no backslash.
- Practice (the system grades every answer, never the learner, and the lesson below an open question stays closed until he answers or skips it): every subsection ends with 1 to 3 practice questions, about 10 to 15 in the lesson, and each chapter closes with a mixed set of 3 to 5 from all its subsections. A question asks ONLY about what this subsection or an earlier one taught in full: never about a topic only introduced, an anchor, a first look at a later module, an illustration from a field, or anything the lesson has not yet explained, and every number it needs is in the lesson or in the question. Rotate the kinds inside each chapter, each question on a different aspect (the concept, a computation, a new case, reading a graph or a drawing, catching an error): mcq (four options; every wrong option is a real misconception: units, a sign, a factor of 2 or 10, mixing two quantities; every option has its explanation), numeric (the answer, its unit, a tolerance, and one to three typical wrong values with what each reveals), explain (a short written answer: two to four key ideas and a model answer). Aim for questions a learner who read carefully answers right 70 to 85% of the time. Plan them in each subsection's "questions" (kind and aspect). These replace think, predict, errorhunt, lab and exercise blocks, which a book lesson does not use.
- Visualization carries the ideas (10.11 and 15.11, the learner's decisions: more diagrams, drawings and figures): plan "visuals" for every subsection, at least one each and more than one where a relation, a geometry, a process or a change is explained, about one per 500 to 700 words (18 to 28 in a full lesson). Every central concept gets its visual where it is introduced, before or beside its definition, never only after it; anything with a direction, a shape, a layout or a change in time is drawn before it is formalized. Use the book's own figures of the lesson's pages wherever they show the idea (figure blocks), and draw the rest. Choose by the kind of idea: a relation between quantities is a chart (computed points); a geometry, a layout or a system's parts is an svg diagram; a chain, a process or a link budget is a mermaid diagram; a comparison of several items is a table; a book figure is a figure block; something that changes in time is an anim or a sim. A visual replaces prose (it is inside the word budget), never repeats it: one sentence before it says what to look at, one after says what it shows and what it teaches; sometimes ask the reader first what shape he expects.
- Blocks serve the prose; no step of the argument lives only in a block. In the flow, as many as the ideas need: definition, formula, figure, chart, table, svg, mermaid; the practice questions (mcq, numeric, explain) at the end of each subsection; keep (at the end of the lesson). In the flow, where they answer a question the prose raised: derivation and domain (at most two domain per chapter). Per chapter: at most two verify, and up to four of anim, sim, scene3d, interactive wherever a change in time or in a parameter is the idea. This limit overrides the level-3 counts (predict, verify, errorhunt, lab) and the connection rules (fieldmap and domain blocks per result): a check, a prediction or a mapping beyond it is written in the prose of its subsection. Not used: think, predict, errorhunt, lab and exercise (the practice questions replace them), erratum (a real error of the source is one sentence in the prose; scan and OCR errors are never mentioned, the lesson just uses the right value), story (the chapter opens in prose), plan, today, coverage, refresh (the opening paragraph "what we already know" replaces it), fieldmap, errorhunt and lab (into the prose or the exercises), decide (the engineering case at the end of the lesson replaces it).
- Writing (presentation only): derivations are moves: a goal sentence, 2 to 4 lines of algebra in one display, a payoff sentence; a chain of more than three moves, or one the main argument uses only for its result, goes into a \`\`\`derivation block with a title saying what it proves. No "צעד N" labels and no #### headings. At most about 3 numbers in a paragraph and one quantity in a sentence; more go to a table or a display. Every assumption is stated in a sentence where it enters and settled (checked or broken, with the deciding number) where planned. History that explains why a step was needed is main text, as long as it needs; history that explains nothing is cut. The engineer's judgment (how fast, how much, what it costs, when a good fit is suspicious, which assumption of an impossibility can be broken) is written where the decision is made, in the voice of the text, never as a closing box.
- A part of the writing is one chapter, or a run of whole subsections of a long chapter: give each part "sections": the subsection numbers it writes. Parts never cut a subsection, and every subsection of the outline is in exactly one part.
- The app writes the whole lesson from this plan, from its first subsection: plan every subsection with its "depth" and "words", even when the course memory or the lesson's focus says part of it was written before (that text is not kept); the lesson's budget is the sum of these words.
- Add to the JSON: "outline": {"known": ["…"], "scope": {"kind": "overview", "central": ["…"], "why": "…"}, "chapters": [{"n": ${chapterStart}, "title": "…", "question": "…", "anchor": "…", "thread": "…", "comparison": "…", "case_study": "…", "sections": [{"n": "${chapterStart}.1", "title": "…", "question": "…", "from_prev": "…", "needs": ["…"], "defines": [{"term": "…", "mark": "s"}], "depth": "…", "paragraphs": ["הקדמה", "…", "מה מחבר ביניהן"], "compare": "…", "critique": "…", "case": "…", "words": 1200, "role": "core", "covers": ["…"], "key": ["$L_s = (4\\\\pi d/\\\\lambda)^2$", "1 GHz, 10 km: 112.4 dB"], "visuals": ["svg: …", "chart: … against …"], "questions": ["mcq: …", "numeric: …"], "anchor_q": "…", "history": "…", "assumptions": [{"text": "…", "settled_in": "${chapterStart}.3"}], "iou": [{"result": "…", "derived_in": "${chapterStart}.4"}]}]}]}, and per part "sections": ["${chapterStart}.1", "${chapterStart}.2"]. Short phrases, no prose, in Hebrew.`;

/** A planned word count as a number: the model sometimes writes "1,200", "~900" or "1200–1500" (the first number counts). */
export function wordsOf(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) && v > 0 ? Math.round(v) : 0;
  const m = typeof v === "string" ? v.replace(/(\d),(\d{3})/g, "$1$2").match(/\d+/) : null;
  return m ? Number(m[0]) : 0;
}

/** The planned words of a run of subsections. */
export function partWords(o: BookOutline, mine: string[]): number {
  let n = 0;
  for (const c of o.chapters) for (const s of c.sections) if (mine.includes(s.n)) n += wordsOf(s.words);
  return n;
}

/** Each subsection's planned words, as the part writer sees them ("2.3 ≈700, 2.4 ≈600"). */
function wordsList(o: BookOutline, mine: string[]): string {
  return o.chapters.flatMap((c) => c.sections.filter((s) => mine.includes(s.n) && wordsOf(s.words)).map((s) => `${s.n} ≈${wordsOf(s.words)}`)).join(", ") || "as planned";
}

/** The subsections the parts write, in the outline's order. */
export function writtenSections(o: BookOutline, parts: { sections?: string[] }[]): string[] {
  const mine = new Set(parts.flatMap((_, k) => partSections(o, parts, k)));
  return o.chapters.flatMap((c) => c.sections.map((s) => s.n)).filter((n) => mine.has(n));
}

/** The words of the whole lesson as the writer of a part sees them: what the parts before wrote against their plan (21.11: every part
 *  sees the one ledger, so small overruns of each part never add up). */
export function ledger(o: BookOutline, mine: string[], soFar: number): string {
  const all = o.chapters.flatMap((c) => c.sections.map((s) => s.n));
  const at = all.indexOf(mine[0] ?? "");
  const total = partWords(o, all);
  if (!total || at <= 0) return total ? `The whole lesson is planned at about ${total} words.` : "";
  const planned = partWords(o, all.slice(0, at));
  const over = soFar - planned;
  const state = over > planned * 0.1 ? ` That is ${over} over: write this part tighter than planned by that much, from repetition and second examples only.` : over < -planned * 0.1 ? " That is under the plan: give the core subsections their full planned depth." : " That is on plan.";
  return `The lesson so far: about ${soFar} words written, against ${planned} planned for the subsections before this part (the whole lesson about ${total}).${state}`;
}

/** Every subsection of the outline in exactly one part: one the planner left out goes into the part of the subsection before it,
 *  or, when its whole chapter is left out, into a new part of its own right after that one (a subsection outside every part is never written). */
export function coverParts<P extends { title: string; covers: string; sections?: string[] }>(o: BookOutline, parts: P[]): P[] {
  const out = parts.map((p, k) => ({ ...p, sections: partSections(o, parts, k) }));
  const where = new Map<string, number>();
  out.forEach((p, k) => p.sections.forEach((n) => where.set(n, k)));
  let prev = -1;
  for (const c of o.chapters) {
    const missing = c.sections.filter((s) => !where.has(s.n)).map((s) => s.n);
    if (missing.length === c.sections.length && out.length) {
      out.splice(prev + 1, 0, { ...out[Math.max(0, prev)], title: `פרק ${c.n}: ${c.title ?? ""}`.trim(), covers: c.question ?? "", sections: missing, blocks: [], l25: [] } as P & { sections: string[] });
      for (const [n, k] of where) if (k > prev) where.set(n, k + 1);
      missing.forEach((n) => where.set(n, prev + 1));
      prev += 1;
      continue;
    }
    for (const s of c.sections) {
      const k = where.get(s.n);
      if (k !== undefined) {
        prev = Math.max(prev, k);
        continue;
      }
      const into = Math.max(0, prev);
      const at = out[into].sections.findIndex((n) => order(o, n) > order(o, s.n));
      out[into].sections.splice(at < 0 ? out[into].sections.length : at, 0, s.n);
      where.set(s.n, into);
    }
  }
  return out;
}
const order = (o: BookOutline, n: string) => o.chapters.flatMap((c) => c.sections.map((s) => s.n)).indexOf(n);

/** A fixed outline keeps the words of the checked one where the fix left them out (the budget is the checked plan's own sum). */
export function keepWords(prev: BookOutline, next: BookOutline): BookOutline {
  const had = new Map(prev.chapters.flatMap((c) => c.sections.map((s) => [s.n, wordsOf(s.words)] as const)));
  return { ...next, chapters: next.chapters.map((c) => ({ ...c, sections: c.sections.map((s) => (wordsOf(s.words) || !had.get(s.n) ? s : { ...s, words: had.get(s.n) })) })) };
}

/** The subsections the parts do not write (a problem for the outline check). */
export function coverProblems(o: BookOutline, parts: { sections?: string[] }[]): { where: string; kind: string; problem: string }[] {
  const mine = new Set(writtenSections(o, parts));
  return o.chapters.flatMap((c) => c.sections.filter((s) => !mine.has(s.n)).map((s) => ({ where: s.n, kind: "coverage", problem: `subsection ${s.n} is in no part's "sections", so it would never be written: put it in a part` })));
}

/** The words the learner reads: the code of visual blocks (chart and table JSON, svg, mermaid, scenes) does not count, nor
 * the engineering case, which is outside the word budget (docs/ENGINEERING_CASE.md). */
export const wordCount = (t: string) =>
  (t.replace(/^```(?:chart|table|svg|mermaid|anim|sim|scene3d|interactive|figure|case)[^\n]*\n[\s\S]*?^```[ \t]*$/gm, "").match(/\S+/g) ?? []).length;

/** The terms an outline defines up to (not including) subsection `n`, and the subsections the part writes. */
export function definedBefore(o: BookOutline, n: string): string[] {
  const out = [...o.known];
  for (const c of o.chapters)
    for (const s of c.sections) {
      if (s.n === n) return out;
      out.push(...s.defines.map((d) => d.term));
    }
  return out;
}

const list = (xs: string[]) => xs.filter(Boolean).join("; ") || "—";
/** A subsection's weight as the writer of another part sees it: " [core, ≈1500]". */
const weight = (s: OutlineSection) => (s.role || wordsOf(s.words) ? ` [${[s.role, wordsOf(s.words) ? `≈${wordsOf(s.words)}` : ""].filter(Boolean).join(", ")}]` : "");

/** The outline as the part writer sees it: the whole book of this lesson, with this part's subsections in full. */
export function outlineText(o: BookOutline, mine: string[]): string {
  return o.chapters
    .map((c) => {
      const head = `פרק ${c.n}: ${c.title} — ${c.question}${c.thread ? ` | thread: ${c.thread}` : ""}${c.comparison ? ` | comparison: ${c.comparison}` : ""}${c.case_study ? ` | case study: ${c.case_study}` : ""}${c.anchor ? ` | anchor: ${c.anchor}` : ""}`;
      const secs = c.sections.map((s) =>
        mine.includes(s.n)
          ? `  ${s.n} ${s.title}  ← THIS PART\n    question: ${s.question}\n    continues: ${s.from_prev}\n    needs: ${list(s.needs)}\n    defines: ${list(s.defines.map((d) => `${d.term} [${d.mark === "s" ? "ס" : "ע"}]`))}\n    paragraphs: ${list(s.paragraphs ?? [])}${s.covers?.length ? `\n    teaches the lesson's topics: ${list(s.covers)}` : ""}${s.role ? `\n    role: ${s.role}` : ""}${s.words ? `\n    words: about ${s.words}` : ""}${s.key?.length ? `\n    key: ${list(s.key)}` : ""}${visualsOf(s).length ? `\n    visuals: ${list(visualsOf(s))}` : ""}${s.questions?.length ? `\n    questions: ${list(s.questions)}` : ""}${s.compare ? `\n    comparison: ${s.compare}` : ""}${s.critique ? `\n    critique: ${s.critique}` : ""}${s.case ? `\n    case: ${s.case}` : ""}${s.anchor_q ? `\n    anchor: ${s.anchor_q}` : ""}${s.history ? `\n    history: ${s.history}` : ""}${s.assumptions?.length ? `\n    assumptions: ${list(s.assumptions.map((a) => `${a.text} → ${a.settled_in}`))}` : ""}${s.iou?.length ? `\n    iou: ${list(s.iou.map((d) => `${d.result} → ${d.derived_in}`))}` : ""}`
          : `  ${s.n} ${s.title} — ${s.question}${weight(s)}${s.key?.length && order(o, s.n) < order(o, mine[0] ?? "") ? ` | key: ${list(s.key)}` : ""}`,
      );
      return [head, ...secs].join("\n");
    })
    .join("\n");
}

/** `soFar`: the words written before this part (the ledger of the whole lesson, 21.11). */
export const BOOK_PART = (o: BookOutline, mine: string[], first: boolean, last: boolean, withCase = false, soFar = 0) => {
  const start = mine[0] ?? "";
  const chapterOpens = o.chapters.filter((c) => c.sections[0] && mine.includes(c.sections[0].n)).map((c) => c.n);
  const chapterCloses = o.chapters.filter((c) => c.sections.length && mine.includes(c.sections[c.sections.length - 1].n)).map((c) => c.n);
  return `THE LESSON AS CHAPTERS OF A BOOK (these rules override every earlier rule about structure and blocks):
Outline of the lesson (yours, from the planning step):
${outlineText(o, mine)}
Terms already defined for the learner before this part (use them freely; anything else is defined where it first appears, or before): ${list(start ? definedBefore(o, start) : o.known)}
Write subsections ${mine.join(", ")} as planned, in this form:
- ${chapterOpens.length ? `Chapter ${chapterOpens.join(", ")} opens here: "## פרק N: title", then an opening in prose: the question the reader should feel, what will be shown and what will not, and the anchor system and how it will meet the chapter's steps (no table of contents); then a paragraph **מה אנחנו כבר יודעים.** that recalls in a sentence each earlier idea this chapter needs.` : "No chapter opens in this part: continue the chapter in progress."}
- Each subsection: "### N.k title", then paragraphs that flow as one argument; a bold run-in heading only at a turn of the argument (about one per 3 to 5 paragraphs), never on every paragraph. The first paragraph places it on the chapter's thread in plain words: where we are, what is still missing, and why this idea is needed now (the practical stake), and how it follows from the previous subsection; the last closes with what was gained and the sentence that leads into the next subsection. It reads as one continuous story, never a run of definitions.
- A new concept: the need, then its picture and the idea in plain words, then the precise general definition (a definition block only for a concept marked [ס]), how it is built, and what it lets us do now. Never two definition blocks in a row without the development that needs the second between them.
- Define before use: a term, symbol, unit or measure (eV, dB, a standard deviation, a numerical aperture…) not in the list above and not yet defined in this part is defined at its first appearance (its context, then the definition). Background vocabulary (a unit, a device, an everyday physical idea) is explained inside the sentence that needs it, in a clause or two, never in a definition block. Never "we will see later" for something already used.
- A formula block opens with one or two sentences saying what it computes and why it matters here, then the formula; after a formula block, in prose, each factor: what it stands for and its units, why it is there, what happens when it grows, and the range where the formula holds. An intermediate line of a derivation is followed by its payoff sentence instead.
- Derivations as moves: a goal sentence, 2 to 4 lines of algebra in one display, a payoff sentence (what it gained, what it allows). A chain of more than three moves, or one the argument uses only for its result, goes into a \`\`\`derivation block with a title saying what it proves. No "צעד N" labels, no #### headings.
- Numbers: at most about 3 in a paragraph and one quantity in a sentence; more go into a \`\`\`table or a display line.
- The anchor and the ledger: write each subsection's anchor question as planned, inside the argument (not a side box); state each planned assumption in a sentence where it enters and settle it where planned, with the deciding number; a planned "iou" is said explicitly ("we derive it in N.k") and paid there in full.
- History as the engine, as planned: who was stuck, on what, what they tried, where they erred, and how that leads to the next step; it is main text, never a side box, and anything that explains nothing is left out.
- The engineer's view is part of the voice: how fast, how much, at what cost, when a good fit is suspicious, which assumption of an impossibility can be broken, written where the decision is made, never as a closing paragraph or box.
- Each central idea follows its development: why it is an interesting problem, how it was approached, the steps and why each is needed, what came out, where it breaks.
- The comparison, critique and short case planned for each subsection are written in it, in prose (a table for a comparison of several items). The case study is written in the prose, never in a casestudy block or a box: its own numbered subsection ("### N.k מקרה בוחן: <the system>") or the closing part of the subsection it quantifies, built like the ASR-9 case. (1) The subsection opens with the real system's question and a concrete number that does not yet answer it ("the echo is about −97 dBm; that alone does not say whether the target is detected"), so the tools the subsection builds are built to answer it. (2) **השאלה.** the real system, its published design requirement, and what is tested (does the model, built without knowing this system, give its published performance?). (3) **הקלטים.** every input with its source tag and certainty; when sources disagree, both values and the effect of the difference. (4) **השרשרת.** the computation step by step with numbers from compute, each step naming the equation it uses (a short list where the steps are parallel). (5) **ההשוואה.** the model against the published value, the gap and its reason, and what the model leaves out and in which direction. (6) a consequence the reader would not have guessed (as "what the aircraft sees"). (7) **ידוע לעומת מוערך.** (8) what it means for the system and for decisions: which parameter moves the result, and how much. (9) where the real context matters, a comparative alternative computed the same way (as ADS-B against the primary radar), the trade-off between them (a table where several items are compared), and the false claims an engineer would hear and the check that catches each.
- Weight and length: read the whole outline first and see what each of your subsections is for in the lesson (its role): give a core subsection its full depth, and a support or background subsection only what its named later step needs. Each subsection about its planned words (${wordsList(o, mine)}; this part about ${partWords(o, mine) || "as planned"} words in all). ${ledger(o, mine, soFar)} Keep the length by cutting repetition and second examples, never a definition, a derivation step, a factor's explanation or the case study's chain. Use the symbols and numbers of the "key" of earlier subsections exactly, and never derive or tell again what they established: refer back to it in half a sentence.
- Visuals: write every planned visual of each subsection, at least one in each (a \`\`\`chart with computed points, a \`\`\`svg diagram drawn to scale with Hebrew labels, a \`\`\`mermaid diagram, a \`\`\`table, a figure block with the book's own figure), with one sentence before it saying what to look at and one after saying what it shows; it replaces prose, never repeats it. A central concept's picture comes where the concept is introduced, before or beside its definition. Where a relation, a geometry, a direction, a change in time or a chain is explained only in words, draw it, even if it was not planned; where a change in time or in a parameter is the idea, animate it (anim or sim).
- Mark every definition and formula block with a header line "@mark: summary" for [ס] or "@mark: aid" for [ע], as planned.
- Practice at the end of each subsection, as planned (1 to 3; the chapter's mixed set of 3 to 5 after its case study), in exactly these forms:
\`\`\`mcq
the question (Markdown, math in $…$)
- [ ] a wrong option :: why it is wrong (the misconception it catches)
- [x] the right option :: why it is right
- [ ] … (four options in all, the right one not always in the same place)
\`\`\`
\`\`\`numeric
@answer: 189.7
@unit: ק"מ
@tol: 2%
the question, with every number it needs
---
the worked solution, step by step
- wrong: 95 :: what this value reveals (e.g. the margin taken twice)
\`\`\`
\`\`\`explain
the question ("למה…", "הסבר בשני משפטים…")
---
- a key idea a full answer must contain
- another key idea
===
a model answer of two to four sentences
\`\`\`
  A numeric @answer (and a wrong value) may be complex or an expression where that is the natural answer: 3+4j, 5∠53.13° (degrees), sqrt(2)/2; the learner can type these too.
  Ask ONLY about what this subsection or an earlier one taught in full, never about a topic only introduced, an anchor, a first look at a later module, an illustration, or anything not yet explained; every number the question needs is in the lesson or in it. Each question tests a different aspect. No think, predict, errorhunt, lab or exercise blocks.
- Blocks serve the prose and never carry a step of the argument alone. Allowed in the flow, as many as the ideas need: definition, formula, figure, chart, table, svg, mermaid. In the flow, where they answer a question the prose raised: derivation and domain (at most two domain per chapter). Per chapter: at most two verify, up to four of anim, sim, scene3d, interactive; any other check or mapping goes into the prose (this overrides the level-3 and connection counts). Practice questions stand at the end of a subsection, never inside a derivation. Never: casestudy (the case study is prose), erratum, story, plan, today, coverage, refresh, fieldmap, think, predict, errorhunt, lab, exercise, decide. Scan and OCR errors of the source are never mentioned: use the right value.
- Never put a fenced block inside another block (a chart, svg or table inside a domain, derivation or definition breaks the page): place it just before or after, and refer to it. Every fence line stands alone on its line.
- Plain, continuous Hebrew; a foreign term once, in its [[מונח: … | …]] tag, never mixed into the sentence after that; one symbol, one meaning.
${chapterCloses.length ? `- Chapter ${chapterCloses.join(", ")} closes here: its case study (planned), then a closing paragraph in prose (what the chapter built and how it leads to the next).` : ""}
${last ? `- This part ends the lesson: after the last chapter's close and its mixed practice set, the keep block holds exactly the items marked [ס] (one "name: …" line each, standing on its own), then one sentence about the next lesson${withCase ? ", then the engineering case block (below) as the very last thing of the lesson" : ""}. No coverage, today or exercise block.` : "- Do not end the lesson, write the keep block, exercises or the engineering case in this part."}
${first ? "" : "- Continue seamlessly from the text above: no recap, no repeated heading."}`;
};

/* ---------------- the engineering case at the end of the lesson (docs/ENGINEERING_CASE.md; parser in caseBlock.ts) ---------------- */

/** What the planner reserves for the case (the plan's "case" field). */
export interface CasePlan {
  title?: string;
  scenario?: string;
  stages?: string;
  fault?: string;
  numbers?: string[];
  idea?: string;
}

// The stages as checked against their original sources (docs/research/reports/אימות התבנית מול המקורות.md).
const CASE_STAGES_TEXT = `1 the problem and the requirements (the real question; per requirement its owner, a named person not a department, its rationale and how it will be verified, as in NASA's requirement metadata; which requirement is unneeded or wrong and is deleted before anything is optimized; what is explicitly a non-goal); 2 the physical limit ("speed of light": the limit as the minimum of several named limits, which one binds now and where the binding one changes, and a gap budget that names every gap and its size; roofline is the computing form of this, applying it outside computing is an analogy); 3 architecture (a choice between system architectures: real alternatives, including using what exists or doing nothing, weighed against a criterion; the interfaces, external and between the parts; the cross-cutting concerns: safety, security, maintainability); 4 methods and algorithms (a choice between methods, equations and algorithms against mandatory and enhancing criteria, the risk of each, whether the main uncertainty could reverse the ranking, and where each breaks: its range of validity); 5 does it already exist, given these choices (who does it, in which companies and countries, how, why some chose otherwise, problems, trends, bottlenecks; whether existing designs fit these conditions; your knowledge up to its date is enough, with a certainty label on every claim); 6 breaking (a pre-mortem as Klein runs it: the project has failed; the learner first writes his own failure reasons, alone, then the red team adds the strongest one he missed, then he strengthens the plan); 7 the experiment (which requirement of stage 1 it verifies, by which method: test, inspection, analysis or demonstration, and which result would kill the design); 8 your idea (what he would do differently, and whether it deletes before it optimizes; it is kept in his idea store). A lesson about reliability or a failure may open with "fault": a failure to diagnose, then its fix, then what would have prevented it, and go on with the stages that fit (e.g. fault,6,7,8).`;

/** The aids of a worked case (caseBlock.ts caseAid): what the planner and the writer add for the module's first lessons. */
const AID_PLAN: Record<"example" | "guide", string> = {
  example: ` This is the first lesson of its module, so the case is a worked one: every stage also carries guidelines and a model answer (see the writing step); plan in "numbers" the numbers the model answers state too.`,
  guide: ` This is the second lesson of its module: every stage also carries guidelines (no model answer).`,
};
const AID_PART: Record<"example" | "guide", string> = {
  example: `This case is a WORKED one (the first lesson of its module, so the learner has something to compare himself with): every stage section also carries, after its rubric:
guide:
- what a good answer at this stage contains, 3 to 5 short Hebrew lines (what to quantify, which alternatives to weigh, what to state explicitly); never the decisive rubric item itself or its answer
example:
a model answer at the expected level, in Hebrew, about 80 to 180 words, OUR OWN, written for this case (never a company's document, a published example or a paraphrase of one: the learner compares himself with published standards only after he commits, in the room), written as a strong engineer on a world-leading team would write it in the review: the proposal, its reasoning, the numbers (computed with compute), the alternatives rejected and why, and its confidence as "ביטחון: NN%". It is one defensible answer, not the only one, and it meets the decisive rubric item. The learner sees the guide only if he opens it before writing, and the example beside his own proposal only after he commits.`,
  guide: `This case is a GUIDED one (the second lesson of its module): every stage section also carries, after its rubric:
guide:
- what a good answer at this stage contains, 3 to 5 short Hebrew lines (what to quantify, which alternatives to weigh, what to state explicitly); never the decisive rubric item itself or its answer
No example: section.`,
};

export const CASE_PLAN = (aid: CaseAid = null) => `
THE ENGINEERING CASE (one per lesson, the very last thing in it; it is not the chapter's casestudy): plan it now. Put "case" last in the last part's "blocks", and add to the JSON "case": {"title": "…", "scenario": "one line: the engineering problem, built from this lesson's central results and what <course_memory> says the learner already learned", "stages": "1,2,3,4,5,6,7,8", "fault": "only when the lesson opens the case with a failure: which one", "numbers": ["every number the brief and the expert reasoning need, computed now with compute"], "idea": "an idea from <idea_store>, or an open question of <research_proposals>, that fits stage 8, if one does"}. The stages, in this fixed order: ${CASE_STAGES_TEXT} Most lessons take all eight; a lesson that invites fewer takes only those, never forced, in the same order. The case is not counted in the depth units or the word budget, and nothing else is planned smaller for it.${aid ? AID_PLAN[aid] : ""}`;

/** The writer's spec of the ```case block, for the last part. `id` is the case's stable id and `aid` what its place in
 * the module adds (caseBlock.ts caseId, caseAid). */
export const CASE_PART = (id: string, plan?: CasePlan, aid: CaseAid = null) => `THE ENGINEERING CASE (the last thing in the lesson, after the sentence about the next lesson): exactly one \`\`\`case block. The learner works through it later, in a separate design-review room, with a senior peer: at each stage he proposes and argues in writing with his confidence in %, the reviewer in the stage's role challenges him with data, he defends or changes, commits, and only then sees the expert reasoning and the rubric and writes what the expert saw that he did not; after each commit the room also compares his work with the published template of the stage (requirement metadata, roofline, design doc, decision report, pre-mortem, verification; the app holds them with their sources); at the end he writes a decision record (ADR: context, decision, status, consequences, the alternatives rejected, what would reverse it), gets a debrief that names the one important decision he missed, and the case becomes a research proposal he can return to. It is a process, not a quiz. You write now the material that process runs on, sourced and checked: the reviewer will not invent it later.
${plan ? `Planned: ${JSON.stringify(plan)}\n` : ""}The stages, in this fixed order, only those the content invites (most lessons all eight): ${CASE_STAGES_TEXT}
The bar is the world's leading engineering teams: in every stage the expert says what they do differently from traditional industry, with a few examples that fit the topic (SpaceX, NVIDIA and Anduril are examples of the bar, not a closed list), each with its certainty label. A historical failure (Patriot, Ariane 5, Mars Climate Orbiter, Columbia) enters with its numbers only when its original report is in the source pages and you checked them against it; otherwise without the numbers, or another case.
Exactly this form:
\`\`\`case
@title: the engineering problem, in Hebrew
@id: ${id}
@stages: 1,2,3,4,5,6,7,8
@roles: 1=בעל הדרישה; 5=מהנדס בחברה שבחרה אחרת; 6=צוות אדום; *=מהנדס בכיר
The brief the learner sees (Hebrew Markdown, about 150 to 300 words): the scenario, built from this lesson's results and from what <course_memory> says he learned; the numbers, computed with compute, stated exactly as computed; the constraints. No hint of the answers.
---
@@ stage 1
ask: the stage's question to the learner, one or two Hebrew sentences
anchors:
- a datum the reviewer challenges with, a computed limit or margin, or (stage 5) a claim about who does it and how, with its [[ודאות: …]]
expert:
the expert reasoning aloud, in Hebrew, about 80 to 200 words: what the top teams decide here and why, what traditional industry does instead, the numbers, and how this link shapes the next stages; every claim with its page tag [[DOC:PAGE]], a named published source "(מקור: …)", or [[ודאות: …]]
rubric:
- [!] the decision that separates the top level from the average (exactly one per stage)
- [ ] a yes/no check (two to five of these; for an open design choice, whether his alternative is defensible and what it costs, never whether it matches yours)
@@ stage 2
… one section per stage of @stages, in its order ("@@ stage fault" for a fault opening) …
@@ debrief
decisions:
- the key decisions of the whole case, most important first (the debrief names the one he missed)
\`\`\`
Rules: one block; no fenced block inside it (code goes in a ~~~ fence); every fence line alone on its line; the labels ask:, anchors:, expert:, rubric:, decisions: (and guide:, example: in a worked case) in English at the start of their line, exactly as above; "@@" only at the head of a section. @stages and the sections agree. The stages chain: each ask builds on what the learner will have decided in the stage before ("the architecture you chose"), never on a fixed answer. Stage 8's ask may recall a fitting idea from <idea_store> or an open question from <research_proposals>. Stage 6's ask asks him to write his own failure reasons first ("it failed a year from now: why?"), never hands him a failure to defend against. Every number is computed with compute. The case is outside the word budget, and nothing else in the lesson is shortened for it.${aid ? `\n${AID_PART[aid]}` : ""}`;

/** The order check of the outline, before any text is written. */
export function outlineCheckPrompt(o: BookOutline, lessonTitle: string): string {
  return `<outline_check>
You check the outline of one lesson of a self-study book (Hebrew) before it is written. The learner knows no physics and only the mathematics he has studied. Check strictly:
1. Order: every term, symbol, unit and measure in a subsection's "needs" is in "known", in the "defines" of an EARLIER subsection, or in the "iou" of an earlier subsection that a later one derives. A unit or measure used without being defined (eV, dB, a standard deviation…) is a violation too. List each violation.
2. Continuity: every subsection's "from_prev" names something the previous subsection really leaves (a question, a limit, a tool). A jump, a reversed order (a result before what it rests on), or a subsection that belongs elsewhere is a problem.
3. Coverage of the form: each chapter has a comparison, a worked case study (a real engineer's computation step by step, comparative where the real context matters), and critique of its central ideas; a chapter with a real engineering context has an "anchor" system, and each of its subsections an "anchor_q".
4. Marks: a term marked "s" that is only scaffolding, or a result the course will use later marked "a".
5. "known" holds only what an earlier lesson taught (not physics the learner never studied).
6. Density: a subsection that introduces more than one central concept and its result (more than two "s" items) or more than about four new terms, or a run of definitions with no development between them, is a problem: split it or move the background earlier.
7. Thread: each chapter has a "thread" (from which real problem to which ability), and every subsection's "question" serves it; a subsection whose reason is only formal ("to connect A with B") with no practical stake is a problem.
8. Visuals: a subsection with no planned visual, or a central concept with a direction, a shape, a layout or a change in time and no picture of it, is a problem.
9. Ledger: every assumption's "settled_in" and every iou's "derived_in" names a LATER subsection of this outline, and that subsection's question or critique can settle it.
10. Depth (length follows depth): a subsection whose "depth" is missing or only descriptive, or does not name a verb of the closed list (derive or prove, compute or estimate or solve, trace a mechanism, decide or choose between alternatives) with its tangible product (the formula, the number or the decision), or whose "words" are missing or exceed what its depth needs, is a problem; background the reader needs is depth when it says which later step it enables ("רקע ל-N.k: …"): fold it into an anchor sentence, cut it, or leave it to the module that teaches it.
Lesson: ${lessonTitle}
<outline>
${JSON.stringify(o, null, 1)}
</outline>
Reply with ONLY one JSON object: {"problems": [{"where": "3.2", "kind": "order|continuity|form|mark|known|density|thread|visual|ledger|depth", "problem": "…", "fix": "…"}], "verdict": "pass|fix"}. "pass" only when the list is empty.
</outline_check>`;
}

export interface OutlineReview {
  problems: { where?: string; kind?: string; problem?: string; fix?: string }[];
  verdict: "pass" | "fix";
}

export function parseOutlineReview(raw: unknown): OutlineReview | null {
  const o = (typeof raw === "string" ? jsonOf(raw) : raw) as Record<string, unknown> | null;
  if (!o || typeof o !== "object") return null;
  const problems = Array.isArray(o.problems) ? (o.problems.filter((p) => p && typeof p === "object") as OutlineReview["problems"]) : [];
  return { problems, verdict: problems.length ? "fix" : "pass" };
}

function jsonOf(raw: string): unknown {
  const t = raw.replace(/```(?:json)?/gi, "").trim();
  const a = t.indexOf("{");
  const b = t.lastIndexOf("}");
  if (a < 0 || b <= a) return null;
  try {
    return JSON.parse(t.slice(a, b + 1));
  } catch {
    return null;
  }
}

export const OUTLINE_FIX = (review: OutlineReview) =>
  `The outline of your plan was checked for order before writing, and these problems were found:\n${JSON.stringify(review.problems, null, 1)}\nReply with ONLY the whole plan JSON again (same format, every field), with the outline and the parts fixed so that each problem is gone: move or add a definition earlier, reorder subsections, split a dense subsection, add the chapter's thread or the missing visual, add the missing comparison, case, anchor or critique, fix the marks, settle each assumption and pay each iou in a named later subsection. Keep all the material.`;

/** Is the outline usable (it is what the parts are written from)? */
export function validOutline(o: unknown): o is BookOutline {
  const x = o as BookOutline;
  return !!x && Array.isArray(x.chapters) && x.chapters.length > 0 && x.chapters.every((c) => Array.isArray(c.sections) && c.sections.length > 0 && c.sections.every((s) => typeof s.n === "string" && Array.isArray(s.defines ?? []) && Array.isArray(s.needs ?? [])));
}

function scopeOf(v: unknown): LessonScope | undefined {
  const x = v as Partial<LessonScope> | undefined;
  if (!x || (x.kind !== "overview" && x.kind !== "development")) return undefined;
  return { kind: x.kind, central: (Array.isArray(x.central) ? x.central : []).filter((c) => typeof c === "string" && c.trim()), why: typeof x.why === "string" ? x.why : undefined };
}

/** Fills defaults so the rest of the code can rely on the shape. */
export function normalizeOutline(o: BookOutline): BookOutline {
  return {
    known: Array.isArray(o.known) ? o.known.filter((k) => typeof k === "string") : [],
    scope: scopeOf(o.scope),
    chapters: o.chapters.map((c) => ({
      ...c,
      sections: c.sections.map((s) => ({
        ...s,
        needs: (s.needs ?? []).filter((t) => typeof t === "string"),
        defines: (s.defines ?? []).map((d) => (typeof d === "string" ? { term: d, mark: "a" as const } : { term: String(d.term ?? ""), mark: d.mark === "s" ? ("s" as const) : ("a" as const) })).filter((d) => d.term),
        visuals: visualsOf(s),
        visual: undefined,
        from_prev: s.from_prev ?? "",
        question: s.question ?? "",
        words: wordsOf(s.words) || undefined,
        role: typeof s.role === "string" ? s.role : undefined,
        covers: (Array.isArray(s.covers) ? s.covers : []).filter((h) => typeof h === "string" && h.trim()),
        key: (Array.isArray(s.key) ? s.key : []).filter((k) => typeof k === "string" && k.trim()),
        assumptions: (Array.isArray(s.assumptions) ? s.assumptions : []).filter((a) => a && typeof a.text === "string").map((a) => ({ text: a.text, settled_in: String(a.settled_in ?? "") })),
        iou: (Array.isArray(s.iou) ? s.iou : []).filter((d) => d && typeof d.result === "string").map((d) => ({ result: d.result, derived_in: String(d.derived_in ?? "") })),
      })),
    })),
  };
}

/** The order problems a program can find without a model: a need that nothing earlier defines (an earlier stated debt, "iou", counts),
 *  and an assumption or a debt whose settling subsection is not a later one of the outline. */
export function orderProblems(o: BookOutline): { where: string; kind: string; problem: string }[] {
  const norm = (t: string) => t.replace(/[$\\{}()"'״׳.,]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  const seen = new Set(o.known.map(norm));
  const all = new Map<string, string>();
  for (const c of o.chapters) for (const s of c.sections) for (const d of s.defines) if (!all.has(norm(d.term))) all.set(norm(d.term), s.n);
  const out: { where: string; kind: string; problem: string }[] = [];
  const order = o.chapters.flatMap((c) => c.sections.map((s) => s.n));
  const later = (from: string, to: string) => order.indexOf(to) > order.indexOf(from);
  for (const c of o.chapters)
    for (const s of c.sections) {
      for (const a of s.assumptions ?? []) if (!later(s.n, a.settled_in)) out.push({ where: s.n, kind: "ledger", problem: `the assumption «${a.text}» is never settled in a later subsection` });
      for (const d of s.iou ?? []) {
        if (!later(s.n, d.derived_in)) out.push({ where: s.n, kind: "ledger", problem: `«${d.result}» is used before it is derived, and no later subsection derives it` });
        seen.add(norm(d.result));
      }
      for (const need of s.needs) {
        const k = norm(need);
        if (!k || seen.has(k)) continue;
        const later = all.get(k);
        if (later) out.push({ where: s.n, kind: "order", problem: `«${need}» is used here but defined only in ${later}` });
      }
      for (const d of s.defines) seen.add(norm(d.term));
    }
  return out;
}

/** A subsection's planned visualizations (the old single "visual" counts as one). */
export function visualsOf(s: OutlineSection): string[] {
  return [...(Array.isArray(s.visuals) ? s.visuals : []), ...(s.visual ? [s.visual] : [])].filter((v) => typeof v === "string" && v.trim());
}

/** a subsection's "s" items (one central concept and the result it leads to), and its new terms in all (10.11) */
const MAX_CENTRAL = 2;
const MAX_TERMS = 4;

/** The closed list of depth verbs (21.11): derive (prove, show that, build a formula), compute (estimate, solve, count, convert, decompose),
 *  trace a mechanism, decide (choose, design, compare alternatives). Hebrew forms with
 *  their one-letter prefixes (ו, ל, ש, ה, ב), and the English words a plan sometimes uses. */
const DEPTH_VERB = new RegExp(
  "(?:^|[^\u05d0-\u05ea])(?:[ולשהב]|וכש|כש)?(?:" +
    [
      "לגזור|גוזר|גוזרת|גוזרים|גזירה|גזירת|לפתח את|מפתח את|להוכיח|מוכיח|מוכיחה|הוכחה|הוכחת|להראות ש|מראה ש|לבנות את|בונה את",
      "לחשב|מחשב|מחשבת|מחשבים|חישוב|לאמוד|אומד|אומדת|אומדן|להעריך|מעריך|מעריכה|לפתור|פותר|פותרת|לכמת|מכמת|לספור|סופר|להמיר|ממיר|לתרגם|מתרגם|לפרק|מפרק",
      "לעקוב|עוקב|עוקבת|מעקב|מנגנון|המנגנון",
      "להחליט|מחליט|מחליטה|החלטה|להכריע|מכריע|מכריעה|הכרעה|לבחור|בוחר|בוחרת|בחירה|לתכנן|מתכנן|להשוות|משווה",
    ].join("|") +
    ")(?![\u05d0-\u05ea])|\\b(?:derive|prove|compute|calculate|estimate|solve|trace|mechanism|decide|choose)",
  "i",
);
/** depth shorter than this many words names no product */
const MIN_DEPTH_WORDS = 4;
/** Background the reader needs counts as depth when it names the later step it enables ("רקע ל-2.4: …"). */
const BACKGROUND = /(?:רקע|background)[^\d]{0,12}\d+\.\d+/i;

/** Is a subsection's "depth" checkable (a verb of the closed list and its tangible product)? Returns the problem, or "" when it is. */
export function depthProblem(depth: string | undefined): string {
  const d = (depth ?? "").trim();
  if (!d) return `no "depth": name what the reader can do after it (derive, compute, trace a mechanism, decide) and its product, or fold it into an anchor sentence`;
  if (BACKGROUND.test(d) && d.split(/\s+/).length >= MIN_DEPTH_WORDS) return "";
  if (!DEPTH_VERB.test(d)) return `"depth" («${d.slice(0, 60)}») names no verb of the list (לגזור, לחשב, לעקוב אחרי מנגנון, להחליט בין חלופות): say what the reader derives, computes, traces or decides, or mark needed background "רקע ל-N.k: …", or fold it into an anchor sentence`;
  if (d.split(/\s+/).length < MIN_DEPTH_WORDS) return `"depth" («${d}») is too short to name its product: the formula, the number or the decision`;
  return "";
}

/** The density, thread and visual rules that can be checked without a model (10.11). */
export function formProblems(o: BookOutline): { where: string; kind: string; problem: string }[] {
  const out: { where: string; kind: string; problem: string }[] = [];
  for (const c of o.chapters) {
    if (!c.thread?.trim()) out.push({ where: String(c.n), kind: "thread", problem: `chapter ${c.n} has no "thread"` });
    for (const s of c.sections) {
      const central = s.defines.filter((d) => d.mark === "s").length;
      if (central > MAX_CENTRAL) out.push({ where: s.n, kind: "density", problem: `${central} items marked "s" in one subsection (at most ${MAX_CENTRAL}: one central concept and its result): split it` });
      if (s.defines.length > MAX_TERMS) out.push({ where: s.n, kind: "density", problem: `${s.defines.length} new terms in one subsection (about ${MAX_TERMS} at most): split it or move the background earlier` });
      if (!visualsOf(s).length) out.push({ where: s.n, kind: "visual", problem: "no planned visual" });
      const why = depthProblem(s.depth);
      if (why) out.push({ where: s.n, kind: "depth", problem: why });
      const w = wordsOf(s.words);
      if (!w) out.push({ where: s.n, kind: "depth", problem: `no "words": plan the words its depth needs (every subsection is written now, even one the course memory says was written before)` });
      if (w > (central ? MAX_SECTION_WORDS : MAX_SUPPORT_WORDS) * 1.1) out.push({ where: s.n, kind: "depth", problem: `${w} words for ${central ? "a central result" : "a supporting idea"} (at most about ${central ? MAX_SECTION_WORDS : MAX_SUPPORT_WORDS}): cut what is not depth, or split it` });
    }
  }
  return out;
}

/**
 * A subsection planned as "anchor: <module>" (24.11, the learner: a topic a later module teaches was developed at length): it names
 * one of the later modules, and stays short. An anchor that names no later module is taught here in full, so it must say "core",
 * "support" or "background" instead.
 */
export function anchorProblems(o: BookOutline, later: string[]): { where: string; kind: string; problem: string }[] {
  const out: { where: string; kind: string; problem: string }[] = [];
  const ids = new Set(later);
  for (const c of o.chapters)
    for (const s of c.sections) {
      if (!/^anchor\b/i.test(s.role ?? "")) continue;
      const id = /\bM\d+(?:\.\d+)?\b/.exec(s.role ?? "")?.[0];
      if (!id || !ids.has(id)) out.push({ where: s.n, kind: "anchor", problem: `role "${s.role}" names no later module of the course: name the later module that teaches it in full, or teach it here (core, support or background)` });
      const w = wordsOf(s.words);
      if (w > MAX_ANCHOR_WORDS * 1.1) out.push({ where: s.n, kind: "anchor", problem: `${w} words for an anchor (at most about ${MAX_ANCHOR_WORDS}: the claim, one assumption or structure, one number or case); its development belongs to ${id ?? "the later module"}` });
    }
  return out;
}

/**
 * The size of the topic (24.11): the plan states its scope, and in an overview only the subsections of its central ideas are
 * developed. A core subsection is a central idea's; a stop of the survey is explained until understood but gets no "s" definition of
 * its own (24.11, the learner: books are sometimes very short and a stop must be explained; no cap on its words beyond formProblems).
 */
export function scopeProblems(o: BookOutline, covers: string[] = []): { where: string; kind: string; problem: string }[] {
  const missing = coverageProblems(o, covers);
  return [...missing, ...surveyProblems(o)];
}

/** Every topic of the lesson's "covers" is taught by a subsection that names it, and never by an anchor (24.11: no topic is skipped). */
function coverageProblems(o: BookOutline, covers: string[]): { where: string; kind: string; problem: string }[] {
  const norm = (t: string) => t.replace(/\s+/g, " ").trim().toLowerCase();
  const sections = o.chapters.flatMap((c) => c.sections);
  const taught = new Set(sections.flatMap((s) => s.covers ?? []).map(norm));
  return [
    ...covers.filter((h) => !taught.has(norm(h))).map((h) => ({ where: "outline", kind: "coverage", problem: `the topic "${h}" of this lesson is in no subsection's "covers": teach it in a subsection and name it there` })),
    ...sections.filter((s) => /^anchor\b/i.test(s.role ?? "") && s.covers?.length).map((s) => ({ where: s.n, kind: "coverage", problem: `an anchor teaches a topic of this lesson (${s.covers!.join("; ")}): a topic of the lesson is taught here in full` })),
  ];
}

function surveyProblems(o: BookOutline): { where: string; kind: string; problem: string }[] {
  const sc = o.scope;
  if (!sc) return [{ where: "outline", kind: "scope", problem: 'no "scope": state the kind of the pages (overview or development), the central ideas, and why' }];
  if (!sc.central.length) return [{ where: "outline", kind: "scope", problem: 'the scope names no central idea' }];
  if (sc.kind !== "overview") return [];
  const out: { where: string; kind: string; problem: string }[] = [];
  if (sc.central.length > 2) out.push({ where: "outline", kind: "scope", problem: `an overview with ${sc.central.length} central ideas (one or two): the others are stops of the survey` });
  const sections = o.chapters.flatMap((c) => c.sections);
  const core = sections.filter((s) => /^core\b/i.test(s.role ?? ""));
  if (core.length > 2 * sc.central.length + 1) out.push({ where: "outline", kind: "scope", problem: `${core.length} core subsections in an overview about ${sc.central.join("; ")}: keep core only where a central idea is developed, the other stops are support, background or anchor` });
  for (const s of sections) {
    if (/^core\b/i.test(s.role ?? "")) continue;
    if (s.defines.some((d) => d.mark === "s")) out.push({ where: s.n, kind: "scope", problem: `a stop of the survey (${s.role ?? "no role"}) defines a working tool ("s"): mark it "a", or leave it to the module that teaches it` });
  }
  return out;
}

/** The parts' subsections: from the plan, or (when the plan gave none) each chapter is one part. */
export function partSections(o: BookOutline, parts: { sections?: string[] }[], k: number): string[] {
  const given = parts[k]?.sections;
  if (Array.isArray(given) && given.length) return given.map(String);
  const c = o.chapters[k];
  return c ? c.sections.map((s) => s.n) : [];
}

/**
 * A plan whose JSON did not parse (22.11: the raw plan was shown to the learner as the lesson). The usual cause is LaTeX in a
 * string with single backslashes ("\Delta", "\pi"): every backslash that does not start a valid JSON escape is doubled, and the
 * plan is parsed again. Null when it still does not parse.
 */
export function planFromText<P extends { parts?: unknown[] }>(e: unknown): P | null {
  const t = String((e as { text?: string })?.text ?? "");
  const a = t.indexOf("{");
  const b = t.lastIndexOf("}");
  if (a < 0 || b <= a) return null;
  try {
    const p = JSON.parse(t.slice(a, b + 1).replace(/\\(["\\/]|u[0-9a-fA-F]{4})|\\/g, (m: string, ok?: string) => (ok ? m : "\\\\"))) as P;
    return Array.isArray(p?.parts) && p.parts.length ? p : null;
  } catch {
    return null;
  }
}
