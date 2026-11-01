# #2 Ritual Reel: 3분 아침 얼굴 리추얼 (draft)

Hook: #2 Negative Command. English stand-in "Stop rubbing your face. Six slow
moves, three minutes." scored 84.4 STRONG (beat "Wake your face up with your
fingertips" 37.8 WEAK). Korean softened to fit voice.md (제안형).
Length: ~32s at ~3.8 syllables/s. VO: warm low male, 해요체.
Movement reference: user-supplied YouTube video (not viewable from the cloud
session; sequence below is a standard morning facial massage, check it against
the reference).

## Preview version (guide style, rendered)

`render/reel02.py` renders a 31.4s preview without hand footage: dawn-lake hook and
ending (same look as #1), muse face in an arch frame on warm linen, gold light
strokes tracing each move, step labels 01–06, a chime at each step. Swap in the
generated hand-massage clips later with the same timeline.

## Voiceover
```
문지르지 말고, 감싸 주세요.
손바닥을 비벼, 온기를 만들고.
        (3초: 두 손으로 얼굴을 감싸고 숨 한 번)
이마는 가운데서 바깥으로.
눈가는 약지로, 아주 가볍게.
광대를 따라 귀 앞까지.
턱선을 따라 귀 밑으로.
목을 타고 쇄골까지.
동작마다 세 번, 숨과 함께.
내일 아침도, 감싸 주세요.
```
Loop: last line echoes "감싸 주세요" from the hook.
Claims: 느낌만 말한다. "붓기 제거, 리프팅, 탄력, 주름" 금지.

## Shots / on-screen (1080x1920, text inside y 230–1440, right 230px clear)
| time | shot | on-screen card |
|---|---|---|
| 0:00 | 손바닥 두 개가 프레임 안으로 들어와 얼굴을 감싸기 직전 (움직임으로 시작) | 손끝에서 피어나는 아침 / 6동작 · 3분 |
| 0:03 | 손바닥 비비기 클로즈업, 창가 아침 빛 | 01 온기 |
| 0:07 | 두 손으로 얼굴 감싸고 눈 감음, 숨 | (자막만) |
| 0:10 | 손가락으로 이마 중앙 → 관자놀이 | 02 이마 |
| 0:13 | 약지로 눈썹 아래 → 관자놀이, 아주 가볍게 | 03 눈가 |
| 0:17 | 손가락 마디로 코 옆 → 귀 앞, 광대 라인 | 04 광대 |
| 0:19 | 턱 끝 → 귀 밑, 턱선 | 05 턱선 |
| 0:22 | 귀 밑 → 쇄골로 쓸어내림 (어깨 위까지만 프레임) | 06 목 |
| 0:26 | 눈 감고 미소, 창가 빛 | (자막만) |
| 0:29 | 0:00과 같은 구도 (루프) | 내일 아침도 / 저장해 두세요 |

## Image / video generation brief

Character reference: `assets/muse-face-front.jpg`, `assets/muse-face-34.jpg`,
`assets/muse-face-profile.jpg` (cropped from `assets/ai-model-profile.webp`).
Feed all three as the face reference on every shot so the face stays the same.

Workflow: generate each still in the same tool used for the muse, check the
hands (finger count, nails touching skin naturally), then turn each still into a
4–5s clip with image-to-video using the motion line.

Shared prompt (append the shot line):
```
Vertical 9:16 photo, the same East Asian woman as the reference images, dark
hair in a neat high bun with soft face-framing strands, natural dewy skin,
minimal makeup, ivory camisole. Framing from the collarbones up, never below
the chest. Soft early-morning window light, warm beige and ivory linen interior,
a hint of misty lake outside the window. Calm, eyes softly closed or lowered.
Hands relaxed, natural five fingers, light touch on the skin. Editorial
wellness photography, shallow depth of field, film grain, no text, no logo.
```
| shot | still prompt (append) | motion for image-to-video |
|---|---|---|
| 0:00 | both open palms entering the frame from below, about to cup her face, face 3/4 | palms rise slowly and cup the cheeks |
| 0:03 | close-up of her two palms rubbing together in front of her chest, face soft-focus behind | palms rub gently, then pause |
| 0:07 | both palms cupping her cheeks, eyes closed, front view | slow inhale, shoulders rise and settle |
| 0:10 | fingertips of both hands at the center of her forehead, front view | fingertips glide outward to the temples |
| 0:13 | ring fingers resting just under the brow bones, eyes closed, front view | ring fingers glide lightly to the temples |
| 0:17 | knuckles of index fingers beside the nose on the cheekbones, 3/4 view | knuckles glide along the cheekbones to in front of the ears |
| 0:19 | fingers along the jawline from the chin, profile view | fingers glide along the jaw to below the ears |
| 0:22 | flat fingers below the ears on the side of the neck, profile view | fingers sweep down the neck to the collarbone |
| 0:26 | hands resting on her collarbones, eyes closed, gentle smile, front view | a slow breath, a small smile |

## Caption (Job A)
```
내일 아침 거울 앞에서 따라 하려면, 저장해 두세요. 3분이면 되는 6동작 얼굴 마사지예요.

문지르지 말고, 손바닥으로 감싸 주세요.
01 온기 - 손바닥을 비벼 얼굴을 감싸고 숨 한 번
02 이마 - 가운데서 바깥으로
03 눈가 - 약지로, 아주 가볍게
04 광대 - 코 옆에서 귀 앞까지
05 턱선 - 턱 끝에서 귀 밑으로
06 목 - 귀 밑에서 쇄골까지

동작마다 세 번, 숨과 함께. 힘은 빼고 온기만 남겨요.
세안 후 아침 루틴에 끼워 넣기 좋은 셀프 얼굴 마사지예요.

#얼굴마사지 #셀프마사지 #아침루틴
```
Search terms: 얼굴 마사지 (line 1), 셀프 얼굴 마사지, 아침 루틴. No link, no first comment needed.
