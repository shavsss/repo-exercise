const {chromium}=require('playwright');
const [,,file,out,w,h,theme,hash,clicks]=process.argv;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:+w,height:+h},colorScheme:theme||'light'});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
const html=require('fs').readFileSync(file,'utf8');
await p.setContent('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+html+'</body></html>',{waitUntil:'networkidle'}).catch(()=>{});
if(hash) await p.evaluate(h=>{document.querySelector(`[data-v="${h}"]`)?.click()},hash);
for(const c of (clicks||'').split('|').filter(Boolean)){await p.click(c).catch(e=>errs.push('click '+c));await p.waitForTimeout(150);}
await p.waitForTimeout(500);
const sw=await p.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);
await p.screenshot({path:out,fullPage:true});console.log(out,JSON.stringify({errs,sw}));await b.close();})();
