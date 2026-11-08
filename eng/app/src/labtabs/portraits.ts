// Portraits of authors in the reading log: only freely licensed photos (Wikimedia Commons), stored in each lab's
// asset store. An author without one gets a colored badge with initials. Same file in both apps.
const PORTRAITS: Record<string, Record<string, string>> = {
  eng: {
    "E. P. Wigner": "/_blob/e3f7aff34c7703774a5b863d7eaba5bd",
  },
  core: {},
};

export function portraitOf(author?: string): string | undefined {
  if (!author) return undefined;
  const lab = document.documentElement.dataset.lab === "eng" ? "eng" : "core";
  const map = PORTRAITS[lab];
  const first = author.split(/,| and |&/)[0].trim();
  return map[author] ?? map[first];
}

/** A stable hue for an author or a module (FNV-1a). */
export function hueOf(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return (h >>> 0) % 360;
}

/** Up to two initials of the first author ("R. W. Hamming" → "RH"; "CBO" → "CB"). */
export function initialsOf(author?: string): string {
  const first = (author ?? "?").split(/,| and |&/)[0].replace(/\(.*?\)|et al\.?/g, "").trim();
  const words = first.split(/[\s.]+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
