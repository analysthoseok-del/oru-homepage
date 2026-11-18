/*
 * 제품 구간의 흰 거품. <canvas data-foam="back|front"> 를 찾아 그린다.
 *  - back : 병 뒤에서 천천히 떠오르는 비눗방울
 *  - front: 병 앞, 바닥에 쌓여 일렁이는 거품 더미 (병이 이 사이에서 올라온다)
 * 화면 밖에서는 멈추고, '동작 줄이기' 설정에서는 정지 화면 한 장만 그린다.
 */
(function () {
  if (window.__oruFoam) return;
  window.__oruFoam = true;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 같은 자리에 같은 거품이 놓이도록 고정된 난수
  function rng(seed) {
    return function () {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
  }

  function bubble(ctx, x, y, r, alpha) {
    var g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.05, x, y, r);
    g.addColorStop(0, "rgba(255,255,255," + 0.55 * alpha + ")");
    g.addColorStop(0.55, "rgba(255,255,255," + 0.12 * alpha + ")");
    g.addColorStop(0.86, "rgba(255,255,255," + 0.3 * alpha + ")");
    g.addColorStop(1, "rgba(255,255,255," + 0.85 * alpha + ")");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255," + 0.9 * alpha + ")";
    ctx.beginPath();
    ctx.ellipse(x - r * 0.38, y - r * 0.42, r * 0.2, r * 0.11, -0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  function froth(ctx, x, y, r) {
    var g = ctx.createRadialGradient(x - r * 0.25, y - r * 0.35, r * 0.1, x, y, r);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.7, "#fbfafc");
    g.addColorStop(1, "#e7e2ea");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function setup(canvas) {
    var mode = canvas.dataset.foam;
    var ctx = canvas.getContext("2d");
    var random = rng(mode === "front" ? 7 : 3);
    var w = 0, h = 0, items = [], visible = true, frame = 0, start = performance.now();

    function build() {
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * ratio);
      canvas.height = Math.round(h * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      random = rng(mode === "front" ? 7 : 3);
      items = [];
      var i;
      if (mode === "front") {
        // 잔거품이 가운데로 모여 쌓이고 양옆으로 갈수록 낮아지는 더미
        var count = Math.round(w / 2.2);
        for (i = 0; i < count; i++) {
          var gx = (random() + random() + random() + random() - 2) * 0.42; // 가운데로 몰린 분포 (-0.84..0.84)
          var fx = 0.5 + gx;
          var mound = 0.24 * Math.exp(-Math.pow(gx / 0.3, 2));
          var depth = Math.pow(random(), 0.7);
          items.push({
            x: fx * w,
            y: h - depth * mound * h,
            r: 4 + Math.pow(random(), 2.4) * 24 + (1 - depth) * 6,
            p: random() * 6.28,
            s: 0.35 + random() * 0.5,
          });
        }
        items.sort(function (a, b) { return a.y - b.y; });
      } else {
        var n = Math.round(w / 16) + 14;
        for (i = 0; i < n; i++) {
          items.push({
            x: random() * w,
            y: random() * h,
            r: 5 + Math.pow(random(), 2.2) * 34,
            v: 9 + random() * 20,
            p: random() * 6.28,
            a: 0.45 + random() * 0.55,
          });
        }
      }
    }

    function draw(now) {
      frame = 0;
      var t = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      var i, it;
      if (mode === "front") {
        for (i = 0; i < items.length; i++) {
          it = items[i];
          froth(ctx, it.x + Math.sin(t * it.s * 0.6 + it.p) * 2, it.y + Math.sin(t * it.s + it.p) * 3, it.r * (1 + Math.sin(t * it.s * 0.8 + it.p) * 0.04));
        }
        // 더미 바닥을 메우는 부드러운 흰 덩어리 (양옆으로 사라진다)
        var base = ctx.createRadialGradient(w / 2, h, 0, w / 2, h, w * 0.42);
        base.addColorStop(0, "rgba(255,255,255,1)");
        base.addColorStop(0.55, "rgba(255,255,255,0.85)");
        base.addColorStop(1, "rgba(255,255,255,0)");
        ctx.save();
        ctx.translate(0, h);
        ctx.scale(1, 0.16);
        ctx.translate(0, -h);
        ctx.fillStyle = base;
        ctx.fillRect(0, h - w, w, w);
        ctx.restore();
      } else {
        for (i = 0; i < items.length; i++) {
          it = items[i];
          var y = h - ((h - it.y + t * it.v) % (h + 80)) + 40;
          var fade = Math.min(1, (h - y) / (h * 0.18), y / (h * 0.25));
          if (fade <= 0) continue;
          bubble(ctx, it.x + Math.sin(t * 0.5 + it.p) * 14, y, it.r, it.a * fade);
        }
      }
      if (!reduced && visible) frame = requestAnimationFrame(draw);
    }

    build();
    draw(start);
    window.addEventListener("resize", function () {
      build();
      if (!frame) draw(performance.now());
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible && !frame && !reduced) frame = requestAnimationFrame(draw);
      }).observe(canvas);
    }
  }

  function init() {
    document.querySelectorAll("canvas[data-foam]").forEach(function (canvas) {
      if (canvas.dataset.foamReady) return;
      canvas.dataset.foamReady = "1";
      setup(canvas);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
