import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Runtime } from "../runtime";
import type { StoredMessage } from "../types";
import { teachBackTurn, teachBackVerdict } from "../tutor";
import { dayKey } from "../day";
import { getTts, saveTeachBack, spoken, taughtText, useDictation, type TeachGap, type TeachScope, type TeachTurn, type TeachVerdict } from "../teachback";
import { Markdown } from "./Markdown";
import { play } from "../sound";
import "../flow.css";
import "../teachback.css";

// "העבר את השיעור" / "העבר את היום" (teachback.ts): he explains out loud, the tutor answers with feedback and a
// question, and the conversation goes on (his answers, his questions, the tutor read aloud) until he ends it; then it is kept and its gaps go to the notebook. Identical in both labs.

type Phase = "idle" | "speak" | "thinking" | "saving" | "done";

export function TeachBack({
  rt,
  kind,
  scopes,
  messages,
  onGap,
}: {
  rt: Runtime | null;
  kind: "lesson" | "day";
  scopes: TeachScope[];
  /** the open lesson's messages, so they are not loaded again */
  messages?: StoredMessage[];
  onGap: (gap: TeachGap) => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [turns, setTurns] = useState<TeachTurn[]>([]);
  const [draft, setDraft] = useState("");
  const [live, setLive] = useState("");
  const [error, setError] = useState("");
  const [verdict, setVerdict] = useState<TeachVerdict | null>(null);
  const taught = useRef<string | null>(null);
  const ctl = useRef<AbortController | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const mic = useDictation((t) => setDraft((d) => (d ? d + t : t.trimStart())));
  const [voice, setVoice] = useState<Awaited<ReturnType<typeof getTts>>>(null);
  const [aloud, setAloud] = useState(true);
  useEffect(() => void getTts().then(setVoice), []);
  const say = (text: string) => voice && aloud && voice.speak(spoken(text)).catch(() => {});

  useEffect(() => end.current?.scrollIntoView({ block: "end" }), [turns.length, live, phase]);
  useEffect(() => () => ctl.current?.abort(), []);

  if (!rt?.sample || !scopes.length) return null;
  const talk = () => {
    voice?.stop();
    mic.toggle();
  };

  const open = () => {
    setTurns([]);
    setDraft("");
    setVerdict(null);
    setError("");
    setPhase("speak");
  };

  const close = () => {
    if (phase === "thinking" || phase === "saving") return;
    void mic.stop();
    voice?.stop();
    setPhase("idle");
  };

  const send = async () => {
    const text = draft.trim();
    if (!text || !rt.sample) return;
    await mic.stop();
    const next: TeachTurn[] = [...turns, { who: "learner", text }];
    setTurns(next);
    setDraft("");
    setError("");
    setPhase("thinking");
    ctl.current = new AbortController();
    try {
      taught.current ??= await taughtText(rt.store, scopes, messages && kind === "lesson" ? { scope: scopes[0], messages } : undefined);
      const reply = await teachBackTurn({ rt, scopes, taught: taught.current, turns: next, signal: ctl.current.signal, onText: setLive });
      setTurns([...next, { who: "tutor", text: reply }]);
      say(reply);
      setPhase("speak");
    } catch (e) {
      setTurns(turns);
      setDraft(text);
      setError((e as { code?: string })?.code === "rate_limited" ? "יותר מדי בקשות כרגע. נסה שוב בעוד דקה." : "הבדיקה נכשלה. ההסבר שלך נשאר בשדה, אפשר לשלוח שוב.");
      setPhase("speak");
    } finally {
      setLive("");
    }
  };

  const finish = async () => {
    if (!rt.sample || turns.length < 2) return close();
    await mic.stop();
    voice?.stop();
    setPhase("saving");
    ctl.current = new AbortController();
    let v: TeachVerdict | null = null;
    try {
      v = await teachBackVerdict({ rt, scopes, turns, signal: ctl.current.signal });
    } catch {
      // kept without the verdict
    }
    await saveTeachBack(rt.store, { kind, date: dayKey(), at: Date.now(), scopes, turns, ...(v ? { verdict: v } : {}) }).catch(() => {});
    v?.gaps.forEach(onGap);
    setVerdict(v);
    setPhase("done");
    play("close");
  };

  const label = kind === "day" ? "העבר את היום" : "העבר את השיעור";
  const what = kind === "day" ? "את מה שלמדת היום" : "את השיעור";
  return (
    <>
      <button className={`btn small ${kind === "day" ? "quiet" : ""} tb-open`} onClick={open}>
        🎙 {label}
      </button>
      {phase !== "idle" &&
        createPortal(
          <div className="flow-overlay" onClick={(e) => e.target === e.currentTarget && close()}>
            <div className="flow-close tb" role="dialog" aria-label={label}>
              <div className="flow-close-sheet">
                <span className="flow-kicker">{scopes.map((s) => `${s.moduleId} · ${s.lesson < 0 ? "מבחן" : `שיעור ${s.lesson + 1}`}`).join(" | ")}</span>
                <h2 className="flow-close-title">{label}</h2>
                {!turns.length && (
                  <p className="tb-hint">
                    הסבר {what} בקול, בלי להסתכל, כאילו אתה מלמד מישהו שלא היה כאן: מה הרעיון המרכזי, למה הוא נכון, ומתי הוא נשבר. שלוש עד חמש דקות. אחר כך
                    תקבל משוב בקול, ומשם זו שיחה: לענות, לשאול בחזרה, להתווכח. היא נגמרת כשאתה לוחץ "סיים ושמור".
                  </p>
                )}
                <div className="tb-talk">
                  {turns.map((t, i) => (
                    <div key={i} className={`tb-turn is-${t.who}`}>
                      <span className="flow-tag">{t.who === "learner" ? (i === 0 ? "ההסבר שלך" : "התשובה שלך") : "משוב"}</span>
                      {t.who === "tutor" ? <Markdown text={t.text} /> : <p>{t.text}</p>}
                    </div>
                  ))}
                  {phase === "thinking" && (
                    <div className="tb-turn is-tutor">
                      <span className="flow-tag">משוב</span>
                      {live ? <Markdown text={live} /> : <p className="tb-hint">{turns.length === 1 ? "בודק את ההסבר מול השיעור והמקורות…" : "קורא את התשובה…"}</p>}
                    </div>
                  )}
                  {phase === "done" && (
                    <div className="flow-close-done" role="status">
                      {verdict ? (
                        <>
                          <p>
                            <strong>{"●".repeat(verdict.score) + "○".repeat(5 - verdict.score)}</strong> נשמר.
                            {verdict.gaps.length ? ` ${verdict.gaps.length} נקודות עברו למחברת תחת "להעמקה", והמורה יחזור אליהן.` : ""}
                          </p>
                          {verdict.gaps.length > 0 && (
                            <ul className="tb-gaps">
                              {verdict.gaps.map((g, i) => (
                                <li key={i}>{g.text}</li>
                              ))}
                            </ul>
                          )}
                        </>
                      ) : (
                        <p>השיחה נשמרה.</p>
                      )}
                    </div>
                  )}
                  <div ref={end} />
                </div>
                {phase === "speak" && (
                  <div className="tb-input">
                    <textarea
                      value={draft + (mic.partial ? (draft ? " " : "") + mic.partial : "")}
                      onChange={(e) => setDraft(e.target.value)}
                      readOnly={mic.listening}
                      placeholder={mic.available ? "לחץ על המיקרופון ודבר, או הקלד" : "הקלד את ההסבר"}
                      rows={turns.length ? 3 : 6}
                    />
                    {(mic.error || error) && <p className="tb-err">{mic.error || error}</p>}
                  </div>
                )}
              </div>
              <div className="flow-close-actions">
                {phase === "done" ? (
                  <button className="btn primary" onClick={close} autoFocus>
                    סגור
                  </button>
                ) : (
                  <>
                    {phase === "speak" && mic.available && (
                      <button className={`btn ${mic.listening ? "tb-rec" : ""}`} onClick={talk} aria-pressed={mic.listening}>
                        {mic.listening ? "■ עצור" : "🎙 דבר"}
                      </button>
                    )}
                    {phase === "speak" && (
                      <button className="btn primary" onClick={send} disabled={!draft.trim()}>
                        {turns.length ? "שלח" : "שלח לבדיקה"}
                      </button>
                    )}
                    {voice && (
                      <button className="btn quiet" onClick={() => (aloud && voice.stop(), setAloud(!aloud))} aria-pressed={aloud} title="המורה קורא את התשובות בקול">
                        {aloud ? "🔊 בקול" : "🔇 בשקט"}
                      </button>
                    )}
                    {turns.length >= 2 && (
                      <button className={`btn quiet`} onClick={finish} disabled={phase !== "speak"}>
                        {phase === "saving" ? "שומר…" : "סיים ושמור"}
                      </button>
                    )}
                    <button className="btn quiet" onClick={close} disabled={phase === "thinking" || phase === "saving"}>
                      {turns.length >= 2 ? "סגור בלי לשמור" : "ביטול"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
