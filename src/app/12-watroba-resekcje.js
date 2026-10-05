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
  // budowa sceny resekcji z opisu R (segmenty, przecięcia, odcinki usuwane); update(m) na osi 0–3
  function lrBuild(R, alpps) {
    var LM = A.LIVER, G = LM.model(MOBILE ? 0.32 : 0.25), dir = new V3().fromArray(R.dir).normalize();
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
    return { grp: grp, labels: labels, specG: specG,
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
  }
  function makeLvRes(d) {
    var B = lrBuild(d.R, d.op === 'alpps'), tool = { d: d, grp: B.grp, overlay: false, el: null, labels: B.labels, update: B.update };
    M.lvres = tool; return tool;
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
  // resekcja anatomiczna z reguły: szypuły podwiązane na najwyższym poziomie, którego cały obszar jest usuwany (segment, sektor, gałąź prawa, część pępkowa)
  var LT_TREE = [['rpv', null, ['5', '6', '7', '8']], ['rapv', 'rpv', ['5', '8']], ['rppv', 'rpv', ['6', '7']], ['p8', 'rapv', ['8']], ['p5', 'rapv', ['5']], ['p7', 'rppv', ['7']], ['p6', 'rppv', ['6']],
    ['upv', null, ['3', '4a', '4b']], ['p2', null, ['2']], ['p3', 'upv', ['3']], ['p4a', 'upv', ['4a']], ['p4b', 'upv', ['4b']], ['p1', null, ['1']]];
  var LT_PED = { rapv: 'Szypuła sektora przedniego prawego (podwiązana)', rppv: 'Szypuła sektora tylnego prawego (podwiązana)', upv: 'Szypuły segmentów III–IV w szczelinie pępkowej (podwiązane)',
    p2: 'Szypuła segmentu II (podwiązana)', p3: 'Szypuła segmentu III (podwiązana)', p4a: 'Szypuła segmentu IVa (podwiązana)', p4b: 'Szypuła segmentu IVb (podwiązana)', p5: 'Szypuła segmentu V (podwiązana)',
    p6: 'Szypuła segmentu VI (podwiązana)', p7: 'Szypuła segmentu VII (podwiązana)', p8: 'Szypuła segmentu VIII (podwiązana)', p1: 'Szypuła segmentu I (podwiązana)' };
  function ltAnatR(rem) {
    var inR = function (L) { return L.every(function (s) { return rem.indexOf(s) >= 0; }); }, sel = {}, cuts = [], gone = [], on = 0.05;
    LT_TREE.forEach(function (n) { if (inR(n[2]) && !(n[1] && sel[n[1]])) sel[n[0]] = 1; });
    var desc = function (id) { var o = []; LT_TREE.forEach(function (n) { if (n[1] === id) o = o.concat([n[0]], desc(n[0])); }); return o; };
    Object.keys(sel).forEach(function (id) {
      if (id === 'rpv') cuts.push({ id: 'rha', t: 0.55, name: 'Tętnica wątrobowa prawa (podwiązana)', on: on, kind: 'lig' }, { id: 'rpv', t: 0.45, name: 'Prawa gałąź żyły wrotnej (podwiązana)', on: on + 0.05, kind: 'lig' },
        { id: 'rhd', t: 0.45, name: 'Przewód wątrobowy prawy (przecięty)', on: on + 0.1, kind: 'lig' });
      else if (id === 'p1') cuts.push({ id: 'p1', t: 0.35, name: LT_PED.p1, on: on, kind: 'lig' }, { id: 'ha1', t: 0.6, on: on + 0.02, kind: 'lig' }, { id: 'bd1', t: 0.6, on: on + 0.04, kind: 'lig' });
      else cuts.push({ id: id, t: 0.12, name: LT_PED[id], on: on, kind: 'lig' }, { id: 'ha_' + id, t: 0.12, on: on + 0.02, kind: 'lig' }, { id: 'bd_' + id, t: 0.12, on: on + 0.04, kind: 'lig' });
      desc(id).forEach(function (x) { gone.push(x, 'ha_' + x, 'bd_' + x); }); on += 0.12;
    });
    var all = function (L) { return inR(L); };
    if (all(['5', '6', '7', '8'])) cuts.push({ id: 'rhv', t: 0.12, name: 'Żyła wątrobowa prawa (stapler)', on: 1.6, kind: 'stap' });
    if (all(['4a', '4b', '8']) && (all(['5', '6', '7', '8']) || all(['5']))) cuts.push({ id: 'mhv', t: 0.12, name: 'Żyła wątrobowa pośrodkowa (stapler)', on: 1.55, kind: 'stap' });
    if (all(['2', '3'])) cuts.push({ id: 'lhv', t: all(['4a']) ? 0.12 : 0.36, name: 'Żyła wątrobowa lewa (stapler)', on: 1.65, kind: 'stap' });
    if (rem.indexOf('5') >= 0 || rem.indexOf('4b') >= 0) gone.push('gb', 'cyd');
    var d = new V3(); rem.forEach(function (s) { d.add(new V3().fromArray(A.LIVER.DIR[s])); }); if (d.lengthSq() < 1e-6) d.set(0, 0, 1);
    return { rem: rem, dir: d.normalize().toArray(), cuts: cuts, gone: gone, specimen: 'Preparat', remnant: 'Pozostała wątroba' };
  }
  function ltDispose(o, labels) {
    o.grp.traverse(function (x) { if (x.geometry) x.geometry.dispose(); });
    o.labels.forEach(function (L) { if (L.el) L.el.remove(); var i = labels.indexOf(L); if (i >= 0) labels.splice(i, 1); });
  }
  function makeLvTumor(d) {
    var LM = A.LIVER, G = LM.model(MOBILE ? 0.32 : 0.25), meta = d.mode === 'meta', grp = new THREE.Group(), labels = [], baseG = new THREE.Group(); grp.add(baseG);
    var whole = new THREE.Mesh(lvGeo(G.whole), lvMat(LR_COL.keep, 0.5)); whole.renderOrder = 2; baseG.add(whole);
    var segs = LM.SEGS.map(function (s) { var m = new THREE.Mesh(lvGeo(G.segs[s]), lvMat(LR_COL.keep, 0.5)); m.renderOrder = 2; m.userData.seg = s; m.visible = !meta; baseG.add(m); return { s: s, m: m }; });
    if (!meta) whole.visible = false;
    var vesG = new THREE.Group(); grp.add(vesG);
    ['pv', 'ha', 'bd', 'hv'].forEach(function (kind) { var mat = lvMat(LV_COL[kind], 0.42); LM.vessels[kind].forEach(function (v) { vesG.add(oltTube(v.pts, v.r, v.id === 'ivc' ? lvMat('#2a4f9e', 0.42) : mat)); }); });
    vesG.add(oltTube(LM.vessels.gb.pts, LM.gbR, lvMat(LV_COL.gb, 0.35)));
    var tg = track(guzGeo()); tg.scale(LT_R / 0.62, LT_R / 0.62, LT_R / 0.62 / 0.62);
    var tm = new THREE.Mesh(tg, track(new THREE.MeshStandardMaterial({ color: '#5a1020', roughness: 0.55 }))); tm.renderOrder = 4; grp.add(tm);
    var shell = new THREE.Mesh(track(new THREE.SphereGeometry(LT_R + LT_MARGIN, 32, 20)), track(new THREE.MeshStandardMaterial({ color: LR_COL.plan, roughness: 0.5, transparent: true, opacity: 0.35, depthWrite: false })));
    shell.renderOrder = 3; shell.visible = meta; grp.add(shell);
    var Lt = { el: mkLabel(meta ? 'Przerzut' : 'Guz', 'przeciągnij, aby przesunąć', '#b3263a', 'seg'), anchor: null, alpha: 0 }; labels.push(Lt);
    var Lbed = { anchor: null, alpha: 0 }, Lspec = { anchor: null, alpha: 0 };
    if (meta) { Lbed.el = mkLabel('Loża po metastazektomii', '', '#7d8794', 'cut'); Lspec.el = mkLabel('Preparat: przerzut z marginesem', '', LR_COL.plan, 'seg'); labels.push(Lbed, Lspec); }
    var key = null, resKey = null, res = null;
    var tool = { d: d, grp: grp, overlay: false, el: null, labels: labels, mesh: tm, segs: segs, whole: whole, c: new V3().fromArray(ltPos()), rule: null, list: [],
      // kadr 2: przygotowanie resekcji dla bieżącego położenia guza (tylko gdy położenie się zmieniło)
      prepRes: function () {
        var k = key; if (k === resKey) return; resKey = k;
        if (res) { ltDispose(res, labels); grp.remove(res.grp); res = null; }
        var c = this.c.toArray(), RR = LT_R + LT_MARGIN;
        if (meta) {
          var rg = new THREE.Group(), keepM = new THREE.Mesh(lvGeo(LM.carve(c, RR, false)), lvMat(LR_COL.keep, 0.5)), specM = new THREE.Mesh(lvGeo(LM.carve(c, RR, true)), lvMat(LR_COL.plan, 0.5));
          keepM.renderOrder = specM.renderOrder = 2; var sg = new THREE.Group(); sg.add(specM); rg.add(keepM, sg);
          // kierunek wyjęcia preparatu: na zewnątrz od miąższu (gradient funkcji odległości)
          var e = 0.05, n = new V3(LM.sdf(c[0] + e, c[1], c[2]) - LM.sdf(c[0] - e, c[1], c[2]), LM.sdf(c[0], c[1] + e, c[2]) - LM.sdf(c[0], c[1] - e, c[2]), LM.sdf(c[0], c[1], c[2] + e) - LM.sdf(c[0], c[1], c[2] - e)).normalize();
          res = { grp: rg, labels: [], keepM: keepM, specM: specM, sg: sg, n: n };
        } else {
          var B = lrBuild(ltAnatR(this.rule ? this.rule.rem : this.list), false); B.labels.forEach(function (L) { labels.push(L); });
          res = { grp: B.grp, labels: B.labels, B: B };
        }
        grp.add(res.grp);
      },
      update: function (m) {
        var fr = FR[S.frame], resF = fr && fr.k === 'res', glass = S.lvGlass ? 0.45 : 1, c = this.c;
        var k = c.toArray().map(function (x) { return x.toFixed(2); }).join(',');
        if (k !== key) { key = k; this.list = ltSegs(c); this.rule = LM.resFor(this.list); }
        var rem = this.rule ? this.rule.rem : [];
        if (resF) this.prepRes();
        baseG.visible = !resF; vesG.visible = meta || !resF; if (res) { res.grp.visible = resF; if (!resF) res.labels.forEach(function (L) { L.alpha = 0; }); }
        tm.position.copy(c); shell.position.copy(c); shell.visible = meta && !resF;
        lvSetOp(whole.material, glass * 0.8);
        segs.forEach(function (S2) { var on = rem.indexOf(S2.s) >= 0; S2.m.material.color.set(on ? LR_COL.plan : LR_COL.keep); lvSetOp(S2.m.material, on ? Math.max(glass, 0.85) : glass * 0.7); });
        Lt.anchor = c.clone().add(new V3(0, LT_R + 0.3, 0.6)); Lt.alpha = resF ? 0 : 1;
        if (resF && res) {
          if (meta) {
            var out = sm((m - 0.35) / 0.5), fade = 1 - sm((m - 0.6) / 0.4), off = res.n.clone().multiplyScalar(7 * out);
            res.sg.position.copy(off); tm.position.copy(c).add(off); tm.visible = fade > 0.02; tm.material.transparent = true; tm.material.opacity = fade;
            lvSetOp(res.keepM.material, glass * 0.85); lvSetOp(res.specM.material, Math.max(0.85, glass) * fade); res.sg.visible = fade > 0.02;
            Lspec.anchor = c.clone().add(off).addScaledVector(res.n, LT_R + LT_MARGIN + 0.3); Lspec.alpha = fade > 0.5 ? 1 : 0;
            Lbed.anchor = c.clone(); Lbed.alpha = m > 0.8 ? 1 : 0;
          } else {
            res.B.update(m * 3); var sp = res.B.specG; sp.updateMatrix(); tm.position.copy(c).applyMatrix4(sp.matrix); tm.visible = sp.visible;
          }
        } else { tm.visible = true; tm.material.opacity = 1; Lbed.alpha = 0; Lspec.alpha = 0; }
        // podpis
        var T = LM.RES_TXT, R = this.rule, names = this.list.map(function (s) { return LM.ROM[s]; }).join(', ') || '—', tt, tx, share = 0;
        rem.forEach(function (s) { share += G.share[s]; });
        var rname = R ? tr(R.pre) + (R.suf ? ' ' + R.suf : '') + (R.plus1 ? ' ' + tr(T.plus1) : '') : tr('Resekcja anatomiczna');
        if (meta) { tt = tr(resF ? 'Metastazektomia' : 'Położenie przerzutu'); tx = tr(resF ? T.metaRes : T.meta) + ' ' + names + '.' + (resF ? '' : ' ' + tr(T.hintM)); }
        else { tt = rname; tx = (resF ? tr(T.anatRes) + ' ' + rem.map(function (s) { return LM.ROM[s]; }).join(', ') + '.' : tr(T.anat) + ' ' + names + '.') + ' ' + tr(T.left) + ' ' + Math.round(100 * (1 - share)) + tr(T.pct) + (resF ? '' : ' ' + tr(T.hintA)); }
        if ($('capTitle').textContent !== tt) $('capTitle').textContent = tt;
        if ($('capText').textContent !== tx) $('capText').textContent = tx;
      } };
    M.lvtumor = tool;
    return tool;
  }
  TOOL_EXT.lvtumor = makeLvTumor;
  // przeciąganie guza: po powierzchni miąższu, środek guza pod torebką (wewnątrz wątroby)
  var ltDrag = null;
  function ltActive() { return M && M.lvtumor && !SPLIT.on && !endo.active && !ct.on && FR[S.frame] && FR[S.frame].k === 'pos'; }
  window.__sgTest.lvTumor = function (p) { if (!(M && M.lvtumor)) return null; if (p) { M.lvtumor.c.fromArray(p); applyM(); } var T = M.lvtumor; return { c: T.c.toArray(), segs: T.list.slice(), rule: T.rule, title: $('capTitle').textContent, text: $('capText').textContent }; };
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
