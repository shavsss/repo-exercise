// The lesson as chapters of a book (5.11, docs/LESSON_BOOK_SPEC.md): the course is one book, a module is a booklet,
// a lesson is one or more chapters, a chapter is numbered subsections that build on each other, and each subsection
// is paragraphs with short run-in headings. The plan holds a full outline (what each subsection asks, what it needs,
// what it defines and whether it is for the summary or an aid); the outline is checked for order before a word is
// written; each part gets the outline and the terms defined up to it. Same file in both apps.

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
  /** the word budget of the subsection (its weight in the lesson) */
  words?: number;
  /** the visualization that carries its idea: chart, svg diagram, mermaid, table, figure, anim or sim, and what it shows */
  visual?: string;
}
export interface OutlineChapter {
  n: number;
  title: string;
  /** the opening question of the chapter */
  question: string;
  sections: OutlineSection[];
  /** the chapter's comparison and its closing case study */
  comparison?: string;
  case_study?: string;
}
export interface BookOutline {
  /** what the learner already knows (from the course memory and earlier lessons) that this lesson uses */
  known: string[];
  chapters: OutlineChapter[];
}

/** The most words a lesson may take (5.11, the learner's decision: two chapters in about 13,000 to 15,000 words). */
export const LESSON_WORDS = 15000;

export const BOOK_PLAN = (chapterStart: number) => `
THE LESSON AS CHAPTERS OF A BOOK (these rules override every earlier rule about the lesson's structure, its opening and closing blocks, and which blocks to use; the completeness, depth and question rules stay):
- The course is one book, this module a booklet in it, this lesson one or more chapters of it. Number the chapters from ${chapterStart}. A chapter is 3 to 7 numbered subsections (${chapterStart}.1, ${chapterStart}.2, …) that build on each other; each subsection is a few paragraphs, each paragraph opening with a short bold run-in heading (for example **הקדמה.** … **חשיבה.** … **תכנון.** … **מה מחבר ביניהן.** …).
- Plan the full outline before anything else, in "outline". For each subsection: the one question it answers; "from_prev", what of the previous subsection it continues (the question left open, the limit just found, the tool now available); "needs", every term or symbol it uses without defining it; "defines", every term, symbol, formula and result it defines, each marked "s" (for the summary: a result, formula, method or central definition the learner will use as a working tool in later lessons; about 5 to 12 per chapter) or "a" (an aid: scaffolding for this development, and plain vocabulary the prose defines on the way, such as a device name or an everyday unit); "paragraphs", its run-in headings in order; and where it has one, its comparison, its critique and its short case.
- Order: every term in "needs" is in "known" or defined by an earlier subsection. Nothing is used before it is defined, and no subsection explains what an earlier one already used. If a subsection cannot say what of the previous one it continues, the order is wrong or it belongs to another chapter. Organize by the logic of the development, not by the order of the pages.
- The learner knows no physics and only the mathematics he has studied (see the course memory): charge, energy, momentum, standard deviation, a field, a bound and the like are defined the first time they appear. "known" lists only what the course memory or an earlier lesson really taught.
- Each central idea follows its development: why the problem is interesting and what did not work without it; how it was approached; the development step by step and why each step is needed; what came out, what it means, and where it breaks or stays open. An analogy only where it helps, never in place of the development.
- Every chapter has at least one comparison (methods, models or alternatives, in prose or a table), a critical look at each central idea (the assumptions it rests on, who disputes it, where it fails), short cases with numbers inside the subsections, and one case study at its end that ties the chapter together with numbers the reader can check.
- Length (a budget, not a target): the whole lesson is at most ${LESSON_WORDS} words of prose and blocks together (exercises and the keep block included), and less when the material is light. Give every subsection a "words" budget by its weight: a central result with its derivation gets more (1,200 to 2,000), a supporting idea less (400 to 900), a topic a named later module teaches in full a short anchor. Completeness and depth come first: the budget is kept by cutting repetition, second examples, long cases and connections, never a definition, a derivation step or the explanation of a formula's factors. Each chapter's case study is at most about 900 words; at most four think blocks in the lesson and three graded exercises.
- Visualization carries the ideas: plan a "visual" for every subsection that has a central idea, about one per 800 to 1,000 words (12 to 18 in a full lesson), chosen by the kind of idea: a relation between quantities is a chart (computed points); a geometry, a layout or a system's parts is an svg diagram; a chain, a process or a link budget is a mermaid diagram; a comparison of several items is a table; a book figure is a figure block; something that changes in time is an anim or a sim. A visual replaces prose (it is inside the word budget), never repeats it: one sentence before it says what to look at, one after says what it shows and what it teaches; sometimes ask the reader first what shape he expects.
- Blocks serve the prose; no step of the argument lives only in a block. In the flow, as many as the ideas need: definition, formula, figure, chart, table, svg, mermaid; think (at the end of a subsection); keep (at the end of the lesson). Per chapter, at the end of a subsection only: at most two of predict, verify, domain, and at most two of anim, sim, scene3d, interactive, plus the chapter's one casestudy at its end, and a decide block where the plan holds one. This limit overrides the level-3 counts (predict, verify, errorhunt, lab) and the connection rules (fieldmap and domain blocks per result): a check, a prediction or a mapping beyond it is written in the prose of its subsection. Not used: erratum (a real error of the source is one sentence in the prose; scan and OCR errors are never mentioned, the lesson just uses the right value), story (the chapter opens in prose), plan, today, coverage, refresh (the opening paragraph "what we already know" replaces it), fieldmap, errorhunt and lab (into the prose or the exercises).
- A part of the writing is one chapter, or a run of whole subsections of a long chapter: give each part "sections": the subsection numbers it writes. Parts never cut a subsection.
- Add to the JSON: "outline": {"known": ["…"], "chapters": [{"n": ${chapterStart}, "title": "…", "question": "…", "comparison": "…", "case_study": "…", "sections": [{"n": "${chapterStart}.1", "title": "…", "question": "…", "from_prev": "…", "needs": ["…"], "defines": [{"term": "…", "mark": "s"}], "paragraphs": ["הקדמה", "…", "מה מחבר ביניהן"], "compare": "…", "critique": "…", "case": "…", "words": 1200, "visual": "chart: … against …"}]}]}, and per part "sections": ["${chapterStart}.1", "${chapterStart}.2"]. Short phrases, no prose, in Hebrew.`;

/** The planned words of a run of subsections. */
export function partWords(o: BookOutline, mine: string[]): number {
  let n = 0;
  for (const c of o.chapters) for (const s of c.sections) if (mine.includes(s.n)) n += Math.max(0, Number(s.words) || 0);
  return n;
}

/** The planned words of the whole lesson (0 when the plan gave none). */
export function lessonWords(o: BookOutline): number {
  return partWords(o, o.chapters.flatMap((c) => c.sections.map((s) => s.n)));
}

export const wordCount = (t: string) => (t.match(/\S+/g) ?? []).length;

/** The last step when a written lesson is over its budget: cut only padding, by edit blocks, then the checks run. */
export function tightenPrompt(text: string, words: number, budget: number): string {
  return `<lesson_tighten>
You are the author of this lesson. It has ${words} words; its budget is ${budget}. Bring it to about ${budget} words WITHOUT lowering its level: never remove or thin a definition, a derivation step, the explanation of a formula's factors, a number the lesson teaches with, a comparison or critique (shorten them instead), the book structure (chapters, numbered subsections, bold run-in headings, the linking sentences), or anything a later passage uses. Cut, in this order: a case study beyond about 900 words; domain blocks beyond one per chapter; paragraphs that restate a table or a graph; interim summaries that repeat what was just said; a second example of the same point; a number said twice; think blocks beyond four and exercises beyond three; then wordy sentences.
<lesson>
${text}
</lesson>

Output only edit blocks, in this exact format (as many as needed):
<<<REPLACE>>>
an exact, unique passage of the lesson
<<<WITH>>>
its shorter text (empty to delete it)
<<<END>>>
</lesson_tighten>`;
}

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

/** The outline as the part writer sees it: the whole book of this lesson, with this part's subsections in full. */
export function outlineText(o: BookOutline, mine: string[]): string {
  return o.chapters
    .map((c) => {
      const head = `פרק ${c.n}: ${c.title} — ${c.question}${c.comparison ? ` | comparison: ${c.comparison}` : ""}${c.case_study ? ` | case study: ${c.case_study}` : ""}`;
      const secs = c.sections.map((s) =>
        mine.includes(s.n)
          ? `  ${s.n} ${s.title}  ← THIS PART\n    question: ${s.question}\n    continues: ${s.from_prev}\n    needs: ${list(s.needs)}\n    defines: ${list(s.defines.map((d) => `${d.term} [${d.mark === "s" ? "ס" : "ע"}]`))}\n    paragraphs: ${list(s.paragraphs ?? [])}${s.words ? `\n    words: about ${s.words}` : ""}${s.visual ? `\n    visual: ${s.visual}` : ""}${s.compare ? `\n    comparison: ${s.compare}` : ""}${s.critique ? `\n    critique: ${s.critique}` : ""}${s.case ? `\n    case: ${s.case}` : ""}`
          : `  ${s.n} ${s.title} — ${s.question}`,
      );
      return [head, ...secs].join("\n");
    })
    .join("\n");
}

export const BOOK_PART = (o: BookOutline, mine: string[], first: boolean, last: boolean) => {
  const start = mine[0] ?? "";
  const chapterOpens = o.chapters.filter((c) => c.sections[0] && mine.includes(c.sections[0].n)).map((c) => c.n);
  const chapterCloses = o.chapters.filter((c) => c.sections.length && mine.includes(c.sections[c.sections.length - 1].n)).map((c) => c.n);
  return `THE LESSON AS CHAPTERS OF A BOOK (these rules override every earlier rule about structure and blocks):
Outline of the lesson (yours, from the planning step):
${outlineText(o, mine)}
Terms already defined for the learner before this part (use them freely; anything else is defined where it first appears, or before): ${list(start ? definedBefore(o, start) : o.known)}
Write subsections ${mine.join(", ")} as planned, in this form:
- ${chapterOpens.length ? `Chapter ${chapterOpens.join(", ")} opens here: "## פרק N: title", then an opening in prose (the interesting question, what the reader will be able to do at the end, a one-paragraph map of the subsections), then a paragraph **מה אנחנו כבר יודעים.** that recalls in a sentence each earlier idea this chapter needs.` : "No chapter opens in this part: continue the chapter in progress."}
- Each subsection: "### N.k title", then paragraphs, each opening with its bold run-in heading as planned. The first paragraph says the question and how it follows from the previous subsection; the last closes with what was gained and the sentence that leads into the next subsection.
- Define before use: a term or symbol not in the list above and not yet defined in this part is defined at its first appearance (its context, then the definition). Never "we will see later" for something already used.
- Every formula or equation is followed, in prose, by each factor: what it stands for and its units, why it is there, what happens when it grows, and the range where the formula holds.
- Each central idea follows its development: why it is an interesting problem, how it was approached, the steps and why each is needed, what came out, where it breaks.
- The comparison, critique and short case planned for each subsection are written in it, in prose (a table for a comparison of several items).
- Length: each subsection about its planned words (this part about ${partWords(o, mine) || "as planned"} words), never more than about 10% over; keep it by cutting repetition, never a definition, a step or a factor's explanation. A case study at most about 900 words.
- Visuals: write the planned visual of each subsection (a \`\`\`chart with computed points, a \`\`\`svg diagram drawn to scale with Hebrew labels, a \`\`\`mermaid diagram, a \`\`\`table, a figure block), with one sentence before it saying what to look at and one after saying what it shows; it replaces prose, never repeats it. Where a relation, a geometry or a chain is explained only in words and a picture would make it clear, draw it.
- Mark every definition and formula block with a header line "@mark: summary" for [ס] or "@mark: aid" for [ע], as planned.
- Blocks serve the prose and never carry a step of the argument alone. Allowed in the flow, as many as the ideas need: definition, formula, figure, chart, table, svg, mermaid, and a think at the end of a subsection (at most four in the lesson). Per chapter, at the end of a subsection only: at most two of predict, verify, domain, and two of anim, sim, scene3d, interactive, plus the chapter's one casestudy, and a decide block where planned; any other check, prediction or mapping goes into the prose (this overrides the level-3 and connection counts). Never: erratum, story, plan, today, coverage, refresh, fieldmap, errorhunt, lab. Scan and OCR errors of the source are never mentioned: use the right value.
- Plain, continuous Hebrew; a foreign term once, in its [[מונח: … | …]] tag, never mixed into the sentence after that; one symbol, one meaning.
${chapterCloses.length ? `- Chapter ${chapterCloses.join(", ")} closes here: its case study (planned), then a closing paragraph in prose (what the chapter built and how it leads to the next).` : ""}
${last ? `- This part ends the lesson: after the last chapter's close, the keep block holds exactly the items marked [ס] (one "name: …" line each, standing on its own), then graded exercises (each answerable from the lesson), then one sentence about the next lesson. No coverage block, no today block.` : "- Do not end the lesson, write the keep block or exercises in this part."}
${first ? "" : "- Continue seamlessly from the text above: no recap, no repeated heading."}`;
};

/** The order check of the outline, before any text is written. */
export function outlineCheckPrompt(o: BookOutline, lessonTitle: string): string {
  return `<outline_check>
You check the outline of one lesson of a self-study book (Hebrew) before it is written. The learner knows no physics and only the mathematics he has studied. Check strictly:
1. Order: every term in a subsection's "needs" is in "known" or in the "defines" of an EARLIER subsection. List each violation.
2. Continuity: every subsection's "from_prev" names something the previous subsection really leaves (a question, a limit, a tool). A jump, a reversed order (a result before what it rests on), or a subsection that belongs elsewhere is a problem.
3. Coverage of the form: each chapter has a comparison, a case study, and critique of its central ideas; each subsection has run-in paragraphs.
4. Marks: a term marked "s" that is only scaffolding, or a result the course will use later marked "a".
5. "known" holds only what an earlier lesson taught (not physics the learner never studied).
Lesson: ${lessonTitle}
<outline>
${JSON.stringify(o, null, 1)}
</outline>
Reply with ONLY one JSON object: {"problems": [{"where": "3.2", "kind": "order|continuity|form|mark|known", "problem": "…", "fix": "…"}], "verdict": "pass|fix"}. "pass" only when the list is empty.
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
  `The outline of your plan was checked for order before writing, and these problems were found:\n${JSON.stringify(review.problems, null, 1)}\nReply with ONLY the whole plan JSON again (same format, every field), with the outline and the parts fixed so that each problem is gone: move or add a definition earlier, reorder subsections, add the missing comparison, case or critique, fix the marks. Keep all the material.`;

/** Is the outline usable (it is what the parts are written from)? */
export function validOutline(o: unknown): o is BookOutline {
  const x = o as BookOutline;
  return !!x && Array.isArray(x.chapters) && x.chapters.length > 0 && x.chapters.every((c) => Array.isArray(c.sections) && c.sections.length > 0 && c.sections.every((s) => typeof s.n === "string" && Array.isArray(s.defines ?? []) && Array.isArray(s.needs ?? [])));
}

/** Fills defaults so the rest of the code can rely on the shape. */
export function normalizeOutline(o: BookOutline): BookOutline {
  return {
    known: Array.isArray(o.known) ? o.known.filter((k) => typeof k === "string") : [],
    chapters: o.chapters.map((c) => ({
      ...c,
      sections: c.sections.map((s) => ({
        ...s,
        needs: (s.needs ?? []).filter((t) => typeof t === "string"),
        defines: (s.defines ?? []).map((d) => (typeof d === "string" ? { term: d, mark: "a" as const } : { term: String(d.term ?? ""), mark: d.mark === "s" ? ("s" as const) : ("a" as const) })).filter((d) => d.term),
        from_prev: s.from_prev ?? "",
        question: s.question ?? "",
      })),
    })),
  };
}

/** The order problems a program can find without a model: a need that nothing earlier defines. */
export function orderProblems(o: BookOutline): { where: string; kind: string; problem: string }[] {
  const norm = (t: string) => t.replace(/[$\\{}()"'״׳.,]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  const seen = new Set(o.known.map(norm));
  const all = new Map<string, string>();
  for (const c of o.chapters) for (const s of c.sections) for (const d of s.defines) if (!all.has(norm(d.term))) all.set(norm(d.term), s.n);
  const out: { where: string; kind: string; problem: string }[] = [];
  for (const c of o.chapters)
    for (const s of c.sections) {
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

/** The parts' subsections: from the plan, or (when the plan gave none) each chapter is one part. */
export function partSections(o: BookOutline, parts: { sections?: string[] }[], k: number): string[] {
  const given = parts[k]?.sections;
  if (Array.isArray(given) && given.length) return given.map(String);
  const c = o.chapters[k];
  return c ? c.sections.map((s) => s.n) : [];
}
