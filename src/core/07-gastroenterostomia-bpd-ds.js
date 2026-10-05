  /* =====================================================================
     NOWE ZABIEGI GÓRNEGO ODCINKA: gastroenterostomia, BPD, przełączenie dwunastnicze
     ===================================================================== */
  // mankiet z dna żołądka wokół dolnego przełyku: kąt 0° = przód; łuk od a0 do a1 (stopnie)
  /* ---------- Gastroenterostomia omijająca (żołądkowo-jelitowa bok-do-boku) ---------- */
  var GEBP = (function () {
    var tG = 0.6, p = C.STOM.getPointAt(tG), TT = C.STOM.getTangentAt(tG), d = new THREE.Vector3(0, -0.55, 0.85); d.sub(TT.clone().multiplyScalar(d.dot(TT))).normalize();
    var rS = STOMACH_R(tG), G = p.clone().addScaledVector(d, rS + 0.5), a = TT.clone();
    var q = function (k, kd) { return G.clone().addScaledVector(a, k).addScaledVector(d, kd || 0).toArray(); };
    var AFFG = [[3.1, -4.0, -1.6], [4.8, -4.4, -1.0], [6.2, -5.6, 0.8], [7.2, -3.4, 2.8], [7.8, -0.4, 3.4], [7.3, 2.0, 3.8], [6.0, 1.7, 3.8], q(-1.2, 0.15), q(0)];
    var EFFG = [q(0), q(1.2, 0.1), q(2.4, 0.9), [-0.6, -5.0, 3.4], [0.2, -7.8, 2.8], [2.4, -9.6, 2.2], [4.8, -10.8, 1.4]];
    var sp = jejSplit([AFFG, EFFG]), LZ = [q(-1.3, -0.95), q(0, -1.0), q(1.3, -0.95)];
    var an = {
      cat: 'upper', id: 'gebp', short: 'Gastroenterostomia', title: 'Gastroenterostomia omijająca (zespolenie żołądkowo-jelitowe bok-do-boku)',
      sub: 'Pętla jelita czczego zespolona z krzywizną większą żołądka; żołądek i dwunastnica nie są przecinane',
      notes: ['Omija niedrożność odźwiernika lub dwunastnicy (np. nieoperacyjny guz głowy trzustki, zwężenie wrzodowe); leczenie paliatywne lub pomostowe.',
        'Pętla ok. 30–40 cm od więzadła Treitza, przedokrężniczo (lub zaokrężniczo); zespolenie bok-do-boku staplerem liniowym.',
        'Alternatywy: stent dwunastniczy, gastroenterostomia pod kontrolą ultrasonografii endoskopowej (EUS-GE).',
        'Treść może nadal przechodzić przez odźwiernik — w endoskopii trzy drogi: odźwiernik, pętla doprowadzająca, pętla odprowadzająca.'],
      frames: {
        resect: ['Wybór pętli', 'Pętla jelita czczego ok. 30–40 cm od więzadła Treitza; żołądek i dwunastnica nie są przecinane.', 'Wybór pętli'],
        remove: ['Podciągnięcie pętli', 'Pętla podciągnięta przedokrężniczo do krzywizny większej trzonu i części przedodźwiernikowej.', 'Podciągnięcie'],
        recon: ['Zespolenie bok-do-boku', 'Branże staplera liniowego w żołądku i pętli — wspólne światło; otwór po staplerze zamknięty szwem.', 'Zespolenie'],
        post: 'Żółta pętla doprowadzająca (do więzadła Treitza i dwunastnicy), niebieska odprowadzająca; przeszkoda w dwunastnicy.',
        endoPost: 'Przez żołądek do zespolenia na krzywiźnie większej; wybór pętli.'
      },
      objects: [eso(),
        { id: 'stom', name: 'Żołądek', pre: { path: STOMACH, r: STOMACH_R }, color: COL.stomach, mucosa: 'rugae', tint: MUC.stomach, labels: [stomachLabel(), L('Żołądek', 0.35, POST)] },
        { id: 'duo', name: 'Dwunastnica', pre: { path: DUO, r: DUO_R }, colors: [[2, COL.bowel], [2.9, COL.bp]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Dwunastnica', 0.35, ALL)] },
        { id: 'aff', name: 'Jelito czcze', postName: 'Pętla doprowadzająca', pre: sp.parts[0], post: { path: AFFG, r: flat(1.0) }, morph: [2, 3],
          colors: [[2, COL.bowel], [2.9, COL.bp]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Jelito czcze', 0.5, PRE), L('Pętla doprowadzająca', 0.5, POST)] },
        { id: 'eff', name: 'Jelito czcze', postName: 'Pętla odprowadzająca', pre: sp.parts[1], post: { path: EFFG, r: flat(1.0) }, morph: [2, 3],
          colors: [[2, COL.bowel], [2.9, COL.common]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Pętla odprowadzająca', 0.45, POST)] }],
      marks: [
        ringOn(C.DUO, DUO_R, nearestT(C.DUO, [-4.9, -3.0, 0]), { name: 'Przeszkoda (np. guz głowy trzustki)', color: '#8a4b2f', opacity: [[0.05, 0], [0.4, 1]] }),
        ringOn(C.JEJ, flat(1.0), sp.cuts[0], { name: 'Pętla na zespolenie: 30–40 cm od więzadła Treitza', color: COL.mark, opacity: [[0.05, 0], [0.55, 1], [2.1, 1], [2.4, 0]] }),
        { kind: 'line', name: 'Linia zszywek (stapler liniowy)', color: STAPLE, opacity: ANAST_OP, endo: true, dash: 0.14, pts: LZ, endoPts: LZ }
      ],
      gebp: { at: q(0, -0.5), j: a.clone().negate().toArray(), s: d.toArray() },
      papilla: { obj: 'duo', near: PAP.near, dir: PAP.dir },
      routePost: [{ obj: 'eso' }, { obj: 'stom', from: GEJ_IN, to: nearestT(C.STOM, G.toArray()), note: 'Żołądek — zespolenie na krzywiźnie większej' },
        { obj: 'aff', from: 1, to: 0, note: 'Pętla doprowadzająca wstecznie do więzadła Treitza' }, { obj: 'duo', from: 1, to: 'papilla', note: 'Dwunastnica od strony dystalnej — brodawka' }]
    };
    return branchify(an, 2, AFFB, EFFB('eff'));
  })();

  /* ---------- BPD sposobem Scopinaro ---------- */
  var SCOP = (function () {
    var o = Object.assign({}, DGRY, {
      id: 'bpd', short: 'BPD (Scopinaro)', title: 'Wyłączenie żółciowo-trzustkowe sposobem Scopinaro (BPD)',
      sub: 'BPD (biliopancreatic diversion) — resekcja dystalna żołądka, długa pętla alimentacyjna Roux i krótki kanał wspólny',
      notes: ['Resekcja dystalna żołądka (zostaje ok. 200–500 ml) z zamknięciem kikuta dwunastnicy.',
        'Jelito kręte przecięte ok. 250 cm od zastawki: dalszy koniec (pętla alimentacyjna) do kikuta żołądka, bliższy (biliopankreatyczny) wszyty ok. 50 cm od zastawki — krótki kanał wspólny.',
        'Poprzednik przełączenia dwunastniczego (BPD-DS); bez odźwiernika częstsze owrzodzenia brzeżne i zespół poposiłkowy. Silne niedobory — obowiązkowa suplementacja.',
        'Do brodawki: przez zespolenie żołądkowo-krętnicze, pętlą alimentacyjną (ok. 200 cm) do zespolenia krętniczo-krętniczego, dalej wstecznie bardzo długą pętlą biliopankreatyczną — w praktyce enteroskopia lub dostęp chirurgiczny.',
        'Długości pętli na schemacie skrócone.'],
      frames: Object.assign({}, DGRY.frames, {
        resect: ['Zakres resekcji', 'Dystalna część żołądka z odźwiernikiem; jelito kręte przecięte ok. 250 cm od zastawki.', 'Zakres resekcji'],
        recon: ['Rekonstrukcja', 'Pętla alimentacyjna (jelito kręte) do kikuta żołądka — zespolenie żołądkowo-krętnicze; pętla biliopankreatyczna wszyta ok. 50 cm od zastawki — krótki kanał wspólny.', 'Rekonstrukcja'],
        post: 'Zielona pętla alimentacyjna (ok. 200 cm), żółta biliopankreatyczna (długa), niebieski kanał wspólny (ok. 50 cm).',
        endoPost: 'Z kikuta przez zespolenie żołądkowo-krętnicze w pętlę alimentacyjną, przy zespoleniu krętniczo-krętniczym wstecznie pętlą biliopankreatyczną. Brodawka od strony dystalnej.'
      })
    });
    o.objects = DGRY.objects.map(function (x) {
      if (x.id === 'roux') return Object.assign({}, x, { name: 'Jelito kręte', postName: 'Pętla alimentacyjna', lenPost: 'ok. 200 cm', labels: [L('Jelito cienkie', 0.5, PRE), L('Pętla alimentacyjna', 0.5, POST, 'ok. 200 cm')] });
      if (x.id === 'cc') return Object.assign({}, x, { name: 'Jelito kręte', labels: [L('Kanał wspólny', 0.5, POST, 'ok. 50 cm do zastawki')] });
      if (x.id === 'bp') return Object.assign({}, x, { name: 'Jelito cienkie', labels: [L('Pętla biliopankreatyczna', 0.45, POST, 'jelito czcze i większość krętego')] });
      return x;
    });
    // znaczniki i trasa z DGRY opisują jelito czcze (GJ, JJ); w BPD przecina się jelito kręte
    var REN = { 'Przecięcie jelita czczego': 'Przecięcie jelita krętego', 'Zespolenie żołądkowo-jelitowe (GJ)': 'Zespolenie żołądkowo-krętnicze', 'Zespolenie jelitowo-jelitowe (JJ)': 'Zespolenie krętniczo-krętnicze' };
    o.marks = DGRY.marks.map(function (m) { return REN[m.name] ? Object.assign({}, m, { name: REN[m.name] }) : m; });
    var RN = { 'Za GJ w dół pętlą Roux': 'Za zespoleniem żołądkowo-krętniczym w dół pętlą alimentacyjną', 'Przy zespoleniu JJ zawróć wstecznie w pętlę biliopankreatyczną': 'Przy zespoleniu krętniczo-krętniczym zawróć wstecznie w pętlę biliopankreatyczną' };
    function renNotes(x) {   // routePost z DGRY jest już rozgałęziona (prefix / branches / steps)
      if (Array.isArray(x)) return x.map(renNotes);
      if (!x || typeof x !== 'object' || x.isVector3) return x;
      var y = {}; for (var k in x) y[k] = k === 'note' && RN[x[k]] ? RN[x[k]] : k === 'prefix' || k === 'branches' || k === 'steps' ? renNotes(x[k]) : x[k];
      return y;
    }
    o.routePost = renNotes(DGRY.routePost);
    return o;
  })();

  /* ---------- Przełączenie dwunastnicze: SADI-S i BPD-DS ---------- */
  var BULB_PRE = sub(C.DUO, DUO_R, 0, tS + 0.01, 12);
  var BULB_POST = [[-1.6, 0.2, 1.0], [-2.1, 0.55, 1.6], [-2.6, 0.85, 2.4], [-2.95, 1.0, 3.15], [-3.08, 0.96, 3.85]];
  var DS_STUMP = { path: tgDuoPre.path.slice(3), r: DUO_STUMP_R };
  var SADI_AFF = [[3.1, -4.0, -1.6], [4.8, -4.4, -1.0], [6.2, -6.4, 0.2], [5.6, -9.4, 1.2], [2.8, -10.6, 2.0], [0.0, -9.8, 2.6], [-2.8, -8.0, 3.0], [-4.2, -5.4, 3.4], [-4.4, -2.4, 3.8], [-3.9, -0.2, 4.0], [-3.1, 1.0, 3.95]];
  var SADI_EFF = [[-3.1, 1.0, 3.95], [-2.0, -0.6, 4.45], [-0.8, -3.0, 4.55], [0.6, -6.0, 4.25], [2.2, -8.2, 3.85], [4.0, -9.4, 3.4], [5.8, -10.9, 2.6]];
  var BPD_ALIM = [[-3.35, 1.95, 3.45], [-3.15, 1.1, 3.9], [-2.2, -0.8, 4.3], [-0.9, -3.2, 4.4], [0.3, -5.9, 4.1], [1.2, -8.3, 3.6], [1.1, -10.4, 3.1]];
  var BPD_BP = [[3.1, -4.0, -1.6], [4.8, -4.4, -1.0], [6.2, -6.4, 0.2], [6.0, -9.0, 1.2], [4.2, -10.6, 2.2], [2.2, -10.8, 2.8]];
  var BPD_CC = [[1.1, -10.4, 3.1], [0.2, -12.0, 2.8], [-1.8, -12.8, 2.2], [-3.8, -12.2, 1.6], [-5.0, -10.6, 1.0]];
  function dsAnat(sadi) {
    var sp = sadi ? jejSplit([SADI_AFF, SADI_EFF]) : jejSplit([BPD_BP, BPD_ALIM, BPD_CC]);
    var common = [
      eso(),
      { id: 'spec', name: 'Żołądek', pre: { path: STOMACH, r: STOMACH_R }, colors: SPEC_COL, opacity: SPEC_OP, offset: [[1.15, [0, 0, 0]], [1.9, [6, 0.5, 3.5]]],
        mucosa: 'rugae', tint: MUC.stomach, labels: [stomachLabel(), L('Część usuwana', 0.3, [0.5, 1.5])] },
      { id: 'sleeve', name: 'Rękaw żołądkowy', pre: { path: SLEEVE, r: SLEEVE_R }, opacity: [[0.3, 0], [0.85, 1]], color: COL.stomach, mucosa: 'rugae', tint: MUC.stomach, labels: [L('Rękaw żołądkowy', 0.35, [1.9, 99])] },
      { id: 'bulb', name: 'Opuszka dwunastnicy', pre: BULB_PRE, post: { path: BULB_POST, r: profile([[0, 0.6], [0.2, 1.05], [0.72, 1.0], [1, 0.7]]) }, morph: [2.0, 2.9], open: [false, true],
        color: COL.bowel, mucosa: 'circular', tint: MUC.bowel, labels: [L('Opuszka', 0.6, POST)] },
      { id: 'duo', name: 'Dwunastnica', pre: tgDuoPre, post: DS_STUMP, morph: [2.0, 2.3], colors: [[2, COL.bowel], [2.9, COL.bp]], mucosa: 'circular', tint: MUC.bowel,
        labels: [L('Dwunastnica', 0.3, PRE), L('Kikut dwunastnicy', 0.03, POST)] }
    ];
    var limbs = sadi ? [
      { id: 'aff', name: 'Jelito cienkie', postName: 'Pętla doprowadzająca (biliopankreatyczna)', lenPost: 'jelito kręte ok. 250–300 cm od zastawki', pre: sp.parts[0], post: { path: SADI_AFF, r: flat(1.0) }, morph: [2, 3],
        colors: [[2, COL.bowel], [2.9, COL.bp]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Jelito cienkie', 0.5, PRE), L('Pętla doprowadzająca', 0.55, POST, 'długa: jelito czcze i część krętego')] },
      { id: 'eff', name: 'Jelito cienkie', postName: 'Kanał wspólny', pre: sp.parts[1], post: { path: SADI_EFF, r: flat(1.0) }, morph: [2, 3],
        colors: [[2, COL.bowel], [2.9, COL.common]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Kanał wspólny', 0.45, POST, 'ok. 250–300 cm do zastawki')] }
    ] : [
      { id: 'bp', name: 'Jelito cienkie', postName: 'Pętla biliopankreatyczna', pre: sp.parts[0], post: { path: BPD_BP, r: flat(1.0) }, morph: [2, 3],
        colors: [[2, COL.bowel], [2.9, COL.bp]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Pętla biliopankreatyczna', 0.45, POST)] },
      { id: 'roux', name: 'Jelito cienkie', postName: 'Pętla alimentacyjna', lenPost: 'typowo ok. 150 cm', pre: sp.parts[1], post: { path: BPD_ALIM, r: BLIND }, morph: [2, 3],
        colors: [[2, COL.bowel], [2.9, COL.roux]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Jelito cienkie', 0.5, PRE), L('Pętla alimentacyjna', 0.5, POST, 'typowo ok. 150 cm')] },
      { id: 'cc', name: 'Jelito kręte', postName: 'Kanał wspólny', pre: sp.parts[2], post: { path: BPD_CC, r: flat(1.0) }, morph: [2, 3],
        colors: [[2, COL.bowel], [2.9, COL.common]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Kanał wspólny', 0.5, POST, 'typowo 50–100 cm do zastawki')] }
    ];
    var marks = [
      { kind: 'line', name: 'Linia cięcia', postName: 'Linia zszywek', color: COL.cut, colors: [[1.5, COL.cut], [2, COL.staple]], opacity: [[0.05, 0], [0.55, 1]], pts: staple },
      ringOn(C.DUO, DUO_R, tS, { name: 'Przecięcie dwunastnicy', color: COL.cut, opacity: CUT_OP }),
      ringAt(BULB_POST, flat(1.05), BULB_POST[BULB_POST.length - 1], { name: 'Zespolenie dwunastniczo-krętnicze (DI)', color: COL.anast, opacity: ANAST_OP })
    ];
    if (sadi) marks.push(ringOn(C.JEJ, flat(1.0), sp.cuts[0], { name: 'Pętla jelita krętego: ok. 250–300 cm od zastawki', color: COL.mark, opacity: [[0.05, 0], [0.55, 1], [2.1, 1], [2.4, 0]] }));
    else marks.push(ringOn(C.JEJ, flat(1.0), sp.cuts[0], { name: 'Przecięcie jelita krętego', color: COL.cut, opacity: CUT_OP_JEJ }),
      ringAt(BPD_CC, flat(1.0), BPD_CC[0], { name: 'Zespolenie krętniczo-krętnicze', color: COL.anast, opacity: ANAST_OP }));
    var an = {
      cat: 'upper', id: sadi ? 'sadis' : 'bpdds', short: sadi ? 'SADI-S' : 'BPD-DS',
      title: sadi ? 'Jednozespoleniowe pomostowanie dwunastniczo-krętnicze z rękawem (SADI-S)' : 'Wyłączenie żółciowo-trzustkowe z przełączeniem dwunastniczym (BPD-DS)',
      sub: sadi ? 'SADI-S (single anastomosis duodeno-ileal bypass with sleeve gastrectomy) — rękaw i pętla omega jelita krętego do opuszki'
        : 'BPD-DS (biliopancreatic diversion with duodenal switch) — rękaw, zespolenie dwunastniczo-krętnicze na pętli Roux i krętniczo-krętnicze',
      notes: (sadi ? ['Rękaw żołądkowy z zachowanym odźwiernikiem; dwunastnica przecięta w części pierwszej, ok. 3 cm za odźwiernikiem.',
        'Pętla jelita krętego ok. 250–300 cm od zastawki zespolona bokiem z kikutem opuszki (koniec-do-boku; zespolenie dwunastniczo-krętnicze, DI) — jedno zespolenie.',
        'Do brodawki: przez DI wstecznie długą pętlą doprowadzającą do kikuta dwunastnicy — w praktyce enteroskopia lub dostęp chirurgiczny.']
        : ['Rękaw żołądkowy z zachowanym odźwiernikiem; dwunastnica przecięta w części pierwszej, ok. 3 cm za odźwiernikiem.',
        'Jelito kręte przecięte ok. 250 cm od zastawki: dalszy koniec (pętla alimentacyjna, ok. 150 cm) do opuszki (DI), bliższy koniec wszyty typowo ok. 100 cm od zastawki (zakres 50–100 cm).',
        'Silne działanie malabsorpcyjne — kontrola niedoborów (białko, witaminy A, D, E, K, żelazo, wapń).']).concat(['Długości pętli różnią się między ośrodkami; na schemacie skrócone.']),
      frames: {
        resect: ['Linie przecięcia', sadi ? 'Rękaw wzdłuż krzywizny mniejszej, dwunastnica przecięta ok. 3 cm za odźwiernikiem; wybrana pętla jelita krętego.' : 'Rękaw wzdłuż krzywizny mniejszej, dwunastnica przecięta ok. 3 cm za odźwiernikiem, jelito kręte przecięte ok. 250 cm od zastawki.', 'Linie przecięcia'],
        remove: ['Usunięcie preparatu', 'Usunięta większość żołądka; kikut dwunastnicy zamknięty.', 'Usunięcie'],
        recon: sadi ? ['Pętla omega do opuszki', 'Pętla jelita krętego podciągnięta do opuszki: zespolenie dwunastniczo-krętnicze koniec-do-boku.', 'Rekonstrukcja']
          : ['Rekonstrukcja Roux-en-Y', 'Pętla alimentacyjna do opuszki (DI); pętla biliopankreatyczna wszyta nisko w jelito kręte — kanał wspólny do zastawki.', 'Rekonstrukcja'],
        post: sadi ? 'Żółta pętla doprowadzająca (biliopankreatyczna), niebieski kanał wspólny.' : 'Zielona pętla alimentacyjna, żółta biliopankreatyczna, niebieski kanał wspólny.',
        endoPost: sadi ? 'Przez rękaw i odźwiernik do opuszki; za zespoleniem DI wybór pętli.' : 'Przez rękaw i odźwiernik do opuszki i pętli alimentacyjnej; przy zespoleniu krętniczo-krętniczym wybór drogi.'
      },
      objects: common.concat(limbs), marks: marks,
      papilla: { obj: 'duo', near: PAP.near, dir: PAP.dir }, ctOverride: { bulb: 'contrast' },
      routePost: sadi ? [{ obj: 'eso' }, { obj: 'sleeve', note: 'Rękaw żołądkowy' }, { obj: 'bulb', note: 'Odźwiernik i opuszka — zespolenie DI' },
        { obj: 'aff', from: 1, to: 0, note: 'Wstecznie długą pętlą doprowadzającą do więzadła Treitza' }, { obj: 'duo', from: 1, to: 'papilla', note: 'Kikut dwunastnicy od strony dystalnej — brodawka' }]
        : [{ obj: 'eso' }, { obj: 'sleeve', note: 'Rękaw żołądkowy' }, { obj: 'bulb', note: 'Odźwiernik i opuszka — zespolenie DI' }, { obj: 'roux', from: [-3.1, 0.9, 3.9], note: 'Pętla alimentacyjna' },
          { obj: 'bp', from: 1, to: 0, note: 'Przy zespoleniu krętniczo-krętniczym wstecznie pętlą biliopankreatyczną' }, { obj: 'duo', from: 1, to: 'papilla', note: 'Kikut dwunastnicy od strony dystalnej — brodawka' }]
    };
    return branchify(an, sadi ? 3 : 4, sadi ? AFFB : BIL, sadi ? EFFB('eff') : CCB('cc'));
  }
  var SADIS = dsAnat(true), BPDDS = dsAnat(false);

