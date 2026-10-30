import math, numpy as np, random
from fractions import Fraction as F
r2=math.sqrt(2)
from decimal import Decimal, getcontext
getcontext().prec=50
S=Decimal(2).sqrt()
# min q with |p/q - sqrt2|<1e-9
best=None
for q in range(1,40000):
    p=round(q*r2)
    e=abs(Decimal(p)/Decimal(q)-S)
    if e<Decimal("1e-9"):
        best=(p,q,e);break
print("first q",best)
# digits of sqrt2
print(S)
# measuring procedure n0 n1 n2 for diagonal/side
x=S; digs=[]
n0=int(x); r=x-n0; digs.append(n0)
for k in range(6):
    r*=10; d=int(r); digs.append(d); r-=d
print("digits",digs)
# Patriot
# 0.1 in 24-bit register: Patriot stored chopped 0.1 with 23 fractional bits (GAO: 0.000000095 error)
chop=math.floor(0.1*2**23)/2**23
print("chop",chop,0.1-chop)
err=0.1-chop
for h in [1,8,20,48,72,100]:
    ticks=h*3600*10; e=ticks*err; print("hrs",h,ticks,e,e*1676)
print("per second",10*err,10*err*1676*1000,"mm")
print("687/0.3433",687/0.3433, 0.3433*1676)
# binary of 0.1
b=F(1,10); s=""
for i in range(30):
    b*=2; s+=str(int(b>=1)); b-= int(b>=1)
print("0.1 bin 0.",s)
# bits per decimal digit
print("log2 10",math.log2(10), 24*math.log10(2), 23*math.log10(2))
# float32 stall
f=np.float32
print(f(2**21)+f(0.1)==f(2**21), f(2**21-1)+f(0.1), np.spacing(f(2**20)), np.spacing(f(2**21)))
print("2^21 s days",2**21/86400, "2^20",2**20/86400)
# simulate float32 counter adding 0.1 per 0.1 s: actual vs true at a few times (fast: simulate in blocks)
c=f(0.0); step=f(0.1); n=0
checkpoints={36000:None,360000:None,3600000:None}
# simulate 2.2e7 steps with numpy in python loop is slow; do it only up to 3.6e6 via loop
import time
t=time.time()
for i in range(1,3600001):
    c=c+step
    if i in checkpoints: checkpoints[i]=float(c)
print(checkpoints, time.time()-t)
# fixed 24 bit tenths range
print("2^24 ticks*0.1 s days",2**24*0.1/86400)
# truncation vs rounding accumulation: add N random values each truncated to 6 decimals
random.seed(1)
for N in [100,10000,1000000]:
    et=0; er=0
    for i in range(N):
        v=random.random()
        et+= v - math.floor(v*1e6)/1e6
        er+= v - round(v*1e6)/1e6
    print("N",N,"trunc",et,"pred N*0.5e-6",N*0.5e-6,"round",er,"sqrtN*eps/sqrt12",math.sqrt(N)*1e-6/math.sqrt(12))
# Vancouver
print("vancouver", 1098.892-524.811, (1098.892-524.811)/(22*21.7))
# carry: 0.333.. + 0.666..
for k in range(1,6):
    a=math.floor(10**k/3)/10**k; bb=math.floor(2*10**k/3)/10**k; print(k,a+bb, "interval",a+bb, a+bb+2/10**k)
# multiplication error example a=b=sqrt2*1000? 
a=Decimal(1000)*S; bq=Decimal(1000)*S
k=6
ak=Decimal(math.floor(a*10**k))/10**k
print("mult err", a*bq - ak*ak, (abs(a)+abs(bq))*Decimal(10)**-k)
# Euclid I.1 intersection
print("I.1", 0.5, math.sqrt(3)/2)
# Kn mean free path
k_B=1.380649e-23; d=3.7e-10
def lam(T,p): return k_B*T/(math.sqrt(2)*math.pi*d*d*p)
print("lambda sea",lam(288.15,101325), "100km",lam(195,0.032),"30km",lam(227,1197))
print("Kn 1um", lam(288.15,101325)/1e-6, "Kn 10m",lam(288.15,101325)/10)
n=101325/(k_B*288.15); print("n",n)
for L in [1e-6,1e-7,1e-8]:
    N=n*L**3; print("L",L,"N",N,"1/sqrtN",1/math.sqrt(N))
# electrons
e=1.602176634e-19; print("1nA e/s",1e-9/e, "1A",1/e)
# 1/3 decimal; 1/7 period
print(F(1,7), [int(10**i/7)%10 for i in range(1,13)])
# geometric 72 distance and 60
print(1-2*math.cos(math.radians(72)))
# Earth fraction
