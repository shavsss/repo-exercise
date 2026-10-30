// The documents behind the three tabs beside the lessons. Every path is under
// data/users/<id>/profile/ and only ever added to (docs/NEWS_SCHEMA.md, docs/REVIEW_SCHEMA.md):
//   news/<YYYY-Www>       a weekly issue, written by the scheduled news session (read here)
//   news/_index           the list of issues, newest first (optional; the collection is listed when absent)
//   newsfb/<YYYY-Www>     what the learner read, saved and rated in that issue (written here)
//   products/<YYYY-MM>    the month's product workspace (written here)
//   reviews/<YYYY-Www>    the weekly external review, written by the scheduled review session (read here)
import type { Store } from "../runtime";

/* ---------------- weeks and months ---------------- */

/** ISO week id of a date, "2026-W44". */
export function isoWeek(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = t.getUTCFullYear();
  const w = Math.ceil(((t.getTime() - Date.UTC(y, 0, 1)) / 86400000 + 1) / 7);
  return `${y}-W${String(w).padStart(2, "0")}`;
}

export function monthId(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const MONTHS = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
export function monthLabel(id: string) {
  const [y, m] = id.split("-").map(Number);
  return m >= 1 && m <= 12 ? `${MONTHS[m - 1]} ${y}` : id;
}

/** "12.10" from an ISO date or a timestamp. */
export function shortDate(v: string | number | undefined) {
  if (v === undefined || v === "") return "";
  const d = typeof v === "number" ? new Date(v) : new Date(v.length === 10 ? v + "T12:00:00" : v);
  return isNaN(d.getTime()) ? String(v) : `${d.getDate()}.${d.getMonth() + 1}`;
}

export const WEEK_RE = /^\d{4}-W\d{2}$/;
export const MONTH_RE = /^\d{4}-\d{2}$/;

/* ---------------- news ---------------- */

export type Certainty = "official" | "peer" | "preprint" | "single" | "corroborated" | "vendor" | "disputed";
export type Rel = "learned" | "current" | "next" | "later" | "outside";

export interface NewsSource {
  url: string;
  title: string;
  publisher: string;
  tier: "A" | "B" | "C" | "D";
  publishedAt: string;
  fetchedAt?: number;
  httpStatus?: number;
  sha256?: string;
  quote?: string;
  openAccess?: boolean;
}

export interface NewsItem {
  id: string;
  kind: "paper" | "report" | "system" | "standard" | "data" | "event";
  domain: string;
  headline: string;
  dek: string;
  body: string;
  why: string;
  certainty: Certainty;
  sanity?: { check: string; result: "pass" | "fail" | "na"; note: string };
  sources: NewsSource[];
  connects: { moduleId: string; rel: Rel; concept: string; why: string }[];
  textbookUpdate?: { book: string; page: number; edition: number; old: string; now: string; status: "superseded" | "refined" | "confirmed" };
  idea?: { title: string; kind: "project" | "product" | "article" | "interview"; pitch: string; hours: number; uses: string[] };
  read10?: { minutes: number };
  oldButNew?: boolean;
  crossRef?: { app: "eng" | "core"; issueId: string; itemId: string };
}

export interface NewsIssue {
  id: string;
  app: "eng" | "core";
  number: number;
  window: { from: string; to: string };
  publishedAt: number;
  generator?: { sha?: string; runId?: string };
  snapshot?: { current: string | null; done: number; upcoming: string[] };
  lead: string;
  sections: { id: string; title: string; items: string[] }[];
  picks10?: string[];
  items: NewsItem[];
  stats?: { candidates: number; fetched: number; verified: number; dropped?: Record<string, number> };
  example?: boolean;
}

export interface IssueEntry {
  id: string;
  number?: number;
  window?: { from: string; to: string };
  lead?: string;
  count?: number;
}

export interface ItemFb {
  read?: number;
  useful?: -1 | 0 | 1;
  saved?: boolean;
}
export interface NewsFb {
  openedAt?: number;
  items: Record<string, ItemFb>;
}

/** The issues, newest first: from news/_index when it is there, otherwise from the collection itself. */
export async function listIssues(store: Store): Promise<IssueEntry[]> {
  const col = store.sub("news");
  const ix = await col.doc("_index").get();
  const fromIndex = ix.exists ? (ix.data()?.issues as IssueEntry[] | undefined) : undefined;
  let list: IssueEntry[];
  if (Array.isArray(fromIndex) && fromIndex.length) list = fromIndex.filter((e) => e && WEEK_RE.test(String(e.id)));
  else {
    const s = await col.limit(200).get();
    list = s.docs
      .filter((d) => WEEK_RE.test(d.id))
      .map((d) => {
        const v = d.data() as Partial<NewsIssue>;
        return { id: d.id, number: v.number, window: v.window, lead: v.items?.find((i) => i.id === v.lead)?.headline, count: v.items?.length };
      });
  }
  return list.sort((a, b) => (a.id < b.id ? 1 : -1));
}

export async function loadIssue(store: Store, id: string): Promise<NewsIssue | null> {
  const s = await store.sub("news").doc(id).get();
  if (!s.exists) return null;
  const v = s.data() as NewsIssue;
  if (!v || !Array.isArray(v.items)) return null;
  // an issue written by a session: lists are made safe to draw
  const items = v.items.filter((it) => it && it.id && it.headline).map((it) => ({ ...it, body: String(it.body ?? ""), why: String(it.why ?? ""), sources: Array.isArray(it.sources) ? it.sources : [], connects: Array.isArray(it.connects) ? it.connects : [] }));
  const sections = Array.isArray(v.sections) && v.sections.length ? v.sections.map((s) => ({ ...s, items: Array.isArray(s.items) ? s.items : [] })) : [{ id: "all", title: "הגיליון", items: items.map((it) => it.id) }];
  return { ...v, id, items, sections, window: v.window ?? { from: "", to: "" } };
}

export async function loadFb(store: Store, id: string): Promise<NewsFb> {
  const s = await store.sub("newsfb").doc(id).get();
  const v = s.exists ? (s.data() as Partial<NewsFb>) : {};
  return { openedAt: v.openedAt, items: v.items && typeof v.items === "object" ? v.items : {} };
}

export async function saveFb(store: Store, id: string, fb: NewsFb) {
  await store.sub("newsfb").doc(id).set(JSON.parse(JSON.stringify(fb)));
}

/* ---------------- reviews ---------------- */

export type Persona = "senior_engineer" | "domain_expert" | "systems_lead" | "human";

export interface ReviewDomain {
  id: string;
  name: string;
  target: { knowledge?: string; fluency?: string; industry?: string };
  now: { knowledge?: string; fluency?: string; industry?: string };
  /** 0–5 on one scale for the bar: 1 = A1 / junior, 2 = A2 / mid, 3 = A3 / senior, 4 = A4 / expert, 5 = A5 / principal */
  score: number;
  targetScore: number;
  delta?: number;
  evidence: string;
  gap?: string;
  next?: string;
  confidence: "low" | "medium" | "high";
  reviewer?: string;
}

export interface Reviewer {
  id: string;
  persona: Persona;
  title: string;
  focus: string;
  notes: string;
  verdict?: string;
}

export interface WeeklyReview {
  id: string;
  app: "eng" | "core";
  week: { from: string; to: string };
  createdAt: number;
  generator?: { sha?: string; runId?: string };
  summary: string;
  trend?: "up" | "flat" | "down";
  scope?: { lessons: { moduleId: string; lesson: number; title: string }[]; answers: number; notes?: string };
  domains: ReviewDomain[];
  reviewers: Reviewer[];
  calibration?: { predictions: number; brier?: number; confidentWrong: number; overconfident?: number; underconfident?: number; note: string };
  product?: { month: string; title?: string; stage: string; score: number; checklist?: { passed: number; total: number }; notes: string };
  leadDecide?: { score: number; items: { kind: "trade" | "architecture" | "review" | "agents"; title: string; score: number; note: string }[]; note: string };
  actions?: { text: string; domain?: string }[];
  human?: { source: "mentor" | "pr" | "benchmark" | "exam"; title: string; url?: string; note: string }[];
  example?: boolean;
}

export async function listReviews(store: Store): Promise<string[]> {
  const s = await store.sub("reviews").limit(200).get();
  return s.docs
    .map((d) => d.id)
    .filter((id) => WEEK_RE.test(id))
    .sort()
    .reverse();
}

export async function loadReview(store: Store, id: string): Promise<WeeklyReview | null> {
  const s = await store.sub("reviews").doc(id).get();
  if (!s.exists) return null;
  const v = s.data() as WeeklyReview;
  if (!v || !Array.isArray(v.domains)) return null;
  // a report written by a session: numbers and lists are made safe to draw
  const num = (x: unknown) => (Number.isFinite(Number(x)) ? Number(x) : 0);
  return {
    ...v,
    id,
    week: v.week ?? { from: "", to: "" },
    summary: String(v.summary ?? ""),
    domains: v.domains.filter(Boolean).map((d) => ({ ...d, name: String(d.name ?? d.id ?? ""), score: num(d.score), targetScore: num(d.targetScore), delta: d.delta === undefined ? undefined : num(d.delta), now: d.now ?? {}, target: d.target ?? {}, evidence: String(d.evidence ?? "") })),
    reviewers: Array.isArray(v.reviewers) ? v.reviewers.filter(Boolean) : [],
    scope: v.scope && Array.isArray(v.scope.lessons) ? v.scope : undefined,
    calibration: v.calibration ? { ...v.calibration, brier: v.calibration.brier === undefined ? undefined : num(v.calibration.brier), note: String(v.calibration.note ?? "") } : undefined,
    product: v.product ? { ...v.product, score: num(v.product.score), notes: String(v.product.notes ?? "") } : undefined,
    leadDecide: v.leadDecide ? { ...v.leadDecide, score: num(v.leadDecide.score), items: Array.isArray(v.leadDecide.items) ? v.leadDecide.items : [], note: String(v.leadDecide.note ?? "") } : undefined,
  };
}
