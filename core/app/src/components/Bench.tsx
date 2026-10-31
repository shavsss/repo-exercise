import { useEffect, useRef, useState } from "react";
import { connect, type Runtime } from "../runtime";
import { loadIndex } from "../library";
import { composeLesson, planModule, setLessonFeatures, setLessonRules, type LessonFeature } from "../tutor";

// The test bench (#bench): opened once, it runs a fixed sequence of tests with the real tutor by
// itself and keeps every result in profile/bench/<id> (rules, step, words, minutes, refusal or empty
// answer, split, the text), so that rule changes are checked on real lessons before they reach the
// app. It never touches the learner's lessons. Identical in both labs; the lessons are in CASES.
// Sequence: plan only with the current and the candidate rules (fast: shows a refusal or an empty
// plan), then one full lesson with the candidate rules if their plan passed, else with the current.

const CASES: Record<string, { module: string; lesson: number }> = {
  gilua: { module: "M0.1", lesson: 3 },
  lanchester: { module: "M0.2", lesson: 0 },
};
const words = (s: string) => (s.match(/[^\s]+/g) ?? []).length;
type Rules = "current" | "lite";

/** Which code runs in the open bench tab (written to profile/bench/_alive and to every result). */
declare const __BUILD__: string;
const BENCH_BUILD = __BUILD__;

export function Bench({ lab }: { lab: "gilua" | "lanchester" }) {
  const [rt, setRt] = useState<Runtime | null>(null);
  const [state, setState] = useState("מתחבר ל-claude.ai…");
  const [log, setLog] = useState<string[]>([]);
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const say = (s: string) => setLog((l) => [...l, `${new Date().toLocaleTimeString("he-IL")} · ${s}`]);

  useEffect(() => {
    void connect().then((r) => {
      setRt(r);
      setState(r.sample && r.store ? "מחובר. הבדיקות רצות לבד; השאר את החלון פתוח." : "אין חיבור למורה או למסד: פתח את הדף מתוך claude.ai.");
    });
  }, []);

  // First open: the fixed sequence. After that the page waits for commands in profile/bench/_cmd
  // ({ id, steps: [{ rules, planOnly, module, lesson }] }), so tests go on while it stays open,
  // and a reload does not run the sequence again.
  useEffect(() => {
    if (!rt?.sample || !rt.store || started.current) return;
    started.current = true;
    let last = "";
    let busy = false;
    void rt.store.saveBench("_alive", { build: BENCH_BUILD, at: Date.now() }).catch(() => {});
    const unsub = rt.store.watchBenchCmd((cmd) => {
      if (busy) return;
      // { reload: true }: load the newest published version of the page (a publish does not always reload an open tab)
      if (cmd && cmd.reload && !cmd.done && cmd.build !== BENCH_BUILD) {
        void rt.store!.markBenchCmd({ ...cmd, done: true, reloadedFrom: BENCH_BUILD, at: Date.now() }).then(() => location.reload());
        return;
      }
      if (!cmd) {
        busy = true;
        void runAll(rt).then(() => rt.store!.markBenchCmd({ id: "auto", done: true, at: Date.now() })).finally(() => (busy = false));
        return;
      }
      const id = String(cmd.id ?? "");
      if (cmd.done || id === last) {
        setState("מחובר. מחכה לבדיקה הבאה (אפשר להשאיר את החלון פתוח).");
        return;
      }
      last = id;
      busy = true;
      const steps = (cmd.steps as { rules: Rules; planOnly: boolean; module: string; lesson: number; features?: LessonFeature[] }[]) ?? [];
      setState(`מריץ בדיקה ${id}…`);
      void (async () => {
        for (const st of steps) await one(rt, st.rules, st.planOnly, { module: st.module, lesson: st.lesson }, st.features ?? []);
        await rt.store!.markBenchCmd({ ...cmd, done: true, finishedAt: Date.now() });
        say(`בדיקה ${id} הסתיימה.`);
      })().finally(() => (busy = false));
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rt]);

  async function one(rt: Runtime, rules: Rules, planOnly: boolean, at?: { module: string; lesson: number }, features: LessonFeature[] = []) {
    const c = at ?? CASES[lab];
    const index = await loadIndex();
    const memory = (await rt.store!.getMemory()) ?? "";
    const m = index.modules.find((x) => x.id === c.module);
    let prog = await rt.store!.loadModule(c.module);
    // a module the learner has not opened: plan it here (kept in the bench only, never saved to his modules)
    if (m && !prog?.lessons?.length) {
      setLessonRules(rules);
      setLessonFeatures(features);
      const t1 = Date.now();
      try {
        const mp = await planModule({ rt, module: m, memory, effort: "high", signal: new AbortController().signal, cb: { onText: () => {}, onActivity: () => {}, onStatus: () => {} } });
        prog = { ...(prog ?? {}), lessons: mp.lessons } as typeof prog;
        await rt.store!.saveBench(`${Date.now()}-${c.module}-moduleplan-${rules}`, { lab, rules, features, step: "moduleplan", module: c.module, lessons: mp.lessons, uncovered: mp.uncovered, minutes: Math.round((Date.now() - t1) / 600) / 100, at: Date.now() });
      } catch (e) {
        const err = e as { code?: string; message?: string };
        await rt.store!.saveBench(`${Date.now()}-${c.module}-moduleplan-${rules}`, { lab, rules, features, step: "moduleplan", module: c.module, error: `${err.code ?? "error"}: ${err.message ?? ""}`, minutes: Math.round((Date.now() - t1) / 600) / 100, at: Date.now() });
      }
    }
    const spec = prog?.lessons?.[c.lesson];
    if (!m || !spec) {
      say(`${c.module}: אין תוכנית שיעורים שמורה למודול`);
      return { ok: false, sent: [] as { role: string; content: unknown }[] };
    }
    const step = `${planOnly ? "תוכנית בלבד" : "שיעור מלא"} · ${rules === "lite" ? "כללים חדשים" : "כללים נוכחיים"}`;
    say(`${c.module} שיעור ${c.lesson + 1} · ${step}: מתחיל`);
    setLessonRules(rules);
    setLessonFeatures(features);
    const t0 = Date.now();
    let text = "";
    let error = "";
    let plan: unknown = null;
    // keep the exact request of the first call (the system intro and the turn), to read it afterwards
    const sent: { role: string; content: unknown }[][] = [];
    const wrap = <F extends (...a: never[]) => unknown>(f: F) => ((msgs: { role: string; content: unknown }[], ...rest: unknown[]) => { sent.push(msgs); return (f as unknown as (...a: unknown[]) => unknown)(msgs, ...rest); }) as unknown as F;
    const base = rt.sample!;
    const sample = Object.assign(wrap(base), { ...base, json: wrap(base.json.bind(base)) }) as typeof base;
    const rtx: Runtime = { ...rt, sample };
    try {
      const res = await composeLesson({
        rt: rtx, history: [], effort: "high", module: m, lessons: prog!.lessons, lessonIdx: c.lesson, memory, planOnly,
        signal: new AbortController().signal,
        text: `כתוב את שיעור ${c.lesson + 1} במודול ${c.module}: ${spec.title}.`,
        cb: { onText: (t) => { text = t; setCount(words(t)); }, onActivity: () => {}, onStatus: () => {} },
      });
      text = res.text;
      plan = res.plan ?? null;
    } catch (e) {
      const err = e as { code?: string; message?: string };
      error = `${err.code ?? "error"}: ${err.message ?? ""}`;
    }
    setLessonRules("current");
    setLessonFeatures([]);
    const p = plan as { parts?: unknown[]; split?: unknown } | null;
    const result = { lab, build: BENCH_BUILD, rules, features, step: planOnly ? "plan" : "lesson", module: c.module, lesson: c.lesson, words: words(text), minutes: Math.round((Date.now() - t0) / 600) / 100, error, parts: p?.parts?.length ?? 0, split: p?.split ?? null, plan: JSON.stringify(plan).slice(0, 60000), text, at: Date.now() };
    const first = sent[0] ?? [];
    const asText = (c: unknown) => (typeof c === "string" ? c : JSON.stringify(c));
    if (planOnly) await rt.store!.saveBench(`${Date.now()}-${c.module}-request-${rules}`, { lab, rules, messages: first.length, system: asText(first[0]?.content ?? "").slice(0, 110000), turn: asText(first[first.length - 1]?.content ?? "").slice(0, 110000), at: Date.now() }).catch(() => say("שמירת הבקשה נכשלה"));
    await rt.store!.saveBench(`${Date.now()}-${c.module}-${result.step}-${rules}`, result).catch(() => say("שמירת התוצאה נכשלה"));
    say(`${step}: ${error ? `שגיאה (${error.slice(0, 80)})` : "עבר"}${planOnly ? ` · ${result.parts} חלקים${result.split ? " · עם פיצול" : ""}` : ` · ${result.words} מילים`} · ${result.minutes} דקות`);
    return { ok: !error, sent: sent[0] ?? [] };
  }

  /** The same planning request with one part taken out at a time: a refusal that goes away names its cause. */
  async function diagnose(rt: Runtime, sent: { role: string; content: unknown }[]) {
    if (sent.length < 2) return;
    const text = (c: unknown) => (typeof c === "string" ? c : JSON.stringify(c));
    const sys = text(sent[0].content);
    const turn = text(sent[sent.length - 1].content);
    const dropDoc = (t: string, doc: string) =>
      t.replace(new RegExp(`=== \\[\\[${doc}:[\\s\\S]*?(?==== \\[\\[|</study_context>)`, "g"), "").split("\n").filter((l) => !l.includes(`${doc} (`) && !l.startsWith(`- ${doc}:`)).join("\n");
    const noMemory = (t: string) => t.replace(/<course_memory>[\s\S]*?<\/course_memory>/, "<course_memory>(omitted)</course_memory>");
    const noPages = (t: string) => t.replace(/=== \[\[[\s\S]*?(?=<\/study_context>)/, "");
    const bare = (t: string) => noMemory(noPages(t)).replace(/Lesson plan of this module:[\s\S]*?(?=<course_memory>)/, "");
    const neutralSys = "You are the author of a university textbook on electromagnetic waves, signals and engineering physics, written in Hebrew for one adult self-learner. Write clear, rigorous lessons from the given source pages.";
    const noList = sys.replace(/\(radar, electronic warfare[^)]*\)/, "(physics, signals and engineering)");
    const variants: [string, string, string][] = [
      ["שלד: בלי עמודים, זיכרון ותוכנית המודול", sys, bare(turn)],
      ["שלד + הנחיות ניטרליות", neutralSys, bare(turn)],
      ["הבקשה המלאה + הנחיות ניטרליות", neutralSys, turn],
      ["הבקשה המלאה בלי רשימת התחומים בהנחיות", noList, turn],
      ["הנחיות מלאות + 'כתוב שורה אחת על גלים'", sys, "כתוב שורה אחת בעברית על מהו גל אלקטרומגנטי."],
    ];
    const out: Record<string, string> = {};
    for (const [name, s, t] of variants) {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 25000);
      let r = "";
      try {
        await rt.sample!([{ role: sent[0].role, content: s }, { role: sent[sent.length - 1].role, content: t }] as never, { model: "claude-opus-5-5", modelTier: "complex", effort: "low", cache: false, signal: ctl.signal } as never);
        r = "עבר";
      } catch (e) {
        const code = (e as { code?: string })?.code ?? "";
        r = ctl.signal.aborted ? "עבר (התחיל לענות)" : code === "refused" ? "סירוב" : `שגיאה ${code}`;
      }
      clearTimeout(timer);
      out[name] = r;
      say(`אבחון · ${name}: ${r}`);
    }
    await rt.store!.saveBench(`${Date.now()}-diag`, { lab, kind: "diag", results: out, at: Date.now() }).catch(() => {});
  }

  async function runAll(rt: Runtime) {
    const cur = await one(rt, "current", true);
    if (!cur.ok && lab === "lanchester") {
      await diagnose(rt, cur.sent);
      say("בדיקת בקרה: תוכנית לשיעור 3 של M0.1, שנכתב ב-30.10");
      await one(rt, "current", true, { module: "M0.1", lesson: 2 });
    }
    const lite = await one(rt, "lite", true);
    if (lite.ok) await one(rt, "lite", false);
    else if (cur.ok) await one(rt, "current", false);
    say("הסתיים. אפשר לסגור את החלון.");
    setState("הסתיים.");
  }

  return (
    <div dir="rtl" style={{ maxWidth: 820, margin: "24px auto", padding: "0 16px", display: "grid", gap: 12 }}>
      <a href="#" style={{ justifySelf: "start" }}>חזרה לאפליקציה</a>
      <h1 style={{ margin: 0 }}>בדיקת שיעורים</h1>
      <p style={{ margin: 0 }}>{state}</p>
      <ol style={{ margin: 0, fontFamily: "monospace", fontSize: 13, display: "grid", gap: 4 }}>{log.map((l, i) => <li key={i}>{l}</li>)}</ol>
      {count > 0 && <div>{count} מילים נכתבו עד עכשיו בשיעור המלא</div>}
    </div>
  );
}
