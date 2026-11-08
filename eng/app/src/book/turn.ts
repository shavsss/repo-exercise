// The page turn of the book, on the compositor: Web Animations on transform and opacity only (B2 §6), so a turn
// never stutters while the tutor is writing. A turn is a rigid leaf with a lift and shading (R4: rigid, not curl):
// the page being turned rotates about the spine, and the page on its back is the next page itself, rotating with
// it from the far side (each page is in the DOM once; nothing is copied). The shading is a fixed gradient on each
// page whose opacity alone changes. Identical in both labs.

export type TurnStyle = "3d" | "peel" | "fade" | "riffle" | "none";

/** 380 ms, readable after ~200 ms: the leaf has passed the spine at 35% and is near rest at 55% (B2 §2.1). */
export const TURN_MS = 380;
export const EASE = "cubic-bezier(.25,.8,.25,1)";
/** a leaf in a run of held-down turns */
export const FAST_MS = 200;
export const PEEL_MS = 260;
export const FADE_MS = 120;
export const OPEN_MS = 650;
export const OPEN_EASE = "cubic-bezier(.2,.7,.2,1)";
const LIFT = 18;

export interface TurnEls {
  /** the page that turns away (its front) */
  a?: HTMLElement | null;
  /** the page on the back of the leaf, coming to rest */
  b?: HTMLElement | null;
  /** the page uncovered under the leaf */
  under?: HTMLElement | null;
  /** the page the leaf comes to lie on */
  base?: HTMLElement | null;
  /** pages that fade out (a cross-fade) */
  out?: (HTMLElement | null | undefined)[];
  /** blank leaves of a riffle */
  ghosts?: (HTMLElement | null | undefined)[];
}

const shade = (el: HTMLElement | null | undefined) => el?.querySelector<HTMLElement>(":scope > .bk-shade") ?? null;

function anim(el: HTMLElement | null | undefined, frames: Keyframe[], ms: number, easing: string, delay = 0): Animation | null {
  if (!el) return null;
  return el.animate(frames, { duration: ms, easing, fill: "both", delay });
}

/**
 * The animations of one turn. `dir` 1 is forward (in a Hebrew book the left leaf turns over to the right),
 * -1 back. All of them run on the same clock, so the group is played, reversed or sped up together.
 */
export function makeTurn(style: TurnStyle, dir: 1 | -1, els: TurnEls, ms: number, easing = EASE): Animation[] {
  const out: (Animation | null)[] = [];
  if (style === "3d") {
    // the front: forward it is a left page turning about its right edge (+θ lifts it toward the reader);
    // back, a right page about its left edge (−θ)
    const s = dir;
    const r = (deg: number, z = 0) => ({ transform: `translateZ(${z}px) rotateY(${deg}deg) translateZ(1px)` });
    out.push(anim(els.a, [r(0), r(90 * s, LIFT), r(180 * s)], ms, easing));
    out.push(anim(els.b, [r(-180 * s), r(-90 * s, LIFT), r(0)], ms, easing));
    out.push(anim(shade(els.a), [{ opacity: 0 }, { opacity: 0.3 }, { opacity: 0.3 }], ms, easing));
    out.push(anim(shade(els.b), [{ opacity: 0.3 }, { opacity: 0.3 }, { opacity: 0 }], ms, easing));
    out.push(anim(shade(els.under), [{ opacity: 0.26 }, { opacity: 0.1 }, { opacity: 0 }], ms, easing));
    out.push(anim(shade(els.base), [{ opacity: 0 }, { opacity: 0.04 }, { opacity: 0.16 }], ms, easing));
  } else if (style === "peel") {
    // one page: forward it glides off toward the spine side with a small lift (≤10°), uncovering the next;
    // back, the page before glides in over this one
    const away = [{ transform: "translateX(0) rotateY(0deg)" }, { transform: "translateX(104%) rotateY(10deg)" }];
    out.push(anim(els.a, dir === 1 ? away : [...away].reverse(), ms, easing));
    out.push(anim(shade(els.a), dir === 1 ? [{ opacity: 0 }, { opacity: 0.22 }] : [{ opacity: 0.22 }, { opacity: 0 }], ms, easing));
    out.push(anim(shade(els.under), dir === 1 ? [{ opacity: 0.18 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 0.18 }], ms, easing));
  } else if (style === "fade") {
    for (const el of els.out ?? []) out.push(anim(el, [{ opacity: 1 }, { opacity: 0 }], ms, "linear"));
  } else if (style === "riffle") {
    // three to five blank leaves, all within the riffle's time (≤ 450 ms)
    const g = (els.ghosts ?? []).filter(Boolean) as HTMLElement[];
    const each = Math.min(240, ms * 0.6);
    const step = g.length > 1 ? (ms - each) / (g.length - 1) : 0;
    g.forEach((el, k) => {
      const s = dir;
      out.push(
        anim(
          el,
          [
            { transform: `rotateY(0deg)`, opacity: 1 },
            { transform: `translateZ(${LIFT / 2}px) rotateY(${90 * s}deg)`, opacity: 1 },
            { transform: `rotateY(${180 * s}deg)`, opacity: 0 },
          ],
          each,
          "cubic-bezier(.3,.6,.3,1)",
          k * step,
        ),
      );
    });
  }
  return out.filter((a): a is Animation => !!a);
}

/** The opening of the book, once a lesson: the cover turns over like a leaf, and its back is the first page. */
export function makeOpen(els: TurnEls): Animation[] {
  return makeTurn("3d", 1, els, OPEN_MS, OPEN_EASE);
}

export function reducedMotion() {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}
