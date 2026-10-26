import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { connect, type Runtime } from "../runtime";
import { loadIndex, type LibraryIndex } from "../library";
import type { LessonNote, ModuleProgress, NoteKind } from "../types";
import { NOTE_KIND_LABEL } from "../types";
import { toggleTheme, useTheme } from "../theme";
import { Icon } from "../components/Icon";
import type { Block, BoxKind, Summary, SummaryMeta, SummaryStatus } from "./model";
import { BOX_LABEL, STATUS_LABEL, emptyBlock, esc, seedBlocks, toMarkdown, wordCount } from "./model";
import { Editor, alertBox, type Change } from "./Editor";
import { FigurePicker } from "./FigurePicker";
import { FilterView, ReviewView, type FilterKind } from "./View";
import { ModuleNotes, NotebookView, TutorPanel } from "./Panels";
import { saveFile, toDocx, toHtml } from "./exporters";

type Bg = "lines" | "grid" | "plain";
interface Prefs {
  module: string | null;
  bg: Bg;
  follow: boolean;
  tree: boolean;
  /** the page's zoom, 0.7–1.8 */
  zoom: number;
}
type View = "edit" | "review" | { filter: FilterKind };

/** The channel on which the lessons window says which lesson is open. */
export const lessonChannel = (lab: string) => `${lab}-lesson`;

function usePrefs(lab: string) {
  const key = `${lab}:summaries`;
  const [p, setP] = useState<Prefs>(() => {
    try {
      return { module: null, bg: "lines", follow: true, tree: true, zoom: 1, ...JSON.parse(localStorage.getItem(key) ?? "{}") };
    } catch {
      return { module: null, bg: "lines", follow: true, tree: true, zoom: 1 };
    }
  });
  const set = (patch: Partial<Prefs>) =>
    setP((old) => {
      const next = { ...old, ...patch };
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // for this visit only
      }
      return next;
    });
  return [p, set] as const;
}

/**
 * The summaries notebook of one lab, opened with #summary after the lab's address, in its
 * own window (on the second screen). One summary per module; it saves itself as you write.
 */
export function SummaryApp({ lab, name }: { lab: string; name: string }) {
  const [rt, setRt] = useState<Runtime | null>(null);
  const [index, setIndex] = useState<LibraryIndex | null>(null);
  const [err, setErr] = useState("");
  const [meta, setMeta] = useState<Record<string, SummaryMeta>>({});
  const [progress, setProgress] = useState<Record<string, ModuleProgress>>({});
  const [memory, setMemory] = useState("");
  const [notes, setNotes] = useState<LessonNote[]>([]);
  const [prefs, setPrefs] = usePrefs(lab);
  const [tab, setTab] = useState<"sum" | "notebook">("sum");
  const [view, setView] = useState<View>("edit");
  const [aux, setAux] = useState<null | "tutor" | "notes">(null);
  const [doc, setDoc] = useState<Summary | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "local" | "error">("idle");
  const [current, setCurrent] = useState<string | null>(null);
  const [pickAfter, setPickAfter] = useState<string | null | undefined>(undefined);
  const [all, setAll] = useState<Summary[] | null>(null);
  const [q, setQ] = useState("");
  const { dark } = useTheme();
  const undo = useRef<Block[][]>([]);
  const redo = useRef<Block[][]>([]);
  const lastPush = useRef(0);
  const dirty = useRef(false);
  const pendingScroll = useRef<number | null>(null);
  const docRef = useRef(doc);
  docRef.current = doc;
  const [, bump] = useState(0);

  /* ---- connect and load ---- */
  useEffect(() => {
    document.title = `${name} · סיכומים`;
    let offs: (() => void)[] = [];
    (async () => {
      try {
        const [r, ix] = await Promise.all([connect(), loadIndex()]);
        setRt(r);
        setIndex(ix);
        if (r.store) {
          offs = [
            r.store.watchSummaryMeta(setMeta),
            r.store.watchModules(setProgress),
            r.store.watchProfile((p) => setMemory(p.memory)),
            r.store.watchNotes(setNotes),
          ];
        }
      } catch (e) {
        setErr((e as Error).message);
      }
    })();
    return () => offs.forEach((f) => f());
  }, [name]);

  const titles = useMemo(() => Object.fromEntries((index?.modules ?? []).map((m) => [m.id, m.title])), [index]);
  const module = index?.modules.find((m) => m.id === prefs.module) ?? null;
  const store = rt?.store ?? null;
  const localKey = (id: string) => `${lab}:summary:${id}`;

  /* ---- saving: a second after the last change, and when leaving a module ---- */
  const persist = useCallback(
    async (d: Summary) => {
      dirty.current = false;
      const words = wordCount(d.blocks);
      const status: SummaryStatus = d.status === "none" && words > 0 ? "draft" : d.status;
      const sum = { ...d, status, updatedAt: Date.now() };
      if (status !== d.status) setDoc((x) => (x && x.moduleId === d.moduleId ? { ...x, status } : x));
      setSaveState("saving");
      try {
        if (store) {
          await store.saveSummary(sum, { status, updatedAt: sum.updatedAt, words });
          setSaveState("saved");
        } else {
          localStorage.setItem(localKey(d.moduleId), JSON.stringify(sum));
          setMeta((m) => ({ ...m, [d.moduleId]: { status, updatedAt: sum.updatedAt, words } }));
          setSaveState("local");
        }
      } catch {
        dirty.current = true;
        setSaveState("error");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store, lab],
  );
  useEffect(() => {
    if (!doc || !dirty.current) return;
    const t = setTimeout(() => void persist(doc), 1100);
    return () => clearTimeout(t);
  }, [doc, persist]);
  useEffect(() => {
    const flush = () => {
      if (dirty.current && docRef.current) void persist(docRef.current);
    };
    window.addEventListener("beforeunload", flush);
    document.addEventListener("visibilitychange", flush);
    return () => {
      window.removeEventListener("beforeunload", flush);
      document.removeEventListener("visibilitychange", flush);
    };
  }, [persist]);

  /* ---- opening a module ---- */
  const open = useCallback(
    async (id: string, lesson?: number) => {
      if (dirty.current && docRef.current) await persist(docRef.current);
      setPrefs({ module: id });
      setView("edit");
      setTab("sum");
      pendingScroll.current = lesson ?? null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [persist],
  );
  useEffect(() => {
    if (!module || !rt) return;
    let live = true;
    (async () => {
      let s: Summary | null = null;
      try {
        s = store ? await store.loadSummary(module.id) : JSON.parse(localStorage.getItem(localKey(module.id)) ?? "null");
      } catch {
        s = null;
      }
      if (!live) return;
      const lessons = (progress[module.id]?.lessons ?? []).map((l, i) => `שיעור ${i + 1}: ${l.title}`);
      setDoc(s && Array.isArray(s.blocks) && s.blocks.length ? s : { moduleId: module.id, blocks: seedBlocks(`${module.id} · ${module.title}`, lessons), status: "none", updatedAt: 0 });
      undo.current = [];
      redo.current = [];
      setCurrent(null);
    })();
    return () => {
      live = false;
    };
    // progress is read once, when the module opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module?.id, rt, store]);
  // after opening from the lessons window: the section of that lesson
  useEffect(() => {
    const n = pendingScroll.current;
    if (n == null || !doc) return;
    pendingScroll.current = null;
    const heads = doc.blocks.filter((b) => b.t === "h" && b.level === 1 && !b.plain);
    const h = heads[n];
    if (h) requestAnimationFrame(() => document.querySelector(`[data-bid="${h.id}"]`)?.scrollIntoView({ block: "start", behavior: "smooth" }));
  }, [doc]);

  /* ---- following the lessons window (only when the lesson there changes) ---- */
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const ch = new BroadcastChannel(lessonChannel(lab));
    ch.onmessage = (e) => {
      const d = e.data as { moduleId?: string; lesson?: number };
      if (!prefs.follow || !d?.moduleId) return;
      if (d.moduleId !== prefs.module) void open(d.moduleId, d.lesson);
      else if (typeof d.lesson === "number") {
        pendingScroll.current = d.lesson;
        bump((x) => x + 1);
        setDoc((x) => (x ? { ...x } : x));
      }
    };
    return () => ch.close();
  }, [lab, prefs.follow, prefs.module, open]);

  /* ---- editing with undo ---- */
  const update = useCallback((fn: (bs: Block[]) => Block[], kind: Change) => {
    setDoc((d) => {
      if (!d) return d;
      const next = fn(d.blocks);
      if (next === d.blocks) return d;
      const now = Date.now();
      if (kind === "struct" || now - lastPush.current > 1500) {
        undo.current.push(d.blocks);
        if (undo.current.length > 200) undo.current.shift();
        redo.current = [];
        lastPush.current = now;
      }
      dirty.current = true;
      return { ...d, blocks: next };
    });
  }, []);
  const doUndo = () =>
    setDoc((d) => {
      const prev = undo.current.pop();
      if (!d || !prev) return d;
      redo.current.push(d.blocks);
      dirty.current = true;
      return { ...d, blocks: prev };
    });
  const doRedo = () =>
    setDoc((d) => {
      const next = redo.current.pop();
      if (!d || !next) return d;
      undo.current.push(d.blocks);
      dirty.current = true;
      return { ...d, blocks: next };
    });
  const setStatus = (status: SummaryStatus) => {
    dirty.current = true;
    setDoc((d) => (d ? { ...d, status } : d));
  };

  /* ---- notebook ---- */
  const addNote = (kind: NoteKind, text: string) => {
    const n: LessonNote = { who: "learner", kind, text, moduleId: prefs.module ?? "כללי", lesson: -2, ts: Date.now() };
    if (store) store.addNote(n).catch(() => alertBox("הפריט לא נשמר."));
    else setNotes((all) => [{ ...n, id: `local-${Date.now()}` }, ...all]);
  };
  const updateNote = (id: string, patch: Partial<LessonNote>) => {
    if (!store || id.startsWith("local-")) setNotes((all) => all.map((n) => (n.id === id ? { ...n, ...patch } : n)));
    else store.updateNote(id, patch).catch(() => alertBox("העדכון לא נשמר."));
  };
  const deleteNote = (id: string) => {
    if (!store || id.startsWith("local-")) setNotes((all) => all.filter((n) => n.id !== id));
    else store.deleteNote(id).catch(() => alertBox("המחיקה לא נשמרה."));
  };
  const insertNote = (n: LessonNote) => {
    const [head, ...rest] = n.text.split("\n");
    const after = current ?? doc?.blocks[doc.blocks.length - 1]?.id ?? null;
    const blocks: Block[] = [{ ...(emptyBlock("p") as Extract<Block, { t: "p" }>), html: `<b>${esc(NOTE_KIND_LABEL[n.kind])}:</b> ${esc(head)}` }];
    const pts = rest.filter((l) => l.trim());
    if (pts.length) blocks.push({ ...(emptyBlock("list") as Extract<Block, { t: "list" }>), items: pts.map((l) => ({ html: esc(l.replace(/^\s*[-•]\s*/, "")), level: 0 })) });
    update((bs) => {
      const i = after ? bs.findIndex((b) => b.id === after) : bs.length - 1;
      return [...bs.slice(0, i + 1), ...blocks, ...bs.slice(i + 1)];
    }, "struct");
  };

  /* ---- review across all summaries ---- */
  const showFilter = async (k: FilterKind) => {
    if (dirty.current && doc) await persist(doc);
    setView({ filter: k });
    try {
      const list = store ? await store.allSummaries() : Object.keys(localStorage).filter((x) => x.startsWith(`${lab}:summary:`)).map((x) => JSON.parse(localStorage.getItem(x)!) as Summary);
      setAll(list.map((s) => (s.moduleId === doc?.moduleId ? doc! : s)));
    } catch {
      setAll([]);
    }
  };

  /* ---- export ---- */
  const exportAs = async (kind: "docx" | "html") => {
    if (!doc || !module) return;
    const title = `${module.id} ${module.title}`;
    try {
      const data = kind === "docx" ? await toDocx(title, doc.blocks) : await toHtml(title, doc.blocks);
      const r = await saveFile(`${module.id} סיכום.${kind}`, data);
      if (r?.status && r.status !== "saved" && r.status !== "ok") alertBox("ההורדה בוטלה.");
    } catch (e) {
      alertBox(`הייצוא נכשל: ${(e as Error).message}`);
    }
  };

  /* ---------------- rendering ---------------- */
  const parts = index?.parts ?? [];
  const filterText = q.trim();
  const tree = (
    <nav className="sm-tree" aria-label="מודולים">
      <input className="sm-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="חיפוש מודול" />
      {parts.map((p) => {
        const mods = (index?.modules ?? []).filter((m) => m.part === p.id && (!filterText || m.id.includes(filterText) || m.title.includes(filterText)));
        if (!mods.length) return null;
        const inPart = mods.some((m) => m.id === prefs.module);
        return (
          <details key={p.id} open={inPart || !!filterText}>
            <summary>
              <span className="sm-part-id">{p.id}</span> {p.title}
              <span className="sm-part-count">
                {mods.filter((m) => meta[m.id]?.status === "done").length}/{mods.length}
              </span>
            </summary>
            <ul>
              {mods.map((m) => {
                const st = meta[m.id]?.status ?? "none";
                return (
                  <li key={m.id}>
                    <button className={`sm-tree-mod ${m.id === prefs.module ? "is-on" : ""}`} onClick={() => void open(m.id)} title={STATUS_LABEL[st]}>
                      <span className={`sm-dot st-${st}`} />
                      <span className="sm-mod-id">{m.id}</span>
                      <span className="sm-mod-title">{m.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </details>
        );
      })}
    </nav>
  );

  const viewTab = (
    <>
      <div className="sm-group">
        <label className="sm-lbl">
          מצב הסיכום
          <select className="sm-select" value={doc?.status ?? "none"} onChange={(e) => setStatus(e.target.value as SummaryStatus)}>
            {(Object.keys(STATUS_LABEL) as SummaryStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="sm-group">
        <button className="sm-tbtn" aria-pressed={view === "review"} onClick={() => setView(view === "review" ? "edit" : "review")}>
          מצב חזרה (מקופל)
        </button>
        <select className="sm-select" value="" onChange={(e) => e.target.value && void showFilter(e.target.value as FilterKind)} aria-label="הצג רק">
          <option value="">הצג מכל הסיכומים רק…</option>
          <option value="math">כל המשוואות</option>
          {(Object.keys(BOX_LABEL) as BoxKind[]).map((k) => (
            <option key={k} value={k}>
              {BOX_LABEL[k]}
            </option>
          ))}
        </select>
      </div>
      <div className="sm-group">
        <button className="sm-tbtn" onClick={() => void exportAs("docx")}>
          ייצוא ל-Word
        </button>
        <button className="sm-tbtn" onClick={() => void exportAs("html")}>
          ייצוא ל-HTML
        </button>
      </div>
      <div className="sm-group">
        <label className="sm-lbl">
          רקע הדף
          <select className="sm-select" value={prefs.bg} onChange={(e) => setPrefs({ bg: e.target.value as Bg })}>
            <option value="lines">שורות, כמו מחברת</option>
            <option value="grid">משבצות</option>
            <option value="plain">חלק</option>
          </select>
        </label>
      </div>
    </>
  );

  const saveLabel = { idle: "", saving: "שומר…", saved: "נשמר", local: "נשמר בדפדפן בלבד", error: "לא נשמר, אנסה שוב" }[saveState];

  return (
    <div className={`sm-app bg-${prefs.bg}`}>
      <header className="sm-top">
        <button className="icon-btn" onClick={() => setPrefs({ tree: !prefs.tree })} aria-pressed={prefs.tree} title="רשימת המודולים" aria-label="רשימת המודולים">
          <Icon name="menu" />
        </button>
        <span className="brand">{name}</span>
        <span className="sm-top-sub">סיכומים</span>
        <div className="sm-tabs" role="tablist">
          <button role="tab" aria-selected={tab === "sum"} onClick={() => setTab("sum")}>
            הסיכומים
          </button>
          <button role="tab" aria-selected={tab === "notebook"} onClick={() => setTab("notebook")}>
            המחברת ({notes.length})
          </button>
        </div>
        <span className="topbar-spacer" />
        <span className={`sm-save st-${saveState}`}>{saveLabel}</span>
        {tab === "sum" && (
          <span className="sm-zoom" role="group" aria-label="זום">
            <button onClick={() => setPrefs({ zoom: Math.max(0.7, Math.round((prefs.zoom - 0.1) * 10) / 10) })} aria-label="הקטן" title="הקטן">
              −
            </button>
            <span>{Math.round(prefs.zoom * 100)}%</span>
            <button onClick={() => setPrefs({ zoom: Math.min(1.8, Math.round((prefs.zoom + 0.1) * 10) / 10) })} aria-label="הגדל" title="הגדל">
              +
            </button>
          </span>
        )}
        <label className="sm-follow" title="כשעוברים שיעור בחלון השיעורים, הסיכום עובר לאותו מודול ולסעיף של השיעור. הגלילה כאן נשארת חופשית.">
          <input type="checkbox" checked={prefs.follow} onChange={(e) => setPrefs({ follow: e.target.checked })} /> עוקב אחרי השיעור
        </label>
        {tab === "sum" && module && (
          <>
            <button className="icon-btn" aria-pressed={aux === "tutor"} onClick={() => setAux(aux === "tutor" ? null : "tutor")} title="המורה: בדיקה ושאלות חזרה" aria-label="המורה">
              <Icon name="think" />
            </button>
            <button className="icon-btn" aria-pressed={aux === "notes"} onClick={() => setAux(aux === "notes" ? null : "notes")} title="מחברת השיעור של המודול" aria-label="מחברת המודול">
              <Icon name="exercise" />
            </button>
          </>
        )}
        <button className="icon-btn" onClick={toggleTheme} aria-label={dark ? "מעבר למצב בהיר" : "מעבר למצב כהה"} title={dark ? "מצב בהיר" : "מצב כהה"}>
          <Icon name={dark ? "sun" : "moon"} />
        </button>
        <a className="sm-back" href="#" onClick={() => (dirty.current && doc ? void persist(doc) : undefined)}>
          לשיעורים
        </a>
      </header>

      {err && <div className="banner banner-error">{err}</div>}
      {rt && !rt.store && <div className="banner banner-warn">אין כאן שמירה בשרת: הסיכומים נשמרים בדפדפן הזה בלבד. פתח את הדף ב-claude.ai כשאתה מחובר.</div>}

      {tab === "notebook" ? (
        <main className="sm-main sm-main-notebook">
          <NotebookView notes={notes} titles={titles} currentModule={prefs.module} onAdd={addNote} onUpdate={updateNote} onDelete={deleteNote} />
        </main>
      ) : (
        <div className={`sm-body ${prefs.tree ? "" : "no-tree"} ${aux ? "has-aux" : ""}`}>
          {prefs.tree && tree}
          <main className="sm-main">
            {!index && <div className="block-pending">טוען את רשימת המודולים…</div>}
            {index && !module && (
              <div className="sm-empty">
                <h2>בחר מודול מהרשימה</h2>
                <p>לכל מודול יש סיכום אחד, עם סעיף לכל שיעור. הוא נשמר לבד תוך כדי כתיבה.</p>
                <ul>
                  <li>
                    <b>/</b> בתחילת שורה פותח את תפריט ההוספה; <b>#</b> ורווח לכותרת, <b>-</b> ורווח לרשימה, <b>1.</b> ורווח לרשימה ממוספרת, <b>$$</b> למשוואה.
                  </li>
                  <li>
                    <b>Alt+1…4</b> מרקרים: חשוב, טעות, הגדרה, תובנה. <b>Ctrl+B</b> מודגש.
                  </li>
                  <li>תמונה: Ctrl+V מצילום מסך, או גרירה לדף.</li>
                </ul>
              </div>
            )}
            {module && doc && doc.moduleId === module.id && (
              <>
                {view === "edit" && (
                  <Editor
                    blocks={doc.blocks}
                    update={update}
                    current={current}
                    setCurrent={setCurrent}
                    onUndo={doUndo}
                    onRedo={doRedo}
                    canUndo={undo.current.length > 0}
                    canRedo={redo.current.length > 0}
                    onPickFigure={(after) => setPickAfter(after)}
                    viewTab={viewTab}
                    zoom={prefs.zoom}
                  />
                )}
                {view === "review" && (
                  <>
                    <div className="sm-viewbar">
                      <button className="btn small" onClick={() => setView("edit")}>
                        חזרה לעריכה
                      </button>
                    </div>
                    <div style={{ zoom: prefs.zoom }}>
                      <ReviewView blocks={doc.blocks} />
                    </div>
                  </>
                )}
                {typeof view === "object" && (
                  <>
                    <div className="sm-viewbar">
                      <button className="btn small" onClick={() => setView("edit")}>
                        חזרה לעריכה
                      </button>
                    </div>
                    {all ? <FilterView kind={view.filter} summaries={all} titles={titles} onOpen={(id) => void open(id)} /> : <div className="block-pending">אוסף מכל הסיכומים…</div>}
                  </>
                )}
              </>
            )}
          </main>
          {aux && module && (
            <aside className="sm-aux" aria-label={aux === "tutor" ? "המורה" : "מחברת המודול"}>
              <header>
                <b>{aux === "tutor" ? "המורה" : `מחברת השיעור · ${module.id}`}</b>
                <button className="icon-btn" onClick={() => setAux(null)} aria-label="סגור">
                  <Icon name="close" size={15} />
                </button>
              </header>
              {aux === "tutor" ? (
                <TutorPanel rt={rt} module={module} lessons={progress[module.id]?.lessons} memory={memory} summaryMd={() => toMarkdown(`${module.id} ${module.title}`, docRef.current?.blocks ?? [])} />
              ) : (
                <ModuleNotes notes={notes.filter((n) => n.moduleId === module.id)} onInsert={insertNote} onUpdate={updateNote} onDelete={deleteNote} />
              )}
            </aside>
          )}
        </div>
      )}

      {pickAfter !== undefined && module && (
        <FigurePicker
          docs={module.sources.map((s) => s.doc)}
          onClose={() => setPickAfter(undefined)}
          onPick={(d, key, caption) => {
            const nb = { ...(emptyBlock("fig") as Extract<Block, { t: "fig" }>), doc: d, key, caption: caption.slice(0, 200) };
            update((bs) => {
              const i = pickAfter ? bs.findIndex((b) => b.id === pickAfter) : bs.length - 1;
              return [...bs.slice(0, i + 1), nb, ...bs.slice(i + 1)];
            }, "struct");
            setCurrent(nb.id);
            setPickAfter(undefined);
          }}
        />
      )}
    </div>
  );
}
