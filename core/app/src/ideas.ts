// The idea store (docs/ENGINEERING_CASE.md): the learner's own ideas, mostly from stage 8 of an engineering case
// ("what would you do differently"), kept in one document profile/ideas/store as { items: Idea[], updatedAt }.
// They grow from seed to project; a short list goes to the lesson planner as <idea_store>, so a case can recall a
// fitting one. Same file in both apps.

export interface Idea {
  id: string;
  text: string;
  moduleId: string;
  /** 0-based lesson index */
  lesson: number;
  caseId: string;
  /** the case stage it came from ("8", "fault", …) */
  stage?: string;
  status: "seed" | "growing" | "project";
  at: number;
}

interface IdeaStore {
  loadIdeas(): Promise<Record<string, unknown> | null>;
  saveIdeas(data: Record<string, unknown>): Promise<void>;
}

/** The one document stays well under the db's 256 KiB. */
const MAX_IDEAS = 300;
const MAX_TEXT = 2000;
const STATUSES: Idea["status"][] = ["seed", "growing", "project"];

function valid(x: unknown): x is Idea {
  const i = x as Idea;
  return !!i && typeof i.id === "string" && typeof i.text === "string" && !!i.text.trim();
}

export async function loadIdeas(store: IdeaStore | null | undefined): Promise<Idea[]> {
  if (!store) return [];
  const d = await store.loadIdeas();
  const items = Array.isArray(d?.items) ? (d!.items as unknown[]) : [];
  return items.filter(valid).map((i) => ({ ...i, status: STATUSES.includes(i.status) ? i.status : "seed" }));
}

/** Adds an idea, or replaces the one with the same id (an idea is replaced, never deleted, when it grows). */
export async function saveIdea(store: IdeaStore, idea: Idea): Promise<Idea[]> {
  const all = await loadIdeas(store);
  const one = { ...idea, text: idea.text.slice(0, MAX_TEXT) };
  const at = all.findIndex((i) => i.id === one.id);
  if (at >= 0) all[at] = one;
  else all.push(one);
  const items = all.slice(-MAX_IDEAS);
  await store.saveIdeas({ items, updatedAt: Date.now() });
  return items;
}

const STATUS_LABEL: Record<Idea["status"], string> = { seed: "זרע", growing: "מבשיל", project: "פרויקט" };

/** The ideas as a compact list for the prompt: projects and growing ideas first, then the newest seeds. */
export function ideasForPrompt(ideas: Idea[], max = 25): string {
  const rank = (i: Idea) => (i.status === "project" ? 0 : i.status === "growing" ? 1 : 2);
  return [...ideas]
    .sort((a, b) => rank(a) - rank(b) || b.at - a.at)
    .slice(0, max)
    .map((i) => `- [${STATUS_LABEL[i.status]}, ${i.moduleId} שיעור ${i.lesson + 1}${i.stage ? `, שלב ${i.stage}` : ""}] ${i.text.replace(/\s+/g, " ").slice(0, 200)}`)
    .join("\n");
}
