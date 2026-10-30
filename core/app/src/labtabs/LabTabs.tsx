// The tabs beside the lessons: the review queue (src/review/), the weekly paper, the month's product and the weekly
// external review. Wide screens show them in the top bar; narrow ones fold them into
// one button with a short list. The same file in both apps (the lab's entry in config.ts).
import { useEffect, useRef, useState } from "react";
import type { Runtime } from "../runtime";
import type { LibraryIndex } from "../library";
import type { Lab } from "./config";
import { listIssues, loadFb } from "./data";
import { NewsTab } from "./News";
import { ProductsTab } from "./Products";
import { ReviewsTab } from "./Reviews";
import { ReviewTab } from "../review/Review";

export type LabTab = "study" | "review" | "news" | "products" | "reviews";

const TABS: { id: LabTab; label: string }[] = [
  { id: "study", label: "לימוד" },
  { id: "review", label: "חזרה" },
  { id: "news", label: "עיתון" },
  { id: "products", label: "מוצר החודש" },
  { id: "reviews", label: "ביקורת שבועית" },
];

/** True when the newest issue has not been opened yet (profile/newsfb/<id>.openedAt). Checked again on every tab change. */
export function useNewsUnread(rt: Runtime | null, tab: LabTab) {
  const [unread, setUnread] = useState(false);
  useEffect(() => {
    const store = rt?.store;
    if (!store || tab === "news") return setUnread(false);
    let live = true;
    (async () => {
      const list = await listIssues(store);
      if (!list.length) return live && setUnread(false);
      const fb = await loadFb(store, list[0].id);
      if (live) setUnread(!fb.openedAt);
    })().catch(() => {});
    return () => {
      live = false;
    };
  }, [rt, tab]);
  return unread;
}

export function LabTabsNav({ tab, onTab, unread }: { tab: LabTab; onTab: (t: LabTab) => void; unread: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  const cur = TABS.find((t) => t.id === tab)!;
  return (
    <nav ref={ref} className={`labtabs ${open ? "is-open" : ""}`} aria-label="לשוניות">
      <button className="labtabs-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="true" aria-label={`לשוניות: ${cur.label}`} title="לימוד, חזרה, עיתון, מוצר החודש, ביקורת שבועית">
        <svg className="labtabs-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
        </svg>
        <span className="labtabs-cur">{cur.label}</span>
        {unread && tab !== "news" && <span className="labtabs-dot" aria-label="גיליון חדש" />}
        <svg className="labtabs-chev" width="10" height="10" viewBox="0 0 10 10" aria-hidden>
          <path d="M2 4l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>
      <div className="labtabs-list" role="list">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="listitem"
            className={`labtab ${t.id === tab ? "is-on" : ""}`}
            aria-current={t.id === tab ? "page" : undefined}
            onClick={() => {
              onTab(t.id);
              setOpen(false);
            }}
          >
            {t.label}
            {t.id === "news" && unread && tab !== "news" && <span className="labtabs-dot" aria-label="גיליון חדש" />}
          </button>
        ))}
      </div>
    </nav>
  );
}

export interface LabTabProps {
  lab: Lab;
  rt: Runtime | null;
  index: LibraryIndex | null;
  done: Set<string>;
  current: string | null;
  onOpenModule: (moduleId: string) => void;
}

/** The page of a tab other than the lessons, in place of the lessons' body (which stays mounted underneath). */
export function LabTabView({ tab, ...p }: LabTabProps & { tab: LabTab }) {
  return (
    <div className="labtab-page" key={tab}>
      {tab === "review" && <ReviewTab {...p} />}
      {tab === "news" && <NewsTab {...p} />}
      {tab === "products" && <ProductsTab {...p} />}
      {tab === "reviews" && <ReviewsTab {...p} />}
    </div>
  );
}
