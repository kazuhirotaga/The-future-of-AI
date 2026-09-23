// 「眠らない同僚」— 夜の丘で、明かりの灯る家を見守る小さなロボット。
// すべて {color, width, fill?, points} のストロークで、人間のペンと同じ経路で描かれる。
(() => {
  const { ellipse, circle, rect } = DrawKit;
  const { strokes: S, add } = DrawKit.canvas();
  const hill = (y0, amp, freq, phase) => {
    const p = [[0, 560]];
    for (let x = 0; x <= 800; x += 10) p.push([x, y0 + amp * Math.sin(x * freq + phase)]);
    p.push([800, 560]);
    return p;
  };

  // 夜空
  add(rect(0, 0, 800, 560), { fill: '#1d2645', width: 0 });
  add(rect(0, 300, 800, 260), { fill: '#27335a', width: 0, alpha: 0.6 });

  // 星（小さな十字）
  const stars = [[60, 50], [140, 120], [230, 40], [330, 90], [420, 30], [470, 150], [560, 70],
                 [700, 40], [760, 130], [620, 180], [90, 210], [300, 200], [380, 250]];
  stars.forEach(([x, y], i) => {
    const r = i % 3 === 0 ? 6 : 4;
    add([[x - r, y], [x + r, y]], { color: '#f6e7a8', width: 2 });
    add([[x, y - r], [x, y + r]], { color: '#f6e7a8', width: 2 });
  });

  // 三日月
  add(ellipse(640, 110, 50, 50, -Math.PI * 0.62, Math.PI * 0.62)
        .concat(ellipse(662, 110, 40, 44, Math.PI * 0.55, -Math.PI * 0.55)),
      { fill: '#f6e7a8', color: '#f0d77a', width: 2 });

  // 丘（奥 → 手前）
  add(hill(360, 18, 0.008, 1.0), { fill: '#2f4a3f', width: 0 });
  add(hill(420, 22, 0.006, 3.2), { fill: '#3b5e4c', width: 0 });

  // 家
  add(rect(120, 300, 150, 110), { fill: '#6b4f3a', color: '#3a2a1f', width: 3 });
  add([[105, 305], [195, 235], [285, 305], [105, 305]], { fill: '#8e3b2e', color: '#3a2a1f', width: 3 });
  add(rect(230, 245, 20, 40), { fill: '#5a3d2e', color: '#3a2a1f', width: 2 }); // 煙突
  add(rect(145, 325, 45, 40), { fill: '#ffd86b', color: '#3a2a1f', width: 3 }); // 灯る窓
  add([[167, 325], [167, 365]], { color: '#3a2a1f', width: 2 });
  add([[145, 345], [190, 345]], { color: '#3a2a1f', width: 2 });
  add(rect(210, 345, 36, 65), { fill: '#4a3325', color: '#3a2a1f', width: 3 }); // 扉
  add(circle(238, 380, 2.5, 12), { fill: '#ffd86b', width: 0 });
  // 窓の光
  add(ellipse(167, 345, 60, 45), { fill: '#ffd86b', width: 0, alpha: 0.12 });
  // 煙
  add(Array.from({ length: 30 }, (_, i) => [240 + 10 * Math.sin(i / 3), 240 - i * 3]),
      { color: '#9aa3b8', width: 4, alpha: 0.6 });

  // ロボット（丘の上、家を見守る）
  const rx = 560, ry = 330;
  add([[rx - 18, ry + 90], [rx - 18, ry + 125]], { color: '#8f9bb0', width: 10 }); // 脚
  add([[rx + 18, ry + 90], [rx + 18, ry + 125]], { color: '#8f9bb0', width: 10 });
  add(rect(rx - 32, ry + 122, 28, 10), { fill: '#5d6780', color: '#3d4458', width: 2 });
  add(rect(rx + 4, ry + 122, 28, 10), { fill: '#5d6780', color: '#3d4458', width: 2 });
  add(rect(rx - 40, ry + 20, 80, 72), { fill: '#c9d3e3', color: '#3d4458', width: 3 }); // 胴体
  add(circle(rx, ry + 55, 12, 24), { fill: '#e07a5f', color: '#3d4458', width: 2 });      // 胸のハート代わりのランプ
  add(rect(rx - 34, ry - 45, 68, 58), { fill: '#dfe6f1', color: '#3d4458', width: 3 }); // 頭
  add([[rx - 4, ry + 13], [rx - 4, ry + 20]], { color: '#3d4458', width: 6 });          // 首
  add([[rx, ry - 45], [rx, ry - 68]], { color: '#3d4458', width: 3 });                  // アンテナ
  add(circle(rx, ry - 72, 6, 16), { fill: '#ffd86b', color: '#3d4458', width: 2 });
  add(circle(rx - 14, ry - 20, 7, 16), { fill: '#6fd3ff', color: '#3d4458', width: 2 });  // 目
  add(circle(rx + 14, ry - 20, 7, 16), { fill: '#6fd3ff', color: '#3d4458', width: 2 });
  add(ellipse(rx, ry - 4, 12, 7, 0.15 * Math.PI, 0.85 * Math.PI, 16), { color: '#3d4458', width: 3 }); // 笑顔
  add(circle(rx - 24, ry - 6, 5, 12), { fill: '#f4a6a6', width: 0, alpha: 0.7 });       // ほっぺ
  add(circle(rx + 24, ry - 6, 5, 12), { fill: '#f4a6a6', width: 0, alpha: 0.7 });
  // 右腕：下ろしている
  add([[rx + 40, ry + 30], [rx + 58, ry + 60], [rx + 60, ry + 82]], { color: '#8f9bb0', width: 9 });
  // 左腕：家に向けて手を振る
  add([[rx - 40, ry + 30], [rx - 68, ry + 10], [rx - 80, ry - 22]], { color: '#8f9bb0', width: 9 });
  add(circle(rx - 82, ry - 28, 8, 16), { fill: '#c9d3e3', color: '#3d4458', width: 2 });
  add(ellipse(rx - 82, ry - 28, 20, 20, -Math.PI * 0.9, -Math.PI * 0.6, 8), { color: '#f6e7a8', width: 2 });
  add(ellipse(rx - 82, ry - 28, 28, 28, -Math.PI * 0.9, -Math.PI * 0.6, 8), { color: '#f6e7a8', width: 2 });

  // 手前の草
  for (let x = 20; x < 800; x += 38) {
    const y = 520 + 8 * Math.sin(x);
    add([[x, y + 20], [x - 6, y]], { color: '#5f8a63', width: 3 });
    add([[x, y + 20], [x + 7, y - 4]], { color: '#5f8a63', width: 3 });
  }

  (window.AI_DRAWINGS ||= []).push({ id: 'nemuranai', title: '眠らない同僚', width: 800, height: 560, strokes: S });
})();
