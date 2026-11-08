import type { RefObject } from "react";
import { goTo, useHeadings } from "./ReadingAids";

// Where the reader is in a lesson: one dot per section (the lesson's ## headings) in the margin
// beside the text. Sections already passed are filled, the one being read is marked in the lab's
// accent and shows its name on hover or focus, and a click jumps to a section. No motion of its
// own. Identical in both labs.
export function SectionDots({ scrollRef, version }: { scrollRef: RefObject<HTMLDivElement | null>; version: unknown }) {
  const { heads, current } = useHeadings(scrollRef, version);
  const secs = heads.filter((h) => h.level === 2);
  if (secs.length < 2) return null;
  // the section being read is the last ## heading at or above the current heading
  const at = heads.findIndex((h) => h.id === current);
  let here = -1;
  for (let i = 0; i <= at; i++) if (heads[i].level === 2) here = secs.indexOf(heads[i]);
  return (
    <nav className="sec-dots" aria-label="סעיפי השיעור">
      {secs.map((s, i) => (
        <button
          key={s.id}
          className={`sec-dot ${i < here ? "is-done" : ""} ${i === here ? "is-here" : ""}`}
          aria-current={i === here ? "location" : undefined}
          aria-label={s.text}
          onClick={() => goTo(s.id)}
        >
          <span className="sec-dot-label">{s.text}</span>
        </button>
      ))}
    </nav>
  );
}
