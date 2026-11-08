"""Split a lesson Markdown file into blocks (paragraphs / fenced blocks / list groups),
tagged with section, block type and word count. Used by A2_measure.py.
Usage: python3 A2_blocks.py LESSON.md [--show N]  (prints id, section, type, words, first N chars)"""
import re, sys, json

def words(t):
    return len(re.findall(r'\S+', t))

def split_blocks(text):
    lines = text.split('\n')
    blocks, cur, section, sub = [], [], '(intro)', ''
    i = 0
    def flush(kind):
        nonlocal cur
        if cur and ''.join(cur).strip():
            body = '\n'.join(cur)
            blocks.append({'section': section, 'sub': sub, 'type': kind, 'text': body})
        cur = []
    while i < len(lines):
        ln = lines[i]
        m = re.match(r'^```(\w*)', ln)
        if m:
            flush('para')
            kind = m.group(1) or 'code'
            j = i + 1
            body = []
            while j < len(lines) and not lines[j].startswith('```'):
                body.append(lines[j]); j += 1
            blocks.append({'section': section, 'sub': sub, 'type': kind, 'text': '\n'.join(body)})
            i = j + 1
            continue
        h = re.match(r'^(#+)\s+(.*)', ln)
        if h:
            flush('para')
            if len(h.group(1)) <= 2:
                section, sub = h.group(2).strip(), ''
            else:
                sub = h.group(2).strip()
            i += 1
            continue
        if not ln.strip():
            # keep numbered/derivation lists and display math with their paragraph
            nxt = lines[i+1] if i+1 < len(lines) else ''
            if cur and (re.match(r'^\s*(\d+\.|-|\$\$)', nxt) or cur[-1].startswith('$$')):
                cur.append(ln); i += 1; continue
            flush('para'); i += 1; continue
        cur.append(ln); i += 1
    flush('para')
    for k, b in enumerate(blocks):
        b['id'] = k
        b['words'] = words(b['text'])
    return blocks

if __name__ == '__main__':
    bl = split_blocks(open(sys.argv[1], encoding='utf-8').read())
    n = int(sys.argv[sys.argv.index('--show')+1]) if '--show' in sys.argv else 80
    for b in bl:
        t = re.sub(r'\s+', ' ', b['text'])[:n]
        print(f"{b['id']:3d} | {b['type']:10s} | {b['words']:4d} | {b['section'][:28]} | {t}")
    print('TOTAL', sum(b['words'] for b in bl), 'blocks', len(bl))
