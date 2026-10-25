// Test double for the claude.ai runtime: in-memory db, fixed user, scripted sample.
(function () {
  const docs = new Map(JSON.parse(localStorage.getItem("stubdb") || "[]")); // path -> data, survives reloads
  const subs = new Set();
  const notify = () => { localStorage.setItem("stubdb", JSON.stringify([...docs])); subs.forEach((f) => f()); };
  let n = 0;
  const snap = (path) => ({ id: path.split("/").pop(), exists: docs.has(path), data: () => docs.get(path) });
  function coll(path, order) {
    const q = {
      orderBy: (f, dir) => coll(path, { f, dir }),
      limit: () => q,
      async get() { return query(); },
      onSnapshot(next) { const f = () => next(query()); subs.add(f); setTimeout(f, 0); return () => subs.delete(f); },
      doc: (id) => docRef(path + "/" + (id || "d" + (++n) + Math.random().toString(36).slice(2, 6))),
    };
    function query() {
      let list = [...docs.keys()].filter((k) => k.startsWith(path + "/") && k.slice(path.length + 1).split("/").length === 1).map(snap);
      if (order) list.sort((a, b) => (a.data()[order.f] > b.data()[order.f] ? 1 : -1) * (order.dir === "desc" ? -1 : 1));
      return { docs: list };
    }
    return q;
  }
  function docRef(path) {
    return {
      id: path.split("/").pop(),
      async get() { return snap(path); },
      async set(d) { docs.set(path, JSON.parse(JSON.stringify(d))); notify(); },
      async update(d) { if (!docs.has(path)) throw { code: "invalid_argument" }; docs.set(path, { ...docs.get(path), ...JSON.parse(JSON.stringify(d)) }); notify(); },
      async delete() { docs.delete(path); notify(); },
      onSnapshot(next) { const f = () => next(snap(path)); subs.add(f); setTimeout(f, 0); return () => subs.delete(f); },
      collection: (p) => coll(path + "/" + p),
    };
  }
  const db = { doc: docRef, collection: (p) => coll(p) };
  const user = { id: async () => "u_test" };
  async function sample(input, opts) {
    opts = opts || {};
    window.__log = window.__log || [];
    if (typeof input === "string") { window.__log.push("memory"); return { text: "# זיכרון הקורס\n\n## מה נלמד\n- שיעור בדיקה (מעודכן)", truncated: false, modelTierApplied: "default" }; }
    const last = input[input.length - 1].content;
    const m = /WRITING STEP: part (\d+) of (\d+)/.exec(last);
    window.__log.push(m ? "part" + m[1] : /MODULE QUIZ/.test(last) ? "quiz" : "other");
    window.__lastInput = input;
    const tools = opts.tools || [];
    const call = (name, args) => tools.find((x) => x.name === name).execute(args, { signal: new AbortController().signal });
    let text;
    if (m) {
      const k = +m[1], n = +m[2];
      if (k === 2 && !last.includes("cut off")) {
        const t = "## חלק 2\n\nתחילת חלק שני שנקטע";
        opts.onText && opts.onText({ text: t, delta: t });
        return { text: t, truncated: true, modelTierApplied: "complex", modelApplied: "claude-opus-5-5" };
      }
      text = k === 2 ? " והמשך חלק שני." : k === 1 ? window.__answer : "## חלק " + k + "\n\nסוף השיעור.\n\n```coverage\n- כל הסעיפים נלמדו\n```";
      if (k === 1) await call("read_source_pages", { doc: window.__doc, from: 1, to: 2 });
      if (k === 3 && !window.__fast) await new Promise((r) => setTimeout(r, 4000));
    } else if (/התשובות שלי/.test(last)) text = "בדיקה מלאה. [[ציון: 85/100]]";
    else if (/MODULE QUIZ/.test(last)) text = "1. שאלה ראשונה\n2. שאלה שנייה";
    else text = "תשובה רגילה.";
    let shown = "";
    for (const part of text.match(/[\s\S]{1,400}/g)) { shown += part; opts.onText && opts.onText({ text: shown, delta: part }); await new Promise((r) => setTimeout(r, 20)); }
    return { text, truncated: false, modelTierApplied: "complex", modelApplied: "claude-opus-5-5" };
  }
  sample.json = async (input, opts) => {
    window.__log = window.__log || [];
    const last = input[input.length - 1].content;
    const tools = opts.tools || [];
    if (/MODULE PLANNING STEP/.test(last)) {
      window.__log.push("module-plan");
      await new Promise((r) => setTimeout(r, 300));
      return window.__lessons;
    }
    window.__log.push("plan");
    await tools.find((x) => x.name === "compute").execute({ script: "R = 50\n10*log10(R)" }, {});
    return { title: "שיעור", parts: [{ title: "א", covers: "x", words: 1200 }, { title: "ב", covers: "y", words: 1500 }, { title: "ג", covers: "z", words: 1500 }], facts: ["2"] };
  };
  sample.limits = async () => ({ maxPromptBytes: 262144, images: { maxCount: 5 }, tools: { maxCount: 16 } });
  window.__db = docs;
  // Asset-store bundles: their URLs (index.json "assets") and lib/ paths are served from the harness's assets/.
  const realFetch = window.fetch.bind(window);
  let assetNames = null;
  window.fetch = async (url, opts) => {
    if (typeof url === "string" && url.startsWith("/_blob/")) {
      assetNames ??= realFetch("lib/index.json").then((r) => r.json()).then((ix) => Object.fromEntries(Object.entries(ix.assets ?? {}).map(([k, v]) => [v, k])));
      const name = (await assetNames)[url];
      if (name) return realFetch(`assets/${name}`, opts);
    }
    const res = await realFetch(url, opts);
    if (!res.ok && typeof url === "string" && url.startsWith("lib/")) return realFetch(`assets/${url.slice(4)}`, opts);
    return res;
  };
  const downloads = { save: async ({ filename, data }) => { window.__saved = { filename, size: data.length ?? data.byteLength }; return { status: "saved" }; } };
  window.claude = { use: async (name) => ({ sample, db, user, downloads }[name] ?? null) };
})();
