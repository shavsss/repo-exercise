from math import *
h=6.62607015e-34; c=2.99792458e8; e=1.602176634e-19
E0=13.605693; mu=13.598287/E0
dE=E0*(1/4-1/9); print('Balmer a eV',dE,'nm',h*c/(dE*e)*1e9,'reduced nm',h*c/(dE*mu*e)*1e9)
dE=E0*(1/4-1/16); print('Hb nm',h*c/(dE*mu*e)*1e9)
# Scherzer-like
for lam,Cs,lab in [(2.508e-12,1e-3,'200kV Cs1mm'),(1.969e-12,1.2e-3,'300kV'),(2.508e-12,1e-6,'200kV Cs1um corrected')]:
    a=(0.61*lam/(3*Cs))**0.25; d=Cs*a**3+0.61*lam/a
    print(lab,'alpha mrad',a*1e3,'dmin pm',d*1e12, 'scherzer 0.66',0.66*Cs**0.25*lam**0.75*1e12)
# light microscope
print('Abbe d=lam/2NA 550,NA1.4',550/2.8)
# grating first order: d=lam/NA
# shot noise Rose: N >= (k/C)^2 per pixel
for C in [0.1,0.05,0.02]: print('C',C,'N per pixel',(5/C)**2)
# cryo dose: 20 e/A^2 typical; pixel 1 A^2 -> N=20 -> SNR sqrt20
print('sqrt20',sqrt(20), 'contrast detectable k=5', 5/sqrt(20))
# collision nonrel 4m/M
me=9.1093837e-31; mC=12*1.66053907e-27
print('nonrel Emax 86keV',4*me/mC*86e3, 'exact nonrel', 4*me*mC/(me+mC)**2*86e3)
# heisenberg microscope: green light
