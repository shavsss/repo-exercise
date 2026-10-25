import { createContext, memo, useContext, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Callout, CALLOUTS, parseHeaders } from "./blocks/Callout";
import { Think } from "./blocks/Think";
import { Exercise } from "./blocks/Exercise";
import { ChartBlock, TableBlock } from "./blocks/DataBlocks";
import { MermaidBlock } from "./blocks/Mermaid";
import { SvgBlock } from "./blocks/SvgBlock";
import { Interactive } from "./blocks/Interactive";
import { Badge } from "./blocks/Badge";

export interface MdContextValue {
  live: boolean;
  idPrefix: string;
}
export const MdContext = createContext<MdContextValue>({ live: false, idPrefix: "m" });

/** [[tag]] → inline code with a marker, outside fenced blocks, so the code renderer can draw a pill. */
function preprocess(src: string) {
  return src
    .split(/(```[\s\S]*?(?:```|$))/g)
    .map((part, i) => (i % 2 === 1 ? part : part.replace(/\[\[([^\]\n]{1,200})\]\]/g, (_m, inner) => "`§b:" + inner + "`")))
    .join("");
}

export function slug(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) return textOf((node as any).props.children);
  return "";
}

function FencedBlock({ lang, code }: { lang: string; code: string }) {
  const ctx = useContext(MdContext);
  if (lang === "think") return <Think body={code} />;
  if (lang === "exercise") return <Exercise source={code} />;
  if (lang === "chart") return <ChartBlock source={code} live={ctx.live} />;
  if (lang === "table") return <TableBlock source={code} live={ctx.live} />;
  if (lang === "mermaid") return <MermaidBlock code={code} live={ctx.live} />;
  if (lang === "svg") return <SvgBlock source={code} />;
  if (lang === "interactive") return <Interactive source={code} live={ctx.live} />;
  if (lang in CALLOUTS) {
    const { headers, body } = parseHeaders(code);
    return (
      <Callout kind={lang} headers={headers}>
        <Markdown text={body} />
      </Callout>
    );
  }
  return (
    <pre className="code-plain" dir="ltr">
      {lang && <span className="code-lang">{lang}</span>}
      <code>{code}</code>
    </pre>
  );
}

const components: Components = {
  pre({ children }) {
    const child: any = Array.isArray(children) ? children[0] : children;
    const className: string = child?.props?.className ?? "";
    const lang = /language-([\w-]+)/.exec(className)?.[1] ?? "";
    const code = textOf(child?.props?.children).replace(/\n$/, "");
    return <FencedBlock lang={lang} code={code} />;
  },
  code({ children, className }) {
    const raw = textOf(children);
    if (!className && raw.startsWith("§b:")) return <Badge text={raw.slice(3)} />;
    return <code className="inline-code">{children}</code>;
  },
  h2({ children }) {
    const ctx = useContext(MdContext);
    return <h2 id={`${ctx.idPrefix}-${slug(textOf(children))}`}>{children}</h2>;
  },
  h3({ children }) {
    const ctx = useContext(MdContext);
    return <h3 id={`${ctx.idPrefix}-${slug(textOf(children))}`}>{children}</h3>;
  },
  a({ href, children }) {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  },
  table({ children }) {
    return (
      <div className="table-wrap">
        <table>{children}</table>
      </div>
    );
  },
};

const inlineComponents: Components = { ...components, p: ({ children }) => <>{children}</> };

export const Markdown = memo(function Markdown({ text, inline = false }: { text: string; inline?: boolean }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: true }]]}
      rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: "ignore" }]]}
      components={inline ? inlineComponents : components}
    >
      {preprocess(text)}
    </ReactMarkdown>
  );
});
