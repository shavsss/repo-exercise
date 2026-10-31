import { useEffect, useRef, useState } from "react";
import { connect, type Runtime } from "../runtime";
import { loadIndex } from "../library";
import { composeLesson, setLessonRules } from "../tutor";

// The test bench (#bench): writes test lessons with the real tutor and keeps the result in
// profile/bench/<id> (words, minutes, refusal or empty answer, the text), so that rule changes are
// checked on real lessons before they reach the app. It does not touch the learner's lessons.
// Identical in both labs; the lessons to test are in CASES.

const CASES: Record<string, { module: string; lesson: number }[]> = {
  gilua: [{ module: "M0.1", lesson: 3 }],
  lanchester: [{ module: "M0.2", lesson: 0 }],
};
const words = (s: string) => (s.match(/[^\s]+/g) ?? []).length;

export function Bench({ lab }: { lab: "gilua" | "lanchester" }) {
  const [rt, setRt] = useState<Runtime | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [live, setLive] = useState("");
  const ctl = useRef<AbortController | null>(null);
  useEffect(() => {
    void connect().then(setRt);
  }, []);
  const say = (s: string) => setLog((l) => [...l, `${new Date().toLocaleTimeString("he-IL")} · ${s}`]);

  async function run(rules: "current" | "lite") {
    if (!rt?.sample || !rt.store || running) return;
    setRunning(true);
    setLessonRules(rules);
    const index = await loadIndex();
    const memory = (await rt.store.getMemory()) ?? "";
    for (const c of CASES[lab]) {
      const m = index.modules.find((x) => x.id === c.module);
      const prog = await rt.store.loadModule(c.module);
      const spec = prog?.lessons?.[c.lesson];
      if (!m || !spec) {
        say(`${c.module}: אין תוכנית שיעורים שמורה למודול, מדלג`);
        continue;
      }
      say(`${c.module} שיעור ${c.lesson + 1} (${rules === "lite" ? "כללים חדשים" : "כללים נוכחיים"}): מתחיל`);
      const t0 = Date.now();
      ctl.current = new AbortController();
      let text = "";
      let error = "";
      try {
        const res = await composeLesson({
          rt, history: [], effort: "high", module: m, lessons: prog!.lessons, lessonIdx: c.lesson, memory,
          signal: ctl.current.signal,
          text: `כתוב את שיעור ${c.lesson + 1} במודול ${c.module}: ${spec.title}.`,
          cb: { onText: (t) => { text = t; setLive(t); }, onActivity: () => {}, onStatus: (s) => say(s) },
        });
        text = res.text;
      } catch (e) {
        const err = e as { code?: string; message?: string };
        error = `${err.code ?? "error"}: ${err.message ?? ""}`;
      }
      const result = { lab, rules, module: c.module, lesson: c.lesson, title: spec.title, words: words(text), minutes: Math.round((Date.now() - t0) / 600) / 100, error, text, at: Date.now() };
      await rt.store.saveBench(`${Date.now()}-${c.module}-${rules}`, result).catch(() => say("שמירת התוצאה נכשלה"));
      say(`${c.module}: ${error ? `שגיאה (${error})` : "הסתיים"} · ${result.words} מילים · ${result.minutes} דקות`);
    }
    setLessonRules("current");
    setRunning(false);
  }

  return (
    <div className="bench" dir="rtl" style={{ maxWidth: 820, margin: "24px auto", padding: "0 16px", display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>בדיקת שיעורים</h1>
      <p style={{ margin: 0 }}>כותב שיעור בדיקה עם המורה האמיתי ושומר את התוצאה לבדיקה. לא נוגע בשיעורים שלך. אפשר לסגור את החלון כשמופיע "הסתיים".</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="btn primary" disabled={!rt?.sample || running} onClick={() => void run("lite")}>הרץ: כללים חדשים</button>
        <button className="btn" disabled={!rt?.sample || running} onClick={() => void run("current")}>הרץ: כללים נוכחיים</button>
        {running && <button className="btn" onClick={() => ctl.current?.abort()}>עצור</button>}
      </div>
      <ol style={{ margin: 0, fontFamily: "monospace", fontSize: 13 }}>{log.map((l, i) => <li key={i}>{l}</li>)}</ol>
      {running && <div style={{ color: "var(--ink-soft, #666)" }}>{words(live)} מילים נכתבו עד עכשיו</div>}
    </div>
  );
}
