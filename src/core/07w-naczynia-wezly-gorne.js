  /* =====================================================================
     GÓRNE PIĘTRO JAMY BRZUSZNEJ: naczynia, sieci i węzły chłonne (narzędzie 'meso' jak w jelicie grubym)
     Wspólne drzewo naczyń w układzie modeli żołądka, trzustki i przełyku: aorta, pień trzewny (LGA, CHA, śledzionowa),
     PHA, GDA, RGA, RGEA, LGEA, krótkie tętnice żołądkowe, łuki krzywizny mniejszej i większej z gałęziami do ściany, żyła wrotna.
     Stacje węzłowe — numeracja JGCA (Japanese classification of gastric carcinoma, 3. wyd. ang. 2011; zakresy D1/D2:
     Japanese Gastric Cancer Treatment Guidelines 2025, 7. wyd. — bez zmian względem 2021): gastrektomia całkowita D2 = 1–7, 8a, 9, 11p, 11d, 12a;
     dystalna D2 = 1, 3, 4sb, 4d, 5, 6, 7, 8a, 9, 11p, 12a. Sieć większa usuwana standardowo przy guzach T3 i głębszych.
     ===================================================================== */
  var NG_JGCA = {
    '1': 'przywpustowe prawe', '2': 'przywpustowe lewe', '3a': 'krzywizna mniejsza — gałęzie LGA', '3b': 'krzywizna mniejsza — gałęzie RGA',
    '4sa': 'krzywizna większa — krótkie tętnice żołądkowe', '4sb': 'krzywizna większa — LGEA', '4d': 'krzywizna większa — RGEA',
    '5': 'nadodźwiernikowe (RGA)', '6': 'pododźwiernikowe (RGEA)', '7': 'wzdłuż LGA', '8a': 'wzdłuż CHA (przednio-górne)', '9': 'wokół pnia trzewnego',
    '10': 'we wnęce śledziony', '11p': 'wzdłuż bliższej części tętnicy śledzionowej', '11d': 'wzdłuż dalszej części tętnicy śledzionowej',
    '12a': 'więzadło wątrobowo-dwunastnicze — wzdłuż PHA' };
  NG_ORDER.jgca = NG_ORDER.jps = ['1', '2', '3a', '3b', '4sa', '4sb', '4d', '5', '6', '7', '8a', '9', '10', '11p', '11d', '12a', '12b1', '12b2', '12c', '12p', '13a', '13b', '14a', '14b', '17a', '17b', '18'];
  NG_SYS.jgca = 'Numeracja JGCA (Japanese Gastric Cancer Association); zakres D2 wg wytycznych JGCA 2025';
  var UG = (function () {
    var V3 = THREE.Vector3;
    function A(p) { return p.toArray ? p.toArray() : p.slice(); }
    // punkt na krzywiźnie żołądka: k = −1 mniejsza, +1 większa (kierunek od środka „J” żołądka), out — odsunięcie od ściany
    function side(t, k, out) {
      var p = C.STOM.getPointAt(t), T = C.STOM.getTangentAt(t), g = p.clone().sub(STOM_C0); g.sub(T.multiplyScalar(g.dot(T))).normalize();
      return p.addScaledVector(g, k * (STOMACH_R(t) + (out || 0)));
    }
    function line(t0, t1, n, k, out) { var o = []; for (var i = 0; i <= n; i++) o.push(A(side(t0 + (t1 - t0) * i / n, k, out))); return o; }
    var AO = [[1.6, 7.5, -4.3], [1.2, 3.0, -4.3], [0.9, 0.0, -4.3], [0.8, -4.0, -4.2], [0.7, -8.0, -4.0]];
    var T = [0.95, 0.8, -2.5], CT_O = [0.95, 0.6, -3.6], G0 = [-1.6, -0.2, -2.1];
    var P = {
      ao: AO,
      ct: [CT_O, [0.95, 0.7, -3.05], T],
      lga: [T, [1.15, 2.0, -2.75], [1.45, 3.6, -2.2], A(side(0.17, -1, 0.5))],
      cha: [T, [0.0, 0.45, -2.45], [-1.0, 0.05, -2.3], G0],
      pha: [G0, [-2.05, 0.9, -2.0], [-2.35, 2.6, -1.9], [-2.6, 4.6, -1.85], [-2.75, 6.6, -1.8]],
      gda: [G0, [-2.0, -0.9, -1.4], [-2.3, -1.7, -0.5], [-2.45, -2.3, 0.15]],
      spa: [T, [2.0, 0.15, -2.95], [3.6, -0.35, -3.3], [5.2, -0.05, -3.4], [5.95, 0.65, -3.05], [6.3, 1.35, -2.55]], // koniec we wnęce śledziony (powierzchnia przyśrodkowa)
      pv: [[-1.1, -2.6, -2.85], [-1.8, -0.6, -2.65], [-2.35, 1.6, -2.5], [-2.6, 4.0, -2.35], [-2.8, 6.6, -2.3]]
    };
    var RGA0 = [-2.3, 1.9, -1.95], RGEA0 = P.gda[3], LGEA0 = [5.95, 0.65, -3.05];
    var LJ = 0.62, GJ = 0.55; // połączenie łuków: LGA–RGA na krzywiźnie mniejszej, LGEA–RGEA na większej
    P.rga = [RGA0, [-1.9, 1.95, -0.7], A(side(0.97, -1, 0.5))].concat(line(0.95, LJ, 10, -1, 0.5));
    P.lgaArc = line(0.17, LJ, 14, -1, 0.5);
    P.rgea = [RGEA0, [-2.0, -2.3, 0.9], A(side(0.97, 1, 0.55))].concat(line(0.95, GJ, 12, 1, 0.55));
    P.lgea = [LGEA0, [6.0, 0.95, -1.9], [6.75, 1.05, -0.75], A(side(0.36, 1, 0.55))].concat(line(0.38, GJ, 6, 1, 0.55)); // przed biegunem dolnym śledziony
    // krótkie tętnice żołądkowe: od wnęki śledziony (powierzchnia przyśrodkowa) więzadłem żołądkowo-śledzionowym do dna żołądka
    P.sg = [0.07, 0.15, 0.23].map(function (t, i) { var s = side(t, 1, 0.3), h = [[6.45, 1.8, -2.1], [6.55, 2.35, -1.95], [6.6, 2.75, -1.85]][i]; return [h, [6.1 - 0.15 * i, 4.0 + 0.5 * i, -1.55 + 0.1 * i], A(s)]; });
    // gałęzie do ściany żołądka (krótkie, jak naczynia proste)
    function twigs(t0, t1, n, k) { var o = []; for (var i = 0; i <= n; i++) { var t = t0 + (t1 - t0) * i / n; o.push({ t: t, k: k, pts: [A(side(t, k, 0.5)), A(side(t, k, 0.02))] }); } return o; }
    var TW = twigs(0.2, 0.95, 22, -1).concat(twigs(0.36, 0.95, 18, 1));
    P.sg.forEach(function (p, i) { P['sg' + i] = p; });
    // stacje węzłowe JGCA: położenia (1–3 węzły na stację)
    var GEJ = new V3(1.6, 7, -0.2);
    var off = function (p, d) { return [p[0] + d[0], p[1] + d[1], p[2] + d[2]]; };
    function onV(id, f, d) { var c = curveOf(P[id]); return off(A(c.getPointAt(f)), d || [0, 0.25, 0.2]); }
    var ST = {
      '1': [A(GEJ.clone().add(new V3(-0.9, -0.5, -0.2))), A(GEJ.clone().add(new V3(-0.7, -1.1, 0.3)))],
      '2': [A(GEJ.clone().add(new V3(1.0, 0.9, -0.7))), A(GEJ.clone().add(new V3(1.5, 1.4, -0.4)))],
      '3a': [0.25, 0.36, 0.47].map(function (t) { return A(side(t, -1, 0.75)); }),
      '3b': [0.74, 0.86].map(function (t) { return A(side(t, -1, 0.75)); }),
      '4sa': [onV('sg0', 0.55), onV('sg1', 0.6)],
      '4sb': [0.4, 0.48].map(function (t) { return A(side(t, 1, 0.85)); }),
      '4d': [0.62, 0.74, 0.86].map(function (t) { return A(side(t, 1, 0.85)); }),
      '5': [off(RGA0, [0.35, 0.1, 0.55]), off(P.rga[1], [0, 0.35, 0.1])],
      '6': [off(RGEA0, [0.35, -0.2, 0.3]), off(P.rgea[1], [0.2, -0.3, 0])],
      '7': [onV('lga', 0.3), onV('lga', 0.55)],
      '8a': [onV('cha', 0.35, [0, 0.3, 0.3]), onV('cha', 0.7, [0, 0.3, 0.3])],
      '9': [off(T, [-0.45, 0.25, -0.2]), off(T, [0.5, 0.3, -0.3])],
      '10': [[5.7, 1.5, -2.4], [5.9, 2.3, -1.6]],
      '11p': [onV('spa', 0.25), onV('spa', 0.42)],
      '11d': [onV('spa', 0.6, [0, 0.3, 0.25]), onV('spa', 0.74, [-0.1, 0.3, 0.3])],
      '12a': [onV('pha', 0.45, [0.35, 0, 0.2]), onV('pha', 0.7, [0.35, 0, 0.2])]
    };
    // przecięcie naczynia w punkcie f: część pozostająca z podwiązaniem i część usuwana (kolejność: od początku naczynia)
    function splitV(pts, f) {
      var c = curveOf(pts), a = [], b = [];
      for (var i = 0; i <= 8; i++) a.push(A(c.getPointAt(f * i / 8)));
      var n = Math.max(6, Math.round(pts.length * 2.5)); for (var j = 0; j <= n; j++) b.push(A(c.getPointAt(Math.min(1, f + (1 - f) * j / n))));
      return [a, b];
    }
    // sieć mniejsza: od krzywizny mniejszej do przyczepu wątrobowego (wnęka wątroby — szczelina więzadła żylnego); sieć większa: fartuch z krzywizny większej
    function omMin() {
      var rows = [], H0 = new V3(-2.45, 6.0, -1.55), H1 = new V3(0.7, 7.7, -1.4);
      for (var i = 0; i <= 28; i++) { var t = 0.12 + (0.97 - 0.12) * i / 28; rows.push([A(side(t, -1, 0.04)), A(H1.clone().lerp(H0, (t - 0.12) / 0.85)), t]); }
      return rows;
    }
    function omMaj(t0) {
      var rows = [];
      for (var i = 0; i <= 30; i++) { var t = t0 + (0.97 - t0) * i / 30, e = side(t, 1, 0.04), drop = 3.4 * Math.min(1, 0.35 + (t - 0.25) * 1.4); rows.push([A(e), A(e.clone().add(new V3(0, -drop, 1.6))), t]); }
      return rows;
    }
    // trzustka: SMA (przed aortą, za szyją trzustki, przed częścią poziomą dwunastnicy), SMV i żyła śledzionowa (za trzustką, przed SMA),
    // łuki trzustkowo-dwunastnicze: GDA → ASPDA (przód głowy) / PSPDA (tył) → IPDA z SMA
    P.sma = [[0.85, -0.9, -3.65], [0.75, -2.5, -3.35], [0.55, -4.0, -2.4], [0.4, -5.6, -0.9], [0.3, -6.6, -0.25], [0.2, -8.5, 0.0]];
    P.smv = [[-0.55, -8.5, 0.05], [-0.65, -6.6, 0.05], [-0.85, -4.8, -1.0], [-1.05, -3.4, -2.2], [-1.1, -2.6, -2.85]];
    P.sv = [[-1.1, -2.6, -2.85], [0.6, -2.45, -2.97], [2.2, -2.1, -3.15], [4.0, -1.6, -3.35], [5.8, -0.8, -3.4], [6.6, 0.3, -3.5]];
    var IP0 = A(curveOf(P.sma).getPointAt(0.5)), J0 = [-1.9, -5.35, -1.75];
    P.ipda = [IP0, [-0.5, -4.85, -2.1], J0];
    P.aspda = [P.gda[3], [-3.3, -3.2, 0.4], [-3.65, -4.6, 0.3], [-3.0, -5.6, -0.35], J0];
    P.pspda = [A(curveOf(P.gda).getPointAt(0.45)), [-2.9, -1.6, -1.9], [-3.35, -2.6, -2.05], [-3.4, -4.4, -2.25], [-2.5, -5.4, -2.15], J0];
    var head = function (y, d) { return [-2.4 + d[0], y + d[1], -1.0 + d[2]]; };
    ST['12b1'] = [[-3.05, 4.3, -1.05], [-3.25, 2.9, -1.15]];
    ST['12b2'] = [[-3.55, 1.3, -1.35], [-3.75, 0.2, -1.4]];
    ST['12c'] = [[-3.75, 4.9, -0.85]];
    ST['12p'] = [[-2.05, 2.2, -2.95], [-2.3, 3.6, -2.8]];
    ST['13a'] = [head(-2.6, [-0.5, 0, -1.55]), head(-3.3, [-1.0, 0, -1.4])];
    ST['13b'] = [head(-4.3, [-0.7, 0, -1.6]), head(-5.1, [-0.2, 0, -1.45])];
    ST['14a'] = [[0.35, -1.7, -3.15]];
    ST['14b'] = [[0.05, -4.3, -2.15], [0.1, -3.7, -2.55]];
    ST['17a'] = [head(-2.5, [-0.4, 0, 1.55]), head(-3.2, [-1.1, 0, 1.45])];
    ST['17b'] = [head(-4.3, [-0.6, 0, 1.6]), head(-5.0, [0.1, 0, 1.4])];
    ST['18'] = [[2.6, -3.35, -2.4], [4.4, -2.8, -2.75]];
    // mezopankreas: tkanka między prawym brzegiem SMA a tylno-przyśrodkową powierzchnią głowy trzustki
    function mesoPanc() {
      var rows = [], cs = curveOf(P.sma);
      for (var i = 0; i <= 16; i++) {
        var y = -2.7 - 2.9 * i / 16, f = nearestT(cs, [0.6, y, -2.5], 300), R = cs.getPointAt(f).add(new V3(-0.25, 0, 0));
        var ph = nearestT(C_PANC, [-2.0, y, -1.0], 300), Pc = C_PANC.getPointAt(Math.min(ph, 0.3)), d = R.clone().sub(Pc); d.y = 0; d.normalize();
        rows.push([A(Pc.clone().addScaledVector(d, PANC_R(Math.min(ph, 0.3)) * 0.85).add(new V3(0, 0, -0.35))), A(R), y]);
      }
      return rows;
    }
    return { P: P, ST: ST, TW: TW, splitV: splitV, side: side, omMin: omMin, omMaj: omMaj, mesoPanc: mesoPanc, A: A, T: T, LJ: LJ, GJ: GJ };
  })();

  // narzędzie krezki dla resekcji żołądka: op 'tg' — gastrektomia całkowita, 'dg' — resekcja dystalna; off — przesunięcie preparatu (skala po przygotowaniu)
  function gastricMeso(op, off) {
    var P = UG.P, V = [], tg = op === 'tg';
    var ctx = function (id, name, kind, extra) { var o = { id: id, name: name, kind: kind, pts: P[id] }; for (var k in extra) o[k] = extra[k]; return o; };
    V.push(ctx('ao', '', 'o', { r: 0.62 }), ctx('ct', 'Pień trzewny', 'a', { r: 0.2, at: 0.6 }), ctx('cha', 'CHA — tętnica wątrobowa wspólna', 'a', { r: 0.14, at: 0.5 }),
      ctx('pha', 'PHA — tętnica wątrobowa właściwa', 'a', { r: 0.12, at: 0.6 }), ctx('gda', 'GDA — tętnica żołądkowo-dwunastnicza', 'a', { r: 0.11, at: 0.5 }),
      ctx('spa', 'Tętnica śledzionowa', 'a', { r: 0.14, at: 0.6 }), ctx('pv', '', 'v', { r: 0.26 }));
    // podwiązania u odejścia: LGA (pień trzewny), RGA (PHA), RGEA (GDA), LGEA (śledzionowa)
    var lga = UG.splitV(P.lga, 0.1), rga = UG.splitV(P.rga, 0.08), rgea = UG.splitV(P.rgea, 0.07), lgea = UG.splitV(P.lgea, 0.1);
    V.push({ id: 'lga', name: 'LGA — tętnica żołądkowa lewa', kind: 'a', r: 0.1, pts: lga[0], tie: 0.9, at: 0.5 }, { id: 'lgaR', name: '', kind: 'a', r: 0.1, pts: lga[1], removed: true });
    V.push({ id: 'rga', name: 'RGA — tętnica żołądkowa prawa', kind: 'a', r: 0.08, pts: rga[0], tie: 0.85, at: 0.4 }, { id: 'rgaR', name: '', kind: 'a', r: 0.08, pts: rga[1], removed: true });
    V.push({ id: 'rgea', name: 'RGEA — tętnica żołądkowo-sieciowa prawa', kind: 'a', r: 0.09, pts: rgea[0], tie: 0.85, at: 0.4 }, { id: 'rgeaR', name: '', kind: 'a', r: 0.09, pts: rgea[1], removed: true });
    V.push({ id: 'lgea', name: 'LGEA — tętnica żołądkowo-sieciowa lewa', kind: 'a', r: 0.08, pts: lgea[0], tie: 0.85, at: 0.4 }, { id: 'lgeaR', name: '', kind: 'a', r: 0.08, pts: lgea[1], removed: true });
    V.push({ id: 'lgaArc', name: '', kind: 'm', r: 0.07, pts: P.lgaArc, removed: true });
    // krótkie tętnice żołądkowe: w gastrektomii całkowitej przecięte przy śledzionie, w resekcji dystalnej zostają (ukrwienie kikuta)
    P.sg.forEach(function (p, i) {
      if (tg) { var s = UG.splitV(p, 0.18); V.push({ id: 'sg' + i, name: i === 1 ? 'Krótkie tętnice żołądkowe' : '', kind: 'a', r: 0.05, pts: s[0], tie: 0.75, at: 0.6 }, { id: 'sgR' + i, name: '', kind: 'a', r: 0.05, pts: s[1], removed: true }); }
      else V.push({ id: 'sg' + i, name: i === 1 ? 'Krótkie tętnice żołądkowe' : '', kind: 'a', r: 0.05, pts: p, at: 0.6 });
    });
    // gałęzie do ściany: przy kikucie (resekcja dystalna) zostają tylko gałęzie krótkich tętnic w obrębie dna
    var twK = [], twR = [];
    UG.TW.forEach(function (w) { twR.push(w.pts); }); // gałęzie łuków krzywizn — z preparatem (łuki przecięte u odejścia)
    if (twK.length) V.push({ id: 'tw', name: '', kind: 'r', segs: twK });
    V.push({ id: 'twR', name: '', kind: 'r', segs: twR, removed: true });
    // węzły: D2 z preparatem; poza D2 zostają (gastrektomia całkowita: 10; dystalna: 2, 4sa, 10, 11d)
    var D2 = tg ? ['1', '2', '3a', '3b', '4sa', '4sb', '4d', '5', '6', '7', '8a', '9', '11p', '11d', '12a'] : ['1', '3a', '3b', '4sb', '4d', '5', '6', '7', '8a', '9', '11p', '12a'];
    var nodes = [];
    Object.keys(NG_JGCA).forEach(function (g) { UG.ST[g].forEach(function (p) { nodes.push({ p: p, g: g, removed: D2.indexOf(g) >= 0 }); }); });
    var sheets = [{ rows: UG.omMin(), removed: true }, { rows: UG.omMaj(tg ? 0.25 : 0.3), removed: true }];
    return { type: 'meso', sheets: sheets, vessels: V, nodes: nodes, groups: nodeGroups(nodes, NG_JGCA, 'jgca'),
      name: 'Sieć mniejsza i większa', sub: 'usuwane z żołądkiem', anchor: UG.A(UG.side(0.62, 1, 2.6)),
      offset: [[2.15, [0, 0, 0]], [2.9, off]], opacity: [[2.55, 1], [2.9, 0]], tieT: 1.25 };
  }

  /* ---------- Trzustka: pankreatoduodenektomia (Whipple, PPPD) i pankreatektomia dystalna ----------
     Numeracja JPS (Japan Pancreas Society) — przyjęta przez ISGPS; limfadenektomia standardowa wg ISGPS (Tol i wsp., Surgery 2014):
     PD — stacje 5, 6, 8a, 12b1, 12b2, 12c, 13a, 13b, 14a, 14b, 17a, 17b; trzon i ogon — 10, 11, 18. */
  var NG_JPS = Object.assign({}, NG_JGCA, {
    '12b1': 'wzdłuż przewodu żółciowego — górne', '12b2': 'wzdłuż przewodu żółciowego — dolne', '12c': 'wzdłuż przewodu pęcherzykowego', '12p': 'wzdłuż żyły wrotnej',
    '13a': 'tylna powierzchnia głowy trzustki — górne', '13b': 'tylna powierzchnia głowy trzustki — dolne', '14a': 'prawy brzeg SMA — u odejścia', '14b': 'prawy brzeg SMA — u odejścia IPDA',
    '17a': 'przednia powierzchnia głowy trzustki — górne', '17b': 'przednia powierzchnia głowy trzustki — dolne', '18': 'dolny brzeg trzonu trzustki' });
  NG_SYS.jps = 'Numeracja JPS (Japan Pancreas Society); limfadenektomia standardowa wg ISGPS 2014';
  // op: 'whip' (z antrektomią), 'pppd' (z zachowaniem odźwiernika), 'dp' (pankreatektomia dystalna ze splenektomią); off — przesunięcie preparatu
  function pancMeso(op, off) {
    var P = UG.P, V = [], dp = op === 'dp', pp = op === 'pppd';
    var ctx = function (id, name, kind, extra) { var o = { id: id, name: name, kind: kind, pts: P[id] }; for (var k in extra) o[k] = extra[k]; return o; };
    function cutV(id, f, name, kind, r, keepFirst, extra) { // naczynie przecięte w f: część pozostająca z podwiązaniem i część z preparatem
      var s = UG.splitV(P[id], f), k = keepFirst ? 0 : 1;
      V.push(Object.assign({ id: id, name: name, kind: kind, r: r, pts: s[k], tie: keepFirst ? 0.88 : 0.12, at: 0.5 }, extra || {}));
      V.push({ id: id + 'R', name: '', kind: kind, r: r, pts: s[1 - k], removed: true });
    }
    V.push(ctx('ao', '', 'o', { r: 0.62 }), ctx('ct', 'Pień trzewny', 'a', { r: 0.2, at: 0.6 }), ctx('cha', 'CHA — tętnica wątrobowa wspólna', 'a', { r: 0.14, at: 0.5 }),
      ctx('pha', 'PHA — tętnica wątrobowa właściwa', 'a', { r: 0.12, at: 0.6 }), ctx('lga', '', 'a', { r: 0.1 }),
      ctx('sma', 'SMA — tętnica krezkowa górna', 'a', { r: 0.16, at: 0.62 }), ctx('smv', 'SMV — żyła krezkowa górna', 'v', { r: 0.2, at: 0.25 }), ctx('pv', 'Żyła wrotna', 'v', { r: 0.26, at: 0.6 }));
    if (dp) {
      cutV('spa', 0.1, 'Tętnica śledzionowa', 'a', 0.14, true);
      cutV('sv', 0.24, 'Żyła śledzionowa', 'v', 0.15, true);
      V.push(ctx('gda', 'GDA — tętnica żołądkowo-dwunastnicza', 'a', { r: 0.11, at: 0.5 }), ctx('rga', '', 'a', { r: 0.08 }), ctx('rgea', '', 'a', { r: 0.09 }), ctx('aspda', '', 'a', { r: 0.06 }), ctx('pspda', '', 'a', { r: 0.06 }), ctx('ipda', '', 'a', { r: 0.06 }));
      cutV('lgea', 0.35, '', 'a', 0.08, false);
      P.sg.forEach(function (p, i) { var s = UG.splitV(p, 0.82); V.push({ id: 'sg' + i, name: '', kind: 'a', r: 0.05, pts: s[1], tie: 0.15 }, { id: 'sgR' + i, name: '', kind: 'a', r: 0.05, pts: s[0], removed: true }); });
      V.push(ctx('lgaArc', '', 'm', { r: 0.07 }), { id: 'tw', name: '', kind: 'r', segs: UG.TW.map(function (w) { return w.pts; }) });
    } else {
      V.push(ctx('spa', 'Tętnica śledzionowa', 'a', { r: 0.14, at: 0.6 }), ctx('sv', '', 'v', { r: 0.15 }), ctx('lgea', '', 'a', { r: 0.08 }));
      P.sg.forEach(function (p, i) { V.push({ id: 'sg' + i, name: '', kind: 'a', r: 0.05, pts: p }); });
      cutV('gda', 0.14, 'GDA — tętnica żołądkowo-dwunastnicza', 'a', 0.11, true);
      cutV('ipda', 0.16, 'IPDA — tętnica trzustkowo-dwunastnicza dolna', 'a', 0.07, true, { at: 0.6 });
      V.push({ id: 'aspda', name: '', kind: 'a', r: 0.06, pts: P.aspda, removed: true }, { id: 'pspda', name: '', kind: 'a', r: 0.06, pts: P.pspda, removed: true });
      // RGEA odchodzi od GDA — z preparatem; łuk krzywizny większej zostaje (z LGEA). RGA: Whipple — z antrum, PPPD — zostaje
      var rgeaS = UG.splitV(P.rgea, 0.32); V.push({ id: 'rgeaR', name: '', kind: 'a', r: 0.09, pts: rgeaS[0], removed: true }, { id: 'rgea', name: '', kind: 'a', r: 0.09, pts: rgeaS[1], tie: pp ? 0.03 : null });
      if (pp) V.push(ctx('rga', 'RGA — tętnica żołądkowa prawa', 'a', { r: 0.08, at: 0.3 }), ctx('lgaArc', '', 'm', { r: 0.07 }), { id: 'tw', name: '', kind: 'r', segs: UG.TW.map(function (w) { return w.pts; }) });
      else {
        cutV('rga', 0.08, 'RGA — tętnica żołądkowa prawa', 'a', 0.08, true, { at: 0.4 });
        V.push(ctx('lgaArc', '', 'm', { r: 0.07 }));
        var twK = [], twR = []; UG.TW.forEach(function (w) { (w.t > tDG ? twR : twK).push(w.pts); });
        V.push({ id: 'tw', name: '', kind: 'r', segs: twK }, { id: 'twR', name: '', kind: 'r', segs: twR, removed: true });
      }
    }
    var REM = dp ? ['10', '11p', '11d', '18'] : ['5', '6', '8a', '12b1', '12b2', '12c', '13a', '13b', '14a', '14b', '17a', '17b'];
    var SHOW = dp ? REM.concat(['7', '8a', '9']) : REM.concat(['7', '9', '11p', '12a', '12p']);
    var nodes = [];
    SHOW.forEach(function (g) { (UG.ST[g] || []).forEach(function (p) { nodes.push({ p: p, g: g, removed: REM.indexOf(g) >= 0 }); }); });
    var sheets = dp ? [] : [{ rows: UG.mesoPanc(), removed: true }];
    return { type: 'meso', sag: 0, sheets: sheets, vessels: V, nodes: nodes, groups: nodeGroups(nodes, NG_JPS, 'jps'),
      name: dp ? 'Naczynia i węzły chłonne' : 'Mezopankreas', sub: dp ? 'węzły 10, 11, 18 z preparatem' : 'tkanka między SMA a głową trzustki — z preparatem',
      anchor: dp ? UG.ST['11d'][0] : null, anchorRemoved: dp,
      offset: [[2.15, [0, 0, 0]], [2.9, off]], opacity: [[2.55, 1], [2.9, 0]], tieT: 1.25 };
  }

  /* ---------- Przełyk: esofagektomia z rurą żołądkową (Ivor Lewis, McKeown, przezrozworowa, Akiyama) ----------
     Numeracja AJCC 8. wyd. (mapa węzłów regionalnych przełyku): 1R/1L, 2R/2L, 4R/4L, 7, 8U/8M/8Lo, 9R/9L, 15, 16, 17, 18, 19, 20.
     Rura żołądkowa ukrwiona przez RGEA (łuk krzywizny większej zachowany, podąża za rurą); LGA podwiązana u odejścia,
     krzywizna mniejsza z siecią mniejszą i węzłami usuwana z preparatem; krótkie tętnice żołądkowe i LGEA przecięte.
     Zakres limfadenektomii zależy od ośrodka i typu histologicznego — w modelu: Ivor Lewis dwupolowa (śródpiersie dolne i środkowe
     z podostrogowymi + jama brzuszna), McKeown rozszerzona o górne śródpiersie, Akiyama trzypolowa (także szyjne),
     przezrozworowa — dolne śródpiersie i jama brzuszna. */
  var NG_AJCC = {
    '1R': 'szyjne dolne przytchawicze prawe', '1L': 'szyjne dolne przytchawicze lewe', '2R': 'przytchawicze górne prawe', '2L': 'przytchawicze górne lewe',
    '4R': 'przytchawicze dolne prawe', '4L': 'przytchawicze dolne lewe', '7': 'podostrogowe', '8U': 'okołoprzełykowe — górna część piersiowa',
    '8M': 'okołoprzełykowe — środkowa część piersiowa', '8Lo': 'okołoprzełykowe — dolna część piersiowa', '9R': 'więzadło płucne prawe', '9L': 'więzadło płucne lewe',
    '15': 'przeponowe', '16': 'przywpustowe', '17': 'wzdłuż LGA', '18': 'wzdłuż CHA', '19': 'wzdłuż tętnicy śledzionowej', '20': 'wokół pnia trzewnego' };
  NG_ORDER.ajcc = ['1R', '1L', '2R', '2L', '4R', '4L', '7', '8U', '8M', '8Lo', '9R', '9L', '15', '16', '17', '18', '19', '20'];
  NG_SYS.ajcc = 'Numeracja AJCC, 8. wyd. (mapa węzłów regionalnych przełyku)';
  var ST_ESO = {
    '1R': [[-1.1, 24.2, -0.6]], '1L': [[0.9, 24.2, -0.9]], '2R': [[-1.05, 21.4, -0.9]], '2L': [[0.9, 21.4, -1.4]], '4R': [[-1.05, 18.7, -1.2]], '4L': [[0.95, 18.6, -1.9]],
    '7': [[0.0, 16.4, -2.05], [0.35, 15.8, -1.85]], '8U': [[-0.7, 19.4, -3.5], [0.95, 20.0, -3.55]], '8M': [[-0.5, 12.6, -2.9], [1.2, 14.2, -3.2]], '8Lo': [[0.0, 9.3, -1.9], [1.75, 8.6, -1.55]],
    '9R': [[-1.3, 9.6, -2.5]], '9L': [[2.4, 9.3, -2.4]], '15': [[0.45, 6.6, -1.45], [2.7, 6.5, -1.5]] };
  function esoMeso(kind, stom, off) {
    var P = UG.P, V = [], V3 = THREE.Vector3, A = UG.A;
    // odwzorowanie punktu przy rurze żołądkowej na jej położenie po podciągnięciu (ten sam parametr długości łuku co przemiana obiektu)
    var cPre = curveOf(stom.pre.path), cPost = curveOf(stom.post.path);
    function toPost(p) {
      var q = new V3().fromArray(p), u = nearestT(cPre, p, 400), a = cPre.getPointAt(u), d = q.clone().sub(a), Tq = cPost.getTangentAt(u), dist = d.length();
      d.sub(Tq.clone().multiplyScalar(d.dot(Tq))); if (d.lengthSq() < 1e-6) d.set(1, 0, 0); return A(cPost.getPointAt(u).addScaledVector(d.normalize(), dist));
    }
    function moving(pts) { return pts.map(toPost); }
    var ctx = function (id, name, kind2, extra) { var o = { id: id, name: name, kind: kind2, pts: P[id] }; for (var k in extra) o[k] = extra[k]; return o; };
    V.push(ctx('ao', '', 'o', { r: 0.62 }), ctx('ct', 'Pień trzewny', 'a', { r: 0.2, at: 0.6 }), ctx('cha', 'CHA — tętnica wątrobowa wspólna', 'a', { r: 0.14, at: 0.5 }),
      ctx('pha', '', 'a', { r: 0.12 }), ctx('gda', 'GDA — tętnica żołądkowo-dwunastnicza', 'a', { r: 0.11, at: 0.5 }), ctx('spa', 'Tętnica śledzionowa', 'a', { r: 0.14, at: 0.6 }));
    var lga = UG.splitV(P.lga, 0.1);
    V.push({ id: 'lga', name: 'LGA — tętnica żołądkowa lewa', kind: 'a', r: 0.1, pts: lga[0], tie: 0.9, at: 0.5 }, { id: 'lgaR', name: '', kind: 'a', r: 0.1, pts: lga[1], removed: true });
    V.push({ id: 'lgaArc', name: '', kind: 'm', r: 0.07, pts: P.lgaArc, removed: true });
    // RGA zwykle zachowana (ukrwienie odcinka przyodźwiernikowego rury); jej łuk wzdłuż krzywizny mniejszej — z preparatem
    var rgaS = UG.splitV(P.rga, 0.3);
    V.push({ id: 'rga', name: 'RGA — tętnica żołądkowa prawa', kind: 'a', r: 0.08, pts: rgaS[0], tie: 0.92, at: 0.45 }, { id: 'rgaR', name: '', kind: 'm', r: 0.07, pts: rgaS[1], removed: true });
    // łuk żołądkowo-sieciowy prawy wzdłuż rury — zachowany, podąża za rurą
    V.push({ id: 'rgea', name: 'RGEA — łuk krzywizny większej (ukrwienie rury)', kind: 'a', r: 0.1, pts: P.rgea, post: moving(P.rgea), at: 0.55 });
    var lr = UG.splitV(P.lgea.slice(0, 4), 0.14), la = P.lgea.slice(3);
    V.push({ id: 'lgea', name: '', kind: 'a', r: 0.08, pts: lr[0], tie: 0.8 }, { id: 'lgeaR', name: '', kind: 'a', r: 0.08, pts: lr[1], removed: true },
      { id: 'lgeaArc', name: '', kind: 'a', r: 0.08, pts: la, post: moving(la), tie: 0.06 });
    P.sg.forEach(function (p, i) { var s = UG.splitV(p, 0.35); V.push({ id: 'sg' + i, name: '', kind: 'a', r: 0.05, pts: s[0], tie: 0.85 }, { id: 'sgR' + i, name: '', kind: 'a', r: 0.05, pts: s[1], removed: true }); });
    var twK = [], twKp = [], twR = [];
    UG.TW.forEach(function (w) { if (w.k > 0) { twK.push(w.pts); twKp.push(moving(w.pts)); } else twR.push(w.pts); });
    V.push({ id: 'tw', name: '', kind: 'r', segs: twK, segsPost: twKp }, { id: 'twR', name: '', kind: 'r', segs: twR, removed: true });
    // węzły: stacje brzuszne (16–20 w miejscu stacji JGCA 1/2, 7, 8a, 11p, 9) i śródpiersiowe
    var ABD = { '16': UG.ST['1'].concat(UG.ST['2']), '17': UG.ST['7'], '18': UG.ST['8a'], '19': UG.ST['11p'], '20': UG.ST['9'] };
    var base = ['7', '8M', '8Lo', '9R', '9L', '15', '16', '17', '18', '19', '20'];
    var REM = kind === 'the' ? ['8Lo', '15', '16', '17', '18', '19', '20'] : kind === 'il' ? base : kind === 'mck' ? base.concat(['8U', '4R', '4L', '2R', '2L']) : base.concat(['8U', '4R', '4L', '2R', '2L', '1R', '1L']);
    var nodes = [];
    Object.keys(NG_AJCC).forEach(function (g) { (ST_ESO[g] || ABD[g] || []).forEach(function (p) { nodes.push({ p: p, g: g, removed: REM.indexOf(g) >= 0 }); }); });
    // tkanka okołoprzełykowa (tzw. mezoesofagus) między przełykiem a aortą zstępującą — z preparatem; sieć mniejsza z krzywizną mniejszą
    var meso = [], CA = curveOf([[2.5, 14, -3.7], [2.3, 10, -4.0], [1.6, 6, -4.2]]);
    for (var i = 0; i <= 14; i++) {
      var y = 7.4 + (14.6 - 7.4) * i / 14, pe = C_ESOF.getPointAt(nearestT(C_ESOF, [0.6, y, -2.2], 300)), pa = CA.getPointAt(nearestT(CA, [2.2, y, -4.0], 300));
      var d = pa.clone().sub(pe); d.y = 0; d.normalize();
      meso.push([A(pe.clone().addScaledVector(d, 0.75)), A(pa.clone().addScaledVector(d, -0.78)), y]);
    }
    return { type: 'meso', sag: 0, sheets: [{ rows: UG.omMin(), removed: true }, { rows: meso, removed: true }], vessels: V, nodes: nodes, groups: nodeGroups(nodes, NG_AJCC, 'ajcc'),
      name: 'Tkanka okołoprzełykowa i sieć mniejsza', sub: 'z węzłami — z preparatem', anchor: meso[5][1],
      offset: [[2.15, [0, 0, 0]], [2.9, off]], opacity: [[2.55, 1], [2.9, 0]], tieT: 1.25, morph: [3.35, 4.0] };
  }

  // jedno zdanie w opisie zabiegu: zakres limfadenektomii i podwiązania (warstwa „Krezka, naczynia i węzły chłonne”)
  var UP_NOTES = {
    tg: 'Limfadenektomia D2 (JGCA 2025): stacje 1–7, 8a, 9, 11p, 11d, 12a; LGA, RGA, RGEA i LGEA podwiązane u odejścia, krótkie tętnice żołądkowe przy śledzionie; śledziona zachowana (stacja 10 poza D2). Sieć większa usuwana standardowo przy guzach T3 i głębszych.',
    dg: 'Limfadenektomia D2 (JGCA 2025): stacje 1, 3, 4sb, 4d, 5, 6, 7, 8a, 9, 11p, 12a; LGA, RGA, RGEA i LGEA podwiązane u odejścia, krótkie tętnice żołądkowe zachowane — ukrwienie kikuta żołądka. Sieć większa usuwana standardowo przy guzach T3 i głębszych.',
    pd: 'Limfadenektomia standardowa (ISGPS 2014, numeracja JPS): stacje 5, 6, 8a, 12b1, 12b2, 12c, 13a, 13b, 14a, 14b, 17a, 17b; GDA podwiązana u odejścia, IPDA przy SMA; mezopankreas (tkanka między SMA a głową trzustki) z preparatem, SMA i żyła wrotna zachowane.',
    dp: 'Limfadenektomia standardowa (ISGPS 2014): stacje 10, 11, 18; tętnica śledzionowa podwiązana przy odejściu, żyła śledzionowa przy połączeniu z SMV.',
    eso: 'Rura żołądkowa ukrwiona przez RGEA (łuk krzywizny większej zachowany); LGA podwiązana u odejścia, krótkie tętnice żołądkowe i LGEA przecięte.',
    il: 'Węzły (AJCC 8): w modelu limfadenektomia dwupolowa — śródpiersie dolne i środkowe (8Lo, 8M, 7, 9, 15) i jama brzuszna (16–20); zakres zależy od ośrodka i typu histologicznego.',
    mck: 'Węzły (AJCC 8): w modelu limfadenektomia dwupolowa rozszerzona o górne śródpiersie (8U, 4R/4L, 2R/2L) i jama brzuszna (16–20); zakres zależy od ośrodka i typu histologicznego.',
    aki: 'Węzły (AJCC 8): w modelu limfadenektomia trzypolowa — także węzły szyjne (1R/1L), górne i dolne śródpiersie oraz jama brzuszna; zakres zależy od ośrodka i typu histologicznego.',
    the: 'Węzły (AJCC 8): dolne śródpiersie (8Lo, 15) i jama brzuszna (16–20), bez systematycznej limfadenektomii w klatce piersiowej.'
  };

  // śledziona jako narząd odniesienia dla stacji 4sa, 10 i 11d (zachowana) — w modelach z warstwą węzłów górnego piętra;
  // ta sama co w pankreatektomii dystalnej (tam usuwana z preparatem). Dodawana po przygotowaniu wariantu (bez kluczy czasowych).
  function addSpleen(v) {
    if (v.objects.some(function (o) { return o.id === 'spleen'; })) return;
    v.objects.push({ id: 'spleen', name: 'Śledziona', organ: true, pre: { path: SPLEEN, r: SPLEEN_R }, color: '#8d3f4f', labels: [{ text: 'Śledziona', t: 0.5, sub: '', win: [-9, 100] }] });
    v.ctMap.spleen = 'organ'; v.ctNames.spleen = 'Śledziona';
  }
