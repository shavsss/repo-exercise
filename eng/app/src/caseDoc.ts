// The learner's work on a lesson's engineering case (docs/ENGINEERING_CASE.md, "התכנון הטכני"), as kept in
// profile/cases/<module>__<lesson>: per stage the proposal and its confidence, the review thread (comments, replies,
// compute cells), the commit, the expert reasoning with the rubric's verdicts, and what he saw only after it; then
// the ADR and the debrief. Pure (no React): the room (components/CaseRoom.tsx), the store (caseStore.ts) and the
// tests share it. Same file in both apps.
import type { CaseBlock, CaseRubricItem, CaseStage } from "./caseBlock";
import type { Conf, Grade } from "./events";

export type StagePhase = "draft" | "review" | "expert" | "reflect" | "closed";

export interface CaseCell {
  /** what he asked to compute, in his words */
  ask: string;
  script: string;
  output: string;
  ok: boolean;
}
export interface CaseTurn {
  id: string;
  who: "learner" | "reviewer" | "cell";
  /** the reviewer's role */
  role?: string;
  text: string;
  ts: number;
  model?: string;
  /** a reviewer comment the learner marked resolved */
  resolved?: boolean;
  cell?: CaseCell[];
  /** the answer stopped before its end */
  cut?: boolean;
}
export interface CaseAssumption {
  text: string;
  closed?: boolean;
}
export interface StageWork {
  phase: StagePhase;
  proposal: string;
  /** 0–100; none until he sets it */
  confidence?: number;
  turns: CaseTurn[];
  commit?: { decision: string; confidence: number; at: number };
  expert?: string;
  /** per rubric item: met */
  rubric?: boolean[];
  /** he changed a verdict of the rubric himself */
  disputed?: boolean;
  grade?: Grade;
  reflection?: string;
  /** limits and gaps the review named (the numbers ledger) */
  numbers?: string[];
  assumptions?: CaseAssumption[];
}
export interface CaseAdr {
  context: string;
  decision: string;
  alternatives: string;
  consequences: string;
  reversal: string;
  at: number;
}
export interface CaseDoc {
  caseId: string;
  title: string;
  stages: Partial<Record<CaseStage, StageWork>>;
  adr?: CaseAdr;
  debrief?: string;
  updatedAt: number;
}

export const emptyDoc = (c: Pick<CaseBlock, "id" | "title">): CaseDoc => ({ caseId: c.id, title: c.title, stages: {}, updatedAt: 0 });
export const emptyStage = (): StageWork => ({ phase: "draft", proposal: "", turns: [] });

/** A confidence in % as the three calibration levels (1 guessing, 2 fairly sure, 3 sure). */
export function confLevel(pct: number): Conf {
  return pct >= 80 ? 3 : pct >= 50 ? 2 : 1;
}

/** The grade a rubric gives: the decisive item and most of the others → right; one of them → partial; else wrong. */
export function rubricGrade(items: CaseRubricItem[], met: boolean[]): Grade {
  const d = items.findIndex((r) => r.decisive);
  const decisive = d >= 0 && !!met[d];
  const others = items.map((_, i) => i).filter((i) => i !== d);
  const share = others.length ? others.filter((i) => met[i]).length / others.length : 1;
  if (decisive && share >= 2 / 3) return "right";
  if (decisive || share >= 0.5) return "partial";
  return "wrong";
}

const YES = /^(כן|v|✓|yes|y|1|true)$/i;
/** The expert reasoning without its last line `<<מחוון: כן, לא, …>>`, and the verdicts it gives (null when absent). */
export function parseExpert(text: string, n: number): { body: string; met: boolean[] | null } {
  const m = /<<\s*מחוון\s*:([^>]*)>>\s*$/.exec(text.trim());
  // a line still being written in a stream
  if (!m) return { body: text.replace(/<<[^>]*$/, "").trimEnd(), met: null };
  const vals = m[1]
    .split(/[,;|]/)
    .map((s) => s.replace(/^\s*\d+\s*[=:.)]\s*/, "").trim())
    .filter(Boolean);
  const met = Array.from({ length: n }, (_, i) => YES.test(vals[i] ?? ""));
  return { body: text.trim().slice(0, m.index).trimEnd(), met };
}

/** A reviewer comment without its `<<מספר: …>>` and `<<הנחה: …>>` tags, and what they hold. */
export function parseReview(text: string): { body: string; numbers: string[]; assumptions: string[] } {
  const numbers: string[] = [];
  const assumptions: string[] = [];
  const body = text
    .replace(/<<\s*(מספר|הנחה)\s*:([^>]*)>>/g, (_m, k: string, v: string) => {
      (k === "מספר" ? numbers : assumptions).push(v.trim());
      return "";
    })
    // a tag still being written in a stream
    .replace(/<<[^>]*$/, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { body, numbers: numbers.filter(Boolean), assumptions: assumptions.filter(Boolean) };
}

/** The stage the learner works on: the first in @stages that is not closed (null when all are). */
export function currentStage(c: Pick<CaseBlock, "stages">, d: CaseDoc): CaseStage | null {
  return c.stages.find((s) => d.stages[s]?.phase !== "closed") ?? null;
}

/** A stage as a section of the design doc: open, in review, closed. */
export function sectionStatus(w: StageWork | undefined): "open" | "review" | "closed" {
  if (!w || w.phase === "draft") return "open";
  return w.phase === "closed" ? "closed" : "review";
}

/** The design doc's status: a draft until a stage is sent to review; approved when every stage is closed and the ADR written. */
export function docStatus(c: Pick<CaseBlock, "stages">, d: CaseDoc): "draft" | "review" | "approved" {
  if (c.stages.length && c.stages.every((s) => d.stages[s]?.phase === "closed") && d.adr) return "approved";
  return c.stages.some((s) => sectionStatus(d.stages[s]) !== "open") ? "review" : "draft";
}

export const closedCount = (c: Pick<CaseBlock, "stages">, d: CaseDoc) => c.stages.filter((s) => d.stages[s]?.phase === "closed").length;

/** The design doc's number: DD-<module>-<lesson>. */
export const docNumber = (caseId: string) => `DD-${caseId.replace(/-case$/, "")}`;
/** The decision record's number: ADR-<module>-<lesson, three digits>. */
export function adrNumber(caseId: string) {
  const m = /^(.+)-(\d+)-case$/.exec(caseId);
  return m ? `ADR-${m[1]}-${m[2].padStart(3, "0")}` : `ADR-${caseId}`;
}

/** The last value of a compute output, as "name = value" with long numbers rounded: what a notebook cell puts in the ledger. */
export function cellResult(output: string) {
  const line = output
    .split("\n")
    .filter((l) => l.includes("→") && !/ERROR/.test(l))
    .pop();
  if (!line) return "";
  const [lhs, value] = line.split("→").map((x) => x.trim());
  const name = /^([A-Za-z_]\w*)\s*=/.exec(lhs)?.[1] ?? lhs;
  return `${name} = ${value.replace(/-?\d+\.\d{4,}(e[+-]?\d+)?/g, (n) => String(Number(Number(n).toPrecision(4))))}`;
}

/** Keeps a document under the db's budget: the oldest turns of each stage lose their text first. */
export function fitCase(d: CaseDoc, max = 190_000): CaseDoc {
  const bytes = (v: unknown) => new TextEncoder().encode(JSON.stringify(v)).length;
  if (bytes(d) <= max) return d;
  const out: CaseDoc = JSON.parse(JSON.stringify(d));
  const turns = Object.values(out.stages)
    .flatMap((w) => w?.turns ?? [])
    .sort((a, b) => a.ts - b.ts);
  for (const t of turns) {
    if (bytes(out) <= max) break;
    t.text = t.text.slice(0, 300) + (t.text.length > 300 ? " …" : "");
    if (t.cell) t.cell = t.cell.map((x) => ({ ...x, output: x.output.slice(0, 300) }));
  }
  while (bytes(out) > max) {
    const w = Object.values(out.stages).find((x) => x && x.turns.length > 2);
    if (!w) break;
    w.turns.splice(0, 1);
  }
  return out;
}
