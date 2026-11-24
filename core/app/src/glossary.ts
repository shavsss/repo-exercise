// The glossary (24.11, the learner's choice): every term a lesson defines in a definition block, kept per lesson in
// profile/glossary/<module>__<lesson> once the lesson is written, so a term from an earlier lesson opens in a small
// window where a later lesson uses it, without leaving the text, and the side column lists them all. Here: the
// terms of a lesson's Markdown, and the matcher that finds them in running Hebrew (with its prefixes). The window
// and the list are in components/Glossary.tsx. Identical in both labs.

export interface GlossTerm {
  /** the term as the text uses it: the title without its parenthesis ("תנע (momentum)" → "תנע") */
  term: string;
  /** other names the title gives in its parenthesis, when they are words of another script ("momentum") */
  aliases: string[];
  /** the block's full title */
  title: string;
  /** the definition's Markdown */
  body: string;
  /** the writer's mark: a working tool for the summary, or an aid to one development */
  mark?: "summary" | "aid";
  /** the subsection it is defined in */
  section?: string;
  moduleId: string;
  lesson: number;
}

/** One lesson's terms, as kept in profile/glossary. */
export interface GlossDoc {
  moduleId: string;
  lesson: number;
  /** the lesson's title */
  title?: string;
  terms: GlossTerm[];
  /** a hash of the terms, so an unchanged lesson is not written again */
  sig: string;
  at: number;
}

const plain = (s: string) => s.replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();

/** "כוח (החוק השני של ניוטון)" → "כוח"; "רדיוס בוהר: a₀" → "רדיוס בוהר" */
export function termOf(title: string): { term: string; aliases: string[] } {
  const t = plain(title);
  const paren = /\(([^)]*)\)/.exec(t)?.[1]?.trim() ?? "";
  const term = t
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .split(/[:–—,;]/)[0]
    .replace(/\$[^$]*\$/g, "")
    .trim();
  const aliases = paren && !/[֐-׿]/.test(paren) && /^[A-Za-z][A-Za-z\s-]{2,40}$/.test(paren) ? [paren] : [];
  return { term, aliases };
}

/** The terms a lesson defines, in order. A title with no usable term (math only, one letter) is left out. */
export function termsOf(md: string, moduleId: string, lesson: number): GlossTerm[] {
  const out: GlossTerm[] = [];
  const seen = new Set<string>();
  let section: string | undefined;
  for (const m of md.matchAll(/^(#{2,3})\s+(.+)$|^```definition[ \t]*\n([\s\S]*?)^```/gm)) {
    if (m[1]) {
      section = plain(m[2]).replace(/\$/g, "");
      continue;
    }
    const lines = m[3].split("\n");
    const head: Record<string, string> = {};
    let i = 0;
    for (; i < lines.length; i++) {
      const h = /^@(\w+):\s*(.*)$/.exec(lines[i].trim());
      if (!h) break;
      head[h[1]] = h[2];
    }
    const title = (head.title ?? "").trim();
    if (!title) continue;
    const { term, aliases } = termOf(title);
    if ([...term].length < 2 || seen.has(term)) continue;
    seen.add(term);
    const mark = head.mark === "summary" || head.mark === "aid" ? head.mark : undefined;
    out.push({ term, aliases, title: plain(title), body: lines.slice(i).join("\n").trim(), mark, section, moduleId, lesson });
  }
  return out;
}

/** A small stable signature of a lesson's terms. */
export function sigOf(terms: GlossTerm[]) {
  const s = JSON.stringify(terms.map((t) => [t.title, t.body, t.mark, t.section]));
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return (h >>> 0).toString(36);
}

/** The one-letter prefixes Hebrew joins to a word (ו, ה, ב, כ, ל, מ, ש), up to four of them: "וכשהכוח". */
const PREFIX = "[והבכלמש]{0,4}";
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * A matcher for a set of terms in running text: the longest name first, whole words only (a term is not found
 * inside a longer word), Hebrew prefixes allowed. `find` gives each match's place and its term.
 */
export function matcher(terms: GlossTerm[]) {
  const names = new Map<string, GlossTerm>();
  for (const t of terms) for (const n of [t.term, ...t.aliases]) if (!names.has(n.toLowerCase())) names.set(n.toLowerCase(), t);
  const list = [...names.keys()].sort((a, b) => b.length - a.length);
  if (!list.length) return { find: () => [] as { at: number; len: number; term: GlossTerm }[] };
  const re = new RegExp(`(?<![\\p{L}\\p{N}])${PREFIX}(${list.map(esc).join("|")})(?![\\p{L}\\p{N}])`, "giu");
  return {
    find(text: string) {
      const out: { at: number; len: number; term: GlossTerm }[] = [];
      for (const m of text.matchAll(re)) {
        const name = m[1];
        // a prefix is kept only on a Hebrew term; a Latin alias stands alone
        const at = m.index! + m[0].length - name.length;
        if (at !== m.index && !/[֐-׿]/.test(name)) continue;
        const term = names.get(name.toLowerCase());
        if (term) out.push({ at, len: name.length, term });
      }
      return out;
    },
  };
}
