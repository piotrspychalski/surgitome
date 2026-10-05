  /* ---------- budowa anatomii ---------- */
  // keep: drugie ramię badania (widok podzielony) — bez sprzątania pierwszego
  function build(an, keep) {
    if (!keep) splitTeardown();
    if (M && !keep) { M.endoTrash.forEach(function (x) { x.dispose(); }); scene.remove(M.group); if (M.toolOv) toolScene.remove(M.toolOv); M.objs.forEach(function (o) { if (o.geo) o.geo.dispose(); }); ['pre', 'post'].forEach(function (k) { if (M.routes[k]) M.routes[k].list.forEach(function (R) { R.geo.dispose(); }); }); }
    if (!keep) { trash.forEach(function (x) { x.dispose(); }); trash = []; labelsEl.innerHTML = ''; }
    var group = new THREE.Group(), objG = new THREE.Group(), markG = new THREE.Group(), routeG = new THREE.Group();
    group.add(objG, markG, routeG);
    var objs = an.objects.map(makeObj), byId = {};
    objs.forEach(function (o) { byId[o.def.id] = o; objG.add(o.grp); setF(o, 0); });
    var marks = an.marks.map(makeMark), endoMarkG = new THREE.Group(); endoMarkG.visible = false;
    marks.forEach(function (mk) { markG.add(mk.mesh); if (mk.endoMesh) endoMarkG.add(mk.endoMesh); });
    group.add(endoMarkG);

    // brodawka Vatera (opcjonalnie, na odcinku w stanie końcowym)
    var pp = null, papLbl = null, extPap = null;
    if (an.papilla) {
      var po = byId[an.papilla.obj], pst = stateAt(po, 1);
      pp = A.papillaPoint(pst.curve, pst.r, an.papilla.near, an.papilla.dir);
      var bumpMat = track(new THREE.MeshStandardMaterial({ color: '#c9574d', roughness: 0.28 }));
      var bump = new THREE.Mesh(track(new THREE.SphereGeometry(0.34, 28, 18)), bumpMat);
      bump.position.copy(pp.axis).add(pp.dir.clone().multiplyScalar(pp.r - 0.06)); bump.lookAt(pp.axis); bump.scale.set(1, 1, 0.62);
      var hole = new THREE.Mesh(track(new THREE.SphereGeometry(0.075, 12, 8)), track(new THREE.MeshBasicMaterial({ color: '#3a0d0b' })));
      hole.position.copy(pp.axis).add(pp.dir.clone().multiplyScalar(pp.r - 0.27));
      extPap = new THREE.Mesh(track(new THREE.SphereGeometry(0.34, 20, 14)), track(new THREE.MeshStandardMaterial({ color: '#d63b35', emissive: '#5a0a08', roughness: 0.35 })));
      extPap.position.copy(pp.wall).add(pp.dir.clone().multiplyScalar(0.2));
      po.grp.add(bump, hole, extPap);
      papLbl = mkLabel('Brodawka Vatera', '', '#d63b35', 'pap');
    }

    var scope = new THREE.Group();
    var sMat = track(new THREE.MeshBasicMaterial({ color: '#ff2d2d', depthTest: false, depthWrite: false, transparent: true }));
    var sBall = new THREE.Mesh(track(new THREE.SphereGeometry(0.45, 16, 12)), sMat);
    var sCone = new THREE.Mesh(track(new THREE.ConeGeometry(0.36, 1.3, 16)), sMat);
    sCone.rotation.x = -Math.PI / 2; sCone.position.z = -0.75;
    scope.add(sBall, sCone); sBall.renderOrder = sCone.renderOrder = 12;
    group.add(scope);

    // kadrowanie: suma stanów przed i po
    var box = new THREE.Box3();
    objs.forEach(function (o) { if (o.def.solid) return; [o.A, o.B].forEach(function (arr, j) { arr.forEach(function (p, i) { var r = j ? o.rB[i] : o.rA[i]; box.expandByPoint(p.clone().addScalar(r)); box.expandByPoint(p.clone().addScalar(-r)); }); }); });
    if (an.box) box.set(new V3().fromArray(an.box[0]), new V3().fromArray(an.box[1])); // modele bez rur (wątroba): kadrowanie z danych
    var toolG = new THREE.Group(); group.add(toolG);
    scene.add(group);
    M = { an: an, group: group, objG: objG, markG: markG, routeG: routeG, objs: objs, byId: byId, marks: marks, pp: pp, papLbl: papLbl, extPap: extPap,
      scope: scope, box: box, routes: {}, endoG: {}, endoTrash: [], endoMarkG: endoMarkG, toolG: toolG };
    var toolOv = new THREE.Group(); toolScene.add(toolOv); M.toolOv = toolOv;
    M.tools = buildTools(an); M.tools.forEach(function (t) { (t.overlay ? toolOv : toolG).add(t.grp); if (t.ov) toolOv.add(t.ov); });
    if (!keep && an.tumour) tumourAttach();
    if (!keep) renderPanel(an);
  }

  function routeFromSteps(steps, f, nPrefix) {
    var pts = [], stepOf = [], nPre = 0;
    steps.forEach(function (st, si) {
      if (si === nPrefix) nPre = pts.length;
      if (st.pt) { pts.push(new V3().fromArray(st.pt)); stepOf.push(si); return; }
      var o = M.byId[st.obj], s = stateAt(o, o.def.morph ? f : 0);
      function res(v, d) { if (v === undefined) return d; if (typeof v === 'number') return v; if (v === 'papilla') return M.pp ? A.nearestT(s.curve, M.pp.axis, 1000) : 1; return A.nearestT(s.curve, v); }
      var t0 = res(st.from, 0), t1 = res(st.to, 1), n = Math.max(2, Math.ceil(s.len * Math.abs(t1 - t0) / 0.35));
      for (var i = 0; i <= n; i++) { var p = s.curve.getPointAt(clamp01(t0 + (t1 - t0) * i / n)); if (!pts.length || pts[pts.length - 1].distanceTo(p) > 0.12) { pts.push(p); stepOf.push(si); } }
    });
    if (nPrefix >= steps.length) nPre = pts.length;
    var curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal'), total = curve.getLength();
    var NF = 800, fr = curve.computeFrenetFrames(NF, false), want = new V3(0, 0, 1), T0 = fr.tangents[0];
    if (Math.abs(want.dot(T0)) > 0.95) want.set(0, 1, 0);
    want.sub(T0.clone().multiplyScalar(want.dot(T0))).normalize();
    var phi = Math.atan2(want.dot(fr.binormals[0]), want.dot(fr.normals[0]));
    var ups = fr.normals.map(function (N, i) { return N.clone().multiplyScalar(Math.cos(phi)).add(fr.binormals[i].clone().multiplyScalar(Math.sin(phi))).normalize(); });
    var prefixS = 0;
    if (nPre > 1) { var lens = curve.getLengths(2000); prefixS = lens[Math.round((nPre - 1) / (pts.length - 1) * 2000)]; }
    var TS = 600, RS = 6, geo = new THREE.TubeGeometry(curve, TS, 0.11, RS, false);
    var all = new THREE.Mesh(geo, track(new THREE.MeshBasicMaterial({ color: '#ff5a4f', transparent: true, opacity: 0.4, depthTest: false, depthWrite: false })));
    var done = new THREE.Mesh(geo, track(new THREE.MeshBasicMaterial({ color: '#ff2d2d', depthTest: false, depthWrite: false, transparent: true })));
    all.renderOrder = 10; done.renderOrder = 11;
    return { steps: steps, curve: curve, total: total, stepOf: stepOf, n: pts.length, ups: ups, NF: NF, geo: geo, all: all, done: done, TS: TS, per: RS * 6, range: 0, prefixS: prefixS };
  }
  function buildRoutes(which) {
    if (M.routes[which]) return M.routes[which];
    var an = M.an, f = 1, def = an.routePost, RS;
    if (Array.isArray(def)) RS = { list: [routeFromSteps(def, f, def.length)], branched: false, meta: [] };
    else RS = { branched: true, meta: def.branches, list: def.branches.map(function (b) { return routeFromSteps(def.prefix.concat(b.steps), f, def.prefix.length); }) };
    return (M.routes[which] = RS);
  }

  /* ---------- kadry ---------- */
  // lista kadrów jednego wariantu: prawidłowa, zakres, [stapler], usunięcie, [rekonstrukcja], endoskopia, TK
  function framesFor(Pr, vi) {
    if (Pr.split) return trialFrames(Pr);
    if (Pr.variants[vi || 0].singleFrames) return Pr.variants[vi || 0].singleFrames.map(function (f, i) { return Object.assign({ vi: vi || 0, num: String(i + 1) }, f); });
    if (Pr.variants[0].single) return [{ k: 'normal', vi: 0, kind: 'orbit', m0: 0, m1: 0, cam: 'front', num: '1', short: 'Guz i zakres', title: 'Wybór zakresu resekcji', cap: '' }];
    var an = Pr.variants[vi || 0], fx = an.frames, tx = an.text || {}, v = vi || 0;
    var cut = an.focus ? 'focus' : an.id === 'sleeve' ? 'stomach' : 'upper';
    var F = [
      { k: 'normal', vi: v, kind: 'orbit', m0: 0, m1: 0, cam: 'front', short: 'Prawidłowa', title: tx.normal ? tx.normal[0] : 'Anatomia prawidłowa', cap: tx.normal ? tx.normal[1] : 'Przełyk, żołądek, dwunastnica i jelito czcze przed operacją.' },
      { k: 'resect', vi: v, kind: 'orbit', m0: 0, m1: 1, dur: 3.2, cam: cut, short: fx.resect[2], title: fx.resect[0], cap: fx.resect[1] }
    ];
    if (an.commonCuts) F.push({ k: 'cut', vi: v, kind: 'orbit', m0: 1, m1: 2, dur: 1 + 2.6 * an.commonCuts, cam: cut, short: 'Stapler', title: 'Przecięcie staplerem liniowym',
      cap: 'Stapler liniowy (typu Endo GIA) zaciska tkankę, zakłada po obu stronach linii cięcia rzędy zszywek (Endo GIA: po 3) i przecina tkankę nożem między nimi.' });
    F.push({ k: 'remove', vi: v, kind: 'orbit', m0: 2, m1: 3, dur: 3.6, cam: cut, short: fx.remove[2], title: fx.remove[0], cap: fx.remove[1] });
    if (an.mEnd > 3) {
      var nT = (an.anastTools || []).length, caps = [[3, fx.recon[1]]];
      if (nT) caps.push([4, an.anastText || fx.recon[1]]);
      caps.push([an.mEnd, fx.post]);
      F.push({ k: 'var', vi: v, kind: 'orbit', m0: 3, m1: an.mEnd, dur: 5 + 3.2 * nT + (an.cutTools.length - an.commonCuts) * 2, cam: nT && an.focusVar ? 'focusVar' : nT && an.focus ? 'focus' : 'full',
        short: fx.recon[2], title: fx.recon[0], cap: fx.recon[1], caps: caps });
    } else F[F.length - 1].caps = [[2, fx.remove[1]], [3, fx.post]];
    F.push({ k: 'endo', vi: v, kind: 'endo', m0: an.mEnd, route: 'post', short: 'Endoskopia', title: (an.endoTitles || [])[1] || 'Endoskopia po operacji', cap: fx.endoPost });
    F.push({ k: 'ct', vi: v, kind: 'ct', m0: an.mEnd, m1: an.mEnd, cam: 'front', short: 'TK', title: 'TK — przekroje poprzeczne (schemat)',
      cap: 'Przekroje od najwyższego. Suwak, kółko myszy nad obrazem lub strzałki ↑/↓ zmieniają poziom; „Przejazd” (spacja) prowadzi z góry na dół. Kontrast doustny wypełnia drogę pokarmową; odcinki wyłączone i drogi żółciowe zawierają płyn.' });
    F.forEach(function (fr, i) { fr.num = String(i + 1); });
    return F;
  }

  /* ---------- zastosowanie osi czasu m ---------- */
  var tmpV = new V3(), tmpC = new THREE.Color();
  function applyM() { if (SPLIT.on) splitApplyM(); else applyMOne(); }
  function applyMOne() {
    var m = S.m, frc = FR[S.frame];
    if (frc && frc.caps) { var want = frc.cap; frc.caps.forEach(function (c) { if (m >= c[0] - 1e-4) want = c[1]; }); want = tr(want); if ($('capText').textContent !== want) $('capText').textContent = want; }
    M.objs.forEach(function (o) {
      setF(o, morphF(o, m));
      var op = kfNum(o.def.opacity, m, 1);
      o.faded = !!S.highlight && S.highlight !== o.def.id && !endo.active;
      var shown = o.faded ? Math.min(op, 0.13) : op;
      o.op = op;
      var wantT = shown < 0.999;
      o.outer.material.opacity = shown;
      if (wantT !== o.isT) { o.isT = wantT; o.outer.material.transparent = wantT; o.outer.material.depthWrite = !wantT; o.outer.material.needsUpdate = true; }
      kfCol(o.cols, m, o.outer.material.color);
      kfVec(o.def.offset, m, o.grp.position);
      o.grp.visible = shown > 0.01;
      o.inner.visible = !wantT && !o.def.solid && !o.def.organ;
    });
    if (M.tools) M.tools.forEach(function (t) { t.update(m); });
    M.marks.forEach(function (mk) {
      var op = kfNum(mk.def.opacity, m, 1);
      mk.op = op; mk.mat.opacity = op * mk.baseOp; mk.mesh.visible = op > 0.01;
      kfCol(mk.cols, m, mk.mat.color);
      if (mk.kind === 'ring') mk.mat.emissive.copy(mk.mat.color).multiplyScalar(0.35);
    });
  }

