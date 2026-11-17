import { useEffect, useRef, useState } from "react";
import type { Store } from "./runtime";
import type { StoredMessage } from "./types";

// "Teach it back" (docs/CORE_TEACHING_RULES.md, docs/ENG_TEACHING_RULES.md, "העבר את השיעור"): at the end of a lesson
// or of the day the learner explains, out loud and from memory, what he learned; the speech arrives as text through
// the `dictation` capability, the tutor checks it against what was taught and the sources, and a spoken conversation
// follows for as long as he wants, the tutor's replies read aloud through `tts` (tutor.ts, teachBackTurn). Each session is kept in profile/teachback/<id>, and its gaps become
// notebook items ("להעמקה"), which the tutor reads in the next lessons. Identical in both labs.

export interface TeachScope {
  moduleId: string;
  /** lesson index; -1 = the module quiz */
  lesson: number;
  title?: string;
}
export interface TeachTurn {
  who: "learner" | "tutor";
  text: string;
}
export interface TeachGap {
  text: string;
  moduleId: string;
  lesson: number;
}
export interface TeachVerdict {
  /** 1 (did not explain it) to 5 (could teach it) */
  score: number;
  strong: string[];
  gaps: TeachGap[];
}
/** profile/teachback/<id> */
export interface TeachDoc {
  kind: "lesson" | "day";
  date: string;
  at: number;
  scopes: TeachScope[];
  turns: TeachTurn[];
  verdict?: TeachVerdict;
}

/* ---- the tutor's voice (tts): each reply is read aloud, without the Markdown ---- */
interface Tts {
  speak(text: string, o?: { rate?: number }): Promise<void>;
  stop(): void;
  onState(h: (e: { state: string }) => void): () => void;
}
let tts: Promise<Tts | null> | null = null;
export const getTts = () => (tts ??= window.claude?.use("tts").catch(() => null) ?? Promise.resolve(null));

/** Markdown and LaTeX → plain speech, at most 2000 characters (the tts limit). */
export function spoken(md: string) {
  const s = md
    .replace(/\[\[[^\]]+\]\]/g, "")
    .replace(/^#+\s*/gm, "")
    .replace(/[*_`>|$\\{}]/g, "")
    .replace(/^\s*(\d+\.|-)\s+/gm, "")
    .replace(/✓/g, "נכון.")
    .replace(/◐/g, "חלקית.")
    .replace(/✗/g, "לא בדיוק.")
    .replace(/\n{2,}/g, "\n")
    .trim();
  return s.length > 2000 ? s.slice(0, 1990) + "…" : s;
}

/* ---- dictation: the platform holds the microphone and hands the page words ---- */
interface Dictation {
  start(o?: { language?: string }): Promise<void>;
  stop(): Promise<void>;
  onPartial(h: (e: { text: string }) => void): () => void;
  onFinal(h: (e: { text: string }) => void): () => void;
  onState(h: (e: { state: string; reason?: string }) => void): () => void;
}
let dictation: Promise<Dictation | null> | null = null;
const getDictation = () => (dictation ??= window.claude?.use("dictation").catch(() => null) ?? Promise.resolve(null));

const DICT_ERR: Record<string, string> = {
  not_granted: "המיקרופון חסום לדף הזה. אפשר להקליד, או לאשר אותו בתפריט ההרשאות של ה-Artifact.",
  unavailable: "הכתבה לא זמינה כאן (היא עובדת ב-Chrome ובחלון הראשי של אפליקציית Claude). אפשר להקליד.",
  rate_limited: "יותר מדי הכתבות בבת אחת. נסה שוב בעוד רגע.",
  upstream_error: "המיקרופון או שירות התמלול נכשלו. נסה שוב, או הקלד.",
};

/** Speech to text for one field: `onFinal` gets each settled phrase, to append as is. */
export function useDictation(onFinal: (text: string) => void) {
  const [d, setD] = useState<Dictation | null | undefined>(undefined);
  const [state, setState] = useState("idle");
  const [partial, setPartial] = useState("");
  const [error, setError] = useState("");
  const sink = useRef(onFinal);
  sink.current = onFinal;
  useEffect(() => {
    let off = false;
    getDictation().then((x) => !off && setD(x));
    return () => {
      off = true;
    };
  }, []);
  useEffect(() => {
    if (!d) return;
    const subs = [
      d.onPartial(({ text }) => setPartial(text)),
      d.onFinal(({ text }) => {
        setPartial("");
        sink.current(text);
      }),
      d.onState(({ state, reason }) => {
        setState(state);
        if (state === "idle" && reason && DICT_ERR[reason]) setError(DICT_ERR[reason]);
        if (reason === "unavailable" || reason === "not_granted") setD(null);
      }),
    ];
    return () => {
      subs.forEach((u) => u());
      void d.stop().catch(() => {});
    };
  }, [d]);
  return {
    /** undefined while not known yet; false: typing only */
    available: d === undefined ? undefined : !!d,
    listening: state !== "idle",
    partial,
    error,
    /** call straight from the click, nothing awaited before it */
    toggle() {
      if (!d) return;
      if (state !== "idle") return void d.stop().catch(() => {});
      setError("");
      d.start().catch((e: { code?: string }) => e?.code && e.code !== "stopped" && e.code !== "dismissed" && setError(DICT_ERR[e.code] ?? DICT_ERR.upstream_error));
    },
    stop: () => d?.stop().catch(() => {}),
  };
}

/* ---- what was taught: the lesson conversations' answers ---- */
const TAUGHT_CHARS = 60_000;

/** The written lesson(s) of each scope, cut to fit; `known` gives the messages already loaded for a lesson. */
export async function taughtText(store: Store | null, scopes: TeachScope[], known?: { scope: TeachScope; messages: StoredMessage[] }) {
  const each = Math.floor(TAUGHT_CHARS / Math.max(1, scopes.length));
  const convs = store && scopes.some((s) => s !== known?.scope) ? (await store.sub("convs").orderBy("updatedAt", "desc").limit(200).get().catch(() => null))?.docs ?? [] : [];
  const out: string[] = [];
  for (const s of scopes) {
    let msgs = known?.scope === s ? known.messages : null;
    if (!msgs && store) {
      const c = convs.find((d) => d.data()?.moduleId === s.moduleId && d.data()?.lesson === s.lesson);
      msgs = c ? await store.loadMessages(c.id).catch(() => []) : [];
    }
    const text = (msgs ?? [])
      .filter((m) => m.role === "assistant" && !m.draft && m.text.trim())
      .map((m) => m.text)
      .join("\n\n");
    out.push(`=== ${s.moduleId} · ${s.lesson < 0 ? "מבחן מסכם" : `שיעור ${s.lesson + 1}`}${s.title ? `: ${s.title}` : ""} ===\n${text ? (text.length > each ? text.slice(0, each) + "\n[…]" : text) : "(the lesson text was not found; rely on the sources)"}`);
  }
  return out.join("\n\n");
}

export async function saveTeachBack(store: Store | null, doc: TeachDoc) {
  if (!store) return;
  const id = `${doc.date}__${doc.kind === "day" ? "day" : `${doc.scopes[0].moduleId}__${doc.scopes[0].lesson}`}__${doc.at}`;
  await store.sub("teachback").doc(id).set(JSON.parse(JSON.stringify(doc)));
}
