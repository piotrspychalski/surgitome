  /* ---------- rozmiar ---------- */
  var W = 1, H = 1, view = { x: 0, y: 0, w: 1, h: 1 };
  // opis zabiegu jako nakładka: model płynnie zmniejsza się i przesuwa w wolne miejsce nad opisem
  var pnl = { k: 0, target: 0, freeH: 0 };
  function panelOverlayOpen() { return !panel.classList.contains('closed') && getComputedStyle(panel).position === 'absolute'; }
  function panelStep(dt) {
    pnl.target = panelOverlayOpen() ? 1 : 0;
    if (pnl.target) { var pr = panel.getBoundingClientRect(), vr = viewport.getBoundingClientRect(); pnl.freeH = Math.max(140, pr.top - vr.top - 8); }
    pnl.k += (pnl.target - pnl.k) * (1 - Math.exp(-dt * 9));
    if (Math.abs(pnl.target - pnl.k) < 0.002) pnl.k = pnl.target;
  }
  function updateView() {
    if (ct.on) {
      if (MOBILE && W > H) view = { x: 0, y: 0, w: W * 0.45, h: H };
      else if (MOBILE) view = { x: 0, y: 0, w: W, h: H * 0.38 };
      else if (W >= 760) view = { x: 0, y: 0, w: W / 2, h: H };
      else view = { x: 0, y: 0, w: W, h: H / 2 };
    }
    else {
      view = { x: 0, y: 0, w: W, h: H };
      if (pnl.k > 0.001 && pnl.freeH) view.h = H + (Math.min(H, pnl.freeH) - H) * pnl.k;
    }
    var asp = view.w / view.h; if (Math.abs(orbitCam.aspect - asp) > 1e-3) { orbitCam.aspect = asp; orbitCam.updateProjectionMatrix(); }
  }
  function resize() {
    var r = viewport.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
    renderer.setSize(W, H, false);
    orbitCam.aspect = W / H; orbitCam.updateProjectionMatrix();
    endoCam.aspect = W / H; endoCam.updateProjectionMatrix();
  }
  if (window.ResizeObserver) new ResizeObserver(resize).observe(viewport); else window.addEventListener('resize', resize);
  var onMQ = function () { MOBILE = mobMQ.matches; root.classList.toggle('mobile', MOBILE); if (!MOBILE) mMenu(false); };
  var reflow = function () { resize(); setTimeout(resize, 120); setTimeout(resize, 450); if (ct.on) setTimeout(ctResize, 460); };
  window.addEventListener('orientationchange', reflow);
  window.addEventListener('resize', reflow);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', reflow);
  if (mobMQ.addEventListener) mobMQ.addEventListener('change', onMQ);

  /* ---------- render ---------- */
  function passEndo() {
    hemi.intensity = keyL.intensity = rimL.intensity = 0; endoAmb.intensity = 0.28; headlight.intensity = 1.9;
    fog.near = 0.6; fog.far = 14;
    M.objs.forEach(function (o) { o.outer.visible = !!o.def.organ && o.op > 0.5; o.inner.visible = false; o.grp.visible = o.op > 0.5; });
    if (endo.g) endo.g.visible = true;
    M.endoMarkG.visible = true; M.marks.forEach(function (mk) { if (mk.endoMesh) mk.endoMesh.visible = mk.op > 0.5; });
    M.markG.visible = false; M.routeG.visible = false; M.scope.visible = false; if (M.extPap) M.extPap.visible = false; M.toolG.visible = false; if (M.toolOv) M.toolOv.visible = false;
  }
  function passOrbit(inset) {
    hemi.intensity = 0.9; keyL.intensity = 0.85; rimL.intensity = 0.35; endoAmb.intensity = 0; headlight.intensity = 0;
    fog.near = 1e4; fog.far = 1e5;
    if (endo.g) endo.g.visible = false;
    M.endoMarkG.visible = false;
    M.objs.forEach(function (o) { var sh = o.faded && !inset ? Math.min(o.op, 0.13) : o.op; o.outer.visible = true; o.inner.visible = sh >= 0.999 && !o.def.solid && !o.def.organ; o.grp.visible = sh > 0.01; });
    M.markG.visible = !inset; M.routeG.visible = inset; M.scope.visible = inset; if (M.extPap) M.extPap.visible = true; M.toolG.visible = !inset; if (M.toolOv) M.toolOv.visible = !inset;
    if (inset && endo.route) endo.route.done.geometry.setDrawRange(0, endo.route.range);
  }

  var projV = new V3();
  var lblVis = [], lblCx = 0;
  function placeLabel(el, pos, alpha) {
    if (alpha < 0.02) { el.style.display = 'none'; return; }
    projV.copy(pos).project(orbitCam);
    if (projV.z > 1 || projV.z < -1 || Math.abs(projV.x) > 1.05 || Math.abs(projV.y) > 1.05) { el.style.display = 'none'; return; }
    el.style.display = ''; el.style.opacity = alpha.toFixed(2);
    var x = view.x + (projV.x + 1) / 2 * view.w, y = view.y + (1 - projV.y) / 2 * view.h;
    // strona dymka: na lewo od środka modelu — w lewo, na prawo — w prawo (z histerezą, bez przeskakiwania przy obrocie)
    var left = el._left;
    if (left === undefined) left = x < lblCx; else if (left && x > lblCx + 24) left = false; else if (!left && x < lblCx - 24) left = true;
    if (left !== el._left) { el._left = left; el.classList.toggle('lbl-left', left); el._sw = 0; }
    el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)' + (left ? ' translateX(-100%)' : '');
    if (alpha > 0.25) lblVis.push({ el: el, x: x, y: y, left: left });
  }
  // rozsuwanie nachodzących dymków: od góry do dołu, kolejny dymek zsuwany pod poprzedni, jeśli zachodzą w poziomie
  function declutter() {
    var list = lblVis; lblVis = [];
    list.forEach(function (it) {
      var sp = it.el.lastElementChild; it.sp = sp;
      if (!it.el._sw) { it.el._sw = sp.offsetWidth || 80; it.el._sh = sp.offsetHeight || 22; }
      if (it.left) { it.r = it.x - 9; it.l = it.r - it.el._sw; } else { it.l = it.x + 9; it.r = it.l + it.el._sw; }
      it.t = it.y - 7; it.h = it.el._sh;
    });
    list.sort(function (p, q) { return p.t - q.t; });
    for (var i = 0; i < list.length; i++) {
      var it = list[i], top = it.t;
      for (var j = 0; j < i; j++) { var p = list[j]; if (p.r > it.l + 4 && p.l < it.r - 4 && top < p.nt + p.h + 2 && top + it.h > p.nt) top = p.nt + p.h + 2; }
      it.nt = top;
      var want = Math.min(90, top - it.t), cur = it.el._dy || 0;
      cur += (want - cur) * 0.35; if (Math.abs(want - cur) < 0.5) cur = want; it.el._dy = cur;
      it.sp.style.transform = cur ? 'translateY(' + cur.toFixed(1) + 'px)' : '';
      it.el.classList.toggle('lbl-moved', cur > 3);
    }
  }
  function updateLabels(now) {
    var show = S.labels && !endo.active;
    labelsEl.style.display = show ? '' : 'none';
    if (!show) return;
    var m = S.m;
    projV.copy(M.box.getCenter(tmpV)).project(orbitCam); lblCx = view.x + (projV.x + 1) / 2 * view.w; // środek modelu na ekranie
    M.objs.forEach(function (o) {
      o.labels.forEach(function (x) {
        var a = winAlpha(x.L.win, m) * (o.op > 0.3 ? 1 : 0) * (o.faded ? 0.3 : 1);
        placeLabel(x.el, tmpV.copy(o.st.curve.getPointAt(x.L.t)).add(o.grp.position), a);
      });
    });
    M.marks.forEach(function (mk) {
      var post = mk.el2 && m >= 2;
      if (mk.el) placeLabel(mk.el, mk.anchor, post ? 0 : mk.op);
      if (mk.el2) placeLabel(mk.el2, mk.anchor, post ? mk.op : 0);
    });
    (M.tools || []).forEach(function (t) {
      if (t.el) placeLabel(t.el, t.anchor || tmpV.set(0, 0, 0), t.alpha > 0.3 && t.anchor ? t.alpha : 0);
      if (t.el2) placeLabel(t.el2, t.anchor2 || tmpV.set(0, 0, 0), t.alpha > 0.3 && t.anchor2 ? t.alpha : 0);
      (t.labels || []).forEach(function (L) { placeLabel(L.el, L.anchor || tmpV.set(0, 0, 0), L.anchor ? L.alpha || 0 : 0); });
    });
    if (M.papLbl) {
      var pa = Math.max(winAlpha([-9, 0.4], m), winAlpha([2.7, 99], m)) * (M.byId[M.an.papilla.obj].op > 0.5 ? 1 : 0);
      placeLabel(M.papLbl, M.extPap.getWorldPosition(tmpV), pa);
    }
    declutter();
  }

  var last = performance.now();
  function frame(now) {
    var dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (M && SPLIT.on) { splitFrame(dt, now); requestAnimationFrame(frame); return; }
    if (M) {
      var fr = FR[S.frame];
      if (fr && fr.kind === 'orbit' && S.playing && S.m < fr.m1) {
        S.m = Math.min(fr.m1, S.m + (fr.m1 - fr.m0) * dt / fr.dur); applyM();
        if (S.m >= fr.m1) updateDock();
      }
      if (tw) camStep(dt);
      else {
        if (controls.autoRotate) { driftT += dt; if (driftT > 14) controls.autoRotate = false; }
        controls.update();
      }
      renderer.setScissorTest(false); renderer.setViewport(0, 0, W, H);
      if (endo.active) {
        if (endo.playing) {
          var rampF = 1;
          if (endo.ramp >= 0) { endo.ramp += dt; rampF = 0.06 + 0.94 * sm((endo.ramp - 0.6) / 3.4); if (endo.ramp > 4) endo.ramp = -1; }
          endo.s += endo.base * endo.rate * rampF * dt;
          if (endo.set.branched && endo.choice === null && endo.s >= endo.route.prefixS) { endo.s = endo.route.prefixS; endo.playing = false; showChoice(true); updateDock(); }
          else if (endo.s >= endo.route.total) { endo.s = endo.route.total; endo.playing = false; updateDock(); }
        }
        updateEndoCam(dt, false);
        // mini-mapa: render w rogu bufora, kopia do własnego płótna, potem pełny widok endoskopu na wierzch
        var ir = $('inset').getBoundingClientRect(), iw = Math.round(ir.width), ih = Math.round(ir.height);
        if (iw > 10 && ih > 10) {
          renderer.setScissorTest(true); renderer.setScissor(0, 0, iw, ih); renderer.setViewport(0, 0, iw, ih);
          renderer.setClearColor(sceneBg, 1); renderer.clear();
          passOrbit(true);
          insetCam.aspect = iw / ih; insetCam.updateProjectionMatrix();
          var p = preset('front', iw / ih); placeCam(insetCam, p.t, p.az, p.el, p.d);
          renderer.render(scene, insetCam);
          renderer.setScissorTest(false);
          var pr = renderer.getPixelRatio(), cw = Math.round(iw * pr), ch = Math.round(ih * pr);
          if (insetCv.width !== cw || insetCv.height !== ch) { insetCv.width = cw; insetCv.height = ch; }
          try { insetCtx.drawImage(canvas, 0, canvas.height - ch, cw, ch, 0, 0, cw, ch); } catch (e) {}
        }
        renderer.setViewport(0, 0, W, H);
        passEndo();
        renderer.setClearColor(fog.color, 1); renderer.clear(); renderer.render(scene, endoCam);
      } else {
        panelStep(dt);
        updateView();
        if (ct.on && ct.sweep) { ct.y -= 2.2 * dt; if (ct.y <= ct.yMin) { ct.y = ct.yMin; ct.sweep = false; $('ctSweep').textContent = tr('Przejazd'); } drawCT(); }
        renderer.setViewport(view.x, H - view.y - view.h, view.w, view.h);
        if (ct.on) { renderer.setScissorTest(true); renderer.setScissor(view.x, H - view.y - view.h, view.w, view.h); }
        passOrbit(false);
        if (!reduced) M.marks.forEach(function (mk) { if (mk.cut && mk.def.kind === 'ring') mk.mesh.scale.setScalar(1 + 0.07 * Math.sin(now / 160)); });
        renderer.setClearColor(sceneBg, 1); renderer.clear(); renderer.render(scene, orbitCam);
        if (M.toolOv && M.toolOv.children.some(function (c) { return c.visible; })) { renderer.clearDepth(); renderer.render(toolScene, orbitCam); }
        renderer.setScissorTest(false);
        updateLabels(now);
      }
    }
    requestAnimationFrame(frame);
  }

  document.querySelectorAll('#panel h3, #panel .hint, .tog span, #btnPanel, #btnLabels, #btnFs, #btnPrev, #btnNext, .cthead b, .ctwin, .choicehint, #choiceTitle, #speed option, .qrhint').forEach(function (el) { el.dataset.pl = el.textContent.trim(); });
  function setLang(l) {
    LANG = l; try { localStorage.setItem('surgitome-lang', l); } catch (e) {}
    root.lang = l; $('btnLang').setAttribute('aria-checked', l === 'en' ? 'true' : 'false');
    [].forEach.call(labelsEl.children, function (e) { e._sw = 0; }); $('fLang').textContent = l.toUpperCase();
    $('fbBtn').setAttribute('aria-label', tr('Zgłoś uwagę')); $('fbBtn').title = tr('Zgłoś uwagę'); if (!$('fb').hidden) $('fbCtx').textContent = fbContext().whereUi;
    $('fInfo').setAttribute('aria-label', tr('Opis zabiegu')); $('fLbl').setAttribute('aria-label', tr('Etykiety')); $('fLang').setAttribute('aria-label', tr('Język'));
    document.querySelectorAll('[data-pl]').forEach(function (el) { el.textContent = tr(el.dataset.pl); });
    $('finePrint').innerHTML = FINE[l];
    $('q').placeholder = tr('Szukaj zabiegu…') + ' ( / )'; $('mq').placeholder = tr('Szukaj zabiegu…');
    applyTheme();
    if (!M) return;
    renderTabs(); renderStrip(); updateStrip(); renderPanel(M.an); capHead(); updateDock(); updateMobile();
    hudKey = null; if (endo.active && endo.set) { $('hudEnd').textContent = tr(endo.endText); if (!$('choice').hidden) showChoice(true); if (endo.set.branched && endo.choice !== null) $('btnOther').textContent = tr('Druga droga: ') + tr(endo.set.meta[1 - endo.choice].label); }
    if (ct.on) { $('ctSweep').textContent = tr(ct.sweep ? 'Pauza' : 'Przejazd'); drawCT(); }
    if (SPLIT.on) { splitHeaders(); setSync(SPLIT.sync); }
  }
  $('btnLang').onclick = function () { setLang(LANG === 'pl' ? 'en' : 'pl'); };
