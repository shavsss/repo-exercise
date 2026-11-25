// The check every lesson passes before the learner reads it (3.11, after a review found lessons that dropped
// material of their pages, marked main topics as "a first look", asked questions the lesson never prepared, and
// had no keep block). An independent reviewer call reads the lesson against its source pages, the curriculum and
// the modules it defers to, and answers what is missing, thin, wrongly deferred, unanswerable or wrong; the author
// then repairs the lesson, in place before it is read, or as a supplement at its end when it was already read.
// It runs until a review passes, up to four reviews (three repairs): a lesson he gets is finished, and what
// is still open after that is stored on the lesson and shown. The pure parts (prompts, parsing, applying the edits) are tested in tools/test/audit.test.mjs.
// Same file in both apps.
import { caseAid, caseBlocks, caseProblems, hideCaseNotes, parseCase } from "./caseBlock";

export interface AuditFinding {
  topic?: string;
  source?: string;
  why?: string;
  after?: string;
  heading?: string;
  add?: string;
  quote?: string;
  verdict?: string;
  correct_module?: string;
  /** an early finding: the later module that teaches the topic in full */
  module?: string;
  problem?: string;
  fix?: string;
  /** a level finding: which layers are missing (mechanism, failure, cost, choice) */
  gap?: string;
}
export interface AuditReport {
  missing: AuditFinding[];
  thin: AuditFinding[];
  /** taught, but not down to how it really works and what it costs (the engineering level, 20.11) */
  level: AuditFinding[];
  deferrals: AuditFinding[];
  /** developed here though a later module teaches it in full and this lesson does not need it (25.11, the learner) */
  early: AuditFinding[];
  questions: AuditFinding[];
  keep: { exists: boolean; missing: string[]; remove: string[] };
  errors: AuditFinding[];
  must_core: string[];
  verdict: "pass" | "fix";
}
/** what is stored on the lesson message: when it was checked, how it ended, and the findings in short */
export interface AuditMark {
  at: number;
  rounds: number;
  verdict: "pass" | "fixed" | "partly";
  mode: "inplace" | "supplement";
  counts: Record<string, number>;
  must_core: string[];
  /** wrong module references the reviewer corrected: the topic and the module that really teaches it */
  refs?: { topic: string; module: string }[];
  /** what the last review still found, in short (a "partly" check) */
  open?: string[];
  /** 2: the check that runs until a review passes (4.11); a "partly" mark without it is checked again by itself */
  v?: number;
  /** the reader's check (5.11): can a learner without the background follow it, in order? */
  reader?: { verdict: "pass" | "fixed" | "partly"; rounds: number; counts: Record<string, number> };
  /** a long lesson checked in parts (auditLong): how many */
  parts?: number;
}

export interface AuditInput {
  lessonTitle: string;
  moduleId: string;
  moduleTitle: string;
  covers: string[];
  focus?: string;
  /** the other lessons of this module; `later`: it comes after this one (its topics are not developed here) */
  otherLessons: { title: string; covers: string[]; later?: boolean }[];
  curriculum: string;
  /** the modules the lesson names, with their sections: is a deferred topic really taught there? */
  modules: { id: string; title: string; sections: string[] }[];
  /** the modules after this one with what each teaches (laterModulesBlock, curriculum.ts): is a topic developed too early?
   * Sent in the first review only (it adds about half to the prompt); later reviews get the topics already cut, in `cut`. */
  later?: string;
  cut?: AuditFinding[];
  pages: string;
  text: string;
  /** what the learner already knows (the outline's "known", bookRules.ts), for the reader's check */
  known?: string[];
  /** a long lesson is checked one part at a time (auditLong): which part this is, and the headings of the rest */
  part?: { index: number; total: number; others: string[] };
}

const listOf = (xs: string[]) => xs.map((x) => `- ${x}`).join("\n");

/** Module ids the lesson names (M0.2, M13.1…), so the reviewer can see what each of them really teaches. */
export function namedModules(text: string): string[] {
  return [...new Set([...text.matchAll(/\bM\d{1,2}\.\d{1,2}\b/g)].map((m) => m[0]))].slice(0, 40);
}

export const SUPPLEMENT_HEAD = "## השלמה לשיעור";

/** The code of drawn visuals (svg, chart, mermaid, scenes…) is replaced by a one-line stand-in in the reviewers'
 * prompts: they judge whether a visual is there and explained, not its markup, and the markup is a large share of a
 * long lesson. Quotes for repairs come from the prose, which stays as is. */
const VISUAL_LANGS = "svg|chart|mermaid|scene3d|sim|anim|interactive|figure";
export function compactVisuals(text: string): string {
  return text.replace(new RegExp(`^\`\`\`(${VISUAL_LANGS})([^\\n]*)\\n([\\s\\S]*?)^\`\`\`[ \\t]*$`, "gm"), (_m, lang: string, rest: string, body: string) => {
    const title = /@title:\s*(.+)/.exec(body)?.[1] ?? /"title"\s*:\s*"([^"]+)"/.exec(body)?.[1] ?? /<title>([^<]+)<\/title>/.exec(body)?.[1] ?? "";
    return `\`\`\`${lang}${rest}\n[${lang} visual${title ? `: ${title.trim()}` : ""}; ${body.length} characters of drawing code]\n\`\`\``;
  });
}

function partNote(o: AuditInput): string {
  if (!o.part) return "";
  return `
This lesson is long, so it is checked one part at a time. This is part ${o.part.index} of ${o.part.total}. The headings of the other parts (they are checked separately; a topic, definition or keep line found there is not missing here, and only the last part holds the keep block):
${o.part.others.map((h) => `- ${h}`).join("\n") || "(none)"}
`;
}

export function auditPrompt(o: AuditInput, round = 1): string {
  const supplement = o.text.includes(SUPPLEMENT_HEAD)
    ? `\nThe learner had already read this lesson when it was checked, so its end holds a supplement ("${SUPPLEMENT_HEAD}") instead of edits. Read the lesson and the supplement together: an item taught, completed or corrected in the supplement is fixed, and a question replaced there is fixed. Report a problem of the read part only when the supplement does not fix it, and check the supplement itself as strictly as the lesson.\n`
    : "";
  const mods = o.modules.map((m) => `${m.id} ${m.title}: ${m.sections.slice(0, 30).join("; ")}`).join("\n");
  return `<lesson_audit round="${round}">${partNote(o)}
You are the independent reviewer of one lesson of a self-study course (engineering, physics and mathematics, in Hebrew), written by another model from assigned source pages. The learner studies only from this lesson: anything important it drops, teaches too thinly to use, defers to a module that does not teach it, or asks without having taught is lost, or breaks his calibration. Check the lesson against the sources strictly and concretely. Do not invent problems, do not ask for padding, length or extra examples, and ignore scan typos and anecdotes.
${supplement}
Lesson: ${o.moduleId} ${o.moduleTitle} · ${o.lessonTitle}
<assigned_sections>
${listOf(o.covers)}
</assigned_sections>
${o.focus ? `<lesson_focus>\n${o.focus}\n</lesson_focus>\n` : ""}<other_lessons_of_this_module>
${o.otherLessons.map((l) => `- ${l.later ? "(later) " : ""}${l.title}: ${l.covers.join("; ")}`).join("\n") || "(none)"}
</other_lessons_of_this_module>
<curriculum>
${o.curriculum || "(none)"}
</curriculum>
<modules_the_lesson_names>
${mods || "(none)"}
</modules_the_lesson_names>${o.later ?? ""}${o.cut?.length ? `\n<cut_as_early>\nAn earlier review cut these topics to anchors, because a later module teaches them in full. They are not missing, thin or below the engineering level here; report them in "early" only if the lesson develops them again:\n${o.cut.map((f) => `- ${f.topic ?? ""} (${f.module ?? ""})`).join("\n")}\n</cut_as_early>` : ""}
<source_pages>
${o.pages}
</source_pages>
<lesson>
${compactVisuals(o.text)}
</lesson>

Check:
1. Coverage: every idea, result, definition, argument, mechanism and worked number of the assigned sections that a strong engineer should take from them, and every curriculum topic item marked K or S for this lesson. "missing": not in the lesson. "thin": present but not taught to a level the learner can use (no definition, no derivation or reason, no meaning, no number where the point is a number). The curriculum, not the page order, decides the depth: a section it lists as brief is short on purpose (report it only if it is missing altogether), a topic item marked delta is a short delta with a pointer to the module named, mention is one or two sentences, and a K or S item marked new or deepen must be taught in full even though no assigned page has it.
2. Deferrals: every place the lesson says or implies that a topic is only a first look and is taught later (a module id, "later", "in the next modules"). Is it really taught in full by that module (see its sections)? If not, or if no module is named and none clearly does, the verdict is "teach_now". A wrong module id with a right topic is "fix_ref" with the correct module.
3. Questions (mcq, numeric, explain, think, predict, exercise, verify, errorhunt blocks; check every numeric @answer by computing it, and that the [x] option of every mcq is the right one): can a careful reader answer each one from what the lesson wrote before it, with the numbers and constants given in the lesson or the question? Is it on what the lesson teaches in full?
4. The keep block ("לסיכום"): does it exist, does it hold what must be remembered from this lesson, and nothing that is only a first look? It holds working tools (results, formulas, methods, central definitions the course will use later), about 5 to 12 per chapter; when the lesson marks blocks with @mark, the "summary" ones. Do not ask to add vocabulary, aids or every number of the lesson.
5. Errors: statements that contradict the sources or the established facts.
6. The engineering case (the \`\`\`case block at the end, if the lesson has one; its notes after the "---" line are hidden from the learner until he commits, and the tutor reasons from them): compute every number of its brief and its notes; every expert reasoning rests on a page tag, a named published source or a certainty label [[ודאות: …]], and claims about companies, systems and trends (stage 5, and the leading teams in every stage) carry a certainty label; a historical failure (Patriot, Ariane 5, Mars Climate Orbiter, Columbia) carries numbers only if the source pages hold its original report and the numbers match it; each stage's decisive rubric item ("- [!]") is really the decision that separates the top level from the average; the brief does not give away the answers; where a stage has "guide:" lines, they say what a good answer contains without giving away the decisive item, and where it has an "example:", it is a model answer at the level of the decisive item, with its numbers computed and a confidence in %. Report each problem in "errors", quoting the case.
7. Engineering level: the learner is becoming an engineer who designs and leads, so knowing what a thing is and why it was chosen is not enough. For each central system, protocol, algorithm, data structure, device or architecture the lesson teaches, check that it reaches four layers: (a) mechanism: how it works inside, the parts and what passes between them (the messages and their fields, the state and its transitions, the data layout and the operations on it, the order of events in time), concretely enough to trace one case step by step; (b) failure: what happens under loss, overload, contention, a fault or the worst case, and how the design detects and recovers; (c) engineering cost in non-financial units with real numbers: latency, throughput, memory, overhead bytes or bandwidth, power, complexity (O(·)), coupling and the cost to change or maintain; (d) choice: the alternative the designers rejected, what each one pays, and what one would change to design one's own variant for a different need. Report in "level" one finding per item that lacks a layer, with "gap" naming the missing layers and "add" saying concretely what to teach (which mechanism, which number, which alternative). For a mathematical or physical result the layers are lighter: what it costs to use in practice (computation, measurement, accuracy) and where its assumption breaks in a real system; do not demand protocols, systems or numbers the topic has no reason to have, and never ask for padding.
8. Early material (when <later_modules> or <cut_as_early> is given; 25.11, the learner: a lesson on the wave developed GPS ionosphere correction, widelane and cycle slips, which a later module teaches): every topic the lesson develops (a derivation, a formula block, a worked case or questions on it, or more than one or two paragraphs) that a module of <later_modules> or a later lesson of this module (marked "(later)" in <other_lessons_of_this_module>) teaches in full, when neither the assigned sections nor the curriculum items of this lesson hold it and the central results of this lesson can be understood without it. The lesson focus does not make such a topic this lesson's. Report each in "early", with the heading, the later module that teaches it and an exact quote of where its development starts. What the central results really need of it stays, as background. Such a topic is never reported as missing, thin or below the engineering level, and never asked for in a question or the keep block. When unsure whether a later module teaches it in full, do not report it.
Quotes must be copied exactly from the lesson (a short unique phrase). "after" and "heading" are exact heading texts of the lesson (without the #).

Answer with one JSON object and nothing else:
{"missing":[{"topic":"","source":"<page tag, e.g. F1:17>","why":"","after":""}],"thin":[{"topic":"","heading":"","add":""}],"level":[{"topic":"","heading":"","gap":"mechanism|failure|cost|choice","add":""}],"deferrals":[{"topic":"","quote":"","verdict":"ok|teach_now|fix_ref","correct_module":""}],"early":[{"topic":"","heading":"","module":"","quote":""}],"questions":[{"quote":"","problem":"","fix":""}],"keep":{"exists":true,"missing":[],"remove":[]},"errors":[{"quote":"","fix":""}],"must_core":["the topics the learner must learn now from this lesson"],"verdict":"pass|fix"}
"verdict" is "pass" only when nothing important is missing, thin, below the engineering level, wrongly deferred, developed too early or unanswerable, and the keep block is complete. List deferrals with verdict "ok" too, so the map knows they were checked.
</lesson_audit>`;
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

const arr = (x: unknown): AuditFinding[] => (Array.isArray(x) ? (x.filter((f) => f && typeof f === "object") as AuditFinding[]) : []);
const strs = (x: unknown): string[] => (Array.isArray(x) ? x.filter((s): s is string => typeof s === "string" && !!s.trim()) : []);

export function parseAudit(raw: string): AuditReport | null {
  const o = jsonOf(raw) as Record<string, unknown> | null;
  if (!o || typeof o !== "object") return null;
  const keep = (o.keep ?? {}) as Record<string, unknown>;
  const r: AuditReport = {
    missing: arr(o.missing),
    thin: arr(o.thin),
    level: arr(o.level),
    deferrals: arr(o.deferrals),
    early: arr(o.early),
    questions: arr(o.questions),
    keep: { exists: keep.exists !== false, missing: strs(keep.missing), remove: strs(keep.remove) },
    errors: arr(o.errors),
    must_core: strs(o.must_core).slice(0, 40),
    verdict: o.verdict === "pass" ? "pass" : "fix",
  };
  // a "pass" with open findings is not a pass
  if (problems(r) > 0) r.verdict = "fix";
  return r;
}

/** How many things the repair has to do. */
export function problems(r: AuditReport): number {
  return r.missing.length + r.thin.length + r.level.length + r.deferrals.filter((d) => d.verdict === "teach_now" || d.verdict === "fix_ref").length + r.early.length + r.questions.length + r.errors.length + (r.keep.exists ? 0 : 1) + r.keep.missing.length + r.keep.remove.length;
}

const INPLACE_HOW = `Output only edit blocks, in this exact format (as many as needed, in any order):
<<<INSERT_AFTER_SECTION: the exact heading text of the lesson>>>
the Markdown to add at the end of that section (new paragraphs, a ### subsection, definition/formula blocks, a corrected question)
<<<END>>>
<<<REPLACE>>>
an exact, unique passage of the lesson
<<<WITH>>>
its corrected text
<<<END>>>
<<<KEEP>>>
the whole content of the keep block, one "- name: …" line each (it replaces the existing keep block, or is added at the end)
<<<END>>>
Fix a wrong question with a REPLACE of the whole question block; fix a wrong module reference or an error with a REPLACE of the sentence.`;

export function repairPrompt(o: AuditInput, report: AuditReport, mode: "inplace" | "supplement" | "supplement-edit"): string {
  const todo = { ...report, deferrals: report.deferrals.filter((d) => d.verdict !== "ok") };
  const how =
    mode === "supplement-edit"
      ? `The learner has already read this lesson, and its end holds a supplement ("${SUPPLEMENT_HEAD}") written after the first review. Do not edit the lesson before the supplement: fix everything in the review inside the supplement. Output only edit blocks, in this exact format (as many as needed):
<<<REPLACE>>>
an exact, unique passage of the supplement
<<<WITH>>>
its corrected text
<<<END>>>
<<<INSERT_AFTER_SECTION: the exact heading text of a section of the supplement>>>
the Markdown to add at the end of that section
<<<END>>>
<<<APPEND>>>
a new ### section, a corrected question or a one-line correction of the read part, added at the end of the supplement
<<<END>>>
<<<KEEP>>>
the whole content of the lesson's keep block, one "- name: …" line each
<<<END>>>`
      : mode === "inplace"
      ? INPLACE_HOW
      : `The learner has already read this lesson, so do not edit it: write one supplement that comes after it. Output exactly:
<<<SUPPLEMENT>>>
## השלמה לשיעור
a short opening line (what this supplement completes), then a ### section for each missing, thin or level item, in the lesson's order, each opening with the section of the lesson it completes ("משלים את «…»"); the corrected questions as new think/predict blocks; each error and wrong reference as a one-line correction
<<<END>>>
<<<KEEP>>>
the whole content of the lesson's keep block, one "- name: …" line each (it replaces the existing keep block, or is added at the end)
<<<END>>>`;
  return `<lesson_repair mode="${mode}">
You are the author of this lesson, repairing it after an independent review (in <review>). Write in the lesson's own Hebrew, style and block syntax (the definition, formula, think, predict and keep blocks exactly as the lesson writes them; mathematics in $…$), at the course's full depth: teach every missing or thin item in full (its context, the definition or result, how it is built or derived, what it means, its limits, and a computed number where the point is a number); bring every item in "level" down to the layers its "gap" names: the mechanism traced through one concrete case (messages and fields, states and transitions, data layout, order in time), the behaviour under failure and how it recovers, the engineering cost in real units with computed numbers (latency, throughput, memory, overhead, power, O(·), coupling), and the rejected alternative with what each pays and what one would change for a different need, written into the section that teaches the item, as prose that continues its argument; teach now every deferred topic the review says no later module teaches; cut every item in "early" down to an anchor where the lesson first meets it (what it says, why it matters here, one number or case, and the module that teaches it, in one or two paragraphs), removing its derivations, formula blocks, questions and keep lines, and keeping in the sections that use it only what this lesson's central results need; give a question the givens it lacks or rewrite it so the lesson's material answers it; make the keep block complete (only what this lesson teaches in full). Apart from "early", never shorten or remove correct material, and never add padding. The lesson has a length budget: make room for what you add by shortening a repetition or a second example near it, so it grows only by what is really new. Check every number with compute. A problem of the engineering case (\`\`\`case) is fixed inside it with a REPLACE, keeping its exact format: the @ headers, the "---" line, one "@@ stage N" section per stage of @stages with its ask:, anchors:, expert: and rubric: (exactly one "- [!]" item) and, where the case has them, guide: and example:, and "@@ debrief" with decisions:.

Lesson: ${o.moduleId} ${o.moduleTitle} · ${o.lessonTitle}
<review>
${JSON.stringify(todo, null, 1)}
</review>
<source_pages>
${o.pages}
</source_pages>
<lesson>
${o.text}
</lesson>

${how}
</lesson_repair>`;
}

const HEAD = /^(#{1,6})\s+(.+?)\s*#*\s*$/;
const norm = (s: string) =>
  s
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

/** Replaces the lesson's keep block (or adds one at the end). */
function setKeep(text: string, body: string): string {
  const block = "```keep\n" + body.trim() + "\n```";
  const m = /^```keep[^\n]*\n[\s\S]*?^```\s*$/m.exec(text);
  if (m) return text.slice(0, m.index) + block + text.slice(m.index + m[0].length);
  // a new keep block goes before the engineering case, which ends the lesson
  const c = /^```case/m.exec(text);
  return c ? `${text.slice(0, c.index).trimEnd()}\n\n${block}\n\n${text.slice(c.index)}` : `${text.trimEnd()}\n\n${block}\n`;
}

/** Applies the repair's edit blocks to the lesson. Edits that do not apply (a passage not found) are counted, never forced. */
export function applyRepair(text: string, raw: string, mode: "inplace" | "supplement" | "supplement-edit"): { text: string; applied: number; failed: number } {
  if (mode === "supplement-edit") {
    // the edits stay inside the supplement: the read part is never touched (the keep block is the exception)
    const at = text.lastIndexOf(SUPPLEMENT_HEAD);
    if (at < 0) return applyRepair(text, raw, "supplement");
    const head = text.slice(0, at);
    let sup = text.slice(at);
    const keep = /<<<KEEP>>>\s*\n[\s\S]*?\n<<<END>>>/.exec(raw)?.[0] ?? "";
    const inner = applyRepair(sup, raw.replace(keep, "").replace(/<<<APPEND>>>[\s\S]*?<<<END>>>/g, ""), "inplace");
    sup = inner.text;
    let applied = inner.applied;
    let failed = inner.failed;
    for (const m of raw.matchAll(/<<<APPEND>>>\s*\n([\s\S]*?)\n<<<END>>>/g)) {
      if (!m[1].trim()) continue;
      // before the supplement's own keep block, if the keep block ended up in it
      const k = /^```keep/m.exec(sup);
      sup = k ? `${sup.slice(0, k.index).trimEnd()}\n\n${m[1].trim()}\n\n${sup.slice(k.index)}` : `${sup.trimEnd()}\n\n${m[1].trim()}\n`;
      applied++;
    }
    let out = head + sup;
    const kb = /<<<KEEP>>>\s*\n([\s\S]*?)\n<<<END>>>/.exec(keep)?.[1];
    if (kb?.trim()) {
      out = setKeep(out, kb);
      applied++;
    }
    return { text: out, applied, failed };
  }
  let out = text;
  let applied = 0;
  let failed = 0;
  if (mode === "supplement") {
    const sup = /<<<SUPPLEMENT>>>\s*\n([\s\S]*?)\n<<<END>>>/.exec(raw)?.[1]?.trim();
    if (sup) {
      out = `${out.trimEnd()}\n\n${sup}\n`;
      applied++;
    } else failed++;
  } else {
    // an empty WITH (a deletion) is "<<<WITH>>>\n<<<END>>>": the replacement may be empty
    for (const m of raw.matchAll(/<<<REPLACE>>>[ \t]*\n([\s\S]*?)\n<<<WITH>>>[ \t]*\n([\s\S]*?)<<<END>>>/g)) {
      const from = m[1];
      const to = m[2].replace(/\n$/, "");
      const at = out.indexOf(from);
      if (at >= 0 && out.indexOf(from, at + 1) < 0) {
        out = out.slice(0, at) + to + out.slice(at + from.length);
        applied++;
      } else failed++;
    }
    for (const m of raw.matchAll(/<<<INSERT_AFTER_SECTION:\s*(.+?)\s*>>>\s*\n([\s\S]*?)\n<<<END>>>/g)) {
      const [, head, body] = m;
      const lines = out.split("\n");
      let fence = false;
      let at = -1;
      let level = 0;
      for (let i = 0; i < lines.length; i++) {
        if (/^\s*(```|~~~)/.test(lines[i])) fence = !fence;
        if (fence) continue;
        const h = HEAD.exec(lines[i]);
        if (!h) continue;
        if (at < 0 && norm(h[2]) === norm(head)) {
          at = i;
          level = h[1].length;
          continue;
        }
        // the section ends at the next heading of the same or a higher level
        if (at >= 0 && h[1].length <= level) {
          lines.splice(i, 0, body.trim(), "");
          at = -2;
          break;
        }
      }
      if (at >= 0) {
        // the last section of the lesson: before its keep block (or the engineering case) if it has one, else at the end
        const keepAt = lines.findIndex((l, i) => i > at && /^```(keep|case)/.test(l));
        if (keepAt > 0) lines.splice(keepAt, 0, body.trim(), "");
        else lines.push("", body.trim());
        at = -2;
      }
      if (at === -2) {
        out = lines.join("\n");
        applied++;
      } else failed++;
    }
  }
  const keep = /<<<KEEP>>>\s*\n([\s\S]*?)\n<<<END>>>/.exec(raw)?.[1];
  if (keep?.trim()) {
    out = setKeep(out, keep);
    applied++;
  }
  return { text: out, applied, failed };
}

/* ---------------- the reader's check (5.11, docs/LESSON_BOOK_SPEC.md) ---------------- */

export type ReaderKind = "undefined" | "jump" | "order" | "factors" | "staccato" | "dense" | "ledger" | "anchor" | "history" | "question" | "form" | "block" | "structure" | "visual";
export interface ReaderIssue {
  kind: ReaderKind | string;
  quote?: string;
  where?: string;
  problem?: string;
  fix?: string;
}
export interface ReaderReport {
  issues: ReaderIssue[];
  verdict: "pass" | "fix";
}

export function readerAuditPrompt(o: AuditInput, round = 1): string {
  return `<reader_audit round="${round}">${partNote(o)}
You read one lesson of a self-study book (Hebrew) as its learner reads it: from the first line, in order, knowing only what is listed in <known> and what the lesson has said so far. He knows no physics and only the mathematics he has studied. You do not check the facts against sources (another reviewer does); you check whether he can follow, and whether it reads like a well-built book: chapters (## פרק N), numbered subsections (### N.k) that build on each other, continuous prose that reads as one argument (a bold run-in heading only at a turn), with the full mathematics.
Lesson: ${o.moduleId} ${o.moduleTitle} · ${o.lessonTitle}
<known>
${(o.known ?? []).map((k) => `- ${k}`).join("\n") || "(only the mathematics he has studied, no physics)"}
</known>
<lesson>
${hideCaseNotes(compactVisuals(o.text))}
</lesson>

Report every place where:
- "undefined": a term, symbol, parameter, unit or measure (eV, dB, a standard deviation…) is used before it is defined (or is never defined), and it is not in <known>.
- "jump": a subsection or paragraph starts something new without saying how it follows from what came before, or the reason to study it now is missing.
- "order": something is explained after it was already used, or a result comes before what it rests on.
- "factors": a formula block whose factors are not each explained (what it stands for and its units, why it is there, what happens when it grows, where the formula holds), or that does not open with a sentence or two on what it computes and why it matters here.
- "staccato": a run of display equations or of one-line paragraphs without a goal sentence before and a payoff sentence after; "צעד N" labels or #### headings inside a subsection; a chain of more than three moves left in the prose instead of a derivation block.
- "dense": a paragraph that mixes more than about 3 numbers, or several formulas, into its reasoning (they belong in a table or a display line).
- "ledger": an assumption that enters without being said, or is said and never checked or broken; a result used before it is derived without saying where it will be derived, or never derived.
- "anchor": a chapter with a real engineering context whose anchor system does not return in a subsection, or returns only as a side box; a case study in a casestudy block or a box instead of the prose; a case study that states results instead of working the engineer's computation as in the ASR-9 case (the system's question opening the subsection, השאלה, הקלטים with sources, השרשרת step by step, ההשוואה with the gap and its reason, an unexpected consequence, ידוע לעומת מוערך, what it means for decisions, and a comparative alternative where the real context matters).
- "history": history that only decorates (removing it removes no understanding of why), or a step whose reason is a historical obstacle that the text leaves out.
- "question": a practice question (mcq, numeric, explain) or a think, predict, verify or exercise that the text above it does not prepare (a step, number or idea it needs is missing), or that asks about something only introduced, an anchor, a first look at a later module or an illustration; an mcq whose wrong options are not real misconceptions or lack their explanation; a numeric whose answer, unit or tolerance is missing or wrong (compute it).
- "form": a chapter without a comparison, without a closing case study, or a central idea without its development (why it is interesting, how it was approached, the steps, what came out, where it breaks) or without a critical look.
- "block": a block that breaks the flow, or carries a step of the argument that the prose does not; a fenced block nested inside another block, or a fence line that does not stand alone on its line (it breaks the page).
- "structure": a section not in the book form (no subsection numbers, a bare list where reasoning belongs). The \`\`\`case block at the end is the brief of a separate engineering exercise, not a chapter: judge only whether its brief is clear.
- "visual": a relation between quantities, a geometry, a direction, a change in time, a system's layout or a chain that is explained only in words where a chart, a drawing or a diagram would make it clear; a central concept introduced with no picture of it; a subsection with no visual at all; or a visual that is not explained (what to look at, what it shows).
- "density": definitions or new concepts that pile up (two definition blocks with no development between them, or a paragraph that brings several new terms at once), so that the reader meets terms before he knows why he needs them; or a subsection whose reason is only formal, with no word on what it lets him do.
Quotes must be copied exactly from the lesson (a short unique phrase). Be strict and concrete; do not ask for length, padding or extra examples.
Reply with ONLY one JSON object: {"issues": [{"kind": "undefined|jump|order|factors|staccato|dense|ledger|anchor|history|question|form|block|structure|visual|density", "quote": "…", "where": "the subsection, e.g. 3.2", "problem": "…", "fix": "what to add or change, concretely"}], "verdict": "pass|fix"}. "pass" only when the list is empty.
</reader_audit>`;
}

export function parseReader(raw: string): ReaderReport | null {
  const o = jsonOf(raw) as Record<string, unknown> | null;
  if (!o || typeof o !== "object") return null;
  const issues = arr(o.issues) as unknown as ReaderIssue[];
  return { issues, verdict: issues.length ? "fix" : "pass" };
}

export function readerRepairPrompt(o: AuditInput, report: ReaderReport): string {
  return `<lesson_repair mode="reader">
You are the author of this lesson. A reader who knows only what is in <known> (no physics, only the mathematics he has studied) read it in order and could not follow it in the places listed in <review>. Repair each one in the lesson's own Hebrew, style and block syntax, at full depth: define a term at its first use (or move its definition before it), add the sentence that says how a part follows from the one before and why it comes now, move a passage to where it belongs, explain each factor of a formula after it and open a formula block with what it computes and why it matters, prepare what a question needs before it, write the missing comparison, case or critical look in prose, turn a block that breaks the flow into prose, and fix a "density" item by putting before each new concept the sentence of the story that needs it (and its picture), turning background terms into a clause of the prose instead of a definition block. "staccato": join the lines into moves (goal sentence, 2 to 4 lines of algebra in one display, payoff sentence), drop "צעד N" labels and #### headings, and put a long chain into a derivation block. "dense": move the numbers into a table or a display line. "ledger": state the assumption where it enters and settle it where it is checked or breaks; say where a result used early is derived. "anchor": bring the anchor system into the subsection's argument, and rewrite the case study in prose, as its own subsection built like the ASR-9 case, never in a casestudy block. "history": keep only history that explains why, and give the missing obstacle its place. Keep the book form: ## פרק N, ### N.k, a bold run-in heading only at a turn of the argument. Never remove correct material, never add padding. The lesson has a length budget: make room for what you add by shortening a repetition near it, and fix a "visual" item with the drawing itself (\`\`\`svg, \`\`\`chart, \`\`\`mermaid, \`\`\`table), replacing the words that tried to describe it.
Lesson: ${o.moduleId} ${o.moduleTitle} · ${o.lessonTitle}
<known>
${(o.known ?? []).map((k) => `- ${k}`).join("\n") || "(only the mathematics he has studied, no physics)"}
</known>
<review>
${JSON.stringify(report.issues, null, 1)}
</review>
<lesson>
${o.text}
</lesson>

${INPLACE_HOW}
To move a passage, REPLACE it with nothing at its old place and add it with INSERT_AFTER_SECTION or a REPLACE at its new place.
</lesson_repair>`;
}

const READER_REVIEWS = 4;

/** The reader's check: review and repair in place until it passes, at most READER_REVIEWS reviews, ending on a review. */
export async function readerCheck(o: AuditInput, deps: AuditDeps): Promise<{ text: string; mark: NonNullable<AuditMark["reader"]>; report: ReaderReport | null }> {
  let text = o.text;
  let report: ReaderReport | null = null;
  let rounds = 0;
  const counts: Record<string, number> = {};
  for (let round = 1; round <= READER_REVIEWS; round++) {
    deps.onStatus?.(round === 1 ? "קורא את השיעור כמו לומד: הגדרות, סדר וקשרים" : `קורא שוב אחרי התיקון (סבב ${round})`);
    const next = parseReader(await deps.call(readerAuditPrompt({ ...o, text }, round), "audit"));
    if (!next) break;
    report = next;
    rounds = round;
    if (round === 1) for (const i of next.issues) counts[i.kind] = (counts[i.kind] ?? 0) + 1;
    if (next.verdict === "pass" || round === READER_REVIEWS) break;
    deps.onStatus?.(`מסדר את השיעור לקורא (${next.issues.length} מקומות)`);
    const fixed = applyRepair(text, await deps.call(readerRepairPrompt({ ...o, text }, next), "repair"), "inplace");
    if (!fixed.applied || fixed.text === text) break;
    text = fixed.text;
  }
  const verdict = !report ? "partly" : report.verdict === "pass" ? (text === o.text ? "pass" : "fixed") : "partly";
  return { text, mark: { verdict, rounds, counts }, report };
}

export function readerOpen(r: ReaderReport): string[] {
  const label: Record<string, string> = { undefined: "לא מוגדר", jump: "קפיצה", order: "סדר", factors: "גורמים בנוסחה", question: "שאלה לא מוכנה", form: "מבנה הפרק", block: "בלוק", structure: "צורה", visual: "חסר איור", density: "הגדרות צפופות" };
  const cut = (x?: string) => (x ?? "").replace(/\s+/g, " ").trim().slice(0, 200);
  return r.issues.slice(0, 16).map((i) => `קורא · ${label[i.kind] ?? i.kind}${i.where ? ` (${i.where})` : ""}: ${cut(i.problem || i.quote)}`);
}

export interface AuditDeps {
  /** one model call; returns its text */
  call: (prompt: string, kind: "audit" | "repair") => Promise<string>;
  onStatus?: (s: string) => void;
  /** false: no reader's check (the tests of the source check) */
  reader?: boolean;
}

/** Errors that pass by themselves: the usage limit, a failure upstream, a cut connection. */
const TRANSIENT = new Set(["rate_limited", "upstream_error", "network_error", "overloaded", "timeout"]);
export const transient = (e: unknown) => {
  const { code, message } = (e ?? {}) as { code?: string; message?: string };
  return code ? TRANSIENT.has(code) : /network|fetch|connection|disconnect/i.test(String(message ?? e));
};
/** The waits before each new try of a check's call (25.11: two lessons were saved unchecked after one rate_limited). */
export const RETRY_WAITS = [30_000, 90_000, 180_000];
const WHY: Record<string, string> = { rate_limited: "הגעת למגבלת השימוש", upstream_error: "שגיאה בצד של Claude" };
const inWords = (s: number) => (s < 60 ? `${s} שניות` : s === 60 ? "דקה" : s === 90 ? "דקה וחצי" : `${Math.round(s / 60)} דקות`);
const pause = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((ok, no) => {
    if (signal?.aborted) return no({ code: "cancelled" });
    const t = setTimeout(ok, ms);
    signal?.addEventListener("abort", () => (clearTimeout(t), no({ code: "cancelled" })), { once: true });
  });
/**
 * One call of the check, tried again after a transient failure with growing waits; the last failure is thrown.
 * Other errors (prompt_too_large, refused, cancelled) are thrown at once, for their own handling.
 */
export async function retryTransient<T>(call: () => Promise<T>, o: { onStatus?: (s: string) => void; signal?: AbortSignal; waits?: number[]; wait?: (ms: number, signal?: AbortSignal) => Promise<void> } = {}): Promise<T> {
  const waits = o.waits ?? RETRY_WAITS;
  for (let i = 0; ; i++) {
    try {
      return await call();
    } catch (e) {
      if (i >= waits.length || !transient(e)) throw e;
      const code = (e as { code?: string })?.code ?? "";
      const why = WHY[code] ?? "החיבור ל-Claude נקטע";
      o.onStatus?.(`${why}: מנסה שוב בעוד ${inWords(Math.round(waits[i] / 1000))} (ניסיון ${i + 2} מתוך ${waits.length + 1})`);
      await (o.wait ?? pause)(waits[i], o.signal);
    }
  }
}

export const MAX_REVIEWS = 4;

/** The format problems of the lesson's engineering case (caseBlock.ts), as findings for the repair. */
export function caseFindings(text: string): AuditFinding[] {
  const blocks = caseBlocks(text);
  const out: AuditFinding[] = [];
  if (blocks.length > 1) out.push({ quote: "```case", problem: `${blocks.length} case blocks`, fix: "a lesson has exactly one engineering case: merge them into one" });
  for (const b of blocks) {
    const quote = /^@title:.*$/m.exec(b.source)?.[0] ?? "```case";
    const c = parseCase(b.source);
    // the lesson's place in its module, from the case's id (caseBlock.ts caseId): its first lessons carry the aids
    const n = Number(/-(\d+)-case$/.exec(c.id)?.[1]);
    for (const p of caseProblems(c, undefined, n ? caseAid(n - 1) : undefined)) out.push({ quote, problem: `engineering case format: ${p}`, fix: p });
  }
  return out;
}

/** short lines for what a review still finds open */
export function openItems(r: AuditReport): string[] {
  const out: string[] = [];
  const cut = (x?: string) => (x ?? "").replace(/\s+/g, " ").trim().slice(0, 220);
  for (const f of r.errors) out.push(`טעות: ${cut(f.quote)} → ${cut(f.fix)}`);
  for (const f of r.missing) out.push(`חסר: ${cut(f.topic)}${f.source ? ` (${f.source})` : ""}`);
  for (const f of r.thin) out.push(`דל: ${cut(f.topic)}${f.add ? ` · ${cut(f.add)}` : ""}`);
  for (const f of r.level) out.push(`רמה הנדסית: ${cut(f.topic)}${f.gap ? ` (${cut(f.gap)})` : ""}${f.add ? ` · ${cut(f.add)}` : ""}`);
  for (const f of r.deferrals.filter((d) => d.verdict === "teach_now" || d.verdict === "fix_ref")) out.push(`הפניה: ${cut(f.topic)}${f.correct_module ? ` → ${f.correct_module}` : ""}`);
  for (const f of r.early) out.push(`מוקדם: ${cut(f.topic)}${f.module ? ` (נלמד ב-${f.module})` : ""}`);
  for (const f of r.questions) out.push(`שאלה: ${cut(f.quote)} · ${cut(f.problem)}`);
  if (!r.keep.exists) out.push("אין בלוק לסיכום");
  for (const k of r.keep.missing) out.push(`חסר בלסיכום: ${cut(k)}`);
  for (const k of r.keep.remove) out.push(`לא שייך ללסיכום: ${cut(k)}`);
  return out.slice(0, 24);
}

/** The whole check: review and repair until a review passes, at most MAX_REVIEWS reviews, always ending on a review. */
export async function auditAndRepair(o: AuditInput, mode: "inplace" | "supplement", deps: AuditDeps): Promise<{ text: string; mark: AuditMark; report: AuditReport | null }> {
  let text = o.text;
  let report: AuditReport | null = null;
  let rounds = 0;
  const first: Record<string, number> = {};
  // a lesson checked before holds its supplement already: later repairs edit it
  let supplemented = mode === "supplement" && text.includes(SUPPLEMENT_HEAD);
  const cut: AuditFinding[] = [];
  let idle = 0;
  for (let round = 1; round <= MAX_REVIEWS; round++) {
    deps.onStatus?.(round === 1 ? "בודק את השיעור מול עמודי המקור ותוכנית הלימודים" : `בודק שוב אחרי התיקון (סבב ${round})`);
    const input = { ...o, text, ...(round === 1 ? {} : { later: undefined, cut }) };
    // a review too large with the list of later modules is sent once more without it (25.11: the cap is 256 KiB)
    const raw = await deps.call(auditPrompt(input, round), "audit").catch((e) => {
      if ((e as { code?: string })?.code !== "prompt_too_large" || !input.later) throw e;
      return deps.call(auditPrompt({ ...input, later: undefined }, round), "audit");
    });
    const next = parseAudit(raw);
    if (!next) break;
    // a lesson the learner has read is not cut: early material is only reported
    if (mode === "supplement" && next.early.length) {
      next.early = [];
      if (problems(next) === 0 && next.verdict === "fix") next.verdict = "pass";
    }
    // the format of the engineering case is checked by the program too, where it can still be edited
    if (mode === "inplace") {
      const extra = caseFindings(text);
      if (extra.length) {
        next.errors.push(...extra);
        next.verdict = "fix";
      }
    }
    report = next;
    rounds = round;
    cut.push(...next.early);
    if (round === 1)
      Object.assign(first, {
        missing: report.missing.length,
        thin: report.thin.length,
        level: report.level.length,
        deferrals: report.deferrals.filter((d) => d.verdict !== "ok").length,
        early: report.early.length,
        questions: report.questions.length,
        keep: (report.keep.exists ? 0 : 1) + report.keep.missing.length + report.keep.remove.length,
        errors: report.errors.length,
      });
    if (report.verdict === "pass" || round === MAX_REVIEWS) break;
    deps.onStatus?.(round === 1 ? "משלים את מה שחסר בשיעור" : `מתקן את מה שנשאר (סבב ${round})`);
    const how = mode === "supplement" ? (supplemented ? "supplement-edit" : "supplement") : "inplace";
    const fixed = applyRepair(text, await deps.call(repairPrompt({ ...o, text }, report, how), "repair"), how);
    if (fixed.applied && fixed.text !== text) {
      text = fixed.text;
      idle = 0;
      if (mode === "supplement") supplemented = true;
    } else if (++idle >= 2) break; // two repairs in a row that changed nothing: stop, and say what is open
  }
  // a lesson not read yet is also read as its learner reads it, and put in order (5.11)
  let reader: Awaited<ReturnType<typeof readerCheck>> | null = null;
  if (mode === "inplace" && deps.reader !== false) {
    reader = await readerCheck({ ...o, text }, deps).catch(() => null);
    if (reader) text = reader.text;
  }
  const refs = (report?.deferrals ?? []).filter((d) => d.verdict === "fix_ref" && d.topic && d.correct_module).map((d) => ({ topic: d.topic!, module: d.correct_module! }));
  const mark: AuditMark = {
    at: Date.now(),
    rounds,
    verdict: !report ? "partly" : report.verdict === "pass" ? (text === o.text ? "pass" : "fixed") : "partly",
    mode,
    counts: first,
    must_core: report?.must_core ?? [],
    ...(refs.length ? { refs } : {}),
    ...(report && report.verdict !== "pass" ? { open: openItems(report) } : {}),
    v: 2,
  };
  if (reader) {
    mark.reader = reader.mark;
    if (reader.mark.verdict === "partly") {
      if (mark.verdict !== "partly") mark.verdict = "partly";
      if (reader.report) mark.open = [...(mark.open ?? []), ...readerOpen(reader.report)];
    } else if (mark.verdict === "pass" && reader.mark.verdict === "fixed") mark.verdict = "fixed";
  }
  return { text, mark, report };
}

/* ---------------- long lessons: the check one part at a time ---------------- */

/** About this many characters of prose (visual code not counted) go to the reviewer in one request. */
export const PART_CHARS = 45_000;

const proseLength = (t: string) => compactVisuals(t).length;

/**
 * The lesson cut at its chapter headings (## …), and a part still longer than `max` at its subsection headings (### …).
 * The text before the first heading stays with the first part, and a closing supplement with the last; joining the
 * parts gives the lesson back exactly.
 */
export function splitLesson(text: string, max = PART_CHARS): string[] {
  const cut = (t: string, level: "## " | "### "): string[] => {
    const lines = t.split("\n");
    const out: string[][] = [[]];
    let fence = false;
    for (const line of lines) {
      if (/^```/.test(line)) fence = !fence;
      if (!fence && line.startsWith(level) && out[out.length - 1].some((l) => l.trim())) out.push([]);
      out[out.length - 1].push(line);
    }
    return out.map((ls) => ls.join("\n"));
  };
  const group = (parts: string[]): string[] => {
    // neighbours are joined back while they fit, so a short chapter is not checked alone
    const out: string[] = [];
    for (const p of parts) {
      const last = out[out.length - 1];
      if (last !== undefined && proseLength(last) + proseLength(p) <= max) out[out.length - 1] = `${last}\n${p}`;
      else out.push(p);
    }
    return out;
  };
  if (proseLength(text) <= max) return [text];
  const chapters = cut(text, "## ").flatMap((c) => (proseLength(c) > max ? group(cut(c, "### ")) : [c]));
  return group(chapters);
}

const headingsOf = (t: string) => t.split("\n").filter((l) => /^#{2,3} /.test(l)).map((l) => l.replace(/^#+\s*/, ""));

const WORSE = { pass: 0, fixed: 1, partly: 2 } as const;
const normWs = (t: string) => t.replace(/\s+/g, " ").trim();

/**
 * The check of a lesson of any length: a lesson that fits in one request is checked as before (auditAndRepair); a longer
 * one part by part, each part with the headings of the others, and the marks merged. In "supplement" mode each part's
 * supplement is gathered into one supplement at the lesson's end. A part the model still finds too large is cut again.
 */
export async function auditLong(o: AuditInput, mode: "inplace" | "supplement", deps: AuditDeps): Promise<{ text: string; mark: AuditMark; report: AuditReport | null }> {
  const run = async (text: string, part: AuditInput["part"], depth: number): Promise<{ text: string; mark: AuditMark; report: AuditReport | null }[]> => {
    try {
      return [await auditAndRepair({ ...o, text, ...(part ? { part } : {}) }, mode, deps)];
    } catch (e) {
      const code = (e as { code?: string })?.code;
      const pieces = code === "prompt_too_large" && depth < 3 ? splitLesson(text, Math.floor(proseLength(text) / 2)) : [text];
      if (pieces.length < 2) throw e;
      const out = [];
      for (const p of pieces) out.push(...(await run(p, { index: part?.index ?? 1, total: part?.total ?? 1, others: [...(part?.others ?? []), ...headingsOf(text.replace(p, ""))] }, depth + 1)));
      return out;
    }
  };
  // a supplement from an earlier check stays at the end and is checked with the last part
  const supAt = o.text.indexOf(`\n${SUPPLEMENT_HEAD}`);
  const body = supAt >= 0 ? o.text.slice(0, supAt) : o.text;
  const oldSup = supAt >= 0 ? o.text.slice(supAt) : "";
  const parts = splitLesson(body);
  if (parts.length === 1) {
    try {
      return await auditAndRepair(o, mode, deps);
    } catch (e) {
      if ((e as { code?: string })?.code !== "prompt_too_large") throw e;
      parts.splice(0, 1, ...splitLesson(body, Math.floor(proseLength(body) / 2)));
      if (parts.length < 2) throw e;
    }
  }
  const results: { text: string; mark: AuditMark; report: AuditReport | null }[] = [];
  for (let i = 0; i < parts.length; i++) {
    deps.onStatus?.(`בודק את חלק ${i + 1} מתוך ${parts.length} של השיעור`);
    const others = parts.filter((_, j) => j !== i).flatMap(headingsOf);
    const text = i === parts.length - 1 ? parts[i] + oldSup : parts[i];
    results.push(...(await run(text, { index: i + 1, total: parts.length, others }, 0)));
  }
  // gather: bodies in order, then one supplement made of every part's supplement
  const bodies: string[] = [];
  const sups: string[] = [];
  for (const r of results) {
    const at = r.text.indexOf(SUPPLEMENT_HEAD);
    if (mode === "supplement" && at >= 0) {
      bodies.push(r.text.slice(0, at).replace(/\n+$/, ""));
      sups.push(r.text.slice(at + SUPPLEMENT_HEAD.length).trim());
    } else bodies.push(r.text.replace(/\n+$/, ""));
  }
  const text = bodies.join("\n\n") + (sups.length ? `\n\n${SUPPLEMENT_HEAD}\n\n${sups.join("\n\n")}` : "") + "\n";
  const marks = results.map((r) => r.mark);
  const sum = (k: string) => marks.reduce((s, m) => s + ((m.counts as Record<string, number>)[k] ?? 0), 0);
  const verdict = marks.reduce<AuditMark["verdict"]>((v, m) => (WORSE[m.verdict] > WORSE[v] ? m.verdict : v), "pass");
  const mark: AuditMark = {
    at: Date.now(),
    rounds: Math.max(...marks.map((m) => m.rounds)),
    verdict: verdict === "pass" && normWs(text) !== normWs(o.text) ? "fixed" : verdict,
    mode,
    counts: Object.fromEntries(Object.keys(marks[0].counts).map((k) => [k, sum(k)])),
    must_core: [...new Set(marks.flatMap((m) => m.must_core))],
    ...(marks.some((m) => m.refs?.length) ? { refs: marks.flatMap((m) => m.refs ?? []) } : {}),
    ...(marks.some((m) => m.open?.length) ? { open: marks.flatMap((m) => m.open ?? []).slice(0, 32) } : {}),
    v: 2,
    parts: marks.length,
  };
  const readers = marks.map((m) => m.reader).filter((r): r is NonNullable<AuditMark["reader"]> => !!r);
  if (readers.length)
    mark.reader = {
      verdict: readers.reduce<NonNullable<AuditMark["reader"]>["verdict"]>((v, r) => (WORSE[r.verdict] > WORSE[v] ? r.verdict : v), "pass"),
      rounds: Math.max(...readers.map((r) => r.rounds)),
      counts: readers.reduce<Record<string, number>>((c, r) => {
        for (const [k, n] of Object.entries(r.counts)) c[k] = (c[k] ?? 0) + n;
        return c;
      }, {}),
    };
  return { text, mark, report: results[results.length - 1].report };
}
