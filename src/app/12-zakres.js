  /* ---------- wybór zakresu resekcji: przesunięcie guza podświetla odcinek jelita, krezkę i naczynia do podwiązania, reszta przygasa ---------- */
  var ZK_HI = '#d9463b', ZK_NODE = '#f0a030';
  function makeZakres(d) {
    var map = d.map, grp = new THREE.Group(), hiG = new THREE.Group(); grp.add(hiG);
    // krezka: kolor wierzchołków zależnie od tego, czy wiersz (odcinek jelita) jest w zakresie resekcji
    var sheets = map.sheets.map(function (sh) {
      var R = 6, pos = [], idx = [], ts = [];
      sh.rows.forEach(function (row) {
        var e = v3(row[0]), b = v3(row[1]);
        for (var j = 0; j <= R; j++) { var f = j / R, p = b.clone().lerp(e, f), sg = Math.sin(Math.PI * f); p.z -= 0.25 * sg; p.y -= 0.5 * sg; pos.push(p.x, p.y, p.z); ts.push(row[2]); }
      });
      for (var i = 0; i < sh.rows.length - 1; i++) for (var j = 0; j < R; j++) { var a0 = i * (R + 1) + j, b0 = a0 + R + 1; idx.push(a0, b0, a0 + 1, b0, b0 + 1, a0 + 1); }
      var g = track(new THREE.BufferGeometry()); g.setIndex(idx); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(pos.length), 3)); g.computeVertexNormals();
      grp.add(new THREE.Mesh(g, track(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.7, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide }))));
      return { g: g, ts: ts, meso: !!sh.meso };
    });
    // naczynia: pierścień podwiązania u odejścia (widoczny, gdy naczynie jest podwiązywane w danej operacji)
    var ves = {}, labels = [];
    map.vessels.forEach(function (v) {
      var c = new THREE.CatmullRomCurve3(v.pts.map(v3), false, 'centripetal'), r = v.kind === 'a' ? (v.id === 'sma' || v.id === 'ima' ? 0.15 : 0.085) : v.kind === 'v' ? 0.2 : 0.05;
      var mat = track(new THREE.MeshStandardMaterial({ color: MESO_COL[v.kind], roughness: 0.45, transparent: true }));
      grp.add(new THREE.Mesh(track(new THREE.TubeGeometry(c, v.pts.length * 12, r, 7, false)), mat));
      var tie = new THREE.Mesh(track(new THREE.TorusGeometry(r + 0.12, 0.07, 6, 18)), track(new THREE.MeshStandardMaterial({ color: '#1f2428', roughness: 0.4 })));
      tie.position.copy(c.getPointAt(0.05)); tie.quaternion.setFromUnitVectors(new V3(0, 0, 1), c.getTangentAt(0.05)); tie.visible = false; grp.add(tie);
      var L = v.name ? { el: mkLabel(v.name, '', MESO_COL[v.kind], 'seg'), p: c.getPointAt(v.at || 0.5), id: v.id } : null;
      if (L) labels.push(L);
      ves[v.id] = { v: v, mat: mat, tie: tie };
    });
    var sph = track(new THREE.SphereGeometry(0.19, 12, 9)), nodes = map.nodes.map(function (n) {
      var m = track(new THREE.MeshStandardMaterial({ color: '#4f9a6a', roughness: 0.5, transparent: true })), s = new THREE.Mesh(sph, m); s.position.fromArray(n.p); grp.add(s); return { n: n, m: m };
    });
    var hiMat = track(new THREE.MeshStandardMaterial({ color: ZK_HI, roughness: 0.5, transparent: true, opacity: 0.92 })), key = null, rule = null, cHi = new THREE.Color(ZK_HI), cIn = new THREE.Color('#ee7a55'), cOut = new THREE.Color('#e9dfb8');
    function hiTube(o, t0, t1) {
      var st = stateAt(o, 0), n = Math.max(8, Math.round(60 * (t1 - t0))), pts = [];
      for (var i = 0; i <= n; i++) pts.push(st.curve.getPointAt(t0 + (t1 - t0) * i / n));
      var c = new THREE.CatmullRomCurve3(pts, false, 'centripetal'), g = track(A.buildTube(c, function (u) { return st.r(t0 + (t1 - t0) * u) * 1.07; }, Math.max(24, n * 4), 26, true));
      hiG.add(new THREE.Mesh(g, hiMat));
    }
    function apply() {
      hiG.clear();
      var tie = rule ? rule.ties : [], rem = rule ? rule.removed : [];
      if (rule) {
        if (M.byId.colon) hiTube(M.byId.colon, rule.range[0], rule.range[1]);
        if (rule.ti && M.byId.ti) hiTube(M.byId.ti, 0.6, 1);
        if (rule.range[0] === 0 && M.byId.app) hiTube(M.byId.app, 0, 1);
      }
      sheets.forEach(function (s) {
        var col = s.g.attributes.color;
        s.ts.forEach(function (tt, i) { var inR = rule && tt >= rule.range[0] - 1e-3 && tt <= rule.range[1] + 1e-3 && (!s.meso || rule.meso); var c = !rule ? cOut : inR ? cIn : cOut; col.setXYZ(i, c.r, c.g, c.b); });
        col.needsUpdate = true;
      });
      Object.keys(ves).forEach(function (id) {
        var V = ves[id], on = rem.indexOf(id) >= 0 || tie.indexOf(id) >= 0, trunk = id === 'sma' || id === 'smv' || id === 'ima';
        V.mat.color.set(on ? ZK_HI : MESO_COL[V.v.kind]); V.mat.emissive.set(on ? '#5a0d08' : '#000000');
        V.mat.opacity = !rule || on ? 1 : trunk ? 0.8 : 0.3; V.tie.visible = tie.indexOf(id) >= 0;
      });
      nodes.forEach(function (N) { var on = rem.indexOf(N.n.v) >= 0; N.m.color.set(on ? ZK_NODE : '#4f9a6a'); N.m.opacity = !rule || on ? 1 : 0.3; });
    }
    return { d: d, grp: grp, overlay: false, el: null, labels: labels,
      update: function () {
        var tu = M.tumour, b = tu && S.tumour ? tu.bind : null, id = b ? b.o.def.id : null;
        rule = b ? A.resectionFor(id === 'colon' ? b.t : 0, id) : null;
        var k = rule ? rule.id + ':' + rule.range.map(function (x) { return x.toFixed(3); }).join(',') : 'none';
        if (k !== key) { key = k; apply(); }
        // przygaszenie jelita poza podświetleniem (po każdym applyM, który przywraca krycie obiektów)
        M.objs.forEach(function (o) {
          var op = rule ? 0.32 : 1; o.op = op; o.outer.material.opacity = op;
          var t = op < 0.999; if (t !== o.isT) { o.isT = t; o.outer.material.transparent = t; o.outer.material.depthWrite = !t; o.outer.material.needsUpdate = true; }
        });
        var tt = rule ? tr(rule.name) : tr('Wybór zakresu resekcji'), tx = rule ? tr(rule.where) + '. ' + tr(rule.desc) : tr('Włącz guz w panelu „Opis” i przesuń go na jelicie — podświetli się zakres resekcji.');
        if ($('capTitle').textContent !== tt) $('capTitle').textContent = tt;
        if ($('capText').textContent !== tx) $('capText').textContent = tx;
        var rem = rule ? rule.removed.concat(rule.ties) : [];
        labels.forEach(function (L) { L.anchor = L.p; L.alpha = rem.indexOf(L.id) >= 0 || L.id === 'sma' || L.id === 'ima' ? 1 : 0; });
      } };
  }
  TOOL_EXT.zakres = makeZakres;
