  /* ---------- wątroba: resekcje (TOOL_EXT.lvres) i slajd z przesuwanym guzem (TOOL_EXT.lvtumor) ----------
     Resekcja: segmenty pozostające (brąz) i usuwane (czerwień planu → po kontroli dopływu barwa niedokrwienia), naczynia dzielone w punktach
     przecięcia (część bliższa zostaje, dalsza idzie z preparatem), pierścienie podwiązań i linii staplera, preparat odsuwa się i znika.
     ALPPS: etap I (podwiązanie PV, podział miąższu), przerost segmentów II i III (skala grupy wokół szczeliny pępkowej), etap II. */
  var LR_COL = { keep: '#a24a38', plan: '#d9463b', isch: '#6d3a4c', lig: '#262b31', stap: '#8b96a1' };
  var LR_HYPER_PIV = new V3(2.8, -1.2, 0.6), LR_SPEC_PIV = new V3(-4, 0.5, -0.5);
  function lrRing(parent, p, tan, r, kind) {
    var col = kind === 'stap' ? LR_COL.stap : LR_COL.lig;
    var mat = track(new THREE.MeshStandardMaterial({ color: col, metalness: kind === 'stap' ? 0.6 : 0.1, roughness: 0.4, transparent: true }));
    var m = new THREE.Mesh(track(new THREE.TorusGeometry(r + 0.08, Math.max(0.06, r * 0.22), 10, 36)), mat);
    m.position.copy(p); m.quaternion.setFromUnitVectors(new V3(0, 0, 1), tan.clone().normalize()); parent.add(m); return m;
  }
  function lrCentroid(G, list) { var c = new V3(), w = 0; list.forEach(function (s) { var k = G.share[s]; c.addScaledVector(new V3().fromArray(G.centroid[s]), k); w += k; }); return c.multiplyScalar(1 / Math.max(w, 1e-6)); }
  function makeLvRes(d) {
    var LM = A.LIVER, G = LM.model(MOBILE ? 0.32 : 0.25), R = d.R, alpps = d.op === 'alpps', dir = new V3().fromArray(R.dir).normalize();
    var grp = new THREE.Group(), keepG = new THREE.Group(), specG = new THREE.Group(), hyperG = new THREE.Group(), labels = [];
    grp.add(keepG, specG); keepG.add(hyperG);
    var remS = {}; R.rem.forEach(function (s) { remS[s] = 1; });
    var hyp = {}; (R.hyper || []).forEach(function (s) { hyp[s] = 1; });
    var matKeep = lvMat(LR_COL.keep, 0.5), matSpec = lvMat(LR_COL.plan, 0.5);
    LM.SEGS.forEach(function (s) {
      var m = new THREE.Mesh(lvGeo(G.segs[s]), remS[s] ? matSpec : matKeep); m.renderOrder = 2;
      (remS[s] ? specG : hyp[s] ? hyperG : keepG).add(m);
    });
    // naczynia: materiały wspólne dla układu w części pozostającej i w preparacie
    function mset() { var o = {}; ['pv', 'ha', 'bd', 'hv'].forEach(function (k) { o[k] = lvMat(LV_COL[k], 0.42); }); o.ivc = lvMat('#2a4f9e', 0.42); o.gb = lvMat(LV_COL.gb, 0.35); return o; }
    var MK = mset(), MS = mset(), cutBy = {}, rings = [], gone = {};
    R.cuts.forEach(function (c) { cutBy[c.id] = c; }); R.gone.forEach(function (id) { gone[id] = 1; });
    var hypIds = { p2: 1, p3: 1, ha_p2: 1, ha_p3: 1, bd_p2: 1, bd_p3: 1 };
    ['pv', 'ha', 'bd', 'hv'].forEach(function (kind) {
      LM.vessels[kind].forEach(function (v) {
        var mk = v.id === 'ivc' ? 'ivc' : kind, kg = alpps && hypIds[v.id] ? hyperG : keepG, c = cutBy[v.id];
        if (c) {
          var sp = oltSplit(v, c.t); kg.add(oltTube(sp.a.pts, sp.a.r, MK[mk])); specG.add(oltTube(sp.b.pts, sp.b.r, MS[mk]));
          var ring = lrRing(keepG, sp.p, sp.tan, sp.r, c.kind);
          var L = c.name ? { el: mkLabel(c.name, '', c.kind === 'stap' ? '#59636e' : '#262b31', 'cut'), anchor: sp.p.clone(), alpha: 0 } : null;
          if (L) labels.push(L); rings.push({ m: ring, on: c.on, L: L });
          return;
        }
        (gone[v.id] ? specG : kg).add(oltTube(v.pts, v.r, (gone[v.id] ? MS : MK)[mk]));
      });
    });
    var gbv = LM.vessels.gb; (gone.gb ? specG : keepG).add(oltTube(gbv.pts, LM.gbR, (gone.gb ? MS : MK).gb));
    var cSpec = lrCentroid(G, R.rem), keepList = LM.SEGS.filter(function (s) { return !remS[s]; }), cKeep = lrCentroid(G, keepList);
    var Ls = { el: mkLabel(R.specimen, '', LR_COL.plan, 'seg'), base: cSpec.clone().addScaledVector(dir, 2.5).add(new V3(0, 0, 2.5)), anchor: null, alpha: 0 };
    var Lk = { el: mkLabel(R.remnant, '', LR_COL.keep, 'seg'), base: cKeep.clone().addScaledVector(dir, -2.0).add(new V3(0, 0, 2.5)), anchor: null, alpha: 0 };
    labels.push(Ls, Lk);
    var cPlan = new THREE.Color(LR_COL.plan), cIsch = new THREE.Color(LR_COL.isch), AWAY = dir.clone().multiplyScalar(11).add(new V3(0, 3, 6));
    var tool = { d: d, grp: grp, overlay: false, el: null, labels: labels,
      update: function (m) {
        var glass = S.lvGlass ? 0.5 : 1, sep, away, fade, isch, sc = 1, ss = 1;
        if (alpps) {
          sep = dir.clone().multiplyScalar(0.55 * sm((m - 0.5) / 0.4));                  // podział miąższu in situ
          sc = 1 + 0.45 * sm((m - 1.05) / 0.85); ss = 1 - 0.1 * sm((m - 1.05) / 0.85);   // przerost FLR, zanik prawej części
          away = sm((m - 2.45) / 0.45); fade = 1 - sm((m - 2.6) / 0.35); isch = 0.5 * sm((m - 1.2) / 0.8) + 0.5 * sm((m - 2.05) / 0.35);
        } else {
          sep = dir.clone().multiplyScalar(0.9 * sm((m - 1.05) / 0.6));
          away = sm((m - 2) / 0.65); fade = 1 - sm((m - 2.3) / 0.6); isch = sm((m - 0.55) / 0.45);
        }
        specG.scale.setScalar(ss); specG.position.copy(LR_SPEC_PIV).multiplyScalar(1 - ss).add(sep).addScaledVector(AWAY, away);
        hyperG.scale.setScalar(sc); hyperG.position.copy(LR_HYPER_PIV).multiplyScalar(1 - sc);
        specG.visible = fade > 0.01;
        matSpec.color.copy(cPlan).lerp(cIsch, isch);
        lvSetOp(matKeep, glass * (S.lvGlass ? 0.8 : 1)); lvSetOp(matSpec, (S.lvGlass ? 0.8 : 1) * fade);
        Object.keys(MS).forEach(function (k) { lvSetOp(MS[k], fade); });
        rings.forEach(function (r) { var a = sm((m - r.on) / 0.1); r.m.visible = a > 0.01; r.m.material.opacity = a; if (r.L) r.L.alpha = a > 0.5 ? 1 : 0; });
        Ls.anchor = Ls.base.clone().add(specG.position); Ls.alpha = fade > 0.6 && m < 2.6 ? 1 : 0;
        Lk.anchor = Lk.base; Lk.alpha = m < 1e-3 || m > 2.9 || (alpps && m > 1.1 && m < 2) ? 1 : 0;
      } };
    M.lvres = tool;
    return tool;
  }
  TOOL_EXT.lvres = makeLvRes;

  /* ---------- slajd „Guz w wątrobie”: przesuwany guz, metastazektomia (margines) albo resekcja anatomiczna (segmenty) ---------- */
  var LT_KEY = 'surgitome-lv-guz', LT_DEF = [-4.6, 2.4, 2.0], LT_R = 1.0, LT_MARGIN = 1.0;
  function ltPos() { try { var p = JSON.parse(localStorage.getItem(LT_KEY)); if (Array.isArray(p) && p.length === 3) return p; } catch (e) {} return LT_DEF.slice(); }
  var LT_DIRS = (function () { var o = [], n = 90, g = Math.PI * (3 - Math.sqrt(5)); for (var i = 0; i < n; i++) { var y = 1 - 2 * (i + 0.5) / n, r = Math.sqrt(1 - y * y); o.push(new V3(Math.cos(g * i) * r, y, Math.sin(g * i) * r)); } return o; })();
  function ltSegs(c) {
    // segmenty, do których sięga guz z marginesem (punkty kuli wewnątrz miąższu)
    var LM = A.LIVER, out = {}, pts = [c.clone()];
    [LT_R * 0.5, LT_R + LT_MARGIN].forEach(function (rr) { LT_DIRS.forEach(function (u) { pts.push(c.clone().addScaledVector(u, rr)); }); });
    pts.forEach(function (p) {
      if (LM.sdf(p.x, p.y, p.z) > 0) return;
      var q = LM.planes(p.x, p.y, p.z), best = null, bv = 1e9; LM.SEGS.forEach(function (s) { var r = LM.region(s, q); if (r < bv) { bv = r; best = s; } }); out[best] = 1;
    });
    return LM.SEGS.filter(function (s) { return out[s]; });
  }
  function makeLvTumor(d) {
    var LM = A.LIVER, G = LM.model(MOBILE ? 0.32 : 0.25), grp = new THREE.Group(), labels = [];
    var whole = new THREE.Mesh(lvGeo(G.whole), lvMat(LV_COL.par, 0.5)); whole.renderOrder = 2; grp.add(whole);
    var segs = LM.SEGS.map(function (s) { var m = new THREE.Mesh(lvGeo(G.segs[s]), lvMat(LR_COL.keep, 0.5)); m.renderOrder = 2; m.userData.seg = s; grp.add(m); return { s: s, m: m }; });
    ['pv', 'ha', 'bd', 'hv'].forEach(function (kind) { var mat = lvMat(kind === 'hv' ? '#2f62c0' : LV_COL[kind], 0.42); LM.vessels[kind].forEach(function (v) { grp.add(oltTube(v.pts, v.r, v.id === 'ivc' ? lvMat('#2a4f9e', 0.42) : mat)); }); });
    grp.add(oltTube(LM.vessels.gb.pts, LM.gbR, lvMat(LV_COL.gb, 0.35)));
    var tg = track(guzGeo()); tg.scale(LT_R / 0.62, LT_R / 0.62, LT_R / 0.62 / 0.62);
    var tm = new THREE.Mesh(tg, track(new THREE.MeshStandardMaterial({ color: '#5a1020', roughness: 0.55 }))); tm.renderOrder = 4; grp.add(tm);
    var shell = new THREE.Mesh(track(new THREE.SphereGeometry(LT_R + LT_MARGIN, 32, 20)), track(new THREE.MeshStandardMaterial({ color: LR_COL.plan, roughness: 0.5, transparent: true, opacity: 0.35, depthWrite: false })));
    shell.renderOrder = 3; grp.add(shell);
    var Lt = { el: mkLabel('Guz', 'przeciągnij, aby przesunąć', '#b3263a', 'seg'), anchor: null, alpha: 0 }; labels.push(Lt);
    var key = null;
    var tool = { d: d, grp: grp, overlay: false, el: null, labels: labels, mesh: tm, segs: segs, whole: whole, c: new V3().fromArray(ltPos()), rule: null, list: [],
      update: function () {
        var fr = FR[S.frame], anat = fr && fr.k === 'anat', glass = S.lvGlass ? 0.45 : 1, c = this.c;
        tm.position.copy(c); shell.position.copy(c); shell.visible = !anat;
        var k = c.toArray().map(function (x) { return x.toFixed(2); }).join(',');
        if (k !== key) { key = k; this.list = ltSegs(c); this.rule = LM.resFor(this.list); }
        var rem = this.rule ? this.rule.rem : [];
        whole.visible = !anat; lvSetOp(whole.material, glass * 0.8);
        segs.forEach(function (S2) { S2.m.visible = anat; var on = rem.indexOf(S2.s) >= 0; S2.m.material.color.set(on ? LR_COL.plan : LR_COL.keep); lvSetOp(S2.m.material, on ? Math.max(glass, 0.85) : glass * 0.7); });
        Lt.anchor = c.clone().add(new V3(0, LT_R + 0.3, 0.6)); Lt.alpha = 1;
        // podpis: nazwa zabiegu i opis
        var T = LM.RES_TXT, R = this.rule, names = this.list.map(function (s) { return LM.ROM[s]; }).join(', '), tt, tx;
        if (!anat) { tt = tr('Metastazektomia'); tx = tr(T.meta) + ' ' + (names || '—') + '. ' + tr(T.hint); }
        else {
          var share = 0; rem.forEach(function (s) { share += G.share[s]; });
          tt = R ? tr(R.pre) + (R.suf ? ' ' + R.suf : '') + (R.plus1 ? ' ' + tr(T.plus1) : '') : tr('Resekcja anatomiczna');
          tx = tr(T.anat) + ' ' + (names || '—') + '. ' + tr(T.left) + ' ' + Math.round(100 * (1 - share)) + tr(T.pct);
        }
        if ($('capTitle').textContent !== tt) $('capTitle').textContent = tt;
        if ($('capText').textContent !== tx) $('capText').textContent = tx;
      } };
    M.lvtumor = tool;
    return tool;
  }
  TOOL_EXT.lvtumor = makeLvTumor;
  // przeciąganie guza: po powierzchni miąższu, środek guza pod torebką (wewnątrz wątroby)
  var ltDrag = null;
  function ltActive() { return M && M.lvtumor && !SPLIT.on && !endo.active && !ct.on; }
  window.__sgTest.lvTumor = function (p) { if (!ltActive()) return null; if (p) { M.lvtumor.c.fromArray(p); applyM(); } var T = M.lvtumor; return { c: T.c.toArray(), segs: T.list.slice(), rule: T.rule, title: $('capTitle').textContent, text: $('capText').textContent }; };
  viewport.addEventListener('pointerdown', function (e) {
    if (!ltActive() || !guzPick(e, [M.lvtumor.mesh]).length) return;
    e.stopPropagation(); e.preventDefault();
    ltDrag = { id: e.pointerId }; controls.enabled = false; viewport.style.cursor = 'grabbing'; viewport.classList.add('dragging');
    try { viewport.setPointerCapture(e.pointerId); } catch (err) {}
  }, true);
  viewport.addEventListener('pointermove', function (e) {
    if (!ltDrag) { if (ltActive() && e.pointerType === 'mouse') viewport.style.cursor = guzPick(e, [M.lvtumor.mesh]).length ? 'grab' : ''; return; }
    var T = M.lvtumor, tg = T.whole.visible ? [T.whole] : T.segs.map(function (s) { return s.m; });
    var hit = guzPick(e, tg)[0]; if (!hit || !hit.face) return;
    var n = hit.face.normal.clone().transformDirection(hit.object.matrixWorld).normalize(), c = hit.point.clone().addScaledVector(n, -(LT_R + 0.4));
    for (var i = 0; i < 12 && A.LIVER.sdf(c.x, c.y, c.z) > -(LT_R * 0.6); i++) c.addScaledVector(n, -0.25);
    T.c.copy(c); applyM();
  }, true);
  function ltEnd() {
    if (!ltDrag) return;
    ltDrag = null; viewport.style.cursor = ''; viewport.classList.remove('dragging'); if (!tw) controls.enabled = true;
    if (M && M.lvtumor) try { localStorage.setItem(LT_KEY, JSON.stringify(M.lvtumor.c.toArray().map(function (x) { return +x.toFixed(3); }))); } catch (e) {}
  }
  viewport.addEventListener('pointerup', ltEnd, true);
  viewport.addEventListener('pointercancel', ltEnd, true);
