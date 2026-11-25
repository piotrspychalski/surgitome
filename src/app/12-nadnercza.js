  /* ---------- adrenalektomia laparoskopowa (TOOL_EXT.adrenal): model ANAT.ADRENAL (14b-nadnercza.js) w układzie modelu wątroby.
     Wątroba (ANAT.LIVER) odciągana przyśrodkowo i ku górze (strona prawa); śledziona z ogonem trzustki i zagięciem śledzionowym odsuwane
     przyśrodkowo (strona lewa); nadnercze z tkanką tłuszczową (pole odległości → surface nets, otoczka = to samo pole przesunięte), żyła nadnerczowa
     z klipsami i przecięciem, drobne tętnice nadnerczowe, linie nacięcia otrzewnej. Oś m — ANAT.ADRENAL.T[strona]. ---------- */
  var ADR_CACHE = {};
  function adrMesh(side) {
    var h = MOBILE ? 0.11 : 0.08, key = side + h; if (ADR_CACHE[key]) return ADR_CACHE[key];
    var D = A.ADRENAL.ADR[side], lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
    D.P.forEach(function (p) { for (var i = 0; i < 3; i++) { lo[i] = Math.min(lo[i], p[i] - 2.2); hi[i] = Math.max(hi[i], p[i] + 2.2); } });
    var g = szyGrid(D.sdf, lo, hi, h), fat = { F: new Float32Array(g.F.length), G: g.G };
    for (var i = 0; i < g.F.length; i++) fat.F[i] = g.F[i] - 0.24;
    return (ADR_CACHE[key] = { gl: A.LIVER.surfNets(g.F, g.G), fat: A.LIVER.surfNets(fat.F, fat.G) });
  }
  function makeAdrenal(d) {
    var AD = A.ADRENAL, VV = AD.V, side = d.side, R = side === 'R', T = AD.T[side], grp = new THREE.Group(), labels = [];
    function ph(k, m) { var t = T[k]; return t ? sm((m - t[0]) / (t[1] - t[0])) : 0; }
    function lin(k, m) { var t = T[k]; return t ? clamp01((m - t[0]) / (t[1] - t[0])) : 0; }
    function mat(col, o, extra) { var m = track(new THREE.MeshStandardMaterial(Object.assign({ color: col, roughness: 0.55, metalness: 0.02, transparent: true, opacity: o == null ? 1 : o }, extra || {}))); return m; }
    function V(p) { return new V3().fromArray(p); }
    function curve(pts) { return new THREE.CatmullRomCurve3(pts.map(V), false, 'centripetal'); }
    function tube(pts, r, mt, parent, r1) { var c = curve(pts), g = track(A.buildTube(c, function (t) { return r1 == null ? r : r + (r1 - r) * t; }, Math.max(10, Math.round(c.getLength() * 6)), 12, true)), m = new THREE.Mesh(g, mt); (parent || grp).add(m); return { mesh: m, curve: c }; }
    function lab(text, sub, col, kind) { var L = { el: mkLabel(text, sub || '', col, kind || 'seg'), anchor: null, alpha: 0 }; labels.push(L); return L; }
    function put(L, p, on) { L.anchor = p; L.alpha = on ? 1 : 0; }
    function ellMesh(E, mt, parent) { var m = new THREE.Mesh(track(new THREE.SphereGeometry(1, 40, 28)), mt); m.scale.set(E.r[0], E.r[1], E.r[2]); m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(V(E.ax[0]), V(E.ax[1]), V(E.ax[2]))); m.position.fromArray(E.c); (parent || grp).add(m); return m; }
    var C = { art: '#c8332b', vein: '#3a64b8', pv: '#7446c2', kid: '#93473b', adr: '#dfa236', fat: '#efd27a', spl: '#8d3f4f', panc: '#e3bf73', bowel: '#cf8aa6', mus: '#a9544a', bone: '#e8e0cc' };
    var mA = mat(C.art), mV = mat(C.vein), mPV = mat(C.pv), mKid = mat(C.kid, 1, { roughness: 0.45 }), mBone = mat(C.bone, 0.35, { depthWrite: false }), mMus = mat(C.mus, 0.6);
    // kręgosłup, odnogi przepony, aorta, żyła główna dolna
    var spine = new THREE.Mesh(track(new THREE.CylinderGeometry(2.0, 2.0, 22, 24)), mBone); spine.position.set(0, -6, -10.3); grp.add(spine);
    tube(VV.crusR, 0.55, mMus); tube(VV.crusL, 0.55, mMus);
    var ivc = tube(VV.ivc, 1.1, mV), aorta = tube(VV.aorta, 1.05, mA);
    // nerki i naczynia nerkowe
    var mKidO = mat(C.kid, 0.4, { roughness: 0.45, depthWrite: false }), kR = ellMesh(AD.KID.R, R ? mKid : mKidO), kL = ellMesh(AD.KID.L, R ? mKidO : mKid);
    tube(VV.rrv, 0.5, mV); tube(VV.rra, 0.3, mA); tube(VV.lrv, 0.5, mV); tube(VV.lra, 0.32, mA); tube(VV.lgv, 0.22, mV);
    tube(VV.sma, 0.38, mA); tube(VV.cha, 0.28, mA);
    // trzewia: wątroba (strona prawa — odciągana), trzustka, naczynia śledzionowe, śledziona i zagięcie śledzionowe (strona lewa — odsuwane), dwunastnica
    var lvPiv = new THREE.Group(); lvPiv.position.set(2.5, 6.0, -6.0); grp.add(lvPiv);
    var lvMt = lvMat(LV_COL.par, 0.5), liver = new THREE.Mesh(lvGeo(A.LIVER.model(MOBILE ? 0.32 : 0.25).whole), lvMt); liver.position.set(-2.5, -6.0, 6.0); liver.renderOrder = 3; lvPiv.add(liver);
    var splG = new THREE.Group(); splG.position.set(1.2, -6.0, -2.6); grp.add(splG);
    function inSpl(P) { return P.map(function (p) { return [p[0] - 1.2, p[1] + 6.0, p[2] + 2.6]; }); }
    var mSpl = mat(C.spl, 1), mPanc = mat(C.panc, 1), mBow = mat(C.bowel, 0.9), mDuo = mat(C.bowel, 0.5);
    var spl = ellMesh({ c: [AD.SPLEEN.c[0] - 1.2, AD.SPLEEN.c[1] + 6.0, AD.SPLEEN.c[2] + 2.6], ax: AD.SPLEEN.ax, r: AD.SPLEEN.r }, mSpl, splG);
    var panc = tube(inSpl(VV.panc), 1.25, mPanc, splG, 0.75); tube(inSpl(VV.sv), 0.42, mPV, splG); tube(inSpl(VV.sa), 0.3, mA, splG);
    tube(VV.sa.slice(0, 2), 0.32, mA);
    var flex = tube(VV.flex, 1.5, mBow, null, 1.3);
    var duo = tube(VV.duo, 1.1, mDuo);
    // nadnercza (gruczoł + otoczka tłuszczowa); po operowanej stronie w grupie preparatu
    var spec = new THREE.Group(); grp.add(spec);
    var mAdr = mat(C.adr, 1, { roughness: 0.6 }), mFat = mat(C.fat, 0.3, { depthWrite: false, roughness: 0.75 }), mAdrO = mat(C.adr, 1, { roughness: 0.6 });
    ['R', 'L'].forEach(function (s) {
      var M0 = adrMesh(s), op = s === side, gl = new THREE.Mesh(lvGeo(M0.gl), op ? mAdr : mAdrO); (op ? spec : grp).add(gl);
      if (op) { var f = new THREE.Mesh(lvGeo(M0.fat), mFat); f.renderOrder = 5; spec.add(f); }
    });
    // żyła nadnerczowa: kikut (do żyły głównej / nerkowej) i część przy gruczole; klipsy
    var avPts = R ? VV.rav : VV.lav, avC = curve(avPts), CL = AD.clips[side], r0 = R ? 0.22 : 0.25, mAV = mat(C.vein);
    // t na krzywej: 0 przy gruczole, 1 przy ujściu
    function seg(a, b, par) { var Q = []; for (var i = 0; i <= 12; i++) Q.push(avC.getPointAt(a + (b - a) * i / 12).toArray()); return tube(Q, r0, mAV, par); }
    var avWhole = tube(avPts, r0, mAV), avSpec = seg(0, CL.cut - 0.04, spec), avStump = seg(CL.cut + 0.04, 1, grp); avSpec.mesh.visible = avStump.mesh.visible = false;
    if (!R) { tube(VV.lipv, 0.13, mV); }
    var clipMat = mat('#c9ced4', 1, { metalness: 0.7, roughness: 0.3 }), clips = [];
    CL.keep.concat(CL.spec).forEach(function (t, i) {
      var m = new THREE.Mesh(track(new THREE.BoxGeometry(2 * r0 + 0.34, 0.1, 0.18)), clipMat), P0 = avC.getPointAt(t); m.position.copy(P0); m.quaternion.setFromUnitVectors(new V3(0, 1, 0), avC.getTangentAt(t));
      var onSpec = i >= CL.keep.length; (onSpec ? spec : grp).add(m); clips.push({ m: m, at: 0.15 + 0.12 * i, spec: onSpec });
    });
    // drobne tętnice nadnerczowe (operowana strona): zamykane w fazie uwolnienia — część przy gruczole w preparacie
    var arts = (R ? [VV.ripa, VV.rmaa, VV.riaa] : [VV.lipa, VV.lmaa, VV.liaa]).map(function (P, i) {
      var c = curve(P), n = P.length, keep = [], sp = []; for (var k = 0; k <= 10; k++) { var u = k / 10; (u < 0.8 ? keep : sp).push(c.getPointAt(u).toArray()); }
      sp.unshift(c.getPointAt(0.82).toArray());
      var a = tube(keep, 0.12, mA), b = tube(sp, 0.1, mA, spec);
      var cg = new THREE.Mesh(track(new THREE.SphereGeometry(0.16, 10, 8)), mat('#5a3a30', 1)); cg.position.copy(c.getPointAt(0.8)); grp.add(cg); cg.visible = false;
      return { c: c, cg: cg, i: i };
    });
    (R ? [VV.lipa, VV.lmaa, VV.liaa] : [VV.ripa, VV.rmaa, VV.riaa]).forEach(function (P) { tube(P, 0.11, mA); });
    // linie nacięcia otrzewnej
    var cutC = curve(R ? VV.cutR : VV.cutL), cutG = track(new THREE.TubeGeometry(cutC, 80, 0.07, 6, false)), cutM = new THREE.Mesh(cutG, mat(A.COL.cut, 1, { emissive: A.COL.cut, emissiveIntensity: 0.3 })); grp.add(cutM);

    /* ---- etykiety ---- */
    var adrC = V(AD.ADR[side].P[1]), L = {
      adr: lab(R ? 'Nadnercze prawe' : 'Nadnercze lewe', '', C.adr), fat: lab('Tkanka tłuszczowa okołonadnerczowa', 'usuwana z gruczołem', '#c9a94f'),
      av: lab(R ? 'Żyła nadnerczowa prawa' : 'Żyła nadnerczowa lewa', R ? 'krótka, do tylnej ściany żyły głównej dolnej' : 'do żyły nerkowej lewej', C.vein),
      ivc: lab('Żyła główna dolna', '', C.vein), ao: lab('Aorta', '', C.art), kid: lab(R ? 'Nerka prawa' : 'Nerka lewa', 'górny biegun', C.kid),
      crus: lab(R ? 'Odnoga prawa przepony' : 'Odnoga lewa przepony', '', C.mus), clip: lab('Klipsy', R ? 'dwa od strony żyły głównej' : 'dwa od strony żyły nerkowej', '#8f98a2'),
      stump: lab('Kikut żyły nadnerczowej', 'z klipsami', C.vein), bed: lab('Loża nadnercza', '', '#8a6b4f'), arts: lab('Tętnice nadnerczowe', 'drobne — koagulacja lub narzędzie energetyczne', C.art),
      cut: lab(R ? 'Nacięcie otrzewnej' : 'Więzadło śledzionowo-nerkowe', R ? 'więzadło trójkątne prawe, brzeg żyły głównej dolnej' : 'przecięte od bieguna dolnego śledziony do przepony', A.COL.cut, 'cut')
    };
    if (R) { L.liver = lab('Wątroba', 'płat prawy odciągnięty retraktorem', LV_COL.par); L.duo = lab('Dwunastnica', '', C.bowel); L.rv = lab('Żyła nerkowa prawa', '', C.vein); }
    else { L.spl = lab('Śledziona', '', C.spl); L.panc = lab('Trzon i ogon trzustki', '', '#c79a45'); L.sv = lab('Żyła śledzionowa', '', C.pv); L.lrv = lab('Żyła nerkowa lewa', '', C.vein);
      L.lipv = lab('Żyła przeponowa dolna lewa', 'uchodzi do żyły nadnerczowej', C.vein); L.flex = lab('Zagięcie śledzionowe okrężnicy', 'odsunięte w dół', C.bowel); }

    var tool = { d: d, grp: grp, overlay: false, el: null, labels: labels,
      update: function (m) {
        var fk = FR[S.frame] ? FR[S.frame].k : '', acc = m < -0.001, rem = lin('rem', m), back = sm((rem - 0.55) / 0.45);
        labels.forEach(function (Lb) { Lb.alpha = 0; });
        // wątroba / śledziona: odsunięcie i powrót
        var lf = R ? ph('liver', m) * (1 - back) : 0, sf = R ? 0 : ph('spl', m) * (1 - back);
        lvPiv.rotation.set(-0.34 * lf, 0, -0.2 * lf); lvPiv.position.set(2.5 + 1.2 * lf, 6.0 + 1.2 * lf, -6.0 + 1.0 * lf);
        lvSetOp(lvMt, acc ? 0.55 : fk === 'anat' || fk === 'post' ? 0.32 : R ? 0.85 - 0.5 * ph('liver', m) * (1 - back) : 0.35);
        splG.rotation.set(0, -0.3 * sf, 0.08 * sf); splG.position.set(1.2 - 2.6 * sf, -6.0 + 0.3 * sf, -2.6 + 0.3 * sf);
        flex.mesh.position.set(-1.2 * sf, -3.0 * sf, 0.8 * sf);
        var an0 = fk === 'anat' || fk === 'post';
        var lapL = !R && /^(vein|mob|rem)$/.test(fk); lvSetOp(mSpl, R ? 0.22 : an0 ? 0.55 : lapL ? 0.3 : 1); lvSetOp(mPanc, R ? 0.3 : an0 ? 0.55 : lapL ? 0.4 : 1);
        lvSetOp(mBow, R ? 0.2 : an0 ? 0.45 : 0.85); lvSetOp(mDuo, R ? (an0 ? 0.5 : 0.3) : 0.2);
        // nacięcie otrzewnej
        var cp = R ? clamp01(lin('liver', m) * 1.6) * 0.45 + 0.55 * clamp01(lin('ivc', m) * 1.4) : clamp01(lin('spl', m) * 1.5);
        cutM.visible = cp > 0.01 && rem < 0.5; cutG.setDrawRange(0, Math.round(cp * 80) * 6 * 6);
        // żyła nadnerczowa: klipsy, przecięcie
        var vq = lin('vein', m), cut = vq > 0.62 || m > T.vein[1];
        avWhole.mesh.visible = !cut; avSpec.mesh.visible = avStump.mesh.visible = cut;
        clips.forEach(function (K) { K.m.visible = (vq >= K.at || m > T.vein[1]) && !(K.spec && rem > 0.9); });
        // tętnice nadnerczowe: zamknięte w fazie uwolnienia
        var mq = lin('mob', m);
        arts.forEach(function (a) { a.cg.visible = mq > 0.15 + 0.25 * a.i || m > T.mob[1]; });
        // preparat: uniesienie i usunięcie
        spec.position.set(R ? 0.4 * ph('mob', m) : -0.3 * ph('mob', m), 0.2 * ph('mob', m) + 2.5 * sm(rem / 0.6), 0.6 * ph('mob', m) + 6 * sm(rem / 0.6));
        spec.visible = rem < 0.6;
        lvSetOp(mFat, 0.3 * (1 - 0.5 * ph('mob', m)));
        if (acc) return;
        // etykiety
        var fA = fk === 'anat', fP = fk === 'post', adrP = adrC.clone().add(spec.position);
        put(L.adr, adrP.clone().add(new V3(R ? -0.4 : 0.4, 0.3, 0.3)), spec.visible && !fP);
        put(L.fat, V(AD.ADR[side].P[2]).add(spec.position).add(new V3(R ? -0.9 : 0.9, -0.4, 0)), fk === 'mob' && mq > 0.3);
        put(L.av, avC.getPointAt(0.55), fA || fk === 'vein' && vq < 0.62);
        put(L.clip, avC.getPointAt(0.8), fk === 'vein' && vq > 0.35);
        put(L.stump, avC.getPointAt(0.85), fP || fk === 'rem' || fk === 'mob' && mq > 0.6);
        put(L.ivc, ivc.curve.getPointAt(R ? 0.5 : 0.35), fA || (R && (fk === 'ivc' || fk === 'liver')) || fP);
        put(L.ao, aorta.curve.getPointAt(0.42), fA || (!R && fk === 'mob'));
        put(L.kid, R ? V([-5.0, -4.6, -7.3]) : V([5.0, -3.6, -7.4]), fA || fk === 'mob' || fP);
        put(L.crus, V(R ? VV.crusR[2] : VV.crusL[2]), fA || (!R && fk === 'mob' && mq > 0.4));
        put(L.arts, arts[1].c.getPointAt(0.6), fk === 'mob' && mq < 0.7 || (R && fk === 'ivc' && lin('ivc', m) > 0.5));
        put(L.bed, V(AD.ADR[side].P[1]).add(new V3(R ? -0.6 : 0.6, 0, 0)), fP);
        put(L.cut, cutC.getPointAt(R ? 0.25 : 0.5), cp > 0.3 && rem < 0.3 && (fk === 'liver' || fk === 'spl' || fk === 'ivc'));
        if (R) {
          put(L.liver, V([-6.5, -2.0, 2.0]).sub(V([2.5, 6.0, -6.0])).applyEuler(lvPiv.rotation).add(lvPiv.position), fA || fk === 'liver');
          put(L.duo, duo.curve.getPointAt(0.35), fA); put(L.rv, V(VV.rrv[1]), fA);
        } else {
          var sq = spl.position.clone().applyEuler(splG.rotation).add(splG.position);
          put(L.spl, sq, fA || fk === 'spl'); put(L.panc, panc.curve.getPointAt(0.7).applyEuler(splG.rotation).add(splG.position), fA || fk === 'spl');
          put(L.sv, V(VV.sv[2]), fA); put(L.lrv, V(VV.lrv[1]), fA || fk === 'vein' || fP);
          put(L.lipv, V(VV.lipv[2]), fk === 'vein' && vq < 0.5 || fA); put(L.flex, flex.curve.getPointAt(0.45).add(flex.mesh.position), fk === 'spl');
        }
      } };
    return tool;
  }
  TOOL_EXT.adrenal = makeAdrenal;
