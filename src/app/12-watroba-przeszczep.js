  /* ---------- przeszczepienie wątroby (OLTx): wątroba biorcy → hepatektomia → przeszczep → zespolenia ----------
     Naczynia z modelu wątroby (ANAT.LIVER) dzielone w punktach przecięcia: część biorcy zostaje w miejscu, część wątrobowa odjeżdża z wątrobą
     biorcy i wraca z przeszczepem. Klasycznie zawątrobowy odcinek IVC idzie z wątrobą (dwa zespolenia IVC); w piggyback IVC biorcy zostaje,
     a przeszczep z własnym odcinkiem IVC leży przed nią (przesunięcie OLT_PB), górny koniec IVC dawcy zespolony z ujściem żył wątrobowych biorcy.
     Oś czasu: 0–1 hepatektomia, 1–1.6 przeszczep na miejsce, 1.6–2.2 IVC, 2.2–3 PV i tętnica, 3–4 drogi żółciowe. */
  var OLT_COL = { rec: '#8f6a3e', graft: '#b8503f', roux: '#43a36f', bp: '#e2ad3f', ring: '#f4f1e8', cut: '#e0302a', lig: '#262b31' };
  var OLT_AWAY = new V3(8, 7, 9), OLT_PB_DZ = 0.58; // piggyback: obie IVC w odcinku zawątrobowym spłaszczone (przód–tył) i przylegające, przeszczep i IVC biorcy w miejscu
  function oltBump(y) { return y < -6.8 ? sm((y + 9.5) / 2.7) : y > 5.8 ? 1 - sm((y - 5.8) / 2.2) : 1; }
  // rura IVC spłaszczona w odcinku zawątrobowym: oś przesunięta o dz·b(y), przekrój ściśnięty w osi z i lekko poszerzony w osi x
  function oltIvcTube(pts, r, mat, dz, k, whole) {
    var m = oltTube(pts, r, mat, true, 28), pa = m.geometry.attributes.position, X = A.LIVER.IVC[0], Z = A.LIVER.IVC[1];
    for (var i = 0; i < pa.count; i++) {
      var y = pa.getY(i), b = (whole ? 1 : oltBump(y)) * k; if (b <= 0) continue;
      pa.setX(i, X + (pa.getX(i) - X) * (1 + 0.22 * b)); pa.setZ(i, Z + dz * b + (pa.getZ(i) - Z) * (1 - 0.5 * b));
    }
    pa.needsUpdate = true; m.geometry.computeVertexNormals(); m.geometry.computeBoundingSphere(); return m;
  }
  var OLT_SYS = [['par', 'Wątroba biorcy i przeszczep'], ['pv', 'Żyła wrotna'], ['ha', 'Tętnica wątrobowa'], ['bd', 'Drogi żółciowe'], ['hv', 'Żyły wątrobowe i IVC'], ['roux', 'Pętla Roux-en-Y']];
  function oltCurve(pts) { return new THREE.CatmullRomCurve3(pts.map(function (p) { return p.isVector3 ? p.clone() : new V3().fromArray(p); }), false, 'centripetal'); }
  // podział naczynia w punkcie t (długość łuku): część bliższa [0, t], dalsza [t, 1], punkt i kierunek przecięcia
  function oltSplit(v, t) {
    var c = oltCurve(v.pts), a = [], b = [], rt = v.r[0] + (v.r[1] - v.r[0]) * t;
    for (var i = 0; i <= 10; i++) { a.push(c.getPointAt(t * i / 10)); b.push(c.getPointAt(t + (1 - t) * i / 10)); }
    return { a: { pts: a, r: [v.r[0], rt] }, b: { pts: b, r: [rt, v.r[1]] }, p: c.getPointAt(t), tan: c.getTangentAt(t), r: rt };
  }
  function oltTAtY(v, y) { var c = oltCurve(v.pts), best = 0, bd = 1e9; for (var i = 0; i <= 400; i++) { var d = Math.abs(c.getPointAt(i / 400).y - y); if (d < bd) { bd = d; best = i / 400; } } return best; }
  function oltTube(pts, r, mat, caps, rs) {
    var c = oltCurve(pts), rf = typeof r === 'function' ? r : function (t) { return r[0] + (r[1] - r[0]) * t; };
    return new THREE.Mesh(track(A.buildTube(c, rf, Math.max(8, Math.round(c.getLength() * (rs ? 5 : 3))), rs || 12, caps === undefined ? true : caps)), mat);
  }
  function makeOltx(d) {
    var LM = A.LIVER, G = LM.model(MOBILE ? 0.32 : 0.25), pb = d.cav === 'pb', roux = d.bile === 'roux', SH = new V3();
    var grp = new THREE.Group(), rec = new THREE.Group(), exp = new THREE.Group(), gft = new THREE.Group(), anas = new THREE.Group(), labels = [];
    grp.add(rec, exp, gft, anas);
    // materiały: osobny komplet dla części biorcy, wątroby usuwanej i przeszczepu (różne krycie w czasie)
    function set(par) {
      var o = { par: lvMat(par, 0.5) }; ['pv', 'ha', 'bd', 'hv'].forEach(function (k) { o[k] = lvMat(LV_COL[k], 0.42); });
      o.ivc = lvMat('#2a4f9e', 0.42); o.gb = lvMat(LV_COL.gb, 0.35); return o;
    }
    var MR = set(OLT_COL.rec), ME = set(OLT_COL.rec), MG = set(OLT_COL.graft), MA = set(OLT_COL.graft);
    MA.roux = lvMat(OLT_COL.roux, 0.45); MA.bp = lvMat(OLT_COL.bp, 0.45);
    var wE = new THREE.Mesh(lvGeo(G.whole), ME.par), wG = new THREE.Mesh(lvGeo(G.whole), MG.par); wE.renderOrder = wG.renderOrder = 2; exp.add(wE); gft.add(wG);
    var cuts = {}, recMesh = {}, ivcV = null, ivcG = new THREE.Group(); rec.add(ivcG);
    function add(g, M, kind, part, id) { var m = oltTube(part.pts, part.r, M[id === 'ivc' ? 'ivc' : kind]); m.userData.sys = kind; g.add(m); return m; }
    ['pv', 'ha', 'bd', 'hv'].forEach(function (kind) {
      LM.vessels[kind].forEach(function (v) {
        var id = v.id, liverSide = function (part, onlyExp) { add(exp, ME, kind, part, id); if (!onlyExp) add(gft, MG, kind, part, id); };
        if (id === 'cbd' && roux) {
          // Roux-en-Y: przewód biorcy przecięty nisko, nad trzustką; zostaje krótki zamknięty kikut, reszta wychodzi z wątrobą biorcy
          var sc = oltSplit(v, 0.3); cuts.cbd = sc; recMesh.cbd = add(rec, MR, kind, sc.a, id); add(exp, ME, kind, sc.b, id); return;
        }
        if (id === 'cha' || id === 'gda' || id === 'cbd') { recMesh[id] = add(rec, MR, kind, v, id); return; }
        if (id === 'pv' || id === 'pha' || id === 'chd') {
          var sp = oltSplit(v, id === 'pv' ? 0.55 : id === 'pha' ? 0.5 : 0.2); cuts[id] = sp;
          if (id === 'chd' && roux) add(exp, ME, kind, sp.a, id); else recMesh[id] = add(rec, MR, kind, sp.a, id);
          liverSide(sp.b); return;
        }
        if (id === 'ivc') {
          var tl = oltTAtY(v, -6.6), th = oltTAtY(v, 6.0), lo = oltSplit(v, tl), hi = oltSplit(v, th), c = oltCurve(v.pts), mid = [];
          for (var i = 0; i <= 12; i++) mid.push(c.getPointAt(tl + (th - tl) * i / 12));
          var midP = { pts: mid, r: v.r };
          cuts.ivcL = lo; cuts.ivcU = hi;
          if (pb) { ivcV = v; var dm = oltIvcTube(midP.pts, midP.r, MG.ivc, OLT_PB_DZ, 1, true); dm.userData.sys = kind; gft.add(dm); cuts.donorIvc = midP; }
          else { recMesh.ivc = add(rec, MR, kind, lo.a, id); add(rec, MR, kind, hi.b, id); liverSide(midP); }
          return;
        }
        if (id === 'cyd') { liverSide(v, true); return; }
        liverSide(v);
      });
    });
    var gb = LM.vessels.gb, gbm = oltTube(gb.pts, LM.gbR, ME.gb); exp.add(gbm);                    // pęcherzyk biorcy wychodzi z wątrobą; przeszczep bez pęcherzyka
    // pierścienie: przecięcia (czerwone, w hepatektomii) i zespolenia (jasne, pojawiają się kolejno); kikuty zamknięte — ciemne podwiązanie
    var rings = [];
    function ring(p, tan, r, col, on, off, name, sub) {
      var mat = track(new THREE.MeshStandardMaterial({ color: col, emissive: new THREE.Color(col).multiplyScalar(col === OLT_COL.cut ? 0.35 : 0.15), roughness: 0.4, transparent: true }));
      var m = new THREE.Mesh(track(new THREE.TorusGeometry(r + 0.1, Math.max(0.06, r * 0.18), 10, 40)), mat);
      m.position.copy(p); m.quaternion.setFromUnitVectors(new V3(0, 0, 1), tan.clone().normalize()); anas.add(m);
      var R = { m: m, base: p.clone(), on: on, off: off || 99, L: name ? { el: mkLabel(name, sub || '', col === OLT_COL.cut ? OLT_COL.cut : '#7d8794', 'anast'), anchor: p.clone(), alpha: 0 } : null };
      if (R.L) labels.push(R.L); rings.push(R); return R;
    }
    var bridges = [];
    // przecięcia w hepatektomii
    ['pv', 'pha', roux ? 'cbd' : 'chd'].forEach(function (k) { ring(cuts[k].p, cuts[k].tan, cuts[k].r, OLT_COL.cut, 0.08, 1.0); });
    if (pb) LM.vessels.hv.forEach(function (v, i) {
      if (v.id === 'ivc') return; var c = oltCurve(v.pts), p = c.getPointAt(0.04), t = c.getTangentAt(0.04);
      ring(p, t, v.r[0], OLT_COL.cut, 0.08, 1.0);
      // ujścia żył wątrobowych na IVC biorcy zamknięte (przesuwają się z IVC biorcy)
      var R = ring(p, t, v.r[0] * 0.8, OLT_COL.lig, 1.0, 99, i === 1 ? 'Zamknięte ujścia żył wątrobowych biorcy' : null); anas.remove(R.m); ivcG.add(R.m); R.moving = true;
    });
    else { ring(cuts.ivcU.p, cuts.ivcU.tan, cuts.ivcU.r, OLT_COL.cut, 0.08, 1.0); ring(cuts.ivcL.p, cuts.ivcL.tan, cuts.ivcL.r, OLT_COL.cut, 0.08, 1.0); }
    // zespolenia żylne
    if (!pb) {
      ring(cuts.ivcU.p, cuts.ivcU.tan, cuts.ivcU.r, OLT_COL.ring, 1.65, 99, 'Zespolenie IVC nad wątrobą');
      ring(cuts.ivcL.p, cuts.ivcL.tan, cuts.ivcL.r, OLT_COL.ring, 1.95, 99, 'Zespolenie IVC pod wątrobą');
    } else {
      // zespolenie kawo-kawalne bok-do-boku (Belghiti): przednia ściana IVC biorcy z tylną ścianą IVC dawcy w środkowym odcinku; oba końce IVC dawcy zamknięte
      var dv = cuts.donorIvc.pts, top = dv[dv.length - 1], bot = dv[0], IR = LM.vessels.hv[0].r[0], win = new V3(top.x, -0.6, A.LIVER.IVC[1]);
      var stoma = new THREE.Mesh(track(new THREE.CylinderGeometry(0.62, 0.62, 0.3, 24)), MA.ivc); stoma.rotation.x = Math.PI / 2; stoma.scale.set(1, 1, 2.4); stoma.position.copy(win);
      anas.add(stoma); bridges.push({ m: stoma, on: 1.6 });
      var W = ring(win, new V3(0, 0, 1), 0.62, OLT_COL.ring, 1.65, 99, 'Zespolenie kawo-kawalne bok-do-boku', 'przednia ściana IVC biorcy – tylna ściana IVC dawcy'); W.m.scale.set(1, 2.4, 1);
      ring(top.clone().add(new V3(0, -0.15, 0)), new V3(0, 1, 0), IR * 0.6, OLT_COL.lig, 1.9, 99, 'Zamknięty górny koniec IVC dawcy');
      ring(bot.clone().add(new V3(0, 0.15, 0)), new V3(0, 1, 0), IR * 0.6, OLT_COL.lig, 1.95, 99, 'Zamknięty dolny koniec IVC dawcy');
    }
    // żyła wrotna, tętnica: koniec-do-końca w miejscu przecięcia
    [['pv', 2.3, 'Zespolenie żyły wrotnej'], ['pha', 2.65, 'Zespolenie tętnicy wątrobowej']].forEach(function (z) { var c = cuts[z[0]]; ring(c.p, c.tan, c.r, OLT_COL.ring, z[1], 99, z[2]); });
    // drogi żółciowe
    var cb = cuts.chd, dEnd = cb.p.clone().add(SH), roux3 = [];
    if (!roux) {
      ring(cb.p, cb.tan, cb.r, OLT_COL.ring, 3.4, 99, 'Zespolenie przewód–przewód', 'koniec-do-końca');
    } else {
      var cs = cuts.cbd; ring(cs.p.clone().addScaledVector(cs.tan, -0.12), cs.tan, cs.r * 0.75, OLT_COL.lig, 3.15, 99, 'Kikut przewodu żółciowego biorcy (zamknięty)');
      // pętla Roux-en-Y: od zespolenia jelitowo-jelitowego w górę do przewodu dawcy (koniec pętli ślepy, przewód wszyty w bok)
      var JJ = new V3(3.2, -14.6, 2.4), lim = [new V3(3.0, -18.0, 1.6), JJ, new V3(2.0, -11.8, 2.8), new V3(1.0, -9.2, 2.6),
        dEnd.clone().add(new V3(1.4, -1.3, 0.85)), dEnd.clone().add(new V3(0, -0.62, 0.62)), dEnd.clone().add(new V3(-1.5, -0.55, 0.55))];
      roux3.push(oltTube(lim, function (t) { return t > 0.93 ? 0.75 * Math.sqrt(Math.max(0.05, (1 - t) / 0.07)) : 0.75; }, MA.roux, [false, true]));
      roux3.push(oltTube([new V3(6.6, -12.6, -0.6), new V3(5.4, -13.8, 0.9), new V3(4.1, -14.5, 2.1), JJ.clone().add(new V3(0.55, 0, 0))], [0.7, 0.7], MA.bp, false));
      roux3.forEach(function (m) { anas.add(m); });
      var lc = oltCurve(lim), tH = A.nearestT(lc, dEnd, 400);
      ring(dEnd, dEnd.clone().sub(lc.getPointAt(tH)).normalize(), cb.r, OLT_COL.ring, 3.55, 99, 'Hepatikojejunostomia', 'przewód dawcy do boku pętli');
      ring(JJ.clone().add(new V3(0.55, 0, 0)), new V3(-1, 0.1, 0.4), 0.55, OLT_COL.ring, 3.8, 99, 'Zespolenie jelitowo-jelitowe');
      var LL = { el: mkLabel('Pętla Roux-en-Y', '', OLT_COL.roux, 'seg'), anchor: lc.getPointAt(0.45), alpha: 0, roux: true }; labels.push(LL);
    }
    // etykiety: wątroba biorcy, przeszczep, struktury biorcy
    var Lrec = { el: mkLabel('Wątroba biorcy', '', OLT_COL.rec, 'seg'), base: new V3(-6.5, 4.5, 3.0), anchor: null, alpha: 0 };
    var Lgft = { el: mkLabel('Przeszczep (wątroba dawcy)', '', OLT_COL.graft, 'seg'), base: new V3(-6.5, 4.5, 3.0), anchor: null, alpha: 0 };
    labels.push(Lrec, Lgft);
    var RL = [['pv', 'Żyła wrotna biorcy', LV_COL.pv, 0.4], ['cha', 'Tętnica wątrobowa wspólna (CHA)', LV_COL.ha, 0.5], ['cbd', 'Przewód żółciowy wspólny biorcy', LV_COL.bd, roux ? 0.12 : 0.4],
      ['ivc', pb ? 'IVC biorcy (zachowana)' : 'IVC biorcy', '#2a4f9e', pb ? 0.12 : 0.35]].map(function (x) {
      var L = { el: mkLabel(x[1], '', x[2], 'seg'), anchor: null, alpha: 0, id: x[0], at: x[3] };
      labels.push(L); return L;
    });
    function recAnchor(id, at) {
      var v = null; ['pv', 'ha', 'bd', 'hv'].forEach(function (k) { LM.vessels[k].forEach(function (q) { if (q.id === id) v = q; }); });
      var c = oltCurve(v.pts); return c.getPointAt(id === 'pv' ? 0.55 * at : at);
    }
    RL.forEach(function (L) { L.base = recAnchor(L.id, L.at); });
    var tool = { d: d, grp: grp, overlay: false, el: null, labels: labels,
      update: function (m) {
        var hl = S.highlight || '', selSys = hl.indexOf('sys:') === 0 ? hl.slice(4) : null;
        var glass = S.lvGlass ? 0.32 : 1;
        // wątroba biorcy: odjeżdża i znika; przeszczep: przyjeżdża i pojawia się
        var ke = sm((m - 0.45) / 0.5), oe = 1 - sm((m - 0.7) / 0.3), kg = sm((m - 1) / 0.6), og = sm((m - 1) / 0.25);
        exp.position.copy(OLT_AWAY).multiplyScalar(ke); exp.visible = oe > 0.01;
        gft.position.copy(OLT_AWAY).lerp(SH, kg); gft.visible = og > 0.01;
        if (pb) {
          // IVC biorcy w odcinku zawątrobowym spłaszcza się ku tyłowi (IVC dawcy spłaszczona przed nią); przebudowa tylko przy zmianie
          var kb = sm((m - 0.95) / 0.4);
          if (Math.abs(kb - (this.kb === undefined ? -1 : this.kb)) > 1e-3) {
            this.kb = kb; var c = oltCurve(ivcV.pts), pts = [];
            for (var i = 0; i <= 40; i++) pts.push(c.getPointAt(i / 40));
            if (recMesh.ivc) { rec.remove(recMesh.ivc); recMesh.ivc.geometry.dispose(); }
            recMesh.ivc = oltIvcTube(pts, ivcV.r, MR.ivc, -OLT_PB_DZ, kb); rec.add(recMesh.ivc);
            ivcG.position.set(0, 0, -OLT_PB_DZ * kb);
          }
        }
        function fade(M, f, par) {
          Object.keys(M).forEach(function (k) {
            var sysK = k === 'ivc' || k === 'hv' ? 'hv' : k === 'gb' ? 'bd' : k === 'bp' ? 'roux' : k;
            var op = f * (k === 'par' ? par : 1) * (selSys && selSys !== sysK ? 0.15 : 1); lvSetOp(M[k], op);
          });
        }
        fade(MR, 1, 1); fade(ME, oe, glass); fade(MG, og, glass);
        fade(MA, roux ? sm((m - 3) / 0.35) : 1, 1);
        roux3.forEach(function (x) { x.visible = m > 3; });
        bridges.forEach(function (b) { b.m.visible = m >= b.on; });
        rings.forEach(function (R) {
          var a = sm((m - R.on) / 0.12) * (1 - sm((m - R.off + 0.12) / 0.12)); R.m.visible = a > 0.01; R.m.material.opacity = a;
          if (R.L) { R.L.alpha = a > 0.5 && R.on >= 1 ? 1 : 0; if (R.moving) R.L.anchor = R.base.clone().add(ivcG.position); }
        });
        Lrec.anchor = Lrec.base.clone().add(exp.position); Lrec.alpha = oe > 0.6 && m < 0.7 ? 1 : 0;
        Lgft.anchor = Lgft.base.clone().add(gft.position); Lgft.alpha = m >= 1.5 ? 1 : 0;
        RL.forEach(function (L) { L.anchor = L.base; L.alpha = m < 0.45 || m >= 4 ? 1 : 0; });
        labels.forEach(function (L) { if (L.roux) L.alpha = m > 3.3 ? 1 : 0; });
      } };
    M.oltx = tool;
    return tool;
  }
  TOOL_EXT.oltx = makeOltx;
  function oltLegend(lg) {
    var roux = M.oltx && M.an.cutTools[0].bile === 'roux';
    OLT_SYS.forEach(function (s) {
      if (s[0] === 'roux' && !roux) return;
      var col = s[0] === 'par' ? OLT_COL.graft : s[0] === 'roux' ? OLT_COL.roux : LV_COL[s[0]], li = document.createElement('li'), b = document.createElement('button');
      b.className = 'leg'; b.dataset.id = 'sys:' + s[0]; b.setAttribute('aria-pressed', S.highlight === 'sys:' + s[0] ? 'true' : 'false');
      b.innerHTML = '<i></i><span><b></b></span>'; b.querySelector('i').style.background = col; b.querySelector('b').textContent = tr(s[1]);
      b.onclick = function () { lvPick('sys:' + s[0]); };
      li.appendChild(b); lg.appendChild(li);
    });
  }
  window.__sgTest.oltx = function () { return M && M.oltx ? { m: S.m, rings: M.oltx.labels.filter(function (L) { return L.alpha > 0; }).map(function (L) { return L.el.textContent; }) } : null; };
