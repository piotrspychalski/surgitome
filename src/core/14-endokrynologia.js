/* =====================================================================
   ENDOKRYNOLOGIA — SZYJA: tarczyca, przytarczyce, nerwy krtaniowe (wsteczne, gałąź zewnętrzna nerwu krtaniowego górnego), naczynia tarczowe,
   tchawica, krtań, przełyk, pochewki szyjne, mięśnie podgnykowe i mostkowo-obojczykowo-sutkowe; węzły przedziału centralnego (VI) i bocznego
   (II–V, strona lewa); grasica szyjna; przedramię (autoprzeszczep przytarczyc). Narzędzie TOOL_EXT.neck (src/app/12-szyja.js).
   Układ: x+ lewa strona chorego, y+ dogłowowo, z+ do przodu; 1 j. ≈ 1 cm. Tchawica w osi (x 0, z 0, promień 1,0), łuk chrząstki pierścieniowatej
   y 1,4–2,0, chrząstka tarczowata y 2,6–6,0, kość gnykowa y 7,6, wcięcie jarzmowe mostka y −5,0; cieśń y −0,6–0,9 (pierścienie 2–4).
   Przebiegi opisane dla strony prawej (x < 0); strona lewa — odbicie (z wyjątkiem nerwów krtaniowych wstecznych i naczyń u podstawy szyi).
   Oś czasu m zabiegu: fazy d.T (np. acc — dostęp, sup — biegun górny, mid — żyła środkowa i przytarczyce, rln — nerw krtaniowy wsteczny,
   rem — usunięcie płata, left — płat lewy, cnd — limfadenektomia centralna, lnd — boczna; przytarczyce: exp, expR, expL, rem, rest, rem3, rem4,
   thym, pth, at).
   Źródła: Haugen i wsp., Thyroid 2016 (ATA 2015); Randolph i wsp., Laryngoscope 2011 (IONM); Cernea i wsp., Head Neck 1992 (EBSLN);
   Carty i wsp., Thyroid 2009 (przedział VI); Stack i wsp., Thyroid 2012 (limfadenektomia boczna); Wilhelm i wsp., JAMA Surg 2016 (AAES);
   Irvin i wsp. (PTH śródoperacyjny); Åkerström i wsp., Surgery 1984 (położenie przytarczyc); Wells i wsp. (autoprzeszczep do przedramienia).
   ===================================================================== */
(function (root) {
  'use strict';
  var A = root.ANAT;
  function smin(a, b, k) { var h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; }
  function sm(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
  // łamana: odległość punktu i parametr długości łuku (0–1) najbliższego punktu
  function poly(P) { var S = [], L = 0; for (var i = 0; i < P.length - 1; i++) { var a = P[i], b = P[i + 1], d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], l = Math.hypot(d[0], d[1], d[2]); S.push({ a: a, d: d, l: l, s: L }); L += l; } return { S: S, L: L }; }
  function near(Q, x, y, z) {
    var best = 1e9, u = 0;
    for (var i = 0; i < Q.S.length; i++) {
      var s = Q.S[i], t = ((x - s.a[0]) * s.d[0] + (y - s.a[1]) * s.d[1] + (z - s.a[2]) * s.d[2]) / (s.l * s.l); t = t < 0 ? 0 : t > 1 ? 1 : t;
      var px = s.a[0] + s.d[0] * t - x, py = s.a[1] + s.d[1] * t - y, pz = s.a[2] + s.d[2] * t - z, dd = px * px + py * py + pz * pz;
      if (dd < best) { best = dd; u = (s.s + s.l * t) / Q.L; }
    }
    return { d: Math.sqrt(best), u: u };
  }
  function ell(x, y, z, c, r) { var a = (x - c[0]) / r[0], b = (y - c[1]) / r[1], d = (z - c[2]) / r[2]; return (Math.sqrt(a * a + b * b + d * d) - 1) * Math.min(r[0], r[1], r[2]); }
  function mir(P, s) { return P.map(function (p) { return [p[0] * s, p[1], p[2]]; }); }   // s = −1: strona prawa (przebiegi zapisane dla x > 0)

  /* ---------- skóra szyi: walec eliptyczny (szerszy ku żuchwie), wyniosłość krtaniowa, wcięcie jarzmowe ---------- */
  var SKIN = { zc: -2.3, b: 5.5, y0: -6.6, y1: 10.2 };
  function skinA(y) { return 6.1 + 0.9 * sm((y - 4) / 6); }
  function skinZ(x, y) {
    var a = skinA(y), q = Math.max(0, 1 - (x / a) * (x / a));
    return SKIN.zc + SKIN.b * Math.sqrt(q) + 0.32 * Math.exp(-(x * x / 0.7 + (y - 5.2) * (y - 5.2) / 1.6)) - 0.45 * Math.exp(-(x * x / 1.1 + (y + 5.0) * (y + 5.0) / 0.35))
      + 0.22 * Math.exp(-((y + 5.5) * (y + 5.5)) / 0.18) * sm((Math.abs(x) - 1.2) / 0.6);   // obojczyki
  }

  /* ---------- tarczyca: płaty (kapsuła o zmiennym promieniu wzdłuż łamanej), cieśń (pas na przedniej ścianie tchawicy), płat piramidowy,
     guzek Zuckerkandla; odjęte tchawica, chrząstka pierścieniowata, blaszki chrząstki tarczowatej i przełyk ---------- */
  var LOBE = [[2.15, -1.8, 0.25], [2.25, 0.6, 0.15], [1.95, 3.4, -0.15]], LQ = { '-1': poly(mir(LOBE, -1)), '1': poly(LOBE) };
  var PYR = poly([[0.3, 0.8, 1.5], [0.4, 2.2, 1.56], [0.5, 3.5, 1.78]]);
  function lobeR(u) { return 0.22 + 0.83 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.32 + 0.68 * u)), 0.8); }
  function zf(y) { return 1.25 + 0.4 * sm((y - 2.6) / 3); }            // przednia krawędź chrząstki tarczowatej (wyniosłość krtaniowa wyżej)
  function lamina(x, y, z) {                                         // odległość od blaszki chrząstki tarczowatej (dodatnia na zewnątrz, przednio-bocznie)
    var s = x < 0 ? -1 : 1, z0 = zf(y), dx = s * 2.25, dz = -0.75 - z0, l = Math.hypot(dx, dz), nx = -s * dz / l * -1, nz = s * dx / l * s;
    nx = s * Math.abs(dz) / l; nz = Math.abs(dx) / l;   // normalna: bocznie i do przodu
    return (x * nx + (z - z0) * nz);
  }
  function carve(d, x, y, z) {
    var rt = Math.hypot(x, z);
    if (y < 1.45) d = Math.max(d, 1.1 - rt);                          // tchawica
    else if (y < 2.1) d = Math.max(d, 1.3 - rt);                      // chrząstka pierścieniowata
    if (y > 2.0 && y < 6.4 && Math.abs(x) < 2.5) d = Math.max(d, 0.08 - lamina(x, y, z));
    var e = Math.hypot(x - 0.35, (z + 1.75) / 0.72) - 1.0; d = Math.max(d, -e);   // przełyk
    return d;
  }
  function lobeD(s, x, y, z) {
    var q = near(LQ[s], x, y, z), d = q.d - lobeR(q.u);
    return smin(d, Math.hypot(x - s * 1.62, y - 1.05, z + 0.75) - 0.42, 0.35);   // guzek Zuckerkandla (tylno-przyśrodkowo, na wysokości wejścia RLN)
  }
  function isthD(x, y, z) {
    var rho = Math.hypot(x, z), phi = Math.atan2(x, z), dr = Math.abs(rho - 1.32) - 0.3, dy = Math.abs(y - 0.15) - 0.72, dp = (Math.abs(phi) - 1.05) * 1.32;
    var o = Math.sqrt(Math.pow(Math.max(dr, 0), 2) + Math.pow(Math.max(dy, 0), 2) + Math.pow(Math.max(dp, 0), 2)) + Math.min(Math.max(dr, dy, dp), 0) - 0.06;
    var p = near(PYR, x, y, z); return smin(o, p.d - (0.2 - 0.1 * p.u), 0.25);
  }
  // part: 'all' | 'R' (płat prawy) | 'L' | 'I' (cieśń z płatem piramidowym); granica płat–cieśń: |x| = 1,0
  function thyroid(x, y, z, part) {
    var d = smin(smin(lobeD(-1, x, y, z), lobeD(1, x, y, z), 0.3), isthD(x, y, z), 0.5);
    d = carve(d, x, y, z);
    if (part === 'R') d = Math.max(d, x + 1.0); else if (part === 'L') d = Math.max(d, 1.0 - x); else if (part === 'I') d = Math.max(d, Math.abs(x) - 1.0);
    return d;
  }

  /* ---------- przebiegi (strona prawa; odbicie dla lewej) ---------- */
  var P = {
    cca: { R: [[-1.7, -7.4, 0.5], [-2.9, -6.0, -0.2], [-3.45, -3, -0.55], [-3.5, 2, -0.6], [-3.45, 6.2, -0.55]], L: [[2.6, -8.2, -1.2], [3.2, -5.5, -0.8], [3.45, -2, -0.6], [3.5, 2, -0.6], [3.45, 6.2, -0.55]] },
    ica: [[3.45, 6.2, -0.55], [3.85, 8.2, -1.1], [4.0, 11, -1.9]], eca: [[3.45, 6.2, -0.55], [3.2, 8.2, -0.15], [3.3, 10.8, 0.1]],
    ijv: [[4.4, -6.1, -0.2], [4.6, -3, -0.3], [4.6, 3, -0.3], [4.5, 7.5, -0.6], [4.6, 11, -1.6]],
    scv: [[4.4, -6.1, -0.2], [6.0, -6.4, -0.2], [7.6, -6.0, -0.6]], bcv: [[4.4, -6.1, -0.2], [2.8, -6.9, 0.6], [1.6, -7.8, 0.9]],
    bct: [[-0.6, -8.4, 0.2], [-1.7, -7.4, 0.5]],
    sca: { R: [[-1.7, -7.4, 0.5], [-2.8, -6.9, -0.6], [-4.2, -6.6, -1.6], [-6.2, -6.9, -2.1], [-8, -6.4, -2.4]], L: [[2.2, -8.6, -2.2], [3.4, -6.8, -2.0], [4.8, -6.4, -2.0], [6.6, -6.8, -2.3], [8, -6.4, -2.4]] },
    tct: [[4.6, -6.5, -1.9], [4.6, -5.6, -2.0]],
    ita: [[4.6, -5.6, -2.0], [4.4, -3.0, -2.25], [4.05, -0.9, -2.0], [3.4, -0.3, -1.55], [2.75, -0.1, -1.2], [2.25, -0.05, -1.05]],
    sta: [[3.3, 6.4, -0.3], [2.95, 6.15, 0.35], [2.45, 5.1, 0.55], [2.12, 4.0, 0.3], [1.98, 3.38, 0.05]],
    staA: [[1.98, 3.38, 0.05], [1.75, 2.4, 0.8], [1.35, 1.0, 1.12]], staP: [[1.98, 3.38, 0.05], [2.4, 2.4, -0.62]],
    stv: [[2.02, 3.3, 0.28], [2.35, 4.3, 0.78], [3.2, 5.25, 0.62], [4.3, 5.6, 0.05]],
    mtv: [[2.95, 0.6, 0.42], [3.6, 0.55, 0.42], [4.12, 0.5, 0.12]],
    itv: [[1.45, -2.45, 0.85], [1.05, -4.4, 1.2], [1.25, -6.6, 1.12], [1.6, -7.9, 0.9]],
    vag: { R: [[-4.05, -7.8, -0.9], [-4.05, -6.0, -1.15], [-4.08, 0, -1.2], [-4.1, 6, -1.2], [-4.1, 11, -1.55]], L: [[3.3, -8.8, -1.4], [3.95, -6.0, -1.2], [4.08, 0, -1.2], [4.1, 6, -1.2], [4.1, 11, -1.55]] },
    rln: { R: [[-4.05, -6.0, -1.05], [-4.0, -7.05, -0.75], [-3.7, -7.35, -1.55], [-3.4, -6.8, -2.25], [-3.0, -5.4, -1.75], [-2.6, -3.0, -1.2], [-2.05, -1.2, -1.0], [-1.6, 0.4, -0.92], [-1.32, 1.6, -0.86], [-1.18, 2.3, -0.72]],
      L: [[1.75, -8.6, -1.35], [1.6, -5.0, -1.2], [1.45, -2.0, -1.05], [1.35, 0.4, -0.92], [1.28, 1.6, -0.86], [1.18, 2.3, -0.72]] },
    sln: [[4.0, 10.8, -1.45], [3.4, 9.6, -1.5], [2.85, 8.7, -1.25]], isln: [[2.85, 8.7, -1.25], [2.3, 7.6, -0.5], [1.8, 7.2, -0.1]],
    ebsln: [[2.85, 8.7, -1.25], [2.6, 6.8, -0.6], [2.1, 5.1, 0.05], [1.68, 3.65, 0.4], [1.35, 2.8, 0.68], [1.0, 2.2, 0.95]],
    berry: [[1.5, 1.45, -0.42], [1.05, 1.6, -0.2]],
    scm: [[2.0, -5.2, 1.75], [3.0, -2.0, 1.6], [3.9, 1.5, 1.25], [4.8, 5.0, 0.55], [5.8, 8.5, -0.55], [6.4, 11, -1.8]],
    sh: [[1.2, -5.0, 1.95], [1.35, -1.0, 2.2], [1.25, 3.0, 2.15], [0.95, 7.4, 1.55]],
    st: [[1.6, -5.0, 1.55], [1.95, -1.0, 1.7], [2.05, 2.4, 1.3], [1.9, 4.3, 0.78]],
    th: [[1.9, 4.3, 0.78], [1.8, 6.0, 0.95], [1.6, 7.5, 1.1]],
    omo: [[1.95, 7.4, 1.15], [3.0, 4.5, 1.0], [4.0, 1.6, 0.75], [5.2, -0.5, 0.2], [6.8, -3.5, -1.0]],
    clav: [[1.3, -5.5, 1.45], [3.0, -5.8, 1.25], [5.0, -5.7, 0.65], [7.2, -5.3, -0.6]],
    thym: [[1.7, -3.0, 0.62], [1.6, -5.0, 0.95], [1.5, -7.6, 1.0]],
    ttl: [[1.95, -2.55, 0.45], [1.75, -3.1, 0.6]],
    hyoid: [[-2.6, 8.0, -1.4], [-1.5, 7.6, 0.6], [0, 7.6, 1.2], [1.5, 7.6, 0.6], [2.6, 8.0, -1.4]],
    ct: [[0.55, 1.75, 1.05], [1.45, 2.6, 0.55]],
    // limfadenektomia boczna (strona lewa)
    xi: [[4.15, 11.2, -1.5], [4.45, 10.1, -0.5], [5.3, 9.0, -1.3], [6.4, 6.5, -1.9], [7.0, 3.5, -2.8], [7.4, 0, -3.6], [7.7, -2.5, -4.0]],
    asc: [[4.3, 6.0, -2.9], [4.6, 1.0, -2.75], [4.9, -3.5, -2.35], [5.0, -6.2, -1.95]],
    phr: [[4.3, 6.2, -2.4], [4.65, 2.0, -2.25], [4.75, -2.0, -1.95], [4.4, -5.8, -1.6], [3.9, -7.6, -1.2]],
    bp: [[5.7, 4.2, -3.4], [6.3, 0, -3.2], [7.2, -4.0, -2.8], [8.2, -6.2, -2.6]],
    td: [[2.4, -7.6, -2.6], [2.9, -4.6, -2.5], [3.5, -3.2, -2.1], [4.4, -3.6, -1.4], [4.6, -4.8, -0.95], [4.45, -5.9, -0.55]],
    tca: [[4.6, -5.4, -1.9], [5.3, -4.8, -1.6], [6.6, -4.2, -2.4], [8.0, -3.8, -3.2]]
  };
  // przytarczyce: punkt w miąższu i kierunek ku powierzchni (położenie liczone przy pierwszym użyciu); strona: −1 prawa, 1 lewa
  var GL = { sup: { p: [2.0, 1.75, -0.3], dir: [0.15, 0, -1] }, inf: { p: [2.2, -1.5, 0.0], dir: [0.55, -0.12, -0.82] } };
  function glandAt(s, k, off) {
    var g = GL[k], p = [g.p[0] * s, g.p[1], g.p[2]], dl = Math.hypot(g.dir[0], g.dir[1], g.dir[2]), d = [g.dir[0] * s / dl, g.dir[1] / dl, g.dir[2] / dl], t = 0;
    while (t < 3 && thyroid(p[0] + d[0] * t, p[1] + d[1] * t, p[2] + d[2] * t, 'all') < 0) t += 0.02;
    return { c: [p[0] + d[0] * (t + off), p[1] + d[1] * (t + off), p[2] + d[2] * (t + off)], n: d };
  }

  /* ---------- tkanka tłuszczowo-chłonna: przedział VI i boczny (II–V, strona lewa) ---------- */
  var PK = {
    pre: { c: [-0.35, 2.4, 1.45], r: [0.45, 0.35, 0.2], name: 'Węzły przedkrtaniowe (Delfickie)' },
    ptr: { c: [0, -2.9, 1.35], r: [0.85, 1.9, 0.32], name: 'Węzły przedtchawicze' },
    parR: { c: [-1.95, -3.9, -0.85], r: [0.7, 2.2, 0.6], name: 'Węzły przytchawicze prawe' },
    parL: { c: [1.6, -3.9, -0.95], r: [0.55, 2.2, 0.5], name: 'Węzły przytchawicze lewe' },
    II: { c: [4.5, 8.8, -0.8], r: [1.3, 1.6, 1.0], name: 'Poziom II' }, III: { c: [4.6, 4.8, -0.5], r: [1.25, 1.7, 0.95], name: 'Poziom III' },
    IV: { c: [4.4, -2.0, -0.6], r: [1.35, 2.5, 0.95], name: 'Poziom IV' }, Vb: { c: [6.4, -1.6, -2.3], r: [1.0, 2.3, 0.8], name: 'Poziom Vb' }
  };
  var VQ = null;
  function packD(ids, x, y, z) {
    if (!VQ) VQ = [poly(P.ijv), poly(P.cca.L), poly(P.cca.R), poly(mir(P.ijv, -1))];
    var d = 1e9; ids.forEach(function (k) { d = smin(d, ell(x, y, z, PK[k].c, PK[k].r), 0.3); });
    d = Math.max(d, -thyroid(x, y, z, 'all') + 0.02);
    d = carve(d, x, y, z);
    d = Math.max(d, -(near(VQ[0], x, y, z).d - 0.66), -(near(VQ[1], x, y, z).d - 0.47), -(near(VQ[2], x, y, z).d - 0.47), -(near(VQ[3], x, y, z).d - 0.66));
    return d;
  }

  /* ---------- przedramię (autoprzeszczep przytarczyc): oś x od łokcia (−7) do nadgarstka (6), strona dłoniowa ku przodowi (z+),
     promieniowa ku górze (y+); mięsień ramienno-promieniowy po stronie dłoniowo-promieniowej, bliżej łokcia ---------- */
  var ARM = { x0: -7.2, x1: 6.2, ry: function (x) { return 3.1 - 0.7 * sm((x + 4) / 9); }, rz: function (x) { return 3.5 - 1.1 * sm((x + 4) / 9); }, th: 0.70,
    inc: [-5.0, -1.8], pockets: [-4.5, -3.75, -3.0, -2.25] };

  /* ---------- zabiegi: fazy osi czasu, rodzaj cięcia, stan przytarczyc ---------- */
  var INC = {
    collar: { pts: [[-2.6, -2.75], [-1.3, -3.0], [0, -3.08], [1.3, -3.0], [2.6, -2.75]], holes: [{ c: [0, -0.3], r: [3.2, 4.6] }], name: 'Cięcie Kochera', sub: 'kołnierzowe, ok. 2 cm nad wcięciem mostka' },
    short: { pts: [[-1.25, -2.85], [0, -3.0], [1.25, -2.85]], holes: [{ c: [-0.7, -0.7], r: [2.3, 3.2] }], name: 'Krótkie cięcie', sub: '2–3 cm, w fałdzie skóry' },
    ext: { pts: [[-2.6, -2.75], [-1.3, -3.0], [0, -3.08], [1.3, -3.0], [2.6, -2.8], [3.9, -2.45], [5.0, -1.8], [5.7, -0.6]],
      holes: [{ c: [0, -0.3], r: [3.2, 4.6] }, { c: [4.4, 3.0], r: [2.4, 7.2] }, { c: [6.1, -1.3], r: [1.5, 3.0] }], name: 'Cięcie Kochera przedłużone', sub: 'bocznie, do tylnego brzegu mięśnia MOS' }
  };
  var THY_T = { acc: [0, 1], sup: [1, 2], mid: [2, 3], rln: [3, 4], rem: [4, 5] };
  var OPS = {
    tt: { kind: 'thy', T: Object.assign({ left: [5, 6] }, THY_T), end: 6, inc: 'collar' },
    lob: { kind: 'thy', T: THY_T, end: 5, inc: 'collar', lob: true },
    cnd: { kind: 'thy', T: Object.assign({ left: [5, 6], cnd: [6, 7] }, THY_T), end: 7, inc: 'collar', cnd: true },
    lnd: { kind: 'thy', T: Object.assign({ left: [5, 6], cnd: [6, 7], lnd: [7, 8] }, THY_T), end: 8, inc: 'ext', cnd: true, lnd: true },
    mip: { kind: 'ptx', T: { acc: [0, 1], exp: [1, 2], rem: [2, 3], pth: [3, 4] }, end: 4, inc: 'short', gl: { rinf: 'ad' }, out: ['rinf'] },
    bne: { kind: 'ptx', T: { acc: [0, 1], expR: [1, 2], expL: [2, 3], rem: [3, 4], pth: [4, 5] }, end: 5, inc: 'collar', gl: { lsup: 'ad' }, out: ['lsup'] },
    sub: { kind: 'ptx', T: { acc: [0, 1], expR: [1, 2], expL: [2, 3], rest: [3, 4], rem3: [4, 5], thym: [5, 6] }, end: 6, inc: 'collar', gl: { rsup: 'hy', rinf: 'hy', lsup: 'hy', linf: 'hy' }, keep: 'linf', out: ['rsup', 'rinf', 'lsup'] },
    tot: { kind: 'ptx', T: { acc: [0, 1], expR: [1, 2], expL: [2, 3], rem4: [3, 4], thym: [4, 5], at: [5, 6] }, end: 6, inc: 'collar', gl: { rsup: 'hy', rinf: 'hy', lsup: 'hy', linf: 'hy' }, out: ['rsup', 'rinf', 'lsup', 'linf'] }
  };
  // PTH śródoperacyjny (wartości względne): przed nacięciem, przed wycięciem (najwyższa), 5 i 10 min po wycięciu
  var PTH = [['Przed nacięciem', 1.0], ['Przed wycięciem', 1.18], ['5 min po', 0.47], ['10 min po', 0.27]];

  A.NECK = { skinZ: skinZ, skinA: skinA, SKIN: SKIN, thyroid: thyroid, lamina: lamina, zf: zf, P: P, mir: mir, poly: poly, near: near, glandAt: glandAt,
    PK: PK, packD: packD, ARM: ARM, INC: INC, OPS: OPS, PTH: PTH, ell: ell,
    box: [[-8, -7.5, -4.2], [8, 11, 4.2]] };

  /* ---------- kadry ---------- */
  var CAM = {
    acc: { t: [0, 0.6, 1.4], az: 0, el: 8, k: 0.74 }, anat: { t: [0, 0.2, 0.4], az: 0, el: 3, k: 0.72, tp: [0, 0.6, 0.4] },
    up: { t: [-1.9, 3.3, 0.2], az: -28, el: 6, k: 0.42 }, R: { t: [-1.7, -0.6, -0.6], az: -58, el: 8, k: 0.46 }, L: { t: [1.7, -0.6, -0.6], az: 58, el: 8, k: 0.46 },
    both: { t: [0, 0.4, 0], az: 0, el: 6, k: 0.52 }, cnd: { t: [0, -1.4, 0.2], az: 0, el: 14, k: 0.52 }, lnd: { t: [4.4, 1.2, -0.9], az: 50, el: 6, k: 0.7 },
    pth: { t: [3.6, 0.6, 0.8], az: 0, el: 3, k: 0.8, tp: [5.8, 0.8, 0.8] }, arm: { t: [-3.2, 1.2, 1.2], az: 0, el: 14, k: 0.56 },
    post: { t: [0, 0.6, 0.2], az: 0, el: 5, k: 0.56 }
  };
  function fr(k, m0, m1, cam, short, title, cap, dur, caps) { var f = { k: k, kind: 'orbit', m0: m0, m1: m1, cam: 'custom', camP: CAM[cam], short: short, title: title, cap: cap }; if (dur) f.dur = dur; if (caps) f.caps = caps; return f; }
  var ACC_CAP = 'Cięcie kołnierzowe w naturalnym fałdzie skóry, ok. 2 cm nad wcięciem jarzmowym mostka (zwykle 4–6 cm). Płaty skórne z mięśniem szerokim szyi uniesione w górę do chrząstki tarczowatej i w dół do wcięcia mostka; mięśnie podgnykowe rozdzielone w linii pośrodkowej szyi i odciągnięte bocznie.';
  var ANAT_CAP = 'Płaty boczne i cieśń tarczycy (na pierścieniach 2–4 tchawicy), płat piramidowy. Za płatami rowek tchawiczo-przełykowy z nerwem krtaniowym wstecznym i przytarczyce na tylnej powierzchni płatów; bocznie pochewka szyjna — tętnica szyjna wspólna, żyła szyjna wewnętrzna i nerw błędny.';
  function thyFrames(op) {
    var O = OPS[op], F = [
      fr('acc', 0, 1, 'acc', 'Dostęp', op === 'lnd' ? 'Dostęp: cięcie Kochera przedłużone bocznie' : 'Dostęp: cięcie Kochera',
        op === 'lnd' ? 'Cięcie kołnierzowe przedłużone w lewo do tylnego brzegu mięśnia mostkowo-obojczykowo-sutkowego. Płaty skórne z mięśniem szerokim szyi uniesione: w części środkowej do chrząstki tarczowatej i wcięcia mostka, bocznie do żuchwy (poziom II) i obojczyka; mięśnie podgnykowe rozdzielone w linii pośrodkowej szyi.' : ACC_CAP, 7),
      fr('anat', 1, 1, 'anat', 'Anatomia', 'Anatomia: tarczyca i jej otoczenie', ANAT_CAP),
      fr('sup', 1, 2, 'up', 'Biegun górny', 'Biegun górny i gałąź zewnętrzna nerwu krtaniowego górnego',
        'Biegun górny odciągnięty w dół i bocznie, przestrzeń między nim a mięśniem pierścienno-tarczowym otwarta. Gałąź zewnętrzna nerwu krtaniowego górnego oszczędzona (widoczna lub potwierdzona neuromonitoringiem); naczynia tarczowe górne podwiązane pojedynczo, tuż przy torebce.', 5),
      fr('mid', 2, 3, 'R', 'Przytarczyce', 'Żyła tarczowa środkowa i przytarczyce',
        'Żyła tarczowa środkowa podwiązana, płat obrócony przyśrodkowo. Przytarczyce odsunięte od torebki razem z szypułami naczyniowymi; gałęzie tętnicy tarczowej dolnej podwiązane na torebce, obwodowo od gałązek do przytarczyc.', 5),
      fr('rln', 3, 4, 'R', 'Nerw krtaniowy wsteczny', 'Nerw krtaniowy wsteczny i więzadło Berry’ego',
        'Nerw odnaleziony w rowku tchawiczo-przełykowym i prowadzony do wejścia do krtani; neuromonitoring potwierdza sygnał. Więzadło Berry’ego przecięte ostro pod kontrolą wzroku (bez koagulacji przy nerwie).', 5),
      fr('rem', 4, 5, 'both', O.lob ? 'Usunięcie płata' : 'Płat prawy', O.lob ? 'Usunięcie płata prawego z cieśnią' : 'Usunięcie płata prawego',
        O.lob ? 'Płat prawy z cieśnią i płatem piramidowym oddzielony od tchawicy; cieśń przecięta przy płacie lewym, brzeg zamknięty (szew lub koagulacja). Płat lewy pozostaje.'
          : 'Płat prawy z cieśnią i płatem piramidowym oddzielony od tchawicy i usunięty; sygnał nerwu sprawdzony ponownie przed przejściem na drugą stronę (utrata sygnału — rozważ odroczenie drugiej strony).', 4)];
    if (O.T.left) F.push(fr('left', 5, 6, 'L', 'Płat lewy', 'Płat lewy',
      'Te same etapy po stronie lewej: biegun górny, żyła środkowa, przytarczyce z ukrwieniem, nerw krtaniowy wsteczny — po lewej biegnie bardziej pionowo, w rowku tchawiczo-przełykowym — i więzadło Berry’ego; płat lewy usunięty.', 7));
    if (O.cnd) F.push(fr('cnd', 6, 7, 'cnd', 'Przedział VI', 'Centralna limfadenektomia szyjna (przedział VI)',
      'Tkanka tłuszczowo-chłonna przedziału VI usunięta w bloku: węzły przedkrtaniowe, przedtchawicze i przytchawicze obustronnie — od kości gnykowej do pnia ramienno-głowowego, bocznie do tętnic szyjnych wspólnych. Nerwy krtaniowe wsteczne odsłonięte na całym przebiegu szyjnym; dolne przytarczyce zachowane z ukrwieniem (gdy to niemożliwe — autoprzeszczep do mięśnia).', 5));
    if (O.lnd) F.push(fr('lnd', 7, 8, 'lnd', 'Poziomy II–V', 'Boczna limfadenektomia szyjna (II–V), strona lewa',
      'Mięsień mostkowo-obojczykowo-sutkowy odciągany bocznie (poziomy II–IV), a przy poziomie Vb — przyśrodkowo, by dotrzeć za jego tylny brzeg. Tkanka poziomów IIa, III, IV i Vb usunięta w bloku z powierzchni żyły szyjnej wewnętrznej, tętnicy szyjnej wspólnej i nerwu błędnego, nad powięzią przedkręgową (nerw przeponowy, splot ramienny). Nerw dodatkowy zachowany; przewód piersiowy przy kącie żylnym oszczędzony.', 6));
    F.push(fr('post', O.end, O.end, 'post', 'Po operacji', O.lob ? 'Stan po lobektomii prawej' : O.lnd ? 'Stan po tyreoidektomii z limfadenektomią centralną i boczną' : O.cnd ? 'Stan po tyreoidektomii z limfadenektomią centralną' : 'Stan po tyreoidektomii całkowitej',
      O.lob ? 'Płat lewy pozostaje; prawy nerw krtaniowy wsteczny, gałąź zewnętrzna nerwu krtaniowego górnego i przytarczyce prawe zachowane, kikuty naczyń tarczowych prawych. Mięśnie podgnykowe zszyte w linii pośrodkowej, potem mięsień szeroki szyi i skóra.'
        : 'Loża tarczycy: tchawica, nerwy krtaniowe wsteczne i gałęzie zewnętrzne nerwów krtaniowych górnych zachowane, przytarczyce z ukrwieniem, kikuty naczyń tarczowych. Mięśnie podgnykowe zszyte w linii pośrodkowej, potem mięsień szeroki szyi i skóra (szew śródskórny).'));
    return F;
  }
  var PTH_CAP = 'PTH oznaczony przed nacięciem, przed wycięciem (zwykle najwyższa wartość) oraz 5 i 10 min po wycięciu. Spadek o co najmniej 50% od wyższej z wartości wyjściowych po 10 min (kryterium Miami) potwierdza usunięcie nadczynnej tkanki; brak spadku — eksploracja pozostałych przytarczyc.';
  var ACC_PTX = 'Cięcie kołnierzowe długości ok. 4–5 cm, ok. 2 cm nad wcięciem mostka; mięśnie podgnykowe rozdzielone w linii pośrodkowej i odciągnięte bocznie po obu stronach.';
  var EXP_R = { bne: 'Płat prawy odsunięty przyśrodkowo. Obie przytarczyce prawe odnalezione: górna — grzbietowo od nerwu krtaniowego wstecznego, przy połączeniu pierścienno-tarczowym; dolna — brzusznie od nerwu, przy biegunie dolnym. Obie prawidłowej wielkości.',
    sub: 'Płat prawy odsunięty przyśrodkowo: obie przytarczyce prawe powiększone, guzkowe (rozrost w nadczynności wtórnej).' };
  var EXP_L = { bne: 'Płat lewy odsunięty przyśrodkowo: powiększona górna przytarczyca lewa (gruczolak) i prawidłowa dolna.',
    sub: 'Także obie przytarczyce lewe powiększone — choroba czterogruczołowa.' };
  function ptxFrames(op) {
    var O = OPS[op], F = [], H = op === 'tot' ? 'sub' : op;
    if (op === 'mip') {
      F.push(fr('acc', 0, 1, 'acc', 'Dostęp', 'Dostęp: krótkie cięcie', 'Cięcie 2–3 cm w fałdzie skóry nad wcięciem mostka (albo bocznie, nad gruczolakiem). Mięśnie podgnykowe rozdzielone w linii pośrodkowej i odciągnięte w prawo.', 6));
      F.push(fr('anat', 1, 1, 'anat', 'Lokalizacja', 'Lokalizacja gruczolaka', 'Badania przed operacją zgodnie wskazały gruczolak dolnej przytarczycy prawej. Pozostałe przytarczyce nie są oceniane — w pojedynczym gruczolaku są prawidłowe (zahamowane).'));
      F.push(fr('exp', 1, 2, 'R', 'Odsłonięcie', 'Odsłonięcie gruczolaka', 'Płat prawy odsunięty przyśrodkowo; gruczolak przy biegunie dolnym, brzusznie od nerwu krtaniowego wstecznego. Preparowanie przy torebce gruczolaka, bez jej rozerwania (ryzyko rozsiewu tkanki przytarczyc).', 5));
      F.push(fr('rem', 2, 3, 'R', 'Wycięcie', 'Wycięcie gruczolaka', 'Szypuła naczyniowa gruczolaka zamknięta (klips lub koagulacja) i przecięta; gruczolak usunięty w całości, nerw krtaniowy wsteczny nienaruszony.', 4));
      F.push(fr('pth', 3, 4, 'pth', 'PTH', 'PTH śródoperacyjny', PTH_CAP, 5));
      F.push(fr('post', 4, 4, 'post', 'Po operacji', 'Stan po paratyreoidektomii celowanej', 'Pozostałe przytarczyce nienaruszone; mięśnie podgnykowe zszyte, zamknięcie skóry. Po operacji kontrola wapnia (możliwa przemijająca hipokalcemia).'));
      return F;
    }
    F.push(fr('acc', 0, 1, 'acc', 'Dostęp', 'Dostęp: cięcie Kochera', ACC_PTX, 6));
    F.push(fr('expR', 1, 2, 'R', 'Strona prawa', 'Eksploracja: strona prawa', EXP_R[H], 5));
    F.push(fr('expL', 2, 3, 'L', 'Strona lewa', 'Eksploracja: strona lewa', op === 'sub' ? EXP_L.sub + ' Do pozostawienia wybrana najmniej zmieniona, dobrze ukrwiona: dolna lewa.' : EXP_L[H], 5));
    if (op === 'bne') {
      F.push(fr('rem', 3, 4, 'L', 'Wycięcie', 'Wycięcie gruczolaka', 'Szypuła gruczolaka zamknięta i przecięta, gruczolak usunięty w całości; prawidłowe przytarczyce pozostawione z ukrwieniem.', 4));
      F.push(fr('pth', 4, 5, 'pth', 'PTH', 'PTH śródoperacyjny', PTH_CAP, 5));
      F.push(fr('post', 5, 5, 'post', 'Po operacji', 'Stan po paratyreoidektomii', 'Trzy prawidłowe przytarczyce zachowane; płaty tarczycy na miejscu, mięśnie podgnykowe zszyte. Po operacji kontrola wapnia.'));
    } else if (op === 'sub') {
      F.push(fr('rest', 3, 4, 'L', 'Kikut', 'Kikut przytarczycy', 'Wybrany gruczoł przycięty do kikuta ok. 40–80 mg z zachowaną szypułą naczyniową; kikut oznaczony klipsem. Pozostałe gruczoły usuwa się dopiero po potwierdzeniu żywotności kikuta.', 5));
      F.push(fr('rem3', 4, 5, 'both', 'Trzy gruczoły', 'Usunięcie trzech przytarczyc', 'Trzy pozostałe przytarczyce wycięte z zamknięciem szypuł.', 4));
      F.push(fr('thym', 5, 6, 'cnd', 'Tymektomia', 'Tymektomia szyjna', 'Rogi grasicy wyciągnięte zza mostka i usunięte obustronnie — mogą zawierać przytarczyce nadliczbowe.', 4));
      F.push(fr('post', 6, 6, 'post', 'Po operacji', 'Stan po paratyreoidektomii subtotalnej', 'W szyi kikut jednej przytarczycy z klipsem; mięśnie podgnykowe zszyte. Po operacji wapń i aktywna witamina D (ryzyko zespołu głodnych kości).'));
    } else {
      F.push(fr('rem4', 3, 4, 'both', 'Cztery gruczoły', 'Usunięcie czterech przytarczyc', 'Wszystkie przytarczyce wycięte; najmniej zmieniona (bez guzków) przechowana w zimnej soli fizjologicznej do autoprzeszczepu.', 4));
      F.push(fr('thym', 4, 5, 'cnd', 'Tymektomia', 'Tymektomia szyjna', 'Rogi grasicy wyciągnięte zza mostka i usunięte obustronnie — mogą zawierać przytarczyce nadliczbowe.', 4));
      F.push(fr('at', 5, 6, 'arm', 'Autoprzeszczep', 'Autoprzeszczep do przedramienia', 'Przedramię niedominujące, bez przetoki dializacyjnej: cięcie nad mięśniem ramienno-promieniowym; 10–20 fragmentów przytarczycy (ok. 1 mm³) wszczepionych do osobnych kieszonek w mięśniu, każda zamknięta szwem niewchłanialnym lub oznaczona klipsem.', 6));
      F.push(fr('post', 6, 6, 'post', 'Po operacji', 'Stan po paratyreoidektomii całkowitej', 'W szyi brak przytarczyc; ich tkanka tylko w przedramieniu — podejmuje czynność po kilku tygodniach. Nawrót nadczynności z przeszczepu można usunąć w znieczuleniu miejscowym.'));
    }
    return F;
  }

  /* ---------- opisy ---------- */
  var COMMON = 'Schemat: proporcje uproszczone, przytarczyce powiększone dla czytelności (prawidłowa ok. 5 × 3 × 1 mm, ok. 40 mg); przebieg nerwów, naczyń i położenie przytarczyc są zmienne (np. niezawracający nerw krtaniowy po prawej, ok. 0,5–1%).';
  var THY_NOTES = [
    'Nerw krtaniowy wsteczny biegnie w rowku tchawiczo-przełykowym i wchodzi do krtani za stawem pierścienno-tarczowym, tuż za więzadłem Berry’ego. Prawy zawraca pod tętnicą podobojczykową i biegnie bardziej skośnie, lewy — pod łukiem aorty, bardziej pionowo. Guzek Zuckerkandla wskazuje jego położenie: nerw leży przyśrodkowo i głębiej.',
    'Gałąź zewnętrzna nerwu krtaniowego górnego biegnie na zwieraczu dolnym gardła do mięśnia pierścienno-tarczowego i krzyżuje naczynia tarczowe górne — dlatego podwiązuje się je pojedynczo, tuż przy torebce bieguna górnego (klasyfikacja Cernei: typ 1 — skrzyżowanie ponad 1 cm nad górnym brzegiem bieguna górnego, 2A — mniej niż 1 cm nad nim, 2B — poniżej górnego brzegu bieguna). Uszkodzenie: osłabienie i męczliwość głosu, utrata wysokich tonów.',
    'Neuromonitoring śródoperacyjny: laryngoskopia przed operacją (L1), sygnał nerwu błędnego i nerwu krtaniowego wstecznego przed wycięciem płata (V1, R1) i po nim (R2, V2), laryngoskopia po operacji (L2). Utrata sygnału po pierwszej stronie przemawia za odroczeniem drugiej strony (tyreoidektomia dwuetapowa), by uniknąć obustronnego porażenia fałdów głosowych.',
    'Przytarczyce zachowuje się z szypułą naczyniową (gałązki tętnicy tarczowej dolnej), podwiązując gałęzie tej tętnicy na torebce tarczycy. Przytarczyca pozbawiona ukrwienia — rozdrobniona i wszczepiona do mięśnia mostkowo-obojczykowo-sutkowego.',
    'Po operacji: wapń i PTH (niedoczynność przytarczyc), ocena głosu, laryngoskopia przy jego zmianie; krwiak szyi z dusznością wymaga natychmiastowego otwarcia rany.'
  ];
  var VAR_NOTES = {
    tt: 'Tyreoidektomia całkowita: usunięcie obu płatów, cieśni i płata piramidowego (pozostawiony płat piramidowy to częsta przyczyna wychwytu jodu po operacji). Wskazania m.in. rak zróżnicowany powyżej 4 cm, z makroskopowym naciekaniem pozatarczycowym (cT4) lub z przerzutami (cN1, M1), wole guzkowe obu płatów, choroba Gravesa-Basedowa.',
    lob: 'Lobektomia (hemityreoidektomia): płat z cieśnią. Wskazania m.in. jednostronny guzek o nieokreślonym charakterze w biopsji i rak zróżnicowany niskiego ryzyka (1–4 cm, bez przerzutów i naciekania pozatarczycowego — ATA 2015 dopuszcza lobektomię albo tyreoidektomię całkowitą; poniżej 1 cm, jeśli wybrano operację, zalecana lobektomia — alternatywą jest aktywny nadzór).',
    cnd: 'Centralna limfadenektomia szyjna (przedział VI): węzły przedkrtaniowe (Delfickie), przedtchawicze i przytchawicze; granice: górna — kość gnykowa, dolna — pień ramienno-głowowy (po lewej odpowiadająca mu płaszczyzna), boczne — tętnice szyjne wspólne. Terapeutyczna — przy przerzutach w przedziale VI; profilaktyczną rozważa się w raku brodawkowatym T3–T4 lub z przerzutami w przedziale bocznym (ATA 2015). Ryzyko: niedoczynność przytarczyc i uszkodzenie nerwów krtaniowych wstecznych.',
    lnd: 'Boczna limfadenektomia szyjna — przy potwierdzonych (biopsja, tyreoglobulina z popłuczyn) przerzutach w węzłach bocznych; przedziałowa, co najmniej poziomy IIa, III, IV i Vb, bez wycinania pojedynczych węzłów. Zachowuje się żyłę szyjną wewnętrzną, mięsień mostkowo-obojczykowo-sutkowy i nerw dodatkowy. Po lewej przy kącie żylnym przewód piersiowy — jego uszkodzenie grozi wyciekiem chłonki.'
  };
  var PTX_NOTES = [
    'Pierwotna nadczynność przytarczyc: najczęściej pojedynczy gruczolak (ok. 85%), rzadziej choroba wielogruczołowa (rozrost, mnogie gruczolaki), wyjątkowo rak. Rozpoznanie jest biochemiczne; badania lokalizacyjne (USG, scyntygrafia z 99mTc-MIBI, TK 4D, PET-TK z fluorocholiną) służą zaplanowaniu dostępu.',
    'Położenie: górne przytarczyce (z IV kieszonki gardłowej) — dość stałe, grzbietowo od nerwu krtaniowego wstecznego, przy połączeniu pierścienno-tarczowym; dolne (z III kieszonki, razem z grasicą) — brzusznie od nerwu, zmienne: od bieguna dolnego tarczycy po grasicę i śródpiersie. Ektopie: za przełykiem, w grasicy, w tarczycy, w pochewce szyjnej.',
    'PTH śródoperacyjny: kryterium Miami — spadek o co najmniej 50% od wyższej z wartości sprzed nacięcia i sprzed wycięcia, 10 min po wycięciu.'
  ];
  var PTX_VAR = {
    mip: 'Paratyreoidektomia celowana: gdy badania lokalizacyjne zgodnie wskazują pojedynczy gruczolak; krótkie cięcie, bez oceny pozostałych gruczołów — skuteczność potwierdza spadek PTH.',
    bne: 'Eksploracja obustronna: ocena wszystkich czterech przytarczyc — gdy brak lokalizacji lub wyniki są niezgodne, przy podejrzeniu choroby wielogruczołowej (np. MEN1) i gdy po wycięciu gruczolaka PTH nie spada.',
    sub: 'Paratyreoidektomia subtotalna (3½ gruczołu): nadczynność wtórna (nerkowa) i trzeciorzędowa, MEN1. Zostaje dobrze ukrwiony kikut ok. 40–80 mg (ESES 2015), najlepiej z gruczołu najmniej zmienionego i łatwego do odnalezienia przy reoperacji, oznaczony klipsem lub szwem niewchłanialnym; tymektomia szyjna usuwa przytarczyce nadliczbowe.',
    tot: 'Paratyreoidektomia całkowita z autoprzeszczepem: usunięcie wszystkich przytarczyc i tymektomia szyjna; fragmenty najmniej zmienionej przytarczycy (ESES 2015: 10–20 kawałków po ok. 1 mm³) wszczepione do mięśnia przedramienia bez przetoki dializacyjnej — nawrót można usunąć w znieczuleniu miejscowym. Część tkanki bywa zamrażana (kriokonserwacja).'
  };

  function variant(proc, op, vshort, title, sub, notes) {
    var O = OPS[op];
    return { cat: 'endo', id: proc + '-' + op, vshort: vshort, short: proc === 'thyr' ? 'Tyreoidektomia' : 'Paratyreoidektomia', title: title, sub: sub,
      notes: notes, objects: [], marks: [], cutTools: [{ type: 'neck', op: op }], anastTools: [], commonCuts: 0, mEnd: O.end, single: true, box: A.NECK.box,
      singleFrames: O.kind === 'thy' ? thyFrames(op) : ptxFrames(op) };
  }
  var THYR = { cat: 'endo', id: 'thyr', short: 'Tyreoidektomia', title: 'Tyreoidektomia — warianty zakresu', variants: [
    variant('thyr', 'tt', 'Całkowita', 'Tyreoidektomia całkowita', 'Cięcie Kochera, biegun górny i gałąź zewnętrzna nerwu krtaniowego górnego, przytarczyce z ukrwieniem, nerw krtaniowy wsteczny, oba płaty', [VAR_NOTES.tt].concat(THY_NOTES, [COMMON])),
    variant('thyr', 'lob', 'Lobektomia', 'Lobektomia (hemityreoidektomia) prawa', 'Płat prawy z cieśnią; płat lewy pozostaje', [VAR_NOTES.lob].concat(THY_NOTES, [COMMON])),
    variant('thyr', 'cnd', 'Całkowita + przedział VI', 'Tyreoidektomia całkowita z centralną limfadenektomią szyjną', 'Węzły przedkrtaniowe, przedtchawicze i przytchawicze obustronnie', [VAR_NOTES.tt, VAR_NOTES.cnd].concat(THY_NOTES, [COMMON])),
    variant('thyr', 'lnd', 'Całkowita + VI + boczna II–V', 'Tyreoidektomia całkowita z limfadenektomią centralną i boczną (II–V)', 'Przedział centralny obustronnie i boczny lewy: poziomy IIa, III, IV, Vb', [VAR_NOTES.tt, VAR_NOTES.cnd, VAR_NOTES.lnd].concat(THY_NOTES, [COMMON]))] };
  var PTX = { cat: 'endo', id: 'ptx', short: 'Paratyreoidektomia', title: 'Paratyreoidektomia — warianty', variants: [
    variant('ptx', 'mip', 'Celowana (MIP)', 'Paratyreoidektomia celowana (małoinwazyjna)', 'Pojedynczy gruczolak dolnej przytarczycy prawej, krótkie cięcie, PTH śródoperacyjny', [PTX_VAR.mip].concat(PTX_NOTES, [COMMON])),
    variant('ptx', 'bne', 'Eksploracja obustronna', 'Paratyreoidektomia z eksploracją obustronną', 'Ocena czterech przytarczyc, gruczolak górnej przytarczycy lewej', [PTX_VAR.bne].concat(PTX_NOTES, [COMMON])),
    variant('ptx', 'sub', 'Subtotalna (3½)', 'Paratyreoidektomia subtotalna (3½ gruczołu)', 'Rozrost czterech przytarczyc: kikut dolnej lewej, tymektomia szyjna', [PTX_VAR.sub].concat(PTX_NOTES, [COMMON])),
    variant('ptx', 'tot', 'Całkowita z autoprzeszczepem', 'Paratyreoidektomia całkowita z autoprzeszczepem do przedramienia', 'Cztery przytarczyce i rogi grasicy, fragmenty przytarczycy do mięśnia ramienno-promieniowego', [PTX_VAR.tot].concat(PTX_NOTES, [COMMON]))] };

  // kategoria „Endokrynologia” po kategoriach chirurgii przewodu pokarmowego (przed badaniami); podgrupy: Tarczyca, Przytarczyce, Nadnercza
  var at = A.PROCS.length; A.PROCS.forEach(function (p, i) { if (p.cat === 'trials' && at === A.PROCS.length) at = i; });
  A.PROCS.splice(at, 0, THYR, PTX);
  var ci = A.CATS.length; A.CATS.forEach(function (c, i) { if (c.id === 'trials') ci = i; });
  A.CATS.splice(ci, 0, { id: 'endo', name: 'Endokrynologia' });
  A.SUBS.endo = [{ name: 'Tarczyca', ids: ['thyr'] }, { name: 'Przytarczyce', ids: ['ptx'] }, { name: 'Nadnercza', ids: ['adr'] }];
})(typeof window !== 'undefined' ? window : globalThis);
