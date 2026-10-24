import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { connect, type ConvMeta, type Progress, type Runtime, type SampleError } from "./runtime";
import { BOOKS, INITIAL_PROGRESS, guessBook, importFile, loadAll } from "./books";
import { INITIAL_MEMORY, askTutor, composeLesson, updateMemory, type LessonPlan } from "./tutor";
import { countWords, toItems } from "./segments";
import type { Activity, Effort, Mode, StoredMessage } from "./types";
import { Sidebar } from "./components/Sidebar";
import { Hud } from "./components/Hud";
import { AssistantTurn, UserBubble } from "./components/Message";
import { Composer, type QuickAction } from "./components/Composer";
import { BookViewer } from "./components/BookViewer";
import { FlowField } from "./components/FlowField";
import { MemoryPanel } from "./components/MemoryPanel";
import { onSolvedChange, solvedCount } from "./solved";

interface Notice {
  level: "info" | "warn" | "error";
  text: string;
}

const MAX_PARTS = 4;
/** How often a draft is saved while text streams (plus at every plan/part boundary). */
const SAVE_EVERY = 8000;
const CONTINUE_TEXT = "התשובה הקודמת נקטעה באורך המרבי. המשך בדיוק מהמקום שבו נעצרה, מאמצע המשפט אם צריך, בלי לחזור על דבר ובלי הקדמה.";

/** "§13 … (חלק 1/2)": the section continues in the next message. */
function sectionUnfinished(section?: string) {
  const m = /(?:חלק|part)\s*(\d+)\s*(?:\/|מתוך|of)\s*(\d+)/i.exec(section ?? "");
  return !!m && Number(m[1]) < Number(m[2]);
}

const ERROR_COPY: Record<string, string> = {
  not_granted: "הדף לא קיבל הרשאה לפנות ל-Claude. אפשר לאשר אותה בתפריט ההרשאות של ה-Artifact.",
  sampling_disabled: "Claude אינו זמין בחשבון הזה.",
  rate_limited: "הגעת למגבלת השימוש כרגע. נסה שוב בעוד כמה דקות.",
  session_expired: "צריך להתחבר מחדש ל-claude.ai.",
  prompt_too_large: "השיחה ארוכה מדי לשליחה אחת. כדאי לפתוח שיחה חדשה לסעיף הבא.",
  refused: "Claude סירב לבקשה הזו. אפשר לנסח אותה אחרת.",
  empty_completion: "לא התקבלה תשובה. נסה לבקש פחות בבת אחת.",
  image_rejected: "התמונה לא התקבלה (סוג או גודל). נסה קובץ אחר.",
  upstream_error: "החיבור ל-Claude נקטע. אפשר לנסות שוב.",
};

/** The conversation to reopen on the next visit (a per-browser convenience). */
function rememberConv(id: string) {
  try {
    localStorage.setItem("study-lab:conv", id);
  } catch {
    // not remembered
  }
}

function usePersisted<T extends string>(key: string, initial: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(() => {
    try {
      return (localStorage.getItem(key) as T) ?? initial;
    } catch {
      return initial;
    }
  });
  const set = (next: T) => {
    setV(next);
    try {
      localStorage.setItem(key, next);
    } catch {
      // not persisted
    }
  };
  return [v, set];
}

export function App() {
  const [rt, setRt] = useState<Runtime | null>(null);
  const [progress, setProgress] = useState<Progress>(INITIAL_PROGRESS);
  const [memory, setMemory] = useState(INITIAL_MEMORY);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [memoryBusy, setMemoryBusy] = useState(false);
  const [convs, setConvs] = useState<ConvMeta[]>([]);
  const [conv, setConv] = useState<ConvMeta | null>(null);
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [live, setLive] = useState<StoredMessage | null>(null);
  const [busy, setBusy] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loaded, setLoaded] = useState<Record<string, { pages: number; fileName: string; lastLabel: string | null }>>({});
  const [importing, setImporting] = useState<{ bookId: string; done: number; total: number } | null>(null);
  const [activeBook, setActiveBook] = usePersisted<string>("study-lab:book", "math1");
  const [mode, setMode] = usePersisted<Mode>("study-lab:mode", "lesson");
  const [effort, setEffort] = usePersisted<Effort>("study-lab:effort", "high");
  const [viewer, setViewer] = useState<{ bookId: string; page: string; by: "label" | "pdf" } | null>(null);
  const [sideOpen, setSideOpen] = useState(false);
  const [solved, setSolved] = useState(solvedCount);
  const [readPct, setReadPct] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  const ctl = useRef<AbortController | null>(null);

  useEffect(() => onSolvedChange(() => setSolved(solvedCount())), []);

  const refreshLoaded = useCallback(async () => {
    const all = await loadAll();
    setLoaded(
      Object.fromEntries(
        [...all.values()].map((b) => [b.id, { pages: b.pages.length, fileName: b.fileName, lastLabel: [...b.pages].reverse().find((p) => p.label)?.label ?? null }]),
      ),
    );
  }, []);

  // Runtime, the learner's stored data, and the books cached in this browser.
  useEffect(() => {
    refreshLoaded();
    let unsubs: (() => void)[] = [];
    let alive = true;
    connect().then(async (r) => {
      if (!alive) return;
      setRt(r);
      if (!r.store) return;
      try {
        await r.store.ensureProfile(INITIAL_PROGRESS, INITIAL_MEMORY);
      } catch {
        // a view-only viewer cannot write; reading still works
      }
      unsubs = [
        r.store.watchProfile((p) => {
          setProgress(Object.keys(p.progress).length ? p.progress : INITIAL_PROGRESS);
          setMemory(p.memory || INITIAL_MEMORY);
        }),
        r.store.watchConversations(setConvs),
      ];
    });
    return () => {
      alive = false;
      unsubs.forEach((u) => u());
    };
  }, [refreshLoaded]);

  const openConversation = useCallback(
    async (c: ConvMeta) => {
      setConv(c);
      setMessages([]);
      setNotices([]);
      rememberConv(c.id);
      if (rt?.store) {
        try {
          setMessages(await rt.store.loadMessages(c.id));
        } catch {
          setNotices([{ level: "error", text: "לא הצלחתי לטעון את השיחה." }]);
        }
      }
    },
    [rt],
  );

  // Reopen the last conversation once the list arrives.
  const restored = useRef(false);
  useEffect(() => {
    if (restored.current || !convs.length) return;
    restored.current = true;
    let last: string | null = null;
    try {
      last = localStorage.getItem("study-lab:conv");
    } catch {
      // ignore
    }
    const c = convs.find((x) => x.id === last);
    if (c) openConversation(c);
  }, [convs, openConversation]);

  const saveProgress = useCallback(
    async (bookId: string, patch: Partial<Progress[string]>) => {
      setProgress((p) => ({ ...p, [bookId]: { ...(p[bookId] ?? { page: "1" }), ...patch, updatedAt: Date.now() } }));
      try {
        await rt?.store?.setProgress(bookId, patch, progress);
      } catch {
        setNotices((n) => [...n, { level: "warn", text: "ההתקדמות עודכנה רק בתצוגה הזו. השמירה ב-claude.ai נכשלה." }]);
      }
    },
    [progress, rt],
  );

  /**
   * Writes one answer. The answer is saved as a draft while it is written (after the
   * plan, after every part, and every few seconds of text), so a closed browser loses
   * at most a few seconds; `resume` continues such a draft in place.
   */
  const generate = useCallback(
    async (o: { rt: Runtime; convId: string; history: StoredMessage[]; userMsg: StoredMessage; sendMode: Mode; images: File[]; resume?: StoredMessage }) => {
      const { rt, convId, history, userMsg, sendMode, images, resume } = o;
      const store = rt.store && !convId.startsWith("local-") ? rt.store : null;
      const msgId = resume?.id ?? store?.newMessageId(convId) ?? `m${Date.now()}`;
      const activity: Activity[] = [...(resume?.activity ?? [])];
      let answer: StoredMessage = resume
        ? { ...resume, interrupted: undefined, truncated: undefined, draft: true, activity }
        : { role: "assistant", text: "", mode: sendMode, ts: Date.now(), activity, draft: true, id: msgId };
      let shown = answer.text;

      // Draft saves: one write at a time, at most every SAVE_EVERY ms between safe points.
      let chain: Promise<void> = Promise.resolve();
      let lastSave = 0;
      let saveFailed = false;
      const save = (patch: Partial<StoredMessage>, force = false) => {
        answer = { ...answer, ...patch };
        if (!store || (!force && Date.now() - lastSave < SAVE_EVERY)) return chain;
        lastSave = Date.now();
        const snapshot = { ...answer, activity: [...activity] };
        chain = chain.then(() =>
          store.saveMessage(convId, msgId, snapshot).catch(() => {
            if (!saveFailed) setNotices((n) => [...n, { level: "warn", text: "שמירת הטיוטה ב-claude.ai נכשלה; התשובה תישמר בסוף." }]);
            saveFailed = true;
          }),
        );
        return chain;
      };

      setLive(answer);
      ctl.current = new AbortController();
      const show = (t: string) => {
        shown = t;
        setLive((l) => (l ? { ...l, text: t } : l));
        save({ text: t });
      };
      save({}, true); // the empty draft marks the answer as started

      try {
        const cb = {
          onActivity: (a: Activity) => {
            activity.push(a);
            setLive((l) => (l ? { ...l, activity: [...activity] } : l));
          },
          onProgress: (bookId: string, page: string, section: string) => saveProgress(bookId, { page, section, lessons: (progress[bookId]?.lessons ?? 0) + 1 }),
          onStatus: (status: string) => setLive((l) => (l ? { ...l, status } : l)),
          onCheckpoint: (plan: LessonPlan, partsDone: number, text: string) => save({ plan, partsDone, text }, true),
          onText: show,
        };
        const base = { rt, history, mode: sendMode, effort, progress, activeBook, memory, signal: ctl.current.signal, cb };
        const plan = answer.plan as LessonPlan | undefined;
        if (sendMode === "lesson" && !images.length && (!resume || plan || !resume.text)) {
          // A section lesson: planned, then written part by part (or resumed from the saved part).
          const res = await composeLesson({
            ...base,
            text: userMsg.text,
            resume: plan ? { plan, partsDone: answer.partsDone ?? 0, text: answer.text } : undefined,
          });
          answer = { ...answer, text: res.text, model: res.model };
        } else {
          let full = answer.text;
          let res: Awaited<ReturnType<typeof askTutor>> | null = null;
          if (!full) {
            res = await askTutor({ ...base, text: userMsg.text, images });
            full = res.text;
          }
          // Continue a cut-off answer (or a resumed draft) from where its text stops.
          for (let part = 1; (res === null || res.truncated) && part <= MAX_PARTS; part++) {
            const before = full;
            res = await askTutor({
              ...base,
              history: [...history, userMsg, { ...answer, text: full }],
              text: CONTINUE_TEXT,
              images: [],
              continuing: true,
              cb: { ...cb, onText: (t: string) => show(before + t) },
            });
            full = before + res.text;
          }
          answer = { ...answer, text: full, model: res?.modelApplied ?? `רמת מודל: ${res?.modelTierApplied}`, ...(res?.truncated ? { truncated: true } : {}) };
        }
        answer = { ...answer, draft: undefined, plan: undefined, partsDone: undefined };
      } catch (err) {
        const e = err as SampleError;
        // keep the draft fields so "continue" can resume from the last saved part
        answer = { ...answer, text: e.code === "refused" ? "" : shown || (e.text ?? ""), interrupted: true, draft: undefined };
        if (e.code !== "cancelled") setNotices((n) => [...n, { level: "error", text: ERROR_COPY[e.code] ?? ERROR_COPY.upstream_error }]);
      }
      answer = { ...answer, activity };
      setLive(null);
      setMessages([...history, userMsg, answer]);
      await chain;
      if (store) {
        try {
          if (answer.text || activity.length) await store.saveMessage(convId, msgId, answer);
          await store.touch(convId, history.length + 2);
        } catch {
          setNotices((n) => [...n, { level: "warn", text: "חלק מהשיחה לא נשמר ב-claude.ai." }]);
        }
      }
      setBusy(false);

      // Fold a finished lesson into the course memory (a short, separate call).
      if (sendMode === "lesson" && answer.text && !answer.interrupted) {
        setMemoryBusy(true);
        try {
          const next = await updateMemory(rt, memory, answer, userMsg.text, progress);
          if (next) {
            setMemory(next);
            await rt.store?.setMemory(next);
          }
        } catch {
          setNotices((n) => [...n, { level: "warn", text: "זיכרון הקורס לא עודכן הפעם. אפשר לעדכן אותו ידנית מהכפתור 🧠." }]);
        } finally {
          setMemoryBusy(false);
        }
      }
    },
    [effort, progress, activeBook, memory, saveProgress],
  );

  const send = useCallback(
    async (text: string, images: File[], sendMode: Mode = mode, title?: string, fresh = false) => {
      if (busy || !rt) return;
      if (!rt.sample) {
        setNotices([{ level: "error", text: "Claude אינו זמין בתצוגה הזו. פתח את הדף ב-claude.ai כשאתה מחובר." }]);
        return;
      }
      setBusy(true);
      setNotices([]);
      stick.current = true;
      const history = fresh ? [] : messages;
      const userMsg: StoredMessage = { role: "user", text, mode: sendMode, ts: Date.now(), ...(images.length ? { images: images.length } : {}) };
      let c = fresh ? null : conv;
      if (!c) {
        const t = (title || text || "תמונה").replace(/\s+/g, " ").slice(0, 60);
        try {
          c = rt.store ? await rt.store.createConversation(t, activeBook) : null;
        } catch {
          setNotices([{ level: "warn", text: "לא הצלחתי לשמור את השיחה ב-claude.ai. היא תישאר רק בתצוגה הזו." }]);
        }
        c ??= { id: `local-${Date.now()}`, title: t, bookId: activeBook, createdAt: Date.now(), updatedAt: Date.now(), count: 0 };
        setConv(c);
        rememberConv(c.id);
      }
      setMessages([...history, userMsg]);
      if (rt.store && !c.id.startsWith("local-")) {
        try {
          await rt.store.addMessage(c.id, userMsg, history.length + 1);
        } catch {
          setNotices((n) => [...n, { level: "warn", text: "חלק מהשיחה לא נשמר ב-claude.ai." }]);
        }
      }
      await generate({ rt, convId: c.id, history, userMsg, sendMode, images });
    },
    [busy, rt, conv, messages, mode, activeBook, generate],
  );

  /** Continues the last answer of this conversation from its saved draft. */
  const resumeLast = useCallback(async () => {
    if (busy || !rt?.sample || !conv) return;
    const last = messages[messages.length - 1];
    const userIdx = messages.length - 2;
    if (last?.role !== "assistant" || messages[userIdx]?.role !== "user") return;
    setBusy(true);
    setNotices([]);
    stick.current = true;
    setMessages(messages.slice(0, -1));
    await generate({ rt, convId: conv.id, history: messages.slice(0, userIdx), userMsg: messages[userIdx], sendMode: last.mode, images: [], resume: last });
  }, [busy, rt, conv, messages, generate]);

  // Warn before closing the page while an answer is being written.
  useEffect(() => {
    if (!busy) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [busy]);

  const onPickFiles = useCallback(
    async (files: File[], forBook?: string) => {
      for (const f of files) {
        const bookId = forBook ?? guessBook(f.name);
        if (!bookId) {
          setNotices((n) => [...n, { level: "warn", text: `לא זיהיתי לאיזה ספר שייך הקובץ "${f.name}". אפשר לטעון אותו מהכפתור ⬆ של הספר עצמו.` }]);
          continue;
        }
        setImporting({ bookId, done: 0, total: 0 });
        try {
          await importFile(f, bookId, (done, total) => setImporting({ bookId, done, total }));
        } catch (e) {
          setNotices((n) => [...n, { level: "error", text: `טעינת "${f.name}" נכשלה: ${(e as Error).message}` }]);
        }
      }
      setImporting(null);
      refreshLoaded();
    },
    [refreshLoaded],
  );

  const all = useMemo(() => (live ? [...messages, live] : messages), [messages, live]);
  const items = useMemo(() => toItems(all), [all]);
  const totalWords = useMemo(() => items.reduce((s, it) => s + (it.kind === "assistant" ? countWords(it.segments) : 0), 0), [items]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && busy && stick.current) el.scrollTop = el.scrollHeight;
  }, [items, busy]);

  const onScroll = () => {
    const el = scrollRef.current!;
    stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    setReadPct(el.scrollHeight > el.clientHeight ? el.scrollTop / (el.scrollHeight - el.clientHeight) : 0);
  };

  const book = BOOKS.find((b) => b.id === activeBook) ?? BOOKS[0];
  const prog = progress[book.id];
  const startPage = prog?.page ?? (book.series === "physics" ? "1-1" : "1");
  const seriesName = book.series === "math" ? "מתמטיקה" : "פיינמן";
  const volume = book.volume.split(":")[0];
  const quick: QuickAction[] = [
    {
      label: `📖 ${sectionUnfinished(prog?.section) ? "החלק הבא של הסעיף" : "השיעור הבא"}: ${seriesName} ${volume}, עמ' ${startPage}`,
      title: `📖 ${seriesName} ${volume} · עמ' ${startPage}`,
      text: sectionUnfinished(prog?.section)
        ? `המשך לחלק הבא של הסעיף (${prog?.section}), החל מהעמוד המודפס ${startPage}.`
        : `למד אותי את הסעיף הבא בספר ${book.title}, החל מהעמוד המודפס ${startPage}${prog?.section ? ` (הסעיף האחרון שלמדנו: ${prog.section})` : ""}.`,
      mode: "lesson",
    },
    ...(items.length
      ? [
          { label: "🐢 הסבר שוב, לאט יותר", text: "החלק האחרון היה מהיר מדי בשבילי. הסבר אותו שוב, לאט יותר ומלמטה למעלה, עם עוד דוגמה מספרית פשוטה.", mode: "clarify" as Mode },
          { label: "✏️ עוד תרגילים", text: "תן לי עוד תרגילים על החומר האחרון, מדורגים מקל לקשה, כולל פתרונות מלאים שאומתו בחישוב.", mode: "clarify" as Mode },
          { label: "🔬 מקרה בוחן נוסף", text: "הוסף מקרה בוחן מעמיק נוסף לחומר האחרון, מתחום שעוד לא הופיע, עם מודל ומספרים מחושבים.", mode: "clarify" as Mode },
        ]
      : []),
  ];
  const lastItem = items[items.length - 1];
  const convBook = BOOKS.find((b) => b.id === (conv?.bookId ?? activeBook)) ?? book;
  const author = `${convBook.series === "math" ? "מתמטיקה" : "פיינמן"} · ${convBook.volume.split(":")[0]}`;
  // A new section gets its own conversation; the next part of a split section stays here.
  const startsNewChat = messages.some((m) => m.role === "assistant" && m.mode === "lesson") && !sectionUnfinished(prog?.section);

  return (
    <div className="app">
      <Sidebar
        progress={progress}
        loaded={loaded}
        importing={importing}
        activeBook={book.id}
        setActiveBook={(id) => (setActiveBook(id), setSideOpen(false))}
        onOpenBook={(id) => setViewer({ bookId: id, page: progress[id]?.page ?? "1", by: progress[id] ? "label" : "pdf" })}
        onSetPage={(id, page) => saveProgress(id, { page })}
        onPickFiles={onPickFiles}
        conversations={convs}
        currentId={conv?.id}
        onPick={(id) => {
          const c = convs.find((x) => x.id === id);
          if (busy || !c) return;
          openConversation(c);
          setSideOpen(false);
        }}
        onNew={() => {
          if (busy) return;
          setConv(null);
          setMessages([]);
          setNotices([]);
          setSideOpen(false);
        }}
        onDelete={async (id) => {
          try {
            await rt?.store?.deleteConversation(id);
          } catch {
            setNotices((n) => [...n, { level: "error", text: "המחיקה נכשלה." }]);
          }
          if (conv?.id === id) {
            setConv(null);
            setMessages([]);
          }
        }}
        canSave={!!rt?.store}
        onOpenMemory={() => (setMemoryOpen(true), setSideOpen(false))}
        memoryBusy={memoryBusy}
        open={sideOpen}
        onClose={() => setSideOpen(false)}
      />
      {sideOpen && <div className="side-scrim" onClick={() => setSideOpen(false)} />}

      <main className="main">
        <Hud
          book={book}
          lastLabel={loaded[book.id]?.lastLabel ?? null}
          progress={progress}
          words={totalWords}
          solved={solved}
          status={!rt ? "connecting" : rt.sample ? "live" : "off"}
          title={conv?.title ?? "שיחה חדשה"}
          onMenu={() => setSideOpen(true)}
        />
        <div className="read-progress" style={{ transform: `scaleX(${readPct})` }} />
        <div className="chat-scroll" ref={scrollRef} onScroll={onScroll}>
          <div className="chat-col">
            {rt && !rt.sample && (
              <div className="banner banner-warn">אין כאן חיבור ל-Claude. פתח את הדף ב-claude.ai כשאתה מחובר, ואשר לו לפנות ל-Claude כשתתבקש.</div>
            )}
            {rt && rt.sample && !rt.store && (
              <div className="banner banner-warn">השיחות לא יישמרו בתצוגה הזו (צריך להיות מחובר ל-claude.ai עם הרשאת כתיבה).</div>
            )}
            {!loaded[book.id] && (
              <div className="banner banner-demo">
                <b>טוען את הספר…</b> אם זה לא מסתיים, אפשר לטעון את קובץ ה-{book.series === "math" || book.id === "feyn3" ? "PDF" : "TXT"} של {seriesName} {volume} מהמחשב (הכפתור ⬆ בכרטיס במדף).
              </div>
            )}
            {items.length === 0 && (
              <Welcome page={startPage} label={`${seriesName} ${volume}`} color={book.color} onStart={() => send(quick[0].text, [], "lesson", quick[0].title)} disabled={!rt?.sample || busy} />
            )}
            {items.map((it, i) =>
              it.kind === "user" ? (
                <UserBubble key={it.key} item={it} />
              ) : (
                <AssistantTurn
                  key={it.key}
                  author={author}
                  item={it}
                  live={busy && !!live && i === items.length - 1}
                  onOpenBook={(bookId, page, by) => setViewer({ bookId, page, by })}
                  onFillGaps={(missing) =>
                    send(`בהודעה הקודמת חסרו לפי בדיקת הרף: ${missing.join(", ")}. השלם עכשיו את החסר ברמה המלאה, בהמשך ישיר לשיעור ובלי לחזור על מה שכבר נכתב.`, [], "lesson")
                  }
                  onContinue={it === lastItem && !busy ? resumeLast : undefined}
                />
              ),
            )}
            {notices.map((n, i) => (
              <div key={i} className={`banner banner-${n.level}`}>
                {n.text}
              </div>
            ))}
          </div>
        </div>
        <Composer
          busy={busy}
          onSend={(t, im) => send(t, im)}
          onQuick={(q) => send(q.text, [], q.mode, q.title, q === quick[0] && startsNewChat)}
          onStop={() => ctl.current?.abort()}
          quick={quick}
          mode={mode}
          setMode={setMode}
          effort={effort}
          setEffort={setEffort}
          canAttach={!!rt?.canSendImages}
        />
      </main>

      {memoryOpen && (
        <MemoryPanel
          memory={memory}
          busy={memoryBusy}
          canSave={!!rt?.store}
          onClose={() => setMemoryOpen(false)}
          onSave={async (text) => {
            setMemory(text);
            try {
              await rt?.store?.setMemory(text);
            } catch {
              setNotices((n) => [...n, { level: "error", text: "שמירת הזיכרון נכשלה." }]);
            }
          }}
        />
      )}
      {viewer && <BookViewer bookId={viewer.bookId} start={viewer.page} by={viewer.by} onClose={() => setViewer(null)} />}
    </div>
  );
}

function Welcome({ page, label, color, onStart, disabled }: { page: string; label: string; color: string; onStart: () => void; disabled: boolean }) {
  return (
    <div className="welcome window">
      <div className="window-bar">
        <span className="window-stripes" aria-hidden />
        <span className="window-title">STUDY·LAB</span>
        <span className="window-stripes" aria-hidden />
      </div>
      <div className="welcome-stage">
        <FlowField className="welcome-canvas" density={1.3} />
        <div className="welcome-copy">
          <div className="welcome-kicker">
            <span className="pill pill-label">מוכן לשיעור</span>
          </div>
          <h1 className="welcome-title">
            מעבדת <span className="grad">הלמידה</span>
          </h1>
          <p className="welcome-sub">שיעור מעמיק על כל סעיף: סיפור פתיחה, גזירות צעד אחר צעד, שחזור של כל איור, מקרה בוחן ותרגילים. כל מספר מחושב.</p>
          <button className="btn btn-hero" onClick={onStart} disabled={disabled} style={{ ["--accent" as string]: color }}>
            ▶ התחל מעמ' {page} · {label}
          </button>
        </div>
      </div>
      <div className="welcome-legend">
        {[
          ["📜", "סיפור פתיחה", "amber"],
          ["🤔", "עצרו וחשבו", "violet"],
          ["∑", "נוסחת מפתח", "blue"],
          ["🔬", "מקרה בוחן", "cyan"],
          ["🌍", "4 תחומים", "teal"],
          ["🎛️", "אינטראקטיבי", "orange"],
          ["⚠️", "טעויות בספר", "red"],
          ["✏️", "תרגילים", "lime"],
        ].map(([icon, l, tone]) => (
          <span key={l} className={`chip tone-chip-${tone}`}>
            {icon} {l}
          </span>
        ))}
      </div>
    </div>
  );
}
