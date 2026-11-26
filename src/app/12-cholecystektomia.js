  /* ---------- cholecystektomia (TOOL_EXT.chole): własny model z ANAT.CHOLE (11c-cholecystektomia.js) — wątroba z dołem pęcherzyka i rowkiem Rouvière’a,
     pęcherzyk (dno, trzon, kieszonka Hartmanna, szyjka), więzadło wątrobowo-dwunastnicze, dwunastnica. Odciągnięcie: płat prawy wątroby odchyla się ku górze
     (położenia spoczynkowe i po odchyleniu liczone raz), pęcherzyk przesuwany punkt po punkcie (A.CHOLE.gbMove). Trójkąt wątrobowo-pęcherzykowy: płat Coonsa
     między przewodem pęcherzykowym, przewodem wątrobowym wspólnym, wątrobą i pęcherzykiem — otrzewna (nacinana) i tkanka tłuszczowa usuwana od środka.
     Płytka pęcherzykowa: trójkąty powierzchni dołu pęcherzyka, widoczne za frontem oddzielania (thr). Kadry „lap”: światło sceny przygaszone (M.light),
     światło optyki przy kamerze, ciemne tło jamy brzusznej, narzędzia z trokarów układu amerykańskiego. ---------- */
  var CHOLE_CACHE = null;
  function cholLiver(h) {
    if (CHOLE_CACHE && CHOLE_CACHE.h === h) return CHOLE_CACHE;
    var H = A.CHOLE, o = H.grid.o, nx = Math.ceil(H.grid.n[0] / h) + 1, ny = Math.ceil(H.grid.n[1] / h) + 1, nz = Math.ceil(H.grid.n[2] / h) + 1, F = new Float32Array(nx * ny * nz);
    for (var k = 0; k < nz; k++) for (var j = 0; j < ny; j++) for (var i = 0; i < nx; i++)
      F[i + nx * (j + ny * k)] = (i === 0 || j === 0 || k === 0 || i === nx - 1 || j === ny - 1 || k === nz - 1) ? 1 : H.sdf(o[0] + i * h, o[1] + j * h, o[2] + k * h);
    return (CHOLE_CACHE = { h: h, m: A.LIVER.surfNets(F, { nx: nx, ny: ny, nz: nz, h: h, o: o }) });
  }
  function makeChole(d) {
    var H = A.CHOLE, grp = new THREE.Group(), labels = [], tmp = [0, 0, 0], X3 = function (a) { return new V3(a[0], a[1], a[2]); };
    var COL = { liver: '#9c4636', gb: '#6e9c78', bd: LV_COL.bd, ha: LV_COL.ha, pv: LV_COL.pv, fat: '#eabf45', per: '#f2ebdf', plate: '#e8cdb4', duo: '#c4877a', node: '#c78f72' };
    function mat(col, op, extra) { var m = track(new THREE.MeshStandardMaterial(Object.assign({ color: col, roughness: 0.5, metalness: 0.02, transparent: true, opacity: op }, extra || {}))); return m; }
    function tubeG(pts, r, seg) { var c = new THREE.CatmullRomCurve3(pts.map(function (p) { return p.isVector3 ? p.clone() : X3(p); }), false, 'centripetal'); return { c: c, g: A.buildTube(c, typeof r === 'function' ? r : function () { return r; }, seg || Math.max(8, Math.round(c.getLength() * 6)), 12, true) }; }
    function lab(text, sub, col, kind) { var L = { el: mkLabel(text, sub || '', col, kind || 'seg'), anchor: null, alpha: 0 }; labels.push(L); return L; }
    function put(L, p, on) { L.anchor = p; L.alpha = on ? 1 : 0; }

    /* --- wątroba: spoczynek (A) i odchylenie (B); położenia mieszane liniowo wg st.ret --- */
    var LD = cholLiver(MOBILE ? 0.3 : 0.22).m, NV = LD.pos.length / 3, LA = Float32Array.from(LD.pos), LB = new Float32Array(LD.pos.length), NA = Float32Array.from(LD.nor), NBn = new Float32Array(LD.nor.length);
    for (var vi = 0; vi < NV; vi++) {
      var pa = [LA[3 * vi], LA[3 * vi + 1], LA[3 * vi + 2]], pb = H.retLiver(pa, 1, [0, 0, 0]); LB.set(pb, 3 * vi);
      var a = H.RET.phi * Math.max(0, Math.min(1, (function (y) { var x = (-1.2 - y) / 2.6; x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * (3 - 2 * x); })(pa[1]))), c = Math.cos(a), s = Math.sin(a), ny0 = NA[3 * vi + 1], nz0 = NA[3 * vi + 2];
      NBn[3 * vi] = NA[3 * vi]; NBn[3 * vi + 1] = ny0 * c - nz0 * s; NBn[3 * vi + 2] = ny0 * s + nz0 * c;
    }
    var lg = track(new THREE.BufferGeometry()); lg.setAttribute('position', new THREE.BufferAttribute(Float32Array.from(LA), 3)); lg.setAttribute('normal', new THREE.BufferAttribute(Float32Array.from(NA), 3)); lg.setIndex(new THREE.BufferAttribute(LD.idx, 1));
    var liverM = mat(COL.liver, 1, { roughness: 0.42 }), liver = new THREE.Mesh(lg, liverM); liver.renderOrder = 1; grp.add(liver);
    // płytka pęcherzykowa: trójkąty dołu pęcherzyka (blisko powierzchni pęcherzyka w spoczynku), parametr t osi pęcherzyka dla każdego wierzchołka
    var cGB = new THREE.CatmullRomCurve3(H.GB.map(X3), false, 'centripetal'), GBS = []; for (var q = 0; q <= 60; q++) GBS.push({ p: cGB.getPointAt(q / 60), t: q / 60, r: H.gbR(q / 60) });
    function nearGB(x, y, z) { var b = 1e9, bt = 0; for (var i = 0; i < GBS.length; i++) { var g = GBS[i], dd = Math.sqrt((x - g.p.x) * (x - g.p.x) + (y - g.p.y) * (y - g.p.y) + (z - g.p.z) * (z - g.p.z)) - g.r; if (dd < b) { b = dd; bt = g.t; } } return [b, bt]; }
    var plIdx = [], plMap = {}, plPosA = [], plPosB = [], plT = [], plD = [], vT = new Float32Array(NV).fill(-1), vD = new Float32Array(NV);
    for (var ti = 0; ti < LD.idx.length; ti += 3) {
      var ia = LD.idx[ti], ib = LD.idx[ti + 1], ic = LD.idx[ti + 2], cx = (LA[3 * ia] + LA[3 * ib] + LA[3 * ic]) / 3, cy = (LA[3 * ia + 1] + LA[3 * ib + 1] + LA[3 * ic + 1]) / 3, cz = (LA[3 * ia + 2] + LA[3 * ib + 2] + LA[3 * ic + 2]) / 3, ng = nearGB(cx, cy, cz);
      if (ng[0] > 0.22 || ng[1] > 0.97) continue;
      var ax0 = cGB.getPointAt(ng[1]), nx0 = (NA[3 * ia] + NA[3 * ib] + NA[3 * ic]), ny0 = (NA[3 * ia + 1] + NA[3 * ib + 1] + NA[3 * ic + 1]), nz0 = (NA[3 * ia + 2] + NA[3 * ib + 2] + NA[3 * ic + 2]);
      var tx = ax0.x - cx, ty = ax0.y - cy, tz = ax0.z - cz; if ((tx * nx0 + ty * ny0 + tz * nz0) < 0.55 * Math.hypot(tx, ty, tz) * Math.hypot(nx0, ny0, nz0)) continue;   // tylko dno dołu (normalna ku osi pęcherzyka)
      [ia, ib, ic].forEach(function (v) {
        if (plMap[v] == null) { plMap[v] = plPosA.length / 3; var off = 0.035; for (var k = 0; k < 3; k++) { plPosA.push(LA[3 * v + k] + NA[3 * v + k] * off); plPosB.push(LB[3 * v + k] + NBn[3 * v + k] * off); }
          if (vT[v] < 0) { var nv = nearGB(LA[3 * v], LA[3 * v + 1], LA[3 * v + 2]); vT[v] = nv[1]; vD[v] = nv[0]; } plT.push(vT[v]); plD.push(vD[v]); }
        plIdx.push(plMap[v]);
      });
    }
    var plA = Float32Array.from(plPosA), plB = Float32Array.from(plPosB), plCol = new Float32Array(plT.length * 4), plCv = new THREE.Color(COL.plate);
    for (var pc = 0; pc < plT.length; pc++) plCol.set([plCv.r, plCv.g, plCv.b, 0], pc * 4);
    var plG = track(new THREE.BufferGeometry()); plG.setAttribute('position', new THREE.BufferAttribute(Float32Array.from(plA), 3)); plG.setAttribute('color', new THREE.BufferAttribute(plCol, 4)); plG.setIndex(plIdx); plG.computeVertexNormals();
    var plM = mat('#ffffff', 1, { vertexColors: true, roughness: 0.25, emissive: '#3a2c18', emissiveIntensity: 0.35, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }), plate = new THREE.Mesh(plG, plM); plate.renderOrder = 3; grp.add(plate);
    var lastRet = -1;
    function setLiver(r) {
      if (Math.abs(r - lastRet) < 1e-4) return; lastRet = r;
      var P = lg.attributes.position.array, N = lg.attributes.normal.array;
      for (var i = 0; i < P.length; i++) { P[i] = LA[i] + (LB[i] - LA[i]) * r; N[i] = NA[i] + (NBn[i] - NA[i]) * r; }
      lg.attributes.position.needsUpdate = true; lg.attributes.normal.needsUpdate = true; lg.computeBoundingSphere();
      var Q = plG.attributes.position.array; for (var j = 0; j < Q.length; j++) Q[j] = plA[j] + (plB[j] - plA[j]) * r;
      plG.attributes.position.needsUpdate = true; plG.computeVertexNormals(); plG.computeBoundingSphere();
    }

    /* --- więzadło wątrobowo-dwunastnicze i dwunastnica (nieruchome) --- */
    var fixedL = [], intra = [];
    [['bd', COL.bd], ['pv', COL.pv], ['ha', COL.ha]].forEach(function (kv) {
      H.VES[kv[0]].forEach(function (v) {
        var T = tubeG(v.pts, v.r), m = new THREE.Mesh(track(T.g), mat(kv[1], 1)); m.renderOrder = 2; grp.add(m); if (v.intra) intra.push(m);
        var nm = { pv: ['Żyła wrotna', 0.35], pha: ['Tętnica wątrobowa właściwa', 0.45], rha: ['Tętnica wątrobowa prawa', 0.45] }[v.id];
        if (nm) fixedL.push({ L: lab(nm[0], '', kv[1]), p: T.c.getPointAt(nm[1]), ext: true });
        if (v.id === 'bd') { fixedL.push({ L: lab('Przewód żółciowy wspólny', '', kv[1]), p: T.c.getPointAt(0.28) }); fixedL.push({ L: lab('Przewód wątrobowy wspólny', '', kv[1]), p: T.c.getPointAt(H.tCYJ + 0.17) }); }
      });
    });
    var bdC = new THREE.CatmullRomCurve3(H.VES.bd[0].pts.map(X3), false, 'centripetal');
    var duoT = tubeG(H.DUO, function (t) { return t < 0.06 ? 0.65 + 0.27 * t / 0.06 : 0.92; }), duo = new THREE.Mesh(track(duoT.g), mat(COL.duo, 1, { roughness: 0.6 })); grp.add(duo);
    fixedL.push({ L: lab('Dwunastnica', '', COL.duo), p: duoT.c.getPointAt(0.45) });
    var Lrv = lab('Rowek Rouvière’a', 'preparowanie powyżej jego poziomu', '#7a3a2c');

    /* --- pęcherzyk: rura z kopułą dna; t wierzchołka = najbliższy punkt osi; położenia liczone przez A.CHOLE.gbMove --- */
    var gbT = tubeG(H.GB, H.gbR, 96), gbGeo = track(gbT.g), GP = gbGeo.attributes.position.array, G0 = Float32Array.from(GP), GT = new Float32Array(GP.length / 3);
    var GUV = gbGeo.attributes.uv.array; for (var gv = 0; gv < GT.length; gv++) GT[gv] = GUV[2 * gv];   // t = parametr pierścienia rury (kopuły: 0 / 1)
    var gbM = mat(COL.gb, 1, { roughness: 0.3 }), gb = new THREE.Mesh(gbGeo, gbM); gb.renderOrder = 2; grp.add(gb);
    function axisRest(t) { return cGB.getPointAt(Math.max(0, Math.min(1, t))); }
    function medialDir(t) { // kierunek od osi pęcherzyka ku przewodowi wątrobowemu (strona trójkąta), prostopadle do osi
      var P = axisRest(t), Tn = cGB.getTangentAt(Math.max(0, Math.min(1, t))), D = new V3(-1.18, -4.9, 0.18).sub(P); return D.addScaledVector(Tn, -D.dot(Tn)).normalize();
    }
    function onGB(t, dir, k) { return axisRest(t).addScaledVector(dir, H.gbR(t) * k).toArray(); }   // punkt na ścianie pęcherzyka (spoczynek)
    var OUTV = new V3(), st = H.stage(0);
    function gbP(p, t, S, out) { var r = H.gbMove(p, t, S || st, out || [0, 0, 0]); if (!S || S === st) { r[0] += OUTV.x * st.out; r[1] += OUTV.y * st.out; r[2] += OUTV.z * st.out; } return X3(r); }
    var REST = { neck: axisRest(1).toArray(), art: onGB(H.tArt, medialDir(H.tArt), 0.92), node: onGB(H.tNode, medialDir(H.tNode), 1.08),
      fund: axisRest(0).addScaledVector(cGB.getTangentAt(0), -H.gbR(0) * 0.95).toArray(), hart: onGB(0.86, new V3(-0.75, -0.55, 0.35).normalize(), 1.0) };
    var mNode = mat(COL.node, 1, { roughness: 0.6 }), node = new THREE.Mesh(track(new THREE.SphereGeometry(0.3, 14, 10)), mNode); grp.add(node);
    function setGB() {
      for (var i = 0; i < GT.length; i++) { H.gbMove([G0[3 * i], G0[3 * i + 1], G0[3 * i + 2]], GT[i], st, tmp); GP[3 * i] = tmp[0] + OUTV.x * st.out; GP[3 * i + 1] = tmp[1] + OUTV.y * st.out; GP[3 * i + 2] = tmp[2] + OUTV.z * st.out; }
      gbGeo.attributes.position.needsUpdate = true; gbGeo.computeVertexNormals(); gbGeo.computeBoundingSphere();
    }

    /* --- przewód i tętnica pęcherzykowa: krzywe od pęcherzyka (ruchomy koniec) do przewodu wątrobowego / tętnicy wątrobowej prawej (nieruchome);
       po przecięciu kikut zostaje w położeniu z chwili przecięcia (FROZ), część z pęcherzykiem idzie z nim --- */
    var FROZ = H.stage(1.5), CYJ = X3(H.CYJ), CA0 = X3(H.CA0);
    function ductCurve(S) {
      var N = gbP(REST.neck, 1, S), N2 = gbP(axisRest(0.95).toArray(), 0.95, S), tn = N.clone().sub(N2).normalize(), r = S.ret;
      var o1 = new V3(-0.35, 0, 0).lerp(new V3(0, -0.25, 0.05), r), o2 = new V3(-0.25, 0, 0.1).lerp(new V3(0, -0.15, 0.05), r);
      return new THREE.CatmullRomCurve3([N, N.clone().addScaledVector(tn, 0.35), N.clone().lerp(CYJ, 0.38).add(o1), N.clone().lerp(CYJ, 0.7).add(o2), CYJ], false, 'centripetal');   // t = 0 przy pęcherzyku
    }
    function artCurve(S) {
      var I = gbP(REST.art, H.tArt, S), Q1 = CA0.clone().add(new V3(-0.5, -0.12, 0.3));
      return new THREE.CatmullRomCurve3([CA0, Q1, Q1.clone().lerp(I, 0.6).add(new V3(0, -0.15, 0.12)), I], false, 'centripetal');   // t = 1 przy pęcherzyku
    }
    var ductM = mat(COL.bd, 1), artM = mat(COL.ha, 1), parts = [], key = '';
    function seg(c, a, b, r, m, shift) { var P = []; for (var i = 0; i <= 18; i++) { var p = c.getPointAt(a + (b - a) * i / 18); if (shift) p.add(shift); P.push(p); } var T = tubeG(P, r, 24), M0 = new THREE.Mesh(track(T.g), m); M0.renderOrder = 2; grp.add(M0); parts.push(M0); }
    var cur = { duct: null, art: null };
    function rebuild() {
      var kk = [st.ret, st.thr, st.out].map(function (v) { return v.toFixed(3); }).join() + st.cutD + st.cutA; if (kk === key) return; key = kk;
      parts.forEach(function (m) { grp.remove(m); m.geometry.dispose(); }); parts = [];
      var cD = ductCurve(st), cA = artCurve(st), fD = ductCurve(FROZ), fA = artCurve(FROZ), CL = H.CLIPS;
      var sD = gbP(REST.neck, 1).sub(gbP(REST.neck, 1, FROZ)), sA = gbP(REST.art, H.tArt).sub(gbP(REST.art, H.tArt, FROZ));
      var spec = st.out < 0.5;   // części przewodu i tętnicy przy pęcherzyku znikają z nim (worek)
      if (!st.cutD) seg(cD, 0, 1, 0.17, ductM); else { if (spec) seg(fD, 0, CL.duct.cut - 0.035, 0.17, ductM, sD); seg(fD, CL.duct.cut + 0.035, 1, 0.17, ductM); }
      if (!st.cutA) seg(cA, 0, 1, 0.12, artM); else { seg(fA, 0, CL.art.cut - 0.035, 0.12, artM); if (spec) seg(fA, CL.art.cut + 0.035, 1, 0.12, artM, sA); }
      cur = { duct: cD, art: cA, fD: fD, fA: fA, sD: sD, sA: sA };
    }

    /* --- klipsy tytanowe: dwa ramiona po obu stronach przewodu (w płaszczyźnie obrazu), zamknięte na jednym końcu --- */
    var clipM = mat('#c9ced4', 1, { metalness: 0.75, roughness: 0.25 }), clips = [];
    ['duct', 'art'].forEach(function (w) {
      var C0 = H.CLIPS[w], r = w === 'duct' ? 0.17 : 0.12;
      C0.keep.concat(C0.spec).forEach(function (t, i) {
        var g = new THREE.Group(), L = 2 * r + 0.42, legG = track(new THREE.BoxGeometry(L, 0.06, 0.1));
        [-1, 1].forEach(function (sd) { var leg = new THREE.Mesh(legG, clipM); leg.position.y = sd * r * 0.55; g.add(leg); });
        var hinge = new THREE.Mesh(track(new THREE.BoxGeometry(0.08, 2 * r * 0.55 + 0.06, 0.1)), clipM); hinge.position.x = L / 2; g.add(hinge);
        grp.add(g); clips.push({ g: g, w: w, t: t, spec: i >= C0.keep.length, at: C0.at[Math.min(i, 2)] });
      });
    });
    var camW = new V3(), FRONT = new V3();   // FRONT — optyka w pępku (kierunek „ku kamerze” dla klipsów, tkanki trójkąta i narzędzi)
    function placeClips() {
      clips.forEach(function (K) {
        var froz = K.w === 'duct' ? st.cutD : st.cutA, c = froz ? (K.w === 'duct' ? cur.fD : cur.fA) : (K.w === 'duct' ? cur.duct : cur.art);
        var p = c.getPointAt(K.t), T = c.getTangentAt(K.t); if (froz && K.spec) p.add(K.w === 'duct' ? cur.sD : cur.sA);
        var C = FRONT.clone().sub(p).normalize(), ax = new V3().crossVectors(C, T).normalize(), w = new V3().crossVectors(T, ax).normalize();
        K.g.position.copy(p); K.g.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(ax, w, new V3().crossVectors(ax, w)));   // ramiona w poprzek przewodu, po obu jego stronach (przód / tył)
      });
    }

    /* --- trójkąt wątrobowo-pęcherzykowy: płat Coonsa (u: od przewodu wątrobowego ku pęcherzykowi, v: od przewodu pęcherzykowego ku wątrobie) --- */
    var NU = 16, NVv = 12, tTM = A.nearestT(bdC, [-1.18, -4.95, 0.18]);
    function coons(S, dc) {
      var B4 = [], C1 = [], C2 = [], C3 = [], i, j;
      for (i = 0; i <= NU; i++) C1.push(dc.getPointAt(1 - i / NU));                                        // dół: przewód pęcherzykowy (od ujścia ku pęcherzykowi)
      for (j = 0; j <= NVv; j++) { var t = 1 - 0.36 * j / NVv; B4.push(gbP(onGB(t, medialDir(t), 0.9), t, S)); C2.push(bdC.getPointAt(H.tCYJ + (tTM - H.tCYJ) * j / NVv).add(new V3(-0.26, 0, 0.05))); }
      var TM = C2[NVv], TL = B4[NVv];
      for (i = 0; i <= NU; i++) C3.push(TM.clone().lerp(TL, i / NU));
      var P = [];
      for (j = 0; j <= NVv; j++) for (i = 0; i <= NU; i++) {
        var u = i / NU, v = j / NVv, p = C1[i].clone().multiplyScalar(1 - v).addScaledVector(C3[i], v).addScaledVector(C2[j], 1 - u).addScaledVector(B4[j], u);
        p.addScaledVector(C1[0], -(1 - u) * (1 - v)).addScaledVector(C1[NU], -u * (1 - v)).addScaledVector(C3[0], -(1 - u) * v).addScaledVector(C3[NU], -u * v);
        P.push(p);
      }
      return { P: P, edge: C1.concat(B4.slice(1), C3.slice().reverse().slice(1), C2.slice().reverse().slice(1)) };
    }
    var nGrid = (NU + 1) * (NVv + 1), fatIdx = [];
    for (var j0 = 0; j0 < NVv; j0++) for (var i0 = 0; i0 < NU; i0++) { var a0 = j0 * (NU + 1) + i0; fatIdx.push(a0, a0 + 1, a0 + NU + 1, a0 + 1, a0 + NU + 2, a0 + NU + 1); }
    var fatBack = fatIdx.map(function (v, k) { return v + nGrid; }); for (var fb = 0; fb < fatBack.length; fb += 3) { var tt = fatBack[fb]; fatBack[fb] = fatBack[fb + 1]; fatBack[fb + 1] = tt; }
    function sheet(col, n2, extra) {
      var g = track(new THREE.BufferGeometry()); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nGrid * n2 * 3), 3)); g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(nGrid * n2 * 4), 4));
      g.setIndex(n2 === 2 ? fatIdx.concat(fatBack) : fatIdx);
      var m = new THREE.Mesh(g, mat('#ffffff', 1, Object.assign({ vertexColors: true, depthWrite: false, side: THREE.DoubleSide }, extra || {}))); grp.add(m); m.userData.col = new THREE.Color(col); return m;
    }
    var fat = sheet(COL.fat, 2, { roughness: 0.55 }), peri = sheet(COL.per, 1, { roughness: 0.2 }); fat.renderOrder = 4; peri.renderOrder = 5;
    var incM = mat('#b2382c', 1, { emissive: '#7a1d16', emissiveIntensity: 0.3 }), inc = null, winM = mat('#2f9e44', 1, { emissive: '#2f9e44', emissiveIntensity: 0.4 }), win = new THREE.Group(); grp.add(win);
    var winKey = '', triCtr = new V3();
    function setTriangle() {
      var cs = coons(st, cur.duct), P = cs.P, front = new V3(), fp = fat.geometry.attributes.position.array, fc = fat.geometry.attributes.color.array, pp = peri.geometry.attributes.position.array, pcl = peri.geometry.attributes.color.array;
      triCtr.copy(P[Math.floor(NVv / 2) * (NU + 1) + Math.floor(NU / 2)]); front.copy(FRONT).sub(triCtr).normalize();
      var fc0 = fat.userData.col, pc0 = peri.userData.col, s = st.fat;
      for (var j = 0; j <= NVv; j++) for (var i = 0; i <= NU; i++) {
        var k = j * (NU + 1) + i, u = i / NU, v = j / NVv, p = P[k];
        var du = P[j * (NU + 1) + Math.min(NU, i + 1)].clone().sub(P[j * (NU + 1) + Math.max(0, i - 1)]), dv = P[Math.min(NVv, j + 1) * (NU + 1) + i].clone().sub(P[Math.max(0, j - 1) * (NU + 1) + i]);
        var n = new V3().crossVectors(du, dv).normalize(); if (n.dot(front) < 0) n.negate();
        var qd = 2 * Math.min(u, 1 - u, v, 1 - v), al = 0.92 * clamp01((1.2 - qd - 1.3 * s) / 0.2), T = 0.55 * Math.pow(Math.sin(Math.PI * u), 0.8) * Math.pow(Math.sin(Math.PI * v), 0.8) * al * (1 + 0.28 * Math.sin(13 * u + 1) * Math.sin(11 * v + 2));   // płaty tłuszczu
        fp.set([p.x + n.x * T, p.y + n.y * T, p.z + n.z * T], 3 * k); fp.set([p.x - n.x * T * 0.8, p.y - n.y * T * 0.8, p.z - n.z * T * 0.8], 3 * (k + nGrid));
        fc.set([fc0.r, fc0.g, fc0.b, al], 4 * k); fc.set([fc0.r * 0.9, fc0.g * 0.9, fc0.b * 0.9, al], 4 * (k + nGrid));
        var To = T + 0.08; pp.set([p.x + n.x * To, p.y + n.y * To, p.z + n.z * To], 3 * k); pcl.set([pc0.r, pc0.g, pc0.b, 0.32 * (1 - sm(st.per))], 4 * k);
      }
      [fat, peri].forEach(function (m) { var g = m.geometry; g.attributes.position.needsUpdate = true; g.attributes.color.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingSphere(); });
      fat.visible = s < 0.999; peri.visible = st.per < 0.999;
      // nacięcie otrzewnej wzdłuż pęcherzyka (rysowane, potem znika z usunięciem tkanki)
      if (inc) { grp.remove(inc); inc.geometry.dispose(); inc = null; }
      var ip = st.per, io = 1 - sm((s - 0.35) / 0.3);
      if (ip > 0.02 && io > 0.02) { var E = []; for (var jj = 0; jj <= NVv; jj++) E.push(P[jj * (NU + 1) + NU - 1].clone().addScaledVector(front, 0.62)); var T2 = tubeG(E.slice(0, Math.max(2, Math.round(ip * NVv) + 1)), 0.05, 20); inc = new THREE.Mesh(track(T2.g), incM); incM.opacity = io; inc.renderOrder = 6; grp.add(inc); }
      return cs;
    }
    function setWindow(cs, on) {
      win.visible = on; if (!on || winKey === key) return; winKey = key;
      while (win.children.length) { var c = win.children.pop(); c.geometry.dispose(); }
      var E = cs.edge.filter(function (p, i) { return i % 2 === 0; }).map(function (p) { return p.clone().addScaledVector(FRONT.clone().sub(p).normalize(), 0.3); }), cc = new THREE.CatmullRomCurve3(E, true, 'centripetal'), n = 64;
      for (var i = 0; i < n; i += 2) { var pts = []; for (var t = 0; t <= 4; t++) pts.push(cc.getPointAt((i + t / 4) / n)); win.add(new THREE.Mesh(track(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 6, 0.045, 5, false)), winM)); }
    }

    /* --- narzędzia laparoskopowe (trokary układu amerykańskiego): chwytak dna (linia pachowa przednia), chwytak kieszonki Hartmanna (linia środkowo-obojczykowa),
       narzędzie robocze z nadbrzusza (disektor, klipsownica, nożyczki, haczyk); optyka w pępku = kamera --- */
    var XF = A.ACCESS.chole.xf, PORTS = A.ACCESS.chole.lap.ports.map(function (P) { var b = A.BODY.at(P.at[0], P.at[1], 0, 1); return b.multiplyScalar(XF.s).add(X3(XF.d)); });
    FRONT.copy(PORTS[0]);
    var shaftM = mat('#2a2f34', 1, { roughness: 0.35, metalness: 0.3 }), jawM = mat('#b8c0c8', 1, { metalness: 0.7, roughness: 0.25 }), tipM = mat('#3d6e8f', 1, { roughness: 0.4 });
    function instr(hook) {
      var g = new THREE.Group(), sh = new THREE.Mesh(track(new THREE.CylinderGeometry(0.24, 0.24, 1, 14)), shaftM), j1, j2; g.add(sh);
      var ring = new THREE.Mesh(track(new THREE.CylinderGeometry(0.25, 0.25, 0.25, 14)), tipM); g.add(ring);
      if (hook) { j1 = new THREE.Mesh(track(new THREE.CylinderGeometry(0.06, 0.06, 0.9, 8)), jawM); j2 = new THREE.Mesh(track(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8)), jawM); }
      else { j1 = new THREE.Mesh(track(new THREE.BoxGeometry(0.16, 0.85, 0.09)), jawM); j2 = new THREE.Mesh(track(new THREE.BoxGeometry(0.16, 0.85, 0.09)), jawM); }
      g.add(j1, j2); grp.add(g); return { g: g, sh: sh, ring: ring, j1: j1, j2: j2, hook: hook };
    }
    var Y = new V3(0, 1, 0);
    function placeI(I, port, tip, open) {
      var dir = tip.clone().sub(port), len = dir.length(); dir.normalize();
      var base = tip.clone().addScaledVector(dir, -0.85), L = Math.max(0.5, len - 0.85);
      I.sh.scale.set(1, L, 1); I.sh.position.copy(port.clone().lerp(base, 0.5)); I.sh.quaternion.setFromUnitVectors(Y, dir);
      I.ring.position.copy(base.clone().addScaledVector(dir, -0.12)); I.ring.quaternion.setFromUnitVectors(Y, dir);
      var side = new V3().crossVectors(dir, FRONT.clone().sub(tip)).normalize();
      if (I.hook) { I.j1.position.copy(base.clone().addScaledVector(dir, 0.45)); I.j1.quaternion.setFromUnitVectors(Y, dir); I.j2.position.copy(tip.clone().addScaledVector(side, 0.18)); I.j2.quaternion.setFromUnitVectors(Y, side); return; }
      [I.j1, I.j2].forEach(function (J, k) { var ang = (k ? 1 : -1) * (0.08 + 0.32 * open), dj = dir.clone().applyAxisAngle(new V3().crossVectors(dir, side).normalize(), ang);
        J.position.copy(base.clone().addScaledVector(dj, 0.43)); J.quaternion.setFromUnitVectors(Y, dj); });
    }
    var G1 = instr(false), G2 = instr(false), WD = instr(false), WH = instr(true);

    /* --- światło optyki i tło jamy brzusznej (kadry laparoskopowe) --- */
    var scope = new THREE.PointLight('#fff3e6', 1.15, 40, 1.2); grp.add(scope);
    liver.onBeforeRender = function (r, sc, cam) { camW.copy(cam.position); scope.position.copy(grp.worldToLocal(cam.position.clone())); };
    var back = new THREE.Mesh(track(new THREE.SphereGeometry(70, 24, 16)), track(new THREE.MeshBasicMaterial({ color: '#2a1410', side: THREE.BackSide, depthWrite: false }))); back.renderOrder = -10; back.position.set(-2, -6, 0); grp.add(back);

    /* --- podpisy --- */
    var Lgb = lab('Pęcherzyk żółciowy', '', COL.gb), Lhp = lab('Kieszonka Hartmanna', '', COL.gb), Lcd = lab('Przewód pęcherzykowy', '', COL.bd), Lca = lab('Tętnica pęcherzykowa', '', COL.ha);
    var Ltri = lab('Trójkąt wątrobowo-pęcherzykowy (Calota)', 'otrzewna i tkanka tłuszczowa z tętnicą i węzłem', '#d9b54e'), Lnode = lab('Węzeł pęcherzykowy (Mascagniego)', '', COL.node);
    var Lpl = lab('Płytka pęcherzykowa', 'dolna 1/3 pęcherzyka oddzielona od łoża', '#cdb98a'), Lwin = lab('Trójkąt oczyszczony', 'przez „okno” widać wątrobę', '#2f9e44'), Lcvs = lab('Dwie i tylko dwie struktury', 'wchodzą do pęcherzyka: przewód i tętnica', '#2f9e44');
    var Lclip = lab('Klipsy', 'dwa od strony chorego, jeden od strony pęcherzyka', '#9aa3ad'), Lsd = lab('Kikut przewodu pęcherzykowego', 'dwa klipsy', COL.bd), Lsa = lab('Kikut tętnicy pęcherzykowej', 'dwa klipsy', COL.ha), Lbed = lab('Łoże pęcherzyka', 'płytka pęcherzykowa na dolnej powierzchni wątroby', '#cdb98a');

    var tool = { d: d, grp: grp, overlay: false, el: null, labels: labels,
      dbg: function () { return { fat: fat, peri: peri, plate: plate, plA: plG.attributes.color.array, back: back, win: win, gb: gb, cur: cur, st: st, parts: parts.length, G: [G1, G2, WD, WH] }; },   // dla testów (ui_62)
      update: function (m) {
        var fr = FR[S.frame], lap = !!(fr && fr.lap) && m >= 0, acc = m < -0.001;
        st = H.stage(Math.max(0, m));
        // kierunek usunięcia: od szyjki ku optyce w pępku (worek wyciągany przez port)
        OUTV.copy(PORTS[0]).sub(gbP(REST.neck, 1, H.stage(2.78))).multiplyScalar(0.35);
        setLiver(st.ret); setGB(); rebuild();
        M.light = lap ? [0.34, 0.24, 0.1] : null; scope.intensity = lap ? 1.15 : 0; back.visible = lap;
        lvSetOp(liverM, acc ? 0.3 : lap ? 1 : 0.5); intra.forEach(function (x) { x.visible = !lap; });
        var so = 1 - st.out; lvSetOp(gbM, (acc ? 0.5 : lap ? 1 : 0.85) * so); gb.visible = so > 0.01;
        // płytka pęcherzykowa: widoczna tam, gdzie pęcherzyk już oddzielono (t powyżej frontu thr)
        var pcA = plG.attributes.color.array, plP = plG.attributes.position.array, plC = new V3(), plW = 0;
        for (var i = 0; i < plT.length; i++) { var al = (m > 0.5 ? 0.92 : 0) * sm((plT[i] - st.thr) / 0.07) * sm((0.24 - plD[i]) / 0.16) * (acc ? 0 : 1); pcA[4 * i + 3] = al;   // brzeg dołu wygaszony
          if (al > 0.5 && plT[i] < 0.95) { plC.x += plP[3 * i]; plC.y += plP[3 * i + 1]; plC.z += plP[3 * i + 2]; plW++; } }
        if (plW) plC.multiplyScalar(1 / plW);
        plG.attributes.color.needsUpdate = true;
        var cs = setTriangle(); placeClips();
        var nP = gbP(REST.node, H.tNode); node.position.copy(nP); lvSetOp(mNode, so); node.visible = so > 0.01;
        clips.forEach(function (K) { K.g.visible = m >= K.at && (!K.spec || so > 0.01) && !acc; });
        setWindow(cs, m > 0.97 && m < 1.04);
        // narzędzia
        [G1, G2, WD, WH].forEach(function (I) { I.g.visible = false; });
        if (lap && st.ret > 0.05 && st.out < 0.95) {
          var r = st.ret, fT = gbP(REST.fund, 0), hT = gbP(REST.hart, 0.86);
          G1.g.visible = G2.g.visible = true;
          placeI(G1, PORTS[3], PORTS[3].clone().lerp(fT, 0.55 + 0.45 * r), 0.15); placeI(G2, PORTS[2], PORTS[2].clone().lerp(hT, 0.55 + 0.45 * r), 0.12);
          var W = null, tip = null, op = 0;
          if (m > 0.3 && m < 0.97) { W = WD; var uu = 0.55 + 0.2 * Math.sin(9 * m), vv = 0.5 + 0.2 * Math.cos(7 * m); tip = cs.P[Math.round(vv * NVv) * (NU + 1) + Math.round(uu * NU)].clone().addScaledVector(FRONT.clone().sub(triCtr).normalize(), 0.3); op = 0.5 + 0.5 * Math.sin(14 * m); }
          else if (m > 1.03 && m < 1.62) { W = WD; var ci = clips.filter(function (K) { return m < K.at + 0.1; })[0] || clips[clips.length - 1]; tip = ci.g.position.clone().addScaledVector(FRONT.clone().sub(ci.g.position).normalize(), 0.2); op = 0.35 * (1 - sm((m - ci.at + 0.06) / 0.06)); }
          else if (m >= 1.62 && m < 1.95) { W = WD; var cA2 = m < 1.78 ? cur.fD.getPointAt(H.CLIPS.duct.cut) : cur.fA.getPointAt(H.CLIPS.art.cut); tip = cA2.addScaledVector(FRONT.clone().sub(cA2).normalize(), 0.15); op = 0.45 * Math.abs(Math.sin(18 * m)); }
          else if (m >= 2.0 && m < 2.78) { W = WH; var tf = Math.max(0, st.thr); tip = gbP(onGB(tf, medialDir(tf).negate().add(new V3(0, 0.6, -0.4)).normalize(), 1.0), tf); }
          if (W) { W.g.visible = true; placeI(W, PORTS[1], tip, op); }
        }
        // podpisy
        fixedL.forEach(function (F) { put(F.L, F.p, !acc && (!F.ext || !lap)); });
        put(Lrv, X3(H.retLiver(H.ROUV[1], st.ret)), lap && m > 0.32 && m < 0.97);
        put(Lgb, gbP(axisRest(0.25).toArray(), 0.25), !acc && so > 0.5 && !(m > 0.97 && m < 1.04));
        put(Lhp, gbP(REST.hart, 0.86), lap && m < 0.97);
        var cd = cur.duct, ca = cur.art;
        put(Lcd, cd.getPointAt(0.45), !acc && m < 1.7);
        put(Lca, ca.getPointAt(0.55), !acc && m > 0.6 && m < 1.85);
        put(Ltri, triCtr.clone(), !acc && m < 0.55);
        put(Lnode, nP.clone(), !acc && !lap || (m > 0.32 && m < 0.95));
        put(Lpl, plC, plW > 0 && m > 0.85 && m < 1.04);
        put(Lwin, triCtr.clone().lerp(cs.P[NVv * (NU + 1) + Math.floor(NU / 2)], 0.35), m > 0.97 && m < 1.04);
        put(Lcvs, cd.getPointAt(0.12).lerp(ca.getPointAt(0.9), 0.5), m >= 0.98 && m < 1.04);
        put(Lclip, cd.getPointAt(0.75), m >= 1.1 && m < 1.7);
        put(Lsd, cur.fD.getPointAt(0.85), m >= 1.75);
        put(Lsa, cur.fA.getPointAt(0.2), m >= 1.9);
        put(Lbed, plC, plW > 0 && m >= 2.85);
      } };
    return tool;
  }
  TOOL_EXT.chole = makeChole;
