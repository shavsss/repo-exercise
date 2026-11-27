// Fallback to the Claude API (identical in both apps). The page normally calls Claude through the
// claude.ai runtime (`sample`), on the learner's subscription. When the week's calls pass 90% of the
// budget the learner set, or the runtime answers rate_limited, calls go straight to the Claude API
// with the learner's own key, so work never stops. The key lives only in this browser (localStorage,
// entered on the #api page), never in the source. The week starts on Sunday at 00:00 local time.
import type { SampleFn, SampleOptions, SampleTool } from "./runtime";

const KEY = "claude-api-fallback";
/** after a rate_limited from the runtime, calls stay on the API this long before the runtime is tried again */
const COOLDOWN_MS = 30 * 60_000;
const SWITCH_AT = 0.9;
const MAX_TOKENS = 64_000;
const TIER_MODEL = { complex: "claude-opus-5-5", default: "claude-sonnet-5-5", quick: "claude-haiku-5-5" } as const;

export interface FallbackState {
  apiKey: string;
  /** subscription calls a week; 0 = no budget, only rate_limited switches */
  weeklyBudget: number;
  week: string;
  /** calls made on the subscription this week, and on the API */
  subCalls: number;
  apiCalls: number;
  /** until when calls go to the API after a rate_limited (ms epoch) */
  apiUntil: number;
}

/** Sunday of this week, as yyyy-mm-dd (local time). */
export function weekStart(now = new Date()): string {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function loadFallback(): FallbackState {
  let s: Partial<FallbackState> = {};
  try {
    s = JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {}
  const week = weekStart();
  const fresh = s.week !== week;
  return {
    apiKey: s.apiKey ?? "",
    weeklyBudget: s.weeklyBudget ?? 0,
    week,
    subCalls: fresh ? 0 : (s.subCalls ?? 0),
    apiCalls: fresh ? 0 : (s.apiCalls ?? 0),
    apiUntil: s.apiUntil ?? 0,
  };
}

export function saveFallback(patch: Partial<FallbackState>): FallbackState {
  const s = { ...loadFallback(), ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
  return s;
}

/** Why calls go to the API now, or null when they go to the subscription. */
export function apiReason(s = loadFallback()): string | null {
  if (!s.apiKey) return null;
  if (Date.now() < s.apiUntil) return "התקבלה שגיאת מכסה (429)";
  if (s.weeklyBudget > 0 && s.subCalls >= SWITCH_AT * s.weeklyBudget) return "השימוש השבועי עבר 90% מהתקציב";
  return null;
}

/* ---- the Claude API, with the runtime's call shape ---- */
type Turns = Parameters<SampleFn>[0];
type Block = Record<string, unknown>;
type Msg = { role: "user" | "assistant"; content: string | Block[] };

const err = (code: string, message: string) => Object.assign(new Error(message), { code });

const modelFor = (o?: SampleOptions) => (o?.model?.startsWith("claude-") ? o.model : TIER_MODEL[o?.modelTier ?? "default"]);

async function toBase64(b: Blob): Promise<string> {
  const bytes = new Uint8Array(await b.arrayBuffer());
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

async function toMessages(input: Turns, images?: Blob[]): Promise<Msg[]> {
  const msgs: Msg[] = typeof input === "string" ? [{ role: "user", content: input }] : input.map((t) => ({ ...t }));
  if (images?.length) {
    const last = msgs.findLastIndex((m) => m.role === "user");
    const pics = await Promise.all(images.map(async (b) => ({ type: "image", source: { type: "base64", media_type: b.type || "image/png", data: await toBase64(b) } })));
    msgs[last] = { role: "user", content: [...pics, { type: "text", text: msgs[last].content as string }] };
  }
  return msgs;
}

/** Retries of a 429 or 529 from the API (several lessons written at once), waiting retry-after or 15, 30, 60, 120 s. */
const RETRY_WAITS = [15, 30, 60, 120];

/** A POST to the Claude API from the browser; a failed status becomes a runtime-style error code. */
async function post(key: string, path: string, body: Block, signal?: AbortSignal, attempt = 0): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(`https://api.anthropic.com/v1/${path}`, {
      method: "POST",
      signal,
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (e) {
    throw signal?.aborted ? err("cancelled", "cancelled") : err("network_error", String(e));
  }
  if ((res.status === 429 || res.status === 529) && attempt < RETRY_WAITS.length) {
    const wait = Number(res.headers.get("retry-after")) || RETRY_WAITS[attempt];
    await new Promise((r) => setTimeout(r, wait * 1000));
    return post(key, path, body, signal, attempt + 1);
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const code = res.status === 429 ? "rate_limited" : res.status === 529 ? "overloaded" : res.status === 401 ? "api_key_invalid" : res.status >= 500 ? "upstream_error" : "api_error";
    throw err(code, `Claude API ${res.status}: ${text.slice(0, 300)}`);
  }
  return res;
}

/** Checks the key and that this page may reach the API, with a free token count (no generation). */
export async function testConnection(key: string): Promise<{ ok: true } | { ok: false; code: string; message: string }> {
  try {
    await post(key, "messages/count_tokens", { model: TIER_MODEL.quick, messages: [{ role: "user", content: "hi" }] });
    return { ok: true };
  } catch (e) {
    const x = e as { code?: string; message?: string };
    return { ok: false, code: x.code ?? "unknown", message: x.message ?? String(e) };
  }
}

/** Tokens the API calls of this page load used (for the cost of a run outside the browser, tools/sim/driver.mts). */
export const apiUsage = { input: 0, cacheRead: 0, cacheWrite: 0, output: 0, calls: 0 };

/** One streamed request; returns the assistant's blocks and why it stopped. */
async function stream(key: string, body: Block, signal: AbortSignal | undefined, onDelta: (d: string) => void) {
  const res = await post(key, "messages", { ...body, stream: true }, signal);
  const blocks: Block[] = [];
  let stop = "";
  const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader();
  let buf = "";
  for (;;) {
    const { value, done } = await reader.read().catch((e) => {
      throw signal?.aborted ? err("cancelled", "cancelled") : err("network_error", String(e));
    });
    if (done) break;
    buf += value;
    let nl: number;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line.startsWith("data:")) continue;
      const ev = JSON.parse(line.slice(5));
      if (ev.type === "message_start") {
        const u = ev.message?.usage ?? {};
        apiUsage.calls++;
        apiUsage.input += u.input_tokens ?? 0;
        apiUsage.cacheRead += u.cache_read_input_tokens ?? 0;
        apiUsage.cacheWrite += u.cache_creation_input_tokens ?? 0;
      } else if (ev.type === "content_block_start") blocks[ev.index] = { ...ev.content_block, _json: "" };
      else if (ev.type === "content_block_delta") {
        const b = blocks[ev.index];
        if (ev.delta.type === "text_delta") {
          b.text = (b.text as string) + ev.delta.text;
          onDelta(ev.delta.text);
        } else if (ev.delta.type === "input_json_delta") b._json += ev.delta.partial_json;
        // thinking goes back unchanged in the tool loop, with its signature
        else if (ev.delta.type === "thinking_delta") b.thinking = ((b.thinking as string) ?? "") + ev.delta.thinking;
        else if (ev.delta.type === "signature_delta") b.signature = ((b.signature as string) ?? "") + ev.delta.signature;
      } else if (ev.type === "message_delta") {
        stop = ev.delta.stop_reason ?? stop;
        apiUsage.output += ev.usage?.output_tokens ?? 0;
      }
      else if (ev.type === "error") throw err(ev.error?.type === "overloaded_error" ? "overloaded" : "upstream_error", ev.error?.message ?? "stream error");
    }
  }
  for (const b of blocks) {
    if (b.type === "tool_use") b.input = b._json ? JSON.parse(b._json as string) : {};
    delete b._json;
  }
  return { blocks, stop };
}

/** The runtime's `sample`, on the Claude API: streaming, images and the tool loop. */
async function apiSample(key: string, input: Turns, o?: SampleOptions) {
  const model = modelFor(o);
  const tools: SampleTool[] = o?.tools ?? [];
  const messages = await toMessages(input, o?.images);
  const body: Block = {
    model,
    max_tokens: MAX_TOKENS,
    // the long instructions and sources repeat across the tool rounds and the lesson's parts: cache them
    cache_control: { type: "ephemeral" },
    messages,
    ...(tools.length ? { tools: tools.map((t) => ({ name: t.name, description: t.description, input_schema: t.inputSchema ?? { type: "object" } })) } : {}),
  };
  let text = "";
  const onDelta = (delta: string) => {
    text += delta;
    o?.onText?.({ text, delta });
  };
  for (;;) {
    const { blocks, stop } = await stream(key, body, o?.signal, onDelta);
    if (stop !== "tool_use") return { text, truncated: stop === "max_tokens", modelTierApplied: o?.modelTier ?? "default", modelApplied: model };
    messages.push({ role: "assistant", content: blocks });
    const results = await Promise.all(
      blocks
        .filter((b) => b.type === "tool_use")
        .map(async (b) => {
          const t = tools.find((x) => x.name === b.name);
          try {
            const out = t ? await t.execute(b.input as Record<string, unknown>, { signal: o?.signal ?? new AbortController().signal }) : `unknown tool ${b.name}`;
            return { type: "tool_result", tool_use_id: b.id, content: typeof out === "string" ? out : JSON.stringify(out) };
          } catch (e) {
            return { type: "tool_result", tool_use_id: b.id, content: String(e), is_error: true };
          }
        }),
    );
    messages.push({ role: "user", content: results });
  }
}

const JSON_ONLY = "\n\nReturn only valid JSON, with no text before or after it and no code fence.";

async function apiJson<T>(key: string, input: Turns, o?: SampleOptions): Promise<T> {
  const turns = typeof input === "string" ? input + JSON_ONLY : input.map((t, i) => (i === input.length - 1 ? { ...t, content: t.content + JSON_ONLY } : t));
  const { text } = await apiSample(key, turns, { ...o, onText: undefined });
  const s = text.replace(/^\s*```(?:json)?\s*|\s*```\s*$/g, "");
  try {
    return JSON.parse(s) as T;
  } catch {
    throw err("invalid_json", "the API answer was not JSON");
  }
}

/**
 * Wraps the runtime's `sample`: subscription first, the API past 90% of the weekly budget or on
 * rate_limited. With no runtime but a key, every call goes to the API.
 */
export function withFallback(s: SampleFn | null): SampleFn | null {
  if (!s && !loadFallback().apiKey) return null;
  const route = async <R,>(sub: () => Promise<R>, api: (key: string) => Promise<R>): Promise<R> => {
    const st = loadFallback();
    if (st.apiKey && (!s || apiReason(st))) {
      saveFallback({ apiCalls: st.apiCalls + 1 });
      return api(st.apiKey);
    }
    try {
      const r = await sub();
      saveFallback({ subCalls: loadFallback().subCalls + 1 });
      return r;
    } catch (e) {
      const key = loadFallback().apiKey;
      if ((e as { code?: string })?.code !== "rate_limited" || !key) throw e;
      const now = loadFallback();
      saveFallback({ apiUntil: Date.now() + COOLDOWN_MS, apiCalls: now.apiCalls + 1 });
      return api(key);
    }
  };
  const wrapped = ((input: Turns, o?: SampleOptions) => route(() => s!(input, o), (k) => apiSample(k, input, o))) as SampleFn;
  wrapped.json = (<T,>(input: Turns, o?: SampleOptions) => route(() => s!.json<T>(input, o), (k) => apiJson<T>(k, input, o))) as SampleFn["json"];
  wrapped.limits = () => (s ? s.limits() : Promise.resolve({ maxPromptBytes: 900_000, images: { maxCount: 20 }, tools: { maxCount: 20 } }));
  return wrapped;
}
