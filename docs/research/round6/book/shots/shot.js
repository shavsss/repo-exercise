// Screenshots of the round-6 book prototypes. Usage: node shot.js <file> <out-prefix> [jsonOfShots]
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const file = 'file://' + path.resolve(process.argv[2]);
  const shots = JSON.parse(process.argv[3] || '[{"name":"default"}]');
  const browser = await chromium.launch();
  for (const s of shots) {
    const ctx = await browser.newContext({ viewport: s.vp || { width: 1600, height: 1000 }, colorScheme: s.dark ? 'dark' : 'light', deviceScaleFactor: 1, reducedMotion: s.reduce ? 'reduce' : 'no-preference' });
    const page = await ctx.newPage();
    await page.route(/fonts\.(googleapis|gstatic)\.com/, async (r) => { try { const res = await fetch(r.request().url(), { headers: { 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' } }); r.fulfill({ status: res.status, headers: Object.fromEntries(res.headers), body: Buffer.from(await res.arrayBuffer()) }); } catch (e) { r.abort(); } });
    const errs = [];
    page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(file + (s.q ? '?' + s.q : ''));
    await page.waitForTimeout(s.settle ?? 1500);
    if (s.js) { await page.evaluate(s.js); await page.waitForTimeout(s.wait || 700); }
    await page.screenshot({ path: `${process.argv[4] || '.'}/${s.name}.png` });
    if (errs.length) console.log(s.name, 'ERRORS', errs.slice(0, 5));
    else console.log(s.name, 'ok');
    await ctx.close();
  }
  await browser.close();
})();
