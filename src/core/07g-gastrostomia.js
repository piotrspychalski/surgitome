  /* =====================================================================
     DOSTĘP ŻYWIENIOWY: gastrostomia (PEG metodą „pull” Ponsky’ego–Gauderera; Stamm) i jejunostomia odżywcza sposobem Witzla.
     Powłoki — wspólny model ANAT.BODY (układ jelita grubego zgodny z układem żołądka). Żołądek / pętla jelita czczego przyciągnięte do powłok
     (morph); zgłębnik jako obiekt bez światła (noEndo), zderzak wewnętrzny i płytka zewnętrzna jako znaczniki stomii (widoczne też w endoskopii).
     Źródła: Gauderer, Ponsky, Izant, J Pediatr Surg 1980 (PEG); ESPEN — wytyczne żywienia dojelitowego (Bischoff i wsp., Clin Nutr 2020);
     ESGE 2021 (Arvanitakis i wsp., Endoscopy 2021) — PEG; Stamm 1894; Witzel 1891.
     ===================================================================== */
  var GS = [3.4, 2.2], GS_Z = BODY.z(GS[0], GS[1]), TUBE_C = '#ece6d6';
  // żołądek przyciągnięty do powłok: przednia ściana w miejscu zgłębnika dotyka otrzewnej ściennej (ok. 1 jednostkę pod skórą)
  function pullTo(curve, rFn, site, sz, sy, n) {
    var tS = nearestT(curve, [site[0], site[1], 0.5]), P = curve.getPointAt(tS), up = new THREE.Vector3(0, 0, 1), T = curve.getTangentAt(tS);
    up.sub(T.clone().multiplyScalar(up.dot(T))).normalize();
    var wall = P.clone().addScaledVector(up, rFn(tS)), dz = sz - 1.0 - wall.z, dxy = [site[0] - wall.x, site[1] - wall.y], pts = [];
    for (var i = 0; i <= n; i++) {
      var t = i / n, p = curve.getPointAt(t), w = Math.exp(-Math.pow(curve.getLength() * (t - tS) / sy, 2));
      pts.push([p.x + dxy[0] * w * 0.9, p.y + dxy[1] * w * 0.9, p.z + dz * w]);
    }
    var C2 = curveOf(pts), t2 = nearestT(C2, [site[0], site[1], sz]);
    return { path: pts, inner: [site[0], site[1], sz - 1.0 - 0.25], outer: [site[0], site[1], sz - 1.0], tS: tS, t2: t2 };
  }
  function ring2(c, r, z0, name, op, col) {   // okrąg na powierzchni (szew kapciuchowy, gastropeksja)
    var pts = []; for (var i = 0; i < 28; i++) { var a = i / 28 * Math.PI * 2; pts.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), z0]); }
    return { kind: 'loop', name: name, color: col || SUT, opacity: op, dash: 0.2, pts: pts };
  }
  function gstomAnat(peg) {
    var S = pullTo(C.STOM, STOMACH_R, GS, GS_Z, 3.2, 48), MO = peg ? [0.3, 0.9] : [1.15, 1.8];
    var tubeOut = [[GS[0] + 1.2, GS[1] - 2.6, GS_Z + 1.0], [GS[0] + 0.3, GS[1] - 0.6, GS_Z + 1.1], [GS[0], GS[1], GS_Z + 0.6], [GS[0], GS[1], GS_Z - 0.5], S.inner];
    var TOP = peg ? [[1.5, 0], [1.75, 1]] : [[1.8, 0], [1.9, 1]];
    var pre0 = (function () { var P = C.STOM.getPointAt(S.tS), T = C.STOM.getTangentAt(S.tS), up = new THREE.Vector3(0, 0, 1); up.sub(T.multiplyScalar(up.dot(T))).normalize(); return P.addScaledVector(up, STOMACH_R(S.tS) + 0.05); })();
    var marks = [{ kind: 'body', name: 'Powłoki brzuszne', holes: [{ c: GS, rx: 0.3, ry: 0.3 }], opacity: [[-0.03, 0], [0, 1]] },
      { kind: 'stoma', name: peg ? 'Zderzak wewnętrzny' : 'Balon zgłębnika', color: TUBE_C, center: [GS[0], GS[1], S.inner[2] - 0.15], rx: peg ? 0.75 : 0.55, ry: peg ? 0.75 : 0.55, opacity: TOP },
      { kind: 'stoma', name: 'Płytka zewnętrzna', color: TUBE_C, center: [GS[0], GS[1], GS_Z + 0.18], rx: 0.85, ry: 0.85, opacity: TOP }];
    if (peg) marks.push(
      ring2(GS, 0.9, GS_Z + 0.06, 'Diafanoskopia — światło gastroskopu widoczne przez powłoki', [[0.15, 0], [0.35, 1], [0.9, 1], [1.05, 0]], '#f2c94c'),
      { kind: 'line', name: 'Nakłucie igłą przez powłoki do żołądka, prowadnica', color: COL.cut, noStapler: true, opacity: [[0.55, 0], [0.7, 1], [1.2, 1], [1.4, 0]],
        pts: [[GS[0], GS[1], GS_Z + 0.8], [GS[0], GS[1], GS_Z - 0.4], S.inner] });
    else marks.push(
      ring2([pre0.x, pre0.y], 0.55, pre0.z + 0.05, 'Dwa szwy kapciuchowe na przedniej ścianie żołądka', [[0.3, 0], [0.6, 1], [1.1, 1], [1.2, 0]]),
      ring2([pre0.x, pre0.y], 0.95, pre0.z - 0.05, '', [[0.3, 0], [0.6, 1], [1.1, 1], [1.2, 0]]),
      ring2(GS, 0.55, S.outer[2] - 0.05, 'Szwy kapciuchowe zawiązane wokół zgłębnika', [[1.8, 0], [1.9, 1]]),
      ring2(GS, 1.3, S.outer[2] + 0.12, 'Gastropeksja — żołądek przyszyty do otrzewnej ściennej', [[1.8, 0], [1.9, 1]], '#7457c9'));
    return {
      cat: 'upper', id: peg ? 'gstom-peg' : 'gstom-stamm', short: 'Gastrostomia', title: peg ? 'Przezskórna gastrostomia endoskopowa (PEG)' : 'Gastrostomia sposobem Stamma',
      sub: peg ? 'Metoda „pull” (Ponsky–Gauderer): zgłębnik przeciągnięty przez usta i przełyk, wyprowadzony przez powłoki; zderzak wewnętrzny przy przedniej ścianie żołądka'
        : 'Gastrostomia chirurgiczna (otwarta lub laparoskopowa): zgłębnik w szwach kapciuchowych, żołądek przyszyty do powłok',
      notes: (peg ? [
        'Wskazanie: długotrwałe żywienie dojelitowe (zwykle dłużej niż 4–6 tygodni) przy zachowanej czynności przewodu pokarmowego, gdy doustne nie wystarcza — np. zaburzenia połykania po udarze, choroby nerwowo-mięśniowe, nowotwory głowy i szyi lub przełyku.',
        'Gastroskopia z insuflacją: przednia ściana żołądka przylega do powłok. Miejsce wkłucia wyznacza diafanoskopia (światło endoskopu widoczne przez skórę) i ucisk palcem widoczny w żołądku; brak obu — wskazanie do innej metody (np. pod kontrolą obrazowania).',
        'Igła i prowadnica przez powłoki do żołądka; prowadnicę chwyta pętla endoskopu i wyciąga przez usta. Zgłębnik przywiązany do prowadnicy przeciąga się przez przełyk i żołądek na zewnątrz, aż zderzak wewnętrzny oprze się o ścianę żołądka.',
        'Płytka zewnętrzna bez nadmiernego ucisku (zapobiega martwicy i wrastaniu zderzaka — „buried bumper”). Odmiana „push” i metoda przez powłoki z gastropeksją (introducer) — np. przy zwężeniu przełyku lub nowotworze głowy i szyi (ryzyko wszczepienia komórek na kanale).'
      ] : [
        'Gastrostomia chirurgiczna: gdy PEG jest niemożliwa (np. niedrożny przełyk lub gardło, brak diafanoskopii) albo przy innej operacji brzusznej; także laparoskopowo.',
        'Na przedniej ścianie trzonu dwa współśrodkowe szwy kapciuchowe; w ich środku nacięcie ściany (gastrotomia) i zgłębnik z balonem (lub typu Malecot) wprowadzony do żołądka przez osobne nacięcie powłok.',
        'Szwy kapciuchowe zawiązane kolejno — ściana żołądka wpukla się wokół zgłębnika (kanał wyścielony błoną surowiczą); żołądek przyszyty do otrzewnej ściennej wokół zgłębnika (gastropeksja) — zapobiega przeciekowi do jamy otrzewnej.',
        'Odmiany: gastrostomia Witzla (kanał w ścianie żołądka), Janewaya (rurka z płata ściany — stała przetoka bez zgłębnika).'
      ]).concat(['Po wygojeniu kanału (kilka tygodni) zgłębnik można wymienić na niskoprofilowy (z balonem).']),
      focus: { t: [2.6, 1.6, 2.6], k: 0.62 },
      text: { normal: ['Żołądek i przednia ściana brzucha', 'Żołądek pod lewym łukiem żebrowym; miejsce zgłębnika — przednia ściana trzonu, w lewym nadbrzuszu.'] },
      frames: peg ? {
        resect: ['Diafanoskopia i nakłucie', 'Gastroskop w żołądku, insuflacja — przednia ściana przylega do powłok; światło endoskopu widoczne przez skórę wyznacza miejsce; nakłucie igłą, prowadnica do żołądka i pętla endoskopu.', 'Nakłucie'],
        remove: ['Przeciągnięcie zgłębnika', 'Prowadnica wyciągnięta przez usta; zgłębnik przywiązany do niej przeciągnięty przez przełyk i żołądek i wyprowadzony przez powłoki; zderzak wewnętrzny opiera się o ścianę żołądka.', 'Zgłębnik'],
        post: 'Zgłębnik PEG: zderzak wewnętrzny przy przedniej ścianie żołądka, płytka zewnętrzna na skórze; żołądek przylega do powłok.',
        endoPost: 'Gastroskopia: na przedniej ścianie trzonu zderzak wewnętrzny zgłębnika.'
      } : {
        resect: ['Szwy kapciuchowe i gastrotomia', 'Mała laparotomia w nadbrzuszu (lub laparoskopia); na przedniej ścianie trzonu dwa współśrodkowe szwy kapciuchowe, w środku nacięcie ściany.', 'Szwy'],
        remove: ['Zgłębnik i gastropeksja', 'Zgłębnik wprowadzony przez osobne nacięcie powłok do żołądka, balon wypełniony; szwy kapciuchowe zawiązane, żołądek przyszyty do otrzewnej ściennej wokół zgłębnika.', 'Gastropeksja'],
        post: 'Zgłębnik gastrostomijny: balon w żołądku, ściana żołądka wpuklona wokół zgłębnika i przyszyta do powłok.',
        endoPost: 'Gastroskopia: na przedniej ścianie trzonu wpuklenie ze zgłębnikiem i balonem.'
      },
      endoTitles: ['Gastroskopia', 'Gastroskopia po założeniu gastrostomii'],
      objects: [eso(),
        { id: 'stom', name: 'Żołądek', pre: { path: STOMACH, r: STOMACH_R }, post: { path: S.path, r: STOMACH_R }, morph: MO, color: COL.stomach, mucosa: 'rugae', tint: MUC.stomach, labels: [L('Żołądek', 0.35, ALL)] },
        duoObj(), jejObj(),
        { id: 'tube', name: peg ? 'Zgłębnik PEG' : 'Zgłębnik gastrostomijny', noEndo: true, pre: { path: tubeOut, r: flat(0.17) }, color: TUBE_C, mucosa: 'smooth', tint: TUBE_C, opacity: TOP,
          labels: [L(peg ? 'Zgłębnik PEG' : 'Zgłębnik gastrostomijny', 0.15, [peg ? 1.75 : 1.9, 99])] }],
      marks: marks,
      routePost: [{ obj: 'eso' }, { obj: 'stom', from: GEJ_IN, to: S.t2, note: peg ? 'Żołądek — zderzak wewnętrzny PEG na przedniej ścianie' : 'Żołądek — zgłębnik z balonem na przedniej ścianie' }],
      endTarget: { post: [GS[0], GS[1], S.inner[2] - 0.2] }, endText: { post: peg ? 'Zderzak wewnętrzny zgłębnika PEG' : 'Balon zgłębnika gastrostomijnego' }
    };
  }
  /* ---------- Jejunostomia odżywcza sposobem Witzla: pętla ok. 20–30 cm za więzadłem Treitza przy powłokach w lewym śródbrzuszu, zgłębnik w świetle
     skierowany dystalnie, kanał surowiczo-mięśniowy nad zgłębnikiem (szwy Lemberta), jejunopeksja. ---------- */
  var WS = [5.6, -5.0], WS_Z = BODY.z(WS[0], WS[1]);
  var WITZ = (function () {
    var J = pullTo(C.JEJ, flat(1.0), WS, WS_Z, 2.6, 60), CJ = curveOf(J.path), tE = J.t2, P = CJ.getPointAt(tE), T = CJ.getTangentAt(tE);
    var up = new THREE.Vector3(0, 0, 1); up.sub(T.clone().multiplyScalar(up.dot(T))).normalize();
    function on(dt, k) { var t = Math.max(0, Math.min(1, tE + dt)); return CJ.getPointAt(t).addScaledVector(up, 1.0 * (k == null ? 1.02 : k)).toArray(); }
    // zgłębnik: z zewnątrz przez powłoki, wzdłuż ściany jelita (pod kanałem), do światła i dystalnie
    var tube = [[WS[0] + 1.4, WS[1] - 2.2, WS_Z + 1.0], [WS[0] + 0.3, WS[1] - 0.5, WS_Z + 1.0], [WS[0], WS[1], WS_Z + 0.5], [WS[0], WS[1], WS_Z - 0.6], on(0.006, 1.15), on(0.025, 1.12), on(0.04, 0.6), on(0.05, 0), on(0.08, -0.1), on(0.11, 0)];
    var tun = []; for (var i = 0; i <= 8; i++) tun.push(on(0.006 + 0.034 * i / 8, 1.25));
    return {
      cat: 'sb', id: 'witzel', short: 'Jejunostomia odżywcza (Witzel)', title: 'Jejunostomia odżywcza sposobem Witzla',
      sub: 'Zgłębnik w świetle jelita czczego ok. 20–30 cm za więzadłem Treitza, w kanale surowiczo-mięśniowym; pętla przyszyta do powłok',
      notes: ['Wskazania: żywienie do jelita, gdy żołądek nie nadaje się do żywienia lub jest omijany — np. po resekcji przełyku lub gastrektomii (często zakładana podczas tej operacji), niedrożność odźwiernika, ciężka gastropareza, ryzyko zachłyśnięcia.',
        'Pętla jelita czczego ok. 20–30 cm za więzadłem Treitza; zgłębnik wprowadzony przez małe nacięcie na brzegu przeciwkrezkowym (w szwie kapciuchowym) i skierowany dystalnie.',
        'Kanał Witzla: na odcinku 4–5 cm ściana jelita zszyta nad zgłębnikiem szwami surowiczo-mięśniowymi (Lemberta) — kanał zamyka się po usunięciu zgłębnika.',
        'Pętla przyszyta do otrzewnej ściennej wokół wyjścia zgłębnika i nieco dystalnie (zapobiega skręceniu i przeciekowi). Alternatywa: jejunostomia igłowa z cewnikiem (needle catheter jejunostomy).',
        'Powikłania: przemieszczenie lub niedrożność zgłębnika, przeciek, niedrożność lub skręt jelita przy pętli przyszytej do powłok.'],
      focus: { t: [4.6, -4.6, 2.6], k: 0.66 },
      text: { normal: ['Jelito czcze i przednia ściana brzucha', 'Pętla jelita czczego za więzadłem Treitza; miejsce zgłębnika w lewym śródbrzuszu, bocznie od mięśnia prostego.'] },
      frames: {
        resect: ['Wybór pętli', 'Pętla jelita czczego ok. 20–30 cm za więzadłem Treitza; na brzegu przeciwkrezkowym szew kapciuchowy i małe nacięcie.', 'Wybór pętli'],
        remove: ['Zgłębnik, kanał Witzla i jejunopeksja', 'Zgłębnik przez osobne nacięcie powłok do światła jelita, skierowany dystalnie; nad zgłębnikiem kanał surowiczo-mięśniowy (4–5 cm); pętla przyszyta do otrzewnej ściennej.', 'Kanał Witzla'],
        post: 'Zgłębnik jejunostomijny w kanale Witzla; pętla jelita czczego przyszyta do powłok w lewym śródbrzuszu.',
        endoPost: 'Enteroskopia: przez żołądek i dwunastnicę do jelita czczego, do miejsca wprowadzenia zgłębnika.'
      },
      endoTitles: ['Gastroskopia i enteroskopia', 'Enteroskopia po jejunostomii'],
      objects: [eso(), stomObj(), duoObj(),
        { id: 'jej', name: 'Jelito czcze', pre: { path: JEJ, r: flat(1.0) }, post: { path: J.path, r: flat(1.0) }, morph: [1.15, 1.8], color: COL.bowel, mucosa: 'circular', tint: MUC.bowel, labels: [L('Jelito czcze', 0.35, ALL)] },
        { id: 'tube', name: 'Zgłębnik jejunostomijny', noEndo: true, pre: { path: tube, r: flat(0.12) }, color: TUBE_C, mucosa: 'smooth', tint: TUBE_C, opacity: [[1.8, 0], [1.9, 1]],
          labels: [L('Zgłębnik jejunostomijny', 0.12, [1.9, 99])] }],
      marks: [{ kind: 'body', name: 'Powłoki brzuszne', holes: [{ c: WS, rx: 0.25, ry: 0.25 }], opacity: [[-0.03, 0], [0, 1]] },
        ringOn(C.JEJ, flat(1.0), J.tS, { name: 'Pętla ok. 20–30 cm za więzadłem Treitza', color: COL.mark, opacity: [[0.05, 0], [0.55, 1], [1.1, 1], [1.2, 0]] }),
        { kind: 'line', name: 'Kanał Witzla — szwy surowiczo-mięśniowe nad zgłębnikiem', color: SUT, opacity: [[1.85, 0], [1.95, 1]], dash: 0.12, pts: tun },
        ring2(WS, 1.3, J.outer[2] + 0.12, 'Jejunopeksja — pętla przyszyta do otrzewnej ściennej', [[1.85, 0], [1.95, 1]]),
        { kind: 'stoma', name: 'Płytka zewnętrzna', color: TUBE_C, center: [WS[0], WS[1], WS_Z + 0.15], rx: 0.6, ry: 0.6, opacity: [[1.8, 0], [1.9, 1]] }],
      routePost: [{ obj: 'eso' }, { obj: 'stom', from: GEJ_IN, note: 'Żołądek' }, { obj: 'duo', note: 'Dwunastnica' }, { obj: 'jej', from: 0, to: tE + 0.045, note: 'Jelito czcze do miejsca wprowadzenia zgłębnika' }],
      endTarget: { post: CJ.getPointAt(tE + 0.04).toArray() }, endText: { post: 'Miejsce wprowadzenia zgłębnika' }
    };
  })();
