import subprocess, sys, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
S, A, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
W, H, FPS, DUR = 1080, 1920, 30, 31.0
lake = Image.open(f"{A}/lake-meditation-dawn.jpg").convert("RGB")
forest = Image.open(f"{A}/forest-moss-light.jpg").convert("RGB")
F = f"{S}/fonts"
f_card = ImageFont.truetype(f"{F}/Pretendard-Light.otf", 70)
f_small = ImageFont.truetype(f"{F}/Pretendard-Light.otf", 50)
f_num = ImageFont.truetype(f"{F}/Pretendard-ExtraLight.otf", 190)
f_sub = ImageFont.truetype(f"{F}/Pretendard-Regular.otf", 46)

# (start, end, image, (cx,cy,h) start, (cx,cy,h) end)
shots = [
 (0.0, 2.5, lake,   (800,512,1024), (800,540,940)),
 (2.5, 5.5, lake,   (735,700,700),  (735,720,620)),
 (5.5,10.9, lake,   (1225,700,640), (1225,330,640)),
 (10.9,15.1,lake,   (190,760,520),  (200,790,440)),
 (15.1,18.1,lake,   (272,815,400),  (272,820,320)),
 (18.1,21.9,forest, (900,500,1000), (900,480,880)),
 (21.9,25.7,forest, (1150,420,760), (1150,400,660)),
 (25.7,31.0,lake,   (800,545,900),  (800,512,1024)),
]
XF = 0.4
def ease(x): return 0.5 - 0.5*math.cos(math.pi*max(0,min(1,x)))
def frame_of(shot, t):
    s,e,img,a,b = shot; k = ease((t-s)/(e-s))
    cx,cy,h = [a[i]+(b[i]-a[i])*k for i in range(3)]
    w = h*9/16
    IW,IH=img.size; h=min(h,IH); w=h*9/16
    cx=min(max(cx,w/2),IW-w/2); cy=min(max(cy,h/2),IH-h/2)
    box = (cx-w/2, cy-h/2, cx+w/2, cy+h/2)
    return img.resize((W,H), Image.LANCZOS, box=box)

cards = [  # (start,end,text,font,y)
 (0.0,2.5,"마음부터 피어나는\n아름다움",f_card,650),
 (2.5,5.5,"내면의 소리에\n집중해보세요",f_card,650),
 (5.5,10.9,"들이쉬고",f_card,620),
 (10.9,18.1,"내쉬고",f_card,620),
 (25.7,31.0,"내일도 1분만",f_card,700),
 (29.6,31.0,"저장해 두세요",f_small,810),
]
nums = [(6.9+i,7.9+i,str(i+1)) for i in range(4)] + [(12.1+i,13.1+i,str(6-i)) for i in range(6)]
subs = [
 (0.0,2.5,"1분, 숨을 쉬어보아요."),
 (5.5,6.9,"들이쉬고."),(10.9,12.1,"내쉬고."),(18.1,21.1,"어깨의 긴장이 이완되고,"),
 (21.1,24.0,"무거웠던 머리가 맑아짐을"),(24.0,25.7,"느껴보세요."),(25.7,31.0,"내일도 1분만,\n내면의 소리를 들어주세요."),
]
CX = 520
import numpy as np
_g = np.zeros((H,),dtype=np.float32)
for y0,y1,a in ((560,1100,0.30),(1260,1440,0.28)):
    for y in range(y0,y1):
        k = (y-y0)/(y1-y0); _g[y] = max(_g[y], a*math.sin(math.pi*k))
SCRIM = Image.fromarray((np.tile(_g[:,None],(1,W))*255).astype('uint8'))
BLACK = Image.new('RGB',(W,H),(0,0,0))  # keep text left of the right 230px action rail
def alpha(t,s,e,fade=0.35,first=False):
    if t<s or t>=e: return 0
    a_in = 1 if (first and s==0) else min(1,(t-s)/fade)
    return max(0,min(a_in,(e-t)/fade if e<DUR-0.01 else 1))
def text_layer(t):
    L = Image.new("RGBA",(W,H),(0,0,0,0)); d = ImageDraw.Draw(L)
    items = []
    for s,e,txt,f,y in cards: items.append((alpha(t,s,e,first=True),txt,f,y))
    for s,e,txt in nums: items.append((alpha(t,s,e,0.25),txt,f_num,860))
    for s,e,txt in subs: items.append((alpha(t,s,e,0.2,first=True),txt,f_sub,1330 if '\n' not in txt else 1300))
    for a,txt,f,y in items:
        if a<=0: continue
        for j,line in enumerate(txt.split("\n")):
            w = d.textlength(line,font=f)
            d.text((CX-w/2,y+j*f.size*1.35),line,font=f,fill=(255,255,255,int(255*a)))
    sh = Image.new("RGBA",(W,H),(0,0,0,0))
    sh.putalpha(L.getchannel("A").filter(ImageFilter.GaussianBlur(12)).point(lambda v:int(v*0.9)))
    return Image.alpha_composite(sh, L)

ff = subprocess.Popen(["ffmpeg","-y","-loglevel","error","-f","rawvideo","-pix_fmt","rgb24",
    "-s",f"{W}x{H}","-r",str(FPS),"-i","-",
    "-f","lavfi","-t",str(DUR),"-i","anoisesrc=color=brown:amplitude=0.06:sample_rate=48000,lowpass=f=700,volume=0.9",
    "-f","lavfi","-t","13","-i","aevalsrc=0.22*(sin(2*PI*196*t)+0.55*sin(2*PI*529*t)+0.3*sin(2*PI*1013*t)+0.15*sin(2*PI*1720*t))*exp(-t/3.6)*min(1\\,t*60):s=48000",
    "-filter_complex","[2:a]adelay=10900|10900[b];[1:a][b]amix=inputs=2:normalize=0,afade=t=in:d=0.3,afade=t=out:st=30.4:d=0.6[a]",
    "-map","0:v","-map","[a]","-c:v","libx264","-preset","medium","-crf","19","-pix_fmt","yuv420p",
    "-c:a","aac","-b:a","160k","-t",str(DUR),"-movflags","+faststart",OUT], stdin=subprocess.PIPE)
n = int(DUR*FPS)
for i in range(n):
    t = i/FPS
    cur = [sh for sh in shots if sh[0]<=t<sh[1]] or [shots[-1]]
    im = frame_of(cur[0],t)
    nxt = [sh for sh in shots if sh[0]>t and sh[0]-t<XF/2]
    prv = [sh for sh in shots if sh[1]<=t and t-sh[1]<XF/2]
    if prv: im = Image.blend(frame_of(prv[0],t), im, 0.5+ (t-prv[0][1])/XF)
    elif nxt: im = Image.blend(im, frame_of(nxt[0],t), 0.5-(nxt[0][0]-t)/XF)
    im = Image.composite(BLACK, im, SCRIM)
    im = Image.alpha_composite(im.convert("RGBA"), text_layer(t)).convert("RGB")
    if i in (0, int(4.0*FPS), int(6.0*FPS), int(9.5*FPS), int(13.5*FPS), int(16.5*FPS), int(19.5*FPS), int(22.5*FPS), int(24.8*FPS), int(27.5*FPS), int(30.5*FPS)):
        im.save(f"{S}/render/f_{i:03d}.jpg", quality=85)
    ff.stdin.write(im.tobytes())
ff.stdin.close(); sys.exit(ff.wait())
