  /* ---------- slajd „Dostęp” (an.access → ANAT.ACCESS[key], model powłok ANAT.BODY): okno wyboru „Dostęp?” (otwarty / laparoskopowy / robotyczny),
     potem animacja na osi m −1 → −0,02: powłoki z punktami orientacyjnymi, mięśniami prostymi i naczyniami nabrzusznymi; cięcia rysowane na skórze
     i rana otwierana; trokary wprowadzane po kolei wzdłuż osi skierowanej na pole operacyjne, odma unosi powłoki; planowane cięcie do wydobycia
     preparatu (linia przerywana). Poza osią m < 0 model powłok jest niewidoczny. Wybór zapamiętany (surgitome-dostep); w hemikolektomii prawej
     dostęp wybiera wariant zespolenia: otwarty → FEEA, laparoskopia i robot → izoperystaltyczne (wewnątrzbrzuszne). ---------- */
  var ACC_KEY = 'surgitome-dostep', ACC = { kind: null, skip: false };
  try { var acc0 = localStorage.getItem(ACC_KEY); if (acc0 === 'open' || acc0 === 'lap' || acc0 === 'rob') ACC.kind = acc0; } catch (e) {}
  var ACC_VAR = { 'rh-iso': { open: 'rh-anti' }, 'rh-anti': { lap: 'rh-iso', rob: 'rh-iso' } };
  var ACC_SKIN = '#e2b59c';
  function accessAttach(key) {
    var B = A.BODY, X = A.ACCESS[key], TGT = new V3().fromArray(X.target), grp = new THREE.Group(), morphs = [], labels = [];
    function skinP(x, y, off, k) { return B.at(x, y, off || 0, k); }
    function morphGeo(build, sheet) { var g0 = track(build(0)), g1 = build(1); morphs.push({ g: g0, a: Float32Array.from(g0.attributes.position.array), b: Float32Array.from(g1.attributes.position.array), sheet: sheet }); g1.dispose(); return g0; }
    function tubeOn(pts2, off, r, k) { return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts2.map(function (p) { return skinP(p[0], p[1], off, k); }), false, 'centripetal'), Math.max(12, pts2.length * 10), r, 6, false); }
    function mat(col, op, extra) { var m = track(new THREE.MeshStandardMaterial(Object.assign({ color: col, roughness: 0.7, transparent: true, opacity: op, depthWrite: false, side: THREE.DoubleSide }, extra || {}))); m.userData.op = op; return m; }
    // skóra: siatka (y, u) z zanikaniem przy brzegach (kolory RGBA)
    var NY = 64, NU = 44, base = new THREE.Color(ACC_SKIN);
    var skinG = morphGeo(function (k) {
      var pos = [], col = [], idx = [];
      for (var i = 0; i <= NY; i++) {
        var y = B.Y0 + (B.Y1 - B.Y0) * i / NY, w = B.W(y) * 0.985;
        for (var j = 0; j <= NU; j++) {
          var u = -1 + 2 * j / NU, x = u * w, p = skinP(x, y, 0, k), a = sm((1 - Math.abs(u)) / 0.14) * sm((y - B.Y0) / 1.6) * sm((B.Y1 - y) / 1.6);
          pos.push(p.x, p.y, p.z); col.push(base.r, base.g, base.b, a);
        }
      }
      for (var i2 = 0; i2 < NY; i2++) for (var j2 = 0; j2 < NU; j2++) { var a0 = i2 * (NU + 1) + j2, b0 = a0 + NU + 1; idx.push(a0, b0, a0 + 1, b0, b0 + 1, a0 + 1); }
      var g = new THREE.BufferGeometry(); g.setIndex(idx); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 4)); g.computeVertexNormals(); return g;
    }, true);
    var skinM = mat('#ffffff', 0.74, { vertexColors: true, roughness: 0.85 });
    grp.add(new THREE.Mesh(skinG, skinM));
    // mięśnie proste: pasma pod skórą od spojenia do łuku żebrowego; smugi ścięgniste
    // mięśnie proste: wyróżniony ten, przez który się wchodzi — laparoskopia i robot: lewy (kontralateralny, trokary), dostęp otwarty: prawy (przecinany)
    var musBy = { '1': mat('#b04a42', 0.24), '-1': mat('#b04a42', 0.24) }, tendM = mat('#e7c9b8', 0.6);
    function sideOf() { return !ACC.kind ? 0 : ACC.kind === 'open' ? -1 : 1; }
    [1, -1].forEach(function (sd) {
      var musM = musBy[String(sd)];
      grp.add(new THREE.Mesh(morphGeo(function (k) {
        var pos = [], idx = [], NR = 40, NC = 6;
        for (var i = 0; i <= NR; i++) { var y = B.RY[0] + (B.RY[1] - B.RY[0]) * i / NR; for (var j = 0; j <= NC; j++) { var x = sd * (B.RECT_MED + (B.rectLat(y) - B.RECT_MED) * j / NC), p = skinP(x, y, 0.5, k); pos.push(p.x, p.y, p.z); } }
        for (var i2 = 0; i2 < NR; i2++) for (var j2 = 0; j2 < NC; j2++) { var a0 = i2 * (NC + 1) + j2, b0 = a0 + NC + 1; idx.push(a0, b0, a0 + 1, b0, b0 + 1, a0 + 1); }
        var g = new THREE.BufferGeometry(); g.setIndex(idx); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return g;
      }, true), musM));
      B.TEND.forEach(function (ty) { grp.add(new THREE.Mesh(morphGeo(function (k) { return tubeOn([[sd * (B.RECT_MED + 0.1), ty], [sd * (B.rectLat(ty) - 0.1), ty + 0.15]], 0.46, 0.05, k); }), tendM)); });
      // naczynia nabrzuszne (tętnica i żyła obok)
      [['a', '#b83227', 0], ['v', '#3867b5', 0.16]].forEach(function (vv) {
        [B.EPI_INF, B.EPI_SUP].forEach(function (path, pi) {
          grp.add(new THREE.Mesh(morphGeo(function (k) {
            return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(path.map(function (q) { return skinP(sd * (q[0] + vv[2]), q[1], q[2], k); }), false, 'centripetal'), 40, pi ? 0.055 : 0.075, 6, false);
          }), mat(vv[1], pi ? 0.6 : 0.85)));
        });
      });
    });
    // punkty orientacyjne na skórze
    var lmM = mat('#7d6152', 0.85), LM = B.LM;
    ['costalL', 'costalR', 'crestL', 'crestR', 'ingL', 'ingR'].forEach(function (id) { grp.add(new THREE.Mesh(morphGeo(function (k) { return tubeOn(LM[id], -0.03, 0.05, k); }), lmM)); });
    var dot = track(new THREE.SphereGeometry(0.16, 12, 9)), dots = [];
    ['xiph', 'asisL', 'asisR', 'pubis'].forEach(function (id) { var s = new THREE.Mesh(dot, lmM); grp.add(s); dots.push({ s: s, p: LM[id] }); });
    var umbM = mat('#8a5f50', 0.9), umb = new THREE.Mesh(track(new THREE.TorusGeometry(0.32, 0.07, 6, 20)), umbM); grp.add(umb);
    function lab(name, sub, col, kind, fn) { var L = { el: mkLabel(name, sub, col, kind), fn: fn, alpha: 0 }; labels.push(L); return L; }
    var LL = [lab('Pępek', '', '#8a5f50', 'ghost', function (k) { return skinP(LM.umb[0], LM.umb[1], -0.1, k); }),
      lab('Łuk żebrowy', '', '#7d6152', 'ghost', function (k) { return skinP(LM.costalR[4][0], LM.costalR[4][1], -0.1, k); }),
      lab('Kolec biodrowy przedni górny', '', '#7d6152', 'ghost', function (k) { return skinP(LM.asisR[0], LM.asisR[1], -0.1, k); }),
      lab('Spojenie łonowe', '', '#7d6152', 'ghost', function (k) { return skinP(LM.pubis[0], LM.pubis[1], -0.1, k); }),
      lab('Mięsień prosty brzucha', '', '#b04a42', 'ghost', function (k) { return sideOf() > 0 ? skinP(2.2, -9.2, 0.3, k) : skinP(-3.2, 4.2, 0.3, k); }),
      lab('Prawa strona chorego', '', '#56636f', 'ghost', function (k) { return skinP(-9.6, 10.5, -0.2, k); }),
      lab('Lewa strona chorego', '', '#56636f', 'ghost', function (k) { return skinP(9.6, 10.5, -0.2, k); }),
      lab('Naczynia nabrzuszne dolne', '', '#b83227', 'ghost', function (k) { return sideOf() > 0 ? skinP(4.7, -11.8, 1.0, k) : skinP(-4.5, -11.0, 0.9, k); })];
    // dostęp: cięcia, rany, trokary, linia wydobycia (osobny zestaw dla każdego rodzaju)
    var SETS = {};
    ['open', 'lap', 'rob'].forEach(function (kind) {
      var D = X[kind], g = new THREE.Group(), set = { d: D, g: g, cuts: [], ports: [], ext: null }; g.visible = false; grp.add(g); SETS[kind] = set;
      (D.cuts || []).forEach(function (c) {
        var line = tubeOn(c.pts, -0.05, 0.075, 0); track(line);
        var lm = mat(A.COL.cut, 1, { emissive: A.COL.cut, emissiveIntensity: 0.25, depthWrite: true }), lineMesh = new THREE.Mesh(line, lm); g.add(lineMesh);
        // rana: pas wokół linii cięcia, rozchylany
        var cc = new THREE.CatmullRomCurve3(c.pts.map(function (p) { return skinP(p[0], p[1], 0, 0); }), false, 'centripetal'), NW = 40, wp = new Float32Array((NW + 1) * 6), wi = [];
        for (var q = 0; q < NW; q++) { var a0 = 2 * q; wi.push(a0, a0 + 1, a0 + 2, a0 + 1, a0 + 3, a0 + 2); }
        var wg = track(new THREE.BufferGeometry()); wg.setAttribute('position', new THREE.BufferAttribute(wp, 3)); wg.setIndex(wi);
        var wm = new THREE.Mesh(wg, track(new THREE.MeshBasicMaterial({ color: '#4a1010', side: THREE.DoubleSide }))); g.add(wm);
        var L = lab(c.name, c.sub, A.COL.cut, 'cut', function () { return cc.getPointAt(0.5).clone().add(new V3(0, 0.6, 0.3)); });
        set.cuts.push({ c: c, line: line, mesh: lineMesh, cc: cc, wg: wg, wp: wp, wm: wm, NW: NW, L: L });
      });
      var n = (D.ports || []).length, order = [];
      (D.ports || []).forEach(function (p, i) { if (i !== D.first) order.push(i); });
      (D.ports || []).forEach(function (p, i) {
        var r = p.mm >= 12 ? 0.36 : p.mm >= 8 ? 0.27 : 0.2, robot = D.robot && !p.assist, tg = new THREE.Group();
        var cm = mat(robot ? '#c9ced3' : '#9aa3ab', 1, { metalness: 0.6, roughness: 0.35, depthWrite: true, side: THREE.FrontSide }), hm = mat(robot ? '#1e2327' : p.mm >= 12 ? '#2c3338' : '#3d6e8f', 1, { roughness: 0.5, depthWrite: true, side: THREE.FrontSide });
        var can = new THREE.Mesh(track(new THREE.CylinderGeometry(r, r, 6.4, 18)), cm); can.position.y = -1.5;   // od +1,7 (na zewnątrz) do −4,7 (w jamie brzusznej)
        var head = new THREE.Mesh(track(new THREE.CylinderGeometry(r * 2.3, r * 2.0, 0.9, 20)), hm); head.position.y = 2.15;
        tg.add(can, head);
        if (robot) { var ring = new THREE.Mesh(track(new THREE.TorusGeometry(r * 1.25, 0.07, 6, 18)), mat('#2f78c4', 1, { depthWrite: true })); ring.rotation.x = Math.PI / 2; ring.position.y = 1.3; tg.add(ring); }
        g.add(tg);
        var w = i === D.first ? [-0.9, -0.8] : (function () { var j = order.indexOf(i), a = -0.6, b = -0.22, s = (b - a) / Math.max(1, order.length); return [a + j * s, a + (j + 0.85) * s]; })();
        var Lp = lab(p.name, p.sub, robot ? '#2f78c4' : '#56636f', 'seg', function () { return tg.position.clone().add(new V3(0, 0, 0)).addScaledVector(tg.userData.out || new V3(0, 0, 1), 2.8); });
        set.ports.push({ p: p, g: tg, mats: [cm, hm], w: w, L: Lp });
      });
      if (D.ext) {
        var eg = new THREE.Group(), segs = 9, ec = new THREE.CatmullRomCurve3(D.ext.pts.map(function (p) { return skinP(p[0], p[1], -0.05, 1); }), false, 'centripetal'), em = mat(A.COL.cut, 0.95, { depthWrite: true });
        for (var s = 0; s < segs; s++) { if (s % 2) continue; var pts = []; for (var t = 0; t <= 6; t++) pts.push(ec.getPointAt((s + t / 6) / segs)); eg.add(new THREE.Mesh(track(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 8, 0.07, 6, false)), em)); }
        g.add(eg); set.ext = { g: eg, L: lab(D.ext.name, D.ext.sub, A.COL.cut, 'cut', function () { return ec.getPointAt(0.5).clone().add(new V3(0, -0.4, 0.3)); }) };
      }
    });
    var lastK = -1;
    function setK(k) {
      if (Math.abs(k - lastK) < 1e-4) return; lastK = k;
      morphs.forEach(function (q) { var P = q.g.attributes.position.array; for (var i = 0; i < P.length; i++) P[i] = q.a[i] + (q.b[i] - q.a[i]) * k; q.g.attributes.position.needsUpdate = true; if (q.sheet) q.g.computeVertexNormals(); q.g.computeBoundingSphere(); });
      dots.forEach(function (d) { d.s.position.copy(skinP(d.p[0], d.p[1], -0.04, k)); });
      umb.position.copy(skinP(0, -5.5, -0.02, k)); umb.quaternion.setFromUnitVectors(new V3(0, 0, 1), B.nrm(0, -5.5, k));
    }
    var tool = { d: { type: 'dostep' }, grp: grp, overlay: false, labels: labels, sets: SETS,
      update: function (m) {
        var on = m < -0.001 && !SPLIT.on; grp.visible = on;
        if (!on) { labels.forEach(function (L) { L.alpha = 0; }); return; }
        var kind = ACC.kind, set = kind && $('acc').hidden ? SETS[kind] : null, D = set ? set.d : null;
        var vis = sm((m + 1) / 0.12); // powłoki pojawiają się na początku kadru
        var k = D && D.insuf ? sm((m - D.insuf[0]) / (D.insuf[1] - D.insuf[0])) : 0;
        setK(k);
        var sdA = set ? sideOf() : 0; musBy['1'].userData.op = sdA > 0 ? 0.36 : sdA < 0 ? 0.14 : 0.24; musBy['-1'].userData.op = sdA < 0 ? 0.36 : sdA > 0 ? 0.14 : 0.24;
        grp.traverse(function (o) { if (o.material && o.material.userData && o.material.userData.op != null) o.material.opacity = o.material.userData.op * vis; });
        Object.keys(SETS).forEach(function (id) { SETS[id].g.visible = !!set && SETS[id] === set; });
        LL.forEach(function (L) { L.anchor = L.fn(k); L.alpha = vis > 0.5 ? 1 : 0; });
        Object.keys(SETS).forEach(function (id) { var st = SETS[id]; st.cuts.forEach(function (c) { c.L.alpha = 0; }); st.ports.forEach(function (P) { P.L.alpha = 0; }); if (st.ext) st.ext.L.alpha = 0; });
        if (set) {
          set.cuts.forEach(function (c) {
            var tt = clamp01((m - c.c.t[0]) / (c.c.t[1] - c.c.t[0])), op = sm((m - c.c.open[0]) / (c.c.open[1] - c.c.open[0]));
            c.mesh.visible = tt > 0; c.line.setDrawRange(0, Math.round(tt * c.line.parameters.tubularSegments) * c.line.parameters.radialSegments * 6);
            c.wm.visible = op > 0.01;
            if (c.wm.visible) for (var q = 0; q <= c.NW; q++) {
              var u = q / c.NW, P = c.cc.getPointAt(u), T = c.cc.getTangentAt(u), N = B.nrm(P.x, P.y, 0), sd = new V3().crossVectors(N, T).normalize(), w = c.c.w * Math.pow(Math.sin(Math.PI * u), 0.6) * op;
              var a = P.clone().addScaledVector(sd, w).addScaledVector(N, 0.04), b = P.clone().addScaledVector(sd, -w).addScaledVector(N, 0.04);
              c.wp.set([a.x, a.y, a.z, b.x, b.y, b.z], q * 6);
            }
            c.wg.attributes.position.needsUpdate = true; c.wg.computeBoundingSphere();
            c.L.anchor = c.L.fn(); c.L.alpha = tt > 0.3 ? 1 : 0;
          });
          set.ports.forEach(function (P) {
            var f = sm((m - P.w[0]) / (P.w[1] - P.w[0])), x = P.p.at[0], y = P.p.at[1], E = skinP(x, y, 0, k), ax = TGT.clone().sub(E).normalize().multiplyScalar(0.35).addScaledVector(B.nrm(x, y, k), -0.65).normalize(), out = ax.clone().negate();
            P.g.visible = f > 0.01; P.g.userData.out = out;
            P.g.quaternion.setFromUnitVectors(new V3(0, 1, 0), out); P.g.position.copy(E).addScaledVector(out, (1 - f) * 6);
            P.mats.forEach(function (mm) { mm.opacity = f; });
            P.L.anchor = P.L.fn(); P.L.alpha = f > 0.6 ? 1 : 0;
          });
          if (set.ext) { var fe = sm((m + 0.17) / 0.12); set.ext.g.visible = fe > 0.01; set.ext.g.children.forEach(function (c, i) { c.visible = fe * set.ext.g.children.length > i; }); set.ext.L.anchor = set.ext.L.fn(); set.ext.L.alpha = fe > 0.5 ? 1 : 0; }
        }
        if (FR[S.frame] && FR[S.frame].k === 'access') {
          var tt2 = tr(D ? D.title : 'Dostęp operacyjny'), tx2 = tr(D ? D.text : 'Wybierz dostęp: otwarty, laparoskopowy albo robotyczny.');
          if ($('capTitle').textContent !== tt2) $('capTitle').textContent = tt2;
          if ($('capText').textContent !== tx2) $('capText').textContent = tx2;
        }
      } };
    M.group.add(grp); M.tools.push(tool); M.access = tool;
  }
  // okno wyboru: przy wejściu na slajd „Dostęp” (chyba że wybór właśnie zmienił wariant — skip); inne kadry chowają okno
  function accShow(on) {
    $('acc').hidden = !on;
    document.querySelectorAll('#acc .accopt').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.acc === ACC.kind ? 'true' : 'false'); });
    if (on) { S.playing = false; var b0 = document.querySelector('#acc .accopt[aria-pressed="true"]') || document.querySelector('#acc .accopt'); try { b0.focus({ preventScroll: true }); } catch (e) {} }
  }
  function accFrame(fr) {
    if (fr.k !== 'access') { if (!$('acc').hidden) accShow(false); return; }
    if (ACC.skip) { ACC.skip = false; accShow(false); return; }
    accShow(true);
  }
  function accChoose(kind) {
    ACC.kind = kind; try { localStorage.setItem(ACC_KEY, kind); } catch (e) {}
    accShow(false);
    // hemikolektomia prawa: dostęp wybiera wariant zespolenia (otwarty → FEEA, laparoskopia i robot → izoperystaltyczne, wewnątrzbrzuszne)
    var v = curVar(), to = ACC_VAR[v.id] && ACC_VAR[v.id][kind], P = curProc();
    if (to) { var k = P.variants.map(function (x) { return x.id; }).indexOf(to); if (k >= 0) { ACC.skip = true; switchVariant(k, 'first'); return; } }
    var fr = FR[S.frame]; S.m = fr.m0; S.playing = true; applyM(); updateDock();
  }
  function accKey(e) {
    var map = { '1': 'open', '2': 'lap', '3': 'rob' };
    if (map[e.key]) { e.preventDefault(); accChoose(map[e.key]); }
    else if (e.key === 'Escape') { e.preventDefault(); accChoose(ACC.kind || 'lap'); }
  }
  document.querySelectorAll('#acc .accopt').forEach(function (b) { b.onclick = function () { accChoose(b.dataset.acc); }; });
  $('accChange').onclick = function () { accShow(true); };
