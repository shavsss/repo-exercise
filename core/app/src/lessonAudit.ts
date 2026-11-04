// The check every lesson passes before the learner reads it (3.11, after a review found lessons that dropped
// material of their pages, marked main topics as "a first look", asked questions the lesson never prepared, and
// had no keep block). An independent reviewer call reads the lesson against its source pages, the curriculum and
// the modules it defers to, and answers what is missing, thin, wrongly deferred, unanswerable or wrong; the author
// then repairs the lesson, in place before it is read, or as a supplement at its end when it was already read.
// It runs until a review passes, up to four reviews (three repairs): a lesson he gets is finished, and what
// is still open after that is stored on the lesson and shown. The pure parts (prompts, parsing, applying the edits) are tested in tools/test/audit.test.mjs.
// Same file in both apps.

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
  problem?: string;
  fix?: string;
}
export interface AuditReport {
  missing: AuditFinding[];
  thin: AuditFinding[];
  deferrals: AuditFinding[];
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
}

export interface AuditInput {
  lessonTitle: string;
  moduleId: string;
  moduleTitle: string;
  covers: string[];
  focus?: string;
  otherLessons: { title: string; covers: string[] }[];
  curriculum: string;
  /** the modules the lesson names, with their sections: is a deferred topic really taught there? */
  modules: { id: string; title: string; sections: string[] }[];
  pages: string;
  text: string;
}

const listOf = (xs: string[]) => xs.map((x) => `- ${x}`).join("\n");

/** Module ids the lesson names (M0.2, M13.1…), so the reviewer can see what each of them really teaches. */
export function namedModules(text: string): string[] {
  return [...new Set([...text.matchAll(/\bM\d{1,2}\.\d{1,2}\b/g)].map((m) => m[0]))].slice(0, 40);
}

export const SUPPLEMENT_HEAD = "## השלמה לשיעור";

export function auditPrompt(o: AuditInput, round = 1): string {
  const supplement = o.text.includes(SUPPLEMENT_HEAD)
    ? `\nThe learner had already read this lesson when it was checked, so its end holds a supplement ("${SUPPLEMENT_HEAD}") instead of edits. Read the lesson and the supplement together: an item taught, completed or corrected in the supplement is fixed, and a question replaced there is fixed. Report a problem of the read part only when the supplement does not fix it, and check the supplement itself as strictly as the lesson.\n`
    : "";
  const mods = o.modules.map((m) => `${m.id} ${m.title}: ${m.sections.slice(0, 30).join("; ")}`).join("\n");
  return `<lesson_audit round="${round}">
You are the independent reviewer of one lesson of a self-study course (engineering, physics and mathematics, in Hebrew), written by another model from assigned source pages. The learner studies only from this lesson: anything important it drops, teaches too thinly to use, defers to a module that does not teach it, or asks without having taught is lost, or breaks his calibration. Check the lesson against the sources strictly and concretely. Do not invent problems, do not ask for padding, length or extra examples, and ignore scan typos and anecdotes.
${supplement}
Lesson: ${o.moduleId} ${o.moduleTitle} · ${o.lessonTitle}
<assigned_sections>
${listOf(o.covers)}
</assigned_sections>
${o.focus ? `<lesson_focus>\n${o.focus}\n</lesson_focus>\n` : ""}<other_lessons_of_this_module>
${o.otherLessons.map((l) => `- ${l.title}: ${l.covers.join("; ")}`).join("\n") || "(none)"}
</other_lessons_of_this_module>
<curriculum>
${o.curriculum || "(none)"}
</curriculum>
<modules_the_lesson_names>
${mods || "(none)"}
</modules_the_lesson_names>
<source_pages>
${o.pages}
</source_pages>
<lesson>
${o.text}
</lesson>

Check:
1. Coverage: every idea, result, definition, argument, mechanism and worked number of the assigned sections that a strong engineer should take from them, and every curriculum topic item marked K or S for this lesson. "missing": not in the lesson. "thin": present but not taught to a level the learner can use (no definition, no derivation or reason, no meaning, no number where the point is a number).
2. Deferrals: every place the lesson says or implies that a topic is only a first look and is taught later (a module id, "later", "in the next modules"). Is it really taught in full by that module (see its sections)? If not, or if no module is named and none clearly does, the verdict is "teach_now". A wrong module id with a right topic is "fix_ref" with the correct module.
3. Questions (think, predict, exercise, verify, errorhunt blocks): can a careful reader answer each one from what the lesson wrote before it, with the numbers and constants given in the lesson or the question? Is it on what the lesson teaches in full?
4. The keep block ("לסיכום"): does it exist, does it hold what must be remembered from this lesson, and nothing that is only a first look?
5. Errors: statements that contradict the sources or the established facts.
Quotes must be copied exactly from the lesson (a short unique phrase). "after" and "heading" are exact heading texts of the lesson (without the #).

Answer with one JSON object and nothing else:
{"missing":[{"topic":"","source":"<page tag, e.g. F1:17>","why":"","after":""}],"thin":[{"topic":"","heading":"","add":""}],"deferrals":[{"topic":"","quote":"","verdict":"ok|teach_now|fix_ref","correct_module":""}],"questions":[{"quote":"","problem":"","fix":""}],"keep":{"exists":true,"missing":[],"remove":[]},"errors":[{"quote":"","fix":""}],"must_core":["the topics the learner must learn now from this lesson"],"verdict":"pass|fix"}
"verdict" is "pass" only when nothing important is missing, thin, wrongly deferred or unanswerable, and the keep block is complete. List deferrals with verdict "ok" too, so the map knows they were checked.
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
    deferrals: arr(o.deferrals),
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
  return r.missing.length + r.thin.length + r.deferrals.filter((d) => d.verdict === "teach_now" || d.verdict === "fix_ref").length + r.questions.length + r.errors.length + (r.keep.exists ? 0 : 1) + r.keep.missing.length + r.keep.remove.length;
}

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
      ? `Output only edit blocks, in this exact format (as many as needed, in any order):
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
Fix a wrong question with a REPLACE of the whole question block; fix a wrong module reference or an error with a REPLACE of the sentence.`
      : `The learner has already read this lesson, so do not edit it: write one supplement that comes after it. Output exactly:
<<<SUPPLEMENT>>>
## השלמה לשיעור
a short opening line (what this supplement completes), then a ### section for each missing or thin item, in the lesson's order, each opening with the section of the lesson it completes ("משלים את «…»"); the corrected questions as new think/predict blocks; each error and wrong reference as a one-line correction
<<<END>>>
<<<KEEP>>>
the whole content of the lesson's keep block, one "- name: …" line each (it replaces the existing keep block, or is added at the end)
<<<END>>>`;
  return `<lesson_repair mode="${mode}">
You are the author of this lesson, repairing it after an independent review (in <review>). Write in the lesson's own Hebrew, style and block syntax (the definition, formula, think, predict and keep blocks exactly as the lesson writes them; mathematics in $…$), at the course's full depth: teach every missing or thin item in full (its context, the definition or result, how it is built or derived, what it means, its limits, and a computed number where the point is a number); teach now every deferred topic the review says no later module teaches; give a question the givens it lacks or rewrite it so the lesson's material answers it; make the keep block complete (only what this lesson teaches in full). Never shorten or remove correct material, never add padding. Check every number with compute.

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
  return m ? text.slice(0, m.index) + block + text.slice(m.index + m[0].length) : `${text.trimEnd()}\n\n${block}\n`;
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
    for (const m of raw.matchAll(/<<<REPLACE>>>\s*\n([\s\S]*?)\n<<<WITH>>>\s*\n([\s\S]*?)\n<<<END>>>/g)) {
      const [, from, to] = m;
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
        // the last section of the lesson: before its keep block if it has one, else at the end
        const keepAt = lines.findIndex((l, i) => i > at && /^```keep/.test(l));
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

export interface AuditDeps {
  /** one model call; returns its text */
  call: (prompt: string, kind: "audit" | "repair") => Promise<string>;
  onStatus?: (s: string) => void;
}

export const MAX_REVIEWS = 4;

/** short lines for what a review still finds open */
export function openItems(r: AuditReport): string[] {
  const out: string[] = [];
  const cut = (x?: string) => (x ?? "").replace(/\s+/g, " ").trim().slice(0, 220);
  for (const f of r.errors) out.push(`טעות: ${cut(f.quote)} → ${cut(f.fix)}`);
  for (const f of r.missing) out.push(`חסר: ${cut(f.topic)}${f.source ? ` (${f.source})` : ""}`);
  for (const f of r.thin) out.push(`דל: ${cut(f.topic)}${f.add ? ` · ${cut(f.add)}` : ""}`);
  for (const f of r.deferrals.filter((d) => d.verdict === "teach_now" || d.verdict === "fix_ref")) out.push(`הפניה: ${cut(f.topic)}${f.correct_module ? ` → ${f.correct_module}` : ""}`);
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
  let idle = 0;
  for (let round = 1; round <= MAX_REVIEWS; round++) {
    deps.onStatus?.(round === 1 ? "בודק את השיעור מול עמודי המקור ותוכנית הלימודים" : `בודק שוב אחרי התיקון (סבב ${round})`);
    const next = parseAudit(await deps.call(auditPrompt({ ...o, text }, round), "audit"));
    if (!next) break;
    report = next;
    rounds = round;
    if (round === 1)
      Object.assign(first, {
        missing: report.missing.length,
        thin: report.thin.length,
        deferrals: report.deferrals.filter((d) => d.verdict !== "ok").length,
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
  return { text, mark, report };
}
