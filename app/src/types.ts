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
}
