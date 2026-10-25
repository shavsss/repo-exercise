export type Mode = "lesson" | "clarify" | "free" | "quiz";
export type Effort = "low" | "medium" | "high";

/** Tool activity during one answer, kept with the message. */
export type Activity =
  | { t: "read"; doc: string; from: number; to: number; ok: boolean; note?: string }
  | { t: "search"; query: string; hits: number }
  | { t: "compute"; script: string; output: string; ok: boolean };

export interface StoredMessage {
  role: "user" | "assistant";
  text: string;
  mode: Mode;
  ts: number;
  images?: number;
  /** assistant only */
  activity?: Activity[];
  model?: string;
  truncated?: boolean;
  interrupted?: boolean;
  /** live only, never stored: what the tutor is doing now */
  status?: string;
  /** db document id (set when loaded or first saved) */
  id?: string;
  /** saved while the answer is still being written; a draft found on load was cut off */
  draft?: boolean;
  /** for a lesson in progress: the part plan and how many parts are already written */
  plan?: unknown;
  partsDone?: number;
}

/** One lesson of a module, as the tutor planned it on entering the module. */
export interface LessonSpec {
  title: string;
  /** section headings of the module's sources this lesson teaches */
  covers: string[];
  /** page ranges the lesson is built from */
  sources: { doc: string; pages: [number, number] }[];
  /** what the lesson teaches, and how it combines overlapping sources */
  focus: string;
}

/** The learner's state in one module. */
export interface ModuleProgress {
  lessons?: LessonSpec[];
  /** sections the plan did not assign (should be empty) */
  uncovered?: string[];
  /** indices of the lessons that were written to the end */
  done?: number[];
  /** lesson index → conversation id */
  convs?: Record<string, string>;
  quizConv?: string;
  quizScore?: string;
  updatedAt?: number;
}
