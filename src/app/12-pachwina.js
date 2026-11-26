  /* ---------- HERNIOLOGIA — PACHWINA (TOOL_EXT.groin): okolica pachwinowa prawa (ANAT.GROIN) w dwóch widokach.
     Lichtenstein — od przodu: skóra z tkanką podskórną (bryła rozcięta w linii cięcia), rozcięgno m. skośnego zewnętrznego (dwa płaty rozdzielone
     wzdłuż włókien; pierścień powierzchowny = stała szczelina między odnogami), m. skośny wewnętrzny (łuk nad powrózkiem), powięź poprzeczna, powrózek
     z nasieniowodem i naczyniami, worek skośny, nerwy, siatka i szwy. TAPP / TEP — od tyłu (model obrócony: przód u góry, stopy w głąb): powierzchnia
     wewnętrzna IS(s, t, odsunięcie) — ściana (t ≥ 0) przechodzi zaokrąglonym zagięciem w dno pachwiny (t < 0); otrzewna z fałdami, wrota przepukliny,
     naczynia nabrzuszne dolne i biodrowe zewnętrzne, nasieniowód, naczynia jądrowe, więzadło Coopera, pasmo biodrowo-łonowe, nerwy trójkąta bólu, siatka.
     Stan z osi czasu m (stateAt). Etykiety w układzie modelu, przeliczane przez macierz grupy. ---------- */
  // kolory warstw, naczyń, nerwów i siatki — ze wspólnego modelu ściany (ANAT.BODY.COL); w pachwinie m. skośny zewnętrzny to rozcięgno, otrzewna od strony jamy
  var GR_COL = Object.assign({}, A.BODY.COL, { eo: A.BODY.COL.apo, per: A.BODY.COL.perLap, floor: '#dcb96a', psoas: '#a8554b', bone: '#efe3c8', bladder: '#e8b4aa', lig: '#f6f2e8',
    cord: '#d98c7a', vas: '#f4f1ea', sac: '#c4d3df', doom: '#e53935', pain: '#fbc02d', hole: '#2a1616' });
  function makeGroin(d) {
    var G = A.GROIN, B = A.BODY, D = G.D, op = d.op, LAP = op !== 'lich', L = G.L, S0 = G.S[0], S1 = G.S[1];
    var grp = new THREE.Group(), labels = [], V = function () { return new V3(); };
    if (LAP) grp.rotation.set(-Math.PI / 2, Math.PI, 0, 'YXZ');   // (x, y, z) → (−x, z, y): przód ku górze ekranu, stopy w głąb
    grp.updateMatrixWorld(true);
    function mat(col, o) { o = o || {}; var m = track(new THREE.MeshStandardMaterial({ color: o.vc ? '#ffffff' : col, vertexColors: !!o.vc, roughness: o.rough == null ? 0.7 : o.rough, metalness: 0, side: THREE.DoubleSide,
      transparent: true, opacity: o.op == null ? 1 : o.op, depthWrite: o.dw == null ? true : o.dw, emissive: new THREE.Color(o.em || '#000000') })); if (o.map) { m.map = o.map; } return m; }
    // ściana: punkt (s, t) na głębokości dep pod skórą
    var LK = LAP ? 3 : 0;   // widok od tyłu: ściana uniesiona odmą (3 × BODY.lift: ok. 6 cm w pępku, w pachwinie prawie bez zmian)
    function wallP(s, t, dep, out) { var p = G.xy(s, t), q = B.at(p[0], p[1], dep, LK); return (out || V()).copy(q); }
    /* ---------- powierzchnia wewnętrzna IS(s, t, off) = P0 + off·N (liniowa w off); t ≥ R — ściana za powięzią poprzeczną, t ≤ −R — dno (w = −t) ---------- */
    // dno: bocznie dół biodrowy (mięsień biodrowo-lędźwiowy) wznosi się ku tyłowi i ku głowie; przyśrodkowo gałąź górna kości łonowej ku tyłowi, dalej miednica mniejsza
    var RC = 0.45, cornC = {}, UPL = new V3(0, 0.55, -0.85).normalize(), UPM = new V3(0, -0.15, -1).normalize(), DROP = new V3(0, -0.8, -0.35).normalize(), INV = new V3(0, 0.8, 0.6).normalize();
    function corner(s) { var k = s.toFixed(4), c = cornC[k]; if (c) return c; var p = G.xy(s, 0); c = { p: B.at(p[0], p[1], D.tf, 0), n: B.nrm(p[0], p[1], 0).negate() }; cornC[k] = c; return c; }
    var tu = V();
    function floorRaw(s, w, out) {
      var lat = sm((s - 0.32) / 0.3);
      out.copy(corner(s).p).addScaledVector(tu.copy(UPM).lerp(UPL, lat).normalize(), w);
      out.addScaledVector(DROP, 1.9 * sm((w - 1.4) / 2.2) * (1 - sm((s + 0.02) / 0.26)));                    // miednica mniejsza za spojeniem
      var h = 0.24 * Math.exp(-Math.pow((w - 0.6) / 0.45, 2)) * (1 - sm((s - 0.3) / 0.1))                  // gałąź górna kości łonowej
        + 0.5 * Math.exp(-Math.pow((s - 0.7) / 0.15, 2)) * sm(w / 1.4)                                     // mięsień biodrowo-lędźwiowy
        + 0.9 * Math.exp(-Math.pow((s + 0.22) / 0.24, 2) - Math.pow((w - 2.7) / 1.1, 2));                   // pęcherz moczowy
      return out.addScaledVector(INV, h);
    }
    var fa = V(), fb = V(), fc = V(), fd = V();
    function floorN(s, w, out) {
      var e = 0.01; floorRaw(s + e / L, w, fa); floorRaw(s - e / L, w, fb); floorRaw(s, w + e, fc); floorRaw(s, w - e, fd);
      out.copy(fa.sub(fb)).cross(fc.sub(fd)).normalize(); if (out.dot(INV) < 0) out.negate(); return out;
    }
    var t1 = V(), t2 = V(), t3 = V(), n1 = V();
    function ISpair(s, t, P, N) {   // P — punkt (off 0), N — przyrost na jednostkę off
      if (t >= RC) { wallP(s, t, D.tf, P); var p = G.xy(s, t); N.copy(B.nrm(p[0], p[1], LK)).negate(); return; }
      if (t <= -RC) { floorRaw(s, -t, P); floorN(s, -t, N); return; }
      var u = (RC - t) / (2 * RC), c = corner(s), pW = G.xy(s, RC);
      wallP(s, RC, D.tf, t1); var nW = B.nrm(pW[0], pW[1], LK).negate(); floorRaw(s, RC, t2); floorN(s, RC, n1);
      var nC = t3.copy(c.n).add(n1).normalize().multiplyScalar(1.35);
      var a = (1 - u) * (1 - u), b = 2 * u * (1 - u), cc = u * u;
      P.set(0, 0, 0).addScaledVector(t1, a).addScaledVector(c.p, b).addScaledVector(t2, cc);
      N.set(0, 0, 0).addScaledVector(nW, a).addScaledVector(nC, b).addScaledVector(n1, cc);
    }
    var IP = V(), IN = V();
    function IS(s, t, off, out) { ISpair(s, t, IP, IN); return (out || V()).copy(IP).addScaledVector(IN, off); }
    // odległość (w jednostkach) punktu (s, t) od łamanej w układzie (s, t)
    function distPL(s, t, PL) { var best = 1e9; for (var i = 0; i < PL.length - 1; i++) { var ax = PL[i][0] * L, ay = PL[i][1], bx = PL[i + 1][0] * L, by = PL[i + 1][1], px = s * L, py = t;
      var dx = bx - ax, dy = by - ay, u = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy))), qx = ax + u * dx - px, qy = ay + u * dy - py, dd = qx * qx + qy * qy; if (dd < best) best = dd; } return Math.sqrt(best); }
    function distP(s, t, p) { return Math.hypot((s - p[0]) * L, t - p[1]); }
    // struktury na dnie / ścianie od tyłu: [łamana, odsunięcie środka, promień]
    var COVER = [[G.EIA, 0.11, 0.2], [G.EIV, 0.14, 0.25], [G.COOPER, 0.2, 0.1], [G.VAS, 0.12, 0.08], [G.TEST, 0.12, 0.11], [G.IEV, 0.12, 0.12], [G.DCIA, 0.08, 0.06]];
    function cover(s, t) { var c = 0; COVER.forEach(function (q) { var dd = distPL(s, t, q[0]), h = (q[1] + q[2]) * Math.exp(-Math.pow(dd / (q[2] + 0.28), 2)); if (h > c) c = h; }); return c; }
    /* ---------- siatki wierzchołków ---------- */
    function gridGeo(ns, nt, vc, uv) {
      var nv = (ns + 1) * (nt + 1), g = track(new THREE.BufferGeometry()), idx = [];
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nv * 3), 3)); if (vc) g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(nv * 3), 3));
      if (uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(nv * 2), 2));
      for (var j = 0; j < nt; j++) for (var i = 0; i < ns; i++) { var a = j * (ns + 1) + i, b = a + ns + 1; idx.push(a, a + 1, b, b, a + 1, b + 1); }
      g.setIndex(idx); return g;
    }
    function done(g) { g.attributes.position.needsUpdate = true; if (g.attributes.color) g.attributes.color.needsUpdate = true; if (g.attributes.uv) g.attributes.uv.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingSphere(); }
    // powierzchnia: s ∈ sr, t ∈ tr(s) = [t0, t1]; fn(s, t, u, v, out) → punkt; col(s, t) → kolor (opcjonalnie)
    function surf(ns, nt, sr, tr, m, colFn, uvFn) {
      var g = gridGeo(ns, nt, !!colFn, !!uvFn), mesh = new THREE.Mesh(g, m); grp.add(mesh);
      var o = { g: g, mesh: mesh, ns: ns, nt: nt, sr: sr, tr: tr, col: colFn, uv: uvFn, P: g.attributes.position.array };
      o.update = function (fn) {
        var P = o.P, C = colFn ? g.attributes.color.array : null, U = uvFn ? g.attributes.uv.array : null, k = 0, q = V(), cc = new THREE.Color();
        for (var j = 0; j <= nt; j++) for (var i = 0; i <= ns; i++) {
          var s = sr[0] + (sr[1] - sr[0]) * i / ns, r = tr(s), t = r[0] + (r[1] - r[0]) * j / nt; fn(s, t, i / ns, j / nt, q);
          P[k * 3] = q.x; P[k * 3 + 1] = q.y; P[k * 3 + 2] = q.z;
          if (C) { cc.set(colFn(s, t)); C[k * 3] = cc.r; C[k * 3 + 1] = cc.g; C[k * 3 + 2] = cc.b; }
          if (U) { var w = uvFn(s, t); U[k * 2] = w[0]; U[k * 2 + 1] = w[1]; }
          k++;
        }
        done(g);
      };
      return o;
    }
    // pasek między dwiema łamanymi (ściana rany, brzeg bryły)
    function strip(n, m) { var g = gridGeo(n, 1, false, false), mesh = new THREE.Mesh(g, m); grp.add(mesh); return { g: g, mesh: mesh, n: n, set: function (A0, A1) { var P = g.attributes.position.array; for (var i = 0; i <= n; i++) { P.set([A0[i].x, A0[i].y, A0[i].z], i * 3); P.set([A1[i].x, A1[i].y, A1[i].z], (n + 1 + i) * 3); } done(g); } }; }
    function tubeMesh(m) { var mesh = new THREE.Mesh(track(new THREE.BufferGeometry()), m); grp.add(mesh); return mesh; }
    function setTube(mesh, pts, r, segs, closed) { if (mesh.geometry) mesh.geometry.dispose(); if (!pts || pts.length < 2) { mesh.geometry = track(new THREE.BufferGeometry()); return; } mesh.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, !!closed, 'centripetal'), segs || Math.max(16, pts.length * 6), r, 8, !!closed); }
    // gładka łamana w układzie parametrów → punkty
    function smoothPL(PL, n) { var c = new THREE.CatmullRomCurve3(PL.map(function (p) { return new V3(p[0], p[1], p[2] || 0); }), false, 'centripetal'), out = []; for (var i = 0; i <= n; i++) out.push(c.getPoint(i / n)); return out; }
    function lerpPL(PL, u) { var c = PL._c || (PL._c = new THREE.CatmullRomCurve3(PL.map(function (p) { return new V3(p[0], p[1], p[2] || 0); }), false, 'centripetal')); return c.getPoint(Math.max(0, Math.min(1, u))); }

    /* ---------- stan zabiegu ---------- */
    function stateAt(m) {
      var s = { inc: 0, open: 0, eoInc: 0, eo: 0, crem: 0, lift: 0, sacR: 0, meshIn: 0, tails: 0, sutL: 0, sutU: 0, eoClose: 0, eoSut: 0, skinClose: 0,
        pInc: 0, pOpen: 0, flap: 0, pariet: 0, sac: 1, mesh: 0, tacks: 0, close: 0, pSut: 0, bal: 0, lat: 0, des: 0 };
      if (op === 'lich') {
        s.inc = clamp01((m - 0.05) / 0.3); s.open = sm((m - 0.35) / 0.55); s.eoInc = clamp01((m - 1.05) / 0.3); s.eo = sm((m - 1.35) / 0.5);
        s.crem = sm((m - 2.05) / 0.3) * (1 - sm((m - 3.9) / 0.3)); s.lift = sm((m - 1.9) / 0.3) * (1 - sm((m - 3.55) / 0.3)); s.sacR = sm((m - 2.45) / 0.5); s.sac = 1 - s.sacR;
        s.meshIn = sm((m - 3.0) / 0.35); s.tails = sm((m - 3.3) / 0.35); s.sutL = clamp01((m - 3.4) / 0.3); s.sutU = clamp01((m - 3.72) / 0.15);
        s.eoClose = sm((m - 4.0) / 0.45); s.eoSut = clamp01((m - 4.45) / 0.25); s.skinClose = sm((m - 4.62) / 0.3);
        s.eo *= 1 - s.eoClose; s.open *= 1 - s.skinClose;
      } else {
        s.sac = 1 - sm((m - 2.05) / 0.45); s.pariet = sm((m - 2.45) / 0.45); s.mesh = sm((m - 3.0) / 0.55);
        if (op === 'tapp') { s.pInc = clamp01((m - 0.1) / 0.45); s.pOpen = sm((m - 0.5) / 0.4); s.flap = sm((m - 1.05) / 0.75); s.tacks = sm((m - 3.55) / 0.3); s.close = sm((m - 4.0) / 0.5); s.pSut = clamp01((m - 4.45) / 0.45); }
        else { s.bal = sm((m - 0.1) / 0.85); s.lat = sm((m - 1.05) / 0.8); s.des = sm((m - 4.05) / 0.8); }
      }
      return s;
    }

    /* =================== WIDOK PRZEDNI (Lichtenstein) =================== */
    var ant = {};
    if (!LAP) (function () {
      var TS = G.INC.t, TT = G.TW, TB = -G.TF, NS = 64;
      function bump(s, a, b, p) { if (s <= a || s >= b) return 0; return Math.pow(Math.sin(Math.PI * (s - a) / (b - a)), p || 0.7); }
      var sacC = G.xy(0.17, 0.5);
      function skinDisp(s, t, st, lower, bottom) {   // rozsunięcie rany (w t) i uwypuklenie przepukliny (w głąb, ujemne)
        var g = st.open * 1.5 * bump(s, G.INC.s0, G.INC.s1, 0.4) * (bottom ? 0.82 : 1), dd = lower ? TS - t : t - TS;
        return (lower ? -1 : 1) * g * Math.exp(-dd * dd / 5.5);
      }
      function bulge(s, t, st) { var p = G.xy(s, t), r2 = Math.pow(p[0] - sacC[0], 2) + Math.pow(p[1] - sacC[1], 2); return 0.32 * st.sac * Math.exp(-r2 / 1.1); }
      var mSkin = mat(GR_COL.skin, { rough: 0.8 }), mFat = mat(GR_COL.fat, { rough: 0.85 });
      function slab(lower) {
        var tr = lower ? function () { return [TB, TS]; } : function () { return [TS, TT]; }, nt = lower ? 30 : 34;
        var top = surf(NS, nt, [S0, S1], tr, mSkin), bot = surf(NS, nt, [S0, S1], tr, mFat);
        var edges = [strip(NS, mFat), strip(NS, mFat), strip(nt, mFat), strip(nt, mFat)];
        edges.forEach(function (e, k) { e.mesh.visible = k === (lower ? 1 : 0); });   // tylko ściana rany; brzegi bryły pod skórą podbrzusza
        return { lower: lower, top: top, bot: bot, edges: edges, nt: nt, tr: tr };
      }
      ant.slabs = [slab(true), slab(false)];
      // skóra podbrzusza poza bryłą (orientacja): przesunięta w głąb bufora głębi — w miejscu styku wygrywa bryła
      var mBody = mat(GR_COL.skin, { rough: 0.8 }); mBody.polygonOffset = true; mBody.polygonOffsetFactor = 2; mBody.polygonOffsetUnits = 4;
      (function () {
        var X0 = -12.4, X1 = 7.5, Y0 = -17.5, Y1 = -1.5, nx = 100, ny = 80, P = [], idx = [], g = track(new THREE.BufferGeometry());
        for (var j = 0; j <= ny; j++) for (var i = 0; i <= nx; i++) { var y = Y0 + (Y1 - Y0) * j / ny, x = X0 + (X1 - X0) * i / nx, w = B.W(y) * 0.995; x = Math.max(-w, Math.min(w, x)); var p = B.at(x, y, 0, 0); P.push(p.x, p.y, p.z); }
        function inBlock(x, y) { var q = G.st(x, y); return q[0] > S0 + 0.01 && q[0] < S1 - 0.01 && q[1] > TB + 0.06 && q[1] < TT - 0.06; }
        for (var j2 = 0; j2 < ny; j2++) for (var i2 = 0; i2 < nx; i2++) { var a = j2 * (nx + 1) + i2, b = a + nx + 1, cx = (P[a * 3] + P[(b + 1) * 3]) / 2, cy = (P[a * 3 + 1] + P[(b + 1) * 3 + 1]) / 2; if (!inBlock(cx, cy)) idx.push(a, a + 1, b, b, a + 1, b + 1); }
        g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(P), 3)); g.setIndex(idx); g.computeVertexNormals(); ant.body = new THREE.Mesh(g, mBody); grp.add(ant.body);
      })();
      ant.updSkin = function (st) {
        ant.slabs.forEach(function (sl) {
          function pt(s, t, bottom, out) { var dt = skinDisp(s, t, st, sl.lower, bottom), dep = bottom ? D.fat - 0.02 : -bulge(s, t, st); return wallP(s, t + dt, dep, out); }
          sl.top.update(function (s, t, u, v, q) { pt(s, t, false, q); }); sl.bot.update(function (s, t, u, v, q) { pt(s, t, true, q); });
          var r = sl.tr(0), rows = [r[0], r[1]];
          rows.forEach(function (t, k) { var a = [], b = []; for (var i = 0; i <= NS; i++) { var s = S0 + (S1 - S0) * i / NS; a.push(pt(s, t, false)); b.push(pt(s, t, true)); } sl.edges[k].set(a, b); });
          [S0, S1].forEach(function (s, k) { var a = [], b = []; for (var j = 0; j <= sl.nt; j++) { var t = r[0] + (r[1] - r[0]) * j / sl.nt; a.push(pt(s, t, false)); b.push(pt(s, t, true)); } sl.edges[2 + k].set(a, b); });
        });
      };
      // rozcięgno m. skośnego zewnętrznego: płat dolny (do więzadła) i górny; nacięcie wzdłuż linii split, pierścień powierzchowny = szczelina przy guzku
      var mEO = mat(GR_COL.eo, { rough: 0.55 });
      function eoLo(s) { return G.split(Math.max(s, 0.06)) * sm((s + 0.05) / 0.11); }
      function eoGap(s, st) { var inc = st.eoInc > 0 ? bump(s, 0.12, 0.17 + 0.53 * st.eoInc, 0.5) : 0; return { ring: G.ringGap(s) * (1 - 0.5 * st.eoClose), open: st.eo * 1.15 * Math.max(inc, s < 0.2 && st.eoInc > 0 ? bump(s, 0.0, 0.4, 0.6) : 0) }; }
      ant.eoL = surf(48, 10, [0.0, S1], function (s) { return [0, Math.max(0.01, eoLo(s))]; }, mEO);
      ant.eoU = surf(64, 30, [S0, S1], function (s) { return [eoLo(s), G.TW]; }, mEO);
      function eoPt(s, t, st, upper, out) {
        var g = eoGap(s, st), lo = eoLo(s), dep = D.fat + 0.01;
        if (upper) { var dd = t - lo, k = Math.exp(-dd * dd / 9); t += (g.ring * 0.6 + g.open * 2.1) * k; dep -= 0.3 * g.open * k; }
        else { var f = lo > 0 ? t / lo : 0; t -= (g.ring * 0.4 + g.open * 0.5) * f; dep += 0.3 * Math.pow(1 - f, 2) + 0.18 * g.open * f; }
        return wallP(s, t, dep, out);
      }
      ant.updEO = function (st) { ant.eoU.update(function (s, t, u, v, q) { eoPt(s, t, st, true, q); }); ant.eoL.update(function (s, t, u, v, q) { eoPt(s, t, st, false, q); }); };
      // więzadło pachwinowe (zawinięty brzeg rozcięgna) i guzek łonowy
      ant.lig = tubeMesh(mat(GR_COL.lig, { rough: 0.4 })); setTube(ant.lig, smoothPL([[0.0, 0.0], [0.5, 0.0], [1.0, 0.0]], 20).map(function (p) { return wallP(p.x, p.y, D.lig); }), 0.15, 40);
      ant.pt = new THREE.Mesh(track(new THREE.SphereGeometry(0.34, 16, 12)), mat(GR_COL.bone, { rough: 0.5 })); ant.pt.position.copy(wallP(-0.01, -0.12, D.lig + 0.2)); grp.add(ant.pt);
      // m. skośny wewnętrzny (łuk) — powierzchnia przednia i pasek wolnego brzegu; przyśrodkowo rozcięgno (ścięgno łączące)
      function ioTop(s) { return D.fat + 0.12 + 0.46 * (1 - sm(s / 0.28)); }
      function ioTh(s) { return 0.14 + 0.32 * sm((s - 0.15) / 0.3); }
      function ioCol(s, t) { var p = G.xy(s, t), apo = Math.abs(p[0]) < B.rectLat(p[1]) - 0.3 || s < 0.13; return apo ? GR_COL.apo : GR_COL.io; }
      ant.io = surf(64, 26, [S0, S1], function (s) { return [G.archIO(s), G.TW]; }, mat('#ffffff', { vc: true, rough: 0.75 }), ioCol);
      ant.ioE = strip(64, mat(GR_COL.io, { rough: 0.8 }));
      // powięź poprzeczna (tylna ściana kanału)
      ant.tf = surf(64, 30, [S0, S1], function () { return [0.0, G.TW]; }, mat(GR_COL.tf, { rough: 0.8 }));
      ant.tf.update(function (s, t, u, v, q) { wallP(s, t, D.tf, q); });
      ant.io.update(function (s, t, u, v, q) { wallP(s, t, ioTop(s), q); });
      (function () { var a = [], b = []; for (var i = 0; i <= 64; i++) { var s = S0 + (S1 - S0) * i / 64, t = G.archIO(s); a.push(wallP(s, t, ioTop(s))); b.push(wallP(s, t, ioTop(s) + ioTh(s))); } ant.ioE.set(a, b); })();
      // powrózek nasienny (s, t, głębokość) z uniesieniem, nasieniowód i naczynia jądrowe w środku, worek skośny przednio-przyśrodkowo
      var CORD = smoothPL(G.CORD, 60);
      function cordAt(st, dt, dd) { return CORD.map(function (p) { var lift = st.lift * 0.38 * bump(p.x, 0.05, 0.5, 0.8); return wallP(p.x, p.y + (dt || 0), p.z + (dd || 0) - lift); }); }
      ant.cord = tubeMesh(mat(GR_COL.cord, { rough: 0.7, op: 1 })); ant.vas = tubeMesh(mat(GR_COL.vas, { rough: 0.4 })); ant.ves = tubeMesh(mat(GR_COL.vein, { rough: 0.5 })); ant.art = tubeMesh(mat(GR_COL.art, { rough: 0.5 }));
      ant.sac = tubeMesh(mat(GR_COL.sac, { rough: 0.45, em: '#1c3448' })); ant.sacTip = new THREE.Mesh(track(new THREE.SphereGeometry(1, 16, 12)), ant.sac.material); grp.add(ant.sacTip);
      var SACP = smoothPL([[0.5, 0.92, 1.98], [0.46, 0.95, 1.6], [0.4, 0.96, 1.32], [0.32, 0.85, 1.2], [0.24, 0.72, 1.14], [0.17, 0.62, 1.12]], 40);
      // nerwy: biodrowo-pachwinowy (na powrózku), biodrowo-podbrzuszny (na m. skośnym wewnętrznym)
      ant.nII = tubeMesh(mat(GR_COL.nerve, { rough: 0.5 })); ant.nIH = tubeMesh(mat(GR_COL.nerve, { rough: 0.5 }));
      setTube(ant.nIH, smoothPL([[1.05, 2.95, 1.13], [0.7, 2.7, 1.13], [0.35, 2.45, 1.13], [0.14, 2.28, 1.1], [0.05, 2.16, 0.93]], 40).map(function (p) { return wallP(p.x, p.y, p.z); }), 0.055, 50);
      ant.updCord = function (st) {
        var c = cordAt(st); setTube(ant.cord, c, 0.32, 90);
        setTube(ant.vas, cordAt(st, -0.12, 0.06), 0.075, 90); setTube(ant.art, cordAt(st, 0.06, 0.1), 0.07, 90); setTube(ant.ves, cordAt(st, 0.12, 0.02), 0.085, 90);
        var ii = [wallP(0.76, 1.15, 1.14), wallP(0.62, 1.02, 1.18)].concat(CORD.filter(function (p) { return p.x < 0.47 && p.x > 0.0; }).map(function (p) { var lift = st.lift * 0.38 * bump(p.x, 0.05, 0.5, 0.8); return wallP(p.x, p.y + 0.06, p.z - 0.33 - lift); }));
        setTube(ant.nII, ii, 0.05, 70);
        var u1 = Math.max(0.02, 1 - st.sacR), pts = []; for (var i = 0; i <= 30; i++) { var p = SACP[Math.round(i / 30 * u1 * (SACP.length - 1))], lift = st.lift * 0.38 * bump(p.x, 0.05, 0.5, 0.8); pts.push(wallP(p.x, p.y, p.z - lift)); }
        ant.sac.visible = ant.sacTip.visible = st.sac > 0.03; setTube(ant.sac, pts, 0.22, 50); ant.sacTip.position.copy(pts[pts.length - 1]); ant.sacTip.scale.setScalar(0.22);
      };
      // siatka (Lichtenstein): dwie części — dolna (do szczeliny) i górna; ramiona boczne rozcięte na powrózek i skrzyżowane
      var mMesh = wallMeshMat(), mEdge = wallMeshEdgeMat(), edLo = tubeMesh(mEdge), edHi = tubeMesh(mEdge); var ML = G.MESH_L, RT = G.RING[1];   // siatka wyróżniona (12-powloki) z obramowaniem
      function slitLo(s) { return s < 0.46 ? RT : RT - 0.2 * sm((s - 0.46) / 0.05); }
      function slitHi(s, st) { return s < 0.46 ? RT : RT + 0.2 * sm((s - 0.46) / 0.05) - st.tails * 0.95 * sm((s - 0.56) / 0.1); }
      function meshTop(s, st) { var full = ML.t[1] - 0.6 * sm((s - 0.75) / 0.22); return full - st.tails * (full - 2.1) * sm((s - 0.55) / 0.12); }
      function meshDep(s, t, st, upper) { var a = G.archIO(s), d0 = t < 0.3 ? D.lig + 0.08 + (1.82 - D.lig - 0.08) * sm(t / 0.3) : 1.82; var dd = d0 + (ioTop(s) - 0.05 - d0) * sm((t - (a - 0.25)) / 0.35);
        return dd - 0.7 * (1 - st.meshIn) - (upper && s > 0.55 ? 0.05 * st.tails : 0); }
      function mUV(s, t) { return [s * L / 0.24, t / 0.24]; }   // oczka ok. 3,5 mm
      ant.meshLo = surf(46, 8, [ML.s[0], ML.s[1]], function (s) { return [ML.t[0], slitLo(s)]; }, mMesh, null, mUV);
      ant.meshHi = surf(46, 20, [ML.s[0], ML.s[1]], function (s) { return [slitHi(s, ant._st || stateAt(0)), meshTop(s, ant._st || stateAt(0))]; }, mMesh, null, mUV);
      ant.updMesh = function (st) {
        ant._st = st; var vis = st.meshIn > 0.01; ant.meshLo.mesh.visible = ant.meshHi.mesh.visible = edLo.visible = edHi.visible = vis; mMesh.opacity = mEdge.opacity = st.meshIn; if (!vis) return;
        ant.meshLo.update(function (s, t, u, v, q) { wallP(s, t, meshDep(s, t, st, false), q); }); ant.meshHi.update(function (s, t, u, v, q) { wallP(s, t, meshDep(s, t, st, true), q); });
        // obramowanie bez brzegów stykających się przy szczelinie na powrózek (dolny płat: bez górnego brzegu, górny: bez dolnego)
        var rLo = wallGridRim(ant.meshLo.P, 46, 8), rHi = wallGridRim(ant.meshHi.P, 46, 20);
        wallMeshEdgeSet(edLo, rLo.slice(1 + 46 + 8 + 46).concat(rLo.slice(0, 1 + 46 + 8)), 0.05); wallMeshEdgeSet(edHi, rHi.slice(46).concat(rHi.slice(0, 1)), 0.05);
      };
      // szwy
      var mSut = mat(GR_COL.suture, { rough: 0.5 });
      function zig(s0, s1, tA, tB, depFn, n) { var pts = []; for (var i = 0; i <= n; i++) { var s = s0 + (s1 - s0) * i / n, t = i % 2 ? tB(s) : tA(s); pts.push(wallP(s, t, depFn(s, t))); } return pts; }
      ant.sutL = tubeMesh(mSut); setTube(ant.sutL, zig(-0.12, 0.66, function () { return 0.05; }, function () { return 0.3; }, function (s, t) { return t < 0.1 ? D.lig - 0.06 : 1.72; }, 22), 0.04, 260);
      ant.sutU = new THREE.Group(); grp.add(ant.sutU);
      [[-0.12, 1.4], [0.06, 2.6], [0.24, 3.7], [0.42, 3.95]].forEach(function (p) { var m = new THREE.Mesh(track(new THREE.TorusGeometry(0.16, 0.035, 6, 16)), mSut); m.position.copy(wallP(p[0], p[1], ioTop(p[0]) - 0.04)); m.lookAt(wallP(p[0], p[1], ioTop(p[0]) - 1)); ant.sutU.add(m); });
      ant.sutT = new THREE.Mesh(track(new THREE.TorusGeometry(0.16, 0.035, 6, 16)), mSut); ant.sutT.position.copy(wallP(0.62, 0.12, D.lig - 0.1)); ant.sutT.lookAt(wallP(0.62, 0.12, 0)); grp.add(ant.sutT);
      ant.sutE = tubeMesh(mSut); setTube(ant.sutE, zig(0.17, 0.66, function (s) { return G.split(s) - 0.18; }, function (s) { return G.split(s) + 0.18; }, function () { return D.fat - 0.02; }, 18), 0.04, 220);
      ant.sutS = tubeMesh(mSut); setTube(ant.sutS, zig(G.INC.s0 + 0.01, G.INC.s1 - 0.01, function () { return TS - 0.16; }, function () { return TS + 0.16; }, function () { return -0.02; }, 16), 0.035, 200);
      // linie na skórze: więzadło pachwinowe (przerywana) i planowane cięcie
      var mDash = mat('#5a4a40', { rough: 0.6 }), mCut = mat(A.COL.cut, { rough: 0.5 });
      ant.ligSkin = new THREE.Group(); grp.add(ant.ligSkin);
      for (var di = 0; di < 14; di++) { var a0 = di / 14, a1 = a0 + 0.04; var seg = tubeMesh(mDash); grp.remove(seg); ant.ligSkin.add(seg); setTube(seg, [wallP(a0, 0, -0.03), wallP(a1, 0, -0.03)], 0.04, 4); }
      ant.plan = new THREE.Group(); grp.add(ant.plan);
      for (var pi = 0; pi < 8; pi++) { var b0 = G.INC.s0 + (G.INC.s1 - G.INC.s0) * pi / 8, b1 = b0 + 0.035; var sg = tubeMesh(mCut); grp.remove(sg); ant.plan.add(sg); setTube(sg, [wallP(b0, TS, -0.05), wallP(b1, TS, -0.05)], 0.05, 4); }
      ant.incL = tubeMesh(mCut); setTube(ant.incL, smoothPL([[G.INC.s0, TS], [G.INC.s1, TS]], 20).map(function (p) { return wallP(p.x, p.y, -0.04); }), 0.06, 40);
      ant.eoIncL = tubeMesh(mCut); setTube(ant.eoIncL, smoothPL([[0.17, G.split(0.17)], [0.45, G.split(0.45)], [0.7, G.split(0.7)]], 30).map(function (p) { return wallP(p.x, p.y, D.fat - 0.03); }), 0.05, 50);
    })();

    /* =================== WIDOK OD TYŁU (TAPP, TEP) =================== */
    var lap = {};
    if (LAP) (function () {
      var NS = 80, TOPT = G.TWL, BOT = -G.TP; S0 = G.SL[0]; S1 = G.SL[1];
      // tło: dno (mięsień, kość, pęcherz, tłuszcz) i powięź poprzeczna od tyłu — jedna powierzchnia IS(off 0)
      function deepCol(s, t) {
        if (t > 0.25) return GR_COL.tf;
        var w = -t, ps = Math.exp(-Math.pow((s - 0.72) / 0.18, 2)), bl = Math.exp(-Math.pow((s + 0.24) / 0.26, 2) - Math.pow((w - 2.9) / 1.3, 2)), bo = Math.exp(-Math.pow((w - 0.6) / 0.5, 2)) * (1 - sm((s - 0.3) / 0.1));
        var c = new THREE.Color(GR_COL.floor); c.lerp(new THREE.Color(GR_COL.psoas), Math.min(1, ps * sm(w / 1.0) * 1.1)); c.lerp(new THREE.Color(GR_COL.bladder), Math.min(1, bl * 1.2)); c.lerp(new THREE.Color(GR_COL.bone), Math.min(1, bo)); return '#' + c.getHexString();
      }
      lap.deep = surf(NS, 110, [S0, S1], function () { return [BOT, TOPT]; }, mat('#ffffff', { vc: true, rough: 0.75, em: '#221a14' }), deepCol);
      lap.deep.update(function (s, t, u, v, q) { IS(s, t, 0, q); });
      // struktury: tętnica i żyła biodrowa zewnętrzna, naczynia nabrzuszne dolne, nasieniowód, naczynia jądrowe, więzadło Coopera z gałęzią kości łonowej, pasmo biodrowo-łonowe, nerwy, corona mortis
      // przebiegi chowają się przy brzegach modelu: u góry za powięź poprzeczną (naczynia nabrzuszne wnikają do pochewki m. prostego), na dnie pod powięź
      function sink(t) { return 0.75 * sm((t - 2.5) / 0.9) + 0.75 * sm(((BOT + 1.8) - t) / 0.8); }   // u góry: naczynia nabrzuszne wnikają do pochewki m. prostego (kresa łukowata, 3–4 cm nad pierścieniem)
      function path(PL, off, n) { return smoothPL(PL, n || 48).filter(function (p) { return p.y <= 3.6 && p.y >= BOT + 0.05; }).map(function (p) { return IS(p.x, p.y, (typeof off === 'function' ? off(p.x, p.y) : off) - sink(p.y)); }); }
      function tubeOn(PL, off, r, col, o) {   // przewód z zaokrąglonymi końcami
        var m = tubeMesh(mat(col, o || { rough: 0.45 })), pts = path(PL, off); setTube(m, pts, r, 80);
        [pts[0], pts[pts.length - 1]].forEach(function (p) { var c = new THREE.Mesh(track(new THREE.SphereGeometry(r, 12, 8)), m.material); c.position.copy(p); grp.add(c); });
        return m; }
      lap.eia = tubeOn(G.EIA, 0.11, 0.2, GR_COL.art); lap.eiv = tubeOn(G.EIV, 0.14, 0.25, GR_COL.vein);   // pod powięzią — częściowo w podłożu
      lap.dcia = tubeOn(G.DCIA, 0.08, 0.06, GR_COL.art);   // okalające biodra głębokie (wspólny model ściany)
      lap.ieA = tubeOn(G.IEV, 0.12, 0.1, GR_COL.art); lap.ieV1 = tubeOn(G.IEV.map(function (p) { return [p[0] - 0.014, p[1]]; }), 0.1, 0.075, GR_COL.vein); lap.ieV2 = tubeOn(G.IEV.map(function (p) { return [p[0] + 0.014, p[1]]; }), 0.1, 0.075, GR_COL.vein);
      lap.ramus = tubeOn(G.COOPER, -0.05, 0.3, GR_COL.bone, { rough: 0.5 }); lap.cooper = tubeOn(G.COOPER, 0.2, 0.1, GR_COL.lig, { rough: 0.3 });
      lap.ipt = tubeOn([[0.03, 0.24], [0.5, 0.22], [1.0, 0.22]], 0.04, 0.08, GR_COL.lig, { rough: 0.35 });
      lap.corona = tubeOn(G.CORONA, 0.12, 0.06, '#6b4fa0');
      lap.lfcn = tubeOn(G.LFCN, 0.05, 0.045, GR_COL.nerve); lap.gfn = tubeOn(G.GFN, 0.05, 0.035, GR_COL.nerve); lap.femn = tubeOn(G.FEMN, -0.04, 0.09, GR_COL.nerve);
      // nasieniowód i naczynia jądrowe: przy pierścieniu głębokim wnikają w ścianę (odsunięcie ujemne); parietalizacja nie zmienia ich położenia
      function cordOff(base) { return function (s, t) { var r = distP(s, t, G.RING); return base - 0.45 * Math.exp(-r * r / 0.08); }; }
      lap.vas = tubeOn(G.VAS, cordOff(0.13), 0.09, GR_COL.vas, { rough: 0.3, em: '#3a3a36' }); lap.test = tubeOn(G.TEST, cordOff(0.12), 0.11, '#a43a4a');
      lap.ring = new THREE.Mesh(track(new THREE.TorusGeometry(0.34, 0.06, 8, 24)), mat('#bfae92', { rough: 0.7 })); lap.ring.position.copy(IS(G.RING[0], G.RING[1], 0.03)); lap.ring.lookAt(IS(G.RING[0], G.RING[1], 1)); grp.add(lap.ring);
      // pierścień głęboki — wrota przepukliny: ciemne zagłębienie w otrzewnej
      var holeTex = (function () { var c = document.createElement('canvas'); c.width = c.height = 64; var g = c.getContext('2d'); var gr = g && g.createRadialGradient ? g.createRadialGradient(32, 32, 2, 32, 32, 31) : null; if (gr) {
        gr.addColorStop(0, 'rgba(18,6,5,1)'); gr.addColorStop(0.55, 'rgba(40,14,10,0.92)'); gr.addColorStop(1, 'rgba(60,24,18,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); } return new THREE.CanvasTexture(c); })();
      lap.hole = new THREE.Mesh(track(new THREE.CircleGeometry(1, 32)), track(new THREE.MeshBasicMaterial({ map: holeTex, transparent: true, depthWrite: false }))); lap.hole.renderOrder = 6; grp.add(lap.hole);   // wrota: ciemne wejście do kanału (miękki brzeg)
      // otrzewna: dwie części rozdzielone linią nacięcia (TAPP), odsunięcie od powierzchni: fałdy, wrota, płat, balon (TEP)
      var tInc = G.tInc, SA = G.TAPP_S[0], SB = G.TAPP_S[1];
      function per0(s, t) { var x = G.xy(s, t)[0], f = Math.max(D.per, cover(s, t) + 0.08);
        f += 0.2 * Math.exp(-Math.pow(distPL(s, t, G.UMBM) / 0.32, 2)) + 0.1 * Math.exp(-Math.pow(distPL(s, t, G.IEV) / 0.3, 2)) + (t > 0 ? 0.12 * Math.exp(-x * x / 0.06) : 0); return f; }
      function perOff(s, t, st, lower) {
        var off = lap.base(s, t), r = distP(s, t, G.RING), near = Math.exp(-r * r / 0.35);
        off -= st.sac * (off - 0.05) * Math.exp(-r * r / 0.28);
        var cordNear = Math.exp(-Math.pow(Math.min(distPL(s, t, G.VAS), distPL(s, t, G.TEST)) / 0.75, 2)) * sm((t + 2.8) / 0.4) * (1 - sm((t - 1.0) / 0.3));
        if (op === 'tapp') {
          var span = sm((s + 0.42) / 0.1) * (1 - sm((s - 1.06) / 0.08)), det = sm((t + 2.6) / 0.6);
          if (lower) {
            var e = sm((s - SA + 0.03) / 0.06) * (1 - sm((s - SB) / 0.06)), dt = Math.max(0, tInc(s) - t), hinge = e + (1 - e) * sm(dt / 0.8);
            off += (st.flap * span * det * hinge * (0.3 + 0.25 * sm(t / 1.5)) * (1 - st.sac * near) + st.pariet * 0.4 * cordNear) * (1 - st.close);
            off += st.pOpen * (1 - st.close) * e * 0.25 * Math.exp(-dt * dt / 0.2);
          } else { var e2 = sm((s - SA + 0.03) / 0.06) * (1 - sm((s - SB) / 0.06)); off += st.pOpen * (1 - st.close) * e2 * 0.12 * Math.exp(-Math.pow(t - tInc(s), 2) / 0.2); }
        } else {
          var E1 = Math.exp(-Math.pow((s - 0.12) * L / 3.6, 2) - Math.pow((t - 0.4) / 3.0, 2)), E2 = Math.exp(-Math.pow((s - 0.75) * L / 2.6, 2) - Math.pow((t - 0.7) / 2.6, 2));
          off += ((st.bal * 1.15 * Math.min(1, E1 * 1.6) + st.lat * 1.0 * Math.min(1, E2 * 1.6)) * (1 - st.sac * near * 0.7) + st.pariet * 0.55 * cordNear) * (1 - st.des);
        }
        return off;
      }
      var mPerU = mat(GR_COL.per, { op: 0.78, rough: 0.28, dw: false, em: '#2a1612' }), mPerL = mat(GR_COL.per, { op: 0.78, rough: 0.28, dw: false, em: '#2a1612' });
      lap.perU = surf(NS, 44, [S0, S1], function (s) { return [tInc(s), TOPT]; }, mPerU); lap.perL = surf(NS, 76, [S0, S1], function (s) { return [BOT, tInc(s)]; }, mPerL);
      lap.perU.mesh.renderOrder = lap.perL.mesh.renderOrder = 4;
      // stałe: P0, N i odsunięcie bazowe dla wierzchołków otrzewnej
      function cache(o) { var c = []; for (var j = 0; j <= o.nt; j++) for (var i = 0; i <= o.ns; i++) { var s = o.sr[0] + (o.sr[1] - o.sr[0]) * i / o.ns, r = o.tr(s), t = r[0] + (r[1] - r[0]) * j / o.nt, P = V(), N = V(); ISpair(s, t, P, N); c.push({ s: s, t: t, P: P, N: N, b: per0(s, t) }); } o.c = c; }
      var baseMap = null; lap.base = function (s, t) { return per0(s, t); };
      cache(lap.perU); cache(lap.perL);
      lap.updPer = function (st) {
        [[lap.perU, false], [lap.perL, true]].forEach(function (q) { var o = q[0], P = o.P; lap.base = null;
          o.c.forEach(function (c, k) { lap.base = function () { return c.b; }; var off = perOff(c.s, c.t, st, q[1]); P[k * 3] = c.P.x + c.N.x * off; P[k * 3 + 1] = c.P.y + c.N.y * off; P[k * 3 + 2] = c.P.z + c.N.z * off; });
          done(o.g); });
        mPerU.opacity = 0.78 - (op === 'tep' ? 0.6 * Math.max(st.bal, st.lat) * (1 - st.des) : 0);
        mPerL.opacity = 0.78 - (op === 'tapp' ? 0.68 * st.flap * (1 - st.close) : 0.62 * Math.max(st.bal, st.lat) * (1 - st.des));
        if (op === 'tapp') {   // brzegi nacięcia otrzewnej (płat dolny i górny)
          var showR = st.pOpen > 0.02 && st.flap < 0.6 && st.close < 0.98; lap.rimL.visible = lap.rimU.visible = showR; mRim.opacity = 1 - sm(st.flap / 0.6);
          if (showR) [[lap.perL, lap.perL.nt, lap.rimL], [lap.perU, 0, lap.rimU]].forEach(function (q) { var o = q[0], row = q[1], pts = [];
            for (var i = 0; i <= o.ns; i++) { var c = o.c[row * (o.ns + 1) + i]; if (c.s < SA + 0.01 || c.s > SB - 0.01) continue; var k = (row * (o.ns + 1) + i) * 3; pts.push(new V3(o.P[k], o.P[k + 1], o.P[k + 2])); }
            setTube(q[2], pts, 0.028, 90); });
        }
        var hp = IS(G.RING[0], G.RING[1], 0.3); lap.hole.position.copy(hp); lap.hole.lookAt(IS(G.RING[0], G.RING[1], 2)); lap.hole.scale.setScalar(0.62 * Math.sqrt(Math.max(0, st.sac))); lap.hole.visible = st.sac > 0.04;
      };
      var mRim = mat('#caa196', { rough: 0.35 }); lap.rimL = tubeMesh(mRim); lap.rimU = tubeMesh(mRim); lap.rimL.renderOrder = lap.rimU.renderOrder = 5;
      // światło optyki: punktowe w miejscu kamery (jak w laparoskopii — jaśniej w środku pola)
      var scope = new THREE.PointLight('#fff4ea', 1.05, 34, 1); grp.add(scope);   // przy tym widoku światło sceny przygaszone (M.light w przebiegu orbitalnym)
      lap.deep.mesh.onBeforeRender = function (r, sc, cam) { scope.position.copy(grp.worldToLocal(cam.position.clone())); };
      // tło jamy brzusznej: ciemna kula wokół pola (widoczna tylko od środka) — brzegi modelu giną w ciemności jak poza zasięgiem światła optyki
      var cav = new THREE.Mesh(track(new THREE.SphereGeometry(26, 32, 20)), track(new THREE.MeshBasicMaterial({ color: '#24120f', side: THREE.BackSide, depthWrite: false })));
      cav.position.copy(IS(0.45, 1.0, 1.5)); cav.renderOrder = -1; grp.add(cav);
      // nacięcie otrzewnej i szew (TAPP)
      var mCut = mat(A.COL.cut, { rough: 0.5 }), mSut = mat(GR_COL.suture, { rough: 0.5 });
      lap.incL = tubeMesh(mCut); setTube(lap.incL, smoothPL([[SA, tInc(SA)], [0.6, tInc(0.6)], [SB, tInc(SB)]], 40).map(function (p) { return IS(p.x, p.y, lap.base ? per0(p.x, p.y) + 0.03 : D.per); }), 0.05, 80);
      lap.sut = tubeMesh(mSut); (function () { var pts = []; for (var i = 0; i <= 26; i++) { var s = SA + (SB - SA) * i / 26, t = tInc(s) + (i % 2 ? 0.1 : -0.1); pts.push(IS(s, t, per0(s, t) + 0.04)); } setTube(lap.sut, pts, 0.03, 300); })();
      // siatka 15 × 10 cm na otworze mięśniowo-łonowym; pinezki (TAPP); strefy bez mocowania (trójkąt zagłady i bólu)
      var MP = G.MESH_P, mMesh = wallMeshMat(), mEdge = wallMeshEdgeMat(), edP = tubeMesh(mEdge);   // siatka wyróżniona (12-powloki) z obramowaniem
      lap.mesh = surf(60, 46, MP.s, function () { return MP.t; }, mMesh, null, function (s, t) { return [s * L / 0.32, t / 0.32]; }); lap.mesh.mesh.renderOrder = 3;
      (function () { var c = []; for (var j = 0; j <= 46; j++) for (var i = 0; i <= 60; i++) { var s = MP.s[0] + (MP.s[1] - MP.s[0]) * i / 60, t = MP.t[0] + (MP.t[1] - MP.t[0]) * j / 46, P = V(), N = V(); ISpair(s, t, P, N); c.push({ P: P, N: N, b: Math.max(0.19, cover(s, t) + 0.05) }); } lap.mesh.c = c; })();
      lap.mesh.update(function (s, t, u, v, q) { IS(s, t, 0.2, q); });   // UV
      lap.updMesh = function (st) {
        var vis = st.mesh > 0.01; lap.mesh.mesh.visible = edP.visible = vis; mMesh.opacity = mEdge.opacity = st.mesh; if (!vis) return;
        var P = lap.mesh.P; lap.mesh.c.forEach(function (c, k) { var off = c.b + 1.0 * (1 - st.mesh); P[k * 3] = c.P.x + c.N.x * off; P[k * 3 + 1] = c.P.y + c.N.y * off; P[k * 3 + 2] = c.P.z + c.N.z * off; }); done(lap.mesh.g);
        wallMeshEdgeSet(edP, wallGridRim(P, 60, 46), 0.05, true);
      };
      lap.tacks = new THREE.Group(); grp.add(lap.tacks);
      if (op === 'tapp') G.TACKS.forEach(function (p) { var m = new THREE.Mesh(track(new THREE.TorusGeometry(0.13, 0.04, 6, 16)), mat('#9aa5ae', { rough: 0.3 })), c = Math.max(0.19, cover(p[0], p[1]) + 0.05); m.position.copy(IS(p[0], p[1], c + 0.04)); m.lookAt(IS(p[0], p[1], c + 1)); lap.tacks.add(m); });
      function zone(edgeA, edgeB, col) { var g = surf(10, 16, [0, 1], function () { return [0, 1]; }, mat(col, { op: 0, dw: false, rough: 0.9 }));
        g.update(function (s, t, u, v, q) { var a = lerpPL(edgeA, v), b = lerpPL(edgeB, v); IS(a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u, 0.23, q); }); g.mesh.renderOrder = 5; return g; }
      var vasD = [[0.47, 0.6], [0.41, -0.15], [0.34, -0.95], [0.25, -1.45]], testD = [[0.53, 0.6], [0.54, -0.2], [0.57, -1.0], [0.6, -1.9]];
      lap.doom = zone(vasD, testD, GR_COL.doom);
      lap.pain = zone([[0.56, 0.12], [0.56, -0.3], [0.58, -1.0], [0.61, -1.9]], [[0.98, 0.12], [0.97, -0.3], [0.96, -1.0], [0.95, -1.9]], GR_COL.pain);
      // światło od strony optyki
    })();
    else { var fill = new THREE.DirectionalLight('#ffffff', 0.35); fill.position.copy(wallP(0.3, -3, -6)); grp.add(fill); }

    /* ---------- etykiety ---------- */
    function lab(name, sub, col, kind, fn, when) { var o = { el: mkLabel(name, sub, col, kind), fn: fn, when: when, alpha: 0 }; labels.push(o); return o; }
    var NORM = function (st, m) { return m <= 0.001; };
    function win(a, b) { return function (st, m) { return m > a && m < b; }; }
    if (!LAP) {
      lab('Kolec biodrowy przedni górny', '', '#8a5f50', 'ghost', function () { return wallP(1.0, 0, -0.05); }, NORM);
      lab('Guzek łonowy', '', '#8a5f50', 'ghost', function (st, m) { return m < 0.5 ? wallP(0.0, -0.05, -0.05) : ant.pt.position.clone(); }, function (st, m) { return m <= 0.001 || (m > 1.5 && m < 2.05); });
      lab('Więzadło pachwinowe', 'rzut na skórę', '#5a4a40', 'ghost', function () { return wallP(0.72, 0, -0.04); }, NORM);
      lab('Przepuklina', 'uwypuklenie nad pierścieniem powierzchownym', GR_COL.sac, 'seg', function () { return wallP(0.17, 0.5, -0.32); }, NORM);
      lab('Cięcie skóry', '5–6 cm, ok. 2 cm nad więzadłem', A.COL.cut, 'cut', function () { return wallP(0.36, G.INC.t, -0.05); }, function (st, m) { return m <= 0.001 || (m > 0.1 && m < 0.4); });
      lab('Rozcięgno m. skośnego zewnętrznego', '', '#9b8f78', 'seg', function (st) { return eoPtL(0.36, 1.9, st); }, win(0.8, 1.35));
      lab('Pierścień pachwinowy powierzchowny', '', '#9b8f78', 'seg', function (st) { return wallP(0.08, 0.36, D.fat - 0.1); }, win(0.8, 1.35));
      lab('Powrózek nasienny', '', GR_COL.cord, 'seg', function (st) { return cordPt(0.25, st, -0.3); }, function (st, m) { return (m > 0.8 && m < 1.35) || (m > 1.6 && m < 2.05); });
      lab('Nacięcie rozcięgna', 'wzdłuż włókien', A.COL.cut, 'cut', function () { return wallP(0.55, G.split(0.55), D.fat - 0.05); }, win(1.05, 1.4));
      lab('Nerw biodrowo-pachwinowy', 'na powrózku', GR_COL.nerve, 'seg', function (st) { return cordPt(0.3, st, -0.36, 0.06); }, win(1.6, 2.05));
      lab('Nerw biodrowo-podbrzuszny', 'na m. skośnym wewnętrznym', GR_COL.nerve, 'seg', function () { return wallP(0.3, 2.42, 1.12); }, win(1.6, 2.05));
      lab('Mięsień skośny wewnętrzny', '', GR_COL.io, 'seg', function () { return wallP(0.46, 1.75, 1.2); }, win(1.6, 2.05));
      lab('Więzadło pachwinowe', 'brzeg zagięty', '#9b8f78', 'seg', function () { return wallP(0.36, 0.0, D.lig - 0.15); }, function (st, m) { return (m > 1.6 && m < 2.05) || (m > 3.75 && m < 4.05); });
      lab('Powięź poprzeczna', 'tylna ściana kanału', '#9b8f78', 'ghost', function () { return wallP(0.3, 1.05, D.tf - 0.05); }, win(1.6, 2.05));
      lab('Worek przepuklinowy skośny', '', GR_COL.sac, 'seg', function (st) { return wallP(0.28, 0.82, 1.0 - st.lift * 0.3); }, win(2.1, 2.5));
      lab('Nasieniowód', '', '#8f8a80', 'seg', function (st) { return cordPt(0.36, st, 0.0, -0.12); }, win(2.35, 3.05));
      lab('Naczynia jądrowe', '', GR_COL.vein, 'ghost', function (st) { return cordPt(0.24, st, 0.0, 0.12); }, win(2.35, 3.05));
      lab('Pierścień głęboki', 'worek odprowadzony', '#9b8f78', 'seg', function () { return wallP(0.52, 1.02, 1.6); }, win(2.85, 3.05));
      lab('Siatka', 'polipropylenowa, ok. 7 × 15 cm', GR_COL.mesh, 'seg', function (st) { return wallP(0.2, 2.6, ioTopL(0.2) - 0.08); }, win(3.3, 4.05));
      lab('Szew ciągły', 'do więzadła pachwinowego', GR_COL.suture, 'seg', function () { return wallP(0.3, 0.12, D.lig - 0.1); }, win(3.6, 3.9));
      lab('Zakład 2 cm na guzek łonowy', '', GR_COL.mesh, 'ghost', function () { return wallP(0.05, 0.3, 1.5); }, win(3.4, 4.05));
      lab('Skrzyżowane ramiona siatki', 'nowy pierścień głęboki', GR_COL.mesh, 'seg', function () { return wallP(0.56, 1.05, 1.05); }, win(3.65, 4.05));
      lab('Szew rozcięgna', 'nad powrózkiem', GR_COL.suture, 'seg', function () { return wallP(0.45, G.split(0.45), D.fat - 0.05); }, win(4.5, 4.75));
      lab('Szew skóry', '', GR_COL.suture, 'seg', function () { return wallP(0.3, G.INC.t, -0.05); }, function (st, m) { return m > 4.85; });
    } else {
      lab('Fałd pępkowy przyśrodkowy', 'tętnica pępkowa zarośnięta', '#7d8b96', 'ghost', function () { return IS(0.22, 2.2, 0.55); }, function (st, m) { return m < 0.4; });
      lab('Naczynia nabrzuszne dolne', 'fałd pępkowy boczny', GR_COL.art, 'seg', function (st) { return IS(0.46, 2.6, op === 'tapp' && st.flap > 0.5 ? 0.15 : 0.45); }, function (st, m) { return m < 0.4 || (m > 1.6 && m < 2.05); });
      lab('Wrota przepukliny skośnej', 'dół pachwinowy boczny', GR_COL.hole, 'seg', function () { return IS(G.RING[0] + 0.04, G.RING[1], 0.1); }, function (st, m) { return m < 0.4; });
      lab('Dół pachwinowy przyśrodkowy', 'przepukliny proste', '#7d8b96', 'ghost', function () { return IS(0.33, 0.9, 0.45); }, NORM);
      lab('Naczynia biodrowe zewnętrzne', '', GR_COL.vein, 'ghost', function () { return IS(0.43, -2.0, 0.7); }, function (st, m) { return m < 0.001 || (m > 1.6 && m < 2.05); });
      lab('Pęcherz moczowy', '', '#b07a72', 'ghost', function () { return IS(-0.24, -2.9, 0.4); }, NORM);
      lab('Nacięcie otrzewnej', '3–4 cm nad wrotami', A.COL.cut, 'cut', function () { return IS(0.72, tIncS(0.72), 0.45); }, function (st, m) { return op === 'tapp' && m > 0.15 && m < 1.05; });
      lab('Więzadło Coopera', '', '#9b8f78', 'seg', function () { return IS(0.1, -0.72, 0.3); }, function (st, m) { return m > 1.6 && m < 2.05; });
      lab('Pasmo biodrowo-łonowe', '', '#9b8f78', 'seg', function () { return IS(0.85, 0.22, 0.12); }, function (st, m) { return m > 1.6 && m < 2.05; });
      lab('Trójkąt zagłady', 'naczynia biodrowe zewnętrzne', GR_COL.doom, 'seg', function () { return IS(0.48, -0.9, 0.3); }, function (st, m) { return (m > 1.6 && m < 2.05) || (m > 3.6 && m < 4.05); });
      lab('Trójkąt bólu', 'nerwy', '#c79a00', 'seg', function () { return IS(0.8, -0.9, 0.3); }, function (st, m) { return (m > 1.6 && m < 2.05) || (m > 3.6 && m < 4.05); });
      lab('Corona mortis', 'wariant', '#6b4fa0', 'ghost', function () { return IS(0.21, -1.1, 0.15); }, function (st, m) { return m > 1.6 && m < 2.05; });
      lab('Przestrzeń Retziusa', '', '#7d8b96', 'ghost', function () { return IS(-0.2, 0.6, 0.3); }, function (st, m) { return m > 1.6 && m < 2.05; });
      lab('Przestrzeń Bogrosa', '', '#7d8b96', 'ghost', function () { return IS(0.88, 1.2, 0.3); }, function (st, m) { return m > 1.6 && m < 2.05; });
      lab('Nasieniowód', '', '#8f8a80', 'seg', function () { return IS(0.3, -1.3, 0.22); }, function (st, m) { return m < 0.001 || (m > 2.5 && m < 3.05); });
      lab('Naczynia jądrowe', '', '#a43a4a', 'seg', function () { return IS(0.6, -2.0, 0.22); }, function (st, m) { return m < 0.001 || (m > 2.5 && m < 3.05); });
      lab('Pierścień głęboki', 'worek odprowadzony', '#9b8f78', 'seg', function () { return IS(G.RING[0], G.RING[1] + 0.35, 0.1); }, function (st, m) { return m > 2.5 && m < 3.05; });
      lab('Parietalizacja', 'otrzewna odsunięta od elementów powrózka', '#7d8b96', 'ghost', function () { return IS(0.42, -1.7, 0.9); }, function (st, m) { return m > 2.7 && m < 3.05; });
      lab('Siatka 15 × 10 cm', 'otwór mięśniowo-łonowy pokryty', GR_COL.mesh, 'seg', function () { return IS(0.15, 1.8, 0.2); }, function (st, m) { return m > 3.4 && m < 4.05; });
      if (op === 'tapp') lab('Mocowanie', 'więzadło Coopera, przyśrodkowo', '#7d8b96', 'seg', function () { return IS(G.TACKS[0][0], G.TACKS[0][1], 0.45); }, function (st, m) { return m > 3.7 && m < 4.05; });
      if (op === 'tapp') lab('Szew otrzewnej', '', GR_COL.suture, 'seg', function () { return IS(0.6, tIncS(0.6), 0.5); }, function (st, m) { return m > 4.6; });
      else lab('Otrzewna na siatce', 'po desuflacji', '#7d8b96', 'seg', function () { return IS(0.55, 1.6, 0.4); }, function (st, m) { return m > 4.6; });
      if (op === 'tep') lab('Przestrzeń przedotrzewnowa', 'otrzewna odsunięta balonem', '#7d8b96', 'seg', function () { return IS(0.2, 1.2, 0.9); }, function (st, m) { return m > 0.6 && m < 1.05; });
    }
    function tIncS(s) { return G.tInc(s); }
    function ioTopL(s) { return D.fat + 0.12 + 0.46 * (1 - sm(s / 0.28)); }
    function eoPtL(s, t, st) { return wallP(s, t, D.fat - 0.05); }
    function cordPt(s, st, dd, dt) { var c = G.CORD, best = c[0], bd = 9; c.forEach(function (p) { var e = Math.abs(p[0] - s); if (e < bd) { bd = e; best = p; } }); var lift = st.lift * 0.38 * (s > 0.05 && s < 0.5 ? Math.pow(Math.sin(Math.PI * (s - 0.05) / 0.45), 0.8) : 0); return wallP(s, best[1] + (dt || 0), best[2] + (dd || 0) - lift); }

    /* ---------- aktualizacja ---------- */
    var lastKey = '', tool = { d: d, grp: grp, overlay: false, labels: labels };
    tool.update = function (m) {
      var st = stateAt(m), key = m.toFixed(4);
      if (key !== lastKey) {
        lastKey = key;
        if (!LAP) {
          ant.updSkin(st); ant.updEO(st); ant.updCord(st); ant.updMesh(st);
          ant.incL.visible = st.inc > 0 && st.open < 0.15 && m < 1; ant.incL.geometry.setDrawRange(0, Math.round(st.inc * 40) * 8 * 6);
          ant.plan.visible = m <= 0.001; ant.ligSkin.visible = m < 0.4;
          ant.eoIncL.visible = st.eoInc > 0 && st.eo < 0.15 && m < 2; ant.eoIncL.geometry.setDrawRange(0, Math.round(st.eoInc * 50) * 8 * 6);
          ant.cord.material.opacity = 1 - 0.6 * st.crem; ant.cord.material.depthWrite = st.crem < 0.05;
          [ant.vas, ant.art, ant.ves].forEach(function (t) { t.visible = st.crem > 0.05; });
          ant.sutL.visible = st.sutL > 0; ant.sutL.geometry.setDrawRange(0, Math.round(st.sutL * 260) * 8 * 6);
          ant.sutU.visible = st.sutU > 0.5; ant.sutT.visible = st.sutU > 0.5;
          ant.sutE.visible = st.eoSut > 0; ant.sutE.geometry.setDrawRange(0, Math.round(st.eoSut * 220) * 8 * 6);
          ant.sutS.visible = st.skinClose > 0.85;
        } else {
          lap.updPer(st); lap.updMesh(st);
          lap.incL.visible = op === 'tapp' && st.pInc > 0 && st.pOpen < 0.2; lap.incL.geometry.setDrawRange(0, Math.round(st.pInc * 80) * 8 * 6);
          lap.sut.visible = op === 'tapp' && st.pSut > 0; lap.sut.geometry.setDrawRange(0, Math.round(st.pSut * 300) * 8 * 6);
          lap.tacks.visible = st.tacks > 0.5;
          var zA = (m > 1.55 && m < 2.05) || (m > 3.55 && m < 4.05) ? 0.4 : 0; lap.doom.mesh.material.opacity = lap.pain.mesh.material.opacity = zA; lap.doom.mesh.visible = lap.pain.mesh.visible = zA > 0;
        }
      }
      grp.updateMatrixWorld(true);
      labels.forEach(function (Lb) { var p = Lb.fn(st, m); Lb.anchor = p ? grp.localToWorld(p.clone ? p.clone() : p) : null; Lb.alpha = Lb.when(st, m) ? 1 : 0; });
    };
    tool.test = { state: stateAt, IS: IS, wallP: wallP, lap: lap, ant: ant };
    M.groin = tool; if (LAP) M.light = [0.42, 0.12, 0.08];   // światło sceny (półkula, kierunkowe, kontra) — resztę daje światło optyki
    return tool;
  }
  TOOL_EXT.groin = makeGroin;
