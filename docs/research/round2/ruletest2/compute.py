import math, numpy as np
from fractions import Fraction as F
r2=math.sqrt(2)
print("sqrt2",r2)
# ISO
for name,(w,h) in {"A0":(841,1189),"A4":(210,297),"A5":(148,210)}.items():
    print(name,F(h,w),h/w,(h/w-r2)/r2*100,"%")
# story halving
# Egyptian/Babylonian pi
eg=(16/9)**2; print("eg pi",eg,(eg-math.pi)/math.pi*100); print("bab",3.125,(3.125-math.pi)/math.pi*100)
# Edfu rhombus side 10 angle 60
print("edfu rhombus",100, 100*math.sin(math.radians(60)), (100/ (100*math.sin(math.radians(60)))-1)*100)
# trapezoid example: sides a,c parallel 10 and 6, legs b,d ; Edfu (a+c)/2*(b+d)/2 with legs 5,5 height?
a,c=10,6; leg=5; h=math.sqrt(leg**2-((a-c)/2)**2); true=(a+c)/2*h; edfu=(a+c)/2*leg; print("trap",h,true,edfu,(edfu/true-1)*100)
# crystallographic
for n in range(1,13):
    t=2*math.cos(2*math.pi/n); print(n, round(t,4), abs(1-t))
# Democritus
for n in [10,100,150]:
    s=sum(k*k for k in range(1,n+1))/n**3; print(n,s,1/3+1/(2*n)+1/(6*n*n),(s-1/3)/(1/3))
for n in [5,10]:
    s=sum((k-0.5)**2 for k in range(1,n+1))/n**3; print("mid",n,s,1/3-1/(12*n*n),(s-1/3)/(1/3))
# n for 1% left, midpoint
n=1
while (sum(k*k for k in range(1,n+1))/n**3-1/3)/(1/3)>0.01: n+=1
print("n 1% left",n)
n=1
while abs(sum((k-0.5)**2 for k in range(1,n+1))/n**3-1/3)/(1/3)>0.01: n+=1
print("n 1% mid",n)
for tol in [0.001]:
    n=1
    while (sum(k*k for k in range(1,n+1))/n**3-1/3)/(1/3)>tol: n+=1
    m=1
    while abs(sum((k-0.5)**2 for k in range(1,m+1))/m**3-1/3)/(1/3)>tol: m+=1
    print("0.1%",n,m)
# convergents
p,q=1,1; conv=[(1,1)]
for i in range(12):
    p,q=p+2*q,p+q; conv.append((p,q))
for p,q in conv:
    print(p,q,p/q-r2, p*p-2*q*q, 1/(q*q*(p/q+r2)), 1/(2*r2*q*q))
print("q for 1e-9 bound", math.sqrt(1/(2*r2*1e-9)))
# sphere: isoceles right geodesic triangle legs L on Earth
R=6371
for L in [1,100,1000,5000]:
    x=L/R; cc=math.acos(math.cos(x)**2); print("sphere",L,cc*R, cc*R/L, (cc*R/L-r2)/r2*100)
# YBC
y=1+24/60+51/3600+10/216000; print("ybc",y,y-r2,1/216000)
# mils
for m in [6400,6000,6300]:
    print("mil",m,2*math.pi*1000/m,(2*math.pi*1000/m-1)*100)
print(2*math.pi*1000)
# float checks
print(repr(math.sqrt(2)**2), math.sqrt(2)*math.sqrt(2)==2, repr(0.1+0.2))
