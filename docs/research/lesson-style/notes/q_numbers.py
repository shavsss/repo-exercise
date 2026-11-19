from math import *
h=6.62607015e-34; hb=h/2/pi; me=9.1093837e-31; e=1.602176634e-19; c=2.99792458e8
k=8.9875517923e9; ke2=k*e*e; mp=1.67262192e-27; mC=12*1.66053907e-27
eV=e; A=1e-10
a0=hb**2/(me*ke2); print('a0 A',a0/A)
E0=ke2/(2*a0)/eV; print('E0 eV',E0)
print('ke2 eV A',ke2/eV/A, 'hb2/2m eV A2',hb**2/(2*me)/eV/A**2)
re=ke2/(me*c*c); t=a0**3/(4*re**2*c); print('re m',re,'collapse s',t)
# revolutions: integrate dN = dt/T, T=2pi r/v, v=sqrt(ke2/(m r))
import numpy as np
r=np.linspace(a0,1e-15,2000001); 
drdt=-(4/3)*ke2**2/(me**2*c**3*r**2)
T=2*pi*r/np.sqrt(ke2/(me*r)); dN=np.abs(np.gradient(r))/np.abs(drdt)/T
print('revs',dN.sum())
v0=sqrt(ke2/(me*a0)); print('v0/c',v0/c,'alpha',ke2/(hb*c),1/(ke2/(hb*c)))
P=(2/3)*ke2*(v0**2/a0)**2/c**3; print('Larmor P at a0 W',P,'eV/s',P/eV, 'orbit period s',2*pi*a0/v0, 'energy lost per orbit eV',P*2*pi*a0/v0/eV)
print('dust dv',hb/(2*1e-15*1e-6),'per year um',hb/(2*1e-15*1e-6)*3.156e7*1e6)
print('e in 1A dv',hb/(2*me*1e-10))
print('factor1/2: a',a0/4/A,'E',4*E0)
print('h instead: a',4*pi**2*a0/A,'E',E0/(4*pi**2), 'ratio to kT', E0/(4*pi**2)/0.025852)
mu=me*mp/(me+mp); print('reduced E',E0*mu/me)
def lam(V,rel=True):
    E=e*V; p=sqrt(2*me*E*(1+(E/(2*me*c*c) if rel else 0))); return h/p
for V in [10e3,100e3,200e3,300e3,60e3,80e3]:
    g=1+e*V/(me*c*c); b=sqrt(1-1/g**2)
    print(V/1e3,'kV lam nonrel pm',lam(V,False)*1e12,'rel',lam(V)*1e12,'v/c',b, 'diff%',(lam(V,False)/lam(V)-1)*100)
print('V for lam=a0',(h/a0)**2/(2*me)/eV)
print('E for loc e 0.5A eV',hb**2/(2*me*(0.5e-10)**2)/eV,'C meV',hb**2/(2*mC*(0.5e-10)**2)/eV*1e3,'mass ratio',mC/me)
for Ek in [60e3,80e3,86e3,100e3,300e3]:
    E=Ek*eV; Emax=2*E*(E+2*me*c*c)/(mC*c*c); print('Emax to C at',Ek/1e3,'keV:',Emax/eV,'eV')
print('photon at 12.26pm keV',h*c/lam(10e3)/eV/1e3)
print('proton in 1fm MeV',hb**2/(2*mp*1e-30)/eV/1e6)
print('Abbe 550nm NA1.4 nm',550/(2*1.4), '0.61 lam/NA', 0.61*550/1.4)
print('kT 300',1.380649e-23*300/eV)
print('He+ E',4*E0,'a',a0/2/A)
