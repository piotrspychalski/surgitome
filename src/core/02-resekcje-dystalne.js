  /* =====================================================================
     RESEKCJE DYSTALNE ŻOŁĄDKA (Billroth I, Billroth II, Braun, Roux-en-Y)
     ===================================================================== */
  var tDG = 0.52;
  var REM_DG = sub(C.STOM, STOMACH_R, 0, tDG, 40);
  var SPEC_DG = sub(C.STOM, STOMACH_R, tDG, 1, 30);
  var remTaper = function (t) { var r = REM_DG.r(t); return r + (1.3 - r) * sm01((t - 0.7) / 0.3); };
  var DUO_CUT = sub(C.DUO, DUO_R, 0, tS + 0.01, 12);
  var DUO_STUMP_R = profile([[0, 0.05], [0.05, 1.05], [1, 1.0]]);
  var DG_OFF = [[1.15, [0, 0, 0]], [1.9, [4, -1, 6]]];

  function remObj(post, morph) {
    return { id: 'rem', name: 'Żołądek', postName: 'Kikut żołądka', pre: REM_DG, post: post || { path: REM_DG.path, r: remTaper }, morph: morph || [2.0, 2.3],
      color: COL.stomach, mucosa: 'rugae', tint: MUC.stomach, labels: [L('Żołądek', 0.45, PRE), L('Kikut żołądka', 0.4, POST)] };
  }
  function specDG() {
    return { id: 'spec', name: 'Część dystalna żołądka', pre: SPEC_DG, colors: SPEC_COL, opacity: SPEC_OP, offset: DG_OFF,
      mucosa: 'rugae', tint: MUC.stomach, labels: [L('Preparat: antrum z odźwiernikiem', 0.35, [0.5, 1.5])] };
  }
  function duoCutObj() {
    return { id: 'duoCut', name: 'Opuszka', pre: DUO_CUT, colors: [[0, COL.bowel], [0.7, COL.spec]], opacity: SPEC_OP, offset: DG_OFF, mucosa: 'circular', tint: MUC.bowel };
  }
  function duoStumpObj() {
    return { id: 'duo', name: 'Dwunastnica', pre: tgDuoPre, post: { path: tgDuoPre.path, r: DUO_STUMP_R }, morph: [2.0, 2.3],
      colors: [[2, COL.bowel], [2.9, COL.bp]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Dwunastnica', 0.3, PRE), L('Kikut dwunastnicy', 0.02, POST)] };
  }
  var DG_CUTS = [
    ringOn(C.STOM, STOMACH_R, tDG, { name: 'Przecięcie żołądka', color: COL.cut, opacity: CUT_OP }),
    ringOn(C.DUO, DUO_R, tS, { name: 'Przecięcie dwunastnicy', color: COL.cut, opacity: CUT_OP })
  ];
  function jejWhole() {
    return jejObj();
  }

  /* ---------- Billroth I ---------- */
  var REM_BI = { path: sub(C.STOM, STOMACH_R, 0, 0.4, 16).path.concat([[3.8, 1.2, 0.8], [2.7, 0.35, 1.0], [1.2, 0.2, 1.1]]),
    r: profile([[0, 0.05], [0.1, 1.9], [0.3, 2.55], [0.55, 2.4], [0.8, 1.8], [1, 1.15]]) };
  var DUO_BI = { path: [[0.8, 0.25, 1.1], [-0.8, 0.6, 0.95], [-2.6, 0.7, 0.75], [-4.1, 0.2, 0.3], [-4.8, -1.4, 0], [-4.9, -3.4, 0], [-4.3, -5.5, -0.5], [-2.2, -6.5, -1.2], [0.6, -6.6, -1.5], [2.5, -5.8, -1.6], [3.1, -4.0, -1.6]],
    r: profile([[0, 1.15], [0.08, 1.1], [1, 1.0]]) };
  var BI = {
    cat: 'upper', id: 'b1', short: 'Billroth I', ctOverride: { duo: 'contrast' },
    title: 'Resekcja dystalna żołądka sposobem Billroth I',
    sub: 'Zespolenie żołądkowo-dwunastnicze koniec-do-końca',
    notes: [
      'Usunięte antrum z odźwiernikiem; kikut żołądka zespolony bezpośrednio z dwunastnicą.',
      'Anatomia ciągła — do brodawki standardowym duodenoskopem, brodawka w typowej orientacji; droga krótsza niż w anatomii prawidłowej.',
      'W kontroli: refluks żółciowy do kikuta, owrzodzenie lub zwężenie w linii zespolenia, rak kikuta po latach.'
    ],
    frames: {
      resect: ['Zakres resekcji', 'Antrum z odźwiernikiem i początkiem opuszki dwunastnicy.', 'Zakres resekcji'],
      remove: ['Usunięcie preparatu', 'Dystalna część żołądka usunięta.', 'Usunięcie'],
      recon: ['Zespolenie Billroth I', 'Kikut żołądka zbliżony do dwunastnicy (mobilizacja sposobem Kochera) i zespolony koniec-do-końca.', 'Rekonstrukcja'],
      post: 'Ciągłość przewodu zachowana; treść pokarmowa i żółć spotykają się w dwunastnicy.',
      endoPost: 'Z kikuta żołądka przez zespolenie wprost do dwunastnicy. Brodawka w typowej orientacji.'
    },
    objects: [eso(), remObj(REM_BI, [2.35, 3.0]), specDG(), duoCutObj(),
      { id: 'duo', name: 'Dwunastnica', pre: tgDuoPre, post: DUO_BI, morph: [2.35, 3], color: COL.bowel, mucosa: 'circular', tint: MUC.bowel, labels: [L('Dwunastnica', 0.4, ALL)] },
      jejWhole()],
    marks: DG_CUTS.concat([ringAt(DUO_BI.path, DUO_BI.r, [0.9, 0.25, 1.1], { name: 'Zespolenie żołądkowo-dwunastnicze', color: COL.anast, opacity: ANAST_OP })]),
    papilla: { obj: 'duo', near: PAP.near, dir: PAP.dir },
    routePost: [{ obj: 'eso' }, { obj: 'rem', from: GEJ_IN, note: 'Kikut żołądka' }, { obj: 'duo', to: 'papilla', note: 'Za zespoleniem dwunastnica — brodawka w typowej orientacji' }]
  };

  /* ---------- Billroth II (+ Braun) ---------- */
  var AFF_B2 = [[3.1, -4.0, -1.6], [4.8, -4.4, -1.0], [5.8, -5.8, 0.2], [5.4, -7.4, 1.4], [4.4, -7.0, 2.4], [4.7, -4.4, 2.9], [4.9, -1.9, 2.5], [3.6, -0.2, 1.3]];
  var EFF_B2 = [[3.6, -0.2, 1.3], [2.3, -1.4, 2.6], [1.6, -3.6, 3.0], [1.9, -6.0, 3.0], [0.8, -8.0, 2.6], [-1.2, -9.0, 2.2], [-2.8, -10.6, 1.8], [-1.6, -12.6, 1.4], [1.0, -13.2, 1.0], [3.0, -14.2, 0.6]];
  var AFF_BR = [[3.1, -4.0, -1.6], [4.8, -4.4, -1.0], [5.8, -5.8, 0.2], [5.4, -7.4, 1.4], [4.2, -6.6, 2.6], [3.35, -4.9, 3.0], [4.4, -2.6, 2.7], [3.6, -0.2, 1.3]];
  var EFF_BR = [[3.6, -0.2, 1.3], [2.1, -1.4, 2.6], [1.7, -3.4, 3.1], [2.15, -4.9, 3.1], [1.4, -7.0, 2.8], [0.2, -8.6, 2.4], [-1.8, -9.6, 2.0], [-2.6, -11.4, 1.6], [-0.6, -12.8, 1.2], [1.8, -13.6, 0.8], [3.2, -14.4, 0.6]];
  function b2(braun) {
    var aff = braun ? AFF_BR : AFF_B2, eff = braun ? EFF_BR : EFF_B2, split = jejSplit([aff, eff]);
    var marks = DG_CUTS.concat([
      ringOn(C.JEJ, flat(1.0), split.cuts[0], { name: 'Pętla do zespolenia', color: COL.mark, opacity: [[2.0, 0], [2.05, 1], [2.35, 1], [2.5, 0]] }),
      ringAt(aff, flat(1.0), [3.6, -0.2, 1.3], { name: 'Zespolenie żołądkowo-jelitowe', color: COL.anast, opacity: ANAST_OP })
    ]);
    if (braun) marks.push({ kind: 'line', name: 'Zespolenie Brauna (bok-do-boku)', color: COL.anast, opacity: ANAST_OP, pts: [[2.75, -4.0, 4.0], [2.75, -4.9, 4.1], [2.75, -5.8, 4.0]] });
    return {
      cat: 'upper', id: braun ? 'b2br' : 'b2', short: braun ? 'Billroth II + Braun' : 'Billroth II',
      title: braun ? 'Billroth II z zespoleniem Brauna' : 'Resekcja dystalna żołądka sposobem Billroth II',
      sub: braun ? 'Pętla żołądkowo-jelitowa z zespoleniem jelitowo-jelitowym bok-do-boku' : 'Zamknięty kikut dwunastnicy, zespolenie żołądkowo-jelitowe z pętlą',
      notes: braun ? [
        'Jak Billroth II, a dodatkowo zespolenie bok-do-boku między pętlą doprowadzającą a odprowadzającą poniżej zespolenia żołądkowo-jelitowego.',
        'Cel: odbarczenie pętli doprowadzającej i częściowe odprowadzenie żółci z pominięciem kikuta żołądka; wpływ na refluks żółciowy niepewny, mniejszy niż po Roux-en-Y.',
        'W endoskopii dodatkowy otwór w obu pętlach: łatwo pomylić drogę do brodawki.'
      ] : [
        'Kikut dwunastnicy zamknięty; kikut żołądka zespolony z pętlą jelita czczego (pętla doprowadzająca i odprowadzająca).',
        'Do brodawki pętlą doprowadzającą, wstecznie do kikuta dwunastnicy — brodawka w odwróconej orientacji.',
        'W kontroli: zespół pętli doprowadzającej, refluks żółciowy, owrzodzenie brzeżne, rak kikuta po latach.'
      ],
      frames: {
        resect: ['Zakres resekcji', 'Antrum z odźwiernikiem i początkiem dwunastnicy. Zaznaczona pętla jelita czczego, która zostanie podciągnięta do kikuta.', 'Zakres resekcji'],
        remove: ['Usunięcie preparatu', 'Dystalna część żołądka usunięta; kikut dwunastnicy zamknięty.', 'Usunięcie'],
        recon: braun ? ['Pętla i zespolenie Brauna', 'Pętla jelita czczego podciągnięta do kikuta żołądka; poniżej zespolenie bok-do-boku między ramionami pętli.', 'Rekonstrukcja']
          : ['Zespolenie Billroth II', 'Pętla jelita czczego podciągnięta do kikuta żołądka: zespolenie żołądkowo-jelitowe koniec-do-boku.', 'Rekonstrukcja'],
        post: braun ? 'Żółta pętla doprowadzająca, niebieska odprowadzająca; zespolenie Brauna łączy je poniżej kikuta.' : 'Żółta pętla doprowadzająca (żółć, sok trzustkowy), niebieska pętla odprowadzająca.',
        endoPost: braun ? 'Z kikuta do pętli doprowadzającej; po drodze otwór zespolenia Brauna. Brodawka od strony dystalnej.'
          : 'Z kikuta żołądka wylot doprowadzający, wstecznie do kikuta dwunastnicy. Brodawka od strony dystalnej, w odwróconej orientacji.'
      },
      objects: [eso(), remObj(), specDG(), duoCutObj(), duoStumpObj(),
        { id: 'aff', name: 'Jelito czcze', postName: 'Pętla doprowadzająca', pre: split.parts[0], post: { path: aff, r: flat(1.0) }, morph: [2.35, 3],
          colors: [[2.35, COL.bowel], [2.95, COL.bp]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Jelito czcze', 0.5, PRE), L('Pętla doprowadzająca', 0.62, POST)] },
        { id: 'eff', name: 'Jelito czcze', postName: 'Pętla odprowadzająca', pre: split.parts[1], post: { path: eff, r: flat(1.0) }, morph: [2.35, 3],
          colors: [[2.35, COL.bowel], [2.95, COL.common]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Pętla odprowadzająca', 0.45, POST)] }],
      marks: marks,
      papilla: { obj: 'duo', near: PAP.near, dir: PAP.dir },
      routePost: [{ obj: 'eso' }, { obj: 'rem', from: GEJ_IN, note: 'Kikut żołądka' },
        { obj: 'aff', from: 1, to: 0, note: braun ? 'Wylot doprowadzający; po drodze otwór zespolenia Brauna' : 'Z zespolenia wylot doprowadzający — wstecznie do więzadła Treitza' },
        { obj: 'duo', from: 1, to: 'papilla', note: 'Kikut dwunastnicy od strony dystalnej — brodawka w odwróconej orientacji' }]
    };
  }

  /* ---------- Resekcja dystalna + Roux-en-Y ---------- */
  var ROUX_D = [[5.0, -0.2, 1.9], [3.9, -0.5, 1.8], [2.8, -1.6, 2.5], [2.0, -3.6, 3.0], [2.6, -5.6, 3.1], [1.2, -7.2, 2.9], [0.8, -8.8, 2.4], [2.6, -9.4, 1.9], [3.4, -9.9, 1.4]];
  var dgSplit = jejSplit([BP, ROUX_D, CC]);
  var DGRY = {
    cat: 'upper', id: 'dgry', short: 'Dystalna + Roux-en-Y',
    title: 'Resekcja dystalna żołądka z rekonstrukcją Roux-en-Y',
    sub: 'Zespolenie żołądkowo-jelitowe (GJ) na pętli Roux',
    notes: [
      'Kikut dwunastnicy zamknięty; pętla Roux do kikuta żołądka, zespolenie jelitowo-jelitowe (JJ) niżej.',
      'Droga do brodawki: kikut, GJ, pętla Roux, zespolenie JJ, wstecznie pętlą biliopankreatyczną.',
      'Mniej refluksu żółciowego niż po Billroth II; możliwe zaleganie w pętli Roux.'
    ],
    frames: {
      resect: ['Zakres resekcji', 'Antrum z odźwiernikiem i początkiem dwunastnicy; jelito czcze przecięte w początkowym odcinku.', 'Zakres resekcji'],
      remove: ['Usunięcie preparatu', 'Dystalna część żołądka usunięta; kikut dwunastnicy zamknięty.', 'Usunięcie'],
      recon: ['Rekonstrukcja Roux-en-Y', 'Dalszy koniec jelita czczego (pętla Roux) do kikuta żołądka: GJ. Bliższy koniec wszyty niżej: zespolenie JJ.', 'Rekonstrukcja'],
      post: 'Zielona pętla Roux prowadzi pokarm, żółta pętla biliopankreatyczna żółć i sok trzustkowy, niebieski kanał wspólny.',
      endoPost: 'Z kikuta przez GJ w pętlę Roux, przy zespoleniu JJ wstecznie pętlą biliopankreatyczną. Brodawka od strony dystalnej.'
    },
    objects: [eso(), remObj(), specDG(), duoCutObj(), duoStumpObj(),
      { id: 'bp', name: 'Jelito czcze', postName: 'Pętla biliopankreatyczna', pre: dgSplit.parts[0], post: { path: BP, r: flat(1.0) }, morph: [2.35, 3],
        colors: [[2.35, COL.bowel], [2.95, COL.bp]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Pętla biliopankreatyczna', 0.45, POST)] },
      { id: 'roux', name: 'Jelito czcze', postName: 'Pętla Roux (alimentacyjna)', pre: dgSplit.parts[1], post: { path: ROUX_D, r: BLIND }, morph: [2.35, 3],
        colors: [[2.35, COL.bowel], [2.95, COL.roux]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Jelito czcze', 0.5, PRE), L('Pętla Roux', 0.5, POST)] },
      { id: 'cc', name: 'Jelito czcze', postName: 'Kanał wspólny', pre: dgSplit.parts[2], post: { path: CC, r: flat(1.0) }, morph: [2.35, 3],
        colors: [[2.35, COL.bowel], [2.95, COL.common]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Kanał wspólny', 0.5, POST)] }],
    marks: DG_CUTS.concat([
      ringOn(C.JEJ, flat(1.0), dgSplit.cuts[0], { name: 'Przecięcie jelita czczego', color: COL.cut, opacity: CUT_OP_JEJ, late: true }),
      ringAt(ROUX_D, BLIND, [3.9, -0.5, 1.8], { name: 'Zespolenie żołądkowo-jelitowe (GJ)', color: COL.anast, opacity: ANAST_OP }),
      ringAt(CC, flat(1.0), [3.6, -9.9, 1.2], { name: 'Zespolenie jelitowo-jelitowe (JJ)', color: COL.anast, opacity: ANAST_OP })]),
    papilla: { obj: 'duo', near: PAP.near, dir: PAP.dir },
    routePost: [{ obj: 'eso' }, { obj: 'rem', from: GEJ_IN, note: 'Kikut żołądka' },
      { obj: 'roux', from: [3.9, -0.5, 1.8], note: 'Za GJ w dół pętlą Roux' },
      { obj: 'bp', from: 1, to: 0, note: 'Przy zespoleniu JJ zawróć wstecznie w pętlę biliopankreatyczną' },
      { obj: 'duo', from: 1, to: 'papilla', note: 'Dwunastnica od strony dystalnej — brodawka w odwróconej orientacji' }]
  };

  /* =====================================================================
     JELITO CIENKIE — resekcja odcinka i warianty zespolenia
     ===================================================================== */
  var STUMP_END = profile([[0, 1.0], [0.93, 1.0], [1, 0.06]]), STUMP_START = function (len) { var a = 1.2 / len; return profile([[0, 0.06], [a, 1.0], [1, 1.0]]); };
  var SUT = '#7457c9', STAPLE = '#8f99a3';
  function lenOf(p) { return curveOf(p).getLength(); }

