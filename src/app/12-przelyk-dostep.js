  /* ---------- slajd „Dostęp” w esofagektomii (ANAT.ACCESS[…].torso — model tułowia z 06b-przelyk-dostep.js): skóra szyi, klatki piersiowej
     i nadbrzusza, żebra z chrząstkami, mostek, obojczyki, łopatka prawa, mięśnie mostkowo-obojczykowo-sutkowe, łuk żebrowy, pępek, linie pachowe.
     Zestaw dostępu składa się z etapów (phases: jama brzuszna, prawa klatka piersiowa, szyja); oś m slajdu (−1 → −0,02) dzielona równo między etapy,
     na początku etapu kamera przechodzi do jego ujęcia (X.cams[part]), etap piersiowy pokazuje schemat ułożenia na lewym boku (#pose).
     W etapie: cięcia rysowane i rany rozchylane, trokary wprowadzane po kolei (oś ku polu operacyjnemu), odma unosi powłoki brzucha, wejście
     przez przestrzeń międzyżebrową (linia przerywana), planowane cięcie do wydobycia preparatu. Elementy etapów wcześniejszych zostają. ---------- */
  var TORSO_TGT = { abd: [0.6, 5.0, -0.5], thx: [-0.4, 15.0, -3.0], neck: [0, 24, -2] };
  function accessTorsoAttach(key) {
    var X = A.ACCESS[key], T = X.torso, grp = new THREE.Group(), morphs = [], labels = [], LMk = T.LM;
    function P(q, off, k) { return T.at(q[0], q[1], off || 0, k || 0); }
    function mat(col, op, extra) { var m = track(new THREE.MeshStandardMaterial(Object.assign({ color: col, roughness: 0.7, transparent: true, opacity: op, depthWrite: false, side: THREE.DoubleSide }, extra || {}))); m.userData.op = op; return m; }
    function morphGeo(build, sheet) { var g0 = track(build(0)), g1 = build(1); morphs.push({ g: g0, a: Float32Array.from(g0.attributes.position.array), b: Float32Array.from(g1.attributes.position.array), sheet: sheet }); g1.dispose(); return g0; }
    // krzywa na skórze z punktów [θ, y]: gładka w układzie (θ, y), próbkowana i rzutowana na skórę (z normalnymi do ran)
    function skinCurve(pts, off, k, n) {
      var c2 = new THREE.CatmullRomCurve3(pts.map(function (q) { return new V3(q[0], q[1], 0); }), false, 'centripetal'), out = [], uv = [];
      n = n || Math.max(16, pts.length * 12);
      for (var i = 0; i <= n; i++) { var q = c2.getPointAt(i / n); uv.push([q.x, q.y]); out.push(P([q.x, q.y], off, k)); }
      return { pts: out, uv: uv };
    }
    function tubeOn(pts, off, r, k, closed) { var sc = skinCurve(pts, off, k); return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(sc.pts, !!closed, 'centripetal'), sc.pts.length * 2, r, 6, !!closed); }
    function lab(name, sub, col, kind, fn, parts) { var L = { el: mkLabel(name, sub, col, kind), fn: fn, alpha: 0, parts: parts }; labels.push(L); return L; }
    // ---------- skóra: siatka (θ, y), zanikanie u góry (szyja) i u dołu (podbrzusze) ----------
    function skinGeo(k) {
      var NX = 120, NY = 132, pos = [], col = [], idx = [], base = new THREE.Color(ACC_SKIN);
      for (var i = 0; i <= NY; i++) for (var j = 0; j <= NX; j++) {
        var y = T.Y0 + (T.Y1 - T.Y0) * i / NY, th = -180 + 360 * j / NX, p = P([th, y], 0, k);
        pos.push(p.x, p.y, p.z); col.push(base.r, base.g, base.b, sm((y - T.Y0) / 3.2) * sm((T.Y1 - y) / 1.6));
      }
      for (var i2 = 0; i2 < NY; i2++) for (var j2 = 0; j2 < NX; j2++) { var a0 = i2 * (NX + 1) + j2, b0 = a0 + NX + 1; idx.push(a0, b0, a0 + 1, b0, b0 + 1, a0 + 1); }
      var g = new THREE.BufferGeometry(); g.setIndex(idx); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 4)); g.computeVertexNormals(); return g;
    }
    var skinM = mat('#ffffff', 0.62, { vertexColors: true, roughness: 0.85, side: THREE.FrontSide });
    grp.add(new THREE.Mesh(morphGeo(skinGeo, true), skinM));
    // płat na skórze ograniczony wielokątem [θ, y] (łopatka) albo pas między dwiema krzywymi (mięsień mostkowo-obojczykowo-sutkowy)
    function inPoly(q, poly) { var ins = false; for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) { var a = poly[i], b = poly[j]; if ((a[1] > q[1]) !== (b[1] > q[1]) && q[0] < (b[0] - a[0]) * (q[1] - a[1]) / (b[1] - a[1]) + a[0]) ins = !ins; } return ins; }
    function patchGeo(poly, off) {
      var t0 = 1e9, t1 = -1e9, y0 = 1e9, y1 = -1e9, N = 28, pos = [], idx = [], ins = [];
      poly.forEach(function (q) { t0 = Math.min(t0, q[0]); t1 = Math.max(t1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
      for (var i = 0; i <= N; i++) for (var j = 0; j <= N; j++) { var q = [t0 + (t1 - t0) * j / N, y0 + (y1 - y0) * i / N], p = P(q, off); pos.push(p.x, p.y, p.z); ins.push(inPoly(q, poly)); }
      for (var i2 = 0; i2 < N; i2++) for (var j2 = 0; j2 < N; j2++) { var a0 = i2 * (N + 1) + j2, b0 = a0 + N + 1; if (ins[a0] && ins[b0] && ins[a0 + 1]) idx.push(a0, b0, a0 + 1); if (ins[b0] && ins[b0 + 1] && ins[a0 + 1]) idx.push(b0, b0 + 1, a0 + 1); }
      var g = new THREE.BufferGeometry(); g.setIndex(idx); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return g;
    }
    function bandGeo(e1, e2, off) {
      var c1 = skinCurve(e1, 0, 0, 40).uv, c2 = skinCurve(e2, 0, 0, 40).uv, NU = 6, pos = [], idx = [];
      for (var i = 0; i <= 40; i++) for (var j = 0; j <= NU; j++) { var u = j / NU, w = Math.sin(Math.PI * u), p = P([c1[i][0] + (c2[i][0] - c1[i][0]) * u, c1[i][1] + (c2[i][1] - c1[i][1]) * u], off + 0.25 * w); pos.push(p.x, p.y, p.z); }
      for (var i2 = 0; i2 < 40; i2++) for (var j2 = 0; j2 < NU; j2++) { var a0 = i2 * (NU + 1) + j2, b0 = a0 + NU + 1; idx.push(a0, b0, a0 + 1, b0, b0 + 1, a0 + 1); }
      var g = new THREE.BufferGeometry(); g.setIndex(idx); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return g;
    }
    // ---------- kości: żebra (II–XII obustronnie), chrząstki II–VI, mostek, obojczyki, łopatka prawa ----------
    // żebra: prawe wyraźne w etapie piersiowym, w pozostałych etapach słabo widoczne (nie zasłaniają narządów)
    var boneM = mat('#e6dfcb', 0.4), ribR = mat('#e6dfcb', 0.3), ribL = mat('#e6dfcb', 0.3), cartM = mat('#cfd8de', 0.3), lmM = mat('#7d6152', 0.85);
    for (var rk = 2; rk <= 12; rk++) {
      var rp = T.ribPath(rk), cp = T.cartPath(rk);
      grp.add(new THREE.Mesh(track(tubeOn(rp, 0.5, 0.13, 0)), ribR)); grp.add(new THREE.Mesh(track(tubeOn(T.mirror(rp), 0.5, 0.13, 0)), ribL));
      if (cp) [cp, T.mirror(cp)].forEach(function (pp) { grp.add(new THREE.Mesh(track(tubeOn(pp, 0.45, 0.1, 0)), cartM)); });
    }
    // mostek: pas między brzegami (rękojeść, trzon, wyrostek mieczykowaty)
    (function () {
      var S = T.STERN, N = 30, pos = [], idx = [];
      for (var i = 0; i <= N; i++) { var y = S.tip + (S.notch - S.tip) * i / N, w = T.sternW(y); [-1, 0, 1].forEach(function (u) { var p = P([T.fx(u * w, y), y], 0.42); pos.push(p.x, p.y, p.z); }); }
      for (var i2 = 0; i2 < N; i2++) for (var j2 = 0; j2 < 2; j2++) { var a0 = i2 * 3 + j2, b0 = a0 + 3; idx.push(a0, b0, a0 + 1, b0, b0 + 1, a0 + 1); }
      var g = track(new THREE.BufferGeometry()); g.setIndex(idx); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
      grp.add(new THREE.Mesh(g, boneM));
    })();
    [LMk.clavR, LMk.clavL].forEach(function (pp) { grp.add(new THREE.Mesh(track(tubeOn(pp, 0.35, 0.22, 0)), boneM)); });
    // łopatka prawa — tylko w etapie piersiowym (z przodu, przez skórę, myliłaby)
    var scapG = new THREE.Group(), scapM = mat('#d6c6a4', 0.42), scapLineM = mat('#7d6a4c', 0.9); grp.add(scapG);
    scapG.add(new THREE.Mesh(track(patchGeo(LMk.scapR, 0.4)), scapM));
    scapG.add(new THREE.Mesh(track(tubeOn(LMk.scapR, 0.3, 0.075, 0, true)), scapLineM));
    scapG.add(new THREE.Mesh(track(tubeOn(LMk.scapSpine, 0.3, 0.1, 0)), scapLineM));
    // mięśnie mostkowo-obojczykowo-sutkowe (lewy wyróżniany w etapie szyjnym)
    var scmL = mat('#b04a42', 0.22), scmR = mat('#b04a42', 0.16);
    grp.add(new THREE.Mesh(track(bandGeo(LMk.scmAnt, LMk.scmPost, 0.15)), scmL));
    grp.add(new THREE.Mesh(track(bandGeo(T.mirror(LMk.scmAnt), T.mirror(LMk.scmPost), 0.15)), scmR));
    // łuki żebrowe, wyrostek mieczykowaty, wcięcie szyjne, pępek (powłoki brzucha unoszone przy odmie)
    [LMk.costalR, LMk.costalL].forEach(function (pp) { grp.add(new THREE.Mesh(morphGeo(function (k) { return tubeOn(pp, -0.03, 0.05, k); }), lmM)); });
    var dot = track(new THREE.SphereGeometry(0.16, 12, 9)), dots = [];
    [LMk.xiph, LMk.notch].forEach(function (q) { var s = new THREE.Mesh(dot, lmM); grp.add(s); dots.push({ s: s, q: q }); });
    var umb = new THREE.Mesh(track(new THREE.TorusGeometry(0.32, 0.07, 6, 20)), mat('#8a5f50', 0.9)); grp.add(umb);
    // linie pachowe po prawej stronie (przerywane; etap piersiowy)
    var axG = new THREE.Group(), axM = mat('#56636f', 0.5, { depthWrite: true }); grp.add(axG);
    [LMk.axAnt, LMk.axMid, LMk.axPost].forEach(function (th) {
      for (var y = 19.6; y > 6.6; y -= 1.1) axG.add(new THREE.Mesh(track(tubeOn([[th, y], [th, y - 0.55]], -0.03, 0.035, 0)), axM));
    });
    var LL = [
      lab('Prawa strona chorego', '', '#56636f', 'ghost', function () { return P([-82, 21.2], -0.4); }, ['all', 'abd']),
      lab('Lewa strona chorego', '', '#56636f', 'ghost', function () { return P([82, 21.2], -0.4); }, ['all', 'abd']),
      lab('Pępek', '', '#8a5f50', 'ghost', function (k) { return P(LMk.umb, -0.1, k); }, ['abd']),
      lab('Wyrostek mieczykowaty', '', '#7d6152', 'ghost', function () { return P(LMk.xiph, -0.1); }, ['abd']),
      lab('Łuk żebrowy', '', '#7d6152', 'ghost', function (k) { return P(LMk.costalR[4], -0.1, k); }, ['abd']),
      lab('Kąt dolny łopatki', '', '#8a7a5c', 'ghost', function () { return P(LMk.scapTip, -0.1); }, ['thx']),
      lab('Linia pachowa przednia', '', '#56636f', 'ghost', function () { return P([LMk.axAnt, 19.4], -0.1); }, ['thx']),
      lab('Linia pachowa środkowa', '', '#56636f', 'ghost', function () { return P([LMk.axMid, 20.2], -0.1); }, ['thx']),
      lab('Linia pachowa tylna', '', '#56636f', 'ghost', function () { return P([LMk.axPost, 19.4], -0.1); }, ['thx']),
      lab('Mięsień mostkowo-obojczykowo-sutkowy', '', '#b04a42', 'ghost', function () { return P([92, 28.0], -0.1); }, ['neck']),
      lab('Wcięcie szyjne mostka', '', '#7d6152', 'ghost', function () { return P(LMk.notch, -0.1); }, ['neck']),
      lab('Obojczyk', '', '#7d6152', 'ghost', function () { return P(LMk.clavL[2], -0.1); }, ['neck'])];
    // ---------- zestawy dostępu: etapy z cięciami, trokarami, wejściem przez przestrzeń międzyżebrową i planowanym cięciem ----------
    var SETS = {};
    ['open', 'hyb', 'lap', 'rob'].forEach(function (kind) {
      var D = X[kind]; if (!D) return;
      var g = new THREE.Group(); g.visible = false; grp.add(g);
      var set = { d: D, g: g, phases: [] }; SETS[kind] = set;
      D.phases.forEach(function (ph) {
        var Ph = { ph: ph, cuts: [], ports: [], ics: null, ext: null, line: null, tgt: new V3().fromArray(TORSO_TGT[ph.part]) };
        set.phases.push(Ph);
        (ph.cuts || []).forEach(function (c) {
          var sc = skinCurve(c.pts, -0.05, 0, 48), line = track(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(sc.pts, false, 'centripetal'), 96, 0.075, 6, false));
          var lm = new THREE.Mesh(line, mat(A.COL.cut, 1, { emissive: A.COL.cut, emissiveIntensity: 0.25, depthWrite: true })); g.add(lm);
          var NW = sc.pts.length - 1, wp = new Float32Array((NW + 1) * 6), wi = [];
          for (var q = 0; q < NW; q++) { var a0 = 2 * q; wi.push(a0, a0 + 1, a0 + 2, a0 + 1, a0 + 3, a0 + 2); }
          var wg = track(new THREE.BufferGeometry()); wg.setAttribute('position', new THREE.BufferAttribute(wp, 3)); wg.setIndex(wi);
          var wm = new THREE.Mesh(wg, track(new THREE.MeshBasicMaterial({ color: '#4a1010', side: THREE.DoubleSide }))); g.add(wm);
          var mid = sc.uv[Math.round(NW / 2)];
          var L = lab(c.name, c.sub, A.COL.cut, 'cut', function () { return P(mid, -0.6); });
          Ph.cuts.push({ c: c, line: line, mesh: lm, uv: sc.uv, wg: wg, wp: wp, wm: wm, NW: NW, L: L });
        });
        var order = [];
        (ph.ports || []).forEach(function (p, i) { if (i !== ph.first) order.push(i); });
        (ph.ports || []).forEach(function (p, i) {
          var r = p.mm >= 12 ? 0.36 : p.mm >= 10 ? 0.32 : p.mm >= 8 ? 0.27 : 0.2, robot = ph.robot && !p.assist, tg = new THREE.Group();
          var cm = mat(robot ? '#c9ced3' : '#9aa3ab', 1, { metalness: 0.6, roughness: 0.35, depthWrite: true, side: THREE.FrontSide }), hm = mat(robot ? '#1e2327' : p.mm >= 10 ? '#2c3338' : '#3d6e8f', 1, { roughness: 0.5, depthWrite: true, side: THREE.FrontSide });
          var can = new THREE.Mesh(track(new THREE.CylinderGeometry(r, r, 4.1, 18)), cm); can.position.y = -0.35;
          var head = new THREE.Mesh(track(new THREE.CylinderGeometry(r * 2.3, r * 2.0, 0.9, 20)), hm); head.position.y = 2.15;
          tg.add(can, head);
          if (robot) { var ring = new THREE.Mesh(track(new THREE.TorusGeometry(r * 1.25, 0.07, 6, 18)), mat('#2f78c4', 1, { depthWrite: true })); ring.rotation.x = Math.PI / 2; ring.position.y = 1.3; tg.add(ring); }
          g.add(tg);
          var ent = new THREE.Mesh(track(new THREE.TorusGeometry(r + 0.14, 0.055, 6, 22)), mat('#3b2a24', 0.9, { depthWrite: true })); g.add(ent);
          // ports.at: [x, y] na przedniej ścianie brzucha (etap brzuszny) albo [θ, y] (klatka piersiowa)
          var q = ph.part === 'abd' ? [T.fx(p.at[0], p.at[1]), p.at[1]] : p.at;
          var w = i === ph.first ? [0.1, 0.2] : (function () { var j = order.indexOf(i), a = 0.36, b = 0.82, s = (b - a) / Math.max(1, order.length); return [a + j * s, a + (j + 0.85) * s]; })();
          var Lp = lab(p.name, p.sub, robot ? '#2f78c4' : '#56636f', 'seg', function () { return tg.position.clone().addScaledVector(tg.userData.out || new V3(0, 0, 1), 2.8); });
          Ph.ports.push({ p: p, q: q, g: tg, ent: ent, mats: [cm, hm], w: w, L: Lp });
        });
        if (ph.line) { // robot: linia portów, przerywana
          var lg = new THREE.Group(), L0 = ph.line[0], L1 = ph.line[1], lm2 = mat('#2f78c4', 0.55, { depthWrite: true });
          for (var ls = 0; ls < 24; ls += 2) { var a = ls / 24, b2 = (ls + 1) / 24; lg.add(new THREE.Mesh(track(tubeOn([[L0[0] + (L1[0] - L0[0]) * a, L0[1] + (L1[1] - L0[1]) * a], [L0[0] + (L1[0] - L0[0]) * b2, L0[1] + (L1[1] - L0[1]) * b2]], -0.04, 0.045, 1)), lm2)); }
          g.add(lg); Ph.line = lg;
        }
        if (ph.ics) { // wejście do klatki piersiowej: przestrzeń międzyżebrowa (linia przerywana pod skórą)
          var ig = new THREE.Group(), im = mat('#e0a020', 0.95, { depthWrite: true }), ip = ph.ics.pts, nI = ip.length - 1;
          for (var s = 0; s < nI; s += 2) ig.add(new THREE.Mesh(track(tubeOn([ip[s], ip[Math.min(nI, s + 1)]], 0.3, 0.07, 0)), im));
          g.add(ig); Ph.ics = { g: ig, L: lab(ph.ics.name, ph.ics.sub, '#b07810', 'cut', function () { return P(ip[Math.round(nI * 0.3)], -0.5); }) };
        }
        if (ph.ext) { // planowane poszerzenie cięcia (wydobycie preparatu), przerywane
          var eg = new THREE.Group(), em = mat(A.COL.cut, 0.95, { depthWrite: true }), ep = skinCurve(ph.ext.pts, -0.05, 0, 9).uv;
          for (var es = 0; es < 9; es += 2) eg.add(new THREE.Mesh(track(tubeOn([ep[es], ep[es + 1]], -0.05, 0.07, 0)), em));
          g.add(eg); Ph.ext = { g: eg, L: lab(ph.ext.name, ph.ext.sub, A.COL.cut, 'cut', function () { return P(ep[4], -0.7); }) };
        }
      });
    });
    var lastK = -1;
    function setK(k) {
      if (Math.abs(k - lastK) < 1e-4) return; lastK = k;
      morphs.forEach(function (q) { var Pp = q.g.attributes.position.array; for (var i = 0; i < Pp.length; i++) Pp[i] = q.a[i] + (q.b[i] - q.a[i]) * k; q.g.attributes.position.needsUpdate = true; if (q.sheet) q.g.computeVertexNormals(); q.g.computeBoundingSphere(); });
      dots.forEach(function (d) { d.s.position.copy(P(d.q, -0.04, k)); });
      umb.position.copy(P(LMk.umb, -0.02, k)); umb.quaternion.setFromUnitVectors(new V3(0, 0, 1), T.nrm(LMk.umb[0], LMk.umb[1], k));
    }
    // podział osi m między etapy
    var M0 = -0.97, M1 = -0.03;
    function phaseOf(set, m) { var n = set.phases.length, L = (M1 - M0) / n, i = Math.max(0, Math.min(n - 1, Math.floor((m - M0) / L))); return { i: i, u: clamp01((m - M0 - i * L) / L) }; }
    function camPh(part) {
      var q = X.cams[part] || X.cam, asp = view.w / view.h, pv = asp < 1, D = fitDist(asp);
      return { t: new V3().fromArray(pv && q.tp ? q.tp : q.t), az: q.az, el: q.el, d: D * (pv && q.kp ? q.kp : q.k) };
    }
    var tool = { d: { type: 'dostep' }, grp: grp, overlay: false, labels: labels, sets: SETS, torso: true, pose: null, ph: -1,
      update: function (m) {
        var on = m < -0.001 && !SPLIT.on; grp.visible = on;
        if (!on) { labels.forEach(function (L) { L.alpha = 0; }); return; }
        var kind = ACC.kind, set = kind && SETS[kind] && $('acc').hidden ? SETS[kind] : null, D = set ? set.d : null;
        var vis = sm((m + 1) / 0.08), cur = set ? phaseOf(set, m) : null, part = cur ? set.phases[cur.i].ph.part : 'all';
        // etap wcześniejszy „zamknięty”, gdy chory zmienił ułożenie (klatka piersiowa na lewym boku ↔ brzuch i szyja na plecach): trokary usunięte
        // (zostaje miejsce wkłucia), rany zszyte, bez odmy; brzuch i szyja w McKeownie — jednocześnie, bez zmiany ułożenia
        function closed(Ph, i) { return i < cur.i && (Ph.ph.part === 'thx') !== (part === 'thx'); }
        // odma: z etapu laparoskopowego, do zmiany ułożenia
        var k = 0;
        if (set) set.phases.forEach(function (Ph, i) { if (Ph.ph.insuf && i <= cur.i && !closed(Ph, i)) k = Math.max(k, i < cur.i ? 1 : sm((cur.u - 0.24) / 0.1)); });
        setK(k);
        scmL.userData.op = part === 'neck' ? 0.4 : 0.22;
        ribR.userData.op = part === 'thx' ? 0.55 : part === 'all' ? 0.3 : 0.14; ribL.userData.op = part === 'all' ? 0.3 : 0.12; cartM.userData.op = part === 'thx' || part === 'neck' ? 0.14 : 0.24;
        grp.traverse(function (o) { if (o.material && o.material.userData && o.material.userData.op != null) o.material.opacity = o.material.userData.op * vis; });
        axG.visible = part === 'thx'; scapG.visible = part === 'thx';
        Object.keys(SETS).forEach(function (id) { SETS[id].g.visible = !!set && SETS[id] === set; });
        LL.forEach(function (L) { L.anchor = L.fn(k); L.alpha = vis > 0.5 && L.parts.indexOf(part) >= 0 ? 1 : 0; });
        Object.keys(SETS).forEach(function (id) { SETS[id].phases.forEach(function (Ph) { Ph.cuts.forEach(function (c) { c.L.alpha = 0; }); Ph.ports.forEach(function (Pp) { Pp.L.alpha = 0; }); if (Ph.ics) Ph.ics.L.alpha = 0; if (Ph.ext) Ph.ext.L.alpha = 0; }); });
        if (set) set.phases.forEach(function (Ph, i) {
          var u = i < cur.i ? 1 : i > cur.i ? -1 : cur.u, now = i === cur.i, shut = closed(Ph, i);
          Ph.cuts.forEach(function (c) {
            var tt = clamp01((u - 0.16) / 0.32), op = shut ? 0 : sm((u - 0.5) / 0.24);
            c.mesh.visible = tt > 0; c.line.setDrawRange(0, Math.round(tt * c.line.parameters.tubularSegments) * c.line.parameters.radialSegments * 6);
            c.wm.visible = op > 0.01;
            if (c.wm.visible) for (var q = 0; q <= c.NW; q++) {
              var s = q / c.NW, uv = c.uv[q], Pq = P(uv, 0), N = T.nrm(uv[0], uv[1], 0), Tq = P(c.uv[Math.min(c.NW, q + 1)], 0).sub(P(c.uv[Math.max(0, q - 1)], 0)).normalize();
              var sd = new V3().crossVectors(N, Tq).normalize(), w = (c.c.w || 0.85) * Math.pow(Math.sin(Math.PI * s), 0.6) * op;
              var a = Pq.clone().addScaledVector(sd, w).addScaledVector(N, 0.04), b = Pq.clone().addScaledVector(sd, -w).addScaledVector(N, 0.04);
              c.wp.set([a.x, a.y, a.z, b.x, b.y, b.z], q * 6);
            }
            c.wg.attributes.position.needsUpdate = true; c.wg.computeBoundingSphere();
            c.L.anchor = c.L.fn(); c.L.alpha = now && tt > 0.3 ? 1 : 0;
          });
          Ph.ports.forEach(function (Pp) {
            var f = sm((u - Pp.w[0]) / (Pp.w[1] - Pp.w[0])), E = P(Pp.q, 0, Ph.ph.part === 'abd' ? k : 0), Nn = T.nrm(Pp.q[0], Pp.q[1], Ph.ph.part === 'abd' ? k : 0);
            var ax = Ph.tgt.clone().sub(E).normalize().multiplyScalar(0.15).addScaledVector(Nn, -0.85).normalize(), out = ax.clone().negate();
            Pp.ent.visible = f > 0.5; Pp.ent.position.copy(E).addScaledVector(Nn, 0.03); Pp.ent.quaternion.setFromUnitVectors(new V3(0, 0, 1), Nn);
            Pp.g.visible = f > 0.01 && !shut; Pp.g.userData.out = out;
            Pp.g.quaternion.setFromUnitVectors(new V3(0, 1, 0), out); Pp.g.position.copy(E).addScaledVector(out, (1 - f) * 6);
            Pp.mats.forEach(function (mm) { mm.opacity = f; });
            Pp.L.anchor = Pp.L.fn(); Pp.L.alpha = now && f > 0.6 ? 1 : 0;
          });
          if (Ph.line) Ph.line.visible = u > 0.06 && !shut;
          if (Ph.ics) { var fi = shut ? 0 : sm((u - 0.76) / 0.1); Ph.ics.g.visible = fi > 0.01; Ph.ics.g.children.forEach(function (c2, j) { c2.visible = fi * Ph.ics.g.children.length > j; }); Ph.ics.L.anchor = Ph.ics.L.fn(); Ph.ics.L.alpha = now && fi > 0.5 ? 1 : 0; }
          if (Ph.ext) { var fe = sm((u - 0.84) / 0.1); Ph.ext.g.visible = fe > 0.01; Ph.ext.g.children.forEach(function (c2, j) { c2.visible = fe * Ph.ext.g.children.length > j; }); Ph.ext.L.anchor = Ph.ext.L.fn(); Ph.ext.L.alpha = now && fe > 0.5 ? 1 : 0; }
        });
        // kamera i schemat ułożenia: przy zmianie etapu
        var fr = FR[S.frame], isAcc = fr && fr.k === 'access', ph = set ? cur.i : -1;
        if (isAcc && ph !== tool.ph) {
          tool.ph = ph; tool.pose = set ? set.phases[ph].ph.pose || null : null;
          if (set) camTo(camPh(part), 1.5);
          poseUpdate();
        }
        if (isAcc) {
          var Sph = set ? set.phases[cur.i].ph : null, n = set ? set.phases.length : 0;
          var tt2 = Sph ? tr(D.title) + ' — ' + tr(Sph.name) + (n > 1 ? ' (' + (cur.i + 1) + '/' + n + ')' : '') + ': ' + tr(Sph.title) : tr('Dostęp operacyjny');
          var tx2 = Sph ? tr(Sph.text) : tr(accPrompt(X));
          if ($('capTitle').textContent !== tt2) $('capTitle').textContent = tt2;
          if ($('capText').textContent !== tx2) $('capText').textContent = tx2;
        }
      } };
    M.group.add(grp); M.tools.push(tool); M.access = tool;
  }
