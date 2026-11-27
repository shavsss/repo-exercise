"""Coverage check without a model (27.11.2026): essential topics per domain against titles, items and section headings.

  python3 tools/curriculum/coverage_check.py <lib/index.json>

Prints the topics found only in section headings, nowhere, or in a single module; each is read by hand (a regex can miss a title)."""
import json,re,sys
ms=json.load(open(sys.argv[1]))['modules']
T={
'math':{'complex analysis':r'complex (analysis|variable|function)|residue','linear algebra eig':r'eigen','pde methods':r'partial differential|separation of variables','numerical linear algebra':r'condition number|lu decomposition|iterative method','graph theory':r'graph theor|graphs?\b.*(path|tree)','discrete math/logic':r'propositional|combinator|induction','tensor':r'tensor','stochastic calculus':r'stochastic differential|ito\b|brownian'},
'signals/control':{'dft/fft':r'\bfft\b|discrete fourier','filter design':r'filter design|fir\b|iir\b','wavelets':r'wavelet','multirate':r'multirate|decimation|polyphase','pid tuning':r'\bpid\b','robust control':r'robust control|h-?infinity|mu-synthesis','nonlinear control':r'lyapunov|nonlinear control|sliding mode','system identification':r'system identification','kalman/ekf/ukf':r'extended kalman|unscented|\bekf\b','particle filter':r'particle filter','sensor fusion/ins':r'inertial navigation|\bins\b|sensor fusion|gnss'},
'comm/rf':{'link budget':r'link budget','modulation':r'\bqam\b|\bpsk\b|\bofdm\b','channel coding':r'channel cod|ldpc|turbo code|convolutional code|reed','mimo':r'\bmimo\b','synchronization':r'synchroni[sz]ation|carrier recovery|timing recovery','antenna arrays/beamforming':r'beamform|phased array|antenna array','radar signal processing':r'radar|pulse compression|doppler','smith chart/matching':r'smith chart|impedance matching','noise figure':r'noise figure','pll/oscillators':r'phase-locked|\bpll\b|oscillator','5g/cellular':r'\b5g\b|lte|cellular','networking tcp/ip':r'tcp|ip\b|internet protocol|routing'},
'electronics':{'op-amp design':r'op[- ]amp|operational amplifier','adc/dac':r'\badc\b|\bdac\b|analog-to-digital|data converter','power electronics':r'buck|boost|converter','pcb design/layout':r'\bpcb\b|layout','emc':r'\bemc\b|electromagnetic compat','grounding/shielding':r'grounding|shielding','sensors/instrumentation':r'sensor|transducer|instrumentation','batteries/bms':r'batter','motor drives':r'motor drive|inverter|foc|field[- ]oriented','analog filters':r'active filter|analog filter','spice simulation':r'spice'},
'computing':{'embedded/rtos':r'rtos|real-time operating|embedded','computer architecture':r'pipelin|cache|instruction set','os/concurrency':r'concurren|thread|operating system','networks':r'network','databases':r'database|sql','distributed systems':r'distributed system|consensus|raft|paxos','compilers':r'compiler','security/crypto':r'cryptograph|encryption|security','software engineering/testing':r'unit test|testing|version control|\bgit\b','gpu/cuda':r'cuda|gpu','fpga/hdl':r'fpga|verilog|vhdl|hdl'},
'mech/aero/thermo':{'kinematics/dynamics of mechanisms':r'mechanism|linkage|kinematic','vibration/modal':r'modal analysis|vibration','fea':r'finite element','cfd':r'\bcfd\b|computational fluid','compressible flow':r'compressible|shock|mach','propulsion':r'propulsion|jet engine|rocket|propeller','flight dynamics/stability':r'flight dynamics|stability and control|longitudinal','orbital mechanics':r'orbit|kepler','heat exchangers':r'heat exchanger','thermal radiation':r'radiation heat|thermal radiation|view factor','refrigeration/cycles':r'refrigerat|rankine|brayton|cycle','gd&t/tolerances':r'gd&t|tolerance','manufacturing processes':r'machining|casting|manufactur'},
'physics/quantum/chips':{'quantum mechanics':r'schr[oö]dinger|quantum mechanic','quantum computing':r'qubit|quantum comput','quantum sensing':r'quantum sens|atomic clock|magnetometer','optics/photonics':r'optic|laser|photon','solid state':r'band|crystal|phonon','device physics':r'mosfet|pn junction|p-n','analog ic design':r'analog ic|cmos amplifier|current mirror','digital ic/vlsi':r'vlsi|standard cell|timing analysis','semiconductor fab':r'lithograph|fabrication|wafer','statistical mechanics':r'statistical mechanic|boltzmann'},
'systems/practice':{'requirements':r'requirement','reliability engineering':r'reliability|fmea|fault tree','safety standards':r'safety|iso 26262|do-178|iec 61508','cost estimation':r'cost estimat|cost model','project management':r'schedule|project management','test & verification':r'verification|validation','technical writing/communication':r'technical writing|report|communication of','ethics':r'ethic','human factors':r'human factors|ergonomic','patents/ip':r'patent|intellectual property'},
}
def where(rx):
  R=re.compile(rx,re.I); t=[];i=[];s=[]
  for m in ms:
    if R.search(m['en']): t.append(m['id'])
    elif any(R.search(x['n']+' '+x.get('teach','')) for x in m.get('items',[])): i.append(m['id'])
    elif any(R.search(x.get('title','')) for x in m.get('sections',[])): s.append(m['id'])
  return t,i,s
for dom,topics in T.items():
  for name,rx in topics.items():
    t,i,s=where(rx)
    lvl='TITLE' if t else 'ITEM' if i else 'SECTIONS' if s else 'NONE'
    if lvl in('SECTIONS','NONE') or len(t)+len(i)<=1:
      print(f"{dom:18s} {name:30s} {lvl:8s} t={t[:3]} i={i[:3]} s={len(s)}:{s[:4]}")
