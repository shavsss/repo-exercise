import { useEffect, useRef, useState } from "react";
import type { Store } from "../runtime";
import type { Module } from "../library";
import type { LessonSpec, StoredMessage } from "../types";
import { adoptShelf, fitsLesson, loadShelf, type AdoptProgress, type ShelfDoc } from "../shelf";
import "../shelf.css";

// "שיעור מוכן מהמדף": shown on a lesson that has no conversation yet when the nightly session left it on the
// shelf (shelf.ts, docs/SHELF_SCHEMA.md). One click makes it the lesson's conversation. Identical in both labs.

const dateHe = (t: number) => new Date(t).toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "numeric" });

export function ShelfOffer({
  store,
  m,
  idx,
  spec,
  disabled,
  onAdopt,
}: {
  store: Store;
  m: Module;
  idx: number;
  spec: LessonSpec;
  disabled?: boolean;
  onAdopt: (cid: string, msgs: StoredMessage[]) => void | Promise<void>;
}) {
  const [doc, setDoc] = useState<ShelfDoc | null>(null);
  const [state, setState] = useState<"idle" | "opening" | "failed">("idle");
  const specKey = JSON.stringify([spec.title, spec.sources]);
  // what a failed opening already created (its conversation), so the next click finishes it instead of starting over
  const got = useRef<AdoptProgress>({});
  useEffect(() => {
    let live = true;
    setDoc(null);
    setState("idle");
    got.current = {};
    loadShelf(store, m.id, idx).then((d) => live && setDoc(fitsLesson(d, spec) ? d : null));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, m.id, idx, specKey]);
  if (!doc) return null;

  const open = async () => {
    setState("opening");
    try {
      const { cid, msgs } = await adoptShelf(store, m, idx, doc, got.current);
      await onAdopt(cid, msgs);
    } catch {
      setState("failed");
    }
  };
  const v = doc.verify;
  const words = doc.words ?? doc.text.split(/\s+/).length * (1 + Number(doc.parts ?? 0));
  return (
    <section className="shelf-offer" aria-label="שיעור מוכן מהמדף">
      <div className="shelf-head">
        <span className="shelf-tag">מהמדף</span>
        <h2>שיעור מוכן מהמדף</h2>
      </div>
      <p>
        השיעור נכתב בלילה, {dateHe(doc.createdAt)}, לפי אותם כללי לימוד, ועבר בדיקה נפרדת לפני שהונח כאן. הוא נפתח מיד, וכל השאר נשאר כרגיל: שאלות, פתקים
        ומחברת.
      </p>
      <ul className="shelf-facts">
        <li>כ-{Math.round(words / 100) * 100} מילים</li>
        {v && <li>{v.verdict === "pass" ? "עבר את הבדיקה" : "עבר את הבדיקה, עם הערות"}</li>}
        {v?.facts?.checked ? <li>{v.facts.checked} מספרים נבדקו בחישוב</li> : null}
        {v?.sources?.checked ? <li>{v.sources.checked} הפניות למקור נבדקו</li> : null}
      </ul>
      {!!v?.notes?.length && (
        <details className="shelf-notes">
          <summary>מה הבדיקה הוסיפה</summary>
          <ul>
            {v.notes.slice(0, 8).map((n, i) => (
              <li key={i} dir="auto">
                {n}
              </li>
            ))}
          </ul>
        </details>
      )}
      <div className="shelf-actions">
        <button className="btn primary" onClick={open} disabled={disabled || state === "opening"}>
          {state === "opening" ? "פותח…" : "פתח את השיעור המוכן"}
        </button>
        <span className="muted">אפשר גם לכתוב אותו עכשיו, בכפתור שלמטה.</span>
      </div>
      {state === "failed" && <p className="shelf-retry">הפתיחה נעצרה באמצע. לחיצה נוספת תפתח אותו.</p>}
    </section>
  );
}
