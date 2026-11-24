// The look shared by the marks on a picture: in the editor, the reading view and the export (marks.tsx,
// picText.tsx, media.ts). Same file in both labs.
import type { ShapeColor } from "./model";

/** Fixed colours for the marks drawn on pictures, readable on any picture. */
export const SHAPE_HEX: Record<ShapeColor, string> = { y: "#e0a800", r: "#d32f2f", b: "#1f6fb2", g: "#2e7d32", p: "#7b3fa0", o: "#d9730d", k: "#222222" };
/** a text box's (and a numbered badge's) letters against the picture's width, at size 1 */
export const TEXT_SCALE = 0.024;
export const TEXT_MIN_PX = 11;
/** a text box's letters: its colour, but a darker yellow, which is unreadable on white */
export const textInk = (c: ShapeColor) => (c === "y" ? "#7a5a00" : SHAPE_HEX[c]);
export const fontPx = (areaW: number, size = 1) => Math.max(TEXT_MIN_PX, areaW * TEXT_SCALE * size);
