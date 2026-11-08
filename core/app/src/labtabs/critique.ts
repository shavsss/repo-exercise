// "בקש ביקורת": one short, structured critique of the current stage of the month's
// product, from the main model, in a call of its own (it never enters a lesson conversation).
import type { Runtime } from "../runtime";
import type { Lab } from "./config";
import { STAGES, stageText, type Product, type StageId } from "./products";

const MODEL = "claude-opus-5-5";

const FOCUS: Record<StageId, string> = {
  idea: "Is the question sharp and measurable? Is the user real, and is 'better than what exists' a claim that can be checked with a number? Does it build on what the learner studies this month?",
  legal: "Go over the answers as an engineer who knows the Israeli rules for spectrum, type approval, export control (DECA, Wassenaar dual-use), military censorship and software licenses. Point out answers that look too optimistic and which authority or document settles each open point. This is a checklist review, not legal advice; say so in one line at the end.",
  spec: "Is the spec testable? Are the 3–5 competitors or baselines the right ones, and is the benchmark public and fair? Is the price hypothesis tied to a buyer?",
  design: "Are the decisions justified against alternatives, with the trade-offs stated? Does every central result have a numerical prediction with its basis, made before any run?",
  verify: "Does every central result have at least two independent checks (known analytic case, a second independent solver, public real data, a cheap measurement)? Are the pass criteria numbers? What could make two checks share the same error?",
  package: "Measure against the best GitHub projects in this field: README with demo and results, license, tests and CI, one-command reproduction, design doc, validation report against a baseline, versions and changelog, contributing guide, product page. What is the gap to the 3–5 leading projects named?",
  retro: "Is the retrospective honest and specific: which predictions held, which failed and why, which judgment calls to change next month, and is the continue/stop decision justified?",
};

export async function critiqueStage(o: { rt: Runtime; lab: Lab; product: Product; stage: StageId; legal: { id: string; q: string }[]; signal: AbortSignal; onText?: (t: string) => void }) {
  if (!o.rt.sample) throw { code: "not_granted", message: "sample unavailable" };
  const st = STAGES.find((s) => s.id === o.stage)!;
  const register =
    o.lab === "core"
      ? "The product belongs to a systems-engineering course on sensing and defense technology. Products here stay at the analysis level: models, cost studies, simulations of published equations, open-source literature. Keep an engineering register."
      : "The product belongs to an engineering course across many domains (signals, control, power, fluids, structures, ML, systems engineering).";
  const prompt = `You are a senior engineer reviewing one stage of a learner's monthly product (the target is a market-grade product, verified with open-source professional simulators, with a GitHub repository at the level of the best projects). ${register}

Product: ${o.product.title.trim() || "(no title yet)"}
The idea, for context:
${stageText(o.product, "idea", o.legal)}

The stage under review: «${st.label}» (${st.sub}).
<<<
${stageText(o.product, o.stage, o.legal).slice(0, 20000)}
>>>

What to look at: ${FOCUS[o.stage]}

Reply in Hebrew, short and concrete, under these headings, as numbered lists, and leave out a heading with nothing under it:
### מה חזק
(at most two points)
### מה חלש או חסר
### שאלה אחת שצריך לענות עליה
### הצעד הבא
(one concrete step for this stage)
No preamble.`;
  const res = await o.rt.sample([{ role: "user", content: prompt }], {
    model: MODEL,
    modelTier: "default",
    effort: "low",
    cache: false,
    signal: o.signal,
    onText: o.onText ? ({ text }) => o.onText!(text) : undefined,
  });
  return res.text.trim();
}
