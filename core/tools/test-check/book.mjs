#!/usr/bin/env node
// The lesson as a book (round 6): a check with screenshots for Lanchester (core) and Gilua (eng), on the local
// test harness (tools/test/make-harness.mjs + stub.js). Builds nothing: run `npm run build` in the app dir first.
//
//   node book.mjs <core|eng> <outdir> [--app <app dir>] [--only light-wide] [--quick]
//
// The book is switched on in the Aa settings, and a stored lesson is seeded: the round-6 sample lesson
// (docs/research/round6/book/research/sample_lesson.md) followed by the harness's lesson with every block type.
// Per color scheme (light, dark) and viewport (1300x900, 400x860): open the lesson (the cover opens), turn pages
// (keys, a mid-turn frame), a think question with a confidence, a margin note, a consultation card and its
// discussion on the facing page (and a turn with it open), the contents and a jump (with the way back), a plate
// lifted to the facing page, the notebook, a lesson written while it is read (seen pages must not change), the
// reduced-motion turn, and a new window size that keeps the reading place. Checks on every frame: no horizontal
// scroll, no block cut without a mark, nothing outside its page. Prints JSON; exit 0 when everything passed.
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(here, "../../..");
const LIB = process.env.HARNESS_LIB ? path.resolve(process.env.HARNESS_LIB) : path.join(REPO, "..", "harness-lib");
const args = process.argv.slice(2);
const flag = (name, takes = true) => {
  const i = args.indexOf(name);
  if (i < 0) return null;
  const v = takes ? args[i + 1] : true;
  args.splice(i, takes ? 2 : 1);
  return v;
};
const appArg = flag("--app");
const only = flag("--only");
const quick = flag("--quick", false);
const [target, outArg] = args;
if (!["core", "eng"].includes(target) || !outArg) {
  console.error("usage: node book.mjs <core|eng> <outdir> [--app <app dir>] [--only <scheme-viewport>] [--quick]");
  process.exit(2);
}
const appDir = path.resolve(appArg ?? path.join(REPO, target, "app"));
const outDir = path.resolve(outArg);
const harnessDir = path.join(outDir, `harness-${target}`);
fs.mkdirSync(outDir, { recursive: true });
const die = (msg) => {
  console.log(JSON.stringify({ app: target, pass: false, setupError: msg }, null, 2));
  process.exit(2);
};
for (const f of ["dist/app.js", "dist/app.css", "artifact/index.html", "tools/test/make-harness.mjs"]) if (!fs.existsSync(path.join(appDir, f))) die(`missing ${path.join(appDir, f)} (run npm run build?)`);
if (!fs.existsSync(path.join(appDir, "artifact/lib/index.json"))) die(`missing ${appDir}/artifact/lib/index.json (see README.md here)`);

// 1. the harness, and the seeded lesson
const made = execFileSync("node", [path.join(appDir, "tools/test/make-harness.mjs"), harnessDir], { cwd: appDir, encoding: "utf8" }).trim();
const html = fs.readFileSync(path.join(harnessDir, "test.html"), "utf8");
const grab = (name) => JSON.parse(new RegExp(`window\\.${name}=(.*?);window\\.`).exec(html)[1]);
const modId = grab("__module");
const lessons = grab("__lessons");
const harnessAnswer = grab("__answer");
const sample = fs.readFileSync(path.join(REPO, "docs/research/round6/book/research/sample_lesson.md"), "utf8");
const lessonText = `${sample.trim()}\n\n## כל סוגי הבלוקים\n\n${harnessAnswer}`;
const P = "data/users/u_test/profile/";
const now = Date.now();
const seedDb = [
  [P + `modules/${modId}`, { lessons, convs: { 0: "bookseed" }, done: [] }],
  [P + "convs/bookseed", { title: lessons[0].title, moduleId: modId, lesson: 0, createdAt: now - 3600e3, updatedAt: now - 3600e3, count: 2 }],
  [P + "convs/bookseed/msgs/u1", { role: "user", text: `כתוב את שיעור 1 במודול ${modId}: ${lessons[0].title}.`, mode: "lesson", ts: now - 3600e3 }],
  [P + "convs/bookseed/msgs/a1", { role: "assistant", text: lessonText, mode: "lesson", ts: now - 3590e3, model: "test" }],
];
const READ_KEY = `${target}-lab:reading`;

// 2. a static server
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

// 3. the browser
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
const pageErrors = [];
const consoleErrors = [];
const flowErrors = [];
const checks = [];
const screenshots = [];

async function shot(page, tag, name) {
  const file = path.join(outDir, `${target}-${tag}-${name}.png`);
  await page.waitForTimeout(250);
  await page.screenshot({ path: file });
  screenshots.push(file);
  await audit(page, tag, name);
}

/** The checks on every frame: horizontal scroll, blocks cut without a mark, things outside their page. */
async function audit(page, tag, name) {
  const r = await page.evaluate(() => {
    const out = [];
    const se = document.scrollingElement;
    if (se && se.scrollWidth > window.innerWidth + 1) out.push(`horizontal scroll: ${se.scrollWidth} > ${window.innerWidth}`);
    // the app itself shifted sideways inside a scrolling ancestor
    for (const sel of [".topbar", ".bk-root", ".bk-bar"]) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.left < -1 || r.right > window.innerWidth + 1) out.push(`${sel} outside the window: ${Math.round(r.left)}..${Math.round(r.right)}`);
    }
    for (const el of document.querySelectorAll(".app, .body, .main")) if (el.scrollLeft) out.push(`${el.className.split(" ")[0]} scrolled sideways by ${el.scrollLeft}`);
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width && r.right > window.innerWidth + 2 && getComputedStyle(el).position !== "fixed" && !el.closest(".bk-galley, .bk-page.is-hidden, .bk-ghost, [aria-hidden=true], .sidebar:not(.is-open)")) {
        const vis = el.closest(".bk-page") ? el.closest(".bk-page").classList.contains("is-shown") : true;
        if (vis && !el.closest(".bk-frag.is-over, .katex-display, .table-wrap, .mn-layer")) {
          out.push(`outside the window: ${el.className || el.tagName} (${Math.round(r.right)})`);
          if (out.length > 6) break;
        }
      }
    }
    // a block's window that shows less than its block without being a cut paragraph (head) or marked (is-over)
    for (const f of document.querySelectorAll(".bk-page.is-shown .bk-frag")) {
      if (f.classList.contains("is-over") || f.classList.contains("is-head")) continue;
      const inner = f.firstElementChild;
      const mt = -parseFloat(inner.style.marginTop || "0");
      const need = inner.scrollHeight - mt;
      if (need > f.clientHeight + 3) out.push(`cut without a mark: ${f.dataset.chunk} (${Math.round(need)} > ${f.clientHeight})`);
    }
    // a block that scrolls although it is shorter than a page: its measure in the galley was wrong
    for (const f of document.querySelectorAll(".bk-page.is-shown .bk-frag.is-over")) {
      const cap = f.closest(".bk-body")?.clientHeight ?? 0;
      const h = parseFloat(f.style.height);
      if (cap && h < cap - 2 && !f.querySelector("img")) out.push(`scrolls though shorter than a page (measure wrong): ${f.dataset.chunk} (${Math.round(h)} < ${cap})`);
    }
    // nothing of the text below the bottom of its page
    for (const p of document.querySelectorAll(".bk-page.is-shown")) {
      const pb = p.getBoundingClientRect();
      for (const f of p.querySelectorAll(".bk-frag")) {
        const r = f.getBoundingClientRect();
        if (r.bottom > pb.bottom + 1 || r.top < pb.top - 1) out.push(`window outside its page: ${f.dataset.chunk}`);
      }
    }
    return out;
  });
  checks.push({ frame: `${tag}-${name}`, ok: r.length === 0, problems: r });
}

function watch(page, where) {
  page.on("console", (m) => {
    if (m.type() === "error" && !/Failed to load resource/.test(m.text())) consoleErrors.push({ where, text: m.text().slice(0, 400) });
  });
  page.on("pageerror", (e) => pageErrors.push({ where, text: String(e.message ?? e).slice(0, 400) }));
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

async function fresh(vp, scheme, reduced = false, extra = {}) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, colorScheme: scheme, reducedMotion: reduced ? "reduce" : "no-preference" });
  await ctx.addInitScript(
    ({ db, key, extra }) => {
      if (!sessionStorage.getItem("seeded")) {
        sessionStorage.setItem("seeded", "1");
        localStorage.setItem("stubdb", JSON.stringify(db));
        localStorage.setItem(key, JSON.stringify({ book: "on", v: 2, rv: 2, touched: ["book"] }));
      }
      Object.assign(window, extra);
    },
    { db: seedDb, key: READ_KEY, extra },
  );
  const page = await ctx.newPage();
  return { ctx, page };
}

async function openLesson(page, k = 0) {
  await page.goto(`${base}/test.html`);
  await page.locator("button.card").first().waitFor({ timeout: 20000 });
  const own = page.locator("button.card").filter({ hasText: new RegExp(`^\\s*${modId.replace(".", "\\.")}(?!\\d)`) });
  await ((await own.count()) ? own.first() : page.locator("button.card").first()).click();
  await page.locator("button.lesson-card").nth(k).waitFor({ timeout: 20000 });
  await page.locator("button.lesson-card").nth(k).click();
}

const visibleText = (page) => page.evaluate(() => [...document.querySelectorAll(".bk-page.is-shown")].map((p) => p.querySelector(".bk-body")?.innerText ?? ""));
async function turnUntil(page, sel, max = 40) {
  for (let k = 0; k < max; k++) {
    if (await page.locator(`.bk-page.is-shown ${sel}`).count()) return true;
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(460);
  }
  return false;
}

for (const scheme of SCHEMES) {
  for (const vp of VIEWPORTS) {
    const tag = `${scheme}-${vp.name}`;
    if (only && only !== tag) continue;
    const { ctx, page } = await fresh(vp, scheme);
    watch(page, tag);
    const ok = await step(`${tag}: open`, async () => {
      await openLesson(page);
      await page.locator(".bk-page.is-shown .bk-frag").first().waitFor({ timeout: 20000 });
      if (vp.name === "wide") {
        await page.waitForTimeout(260);
        await page.screenshot({ path: path.join(outDir, `${target}-${tag}-00-cover-opening.png`) });
        screenshots.push(path.join(outDir, `${target}-${tag}-00-cover-opening.png`));
      }
      await page.waitForTimeout(900);
      await shot(page, tag, "01-open");
    });
    if (!ok) {
      await ctx.close();
      continue;
    }
    await step(`${tag}: turn`, async () => {
      await page.mouse.click(5, vp.height / 2); // focus the page, away from any control
      await page.keyboard.press("ArrowLeft");
      await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(outDir, `${target}-${tag}-02-mid-turn.png`) });
      screenshots.push(path.join(outDir, `${target}-${tag}-02-mid-turn.png`));
      await page.waitForTimeout(500);
      await shot(page, tag, "03-turned");
      // input during a turn is queued: three quick presses turn three leaves
      const before = await page.evaluate(() => document.querySelector(".bk-folio-btn")?.textContent);
      await page.keyboard.press("ArrowLeft");
      await page.waitForTimeout(60);
      await page.keyboard.press("ArrowLeft");
      await page.waitForTimeout(60);
      await page.keyboard.press("ArrowLeft");
      await page.waitForTimeout(1400);
      const after = await page.evaluate(() => document.querySelector(".bk-folio-btn")?.textContent);
      const a = parseInt(before), b = parseInt(after);
      checks.push({ frame: `${tag}-queue`, ok: b - a === (vp.name === "wide" ? 6 : 3), problems: b - a === (vp.name === "wide" ? 6 : 3) ? [] : [`three quick presses turned ${b - a} pages (${before} → ${after})`] });
      await shot(page, tag, "04-after-queue");
      // back to the start
      await page.keyboard.press("Home");
      await page.waitForTimeout(700);
    });
    if (!quick) {
      await step(`${tag}: think`, async () => {
        if (!(await turnUntil(page, ".bk-frag.f-think"))) throw new Error("no think question found");
        await page.waitForTimeout(300);
        await page.locator(".bk-page.is-shown .bk-frag.f-think").first().scrollIntoViewIfNeeded();
        await shot(page, tag, "05-think");
        const before = await page.evaluate(() => [...document.querySelectorAll(".bk-page.is-shown .bk-frag")].map((f) => f.dataset.chunk + ":" + f.style.top + ":" + f.style.height).join("|"));
        await page.locator(".bk-page.is-shown .bk-frag.f-think .commit-conf button").nth(1).click();
        await page.waitForTimeout(400);
        const after = await page.evaluate(() => [...document.querySelectorAll(".bk-page.is-shown .bk-frag")].map((f) => f.dataset.chunk + ":" + f.style.top + ":" + f.style.height).join("|"));
        checks.push({ frame: `${tag}-think-no-move`, ok: before === after, problems: before === after ? [] : ["the page's blocks moved when the answer opened"] });
        await shot(page, tag, "06-think-open");
        const grade = page.locator(".bk-page.is-shown .commit-grade button.is-wrong").first();
        if (await grade.count()) {
          await grade.click();
          await page.waitForTimeout(300);
          await shot(page, tag, "07-think-graded");
        }
      });
      await step(`${tag}: margin note`, async () => {
        await page.keyboard.press("Home");
        await page.waitForTimeout(700);
        await page.keyboard.press("ArrowLeft");
        await page.waitForTimeout(600);
        await page.locator(".bk-bar button", { hasText: "פתק" }).first().click().catch(async () => page.locator(".bk-bar .dock-pad-stack").first().click());
        await page.locator(".mn-note.is-open textarea").first().waitFor({ timeout: 5000 });
        await page.locator(".mn-note.is-open textarea").first().fill("לבדוק למה השורש הרביעי ולא הריבועי.");
        await shot(page, tag, "08-note-writing");
        await page.locator(".mn-note.is-open .mn-done").first().click({ timeout: 4000 }).catch(() => page.keyboard.press("Escape"));
        await page.evaluate(() => document.activeElement?.blur?.());
        await page.waitForTimeout(500);
        await shot(page, tag, "09-note-closed");
      });
      await step(`${tag}: consultation`, async () => {
        // mark the first words of a paragraph on the page being read, and ask "הסבר פשוט"
        await page.evaluate(() => {
          const p = [...document.querySelectorAll(".bk-page.is-shown .bk-frag .prose > p")].find((x) => (x.textContent ?? "").length > 80 && x.getBoundingClientRect().top > x.closest(".bk-body").getBoundingClientRect().top);
          const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
          const t = walker.nextNode();
          const r = document.createRange();
          r.setStart(t, 0);
          r.setEnd(t, Math.min(t.length, 30));
          const s = window.getSelection();
          s.removeAllRanges();
          s.addRange(r);
          p.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        });
        await page.locator(".consult-bar .consult-bar-main").waitFor({ timeout: 5000 });
        await shot(page, tag, "10-consult-toolbar");
        await page.locator(".consult-bar .consult-bar-main").click();
        await page.locator(".bk-facing .consult-answer").first().waitFor({ timeout: 10000 });
        await page.waitForTimeout(900);
        await shot(page, tag, "11-consult-facing");
        await page.locator(".bk-facing .consult-discuss").first().click();
        await page.waitForTimeout(300);
        await page.locator(".bk-facing .consult-ask textarea").fill("ולמה זה לא עובד בנורמה של מקסימום?");
        await page.locator(".bk-facing .consult-ask button").click();
        await page.waitForTimeout(1500);
        await shot(page, tag, "12-consult-discussion");
        // a turn keeps the card open (R4 §1.2)
        await page.mouse.click(5, vp.height / 2);
        await page.keyboard.press("ArrowLeft");
        await page.waitForTimeout(600);
        const still = await page.locator(".bk-facing .consult-card").count();
        checks.push({ frame: `${tag}-consult-stays`, ok: still > 0, problems: still ? [] : ["the card closed on a turn"] });
        await shot(page, tag, "13-consult-after-turn");
        if (vp.name === "wide") {
          await page.locator(".bk-facing-btn", { hasText: "החלף צד" }).click();
          await page.waitForTimeout(300);
          await shot(page, tag, "14-consult-swapped");
        }
        await page.locator(".bk-facing-x").click();
        await page.waitForTimeout(400);
        await shot(page, tag, "15-consult-closed-tab");
      });
      await step(`${tag}: contents and jump`, async () => {
        await page.locator(".bk-toc-btn").click();
        await page.locator(".bk-toc").waitFor({ timeout: 3000 });
        await shot(page, tag, "16-contents");
        await page.locator(".bk-toc-list button").last().click();
        await page.waitForTimeout(160);
        await page.screenshot({ path: path.join(outDir, `${target}-${tag}-17-riffle.png`) });
        screenshots.push(path.join(outDir, `${target}-${tag}-17-riffle.png`));
        await page.waitForTimeout(700);
        await shot(page, tag, "18-jumped");
        await page.keyboard.press("Backspace");
        await page.waitForTimeout(800);
        await shot(page, tag, "19-back");
      });
      await step(`${tag}: plate and notebook`, async () => {
        if (!(await turnUntil(page, ".bk-plate-art"))) throw new Error("no plate found");
        await page.waitForTimeout(300);
        await shot(page, tag, "20-plate");
        await page.locator(".bk-page.is-shown .bk-plate-art").first().click();
        await page.waitForTimeout(1500);
        await shot(page, tag, "21-scene-facing");
        await page.locator(".bk-facing-x").click();
        await page.waitForTimeout(300);
        const nb = page.locator(".bk-bar button", { hasText: "מחברת" });
        await ((await nb.count()) ? nb.first() : page.locator(".bk-bar button[title^='מחברת']").first()).click();
        await page.waitForTimeout(800);
        await shot(page, tag, "22-notebook-facing");
        await page.locator(".bk-facing-x").click();
        await page.waitForTimeout(300);
      });
      await step(`${tag}: end of the book`, async () => {
        await page.keyboard.press("End");
        await page.waitForTimeout(900);
        await shot(page, tag, "23-end");
      });
    }
    await ctx.close();

    if (quick) continue;
    // a lesson read while it is written: what was shown does not move
    await step(`${tag}: streaming`, async () => {
      const { ctx: c2, page: p2 } = await fresh(vp, scheme, false, { __streamPiece: 90, __streamDelay: 160, __fast: true });
      watch(p2, `${tag}-stream`);
      await openLesson(p2, 1);
      const write = p2.getByRole("button", { name: /כתוב את שיעור 2/ });
      await write.waitFor({ timeout: 15000 });
      await write.click();
      await p2.locator(".bk-page.is-shown .bk-frag").nth(2).waitFor({ timeout: 60000 });
      await p2.waitForTimeout(2500);
      await shot(p2, tag, "24-streaming-a");
      const t1 = await visibleText(p2);
      await p2.waitForTimeout(5000);
      const t2 = await visibleText(p2);
      await shot(p2, tag, "25-streaming-b");
      const problems = [];
      t1.forEach((a, k) => {
        const b = t2[k] ?? "";
        if (!b.startsWith(a.trim().slice(0, Math.max(0, a.trim().length - 40)))) problems.push(`page ${k} changed while the lesson was written`);
      });
      checks.push({ frame: `${tag}-stream-frozen`, ok: problems.length === 0, problems });
      await c2.close();
    });
    // reduced motion: a cross-fade, no 3D turn
    if (vp.name === "wide")
      await step(`${tag}: reduced motion`, async () => {
        const { ctx: c3, page: p3 } = await fresh(vp, scheme, true);
        watch(p3, `${tag}-reduced`);
        await openLesson(p3);
        await p3.locator(".bk-page.is-shown .bk-frag").first().waitFor({ timeout: 20000 });
        await p3.waitForTimeout(600);
        await p3.mouse.click(5, vp.height / 2);
        await p3.keyboard.press("ArrowLeft");
        await p3.waitForTimeout(50);
        const turning = await p3.locator(".bk-page.is-turn-a").count();
        checks.push({ frame: `${tag}-reduced-no-3d`, ok: turning === 0, problems: turning ? ["a 3D turn under reduced motion"] : [] });
        await p3.waitForTimeout(400);
        await shot(p3, tag, "26-reduced-turned");
        // a smaller window keeps the block being read on the page
        const first = await p3.evaluate(() => document.querySelector(".bk-page.is-shown .bk-frag")?.dataset.chunk);
        await p3.setViewportSize({ width: 1100, height: 760 });
        await p3.waitForTimeout(1200);
        const still = await p3.evaluate((k) => !!document.querySelector(`.bk-page.is-shown .bk-frag[data-chunk="${k}"]`), first);
        checks.push({ frame: `${tag}-resize-keeps-place`, ok: still, problems: still ? [] : [`block ${first} left the view after a resize`] });
        await shot(p3, tag, "27-resized");
        await c3.close();
      });
  }
}
await browser.close();
server.close();

const failed = checks.filter((c) => !c.ok);
const pass = pageErrors.length === 0 && flowErrors.length === 0 && failed.length === 0;
console.log(JSON.stringify({ app: target, harness: made, pass, pageErrors, flowErrors, failedChecks: failed, consoleErrors: consoleErrors.slice(0, 20), checks: checks.length, screenshots: screenshots.length }, null, 2));
process.exit(pass ? 0 : 1);
