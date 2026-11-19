// The text of the lesson as the tutor should read it: a range or a section, with every equation as
// $…$ and the app's own controls left out. Used by the consultation cards and the lesson notebook.
// Same file in both labs.
const SECTION_CHARS = 12_000;
/** the end of the previous section sent with a consultation (what was read just before) */
const BEFORE_CHARS = 2_500;

/** Text of a range, with each equation as $…$ (KaTeX keeps its LaTeX in an annotation). */
export function textOf(r: Range) {
  const box = document.createElement("div");
  box.appendChild(r.cloneContents());
  box.querySelectorAll(".katex-display, .katex").forEach((k) => {
    if (!box.contains(k)) return;
    const tex = k.querySelector('annotation[encoding="application/x-tex"]')?.textContent?.trim();
    k.replaceWith(tex ? (k.classList.contains("katex-display") ? `\n$$${tex}$$\n` : `$${tex}$`) : "");
  });
  box.querySelectorAll("button, svg, script, style, .no-copy").forEach((x) => x.remove());
  box.querySelectorAll("br").forEach((x) => x.replaceWith("\n"));
  box.querySelectorAll("p, div, li, h2, h3, h4, tr, pre, blockquote").forEach((x) => x.append("\n"));
  return (box.textContent ?? "").replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * The section of the lesson that holds a point: from the heading above it to the next heading
 * of the same or a higher level. With no point, the section being read (the last heading above
 * the top of the view).
 */
export function sectionAt(scroll: HTMLElement, at: Node | null) {
  const heads = [...scroll.querySelectorAll<HTMLElement>(".prose h2[id], .prose h3[id]")];
  let head: HTMLElement | null = null;
  if (at) {
    for (const h of heads) if (h.compareDocumentPosition(at) & Node.DOCUMENT_POSITION_FOLLOWING) head = h;
  } else {
    const top = scroll.getBoundingClientRect().top + 90;
    for (const h of heads) if (h.getBoundingClientRect().top <= top) head = h;
  }
  const r = document.createRange();
  if (head) {
    r.setStartBefore(head);
    const lvl = head.tagName;
    const next = heads.slice(heads.indexOf(head) + 1).find((h) => h.tagName <= lvl || h.tagName === "H2");
    const end = next ?? head.closest(".prose") ?? scroll;
    if (next) r.setEndBefore(next);
    else r.setEndAfter(end.lastChild ?? end);
  } else {
    r.selectNodeContents(scroll.querySelector(".prose") ?? scroll);
  }
  const t = textOf(r);
  const title = head?.textContent?.trim() ?? "";
  return { title, text: t.length > SECTION_CHARS ? t.slice(0, SECTION_CHARS) + "\n…" : t, outline: outlineOf(heads, title), before: head ? before(heads, head) : "" };
}

/** The lesson's headings in order (each once: the book keeps a hidden copy), the one being read marked. */
function outlineOf(heads: HTMLElement[], current: string) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const h of heads) {
    const t = h.textContent?.trim() ?? "";
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(`${h.tagName === "H3" ? "  " : ""}${t}${t === current ? "  ← נקרא עכשיו" : ""}`);
  }
  return out.join("\n");
}

/** The end of the section before `head` (what the learner read just before it), in the same column. */
function before(heads: HTMLElement[], head: HTMLElement) {
  const col = head.closest(".prose");
  const prev = heads.slice(0, heads.indexOf(head)).reverse().find((h) => h.closest(".prose") === col && h.textContent?.trim() !== head.textContent?.trim());
  if (!prev) return "";
  const r = document.createRange();
  r.setStartBefore(prev);
  r.setEndBefore(head);
  const t = textOf(r);
  return t.length > BEFORE_CHARS ? "…" + t.slice(-BEFORE_CHARS) : t;
}
