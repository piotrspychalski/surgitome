/*!
 * SURGITOME — interactive 3D postoperative gastrointestinal anatomy
 * Author: Piotr Spychalski, MD, PhD — colorectal surgeon and clinical researcher,
 *         Department of Oncological, Transplant and General Surgery,
 *         Medical University of Gdańsk (Gdański Uniwersytet Medyczny), Gdańsk, Poland
 * Contact: piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · https://bit.ly/surgitome
 * Copyright (c) 2026 Piotr Spychalski. Code: MIT License (LICENSE). 3D models, illustrations and texts: CC BY 4.0 (LICENSE-CONTENT).
 * Concept, medical content and design: Piotr Spychalski. Module: anatomical data — procedures, resections, anastomoses, endoscopic routes.
 */
/* ===== Rdzeń: dane anatomii (stan przed -> po operacji) =====
   Oś czasu operacji m: 0 = anatomia prawidłowa, 0-1 zakres resekcji / linie cięcia,
   1-2 usunięcie lub wyłączenie, 2-3 rekonstrukcja, 3 = stan po operacji.
   Nową anatomię dodaje się jako kolejny obiekt w ANATOMIES.
   Współrzędne: widok od przodu, x+ = lewa strona pacjenta, y+ = doczaszkowo, z+ = do przodu. */
(function (root) {
  'use strict';
  var THREE = root.THREE;
  if (!THREE) return;

  function V(a) { return new THREE.Vector3(a[0], a[1], a[2]); }
  function curveOf(pts) { return new THREE.CatmullRomCurve3(pts.map(V), false, 'centripetal'); }
  function profile(stops) {
    return function (t) {
      if (t <= stops[0][0]) return stops[0][1];
      for (var i = 1; i < stops.length; i++) {
        if (t <= stops[i][0]) {
          var a = stops[i - 1], b = stops[i], k = (t - a[0]) / (b[0] - a[0]); k = k * k * (3 - 2 * k);
          return a[1] + (b[1] - a[1]) * k;
        }
      }
      return stops[stops.length - 1][1];
    };
  }
  function flat(r) { return function () { return r; }; }
  function sm01(x) { x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * (3 - 2 * x); }

  function buildTube(curve, rFn, T, R, caps) {
    var frames = curve.computeFrenetFrames(T, false), rings = [], i, k;
    var capS = caps === true || (caps && caps[0]), capE = caps === true || (caps && caps[1]);
    var KC = 8;
    if (capS) { // kopuła na początku: od wierzchołka do pierwszego pierścienia
      var P0 = curve.getPointAt(0), T0 = frames.tangents[0], r0 = rFn(0);
      for (k = KC; k >= 1; k--) { var a0 = k / KC * Math.PI / 2; rings.push({ c: P0.clone().addScaledVector(T0, -r0 * Math.sin(a0)), r: r0 * Math.cos(a0), N: frames.normals[0], B: frames.binormals[0], u: 0, cap: P0, cr: r0 }); }
    }
    for (i = 0; i <= T; i++) rings.push({ c: curve.getPointAt(i / T), r: rFn(i / T), N: frames.normals[i], B: frames.binormals[i], u: i / T });
    if (capE) {
      var P1 = curve.getPointAt(1), T1 = frames.tangents[T], r1 = rFn(1);
      for (k = 1; k <= KC; k++) { var a1 = k / KC * Math.PI / 2; rings.push({ c: P1.clone().addScaledVector(T1, r1 * Math.sin(a1)), r: r1 * Math.cos(a1), N: frames.normals[T], B: frames.binormals[T], u: 1, cap: P1, cr: r1 }); }
    }
    var pos = [], nor = [], uv = [], idx = [], n = new THREE.Vector3(), v3 = new THREE.Vector3();
    rings.forEach(function (g) {
      for (var j = 0; j <= R; j++) {
        var v = j / R * Math.PI * 2, s = Math.sin(v), cc = -Math.cos(v);
        n.set(cc * g.N.x + s * g.B.x, cc * g.N.y + s * g.B.y, cc * g.N.z + s * g.B.z).normalize();
        v3.copy(g.c).addScaledVector(n, g.r);
        pos.push(v3.x, v3.y, v3.z);
        if (g.cap) { var nn = v3.clone().sub(g.cap).normalize(); nor.push(nn.x, nn.y, nn.z); } else nor.push(n.x, n.y, n.z);
        uv.push(g.u, j / R);
      }
    });
    for (var jj = 1; jj < rings.length; jj++) for (var ii = 1; ii <= R; ii++) {
      var a = (R + 1) * (jj - 1) + (ii - 1), b = (R + 1) * jj + (ii - 1), c2 = (R + 1) * jj + ii, d = (R + 1) * (jj - 1) + ii;
      idx.push(a, b, d, b, c2, d);
    }
    var g = new THREE.BufferGeometry();
    g.setIndex(idx);
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    return g;
  }
  function nearestT(curve, p, n) {
    n = n || 600; var best = 0, bd = Infinity, q = new THREE.Vector3(), P = p.isVector3 ? p : V(p);
    for (var i = 0; i <= n; i++) { curve.getPointAt(i / n, q); var d = q.distanceToSquared(P); if (d < bd) { bd = d; best = i / n; } }
    return best;
  }
  function papillaPoint(curve, rFn, near, dir) {
    var t = nearestT(curve, near, 1000), axis = curve.getPointAt(t), tan = curve.getTangentAt(t);
    var d = V(dir); d.sub(tan.clone().multiplyScalar(d.dot(tan))).normalize();
    var r = rFn(t);
    return { t: t, axis: axis, dir: d, r: r, wall: axis.clone().add(d.clone().multiplyScalar(r)) };
  }


  /* ---------- geometria widoku endoskopowego: przedłużenie końców + suma świateł ---------- */
  // usuwa ściany każdej rury leżące w świetle innej rury -> otwarte, szczelne zespolenia
  function unionCut(items, margin) {
    margin = margin || 0.03;
    var samp = items.map(function (it) {
      var n = Math.max(20, Math.round(it.len / 0.08)), P = [], R = [], box = new THREE.Box3(), mr = 0;
      for (var i = 0; i <= n; i++) { var t = i / n, p = it.curve.getPointAt(t), r = it.r(t); P.push(p); R.push(r); box.expandByPoint(p); if (r > mr) mr = r; }
      box.expandByScalar(mr + 0.05);
      return { P: P, R: R, n: n, box: box, T0: it.curve.getTangentAt(0), T1: it.curve.getTangentAt(1) };
    });
    var c = new THREE.Vector3(), tmp = new THREE.Vector3();
    return items.map(function (it, a) {
      var pos = it.geo.attributes.position.array, idx = it.geo.index.array, keep = [];
      var cands = [];
      samp.forEach(function (s, b) { if (b !== a && s.box.intersectsBox(samp[a].box)) cands.push(b); });
      for (var f = 0; f < idx.length; f += 3) {
        var i0 = idx[f] * 3, i1 = idx[f + 1] * 3, i2 = idx[f + 2] * 3;
        c.set((pos[i0] + pos[i1] + pos[i2]) / 3, (pos[i0 + 1] + pos[i1 + 1] + pos[i2 + 1]) / 3, (pos[i0 + 2] + pos[i1 + 2] + pos[i2 + 2]) / 3);
        var inside = false;
        tmp.set(pos[i0], pos[i0 + 1], pos[i0 + 2]);
        var e1 = tmp.distanceTo(c.clone().set(pos[i1], pos[i1 + 1], pos[i1 + 2])), e2 = tmp.distanceTo(c.clone().set(pos[i2], pos[i2 + 1], pos[i2 + 2]));
        var em = 0.6 * Math.max(e1, e2);
        c.set((pos[i0] + pos[i1] + pos[i2]) / 3, (pos[i0 + 1] + pos[i1 + 1] + pos[i2 + 1]) / 3, (pos[i0 + 2] + pos[i1 + 2] + pos[i2 + 2]) / 3);
        for (var k = 0; k < cands.length && !inside; k++) {
          var s = samp[cands[k]]; if (!s.box.containsPoint(c)) continue;
          var bi = 0, bd = Infinity, j, d;
          for (j = 0; j <= s.n; j += 8) { d = c.distanceToSquared(s.P[j]); if (d < bd) { bd = d; bi = j; } }
          var lo = Math.max(0, bi - 9), hi = Math.min(s.n, bi + 9);
          for (j = lo; j <= hi; j++) { d = c.distanceToSquared(s.P[j]); if (d < bd) { bd = d; bi = j; } }
          if (Math.sqrt(bd) < s.R[bi] - margin - em) inside = true;
          else if (em > 0.15) { // długie, wąskie trójkąty (np. przy szczycie kopuły): usuń, gdy wszystkie trzy wierzchołki są w świetle
            var all = true;
            for (var q = 0; q < 3 && all; q++) {
              var iv = idx[f + q] * 3; tmp.set(pos[iv], pos[iv + 1], pos[iv + 2]);
              var vd = Infinity, vj = 0; for (j = Math.max(0, bi - 14); j <= Math.min(s.n, bi + 14); j++) { d = tmp.distanceToSquared(s.P[j]); if (d < vd) { vd = d; vj = j; } }
              if (Math.sqrt(vd) >= s.R[vj] - margin) all = false;
            }
            if (all) inside = true;
          }
        }
        if (!inside) keep.push(idx[f], idx[f + 1], idx[f + 2]);
      }
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', it.geo.attributes.position); g.setAttribute('normal', it.geo.attributes.normal); g.setAttribute('uv', it.geo.attributes.uv);
      g.setIndex(keep);
      return g;
    });
  }
  // tuby do widoku endoskopowego: końce przedłużone o ~0,8 promienia (poza zamkniętymi kopułami), potem suma świateł
  function endoGeometries(list) {
    var items = list.map(function (st) {
      return { curve: st.curve, r: st.r, len: st.len, geo: buildTube(st.curve, st.r, Math.max(48, Math.round(st.len * 6)), 30, st.caps || true) };
    });
    var out = unionCut(items);
    items.forEach(function (it) { it.geo.dispose(); });
    return out;
  }

  /* ---------- kolory ---------- */
  var COL = {
    eso: '#c9a08c', stomach: '#d8735c', remnant: '#8e9aa6', bp: '#e2ad3f', roux: '#43a36f',
    common: '#4a82c3', bowel: '#cf8aa6', cut: '#e0302a', staple: '#59636e', anast: '#f4f1e8', mark: '#ffffff', spec: '#c93a2c'
  };
  var MUC = { eso: '#ecd0c6', stomach: '#d8705d', bowel: '#e7a097' };

  /* ---------- anatomia prawidłowa ---------- */
  var ESO = [[0.3, 16, -3], [0.4, 13, -2.6], [0.7, 10, -1.8], [1.2, 8, -0.8], [1.6, 7, -0.2]];
  var ESO_R = profile([[0, 0.75], [0.85, 0.8], [1, 0.9]]);
  var STOMACH = [[2.5, 8.2, -0.6], [3.3, 6.5, -0.2], [4.4, 3.8, 0.2], [4.0, 1.0, 0.7], [2.6, -1.2, 1.1], [0.5, -1.4, 1.2], [-0.6, -0.6, 1.1], [-1.6, 0.2, 1.0]];
  var STOMACH_R = profile([[0, 0.05], [0.07, 1.9], [0.25, 2.6], [0.5, 2.5], [0.7, 2.0], [0.85, 1.5], [0.97, 0.8], [1, 0.6]]);
  var DUO = [[-1.6, 0.2, 1.0], [-2.8, 0.7, 0.8], [-4.1, 0.2, 0.3], [-4.8, -1.4, 0], [-4.9, -3.4, 0], [-4.3, -5.5, -0.5], [-2.2, -6.5, -1.2], [0.6, -6.6, -1.5], [2.5, -5.8, -1.6], [3.1, -4.0, -1.6]];
  var DUO_R = profile([[0, 0.55], [0.05, 1.2], [0.14, 1.1], [1, 1.0]]);
  var JEJ = [[3.1, -4.0, -1.6], [4.8, -4.4, -1.0], [6.0, -6.0, -0.2], [5.0, -7.8, 0.6], [2.6, -8.4, 1.0], [0.4, -8.6, 1.2], [-1.8, -8.4, 1.2],
    [-3.8, -8.9, 1.0], [-4.8, -10.4, 0.8], [-3.0, -11.4, 1.0], [-0.4, -11.0, 1.3], [2.2, -10.8, 1.4], [4.8, -11.2, 1.2], [5.6, -13.0, 0.8],
    [3.4, -13.8, 0.8], [0.8, -13.6, 1.0], [-1.8, -13.8, 0.8], [-4.0, -14.8, 0.4], [-2.6, -16.3, 0.2], [0.4, -16.4, 0.2], [3.2, -16.8, 0.2]];
  var PAP = { near: [-4.95, -2.6, 0], dir: [1, 0, 0.25] };
  var GEJ_IN = [4.0, 6.2, -0.3];

  var C = { DUO: curveOf(DUO), JEJ: curveOf(JEJ), ESO: curveOf(ESO), STOM: curveOf(STOMACH) };
  function sub(curve, rFn, t0, t1, n) {
    n = n || 40; var pts = [];
    for (var i = 0; i <= n; i++) pts.push(curve.getPointAt(t0 + (t1 - t0) * i / n).toArray());
    return { path: pts, r: function (t) { return rFn(t0 + (t1 - t0) * t); } };
  }
  // dzieli jelito czcze na odcinki proporcjonalnie do długości odcinków po operacji
  function splitBy(curve, rr, posts) {
    var L = posts.map(function (p) { return curveOf(p).getLength(); }), tot = L.reduce(function (a, b) { return a + b; }, 0), acc = 0, cuts = [];
    var parts = L.map(function (l) { var a = acc / tot; acc += l; var b = acc / tot; cuts.push(b); return sub(curve, flat(rr), a, b, Math.max(14, Math.round(60 * (b - a)))); });
    return { parts: parts, cuts: cuts.slice(0, -1) };
  }
  function jejSplit(posts) {
    var L = posts.map(function (p) { return curveOf(p).getLength(); }), tot = L.reduce(function (a, b) { return a + b; }, 0), acc = 0, cuts = [];
    var parts = L.map(function (l) {
      var a = acc / tot; acc += l; var b = acc / tot; cuts.push(b);
      return sub(C.JEJ, flat(1.0), a, b, Math.max(14, Math.round(60 * (b - a))));
    });
    return { parts: parts, cuts: cuts.slice(0, -1) };
  }
  function ringOn(curve, rFn, t, extra) {
    var o = { kind: 'ring', pos: curve.getPointAt(t).toArray(), tan: curve.getTangentAt(t).toArray(), r: rFn(t) + 0.22 };
    for (var k in extra) o[k] = extra[k];
    return o;
  }
  function ringAt(path, rFn, at, extra) { var c = curveOf(path); return ringOn(c, rFn, nearestT(c, at), extra); }
  function L(text, t, win, sub) { return { text: text, t: t, win: win, sub: sub || '' }; }
  var PRE = [-9, 0.9], POST = [2.6, 99], ALL = [-9, 99];

  // okna czasowe (wspólne)
  var CUT_OP = [[0.05, 0], [0.55, 1], [1.7, 1], [2.05, 0]];
  var CUT_OP_JEJ = [[0.05, 0], [0.55, 1], [2.0, 1], [2.3, 0]];
  var ANAST_OP = [[2.55, 0], [2.95, 1]];
  var SPEC_COL = [[0, COL.stomach], [0.7, COL.spec]];
  var SPEC_OP = [[0.35, 1], [0.9, 0.5], [1.15, 0.5], [1.9, 0]];

  /* ---------- odcinki po operacji (ścieżki) ---------- */
  var BP = [[3.1, -4.0, -1.6], [4.8, -4.4, -1.2], [5.9, -6.0, -0.6], [5.6, -7.8, 0.2], [4.6, -9.0, 0.8], [3.9, -9.6, 1.0]];
  var CC = [[3.6, -9.9, 1.2], [3.0, -11.2, 1.0], [0.8, -11.8, 0.9], [-1.6, -11.0, 0.8], [-3.2, -12.2, 0.6], [-2.2, -13.6, 0.4], [0.4, -13.8, 0.3], [2.6, -14.6, 0.2]];
  var BLIND = profile([[0, 0.05], [0.04, 1.0], [1, 1.0]]);

  var ROUX_TG = [[3.2, 6.8, 0.6], [2.2, 6.3, 0.5], [1.4, 5.4, 0.6], [1.2, 3.6, 1.1], [1.4, 1.4, 1.6], [0.6, -0.6, 2.0], [1.8, -2.4, 2.3], [3.2, -3.8, 2.4], [2.4, -5.6, 2.5], [0.6, -6.8, 2.4], [1.0, -8.6, 2.0], [2.6, -9.4, 1.7], [3.4, -9.9, 1.4]];
  var ROUX_R = [[0.4, 5.2, 2.0], [1.3, 4.4, 2.2], [2.2, 3.4, 2.3], [2.4, 1.6, 2.8], [1.4, -0.2, 3.5], [2.6, -2.0, 3.5], [3.8, -3.6, 3.2], [2.6, -5.2, 3.2], [0.6, -5.8, 3.0], [-0.4, -7.4, 2.8], [0.8, -8.8, 2.4], [2.6, -9.4, 1.9], [3.4, -9.9, 1.4]];
  var POUCH_R = [[1.6, 7, -0.2], [1.8, 6.3, 0.5], [1.9, 5.3, 1.1], [1.95, 4.6, 1.4]];
  var POUCH_R_R = profile([[0, 0.9], [0.3, 1.25], [0.75, 1.3], [1, 0.95]]);
  var REM_R = [[3.8, 7.4, -1.2], [4.9, 5.4, -0.9], [5.0, 2.8, -0.4], [4.4, 0.4, 0.3], [2.9, -1.3, 0.6], [0.6, -1.5, 0.9], [-0.6, -0.6, 1.1], [-1.6, 0.2, 1.0]];
  var REM_R_R = profile([[0, 0.05], [0.07, 1.5], [0.25, 1.9], [0.55, 1.8], [0.75, 1.4], [0.9, 1.1], [0.97, 0.7], [1, 0.55]]);
  var POUCH_O = [[1.6, 7, -0.2], [1.9, 5.4, 0.6], [2.0, 3.4, 1.2], [1.9, 1.6, 1.6]];
  var POUCH_O_R = profile([[0, 0.9], [0.1, 1.05], [0.88, 1.05], [1, 0.85]]);
  var REM_O = [[4.0, 7.4, -1.4], [5.2, 5.4, -1.2], [5.4, 2.6, -0.8], [4.8, 0.1, -0.1], [3.0, -1.6, 0.5], [0.7, -1.6, 0.8], [-0.6, -0.6, 1.1], [-1.6, 0.2, 1.0]];
  var REM_O_R = profile([[0, 0.05], [0.07, 1.4], [0.25, 1.8], [0.55, 1.7], [0.75, 1.35], [0.9, 1.05], [0.97, 0.7], [1, 0.55]]);
  var AFF = [[3.1, -4.0, -1.6], [4.8, -4.4, -1.0], [6.2, -6.2, 0.2], [5.8, -8.4, 1.4], [4.4, -8.8, 2.4], [4.0, -6.8, 3.1], [4.6, -4.6, 3.4], [4.0, -2.2, 3.4], [3.0, -0.2, 3.3], [1.9, 0.6, 2.3]];
  var EFF = [[1.9, 0.6, 2.3], [0.8, -0.6, 3.2], [-0.2, -2.6, 3.2], [-0.6, -5.0, 3.2], [0.4, -7.2, 3.0], [-0.8, -9.2, 2.6], [-2.8, -10.2, 2.2], [-2.2, -12.2, 1.6], [0.4, -13.0, 1.2], [2.6, -13.8, 0.8]];
  var SLEEVE = [[1.6, 7, -0.2], [2.1, 5.2, 0.2], [2.4, 3, 0.5], [2.2, 0.8, 0.8], [1.2, -0.6, 1.1], [-0.3, -0.7, 1.2], [-1.6, 0.2, 1.0]];
  var SLEEVE_R = profile([[0, 0.9], [0.08, 1.05], [0.55, 1.05], [0.75, 1.5], [0.9, 1.3], [0.98, 0.65], [1, 0.55]]);

  function eso() { return { id: 'eso', name: 'Przełyk', pre: { path: ESO, r: ESO_R }, color: COL.eso, mucosa: 'smooth', tint: MUC.eso, labels: [L('Przełyk', 0.3, ALL)] }; }
  function duoStatic() {
    return { id: 'duo', name: 'Dwunastnica', pre: { path: DUO, r: DUO_R }, colors: [[2, COL.bowel], [2.9, COL.bp]], mucosa: 'circular', tint: MUC.bowel,
      labels: [L('Dwunastnica', 0.35, ALL)] };
  }
  function stomachLabel() { return L('Żołądek', 0.35, PRE); }
  // często powtarzane narządy w anatomii prawidłowej
  function stomObj(labels) { return { id: 'stom', name: 'Żołądek', pre: { path: STOMACH, r: STOMACH_R }, color: COL.stomach, mucosa: 'rugae', tint: MUC.stomach, labels: labels || [L('Żołądek', 0.35, ALL)] }; }
  function duoObj() { return { id: 'duo', name: 'Dwunastnica', pre: { path: DUO, r: DUO_R }, color: COL.bowel, mucosa: 'circular', tint: MUC.bowel, labels: [L('Dwunastnica', 0.35, ALL)] }; }
  function jejObj() { return { id: 'jej', name: 'Jelito czcze', pre: { path: JEJ, r: flat(1.0) }, color: COL.bowel, mucosa: 'circular', tint: MUC.bowel, labels: [L('Jelito czcze', 0.35, ALL)] }; }
  function gbObj() { return { id: 'gb', name: 'Pęcherzyk żółciowy', pre: { path: GB, r: GB_R }, color: COL_H.gb, mucosa: 'smooth', tint: '#9fae6a', labels: [L('Pęcherzyk żółciowy', 0.8, PRE)] }; }
  function pancAllObj() { return { id: 'pancAll', name: 'Trzustka', organ: true, pre: { path: PANC, r: PANC_R }, color: COL_H.panc, labels: [L('Trzustka', 0.55, ALL)] }; }

  /* ---------- 1. Gastrektomia całkowita + Roux-en-Y ---------- */
  var tgSplit = jejSplit([BP, ROUX_TG, CC]);
  var tS = nearestT(C.DUO, [-2.5, 0.8, 0.8]);
  var tgDuoPre = sub(C.DUO, DUO_R, tS, 1, 40);
  var TG = {
    cat: 'upper', id: 'tg', short: 'Gastrektomia + Roux-en-Y',
    title: 'Gastrektomia całkowita z rekonstrukcją Roux-en-Y',
    sub: 'Zespolenie przełykowo-jelitowe (EJ) na pętli Roux',
    notes: [
      'Brak żołądka. Zespolenie przełykowo-jelitowe koniec-do-boku, obok ślepy koniec pętli („candy cane”).',
      'Pętla Roux typowo ≥40 cm, żeby ograniczyć refluks żółciowy do przełyku.',
      'Kikut dwunastnicy zamknięty — brodawka dostępna tylko od strony dystalnej.',
      'W obserwacji onkologicznej: linia zespolenia EJ (nawrót, zwężenie).'
    ],
    frames: {
      resect: ['Zakres resekcji', 'Cały żołądek z początkowym odcinkiem dwunastnicy. Przecięcie przełyku tuż nad wpustem, dwunastnicy za odźwiernikiem i jelita czczego w początkowym odcinku.', 'Zakres resekcji'],
      remove: ['Usunięcie preparatu', 'Żołądek usunięty w całości, kikut dwunastnicy zamknięty.', 'Usunięcie'],
      recon: ['Rekonstrukcja Roux-en-Y', 'Dalszy koniec jelita czczego (pętla Roux) podciągnięty do przełyku: zespolenie przełykowo-jelitowe (EJ). Bliższy koniec wszyty niżej w pętlę Roux: zespolenie jelitowo-jelitowe (JJ).', 'Rekonstrukcja'],
      post: 'Zielona pętla Roux prowadzi pokarm, żółta pętla biliopankreatyczna żółć i sok trzustkowy, niebieski kanał wspólny — obie treści razem.',
      endoPost: 'Do brodawki: zespolenie EJ, pętla Roux, zespolenie JJ, dalej wstecznie pętlą biliopankreatyczną do dwunastnicy. Brodawka widoczna od strony dystalnej.'
    },
    objects: [
      eso(),
      { id: 'spec', name: 'Żołądek', pre: { path: STOMACH, r: STOMACH_R }, colors: SPEC_COL, opacity: SPEC_OP, offset: [[1.15, [0, 0, 0]], [1.9, [5, 2, 6]]],
        mucosa: 'rugae', tint: MUC.stomach, labels: [stomachLabel(), L('Preparat: żołądek z początkiem dwunastnicy', 0.45, [0.5, 1.5])] },
      { id: 'duoCut', name: 'Opuszka', pre: sub(C.DUO, DUO_R, 0, tS + 0.01, 12), colors: [[0, COL.bowel], [0.7, COL.spec]], opacity: SPEC_OP, offset: [[1.15, [0, 0, 0]], [1.9, [5, 2, 6]]],
        mucosa: 'circular', tint: MUC.bowel },
      { id: 'duo', name: 'Dwunastnica', pre: tgDuoPre, post: { path: tgDuoPre.path, r: profile([[0, 0.05], [0.05, 1.05], [1, 1.0]]) }, morph: [1.3, 1.9],
        colors: [[2, COL.bowel], [2.9, COL.bp]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Dwunastnica', 0.3, PRE), L('Kikut dwunastnicy', 0.02, POST)] },
      { id: 'bp', name: 'Jelito czcze', postName: 'Pętla biliopankreatyczna', pre: tgSplit.parts[0], post: { path: BP, r: flat(1.0) }, morph: [2, 3],
        colors: [[2, COL.bowel], [2.9, COL.bp]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Pętla biliopankreatyczna', 0.45, POST)] },
      { id: 'roux', name: 'Jelito czcze', postName: 'Pętla Roux (alimentacyjna)', lenPost: 'typowo ≥40 cm', pre: tgSplit.parts[1], post: { path: ROUX_TG, r: BLIND }, morph: [2, 3],
        colors: [[2, COL.bowel], [2.9, COL.roux]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Jelito czcze', 0.5, PRE), L('Pętla Roux', 0.55, POST, 'typowo ≥40 cm')] },
      { id: 'cc', name: 'Jelito czcze', postName: 'Kanał wspólny', pre: tgSplit.parts[2], post: { path: CC, r: flat(1.0) }, morph: [2, 3],
        colors: [[2, COL.bowel], [2.9, COL.common]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Kanał wspólny', 0.5, POST)] }
    ],
    marks: [
      ringOn(C.ESO, ESO_R, 0.93, { name: 'Przecięcie przełyku', color: COL.cut, opacity: CUT_OP }),
      ringOn(C.DUO, DUO_R, tS, { name: 'Przecięcie dwunastnicy', color: COL.cut, opacity: CUT_OP }),
      ringOn(C.JEJ, flat(1.0), tgSplit.cuts[0], { name: 'Przecięcie jelita czczego', color: COL.cut, opacity: CUT_OP_JEJ }),
      ringAt(ROUX_TG, BLIND, [1.9, 6.0, 0.5], { name: 'Zespolenie przełykowo-jelitowe (EJ)', color: COL.anast, opacity: ANAST_OP }),
      ringAt(CC, flat(1.0), [3.6, -9.9, 1.2], { name: 'Zespolenie jelitowo-jelitowe (JJ)', color: COL.anast, opacity: ANAST_OP })
    ],
    papilla: { obj: 'duo', near: PAP.near, dir: PAP.dir },
    routePost: [{ obj: 'eso' }, { obj: 'roux', from: [1.9, 6.0, 0.5], note: 'Za zespoleniem EJ w dół pętlą Roux (obok ślepy koniec)' },
      { obj: 'bp', from: 1, to: 0, note: 'Przy zespoleniu JJ zawróć wstecznie w pętlę biliopankreatyczną' },
      { obj: 'duo', from: 1, to: 'papilla', note: 'Dwunastnica od strony dystalnej — brodawka w odwróconej orientacji' }]
  };

  /* ---------- 2. RYGB ---------- */
  var rySplit = jejSplit([BP, ROUX_R, CC]);
  var RYGB = {
    cat: 'upper', id: 'rygb', short: 'RYGB',
    ct: { content: { eso: 'air', pouch: 'contrast', roux: 'contrast', cc: 'contrast', stom: 'fluid', duo: 'fluid', bp: 'fluid' },
      names: { eso: 'przełyk', pouch: 'zbiornik', roux: 'pętla Roux', cc: 'kanał wspólny', stom: 'żołądek wyłączony', duo: 'dwunastnica', bp: 'pętla BP' } },
    title: 'Pomostowanie żołądkowe Roux-en-Y',
    sub: 'RYGB (Roux-en-Y gastric bypass)',
    notes: [
      'Mały zbiornik żołądkowy (pouch) z zespoleniem żołądkowo-jelitowym (GJ); reszta żołądka wyłączona, ale obecna.',
      'Pętla alimentacyjna (Roux) typowo 100–150 cm, biliopankreatyczna (BP) 50–100 cm — zależnie od ośrodka.',
      'Opcje ERCP (endoskopowa cholangiopankreatografia wsteczna): enteroskopia wspomagana balonem, ERCP przezżołądkowe z dostępu EUS (ultrasonografia endoskopowa) — EDGE, ERCP wspomagane laparoskopowo.',
      'Na GJ typowe owrzodzenie brzeżne i zwężenie zespolenia.'
    ],
    frames: {
      resect: ['Linie przecięcia', 'Zbiornik (pouch) przy wpuście odcięty staplerem od reszty żołądka. Jelito czcze przecięte w odległości długości pętli biliopankreatycznej od więzadła Treitza.', 'Linie przecięcia'],
      remove: ['Wyłączenie żołądka', 'Nic nie jest usuwane: żołądek wyłączony zostaje w jamie brzusznej, bez połączenia ze zbiornikiem.', 'Wyłączenie'],
      recon: ['Rekonstrukcja Roux-en-Y', 'Pętla alimentacyjna (Roux) do zbiornika: zespolenie żołądkowo-jelitowe (GJ). Pętla biliopankreatyczna wszyta 100–150 cm niżej: zespolenie jelitowo-jelitowe (JJ).', 'Rekonstrukcja'],
      post: 'Zielona pętla Roux prowadzi pokarm, żółta pętla biliopankreatyczna żółć i sok trzustkowy, niebieski kanał wspólny — obie treści razem.',
      endoPost: 'Do brodawki: zbiornik, GJ, pętla Roux, zespolenie JJ, dalej wstecznie pętlą biliopankreatyczną do dwunastnicy. Brodawka od strony dystalnej.'
    },
    objects: [
      eso(),
      { id: 'stom', name: 'Żołądek', postName: 'Żołądek wyłączony', pre: { path: STOMACH, r: STOMACH_R }, post: { path: REM_R, r: REM_R_R }, morph: [1.1, 1.9],
        colors: [[1.1, COL.stomach], [1.9, COL.remnant]], mucosa: 'rugae', tint: MUC.stomach, labels: [stomachLabel(), L('Żołądek wyłączony', 0.3, [1.9, 99])] },
      { id: 'pouch', name: 'Zbiornik żołądkowy (pouch)', pre: { path: POUCH_R, r: POUCH_R_R }, opacity: [[1.1, 0], [1.7, 1]], color: COL.stomach, mucosa: 'rugae', tint: MUC.stomach,
        lenPost: 'ok. 15–30 ml', labels: [L('Zbiornik (pouch)', 0.5, [1.9, 99])] },
      duoStatic(),
      { id: 'bp', name: 'Jelito czcze', postName: 'Pętla biliopankreatyczna', lenPost: 'typowo 50–100 cm', pre: rySplit.parts[0], post: { path: BP, r: flat(1.0) }, morph: [2, 3],
        colors: [[2, COL.bowel], [2.9, COL.bp]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Pętla biliopankreatyczna', 0.45, POST, 'typowo 50–100 cm')] },
      { id: 'roux', name: 'Jelito czcze', postName: 'Pętla Roux (alimentacyjna)', lenPost: 'typowo 100–150 cm', pre: rySplit.parts[1], post: { path: ROUX_R, r: BLIND }, morph: [2, 3],
        colors: [[2, COL.bowel], [2.9, COL.roux]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Jelito czcze', 0.5, PRE), L('Pętla Roux (alimentacyjna)', 0.45, POST, 'typowo 100–150 cm')] },
      { id: 'cc', name: 'Jelito czcze', postName: 'Kanał wspólny', pre: rySplit.parts[2], post: { path: CC, r: flat(1.0) }, morph: [2, 3],
        colors: [[2, COL.bowel], [2.9, COL.common]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Kanał wspólny', 0.5, POST)] }
    ],
    marks: [
      { kind: 'line', cutDepth: 1.6, name: 'Linia przecięcia żołądka', color: COL.cut, opacity: CUT_OP,
        pts: [[1.2, 4.3, 2.1], [2.5, 4.2, 2.7], [3.4, 4.7, 2.8], [3.7, 6.0, 2.4], [3.3, 7.5, 1.6], [2.6, 8.3, 0.8]] },
      ringOn(C.JEJ, flat(1.0), rySplit.cuts[0], { name: 'Przecięcie jelita czczego', color: COL.cut, opacity: CUT_OP_JEJ }),
      ringAt(ROUX_R, BLIND, [1.8, 3.9, 2.25], { name: 'Zespolenie żołądkowo-jelitowe (GJ)', color: COL.anast, opacity: ANAST_OP }),
      ringAt(CC, flat(1.0), [3.6, -9.9, 1.2], { name: 'Zespolenie jelitowo-jelitowe (JJ)', color: COL.anast, opacity: ANAST_OP })
    ],
    papilla: { obj: 'duo', near: PAP.near, dir: PAP.dir },
    routePost: [{ obj: 'eso' }, { obj: 'pouch', note: 'Mały zbiornik — zespolenie GJ tuż za wpustem' },
      { obj: 'roux', from: [1.8, 3.9, 2.25], note: 'Za GJ w dół pętlą alimentacyjną (obok ślepy koniec)' },
      { obj: 'bp', from: 1, to: 0, note: 'Przy zespoleniu JJ zawróć wstecznie w pętlę biliopankreatyczną' },
      { obj: 'duo', from: 1, to: 'papilla', note: 'Dwunastnica od strony dystalnej — brodawka w odwróconej orientacji' }]
  };

  /* ---------- 3. OAGB / MGB ---------- */
  var oaSplit = jejSplit([AFF, EFF]);
  var OAGB = {
    cat: 'upper', id: 'oagb', short: 'OAGB / MGB',
    title: 'Jednozespoleniowe pomostowanie żołądkowe',
    sub: 'OAGB (one anastomosis gastric bypass) / MGB (mini gastric bypass)',
    notes: [
      'Długi, wąski zbiornik wzdłuż krzywizny mniejszej; jedno zespolenie żołądkowo-jelitowe z pętlą typu omega.',
      'Pętla doprowadzająca (biliopankreatyczna) typowo 150–200 cm — długa droga do brodawki.',
      'Z zespolenia dwa wyloty: doprowadzający (do brodawki) i odprowadzający. Wybór wylotu to kluczowy krok; w razie wątpliwości fluoroskopia z kontrastem.',
      'W kontroli: refluks żółciowy do zbiornika i przełyku, owrzodzenie brzeżne.'
    ],
    frames: {
      resect: ['Linie przecięcia', 'Długi, wąski zbiornik wzdłuż krzywizny mniejszej, od okolicy wcięcia kątowego do kąta Hisa. Jelito nie jest przecinane: wybrana pętla 150–200 cm od więzadła Treitza.', 'Linie przecięcia'],
      remove: ['Wyłączenie żołądka', 'Pozostała część żołądka wyłączona; zostaje w jamie brzusznej.', 'Wyłączenie'],
      recon: ['Pętla omega', 'Pętla jelita czczego podciągnięta do zbiornika: jedno zespolenie żołądkowo-jelitowe. Ramię doprowadzające (biliopankreatyczne) doprowadza żółć i sok trzustkowy; ramię odprowadzające to już kanał wspólny — pokarm razem z żółcią i sokiem trzustkowym.', 'Rekonstrukcja'],
      post: 'Żółta pętla doprowadzająca (biliopankreatyczna), niebieska pętla odprowadzająca (kanał wspólny).',
      endoPost: 'Za zespoleniem wybór wylotu doprowadzającego; długa pętla wstecznie do więzadła Treitza i dwunastnicy. Brodawka od strony dystalnej.'
    },
    objects: [
      eso(),
      { id: 'stom', name: 'Żołądek', postName: 'Żołądek wyłączony', pre: { path: STOMACH, r: STOMACH_R }, post: { path: REM_O, r: REM_O_R }, morph: [1.1, 1.9],
        colors: [[1.1, COL.stomach], [1.9, COL.remnant]], mucosa: 'rugae', tint: MUC.stomach, labels: [stomachLabel(), L('Żołądek wyłączony', 0.3, [1.9, 99])] },
      { id: 'pouch', name: 'Zbiornik żołądkowy (długi)', pre: { path: POUCH_O, r: POUCH_O_R }, opacity: [[1.1, 0], [1.7, 1]], color: COL.stomach, mucosa: 'rugae', tint: MUC.stomach,
        labels: [L('Zbiornik (długi)', 0.45, [1.9, 99])] },
      duoStatic(),
      { id: 'aff', name: 'Jelito czcze', postName: 'Pętla doprowadzająca (biliopankreatyczna)', lenPost: 'typowo 150–200 cm', pre: oaSplit.parts[0], post: { path: AFF, r: flat(1.0) }, morph: [2, 3],
        colors: [[2, COL.bowel], [2.9, COL.bp]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Jelito czcze', 0.5, PRE), L('Pętla doprowadzająca', 0.6, POST, 'typowo 150–200 cm')] },
      { id: 'eff', name: 'Jelito czcze', postName: 'Pętla odprowadzająca (kanał wspólny)', pre: oaSplit.parts[1], post: { path: EFF, r: flat(1.0) }, morph: [2, 3],
        colors: [[2, COL.bowel], [2.9, COL.common]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Pętla odprowadzająca', 0.4, POST)] }
    ],
    marks: [
      { kind: 'line', cutDepth: 1.6, name: 'Linia przecięcia żołądka', color: COL.cut, opacity: CUT_OP,
        pts: [[1.0, 1.0, 2.3], [2.4, 0.9, 2.8], [3.4, 1.5, 3.0], [3.6, 3.5, 3.0], [3.6, 5.6, 2.6], [3.2, 7.4, 1.7], [2.6, 8.3, 0.8]] },
      ringOn(C.JEJ, flat(1.0), oaSplit.cuts[0], { name: 'Miejsce zespolenia: 150–200 cm od więzadła Treitza', color: COL.mark, opacity: [[0.05, 0], [0.55, 1], [2.1, 1], [2.4, 0]] }),
      ringAt(AFF, flat(1.0), [1.9, 0.6, 2.3], { name: 'Zespolenie żołądkowo-jelitowe (omega)', color: COL.anast, opacity: ANAST_OP })
    ],
    papilla: { obj: 'duo', near: PAP.near, dir: PAP.dir },
    routePost: [{ obj: 'eso' }, { obj: 'pouch', note: 'Długi, wąski zbiornik wzdłuż krzywizny mniejszej' },
      { obj: 'aff', from: 1, to: 0, note: 'Za zespoleniem wylot doprowadzający — długa pętla do więzadła Treitza' },
      { obj: 'duo', from: 1, to: 'papilla', note: 'Dwunastnica od strony dystalnej — brodawka w odwróconej orientacji' }]
  };

  /* ---------- 4. Rękaw ---------- */
  var slC = curveOf(SLEEVE), staple = [];
  for (var i = 0; i <= 26; i++) {
    var t = 0.01 + 0.7 * i / 26, p = slC.getPointAt(t), tan = slC.getTangentAt(t), d = V([1, 0.35, 0.45]);
    d.sub(tan.clone().multiplyScalar(d.dot(tan))).normalize();
    staple.push(p.add(d.multiplyScalar(SLEEVE_R(t) + 0.04)).toArray());
  }
  var SLV = {
    cat: 'upper', id: 'sleeve', short: 'Rękaw', skipRecon: true, ctOverride: { duo: 'contrast' },
    title: 'Rękawowa resekcja żołądka',
    sub: 'SG (sleeve gastrectomy)',
    notes: [
      'Anatomia ciągła — do brodawki standardowym duodenoskopem.',
      'Linia zszywek wzdłuż dawnej krzywizny większej. Miejsca problemowe: kąt Hisa (przeciek), wcięcie kątowe (zwężenie, skręcenie rękawa).',
      'Częsty refluks żołądkowo-przełykowy i przepuklina rozworu — ocena przełyku w obserwacji odległej.'
    ],
    frames: {
      resect: ['Zakres resekcji', 'Resekcja wzdłuż krzywizny większej, od 2–6 cm przed odźwiernikiem do kąta Hisa, na sondzie kalibracyjnej przy krzywiźnie mniejszej.', 'Zakres resekcji'],
      remove: ['Usunięcie preparatu', 'Usunięta większość żołądka z dnem; zostaje wąski rękaw z linią zszywek; zachowany odźwiernik i przedodźwiernikowa część antrum (2–6 cm), antrum zwężone.', 'Usunięcie'],
      post: 'Rękaw wzdłuż krzywizny mniejszej; odźwiernik zachowany, antrum zwężone, jelito bez zmian.',
      endoPost: 'Anatomia ciągła. Uwaga na wcięcie kątowe (zwężenie, skręcenie). Brodawka w typowej orientacji.'
    },
    objects: [
      eso(),
      { id: 'spec', name: 'Żołądek', pre: { path: STOMACH, r: STOMACH_R }, colors: SPEC_COL, opacity: SPEC_OP, offset: [[1.15, [0, 0, 0]], [1.9, [6, 0.5, 3.5]]],
        mucosa: 'rugae', tint: MUC.stomach, labels: [stomachLabel(), L('Część usuwana', 0.3, [0.5, 1.5])] },
      { id: 'sleeve', name: 'Rękaw żołądkowy', pre: { path: SLEEVE, r: SLEEVE_R }, opacity: [[0.3, 0], [0.85, 1]], color: COL.stomach, mucosa: 'rugae', tint: MUC.stomach,
        labels: [L('Rękaw żołądkowy', 0.35, [1.9, 99])] },
      duoObj(),
      jejObj()
    ],
    marks: [
      { kind: 'line', name: 'Linia cięcia', postName: 'Linia zszywek', color: COL.cut, colors: [[1.5, COL.cut], [2, COL.staple]], opacity: [[0.05, 0], [0.55, 1]], pts: staple }
    ],
    papilla: { obj: 'duo', near: PAP.near, dir: PAP.dir },
    routePost: [{ obj: 'eso' }, { obj: 'sleeve', note: 'Wąski rękaw — uwaga na wcięcie kątowe' }, { obj: 'duo', to: 'papilla', note: 'Opuszka i część zstępująca — brodawka w typowej orientacji' }]
  };


