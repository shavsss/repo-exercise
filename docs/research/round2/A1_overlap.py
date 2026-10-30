"""A1 part 3: result-level overlap. Which central results are TAUGHT (not just mentioned) in more
than one module, within and across the two apps, and how many pages a teach-once policy saves.

A section 'teaches' result r when r's signature phrases are dense in its text:
   hits >= 4 and hits per 1000 words >= 2.5, or the section title matches r.
Each section is assigned to at most one result: the one with the highest density (dominant topic).
The first module in curriculum order (Gilua before Lanchester for shared results) is the 'primary';
every other module that teaches r is a 'repeat' that can become a delta lesson.
Outputs: cache/A1_results.json + printed table.
"""
import json, os, re, collections
import A1_stats as S

HERE = os.path.dirname(os.path.abspath(__file__)); CACHE = os.path.join(HERE, "cache")
U = json.load(open(os.path.join(CACHE, "A1_units.json")))
units = [u for u in U["units"] if not u["admin"]]

RES = {
 "Radar range equation": r"radar (range )?equation|range equation|R\^?4|fourth power of range",
 "Link/Friis equation, EIRP": r"friis|link (budget|equation)|eirp|free.?space (path )?loss|spreading loss",
 "dB / decibel arithmetic": r"\bdbm\b|\bdbi\b|decibel",
 "Thermal noise kTB, noise figure, SNR": r"\bktb\b|noise figure|noise temperature|thermal noise|johnson noise|signal.to.noise",
 "Antenna gain-aperture, beamwidth λ/D, directivity": r"directivity|effective aperture|beamwidth|antenna gain|half.power beam",
 "Array factor, phased arrays, beam steering": r"array factor|phased array|beam steer|grating lobe|element spacing|uniform linear array",
 "Maxwell equations / EM plane waves": r"maxwell|plane wave|poynting|displacement current",
 "Wave propagation: refraction, diffraction, multipath": r"refraction|diffraction|snell|multipath|fresnel zone|ducting|knife.edge",
 "Doppler shift / pulse-Doppler / MTI": r"doppler|\bmti\b|blind speed|\bprf\b",
 "Matched filter, pulse compression, ambiguity": r"matched filter|pulse compression|ambiguity function|chirp|time.bandwidth product",
 "Detection: Neyman-Pearson, ROC, Pd/Pfa, CFAR": r"neyman|likelihood ratio test|receiver operating|probability of (false alarm|detection)|\bcfar\b|\bp_?fa\b|false alarm",
 "Fourier transform / series / spectrum": r"fourier (transform|series|coefficient)|\bdft\b|\bfft\b|spectrum",
 "Sampling theorem, aliasing": r"sampling theorem|nyquist rate|alias|sampling frequency|sample rate",
 "Convolution, LTI, impulse response": r"convolution|impulse response|linear time.invariant|\blti\b",
 "Laplace / z-transform, transfer function": r"laplace transform|z.transform|transfer function|poles? and zeros|region of convergence",
 "Feedback stability: Bode/Nyquist/root locus/margins": r"bode|nyquist (plot|criterion)|root locus|gain margin|phase margin|loop gain|closed.loop",
 "PID / servo / autopilot design": r"\bpid\b|proportional.integral|integral action|autopilot|servo",
 "State space, eigenvalues, modes": r"state.space|state matrix|eigenvalue|controllab|observab|modal",
 "Kalman filter / observers": r"kalman|innovation|covariance (matrix|propagation)|riccati|observer gain|alpha.beta",
 "Least squares, CRLB, ML estimation": r"least.squares|cram[eé]r.rao|maximum likelihood|normal equations|fisher information|estimator",
 "Bayes rule, conditional probability": r"bayes|posterior|prior|conditional probability",
 "Gaussian, CLT, random variables": r"gaussian|normal distribution|central limit|random variable|variance|probability density",
 "Random processes, PSD, correlation": r"random process|stochastic process|power spectral density|autocorrelation|wiener.khinchin|stationary",
 "Entropy, capacity, coding": r"entropy|channel capacity|shannon|mutual information|error.correct|coding rate",
 "Modulation, BER, spread spectrum": r"modulation|bit error|\bber\b|\bbpsk\b|\bqpsk\b|spread spectrum|frequency hopp|\bofdm\b|\bcdma\b",
 "Optimization: convex, duality, Lagrange": r"convex|duality|lagrange multiplier|kkt|linear program|objective function|constraint",
 "Linear algebra: SVD, eigendecomposition, projections": r"singular value|\bsvd\b|eigenvector|orthogonal projection|qr (factori|decompos)|rank",
 "ODEs, harmonic oscillator, resonance": r"harmonic oscillator|resonan|damping ratio|natural frequency|second.order (system|differential)|differential equation",
 "Kepler, orbits, vis-viva": r"kepler|orbital (period|element|velocity)|semimajor|perigee|apogee|vis.viva|ground track|inclination",
 "Rocket equation, propulsion, specific impulse": r"rocket equation|specific impulse|\bisp\b|thrust|propellant|delta.v|mass ratio",
 "Rigid-body kinematics, frames, Euler angles": r"euler angle|quaternion|rotation matrix|coordinate (frame|system)|direction cosine|angular velocity",
 "Proportional navigation / guidance laws": r"proportional navigation|navigation (constant|ratio)|line.of.sight rate|miss distance|pursuit guidance|\bpn\b",
 "Lift, drag, aerodynamics": r"lift coefficient|drag coefficient|\bc_?l\b|\bc_?d\b|airfoil|induced drag|lift.to.drag|dynamic pressure",
 "Atmosphere, Mach, compressible flow": r"standard atmosphere|mach number|shock wave|supersonic|hypersonic|compressib",
 "Thermodynamics: laws, cycles, entropy": r"first law|second law|carnot|enthalpy|thermodynamic|isentropic|brayton|rankine",
 "Heat transfer: conduction/convection/radiation": r"conduction|convection|heat flux|thermal conductivity|heat transfer coefficient|fourier.s law",
 "Blackbody radiation, radiometry, IR": r"blackbody|black body|planck|stefan.boltzmann|wien|radiance|irradiance|emissivity|radiometr",
 "Optics: imaging, MTF, diffraction limit": r"\bmtf\b|optical transfer|airy|diffraction.limited|f.number|focal length|point spread",
 "Stress, strain, beams, buckling": r"stress|strain|bending moment|buckling|young.s modulus|shear force|deflection",
 "Penetration, armor, warheads, lethality": r"penetrat|armou?r|warhead|fragment|blast|lethal|kill probability|vulnerab",
 "GNSS pseudorange, DOP, positioning": r"pseudorange|dilution of precision|\bgdop\b|\bpdop\b|\bgps\b|\bgnss\b|ephemeris",
 "Inertial navigation, gyros, accelerometers": r"inertial navigation|gyro|accelerometer|strapdown|\bimu\b|\bins\b",
 "Direction finding, emitter location, TDOA": r"direction finding|\btdoa\b|\bfdoa\b|emitter location|triangulat|angle of arrival|interferometer",
 "Jamming, J/S, burn-through, deception": r"jamm|\bj/s\b|burn.through|deception|\bdrfm\b|range gate pull|chaff|decoy|spoof",
 "Neural nets, backprop, classification": r"neural network|backpropagation|gradient descent|classifier|convolutional|softmax|cross.entropy loss",
 "Multi-target tracking, data association": r"data association|multi.?target|track initiation|gating|\bjpda\b|\bmht\b|track.to.track",
 "Lanchester / attrition / combat models": r"lanchester|attrition|salvo|combat model|square law",
 "Systems engineering: requirements, trades, V&V": r"requirement|trade stud|verification|validation|concept of operations|conops|system architecture",
}
RX = {k: re.compile(v, re.I) for k, v in RES.items()}
WORDS = re.compile(r"[A-Za-z][A-Za-z'\-]+")

def unit_text(u):
    pg = S.TEXT[u["app"]].get(u["doc"], {})
    return "\n".join(pg.get(p, "") for p in range(u["a"], min(u["b"], u["a"] + 40) + 1))

assign = []
for u in units:
    t = unit_text(u); nw = max(1, len(WORDS.findall(t)))
    best = None
    for k, rx in RX.items():
        h = len(rx.findall(t)); dens = 1000 * h / nw
        title = bool(rx.search(u["title"]))
        if title or (h >= 4 and dens >= 2.5):
            score = dens + (50 if title else 0)
            if not best or score > best[0]: best = (score, k, title)
    if best:
        assign.append(dict(u, result=best[1], words=nw, title_match=best[2]))

mods = {(a, m["id"]): i + (0 if a == "eng" else 10000) for a in S.APPS for i, m in enumerate(S.APPS[a]["modules"])}
by = collections.defaultdict(lambda: collections.defaultdict(lambda: dict(pages=0, words=0, sections=0)))
for x in assign:
    o = by[x["result"]][(x["app"], x["mod"], x["tier"])]
    o["pages"] += x["pages"]; o["words"] += x["words"]; o["sections"] += 1

rows = []
for r, d in by.items():
    items = sorted(d.items(), key=lambda kv: mods[(kv[0][0], kv[0][1])])
    # primary = first module in curriculum order with >= 3 pages on r (the place it is really taught)
    prim = next((k for k, v in items if v["pages"] >= 3), items[0][0])
    rep = [(k, v) for k, v in items if k != prim]
    rows.append(dict(result=r, n_modules=len(items),
        eng=[f"{k[1]}({v['pages']})" for k, v in items if k[0] == "eng"],
        mil=[f"{k[1]}({v['pages']})" for k, v in items if k[0] == "mil"],
        primary=f"{prim[0]}:{prim[1]}", total_pages=sum(v["pages"] for _, v in items),
        primary_pages=d[prim]["pages"],
        repeat_pages=sum(v["pages"] for _, v in rep),
        repeat_pages_core=sum(v["pages"] for k, v in rep if k[2] == "core"),
        cross_app=len({k[0] for k, _ in items}) > 1,
        repeat_pages_cross=sum(v["pages"] for k, v in rep if k[0] != prim[0]),
        repeat_words=sum(v["words"] for _, v in rep)))
rows.sort(key=lambda r: -r["repeat_pages"])
tot_content = sum(u["pages"] for u in units)
assigned = sum(x["pages"] for x in assign)
rep = sum(r["repeat_pages"] for r in rows); rep_core = sum(r["repeat_pages_core"] for r in rows)
rep_cross = sum(r["repeat_pages_cross"] for r in rows)
print(f"content section pages {tot_content}; dominated by one of {len(RES)} results: {assigned} ({assigned/tot_content:.0%})")
print(f"repeat pages (non-primary modules) {rep} ({rep/tot_content:.1%}); in core tier {rep_core}; cross-app {rep_cross}")
for d in (0.2, 0.3, 0.4):
    print(f"  delta-lesson factor {d}: saved pages = {rep*(1-d):.0f} ({rep*(1-d)/tot_content:.1%} of content pages)")
print()
for r in rows:
    print(f"{r['result'][:50]:50s} mods={r['n_modules']:3d} prim={r['primary']:10s} pp={r['primary_pages']:4d} rep={r['repeat_pages']:4d} cross={r['repeat_pages_cross']:4d}")
json.dump(assign, open(os.path.join(CACHE, "A1_assign.json"), "w"), ensure_ascii=False)
json.dump(dict(rows=rows, total_content_pages=tot_content, assigned_pages=assigned, repeat=rep,
               repeat_core=rep_core, repeat_cross=rep_cross), open(os.path.join(CACHE, "A1_results.json"), "w"), ensure_ascii=False, indent=1)
