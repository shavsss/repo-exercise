// A compact FSRS-4.5 scheduler for the review queue (docs/research/round2/P_retention_practice.md, and its model
// P_retention_model.py, which uses the same equations and default weights). Pure: no DOM, no db, so it is unit
// tested in tools/test/fsrs.test.mjs. Times are epoch ms; intervals are whole days.
//   - target retention 0.90 for every card (P §0.4: 0.95 costs +56%, per-tier targets save only 1%);
//   - the first review comes after at least one night (P §1.2, Latimier 2021);
//   - a lapse is relearned in the same session (successive relearning: one correct retrieval per session, P §1.2);
//   - intervals get a small deterministic fuzz, so cards learned together do not all come back on one day.
// Same file in both labs.

/** FSRS-4.5 default weights */
export const W = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755];
export const RETENTION = 0.9;
const DECAY = -0.5;
const FACTOR = 19 / 81;
export const DAY = 86_400_000;
/** a forgotten card comes back after this, inside the same session */
export const RELEARN_MS = 5 * 60_000;
export const MAX_DAYS = 3650;

/** 1 = forgot (שכחתי), 2 = hard (קשה), 3 = good (טוב), 4 = easy (קל) */
export type Rating = 1 | 2 | 3 | 4;

/** The memory state of one card. reps = 0: a new card, not reviewed yet (due = when it may first be shown). */
export interface Mem {
  /** stability, days: the interval at which recall falls to 90% */
  s: number;
  /** difficulty, 1..10 */
  d: number;
  reps: number;
  lapses: number;
  /** last review */
  last?: number;
  due: number;
  /** forgotten in the current session, comes back in a few minutes */
  relearn?: boolean;
}

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const initS = (g: Rating) => W[g - 1];
const initD = (g: Rating) => clamp(W[4] - (g - 3) * W[5], 1, 10);

/** predicted recall after `days` at stability `s` */
export function retrievability(days: number, s: number) {
  if (s <= 0) return 0;
  return Math.pow(1 + (FACTOR * Math.max(0, days)) / s, DECAY);
}

/** days until recall falls to `r` (at r = 0.9 this equals s), at least 1 */
export function intervalDays(s: number, r = RETENTION) {
  return clamp(Math.round((s / FACTOR) * (Math.pow(r, 1 / DECAY) - 1)), 1, MAX_DAYS);
}

function nextD(d: number, g: Rating) {
  const d2 = d - W[6] * (g - 3);
  return clamp(W[7] * initD(4) + (1 - W[7]) * d2, 1, 10);
}
function successS(s: number, d: number, r: number, g: Rating) {
  const hard = g === 2 ? W[15] : 1;
  const easy = g === 4 ? W[16] : 1;
  return s * (1 + Math.exp(W[8]) * (11 - d) * Math.pow(s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * hard * easy);
}
function failS(s: number, d: number, r: number) {
  return Math.min(s, W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r)));
}

/** local midnight of the day that contains `t` */
export function dayStart(t: number) {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
/** the start of the day `days` local days after the day of `t` (safe across clock changes) */
export function addDays(t: number, days: number) {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.getTime();
}

/** ±5% of the interval from 3 days up, the same for the same card and step */
function fuzz(days: number, seed: string) {
  if (days < 3) return days;
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 0x01000193);
  const u = ((h >>> 0) % 2001) / 1000 - 1; // -1..1
  return clamp(Math.round(days + days * 0.05 * u), 1, MAX_DAYS);
}

/** A new card, first shown from the day after `learnedAt` (at least one night). */
export function newMem(learnedAt: number): Mem {
  return { s: 0, d: 0, reps: 0, lapses: 0, due: addDays(learnedAt, 1) };
}

/** The state after grading the card `g` at `now`. `seed` (the card id) fixes the fuzz. */
export function review(m: Mem, g: Rating, now: number, seed = ""): Mem {
  let { s, d, lapses } = m;
  let relearn = false;
  if (m.reps === 0 || s <= 0) {
    s = initS(g);
    d = initD(g);
    relearn = g === 1;
  } else {
    const elapsed = m.last ? (now - m.last) / DAY : 0;
    const sameDay = m.last !== undefined && dayStart(m.last) === dayStart(now);
    if (m.relearn || sameDay) {
      // a second look the same day: memory hardly moves (FSRS-4.5 has no short-term term); only a new lapse counts
      if (g === 1) {
        relearn = true;
        if (!m.relearn) {
          d = nextD(d, g);
          s = failS(s, d, retrievability(elapsed, s));
          lapses += 1;
        }
      }
    } else {
      const r = retrievability(elapsed, s);
      d = nextD(d, g);
      if (g === 1) {
        s = failS(s, d, r);
        lapses += 1;
        relearn = true;
      } else s = successS(s, d, r, g);
    }
  }
  const days = fuzz(intervalDays(s), `${seed}:${m.reps}`);
  const out: Mem = { s, d, reps: m.reps + 1, lapses, last: now, due: relearn ? now + RELEARN_MS : addDays(now, days) };
  if (relearn) out.relearn = true;
  return out;
}

/** what each grade would do now: the next due time, for the labels under the buttons */
export function preview(m: Mem, now: number, seed = ""): Record<Rating, number> {
  return { 1: review(m, 1, now, seed).due, 2: review(m, 2, now, seed).due, 3: review(m, 3, now, seed).due, 4: review(m, 4, now, seed).due };
}

/** recall now, for ordering: the lowest goes first. A new card counts as 1 (it waits behind the due ones). */
export function recallNow(m: Mem, now: number) {
  if (m.reps === 0 || !m.last) return 1;
  if (m.relearn) return 0;
  return retrievability((now - m.last) / DAY, m.s);
}

/** "בעוד 5 דק'", "מחר", "בעוד 4 ימים", "בעוד חודשיים" */
export function whenLabel(due: number, now: number) {
  const days = Math.round((dayStart(due) - dayStart(now)) / DAY);
  if (days <= 0) return due - now < 3600_000 ? `בעוד ${Math.max(1, Math.round((due - now) / 60_000))} דק'` : "היום";
  if (days === 1) return "מחר";
  if (days === 2) return "מחרתיים";
  if (days < 14) return `בעוד ${days} ימים`;
  if (days < 60) {
    const w = Math.round(days / 7);
    return w === 2 ? "בעוד שבועיים" : `בעוד ${w} שבועות`;
  }
  if (days < 365) {
    const mo = Math.round(days / 30);
    return mo === 2 ? "בעוד חודשיים" : `בעוד ${mo} חודשים`;
  }
  const y = Math.round(days / 365);
  return y === 1 ? "בעוד שנה" : y === 2 ? "בעוד שנתיים" : `בעוד ${y} שנים`;
}
