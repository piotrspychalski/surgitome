  /* =====================================================================
     NARZĘDZIA (stapler liniowy, stapler okrężny, szew V-Loc) i oś czasu
     m: 0-1 zakres, 1-2 przecięcie staplerem, 2-3 usunięcie, 3-4 ułożenie, 4-5 zespolenie
     ===================================================================== */
  function va(a) { return new V3(a[0], a[1], a[2]); }
  function giaAt(at, j, s, len, open, extra) {
    var o = { type: 'gia', at: at.toArray ? at.toArray() : at, j: j.toArray(), s: s.toArray(), len: len, open: open };
    for (var k in extra) o[k] = extra[k]; return o;
  }
  function cutTools(an, C0, late) {
    var tools = [];
    an.marks.forEach(function (mk, i) {
      if (mk.color !== COL.cut || mk.noStapler || !!mk.late !== !!late) return;
      if (mk.kind === 'ring') {
        var T = va(mk.tan).normalize(), at = va(mk.pos), j = new V3().crossVectors(T, new V3(0, 0, 1));
        if (j.length() < 0.3) j = new V3().crossVectors(T, new V3(1, 0, 0));
        j.normalize();
        if (at.clone().sub(C0).dot(j) > 0) j.negate(); // trzon staplera na zewnątrz
        var s = new V3().crossVectors(T, j).normalize();
        tools.push(giaAt(at, j, s, 2 * mk.r + 0.8, mk.r + 0.05, { fire: [i] }));
      } else if (mk.kind === 'line') {
        var cv = curveOf(mk.pts), L = cv.getLength(), nF = Math.max(1, Math.min(4, Math.round(L / 3.4)));
        for (var f = 0; f < nF; f++) {
          var a = cv.getPointAt(f / nF), b = cv.getPointAt((f + 1) / nF), jj = b.clone().sub(a).normalize();
          var ss = new V3(0, 0, 1); ss.sub(jj.clone().multiplyScalar(ss.dot(jj))).normalize();
          var mid = a.clone().add(b).multiplyScalar(0.5).addScaledVector(ss, -(mk.cutDepth || 0));
          tools.push(giaAt(mid, jj.clone().negate(), ss, a.distanceTo(b) + 0.7, (mk.cutDepth ? 1.6 : 1.3), { fire: f === nF - 1 ? [i] : [], startAtEnd: true }));
        }
      }
    });
    return tools;
  }
  function markIdx(an, name) { for (var i = 0; i < an.marks.length; i++) if (an.marks[i].name === name) return i; return -1; }
  function anastTools(an) {
    var id = an.id, t = [];
    var LZ = markIdx(an, 'Linia zszywek (stapler liniowy)'), ZO = markIdx(an, 'Zamknięcie otworu po staplerze'), TA = markIdx(an, 'Zamknięcie poprzeczne końców (TA)');
    if (id === 'sb-iso') {
      t.push(giaAt([0, -11.0, 1.6], va([-1, 0, 0]), va([0, 1, 0]), 3.8, 0.65, { side: true, reveal: [LZ] }));
      t.push({ type: 'vloc', pts: [[2.3, -9.7, 2.3], [2.3, -11.0, 2.8], [2.3, -12.3, 2.3]], n: [0.3, 0, 1], stitches: 7, hole: true, reveal: [ZO] });
    } else if (id === 'sb-anti') {
      t.push(giaAt([0.3, -11.0, 1.6], va([-1, 0, 0]), va([0, 1, 0]), 3.8, 0.65, { side: true, reveal: [LZ] }));
      t.push(giaAt([2.75, -11.0, 1.6], va([0, 1, 0]), va([0, 0, 1]), 3.8, 1.15, { reveal: [TA] }));
    } else if (id === 'sb-e2e') {
      t.push({ type: 'vloc', ring: { c: [0.6, -11.0, 1.6], axis: [1, 0, 0.02], r: 1.08 }, stitches: 14, reveal: [markIdx(an, 'Szew ręczny koniec-do-końca')] });
    } else if (id === 'rh-iso') {
      t.push(giaAt([-0.4, 3.15, 3.3], va([-0.95, 0.29, -0.07]), va([0, 0.67, -0.74]), 3.4, 0.8, { side: true, reveal: [LZ] }));
      t.push({ type: 'vloc', pts: [[1.9, 4.6, 3.7], [2.0, 3.4, 4.5], [2.1, 2.0, 4.4]], n: [0.25, 0.1, 1], stitches: 7, hole: true, reveal: [ZO] });
    } else if (id === 'rh-anti') {
      t.push(giaAt([-1.2, 3.5, 3.35], va([0.95, -0.29, 0.07]), va([0, 0.59, -0.81]), 3.4, 0.8, { side: true, reveal: [LZ] }));
      t.push(giaAt([-3.55, 4.25, 3.6], va([0, -0.91, 0.41]), va([0, 0.41, 0.91]), 3.8, 1.3, { reveal: [TA] }));
    } else if (id === 'b2br') {
      t.push(giaAt([2.75, -4.9, 3.05], va([0, 1, 0]), va([1, 0, -0.08]), 2.6, 0.62, { side: true, reveal: [markIdx(an, 'Zespolenie Brauna (bok-do-boku)')] }));
      t.push({ type: 'vloc', pts: [[2.1, -6.3, 3.95], [2.75, -6.45, 4.15], [3.4, -6.3, 3.95]], n: [0, -0.2, 1], stitches: 5, hole: true, reveal: [] });
    } else if (an.sideGia) {
      var G = an.sideGia; t.push(giaAt(G.at, va(G.j), va(G.s), 3.2, 0.8, { side: true, reveal: [LZ] }));
      if (G.ta) t.push(giaAt(G.ta.at, va(G.ta.j), va(G.ta.s), 3.6, 1.3, { reveal: [TA] }));
      if (an.sideSut) t.push({ type: 'vloc', pts: an.sideSut.pts, n: an.sideSut.n, stitches: 7, hole: true, reveal: [ZO] });
    } else if (id === 'gebp') {
      t.push(giaAt(an.gebp.at, va(an.gebp.j), va(an.gebp.s), 3.2, 0.7, { side: true, reveal: [LZ] }));
    } else if (id === 'ipaa') {
      t.push(giaAt(an.pouchGia.at, va(an.pouchGia.j), va(an.pouchGia.s), 3.6, 0.7, { side: true, reveal: [LZ] }));
    }
    if (an.eea) {
      t.push({ type: 'eea', face: an.eea.face, dir: an.eea.dir, anvil: an.eea.anvil, path: an.eea.path, reveal: [markIdx(an, 'Zespolenie okrężne staplerem (EEA)'), markIdx(an, 'Zespolenie staplerem okrężnym na przedniej ścianie odbytnicy')].filter(function (x) { return x >= 0; }) });
    }
    return t.filter(function (x) { return !x.reveal || x.reveal.every(function (r) { return r >= 0; }); });
  }
  var ANAST_TEXT = {
    'eso-il-ss': 'Branże staplera w przełyku i rurze żołądkowej — wspólne światło; otwór po staplerze zamknięty szwem. Poniżej zostaje ślepy kikut przełyku.',
    'eso-mck-ss': 'Branże staplera w przełyku i rurze żołądkowej — wspólne światło; otwór po staplerze zamknięty szwem. Poniżej zostaje ślepy kikut przełyku.',
    'lh-iso': 'Branże staplera w poprzecznicy i esicy — wspólne światło; otwór po staplerze zamknięty szwem ciągłym (typu V-Loc).',
    'lh-anti': 'Branże staplera w obu końcach — wspólne światło; końce zamknięte poprzecznie drugim staplerem liniowym.',
    'gebp': 'Branże staplera liniowego w żołądku i pętli jelita — wspólne światło; otwór po staplerze zamknięty szwem.',
    'ipaa': 'Stapler liniowy przez otwór w zagięciu pętli łączy oba ramiona we wspólny zbiornik; kowadełko w dnie zbiornika, stapler okrężny przez odbyt.',
    'sb-iso': 'Branże staplera liniowego w obu ramionach — po odpaleniu wspólne światło. Otwór po staplerze zamknięty szwem ciągłym nicią z zadziorami (typu V-Loc).',
    'sb-anti': 'Branże staplera w obu końcach — po odpaleniu wspólne światło; wspólny otwór końców zamknięty poprzecznie drugim staplerem liniowym.',
    'sb-e2e': 'Szew ciągły nicią z zadziorami (typu V-Loc) na całym obwodzie.',
    'rh-iso': 'Branże staplera w jelicie krętym i poprzecznicy — wspólne światło; otwór po staplerze zamknięty szwem ciągłym (typu V-Loc).',
    'rh-anti': 'Branże staplera w obu końcach — wspólne światło; końce zamknięte poprzecznie drugim staplerem liniowym.',
    'rh-ext': 'Branże staplera w jelicie krętym i lewej części poprzecznicy — wspólne światło; otwór po staplerze zamknięty szwem ciągłym (typu V-Loc).',
    'b2br': 'Branże staplera w pętli doprowadzającej i odprowadzającej — wspólne światło; otwór zamknięty szwem ciągłym (typu V-Loc).'
  };
  // uniesienie w trakcie przenoszenia: punkt wędruje łukiem w kierunku dir, o k × długość drogi (maks. max) — omija narządy po drodze
  var LIFT = {
    'eso-il-ss': { stom: [[0.3, -1, 0.2], 0.3, 4] }, 'eso-mck': { stom: [[0, -1, 0], 0.35, 5] }, 'eso-mck-ss': { stom: [[0, -1, 0], 0.35, 5] }, 'eso-the': { stom: [[0, -1, 0], 0.35, 5] },
    'eso-aki': { stom: [[1, 0, 0], 0.4, 4] }, 'eso-col': { graft: [[1, 0, 0], 0.6, 6] },
    'rygb': { roux: [[0, 0, 1], 0.35, 3] }, 'oagb': { aff: [[0, 0, 1], 0.35, 3], eff: [[0, 0, 1], 0.35, 3] },
    'bpdds': { bp: [[0, 0, 1], 0.6, 6] }, 'pppd-pj': { bpl: [[0, 0, -1], 0.4, 4] }, 'pppd-pg': { bpl: [[0, 0, -1], 0.25, 2.5] }, 'hj': { roux: [[0, 0, 1], 0.4, 4] },
    'puestow': { roux: [[0, 0, 1], 0.35, 2] }, 'frey': { roux: [[0, 0, 1], 0.35, 2] }
  };
  function prepare(an) {
    var lf = LIFT[an.id] || {};
    function g(t) { return t > 1 ? t + 1 : t; }
    function mapKF(arr) { return arr ? arr.map(function (k) { return [g(k[0]), k[1]]; }) : arr; }
    an.objects = an.objects.map(function (o0) {
      var o = Object.assign({}, o0);
      if (o.morph) o.morph = o.morph.map(g);
      if (lf[o.id]) o.lift = { dir: lf[o.id][0], k: lf[o.id][1], max: lf[o.id][2] };
      o.opacity = mapKF(o.opacity); o.colors = mapKF(o.colors); o.offset = mapKF(o.offset);
      if (o.labels) o.labels = o.labels.map(function (l) { return { text: l.text, t: l.t, sub: l.sub, win: l.win.map(g) }; });
      return o;
    });
    an.marks = an.marks.map(function (m0) {
      var m = Object.assign({}, m0); m.anast = m0.opacity === ANAST_OP;
      m.opacity = mapKF(m.opacity); m.colors = mapKF(m.colors); return m;
    });
    var C0 = an.cat === 'colon' ? new V3(0, -4, 1) : new V3(0, 0, 0.5);
    var cuts = cutTools(an, C0, false), ana = anastTools(an), lates = cutTools(an, C0, true);
    lates.forEach(function (tl, i) {
      var d = 0.3 / lates.length; tl.w = [3.02 + i * d, 3.02 + (i + 1) * d]; tl.fireT = tl.w[0] + 0.6 * d;
      (tl.fire || []).forEach(function (mi) { an.marks[mi].colors = [[tl.fireT - 0.005, COL.cut], [tl.fireT, STAPLE]]; an.marks[mi].opacity = [[3.0, 0], [3.03, 1], [3.4, 1], [3.55, 0]]; });
    });
    // przecięcia: 1.05-1.95
    cuts.forEach(function (tl, i) {
      var d = 0.9 / cuts.length; tl.w = [1.05 + i * d, 1.05 + (i + 1) * d]; tl.fireT = tl.w[0] + 0.6 * d;
      (tl.fire || []).forEach(function (mi) { an.marks[mi].colors = [[tl.fireT - 0.005, COL.cut], [tl.fireT, STAPLE]]; });
    });
    // linie zamknięcia kikuta pojawiają się przy przecięciu odbytnicy
    var stumpFire = null;
    cuts.forEach(function (tl) { (tl.fire || []).forEach(function (mi) { if (an.marks[mi].stumpCut || /odbytnic|esiczo-odbytn/.test(an.marks[mi].name || '')) stumpFire = tl.fireT; }); });
    if (stumpFire !== null) an.marks.forEach(function (m) { if (m.stump || m.fullStump) m.opacity = [[stumpFire, 0], [stumpFire + 0.01, 1]]; });
    // zespolenie: 4.0-4.8
    var wsum = ana.reduce(function (a, tl) { return a + (tl.type === 'eea' ? 1.6 : tl.type === 'vloc' ? 1.3 : 1); }, 0), acc = 4.0;
    ana.forEach(function (tl) {
      var wgt = (tl.type === 'eea' ? 1.6 : tl.type === 'vloc' ? 1.3 : 1) / wsum * 0.8;
      tl.w = [acc, acc + wgt]; acc += wgt;
      tl.fireT = tl.type === 'vloc' ? tl.w[1] : tl.w[0] + (tl.type === 'eea' ? 0.55 : 0.6) * wgt;
      (tl.reveal || []).forEach(function (mi) { an.marks[mi].opacity = [[tl.fireT - 0.005, 0], [tl.fireT, 1]]; an.marks[mi].anast = false; });
    });
    var eeaT = null; ana.forEach(function (tl) { if (tl.type === 'eea') eeaT = tl.fireT; });
    if (stumpFire !== null) an.marks.forEach(function (m) {
      if (m.fullStump && eeaT !== null) m.opacity = [[stumpFire, 0], [stumpFire + 0.01, 1], [eeaT - 0.005, 1], [eeaT, 0]];
      if (m.ringSeg && eeaT !== null) m.opacity = [[eeaT - 0.005, 0], [eeaT, 1]];
    });
    var hasRecon = !!an.frames.recon, aStart = ana.length ? 4.8 : 3.8;
    an.marks.forEach(function (m) { if (m.anast) m.opacity = [[aStart, 0], [aStart + 0.18, 1]]; });
    if (ana.length && an.eea) {
      var e = ana[0].w, tr = [[e[0], 1], [e[0] + 0.05, 0.3], [e[1] - 0.06, 0.3], [e[1], 1]];
      an.objects.forEach(function (o) { if (o.id === 'rect' || o.id === 'prox') o.opacity = tr; });
    }
    an.cutTools = cuts.concat(lates); an.commonCuts = cuts.length; an.anastTools = ana; an.anastText = ANAST_TEXT[an.id] || null;
    // TK: zawartość światła i opisy
    an.ctMap = {}; an.ctNames = {};
    var ov = an.ctOverride || {}, nm = (an.ct && an.ct.names) || {};
    an.objects.forEach(function (o) {
      var id = o.id, k = ov[id];
      if (!k) k = o.organ ? 'organ' : id === 'eso' ? 'air' : (o.mucosa === 'haustra' || id === 'rect') ? 'air' : /^(bp|aff|duo|stom|bpl|chd|cbd|cbdLow|gb|duoCut|dist)$/.test(id) ? 'fluid' : 'contrast';
      an.ctMap[id] = k;
      an.ctNames[id] = nm[id] || String(o.postName || o.name).replace(/\s*\(.*\)/, '');
    });
    an.mEnd = ana.length ? 5 : hasRecon ? 4 : 3;
    return an;
  }

  root.ANAT = {
    PROCS: (function () {
      var P = function (v, short) { v.vshort = short; return v; };
      function one(an, short, title) { return { cat: an.cat, id: an.id, short: short || an.short, title: title || an.title, variants: [prepare(an)] }; }
      function multi(cat, id, short, title, vs) { return { cat: cat, id: id, short: short, title: title, variants: vs.map(prepare) }; }
      var esoP = multi('eso', 'esoph', 'Esofagektomia', 'Esofagektomia — warianty resekcji i rekonstrukcji', [P(esoAnat('il'), 'Ivor Lewis'), P(esoAnat('il', true), 'Ivor Lewis — bok-do-boku'), P(esoAnat('mck'), 'McKeown'), P(esoAnat('mck', true), 'McKeown — bok-do-boku'), P(esoAnat('the'), 'Przezrozworowa (Orringer)'), P(esoAnat('aki'), 'Akiyama'), P(esoAnat('col'), 'Interpozycja okrężnicy')]);
      esoP.distinct = true;
      var LIST = [
        esoP,
        multi('upper', 'dg', 'Resekcja dystalna', 'Resekcja dystalna żołądka — warianty rekonstrukcji', [P(BI, 'Billroth I'), P(B2, 'Billroth II'), P(B2BR, 'Billroth II + Braun'), P(DGRY, 'Roux-en-Y')]),
        one(TG, 'Gastrektomia całkowita', 'Gastrektomia całkowita z rekonstrukcją Roux-en-Y'),
        one(SLV, 'Rękawowa resekcja (sleeve)', 'Rękawowa resekcja żołądka (sleeve gastrectomy)'),
        one(RYGB, 'Bypass Roux-en-Y (RYGB)', 'Pomostowanie żołądkowe Roux-en-Y (RYGB)'),
        one(OAGB, 'Bypass jednozespoleniowy (OAGB)', 'Jednozespoleniowe pomostowanie żołądkowe (OAGB / MGB)'),
        one(GEBP, 'Gastroenterostomia omijająca', 'Gastroenterostomia omijająca'),
        one(SCOP, 'BPD (Scopinaro)', 'Wyłączenie żółciowo-trzustkowe sposobem Scopinaro'),
        multi('upper', 'ds', 'Przełączenie dwunastnicze', 'Przełączenie dwunastnicze — warianty', [P(SADIS, 'SADI-S'), P(BPDDS, 'BPD-DS')]),
        multi('hpb', 'whip', 'Whipple (klasyczny)', 'Pankreatoduodenektomia sposobem Whipple’a — warianty zespolenia trzustkowego', [P(whipple(false, false), 'PJ + HJ + GJ'), P(whipple(false, true), 'PG + HJ + GJ')]),
        multi('hpb', 'pppd', 'Traverso-Longmire (PPPD)', 'Pankreatoduodenektomia z zachowaniem odźwiernika (Traverso-Longmire)', [P(whipple(true, false), 'PJ + HJ + DJ'), P(whipple(true, true), 'PG + HJ + DJ')]),
        one(HJ, 'Hepatikojejunostomia (Roux-en-Y)'),
        one(DP, 'Pankreatektomia dystalna', 'Pankreatektomia dystalna ze splenektomią'),
        multi('hpb', 'drain', 'Operacje drenujące (Puestow, Frey)', 'Przewlekłe zapalenie trzustki — operacje drenujące', [P(drainAnat(false), 'Puestow (Partington–Rochelle)'), P(drainAnat(true), 'Frey')]),
        one(CDD, 'Choledochoduodenostomia', 'Choledochoduodenostomia bok-do-boku'),
        multi('sb', 'sb', 'Resekcja jelita cienkiego', 'Resekcja jelita cienkiego — warianty zespolenia', [P(sbAnat('e2e'), 'Koniec-do-końca (szew)'), P(sbAnat('iso'), 'Izoperystaltyczne'), P(sbAnat('anti'), 'Antyperystaltyczne (FEEA)')]),
        (function () {
          // wybór zakresu resekcji: jeden kadr, całe jelito grube z krezką i naczyniami, przesuwalny guz
          var z = prepare({ cat: 'colon', id: 'zakres', short: 'Wybór zakresu resekcji', title: 'Wybór zakresu resekcji w raku jelita grubego',
            sub: 'Przesuń guz — podświetla się typowy zakres resekcji z krezką i naczyniami do podwiązania',
            notes: ['Zakres resekcji odpowiada drenażowi chłonnemu: usuwa się odcinek jelita z krezką do odejścia naczynia zaopatrującego, z marginesem 5–7 cm od guza (ASCRS 2022).',
              'Kątnica i wstępnica: hemikolektomia prawa (IC, RC — jeśli obecna, RBMC). Zagięcie wątrobowe i poprzecznica: zakres ustalany indywidualnie — najczęściej poszerzona hemikolektomia prawa (pień MC), w środkowej części także resekcja poprzecznicy.',
              'Zagięcie śledzionowe: resekcja segmentarna (LC, LBMC) lub poszerzone hemikolektomie. Zstępnica: hemikolektomia lewa (LC, gałęzie esicze). Esica: resekcja esicy (SRA, LC).',
              'Odbytnica: górna część — przednia resekcja z częściowym wycięciem mezorektum (PME); środkowa i dolna — TME; guz naciekający zwieracze lub gdy nie da się ich zachować — amputacja brzuszno-kroczowa.',
              'Schemat edukacyjny: granice między odcinkami są umowne, a zakres ustala się indywidualnie (m.in. naczynia zaopatrujące guz, stan chorego, wyniki obrazowania).'],
            text: COL_TEXT, frames: { resect: ['', '', ''], remove: ['', '', ''], post: '', endoPost: '' },
            objects: [tiObj({}), appObj({}), colObj('colon', 0, 1, { name: 'Jelito grube' })], marks: [] });
          z.single = true; z.tumour = true; z.cutTools = z.cutTools.concat([{ type: 'zakres', map: colonMap() }]);
          return { cat: 'colon', id: 'zakres', short: z.short, title: z.title, variants: [z] };
        })(),
        multi('colon', 'rh', 'Hemikolektomia prawa', 'Prawostronna hemikolektomia — warianty zespolenia', [P(rhAnat(true), 'Izoperystaltyczne'), P(rhAnat(false), 'Antyperystaltyczne (FEEA)'), P(RHX, 'Poszerzona — izoperystaltyczne')]),
        multi('colon', 'lh', 'Hemikolektomia lewa', 'Lewostronna hemikolektomia — warianty zespolenia', [P(LH, 'Koniec-do-końca (EEA)'), P(lhSide(true), 'Izoperystaltyczne'), P(lhSide(false), 'Antyperystaltyczne (FEEA)')]),
        multi('colon', 'ar', 'Resekcja odbytnicy', 'Resekcja odbytnicy — warianty zespolenia EEA', [P(arVariant('center'), 'Linia przez środek'), P(arVariant('racket'), 'Rakieta tenisowa'), P(arVariant('side'), 'Przednia ściana')]),
        one(IRA, 'Kolektomia całkowita (IRA)', 'Kolektomia całkowita z zespoleniem krętniczo-odbytniczym'),
        one(IPAA, 'Zbiornik J (IPAA)', 'Proktokolektomia ze zbiornikiem J (IPAA)'),
        one(HART),
        multi('colon', 'ileo', 'Ileostomia', 'Ileostomia — warianty', [P(ileoAnat(true, true), 'Pętlowa — wydzielnicza górna'), P(ileoAnat(true, false), 'Pętlowa — wydzielnicza dolna'), P(ileoAnat(false, true), 'Dwulufowa — wydzielnicza górna'), P(ileoAnat(false, false), 'Dwulufowa — wydzielnicza dolna')])];
      // krezka z naczyniami i węzłami: hemikolektomie prawe; lewostronne — krezka lewej połowy okrężnicy i mezorektum
      LIST.forEach(function (p) { if (p.id === 'rh') p.variants.forEach(function (v) { v.cutTools = v.cutTools.concat([mesoRight(v.id === 'rh-ext' ? 'ext' : 'rh')]); v.tumour = true; }); });
      var ML = { lh: 'lh', ar: 'ar', hartmann: 'hart' };
      LIST.forEach(function (p) { if (ML[p.id]) p.variants.forEach(function (v) { v.cutTools = v.cutTools.concat([mesoLeft(ML[p.id])]); }); });
      var BAR = { sleeve: 1, rygb: 1, oagb: 1, ds: 1, bpd: 1 }, ORDER = ['eso', 'upper', 'bar', 'hpb', 'sb', 'colon'];
      LIST.forEach(function (p) { if (BAR[p.id]) p.cat = 'bar'; });
      var SEQ = ['esoph', 'dg', 'tg', 'gebp', 'sleeve', 'rygb', 'oagb', 'ds', 'bpd', 'whip', 'pppd', 'dp', 'hj', 'cdd', 'drain',
        'sb', 'zakres', 'rh', 'lh', 'ar', 'ira', 'ipaa', 'hartmann', 'ileo'];
      return LIST.map(function (p, i) { var s = SEQ.indexOf(p.id); return [ORDER.indexOf(p.cat) * 100 + (s < 0 ? 90 + i : s), p]; }).sort(function (a, b) { return a[0] - b[0]; }).map(function (x) { return x[1]; });
    })(),
    PANC: PANC, PANC_R: PANC_R,
    CATS: [{ id: 'eso', name: 'Przełyk' }, { id: 'upper', name: 'Żołądek' }, { id: 'bar', name: 'Bariatria' }, { id: 'hpb', name: 'Trzustka i drogi żółciowe' }, { id: 'sb', name: 'Jelito cienkie' }, { id: 'colon', name: 'Jelito grube' }],
    resectionFor: resectionFor, COL: COL, curveOf: curveOf, buildTube: buildTube, nearestT: nearestT, papillaPoint: papillaPoint, V: V, endoGeometries: endoGeometries,
    // klocki dla modułu badań (09-badania.js); tylko funkcje i krzywe
    _lib: { prepare: prepare, rhAnat: rhAnat, mesoRight: mesoRight, mesoLeft: mesoLeft, colObj: colObj, tiObj: tiObj, appObj: appObj, ringOn: ringOn, L: L, sub: sub, flat: flat, profile: profile, sm01: sm01,
      C_COL: C_COL, COL_R: COL_R, colT: ct, colors: function () { return { COL: COL, COLC: COLC, MUC: MUC, MUC_C: MUC_C, STAPLE: STAPLE, SUT: SUT }; },
      windows: function () { return { PRE: PRE, POST: POST, ALL: ALL, SPEC_OP: SPEC_OP, RH_OFF: RH_OFF, COL_TEXT: COL_TEXT }; } }
  };
})(typeof window !== 'undefined' ? window : globalThis);
