// A live block on a page of the book: a plate, as in an old textbook, with its title and caption and "open" —
// the scene, simulator, animation or notebook comes alive on the facing page (one live context at a time, and
// no WebGL canvas inside a page that turns in 3D). B3 §4, R4: "plate". Identical in both labs.
import { Icon } from "../components/Icon";
import { Markdown } from "../components/Markdown";
import { useBook } from "./context";

const LABEL: Record<string, string> = { scene3d: "סצנה בתלת-ממד", sim: "סימולטור", anim: "אנימציה", interactive: "מחשבון אינטראקטיבי", notebook: "מחברת חישוב" };
const ICON: Record<string, string> = { scene3d: "sim", sim: "sim", anim: "sim", interactive: "calc", notebook: "calc" };

function titleOf(code: string): { title: string; caption: string } {
  try {
    const j = JSON.parse(code);
    return { title: String(j.title ?? j.name ?? j.id ?? ""), caption: String(j.caption ?? j.description ?? "") };
  } catch {
    const t = /^@title:\s*(.+)$/m.exec(code)?.[1] ?? "";
    return { title: t, caption: "" };
  }
}

export function BookPlate({ lang, code }: { lang: string; code: string }) {
  const book = useBook();
  const { title, caption } = titleOf(code);
  return (
    <figure className={`bk-plate bk-plate-${lang}`} data-block={lang}>
      <button className="bk-plate-art" onClick={() => book?.lift?.(lang, code)} disabled={book?.mode === "measure"} aria-label={`פתח בעמוד שמול: ${title || LABEL[lang] || lang}`}>
        <svg className="bk-plate-svg" viewBox="0 0 160 90" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
          {lang === "scene3d" ? (
            <g fill="none" stroke="currentColor" strokeWidth="0.9">
              <path d="M80 18 L112 34 L80 50 L48 34 Z" />
              <path d="M48 34 L48 60 L80 76 L80 50" />
              <path d="M112 34 L112 60 L80 76" />
              <path d="M30 70 L130 70" strokeDasharray="2 3" opacity="0.6" />
            </g>
          ) : (
            <g fill="none" stroke="currentColor" strokeWidth="0.9">
              <path d="M18 70 L142 70 M18 70 L18 16" />
              <path d="M18 62 C40 60 52 22 76 24 S112 58 140 30" />
              <circle cx="76" cy="24" r="2.4" fill="currentColor" />
              <path d="M18 44 L142 44" strokeDasharray="2 3" opacity="0.5" />
            </g>
          )}
        </svg>
        <span className="bk-plate-open">
          <Icon name={ICON[lang] ?? "sim"} size={15} />
          פתח בעמוד שמול
        </span>
      </button>
      <figcaption className="bk-plate-cap">
        <b>{LABEL[lang] ?? lang}</b>
        {title && (
          <>
            {" · "}
            <Markdown text={title} inline />
          </>
        )}
        {caption && (
          <span className="bk-plate-sub">
            <Markdown text={caption} inline />
          </span>
        )}
      </figcaption>
    </figure>
  );
}
