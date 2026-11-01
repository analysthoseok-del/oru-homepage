# plan.md — pre-launch concept feed, first 9 posts

Phase: pre-launch (no brand name, no product, no logo). Source: `voice.md`.
Market assumed Korea (KST) until `voice.md` says otherwise. Hooks are Korean,
so `hookscore.py` cannot score them (it counts Latin-alphabet words only).

## The grid after post 9

The newest post sits top-left. Every row and every column holds one of each
pillar, and no two posts of the same pillar go up back to back.

```
 ┌──────────┬──────────┬──────────┐
 │ #9 RITUAL│ #8 MOOD  │ #7 BOTAN.│   ← week 2
 ├──────────┼──────────┼──────────┤
 │ #6 MOOD  │ #5 BOTAN.│ #4 RITUAL│
 ├──────────┼──────────┼──────────┤
 │ #3 BOTAN.│ #2 RITUAL│ #1 MOOD  │   ← launch day
 └──────────┴──────────┴──────────┘
```

Formats: 6 Reels (reach non-followers), 3 carousels (saves). Colour: keep
alternating cool (moss green, lake silver) and warm (dawn beige, candle) so no
row goes one tone.

## The nine

| # | pillar | format | hook formula | spoken / on-screen hook | angle |
|---|---|---|---|---|---|
| 1 | Mood | Reel ~24s | #2 Negative Command | "10초만, 숨 쉬어요." / 마음부터 피어나는 아름다움 | 새벽 호숫가에서 10초 호흡(4초 들숨, 6초 날숨)을 함께. 싱잉볼 한 번. 끝을 첫 프레임과 맞춰 루프. Script: `drafts/01-mood-reel-10s-breath.md` |
| 2 | Ritual | Reel 25–30s | #10 If This, Then Watch | "아침에 얼굴이 무겁게 느껴진다면, 이 3분." / 무거운 아침, 3분 | 손바닥 비벼 온기 → 이마 → 광대 → 턱선 → 목. 동작마다 숨 한 번 |
| 3 | Botanical | Carousel 6장 | #3 Nobody Tells You | "병풀이 왜 '호랑이 풀'로 불리는지, 아무도 안 알려줘요." / 호랑이 풀의 이야기 | 이름의 유래(전설로 소개) → 원산지 → 대표 성분(마데카소사이드, 아시아티코사이드) → 어떤 피부가 찾는지 → 출처 |
| 4 | Ritual | Reel 20s | #7 Wrong Way, Right Way | "얼굴 마사지, 힘부터 빼세요. 당신 잘못이 아니에요." / 힘 빼는 게 먼저 | 세게 문지르는 손 vs 손바닥 전체로 감싸는 손. 압이 아니라 온기 |
| 5 | Botanical | Carousel 6장 | #14 The Callout | "예민한 피부라면, 이 풀 이름은 기억해 두세요." / 예민한 날의 쑥 | 강화 사자발쑥: 산지, 오래 써 온 방식(쑥뜸·쑥물 세안 문화), 원료 특징. 효능 표현 금지 |
| 6 | Mood | Reel 7–9s | #22 Contrarian Flip | "빨리 가려면 쉬어 가요." / 쉬어야 빨라져요 | 이끼 숲에 빛줄기. 바람·새소리. 시네마그래프처럼 빛만 움직이게 |
| 7 | Botanical | Carousel 6장 | #16 The Verbatim Question | "'녹차는 마시는 거 아니에요?' 바르는 이야기도 있어요." / 녹차, 바르는 이야기 | 제주 녹차: 재배 환경, 카테킨이 풍부한 원료로 알려진 이유, 마시는 녹차와의 차이 |
| 8 | Mood | Reel 10s | #21 Mid-Sentence Start | "…그날 아침, 아무것도 하지 않기로 했어요." / 그날 아침 | 촛불, 리넨, 싱잉볼, 손끝. 브랜드 뮤즈는 뒷모습이나 손만 |
| 9 | Ritual | Reel 30s | #18 Cold Open Demo | (첫 프레임부터 지압 중) "싱잉볼이 울리는 동안만, 따라 해 봐요." / 소리가 끝날 때까지 | 싱잉볼 1회 울림 = 한 동작. 눈썹 → 관자놀이 → 귀 뒤. 캡션 끝에 티저 문장 첫 등장 |

CTA for every post: 저장 or 공유 ("내일 아침에 다시 보려면 저장"). Never 구매, never
"링크 확인".

## Schedule (KST)

```
WEEK 1   (11/2 – 11/8)
MON 11/2  12:30  #1  REEL      MOOD       launch: fill the first row today
          19:00  #2  REEL      RITUAL
          21:30  #3  CAROUSEL  BOTANICAL
TUE       engage only
WED 11/4  21:00  #4  REEL      RITUAL
THU       stories + engage
FRI 11/6  12:30  #5  CAROUSEL  BOTANICAL
SAT       -
SUN 11/8  21:00  #6  REEL      MOOD

WEEK 2   (11/9 – 11/15)
MON       engage only
TUE 11/10 12:30  #7  CAROUSEL  BOTANICAL
THU 11/12 21:00  #8  REEL      MOOD
SAT 11/14 21:00  #9  REEL      RITUAL     teaser line starts

STORIES  daily, 3 frames. Thursday: poll ("아침 루틴 vs 밤 루틴").
         Sunday: question box ("요즘 피부에 제일 필요한 건?") — answers feed
         the next Botanical posts.
```

Why these hours: carousels at lunch get saved to read later; Reels and Mood
at 21:00 meet the wind-down hour this audience already has. The hour matters
far less than the first two seconds of each Reel. Fix hooks before times.

## Engagement round (20 min/day, before posting)

Real accounts not chosen yet. Run `/ig-viral` on 명상, 페이스요가, 클린뷰티
to find them by outlier multiple, then fill this in:

- **5 reach** (wellness, meditation, face-yoga creators with the target audience):
  {{}}
- **3 peers** (indie wellness / clean-beauty brands of similar size):
  {{}}
- **2 buyers** (yoga studios, spas, wellness retreats, select shops):
  {{}}

## Track from day 1

Saves, shares, follows per post, and follower count weekly. Pre-launch saves
and follower growth are demand evidence for a government-grant application.
