  /* =====================================================================
     JELITO GRUBE
     ===================================================================== */
  var COLON = [[-7.0, -9.6, 0.6], [-7.4, -7.5, 0.4], [-7.6, -4, 0.2], [-7.4, -0.5, 0], [-7.0, 3, 0], [-6.2, 5.6, 0.2], [-4.4, 5.8, 1.6], [-2, 4.2, 2.6], [0.6, 3.4, 2.8],
    [3.2, 4.4, 2.4], [5.6, 6.6, 1], [7.2, 7.4, -0.4], [7.9, 5, -0.8], [8, 1, -0.8], [7.8, -3, -0.6], [7.2, -6.4, -0.2], [5.4, -8.8, 1], [2.6, -8.2, 2.2], [0.4, -9.6, 2.4],
    [0.6, -12, 1.4], [0.4, -14, -0.6], [0, -16.2, -1.4], [0, -18.2, -1.0], [0, -19.6, 0.4]];
  var C_COL = curveOf(COLON);
  function ct(p) { return nearestT(C_COL, p, 1500); }
  var COL_R = profile([[0, 0.05], [0.012, 1.7], [0.04, 1.9], [ct([-7.4, -0.5, 0]), 1.7], [ct([-6.2, 5.6, 0.2]), 1.5], [ct([0.6, 3.4, 2.8]), 1.35], [ct([7.2, 7.4, -0.4]), 1.25],
    [ct([8, 1, -0.8]), 1.15], [ct([7.2, -6.4, -0.2]), 1.05], [ct([2.6, -8.2, 2.2]), 1.0], [ct([0.6, -12, 1.4]), 1.05], [ct([0, -16.2, -1.4]), 1.6], [ct([0, -18.2, -1.0]), 0.9], [1, 0.5]]);
  var TI = [[4.0, -5.2, 0.8], [1.2, -6.2, 1.4], [-2.0, -7.2, 1.4], [-4.4, -7.8, 1.0], [-6.0, -7.9, 0.6]];
  var C_TI = curveOf(TI);
  var APP = [[-6.9, -9.2, 0.6], [-6.8, -10.8, 0.7], [-6.2, -12.2, 0.9], [-5.4, -13.2, 1.2]];
  var APP_R = profile([[0, 0.3], [0.85, 0.28], [1, 0.05]]);
  var MUC_C = '#eab9a3', COLC = { colon: '#c98f6b', ti: '#d9929f', app: '#c77f8e', rect: '#b9786a' };
  var ICV = [-5.9, -7.9, 0.6];
  var COL_LABELS = [['Kątnica', 0.02], ['Okrężnica wstępująca', ct([-7.4, -0.5, 0])], ['Poprzecznica', ct([0.6, 3.4, 2.8])], ['Okrężnica zstępująca', ct([8, 1, -0.8])],
    ['Esica', ct([2.6, -8.2, 2.2])], ['Odbytnica', ct([0, -16.2, -1.4])]];
  function colObj(id, t0, t1, extra) {
    var o = { id: id, name: extra.name, pre: sub(C_COL, COL_R, t0, t1, Math.max(12, Math.round(90 * (t1 - t0)))), color: COLC.colon, mucosa: 'haustra', tint: MUC_C, labels: [] };
    COL_LABELS.forEach(function (lb) { if (lb[1] > t0 + 0.01 && lb[1] < t1 - 0.01) o.labels.push(L(lb[0], (lb[1] - t0) / (t1 - t0), extra.win || ALL)); });
    for (var k in extra) if (k !== 'win') o[k] = extra[k];
    return o;
  }
  function tiObj(extra) {
    var o = { id: 'ti', name: 'Jelito kręte', pre: { path: TI, r: flat(0.9) }, color: COLC.ti, mucosa: 'circular', tint: MUC.bowel, labels: [L('Jelito kręte (końcowy odcinek)', 0.35, ALL)] };
    for (var k in extra) o[k] = extra[k]; return o;
  }
  function appObj(extra) {
    var o = { id: 'app', name: 'Wyrostek robaczkowy', pre: { path: APP, r: APP_R }, color: COLC.app, mucosa: 'smooth', tint: MUC_C, labels: [L('Wyrostek', 0.7, PRE)] };
    for (var k in extra) o[k] = extra[k]; return o;
  }
  var COL_TEXT = {
    normal: ['Jelito grube: anatomia prawidłowa', 'Końcowy odcinek jelita krętego, kątnica, okrężnica, esica i odbytnica.'],
    top: 'Z góry widać, które odcinki leżą z przodu (poprzecznica, esica), a które przy tylnej ścianie.'
  };

  /* ---------- Prawostronna hemikolektomia ---------- */
  var tR = ct([-2.0, 4.2, 2.6]), tI = nearestT(C_TI, [0.2, -6.6, 1.4]);
  var TI_KEEP = sub(C_TI, flat(0.9), 0, tI, 16), TI_CUT = sub(C_TI, flat(0.9), tI, 1, 12);
  var COL_KEEP = sub(C_COL, COL_R, tR, 1, 80);
  var ILE_ISO = [[4.0, -5.2, 0.8], [1.6, -3.8, 2.0], [-1.4, -2.0, 2.9], [-3.6, 0.6, 3.4], [-3.2, 2.5, 3.6], [-1.8, 3.0, 3.8], [0.6, 2.2, 4.0], [2.4, 2.8, 3.7]];
  var ILE_ANTI = [[4.0, -5.2, 0.8], [3.8, -2.4, 2.2], [3.0, 0.4, 3.4], [1.6, 2.2, 3.9], [-0.8, 2.9, 4.0], [-3.2, 3.2, 3.8]];
  var COL_ANTI = { path: [[-3.3, 4.6, 2.4]].concat(COL_KEEP.path), r: function (t) { return t < 0.02 ? 0.06 + (1.35 - 0.06) * sm01(t / 0.02) : COL_KEEP.r(t); } };
  var COL_ISO = { path: COL_KEEP.path, r: function (t) { return t < 0.02 ? 0.06 + (COL_KEEP.r(t) - 0.06) * sm01(t / 0.02) : COL_KEEP.r(t); } };
  var RH_OFF = [[1.15, [0, 0, 0]], [1.9, [-7, -1, 5]]];
  function rhAnat(iso) {
    var ile = iso ? ILE_ISO : ILE_ANTI;
    var marks = [
      ringOn(C_COL, COL_R, tR, { name: 'Przecięcie poprzecznicy', color: COL.cut, opacity: CUT_OP_JEJ }),
      ringOn(C_TI, flat(0.9), tI, { name: 'Przecięcie jelita krętego', color: COL.cut, opacity: CUT_OP_JEJ }),
      { kind: 'line', name: 'Linia zszywek (stapler liniowy)', color: STAPLE, opacity: ANAST_OP, pts: iso ? [[-1.8, 3.4, 4.3], [0, 3.0, 4.45], [1.4, 2.9, 4.4]] : [[-2.6, 3.9, 4.1], [-0.8, 3.5, 4.4], [1.0, 3.1, 4.3]] }
    ];
    if (iso) marks.push({ kind: 'line', name: 'Zamknięcie otworu po staplerze', color: SUT, opacity: ANAST_OP, pts: [[1.9, 4.6, 3.7], [2.0, 3.4, 4.5], [2.1, 2.0, 4.4]] });
    else marks.push({ kind: 'line', name: 'Zamknięcie poprzeczne końców (TA)', color: STAPLE, opacity: ANAST_OP, pts: [[-3.5, 5.7, 2.9], [-3.6, 4.3, 3.9], [-3.6, 2.8, 4.2]] });
    var VES = 'Naczynia podwiązane u odejścia: krętniczo-okrężnicza (IC) i prawa okrężnicy (RC) z tętnicy krezkowej górnej (SMA) oraz gałąź prawa tętnicy środkowej okrężnicy (RBMC); pień MC i jej gałąź lewa zostają.';
    return {
      cat: 'colon', id: iso ? 'rh-iso' : 'rh-anti', short: iso ? 'Hemikolektomia prawa (izo)' : 'Hemikolektomia prawa (FEEA)',
      title: 'Prawostronna hemikolektomia: zespolenie krętniczo-poprzeczne ' + (iso ? 'izoperystaltyczne' : 'antyperystaltyczne (FEEA)'),
      sub: iso ? 'Bok-do-boku, stapler liniowy; typowe przy zespoleniu wewnątrzustrojowym (wewnątrzbrzusznym)' : 'FEEA (functional end-to-end), stapler liniowy + zamknięcie poprzeczne; typowe przy zespoleniu zewnątrzustrojowym (zewnątrzbrzusznym)',
      notes: iso ? [
        'Usunięte: końcowy odcinek jelita krętego, kątnica z wyrostkiem, okrężnica wstępująca, zagięcie wątrobowe i część poprzecznicy.',
        'Jelito kręte ułożone wzdłuż poprzecznicy zgodnie z kierunkiem perystaltyki; kikuty po przeciwnych stronach zespolenia.',
        'W kolonoskopii z poprzecznicy bokiem do jelita krętego, bez zawracania aparatu; kikut okrężnicy za zespoleniem.', VES
      ] : [
        'Usunięte: końcowy odcinek jelita krętego, kątnica z wyrostkiem, okrężnica wstępująca, zagięcie wątrobowe i część poprzecznicy.',
        'Końce jelita krętego i poprzecznicy ułożone obok siebie w tę samą stronę, zamknięte poprzeczną linią zszywek.',
        'W kolonoskopii wejście do jelita krętego wymaga zawrócenia o 180° we wspólnym świetle.', VES
      ],
      focus: { t: [-3, 0, 2], k: 0.72 },
      text: COL_TEXT,
      frames: {
        resect: ['Zakres resekcji', 'Końcowy odcinek jelita krętego, kątnica z wyrostkiem, okrężnica wstępująca i prawa część poprzecznicy z krezką. Naczynia podwiązane u odejścia: IC, RC i gałąź prawa MC (RBMC); pień MC zostaje.', 'Zakres resekcji'],
        remove: ['Usunięcie preparatu', 'Preparat usunięty; pozostaje koniec jelita krętego i poprzecznicy.', 'Usunięcie'],
        recon: iso ? ['Zespolenie izoperystaltyczne', 'Jelito kręte ułożone wzdłuż poprzecznicy zgodnie z perystaltyką; stapler liniowy tworzy wspólne światło, otwór po staplerze zamknięty.', 'Zespolenie']
          : ['Zespolenie antyperystaltyczne (FEEA)', 'Końce ułożone obok siebie w tę samą stronę; stapler liniowy tworzy wspólne światło, końce zamknięte poprzecznie.', 'Zespolenie'],
        post: iso ? 'Kikut jelita krętego i kikut poprzecznicy po przeciwnych stronach zespolenia.' : 'Oba kikuty po tej samej stronie, zamknięte jedną poprzeczną linią zszywek.',
        endoPost: iso ? 'Fragment kolonoskopii: z poprzecznicy bokiem do jelita krętego, bez zawracania aparatu.' : 'Fragment kolonoskopii: we wspólnym świetle zawrócenie o 180° z poprzecznicy do jelita krętego.'
      },
      endoTitles: ['Kolonoskopia: anatomia prawidłowa', 'Kolonoskopia po operacji'],
      objects: [
        tiObj({ pre: TI_KEEP, post: { path: ile, r: STUMP_END }, morph: [2, 2.9], labels: [L('Jelito kręte', 0.3, ALL)] }),
        { id: 'tiCut', name: 'Jelito kręte (usuwane)', pre: TI_CUT, colors: [[0, COLC.ti], [0.7, COL.spec]], opacity: SPEC_OP, offset: RH_OFF, mucosa: 'circular', tint: MUC.bowel },
        colObj('specR', 0, tR, { name: 'Prawa połowa okrężnicy', colors: [[0, COLC.colon], [0.7, COL.spec]], opacity: SPEC_OP, offset: RH_OFF, win: [-9, 1.4] }),
        appObj({ colors: [[0, COLC.app], [0.7, COL.spec]], opacity: SPEC_OP, offset: RH_OFF }),
        colObj('colon', tR, 1, { name: 'Okrężnica', post: iso ? COL_ISO : COL_ANTI, morph: [2, 2.9] })
      ],
      marks: marks,
      endTarget: { pre: ICV },
      endText: { pre: 'Zastawka krętniczo-kątnicza w polu widzenia' },
      routePost: iso ? [{ obj: 'colon', from: [5.6, 6.6, 1.0], to: [0.2, 3.5, 2.8], note: 'Poprzecznica w stronę zespolenia' }, { obj: 'ti', from: [-0.2, 2.5, 4.0], to: [-3.6, 0.6, 3.4], note: 'Bokiem do jelita krętego — bez zawracania' }]
        : [{ obj: 'colon', from: [5.6, 6.6, 1.0], to: [-2.4, 4.3, 2.6], note: 'Poprzecznica w stronę zespolenia' }, { obj: 'ti', from: [-2.4, 3.1, 3.9], to: [3.0, 0.4, 3.4], note: 'Zawrócenie o 180° do jelita krętego' }]
    };
  }

  /* ---------- Poszerzona prawostronna hemikolektomia (z 2/3 poprzecznicy), zespolenie izoperystaltyczne ---------- */
  // tXo — przecięcie poprzecznicy dopasowane do guza (dalej w lewo przy guzie w środkowej części poprzecznicy); bez niego domyślne
  var RHX_T = ct([3.2, 4.4, 2.4]);
  function rhxAnat(tXo) {
    var tX = tXo || RHX_T, keep = sub(C_COL, COL_R, tX, 1, 70);
    var colPost = { path: keep.path, r: function (t) { return t < 0.02 ? 0.06 + (keep.r(t) - 0.06) * sm01(t / 0.02) : keep.r(t); } };
    // jelito kręte przed pozostałą częścią poprzecznicy, w kierunku perystaltyki (koniec ślepy dalej niż początek okrężnicy)
    var V3 = THREE.Vector3, up = new V3(0, 0.15, 1).normalize();
    function along(dt, lift) { var tt = tX + dt, P = C_COL.getPointAt(tt), T = C_COL.getTangentAt(tt), n = up.clone().sub(T.clone().multiplyScalar(up.dot(T))).normalize(); return P.addScaledVector(n, lift); }
    var ile = [[4.0, -5.2, 0.8], [3.4, -2.6, 2.2], [2.4, 0.4, 3.3], [2.0, 2.6, 3.9]].concat([-0.012, 0.004, 0.02, 0.036, 0.05].map(function (d) { return along(d, 1.72).toArray(); }));
    var seam = [0.006, 0.024, 0.042].map(function (d) { return along(d, 1.72 * 1.33 / 2.23).addScaledVector(up, 0.95).toArray(); });
    var g0 = along(0.024, 1.72 * 1.33 / 2.23), gT = C_COL.getTangentAt(tX + 0.024);
    var gS = up.clone().sub(gT.clone().multiplyScalar(up.dot(gT))).normalize();
    var endI = new V3().fromArray(ile[ile.length - 1]), sut = [endI.clone().add(new V3(0.5, 0.9, -0.6)), along(0.05, 0.86).addScaledVector(up, 0.9), endI.clone().add(new V3(-0.3, -0.9, 0.5))].map(function (v) { return v.toArray(); });
    return {
      cat: 'colon', id: 'rh-ext', short: 'Hemikolektomia prawa poszerzona',
      title: 'Poszerzona prawostronna hemikolektomia: zespolenie krętniczo-poprzeczne izoperystaltyczne',
      sub: 'Z usunięciem ok. 2/3 poprzecznicy; bok-do-boku, stapler liniowy',
      notes: ['Usunięte: końcowy odcinek jelita krętego, kątnica z wyrostkiem, okrężnica wstępująca, zagięcie wątrobowe i ok. 2/3 poprzecznicy (prawa i środkowa część).',
        'Typowo przy guzach zagięcia wątrobowego i prawej lub środkowej części poprzecznicy; zespolenie z pozostałą lewą częścią poprzecznicy blisko zagięcia śledzionowego.',
        'Jelito kręte ułożone wzdłuż poprzecznicy zgodnie z kierunkiem perystaltyki; kikuty po przeciwnych stronach zespolenia.',
        'Naczynia podwiązane u odejścia z tętnicy krezkowej górnej (SMA): krętniczo-okrężnicza (IC), prawa okrężnicy (RC) i pień środkowej okrężnicy (MC) z obiema gałęziami; lewa część poprzecznicy ukrwiona przez łuk brzeżny z tętnicy lewej okrężnicy.'],
      focus: { t: [2.2, 1.8, 2.4], k: 0.78 },
      text: COL_TEXT,
      frames: {
        resect: ['Zakres resekcji', 'Końcowy odcinek jelita krętego, kątnica z wyrostkiem, okrężnica wstępująca, zagięcie wątrobowe i ok. 2/3 poprzecznicy z krezką. Naczynia podwiązane u odejścia z SMA: IC, RC i pień MC.', 'Zakres resekcji'],
        remove: ['Usunięcie preparatu', 'Preparat usunięty; pozostaje koniec jelita krętego i lewa część poprzecznicy.', 'Usunięcie'],
        recon: ['Zespolenie izoperystaltyczne', 'Jelito kręte sprowadzone do lewej części poprzecznicy i ułożone wzdłuż niej zgodnie z perystaltyką; stapler liniowy tworzy wspólne światło, otwór po staplerze zamknięty.', 'Zespolenie'],
        post: 'Zespolenie w lewej części poprzecznicy, blisko zagięcia śledzionowego; kikuty jelita krętego i poprzecznicy po przeciwnych stronach.',
        endoPost: 'Fragment kolonoskopii: z krótkiej lewej części poprzecznicy bokiem do jelita krętego, bez zawracania aparatu.'
      },
      endoTitles: ['Kolonoskopia: anatomia prawidłowa', 'Kolonoskopia po operacji'],
      objects: [
        tiObj({ pre: TI_KEEP, post: { path: ile, r: STUMP_END }, morph: [2, 2.9], labels: [L('Jelito kręte', 0.3, ALL)] }),
        { id: 'tiCut', name: 'Jelito kręte (usuwane)', pre: TI_CUT, colors: [[0, COLC.ti], [0.7, COL.spec]], opacity: SPEC_OP, offset: RH_OFF, mucosa: 'circular', tint: MUC.bowel },
        colObj('specR', 0, tX, { name: 'Prawa połowa okrężnicy i 2/3 poprzecznicy', colors: [[0, COLC.colon], [0.7, COL.spec]], opacity: SPEC_OP, offset: RH_OFF, win: [-9, 1.4] }),
        appObj({ colors: [[0, COLC.app], [0.7, COL.spec]], opacity: SPEC_OP, offset: RH_OFF }),
        colObj('colon', tX, 1, { name: 'Okrężnica', post: colPost, morph: [2, 2.9] })
      ],
      marks: [
        ringOn(C_COL, COL_R, tX, { name: 'Przecięcie poprzecznicy', color: COL.cut, opacity: CUT_OP_JEJ }),
        ringOn(C_TI, flat(0.9), tI, { name: 'Przecięcie jelita krętego', color: COL.cut, opacity: CUT_OP_JEJ }),
        { kind: 'line', name: 'Linia zszywek (stapler liniowy)', color: STAPLE, opacity: ANAST_OP, pts: seam },
        { kind: 'line', name: 'Zamknięcie otworu po staplerze', color: SUT, opacity: ANAST_OP, pts: sut }
      ],
      sideGia: { at: g0.toArray(), j: gT.clone().negate().toArray(), s: gS.toArray() },
      sideSut: { pts: sut, n: up.toArray() },
      endTarget: { pre: ICV },
      endText: { pre: 'Zastawka krętniczo-kątnicza w polu widzenia' },
      routePost: [{ obj: 'colon', from: [7.2, 7.4, -0.4], to: along(0.012, 0).toArray(), note: 'Lewa część poprzecznicy w stronę zespolenia' },
        { obj: 'ti', from: along(0.02, 1.72).toArray(), to: [2.4, 0.4, 3.3], note: 'Bokiem do jelita krętego — bez zawracania' }]
    };
  }
  var RHX = rhxAnat();

  /* ---------- Grupy węzłów chłonnych (przełącznik „Grupy węzłów chłonnych” w panelu): kod stacji, nazwa, podpis przy węźle najbliższym środkowi grupy ----------
     Jelito grube — numeracja JSCCR (Japanese Classification of Colorectal, Appendiceal, and Anal Carcinoma, 3. wyd. ang., J Anus Rectum Colon 2019):
     2x1 przyokrężnicze, 2x2 pośrednie, 2x3 główne; x: 0 IC, 1 RC, 2 MC (222-rt / 222-lt — gałęzie), 3 LC, 4 esicze, 5 IMA i SRA
     (251 przyodbytnicze wzdłuż SRA, 252 pień IMA od odejścia LC do ostatniej tętnicy esiczej, 253 IMA od odejścia do odejścia LC).
     names: kod → nazwa albo [wyświetlany kod, nazwa]; grupa dzielona na część usuwaną z preparatem i pozostającą. */
  var NG_JSCCR = {
    '201': 'przyokrężnicze — obszar IC', '202': 'wzdłuż IC (pośrednie)', '203': 'u odejścia IC (główne)',
    '211': 'przyokrężnicze — obszar RC', '212': 'wzdłuż RC (pośrednie)', '213': 'u odejścia RC (główne)',
    '221': 'przyokrężnicze — obszar MC', '222-rt': 'wzdłuż gałęzi prawej MC (pośrednie)', '222-lt': 'wzdłuż gałęzi lewej MC (pośrednie)', '223': 'u odejścia MC (główne)',
    '231': 'przyokrężnicze — obszar LC', '232': 'wzdłuż LC (pośrednie)', '241': 'przyokrężnicze — obszar esicy', '242': 'wzdłuż tętnic esiczych (pośrednie)',
    '251': 'przyodbytnicze, wzdłuż SRA', '252': 'wzdłuż pnia IMA (pośrednie)', '253': 'u odejścia IMA (główne)' };
  // kolejność stacji w liście w panelu (jak w klasyfikacjach); grupy opisowe — w kolejności z modelu
  var NG_ORDER = { jsccr: ['201', '202', '203', '211', '212', '213', '221', '222-rt', '222-lt', '223', '231', '232', '241', '242', '251', '252', '253'] };
  var NG_SYS = { jsccr: 'Numeracja JSCCR (Japanese Classification of Colorectal, Appendiceal, and Anal Carcinoma, 2019)', opis: 'Grupy opisowe (bez numeracji stacji)' };
  function nodeGroups(nodes, names, sys) {
    var G = {}, order = [];
    nodes.forEach(function (n) {
      if (!n.g) return; var k = n.g + (n.removed ? '|R' : '|K');
      if (!G[k]) { G[k] = { g: n.g, removed: !!n.removed, ns: [] }; order.push(k); } G[k].ns.push(n);
    });
    var ord = NG_ORDER[sys];
    if (ord) order.sort(function (a, b) { return ord.indexOf(G[a].g) - ord.indexOf(G[b].g); });
    return { system: NG_SYS[sys], list: order.map(function (k) {
      var g = G[k], c = [0, 0, 0], nm = names[g.g], best = null, bd = 1e9;
      g.ns.forEach(function (n) { c[0] += n.p[0] / g.ns.length; c[1] += n.p[1] / g.ns.length; c[2] += n.p[2] / g.ns.length; });
      g.ns.forEach(function (n) { var d = Math.pow(n.p[0] - c[0], 2) + Math.pow(n.p[1] - c[1], 2) + Math.pow(n.p[2] - c[2], 2); if (d < bd) { bd = d; best = n; } });
      return { code: Array.isArray(nm) ? nm[0] : g.g, name: Array.isArray(nm) ? nm[1] : nm || '', p: best.p.slice(), removed: g.removed };
    }) };
  }
  var JS_R = { ic: ['203', '202', '201'], rc: ['213', '212', '211'], mc: ['223'], rbmc: ['222-rt', '221'], lbmc: ['222-lt', '221'] };
  var JS_L = { imaTop: ['253'], ima: ['253', '252'], lc: ['232', '232', '231'], lca: ['232', '231'], sb: ['242', '242', '241'], sb2: ['242', '241'], sra: ['251', '251', '251'], sraTop: ['251', '251'] };

  /* ---------- Krezka prawej połowy okrężnicy i poprzecznicy: naczynia i węzły chłonne ----------
     SMA/SMV; od SMA: IC (krętniczo-okrężnicza), RC (prawa okrężnicy), MC (środkowa okrężnicy) z gałęzią prawą (RBMC) i lewą (LBMC); łuk brzeżny.
     mode: 'keep' — nic nie usuwane (np. leczenie endoskopowe); 'rh' — hemikolektomia prawa: podwiązanie IC, RC i RBMC (pień MC i LBMC zostają);
     'ext' — poszerzona: IC, RC i pień MC u odejścia z SMA. Czasy w skali po przygotowaniu (podwiązanie 1,25; preparat odjeżdża 2,15–2,9).
     fade: SMA i SMV znikają po etapie resekcji (razem z preparatem), bez przesuwania. */
  var MESO_T0 = 0.015, MESO_T1 = ct([7.2, 7.4, -0.4]) - 0.012;
  var C_ROOT = curveOf([[-1.6, -6.6, -1.4], [-1.2, -3.0, -1.7], [-0.9, 0.0, -1.6], [-0.5, 1.6, -1.0], [1.6, 2.0, -0.6], [3.8, 3.2, -0.8], [5.4, 4.8, -1.2]]);
  function mesoEdge(tc, k) {
    var s = Math.max(0, Math.min(1, (tc - MESO_T0) / (MESO_T1 - MESO_T0))), P = C_COL.getPointAt(tc), R = C_ROOT.getPointAt(s), T = C_COL.getTangentAt(tc);
    var d = R.clone().sub(P); d.sub(T.multiplyScalar(d.dot(T))).normalize();
    var E = P.addScaledVector(d, COL_R(tc) * 0.92);
    return k ? E.lerp(R, k) : E;
  }
  function mesoRight(mode, tCutO) {
    var V3 = THREE.Vector3, rm = mode !== 'keep', ext = mode === 'ext';
    var tCut = tCutO || (ext ? RHX_T : ct([-2.0, 4.2, 2.6]));
    var N = 40, sheetK = [], sheetR = [];
    for (var i = 0; i <= N; i++) {
      var tc = MESO_T0 + (MESO_T1 - MESO_T0) * i / N, row = [mesoEdge(tc).toArray(), mesoEdge(tc, 1).toArray()];
      if (rm && tc <= tCut + 0.004) sheetR.push(row);
      if (!rm || tc >= tCut - 0.004) sheetK.push(row);
    }
    function via(a, b, lift) { var m = new V3().fromArray(a).lerp(new V3().fromArray(b), 0.5); m.z += lift || 0; return m.toArray(); }
    // MC: krótki pień od SMA pod trzustką, rozwidlenie przed SMV (Andersen i wsp., Surg Endosc 2022: mediana 3,2 cm);
    // długie gałęzie prawa (RBMC) i lewa (LBMC) w krezce poprzecznicy
    var MC_O = [-0.45, 2.4, -2.2], RC_O = [-0.7, -1.0, -2.0], IC_O = [-1.05, -3.8, -1.8], BIF = [-1.2, 2.3, -0.6];
    var eIC = mesoEdge(0.035).toArray(), eRC = mesoEdge(ct([-7.4, -0.5, 0])).toArray(), eRB = mesoEdge(ct([-4.4, 5.8, 1.6])).toArray(), eLB = mesoEdge(ct([2.2, 4.0, 2.6])).toArray();
    var V = [
      { id: 'sma', name: 'SMA — tętnica krezkowa górna', kind: 'a', pts: [[-0.4, 3.2, -2.3], [-0.5, 1.0, -2.1], [-0.8, -2.0, -1.9], [-1.2, -5.0, -1.7], [-1.7, -8.0, -1.3]], at: 0.12, fade: rm },
      { id: 'smv', name: '', kind: 'v', pts: [[-1.3, 3.0, -2.0], [-1.4, 1.0, -1.9], [-1.7, -2.0, -1.7], [-2.1, -5.0, -1.5], [-2.6, -8.0, -1.1]], fade: rm },
      { id: 'ic', name: 'IC — tętnica krętniczo-okrężnicza', kind: 'a', pts: [IC_O, via(IC_O, eIC, 0.3), eIC], removed: rm, tie: rm ? 0.06 : null, at: 0.55, nodes: true },
      { id: 'rc', name: 'RC — tętnica prawa okrężnicy', kind: 'a', pts: [RC_O, via(RC_O, eRC, 0.3), eRC], removed: rm, tie: rm ? 0.06 : null, at: 0.55, nodes: true },
      { id: 'mc', name: 'MC — pień tętnicy środkowej okrężnicy', kind: 'a', pts: [MC_O, via(MC_O, BIF, 0.1), BIF], removed: ext, tie: ext ? 0.25 : null, at: 0.5, nodes: 'central' },
      // hemikolektomia prawa: RBMC podwiązana wysoko, tuż przy pniu MC
      { id: 'rbmc', name: 'RBMC — gałąź prawa MC', kind: 'a', pts: [BIF, [-2.6, 3.4, 0.2], via([-2.6, 3.4, 0.2], eRB, 0.3), eRB], removed: rm, tie: mode === 'rh' ? 0.035 : null, at: 0.55, nodes: 'outer' },
      { id: 'lbmc', name: 'LBMC — gałąź lewa MC', kind: 'a', pts: [BIF, [0.4, 2.9, 0.2], via([0.4, 2.9, 0.2], eLB, 0.3), eLB], removed: ext, at: 0.6, nodes: 'outer' }
    ];
    var arcR = [], arcK = [];
    for (var j = 0; j <= 30; j++) { var ta = 0.03 + (MESO_T1 - 0.03) * j / 30, q = mesoEdge(ta, 0.08).toArray(); if (rm && ta <= tCut + 0.01) arcR.push(q); if (!rm || ta >= tCut - 0.01) arcK.push(q); }
    if (arcR.length > 1) V.push({ id: 'arcR', name: '', kind: 'm', pts: arcR, removed: true });
    if (arcK.length > 1) V.push({ id: 'arcK', name: '', kind: 'm', pts: arcK });
    var nodes = [];
    V.forEach(function (v) {
      if (!v.nodes) return;
      var c = curveOf(v.pts), fs = v.nodes === 'central' ? [0.35] : v.nodes === 'outer' ? [0.5, 0.86] : [0.15, 0.5, 0.86];
      fs.forEach(function (f, i) { nodes.push({ p: c.getPointAt(f).add(new V3(0, 0.22, 0.18)).toArray(), removed: !!v.removed, g: (JS_R[v.id] || [])[i] }); });
    });
    return { type: 'meso', sheets: [{ rows: sheetK }, { rows: sheetR, removed: true }].filter(function (s) { return s.rows.length > 1; }), vessels: V, nodes: nodes, groups: nodeGroups(nodes, NG_JSCCR, 'jsccr'),
      name: 'Krezka z węzłami chłonnymi', sub: rm ? 'usuwana z preparatem' : 'pozostaje',
      offset: [[2.15, [0, 0, 0]], [2.9, [-7, -1, 5]]], opacity: [[2.55, 1], [2.9, 0]], tieT: 1.25 };
  }

  /* ---------- Wybór zakresu resekcji: całe jelito grube z krezką i naczyniami; reguła „położenie guza → operacja”
     Źródła: ASCRS Clinical Practice Guidelines for the Management of Colon Cancer (Dis Colon Rectum 2022) — zakres resekcji zgodny
     z drenażem chłonnym, krezka do odejścia naczynia zaopatrującego; kątnica/wstępnica: IC i RBMC u odejścia (1B); zagięcie wątrobowe
     i poprzecznica: decyzja indywidualna (najczęściej poszerzona hemikolektomia prawa z MC, w środkowej części także resekcja poprzecznicy); zagięcie śledzionowe: resekcja segmentarna (LC
     i LBMC) równoważna rozszerzonym; zstępnica: hemikolektomia lewa (LC, gałęzie esicze); esica: SRA i LC u odejścia. Odbytnica:
     górna tercja — przednia resekcja z częściowym wycięciem mezorektum (PME, ≥ 5 cm poniżej guza), środkowa i dolna — TME,
     guz naciekający zwieracze lub gdy nie da się ich zachować — amputacja brzuszno-kroczowa. IMA podwiązana u odejścia lub poniżej odejścia LC
     (bez różnicy w przeżyciu). Marginesy 5–7 cm od guza: przy guzie blisko granicy odcinka zakres poszerzany.
     Schemat: granice umowne, decyzja zawsze indywidualna. ---------- */
  function colonSheet(t0, t1, rootPts, n) {
    var root = curveOf(rootPts), rows = [];
    for (var i = 0; i <= n; i++) {
      var tc = t0 + (t1 - t0) * i / n, P = C_COL.getPointAt(tc), R = root.getPointAt(i / n), T = C_COL.getTangentAt(tc);
      var d = R.clone().sub(P); d.sub(T.multiplyScalar(d.dot(T))).normalize();
      rows.push([P.clone().addScaledVector(d, COL_R(tc) * 0.92).toArray(), R.toArray(), tc]);
    }
    return rows;
  }
  function leftEdge(tc, rootPts, t0, t1) { var root = curveOf(rootPts), s = (tc - t0) / (t1 - t0);
    var P = C_COL.getPointAt(tc), R = root.getPointAt(Math.max(0, Math.min(1, s))), T = C_COL.getTangentAt(tc), d = R.clone().sub(P); d.sub(T.multiplyScalar(d.dot(T))).normalize();
    return P.addScaledVector(d, COL_R(tc) * 0.92).toArray(); }
  var LROOT = [[1.2, 3.0, -2.0], [1.6, 0.0, -2.3], [1.7, -3.5, -2.4], [1.5, -6.0, -2.2]], LT = [0.48, 0.735];
  var SROOT = [[1.5, -6.0, -2.2], [1.2, -8.0, -2.2], [0.9, -10.0, -2.0], [0.6, -11.8, -1.8]], ST = [0.735, 0.865];
  var RROOT = [[0.6, -11.8, -2.6], [0.3, -14.0, -3.1], [0.1, -16.4, -3.2], [0.0, -18.4, -2.5]], RT = [0.865, 0.985];
  function colonMap() {
    var R = mesoRight('keep'), sheets = [{ rows: colonSheet(MESO_T0, MESO_T1, [[-1.6, -6.6, -1.4], [-1.2, -3.0, -1.7], [-0.9, 0.0, -1.6], [-0.5, 1.6, -1.0], [1.6, 2.0, -0.6], [3.8, 3.2, -0.8], [5.4, 4.8, -1.2]], 40) },
      { rows: colonSheet(LT[0], LT[1], LROOT, 24) }, { rows: colonSheet(ST[0], ST[1], SROOT, 16) }, { rows: colonSheet(RT[0], RT[1], RROOT, 16), meso: true }];
    var le = function (tc) { return tc < ST[0] ? leftEdge(tc, LROOT, LT[0], LT[1]) : tc < RT[0] ? leftEdge(tc, SROOT, ST[0], ST[1]) : leftEdge(tc, RROOT, RT[0], RT[1]); };
    var IMA_O = [0.6, -3.4, -2.7], LC_O = [0.8, -4.3, -2.6], LCB = [3.6, -2.4, -1.9], SB1_O = [1.0, -6.2, -2.4], SB2_O = [0.95, -7.4, -2.4], SRA_O = [0.9, -8.2, -2.5];
    var V = R.vessels.filter(function (v) { return v.id !== 'arcK' && v.id !== 'arcR'; }).map(function (v) { var w = {}; for (var k in v) w[k] = v[k]; w.removed = false; w.tie = null; return w; });
    V = V.concat([
      { id: 'ima', name: 'IMA — tętnica krezkowa dolna', kind: 'a', pts: [IMA_O, LC_O, [1.0, -6.0, -2.4], SRA_O], at: 0.3 },
      { id: 'lc', name: 'LC — tętnica lewa okrężnicy', kind: 'a', pts: [LC_O, via3(LC_O, LCB, 0.2), LCB, le(0.575)], at: 0.55 },
      { id: 'lca', name: '', kind: 'a', pts: [LCB, [5.4, 1.8, -1.6], le(0.50)] },
      { id: 'sb', name: 'SB — gałęzie esicze', kind: 'a', pts: [SB1_O, via3(SB1_O, le(0.76), 0.3), le(0.76)], at: 0.6 },
      { id: 'sb2', name: '', kind: 'a', pts: [SB2_O, via3(SB2_O, le(0.82), 0.3), le(0.82)] },
      { id: 'sra', name: 'SRA — tętnica odbytnicza górna', kind: 'a', pts: [SRA_O, [0.6, -11.0, -2.5], [0.25, -14.0, -2.9], [0.1, -16.6, -3.0]], at: 0.5 }
    ]);
    var arc = []; for (var j = 0; j <= 50; j++) { var ta = 0.03 + (0.86 - 0.03) * j / 50; arc.push(ta < MESO_T1 ? mesoEdge(ta, 0.08).toArray() : new THREE.Vector3().fromArray(le(ta)).lerp(curveOf(ta < ST[0] ? LROOT : SROOT).getPointAt(Math.max(0, Math.min(1, ta < ST[0] ? (ta - LT[0]) / (LT[1] - LT[0]) : (ta - ST[0]) / (ST[1] - ST[0])))), 0.08).toArray()); }
    V.push({ id: 'arc', name: '', kind: 'm', pts: arc });
    var nodes = [];
    // grupy JSCCR: przy IMA węzeł u odejścia (253, przed odejściem LC) i wzdłuż pnia (252); pień MC — 223
    var JS_Z = { ic: ['203', '202', '201'], rc: ['213', '212', '211'], mc: ['223', '223', '223'], rbmc: ['222-rt', '222-rt', '221'], lbmc: ['222-lt', '222-lt', '221'],
      ima: ['253', '252', '252'], lc: ['232', '232', '231'], lca: ['232', '232', '231'], sb: ['242', '242', '241'], sb2: ['242', '242', '241'], sra: ['251', '251', '251'] };
    V.forEach(function (v) { if (v.kind !== 'a' || v.id === 'sma') return; var c = curveOf(v.pts); (v.id === 'ima' ? [0.08, 0.5, 0.85] : [0.25, 0.6, 0.9]).forEach(function (f, i) { nodes.push({ p: c.getPointAt(f).add(new THREE.Vector3(0, 0.2, 0.18)).toArray(), v: v.id, g: (JS_Z[v.id] || [])[i] }); }); });
    return { sheets: sheets, vessels: V, nodes: nodes, groups: nodeGroups(nodes, NG_JSCCR, 'jsccr') };
  }
  function via3(a, b, lift) { var m = new THREE.Vector3().fromArray(a).lerp(new THREE.Vector3().fromArray(b), 0.5); m.z += lift || 0; return m.toArray(); }
  // reguła: t — położenie guza na okrężnicy (0 kątnica … 1 odbyt); obj — odcinek z guzem ('colon', 'ti', 'app')
  var RS_T = { tr: ct([-2.0, 4.2, 2.6]), trx: ct([3.2, 4.4, 2.4]) };
  function resectionRule(t, obj) {
    if (obj === 'ti' || obj === 'app' || t < 0.20) return { id: 'rh', name: 'Hemikolektomia prawa', where: obj === 'app' ? 'Wyrostek robaczkowy / kątnica' : obj === 'ti' ? 'Końcowy odcinek jelita krętego' : t < 0.035 ? 'Kątnica' : 'Okrężnica wstępująca',
      desc: 'Usuwa się końcowy odcinek jelita krętego, kątnicę, okrężnicę wstępującą i prawą część poprzecznicy z krezką; IC i RC (jeśli obecna; często odchodzi od IC lub MC) podwiązane u odejścia, RBMC przy pniu MC.', range: [0, RS_T.tr], ti: true, ties: ['ic', 'rc', 'rbmc'], removed: ['ic', 'rc', 'rbmc'] };
    if (t < 0.40) return { id: 'rhx', name: 'Poszerzona hemikolektomia prawa', where: t < 0.26 ? 'Zagięcie wątrobowe' : t < 0.33 ? 'Prawa część poprzecznicy' : 'Środkowa część poprzecznicy',
      desc: 'Zakres hemikolektomii prawej poszerzony o większą część poprzecznicy; pień MC podwiązany u odejścia z SMA (w środkowej części poprzecznicy alternatywnie resekcja poprzecznicy).', range: [0, t < 0.33 ? RS_T.trx : 0.435], ti: true, ties: ['ic', 'rc', 'mc'], removed: ['ic', 'rc', 'mc', 'rbmc', 'lbmc'] };
    if (t < 0.52) return { id: 'sf', name: 'Resekcja segmentarna zagięcia śledzionowego', where: t < 0.45 ? 'Lewa część poprzecznicy' : 'Zagięcie śledzionowe',
      desc: 'Usuwa się lewą część poprzecznicy, zagięcie śledzionowe i górną część zstępnicy z krezką; LC i gałąź lewa MC (LBMC) podwiązane u odejścia. Alternatywnie poszerzona hemikolektomia lewa lub prawa.', range: [0.395, 0.60], ties: ['lc', 'lbmc'], removed: ['lc', 'lca', 'lbmc'] };
    if (t < 0.70) return { id: 'lh', name: 'Hemikolektomia lewa', where: 'Okrężnica zstępująca',
      desc: 'Usuwa się lewą część poprzecznicy, zagięcie śledzionowe, zstępnicę i początek esicy z krezką; LC i pierwsze gałęzie esicze podwiązane u odejścia z IMA.', range: [0.40, 0.785], ties: ['lc', 'sb'], removed: ['lc', 'lca', 'sb'] };
    if (t < 0.865) return { id: 'sig', name: 'Resekcja esicy', where: 'Esica',
      desc: 'Usuwa się esicę z krezką; naczynia podwiązane u odejścia: SRA i LC (odpowiada podwiązaniu IMA), gałęzie esicze z preparatem; zespolenie zstępniczo-odbytnicze.', range: [0.70, 0.905], ties: ['sra', 'lc'], removed: ['sb', 'sb2', 'lc', 'lca'] };
    var third = (t - 0.865) / (0.985 - 0.865);
    if (third < 1 / 3) return { id: 'pme', name: 'Przednia resekcja odbytnicy z częściowym wycięciem mezorektum (PME)', where: 'Górna część odbytnicy',
      desc: 'Usuwa się esicę i górną część odbytnicy z mezorektum do co najmniej 5 cm poniżej guza; IMA podwiązana u odejścia lub poniżej odejścia LC (z usunięciem węzłów u korzenia IMA).', range: [0.70, Math.min(0.985, t + 0.045)], ties: ['ima'], removed: ['ima', 'sb', 'sb2', 'sra'], meso: true };
    if (t < 0.975 && third >= 2 / 3) return { id: 'ular', name: 'Ultraniska przednia resekcja odbytnicy (ULAR) z TME', where: 'Dolna część odbytnicy',
      desc: 'Usuwa się esicę i całą odbytnicę z mezorektum; odbytnica przecięta tuż nad kanałem odbytu, co najmniej 1 cm poniżej guza; zespolenie staplerem okrężnym (EEA) ok. 2–3 cm od brzegu odbytu, zwykle z ileostomią protekcyjną; IMA podwiązana u odejścia lub poniżej odejścia LC (z usunięciem węzłów u korzenia IMA).', range: [0.70, 0.985], ties: ['ima'], removed: ['ima', 'sb', 'sb2', 'sra'], meso: true };
    if (t < 0.975) return { id: 'tme', name: 'Niska przednia resekcja odbytnicy z całkowitym wycięciem mezorektum (TME)', where: 'Środkowa część odbytnicy',
      desc: 'Usuwa się esicę i odbytnicę z całym mezorektum; IMA podwiązana u odejścia lub poniżej odejścia LC (z usunięciem węzłów u korzenia IMA); zespolenie nisko w miednicy, zwykle z ileostomią protekcyjną.', range: [0.70, 0.985], ties: ['ima'], removed: ['ima', 'sb', 'sb2', 'sra'], meso: true };
    return { id: 'apr', name: 'Amputacja brzuszno-kroczowa odbytnicy (APR)', where: 'Dolna część odbytnicy przy zwieraczach',
      desc: 'Gdy nie da się zachować zwieraczy: usuwa się odbytnicę z mezorektum i kanałem odbytu; IMA podwiązana u odejścia lub poniżej odejścia LC (z usunięciem węzłów u korzenia IMA); stała kolostomia.', range: [0.70, 1], ties: ['ima'], removed: ['ima', 'sb', 'sb2', 'sra'], meso: true };
  }
  // marginesy 5–7 cm od guza (ASCRS 2022; 0,045 t ≈ 5 cm): przy guzie blisko granicy odcinka okrężnicy zakres poszerzany
  var MARGIN = 0.055;
  function resectionFor(t, obj) {
    var r = resectionRule(t, obj);
    if (obj === 'colon' && /^(rh|rhx|sf|lh|sig)$/.test(r.id)) r.range = [Math.max(0, Math.min(r.range[0], t - MARGIN)), Math.min(1, Math.max(r.range[1], t + MARGIN))];
    return r;
  }

  var tA = ct([7.4, -6.0, -0.3]), tPJ = ct([7.9, -2.0, -0.6]);
  /* ---------- Kikut odbytnicy: kopuła zamknięcia i punkty na jej powierzchni ---------- */
  function stumpDome(t0, R, H) {
    var s = sub(C_COL, COL_R, t0, 1, 30), c = curveOf(s.path), len = c.getLength();
    var P0 = c.getPointAt(0), T0 = c.getTangentAt(0);
    var n = new THREE.Vector3(1, 0, 0); n.sub(T0.clone().multiplyScalar(n.dot(T0))).normalize();
    var b = new THREE.Vector3().crossVectors(T0, n).normalize(); if (b.z < 0) b.negate();
    var rPost = function (t) {
      var x = t * len; if (x < H) return Math.max(0.05, R * Math.sqrt(Math.max(0, 1 - (1 - x / H) * (1 - x / H))));
      return R + (s.r(t) - R) * sm01((x - H) / 2.5);
    };
    function dx(rho) { rho = Math.min(rho, R * 0.995); return H * (1 - Math.sqrt(Math.max(0, 1 - (rho / R) * (rho / R)))); }
    // punkt na kopule (od środka: inside=true, od zewnątrz: false)
    function pt(vn, vb, inside) {
      var rho = Math.sqrt(vn * vn + vb * vb), k = inside ? 0.975 : 1.03;
      return P0.clone().addScaledVector(T0, dx(rho) + (inside ? 0.05 : -0.06)).addScaledVector(n, vn * k).addScaledVector(b, vb * k).toArray();
    }
    // punkt na ścianie cylindrycznej poniżej kopuły, na wysokości x, kąt: składowa boczna vn
    function wall(x, vn, inside) {
      var Rw = rPost(x / len), k = inside ? 0.975 : 1.03, vb = Math.sqrt(Math.max(0, Rw * Rw - vn * vn));
      return P0.clone().addScaledVector(T0, x).addScaledVector(n, vn * k).addScaledVector(b, vb * k).toArray();
    }
    return { s: s, len: len, P0: P0, T0: T0, n: n, b: b, R: R, H: H, rPost: rPost, dx: dx, pt: pt, wall: wall };
  }
  // linia zszywek w poprzek kopuły (wzdłuż n, w odległości lb od środka), z pominięciem wnętrza pierścienia
  function domeLines(D, lb, ring, name, opacity) {
    var Rl = Math.sqrt(Math.max(0, D.R * D.R - lb * lb)) * 0.96, N = 40, segs = [], cur = null;
    for (var i = 0; i <= N; i++) {
      var vn = -Rl + 2 * Rl * i / N, inRing = ring && ((vn - ring.on) * (vn - ring.on) + (lb - ring.ob) * (lb - ring.ob) < ring.rc * ring.rc * 1.02);
      if (inRing) { if (cur && cur.length > 1) segs.push(cur); cur = null; continue; }
      if (!cur) cur = []; cur.push(vn);
    }
    if (cur && cur.length > 1) segs.push(cur);
    return segs.map(function (sg, i) {
      return { kind: 'line', stump: true, name: i === 0 ? name : '', color: STAPLE, opacity: opacity, endo: true, dash: 0.14,
        pts: sg.map(function (vn) { return D.pt(vn, lb, false); }), endoPts: sg.map(function (vn) { return D.pt(vn, lb, true); }) };
    });
  }
  function ringLoop(D, on, ob, rc, inside) {
    var out = [];
    for (var i = 0; i < 72; i++) { var a = i / 72 * Math.PI * 2; out.push(D.pt(on + rc * Math.cos(a), ob + rc * Math.sin(a), inside)); }
    return out;
  }
  function addV(p, d, k) { return [p[0] + d.x * k, p[1] + d.y * k, p[2] + d.z * k]; }

  /* ---------- Wspólny moduł zespoleń staplerem okrężnym (EEA) na kikucie zamkniętym staplerem liniowym ---------- */
  // o: { tD: t kikuta na C_COL, R, H: kopuła, kind: center|racket|side, rc: promień pierścienia,
  //      base: ścieżka zachowanej części proksymalnej, tail: punkty sprowadzenia, rBase(t), rEnd, sideX }
  // tL — TME: przecięcie nisko, tuż nad połączeniem odbytniczo-odbytowym (ok. 5 cm od odbytu, w skali 0,045 t ≈ 5 cm);
  // tLs — PME przy zespoleniu na przedniej ścianie: wyżej (ok. 9 cm), mezorektum przecięte na tej samej wysokości — kikut ok. 1,8 raza dłuższy
  // tU — ULAR: przecięcie tuż nad górnym brzegiem kanału odbytu (ok. 3 cm od odbytu); T_LOW — najniżej możliwe przecięcie w modelu (ok. 2 cm)
  var tL = ct([0, -17.3, -1.3]), tLs = ct([0.2, -15.1, -1.0]), tU = 0.975, T_LOW = 0.982;
  var LAR_R = 1.7, LAR_H = 0.9, RC = 0.9, SIDE_X = 2.2;
  function eeaJoin(o) {
    var D = stumpDome(o.tD, o.R, o.H), T0 = D.T0, n = D.n, b = D.b, rc = o.rc || RC, kind = o.kind;
    var cfg = { center: { on: 0, ob: 0, lb: 0 }, racket: { on: o.R - rc - 0.02, ob: 0, lb: 0 }, side: null }[kind];
    var E, dIn, ringPts = null, ringEndo = null, stapTop, lines;
    var LINE_OP = [[1.3, 0], [1.6, 1]], RING_OP = [[2.8, 0], [2.95, 1]];
    var rEnd = o.rEnd || rc;
    if (cfg) {
      var rho = Math.sqrt(cfg.on * cfg.on + cfg.ob * cfg.ob);
      E = D.P0.clone().addScaledVector(T0, D.dx(rho) + 0.35).addScaledVector(n, cfg.on).addScaledVector(b, cfg.ob);
      dIn = T0.clone();
      ringPts = ringLoop(D, cfg.on, cfg.ob, rc, false); ringEndo = ringLoop(D, cfg.on, cfg.ob, rc, true);
      lines = domeLines(D, 0, null, 'Linia zszywek kikuta (stapler liniowy)', LINE_OP).map(function (l) { l.fullStump = true; return l; })
        .concat(domeLines(D, cfg.lb, { on: cfg.on, ob: cfg.ob, rc: rc }, '', LINE_OP).map(function (l) { l.stump = false; l.ringSeg = true; l.name = ''; return l; }));
      stapTop = D.P0.clone().addScaledVector(T0, D.dx(rho) + 0.25).addScaledVector(n, cfg.on).addScaledVector(b, cfg.ob);
    } else {
      var xs = o.sideX || SIDE_X, Rw = D.rPost(xs / D.len);
      dIn = b.clone().multiplyScalar(-0.72).addScaledVector(T0, 0.69).normalize();
      E = D.P0.clone().addScaledVector(T0, xs).addScaledVector(b, Rw - 0.35);
      lines = domeLines(D, 0, null, 'Linia zszywek kikuta (stapler liniowy)', LINE_OP);
      stapTop = D.P0.clone().addScaledVector(T0, xs).addScaledVector(b, Rw - 0.2);
    }
    var Ea = E.toArray(), proxPath = o.base.concat(o.tail);
    proxPath.push(addV(Ea, dIn, -3.0), addV(Ea, dIn, -1.5), Ea);
    var nB = o.base.length, proxR = (function () {
      var cc = curveOf(proxPath), tj = nB ? nearestT(cc, o.base[nB - 1]) : 0, rb0 = o.rBaseEnd || rEnd;
      return function (t) {
        if (nB && t <= tj) return o.rBase(t / tj);
        var u = nB ? (t - tj) / (1 - tj) : t, r = rb0 + (rEnd - rb0) * sm01(u);
        return r;
      };
    })();
    if (!ringPts) { // pierścień = linia przecięcia rzeczywistej ściany jelita proksymalnego ze ścianą kikuta
      var cc = curveOf(proxPath), rcv = curveOf(D.s.path), RS = [], CS = [];
      for (var j = 0; j <= 400; j++) { var tj = j / 400; RS.push([rcv.getPointAt(tj), D.rPost(tj)]); }
      for (var j2 = 0; j2 <= 300; j2++) { var tc = 0.85 + 0.15 * j2 / 300; CS.push([cc.getPointAt(tc), cc.getTangentAt(tc), proxR(tc)]); }
      var fOut = function (p) {
        var bi = 0, bd = 1e9; for (var j = 0; j < RS.length; j++) { var dd = RS[j][0].distanceToSquared(p); if (dd < bd) { bd = dd; bi = j; } }
        var ax = RS[bi][0], dir = p.clone().sub(ax), rad = dir.length(); return { v: rad - RS[bi][1], ax: ax, dir: dir.normalize(), r: RS[bi][1] };
      };
      ringPts = []; ringEndo = [];
      for (var i = 0; i < 72; i++) {
        var a = i / 72 * Math.PI * 2, prev = null, hit = null;
        for (var k = 0; k < CS.length; k++) {
          var T = CS[k][1], u2 = new THREE.Vector3().crossVectors(T, n).normalize(), n2 = new THREE.Vector3().crossVectors(u2, T).normalize();
          var g = CS[k][0].clone().addScaledVector(n2, CS[k][2] * Math.cos(a)).addScaledVector(u2, CS[k][2] * Math.sin(a)), f = fOut(g);
          if (prev && prev.v > 0 && f.v <= 0) { hit = f; break; }
          prev = f;
        }
        if (!hit) hit = prev;
        ringPts.push(hit.ax.clone().addScaledVector(hit.dir, hit.r * 1.03).toArray()); ringEndo.push(hit.ax.clone().addScaledVector(hit.dir, hit.r * 0.975).toArray());
      }
    }
    var marks = lines.concat([{ kind: 'loop', name: kind === 'side' ? 'Zespolenie staplerem okrężnym na przedniej ścianie odbytnicy' : 'Zespolenie okrężne staplerem (EEA)', color: STAPLE, opacity: RING_OP, endo: true, dash: 0.14, pts: ringPts, endoPts: ringEndo }]);
    var off = kind === 'side' ? (o.sideX || SIDE_X) : 1.2;
    var eeaPath = [stapTop.toArray()].concat(sub(C_COL, COL_R, o.tD + off / D.len * (1 - o.tD), 1, 14).path).concat([[0, -20.8, 1.4], [0, -22.6, 2.6]]);
    var eea = { face: stapTop.toArray(), dir: (cfg ? T0.clone().negate() : dIn.clone().negate()).toArray(), anvil: Ea, path: eeaPath.slice(1) };
    var stumpTo = kind === 'side' ? addV(D.P0.toArray(), T0, o.sideX || SIDE_X) : addV(D.P0.toArray(), T0, 1.3);
    return { D: D, E: E, proxPath: proxPath, proxR: proxR, marks: marks, eea: eea, stumpTo: stumpTo };
  }
  function colSpec(id, t0, t1, name, off) { return colObj(id, t0, t1, { name: name, colors: [[0, COLC.colon], [0.7, COL.spec]], opacity: SPEC_OP, offset: off || [[1.15, [0, 0, 0]], [1.9, [-6, 2, 6]]], win: [-9, 1.4] }); }
  var COL_BASE_A = sub(C_COL, COL_R, 0, tPJ, 70).path.concat([[7.2, -6.0, 0.0], [5.2, -9.0, 0.6]]);
  var rColA = function (u) { return COL_R(u * tPJ); };
  function colonEEA(o) {
    // o: id, short, title, sub, notes, frames, cutP (t), tD, R, H, kind, base, tail, rBase, rEnd, rc, specs, extraObjs, route, cutNames
    var J = eeaJoin({ tD: o.tD, R: o.R, H: o.H, kind: o.kind, rc: o.rc, base: o.base, tail: o.tail, rBase: o.rBase, rEnd: o.rEnd, rBaseEnd: o.rBaseEnd });
    var prox = o.proxObj(J);
    var marks = [
      o.cutPMark || ringOn(C_COL, COL_R, o.cutP, { name: o.cutNames[0], color: COL.cut, opacity: CUT_OP_JEJ }),
      ringOn(C_COL, COL_R, o.tD, { name: o.cutNames[1], stumpCut: true, color: COL.cut, opacity: [[0.05, 0], [0.55, 1], [1.2, 1], [1.4, 0]] })
    ].concat(J.marks);
    var route;
    route = [{ obj: 'rect', from: 1, to: J.stumpTo, note: o.routeNotes[0] }, { obj: 'prox', from: 1, to: o.routeTo || 0.93, note: o.routeNotes[1] }];
    return {
      eea: J.eea, cat: 'colon', id: o.id, short: o.short, title: o.title, sub: o.sub, notes: o.notes,
      focus: o.focus, text: COL_TEXT, frames: o.frames,
      endoTitles: ['Kolonoskopia: anatomia prawidłowa', o.endoTitle || 'Endoskopia po operacji'],
      objects: (o.keepObjs || []).concat([prox]).concat(o.specs).concat([
        colObj('rect', o.tD, 1, { name: o.stumpName || 'Odbytnica', postName: o.stumpPost || 'Kikut odbytnicy', color: COLC.rect, post: { path: J.D.s.path, r: J.D.rPost }, morph: [1.2, 1.6],
          opacity: [[2.05, 1], [2.2, 0.35], [2.85, 0.35], [3, 1]] })]),
      marks: marks, endTarget: { pre: ICV }, endText: { pre: 'Zastawka krętniczo-kątnicza w polu widzenia' },
      routePost: route
    };
  }
  var AR_TXT = {
    center: ['Linia zszywek kikuta przez środek pierścienia', 'Kolec staplera przebija środek linii zszywek kikuta; środek linii wycina się z pierścieniem tkanki, a linia dochodzi do pierścienia z obu stron — zostają dwa „uszy”.',
      'Pierścień zszywek, do którego z obu stron dochodzi linia zamknięcia kikuta; dwa „uszy”.'],
    racket: ['Pierścień obejmuje jeden koniec linii zszywek', 'Kolec przebija kikut przy końcu linii zszywek; pierścień obejmuje ten koniec, linia wychodzi z pierścienia tylko z jednej strony — kształt rakiety tenisowej (trzpień w rogu linii zszywek).',
      'Pierścień z jedną „rączką” linii zszywek; jedno „ucho”.'],
    ular: ['Ultraniska przednia resekcja (ULAR)', 'Kolec staplera przebija środek linii zszywek bardzo krótkiego kikuta tuż nad kanałem odbytu; zespolenie okrężniczo-odbytnicze koniec-do-końca (EEA), ok. 2–3 cm od brzegu odbytu.',
      'Pierścień zszywek bardzo nisko, tuż nad kanałem odbytu; po obu stronach krótkie „uszy” linii zamknięcia kikuta.'],
    side: ['Koniec okrężnicy do przedniej ściany odbytnicy', 'Kolec przebija przednią ścianę kikuta poniżej linii zszywek; zespolenie koniec (okrężnicy) do boku (odbytnicy), tzw. odwrócone zespolenie Bakera — bez krzyżowania linii zszywek; powyżej ślepy szczyt kikuta.',
      'Zespolenie na przedniej ścianie odbytnicy, nad nim ślepo zakończony szczyt kikuta z linią zszywek.']
  };
  // tDo — przecięcie odbytnicy dopasowane do guza (adaptAR); bez niego domyślne dla wariantu
  function arVariant(kind, tDo) {
    var T = AR_TXT[kind], side = kind === 'side', ular = kind === 'ular', tD = tDo || (side ? tLs : ular ? tU : tL);
    return colonEEA({
      id: 'ar-' + kind, short: 'Resekcja odbytnicy', title: 'Resekcja odbytnicy — ' + T[0].charAt(0).toLowerCase() + T[0].slice(1),
      sub: ular ? 'Ultraniska przednia resekcja odbytnicy (ULAR) z całkowitym wycięciem mezorektum (TME); zespolenie EEA tuż nad kanałem odbytu, technika podwójnego staplowania'
        : side ? 'Wysoka przednia resekcja odbytnicy z częściowym wycięciem mezorektum (PME); zespolenie koniec-do-boku staplerem okrężnym, technika podwójnego staplowania' : 'Niska przednia resekcja odbytnicy z całkowitym wycięciem mezorektum (TME); EEA (end-to-end anastomosis) — stapler okrężny, technika podwójnego staplowania',
      notes: (ular ? ['Resekcja ultraniska (guz w dolnej części odbytnicy, ok. 3–6 cm od brzegu odbytu, bez naciekania zwieraczy): usunięta esica i cała odbytnica z mezorektum (TME); odbytnica przecięta tuż nad górnym brzegiem kanału odbytu, co najmniej 1 cm poniżej guza; zstępnica po mobilizacji zagięcia śledzionowego sprowadzona głęboko do miednicy.',
        'Zespolenie bardzo nisko — zwykle z ileostomią protekcyjną (w modelu niepokazana); możliwe zaburzenia czynności po resekcji niskiej (LARS).']
        : side ? ['Resekcja wysoka (guz w górnej części odbytnicy): usunięta esica i górna część odbytnicy; odbytnica i mezorektum przecięte na tej samej wysokości, co najmniej 5 cm poniżej guza (częściowe wycięcie mezorektum — PME); zstępnica po mobilizacji zagięcia śledzionowego sprowadzona do miednicy.', 'Zespolenie na przedniej ścianie (koniec okrężnicy do boku odbytnicy) wykonuje się zwykle przy znacznie dłuższym kikucie odbytnicy, czyli po resekcji wysokiej.'] : ['Usunięta esica z górną i środkową częścią odbytnicy oraz mezorektum (w resekcji niskiej całkowite wycięcie mezorektum — TME; w wysokiej częściowe — PME, z przecięciem mezorektum co najmniej 5 cm poniżej guza); zstępnica po mobilizacji zagięcia śledzionowego sprowadzona do miednicy.',
        'Resekcja wysoka i niska różnią się poziomem przecięcia odbytnicy (odległością zespolenia od odbytu); geometria zespolenia jest taka sama.']).concat([
        'Kikut odbytnicy zamknięty poprzecznie staplerem liniowym; stapler okrężny przez odbyt, kowadełko w końcu okrężnicy.', T[1],
        'Tętnica krezkowa dolna (IMA) podwiązana u odejścia (alternatywnie poniżej odejścia LC), z usunięciem węzłów chłonnych u jej korzenia; przy podwiązaniu u odejścia tętnica lewa okrężnicy (LC) przecięta u odejścia, a zstępnica ukrwiona przez łuk brzeżny z tętnicy środkowej okrężnicy. Krezka sprowadzanej zstępnicy z łukiem brzeżnym przemieszcza się razem z jelitem (w modelu po sprowadzeniu niepokazana).']),
      frames: {
        resect: ['Zakres resekcji', ular ? 'Esica i cała odbytnica z krezką i całym mezorektum (TME); przecięcie na granicy zstępnicy i esicy oraz tuż nad kanałem odbytu, co najmniej 1 cm poniżej guza. IMA podwiązana u odejścia.' : side ? 'Esica z górną częścią odbytnicy, krezką i częścią mezorektum (PME): odbytnica i mezorektum przecięte co najmniej 5 cm poniżej guza; przecięcie na granicy zstępnicy i esicy oraz w odbytnicy wyżej niż przy TME — dłuższy kikut odbytnicy. IMA podwiązana u odejścia.' : 'Esica z górną i środkową częścią odbytnicy, krezką i całym mezorektum (TME); przecięcie na granicy zstępnicy i esicy oraz nisko w odbytnicy, nad dnem miednicy. IMA podwiązana u odejścia.', 'Zakres resekcji'],
        remove: ['Usunięcie preparatu', 'Preparat usunięty; kikut odbytnicy zamknięty poprzecznie staplerem liniowym.', 'Usunięcie'],
        recon: ['Zespolenie staplerem okrężnym', 'Zstępnica z kowadełkiem sprowadzona do miednicy. ' + T[1], 'Zespolenie'],
        post: T[2],
        endoPost: ular ? 'Od odbytu przez bardzo krótki kikut — pierścień zszywek tuż nad kanałem odbytu — do okrężnicy.' : kind === 'side' ? 'Od odbytu do kikuta: zespolenie na przedniej ścianie, powyżej ślepy szczyt kikuta; wejście do okrężnicy.' : 'Od odbytu przez kikut — pierścień zszywek i linia zamknięcia kikuta — tuż za zespolenie.'
      },
      focus: { t: [1.0, -15.5, -0.5], k: 0.5 }, kind: ular ? 'center' : kind, tD: tD, R: COL_R(tD) * 1.12, H: ular ? 0.7 : LAR_H, cutP: tA, cutNames: ['Przecięcie okrężnicy', 'Przecięcie odbytnicy'],
      base: COL_BASE_A, tail: [[2.6, -11.4, 0.6]], rBase: rColA, rBaseEnd: 1.15, rEnd: RC,
      keepObjs: [tiObj({}), appObj({})],
      proxObj: function (J) { return colObj('prox', 0, tA, { name: 'Okrężnica', post: { path: J.proxPath, r: J.proxR }, morph: [2, 2.6] }); },
      specs: [colSpec('specS', tA, tD, 'Esica i odbytnica (preparat)')],
      routeNotes: [kind === 'side' ? 'Kikut odbytnicy — zespolenie na przedniej ścianie, powyżej ślepy szczyt kikuta' : 'Kikut odbytnicy — pierścień zszywek i linia zamknięcia kikuta', 'Za zespoleniem — początek okrężnicy zstępującej'],
      routeTo: [5.2, -9.0, 0.6]
    });
  }

  /* ---------- Resekcja esicy: zespolenie zstępniczo-odbytnicze staplerem okrężnym (EEA) ----------
     Przecięcie na granicy zstępnicy i esicy (tP) i na wysokości połączenia esiczo-odbytniczego (tD = tH); przy guzie blisko granicy
     linie przesuwają się tak, by margines wynosił co najmniej 5 cm (adaptacja w liście zabiegów). IMA u odejścia (mesoLeft 'sig'). */
  function sigAnat(tPo, tDo) {
    var tP = tPo || tA, tD = tDo || tH, base = sub(C_COL, COL_R, 0, tPJ, 70).path.concat([[7.3, -6.0, 0.2], [5.6, -8.4, 1.6]]);
    return colonEEA({
      id: 'sig', short: 'Resekcja esicy', title: 'Resekcja esicy z zespoleniem zstępniczo-odbytniczym (EEA)',
      sub: 'Esica z krezką; IMA podwiązana u odejścia; zstępnica zespolona z górną częścią odbytnicy staplerem okrężnym (podwójne staplowanie)',
      notes: ['Wskazanie: rak esicy; w zapaleniu uchyłków (zabieg planowy) bez wysokiego podwiązania naczyń, z przecięciem przy jelicie.',
        'Usunięta esica z krezką; przecięcie na granicy zstępnicy i esicy oraz na wysokości połączenia esiczo-odbytniczego, z marginesem co najmniej 5 cm od guza (przy guzie blisko granicy linia przecięcia przesuwa się); mezorektum zostaje.',
        'Tętnica krezkowa dolna (IMA) podwiązana u odejścia z usunięciem węzłów u jej korzenia (alternatywnie poniżej odejścia LC); zstępnica ukrwiona przez łuk brzeżny z tętnicy środkowej okrężnicy, często po mobilizacji zagięcia śledzionowego.',
        'Kikut odbytnicy zamknięty poprzecznie staplerem liniowym; stapler okrężny przez odbyt, kowadełko w końcu zstępnicy, kolec przebija środek linii zszywek kikuta.'],
      frames: {
        resect: ['Zakres resekcji', 'Esica z krezką; przecięcie na granicy zstępnicy i esicy oraz na wysokości połączenia esiczo-odbytniczego, co najmniej 5 cm od guza. IMA podwiązana u odejścia; mezorektum zostaje.', 'Zakres resekcji'],
        remove: ['Usunięcie preparatu', 'Preparat usunięty; kikut odbytnicy zamknięty poprzecznie staplerem liniowym.', 'Usunięcie'],
        recon: ['Zespolenie staplerem okrężnym', 'Zstępnica z kowadełkiem sprowadzona do kikuta odbytnicy; stapler okrężny przez odbyt, kolec przebija środek linii zszywek kikuta.', 'Zespolenie'],
        post: 'Zstępnica połączona z górną częścią odbytnicy; esica usunięta.',
        endoPost: 'Od odbytu przez odbytnicę do pierścienia zszywek, dalej zstępnica.'
      },
      focus: { t: [3.2, -9.5, 1.2], k: 0.62 }, kind: 'center', tD: tD, R: COL_R(tD) * 1.12, H: 0.6, rc: 0.85, cutP: tP,
      cutNames: ['Przecięcie okrężnicy', 'Przecięcie odbytnicy'],
      base: base, tail: [[3.4, -9.8, 2.4]], rBase: function (u) { return COL_R(u * tPJ); }, rBaseEnd: 1.1, rEnd: 0.85,
      keepObjs: [tiObj({}), appObj({})],
      proxObj: function (J) { return colObj('prox', 0, tP, { name: 'Okrężnica', post: { path: J.proxPath, r: J.proxR }, morph: [2, 2.6] }); },
      specs: [colSpec('specS', tP, tD, 'Esica (preparat)')],
      routeNotes: ['Odbytnica — pierścień zszywek z linią kikuta po obu stronach', 'Za zespoleniem — zstępnica'], routeTo: [7.6, -3.0, -0.4], endoTitle: 'Kolonoskopia po operacji'
    });
  }

  /* ---------- Resekcja segmentarna zagięcia śledzionowego: zespolenie poprzeczniczo-zstępnicze koniec-do-końca (szew ręczny) ----------
     SF_T — domyślne przecięcia: lewa część poprzecznicy i górna część zstępnicy; przy guzie blisko granicy przesuwane (margines ok. 6 cm).
     Końce zbliżone krzywymi Béziera do punktu J między nimi; szew ciągły na obwodzie (narzędzie V-Loc z pierścieniem, an.e2eRing). */
  var SF_T = [0.395, 0.60], SF_OFF = [4, 4, 6];
  function sfAnat(tPo, tDo) {
    var V3 = THREE.Vector3, tP = tPo || SF_T[0], tD = tDo || SF_T[1];
    var a = tP - 0.02, b = tD + 0.03, P1 = C_COL.getPointAt(a), T1 = C_COL.getTangentAt(a), P2 = C_COL.getPointAt(b), T2 = C_COL.getTangentAt(b);
    var J = P1.clone().lerp(P2, 0.5).add(new V3(0.2, 0.8, 1.4)), dJ = P2.clone().sub(P1).normalize();
    function bez(A0, tA0, B0, tB0, n) {
      var k = A0.distanceTo(B0) * 0.4, c1 = A0.clone().addScaledVector(tA0, k), c2 = B0.clone().addScaledVector(tB0, -k), out = [];
      for (var i = 1; i <= n; i++) { var u = i / n, w0 = (1 - u) * (1 - u) * (1 - u), w1 = 3 * u * (1 - u) * (1 - u), w2 = 3 * u * u * (1 - u), w3 = u * u * u;
        out.push(A0.clone().multiplyScalar(w0).addScaledVector(c1, w1).addScaledVector(c2, w2).addScaledVector(B0, w3).toArray()); }
      return out;
    }
    var rJ = (COL_R(tP) + COL_R(tD)) / 2;
    var proxPath = sub(C_COL, COL_R, 0, a, 70).path.concat(bez(P1, T1, J, dJ, 7)), cP = curveOf(proxPath), jP = nearestT(cP, P1.toArray());
    var proxR = function (t) { return t <= jP ? COL_R(t / jP * a) : COL_R(a) + (rJ - COL_R(a)) * sm01((t - jP) / (1 - jP)); };
    var bd = bez(J, dJ, P2, T2, 7), distPath = [J.toArray()].concat(bd.slice(0, -1)).concat(sub(C_COL, COL_R, b, 1, 50).path), cD = curveOf(distPath), jD = nearestT(cD, P2.toArray());
    var distR = function (t) { return t <= jD ? rJ + (COL_R(b) - rJ) * sm01(t / jD) : COL_R(b + (t - jD) / (1 - jD) * (1 - b)); };
    return {
      cat: 'colon', id: 'sf', short: 'Resekcja zagięcia śledzionowego', title: 'Resekcja segmentarna zagięcia śledzionowego',
      sub: 'Lewa część poprzecznicy, zagięcie śledzionowe i górna część zstępnicy z krezką; LC i gałąź lewa MC podwiązane u odejścia; zespolenie poprzeczniczo-zstępnicze koniec-do-końca',
      notes: ['Wskazanie: rak zagięcia śledzionowego. Resekcja segmentarna daje wyniki onkologiczne porównywalne z poszerzoną hemikolektomią lewą lub prawą.',
        'Usunięte: lewa część poprzecznicy, zagięcie śledzionowe i górna część zstępnicy z krezką, z marginesem 5–7 cm od guza (przy guzie blisko granicy linia przecięcia przesuwa się); tętnica lewa okrężnicy (LC) i gałąź lewa tętnicy środkowej okrężnicy (LBMC) podwiązane u odejścia; pień MC, IMA i gałęzie esicze zostają.',
        'Poprzecznica i zstępnica uruchomione i zbliżone bez napięcia; zespolenie koniec-do-końca szwem ręcznym (alternatywnie bok-do-boku staplerem liniowym).',
        'W kolonoskopii okrężna linia szwu w miejscu dawnego zagięcia śledzionowego; dalej poprzecznica.'],
      focus: { t: [5.4, 2.6, 1.2], k: 0.6 }, text: COL_TEXT,
      frames: {
        resect: ['Zakres resekcji', 'Lewa część poprzecznicy, zagięcie śledzionowe i górna część zstępnicy z krezką; LC i LBMC podwiązane u odejścia.', 'Zakres resekcji'],
        remove: ['Usunięcie preparatu', 'Preparat usunięty; końce poprzecznicy i zstępnicy zamknięte staplerem.', 'Usunięcie'],
        recon: ['Zespolenie koniec-do-końca', 'Poprzecznica i zstępnica zbliżone bez napięcia; szew ręczny na całym obwodzie.', 'Zespolenie'],
        post: 'Poprzecznica połączona ze zstępnicą; zagięcie śledzionowe usunięte.',
        endoPost: 'Od odbytu przez odbytnicę, esicę i zstępnicę do linii szwu, dalej poprzecznica.'
      },
      endoTitles: ['Kolonoskopia: anatomia prawidłowa', 'Kolonoskopia po operacji'],
      objects: [tiObj({}), appObj({}),
        colObj('prox', 0, tP, { name: 'Okrężnica', post: { path: proxPath, r: proxR }, morph: [2, 2.7] }),
        colSpec('specS', tP, tD, 'Zagięcie śledzionowe (preparat)', [[1.15, [0, 0, 0]], [1.9, SF_OFF]]),
        colObj('dist', tD, 1, { name: 'Zstępnica, esica i odbytnica', post: { path: distPath, r: distR }, morph: [2, 2.7] })],
      marks: [ringOn(C_COL, COL_R, tP, { name: 'Przecięcie poprzecznicy', color: COL.cut, opacity: CUT_OP_JEJ }),
        ringOn(C_COL, COL_R, tD, { name: 'Przecięcie zstępnicy', color: COL.cut, opacity: CUT_OP_JEJ }),
        ringOn(cD, distR, 0, { name: 'Szew ręczny koniec-do-końca', color: SUT, opacity: ANAST_OP, endo: true, dash: 0.3 })],
      e2eRing: { c: J.toArray(), axis: dJ.toArray(), r: rJ + 0.08 },
      endTarget: { pre: ICV, post: ICV }, endText: { pre: 'Zastawka krętniczo-kątnicza w polu widzenia', post: 'Zastawka krętniczo-kątnicza w polu widzenia' },
      routePost: [{ obj: 'dist', from: 1, to: 0, note: 'Odbytnica, esica i zstępnica do linii szwu' }, { obj: 'prox', from: 1, to: 0.04, note: 'Za linią szwu — poprzecznica, dalej do kątnicy' }]
    };
  }

  var tSig = ct([0.5, -12.8, 0.9]);
  /* ---------- Lewostronna hemikolektomia ---------- */
  var VES_L = 'Naczynia podwiązane u odejścia z tętnicy krezkowej dolnej (IMA): lewa okrężnicy (LC) i pierwsze gałęzie esicze (SB); pień IMA, dalsze gałęzie esicze i tętnica odbytnicza górna (SRA) zostają.';
  var tTL = ct([2.4, 4.0, 2.5]), tSg2 = ct([2.6, -8.2, 2.2]);
  var LH = (function () {
    var rS = COL_R(tSg2), base = sub(C_COL, COL_R, 0, tTL, 70).path, tt = tTL;
    return colonEEA({
      id: 'lh', short: 'Hemikolektomia lewa', title: 'Lewostronna hemikolektomia: zespolenie poprzeczniczo-esicze koniec-do-końca (EEA)',
      sub: 'Resekcja lewej części poprzecznicy, zagięcia śledzionowego, zstępnicy i początku esicy; EEA (end-to-end anastomosis) przez odbyt',
      notes: ['Usunięte: lewa część poprzecznicy, zagięcie śledzionowe, okrężnica zstępująca i początkowa część esicy.',
        'Poprzecznica sprowadzona wzdłuż lewej ściany brzucha do kikuta esicy; zespolenie staplerem okrężnym wprowadzonym przez odbyt (alternatywnie ręczne lub bok-do-boku staplerem liniowym).',
        'W kolonoskopii zespolenie w okolicy esicy; dalej poprzecznica bez zagięcia śledzionowego.', VES_L],
      frames: {
        resect: ['Zakres resekcji', 'Lewa część poprzecznicy, zagięcie śledzionowe, zstępnica i początek esicy z krezką. Naczynia podwiązane u odejścia z IMA: LC i pierwsze gałęzie esicze (SB); pień IMA i SRA zostają.', 'Zakres resekcji'],
        remove: ['Usunięcie preparatu', 'Preparat usunięty; kikut esicy zamknięty poprzecznie staplerem liniowym.', 'Usunięcie'],
        recon: ['Zespolenie poprzeczniczo-esicze', 'Poprzecznica z kowadełkiem sprowadzona do kikuta esicy; stapler okrężny przez odbyt, kolec przebija środek linii zszywek kikuta.', 'Zespolenie'],
        post: 'Poprzecznica połączona z esicą; zagięcie śledzionowe i zstępnica usunięte.',
        endoPost: 'Od odbytu przez odbytnicę i esicę do pierścienia zszywek, dalej poprzecznica.'
      },
      focus: { t: [3, -3, 2], k: 0.72 }, kind: 'center', tD: tSg2, R: rS, H: 0.6, rc: 0.78, cutP: tt,
      cutNames: ['Przecięcie poprzecznicy', 'Przecięcie esicy'],
      base: base, tail: [[4.4, 2.2, 3.0], [5.4, -1.6, 3.0], [5.6, -4.8, 2.8]], rBase: function (u) { return COL_R(u * tt); }, rBaseEnd: 1.3, rEnd: 0.78,
      keepObjs: [tiObj({}), appObj({})],
      proxObj: function (J) { return colObj('prox', 0, tt, { name: 'Okrężnica', post: { path: J.proxPath, r: J.proxR }, morph: [2, 2.7] }); },
      specs: [colSpec('specS', tt, tSg2, 'Lewa połowa okrężnicy (preparat)', [[1.15, [0, 0, 0]], [1.9, [7, 1, 5]]])],
      stumpName: 'Esica i odbytnica', stumpPost: 'Kikut esicy',
      routeNotes: ['Odbytnica i esica — pierścień zszywek z linią kikuta po obu stronach', 'Za zespoleniem — poprzecznica'], routeTo: 0.9, endoTitle: 'Kolonoskopia po operacji'
    });
  })();


  /* ---------- Lewostronna hemikolektomia: zespolenia bok-do-boku (izoperystaltyczne, antyperystaltyczne FEEA) ---------- */
  function lhSide(iso) {
    var P0 = C_COL.getPointAt(tSg2), d = C_COL.getTangentAt(tSg2), s = new THREE.Vector3().crossVectors(d, new THREE.Vector3(0, 0, 1)).normalize();
    if (s.y < 0) s.negate();
    var q = function (kd, ks, kz) { return P0.clone().addScaledVector(d, kd).addScaledVector(s, ks).add(new THREE.Vector3(0, 0, kz || 0)).toArray(); };
    var SEP = 1.45, base = sub(C_COL, COL_R, 0, tTL, 70).path, tail = [[4.4, 2.2, 3.0], [5.4, -1.6, 3.0], [5.6, -4.8, 2.8]];
    var limb = iso ? [q(-2.0, SEP + 0.3, 0.2), q(-0.4, SEP), q(1.4, SEP), q(3.2, SEP)]
      : [q(-1.0, SEP + 1.2, 2.2), q(1.6, SEP + 1.0, 3.2), q(4.4, SEP + 0.4, 2.4), q(4.6, SEP, 0.4), q(3.0, SEP), q(1.2, SEP), q(-0.5, SEP)];
    var PX = base.concat(tail).concat(limb), cP = curveOf(PX), tj = nearestT(cP, tail[0]);
    var rProx = function (t) { var r = t <= tj ? COL_R(t / tj * tTL) : 1.15; return t > 0.97 ? Math.max(0.06, r * (1 - sm01((t - 0.97) / 0.03))) : r; };
    var dist = sub(C_COL, COL_R, tSg2, 1, 40), DP = iso ? dist.path : [q(-0.5, 0)].concat(dist.path);
    var lenD = curveOf(DP).getLength(), rDist = function (t) { var a = 1.0 / lenD; return t < a ? 0.06 + (dist.r(0) - 0.06) * sm01(t / a) : dist.r(Math.min(1, t)); };
    var LZ = [q(0.2, SEP / 2, 1.05), q(1.4, SEP / 2, 1.15), q(2.6, SEP / 2, 1.05)];
    var marks = [
      ringOn(C_COL, COL_R, tTL, { name: 'Przecięcie poprzecznicy', color: COL.cut, opacity: CUT_OP_JEJ }),
      ringOn(C_COL, COL_R, tSg2, { name: 'Przecięcie esicy', color: COL.cut, opacity: CUT_OP_JEJ }),
      { kind: 'line', name: 'Linia zszywek (stapler liniowy)', color: STAPLE, opacity: ANAST_OP, pts: LZ }
    ];
    if (iso) marks.push({ kind: 'line', name: 'Zamknięcie otworu po staplerze', color: SUT, opacity: ANAST_OP, pts: [q(3.0, -0.9, 0.7), q(3.1, SEP / 2, 1.2), q(3.0, SEP + 0.9, 0.7)] });
    else marks.push({ kind: 'line', name: 'Zamknięcie poprzeczne końców (TA)', color: STAPLE, opacity: ANAST_OP, pts: [q(-0.75, -1.0, 0.4), q(-0.8, SEP / 2, 0.9), q(-0.75, SEP + 1.0, 0.4)] });
    var sm = s.toArray(), dm = d.toArray(), zm = new THREE.Vector3(0, 0, 1).sub(d.clone().multiplyScalar(d.z)).normalize().toArray();
    return {
      cat: 'colon', id: iso ? 'lh-iso' : 'lh-anti', short: 'Hemikolektomia lewa',
      title: 'Lewostronna hemikolektomia: zespolenie poprzeczniczo-esicze bok-do-boku ' + (iso ? 'izoperystaltyczne' : 'antyperystaltyczne (FEEA)'),
      sub: iso ? 'Bok-do-boku, stapler liniowy; ramiona zgodnie z kierunkiem perystaltyki' : 'FEEA (functional end-to-end anastomosis) — stapler liniowy i zamknięcie poprzeczne końców',
      notes: ['Usunięte: lewa część poprzecznicy, zagięcie śledzionowe, okrężnica zstępująca i początkowa część esicy.',
        iso ? 'Poprzecznica sprowadzona wzdłuż lewej ściany brzucha i ułożona wzdłuż esicy zgodnie z kierunkiem perystaltyki; kikuty po przeciwnych stronach zespolenia.'
          : 'Końce poprzecznicy i esicy ułożone obok siebie w tę samą stronę; wspólny otwór zamknięty poprzeczną linią zszywek.',
        iso ? 'W kolonoskopii z esicy bokiem do poprzecznicy, bez zawracania aparatu; za zespoleniem ślepy kikut esicy.'
          : 'W kolonoskopii wejście do poprzecznicy wymaga zawrócenia o 180° we wspólnym świetle.', VES_L],
      focus: { t: [2.4, -6.5, 2.4], k: 0.6 }, text: COL_TEXT,
      frames: {
        resect: ['Zakres resekcji', 'Lewa część poprzecznicy, zagięcie śledzionowe, zstępnica i początek esicy z krezką. Naczynia podwiązane u odejścia z IMA: LC i pierwsze gałęzie esicze (SB); pień IMA i SRA zostają.', 'Zakres resekcji'],
        remove: ['Usunięcie preparatu', 'Preparat usunięty; pozostają zamknięte staplerem końce poprzecznicy i esicy.', 'Usunięcie'],
        recon: iso ? ['Zespolenie izoperystaltyczne', 'Poprzecznica ułożona wzdłuż esicy zgodnie z perystaltyką; stapler liniowy tworzy wspólne światło, otwór po staplerze zamknięty szwem.', 'Zespolenie']
          : ['Zespolenie antyperystaltyczne (FEEA)', 'Końce ułożone obok siebie w tę samą stronę; stapler liniowy tworzy wspólne światło, końce zamknięte poprzecznie drugim staplerem.', 'Zespolenie'],
        post: iso ? 'Kikut poprzecznicy i kikut esicy po przeciwnych stronach zespolenia.' : 'Oba kikuty po tej samej stronie, zamknięte jedną poprzeczną linią zszywek.',
        endoPost: iso ? 'Od odbytu przez odbytnicę i esicę do zespolenia; bokiem do poprzecznicy bez zawracania.' : 'Od odbytu przez odbytnicę i esicę do wspólnego światła; zawrócenie o 180° do poprzecznicy.'
      },
      endoTitles: ['Kolonoskopia: anatomia prawidłowa', 'Kolonoskopia po operacji'],
      objects: [tiObj({}), appObj({}),
        colObj('prox', 0, tTL, { name: 'Okrężnica', post: { path: PX, r: rProx }, morph: [2, 2.9] }),
        colSpec('specS', tTL, tSg2, 'Lewa połowa okrężnicy (preparat)', [[1.15, [0, 0, 0]], [1.9, [7, 1, 5]]]),
        colObj('rect', tSg2, 1, { name: 'Esica i odbytnica', color: COLC.rect, post: { path: DP, r: rDist }, morph: [1.2, 1.6] })],
      marks: marks,
      sideGia: { at: q(1.3, SEP / 2), j: (iso ? d.clone().negate() : d).toArray(), s: sm, ta: iso ? null : { at: q(-0.75, SEP / 2), j: sm, s: dm } },
      sideSut: iso ? { pts: [q(3.0, -0.9, 0.7), q(3.1, SEP / 2, 1.2), q(3.0, SEP + 0.9, 0.7)], n: zm } : null,
      endTarget: { pre: ICV }, endText: { pre: 'Zastawka krętniczo-kątnicza w polu widzenia' },
      routePost: iso ? [{ obj: 'rect', from: 1, to: q(1.3, 0), note: 'Odbytnica i esica do zespolenia' }, { obj: 'prox', from: q(1.3, SEP), to: [5.4, -1.6, 3.0], note: 'Bokiem do poprzecznicy — bez zawracania' }]
        : [{ obj: 'rect', from: 1, to: q(1.3, 0), note: 'Odbytnica i esica do wspólnego światła' }, { obj: 'prox', from: q(1.3, SEP), to: [5.4, -1.6, 3.0], note: 'Zawrócenie o 180° do poprzecznicy' }]
    };
  }
  /* ---------- Kolektomia całkowita z zespoleniem krętniczo-odbytniczym (IRA) ---------- */
  var IRA = (function () {
    var tI2 = nearestT(C_TI, [-3.2, -7.5, 1.2]), tiBase = sub(C_TI, flat(0.9), 0, tI2, 20);
    return colonEEA({
      id: 'ira', short: 'Kolektomia całkowita (IRA)', title: 'Kolektomia całkowita z zespoleniem krętniczo-odbytniczym',
      sub: 'IRA (ileorectal anastomosis) — jelito kręte do górnej odbytnicy staplerem okrężnym',
      notes: ['Usunięta cała okrężnica od kątnicy do połączenia esiczo-odbytniczego; odbytnica zachowana.',
        'Wskazania m.in.: polipowatość z oszczędzeniem odbytnicy, zaparcie z inercją okrężnicy, zespół Lyncha, zapalenie okrężnicy z oszczędzoną odbytnicą.',
        'Zachowana odbytnica wymaga endoskopowego nadzoru (ryzyko nowotworzenia w polipowatości).'],
      frames: {
        resect: ['Zakres resekcji', 'Cała okrężnica z kątnicą i końcowym odcinkiem jelita krętego; przecięcie na wysokości połączenia esiczo-odbytniczego.', 'Zakres resekcji'],
        remove: ['Usunięcie okrężnicy', 'Okrężnica usunięta; kikut odbytnicy zamknięty poprzecznie staplerem liniowym.', 'Usunięcie'],
        recon: ['Zespolenie krętniczo-odbytnicze', 'Jelito kręte z kowadełkiem sprowadzone do miednicy; stapler okrężny przez odbyt, kolec przebija środek linii zszywek kikuta.', 'Zespolenie'],
        post: 'Jelito kręte połączone bezpośrednio z odbytnicą; brak okrężnicy.',
        endoPost: 'Od odbytu przez odbytnicę do pierścienia zszywek, dalej jelito kręte (fałdy okrężne, bez haustr).'
      },
      focus: { t: [0, -10, 1], k: 0.62 }, kind: 'center', tD: tSig, R: COL_R(tSig), H: 0.6, rc: 0.82,
      cutPMark: ringOn(C_TI, flat(0.9), tI2, { name: 'Przecięcie jelita krętego', color: COL.cut, opacity: CUT_OP_JEJ }),
      cutNames: ['', 'Przecięcie na wysokości połączenia esiczo-odbytniczego'],
      base: [[4.0, -5.2, 0.8], [2.6, -6.4, 1.4], [1.2, -8.0, 1.7]], tail: [[0.8, -10.0, 1.5]], rBase: flat(0.9), rBaseEnd: 0.9, rEnd: 0.82,
      keepObjs: [],
      proxObj: function (J) { return { id: 'prox', name: 'Jelito kręte', pre: tiBase, post: { path: J.proxPath, r: J.proxR }, morph: [2, 2.7], color: COLC.ti, mucosa: 'circular', tint: MUC.bowel,
        labels: [L('Jelito kręte', 0.3, ALL)] }; },
      specs: [colSpec('specC', 0, tSig, 'Okrężnica (preparat)', [[1.15, [0, 0, 0]], [1.9, [0, 3, 7]]]),
        { id: 'tiCut', name: 'Jelito kręte (usuwane)', pre: sub(C_TI, flat(0.9), tI2, 1, 8), colors: [[0, COLC.ti], [0.7, COL.spec]], opacity: SPEC_OP, offset: [[1.15, [0, 0, 0]], [1.9, [0, 3, 7]]], mucosa: 'circular', tint: MUC.bowel },
        appObj({ colors: [[0, COLC.app], [0.7, COL.spec]], opacity: SPEC_OP, offset: [[1.15, [0, 0, 0]], [1.9, [0, 3, 7]]] })],
      routeNotes: ['Odbytnica — pierścień zszywek z linią kikuta po obu stronach', 'Za zespoleniem — jelito kręte'], routeTo: 0.8
    });
  })();


  /* ---------- Proktokolektomia ze zbiornikiem J i zespoleniem krętniczo-odbytowym (IPAA) ---------- */
  // jelito cienkie w modelu jelita grubego (IPAA): od zgięcia dwunastniczo-czczego (lewa strona, z tyłu) pętlami do początku końcowego odcinka jelita krętego
  var SB_IPAA = [[1.8, 1.8, -0.6], [4.2, 1.5, 0.6], [5.4, 0.2, 1.6], [4.4, -1.0, 2.6], [1.8, -0.3, 3.0], [-0.8, 0.6, 2.6], [-3.2, 0.2, 2.0], [-4.6, -1.2, 1.8],
    [-3.6, -2.8, 2.6], [-1.0, -2.4, 3.2], [1.6, -3.0, 3.4], [3.8, -2.6, 2.8], [5.4, -3.4, 1.8], [5.0, -4.5, 1.1], [4.0, -5.2, 0.8]];
  var IPAA = (function () {
    var tAn = ct([0, -18.2, -1.0]), J = eeaJoin({ tD: tAn, R: 0.95, H: 0.5, kind: 'center', rc: 0.72, base: [[4.0, -5.2, 0.8]], tail: [], rBase: flat(1), rEnd: 1 });
    var D = J.D, up = D.T0.clone().negate(), s = D.n.clone(); if (s.x < 0) s.negate();
    var Q = D.P0.clone().addScaledVector(up, 0.35), Lc = C_COL.getLength();
    // punkty zbiornika wzdłuż dawnego łoża odbytnicy (krzywizna kości krzyżowej), przesunięte bocznie o ks; powyżej KU zbiornik biegnie
    // prosto ku górze i lekko do przodu (wychodzi z miednicy). Długość ramion ok. 11 jednostek ≈ 18 cm (skala 0,045 t ≈ 5 cm)
    var KU = 5.5, qK = (function () { var p = C_COL.getPointAt(Math.max(0, tAn - (KU + 0.35) / Lc)); p.z += 0.5; return p; })(), dUp = new THREE.Vector3(0.05, 0.95, 0.32).normalize();
    var qa = function (ks, ku) {
      if (ku <= 0.4) return Q.clone().addScaledVector(s, ks).addScaledVector(up, ku).toArray();
      if (ku > KU) return qK.clone().addScaledVector(dUp, ku - KU).addScaledVector(s, ks).toArray();
      var p = C_COL.getPointAt(Math.max(0, tAn - (ku + 0.35) / Lc)); p.z += 0.5; return p.addScaledVector(s, ks).toArray();
    };
    var PL = 11.0; // długość zbiornika J (ok. 18 cm — trzy odpalenia staplera liniowego)
    var AFFJ = [[4.0, -5.2, 0.8], [3.0, -6.6, 2.2], qa(0.9, PL + 0.6), qa(0.8, PL - 1.2), qa(0.8, 8.0), qa(0.8, 5.2), qa(0.8, 2.2), qa(0.5, 0.5), qa(0.1, 0.0)];
    var JL = [qa(-0.1, 0.05), qa(-0.55, 0.55), qa(-0.8, 2.2), qa(-0.8, 5.2), qa(-0.8, 8.0), qa(-0.8, PL)];
    var tJ = 0.5, POUCH_R = profile([[0, 0.9], [0.2, 1.0], [0.3, 1.15], [1, 1.15]]), JL_R = profile([[0, 1.15], [0.94, 1.15], [1, 0.08]]);
    // linia zszywek w przegrodzie zbiornika: trzy odpalenia staplera liniowego od dna ku górze
    var LZS = [[0.9, 4.1], [4.1, 7.3], [7.3, 10.5]].map(function (r) { return [qa(0, r[0]), qa(0, (r[0] + r[1]) / 2), qa(0, r[1])]; });
    return {
      eea: J.eea, cat: 'colon', id: 'ipaa', short: 'Zbiornik J (IPAA)', title: 'Proktokolektomia ze zbiornikiem J i zespoleniem krętniczo-odbytowym',
      sub: 'IPAA (ileal pouch–anal anastomosis) — zbiornik J z końcowego odcinka jelita krętego, zespolenie staplerem okrężnym z kanałem odbytu',
      notes: ['Usunięta cała okrężnica i odbytnica; zachowany kanał odbytu ze zwieraczami (przy staplowaniu krótki mankiet strefy przejściowej).',
        'Zbiornik J: dwa ramiona końcowego odcinka jelita krętego (po co najmniej 18 cm) zespolone bok-do-boku staplerem liniowym — zwykle trzy odpalenia; szczyt J to ślepy koniec jelita.',
        'Najczęściej z ochronną ileostomią pętlową. Wskazania: wrzodziejące zapalenie jelita grubego, rodzinna polipowatość gruczolakowata.',
        'W endoskopii zbiornika (pouchoskopii): zespolenie, wspólne światło zbiornika, wlot pętli doprowadzającej i ślepy szczyt J; ocena zapalenia zbiornika, mankietu i jelita krętego nad zbiornikiem.'],
      focus: { t: [0.8, -8.2, 1.4], k: 0.88 }, text: COL_TEXT,
      frames: {
        resect: ['Zakres resekcji', 'Cała okrężnica i odbytnica; jelito kręte przecięte przy zastawce, odbytnica tuż nad kanałem odbytu.', 'Zakres resekcji'],
        remove: ['Usunięcie jelita grubego', 'Okrężnica i odbytnica usunięte; odbytnica zamknięta poprzecznie staplerem liniowym na wysokości połączenia odbytniczo-odbytowego (mankiet ok. 1–2 cm nad linią zębatą).', 'Usunięcie'],
        recon: ['Zbiornik J i zespolenie', 'Końcowy odcinek jelita krętego złożony w J (ramiona co najmniej 18 cm); ramiona zespolone staplerem liniowym (trzy odpalenia) we wspólny zbiornik, dno zbiornika (zagięcie pętli) zespolone staplerem okrężnym z kanałem odbytu.', 'Zbiornik J'],
        post: 'Zbiornik J w miednicy nad kanałem odbytu: u góry, obok siebie, wlot pętli doprowadzającej i ślepy szczyt J (w pouchoskopii obraz „oczu sowy”).',
        endoPost: 'Od odbytu przez zespolenie do zbiornika; wybór: wlot pętli doprowadzającej albo ślepy szczyt J.'
      },
      endoTitles: ['Kolonoskopia: anatomia prawidłowa', 'Endoskopia zbiornika (pouchoskopia)'],
      objects: [
        { id: 'aff', name: 'Jelito kręte', postName: 'Pętla doprowadzająca i ramię zbiornika', pre: sub(C_TI, flat(0.9), 0, tJ * 0.985, 20), post: { path: AFFJ, r: POUCH_R }, morph: [2, 2.9],
          color: COLC.ti, mucosa: 'circular', tint: MUC.bowel, labels: [L('Jelito kręte', 0.3, ALL), L('Zbiornik J', 0.9, POST)] },
        { id: 'jl', name: 'Końcowy odcinek jelita krętego', postName: 'Ramię zbiornika ze ślepym szczytem J', pre: sub(C_TI, flat(0.9), tJ, 0.985, 10), post: { path: JL, r: JL_R }, morph: [2, 2.9],
          color: COLC.ti, mucosa: 'circular', tint: MUC.bowel, labels: [L('Szczyt J (ślepy)', 0.92, POST)] },
        colSpec('specC', 0, tAn, 'Okrężnica i odbytnica (preparat)', [[1.15, [0, 0, 0]], [1.9, [0, 3, 8]]]),
        appObj({ colors: [[0, COLC.app], [0.7, COL.spec]], opacity: SPEC_OP, offset: [[1.15, [0, 0, 0]], [1.9, [0, 3, 8]]] }),
        colObj('rect', tAn, 1, { name: 'Kanał odbytu', postName: 'Kanał odbytu', color: COLC.rect, post: { path: D.s.path, r: D.rPost }, morph: [1.2, 1.6],
          opacity: [[2.05, 1], [2.2, 0.35], [2.85, 0.35], [3, 1]] }),
        // jelito cienkie w całości (od zgięcia dwunastniczo-czczego pętlami w jamie brzusznej do pętli doprowadzającej) — po usunięciu jelita grubego,
        // na etapie budowy zbiornika i po operacji
        { id: 'sbF', name: 'Jelito cienkie', pre: { path: SB_IPAA, r: flat(0.9) }, color: COLC.ti, mucosa: 'circular', tint: MUC.bowel, opacity: [[2.0, 0], [2.4, 1]],
          labels: [L('Jelito cienkie', 0.45, [2.3, 99]), L('Zgięcie dwunastniczo-czcze', 0.02, [2.3, 99])] }
      ],
      marks: [
        ringOn(C_TI, flat(0.9), 0.985, { name: 'Przecięcie jelita krętego przy zastawce', color: COL.cut, opacity: CUT_OP_JEJ }),
        ringOn(C_COL, COL_R, tAn, { name: 'Przecięcie nad kanałem odbytu', stumpCut: true, color: COL.cut, opacity: [[0.05, 0], [0.55, 1], [1.2, 1], [1.4, 0]] }),
      ].concat(LZS.map(function (lz, i) { return { kind: 'line', name: i === 0 ? 'Linia zszywek (stapler liniowy)' : '', pouchLine: i, color: STAPLE, opacity: ANAST_OP, endo: true, dash: 0.14, pts: lz, endoPts: lz }; })).concat(J.marks),
      pouchGia: LZS.map(function (lz) { var a = new THREE.Vector3().fromArray(lz[0]), b = new THREE.Vector3().fromArray(lz[2]); return { at: lz[1], j: a.clone().sub(b).normalize().toArray(), s: s.toArray(), len: a.distanceTo(b) + 0.4 }; }),
      endTarget: { pre: ICV }, endText: { pre: 'Zastawka krętniczo-kątnicza w polu widzenia' },
      routePost: { prefix: [{ obj: 'rect', from: 1, to: J.stumpTo, note: 'Kanał odbytu — pierścień zszywek z linią zamknięcia po obu stronach' }], branches: [
        { label: 'Pętla doprowadzająca', sub: 'wlot jelita krętego do zbiornika', steps: [{ obj: 'aff', from: 1, to: qa(0.8, PL - 0.4), note: 'Zbiornik, dalej wlot pętli doprowadzającej' }] },
        { label: 'Szczyt J', sub: 'ślepy koniec zbiornika', steps: [{ obj: 'jl', from: 0.02, to: 0.93, note: 'Ślepy szczyt J — miejsce możliwej nieszczelności' }], target: JL[JL.length - 1], endText: 'Ślepy szczyt J z linią zszywek' }
      ] }
    };
  })();

  /* ---------- Kolostomia końcowa w lewym dole biodrowym (Hartmann, APR): zstępnica przeprowadzona przez powłoki ---------- */
  // miejsce stomii: lewy dół biodrowy, przez lewy mięsień prosty (model powłok BODY), na wysokości skóry
  var COLO_S = [3.0, -7.6], COLO_Z = BODY.z(COLO_S[0], COLO_S[1]);
  var COLO_PATH = sub(C_COL, COL_R, 0, tPJ, 70).path.concat([[7.8, -4.4, 0.4], [7.2, -6.3, 2.2], [5.5, -7.4, 3.9], [3.6, -7.6, COLO_Z - 0.75], [COLO_S[0], COLO_S[1], COLO_Z]]);
  var COLO_R = (function () { var cc = curveOf(COLO_PATH), tj = nearestT(cc, [7.9, -2.0, -0.6]); return function (t) { return t <= tj ? COL_R(t / tj * tPJ) : 1.15 + (1.05 - 1.15) * sm01((t - tj) / (1 - tj)); }; })();
  function coloMarks(stomaOp) {
    return [{ kind: 'body', name: 'Powłoki brzuszne', holes: [{ c: COLO_S, rx: 1.15, ry: 1.15 }], opacity: [[0.3, 0], [0.8, 1]] },
      { kind: 'stoma', name: 'Kolostomia końcowa', center: [COLO_S[0], COLO_S[1], COLO_Z + 0.2], rx: 1.15, ry: 1.15, opacity: stomaOp }];
  }

  /* ---------- Operacja Hartmanna ---------- */
  var tH = ct([0.5, -12.8, 0.9]);
  var HART = (function () {
    var rtop = COL_R(tH), D = stumpDome(tH, rtop, 0.6);
    var proxPath = COLO_PATH, proxR = COLO_R;
    return {
      cat: 'colon', id: 'hartmann', short: 'Hartmann',
      title: 'Operacja Hartmanna', sub: 'Resekcja esicy, kolostomia końcowa, zamknięty kikut odbytnicy',
      notes: [
        'Najczęściej w trybie pilnym (perforacja, niedrożność, zapalenie uchyłków z zapaleniem otrzewnej) — bez zespolenia.',
        'Zstępnica wyprowadzona jako kolostomia końcowa w lewym dole biodrowym; kikut odbytnicy zamknięty i pozostawiony w miednicy.',
        'Endoskopia przez kolostomię w stronę kątnicy albo przez odbyt do ślepego kikuta (ocena przed odtworzeniem ciągłości).',
        'W modelu tętnica krezkowa dolna (IMA) podwiązana poniżej odejścia tętnicy lewej okrężnicy (LC), z usunięciem węzłów u korzenia IMA; gałęzie esicze i górna część tętnicy odbytniczej górnej (SRA) usunięte z preparatem; mezorektum z dolną częścią SRA zostaje z kikutem.'
      ],
      focus: { t: [4, -9, 2], k: 0.62 }, text: COL_TEXT,
      frames: {
        resect: ['Zakres resekcji', 'Esica z krezką; przecięcie na granicy zstępnicy i esicy oraz na wysokości połączenia esiczo-odbytniczego. IMA podwiązana poniżej odejścia LC; mezorektum zostaje z kikutem odbytnicy.', 'Zakres resekcji'],
        remove: ['Usunięcie esicy', 'Esica usunięta; kikut odbytnicy zamknięty poprzecznie staplerem liniowym.', 'Usunięcie'],
        recon: ['Kolostomia końcowa', 'Koniec zstępnicy przeprowadzony przez powłoki w lewym dole biodrowym i wszyty w skórę.', 'Kolostomia'],
        post: 'Kolostomia końcowa w lewym dole biodrowym, ślepy kikut odbytnicy w miednicy.',
        endoPost: 'Wybierz drogę: przez kolostomię albo przez odbyt do kikuta odbytnicy.'
      },
      endoTitles: ['Kolonoskopia: anatomia prawidłowa', 'Endoskopia po operacji'],
      objects: [
        tiObj({}), appObj({}),
        colObj('prox', 0, tA, { name: 'Okrężnica', post: { path: proxPath, r: proxR }, morph: [2, 2.7], open: [false, true] }),
        colObj('specS', tA, tH, { name: 'Esica (preparat)', colors: [[0, COLC.colon], [0.7, COL.spec]], opacity: SPEC_OP, offset: [[1.15, [0, 0, 0]], [1.9, [-6, 2, 6]]], win: [-9, 1.4] }),
        colObj('rect', tH, 1, { name: 'Odbytnica', postName: 'Kikut odbytnicy', color: COLC.rect, post: { path: D.s.path, r: D.rPost }, morph: [1.2, 1.6] })
      ],
      marks: [
        ringOn(C_COL, COL_R, tA, { name: 'Przecięcie okrężnicy', color: COL.cut, opacity: CUT_OP_JEJ }),
        ringOn(C_COL, COL_R, tH, { name: 'Przecięcie na wysokości połączenia esiczo-odbytniczego', color: COL.cut, opacity: [[0.05, 0], [0.55, 1], [1.2, 1], [1.4, 0]] })
      ].concat(coloMarks([[2.5, 0], [2.9, 1]])).concat(domeLines(D, 0, null, 'Zamknięcie kikuta (stapler liniowy)', [[1.3, 0], [1.6, 1]])),
      endTarget: { pre: ICV },
      endText: { pre: 'Zastawka krętniczo-kątnicza w polu widzenia' },
      routePost: { prefix: [], branches: [
        { label: 'Przez kolostomię', sub: 'do okrężnicy zstępującej', steps: [{ pt: [COLO_S[0], COLO_S[1], COLO_Z + 3.4], note: 'Kolostomia końcowa w lewym dole biodrowym' }, { obj: 'prox', from: 1, to: [7.9, -1.5, -0.7], note: 'Za stomią — okrężnica zstępująca' }] },
        { label: 'Przez odbyt', sub: 'do kikuta odbytnicy', steps: [{ obj: 'rect', from: 1, to: addV(D.P0.toArray(), D.T0, 1.3), note: 'Kikut odbytnicy — ślepo zakończony, u szczytu linia zszywek' }],
          target: D.P0.toArray(), endText: 'Szczyt kikuta z linią zszywek' }
      ] }
    };
  })();

  /* ---------- Amputacja brzuszno-kroczowa odbytnicy (APR, operacja Milesa) ----------
     Etap brzuszny jak w resekcji odbytnicy: IMA podwiązana u odejścia, przecięcie na granicy zstępnicy i esicy, TME do dna miednicy.
     Etap kroczowy: eliptyczne cięcie skóry wokół odbytu, preparat (esica, odbytnica z mezorektum, kanał odbytu ze zwieraczami) usuwany przez krocze,
     rana krocza zamknięta warstwowo (narzędzie „krocze”, czasy w skali po przygotowaniu); stała kolostomia końcowa w lewym dole biodrowym. */
  var APR_OFF = [0, -7, 7];
  var APR = (function () {
    // płaszczyzna krocza prostopadła do kanału odbytu, schematycznie odchylona ku przodowi (lepiej widoczna z przodu)
    var A1 = C_COL.getPointAt(1), N = C_COL.getTangentAt(1).normalize().add(new THREE.Vector3(0, 0, 0.6)).normalize(), AP = new THREE.Vector3(0, 0, 1);
    AP.sub(N.clone().multiplyScalar(AP.dot(N))).normalize(); // oś przednio-tylna w płaszczyźnie krocza (do przodu)
    return {
      cat: 'colon', id: 'apr', short: 'Amputacja brzuszno-kroczowa (APR)',
      title: 'Amputacja brzuszno-kroczowa odbytnicy (APR)', sub: 'Operacja Milesa: odbytnica z mezorektum i kanałem odbytu usunięta z dostępu brzusznego i kroczowego; stała kolostomia końcowa',
      notes: [
        'Wskazanie: rak dolnej części odbytnicy naciekający zwieracze lub dźwigacze albo gdy nie da się zachować czynności zwieraczy (także rak płaskonabłonkowy odbytu po nieskutecznej chemioradioterapii).',
        'Etap brzuszny jak w resekcji odbytnicy: IMA podwiązana u odejścia (alternatywnie poniżej odejścia LC) z usunięciem węzłów u jej korzenia, okrężnica przecięta na granicy zstępnicy i esicy, odbytnica wypreparowana z całym mezorektum (TME) do dna miednicy.',
        'Etap kroczowy: eliptyczne cięcie skóry wokół odbytu; kanał odbytu ze zwieraczami i przyczepami dźwigaczy odbytu wycięty, preparat wydobyty przez krocze. Model przedstawia wariant klasyczny (bez poszerzonego wycięcia dźwigaczy — ELAPE).',
        'Rana krocza zamknięta warstwowo (mięśnie, tkanka podskórna, skóra szwami węzełkowymi); przy dużym ubytku lub po radioterapii zamknięcie płatem albo siatką biologiczną.',
        'Zstępnica wyprowadzona jako stała kolostomia końcowa w lewym dole biodrowym. Endoskopia tylko przez kolostomię — odbytu już nie ma.'
      ],
      focus: { t: [1.0, -15.0, 2], k: 0.7 }, text: COL_TEXT,
      frames: {
        resect: ['Zakres resekcji', 'Esica, odbytnica z całym mezorektum i kanał odbytu ze zwieraczami; przecięcie okrężnicy na granicy zstępnicy i esicy, IMA podwiązana u odejścia; na kroczu eliptyczne cięcie wokół odbytu.', 'Zakres'],
        remove: ['Usunięcie preparatu przez krocze', 'Preparat — esica, odbytnica z mezorektum i kanał odbytu — wydobyty przez ranę krocza.', 'Usunięcie'],
        recon: ['Zamknięcie krocza i kolostomia', 'Rana krocza zamknięta warstwowo, skóra szwami węzełkowymi od przodu do tyłu; koniec zstępnicy przeprowadzony przez powłoki w lewym dole biodrowym i wszyty w skórę jako stała kolostomia końcowa.', 'Krocze, kolostomia'],
        post: 'Stała kolostomia końcowa w lewym dole biodrowym; odbytnica i odbyt usunięte, krocze zamknięte.',
        endoPost: 'Kolonoskopia przez kolostomię — jedyna droga po amputacji odbytnicy.'
      },
      endoTitles: ['Kolonoskopia: anatomia prawidłowa', 'Endoskopia przez kolostomię'],
      objects: [
        tiObj({}), appObj({}),
        colObj('prox', 0, tA, { name: 'Okrężnica', post: { path: COLO_PATH, r: COLO_R }, morph: [2.45, 2.95], open: [false, true] }),
        colObj('specS', tA, 1, { name: 'Esica, odbytnica i kanał odbytu (preparat)', colors: [[0, COLC.colon], [0.7, COL.spec]], opacity: SPEC_OP, offset: [[1.15, [0, 0, 0]], [1.9, APR_OFF]], win: [-9, 1.4] })
      ],
      marks: [ringOn(C_COL, COL_R, tA, { name: 'Przecięcie okrężnicy', color: COL.cut, opacity: CUT_OP_JEJ })].concat(coloMarks([[2.85, 0], [2.95, 1]])),
      // krocze: skóra, cięcie eliptyczne wokół odbytu, rana i jej zamknięcie (TOOL_EXT.krocze); czasy po przygotowaniu (m: 2–3 usunięcie, 3–4 rekonstrukcja)
      krocze: { type: 'krocze', c: A1.clone().addScaledVector(N, 0.05).toArray(), n: N.toArray(), ap: AP.toArray(), a: 2.6, b: 1.8, skin: [5.6, 5.0], anus: COL_R(1) + 0.05,
        inc: [0.3, 0.95], open: [2.1, 2.35], close: [3.0, 3.5], stitches: 7, off: APR_OFF, offT: [2.15, 2.9] },
      endTarget: { pre: ICV, post: ICV },
      endText: { pre: 'Zastawka krętniczo-kątnicza w polu widzenia', post: 'Zastawka krętniczo-kątnicza w polu widzenia' },
      routePost: [{ pt: [COLO_S[0], COLO_S[1], COLO_Z + 3.4], note: 'Kolostomia końcowa w lewym dole biodrowym' }, { obj: 'prox', from: 1, to: [7.9, -1.5, -0.7], note: 'Za stomią — okrężnica zstępująca' },
        { obj: 'prox', from: [7.9, -1.5, -0.7], to: 0.04, note: 'Poprzecznica i wstępnica do kątnicy' }]
    };
  })();

  /* ---------- Krezka lewej połowy okrężnicy i mezorektum w resekcjach lewostronnych (jak mesoRight): część usuwana z preparatem i pozostająca.
     Arkusze od połowy poprzecznicy do dna miednicy (krezka poprzecznicy, zstępnicy, esicy, mezorektum — korzenie jak w „Wyborze zakresu resekcji”).
     mode: 'lh' — hemikolektomia lewa: LC i pierwsze gałęzie esicze podwiązane u odejścia z IMA (pień IMA, dalsze gałęzie esicze i SRA zostają);
     'ar' — resekcja odbytnicy: IMA podwiązana u odejścia (z węzłami u korzenia), esica i całe mezorektum (TME); LC przecięta u odejścia, zstępnica ukrwiona z łuku brzeżnego;
     'arp' — resekcja wysoka (zespolenie na przedniej ścianie, dłuższy kikut): jak 'ar', ale mezorektum przecięte na wysokości przecięcia odbytnicy (PME), dolna część z SRA zostaje;
     'hart' — Hartmann: IMA podwiązana poniżej odejścia LC, krezka esicy z gałęziami esiczymi; mezorektum z dolną częścią SRA zostaje z kikutem odbytnicy.
     'apr' — amputacja brzuszno-kroczowa: jak 'ar', całe mezorektum z odbytnicą i kanałem odbytu; preparat usuwany przez krocze (APR_OFF).
     'sig' — resekcja esicy: IMA u odejścia (z LC), krezka esicy; SRA i mezorektum przecięte na wysokości przecięcia jelita (zwykle mezorektum zostaje).
     'ira' / 'ipaa' — kolektomia całkowita (wersja onkologiczna): krezka całej okrężnicy, IC, RC, MC i IMA u odejścia; IRA — SRA i mezorektum przecięte na wysokości
     połączenia esiczo-odbytniczego (mezorektum zostaje), IPAA — całe mezorektum (TME).
     'sf' — resekcja zagięcia śledzionowego: LC i gałąź lewa MC (LBMC) u odejścia, pień MC, IMA, gałęzie esicze i SRA zostają.
     rr — [t przecięcia proksymalnego, t dystalnego] zamiast domyślnych (linie cięcia dopasowane do guza).
     mob: krezka zstępnicy na odcinku sprowadzanym do miednicy lub do stomii (tPJ–tA) zanika, gdy jelito się przemieszcza. Czasy jak w mesoRight. */
  function mesoLeft(mode, rr) {
    var V3 = THREE.Vector3, c = { ira: { r: [MESO_T0, tSig], off: [0, 3, 7] }, ipaa: { r: [MESO_T0, ct([0, -18.2, -1.0])], off: [0, 3, 8] }, sig: { r: [tA, tH], off: [-6, 2, 6], mob: [tPJ, tA] }, sf: { r: SF_T, off: SF_OFF }, lh: { r: [tTL, tSg2], off: [7, 1, 5] }, ar: { r: [tA, RT[1]], off: [-6, 2, 6], mob: [tPJ, tA] }, arp: { r: [tA, tLs], off: [-6, 2, 6], mob: [tPJ, tA] }, hart: { r: [tA, tH], off: [-6, 2, 6], mob: [tPJ, tA] }, apr: { r: [tA, 1], off: APR_OFF, mob: [tPJ, tA] } }[mode];
    if (rr) { c = { r: rr, off: c.off, mob: c.mob ? [tPJ, rr[0]] : null }; } // linie cięcia dopasowane do guza
    var tot = mode === 'ira' || mode === 'ipaa'; // kolektomia całkowita: krezka całej okrężnicy (prawa część jak w mesoRight)
    var T0 = tot ? MESO_T0 : ct([0.6, 3.4, 2.8]), SEG = [[T0, MESO_T1, null, tot ? 40 : 14], [LT[0], LT[1], LROOT, 24], [ST[0], ST[1], SROOT, 16], [RT[0], RT[1], RROOT, 16]];
    SEG.forEach(function (g) { if (g[2]) g[4] = curveOf(g[2]); });
    function edge(tc, k) {
      var g = tc < (MESO_T1 + LT[0]) / 2 ? SEG[0] : tc < ST[0] ? SEG[1] : tc < RT[0] ? SEG[2] : SEG[3];
      if (!g[2]) return mesoEdge(tc, k);
      var P = C_COL.getPointAt(tc), R = g[4].getPointAt(Math.max(0, Math.min(1, (tc - g[0]) / (g[1] - g[0])))), T = C_COL.getTangentAt(tc), d = R.clone().sub(P);
      d.sub(T.multiplyScalar(d.dot(T))).normalize();
      var E = P.addScaledVector(d, COL_R(tc) * 0.92); return k ? E.lerp(R, k) : E;
    }
    function cls(t) { return t >= c.r[0] && t <= c.r[1] ? 'R' : c.mob && t > c.mob[0] && t < c.mob[1] ? 'M' : 'K'; }
    // podział na ciągłe pasy według klasy (R — usuwany, M — przemieszczany, K — pozostaje); granice dokładnie w punktach przecięcia
    function runs(t0, t1, n, mk) {
      var ts = []; for (var i = 0; i <= n; i++) ts.push(t0 + (t1 - t0) * i / n);
      [c.r[0], c.r[1]].concat(c.mob || []).forEach(function (x) { if (x > t0 && x < t1) ts.push(x); });
      ts.sort(function (a, b) { return a - b; });
      var out = [], cur = null;
      for (var j = 0; j < ts.length - 1; j++) {
        if (ts[j + 1] - ts[j] < 1e-4) continue;
        var k = cls((ts[j] + ts[j + 1]) / 2);
        if (!cur || cur.k !== k) { cur = { k: k, pts: [mk(ts[j])] }; out.push(cur); }
        cur.pts.push(mk(ts[j + 1]));
      }
      return out;
    }
    var sheets = [];
    SEG.forEach(function (g) {
      runs(g[0], g[1], g[3], function (tc) { return [edge(tc).toArray(), edge(tc, 1).toArray(), tc]; }).forEach(function (r) {
        sheets.push({ rows: r.pts, removed: r.k === 'R', mob: r.k === 'M' });
      });
    });
    var IMA_O = [0.6, -3.4, -2.7], LC_O = [0.8, -4.3, -2.6], LCB = [3.6, -2.4, -1.9], SB1_O = [1.0, -6.2, -2.4], SB2_O = [0.95, -7.4, -2.4], SRA_O = [0.9, -8.2, -2.5];
    var le = function (tc) { return edge(tc).toArray(); }, lh = mode === 'lh', sg = mode === 'sig' || mode === 'ira', sfm = mode === 'sf', ar = mode === 'ar' || mode === 'arp' || mode === 'apr' || mode === 'ipaa' || sg, pme = mode === 'arp', ht = mode === 'hart';
    var IMA = [IMA_O, LC_O, [1.0, -6.0, -2.4], SRA_O], SRA = [SRA_O, [0.6, -11.0, -2.5], [0.25, -14.0, -2.9], [0.1, -16.6, -3.0]];
    var V = [];
    if (ht) { // podwiązanie IMA poniżej odejścia LC
      V.push({ id: 'imaTop', name: '', kind: 'a', pts: [IMA_O, LC_O], nodes: 'central', nodesRemoved: true }); // węzły u korzenia IMA usuwane (niskie podwiązanie z wycięciem węzłów wzdłuż IMA)
      V.push({ id: 'ima', name: 'IMA — tętnica krezkowa dolna', kind: 'a', pts: IMA.slice(1), removed: true, tie: 0.06, at: 0.5, nodes: 'central', ng: ['252'] }); // pień IMA poniżej LC z preparatem
    } else V.push({ id: 'ima', name: 'IMA — tętnica krezkowa dolna', kind: 'a', pts: IMA, removed: ar, tie: ar ? 0.05 : null, at: 0.3, nodes: 'ima' }); // 253 przed odejściem LC, 252 wzdłuż pnia
    V.push({ id: 'lc', name: 'LC — tętnica lewa okrężnicy', kind: 'a', pts: [LC_O, via3(LC_O, LCB, 0.2), LCB, le(0.575)], removed: lh || sfm || tot, tie: lh || ar || sfm ? 0.06 : null, at: 0.55, nodes: true });
    V.push({ id: 'lca', name: '', kind: 'a', pts: [LCB, [5.4, 1.8, -1.6], le(0.50)], removed: lh || sfm || tot, nodes: 'outer' });
    V.push({ id: 'sb', name: 'SB — gałęzie esicze', kind: 'a', pts: [SB1_O, via3(SB1_O, le(0.76), 0.3), le(0.76)], removed: !sfm, tie: lh ? 0.08 : null, at: 0.6, nodes: true });
    V.push({ id: 'sb2', name: '', kind: 'a', pts: [SB2_O, via3(SB2_O, le(0.82), 0.3), le(0.82)], removed: !lh && !sfm, nodes: 'outer' });
    if (sfm) { // resekcja zagięcia śledzionowego: pień MC zostaje, gałąź lewa MC (LBMC) podwiązana u odejścia
      var MC_O = [-0.45, 2.4, -2.2], BIF = [-1.2, 2.3, -0.6], eL = le(0.43);
      V.push({ id: 'mc', name: 'MC — pień tętnicy środkowej okrężnicy', kind: 'a', pts: [MC_O, via3(MC_O, BIF, 0.1), BIF], at: 0.5, nodes: 'central', ng: JS_R.mc });
      V.push({ id: 'lbmc', name: 'LBMC — gałąź lewa MC', kind: 'a', pts: [BIF, [1.4, 3.2, -0.1], via3([1.4, 3.2, -0.1], eL, 0.3), eL], removed: true, tie: 0.04, at: 0.55, nodes: 'outer', ng: JS_R.lbmc });
    }
    if (ht || pme || sg) { // SRA przecięta na wysokości przecięcia jelita (Hartmann: połączenie esiczo-odbytnicze; PME): górna część z preparatem, dolna w mezorektum kikuta
      var cS = curveOf(SRA), yCut = edge(c.r[1], 0.5).y, fS = 0, best = 1e9;
      for (var q = 0; q <= 200; q++) { var dy = Math.abs(cS.getPointAt(q / 200).y - yCut); if (dy < best) { best = dy; fS = q / 200; } }
      var up = [], low = [];
      for (var u = 0; u <= 12; u++) { up.push(cS.getPointAt(fS * u / 12).toArray()); low.push(cS.getPointAt(fS + (1 - fS) * u / 12).toArray()); }
      V.push({ id: 'sraTop', name: '', kind: 'a', pts: up, removed: true, nodes: 'outer' });
      V.push({ id: 'sra', name: 'SRA — tętnica odbytnicza górna', kind: 'a', pts: low, tie: 0.03, at: 0.5, nodes: 'meso' });
    } else V.push({ id: 'sra', name: 'SRA — tętnica odbytnicza górna', kind: 'a', pts: SRA, removed: ar, at: 0.6, nodes: 'meso' });
    // kolektomia całkowita: naczynia prawej połowy i poprzecznicy jak w poszerzonej hemikolektomii prawej (IC, RC, pień MC u odejścia z SMA; RBMC i LBMC z preparatem)
    if (tot) V = mesoRight('ext').vessels.filter(function (v) { return !/^arc/.test(v.id); }).map(function (v) { var w = {}; for (var k in v) w[k] = v[k]; w.ng = JS_R[v.id]; return w; }).concat(V);
    var TA = T0 + (tot ? 0.02 : 0.004), TB = 0.86; // łuk brzeżny (do esicy; odbytnicę zaopatruje SRA)
    runs(TA, TB, 50, function (ta) { return edge(ta, 0.08).toArray(); }).forEach(function (r, i) {
      if (r.pts.length > 1) V.push({ id: 'arc' + i, name: '', kind: 'm', pts: r.pts, removed: r.k === 'R', mob: r.k === 'M' });
    });
    var nodes = [];
    V.forEach(function (v) {
      if (!v.nodes) return;
      var cv = curveOf(v.pts), fs = v.nodes === 'central' ? [0.35] : v.nodes === 'outer' ? [0.5, 0.86] : v.nodes === 'meso' ? [0.35, 0.6, 0.85] : v.nodes === 'ima' ? [0.1, 0.6] : [0.15, 0.5, 0.86];
      fs.forEach(function (f, i) { nodes.push({ p: cv.getPointAt(f).add(new V3(0, 0.22, 0.18)).toArray(), removed: !!v.removed || !!v.nodesRemoved, g: (v.ng || JS_L[v.id] || [])[i] }); });
    });
    var tm = ar && !sg ? 0.8 : (c.r[0] + c.r[1]) / 2, tR = 0.93;
    return { type: 'meso', sheets: sheets.filter(function (s) { return s.rows.length > 1; }), vessels: V, nodes: nodes, groups: nodeGroups(nodes, NG_JSCCR, 'jsccr'),
      name: 'Krezka z węzłami chłonnymi', sub: 'usuwana z preparatem', anchor: edge(tm, 0.45).toArray(),
      labels: [{ name: 'Mezorektum', sub: pme ? 'częściowo usuwane (PME)' : sg ? (c.r[1] > RT[0] + 0.02 ? 'górna część usuwana z preparatem' : 'pozostaje') : mode === 'apr' ? 'usuwane w całości z odbytnicą i kanałem odbytu' : ar ? 'usuwane w całości (TME)' : ht ? 'pozostaje z kikutem odbytnicy' : 'pozostaje', p: edge(tR, 0.45).toArray(), removed: ar && !pme && !sg }],
      offset: [[2.15, [0, 0, 0]], [2.9, c.off]], opacity: [[2.55, 1], [2.9, 0]], mobOpacity: c.mob ? [[3.0, 1], [3.35, 0]] : null, tieT: 1.25 };
  }

  /* ---------- Ileostomia pętlowa / dwulufowa ---------- */
  var ILE = [[3.5, -0.5, 0.4], [0.5, -0.8, 1.0], [-2.8, -1.6, 1.2], [-3.6, -3.6, 1.4], [-1.0, -4.4, 1.6], [2.2, -4.0, 1.6], [4.2, -5.4, 1.0], [1.2, -6.2, 1.4], [-2.0, -7.2, 1.4], [-4.4, -7.8, 1.0], [-6.0, -7.9, 0.6]];
  var C_ILE = curveOf(ILE);
  /* krezka końcowego odcinka jelita krętego przy ileostomii: wachlarz od korzenia (skośnie ku okolicy krętniczo-kątniczej) do brzegu krezkowego,
     tętnice jelita krętego i łuk arkad; bez podwiązań i węzłów (zabieg nieonkologiczny). Przy wyprowadzeniu krezka podąża za ramionami do otworu
     w powłokach (morph, czasy jak przemieszczenie jelita); brzeg nie wychodzi ponad powłoki. P, Dd — ramiona po operacji, cut — miejsce stomii na C_ILE. */
  var ILE_ROOT = curveOf([[1.8, -1.4, -1.9], [0.2, -3.4, -1.8], [-1.6, -5.4, -1.5], [-3.4, -7.0, -1.1], [-4.6, -7.6, -0.6]]);
  function ileoMeso(P, Dd, cut, ZW) {
    var cP = curveOf(P), cD = curveOf(Dd);
    function root(t) { return ILE_ROOT.getPointAt(Math.max(0, Math.min(1, t))); }
    function bowel(t, post) { return !post ? [C_ILE.getPointAt(t), C_ILE.getTangentAt(t)] : t <= cut ? [cP.getPointAt(t / cut), cP.getTangentAt(t / cut)] : [cD.getPointAt((t - cut) / (1 - cut)), cD.getTangentAt((t - cut) / (1 - cut))]; }
    function E(t, post, k) {
      var b = bowel(t, post), Rt = root(t), d = Rt.clone().sub(b[0]); d.sub(b[1].multiplyScalar(d.dot(b[1]))).normalize();
      var e = b[0].addScaledVector(d, 0.83); if (k) e.lerp(Rt, k); if (post && e.z > ZW) e.z = ZW; return e.toArray();
    }
    function ts(t0, t1, n) { var o = []; for (var i = 0; i <= n; i++) o.push(t0 + (t1 - t0) * i / n); return o; }
    var sheets = [], V = [];
    [[0.03, cut - 0.03, 30], [cut + 0.03, 0.985, 30]].forEach(function (g, gi) {
      var L = ts(g[0], g[1], g[2]);
      sheets.push({ rows: L.map(function (t) { return [E(t, false), root(t).toArray(), t]; }), post: L.map(function (t) { return [E(t, true), root(t).toArray(), t]; }) });
      var A = ts(g[0], g[1], 24); // łuk arkad przy brzegu krezkowym
      V.push({ id: 'arc' + gi, name: '', kind: 'm', pts: A.map(function (t) { return E(t, false, 0.2); }), post: A.map(function (t) { return E(t, true, 0.2); }) });
      [0.2, 0.5, 0.8].forEach(function (f, j) { // tętnice jelita krętego od korzenia (gałęzie SMA) do łuku
        var t = g[0] + (g[1] - g[0]) * f, r0 = root(t).toArray(), a = E(t, false, 0.2), b = E(t, true, 0.2);
        V.push({ id: 'il' + gi + j, name: gi === 0 && j === 1 ? 'Tętnice jelita krętego' : '', kind: 'a', pts: [r0, via3(r0, a, 0.2), a], post: [r0, via3(r0, b, 0.2), b], at: 0.5 });
      });
    });
    return { type: 'meso', sheets: sheets, vessels: V, nodes: [], name: 'Krezka jelita krętego', sub: 'przechodzi z pętlą do otworu w powłokach',
      anchor: E(0.3, false, 0.5), morph: [2.1, 2.9], opacity: [[0, 1]], tieT: 99 };
  }
  // loop: pętlowa (ramiona zbiegają się w jedną stomię, wspólne światło) / dwulufowa (dwa osobne otwory)
  // up: ramię wydzielnicze (proksymalne) w górnej części stomii; inaczej w dolnej
  function ileoAnat(loop, up) {
    var X = -4.4, Z = 5.6, yc = -4.85, half = loop ? 0.65 : 1.7;
    var yP = up ? yc + half : yc - half, yD = up ? yc - half : yc + half;
    var sp = [X, yP, Z + 0.75], sd = [X, yD, Z + 0.15];   // ramię wydzielnicze wywinięte (wyżej nad skórą), odprowadzające płasko
    var P, Dd;
    if (up) {
      P = [[3.5, -0.5, 0.4], [0.5, -0.8, 1.0], [-2.2, -1.5, 1.4], [-3.0, -2.6, 2.4], [-3.7, yP + 0.8, 3.8], [X + 0.05, yP + 0.25, 4.8], [X, yP, 5.5], sp];
      Dd = [sd, [X, yD, 4.9], [X + 0.3, yD - 0.8, 3.8], [-3.8, -7.0, 2.6], [-3.6, -7.5, 1.6], [-4.4, -7.8, 1.0], [-6.0, -7.9, 0.6]];
    } else {
      P = [[3.5, -0.5, 0.4], [0.5, -0.8, 1.0], [-2.8, -1.6, 1.2], [-2.6, -3.6, 1.6], [-2.0, -5.6, 2.2], [-3.1, yP - 0.9, 3.6], [X + 0.1, yP - 0.1, 4.8], [X, yP, 5.5], sp];
      Dd = [sd, [X - 0.1, yD + 0.2, 4.9], [-5.1, yD - 0.3, 3.7], [-5.1, -5.9, 3.0], [-4.7, -7.2, 2.0], [-4.4, -7.8, 1.0], [-6.0, -7.9, 0.6]];
    }
    // miejsce stomii na powłokach (BODY): prawy dół biodrowy, przez prawy mięsień prosty. Geometria zbudowana dla (X, yc, Z) przesunięta płynnie:
    // pełne przesunięcie przy powłokach, zero w głębi jamy brzusznej (ułożenie jelita w środku bez zmian)
    var XS = -2.8, YS = -6.9, ZS = BODY.z(XS, YS), dX = XS - X, dY = YS - yc, dZ = ZS - Z;
    function mv(p) { var w = sm01((p[2] - 1.4) / 2.6); return [p[0] + w * dX, p[1] + w * dY, p[2] + w * dZ]; }
    P = P.map(mv); Dd = Dd.map(mv);
    var split = splitBy(C_ILE, 0.9, [P, Dd]), cut = split.cuts[0];
    var holes = (loop ? [{ c: [X, yc], rx: 1.25, ry: 1.75 }] : [{ c: [X, yP], rx: 1.1, ry: 1.1 }, { c: [X, yD], rx: 1.1, ry: 1.1 }]).map(function (h) { h.c = [h.c[0] + dX, h.c[1] + dY]; return h; });
    var ST = [[2.4, 0], [2.85, 1]];
    var stomas = loop ? [{ kind: 'stoma', name: 'Ileostomia pętlowa — jedna stomia, dwa światła', center: mv([X, yc, Z + 0.2]), rx: 1.25, ry: 1.75, opacity: ST }]
      : [{ kind: 'stoma', name: 'Otwór wydzielniczy (proksymalny)', center: mv([X, yP, Z + 0.3]), rx: 1.1, ry: 1.1, opacity: ST },
         { kind: 'stoma', name: 'Otwór odprowadzający (dystalny)', center: mv([X, yD, Z + 0.15]), rx: 1.05, ry: 1.05, opacity: ST }];
    var pos = up ? 'górne' : 'dolne', posM = up ? 'górny' : 'dolny', posL = up ? 'górnym' : 'dolnym', posG = up ? 'górnej' : 'dolnej', posO = up ? 'dolnej' : 'górnej';
    var objs = [
      { id: 'colon', name: 'Jelito grube', pre: { path: COLON, r: COL_R }, color: COLC.colon, mucosa: 'haustra', tint: MUC_C,
        labels: COL_LABELS.map(function (lb) { return L(lb[0], lb[1], ALL); }) },
      appObj({}),
      { id: 'prox', name: 'Jelito kręte', postName: 'Ramię wydzielnicze (proksymalne)', pre: split.parts[0], post: { path: P, r: flat(0.9) }, morph: [1.1, 1.9], open: [false, true],
        color: COLC.ti, mucosa: 'circular', tint: MUC.bowel, labels: [L('Jelito kręte', 0.35, PRE), L('Ramię wydzielnicze', 0.62, POST)] },
      { id: 'dist', name: 'Jelito kręte (końcowy odcinek)', postName: 'Ramię odprowadzające (dystalne)', pre: split.parts[1], post: { path: Dd, r: flat(0.9) }, morph: [1.1, 1.9], open: [true, false],
        color: COLC.ti, mucosa: 'circular', tint: MUC.bowel, labels: [L('Ramię odprowadzające', 0.4, POST)] }
    ];
    // pętla wyprowadzona w całości (szczyt nad skórą) do chwili otwarcia — widać, że jelito nie jest przecięte
    if (loop) objs.push({ id: 'apex', name: 'Szczyt pętli', noEndo: true, pre: { path: [[X, yP, Z + 0.3], [X, yc + (yP - yc) * 0.3, Z + 1.35], [X, yc + (yD - yc) * 0.3, Z + 1.35], [X, yD, Z + 0.3]].map(mv), r: flat(0.88) },
      color: COLC.ti, mucosa: 'circular', tint: MUC.bowel, opacity: [[1.7, 0], [1.95, 1], [2.45, 1], [2.75, 0]], labels: [L('Pętla wyprowadzona — nieprzecięta', 0.5, [1.95, 2.45])] });
    return {
      cat: 'colon', id: 'ileo-' + (loop ? 'loop' : 'double') + (up ? '-up' : '-dn'), short: loop ? 'Ileostomia pętlowa' : 'Ileostomia dwulufowa',
      title: (loop ? 'Ileostomia pętlowa' : 'Ileostomia dwulufowa') + ' — ramię wydzielnicze ' + pos,
      sub: loop ? 'Pętla jelita krętego nieprzecięta: wyprowadzona przez powłoki, otwarta od strony przeciwkrezkowej i wszyta jako jedna stomia'
        : 'Jelito kręte przecięte; oba końce wyprowadzone osobno, obok siebie, z mostkiem skóry między nimi',
      notes: (loop ? [
        'Najczęściej ochronna, np. przy niskim zespoleniu odbytnicy lub zbiorniku J; zamykana po wygojeniu zespolenia. Schemat pokazuje stomię przy zachowanej okrężnicy; przy zbiorniku J ramię odprowadzające prowadzi do zbiornika.',
        'Jelito nie jest przecięte: tylna (krezkowa) ściana pętli zostaje ciągła i tworzy ostrogę między dwoma światłami jednej stomii.',
        'Ramię wydzielnicze (proksymalne) wywinięte, odprowadzające (dystalne) płaskie.'
      ] : [
        'Jelito kręte przecięte; oba końce wszyte jako dwa osobne otwory obok siebie, z mostkiem skóry między nimi.',
        'Otwór wydzielniczy (proksymalny) wywinięty; odprowadzający (dystalny) płaski — przetoka śluzowa.',
        'Oba końce w jednym miejscu — łatwiejsze późniejsze odtworzenie ciągłości.'
      ]).concat(['Ramię wydzielnicze w ' + posG + ' części stomii, odprowadzające w ' + posO + '. Ułożenie zależy od obrotu pętli i preferencji ośrodka; ważne, by worek dobrze obejmował światło wydzielnicze.']),
      focus: { t: [-2.8, -6.0, 3.4], k: 0.6 }, text: COL_TEXT,
      frames: loop ? {
        resect: ['Wybór pętli', 'Pętla końcowego odcinka jelita krętego, ok. 20–30 cm od zastawki; otwór w powłokach w prawym dole biodrowym.', 'Wybór pętli'],
        remove: ['Wyprowadzenie pętli', 'Nieprzecięta pętla przeciągnięta przez powłoki; ramię wydzielnicze w ' + posG + ' części otworu, czasem (np. u otyłych) podparta pręcikiem — rutynowo niekonieczne.', 'Wyprowadzenie'],
        recon: ['Otwarcie i wszycie', 'Pętla otwarta poprzecznie od strony przeciwkrezkowej; ramię wydzielnicze wywinięte, oba światła wszyte w skórę jako jedna stomia.', 'Wszycie'],
        post: 'Jedna stomia, dwa światła rozdzielone ostrogą: wydzielnicze (' + pos + ', wywinięte) i odprowadzające (płaskie).',
        endoPost: 'Wybierz światło: wydzielnicze (jelito kręte w górę strumienia) albo odprowadzające (do zastawki i jelita grubego).'
      } : {
        resect: ['Przecięcie jelita', 'Jelito kręte przecięte staplerem liniowym ok. 20–30 cm od zastawki.', 'Przecięcie'],
        remove: ['Wyprowadzenie końców', 'Oba końce przeciągnięte przez powłoki osobno, obok siebie; wydzielniczy w ' + posL + ' otworze.', 'Wyprowadzenie'],
        recon: ['Wszycie stomii', 'Koniec wydzielniczy wywinięty i wszyty, odprowadzający wszyty płasko obok; między nimi mostek skóry.', 'Wszycie'],
        post: 'Dwa osobne otwory z mostkiem skóry: wydzielniczy (' + posM + ', wywinięty) i odprowadzający (płaski).',
        endoPost: 'Wybierz otwór: wydzielniczy (jelito kręte) albo odprowadzający (do zastawki i jelita grubego).'
      },
      endoTitles: ['Kolonoskopia z wejściem do jelita krętego', 'Endoskopia przez stomię'],
      objects: objs,
      marks: [
        ringOn(C_ILE, flat(0.9), cut, loop ? { name: 'Pętla na stomię', color: COL.mark, opacity: [[0.05, 0], [0.55, 1], [1.4, 1], [1.7, 0]] }
          : { name: 'Przecięcie jelita krętego', color: COL.cut, opacity: [[0.05, 0], [0.55, 1], [1.4, 1], [1.7, 0]] }),
        { kind: 'body', name: 'Powłoki brzuszne', holes: holes, opacity: [[0.3, 0], [0.8, 1]] }
      ].concat(stomas),
      endTarget: { pre: null }, ileoMeso: ileoMeso(P, Dd, cut, ZS - 1.0),
      routePost: { prefix: [], branches: [
        { label: 'Ramię wydzielnicze', sub: 'proksymalne — jelito kręte', steps: [{ pt: [X + dX, yP + dY, 9.2 + dZ], note: 'Stomia — światło wydzielnicze' }, { obj: 'prox', from: 1, to: 0.6, note: 'Jelito kręte, w górę strumienia treści' }] },
        { label: 'Ramię odprowadzające', sub: 'dystalne — do zastawki i jelita grubego', steps: [{ pt: [X + dX, yD + dY, 9.2 + dZ], note: 'Stomia — światło odprowadzające' }, { obj: 'dist', note: 'Wyłączony odcinek jelita krętego do zastawki' }, { obj: 'colon', from: 0.035, to: 0.07, note: 'Kątnica' }] }
      ] }
    };
  }

  /* ---------- rozwidlenia tras endoskopowych po operacji ---------- */
  function branchify(an, k, first, second) {
    var r = an.routePost;
    an.routePost = { prefix: r.slice(0, k), branches: [
      { label: first[0], sub: first[1], steps: r.slice(k), target: 'papilla', endText: 'Brodawka Vatera w polu widzenia' },
      { label: second[0], sub: second[1], steps: second[2] } ] };
    return an;
  }
  var BIL = ['Pętla biliopankreatyczna', 'do brodawki Vatera'], AFFB = ['Pętla doprowadzająca', 'biliopankreatyczna, do brodawki'];
  var CCB = function (id) { return ['Kanał wspólny', 'dalej z treścią pokarmową', [{ obj: id, note: 'Kanał wspólny — dalej w dół' }]]; };
  var EFFB = function (id) { return ['Pętla odprowadzająca', 'alimentacyjna, dalej w dół', [{ obj: id, note: 'Pętla odprowadzająca' }]]; };
  var B2 = b2(false), B2BR = b2(true);
  branchify(TG, 2, BIL, CCB('cc')); branchify(RYGB, 3, BIL, CCB('cc')); branchify(DGRY, 3, BIL, CCB('cc'));
  branchify(OAGB, 2, AFFB, EFFB('eff')); branchify(B2, 2, AFFB, EFFB('eff')); branchify(B2BR, 2, AFFB, EFFB('eff'));



