// The engineering case at the end of a book lesson (docs/ENGINEERING_CASE.md): the ```case block's stages, its
// parser, and the format check the lesson audit runs on it. The writer's spec of the block is CASE_PART in
// bookRules.ts. Pure (no React), so the audit, the tests and the case room (sub-stage 2) share it. Same file in both apps.
//
// The block:
//   ```case
//   @title: …            @id: <module>-<lesson>-case     @stages: 1,2,3,4,5,6,7,8 (or fault,6,7,8)
//   @roles: 1=בעל הדרישה; 5=מהנדס בחברה שבחרה אחרת; 6=צוות אדום; *=מהנדס בכיר
//   the visible brief: scenario, computed numbers, constraints
//   ---
//   @@ stage 1            (one section per stage of @stages, in order; hidden until the learner commits)
//   ask: the stage's question
//   anchors:
//   - data to challenge with, a computed limit, a claim with its certainty label
//   expert:
//   the expert's reasoning, sourced and certainty-labelled
//   rubric:
//   - [!] the decisive decision (exactly one)
//   - [ ] a yes/no check
//   guide:                (every lesson, caseAid: open beside the question before he writes)
//   - what a good answer at this stage contains (3–5 lines, never the decisive item)
//   industry:             (with the guide: how a real, publicly documented top team did this stage, sourced)
//   example:              (the module's first two lessons: shown beside his proposal after he commits)
//   a model answer at the expected level: the proposal, its reasoning, the numbers, "ביטחון: 70%"
//   @@ debrief
//   decisions:
//   - the case's key decisions, most important first
//   ```

export const CASE_STAGES = ["fault", "1", "2", "3", "4", "5", "6", "7", "8"] as const;
export type CaseStage = (typeof CASE_STAGES)[number];

export const STAGE_NAMES: Record<CaseStage, string> = {
  fault: "התקלה",
  "1": "הבעיה והדרישות",
  "2": "הגבול הפיזיקלי",
  "3": "ארכיטקטורה",
  "4": "שיטות ואלגוריתמים",
  "5": "האם זה כבר קיים",
  "6": "שבירה",
  "7": "ניסוי",
  "8": "הרעיון שלך",
};

/** The reviewer of each stage when @roles does not name one ("*" in @roles overrides the senior engineer). */
export const DEFAULT_ROLES: Partial<Record<CaseStage, string>> = { "1": "בעל הדרישה", "5": "מהנדס בחברה שבחרה אחרת", "6": "צוות אדום" };
const SENIOR = "מהנדס בכיר";

/** The stable id of a lesson's case: the module, the 1-based lesson number. */
export const caseId = (moduleId: string, lessonIdx: number) => `${moduleId}-${lessonIdx + 1}-case`;

/** What a lesson's case carries to help the learner start (docs/ENGINEERING_CASE.md, "מקרה לדוגמה"; the learner,
 * 26.11: until it is a habit, guidance in every case): every lesson guidelines and a real industry example per stage,
 * the first two lessons of every module also a model answer. `null` is kept for cases written before. */
export type CaseAid = "example" | "guide" | null;
export const caseAid = (lessonIdx: number): CaseAid => (lessonIdx <= 1 ? "example" : "guide");

export interface CaseRubricItem {
  text: string;
  /** the decision that separates the top level from the average (marked [!]) */
  decisive: boolean;
}
export interface CaseStageNotes {
  stage: CaseStage;
  ask: string;
  anchors: string[];
  expert: string;
  rubric: CaseRubricItem[];
  /** what a good answer at this stage contains (worked lessons only) */
  guide: string[];
  /** how a real, publicly documented top team did this stage, with its source or certainty (shown with the guide) */
  industry: string;
  /** a model answer at the expected level, shown beside his after he commits (the module's first two lessons) */
  example: string;
}
export interface CaseBlock {
  title: string;
  id: string;
  stages: CaseStage[];
  /** the stages @stages names that are not stages (kept for the format check) */
  unknown: string[];
  roles: Record<string, string>;
  brief: string;
  /** false when the block has no "---" line (nothing is hidden) */
  split: boolean;
  notes: CaseStageNotes[];
  decisions: string[];
}

/** The reviewer's role in a stage. */
export function stageRole(c: Pick<CaseBlock, "roles">, s: CaseStage): string {
  return c.roles[s] ?? DEFAULT_ROLES[s] ?? c.roles["*"] ?? SENIOR;
}

const listItems = (t: string) =>
  t
    .split("\n")
    .map((l) => /^\s*[-*]\s+(.*)$/.exec(l)?.[1]?.trim() ?? "")
    .filter(Boolean);

const LABELS = ["ask", "anchors", "expert", "rubric", "guide", "industry", "example", "decisions"] as const;
type Label = (typeof LABELS)[number];
const LABEL_LINE = new RegExp(`^(${LABELS.join("|")})\\s*:\\s*(.*)$`, "i");

/** The labelled parts of one hidden section ("ask: …", "anchors:" and its lines, …). */
function labelled(body: string): Partial<Record<Label, string>> {
  const out: Partial<Record<Label, string>> = {};
  let cur: Label | null = null;
  for (const line of body.split("\n")) {
    const m = LABEL_LINE.exec(line.trim());
    if (m) {
      cur = m[1].toLowerCase() as Label;
      out[cur] = m[2];
      continue;
    }
    if (cur) out[cur] = `${out[cur] ?? ""}\n${line}`;
  }
  for (const k of Object.keys(out) as Label[]) out[k] = out[k]!.trim();
  return out;
}

export function parseCase(source: string): CaseBlock {
  const lines = source.replace(/\r/g, "").split("\n");
  const headers: Record<string, string> = {};
  let i = 0;
  for (; i < lines.length; i++) {
    const m = /^@(\w+)\s*:\s*(.*)$/.exec(lines[i].trim());
    if (m) headers[m[1].toLowerCase()] = m[2].trim();
    else if (lines[i].trim()) break;
  }
  const rest = lines.slice(i);
  const sep = rest.findIndex((l) => l.trim() === "---");
  const brief = (sep < 0 ? rest : rest.slice(0, sep)).join("\n").trim();
  const hidden = sep < 0 ? "" : rest.slice(sep + 1).join("\n");
  const raw = (headers.stages ?? "")
    .split(/[,\s]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const roles: Record<string, string> = {};
  for (const pair of (headers.roles ?? "").split(/[;\n]/)) {
    const m = /^\s*(\*|fault|\d)\s*=\s*(.+?)\s*$/i.exec(pair);
    if (m) roles[m[1].toLowerCase()] = m[2];
  }
  const notes: CaseStageNotes[] = [];
  let decisions: string[] = [];
  for (const sec of hidden.split(/^@@\s*/m).slice(1)) {
    const nl = sec.indexOf("\n");
    const head = (nl < 0 ? sec : sec.slice(0, nl)).trim().toLowerCase();
    const parts = labelled(nl < 0 ? "" : sec.slice(nl + 1));
    if (head === "debrief") {
      decisions = listItems(parts.decisions ?? "");
      continue;
    }
    const stage = /^stage\s+(\S+)/.exec(head)?.[1] as CaseStage | undefined;
    if (!stage || !CASE_STAGES.includes(stage)) continue;
    notes.push({
      stage,
      ask: parts.ask ?? "",
      anchors: listItems(parts.anchors ?? ""),
      expert: parts.expert ?? "",
      rubric: (parts.rubric ?? "")
        .split("\n")
        .map((l) => /^\s*[-*]\s*\[([ !xX])\]\s*(.+)$/.exec(l))
        .filter((m): m is RegExpExecArray => !!m)
        .map((m) => ({ text: m[2].trim(), decisive: m[1] === "!" })),
      guide: listItems(parts.guide ?? ""),
      industry: parts.industry ?? "",
      example: parts.example ?? "",
    });
  }
  return {
    title: headers.title ?? "",
    id: headers.id ?? "",
    stages: raw.filter((s): s is CaseStage => (CASE_STAGES as readonly string[]).includes(s)),
    unknown: raw.filter((s) => !(CASE_STAGES as readonly string[]).includes(s)),
    roles,
    brief,
    split: sep >= 0,
    notes,
    decisions,
  };
}

/** The case has a model answer in some stage (its card shows "מקרה לדוגמה"). */
export const hasExamples = (c: Pick<CaseBlock, "notes">) => c.notes.some((n) => !!n.example);

/** A source or a certainty label: a page tag [[B02:115]], [[ודאות: …]], or "(מקור: …)". */
const SOURCED = /\[\[(?:ודאות\s*:|[A-Za-z]+\d+[a-z]?:\d)|\(מקור\s*:/;
const CERTAIN = /\[\[ודאות\s*:/;

/** What breaks the block's format, as short English lines for the audit's repair turn. Empty when it is well formed. */
export function caseProblems(c: CaseBlock, expectId?: string, aid?: CaseAid): string[] {
  const out: string[] = [];
  if (!c.title) out.push("the case has no @title");
  if (!c.id) out.push(`the case has no @id${expectId ? ` (it is ${expectId})` : ""}`);
  else if (expectId && c.id !== expectId) out.push(`the case's @id is ${c.id}; it must be ${expectId}`);
  if (c.unknown.length) out.push(`@stages names unknown stages: ${c.unknown.join(", ")} (only fault and 1–8)`);
  if (!c.stages.length) out.push("@stages is empty");
  const order = c.stages.map((s) => CASE_STAGES.indexOf(s));
  if (order.some((n, k) => k > 0 && n <= order[k - 1])) out.push("@stages is not in the fixed order (fault first, then 1–8 ascending, each once)");
  if (!c.brief) out.push("the case has no visible brief (scenario, numbers, constraints) before the --- line");
  if (!c.split) out.push('the case has no "---" line between the brief and the hidden stage notes');
  for (const s of c.stages) {
    const n = c.notes.find((x) => x.stage === s);
    if (!n) {
      out.push(`stage ${s} is in @stages but has no "@@ stage ${s}" section`);
      continue;
    }
    if (!n.ask) out.push(`stage ${s}: no "ask:" (the stage's question)`);
    if (!n.anchors.length) out.push(`stage ${s}: no "anchors:" lines`);
    if (!n.expert) out.push(`stage ${s}: no "expert:" reasoning`);
    else if (!SOURCED.test(n.expert)) out.push(`stage ${s}: the expert reasoning has no source tag or certainty label`);
    if (s === "5") {
      const bare = n.anchors.filter((a) => !CERTAIN.test(a));
      if (bare.length) out.push(`stage 5: ${bare.length} anchor claim(s) without a certainty label [[ודאות: …]]`);
    }
    if (n.rubric.length < 2) out.push(`stage ${s}: the rubric needs at least two "- [ ]" items`);
    const dec = n.rubric.filter((r) => r.decisive).length;
    if (dec !== 1) out.push(`stage ${s}: the rubric must mark exactly one decisive item "- [!]" (it has ${dec})`);
    // the aids: required by the lesson's place (when known), and well formed wherever they are
    const wantGuide = aid === "example" || aid === "guide" || !!n.guide.length || !!n.example;
    if (wantGuide && (n.guide.length < 3 || n.guide.length > 5)) out.push(`stage ${s}: "guide:" needs 3 to 5 lines (it has ${n.guide.length})`);
    if (aid && !n.industry) out.push(`stage ${s}: no "industry:" (how a real, publicly documented top team did this stage)`);
    if (n.industry && !SOURCED.test(n.industry)) out.push(`stage ${s}: the industry example has no source or certainty label`);
    if ((aid === "example" || (aid === undefined && hasExamples(c))) && !n.example) out.push(`stage ${s}: no "example:" (a model answer; this case carries one in every stage)`);
    if (n.example && !/\d\s*%/.test(n.example)) out.push(`stage ${s}: the example has no confidence in % ("ביטחון: 70%")`);
  }
  const extra = c.notes.filter((n) => !c.stages.includes(n.stage)).map((n) => n.stage);
  if (extra.length) out.push(`sections for stages not in @stages: ${extra.join(", ")}`);
  if (!c.decisions.length) out.push('no "@@ debrief" section with its "decisions:" list');
  return out;
}

const CASE_FENCE = /^```case[^\n]*\n([\s\S]*?)^```[ \t]*$/gm;

/** The case blocks of a lesson text: their source and where each starts. */
export function caseBlocks(text: string): { source: string; at: number }[] {
  return [...text.matchAll(CASE_FENCE)].map((m) => ({ source: m[1], at: m.index ?? 0 }));
}

/** The lesson with each case's hidden notes replaced by a one-line stand-in (what its learner sees before committing). */
export function hideCaseNotes(text: string): string {
  return text.replace(CASE_FENCE, (all, body: string) => {
    const at = body.search(/^---[ \t]*$/m);
    if (at < 0) return all;
    const stages = (body.slice(at).match(/^@@\s*stage/gm) ?? []).length;
    return `\`\`\`case\n${body.slice(0, at)}---\n[hidden notes of ${stages} stages, shown only after the learner commits]\n\`\`\``;
  });
}
