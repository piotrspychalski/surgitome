  /* ---------- szyja (TOOL_EXT.neck): tyreoidektomia i paratyreoidektomia na modelu ANAT.NECK (14-endokrynologia.js).
     Skóra i mięsień szeroki szyi (siatki z przezroczystością w wierzchołkach; rana rośnie od linii cięcia), mięśnie podgnykowe i MOS (pasma),
     krtań, tchawica, przełyk, tarczyca (pole odległości → surface nets; płaty i cieśń jako osobne części obracane wokół więzadła Berry’ego),
     przytarczyce (prawidłowe, gruczolak, rozrost), naczynia i nerwy (rury), węzły przedziału VI i bocznego, grasica szyjna, przedramię
     (autoprzeszczep), wykres PTH śródoperacyjnego. Oś m według faz d.op (ANAT.NECK.OPS[op].T). ---------- */
  var SZY_CACHE = {};
  var SZY_COL = { art: '#c8332b', vein: '#3a64b8', nerve: '#e2b62a', lymph: '#efe3c4', node: '#4f9a6a', fat: '#e3c063', strap: '#c4685b', scm: '#b65a4f',
    cart: '#cfd8de', bone: '#e8e0cc', thy: '#a3432f', pt: '#c99a43', ad: '#9a5a2c', hy: '#ad6c36', thym: '#e2c39c', trach: '#c4cdd3', eso: '#c9a08c', skin: '#e2b59c', plat: '#c97a6a' };
  function szyGrid(fn, lo, hi, h) {
    var nx = Math.ceil((hi[0] - lo[0]) / h) + 1, ny = Math.ceil((hi[1] - lo[1]) / h) + 1, nz = Math.ceil((hi[2] - lo[2]) / h) + 1, F = new Float32Array(nx * ny * nz);
    for (var k = 0; k < nz; k++) for (var j = 0; j < ny; j++) for (var i = 0; i < nx; i++) F[i + nx * (j + ny * k)] = fn(lo[0] + i * h, lo[1] + j * h, lo[2] + k * h);
    return { F: F, G: { nx: nx, ny: ny, nz: nz, h: h, o: lo } };
  }
  function szyNets(g, cut) {   // cut(x) — dodatkowe ograniczenie (np. płaszczyzna podziału płat / cieśń)
    var F = g.F; if (cut) { F = new Float32Array(g.F.length); var G = g.G; for (var k = 0; k < G.nz; k++) for (var j = 0; j < G.ny; j++) for (var i = 0; i < G.nx; i++) { var q = i + G.nx * (j + G.ny * k); F[q] = Math.max(g.F[q], cut(G.o[0] + i * G.h)); } }
    return A.LIVER.surfNets(F, g.G);
  }
  function szyThyroid() {
    var h = MOBILE ? 0.13 : 0.1, key = 'thy' + h; if (SZY_CACHE[key]) return SZY_CACHE[key];
    var g = szyGrid(function (x, y, z) { return A.NECK.thyroid(x, y, z, 'all'); }, [-3.7, -3.3, -1.9], [3.7, 4.5, 2.1], h);
    return (SZY_CACHE[key] = { all: szyNets(g), R: szyNets(g, function (x) { return x + 1.0; }), L: szyNets(g, function (x) { return 1.0 - x; }), I: szyNets(g, function (x) { return Math.abs(x) - 1.0; }) });
  }
  function szyPack(ids, lo, hi) {
    var h = MOBILE ? 0.16 : 0.12, key = ids.join() + h; if (SZY_CACHE[key]) return SZY_CACHE[key];
    return (SZY_CACHE[key] = szyNets(szyGrid(function (x, y, z) { return A.NECK.packD(ids, x, y, z); }, lo, hi, h)));
  }
  // pasmo mięśniowe wzdłuż krzywej: szerokość w poprzek (styczna do obwodu szyi), grubość wzdłuż promienia od osi szyi (0, y, −2,6)
  function szyRibbon(pts, w0, w1, th) {
    var c = new THREE.CatmullRomCurve3(pts.map(function (p) { return new V3().fromArray(p); }), false, 'centripetal'), N = 40, pos = [], idx = [];
    for (var i = 0; i <= N; i++) {
      var t = i / N, C = c.getPointAt(t), Tg = c.getTangentAt(t), R = new V3(C.x, 0, C.z + 2.6).normalize(), L = new V3().crossVectors(Tg, R).normalize(), w = (w0 + (w1 - w0) * t) / 2;
      var e = Math.min(1, Math.min(t, 1 - t) / 0.06), ww = w * (0.55 + 0.45 * e), tt = th / 2 * (0.5 + 0.5 * e);
      [[-1, 1], [1, 1], [1, -1], [-1, -1]].forEach(function (q) { var p = C.clone().addScaledVector(L, q[0] * ww).addScaledVector(R, q[1] * tt); pos.push(p.x, p.y, p.z); });
    }
    for (i = 0; i < N; i++) for (var f = 0; f < 4; f++) { var a = i * 4 + f, b = i * 4 + (f + 1) % 4, a2 = a + 4, b2 = b + 4; idx.push(a, a2, b, b, a2, b2); }
    idx.push(0, 1, 2, 0, 2, 3); var l = N * 4; idx.push(l, l + 2, l + 1, l, l + 3, l + 2);
    var g = track(new THREE.BufferGeometry()); g.setIndex(idx); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return g;
  }
  function makeNeck(d) {
    var N = A.NECK, P = N.P, op = d.op, O = N.OPS[op], T = O.T, grp = new THREE.Group(), neck = new THREE.Group(), labels = [], thy = O.kind === 'thy';
    grp.add(neck);
    function ph(k, m) { var t = T[k]; return t ? sm((m - t[0]) / (t[1] - t[0])) : 0; }
    function lin(k, m) { var t = T[k]; return t ? clamp01((m - t[0]) / (t[1] - t[0])) : 0; }
    function has(k) { return !!T[k]; }
    function mat(col, o, extra) { var m = track(new THREE.MeshStandardMaterial(Object.assign({ color: col, roughness: 0.55, metalness: 0.02, transparent: true, opacity: o == null ? 1 : o }, extra || {}))); m.userData.op = o == null ? 1 : o; return m; }
    function setOp(mt, o) { lvSetOp(mt, o); }
    function V(p) { return new V3().fromArray(p); }
    function curve(pts) { return new THREE.CatmullRomCurve3(pts.map(V), false, 'centripetal'); }
    function tube(pts, r0, mt, parent, r1) {
      var c = curve(pts), g = track(A.buildTube(c, function (t) { return r1 == null ? r0 : r0 + (r1 - r0) * t; }, Math.max(10, Math.round(c.getLength() * 7)), 10, true));
      var m = new THREE.Mesh(g, mt); (parent || neck).add(m); return { mesh: m, curve: c };
    }
    // naczynie dzielone w punkcie u (0–1 wzdłuż krzywej): kikut (od strony u = 0) i część obwodowa (w grupie płata)
    function split(pts, r, mt, u, distParent, r1, mtD) {
      var c = curve(pts), whole = tube(pts, r, mt, neck, r1), seg = function (a, b, par, m2) { var Q = []; for (var i = 0; i <= 12; i++) Q.push(c.getPointAt(a + (b - a) * i / 12).toArray()); return tube(Q, r + (r1 == null ? 0 : (r1 - r) * a), m2 || mt, par, r1 == null ? null : r + (r1 - r) * b); };
      var stump = seg(0, u - 0.025, neck), dist = seg(u + 0.025, 1, distParent, mtD);
      var lig = new THREE.Mesh(track(new THREE.TorusGeometry(r * 1.15, Math.max(0.035, r * 0.35), 6, 14)), ligMat), pt = c.getPointAt(u - 0.03); lig.position.copy(pt); lig.quaternion.setFromUnitVectors(new V3(0, 0, 1), c.getTangentAt(u)); neck.add(lig);
      stump.mesh.visible = dist.mesh.visible = false; lig.visible = false;
      return { whole: whole, stump: stump, dist: dist, lig: lig, c: c, set: function (cut, ligOn) { whole.mesh.visible = !cut; stump.mesh.visible = dist.mesh.visible = cut; lig.visible = !!ligOn; } };
    }
    function lab(text, sub, col, kind) { var L = { el: mkLabel(text, sub || '', col, kind || 'seg'), anchor: null, alpha: 0 }; labels.push(L); return L; }
    function put(L, p, on) { L.anchor = p; L.alpha = on ? 1 : 0; }
    var ligMat = mat('#3b4048', 1), clipMat = mat('#c9ced4', 1, { metalness: 0.7, roughness: 0.3 });

    /* ---- skóra i mięsień szeroki szyi: siatka (y, u), przezroczystość w wierzchołkach, rana ---- */
    var INC = N.INC[O.inc], incC = INC.pts.reduce(function (a, p) { return [a[0] + p[0] / INC.pts.length, a[1] + p[1] / INC.pts.length]; }, [0, 0]);
    var incL = Math.max.apply(null, INC.pts.map(function (p) { return Math.abs(p[0] - incC[0]); }));
    function sheet(depth, xs, col, base) {
      var NY = 70, NX = 56, Y0 = N.SKIN.y0, Y1 = N.SKIN.y1, pos = [], cl = [], xy = [], idx = [];
      for (var i = 0; i <= NY; i++) for (var j = 0; j <= NX; j++) {
        var y = Y0 + (Y1 - Y0) * i / NY, u = -1 + 2 * j / NX, x = u * N.skinA(y) * xs, z = N.skinZ(x, y) - depth;
        pos.push(x, y, z); xy.push(x, y, sm((1 - Math.abs(u)) / 0.16) * sm((y - Y0) / 1.3) * sm((Y1 - y) / 1.3)); cl.push(1, 1, 1, 1);
      }
      for (i = 0; i < NY; i++) for (j = 0; j < NX; j++) { var a = i * (NX + 1) + j, b = a + NX + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
      var g = track(new THREE.BufferGeometry()); g.setIndex(idx); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(cl, 4)); g.computeVertexNormals();
      var mt = mat('#ffffff', base, { vertexColors: true, side: THREE.DoubleSide, depthWrite: false, roughness: 0.85 }), m = new THREE.Mesh(g, mt); m.renderOrder = 6; neck.add(m);
      return { g: g, xy: xy, mt: mt, col: new THREE.Color(col), key: '' };
    }
    var skin = sheet(0, 0.985, SZY_COL.skin, 0.8), plat = sheet(0.22, 0.86, SZY_COL.plat, 0.5), WOUND = new THREE.Color('#9c3b33');
    function holeMask(x, y, o, sc) {
      var best = 0;
      INC.holes.forEach(function (H) {
        var cx = incC[0] + (H.c[0] - incC[0]) * o, cy = incC[1] + (H.c[1] - incC[1]) * o, rx = (incL + 0.2 + (H.r[0] - incL - 0.2) * o) * sc, ry = (0.06 + (H.r[1] - 0.06) * o) * sc;
        var q = Math.sqrt(Math.pow((x - cx) / rx, 2) + Math.pow((y - cy) / ry, 2)); best = Math.max(best, 1 - sm((q - 0.86) / 0.14));
      });
      return best;
    }
    function sheetUpd(S, o, sc, rimW) {
      var k = o.toFixed(3); if (S.key === k) return; S.key = k;
      var C = S.g.attributes.color.array, xy = S.xy;
      for (var i = 0, n = xy.length / 3; i < n; i++) {
        var x = xy[i * 3], y = xy[i * 3 + 1], b = xy[i * 3 + 2], hm = o > 0.001 ? holeMask(x, y, o, sc) : 0, rim = o > 0.001 ? Math.max(0, holeMask(x, y, o, sc * (1 + rimW)) - hm) : 0;
        var cc = S.col.clone().lerp(WOUND, Math.min(1, rim * 1.6));
        C[i * 4] = cc.r; C[i * 4 + 1] = cc.g; C[i * 4 + 2] = cc.b; C[i * 4 + 3] = b * (1 - hm);
      }
      S.g.attributes.color.needsUpdate = true;
    }
    // linia cięcia (rysowana)
    var incCurve = new THREE.CatmullRomCurve3(INC.pts.map(function (p) { return new V3(p[0], p[1], N.skinZ(p[0], p[1]) + 0.03); }), false, 'centripetal');
    var incGeo = track(new THREE.TubeGeometry(incCurve, 60, 0.05, 6, false)), incMesh = new THREE.Mesh(incGeo, mat(A.COL.cut, 1, { emissive: A.COL.cut, emissiveIntensity: 0.25 })); incMesh.renderOrder = 7; neck.add(incMesh);

    /* ---- szkielet, krtań, tchawica, przełyk ---- */
    var mCart = mat(SZY_COL.cart, 1, { roughness: 0.4 }), mBone = mat(SZY_COL.bone, 0.9);
    var trach = new THREE.Mesh(track(new THREE.CylinderGeometry(1.0, 1.0, 9.0, 28, 1, true)), mat(SZY_COL.trach, 1, { side: THREE.DoubleSide, roughness: 0.45 })); trach.position.set(0, -3.05, 0); neck.add(trach);
    for (var ri = 0; ri < 18; ri++) { var ring = new THREE.Mesh(track(new THREE.TorusGeometry(1.03, 0.09, 6, 28, Math.PI * 1.55)), mCart); ring.rotation.set(Math.PI / 2, 0, Math.PI / 2 + Math.PI * 0.225); ring.position.set(0, 1.05 - ri * 0.44, 0); neck.add(ring); }
    // chrząstka pierścieniowata: pas z wyższą blaszką tylną
    (function () {
      var NA = 40, pos = [], idx = [];
      for (var i = 0; i <= NA; i++) { var a = -Math.PI + 2 * Math.PI * i / NA, top = 2.0 + 1.6 * sm((Math.abs(a) - 1.6) / 1.3), x = 1.14 * Math.sin(a), z = 1.14 * Math.cos(a); pos.push(x, 1.4, z, x, top, z); }
      for (i = 0; i < NA; i++) idx.push(i * 2, i * 2 + 2, i * 2 + 1, i * 2 + 1, i * 2 + 2, i * 2 + 3);
      var g = track(new THREE.BufferGeometry()); g.setIndex(idx); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
      neck.add(new THREE.Mesh(g, mat(SZY_COL.cart, 1, { side: THREE.DoubleSide, roughness: 0.4 })));
    })();
    // chrząstka tarczowata: dwie blaszki od krawędzi przedniej (wyniosłość) do tylnej, rogi górne i dolne
    [-1, 1].forEach(function (s) {
      var NU = 16, NV = 14, pos = [], idx = [];
      for (var i = 0; i <= NU; i++) for (var j = 0; j <= NV; j++) {
        var u = i / NU, v = j / NV, yl = 2.6 - 0.35 * u, yu = 5.55 + 0.45 * u, y = yl + (yu - yl) * v, z0 = N.zf(y), x = s * 2.25 * u, z = z0 + (-0.75 - z0) * u + 0.18 * Math.sin(Math.PI * u);
        pos.push(x, y, z);
      }
      for (i = 0; i < NU; i++) for (j = 0; j < NV; j++) { var a = i * (NV + 1) + j, b = a + NV + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
      var g = track(new THREE.BufferGeometry()); g.setIndex(idx); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
      neck.add(new THREE.Mesh(g, mat(SZY_COL.cart, 1, { side: THREE.DoubleSide, roughness: 0.4 })));
      tube([[s * 2.25, 5.95, -0.75], [s * 2.35, 7.3, -0.95]], 0.12, mCart); tube([[s * 2.22, 2.3, -0.72], [s * 1.35, 1.9, -0.6]], 0.12, mCart);
    });
    tube(P.hyoid, 0.24, mBone);
    var mCT = mat('#b4473e', 1); [-1, 1].forEach(function (s) { var t = tube(N.mir(P.ct, s), 0.16, mCT); t.mesh.scale.set(1, 1, 0.7); t.mesh.position.z = 0.25; });
    var eso = new THREE.Mesh(track(new THREE.CylinderGeometry(0.95, 0.95, 13, 24, 1, true)), mat(SZY_COL.eso, 1, { side: THREE.DoubleSide })); eso.scale.set(1, 1, 0.72); eso.position.set(0.35, -0.6, -1.75); neck.add(eso);
    [-1, 1].forEach(function (s) { tube(N.mir(P.clav, s), 0.48, mBone); });
    var manu = new THREE.Mesh(track(new THREE.BoxGeometry(5.0, 3.0, 0.8)), mBone); manu.position.set(0, -6.7, 1.75); neck.add(manu);

    /* ---- naczynia i nerwy ---- */
    var mA = mat(SZY_COL.art, 1), mV = mat(SZY_COL.vein, 1), mN = mat(SZY_COL.nerve, 1, { emissive: '#000000' }), mNr = mat(SZY_COL.nerve, 1, { emissive: '#000000' });
    var side = { '-1': {}, '1': {} };
    [-1, 1].forEach(function (s) {
      var S = side[s], k = s < 0 ? 'R' : 'L';
      S.mA = mat(SZY_COL.art, 1); S.mV = mat(SZY_COL.vein, 1); S.mVg = mat(SZY_COL.nerve, 1);
      S.cca = tube(P.cca[k], 0.42, S.mA); tube(N.mir(P.ica, s), 0.36, S.mA); tube(N.mir(P.eca, s), 0.3, S.mA);
      S.ijv = tube(N.mir(P.ijv, s), 0.6, S.mV); tube(N.mir(P.scv, s), 0.52, mV); tube(N.mir(P.bcv, s), 0.58, mV);
      tube(P.sca[k], 0.42, mA); tube(N.mir(P.tct, s), 0.2, mA);
      S.ita = tube(N.mir(P.ita, s), 0.15, mA);
      S.vag = tube(P.vag[k], 0.14, S.mVg);
      S.rln = tube(P.rln[k], 0.085, mNr);
      tube(N.mir(P.sln, s), 0.07, mN); tube(N.mir(P.isln, s), 0.055, mN); S.ebs = tube(N.mir(P.ebsln, s), 0.055, mNr);
    });
    tube(P.bct, 0.55, mA);

    /* ---- tarczyca: części w grupach obracanych wokół więzadła Berry’ego ---- */
    var TH = szyThyroid(), mThy = mat(SZY_COL.thy, 0.97, { roughness: 0.5 }), mThyP = { '-1': mat(SZY_COL.thy, 0.97, { roughness: 0.5 }), '1': mat(SZY_COL.thy, 0.97, { roughness: 0.5 }) };
    var whole = new THREE.Mesh(lvGeo(TH.all), mThy); whole.renderOrder = 2; neck.add(whole);
    function pivot(px, part, s) { var g = new THREE.Group(); g.position.set(px, 0.6, -0.35); neck.add(g); var m = new THREE.Mesh(lvGeo(TH[part]), mThyP[s]); m.position.set(-px, -0.6, 0.35); m.renderOrder = 2; g.add(m); g.userData.p0 = g.position.clone(); return g; }
    var gR = pivot(-1.15, 'R', -1), gL = pivot(1.15, 'L', 1), lobeG = { '-1': gR, '1': gL };
    // cieśń z płatem piramidowym — w grupie płata prawego (usuwana z nim; w lobektomii przecięta przy płacie lewym)
    var isthM = new THREE.Mesh(lvGeo(TH.I), mThyP['-1']); isthM.position.set(1.15, -0.6, 0.35); isthM.renderOrder = 2; gR.add(isthM);
    gR.visible = gL.visible = false;
    // naczynia na torebce (w grupach płatów) — własne materiały, wygaszane z płatem
    var mAl = { '-1': mat(SZY_COL.art, 1), '1': mat(SZY_COL.art, 1) }, mVl = { '-1': mat(SZY_COL.vein, 1), '1': mat(SZY_COL.vein, 1) };
    function inLobe(s, p) { var g = lobeG[s]; return V(p).sub(g.userData.p0); }   // punkt świata → układ grupy płata (przed obrotem)
    // naczynia tarczowe: tętnica i żyła górna, żyła środkowa, żyły dolne, gałęzie torebkowe tętnicy tarczowej dolnej; więzadło Berry’ego
    var mBer = mat('#efe6d6', 0.95);
    [-1, 1].forEach(function (s) {
      var S = side[s], g = lobeG[s];
      function local(P0) { return N.mir(P0, s).map(function (p) { return inLobe(s, p).toArray(); }); }
      S.sta = split(N.mir(P.sta, s), 0.13, mA, 0.84, g, 0.1, mAl[s]); S.stv = split(N.mir(P.stv, s).slice().reverse(), 0.12, mV, 0.86, g, null, mVl[s]);
      S.sta.dist.mesh.position.copy(g.userData.p0).negate(); S.stv.dist.mesh.position.copy(g.userData.p0).negate();
      tube(local(P.staA), 0.07, mAl[s], g); tube(local(P.staP), 0.07, mAl[s], g);
      S.mtv = split(N.mir(P.mtv, s).slice().reverse(), 0.12, mV, 0.75, g, null, mVl[s]); S.mtv.dist.mesh.position.copy(g.userData.p0).negate();
      S.itv = split(N.mir(P.itv, s).slice().reverse(), 0.1, mV, 0.9, g, null, mVl[s]); S.itv.dist.mesh.position.copy(g.userData.p0).negate();
      S.berry = tube(N.mir(P.berry, s), 0.13, mBer);
      // gałęzie torebkowe tętnicy tarczowej dolnej (w grupie płata) i podwiązania na nich
      var e = N.mir(P.ita, s)[P.ita.length - 1];
      S.cap = [[[e[0], e[1] + 0.5, e[2]], [s * 2.3, 0.75, -0.62]], [[e[0] + s * 0.1, e[1] - 0.45, e[2] + 0.1], [s * 2.4, -0.55, -0.5]]].map(function (q) {
        var l = new THREE.Mesh(track(new THREE.TorusGeometry(0.08, 0.035, 6, 12)), ligMat); l.position.fromArray(q[0]); neck.add(l); l.visible = false;
        tube(q.map(function (p) { return inLobe(s, p).toArray(); }), 0.06, mAl[s], g); tube([e, q[0]], 0.065, mA); return l;
      });
    });

    /* ---- przytarczyce ---- */
    var GLS = {}, glMats = {};
    var GRAD = { n: [0.3, 0.2, 0.12], ad: [0.78, 0.52, 0.4], hy: [0.55, 0.4, 0.3] };
    [['rsup', -1, 'sup'], ['rinf', -1, 'inf'], ['lsup', 1, 'sup'], ['linf', 1, 'inf']].forEach(function (q, qi) {
      var st = (O.gl || {})[q[0]] || 'n', R = GRAD[st].slice(); if (st === 'hy') R = R.map(function (v) { return v * [1, 1.15, 0.9, 1.08][qi]; });
      var G = N.glandAt(q[1], q[2], R[2] * 0.9), mt = mat(st === 'ad' ? SZY_COL.ad : st === 'hy' ? SZY_COL.hy : SZY_COL.pt, 1, { roughness: 0.45 });
      var m = new THREE.Mesh(track(new THREE.SphereGeometry(1, 20, 14)), mt); m.scale.set(R[1], R[0], R[2]);
      var n = V(G.n), up = new V3(0, 1, 0), lat = new V3().crossVectors(up, n).normalize(), up2 = new V3().crossVectors(n, lat);
      m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(lat, up2, n)); m.position.fromArray(G.c); neck.add(m);
      // szypuła: z końca tętnicy tarczowej dolnej do bieguna przytarczycy (bliżej tętnicy)
      var e = N.mir(P.ita, q[1])[P.ita.length - 1], tip = V(G.c).addScaledVector(up2, q[2] === 'sup' ? -R[0] * 0.8 : R[0] * 0.8);
      var mid = V(e).lerp(tip, 0.5).add(new V3(0, 0, -0.08)), ped = split([e, mid.toArray(), tip.toArray()], 0.055, mA, 0.82, neck);
      GLS[q[0]] = { m: m, mt: mt, c: V(G.c), st: st, ped: ped, side: q[1], R: R, n: n, up: up2 }; glMats[q[0]] = mt;
    });
    // kikut przytarczycy (subtotalna): część odcięta oddala się, kikut z klipsem
    var keepG = O.keep ? GLS[O.keep] : null, keepCut = null, keepClip = null;
    if (keepG) {
      keepCut = new THREE.Mesh(track(new THREE.SphereGeometry(1, 18, 12)), mat(SZY_COL.hy, 1)); keepCut.scale.copy(keepG.m.scale).multiplyScalar(0.8); keepCut.quaternion.copy(keepG.m.quaternion); neck.add(keepCut); keepCut.visible = false;
      keepClip = new THREE.Mesh(track(new THREE.BoxGeometry(0.42, 0.07, 0.12)), clipMat); keepClip.position.copy(keepG.c).addScaledVector(keepG.n, 0.12); keepClip.quaternion.copy(keepG.m.quaternion); neck.add(keepClip); keepClip.visible = false;
    }
    // klipsy na szypułach usuwanych gruczołów
    var pedClip = {}; (O.out || []).forEach(function (k) { var G = GLS[k], c = new THREE.Mesh(track(new THREE.BoxGeometry(0.3, 0.06, 0.1)), clipMat); c.position.copy(G.ped.c.getPointAt(0.74)); c.quaternion.setFromUnitVectors(new V3(0, 1, 0), G.ped.c.getTangentAt(0.74)); neck.add(c); c.visible = false; pedClip[k] = c; });

    /* ---- mięśnie: podgnykowe, MOS, łopatkowo-gnykowy ---- */
    var mStrap = mat(SZY_COL.strap, 0.92), mSt2 = mat('#b65d50', 0.92), mScm = mat(SZY_COL.scm, 0.55);
    var straps = { '-1': [], '1': [] };
    [-1, 1].forEach(function (s) {
      [[P.sh, 1.5, 1.2, 0.22, mStrap], [P.st, 2.1, 1.6, 0.2, mSt2], [P.th, 1.5, 1.3, 0.18, mSt2]].forEach(function (q) { var m = new THREE.Mesh(szyRibbon(N.mir(q[0], s), q[1], q[2], q[3]), q[4]); neck.add(m); straps[s].push(m); });
    });
    var scm = { '-1': new THREE.Mesh(szyRibbon(N.mir(P.scm, -1), 3.2, 2.3, 0.7), mScm), '1': new THREE.Mesh(szyRibbon(P.scm, 3.2, 2.3, 0.7), mScm) }; neck.add(scm['-1'], scm['1']);

    /* ---- grasica szyjna (rogi) ---- */
    var thymG = new THREE.Group(), mThym = mat(SZY_COL.thym, 0.9); neck.add(thymG);
    if (op === 'sub' || op === 'tot') [-1, 1].forEach(function (s) { var t = tube(N.mir(P.thym, s), 0.36, mThym, thymG, 0.5); t.mesh.scale.set(1, 1, 0.6); t.mesh.position.z = 0.4 * (P.thym[1][2]); tube(N.mir(P.ttl, s), 0.09, mThym, thymG); });
    else thymG.visible = false;

    /* ---- węzły: przedział VI, boczny lewy (II–V) ---- */
    var mFat = mat(SZY_COL.fat, 0.62, { depthWrite: false, roughness: 0.7 }), mNode = mat(SZY_COL.node, 1, { roughness: 0.5 });
    function nodesIn(ids, parent) { ids.forEach(function (k, ki) { var c = N.PK[k].c, r = N.PK[k].r, n = Math.max(2, Math.round(r[1] * 1.6)); for (var i = 0; i < n; i++) { var u = (i + 0.5) / n, sph = new THREE.Mesh(track(new THREE.SphereGeometry(0.17 + 0.05 * ((i + ki) % 3), 12, 9)), mNode); sph.position.set(c[0] + r[0] * 0.35 * Math.sin(i * 2.4 + ki), c[1] + r[1] * (u * 1.5 - 0.75), c[2] + r[2] * 0.2 * Math.cos(i * 1.7)); parent.add(sph); } }); }
    var cndG = new THREE.Group(), lndG = new THREE.Group(); neck.add(cndG, lndG);
    if (O.cnd) { var pkC = new THREE.Mesh(lvGeo(szyPack(['pre', 'ptr', 'parR', 'parL'], [-3.0, -6.4, -1.8], [2.6, 3.0, 1.9])), mFat); pkC.renderOrder = 5; cndG.add(pkC); nodesIn(['pre', 'ptr', 'parR', 'parL'], cndG); }
    var lat = {};
    if (O.lnd) {
      var pkL = new THREE.Mesh(lvGeo(szyPack(['II', 'III', 'IV', 'Vb'], [2.8, -4.8, -3.4], [7.8, 10.7, 0.9])), mFat); pkL.renderOrder = 5; lndG.add(pkL); nodesIn(['II', 'III', 'IV', 'Vb'], lndG);
      var mNl = mat(SZY_COL.nerve, 1), mMus = mat('#a9544a', 0.75);
      lat.xi = tube(P.xi, 0.075, mNl); lat.phr = tube(P.phr, 0.075, mNl); lat.td = tube(P.td, 0.11, mat(SZY_COL.lymph, 1)); lat.tca = tube(P.tca, 0.1, mA);
      lat.asc = new THREE.Mesh(szyRibbon(P.asc, 1.3, 1.1, 0.6), mMus); neck.add(lat.asc);
      [0, 1, 2].forEach(function (i) { tube(P.bp.map(function (p) { return [p[0] + 0.25 * i, p[1] - 0.6 * i, p[2] - 0.2 * i]; }), 0.16, mNl); });
      lat.omo = new THREE.Mesh(szyRibbon(P.omo, 0.8, 0.7, 0.18), mStrap); neck.add(lat.omo);
    }

    /* ---- przedramię (autoprzeszczep) ---- */
    var arm = null;
    if (op === 'tot') arm = (function () {
      var g = new THREE.Group(), R = N.ARM, NX = 140, NT = 120, pos = [], cl = [], idx = [], par = []; grp.add(g); g.visible = false;
      for (var i = 0; i <= NX; i++) for (var j = 0; j <= NT; j++) { var x = R.x0 + (R.x1 - R.x0) * i / NX, th = 2 * Math.PI * j / NT; pos.push(x, R.ry(x) * Math.cos(th), R.rz(x) * Math.sin(th)); par.push(x, th); cl.push(1, 1, 1, 1); }
      for (i = 0; i < NX; i++) for (j = 0; j < NT; j++) { var a = i * (NT + 1) + j, b = a + NT + 1; idx.push(a, a + 1, b, b, a + 1, b + 1); }
      var sg = track(new THREE.BufferGeometry()); sg.setIndex(idx); sg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); sg.setAttribute('color', new THREE.Float32BufferAttribute(cl, 4)); sg.computeVertexNormals();
      var sm0 = mat('#ffffff', 0.85, { vertexColors: true, side: THREE.DoubleSide, depthWrite: false, roughness: 0.85 }), skinM = new THREE.Mesh(sg, sm0); skinM.renderOrder = 6; g.add(skinM);
      var thc = R.th, xc = (R.inc[0] + R.inc[1]) / 2, xl = (R.inc[1] - R.inc[0]) / 2, skc = new THREE.Color(SZY_COL.skin), key = '';
      function hole(o) {
        var k = o.toFixed(3); if (k === key) return; key = k; var C = sg.attributes.color.array;
        for (var q = 0; q < par.length / 2; q++) {
          var x = par[q * 2], th = par[q * 2 + 1], dth = Math.atan2(Math.sin(th - thc), Math.cos(th - thc)), e = sm((R.x1 - x) / 1.2) * sm((x - R.x0) / 1.2);
          var qq = Math.sqrt(Math.pow((x - xc) / (xl + 0.2), 2) + Math.pow(dth / Math.max(0.01, 0.34 * o), 2)), hm = o > 0.001 ? 1 - sm((qq - 0.85) / 0.15) : 0, rim = o > 0.001 ? Math.max(0, (1 - sm((qq / 1.25 - 0.85) / 0.15)) - hm) : 0;
          var cc = skc.clone().lerp(WOUND, Math.min(1, rim * 1.5)); C[q * 4] = cc.r; C[q * 4 + 1] = cc.g; C[q * 4 + 2] = cc.b; C[q * 4 + 3] = e * (1 - hm);
        }
        sg.attributes.color.needsUpdate = true;
      }
      var mR = mat(SZY_COL.bone, 1); [[[-6.6, 1.0, -0.3], [5.6, 1.35, 0.1]], [[-6.9, -1.1, -0.6], [5.7, -1.25, -0.2]]].forEach(function (b) { tube(b, 0.45, mR, g); });
      var mc = new V3(xc, 0.62 * R.ry(xc) * Math.cos(thc), 0.62 * R.rz(xc) * Math.sin(thc)), br = new THREE.Mesh(track(new THREE.SphereGeometry(1, 28, 16)), mat('#b4473e', 1)); br.scale.set(3.3, 0.95, 0.8); br.position.copy(mc); br.rotation.x = thc - Math.PI / 2; g.add(br);
      var dir = new V3(0, Math.cos(thc), Math.sin(thc)), lineC = new THREE.CatmullRomCurve3([R.inc[0], xc, R.inc[1]].map(function (x) { return new V3(x, (R.ry(x) + 0.03) * Math.cos(thc), (R.rz(x) + 0.03) * Math.sin(thc)); })), lineG = track(new THREE.TubeGeometry(lineC, 40, 0.05, 6, false));
      var line = new THREE.Mesh(lineG, mat(A.COL.cut, 1, { emissive: A.COL.cut, emissiveIntensity: 0.25 })); line.renderOrder = 7; g.add(line);
      var mFr = mat(SZY_COL.hy, 1), mSut = mat('#22305c', 1), pk = R.pockets.map(function (x) {
        var base = new V3(x, mc.y, mc.z).addScaledVector(dir, 0.5), frs = [0, 1, 2].map(function (i) { var b = new THREE.Mesh(track(new THREE.BoxGeometry(0.42, 0.16, 0.16)), mFr); b.position.copy(base).add(new V3(0.12 * (i - 1), 0.08 * (i - 1), -0.05 * i)); b.rotation.z = 0.3 * (i - 1); g.add(b); b.visible = false; return b; });
        var su = new THREE.Mesh(track(new THREE.TorusGeometry(0.16, 0.045, 6, 14)), mSut); su.position.copy(base).addScaledVector(dir, 0.32); su.quaternion.setFromUnitVectors(new V3(0, 0, 1), dir); g.add(su); su.visible = false;
        return { frs: frs, su: su, p: base };
      });
      return { g: g, hole: hole, line: line, lineG: lineG, pk: pk, br: br, mc: mc, dir: dir };
    })();

    /* ---- PTH śródoperacyjny (wykres słupkowy obok szyi) ---- */
    var pth = null;
    if (has('pth')) pth = (function () {
      var g = new THREE.Group(); grp.add(g); g.visible = false; var H = 3.8, X0 = 7.2, mB = mat('#5b7fa6', 1), mOk = mat('#2f9e44', 1), mLn = mat(A.COL.cut, 1);
      var bars = N.PTH.map(function (q, i) { var b = new THREE.Mesh(track(new THREE.BoxGeometry(0.62, 1, 0.5)), i === 3 ? mOk : mB); b.position.set(X0 + i * 1.2, -2.2, 1.2); g.add(b); return { m: b, v: q[1] }; });
      var top = Math.max.apply(null, N.PTH.map(function (q) { return q[1]; })), y50 = -2.2 + top * 0.5 * H;
      for (var k = 0; k < 11; k++) { var dsh = new THREE.Mesh(track(new THREE.BoxGeometry(0.22, 0.05, 0.05)), mLn); dsh.position.set(X0 - 0.45 + k * 0.42, y50, 1.5); g.add(dsh); }
      var axis = new THREE.Mesh(track(new THREE.BoxGeometry(4.6, 0.05, 0.05)), mat('#56636f', 1)); axis.position.set(X0 + 1.8, -2.2, 1.2); g.add(axis);
      return { g: g, bars: bars, H: H, y50: y50, X0: X0 };
    })();

    /* ---- etykiety ---- */
    var L = {
      inc: lab(INC.name, INC.sub, A.COL.cut, 'cut'), plat: lab('Mięsień szeroki szyi', 'uniesiony z płatami skóry', SZY_COL.plat), strap: lab('Mięśnie podgnykowe', 'rozdzielone w linii pośrodkowej', SZY_COL.strap),
      notch: lab('Wcięcie jarzmowe mostka', '', '#7d6152', 'ghost'), prom: lab('Wyniosłość krtaniowa', '', '#7d6152', 'ghost'),
      lobR: lab('Płat prawy tarczycy', '', SZY_COL.thy), lobL: lab('Płat lewy tarczycy', '', SZY_COL.thy), isth: lab('Cieśń', 'na pierścieniach 2–4 tchawicy', SZY_COL.thy), pyr: lab('Płat piramidowy', '', SZY_COL.thy),
      trach: lab('Tchawica', '', '#8fa1ad'), tc: lab('Chrząstka tarczowata', '', '#8fa1ad'), cric: lab('Chrząstka pierścieniowata', '', '#8fa1ad'),
      cca: lab('Tętnica szyjna wspólna', '', SZY_COL.art), ijv: lab('Żyła szyjna wewnętrzna', '', SZY_COL.vein), vag: lab('Nerw błędny', '', SZY_COL.nerve),
      rlnR: lab('Nerw krtaniowy wsteczny prawy', '', SZY_COL.nerve), rlnL: lab('Nerw krtaniowy wsteczny lewy', 'pionowo, w rowku tchawiczo-przełykowym', SZY_COL.nerve),
      ebs: lab('Gałąź zewnętrzna nerwu krtaniowego górnego', 'do mięśnia pierścienno-tarczowego', SZY_COL.nerve), sta: lab('Tętnica tarczowa górna', '', SZY_COL.art), ct: lab('Mięsień pierścienno-tarczowy', '', '#b4473e'),
      staLig: lab('Naczynia tarczowe górne', 'podwiązane pojedynczo przy torebce', '#3b4048', 'cut'), mtv: lab('Żyła tarczowa środkowa', '', SZY_COL.vein), ita: lab('Tętnica tarczowa dolna', '', SZY_COL.art),
      ber: lab('Więzadło Berry’ego', '', '#b9ad98'), zuck: lab('Guzek Zuckerkandla', 'nerw leży głębiej', SZY_COL.thy), ionm: lab('Neuromonitoring', 'sygnał nerwu potwierdzony', '#2f9e44'),
      capLig: lab('Gałęzie tętnicy tarczowej dolnej', 'podwiązane na torebce', '#3b4048', 'cut'), stump: lab('Kikuty naczyń tarczowych', '', '#3b4048', 'cut'), leftStump: lab('Brzeg cieśni zamknięty', 'płat lewy pozostaje', SZY_COL.thy),
      eso: lab('Przełyk', '', '#a8806c'), scm: lab('Mięsień mostkowo-obojczykowo-sutkowy', op === 'lnd' ? 'odciągnięty bocznie' : '', SZY_COL.scm)
    };
    var GL_NM = { rsup: 'Przytarczyca górna prawa', rinf: 'Przytarczyca dolna prawa', lsup: 'Przytarczyca górna lewa', linf: 'Przytarczyca dolna lewa' };
    var GL_SUB = { n: '', ad: 'gruczolak', hy: 'rozrost' };
    Object.keys(GLS).forEach(function (k) { var G = GLS[k]; G.L = lab(G.st === 'ad' ? 'Gruczolak przytarczycy' : GL_NM[k], G.st === 'ad' ? GL_NM[k].replace('Przytarczyca', 'przytarczyca') : GL_SUB[G.st], G.st === 'ad' ? SZY_COL.ad : SZY_COL.pt); });
    if (keepG) { L.keep = lab('Kikut przytarczycy', 'ok. 40–80 mg, oznaczony klipsem', SZY_COL.hy); }
    if (thymG.visible) L.thym = lab('Rogi grasicy', 'mogą zawierać przytarczyce nadliczbowe', '#c9a777');
    if (O.cnd) { ['pre', 'ptr', 'parR', 'parL'].forEach(function (k) { L['pk' + k] = lab(N.PK[k].name, '', SZY_COL.node); }); }
    if (O.lnd) { ['II', 'III', 'IV', 'Vb'].forEach(function (k) { L['pk' + k] = lab(N.PK[k].name, '', SZY_COL.node); });
      L.xi = lab('Nerw dodatkowy (XI)', 'zachowany', SZY_COL.nerve); L.phr = lab('Nerw przeponowy', 'na mięśniu pochyłym przednim', SZY_COL.nerve); L.td = lab('Przewód piersiowy', 'przy kącie żylnym', '#c9b98a');
      L.bp = lab('Splot ramienny', '', SZY_COL.nerve); L.omo = lab('Mięsień łopatkowo-gnykowy', '', SZY_COL.strap); }
    if (pth) { pth.bars.forEach(function (b, i) { b.L = lab(N.PTH[i][0], '', i === 3 ? '#2f9e44' : '#5b7fa6'); }); pth.L50 = lab('50% najwyższej wartości', 'kryterium Miami (10 min)', A.COL.cut); pth.Lt = lab('PTH śródoperacyjny', 'spadek o ponad 50% — wyleczenie', '#2f9e44'); }
    if (arm) { arm.L = { br: lab('Mięsień ramienno-promieniowy', 'przedramię bez przetoki dializacyjnej', '#b4473e'), fr: lab('Fragmenty przytarczycy', 'ok. 1 × 1 × 3 mm, 15–20 sztuk', SZY_COL.hy),
      su: lab('Kieszonki zamknięte szwem niewchłanialnym', 'oznaczenie do ewentualnej reoperacji', '#22305c'), inc: lab('Cięcie na przedramieniu', '', A.COL.cut, 'cut') }; }

    var tmp = new V3();
    function lobeAnchor(s) { var g = lobeG[s]; return g.visible ? new V3(s * 2.45, 0.4, 0.75).sub(g.userData.p0).applyQuaternion(g.quaternion).add(g.position) : new V3(s * 2.45, 0.4, 0.75); }

    var tool = { d: d, grp: grp, overlay: false, el: null, labels: labels,
      update: function (m) {
        var fk = FR[S.frame] ? FR[S.frame].k : '', armOn = !!arm && fk === 'at';
        neck.visible = !armOn; if (arm) arm.g.visible = armOn; if (pth) pth.g.visible = fk === 'pth';
        labels.forEach(function (Lb) { Lb.alpha = 0; });
        var acc = lin('acc', m), incT = clamp01(acc / 0.3), openO = sm((acc - 0.3) / 0.4), strapO = sm((acc - 0.7) / 0.3), post = m >= O.end - 1e-4;
        // skóra, mięsień szeroki szyi, linia cięcia
        sheetUpd(skin, openO, 1, 0.12); sheetUpd(plat, openO, 0.94, 0.06);
        var inAcc = fk === 'acc';
        skin.mt.opacity = inAcc ? 0.84 - 0.26 * openO : 0.2; plat.mt.opacity = inAcc ? 0.5 - 0.15 * openO : 0.08;
        incMesh.visible = incT > 0 && openO < 0.35; incGeo.setDrawRange(0, Math.round(incT * 60) * 6 * 6);
        // mięśnie podgnykowe: rozsunięte w linii pośrodkowej i odciągnięte bocznie (w paratyreoidektomii celowanej — tylko prawe)
        [-1, 1].forEach(function (s) {
          var f = op === 'mip' && s > 0 ? 0 : strapO;
          straps[s].forEach(function (mm, i) { mm.position.set(s * (1.5 + 0.25 * i) * f, 0, 0.25 * f); setOp(mm.material, inAcc ? 0.92 - 0.4 * f : 0.92 - 0.66 * f); });
        });
        // tarczyca: części i ich ruch
        var rot = { '-1': 0, '1': 0 }, gone = { '-1': 0, '1': 0 }, cut = { '-1': {}, '1': {} };
        function steps(s, sup, mid, rln, rem) {
          cut[s].sta = sup > 0.5; cut[s].staL = sup > 0.45; cut[s].mtv = mid > 0.12; cut[s].cap = mid > 0.55; cut[s].itv = mid > 0.3; cut[s].ber = rln > 0.6;
          rot[s] = thy ? sm(mid / 0.7) * 1.0 + 0.25 * rem : 0; gone[s] = rem;
          return { sup: sup, mid: mid, rln: rln, rem: rem };
        }
        var stR, stL;
        if (thy) {
          stR = steps(-1, ph('sup', m), ph('mid', m), ph('rln', m), ph('rem', m));
          var lf = lin('left', m); stL = steps(1, sm(lf / 0.25), sm((lf - 0.25) / 0.25), sm((lf - 0.5) / 0.25), sm((lf - 0.75) / 0.25));
        } else {
          var eR = op === 'mip' ? ph('exp', m) * (1 - ph('pth', m)) : ph('expR', m) * (1 - ph('expL', m)), eL = op === 'mip' ? 0 : ph('expL', m) * (1 - (op === 'bne' ? ph('pth', m) : op === 'sub' ? ph('rem3', m) : ph('rem4', m)));
          rot['-1'] = 0.55 * eR; rot['1'] = 0.55 * eL;
        }
        var parts = thy && m > 1.95, thyO = acc < 1 ? 0.97 : fk === 'anat' ? 0.72 : thy ? 0.9 : 0.55;
        whole.visible = thy && !parts; gR.visible = gL.visible = parts || !thy;
        setOp(mThy, thyO);
        [-1, 1].forEach(function (s) {
          var g = lobeG[s], a = rot[s], r = gone[s], fo = 1 - sm((r - 0.25) / 0.6);
          g.quaternion.setFromAxisAngle(new V3(0, 1, 0), -s * a);
          g.position.copy(g.userData.p0).add(new V3(-s * 0.3 * a, 3.5 * sm(r / 0.8), 0.65 * a + 5 * sm(r / 0.8)));
          g.visible = (parts || !thy) && r < 0.98;
          setOp(mThyP[s], thyO * fo); setOp(mAl[s], fo); setOp(mVl[s], fo);
        });
        // lobektomia: płat lewy zostaje (nie obraca się), cieśń usuwana z płatem prawym
        if (op === 'lob') { gL.quaternion.identity(); gL.position.copy(gL.userData.p0); gL.visible = parts; setOp(mThyP['1'], thyO); }
        // naczynia tarczowe: przecięcia
        [-1, 1].forEach(function (s) {
          var S0 = side[s], c = cut[s];
          if (thy) {
            S0.sta.set(c.sta, c.staL); S0.stv.set(c.sta, c.staL); S0.mtv.set(c.mtv, c.mtv); S0.itv.set(c.itv, c.itv);
            S0.cap.forEach(function (l) { l.visible = !!c.cap; }); S0.berry.mesh.visible = !c.ber;
          } else { S0.sta.set(false, false); S0.stv.set(false, false); S0.mtv.set(false, false); S0.itv.set(false, false); S0.cap.forEach(function (l) { l.visible = false; }); }
          if (op === 'lob' && s > 0) { S0.sta.set(false, false); S0.stv.set(false, false); S0.mtv.set(false, false); S0.itv.set(false, false); S0.cap.forEach(function (l) { l.visible = false; }); S0.berry.mesh.visible = true; }
        });
        // nerwy: błysk przy stymulacji (neuromonitoring)
        var stim = thy ? Math.max(Math.sin(Math.PI * clamp01((lin('rln', m) - 0.1) / 0.35)), op !== 'lob' && has('left') ? Math.sin(Math.PI * clamp01((lin('left', m) - 0.55) / 0.15)) : 0) : 0;
        mNr.emissive.setRGB(0.55 * stim, 0.45 * stim, 0); mNr.emissiveIntensity = 1;
        // przytarczyce
        var out = O.out || [];
        Object.keys(GLS).forEach(function (k) {
          var G = GLS[k], idx = out.indexOf(k), r = 0, clip = false;
          if (idx >= 0) {
            if (op === 'mip' || op === 'bne') { r = ph('rem', m); clip = lin('rem', m) > 0.3; }
            else if (op === 'sub') { r = ph('rem3', m); clip = lin('rem3', m) > 0.2; }
            else { var q = lin('rem4', m); r = sm((q - idx * 0.2) / 0.3); clip = q > idx * 0.2 + 0.05; }
          }
          G.m.position.copy(G.c).addScaledVector(G.n, -0.2 * r).add(new V3(0, 0, 6 * sm((r - 0.3) / 0.7)));
          var gon = r > 0.98; G.m.visible = !gon; setOp(G.mt, 1 - 0.8 * sm((r - 0.5) / 0.5));
          G.ped.set(clip, false); if (pedClip[k]) pedClip[k].visible = clip;
          // tyreoidektomia: przytarczyce zostają (szypuły nienaruszone)
        });
        if (keepG) {
          var rs = ph('rest', m); keepCut.visible = rs > 0.05 && rs < 0.98; keepCut.position.copy(keepG.c).addScaledVector(keepG.up, 0.25).add(new V3(0, 0, 5 * sm((rs - 0.4) / 0.6)));
          keepG.m.scale.set(keepG.R[1] * (1 - 0.45 * rs), keepG.R[0] * (1 - 0.5 * rs), keepG.R[2] * (1 - 0.35 * rs)); keepClip.visible = rs > 0.6;
        }
        // grasica, węzły
        if (thymG.visible || op === 'sub' || op === 'tot') { var tm = ph('thym', m); thymG.position.set(0, 3 * tm, 4 * tm); setOp(mThym, 0.9 * (1 - sm((tm - 0.5) / 0.5))); thymG.visible = tm < 0.98; }
        var cn = ph('cnd', m), ln = ph('lnd', m);
        if (O.cnd) { cndG.position.set(0, 0, 6 * sm((cn - 0.35) / 0.65)); cndG.visible = cn < 0.98; setOp(mFat, (0.62 - 0.4 * sm((cn - 0.3) / 0.7)) * (acc < 1 ? 0.4 : 1)); }
        if (O.lnd) {
          lndG.position.set(2.5 * sm((ln - 0.35) / 0.65), 0, 5 * sm((ln - 0.35) / 0.65)); lndG.visible = ln < 0.98;
          scm['1'].position.set(2.2 * sm(ln / 0.35), 0, -0.3 * sm(ln / 0.35)); lat.omo.position.set(1.0 * sm(ln / 0.35), 0, 0.2 * sm(ln / 0.35));
        }
        setOp(mScm, (inAcc || fk === 'anat' ? 0.55 : 0.25) - (O.lnd ? 0.12 * sm(ln / 0.35) : 0));
        // pochewka szyjna po stronie operowanej — przygaszona (widok w głąb rowka tchawiczo-przełykowego)
        var opR = /^(sup|mid|rln|exp|expR|rem)$/.test(fk) && !(op === 'bne' && fk === 'rem'), opL = fk === 'left' || fk === 'expL' || (op === 'bne' && fk === 'rem') || fk === 'rest';
        [-1, 1].forEach(function (s) { var o = (s < 0 ? opR : opL) ? 0.3 : 1; setOp(side[s].mA, o); setOp(side[s].mV, o); setOp(side[s].mVg, o < 1 ? 0.5 : 1); });
        // przedramię
        if (arm) {
          var at = lin('at', m); arm.hole(armOn ? sm((at - 0.12) / 0.2) : 0); arm.line.visible = armOn && at < 0.3; arm.lineG.setDrawRange(0, Math.round(clamp01(at / 0.12) * 40) * 6 * 6);
          arm.pk.forEach(function (K, i) { var a0 = 0.35 + i * 0.13; K.frs.forEach(function (b, j) { b.visible = at > a0 + j * 0.03; }); K.su.visible = at > a0 + 0.1; });
        }
        // PTH
        if (pth) { var pp = lin('pth', m); pth.bars.forEach(function (b, i) { var f = sm((pp - i * 0.2) / 0.18), h = Math.max(0.01, b.v * pth.H * f); b.m.scale.set(1, h, 1); b.m.position.y = -2.2 + h / 2; b.m.visible = f > 0.01; b.top = new V3(b.m.position.x, -2.2 + h, 1.45); }); }

        /* ---- etykiety ---- */
        var fA = fk === 'acc', fAn = fk === 'anat', fP = fk === 'post', Rl = new V3(-2.3, 0.4, 0.6);
        if (armOn) {
          var at2 = lin('at', m); put(arm.L.inc, new V3(-3.4, (N.ARM.ry(-3.4) + 0.2) * Math.cos(N.ARM.th), (N.ARM.rz(-3.4) + 0.2) * Math.sin(N.ARM.th)), at2 < 0.3);
          put(arm.L.br, arm.mc.clone().add(new V3(-2.2, 0, 0)).addScaledVector(arm.dir, 0.7), at2 > 0.25); put(arm.L.fr, arm.pk[1].p.clone().addScaledVector(arm.dir, 0.1), at2 > 0.45); put(arm.L.su, arm.pk[3].su.position.clone(), at2 > 0.85);
          return;
        }
        if (fk === 'pth' && pth) {
          pth.bars.forEach(function (b, i) { put(b.L, new V3(b.m.position.x, i % 2 ? -3.4 : -2.7, 1.4), b.m.visible); });
          put(pth.L50, new V3(pth.X0 + 4.1, pth.y50, 1.5), lin('pth', m) > 0.75); put(pth.Lt, new V3(pth.X0 + 1.8, 3.0, 1.3), lin('pth', m) > 0.9);
        }
        put(L.inc, new V3(incC[0] + incL * 0.55, incC[1] - 0.35, N.skinZ(incC[0] + incL * 0.55, incC[1]) + 0.1), fA && acc < 0.55);
        put(L.notch, new V3(0, -5.1, N.skinZ(0, -5.1)), fA && acc < 0.45); put(L.prom, new V3(0, 5.3, N.skinZ(0, 5.3)), fA && acc < 0.45);
        put(L.plat, new V3(-2.2, 4.4, N.skinZ(-2.2, 4.4) - 0.2), fA && acc > 0.5 && acc < 0.85);
        put(L.strap, new V3(-1.8 - 1.5 * strapO, -1.5, 2.3), fA && acc > 0.75);
        var anat = fAn || (fA && acc > 0.98);
        var tyr = thy || anat;
        put(L.lobR, lobeAnchor(-1), (fAn || (thy && m > 1 && m < 4.2 && !fA)) && gone['-1'] < 0.3);
        put(L.lobL, lobeAnchor(1), (fAn || (thy && (op === 'lob' ? m > 4 : (m > 5 && m < 5.85) || fk === 'rem'))) && gone['1'] < 0.3);
        put(L.isth, new V3(0, 0.15, 1.65), fAn && thy); put(L.pyr, new V3(0.5, 3.0, 1.75), fAn && thy);
        var fAm = fAn && !MOBILE;   // telefon: w kadrze anatomii mniej etykiet
        put(L.trach, new V3(0.2, -4.4, 1.05), fAn || fP || fk === 'thym' || fk === 'rem4' || fk === 'cnd' && cn > 0.6); put(L.tc, new V3(-1.0, 5.0, 1.0), fAn); put(L.cric, new V3(0.5, 1.7, 1.18), fAm && thy);
        put(L.cca, side['-1'].cca.curve.getPointAt(0.62), fAn); put(L.ijv, side['-1'].ijv.curve.getPointAt(0.55), fAn); put(L.vag, side['-1'].vag.curve.getPointAt(0.5), fAm && thy);
        put(L.eso, new V3(1.2, -4.9, -1.6), fAm && thy);
        put(L.rlnR, side['-1'].rln.curve.getPointAt(0.62), (fAn && thy) || fk === 'rln' || (fk === 'mid' && m > 2.5) || fP || (thy && fk === 'rem') || (fk === 'cnd' && cn > 0.45) || (!thy && (fk === 'exp' || fk === 'expR' || fk === 'rem' && op === 'mip' || /^(rem3|rem4|thym)$/.test(fk))));
        put(L.rlnL, side['1'].rln.curve.getPointAt(0.55), (fAn && thy) || (fk === 'left' && lin('left', m) > 0.45) || (fP && op !== 'lob') || (fk === 'cnd' && cn > 0.45) || (!thy && (fk === 'expL' || /^(rem|rest|rem3|rem4|thym)$/.test(fk) && op !== 'mip')));
        put(L.ebs, side['-1'].ebs.curve.getPointAt(0.55), (fAn && thy) || fk === 'sup' || (fP && thy));
        put(L.sta, side['-1'].sta.c.getPointAt(0.45), fk === 'sup' && lin('sup', m) < 0.5); put(L.ct, new V3(-1.1, 2.2, 0.95), fk === 'sup');
        put(L.staLig, side['-1'].sta.c.getPointAt(0.8), fk === 'sup' && lin('sup', m) >= 0.5);
        put(L.mtv, side['-1'].mtv.c.getPointAt(0.4), fk === 'mid' && lin('mid', m) < 0.25);
        put(L.ita, side['-1'].ita.curve.getPointAt(0.72), (fk === 'mid' && lin('mid', m) > 0.2 && lin('mid', m) < 0.6) || (!thy && fk === 'expR'));
        put(L.capLig, side['-1'].cap[0].position.clone(), fk === 'mid' && lin('mid', m) > 0.6);
        put(L.zuck, lobeAnchor(-1).lerp(new V3(-1.7, 1.05, -0.8), 0.8), fk === 'rln' && lin('rln', m) < 0.4);
        put(L.ber, V(P.berry[0]).multiply(new V3(-1, 1, 1)), fk === 'rln' && lin('rln', m) > 0.35 && lin('rln', m) < 0.62);
        put(L.ionm, side['-1'].rln.curve.getPointAt(0.85), fk === 'rln' && stim > 0.4);
        put(L.stump, side['-1'].sta.stump.curve.getPointAt(0.9), fP && thy);
        put(L.leftStump, new V3(1.0, 0.15, 1.35), op === 'lob' && (fk === 'rem' && lin('rem', m) > 0.6 || fP));
        put(L.scm, op === 'lnd' ? new V3(6.0, 3.0, 0.6).add(scm['1'].position) : new V3(-4.1, 2.0, 1.4), fAm || (op === 'lnd' && fk === 'lnd'));
        // przytarczyce
        Object.keys(GLS).forEach(function (k) {
          var G = GLS[k], sR = G.side < 0, show;
          if (thy) show = fAn || (sR ? (fk === 'mid' && m > 2.35) || fk === 'rln' : fk === 'left' && lin('left', m) > 0.3 && lin('left', m) < 0.75) || (fP && thy);
          else show = G.m.visible && (fAn || fk === 'exp' || (fk === 'expR' && sR) || (fk === 'expL' && !sR) || (fk === 'rem' && out.indexOf(k) >= 0) || fP || fk === 'rest' && k === O.keep || fk === 'rem3' || fk === 'rem4');
          if (keepG && k === O.keep && (fk === 'rest' && lin('rest', m) > 0.6 || m > T.rest[1])) show = false;
          put(G.L, G.m.position.clone().add(new V3(G.side * 0.15, 0, -0.05)), show && G.m.visible);
        });
        if (keepG) put(L.keep, keepG.c.clone(), (fk === 'rest' && lin('rest', m) > 0.6) || fk === 'rem3' || fk === 'thym' || fP);
        if (L.thym) put(L.thym, new V3(-1.6, -4.2, 1.0).add(thymG.position), (fk === 'thym' && lin('thym', m) < 0.5) || ((fk === 'expR' || fk === 'expL') && false));
        if (O.cnd) { ['pre', 'ptr', 'parR', 'parL'].forEach(function (k) { put(L['pk' + k], V(N.PK[k].c).add(cndG.position), (fk === 'cnd' && cn < 0.4) || (fAn && k !== 'pre')); }); }
        if (O.lnd) {
          ['II', 'III', 'IV', 'Vb'].forEach(function (k) { put(L['pk' + k], V(N.PK[k].c).add(new V3(0.5, 0, 0.6)).add(lndG.position), (fk === 'lnd' && ln < 0.4) || fAn); });
          put(L.xi, lat.xi.curve.getPointAt(0.45), fk === 'lnd' && ln > 0.5 || (fP && false)); put(L.phr, lat.phr.curve.getPointAt(0.45), fk === 'lnd' && ln > 0.6);
          put(L.td, lat.td.curve.getPointAt(0.78), fk === 'lnd' && ln > 0.7); put(L.bp, V(P.bp[2]), fk === 'lnd' && ln > 0.8); put(L.omo, lat.omo.position.clone().add(V(P.omo[2])), fk === 'lnd' && ln < 0.3);
        }
      } };
    return tool;
  }
  TOOL_EXT.neck = makeNeck;
