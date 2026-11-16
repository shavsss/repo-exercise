"""Round 8 (15.11.2026): the layered order, the learner's new modules and the gaps of the audit.

Applied at the end of each syllabus.py (library/*/syllabus/syllabus.py):
  MODULES, PARTS = round8.apply("eng" | "mil", MODULES, PARTS)

What it does, never removing anything:
  - adds the new modules (no sources yet: they are taught from their items until a source
    arrives; docs/research/round8_layers/ has the plan and the source list);
  - adds the prerequisites the audit found missing, and the learner's order fixes;
  - orders MODULES by the layered plan (the app suggests the first open module in this order),
    with a stable topological sort, so no module comes before one of its prerequisites.
The two apps are learned separately (learner's decision): no prerequisite crosses apps.
The new modules' items are in round8_items.json (merged by build_curriculum.py).
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent

NEW_PARTS = {
    "eng": [("P28", "גשר: תכן ספרתי, מחשוב מואץ ומערכות זמן-אמת"),
            ("P29", "גשר: הנדסת AI מודרני"),
            ("P30", "גשר: הנדסה ימית")],
    # Lanchester's systems block comes after air and missile defense (P7), before the platforms (P8)
    "mil": [("P15", "ארכיטקטורת מערכות, קשר וסייבר-ספקטרום")],
}
PART_AFTER = {"eng": {}, "mil": {"P15": "P7"}}

# id: (part, tier, Hebrew title, English title, prerequisites)
NEW = {"eng": {
    "M0.3": ("P0", "core", "תכנות מדעי: Python, NumPy, git ובדיקות", "Scientific programming: Python, NumPy, git, tests", ["M0.1"]),
    "M4.17": ("P4", "core", "בנקי מסננים ומפצלי ערוצים פוליפאזיים", "Filter banks and polyphase channelizers", ["M4.14"]),
    "M4.18": ("P4", "core", "DSP בנקודה קבועה ובזמן אמת", "Fixed-point and real-time DSP", ["M4.17"]),
    "M5.16": ("P5", "core", "תורת מערכות לינאריות", "Linear systems theory (EE263 level)", ["M8.4", "M8.8", "M5.6"]),
    "M5.17": ("P5", "core", "עקיבה ושיוך נתונים: IMM, JPDA ו-MHT", "Tracking and data association: IMM, JPDA, MHT", ["M5.14", "M7.4"]),
    "M5.18": ("P5", "core", "בקרה לא לינארית", "Nonlinear control", ["M5.3", "M5.4", "M5.13", "M5.16"]),
    "M5.19": ("P5", "core", "בקרה אופטימלית ו-MPC", "Optimal control and MPC", ["M5.5", "M8.22", "M8.24"]),
    "M5.20": ("P5", "core", "זיהוי מערכות", "System identification", ["M5.7", "M7.2", "M8.5", "M5.19"]),
    "M5.21": ("P5", "adv", "בקרה רב-משתנית ועמידה", "Multivariable and robust control", ["M5.11", "M5.16"]),
    "M5.22": ("P5", "adv", "בקרה ספרתית", "Digital control", ["M5.10", "M4.10"]),
    "M6.13": ("P6", "core", "תכנון ניסויים וסטטיסטיקה של ניסוי", "Design of experiments and test statistics", ["M6.8"]),
    "M7.19": ("P7", "core", "תורת הגילוי והשערוך לעומק", "Detection and estimation theory in depth", ["M7.4", "M6.5", "M8.5"]),
    "M7.20": ("P7", "core", "סינון אדפטיבי: LMS ו-RLS", "Adaptive filtering: LMS, RLS", ["M7.3", "M7.4", "M8.5", "M8.8"]),
    "M7.21": ("P7", "adv", "משוואות דיפרנציאליות סטוכסטיות", "Stochastic differential equations", ["M7.1", "M5.14"]),
    "M8.24": ("P8", "core", "אופטימיזציה נומרית מעבר לקמירות", "Numerical optimization beyond convexity: Gauss-Newton/LM, SQP, integer", ["M8.22"]),
    "M10.12": ("P10", "core", "אלקטרומגנטיות חישובית: FDTD ו-MoM", "Computational electromagnetics: FDTD, MoM", ["M9.17", "M10.5", "M10.8"]),
    "M10.13": ("P10", "adv", "משוואות דיפרנציאליות רגילות נומריות, קשיחות וגזירה אוטומטית", "Numerical ODEs, stiffness and automatic differentiation", ["M10.4", "M8.6"]),
    "M11.24": ("P11", "core", "שלמות אות והספק ו-EMC", "Signal integrity, power integrity and EMC", ["M11.11", "M9.17", "M11.20"]),
    "M11.25": ("P11", "adv", "חיישנים ומתמרים", "Sensors and transducers", ["M11.7", "M11.9"]),
    "M12.12": ("P12", "core", "אלקטרוניקת הספק", "Power electronics", ["M11.6", "M11.18", "M5.7", "M12.4"]),
    "M15.31": ("P15", "adv", "מדחפים ורוטורים", "Propellers and rotors", ["M15.22", "M15.16"]),
    "M15.32": ("P15", "adv", "דינמיקת זורמים חישובית (CFD)", "CFD", ["M14.13", "M10.10"]),
    "M18.11": ("P18", "core", "אלגוריתמי RL עמוק: DQN, PPO, SAC ומבוססי מודל", "Deep RL algorithms: DQN, PPO, SAC, model-based", ["M18.7", "M17.4"]),
    "M19.12": ("P19", "core", "ראייה גאומטרית, גאומטריה רב-מבטית ו-SLAM", "Geometric vision, multi-view geometry and SLAM", ["M19.2", "M19.10", "M5.14", "M8.24"]),
    "M22.13": ("P22", "adv", "תכנות C ותכנות מערכות", "C and systems programming", ["M22.4", "M0.3"]),
    "M22.14": ("P22", "core", "מערכות הפעלה ומקביליות", "Operating systems and concurrency", ["M22.7", "M21.2"]),
    "M22.15": ("P22", "core", "קריפטוגרפיה ויסודות הנדסת אבטחה", "Cryptography and security engineering foundations", ["M20.5", "M23.12"]),
    "M22.16": ("P22", "adv", "מערכות מבוזרות", "Distributed systems", ["M22.14", "M23.12"]),
    "M23.17": ("P23", "core", "מקלטי תקשורת ספרתית: סנכרון ואיקוול", "Digital communication receivers: synchronization, equalization", ["M23.2", "M7.4"]),
    "M23.18": ("P23", "adv", "PLL וסינתזת תדר", "PLL and frequency synthesis", ["M23.17", "M5.8"]),
    "M23.19": ("P23", "adv", "5G NR", "5G NR", ["M23.17", "M23.9"]),
    "M24.14": ("P24", "adv", "חישה קוונטית", "Quantum sensing", ["M24.7"]),
    "M24.15": ("P24", "adv", "פוטוניקה", "Photonics", ["M9.13", "M24.8"]),
    "M27.10": ("P27", "core", "MBSE ו-SysML v2", "MBSE with SysML v2", ["M27.2", "M27.4"]),
    "M27.11": ("P27", "adv", "הנדסת אמינות", "Reliability engineering", ["M6.2", "M27.8"]),
    "M28.1": ("P28", "core", "מיקרו-ארכיטקטורה וקוהרנטיות זיכרון: Out-of-Order ו-MESI/MOESI", "Microarchitecture and memory coherence: out-of-order, MESI/MOESI", ["M22.6", "M22.7"]),
    "M28.2": ("P28", "core", "מאיצים ותכנות מקבילי: GPU/CUDA, HBM ומודל Roofline", "Accelerators and parallel programming: GPU/CUDA, HBM, roofline", ["M22.8", "M28.1"]),
    "M28.3": ("P28", "core", "תכן RTL מתקדם ו-FPGA: SystemVerilog ו-STA", "Advanced RTL and FPGA: SystemVerilog, static timing analysis", ["M22.3", "M11.8", "M25.8"]),
    "M28.4": ("P28", "core", "חיבורים מהירים: PCIe, NVLink, CXL ו-SerDes", "High-speed interconnects: PCIe, NVLink, CXL, SerDes", ["M28.2", "M9.17", "M11.24"]),
    "M28.5": ("P28", "core", "מערכות זמן-אמת: RTOS, תזמון וסנכרון שעונים PTP", "Real-time systems: RTOS, scheduling, PTP clock sync", ["M22.11", "M23.11", "M22.14"]),
    "M28.6": ("P28", "core", "אבטחת חומרה וקושחה: Root of Trust, ערוצי צד ו-Anti-Tamper", "Hardware and firmware security: root of trust, side channels, anti-tamper", ["M28.3", "M28.1", "M22.15"]),
    "M29.1": ("P29", "core", "ארכיטקטורת מודלי יסוד: LLM/VLM, FlashAttention, RoPE ו-MoE", "Foundation-model architecture: LLM/VLM, FlashAttention, RoPE, MoE", ["M17.7", "M17.4", "M28.2"]),
    "M29.2": ("P29", "core", "חוקי סקיילינג ואימון מבוזר: TP/PP/EP ו-NCCL", "Scaling laws and distributed training: TP/PP/EP, NCCL", ["M29.1", "M28.2"]),
    "M29.3": ("P29", "core", "אימון המשך לחשיבה: SFT, RLHF, DPO, GRPO ו-Test-Time Compute", "Post-training for reasoning: SFT, RLHF, DPO, GRPO, test-time compute", ["M29.1", "M18.11"]),
    "M29.4": ("P29", "core", "אופטימיזציית הסקה: KV-Cache, FP8/INT4 ו-Speculative Decoding", "Inference optimization: KV-cache, FP8/INT4, speculative decoding", ["M29.1", "M28.2"]),
    "M29.5": ("P29", "core", "ראייה ממוחשבת מודרנית ותפיסה תלת-ממדית: DETR, SAM, World Models ו-3DGS", "Modern vision and 3D perception: DETR, SAM, world models, 3DGS", ["M17.6", "M17.7", "M17.11", "M19.12"]),
    "M29.6": ("P29", "core", "מערכות סוכנים ובקרה סגורה", "Agent systems and closed-loop control", ["M29.3", "M5.19"]),
    "M29.7": ("P29", "core", "AI בקצה וחוסן תחת מגבלות SWaP", "Edge AI and robustness under SWaP", ["M29.4", "M17.16"]),
    "M29.8": ("P29", "adv", "מערכות ML ו-MLOps", "ML systems and MLOps", ["M29.4"]),
    "M30.1": ("P30", "core", "הידרוסטטיקה ויציבות ספינה", "Ship hydrostatics and stability", ["M15.19", "M2.6"]),
    "M30.2": ("P30", "core", "התנגדות, הנעה ומדחפים ימיים", "Ship resistance, propulsion and propellers", ["M30.1", "M15.26"]),
    "M30.3": ("P30", "core", "התנהגות בים ותמרון בשש דרגות חופש", "Seakeeping and manoeuvring (6-DOF)", ["M30.2", "M3.4", "M5.7"]),
    "M30.4": ("P30", "core", "מבני ספינה והנדסה ימית", "Ship structures and marine engineering", ["M30.1", "M16.23", "M16.7"]),
    "M30.5": ("P30", "core", "אקוסטיקה תת-ימית: הלמהולץ, קרניים, מודים נורמליים, PE ותעלת SOFAR", "Underwater acoustics: Helmholtz, rays, normal modes, PE, SOFAR", ["M9.1", "M10.1", "M7.17"]),
    "M30.6": ("P30", "core", "צוללות ו-UUV: גוף לחץ וקריסה, הידרודינמיקה, השתקה והנעה", "Submarines and UUVs: pressure hull and buckling, hydrodynamics, quieting, AIP vs nuclear", ["M30.3", "M30.4", "M16.7"]),
}, "mil": {
    "M3.15": ("P3", "adv", "חתימות IR ורב-ספקטרליות", "IR and multispectral signatures", ["M3.4", "M3.10"]),
    "M5.13": ("P5", "core", "ניווט משולב בסביבה מוכחשת-GPS: INS הדוק, VIO, TERCOM/DSMAC ו-Factor Graphs", "GPS-denied integrated navigation: tight INS, VIO, TERCOM/DSMAC, factor graphs", ["M5.8", "M5.11"]),
    "M5.14": ("P5", "core", "ניווט באותות הזדמנות ושעונים אטומיים ניידים", "Signals of opportunity (LEO PNT, cellular, celestial) and portable atomic clocks", ["M5.6", "M5.11"]),
    "M6.15": ("P6", "core", "הנעת טילים: מנוע רקטי מוצק, ראמג'ט וסקרמג'ט", "Missile propulsion: solid motors, ramjet, scramjet", ["M6.2", "M6.12"]),
    "M6.16": ("P6", "core", "איומים היפרסוניים וההגנה מפניהם", "Hypersonic threats and their defense", ["M6.9", "M7.6", "M2.29"]),
    "M7.12": ("P7", "core", "היתוך רב-חיישני ותמונת מצב משותפת", "Multisensor fusion and the common operating picture", ["M2.29", "M5.8"]),
    "M7.13": ("P7", "core", "שו\"ב וניהול קרב, אוטומציה של שרשרת האש וצוות אדם-מכונה", "C2 and battle management, kill-chain automation, human-machine teaming", ["M7.11", "M7.12"]),
    "M7.14": ("P7", "core", "ניסוי והערכה: סטטיסטיקה בפועל", "Test and evaluation: statistics in practice", ["M7.10", "M0.4"]),
    "M7.15": ("P7", "core", "דיני לחימה, בדיקת חוקיות נשק, מדיניות אוטונומיה ופיקוח על יצוא", "Law of armed conflict, weapons review, autonomy policy, export control", ["M7.13"]),
    "M7.16": ("P7", "adv", "C-RAM: יירוט רקטות, ארטילריה ומרגמות", "C-RAM", ["M7.5", "M2.22"]),
    "M7.17": ("P7", "core", "לייזר רב-עוצמה (HEL): התפשטות בטורבולנציה, Thermal Blooming, אופטיקה אדפטיבית ו-ATP", "High-energy lasers: beam propagation in turbulence, thermal blooming, adaptive optics, ATP, laser-material", ["M7.6", "M3.5", "M3.13"]),
    "M7.18": ("P7", "core", "מיקרוגל רב-עוצמה (HPM): מקורות, צימוד ומודל Wunsch-Bell", "High-power microwaves: sources, front/back-door coupling, Wunsch-Bell", ["M1.1", "M7.1"]),
    "M8.10": ("P8", "adv", "תכן מטוסי קרב", "Combat aircraft design", ["M8.1", "M8.8"]),
    "M9.10": ("P9", "core", "הנדסת מערכות C-UAS ואמצעי יירוט", "C-UAS systems engineering and effectors", ["M9.7", "M9.9", "M7.17", "M7.18"]),
    "M10.6": ("P10", "core", "עיבוד אותות סונאר: MVDR במערכים נגררים, LOFAR/DEMON ו-TMA", "Sonar signal processing: MVDR on towed arrays, LOFAR/DEMON, TMA", ["M10.3", "M2.30"]),
    "M10.7": ("P10", "core", "מערכות צוללת: השתקה, AIP מול גרעינית ותקשורת VLF/ELF", "Submarine warfare systems: quieting, AIP vs nuclear, VLF/ELF communications", ["M10.3"]),
    "M10.8": ("P10", "core", "כלים ימיים בלתי מאוישים, נחילים ימיים ופיצוץ תת-ימי", "USV/UUV operations, naval swarms, underwater explosion: shock and whipping", ["M10.4", "M5.8"]),
    "M10.9": ("P10", "core", "לוחמת שטח ימית והגנה אווירית של צי", "Naval surface warfare and fleet air defense", ["M10.5", "M7.4"]),
    "M10.10": ("P10", "core", "לוחמה נגד צוללות, מוקשים ונטרול מוקשים", "ASW operations analysis, mines and mine countermeasures", ["M10.6", "M3.11"]),
    "M11.11": ("P11", "core", "בליסטיקה פנימית, חיצונית וסופית", "Gun and projectile ballistics", ["M11.1"]),
    "M11.12": ("P11", "core", "מכניקת ראשי קרב ומרעומים", "Warhead mechanics and fuzing", ["M11.3", "M11.11"]),
    "M11.13": ("P11", "core", "טילי נ\"ט דור 3–5, תקיפה מלמעלה והתגברות על הגנה אקטיבית", "Anti-tank missiles gen 3-5, top attack, APS and its defeat", ["M11.6", "M6.6"]),
    "M11.14": ("P11", "core", "ייצוב נשק בתנועה: חוגי בקרה של צריח ותותח", "Weapon stabilization on the move: turret and gun control loops", ["M0.7", "M11.7"]),
    "M11.15": ("P11", "core", "טרמכניקה ומתלים אקטיביים", "Terramechanics (Bekker, Wong) and active suspension", ["M11.7"]),
    "M11.16": ("P11", "core", "אוטונומיה קרקעית (UGV): תפיסה תלת-ממדית, עבירות ותכנון מסלול", "UGV autonomy: 3D perception, traversability, planning", ["M11.15", "M5.13"]),
    "M11.17": ("P11", "core", "לוחמה תת-קרקעית: גילוי מנהרות, SLAM בלי GPS ופיצוץ בחלל סגור", "Subterranean warfare: tunnel detection (GPR, seismic, microgravity), GPS-free SLAM, confined blast", ["M11.3", "M5.13"]),
    "M11.18": ("P11", "adv", "Weaponeering והערכת נזק נלווה", "Weaponeering and collateral-damage estimation", ["M11.4", "M6.7"]),
    "M11.19": ("P11", "adv", "ארטילריה ואש מדויקת", "Artillery and precision fires", ["M11.11", "M11.2"]),
    "M11.20": ("P11", "adv", "יסודות CBRN", "CBRN basics", ["M11.3"]),
    "M12.5": ("P12", "adv", "הערכת הפצת נשק גרעיני", "Nuclear proliferation assessment", ["M11.10"]),
    "M13.24": ("P13", "adv", "SATCOM מוגן", "Protected SATCOM", ["M13.10", "M4.12"]),
    "M14.8": ("P14", "adv", "משחקי מלחמה", "Wargaming", ["M14.1"]),
    "M15.1": ("P15", "core", "ארכיטקטורת אוויוניקה ווטרוניקה ואפיקי נתונים: MIL-STD-1553, ARINC 429, SpaceWire ו-TSN", "Avionics and vetronics buses: MIL-STD-1553, ARINC 429, SpaceWire, TSN", ["M7.9"]),
    "M15.2": ("P15", "core", "רשתות טקטיות ו-MANET", "Tactical networks and MANET", ["M7.9", "M4.11"]),
    "M15.3": ("P15", "core", "קישורי נתונים טקטיים: Link 16 לעומק, VMF, MADL ופרוטוקולי נחילים", "Tactical datalinks: Link 16 in depth, VMF, MADL (open level), swarm protocols", ["M15.2"]),
    "M15.4": ("P15", "core", "AI טקטי בלולאה סגורה: ATR על SoC/FPGA/GPU ותקציבי השהיה", "Tactical edge AI in the loop: ATR on SoC/FPGA/GPU, latency budgets", ["M15.1"]),
    "M15.5": ("P15", "core", "פעילות סייבר-אלקטרומגנטית (CEMA): משטח התקיפה של קישורי RF וההגנה עליו", "Cyber-electromagnetic activity (CEMA): attack surface of RF links and its defense", ["M15.3", "M4.11"]),
    "M15.6": ("P15", "core", "שילוב בפלטפורמה: EMC/EMI והפרעות Co-site", "Platform integration: EMC/EMI and co-site interference", ["M1.6", "M15.1"]),
}}

# prerequisites the audit found missing (order errors and gaps in the index)
EXTRA = {"eng": {
    "M5.6": ["M7.3"], "M14.6": ["M15.19"], "M14.7": ["M15.26"], "M14.13": ["M15.26"], "M10.4": ["M0.3"],
    "M11.8": ["M22.3"], "M13.19": ["M11.18", "M11.19", "M12.8", "M8.7"], "M13.23": ["M12.8"], "M25.1": ["M13.20"],
    "M10.10": ["M8.13"], "M5.12": ["M4.11"], "M15.28": ["M5.7", "M8.8"], "M19.8": ["M5.3"], "M2.7": ["M8.8"],
    "M5.3": ["M8.8"], "M6.8": ["M8.5"], "M7.3": ["M8.5"],
}, "mil": {
    "M2.40": ["M2.12"], "M2.14": ["M2.2", "M1.2"], "M4.8": ["M2.15", "M2.12"], "M13.23": ["M4.12"], "M6.8": ["M13.4", "M13.12"],
    "M4.12": ["M13.10"], "M4.10": ["M6.6"], "M6.7": ["M11.1", "M11.4"], "M7.4": ["M11.4", "M14.1"],
    "M10.5": ["M7.3", "M7.4", "M6.10", "M2.23", "M14.1"], "M6.10": ["M5.11"],
}}

# The fixes of the order research (docs/research/round8_layers/eng_gaps.md 2.2-2.3) that were not applied
# on 15.11: modules the course builds on become core, and wrong prerequisites are replaced.
TIER = {"eng": {"M20.10": "core", "M22.4": "core", "M22.5": "core", "M24.9": "core", "M24.7": "core", "M17.10": "core", "M20.3": "core"}, "mil": {}}
DROP = {"eng": {"M15.8": ["M15.7"], "M16.24": ["M16.15"], "M3.5": ["M10.1"], "M13.19": ["M12.1"]}, "mil": {}}
EXTRA["eng"].update({"M24.8": ["M24.7"], "M22.11": ["M20.3"], "M22.3": ["M20.3"], "M23.12": ["M20.3"], "M19.10": ["M5.14"],
                     "M15.8": ["M15.26", "M14.6"], "M16.24": ["M16.1", "M16.10"], "M3.5": ["M9.1", "M4.4"]})


def _plan(app):
    """The plan order: Gilua's layers track by track; Lanchester's blocks stage by stage."""
    ns = {}
    exec((HERE / f"round8_plan_{app}.py").read_text(), ns)
    return ns["ORDER"]


def _expand(ids, mods):
    import re
    out = []
    for x in ids:
        m = re.match(r"(M\d+)\.(\d+)-(\d+)$", x)
        if m:
            out += [f"{m[1]}.{i}" for i in range(int(m[2]), int(m[3]) + 1) if f"{m[1]}.{i}" in mods]
        elif re.match(r"P\d+$", x):
            out += [k for k, v in mods.items() if v["part"] == x]
        else:
            out.append(x)
    return out


def _sources():
    f = HERE / "round8_sources.json"
    return json.loads(f.read_text()) if f.exists() else {"docs": {}, "modules": {}}


def docs(app):
    """The documents round 8 adds to this app's library: {doc: (path, title)} (free sources, and
    documents of the other app's library that a new module here is taught from)."""
    return {d: tuple(v) for d, v in _sources()["docs"].get(app, {}).items()}


def apply(app, modules, parts):
    by = {m["id"]: m for m in modules}
    src = _sources()["modules"].get(app, {})
    for mid, (part, tier, he, en, pre) in NEW[app].items():
        assert mid not in by, f"{mid} exists"
        by[mid] = dict(id=mid, part=part, tier=tier, title=he, en=en, prereq=list(pre), sources=[dict(s) for s in src.get(mid, [])])
    for mid, pre in DROP[app].items():
        by[mid]["prereq"] = [p for p in by[mid].get("prereq", []) if p not in pre]
    for mid, tier in TIER[app].items():
        by[mid]["tier"] = tier
    for mid, pre in EXTRA[app].items():
        have = by[mid].get("prereq", [])
        by[mid]["prereq"] = have + [p for p in pre if p not in have]
    for m in by.values():
        missing = [p for p in m.get("prereq", []) if p not in by]
        assert not missing, f"{m['id']}: unknown prerequisites {missing}"
    # stable topological sort: plan rank first, then the old order; a module waits for its prerequisites
    rank = {}
    for i, k in enumerate(_expand(_plan(app), by)):
        rank.setdefault(k, i)
    old = {m["id"]: i for i, m in enumerate(modules)}
    key = lambda k: (rank.get(k, 10**6), old.get(k, 10**6))
    order, seen, visiting = [], set(), set()

    def visit(k):
        if k in seen:
            return
        assert k not in visiting, f"prerequisite cycle at {k}"
        visiting.add(k)
        for p in sorted(by[k].get("prereq", []), key=key):
            visit(p)
        visiting.discard(k)
        seen.add(k)
        order.append(k)

    for k in sorted(by, key=key):
        visit(k)
    parts = list(parts)
    for pid, title in NEW_PARTS[app]:
        after = PART_AFTER[app].get(pid)
        parts.insert([p[0] for p in parts].index(after) + 1 if after else len(parts), (pid, title))
    return [by[k] for k in order], parts


def items(app):
    """{module id: [curriculum items]} for the new modules (build_curriculum.py merges them)."""
    return json.loads((HERE / "round8_items.json").read_text())[app]
