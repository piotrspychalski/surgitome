  /* ---------- TK — schematyczne przekroje poprzeczne ---------- */
  var ct = { on: false, y: 4, sweep: false, contrast: true, colors: false, labels: true, samples: null, yMin: -15, yMax: 15 };
  var ctPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: '#40c4ff', transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false }));
  ctPlane.rotation.x = -Math.PI / 2; ctPlane.renderOrder = 8;
  var ctEdge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(1, 1)), new THREE.LineBasicMaterial({ color: '#40c4ff' }));
  ctEdge.rotation.x = -Math.PI / 2;
  var ctPlaneG = new THREE.Group(); ctPlaneG.add(ctPlane, ctEdge); ctPlaneG.visible = false; scene.add(ctPlaneG);
  var ctCv = $('ctCv'), ctCtx = ctCv.getContext('2d'), ctNoise = null;
  function hu(v) { var g = Math.max(0, Math.min(1, (v + 160) / 400)); var c = Math.round(g * 255); return 'rgb(' + c + ',' + c + ',' + c + ')'; }
  function ctPrepare() {
    var an = M.an, m = S.m;
    ct.samples = [];
    M.objs.forEach(function (o) {
      if (o.def.solid || o.op < 0.5) return;
      var st = o.st, n = Math.max(40, Math.ceil(st.len / 0.07)), arr = [];
      for (var i = 0; i <= n; i++) { var t = i / n, p = st.curve.getPointAt(t); arr.push([p.x, p.y, p.z, st.r(t)]); }
      ct.samples.push({ id: o.def.id, arr: arr, col: o.cols[o.cols.length - 1][1].getStyle(), organ: !!o.def.organ, hu: o.def.hu || 105 });
    });
    ct.yMax = M.box.max.y - 0.4; ct.yMin = M.box.min.y + 0.4;
    ct.y = Math.max(ct.yMin, Math.min(ct.yMax, ct.y));
    var sz = M.box.getSize(new V3()), cc = M.box.getCenter(new V3());
    ctPlaneG.scale.set(1, 1, 1); ctPlane.scale.set(sz.x + 4, sz.z + 4, 1); ctEdge.scale.set(sz.x + 4, sz.z + 4, 1);
    ctPlaneG.position.set(cc.x, ct.y, cc.z);
    $('ctLevel').min = String(-ct.yMax); $('ctLevel').max = String(-ct.yMin);
  }
  function ellipse(g, x, y, rx, ry, fill) { g.beginPath(); g.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2); g.fillStyle = fill; g.fill(); }
  var VERT_U = [[16, 'Th6'], [13, 'Th8'], [10, 'Th10'], [7, 'Th11'], [4, 'Th12'], [1, 'L1'], [-2.5, 'L2'], [-6, 'L3'], [-9, 'L4'], [-11.5, 'L5'], [-14, 'S1']];
  var VERT_C = [[9, 'Th11'], [6, 'Th12'], [3, 'L1'], [0, 'L2'], [-3.5, 'L3'], [-6.5, 'L4'], [-9, 'L5'], [-11.5, 'S1'], [-14, 'S3'], [-17, 'kość guziczna'], [-19.5, 'krocze']];
  var VERT_S = [[16, 'Th6'], [10, 'Th10'], [7, 'Th11'], [4, 'Th12'], [1, 'L1'], [-3, 'L2'], [-6.5, 'L3'], [-11, 'L4'], [-15.5, 'L5'], [-20, 'S1'], [-24, 'S3'], [-28, 'kość guziczna']];
  var VERT_E = [[27, 'C5'], [24, 'C7'], [21, 'Th2'], [18, 'Th4']].concat(VERT_U);
  function vertAt(y) { var cat = M.an.cat, V = cat === 'colon' ? VERT_C : cat === 'sb' ? VERT_S : cat === 'eso' ? VERT_E : VERT_U, best = V[0]; V.forEach(function (v) { if (Math.abs(v[0] - y) < Math.abs(best[0] - y)) best = v; }); return best[1]; }
  function ctBody() {
    var cat = M.an.cat, b = M.box;
    if (cat === 'colon') return { zc: 0.3, A: 12.5, B: 6.0 };
    if (cat === 'sb') return { zc: 0.4, A: 12.8, B: 8.0 };
    return { zc: 0.2, A: 12, B: 8.3 };
  }
  var pancAtlas = null;
  function drawCT() {
    if (!ct.on || !ct.samples) return;
    var cw = ctCv.width, ch = ctCv.height, g = ctCtx, dpr = Math.min(window.devicePixelRatio || 1, 2), y = ct.y, cat = M.an.cat;
    var BD = ctBody(), A = BD.A, B = BD.B, zc = BD.zc;
    var s = Math.min(cw / (2 * A + 2), ch / (2 * B + 2)), cx = cw / 2, cy = ch / 2;
    var zc0 = zc;
    function P(x, z) { return [cx + x * s, cy - (z - zc0) * s]; }
    function E(x, z, a, b, fill) { var p = P(x, z); ellipse(g, p[0], p[1], a * s, b * s, fill); }
    function band(y0, y1) { return Math.max(0, Math.sin(Math.max(0, Math.min(1, (y - y0) / (y1 - y0))) * Math.PI)); }
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#000'; g.fillRect(0, 0, cw, ch);
    var up = cat !== 'colon', lungK = up ? Math.max(0, Math.min(1, (y - 7.2) / 2.4)) : Math.max(0, Math.min(1, (y - 7.8) / 2.0));
    var PV = cat === 'colon' ? { sac: -10.5, sacEnd: -17.5, il: [-13.8, -8.3], bl: [-18.8, -12.8], fem: -16.8, bif: -6.5, psoasMin: -13 }
      : cat === 'sb' ? { sac: -18.5, sacEnd: -28, il: [-22.5, -14.5], bl: [-29.5, -21.5], fem: -26.5, bif: -12, psoasMin: -22 } : null;
    var nk = cat === 'eso' ? sm((y - 20.4) / 1.8) : 0, neck = nk > 0.5;
    if (cat === 'eso') lungK *= 1 - nk;
    var thorax = lungK > 0.6;
    if (nk > 0) { A += (5.6 - A) * nk; B += (5.0 - B) * nk; zc += (-1.6 - zc) * nk; }
    // powłoki
    E(0, zc, A, B, hu(-100)); E(0, zc, A - 1.0, B - 1.0, hu(55)); E(0, zc, A - 1.7, B - 1.7, hu(-85));
    var zsT = zc0 - BD.B + 2.4, zs = zsT + ((-1.6 - 5.0 + 1.8) - zsT) * nk;
    if (nk > 0.35) { [-2.3, 2.3].forEach(function (x) { E(x, zc + 0.4, 0.45, 0.45, hu(190)); E(x * 1.3, zc + 0.9, 0.55, 0.45, hu(150)); }); E(-3.4, zc + 1.8, 1.1, 0.6, hu(55)); E(3.4, zc + 1.8, 1.1, 0.6, hu(55)); }
    var pelvis = PV && y < PV.sac;
    // kręgosłup / kość krzyżowa, mięśnie przykręgosłupowe
    if (!pelvis) { E(-2.6, zs - 1.0, 1.9, 1.3, hu(55)); E(2.6, zs - 1.0, 1.9, 1.3, hu(55)); E(0, zs, 1.7, 1.55, hu(650)); E(0, zs, 1.05, 0.95, hu(260)); E(0, zs - 1.9, 0.55, 0.9, hu(650)); }
    else if (y > PV.sacEnd) { var ks = 1 - Math.max(0, Math.min(1, (PV.sac - y) / (PV.sac - PV.sacEnd))) * 0.55; E(0, zs + 0.3, 2.8 * ks, 1.0, hu(650)); E(0, zs + 0.3, 1.8 * ks, 0.5, hu(260)); }
    // naczynia
    var bif = PV ? PV.bif : -99;
    var mAorta = M.byId.aorta, mHeart = M.byId.heart;
    if (neck) { }
    else if (y > bif) { if (!mAorta) E(0.9, zs + 2.1, 0.75, 0.75, hu(190)); if (y > bif - 0.5 && !(mAorta && y > 9)) E(-1.8, zs + 2.5, 0.7, 0.6, hu(150)); }
    else if (y > bif - 6.5) { E(1.6, zs + 2.2, 0.45, 0.45, hu(190)); E(-1.6, zs + 2.2, 0.45, 0.45, hu(190)); E(2.4, zs + 1.6, 0.5, 0.45, hu(150)); E(-2.4, zs + 1.6, 0.5, 0.45, hu(150)); }
    // mięśnie lędźwiowe
    var psoasOn = y < (up ? -2.5 : -2) && (!PV || y > PV.psoasMin);
    if (psoasOn && !thorax) { var pw = 1.1 + (up ? 0.08 * (-2.5 - y) : 0.4); E(-2.9, zs + 0.7, pw, 1.1, hu(55)); E(2.9, zs + 0.7, pw, 1.1, hu(55)); }
    // klatka piersiowa
    if (lungK > 0) {
      E(-A * 0.47, zc - 1.0, A * 0.36 * lungK, B * 0.66 * lungK, hu(-900)); E(A * 0.47, zc - 1.0, A * 0.36 * lungK, B * 0.66 * lungK, hu(-900));
      if (up && !mHeart && y > 9.5 && y < 13.5) E(1.6, zc + 2.4, 4.2, 3.3, hu(110));
      if (up && lungK > 0.3 && y > 10) { E(0, zc + B - 1.3, 1.0, 0.45, hu(650)); E(0, zc + B - 1.3, 0.6, 0.22, hu(300)); }
    }
    // narządy miąższowe
    var liver = neck ? 0 : up ? band(-3, 10) : band(-1, 9.5);
    if (liver > 0.05) E(-A * 0.53, zc - 0.8, A * 0.38 * liver + 0.3, B * 0.65 * liver + 0.3, hu(95));
    var spl = up ? band(1, 8.5) : band(3, 9.5);
    if (spl > 0.05) E(A * 0.67, zs + 3.0, 1.9 * spl + 0.2, 2.9 * spl + 0.2, hu(105));
    var kid = cat === 'sb' ? band(-11, -0.5) : up ? band(-9.5, -0.5) : band(-5, 3.5), kx = up ? 5.2 : 4.6;
    if (kid > 0.05) { [-kx, kx].forEach(function (x) { E(x, zs + 2.0, 1.5 * kid + 0.1, 2.2 * kid + 0.1, hu(170)); E(x, zs + 2.0, 0.7 * kid, 1.1 * kid, hu(40)); }); }
    if (PV) {
      var il = band(PV.il[0], PV.il[1]); if (il > 0.05) [-8.3, 8.3].forEach(function (x) { E(x, zs + 1.4, 2.5 * il + 0.3, 0.8, hu(650)); E(x, zs + 1.4, 1.8 * il, 0.35, hu(260)); });
      var bl = band(PV.bl[0], PV.bl[1]); if (bl > 0.05) E(0, zc + B * 0.45, 2.4 * bl + 0.2, 1.9 * bl + 0.2, hu(8));
      if (y < PV.fem) [-6.3, 6.3].forEach(function (x) { E(x, zc - 0.4, 1.4, 1.4, hu(650)); E(x, zc - 0.4, 0.9, 0.9, hu(300)); });
    }
    // trzustka z atlasu (gdy nie ma jej w modelu)
    var hasPanc = M.objs.some(function (o) { return o.def.organ && o.op > 0.5; });
    if (up && !hasPanc) {
      if (!pancAtlas) { var pc = A_.curveOf(A_.PANC), pr = A_.PANC_R; pancAtlas = []; for (var i = 0; i <= 160; i++) { var t = i / 160, p = pc.getPointAt(t); pancAtlas.push([p.x, p.y, p.z, pr(t)]); } }
      pancAtlas.forEach(function (q) { var dy = q[1] - y; if (Math.abs(dy) < q[3]) { var r0 = Math.sqrt(q[3] * q[3] - dy * dy); E(q[0], q[2], r0, r0, hu(105)); } });
    }
    // przewód pokarmowy, drogi żółciowe, trzustka z modelu
    var content = M.an.ctMap || {}, names = M.an.ctNames || {};
    var discs = [];
    ct.samples.forEach(function (S0) {
      var run = null; S0.runs = [];
      S0.arr.forEach(function (q) {
        var dy = q[1] - y, r = q[3];
        if (Math.abs(dy) < r) {
          var ro = Math.sqrt(r * r - dy * dy), wall = Math.min(0.24, r * 0.4), ri2 = (r - wall) * (r - wall) - dy * dy;
          var d = { x: q[0], z: q[2], ro: ro, ri: ri2 > 0 ? Math.sqrt(ri2) : 0, id: S0.id, col: S0.col, organ: S0.organ, hu: S0.hu };
          discs.push(d); if (!run) run = []; run.push(d);
        } else if (run) { S0.runs.push(run); run = null; }
      });
      if (run) S0.runs.push(run);
    });
    discs.forEach(function (d) { if (d.organ) E(d.x, d.z, d.ro, d.ro, hu(d.hu)); });
    if (ct.colors) discs.forEach(function (d) { if (!d.organ) E(d.x, d.z, d.ro + 0.18, d.ro + 0.18, d.col); });
    discs.forEach(function (d) { if (!d.organ) E(d.x, d.z, d.ro, d.ro, hu(95)); });
    discs.forEach(function (d) {
      if (d.organ || d.ri <= 0) return;
      var k = content[d.id] || 'fluid', v = k === 'air' ? -950 : (k === 'contrast' && ct.contrast) ? 420 : 8;
      E(d.x, d.z, d.ri, d.ri, hu(v));
    });
    if (!ctNoise) {
      ctNoise = document.createElement('canvas'); ctNoise.width = ctNoise.height = 192;
      var ng = ctNoise.getContext('2d'), im = ng.createImageData(192, 192);
      for (var j = 0; j < im.data.length; j += 4) { var v2 = Math.random() * 255; im.data[j] = im.data[j + 1] = im.data[j + 2] = v2; im.data[j + 3] = 22; }
      ng.putImageData(im, 0, 0);
    }
    g.save(); var pb = P(0, zc); g.beginPath(); g.ellipse(pb[0], pb[1], A * s, B * s, 0, 0, Math.PI * 2); g.clip();
    g.fillStyle = g.createPattern(ctNoise, 'repeat'); g.fillRect(0, 0, cw, ch); g.restore();
    if (ct.labels) {
      g.font = Math.round(12 * dpr) + 'px "Atkinson Hyperlegible", system-ui, sans-serif'; g.textBaseline = 'middle';
      var tag = function (x, z, text, col) {
        var p = P(x, z); g.fillStyle = 'rgba(0,0,0,0.55)'; var w = g.measureText(text).width;
        if (p[0] + w + 8 * dpr > cw) p[0] = cw - w - 8 * dpr; if (p[0] < 20 * dpr) p[0] = 20 * dpr;
        g.fillRect(p[0] - 3 * dpr, p[1] - 8 * dpr, w + 6 * dpr, 16 * dpr); g.fillStyle = col || '#ffe066'; g.fillText(text, p[0], p[1]);
      };
      ct.samples.forEach(function (S0) {
        S0.runs.forEach(function (run) { var d = run[Math.floor(run.length / 2)]; tag(d.x + d.ro + 0.2, d.z + d.ro * 0.6, tr(names[S0.id] || S0.id), ct.colors ? S0.col : '#ffe066'); });
      });
      var lc = '#9fd8ff';
      if (y > bif && !mAorta && !neck) tag(1.8, zs + 2.6, 'Ao', lc);
      if (liver > 0.3) tag(-A * 0.8, zc + 2.4, tr('wątroba'), lc);
      if (spl > 0.3) tag(A * 0.68, zs + 0.3, tr('śledziona'), lc);
      if (kid > 0.4) tag(-kx - 2.2, zs + 0.6, tr('nerka'), lc);
      if (lungK > 0.4) tag(-A * 0.72, zc + 3.2, tr('płuco'), lc);
      if (up && lungK > 0.3 && y > 10) tag(1.2, zc + B - 1.3, tr('mostek'), lc);
      if (up && !hasPanc && pancAtlas && pancAtlas.some(function (q) { return Math.abs(q[1] - y) < q[3] * 0.8; })) { var pq = pancAtlas.filter(function (q) { return Math.abs(q[1] - y) < q[3]; }); var mq = pq[Math.floor(pq.length / 2)]; tag(mq[0] + 0.5, mq[2] - 1.4, tr('trzustka'), lc); }
      if (PV && bl > 0.4) tag(2.8, zc + B * 0.45 + 1.4, tr('pęcherz'), lc);
      g.fillStyle = '#9aa'; g.font = Math.round(13 * dpr) + 'px "Atkinson Hyperlegible", system-ui, sans-serif';
      g.fillText(tr('P'), 8 * dpr, ch / 2); g.fillText('L', cw - 16 * dpr, ch / 2);
    }
    var N = Math.round((ct.yMax - ct.yMin) / 0.5) + 1, n = Math.round((ct.yMax - y) / 0.5) + 1;
    $('ctLvlTxt').textContent = tr('Przekrój ') + n + ' / ' + N + tr(' — poziom ≈ ') + tr(vertAt(y));
    $('ctLevel').value = String(-y);
    ctPlaneG.position.y = y;
  }
  function ctResize() {
    var r = $('ctWrap').getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(50, Math.round(r.width * dpr)), h = Math.max(50, Math.round(r.height * dpr));
    if (ctCv.width !== w || ctCv.height !== h) { ctCv.width = w; ctCv.height = h; }
    drawCT();
  }
  if (window.ResizeObserver) new ResizeObserver(function () { if (ct.on) ctResize(); }).observe($('ctWrap'));
  function setCT(on) {
    ct.on = on; ct.sweep = false; ct.started = false; $('ctSweep').textContent = tr('Przejazd');
    $('ctPanel').hidden = !on; viewport.classList.toggle('ctmode', on); ctPlaneG.visible = on;
    if (on) { ctPrepare(); ct.y = ct.yMax; requestAnimationFrame(ctResize); }
  }
  $('ctLevel').addEventListener('input', function () { ct.sweep = false; $('ctSweep').textContent = tr('Przejazd'); ct.y = -parseFloat(this.value); drawCT(); });
  $('ctSweep').onclick = function () { toggleSweep(); };
  function toggleSweep() { if (!ct.sweep && ct.y <= ct.yMin + 0.05) ct.y = ct.yMax; ct.sweep = !ct.sweep; ct.started = true; $('ctSweep').textContent = tr(ct.sweep ? 'Pauza' : 'Przejazd'); }
  $('ctContrast').onchange = function () { ct.contrast = this.checked; drawCT(); };
  $('ctColors').onchange = function () { ct.colors = this.checked; drawCT(); };
  $('ctLabels').onchange = function () { setLabels(this.checked); };
  var ctTouch = null;
  ctCv.addEventListener('touchstart', function (e) { if (e.touches.length === 1) ctTouch = e.touches[0].clientY; }, { passive: true });
  ctCv.addEventListener('touchmove', function (e) {
    if (ctTouch === null || e.touches.length !== 1) return; e.preventDefault();
    var y = e.touches[0].clientY, dy = y - ctTouch; ctTouch = y; ct.sweep = false;
    ct.y = Math.max(ct.yMin, Math.min(ct.yMax, ct.y + dy * 0.06)); drawCT();
  }, { passive: false });
  ctCv.addEventListener('touchend', function () { ctTouch = null; });
  ctCv.addEventListener('wheel', function (e) { e.preventDefault(); ct.sweep = false; ct.y = Math.max(ct.yMin, Math.min(ct.yMax, ct.y - e.deltaY * 0.01)); drawCT(); }, { passive: false });

