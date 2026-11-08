"""Source of truth for the engineering syllabus.

The spine is Kolmogorov (K1–K3) and Feynman (F1–F3). Around it: five hubs
learned deepest (signals, control and estimation, probability and
information, linear algebra and optimization, field equations), then the
bridges and the periphery. A topic is taught once, where the best source is;
other books covering it join as supplements (◇), and the tutor teaches from
them only what is new.

Sources name chapters and sections; toc.py turns them into PDF page ranges
from the maps in toc/. Run build.py to check coverage and write
syllabus.json and SYLLABUS.md.
"""
from toc import load, matter, section_pages, title, unit

DOCS = {
    "K1": ("library/math-physics/Mathematics_Vol1.pdf", "Kolmogorov et al., Mathematics: Its Content, Methods and Meaning, Vol. 1"),
    "K2": ("library/math-physics/Mathematics_Vol2.pdf", "Kolmogorov et al., Mathematics: Its Content, Methods and Meaning, Vol. 2"),
    "K3": ("library/math-physics/Mathematics_Vol3.pdf", "Kolmogorov et al., Mathematics: Its Content, Methods and Meaning, Vol. 3"),
    "F1": ("app/artifact/books/feyn1.json", "The Feynman Lectures on Physics, Vol. I"),
    "F2": ("app/artifact/books/feyn2.json", "The Feynman Lectures on Physics, Vol. II"),
    "F3": ("library/math-physics/Feynman_Vol3.pdf", "The Feynman Lectures on Physics, Vol. III"),
    "E01": ("library/engineering/books/E01_Signals-and-Systems_Oppenheim-Willsky_2ed.pdf", "Oppenheim & Willsky, Signals and Systems"),
    "E02": ("library/engineering/books/E02_Signals-Systems-Inference_MIT6011_2010.pdf", "Oppenheim & Verghese, Signals, Systems and Inference (MIT 6.011 notes)"),
    "E03": ("library/engineering/books/E03_Feedback-Systems_Astrom-Murray_2ed.pdf", "Åström & Murray, Feedback Systems"),
    "E04": ("library/engineering/books/E04_Information-Theory-Inference_MacKay_2003.pdf", "MacKay, Information Theory, Inference and Learning Algorithms"),
    "E05": ("library/engineering/books/E05_All-of-Statistics_Wasserman_2004.pdf", "Wasserman, All of Statistics"),
    "E06": ("library/engineering/books/E06_Convex-Optimization_Boyd-Vandenberghe_2004.pdf", "Boyd & Vandenberghe, Convex Optimization"),
    "E07": ("library/engineering/books/E07_Numerical-Linear-Algebra_Trefethen-Bau.pdf", "Trefethen & Bau, Numerical Linear Algebra"),
    "E08": ("library/engineering/books/E08_Finite-Difference-Computing-PDEs_Langtangen-Linge_2016.pdf", "Langtangen & Linge, Finite Difference Computing with PDEs"),
    "E09": ("library/engineering/books/E09_Art-of-Electronics_Horowitz-Hill_2ed.pdf", "Horowitz & Hill, The Art of Electronics"),
    "E09a": ("library/engineering/books/E09a_Art-of-Electronics-Student-Manual_Hayes-Horowitz_1989.pdf", "Hayes & Horowitz, Student Manual for The Art of Electronics"),
    "E10": ("library/engineering/books/E10_Electric-Motors-Drives_Hughes-Drury_4ed.pdf", "Hughes & Drury, Electric Motors and Drives"),
    "E11": ("library/engineering/books/E11_Introduction-to-Flight_Anderson_8ed.pdf", "Anderson, Introduction to Flight"),
    "E12": ("library/engineering/books/E12_Materials-Selection_Ashby_4ed_2011.pdf", "Ashby, Materials Selection in Mechanical Design"),
    "E13": ("library/engineering/books/E13_Mechanics-of-Materials_Gere_6ed_2004.pdf", "Gere, Mechanics of Materials (6th ed.)"),
    "E13a": ("library/engineering/books/E13a_Mechanics-of-Materials-Solutions_Gere-Goodno_8ed.pdf", "Gere & Goodno, Mechanics of Materials, 8th ed. (solutions manual)"),
    "E14": ("library/engineering/books/E14_Sustainable-Energy_MacKay_2009.pdf", "MacKay, Sustainable Energy – Without the Hot Air"),
    "E15": ("library/engineering/books/E15_Thermodynamics_Cengel-Boles_9ed.pdf", "Çengel & Boles, Thermodynamics: An Engineering Approach"),
    "E16": ("library/engineering/books/E16_Heat-Transfer_Lienhard_6ed_2024.pdf", "Lienhard, A Heat Transfer Textbook"),
    "E17": ("library/engineering/books/E17_Understanding-Deep-Learning_Prince_v5.pdf", "Prince, Understanding Deep Learning"),
    "E18": ("library/engineering/books/E18_Reinforcement-Learning_Sutton-Barto_2ed_2018.pdf", "Sutton & Barto, Reinforcement Learning"),
    "E19": ("library/engineering/books/E19_Modern-Robotics_Lynch-Park_2019.pdf", "Lynch & Park, Modern Robotics"),
    "E20": ("library/engineering/books/E20_Mathematics-for-CS_Lehman-Leighton-Meyer_2018.pdf", "Lehman, Leighton & Meyer, Mathematics for Computer Science"),
    "E21": ("library/engineering/books/E21_Algorithm-Design-Manual_Skiena_3ed.pdf", "Skiena, The Algorithm Design Manual"),
    "E22": ("library/engineering/books/E22_Computer-Organization-RISC-V_Patterson-Hennessy.pdf", "Patterson & Hennessy, Computer Organization and Design, RISC-V Edition"),
    "E23": ("library/engineering/books/E23_Wireless-Communication_Tse-Viswanath_2005.pdf", "Tse & Viswanath, Fundamentals of Wireless Communication"),
    "E24": ("library/engineering/books/E24_Semiconductor-Devices_Hu_2010.pdf", "Hu, Modern Semiconductor Devices for Integrated Circuits"),
    "E25": ("library/engineering/books/E25_CMOS-VLSI-Design_Weste-Harris_4ed.pdf", "Weste & Harris, CMOS VLSI Design"),
    "E26": ("library/engineering/books/E26_NASA-Systems-Engineering-Handbook_Rev2_2016.pdf", "NASA Systems Engineering Handbook, Rev 2"),
    # ---- round 7 (6.11): books that arrived for the mapping in docs/research/round7/mapping/ ----
    "E27": ("library/engineering/books/E27_Engineering-Mechanics-Statics_Meriam-Kraige_9ed.pdf", "Meriam & Kraige, Engineering Mechanics: Statics (9th ed.)"),
    "E28": ("library/engineering/books/E28_Engineering-Mechanics-Dynamics_Meriam-Kraige_7ed.pdf", "Meriam & Kraige, Engineering Mechanics: Dynamics (7th ed.)"),
    "E29": ("library/engineering/books/E29_Mechanical-Vibrations_Rao_6ed-SI.pdf", "Rao, Mechanical Vibrations (6th ed., SI)"),
    "E30": ("library/engineering/books/E30_Discrete-Time-Signal-Processing_Oppenheim-Schafer-Buck_2ed_scan.pdf", "Oppenheim, Schafer & Buck, Discrete-Time Signal Processing (2nd ed.)"),
    "E31": ("library/engineering/books/E31_Spectral-Analysis-of-Signals_Stoica-Moses_2005.pdf", "Stoica & Moses, Spectral Analysis of Signals"),
    "E32": ("library/engineering/books/E32_Introduction-to-Electrodynamics_Griffiths_3ed_1999.pdf", "Griffiths, Introduction to Electrodynamics (3rd ed.)"),
    "E33": ("library/engineering/books/E33_Thermal-Physics_Schroeder_2000.pdf", "Schroeder, An Introduction to Thermal Physics"),
    "E34": ("library/engineering/books/E34_Computer-Networking_Kurose-Ross_8ed.pdf", "Kurose & Ross, Computer Networking: A Top-Down Approach (8th ed.)"),
    "E35": ("library/engineering/books/E35_Power-System-Analysis-Design_Glover-Overbye-Sarma_6ed.pdf", "Glover, Overbye & Sarma, Power System Analysis and Design (6th ed.)"),
    "E36": ("library/engineering/books/E36_Battery-Management-Systems-Vol1-Modeling_Plett_2015.pdf", "Plett, Battery Management Systems, Vol. I: Battery Modeling"),
    "E37": ("library/engineering/books/E37_First-Course-in-Turbulence_Tennekes-Lumley_1972.pdf", "Tennekes & Lumley, A First Course in Turbulence"),
    "E38": ("library/engineering/books/E38_Fundamentals-of-Aerodynamics_Anderson_5ed.pdf", "Anderson, Fundamentals of Aerodynamics (5th ed.)"),
    "E39": ("library/engineering/books/E39_Mechanics-Thermodynamics-of-Propulsion_Hill-Peterson_2ed.pdf", "Hill & Peterson, Mechanics and Thermodynamics of Propulsion (2nd ed.)"),
    "E40": ("library/engineering/books/E40_Flight-Stability-Automatic-Control_Nelson_2ed.pdf", "Nelson, Flight Stability and Automatic Control (2nd ed.)"),
    "E41": ("library/engineering/books/E41_Shigleys-Mechanical-Engineering-Design_Budynas-Nisbett_10ed.pdf", "Budynas & Nisbett, Shigley's Mechanical Engineering Design (10th ed.)"),
    "E42": ("library/engineering/books/E42_Fracture-Mechanics_Janssen-Zuidema-Wanhill_2ed.pdf", "Janssen, Zuidema & Wanhill, Fracture Mechanics (2nd ed.)"),
    "E43": ("library/engineering/books/E43_Aircraft-Structures_Megson_6ed.pdf", "Megson, Aircraft Structures for Engineering Students (6th ed.)"),
    "E44": ("library/engineering/books/E44_Mechanics-of-Composite-Materials_Jones_2ed_1999.pdf", "Jones, Mechanics of Composite Materials (2nd ed.)"),
    "E45": ("library/engineering/books/E45_Making-Embedded-Systems_White_2ed.pdf", "White, Making Embedded Systems (2nd ed.)"),
    "E46": ("library/engineering/books/E46_Fundamentals-of-Electric-Circuits_Alexander-Sadiku_4ed.pdf", "Alexander & Sadiku, Fundamentals of Electric Circuits (4th ed.)"),
    "E47": ("library/engineering/books/E47_Numerical-Methods-Variational-Problems_Langtangen-Mardal_2019.pdf", "Langtangen & Mardal, Introduction to Numerical Methods for Variational Problems"),
    "E48": ("library/engineering/books/E48_Bayesian-Filtering-and-Smoothing_Sarkka_2013.pdf", "Särkkä, Bayesian Filtering and Smoothing"),
    "E49a": ("library/engineering/books/E49a_Probabilistic-ML-Advanced-Topics_Murphy_2023_p0001-0685.pdf", "Murphy, Probabilistic Machine Learning: Advanced Topics (file 1 of 2)"),
    "E49b": ("library/engineering/books/E49b_Probabilistic-ML-Advanced-Topics_Murphy_2023_p0686-1370.pdf", "Murphy, Probabilistic Machine Learning: Advanced Topics (file 2 of 2)"),
    "E50": ("library/engineering/books/E50_Offline-RL-Tutorial_Levine-Kumar-Tucker-Fu_2020.pdf", "Levine, Kumar, Tucker & Fu, Offline Reinforcement Learning: Tutorial, Review, and Perspectives"),
    "E51": ("library/engineering/books/E51_STPA-Handbook_Leveson-Thomas_2018.pdf", "Leveson & Thomas, STPA Handbook"),
    "E52": ("library/engineering/books/E52_NASA-PRA-Procedures-Guide_2ed_2011.pdf", "NASA, Probabilistic Risk Assessment Procedures Guide (2nd ed.)"),
    # Pozar is taught in Lanchester (its RF modules M1.5–M1.7); the file lives in that library
    "E53": ("library/military/books/18_Microwave-Engineering_Pozar_4ed_2012.pdf", "Pozar, Microwave Engineering (4th ed.)"),
}

PARTS = [
    ("P0", "שער: מבט על המתמטיקה והפיזיקה"),
    ("P1", "עמוד השדרה: אנליזה, גאומטריה ואלגברה"),
    ("P2", "עמוד השדרה: מכניקה"),
    ("P3", "עמוד השדרה: משוואות דיפרנציאליות ותנודות"),
    ("P4", "צומת 1: אותות ומערכות לינאריות"),
    ("P5", "צומת 2: דינמיקה, בקרה ושערוך מצב"),
    ("P6", "צומת 3א: הסתברות וסטטיסטיקה"),
    ("P7", "צומת 3ב: אינפורמציה, הסקה ואותות אקראיים"),
    ("P8", "צומת 4: אלגברה לינארית, אופטימיזציה ושיטות חישוב"),
    ("P9", "צומת 5א: גלים, אלקטרומגנטיות ואופטיקה"),
    ("P10", "צומת 5ב: משוואות שדה וסימולציה נומרית"),
    ("P11", "גשר: אלקטרוניקה"),
    ("P12", "גשר: מנועים חשמליים, הנעה וחומרים מגנטיים"),
    ("P13", "גשר: תרמודינמיקה ואנרגיה"),
    ("P14", "גשר: מעבר חום"),
    ("P15", "גשר: זורמים ואווירונאוטיקה"),
    ("P16", "גשר: מבנים וחומרים"),
    ("P17", "גשר: למידת מכונה ולמידה עמוקה"),
    ("P18", "גשר: למידה מחיזוקים"),
    ("P19", "גשר: רובוטיקה"),
    ("P20", "פריפריה: מתמטיקה דיסקרטית"),
    ("P21", "פריפריה: אלגוריתמים"),
    ("P22", "פריפריה: מערכות מחשב"),
    ("P23", "פריפריה: תקשורת ספרתית ואלחוטית"),
    ("P24", "פריפריה: פיזיקה מודרנית: יחסות וקוונטים"),
    ("P25", "פריפריה: התקני מוליכים למחצה ותכנון שבבים"),
    ("P26", "העשרה מתמטית"),
    ("P27", "גשר: הנדסת מערכות"),
]


# ---------------- source helpers ----------------
def _src(doc, a, b, note, role):
    return {"doc": doc, "pages": [a, b], "note": note, "role": role}


def _problems(doc, num):
    """Start page of a chapter's closing problem block, if it has one."""
    u = unit(doc, num)
    if u["secs"] and u["secs"][-1][0] == "P" and u["secs"][-1][1] > u["a"]:
        return u["secs"][-1][1]
    return None


def c(doc, num, note=None, role="main"):
    """A whole chapter; its closing problem block becomes an exercise source."""
    u = unit(doc, num)
    note = note or f"{num}: {u['title']}"
    p = _problems(doc, num)
    if p is None:
        return [_src(doc, u["a"], u["b"], note, role)]
    return [_src(doc, u["a"], p - 1, note, role), _src(doc, p, u["b"], f"{num}: תרגילים", "ex")]


def sup(doc, num, note=None):
    return c(doc, num, note, "supp")


def cs(doc, *nums, role="main"):
    return [x for n in nums for x in c(doc, n, role=role)]


def sups(doc, *nums):
    return cs(doc, *nums, role="supp")


def sec(doc, num, first=None, last=None, note=None, role="main"):
    """Part of a chapter, from section `first` to the end of section `last`."""
    a, b = section_pages(doc, num, first, last)
    return [_src(doc, a, b, note or f"{num} §{first or ''}–{last or ''}: {title(doc, num)}", role)]


def probs(doc, num):
    u = unit(doc, num)
    p = _problems(doc, num)
    return [_src(doc, p, u["b"], f"{num}: תרגילים", "ex")]


def _owners(doc, num):
    """Each page of a chapter with the section that owns it: the last listed
    section starting on or before it ('_pre' for pages before the first)."""
    u = unit(doc, num)
    out = []
    for p in range(u["a"], u["b"] + 1):
        own = "_pre"
        for k, a, _t in u["secs"]:
            if a <= p:
                own = k
        out.append((p, own))
    return out


def _runs(doc, num, pages, note, role):
    runs = []
    for p, own in pages:
        if runs and runs[-1][1] == p - 1:
            runs[-1][1] = p
            runs[-1][2].append(own)
        else:
            runs.append([p, p, [own]])
    t = title(doc, num)
    out = []
    for a, b, owns in runs:
        ks = [k for k in dict.fromkeys(owns) if k not in ("_pre", "P")]
        where = f" §{ks[0]}–{ks[-1]}" if len(ks) > 1 else (f" §{ks[0]}" if ks else "")
        out.append(_src(doc, a, b, f"{num}{where}: {t}" + (f" ({note})" if note else ""), role))
    return out


def pick(doc, num, keys, note=None, role="main"):
    """Only the listed sections of a chapter ('_pre' for its opening pages)."""
    keys = set(keys)
    return _runs(doc, num, [x for x in _owners(doc, num) if x[1] in keys], note, role)


def rest(doc, num, drop=(), note=None, role="main"):
    """A chapter's text without the listed sections and without its problem block."""
    drop = set(drop) | {"P"}
    return _runs(doc, num, [x for x in _owners(doc, num) if x[1] not in drop], note, role)


def cut(doc, num, drop=(), note=None, role="main"):
    """A chapter without the listed sections; its closing problem block stays, as exercises."""
    out = rest(doc, num, drop, note, role)
    return out + probs(doc, num) if _problems(doc, num) else out


def refs(doc, *nums):
    """Whole chapters for a reference module."""
    return [x for n in nums for x in c(doc, n)]


def span(doc, num, first, last):
    """Section keys of a chapter from `first` to `last`, in map order."""
    ks = [s[0] for s in unit(doc, num)["secs"]]
    return ks[ks.index(str(first)):ks.index(str(last)) + 1]


def mod(id, part, tier, title_he, en, *sources, prereq=()):
    flat = [s for group in sources for s in group]
    for s in flat:
        # E13a is the instructor's solutions manual: problems and solutions, no theory
        if s["doc"] == "E13a":
            s["role"] = "ex"
            s["note"] = s["note"].replace("תרגילים", "בעיות ופתרונות") if s["note"].endswith("תרגילים") else s["note"] + " (ספר פתרונות: בעיות ופתרונות בלבד)"
    return dict(id=id, part=part, tier=tier, title=title_he, en=en, prereq=list(prereq), sources=flat)


# Skiena's War Stories (anecdotes) move to the reference shelf (round 7, ENG_mapping §16)
_WAR = {"1": ["1.7", "1.8"], "2": ["2.9"], "3": ["3.6", "3.9"], "4": ["4.4", "4.8"], "5": ["5.2", "5.8"], "6": ["6.9"],
        "7": ["7.3", "7.4"], "8": ["8.2", "8.4"], "9": ["9.5"], "10": ["10.4", "10.6", "10.10"], "11": ["11.7", "11.8"], "12": ["12.7", "12.8"]}


def skiena(*nums):
    return [x for n in nums for x in cut("E21", n, _WAR.get(n, ()))]


# tier: core = נלמד במלואו; adv = מתקדם, אחרי הליבה; ref = עיון וחומר עזר
MODULES = [
    # ---------------- P0 ----------------
    mod("M0.1", "P0", "core", "מבט כללי על המתמטיקה", "A general view of mathematics", c("K1", "I")),
    mod("M0.2", "P0", "core", "אטומים בתנועה, פיזיקה בסיסית והקשר למדעים אחרים", "Atoms in motion and basic physics",
        cs("F1", "1", "2", "3")),

    # ---------------- P1 ----------------
    mod("M1.1", "P1", "core", "אנליזה: פונקציה, גבול, נגזרת וטיילור", "Analysis: functions, limits, derivatives, Taylor",
        sec("K1", "II", None, "9"), prereq=["M0.1"]),
    mod("M1.2", "P1", "core", "אנליזה: אינטגרל, כמה משתנים וטורים", "Analysis: integrals, several variables, series",
        sec("K1", "II", "10", "14"), prereq=["M1.1"]),
    mod("M1.3", "P1", "core", "גאומטריה אנליטית: עקומות, חתכי חרוט ווקטורים", "Analytic geometry: curves, conics, vectors",
        sec("K1", "III", None, "10"), prereq=["M1.1"]),
    mod("M1.4", "P1", "core", "טרנספורמציות, אינווריאנטים, גאומטריה פרויקטיבית ולורנץ", "Transformations, invariants, projective geometry, Lorentz",
        sec("K1", "III", "11", "C"), prereq=["M1.3"]),
    mod("M1.5", "P1", "core", "אלגברה: משוואות אלגבריות ומספרים מרוכבים", "Algebra: algebraic equations and complex numbers",
        c("K1", "IV"), c("F1", "22", "22: Algebra (פיינמן: חזקות, לוגריתמים, e^{iθ})"), prereq=["M1.2"]),
    mod("M1.6", "P1", "core", "וקטורים", "Vectors", c("F1", "11"), prereq=["M1.3"]),

    # ---------------- P2 ----------------
    mod("M2.1", "P2", "core", "שימור אנרגיה, זמן ומרחק", "Conservation of energy, time and distance", cs("F1", "4", "5"), prereq=["M0.2"]),
    mod("M2.2", "P2", "core", "כבידה", "Gravitation", c("F1", "7"), prereq=["M2.1"]),
    mod("M2.3", "P2", "core", "תנועה, חוקי ניוטון ותנע", "Motion, Newton's laws, momentum",
        cs("F1", "8", "9", "10", "12"), prereq=["M2.1", "M1.1", "M1.6"]),
    mod("M2.4", "P2", "core", "עבודה ואנרגיה פוטנציאלית", "Work and potential energy", cs("F1", "13", "14"), prereq=["M2.3", "M1.2"]),
    mod("M2.5", "P2", "core", "סיבוב, מרכז מסה ומומנט התמד", "Rotation, center of mass, moment of inertia",
        cs("F1", "18", "19", "20"), prereq=["M2.4"]),
    mod("M2.6", "P2", "core", "סטטיקה הנדסית: מסבכים, מסגרות ומכונות, וחיכוך", "Engineering statics: trusses, frames and machines, friction",
        c("E27", "4"), c("E27", "6"), sec("E27", "APP:P", "4", "4", "בעיות לפרק 4", "ex"), sec("E27", "APP:P", "6", "6", "בעיות לפרק 6", "ex"),
        prereq=["M2.5", "M1.6"]),
    mod("M2.7", "P2", "core", "דינמיקה תלת-ממדית של גוף קשיח: טנזור התמד, משוואות אוילר ותנועה ג'ירוסקופית", "Three-dimensional rigid-body dynamics: inertia tensor, Euler's equations, gyroscopic motion",
        c("E28", "7"), prereq=["M2.5", "M1.6"]),
    mod("M2.8", "P2", "ref", "Meriam & Kraige, סטטיקה: שאר הספר", "Meriam & Kraige, Statics: the remaining chapters",
        refs("E27", "1", "2", "3", "5", "7", "A", "B", "C", "D"),
        sec("E27", "APP:P", "1", "3", "בעיות לפרקים 1–3", "ex"), sec("E27", "APP:P", "5", "5", "בעיות לפרק 5", "ex"),
        sec("E27", "APP:P", "7", "A", "בעיות לפרק 7 ולנספח A", "ex"), prereq=["M2.6"]),
    mod("M2.9", "P2", "ref", "Meriam & Kraige, דינמיקה: שאר הספר", "Meriam & Kraige, Dynamics: the remaining chapters",
        refs("E28", "1", "2", "3", "4", "5", "6", "8", "A", "B", "C", "D"), prereq=["M2.7"]),

    # ---------------- P3 ----------------
    mod("M3.1", "P3", "core", "משוואות דיפרנציאליות רגילות", "Ordinary differential equations", c("K1", "V"), prereq=["M1.2", "M1.5"]),
    mod("M3.2", "P3", "core", "המתנד ההרמוני, תהודה, מעברים ומערכות לינאריות", "Harmonic oscillator, resonance, transients, linear systems",
        cs("F1", "21", "23", "24", "25"), prereq=["M3.1", "M2.3"]),
    mod("M3.3", "P3", "core", "תנודות מאולצות: עירור הרמוני, עירור בסיס ואי-איזון מסתובב", "Forced vibration: harmonic and base excitation, rotating unbalance",
        pick("E29", "3", ["_pre"] + span("E29", "3", "3.1", "3.7")), probs("E29", "3"), prereq=["M3.2"]),

    # ---------------- P4 ----------------
    mod("M4.1", "P4", "core", "אותות ומערכות: הגדרות ותכונות", "Signals and systems: definitions and properties",
        c("E01", "1"), pick("E02", "2", ["2.5"], role="supp"), prereq=["M3.2"]),
    mod("M4.2", "P4", "core", "מערכות LTI וקונבולוציה", "LTI systems and convolution", c("E01", "2"), prereq=["M4.1"]),
    mod("M4.3", "P4", "core", "פונקציות של משתנה מרוכב", "Functions of a complex variable",
        sec("K2", "IX", None, "3"), prereq=["M1.5", "M1.2"]),
    mod("M4.4", "P4", "core", "טורי פורייה", "Fourier series",
        c("E01", "3"), sec("K2", "XII", "7", "8", role="supp"), prereq=["M4.2", "M4.3"]),
    mod("M4.5", "P4", "core", "התמרת פורייה הרציפה", "The continuous-time Fourier transform",
        c("E01", "4"), pick("E02", "3", ["3.2", "3.3", "3.4"], role="supp"), prereq=["M4.4"]),
    mod("M4.6", "P4", "core", "התמרת פורייה הבדידה", "The discrete-time Fourier transform", c("E01", "5"), prereq=["M4.5"]),
    mod("M4.7", "P4", "core", "אפיון בזמן ובתדר: מסננים ומערכות מסדר ראשון ושני", "Time and frequency characterization, filters",
        c("E01", "6"), prereq=["M4.6"]),
    mod("M4.8", "P4", "core", "דגימה", "Sampling", c("E01", "7"), prereq=["M4.7"]),
    mod("M4.9", "P4", "core", "התמרת לפלס", "The Laplace transform",
        c("E01", "9"), c("E01", "A", "A: Partial-fraction expansion", "supp"), prereq=["M4.7"]),
    mod("M4.10", "P4", "core", "התמרת z", "The z-transform", c("E01", "10"), prereq=["M4.9", "M4.8"]),
    mod("M4.12", "P4", "core", "עיבוד רב-קצבי: דצימציה, אינטרפולציה ומבנה פוליפאזי", "Multirate processing: decimation, interpolation, polyphase structures",
        pick("E30", "4", ["4.6", "4.7"]), probs("E30", "4"), prereq=["M4.10", "M4.8"]),
    mod("M4.13", "P4", "core", "תכן מסננים בדידים: טרנספורמציה בילינארית, חלונות ו-Parks-McClellan", "Discrete-time filter design: bilinear transformation, windowing, Parks-McClellan",
        pick("E30", "7", ["7.0", "7.1", "7.2", "7.4"]), probs("E30", "7"), prereq=["M4.12"]),
    mod("M4.14", "P4", "core", "DFT, קונבולוציה מעגלית ו-FFT", "The DFT, circular convolution and the FFT",
        pick("E30", "8", ["8.5", "8.6", "8.7"]), probs("E30", "8"), pick("E30", "9", ["9.0", "9.1", "9.2", "9.3"]), probs("E30", "9"), prereq=["M4.10"]),
    mod("M4.11", "P4", "adv", "אינטגרל קווי, נוסחת קושי והמשכה אנליטית", "Line integrals, Cauchy's formula, analytic continuation",
        sec("K2", "IX", "4", "6"), prereq=["M4.3"]),

    # ---------------- P5 ----------------
    mod("M5.1", "P5", "core", "מבוא למשוב ובקרה, ועקרונות המשוב", "Introduction to feedback and feedback principles",
        cs("E03", "1", "2"), prereq=["M3.2"]),
    mod("M5.2", "P5", "core", "מידול מערכות ודוגמאות", "System modeling and examples", cs("E03", "3", "4"), prereq=["M5.1"]),
    mod("M5.3", "P5", "core", "התנהגות דינמית, יציבות וליאפונוב", "Dynamic behavior, stability, Lyapunov", c("E03", "5"), prereq=["M5.2", "M3.1"]),
    mod("M5.4", "P5", "core", "מערכות לינאריות במרחב מצב", "Linear state-space systems",
        c("E03", "6"), pick("E02", "4", ["4.4", "4.5"], role="supp"), pick("E02", "5", ["5.4", "5.5"], role="supp"), prereq=["M5.3", "M4.2"]),
    mod("M5.5", "P5", "core", "משוב מצב ו-LQR", "State feedback and LQR", c("E03", "7"), prereq=["M5.4"]),
    mod("M5.6", "P5", "core", "משוב מוצא, משערכי מצב ומסנן קלמן", "Output feedback, observers, Kalman filtering",
        c("E03", "8"), pick("E02", "6", ["6.1", "6.2", "6.3", "6.5"], role="supp"), prereq=["M5.5"]),
    mod("M5.7", "P5", "core", "פונקציות תמסורת ודיאגרמת בודה", "Transfer functions and the Bode plot", c("E03", "9"), prereq=["M5.4", "M4.9"]),
    mod("M5.8", "P5", "core", "ניתוח בתדר: קריטריון נייקוויסט ושולי יציבות", "Frequency-domain analysis: Nyquist and margins",
        c("E03", "10"), pick("E01", "11", ["11.2", "11.3", "11.6"], role="supp"), probs("E01", "11"), prereq=["M5.7"]),
    mod("M5.9", "P5", "core", "בקרת PID", "PID control", c("E03", "11"), prereq=["M5.8"]),
    mod("M5.10", "P5", "core", "תכנון בתדר: עיצוב חוג ומקום שורשים", "Frequency-domain design, loop shaping, root locus", c("E03", "12"), prereq=["M5.9"]),
    mod("M5.11", "P5", "adv", "ביצועים עמידים תחת אי-ודאות", "Robust performance", c("E03", "13"), prereq=["M5.10"]),
    mod("M5.12", "P5", "core", "גבולות יסודיים: האינטגרל של בודה", "Fundamental limits: Bode's integral", c("E03", "14"), prereq=["M5.10"]),
    mod("M5.13", "P5", "core", "ארכיטקטורה ותכנון מערכת", "Architecture and system design", c("E03", "15"), prereq=["M5.10"]),

    # ---------------- P6 ----------------
    mod("M6.1", "P6", "core", "הסתברות: חוקים, אקסיומות וחוק המספרים הגדולים", "Probability: laws, axioms, law of large numbers",
        sec("K2", "XI", None, "4"), sup("F1", "6"), prereq=["M1.2"]),
    mod("M6.2", "P6", "core", "משתנים מקריים ותוחלת", "Random variables and expectation",
        cs("E05", "1", "2", "3"), sup("E20", "IV"),
        pick("E20", "17", ["17.3", "17.4"], role="supp"), probs("E20", "17"), pick("E20", "18", ["18.1", "18.6", "18.9"], role="supp"), probs("E20", "18"),
        sec("E05", "14", "14.2", "14.3", "14 §14.2–14.3: התניה בגאוסיאן רב-ממדי (דלתא בליבה, מתוך M6.9)", "supp"),
        sec("E05", "16", "16.1", "16.2", "16 §16.1–16.2: ערבוב סיבתי (דלתא בליבה, מתוך M6.10)", "supp"), prereq=["M6.1"]),
    mod("M6.3", "P6", "core", "אי-שוויונות והתכנסות של משתנים מקריים", "Inequalities and convergence",
        cs("E05", "4", "5"), prereq=["M6.2"]),
    mod("M6.4", "P6", "core", "מודלים, הסקה סטטיסטית, פונקציית ההתפלגות ובוטסטרפ", "Statistical inference, the cdf, the bootstrap",
        cs("E05", "6", "7", "8"), prereq=["M6.3"]),
    mod("M6.5", "P6", "core", "הסקה פרמטרית: נראות מרבית ורווחי סמך", "Parametric inference", c("E05", "9"), prereq=["M6.4"]),
    mod("M6.6", "P6", "core", "בדיקת השערות וערכי p", "Hypothesis testing and p-values", c("E05", "10"), prereq=["M6.5"]),
    mod("M6.7", "P6", "core", "הסקה בייסיאנית ותורת ההחלטות", "Bayesian inference and decision theory", cs("E05", "11", "12"), prereq=["M6.5"]),
    mod("M6.8", "P6", "core", "רגרסיה לינארית ולוגיסטית", "Linear and logistic regression", c("E05", "13"), prereq=["M6.5"]),
    mod("M6.9", "P6", "adv", "מודלים רב-משתניים והסקה על אי-תלות", "Multivariate models, inference about independence",
        cs("E05", "14", "15"), prereq=["M6.8"]),
    mod("M6.10", "P6", "adv", "הסקה סיבתית, גרפים ומודלים לוג-לינאריים", "Causal inference, graphical and log-linear models",
        cs("E05", "16", "17", "18", "19"), prereq=["M6.9"]),
    mod("M6.11", "P6", "core", "שיטות סימולציה", "Simulation methods", c("E05", "24"), prereq=["M6.7"]),
    mod("M6.12", "P6", "ref", "Lehman: פרקי ההסתברות שחוזרים על Wasserman", "Lehman's probability chapters that repeat Wasserman",
        pick("E20", "17", ["17.1", "17.2", "17.5", "17.6"], "נלמד מ-Wasserman 1–3, M6.2", "supp"),
        pick("E20", "18", ["18.2", "18.3", "18.4", "18.5", "18.7", "18.8"], "נלמד מ-Wasserman 1–3, M6.2", "supp"),
        sup("E20", "19", "19: Random Variables (נלמד מ-Wasserman 2–3, M6.2)"), sup("E20", "20", "20: Deviation from the Mean (נלמד מ-Wasserman 4–5, M6.3)"),
        prereq=["M6.3"]),

    # ---------------- P7 ----------------
    mod("M7.1", "P7", "core", "תהליכים אקראיים ושרשראות מרקוב", "Random processes and Markov chains",
        sec("K2", "XI", "5", "6"), c("E05", "23"), c("E02", "9"), sup("E20", "21"), prereq=["M6.3"]),
    mod("M7.2", "P7", "core", "ספקטרום הספק", "Power spectral density", c("E02", "10"), prereq=["M7.1", "M4.6"]),
    mod("M7.3", "P7", "core", "מודלים הסתברותיים, שערוך MMSE ומסנן וינר", "Probabilistic models, MMSE estimation, Wiener filtering",
        cs("E02", "7", "8", "11"), prereq=["M7.2"]),
    mod("M7.4", "P7", "core", "בדיקת השערות וגילוי אותות", "Hypothesis testing and signal detection",
        cs("E02", "13", "14"), c("E23", "A", "A: Detection and estimation in Gaussian noise", "supp"), prereq=["M7.3", "M6.6"]),
    mod("M7.5", "P7", "core", "מבוא לתורת האינפורמציה: הסתברות, אנטרופיה והסקה", "Introduction to information theory, entropy, inference",
        cs("E04", "1", "2", "3"), prereq=["M6.7"]),
    mod("M7.6", "P7", "core", "דחיסה: משפט קידוד המקור, קודי סמלים וזרם", "Source coding theorem, symbol and stream codes",
        cs("E04", "4", "5", "6", "7"), prereq=["M7.5"]),
    mod("M7.7", "P7", "core", "ערוץ רועש ומשפט הקידוד של שאנון", "The noisy channel and Shannon's coding theorem",
        cs("E04", "8", "9", "10"), c("E04", "15", "15: Further exercises on information theory", "ex"),
        c("E23", "B", "B: Information theory from first principles", "supp"), prereq=["M7.6"]),
    mod("M7.8", "P7", "adv", "ערוצים מוגבלים, פענוח צפנים ואינפורמציה באבולוציה", "Constrained channels, codebreaking, information in evolution",
        c("E04", "17"), prereq=["M7.7"]),
    mod("M7.9", "P7", "core", "אשכול, נראות מרבית ומניה מלאה", "Clustering, maximum likelihood, exact enumeration",
        cs("E04", "20", "21", "22"), prereq=["M7.5"]),
    mod("M7.10", "P7", "core", "התפלגויות שימושיות ומרגינליזציה מדויקת בסריגים ובגרפים", "Useful distributions, exact marginalization",
        cs("E04", "23", "24", "25", "26"), prereq=["M7.9"]),
    mod("M7.11", "P7", "core", "שיטת לפלס, השוואת מודלים ותער אוקאם", "Laplace's method, model comparison, Occam's razor",
        cs("E04", "27", "28"), prereq=["M7.10"]),
    mod("M7.12", "P7", "core", "שיטות מונטה קרלו", "Monte Carlo methods", cs("E04", "29", "30", "32"), prereq=["M7.11", "M6.11"]),
    mod("M7.13", "P7", "adv", "מודלי איזינג", "Ising models", c("E04", "31"), prereq=["M7.12"]),
    mod("M7.14", "P7", "adv", "שיטות וריאציוניות ו-ICA", "Variational methods and independent component analysis",
        cs("E04", "33", "34"), prereq=["M7.12"]),
    mod("M7.15", "P7", "core", "תורת ההחלטות, הסקה בייסיאנית מול תורת הדגימה", "Decision theory, Bayesian vs sampling theory",
        cs("E04", "35", "36", "37"), prereq=["M7.11"]),
    mod("M7.16", "P7", "ref", "נספחים: סימון, פיזיקה ומתמטיקה לתורת האינפורמציה", "Appendices: notation, some physics, some mathematics",
        *[c("E04", x, f"{x}: {title('E04', x)}") for x in "ABC"], prereq=["M7.5"]),

    # ---------------- P8 ----------------
    mod("M8.1", "P8", "core", "אלגברה לינארית: מרחבים לינאריים ומערכות משוואות", "Linear algebra: linear spaces and systems",
        sec("K3", "XVI", None, "3"), prereq=["M1.3"]),
    mod("M8.2", "P8", "core", "העתקות לינאריות, תבניות ריבועיות ופונקציות של מטריצות", "Linear transformations, quadratic forms, matrix functions",
        sec("K3", "XVI", "4", "6"), prereq=["M8.1"]),
    mod("M8.3", "P8", "core", "מכפלת מטריצות, אורתוגונליות ונורמות", "Matrix-vector multiplication, orthogonality, norms",
        cs("E07", "1", "2", "3"), c("E07", "A", "A: The definition of numerical analysis (מאמר)", "supp"), prereq=["M8.2"]),
    mod("M8.4", "P8", "core", "פירוק SVD", "The singular value decomposition", cs("E07", "4", "5"), prereq=["M8.3"]),
    mod("M8.5", "P8", "core", "הטלות, QR וריבועים פחותים", "Projectors, QR factorization, least squares",
        cs("E07", "6", "7", "8", "9", "10", "11"), prereq=["M8.4"]),
    mod("M8.6", "P8", "core", "התניה, נקודה צפה ויציבות אלגוריתמים", "Conditioning, floating point, stability",
        cs("E07", "12", "13", "14", "15", "16", "17", "18", "19"), prereq=["M8.5"]),
    mod("M8.7", "P8", "core", "פתרון מערכות משוואות: גאוס, ציר וכולסקי", "Gaussian elimination, pivoting, Cholesky",
        cs("E07", "20", "21", "22", "23"), prereq=["M8.6"]),
    mod("M8.8", "P8", "core", "בעיות ערכים עצמיים ואלגוריתמים", "Eigenvalue problems and algorithms",
        cs("E07", "24", "25"), prereq=["M8.7"]),
    mod("M8.9", "P8", "adv", "אלגוריתמי ערכים עצמיים ו-SVD בפועל", "Eigenvalue algorithms and computing the SVD",
        cs("E07", "26", "27", "28", "29", "30", "31"), prereq=["M8.8"]),
    mod("M8.10", "P8", "adv", "שיטות איטרטיביות: ארנולדי, GMRES, צמודי גרדיאנט", "Iterative methods: Arnoldi, GMRES, conjugate gradients",
        cs("E07", "32", "33", "34", "35", "36", "37", "38", "39", "40"), prereq=["M8.8"]),
    mod("M8.11", "P8", "core", "קירוב פונקציות: אינטרפולציה, אינטגרציה נומרית וצ'בישב", "Approximation of functions, interpolation, quadrature",
        sec("K2", "XII", None, "6"), prereq=["M1.2"]),
    mod("M8.12", "P8", "core", "שיטות קירוב וחישוב", "Approximation methods and computing techniques", c("K2", "XIII"), prereq=["M8.11"]),
    mod("M8.13", "P8", "core", "חשבון וריאציות ועקרון הפעולה המינימלית", "Calculus of variations and the principle of least action",
        c("K2", "VIII"), c("F2", "19"), prereq=["M1.2", "M2.4"]),
    mod("M8.14", "P8", "adv", "אנליזה פונקציונלית: מרחב הילברט ואופרטורים", "Functional analysis: Hilbert space and operators",
        c("K3", "XIX"), prereq=["M8.2", "M4.4"]),
    mod("M8.15", "P8", "core", "מבוא לאופטימיזציה", "Introduction to optimization", c("E06", "1"), prereq=["M8.5"]),
    mod("M8.16", "P8", "core", "קבוצות ופונקציות קמורות", "Convex sets and functions",
        cs("E06", "2", "3"), c("E06", "A", "A: Mathematical background", "supp"), prereq=["M8.15"]),
    mod("M8.17", "P8", "core", "בעיות אופטימיזציה קמורות", "Convex optimization problems", c("E06", "4"), prereq=["M8.16"]),
    mod("M8.18", "P8", "core", "דואליות", "Duality",
        c("E06", "5"), c("E06", "B", "B: Problems involving two quadratic functions", "supp"), prereq=["M8.17"]),
    mod("M8.19", "P8", "core", "קירוב והתאמה", "Approximation and fitting", c("E06", "6"), prereq=["M8.18"]),
    mod("M8.20", "P8", "core", "שערוך סטטיסטי כאופטימיזציה", "Statistical estimation", c("E06", "7"), prereq=["M8.19", "M6.5"]),
    mod("M8.21", "P8", "adv", "בעיות גאומטריות", "Geometric problems", c("E06", "8"), prereq=["M8.19"]),
    mod("M8.22", "P8", "core", "אלגוריתמים: מזעור בלי אילוצים ועם אילוצי שוויון", "Unconstrained and equality-constrained minimization",
        cs("E06", "9", "10"), c("E06", "C", "C: Numerical linear algebra background", "supp"), prereq=["M8.18", "M8.7"]),
    mod("M8.23", "P8", "adv", "שיטות נקודה פנימית", "Interior-point methods", c("E06", "11"), prereq=["M8.22"]),

    # ---------------- P9 ----------------
    mod("M9.1", "P9", "core", "קול, משוואת הגלים, פעימות, אופנים והרמוניות", "Sound, the wave equation, beats, modes, harmonics",
        cs("F1", "47", "48", "49", "50", "51"), prereq=["M3.2", "M4.4"]),
    mod("M9.2", "P9", "core", "חשבון דיפרנציאלי ואינטגרלי של שדות וקטוריים", "Vector calculus of fields",
        cs("F2", "2", "3"), prereq=["M1.6", "M1.2"]),
    mod("M9.3", "P9", "core", "אלקטרומגנטיות: מבט על", "Electromagnetism: overview", c("F2", "1"), prereq=["M9.2"]),
    mod("M9.4", "P9", "core", "אלקטרוסטטיקה וחוק גאוס", "Electrostatics and Gauss's law", cs("F2", "4", "5", "6", "7", "8"), prereq=["M9.3"]),
    mod("M9.18", "P9", "core", "בעיות שפה באלקטרוסטטיקה: לפלס, דמויות, הפרדת משתנים ופיתוח מולטיפולי", "Boundary-value problems: Laplace's equation, images, separation of variables, multipoles",
        c("E32", "3"), prereq=["M9.4", "M4.4"]),
    mod("M9.5", "P9", "ref", "חשמל באטמוספירה", "Electricity in the atmosphere", c("F2", "9"), prereq=["M9.4"]),
    mod("M9.6", "P9", "core", "דיאלקטריים", "Dielectrics", cs("F2", "10", "11"), prereq=["M9.4"]),
    mod("M9.7", "P9", "core", "מגנטוסטטיקה ופוטנציאל וקטורי", "Magnetostatics and the vector potential", cs("F2", "13", "14", "15"), prereq=["M9.4"]),
    mod("M9.8", "P9", "core", "זרמים מושרים וחוקי ההשראה", "Induced currents and the laws of induction", cs("F2", "16", "17"), prereq=["M9.7"]),
    mod("M9.9", "P9", "core", "משוואות מקסוול, פתרונותיהן וקרינה אלקטרומגנטית", "Maxwell's equations, their solutions, EM radiation",
        cs("F2", "18", "20", "21"), c("F1", "28"),
        sup("F1", "34", "34: אפקטים יחסותיים בקרינה ודופלר (דלתא בליבה, מתוך M9.14)"),
        sup("F2", "27", "27: אנרגיה ותנע של השדה, וקטור פוינטינג (דלתא בליבה, מתוך M9.16)"),
        sec("F2", "32", "32-1", "32-4", "32 §32-1–32-4: מקדם שבירה בחומר צפוף (דלתא בליבה, מתוך M9.14)", "supp"),
        sec("F2", "32", "32-6", "32-7", "32 §32-6–32-7: גלים במתכות ועומק חדירה (דלתא בליבה, מתוך M9.14)", "supp"),
        sup("F2", "33", "33: החזרה מפני שטח, משוואות פרנל (דלתא בליבה, מתוך M9.14)"), prereq=["M9.8", "M9.1"]),
    mod("M9.17", "P9", "core", "תורת השדות למהנדס: גלים מישוריים בתווך, תנאי שפה, החזרה בזווית ומשפטים שימושיים", "Electromagnetic theory for engineers: plane waves in media, boundary conditions, oblique reflection, useful theorems",
        c("E53", "1"), prereq=["M9.9"]),
    mod("M9.19", "P9", "core", "קרינה: דיפול חשמלי ומגנטי, עוצמה קרינתית ומטען נקודתי", "Radiation: electric and magnetic dipoles, radiated power, point charges",
        c("E32", "11"), prereq=["M9.9", "M9.18"]),
    mod("M9.10", "P9", "core", "תנועת מטענים בשדות חשמליים ומגנטיים", "Motion of charges in electric and magnetic fields", c("F2", "29"), prereq=["M9.9"]),
    mod("M9.11", "P9", "core", "מהודי חלל ומוליכי גל", "Cavity resonators and waveguides", cs("F2", "23", "24"), prereq=["M9.9"]),
    mod("M9.12", "P9", "core", "אופטיקה: עקרון הזמן המינימלי ואופטיקה גאומטרית", "Optics: least time and geometrical optics",
        cs("F1", "26", "27"), prereq=["M8.13"]),
    mod("M9.13", "P9", "core", "התאבכות, עקיפה וקיטוב", "Interference, diffraction, polarization", cs("F1", "29", "30", "33"), prereq=["M9.9", "M9.12"]),
    mod("M9.14", "P9", "adv", "מקדם השבירה, פיזור, החזרה ואפקטים יחסותיים בקרינה", "Refractive index, scattering, reflection, relativistic radiation",
        cs("F1", "31", "32", "34"), cs("F2", "32", "33"), prereq=["M9.13"]),
    mod("M9.15", "P9", "ref", "ראיית צבע ומנגנוני הראייה", "Color vision and mechanisms of seeing", cs("F1", "35", "36"), prereq=["M9.13"]),
    mod("M9.16", "P9", "adv", "אנרגיה ותנע של שדות ומסה אלקטרומגנטית", "Field energy and momentum, electromagnetic mass",
        cs("F2", "27", "28"), prereq=["M9.9"]),
    mod("M9.20", "P9", "ref", "Griffiths: שאר הספר", "Griffiths: the remaining chapters",
        refs("E32", "1", "2", "4", "5", "6", "7", "8", "9", "10", "12", "A", "B", "C"), prereq=["M9.18"]),

    # ---------------- P10 ----------------
    mod("M10.1", "P10", "core", "המשוואות הפשוטות של הפיזיקה המתמטית", "Partial differential equations of mathematical physics",
        c("K2", "VI"), prereq=["M3.1", "M9.1"]),
    mod("M10.2", "P10", "core", "אותן משוואות, אותם פתרונות: אנלוגיות אלקטרוסטטיות", "The same equations have the same solutions",
        c("F2", "12"), prereq=["M10.1", "M9.4"]),
    mod("M10.3", "P10", "core", "דיפוזיה", "Diffusion", c("F1", "43"), prereq=["M10.1"]),
    mod("M10.4", "P10", "core", "הפרשים סופיים: משוואות תנודה", "Finite differences: vibration ODEs", c("E08", "1"), prereq=["M3.2", "M8.12"]),
    mod("M10.5", "P10", "core", "הפרשים סופיים: משוואת הגלים", "Finite differences: wave equations", c("E08", "2"), prereq=["M10.4", "M10.1"]),
    mod("M10.6", "P10", "core", "הפרשים סופיים: משוואת הדיפוזיה", "Finite differences: diffusion equations", c("E08", "3"), prereq=["M10.5", "M10.3"]),
    mod("M10.7", "P10", "adv", "משוואות הסעה ובעיות לא-לינאריות", "Advection-dominated equations and nonlinear problems",
        cs("E08", "4", "5"), prereq=["M10.6"]),
    mod("M10.8", "P10", "adv", "ניתוח שגיאת קטיעה", "Truncation error analysis",
        c("E08", "A", "A: Useful formulas"), c("E08", "B", "B: Truncation error analysis"), prereq=["M10.6"]),
    mod("M10.9", "P10", "ref", "הנדסת תוכנה לסימולציה", "Software engineering for simulation", c("E08", "C", "C: Software engineering; wave equation model"),
        prereq=["M10.5"]),

    # ---------------- P11 ----------------
    mod("M11.15", "P11", "core", "ניתוח מעגלים: חוקי קירכהוף, צמתים ולולאות, ומשפטי תבנין ונורטון", "Circuit analysis: Kirchhoff's laws, nodal and mesh analysis, Thevenin and Norton",
        pick("E46", "2", span("E46", "2", "2.4", "2.7")), probs("E46", "2"), c("E46", "3"), c("E46", "4"), prereq=["M9.8"]),
    mod("M11.16", "P11", "core", "מעגלים מסדר ראשון ושני: תגובה חופשית ותגובת מדרגה", "First- and second-order circuits: natural and step response",
        pick("E46", "7", ["_pre"] + span("E46", "7", "7.1", "7.6")), probs("E46", "7"),
        pick("E46", "8", ["_pre"] + span("E46", "8", "8.1", "8.7")), probs("E46", "8"), prereq=["M11.15", "M3.1"]),
    mod("M11.17", "P11", "core", "פאזורים, ניתוח במצב מתמיד סינוסי והספק AC", "Phasors, sinusoidal steady-state analysis and AC power",
        c("E46", "9"), c("E46", "10"), c("E46", "11"), prereq=["M11.16", "M1.5", "M4.7"]),
    mod("M11.1", "P11", "core", "יסודות המעגלים: מתח, זרם, RC, דיודות ומעגלי זרם חילופין", "Circuit foundations and AC circuits",
        pick("E09a", "1", ["C3", "L3", "W"], "מעגלי דיודות; שאר הפרק הוחלף ב-Alexander & Sadiku, M11.15–M11.17"), c("F2", "22"),
        sup("E09", "APP:A", "נספח A: האוסצילוסקופ (מדידה, מתוך M11.14)"), sup("E09", "APP:F", "נספח F: קווי עומס (מתוך M11.14)"), prereq=["M9.8", "M4.7", "M11.17"]),
    mod("M11.2", "P11", "core", "טרנזיסטורים ביפולריים", "Bipolar transistors", c("E09", "2"), sup("E09a", "2"), prereq=["M11.1"]),
    mod("M11.3", "P11", "core", "טרנזיסטורי אפקט שדה", "Field-effect transistors",
        c("E09", "3"), sup("E09a", "3"), sup("E09a", "3-rev"), prereq=["M11.2"]),
    mod("M11.4", "P11", "core", "משוב ומגברי שרת", "Feedback and operational amplifiers", c("E09", "4"), sup("E09a", "4"), prereq=["M11.3", "M5.1"]),
    mod("M11.5", "P11", "core", "מסננים אקטיביים ומתנדים", "Active filters and oscillators", c("E09", "5"), sup("E09a", "4-5"), prereq=["M11.4", "M4.7"]),
    mod("M11.6", "P11", "core", "מייצבי מתח ומעגלי הספק", "Voltage regulators and power circuits", c("E09", "6"), sup("E09a", "6"), prereq=["M11.4"]),
    mod("M11.7", "P11", "core", "מעגלים מדויקים וטכניקות רעש נמוך", "Precision circuits and low-noise techniques", c("E09", "7"), prereq=["M11.4", "M7.2"]),
    mod("M11.8", "P11", "core", "אלקטרוניקה ספרתית", "Digital electronics", c("E09", "8"), sup("E09a", "8"), prereq=["M11.3"]),
    mod("M11.9", "P11", "core", "דיגיטלי פוגש אנלוגי: ממירים", "Digital meets analog: converters", c("E09", "9"), sup("E09a", "9"), prereq=["M11.8", "M4.8"]),
    mod("M11.10", "P11", "ref", "טכניקות בנייה אלקטרונית", "Electronic construction techniques", c("E09", "12"), prereq=["M11.6"]),
    mod("M11.11", "P11", "ref", "טכניקות תדר גבוה ומהירות גבוהה", "High-frequency and high-speed techniques", c("E09", "13", "13: High-frequency and high-speed techniques (1989; הוחלף ב-Pozar, M11.20 ולנצ'סטר M1.5–M1.7)"), prereq=["M11.5", "M9.11"]),
    mod("M11.12", "P11", "adv", "תכנון בהספק נמוך", "Low-power design", c("E09", "14"), prereq=["M11.9"]),
    mod("M11.13", "P11", "core", "מדידות ועיבוד אותות", "Measurements and signal processing", c("E09", "15"), prereq=["M11.9", "M7.2"]),
    mod("M11.18", "P11", "core", "מעגלים מצומדים מגנטית ושנאים", "Magnetically coupled circuits and transformers",
        c("E46", "13"), prereq=["M11.17", "M9.8"]),
    mod("M11.19", "P11", "core", "רשתות שני-שערים: פרמטרי Z, Y, h ו-ABCD", "Two-port networks: Z, Y, hybrid and ABCD parameters",
        pick("E46", "19", ["_pre"] + span("E46", "19", "19.2", "19.7")), probs("E46", "19"), prereq=["M11.17"]),
    mod("M11.20", "P11", "adv", "הנדסת RF: שיעור הפרש מול לנצ'סטר (תכן מגבר טרנזיסטור ומתנדים)", "RF engineering, the delta to Lanchester: transistor amplifier design and oscillators",
        pick("E53", "12", ["12.3", "12.4"], "קווי תמסורת, פרמטרי S, תיאום, רעש ו-IP3, יציבות והגבר, מערבלים, מצמדים ומסננים נלמדים בלנצ'סטר M1.5–M1.7"),
        pick("E53", "13", ["13.1", "13.2"]), probs("E53", "12"), probs("E53", "13"), prereq=["M11.5", "M11.19", "M9.17"]),
    mod("M11.14", "P11", "ref", "נספחים: אוסצילוסקופ, סכמות, נגדים וקווי עומס; ציוד ודפי נתונים", "Appendices: oscilloscope, schematics, data sheets",
        *[c("E09", x, f"{x}: {title('E09', x)}") for x in "ABCDEF"], *[c("E09a", x, f"{x}: {title('E09a', x)}") for x in "ABCD"],
        prereq=["M11.1"]),
    mod("M11.21", "P11", "ref", "Alexander & Sadiku: שאר הספר", "Alexander & Sadiku: the remaining chapters",
        refs("E46", "1", "5", "6", "14", "15", "16", "17", "18", "A", "B", "C", "D", "E", "F"),
        rest("E46", "2", span("E46", "2", "2.4", "2.7")), rest("E46", "7", ["_pre"] + span("E46", "7", "7.1", "7.6")),
        rest("E46", "8", ["_pre"] + span("E46", "8", "8.1", "8.7")), rest("E46", "19", ["_pre"] + span("E46", "19", "19.2", "19.7")), prereq=["M11.15"]),
    mod("M11.22", "P11", "ref", "Pozar: הפרקים שנלמדים בלנצ'סטר (M1.5–M1.7) ושאר הספר", "Pozar: the chapters taught in Lanchester (M1.5–M1.7) and the rest",
        refs("E53", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "14", "A"),
        rest("E53", "12", ["12.3", "12.4"]), rest("E53", "13", ["13.1", "13.2"]), prereq=["M11.20"]),
    mod("M11.23", "P11", "ref", "Hayes & Horowitz פרק 1: מעגלי DC ו-RC (הוחלף ב-Alexander & Sadiku)", "Hayes & Horowitz ch. 1: DC and RC circuits (replaced by Alexander & Sadiku)",
        pick("E09a", "1", ["OV", "C1", "L1", "C2", "L2"], "הוחלף ב-Alexander & Sadiku, M11.15–M11.17"), prereq=["M11.1"]),

    # ---------------- P12 ----------------
    mod("M12.1", "P12", "adv", "מגנטיות של חומרים, פרומגנטיות וחומרים מגנטיים", "Magnetism of matter, ferromagnetism, magnetic materials",
        cs("F2", "34", "36", "37"), prereq=["M9.8"]),
    mod("M12.2", "P12", "ref", "פרמגנטיות ותהודה מגנטית", "Paramagnetism and magnetic resonance", c("F2", "35"), prereq=["M12.1"]),
    mod("M12.3", "P12", "core", "מנועים חשמליים: היסודות", "Electric motors: the basics", c("E10", "1"), prereq=["M9.8", "M2.5", "M11.18"]),
    mod("M12.4", "P12", "core", "ממירי אלקטרוניקת הספק להנעה", "Power electronic converters for drives", c("E10", "2"), prereq=["M12.3", "M11.6"]),
    mod("M12.5", "P12", "core", "מנועי DC והנעתם", "DC motors and drives", cs("E10", "3", "4"), prereq=["M12.4"]),
    mod("M12.11", "P12", "core", "מעגלים תלת-פאזיים: חיבורי כוכב ומשולש והספק במערכת מאוזנת", "Three-phase circuits: wye and delta connections, power in balanced systems",
        c("E46", "12"), prereq=["M11.17"]),
    mod("M12.6", "P12", "core", "מנועי השראה: שדה מסתובב, החלקה ומומנט", "Induction motors",
        cs("E10", "5", "6"), c("E10", "APP:2", "נספח 2: המעגל השקול של מנוע השראה"), prereq=["M12.5", "M12.11"]),
    mod("M12.7", "P12", "core", "הפעלה בתדר משתנה ומהפכים", "Variable-frequency operation and inverter-fed drives", cs("E10", "7", "8"), prereq=["M12.6"]),
    mod("M12.8", "P12", "core", "מכונות סינכרוניות ומנועי מגנט קבוע", "Synchronous and brushless permanent-magnet machines", c("E10", "9"), prereq=["M12.7"]),
    mod("M12.9", "P12", "adv", "מנועי צעד ו-switched reluctance", "Stepping and switched-reluctance motors", c("E10", "10"), prereq=["M12.8"]),
    mod("M12.10", "P12", "core", "בחירת מנוע והנעה, ובקרה בחוג סגור", "Motor/drive selection and closed-loop control",
        c("E10", "11"), c("E10", "APP:1", "נספח 1: מבוא לבקרה בחוג סגור"), prereq=["M12.8", "M5.9"]),

    # ---------------- P13 ----------------
    mod("M13.1", "P13", "core", "התורה הקינטית של הגזים", "The kinetic theory of gases", c("F1", "39"), prereq=["M2.4"]),
    mod("M13.2", "P13", "core", "מכניקה סטטיסטית, תנועה בראונית ויישומי התורה הקינטית", "Statistical mechanics, Brownian motion, applications",
        cs("F1", "40", "41", "42"), prereq=["M13.1", "M6.1"]),
    mod("M13.3", "P13", "core", "חוקי התרמודינמיקה, דוגמאות ומחגר ומחגר-עצר", "The laws of thermodynamics, illustrations, ratchet and pawl",
        cs("F1", "44", "45", "46"), prereq=["M13.2"]),
    mod("M13.20", "P13", "core", "פיזיקה סטטיסטית: פקטור בולצמן, פונקציית חלוקה, פרמי-דיראק ובוז-איינשטיין, גוף שחור ודביי", "Statistical physics: the Boltzmann factor, partition functions, Fermi-Dirac and Bose-Einstein, blackbody, Debye",
        pick("E33", "6", ["6.1", "6.2", "6.5", "6.6", "6.7"]), pick("E33", "7", span("E33", "7", "7.1", "7.5")), prereq=["M13.3"]),
    mod("M13.4", "P13", "core", "מושגי יסוד, אנרגיה ומעבר אנרגיה", "Basic concepts, energy and energy transfer", cs("E15", "1", "2"), prereq=["M13.3"]),
    mod("M13.5", "P13", "core", "תכונות של חומרים טהורים", "Properties of pure substances", cut("E15", "3", ["T"]), prereq=["M13.4"]),
    mod("M13.6", "P13", "core", "ניתוח אנרגיה של מערכות סגורות ונפחי בקרה", "Energy analysis of closed systems and control volumes",
        cut("E15", "4", ["T"]), c("E15", "5"), prereq=["M13.5"]),
    mod("M13.7", "P13", "core", "החוק השני ואנטרופיה", "The second law and entropy", cut("E15", "6", ["T"]), cut("E15", "7", ["T"]), prereq=["M13.6"]),
    mod("M13.8", "P13", "core", "אקסרגיה", "Exergy", cut("E15", "8", ["T"]), prereq=["M13.7"]),
    mod("M13.9", "P13", "core", "מחזורי כוח גז: אוטו, דיזל, בריטון וסילון", "Gas power cycles", cut("E15", "9", ["T"]), prereq=["M13.7"]),
    mod("M13.10", "P13", "core", "מחזורי קיטור ומחזורים משולבים", "Vapor and combined power cycles", c("E15", "10"), prereq=["M13.9"]),
    mod("M13.11", "P13", "core", "מחזורי קירור ומשאבות חום", "Refrigeration cycles and heat pumps", c("E15", "11"), prereq=["M13.10"]),
    mod("M13.12", "P13", "adv", "יחסי תכונות, תערובות גזים ומיזוג אוויר", "Property relations, gas mixtures, air conditioning",
        cs("E15", "12", "13"), prereq=["M13.7"]),
    mod("M13.13", "P13", "adv", "תגובות כימיות, בעירה ושיווי משקל", "Chemical reactions, combustion, equilibrium", cs("E15", "15", "16"), prereq=["M13.12"]),
    mod("M13.14", "P13", "ref", "טבלאות ותרשימי תכונות", "Property tables and charts",
        c("E15", "APP:1", "נספח 1: טבלאות ותרשימים ביחידות SI"), c("E15", "APP:2", "נספח 2: טבלאות ותרשימים ביחידות אנגליות"), prereq=["M13.5"]),
    mod("M13.15", "P13", "core", "מאזן האנרגיה: צריכה ומקורות", "The energy balance sheet: consumption and production",
        cs("E14", *[str(i) for i in range(1, 18) if i not in (9, 11, 13, 15, 17)]), prereq=["M13.4"]),
    mod("M13.16", "P13", "core", "הפיזיקה של הצריכה והמקורות: מכוניות, רוח, מטוסים, שמש, חימום, גלים, גאות", "Technical chapters: the physics behind the numbers",
        cs("E14", *"ABCDEFGH"), prereq=["M13.15", "M2.4"]),
    mod("M13.17", "P13", "core", "לחיות על אנרגיה בת-קיימא: תחבורה, חימום, גרעין, אגירה", "Living on sustainable energy: transport, heating, nuclear, storage",
        cs("E14", "20", "21", "24", "26"), prereq=["M13.16"]),
    mod("M13.18", "P13", "ref", "תוכניות אנרגיה, עלויות ונתונים", "Energy plans, costs and reference data",
        cs("E14", *[str(i) for i in range(27, 33)]), *[c("E14", x, f"{x}: {title('E14', x)}", "supp") for x in "IJK"], prereq=["M13.17"]),
    mod("M13.25", "P13", "core", "סוללות: עקרונות התא ומודל מעגל שקול (OCV, SOC, דיפוזיה והיסטרזיס)", "Batteries: how cells work and the equivalent-circuit model (OCV, SOC, diffusion, hysteresis)",
        rest("E36", "1", ["1.6"]), c("E36", "2"), prereq=["M13.17", "M11.16"]),
    mod("M13.21", "P13", "ref", "Schroeder: שאר הספר", "Schroeder: the remaining chapters",
        refs("E33", "1", "2", "3", "4", "5", "8", "A", "B"), pick("E33", "6", ["6.3", "6.4"]), pick("E33", "7", ["7.6"]), prereq=["M13.20"]),
    mod("M13.26", "P13", "ref", "Çengel ו-MacKay: מיזוג אוויר, נושאים מיוחדים, וצריכה ומדיניות בבריטניה", "Çengel and MacKay: air conditioning, topics of special interest, UK consumption and policy",
        c("E15", "14"), *[pick("E15", x, ["T"], "Topic of Special Interest") for x in "346789"],
        refs("E14", "9", "11", "13", "15", "17", "18", "19", "22", "23", "25"), prereq=["M13.7", "M13.15"]),
    mod("M13.27", "P13", "ref", "Plett: שאר הספר", "Plett: the remaining chapters",
        pick("E36", "1", ["1.6"]), refs("E36", "3", "4", "5", "6", "7", "A"), prereq=["M13.25"]),

    # ---------------- P14 ----------------
    mod("M14.1", "P14", "core", "מבוא למעבר חום", "Introduction to heat transfer", c("E16", "1"), prereq=["M13.4", "M10.3"]),
    mod("M14.2", "P14", "core", "הולכה, תנגודת תרמית ומקדם מעבר חום כולל", "Conduction, thermal resistance, overall coefficient",
        c("E16", "2"), prereq=["M14.1"]),
    mod("M14.3", "P14", "core", "תכנון מחליפי חום", "Heat exchanger design", c("E16", "3"), prereq=["M14.2"]),
    mod("M14.4", "P14", "core", "ניתוח הולכה, ניתוח ממדים וצלעות קירור", "Conduction analysis, dimensional analysis, fins", c("E16", "4"), prereq=["M14.2"]),
    mod("M14.5", "P14", "core", "הולכה בלתי יציבה ורב-ממדית", "Transient and multidimensional conduction", c("E16", "5"), prereq=["M14.4", "M10.6"]),
    mod("M14.6", "P14", "core", "שכבות גבול למינריות וטורבולנטיות", "Laminar and turbulent boundary layers", c("E16", "6"), prereq=["M14.5"]),
    mod("M14.13", "P14", "core", "טורבולנציה: ממוצע ריינולדס ובעיית הסגירה, מפל האנרגיה וסקאלות קולמוגורוב", "Turbulence: Reynolds averaging and closure, the energy cascade, Kolmogorov scales",
        c("E37", "1"), pick("E37", "2", ["2.1"]), pick("E37", "3", ["3.1", "3.2"]), pick("E37", "8", ["8.1", "8.2", "8.3"]), prereq=["M14.6"]),
    mod("M14.7", "P14", "core", "הסעה מאולצת", "Forced convection", c("E16", "7"), prereq=["M14.6"]),
    mod("M14.8", "P14", "adv", "הסעה טבעית ועיבוי", "Natural convection and film condensation", c("E16", "8"), prereq=["M14.7"]),
    mod("M14.9", "P14", "adv", "רתיחה ומעברי פאזה", "Boiling and phase change", c("E16", "9"), prereq=["M14.8"]),
    mod("M14.10", "P14", "core", "מעבר חום בקרינה", "Radiative heat transfer", c("E16", "10"), prereq=["M14.2", "M9.9"]),
    mod("M14.11", "P14", "adv", "מבוא להעברת מסה", "Introduction to mass transfer",
        pick("E16", "11", ["_pre"] + span("E16", "11", "11.1", "11.4")), pick("E16", "11", ["P", "R"], "תרגילים ומקורות"), prereq=["M14.7"]),
    mod("M14.12", "P14", "ref", "תכונות תרמופיזיקליות, יחידות וסימונים", "Thermophysical properties, units, nomenclature",
        *[c("E16", x, f"{x}: {title('E16', x)}") for x in "ABC"], prereq=["M14.1"]),
    mod("M14.14", "P14", "ref", "Tennekes & Lumley ושאר העברת המסה של Lienhard", "Tennekes & Lumley, the rest; and the rest of Lienhard's mass transfer",
        pick("E37", "2", span("E37", "2", "2.2", "2.5")), pick("E37", "3", ["3.3", "3.4"]), refs("E37", "4", "5", "6", "7"),
        pick("E37", "8", ["8.4", "8.5", "8.6"]), pick("E16", "11", span("E16", "11", "11.5", "11.11"), "מעבר ליעד"), prereq=["M14.13", "M14.11"]),

    # ---------------- P15 ----------------
    mod("M15.1", "P15", "core", "זרימת מים רטובים: צמיגות", "The flow of wet water: viscosity",
        c("F2", "41", "41: The Flow of Wet Water (פרק 40, זרימת מים יבשים, חסר בעותק)"), prereq=["M10.1", "M2.4"]),
    mod("M15.2", "P15", "ref", "מהנדסי האווירונאוטיקה הראשונים", "The first aeronautical engineers", c("E11", "1"), prereq=[]),
    mod("M15.3", "P15", "core", "מושגי יסוד: כוחות אווירודינמיים, גז אידאלי ואנטומיה של המטוס", "Fundamental thoughts",
        cut("E11", "2", ["2.8"]), prereq=["M13.1"]),
    mod("M15.4", "P15", "core", "האטמוספירה התקנית", "The standard atmosphere",
        cut("E11", "3", ["3.6"]), prereq=["M15.3"]),
    mod("M15.19", "P15", "core", "משוואות היסוד של האווירודינמיקה: רציפות, תנע, אנרגיה, מערבולת, סירקולציה ופונקציית זרם", "Fundamental principles and equations: continuity, momentum, energy, vorticity, circulation, stream function",
        cut("E38", "2", ["2.2"]), prereq=["M15.4", "M9.2", "M13.6"]),
    mod("M15.20", "P15", "core", "זרימה לא צמיגה ולא דחיסה: לפלס, זרימות יסודיות, קוטה-ז'וקובסקי ושיטת פנלים", "Inviscid incompressible flow: Laplace's equation, elementary flows, Kutta-Joukowski, the source panel method",
        cut("E38", "3", ["3.3", "3.4", "3.19", "3.20"]), prereq=["M15.19", "M10.1"]),
    mod("M15.21", "P15", "core", "פרופילי כנף: תנאי קוטה, תורת כנף דקה ושיטת פנלים מערבולתית", "Airfoils: the Kutta condition, thin airfoil theory, the vortex panel method",
        cut("E38", "4", ["4.14", "4.15"]), prereq=["M15.20"]),
    mod("M15.22", "P15", "core", "כנפיים סופיות: קו נושא של פרנדטל ושריג מערבולות", "Finite wings: Prandtl's lifting-line theory and the vortex lattice method",
        cut("E38", "5", ["5.7", "5.8"]), prereq=["M15.21"]),
    mod("M15.23", "P15", "core", "זרימה דחיסה: יסודות וגלי הלם ישרים", "Compressible flow: preliminary aspects and normal shock waves",
        cut("E38", "7", ["7.2"]), c("E38", "8"), prereq=["M15.19", "M13.7"]),
    mod("M15.24", "P15", "core", "גלי הלם אלכסוניים, התפשטות פרנדטל-מאייר, נחירים ומנהרות על-קוליות", "Oblique shocks, Prandtl-Meyer expansion, nozzles, diffusers and supersonic wind tunnels",
        cut("E38", "9", ["9.9", "9.11"]), c("E38", "10"), prereq=["M15.23"]),
    mod("M15.25", "P15", "core", "זרימה דחיסה תת-קולית מעל פרופילים: פרנדטל-גלאוארט, מאך קריטי והתבדרות גרר", "Subsonic compressible flow over airfoils: Prandtl-Glauert, critical Mach number, drag divergence",
        pick("E38", "11", ["_pre"] + span("E38", "11", "11.1", "11.9")), probs("E38", "11"), prereq=["M15.24", "M15.21"]),
    mod("M15.26", "P15", "core", "זרימה צמיגה: משוואות נאוויה-סטוקס, זרימת קואט ופתרונות נומריים", "Viscous flow: the Navier-Stokes equations, Couette flow, numerical solutions",
        c("E38", "15"), pick("E38", "16", ["_pre"] + span("E38", "16", "16.1", "16.3")), c("E38", "20"), prereq=["M15.19", "M14.6"]),
    mod("M15.5", "P15", "core", "אווירודינמיקה בסיסית: רציפות, תנע, אנרגיה, מהירות הקול ומדידת מהירות", "Basic aerodynamics: the equations, speed of sound, airspeed",
        pick("E11", "4", ["4.10", "4.11"], "§4.1–4.9 הוחלפו ב-Anderson, Fundamentals (M15.19–M15.23)"), probs("E11", "4"), prereq=["M15.4", "M15.1", "M13.6", "M15.19"]),
    mod("M15.6", "P15", "core", "זרימה דחיסה: מנהרות על-קוליות ומנועי רקטה", "Compressible flow, supersonic tunnels, rocket engines",
        pick("E15", "17", ["17-6", "17-7", "Sum", "R"], "Çengel: זרימת ריילי ונחירי קיטור; שאר הזרימה הדחיסה מ-Anderson, Fundamentals", "supp"), probs("E15", "17"), prereq=["M15.5", "M15.24"]),
    mod("M15.7", "P15", "ref", "זרימה צמיגה: שכבות גבול, מעבר, היפרדות וגרר", "Viscous flow: boundary layers, transition, separation",
        sec("E11", "4", "4.15", "4.27", "4 §4.15–4.27: זרימה צמיגה (נלמדת ב-Lienhard M14.6 וב-Anderson, Fundamentals M15.26)"), prereq=["M15.6", "M14.6"]),
    mod("M15.8", "P15", "core", "פרופילי כנף: מקדמים, לחץ, דחיסות וגרר גלי", "Airfoils: coefficients, pressure, compressibility, wave drag",
        pick("E11", "5", ["5.1", "5.12"], "§5.2–5.11 הוחלפו ב-Anderson, Fundamentals (M15.21, M15.25)"), prereq=["M15.7", "M15.21", "M15.25"]),
    mod("M15.9", "P15", "core", "כנפיים סופיות: גרר מושרה, כנפיים משוכות ומדפים", "Finite wings: induced drag, swept wings, flaps",
        pick("E11", "5", ["5.16", "5.17"], "§5.13–5.15 הוחלפו ב-Anderson, Fundamentals (M15.22)"), prereq=["M15.8", "M15.22"]),
    mod("M15.10", "P15", "core", "גלילים וכדורים, איך נוצר עילוי, והיסטוריה", "Cylinders and spheres, how lift is produced, history",
        pick("E11", "5", ["5.24"]), probs("E11", "5"), prereq=["M15.9"]),
    mod("M15.11", "P15", "core", "ביצועים: קוטב הגרר, דחף והספק נדרשים, טיפוס ותקרות", "Performance: drag polar, thrust and power, climb, ceilings",
        sec("E11", "6", None, "6.11"), prereq=["M15.9"]),
    mod("M15.12", "P15", "core", "ביצועים: טווח, שהייה, המראה, נחיתה, פנייה ושיטת האנרגיה", "Performance: range, endurance, takeoff, landing, turns",
        sec("E11", "6", "6.12", "6.19"), prereq=["M15.11"]),
    mod("M15.13", "P15", "core", "כטב\"מים, מיקרו-רחפנים ויעילות אווירודינמית", "UAVs, micro air vehicles, aerodynamic efficiency",
        pick("E11", "6", span("E11", "6", "6.20", "6.23") + ["6.28"]), probs("E11", "6"), prereq=["M15.12"]),
    mod("M15.14", "P15", "core", "יציבות ושליטה", "Stability and control", cut("E11", "7", ["7.20", "7.21", "7.22"]), prereq=["M15.11", "M5.3", "M2.7"]),
    mod("M15.28", "P15", "core", "דינמיקת טיסה: משוואות התנועה, נגזרות יציבות ומצבי התנועה האורכיים והרוחביים", "Flight dynamics: equations of motion, stability derivatives, longitudinal and lateral modes",
        pick("E40", "3", span("E40", "3", "3.1", "3.6")), probs("E40", "3"), pick("E40", "4", ["4.1", "4.3", "4.4", "4.5", "4.6"]), probs("E40", "4"),
        pick("E40", "5", span("E40", "5", "5.1", "5.4")), probs("E40", "5"), prereq=["M15.14", "M2.7", "M5.4"]),
    mod("M15.15", "P15", "ref", "טיסה בחלל", "Space flight (astronautics)", c("E11", "8"), prereq=["M2.2", "M15.6"]),
    mod("M15.16", "P15", "core", "הנעה: מדחפים, מנועי בוכנה, סילון ורקטות", "Propulsion",
        cut("E11", "9", span("E11", "9", "9.4", "9.11") + span("E11", "9", "9.14", "9.17")),
        cut("E39", "5"), pick("E39", "7", ["_pre"] + span("E39", "7", "7.2", "7.5")), probs("E39", "7"),
        pick("E39", "11", span("E39", "11", "11.1", "11.3"), "תורת הנחיר הרקטי, במקום Sutton & Biblarz שלא הגיע"), prereq=["M15.6", "M13.9", "M15.24"]),
    mod("M15.17", "P15", "adv", "כלי טיס היפרסוניים", "Hypersonic vehicles", c("E11", "10"), prereq=["M15.16"]),
    mod("M15.18", "P15", "ref", "סמלים ומקדמי המרה", "Symbols and conversion factors", c("E11", "C", "C: Symbols and conversion factors"), prereq=["M15.3"]),
    mod("M15.27", "P15", "ref", "Anderson, Fundamentals of Aerodynamics: שאר הספר", "Anderson, Fundamentals of Aerodynamics: the rest",
        refs("E38", "1", "6", "12", "13", "14", "17", "18", "19", "A", "B", "C", "D", "E"),
        pick("E38", "2", ["2.2"]), pick("E38", "3", ["3.3", "3.4", "3.19", "3.20"]), pick("E38", "4", ["4.14", "4.15"]), pick("E38", "5", ["5.7", "5.8"]),
        pick("E38", "7", ["7.2"]), pick("E38", "9", ["9.9", "9.11"]), rest("E38", "11", ["_pre"] + span("E38", "11", "11.1", "11.9")),
        rest("E38", "16", ["_pre"] + span("E38", "16", "16.1", "16.3")), prereq=["M15.19"]),
    mod("M15.29", "P15", "ref", "Nelson ו-Hill & Peterson: שאר הספרים", "Nelson and Hill & Peterson: the remaining chapters",
        refs("E40", "1", "2", "6", "7", "8", "9", "10", "A", "B", "C", "D"), pick("E40", "3", ["3.7"]), pick("E40", "4", ["4.2", "4.7", "4.8", "4.9"]),
        pick("E40", "5", ["5.5", "5.6"]),
        refs("E39", "1", "2", "3", "4", "6", "8", "9", "10", "12", "13", "14", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"),
        pick("E39", "7", span("E39", "7", "7.6", "7.11")), pick("E39", "11", ["11.4"]), probs("E39", "11"), prereq=["M15.28", "M15.16"]),
    mod("M15.30", "P15", "ref", "Introduction to Flight: הסעיפים שהוחלפו, הערות היסטוריות ונספחי נתונים", "Introduction to Flight: replaced sections, historical notes, data appendices",
        pick("E11", "2", ["2.8"]), pick("E11", "3", ["3.6"]), c("E11", "A", "A: Standard atmosphere, SI"), c("E11", "B", "B: Standard atmosphere, English units"),
        pick("E11", "4", ["_pre"] + span("E11", "4", "4.1", "4.9") + span("E11", "4", "4.12", "4.14"), "הוחלף ב-Anderson, Fundamentals"),
        pick("E11", "5", span("E11", "5", "5.2", "5.11") + span("E11", "5", "5.13", "5.15") + span("E11", "5", "5.18", "5.23")),
        c("E11", "D", "D: Airfoil data"), pick("E11", "6", span("E11", "6", "6.24", "6.27")), pick("E11", "7", ["7.20", "7.21", "7.22"]),
        pick("E11", "9", span("E11", "9", "9.4", "9.11"), "הוחלף ב-Hill & Peterson, M15.16"), pick("E11", "9", span("E11", "9", "9.14", "9.17")),
        pick("E15", "17", ["_pre"] + span("E15", "17", "17-1", "17-5"), "Çengel: הוחלף ב-Anderson, Fundamentals"), prereq=["M15.3"]),

    # ---------------- P16 ----------------
    mod("M16.1", "P16", "core", "טנזורים, אלסטיות וחומרים אלסטיים", "Tensors, elasticity, elastic materials",
        cs("F2", "31", "38", "39"), prereq=["M8.2", "M2.5"]),
    mod("M16.2", "P16", "core", "מתיחה, לחיצה, גזירה ואיברים בעומס צירי", "Tension, compression, shear, axially loaded members",
        cs("E13", "1", "2"), cs("E13a", "1", "2"), prereq=["M16.1", "M2.6"]),
    mod("M16.3", "P16", "core", "פיתול", "Torsion", c("E13", "3"), c("E13a", "3"), prereq=["M16.2"]),
    mod("M16.4", "P16", "core", "כוחות גזירה, מומנטי כפיפה ומאמצים בקורות", "Shear forces, bending moments, stresses in beams",
        cs("E13", "4", "5", "6"), cs("E13a", "4", "5", "6"), prereq=["M16.2"]),
    mod("M16.5", "P16", "core", "ניתוח מאמץ ועיבור ויישומי מאמץ מישורי", "Analysis of stress and strain, plane stress applications",
        cs("E13", "7", "8"), cs("E13a", "7", "8"), prereq=["M16.4"]),
    mod("M16.6", "P16", "core", "שקיעת קורות וקורות לא מסוימות סטטית", "Deflections of beams, statically indeterminate beams",
        cs("E13", "9", "10"), cs("E13a", "9", "10"), prereq=["M16.4"]),
    mod("M16.23", "P16", "core", "קורות דקות-דופן: כפיפה לא סימטרית, זרימת גזירה, מרכז גזירה ופיתול של חתכים פתוחים וסגורים", "Thin-walled beams: unsymmetrical bending, shear flow, shear centre, torsion of open and closed sections",
        pick("E43", "16", ["16.2", "16.4"]), probs("E43", "16"), cut("E43", "17"), cut("E43", "18"), prereq=["M16.6", "M16.5"]),
    mod("M16.7", "P16", "core", "עמודים וקריסה", "Columns and buckling", c("E13", "11"), c("E13a", "11"), prereq=["M16.6"]),
    mod("M16.19", "P16", "core", "עייפות: S-N, מקדמי סיבולת, ריכוזי מאמץ, גודמן ונזק מצטבר", "Fatigue: S-N, endurance-limit factors, stress concentration, Goodman, cumulative damage",
        pick("E41", "6", ["_pre"] + span("E41", "6", "6.1", "6.4") + span("E41", "6", "6.7", "6.12") + ["6.14", "6.15"]), probs("E41", "6"), prereq=["M16.5", "M16.7"]),
    mod("M16.20", "P16", "core", "צירים, ברגים ומחברים: תכן ציר, מהירות קריטית, קשיחות חיבור ומתיחה מוקדמת", "Shafts, screws and fasteners: shaft design, critical speed, joint stiffness and preload",
        pick("E41", "7", ["_pre"] + span("E41", "7", "7.1", "7.6")), probs("E41", "7"), pick("E41", "8", span("E41", "8", "8.3", "8.11")), probs("E41", "8"), prereq=["M16.19", "M16.3"]),
    mod("M16.21", "P16", "core", "מסבים מתגלגלים וגלגלי שיניים: אורך חיים, אמינות, כוחות בשיניים ומשוואת לואיס", "Rolling bearings and gears: life, reliability, tooth forces, the Lewis equation",
        pick("E41", "11", ["_pre"] + span("E41", "11", "11.1", "11.6")), probs("E41", "11"),
        pick("E41", "13", ["_pre"] + span("E41", "13", "13.1", "13.7") + ["13.13", "13.14"]), probs("E41", "13"),
        pick("E41", "14", ["_pre"] + span("E41", "14", "14.1", "14.4")), probs("E41", "14"), prereq=["M16.20"]),
    mod("M16.8", "P16", "ref", "מרכזי כובד, מומנטי התמד, טבלאות ושאלות חזרה", "Centroids, moments of inertia, reference tables, FE review problems",
        c("E13", "12"), *[c("E13", x, f"{x}: {title('E13', x)}", "supp") for x in "ABCDEFGH"], c("E13", "ANS", "תשובות לבעיות", "ex"),
        c("E13a", "12"), c("E13a", "A", "A: FE exam review problems", "ex"), prereq=["M16.2"]),
    mod("M16.9", "P16", "core", "מבוא לבחירת חומרים ותהליך התכנון", "Introduction to materials selection and the design process",
        cs("E12", "1", "2"), prereq=["M16.2"]),
    mod("M16.10", "P16", "core", "חומרים הנדסיים ותכונותיהם", "Engineering materials and their properties", c("E12", "3"), prereq=["M16.9"]),
    mod("M16.11", "P16", "core", "מפות תכונות החומרים", "Material property charts", c("E12", "4"), prereq=["M16.10"]),
    mod("M16.22", "P16", "core", "מכניקת שבר: מקדם עוצמת מאמץ, K_IC וגידול סדק בעייפות (חוק פריס)", "Fracture mechanics: the stress intensity factor, K_IC, fatigue crack growth (Paris law)",
        pick("E42", "2", ["_pre"] + span("E42", "2", "2.1", "2.6")), pick("E42", "9", ["_pre", "9.1", "9.2", "9.5"]), prereq=["M16.11", "M16.5"]),
    mod("M16.12", "P16", "core", "בחירת חומר: היסודות ומקרי בוחן", "Materials selection: the basics and case studies",
        c("E12", "5"), pick("E12", "6", ["_pre", "6.1", "6.2", "6.3", "6.4", "6.6", "6.7", "6.11", "6.18", "6.20", "6.21"]), c("E12", "C", "C: Material indices", "supp"), c("E12", "E", "E: Exercises", "ex"), prereq=["M16.11"]),
    mod("M16.13", "P16", "core", "אילוצים מרובים ויעדים סותרים", "Multiple constraints and conflicting objectives", cs("E12", "7", "8"), prereq=["M16.12", "M8.17"]),
    mod("M16.14", "P16", "core", "בחירת חומר וצורה", "Selection of material and shape",
        c("E12", "9"), pick("E12", "10", ["_pre", "10.1", "10.2", "10.9"]),
        pick("E12", "B", ["_pre", "B.0", "B.5", "B.6", "B.7", "B.16"], "לוחות, פיתול ודיסקות; שאר הנספח נלמד ב-Gere", "supp"), prereq=["M16.12", "M16.4"]),
    mod("M16.15", "P16", "adv", "תכנון חומרים היברידיים", "Designing hybrid materials", c("E12", "11"), pick("E12", "12", ["_pre", "12.1", "12.2", "12.9", "12.10"]), prereq=["M16.14"]),
    mod("M16.24", "P16", "core", "חומרים מרוכבים: יחסי מאמץ-עיבור בלמינה, קריטריוני כשל ותורת הלמינציה הקלאסית", "Composites: lamina stress-strain relations, failure criteria, classical lamination theory",
        pick("E44", "2", span("E44", "2", "2.1", "2.6") + ["2.9"]), pick("E44", "4", span("E44", "4", "4.1", "4.3")), prereq=["M16.15", "M16.5"]),
    mod("M16.16", "P16", "adv", "תהליכי ייצור ובחירתם", "Processes and process selection", cs("E12", "13", "14"), prereq=["M16.12"]),
    mod("M16.17", "P16", "adv", "חומרים והסביבה, עיצוב תעשייתי וכוחות שינוי", "Materials and the environment, industrial design, forces for change",
        c("E12", "15"), prereq=["M16.12"]),
    mod("M16.18", "P16", "ref", "נתוני חומרים ומקורות מידע", "Data for engineering materials and data sources",
        c("E12", "A", "A: Data for engineering materials"), c("E12", "D", "D: Data sources for documentation"), prereq=["M16.10"]),
    mod("M16.25", "P16", "ref", "Shigley: שאר הספר", "Shigley: the remaining chapters",
        refs("E41", "1", "2", "3", "4", "5", "9", "10", "12", "15", "16", "17", "18", "19", "20", "A"),
        rest("E41", "6", ["_pre"] + span("E41", "6", "6.1", "6.4") + span("E41", "6", "6.7", "6.12") + ["6.14", "6.15"]),
        rest("E41", "7", ["_pre"] + span("E41", "7", "7.1", "7.6")), rest("E41", "8", span("E41", "8", "8.3", "8.11")),
        rest("E41", "11", ["_pre"] + span("E41", "11", "11.1", "11.6")), rest("E41", "13", ["_pre"] + span("E41", "13", "13.1", "13.7") + ["13.13", "13.14"]),
        rest("E41", "14", ["_pre"] + span("E41", "14", "14.1", "14.4")), prereq=["M16.21"]),
    mod("M16.26", "P16", "ref", "Janssen, Megson ו-Jones: שאר הספרים", "Janssen, Megson and Jones: the remaining chapters",
        refs("E42", "1", "3", "4", "5", "6", "7", "8", "10", "11", "12", "13"), rest("E42", "2", ["_pre"] + span("E42", "2", "2.1", "2.6")),
        rest("E42", "9", ["_pre", "9.1", "9.2", "9.5"]),
        refs("E43", *[str(i) for i in range(1, 29) if i not in (16, 17, 18)], "A"), rest("E43", "16", ["16.2", "16.4"]),
        refs("E44", "1", "3", "5", "6", "7", "A", "B", "C", "D"), rest("E44", "2", span("E44", "2", "2.1", "2.6") + ["2.9"]),
        rest("E44", "4", span("E44", "4", "4.1", "4.3")), prereq=["M16.22", "M16.23", "M16.24"]),
    mod("M16.27", "P16", "ref", "Ashby: מקרי בוחן נוספים, נוסחאות שנלמדו ב-Gere, ועיצוב תעשייתי", "Ashby: further case studies, formulas taught in Gere, industrial design",
        pick("E12", "6", ["6.5", "6.8", "6.9", "6.10", "6.12", "6.13", "6.14", "6.15", "6.16", "6.17", "6.19"]),
        pick("E12", "10", span("E12", "10", "10.3", "10.8")), pick("E12", "12", span("E12", "12", "12.3", "12.8")),
        pick("E12", "B", span("E12", "B", "B.1", "B.4") + span("E12", "B", "B.8", "B.15"), "נלמד ב-Gere"), refs("E12", "16", "17"), prereq=["M16.12"]),

    # ---------------- P17 ----------------
    mod("M17.1", "P17", "core", "מבוא ולמידה מונחית", "Introduction and supervised learning", cs("E17", "1", "2"), prereq=["M6.8", "M8.5"]),
    mod("M17.2", "P17", "core", "רשתות נוירונים רדודות ועמוקות", "Shallow and deep neural networks",
        cs("E17", "3", "4"), sup("E04", "40"), prereq=["M17.1"]),
    mod("M17.3", "P17", "core", "פונקציות הפסד ולמידה כהסקה", "Loss functions and learning as inference",
        c("E17", "5"), sup("E04", "41"), prereq=["M17.2", "M6.5"]),
    mod("M17.4", "P17", "core", "התאמת מודלים: ירידה בגרדיאנט, גרדיאנטים ואתחול", "Fitting models: gradient descent, backpropagation, initialization",
        cs("E17", "6", "7"), prereq=["M17.3", "M8.22"]),
    mod("M17.5", "P17", "core", "מדידת ביצועים ורגולריזציה", "Measuring performance and regularization", cs("E17", "8", "9"), prereq=["M17.4"]),
    mod("M17.6", "P17", "core", "רשתות קונבולוציה ורשתות שיוריות", "Convolutional and residual networks", cs("E17", "10", "11"), prereq=["M17.5", "M4.2"]),
    mod("M17.7", "P17", "core", "טרנספורמרים", "Transformers", c("E17", "12"), prereq=["M17.6"]),
    mod("M17.8", "P17", "adv", "רשתות נוירונים על גרפים", "Graph neural networks", c("E17", "13"), prereq=["M17.7"]),
    mod("M17.9", "P17", "core", "למידה בלתי מונחית ורשתות יריבות (GAN)", "Unsupervised learning and GANs", cs("E17", "14", "15"), prereq=["M17.5"]),
    mod("M17.10", "P17", "adv", "זרימות מנרמלות ומקודדים וריאציוניים", "Normalizing flows and variational autoencoders",
        cs("E17", "16", "17"), prereq=["M17.9", "M7.14"]),
    mod("M17.11", "P17", "core", "מודלי דיפוזיה", "Diffusion models", c("E17", "18"), prereq=["M17.10"]),
    mod("M17.12", "P17", "core", "למה למידה עמוקה עובדת, ואתיקה", "Why deep learning works, and ethics", cs("E17", "20", "21"), prereq=["M17.7"]),
    mod("M17.13", "P17", "ref", "נספחים: סימון, מתמטיקה והסתברות ללמידה עמוקה", "Appendices: notation, mathematics, probability",
        *[c("E17", x, f"{x}: {title('E17', x)}") for x in "ABC"], prereq=["M17.1"]),
    mod("M17.14", "P17", "adv", "רשתות הופפילד, מכונות בולצמן, תהליכים גאוסיים ודקונבולוציה", "Hopfield networks, Boltzmann machines, Gaussian processes, deconvolution",
        cs("E04", "45", "46"), prereq=["M17.4", "M7.12"]),
    mod("M17.15", "P17", "core", "שיטות לא-פרמטריות, החלקה וסיווג", "Nonparametric estimation, smoothing, classification",
        cs("E05", "20", "21", "22"), prereq=["M6.8", "M4.4"]),
    mod("M17.16", "P17", "core", "הסטת התפלגות וכיול: זיהוי, חוסן והסתגלות; הערכת מודלים מנבאים", "Distribution shift and calibration: detection, robustness, adaptation; evaluating predictive models",
        pick("E49a", "14", ["14.2"]), c("E49b", "19"), prereq=["M17.5", "M6.7"]),
    mod("M17.17", "P17", "ref", "Murphy, PML: Advanced Topics: שאר הספר; ופרקי MacKay שחוזרים על Prince", "Murphy, PML: Advanced Topics, the rest; and MacKay's chapters that repeat Prince",
        refs("E49a", *[str(i) for i in range(1, 18) if i != 14]), rest("E49a", "14", ["14.2"]),
        refs("E49b", *[str(i) for i in range(17, 37) if i != 19]),
        sups("E04", "38", "39", "44"), cs("E04", "42", "43"), prereq=["M17.16"]),

    # ---------------- P18 ----------------
    mod("M18.1", "P18", "core", "מבוא ובנדיטים רב-זרועיים", "Introduction and multi-armed bandits", cs("E18", "1", "2"), prereq=["M6.7"]),
    mod("M18.2", "P18", "core", "תהליכי החלטה מרקוביים ותכנות דינמי", "Finite MDPs and dynamic programming", cs("E18", "3", "4"), prereq=["M18.1", "M7.1"]),
    mod("M18.3", "P18", "core", "מונטה קרלו, הפרש זמני ו-n צעדים", "Monte Carlo, temporal-difference, n-step bootstrapping",
        cs("E18", "5", "6", "7"), prereq=["M18.2"]),
    mod("M18.4", "P18", "core", "תכנון ולמידה בשיטות טבלאיות", "Planning and learning with tabular methods", c("E18", "8"), prereq=["M18.3"]),
    mod("M18.5", "P18", "core", "קירוב פונקציות בחיזוי ובבקרה", "On-policy prediction and control with approximation", cs("E18", "9", "10"), prereq=["M18.4", "M17.4"]),
    mod("M18.6", "P18", "adv", "שיטות off-policy ועקבות זכאות", "Off-policy methods and eligibility traces", cs("E18", "11", "12"), prereq=["M18.5"]),
    mod("M18.7", "P18", "core", "שיטות גרדיאנט מדיניות ולמידה מחיזוקים עמוקה", "Policy gradient methods and deep RL",
        c("E18", "13"), c("E17", "19", "19: Reinforcement learning (Prince)", "supp"), prereq=["M18.5"]),
    mod("M18.8", "P18", "ref", "פסיכולוגיה ומדעי המוח", "Psychology and neuroscience", cs("E18", "14", "15"), prereq=["M18.3"]),
    mod("M18.9", "P18", "core", "יישומים, מקרי בוחן וחזיתות", "Applications, case studies, frontiers", cs("E18", "16", "17"), prereq=["M18.7"]),
    mod("M18.10", "P18", "core", "למידה מחיזוקים אופליין: הערכה מחוץ למדיניות, הסטת התפלגות, אילוצי מדיניות ו-CQL", "Offline reinforcement learning: off-policy evaluation, distribution shift, policy constraints, CQL",
        cs("E50", "1", "2", "3", "4", "5", "6", "7"), prereq=["M18.7"]),

    # ---------------- P19 ----------------
    mod("M19.1", "P19", "core", "מבוא ומרחב התצורה", "Preview and configuration space", cs("E19", "1", "2"), prereq=["M8.2", "M2.5"]),
    mod("M19.2", "P19", "core", "תנועות של גוף קשיח", "Rigid-body motions",
        c("E19", "3"), c("E19", "B", "B: Other representations of rotations", "supp"), prereq=["M19.1", "M8.8"]),
    mod("M19.3", "P19", "core", "קינמטיקה ישירה", "Forward kinematics",
        c("E19", "4"), c("E19", "C", "C: Denavit–Hartenberg parameters", "supp"), prereq=["M19.2"]),
    mod("M19.4", "P19", "core", "קינמטיקת מהירויות וסטטיקה", "Velocity kinematics and statics", c("E19", "5"), prereq=["M19.3"]),
    mod("M19.5", "P19", "core", "קינמטיקה הפוכה ושרשראות סגורות", "Inverse kinematics and closed chains", cs("E19", "6", "7"), prereq=["M19.4"]),
    mod("M19.6", "P19", "core", "דינמיקה של שרשראות פתוחות", "Dynamics of open chains", c("E19", "8"), prereq=["M19.4", "M8.13"]),
    mod("M19.7", "P19", "core", "יצירת מסלולים ותכנון תנועה", "Trajectory generation and motion planning", cs("E19", "9", "10"), prereq=["M19.6"]),
    mod("M19.8", "P19", "core", "בקרת רובוטים", "Robot control", c("E19", "11"), prereq=["M19.6", "M5.9"]),
    mod("M19.9", "P19", "adv", "אחיזה ומניפולציה", "Grasping and manipulation", c("E19", "12"), prereq=["M19.8"]),
    mod("M19.10", "P19", "core", "רובוטים ניידים על גלגלים", "Wheeled mobile robots", c("E19", "13"), prereq=["M19.7"]),
    mod("M19.11", "P19", "ref", "נוסחאות שימושיות ואופטימיזציה עם כופלי לגרנז'", "Useful formulas, optimization and Lagrange multipliers",
        c("E19", "A", "A: Summary of useful formulas"), c("E19", "D", "D: Optimization and Lagrange multipliers"), prereq=["M19.1"]),

    # ---------------- P20 ----------------
    mod("M20.1", "P20", "core", "מהי הוכחה, עקרון הסדר הטוב ונוסחאות לוגיות", "Proofs, well ordering, logical formulas",
        cs("E20", "I", "1", "2", "3"), prereq=["M0.1"]),
    mod("M20.2", "P20", "core", "טיפוסי נתונים מתמטיים ואינדוקציה", "Mathematical data types and induction", cs("E20", "4", "5"), prereq=["M20.1"]),
    mod("M20.3", "P20", "adv", "מכונות מצבים וטיפוסי נתונים רקורסיביים", "State machines and recursive data types", cs("E20", "6", "7"), prereq=["M20.2"]),
    mod("M20.4", "P20", "ref", "קבוצות אינסופיות", "Infinite sets", c("E20", "8"), prereq=["M20.2"]),
    mod("M20.5", "P20", "core", "תורת המספרים ומספרים ראשוניים", "Number theory and prime numbers",
        cs("E20", "II", "9"), c("K2", "X"), prereq=["M20.2"]),
    mod("M20.6", "P20", "core", "גרפים מכוונים, סדרים חלקיים ורשתות תקשורת", "Directed graphs, partial orders, communication networks",
        cs("E20", "10", "11"), prereq=["M20.2"]),
    mod("M20.7", "P20", "core", "גרפים פשוטים וגרפים מישוריים", "Simple and planar graphs", cs("E20", "12", "13"), prereq=["M20.6"]),
    mod("M20.8", "P20", "core", "סכומים ואסימפטוטיקה", "Sums and asymptotics", cs("E20", "III", "14"), prereq=["M20.2", "M1.2"]),
    mod("M20.9", "P20", "core", "כללי ספירה ופונקציות יוצרות", "Cardinality rules and generating functions", cs("E20", "15", "16"), prereq=["M20.8"]),
    mod("M20.10", "P20", "adv", "נוסחאות נסיגה", "Recurrences", cs("E20", "V", "22"), prereq=["M20.9"]),

    # ---------------- P21 ----------------
    mod("M21.1", "P21", "core", "מבוא לתכנון אלגוריתמים וניתוח אלגוריתמים", "Algorithm design and analysis", skiena("1", "2"), prereq=["M20.8"]),
    mod("M21.2", "P21", "core", "מבני נתונים", "Data structures", skiena("3"), pick("E21", "15", ["_pre", "15.3", "15.6"], role="supp"), prereq=["M21.1"]),
    mod("M21.3", "P21", "core", "מיון והפרד ומשול", "Sorting, divide and conquer", skiena("4", "5"), prereq=["M21.2", "M20.10"]),
    mod("M21.4", "P21", "core", "גיבוב ואלגוריתמים אקראיים", "Hashing and randomized algorithms",
        skiena("6"), sup("E04", "12"), prereq=["M21.2", "M6.2"]),
    mod("M21.5", "P21", "core", "סריקת גרפים ואלגוריתמים על גרפים ממושקלים", "Graph traversal and weighted graph algorithms",
        skiena("7", "8"), pick("E21", "18", ["_pre", "18.7", "18.10", "18.11", "18.12"], role="supp"), prereq=["M21.2", "M20.7"]),
    mod("M21.6", "P21", "core", "חיפוש קומבינטורי ותכנות דינמי", "Combinatorial search and dynamic programming", skiena("9", "10"), prereq=["M21.5"]),
    mod("M21.7", "P21", "core", "NP-שלמות והתמודדות עם בעיות קשות", "NP-completeness and dealing with hard problems",
        skiena("11", "12"), pick("E21", "19", ["_pre", "19.6", "19.8", "19.9", "19.10", "19.11"], role="supp"), prereq=["M21.6"]),
    mod("M21.8", "P21", "core", "איך מתכננים אלגוריתם", "How to design algorithms", c("E21", "13"), prereq=["M21.7"]),
    mod("M21.9", "P21", "ref", "קטלוג הבעיות: בעיות נומריות וקומבינטוריות", "Catalog: numerical and combinatorial problems",
        cs("E21", "14", "16", "17"), prereq=["M21.8"]),
    mod("M21.10", "P21", "ref", "קטלוג הבעיות: גאומטריה חישובית, קבוצות ומחרוזות, ומקורות", "Catalog: computational geometry, sets and strings, resources",
        cs("E21", "20", "21", "22"), prereq=["M21.8"]),
    mod("M21.11", "P21", "ref", "Skiena: סיפורי המלחמה, וערכי קטלוג שחוזרים על הפרקים שנלמדים", "Skiena: the War Stories, and catalog entries that repeat the taught chapters",
        *[pick("E21", n, ws, "War Stories") for n, ws in _WAR.items()],
        pick("E21", "15", ["15.1", "15.2", "15.4", "15.5"], "נלמד בפרק 3"), pick("E21", "18", span("E21", "18", "18.1", "18.6") + ["18.8", "18.9"], "נלמד בפרקים 7–8"),
        pick("E21", "19", span("E21", "19", "19.1", "19.5") + ["19.7"], "נלמד בפרקים 11–12"), prereq=["M21.8"]),

    # ---------------- P22 ----------------
    mod("M22.1", "P22", "core", "מכונות חישוב אלקטרוניות: העקרונות", "Electronic computing machines: principles", c("K2", "XIV"), prereq=["M0.1"]),
    mod("M22.2", "P22", "core", "הפשטות המחשב וטכנולוגיה", "Computer abstractions and technology", cut("E22", "1", ["1.12"]), prereq=["M22.1"]),
    mod("M22.3", "P22", "core", "תכנון לוגי בסיסי", "The basics of logic design",
        pick("E22", "A", ["A.1", "A.4", "A.5", "A.6", "A.13"], "ALU ו-HDL; שערים, צירופי וזיכרון נלמדים ב-M11.8"), probs("E22", "A"), prereq=["M22.2", "M20.1"]),
    mod("M22.4", "P22", "adv", "פקודות: שפת המחשב", "Instructions: language of the computer", c("E22", "2"), prereq=["M22.2"]),
    mod("M22.5", "P22", "adv", "אריתמטיקה במחשב", "Arithmetic for computers", c("E22", "3"), prereq=["M22.3", "M22.4"]),
    mod("M22.6", "P22", "core", "המעבד: נתיב נתונים, בקרה וצנרת", "The processor: datapath, control, pipelining", cut("E22", "4", ["4.16"]), prereq=["M22.5"]),
    mod("M22.7", "P22", "core", "היררכיית הזיכרון", "The memory hierarchy", cut("E22", "5", ["5.18"]), prereq=["M22.6"]),
    mod("M22.8", "P22", "core", "מעבדים מקביליים ומעבדים גרפיים", "Parallel processors and GPUs",
        cut("E22", "6", ["6.15"]), rest("E22", "B", ["B.7", "B.11"]), prereq=["M22.7"]),
    mod("M22.9", "P22", "ref", "סקר ארכיטקטורות RISC", "A survey of RISC architectures", c("E22", "D", "D: A survey of RISC architectures"), prereq=["M22.4"]),
    mod("M22.10", "P22", "ref", "מיקרו-מחשבים ומיקרו-מעבדים במעגל", "Microcomputers and microprocessors in circuits",
        cs("E09", "10", "11"), sup("E09a", "10-11"), prereq=["M11.9", "M22.6"]),
    mod("M22.11", "P22", "adv", "מערכות משובצות: ארכיטקטורה, קלט/פלט וטיימרים, פסיקות ותקלות", "Embedded systems: architecture, I/O and timers, interrupts, getting into trouble",
        cs("E45", "1", "4", "5", "9"), prereq=["M22.6", "M11.9"]),
    mod("M22.12", "P22", "ref", "White: שאר הספר; ומ-Patterson & Hennessy: היסטוריה, GeForce 8800, תכנון לוגי ונספח C", "White, the rest; Patterson & Hennessy: historical perspectives, GeForce 8800, logic design, appendix C",
        refs("E45", "2", "3", "6", "7", "8", "10", "11", "12", "13", "14"),
        *[pick("E22", n, [k], "Historical Perspective") for n, k in (("1", "1.12"), ("4", "4.16"), ("5", "5.18"), ("6", "6.15"), ("B", "B.11"))],
        pick("E22", "B", ["B.7"], "Real Stuff משנת 2007"), pick("E22", "A", ["A.2", "A.3"] + span("E22", "A", "A.7", "A.12"), "נלמד ב-M11.8"),
        c("E22", "C", "C: Mapping control to hardware (מעבר ליעד)"), prereq=["M22.3"]),

    # ---------------- P23 ----------------
    mod("M23.1", "P23", "core", "מערכות תקשורת: אפנון משרעת ותדר וריבוב", "Communication systems: AM, FM, multiplexing", c("E01", "8"), prereq=["M4.8"]),
    mod("M23.2", "P23", "core", "אפנון פולסים: PAM ו-QAM", "Pulse amplitude and quadrature amplitude modulation", c("E02", "12"), prereq=["M23.1", "M7.4"]),
    mod("M23.3", "P23", "core", "קודים לתיקון שגיאות וערוצים אמיתיים", "Error-correcting codes and real channels",
        cs("E04", "11", "13", "14"), sec("E23", "5", "5.1", "5.2", "5 §5.1–5.2: קיבולת AWGN ושנון-הארטלי (דלתא בליבה, מתוך M23.8)", "supp"), prereq=["M7.7", "M8.1"]),
    mod("M23.4", "P23", "adv", "העברת מסרים וקודים מודרניים: LDPC, טורבו, מזרקה", "Message passing and modern codes: LDPC, turbo, fountain",
        cs("E04", "16", "47", "48", "49", "50"), prereq=["M23.3", "M7.10"]),
    mod("M23.5", "P23", "core", "הערוץ האלחוטי", "The wireless channel", cs("E23", "1", "2"), prereq=["M23.2", "M9.9"]),
    mod("M23.6", "P23", "core", "תקשורת נקודה-לנקודה: גילוי, גיוון ואי-ודאות ערוץ", "Point-to-point communication: detection, diversity",
        c("E23", "3"), prereq=["M23.5"]),
    mod("M23.7", "P23", "core", "מערכות סלולריות: גישה מרובה וניהול הפרעות", "Cellular systems: multiple access and interference", c("E23", "4"), prereq=["M23.6"]),
    mod("M23.8", "P23", "adv", "קיבולת ערוצים אלחוטיים ותקשורת אופורטוניסטית", "Capacity of wireless channels, opportunistic communication",
        cs("E23", "5", "6"), prereq=["M23.7", "M7.7"]),
    mod("M23.9", "P23", "core", "MIMO: ריבוב מרחבי ומידול הערוץ", "MIMO I: spatial multiplexing and channel modeling", c("E23", "7"), prereq=["M23.6", "M8.4"]),
    mod("M23.10", "P23", "adv", "MIMO: קיבולת, ארכיטקטורות ותקשורת רב-משתמשים", "MIMO II–IV: capacity, architectures, multiuser",
        cs("E23", "8", "9", "10"), prereq=["M23.9", "M23.8"]),
    mod("M23.11", "P23", "core", "רשתות מחשבים: קצה וליבה, השהיה, אובדן ותפוקה, ושכבות הפרוטוקולים", "Computer networks: edge and core, delay, loss and throughput, protocol layers",
        pick("E34", "1", span("E34", "1", "1.1", "1.5")), probs("E34", "1"), prereq=["M23.7", "M7.1"]),
    mod("M23.12", "P23", "core", "שכבת התעבורה: UDP, העברה אמינה, TCP ובקרת עומס", "The transport layer: UDP, reliable data transfer, TCP, congestion control",
        pick("E34", "3", span("E34", "3", "3.1", "3.7")), probs("E34", "3"), prereq=["M23.11"]),
    mod("M23.13", "P23", "core", "שכבת הרשת: נתבים, IP, אלגוריתמי ניתוב, OSPF ו-BGP", "The network layer: routers, IP, routing algorithms, OSPF and BGP",
        pick("E34", "4", span("E34", "4", "4.1", "4.3")), probs("E34", "4"), pick("E34", "5", span("E34", "5", "5.1", "5.4")), probs("E34", "5"), prereq=["M23.12", "M21.5"]),
    mod("M23.14", "P23", "core", "שכבת הקישור: גילוי שגיאות, גישה מרובה ורשתות מקומיות ממותגות", "The link layer: error detection, multiple access, switched LANs",
        pick("E34", "6", span("E34", "6", "6.1", "6.4")), probs("E34", "6"), prereq=["M23.13"]),
    mod("M23.15", "P23", "core", "רשתות אלחוטיות וניידות: ערוץ הקישור, WiFi וניהול ניידות", "Wireless and mobile networks: link characteristics, WiFi, mobility management",
        pick("E34", "7", span("E34", "7", "7.1", "7.3") + ["7.5"], "דלתא מול Tse: שכבת הקישור והרשת, לא הפיזיקה של הערוץ"), probs("E34", "7"), prereq=["M23.14"]),
    mod("M23.16", "P23", "ref", "Kurose & Ross: שאר הספר", "Kurose & Ross: the remaining chapters",
        refs("E34", "2", "8"), rest("E34", "1", span("E34", "1", "1.1", "1.5")), rest("E34", "3", span("E34", "3", "3.1", "3.7")),
        rest("E34", "4", span("E34", "4", "4.1", "4.3")), rest("E34", "5", span("E34", "5", "5.1", "5.4")), rest("E34", "6", span("E34", "6", "6.1", "6.4")),
        rest("E34", "7", span("E34", "7", "7.1", "7.3") + ["7.5"]), prereq=["M23.11"]),

    # ---------------- P24 ----------------
    mod("M24.1", "P24", "core", "תורת היחסות הפרטית: זמן, מרחב, אנרגיה ותנע", "Special relativity", cs("F1", "15", "16", "17"), prereq=["M2.3", "M1.4"]),
    mod("M24.2", "P24", "adv", "אלקטרודינמיקה בסימון יחסותי והתמרות לורנץ של השדות", "Relativistic electrodynamics, Lorentz transformations of fields",
        cs("F2", "25", "26"), prereq=["M24.1", "M9.9"]),
    mod("M24.3", "P24", "core", "התנהגות קוונטית: גל וחלקיק", "Quantum behavior: waves and particles", cs("F1", "37", "38"), prereq=["M9.13", "M6.1"]),
    mod("M24.4", "P24", "core", "אמפליטודות הסתברות וחלקיקים זהים", "Probability amplitudes and identical particles", cs("F3", "3", "4"), prereq=["M24.3"]),
    mod("M24.5", "P24", "adv", "ספין אחת וספין חצי", "Spin one and spin one-half", cs("F3", "5", "6"), prereq=["M24.4"]),
    mod("M24.6", "P24", "core", "תלות בזמן, מטריצת ההמילטוניאן והמייזר", "Time dependence, the Hamiltonian matrix, the ammonia maser",
        cs("F3", "7", "8", "9"), prereq=["M24.4", "M8.8"]),
    mod("M24.7", "P24", "adv", "מערכות שני מצבים ופיצול על-דק במימן", "Two-state systems and the hyperfine splitting", cs("F3", "10", "11", "12"), prereq=["M24.6", "M24.5"]),
    mod("M24.8", "P24", "core", "התפשטות בסריג גבישי ומוליכים למחצה", "Propagation in a crystal lattice and semiconductors", cs("F3", "13", "14"), prereq=["M24.6"]),
    mod("M24.9", "P24", "adv", "קירוב החלקיק הבלתי תלוי ותלות במקום", "Independent-particle approximation, dependence on position", cs("F3", "15", "16"), prereq=["M24.8"]),
    mod("M24.10", "P24", "ref", "סימטריה, חוקי שימור ותנע זוויתי", "Symmetry, conservation laws, angular momentum",
        cs("F3", "17", "18"), c("F1", "52"), prereq=["M24.9", "M8.2"]),
    mod("M24.11", "P24", "core", "אטום המימן והטבלה המחזורית", "The hydrogen atom and the periodic table", c("F3", "19"), prereq=["M24.9"]),
    mod("M24.12", "P24", "ref", "אופרטורים, משוואת שרדינגר ומוליכות-על", "Operators, the Schrödinger equation, superconductivity",
        cs("F3", "20", "21", "Epilogue"), prereq=["M24.11", "M8.14"]),
    mod("M24.13", "P24", "adv", "הגאומטריה הפנימית של גבישים", "The internal geometry of crystals", c("F2", "30"), prereq=["M24.8"]),

    # ---------------- P25 ----------------
    mod("M25.1", "P25", "core", "אלקטרונים וחורים: תנועה ורקומבינציה", "Electrons and holes: motion and recombination", cs("E24", "1", "2"), prereq=["M24.8"]),
    mod("M25.2", "P25", "core", "טכנולוגיית ייצור התקנים ותהליך CMOS", "Device fabrication technology and CMOS processing",
        c("E24", "3"), sup("E25", "3"), prereq=["M25.1"]),
    mod("M25.3", "P25", "core", "צמתי PN וצמתי מתכת-מוליך למחצה", "PN and metal–semiconductor junctions", c("E24", "4"), prereq=["M25.1"]),
    mod("M25.4", "P25", "core", "קבל MOS וטרנזיסטור MOS", "The MOS capacitor and the MOS transistor",
        cs("E24", "5", "6"), sup("E25", "2"), prereq=["M25.3"]),
    mod("M25.5", "P25", "core", "MOSFET במעגלים משולבים: הקטנה, דליפה ונושאים נוספים", "MOSFETs in ICs: scaling and leakage", c("E24", "7"), prereq=["M25.4"]),
    mod("M25.6", "P25", "ref", "הטרנזיסטור הביפולרי", "The bipolar transistor", c("E24", "8"), prereq=["M25.3"]),
    mod("M25.7", "P25", "core", "מבוא לתכנון VLSI", "Introduction to CMOS VLSI design", c("E25", "1"), prereq=["M25.4", "M22.3"]),
    mod("M25.8", "P25", "core", "השהיה, הספק וקווי חיבור", "Delay, power, interconnect", cs("E25", "4", "5", "6"), prereq=["M25.7"]),
    mod("M25.9", "P25", "adv", "עמידות וסימולציית מעגלים", "Robustness and circuit simulation", cs("E25", "7", "8"), prereq=["M25.8"]),
    mod("M25.10", "P25", "adv", "תכנון מעגלים צירופיים וסדרתיים", "Combinational and sequential circuit design", cs("E25", "9", "10"), prereq=["M25.8"]),
    mod("M25.11", "P25", "ref", "תת-מערכות: נתיבי נתונים, מערכים ומעגלים ייעודיים", "Datapath, array and special-purpose subsystems",
        cs("E25", "11", "12", "13"), prereq=["M25.10"]),
    mod("M25.12", "P25", "adv", "מתודולוגיית תכנון, בדיקה ואימות", "Design methodology, testing, verification", cs("E25", "14", "15"), prereq=["M25.10"]),
    mod("M25.13", "P25", "ref", "שפות תיאור חומרה", "Hardware description languages", c("E25", "A", "A: Hardware description languages"), prereq=["M25.10"]),

    # ---------------- P26 ----------------
    mod("M26.1", "P26", "ref", "עקומות ומשטחים", "Curves and surfaces", c("K2", "VII"), prereq=["M1.3", "M1.2"]),
    mod("M26.2", "P26", "ref", "תורת הפונקציות של משתנה ממשי: קבוצות, מידה ואינטגרל לבג", "Real-variable theory: sets, measure, the Lebesgue integral",
        c("K3", "XV"), prereq=["M1.2"]),
    mod("M26.3", "P26", "ref", "גאומטריה לא אוקלידית וגאומטריה רימנית", "Non-Euclidean and Riemannian geometry", c("K3", "XVII"), prereq=["M1.4"]),
    mod("M26.4", "P26", "ref", "טופולוגיה", "Topology", c("K3", "XVIII"), prereq=["M26.2"]),
    mod("M26.5", "P26", "ref", "חבורות ומערכות אלגבריות אחרות", "Groups and other algebraic systems", c("K3", "XX"), prereq=["M1.5", "M8.2"]),
    # ---------------- P27 ----------------
    mod("M27.1", "P27", "core", "יסודות הנדסת מערכות ומחזור החיים של פרויקט", "Systems engineering fundamentals and the project life cycle",
        cs("E26", "1", "2", "3")),
    mod("M27.2", "P27", "core", "תכנון המערכת: ציפיות, דרישות, פירוק לוגי ופתרון", "System design: expectations, requirements, decomposition, design solution",
        c("E26", "4"), *[c("E26", x, f"{x}: {title('E26', x)}", "supp") for x in 'CFS'], prereq=["M27.1"]),
    mod("M27.3", "P27", "core", "מימוש המוצר: אינטגרציה, אימות, תיקוף ומסירה", "Product realization: integration, verification, validation, transition",
        c("E26", "5"), *[c("E26", x, f"{x}: {title('E26', x)}", "supp") for x in 'DEHI'], prereq=["M27.2"]),
    mod("M27.4", "P27", "core", "ניהול טכני רוחבי: תכנון, דרישות, ממשקים, סיכונים ותצורה", "Crosscutting technical management: planning, requirements, interfaces, risk, configuration",
        sec("E26", "6", "6.1", "6.6"), *[c("E26", x, f"{x}: {title('E26', x)}", "supp") for x in 'JKLM'], prereq=["M27.3"]),
    mod("M27.5", "P27", "core", "הערכה טכנית, ניתוח החלטות ובשלות טכנולוגית", "Technical assessment, decision analysis, technology readiness",
        sec("E26", "6", "6.7", "6.8"), *[c("E26", x, f"{x}: {title('E26', x)}", "supp") for x in 'GNP'], prereq=["M27.4", "M6.1"]),
    mod("M27.6", "P27", "ref", "מילון, ראשי תיבות, שילוב האדם במערכת והפעלה", "Glossary, acronyms, human systems integration, operations",
        *[c("E26", x, f"{x}: {title('E26', x)}", "main") for x in 'ABRT'], prereq=["M27.1"]),
    mod("M27.7", "P27", "core", "STPA: ניתוח מפגעים מבוסס בקרה", "STPA: control-based hazard analysis",
        c("E51", "2"), prereq=["M27.3"]),
    mod("M27.8", "P27", "core", "הערכת סיכונים הסתברותית (PRA): רכיבי ה-PRA, תרחישים, עצי אירועים ועצי תקלות", "Probabilistic risk assessment: the elements of PRA, scenarios, event trees and fault trees",
        pick("E52", "3", span("E52", "3", "3.2", "3.4")), pick("E52", "4", span("E52", "4", "4.1", "4.3")), prereq=["M27.4", "M6.7"]),
    mod("M27.9", "P27", "ref", "STPA Handbook ומדריך ה-PRA של נאס\"א: שאר המסמכים", "STPA Handbook and the NASA PRA guide: the rest",
        refs("E51", "1", "3", "4", "5", "6", "7", "8", "A", "B", "C", "D", "E", "F", "G"),
        refs("E52", "1", "2", *[str(i) for i in range(5, 15)], "A", "B", "C", "D", "E"),
        pick("E52", "3", ["3.1", "3.5"]), pick("E52", "4", ["4.4"]), prereq=["M27.7", "M27.8"]),

    # ---------------- added by the topic-based curriculum (docs/research/round3/final/F_curriculum.json) ----------------
    # No book in the library teaches these: the tutor teaches them from their topic items
    # (curriculum.json) and the module's reading list. Appended so every prerequisite comes earlier.
    mod("M10.10", "P10", "core", "אלמנטים סופיים ונפחים סופיים: גלרקין וריץ, רשתות, FEM בפועל ואיך קוראים תוצאת FEM",
        "Finite elements and finite volumes: Galerkin/Ritz, meshing, FEM in practice and how to read an FEM result",
        c("E47", "1"), pick("E47", "2", ["_pre", "2.2", "2.5"]), probs("E47", "2"), pick("E47", "3", ["3.1", "3.5", "3.6"]), probs("E47", "3"),
        pick("E47", "4", ["4.1"]), probs("E47", "4"), pick("E47", "5", ["5.1", "5.2", "5.3", "5.5"]), probs("E47", "5"), prereq=["M10.6", "M10.1"]),
    mod("M10.11", "P10", "ref", "Langtangen & Mardal: שאר הספר", "Langtangen & Mardal: the remaining chapters",
        rest("E47", "2", ["_pre", "2.2", "2.5"]), rest("E47", "3", ["3.1", "3.5", "3.6"]), rest("E47", "4", ["4.1"]),
        rest("E47", "5", ["5.1", "5.2", "5.3", "5.5"]), refs("E47", "6", "7", "8", "9", "10", "11", "A"), prereq=["M10.10"]),
    mod("M13.19", "P13", "core", "מערכות הספק ורשת החשמל: יחידות יחסיות ותלת-פאזי, זרימת הספק, תקלות והגנות, יציבות ובקרת תדר, פגיעוּת הרשת",
        "Power systems and the grid: per-unit and three-phase, power flow, faults and protection, stability and frequency control, grid vulnerability",
        cut("E35", "3", ["CS"]), cut("E35", "5", ["CS"]),
        pick("E35", "6", ["_pre", "6.3", "6.4", "6.5", "6.6", "6.7", "6.9", "6.10", "6.12"]), probs("E35", "6"), prereq=["M13.17", "M12.1", "M12.11"]),
    mod("M13.22", "P13", "core", "תקלות ברשת: תקלות סימטריות, רכיבים סימטריים ותקלות לא סימטריות", "Faults: symmetrical faults, symmetrical components, unsymmetrical faults",
        cut("E35", "7", ["CS"]), cut("E35", "8", ["CS"]), cut("E35", "9", ["CS"]), prereq=["M13.19"]),
    mod("M13.23", "P13", "core", "הגנה, יציבות מעברית ובקרת תדר", "Protection, transient stability and frequency control",
        pick("E35", "10", ["_pre"] + span("E35", "10", "10.1", "10.4") + span("E35", "10", "10.8", "10.10")), probs("E35", "10"),
        pick("E35", "11", ["_pre"] + span("E35", "11", "11.1", "11.5") + ["11.8"]), probs("E35", "11"),
        pick("E35", "12", ["12.2", "12.3"]), probs("E35", "12"), prereq=["M13.22", "M5.9"]),
    mod("M13.24", "P13", "ref", "Glover, Overbye & Sarma: מקרי הבוחן ושאר הספר", "Glover, Overbye & Sarma: the case studies and the rest",
        refs("E35", "1", "2", "4", "13", "14", "A"), *[pick("E35", x, ["CS"], "Case Study") for x in "35789"],
        rest("E35", "6", ["_pre", "6.3", "6.4", "6.5", "6.6", "6.7", "6.9", "6.10", "6.12"]),
        rest("E35", "10", ["_pre"] + span("E35", "10", "10.1", "10.4") + span("E35", "10", "10.8", "10.10")),
        rest("E35", "11", ["_pre"] + span("E35", "11", "11.1", "11.5") + ["11.8"]), rest("E35", "12", ["12.2", "12.3"]), prereq=["M13.19"]),
    # round 7 (6.11): new modules whose prerequisites sit in later parts
    mod("M3.4", "P3", "core", "מערכות רב-דרגות חופש ואנליזה מודלית", "Multidegree-of-freedom systems and modal analysis",
        pick("E29", "6", ["_pre", "6.1"] + span("E29", "6", "6.8", "6.15")), probs("E29", "6"), prereq=["M3.3", "M8.8"]),
    mod("M3.5", "P3", "core", "מערכות רציפות: מיתרים, מוטות וקורות בתנודה רוחבית", "Continuous systems: strings, bars, lateral vibration of beams",
        pick("E29", "8", ["_pre", "8.1", "8.2", "8.5"]), probs("E29", "8"), prereq=["M3.4", "M10.1"]),
    mod("M3.6", "P3", "core", "תנודה אקראית: תהליכים רחבי-פס וצרי-פס, ותגובת מערכת בדרגה אחת ובכמה דרגות", "Random vibration: wide- and narrow-band processes, single- and multidegree-of-freedom response",
        pick("E29", "14", span("E29", "14", "14.11", "14.14")), probs("E29", "14"), prereq=["M3.4", "M7.2"]),
    mod("M3.7", "P3", "ref", "Rao: שאר הספר", "Rao: the remaining chapters",
        refs("E29", "1", "2", "4", "5", "7", "9", "10", "11", "12", "13", "A", "B", "C", "D", "E", "F"),
        rest("E29", "3", ["_pre"] + span("E29", "3", "3.1", "3.7")), rest("E29", "6", ["_pre", "6.1"] + span("E29", "6", "6.8", "6.15")),
        rest("E29", "8", ["_pre", "8.1", "8.2", "8.5"]), rest("E29", "14", span("E29", "14", "14.11", "14.14")), prereq=["M3.3"]),
    mod("M4.15", "P4", "core", "אנליזה ספקטרלית עם DFT: חלונות, רזולוציה, STFT ופריודוגרם", "Fourier analysis of signals using the DFT: windows, resolution, the STFT, the periodogram",
        cut("E30", "10"), prereq=["M4.14", "M7.2"]),
    mod("M4.16", "P4", "ref", "Oppenheim, Schafer & Buck: שאר הספר; והשלמות O&V שחוזרות על Oppenheim & Willsky", "Oppenheim, Schafer & Buck: the rest; O&V supplements that repeat Oppenheim & Willsky",
        refs("E30", "1", "2", "3", "5", "6", "11", "A", "B"), rest("E30", "4", ["4.6", "4.7"]), rest("E30", "7", ["7.0", "7.1", "7.2", "7.4"]),
        rest("E30", "8", ["8.5", "8.6", "8.7"]), rest("E30", "9", ["9.0", "9.1", "9.2", "9.3"]),
        pick("E02", "2", span("E02", "2", "2.1", "2.4"), "נלמד ב-Oppenheim & Willsky 1, 4, 9–10", "supp"), pick("E02", "3", ["3.1"], "נלמד ב-Oppenheim & Willsky 4", "supp"),
        prereq=["M4.14"]),
    mod("M5.14", "P5", "core", "מסננים לא לינאריים: EKF, UKF ומסנן חלקיקים", "Nonlinear filters: the extended and unscented Kalman filters, the particle filter",
        cut("E48", "5"), cut("E48", "7"), prereq=["M5.6", "M7.12"]),
    mod("M5.15", "P5", "ref", "Särkkä: שאר הספר; והשלמות שחוזרות על Åström & Murray", "Särkkä, the rest; supplements that repeat Åström & Murray",
        refs("E48", "1", "2", "3", "4", "6", "8", "9", "10", "11", "12", "13", "A"),
        pick("E02", "4", span("E02", "4", "4.1", "4.3"), "נלמד ב-Åström 6", "supp"), pick("E02", "5", span("E02", "5", "5.1", "5.3"), "נלמד ב-Åström 6", "supp"),
        pick("E02", "6", ["6.4"], "נלמד ב-Åström 7", "supp"), pick("E01", "11", ["11.0", "11.1", "11.4", "11.5"], "נייקוויסט ושוליים נלמדים ב-Åström 10", "supp"),
        prereq=["M5.14"]),
    mod("M7.17", "P7", "core", "אומדן ספקטרלי פרמטרי: AR ו-ARMA, ספקטרום קווי, MUSIC ו-ESPRIT", "Parametric spectral estimation: AR and ARMA, line spectra, MUSIC and ESPRIT",
        pick("E31", "3", span("E31", "3", "3.1", "3.6")), probs("E31", "3"), pick("E31", "4", span("E31", "4", "4.1", "4.7")), probs("E31", "4"), prereq=["M7.2", "M8.8"]),
    mod("M7.18", "P7", "ref", "Stoica & Moses: שאר הספר; ופרקי ההעשרה של MacKay", "Stoica & Moses, the rest; MacKay's enrichment chapters",
        refs("E31", "1", "2", "5", "6", "A", "B", "C"), rest("E31", "3", span("E31", "3", "3.1", "3.6")), rest("E31", "4", span("E31", "4", "4.1", "4.7")),
        refs("E04", "18", "19"), prereq=["M7.17"]),
]

# Pages that are deliberately not taught, with the reason: every front and back
# matter range from the maps, plus duplicated material. Everything else in a
# document belongs to some module.
SKIP = [(d, a, b, f"{'פתיחה' if k == 'FRONT' else 'סיום'}: {what}") for d in DOCS for k in ("FRONT", "BACK") for a, b, what in matter(d, k)]
SKIP += [
    ("F3", 28, 64, "פרקים 1–2 זהים לפיינמן I פרקים 37–38 (נלמדים שם, M24.3)"),
    ("E26", 251, 251, "נספח O: עמוד ריק (Reserved)"),
    ("E26", 253, 253, "נספח Q: עמוד ריק (Reserved)"),
    ("F3", 612, 656, "נספח: הדפסה חוזרת של פיינמן II פרקים 34–35 (נלמדים שם, M12.1–M12.2)"),
]

# Known gaps in the sources, shown in SYLLABUS.md.
GAPS = [
    "חוזק חומרים: ספר הלימוד (E13) הוא Gere במהדורה 6 (2004), וספר הפתרונות (E13a) הוא Gere & Goodno במהדורה 8. סדר הפרקים זהה, אבל מספור הסעיפים והבעיות שונה במקצת (למשל, במהדורה 8 יש §1.2 חזרה על סטטיקה), ולכן המורה מתאים בעיה לסעיף לפי הנושא ולא לפי המספר.",
    "Horowitz & Hill (E09): חסרים פרק 1 (מכוסה ב-M11.1 מספר התרגול E09a), עמוד מודפס 644, והנספחים G–K והאינדקס.",
    "Ashby (E12): חסר עמוד מודפס 283 (בתוך §10.3).",
    "פיינמן II: חסרים פרק 40 (The Flow of Dry Water, זרימה אידאלית) ופרק 42 (Curved Space, יחסות כללית). M15.1 מתחיל מפרק 41.",
    "MIT 6.011 (E02): חסר פרק 1 (מבוא).",
    "Çengel (E15): האינדקס קטוע, ופרק 18 (אנרגיה מתחדשת) הוא פרק מקוון שלא נכלל. אנרגיה מתחדשת מכוסה ב-MacKay (E14).",
    "Patterson & Hennessy (E22) הוא ספר אלקטרוני בפריסה מחדש: עמוד שלו קטן מעמוד מודפס, ולכן אומדן השיעורים ב-P22 גבוה בערך פי שניים מהאמיתי.",
    "שיטת האלמנטים הסופיים (FEM): המקור הוא Langtangen & Mardal (E47) בגרסה הפתוחה מספטמבר 2016, ולא ספר Springer של 2019. Strang לא נמצא.",
    # round 7 (6.11): books that will not come, and editions that differ from the plan (docs/research/round7/mapping/)
    "Khalil, Nonlinear Systems לא יגיע: מישור הפאזה, מחזורי גבול, describing function וקריטריון המעגל, ו-feedback linearization נשארים פריטי מורה (ליאפונוב הבסיסי נלמד ב-Åström, M5.3).",
    "Bar-Shalom / Simon לא יגיעו: EKF, UKF ומסנן חלקיקים נלמדים מ-Särkkä (E48, M5.14). בדיקות עקביות NEES/NIS, אבחון התבדרות ו-FDIR נשארים פריטי מורה.",
    "Boyd, EE263 לא יגיע: Gramians, least-norm ופירוק SVD של מערכות נשארים פריטי מורה (נשענים על Trefethen M8.4–M8.5 ועל Åström M5.4).",
    "Erickson & Maksimović לא יגיע: עקרונות מצב מתמיד של ממירים, המודל הממוצע ובקרת ממיר, SiC ו-GaN נשארים פריטי מורה לצד Hughes & Drury 2 (M12.4).",
    "Thrun, Probabilistic Robotics לא יגיע: מסנן בייס ומסנן חלקיקים נלמדים מ-Särkkä (M5.14). מודלי תנועה ומדידה, לוקליזציה (Markov, MCL) ו-SLAM נשארים פריטי מורה.",
    "Szeliski, Computer Vision לא יגיע: מודל מצלמה, כיול, גאומטריה אפיפולרית ו-structure-from-motion נשארים פריטי מורה.",
    "Mahajan, The Art of Insight לא יגיע: שיטת הקירוב כטקסט רציף נשארת בפריטי מורה ובדוגמאות של MacKay (M13.15–M13.16).",
    "Sutton & Biblarz לא הגיע: תורת הנחיר הרקטי נלמדת מ-Hill & Peterson 11 (M15.16), ותרמוכימיה של דלקים מ-Çengel 15–16 (M13.13); Hill & Peterson 12 בעיון (M15.29).",
    "Friedenthal, A Practical Guide to SysML לא הגיע: MBSE ו-SysML נשארים פריטי מורה ב-M27.2.",
    "Haarnoja et al. (SAC) ו-Zhao et al. (sim-to-real) לא בספרייה: הם ברשימת הקריאה של M18.7 ו-M18.10; offline RL נלמד מ-Levine et al. (E50).",
    "מהדורות שונות מהתוכנית: Meriam & Kraige Dynamics במהדורה 7 (לא 9), Anderson, Fundamentals of Aerodynamics במהדורה 5, Shigley במהדורה 10, Megson במהדורה 6, Griffiths במהדורה 3. מספרי הפרקים שמופיעים במיפוי הותאמו לפי הנושא.",
    "Oppenheim, Schafer & Buck (E30) היא סריקה בלי שכבת טקסט: המורה קורא מתמונות העמודים, ומפת הפרקים נבנתה מהסימניות ובדיקת עמודים מצוירים.",
    "Fracture Mechanics: הגיע Janssen, Zuidema & Wanhill (E42) במקום T.L. Anderson; LEFM מפרק 2 וחוק פריס מפרק 9 (M16.22).",
    "Schroeder (E33): העותק נגמר בעמוד מודפס 388, באמצע נספח B; B.3–B.5, נספחים C–D והאינדקס חסרים.",
    "Jones (E44) נסרק שני עמודים מודפסים בכל עמוד PDF: אומדן השיעורים של M16.24 נמוך בערך פי שניים מהאמיתי.",
    "Murphy, PML: Advanced Topics הגיע בשני קבצים (E49a עד עמ' מודפס 651, E49b מ-652); פרק 17 עובר ביניהם.",
    "Pozar (E53) נלמד בלנצ'סטר (M1.5–M1.7) והקובץ בספרייה שלה. בגילואה: פרק 1 (M9.17) ושיעור הפרש על תכן מגבר טרנזיסטור ומתנדים (M11.20); השאר בעיון (M11.22).",
]
