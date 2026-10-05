  /* ---------- wątroba: segmenty Couinauda (kolory, wyróżnianie, rozsuwanie suwakiem), naczynia wnęki, żyły wątrobowe i IVC ----------
     Kadr „Anatomia”: cały miąższ (przezroczysty) z naczyniami; klik w legendzie lub na naczyniu wyróżnia układ (PV, HA, drogi żółciowe, żyły wątrobowe).
     Kadr „Segmenty”: dziewięć brył (I, II, III, IVa, IVb, V–VIII); oś czasu m = rozsunięcie (0 — razem, 1 — rozsunięte), suwak w doku.
     Gałęzie wewnątrzwątrobowe przesuwają się razem ze swoim segmentem, pnie we wnęce i IVC zostają — szypuły rozciągają się między segmentami. */
  var LV_SEG_COL = { '1': '#f2c12e', '2': '#26a69a', '3': '#3d7dd8', '4a': '#9c5bd1', '4b': '#e07bb5', '5': '#f08a24', '6': '#e0453f', '7': '#7a4a35', '8': '#58b04f' };
  var LV_COL = { pv: '#7446c2', ha: '#d0302a', bd: '#2f9e44', hv: '#2f62c0', gb: '#6aa84f', par: '#a24a38' };
  var LV_ROMAN = { '1': 'I', '2': 'II', '3': 'III', '4a': 'IVa', '4b': 'IVb', '5': 'V', '6': 'VI', '7': 'VII', '8': 'VIII' };
  var LV_SYS = [['pv', 'Żyła wrotna i jej gałęzie'], ['ha', 'Tętnica wątrobowa i jej gałęzie'], ['bd', 'Drogi żółciowe i pęcherzyk'], ['hv', 'Żyły wątrobowe i IVC']];
  var LV_BTN = [['1', 'I'], ['2', 'II'], ['3', 'III'], ['4a,4b', 'IV'], ['5', 'V'], ['6', 'VI'], ['7', 'VII'], ['8', 'VIII']];
  var LV_DESC = {
    '1': ['Segment I (płat ogoniasty)', 'Leży między IVC a wnęką, za szypułą wątrobową. Szypuły z obu gałęzi żyły wrotnej; krótkie żyły odprowadzają krew bezpośrednio do IVC.'],
    '2': ['Segment II', 'Tylno-górna część sekcji bocznej lewej, nad żyłą wątrobową lewą. Szypuła z części pępkowej lewej gałęzi żyły wrotnej.'],
    '3': ['Segment III', 'Przednio-dolna część sekcji bocznej lewej, pod żyłą wątrobową lewą, na lewo od więzadła obłego.'],
    '4a,4b': ['Segment IV', 'Część przyśrodkowa lewej wątroby między płaszczyzną Cantliego (żyła wątrobowa pośrodkowa) a szczeliną pępkową; IVa — górny, IVb — dolny (przy pęcherzyku). Szypuły z części pępkowej lewej gałęzi żyły wrotnej.'],
    '4a': ['Segment IVa', 'Górna część segmentu IV, nad płaszczyzną wrotną, przy żyle wątrobowej pośrodkowej i lewej.'],
    '4b': ['Segment IVb', 'Dolna część segmentu IV (płat czworoboczny), między dołem pęcherzyka a więzadłem obłym.'],
    '5': ['Segment V', 'Przednio-dolny segment prawej wątroby, przy dnie pęcherzyka. Szypuła z przedniej gałęzi prawej żyły wrotnej.'],
    '6': ['Segment VI', 'Tylno-dolny segment prawej wątroby, za żyłą wątrobową prawą. Szypuła z tylnej gałęzi prawej żyły wrotnej.'],
    '7': ['Segment VII', 'Tylno-górny segment prawej wątroby, pod przeponą, przy IVC. Szypuła z tylnej gałęzi prawej żyły wrotnej.'],
    '8': ['Segment VIII', 'Przednio-górny segment prawej wątroby, między żyłą wątrobową pośrodkową a prawą. Szypuła z przedniej gałęzi prawej żyły wrotnej.']
  };
  S.lvGlass = true;
  try { if (localStorage.getItem('surgitome-lv-glass') === '0') S.lvGlass = false; } catch (e) {}

  function lvGeo(m) {
    var g = track(new THREE.BufferGeometry());
    g.setAttribute('position', new THREE.BufferAttribute(m.pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(m.nor, 3)); g.setIndex(new THREE.BufferAttribute(m.idx, 1));
    g.computeBoundingSphere(); return g;
  }
  function lvMat(col, rough) { return track(new THREE.MeshStandardMaterial({ color: col, roughness: rough || 0.55, metalness: 0.02, transparent: true })); }
  function lvSetOp(mat, op) {
    mat.opacity = op; var t = op < 0.999;
    if (t !== mat._t) { mat._t = t; mat.depthWrite = !t; mat.needsUpdate = true; }
  }
  function makeLiver(d) {
    var LM = A.LIVER, G = LM.model(MOBILE ? 0.32 : 0.25), grp = new THREE.Group(), labels = [];
    var whole = new THREE.Mesh(lvGeo(G.whole), lvMat(LV_COL.par, 0.5)); whole.renderOrder = 2; grp.add(whole);
    var segs = LM.SEGS.map(function (s) {
      var mesh = new THREE.Mesh(lvGeo(G.segs[s]), lvMat(LV_SEG_COL[s], 0.6)); mesh.userData.seg = s; mesh.renderOrder = 2; grp.add(mesh);
      // etykieta na powierzchni: od środka segmentu w kierunku rozsuwania aż do brzegu miąższu
      var c = new V3().fromArray(G.centroid[s]), dir = new V3().fromArray(LM.DIR[s]), p = c.clone();
      for (var i = 0; i < 60; i++) { var q = p.clone().addScaledVector(dir, 0.2); if (LM.sdf(q.x, q.y, q.z) > -0.3) break; p = q; }
      var L = { base: p, el: mkLabel('Segment ' + LV_ROMAN[s], '', LV_SEG_COL[s], 'seg'), anchor: null, alpha: 0 }; labels.push(L);
      return { s: s, mesh: mesh, off: dir.multiplyScalar(LM.EXPLODE), L: L };
    });
    var OFF = {}; segs.forEach(function (sg) { OFF[sg.s] = sg.off; });
    function offOf(tag, e, out) {
      out.set(0, 0, 0); if (!tag || !e) return out;
      var ks = tag.split(','); ks.forEach(function (k) { out.add(OFF[k]); }); return out.multiplyScalar(e / ks.length);
    }
    // naczynia: każdy odcinek osobno (własny materiał — wyróżnianie), geometria przebudowywana przy zmianie rozsunięcia
    var pieces = [], tmp = new V3();
    ['pv', 'ha', 'bd', 'hv'].forEach(function (kind) {
      LM.vessels[kind].forEach(function (v) {
        var col = v.id === 'ivc' ? '#2a4f9e' : LV_COL[kind], mat = lvMat(col, 0.42), mesh = new THREE.Mesh(new THREE.BufferGeometry(), mat);
        mesh.userData.sys = kind; grp.add(mesh);
        var P = { v: v, kind: kind, mat: mat, mesh: mesh, col: new THREE.Color(col), tags: v.seg.filter(function (t) { return t; }).join(',').split(',').filter(function (t, i, a) { return t && a.indexOf(t) === i; }) };
        if (v.name) { P.L = { el: mkLabel(v.name, '', col, 'seg'), anchor: null, alpha: 0, piece: P }; labels.push(P.L); }
        pieces.push(P);
      });
    });
    var gbv = LM.vessels.gb, gbMat = lvMat(LV_COL.gb, 0.35), gbMesh = new THREE.Mesh(new THREE.BufferGeometry(), gbMat); gbMesh.userData.sys = 'bd'; grp.add(gbMesh);
    var gbP = { v: gbv, kind: 'bd', mat: gbMat, mesh: gbMesh, col: new THREE.Color(LV_COL.gb), tags: ['4b', '5'], gb: true };
    gbP.L = { el: mkLabel(gbv.name, '', LV_COL.gb, 'seg'), anchor: null, alpha: 0, piece: gbP }; labels.push(gbP.L); pieces.push(gbP);
    function rebuild(e) {
      pieces.forEach(function (P) {
        var v = P.v, pts = v.pts.map(function (p, i) { return new V3().fromArray(p).add(offOf(v.seg[i], e, tmp)); });
        var c = new THREE.CatmullRomCurve3(pts, false, 'centripetal'), len = c.getLength();
        var rf = P.gb ? LM.gbR : function (t) { return v.r[0] + (v.r[1] - v.r[0]) * t; };
        var g = A.buildTube(c, rf, Math.max(8, Math.round(len * (P.gb ? 6 : 3))), P.gb ? 20 : 10, true);
        if (P.mesh.geometry) P.mesh.geometry.dispose(); P.mesh.geometry = g; P.curve = c;
        if (P.L) P.L.p = c.getPointAt(v.at || 0.5);
      });
    }
    var eKey = -1, hKey = null, tool;
    tool = { d: d, grp: grp, overlay: false, el: null, labels: labels, segs: segs, pieces: pieces, whole: whole,
      update: function (m) {
        var fr = FR[S.frame], segMode = !!fr && fr.k === 'segs', e = segMode ? sm(m) : 0;
        if (segMode !== this.mode) { this.mode = segMode; var lg = $('legend'); lg.innerHTML = ''; lvLegend(lg); }
        if (Math.abs(e - eKey) > 1e-4) { eKey = e; rebuild(e); }
        var hl = S.highlight || '', selSeg = hl.indexOf('seg:') === 0 ? hl.slice(4).split(',') : null, selSys = hl.indexOf('sys:') === 0 ? hl.slice(4) : null;
        if (!segMode && selSeg) selSeg = null;
        whole.visible = !segMode;
        lvSetOp(whole.material, (S.lvGlass ? 0.3 : 1) * (selSys ? 0.6 : 1));
        segs.forEach(function (sg) {
          sg.mesh.visible = segMode; sg.mesh.position.copy(sg.off).multiplyScalar(e);
          var on = selSeg && selSeg.indexOf(sg.s) >= 0, base = S.lvGlass ? 0.72 : 1;
          lvSetOp(sg.mesh.material, selSeg ? (on ? Math.max(base, 0.85) : 0.14) : base);
          sg.mesh.material.emissive.set(on ? '#3a2a10' : '#000000');
          sg.L.anchor = sg.L.base.clone().addScaledVector(sg.off, e); sg.L.alpha = segMode && S.labels ? (selSeg && !on ? 0.25 : 1) : 0;
        });
        pieces.forEach(function (P) {
          var op = 1, glow = false;
          if (selSys) op = P.kind === selSys ? 1 : 0.12;
          else if (selSeg) {
            var mine = P.v.sub ? P.v.sub.split(',').every(function (t) { return selSeg.indexOf(t) >= 0; }) : false;
            var near = P.tags.some(function (t) { return selSeg.indexOf(t) >= 0; });
            op = mine ? 1 : near ? 0.6 : P.tags.length ? 0.12 : 0.45; glow = mine;
          }
          lvSetOp(P.mat, op); P.mesh.visible = op > 0.02;
          P.mat.emissive.copy(P.col).multiplyScalar(glow ? 0.45 : 0);
          if (P.L) { P.L.anchor = P.L.p; P.L.alpha = op > 0.5 ? (segMode ? (P.v.id === 'ivc' || P.v.id === 'pv' ? 1 : 0) : 1) : 0; }
        });
        if (segMode) {
          var sl = $('lvExplode'); if (sl && document.activeElement !== sl) sl.value = Math.round(m * 1000);
          document.querySelectorAll('#lvSegs button').forEach(function (b) { b.setAttribute('aria-pressed', hl === 'seg:' + b.dataset.s ? 'true' : 'false'); });
          var k = selSeg ? selSeg.join(',') : null, D = k && LV_DESC[k];
          // opis wyróżnionego segmentu w podpisie (po każdym capHead, np. po zmianie języka); po zdjęciu wyróżnienia — podpis kadru
          if (D || hKey) {
            var tt = tr(D ? D[0] : fr.title), tx = tr(D ? D[1] : fr.cap);
            if ($('capTitle').textContent !== tt) $('capTitle').textContent = tt;
            if ($('capText').textContent !== tx) $('capText').textContent = tx;
          }
          hKey = k;
        } else hKey = null;
      } };
    M.liver = tool;
    return tool;
  }
  TOOL_EXT.liver = makeLiver;

  // legenda w panelu: układy naczyń (kadr „Anatomia”) i segmenty (kadr „Segmenty”)
  function lvLegend(lg) {
    var segMode = FR[S.frame] && FR[S.frame].k === 'segs', items = segMode
      ? LV_BTN.map(function (b) { return ['seg:' + b[0], LV_DESC[b[0]][0], LV_SEG_COL[b[0].split(',')[0]]]; })
      : LV_SYS.map(function (s) { return ['sys:' + s[0], s[1], LV_COL[s[0]]]; });
    items.forEach(function (it) {
      var li = document.createElement('li'), b = document.createElement('button');
      b.className = 'leg'; b.dataset.id = it[0]; b.setAttribute('aria-pressed', S.highlight === it[0] ? 'true' : 'false');
      b.innerHTML = '<i></i><span><b></b></span>'; b.querySelector('i').style.background = it[2]; b.querySelector('b').textContent = tr(it[1]);
      b.onclick = function () { lvPick(it[0]); };
      li.appendChild(b); lg.appendChild(li);
    });
  }
  function lvPick(id) {
    S.highlight = S.highlight === id ? null : id; applyM();
    document.querySelectorAll('.leg').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.id === S.highlight ? 'true' : 'false'); });
  }
  function lvActive() { return M && M.liver && !SPLIT.on && !endo.active && !ct.on; }
  // suwak rozsunięcia i przyciski segmentów (dok)
  (function () {
    var box = $('lvSegs');
    LV_BTN.forEach(function (b) {
      var x = document.createElement('button'); x.className = 'btn lvseg'; x.dataset.s = b[0]; x.textContent = b[1]; x.setAttribute('aria-pressed', 'false');
      x.style.setProperty('--sc', LV_SEG_COL[b[0].split(',')[0]]);
      x.onclick = function () { if (lvActive()) lvPick('seg:' + b[0]); };
      box.appendChild(x);
    });
    $('lvExplode').addEventListener('input', function () {
      if (!lvActive()) return;
      S.m = this.value / 1000; S.playing = false; applyM(); updateDock();
    });
    $('optLvGlass').checked = S.lvGlass;
    $('optLvGlass').onchange = function () { S.lvGlass = this.checked; try { localStorage.setItem('surgitome-lv-glass', S.lvGlass ? '1' : '0'); } catch (e) {} if (M && (M.liver || M.oltx || M.lvres || M.lvtumor) && !SPLIT.on) applyM(); };
  })();
  // klik w modelu: segment (kadr „Segmenty”) albo naczynie (kadr „Anatomia”); przeciągnięcie obraca kamerę, więc liczy się tylko klik bez ruchu
  var lvDown = null;
  viewport.addEventListener('pointerdown', function (e) { lvDown = lvActive() ? [e.clientX, e.clientY] : null; });
  viewport.addEventListener('pointerup', function (e) {
    if (!lvDown || !lvActive() || Math.hypot(e.clientX - lvDown[0], e.clientY - lvDown[1]) > 5) return;
    var T = M.liver, segMode = FR[S.frame].k === 'segs';
    var targets = segMode ? T.segs.map(function (s) { return s.mesh; }).filter(function (m) { return m.material.opacity > 0.3; }) : T.pieces.map(function (P) { return P.mesh; });
    var hit = guzPick(e, targets)[0];
    if (hit) lvPick(segMode ? 'seg:' + hit.object.userData.seg : 'sys:' + hit.object.userData.sys);
    else if (S.highlight) lvPick(S.highlight);
  });
  window.__sgTest.liver = function () { return M && M.liver ? { segs: M.liver.segs.map(function (s) { return [s.s, s.mesh.visible, +s.mesh.material.opacity.toFixed(2), s.mesh.position.toArray().map(function (x) { return +x.toFixed(2); })]; }), hl: S.highlight, m: S.m } : null; };
