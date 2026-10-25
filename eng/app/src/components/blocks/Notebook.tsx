import { useMemo, useState } from "react";
import { zip } from "../../zip";
import { Frame } from "./Callout";
import { Markdown } from "../Markdown";

interface Cell {
  md?: string;
  code?: string;
}
interface Spec {
  title?: string;
  file?: string;
  goal?: string;
  cells?: Cell[];
}

declare global {
  interface Window {
    __downloads?: { save(r: { filename: string; data: Uint8Array | string }): Promise<{ status: string }> } | null;
  }
}

/** Jupyter notebook JSON (nbformat 4) from the cells. */
function ipynb(spec: Spec) {
  const lines = (s: string) => s.split("\n").map((l, i, a) => (i < a.length - 1 ? l + "\n" : l));
  return JSON.stringify(
    {
      nbformat: 4,
      nbformat_minor: 5,
      metadata: { kernelspec: { name: "python3", display_name: "Python 3", language: "python" }, language_info: { name: "python" } },
      cells: (spec.cells ?? []).map((c, i) =>
        c.code !== undefined
          ? { cell_type: "code", id: `c${i}`, metadata: {}, execution_count: null, outputs: [], source: lines(c.code) }
          : { cell_type: "markdown", id: `c${i}`, metadata: {}, source: lines(c.md ?? "") },
      ),
    },
    null,
    1,
  );
}

/** The practical track: a notebook the learner downloads and runs in Colab or locally. */
export function NotebookBlock({ source, live }: { source: string; live: boolean }) {
  const spec = useMemo<Spec | null>(() => {
    try {
      return JSON.parse(source);
    } catch {
      return null;
    }
  }, [source]);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  if (!spec) return live ? <div className="block-pending">מחברת בכתיבה…</div> : <div className="block-error">הגדרת המחברת אינה JSON תקין</div>;
  const file = (spec.file || "notebook").replace(/[^\w.-]+/g, "-").replace(/\.ipynb$/, "") + ".ipynb";
  const code = (spec.cells ?? []).filter((c) => c.code !== undefined).length;
  const download = async () => {
    const dl = window.__downloads;
    if (!dl) return setMsg("ההורדה לא זמינה בתצוגה הזו. אפשר להעתיק את התאים מהתצוגה המקדימה.");
    try {
      const data = zip([{ name: file, data: ipynb(spec) }]);
      const r = await dl.save({ filename: file.replace(/\.ipynb$/, ".zip"), data });
      setMsg(r.status === "saved" ? `נשמר. בתוך ה-zip נמצא ${file}: פותחים אותו ב-Colab (File → Upload notebook) או ב-Jupyter.` : "");
    } catch (e) {
      const c = (e as { code?: string }).code;
      setMsg(c === "declined" ? "" : c === "rate_limited" ? "חלון שמירה אחר עדיין פתוח. נסה שוב בעוד רגע." : "ההורדה לא הצליחה בתצוגה הזו.");
    }
  };
  return (
    <Frame kind="notebook" label="מסלול מעשי: מחברת" icon="calc" title={spec.title}>
      {spec.goal && <Markdown text={spec.goal} />}
      <div className="nb-row">
        <button className="btn primary small" onClick={download} disabled={live}>
          הורד את המחברת
        </button>
        <span className="muted" dir="ltr">
          {file} · {code} תאי קוד
        </span>
        <button className="link" onClick={() => setOpen((o) => !o)}>
          {open ? "הסתר תצוגה מקדימה" : "תצוגה מקדימה"}
        </button>
      </div>
      {msg && <p className="muted">{msg}</p>}
      {open && (
        <div className="nb-cells">
          {(spec.cells ?? []).map((c, i) =>
            c.code !== undefined ? (
              <pre key={i} className="code-plain nb-code" dir="ltr">
                <span className="code-lang">In [{i + 1}]</span>
                <code>{c.code}</code>
              </pre>
            ) : (
              <div key={i} className="nb-md">
                <Markdown text={c.md ?? ""} />
              </div>
            ),
          )}
        </div>
      )}
    </Frame>
  );
}
