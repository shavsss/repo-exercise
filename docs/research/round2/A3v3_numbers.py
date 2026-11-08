"""Checks every number stated in A3v3_log.md and A3v3_lagrange.md (prints claim, computed value, OK/FAIL)."""
from math import *
C=[]
def chk(name, val, claim, tol):
    ok = abs(val-claim) <= tol; C.append(ok); print(f"{'OK ' if ok else 'FAIL'} {name}: computed {val:.6g}, text {claim}")
NL=lambda x:1e7*log(1e7/x)
chk('NL(5e6)',NL(5e6),6931472,1); chk('NL(1e6)',NL(1e6),23025851,1); chk('NL(2e6)',NL(2e6),16094379,1)
chk('NL(1e6)-NL(2e6)',NL(1e6)-NL(2e6),6931472,1); chk('2*NL(5e6)=NL(2.5e6)',NL(2.5e6),2*6931472,1)
chk('NL(x)+NL(y)=NL(xy/1e7) at 3e6,4e6',NL(3e6)+NL(4e6),NL(3e6*4e6/1e7),1e-6)
chk('e',e,2.71828,1e-5); chk('1/ln10',1/log(10),0.4343,5e-5); chk('ln10',log(10),2.3026,5e-5)
chk('log2',log10(2),0.30103,5e-6); chk('err 0.30',(log10(2)-0.30)/log10(2)*100,0.34,0.005)
chk('log8',log10(8),0.903,5e-4); chk('log5',log10(5),0.699,5e-4); chk('log6',log10(6),0.778,5e-4)
chk('3 dB',10*log10(2),3.01,0.005); chk('60 dB',10*log10(1e6),60,0); chk('6.02 dB',20*log10(2),6.02,0.005)
chk('63.0 dB',10*log10(2*10**6),63.0,0.05); chk('chain',20-6+20,34,0)
chk('31.6',10**1.5,31.6,0.05); chk('31.6^2',31.6**2,1000,2.6)
chk('slide rule',log(10)*0.1/250,9.2e-4,5e-6)
for b,cl,pc in [(2,2.885,6.1),(3,2.731,0.46),(10,4.343,60)]:
    chk(f'b/ln b ({b})',b/log(b),cl,5e-4); chk(f'excess base {b} %',(b/log(b)/e-1)*100,pc,0.5 if b==10 else 0.05)
# Lagrange
r=(1/(2*pi))**(1/3); h=2*r
chk('r 1m3',r,0.5419,5e-5); chk('d',2*r,1.084,5e-4); chk('S',6*pi*r*r,5.536,5e-4); chk('lambda',2/r,3.69,5e-3)
chk('2/3 S/V',2/3*6*pi*r*r,3.69,5e-3); chk('2^(2/3)',2**(2/3),1.59,5e-3)
chk('dS/dr',4*pi*r+2*pi*h,13.62,5e-3); chk('dS/dh',2*pi*r,3.405,5e-4); chk('dV/dr',2*pi*r*h,3.69,5e-3); chk('dV/dh',pi*r*r,0.923,5e-4)
chk('grad ratio r',(4*pi*r+2*pi*h)/(2*pi*r*h),3.69,5e-3); chk('grad ratio h',(2*pi*r)/(pi*r*r),3.69,5e-3)
chk('gradS direction (4,1)',(4*pi*r+2*pi*h)/(2*pi*r),4,1e-9)
chk('pi/4',pi/4,0.79,5e-3); chk('scale',(1/0.79)**(1/3),1.08,5e-3); chk('est S',1.5*pi*1.08**2,5.5,0.05); chk('1.5pi',1.5*pi,4.7,0.05); chk('1.08^2',1.08**2,1.17,0.005)
chk('cube excess %',(6/(6*pi*r*r)-1)*100,8,0.5)
rs=(3/(4*pi))**(1/3); Ss=4*pi*rs**2
chk('sphere',Ss,4.836,5e-4); chk('sphere/cyl',Ss/(6*pi*r*r),0.874,5e-4); chk('cyl worse %',((6*pi*r*r)/Ss-1)*100,14,0.5)
f=lambda k:k**(-2/3)*(1+2*k)/3
for k,p in [(1.1,0.10),(1.5,1.75),(2,5.0),(0.5,5.8)]: chk(f'penalty k={k} %',(f(k)-1)*100,p,0.05)
chk('0.5 vs 1.5 ratio',(f(0.5)-1)/(f(1.5)-1),3.3,0.1)
def bis(fn,a,b):
    for _ in range(200):
        m=(a+b)/2
        if (fn(a)>0)==(fn(m)>0): a=m
        else: b=m
    return m
chk('2% low bound',bis(lambda k:f(k)-1.02,0.3,1),0.66,0.005); chk('2% high bound',bis(lambda k:f(k)-1.02,1,3),1.54,0.005)
chk('lower by 1/3 <2%',(f(2/3)-1)*100,1.92,0.01)
L=lambda k:log(f(k)); hh=1e-4
chk("ln f'(1)",(L(1+hh)-L(1-hh))/(2*hh),0,1e-8); chk("ln f''(1)",(L(1+hh)-2*L(1)+L(1-hh))/hh**2,2/9,1e-6)
chk('ln-approx at 2 %',log(2)**2/9*100,5.3,0.05); chk('quad approx at 2 %',1/9*100,11,0.2)
chk('cannon loss %',(1-sin(radians(60)))*100,13,0.5)
g=lambda k,K:k**(-2/3)*(K+2*k)/(K**(-2/3)*3*K)
chk('k=2 at h=d %',(g(1,2)-1)*100,5.8,0.05); chk('k=2 optimum h/d',bis(lambda k:(g(k+1e-6,2)-g(k-1e-6,2)),1.01,3),2,1e-3)
chk('free floor k=1/2 optimum',bis(lambda k:(g(k+1e-6,.5)-g(k-1e-6,.5)),0.2,0.99),0.5,1e-3)
chk('chart k=2 curve at x=2',(2+2*2)*2**(-2/3)/(3*2**(1/3)),1,1e-9)
rc=(355e3/(2*pi))**(1/3); chk('can opt d mm',2*rc,76.7,0.05)
hc=355e3/(pi*33.1**2); chk('can body h mm',hc,103,0.2); chk('can body h/d',hc/66.2,1.56,0.005)
chk('can vs k=1 opt %',(f(hc/66.2)-1)*100,2.1,0.05); chk('can vs k=2 opt %',(g(hc/66.2,2)-1)*100,0.7,0.05)
chk('can outer h/d',122/66,1.85,0.005)
# storage tank: integral and optimum
R,H,rho,gg,sig=3.0,12.0,1000,9.81,160e6; N=200000
wall=sum(2*pi*R*rho*gg*((i+.5)*H/N)*R/sig*(H/N) for i in range(N)); chk('wall integral',wall,pi*R*R*rho*gg*H*H/sig,1e-9)
t=0.006; V=500.0
steel=lambda h:V*(2*t/h+rho*gg*h/sig); hopt=bis(lambda h:(steel(h+1e-6)-steel(h-1e-6)),1,60)
chk('h_opt numeric = formula',hopt,sqrt(2*t*sig/(rho*gg)),1e-3)
chk('h_opt water',sqrt(2*t*sig/(1000*9.81)),13.99,0.005); chk('h_opt oil 850',sqrt(2*t*sig/(850*9.81)),15.17,0.005)
chk('oil/water = sqrt(1000/850)',15.17/13.99,sqrt(1000/850),0.002)
print(f"\n{sum(C)}/{len(C)} checks OK")
