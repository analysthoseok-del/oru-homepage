import subprocess, sys, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
S, A, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
W, H, FPS, DUR = 1080, 1920, 30, 31.4
F = f"{S}/fonts"
fL = lambda n: ImageFont.truetype(f"{F}/Pretendard-Light.otf", n)
fR = lambda n: ImageFont.truetype(f"{F}/Pretendard-Regular.otf", n)
f_card, f_small, f_sub, f_step, f_stepname = fL(70), fL(48), fR(46), fL(40), fL(64)
INK, INK2, GOLD = (74,63,53), (130,112,95), (255,238,205)

lake = Image.open(f"{A}/lake-meditation-dawn.jpg").convert("RGB")
faces = {k: Image.open(f"{A}/muse-face-{k}.jpg").convert("RGB") for k in ("front","34","profile")}
FACE_CY = {"front":540, "34":560, "profile":600}

# --- background: warm linen with grain
g = np.linspace(0,1,H)[:,None]
top, bot = np.array([241,234,224]), np.array([226,214,198])
bg = (top*(1-g) + bot*g)[:,None,:].repeat(W,1)
rng = np.random.default_rng(3); bg = bg + rng.normal(0,3.2,(H,W,1))
BG = Image.fromarray(np.clip(bg,0,255).astype("uint8"))

# --- arch window
AW, AH, AX, AY = 760, 900, (W-760)//2, 380
mask = Image.new("L",(AW,AH),0); md = ImageDraw.Draw(mask)
md.rectangle([0,AW//2,AW,AH],fill=255); md.ellipse([0,0,AW,AW],fill=255)
frame = Image.new("RGBA",(W,H),(0,0,0,0)); fd = ImageDraw.Draw(frame)
o=16; fd.arc([AX-o,AY-o,AX+AW+o,AY+AW+o],180,360,fill=(176,150,120,200),width=2)
fd.line([AX-o,AY+AW//2,AX-o,AY+AH+o],fill=(176,150,120,200),width=2)
fd.line([AX+AW+o,AY+AW//2,AX+AW+o,AY+AH+o],fill=(176,150,120,200),width=2)
fd.line([AX-o,AY+AH+o,AX+AW+o,AY+AH+o],fill=(176,150,120,200),width=2)

def face_canvas(k):
    im = faces[k]; w,h = im.size; s = AW/w
    win = AH/s; topy = min(max(FACE_CY[k]-win/2,0), max(h-win,0))
    c = Image.new("RGB",(AW,AH),(44,44,46))
    part = im.crop((0,int(topy),w,int(min(h,topy+win)))).resize((AW,int(min(h-topy,win)*s)),Image.LANCZOS)
    c.paste(part,(0,0))
    return c, (lambda x,y: ((x)*s, (y-topy)*s))
FC = {k: face_canvas(k) for k in faces}

def spline(pts, n=60):
    P=[pts[0]]+pts+[pts[-1]]; out=[]
    for i in range(1,len(P)-2):
        p0,p1,p2,p3=[np.array(P[j],float) for j in (i-1,i,i+1,i+2)]
        for t in np.linspace(0,1,n,endpoint=False):
            out.append(0.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t*t+(-p0+3*p1-3*p2+p3)*t**3))
    out.append(np.array(pts[-1],float)); return out

PATHS = {
 "forehead": ("front",[[(300,330),(215,348),(132,410)],[(300,330),(385,348),(472,410)]]),
 "eyes":     ("front",[[(255,442),(195,436),(140,456)],[(348,442),(410,436),(468,456)]]),
 "cheek":    ("34",   [[(255,592),(190,566),(132,540)],[(372,588),(440,566),(505,578)]]),
 "jaw":      ("profile",[[(285,792),(352,735),(405,642)]]),
 "neck":     ("profile",[[(405,650),(420,745),(442,840)]]),
}
CHEEKS = [(180,620),(425,620)]

def draw_strokes(c, k, names, prog, faint=False):
    _, mp = FC[k]
    lay = Image.new("RGBA",(AW,AH),(0,0,0,0)); d = ImageDraw.Draw(lay)
    for nm in names:
        for path in PATHS[nm][1]:
            pts = [mp(*p) for p in spline(path)]
            if faint:
                d.line([tuple(p) for p in pts],fill=GOLD+(150,),width=4,joint="curve"); continue
            n=len(pts); head=int(prog*(n-1)); tail=max(0,int((prog-0.45)*(n-1)))
            seg=[tuple(p) for p in pts[tail:head+1]]
            if len(seg)>1: d.line(seg,fill=GOLD+(235,),width=7,joint="curve")
            x,y=pts[head]; d.ellipse([x-11,y-11,x+11,y+11],fill=GOLD+(255,))
    glow = lay.filter(ImageFilter.GaussianBlur(9))
    out = Image.alpha_composite(c.convert("RGBA"), glow)
    out = Image.alpha_composite(out, glow)
    return Image.alpha_composite(out, lay)

def draw_cheeks(c, a):
    _, mp = FC["front"]
    lay = Image.new("RGBA",(AW,AH),(0,0,0,0)); d = ImageDraw.Draw(lay)
    for p in CHEEKS:
        x,y = mp(*p); r = 70+40*a
        d.ellipse([x-r,y-r,x+r,y+r],fill=(255,214,170,int(120*a)))
    lay = lay.filter(ImageFilter.GaussianBlur(28))
    return Image.alpha_composite(c.convert("RGBA"), lay)

def arch_scene(k, t0, t1, t, fx):
    c,_ = FC[k]; k01 = (t-t0)/(t1-t0)
    c = fx(c, t-t0, k01)
    z = 1.0 + 0.035*k01
    zw, zh = int(AW*z), int(AH*z)
    c = c.convert("RGB").resize((zw,zh),Image.BICUBIC).crop(((zw-AW)//2,(zh-AH)//2,(zw-AW)//2+AW,(zh-AH)//2+AH))
    im = BG.copy(); im.paste(c,(AX,AY),mask)
    return Image.alpha_composite(im.convert("RGBA"), frame).convert("RGB")

def ease(x): return 0.5-0.5*math.cos(math.pi*max(0,min(1,x)))
def lake_scene(t0,t1,t,a,b):
    k=ease((t-t0)/(t1-t0)); cx,cy,h=[a[i]+(b[i]-a[i])*k for i in range(3)]
    w=h*9/16; return lake.resize((W,H),Image.LANCZOS,box=(cx-w/2,cy-h/2,cx+w/2,cy+h/2))

def strokes(names, period=1.35):
    def fx(c, dt, k): return draw_strokes(c, PATHS[names[0]][0], names, (dt % period)/period*1.15 if (dt%period)/period<0.87 else 1.0)
    return fx
def warmth(c, dt, k): return draw_cheeks(c, ease(dt/2.5))
def hold(c, dt, k): return draw_cheeks(c, 1.0 - 0.25*math.sin(math.pi*min(1,dt/3.0)))
def recap(c, dt, k): return draw_strokes(c,"front",["forehead","eyes"],0,faint=True)

shots = [
 (0.0, 3.0, lambda t: lake_scene(0,3,t,(800,512,1024),(800,540,940))),
 (3.0, 6.8, lambda t: arch_scene("front",3.0,6.8,t,warmth)),
 (6.8, 9.8, lambda t: arch_scene("front",6.8,9.8,t,hold)),
 (9.8,13.1, lambda t: arch_scene("front",9.8,13.1,t,strokes(["forehead"]))),
 (13.1,16.7,lambda t: arch_scene("front",13.1,16.7,t,strokes(["eyes"],1.6))),
 (16.7,19.4,lambda t: arch_scene("34",16.7,19.4,t,strokes(["cheek"]))),
 (19.4,22.1,lambda t: arch_scene("profile",19.4,22.1,t,strokes(["jaw"]))),
 (22.1,25.0,lambda t: arch_scene("profile",22.1,25.0,t,strokes(["neck"]))),
 (25.0,28.3,lambda t: arch_scene("front",25.0,28.3,t,recap)),
 (28.3,31.4,lambda t: lake_scene(28.3,31.4,t,(800,530,960),(800,512,1024))),
]
LAKE = lambda t: t<3.0 or t>=28.3
steps = [(3.0,9.8,"01","온기"),(9.8,13.1,"02","이마"),(13.1,16.7,"03","눈가"),(16.7,19.4,"04","광대"),(19.4,22.1,"05","턱선"),(22.1,25.0,"06","목")]
cards = [(0.0,3.0,"손끝에서 피어나는 아침",f_card,640,"w"),(0.0,3.0,"6동작 · 3분",f_small,750,"w"),
         (6.8,9.8,"감싸고, 숨 한 번",f_small,1300,"i"),(25.0,28.3,"동작마다 세 번",f_stepname,250,"i"),
         (28.3,31.4,"내일 아침도",f_card,680,"w"),(29.8,31.4,"저장해 두세요",f_small,790,"w")]
subs = [(0.0,3.0,"문지르지 말고, 감싸 주세요."),(3.0,6.8,"손바닥을 비벼, 온기를 만들고."),
        (9.8,13.1,"이마는 가운데서 바깥으로."),(13.1,16.7,"눈가는 약지로, 아주 가볍게."),
        (16.7,19.4,"광대를 따라 귀 앞까지."),(19.4,22.1,"턱선을 따라 귀 밑으로."),
        (22.1,25.0,"목을 타고 쇄골까지."),(25.0,28.3,"동작마다 세 번, 숨과 함께."),(28.3,31.4,"내일 아침도, 감싸 주세요.")]
CX=520
def alpha(t,s,e,fade=0.3):
    if t<s or t>=e: return 0
    a = 1 if s==0 else min(1,(t-s)/fade)
    return max(0,min(a,(e-t)/fade if e<DUR-0.01 else 1))
def text_layer(t):
    L = Image.new("RGBA",(W,H),(0,0,0,0)); d = ImageDraw.Draw(L)
    lake = LAKE(t); white=[]; ink=[]
    def put(a,txt,f,y,col,cx=CX):
        w=d.textlength(txt,font=f); (white if col=="w" else ink).append((a,txt,f,cx-w/2,y))
    for s,e,txt,f,y,col in cards: put(alpha(t,s,e),txt,f,y,col)
    for s,e,num,name in steps:
        a=alpha(t,s,e)
        if a: put(a,num,f_step,236,"i"); put(a,name,f_stepname,286,"i")
    for s,e,txt in subs:
        a=alpha(t,s,e,0.2)
        if a: put(a,txt,f_sub,1340 if lake else 1352,"w" if lake else "i")
    for a,txt,f,x,y in white: d.text((x,y),txt,font=f,fill=(255,255,255,int(255*a)))
    sh = Image.new("RGBA",(W,H),(0,0,0,0))
    sh.putalpha(L.getchannel("A").filter(ImageFilter.GaussianBlur(12)).point(lambda v:int(v*0.9)))
    out = Image.alpha_composite(sh, L); d2 = ImageDraw.Draw(out)
    for a,txt,f,x,y in ink:
        col = INK2 if f is f_step else INK
        d2.text((x,y),txt,font=f,fill=col+(int(255*a),))
    return out

_g = np.zeros((H,),dtype=np.float32)
for y0,y1,a in ((560,900,0.30),(1260,1440,0.28)):
    for y in range(y0,y1): _g[y]=max(_g[y],a*math.sin(math.pi*(y-y0)/(y1-y0)))
SCRIM = Image.fromarray((np.tile(_g[:,None],(1,W))*255).astype("uint8")); BLACK = Image.new("RGB",(W,H),(0,0,0))

chimes = [9.8,13.1,16.7,19.4,22.1]
bowl = "0.22*(sin(2*PI*196*t)+0.55*sin(2*PI*529*t)+0.3*sin(2*PI*1013*t)+0.15*sin(2*PI*1720*t))*exp(-t/3.6)*min(1\\,t*60)"
chime = "0.07*(sin(2*PI*1318*t)+0.4*sin(2*PI*2637*t))*exp(-t/0.9)*min(1\\,t*80)"
ins = ["-f","lavfi","-t",str(DUR),"-i","anoisesrc=color=brown:amplitude=0.06:sample_rate=48000,lowpass=f=700,volume=0.9",
       "-f","lavfi","-t","13","-i",f"aevalsrc={bowl}:s=48000"]
fc = "[2:a]adelay=3000|3000[b];"
for i,c in enumerate(chimes):
    ins += ["-f","lavfi","-t","3","-i",f"aevalsrc={chime}:s=48000"]
    fc += f"[{3+i}:a]adelay={int(c*1000)}|{int(c*1000)}[c{i}];"
fc += "[1:a][b]"+"".join(f"[c{i}]" for i in range(len(chimes)))+f"amix=inputs={2+len(chimes)}:normalize=0,afade=t=in:d=0.3,afade=t=out:st={DUR-0.6}:d=0.6[a]"
ff = subprocess.Popen(["ffmpeg","-y","-loglevel","error","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(FPS),"-i","-"]+ins+
    ["-filter_complex",fc,"-map","0:v","-map","[a]","-c:v","libx264","-preset","medium","-crf","19","-pix_fmt","yuv420p",
     "-c:a","aac","-b:a","160k","-t",str(DUR),"-movflags","+faststart",OUT], stdin=subprocess.PIPE)
XF=0.4; SAMPLES={int(x*FPS) for x in (1.5,5.0,8.0,11.0,14.6,18.0,20.6,23.4,26.5,30.5)}
for i in range(int(DUR*FPS)):
    t=i/FPS
    cur=[sh for sh in shots if sh[0]<=t<sh[1]] or [shots[-1]]
    im=cur[0][2](t)
    prv=[sh for sh in shots if sh[1]<=t and t-sh[1]<XF/2]
    nxt=[sh for sh in shots if sh[0]>t and sh[0]-t<XF/2]
    if prv: im=Image.blend(prv[0][2](t),im,0.5+(t-prv[0][1])/XF)
    elif nxt: im=Image.blend(im,nxt[0][2](t),0.5-(nxt[0][0]-t)/XF)
    if LAKE(t): im=Image.composite(BLACK,im,SCRIM)
    im=Image.alpha_composite(im.convert("RGBA"),text_layer(t)).convert("RGB")
    if i in SAMPLES: im.save(f"{S}/render/g_{i:03d}.jpg",quality=85)
    ff.stdin.write(im.tobytes())
ff.stdin.close(); sys.exit(ff.wait())
