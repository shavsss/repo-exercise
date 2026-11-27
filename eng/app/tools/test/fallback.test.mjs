// Unit tests of the Claude API fallback: src/fallback.ts (the weekly count, the 90% switch, the switch on
// rate_limited, and the API call shape: streaming, the tool loop, JSON). fetch is stubbed; no model is called.
// Run from the app folder: node tools/test/fallback.test.mjs
import { build } from "esbuild";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const mem = {};
globalThis.localStorage = { getItem: (k) => mem[k] ?? null, setItem: (k, v) => (mem[k] = v) };
const src = fileURLToPath(new URL("../../src/fallback.ts", import.meta.url));
const out = await build({ entryPoints: [src], bundle: true, format: "esm", write: false, platform: "neutral" });
const F = await import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));

// the week starts on Sunday
assert.equal(F.weekStart(new Date(2026, 10, 27)), "2026-11-22"); // Friday
assert.equal(F.weekStart(new Date(2026, 10, 22, 0, 1)), "2026-11-22"); // Sunday
assert.equal(F.weekStart(new Date(2026, 10, 21, 23, 59)), "2026-11-15"); // Saturday

// stubbed API: a streamed answer, a tool round first when tools are given
const calls = [];
const sse = (events) => new Response(events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join(""), { status: 200 });
globalThis.fetch = async (url, init) => {
  const body = JSON.parse(init.body);
  calls.push({ url, body, headers: init.headers });
  if (body.messages?.[0]?.content === "busy" && calls.filter((c) => c.body.messages?.[0]?.content === "busy").length === 1)
    return new Response("{}", { status: 429, headers: { "retry-after": "0.01" } });
  if (url.endsWith("count_tokens")) return new Response('{"input_tokens":1}', { status: init.headers["x-api-key"] === "good" ? 200 : 401 });
  const toolRound = body.tools && !body.messages.some((m) => Array.isArray(m.content) && m.content.some((b) => b.type === "tool_result"));
  if (toolRound)
    return sse([
      { type: "content_block_start", index: 0, content_block: { type: "thinking", thinking: "", signature: "" } },
      { type: "content_block_delta", index: 0, delta: { type: "thinking_delta", thinking: "need " } },
      { type: "content_block_delta", index: 0, delta: { type: "thinking_delta", thinking: "calc" } },
      { type: "content_block_delta", index: 0, delta: { type: "signature_delta", signature: "sig" } },
      { type: "content_block_start", index: 1, content_block: { type: "tool_use", id: "t1", name: "calc", input: {} } },
      { type: "content_block_delta", index: 1, delta: { type: "input_json_delta", partial_json: '{"x":' } },
      { type: "content_block_delta", index: 1, delta: { type: "input_json_delta", partial_json: "2}" } },
      { type: "message_delta", delta: { stop_reason: "tool_use" } },
    ]);
  const text = body.messages.at(-1).content.toString().includes("JSON") ? '```json\n{"a":1}\n```' : "שלום";
  return sse([
    { type: "content_block_start", index: 0, content_block: { type: "text", text: "" } },
    { type: "content_block_delta", index: 0, delta: { type: "text_delta", text: text.slice(0, 2) } },
    { type: "content_block_delta", index: 0, delta: { type: "text_delta", text: text.slice(2) } },
    { type: "message_delta", delta: { stop_reason: "end_turn" } },
  ]);
};

const rateLimited = async () => {
  throw Object.assign(new Error("limit"), { code: "rate_limited" });
};
let subN = 0;
const ok = async () => (subN++, { text: "sub", truncated: false, modelTierApplied: "default" });
const mk = (f) => Object.assign(f, { json: f, limits: async () => ({ maxPromptBytes: 1 }) });

// no key: the runtime's errors pass through
assert.equal(F.withFallback(null), null);
await assert.rejects(F.withFallback(mk(rateLimited))("x"), { code: "rate_limited" });

// a rate_limited moves the call (and the next 30 minutes) to the API
F.saveFallback({ apiKey: "good", weeklyBudget: 0 });
let deltas = [];
const r = await F.withFallback(mk(rateLimited))("hi", { model: "claude-opus-5-5", onText: (u) => deltas.push(u) });
assert.equal(r.text, "שלום");
assert.equal(r.modelApplied, "claude-opus-5-5");
assert.deepEqual(deltas.map((d) => d.text), ["של", "שלום"]);
assert.equal(calls.at(-1).headers["anthropic-dangerous-direct-browser-access"], "true");
assert.equal(calls.at(-1).body.stream, true);
assert.ok(F.apiReason()?.includes("429"));
await F.withFallback(mk(ok))("x");
assert.equal(subN, 0, "during the cooldown calls skip the subscription");

// the weekly budget: below 90% on the subscription, from 90% on the API
F.saveFallback({ apiUntil: 0, weeklyBudget: 10, subCalls: 8 });
assert.equal(F.apiReason(), null);
await F.withFallback(mk(ok))("x");
assert.equal(subN, 1);
assert.equal(F.loadFallback().subCalls, 9);
assert.ok(F.apiReason()?.includes("90%"));
await F.withFallback(mk(ok))("x");
assert.equal(subN, 1, "at 90% calls go to the API");

// a new week resets the counts
mem["claude-api-fallback"] = JSON.stringify({ ...JSON.parse(mem["claude-api-fallback"]), week: "2000-01-02" });
assert.equal(F.loadFallback().subCalls, 0);
assert.equal(F.apiReason(), null);

// the tool loop and the tier model
F.saveFallback({ apiUntil: Date.now() + 60_000 });
let got;
const tools = [{ name: "calc", description: "c", execute: (i) => ((got = i), "4") }];
const t = await F.withFallback(mk(ok))("q", { modelTier: "quick", tools });
assert.deepEqual(got, { x: 2 });
assert.equal(t.text, "שלום");
assert.equal(calls.at(-1).body.model, "claude-haiku-5-5");
assert.equal(calls.at(-1).body.messages.at(-1).content[0].type, "tool_result");
assert.deepEqual(calls.at(-1).body.messages.at(-2).content[0], { type: "thinking", thinking: "need calc", signature: "sig" }, "thinking goes back whole");

// JSON, with a code fence around it
assert.deepEqual(await F.withFallback(mk(ok)).json("give JSON"), { a: 1 });

// a 429 from the API is waited out and retried
assert.equal((await F.withFallback(mk(ok))("busy")).text, "שלום");

// the connection check
assert.deepEqual(await F.testConnection("good"), { ok: true });
assert.equal((await F.testConnection("bad")).code, "api_key_invalid");

console.log("fallback: all tests passed");
