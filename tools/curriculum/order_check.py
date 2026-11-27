"""Order check of a track without a model (27.11.2026, the learner: in the AI stage, topics that build on foundations
came before them).

  python3 tools/curriculum/order_check.py <lib/index.json>

1. every declared prerequisite comes before its module (exit code 1 otherwise);
2. a heuristic over the topics: a module whose English title or items use a key concept (CONCEPTS) before the first
   module whose title names it. Most flags are a deliberate first look or a keyword that matches by chance; each one
   is read, and a real one is fixed in round9.json (placement) or build_curriculum.py (CARRY, an item's host).
"""
import json
import re
import sys

d=json.load(open(sys.argv[1])); ms=d['modules']
pos={m['id']:i for i,m in enumerate(ms)}
late=[(m['id'],p) for m in ms for p in m['prereq'] if pos.get(p,-1)>pos[m['id']]]
for k,p in late: print(f'{k} comes before its prerequisite {p}')
CONCEPTS={ # concept: regex on lowercase English
'linear algebra':r'linear algebra|eigen|matri(x|ces)','svd':r'\bsvd\b|singular value','probability':r'probabilit','statistics':r'statistic|estimator|hypothesis test',
'bayes':r'bayes','optimization':r'optimi[sz]ation|convex','gradient descent':r'gradient descent|\bsgd\b','fourier':r'fourier|spectrum|spectral',
'laplace':r'laplace transform','z-transform':r'z-transform','convolution':r'convolution','differential equations':r'differential equation|\bode\b|\bodes\b',
'pde':r'\bpdes?\b|partial differential','vector calculus':r'vector calculus|divergence|curl\b|gradient field','complex analysis':r'complex (analysis|variable)',
'markov':r'markov','random process':r'random process|stochastic process|power spectral','information theory':r'information theory|entropy|mutual information',
'kalman':r'kalman','state space':r'state[- ]space','control':r'feedback control|pid\b|controller','sampling':r'sampling theorem|nyquist|aliasing',
'filters':r'\bfilter design|fir\b|iir\b','neural network':r'neural network|perceptron|multilayer','backprop':r'backprop','deep learning':r'deep learning',
'cnn':r'convolutional (neural )?net|\bcnns?\b','rnn':r'recurrent|\brnns?\b|lstm','transformer':r'transformer|attention mechanism|self-attention',
'reinforcement':r'reinforcement learning|\bmdps?\b|q-learning|policy gradient','graphical models':r'graphical model|bayesian network','variational':r'variational',
'regression':r'regression','classification':r'classif','generative':r'generative|diffusion model|\bgans?\b|\bvae','llm':r'\bllms?\b|language model',
'maxwell':r"maxwell",'electromagnetics':r'electromagnet','circuits':r'circuit analysis|kirchhoff|\brlc\b','transistor':r'transistor|mosfet|\bbjt\b',
'op-amp':r'op[- ]amp|operational amplifier','semiconductor':r'semiconductor|p-n junction|pn junction','quantum':r'quantum|schr[oö]dinger',
'thermodynamics':r'thermodynamic|entropy production','heat transfer':r'heat transfer|conduction|convection','fluid':r'fluid|navier|bernoulli',
'algorithms':r'algorithm|complexity|big-o','graphs':r'graph theory|shortest path','data structures':r'data structure|hash table|\bheap\b',
'numerical methods':r'numerical|finite difference|finite element','digital logic':r'digital logic|boolean|flip-flop','computer architecture':r'computer architecture|pipelin|cache',
'operating systems':r'operating system','communication':r'modulation|channel capacity','antennas':r'antenna','rf':r'\brf\b|microwave|transmission line',
'gpu':r'\bgpu|cuda','fpga':r'fpga|\bhdl\b|verilog|vhdl','dynamics':r'rigid body|lagrang','vibrations':r'vibration|oscillat','stress':r'stress|strain',
'systems engineering':r'systems engineering|requirements','estimation':r'estimation','python':r'python|numpy','robotics':r'kinematic|robot',
}
def text_use(m):
  t=[m['en']]+[i.get('n','')+' '+i.get('teach','') for i in m.get('items',[])]
  return ' '.join(t).lower()
# home of a concept: first module whose English title names it
home={}
for c,rx in CONCEPTS.items():
  hits=[m for m in ms if re.search(rx,m['en'].lower())]
  if hits: home[c]=hits
out=[]
for m in ms:
  u=text_use(m)
  for c,rx in CONCEPTS.items():
    if c not in home: continue
    first=home[c][0]
    if pos[first['id']]<=pos[m['id']]: continue
    hit=re.search(rx,u)
    if not hit: continue
    # where in this module's items
    which=[i['n'] for i in m.get('items',[]) if re.search(rx,(i.get('n','')+' '+i.get('teach','')).lower())]
    out.append((pos[m['id']],m['id'],m['part'],m['en'][:55],c,first['id'],first['part'],pos[first['id']]-pos[m['id']],which[:2]))
for o in out: print(f"{o[0]:3d} {o[1]:7s} {o[2]:4s} {o[3]:55s} | uses '{o[4]}' -> taught in {o[5]} ({o[6]}), {o[7]} modules later | {'; '.join(x[:70] for x in o[8])}")
print(len(out),'flags to read;',len(late),'prerequisite violations')
sys.exit(1 if late else 0)
