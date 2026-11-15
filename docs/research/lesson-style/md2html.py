import re,json,sys,html
src=open(sys.argv[1],encoding='utf-8').read()
def inline(t):
    t=re.sub(r'\[\[מונח:\s*([^|\]]+)\|\s*([^\]]+)\]\]',lambda m:f'<abbr title="{html.escape(m[2].strip())}">{m[1].strip()}</abbr>',t)
    t=re.sub(r'\[\[ודאות:\s*([^\]]+)\]\]',r'<span class="cert">ודאות: \1</span>',t)
    t=re.sub(r'\[\[היפותטי\]\]',r'<span class="cert">היפותטי</span>',t)
    t=re.sub(r'\[\[[^\]]*\]\]\s?','',t)
    return t
NAMES={'definition':'הגדרה','formula':'נוסחה','history':'רקע היסטורי','casestudy':'מקרה בוחן','domain':'חיבור לתחום אחר','numeric':'שאלה מספרית','mcq':'שאלה','decide':'הכרעה','predict':'נחש קודם','verify':'בדיקה','derivation':'גזירה','keep':'לסיכום','explain':'שאלה פתוחה'}
out=[];parts=re.split(r'^```(\w*)\n(.*?)^```\s*$',src,flags=re.S|re.M)
for i in range(0,len(parts),3):
    out.append(('md',inline(parts[i])))
    if i+1>=len(parts):break
    kind,body=parts[i+1],parts[i+2]
    if kind=='svg':
        cap=re.search(r'^@caption:\s*(.*)$',body,re.M)
        svg=re.sub(r'^@\w+:.*\n','',body,flags=re.M)
        out.append(('raw',f'<figure>{svg}<figcaption>{inline(cap[1]) if cap else ""}</figcaption></figure>'))
    elif kind=='table':
        t=json.loads(body)
        rows=''.join('<tr>'+''.join(f'<td>{inline(html.escape(str(c)))}</td>' for c in r)+'</tr>' for r in t.get('rows',[]))
        head=''.join(f'<th>{html.escape(c)}</th>' for c in t.get('columns',[]))
        out.append(('raw',f'<figure><table><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table><figcaption>{html.escape(t.get("title",""))}</figcaption></figure>'))
    elif kind in('chart','anim'):
        out.append(('viz',kind,json.loads(body)))
    elif kind=='mermaid':
        try:t=json.loads(body).get('title','')
        except Exception:t=''
        out.append(('raw',f'<div class="note">[{kind}: {html.escape(t)}]</div>'))
    else:
        meta=dict(re.findall(r'^@(\w+):\s*(.*)$',body,re.M))
        body=re.sub(r'^@\w+:.*\n','',body,flags=re.M)
        if kind=='mcq':
            body=re.sub(r'^- \[x\] (.*?) :: (.*)$',r'- ✅ **\1** — \2',body,flags=re.M)
            body=re.sub(r'^- \[ \] (.*?) :: (.*)$',r'- \1 — *\2*',body,flags=re.M)
        if '\n---\n' in body:
            q,a=body.split('\n---\n',1);body=q+'\n\n<details><summary>פתרון</summary>\n\n'+a+'\n\n</details>'
        head=NAMES.get(kind,kind)+(': '+meta['title'] if 'title' in meta else '')
        if 'who' in meta: head+=f" <small>({meta['who']}, {meta.get('when','')})</small>"
        out.append(('box',kind,head,inline(body)))
data=json.dumps(out,ensure_ascii=False).replace('</','<\\/')
import os
VIS=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'visuals.js'),encoding='utf-8').read()
print(f'''<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>פרק הקוונטים לדוגמה</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/marked@12.0.0/marked.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/mathjs@12.4.2/lib/browser/math.js"></script>
<style>
:root{{--bg:#faf7f0;--fg:#222;--muted:#6b6b6b;--box:#fff;--line:#d9d2c3;--acc:#2f5d8a}}
@media (prefers-color-scheme:dark){{:root{{--bg:#1e1f21;--fg:#e4e2dc;--muted:#9a978f;--box:#26282b;--line:#3b3d41;--acc:#8ab4e0}}}}
body{{background:var(--bg);color:var(--fg);font:18.5px/1.75 "Frank Ruhl Libre","David",Georgia,serif;margin:0}}
main{{max-width:68ch;margin:0 auto;padding:24px 16px 80px}}
h2{{font-size:1.6em;line-height:1.3}} h3{{margin-top:2em;color:var(--acc)}}
.box{{background:var(--box);border:1px solid var(--line);border-right:4px solid var(--acc);border-radius:6px;padding:10px 16px;margin:1.2em 0}}
.box>.h{{font-weight:700;color:var(--acc);margin-bottom:4px}}
.box.history{{border-right-color:#a0703a}} .box.history>.h{{color:#a0703a}}
.box.mcq,.box.numeric{{border-right-color:#6a8a4a}} .box.mcq>.h,.box.numeric>.h{{color:#6a8a4a}}
.cert{{font-size:.7em;color:var(--muted);border:1px solid var(--line);border-radius:4px;padding:0 4px;white-space:nowrap}}
abbr{{text-decoration:underline dotted;cursor:help}}
figure{{margin:1.5em 0;text-align:center}} figure svg{{max-width:100%;height:auto}} figcaption,.note{{font-size:.85em;color:var(--muted)}}
.katex-display{{overflow-x:auto;overflow-y:hidden;direction:ltr}} .katex{{direction:ltr;unicode-bidi:isolate}}
table{{border-collapse:collapse;margin:0 auto;font-size:.9em}} td,th{{border:1px solid var(--line);padding:4px 8px}} details{{margin-top:8px}} .vizbox svg{{width:100%;height:auto;color:var(--fg);direction:ltr}} .vizbox .tick{{font-size:11px;fill:var(--muted)}} .vizbox .lbl{{font-size:13px;fill:var(--fg)}} .vt{{font-weight:700;font-size:.95em}} .legend{{font-size:.8em;display:flex;gap:14px;flex-wrap:wrap;justify-content:center}} .legend i{{display:inline-block;width:14px;height:3px;margin-inline-end:5px;vertical-align:middle}} .param{{display:flex;gap:8px;align-items:center;font-size:.85em;margin:4px 0}} .param input{{flex:1}} summary{{cursor:pointer;color:var(--acc)}}
</style></head><body><main id="m"></main>
<script>
{VIS}
const D={data};
function md(t){{const M=[];t=t.replace(/\\$\\$([\\s\\S]+?)\\$\\$|\\$([^$\\n]+?)\\$/g,(s,a,b)=>{{M.push([a!==undefined,a!==undefined?a:b]);return"@@M"+(M.length-1)+"@@"}});
let h=marked.parse(t);return h.replace(/@@M(\\d+)@@/g,(s,i)=>{{const[d,x]=M[i];try{{return katex.renderToString(x,{{displayMode:d,throwOnError:false}})}}catch(e){{return x}}}})}}
const m=document.getElementById("m");
for(const p of D){{const e=document.createElement("div");
if(p[0]=="md")e.innerHTML=md(p[1]);else if(p[0]=="raw")e.innerHTML=p[1];else if(p[0]=="viz")e.appendChild(renderVisual(p[1],p[2]));
else{{e.className="box "+p[1];e.innerHTML='<div class="h">'+md(p[2]).replace(/^<p>|<\\/p>\\s*$/g,"")+"</div>"+md(p[3])}}
m.appendChild(e)}}
</script></body></html>''')
