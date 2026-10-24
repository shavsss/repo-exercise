import { useState } from "react";
import { Markdown } from "../Markdown";

export function Think({ body }: { body: string }) {
  const [open, setOpen] = useState(false);
  const [question, ...rest] = body.split(/^\s*---\s*$/m);
  const answer = rest.join("\n");
  return (
    <section className="callout callout-think tone-violet" data-block="think">
      <header className="callout-head">
        <span className="pill pill-solid">
          <span className="pill-icon">🤔</span>עצרו וחשבו
        </span>
      </header>
      <div className="callout-body">
        <Markdown text={question.trim()} />
      </div>
      {answer.trim() && (
        <>
          <button className={`reveal-btn ${open ? "is-open" : ""}`} onClick={() => setOpen(!open)}>
            {open ? "הסתר תשובה ▲" : "חשבתי, הראו תשובה ▼"}
          </button>
          <div className={`reveal ${open ? "is-open" : ""}`}>
            <div className="reveal-inner">
              <Markdown text={answer.trim()} />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
