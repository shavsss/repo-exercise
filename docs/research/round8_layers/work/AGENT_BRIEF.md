# Fetching free sources (round 8)

You handle one slice: tmp/r8/slices/sN.json (N given in your prompt). Each entry: doc id (fixed, use it), key, target dir, title, author, url, and the modules that use it, with the part to use ("use") and the module's subtopics.

For EACH entry:
1. Get the full text as ONE PDF at <dir>/<doc>_<short-slug>.pdf (slug: ascii, <=40 chars). Legal free sources only (author/publisher/university/government/arXiv/standards bodies/archive.org of public documents).
   - Direct PDF: curl -sSL --max-time 300 -o ... (check `file` says PDF).
   - Book as HTML pages (e.g. Jupyter-book, mdBook, gitbook): render every chapter in reading order with Playwright (require('playwright'), chromium.launch(), page.goto, page.pdf({format:'A4', printBackground:true})), then pdfunite in order. Record the PDF page where each chapter starts.
   - Several papers/RFCs as one source: download each, pdfunite into one PDF, record each paper's page range.
   - Only the parts the modules need is fine for very large collections, but prefer the whole book when it is one PDF.
   - If the URL fails or is blocked: try the author's/institution's page, another official mirror, arXiv, archive.org, a different free edition. Use WebSearch/WebFetch if you have them. Never give up after one try. If a host is blocked by the network proxy (HTTP 403 from the proxy, "request blocked: no rule allows host"), write the exact host in "blocked_hosts" and keep trying alternatives.
   - File limit 95 MB; if larger, keep only the chapters the modules use, and say so.
2. Check the text layer: `pdftotext -f 5 -l 8 file -` must give real words. If it is a scan with no text, note "scan": true (OCR is not available here) and look for a text version first.
3. For each module listed, find the exact PDF page ranges (physical PDF pages, 1-based, not printed numbers) of the chapters/sections that teach its subtopics: use `pdfinfo`, the PDF outline (`python3 -c` with pypdf if installed, or pdftotext and search headings), and the "use" hint. Ranges tight to the relevant chapters, not the whole book unless the whole book is the module.

Write tmp/r8/manifest/sN.json: a list, one object per entry:
{"doc": "W07", "key": "...", "path": "library/.../W07_slug.pdf", "title": "...", "author": "...", "edition": "...", "source_url": "the URL actually used", "pdf_pages": 312, "text_ok": true, "method": "direct|html-render|bundle|...",
 "modules": {"M5.20": [{"pages": [45, 112], "note": "Hebrew: which chapters, e.g. פרקים 3–5: ..."}]},
 "status": "ok|partial|failed", "tried": ["what you tried if not straightforward"], "blocked_hosts": []}
Write the manifest progressively (after each entry) so work is not lost. Do not touch any other file in the repo. Work in a scratch dir under /tmp/claude-0/-home-user-repo-exercise/654ebc96-e9f8-583b-a96a-d82032335287/scratchpad/fetchN/ for intermediate files.
Final message: counts ok/partial/failed, total MB, and every failed/partial entry with what was tried and any blocked hosts.
