// The research proposals of the engineering cases ("הצעת מחקר מהשיעור", docs/ENGINEERING_CASE.md): at a case's close,
// after the ADR and the debrief, the case becomes a proposal: the question, the decisions taken with their confidence,
// what stayed open, his ideas, the sources, the next experiments. One document per proposal, profile/projects/<id>,
// under 200KB. In "פרויקטים" he reopens it, adds dated rethinking ("מחשבות מחדש") and moves it proposal → active →
// closed; starting it marks its ideas as projects in the idea store (ideas.ts). Pure, except the store helpers at the
// end. Same file in both apps.
import { STAGE_NAMES, type CaseBlock, type CaseStage } from "./caseBlock";
import type { CaseDoc } from "./caseDoc";
import type { Idea } from "./ideas";
import { standardsFor, stdMissing, STANDARDS } from "./standards";

export type ProjectStatus = "proposal" | "active" | "closed";
export const PROJECT_STATUSES: ProjectStatus[] = ["proposal", "active", "closed"];
export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = { proposal: "הצעה", active: "פעיל", closed: "סגור" };

export interface ProjectDecision {
  stage: CaseStage;
  text: string;
  confidence: number;
  /** the rubric's grade (events.ts Grade) */
  grade?: string;
}
export interface ProjectNote {
  at: number;
  text: string;
}
export interface ResearchProject {
  id: string;
  caseId: string;
  moduleId: string;
  /** 0-based lesson index */
  lesson: number;
  lessonTitle: string;
  title: string;
  question: string;
  decisions: ProjectDecision[];
  /** open assumptions, the reversal condition, the missed decision, what the standards found missing */
  open: string[];
  ideas: { id: string; text: string }[];
  sources: string[];
  experiments: string[];
  status: ProjectStatus;
  notes: ProjectNote[];
  createdAt: number;
  updatedAt: number;
  startedAt?: number;
  closedAt?: number;
}

/** The proposal of a case: one per case (regenerating it replaces the draft, keeps his notes and status). */
export const projectId = (caseId: string) => `p-${caseId.replace(/[^\w.-]/g, "_")}`;

const PAGE_TAG = /\[\[([A-Za-z]+\d+[a-z]?:\d+(?:[-–]\d+)?)\]\]/g;
const NAMED = /\(מקור\s*:\s*([^)]+)\)/g;
const LINKED = /\[\[מקור\s*:\s*([^|\]]+)\|\s*([^\]]+)\]\]/g;

/** The sources a set of texts cites: page tags ([[B02:115]]), "(מקור: …)" and [[מקור: title | url]] (as a Markdown
 * link), each once, in order. */
export function extractSources(texts: string[]): string[] {
  const out: string[] = [];
  const add = (s: string) => {
    const t = s.replace(/\s+/g, " ").trim();
    if (t && !out.includes(t)) out.push(t);
  };
  for (const x of texts) {
    for (const m of x.matchAll(LINKED)) add(`[${m[1].trim()}](${m[2].trim()})`);
    for (const m of x.matchAll(NAMED)) add(m[1]);
    for (const m of x.matchAll(PAGE_TAG)) add(`עמוד מקור ${m[1]}`);
  }
  return out;
}

/** A part of the debrief by its bold heading ("**ההחלטה החשובה שהוחמצה**"), up to the next bold heading. */
export function debriefPart(debrief: string, heading: string): string {
  const at = debrief.indexOf(`**${heading}**`);
  if (at < 0) return "";
  const rest = debrief.slice(at + heading.length + 4);
  const end = rest.search(/^\s*\*\*[^*\n]+\*\*\s*$/m);
  return (end < 0 ? rest : rest.slice(0, end)).trim();
}

export interface ProposalEnrich {
  question?: string;
  open?: string[];
  experiments?: string[];
}

/** The model's sharpening of the proposal (casePrompt.ts proposalPrompt): {"question", "open": [], "experiments": []}. */
export function parseProposalEnrich(raw: string): ProposalEnrich | null {
  const t = raw.replace(/```(?:json)?/gi, "").trim();
  const a = t.indexOf("{");
  const b = t.lastIndexOf("}");
  if (a < 0 || b <= a) return null;
  try {
    const o = JSON.parse(t.slice(a, b + 1)) as Record<string, unknown>;
    const list = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && !!x.trim()).map((x) => x.trim().slice(0, 500)) : undefined);
    return { question: typeof o.question === "string" && o.question.trim() ? o.question.trim().slice(0, 600) : undefined, open: list(o.open), experiments: list(o.experiments) };
  } catch {
    return null;
  }
}

const uniq = (xs: string[]) => [...new Set(xs.map((x) => x.trim()).filter(Boolean))];

/** The proposal of a closed case, built from its work alone; `enrich` (the model's sharpening) wins where it gives
 * something; `prev` keeps his notes, status and dates when the proposal is made again. */
export function buildProposal(
  c: Pick<CaseBlock, "id" | "title" | "stages" | "notes" | "brief">,
  d: CaseDoc,
  o: { moduleId: string; lesson: number; lessonTitle: string; ideas: Idea[]; enrich?: ProposalEnrich | null; prev?: ResearchProject | null; now?: number },
): ResearchProject {
  const now = o.now ?? Date.now();
  const decisions: ProjectDecision[] = c.stages.flatMap((s) => {
    const w = d.stages[s];
    return w?.commit ? [{ stage: s, text: w.commit.decision, confidence: w.commit.confidence, grade: w.grade }] : [];
  });
  const first = c.stages.map((s) => d.stages[s]?.commit?.decision).find(Boolean);
  const question = o.enrich?.question || `${c.title}${first ? `: ${first}` : ""}`;
  const assumptions = c.stages.flatMap((s) => (d.stages[s]?.assumptions ?? []).filter((a) => !a.closed).map((a) => `הנחה שלא נבדקה (${STAGE_NAMES[s]}): ${a.text}`));
  const missed = d.debrief ? debriefPart(d.debrief, "ההחלטה החשובה שהוחמצה") : "";
  const gaps = [
    ...c.stages.flatMap((s) => (d.stages[s]?.std ?? []).flatMap((k) => (k && STANDARDS[k.id] ? stdMissing(k, STANDARDS[k.id]) : []))),
    ...(d.closeStd ?? []).flatMap((k) => (k && STANDARDS[k.id] ? stdMissing(k, STANDARDS[k.id]) : [])),
  ].slice(0, 6);
  const open = uniq([
    ...(o.enrich?.open ?? []),
    ...(d.adr?.reversal ? [`מה יהפוך את ההחלטה: ${d.adr.reversal}`] : []),
    ...(d.adr?.dissent ? [`התנגדות שנשארה: ${d.adr.dissent}`] : []),
    ...(missed ? [`ההחלטה שהוחמצה: ${missed.replace(/\s+/g, " ")}`] : []),
    ...assumptions,
    ...gaps.map((g) => `מול הסטנדרט: ${g}`),
  ]).slice(0, 14);
  const experiment = d.stages["7"]?.commit?.decision;
  const experiments = uniq([...(o.enrich?.experiments ?? []), ...(experiment ? [experiment] : [])]).slice(0, 6);
  const ideas = o.ideas.filter((i) => i.caseId === c.id).map((i) => ({ id: i.id, text: i.text }));
  const idea8 = d.stages["8"]?.commit?.decision;
  if (idea8 && !ideas.some((i) => i.text.includes(idea8))) ideas.unshift({ id: "", text: idea8 });
  const expertTexts = c.stages.flatMap((s) => [d.stages[s]?.expert ?? "", ...(c.notes.find((n) => n.stage === s)?.anchors ?? [])]);
  const stdSources = uniq(
    c.stages
      .filter((s) => d.stages[s]?.commit)
      .flatMap((s) => standardsFor(s))
      .concat(d.adr ? standardsFor("adr") : [])
      .map((s) => `[${s.source}](${s.url})`),
  );
  const sources = uniq([...extractSources([c.brief, ...expertTexts, d.debrief ?? ""]), ...stdSources]).slice(0, 30);
  return {
    id: projectId(c.id),
    caseId: c.id,
    moduleId: o.moduleId,
    lesson: o.lesson,
    lessonTitle: o.lessonTitle,
    title: c.title,
    question,
    decisions,
    open,
    ideas,
    sources,
    experiments,
    status: o.prev?.status ?? "proposal",
    notes: o.prev?.notes ?? [],
    createdAt: o.prev?.createdAt ?? now,
    updatedAt: now,
    startedAt: o.prev?.startedAt,
    closedAt: o.prev?.closedAt,
  };
}

/** A dated rethinking added to the proposal. */
export const addNote = (p: ResearchProject, text: string, now = Date.now()): ResearchProject => ({ ...p, notes: [...p.notes, { at: now, text: text.trim().slice(0, 4000) }], updatedAt: now });

/** Moves the proposal to a status; "active" is "התחל פרויקט" (it keeps the first start), "closed" keeps the close. */
export function setStatus(p: ResearchProject, status: ProjectStatus, now = Date.now()): ResearchProject {
  return { ...p, status, updatedAt: now, startedAt: status === "active" ? (p.startedAt ?? now) : p.startedAt, closedAt: status === "closed" ? now : undefined };
}

/** Keeps a proposal under the db's budget: the oldest notes lose their text first, then the sources shorten. */
export function fitProject(p: ResearchProject, max = 190_000): ResearchProject {
  const bytes = (v: unknown) => new TextEncoder().encode(JSON.stringify(v)).length;
  if (bytes(p) <= max) return p;
  const out: ResearchProject = JSON.parse(JSON.stringify(p));
  for (const n of out.notes) {
    if (bytes(out) <= max) break;
    n.text = n.text.slice(0, 400) + (n.text.length > 400 ? " …" : "");
  }
  while (bytes(out) > max && out.notes.length > 1) out.notes.splice(0, 1);
  while (bytes(out) > max && out.sources.length > 5) out.sources.pop();
  return out;
}

/** The open proposals and active projects, briefly, for the lesson planner (with <idea_store>). */
export function projectsForPrompt(ps: ResearchProject[], max = 8): string {
  const rank = (p: ResearchProject) => (p.status === "active" ? 0 : 1);
  return ps
    .filter((p) => p.status !== "closed")
    .sort((a, b) => rank(a) - rank(b) || b.updatedAt - a.updatedAt)
    .slice(0, max)
    .map((p) => `- [${p.status === "active" ? "פרויקט פעיל" : "הצעת מחקר"}, ${p.moduleId} שיעור ${p.lesson + 1}] ${p.question.replace(/\s+/g, " ").slice(0, 180)}${p.open[0] ? ` · פתוח: ${p.open[0].replace(/\s+/g, " ").slice(0, 120)}` : ""}`)
    .join("\n");
}

/* ---------------- the store: profile/projects/<id>, one document per proposal ---------------- */

export interface ProjectStore {
  listProjects(): Promise<Record<string, unknown>[]>;
  saveProject(id: string, data: Record<string, unknown>): Promise<void>;
}

function valid(x: unknown): x is ResearchProject {
  const p = x as ResearchProject;
  return !!p && typeof p.id === "string" && typeof p.caseId === "string" && typeof p.question === "string";
}

export async function loadProjects(store: ProjectStore | null | undefined): Promise<ResearchProject[]> {
  if (!store?.listProjects) return [];
  const all = await store.listProjects();
  return (all as unknown[])
    .filter(valid)
    .map((p) => ({ ...p, status: PROJECT_STATUSES.includes(p.status) ? p.status : "proposal", notes: Array.isArray(p.notes) ? p.notes : [], open: p.open ?? [], ideas: p.ideas ?? [], sources: p.sources ?? [], experiments: p.experiments ?? [], decisions: p.decisions ?? [] }))
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function saveProject(store: ProjectStore, p: ResearchProject): Promise<ResearchProject> {
  const fit = fitProject(p);
  await store.saveProject(fit.id, fit as unknown as Record<string, unknown>);
  return fit;
}
