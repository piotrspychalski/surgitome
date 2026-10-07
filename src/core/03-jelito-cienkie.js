  /* =====================================================================
     JELITO CIENKIE — resekcja odcinka w anatomii całej jamy brzusznej
     ===================================================================== */
  var SB2 = [[3.1, -4.0, -1.6], [5.4, -5.2, -0.6], [6.4, -7.0, 0.4], [4.2, -7.8, 1.2], [1.4, -7.4, 1.4], [-1.6, -7.8, 1.2], [-4.4, -8.6, 1.0], [-5.2, -10.4, 0.8],
    [-2.4, -11.2, 1.4], [0.6, -11.0, 1.6], [3.6, -11.2, 1.4], [6.2, -11.8, 0.8], [6.6, -14.2, 0.6], [3.6, -14.8, 1.2], [0.6, -14.6, 1.6], [-2.6, -14.8, 1.4], [-5.2, -15.6, 0.8],
    [-4.8, -17.8, 0.8], [-1.4, -18.2, 1.4], [1.8, -18.0, 1.6], [4.8, -18.6, 1.2], [4.2, -21.0, 1.0], [1.0, -21.6, 1.4], [-2.0, -21.2, 1.2], [-4.6, -20.6, 0.8], [-6.8, -20.4, 0.6]];
  var C_SB2 = curveOf(SB2);
  var COLON_SB = [[-8.4, -22.8, 0.6], [-8.6, -20.4, 0.4], [-8.8, -15, 0.3], [-8.7, -9, 0.2], [-8.6, -4.8, 0.3], [-8.3, -2.6, 0.9], [-5.9, -3.0, 3.3], [-2.4, -5.0, 3.2], [0.6, -5.6, 3.4],
    [3.6, -4.8, 3.0], [6.2, -2.6, 1.4], [7.8, -1.0, -0.4], [9.1, -3.5, -0.8], [9.2, -9, -0.8], [9.2, -15, -0.6], [8.8, -19.4, -0.2], [6.6, -23.6, 1.2], [3.0, -24.4, 2.4],
    [0.4, -25.6, 2.0], [0.2, -27.6, -0.6], [0, -29.6, -1.3]];
  var C_CSB = curveOf(COLON_SB);
  function cst(p) { return nearestT(C_CSB, p, 1500); }
  var CSB_R = profile([[0, 0.05], [0.012, 1.7], [0.05, 1.9], [cst([-8.7, -9, 0.2]), 1.7], [cst([-8.3, -2.6, 0.9]), 1.5], [cst([0.6, -5.6, 3.4]), 1.35], [cst([7.8, -1.0, -0.4]), 1.25],
    [cst([9.2, -9, -0.8]), 1.15], [cst([8.8, -19.4, -0.2]), 1.05], [cst([3.0, -24.4, 2.4]), 1.0], [cst([0.2, -27.6, -0.6]), 1.3], [1, 1.5]]);
  var APP_SB = [[-8.2, -22.3, 0.6], [-8.0, -23.9, 0.7], [-7.4, -25.2, 0.9], [-6.6, -26.1, 1.2]];
  var ra = nearestT(C_SB2, [-2.0, -11.2, 1.45]), rb = nearestT(C_SB2, [3.2, -11.2, 1.45]);
  var rap = nearestT(C_SB2, [-5.2, -10.4, 0.8]), rbp = nearestT(C_SB2, [6.2, -11.8, 0.8]);
  var SBP_PRE = sub(C_SB2, flat(1.0), 0, ra, 60), SBS_PRE = sub(C_SB2, flat(1.0), ra, rb, 16), SBD_PRE = sub(C_SB2, flat(1.0), rb, 1, 70);
  var SBP_HEAD = sub(C_SB2, flat(1.0), 0, rap, 50).path, SBD_TAIL = sub(C_SB2, flat(1.0), rbp, 1, 60).path;
  var SB_COL2 = '#d9929f', SUT2 = '#7457c9', STAPLE2 = '#8f99a3';
  var LOC = {
    e2e: { tail: [[-3.6, -11.0, 1.3], [-1.8, -11.0, 1.5], [0.6, -11.0, 1.6]], head: [[0.6, -11.0, 1.6], [2.6, -11.0, 1.5], [4.8, -11.4, 1.2]] },
    iso: { tail: [[-3.8, -10.8, 1.3], [-1.8, -10.35, 1.6], [0.4, -10.35, 1.6], [2.6, -10.35, 1.6]], head: [[-1.8, -11.65, 1.6], [0.4, -11.65, 1.6], [2.4, -11.65, 1.6], [4.4, -11.8, 1.2]] },
    anti: { tail: [[-3.8, -10.8, 1.3], [-1.8, -10.35, 1.6], [0.4, -10.35, 1.6], [2.6, -10.35, 1.6]],
      head: [[2.6, -11.65, 1.6], [0.4, -11.65, 1.6], [-1.8, -11.65, 1.6], [-3.4, -12.2, 2.3], [-2.0, -12.6, 3.6], [1.0, -12.6, 3.9], [3.8, -12.3, 3.4], [5.4, -12.0, 2.0]] }
  };
  function sbAnat(kind) {
    var loc = LOC[kind], pPath = SBP_HEAD.concat(loc.tail), dPath = loc.head.concat(SBD_TAIL);
    var P = kind === 'e2e' ? { path: pPath, r: flat(1.0) } : { path: pPath, r: STUMP_END };
    var D = kind === 'e2e' ? { path: dPath, r: flat(1.0) } : { path: dPath, r: STUMP_START(lenOf(dPath)) };
    var t = {
      e2e: { id: 'sb-e2e', title: 'Resekcja jelita cienkiego: zespolenie koniec-do-końca', sub: 'Szew ręczny ciągły na całym obwodzie',
        notes: ['Oba końce zespolone bezpośrednio — ciągłość i kierunek perystaltyki zachowane.', 'Przy różnicy średnic końców pomaga nacięcie brzegu przeciwkrezkowego węższego końca (Cheatle).', 'W endoskopii: okrężna linia szwu, bez ślepych kikutów.'],
        recon: ['Zespolenie koniec-do-końca', 'Końce zbliżone do siebie bez napięcia; szew na całym obwodzie.'],
        post: 'Jedna linia szwu na obwodzie; brak ślepych końców.', endo: 'Przez linię szwu na wprost — światło ciągłe.' },
      iso: { id: 'sb-iso', title: 'Resekcja jelita cienkiego: zespolenie bok-do-boku izoperystaltyczne', sub: 'Stapler liniowy, ramiona ułożone zgodnie z kierunkiem perystaltyki',
        notes: ['Ramiona ułożone równolegle, zachodzą na siebie; kikuty po przeciwnych stronach zespolenia.', 'Kierunek perystaltyki w obu ramionach ten sam — treść przechodzi bez zawracania.', 'Otwór po wprowadzeniu staplera zamknięty szwem.'],
        recon: ['Zespolenie bok-do-boku izoperystaltyczne', 'Ramiona ułożone równolegle i zgodnie z perystaltyką, kikuty po przeciwnych stronach.'],
        post: 'Dwa ślepe kikuty po przeciwnych stronach zespolenia; treść płynie w jednym kierunku.', endo: 'Z ramienia doprowadzającego bokiem do odprowadzającego — bez zawracania aparatu.' },
      anti: { id: 'sb-anti', title: 'Resekcja jelita cienkiego: zespolenie bok-do-boku antyperystaltyczne', sub: 'FEEA (functional end-to-end anastomosis) — stapler liniowy i zamknięcie poprzeczne',
        notes: ['Końce ułożone obok siebie w tę samą stronę („dwulufowo”), stapler liniowy wprowadzony w oba światła.', 'Wspólny otwór końców zamknięty poprzecznie staplerem liniowym (TA).', 'Treść w zespoleniu zawraca o 180° — funkcjonalnie koniec-do-końca.'],
        recon: ['Zespolenie antyperystaltyczne (FEEA)', 'Końce ułożone równolegle w tę samą stronę; odcinek dystalny zawraca pętlą przed zespoleniem.'],
        post: 'Oba kikuty po tej samej stronie, zamknięte poprzeczną linią zszywek; ramiona biegną przeciwnie.', endo: 'We wspólnym świetle zawrócenie o 180° z ramienia doprowadzającego do odprowadzającego.' }
    }[kind];
    var marks = [
      ringOn(C_SB2, flat(1.0), ra, { name: 'Linia przecięcia', color: COL.cut, opacity: CUT_OP_JEJ }),
      ringOn(C_SB2, flat(1.0), rb, { name: 'Linia przecięcia', color: COL.cut, opacity: CUT_OP_JEJ })
    ];
    if (kind === 'e2e') marks.push(ringAt(dPath, flat(1.0), [0.6, -11.0, 1.6], { name: 'Szew ręczny koniec-do-końca', color: SUT2, opacity: ANAST_OP, endo: true, dash: 0.3 }));
    else {
      marks.push({ kind: 'line', name: 'Linia zszywek (stapler liniowy)', color: STAPLE2, opacity: ANAST_OP, pts: [[-1.8, -11.0, 2.45], [0, -11.0, 2.5], [1.8, -11.0, 2.45]] });
      if (kind === 'iso') marks.push({ kind: 'line', name: 'Zamknięcie otworu po staplerze', color: SUT2, opacity: ANAST_OP, pts: [[2.3, -9.7, 2.3], [2.3, -11.0, 2.8], [2.3, -12.3, 2.3]] });
      else marks.push({ kind: 'line', name: 'Zamknięcie poprzeczne końców (TA)', color: STAPLE2, opacity: ANAST_OP, pts: [[2.75, -9.5, 2.1], [2.8, -11.0, 2.7], [2.75, -12.5, 2.1]] });
    }
    var from = [-4.4, -8.6, 1.0];
    var route = kind === 'e2e' ? [{ obj: 'p', from: from, note: 'Jelito czcze — odcinek proksymalny' }, { obj: 'd', to: [6.2, -11.8, 0.8], note: 'Za linią szwu — odcinek dystalny' }]
      : kind === 'iso' ? [{ obj: 'p', from: from, to: [0.2, -10.35, 1.6], note: 'Odcinek proksymalny — wejście we wspólne światło' }, { obj: 'd', from: [0.6, -11.65, 1.6], to: [6.2, -11.8, 0.8], note: 'Bokiem do odcinka dystalnego, ten sam kierunek' }]
        : [{ obj: 'p', from: from, to: [0.6, -10.35, 1.6], note: 'Odcinek proksymalny — wejście we wspólne światło' }, { obj: 'd', from: [0.6, -11.65, 1.6], to: [5.4, -12.0, 2.0], note: 'Zawrócenie o 180° do odcinka dystalnego' }];
    return {
      cat: 'sb', id: t.id, short: t.title, title: t.title, sub: t.sub, notes: t.notes, focus: { t: [0.6, -11.2, 1.8], k: 0.4 },
      ctOverride: { stom: 'contrast', duo: 'contrast' },
      endoTitles: ['Widok endoskopowy: jelito prawidłowe', 'Widok endoskopowy po zespoleniu'],
      text: { normal: ['Anatomia prawidłowa', 'Jelito cienkie od więzadła Treitza do zastawki krętniczo-kątniczej: jelito czcze w lewym górnym kwadrancie, kręte w prawym dolnym i w miednicy; wokół rama jelita grubego.'],
        top: 'Z góry widać ułożenie ramion zespolenia względem pętli jelita.' },
      frames: {
        resect: ['Zakres resekcji', 'Odcinek jelita cienkiego z klinem krezki; przecięcie po obu stronach staplerem liniowym, podwiązanie naczyń krezkowych.', 'Zakres resekcji'],
        remove: ['Usunięcie odcinka', 'Odcinek usunięty; pozostają koniec proksymalny i dystalny.', 'Usunięcie'],
        recon: [t.recon[0], t.recon[1], 'Zespolenie'], post: t.post, endoPost: t.endo
      },
      objects: [
        eso(),
        stomObj(),
        duoObj(),
        { id: 'colon', name: 'Jelito grube', pre: { path: COLON_SB, r: CSB_R }, color: '#c98f6b', mucosa: 'haustra', tint: '#eab9a3',
          labels: [L('Kątnica', 0.02, ALL), L('Okrężnica poprzeczna', cst([0.6, -5.6, 3.4]), ALL), L('Okrężnica zstępująca', cst([9.2, -9, -0.8]), ALL), L('Esica', cst([3.0, -24.4, 2.4]), ALL)] },
        { id: 'app', name: 'Wyrostek robaczkowy', pre: { path: APP_SB, r: APP_R }, color: '#c77f8e', mucosa: 'smooth', tint: '#eab9a3' },
        { id: 'p', name: 'Jelito czcze', postName: 'Odcinek proksymalny', pre: SBP_PRE, post: P, morph: [2, 2.9], color: SB_COL2, mucosa: 'circular', tint: MUC.bowel,
          labels: [L('Jelito czcze', 0.3, PRE), L('Odcinek proksymalny', 0.85, POST)] },
        { id: 's', name: 'Odcinek resekowany', pre: SBS_PRE, colors: [[0, SB_COL2], [0.7, COL.spec]], opacity: SPEC_OP, offset: [[1.15, [0, 0, 0]], [1.9, [0, -2, 9]]], mucosa: 'circular', tint: MUC.bowel,
          labels: [L('Odcinek do resekcji', 0.5, [-9, 1.5])] },
        { id: 'd', name: 'Jelito kręte', postName: 'Odcinek dystalny', pre: SBD_PRE, post: D, morph: [2, 2.9], color: SB_COL2, mucosa: 'circular', tint: MUC.bowel,
          labels: [L('Jelito kręte', 0.75, ALL), L('Odcinek dystalny', 0.08, POST)] }
      ],
      marks: marks,
      routePost: route
    };
  }


  /* ---------- Resekcja jelita cienkiego — nowy model (test, obok starego): krezka z unaczynieniem i węzłami chłonnymi ----------
     Krezka jak w jelicie grubym (narzędzie 'meso'): wachlarz od korzenia (od zgięcia dwunastniczo-czczego skośnie w dół na prawo,
     do okolicy krętniczo-kątniczej) do brzegu krezkowego jelita. W korzeniu SMA (przed częścią poziomą dwunastnicy) i SMV;
     tętnice jelita czczego i krętego od SMA łączą się w arkady — ku jelitu krętemu więcej rzędów arkad i krótsze naczynia proste.
     Resekcja: klin krezki (V), wierzchołek przy gałęzi zaopatrującej odcinek (podwiązana); arkady przecięte i podwiązane na brzegach klina;
     klin z naczyniami i węzłami odjeżdża z preparatem. Przy zespoleniu krezka podąża za końcami jelita, brzegi klina schodzą się,
     szczelina krezki zamknięta szwem. Parametry: t — położenie wzdłuż jelita (C_SB2), f — od korzenia (0) do brzegu krezkowego (1). */
  var SBM_ROOT = curveOf([[2.7, -5.4, -0.6], [1.2, -7.8, -1.4], [-0.6, -10.0, -2.4], [-2.4, -12.8, -2.8], [-4.0, -15.6, -2.8], [-5.4, -18.3, -2.4], [-6.2, -19.9, -1.6]]);
  var SBM_SMA = [[1.6, -2.2, -2.9], [1.5, -4.4, -1.8], [1.45, -5.8, -0.4], [1.4, -6.9, -0.35]];
  var SBM_APEX = 0.38, SBM_J = 0.3, SBM_TM = (ra + rb) / 2, SBM_DT = 0.07;
  function sbMesoGeo(kind) {
    var V3 = THREE.Vector3, loc = LOC[kind], tm = SBM_TM;
    var tailC = curveOf([C_SB2.getPointAt(rap).toArray()].concat(loc.tail)), headC = curveOf(loc.head.concat([C_SB2.getPointAt(rbp).toArray()]));
    function sOf(t) { return Math.pow(t, 1.4); } // korzeń krótszy niż jelito: odcinki jelita zawieszone nieco poniżej swojej części korzenia
    function R(t) { return SBM_ROOT.getPointAt(sOf(Math.max(0, Math.min(1, t)))); }
    function bowel(t, post) {
      if (post && t > rap && t <= ra + 1e-9) { var u = (t - rap) / (ra - rap); return [tailC.getPointAt(u), tailC.getTangentAt(u)]; }
      if (post && t >= rb - 1e-9 && t < rbp) { var u2 = (t - rb) / (rbp - rb); return [headC.getPointAt(u2), headC.getTangentAt(u2)]; }
      return [C_SB2.getPointAt(t), C_SB2.getTangentAt(t)];
    }
    function E(t, post) { var b = bowel(t, post), d = R(t).sub(b[0]); d.sub(b[1].multiplyScalar(d.dot(b[1]))).normalize(); return b[0].addScaledVector(d, 0.92); }
    function inW(t) { return t > ra && t < rb; }
    function qOf(t) { return t < tm ? (t - ra) / (tm - ra) : (rb - t) / (rb - tm); } // 0 przy jelicie, 1 przy wierzchołku klina
    function fV(t) { return inW(t) ? 1 - (1 - SBM_APEX) * qOf(t) : 1; }
    var Apex = R(tm).lerp(E(tm, false), SBM_APEX), EaP = E(ra, true), EaD = E(rb, true), J = EaP.clone().lerp(EaD, 0.5).lerp(Apex, SBM_J);
    function Vpre(t) { return R(t).lerp(E(t, false), fV(t)); }
    function Vpost(t) { var q = qOf(t), Ea = t < tm ? EaP : EaD; return q < SBM_J ? Ea.clone().lerp(J, q / SBM_J) : J.clone().lerp(Apex, (q - SBM_J) / (1 - SBM_J)); }
    function cut(t, f) { return inW(t) && f > fV(t) + 1e-9; } // w klinie — usuwane z preparatem
    function X(t, f, post) {
      if (inW(t)) { var fv = fV(t); if (f > fv + 1e-9) return R(t).lerp(E(t, false), f); return R(t).lerp(post ? Vpost(t) : Vpre(t), f / fv); }
      return R(t).lerp(E(t, post), f);
    }
    function arr(v) { return v.toArray(); }
    function moves(a, b) { for (var i = 0; i < a.length; i++) if (Math.abs(a[i][0] - b[i][0]) + Math.abs(a[i][1] - b[i][1]) + Math.abs(a[i][2] - b[i][2]) > 1e-4) return true; return false; }
    function line(tf) { var a = tf.map(function (p) { return arr(X(p[0], p[1], false)); }), b = tf.map(function (p) { return arr(X(p[0], p[1], true)); }); return { pts: a, post: moves(a, b) ? b : null }; }
    function ts(t0, t1, n) { var o = []; for (var i = 0; i <= n; i++) o.push(t0 + (t1 - t0) * i / n); return o; }
    // arkusze: pozostające (z położeniem po zespoleniu), klin usuwany, część krezki pod klinem
    var sheets = [];
    function rowsOf(list, fEdge, fRoot, post) { return list.map(function (t) { return [arr(post ? (fEdge(t) === 'V' ? Vpost(t) : E(t, true)) : (fEdge(t) === 'V' ? Vpre(t) : E(t, false))), arr(fRoot(t, post)), t]; }); }
    function root(t) { return R(t); }
    function edgeE() { return 'E'; }
    function edgeV() { return 'V'; }
    [[0, ra, 64], [rb, 1, 124]].forEach(function (g) {
      var list = ts(g[0], g[1], g[2]), a = rowsOf(list, edgeE, root, false), b = rowsOf(list, edgeE, root, true);
      sheets.push({ rows: a, post: moves(a.map(function (r) { return r[0]; }), b.map(function (r) { return r[0]; })) ? b : null });
    });
    var wl = ts(ra, rb, 24);
    sheets.push({ rows: wl.map(function (t) { return [arr(E(t, false)), arr(Vpre(t)), t]; }), removed: true });
    sheets.push({ rows: wl.map(function (t) { return [arr(Vpre(t)), arr(R(t)), t]; }), post: wl.map(function (t) { return [arr(Vpost(t)), arr(R(t)), t]; }) });
    // SMA i SMV: zstępują przed częścią poziomą dwunastnicy i biegną w korzeniu krezki; końcowa gałąź do okolicy krętniczo-kątniczej
    var V = [], nodes = [], tSma0 = 0.26, rootTs = ts(tSma0, 1, 16);
    var off = new V3(0, 0, 0.32), offV = new V3(-0.5, 0.05, 0.25);
    var smaPts = SBM_SMA.concat(rootTs.map(function (t) { return arr(R(t).add(off)); })).concat([[-7.0, -21.0, -0.5]]);
    var smvPts = SBM_SMA.map(function (p) { return [p[0] - 0.75, p[1] + 0.2, p[2] + 0.1]; }).concat(rootTs.map(function (t) { return arr(R(t).add(offV)); })).concat([[-6.6, -20.0, -1.0]]);
    V.push({ id: 'sma', name: 'SMA — tętnica krezkowa górna', kind: 'a', pts: smaPts, at: 0.42 });
    V.push({ id: 'smv', name: '', kind: 'v', pts: smvPts });
    var C_SMA = curveOf(smaPts);
    function addNode(t, f, g) { var o = { p: arr(X(t, f, false).add(new V3(0, 0, 0.12))), removed: cut(t, f), g: g }, q = arr(X(t, f, true).add(new V3(0, 0, 0.12))); if (moves([o.p], [q])) o.post = q; nodes.push(o); }
    function smaAt(t) { return C_SMA.getPointAt(nearestT(C_SMA, arr(R(t)), 400)); }
    // gałęzie co SBM_DT, jedna dokładnie w środku resekowanego odcinka (zaopatruje go — podwiązana u wierzchołka klina)
    var BR = [];
    for (var k = -6; k <= 12; k++) { var tk = tm + k * SBM_DT; if (tk > 0.03 && tk < 0.985) BR.push(tk); }
    var KNOT = [BR[0] - SBM_DT].concat(BR).concat([BR[BR.length - 1] + SBM_DT]);
    // rzędy arkad: 1. w całym jelicie, 2. od szczytu łuku 1. rzędu za odcinkiem resekowanym, 3. od gałęzi w jelicie krętym; podstawy rzędów zmieniają się płynnie
    var T2 = tm + SBM_DT * 1.5, T3 = tm + SBM_DT * 5;
    function tiers(t) { return t < T2 - 1e-9 ? 1 : t < T3 - 1e-9 ? 2 : 3; }
    function interval(t) { for (var i = 0; i < KNOT.length - 1; i++) if (t <= KNOT[i + 1]) return [i, (t - KNOT[i]) / (KNOT[i + 1] - KNOT[i])]; return [KNOT.length - 2, 1]; }
    // f rzędu arkad i (0, 1, 2) w punkcie t: rząd 1 łuki między gałęziami, rząd 2 przesunięty o pół okresu, rząd 3 jak rząd 1
    function tierF(i, t) {
      if (i >= tiers(t)) return null;
      var fr = interval(t)[1], frI = i === 1 ? (fr + 0.5) % 1 : fr;
      var b = i === 0 ? [0.62 - 0.16 * sm01((t - 0.3) / 0.5), 0.1 - 0.03 * sm01((t - 0.3) / 0.5)] : i === 1 ? [0.7 - 0.08 * sm01((t - 0.45) / 0.35), 0.07 - 0.01 * sm01((t - 0.45) / 0.35)] : [0.76, 0.05];
      return b[0] + b[1] * Math.sin(Math.PI * frI);
    }
    function outerF(t) { var n = tiers(t); return tierF(n - 1, t); }
    // linia złożona z punktów (t, f): dzielona na odcinki usuwane (klin) i pozostające; przy przecięciu podwiązanie po stronie pozostającej
    var arcN = 0;
    function addPath(tf, base) {
      var runs = [], cur = null;
      tf.forEach(function (p) { var c = cut(p[0], p[1]); if (!cur || cur.c !== c) { cur = { c: c, tf: cur ? [cur.tf[cur.tf.length - 1], p] : [p] }; runs.push(cur); } else cur.tf.push(p); });
      runs.forEach(function (r, i) {
        if (r.tf.length < 2) return;
        var L = line(r.tf), o = { id: base.id + (runs.length > 1 ? '-' + i : ''), name: i === 0 || runs.length === 1 ? base.name || '' : '', kind: base.kind, pts: L.pts, at: base.at };
        if (r.c) o.removed = true;
        else if (L.post) o.post = L.post;
        if (!r.c && runs.length > 1) { var d = Math.min(0.4, 0.25 / Math.max(curveOf(L.pts).getLength(), 0.01)); o.tie = i < runs.length - 1 ? 1 - d : d; }
        V.push(o);
      });
    }
    // gałęzie jelitowe: od SMA do pierwszego rzędu arkad
    BR.forEach(function (tk, i) {
      var f1 = tierF(0, tk), O = arr(smaAt(tk)), tf = [[tk, 0.22], [tk, 0.36], [tk, (0.36 + f1) / 2], [tk, f1]];
      var name = Math.abs(tk - (tm - 3 * SBM_DT)) < 1e-6 ? 'Tętnice jelita czczego' : Math.abs(tk - (tm + 6 * SBM_DT)) < 1e-6 ? 'Tętnice jelita krętego' : '';
      var isT = Math.abs(tk - tm) < 1e-6, L0 = line(tf), pts = [O].concat(L0.pts);
      if (isT) { // gałąź zaopatrująca: podwiązana u wierzchołka klina, dalsza część z preparatem
        var Ltop = line([[tk, 0.22], [tk, 0.32], [tk, SBM_APEX]]);
        V.push({ id: 'br' + i, name: 'Gałąź zaopatrująca odcinek', kind: 'a', pts: [O].concat(Ltop.pts), tie: 0.93, at: 0.45 });
        V.push({ id: 'br' + i + 'c', name: '', kind: 'a', pts: line([[tk, SBM_APEX], [tk, (SBM_APEX + f1) / 2], [tk, f1]]).pts, removed: true });
      } else V.push({ id: 'br' + i, name: name, kind: 'a', pts: pts, post: L0.post ? [O].concat(L0.post) : null, at: 0.5 });
      [[0.2, 0.01, 'pos'], [0.55, -0.006, 'pj']].concat(isT ? [[0.68, 0.012, 'pj'], [0.7, -0.014, 'pj']] : []).forEach(function (q) { addNode(tk + q[1], q[0], q[2]); });
    });
    // węzły przy korzeniu (centralne)
    [0.3, 0.55, 0.8].forEach(function (t) { nodes.push({ p: arr(R(t).add(new V3(0.35, 0.3, 0.55))), removed: false, g: 'cen' }); });
    // arkady (rzędy), połączenia między rzędami, naczynia proste
    var tAll = ts(0.004, 0.996, 600);
    [0, 1, 2].forEach(function (i) {
      var run = [];
      function flush() { if (run.length > 1) addPath(run, { id: 'arc' + i + '_' + (arcN++), name: i === 0 && arcN === 1 ? 'Arkady naczyniowe' : '', kind: 'm', at: 0.18 }); run = []; }
      tAll.forEach(function (t) { var f = tierF(i, t); if (f == null) flush(); else run.push([t, f]); });
      flush();
    });
    var conK = [], conR = [], conKp = [], vrK = [], vrR = [], vrKp = [];
    KNOT.slice(1, -1).forEach(function (tk, i) {
      // połączenie rzędu 1 → 2 w szczycie łuku rzędu 1 (pół drogi do następnej gałęzi) i rzędu 2 → 3 przy gałęzi
      [[tk + SBM_DT / 2, 0, 1], [tk, 1, 2]].forEach(function (c) {
        var t = c[0], a = tierF(c[1], t), b = tierF(c[2], t); if (a == null || b == null || t >= 0.996) return;
        var tf = [[t, a], [t, b]], L = line(tf);
        if (cut(t, a) || cut(t, b)) conR.push(L.pts); else { conK.push(L.pts); conKp.push(L.post || L.pts); }
      });
    });
    ts(0.006, 0.994, 150).forEach(function (t) {
      var f0 = outerF(t), tf = [[t, f0], [t, (f0 + 0.985) / 2], [t, 0.985]], L = line(tf);
      if (cut(t, f0)) vrR.push(L.pts);
      else if (cut(t, 0.985)) { // naczynie proste na brzegu klina: część przy jelicie z preparatem
        var fv = fV(t), L1 = line([[t, f0], [t, fv]]), L2 = line([[t, fv], [t, 0.985]]); vrK.push(L1.pts); vrKp.push(L1.post || L1.pts); vrR.push(L2.pts);
      } else { vrK.push(L.pts); vrKp.push(L.post || L.pts); }
    });
    V.push({ id: 'con', name: '', kind: 'm', segs: conK, segsPost: conKp });
    if (conR.length) V.push({ id: 'conR', name: '', kind: 'm', segs: conR, removed: true });
    var vrLab = vrK.reduce(function (best, s, i) { return Math.abs(s[0][1] + 15.0) + Math.abs(s[0][0] - 3.0) < best[0] ? [Math.abs(s[0][1] + 15.0) + Math.abs(s[0][0] - 3.0), i] : best; }, [1e9, 0])[1];
    V.push({ id: 'vr', name: 'Naczynia proste (vasa recta)', kind: 'r', segs: vrK, segsPost: vrKp, pts: vrK[vrLab], at: 0.6 });
    V.push({ id: 'vrR', name: '', kind: 'r', segs: vrR, removed: true });
    // linia przecięcia krezki (V) i szew zamykający szczelinę krezki
    var vLine = ts(ra, rb, 16).map(function (t) { return arr(Vpre(t).add(new V3(0, 0, 0.06))); });
    var closure = ts(kind === 'e2e' ? 0.06 : 0, 0.96, 10).map(function (u) { return arr((kind === 'e2e' ? EaP.clone().lerp(Apex, u) : J.clone().lerp(Apex, u)).add(new V3(0, 0, 0.08))); });
    // grupy opisowe (jelito cienkie nie ma przyjętej numeracji stacji węzłowych)
    var groups = nodeGroups(nodes, { pj: ['Węzły przyjelitowe', 'przy arkadach i naczyniach prostych'], pos: ['Węzły pośrednie', 'wzdłuż tętnic jelita czczego i krętego'], cen: ['Węzły centralne', 'u korzenia krezki, wzdłuż SMA'] }, 'opis');
    var tool = { type: 'meso', sag: 0, sheets: sheets, vessels: V, nodes: nodes, groups: groups, name: 'Krezka jelita cienkiego', sub: 'klin usuwany z odcinkiem',
      labels: [{ name: 'Korzeń krezki', sub: 'od zgięcia dwunastniczo-czczego do okolicy krętniczo-kątniczej', p: arr(R(0.62).add(new V3(0.2, 0, 0.3))) }],
      offset: [[2.15, [0, 0, 0]], [2.9, [0, -2, 9]]], opacity: [[2.55, 1], [2.9, 0]], tieT: 1.25, morph: [3, 3.9], cutTint: [[0.2, '#e8c25e'], [0.8, '#ec8f4c']] };
    return { tool: tool, vLine: vLine, closure: closure };
  }
  var SBM_NOTES = [
    'Krezka: wachlarz od korzenia (skośnie od zgięcia dwunastniczo-czczego do okolicy prawego stawu krzyżowo-biodrowego) do brzegu krezkowego jelita; w korzeniu tętnica i żyła krezkowa górna (SMA, SMV).',
    'Tętnice jelita czczego i krętego od SMA łączą się w arkady; w jelicie czczym 1–2 rzędy arkad i długie naczynia proste, w jelicie krętym 3–5 rzędów i krótkie naczynia proste (w modelu uproszczone).',
    'Z odcinkiem usuwa się klin krezki (V): arkady przecięte i podwiązane na brzegach klina, gałąź zaopatrująca odcinek podwiązana u wierzchołka. Przy zmianie łagodnej klin może być płytki, przy jelicie; przy nowotworze sięga głębiej, z węzłami chłonnymi.',
    'Po zespoleniu szczelinę w krezce zwykle zamyka się szwem, aby zapobiec przepuklinie wewnętrznej.'
  ];
  function sbmAnat(kind) {
    var an = sbAnat(kind), G = sbMesoGeo(kind), base = an.id;
    an.anastId = base; an.id = base.replace('sb-', 'sbm-'); an.sbMeso = G.tool;
    an.focus = { t: [0.5, -10.6, 0.4], k: 0.34, az: 10, el: 20 }; // bliżej i nieco z góry: klin krezki nad resekowanym odcinkiem (odcinek półprzezroczysty)
    an.notes = an.notes.concat(SBM_NOTES);
    an.text = { normal: ['Anatomia prawidłowa', 'Jelito cienkie od więzadła Treitza do zastawki krętniczo-kątniczej, zawieszone na krezce; w korzeniu krezki naczynia krezkowe górne, w krezce arkady naczyniowe i węzły chłonne. Wokół rama jelita grubego.'],
      top: an.text.top };
    var fx = an.frames;
    an.frames = {
      resect: ['Zakres resekcji', 'Odcinek jelita cienkiego z klinem krezki (V); wierzchołek klina przy gałęzi zaopatrującej odcinek. Arkady, naczynia proste i węzły w obrębie klina usuwane z preparatem.', 'Zakres resekcji'],
      remove: ['Usunięcie odcinka', 'Odcinek usunięty z klinem krezki; arkady podwiązane na brzegach klina, gałąź zaopatrująca u wierzchołka. Pozostają koniec proksymalny i dystalny.', 'Usunięcie'],
      recon: [fx.recon[0], fx.recon[1] + ' Brzegi krezki zbliżone, szczelina krezki zamknięta szwem.', fx.recon[2]],
      post: fx.post + ' Szczelina krezki zamknięta.', endoPost: fx.endoPost
    };
    an.marks = an.marks.concat([
      { kind: 'line', name: 'Linia przecięcia krezki', color: COL.cut, noStapler: true, opacity: [[0.05, 0], [0.55, 1], [1.15, 1], [1.4, 0]], pts: G.vLine },
      { kind: 'line', name: 'Zamknięcie szczeliny krezki', color: SUT2, opacity: ANAST_OP, pts: G.closure }
    ]);
    return an;
  }
