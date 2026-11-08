"""R10: the item inventory re-extracted from the 14 R8 samples (R8_samples/), at LIBERAL granularity
plus the definitions R8 folded into its CRs, so that every taught item is on the list.

Each item:  id, name, kind, regex (for textual fan-out), projects (A6 ids that use it), rater A label,
            and the feature codes used by rater B (F3..F6). F1 (fan-out) and F2 (project use) are computed
            or taken from A6, not judged here.

kind:  DEF definition / notation   RES result, law, theorem   MOD model / method   FACT descriptive fact,
       taxonomy, worked example, typical number
Rater A ("holistic"): one pass, item by item, asking only "what must an authority be able to DO with this?"
            K = wield it (judgement, estimate, critique, transfer); S = follow and check it (it serves a K);
            C = read it (definition, taxonomy, example, fact).
Rater B ("feature rule"): codes four yes/no questions per item, then a fixed rule (R10_classify.py):
   F3 judgement   : would an authority invoke it in an engineering / operational judgement, design trade,
                    or a claims check (a number or a go/no-go)?
   F4 structure   : does the same mathematical structure carry real weight in >= 2 other fields?
   F5 serves      : is it a step, lemma, special case or extension of another item on this list?
   F6 descriptive : is it a definition, notation, taxonomy, worked example or descriptive fact?
Rater A labels were written first, for the whole list; F3-F6 were coded in a second pass over the
item names and sample text, without the A column in view (same person, so 'independent' is simulated;
see R10_tiers.md s2.4 for what that does and does not show).
"""

# (id, sample, kind, name, regex, projects, A, F3, F4, F5, F6)
ITEMS = [
 # S1  K2 127-142, calculus of variations (Gilua M8.13)
 ('1.1', 'S1', 'DEF', 'functional; variational problem (admissible functions, boundary conditions)', r'\bfunctional\b|calculus of variations|variational (problem|principle|method)', [], 'S', 0, 1, 1, 1),
 ('1.2', 'S1', 'FACT', 'brachistochrone problem; solution is a cycloid', r'brachistochron|cycloid', [], 'C', 0, 0, 1, 1),
 ('1.3', 'S1', 'RES', 'fundamental lemma of the calculus of variations', r'fundamental lemma', [], 'S', 0, 0, 1, 0),
 ('1.4', 'S1', 'RES', 'Euler(-Lagrange) equation for the simplest functional', r'euler.?lagrange|euler.s equation|lagrangian', ['P06'], 'K', 1, 1, 0, 0),
 ('1.5', 'S1', 'RES', 'Euler system for functionals of several functions', r'euler system|system of euler', [], 'S', 0, 0, 1, 0),
 ('1.6', 'S1', 'RES', 'Hamilton / Ostrogradsky principle of stationary action', r'least action|hamilton.s principle|action integral|stationary action|principle of least', [], 'K', 0, 1, 0, 0),
 ('1.7', 'S1', 'RES', 'Euler-Ostrogradsky equation for multiple integrals (minimal surface, membrane PDE)', r'ostrogradsk|minimal surface', [], 'S', 0, 1, 1, 0),
 ('1.8', 'S1', 'MOD', 'small-deformation membrane energy (area ~ 1 + |grad u|^2 / 2), Dirichlet integral', r'dirichlet (integral|principle|energy)|membrane', [], 'S', 0, 0, 1, 0),
 # S2  F1 ch 23-24, resonance and transients (Gilua M3.2)
 ('2.1', 'S2', 'MOD', 'complex-exponential (phasor) method for linear ODEs, and its linearity condition', r'phasor|complex exponential|complex amplitude|complex impedance', ['P09', 'P19'], 'K', 1, 1, 0, 0),
 ('2.2', 'S2', 'RES', 'undamped forced response x ~ F/m(w0^2 - w^2)', r'forced (harmonic )?oscillat|undamped', [], 'S', 0, 0, 1, 0),
 ('2.3', 'S2', 'RES', 'damped forced response: amplitude rho(w) and phase theta(w)', r'frequency response|forced damped|steady.state response|amplitude response', ['P11'], 'K', 1, 1, 0, 0),
 ('2.4', 'S2', 'RES', 'resonance width gamma and Q = w0/gamma (incl. energy definition of Q)', r'\bq.factor|quality factor|high.q\b|resonance (width|curve|peak)|half.power (band|point|frequenc)', [], 'K', 1, 1, 0, 0),
 ('2.5', 'S2', 'RES', 'LRC analogue: impedance Z = R + iwL + 1/(iwC)', r'impedance', ['P19'], 'K', 1, 1, 0, 0),
 ('2.6', 'S2', 'FACT', 'resonances in nature (atmospheric tide, NaCl absorption, nuclear lines)', r'atmospheric tide|resonance absorption|m.ssbauer', [], 'C', 0, 0, 0, 1),
 ('2.7', 'S2', 'RES', 'stored energy and mean absorbed power of a forced oscillator', r'mean power|power absorbed|absorbed power|energy stored|stored energy', [], 'S', 0, 1, 1, 0),
 ('2.8', 'S2', 'RES', 'free damped (underdamped) transient: decay gamma/2, shifted frequency', r'damped oscillation|damping ratio|underdamped|transient response|decays? exponentially', ['P11'], 'K', 1, 1, 0, 0),
 ('2.9', 'S2', 'RES', 'overdamped and critically damped cases', r'overdamped|critically damped|critical damping', [], 'S', 0, 0, 1, 0),
 ('2.10', 'S2', 'MOD', 'fitting the transient to initial conditions x0, v0', r'initial conditions', [], 'C', 0, 0, 1, 1),
 ('2.11', 'S2', 'FACT', 'electrical transient on the oscilloscope (LC ringing) as a check', r'ringing|oscilloscope', [], 'C', 0, 0, 1, 1),
 # S3  E01 316-330, CTFT 4.1-4.2 (Gilua M4.5)
 ('3.1', 'S3', 'RES', 'CTFT analysis/synthesis pair as the limit of the Fourier series', r'fourier transform', ['P02', 'P09', 'P19'], 'K', 1, 1, 0, 0),
 ('3.2', 'S3', 'RES', 'convergence: finite energy / Dirichlet conditions, midpoint at jumps (Gibbs)', r'dirichlet condition|gibbs|finite energy', [], 'S', 0, 0, 1, 0),
 ('3.3', 'S3', 'RES', 'e^{-at}u(t) <-> 1/(a + jw): first-order low-pass, magnitude and phase', r'first.order (system|low.?pass|filter|lag)|time constant', [], 'S', 0, 1, 1, 0),
 ('3.4', 'S3', 'RES', 'rect <-> sinc and the inverse time-bandwidth relation', r'\bsinc\b|time.bandwidth|rectangular pulse', ['P02', 'P19'], 'K', 1, 1, 0, 0),
 ('3.5', 'S3', 'RES', 'duality; ideal low-pass impulse response is a sinc', r'\bduality\b|ideal low.?pass', [], 'S', 0, 1, 1, 0),
 ('3.6', 'S3', 'RES', 'FT of a periodic signal = impulses 2*pi*a_k at k*w0', r'transform of (a |the )?periodic|line spectrum|impulses? in (the )?frequency', [], 'S', 0, 0, 1, 0),
 ('3.7', 'S3', 'RES', 'impulse train <-> impulse train (the sampling comb)', r'impulse train|sampling function|dirac comb', [], 'S', 0, 1, 1, 0),
 ('3.8', 'S3', 'FACT', 'standard pairs: two-sided exponential, impulse, sin, cos', r'two.sided exponential|transform of (sin|cos)', [], 'C', 0, 0, 1, 1),
 # S4  E05 64-75, Wasserman ch 3 (Gilua M6.2)
 ('4.1', 'S4', 'DEF', 'expectation: definition, existence (int |x| dF < inf), linearity', r'expected value|expectation', ['P04', 'P05'], 'K', 1, 1, 0, 0),
 ('4.2', 'S4', 'RES', 'LOTUS; probability as the expectation of an indicator', r'lazy statistician|indicator function', [], 'S', 0, 0, 1, 0),
 ('4.3', 'S4', 'DEF', 'k-th moment, central moment, existence of lower moments', r'central moment|k.th moment|moments? exist', [], 'C', 0, 0, 1, 1),
 ('4.4', 'S4', 'RES', 'E(prod X_i) = prod E(X_i) for independent variables', r'product of (the )?expectations|e\(xy\)', [], 'S', 0, 0, 1, 0),
 ('4.5', 'S4', 'RES', 'variance: definition and algebra V(aX+b) = a^2 V, V = E X^2 - mu^2', r'variance', ['P04', 'P05', 'P07'], 'K', 1, 1, 0, 0),
 ('4.6', 'S4', 'RES', 'sample mean: E = mu, V = sigma^2/n; E S^2 = sigma^2', r'sample mean|standard error|square root of n|sqrt\(n\)', ['P02', 'P05'], 'K', 1, 1, 0, 0),
 ('4.7', 'S4', 'DEF', 'covariance and correlation; |rho| <= 1; independence => rho = 0, not conversely', r'covariance|correlation coefficient', [], 'S', 0, 1, 1, 0),
 ('4.8', 'S4', 'RES', 'V(X+Y) = V X + V Y + 2 Cov', r'variance of (a|the) sum', [], 'S', 0, 0, 1, 0),
 ('4.9', 'S4', 'FACT', 'table of means and variances of common distributions', r'binomial|poisson|exponential distribution|gamma distribution', [], 'C', 0, 0, 0, 1),
 ('4.10', 'S4', 'RES', 'random vectors: mean vector, covariance matrix, V(a^T X), V(AX) = A Sigma A^T', r'covariance matrix|random vector', ['P07', 'P10'], 'K', 1, 1, 0, 0),
 ('4.11', 'S4', 'FACT', 'multinomial covariance (worked example)', r'multinomial', [], 'C', 0, 0, 1, 1),
 ('4.12', 'S4', 'RES', 'conditional expectation as a random variable; iterated expectations', r'conditional expectation|iterated expectation', ['P07'], 'K', 1, 1, 0, 0),
 ('4.13', 'S4', 'RES', 'law of total variance; hierarchical model (county example)', r'total variance|hierarchical model', [], 'S', 0, 0, 1, 0),
 ('4.14', 'S4', 'MOD', 'moment generating function: moments by derivatives, uniqueness, sums', r'moment generating|characteristic function', [], 'S', 0, 1, 1, 0),
 ('4.15', 'S4', 'FACT', 'sum of independent Poissons is Poisson (example)', r'sum of (two )?independent poisson', [], 'C', 0, 0, 1, 1),
 # S5  B02 96-110, radar range equation (Lanchester M2.2)
 ('5.1', 'S5', 'RES', 'spreading: power density P_t G / 4 pi R^2 (EIRP, one-way link)', r'power density|spreading loss|free.space (path )?loss|friis|\beirp\b', ['P01', 'P03', 'P12'], 'K', 1, 1, 0, 0),
 ('5.2', 'S5', 'RES', 'antenna gain, directivity, effective aperture A_e = G lambda^2 / 4 pi, efficiency 0.5-0.8', r'effective aperture|effective area|antenna gain|directivity', ['P01', 'P03', 'P13'], 'K', 1, 1, 0, 0),
 ('5.3', 'S5', 'DEF', 'radar cross section sigma', r'radar cross.section|\brcs\b', ['P02', 'P12', 'P14'], 'K', 1, 1, 0, 1),
 ('5.4', 'S5', 'RES', 'radar range equation, P_r ~ R^-4', r'radar (range )?equation|fourth power of (the )?range', ['P02', 'P03', 'P12', 'P14'], 'K', 1, 1, 0, 0),
 ('5.5', 'S5', 'RES', 'thermal noise k T0 F B, noise figure, external noise below 1 GHz', r'noise figure|thermal noise|\bktb\b|noise temperature', ['P01', 'P02'], 'K', 1, 1, 0, 0),
 ('5.6', 'S5', 'RES', 'SNR form of the RRE; maximum detection range for a required SNR', r'maximum (detection )?range|detection range', [], 'S', 1, 0, 1, 0),
 ('5.7', 'S5', 'RES', 'coherent vs non-coherent integration gain (n_p vs ~sqrt n_p)', r'coherent integration|non.?coherent integration|integration gain|processing gain', ['P02'], 'K', 1, 1, 0, 0),
 ('5.8', 'S5', 'MOD', 'loss budget: transmit, atmospheric (rain 0.8 dB/km), processing losses', r'atmospheric (loss|attenuation)|system loss|loss budget|rain (loss|attenuation)', [], 'S', 1, 0, 1, 0),
 ('5.9', 'S5', 'FACT', 'Doppler-filter straddle loss', r'straddl', [], 'C', 0, 0, 1, 1),
 ('5.10', 'S5', 'FACT', 'CFAR loss: threshold set above optimum', r'cfar loss', [], 'C', 0, 0, 1, 1),
 ('5.11', 'S5', 'RES', 'average-power / energy form of the RRE (energy on target)', r'average power|energy on (the )?target|search radar equation|power.aperture', [], 'S', 1, 0, 1, 0),
 ('5.12', 'S5', 'DEF', 'RRE written in dB (sum of terms)', r'decibel|in db\b', [], 'C', 0, 0, 1, 1),
 ('5.13', 'S5', 'FACT', 'search vs track radar modes', r'search mode|track mode|track.while.scan', [], 'C', 0, 0, 0, 1),
 # S6  B01 199-212, jamming (Lanchester M4.7)
 ('6.1', 'S6', 'FACT', 'jamming taxonomy: comms/radar, cover/deceptive, self-protection/stand-off', r'self.protection jamm|stand.off jamm|cover jamm|decept\w* jamm|escort jamm', [], 'C', 0, 0, 0, 1),
 ('6.2', 'S6', 'RES', 'J/S for comms and radar; the R^2 vs R^4 asymmetry', r'\bj/s\b|jamming.to.signal', ['P03', 'P12'], 'K', 1, 1, 0, 0),
 ('6.3', 'S6', 'RES', 'link loss in practical dB units: 32.44 + 20 log F + 20 log D', r'32\.4|link loss', ['P01'], 'S', 1, 0, 1, 0),
 ('6.4', 'S6', 'RES', 'burn-through range', r'burn.?through', ['P03'], 'K', 1, 0, 0, 0),
 ('6.5', 'S6', 'FACT', 'required J/S by jamming type', r'required j/s|j/s (is )?required', [], 'S', 1, 0, 1, 0),
 ('6.6', 'S6', 'FACT', 'parameter-effect table (dB for dB)', r'db for db', [], 'C', 0, 0, 1, 1),
 ('6.7', 'S6', 'RES', 'comms burn-through equivalent', r'communications? (jamming )?burn.?through', [], 'S', 1, 0, 1, 0),
 # S7  B06 189-203, missile EOM, pursuit (Lanchester M6.4)
 ('7.1', 'S7', 'FACT', 'guidance taxonomy: command, beam rider, semi-active / active / passive homing', r'beam.rid|semi.?active|command guidance|passive homing|active homing', [], 'C', 0, 0, 0, 1),
 ('7.2', 'S7', 'MOD', 'point-mass missile EOM: thrust (T = Tvac - p Ae), drag, lift, mass flow', r'point.mass|equations of motion|vacuum thrust', [], 'S', 0, 1, 1, 0),
 ('7.3', 'S7', 'FACT', 'axial-force coefficient model of a cone', r'axial.force coefficient', [], 'C', 0, 0, 1, 1),
 ('7.4', 'S7', 'FACT', 'evasive target manoeuvre model (circular)', r'target maneuver|evasive|weave', [], 'C', 1, 0, 1, 1),
 ('7.5', 'S7', 'MOD', 'engagement kinematics: range, LOS angle, closing velocity', r'line.of.sight|\blos rate|closing velocity|engagement kinematics', ['P06', 'P14'], 'K', 1, 1, 0, 0),
 ('7.6', 'S7', 'RES', 'pure pursuit: capture needs kappa > 1; terminal g blow-up', r'pure pursuit|pursuit (guidance|course|curve)', ['P06'], 'S', 1, 1, 1, 0),
 ('7.7', 'S7', 'RES', 'deviated pursuit; angle of maximum g', r'deviated pursuit', [], 'C', 0, 0, 1, 1),
 ('7.8', 'S7', 'RES', 'collision course / constant bearing (lead pursuit, parallel navigation)', r'collision course|constant bearing|lead (angle|pursuit)|parallel navigation', ['P06', 'P14'], 'K', 1, 1, 0, 0),
 ('7.9', 'S7', 'RES', 'time-to-intercept expression', r'time to intercept|time.to.go', [], 'S', 1, 0, 1, 0),
 ('7.10', 'S7', 'FACT', 'pursuit vs PN: mechanisation vs airframe loading', r'pursuit.{0,80}proportional navigation|proportional navigation.{0,80}pursuit', [], 'S', 1, 0, 1, 0),
 # S8  E13 325-340, beams (Gilua M16.4)
 ('8.1', 'S8', 'DEF', 'pure vs non-uniform bending; deflection', r'pure bending|nonuniform bending', [], 'C', 0, 0, 1, 1),
 ('8.2', 'S8', 'DEF', 'curvature kappa = 1/rho = d theta/ds; small-deflection kappa ~ v\'\'', r'curvature', [], 'S', 0, 1, 1, 0),
 ('8.3', 'S8', 'RES', 'plane sections stay plane: eps_x = -kappa y', r'plane sections|sections remain plane|longitudinal strain', [], 'S', 0, 0, 1, 0),
 ('8.4', 'S8', 'RES', 'neutral axis through the centroid (sum of forces = 0)', r'neutral axis|neutral surface', [], 'S', 0, 0, 1, 0),
 ('8.5', 'S8', 'RES', 'moment-curvature M = E I kappa', r'moment.curvature|flexural rigidity', [], 'K', 1, 1, 0, 0),
 ('8.6', 'S8', 'RES', 'flexure formula sigma = -M y / I; section modulus S = I/c', r'flexure formula|section modulus|bending stress', [], 'K', 1, 0, 0, 0),
 ('8.7', 'S8', 'FACT', 'I and S of rectangle and circle', r'moment of inertia', [], 'C', 0, 0, 1, 1),
 ('8.8', 'S8', 'FACT', 'worked example: strain and curvature from a measured deflection', r'example 5-1', [], 'C', 0, 0, 1, 1),
 ('8.9', 'S8', 'FACT', 'worked example: wire bent around a drum', r'\bdrum\b', [], 'C', 0, 0, 1, 1),
 ('8.10', 'S8', 'DEF', 'sign conventions for moment and curvature', r'sign convention', [], 'C', 0, 0, 1, 1),
 # S9  B07 44-58, missile-defense problem, pre-phase A (Lanchester M7.1)
 ('9.1', 'S9', 'MOD', 'four functional requirements of missile defence (sense, decide, engage, assess)', r'kill chain|fire control|engagement sequence|sensor.to.shooter', ['P05', 'P14'], 'S', 1, 0, 0, 0),
 ('9.2', 'S9', 'FACT', 'raid types (stream vs simultaneous) and saturation', r'\braid\b|saturat', ['P05'], 'S', 1, 0, 0, 1),
 ('9.3', 'S9', 'FACT', 'threat characteristics: RCS reduction by shaping and RAM, manoeuvre', r'radar.absorbing|low.observable|stealth', [], 'C', 1, 0, 0, 1),
 ('9.4', 'S9', 'MOD', 'engagement timeline under speed mismatch (decision time from detection range)', r'timeline|reaction time|decision time', ['P14', 'P15'], 'K', 1, 0, 0, 0),
 ('9.5', 'S9', 'RES', 'radar horizon R ~ sqrt(2 k Re h)', r'radar horizon|4/3 earth|horizon', ['P01', 'P15'], 'K', 1, 1, 0, 0),
 ('9.6', 'S9', 'FACT', 'multipath; ~30% frequency agility against cancellation', r'multipath', [], 'C', 0, 0, 1, 1),
 ('9.7', 'S9', 'FACT', 'sidelobe-jamming suppression (40-50 dB low sidelobes)', r'sidelobe jamm|low.sidelobe', [], 'C', 1, 0, 1, 1),
 ('9.8', 'S9', 'MOD', 'cost-exchange ratio: interceptor vs defended asset', r'cost.exchange|cost ratio|cost per (kill|intercept)', ['P05', 'P14'], 'S', 1, 0, 0, 0),
 ('9.9', 'S9', 'FACT', 'ballistic-missile event timeline (burnout, apogee, terminal)', r'burnout|apogee|boost phase|midcourse', [], 'C', 1, 0, 1, 1),
 # S10  B09 103-117, UAV performance (Lanchester M9.2)
 ('10.1', 'S10', 'FACT', 'flight-mission phases', r'mission profile|flight phase|phases of (the )?flight', [], 'C', 0, 0, 0, 1),
 ('10.2', 'S10', 'RES', 'cruise: L = W, T = D, cruise speed from the drag polar', r'cruis(e|ing) (speed|flight)|steady level flight', [], 'S', 0, 0, 1, 0),
 ('10.3', 'S10', 'RES', 'Breguet range (propeller and jet)', r'breguet', [], 'K', 1, 1, 0, 0),
 ('10.4', 'S10', 'RES', 'endurance (propeller and jet)', r'endurance', [], 'S', 1, 0, 1, 0),
 ('10.5', 'S10', 'RES', '(L/D)max where induced = parasite drag; its speed', r'maximum lift.to.drag|\(l/d\)\s*max|l/d max|maximum l/d|drag polar|minimum drag', [], 'K', 1, 1, 0, 0),
 ('10.6', 'S10', 'RES', 'rate of climb from excess power (P_avail - P_req)/W', r'rate of climb|excess power', [], 'K', 1, 1, 0, 0),
 ('10.7', 'S10', 'RES', 'climb angle', r'climb angle|angle of climb', [], 'S', 0, 0, 1, 0),
 ('10.8', 'S10', 'RES', 'stall speed V_s = sqrt(2W / rho S C_Lmax)', r'stall(ing)? speed', [], 'S', 1, 0, 1, 0),
 ('10.9', 'S10', 'RES', 'gliding flight', r'glide (angle|ratio|range)|gliding', [], 'S', 0, 0, 1, 0),
 ('10.10', 'S10', 'RES', 'V_E / V_R = 3^(-1/4)', r'3\^\(?-1/4|0\.76', [], 'S', 0, 0, 1, 0),
 ('10.11', 'S10', 'FACT', 'launch on a ramp: acceleration, friction, v^2 = 2as', r'launch(er)? (ramp|rail)|catapult', [], 'C', 0, 0, 0, 1),
 ('10.12', 'S10', 'FACT', 'recovery: impact speed ~1.1 V_s, deceleration in g', r'\brecovery\b|arrest(ed|ing)', [], 'C', 0, 0, 0, 1),
 # S11  E22 734-745, memory hierarchy (Gilua M22.7)
 ('11.1', 'S11', 'RES', 'locality (temporal, spatial) and the hierarchy illusion', r'locality|memory hierarchy', [], 'K', 1, 1, 0, 0),
 ('11.2', 'S11', 'DEF', 'block, hit, miss, hit rate, miss penalty', r'hit rate|miss rate|\bcache\b', [], 'C', 0, 0, 1, 1),
 ('11.3', 'S11', 'RES', 'effective access time = hit time + miss rate x miss penalty', r'miss penalty|average memory access time|effective access time', [], 'S', 1, 1, 1, 0),
 ('11.4', 'S11', 'FACT', 'technology table: SRAM/DRAM/flash/disk access time and $/GB', r'\bdram\b|\bsram\b|flash memory|magnetic disk', [], 'C', 0, 0, 0, 1),
 # S12  E26 53-62, NASA SE design process (Gilua M27.2)
 ('12.1', 'S12', 'MOD', 'design-process flow: stakeholder expectations -> ConOps -> requirements -> decomposition, recursive', r'concept of operations|\bconops\b|requirements definition|stakeholder expectation|logical decomposition', [], 'K', 1, 0, 0, 0),
 ('12.2', 'S12', 'DEF', 'needs, goals, objectives; MOEs; success criteria', r'measures? of effectiveness|\bmoes?\b|success criteria', [], 'C', 1, 0, 0, 1),
 ('12.3', 'S12', 'FACT', 'stakeholders through the life cycle (table)', r'stakeholder', [], 'C', 0, 0, 0, 1),
 ('12.4', 'S12', 'MOD', 'ConOps content: scenarios, timelines, use cases', r'operational scenario|use case|day in the life', [], 'S', 1, 0, 1, 0),
 # S13  D5 100-110, Russian IADS / REB (Lanchester M12.1)
 ('13.1', 'S13', 'MOD', 'layered IADS: strategic to tactical layers, fighters integrated', r'integrated air defen|\biads\b|layered (air )?defen', ['P05'], 'S', 1, 0, 0, 0),
 ('13.2', 'S13', 'FACT', 'air-defence battalion organisation', r'battalion|\bbattery\b', [], 'C', 0, 0, 0, 1),
 ('13.3', 'S13', 'FACT', 'REB (EW) categories and integration with air defence', r'\breb\b|radio.electronic', [], 'S', 1, 0, 0, 1),
 ('13.4', 'S13', 'FACT', 'named systems (SA-18, Afghanit, R-330, Borisoglebsk-2)', r'afghanit|borisoglebsk|sa-18|r-330|krasukha|pantsir', [], 'C', 0, 0, 0, 1),
 # S14  B08 25-35, avionics intro, roles (Lanchester M8.1)
 ('14.1', 'S14', 'FACT', 'avionics integration trend: federated -> integrated (cost, complexity, reuse)', r'federated|integrated (modular )?avionics|functional integration', [], 'S', 1, 0, 0, 1),
 ('14.2', 'S14', 'FACT', 'avionics composition: nav, comms, sensors, mission system', r'avionics', [], 'C', 0, 0, 0, 1),
 ('14.3', 'S14', 'FACT', 'military roles and mission profiles', r'air superiority|ground attack|close air support|interdiction', [], 'C', 0, 0, 0, 1),
 ('14.4', 'S14', 'FACT', 'aircraft types by role', r'eurofighter|phantom|tornado', [], 'C', 0, 0, 0, 1),
]

HOME = {'S1': 'E:M8.13', 'S2': 'E:M3.2', 'S3': 'E:M4.5', 'S4': 'E:M6.2', 'S5': 'C:M2.2', 'S6': 'C:M4.7',
        'S7': 'C:M6.4', 'S8': 'E:M16.4', 'S9': 'C:M7.1', 'S10': 'C:M9.2', 'S11': 'E:M22.7', 'S12': 'E:M27.2',
        'S13': 'C:M12.1', 'S14': 'C:M8.1'}
SAMPLE_CLASS = {'S1': 'A', 'S2': 'B', 'S3': 'D', 'S4': 'C', 'S5': 'E', 'S6': 'E', 'S7': 'E', 'S8': 'D',
                'S9': 'F', 'S10': 'F', 'S11': 'F', 'S12': 'F', 'S13': 'G', 'S14': 'G'}
SAMPLE_PAGES = {'S1': 16, 'S2': 15, 'S3': 15, 'S4': 12, 'S5': 15, 'S6': 14, 'S7': 15, 'S8': 16, 'S9': 15,
                'S10': 15, 'S11': 12, 'S12': 10, 'S13': 11, 'S14': 11}
# R8's 24 strict CRs mapped onto this list (for the cross-tab). R8 merged some items: 'variance/covariance
# algebra incl. A Sigma A^T' -> 4.5; 'engagement kinematics plus pure pursuit' -> 7.5; 'Breguet range and
# endurance' -> 10.3; 'flexure formula with M = E I kappa' -> 8.6.
R8_STRICT = {'1.4', '1.6', '1.7', '2.3', '2.4', '2.8', '3.1', '4.1', '4.5', '4.12', '5.4', '5.5', '5.7',
             '6.2', '6.4', '7.5', '7.8', '8.3', '8.6', '9.4', '10.3', '10.5', '10.6', '11.1'}

# Adjudication of the 28 A/B disagreements (a third, reasoned pass; R10_tiers.md s2.3). The adjudicator
# may overrule a fan-out count when the regex is visibly polluted by an everyday word (e.g. 'functional
# requirements', 'curvature' of a road) or visibly blind (Q cannot be matched as a bare letter).
ADJ = {
 '1.1':  ('S', "fan-out 63 is the word 'functional' (requirements, blocks); the concept serves 1.4"),
 '1.6':  ('S', "deep structure, but 2 modules use it and no project; promotable by the learner"),
 '2.4':  ('K', "Q cannot be regex-matched as a letter; Q/bandwidth is a judgement number in filters, antennas, radar, structures"),
 '2.7':  ('S', "fan-out is the generic phrase 'stored energy'; serves 2.4"),
 '3.3':  ('S', "the first-order system is K at its home module (control/circuits); here it is a transform pair"),
 '3.5':  ('S', "serves 3.4 and sampling"),
 '4.7':  ('K', "correlation carries judgement (correlated interceptor failures, A6 interview list) and Kalman"),
 '5.6':  ('S', "a form of 5.4"),
 '5.8':  ('S', "serves 5.4; the numbers are recognised, not wielded alone"),
 '5.11': ('K', "energy on target is the judgement form (pulse compression, LPI, search radar power-aperture)"),
 '6.3':  ('S', "the practical-unit form of 5.1"),
 '7.2':  ('S', "fan-out is the generic phrase 'equations of motion'; serves 7.5"),
 '7.6':  ('S', "the foil for PN; P06 uses it only as contrast"),
 '8.2':  ('S', "generic word; serves 8.5"),
 '8.5':  ('K', "regex blind ('EI' dropped); deflection, buckling and vibration all start here"),
 '8.6':  ('K', "the most-used design equation of structures; regex narrow"),
 '9.1':  ('K', "kill-chain decomposition: projects P05, P14; the frame of every AMD judgement"),
 '9.2':  ('S', "saturation matters, but as an input to 9.1/9.4 and P05"),
 '9.8':  ('K', "cost exchange: P05, P14, and the central Israeli AMD question"),
 '10.3': ('K', "range judgement for every aircraft/UAV; the ln(W0/W1) structure is the rocket equation"),
 '10.4': ('S', "variant of 10.3"),
 '10.5': ('K', "the optimum where two drag terms balance; recurs in aero, UAV, missiles"),
 '10.6': ('K', "specific excess power = energy manoeuvrability; fighters and UAV climb judgements"),
 '11.1': ('K', "locality: caches, CDNs, databases, ML memory walls"),
 '12.1': ('K', "SE appears in both apps (Gilua P27, Lanchester M7.2/M7.4/M7.10; A1 s3.2); program critique"),
 '13.1': ('K', "P05; layered defence is the frame of SEAD and AMD judgements"),
 '13.3': ('S', "descriptive, but needed to read IADS (13.1)"),
 '14.1': ('S', "the integration trade-off serves avionics architecture judgements"),
}
