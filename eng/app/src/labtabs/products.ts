// The month's product (S2_product_track.md §2): one document per month at
// profile/products/<YYYY-MM>, written by the learner from the products tab.
// Fields are only ever added; an older document opens with the missing parts empty.
import type { Store } from "../runtime";
import { CHECK_KINDS, GITHUB_CHECKLIST } from "./config";
import { MONTH_RE } from "./data";

export type StageId = "idea" | "legal" | "spec" | "design" | "verify" | "package" | "retro";

export const STAGES: { id: StageId; label: string; sub: string }[] = [
  { id: "idea", label: "רעיון", sub: "שאלה, למי זה, ובמה זה טוב יותר ממה שקיים" },
  { id: "legal", label: "בדיקת חוקיות", sub: "לפני שהרעיון ממשיך: ספקטרום, יצוא, צנזורה ורישיונות" },
  { id: "spec", label: "מפרט ושוק", sub: "מפרט קצר, 3–5 מתחרים או baselines, והבנצ'מרק שמולו נמדדים" },
  { id: "design", label: "תכן ותחזיות", sub: "ההחלטות והפשרות, ותחזית מספרית לכל תוצאה מרכזית" },
  { id: "verify", label: "תוכנית אימות", sub: "כל תוצאה מרכזית עוברת לפחות שתי בדיקות בלתי תלויות" },
  { id: "package", label: "אריזה", sub: "מול רשימת הבדיקה של הפרויקטים הטובים ב-GitHub" },
  { id: "retro", label: "סיכום", sub: "מה עבד, מה נכשל ולמה, ומה ממשיך" },
];

export type LegalAnswer = "" | "na" | "ok" | "adjust" | "ask";
export const LEGAL_ANSWERS: { id: Exclude<LegalAnswer, "">; label: string }[] = [
  { id: "na", label: "לא נוגע" },
  { id: "ok", label: "בסדר כמו שהוא" },
  { id: "adjust", label: "בסדר עם התאמה" },
  { id: "ask", label: "לברר קודם" },
];

export type Competitor = {
  name: string;
  url: string;
  note: string;
}
export type Prediction = {
  quantity: string;
  value: string;
  basis: string;
  actual: string;
}
export type Check = {
  result: string;
  kind: string;
  how: string;
  pass: string;
  status: "" | "planned" | "passed" | "failed";
}

export interface Product {
  month: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  idea: { question: string; forWhom: string; better: string; fromLessons: string };
  legal: { answers: Record<string, LegalAnswer>; notes: Record<string, string>; adjustments: string; doneAt: number | null };
  spec: { spec: string; competitors: Competitor[]; benchmark: string; price: string };
  design: { decisions: string; tradeoffs: string; predictions: Prediction[] };
  verify: { checks: Check[]; baseline: string };
  package: { checklist: Record<string, boolean>; comparables: Competitor[]; repo: string };
  retro: { worked: string; failed: string; learned: string; next: "" | "users" | "v2" | "sale" | "close" };
  critiques: Partial<Record<StageId, { text: string; at: number }>>;
}

export function emptyProduct(month: string): Product {
  const now = Date.now();
  return {
    month,
    title: "",
    createdAt: now,
    updatedAt: now,
    idea: { question: "", forWhom: "", better: "", fromLessons: "" },
    legal: { answers: {}, notes: {}, adjustments: "", doneAt: null },
    spec: { spec: "", competitors: [], benchmark: "", price: "" },
    design: { decisions: "", tradeoffs: "", predictions: [] },
    verify: { checks: [], baseline: "" },
    package: { checklist: {}, comparables: [], repo: "" },
    retro: { worked: "", failed: "", learned: "", next: "" },
    critiques: {},
  };
}

/** An older or partial document, completed with empty fields (never drops what is there). */
export function normalize(month: string, raw: Partial<Product> | undefined): Product {
  const e = emptyProduct(month);
  if (!raw) return e;
  const merged = { ...e, ...raw } as Product;
  for (const k of ["idea", "legal", "spec", "design", "verify", "package", "retro"] as const) merged[k] = { ...e[k], ...(raw[k] ?? {}) } as never;
  merged.critiques = { ...(raw.critiques ?? {}) };
  merged.month = month;
  return merged;
}

/** The legal check is done when every question has an answer, none waits for an authority, and it was signed off. */
export function legalState<Q extends { id: string }>(p: Product, questions: Q[]) {
  const answered = questions.filter((q) => p.legal.answers[q.id]).length;
  const asking = questions.filter((q) => p.legal.answers[q.id] === "ask");
  const adjusting = questions.filter((q) => p.legal.answers[q.id] === "adjust");
  const ready = answered === questions.length && !asking.length && (!adjusting.length || !!p.legal.adjustments.trim());
  return { answered, total: questions.length, asking, adjusting, ready, done: ready && !!p.legal.doneAt };
}

export function independentChecks(p: Product) {
  return new Set(p.verify.checks.filter((c) => c.kind && c.result.trim()).map((c) => c.kind)).size;
}

/** How far each stage is, for the stage rail (0–1). */
export function stageProgress(p: Product, questions: { id: string }[]): Record<StageId, number> {
  const filled = (...v: string[]) => v.filter((x) => x.trim()).length / v.length;
  const l = legalState(p, questions);
  return {
    idea: filled(p.idea.question, p.idea.forWhom, p.idea.better),
    legal: l.done ? 1 : (l.answered / l.total) * 0.9,
    spec: (filled(p.spec.spec, p.spec.benchmark) + Math.min(1, p.spec.competitors.filter((c) => c.name.trim()).length / 3)) / 2,
    design: (filled(p.design.decisions, p.design.tradeoffs) + Math.min(1, p.design.predictions.filter((x) => x.quantity.trim() && x.value.trim()).length / 2)) / 2,
    verify: Math.min(1, independentChecks(p) / 2),
    package: GITHUB_CHECKLIST.filter((c) => p.package.checklist[c.id]).length / GITHUB_CHECKLIST.length,
    retro: filled(p.retro.worked, p.retro.failed, p.retro.learned),
  };
}

export async function listProducts(store: Store): Promise<{ month: string; title: string }[]> {
  const s = await store.sub("products").limit(120).get();
  return s.docs
    .filter((d) => MONTH_RE.test(d.id))
    .map((d) => ({ month: d.id, title: String((d.data() as Partial<Product>)?.title ?? "") }))
    .sort((a, b) => (a.month < b.month ? 1 : -1));
}

export async function loadProduct(store: Store, month: string): Promise<Product | null> {
  const s = await store.sub("products").doc(month).get();
  return s.exists ? normalize(month, s.data() as Partial<Product>) : null;
}

export async function saveProduct(store: Store, p: Product) {
  await store.sub("products").doc(p.month).set(JSON.parse(JSON.stringify({ ...p, updatedAt: Date.now() })));
}

/** The stage as plain text, for the critique request. */
export function stageText(p: Product, stage: StageId, legal: { id: string; q: string }[]): string {
  const kind = (id: string) => CHECK_KINDS.find((k) => k.id === id)?.label ?? id;
  const line = (label: string, v: string) => (v.trim() ? `${label}: ${v.trim()}` : `${label}: (ריק)`);
  switch (stage) {
    case "idea":
      return [line("השאלה", p.idea.question), line("למי", p.idea.forWhom), line("במה טוב יותר ממה שקיים", p.idea.better), line("מה מהשיעורים של החודש", p.idea.fromLessons)].join("\n");
    case "legal":
      return [
        ...legal.map((q) => `- ${q.q} → ${LEGAL_ANSWERS.find((a) => a.id === p.legal.answers[q.id])?.label ?? "(לא נענה)"}${p.legal.notes[q.id]?.trim() ? ` (${p.legal.notes[q.id].trim()})` : ""}`),
        line("ההתאמות", p.legal.adjustments),
      ].join("\n");
    case "spec":
      return [line("המפרט", p.spec.spec), "מתחרים ו-baselines:", ...p.spec.competitors.map((c) => `- ${c.name} ${c.url} ${c.note}`), line("הבנצ'מרק", p.spec.benchmark), line("השערת מחיר", p.spec.price)].join("\n");
    case "design":
      return [line("ההחלטות", p.design.decisions), line("הפשרות", p.design.tradeoffs), "תחזיות:", ...p.design.predictions.map((x) => `- ${x.quantity}: ${x.value} (בסיס: ${x.basis || "-"})${x.actual ? `; בפועל: ${x.actual}` : ""}`)].join("\n");
    case "verify":
      return [line("ה-baseline", p.verify.baseline), "בדיקות:", ...p.verify.checks.map((c) => `- ${c.result} · ${kind(c.kind)} · איך: ${c.how} · עובר אם: ${c.pass}`)].join("\n");
    case "package":
      return [
        ...GITHUB_CHECKLIST.map((c) => `- [${p.package.checklist[c.id] ? "x" : " "}] ${c.label}`),
        line("המאגר", p.package.repo),
        "פרויקטים מובילים להשוואה:",
        ...p.package.comparables.map((c) => `- ${c.name} ${c.url} ${c.note}`),
      ].join("\n");
    case "retro":
      return [line("מה עבד", p.retro.worked), line("מה נכשל ולמה", p.retro.failed), line("מה לוקחים לחודש הבא", p.retro.learned), line("ממשיך כ", p.retro.next)].join("\n");
  }
}
