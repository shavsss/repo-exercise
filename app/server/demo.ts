// Demo mode (no API key): replays a prepared lesson so the interface can be seen
// and tested. The code runs shown were executed for real; their stdout is stored
// verbatim in demo/code-runs.json.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type Anthropic from "@anthropic-ai/sdk";
import { readPages } from "./books.js";
import { saveConversation, type Conversation, type StoredMessage } from "./store.js";
import type { ServerEvent } from "./chat.js";

type Block = Anthropic.Beta.Messages.BetaContentBlock;
const here = path.dirname(fileURLToPath(import.meta.url));
const runs: Record<string, { code: string; stdout: string }> = JSON.parse(
  fs.readFileSync(path.join(here, "demo", "code-runs.json"), "utf8"),
);
const lesson = fs.readFileSync(path.join(here, "demo", "lesson.md"), "utf8");

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const t = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => (clearTimeout(t), resolve()), { once: true });
  });

let counter = 0;
const id = (prefix: string) => `${prefix}_demo${Date.now().toString(36)}${(counter++).toString(36)}`;

function codeBlocks(name: string): Block[] {
  const run = runs[name];
  const useId = id("srvtoolu");
  return [
    { type: "server_tool_use", id: useId, name: "bash_code_execution", input: { command: `python3 - <<'EOF'\n${run.code}EOF` } } as unknown as Block,
    {
      type: "bash_code_execution_tool_result",
      tool_use_id: useId,
      content: { type: "bash_code_execution_result", stdout: run.stdout, stderr: "", return_code: 0, content: [] },
    } as unknown as Block,
  ];
}

async function streamMessage(blocks: Block[], send: (e: ServerEvent) => void, signal: AbortSignal) {
  send({ type: "msg_start" });
  for (const [index, block] of blocks.entries()) {
    if (signal.aborted) return false;
    if (block.type === "text") {
      send({ type: "block_start", index, block: { ...block, text: "" } });
      const words = block.text.split(/(?<=\s)/);
      for (let i = 0; i < words.length; i += 6) {
        if (signal.aborted) return false;
        send({ type: "delta", index, kind: "text", text: words.slice(i, i + 6).join("") });
        await sleep(12, signal);
      }
    } else {
      send({ type: "block_start", index, block });
      await sleep(block.type === "server_tool_use" || block.type === "tool_use" ? 700 : 150, signal);
    }
    send({ type: "block_done", index, block });
  }
  return true;
}

export async function streamDemo({ conv, send, signal }: { conv: Conversation; send: (e: ServerEvent) => void; signal: AbortSignal }) {
  // 1) read the pages
  const toolId = id("toolu");
  const first: Block[] = [
    { type: "text", text: "אקרא קודם את עמודים 238–241 בכרך א׳, כדי שהשיעור ייצא מהטקסט עצמו.", citations: null } as Block,
    { type: "tool_use", id: toolId, name: "read_book_pages", input: { book_id: "math1", from: "238", to: "241", by: "label" } } as Block,
  ];
  if (!(await streamMessage(first, send, signal))) return;
  const m1: StoredMessage = { role: "assistant", content: first as never, info: { model: "demo", stop: "tool_use", ts: Date.now() }, demo: true };
  conv.messages.push(m1);
  send({ type: "msg_done", message: m1 });

  const toolMsg: StoredMessage = {
    role: "user",
    content: [{ type: "tool_result", tool_use_id: toolId, content: readPages("math1", "238", "241", "label").text }],
    demo: true,
  };
  conv.messages.push(toolMsg);
  send({ type: "tool_results", message: toolMsg });

  // 2) the lesson, with the code runs interleaved where the markers are
  const blocks: Block[] = [];
  for (const part of lesson.split(/<!--code:(\w+)-->/).map((p, i) => ({ p, code: i % 2 === 1 }))) {
    if (part.code) blocks.push(...codeBlocks(part.p));
    else if (part.p.trim()) blocks.push({ type: "text", text: part.p.trim(), citations: null } as Block);
  }
  if (!(await streamMessage(blocks, send, signal))) return;
  const m2: StoredMessage = { role: "assistant", content: blocks as never, info: { model: "demo", stop: "end_turn", ts: Date.now() }, demo: true };
  conv.messages.push(m2);
  saveConversation(conv);
  send({ type: "msg_done", message: m2 });
}
