  /* ---------- cholecystektomia (TOOL_EXT.chole): wątroba (ANAT.LIVER), pęcherzyk, przewód i tętnica pęcherzykowa, drogi żółciowe i tętnice wnęki;
     tkanka trójkąta wątrobowo-pęcherzykowego zanika przy preparowaniu, dolna część pęcherzyka odsuwa się od łoża (płytka pęcherzykowa), klipsy,
     przecięcie (przewód i tętnica dzielone na kikut i część z pęcherzykiem), wycięcie pęcherzyka z łoża. Oś m jak w ANAT.CHOLE (0–3). ---------- */
  function makeChole(d) {
    var LM = A.LIVER, H = A.CHOLE, G = LM.model(MOBILE ? 0.32 : 0.25), grp = new THREE.Group(), spec = new THREE.Group(), labels = [];
    grp.add(spec);
    var liver = new THREE.Mesh(lvGeo(G.whole), lvMat(LV_COL.par, 0.55)); liver.renderOrder = 1; grp.add(liver);
    function tube(pts, r0, r1, mat, parent) {
      var c = new THREE.CatmullRomCurve3(pts.map(function (p) { return p.isVector3 ? p.clone() : new V3().fromArray(p); }), false, 'centripetal');
      var g = A.buildTube(c, typeof r0 === 'function' ? r0 : function (t) { return r0 + (r1 - r0) * t; }, Math.max(8, Math.round(c.getLength() * 6)), 12, true);
      var m = new THREE.Mesh(g, mat); (parent || grp).add(m); return { mesh: m, curve: c };
    }
    function lab(text, sub, col, kind) { var L = { el: mkLabel(text, sub || '', col, kind || 'seg'), anchor: null, alpha: 0 }; labels.push(L); return L; }
    // drogi żółciowe, tętnice i żyła wrotna (bez gałęzi wewnątrzwątrobowych)
    var fixed = [];
    ['pv', 'ha', 'bd'].forEach(function (kind) {
      LM.vessels[kind].forEach(function (v) {
        if (H.show[kind].indexOf(v.id) < 0) return;
        var T = tube(v.pts, v.r[0], v.r[1], lvMat(LV_COL[kind], 0.42));
        var nm = { pv: 'Żyła wrotna', cbd: 'Przewód żółciowy wspólny', chd: 'Przewód wątrobowy wspólny', rha: 'Tętnica wątrobowa prawa', pha: 'Tętnica wątrobowa właściwa' }[v.id];
        if (nm) fixed.push({ L: lab(nm, '', LV_COL[kind]), p: T.curve.getPointAt(v.id === 'cbd' ? 0.55 : v.id === 'rha' ? 0.35 : 0.5) });
      });
    });
    // pęcherzyk i węzeł pęcherzykowy (z preparatem)
    // pęcherzyk w grupie obracanej wokół szyjki (uniesienie dna) i przesuwanej (odciągnięcie kieszonki Hartmanna)
    var neck0 = new V3().fromArray(H.GB[H.GB.length - 1]), gbPiv = new THREE.Group(); spec.add(gbPiv);
    var gbMat = lvMat(LV_COL.gb, 0.35), gbT = tube(H.GB.map(function (p) { return new V3().fromArray(p).sub(neck0); }), LM.gbR, null, gbMat, gbPiv);
    var u0 = new V3().fromArray(H.GB[0]).sub(neck0).normalize(), qR = new THREE.Quaternion().setFromUnitVectors(u0, new V3().fromArray(H.retract).normalize()), q0 = new THREE.Quaternion();
    function gbW(t, out) { return (out || new V3()).copy(gbT.curve.getPointAt(t)).applyQuaternion(gbPiv.quaternion).add(gbPiv.position).add(spec.position); }
    var mNode = lvMat('#4f9a6a', 0.5), node = new THREE.Mesh(track(new THREE.SphereGeometry(0.2, 14, 10)), mNode); node.position.fromArray(H.node).sub(neck0); gbPiv.add(node);
    var lift = new V3().fromArray(H.lift);
    // przewód i tętnica pęcherzykowa: przebudowa przy odsunięciu szyjki i po przecięciu (kikut + część z pęcherzykiem)
    var ductMat = lvMat(LV_COL.bd, 0.42), artMat = lvMat(LV_COL.ha, 0.42), parts = { duct: [], art: [] }, key = '';
    // koniec przy pęcherzyku przesuwa się sztywno z pęcherzykiem (obrót wokół szyjki i odciągnięcie), punkty pośrednie częściowo
    var qT = new THREE.Quaternion();
    function base(which, f) {
      var pts = (which === 'duct' ? H.CYD : H.CA).map(function (p) { return new V3().fromArray(p); });
      var gi = which === 'duct' ? 0 : pts.length - 1, k = which === 'duct' ? [1, 0.45, 0.1, 0] : [0, 0.15, 0.55, 1];
      qT.copy(q0).slerp(qR, f);
      var E = pts[gi].clone().sub(neck0).applyQuaternion(qT).add(neck0).addScaledVector(lift, f), D = E.sub(pts[gi]);
      pts.forEach(function (p, i) { p.addScaledVector(D, k[i]); });
      return new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    }
    function rebuild(f, cutD, cutA) {
      var kk = f.toFixed(3) + cutD + cutA; if (kk === key) return; key = kk;
      ['duct', 'art'].forEach(function (w) {
        parts[w].forEach(function (m) { m.parent.remove(m); m.geometry.dispose(); }); parts[w] = [];
        var c = base(w, f), r = w === 'duct' ? 0.16 : 0.11, mat = w === 'duct' ? ductMat : artMat, cut = (w === 'duct' ? cutD : cutA) ? H.CLIPS[w].cut : null;
        function seg(a, b, parent) { var P = []; for (var i = 0; i <= 16; i++) P.push(c.getPointAt(a + (b - a) * i / 16)); var T = tube(P, r, r, mat, parent); parts[w].push(T.mesh); }
        // przewód: t = 0 przy pęcherzyku; tętnica: t = 1 przy pęcherzyku
        if (cut == null) seg(0, 1, w === 'duct' ? grp : grp);
        else if (w === 'duct') { seg(0, cut - 0.035, spec); seg(cut + 0.035, 1, grp); }
        else { seg(0, cut - 0.035, grp); seg(cut + 0.035, 1, spec); }
      });
    }
    // tkanka trójkąta: pas między przewodem pęcherzykowym (od ujścia do szyjki) a przewodem wątrobowym wspólnym (od ujścia ku wnęce)
    var fatMat = track(new THREE.MeshStandardMaterial({ color: '#e8c25e', roughness: 0.7, transparent: true, opacity: 0.6, depthWrite: false, side: THREE.DoubleSide }));
    (function () {
      var cD = base('duct', 0), cH = new THREE.CatmullRomCurve3(H.CHD.map(function (p) { return new V3().fromArray(p); }), false, 'centripetal'), N = 14, R = 6, pos = [], idx = [];
      for (var i = 0; i <= N; i++) {
        var s = i / N, a = cD.getPointAt(1 - s * 0.97), b = cH.getPointAt(Math.min(1, s * 0.85));
        for (var j = 0; j <= R; j++) { var p = a.clone().lerp(b, j / R); p.z += 0.12 * Math.sin(Math.PI * j / R); pos.push(p.x, p.y, p.z); }
      }
      for (i = 0; i < N; i++) for (var j2 = 0; j2 < R; j2++) { var q = i * (R + 1) + j2; idx.push(q, q + R + 1, q + 1, q + R + 1, q + R + 2, q + 1); }
      var g = track(new THREE.BufferGeometry()); g.setIndex(idx); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
      var fat = new THREE.Mesh(g, fatMat); fat.renderOrder = 4; grp.add(fat);
    })();
    // płytka pęcherzykowa (łoże) pod dolną częścią pęcherzyka
    var bd = new V3().fromArray(H.bedDir).normalize(), plC = gbT.curve.getPointAt(0.72).add(neck0).addScaledVector(bd, 0.62);
    var plMat = track(new THREE.MeshStandardMaterial({ color: '#efe6d2', roughness: 0.6, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
    var plate = new THREE.Mesh(track(new THREE.CircleGeometry(1, 32)), plMat); plate.scale.set(0.95, 0.6, 1); plate.position.copy(plC);
    plate.quaternion.setFromUnitVectors(new V3(0, 0, 1), bd.clone().negate()); plate.renderOrder = 3; grp.add(plate);
    // klipsy (tytanowe): poprzeczka w poprzek przewodu lub tętnicy
    var clipMat = track(new THREE.MeshStandardMaterial({ color: '#c9ced4', metalness: 0.7, roughness: 0.3, transparent: true })), clips = [];
    ['duct', 'art'].forEach(function (w, wi) {
      var C0 = H.CLIPS[w], r = w === 'duct' ? 0.16 : 0.11;
      C0.keep.concat(C0.spec).forEach(function (t, i) {
        var m = new THREE.Mesh(track(new THREE.BoxGeometry(2 * r + 0.32, 0.1, 0.16)), clipMat);
        var onSpec = i >= C0.keep.length; clips.push({ m: m, w: w, t: t, spec: onSpec, at: 1.04 + wi * 0.3 + i * 0.09 });
        (onSpec ? spec : grp).add(m);
      });
    });
    function placeClips(f) {
      ['duct', 'art'].forEach(function (w) {
        var c = base(w, f);
        clips.forEach(function (K) {
          if (K.w !== w) return;
          var p = c.getPointAt(K.t), T = c.getTangentAt(K.t);
          K.m.position.copy(p); K.m.quaternion.setFromUnitVectors(new V3(0, 1, 0), T);
        });
      });
    }
    // podpisy
    var Lgb = lab('Pęcherzyk żółciowy', '', LV_COL.gb), Lcd = lab('Przewód pęcherzykowy', '', LV_COL.bd), Lca = lab('Tętnica pęcherzykowa', '', LV_COL.ha);
    var Ltri = lab('Trójkąt wątrobowo-pęcherzykowy (Calota)', 'tkanka tłuszczowa z tętnicą i węzłem', '#e8c25e'), Lnode = lab('Węzeł pęcherzykowy (Mascagniego)', '', '#4f9a6a');
    var Lpl = lab('Płytka pęcherzykowa', 'dolna część pęcherzyka oddzielona od łoża', '#d8cdb0'), Lclip = lab('Klipsy', 'dwa od strony chorego, jeden od strony pęcherzyka', '#9aa3ad');
    var Lsd = lab('Kikut przewodu pęcherzykowego', 'dwa klipsy', LV_COL.bd), Lsa = lab('Kikut tętnicy pęcherzykowej', 'dwa klipsy', LV_COL.ha), Lbed = lab('Łoże pęcherzyka', 'dolna powierzchnia wątroby', '#d8cdb0');
    var Lcvs = lab('Dwie i tylko dwie struktury', 'wchodzą do pęcherzyka', '#2f9e44');
    var specDir = new V3().fromArray(H.specOff), tmp = new V3();
    var tool = { d: d, grp: grp, overlay: false, el: null, labels: labels,
      update: function (m) {
        var f = sm(clamp01((m - 0.25) / 0.7)), cutD = m >= 1.7, cutA = m >= 1.85;
        rebuild(f, cutD, cutA); placeClips(f);
        // pęcherzyk: odsunięcie dolnej części (cały pęcherzyk z węzłem przesunięty lekko), potem usunięcie z łoża
        var fr = sm(clamp01((m - 2.1) / 0.8)); spec.position.copy(specDir).multiplyScalar(fr);
        gbPiv.position.copy(neck0).addScaledVector(lift, f); gbPiv.quaternion.copy(q0).slerp(qR, f);
        var so = 1 - sm(clamp01((m - 2.7) / 0.25)); lvSetOp(gbMat, so); lvSetOp(mNode, so); spec.visible = so > 0.01;
        fatMat.opacity = 0.6 * (1 - sm(clamp01((m - 0.1) / 0.75)));
        plMat.opacity = 0.85 * sm(clamp01((m - 0.5) / 0.4));
        clips.forEach(function (K) { K.m.visible = m >= K.at && (!K.spec || so > 0.01); });
        lvSetOp(liver.material, 0.97);
        function put(L, p, on) { L.anchor = p; L.alpha = on ? 1 : 0; }
        fixed.forEach(function (F) { put(F.L, F.p, true); });
        var cd = base('duct', f), ca = base('art', f);
        put(Lgb, gbW(0.3), so > 0.5);
        put(Lcd, cd.getPointAt(0.3).add(m >= 1.7 ? spec.position : tmp.set(0, 0, 0)), m < 1.7);
        put(Lca, ca.getPointAt(0.62), m > 0.55 && m < 1.85);
        put(Ltri, cd.getPointAt(0.55).lerp(new V3().fromArray(H.CHD[1]), 0.5), m < 0.55);
        put(Lnode, node.position.clone().applyQuaternion(gbPiv.quaternion).add(gbPiv.position).add(spec.position), m < 0.9);
        put(Lpl, plC.clone(), m > 0.7 && m < 1.04);
        put(Lcvs, ca.getPointAt(0.85).lerp(cd.getPointAt(0.15), 0.5), m >= 0.98 && m < 1.04);
        put(Lclip, cd.getPointAt(0.75), m >= 1.1 && m < 1.7);
        put(Lsd, cd.getPointAt(0.85), m >= 1.75);
        put(Lsa, ca.getPointAt(0.2), m >= 1.9);
        put(Lbed, plC.clone().addScaledVector(bd, 0.1), m >= 2.6);
      } };
    return tool;
  }
  TOOL_EXT.chole = makeChole;
