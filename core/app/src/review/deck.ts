// The review deck in the db, and keeping it in step with what he read. Bounded and additive (the db holds at most
// 25,000 documents per artifact):
//   profile/review/<module id>       { moduleId, cards: Card[] }: the module's cards with their scheduling state
//   profile/review/<module id>~<n>   the same module's further cards, only when one document would pass ~180 KB
//   profile/review/_state            { count: the day's counters, scanned: conv id → updatedAt, calib: id → stamp }
// Reads the lessons (convs), the notebook (notes) and the calibration records (events.ts) and never writes them.
// The deck is shared by the review tab and the morning card in this view. Same file in both labs.
import type { Store } from "../runtime";
import type { LessonNote, ModuleProgress, StoredMessage } from "../types";
import { allCalib, thinkId, type CalibRecord } from "../events";
import { review as schedule, type Rating } from "./fsrs";
import { buildQueue, makeCard, measured, noteSeed, seedsFromLesson, thinkSeed, thinksFromLesson, todayKey, type Card, type DayCount, type Queue, type Seed } from "./cards";

interface State {
  count: DayCount;
  scanned: Record<string, number>;
  calib: Record<string, number>;
}
export interface Deck {
  cards: Map<string, Card>;
  state: State;
}

const SHARD_CHARS = 180_000;
/** lessons read per sync at most (the first sync of a long course goes on in the next ones) */
const CONVS_PER_SYNC = 60;
const docId = (moduleId: string) => moduleId.replace(/\//g, "_");

let store: Store | null = null;
let deck: Deck | null = null;
let syncing: Promise<Deck> | null = null;
/** shards each module had when loaded, so a shorter module clears the ones it no longer uses */
const shards = new Map<string, number>();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
export function onDeck(fn: () => void) {
  listeners.add(fn);
  return () => void listeners.delete(fn);
}

const freshCount = (now: number): DayCount => ({ day: todayKey(now), sec: 0, done: 0, fresh: 0 });
function today(s: State, now = Date.now()) {
  if (s.count?.day !== todayKey(now)) s.count = freshCount(now);
  return s.count;
}

async function load(st: Store): Promise<Deck> {
  const snap = await st.sub("review").limit(2000).get();
  const cards = new Map<string, Card>();
  let state: State = { count: freshCount(Date.now()), scanned: {}, calib: {} };
  shards.clear();
  for (const d of snap.docs) {
    const data = d.data() ?? {};
    if (d.id === "_state") {
      state = { count: data.count ?? freshCount(Date.now()), scanned: data.scanned ?? {}, calib: data.calib ?? {} };
      continue;
    }
    const mid = String(data.moduleId ?? d.id.replace(/~\d+$/, ""));
    shards.set(mid, Math.max(shards.get(mid) ?? 0, (Number(/~(\d+)$/.exec(d.id)?.[1] ?? 0) || 0) + 1));
    for (const c of (data.cards ?? []) as Card[]) if (c?.id) cards.set(c.id, c);
  }
  return { cards, state };
}

async function saveModules(st: Store, d: Deck, moduleIds: Iterable<string>) {
  const col = st.sub("review");
  for (const mid of new Set(moduleIds)) {
    const list = [...d.cards.values()].filter((c) => c.moduleId === mid);
    const parts: Card[][] = [[]];
    let size = 0;
    for (const c of list) {
      const n = JSON.stringify(c).length;
      if (size + n > SHARD_CHARS && parts.at(-1)!.length) {
        parts.push([]);
        size = 0;
      }
      parts.at(-1)!.push(c);
      size += n;
    }
    const before = shards.get(mid) ?? 0;
    for (let i = 0; i < Math.max(parts.length, before); i++) {
      const id = docId(mid) + (i ? `~${i}` : "");
      await col.doc(id).set(JSON.parse(JSON.stringify({ moduleId: mid, cards: parts[i] ?? [], updatedAt: Date.now() })));
    }
    shards.set(mid, parts.length);
  }
}

async function saveState(st: Store, d: Deck) {
  await st.sub("review").doc("_state").set(JSON.parse(JSON.stringify({ ...d.state, updatedAt: Date.now() })));
}

interface ConvRow {
  id: string;
  moduleId: string;
  lesson: number;
  updatedAt: number;
}

function label(moduleId: string, lesson: number, mods: Record<string, ModuleProgress>) {
  const t = mods[moduleId]?.lessons?.[lesson]?.title;
  return `${moduleId} · שיעור ${lesson + 1}${t ? `: ${t}` : ""}`;
}

/** The lesson's text he can be asked about, and when he read it; null for a lesson written ahead and not opened yet. */
async function lessonText(st: Store, convId: string): Promise<{ text: string; at: number } | null> {
  const msgs = (await st.loadMessages(convId)) as (StoredMessage & { prefetched?: boolean; prefetchSeen?: number })[];
  if (msgs.some((m) => m.prefetched && !m.prefetchSeen)) return null;
  const own = msgs.filter((m) => m.role === "assistant" && m.text);
  if (!own.length) return null;
  return { text: own.map((m) => m.text).join("\n\n"), at: Math.max(...own.map((m) => m.ts || 0)) || Date.now() };
}

const flagged = (r: CalibRecord) => r.grade === "wrong" || r.grade === "partial" || r.conf === 1;

/** Adds the cards of lessons read since the last sync, of think questions he missed, and of his margin notes. */
async function sync(st: Store, d: Deck, modsIn?: Record<string, ModuleProgress>) {
  const dirty = new Set<string>();
  let stateDirty = false;
  const mods: Record<string, ModuleProgress> =
    modsIn && Object.keys(modsIn).length ? modsIn : Object.fromEntries((await st.sub("modules").limit(500).get()).docs.map((x) => [x.id, x.data() as ModuleProgress]));
  const convs: ConvRow[] = (await st.sub("convs").orderBy("updatedAt", "desc").limit(500).get()).docs
    .map((x) => ({ id: x.id, ...(x.data() as Omit<ConvRow, "id">) }))
    .filter((c) => typeof c.lesson === "number" && c.lesson >= 0 && c.moduleId);
  const texts = new Map<string, { text: string; at: number } | null>();
  const textOf = async (id: string) => {
    if (!texts.has(id)) texts.set(id, await lessonText(st, id).catch(() => null));
    return texts.get(id)!;
  };
  const put = (seed: Seed, o: { moduleId: string; lesson: number; conv?: string; learnedAt: number }) => {
    if (d.cards.has(seed.id)) return;
    d.cards.set(seed.id, makeCard(seed, { ...o, src: label(o.moduleId, o.lesson, mods) }));
    dirty.add(o.moduleId);
  };

  // 1. lessons: oldest changes first, so the first sync of a long course seeds in reading order
  const changed = convs.filter((c) => d.state.scanned[c.id] !== c.updatedAt).reverse().slice(0, CONVS_PER_SYNC);
  for (const c of changed) {
    const t = await textOf(c.id);
    if (!t) continue; // not read yet: looked at again next time
    const seeds = seedsFromLesson(t.text, { moduleId: c.moduleId, lesson: c.lesson, title: mods[c.moduleId]?.lessons?.[c.lesson]?.title });
    const ids = new Set(seeds.map((s) => s.id));
    // a card of this lesson that was never reviewed and is no longer in its text (the lesson was rewritten) goes
    for (const [id, card] of d.cards)
      if (card.conv === c.id && card.reps === 0 && !ids.has(id) && card.kind !== "think" && card.kind !== "note") {
        d.cards.delete(id);
        dirty.add(card.moduleId);
      }
    for (const s of seeds) put(s, { moduleId: c.moduleId, lesson: c.lesson, conv: c.id, learnedAt: t.at });
    d.state.scanned[c.id] = c.updatedAt;
    stateDirty = true;
  }

  // 2. think questions he got wrong, partly, or guessed: matched to their block by the same id the lesson uses
  const calib = await allCalib().catch(() => [] as CalibRecord[]);
  for (const r of calib) {
    if (!r?.id || !flagged(r)) continue;
    const stamp = r.gradedAt ?? r.ts ?? 0;
    if (d.state.calib[r.id] === stamp || d.cards.has(thinkSeed("", "", r.id).id)) continue;
    d.state.calib[r.id] = stamp;
    stateDirty = true;
    for (const c of convs.filter((x) => x.moduleId === r.moduleId && x.lesson === r.lesson)) {
      const t = await textOf(c.id);
      const hit = t && thinksFromLesson(t.text).find((q) => thinkId({ moduleId: c.moduleId, lesson: c.lesson, title: "" }, q.q) === r.id);
      if (hit) {
        put(thinkSeed(hit.q, hit.a, r.id), { moduleId: c.moduleId, lesson: c.lesson, conv: c.id, learnedAt: r.gradedAt ?? r.ts ?? Date.now() });
        break;
      }
    }
  }

  // 3. his own margin notes ("הערה", "להעמקה") that sit beside a quote
  const notes = (await st.sub("notes").limit(1000).get().catch(() => ({ docs: [] }))).docs.map((x) => ({ ...(x.data() as LessonNote), id: x.id }));
  for (const n of notes) {
    if (n.who !== "learner" || (n.kind !== "note" && n.kind !== "deepen") || n.lesson < 0) continue;
    const s = noteSeed({ id: n.id!, text: n.text ?? "", anchor: n.anchor });
    if (s) put(s, { moduleId: n.moduleId, lesson: n.lesson, learnedAt: n.ts || Date.now() });
  }

  if (dirty.size) await saveModules(st, d, dirty);
  if (stateDirty) await saveState(st, d);
  return dirty.size > 0;
}

/** The deck, loaded once per view and synced with the lessons; concurrent callers share one load. */
export function getDeck(st: Store, mods?: Record<string, ModuleProgress>, resync = false): Promise<Deck> {
  if (store !== st) {
    store = st;
    deck = null;
    syncing = null;
  }
  if (syncing) return syncing;
  if (deck && !resync) return Promise.resolve(deck);
  syncing = (async () => {
    const d = deck ?? (await load(st));
    deck = d;
    try {
      if (await sync(st, d, mods)) emit();
    } catch {
      // the cards already there still work; the next open tries again
    }
    return d;
  })().finally(() => {
    syncing = null;
  });
  return syncing;
}

export function queueOf(d: Deck, now = Date.now()): Queue {
  return buildQueue([...d.cards.values()], today(d.state, now), now);
}

/** Grades one card, counts its time against the day, and saves the module's document and the day's counters. */
export async function gradeCard(st: Store, d: Deck, id: string, g: Rating, sec: number) {
  const c = d.cards.get(id);
  if (!c) return null;
  const now = Date.now();
  const count = today(d.state, now);
  const wasNew = c.reps === 0;
  const next: Card = { ...c, ...schedule(c, g, now, c.id), sec: measured(c, sec) };
  if (!next.relearn) delete next.relearn;
  d.cards.set(id, next);
  count.sec += Math.min(240, Math.max(4, sec));
  count.done += 1;
  if (wasNew) count.fresh += 1;
  emit();
  await Promise.all([saveModules(st, d, [c.moduleId]), saveState(st, d)]).catch(() => {});
  return next;
}

/** Changes a card without scheduling it (taken out of the review, or a question the quick model wrote). */
export async function patchCard(st: Store, d: Deck, id: string, patch: Partial<Card>) {
  const c = d.cards.get(id);
  if (!c) return;
  d.cards.set(id, { ...c, ...patch });
  emit();
  await saveModules(st, d, [c.moduleId]).catch(() => {});
}

/** "עוד כמה בכל זאת": a few more minutes today, past the budget (N8: the app never locks). */
export async function addMinutes(st: Store, d: Deck, min: number) {
  const count = today(d.state);
  count.extra = (count.extra ?? 0) + min * 60;
  emit();
  await saveState(st, d).catch(() => {});
}
