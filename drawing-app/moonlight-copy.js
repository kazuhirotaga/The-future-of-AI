// 模写「月下のランタン」— 参考画像を見ながら、構図と配色を一筆ずつ写し取った練習作。
// 座標は参考画像（1248×1824）のおよそ半分のスケール（624×912）で目測している。
(() => {
  const { ellipse, circle, rect, curve } = DrawKit;
  const { strokes: S, add } = DrawKit.canvas();
  const W = 624, H = 912;
  const LINE = '#4a4458', HAIR = '#e9e6f0', HAIR_LINE = '#8a82a0', SKIN = '#f7eeec',
        CLOTH = '#f3f1f4', CLOTH_SHADE = '#d8d2e4', STONE = '#c3c7d3';

  // ── 背景：石のアーチ ──
  add(rect(0, 0, W, H), { fill: STONE, width: 0 });
  const opening = [[82, H], [82, 200], ...ellipse(315, 200, 233, 250, Math.PI, Math.PI * 2, 40), [548, H]];
  add(opening, { fill: '#141a33', width: 0 });

  // 星
  [[120, 60], [470, 40], [520, 150], [160, 150], [450, 230], [110, 330], [540, 300], [210, 80]]
    .forEach(([x, y]) => add(circle(x, y, 1.4, 6), { fill: '#e6e2f0', width: 0 }));

  // 満月（光輪 → 本体 → 模様）
  add(circle(306, 124, 150, 60), { fill: '#e8e4f0', width: 0, alpha: 0.18 });
  add(circle(306, 124, 136, 60), { fill: '#ebe7dd', color: '#f7f5ef', width: 3 });
  [[260, 60, 38, 20], [330, 50, 30, 16], [370, 95, 26, 22], [240, 120, 22, 16], [300, 100, 18, 12],
   [345, 150, 22, 14], [220, 70, 14, 10], [390, 60, 14, 12]]
    .forEach(([x, y, rx, ry]) => add(ellipse(x, y, rx, ry, 0, Math.PI * 2, 24), { fill: '#c8c1b4', width: 0, alpha: 0.75 }));
  // 月にかかる雲
  add(curve([[400, 150], [430, 140], [470, 144], [500, 132]]), { color: '#2a3050', width: 3, alpha: 0.6 });
  add(curve([[455, 92], [480, 84], [510, 88]]), { color: '#2a3050', width: 2, alpha: 0.5 });

  // 奥の森（暗いシルエット）
  add([[82, 470], ...curve([[82, 470], [180, 440], [300, 460], [420, 380], [548, 330]]), [548, 640], [82, 640]],
      { fill: '#0c1020', width: 0 });
  // 右の木の幹
  [[470, 380, 480, 620], [500, 360, 505, 620], [530, 340, 528, 620], [445, 420, 455, 620]]
    .forEach(([x1, y1, x2, y2]) => add([[x1, y1], [x2, y2]], { color: '#232842', width: 4 }));
  // 紫の葉むら（左右）
  const foliage = (cx, cy, n, spread, seed) => {
    for (let i = 0; i < n * 3; i++) {
      const a = seed + i * 2.39, d = spread * Math.sqrt((i + 1) / (n * 3));
      const x = cx + d * Math.cos(a), y = cy + d * Math.sin(a) * 1.3;
      const rot = a * 1.7, r = 6 + (i * 7 % 5);
      add(ellipse(0, 0, r * 1.6, r * 0.7, 0, Math.PI * 2, 10).map(([u, v]) =>
            [x + u * Math.cos(rot) - v * Math.sin(rot), y + u * Math.sin(rot) + v * Math.cos(rot)]),
          { fill: ['#6c5c8c', '#9a86b8', '#cdb6dc'][i % 3], width: 0, alpha: 0.75 });
    }
  };
  foliage(150, 300, 18, 55, 0.3);
  foliage(165, 430, 14, 45, 1.1);
  foliage(480, 170, 16, 55, 2.0);
  foliage(500, 300, 18, 50, 0.7);
  foliage(470, 420, 10, 35, 1.7);

  // 地面と石畳の道
  add([[82, 620], [548, 600], [548, H], [82, H]], { fill: '#8f95aa', width: 0 });
  add([[180, 620], [400, 610], [520, H], [100, H]], { fill: '#c6c9d6', width: 0 });
  for (let y = 650; y < H; y += 45) add([[140 - (y - 650) * 0.1, y], [470 + (y - 650) * 0.15, y - 6]], { color: '#a3a8ba', width: 1.5 });

  // 柱とアーチの縁取り
  add(ellipse(315, 200, 233, 250, Math.PI, Math.PI * 2, 40), { color: '#e3e5ed', width: 10 });
  add(ellipse(315, 200, 255, 272, Math.PI, Math.PI * 2, 40), { color: '#9ea3b6', width: 3 });
  [[0, 82], [548, 624]].forEach(([x0, x1]) => {
    add(rect(x0, 0, x1 - x0, H), { fill: '#cfd2dd', color: '#9ea3b6', width: 2 });
    add(rect(x0, 118, x1 - x0, 26), { fill: '#e6e8ef', color: '#8d93a8', width: 2 }); // 柱頭
    add(rect(x0, 590, x1 - x0, 22), { fill: '#e6e8ef', color: '#8d93a8', width: 2 });
    for (let y = 170; y < 580; y += 38) add([[x0 + 4, y], [x1 - 4, y]], { color: '#aeb3c4', width: 1.5 });
    for (let x = x0 + 18; x < x1; x += 20) add([[x, 150], [x, 585]], { color: '#b8bccb', width: 1, alpha: 0.6 });
  });

  // 桃の茂み（左下・右下）
  const bush = (cx, cy, peaches) => {
    for (let i = 0; i < 30; i++) {
      const a = i * 2.1, d = 20 + (i % 6) * 16, rot = a + 0.6;
      const x = cx + d * Math.cos(a) * 0.8, y = cy + d * Math.sin(a) * 1.4;
      add(ellipse(0, 0, 26, 11, 0, Math.PI * 2, 14).map(([u, v]) =>
            [x + u * Math.cos(rot) - v * Math.sin(rot), y + u * Math.sin(rot) + v * Math.cos(rot)]),
          { fill: i % 2 ? '#56666a' : '#7a8b8e', color: '#3c4749', width: 1 });
    }
    peaches.forEach(([x, y]) => {
      add(circle(x, y, 17, 24), { fill: '#f4b9a6', color: '#c9806c', width: 1.5 });
      add(circle(x - 5, y - 5, 6, 12), { fill: '#fde3d8', width: 0, alpha: 0.8 });
    });
  };
  bush(35, 790, [[30, 720], [70, 790], [35, 850]]);
  bush(600, 760, [[600, 690], [580, 790]]);

  // ── 人物 ──
  // コート（背面、肩から垂れる）
  add([[235, 285], [180, 330], [150, 480], [125, 700], [115, H], [255, H], [250, 640], [245, 420]],
      { fill: '#e4e0ec', color: LINE, width: 2 });
  add([[420, 280], [470, 320], [520, 520], [580, 690], [600, H], [480, H], [475, 640], [440, 400]],
      { fill: '#e4e0ec', color: LINE, width: 2 });

  // 髪（後ろ）
  add(curve([[232, 170], [240, 108], [292, 76], [356, 82], [402, 118], [414, 190], [408, 260], [398, 310],
             [378, 318], [366, 270], [330, 262], [290, 262], [246, 262]], true), { fill: HAIR, color: HAIR_LINE, width: 1.5 });
  add(curve([[380, 150], [395, 210], [388, 280]]), { color: '#c9c2da', width: 1.5 });

  // 首
  add([[300, 250], [334, 250], [337, 282], [302, 282]], { fill: '#ede0de', width: 0 });

  // ブラウス（胴）
  add(curve([[300, 248], [250, 272], [245, 360], [265, 450], [282, 545], [452, 540], [445, 450], [438, 360],
             [430, 280], [345, 250]], true), { fill: CLOTH, color: LINE, width: 2 });
  for (let x = 300; x <= 400; x += 16) add(curve([[x, 300], [x + 2, 420], [x - 2, 530]]), { color: CLOTH_SHADE, width: 1.5 });
  for (let y = 285; y <= 520; y += 34) add(circle(346, y, 3.5, 10), { fill: '#fff', color: '#8a8498', width: 1 });

  // 右袖（画面右、下ろした腕）と手
  add(curve([[425, 282], [455, 330], [480, 460], [530, 590], [585, 660], [545, 680], [500, 672], [470, 560], [440, 440]], true),
      { fill: CLOTH, color: LINE, width: 2 });
  add(curve([[500, 672], [515, 684], [530, 672], [545, 684], [560, 672], [575, 682], [585, 662]]), { color: LINE, width: 1.5 });
  add(curve([[508, 676], [526, 672], [532, 700], [520, 722], [506, 716], [502, 695]], true), { fill: SKIN, color: '#b8a3a0', width: 1.5 });

  // 襟とリボン
  add([[300, 266], [336, 286], [310, 298], [292, 278]], { fill: '#fbfafc', color: LINE, width: 2 });
  add([[372, 264], [338, 286], [364, 297], [382, 278]], { fill: '#fbfafc', color: LINE, width: 2 });
  add(ellipse(328, 289, 9, 5, 0, Math.PI * 2, 12), { fill: '#1b1a22', width: 0 });
  add(ellipse(346, 289, 9, 5, 0, Math.PI * 2, 12), { fill: '#1b1a22', width: 0 });
  add(curve([[334, 291], [325, 330], [318, 395]]), { color: '#1b1a22', width: 5 });
  add(curve([[340, 291], [352, 340], [345, 400]]), { color: '#1b1a22', width: 5 });

  // スカート（ハイウエスト、前ボタン）
  add(curve([[282, 560], [270, 650], [262, 760], [258, H], [490, H], [480, 760], [468, 650], [452, 560]]),
      { fill: '#efece7', color: LINE, width: 2 });
  add(curve([[366, 575], [360, 740], [356, H]]), { color: '#c9c3ba', width: 2 });
  [[330, 602], [398, 598], [322, 640], [405, 636]]
    .forEach(([x, y]) => add(circle(x, y, 7, 14), { fill: '#2a2833', color: '#111', width: 1 }));
  add(curve([[300, 700], [310, 820], [300, H]]), { color: '#d9d3cb', width: 2 });
  add(curve([[430, 700], [425, 820], [440, H]]), { color: '#d9d3cb', width: 2 });

  // ベルトと黒いリボン
  add([[280, 538], [454, 532], [458, 575], [284, 582]], { fill: '#ebe5da', color: LINE, width: 2 });
  add(rect(300, 536, 10, 44), { fill: '#e2dccf', color: '#a39c90', width: 1 });
  add(rect(425, 533, 10, 44), { fill: '#e2dccf', color: '#a39c90', width: 1 });
  add(ellipse(348, 556, 16, 8, 0, Math.PI * 2, 16), { color: '#1b1a22', width: 4 });
  add(ellipse(380, 554, 16, 8, 0, Math.PI * 2, 16), { color: '#1b1a22', width: 4 });
  add(circle(364, 556, 5, 10), { fill: '#1b1a22', width: 0 });
  add(curve([[362, 560], [355, 620], [362, 690]]), { color: '#1b1a22', width: 5 });
  add(curve([[367, 560], [378, 600], [372, 650]]), { color: '#1b1a22', width: 5 });

  // 顔（参考画像で目は顔の縦中央より下、両目の間隔は広め）
  add(curve([[252, 140], [253, 200], [262, 230], [284, 252], [317, 264], [350, 252], [372, 230], [381, 200], [382, 140], [317, 98]], true),
      { fill: SKIN, color: '#c9b2b0', width: 1.5 });
  // 前髪の落とす影
  add([[252, 186], [382, 186], [382, 204], [252, 204]], { fill: '#d9cfe0', width: 0, alpha: 0.35 });

  // 目：横長のアーモンド形。上まぶたが瞳の上側を大きく隠す伏し目。dir は目尻の向き
  const eye = (cx, cy, dir) => {
    const inner = [cx - 17 * dir, cy + 2], outer = [cx + 20 * dir, cy + 1];
    const upper = curve([inner, [cx - 7 * dir, cy - 4], [cx + 9 * dir, cy - 5], outer]);
    const lower = curve([outer, [cx + 8 * dir, cy + 10], [cx - 6 * dir, cy + 9], inner]);
    add([...upper, ...lower], { fill: '#fdfcfe', width: 0 });                     // 白目
    add(circle(cx + 1 * dir, cy + 3, 10.5, 24), { fill: '#8f8b9b', width: 0 });    // 虹彩（外周）
    add(circle(cx + 1 * dir, cy + 4, 7.5, 20), { fill: '#c4c0cd', width: 0 });     // 虹彩（内側の明るみ）
    add(circle(cx + 1 * dir, cy + 3, 3, 12), { fill: '#6a6676', width: 0 });       // 瞳孔
    // 上まぶたで瞳の上側を隠す（肌色で覆う）
    add([...upper, [outer[0] + 4 * dir, cy - 18], [inner[0] - 4 * dir, cy - 18]], { fill: SKIN, width: 0 });
    add(upper, { color: '#3a3445', width: 4 });                                    // まつげの線
    [[0.55, -6], [0.8, -5], [1, -3]].forEach(([t, dy]) => {                        // 目尻側のまつげ
      const x = cx + (-7 + 27 * t) * dir, y = cy - 4 + (t > 0.9 ? 4 : 0);
      add([[x, y], [x + 5 * dir, y + dy]], { color: '#3a3445', width: 1.5 });
    });
    add(curve([[cx - 12 * dir, cy - 9], [cx + 3 * dir, cy - 12], [cx + 17 * dir, cy - 8]]), { color: '#a893a3', width: 1 }); // 二重
    add(lower, { color: '#d47f86', width: 1.5, alpha: 0.9 });                     // 赤みのある下まぶた
    add(ellipse(cx + 14 * dir, cy + 5, 8, 4, 0, Math.PI * 2, 12), { fill: '#e79a9f', width: 0, alpha: 0.35 }); // 目尻の赤
    add(circle(cx - 3 * dir, cy + 1, 2, 8), { fill: '#fff', width: 0 });          // ハイライト
    add(circle(cx + 5 * dir, cy + 7, 1.2, 6), { fill: '#fff', width: 0, alpha: 0.9 });
  };
  eye(282, 209, -1);
  eye(352, 209, 1);

  // 頬の赤み（斜線）
  [[266, 230], [344, 230]].forEach(([x, y]) => {
    add(ellipse(x + 11, y + 2, 16, 5, 0, Math.PI * 2, 12), { fill: '#f2a9ab', width: 0, alpha: 0.3 });
    for (let i = 0; i < 5; i++) add([[x + i * 5, y + 5], [x + i * 5 + 4, y]], { color: '#e38f95', width: 1, alpha: 0.6 });
  });
  // 鼻（小さな影と光）と唇
  add(curve([[316, 230], [319, 234], [317, 236]]), { color: '#d2aaa8', width: 1.2 });
  add(circle(317, 228, 1.3, 6), { fill: '#fff', width: 0, alpha: 0.9 });
  add(curve([[309, 246], [313, 245], [317, 246.5], [321, 245], [325, 246]]), { fill: '#eda9ad', color: '#c98488', width: 1.2 });
  add(ellipse(317, 249, 7, 3.2, 0, Math.PI, 12), { fill: '#f3b7b9', width: 0 });
  add(ellipse(319, 249, 2.5, 0.8, 0, Math.PI * 2, 8), { fill: '#fff', width: 0, alpha: 0.7 });

  // 前髪（目の上まで届く長めのぱっつん。数本の毛束が目元にかかる）
  const fringe = [[248, 192]];
  for (let x = 254; x <= 382; x += 7) fringe.push([x, 188 + ((x * 13) % 9)]);
  add([...fringe, ...curve([[386, 192], [384, 120], [350, 88], [290, 88], [256, 115], [248, 192]])],
      { fill: HAIR, color: HAIR_LINE, width: 1.5 });
  for (let x = 262; x <= 376; x += 12) add(curve([[x + 10, 100], [x + 4, 150], [x, 190]]), { color: '#c3bcd4', width: 1 });
  [[316, 192, 319, 224], [296, 192, 291, 216], [340, 192, 346, 218], [262, 192, 256, 222], [372, 192, 378, 222]]
    .forEach(([x1, y1, x2, y2]) => {
      const mx = (x1 + x2) / 2 + (x2 - x1) * 0.3, my = (y1 + y2) / 2;
      add(curve([[x1 - 5, y1 - 2], [mx - 2, my], [x2, y2], [mx + 2, my], [x1 + 5, y1 - 2]]),
          { fill: HAIR, color: HAIR_LINE, width: 1 });
    });
  // 前髪の分け目から左右へ流れる毛束
  add(curve([[317, 96], [304, 140], [294, 190]]), { color: HAIR_LINE, width: 1.2 });
  add(curve([[317, 96], [332, 140], [342, 190]]), { color: HAIR_LINE, width: 1.2 });
  // 頭頂のツヤ（天使の輪）
  add(curve([[270, 134], [292, 125], [317, 122], [342, 125], [366, 134]]), { color: '#ffffff', width: 4, alpha: 0.75 });
  for (let x = 274; x <= 362; x += 11) add([[x, 122], [x - 1, 140]], { color: '#ffffff', width: 2, alpha: 0.7 });
  // 顔の横に垂れるサイドの髪
  add(curve([[256, 150], [245, 200], [240, 250], [248, 285], [262, 276], [260, 220], [264, 170]], true),
      { fill: HAIR, color: HAIR_LINE, width: 1.2 });
  add(curve([[378, 150], [390, 200], [396, 250], [388, 288], [374, 278], [374, 220], [370, 170]], true),
      { fill: HAIR, color: HAIR_LINE, width: 1.2 });
  add(curve([[252, 185], [247, 235], [252, 275]]), { color: '#c3bcd4', width: 1 });
  add(curve([[384, 185], [390, 235], [384, 278]]), { color: '#c3bcd4', width: 1 });

  // 三つ編み（画面左の肩へ）
  for (let i = 0; i < 7; i++) {
    const x = 252 - i * 2.5, y = 280 + i * 15;
    add(ellipse(x + (i % 2 ? 4 : -4), y, 12, 10, 0, Math.PI * 2, 16), { fill: HAIR, color: HAIR_LINE, width: 1.5 });
  }
  add(rect(226, 378, 16, 7), { fill: '#1b1a22', width: 0 });
  add(curve([[236, 385], [228, 405], [236, 425]]), { color: HAIR_LINE, width: 10 });
  add(curve([[236, 385], [228, 405], [236, 425]]), { color: HAIR, width: 7 });

  // 左袖（画面左、ランタンを掲げる腕）
  add(curve([[245, 285], [200, 300], [165, 380], [95, 460], [50, 560], [120, 585], [170, 540], [215, 420]], true),
      { fill: CLOTH, color: LINE, width: 2 });
  add(curve([[50, 560], [70, 545], [90, 565], [110, 548], [130, 570], [150, 552], [170, 540]]), { color: CLOTH_SHADE, width: 2 });
  // 前腕と手（持ち手を握る）
  add(curve([[95, 470], [100, 380], [108, 345], [135, 345], [140, 400], [150, 470]], true), { fill: SKIN, color: '#c9b2b0', width: 1.5 });
  add(curve([[100, 350], [98, 325], [115, 318], [138, 325], [140, 348]], true), { fill: SKIN, color: '#b8a3a0', width: 1.5 });
  add(curve([[112, 322], [110, 300], [118, 296], [122, 320]]), { color: '#b8a3a0', width: 1.5 });

  // ランタン
  add(ellipse(115, 368, 44, 42, Math.PI * 1.05, Math.PI * 1.95, 20), { color: '#1b1a22', width: 4 });
  add(rect(96, 362, 38, 16), { fill: '#1b1a22', width: 0 });
  add(rect(84, 378, 62, 14), { fill: '#2a2833', color: '#111', width: 1.5 });
  add(curve([[74, 400], [70, 470], [76, 540], [154, 540], [160, 470], [156, 400]]), { fill: '#e2dcec', color: '#1b1a22', width: 3 });
  add(ellipse(115, 470, 30, 50, 0, Math.PI * 2, 24), { fill: '#ffffff', width: 0, alpha: 0.7 });
  add(curve([[115, 440], [105, 470], [115, 500], [125, 470]], true), { fill: '#e6c6e6', width: 0 });
  add([[80, 430], [150, 500]], { color: '#1b1a22', width: 3 });
  add([[150, 430], [80, 500]], { color: '#1b1a22', width: 3 });
  add(curve([[60, 400], [56, 470], [62, 548]]), { color: '#1b1a22', width: 6 });
  add(curve([[170, 400], [174, 470], [168, 548]]), { color: '#1b1a22', width: 6 });
  add(rect(68, 540, 94, 32), { fill: '#1b1a22', width: 0 });
  add(rect(80, 546, 70, 6), { fill: '#4a4458', width: 0 });

  (window.AI_DRAWINGS ||= []).push({ id: 'moonlight-copy', title: '模写：月下のランタン', width: W, height: H, strokes: S });
})();
