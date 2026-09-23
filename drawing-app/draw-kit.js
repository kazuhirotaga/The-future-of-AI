// AIの絵で共通して使う図形ヘルパー。どれも [x, y] 点列を返す。
window.DrawKit = (() => {
  const ellipse = (cx, cy, rx, ry, a0 = 0, a1 = Math.PI * 2, n = 48) =>
    Array.from({ length: n + 1 }, (_, i) => {
      const a = a0 + (a1 - a0) * i / n;
      return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
    });
  const circle = (cx, cy, r, n) => ellipse(cx, cy, r, r, 0, Math.PI * 2, n);
  const rect = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];
  // Catmull-Rom で制御点をなめらかにつなぐ（手描きの曲線用）
  const curve = (pts, closed = false, seg = 8) => {
    const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
    const out = [];
    for (let i = 1; i < p.length - 2; i++) {
      for (let t = 0; t < seg; t++) {
        const s = t / seg, s2 = s * s, s3 = s2 * s;
        out.push([0, 1].map(k => 0.5 * (2 * p[i][k] + (-p[i - 1][k] + p[i + 1][k]) * s +
          (2 * p[i - 1][k] - 5 * p[i][k] + 4 * p[i + 1][k] - p[i + 2][k]) * s2 +
          (-p[i - 1][k] + 3 * p[i][k] - 3 * p[i + 1][k] + p[i + 2][k]) * s3)));
      }
    }
    out.push(closed ? out[0] : pts[pts.length - 1]);
    return out;
  };
  const canvas = () => {
    const strokes = [];
    const add = (points, o = {}) => strokes.push({
      color: o.color ?? '#2b2b2b', width: o.width ?? 3, fill: o.fill, alpha: o.alpha, points,
    });
    return { strokes, add };
  };
  return { ellipse, circle, rect, curve, canvas };
})();
