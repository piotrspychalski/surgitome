/* =====================================================================
   WĄTROBA: schematyczny model z segmentami Couinauda i strukturami wnęki
   Kształt: funkcja odległości (SDF) z elipsoid połączonych gładko, ścięta powierzchnią trzewną, z rowkiem IVC i dołem pęcherzyka.
   Segmenty: podział płaszczyznami (Couinaud 1957; nazewnictwo Brisbane 2000, Strasberg 2005):
   — płaszczyzna Cantliego (żyła wątrobowa pośrodkowa, od dołu pęcherzyka do IVC): prawa / lewa wątroba,
   — płaszczyzna żyły wątrobowej prawej: sektor przedni (V, VIII) / tylny (VI, VII),
   — szczelina pępkowa (więzadło obłe): segment IV / sekcja boczna lewa (II, III),
   — płaszczyzna żyły wątrobowej lewej: segment II (tylno-górny) / III (przednio-dolny),
   — płaszczyzna wrotna (poziom podziału żyły wrotnej): segmenty górne (VII, VIII, IVa) / dolne (VI, V, IVb),
   — segment I (płat ogoniasty): między IVC a wnęką, drenaż bezpośrednio do IVC.
   Powierzchnie: siatka „surface nets” na regularnej siatce próbek; geometria liczona raz (leniwie) i zapamiętana.
   Współrzędne jak w całym SURGITOME: x+ lewa strona chorego, y+ dogłowowo, z+ do przodu; 1 j. ≈ 1 cm.
   ===================================================================== */
(function (root) {
  'use strict';
  var A = root.ANAT, THREE = root.THREE;

  function ell(x, y, z, c, r) { var a = (x - c[0]) / r[0], b = (y - c[1]) / r[1], d = (z - c[2]) / r[2]; return (Math.sqrt(a * a + b * b + d * d) - 1) * Math.min(r[0], r[1], r[2]); }
  function smin(a, b, k) { var h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; }
  function smax(a, b, k) { return -smin(-a, -b, k); }

  // bryła wątroby
  var E_RL = [[-4.6, 0.2, -0.3], [6.6, 6.4, 6.0]], E_DOME = [[-0.5, 2.0, -0.6], [5.5, 4.6, 5.3]], E_Q = [[0.5, -1.0, 1.5], [4.5, 3.2, 3.8]],
    E_LL = [[4.4, 1.6, 0.4], [5.8, 2.8, 4.4]], E_LT = [[8.6, 2.2, 0.4], [2.8, 1.4, 2.8]], E_CAUD = [[0.0, -1.4, -3.4], [2.6, 3.3, 1.9]];
  var VN = [0.28, -0.85, -0.45], VP = [-2, -4.3, 0];          // powierzchnia trzewna (normalna na zewnątrz: w dół, do tyłu, w lewo)
  var IVC_X = -1.6, IVC_Z = -4.6, IVC_R = 1.1;
  var GB = [[-2.5, -5.4, 3.7], [-2.3, -4.7, 2.6], [-1.9, -4.1, 1.5], [-1.6, -4.3, 0.8]]; // pęcherzyk: dno → szyjka
  function gbR(t) { return t < 0.75 ? 1.0 - 0.15 * t : 0.89 - 1.6 * (t - 0.75); }
  var GBS = null;                                               // próbki osi pęcherzyka
  function gbDist(x, y, z) {
    if (!GBS) { var c = new THREE.CatmullRomCurve3(GB.map(function (p) { return new THREE.Vector3().fromArray(p); }), false, 'centripetal'); GBS = []; for (var s = 0; s <= 24; s++) GBS.push(c.getPointAt(s / 24).toArray()); }
    var best = 1e9, bt = 0;
    for (var i = 0; i <= 24; i++) { var p = GBS[i], dx = x - p[0], dy = y - p[1], dz = z - p[2], d = dx * dx + dy * dy + dz * dz; if (d < best) { best = d; bt = i / 24; } }
    return Math.sqrt(best) - gbR(bt);
  }
  function liverSDF(x, y, z) {
    var d = smin(ell(x, y, z, E_RL[0], E_RL[1]), ell(x, y, z, E_DOME[0], E_DOME[1]), 2.0);
    d = smin(d, ell(x, y, z, E_Q[0], E_Q[1]), 1.6); d = smin(d, ell(x, y, z, E_LL[0], E_LL[1]), 2.0); d = smin(d, ell(x, y, z, E_LT[0], E_LT[1]), 1.5);
    d = smax(d, (x - VP[0]) * VN[0] + (y - VP[1]) * VN[1] + (z - VP[2]) * VN[2], 1.2);
    var dx = x - IVC_X, dz = z - IVC_Z; d = smax(d, -(Math.sqrt(dx * dx + dz * dz) - IVC_R - 0.12), 0.35);
    d = smax(d, -(gbDist(x, y, z) - 0.1), 0.3);
    return d;
  }
  // płaszczyzny podziału (wartość ze znakiem ≈ odległość)
  function planes(x, y, z) {
    return {
      C: (x + 0.08 * z + 1.72) / 1.0032,                        // < 0: prawa wątroba (Cantlie, MHV)
      R: 0.665 * (x + 2.4) + 0.748 * (z + 4.4),                 // < 0: sektor tylny prawy (RHV)
      P: x < 0 ? y - 0.2 : y - 0.9,                             // > 0: segmenty górne (płaszczyzna wrotna; po lewej niżej — IVa/IVb)
      U: (x - 2.6 - 0.1 * y) / 1.005,                           // > 0: sekcja boczna lewa (szczelina pępkowa)
      L: 0.55 * (y - 2.0) - 0.835 * (z - 0.4),                  // > 0: segment II, < 0: III (LHV)
      K: ell(x, y, z, E_CAUD[0], E_CAUD[1])                     // < 0: segment I
    };
  }
  var SEGS = ['1', '2', '3', '4a', '4b', '5', '6', '7', '8'];
  // obszar segmentu: < 0 wewnątrz (przecięcie półprzestrzeni); k > 0 — zaokrąglone krawędzie (bryły segmentów), k = 0 — ostre (przydział punktu)
  function mx(k, a, b, c, d) { var f = k ? function (x, y) { return smax(x, y, k); } : Math.max, r = f(a, b); if (c !== undefined) r = f(r, c); if (d !== undefined) r = f(r, d); return r; }
  function region(s, q, k) {
    var nk = -q.K; k = k || 0;
    switch (s) {
      case '1': return q.K;
      case '2': return mx(k, -q.U, -q.L, nk);
      case '3': return mx(k, -q.U, q.L, nk);
      case '4a': return mx(k, -q.C, q.U, -q.P, nk);
      case '4b': return mx(k, -q.C, q.U, q.P, nk);
      case '5': return mx(k, q.C, -q.R, q.P, nk);
      case '8': return mx(k, q.C, -q.R, -q.P, nk);
      case '6': return mx(k, q.C, q.R, q.P, nk);
      case '7': return mx(k, q.C, q.R, -q.P, nk);
    }
  }
  // kierunki rozsuwania segmentów (od wnęki i IVC na zewnątrz)
  var DIR = { '1': [0.35, -0.75, -0.55], '2': [0.75, 0.6, -0.25], '3': [0.8, -0.35, 0.5], '4a': [0.15, 0.8, 0.55], '4b': [0.1, -0.45, 0.9],
    '5': [-0.45, -0.5, 0.75], '6': [-0.85, -0.5, 0.05], '7': [-0.7, 0.55, -0.45], '8': [-0.35, 0.85, 0.35] };
  Object.keys(DIR).forEach(function (k) { var v = DIR[k], n = Math.hypot(v[0], v[1], v[2]); DIR[k] = [v[0] / n, v[1] / n, v[2] / n]; });
  var EXPLODE = 3.2;

  /* ---------- surface nets: siatka trójkątów z pola wartości (ujemne = wnętrze) ---------- */
  var EDGES = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  function surfNets(F, G) {
    var nx = G.nx, ny = G.ny, nz = G.nz, h = G.h, o = G.o, cx = nx - 1, cy = ny - 1;
    var vmap = new Int32Array(cx * cy * (nz - 1)).fill(-1), pos = [], nor = [], idx = [], v = new Float32Array(8), nv = 0;
    for (var k = 0; k < nz - 1; k++) for (var j = 0; j < ny - 1; j++) for (var i = 0; i < nx - 1; i++) {
      var neg = 0;
      for (var c = 0; c < 8; c++) { v[c] = F[(i + (c & 1)) + nx * ((j + ((c >> 1) & 1)) + ny * (k + ((c >> 2) & 1)))]; if (v[c] < 0) neg++; }
      if (neg === 0 || neg === 8) continue;
      var sx = 0, sy = 0, sz = 0, n = 0;
      for (var e = 0; e < 12; e++) {
        var a = EDGES[e][0], b = EDGES[e][1];
        if ((v[a] < 0) === (v[b] < 0)) continue;
        var t = v[a] / (v[a] - v[b]);
        sx += (a & 1) + ((b & 1) - (a & 1)) * t; sy += ((a >> 1) & 1) + (((b >> 1) & 1) - ((a >> 1) & 1)) * t; sz += ((a >> 2) & 1) + (((b >> 2) & 1) - ((a >> 2) & 1)) * t; n++;
      }
      pos.push(o[0] + (i + sx / n) * h, o[1] + (j + sy / n) * h, o[2] + (k + sz / n) * h);
      var gx = (v[1] - v[0]) + (v[3] - v[2]) + (v[5] - v[4]) + (v[7] - v[6]), gy = (v[2] - v[0]) + (v[3] - v[1]) + (v[6] - v[4]) + (v[7] - v[5]), gz = (v[4] - v[0]) + (v[5] - v[1]) + (v[6] - v[2]) + (v[7] - v[3]);
      var gl = Math.hypot(gx, gy, gz) || 1; nor.push(gx / gl, gy / gl, gz / gl);
      vmap[i + cx * (j + cy * k)] = nv++;
    }
    function cell(i, j, k) { return vmap[i + cx * (j + cy * k)]; }
    function quad(a, b, c, d, flip) { if (a < 0 || b < 0 || c < 0 || d < 0) return; if (flip) idx.push(a, c, b, a, d, c); else idx.push(a, b, c, a, c, d); }
    for (k = 1; k < nz - 1; k++) for (j = 1; j < ny - 1; j++) for (i = 1; i < nx - 1; i++) {
      var f0 = F[i + nx * (j + ny * k)] < 0;
      if (i < nx - 1 && f0 !== (F[i + 1 + nx * (j + ny * k)] < 0)) quad(cell(i, j - 1, k - 1), cell(i, j, k - 1), cell(i, j, k), cell(i, j - 1, k), !f0);
      if (j < ny - 1 && f0 !== (F[i + nx * (j + 1 + ny * k)] < 0)) quad(cell(i - 1, j, k - 1), cell(i - 1, j, k), cell(i, j, k), cell(i, j, k - 1), !f0);
      if (k < nz - 1 && f0 !== (F[i + nx * (j + ny * (k + 1))] < 0)) quad(cell(i - 1, j - 1, k), cell(i, j - 1, k), cell(i, j, k), cell(i - 1, j, k), !f0);
    }
    return { pos: new Float32Array(pos), nor: new Float32Array(nor), idx: new Uint32Array(idx) };
  }

  /* ---------- naczynia i drogi żółciowe ----------
     kind: pv — żyła wrotna, ha — tętnica, bd — przewód żółciowy, hv — żyły wątrobowe, ivc, gb — pęcherzyk
     seg: przynależność punktów (rozsuwanie: punkt przesuwa się o średnie przesunięcie wymienionych segmentów; '' — nieruchomy) */
  var B = [-0.6, -3.0, -1.0];                                   // podział żyły wrotnej we wnęce
  var PV_TREE = [
    { id: 'pv', name: 'Żyła wrotna (PV)', pts: [[4.2, -9.6, 1.0], [2.5, -7.3, 0.4], [0.8, -5.0, -0.4], B], seg: ['', '', '', ''], r: [0.75, 0.62], at: 0.35 },
    { id: 'rpv', name: 'Gałąź prawa żyły wrotnej', pts: [B, [-2.0, -2.9, -1.1], [-3.2, -2.7, -1.0]], seg: ['', '', '5,6,7,8'], r: [0.55, 0.48], at: 0.55 },
    { id: 'rapv', pts: [[-3.2, -2.7, -1.0], [-4.0, -2.2, 0.4]], seg: ['5,6,7,8', '5,8'], r: [0.4, 0.36], sub: '5,8' },
    { id: 'p8', pts: [[-4.0, -2.2, 0.4], [-4.4, 0.8, 0.8], [-4.6, 3.2, 0.6]], seg: ['5,8', '8', '8'], r: [0.3, 0.18], sub: '8' },
    { id: 'p5', pts: [[-4.0, -2.2, 0.4], [-4.0, -3.4, 2.0], [-4.0, -4.0, 3.2]], seg: ['5,8', '5', '5'], r: [0.28, 0.16], sub: '5' },
    { id: 'rppv', pts: [[-3.2, -2.7, -1.0], [-5.0, -2.6, -2.0]], seg: ['5,6,7,8', '6,7'], r: [0.4, 0.36], sub: '6,7' },
    { id: 'p7', pts: [[-5.0, -2.6, -2.0], [-6.6, 0.9, -2.6], [-7.2, 3.0, -2.4]], seg: ['6,7', '7', '7'], r: [0.3, 0.18], sub: '7' },
    { id: 'p6', pts: [[-5.0, -2.6, -2.0], [-7.0, -3.4, -1.6], [-8.6, -3.8, -1.0]], seg: ['6,7', '6', '6'], r: [0.28, 0.16], sub: '6' },
    { id: 'lpv', name: 'Gałąź lewa żyły wrotnej', pts: [B, [0.6, -3.2, -0.7], [1.8, -3.0, -0.2], [2.6, -2.5, 0.4]], seg: ['', '', '', '2,3,4a,4b'], r: [0.5, 0.42], at: 0.5 },
    { id: 'upv', pts: [[2.6, -2.5, 0.4], [2.8, -1.6, 1.4], [2.9, -0.9, 2.4]], seg: ['2,3,4a,4b', '3,4b', '3,4b'], r: [0.42, 0.34], sub: '3,4a,4b' },
    { id: 'p2', pts: [[2.6, -2.5, 0.4], [4.4, 1.8, -1.6], [6.6, 2.8, -1.4]], seg: ['2,3,4a,4b', '2', '2'], r: [0.28, 0.16], sub: '2' },
    { id: 'p3', pts: [[2.9, -0.9, 2.4], [4.6, 0.2, 2.4], [6.6, 1.2, 2.0]], seg: ['3,4b', '3', '3'], r: [0.28, 0.16], sub: '3' },
    { id: 'p4b', pts: [[2.9, -0.9, 2.4], [1.4, -2.0, 3.0], [0.0, -2.8, 3.4]], seg: ['3,4b', '4b', '4b'], r: [0.24, 0.14], sub: '4b' },
    { id: 'p4a', pts: [[2.8, -1.6, 1.4], [1.6, 1.2, 1.2], [0.6, 3.2, 0.4]], seg: ['3,4b', '4a', '4a'], r: [0.24, 0.14], sub: '4a' },
    { id: 'p1', pts: [[0.6, -3.2, -0.7], [0.4, -2.4, -2.4], [0.6, -1.4, -3.4]], seg: ['', '1', '1'], r: [0.2, 0.13], sub: '1' }
  ];
  // tętnice i przewody wewnątrzwątrobowe biegną razem z gałęziami żyły wrotnej (szypuły Glissona): kopia drzewa z przesunięciem bocznym;
  // punkt podziału liczony raz i wspólny dla gałęzi wychodzących z niego (drzewo pozostaje połączone); płat ogoniasty — tylko gałąź PV
  function companion(kind, side) {
    var seen = {};
    return PV_TREE.filter(function (b) { return b.sub && b.id !== 'p1'; }).map(function (b) {
      var pts = b.pts.map(function (p, i) {
        var key = p.join(',');
        if (seen[key]) return seen[key];
        var q = b.pts[Math.min(i + 1, b.pts.length - 1)], s = b.pts[Math.max(i - 1, 0)], t = [q[0] - s[0], q[1] - s[1], q[2] - s[2]];
        var up = [0, 0, 1], off = [t[1] * up[2] - t[2] * up[1], t[2] * up[0] - t[0] * up[2], t[0] * up[1] - t[1] * up[0]], ol = Math.hypot(off[0], off[1], off[2]);
        if (ol < 1e-3) { off = [1, 0, 0]; ol = 1; }
        var rr = b.r[0] + (b.r[1] - b.r[0]) * i / (b.pts.length - 1), k = side * (rr + (kind === 'ha' ? 0.1 : 0.12) + 0.02) / ol;
        return (seen[key] = [p[0] + off[0] * k, p[1] + off[1] * k + 0.05, p[2] + off[2] * k + 0.08]);
      });
      return { id: kind + '_' + b.id, pts: pts, seg: b.seg, r: kind === 'ha' ? [0.1, 0.06] : [0.12, 0.07], sub: b.sub };
    });
  }
  var HA_IN = companion('ha', 1), BD_IN = companion('bd', -1);
  function startOf(list, id) { return list.filter(function (b) { return b.id === id; })[0].pts[0]; }
  var HA_EX = [
    { id: 'cha', name: 'Tętnica wątrobowa wspólna (CHA)', pts: [[5.6, -9.0, -0.6], [3.9, -8.3, 1.3], [2.4, -7.4, 1.6]], seg: ['', '', ''], r: [0.26, 0.24], at: 0.4 },
    { id: 'gda', name: 'Tętnica żołądkowo-dwunastnicza', pts: [[2.4, -7.4, 1.6], [2.0, -9.0, 2.0], [1.6, -10.8, 2.0]], seg: ['', '', ''], r: [0.17, 0.15], at: 0.7 },
    { id: 'pha', name: 'Tętnica wątrobowa właściwa (PHA)', pts: [[2.4, -7.4, 1.6], [1.4, -6.2, 1.0], [0.4, -5.0, 0.4]], seg: ['', '', ''], r: [0.22, 0.2], at: 0.45 },
    { id: 'rha', name: 'Tętnica wątrobowa prawa', pts: [[0.4, -5.0, 0.4], [-0.9, -4.3, -0.3], [-2.2, -3.2, -0.5], startOf(HA_IN, 'ha_rapv')], seg: ['', '', '', '5,6,7,8'], r: [0.18, 0.15], at: 0.45 },
    { id: 'lha', name: 'Tętnica wątrobowa lewa', pts: [[0.4, -5.0, 0.4], [1.3, -4.2, 0.5], [2.2, -3.3, 0.6], startOf(HA_IN, 'ha_upv')], seg: ['', '', '', '2,3,4a,4b'], r: [0.17, 0.15], at: 0.5 }
  ];
  var CONF = [-0.9, -2.75, 0.15], CYJ = [-1.5, -6.6, 0.25];   // konfluencja przewodów wątrobowych, ujście przewodu pęcherzykowego
  var BD_EX = [
    { id: 'cbd', name: 'Przewód żółciowy wspólny (CBD)', pts: [[-0.9, -12.6, -0.7], [-1.3, -9.4, -0.2], CYJ], seg: ['', '', ''], r: [0.34, 0.34], at: 0.45 },
    { id: 'chd', name: 'Przewód wątrobowy wspólny', pts: [CYJ, [-1.2, -4.6, 0.2], CONF], seg: ['', '', ''], r: [0.32, 0.3], at: 0.5 },
    { id: 'rhd', name: 'Przewód wątrobowy prawy', pts: [CONF, [-2.2, -2.6, -0.1], startOf(BD_IN, 'bd_rapv')], seg: ['', '', '5,6,7,8'], r: [0.24, 0.22], at: 0.5 },
    { id: 'lhd', name: 'Przewód wątrobowy lewy', pts: [CONF, [0.6, -2.9, 0.5], [1.9, -2.5, 0.9], startOf(BD_IN, 'bd_upv')], seg: ['', '', '', '2,3,4a,4b'], r: [0.24, 0.22], at: 0.55 },
    { id: 'cyd', name: 'Przewód pęcherzykowy', pts: [GB[3], [-1.9, -5.0, 0.7], [-1.9, -6.0, 0.55], CYJ], seg: ['4b,5', '', '', ''], r: [0.17, 0.15], at: 0.4 }
  ];
  var HV = [
    { id: 'ivc', name: 'Żyła główna dolna (IVC)', pts: [[IVC_X, -13.5, IVC_Z + 0.2], [IVC_X, -6, IVC_Z], [IVC_X, 1, IVC_Z], [IVC_X, 5.0, IVC_Z], [IVC_X + 0.1, 8.5, IVC_Z + 0.3]], seg: ['', '', '', '', ''], r: [IVC_R, IVC_R], at: 0.2 },
    { id: 'rhv', name: 'Żyła wątrobowa prawa', pts: [[-2.4, 4.3, -4.4], [-5.5, 2.5, -1.7], [-8.3, -1.0, 0.8], [-9.0, -3.6, 1.5]], seg: ['', '7,8', '5,6,7,8', '5,6'], r: [0.62, 0.2], at: 0.35 },
    { id: 'mhv', name: 'Żyła wątrobowa pośrodkowa', pts: [[-1.25, 4.6, -3.9], [-1.5, 2.6, -1.2], [-1.9, 0.0, 1.6], [-2.1, -2.9, 3.2]], seg: ['', '4a,8', '4a,4b,5,8', '4b,5'], r: [0.55, 0.18], at: 0.4 },
    { id: 'lhv', name: 'Żyła wątrobowa lewa', pts: [[-0.8, 4.5, -4.2], [1.6, 3.9, -2.0], [4.8, 2.8, 0.9], [8.4, 2.4, 0.65]], seg: ['', '2,4a', '2,3', '2,3'], r: [0.5, 0.16], at: 0.45 }
  ];
  var GBV = { id: 'gb', name: 'Pęcherzyk żółciowy', pts: GB, seg: ['4b,5', '4b,5', '4b,5', '4b,5'], at: 0.3 };

  /* ---------- geometria: liczona raz ---------- */
  var CACHE = null;
  function liverModel(h) {
    if (CACHE && CACHE.h === (h || 0.25)) return CACHE;
    h = h || 0.25;
    var o = [-12.6, -8.6, -7.8], nx = Math.ceil(24.6 / h) + 1, ny = Math.ceil(16.8 / h) + 1, nz = Math.ceil(14.4 / h) + 1, N = nx * ny * nz;
    var Lg = new Float32Array(N), Q = { C: new Float32Array(N), R: new Float32Array(N), P: new Float32Array(N), U: new Float32Array(N), L: new Float32Array(N), K: new Float32Array(N) };
    var cen = {}, cnt = {}; SEGS.forEach(function (s) { cen[s] = [0, 0, 0]; cnt[s] = 0; });
    for (var k = 0; k < nz; k++) for (var j = 0; j < ny; j++) for (var i = 0; i < nx; i++) {
      var x = o[0] + i * h, y = o[1] + j * h, z = o[2] + k * h, n = i + nx * (j + ny * k);
      var l = (i === 0 || j === 0 || k === 0 || i === nx - 1 || j === ny - 1 || k === nz - 1) ? 1 : liverSDF(x, y, z);
      Lg[n] = l;
      var q = planes(x, y, z); for (var key in Q) Q[key][n] = q[key];
      if (l < 0) { var best = null, bv = 1e9; SEGS.forEach(function (sg) { var r = region(sg, q); if (r < bv) { bv = r; best = sg; } }); cen[best][0] += x; cen[best][1] += y; cen[best][2] += z; cnt[best]++; }
    }
    var G = { nx: nx, ny: ny, nz: nz, h: h, o: o }, whole = surfNets(Lg, G), segs = {}, F = new Float32Array(N), q2 = {};
    SEGS.forEach(function (sg) {
      for (var n = 0; n < N; n++) {
        if (Lg[n] > 0.6) { F[n] = Lg[n]; continue; }
        for (var key in Q) q2[key] = Q[key][n];
        F[n] = smax(Lg[n], region(sg, q2, 0.45) + 0.06, 0.45);
      }
      segs[sg] = surfNets(F, G);
      cen[sg] = cen[sg].map(function (v) { return v / Math.max(1, cnt[sg]); });
    });
    var vol = 0; SEGS.forEach(function (sg) { vol += cnt[sg]; });
    var share = {}; SEGS.forEach(function (sg) { share[sg] = cnt[sg] / vol; });
    CACHE = { h: h, whole: whole, segs: segs, centroid: cen, share: share };
    return CACHE;
  }

  A.LIVER = {
    sdf: liverSDF, planes: planes, region: region, model: liverModel, SEGS: SEGS, DIR: DIR, EXPLODE: EXPLODE,
    vessels: { pv: PV_TREE, ha: HA_EX.concat(HA_IN), bd: BD_EX.concat(BD_IN), hv: HV, gb: GBV }, gbR: gbR,
    box: [[-11.5, -12.5, -7], [11, 8.5, 6]]
  };

  /* ---------- pozycja na liście: kategoria „Wątroba” po trzustce i drogach żółciowych ---------- */
  var NOTES = ['Wątroba dzieli się na 8 segmentów czynnościowych (Couinaud). Każdy ma własną szypułę Glissona — gałąź żyły wrotnej, tętnicy wątrobowej i przewód żółciowy — i dlatego może być usunięty osobno.',
    'Żyły wątrobowe biegną między segmentami: pośrodkowa w płaszczyźnie Cantliego (od dołu pęcherzyka do IVC) dzieli wątrobę na prawą (V–VIII) i lewą (II–IV), prawa oddziela sektor przedni (V, VIII) od tylnego (VI, VII), lewa — segment II od III.',
    'Szczelina pępkowa (więzadło obłe) oddziela segment IV od sekcji bocznej lewej (II, III). Płaszczyzna wrotna dzieli segmenty na górne (VII, VIII, IVa) i dolne (VI, V, IVb).',
    'Segment I (płat ogoniasty) leży między IVC a wnęką; ma szypuły z obu gałęzi żyły wrotnej i drenaż żylny bezpośrednio do IVC.',
    'We wnęce: przewód żółciowy wspólny z przodu i po prawej, tętnica wątrobowa właściwa z przodu i po lewej, żyła wrotna z tyłu. Przewody wątrobowe łączą się najwyżej, żyła wrotna dzieli się niżej, tętnica — najniżej.',
    'Nazewnictwo wg Brisbane 2000 (IHPBA; Strasberg, J Hepatobiliary Pancreat Surg 2005). Schemat: kształt i granice segmentów uproszczone; w rzeczywistości płaszczyzny są pofałdowane, a odmiany naczyń częste.'];
  var LIVER_AN = { cat: 'liver', id: 'liver', short: 'Anatomia wątroby', title: 'Anatomia wątroby i segmenty Couinauda',
    sub: 'Wnęka wątroby (PV, HA, drogi żółciowe), żyły wątrobowe i IVC; segmenty I–VIII z rozsuwaniem',
    notes: NOTES, objects: [], marks: [], cutTools: [{ type: 'liver' }], anastTools: [], commonCuts: 0, mEnd: 1, single: true, box: A.LIVER.box,
    singleFrames: [
      { k: 'normal', kind: 'orbit', m0: 0, m1: 0, cam: 'front', short: 'Anatomia', title: 'Anatomia prawidłowa wątroby',
        cap: 'Miąższ przezroczysty: widać żyłę wrotną, tętnicę wątrobową i drogi żółciowe we wnęce oraz żyły wątrobowe uchodzące do IVC. Kliknij strukturę w modelu lub w legendzie, aby ją wyróżnić.' },
      { k: 'segs', kind: 'orbit', m0: 0, m1: 1, dur: 4, cam: 'front', short: 'Segmenty', title: 'Segmenty Couinauda',
        cap: 'Suwak „Rozsunięcie” rozsuwa i zsuwa segmenty. Kliknij segment (lub przycisk I–VIII), aby go wyróżnić razem z jego szypułą.' }
    ] };
  var PROC = { cat: 'liver', id: 'liver', short: LIVER_AN.short, title: LIVER_AN.title, variants: [LIVER_AN] };
  var at = 0; A.PROCS.forEach(function (p, i) { if (p.cat === 'hpb') at = i + 1; });
  A.PROCS.splice(at, 0, PROC);
  var ci = 0; A.CATS.forEach(function (c, i) { if (c.id === 'hpb') ci = i + 1; });
  A.CATS.splice(ci, 0, { id: 'liver', name: 'Wątroba' });
})(typeof window !== 'undefined' ? window : globalThis);
