// The documents behind the three tabs beside the lessons. Every path is under
// data/users/<id>/profile/ and only ever added to (docs/NEWS_SCHEMA.md, docs/REVIEW_SCHEMA.md):
//   news/<YYYY-Www>       a weekly issue, written by the scheduled news session (read here)
//   news/_index           the list of issues, newest first (optional; the collection is listed when absent)
//   newstext/<YYYY-Www>__t<k>   the full texts of the issue's stories, packed under 200 KB a document (optional)
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

/** "6.11–12.11" kept in reading order inside RTL text (an isolated left-to-right run). */
export function dateRange(from: string | number | undefined, to: string | number | undefined) {
  return `\u2066${shortDate(from)}–${shortDate(to)}\u2069`;
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
  /** the source's licence as its page states it; a full translation (full: "translation") needs an open one */
  license?: string;
  /** a state-run outlet (Xinhua, TRT, RT, IRNA…): tagged, and the item carries a second, independent source */
  stateMedia?: boolean;
}

/** Where a story comes from (docs/NEWS_SCHEMA.md): the regions of the learner's list. */
export type Region = "US" | "EU" | "UK" | "IL" | "TR" | "CN" | "TW" | "JP" | "KR" | "IN" | "RU" | "UA" | "GULF" | "IR" | "AF" | "INTL";
/** Where an item sits in the printed edition. Absent (old issues): a story in its section. */
export type NewsRole = "lead" | "feature" | "brief" | "number" | "world" | "geo" | "econ" | "post" | "lab" | "globe";
/** How the full text renders the source: a whole translation (open licence), a walk through the source idea by idea in its
 * order (a paper or report), or a full report of every central point in the source's order (a news article). */
export type FullMode = "translation" | "walkthrough" | "report";

/** A freely licensed picture of the subject, kept in the artifact's asset store ("/_blob/<id>"); never inline in the issue. */
export interface NewsImage {
  url: string;
  caption: string;
  credit: string;
  license: string;
  sourcePage: string;
  alt?: string;
}

/** A chart drawn from numbers in a fetched source (inline SVG on the page). */
export interface NewsChart {
  kind: "bar" | "line";
  title: string;
  unit: string;
  /** the categories (bar) or the x values (line), in order */
  x: (string | number)[];
  series: { name: string; values: (number | null)[] }[];
  source: { publisher: string; url: string; note?: string };
}

/** A social post quoted word for word from a page fetched this run. */
export interface NewsPost {
  network: "x" | "bluesky" | "mastodon";
  handle: string;
  author: string;
  text: string;
  url: string;
  postedAt?: string;
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
  role?: NewsRole;
  region?: Region;
  images?: NewsImage[];
  chart?: NewsChart;
  post?: NewsPost;
  number?: { value: string; unit: string; calc: string };
  /** two takes on one topic from two countries: both items carry the same topic, each names the other */
  world?: { topic: string; pair: string };
  /** the story has a full text in newstext/<issue>__t<fullPart>; body is then the opening shown on the front page */
  full?: FullMode;
  fullPart?: number;
}

export interface NewsFull {
  body: string;
  mode: FullMode;
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
  /** e.g. "מהדורת סוף שבוע" */
  edition?: string;
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
  const items = v.items
    .filter((it) => it && it.id && it.headline)
    .map((it) => ({
      ...it,
      body: String(it.body ?? ""),
      why: String(it.why ?? ""),
      sources: Array.isArray(it.sources) ? it.sources : [],
      connects: Array.isArray(it.connects) ? it.connects : [],
      images: Array.isArray(it.images) ? it.images.filter((im) => im && typeof im.url === "string" && imageUrlOk(im.url)) : undefined,
      chart: chartOk(it.chart) ? it.chart : undefined,
      post: it.post && typeof it.post.text === "string" ? it.post : undefined,
      full: FULL_MODES.includes(it.full as FullMode) ? it.full : undefined,
      fullPart: Number.isInteger(it.fullPart) && (it.fullPart as number) >= 0 ? it.fullPart : 0,
    }));
  const sections = Array.isArray(v.sections) && v.sections.length ? v.sections.map((s) => ({ ...s, items: Array.isArray(s.items) ? s.items : [] })) : [{ id: "all", title: "הגיליון", items: items.map((it) => it.id) }];
  return { ...v, id, items, sections, window: v.window ?? { from: "", to: "" } };
}

/** Only pictures the page can show under the Artifact's rules: the asset store, the artifact's own files, or a small data URI. */
export function imageUrlOk(url: string) {
  return url.startsWith("/_blob/") || url.startsWith("data:image/") || /^[\w-]+\/[\w./-]+$/.test(url);
}

function chartOk(c: NewsChart | undefined): c is NewsChart {
  return !!c && (c.kind === "bar" || c.kind === "line") && Array.isArray(c.x) && c.x.length > 0 && Array.isArray(c.series) && c.series.length > 0 && c.series.every((s) => Array.isArray(s?.values));
}

const FULL_MODES: FullMode[] = ["translation", "walkthrough", "report"];

/** The full text of one story, or null when it has none (an older issue, or a write that did not land). The texts of
 * an issue are packed a few to a document (newstext/<issue>__t<k>, { items: { <item id>: NewsFull } }), so a year of
 * issues stays a few hundred documents of the database's 25,000. */
export async function loadFull(store: Store, issueId: string, itemId: string, part = 0): Promise<NewsFull | null> {
  const s = await store.sub("newstext").doc(`${issueId}__t${part}`).get();
  if (!s.exists) return null;
  const v = (s.data() as { items?: Record<string, Partial<NewsFull>> })?.items?.[itemId];
  if (typeof v?.body !== "string" || !v.body.trim()) return null;
  return { body: v.body, mode: FULL_MODES.includes(v.mode as FullMode) ? (v.mode as FullMode) : "report" };
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
