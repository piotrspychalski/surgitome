  /* ---------- PRZESZCZEPIENIE NERKI (TOOL_EXT.ktx): prawy dół biodrowy (ANAT.KTX) w układzie ANAT.BODY.
     Powłoki: pas wokół cięcia Gibsona (współrzędne a — wzdłuż cięcia, b — odległość od linii cięcia, osobno dla obu brzegów) w warstwach ANAT.WALL.T:
     skóra z tkanką podskórną, mięsień skośny zewnętrzny, skośny wewnętrzny, poprzeczny, powięź poprzeczna — kolejno rozchylane; poza pasem skóra
     podbrzusza (przesunięta w głąb bufora głębi — w miejscu styku wygrywa pas). Otrzewna odsuwana przyśrodkowo. Głębiej: aorta, IVC, naczynia biodrowe,
     mięśnie lędźwiowy i biodrowy, kości (grzebień biodrowy, gałąź łonowa), pęcherz, moczowód własny, naczynia nabrzuszne dolne (podwiązane i przecięte).
     Nerka dawcy (grupa kid, układ u, v, w z ANAT.KTX.KID) z miedniczką; tętnica, żyła i moczowód przeszczepu — rury przebudowywane między położeniem
     „wolnym” (z nerką na stole) a zespoleniem (koniec na ścianie naczynia biorcy / pęcherza). Warianty: d.art (carrel / nopatch / iia), d.vein (std / ext),
     d.ure (lg / pl), d.side (L — miedniczka z przodu, R — żyła z przodu). Stan z osi czasu m (stateAt). ---------- */
  function makeKtx(d) {
    var K = A.KTX, B = A.BODY, C = K.COL, WT = B.T;   // grubości warstw — wspólny model ściany (ANAT.BODY)
    var grp = new THREE.Group(), labels = [], dyn = [], LEFT = d.side === 'L';
    function v3(a) { return new V3(a[0], a[1], a[2]); }
    function mat(col, o) {
      o = o || {};
      var m = track(new THREE.MeshStandardMaterial({ color: o.vc ? '#ffffff' : col, vertexColors: !!o.vc, roughness: o.rough == null ? 0.6 : o.rough, metalness: o.metal || 0,
        side: o.side || THREE.DoubleSide, transparent: true, opacity: o.op == null ? 1 : o.op, depthWrite: o.dw == null ? true : o.dw, emissive: new THREE.Color(o.em || '#000000') }));
      m.userData.op = o.op == null ? 1 : o.op; return m;
    }
    function setOp(m, op) { m.opacity = op; var t = op < 0.97; if (t !== m._t) { m._t = t; m.depthWrite = !t; m.needsUpdate = true; } }
    function cv(pts) { return new THREE.CatmullRomCurve3(pts.map(function (p) { return p.isVector3 ? p.clone() : v3(p); }), false, 'centripetal'); }
    function tubeGeo(pts, r0, r1, rad, caps) {
      var c = cv(pts), rf = typeof r0 === 'function' ? r0 : function (t) { return r0 + (r1 - r0) * t; };
      return A.buildTube(c, rf, Math.max(10, Math.round(c.getLength() * 5)), rad || 10, caps === undefined ? true : caps);
    }
    function tube(pts, r0, r1, m, rad, caps) { var g = track(tubeGeo(pts, r0, r1, rad, caps)), mesh = new THREE.Mesh(g, m); grp.add(mesh); return mesh; }
    // rura przebudowywana (geometria wymieniana, stara usuwana)
    function dtube(m) { var mesh = new THREE.Mesh(new THREE.BufferGeometry(), m); grp.add(mesh); dyn.push(mesh); return mesh; }
    function setTube(mesh, pts, r0, r1, rad, caps) { mesh.geometry.dispose(); mesh.geometry = tubeGeo(pts, r0, r1, rad, caps); }
    track({ dispose: function () { dyn.forEach(function (x) { x.geometry.dispose(); }); } });
    function sampleAt(c, t) { return c.getPointAt(Math.max(0, Math.min(1, t))); }

    /* =================== powłoki: pas cięcia Gibsona =================== */
    var GC = new THREE.CatmullRomCurve3(K.GIBSON.map(function (p) { return new V3(p[0], p[1], 0); }), false, 'centripetal'), AE = 0.38, BW = 5.6;
    function inc2(a) {   // punkt i normalna (2D) cięcia; poza [0, 1] przedłużenie styczną
      var aa = Math.max(0, Math.min(1, a)), P = GC.getPointAt(aa), T = GC.getTangentAt(aa);
      if (a < 0) P.addScaledVector(T, a * GC.getLength()); else if (a > 1) P.addScaledVector(T, (a - 1) * GC.getLength());
      return { P: P, N: new V3(-T.y, T.x, 0) };   // N — ku górze i przyśrodkowo (pępek)
    }
    var INC = []; for (var ia = 0; ia <= 240; ia++) { var aa0 = -AE + (1 + 2 * AE) * ia / 240; INC.push({ a: aa0, q: inc2(aa0) }); }
    function abOf(x, y) {   // (a, b ze znakiem) dla punktu skóry
      var best = 1e9, bi = 0;
      for (var i = 0; i < INC.length; i++) { var dx = x - INC[i].q.P.x, dy = y - INC[i].q.P.y, dd = dx * dx + dy * dy; if (dd < best) { best = dd; bi = i; } }
      var q = INC[bi].q; return [INC[bi].a, (x - q.P.x) * q.N.x + (y - q.P.y) * q.N.y];
    }
    function prof(a) { return a <= 0 || a >= 1 ? 0 : Math.pow(Math.sin(Math.PI * a), 0.55); }
    var D0 = { skin: 0, eo: WT.skin + WT.fat, io: WT.skin + WT.fat + WT.eo, ta: WT.skin + WT.fat + WT.eo + WT.io, tf: WT.skin + WT.fat + WT.eo + WT.io + WT.ta };
    D0.per = D0.tf + WT.tf + WT.pre;
    var NA = MOBILE ? 46 : 64, NB = 14, wall = [];
    function nb(j) { return BW * Math.pow(j / NB, 1.7); }
    function pt2(a, b, s, o, wl) { var q = inc2(a), bb = b + o * wl * 1.7 * prof(a) * Math.exp(-b / 1.9), y = q.P.y + s * q.N.y * bb, w = B.W(y) * 0.985; return [Math.max(-w, Math.min(w, q.P.x + s * q.N.x * bb)), y]; }   // w obrębie sylwetki (jak skóra podbrzusza)
    var mSkin = mat('#e2b59c', { rough: 0.82 }), mFat = mat('#f0d384', { rough: 0.85 });
    // kolor warstwy mięśniowej: przyśrodkowo rozcięgno (pochewka mięśnia prostego), bocznie brzusiec
    var APO = new THREE.Color('#ece3d1'), MUS = new THREE.Color('#b65046'), MUS2 = new THREE.Color('#a8443d'), TFC = new THREE.Color('#ddd0b4');
    function layerCol(id, x, y) {
      var rl = B.rectLat(y), ax = -x, c = new THREE.Color();
      if (id === 'eo') return c.copy(APO).lerp(MUS, sm((ax - B.eoApo(y)) / 0.6));
      if (id === 'io') return c.copy(APO).lerp(MUS, sm((ax - rl - 0.3) / 0.5));
      if (id === 'ta') return c.copy(APO).lerp(MUS2, sm((ax - rl - 0.8) / 0.5));
      return c.copy(TFC);
    }
    function bandLayer(id, dTop, dBot, wl, topMat, faceMat) {
      var L = { id: id, wl: wl, sides: [] };
      [1, -1].forEach(function (s) {
        var nv = (NA + 1) * (NB + 1), g = track(new THREE.BufferGeometry()), idx = [];
        g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nv * 3), 3));
        if (!topMat) g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(nv * 3), 3));
        for (var j = 0; j < NB; j++) for (var i = 0; i < NA; i++) { var p0 = j * (NA + 1) + i, p1 = p0 + NA + 1; if (s > 0) idx.push(p0, p0 + 1, p1, p1, p0 + 1, p1 + 1); else idx.push(p0, p1, p0 + 1, p1, p1 + 1, p0 + 1); }   // ściany zwrócone na zewnątrz po obu stronach cięcia
        g.setIndex(idx);
        var top = new THREE.Mesh(g, topMat || mat('#ffffff', { vc: true, rough: 0.7 })); grp.add(top);
        // ściana rany (przekrój warstwy) wzdłuż brzegu b = 0, tylko w zasięgu cięcia
        var nf = 40, fg = track(new THREE.BufferGeometry()), fi = [];
        fg.setAttribute('position', new THREE.BufferAttribute(new Float32Array((nf + 1) * 6), 3));
        for (var q = 0; q < nf; q++) { var a0 = 2 * q; fi.push(a0, a0 + 1, a0 + 2, a0 + 1, a0 + 3, a0 + 2); }
        fg.setIndex(fi); var face = new THREE.Mesh(fg, faceMat); grp.add(face);
        L.sides.push({ s: s, g: g, top: top, fg: fg, face: face, nf: nf });
      });
      L.update = function (o) {
        if (L.o === o) return; L.o = o;
        L.sides.forEach(function (S2) {
          var P = S2.g.attributes.position.array, Cc = S2.g.attributes.color ? S2.g.attributes.color.array : null, k = 0;
          for (var j = 0; j <= NB; j++) for (var i = 0; i <= NA; i++) {
            var a = -AE + (1 + 2 * AE) * i / NA, xy = pt2(a, nb(j), S2.s, o, L.wl), p = B.at(xy[0], xy[1], dTop, 0);
            P[k * 3] = p.x; P[k * 3 + 1] = p.y; P[k * 3 + 2] = p.z;
            if (Cc && L.colDone !== true) { var cc = layerCol(id, xy[0], xy[1]); Cc[k * 3] = cc.r; Cc[k * 3 + 1] = cc.g; Cc[k * 3 + 2] = cc.b; }
            k++;
          }
          S2.g.attributes.position.needsUpdate = true; if (Cc) S2.g.attributes.color.needsUpdate = true; S2.g.computeVertexNormals(); S2.g.computeBoundingSphere();
          if (id === 'skin') { var Nn = S2.g.attributes.normal.array, k2 = 0; for (var j3 = 0; j3 <= NB; j3++) for (var i3 = 0; i3 <= NA; i3++) { var xy3 = pt2(-AE + (1 + 2 * AE) * i3 / NA, nb(j3), S2.s, o, L.wl), n3 = B.nrm(xy3[0], xy3[1], 0); Nn[k2 * 3] = n3.x; Nn[k2 * 3 + 1] = n3.y; Nn[k2 * 3 + 2] = n3.z; k2++; } S2.g.attributes.normal.needsUpdate = true; }
          var F = S2.fg.attributes.position.array;
          for (var q = 0; q <= S2.nf; q++) {
            var aq = q / S2.nf, e = pt2(aq, 0, S2.s, o, L.wl), t1 = B.at(e[0], e[1], dTop, 0), t2 = B.at(e[0], e[1], dBot, 0);
            F.set([t1.x, t1.y, t1.z, t2.x, t2.y, t2.z], q * 6);
          }
          S2.fg.attributes.position.needsUpdate = true; S2.fg.computeVertexNormals(); S2.fg.computeBoundingSphere();
          S2.face.visible = o > 0.02;
        });
        L.colDone = true;
      };
      wall.push(L); return L;
    }
    var mEOf = mat('#b65046', { rough: 0.7 }), mIOf = mat('#a8443d', { rough: 0.7 }), mTAf = mat('#9c3f39', { rough: 0.7 }), mTFf = mat('#d8c9ad', { rough: 0.7 });
    var LSK = bandLayer('skin', 0, D0.eo - 0.02, 1.0, mSkin, mFat), LEO = bandLayer('eo', D0.eo, D0.io - 0.01, 0.9, null, mEOf), LIO = bandLayer('io', D0.io, D0.ta - 0.01, 0.82, null, mIOf),
      LTA = bandLayer('ta', D0.ta, D0.tf - 0.01, 0.76, null, mTAf), LTF = bandLayer('tf', D0.tf, D0.tf + WT.tf + 0.03, 0.7, null, mTFf);
    // skóra podbrzusza poza pasem (orientacja), krawędzie zanikające
    var mBody = mat('#ffffff', { vc: true, rough: 0.82 }); mBody.polygonOffset = true; mBody.polygonOffsetFactor = 2; mBody.polygonOffsetUnits = 4;
    var bodyMesh = (function () {
      var X0 = -11.8, X1 = 5.5, Y0 = -17.4, Y1 = -0.8, nx = MOBILE ? 70 : 96, ny = MOBILE ? 64 : 86, P = [], NRM = [], Cc = [], idx = [], g = track(new THREE.BufferGeometry()), base = new THREE.Color('#e2b59c'), inb = [];
      for (var j = 0; j <= ny; j++) for (var i = 0; i <= nx; i++) {
        var y = Y0 + (Y1 - Y0) * j / ny, x0 = X0 + (X1 - X0) * i / nx, w = B.W(y) * 0.99, x = Math.max(-w, Math.min(w, x0));
        var p = B.at(x, y, 0, 0); P.push(p.x, p.y, p.z); var n0 = B.nrm(x, y, 0); NRM.push(n0.x, n0.y, n0.z);
        var al = sm((x0 - X0) / 1.4) * sm((X1 - x0) / 2.5) * sm((y - Y0) / 1.2) * sm((Y1 - y) / 2.5) * sm((w - Math.abs(x0)) / 1.6);
        Cc.push(base.r, base.g, base.b, al); var ab = abOf(x, y); inb.push(ab[0] > -AE + 0.03 && ab[0] < 1 + AE - 0.03 && Math.abs(ab[1]) < BW - 0.8);
      }
      for (var j2 = 0; j2 < ny; j2++) for (var i2 = 0; i2 < nx; i2++) { var a0 = j2 * (nx + 1) + i2, b0 = a0 + nx + 1; if (!(inb[a0] && inb[a0 + 1] && inb[b0] && inb[b0 + 1])) idx.push(a0, a0 + 1, b0, b0, a0 + 1, b0 + 1); }
      g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(Cc, 4)); g.setAttribute('normal', new THREE.Float32BufferAttribute(NRM, 3)); g.setIndex(idx);
      var mm = new THREE.Mesh(g, mBody); grp.add(mm); return mm;
    })();
    // linie: planowane cięcie (przerywana), cięcie skóry (rysowane), nacięcia warstw
    var mCut = mat(A.COL.cut, { em: A.COL.cut, rough: 0.5 }); mCut.emissiveIntensity = 0.3;
    function incPts(dep, n) { var o = []; for (var i = 0; i <= (n || 60); i++) { var q = inc2(i / (n || 60)); o.push(B.at(q.P.x, q.P.y, dep, 0)); } return o; }
    var plan = new THREE.Group(); grp.add(plan);
    (function () { var P = incPts(-0.05, 120); for (var s = 0; s < 120; s += 8) plan.add(new THREE.Mesh(track(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P.slice(s, s + 5)), 6, 0.065, 6, false)), mCut)); })();
    var incL = new THREE.Mesh(track(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(incPts(-0.05)), 80, 0.07, 8, false)), mCut); grp.add(incL);
    var eoL = new THREE.Mesh(track(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(incPts(D0.eo - 0.04)), 80, 0.06, 8, false)), mCut); grp.add(eoL);
    var muL = new THREE.Mesh(track(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(incPts(D0.io - 0.04)), 80, 0.06, 8, false)), mCut); grp.add(muL);
    // punkty orientacyjne na skórze
    var mLm = mat('#7d6152', { rough: 0.6 }), lmDots = [];
    [B.LM.asisR, B.LM.pubis].forEach(function (p) { var s = new THREE.Mesh(track(new THREE.SphereGeometry(0.16, 12, 9)), mLm); s.position.copy(B.at(p[0], p[1], -0.04, 0)); grp.add(s); lmDots.push(s); });
    var ingL = new THREE.Mesh(track(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(B.LM.ingR.concat([[-0.2, -15.5]]).map(function (p) { return B.at(p[0], p[1], -0.03, 0); })), 40, 0.045, 6, false)), mLm); grp.add(ingL);
    var umb = new THREE.Mesh(track(new THREE.TorusGeometry(0.32, 0.07, 6, 20)), mLm); umb.position.copy(B.at(0, -5.5, -0.02, 0)); umb.quaternion.setFromUnitVectors(new V3(0, 0, 1), B.nrm(0, -5.5, 0)); grp.add(umb);

    var nWall = grp.children.length;   // dalej struktury głębokie (grupa deepG — niewidoczne, dopóki rana jest zamknięta)
    /* =================== otrzewna: odsuwana przyśrodkowo =================== */
    var PX = [-10.4, -0.6], PY = [-13.6, -4.4], PNX = 36, PNY = 30, mPer = mat(C.per, { op: 0.5, dw: false, rough: 0.5 });
    var perG = track(new THREE.BufferGeometry()); (function () {
      var idx = []; perG.setAttribute('position', new THREE.BufferAttribute(new Float32Array((PNX + 1) * (PNY + 1) * 3), 3));
      for (var j = 0; j < PNY; j++) for (var i = 0; i < PNX; i++) { var a0 = j * (PNX + 1) + i, b0 = a0 + PNX + 1; idx.push(a0, a0 + 1, b0, b0, a0 + 1, b0 + 1); }
      perG.setIndex(idx);
    })();
    var perMesh = new THREE.Mesh(perG, mPer); grp.add(perMesh);
    function perUpdate(f) {
      if (perMesh.f === f) return; perMesh.f = f;
      var P = perG.attributes.position.array, k = 0;
      for (var j = 0; j <= PNY; j++) for (var i = 0; i <= PNX; i++) {
        var u = i / PNX, y = PY[0] + (PY[1] - PY[0]) * j / PNY, x0 = PX[0] + (PX[1] - PX[0]) * u;
        // odsunięty worek: część boczna zebrana w fałd przy brzegu przyśrodkowym (xE), uniesiony ku przodowi przez hak
        var xE = -2.2 + 0.5 * sm((y + 9) / 4), x1 = xE + (PX[1] - xE) * Math.pow(u, 1.6), x = x0 + (x1 - x0) * f;
        var p = B.at(x, y, D0.per + 0.02, 0), lift = f * 1.1 * Math.exp(-Math.pow((x - xE - 0.4) / 0.9, 2));
        P[k * 3] = p.x; P[k * 3 + 1] = p.y; P[k * 3 + 2] = p.z + lift - f * 0.25; k++;
      }
      perG.attributes.position.needsUpdate = true; perG.computeVertexNormals(); perG.computeBoundingSphere();
    }

    /* =================== mięśnie, kości =================== */
    var mMus = mat(C.mus, { rough: 0.8, op: 0.75, dw: false }), mIl = mat('#ffffff', { vc: true, rough: 0.8, dw: false }), mBone = mat(C.bone, { rough: 0.6, op: 0.55, dw: false });
    tube(K.PSOAS.pts, function (t) { return K.PSOAS.r[0] + (K.PSOAS.r[1] - K.PSOAS.r[0]) * t; }, null, mMus, 14);
    (function () {   // mięsień biodrowy w dole biodrowym (z(x, y)), zanikający przy brzegach
      var nx = 30, ny = 30, P = [], Cc = [], idx = [], g = track(new THREE.BufferGeometry()), c0 = new THREE.Color('#b9877a');
      for (var j = 0; j <= ny; j++) for (var i = 0; i <= nx; i++) {
        var x = K.ILIAC.x[0] + (K.ILIAC.x[1] - K.ILIAC.x[0]) * i / nx, y = K.ILIAC.y[0] + (K.ILIAC.y[1] - K.ILIAC.y[0]) * j / ny;
        P.push(x, y, K.iliacZ(x, y)); Cc.push(c0.r, c0.g, c0.b, 0.5 * sm(i / nx / 0.12) * sm((1 - i / nx) / 0.12) * sm(j / ny / 0.1) * sm((1 - j / ny) / 0.18));
      }
      for (var j2 = 0; j2 < ny; j2++) for (var i2 = 0; i2 < nx; i2++) { var a0 = j2 * (nx + 1) + i2, b0 = a0 + nx + 1; idx.push(a0, a0 + 1, b0, b0, a0 + 1, b0 + 1); }
      g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(Cc, 4)); g.setIndex(idx); g.computeVertexNormals();
      grp.add(new THREE.Mesh(g, mIl));
    })();
    tube(K.PUBIS, 0.32, 0.26, mBone, 10);

    /* =================== naczynia biorcy =================== */
    var mArt = mat(C.art, { rough: 0.45 }), mVein = mat(C.vein, { rough: 0.45 }), mArtF = mat(C.art, { rough: 0.45, op: 0.55 }), mVeinF = mat(C.vein, { rough: 0.45, op: 0.55 });
    function vessel(V, m) { return tube(V.pts, V.r[0], V.r[1], m, 12); }
    vessel(K.AO, mArt); vessel(K.IVC, mVein); vessel(K.CIA, mArt); vessel(K.CIAL, mArtF); vessel(K.CIV, mVein); vessel(K.CIVL, mVeinF);
    var cEIA = cv(K.EIA.pts), cEIV = cv(K.EIV.pts), cIIA = cv(K.IIA.pts);
    vessel(K.EIA, mArt); vessel(K.EIV, mVein); vessel(K.IIV, mVein);
    function rAt(V, t) { return V.r[0] + (V.r[1] - V.r[0]) * t; }
    // tętnica biodrowa wewnętrzna: w wariancie iia dzielona (część bliższa odwracana ku nerce, obwodowa podwiązana)
    var iiaProx = null, iiaDist = null, tc = K.AT.iiaCut;
    if (d.art === 'iia') {
      var dP = []; for (var q0 = 0; q0 <= 12; q0++) dP.push(sampleAt(cIIA, tc + 0.05 + (1 - tc - 0.05) * q0 / 12));
      iiaDist = tube(dP, rAt(K.IIA, tc), K.IIA.r[1], mArt, 12); iiaProx = dtube(mArt);
    } else vessel(K.IIA, mArt);
    // moczowód własny
    var mUre = mat(C.ure, { rough: 0.5 }); tube(K.URN, 0.15, 0.15, mUre, 8);
    // naczynia nabrzuszne dolne: przecięte w miejscu skrzyżowania z cięciem (po podwiązaniu końce odsuwają się)
    var cIEA = cv(K.IEA), tIx = (function () { var best = 9, bt = 0.4; for (var i = 0; i <= 200; i++) { var p = cIEA.getPointAt(i / 200), ab = abOf(p.x, p.y); if (Math.abs(ab[1]) < best && ab[0] > 0 && ab[0] < 1) { best = Math.abs(ab[1]); bt = i / 200; } } return bt; })();
    var mEA = mat(C.art, { rough: 0.45 }), mEV = mat(C.vein, { rough: 0.45 }), iep = [dtube(mEA), dtube(mEA), dtube(mEV), dtube(mEV)], mLig = mat('#22262b', { rough: 0.5 });
    var ligs = [0, 1, 2, 3].map(function () { var r = new THREE.Mesh(track(new THREE.TorusGeometry(0.15, 0.05, 6, 16)), mLig); grp.add(r); return r; });
    function iepUpdate(f) {
      if (iep.f === f) return; iep.f = f;
      var g = 0.04 + 0.2 * f;
      [[mEA, 0, 0], [mEV, 2, 0.2]].forEach(function (z) {
        var off = new V3(-z[2], 0, 0), a = [], b = [];
        for (var i = 0; i <= 10; i++) { a.push(cIEA.getPointAt(Math.max(0, tIx - g) * i / 10).add(off)); b.push(cIEA.getPointAt(Math.min(1, tIx + g) + (1 - Math.min(1, tIx + g)) * i / 10).add(off)); }
        setTube(iep[z[1]], a, 0.085, 0.075, 8, [false, f > 0]); setTube(iep[z[1] + 1], b, 0.075, 0.06, 8, [f > 0, false]);
        var ea = a[a.length - 1], eb = b[0], ta = cIEA.getTangentAt(Math.max(0, tIx - g));
        [ligs[z[1]], ligs[z[1] + 1]].forEach(function (L, k) { L.position.copy(k ? eb : ea).addScaledVector(ta, k ? 0.12 : -0.12); L.quaternion.setFromUnitVectors(new V3(0, 0, 1), ta); L.visible = f > 0.05; });
      });
    }

    /* =================== pęcherz =================== */
    var BC = v3(K.BLAD.c), BR = v3(K.BLAD.r), mBl = mat(C.blad, { rough: 0.55, op: 0.85 });
    var blad = new THREE.Mesh(track(new THREE.SphereGeometry(1, 40, 28)), mBl); blad.position.copy(BC); blad.scale.copy(BR); grp.add(blad);
    function bladP(dir, off) { var dd = dir.clone().normalize(), t = 1 / Math.sqrt(Math.pow(dd.x / BR.x, 2) + Math.pow(dd.y / BR.y, 2) + Math.pow(dd.z / BR.z, 2)), p = BC.clone().addScaledVector(dd, t); if (off) p.addScaledVector(bladN(p), off); return p; }
    function bladN(p) { return new V3((p.x - BC.x) / (BR.x * BR.x), (p.y - BC.y) / (BR.y * BR.y), (p.z - BC.z) / (BR.z * BR.z)).normalize(); }

    /* =================== nerka dawcy =================== */
    var KD = K.KID, KC = v3(KD.c), KU = v3(KD.u), KV = v3(KD.v), KW = v3(KD.w), BEN = v3(K.BENCH);
    var kid = new THREE.Group(); grp.add(kid);
    var basis = new THREE.Matrix4().makeBasis(KU, KV, KW); kid.quaternion.setFromRotationMatrix(basis);   // lokalne x = u, y = v, z = w
    var mKid = mat(C.kid0, { rough: 0.38 }), mKidH = mat('#e9d6a0', { rough: 0.6 });
    var kidMesh = (function () {   // fasola: elipsoida z zatoką we wnęce (strona +v)
      var g = track(new THREE.SphereGeometry(1, MOBILE ? 44 : 60, MOBILE ? 30 : 40)), P = g.attributes.position;
      for (var i = 0; i < P.count; i++) {
        var sx = P.getX(i), sy = P.getY(i), sz = P.getZ(i), u = KD.a * sy, v = KD.b * sx, w = KD.t * sz;
        if (sx > 0) v -= KD.b * 0.66 * Math.exp(-Math.pow(u / 1.45, 2)) * Math.exp(-Math.pow(sz / 0.78, 2)) * Math.pow(sx, 1.3);
        P.setXYZ(i, u, v, w);
      }
      g.computeVertexNormals(); var mm = new THREE.Mesh(g, mKid); kid.add(mm); return mm;
    })();
    // tłuszcz zatoki nerkowej (we wnęce)
    var sinus = new THREE.Mesh(track(new THREE.SphereGeometry(1, 20, 14)), mKidH); sinus.scale.set(0.95, 0.42, 0.5); sinus.position.set(0.05, KD.b * 0.3, 0); kid.add(sinus);
    function kl(u, v, w) { return new V3(u, v, w).applyQuaternion(kid.quaternion).add(kid.position); }   // punkt lokalny → model
    var WS = KD.ant || 1, WP = (LEFT ? 0.5 : -0.5) * WS, WV = (LEFT ? -0.42 : 0.42) * WS;   // miedniczka i żyła: z przodu albo z tyłu wnęki
    var HA = [0.42, KD.b * 0.5, 0.0], HV = [-0.05, KD.b * 0.48, WV], HP = [-0.45, KD.b * 0.5, WP];
    // miedniczka nerkowa (część pozanerkowa), w grupie nerki
    var mPel = mat(C.ure, { rough: 0.5 });
    var pelvis = new THREE.Mesh(track(tubeGeo([[0.1, KD.b * 0.3, WP * 0.8], [-0.2, KD.b * 0.52, WP], [-0.55, KD.b * 0.66, WP * 1.02], [-0.95, KD.b * 0.74, WP * 0.95]], function (t) { return 0.5 - 0.3 * t; }, null, 12, true)), mPel); kid.add(pelvis);
    var PEX = [-0.95, KD.b * 0.74, WP * 0.95];   // wyjście moczowodu z miedniczki (lokalnie)

    /* ---------- cele zespoleń (model) ---------- */
    function onWall(c, V, t, toward) {   // punkt na ścianie naczynia biorcy zwrócony ku punktowi toward
      var P = c.getPointAt(t), T = c.getTangentAt(t), n = toward.clone().sub(P); n.addScaledVector(T, -n.dot(T)).normalize();
      return { p: P.clone().addScaledVector(n, rAt(V, t)), n: n, T: T, c: P };
    }
    var KFIN = { pos: KC.clone(), q: kid.quaternion.clone() }, QBEN = kid.quaternion.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new V3(1, 0, 0), WS * 1.05));
    kid.position.copy(KC);
    var hvW = kl(HV[0], HV[1], HV[2]), haW = kl(HA[0], HA[1], HA[2]);
    var TV = onWall(cEIV, K.EIV, K.AT.eiv, hvW), TA = d.art === 'iia' ? null : onWall(cEIA, K.EIA, K.AT.eia, haW);
    // tętnica biodrowa wewnętrzna odwrócona: od odejścia łukiem ku przodowi i bocznie; koniec (zespolenie) naprzeciw tętnicy nerkowej
    var IIA_END = d.art === 'iia' ? haW.clone().lerp(sampleAt(cIIA, 0), 0.62).add(new V3(-0.2, -0.35, -0.25)) : null;
    function iiaPath(f) {
      var o = []; for (var i = 0; i <= 10; i++) {
        var u = i / 10, nat = sampleAt(cIIA, tc * u), sw = sampleAt(cIIA, 0).clone().lerp(IIA_END, u).add(new V3(-0.15, 0.25, 0.55).multiplyScalar(Math.sin(Math.PI * u)));
        o.push(nat.lerp(sw, f));
      }
      return o;
    }
    // moczowód: od miedniczki przed naczyniami ku pęcherzowi; miejsce zespolenia (Lich–Gregoir: przednio-boczna ściana; Politano–Leadbetter: hiatus w ścianie tylno-bocznej)
    var LG = d.ure === 'lg', SITE = LG ? bladP(new V3(-0.74, 0.42, 0.55)) : bladP(new V3(-0.95, 0.18, -0.25)), SN = bladN(SITE);
    var ORIF = bladP(new V3(-0.42, -0.62, -0.62), -0.14);   // nowe ujście (PL): przy trójkącie pęcherza, od środka
    var U1 = new V3(-4.55, -10.6, 3.0), U2 = new V3(-3.7, -11.5, 3.05);
    var IDIR = (function () { var t = SITE.clone().sub(U2); t.addScaledVector(SN, -t.dot(SN)); return t.normalize(); })();   // kierunek nacięcia (Lich–Gregoir) — wzdłuż przebiegu moczowodu
    function ureAttached() {
      var pex = kl(PEX[0], PEX[1], PEX[2]);
      if (LG) return [pex, U1, U2, SITE.clone().addScaledVector(IDIR, -1.25).addScaledVector(SN, 0.32), SITE.clone().addScaledVector(IDIR, -0.75).addScaledVector(SN, 0.08), SITE.clone().addScaledVector(IDIR, 0.1).addScaledVector(SN, -0.04), SITE.clone().addScaledVector(IDIR, 0.72).addScaledVector(SN, -0.06)];
      var out = SITE.clone().addScaledVector(SN, 0.6), o = [pex, U1, U1.clone().lerp(out, 0.55).add(new V3(0, -0.35, 0.2)), out, SITE.clone().addScaledVector(SN, -0.05)];
      // tunel podśluzówkowy: wzdłuż wewnętrznej powierzchni od hiatusu ku nowemu ujściu
      var d0 = SITE.clone().sub(BC), d1 = ORIF.clone().sub(BC);
      for (var i = 1; i <= 5; i++) o.push(bladP(d0.clone().lerp(d1, i / 5), -0.12 - 0.04 * Math.sin(Math.PI * i / 5)));
      return o;
    }
    function urePre() { var at = ureAttached(); var pex = kl(PEX[0], PEX[1], PEX[2]); return [pex, U1, U2, U2.clone().lerp(SITE, 0.55).add(new V3(-0.3, 0.2, 0.55)), U2.clone().lerp(SITE, 0.85).add(new V3(-0.35, 0.3, 0.75))]; }
    // położenia „wolne” (na stole): lokalnie względem nerki
    function freeArt() { return [HA, [HA[0] + 0.05, HA[1] + 0.7, HA[2] - 0.05 * WS], [HA[0] - 0.05, HA[1] + 1.3, HA[2] - 0.1 * WS], [HA[0] - 0.12, HA[1] + 1.75, HA[2] - 0.12 * WS]]; }
    var VLEN = LEFT ? 2.6 : 1.05;   // żyła nerkowa: lewa długa, prawa krótka (+ przedłużenie z IVC dawcy ok. 2,2 j.)
    function freeVein(ext) { var L2 = VLEN + (ext ? 2.2 : 0), o = []; for (var i = 0; i <= 4; i++) { var u = i / 4; o.push([HV[0] - 0.4 * u * u, HV[1] + L2 * u, HV[2] - 0.08 * u * WS]); } return o; }
    function freeUre() { return [PEX, [PEX[0] - 1.2, PEX[1] + 0.4, PEX[2] + 0.05], [PEX[0] - 2.8, PEX[1] + 0.15, PEX[2] + 0.1], [PEX[0] - 4.4, PEX[1] - 0.2, PEX[2] + 0.05], [PEX[0] - 5.6, PEX[1] + 0.2, PEX[2]]]; }
    function toW(L) { return L.map(function (p) { return kl(p[0], p[1], p[2]); }); }
    function lerpPath(a, b, f, n) {   // dwie łamane → n punktów (po długości łuku)
      var ca = cv(a), cb = cv(b), o = []; for (var i = 0; i <= n; i++) o.push(ca.getPointAt(i / n).lerp(cb.getPointAt(i / n), f)); return o;
    }
    // tętnica nerkowa: koniec przy ścianie tętnicy biodrowej zewnętrznej (end-to-side) albo naprzeciw końca tętnicy biodrowej wewnętrznej (end-to-end)
    function artAttached() {
      var h = kl(HA[0], HA[1], HA[2]), m1 = kl(HA[0] + 0.05, HA[1] + 0.8, HA[2] - 0.05);
      if (d.art === 'iia') return [h, m1, m1.clone().lerp(IIA_END, 0.55), IIA_END.clone()];
      return [h, m1, m1.clone().lerp(TA.p, 0.5).addScaledVector(TA.n, 0.35), TA.p.clone().addScaledVector(TA.n, 0.42), TA.p.clone().addScaledVector(TA.n, d.art === 'carrel' ? 0.08 : 0.02)];
    }
    function veinAttached() {
      var h = kl(HV[0], HV[1], HV[2]), m1 = kl(HV[0] - 0.1, HV[1] + 0.8, HV[2]);
      return [h, m1, m1.clone().lerp(TV.p, 0.5).addScaledVector(TV.n, 0.5), TV.p.clone().addScaledVector(TV.n, 0.5), TV.p.clone().addScaledVector(TV.n, 0.02)];
    }
    var mRA = mat(C.art, { rough: 0.42 }), mRV = mat(C.vein, { rough: 0.42 }), mExt = mat('#2b4a8a', { rough: 0.5 }), mUreG = mat(C.ure, { rough: 0.45 });
    var rArt = dtube(mRA), rVein = dtube(mRV), rExt = d.vein === 'ext' ? dtube(mExt) : null, rUre = dtube(mUreG);
    var mPatch = mat('#d9a493', { rough: 0.5 }), patch = null;
    if (d.art === 'carrel') { patch = new THREE.Mesh(track(new THREE.CircleGeometry(1, 28)), mPatch); patch.scale.set(0.62, 0.42, 1); grp.add(patch); }
    // linia staplera na przedłużeniu z IVC
    var staple = null; if (rExt) { staple = new THREE.Group(); grp.add(staple); for (var si = 0; si < 9; si++) staple.add(new THREE.Mesh(track(new THREE.BoxGeometry(0.16, 0.05, 0.05)), mat('#c9ced4', { metal: 0.7, rough: 0.3 }))); }
    // JJ: cewnik w moczowodzie z zawinięciami w miedniczce i w pęcherzu
    var mJJ = mat('#2f78c4', { rough: 0.4 }), jj = dtube(mJJ), jjC = [0, 1].map(function () { var r = new THREE.Mesh(track(new THREE.TorusGeometry(0.3, 0.05, 6, 24, Math.PI * 1.6)), mJJ); grp.add(r); return r; });

    /* ---------- pierścienie zespoleń, nacięcia, zaciski ---------- */
    var rings = [];
    function ring(r, col, sx) { var mm = mat(col, { rough: 0.4, em: col }); mm.emissiveIntensity = 0.15; var m = new THREE.Mesh(track(new THREE.TorusGeometry(r, Math.max(0.045, r * 0.16), 8, 36)), mm); if (sx) m.scale.set(sx, 1, 1); grp.add(m); rings.push(m); return m; }
    function place(m, p, n, along) { m.position.copy(p); var q = new THREE.Quaternion().setFromUnitVectors(new V3(0, 0, 1), n.clone().normalize()); m.quaternion.copy(q); if (along) { var xa = new V3(1, 0, 0).applyQuaternion(q), a2 = along.clone().addScaledVector(n, -along.dot(n)).normalize(), ang = Math.atan2(new V3().crossVectors(xa, a2).dot(n), xa.dot(a2)); m.rotateZ(ang); } }
    var RINGC = '#f4f1e8';
    var rV = ring(0.4, RINGC, 1.5); place(rV, TV.p.clone().addScaledVector(TV.n, 0.03), TV.n, TV.T);
    var venot = ring(0.3, A.COL.cut, 1.9); place(venot, TV.p.clone().addScaledVector(TV.n, 0.02), TV.n, TV.T);
    var rA, artot = null;
    if (d.art === 'iia') { rA = ring(0.3, RINGC); }
    else { rA = ring(d.art === 'carrel' ? 0.66 : 0.3, RINGC, d.art === 'carrel' ? 1.5 : 1.3); place(rA, TA.p.clone().addScaledVector(TA.n, 0.04), TA.n, TA.T);
      artot = ring(d.art === 'carrel' ? 0.5 : 0.24, A.COL.cut, d.art === 'carrel' ? 1.6 : 1.0); place(artot, TA.p.clone().addScaledVector(TA.n, 0.02), TA.n, TA.T); }
    var rJ = rExt ? ring(0.36, RINGC) : null;   // połączenie żyły nerkowej z przedłużeniem (na stole)
    // tętnica biodrowa wewnętrzna: podwiązania kikuta obwodowego
    var iiaLig = d.art === 'iia' ? [0, 1].map(function (k) { var r = new THREE.Mesh(track(new THREE.TorusGeometry(0.28, 0.06, 6, 18)), mLig); place(r, sampleAt(cIIA, tc + 0.07 + k * 0.05), cIIA.getTangentAt(tc + 0.07 + k * 0.05)); grp.add(r); return r; }) : [];
    // zaciski naczyniowe: belka w poprzek naczynia
    var mClamp = mat('#3a3f45', { metal: 0.6, rough: 0.35 });
    function clamp(c, V, t) { var P = c.getPointAt(t), T = c.getTangentAt(t), m = new THREE.Mesh(track(new THREE.BoxGeometry(0.16, rAt(V, t) * 2 + 0.7, 0.22)), mClamp); m.position.copy(P); var side = new V3().crossVectors(T, new V3(0, 0, 1)).normalize(); m.quaternion.setFromUnitVectors(new V3(0, 1, 0), side); grp.add(m); return m; }
    var clV = [clamp(cEIV, K.EIV, K.AT.eiv - 0.12), clamp(cEIV, K.EIV, K.AT.eiv + 0.12)];
    var clA = d.art === 'iia' ? [] : [clamp(cEIA, K.EIA, K.AT.eia - 0.11), clamp(cEIA, K.EIA, K.AT.eia + 0.11)];
    var clI = d.art === 'iia' ? new THREE.Mesh(track(new THREE.BoxGeometry(0.16, 1.3, 0.22)), mClamp) : null; if (clI) grp.add(clI);
    // pęcherz: Lich–Gregoir — nacięcie mięśniówki, brzegi (wypieracz), uwypuklona śluzówka, szwy; Politano–Leadbetter — cystotomia, hiatus, nowe ujście
    var mDet = mat('#c97866', { rough: 0.6 }), mMuc = mat('#f3c7c2', { rough: 0.45 }), mSut = mat('#22305c', { rough: 0.5 });
    var IB = new V3().crossVectors(SN, IDIR).normalize();
    var detL = [dtube(mDet), dtube(mDet)], muc = null, sut = new THREE.Group(), incB = null, cysto = null, hiat = null, orif = null, cysL = null;
    grp.add(sut);
    if (LG) {
      muc = new THREE.Mesh(track(new THREE.SphereGeometry(1, 18, 12)), mMuc); muc.position.copy(SITE); place(muc, SITE, SN, IDIR); muc.scale.set(0.95, 0.2, 0.12); grp.add(muc);
      incB = new THREE.Mesh(track(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([-0.95, -0.3, 0.3, 0.95].map(function (s) { return bladP(SITE.clone().addScaledVector(IDIR, s).sub(BC), 0.03); })), 24, 0.05, 6, false)), mCut); grp.add(incB);
      for (var sti = 0; sti < 6; sti++) { var st = new THREE.Mesh(track(new THREE.TorusGeometry(0.2, 0.03, 5, 12, Math.PI)), mSut); place(st, SITE.clone().addScaledVector(IDIR, -0.75 + sti * 0.3).addScaledVector(SN, 0.12), IDIR, SN); st.rotateZ(Math.PI / 2); sut.add(st); }
    } else {
      var cyC = bladP(new V3(-0.15, 0.05, 1)), cyPts = [-1.1, -0.4, 0.4, 1.1].map(function (s) { return bladP(cyC.clone().add(new V3(0, s, 0)).sub(BC), 0.03); });
      cysto = new THREE.Mesh(track(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cyPts), 24, 0.055, 6, false)), mCut); grp.add(cysto);
      cysL = new THREE.Group(); grp.add(cysL);
      cyPts.slice(0, 3).forEach(function (p, i) { var st = new THREE.Mesh(track(new THREE.TorusGeometry(0.2, 0.03, 5, 12, Math.PI)), mSut); place(st, p.clone().lerp(cyPts[i + 1], 0.5).addScaledVector(bladN(p), 0.05), new V3(0, 1, 0), new V3(1, 0, 0)); cysL.add(st); });
      hiat = ring(0.24, '#4a1d1a'); place(hiat, SITE.clone().addScaledVector(SN, 0.02), SN);
      orif = ring(0.2, RINGC); place(orif, ORIF, bladN(ORIF).negate());
    }
    var rU = ring(0.22, RINGC); if (LG) place(rU, SITE.clone().addScaledVector(IDIR, 0.74).addScaledVector(SN, 0.02), SN, IDIR);
    else rings.splice(rings.indexOf(rU), 1), grp.remove(rU);

    var deepG = new THREE.Group(); grp.children.slice(nWall).forEach(function (c) { if (c !== kid) deepG.add(c); }); grp.add(deepG);
    /* ---------- stan zabiegu ---------- */
    function stateAt(m) {
      var s = {};
      s.inc = clamp01((m - 0.05) / 0.25); s.oSk = sm((m - 0.3) / 0.14); s.eoInc = clamp01((m - 0.44) / 0.07); s.oEO = sm((m - 0.5) / 0.1);
      s.muInc = clamp01((m - 0.58) / 0.06); s.oIO = sm((m - 0.63) / 0.1); s.oTA = sm((m - 0.66) / 0.1); s.oTF = sm((m - 0.76) / 0.07);
      s.iep = sm((m - 0.8) / 0.08); s.per = sm((m - 0.84) / 0.14);
      s.wall = 1 - sm((m - 0.965) / 0.035);                       // powłoki zanikają po odsłonięciu dołu biodrowego
      s.kidOn = sm((m - 1.0) / 0.12); s.move = sm((m - 1.5) / 0.42); s.ext = d.vein === 'ext' ? sm((m - 1.12) / 0.3) : 0;
      s.clV = m > 2.05 && m < 3.82 ? 1 : 0; s.venot = sm((m - 2.12) / 0.12) * (1 - sm((m - 2.55) / 0.06)); s.vein = sm((m - 2.3) / 0.35); s.rV = sm((m - 2.62) / 0.1);
      if (d.art === 'iia') { s.iiaLig = sm((m - 3.05) / 0.12); s.iiaCut = m > 3.2 ? 1 : 0; s.iiaSw = sm((m - 3.22) / 0.25); s.clA = m > 3.2 && m < 3.82 ? 1 : 0; }
      else { s.clA = m > 3.05 && m < 3.82 ? 1 : 0; s.artot = sm((m - 3.1) / 0.1) * (1 - sm((m - 3.45) / 0.06)); }
      s.art = sm((m - 3.3) / 0.28); s.rA = sm((m - 3.58) / 0.1); s.rep = sm((m - 3.82) / 0.16);
      s.urePre = s.move; s.ure = 0; s.jj = 0; s.rU = 0;
      if (LG) { s.det = clamp01((m - 4.08) / 0.15); s.detO = sm((m - 4.24) / 0.14) * (1 - sm((m - 4.76) / 0.16)); s.ure = sm((m - 4.42) / 0.22); s.jj = sm((m - 4.5) / 0.1); s.rU = sm((m - 4.62) / 0.08); s.sut = m > 4.85 ? 1 : 0; }
      else { s.cys = clamp01((m - 4.04) / 0.14); s.cysO = sm((m - 4.18) / 0.1) * (1 - sm((m - 4.8) / 0.12)); s.hiat = sm((m - 4.26) / 0.08); s.ure = sm((m - 4.36) / 0.28); s.jj = sm((m - 4.5) / 0.1); s.rU = sm((m - 4.68) / 0.08); s.sut = m > 4.9 ? 1 : 0; }
      return s;
    }

    /* ---------- etykiety ---------- */
    function lab(name, sub, col, kind, fn, when) { var o = { el: mkLabel(name, sub, col, kind), fn: fn, when: when, alpha: 0 }; labels.push(o); return o; }
    function win(a, b) { return function (st, m) { return m > a && m < b; }; }
    var AT0 = function (st, m) { return m <= 0.001; }, FOS = function (st, m) { return Math.abs(m - 1) < 0.001; }, POST = function (st, m) { return m > 4.999; };
    function on(c, V, t, dx) { return sampleAt(c, t).add(dx ? v3(dx) : new V3()); }
    function skinPt(x, y, dep) { return B.at(x, y, dep || 0, 0); }
    lab('Kolec biodrowy przedni górny', '', '#7d6152', 'ghost', function () { return skinPt(B.LM.asisR[0], B.LM.asisR[1], -0.1); }, AT0);
    lab('Spojenie łonowe', '', '#7d6152', 'ghost', function () { return skinPt(B.LM.pubis[0], B.LM.pubis[1], -0.1); }, AT0);
    lab('Pępek', '', '#7d6152', 'ghost', function () { return skinPt(0, -5.5, -0.1); }, AT0);
    lab('Więzadło pachwinowe', 'rzut na skórę', '#7d6152', 'ghost', function () { return skinPt(-5.6, -12.9, -0.05); }, AT0);
    lab('Cięcie Gibsona', 'ok. 12–15 cm', A.COL.cut, 'cut', function () { var q = inc2(0.62); return skinPt(q.P.x, q.P.y, -0.05); }, function (st, m) { return m < 0.3; });
    lab('Tkanka podskórna', '', '#c9a640', 'seg', function () { var e = pt2(0.5, 0, -1, 1, 1); return skinPt(e[0], e[1], 0.6); }, win(0.34, 0.5));
    lab('Mięsień skośny zewnętrzny', 'przyśrodkowo rozcięgno', '#a8443d', 'seg', function () { var e = pt2(0.62, 0.5, 1, 0.3, 0.9); return skinPt(e[0], e[1], D0.eo); }, win(0.42, 0.6));
    lab('Mięsień skośny wewnętrzny', '', '#a8443d', 'seg', function () { var e = pt2(0.6, 0.3, -1, 1, 0.82); return skinPt(e[0], e[1], D0.io); }, win(0.6, 0.76));
    lab('Mięsień poprzeczny brzucha', '', '#9c3f39', 'seg', function () { var e = pt2(0.72, 0.3, 1, 1, 0.76); return skinPt(e[0], e[1], D0.ta); }, win(0.64, 0.78));
    lab('Brzeg pochewki mięśnia prostego', 'nacięty, mięsień odsunięty przyśrodkowo', '#9b8f78', 'ghost', function () { var e = pt2(0.1, 0.6, 1, 1, 1); return skinPt(e[0], e[1], D0.eo); }, win(0.55, 0.78));
    lab('Naczynia nabrzuszne dolne', 'podwiązane i przecięte', C.art, 'seg', function () { return cIEA.getPointAt(Math.max(0, tIx - 0.12)); }, win(0.78, 0.98));
    lab('Otrzewna', 'odsunięta przyśrodkowo, nieotwarta', '#b07a72', 'seg', function () { var p = B.at(-2.5, -10.6, D0.per, 0); p.z += 0.9; return p; }, function (st, m) { return (m > 0.86 && m < 1.001) || (m > 1.001 && m < 1.4); });
    lab('Tętnica biodrowa wspólna', '', C.art, 'seg', function () { return on(cv(K.CIA.pts), K.CIA, 0.62); }, FOS);
    lab('Tętnica biodrowa zewnętrzna', '', C.art, 'seg', function () { return on(cEIA, K.EIA, 0.72); }, function (st, m) { return FOS(st, m) || (d.art !== 'iia' && m > 3.05 && m < 3.6); });
    lab('Tętnica biodrowa wewnętrzna', d.art === 'iia' ? 'podwiązana obwodowo i przecięta' : '', C.art, 'seg', function () { return on(cIIA, K.IIA, d.art === 'iia' ? 0.62 : 0.5); }, function (st, m) { return FOS(st, m) || (d.art === 'iia' && m > 3.12 && m < 3.62); });
    lab('Żyła biodrowa zewnętrzna', '', C.vein, 'seg', function () { return on(cEIV, K.EIV, 0.82); }, function (st, m) { return FOS(st, m) || (m > 2.05 && m < 2.6); });
    lab('Żyła biodrowa wewnętrzna', '', C.vein, 'ghost', function () { return on(cv(K.IIV.pts), K.IIV, 0.7); }, FOS);
    lab('Aorta', '', C.art, 'ghost', function () { return on(cv(K.AO.pts), K.AO, 0.3); }, FOS);
    lab('Żyła główna dolna', '', C.vein, 'ghost', function () { return on(cv(K.IVC.pts), K.IVC, 0.3); }, FOS);
    lab('Mięsień lędźwiowy większy', '', C.mus, 'ghost', function () { return on(cv(K.PSOAS.pts), K.PSOAS, 0.45, [-0.9, 0, 0.6]); }, FOS);
    lab('Pęcherz moczowy', 'wypełniony przez cewnik', '#b07a72', 'seg', function () { return bladP(new V3(0.1, 0.5, 0.86)); }, function (st, m) { return FOS(st, m) || (m > 4.0 && m < 4.3); });
    lab('Moczowód własny', 'krzyżuje rozwidlenie naczyń biodrowych', '#b8952e', 'ghost', function () { return cv(K.URN).getPointAt(0.3); }, FOS);
    var KNAME = LEFT ? 'Nerka lewa dawcy' : 'Nerka prawa dawcy';
    lab(KNAME, 'przygotowana na stole', '#8a5a4e', 'seg', function () { return kl(0.9, -KD.b * 0.7, KD.t * 0.6 * WS); }, win(1.12, 1.6));
    lab('Tętnica nerkowa', d.art === 'carrel' ? 'z łatą Carrela (ściana aorty)' : 'bez łaty, koniec przycięty skośnie', C.art, 'seg', function () { return grafts.art ? grafts.art.getPointAt(0.82) : null; }, function (st, m) { return (m > 1.12 && m < 1.6) || (m > 3.3 && m < 3.6); });
    lab('Żyła nerkowa', LEFT ? 'lewa — długa' : 'prawa — krótka', C.vein, 'seg', function () { return grafts.vein ? grafts.vein.getPointAt(LEFT ? 0.6 : 0.3) : null; }, function (st, m) { return (m > 1.12 && m < 1.6) || (m > 2.3 && m < 2.6); });
    if (rExt) lab('Przedłużenie z żyły głównej dolnej dawcy', 'zamknięte wzdłuż staplerem', '#2b4a8a', 'seg', function () { return grafts.vein ? grafts.vein.getPointAt(0.78) : null; }, function (st, m) { return (m > 1.3 && m < 1.6) || (m > 2.3 && m < 2.62); });
    lab('Miedniczka nerkowa', LEFT ? 'z przodu wnęki' : 'z tyłu wnęki', '#b8952e', 'seg', function () { return kl(-0.6, KD.b * 0.7, WP * 1.4); }, win(1.12, 1.6));
    lab('Moczowód przeszczepu', '', '#b8952e', 'seg', function () { return grafts.ure ? grafts.ure.getPointAt(0.5) : null; }, function (st, m) { return (m > 1.12 && m < 1.6) || (m > 4.4 && m < 4.62); });
    lab('Nerka przeszczepiona', 'pozaotrzewnowo, w dole biodrowym', '#8a5a4e', 'seg', function () { return kl(0.9, -KD.b * 0.7, KD.t * 0.6 * WS); }, function (st, m) { return (m > 1.92 && m < 2.05) || POST(st, m); });
    lab('Zaciski', 'na żyle biodrowej zewnętrznej', '#3a3f45', 'ghost', function () { return clV[1].position.clone().add(new V3(0, 0, 0.6)); }, win(2.05, 2.3));
    lab('Nacięcie żyły', 'wzdłuż', A.COL.cut, 'cut', function () { return venot.position.clone(); }, win(2.12, 2.3));
    lab(rExt ? 'Zespolenie żylne' : 'Zespolenie żylne', 'koniec-do-boku', '#7d8794', 'anast', function () { return rV.position.clone(); }, function (st, m) { return (m > 2.68 && m < 3.05) || POST(st, m); });
    if (d.art !== 'iia') {
      lab('Nacięcie tętnicy', d.art === 'carrel' ? 'podłużne' : 'otwór wycięty dziurkaczem', A.COL.cut, 'cut', function () { return artot.position.clone(); }, win(3.1, 3.3));
      if (d.art === 'carrel') lab('Łata Carrela', 'fragment ściany aorty dawcy', '#b5705f', 'seg', function () { return patch.position.clone(); }, win(3.3, 3.62));
      lab('Zespolenie tętnicze', 'koniec-do-boku', '#7d8794', 'anast', function () { return rA.position.clone(); }, function (st, m) { return (m > 3.62 && m < 4.001) || POST(st, m); });
    } else {
      lab('Podwiązanie kikuta obwodowego', '', '#22262b', 'ghost', function () { return iiaLig[0].position.clone(); }, win(3.08, 3.3));
      lab('Zespolenie tętnicze', 'koniec-do-końca z t. biodrową wewnętrzną', '#7d8794', 'anast', function () { return rA.position.clone(); }, function (st, m) { return (m > 3.62 && m < 4.001) || POST(st, m); });
    }
    lab('Reperfuzja', 'nerka różowieje i napina się', C.kid1, 'seg', function () { return kl(0.4, -KD.b * 0.5, KD.t * 0.8 * WS); }, win(3.85, 4.001));
    if (LG) {
      lab('Nacięcie mięśniówki pęcherza', 'ok. 2–3 cm, do błony śluzowej', A.COL.cut, 'cut', function () { return SITE.clone().addScaledVector(IDIR, -0.4).addScaledVector(SN, 0.1); }, win(4.08, 4.3));
      lab('Błona śluzowa', 'uwypuklona', '#c98a85', 'seg', function () { return SITE.clone().addScaledVector(SN, 0.12); }, win(4.28, 4.45));
      lab('Zespolenie z błoną śluzową', '', '#7d8794', 'anast', function () { return rU.position.clone(); }, function (st, m) { return (m > 4.68 && m < 4.85) || POST(st, m); });
      lab('Tunel antyrefluksowy', 'mięśniówka zszyta nad moczowodem', '#22305c', 'seg', function () { return SITE.clone().addScaledVector(IDIR, -0.3).addScaledVector(SN, 0.2); }, function (st, m) { return m > 4.86 && m < 4.999; });
    } else {
      lab('Cystotomia', 'pęcherz otwarty od przodu', A.COL.cut, 'cut', function () { return bladP(new V3(-0.15, 0.05, 1), 0.1); }, win(4.04, 4.32));
      lab('Hiatus', 'nowe wejście moczowodu', '#4a1d1a', 'seg', function () { return SITE.clone().addScaledVector(SN, 0.1); }, win(4.28, 4.45));
      lab('Tunel podśluzówkowy', 'ok. 2–3 cm', '#b8952e', 'seg', function () { return bladP(SITE.clone().sub(BC).lerp(ORIF.clone().sub(BC), 0.5), -0.1); }, win(4.5, 4.75));
      lab('Nowe ujście moczowodu', 'przy trójkącie pęcherza', '#7d8794', 'anast', function () { return orif.position.clone(); }, function (st, m) { return (m > 4.72 && m < 4.999) || POST(st, m); });
    }
    lab('Cewnik JJ', 'w miedniczce i w pęcherzu', '#2f78c4', 'seg', function () { return grafts.ure ? grafts.ure.getPointAt(0.36) : null; }, function (st, m) { return (m > 4.55 && m < 4.7) || POST(st, m); });

    /* ---------- aktualizacja ---------- */
    var grafts = { art: null, vein: null, ure: null }, lastKey = '', kid0 = new THREE.Color(C.kid0), kid1 = new THREE.Color(C.kid1);
    var tool = { d: d, grp: grp, overlay: false, labels: labels };
    tool.update = function (m) {
      var st = stateAt(m), key = m.toFixed(4);
      if (key !== lastKey) {
        lastKey = key;
        deepG.visible = m > 0.28;
        // powłoki
        LSK.update(st.oSk); LEO.update(st.oEO); LIO.update(st.oIO); LTA.update(st.oTA); LTF.update(st.oTF);
        var wv = st.wall, ghost = 0.1;
        setOp(mSkin, Math.max(ghost, wv)); setOp(mBody, Math.max(ghost, wv)); setOp(mFat, wv);
        [LEO, LIO, LTA, LTF].forEach(function (L) { L.sides.forEach(function (S2) { S2.top.visible = wv > 0.02; setOp(S2.top.material, wv); }); });
        [mEOf, mIOf, mTAf, mTFf].forEach(function (mm) { setOp(mm, wv); });
        LSK.sides.forEach(function (S2) { S2.face.visible = wv > 0.02 && st.oSk > 0.02; });
        plan.visible = m <= 0.001; incL.visible = st.inc > 0 && wv > 0.5; incL.geometry.setDrawRange(0, Math.round(st.inc * 80) * 8 * 6);
        eoL.visible = st.eoInc > 0 && st.oEO < 0.25; eoL.geometry.setDrawRange(0, Math.round(st.eoInc * 80) * 8 * 6);
        muL.visible = st.muInc > 0 && st.oIO < 0.25; muL.geometry.setDrawRange(0, Math.round(st.muInc * 80) * 8 * 6);
        lmDots.forEach(function (s) { s.visible = wv > 0.5; }); ingL.visible = umb.visible = wv > 0.5;
        perUpdate(st.per); setOp(mPer, 0.55 * (1 - 0.6 * sm((m - 1.2) / 0.3)));
        iepUpdate(st.iep); setOp(mEA, wv); setOp(mEV, wv); iep.forEach(function (x) { x.visible = wv > 0.02; }); ligs.forEach(function (L) { L.visible = L.visible && wv > 0.3; });
        // nerka: na stole (przesunięta), potem w dole biodrowym; reperfuzja — kolor
        kid.visible = st.kidOn > 0.01; kid.position.copy(KC).addScaledVector(BEN, 1 - st.move); kid.quaternion.copy(QBEN).slerp(KFIN.q, st.move);
        setOp(mKid, st.kidOn); setOp(mKidH, st.kidOn); setOp(mPel, st.kidOn);
        mKid.color.copy(kid0).lerp(kid1, st.rep); kid.scale.setScalar(1 + 0.035 * st.rep); kid.updateMatrixWorld(true);
        // tętnica nerkowa
        var fa = toW(freeArt()), pa = st.art > 0 ? lerpPath(fa, artAttached(), st.art, 12) : fa, ca = cv(pa); grafts.art = ca;
        rArt.visible = kid.visible; setTube(rArt, pa, 0.26, d.art === 'carrel' ? 0.3 : 0.27, 10, [false, d.art !== 'carrel']); setOp(mRA, st.kidOn);
        if (patch) {
          var pe = pa[pa.length - 1], pt = ca.getTangentAt(1), nT = TA.n.clone(), along = TA.T.clone();
          var qF = new THREE.Quaternion().setFromUnitVectors(new V3(0, 0, 1), pt), qA = new THREE.Quaternion().setFromUnitVectors(new V3(0, 0, 1), nT);
          patch.position.copy(pe); patch.quaternion.copy(qF).slerp(qA, st.art); patch.visible = kid.visible; setOp(mPatch, st.kidOn);
          if (st.art > 0.99) place(patch, TA.p.clone().addScaledVector(TA.n, 0.05), TA.n, along);
        }
        // tętnica biodrowa wewnętrzna (iia): część bliższa odwracana
        if (iiaProx) {
          var pp = st.iiaCut ? iiaPath(st.iiaSw) : (function () { var o = []; for (var i = 0; i <= 10; i++) o.push(sampleAt(cIIA, (tc + 0.05) * i / 10)); return o; })();
          setTube(iiaProx, pp, K.IIA.r[0], rAt(K.IIA, tc), 12, [false, !!st.iiaCut]);
          iiaLig.forEach(function (r) { r.visible = st.iiaLig > 0.5; });
          var iEnd = pp[pp.length - 1], iT = cv(pp).getTangentAt(1);
          place(rA, iEnd, iT); clI.visible = !!st.clA; place(clI, cv(pp).getPointAt(0.45), new V3(0, 0, 1)); clI.quaternion.setFromUnitVectors(new V3(0, 1, 0), new V3().crossVectors(cv(pp).getTangentAt(0.45), new V3(0, 0, 1)).normalize());
          if (iiaDist) iiaDist.visible = true;
        }
        // żyła nerkowa (+ przedłużenie)
        var fv = toW(freeVein(st.ext > 0)), fvx = fv, pv = st.vein > 0 ? lerpPath(fvx, veinAttached(), st.vein, 12) : fvx, cvv = cv(pv); grafts.vein = cvv;
        if (rExt) {
          // podział: żyła nerkowa (krótka) + przedłużenie (rośnie na stole)
          var jt = VLEN / (VLEN + 2.2), a1 = [], a2 = [];
          for (var i = 0; i <= 8; i++) { a1.push(cvv.getPointAt(jt * i / 8)); a2.push(cvv.getPointAt(jt + (1 - jt) * st.ext * i / 8)); }
          setTube(rVein, a1, 0.38, 0.38, 10, [false, st.ext < 0.02]); rExt.visible = st.ext > 0.02 && kid.visible; if (rExt.visible) setTube(rExt, a2, 0.42, 0.42, 10, [false, false]);
          setOp(mExt, st.kidOn);
          rJ.visible = st.ext > 0.9 && kid.visible; place(rJ, cvv.getPointAt(jt), cvv.getTangentAt(jt));
          staple.visible = rExt.visible; staple.children.forEach(function (b, k) { var u = jt + (1 - jt) * st.ext * (k + 0.5) / 9, P = cvv.getPointAt(u), T = cvv.getTangentAt(u), sd = new V3().crossVectors(T, KW).normalize(); b.position.copy(P).addScaledVector(sd, 0.42); b.quaternion.setFromUnitVectors(new V3(1, 0, 0), T); });
        } else setTube(rVein, pv, 0.36, 0.38, 10, [false, false]);
        rVein.visible = kid.visible; setOp(mRV, st.kidOn);
        // moczowód przeszczepu
        var fu = toW(freeUre()), pu = lerpPath(fu, urePre(), st.urePre, 16); if (st.ure > 0) pu = lerpPath(pu, ureAttached(), st.ure, 20);
        var cu = cv(pu); grafts.ure = cu; rUre.visible = kid.visible; setTube(rUre, pu, 0.19, 0.17, 10, [false, st.ure < 0.98]);
        setOp(mUreG, st.kidOn * (st.jj > 0 ? 0.62 : 1));
        // JJ
        jj.visible = st.jj > 0.01; if (jj.visible) { var jp = []; for (var q = 0; q <= 20; q++) jp.push(cu.getPointAt(q / 20)); var pin = kl(PEX[0] + 0.55, PEX[1] - 0.25, PEX[2] * 0.9); jp.unshift(pin); setTube(jj, jp, 0.06, 0.06, 6, true); }
        jjC.forEach(function (r, k) { r.visible = st.jj > 0.5; });
        if (st.jj > 0.5) { var c0 = kl(PEX[0] + 0.75, PEX[1] - 0.3, PEX[2] * 0.85); place(jjC[0], c0, KW); var e1 = pu[pu.length - 1], n1 = bladN(e1); place(jjC[1], e1.clone().addScaledVector(n1, -0.45), IDIR.clone().cross(n1)); }
        setOp(mJJ, st.jj);
        // zespolenia, nacięcia, zaciski
        rV.visible = st.rV > 0.01; rV.material.opacity = st.rV; venot.visible = st.venot > 0.01; venot.material.opacity = st.venot;
        rA.visible = st.rA > 0.01; rA.material.opacity = st.rA; if (artot) { artot.visible = st.artot > 0.01; artot.material.opacity = st.artot; }
        if (rJ) rJ.material.opacity = 1;
        clV.forEach(function (c) { c.visible = !!st.clV; }); clA.forEach(function (c) { c.visible = !!st.clA; });
        // pęcherz
        var bOp = 0.85;
        if (LG) {
          incB.visible = st.det > 0 && st.detO < 0.3; incB.geometry.setDrawRange(0, Math.round(st.det * 24) * 6 * 6);
          muc.visible = st.detO > 0.05; muc.scale.set(0.95, 0.2 * (0.4 + 0.6 * st.detO), 0.12 + 0.12 * st.detO);
          [0, 1].forEach(function (k) {
            var sg = k ? 1 : -1, w = 0.05 + 0.26 * st.detO, lift = st.sut ? 0.2 : 0, P = [];
            for (var q = 0; q <= 8; q++) { var s = -0.95 + 1.9 * q / 8; P.push(bladP(SITE.clone().addScaledVector(IDIR, s).addScaledVector(IB, sg * w * Math.sin(Math.PI * q / 8)).sub(BC), 0.02 + lift * Math.sin(Math.PI * q / 8))); }
            detL[k].visible = st.det > 0.95 && (st.detO > 0.02 || st.sut); setTube(detL[k], P, 0.07, 0.07, 6, true);
          });
          sut.visible = !!st.sut;
          rU.visible = st.rU > 0.01; rU.material.opacity = st.rU;
        } else {
          cysto.visible = st.cys > 0 && m < 4.95; cysto.geometry.setDrawRange(0, Math.round(st.cys * 24) * 6 * 6);
          bOp = 0.85 - 0.5 * sm((m - 4.15) / 0.1) * (1 - sm((m - 4.85) / 0.1));
          [0, 1].forEach(function (k) { detL[k].visible = false; });
          hiat.visible = st.hiat > 0.01 && st.ure < 0.6; orif.visible = st.rU > 0.01; orif.material.opacity = st.rU; cysL.visible = !!st.sut;
        }
        setOp(mBl, bOp);
      }
      grp.updateMatrixWorld(true);
      labels.forEach(function (Lb) { var p = Lb.fn(st, m); Lb.anchor = p ? grp.localToWorld(p.clone()) : null; Lb.alpha = Lb.when(st, m) && p ? 1 : 0; });
    };
    tool.test = { state: stateAt, wall: wall, body: bodyMesh, kid: kid, KC: KC, grafts: grafts, TV: TV, TA: TA, SITE: SITE };
    M.ktx = tool;
    return tool;
  }
  TOOL_EXT.ktx = makeKtx;
  window.__sgTest.ktx = function () {
    if (!M || !M.ktx) return null; var vis = M.ktx.labels.filter(function (L) { return L.alpha > 0; });
    return { m: S.m, labels: vis.map(function (L) { return L.el.querySelector('b').textContent; }) };
  };
