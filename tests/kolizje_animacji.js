// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Kolizje w trakcie animacji: pary narządów, które NIE przenikają się na początku ani na końcu, a przenikają w trakcie przemiany
globalThis.THREE = require('three'); require(process.env.CORE || require('path').join(__dirname,'../dist/core.js'));
const A = ANAT, K = 60;
// celowe: rękaw/zbiornik rysowane wewnątrz żołądka przed odcięciem; szczyt pętli ileostomii łączy oba ramiona
const ALLOW = [['gspec', 'stom'], ['spec', 'sleeve'], ['sleeve', 'duo'], ['stom', 'pouch'], ['prox', 'apex'], ['dist', 'apex']];
function kf(arr, m, def) { if (!arr) return def; if (m <= arr[0][0]) return arr[0][1]; for (let i = 1; i < arr.length; i++) if (m <= arr[i][0]) { const a = arr[i - 1], b = arr[i]; if (Array.isArray(a[1])) return a[1].map((x, k) => x + (b[1][k] - x) * (m - a[0]) / (b[0] - a[0])); return a[1] + (b[1] - a[1]) * (m - a[0]) / (b[0] - a[0]); } return arr[arr.length - 1][1]; }
const sm = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const cache = new Map();
function samples(o, f) {
  const pre = o.pre, post = o.post || o.pre;
  let ab = cache.get(o); if (!ab) { ab = [A.curveOf(pre.path).getSpacedPoints(K - 1), A.curveOf(post.path).getSpacedPoints(K - 1)]; cache.set(o, ab); }
  const lf = o.lift, s = lf ? Math.sin(Math.PI * f) : 0;
  return ab[0].map((p, i) => { const t = i / (K - 1), q = p.clone().lerp(ab[1][i], f);
    if (s) { const h = Math.min(lf.max, lf.k * p.distanceTo(ab[1][i])) * s; q.x += lf.dir[0] * h; q.y += lf.dir[1] * h; q.z += lf.dir[2] * h; }
    return [q, pre.r(t) + (post.r(t) - pre.r(t)) * f]; });
}
function state(an, m) {
  const S = {};
  for (const o of an.objects) {
    if (o.solid) continue;
    if (kf(o.opacity, m, 1) < 0.5) continue;
    const f = o.morph ? sm((m - o.morph[0]) / (o.morph[1] - o.morph[0])) : 0, off = kf(o.offset, m, [0, 0, 0]);
    S[o.id] = samples(o, f).map(([p, r]) => [p.clone().add(new THREE.Vector3(...off)), r]);
  }
  return S;
}
function pen(a, b) { let mm = 1e9; for (const [p, r] of a) for (const [q, r2] of b) { const d = p.distanceTo(q) - r - r2; if (d < mm) mm = d; } return mm; }
const only = process.argv[2]; let total = 0;
module.exports = { state, pen, kf };
if (require.main !== module) return;
for (const an of [].concat(...A.PROCS.map(p => p.variants), ...(A.TRIALS || []).filter(t => !A.PROCS.includes(t)).map(t => t.variants))) {
  if (only && !an.id.startsWith(only)) continue;
  const m0 = 0, m1 = an.mEnd, S0 = state(an, m0), S1 = state(an, m1), worst = {};
  for (let i = 1; i < 40; i++) {
    const m = m0 + (m1 - m0) * i / 40, S = state(an, m), ids = Object.keys(S);
    for (let x = 0; x < ids.length; x++) for (let y = x + 1; y < ids.length; y++) {
      const a = ids[x], b = ids[y], key = a + '×' + b;
      const base = Math.min(S0[a] && S0[b] ? pen(S0[a], S0[b]) : 9, S1[a] && S1[b] ? pen(S1[a], S1[b]) : 9);
      if (base < 0.05) continue; // przenikają się na początku lub na końcu = celowe połączenie (zespolenie, ciągłość)
      if (ALLOW.some(p => (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a))) continue;
      const d = pen(S[a], S[b]);
      if (d < -0.35 && (!worst[key] || d < worst[key][0])) worst[key] = [d, m];
    }
  }
  const w = Object.entries(worst).sort((p, q) => p[1][0] - q[1][0]);
  total += w.length;
  console.log(an.id + ': ' + (w.length ? w.map(([k, [d, m]]) => `${k} ${d.toFixed(2)} @m=${m.toFixed(2)}`).join('; ') : 'bez kolizji'));
}
console.log('RAZEM par z przenikaniem w trakcie animacji:', total);
