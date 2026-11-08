// The text of the lesson as the tutor should read it: a range or a section, with every equation as
// $…$ and the app's own controls left out. Used by the consultation cards and the lesson notebook.
// Same file in both labs.
const SECTION_CHARS = 12_000;

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
  return { title: head?.textContent?.trim() ?? "", text: t.length > SECTION_CHARS ? t.slice(0, SECTION_CHARS) + "\n…" : t };
}
