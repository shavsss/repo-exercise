// Hebrew spelling and word completion for the summaries notebook, from the dictionary file built by
// tools/dict/build_dict.py (a word-frequency list of Hebrew plus the course's own vocabulary, one word
// a line, front-coded). Words carry their attached prefixes (ו, ה, ב, ל, מ, ש, כ), so a word is known
// when it is in the list as is, or when what follows up to three prefix letters is. Identical in both labs.

const B36 = "0123456789abcdefghijklmnopqrstuvwxyz";
const LETTERS = "אבגדהוזחטיכלמנסעפצקרשתךםןףץ";
const PREFIX = "והבלמשכ";
const FINAL: Record<string, string> = { כ: "ך", מ: "ם", נ: "ן", פ: "ף", צ: "ץ" };
const UNFINAL: Record<string, string> = { ך: "כ", ם: "מ", ן: "נ", ף: "פ", ץ: "צ" };
/** letters people swap by sound or by a neighbouring key */
const NEAR = ["טת", "כח", "קכ", "אע", "סש", "וי", "בו", "תט", "הא", "דר", "ךכ", "םמ", "ןנ", "ףפ", "ץצ", "ןו", "ךל"];
const isNear = (a: string, b: string) => NEAR.some((p) => (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a));

export const HEB_WORD = /[א-ת]+(?:["'׳״][א-ת]+)?/g;

export interface Dict {
  words: string[];
  band: Uint8Array;
  index: Map<string, number>;
}

let loading: Promise<Dict | null> | null = null;

/** The dictionary, fetched once (about 2.5MB) when the notebook first needs it. */
export function loadDict(): Promise<Dict | null> {
  loading ??= fetch("dict/he.txt")
    .then((r) => (r.ok ? r.text() : null))
    .then((text) => {
      if (!text) return null;
      const lines = text.split("\n");
      const words: string[] = [];
      const band = new Uint8Array(lines.length);
      let prev = "";
      for (const line of lines) {
        if (line.length < 2) continue;
        const k = B36.indexOf(line[0]);
        const w = prev.slice(0, k) + line.slice(1, -1);
        band[words.length] = line.charCodeAt(line.length - 1) - 97;
        words.push(w);
        prev = w;
      }
      const index = new Map<string, number>();
      words.forEach((w, i) => index.set(w, i));
      return { words, band: band.slice(0, words.length), index };
    })
    .catch(() => null);
  return loading;
}

export const normalize = (w: string) => w.replace(/[֑-ׇ]/g, "").replace(/״/g, '"').replace(/׳/g, "'");

/** Ways to read a word as prefix letters + a word: [prefix, rest], the whole word first. */
function splits(w: string): [string, string][] {
  const out: [string, string][] = [["", w]];
  for (let i = 1; i <= 3 && i <= w.length - 2; i++) {
    if (!PREFIX.includes(w[i - 1])) break;
    out.push([w.slice(0, i), w.slice(i)]);
  }
  return out;
}

export class Speller {
  constructor(
    private d: Dict,
    public mine: Set<string>,
  ) {}

  private has(w: string) {
    return this.d.index.has(w) || this.mine.has(w);
  }

  private bandOf(w: string) {
    const i = this.d.index.get(w);
    return i === undefined ? (this.mine.has(w) ? 7 : -1) : this.d.band[i];
  }

  known(raw: string): boolean {
    const w = normalize(raw);
    if (w.length < 2 || /["']/.test(w)) return true; // abbreviations and acronyms are left alone
    // a final letter only at the end
    if (/[ךםןףץ]./.test(w)) return false;
    return splits(w).some(([, rest]) => this.has(rest));
  }

  /** How common the word is, through its prefixes (−1 when unknown). */
  private score(w: string) {
    let best = -1;
    for (const [p, rest] of splits(w)) {
      const b = this.bandOf(rest);
      if (b >= 0) best = Math.max(best, b - p.length * 2.5);
    }
    return best;
  }

  private edits(w: string): Set<string> {
    const out = new Set<string>();
    for (let i = 0; i <= w.length; i++) {
      const a = w.slice(0, i);
      const b = w.slice(i);
      if (b) out.add(a + b.slice(1)); // delete
      if (b.length > 1) out.add(a + b[1] + b[0] + b.slice(2)); // swap
      for (const c of LETTERS) {
        if (b) out.add(a + c + b.slice(1)); // replace
        out.add(a + c + b); // insert
      }
    }
    out.delete(w);
    return out;
  }

  /** Up to five corrections, the likeliest first. */
  suggest(raw: string): string[] {
    const w = normalize(raw);
    const ranked = new Map<string, number>();
    const consider = (c: string, dist: number) => {
      if (/[ךםןףץ]./.test(c) || ranked.has(c)) return;
      const s = this.score(c);
      if (s < 0) return;
      let bonus = 0;
      if (c.length === w.length) {
        const diff = [...c].map((ch, i) => [ch, w[i]]).filter(([x, y]) => x !== y);
        if (diff.length === 1 && isNear(diff[0][0], diff[0][1])) bonus = 1.5;
      }
      ranked.set(c, s + bonus - dist * 6);
    };
    // a wrong final form first: מלכ → מלך, מןשל → מנשל
    const fixed = w.replace(/[ךםןףץ](?=.)/g, (ch) => UNFINAL[ch]).replace(/[כמנפצ]$/, (ch) => FINAL[ch]);
    if (fixed !== w) consider(fixed, 0);
    const one = this.edits(w);
    for (const c of one) consider(c, 1);
    if (ranked.size < 3 && w.length > 3) for (const c of one) for (const c2 of this.edits(c)) if (c2.length >= w.length - 2) consider(c2, 2);
    return [...ranked.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([c]) => c);
  }

  /** Completions for a word being typed, the likeliest first; `seen` are the words already on the page. */
  complete(raw: string, seen: Map<string, number>): string[] {
    const w = normalize(raw);
    if (w.length < 2 || /["']/.test(w)) return [];
    const ranked = new Map<string, number>();
    for (const [p, rest] of splits(w)) {
      if (rest.length < 2) continue;
      const words = this.d.words;
      let lo = 0;
      let hi = words.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (words[mid] < rest) lo = mid + 1;
        else hi = mid;
      }
      for (let i = lo, n = 0; i < words.length && n < 6000 && words[i].startsWith(rest); i++, n++) {
        const c = words[i];
        if (c.length < rest.length + 2) continue;
        const s = this.d.band[i] + (seen.get(p + c) ?? 0) * 3 - p.length * 1.5 - (c.length - rest.length) * 0.15;
        if (this.d.band[i] >= 3 || seen.has(p + c)) ranked.set(p + c, Math.max(ranked.get(p + c) ?? -99, s));
      }
    }
    for (const m of this.mine) if (m.startsWith(w) && m.length >= w.length + 2) ranked.set(m, Math.max(ranked.get(m) ?? -99, 8));
    return [...ranked.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([c]) => c);
  }
}
