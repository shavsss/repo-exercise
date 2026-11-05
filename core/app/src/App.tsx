import { cloneElement, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { connect, type ConvMeta, type Runtime, type SampleError } from "./runtime";
import { docMeta, loadIndex, moduleState, type LibraryIndex, type Module } from "./library";
import { auditLesson, INITIAL_MEMORY, askTutor, composeLesson, planModule, updateMemory, type PartPlan } from "./tutor";
import { toItems } from "./segments";
import { NOTE_KIND_LABEL } from "./types";
import type { Activity, Effort, LessonNote, LessonSpec, ModuleProgress, Mode, NoteKind, StoredMessage } from "./types";
import { ModuleMap, STATE_LABEL, TIER_LABEL, type Selection } from "./components/ModuleMap";
import { Topbar, type Crumb } from "./components/Topbar";
import { AssistantTurn, DimensionHead, UserBubble } from "./components/Message";
import { HomeHero } from "./components/HomeHero";
import { Composer, type QuickAction } from "./components/Composer";
import { lessonChannel } from "./summaries/SummaryApp";
import { collectVisuals } from "./lessonVisuals";
import { AuditBar } from "./components/AuditBar";
import { LessonToc, ReadingDock, ReadingProgress, useResumePosition } from "./components/ReadingAids";
import { noteAnchorHere } from "./components/MarginNotes";
import { SectionDots } from "./components/SectionDots";
import { play } from "./sound";
import { Scratchpad } from "./components/Scratchpad";
import { ConsultLayer } from "./components/Consult";
import { LessonPlaceCtx } from "./events";
import { SourceViewer } from "./components/SourceViewer";
import { MemoryPanel } from "./components/MemoryPanel";
import { MdContext } from "./components/Markdown";
import { GuideCtx, useLessonGuide, type GuideCtxValue } from "./components/LessonGuide";
import { asGuide } from "./guide";
import { setLevel3Scope } from "./level3";
import { SourceTag } from "./components/blocks/SourceTag";
import { Icon } from "./components/Icon";
import { NotesPanel } from "./components/NotesPanel";
import { ModuleTopics, ReadingList } from "./components/ReadingList";
import { LabTabView, LabTabsNav, useNewsUnread, type LabTab } from "./labtabs/LabTabs";
import { saveMemoryVersion, updateMemorySafely } from "./memoryLog";
import { joinContinuation, looksCut } from "./truncation";
import { countLesson } from "./usage";
import { isNewDay, lastSelection, stopOf, useDayClock } from "./day";
import { stopPrefetch, usePrefetch, usePrefetchDriver, useSettlePrefetched } from "./prefetch";
import { ShelfOffer } from "./components/ShelfOffer";
import { WaitPanel } from "./components/WaitPanel";
import { BreakLine } from "./components/BreakLine";
import { MorningCard } from "./components/MorningCard";
import { CloseDay } from "./components/CloseDay";
import { BookView } from "./book/Book";
import { BookBridge } from "./book/context";
import { useReading } from "./reading";
import type { QuizCtx } from "./components/QuizForm";

interface Notice {
  level: "info" | "warn" | "error";
  text: string;
}

const MAX_PARTS = 4;
/** How often a draft is saved while text streams (plus at every plan/part boundary). */
const SAVE_EVERY = 8000;
const CONTINUE_TEXT = "התשובה הקודמת נקטעה לפני סופה (באורך המרבי, באמצע משפט או בתוך בלוק פתוח). המשך בדיוק מהמקום שבו נעצרה, מאמצע המשפט אם צריך, בלי לחזור על דבר ובלי הקדמה.";

const ERROR_COPY: Record<string, string> = {
  not_granted: "הדף לא קיבל הרשאה לפנות ל-Claude. אפשר לאשר אותה בתפריט ההרשאות של ה-Artifact.",
  sampling_disabled: "Claude אינו זמין בחשבון הזה.",
  rate_limited: "הגעת למגבלת השימוש כרגע. נסה שוב בעוד כמה דקות.",
  session_expired: "צריך להתחבר מחדש ל-claude.ai.",
  prompt_too_large: "הבקשה גדולה מדי לשליחה אחת. כדאי לשאול על חלק קטן יותר.",
  refused: "Claude סירב להמשיך את הבקשה הזו. מה שנכתב עד כאן נשמר, ו'המשך' ינסה שוב מהחלק האחרון.",
  empty_completion: "לא התקבלה תשובה. נסה לבקש פחות בבת אחת.",
  image_rejected: "התמונה לא התקבלה (סוג או גודל). נסה קובץ אחר.",
  invalid_json: "התכנון שהתקבל לא היה תקין. אפשר לנסות שוב.",
  upstream_error: "החיבור ל-Claude נקטע. אפשר לנסות שוב.",
  invalid_request: "Claude דחה את מבנה הבקשה (invalid_request). זו תקלה בדף, לא בשאלה: ההודעה נשמרה, וכדאי לספר על זה.",
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
      // the first open after a night away starts on the home screen, with the morning card
      return isNewDay() ? null : JSON.parse(readLocal("core-lab:sel") ?? "null");
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
  const [mode, setMode] = useState<Mode>("clarify");
  const [effort, setEffort] = usePersisted<Effort>("core-lab:effort", "high");
  const [sideOpen, setSideOpen] = useState(false);
  const [sidePref, setSidePref] = usePersisted<"open" | "closed">("core-lab:side", "open");
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
  const [tab, setTab] = useState<LabTab>("study");
  const newsUnread = useNewsUnread(rt, tab);
  // an info notice is a passing word: it goes by itself after a few seconds; any notice can be closed
  const notify = (n: Notice) => {
    setNotices((all) => [...all, n]);
    if (n.level === "info") setTimeout(() => setNotices((all) => all.filter((x) => x !== n)), 7000);
  };
  const dismiss = (n: Notice) => setNotices((all) => all.filter((x) => x !== n));

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
    const ch = new BroadcastChannel(lessonChannel("lanchester"));
    ch.postMessage({ moduleId: selection.moduleId, lesson: selection.lesson });
    ch.close();
  }, [selection?.moduleId, selection?.lesson]);
  const lesson = lessonIdx !== undefined && lessonIdx >= 0 ? prog?.lessons?.[lessonIdx] : undefined;
  // the summaries window asks for the pictures of the lesson open here (a chart, a drawn figure, a simulation)
  const selRef = useRef(selection);
  selRef.current = selection;
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const ch = new BroadcastChannel(lessonChannel("lanchester"));
    ch.onmessage = async (e) => {
      const d = e.data as { type?: string; req?: string };
      if (d?.type !== "visuals?" || !selRef.current?.moduleId) return;
      const items = await collectVisuals().catch(() => []);
      ch.postMessage({ type: "visuals", req: d.req, moduleId: selRef.current?.moduleId, lesson: selRef.current?.lesson, items });
    };
    return () => ch.close();
  }, []);
  const isQuiz = lessonIdx === -1;
  // the learner's answers to predict/errorhunt/verify/lab/decide blocks belong to the open lesson
  useEffect(() => setLevel3Scope(rt?.store ?? null, module && lessonIdx !== undefined ? `${module.id}__${lessonIdx}` : ""), [rt, module, lessonIdx]);
  const state = module ? moduleState(module, done) : "locked";

  const setSelection = useCallback(
    (s: Selection | null) => {
      if (busy) return;
      setSelectionState(s);
      writeLocal("core-lab:sel", JSON.stringify(s));
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
  const updateNote = useCallback(
    (id: string, patch: Partial<LessonNote>) => {
      if (id.startsWith("local-") || !rt?.store) setNotes((all) => all.map((n) => (n.id === id ? { ...n, ...patch } : n)));
      else rt.store.updateNote(id, patch).catch(() => notify({ level: "error", text: "העדכון לא נשמר." }));
    },
    [rt],
  );
  const deleteNote = useCallback(
    (id: string) => {
      if (id.startsWith("local-") || !rt?.store) setNotes((all) => all.filter((n) => n.id !== id));
      else rt.store.deleteNote(id).catch(() => notify({ level: "error", text: "המחיקה לא נשמרה." }));
    },
    [rt],
  );
  const addNote = useCallback(
    async (kind: NoteKind, text: string, who: LessonNote["who"], m: Module, idx: number, anchor?: string) => {
      const lessonTitle = idx >= 0 ? modsRef.current[m.id]?.lessons?.[idx]?.title : "מבחן מסכם";
      const note: LessonNote = { who, kind, text, moduleId: m.id, lesson: idx, ts: Date.now(), ...(lessonTitle ? { lessonTitle } : {}), ...(anchor ? { anchor, margin: true } : {}) };
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
      play("done");
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
   * A lesson whose plan split its material (the "split" of the candidate rules: depth is never cut,
   * what does not fit becomes the next lesson) gets that next lesson inserted right after it, with
   * the same source pages. The lesson indices after it (conversations, done) move by one.
   */
  const insertSplit = useCallback(
    async (m: Module, idx: number, split: { title?: string; covers?: string }) => {
      const p = modsRef.current[m.id];
      const lessons = p?.lessons;
      const cur = lessons?.[idx];
      if (!lessons || !cur || !split.title) return;
      if (lessons.some((l) => l.title === split.title)) return;
      const spec: LessonSpec = { title: split.title, covers: cur.covers, sources: cur.sources, focus: `המשך של «${cur.title}»: ${split.covers ?? ""}` };
      // per-lesson data elsewhere (consults, scratch, level-3 answers, calibration) is keyed by the
      // lesson index: when a later lesson has already been opened, the continuation goes to the end of
      // the module instead, so nothing that exists moves under a different lesson
      const later = Object.keys(p.convs ?? {}).some((k) => Number(k) > idx) || (p.done ?? []).some((k) => k > idx);
      if (later) {
        await saveModule(m.id, { lessons: [...lessons, spec] });
        notify({ level: "info", text: `החומר שלא נכנס לשיעור בעומק מלא עבר לשיעור המשך בסוף המודול: «${split.title}».` });
        return;
      }
      const shift = (k: number) => (k > idx ? k + 1 : k);
      const convs = Object.fromEntries(Object.entries(p.convs ?? {}).map(([k, v]) => [String(shift(Number(k))), v]));
      const done = (p.done ?? []).map(shift);
      await saveModule(m.id, { lessons: [...lessons.slice(0, idx + 1), spec, ...lessons.slice(idx + 1)], convs, done });
      notify({ level: "info", text: `החומר שלא נכנס לשיעור בעומק מלא עבר לשיעור הבא: «${split.title}».` });
    },
    [saveModule],
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
      const started = Date.now();
      try {
        const cb = {
          onActivity: (a: Activity) => {
            activity.push(a);
            setLive((l) => (l ? { ...l, activity: [...activity] } : l));
          },
          onStatus: (status: string) => setLive((l) => (l ? { ...l, status } : l)),
          onCheckpoint: (plan: PartPlan, partsDone: number, text: string) => {
            setLive((l) => (l ? { ...l, plan, partsDone } : l));
            return save({ plan, partsDone, partsChars: text.length, text }, true);
          },
          onDiag: store ? (d: Record<string, unknown>) => store.saveDiag(d) : undefined,
          onText: show,
          onNote: (kind: NoteKind, text: string, addTo?: string) => (addTo ? appendToNote(addTo, text) : addNote(kind, text, "tutor", m, idx)),
        };
        const lessons = modsRef.current[m.id]?.lessons;
        const lessonNotes = notesRef.current.filter((n) => n.moduleId === m.id && n.lesson === idx);
        const allNotes = notesRef.current.filter((n) => !(n.moduleId === m.id && n.lesson === idx));
        const base = { rt, history, effort, module: m, lessons, lessonIdx: idx, memory, notes: lessonNotes, allNotes, done: doneList, signal: ctl.current.signal, cb };
        const plan = answer.plan as PartPlan | undefined;
        if (sendMode === "lesson" && !images.length && (!resume || plan || !resume.text)) {
          const res = await composeLesson({ ...base, text: userMsg.text, resume: plan ? { plan, partsDone: answer.partsDone ?? 0, text: answer.partsChars !== undefined ? answer.text.slice(0, answer.partsChars) : answer.text } : undefined });
          answer = { ...answer, text: res.text, model: res.model, ...(res.audit ? { audit: res.audit } : {}) };
          const split = (res.plan as (PartPlan & { split?: { title?: string; covers?: string } | null }) | undefined)?.split;
          if (split?.title && idx >= 0) await insertSplit(m, idx, split);
          // a lesson written as chapters of a book: the next lesson numbers its chapters after these
          const nch = (res.plan as PartPlan | undefined)?.outline?.chapters?.length;
          const ls = modsRef.current[m.id]?.lessons;
          if (nch && idx >= 0 && ls?.[idx] && ls[idx].chapters !== nch) await saveModule(m.id, { lessons: ls.map((l, i) => (i === idx ? { ...l, chapters: nch } : l)) }).catch(() => {});
        } else {
          let full = answer.text;
          let res: Awaited<ReturnType<typeof askTutor>> | null = null;
          if (!full) {
            // the module quiz asks only what was taught in full: the lesson maps say what was core and what only a first look
            let maps: string | undefined;
            if (sendMode === "quiz" && rt?.store) {
              const n = prog?.lessons?.length ?? 0;
              const lines: string[] = [];
              for (let i = 0; i < n; i++) {
                const g = asGuide(await rt.store.loadGuide(`${m.id}__${i}`).catch(() => null));
                if (!g) continue;
                const items = [...(g.blocks ?? []), ...g.sections];
                const of = (k: string) => items.filter((x) => x.kind === k).map((x) => `${x.head}${x.module ? ` (${x.module})` : ""}`).join("; ");
                lines.push(`Lesson ${i + 1}: core: ${of("core") || "-"} | preview: ${of("preview") || "-"} | example: ${of("example") || "-"}${g.copy.length ? ` | to remember: ${g.copy.join("; ")}` : ""}`);
              }
              // the topics only introduced, named once more as a list the quiz may ask about only in words
              const ideaOnly = [...new Set(lines.length ? (await Promise.all([...Array(n).keys()].map((i) => rt.store!.loadGuide(`${m.id}__${i}`).catch(() => null)))).flatMap((d) => {
                const g = asGuide(d);
                return g ? [...(g.blocks ?? []), ...g.sections].filter((x) => x.kind !== "core").map((x) => x.head) : [];
              }) : [])];
              maps = lines.length ? `${lines.join("\n")}${ideaOnly.length ? `\n<idea_only>\n${ideaOnly.join("\n")}\n</idea_only>` : ""}` : undefined;
            }
            res = await askTutor({ ...base, mode: sendMode, text: userMsg.text, images, maps });
            full = res.text;
          }
          let cuts = 0;
          for (let part = 1; (res === null || res.truncated || (looksCut(full).cut && cuts++ < 1)) && part <= MAX_PARTS; part++) {
            const before = full;
            res = await askTutor({
              ...base,
              mode: sendMode,
              history: [...history, userMsg, { ...answer, text: full }],
              text: CONTINUE_TEXT,
              images: [],
              continuing: true,
              cb: { ...cb, onText: (t: string) => show(joinContinuation(before, t)) },
            });
            full = joinContinuation(before, res.text);
          }
          answer = { ...answer, text: full, model: res?.modelApplied ?? `רמת מודל: ${res?.modelTierApplied}`, ...(res?.truncated ? { truncated: true } : {}) };
        }
        answer = { ...answer, draft: undefined, plan: undefined, partsDone: undefined, partsChars: undefined };
        ok = !answer.truncated;
      } catch (err) {
        const e = err as SampleError;
        // keep the draft fields so "continue" can resume from the last saved part
        answer = { ...answer, text: shown || (e.text ?? ""), interrupted: true, draft: undefined };
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
      if (sendMode === "lesson") countLesson(answer.text, Date.now() - started);
      const score = /\[\[ציון:\s*([^\]]+)\]\]/.exec(answer.text)?.[1]?.trim();
      if (sendMode === "quiz" && score) await saveModule(m.id, { quizScore: score });
      if (sendMode === "lesson" || (sendMode === "quiz" && score)) {
        setMemoryBusy(true);
        try {
          const where = `${m.id} «${m.title}», ${idx >= 0 ? `שיעור ${idx + 1} מתוך ${modsRef.current[m.id]?.lessons?.length ?? "?"}` : "מבחן מסכם"}`;
          // re-read from the db, so an edit made during the lesson is not overwritten; versions are kept (memoryLog.ts)
          const next = await updateMemorySafely({ rt, update: updateMemory, fallback: memory, answer, request: userMsg.text, where });
          if (next) setMemory(next);
        } catch {
          notify({ level: "warn", text: "זיכרון הקורס לא עודכן הפעם. אפשר לעדכן אותו ידנית." });
        } finally {
          setMemoryBusy(false);
        }
      }
    },
    [effort, memory, doneList, finishLesson, saveModule, addNote, insertSplit],
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
  // "לדון עם המורה" on a margin note (MarginNotes.tsx): the note goes to the lesson chat as his question, for a real discussion
  const discussRef = useRef(send);
  discussRef.current = send;
  useEffect(() => {
    const on = (e: Event) => {
      const n = (e as CustomEvent<LessonNote>).detail;
      if (!n?.text?.trim()) return;
      const where = n.anchor ? ` ליד הפסקה «${n.anchor.slice(0, 160)}${n.anchor.length > 160 ? "…" : ""}»` : "";
      void discussRef.current(`על הפתק שכתבתי${where} (${NOTE_KIND_LABEL[n.kind]}):\n\n${n.text.trim()}\n\nבוא נדון בזה לעומק.`, [], "clarify");
    };
    window.addEventListener("note:discuss", on);
    return () => window.removeEventListener("note:discuss", on);
  }, []);

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

  // a lesson written ahead (prefetch.ts) is followed live when it is opened while it is written
  const pf = usePrefetch();
  const following = pf.running && !!module && pf.key === `${module.id}:${lessonIdx}`;
  const pfLive = following ? pf.live : null;
  useEffect(() => {
    if (pf.doneConv && pf.doneConv === convId && rt?.store && !busy) rt.store.loadMessages(convId).then(setMessages).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pf.seq]);
  const all = useMemo(() => (live ? [...messages, live] : pfLive ? [...messages.filter((m) => m.role === "user" || m.id !== pfLive.id), pfLive] : messages), [messages, live, pfLive]);
  const items = useMemo(() => toItems(all), [all]);
  const hasLesson = messages.some((m) => m.role === "assistant" && m.mode === "lesson" && !m.interrupted && !m.draft);
  // the lesson's check against its sources (lessonAudit.ts): a lesson written before the check gets it on request,
  // and what it finds is added as a supplement at the lesson's end (he has read the lesson already)
  const [auditRun, setAuditRun] = useState<{ key: string; status?: string } | null>(null);
  const auditLock = useRef(false);
  const lessonMsg = [...messages].reverse().find((m) => m.role === "assistant" && m.mode === "lesson" && m.text && !m.draft && !m.interrupted);
  const runAudit = useCallback(async () => {
    // a second click before the first one's state lands would start a second check and a second supplement
    if (!rt?.sample || !rt.store || !module || lessonIdx === undefined || lessonIdx < 0 || !convId || busy || auditRun || auditLock.current) return;
    auditLock.current = true;
    const msg = [...messages].reverse().find((m) => m.role === "assistant" && m.mode === "lesson" && m.text && !m.draft && !m.interrupted);
    if (!msg?.id) return;
    const key = `${module.id}__${lessonIdx}`;
    setAuditRun({ key });
    try {
      const res = await auditLesson({
        rt,
        module,
        lessons: modsRef.current[module.id]?.lessons,
        lessonIdx,
        text: msg.text,
        mode: "supplement",
        cb: { onText: () => {}, onActivity: () => {}, onStatus: (status) => setAuditRun({ key, status }) },
      });
      if (!res) throw new Error("no check");
      const next = { ...msg, text: res.text, audit: res.mark };
      await rt.store.saveMessage(convId, msg.id, next);
      setMessages((all) => all.map((m) => (m.id === msg.id ? next : m)));
      notify({ level: "info", text: res.mark.verdict === "pass" ? "השיעור נבדק מול המקור ולא נמצא בו חוסר." : "השיעור נבדק מול המקור, וההשלמה נוספה בסופו." });
    } catch (e) {
      if ((e as { code?: string })?.code !== "cancelled") notify({ level: "error", text: `בדיקת השיעור לא הושלמה. ${ERROR_COPY[(e as { code?: string })?.code ?? ""] ?? "אפשר לנסות שוב."}` });
    } finally {
      auditLock.current = false;
      setAuditRun(null);
    }
  }, [rt, module, lessonIdx, convId, busy, auditRun, messages]);
  // he gets a finished lesson: a lesson that was never checked, or was left "partly" by the first version of the
  // check (two rounds), is checked when it is opened, once per window; a failure leaves the button
  const autoAudited = useRef(new Set<string>());
  useEffect(() => {
    if (!lessonMsg?.id || !rt?.sample || !rt.store || busy || auditRun || following) return;
    const m = lessonMsg.audit;
    if (m && !(m.verdict === "partly" && (m.v ?? 1) < 2)) return;
    if (autoAudited.current.has(lessonMsg.id)) return;
    autoAudited.current.add(lessonMsg.id);
    void runAudit();
  }, [lessonMsg?.id, lessonMsg?.audit, rt, busy, auditRun, following, runAudit]);
  const auditBar =
    lessonMsg && module && lessonIdx !== undefined && lessonIdx >= 0 ? (
      <AuditBar mark={lessonMsg.audit} running={auditRun?.key === `${module.id}__${lessonIdx}`} status={auditRun?.status} onRun={rt?.sample && !busy ? runAudit : undefined} />
    ) : null;

  useEffect(() => {
    const el = scrollRef.current;
    if (el && busy && stick.current) el.scrollTop = el.scrollHeight;
  }, [items, busy]);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [selection?.moduleId, selection?.lesson]);

  const inLesson = !!module && lessonIdx !== undefined;
  // the lesson as a book (src/book/, switched in the Aa settings): the lesson's answers laid out on pages
  const reading = useReading();
  // the module quiz is a form (QuizForm.tsx), easier in the scrolling column: the book is for lessons
  const bookOn = reading.book === "on" && inLesson && !isQuiz && items.some((it) => it.kind === "assistant");
  const bookRoot = useRef<HTMLDivElement>(null);
  const bridge = useMemo(() => new BookBridge(), []);
  useDayClock(rt, module && lesson && lessonIdx !== undefined ? { moduleId: module.id, lesson: lessonIdx, title: lesson.title } : null);
  const prefetch = usePrefetchDriver({
    rt,
    index,
    mods: modsRef,
    notes: notesRef,
    selection,
    fallback: lastSelection,
    memory,
    memoryBusy,
    busy,
    effort,
    done: doneList,
    saveModule,
    onNote: (m, idx) => (kind, text, addTo) => (addTo ? appendToNote(addTo, text) : addNote(kind, text, "tutor", m, idx)),
  });
  useSettlePrefetched({
    rt,
    convId,
    messages,
    busy,
    module,
    idx: lessonIdx,
    prog,
    memory,
    finish: finishLesson,
    onMemory: async (next) => {
      setMemory(next);
      await rt?.store?.setMemory(next);
    },
    setMemoryBusy,
  });
  const closeDay = (variant: "home" | "lesson") =>
    index && <CloseDay rt={rt} mods={mods} stop={stopOf(selection ?? lastSelection(), index.modules, mods)} ahead={prefetch.target} onClosed={prefetch.request} variant={variant} />;
  /** the left of the lesson: the contents, or the notebook, or (mostly) neither */
  const [leftDock, setLeftDock] = usePersisted<"" | "toc" | "pad">("core-lab:left", "");
  const tocOpen = leftDock === "toc";
  // the contents panel shares the left side with the source viewer, and gives way to it
  const showToc = inLesson && !viewer;
  const resume = useResumePosition(scrollRef, inLesson && !bookOn ? `${module!.id}:${lessonIdx}` : null, items.length > 0 && !busy, busy);

  const lessonPlace = useMemo(() => (module && lessonIdx !== undefined ? { moduleId: module.id, lesson: lessonIdx, title: lesson?.title ?? module.title } : null), [module, lessonIdx, lesson]);
  const openSource = useCallback((doc: string, page: number) => setViewer({ doc, page }), []);

  /* ---- view ---- */
  const part = module && index ? index.parts.find((p) => p.id === module.part) : undefined;
  const crumbs: Crumb[] = [{ label: "מפת המודולים", onClick: () => setSelection(null) }];
  if (part) crumbs.push({ label: `${part.id} ${part.title}`, onClick: () => (setSidePref("open"), setSideOpen(true)) });
  if (module) crumbs.push({ label: `${module.id} ${module.title}`, onClick: () => setSelection({ moduleId: module.id }) });
  if (lesson) crumbs.push({ label: lesson.title });
  if (isQuiz) crumbs.push({ label: "מבחן מסכם" });
  const nLessons = prog?.lessons?.length ?? 0;
  // the lesson map (LessonGuide.tsx): made once per lesson, right after it is written, or the first time a lesson
  // written before it is opened; tags beside the headings, dots in the contents, a card under the title
  const guideKey = module && lessonIdx !== undefined && lessonIdx >= 0 ? `${module.id}__${lessonIdx}` : "";
  const guide = useLessonGuide({
    rt,
    lessonKey: guideKey,
    // the messages are this lesson's only once its conversation is the one loaded (a moment after switching lessons
    // they are still the previous lesson's)
    ready: hasLesson && !busy && !following && !!convId && convId === wantedConv,
    messages,
    input:
      module && lesson && index && lessonIdx !== undefined
        ? { moduleId: module.id, moduleTitle: module.title, lessonTitle: lesson.title, lessonNo: lessonIdx + 1, lessonCount: nLessons, covers: lesson.covers, modules: index.modules.map((x) => ({ id: x.id, title: x.title })) }
        : null,
  });
  const guideCtx = useMemo<GuideCtxValue>(
    () => ({ guide, lessonKey: guideKey, onOpenModule: (id) => setSelection({ moduleId: id }), titleOf: (id) => index?.modules.find((x) => x.id === id)?.title }),
    [guide, guideKey, setSelection, index],
  );
  const firstLessonItem = items.find((it) => it.kind === "assistant" && it.mode === "lesson")?.key;
  // the module quiz's form: each answer with a ```quiz block gets its draft key, its lock (a later quiz-mode
  // message from the learner, whose text shows the chosen answers) and the composer's send path
  const sendRef = useRef(send);
  sendRef.current = send;
  const quizCtx = useMemo(() => {
    const out = new Map<string, QuizCtx>();
    if (!isQuiz) return out;
    items.forEach((it, i) => {
      if (it.kind !== "assistant" || !it.segments.some((s) => s.t === "text" && s.text.includes("```quiz"))) return;
      const answer = items.slice(i + 1).find((x): x is Extract<typeof x, { kind: "user" }> => x.kind === "user" && x.mode === "quiz");
      out.set(it.key, {
        storeKey: `core-lab:quiz:${convId ?? "new"}:${it.key}`,
        locked: !!answer,
        submitted: answer?.text,
        onSubmit: (text, images) => sendRef.current(text, images, "quiz"),
        busy: busy || following,
        canAttach: !!rt?.canSendImages,
      });
    });
    return out;
  }, [isQuiz, items, convId, busy, following, rt]);
  // once the quiz is a form, the composer is for questions about it: the answers go through the form
  const hasQuizForm = quizCtx.size > 0;
  useEffect(() => {
    if (hasQuizForm) setMode((m) => (m === "quiz" ? "clarify" : m));
  }, [hasQuizForm, isQuiz, lessonIdx, module?.id]);
  const tocVersion = useMemo(() => [items, guide], [items, guide]);
  const counter = lesson ? `שיעור ${(lessonIdx ?? 0) + 1}/${nLessons}` : isQuiz ? "מבחן" : module && nLessons ? `${prog?.done?.length ?? 0}/${nLessons} שיעורים` : undefined;
  const fullBar = module?.tier !== "ref";

  const quick: QuickAction[] = [];
  if (lesson && !busy) {
    if (!hasLesson && !messages.some((m) => m.role === "assistant" && m.mode === "lesson"))
      quick.push({ label: `כתוב את שיעור ${(lessonIdx ?? 0) + 1}`, text: `כתוב את שיעור ${(lessonIdx ?? 0) + 1} במודול ${module!.id}: ${lesson.title}.`, mode: "lesson", primary: true });
    else if (hasLesson)
      quick.push(
        { label: "הסבר שוב, לאט יותר", text: "החלק האחרון היה מהיר מדי בשבילי. הסבר אותו שוב, לאט יותר ומלמטה למעלה, עם עוד דוגמה מספרית פשוטה.", mode: "clarify" },
        { label: "עוד תרגילים", text: "תן לי עוד תרגילים על השיעור: חישובי מהנדס והערכות אנליסט, מדורגים מקל לקשה, עם פתרונות מלאים שאומתו בחישוב.", mode: "clarify" },
        { label: "למאמר ולראיון", text: "מה מהשיעור הזה שווה מאמר או ראיון? הצע זוויות למאמר ושאלות לראיון עם מומחה, ושמור את הטובות במחברת השיעור.", mode: "clarify" },
        { label: "מקרה בוחן נוסף", text: "הוסף מקרה בוחן מעמיק נוסף לשיעור, אירוע מבצעי או מערכת שעוד לא הופיעו, עם מודל ומספרים מחושבים.", mode: "clarify" },
      );
  }
  if (isQuiz && !busy && !messages.length) quick.push({ label: "התחל את המבחן", text: `התחל את המבחן המסכם של מודול ${module?.id}.`, mode: "quiz", primary: true });

  const status = !rt ? "connecting" : rt.sample ? "live" : "off";
  const sideVisible = narrow() || bookOn ? sideOpen : sidePref === "open";
  const nextLesson = lessonIdx !== undefined && lessonIdx >= 0 && lessonIdx + 1 < nLessons ? lessonIdx + 1 : lessonIdx !== undefined && lessonIdx >= 0 && lessonIdx + 1 === nLessons ? -1 : null;
  const mdCtx = useMemo(() => ({ live: false, idPrefix: "page", openSource }), [openSource]);

  return (
    <div className={`app ${(bookOn ? !sideOpen : sidePref === "closed") ? "side-collapsed" : ""} ${bookOn ? "is-book" : ""} ${viewer ? "viewer-open" : ""} ${showToc && tocOpen ? "has-toc" : ""}`}>
      <Topbar
        tabs={<LabTabsNav tab={tab} onTab={setTab} unread={newsUnread} />}
        crumbs={tab === "study" ? crumbs : []}
        counter={tab === "study" ? counter : undefined}
        status={status}
        sideOpen={sideVisible}
        viewerOpen={!!viewer}
        memoryBusy={memoryBusy}
        onToggleSide={() => (narrow() || bookOn ? setSideOpen(!sideOpen) : setSidePref(sidePref === "open" ? "closed" : "open"))}
        onToggleViewer={
          viewer || module
            ? () => {
                if (viewer) setViewer(null);
                else if (module) {
                  const s = lesson?.sources[0] ?? module.sources[0];
                  if (s) setViewer({ doc: s.doc, page: s.pages[0] });
                }
              }
            : undefined
        }
        onMemory={() => setMemoryOpen(true)}
        onNotes={() => setNotesOpen(true)}
        notesCount={module && lessonIdx !== undefined ? notes.filter((n) => n.moduleId === module.id && n.lesson === lessonIdx).length : notes.length}
      />
      <div className="body" style={tab === "study" ? undefined : { display: "none" }}>
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

        {inLesson && (
          <ConsultLayer
            key={bookOn ? "book" : "scroll"}
            rt={rt}
            scrollRef={bookOn ? bookRoot : scrollRef}
            lessonKey={`${module!.id}__${lessonIdx}`}
            place={lessonPlace!}
            lessonTitle={`${module!.id} · ${lesson?.title ?? module!.title}`}
            memory={memory}
            version={items}
            onOpenSource={openSource}
            book={bookOn ? bridge : null}
          />
        )}
        <GuideCtx.Provider value={guideCtx}>
        <main className="main">
          <LessonPlaceCtx.Provider value={lessonPlace}>
          {bookOn && module && lessonIdx !== undefined ? (
            <BookView
              key={`${module.id}:${lessonIdx}`}
              items={items}
              liveKey={((busy && !!live) || !!pfLive) && items[items.length - 1]?.kind === "assistant" ? items[items.length - 1].key : null}
              header={lesson ? { code: `${module.id} · ${(lessonIdx ?? 0) + 1}/${nLessons}`, title: lesson.title, sub: module.title } : undefined}
              posKey={`${module.id}:${lessonIdx}`}
              onOpenSource={openSource}
              onContinue={!busy && !following ? resumeLast : undefined}
              notes={lesson ? notes.filter((n) => n.margin && n.moduleId === module.id && n.lesson === lessonIdx) : undefined}
              onNoteSave={updateNote}
              onNoteDelete={deleteNote}
              onAddNote={
                lessonIdx >= 0
                  ? (anchor) => {
                      if (!anchor) return notify({ level: "warn", text: "סמן מילים בעמוד, או דפדף לעמוד עם פסקה, ואז שלוף פתק." });
                      addNote("note", "", "learner", module, lessonIdx, anchor);
                    }
                  : undefined
              }
              bridge={bridge}
              rootRef={bookRoot}
              wait={(live ?? pfLive)?.mode === "lesson" ? <WaitPanel rt={rt} live={(live ?? pfLive)!} spec={lesson} lessonKey={`${module.id}:${lessonIdx}`} moduleTitle={module.title} /> : undefined}
              end={
                hasLesson && !busy ? (
                  <>
                    {nextLesson !== null && (
                      <div className="next-row">
                        <button className="btn primary" onClick={() => setSelection({ moduleId: module.id, lesson: nextLesson })}>
                          {nextLesson === -1 ? "למבחן המסכם של המודול" : `לשיעור ${nextLesson + 1}: ${prog?.lessons?.[nextLesson]?.title}`}
                          <Icon name="next" size={16} />
                        </button>
                      </div>
                    )}
                    {closeDay("lesson")}
                  </>
                ) : undefined
              }
              notebook={
                lessonIdx >= 0
                  ? (close) => <Scratchpad rt={rt} scrollRef={bookRoot} lessonKey={`${module.id}__${lessonIdx}`} lessonTitle={`${module.id} · ${lesson?.title ?? module.title}`} onClose={close} />
                  : undefined
              }
              writing={busy || following}
              onStop={busy || following ? () => (following ? stopPrefetch() : ctl.current?.abort()) : undefined}
              notices={
                notices.length || auditBar ? (
                  <>
                    {auditBar && cloneElement(auditBar, { fade: true })}
                    {notices.map((n, i) => (
                      <div key={i} className={`banner banner-${n.level} has-x`}>
                        {n.text}
                        <button className="banner-x" aria-label="סגור" onClick={() => dismiss(n)}>×</button>
                      </div>
                    ))}
                  </>
                ) : undefined
              }
              thread={(() => {
                // the chat after the lesson (questions and answers), shown on the facing page above the composer
                const at = items.findIndex((x) => x.kind === "user" && x.mode !== "lesson" && items.slice(0, items.indexOf(x)).some((y) => y.kind === "assistant"));
                if (at < 0) return undefined;
                return (
                  <MdContext.Provider value={mdCtx}>
                    {items.slice(at).map((it, k) =>
                      it.kind === "user" ? (
                        <UserBubble key={it.key} item={it} />
                      ) : (
                        <AssistantTurn
                          key={it.key}
                          item={it}
                          live={busy && !!live && at + k === items.length - 1}
                          fullBar={fullBar}
                          onOpenSource={openSource}
                          onFillGaps={() => {}}
                          onContinue={at + k === items.length - 1 && !busy && !following ? resumeLast : undefined}
                        />
                      ),
                    )}
                  </MdContext.Provider>
                );
              })()}
              composer={
                <Composer
                  busy={busy || following}
                  onSend={(t, im) => {
                    const q = quick.find((x) => x.text === t);
                    send(t, im, q ? q.mode : mode);
                  }}
                  onStop={() => (following ? stopPrefetch() : ctl.current?.abort())}
                  quick={quick}
                  modes={isQuiz ? ["quiz", "clarify"] : ["clarify", "free"]}
                  mode={mode}
                  setMode={setMode}
                  effort={effort}
                  setEffort={setEffort}
                  canAttach={!!rt?.canSendImages}
                  disabled={!rt?.sample}
                />
              }
            />
          ) : (
          <>
          <ReadingProgress scrollRef={scrollRef} />
          {inLesson && items.length > 0 && <SectionDots scrollRef={scrollRef} version={items} />}
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

              {!module && index && <Overview index={index} done={done} mods={mods} onSelect={setSelection} morning={<MorningCard rt={rt} modules={index.modules} mods={mods} onGo={setSelection} onReview={() => setTab("review")} />} />}
              {!module && closeDay("home")}

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
                      {lesson && !wantedConv && !convId && rt?.store && !following && (
                        <ShelfOffer
                          store={rt.store}
                          m={module}
                          idx={lessonIdx}
                          spec={lesson}
                          disabled={busy}
                          onAdopt={async (cid, msgs) => {
                            setConvId(cid);
                            setMessages(msgs);
                            await saveModule(module.id, { convs: { ...(modsRef.current[module.id]?.convs ?? {}), [String(lessonIdx)]: cid } });
                          }}
                        />
                      )}
                      {lesson && <LessonIntro m={module} idx={lessonIdx} lesson={lesson} total={nLessons} />}
                      {isQuiz && <QuizIntro m={module} prog={prog} />}
                      {!lesson && !isQuiz && <div className="block-pending">השיעור הזה עוד לא תוכנן.</div>}
                    </MdContext.Provider>
                  )}
                  {items.length > 0 && auditBar}
                  {items.map((it, i) =>
                    it.kind === "user" ? (
                      <UserBubble key={it.key} item={it} />
                    ) : (
                      <AssistantTurn
                        key={it.key}
                        item={it}
                        live={((busy && !!live) || !!pfLive) && i === items.length - 1}
                        header={lesson ? { code: `${module.id} · ${(lessonIdx ?? 0) + 1}/${nLessons}`, title: lesson.title, sub: module.title } : undefined}
                        fullBar={fullBar}
                        onOpenSource={openSource}
                        onFillGaps={(missing) =>
                          send(`בשיעור חסרו לפי בדיקת הרף: ${missing.join(", ")}. השלם עכשיו את מה שחסר ברמה המלאה, בהמשך ישיר לשיעור ובלי לחזור על מה שכבר נכתב.`, [], "clarify")
                        }
                        onContinue={i === items.length - 1 && !busy && !following ? resumeLast : undefined}
                        notes={lesson ? notes.filter((n) => n.margin && n.moduleId === module.id && n.lesson === lessonIdx) : undefined}
                        onNoteSave={updateNote}
                        onNoteDelete={deleteNote}
                        guideCard={it.key === firstLessonItem}
                        quiz={quizCtx.get(it.key)}
                      />
                    ),
                  )}
                  {(live ?? pfLive)?.mode === "lesson" && (
                    <WaitPanel rt={rt} live={(live ?? pfLive)!} spec={lesson} lessonKey={`${module.id}:${lessonIdx}`} moduleTitle={module.title} />
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
              {hasLesson && !busy && closeDay("lesson")}
              {notices.map((n, i) => (
                <div key={i} className={`banner banner-${n.level} has-x`}>
                  {n.text}
                  <button className="banner-x" aria-label="סגור" onClick={() => dismiss(n)}>×</button>
                </div>
              ))}
            </div>
            {inLesson && items.length > 0 && (
              <BreakLine
                scrollRef={scrollRef}
                busy={busy || following}
                nextTitle={nextLesson !== null && nextLesson >= 0 ? `שיעור ${nextLesson + 1}, «${prog?.lessons?.[nextLesson]?.title ?? ""}»` : undefined}
                onBreak={prefetch.request}
                prefetching={pf.running ? `שיעור ${Number(pf.key.split(":")[1]) + 1}` : undefined}
              />
            )}
            {inLesson && items.length > 0 && (
              <ReadingDock
                scrollRef={scrollRef}
                version={tocVersion}
                onPad={
                  module && lessonIdx !== undefined && lessonIdx >= 0
                    ? () => {
                        const anchor = noteAnchorHere(scrollRef.current);
                        if (!anchor) return notify({ level: "warn", text: "גלול לפסקה בשיעור, או סמן בה מילים, ואז שלוף פתק." });
                        addNote("note", "", "learner", module, lessonIdx, anchor);
                      }
                    : undefined
                }
                onNotebook={showToc ? () => setLeftDock("pad") : undefined}
              />
            )}
          </div>
          {module && lessonIdx !== undefined && (lesson || isQuiz) && (
            <Composer
              busy={busy || following}
              onSend={(t, im) => {
                const q = quick.find((x) => x.text === t);
                send(t, im, q ? q.mode : mode);
              }}
              onStop={() => (following ? stopPrefetch() : ctl.current?.abort())}
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
          </>
          )}
          </LessonPlaceCtx.Provider>
        </main>
        </GuideCtx.Provider>

        {showToc &&
          !bookOn &&
          (leftDock === "toc" ? (
            <LessonToc scrollRef={scrollRef} version={tocVersion} open setOpen={(o) => !o && setLeftDock("")} />
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

        {viewer && <SourceViewer doc={viewer.doc} page={viewer.page} onPage={(p) => setViewer({ ...viewer, page: p })} onClose={() => setViewer(null)} />}
      </div>
      {tab !== "study" && (
        <LabTabView tab={tab} lab="core" rt={rt} index={index} done={done} current={selection?.moduleId ?? null} onOpenModule={(moduleId) => (setTab("study"), setSelection({ moduleId }))} />
      )}

      {notesOpen && (
        <NotesPanel
          notes={notes}
          here={module && lessonIdx !== undefined ? { moduleId: module.id, lesson: lessonIdx } : null}
          hereLabel={module && lessonIdx !== undefined ? `${module.id} · ${isQuiz ? "מבחן מסכם" : `שיעור ${lessonIdx + 1}: ${lesson?.title ?? ""}`}` : ""}
          canWrite={!!rt}
          onAdd={(kind, text) => module && lessonIdx !== undefined && addNote(kind, text, "learner", module, lessonIdx)}
          onUpdate={updateNote}
          onDelete={deleteNote}
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
          store={rt?.store}
          onClose={() => setMemoryOpen(false)}
          onOpenLesson={(moduleId, l) => (setMemoryOpen(false), setSelection({ moduleId, lesson: l }))}
          onSave={async (text, reason = "לפני עריכה ידנית") => {
            const prev = memory;
            setMemory(text);
            try {
              if (rt?.store) await saveMemoryVersion(rt.store, (await rt.store.getMemory().catch(() => null)) ?? prev, text, reason);
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

function Overview({ index, done, mods, onSelect, morning }: { index: LibraryIndex; done: Set<string>; mods: Record<string, ModuleProgress>; onSelect: (s: Selection) => void; morning?: ReactNode }) {
  const open = index.modules.filter((m) => moduleState(m, done) === "open");
  const started = open.filter((m) => mods[m.id]?.lessons?.length);
  const fresh = open.filter((m) => !mods[m.id]?.lessons?.length && m.tier === "core");
  const pick = [...started, ...fresh].slice(0, 8);
  return (
    <div className="overview vivid-home">
      <HomeHero code="LANCHESTER · CORE LAB" title="לנצ'סטר" sub="הליבה הטכנית: מכ״ם, ל״א, EO/IR, ניווט, הנחיה, הגנה אווירית, פלטפורמות. מודול אחר מודול, מתוך הספרייה." index={index} done={done} mods={mods} onSelect={onSelect} />
      {morning}
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
                  ) : m.sources.length ? (
                    <span>{m.sources.filter((x) => x.role !== "ref").reduce((s, x) => s + x.pages[1] - x.pages[0] + 1, 0)} עמ'</span>
                  ) : (
                    <span>{m.items?.length ?? 0} נושאים</span>
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
  const ROLE = { main: "מקור ראשי", supp: "השלמה", article: "מאמר", ref: "עזר לניתוח" };
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
      <ModuleTopics m={m} />
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
                  <span className="lesson-covers">חישובי מהנדס והערכות אנליסט על כל המודול</span>
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
      <ReadingList m={m} />
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
      {lesson.sources.length > 0 && <h2 className="section-title">עמודי המקור</h2>}
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
      <p>שש עד שמונה שאלות על כל המודול: חצי חישובי מהנדס עם מספרים אמיתיים, וחצי שאלות של אנליסט על מערכות בשטח. עונים בהודעה אחת, והמורה בודק כל תשובה ונותן ציון.</p>
      {d < n && <p className="muted">נלמדו {d} מתוך {n} שיעורים. אפשר לגשת למבחן גם עכשיו, אבל הוא מכסה את כל המודול.</p>}
    </div>
  );
}

