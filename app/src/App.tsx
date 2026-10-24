import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api, type AppState, type Block, type Conversation, type Effort, type Mode, type ServerEvent, type StoredMessage } from "./api";
import { countWords, dataRegistry, toItems } from "./segments";
import { Sidebar } from "./components/Sidebar";
import { Hud } from "./components/Hud";
import { AssistantTurn, UserBubble } from "./components/Message";
import { Composer, type QuickAction } from "./components/Composer";
import { BookViewer } from "./components/BookViewer";
import { FlowField } from "./components/FlowField";
import { onSolvedChange, solvedCount } from "./solved";

interface Notice {
  level: "info" | "warn" | "error";
  text: string;
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
  const [state, setState] = useState<AppState | null>(null);
  const [conv, setConv] = useState<Conversation | null>(null);
  const [live, setLive] = useState<StoredMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [activeBook, setActiveBook] = usePersisted<string>("study-lab:book", "math1");
  const [mode, setMode] = usePersisted<Mode>("study-lab:mode", "lesson");
  const [effort, setEffort] = usePersisted<Effort>("study-lab:effort", "high");
  const [viewer, setViewer] = useState<{ bookId: string; page: string; by: "label" | "pdf" } | null>(null);
  const [sideOpen, setSideOpen] = useState(false);
  const [solved, setSolved] = useState(solvedCount);
  const [readPct, setReadPct] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stick = useRef(true);

  useEffect(() => onSolvedChange(() => setSolved(solvedCount())), []);

  const refresh = useCallback(async () => {
    const s = await api.state();
    setState(s);
    return s;
  }, []);

  useEffect(() => {
    refresh().then((s) => {
      let last: string | null = null;
      try {
        last = localStorage.getItem("study-lab:conv");
      } catch {
        // ignore
      }
      const id = s.conversations.find((c) => c.id === last)?.id ?? s.conversations[0]?.id;
      if (id) api.conversation(id).then(setConv);
    });
  }, [refresh]);

  useEffect(() => {
    if (!conv) return;
    try {
      localStorage.setItem("study-lab:conv", conv.id);
    } catch {
      // ignore
    }
  }, [conv?.id]);

  // Batch streamed events into one render per animation frame.
  const pending = useRef<ServerEvent[]>([]);
  const frame = useRef(0);
  const flush = useCallback(() => {
    frame.current = 0;
    const events = pending.current;
    pending.current = [];
    if (!events.length) return;
    setLive((prev) => {
      const msgs = prev.map((m) => ({ ...m, content: [...m.content] }));
      for (const e of events) {
        const cur = msgs[msgs.length - 1];
        switch (e.type) {
          case "user_saved":
            msgs.push(e.message);
            break;
          case "msg_start":
            msgs.push({ role: "assistant", content: [] });
            break;
          case "block_start":
            if (cur) cur.content[e.index] = { ...e.block, _live: true, ...(e.block.type === "thinking" ? { thinking: "" } : {}) } as Block;
            break;
          case "delta": {
            const b = cur?.content[e.index];
            if (!b) break;
            if (e.kind === "text") cur.content[e.index] = { ...b, text: (b.text ?? "") + e.text };
            else if (e.kind === "thinking") cur.content[e.index] = { ...b, thinking: (b.thinking ?? "") + e.text };
            else cur.content[e.index] = { ...b, _partial: (b._partial ?? "") + e.text };
            break;
          }
          case "block_done":
            if (cur) cur.content[e.index] = e.block;
            break;
          case "msg_done":
            msgs[msgs.length - 1] = e.message;
            break;
          case "tool_results":
            msgs.push(e.message);
            break;
        }
      }
      return msgs;
    });
  }, []);

  const onEvent = useCallback(
    (e: ServerEvent) => {
      if (e.type === "notice") return setNotices((n) => [...n, { level: e.level, text: e.text }]);
      if (e.type === "progress") return setState((s) => (s ? { ...s, progress: e.progress } : s));
      if (e.type === "done") return;
      pending.current.push(e);
      if (!frame.current) frame.current = requestAnimationFrame(flush);
    },
    [flush],
  );

  const send = useCallback(
    async (text: string, images: { media_type: string; data: string }[], sendMode: Mode = mode, title?: string) => {
      if (busy) return;
      let c = conv;
      if (!c) {
        c = await api.create(undefined, activeBook);
        setConv(c);
      }
      setBusy(true);
      setNotices([]);
      setLive([]);
      stick.current = true;
      try {
        await api.send(c.id, { text, mode: sendMode, effort, images, title }, onEvent);
      } catch (err) {
        setNotices((n) => [...n, { level: "error", text: (err as Error).message }]);
      } finally {
        cancelAnimationFrame(frame.current);
        flush();
        const fresh = await api.conversation(c.id);
        setConv(fresh);
        setLive([]);
        setBusy(false);
        refresh();
      }
    },
    [busy, conv, activeBook, mode, effort, onEvent, flush, refresh],
  );

  const messages = useMemo(() => [...(conv?.messages ?? []), ...live], [conv, live]);
  const items = useMemo(() => toItems(messages), [messages]);
  const registry = useMemo(() => dataRegistry(messages), [messages]);
  const totalWords = useMemo(() => items.reduce((s, it) => s + (it.kind === "assistant" ? countWords(it.segments) : 0), 0), [items]);

  // Follow the stream while the learner is at the bottom.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && busy && stick.current) el.scrollTop = el.scrollHeight;
  }, [items, busy]);

  const onScroll = () => {
    const el = scrollRef.current!;
    stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    setReadPct(el.scrollHeight > el.clientHeight ? el.scrollTop / (el.scrollHeight - el.clientHeight) : 0);
  };

  if (!state)
    return (
      <div className="boot">
        <FlowField className="boot-canvas" />
        <div className="boot-text">STUDY·LAB</div>
      </div>
    );

  const book = state.books.find((b) => b.id === activeBook) ?? state.books[0];
  const prog = state.progress[book.id];
  const startPage = prog?.page ?? (book.series === "physics" ? "1-1" : "1");
  const volume = book.titleHe.split("—")[1]?.split(":")[0]?.trim() ?? book.id;
  const seriesName = book.series === "math" ? "מתמטיקה" : "פיינמן";
  const quick: QuickAction[] = [
    {
      label: `📖 השיעור הבא: ${seriesName} ${volume}, עמ' ${startPage}`,
      title: `📖 ${seriesName} ${volume} · עמ' ${startPage}`,
      text: `למד אותי את הסעיף הבא בספר ${book.title}, החל מהעמוד המודפס ${startPage}${prog?.section ? ` (הסעיף האחרון שלמדנו: ${prog.section})` : ""}.`,
      mode: "lesson",
    },
    ...(items.length
      ? [
          { label: "🐢 הסבר שוב, לאט יותר", text: "החלק האחרון היה מהיר מדי בשבילי. הסבר אותו שוב, לאט יותר ומלמטה למעלה, עם עוד דוגמה מספרית פשוטה.", mode: "clarify" as Mode },
          { label: "✏️ עוד תרגילים", text: "תן לי עוד תרגילים על החומר האחרון, מדורגים מקל לקשה, כולל פתרונות מלאים שאומתו בקוד.", mode: "clarify" as Mode },
          { label: "🔬 מקרה בוחן נוסף", text: "הוסף מקרה בוחן מעמיק נוסף לחומר האחרון, מתחום שעוד לא הופיע, עם מודל ומספרים מקוד.", mode: "clarify" as Mode },
        ]
      : []),
  ];

  return (
    <div className="app">
      <Sidebar
        books={state.books}
        progress={state.progress}
        activeBook={book.id}
        setActiveBook={(id) => (setActiveBook(id), setSideOpen(false))}
        onOpenBook={(id) => setViewer({ bookId: id, page: state.progress[id]?.page ?? "1", by: state.progress[id] ? "label" : "pdf" })}
        onSetPage={async (id, page) => {
          try {
            const p = await api.setProgress(id, page);
            setState((s) => (s ? { ...s, progress: p } : s));
          } catch (e) {
            setNotices((n) => [...n, { level: "error", text: (e as Error).message }]);
          }
        }}
        conversations={state.conversations}
        currentId={conv?.id}
        onPick={(id) => {
          if (busy) return;
          api.conversation(id).then(setConv);
          setSideOpen(false);
        }}
        onNew={() => {
          if (busy) return;
          setConv(null);
          setSideOpen(false);
        }}
        onDelete={async (id) => {
          await api.remove(id);
          if (conv?.id === id) setConv(null);
          refresh();
        }}
        open={sideOpen}
        onClose={() => setSideOpen(false)}
      />
      {sideOpen && <div className="side-scrim" onClick={() => setSideOpen(false)} />}

      <main className="main">
        <Hud book={book} progress={state.progress} words={totalWords} solved={solved} hasKey={state.hasKey} model={state.model} title={conv?.title ?? "שיחה חדשה"} onMenu={() => setSideOpen(true)} />
        <div className="read-progress" style={{ transform: `scaleX(${readPct})` }} />
        <div className="chat-scroll" ref={scrollRef} onScroll={onScroll}>
          <div className="chat-col">
            {!state.hasKey && (
              <div className="banner banner-demo">
                <b>מצב הדגמה:</b> לא הוגדר <code>ANTHROPIC_API_KEY</code>, אז כל הודעה תקבל שיעור הדגמה מוכן מראש שמציג את רכיבי התצוגה. אחרי שמוסיפים מפתח בקובץ <code>app/.env</code>, המורה האמיתי עונה.
              </div>
            )}
            {items.length === 0 && <Welcome book={book} page={startPage} onStart={() => send(quick[0].text, [], "lesson", quick[0].title)} />}
            {items.map((it, i) =>
              it.kind === "user" ? (
                <UserBubble key={it.key} item={it} />
              ) : (
                <AssistantTurn
                  key={it.key}
                  item={it}
                  live={busy && i === items.length - 1}
                  registry={registry}
                  books={state.books}
                  onOpenBook={(bookId, page, by) => setViewer({ bookId, page, by })}
                  onFillGaps={(missing) =>
                    send(`בהודעה הקודמת חסרו לפי בדיקת הרף: ${missing.join(", ")}. השלם עכשיו את החסר ברמה המלאה, בהמשך ישיר לשיעור ובלי לחזור על מה שכבר נכתב.`, [], "lesson")
                  }
                />
              ),
            )}
            {busy && items[items.length - 1]?.kind === "user" && (
              <div className="typing">
                <span />
                <span />
                <span />
                המורה קורא את הספר ומתכנן את השיעור…
              </div>
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
          onQuick={(q) => send(q.text, [], q.mode, q.title)}
          onStop={() => conv && api.stop(conv.id)}
          quick={quick}
          mode={mode}
          setMode={setMode}
          effort={effort}
          setEffort={setEffort}
        />
      </main>

      {viewer && (
        <BookViewer
          book={state.books.find((b) => b.id === viewer.bookId)!}
          start={viewer.page}
          by={viewer.by}
          onClose={() => setViewer(null)}
        />
      )}
    </div>
  );
}

function Welcome({ book, page, onStart }: { book: AppState["books"][number]; page: string; onStart: () => void }) {
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
          <p className="welcome-sub">
            שיעור מעמיק על כל סעיף: סיפור פתיחה, גזירות צעד אחר צעד, שחזור של כל איור, מקרה בוחן ותרגילים. כל מספר מחושב בקוד.
          </p>
          <button className="btn btn-hero" onClick={onStart} style={{ ["--accent" as string]: book.color }}>
            ▶ התחל מעמ' {page} · {book.titleHe.split("—")[1]?.split(":")[0]?.trim()}
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
        ].map(([icon, label, tone]) => (
          <span key={label} className={`chip tone-chip-${tone}`}>
            {icon} {label}
          </span>
        ))}
      </div>
    </div>
  );
}
