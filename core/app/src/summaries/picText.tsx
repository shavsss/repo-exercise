// Text boxes on a picture (24.11, the learner: put text anywhere on a picture, make the box bigger or smaller,
// and have it look good). A box is anchored at its top-right corner (x1, y1); its width runs to x2, and its
// letters scale with the picture, so it keeps its place and proportion at every picture size and in the
// export (media.ts draws it the same way). A box from before (x2 === x1) keeps its one-line look.
// Same file in both labs.
import { useEffect, useState, type CSSProperties, type RefObject } from "react";
import type { Shape } from "./model";
import { SHAPE_HEX, TEXT_MIN_PX, TEXT_SCALE, textInk } from "./media";

export const SIZE_STEPS = [0.7, 0.85, 1, 1.25, 1.6, 2];

/** The width of an element, kept current. */
export function useWidth(ref: RefObject<HTMLElement | null>) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

export const fontPx = (areaW: number, size = 1) => Math.max(TEXT_MIN_PX, areaW * TEXT_SCALE * size);

/** where a text box sits and how big its letters are */
export function textBoxStyle(s: Shape, areaW: number): CSSProperties {
  const wide = s.x2 < s.x1;
  return {
    right: `${100 - s.x1 / 10}%`,
    top: `${s.y1 / 10}%`,
    width: wide ? `${(s.x1 - s.x2) / 10}%` : undefined,
    whiteSpace: wide ? "pre-wrap" : "nowrap",
    fontSize: `${fontPx(areaW, s.size)}px`,
    color: textInk(s.color),
    ["--tb" as string]: SHAPE_HEX[s.color],
  };
}

/** A finished box, as the reader sees it. */
export function TextBox({ s, areaW, className = "", children, ...rest }: { s: Shape; areaW: number; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`sm-pic-text ${className}`} style={textBoxStyle(s, areaW)} dir="auto" {...rest}>
      {s.text}
      {children}
    </div>
  );
}
