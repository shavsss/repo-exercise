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
