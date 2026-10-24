export type Mode = "lesson" | "clarify" | "free";
export type Effort = "low" | "medium" | "high";

/** Tool activity during one answer, kept with the message. */
export type Activity =
  | { t: "read"; book: string; from: string; to: string; by: string; ok: boolean; note?: string }
  | { t: "search"; book: string; query: string; hits: number }
  | { t: "compute"; script: string; output: string; ok: boolean }
  | { t: "progress"; book: string; page: string; section: string };

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
  /** for a section lesson in progress: the plan and how many parts are already written */
  plan?: unknown;
  partsDone?: number;
}
