"""Step 3b-5: fit CR and K/S/C predictors on the hand-counted sample, cross-validate, apply to every unit,
mark engineering overlap / test-out, write S_mil_registry.json and print totals (-> S_mil_model.out)."""
import json, os, re, math, random
import numpy as np
from collections import defaultdict, Counter
H = os.path.dirname(os.path.abspath(__file__))
import importlib.util
spec = importlib.util.spec_from_file_location("cnt", os.path.join(H, "S_mil_counts.py")); cnt = importlib.util.module_from_spec(spec); spec.loader.exec_module(cnt)
units = json.load(open(os.path.join(H, "S_mil_units_f.json")))
uid2 = {u["uid"]: u for u in units}
sample_ids = json.load(open(os.path.join(H, "S_mil_sample.json")))
ENG = json.load(open("/home/user/repo-exercise/library/engineering/syllabus/syllabus.json"))
TYPES = ["theory", "derivation", "examples", "history", "doctrine", "descriptive", "summary", "problems", "appendix"]

def feats(u):
    f = u["f"]; t = u["type"]
    return [1.0, math.log(u["pages"]), min(f["eq_pp"], 12) / 4, min(f["law_pp"], 8) / 4, min(f["ex_pp"], 4),
            min(f["doctr_pp"], 20) / 10, min(f["years_pp"], 15) / 5, min(u.get("nsub", 0), 12) / 6,
            1.0 * (t in ("theory", "derivation", "examples")), 1.0 * (t in ("summary", "problems", "appendix")),
            1.0 * (t == "history" or t == "doctrine")]

def fit_pois(X, y, expo, lam=1.0, it=60):
    b = np.zeros(X.shape[1]); b[0] = math.log(max(y.sum(), 0.5) / expo.sum())
    for _ in range(it):
        eta = X @ b + np.log(expo); mu = np.exp(np.clip(eta, -20, 8))
        W = mu; z = (eta - np.log(expo)) + (y - mu) / np.maximum(mu, 1e-9)
        A = X.T @ (X * W[:, None]) + lam * np.diag([0] + [1] * (X.shape[1] - 1))
        b = np.linalg.solve(A, X.T @ (W * z))
    return b

def pred(b, X, expo):
    return np.exp(np.clip(X @ b + np.log(expo), -20, 8))

S = [uid2[i] for i in sample_ids]
assert len(S) == len(cnt.COUNTS)
Y = np.array([[c[1], c[2], c[3], c[4], c[5]] for c in cnt.COUNTS], float)  # CR K S C dup
X = np.array([feats(u) for u in S]); E = np.array([u["pages"] for u in S], float)
NAMES = ["CR", "K", "S", "C"]
out = []
def P(*a):
    s = " ".join(str(x) for x in a); print(s); out.append(s)

P("== sample:", len(S), "units,", int(E.sum()), "pages; docs", len({u['doc'] for u in S}), "; types", dict(Counter(u['type'] for u in S)))
P("observed totals CR/K/S/C/dup:", Y.sum(0).tolist(), " per page:", np.round(Y.sum(0) / E.sum(), 3).tolist())
# classifier accuracy against hand retyping
P("classifier: hand re-typed", len(cnt.RETYPE), "of", len(S), "units -> type accuracy", round(1 - len(cnt.RETYPE) / len(S), 2))

# --- cross-validation: model vs per-type-rate baseline
def type_rate_fit(Ss, Ys, Es):
    r = defaultdict(lambda: [0, 0])
    for u, y, e in zip(Ss, Ys, Es):
        r[u["type"]][0] += y; r[u["type"]][1] += e
    glob = sum(v[0] for v in r.values()) / sum(v[1] for v in r.values())
    return {k: (v[0] + glob * 3) / (v[1] + 3) for k, v in r.items()}, glob
cv = {}
rng = random.Random(7)
for j, nm in enumerate(NAMES):
    errs_m, errs_b, tot_m, tot_b, tot_o = [], [], [], [], []
    for rep in range(20):
        idx = list(range(len(S))); rng.shuffle(idx)
        folds = [idx[k::5] for k in range(5)]
        for fo in folds:
            tr = [i for i in idx if i not in fo]
            b = fit_pois(X[tr], Y[tr, j], E[tr])
            pm = pred(b, X[fo], E[fo])
            tr_rate, g = type_rate_fit([S[i] for i in tr], Y[tr, j], E[tr])
            pb = np.array([tr_rate.get(S[i]["type"], g) * E[i] for i in fo])
            errs_m += list(np.abs(pm - Y[fo, j])); errs_b += list(np.abs(pb - Y[fo, j]))
            tot_m.append(pm.sum()); tot_b.append(pb.sum()); tot_o.append(Y[fo, j].sum())
    tot_o = np.array(tot_o); rel_m = (np.array(tot_m) - tot_o) / np.maximum(tot_o, 1); rel_b = (np.array(tot_b) - tot_o) / np.maximum(tot_o, 1)
    cv[nm] = dict(mae_unit_model=round(float(np.mean(errs_m)), 2), mae_unit_typerate=round(float(np.mean(errs_b)), 2),
                  fold_total_relerr_rms_model=round(float(np.sqrt(np.mean(rel_m ** 2))), 3),
                  fold_total_relerr_rms_typerate=round(float(np.sqrt(np.mean(rel_b ** 2))), 3),
                  fold_total_bias_model=round(float(np.mean(rel_m)), 3), mean_obs_per_unit=round(float(Y[:, j].mean()), 2))
    P(f"CV {nm}:", cv[nm])
# scale: a fold holds ~19 units / ~93 pages; error on the full ~1,400-unit total shrinks ~ sqrt(n) for noise,
# but not for bias, so report the bias term separately as the floor.

# --- final fits on all sample units
B = {nm: fit_pois(X, Y[:, j], E) for j, nm in enumerate(NAMES)}
# dup share of K+S by overlap flag (measured)
TOPICS = {
 "signals": r"fourier|spectr|filter|sampling|modulat|convolution|impulse response|matched filter|z-transform|dft|fft|lsi|mtf|transfer function|correlat|noise",
 "probability": r"probabilit|statistic|random|gaussian|detection theory|false alarm|cfar|swerling|bayes|distribution|monte carlo|search theory",
 "em_antennas": r"antenna|propagat|maxwell|electromagnetic|wave|aperture|diffraction|optic|lens|polariz|radiometr|refraction|scatter|rcs|cross.section|em physics|atmospher",
 "control": r"control|autopilot|guidance law|feedback|stabili|servo|loop|proportional navigation|pid|missile model",
 "estimation": r"kalman|track|estimat|least squares|particle filter|covariance|observer|imm|data association|fusion",
 "optimization": r"optimi|linear program|game theory|lagrang|allocation|search",
 "mechanics": r"equations of motion|kinematic|two-body|orbit|kepler|aerodynamic|drag|lift|climb|flight mechanic|propulsion|rocket equation|ballistic",
}
eng_titles = [(m["id"], (m.get("en") or "") + " " + m.get("title", "")) for m in ENG["modules"]]
eng_by_topic = {k: [i for i, t in eng_titles if re.search(v, t, re.I)] for k, v in TOPICS.items()}
def topics(u):
    s = " ".join([u["title"], u["mtitle"], u["snote"]])
    return [k for k, v in TOPICS.items() if re.search(v, s, re.I) and eng_by_topic[k]]
ov = np.array([1 if topics(u) else 0 for u in S])
ks = Y[:, 1] + Y[:, 2]
dup_share = {1: float(Y[ov == 1, 4].sum() / max(ks[ov == 1].sum(), 1)), 0: float(Y[ov == 0, 4].sum() / max(ks[ov == 0].sum(), 1))}
P("eng-overlap flag on sample:", int(ov.sum()), "units; measured dup share of K+S: flagged", round(dup_share[1], 2), "unflagged", round(dup_share[0], 2))
P("eng modules per topic:", {k: len(v) for k, v in eng_by_topic.items()})

TESTOUT_T = {"doctrine", "history", "descriptive"}
def testout(u):
    return u["type"] in TESTOUT_T and u["f"]["eq_pp"] < 0.5 and (u["doc"].startswith("D") or u["doc"] in ("B08", "B09", "B07", "B11", "B04", "B01") or u["f"]["doctr_pp"] >= 2)

# --- SMAD (image-only): use rates measured on sampled units of the same type in design-handbook books
smad_rate = {}
ref = [i for i, u in enumerate(S) if u["doc"] in ("B05", "B06", "B07", "B09", "B03")]
for t in ("theory", "descriptive", "appendix"):
    ii = [i for i in ref if S[i]["type"] == t] or ref
    smad_rate[t] = (Y[ii, :4].sum(0) / E[ii].sum()).tolist()
P("SMAD per-page rates CR/K/S/C used (theory, descriptive):", [round(x, 3) for x in smad_rate["theory"]], [round(x, 3) for x in smad_rate["descriptive"]])

# --- internal page repeats (same pages in two Lanchester modules)
covered = defaultdict(set)
reg = []
for u in units:
    pg = set(range(u["p0"], u["p1"] + 1))
    rep = len(pg & covered[u["doc"]]) / len(pg)
    covered[u["doc"]] |= pg
    if u["doc"] == "B12":
        r = smad_rate.get(u["type"], smad_rate["theory"]); p = [x * u["pages"] for x in r]
    else:
        x = np.array([feats(u)]); p = [float(pred(B[nm], x, np.array([u["pages"]]))[0]) for nm in NAMES]
    tp = topics(u)
    dup = dup_share[1 if tp else 0] * (p[1] + p[2])
    reg.append(dict(uid=u["uid"], module=u["module"], tier=u["tier"], part=u["part"], role=u["role"], doc=u["doc"],
                    num=u["num"], title=u["title"], p0=u["p0"], p1=u["p1"], pages=u["pages"], nsub=u.get("nsub", 0),
                    method=u["method"], type=u["type"], flags=u["flag"],
                    cr=round(p[0], 2), K=round(p[1], 2), S=round(p[2], 2), C=round(p[3], 2),
                    eng_overlap=tp, eng_dup_KS=round(dup, 2), delta=bool(tp), internal_repeat=round(rep, 2),
                    testout_candidate=testout(u), sampled=u["uid"] in sample_ids))
# replace predictions by observed counts for sampled units
obs = {sample_ids[i]: Y[i] for i in range(len(S))}
for r in reg:
    if r["uid"] in obs:
        y = obs[r["uid"]]; r.update(cr=float(y[0]), K=float(y[1]), S=float(y[2]), C=float(y[3]), eng_dup_KS=float(y[4]), observed=True)

# --- totals
def tot(rows, w_supp=1.0, dedup=False):
    a = np.zeros(6)
    for r in rows:
        w = (w_supp if r["role"] == "supp" else 1.0) * ((1 - r["internal_repeat"]) if dedup else 1.0)
        k, s = r["K"], r["S"]
        if dedup:  # eng duplicates become delta items: remove them pro rata from K and S
            f = 1 - r["eng_dup_KS"] / max(k + s, 1e-9) if k + s > 0 else 1
            k, s = k * f, s * f
        a += w * np.array([1, r["pages"], r["cr"] * (1 - (r["eng_dup_KS"] / max(r["K"] + r["S"], 1e-9) if dedup and r["K"] + r["S"] > 0 else 0)), k, s, r["C"]])
    return a
P("\n== REGISTRY: units", len(reg), "pages", sum(r["pages"] for r in reg), "| methods", dict(Counter(r["method"].split("+")[0] for r in reg)))
P("flags:", dict(Counter(f for r in reg for f in r["flags"])))
P("\n-- by type (all tiers, main+supp, raw): units / pages / CR / K / S / C")
for t in TYPES:
    a = tot([r for r in reg if r["type"] == t]); P(f"{t:12s}", int(a[0]), int(a[1]), *[round(x) for x in a[2:]])
summary = {}
for lab, w, dd in [("raw", 1.0, False), ("supp0.5", 0.5, False), ("dedup", 1.0, True), ("dedup_supp0.5", 0.5, True)]:
    P(f"\n-- by tier [{lab}]: units / pages / CR / K / S / C")
    summary[lab] = {}
    for tier in ("core", "adv", "ref", "all"):
        rows = [r for r in reg if tier == "all" or r["tier"] == tier]
        a = tot(rows, w, dd); summary[lab][tier] = [round(float(x), 1) for x in a]
        P(f"{tier:5s}", int(a[0]), round(a[1]), *[round(x) for x in a[2:]])
# R8/R10 page-based comparison (same scope: main + supp; R8 density core 0.126, adv 0.112, ref 0.112;
# R8's net factor x0.87 for selection bias; R10 Lanchester core K/S/C 0.21/0.18/0.22 per page, also x0.87)
P("\n-- page-based estimates for the same scope (main + 0.5 supp, R8/R10 convention)")
R8D = {"core": 0.126, "adv": 0.112, "ref": 0.112}
for tier in ("core", "adv", "ref"):
    rows = [r for r in reg if r["tier"] == tier]
    pe = sum(r["pages"] * (0.5 if r["role"] == "supp" else 1) for r in rows)
    me = summary["supp0.5"][tier]
    P(f"{tier}: eff pages {pe:.0f} | R8 CR {R8D[tier]*pe:.0f} (x0.87: {R8D[tier]*pe*0.87:.0f}) vs registry CR {me[2]:.0f}"
      f" | R10 K/S/C {0.21*pe*.87:.0f}/{0.18*pe*.87:.0f}/{0.22*pe*.87:.0f} vs registry {me[3]:.0f}/{me[4]:.0f}/{me[5]:.0f}")
# overlap and test-out summaries
P("\n-- engineering overlap (delta sections)")
for k in TOPICS:
    rows = [r for r in reg if k in r["eng_overlap"]]
    P(f"{k:12s} units {len(rows):4d} pages {sum(r['pages'] for r in rows):5d} K+S {sum(r['K']+r['S'] for r in rows):6.0f} dupKS {sum(r['eng_dup_KS'] for r in rows):5.0f}")
d = [r for r in reg if r["delta"]]
P("any-overlap delta units", len(d), "pages", sum(r["pages"] for r in d), "dup K+S", round(sum(r["eng_dup_KS"] for r in reg)), "of K+S", round(sum(r["K"] + r["S"] for r in reg)))
t = [r for r in reg if r["testout_candidate"]]
P("test-out candidates (operational/doctrine/descriptive, strong-military-background):", len(t), "units", sum(r["pages"] for r in t), "pages; CR", round(sum(r["cr"] for r in t)), "K", round(sum(r["K"] for r in t)), "S", round(sum(r["S"] for r in t)), "C", round(sum(r["C"] for r in t)))
P("internal repeats: pages", round(sum(r["pages"] * r["internal_repeat"] for r in reg)))
# per-module rollup
mods = defaultdict(lambda: dict(units=0, pages=0, cr=0, K=0, S=0, C=0))
for r in reg:
    m = mods[r["module"]]; m["units"] += 1; m["pages"] += r["pages"]
    for k in ("cr", "K", "S", "C"): m[k] = round(m[k] + r[k], 2)
json.dump(dict(meta=dict(scope="Lanchester (library/military) modules, main+supp sources; articles and B14-B17 refs excluded",
                         rubric="R8 strict CR; R10 K/S/C", sample=len(S), cv=cv, dup_share=dup_share,
                         eng_modules_by_topic=eng_by_topic, totals=summary),
               modules=mods, units=reg), open(os.path.join(H, "S_mil_registry.json"), "w"), ensure_ascii=False, indent=0)
open(os.path.join(H, "S_mil_model.out"), "w").write("\n".join(out))

# --- bootstrap CI of the registry totals (resample the 96 hand-counted units, refit, re-predict all non-SMAD units)
rng2 = np.random.default_rng(11)
nonsmad = [u for u in units if u["doc"] != "B12"]
XA = np.array([feats(u) for u in nonsmad]); EA = np.array([u["pages"] for u in nonsmad], float)
smad_pages = {t: sum(u["pages"] for u in units if u["doc"] == "B12" and u["type"] == t) for t in ("theory", "descriptive", "appendix")}
boots = []
for bi in range(300):
    ii = rng2.integers(0, len(S), len(S))
    row = []
    for j, nm in enumerate(NAMES):
        b = fit_pois(X[ii], Y[ii, j], E[ii], it=30)
        row.append(pred(b, XA, EA).sum() + sum(smad_pages[t] * smad_rate[t][j] for t in smad_pages))
    boots.append(row)
boots = np.array(boots)
P("\n-- bootstrap (300x) of all-tier raw totals, P10/P50/P90:")
for j, nm in enumerate(NAMES):
    P(nm, np.round(np.percentile(boots[:, j], [10, 50, 90])).tolist())
P("subsections (X.Y.Z heads inside units):", sum(r["nsub"] for r in reg), "; numbered units", sum(1 for r in reg if r["num"]))
# K at R10 granularity: R10 found 37 K vs 24 strict CR on the same pages (x1.54), the extra K coming out of S
ka = summary["raw"]["all"]
P("K re-based to R10 granularity (x1.54 of strict, moved from S): K", round(ka[3] * 1.54), "S", round(ka[4] - ka[3] * 0.54), "C", round(ka[5]))
kd = summary["dedup_supp0.5"]["all"]
P("same, dedup + supp0.5: K", round(kd[3] * 1.54), "S", round(kd[4] - kd[3] * 0.54), "C", round(kd[5]))
dens = {}
for grp, ts in [("math-bearing (theory/derivation/examples)", ("theory", "derivation", "examples")), ("narrative (history/doctrine/descriptive)", ("history", "doctrine", "descriptive")), ("aux (summary/problems/appendix)", ("summary", "problems", "appendix"))]:
    rows = [r for r in reg if r["type"] in ts and r["doc"] != "B12"]
    pg = sum(r["pages"] for r in rows)
    P(f"density {grp}: pages {pg}, CR/page {sum(r['cr'] for r in rows)/pg:.3f}, K+S/page {sum(r['K']+r['S'] for r in rows)/pg:.3f}, C/page {sum(r['C'] for r in rows)/pg:.3f}")
open(os.path.join(H, "S_mil_model.out"), "w").write("\n".join(out))
