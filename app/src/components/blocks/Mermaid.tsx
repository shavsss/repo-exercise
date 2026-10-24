import { useEffect, useId, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "../../theme";

let lastTheme = "";
function init(dark: boolean) {
  const key = dark ? "dark" : "light";
  if (key === lastTheme) return;
  lastTheme = key;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "base",
    fontFamily: "Rubik, sans-serif",
    flowchart: { nodeSpacing: 28, rankSpacing: 46, padding: 12, curve: "basis" },
    themeVariables: dark
      ? {
          background: "#16131f",
          primaryColor: "#2a2140",
          primaryTextColor: "#f6efe4",
          primaryBorderColor: "#ff6b35",
          lineColor: "#ff9a6b",
          secondaryColor: "#1d2c3f",
          tertiaryColor: "#2b1830",
          fontSize: "15px",
        }
      : {
          background: "#fffaf0",
          primaryColor: "#ffe3d3",
          primaryTextColor: "#1d1b26",
          primaryBorderColor: "#1d1b26",
          lineColor: "#1d1b26",
          secondaryColor: "#dbeaff",
          tertiaryColor: "#f3e6ff",
          fontSize: "15px",
        },
  });
}

export function MermaidBlock({ code, live }: { code: string; live: boolean }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const { dark } = useTheme();
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      init(dark);
      try {
        const { svg } = await mermaid.render(`mmd${id}${Date.now()}`, code);
        // Fit the column, but never shrink below 60% of the natural size (scroll instead), so labels stay legible.
        const natural = Number(/viewBox="[\d.-]+ [\d.-]+ ([\d.]+)/.exec(svg)?.[1]);
        const sized = natural
          ? svg.replace(/style="max-width:[^"]*"/, `style="width:100%;max-width:${Math.ceil(natural)}px;min-width:${Math.ceil(natural * 0.6)}px"`)
          : svg;
        if (!cancelled) {
          setSvg(sized);
          setError("");
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    }, live ? 600 : 50);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [code, dark, live, id]);

  return (
    <figure className="viz viz-mermaid" data-block="mermaid">
      <div className="viz-bar">
        <span className="viz-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="viz-title">תרשים</span>
      </div>
      <div className="viz-body mermaid-body">
        {svg ? <div dangerouslySetInnerHTML={{ __html: svg }} /> : null}
        {!svg && (error && !live ? <div className="viz-pending is-error">⚠️ התרשים לא נבנה: {error.slice(0, 160)}</div> : <div className="viz-pending is-live">⏳ בונה תרשים…</div>)}
      </div>
    </figure>
  );
}
