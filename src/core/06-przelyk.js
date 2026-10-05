  /* =====================================================================
     PRZEŁYK — esofagektomia: Ivor Lewis, McKeown, przezrozworowa, Akiyama, interpozycja okrężnicy
     ===================================================================== */
  var ESO_F = [[-0.2, 27.5, -2.4], [-0.1, 24, -2.8], [0.0, 21, -3.2], [0.2, 18, -3.3], [0.3, 16, -3.0], [0.4, 13, -2.6], [0.7, 10, -1.8], [1.2, 8, -0.8], [1.6, 7, -0.2]];
  var C_ESOF = curveOf(ESO_F), ESOF_R = profile([[0, 0.8], [0.9, 0.8], [1, 0.9]]);
  var tNeckE = nearestT(C_ESOF, [0.0, 22.0, -3.05]), tIL = nearestT(C_ESOF, [0.25, 17.4, -3.25]);
  var TRACH = [[-0.2, 27.8, -0.5], [-0.2, 24, -0.8], [-0.1, 20.5, -1.2], [0, 17.6, -1.4]];
  var BR_R = [[0, 17.6, -1.4], [-1.3, 16.6, -1.5], [-2.8, 15.6, -1.4]], BR_L = [[0, 17.6, -1.4], [1.3, 16.4, -1.7], [2.8, 15.2, -1.9]];
  var AORTA = [[1.0, 11.4, 1.6], [0.9, 14.8, 1.2], [1.2, 17.4, 0.4], [2.0, 18.2, -1.0], [2.6, 17.2, -2.6], [2.5, 14, -3.7], [2.3, 10, -4.0], [1.6, 6, -4.2]];
  var HEART = [[0.8, 13.8, 1.7], [1.2, 11.4, 1.9], [1.6, 9.0, 1.7]], HEART_R = profile([[0, 0.3], [0.2, 2.0], [0.5, 2.3], [0.8, 2.0], [1, 0.3]]);
  var CONDUIT_R = profile([[0, 0.6], [0.03, 1.05], [0.85, 1.15], [0.97, 0.75], [1, 0.6]]);
  var TUBE_R = profile([[0, 0.55], [0.03, 0.8], [0.85, 0.85], [0.97, 0.7], [1, 0.6]]);
  var CON_PM = [[0.2, 21.6, -3.2], [0.25, 19.8, -3.35], [0.35, 17, -3.3], [0.5, 13.5, -2.9], [0.8, 10, -2.0], [1.4, 7.6, -0.9], [2.3, 5.0, 0.3], [2.7, 2.5, 0.9], [1.0, 0.9, 1.2], [-0.4, 0.4, 1.1], [-1.6, 0.2, 1.0]];
  var CON_IL = [[0.45, 17.0, -3.2], [0.5, 13.5, -2.9], [0.8, 10, -2.0], [1.4, 7.6, -0.9], [2.3, 5.0, 0.3], [2.7, 2.5, 0.9], [1.0, 0.9, 1.2], [-0.4, 0.4, 1.1], [-1.6, 0.2, 1.0]];
  var CON_RS = [[0.5, 21.8, -3.0], [2.3, 21.7, -1.9], [2.2, 21.2, 0.4], [1.6, 20.4, 3.0], [0.9, 19.0, 5.2], [0.5, 16, 5.9], [0.5, 12, 6.0], [0.7, 9.2, 5.5], [1.4, 7, 4.4], [2.5, 4.6, 2.8], [2.8, 2.4, 1.6], [0.8, 0.9, 1.3], [-0.4, 0.4, 1.1], [-1.6, 0.2, 1.0]];
  var GRAFT = [[0.5, 21.8, -3.0], [2.3, 21.7, -1.9], [2.2, 21.2, 0.4], [1.6, 20.4, 3.0], [0.9, 19.0, 5.2], [0.5, 16, 5.9], [0.5, 12, 6.0], [0.7, 9.2, 5.6], [1.6, 6.8, 5.0], [3.0, 4.4, 4.2], [3.8, 2.2, 3.2], [3.9, 1.2, 2.4]];
  // rura żołądkowa: pas krzywizny większej (bez wpustu, krzywizny mniejszej i przyśrodkowej części dna)
  var STOM_C0 = (function () { var v = new THREE.Vector3(); STOMACH.forEach(function (p) { v.add(V(p)); }); return v.multiplyScalar(1 / STOMACH.length); })();
  function conduitPre(w) { // w: promień rury; przesunięcie osi ku krzywiźnie większej, przy odźwierniku zanika
    var out = [], lesser = [];
    for (var i = 0; i <= 18; i++) {
      var t = 0.1 + 0.9 * i / 18, p = C.STOM.getPointAt(t), T = C.STOM.getTangentAt(t), g = p.clone().sub(STOM_C0); g.sub(T.clone().multiplyScalar(g.dot(T))).normalize();
      var R = STOMACH_R(t), k = t < 0.72 ? 1 : Math.max(0, 1 - (t - 0.72) / 0.28), off = Math.max(0, R - w) * k;
      out.push(p.clone().addScaledVector(g, off).toArray());
      if (t <= 0.8) { var a = new THREE.Vector3(0, 0, 1); a.sub(T.clone().multiplyScalar(a.dot(T))).normalize(); var u = t < 0.76 ? off - w : -R * 0.9;
        lesser.push(p.clone().addScaledVector(g, u).addScaledVector(a, Math.sqrt(Math.max(0.05, R * R - u * u)) + 0.04).toArray()); }
    }
    return { path: out, line: lesser };
  }
  var CPRE = conduitPre(1.15), CPRE_T = conduitPre(0.85);
  var tC0 = cst([0.6, -5.6, 3.4]), tC1 = cst([9.1, -3.5, -0.8]);
  var COL_L_POST = [[1.3, -6.0, 3.2], [4.0, -6.8, 2.2], [7.0, -7.4, 0.6]].concat(sub(C_CSB, CSB_R, cst([9.2, -9, -0.8]), 1, 40).path);
  var ORG = { trach: '#b9c4cc', aorta: '#c0392b', heart: '#b0504c', stern: '#e6dfcb', vein: '#3f5f9c' };
  // żyła nieparzysta: wzdłuż kręgosłupa po prawej, łukiem nad oskrzelem głównym prawym do żyły głównej górnej (poniżej zespolenia Ivora Lewisa)
  var AZYGOS = [[-0.9, 8.0, -4.3], [-1.0, 12.0, -4.4], [-1.1, 15.0, -4.2], [-1.35, 16.4, -3.7], [-1.75, 17.15, -2.45], [-2.2, 17.2, -1.1], [-2.3, 16.6, 0.2]];
  var SVC = [[-2.3, 21.5, 0.5], [-2.3, 19.0, 0.4], [-2.25, 16.6, 0.45], [-1.8, 14.3, 1.0]];
  // zespolenie bok-do-boku (stapler liniowy): rura po prawej stronie przełyku, ślepy kikut przełyku odchodzi w lewo-do przodu
  var SS = {
    il: { con: [[-1.25, 22.2, -3.3], [-1.2, 21.0, -3.35], [-1.15, 19.8, -3.4], [-0.8, 18.6, -3.45], [0.1, 17.4, -3.35], [0.35, 15.5, -3.1]].concat(CON_IL.slice(1)),
      cut: [0.1, 18.6, -3.3], bed: 20.0, stump: [[0.6, 19.6, -3.0], [1.1, 19.3, -2.7]], ov: [21.8, 20.2], at: [-0.6, 21.0, -3.3] },
    mck: { con: [[-1.3, 26.0, -3.0], [-1.3, 24.8, -3.0], [-1.25, 23.4, -3.05], [-0.8, 22.1, -3.2], [0.15, 20.9, -3.3], [0.25, 19.8, -3.35]].concat(CON_PM.slice(2)),
      cut: [0.0, 22.2, -3.05], bed: 23.2, stump: [[0.8, 22.9, -2.6], [1.15, 22.6, -2.4]], ov: [25.2, 23.6], at: [-0.65, 24.4, -2.95] }
  };
  function esoContext() {
    return [
      { id: 'trach', name: 'Tchawica', pre: { path: TRACH, r: flat(0.75) }, color: ORG.trach, mucosa: 'smooth', tint: '#d7c9c4', labels: [L('Tchawica', 0.25, ALL)] },
      { id: 'brR', name: 'Oskrzele główne prawe', pre: { path: BR_R, r: flat(0.55) }, color: ORG.trach, mucosa: 'smooth', tint: '#d7c9c4' },
      { id: 'brL', name: 'Oskrzele główne lewe', pre: { path: BR_L, r: flat(0.55) }, color: ORG.trach, mucosa: 'smooth', tint: '#d7c9c4' },
      { id: 'aorta', name: 'Aorta', organ: true, hu: 190, pre: { path: AORTA, r: flat(0.8) }, color: ORG.aorta, labels: [L('Łuk aorty', 0.4, ALL)] },
      { id: 'heart', name: 'Serce', organ: true, hu: 110, pre: { path: HEART, r: HEART_R }, color: ORG.heart, labels: [L('Serce', 0.5, ALL)] },
      { id: 'azy', name: 'Żyła nieparzysta', organ: true, hu: 150, pre: { path: AZYGOS, r: flat(0.36) }, color: ORG.vein, labels: [L('Żyła nieparzysta', 0.72, ALL, 'łuk nad oskrzelem prawym')] },
      { id: 'svc', name: 'Żyła główna górna', organ: true, hu: 150, pre: { path: SVC, r: flat(0.62) }, color: ORG.vein, labels: [L('Żyła główna górna', 0.35, ALL)] },
      duoObj()
    ];
  }
  var ESO_TXT = {
    il: { short: 'Ivor Lewis', title: 'Esofagektomia sposobem Ivor Lewis', sub: 'Dostęp brzuszny i prawostronna torakotomia (lub małoinwazyjnie); zespolenie wewnątrz klatki piersiowej',
      notes: ['Resekcja dolnej i środkowej części przełyku z wpustem; standard w raku dolnej części przełyku i połączenia przełykowo-żołądkowego.',
        'Rura z krzywizny większej (linia staplera równoległa do krzywizny większej, krzywizna mniejsza usunięta) przeprowadzona tylnym śródpiersiem; zespolenie przełykowo-żołądkowe powyżej żyły nieparzystej. Łuk żyły nieparzystej zwykle podwiązany i przecięty (na schemacie pozostawiony).',
        'W kontroli: nieszczelność, zwężenie, niedokrwienie szczytu rury, zaleganie w rurze.'],
      resect: 'Dolna i środkowa część przełyku z wpustem i krzywizną mniejszą; przecięcie przełyku w klatce piersiowej powyżej żyły nieparzystej.',
      recon: ['Rura żołądkowa w tylnym śródpiersiu', 'Rura żołądkowa podciągnięta tylnym śródpiersiem; zespolenie przełykowo-żołądkowe w klatce piersiowej (szew ręczny, stapler liniowy lub okrężny).'],
      post: 'Rura żołądkowa zastępuje przełyk od poziomu łuku żyły nieparzystej (górne śródpiersie) do odźwiernika.', endo: 'Od przełyku przez zespolenie w klatce piersiowej do początku rury żołądkowej.' },
    mck: { short: 'McKeown', title: 'Esofagektomia sposobem McKeowna (z trzech dostępów)', sub: 'Dostęp przez prawą jamę opłucnej, brzuszny i szyjny; zespolenie na szyi',
      notes: ['Subtotalna resekcja przełyku; przy guzach środkowej i górnej części przełyku piersiowego.',
        'Rura żołądkowa w tylnym śródpiersiu (w łożu przełyku); zespolenie przełykowo-żołądkowe na szyi. Łuk żyły nieparzystej zwykle podwiązany i przecięty (na schemacie pozostawiony).',
        'Zespolenie szyjne: nieszczelność ok. 3 razy częstsza niż w klatce, często z szerzeniem do śródpiersia; większe ryzyko porażenia nerwu krtaniowego wstecznego i zwężenia.'],
      resect: 'Prawie cały przełyk piersiowy z wpustem i krzywizną mniejszą; przecięcie przełyku na szyi.',
      recon: ['Rura żołądkowa do szyi', 'Rura żołądkowa podciągnięta tylnym śródpiersiem do szyi; zespolenie przełykowo-żołądkowe szyjne.'],
      post: 'Rura żołądkowa od szyi do odźwiernika, w łożu przełyku.', endo: 'Zespolenie szyjne na wysokości otworu górnego klatki piersiowej (ok. 18–20 cm od siekaczy), tuż za nim początek rury żołądkowej.' },
    the: { short: 'Przezrozworowa (Orringer)', title: 'Esofagektomia przezrozworowa (Orringer)', sub: 'Bez torakotomii: dostęp brzuszny i szyjny, tępe wypreparowanie przełyku przez rozwór',
      notes: ['Bez otwierania klatki piersiowej; ograniczona limfadenektomia śródpiersiowa.',
        'Rura żołądkowa w tylnym śródpiersiu, zespolenie na szyi — anatomia pooperacyjna jak po McKeownie.',
        'W endoskopii obraz jak po McKeownie; częste zwężenia zespolenia szyjnego.'],
      resect: 'Przełyk od szyi do wpustu, wypreparowany na tępo przez rozwór i z dostępu szyjnego.',
      recon: ['Rura żołądkowa do szyi', 'Rura żołądkowa podciągnięta tylnym śródpiersiem do szyi; zespolenie przełykowo-żołądkowe szyjne.'],
      post: 'Rura żołądkowa od szyi do odźwiernika, w łożu przełyku.', endo: 'Zespolenie szyjne na wysokości otworu górnego klatki piersiowej (ok. 18–20 cm od siekaczy), tuż za nim początek rury żołądkowej.' },
    aki: { short: 'Akiyama', title: 'Esofagektomia z rekonstrukcją sposobem Akiyamy', sub: 'Rura żołądkowa z krzywizny większej (zwykle wąska), przeprowadzona zamostkowo; zespolenie na szyi',
      notes: ['Rura z krzywizny większej z wycięciem krzywizny mniejszej i węzłów (wg Akiyamy), ukrwiona przez naczynia żołądkowo-sieciowe prawe; w praktyce japońskiej często wąska (ok. 3–4 cm).',
        'Droga zamostkowa (przednie śródpiersie), nieco dłuższa niż tylnośródpiersiowa; wariant stosowany także w tylnym śródpiersiu.',
        'W endoskopii rura biegnie przed sercem — łagodne załamania przy wejściu do klatki piersiowej i przy przeponie.'],
      resect: 'Prawie cały przełyk piersiowy z wpustem i krzywizną mniejszą; przecięcie przełyku na szyi.',
      recon: ['Wąska rura żołądkowa zamostkowo', 'Wąska rura żołądkowa przeprowadzona za mostkiem, przed sercem, do szyi; zespolenie przełykowo-żołądkowe szyjne.'],
      post: 'Wąska rura żołądkowa w przednim śródpiersiu, za mostkiem.', endo: 'Zespolenie szyjne, tuż za nim początek wąskiej rury za mostkiem.' },
    col: { short: 'Interpozycja okrężnicy', title: 'Esofagektomia z interpozycją okrężnicy', sub: 'Odcinek okrężnicy poprzecznej i zagięcia śledzionowego na naczyniach okrężniczych lewych, zamostkowo, izoperystaltycznie',
      notes: ['Gdy żołądek nie nadaje się do rekonstrukcji (np. po wcześniejszej częściowej resekcji żołądka lub oparzeniu).',
        'Trzy zespolenia: przełykowo-okrężnicze na szyi, okrężniczo-żołądkowe w jamie brzusznej i okrężniczo-okrężnicze przywracające ciągłość jelita grubego.',
        'W endoskopii fałdy okrężnicy w klatce piersiowej; z czasem możliwe wydłużenie i zagięcia przeszczepu.'],
      resect: 'Przełyk od szyi do wpustu, wpust zamknięty staplerem; odcinek okrężnicy poprzecznej i zagięcia śledzionowego wycinany na szypule naczyniowej.',
      recon: ['Interpozycja okrężnicy', 'Przeszczep okrężniczy zamostkowo do szyi (izoperystaltycznie): zespolenie szyjne, okrężniczo-żołądkowe i okrężniczo-okrężnicze.'],
      post: 'Przeszczep okrężniczy za mostkiem od szyi do żołądka; ciągłość okrężnicy odtworzona.', endo: 'Z przełyku szyjnego przez zespolenie do początku przeszczepu okrężniczego.' }
  };
  function esoAnat(kind, ss) {
    var T = ESO_TXT[kind], neck = kind !== 'il', colon = kind === 'col', S2 = ss ? SS[kind] : null, tc = S2 ? nearestT(C_ESOF, S2.cut) : neck ? tNeckE : tIL;
    var conP = S2 ? S2.con : kind === 'il' ? CON_IL : kind === 'aki' ? CON_RS : CON_PM, conR = kind === 'aki' ? TUBE_R : CONDUIT_R, CP = kind === 'aki' ? CPRE_T : CPRE;
    var stumpPost = null;
    if (S2) { var tb = nearestT(C_ESOF, [0.05, S2.bed, -3.2]), sp = sub(C_ESOF, ESOF_R, 0, tb, 24).path.concat(S2.stump);
      stumpPost = { path: sp, r: (function () { var L0 = curveOf(sp).getLength(); return function (t) { var a = 1 - 0.7 / L0; return t > a ? Math.max(0.06, 0.8 * (1 - sm01((t - a) / (1 - a)))) : 0.8; }; })() }; }
    var objs = [
      { id: 'esoStump', name: 'Przełyk', postName: neck ? 'Przełyk szyjny' : 'Kikut przełyku', pre: sub(C_ESOF, ESOF_R, 0, tc, 20), post: stumpPost || undefined, morph: S2 ? [2.35, 3] : undefined,
        color: COL.eso, mucosa: 'smooth', tint: MUC.eso, labels: [L('Przełyk', 0.5, ALL)].concat(S2 ? [L('Ślepy kikut przełyku', 0.96, POST, 'prawidłowy obraz, nie uchyłek')] : []) },
      { id: 'esoSpec', name: 'Przełyk (preparat)', pre: sub(C_ESOF, ESOF_R, tc, 1, 30), colors: [[0, COL.eso], [0.7, COL.spec]], opacity: SPEC_OP, offset: [[1.15, [0, 0, 0]], [1.9, [-7, 2, 7]]],
        mucosa: 'smooth', tint: MUC.eso, labels: [L('Preparat: przełyk z wpustem', 0.5, [0.5, 1.5])] }
    ].concat(esoContext());
    var marks = [ringOn(C_ESOF, ESOF_R, tc, { name: 'Przecięcie przełyku', color: COL.cut, opacity: CUT_OP, noStapler: true })];
    if (!colon) {
      // cały żołądek jako preparat (wpust, krzywizna mniejsza, część dna); w nim rura z krzywizny większej, która zostaje
      objs.push({ id: 'gspec', name: 'Żołądek', pre: { path: STOMACH, r: STOMACH_R }, colors: SPEC_COL, opacity: SPEC_OP, offset: [[1.15, [0, 0, 0]], [1.9, [-7, 2, 7]]],
        mucosa: 'rugae', tint: MUC.stomach, labels: [L('Żołądek', 0.4, PRE), L('Wpust, krzywizna mniejsza i część dna (preparat)', 0.3, [0.5, 1.5])] });
      objs.push({ id: 'stom', name: 'Rura żołądkowa', postName: kind === 'aki' ? 'Wąska rura żołądkowa' : 'Rura żołądkowa', pre: { path: CP.path, r: conR }, post: { path: conP, r: conR }, morph: [2.35, 3],
        opacity: [[0.3, 0], [0.85, 1]], color: COL.stomach, mucosa: 'rugae', tint: MUC.stomach, labels: [L(kind === 'aki' ? 'Wąska rura żołądkowa' : 'Rura żołądkowa', 0.35, [1.9, 99])] });
      marks.push({ kind: 'line', cutDepth: 1.6, name: 'Linia tubulizacji żołądka', color: COL.cut, opacity: CUT_OP, pts: CP.line });
      if (!S2) marks.push(ringAt(conP, conR, conP[0], { name: 'Zespolenie przełykowo-żołądkowe', color: COL.anast, opacity: ANAST_OP }));
      else {
        var mid = function (y, kz) { var e = C_ESOF.getPointAt(nearestT(C_ESOF, [0, y, -3.1])), cc = curveOf(conP), q = cc.getPointAt(nearestT(cc, [e.x - 1.2, y, e.z])); return e.clone().lerp(q, 0.5).add(new THREE.Vector3(0, 0, kz || 0)).toArray(); };
        var LZ = [mid(S2.ov[0], 0.55), mid((S2.ov[0] + S2.ov[1]) / 2, 0.62), mid(S2.ov[1], 0.55)];
        marks.push({ kind: 'line', name: 'Linia zszywek (stapler liniowy)', color: STAPLE, opacity: ANAST_OP, endo: true, dash: 0.14, pts: LZ, endoPts: LZ.map(function (p) { return [p[0], p[1], p[2] - 0.55]; }) });
        var zo = [mid(S2.ov[1] - 0.35, -0.2).map(function (v, i) { return i === 0 ? v - 0.9 : v; }), mid(S2.ov[1] - 0.45, 0.75), mid(S2.ov[1] - 0.35, -0.2).map(function (v, i) { return i === 0 ? v + 0.9 : v; })];
        marks.push({ kind: 'line', name: 'Zamknięcie otworu po staplerze', color: SUT, opacity: ANAST_OP, pts: zo });
        var se = S2.stump[S2.stump.length - 1];
        marks.push({ kind: 'line', name: 'Zamknięcie kikuta przełyku (stapler)', color: STAPLE, opacity: [[2.95, 0], [3.0, 1]], dash: 0.14, pts: [[se[0] - 0.1, se[1] + 0.55, se[2] - 0.35], [se[0] + 0.12, se[1] - 0.1, se[2] + 0.2], [se[0] + 0.3, se[1] - 0.6, se[2] + 0.6]] });
      }
    } else {
      objs.push({ id: 'stom', name: 'Żołądek', pre: { path: STOMACH, r: STOMACH_R }, color: COL.stomach, mucosa: 'rugae', tint: MUC.stomach, labels: [L('Żołądek', 0.4, ALL)] });
      objs.push({ id: 'colR', name: 'Okrężnica', pre: sub(C_CSB, CSB_R, 0, tC0, 40), color: '#c98f6b', mucosa: 'haustra', tint: '#eab9a3', labels: [L('Okrężnica wstępująca', 0.4, ALL)] });
      objs.push({ id: 'graft', name: 'Okrężnica poprzeczna', postName: 'Przeszczep okrężniczy', pre: sub(C_CSB, CSB_R, tC0, tC1, 30), post: { path: GRAFT, r: flat(1.15) }, morph: [2.35, 3],
        colors: [[2.35, '#c98f6b'], [2.95, '#d9a43c']], mucosa: 'haustra', tint: '#eab9a3', labels: [L('Okrężnica poprzeczna', 0.4, PRE), L('Przeszczep okrężniczy', 0.4, POST)] });
      objs.push({ id: 'colL', name: 'Okrężnica zstępująca', pre: sub(C_CSB, CSB_R, tC1, 1, 50), post: { path: COL_L_POST, r: profile([[0, 1.3], [0.1, 1.2], [0.85, 1.05], [1, 1.4]]) }, morph: [2.35, 3],
        color: '#c98f6b', mucosa: 'haustra', tint: '#eab9a3', labels: [L('Okrężnica zstępująca', 0.5, ALL)] });
      marks.push(ringOn(C.STOM, STOMACH_R, 0.1, { name: 'Zamknięcie wpustu', color: COL.cut, opacity: CUT_OP, noStapler: true }));
      marks.push(ringOn(C_CSB, CSB_R, tC0, { name: 'Przecięcie okrężnicy', color: COL.cut, opacity: CUT_OP_JEJ }));
      marks.push(ringOn(C_CSB, CSB_R, tC1, { name: 'Przecięcie okrężnicy', color: COL.cut, opacity: CUT_OP_JEJ }));
      marks.push(ringAt(GRAFT, flat(1.15), GRAFT[0], { name: 'Zespolenie przełykowo-okrężnicze', color: COL.anast, opacity: ANAST_OP }));
      marks.push(ringAt(GRAFT, flat(1.15), GRAFT[GRAFT.length - 2], { name: 'Zespolenie okrężniczo-żołądkowe', color: COL.anast, opacity: ANAST_OP }));
      marks.push(ringAt(COL_L_POST, flat(1.2), COL_L_POST[0], { name: 'Zespolenie okrężniczo-okrężnicze', color: COL.anast, opacity: ANAST_OP }));
    }
    // endoskopia kończy się ok. 4 cm za zespoleniem (początek rury żołądkowej / przeszczepu)
    var tAfter = function (path, from) { var cc = curveOf(path); return Math.min(0.98, nearestT(cc, from) + 4 / cc.getLength()); };
    var route = colon ? [{ obj: 'esoStump', note: 'Przełyk szyjny' }, { obj: 'graft', to: tAfter(GRAFT, GRAFT[0]), note: 'Za zespoleniem szyjnym — przeszczep okrężniczy (fałdy okrężnicy)' }]
      : S2 ? { prefix: [{ obj: 'esoStump', to: [0.02, (S2.ov[0] + S2.ov[1]) / 2, -3.1], note: 'Przełyk — zespolenie bok-do-boku z rurą żołądkową' }], branches: [
          { label: 'Rura żołądkowa', sub: 'przez zespolenie, w bok', steps: [{ obj: 'stom', from: S2.at, to: tAfter(conP, S2.at), note: 'Przez zespolenie — początek rury żołądkowej' }] },
          { label: 'Kikut przełyku', sub: 'na wprost — ślepy', steps: [{ obj: 'esoStump', from: [0.02, (S2.ov[0] + S2.ov[1]) / 2, -3.1], to: 0.985, note: 'Ślepy kikut przełyku za zespoleniem' }],
            target: S2.stump[S2.stump.length - 1], endText: 'Ślepy kikut przełyku — prawidłowy obraz po zespoleniu bok-do-boku, nie uchyłek ani przetoka' }
        ] }
      : [{ obj: 'esoStump', note: neck ? 'Przełyk szyjny' : 'Przełyk' }, { obj: 'stom', to: tAfter(conP, conP[0]), note: neck ? 'Za zespoleniem szyjnym — początek rury żołądkowej' : 'Za zespoleniem w klatce — początek rury żołądkowej' }];
    return {
      cat: 'eso', id: 'eso-' + kind + (S2 ? '-ss' : ''), short: T.short, title: T.title + (S2 ? ': zespolenie bok-do-boku' : ''), sub: S2 ? T.sub + '; zespolenie bok-do-boku staplerem liniowym' : T.sub,
      notes: S2 ? T.notes.slice(0, 2).concat(['Zespolenie bok-do-boku: przełyk zamknięty staplerem i ułożony wzdłuż rury żołądkowej; stapler liniowy tworzy wspólne światło, otwór po staplerze zamknięty szwem.',
        'W endoskopii na wprost widać ślepy kikut przełyku (za linią zszywek), a wejście do rury żołądkowej jest z boku — kikut bywa mylnie rozpoznawany jako uchyłek, przetoka lub patologia.',
        'Szczyt rury żołądkowej powyżej zespolenia również jest ślepo zakończony.']) : T.notes,
      sideGia: S2 ? { at: [(-0.6), (S2.ov[0] + S2.ov[1]) / 2, -3.2], j: [0, 1, 0], s: [1, 0, 0], ta: null } : undefined,
      sideSut: S2 ? { pts: marks.filter(function (m) { return m.name === 'Zamknięcie otworu po staplerze'; })[0].pts, n: [0, 0, 1] } : undefined,
      focus: { t: [0.8, 12, 0.5], k: 0.75 }, focusVar: S2 ? { t: [0, (S2.ov[0] + S2.ov[1]) / 2 - 1, -2.6], k: 0.42 } : undefined,
      ctOverride: { stom: 'contrast', esoStump: 'air', trach: 'air', brR: 'air', brL: 'air', graft: 'air', colR: 'air', colL: 'air', duo: 'contrast' },
      text: { normal: ['Anatomia prawidłowa', 'Przełyk od szyi do wpustu, za tchawicą i sercem, obok aorty; żołądek w jamie brzusznej.'] },
      frames: {
        resect: ['Zakres resekcji', T.resect, 'Zakres resekcji'],
        remove: ['Usunięcie preparatu', colon ? 'Przełyk usunięty; przeszczep okrężniczy przygotowany na szypule naczyniowej.' : 'Preparat usunięty; żołądek uformowany w rurę.', 'Usunięcie'],
        recon: S2 ? [T.recon[0], 'Rura żołądkowa podciągnięta tylnym śródpiersiem; przełyk zamknięty staplerem i ułożony wzdłuż jej prawej ściany.', 'Rekonstrukcja'] : [T.recon[0], T.recon[1], 'Rekonstrukcja'],
        post: S2 ? 'Zespolenie bok-do-boku: obok wejścia do rury żołądkowej ślepy kikut przełyku.' : T.post,
        endoPost: S2 ? 'Od przełyku do zespolenia: na wprost ślepy kikut przełyku, z boku wejście do rury żołądkowej — wybierz drogę.' : T.endo
      },
      objects: objs, marks: marks,
      routePost: route
    };
  }

  var V3 = THREE.Vector3;

