import re
STOP = set("""a an the of and or in on to for with by from as at is are be it its this that these those which into via vs
using use used their his her our we you they he she not no can may will than then also such how what why when where
who more most less very each per all any both between within without about over under one two three first second new
chapter section part introduction figure fig table example examples problem problems exercise exercises summary notes
eq equation page pp i ii iii iv v vi vii viii ix x e g etc s t""".split())
def stem(w):
    for suf in ('ization','isation','ations','ation','ments','ment','ings','ing','ities','ity','ness','ies','es','ed','al','s'):
        if len(w) > len(suf) + 3 and w.endswith(suf):
            w = w[:-len(suf)]; break
    return w
def toks(text):
    ws = [stem(w) for w in re.findall(r'[a-z][a-z0-9\-]+', text.lower().replace('-', ' ')) if w not in STOP and len(w) > 1]
    ws = [w for w in ws if w not in STOP]
    return ws + [ws[i] + '_' + ws[i + 1] for i in range(len(ws) - 1)]

