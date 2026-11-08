// The simulator registry, and its description for the tutor's instructions.
import { EW_SIMS } from "./ew";
import { RADAR_SIMS } from "./radar";
import { SYSTEM_SIMS } from "./systems";
import type { SimDef } from "./types";

export const SIMS: SimDef[] = [...RADAR_SIMS, ...EW_SIMS, ...SYSTEM_SIMS];
export const SIM_BY_ID: Record<string, SimDef> = Object.fromEntries(SIMS.map((s) => [s.id, s]));

export const SIM_CATALOG = SIMS.map((s) => {
  const params = s.params
    .map((p) => (p.options ? `${p.id} (${p.options.map((o, i) => `${i}=${o}`).join(", ")}; default ${p.value})` : `${p.id} (${p.min}–${p.max}${p.unit ? " " + p.unit : ""}, default ${Number(p.value.toPrecision(4))})`))
    .join("; ");
  return `- ${s.id}: ${s.caption} Model: ${s.model}. Params: ${params}.`;
}).join("\n");
