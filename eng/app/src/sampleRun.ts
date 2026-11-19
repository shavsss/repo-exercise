// One model call with a fallback, and the compute tool, shared by the consultation cards (components/Consult.tsx)
// and the case room (components/CaseRoom.tsx). Same file in both apps.
import type { Runtime, SampleOptions, SampleTool } from "./runtime";
import { runCompute } from "./tutor";

export interface SampleResult {
  text: string;
  truncated: boolean;
  model?: string;
}

/**
 * Runs `prompt` on `main`; when it fails (not stopped by the caller) or comes back empty, once more on `fallback`.
 * Throws when both give nothing.
 */
export async function sampleWithFallback(rt: Pick<Runtime, "sample">, prompt: string, main: string, fallback: string, opts: Omit<SampleOptions, "model">): Promise<SampleResult> {
  const run = (model: string) => rt.sample!(prompt, { ...opts, model });
  let res;
  try {
    res = await run(main);
  } catch (e) {
    if (opts.signal?.aborted) throw e;
    res = await run(fallback);
  }
  if (!res.text.trim()) res = await run(fallback);
  if (!res.text.trim()) throw { message: "empty" };
  return { text: res.text, truncated: res.truncated, model: res.modelApplied };
}

/** The compute tool (math.js); `onRun` sees every script it ran and its output. */
export function computeTool(onRun?: (script: string, output: string, ok: boolean) => void): SampleTool {
  return {
    name: "compute",
    description: "Evaluate a math.js script, one statement per line (units, complex numbers, matrices). Returns every line with its value.",
    inputSchema: { type: "object", properties: { script: { type: "string" } }, required: ["script"] },
    execute: (input) => {
      const script = String(input.script ?? "");
      const r = runCompute(script);
      onRun?.(script, r.output, r.ok);
      return r.output || "(no output)";
    },
  };
}
