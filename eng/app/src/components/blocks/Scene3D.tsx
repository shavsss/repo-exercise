import { useEffect, useMemo, useRef, useState } from "react";
import { SCENE_BY_ID, checkSpec, coarse, mount, specBuilder, specCamera, specTour, type Info, type Spec, type TourStop, type View } from "../../../../../shared/scene3d";
import { useTheme } from "../../theme";
import type { ParamDef } from "../sims/types";
import { Sheet } from "./Sheet";
import { Slider } from "./Sim";
import { Icon } from "../Icon";

interface LibCall {
  id: string;
  title?: string;
  caption?: string;
  params?: Record<string, number>;
  tour?: boolean | TourStop[];
}
type Parsed = { kind: "lib"; call: LibCall } | { kind: "spec"; spec: Spec & { caption?: string; title?: string } };

function parse(source: string): Parsed | null {
  try {
    const j = JSON.parse(source);
    if (j && typeof j.id === "string") return { kind: "lib", call: j };
    if (j && Array.isArray(j.objects)) return { kind: "spec", spec: j };
    return null;
  } catch {
    return null;
  }
}

/** A live 3D scene in a lesson: a checked scene from the shared library, or one the tutor wrote as a spec. */
export function Scene3DBlock({ source, live }: { source: string; live: boolean }) {
  const parsed = useMemo(() => parse(source), [source]);
  if (!parsed) return live ? <div className="block-pending">סצנת תלת-ממד בכתיבה…</div> : <div className="block-error">הגדרת הסצנה אינה JSON תקין</div>;
  if (parsed.kind === "lib" && !SCENE_BY_ID[parsed.call.id]) return <div className="block-error">סצנה לא מוכרת: {parsed.call.id}</div>;
  if (parsed.kind === "spec") {
    try {
      checkSpec(parsed.spec);
    } catch (e) {
      return <div className="block-error">בסצנה של המורה יש שגיאה: {(e as Error).message}</div>;
    }
  }
  return <SceneView key={source} parsed={parsed} />;
}

function SceneView({ parsed }: { parsed: Parsed }) {
  const lib = parsed.kind === "lib" ? SCENE_BY_ID[parsed.call.id] : null;
  const spec = parsed.kind === "spec" ? parsed.spec : null;
  const defs: (ParamDef & { options?: string[] })[] = useMemo(
    () =>
      (lib ? lib.params : (spec?.params ?? [])).map((d) => ({
        id: d.id,
        label: d.label ?? d.id,
        min: Number(d.min),
        max: Number(d.max),
        step: Number(d.step ?? (Number(d.max) - Number(d.min)) / 100),
        value: Number(d.value ?? d.min),
        unit: d.unit,
        ...("options" in d && d.options ? { options: d.options as string[] } : {}),
      })),
    [lib, spec],
  );
  const initial = useMemo(() => {
    const given = parsed.kind === "lib" ? parsed.call.params ?? {} : {};
    return Object.fromEntries(defs.map((d) => [d.id, typeof given[d.id] === "number" ? Math.min(d.max, Math.max(d.min, given[d.id])) : d.value]));
  }, [defs, parsed]);
  const [params, setParams] = useState<Record<string, number>>(initial);
  const title = (parsed.kind === "lib" ? parsed.call.title : spec?.title) || lib?.title || "סצנה";
  const caption = (parsed.kind === "lib" ? parsed.call.caption : spec?.caption) || lib?.caption || "";
  const tour: TourStop[] | undefined = parsed.kind === "lib" ? (Array.isArray(parsed.call.tour) ? parsed.call.tour : parsed.call.tour ? lib?.tour : undefined) : spec ? specTour(spec) : undefined;

  const box = useRef<HTMLDivElement>(null);
  const view = useRef<View | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [error, setError] = useState("");
  const [hud, setHud] = useState("");
  const [info, setInfo] = useState<{ i: Info; x: number; y: number } | null>(null);
  const [showCap, setShowCap] = useState(true);
  const [stop, setStop] = useState(-1);
  const [big, setBig] = useState(false);
  const [locked, setLocked] = useState(coarse);
  const { dark } = useTheme();
  const look = dark ? "dark" : "light";

  // mount when the scene comes near the screen, so three.js loads only for lessons that use it
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let alive = true;
    const io = new IntersectionObserver(
      ([en]) => {
        if (!en.isIntersecting || view.current || state !== "idle") return;
        io.disconnect();
        setState("loading");
        const cam = lib ? { cam: lib.cam, target: lib.target ?? ([0, 0, 0] as [number, number, number]) } : specCamera(spec!);
        mount(el, lib ? lib.build : specBuilder(spec!), {
          ...cam,
          spin: lib?.spin,
          tone: lib?.tone,
          look,
          params,
          onInfo: (i, x, y) => setInfo(i ? { i, x, y } : null),
          onHud: setHud,
        })
          .then((v) => {
            if (!alive) return v.dispose();
            view.current = v;
            setState("ready");
          })
          .catch((e) => {
            if (!alive) return;
            setError((e as Error).message);
            setState("error");
          });
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => {
      alive = false;
      io.disconnect();
      view.current?.dispose();
      view.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => view.current?.setLook(look), [look]);
  useEffect(() => {
    const v = view.current;
    if (!v) return;
    v.setParams(params);
    if (lib?.rebuild) {
      const t = setTimeout(() => v.rebuild(), 120);
      return () => clearTimeout(t);
    }
  }, [params, lib]);
  useEffect(() => {
    if (!big) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setBig(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [big]);
  useEffect(() => {
    if (!coarse) return;
    const el = box.current;
    if (!el) return;
    const mo = new MutationObserver(() => setLocked(el.dataset.locked === "1"));
    mo.observe(el, { attributes: true, attributeFilter: ["data-locked"] });
    return () => mo.disconnect();
  }, []);

  const go = (k: number) => {
    if (!tour?.length) return;
    const i = (k + tour.length) % tour.length;
    setStop(i);
    view.current?.flyTo(tour[i]);
  };

  return (
    <div className={`s3d-wrap ${big ? "is-big" : ""}`} data-block="scene3d">
      {big && <div className="s3d-scrim" onClick={() => setBig(false)} />}
      <Sheet title={title} kind={lib ? "סצנה בדוקה" : "סצנה של המורה"} no={lib?.id}>
        <div className="s3d">
          <div className="s3d-stage" ref={box}>
            {state !== "ready" && <div className="s3d-status">{state === "error" ? `התלת-ממד לא נטען: ${error}` : "טוען את הסצנה…"}</div>}
            {hud && (
              <pre className="s3d-hud" dir="ltr">
                {hud}
              </pre>
            )}
            {info && (
              <div className="s3d-info" role="status" style={{ insetInlineStart: undefined, left: Math.min(info.x + 12, (box.current?.clientWidth ?? 400) - 260), top: Math.min(info.y + 12, (box.current?.clientHeight ?? 300) - 90) }}>
                <b>{info.i.t}</b>
                {info.i.x && <span>{info.i.x}</span>}
              </div>
            )}
            {caption && showCap && (
              <div className="s3d-cap">
                <span>{caption}</span>
                <button className="s3d-x" onClick={() => setShowCap(false)} aria-label="סגור את ההסבר">
                  <Icon name="close" size={13} />
                </button>
              </div>
            )}
            {coarse && locked && state === "ready" && <span className="s3d-tap">הקש כדי לסובב</span>}
            <div className="s3d-tools">
              {!showCap && caption && (
                <button className="s3d-btn" onClick={() => setShowCap(true)} title="הסבר" aria-label="הצג את ההסבר">
                  ?
                </button>
              )}
              <button className="s3d-btn" onClick={() => setBig((b) => !b)} title={big ? "חזרה לשיעור" : "מסך מלא"} aria-label={big ? "חזרה לשיעור" : "מסך מלא"}>
                <Icon name={big ? "close" : "expand"} size={14} />
              </button>
            </div>
          </div>
          {tour?.length ? (
            <div className="s3d-tour">
              <div className="s3d-tour-text">{stop >= 0 ? tour[stop].text : "סיור מודרך: נקודות מבט עם הסבר."}</div>
              <div className="s3d-tour-nav">
                <button className="btn small" onClick={() => go(stop - 1)} disabled={state !== "ready"}>
                  הקודם
                </button>
                <span className="s3d-tour-n" dir="ltr">
                  {stop >= 0 ? `${stop + 1}/${tour.length}` : `0/${tour.length}`}
                </span>
                <button className="btn small primary" onClick={() => go(stop + 1)} disabled={state !== "ready"}>
                  {stop < 0 ? "התחל סיור" : "הבא"}
                </button>
              </div>
            </div>
          ) : null}
          {defs.length > 0 && (
            <div className="params">
              {defs.map((d) => (
                <Slider key={d.id} def={d} value={params[d.id]} onChange={(val) => setParams((q) => ({ ...q, [d.id]: val }))} />
              ))}
            </div>
          )}
          <div className="s3d-hint">גרירה מסובבת · לחיצה על הסצנה ואז גלגלת מקרבת · לחיצה קצרה על חלק מראה מהו</div>
        </div>
      </Sheet>
    </div>
  );
}
