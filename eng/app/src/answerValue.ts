// The value of a numeric answer as the learner writes it (24.11, his request: the answer field took only a
// plain number). Accepts a number in any of the usual forms, a complex number (3+4j, 3-j4, 4i, 5∠53.13°,
// 5∠0.93rad, 2e^{j\pi/4}), an expression (2*pi*50, sqrt(2)/2, 1.2×10^3) and LaTeX from the equation editor
// (\frac{\sqrt{3}}{2}, $…$). Evaluated by mathjs with nothing in scope but its constants and functions;
// anything that is not a number (a unit, a matrix, a function) is not an answer. Same file in both labs.
import { create, all, type MathJsInstance } from "mathjs";

export interface Value {
  re: number;
  im: number;
}

let math: MathJsInstance | null = null;
const mj = () => (math ??= create(all, {}));

const SUP: Record<string, string> = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-", "⁺": "+" };

/** LaTeX (as MathLive writes it) to a mathjs expression. Only what an answer needs. */
export function texToExpr(tex: string): string {
  let t = tex;
  t = t.replace(/\\(?:left|right|displaystyle|mathrm|operatorname|text)\b/g, "").replace(/\\[,;:! ]/g, "");
  // MathLive's short forms: \frac12, \frac{a}2, \sqrt2
  t = t.replace(/\\([dt]?frac)\s*(\d)\s*(\d)/g, "\\$1{$2}{$3}").replace(/\\([dt]?frac)\s*(\d)\s*\{/g, "\\$1{$2}{").replace(/(\\[dt]?frac\{[^{}]*\})\s*(\d)/g, "$1{$2}").replace(/\\sqrt\s*(\d)/g, "\\sqrt{$1}");
  t = t.replace(/\\(?:cdot|times|ast)/g, "*").replace(/\\div/g, "/");
  t = t.replace(/\^\{?\\circ\}?|\\degree/g, "°").replace(/\\angle/g, "∠");
  t = t.replace(/\\pi\b/g, " pi ").replace(/\\infty/g, "Infinity");
  t = t.replace(/\\(sin|cos|tan|ln|log|exp|sinh|cosh|tanh|arcsin|arccos|arctan)\b/g, (_, f: string) => f.replace(/^arc/, "a"));
  // innermost first, until nothing changes: \frac{a}{b}, \sqrt[n]{x}, \sqrt{x}
  for (let i = 0; i < 20; i++) {
    const before = t;
    t = t.replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, "(($1)/($2))");
    t = t.replace(/\\sqrt\[([^\]]*)\]\{([^{}]*)\}/g, "nthRoot(($2),($1))");
    t = t.replace(/\\sqrt\{([^{}]*)\}/g, "sqrt($1)");
    t = t.replace(/(?<=[\^_])\{([^{}]*)\}/g, "($1)");
    if (t === before) break;
  }
  return t.replace(/[{}]/g, (b) => (b === "{" ? "(" : ")")).replace(/\\/g, "");
}

/** Plain text (or converted LaTeX) to a mathjs expression: the engineer's j, ∠, °, ×10^, superscripts. */
export function toExpr(input: string): string {
  let t = input.trim().replace(/^\$+|\$+$/g, "").trim();
  if (/\\[a-zA-Z]|[{}]/.test(t)) t = texToExpr(t);
  t = t.replace(/[−–]/g, "-").replace(/[×✕]/g, "*").replace(/[·⋅]/g, "*").replace(/÷/g, "/").replace(/π/g, "pi");
  t = t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g, (m) => "^(" + [...m].map((c) => SUP[c]).join("") + ")");
  t = t.replace(/√\s*\(/g, "sqrt(").replace(/√\s*([\d.]+|pi|[a-z])/g, "sqrt($1)");
  // a comma between digits: thousands when three digits follow, else a decimal comma
  t = t.replace(/(\d),(\d{3})(?!\d)/g, "$1$2").replace(/(\d),(\d)/g, "$1.$2");
  // j is the imaginary unit (and i stays one); "j4" is 4j
  t = t.replace(/(?<![A-Za-z_])j\s*(\d+(?:\.\d+)?)/g, "(i*$1)").replace(/(?<![A-Za-z_])j(?=\s*(?:pi\b|sqrt\b|[^A-Za-z_]|$))/g, "(i)");
  // 2e^(…) is 2·e^(…), not a malformed 2e+…
  t = t.replace(/(\d)\s*e\s*\^/g, "$1*e^");
  // a phasor: magnitude∠angle, the angle in degrees unless it says rad
  const polar = /^(.+?)∠(.+)$/.exec(t);
  if (polar) {
    const ang = polar[2].trim();
    const rad = /rad\s*$/.test(ang);
    const a = ang.replace(/rad\s*$|°\s*$/g, "").trim();
    t = `(${polar[1]})*exp(i*(${a})${rad ? "" : "*pi/180"})`;
  } else t = t.replace(/°/g, "*pi/180");
  return t;
}

const plain = (s: string) => {
  const t = s.trim();
  return /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t) ? Number(t) : null;
};

/** The value of an answer; null when it is not a number (or is empty). */
export function parseValue(input: string): Value | null {
  if (!input.trim()) return null;
  const quick = plain(input);
  if (quick !== null) return { re: quick, im: 0 };
  let expr: string;
  try {
    expr = toExpr(input);
    if (!expr || /[=;]|\b(?:import|createUnit|evaluate|parse|compile|simplify|derivative|reviver|config)\b/.test(expr)) return null;
    const v: unknown = mj().evaluate(expr, {});
    if (typeof v === "number") return Number.isFinite(v) ? { re: v, im: 0 } : null;
    if (v && typeof v === "object" && "re" in v && "im" in v) {
      const c = v as Value;
      if (!Number.isFinite(c.re) || !Number.isFinite(c.im)) return null;
      // rounding noise of exp(i·θ) (5∠90° is 5j, not 3e-16+5j)
      const m = Math.hypot(c.re, c.im);
      const re = Math.abs(c.re) < m * 1e-12 ? 0 : c.re;
      const im = Math.abs(c.im) < m * 1e-12 ? 0 : c.im;
      return { re, im };
    }
    return null;
  } catch {
    return null;
  }
}

export const isComplex = (v: Value) => v.im !== 0;
export const abs = (v: Value) => Math.hypot(v.re, v.im);
export const sub = (a: Value, b: Value): Value => ({ re: a.re - b.re, im: a.im - b.im });
export const div = (a: Value, b: Value): Value => {
  const d = b.re * b.re + b.im * b.im;
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d };
};

const fmt = (x: number) => {
  if (x === 0) return "0";
  const a = Math.abs(x);
  if (a >= 1e6 || a < 1e-3) {
    const [m, e] = x.toExponential(3).split("e");
    return `${Number(m)}\\times10^{${Number(e)}}`;
  }
  return String(Number(x.toPrecision(5)));
};

/** The value as LaTeX, for the line under the field ("נקרא כ…"): a + bj and, for a complex one, its polar form. */
export function valueTex(v: Value): string {
  if (!isComplex(v)) return fmt(v.re);
  const imPart = `${fmt(Math.abs(v.im))}j`.replace(/^1j$/, "j");
  const rect = v.re === 0 ? `${v.im < 0 ? "-" : ""}${imPart}` : `${fmt(v.re)} ${v.im < 0 ? "-" : "+"} ${imPart}`;
  const deg = (Math.atan2(v.im, v.re) * 180) / Math.PI;
  return `${rect} \\;=\\; ${fmt(abs(v))}\\angle ${fmt(deg)}^\\circ`;
}
