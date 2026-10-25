import { useState } from "react";
import { Markdown } from "../Markdown";
import { Frame } from "./Callout";

export function Think({ body }: { body: string }) {
  const [open, setOpen] = useState(false);
  const [question, ...rest] = body.split(/^\s*---\s*$/m);
  const answer = rest.join("\n");
  return (
    <Frame kind="think" label="עצרו וחשבו" icon="think">
      <Markdown text={question.trim()} />
      {answer.trim() && (
        <>
          <button className={`reveal-btn ${open ? "is-open" : ""}`} onClick={() => setOpen(!open)}>
            {open ? "הסתר את התשובה" : "חשבתי. הראו תשובה"}
          </button>
          {open && (
            <div className="reveal">
              <Markdown text={answer.trim()} />
            </div>
          )}
        </>
      )}
    </Frame>
  );
}
