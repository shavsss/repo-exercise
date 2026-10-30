// The depth rules (v3) in code: the depth units of a lesson plan, the plan check that sends the
// plan back once with what is missing (the depth gate inside the app), the unit markers the writer
// leaves in the text, and the lead-and-decide slot. There is no word floor anywhere: a lesson is
// measured by its units. Identical in both apps.

export interface PlanUnit {
  id: string;
  /** the result it belongs to: R1/R2, an anchor id, or S for a supporting result */
  r?: string;
  type?: string;
  tier?: string;
  src?: string;
  /** 1-based part number */
  part?: number;
  text?: string;
  /** its exam question at level 2.5 */
  q?: string;
}

/** The fields of a part plan the gate reads (the plan itself is PartPlan in tutor.ts). */
export interface GatePlan {
  results?: { id: string; text?: string; thread?: string }[];
  units?: PlanUnit[];
  parts: { title: string; units?: string[]; blocks?: string[]; l25?: string[] }[];
}

/** Every central result keeps at least one of these after the authority filter. */
const MIN_TYPES = ["ASM", "QNT", "PRX", "CRT"];

/** The units of part k (0-based): from units[].part, or from parts[k].units. */
export function unitsOfPart(plan: GatePlan, k: number): PlanUnit[] {
  const ids = new Set(plan.parts[k]?.units ?? []);
  return (plan.units ?? []).filter((u) => (u.part !== undefined ? Number(u.part) === k + 1 : ids.has(u.id)));
}

/**
 * What the plan still lacks under the depth rules, as short English lines for the repair turn.
 * `full` is false for a reference-tier module (no full authority layer there); `sections` are the
 * seven level-2.5 section names of the app.
 */
export function planGaps(plan: GatePlan, o: { full: boolean; sections: string[] }): string[] {
  const gaps: string[] = [];
  const results = plan.results ?? [];
  const units = plan.units ?? [];
  if (!results.length) gaps.push('"results" is empty: name the lesson\'s one or two central results, each with its thread question.');
  if (results.length > 2) gaps.push(`${results.length} central results: plan only the first one or two now and put the rest in "split" (the split rule); split, never delete.`);
  if (!units.length) {
    gaps.push('"units" is empty: list every depth unit (id, r, type, tier, src, part, text, q).');
    return gaps;
  }
  const noQ = units.filter((u) => !u.q?.trim()).map((u) => u.id);
  if (noQ.length) gaps.push(`units without an exam question q: ${noQ.slice(0, 30).join(", ")}.`);
  const n = plan.parts.length;
  const homeless = units.filter((u) => !plan.parts.some((_, k) => unitsOfPart(plan, k).includes(u))).map((u) => u.id);
  if (homeless.length) gaps.push(`units assigned to no part (part must be 1–${n}): ${homeless.slice(0, 30).join(", ")}.`);
  if (o.full) {
    for (const r of results.slice(0, 2)) {
      const types = new Set(units.filter((u) => u.r === r.id).map((u) => (u.type ?? "").toUpperCase()));
      const lack = MIN_TYPES.filter((t) => !types.has(t));
      if (lack.length) gaps.push(`central result ${r.id} has no unit of type ${lack.join(", ")} (each central result needs at least one ASM, QNT, PRX with computed numbers, and CRT after the authority filter; add them from the six slots).`);
    }
    const l25 = plan.parts.flatMap((p) => p.l25 ?? []).join(" ");
    const lack25 = o.sections.filter((s) => !l25.includes(s));
    if (lack25.length) gaps.push(`level-2.5 sections assigned to no part: ${lack25.join(", ")}.`);
  }
  const thinks = plan.parts.flatMap((p) => p.blocks ?? []).filter((b) => /^think\b/.test(b)).length;
  if (thinks > 7) gaps.push(`${thinks} think blocks: keep about six, at real decision points (a predict block counts within the six).`);
  return gaps;
}

/** The repair turn for a plan with gaps: fix by adding, never by cutting. */
export function planRepairTurn(plan: unknown, gaps: string[]) {
  return `PLAN CHECK (the app's depth gate). Your plan below does not yet meet the depth rules:
${gaps.map((g) => `- ${g}`).join("\n")}
Fix exactly these points by adding or reassigning units and blocks; never delete a unit or thin one to fix a gap, and keep everything else of the plan. Reply with the full corrected JSON object only, in the same schema.
Your plan:
${JSON.stringify(plan)}`;
}

/** The unit ids marked in a text with <!--U7--> (also inside think answers). */
export function markedUnits(text: string) {
  return new Set([...text.matchAll(/<!--\s*(U\d+[a-zא-ת]?)\s*-->/g)].map((m) => m[1]));
}

/**
 * The planned units of part k that the text does not mark yet. A part with no marker at all is
 * left alone: the writer did not use the markers there, and asking again would repeat its content.
 */
export function missingUnits(plan: GatePlan, k: number, text: string) {
  const marked = markedUnits(text);
  const own = unitsOfPart(plan, k);
  if (!own.some((u) => marked.has(u.id))) return [];
  return own.filter((u) => !marked.has(u.id));
}

/** The units of a part, as lines for its writing turn. */
export function unitLines(units: PlanUnit[]) {
  return units.map((u) => `- ${u.id} [${[u.type, u.tier, u.src === "auth" ? "authority" : u.src].filter(Boolean).join(", ")}] ${u.text ?? ""}${u.q ? ` — exam question: ${u.q}` : ""}`).join("\n");
}

/** One completion turn for planned units a part left out: written now, inside the same part. */
export function unitCompletion(units: PlanUnit[]) {
  return `\n\nUNIT CHECK. The text of this part above stops without these planned units (no <!--U…--> marker for them yet):
${unitLines(units)}
Continue this part exactly from where the text above stops: write each of these units in full (at least the minimum of its type), connected to the argument with a linking half-sentence, each with its marker right after the sentence where it first enters. A unit that is in fact already written above without its marker is not written again. Do not repeat anything already written, do not end the lesson, and close with a corrected hidden audit line.`;
}

/* ---------------- the lead-and-decide track ---------------- */

export const DECIDE_KINDS = ["trade", "architecture", "review", "agents"] as const;
export type DecideKind = (typeof DECIDE_KINDS)[number];

/**
 * When a lesson carries a decide block: the last lesson of every module, and in a module of six
 * lessons or more also the middle one. The kind rotates through the four with the number of
 * finished modules, so every kind comes back about every four modules.
 */
export function decideSlot(lessons: number, idx: number, modulesDone: number): DecideKind | null {
  if (lessons < 1 || idx < 0) return null;
  if (idx === lessons - 1) return DECIDE_KINDS[modulesDone % 4];
  if (lessons >= 6 && idx === Math.floor(lessons / 2) - 1) return DECIDE_KINDS[(modulesDone + 2) % 4];
  return null;
}

const DECIDE_BRIEF: Record<DecideKind, string> = {
  trade: "a cross-domain trade study: one decision, 2–4 alternatives, numbers per domain from compute, and a sensitivity analysis (which parameter flips the decision, and at what value)",
  architecture: "an architecture choice: the requirements, 2–3 candidate architectures, the pick defended against the alternatives, and the condition under which the choice flips",
  review: "a design review: a short design note written by someone else with 3–5 planted errors across several domains (sometimes also a correct claim that looks wrong); the learner finds them, ranks them by severity and names the check that catches each",
  agents: "leading a team of AI agents on one large engineering task: the learner sets the split between agents, the interfaces (inputs, outputs, units, formats) and the acceptance tests for each agent and for the whole, and how a wrong agent would be caught",
};

/** The line the planning turn gets when this lesson carries a decide block. */
export function decideLine(kind: DecideKind | null) {
  if (!kind) return "";
  return `\nLEAD-AND-DECIDE: this lesson carries one decide block (@kind: ${kind}) in its last part, before the end blocks: ${DECIDE_BRIEF[kind]}. Build it only from results the learner has already learned (<course_memory> and this lesson), at the same depth as the lesson, in engineering language; the reference analysis goes after the --- line. Plan it in that part's "blocks".`;
}
