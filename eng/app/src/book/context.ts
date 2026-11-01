// What the blocks need to know about the book they are drawn in. The same renderers draw the scrolling lesson and
// the book; inside the book a few of them change one thing only:
// - "measure": the hidden copy the book measures. A block the learner works in draws its largest state (a think
//   question with its answer open, an exercise with its solution), so the page keeps room for it and nothing
//   moves when it opens (rule 1 of the book).
// - "page": a live block (a 3D scene, a simulator, an animation, an interactive) sits on the page as a plate,
//   and `lift` brings it alive on the facing page.
// Identical in both labs.
import { createContext, useContext } from "react";

export interface BookCtxValue {
  mode: "page" | "measure";
  /** brings a plate alive on the facing page */
  lift?: (lang: string, code: string) => void;
}

export const BookCtx = createContext<BookCtxValue | null>(null);

/** True in the copy of the lesson the book measures: draw the largest state. */
export const useBookMeasure = () => useContext(BookCtx)?.mode === "measure";
export const useBook = () => useContext(BookCtx);

/** A consultation card as the book draws its closed tab. */
export interface BookCard {
  id: string;
  anchor: string;
  label: string;
  title: string;
}

/**
 * Between the consultation cards (Consult.tsx) and the book: the book shows one card at a time on the facing
 * page, and keeps a closed tab at the edge of the page for every other card. The book fills in the functions;
 * the cards read `host` and `active` and call `openCard`.
 */
export class BookBridge {
  /** the hidden copy of the whole lesson, in reading order (the book's galley) */
  galley: () => HTMLElement | null = () => null;
  /** a block on a page → the same block in the galley */
  twin: (el: HTMLElement) => HTMLElement | null = () => null;
  /** the galley block at the top of what is being read */
  blockAtTop: () => HTMLElement | null = () => null;
  /** show a card on the facing page (null closes it) */
  openCard: (id: string | null, block?: HTMLElement | null) => void = () => {};
  /** every card of the lesson, for the closed tabs */
  setCards: (cards: BookCard[]) => void = () => {};
  /** set by the cards: a new card about the paragraph being read */
  askTop: () => void = () => {};
  /** where the open card is drawn, and which */
  host: HTMLElement | null = null;
  active: string | null = null;
  private subs = new Set<() => void>();
  private ver = 0;
  subscribe = (f: () => void) => {
    this.subs.add(f);
    return () => void this.subs.delete(f);
  };
  version = () => this.ver;
  emit() {
    this.ver++;
    this.subs.forEach((f) => f());
  }
}
