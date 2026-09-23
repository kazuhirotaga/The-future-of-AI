// 模写「月下のランタン」— 参考画像を見ながら、構図と配色を一筆ずつ写し取った練習作。
// 座標は参考画像（1248×1824）のおよそ半分のスケール（624×912）で目測している。
// 線は入り抜きのある細線、陰影はグラデーション・ぼかし・乗算、光はスクリーン合成で重ねる。
(() => {
  const { ellipse, circle, rect, curve, taper, linear, radial, rng } = DrawKit;
  const { strokes: S, add } = DrawKit.canvas();
  const W = 624, H = 912;
  const rand = rng(7);
  const INK = '#4f4760', HAIR_INK = '#8d85a3', SKIN = '#f8f0ee', SKIN_INK = '#c4a9a8', BLACK = '#17151d';

  // よく使う描き方
  const line = (pts, width = 1, color = INK, o = {}) => add(taper(curve(pts), o.head ?? 0.25, o.tail ?? 0.3), { color, width, ...o });
  const shade = (shape, pts, width, color, alpha = 0.35, blur = 4) =>
    add(curve(pts), { color, width, alpha, blur, blend: 'multiply', clip: shape });
  const glow = (x, y, r, color, alpha = 0.6) =>
    add(circle(x, y, r, 40), { fill: radial(x, y, 0, r, color, 'rgba(255,255,255,0)'), width: 0, alpha, blend: 'screen' });
  // 2 本の案内線のあいだに、毛筋や布目などの細線を n 本流す
  const between = (A, B, n, width, color, o = {}) => {
    for (let i = 0; i < n; i++) {
      const t = (i + rand() * 0.8) / n, j = o.jitter ?? 2;
      const pts = A.map((a, k) => [a[0] + (B[k][0] - a[0]) * t + (rand() - 0.5) * j,
                                   a[1] + (B[k][1] - a[1]) * t + (rand() - 0.5) * j]);
      const cut = o.cut ? Math.floor(rand() * o.cut) : 0;
      line(pts.slice(0, pts.length - cut), width * (0.6 + rand() * 0.6), color, { alpha: o.alpha ?? 0.5, clip: o.clip });
    }
  };

  // ── 背景：空と満月 ──
  add(rect(0, 0, W, H), { fill: linear(0, 0, 0, H, '#d5d8e2', '#b9bdcb', '#a9aec0'), width: 0 });
  const opening = [[82, H], [82, 200], ...ellipse(315, 200, 233, 250, Math.PI, Math.PI * 2, 60), [548, H]];
  add(opening, { fill: radial(306, 124, 60, 520, '#4a4f78', '#1f2546', '#0d1124'), width: 0 });
  for (let i = 0; i < 70; i++) {
    const x = 90 + rand() * 450, y = 10 + rand() * 480, r = 0.4 + rand() * 0.9;
    if (Math.hypot(x - 306, y - 124) < 160) continue;
    add(circle(x, y, r, 8), { fill: '#eeeaf7', width: 0, alpha: 0.5 + rand() * 0.5, clip: opening });
  }
  // 月の光輪
  add(circle(306, 124, 230, 60), { fill: radial(306, 124, 120, 230, 'rgba(230,226,245,0.55)', 'rgba(230,226,245,0)'), width: 0, blend: 'screen', clip: opening });
  const moon = circle(306, 124, 136, 90);
  add(moon, { fill: radial(290, 100, 10, 150, '#faf8f2', '#ece8de', '#d9d3c6'), width: 0 });
  // 海（暗い模様）はぼかした乗算を重ねて描く
  for (let i = 0; i < 90; i++) {
    const a = rand() * Math.PI * 2, d = Math.sqrt(rand()) * 118, x = 306 + Math.cos(a) * d, y = 104 + Math.sin(a) * d * 0.8;
    add(ellipse(x, y, 4 + rand() * 12, 3 + rand() * 7, 0, Math.PI * 2, 16),
        { fill: '#c9c1b3', width: 0, alpha: 0.25 + rand() * 0.25, blur: 1 + rand() * 1.5, blend: 'multiply', clip: moon });
  }
  for (let i = 0; i < 40; i++) {
    const a = rand() * Math.PI * 2, d = rand() * 125, x = 306 + Math.cos(a) * d, y = 124 + Math.sin(a) * d;
    add(circle(x, y, 1 + rand() * 4, 12), { color: '#a9a194', width: 0.5, alpha: 0.5, clip: moon });
  }
  add(ellipse(306, 124, 136, 136, 0, Math.PI * 2, 90), { color: '#ffffff', width: 1.5, alpha: 0.8 });
  // 雲
  [[[395, 150], [430, 138], [470, 145], [505, 132], [540, 136]], [[450, 92], [480, 82], [512, 88], [545, 80]],
   [[105, 210], [140, 200], [170, 206]]].forEach(c => {
    add(curve(c), { color: '#252a47', width: 9, alpha: 0.8, blur: 3, clip: opening });
    line(c.map(([x, y]) => [x, y - 4]), 1, '#aab0d0', { alpha: 0.5, clip: opening });
  });

  // ── 森 ──
  const forest = [[82, 480], ...curve([[82, 480], [180, 440], [300, 470], [420, 380], [548, 330]]), [548, 640], [82, 640]];
  add(forest, { fill: linear(0, 330, 0, 640, '#161b33', '#080a15'), width: 0 });
  for (let i = 0; i < 16; i++) {
    const x = 420 + rand() * 128, top = 330 + rand() * 90;
    line([[x, top], [x + (rand() - 0.5) * 8, (top + 620) / 2], [x + (rand() - 0.5) * 10, 620]], 2 + rand() * 3, '#2a3050', { head: 0.4, tail: 0, alpha: 0.9, clip: opening });
    for (let k = 0; k < 3; k++) {
      const y = top + 30 + rand() * 150, dir = rand() < 0.5 ? -1 : 1;
      line([[x, y], [x + dir * 12, y - 10], [x + dir * 22, y - 24]], 1, '#2a3050', { clip: opening });
    }
  }
  // 紫の葉むら：小さな葉を何百枚も、月に近い側ほど明るく
  const leaf = (x, y, r, rot, fill, alpha) => add(ellipse(0, 0, r * 1.7, r * 0.6, 0, Math.PI * 2, 10).map(([u, v]) =>
    [x + u * Math.cos(rot) - v * Math.sin(rot), y + u * Math.sin(rot) + v * Math.cos(rot)]), { fill, width: 0, alpha, clip: opening });
  const foliage = (cx, cy, rx, ry, n) => {
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2, d = Math.sqrt(rand());
      const x = cx + Math.cos(a) * rx * d, y = cy + Math.sin(a) * ry * d;
      const lit = Math.max(0, 1 - Math.hypot(x - 306, y - 124) / 330) + (y < cy ? 0.2 : 0);
      const col = lit > 0.55 ? '#d8c4e4' : lit > 0.35 ? '#a792c2' : lit > 0.2 ? '#7a6899' : '#4a3f68';
      leaf(x, y, 3 + rand() * 4, rand() * Math.PI, col, 0.55 + rand() * 0.4);
    }
  };
  foliage(150, 300, 70, 90, 260);
  foliage(165, 440, 70, 60, 180);
  foliage(480, 180, 70, 80, 240);
  foliage(495, 300, 60, 70, 220);
  foliage(470, 430, 50, 40, 120);

  // ── 地面と石畳 ──
  add([[82, 620], [548, 600], [548, H], [82, H]], { fill: linear(0, 600, 0, H, '#5f6680', '#8f95aa'), width: 0 });
  const path = [[190, 616], [400, 606], [520, H], [100, H]];
  add(path, { fill: linear(0, 606, 0, H, '#a7abbf', '#dcdee7'), width: 0 });
  for (let y = 628; y < H; y += 16 + (y - 620) * 0.12) {
    const t = (y - 606) / (H - 606), x0 = 190 - 90 * t, x1 = 400 + 120 * t;
    line([[x0, y], [(x0 + x1) / 2, y - 2], [x1, y - 3]], 0.8, '#8a8fa6', { alpha: 0.6, clip: path });
    for (let x = x0 + rand() * 20; x < x1; x += 18 + t * 20) line([[x, y], [x + 1, y + 10 + t * 12]], 0.7, '#8a8fa6', { alpha: 0.5, clip: path });
  }

  // ── 柱とアーチ ──
  const arch = r => ellipse(315, 200, r, r * 1.07, Math.PI, Math.PI * 2, 60);
  add(arch(240), { color: linear(0, 0, 0, 200, '#f2f3f7', '#d7d9e2'), width: 16 });
  add(arch(252), { color: '#8e93a8', width: 1.2 });
  add(arch(228), { color: '#9ea3b6', width: 1 });
  add(arch(262), { color: '#b3b7c7', width: 0.8 });
  [[0, 82, 1], [548, 624, -1]].forEach(([x0, x1, side]) => {
    const pillar = rect(x0, 0, x1 - x0, H);
    add(pillar, { fill: linear(x0, 0, x1, 0, side > 0 ? '#c4c8d4' : '#eef0f5', side > 0 ? '#eef0f5' : '#c4c8d4'), width: 0 });
    // 石積みの目地
    for (let y = 150, row = 0; y < 590; y += 26, row++) {
      line([[x0 + 2, y], [x1 - 2, y + 0.5]], 0.8, '#9ba0b3', { alpha: 0.7, head: 0.05, tail: 0.05 });
      for (let x = x0 + (row % 2 ? 14 : 30); x < x1 - 4; x += 34) line([[x, y], [x, y + 26]], 0.7, '#9ba0b3', { alpha: 0.6 });
    }
    // 柱頭と台座：影と光の細線で立体に見せる
    [[112, 34], [588, 26]].forEach(([y, h]) => {
      add(rect(x0, y, x1 - x0, h), { fill: linear(0, y, 0, y + h, '#f7f8fb', '#c9cdd9'), width: 0 });
      [0, 0.3, 0.55, 1].forEach(t => line([[x0, y + h * t], [x1, y + h * t]], 0.8, '#858aa0', { alpha: 0.8, head: 0.02, tail: 0.02 }));
      for (let x = x0 + 8; x < x1; x += 12) line([[x, y + h * 0.58], [x, y + h * 0.95]], 0.6, '#9ba0b3', { alpha: 0.7 });
    });
    add([[side > 0 ? x1 - 6 : x0, 0], [side > 0 ? x1 : x0 + 6, 0], [side > 0 ? x1 : x0 + 6, H], [side > 0 ? x1 - 6 : x0, H]],
        { fill: '#6d7390', width: 0, alpha: 0.25, blur: 3 });
  });

  // ── 桃の茂み ──
  const bush = (cx, cy, peaches) => {
    for (let i = 0; i < 70; i++) {
      const a = rand() * Math.PI * 2, d = Math.sqrt(rand()) * 85;
      const x = cx + Math.cos(a) * d * 0.8, y = cy + Math.sin(a) * d * 1.3, rot = rand() * Math.PI;
      const shape = ellipse(0, 0, 18 + rand() * 8, 7 + rand() * 3, 0, Math.PI * 2, 16).map(([u, v]) =>
        [x + u * Math.cos(rot) - v * Math.sin(rot), y + u * Math.sin(rot) + v * Math.cos(rot)]);
      add(shape, { fill: linear(x, y - 10, x, y + 10, '#8a9a9c', '#4b5a5e'), color: '#2f3a3d', width: 0.6 });
      line([[x - Math.cos(rot) * 15, y - Math.sin(rot) * 15], [x, y], [x + Math.cos(rot) * 15, y + Math.sin(rot) * 15]], 0.6, '#2f3a3d', { alpha: 0.7 });
    }
    peaches.forEach(([x, y]) => {
      add(circle(x, y, 17, 40), { fill: radial(x - 5, y - 6, 2, 22, '#fff1ea', '#f7c2ae', '#e58f7c'), color: '#b8705f', width: 0.8 });
      line([[x + 2, y - 16], [x - 3, y - 2], [x + 1, y + 14]], 0.8, '#c9806c', { alpha: 0.6 });
      add(circle(x - 6, y - 7, 4, 16), { fill: '#fff', width: 0, alpha: 0.6, blur: 2 });
    });
  };
  bush(35, 790, [[30, 720], [70, 790], [35, 850]]);
  bush(600, 760, [[600, 690], [580, 790]]);

  // ── 人物 ──
  // コート（背面、肩から垂れる）
  const coatL = curve([[235, 285], [180, 330], [150, 480], [125, 700], [115, H + 5], [255, H + 5], [250, 640], [245, 420]], true);
  const coatR = curve([[420, 280], [470, 320], [520, 520], [580, 690], [600, H + 5], [480, H + 5], [475, 640], [440, 400]], true);
  [coatL, coatR].forEach((c, k) => {
    add(c, { fill: linear(0, 280, 0, H, '#ece9f2', '#d6d0e2'), width: 0 });
    add(c, { color: INK, width: 1.1 });
    for (let i = 0; i < 4; i++) {
      const x = k ? 470 + i * 25 : 160 + i * 22;
      shade(c, [[x, 350 + i * 40], [x + (k ? 20 : -10), 600], [x + (k ? 30 : -15), H]], 10, '#9f97b6', 0.35, 5);
      line([[x + 4, 420 + i * 40], [x + (k ? 24 : -6), 680], [x + (k ? 32 : -12), H]], 0.7, '#a59dbb', { clip: c, alpha: 0.7 });
    }
  });

  // 後ろ髪
  const backHair = curve([[232, 170], [240, 108], [292, 76], [356, 82], [402, 118], [414, 190], [408, 260], [398, 310],
                          [378, 318], [366, 270], [330, 262], [290, 262], [246, 262]], true);
  add(backHair, { fill: linear(0, 80, 0, 320, '#f3f1f8', '#d9d4e6'), width: 0 });
  between([[300, 82], [250, 115], [236, 180], [246, 262]], [[335, 82], [398, 120], [412, 210], [392, 312]], 60, 0.8, HAIR_INK, { clip: backHair, alpha: 0.45 });
  add(backHair, { color: HAIR_INK, width: 1 });

  // 首（あごの下に影）
  const neck = [[300, 246], [334, 246], [337, 284], [302, 284]];
  add(neck, { fill: '#f1e3e1', width: 0 });
  shade(neck, [[296, 256], [318, 264], [340, 256]], 14, '#c9a9ae', 0.6, 5);

  // ブラウス（胴）
  const blouse = curve([[300, 262], [250, 280], [245, 360], [265, 450], [282, 545], [452, 540], [445, 450], [438, 360],
                        [430, 280], [345, 262]], true);
  add(blouse, { fill: linear(250, 0, 450, 0, '#e7e3ee', '#fbfafc', '#e4dfeb'), width: 0 });
  // 細かいプリーツ（前立ての両側）
  for (let x = 292; x <= 402; x += 7) {
    if (Math.abs(x - 346) < 8) continue;
    line([[x, 300 + Math.abs(x - 346) * 0.15], [x + 1, 420], [x - 1, 525]], 0.6, '#b3aac6', { clip: blouse, alpha: 0.8 });
  }
  line([[340, 272], [342, 400], [340, 538]], 0.8, '#9f97b6', { clip: blouse });
  line([[352, 272], [354, 400], [352, 538]], 0.8, '#9f97b6', { clip: blouse });
  shade(blouse, [[260, 300], [265, 420], [285, 540]], 18, '#aaa2c2', 0.35, 7);
  shade(blouse, [[430, 300], [440, 420], [445, 540]], 16, '#aaa2c2', 0.35, 7);
  shade(blouse, [[270, 470], [360, 500], [445, 470]], 12, '#b6aecb', 0.3, 8);
  shade(blouse, [[280, 540], [360, 530], [450, 535]], 10, '#8f87a8', 0.35, 4);
  for (let y = 300; y <= 520; y += 30) {
    add(circle(346, y, 3.2, 16), { fill: radial(345, y - 1, 0, 4, '#ffffff', '#dcd7e6'), color: '#7d7690', width: 0.6 });
    add(circle(346, y, 0.6, 6), { fill: '#7d7690', width: 0 });
  }
  add(blouse, { color: INK, width: 1 });

  // 右袖（画面右、下ろした腕）と手
  const sleeveR = curve([[425, 282], [455, 330], [480, 460], [530, 590], [585, 660], [545, 680], [500, 672], [470, 560], [440, 440]], true);
  add(sleeveR, { fill: linear(430, 0, 590, 0, '#f6f4f8', '#dcd6e6'), width: 0 });
  shade(sleeveR, [[450, 330], [470, 460], [510, 590], [560, 660]], 16, '#a79fbf', 0.4, 6);
  [[455, 360], [470, 420], [490, 500], [510, 560]].forEach(([x, y]) =>
    line([[x, y], [x + 14, y + 30], [x + 30, y + 70]], 0.7, '#a59dbb', { clip: sleeveR }));
  add(sleeveR, { color: INK, width: 1 });
  // 透けるフリルの袖口
  const cuffR = curve([[500, 640], [585, 630], [592, 668], [578, 690], [545, 688], [510, 690], [498, 672]], true);
  add(cuffR, { fill: '#f4f1f8', width: 0, alpha: 0.8 });
  for (let i = 0; i < 12; i++) line([[503 + i * 7, 645], [505 + i * 7.5, 670], [502 + i * 7.5, 690]], 0.6, '#a59dbb', { alpha: 0.7 });
  line([[498, 690], [512, 684], [526, 694], [540, 684], [556, 694], [572, 684], [590, 668]], 0.9, INK);
  const handR = curve([[508, 686], [526, 684], [533, 705], [528, 722], [516, 732], [506, 722], [503, 700]], true);
  add(handR, { fill: linear(505, 690, 530, 730, '#faf2f0', '#ead8d7'), width: 0 });
  line([[508, 686], [503, 702], [506, 722], [516, 732]], 0.8, SKIN_INK);
  line([[526, 684], [533, 705], [528, 722]], 0.8, SKIN_INK);
  line([[516, 712], [522, 726]], 0.6, SKIN_INK);

  // 襟とリボン
  [[[300, 264], [336, 286], [310, 298], [292, 276]], [[372, 262], [338, 286], [364, 297], [382, 276]]].forEach(c => {
    add(c, { fill: linear(0, 262, 0, 298, '#ffffff', '#e9e5ef'), width: 0 });
    add([...c, c[0]], { color: INK, width: 1 });
    // 襟の縁のレース
    for (let t = 0.15; t < 0.9; t += 0.12) {
      const x = c[1][0] + (c[2][0] - c[1][0]) * t, y = c[1][1] + (c[2][1] - c[1][1]) * t;
      add(circle(x, y - 2, 0.9, 6), { color: '#a59dbb', width: 0.5 });
    }
  });
  const ribbon = (pts, w) => {
    add(taper(curve(pts), 0.05, 0.1, 0.5), { color: BLACK, width: w });
    add(taper(curve(pts.map(([x, y]) => [x - 0.8, y])), 0.2, 0.4), { color: '#5d5870', width: w * 0.2, alpha: 0.8 });
  };
  add(ellipse(328, 289, 9, 4.5, 0, Math.PI * 2, 16), { fill: BLACK, width: 0 });
  add(ellipse(346, 289, 9, 4.5, 0, Math.PI * 2, 16), { fill: BLACK, width: 0 });
  ribbon([[334, 291], [328, 320], [322, 360], [318, 395]], 5);
  ribbon([[340, 291], [350, 330], [350, 365], [345, 400]], 5);

  // スカート（ハイウエスト、前ボタン）
  const skirt = curve([[282, 560], [270, 650], [262, 760], [258, H + 5], [490, H + 5], [480, 760], [468, 650], [452, 560]]);
  add(skirt, { fill: linear(258, 0, 490, 0, '#e2ddd6', '#f6f4f0', '#dfd9d1'), width: 0 });
  shade(skirt, [[285, 580], [275, 720], [268, H]], 22, '#b3aca2', 0.4, 8);
  shade(skirt, [[462, 580], [476, 720], [484, H]], 20, '#b3aca2', 0.4, 8);
  shade(skirt, [[362, 580], [358, 740], [354, H]], 8, '#c6bfb5', 0.35, 4);
  line([[366, 575], [360, 740], [356, H]], 0.9, '#a8a095', { clip: skirt });
  [[[300, 690], [310, 820], [300, H]], [[430, 690], [425, 820], [440, H]], [[330, 760], [332, 840], [326, H]]]
    .forEach(p => line(p, 0.7, '#b8b0a4', { clip: skirt }));
  [[330, 602], [398, 598], [322, 640], [405, 636]].forEach(([x, y]) => {
    add(circle(x, y, 6.5, 24), { fill: radial(x - 2, y - 2, 0, 8, '#4a4658', BLACK), width: 0 });
    add(circle(x, y, 4, 16), { color: '#5d5870', width: 0.6 });
    add(circle(x - 2, y - 2, 1.2, 8), { fill: '#fff', width: 0, alpha: 0.6 });
  });
  add(skirt, { color: INK, width: 1 });

  // ベルトと黒いリボン
  const belt = [[280, 538], [454, 532], [458, 575], [284, 582]];
  add(belt, { fill: linear(0, 532, 0, 582, '#f1ece3', '#d9d2c5'), width: 0 });
  add([...belt, belt[0]], { color: INK, width: 1 });
  line([[284, 544], [455, 538]], 0.6, '#b8b0a4');
  line([[286, 576], [457, 570]], 0.6, '#b8b0a4');
  [300, 425].forEach(x => {
    add(rect(x, 535, 10, 45), { fill: linear(x, 0, x + 10, 0, '#e8e1d4', '#cfc7b8'), width: 0 });
    add(rect(x, 535, 10, 45), { color: '#9c9486', width: 0.6 });
  });
  const loop = (cx, cy, dir) => add(taper(curve([[cx, cy], [cx + 10 * dir, cy - 8], [cx + 20 * dir, cy - 3], [cx + 18 * dir, cy + 6], [cx, cy + 2]]), 0.1, 0.1, 0.4), { color: BLACK, width: 3.5 });
  loop(362, 555, -1);
  loop(366, 555, 1);
  add(ellipse(364, 556, 4.5, 4, 0, Math.PI * 2, 12), { fill: BLACK, width: 0 });
  ribbon([[362, 559], [356, 600], [355, 640], [362, 690]], 4.5);
  ribbon([[367, 559], [378, 590], [379, 620], [372, 650]], 4.5);

  // ── 顔 ──
  const face = curve([[252, 140], [253, 200], [262, 230], [284, 252], [317, 264], [350, 252], [372, 230], [381, 200], [382, 140], [317, 98]], true);
  add(face, { fill: radial(317, 205, 10, 90, '#fcf6f5', '#f6ecea', '#ecdcdb'), width: 0 });
  // 前髪の落とす影、輪郭側の影
  shade(face, [[250, 196], [317, 200], [384, 196]], 16, '#cdbdd2', 0.55, 5);
  shade(face, [[258, 200], [265, 235], [290, 256]], 8, '#e0c6c8', 0.4, 5);
  shade(face, [[376, 200], [368, 235], [345, 256]], 8, '#e0c6c8', 0.4, 5);
  line([[256, 205], [262, 232], [284, 254], [317, 265], [350, 254], [372, 232], [379, 205]], 0.9, SKIN_INK, { head: 0.15, tail: 0.15 });

  // 目：横長のアーモンド形、上まぶたが瞳の上側を隠す伏し目。dir は目尻の向き
  const eye = (cx, cy, dir) => {
    const inner = [cx - 17 * dir, cy + 2], outer = [cx + 20 * dir, cy + 1];
    const upper = curve([inner, [cx - 7 * dir, cy - 4], [cx + 9 * dir, cy - 5], outer]);
    const lower = curve([outer, [cx + 8 * dir, cy + 10], [cx - 6 * dir, cy + 9], inner]);
    const white = [...upper, ...lower];
    add(white, { fill: linear(0, cy - 5, 0, cy + 10, '#e6e2ec', '#fdfcfe'), width: 0 });
    const ix = cx + 1 * dir, iy = cy + 3;
    add(circle(ix, iy, 10.5, 40), { fill: radial(ix, iy + 2, 2, 11, '#d9d6e0', '#aaa6b6', '#7f7a8e'), width: 0, clip: white });
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 14)                          // 虹彩の放射状の筋
      line([[ix + Math.cos(a) * 4, iy + Math.sin(a) * 4], [ix + Math.cos(a) * 9.5, iy + Math.sin(a) * 9.5]], 0.4, '#77728a', { alpha: 0.6, clip: white });
    add(ellipse(ix, iy, 10.5, 10.5, 0, Math.PI * 2, 40), { color: '#5f5a70', width: 0.8, clip: white });
    add(circle(ix, iy, 3.2, 16), { fill: '#5b5667', width: 0, clip: white });
    // 上まぶたの落とす影
    add(curve([inner, [cx - 7 * dir, cy - 2], [cx + 9 * dir, cy - 3], outer]), { color: '#7a7090', width: 5, alpha: 0.45, blur: 1.5, blend: 'multiply', clip: white });
    // まつげの線（入り抜きのある太い線）と、目尻へ伸びるまつげ
    add(taper(upper, 0.35, 0.1, 0.2), { color: '#2e2838', width: 3.2 });
    for (let k = 0; k < 7; k++) {
      const t = 0.35 + k * 0.1, p = upper[Math.floor(t * (upper.length - 1))], len = 3 + k * 0.9;
      line([[p[0], p[1]], [p[0] + (2 + k * 0.6) * dir, p[1] - len * 0.6], [p[0] + (4 + k) * dir, p[1] - len * 0.7 + k * 0.4]], 0.9, '#2e2838', { head: 0, tail: 0.7 });
    }
    line([[cx - 13 * dir, cy - 9], [cx + 3 * dir, cy - 12], [cx + 18 * dir, cy - 7]], 0.8, '#a28e9f');   // 二重
    line(lower.slice(0, Math.floor(lower.length * 0.8)), 1, '#cf7a84', { head: 0.3, tail: 0.5 });       // 赤みのある下まぶた
    for (let k = 0; k < 4; k++) {                                                                        // 下まつげ
      const p = lower[2 + k * 3];
      line([[p[0], p[1]], [p[0] + 1.5 * dir, p[1] + 2.5]], 0.5, '#8a6f7c', { alpha: 0.8 });
    }
    add(ellipse(cx + 14 * dir, cy + 4, 10, 6, 0, Math.PI * 2, 16), { fill: '#e48d98', width: 0, alpha: 0.35, blur: 3 }); // 目尻の赤
    add(circle(cx - 3 * dir, cy + 1, 1.8, 10), { fill: '#fff', width: 0 });                             // ハイライト
    add(circle(cx + 5 * dir, cy + 7, 1, 8), { fill: '#fff', width: 0, alpha: 0.9 });
  };
  eye(282, 209, -1);
  eye(352, 209, 1);

  // 頬の赤み（ぼかし＋細い斜線）
  [[268, 231], [346, 231]].forEach(([x, y]) => {
    add(ellipse(x + 10, y + 2, 18, 7, 0, Math.PI * 2, 20), { fill: '#f0a0a6', width: 0, alpha: 0.35, blur: 4 });
    for (let i = 0; i < 6; i++) line([[x + i * 4, y + 5], [x + i * 4 + 4, y - 1]], 0.6, '#df8d95', { alpha: 0.7 });
  });
  // 鼻（小さな影と光）
  line([[315, 229], [319, 234], [316, 237]], 0.8, '#c9a2a3');
  add(circle(318, 227, 1.4, 8), { fill: '#fff', width: 0, alpha: 0.95 });
  // 唇
  const lips = curve([[308, 246], [313, 244.5], [317, 246], [321, 244.5], [326, 246], [320, 252], [314, 252]], true);
  add(lips, { fill: linear(0, 244, 0, 252, '#e79ea4', '#f4bdbf'), width: 0 });
  line([[307, 246.5], [313, 246.8], [317, 247.5], [321, 246.8], [327, 246.5]], 0.9, '#b8737c', { head: 0.3, tail: 0.3 });
  add(ellipse(320, 250, 2.5, 0.8, 0, Math.PI * 2, 10), { fill: '#fff', width: 0, alpha: 0.8 });

  // ── 前髪と横の髪 ──
  const fringe = [[248, 192]];
  for (let x = 254; x <= 382; x += 5) fringe.push([x, 186 + ((x * 13) % 11) + (x % 3) * 2]);
  const fringeLine = fringe.slice();
  const bangs = [...fringe, ...curve([[386, 192], [384, 120], [350, 88], [290, 88], [256, 115], [248, 192]])];
  add(bangs, { fill: linear(0, 88, 0, 196, '#f6f4fa', '#e6e2ef', '#d8d2e5'), width: 0 });
  // 毛筋：分け目から左右へ流れる細い線を多数
  between([[312, 90], [290, 110], [262, 150], [250, 194]], [[318, 92], [314, 130], [308, 165], [302, 196]], 22, 0.7, HAIR_INK, { clip: bangs, cut: 2 });
  between([[322, 92], [322, 130], [330, 165], [334, 196]], [[326, 90], [352, 110], [378, 150], [386, 194]], 22, 0.7, HAIR_INK, { clip: bangs, cut: 2 });
  line([[317, 92], [305, 140], [296, 192]], 1, HAIR_INK);
  line([[318, 92], [330, 140], [340, 192]], 1, HAIR_INK);
  // 目元にかかる毛束
  [[316, 188, 319, 224], [296, 188, 290, 216], [340, 188, 347, 218], [262, 188, 255, 222], [372, 188, 379, 222]]
    .forEach(([x1, y1, x2, y2]) => {
      const mx = (x1 + x2) / 2 + (x2 - x1) * 0.3, my = (y1 + y2) / 2;
      add(taper(curve([[x1, y1 - 12], [mx, my], [x2, y2]]), 0.1, 0.8, 0.05), { color: '#e3dfec', width: 7 });
      line([[x1 - 3, y1 - 6], [mx - 2, my], [x2, y2]], 0.6, HAIR_INK, { head: 0, tail: 0.6 });
      line([[x1 + 3, y1 - 6], [mx + 1.5, my], [x2, y2]], 0.5, HAIR_INK, { head: 0, tail: 0.6, alpha: 0.7 });
    });
  for (let i = 1; i < fringeLine.length - 1; i++) {                      // 毛先ごとの細い線
    const [x, y] = fringeLine[i];
    line([[x - 1, y - 14], [x, y]], 0.6, HAIR_INK, { head: 0, tail: 0.7, alpha: 0.8 });
  }
  // 頭頂のツヤ（天使の輪）：ぼかした光と、細い白の毛筋
  add(curve([[266, 134], [290, 123], [317, 120], [344, 123], [370, 134]]), { color: '#ffffff', width: 10, alpha: 0.7, blur: 3, clip: bangs });
  for (let x = 272; x <= 364; x += 7 + rand() * 4) {
    const y0 = 118 + rand() * 6, y1 = 132 + rand() * 12;
    line([[x + 2, y0], [x, (y0 + y1) / 2], [x - 1, y1]], 0.7, '#ffffff', { alpha: 0.6, clip: bangs, head: 0.5, tail: 0.5 });
  }
  // 顔の横に垂れる髪
  [[[256, 150], [245, 200], [240, 250], [248, 285], [262, 276], [260, 220], [264, 170]],
   [[378, 150], [390, 200], [396, 250], [388, 288], [374, 278], [374, 220], [370, 170]]].forEach((ctrl, k) => {
    const lock = curve(ctrl, true);
    add(lock, { fill: linear(0, 150, 0, 290, '#eeebf5', '#d6d0e3'), width: 0 });
    const A = k ? [[372, 150], [376, 210], [376, 250], [376, 282]] : [[262, 150], [258, 210], [262, 250], [260, 280]];
    const B = k ? [[380, 150], [392, 210], [396, 250], [388, 288]] : [[256, 150], [244, 210], [240, 250], [248, 285]];
    between(A, B, 10, 0.7, HAIR_INK, { clip: lock });
    add(lock, { color: HAIR_INK, width: 0.8 });
  });

  // 三つ編み（画面左の肩へ）：編み目ごとに毛筋を入れる
  for (let i = 0; i < 7; i++) {
    const x = 252 - i * 2.5 + (i % 2 ? 4 : -4), y = 280 + i * 15;
    const knot = ellipse(x, y, 12, 10, 0, Math.PI * 2, 24);
    add(knot, { fill: radial(x - 3, y - 4, 1, 14, '#faf9fd', '#dcd6e8'), width: 0 });
    for (let k = -2; k <= 2; k++)
      line([[x - 10 * (i % 2 ? -1 : 1), y - 7 + k * 2], [x, y + k * 3], [x + 9 * (i % 2 ? -1 : 1), y + 6 + k * 2]], 0.6, HAIR_INK, { clip: knot, alpha: 0.7 });
    add(knot, { color: HAIR_INK, width: 0.8 });
  }
  add(rect(226, 377, 16, 8), { fill: BLACK, width: 0 });
  const tail = curve([[228, 385], [242, 385], [244, 405], [238, 428], [230, 410]], true);
  add(tail, { fill: '#e6e1ee', width: 0 });
  between([[230, 386], [227, 405], [234, 426]], [[240, 386], [243, 405], [238, 428]], 7, 0.6, HAIR_INK, { clip: tail });

  // ── 左袖（ランタンを掲げる腕） ──
  const sleeveL = curve([[245, 285], [200, 300], [165, 380], [95, 460], [50, 560], [120, 585], [170, 540], [215, 420]], true);
  add(sleeveL, { fill: linear(60, 0, 245, 0, '#dcd6e6', '#f7f5fa', '#e6e1ee'), width: 0 });
  shade(sleeveL, [[215, 310], [180, 400], [130, 480], [90, 560]], 18, '#a69ebf', 0.35, 7);
  [[200, 330], [185, 380], [160, 430], [135, 470]].forEach(([x, y]) =>
    line([[x, y], [x - 20, y + 40], [x - 40, y + 85]], 0.7, '#a59dbb', { clip: sleeveL }));
  add(sleeveL, { color: INK, width: 1 });
  // 前腕と手（持ち手を握る）
  const arm = curve([[95, 470], [100, 380], [108, 345], [135, 345], [140, 400], [150, 470]], true);
  add(arm, { fill: linear(95, 0, 150, 0, '#f7ecea', '#fbf5f4', '#e8d6d5'), width: 0 });
  add(arm, { color: SKIN_INK, width: 0.8 });
  const fist = curve([[100, 350], [98, 325], [115, 318], [138, 325], [140, 348]], true);
  add(fist, { fill: linear(0, 318, 0, 350, '#fbf4f3', '#ecdcdb'), width: 0 });
  add(fist, { color: SKIN_INK, width: 0.8 });
  [[106, 330], [116, 328], [126, 330]].forEach(([x, y]) => line([[x, y], [x + 1, y + 10], [x, y + 16]], 0.6, SKIN_INK));
  line([[102, 336], [118, 332], [136, 336]], 0.6, SKIN_INK, { alpha: 0.8 });

  // ── ランタン ──
  add(ellipse(115, 368, 44, 42, Math.PI * 1.05, Math.PI * 1.95, 30), { color: BLACK, width: 3 });
  add(ellipse(115, 368, 44, 42, Math.PI * 1.15, Math.PI * 1.5, 20), { color: '#6d6880', width: 0.8 });
  add(rect(96, 362, 38, 16), { fill: linear(96, 0, 134, 0, '#3a3645', BLACK), width: 0 });
  add(rect(84, 378, 62, 14), { fill: linear(84, 0, 146, 0, '#48445a', BLACK), width: 0 });
  line([[88, 380], [142, 380]], 0.8, '#8a86a0');
  // ガラスの中の光
  const glass = curve([[74, 400], [70, 470], [76, 540], [154, 540], [160, 470], [156, 400]], true);
  add(glass, { fill: radial(115, 470, 5, 80, '#ffffff', '#efe6f4', '#cbc1dc'), width: 0 });
  add(curve([[115, 432], [102, 470], [115, 505], [128, 470]], true), { fill: radial(115, 472, 1, 30, '#ffffff', '#f2c9e6', '#d7a6d8'), width: 0, blur: 2 });
  add(curve([[115, 448], [108, 472], [115, 492], [122, 472]], true), { fill: '#ffffff', width: 0, blur: 1 });
  line([[84, 410], [80, 470], [85, 530]], 2, '#ffffff', { alpha: 0.6, clip: glass });
  add(glass, { color: BLACK, width: 2 });
  // 針金の枠
  line([[80, 430], [115, 465], [150, 500]], 2.4, BLACK, { head: 0.05, tail: 0.05 });
  line([[150, 430], [115, 465], [80, 500]], 2.4, BLACK, { head: 0.05, tail: 0.05 });
  line([[80, 500], [115, 520], [150, 500]], 1.6, BLACK, { head: 0.05, tail: 0.05 });
  [[[60, 395], [55, 470], [62, 550]], [[170, 395], [175, 470], [168, 550]]].forEach(p => {
    add(taper(curve(p), 0.05, 0.05, 0.6), { color: BLACK, width: 6 });
    line(p.map(([x, y]) => [x - 1.5, y]), 0.9, '#7a7590', { alpha: 0.9 });
  });
  add(rect(66, 540, 98, 32), { fill: linear(66, 0, 164, 0, '#3e3a4c', BLACK, '#2a2735'), width: 0 });
  line([[70, 546], [160, 546]], 0.8, '#8a86a0');
  line([[70, 566], [160, 566]], 0.8, '#5d5870');
  // ランタンの光がまわりを照らす
  glow(115, 470, 120, '#f3e6ff', 0.55);
  glow(115, 470, 45, '#ffffff', 0.5);

  // ── 仕上げ：月明かりと周辺の減光 ──
  add(rect(0, 0, W, H), { fill: radial(306, 124, 60, 420, 'rgba(235,232,255,0.35)', 'rgba(235,232,255,0)'), width: 0, blend: 'screen' });
  add(rect(0, 0, W, H), { fill: radial(W / 2, H * 0.45, 300, 620, 'rgba(0,0,0,0)', 'rgba(40,36,70,0.35)'), width: 0, blend: 'multiply' });

  (window.AI_DRAWINGS ||= []).push({ id: 'moonlight-copy', title: '模写：月下のランタン', width: W, height: H, strokes: S });
})();
