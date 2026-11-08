#!/usr/bin/env node
// Smoke + screenshot check for the two lab apps (Lanchester = core, Gilua = eng), run
// against the local test harness (tools/test/make-harness.mjs + stub.js). Builds nothing:
// run `npm run build` in the app dir first.
//
//   node check.mjs <core|eng> <outdir> [--app <app dir>] [--keep-open]
//
// Flow, per color scheme (light, dark) and viewport (1300x900, 400x860), each in a fresh
// browser context (fresh stub db): home -> first available module (stub plans its lessons)
// -> lesson 1 -> "כתוב את שיעור 1" (scripted plan + 3 parts, part 2 cut off and continued)
// -> lesson top and the figure/think area -> #summary page.
// Prints a JSON summary; exits 1 on page errors or a flow step that failed, 2 on bad setup.
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
// the repository root (this file is core/tools/test-check/check.mjs)
const REPO = path.resolve(here, "../../..");
// a partial copy of the published library (<LIB>/<core|eng>/lib, <LIB>/<core|eng>/dict/he.txt), when
// artifact/lib is not on disk: set HARNESS_LIB to its folder (see README.md here)
const LIB = process.env.HARNESS_LIB ? path.resolve(process.env.HARNESS_LIB) : path.join(REPO, "..", "harness-lib");
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  if (i < 0) return null;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const appArg = flag("--app");
const [target, outArg] = args;
if (!["core", "eng"].includes(target) || !outArg) {
  console.error("usage: node check.mjs <core|eng> <outdir> [--app <path to app dir>]");
  process.exit(2);
}
const appDir = path.resolve(appArg ?? path.join(REPO, target, "app"));
const outDir = path.resolve(outArg);
const shotsDir = path.join(outDir, "shots");
const harnessDir = path.join(outDir, "harness");
fs.mkdirSync(shotsDir, { recursive: true });

function die(msg) {
  console.log(JSON.stringify({ app: target, appDir, pass: false, setupError: msg }, null, 2));
  process.exit(2);
}
for (const f of ["dist/app.js", "dist/app.css", "artifact/index.html", "tools/test/make-harness.mjs"])
  if (!fs.existsSync(path.join(appDir, f))) die(`missing ${path.join(appDir, f)} (run npm run build?)`);
if (!fs.existsSync(path.join(appDir, "artifact/lib/index.json")))
  die(`missing ${appDir}/artifact/lib/index.json: symlink it, e.g. ln -sfn ${path.join(LIB, target, "lib")} ${appDir}/artifact/lib`);

// 1. harness
const made = execFileSync("node", [path.join(appDir, "tools/test/make-harness.mjs"), harnessDir], { cwd: appDir, encoding: "utf8" }).trim();
const modId = /module (\S+),/.exec(made)?.[1];
const modPart = JSON.parse(fs.readFileSync(path.join(appDir, "artifact/lib/index.json"), "utf8")).modules.find((m) => m.id === modId)?.part;
// the summaries' spell-check dictionary (dict/he.txt), not linked by make-harness
const dictSrc = [path.join(appDir, "artifact/dict"), path.join(LIB, target, "dict")].find((d) => fs.existsSync(path.join(d, "he.txt")));
fs.rmSync(path.join(harnessDir, "dict"), { recursive: true, force: true });
if (dictSrc) fs.symlinkSync(dictSrc, path.join(harnessDir, "dict"));

// 2. static server on a free port
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".txt": "text/plain; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "");
  const file = path.join(harnessDir, rel || "test.html");
  if (!file.startsWith(harnessDir)) return res.writeHead(403).end();
  fs.readFile(file, (err, data) => {
    if (err) return res.writeHead(404).end("not found");
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream", "cache-control": "no-store" });
    res.end(data);
  });
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

// 3. browser
const req = createRequire(import.meta.url);
let playwright;
try {
  playwright = req("playwright");
} catch {
  playwright = req("/opt/node-tools/node_modules/playwright");
}
const browser = await playwright.chromium.launch();
const VIEWPORTS = [
  { name: "wide", width: 1300, height: 900 },
  { name: "narrow", width: 400, height: 860 },
];
const SCHEMES = ["light", "dark"];
const consoleErrors = [];
const pageErrors = [];
const failedRequests = [];
const flowErrors = [];
const screenshots = [];
const seen = new Set();
const note = (list, entry) => {
  const key = JSON.stringify(entry.text ?? entry.url ?? entry);
  if (seen.has(key)) return;
  seen.add(key);
  list.push(entry);
};

async function shot(page, name) {
  const file = path.join(shotsDir, `${name}.png`);
  await page.waitForTimeout(400);
  await page.screenshot({ path: file });
  screenshots.push(file);
}

function watch(page, where) {
  page.on("console", (m) => {
    if (m.type() === "error") note(consoleErrors, { where, text: m.text().slice(0, 500) });
  });
  page.on("pageerror", (e) => note(pageErrors, { where, text: String(e.message ?? e).slice(0, 500) }));
  page.on("requestfailed", (r) => note(failedRequests, { where, url: r.url().replace(base, ""), error: r.failure()?.errorText }));
  page.on("response", (r) => {
    if (r.status() >= 400) note(failedRequests, { where, url: r.url().replace(base, ""), status: r.status() });
  });
}

async function step(label, fn) {
  try {
    await fn();
    return true;
  } catch (e) {
    flowErrors.push({ step: label, error: String(e.message ?? e).split("\n")[0].slice(0, 300) });
    return false;
  }
}

const lessonLog = {};
for (const scheme of SCHEMES) {
  for (const vp of VIEWPORTS) {
    const tag = `${scheme}-${vp.name}`;
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, colorScheme: scheme, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    watch(page, tag);
    let ok = await step(`${tag}: home`, async () => {
      await page.goto(`${base}/test.html`);
      await page.locator("button.card").first().waitFor({ timeout: 20000 });
      await shot(page, `${tag}-1-home`);
    });
    ok = ok && (await step(`${tag}: module`, async () => {
      // the harness's module (window.__module) when the home lists it, else the first card
      const own = page.locator("button.card").filter({ hasText: new RegExp(`^\\s*${modId.replace(".", "\\.")}(?!\\d)`) });
      await ((await own.count()) ? own.first() : page.locator("button.card").first()).click();
      await page.locator("button.lesson-card").first().waitFor({ timeout: 20000 });
      await shot(page, `${tag}-2-module`);
    }));
    ok = ok && (await step(`${tag}: lesson`, async () => {
      await page.locator("button.lesson-card").first().click();
      const write = page.getByRole("button", { name: /כתוב את שיעור 1/ });
      await write.waitFor({ timeout: 15000 });
      await shot(page, `${tag}-3-lesson-before`);
      await write.click();
      await page.waitForFunction(() => (window.__log || []).includes("part3"), null, { timeout: 60000 });
      // after the last part: lesson saved, then the course memory is updated
      await page.waitForFunction(() => (window.__log || []).includes("memory"), null, { timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(1500);
      lessonLog[tag] = await page.evaluate(() => window.__log);
      // back to the top of the lesson
      await page.evaluate(() => document.querySelectorAll("*").forEach((el) => { if (el.scrollTop) el.scrollTop = 0; }));
      await shot(page, `${tag}-4-lesson-top`);
      const mid = page.locator("figure, .figure, .think, [class*=think]").first();
      if (await mid.count()) {
        await mid.scrollIntoViewIfNeeded();
        await shot(page, `${tag}-5-lesson-blocks`);
      }
      const scene = page.locator("canvas").first();
      if (await scene.count()) {
        await scene.scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
        await shot(page, `${tag}-6-lesson-canvas`);
      }
    }));
    await step(`${tag}: summary`, async () => {
      const sp = await ctx.newPage();
      watch(sp, `${tag}#summary`);
      await sp.goto(`${base}/test.html#summary`);
      await sp.waitForTimeout(2500);
      await shot(sp, `${tag}-7-summary`);
      // open the module's summary (the editor) from the tree; best effort, the tree markup may change
      try {
        if (!(await sp.getByText(modId, { exact: true }).first().isVisible())) await sp.getByText(modPart, { exact: true }).first().click({ timeout: 3000 });
        await sp.getByText(modId, { exact: true }).first().click({ timeout: 3000 });
        await sp.waitForTimeout(1500);
        await shot(sp, `${tag}-8-summary-module`);
      } catch (e) {
        flowErrors.push({ step: `${tag}: summary module (soft)`, soft: true, error: String(e.message ?? e).split("\n")[0].slice(0, 200) });
      }
      await sp.close();
    });
    await ctx.close();
  }
}
await browser.close();
server.close();

const pass = pageErrors.length === 0 && flowErrors.filter((f) => !f.soft).length === 0;
console.log(
  JSON.stringify(
    { app: target, appDir, harness: made, pass, pageErrors, flowErrors, consoleErrors, failedRequests, lessonLog, screenshots },
    null,
    2,
  ),
);
process.exit(pass ? 0 : 1);
