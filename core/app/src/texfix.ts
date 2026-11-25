// TeX that KaTeX does not know, rewritten into what it does before rendering (display only: stored text is never
// changed). The mathtools small matrices with delimiters (psmallmatrix and the rest) become smallmatrix inside
// \left…\right. Same file in both labs.
const SMALL: Record<string, [string, string]> = {
  p: ["(", ")"],
  b: ["[", "]"],
  B: ["\\{", "\\}"],
  v: ["|", "|"],
  V: ["\\|", "\\|"],
};

export function fixTex(src: string) {
  if (!src.includes("smallmatrix")) return src;
  return src
    .replace(/\\begin\{([pbBvV])smallmatrix\}/g, (_m, k: string) => `\\left${SMALL[k][0]}\\begin{smallmatrix}`)
    .replace(/\\end\{([pbBvV])smallmatrix\}/g, (_m, k: string) => `\\end{smallmatrix}\\right${SMALL[k][1]}`);
}

/**
 * Display math ($$) as remark-math reads it: the fences on lines of their own. A model sometimes writes the closing
 * fence on the line of the formula ("p=nkT\tag{5}$$"); remark-math then never closes the block, and it swallows the rest
 * of the lesson, charts included (25.11, Gilua M0.2 lesson 3 from 7.3 on). Each $$ that opens or closes a block on a
 * line with text is moved to a line of its own, and a block still open at a blank line is closed there, so a missing
 * fence costs one paragraph at most. A one-line $$…$$ is left alone (Markdown.tsx makes it a display block). Text only:
 * fenced code is split off before this runs.
 */
export function fixMathFences(src: string) {
  if (!src.includes("$$")) return src;
  const out: string[] = [];
  let open = false;
  for (const line of src.split("\n")) {
    const t = line.trim();
    const fences = line.split("$$").length - 1;
    if (!open) {
      if (fences % 2 === 0) out.push(line);
      else if (t.startsWith("$$")) {
        out.push("$$");
        if (t.length > 2) out.push(t.slice(2).trim());
        open = true;
      } else if (t.endsWith("$$")) {
        out.push(t.slice(0, -2).trimEnd(), "$$");
        open = true;
      } else out.push(line);
      continue;
    }
    if (!t) {
      out.push("$$", line);
      open = false;
    } else if (fences % 2 === 1 && t.endsWith("$$")) {
      if (t.length > 2) out.push(t.slice(0, -2).trimEnd());
      out.push("$$");
      open = false;
    } else if (fences % 2 === 1 && t.startsWith("$$")) {
      out.push("$$", t.slice(2).trim());
      open = false;
    } else out.push(line);
  }
  if (open) out.push("$$");
  return out.join("\n");
}
