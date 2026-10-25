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
    fontFamily: "IBM Plex Sans Hebrew, IBM Plex Sans, sans-serif",
    flowchart: { nodeSpacing: 28, rankSpacing: 46, padding: 12, curve: "basis" },
    themeVariables: dark
      ? { background: "#0e2c4f", primaryColor: "#123a64", primaryTextColor: "#e8f1fb", primaryBorderColor: "#9cc3e8", lineColor: "#9cc3e8", secondaryColor: "#174673", tertiaryColor: "#0e2c4f", fontSize: "15px" }
      : { background: "#ffffff", primaryColor: "#f3f7fa", primaryTextColor: "#14283c", primaryBorderColor: "#14283c", lineColor: "#3d5a74", secondaryColor: "#fbeee8", tertiaryColor: "#ffffff", fontSize: "15px" },
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
        {!svg && (error && !live ? <div className="viz-pending is-error">התרשים לא נבנה: {error.slice(0, 160)}</div> : <div className="viz-pending is-live">בונה תרשים…</div>)}
      </div>
    </figure>
  );
}
