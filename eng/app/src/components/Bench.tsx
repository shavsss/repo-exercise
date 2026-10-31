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
    const unsub = rt.store.watchBenchCmd((cmd) => {
      if (busy) return;
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
      return { ok: false };
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
    const result = { lab, rules, features, step: planOnly ? "plan" : "lesson", module: c.module, lesson: c.lesson, words: words(text), minutes: Math.round((Date.now() - t0) / 600) / 100, error, parts: p?.parts?.length ?? 0, split: p?.split ?? null, plan: JSON.stringify(plan).slice(0, 60000), text, at: Date.now() };
    const first = sent[0] ?? [];
    const asText = (c: unknown) => (typeof c === "string" ? c : JSON.stringify(c));
    if (planOnly) await rt.store!.saveBench(`${Date.now()}-${c.module}-request-${rules}`, { lab, rules, messages: first.length, system: asText(first[0]?.content ?? "").slice(0, 110000), turn: asText(first[first.length - 1]?.content ?? "").slice(0, 110000), at: Date.now() }).catch(() => say("שמירת הבקשה נכשלה"));
    await rt.store!.saveBench(`${Date.now()}-${c.module}-${result.step}-${rules}`, result).catch(() => say("שמירת התוצאה נכשלה"));
    say(`${step}: ${error ? `שגיאה (${error.slice(0, 80)})` : "עבר"}${planOnly ? ` · ${result.parts} חלקים${result.split ? " · עם פיצול" : ""}` : ` · ${result.words} מילים`} · ${result.minutes} דקות`);
    return { ok: !error };
  }

  async function runAll(rt: Runtime) {
    const cur = await one(rt, "current", true);
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
