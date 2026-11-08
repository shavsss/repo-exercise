"""Every number stated in the new-design answers of C_experiment.md."""
from math import *
from fractions import Fraction as F
p=print
# R2: 0.95^5, identification width
p("0.95^5 =", round(0.95**5,3))
for q in (0.95,0.5):
    p0=0.9; p(f"q={q}: [{q*p0:.3f}, {1-p0*(1-q):.3f}] width {1-p0:.2f}")
# R2: n_eff with rho=0.3
for n in (10,100): p("n_eff", n, round(n/(1+(n-1)*0.3),2))
# R1: (1-1e-9)^1e6 ; rule of three
p("miss prob", (1-1e-9)**1e6, "3/n", 3/1e6)
# R1: Phi^-1(1-1e-9)
from statistics import NormalDist
p("z for 1e-9:", round(NormalDist().inv_cdf(1-1e-9),2))
# R6: Richardson eigenvalues m=n=0.5
import numpy as np
for k in (0.3,0.7):
    A=np.array([[-0.5,k],[k,-0.5]]); ev=np.linalg.eigvals(A); p("k",k,"eig",sorted(ev.round(3)), "growth10", round(exp(max(ev)*10),2))
# R6: Lanchester square: 100 vs 80 concentrated -> sqrt(100^2-80^2)
p("square 100v80:", sqrt(100**2-80**2))
r=sqrt(80**2-50**2); p("50 then 50 vs 80: after first", r, "after second enemy", sqrt(r**2-50**2) if r>50 else -sqrt(50**2-r**2))
# R7: hill example
f=lambda x,y: exp(-((x-0.6)**2+(y-0.3)**2))
th=atan2(0.3,0.6); x,y=cos(th),sin(th)
fx=-2*(x-0.6)*f(x,y); fy=-2*(y-0.3)*f(x,y); lam=fx/(2*x)
p("R7 x*", round(x,4), round(y,4), "f*", round(f(x,y),4), "lambda", round(lam,4), "check", round(fy/(2*y),4))
# R8: Oberth
v=7.67; dv=1; p("dE leo", v*dv+dv**2/2, "rest", 0.5, "ratio", round((v*dv+dv**2/2)/0.5,1))
ve=sqrt(2)*v; p("v_esc", round(ve,2), "vinf perigee", round(sqrt((v+4)**2-ve**2),2), "need", round(ve-v,2), "left", round(4-(ve-v),2))
# dive 100 m
g=9.81; vb=sqrt(2*g*100); p("dive v", round(vb,1), "after +10 back up", round(sqrt((vb+10)**2-2*g*100),1))
# log odds
db=lambda x:10*log10(x)
pri=db(1/99); s=db(5); post=pri+3*s; o=10**(post/10); p("prior dB",round(pri,2),"sign",round(s,2),"post",round(post,2),"P",round(o/(1+o),3))
one=pri+s; o1=10**(one/10); p("one source: P", round(o1/(1+o1),3))
# relative sensitivity tank: 2/3
# --- lesson_1 questions ---
p("N3: exact bound factor at p/q=17/12:", 1/(17/12+sqrt(2)), "vs 1/(2sqrt2)", 1/(2*sqrt(2)))
for (pp,qq) in ((3,2),(17,12),(99,70),(577,408)):
    err=abs(pp/qq-sqrt(2)); b=1/(qq**2*(pp/qq+sqrt(2))); p(f"{pp}/{qq}: err {err:.6g} bound {b:.6g} approx {1/(2*sqrt(2)*qq**2):.6g}")
# N2 trace: 2cos theta integer
for d in (1,2,3,4,5,6,8): p("order",d,"2cos=",round(2*cos(2*pi/d),3))
# N5: 0.1 in 24-bit register chopped vs rounded
scale=2**24  # Patriot: 24-bit register, 0.1 chopped after 23 bits past the binary point? use GAO number
chop=floor(0.1*2**23)/2**23; rnd=round(0.1*2**23)/2**23
p("chop err", 0.1-chop, "round err", 0.1-rnd)
ticks=100*3600*10
p("100h chop", ticks*(0.1-chop), "round", ticks*(0.1-rnd))
p("1-s difference error", 10*(0.1-chop), "*1676 m/s =", 10*(0.1-chop)*1676)
p("0.3433 s * 1676 =", 0.3433*1676)
# N7: 0.1 binary repeating; 1/7
p("1/7", F(1,7), 1/7)
# N8: 0.(142857) geometric
x=F(142857,999999); p("0.(142857) =", x)
# N6 bisection: steps to 1e-9 from [1,2]
p("bisection steps to 1e-9:", ceil(log2(1/1e-9)))
# N7: 10/7
pp,qq=10,7; err=abs(pp/qq-sqrt(2)); b=1/(qq**2*(pp/qq+sqrt(2))); p("10/7 err",round(err,6),"bound",round(b,7),"ratio",round(err/b,3), "p2-2q2", pp**2-2*qq**2)
p("3/2 approx/exact", round(0.0883883/0.0857864,4))
p("rounded drift m", round(0.0858307*1676))
p("kent odds ratio", (0.8/0.2)/(0.2/0.8))
