import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { connect, type ConvMeta, type Runtime, type SampleError } from "./runtime";
import { docMeta, loadIndex, moduleState, type LibraryIndex, type Module } from "./library";
import { INITIAL_MEMORY, askTutor, composeLesson, planModule, updateMemory, type PartPlan } from "./tutor";
import { toItems } from "./segments";
import type { Activity, Effort, LessonNote, ModuleProgress, Mode, NoteKind, StoredMessage } from "./types";
import { ModuleMap, STATE_LABEL, TIER_LABEL, type Selection } from "./components/ModuleMap";
import { Topbar, type Crumb } from "./components/Topbar";
import { AssistantTurn, DimensionHead, UserBubble } from "./components/Message";
import { Composer, type QuickAction } from "./components/Composer";
import { lessonChannel } from "./summaries/SummaryApp";
import { LessonToc, ReadingDock, ReadingProgress, useResumePosition } from "./components/ReadingAids";
import { Scratchpad } from "./components/Scratchpad";
import { ExplainPanel } from "./components/Explain";
import { SourceViewer } from "./components/SourceViewer";
import { MemoryPanel } from "./components/MemoryPanel";
import { MdContext } from "./components/Markdown";
import { SourceTag } from "./components/blocks/SourceTag";
import { Icon } from "./components/Icon";
import { RingMap } from "./components/RingMap";
import { NotesPanel } from "./components/NotesPanel";

interface Notice {
  level: "info" | "warn" | "error";
  text: string;
}

const MAX_PARTS = 4;
/** How often a draft is saved while text streams (plus at every plan/part boundary). */
const SAVE_EVERY = 8000;
const CONTINUE_TEXT = "התשובה הקודמת נקטעה באורך המרבי. המשך בדיוק מהמקום שבו נעצרה, מאמצע המשפט אם צריך, בלי לחזור על דבר ובלי הקדמה.";

const ERROR_COPY: Record<string, string> = {
  not_granted: "הדף לא קיבל הרשאה לפנות ל-Claude. אפשר לאשר אותה בתפריט ההרשאות של ה-Artifact.",
  sampling_disabled: "Claude אינו זמין בחשבון הזה.",
  rate_limited: "הגעת למגבלת השימוש כרגע. נסה שוב בעוד כמה דקות.",
  session_expired: "צריך להתחבר מחדש ל-claude.ai.",
  prompt_too_large: "הבקשה גדולה מדי לשליחה אחת. כדאי לשאול על חלק קטן יותר.",
  refused: "Claude סירב לבקשה הזו. אפשר לנסח אותה אחרת.",
  empty_completion: "לא התקבלה תשובה. נסה לבקש פחות בבת אחת.",
  image_rejected: "התמונה לא התקבלה (סוג או גודל). נסה קובץ אחר.",
  invalid_json: "התכנון שהתקבל לא היה תקין. אפשר לנסות שוב.",
  upstream_error: "החיבור ל-Claude נקטע. אפשר לנסות שוב.",
};

function readLocal(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeLocal(key: string, v: string) {
  try {
    localStorage.setItem(key, v);
  } catch {
    // a per-browser convenience only
  }
}

function usePersisted<T extends string>(key: string, initial: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(() => (readLocal(key) as T) ?? initial);
  return [v, (next: T) => (setV(next), writeLocal(key, next))];
}

const narrow = () => window.matchMedia("(max-width: 900px)").matches;

export function App() {
  const [rt, setRt] = useState<Runtime | null>(null);
  const [index, setIndex] = useState<LibraryIndex | null>(null);
  const [indexError, setIndexError] = useState("");
  const [memory, setMemory] = useState(INITIAL_MEMORY);
  const [doneList, setDoneList] = useState<string[]>([]);
  const [mods, setMods] = useState<Record<string, ModuleProgress>>({});
  const modsRef = useRef(mods);
  modsRef.current = mods;
  const [, setConvs] = useState<ConvMeta[]>([]);
  const [selection, setSelectionState] = useState<Selection | null>(() => {
    try {
      return JSON.parse(readLocal("eng-lab:sel") ?? "null");
    } catch {
      return null;
    }
  });
  const [convId, setConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [live, setLive] = useState<StoredMessage | null>(null);
  const [busy, setBusy] = useState(false);
  const [planning, setPlanning] = useState<{ moduleId: string; status: string } | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [viewer, setViewer] = useState<{ doc: string; page: number } | null>(null);
  const [viewerMin, setViewerMin] = useState(false);
  const [mode, setMode] = useState<Mode>("clarify");
  const [effort, setEffort] = usePersisted<Effort>("eng-lab:effort", "high");
  const [sideOpen, setSideOpen] = useState(false);
  const [sidePref, setSidePref] = usePersisted<"open" | "closed">("eng-lab:side", "open");
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [memoryBusy, setMemoryBusy] = useState(false);
  const [notes, setNotes] = useState<LessonNote[]>([]);
  const [notesOpen, setNotesOpen] = useState(false);
  const notesRef = useRef(notes);
  notesRef.current = notes;
  const scrollRef = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  const ctl = useRef<AbortController | null>(null);
  const planned = useRef(new Set<string>());
  /** the stored module progress has arrived (or there is no store) */
  const [modsReady, setModsReady] = useState(false);

  const done = useMemo(() => new Set(doneList), [doneList]);
  const notify = (n: Notice) => setNotices((all) => [...all, n]);

  /* ---- runtime, library index and the learner's stored data ---- */
  useEffect(() => {
    let unsubs: (() => void)[] = [];
    let alive = true;
    loadIndex()
      .then((ix) => alive && setIndex(ix))
      .catch((e) => alive && setIndexError((e as Error).message));
    connect().then(async (r) => {
      if (!alive) return;
      setRt(r);
      if (!r.store) return;
      try {
        await r.store.ensureProfile(INITIAL_MEMORY);
      } catch {
        // a view-only viewer cannot write; reading still works
      }
      unsubs = [
        r.store.watchProfile((p) => {
          setMemory(p.memory || INITIAL_MEMORY);
          setDoneList(p.done);
        }),
        r.store.watchModules((m) => {
          setMods(m);
          setModsReady(true);
        }),
        r.store.watchConversations(setConvs),
        r.store.watchNotes(setNotes),
      ];
    });
    return () => {
      alive = false;
      unsubs.forEach((u) => u());
    };
  }, []);

  const module = useMemo(() => (selection && index ? index.modules.find((m) => m.id === selection.moduleId) : undefined), [selection, index]);
  const prog = module ? mods[module.id] : undefined;
  const lessonIdx = selection?.lesson;
  // the summaries window (#summary) follows the lesson open here
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined" || !selection?.moduleId) return;
    const ch = new BroadcastChannel(lessonChannel("gilua"));
    ch.postMessage({ moduleId: selection.moduleId, lesson: selection.lesson });
    ch.close();
  }, [selection?.moduleId, selection?.lesson]);
  const lesson = lessonIdx !== undefined && lessonIdx >= 0 ? prog?.lessons?.[lessonIdx] : undefined;
  const isQuiz = lessonIdx === -1;
  const state = module ? moduleState(module, done) : "locked";

  const setSelection = useCallback(
    (s: Selection | null) => {
      if (busy) return;
      setSelectionState(s);
      writeLocal("eng-lab:sel", JSON.stringify(s));
      setNotices([]);
      if (narrow()) setSideOpen(false);
      if (s) rt?.store?.setCurrent(s.moduleId).catch(() => {});
    },
    [busy, rt],
  );

  // a locked module (e.g. remembered from another state) falls back to its page
  useEffect(() => {
    if (module && state === "locked" && selection?.lesson !== undefined) setSelection({ moduleId: module.id });
  }, [module, state, selection, setSelection]);

  /** Merges a patch into a module's progress, in the view and in the store. */
  const saveModule = useCallback(
    async (id: string, patch: Partial<ModuleProgress>) => {
      const next = { ...(modsRef.current[id] ?? {}), ...patch };
      modsRef.current = { ...modsRef.current, [id]: next };
      setMods(modsRef.current);
      try {
        await rt?.store?.saveModule(id, next);
      } catch {
        notify({ level: "warn", text: "ההתקדמות במודול עודכנה רק בתצוגה הזו. השמירה ב-claude.ai נכשלה." });
      }
    },
    [rt],
  );

  /** Adds a point to a lesson's shared notebook (kept in this view when there is no store). */
  /** the tutor adds a point to an item already in the notebook */
  const appendToNote = useCallback(
    async (id: string, text: string) => {
      const n = notesRef.current.find((x) => x.id === id);
      if (!n) return;
      const body = `${n.text.trim()}\n- ${text.trim()}`;
      if (id.startsWith("local-") || !rt?.store) setNotes((all) => all.map((x) => (x.id === id ? { ...x, text: body } : x)));
      else await rt.store.updateNote(id, { text: body });
    },
    [rt],
  );
  const addNote = useCallback(
    async (kind: NoteKind, text: string, who: LessonNote["who"], m: Module, idx: number, anchor?: string) => {
      const lessonTitle = idx >= 0 ? modsRef.current[m.id]?.lessons?.[idx]?.title : "מבחן מסכם";
      const note: LessonNote = { who, kind, text, moduleId: m.id, lesson: idx, ts: Date.now(), ...(lessonTitle ? { lessonTitle } : {}), ...(anchor ? { anchor } : {}) };
      if (rt?.store) {
        try {
          await rt.store.addNote(note);
          return;
        } catch {
          notify({ level: "warn", text: "הפריט נוסף למחברת רק בתצוגה הזו. השמירה ב-claude.ai נכשלה." });
        }
      }
      setNotes((all) => [{ ...note, id: `local-${note.ts}` }, ...all]);
    },
    [rt],
  );

  /* ---- entering a module: split it into lessons once ---- */
  const runPlan = useCallback(
    async (m: Module) => {
      if (!rt?.sample || busy) return;
      setBusy(true);
      setPlanning({ moduleId: m.id, status: "קורא את מקורות המודול" });
      ctl.current = new AbortController();
      try {
        const res = await planModule({
          rt,
          module: m,
          memory,
          effort,
          signal: ctl.current.signal,
          cb: { onText: () => {}, onActivity: () => {}, onStatus: (status) => setPlanning({ moduleId: m.id, status }) },
        });
        await saveModule(m.id, { lessons: res.lessons, uncovered: res.uncovered, uncoveredPages: res.uncoveredPages, done: [], convs: modsRef.current[m.id]?.convs ?? {} });
      } catch (err) {
        const e = err as SampleError;
        if (e.code !== "cancelled") notify({ level: "error", text: `החלוקה לשיעורים נכשלה. ${ERROR_COPY[e.code] ?? ERROR_COPY.upstream_error}` });
      } finally {
        setPlanning(null);
        setBusy(false);
      }
    },
    [rt, busy, memory, effort, saveModule],
  );

  useEffect(() => {
    if (!module || !rt?.sample || state === "locked" || prog?.lessons?.length || busy) return;
    if (planned.current.has(module.id)) return;
    // wait for the stored progress before deciding the module has no plan
    if (rt.store && !modsReady) return;
    planned.current.add(module.id);
    runPlan(module);
  });

  /* ---- the conversation of the selected lesson or quiz ---- */
  const wantedConv = module && lessonIdx !== undefined ? (isQuiz ? prog?.quizConv : prog?.convs?.[String(lessonIdx)]) : undefined;
  useEffect(() => {
    if (busy) return;
    if (!wantedConv) {
      setConvId(null);
      setMessages([]);
      return;
    }
    if (wantedConv === convId) return;
    setConvId(wantedConv);
    setMessages([]);
    if (rt?.store && !wantedConv.startsWith("local-"))
      rt.store
        .loadMessages(wantedConv)
        .then(setMessages)
        .catch(() => notify({ level: "error", text: "לא הצלחתי לטעון את השיחה." }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantedConv, rt]);

  useEffect(() => {
    setMode(isQuiz ? "quiz" : "clarify");
  }, [isQuiz, lessonIdx, module?.id]);

  /** Marks a lesson finished; the module is learned when all its lessons are. */
  const finishLesson = useCallback(
    async (m: Module, idx: number) => {
      const p = modsRef.current[m.id];
      const list = [...new Set([...(p?.done ?? []), idx])].sort((a, b) => a - b);
      await saveModule(m.id, { done: list });
      if (p?.lessons && list.length >= p.lessons.length && !doneList.includes(m.id)) {
        const next = [...doneList, m.id];
        setDoneList(next);
        notify({ level: "info", text: `המודול ${m.id} נלמד. המודולים שתלויים בו נפתחו.` });
        try {
          await rt?.store?.setDone(next);
        } catch {
          notify({ level: "warn", text: "סימון המודול כנלמד לא נשמר ב-claude.ai." });
        }
      }
    },
    [doneList, rt, saveModule],
  );

  /**
   * Writes one answer. The answer is saved as a draft while it is written (after the
   * plan, after every part, and every few seconds of text), so a closed browser loses
   * at most a few seconds; `resume` continues such a draft in place.
   */
  const generate = useCallback(
    async (o: { rt: Runtime; m: Module; idx: number; cid: string; history: StoredMessage[]; userMsg: StoredMessage; sendMode: Mode; images: File[]; resume?: StoredMessage }) => {
      const { rt, m, idx, cid, history, userMsg, sendMode, images, resume } = o;
      const store = rt.store && !cid.startsWith("local-") ? rt.store : null;
      const msgId = resume?.id ?? store?.newMessageId(cid) ?? `m${Date.now()}`;
      const activity: Activity[] = [...(resume?.activity ?? [])];
      let answer: StoredMessage = resume
        ? { ...resume, interrupted: undefined, truncated: undefined, draft: true, activity }
        : { role: "assistant", text: "", mode: sendMode, ts: Date.now(), activity, draft: true, id: msgId };
      let shown = answer.text;

      let chain: Promise<void> = Promise.resolve();
      let lastSave = 0;
      let saveFailed = false;
      const save = (patch: Partial<StoredMessage>, force = false) => {
        answer = { ...answer, ...patch };
        if (!store || (!force && Date.now() - lastSave < SAVE_EVERY)) return chain;
        lastSave = Date.now();
        const snapshot = { ...answer, activity: [...activity] };
        chain = chain.then(() =>
          store.saveMessage(cid, msgId, snapshot).catch(() => {
            if (!saveFailed) notify({ level: "warn", text: "שמירת הטיוטה ב-claude.ai נכשלה; התשובה תישמר בסוף." });
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
      save({}, true);

      let ok = false;
      try {
        const cb = {
          onActivity: (a: Activity) => {
            activity.push(a);
            setLive((l) => (l ? { ...l, activity: [...activity] } : l));
          },
          onStatus: (status: string) => setLive((l) => (l ? { ...l, status } : l)),
          onCheckpoint: (plan: PartPlan, partsDone: number, text: string) => save({ plan, partsDone, text }, true),
          onText: show,
          onNote: (kind: NoteKind, text: string, addTo?: string, anchor?: string) => (addTo ? appendToNote(addTo, text) : addNote(kind, text, "tutor", m, idx, anchor)),
        };
        const lessons = modsRef.current[m.id]?.lessons;
        const lessonNotes = notesRef.current.filter((n) => n.moduleId === m.id && n.lesson === idx);
        const allNotes = notesRef.current.filter((n) => !(n.moduleId === m.id && n.lesson === idx));
        const base = { rt, history, effort, module: m, lessons, lessonIdx: idx, memory, notes: lessonNotes, allNotes, done: doneList, signal: ctl.current.signal, cb };
        const plan = answer.plan as PartPlan | undefined;
        if (sendMode === "lesson" && !images.length && (!resume || plan || !resume.text)) {
          const res = await composeLesson({ ...base, text: userMsg.text, resume: plan ? { plan, partsDone: answer.partsDone ?? 0, text: answer.text } : undefined });
          answer = { ...answer, text: res.text, model: res.model };
        } else {
          let full = answer.text;
          let res: Awaited<ReturnType<typeof askTutor>> | null = null;
          if (!full) {
            res = await askTutor({ ...base, mode: sendMode, text: userMsg.text, images });
            full = res.text;
          }
          for (let part = 1; (res === null || res.truncated) && part <= MAX_PARTS; part++) {
            const before = full;
            res = await askTutor({
              ...base,
              mode: sendMode,
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
        ok = !answer.truncated;
      } catch (err) {
        const e = err as SampleError;
        // keep the draft fields so "continue" can resume from the last saved part
        answer = { ...answer, text: e.code === "refused" ? "" : shown || (e.text ?? ""), interrupted: true, draft: undefined };
        if (e.code !== "cancelled") notify({ level: "error", text: ERROR_COPY[e.code] ?? ERROR_COPY.upstream_error });
      }
      answer = { ...answer, activity };
      setLive(null);
      setMessages([...history, userMsg, answer]);
      await chain;
      if (store) {
        try {
          if (answer.text || activity.length) await store.saveMessage(cid, msgId, answer);
          await store.touch(cid, history.length + 2);
        } catch {
          notify({ level: "warn", text: "חלק מהשיחה לא נשמר ב-claude.ai." });
        }
      }
      setBusy(false);

      if (!ok || !answer.text) return;
      if (sendMode === "lesson" && idx >= 0) await finishLesson(m, idx);
      const score = /\[\[ציון:\s*([^\]]+)\]\]/.exec(answer.text)?.[1]?.trim();
      if (sendMode === "quiz" && score) await saveModule(m.id, { quizScore: score });
      if (sendMode === "lesson" || (sendMode === "quiz" && score)) {
        setMemoryBusy(true);
        try {
          const where = `${m.id} «${m.title}», ${idx >= 0 ? `שיעור ${idx + 1} מתוך ${modsRef.current[m.id]?.lessons?.length ?? "?"}` : "מבחן מסכם"}`;
          const next = await updateMemory(rt, memory, answer, userMsg.text, where);
          if (next) {
            setMemory(next);
            await rt.store?.setMemory(next);
          }
        } catch {
          notify({ level: "warn", text: "זיכרון הקורס לא עודכן הפעם. אפשר לעדכן אותו ידנית." });
        } finally {
          setMemoryBusy(false);
        }
      }
    },
    [effort, memory, doneList, finishLesson, saveModule, addNote],
  );

  const send = useCallback(
    async (text: string, images: File[], sendMode: Mode = mode) => {
      if (busy || !rt || !module || lessonIdx === undefined) return;
      if (!rt.sample) {
        setNotices([{ level: "error", text: "Claude אינו זמין בתצוגה הזו. פתח את הדף ב-claude.ai כשאתה מחובר." }]);
        return;
      }
      setBusy(true);
      setNotices([]);
      stick.current = true;
      const userMsg: StoredMessage = { role: "user", text, mode: sendMode, ts: Date.now(), ...(images.length ? { images: images.length } : {}) };
      let cid = convId;
      if (!cid) {
        const title = isQuiz ? `${module.id} · מבחן מסכם` : `${module.id} · שיעור ${lessonIdx + 1}: ${lesson?.title ?? ""}`;
        try {
          cid = rt.store ? (await rt.store.createConversation(title.slice(0, 90), module.id, lessonIdx)).id : null;
        } catch {
          notify({ level: "warn", text: "לא הצלחתי לשמור את השיחה ב-claude.ai. היא תישאר רק בתצוגה הזו." });
        }
        cid ??= `local-${Date.now()}`;
        setConvId(cid);
        if (isQuiz) await saveModule(module.id, { quizConv: cid });
        else await saveModule(module.id, { convs: { ...(modsRef.current[module.id]?.convs ?? {}), [String(lessonIdx)]: cid } });
      }
      const history = messages;
      setMessages([...history, userMsg]);
      if (rt.store && !cid.startsWith("local-")) {
        try {
          await rt.store.saveMessage(cid, rt.store.newMessageId(cid), userMsg);
        } catch {
          notify({ level: "warn", text: "חלק מהשיחה לא נשמר ב-claude.ai." });
        }
      }
      await generate({ rt, m: module, idx: lessonIdx, cid, history, userMsg, sendMode, images });
    },
    [busy, rt, module, lessonIdx, lesson, isQuiz, convId, messages, mode, generate, saveModule],
  );

  /** Continues the last answer of this conversation from its saved draft. */
  const resumeLast = useCallback(async () => {
    if (busy || !rt?.sample || !convId || !module || lessonIdx === undefined) return;
    const last = messages[messages.length - 1];
    const userIdx = messages.length - 2;
    if (last?.role !== "assistant" || messages[userIdx]?.role !== "user") return;
    setBusy(true);
    setNotices([]);
    stick.current = true;
    setMessages(messages.slice(0, -1));
    await generate({ rt, m: module, idx: lessonIdx, cid: convId, history: messages.slice(0, userIdx), userMsg: messages[userIdx], sendMode: last.mode, images: [], resume: last });
  }, [busy, rt, convId, module, lessonIdx, messages, generate]);

  // Warn before closing the page while an answer is being written.
  useEffect(() => {
    if (!busy) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [busy]);

  const all = useMemo(() => (live ? [...messages, live] : messages), [messages, live]);
  const items = useMemo(() => toItems(all), [all]);
  const hasLesson = messages.some((m) => m.role === "assistant" && m.mode === "lesson" && !m.interrupted && !m.draft);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && busy && stick.current) el.scrollTop = el.scrollHeight;
  }, [items, busy]);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [selection?.moduleId, selection?.lesson]);

  const inLesson = !!module && lessonIdx !== undefined;
  /** the left of the lesson: the contents, or the notebook, or (mostly) neither */
  const [leftDock, setLeftDock] = usePersisted<"" | "toc" | "pad">("eng-lab:left", "");
  const tocOpen = leftDock === "toc";
  // the contents panel shares the left side with the source viewer, and gives way to it
  const showToc = inLesson && !(viewer && !viewerMin);
  const resume = useResumePosition(scrollRef, inLesson ? `${module!.id}:${lessonIdx}` : null, items.length > 0 && !busy, busy);

  const openSource = useCallback((doc: string, page: number) => {
    setViewer({ doc, page });
    setViewerMin(false);
  }, []);

  /* ---- view ---- */
  const part = module && index ? index.parts.find((p) => p.id === module.part) : undefined;
  const crumbs: Crumb[] = [{ label: "מפת המודולים", onClick: () => setSelection(null) }];
  if (part) crumbs.push({ label: `${part.id} ${part.title}`, onClick: () => (setSidePref("open"), setSideOpen(true)) });
  if (module) crumbs.push({ label: `${module.id} ${module.title}`, onClick: () => setSelection({ moduleId: module.id }) });
  if (lesson) crumbs.push({ label: lesson.title });
  if (isQuiz) crumbs.push({ label: "מבחן מסכם" });
  const nLessons = prog?.lessons?.length ?? 0;
  const counter = lesson ? `שיעור ${(lessonIdx ?? 0) + 1}/${nLessons}` : isQuiz ? "מבחן" : module && nLessons ? `${prog?.done?.length ?? 0}/${nLessons} שיעורים` : undefined;
  const fullBar = module?.tier !== "ref";

  const quick: QuickAction[] = [];
  if (lesson && !busy) {
    if (!hasLesson && !messages.some((m) => m.role === "assistant" && m.mode === "lesson"))
      quick.push({ label: `כתוב את שיעור ${(lessonIdx ?? 0) + 1}`, text: `כתוב את שיעור ${(lessonIdx ?? 0) + 1} במודול ${module!.id}: ${lesson.title}.`, mode: "lesson", primary: true });
    else if (hasLesson)
      quick.push(
        { label: "הסבר שוב, לאט יותר", text: "החלק האחרון היה מהיר מדי בשבילי. הסבר אותו שוב, לאט יותר ומלמטה למעלה, עם עוד דוגמה מספרית פשוטה.", mode: "clarify" },
        { label: "עוד תרגילים", text: "תן לי עוד תרגילים על השיעור ברמה 2.5: אומדן בראש ואז בדיקה, החלטות של פשרה עם נימוק, ומציאת טעות בטענה או בגזירה. מדורגים מקל לקשה, עם פתרונות מלאים שאומתו בחישוב.", mode: "clarify" },
        { label: "גזירה מלאה", text: "גזור במלואה, צעד אחר צעד, את התוצאה המרכזית של השיעור שקיבלה רק שלד, עם נימוק במילים לכל מעבר.", mode: "clarify" },
        { label: "מחברת מעשית", text: "בנה מחברת Python למסלול המעשי של השיעור (בלוק notebook): ניסוי שמראה את התוצאה המרכזית, עם הסבר בכל תא ומשימה בסוף.", mode: "clarify" },
        { label: "למאמר ולראיון", text: "מה מהשיעור הזה שווה מאמר או ראיון? הצע זוויות למאמר ושאלות לראיון עם מומחה, ושמור את הטובות במחברת השיעור.", mode: "clarify" },
        { label: "בתלת-ממד", text: "הראה את הנושא המרכזי של השיעור בסצנת תלת-ממד (scene3d), מהספרייה אם יש מתאימה ואחרת מפרט משלך, עם סיור מודרך והסבר על מה להסתכל.", mode: "clarify" },
      );
  }
  if (isQuiz && !busy && !messages.length) quick.push({ label: "התחל את המבחן", text: `התחל את המבחן המסכם של מודול ${module?.id}.`, mode: "quiz", primary: true });

  const status = !rt ? "connecting" : rt.sample ? "live" : "off";
  const sideVisible = narrow() ? sideOpen : sidePref === "open";
  const nextLesson = lessonIdx !== undefined && lessonIdx >= 0 && lessonIdx + 1 < nLessons ? lessonIdx + 1 : lessonIdx !== undefined && lessonIdx >= 0 && lessonIdx + 1 === nLessons ? -1 : null;
  const mdCtx = useMemo(() => ({ live: false, idPrefix: "page", openSource }), [openSource]);

  return (
    <div className={`app ${sidePref === "closed" ? "side-collapsed" : ""} ${viewer ? (viewerMin ? "viewer-min" : "viewer-open") : ""} ${showToc && tocOpen ? "has-toc" : ""}`}>
      <Topbar
        crumbs={crumbs}
        counter={counter}
        status={status}
        sideOpen={sideVisible}
        viewerOpen={!!viewer}
        memoryBusy={memoryBusy}
        onToggleSide={() => (narrow() ? setSideOpen(!sideOpen) : setSidePref(sidePref === "open" ? "closed" : "open"))}
        onToggleViewer={
          viewer || module
            ? () => {
                if (viewer && !viewerMin) setViewerMin(true);
                else if (viewer) setViewerMin(false);
                else if (module) {
                  const s = lesson?.sources[0] ?? module.sources[0];
                  setViewer({ doc: s.doc, page: s.pages[0] });
                }
              }
            : undefined
        }
        onMemory={() => setMemoryOpen(true)}
        onNotes={() => setNotesOpen(true)}
        notesCount={module && lessonIdx !== undefined ? notes.filter((n) => n.moduleId === module.id && n.lesson === lessonIdx).length : notes.length}
      />
      <div className="body">
        {index ? (
          <ModuleMap index={index} done={done} progress={mods} selection={selection} onSelect={setSelection} open={sideOpen} onClose={() => setSideOpen(false)} />
        ) : (
          <nav className={`sidebar ${sideOpen ? "is-open" : ""}`}>
            <div className="side-head">
              <div className="side-title">מפת המודולים</div>
            </div>
            <div className="block-pending">{indexError || "טוען את הספרייה…"}</div>
          </nav>
        )}
        {sideOpen && <div className="scrim" onClick={() => setSideOpen(false)} />}

        {inLesson && <ExplainPanel rt={rt} scrollRef={scrollRef} lessonKey={`${module!.id}:${lessonIdx}`} lessonTitle={`${module!.id} · ${lesson?.title ?? module!.title}`} memory={memory} />}
        <main className="main">
          <ReadingProgress scrollRef={scrollRef} />
          {resume.resumed && (
            <div className="resume-chip" role="status">
              <span>חזרנו למקום שבו הפסקת לקרוא</span>
              <button className="link" onClick={resume.toTop}>לראש השיעור</button>
              <button className="icon-btn" onClick={resume.dismiss} aria-label="סגור">
                <Icon name="close" size={14} />
              </button>
            </div>
          )}
          <div className="scroll" ref={scrollRef} onScroll={() => {
            const el = scrollRef.current!;
            stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
          }}>
            <div className="col">
              {rt && !rt.sample && <div className="banner banner-warn">אין כאן חיבור ל-Claude. פתח את הדף ב-claude.ai כשאתה מחובר, ואשר לו לפנות ל-Claude כשתתבקש.</div>}
              {rt && rt.sample && !rt.store && <div className="banner banner-warn">השיחות וההתקדמות לא יישמרו בתצוגה הזו (צריך להיות מחובר ל-claude.ai עם הרשאת כתיבה).</div>}
              {indexError && <div className="banner banner-error">{indexError}</div>}

              {!module && index && <Overview index={index} done={done} mods={mods} onSelect={setSelection} />}

              {module && lessonIdx === undefined && (
                <MdContext.Provider value={mdCtx}>
                  <ModulePage
                    m={module}
                    state={state}
                    prog={prog}
                    done={done}
                    planning={planning?.moduleId === module.id ? planning.status : null}
                    canPlan={!!rt?.sample && !busy}
                    onPlan={() => runPlan(module)}
                    onStop={() => ctl.current?.abort()}
                    onSelect={setSelection}
                    index={index!}
                  />
                </MdContext.Provider>
              )}

              {module && lessonIdx !== undefined && (
                <>
                  {items.length === 0 && (
                    <MdContext.Provider value={mdCtx}>
                      {lesson && <LessonIntro m={module} idx={lessonIdx} lesson={lesson} total={nLessons} />}
                      {isQuiz && <QuizIntro m={module} prog={prog} />}
                      {!lesson && !isQuiz && <div className="block-pending">השיעור הזה עוד לא תוכנן.</div>}
                    </MdContext.Provider>
                  )}
                  {items.map((it, i) =>
                    it.kind === "user" ? (
                      <UserBubble key={it.key} item={it} />
                    ) : (
                      <AssistantTurn
                        key={it.key}
                        item={it}
                        live={busy && !!live && i === items.length - 1}
                        header={lesson ? { code: `${module.id} · ${(lessonIdx ?? 0) + 1}/${nLessons}`, title: lesson.title, sub: module.title } : undefined}
                        fullBar={fullBar}
                        onOpenSource={openSource}
                        onFillGaps={(missing) =>
                          send(`בשיעור חסרו לפי בדיקת הרף: ${missing.join(", ")}. השלם עכשיו את מה שחסר ברמה המלאה, בהמשך ישיר לשיעור ובלי לחזור על מה שכבר נכתב.`, [], "clarify")
                        }
                        onContinue={i === items.length - 1 && !busy ? resumeLast : undefined}
                        notes={lesson ? notes.filter((n) => n.moduleId === module.id && n.lesson === lessonIdx) : undefined}
                      />
                    ),
                  )}
                  {hasLesson && !busy && nextLesson !== null && (
                    <div className="next-row">
                      <button className="btn primary" onClick={() => setSelection({ moduleId: module.id, lesson: nextLesson })}>
                        {nextLesson === -1 ? "למבחן המסכם של המודול" : `לשיעור ${nextLesson + 1}: ${prog?.lessons?.[nextLesson]?.title}`}
                        <Icon name="next" size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
              {notices.map((n, i) => (
                <div key={i} className={`banner banner-${n.level}`}>
                  {n.text}
                </div>
              ))}
            </div>
            {inLesson && items.length > 0 && <ReadingDock scrollRef={scrollRef} version={items} />}
          </div>
          {module && lessonIdx !== undefined && (lesson || isQuiz) && (
            <Composer
              busy={busy}
              onSend={(t, im) => {
                const q = quick.find((x) => x.text === t);
                send(t, im, q ? q.mode : mode);
              }}
              onStop={() => ctl.current?.abort()}
              quick={quick}
              modes={isQuiz ? ["quiz", "clarify"] : ["clarify", "free"]}
              mode={mode}
              setMode={setMode}
              effort={effort}
              setEffort={setEffort}
              canAttach={!!rt?.canSendImages}
              disabled={!rt?.sample}
            />
          )}
        </main>

        {showToc &&
          (leftDock === "toc" ? (
            <LessonToc scrollRef={scrollRef} version={items} open setOpen={(o) => !o && setLeftDock("")} />
          ) : leftDock === "pad" ? (
            <Scratchpad rt={rt} scrollRef={scrollRef} lessonKey={`${module!.id}__${lessonIdx}`} lessonTitle={`${module!.id} · ${lesson?.title ?? module!.title}`} onClose={() => setLeftDock("")} />
          ) : (
            <div className="left-rail" role="tablist" aria-label="לוחות משמאל לשיעור">
              <button className="left-rail-btn is-toc" onClick={() => setLeftDock("toc")} title="תוכן השיעור">
                <Icon name="coverage" size={16} />
                <span>תוכן השיעור</span>
              </button>
              <button className="left-rail-btn" onClick={() => setLeftDock("pad")} title="מחברת: שרטוטים ופתרונות לשיעור הזה">
                <Icon name="exercise" size={16} />
                <span>מחברת</span>
              </button>
            </div>
          ))}
        {viewer && !viewerMin && <SourceViewer doc={viewer.doc} page={viewer.page} onPage={(p) => setViewer({ ...viewer, page: p })} onClose={() => setViewer(null)} onCollapse={() => setViewerMin(true)} />}
        {viewer && viewerMin && (
          <button className="viewer-rail" onClick={() => setViewerMin(false)} aria-label="פתח את מציג המקורות" title="פתח את מציג המקורות">
            <Icon name="book" size={16} />
            <span>{docMeta(viewer.doc)?.short ?? viewer.doc} · {viewer.page}</span>
          </button>
        )}
      </div>

      {notesOpen && (
        <NotesPanel
          notes={notes}
          here={module && lessonIdx !== undefined ? { moduleId: module.id, lesson: lessonIdx } : null}
          hereLabel={module && lessonIdx !== undefined ? `${module.id} · ${isQuiz ? "מבחן מסכם" : `שיעור ${lessonIdx + 1}: ${lesson?.title ?? ""}`}` : ""}
          canWrite={!!rt}
          onAdd={(kind, text) => module && lessonIdx !== undefined && addNote(kind, text, "learner", module, lessonIdx)}
          onUpdate={(id, patch) => {
            if (id.startsWith("local-") || !rt?.store) setNotes((all) => all.map((n) => (n.id === id ? { ...n, ...patch } : n)));
            else rt.store.updateNote(id, patch).catch(() => notify({ level: "error", text: "העדכון לא נשמר." }));
          }}
          onDelete={(id) => {
            if (id.startsWith("local-") || !rt?.store) setNotes((all) => all.filter((n) => n.id !== id));
            else rt.store.deleteNote(id).catch(() => notify({ level: "error", text: "המחיקה לא נשמרה." }));
          }}
          onClose={() => setNotesOpen(false)}
          onOpen={(moduleId, l) => {
            setNotesOpen(false);
            setSelection({ moduleId, lesson: l });
          }}
        />
      )}
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
              notify({ level: "error", text: "שמירת הזיכרון נכשלה." });
            }
          }}
        />
      )}
    </div>
  );
}

/* ---------------- pages ---------------- */

function Overview({ index, done, mods, onSelect }: { index: LibraryIndex; done: Set<string>; mods: Record<string, ModuleProgress>; onSelect: (s: Selection) => void }) {
  const open = index.modules.filter((m) => moduleState(m, done) === "open");
  const started = open.filter((m) => mods[m.id]?.lessons?.length);
  const fresh = open.filter((m) => !mods[m.id]?.lessons?.length && m.tier === "core");
  const counts = { done: done.size, open: open.length, locked: index.modules.length - done.size - open.length };
  const pick = [...started, ...fresh].slice(0, 8);
  return (
    <div className="overview">
      <DimensionHead code="GILUA · ENG LAB" title="גילואה" sub="הנדסה ברמה 2.5: מבנה, מקור, גבולות, סדר גודל, פשרה, מבנה משותף וביקורת. עמוד שדרה, חמישה צמתים, גשרים ופריפריה, מתוך הספרייה." />
      <dl className="stats">
        {(["done", "open", "locked"] as const).map((k) => (
          <div key={k} className={`stat st-${k}`}>
            <dt>{STATE_LABEL[k]}</dt>
            <dd dir="ltr">{counts[k]}</dd>
          </div>
        ))}
      </dl>
      <h2 className="section-title">מפת תוכנית הלימודים</h2>
      <RingMap index={index} done={done} mods={mods} onSelect={onSelect} />
      <h2 className="section-title">{started.length ? "להמשיך מכאן" : "מודולים זמינים להתחלה"}</h2>
      <ul className="cards">
        {pick.map((m) => {
          const p = mods[m.id];
          return (
            <li key={m.id}>
              <button className="card" onClick={() => onSelect({ moduleId: m.id })}>
                <span className="card-id" dir="ltr">
                  {m.id}
                </span>
                <span className="card-title">{m.title}</span>
                <span className="card-en" dir="ltr">
                  {m.en}
                </span>
                <span className="card-foot">
                  <span className={`tier tier-${m.tier}`}>{TIER_LABEL[m.tier]}</span>
                  {p?.lessons?.length ? (
                    <span>
                      {p.done?.length ?? 0}/{p.lessons.length} שיעורים
                    </span>
                  ) : (
                    <span>{m.sources.reduce((s, x) => s + x.pages[1] - x.pages[0] + 1, 0)} עמ'</span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="muted">
        מודול נפתח כשכל הדרישות המוקדמות שלו נלמדו, ומסומן כנלמד כשכל השיעורים שלו נכתבו עד הסוף. ההסבר למודול נעול מופיע בלחיצה עליו במפה.
      </p>
    </div>
  );
}

function SourceList({ m }: { m: Module }) {
  const ROLE = { main: "מקור ראשי", supp: "השלמה", article: "מאמר", ex: "תרגילים" };
  return (
    <ul className="sources">
      {m.sources.map((s, i) => (
        <li key={i} className={`src src-${s.role}`}>
          <span className="src-role">{ROLE[s.role]}</span>
          <span className="src-name">
            <SourceTag doc={s.doc} page={s.pages[0]} />
            {s.pages[1] > s.pages[0] && (
              <span className="muted" dir="ltr">
                {" "}
                ({s.pages[1] - s.pages[0] + 1} עמ')
              </span>
            )}
          </span>
          {s.note && <span className="src-note">{s.note}</span>}
          <span className="src-title" dir="ltr">
            {docMeta(s.doc)?.title}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ModulePage({
  m,
  state,
  prog,
  done,
  planning,
  canPlan,
  onPlan,
  onStop,
  onSelect,
  index,
}: {
  m: Module;
  state: "done" | "open" | "locked";
  prog?: ModuleProgress;
  done: Set<string>;
  planning: string | null;
  canPlan: boolean;
  onPlan: () => void;
  onStop: () => void;
  onSelect: (s: Selection) => void;
  index: LibraryIndex;
}) {
  const lessons = prog?.lessons ?? [];
  const missing = (m.prereq ?? []).filter((x) => !done.has(x));
  return (
    <div className="module-page">
      <DimensionHead code={m.id} title={m.title} sub={`${m.en} · ${TIER_LABEL[m.tier]} · ${STATE_LABEL[state]}`} />
      {state === "locked" && (
        <div className="banner banner-warn">
          המודול נעול. הוא ייפתח אחרי שיילמדו:{" "}
          {missing.map((x, i) => (
            <span key={x}>
              {i > 0 && ", "}
              <button className="link" onClick={() => onSelect({ moduleId: x })}>
                <bdi dir="ltr">{x}</bdi> {index.modules.find((y) => y.id === x)?.title}
              </button>
            </span>
          ))}
        </div>
      )}
      <h2 className="section-title">המקורות</h2>
      <SourceList m={m} />
      {m.prereq?.length ? (
        <p className="muted">
          נשען על:{" "}
          {m.prereq.map((x, i) => (
            <span key={x}>
              {i > 0 && " · "}
              <bdi dir="ltr">{x}</bdi> {index.modules.find((y) => y.id === x)?.title}
            </span>
          ))}
        </p>
      ) : null}

      <h2 className="section-title">השיעורים</h2>
      {planning ? (
        <div className="live-status">
          <span className="spinner" />
          {planning}
          <button className="btn small" onClick={onStop}>
            עצור
          </button>
        </div>
      ) : lessons.length ? (
        <>
          <ol className="lesson-list">
            {lessons.map((l, i) => {
              const isDone = (prog?.done ?? []).includes(i);
              return (
                <li key={i} className={isDone ? "is-done" : ""}>
                  <button className="lesson-card" onClick={() => onSelect({ moduleId: m.id, lesson: i })}>
                    <span className="lesson-no" dir="ltr">
                      {i + 1}
                    </span>
                    <span className="lesson-body">
                      <span className="lesson-title">{l.title}</span>
                      <span className="lesson-covers">{l.covers.join(" · ")}</span>
                    </span>
                    <span className={`state state-${isDone ? "done" : "open"}`}>{isDone ? "הושלם" : prog?.convs?.[String(i)] ? "בתהליך" : "לא התחיל"}</span>
                  </button>
                </li>
              );
            })}
            <li>
              <button className="lesson-card quiz" onClick={() => onSelect({ moduleId: m.id, lesson: -1 })}>
                <span className="lesson-no">
                  <Icon name="quiz" size={16} />
                </span>
                <span className="lesson-body">
                  <span className="lesson-title">מבחן מסכם</span>
                  <span className="lesson-covers">הערכות, פשרות ומציאת טעויות על כל המודול</span>
                </span>
                {prog?.quizScore && <span className="state state-done">{prog.quizScore}</span>}
              </button>
            </li>
          </ol>
          {prog?.uncovered?.length ? <p className="muted">סעיפים שהחלוקה לא שייכה בעצמה, וצורפו לשיעור הקרוב אליהם: {prog.uncovered.join(" · ")}</p> : null}
          {prog?.uncoveredPages?.length ? (
            <p className="muted">עמודים שהחלוקה לא שייכה בעצמה, וצורפו לשיעור הקרוב אליהם: {prog.uncoveredPages.map((g) => `${docMeta(g.doc)?.short ?? g.doc} ${g.pages[0]}–${g.pages[1]}`).join(" · ")}</p>
          ) : null}
          {canPlan && !(prog?.done ?? []).length && (
            <button className="btn small" onClick={onPlan}>
              חלק מחדש לשיעורים
            </button>
          )}
        </>
      ) : state === "locked" ? (
        <p className="muted">החלוקה לשיעורים תיעשה כשהמודול ייפתח.</p>
      ) : (
        <div className="empty">
          <p>המורה מחלק את המודול לשיעורים לפי הסעיפים: כל סעיף בעמודי המודול מקבל שיעור, חפיפות בין המקורות מאוחדות, ובסוף נבדק שלא הושמט דבר.</p>
          <button className="btn primary" onClick={onPlan} disabled={!canPlan}>
            חלק לשיעורים
          </button>
        </div>
      )}

      {m.sections.length > 0 && (
        <details className="sections">
          <summary>סעיפים בעמודי המודול ({m.sections.length})</summary>
          <ul>
            {m.sections.map((s, i) => (
              <li key={i} className={`depth-${s.depth}`}>
                <SourceTag doc={s.doc} page={s.page} /> <span dir="ltr">{s.title}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function LessonIntro({ m, idx, lesson, total }: { m: Module; idx: number; lesson: NonNullable<ModuleProgress["lessons"]>[number]; total: number }) {
  return (
    <div className="lesson-intro">
      <DimensionHead code={`${m.id} · ${idx + 1}/${total}`} title={lesson.title} sub={m.title} />
      <p>{lesson.focus}</p>
      <h2 className="section-title">מה השיעור מכסה</h2>
      <ul className="covers">
        {lesson.covers.map((c, i) => (
          <li key={i} dir="auto">
            {c}
          </li>
        ))}
      </ul>
      <h2 className="section-title">עמודי המקור</h2>
      <ul className="src-pages">
        {lesson.sources.map((s, i) => (
          <li key={i}>
            <SourceTag doc={s.doc} page={s.pages[0]} />
            {s.pages[1] > s.pages[0] && (
              <span className="muted">
                {" "}
                עד <SourceTag doc={s.doc} page={s.pages[1]} />
              </span>
            )}
          </li>
        ))}
      </ul>
      <p className="muted">השיעור נכתב בחלקים, ונשמר תוך כדי כתיבה. אם הדפדפן נסגר באמצע, הכתיבה ממשיכה מהחלק שנעצר.</p>
    </div>
  );
}

function QuizIntro({ m, prog }: { m: Module; prog?: ModuleProgress }) {
  const n = prog?.lessons?.length ?? 0;
  const d = prog?.done?.length ?? 0;
  return (
    <div className="lesson-intro">
      <DimensionHead code={`${m.id} · מבחן`} title={`מבחן מסכם: ${m.title}`} />
      <p>שש עד שמונה שאלות על כל המודול ברמה 2.5: אומדן בראש, החלטה של פשרה עם נימוק, מציאת טעות, זיהוי מבנה משותף בתחום אחר, וחישוב או שניים עם מספרים אמיתיים. עונים בהודעה אחת, והמורה בודק כל תשובה ונותן ציון.</p>
      {d < n && <p className="muted">נלמדו {d} מתוך {n} שיעורים. אפשר לגשת למבחן גם עכשיו, אבל הוא מכסה את כל המודול.</p>}
    </div>
  );
}

