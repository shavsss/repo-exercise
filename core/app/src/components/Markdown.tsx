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
import { FigureBlock } from "./blocks/Figure";
import { SimBlock } from "./blocks/Sim";
import { AnimBlock } from "./blocks/Anim";
import { SourceTag } from "./blocks/SourceTag";
import { Scene3DBlock } from "./blocks/Scene3D";

export interface MdContextValue {
  live: boolean;
  idPrefix: string;
  openSource: (doc: string, page: number) => void;
}
export const MdContext = createContext<MdContextValue>({ live: false, idPrefix: "m", openSource: () => {} });

const SOURCE_TAG = /^([A-Za-z]\d+[a-z]?(?:\.\d+)?):(\d+)$/;

/**
 * Before parsing: [[tag]] becomes inline code with a marker (outside fenced blocks), so
 * the code renderer can draw a pill or a source tag; figure blocks get their number in
 * the order they appear in the message.
 */
function preprocess(src: string) {
  let fig = 0;
  return src
    .split(/(```[\s\S]*?(?:```|$))/g)
    .map((part, i) => {
      if (i % 2 === 1) return part.replace(/^```figure[ \t]*\n/, () => `\`\`\`figure\n@no: ${++fig}\n`);
      return part
        // a one-line $$…$$ paragraph is display math (remark-math reads it as inline, which rejects \tag)
        .replace(/^[ \t]*\$\$([^\n]+?)\$\$[ \t]*$/gm, (_m, tex: string) => `$$\n${tex.trim()}\n$$`)
        .replace(/\[\[([^\]\n]{1,200})\]\]/g, (_m, inner: string) => (SOURCE_TAG.test(inner.trim()) ? "`§s:" + inner.trim() + "`" : "`§b:" + inner + "`"));
    })
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
  if (lang === "figure") return <FigureBlock source={code} />;
  if (lang === "sim") return <SimBlock source={code} live={ctx.live} />;
  if (lang === "anim") return <AnimBlock source={code} live={ctx.live} />;
  if (lang === "scene3d") return <Scene3DBlock source={code} live={ctx.live} />;
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
    if (!className && raw.startsWith("§s:")) {
      const m = SOURCE_TAG.exec(raw.slice(3));
      if (m) return <SourceTag doc={m[1]} page={Number(m[2])} />;
    }
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
      rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: "ignore", trust: false }]]}
      components={inline ? inlineComponents : components}
    >
      {preprocess(text)}
    </ReactMarkdown>
  );
});
