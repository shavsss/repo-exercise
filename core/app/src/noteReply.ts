// The tutor's answer to a note the learner wrote in the margin (MarginNotes.tsx): one short call when he closes a
// note he wrote or changed, the answer kept on the note (`reply`, and `replyFor`, the text it answers). Notes the
// tutor saved are never answered. Same file in both apps.
import { useEffect, useState } from "react";
import type { Runtime } from "./runtime";
import { NOTE_KIND_LABEL, type LessonNote } from "./types";

const MODEL = "claude-opus-5-5";

const HOW: Record<LessonNote["kind"], string> = {
  note: "If it is a question, answer it. If it is a doubt, a thought or a claim, take a position and give the reason, including where he is right and where it breaks.",
  deepen: "Say in a sentence or two what the point opens, and give one concrete way in: a page of the library, a classic source, or the module of the course where it is taught.",
  interview: "Say what is strong in the question and sharpen it: what would make an expert give a specific, numeric answer rather than a general one, and one follow-up question.",
  article: "Say what is new or strong in the idea, what the claim of the article would be in one sentence, and the first thing to check or calculate before writing.",
};

const pending = new Set<string>();
const subs = new Set<() => void>();
const ping = () => subs.forEach((f) => f());

/** whether the tutor is writing an answer to this note now */
export function useReplyPending(id?: string) {
  const [, tick] = useState(0);
  useEffect(() => {
    const f = () => tick((x) => x + 1);
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  }, []);
  return !!id && pending.has(id);
}

/** Answers the note; returns the answer, or "" when there is nothing to answer or the call failed. */
export async function replyToNote(rt: Runtime | null, note: LessonNote, ctx: { lab: string; moduleTitle: string; memory: string }) {
  const text = note.text.trim();
  if (!rt?.sample || !note.id || note.who !== "learner" || !text || note.replyFor === text || pending.has(note.id)) return "";
  pending.add(note.id);
  ping();
  try {
    const prompt = `You are the tutor of ${ctx.lab}. While reading a lesson, the learner wrote a note in the margin, beside the paragraph below. He wrote it himself and wants your answer to it, the way a good teacher answers a note in the margin of a student's book.

Answer in Hebrew, directly, about what he wrote; do not repeat his note and do not praise it. ${HOW[note.kind]} Length by need: two to six sentences, up to about 150 words. No headings. Mathematics in $...$. Plain engineering register.

<lesson>${note.moduleId} · ${ctx.moduleTitle} · ${note.lessonTitle ?? ""}</lesson>
<paragraph>${(note.anchor ?? "").slice(0, 1200)}</paragraph>
<note kind="${NOTE_KIND_LABEL[note.kind]}">
${text.slice(0, 3000)}
</note>
<course_memory>
${ctx.memory.slice(0, 4000)}
</course_memory>`;
    const res = await rt.sample(prompt, { model: MODEL, modelTier: "default", effort: "medium", cache: false });
    return (res.text ?? "").trim();
  } catch {
    return "";
  } finally {
    pending.delete(note.id);
    ping();
  }
}
