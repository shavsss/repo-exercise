"""A1 part 2: concept units, deduplication and the cross-book / cross-app overlap map.

Units = numbered TOC sections that fall inside a module's taught range (main/article roles).
  Gilua: library/engineering/syllabus/toc/*.md (S lines).
  Lanchester: the books' own contents pages, parsed from pdftotext, with a PDF-offset fitted per book.
  Books with no parseable numbered contents (SMAD = image-only scan, Hall, Ogorkiewicz, doctrine,
  articles) get units imputed at the median sections-per-page of the parsed Lanchester books.
Outputs: cache/A1_units.json, cache/A1_overlap.json, printed tables.
"""
import json, os, re, collections, statistics as st
import A1_stats as S

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, "cache")

# ------------------------------------------------------------------ units
def module_ranges(app, roles=("main", "article")):
    out = []
    for m in S.APPS[app]["modules"]:
        for s in m["sources"]:
            if s["role"] in roles:
                a, b = S.rng(s)
                out.append((s["doc"], a, b, m))
    return out

def eng_units():
    units = []
    rngs = module_ranges("eng")
    for doc, rows in S.TOC.items():
        for r in rows:
            if r["level"] != 1: continue
            for d, a, b, m in rngs:
                if d == doc and a <= r["a"] <= b:
                    units.append(dict(app="eng", doc=doc, num=r["num"], title=r["title"], a=r["a"], b=r["b"],
                                      pages=r["b"] - r["a"] + 1, mod=m["id"], tier=m["tier"], part=m["part"]))
                    break
    return units

TOCLINE = re.compile(r"^\s*(\d{1,2}(?:\.\d{1,2}){1,2})\.?\s+([A-Za-z][^\n]{2,120}?)[\s_.·]*?(\d{1,4})\s*$", re.M)

def mil_toc(doc):
    pages = S.TEXT["mil"].get(doc, {})
    ents = []
    for p in range(1, 40):
        t = pages.get(p, "")
        for m in TOCLINE.finditer(t):
            num, title, pg = m.group(1), re.sub(r"[\s_.·]+$", "", m.group(2)).strip(), int(m.group(3))
            if num.count(".") != 1:   # level-2 sections only (x.y), same granularity as the Gilua TOC
                continue
            ents.append((num, title, pg))
    # dedupe (brief contents + contents)
    seen = set(); out = []
    for e in ents:
        if e[0] in seen: continue
        seen.add(e[0]); out.append(e)
    if len(out) < 15:
        return [], None
    # fit offset: title appears on page printed+off
    votes = collections.Counter()
    for num, title, pg in out[:200]:
        key = title[:18].lower()
        if len(key) < 8: continue
        for off in range(0, 80):
            t = pages.get(pg + off, "").lower()
            if key in re.sub(r"\s+", " ", t):
                votes[off] += 1
    off = votes.most_common(1)[0][0] if votes else 0
    res = []
    for i, (num, title, pg) in enumerate(out):
        a = pg + off
        nxt = [p for _, _, p in out[i + 1:i + 2]]
        b = max(a, (nxt[0] + off - 1) if nxt else a)
        res.append(dict(num=num, title=title, a=a, b=min(b, a + 60)))
    return res, off

def mil_units():
    units = []; imputed = []
    rngs = module_ranges("mil")
    parsed = {}
    for doc in S.MIL["docs"]:
        toc, off = mil_toc(doc)
        if toc: parsed[doc] = (toc, off)
    # sections per page on parsed books (inside taught ranges)
    covered = collections.defaultdict(set)
    for doc, a, b, m in rngs:
        if doc in parsed:
            for r in parsed[doc][0]:
                if a <= r["a"] <= b and (doc, r["num"]) not in covered[m["id"]]:
                    covered[m["id"]].add((doc, r["num"]))
                    units.append(dict(app="mil", doc=doc, num=r["num"], title=r["title"], a=r["a"], b=r["b"],
                                      pages=r["b"] - r["a"] + 1, mod=m["id"], tier=m["tier"], part=m["part"]))
    # imputation rate
    pp = collections.defaultdict(int); nn = collections.defaultdict(int)
    for doc, a, b, m in rngs:
        if doc in parsed:
            pp[doc] += b - a + 1
    for u in units: nn[u["doc"]] += 1
    rates = [nn[d] / pp[d] for d in pp if pp[d] > 30 and nn[d] > 0]
    rate = st.median(rates)
    for doc, a, b, m in rngs:
        if doc not in parsed:
            k = (b - a + 1) * rate
            imputed.append(dict(doc=doc, mod=m["id"], tier=m["tier"], pages=b - a + 1, units=k, role_note=m["en"]))
    return units, imputed, rate, {d: o for d, (t, o) in parsed.items()}

# ------------------------------------------------------------------ concept lexicon
# Ordered: specific first. Each unit (section) is assigned to the FIRST concept it matches,
# using section title + module English title.
LEX = [
 ("Kalman filter / state estimation", r"kalman|state estimat|alpha.?beta|particle filter|tracking filter|track filter|observer design|estimator"),
 ("Least squares / parameter estimation / CRLB", r"least.?squares|cram[eé]r|crlb|maximum likelihood|parameter estimat|estimation theory|\bmmse\b|\blmmse\b|bayesian estimat"),
 ("Detection theory / hypothesis testing / CFAR", r"detection theory|hypothesis test|neyman|likelihood ratio|\bcfar\b|probability of detection|threshold detect|detection of signals|detection in|receiver operating|\broc\b|false alarm"),
 ("Matched filter / pulse compression / ambiguity", r"matched filter|pulse compression|ambiguity function|chirp|\blfm\b|waveform design|coded waveform"),
 ("Fourier series/transform, spectrum", r"fourier|spectr(um|al) analysis|\bdft\b|\bfft\b|frequency response|frequency domain|discrete.?time fourier|power spectr"),
 ("Sampling, aliasing, DSP filters, z-transform", r"sampl(ing|ed)|alias|z.?transform|digital filter|\bfir\b|\biir\b|quantiz|decimat|interpolat|multirate"),
 ("Laplace / transfer functions / LTI", r"laplace|transfer function|\blti\b|convolution|impulse response|linear time.?invariant|linear systems"),
 ("Feedback control: stability, PID, loop shaping", r"feedback|\bpid\b|stabilit|root locus|bode|nyquist|loop shaping|gain margin|phase margin|controller|autopilot|servo|control law|control system"),
 ("State space, linearization, modal analysis", r"state.?space|linearizat|eigenvalue|modal|controllab|observab|lyapunov"),
 ("Guidance laws (PN etc.)", r"proportional navigation|guidance law|homing|intercept geometry|pursuit|\bpn\b|miss distance|guidance"),
 ("ODEs, oscillators, resonance", r"differential equation|oscillat|resonan|harmonic|damped|vibrat|\bode\b"),
 ("Probability: distributions, random variables", r"probabilit|random variable|distribution|bayes|expectation|variance|gaussian|central limit|law of large|conditional"),
 ("Random processes, noise, PSD", r"random process|stochastic|noise|\bpsd\b|correlation function|autocorrelation|wiener|white noise|thermal noise|noise figure"),
 ("Information theory, channel capacity, coding", r"entropy|information theory|channel capacity|shannon|coding|codes|error.?correct|mutual information|compression"),
 ("Modulation, digital comms, link budget", r"modulat|link budget|link equation|\bber\b|bit error|ofdm|spread spectrum|cdma|frequency hopping|\bdsss\b|fading|diversity|multipath|communication link|data link|telemetry|satellite communication|\bcommunications?\b"),
 ("Antennas, arrays, beamforming", r"antenna|array|beam(form|width|steer)|aperture|phased|directivity|gain pattern|sidelobe|radiation pattern|monopulse"),
 ("EM waves, Maxwell, propagation", r"electromagnetic|maxwell|propagation|wave equation|refraction|diffraction|reflection|polariz|plane wave|waveguide|transmission line|attenuation|atmospher|ionosph|ducting|multipath"),
 ("Radar range equation, RCS, clutter", r"radar (range )?equation|range equation|radar cross|\brcs\b|clutter|target reflectiv|swerling|fluctuat"),
 ("Doppler, MTI, pulse-Doppler, SAR, STAP", r"doppler|\bmti\b|\bsar\b|synthetic aperture|\bstap\b|space.?time adaptive|range.?doppler|\bprf\b|isar"),
 ("Radiometry, thermal radiation, IR/EO", r"radiometr|blackbody|black body|planck|thermal radiat|infrared|\bir\b|electro.?optic|photometr|emissiv|detector|focal plane|optics|imaging|\bmtf\b"),
 ("Optimization: convex, LP, duality", r"optimi[sz]|convex|linear programming|duality|lagrang|gradient descent|newton.?s method|constrained|integer program|dynamic programming"),
 ("Linear algebra: SVD, eigen, least norm", r"\bsvd\b|singular value|matrix|matrices|linear algebra|eigen|qr factor|vector space|orthogonal|projection|conditioning"),
 ("Numerical methods, PDE simulation", r"finite difference|finite element|numerical|discretiz|stability of (the )?scheme|pde|partial differential|heat equation|diffusion equation"),
 ("Orbital mechanics, Kepler, trajectories", r"orbit|kepler|two.?body|satellite|ballistic|trajectory|launch|reentry|re-entry|delta.?v|rocket|propulsion|specific impulse|thrust"),
 ("Rigid-body dynamics, kinematics, frames", r"rigid body|kinematic|coordinate (system|frame)|rotation|euler angle|quaternion|inertial|angular momentum|attitude|reference frame"),
 ("Aerodynamics, lift/drag, flight performance", r"aerodynam|lift|drag|airfoil|wing|flight performance|range and endurance|climb|stability and control|supersonic|hypersonic|compressible|mach|boundary layer|atmosphere"),
 ("Thermodynamics, energy, heat transfer", r"thermodynam|entropy|heat transfer|conduction|convection|energy balance|cycle|combustion|heat exchanger|heat engine"),
 ("Structures, materials, stress", r"stress|strain|beam|buckling|fatigue|material|elastic|torsion|armou?r|penetrat|ballistic protection"),
 ("Machine learning, neural nets, classification", r"neural|deep learning|machine learning|classifi|learning|regression|clustering|support vector|convolutional network"),
 ("Navigation, GNSS, inertial navigation", r"\bgps\b|gnss|navigation|inertial navigation|\bins\b|pseudorange|positioning|dilution of precision|\bdop\b|geolocation|direction finding|emitter location|triangulat"),
 ("Electronic warfare: jamming, ESM, deception", r"jamm|\besm\b|electronic (attack|support|protection|warfare)|countermeasure|deception|decoy|chaff|flare|\becm\b|\beccm\b|intercept receiver|\bdrfm\b|spoof"),
 ("Electronics: circuits, amplifiers, RF", r"amplifier|transistor|op.?amp|circuit|oscillator|mixer|receiver|transmitter|power supply|filter design|semiconductor|diode|mosfet|cmos"),
 ("Operations research, combat models, Lanchester", r"lanchester|combat model|attrition|search theory|operations research|game theory|salvo|survivab|kill probability|\bpk\b|lethality|vulnerab|logistic|wargam"),
 ("Systems engineering, requirements, trade studies", r"systems engineering|requirement|trade stud|architecture|life.?cycle|verification|validation|concept of operations|conops|mission analysis|system design|budget"),
 ("Sensor fusion, multi-target tracking", r"multi.?target|data association|track(ing)? (initiat|fusion)|sensor fusion|\bmht\b|\bjpda\b|\brfs\b|glmb|tracking"),
]
LEXC = [(n, re.compile(p, re.I)) for n, p in LEX]

def concept_of(text):
    for n, rx in LEXC:
        if rx.search(text): return n
    return None

ADMIN = re.compile(r"^(problems?|exercises?|additional exercises|notes( and further reading)?|summary|references.*|bibliograph.*|further reading|concluding remarks|comments|wrap-up.*|introduction( and synopsis)?|index|review.*|questions|organization of this|acronyms|overview)\b", re.I)

STOP = set("the a an of and in on for to with by from its their as at or vs versus is are be using use".split())
def norm(t):
    t = re.sub(r"[^a-z0-9 ]", " ", t.lower())
    return frozenset(w.rstrip("s") for w in t.split() if w not in STOP and len(w) > 2)

def cluster_titles(units, thr=0.6):
    """Union-find on token-set Jaccard >= thr between sections of DIFFERENT books."""
    par = list(range(len(units)))
    def f(i):
        while par[i] != i: par[i] = par[par[i]]; i = par[i]
        return i
    toks = [norm(u["title"]) for u in units]
    inv = collections.defaultdict(list)
    for i, tk in enumerate(toks):
        for w in tk: inv[w].append(i)
    for i, tk in enumerate(toks):
        if len(tk) < 2: continue
        cand = collections.Counter()
        for w in tk:
            if len(inv[w]) < 400:
                for j in inv[w]:
                    if j > i: cand[j] += 1
        for j, c in cand.items():
            if units[j]["doc"] == units[i]["doc"]: continue
            u = len(tk | toks[j])
            if u and c / u >= thr: par[f(i)] = f(j)
    return len({f(i) for i in range(len(units))}), [f(i) for i in range(len(units))]

if __name__ == "__main__":
    eu = eng_units()
    mu, imp, rate, offs = mil_units()
    print("mil toc offsets", offs, "imputation rate sections/page", round(rate, 3))
    allu = eu + mu
    for u in allu:
        u["admin"] = bool(ADMIN.match(u["title"])) or u["num"] == "P"
        u["concept"] = None if u["admin"] else concept_of(u["title"])
    # module-title fallback concept for unmatched content units
    modtitle = {(a, m["id"]): m["en"] for a in S.APPS for m in S.APPS[a]["modules"]}
    for u in allu:
        if not u["admin"] and not u["concept"]:
            c = concept_of(modtitle[(u["app"], u["mod"])])
            u["concept_mod"] = c
    T = collections.defaultdict(collections.Counter)
    for u in allu:
        T[(u["app"], u["tier"])]["all"] += 1
        T[(u["app"], u["tier"])]["content"] += 0 if u["admin"] else 1
    imp_by = collections.defaultdict(float)
    for x in imp: imp_by[(x["tier"])] += x["units"]
    print("units", {f"{k[0]}/{k[1]}": dict(v) for k, v in T.items()})
    print("mil imputed units by tier", {k: round(v) for k, v in imp_by.items()})
    content = [u for u in allu if not u["admin"]]
    for thr in (0.5, 0.6, 0.75):
        n, _ = cluster_titles(content, thr)
        print(f"title clusters thr={thr}: {n} of {len(content)} content sections")
    # within-app & cross-app title-cluster duplication
    n, lab = cluster_titles(content, 0.6)
    cl = collections.defaultdict(list)
    for u, l in zip(content, lab): cl[l].append(u)
    multi = [v for v in cl.values() if len({x['doc'] for x in v}) > 1]
    cross = [v for v in multi if len({x['app'] for x in v}) > 1]
    print("title clusters spanning >1 book:", len(multi), "spanning both apps:", len(cross))
    ex = sorted(cross, key=lambda v: -len(v))[:25]
    for v in ex: print("   ", len(v), sorted({(x['app'], x['doc'], x['title'][:40]) for x in v})[:4])
    # ---------------- concept overlap map
    occ = collections.defaultdict(lambda: collections.defaultdict(lambda: dict(pages=0, units=0, mods=set(), docs=set())))
    for u in content:
        c = u["concept"] or u.get("concept_mod")
        if not c: continue
        key = (u["app"], u["mod"])
        o = occ[c][key]; o["pages"] += u["pages"]; o["units"] += 1; o["docs"].add(u["doc"]); o["mods"].add(u["mod"])
    tier = {(a, m["id"]): m["tier"] for a in S.APPS for m in S.APPS[a]["modules"]}
    over = []
    for c, d in occ.items():
        items = sorted(d.items(), key=lambda kv: -kv[1]["pages"])
        apps = collections.Counter(k[0] for k, _ in items)
        tot = sum(v["pages"] for _, v in items)
        prim = items[0][1]["pages"]
        over.append(dict(concept=c, n_modules=len(items), eng_modules=apps["eng"], mil_modules=apps["mil"],
                         pages=tot, primary=f"{items[0][0][0]}:{items[0][0][1]}", primary_pages=prim,
                         secondary_pages=tot - prim,
                         eng=[f"{k[1]}({v['pages']})" for k, v in items if k[0] == "eng"],
                         mil=[f"{k[1]}({v['pages']})" for k, v in items if k[0] == "mil"],
                         docs=sorted({x for _, v in items for x in v["docs"]})))
    over.sort(key=lambda r: -r["pages"])
    tot_content_pages = sum(u["pages"] for u in content)
    mapped = sum(r["pages"] for r in over)
    print(f"content section pages={tot_content_pages}, mapped to lexicon={mapped}")
    for r in over:
        print(f"{r['concept'][:45]:45s} mods={r['n_modules']:3d} (E{r['eng_modules']}/L{r['mil_modules']}) pages={r['pages']:5d} secondary={r['secondary_pages']:5d}")
    json.dump(dict(units=[{k: v for k, v in u.items()} for u in allu], imputed=imp, rate=rate, offsets=offs),
              open(os.path.join(CACHE, "A1_units.json"), "w"), ensure_ascii=False)
    json.dump(over, open(os.path.join(CACHE, "A1_overlap.json"), "w"), ensure_ascii=False, indent=1)
