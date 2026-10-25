import { useEffect, useState } from "react";
import { Markdown } from "../Markdown";
import { Frame, parseHeaders } from "./Callout";
import { isSolved, setSolved } from "../../solved";

function hash(s: string) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

export function Exercise({ source }: { source: string }) {
  const { headers, body } = parseHeaders(source);
  const parts = body.split(/^\s*---(hint|solution)---\s*$/m);
  const problemText = parts[0];
  let hintPart = "";
  let solutionPart = "";
  for (let i = 1; i < parts.length; i += 2) {
    if (parts[i] === "hint") hintPart = parts[i + 1] ?? "";
    else solutionPart = parts[i + 1] ?? "";
  }
  const id = hash((headers.title ?? "") + problemText);
  const [show, setShow] = useState<"none" | "hint" | "solution">("none");
  const [solved, setSolvedState] = useState(() => isSolved(id));
  useEffect(() => setSolvedState(isSolved(id)), [id]);
  const level = Math.max(1, Math.min(3, Number(headers.level) || 1));
  const src = (headers.source ?? "").trim();
  const isTag = /^\[?\[?[A-Z]\d+[a-z]?(?:\.\d+)?:\d+\]?\]?$/.test(src);

  return (
    <Frame
      kind="exercise"
      label={solved ? "תרגיל · נפתר" : "תרגיל"}
      icon={solved ? "check" : "exercise"}
      title={headers.title}
      meta={
        <>
          {src && (isTag ? <Markdown text={`מהמקור: [[${src.replace(/^\[\[|\]\]$/g, "")}]]`} inline /> : <span>{src === "חדש" ? "תרגיל חדש" : src}</span>)}
          <span className="ex-level" title={`רמת קושי ${level} מתוך 3`}>
            רמה {level}/3
          </span>
        </>
      }
    >
      <Markdown text={problemText.trim()} />
      <div className="ex-actions">
        {hintPart.trim() && (
          <button className={`btn small ${show === "hint" ? "is-on" : ""}`} onClick={() => setShow(show === "hint" ? "none" : "hint")}>
            רמז
          </button>
        )}
        {solutionPart.trim() && (
          <button className={`btn small ${show === "solution" ? "is-on" : ""}`} onClick={() => setShow(show === "solution" ? "none" : "solution")}>
            פתרון מלא
          </button>
        )}
        <label className={`btn small check ${solved ? "is-on" : ""}`}>
          <input
            type="checkbox"
            checked={solved}
            onChange={(e) => {
              setSolved(id, e.target.checked);
              setSolvedState(e.target.checked);
            }}
          />
          {solved ? "פתרתי" : "סמנו כשפתרתם"}
        </label>
      </div>
      {show !== "none" && (
        <div className="reveal">
          <Markdown text={(show === "hint" ? hintPart : solutionPart).trim()} />
        </div>
      )}
    </Frame>
  );
}
