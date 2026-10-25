import type { Painter } from "./draw";

export interface ParamDef {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit?: string;
  /** the slider moves in log10 */
  log?: boolean;
  /** a discrete choice: value is the option index */
  options?: string[];
}

export type P = Record<string, number>;

export interface Readout {
  label: string;
  value: string;
  /** highlight (a threshold crossed, a lost track) */
  alert?: boolean;
}

export interface SimDef {
  id: string;
  title: string;
  /** one line for the catalog: what the simulator shows and the model behind it */
  caption: string;
  /** the formula or model, shown under the canvas */
  model: string;
  params: ParamDef[];
  /** seconds of a loop; absent for a static simulator */
  duration?: number;
  height?: number;
  readouts?(p: P, t: number): Readout[];
  draw(g: Painter, p: P, t: number): void;
}

/** Caches the last few results of an expensive computation keyed by its parameters. */
export function memo<T>(fn: (p: P) => T, size = 6) {
  const cache = new Map<string, T>();
  return (p: P): T => {
    const k = JSON.stringify(p);
    const hit = cache.get(k);
    if (hit !== undefined) return hit;
    const v = fn(p);
    cache.set(k, v);
    if (cache.size > size) cache.delete(cache.keys().next().value as string);
    return v;
  };
}

/** Finds x in [lo, hi] where f crosses zero, assuming f(lo) and f(hi) differ in sign. */
export function bisect(f: (x: number) => number, lo: number, hi: number, logScale = false): number {
  let a = lo;
  let b = hi;
  const fa = f(a);
  if (!(fa * f(b) <= 0)) return NaN;
  for (let i = 0; i < 80; i++) {
    const m = logScale ? Math.sqrt(a * b) : (a + b) / 2;
    if (f(m) * fa > 0) a = m;
    else b = m;
  }
  return (a + b) / 2;
}

export const deg = Math.PI / 180;
export const G0 = 9.80665;

export function num(v: number, digits = 3) {
  if (!Number.isFinite(v)) return "—";
  const a = Math.abs(v);
  if (a !== 0 && (a >= 1e6 || a < 1e-3)) return v.toExponential(2);
  return Number(v.toPrecision(digits)).toLocaleString("en-US");
}
