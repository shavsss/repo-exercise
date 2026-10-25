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


def mod(id, part, tier, title_he, en, *sources, prereq=()):
    flat = [s for group in sources for s in group]
    for s in flat:
        # E13a is the instructor's solutions manual: problems and solutions, no theory
        if s["doc"] == "E13a":
            s["role"] = "ex"
            s["note"] = s["note"].replace("תרגילים", "בעיות ופתרונות") if s["note"].endswith("תרגילים") else s["note"] + " (ספר פתרונות: בעיות ופתרונות בלבד)"
    return dict(id=id, part=part, tier=tier, title=title_he, en=en, prereq=list(prereq), sources=flat)


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

    # ---------------- P3 ----------------
    mod("M3.1", "P3", "core", "משוואות דיפרנציאליות רגילות", "Ordinary differential equations", c("K1", "V"), prereq=["M1.2", "M1.5"]),
    mod("M3.2", "P3", "core", "המתנד ההרמוני, תהודה, מעברים ומערכות לינאריות", "Harmonic oscillator, resonance, transients, linear systems",
        cs("F1", "21", "23", "24", "25"), prereq=["M3.1", "M2.3"]),

    # ---------------- P4 ----------------
    mod("M4.1", "P4", "core", "אותות ומערכות: הגדרות ותכונות", "Signals and systems: definitions and properties",
        c("E01", "1"), sup("E02", "2"), prereq=["M3.2"]),
    mod("M4.2", "P4", "core", "מערכות LTI וקונבולוציה", "LTI systems and convolution", c("E01", "2"), prereq=["M4.1"]),
    mod("M4.3", "P4", "core", "פונקציות של משתנה מרוכב", "Functions of a complex variable",
        sec("K2", "IX", None, "3"), prereq=["M1.5", "M1.2"]),
    mod("M4.4", "P4", "core", "טורי פורייה", "Fourier series",
        c("E01", "3"), sec("K2", "XII", "7", "8", role="supp"), prereq=["M4.2", "M4.3"]),
    mod("M4.5", "P4", "core", "התמרת פורייה הרציפה", "The continuous-time Fourier transform",
        c("E01", "4"), sup("E02", "3"), prereq=["M4.4"]),
    mod("M4.6", "P4", "core", "התמרת פורייה הבדידה", "The discrete-time Fourier transform", c("E01", "5"), prereq=["M4.5"]),
    mod("M4.7", "P4", "core", "אפיון בזמן ובתדר: מסננים ומערכות מסדר ראשון ושני", "Time and frequency characterization, filters",
        c("E01", "6"), prereq=["M4.6"]),
    mod("M4.8", "P4", "core", "דגימה", "Sampling", c("E01", "7"), prereq=["M4.7"]),
    mod("M4.9", "P4", "core", "התמרת לפלס", "The Laplace transform",
        c("E01", "9"), c("E01", "A", "A: Partial-fraction expansion", "supp"), prereq=["M4.7"]),
    mod("M4.10", "P4", "core", "התמרת z", "The z-transform", c("E01", "10"), prereq=["M4.9", "M4.8"]),
    mod("M4.11", "P4", "adv", "אינטגרל קווי, נוסחת קושי והמשכה אנליטית", "Line integrals, Cauchy's formula, analytic continuation",
        sec("K2", "IX", "4", "6"), prereq=["M4.3"]),

    # ---------------- P5 ----------------
    mod("M5.1", "P5", "core", "מבוא למשוב ובקרה, ועקרונות המשוב", "Introduction to feedback and feedback principles",
        cs("E03", "1", "2"), prereq=["M3.2"]),
    mod("M5.2", "P5", "core", "מידול מערכות ודוגמאות", "System modeling and examples", cs("E03", "3", "4"), prereq=["M5.1"]),
    mod("M5.3", "P5", "core", "התנהגות דינמית, יציבות וליאפונוב", "Dynamic behavior, stability, Lyapunov", c("E03", "5"), prereq=["M5.2", "M3.1"]),
    mod("M5.4", "P5", "core", "מערכות לינאריות במרחב מצב", "Linear state-space systems",
        c("E03", "6"), sups("E02", "4", "5"), prereq=["M5.3", "M4.2"]),
    mod("M5.5", "P5", "core", "משוב מצב ו-LQR", "State feedback and LQR", c("E03", "7"), prereq=["M5.4"]),
    mod("M5.6", "P5", "core", "משוב מוצא, משערכי מצב ומסנן קלמן", "Output feedback, observers, Kalman filtering",
        c("E03", "8"), sup("E02", "6"), prereq=["M5.5"]),
    mod("M5.7", "P5", "core", "פונקציות תמסורת ודיאגרמת בודה", "Transfer functions and the Bode plot", c("E03", "9"), prereq=["M5.4", "M4.9"]),
    mod("M5.8", "P5", "core", "ניתוח בתדר: קריטריון נייקוויסט ושולי יציבות", "Frequency-domain analysis: Nyquist and margins",
        c("E03", "10"), sup("E01", "11"), prereq=["M5.7"]),
    mod("M5.9", "P5", "core", "בקרת PID", "PID control", c("E03", "11"), prereq=["M5.8"]),
    mod("M5.10", "P5", "core", "תכנון בתדר: עיצוב חוג ומקום שורשים", "Frequency-domain design, loop shaping, root locus", c("E03", "12"), prereq=["M5.9"]),
    mod("M5.11", "P5", "adv", "ביצועים עמידים תחת אי-ודאות", "Robust performance", c("E03", "13"), prereq=["M5.10"]),
    mod("M5.12", "P5", "core", "גבולות יסודיים: האינטגרל של בודה", "Fundamental limits: Bode's integral", c("E03", "14"), prereq=["M5.10"]),
    mod("M5.13", "P5", "core", "ארכיטקטורה ותכנון מערכת", "Architecture and system design", c("E03", "15"), prereq=["M5.10"]),

    # ---------------- P6 ----------------
    mod("M6.1", "P6", "core", "הסתברות: חוקים, אקסיומות וחוק המספרים הגדולים", "Probability: laws, axioms, law of large numbers",
        sec("K2", "XI", None, "4"), sup("F1", "6"), prereq=["M1.2"]),
    mod("M6.2", "P6", "core", "משתנים מקריים ותוחלת", "Random variables and expectation",
        cs("E05", "1", "2", "3"), sups("E20", "IV", "17", "18", "19"), prereq=["M6.1"]),
    mod("M6.3", "P6", "core", "אי-שוויונות והתכנסות של משתנים מקריים", "Inequalities and convergence",
        cs("E05", "4", "5"), sup("E20", "20"), prereq=["M6.2"]),
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
        cs("E04", "17", "18", "19"), prereq=["M7.7"]),
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
    mod("M9.5", "P9", "adv", "חשמל באטמוספירה", "Electricity in the atmosphere", c("F2", "9"), prereq=["M9.4"]),
    mod("M9.6", "P9", "core", "דיאלקטריים", "Dielectrics", cs("F2", "10", "11"), prereq=["M9.4"]),
    mod("M9.7", "P9", "core", "מגנטוסטטיקה ופוטנציאל וקטורי", "Magnetostatics and the vector potential", cs("F2", "13", "14", "15"), prereq=["M9.4"]),
    mod("M9.8", "P9", "core", "זרמים מושרים וחוקי ההשראה", "Induced currents and the laws of induction", cs("F2", "16", "17"), prereq=["M9.7"]),
    mod("M9.9", "P9", "core", "משוואות מקסוול, פתרונותיהן וקרינה אלקטרומגנטית", "Maxwell's equations, their solutions, EM radiation",
        cs("F2", "18", "20", "21"), c("F1", "28"), prereq=["M9.8", "M9.1"]),
    mod("M9.10", "P9", "core", "תנועת מטענים בשדות חשמליים ומגנטיים", "Motion of charges in electric and magnetic fields", c("F2", "29"), prereq=["M9.9"]),
    mod("M9.11", "P9", "core", "מהודי חלל ומוליכי גל", "Cavity resonators and waveguides", cs("F2", "23", "24"), prereq=["M9.9"]),
    mod("M9.12", "P9", "core", "אופטיקה: עקרון הזמן המינימלי ואופטיקה גאומטרית", "Optics: least time and geometrical optics",
        cs("F1", "26", "27"), prereq=["M8.13"]),
    mod("M9.13", "P9", "core", "התאבכות, עקיפה וקיטוב", "Interference, diffraction, polarization", cs("F1", "29", "30", "33"), prereq=["M9.9", "M9.12"]),
    mod("M9.14", "P9", "adv", "מקדם השבירה, פיזור, החזרה ואפקטים יחסותיים בקרינה", "Refractive index, scattering, reflection, relativistic radiation",
        cs("F1", "31", "32", "34"), cs("F2", "32", "33"), prereq=["M9.13"]),
    mod("M9.15", "P9", "adv", "ראיית צבע ומנגנוני הראייה", "Color vision and mechanisms of seeing", cs("F1", "35", "36"), prereq=["M9.13"]),
    mod("M9.16", "P9", "adv", "אנרגיה ותנע של שדות ומסה אלקטרומגנטית", "Field energy and momentum, electromagnetic mass",
        cs("F2", "27", "28"), prereq=["M9.9"]),

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
    mod("M11.1", "P11", "core", "יסודות המעגלים: מתח, זרם, RC, דיודות ומעגלי זרם חילופין", "Circuit foundations and AC circuits",
        c("E09a", "1", "1: Foundations (הפרק החסר בעותק של Horowitz & Hill)"), c("F2", "22"), prereq=["M9.8", "M4.7"]),
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
    mod("M11.11", "P11", "adv", "טכניקות תדר גבוה ומהירות גבוהה", "High-frequency and high-speed techniques", c("E09", "13"), prereq=["M11.5", "M9.11"]),
    mod("M11.12", "P11", "adv", "תכנון בהספק נמוך", "Low-power design", c("E09", "14"), prereq=["M11.9"]),
    mod("M11.13", "P11", "core", "מדידות ועיבוד אותות", "Measurements and signal processing", c("E09", "15"), prereq=["M11.9", "M7.2"]),
    mod("M11.14", "P11", "ref", "נספחים: אוסצילוסקופ, סכמות, נגדים וקווי עומס; ציוד ודפי נתונים", "Appendices: oscilloscope, schematics, data sheets",
        *[c("E09", x, f"{x}: {title('E09', x)}") for x in "ABCDEF"], *[c("E09a", x, f"{x}: {title('E09a', x)}") for x in "ABCD"],
        prereq=["M11.1"]),

    # ---------------- P12 ----------------
    mod("M12.1", "P12", "adv", "מגנטיות של חומרים, פרומגנטיות וחומרים מגנטיים", "Magnetism of matter, ferromagnetism, magnetic materials",
        cs("F2", "34", "36", "37"), prereq=["M9.8"]),
    mod("M12.2", "P12", "adv", "פרמגנטיות ותהודה מגנטית", "Paramagnetism and magnetic resonance", c("F2", "35"), prereq=["M12.1"]),
    mod("M12.3", "P12", "core", "מנועים חשמליים: היסודות", "Electric motors: the basics", c("E10", "1"), prereq=["M9.8", "M2.5"]),
    mod("M12.4", "P12", "core", "ממירי אלקטרוניקת הספק להנעה", "Power electronic converters for drives", c("E10", "2"), prereq=["M12.3", "M11.6"]),
    mod("M12.5", "P12", "core", "מנועי DC והנעתם", "DC motors and drives", cs("E10", "3", "4"), prereq=["M12.4"]),
    mod("M12.6", "P12", "core", "מנועי השראה: שדה מסתובב, החלקה ומומנט", "Induction motors",
        cs("E10", "5", "6"), c("E10", "APP:2", "נספח 2: המעגל השקול של מנוע השראה"), prereq=["M12.5"]),
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
    mod("M13.4", "P13", "core", "מושגי יסוד, אנרגיה ומעבר אנרגיה", "Basic concepts, energy and energy transfer", cs("E15", "1", "2"), prereq=["M13.3"]),
    mod("M13.5", "P13", "core", "תכונות של חומרים טהורים", "Properties of pure substances", c("E15", "3"), prereq=["M13.4"]),
    mod("M13.6", "P13", "core", "ניתוח אנרגיה של מערכות סגורות ונפחי בקרה", "Energy analysis of closed systems and control volumes",
        cs("E15", "4", "5"), prereq=["M13.5"]),
    mod("M13.7", "P13", "core", "החוק השני ואנטרופיה", "The second law and entropy", cs("E15", "6", "7"), prereq=["M13.6"]),
    mod("M13.8", "P13", "core", "אקסרגיה", "Exergy", c("E15", "8"), prereq=["M13.7"]),
    mod("M13.9", "P13", "core", "מחזורי כוח גז: אוטו, דיזל, בריטון וסילון", "Gas power cycles", c("E15", "9"), prereq=["M13.7"]),
    mod("M13.10", "P13", "core", "מחזורי קיטור ומחזורים משולבים", "Vapor and combined power cycles", c("E15", "10"), prereq=["M13.9"]),
    mod("M13.11", "P13", "core", "מחזורי קירור ומשאבות חום", "Refrigeration cycles and heat pumps", c("E15", "11"), prereq=["M13.10"]),
    mod("M13.12", "P13", "adv", "יחסי תכונות, תערובות גזים ומיזוג אוויר", "Property relations, gas mixtures, air conditioning",
        cs("E15", "12", "13", "14"), prereq=["M13.7"]),
    mod("M13.13", "P13", "adv", "תגובות כימיות, בעירה ושיווי משקל", "Chemical reactions, combustion, equilibrium", cs("E15", "15", "16"), prereq=["M13.12"]),
    mod("M13.14", "P13", "ref", "טבלאות ותרשימי תכונות", "Property tables and charts",
        c("E15", "APP:1", "נספח 1: טבלאות ותרשימים ביחידות SI"), c("E15", "APP:2", "נספח 2: טבלאות ותרשימים ביחידות אנגליות"), prereq=["M13.5"]),
    mod("M13.15", "P13", "core", "מאזן האנרגיה: צריכה ומקורות", "The energy balance sheet: consumption and production",
        cs("E14", *[str(i) for i in range(1, 18)]), prereq=["M13.4"]),
    mod("M13.16", "P13", "core", "הפיזיקה של הצריכה והמקורות: מכוניות, רוח, מטוסים, שמש, חימום, גלים, גאות", "Technical chapters: the physics behind the numbers",
        cs("E14", *"ABCDEFGH"), prereq=["M13.15", "M2.4"]),
    mod("M13.17", "P13", "core", "לחיות על אנרגיה בת-קיימא: תחבורה, חימום, גרעין, אגירה", "Living on sustainable energy: transport, heating, nuclear, storage",
        cs("E14", *[str(i) for i in range(18, 27)]), prereq=["M13.16"]),
    mod("M13.18", "P13", "adv", "תוכניות אנרגיה, עלויות ונתונים", "Energy plans, costs and reference data",
        cs("E14", *[str(i) for i in range(27, 33)]), *[c("E14", x, f"{x}: {title('E14', x)}", "supp") for x in "IJK"], prereq=["M13.17"]),

    # ---------------- P14 ----------------
    mod("M14.1", "P14", "core", "מבוא למעבר חום", "Introduction to heat transfer", c("E16", "1"), prereq=["M13.4", "M10.3"]),
    mod("M14.2", "P14", "core", "הולכה, תנגודת תרמית ומקדם מעבר חום כולל", "Conduction, thermal resistance, overall coefficient",
        c("E16", "2"), prereq=["M14.1"]),
    mod("M14.3", "P14", "core", "תכנון מחליפי חום", "Heat exchanger design", c("E16", "3"), prereq=["M14.2"]),
    mod("M14.4", "P14", "core", "ניתוח הולכה, ניתוח ממדים וצלעות קירור", "Conduction analysis, dimensional analysis, fins", c("E16", "4"), prereq=["M14.2"]),
    mod("M14.5", "P14", "core", "הולכה בלתי יציבה ורב-ממדית", "Transient and multidimensional conduction", c("E16", "5"), prereq=["M14.4", "M10.6"]),
    mod("M14.6", "P14", "core", "שכבות גבול למינריות וטורבולנטיות", "Laminar and turbulent boundary layers", c("E16", "6"), prereq=["M14.5"]),
    mod("M14.7", "P14", "core", "הסעה מאולצת", "Forced convection", c("E16", "7"), prereq=["M14.6"]),
    mod("M14.8", "P14", "adv", "הסעה טבעית ועיבוי", "Natural convection and film condensation", c("E16", "8"), prereq=["M14.7"]),
    mod("M14.9", "P14", "adv", "רתיחה ומעברי פאזה", "Boiling and phase change", c("E16", "9"), prereq=["M14.8"]),
    mod("M14.10", "P14", "core", "מעבר חום בקרינה", "Radiative heat transfer", c("E16", "10"), prereq=["M14.2", "M9.9"]),
    mod("M14.11", "P14", "adv", "מבוא להעברת מסה", "Introduction to mass transfer", c("E16", "11"), prereq=["M14.7"]),
    mod("M14.12", "P14", "ref", "תכונות תרמופיזיקליות, יחידות וסימונים", "Thermophysical properties, units, nomenclature",
        *[c("E16", x, f"{x}: {title('E16', x)}") for x in "ABC"], prereq=["M14.1"]),

    # ---------------- P15 ----------------
    mod("M15.1", "P15", "core", "זרימת מים רטובים: צמיגות", "The flow of wet water: viscosity",
        c("F2", "41", "41: The Flow of Wet Water (פרק 40, זרימת מים יבשים, חסר בעותק)"), prereq=["M10.1", "M2.4"]),
    mod("M15.2", "P15", "adv", "מהנדסי האווירונאוטיקה הראשונים", "The first aeronautical engineers", c("E11", "1"), prereq=[]),
    mod("M15.3", "P15", "core", "מושגי יסוד: כוחות אווירודינמיים, גז אידאלי ואנטומיה של המטוס", "Fundamental thoughts",
        c("E11", "2"), prereq=["M13.1"]),
    mod("M15.4", "P15", "core", "האטמוספירה התקנית", "The standard atmosphere",
        c("E11", "3"), c("E11", "A", "A: Standard atmosphere, SI", "supp"), c("E11", "B", "B: Standard atmosphere, English units", "supp"), prereq=["M15.3"]),
    mod("M15.5", "P15", "core", "אווירודינמיקה בסיסית: רציפות, תנע, אנרגיה, מהירות הקול ומדידת מהירות", "Basic aerodynamics: the equations, speed of sound, airspeed",
        sec("E11", "4", None, "4.11"), prereq=["M15.4", "M15.1", "M13.6"]),
    mod("M15.6", "P15", "core", "זרימה דחיסה: מנהרות על-קוליות ומנועי רקטה", "Compressible flow, supersonic tunnels, rocket engines",
        sec("E11", "4", "4.12", "4.14"), c("E15", "17", "17: Compressible flow (Çengel)", "supp"), prereq=["M15.5"]),
    mod("M15.7", "P15", "core", "זרימה צמיגה: שכבות גבול, מעבר, היפרדות וגרר", "Viscous flow: boundary layers, transition, separation",
        sec("E11", "4", "4.15", "4.27"), probs("E11", "4"), prereq=["M15.6", "M14.6"]),
    mod("M15.8", "P15", "core", "פרופילי כנף: מקדמים, לחץ, דחיסות וגרר גלי", "Airfoils: coefficients, pressure, compressibility, wave drag",
        sec("E11", "5", None, "5.12"), c("E11", "D", "D: Airfoil data", "supp"), prereq=["M15.7"]),
    mod("M15.9", "P15", "core", "כנפיים סופיות: גרר מושרה, כנפיים משוכות ומדפים", "Finite wings: induced drag, swept wings, flaps",
        sec("E11", "5", "5.13", "5.17"), prereq=["M15.8"]),
    mod("M15.10", "P15", "core", "גלילים וכדורים, איך נוצר עילוי, והיסטוריה", "Cylinders and spheres, how lift is produced, history",
        sec("E11", "5", "5.18", "5.24"), probs("E11", "5"), prereq=["M15.9"]),
    mod("M15.11", "P15", "core", "ביצועים: קוטב הגרר, דחף והספק נדרשים, טיפוס ותקרות", "Performance: drag polar, thrust and power, climb, ceilings",
        sec("E11", "6", None, "6.11"), prereq=["M15.9"]),
    mod("M15.12", "P15", "core", "ביצועים: טווח, שהייה, המראה, נחיתה, פנייה ושיטת האנרגיה", "Performance: range, endurance, takeoff, landing, turns",
        sec("E11", "6", "6.12", "6.19"), prereq=["M15.11"]),
    mod("M15.13", "P15", "core", "כטב\"מים, מיקרו-רחפנים ויעילות אווירודינמית", "UAVs, micro air vehicles, aerodynamic efficiency",
        sec("E11", "6", "6.20", "6.28"), probs("E11", "6"), prereq=["M15.12"]),
    mod("M15.14", "P15", "core", "יציבות ושליטה", "Stability and control", c("E11", "7"), prereq=["M15.11", "M5.3"]),
    mod("M15.15", "P15", "core", "טיסה בחלל", "Space flight (astronautics)", c("E11", "8"), prereq=["M2.2", "M15.6"]),
    mod("M15.16", "P15", "core", "הנעה: מדחפים, מנועי בוכנה, סילון ורקטות", "Propulsion", c("E11", "9"), prereq=["M15.6", "M13.9"]),
    mod("M15.17", "P15", "adv", "כלי טיס היפרסוניים", "Hypersonic vehicles", c("E11", "10"), prereq=["M15.16"]),
    mod("M15.18", "P15", "ref", "סמלים ומקדמי המרה", "Symbols and conversion factors", c("E11", "C", "C: Symbols and conversion factors"), prereq=["M15.3"]),

    # ---------------- P16 ----------------
    mod("M16.1", "P16", "core", "טנזורים, אלסטיות וחומרים אלסטיים", "Tensors, elasticity, elastic materials",
        cs("F2", "31", "38", "39"), prereq=["M8.2", "M2.5"]),
    mod("M16.2", "P16", "core", "מתיחה, לחיצה, גזירה ואיברים בעומס צירי", "Tension, compression, shear, axially loaded members",
        cs("E13", "1", "2"), cs("E13a", "1", "2"), prereq=["M16.1"]),
    mod("M16.3", "P16", "core", "פיתול", "Torsion", c("E13", "3"), c("E13a", "3"), prereq=["M16.2"]),
    mod("M16.4", "P16", "core", "כוחות גזירה, מומנטי כפיפה ומאמצים בקורות", "Shear forces, bending moments, stresses in beams",
        cs("E13", "4", "5", "6"), cs("E13a", "4", "5", "6"), prereq=["M16.2"]),
    mod("M16.5", "P16", "core", "ניתוח מאמץ ועיבור ויישומי מאמץ מישורי", "Analysis of stress and strain, plane stress applications",
        cs("E13", "7", "8"), cs("E13a", "7", "8"), prereq=["M16.4"]),
    mod("M16.6", "P16", "core", "שקיעת קורות וקורות לא מסוימות סטטית", "Deflections of beams, statically indeterminate beams",
        cs("E13", "9", "10"), cs("E13a", "9", "10"), prereq=["M16.4"]),
    mod("M16.7", "P16", "core", "עמודים וקריסה", "Columns and buckling", c("E13", "11"), c("E13a", "11"), prereq=["M16.6"]),
    mod("M16.8", "P16", "ref", "מרכזי כובד, מומנטי התמד, טבלאות ושאלות חזרה", "Centroids, moments of inertia, reference tables, FE review problems",
        c("E13", "12"), *[c("E13", x, f"{x}: {title('E13', x)}", "supp") for x in "ABCDEFGH"], c("E13", "ANS", "תשובות לבעיות", "ex"),
        c("E13a", "12"), c("E13a", "A", "A: FE exam review problems", "ex"), prereq=["M16.2"]),
    mod("M16.9", "P16", "core", "מבוא לבחירת חומרים ותהליך התכנון", "Introduction to materials selection and the design process",
        cs("E12", "1", "2"), prereq=["M16.2"]),
    mod("M16.10", "P16", "core", "חומרים הנדסיים ותכונותיהם", "Engineering materials and their properties", c("E12", "3"), prereq=["M16.9"]),
    mod("M16.11", "P16", "core", "מפות תכונות החומרים", "Material property charts", c("E12", "4"), prereq=["M16.10"]),
    mod("M16.12", "P16", "core", "בחירת חומר: היסודות ומקרי בוחן", "Materials selection: the basics and case studies",
        cs("E12", "5", "6"), c("E12", "C", "C: Material indices", "supp"), c("E12", "E", "E: Exercises", "ex"), prereq=["M16.11"]),
    mod("M16.13", "P16", "core", "אילוצים מרובים ויעדים סותרים", "Multiple constraints and conflicting objectives", cs("E12", "7", "8"), prereq=["M16.12", "M8.17"]),
    mod("M16.14", "P16", "core", "בחירת חומר וצורה", "Selection of material and shape",
        cs("E12", "9", "10"), c("E12", "B", "B: Useful solutions for standard problems", "supp"), prereq=["M16.12", "M16.4"]),
    mod("M16.15", "P16", "adv", "תכנון חומרים היברידיים", "Designing hybrid materials", cs("E12", "11", "12"), prereq=["M16.14"]),
    mod("M16.16", "P16", "adv", "תהליכי ייצור ובחירתם", "Processes and process selection", cs("E12", "13", "14"), prereq=["M16.12"]),
    mod("M16.17", "P16", "adv", "חומרים והסביבה, עיצוב תעשייתי וכוחות שינוי", "Materials and the environment, industrial design, forces for change",
        cs("E12", "15", "16", "17"), prereq=["M16.12"]),
    mod("M16.18", "P16", "ref", "נתוני חומרים ומקורות מידע", "Data for engineering materials and data sources",
        c("E12", "A", "A: Data for engineering materials"), c("E12", "D", "D: Data sources for documentation"), prereq=["M16.10"]),

    # ---------------- P17 ----------------
    mod("M17.1", "P17", "core", "מבוא ולמידה מונחית", "Introduction and supervised learning", cs("E17", "1", "2"), prereq=["M6.8", "M8.5"]),
    mod("M17.2", "P17", "core", "רשתות נוירונים רדודות ועמוקות", "Shallow and deep neural networks",
        cs("E17", "3", "4"), sups("E04", "38", "39", "40"), prereq=["M17.1"]),
    mod("M17.3", "P17", "core", "פונקציות הפסד ולמידה כהסקה", "Loss functions and learning as inference",
        c("E17", "5"), sup("E04", "41"), prereq=["M17.2", "M6.5"]),
    mod("M17.4", "P17", "core", "התאמת מודלים: ירידה בגרדיאנט, גרדיאנטים ואתחול", "Fitting models: gradient descent, backpropagation, initialization",
        cs("E17", "6", "7"), sup("E04", "44"), prereq=["M17.3", "M8.22"]),
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
        cs("E04", "42", "43", "45", "46"), prereq=["M17.4", "M7.12"]),
    mod("M17.15", "P17", "core", "שיטות לא-פרמטריות, החלקה וסיווג", "Nonparametric estimation, smoothing, classification",
        cs("E05", "20", "21", "22"), prereq=["M6.8", "M4.4"]),

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
    mod("M18.8", "P18", "adv", "פסיכולוגיה ומדעי המוח", "Psychology and neuroscience", cs("E18", "14", "15"), prereq=["M18.3"]),
    mod("M18.9", "P18", "core", "יישומים, מקרי בוחן וחזיתות", "Applications, case studies, frontiers", cs("E18", "16", "17"), prereq=["M18.7"]),

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
    mod("M20.4", "P20", "adv", "קבוצות אינסופיות", "Infinite sets", c("E20", "8"), prereq=["M20.2"]),
    mod("M20.5", "P20", "core", "תורת המספרים ומספרים ראשוניים", "Number theory and prime numbers",
        cs("E20", "II", "9"), c("K2", "X"), prereq=["M20.2"]),
    mod("M20.6", "P20", "core", "גרפים מכוונים, סדרים חלקיים ורשתות תקשורת", "Directed graphs, partial orders, communication networks",
        cs("E20", "10", "11"), prereq=["M20.2"]),
    mod("M20.7", "P20", "core", "גרפים פשוטים וגרפים מישוריים", "Simple and planar graphs", cs("E20", "12", "13"), prereq=["M20.6"]),
    mod("M20.8", "P20", "core", "סכומים ואסימפטוטיקה", "Sums and asymptotics", cs("E20", "III", "14"), prereq=["M20.2", "M1.2"]),
    mod("M20.9", "P20", "core", "כללי ספירה ופונקציות יוצרות", "Cardinality rules and generating functions", cs("E20", "15", "16"), prereq=["M20.8"]),
    mod("M20.10", "P20", "adv", "נוסחאות נסיגה", "Recurrences", cs("E20", "V", "22"), prereq=["M20.9"]),

    # ---------------- P21 ----------------
    mod("M21.1", "P21", "core", "מבוא לתכנון אלגוריתמים וניתוח אלגוריתמים", "Algorithm design and analysis", cs("E21", "1", "2"), prereq=["M20.8"]),
    mod("M21.2", "P21", "core", "מבני נתונים", "Data structures", c("E21", "3"), sup("E21", "15"), prereq=["M21.1"]),
    mod("M21.3", "P21", "core", "מיון והפרד ומשול", "Sorting, divide and conquer", cs("E21", "4", "5"), prereq=["M21.2", "M20.10"]),
    mod("M21.4", "P21", "core", "גיבוב ואלגוריתמים אקראיים", "Hashing and randomized algorithms",
        c("E21", "6"), sup("E04", "12"), prereq=["M21.2", "M6.2"]),
    mod("M21.5", "P21", "core", "סריקת גרפים ואלגוריתמים על גרפים ממושקלים", "Graph traversal and weighted graph algorithms",
        cs("E21", "7", "8"), sup("E21", "18"), prereq=["M21.2", "M20.7"]),
    mod("M21.6", "P21", "core", "חיפוש קומבינטורי ותכנות דינמי", "Combinatorial search and dynamic programming", cs("E21", "9", "10"), prereq=["M21.5"]),
    mod("M21.7", "P21", "core", "NP-שלמות והתמודדות עם בעיות קשות", "NP-completeness and dealing with hard problems",
        cs("E21", "11", "12"), sup("E21", "19"), prereq=["M21.6"]),
    mod("M21.8", "P21", "core", "איך מתכננים אלגוריתם", "How to design algorithms", c("E21", "13"), prereq=["M21.7"]),
    mod("M21.9", "P21", "ref", "קטלוג הבעיות: בעיות נומריות וקומבינטוריות", "Catalog: numerical and combinatorial problems",
        cs("E21", "14", "16", "17"), prereq=["M21.8"]),
    mod("M21.10", "P21", "ref", "קטלוג הבעיות: גאומטריה חישובית, קבוצות ומחרוזות, ומקורות", "Catalog: computational geometry, sets and strings, resources",
        cs("E21", "20", "21", "22"), prereq=["M21.8"]),

    # ---------------- P22 ----------------
    mod("M22.1", "P22", "core", "מכונות חישוב אלקטרוניות: העקרונות", "Electronic computing machines: principles", c("K2", "XIV"), prereq=["M0.1"]),
    mod("M22.2", "P22", "core", "הפשטות המחשב וטכנולוגיה", "Computer abstractions and technology", c("E22", "1"), prereq=["M22.1"]),
    mod("M22.3", "P22", "core", "תכנון לוגי בסיסי", "The basics of logic design",
        c("E22", "A", "A: The basics of logic design"), c("E22", "C", "C: Mapping control to hardware", "supp"), prereq=["M22.2", "M20.1"]),
    mod("M22.4", "P22", "adv", "פקודות: שפת המחשב", "Instructions: language of the computer", c("E22", "2"), prereq=["M22.2"]),
    mod("M22.5", "P22", "adv", "אריתמטיקה במחשב", "Arithmetic for computers", c("E22", "3"), prereq=["M22.3", "M22.4"]),
    mod("M22.6", "P22", "core", "המעבד: נתיב נתונים, בקרה וצנרת", "The processor: datapath, control, pipelining", c("E22", "4"), prereq=["M22.5"]),
    mod("M22.7", "P22", "core", "היררכיית הזיכרון", "The memory hierarchy", c("E22", "5"), prereq=["M22.6"]),
    mod("M22.8", "P22", "core", "מעבדים מקביליים ומעבדים גרפיים", "Parallel processors and GPUs",
        c("E22", "6"), c("E22", "B", "B: Graphics and computing GPUs"), prereq=["M22.7"]),
    mod("M22.9", "P22", "ref", "סקר ארכיטקטורות RISC", "A survey of RISC architectures", c("E22", "D", "D: A survey of RISC architectures"), prereq=["M22.4"]),
    mod("M22.10", "P22", "adv", "מיקרו-מחשבים ומיקרו-מעבדים במעגל", "Microcomputers and microprocessors in circuits",
        cs("E09", "10", "11"), sup("E09a", "10-11"), prereq=["M11.9", "M22.6"]),

    # ---------------- P23 ----------------
    mod("M23.1", "P23", "core", "מערכות תקשורת: אפנון משרעת ותדר וריבוב", "Communication systems: AM, FM, multiplexing", c("E01", "8"), prereq=["M4.8"]),
    mod("M23.2", "P23", "core", "אפנון פולסים: PAM ו-QAM", "Pulse amplitude and quadrature amplitude modulation", c("E02", "12"), prereq=["M23.1", "M7.4"]),
    mod("M23.3", "P23", "core", "קודים לתיקון שגיאות וערוצים אמיתיים", "Error-correcting codes and real channels",
        cs("E04", "11", "13", "14"), prereq=["M7.7", "M8.1"]),
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
    mod("M24.10", "P24", "adv", "סימטריה, חוקי שימור ותנע זוויתי", "Symmetry, conservation laws, angular momentum",
        cs("F3", "17", "18"), c("F1", "52"), prereq=["M24.9", "M8.2"]),
    mod("M24.11", "P24", "core", "אטום המימן והטבלה המחזורית", "The hydrogen atom and the periodic table", c("F3", "19"), prereq=["M24.9"]),
    mod("M24.12", "P24", "adv", "אופרטורים, משוואת שרדינגר ומוליכות-על", "Operators, the Schrödinger equation, superconductivity",
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
    mod("M25.6", "P25", "adv", "הטרנזיסטור הביפולרי", "The bipolar transistor", c("E24", "8"), prereq=["M25.3"]),
    mod("M25.7", "P25", "core", "מבוא לתכנון VLSI", "Introduction to CMOS VLSI design", c("E25", "1"), prereq=["M25.4", "M22.3"]),
    mod("M25.8", "P25", "core", "השהיה, הספק וקווי חיבור", "Delay, power, interconnect", cs("E25", "4", "5", "6"), prereq=["M25.7"]),
    mod("M25.9", "P25", "adv", "עמידות וסימולציית מעגלים", "Robustness and circuit simulation", cs("E25", "7", "8"), prereq=["M25.8"]),
    mod("M25.10", "P25", "adv", "תכנון מעגלים צירופיים וסדרתיים", "Combinational and sequential circuit design", cs("E25", "9", "10"), prereq=["M25.8"]),
    mod("M25.11", "P25", "adv", "תת-מערכות: נתיבי נתונים, מערכים ומעגלים ייעודיים", "Datapath, array and special-purpose subsystems",
        cs("E25", "11", "12", "13"), prereq=["M25.10"]),
    mod("M25.12", "P25", "adv", "מתודולוגיית תכנון, בדיקה ואימות", "Design methodology, testing, verification", cs("E25", "14", "15"), prereq=["M25.10"]),
    mod("M25.13", "P25", "ref", "שפות תיאור חומרה", "Hardware description languages", c("E25", "A", "A: Hardware description languages"), prereq=["M25.10"]),

    # ---------------- P26 ----------------
    mod("M26.1", "P26", "adv", "עקומות ומשטחים", "Curves and surfaces", c("K2", "VII"), prereq=["M1.3", "M1.2"]),
    mod("M26.2", "P26", "adv", "תורת הפונקציות של משתנה ממשי: קבוצות, מידה ואינטגרל לבג", "Real-variable theory: sets, measure, the Lebesgue integral",
        c("K3", "XV"), prereq=["M1.2"]),
    mod("M26.3", "P26", "adv", "גאומטריה לא אוקלידית וגאומטריה רימנית", "Non-Euclidean and Riemannian geometry", c("K3", "XVII"), prereq=["M1.4"]),
    mod("M26.4", "P26", "adv", "טופולוגיה", "Topology", c("K3", "XVIII"), prereq=["M26.2"]),
    mod("M26.5", "P26", "adv", "חבורות ומערכות אלגבריות אחרות", "Groups and other algebraic systems", c("K3", "XX"), prereq=["M1.5", "M8.2"]),
]

# Pages that are deliberately not taught, with the reason: every front and back
# matter range from the maps, plus duplicated material. Everything else in a
# document belongs to some module.
SKIP = [(d, a, b, f"{'פתיחה' if k == 'FRONT' else 'סיום'}: {what}") for d in DOCS for k in ("FRONT", "BACK") for a, b, what in matter(d, k)]
SKIP += [
    ("F3", 28, 64, "פרקים 1–2 זהים לפיינמן I פרקים 37–38 (נלמדים שם, M24.3)"),
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
    "שיטת האלמנטים הסופיים (FEM) אין לה מקור: Strang לא נמצא, ו-Langtangen & Linge (E08) מכסה הפרשים סופיים בלבד.",
]
