  /* =====================================================================
     TRZUSTKA I DROGI ŻÓŁCIOWE: Whipple, Traverso-Longmire (PPPD), HJ na pętli Roux
     ===================================================================== */
  var PANC = [[-2.6, -4.6, -0.9], [-2.2, -3.0, -1.0], [-0.6, -2.4, -1.5], [1.6, -2.4, -2.2], [3.6, -2.0, -2.6], [5.6, -1.2, -2.8], [6.8, -0.2, -2.6]];
  var C_PANC = curveOf(PANC);
  var PANC_R = profile([[0, 0.9], [0.06, 1.45], [0.2, 1.35], [0.3, 0.8], [0.5, 0.9], [0.85, 0.75], [1, 0.3]]);
  var CBD = [[-3.0, 7.6, -1.4], [-3.2, 5.4, -1.5], [-3.5, 3.0, -1.6], [-3.8, 0.6, -1.8], [-4.2, -1.4, -1.3], [-4.5, -2.5, -0.2]];
  var C_CBD = curveOf(CBD), CBD_R = flat(0.4);
  var GB = [[-3.3, 4.6, -1.5], [-3.9, 4.9, -1.0], [-4.6, 4.8, -0.3], [-5.5, 4.2, 0.5], [-6.1, 3.1, 1.2]];
  var GB_R = profile([[0, 0.18], [0.3, 0.22], [0.45, 0.7], [0.8, 1.0], [1, 0.1]]);
  var tNeck = nearestT(C_PANC, [-0.6, -2.4, -1.5]), tCHD = nearestT(C_CBD, [-3.25, 5.0, -1.5]), tLow = nearestT(C_CBD, [-3.8, 0.6, -1.8]);
  var tWJ = nearestT(C.JEJ, [5.0, -7.8, 0.6]), tCuff = nearestT(C.DUO, [-3.5, 0.55, 0.6]);
  var CHD_END = C_CBD.getPointAt(tCHD).toArray();
  var COL_H = { panc: '#e3bf73', bile: '#6fae3f', gb: '#5f9e3a' };
  var HPB_OFF = [[1.15, [0, 0, 0]], [1.9, [-6, -3, 6]]];
  function specOf(o) { o.colors = [[0, o.color || COL.bowel], [0.7, COL.spec]]; o.opacity = SPEC_OP; o.offset = HPB_OFF; delete o.color; return o; }
  function pancKeep(post) {
    var o = { id: 'panc', name: 'Trzustka (trzon i ogon)', organ: true, pre: sub(C_PANC, PANC_R, tNeck, 1, 30), color: COL_H.panc, labels: [L('Trzustka', 0.5, ALL)] };
    if (post) { o.post = { path: post, r: profile([[0, 0.75], [0.3, 0.85], [0.8, 0.75], [1, 0.3]]) }; o.morph = [2.35, 3]; }
    return o;
  }
  function hpbCommon(pppd) {
    return [
      eso(),
      pppd ? stomObj() : remObj(),
      pppd ? null : specDG(),
      pppd ? { id: 'cuff', name: 'Odźwiernik i mankiet dwunastnicy', pre: sub(C.DUO, DUO_R, 0, tCuff + 0.005, 12), color: COL.bowel, mucosa: 'circular', tint: MUC.bowel } : null,
      specOf({ id: 'duoSpec', name: 'Dwunastnica', pre: pppd ? sub(C.DUO, DUO_R, tCuff, 1, 50) : { path: DUO, r: DUO_R }, color: COL.bowel, mucosa: 'circular', tint: MUC.bowel, labels: [L('Dwunastnica', 0.35, PRE)] }),
      specOf({ id: 'pancHead', name: 'Głowa trzustki', organ: true, pre: sub(C_PANC, PANC_R, 0, tNeck + 0.01, 16), color: COL_H.panc, labels: [L('Głowa trzustki', 0.4, PRE)] }),
      pancKeep(null),
      { id: 'chd', name: 'Przewód wątrobowy wspólny', pre: sub(C_CBD, CBD_R, 0, tCHD, 12), color: COL_H.bile, mucosa: 'smooth', tint: '#d8c07a', labels: [L('Przewód wątrobowy wspólny', 0.3, ALL)] },
      specOf({ id: 'cbd', name: 'Przewód żółciowy wspólny', pre: sub(C_CBD, CBD_R, tCHD - 0.005, 1, 24), color: COL_H.bile, mucosa: 'smooth', tint: '#d8c07a', labels: [L('Przewód żółciowy wspólny', 0.5, PRE)] }),
      specOf(gbObj()),
      specOf({ id: 'jejSpec', name: 'Początek jelita czczego', pre: sub(C.JEJ, flat(1.0), 0, tWJ + 0.005, 14), color: COL.bowel, mucosa: 'circular', tint: MUC.bowel })
    ].filter(Boolean);
  }
  var C_JREST = curveOf(sub(C.JEJ, flat(1.0), tWJ, 1, 90).path);
  var BPL_PJ = [[0.4, -4.4, -1.0], [-0.5, -3.4, -1.3], [-1.3, -2.2, -1.45], [-2.0, 0.0, -1.6], [-2.7, 2.6, -1.6], [-3.0, 4.4, -1.2], [-2.9, 5.6, -0.6], [-1.6, 6.4, 0.8], [0.2, 4.4, 2.8], [1.2, 1.8, 3.3], [2.6, -0.1, 2.6], [3.4, -0.8, 1.6]];
  var BPL_PG = [[-1.6, 1.4, -1.8], [-2.4, 3.2, -1.7], [-3.0, 4.6, -1.2], [-2.9, 5.6, -0.6], [-1.6, 6.4, 0.8], [0.2, 4.4, 2.8], [1.2, 1.8, 3.3], [2.6, -0.1, 2.6], [3.4, -0.8, 1.6]];
  var EFF_W = [[3.4, -0.8, 1.6], [4.4, -2.6, 2.4], [3.4, -5.0, 2.8], [1.2, -6.4, 2.6], [-0.8, -8.4, 2.2], [0.6, -10.6, 1.8], [3.0, -11.2, 1.4], [4.6, -13, 1.0]];
  var BPL_PJ_P = [[0.4, -4.4, -1.0], [-0.5, -3.4, -1.3], [-1.3, -2.2, -1.45], [-2.0, 0.0, -1.9], [-2.7, 2.6, -1.8], [-3.0, 4.4, -1.2], [-3.2, 5.7, -0.4], [-4.6, 5.6, 0.8], [-5.5, 3.4, 1.5], [-5.4, 1.2, 1.3], [-4.7, -0.1, 0.9]];
  var BPL_PG_P = [[-1.6, 1.4, -2.0], [-2.4, 3.2, -1.8], [-3.0, 4.6, -1.2], [-3.2, 5.7, -0.4], [-4.6, 5.6, 0.8], [-5.5, 3.4, 1.5], [-5.4, 1.2, 1.3], [-4.7, -0.1, 0.9]];
  var EFF_P = [[-4.7, -0.1, 0.9], [-4.2, -2.2, 1.8], [-1.8, -4.2, 2.4], [1.0, -5.4, 2.6], [0.4, -8.0, 2.2], [2.4, -10.2, 1.8], [4.4, -11.8, 1.2]];
  var PANC_PG = [[3.9, 1.4, -1.3], [3.9, 0.3, -2.6], [4.6, -0.9, -2.9], [5.8, -1.0, -2.9], [6.8, -0.2, -2.6]];
  var HJ_AT = [-3.0, 5.0, -0.9];
  function whipple(pppd, pg) {
    var bplP = pppd ? (pg ? BPL_PG_P : BPL_PJ_P) : (pg ? BPL_PG : BPL_PJ), effP = pppd ? EFF_P : EFF_W, sp = splitBy(C_JREST, 1.0, [bplP, effP]);
    var gjAt = effP[0], gjName = pppd ? 'Zespolenie dwunastniczo-jelitowe (DJ)' : 'Zespolenie żołądkowo-jelitowe (GJ)';
    var objs = hpbCommon(pppd).map(function (o) { return o.id === 'panc' && pg ? pancKeep(PANC_PG) : o; });
    objs.push(
      { id: 'bpl', name: 'Jelito czcze', postName: 'Pętla doprowadzająca', pre: sp.parts[0], post: { path: bplP, r: BLIND }, morph: [2.35, 3],
        colors: [[2.35, COL.bowel], [2.95, COL.bp]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Jelito czcze', 0.5, PRE), L('Pętla doprowadzająca', 0.62, POST)] },
      { id: 'eff', name: 'Jelito czcze', postName: 'Pętla odprowadzająca', pre: sp.parts[1], post: { path: effP, r: flat(1.0) }, morph: [2.35, 3],
        colors: [[2.35, COL.bowel], [2.95, COL.common]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Pętla odprowadzająca', 0.45, POST)] });
    var marks = [
      pppd ? ringOn(C.DUO, DUO_R, tCuff, { name: 'Przecięcie dwunastnicy za odźwiernikiem', color: COL.cut, opacity: CUT_OP })
        : ringOn(C.STOM, STOMACH_R, tDG, { name: 'Przecięcie żołądka', color: COL.cut, opacity: CUT_OP }),
      ringOn(C.JEJ, flat(1.0), tWJ, { name: 'Przecięcie jelita czczego', color: COL.cut, opacity: CUT_OP }),
      ringOn(C_PANC, PANC_R, tNeck, { name: 'Przecięcie szyi trzustki', color: COL.cut, opacity: CUT_OP, noStapler: true }),
      ringOn(C_CBD, CBD_R, tCHD, { name: 'Przecięcie przewodu wątrobowego wspólnego', color: COL.cut, opacity: CUT_OP, noStapler: true }),
      ringOn(C_CBD, CBD_R, tCHD, { name: 'Zespolenie żółciowo-jelitowe (HJ)', color: COL.anast, opacity: ANAST_OP }),
      ringAt(effP, flat(1.0), gjAt, { name: gjName, color: COL.anast, opacity: ANAST_OP }),
      pg ? ringAt(PANC_PG, profile([[0, 0.75], [1, 0.3]]), [3.9, 0.9, -2.0], { name: 'Zespolenie trzustkowo-żołądkowe (PG)', color: COL.anast, opacity: ANAST_OP })
        : ringAt(BPL_PJ, BLIND, [-1.3, -2.2, -1.45], { name: 'Zespolenie trzustkowo-jelitowe (PJ)', color: COL.anast, opacity: ANAST_OP })
    ];
    var trio = (pg ? 'PG' : 'PJ') + ' + HJ + ' + (pppd ? 'DJ' : 'GJ');
    var pre = pppd ? [{ obj: 'eso' }, { obj: 'stom', from: GEJ_IN, note: pg ? 'Żołądek — na tylnej ścianie kikut trzustki (PG)' : 'Żołądek z zachowanym odźwiernikiem' }, { obj: 'cuff', note: 'Odźwiernik i mankiet dwunastnicy — zespolenie DJ' }]
      : [{ obj: 'eso' }, { obj: 'rem', from: GEJ_IN, note: pg ? 'Kikut żołądka — na tylnej ścianie kikut trzustki (PG)' : 'Kikut żołądka — zespolenie GJ' }];
    return {
      cat: 'hpb', id: (pppd ? 'pppd-' : 'whip-') + (pg ? 'pg' : 'pj'), short: trio, vshortDef: trio,
      title: pppd ? 'Pankreatoduodenektomia z zachowaniem odźwiernika (Traverso-Longmire)' : 'Pankreatoduodenektomia sposobem Whipple’a',
      sub: pppd ? 'PPPD (pylorus-preserving pancreatoduodenectomy): ' + trio : 'Klasyczna, z antrektomią: ' + trio,
      ctOverride: pppd ? { stom: 'contrast', cuff: 'contrast' } : {},
      notes: (pppd ? [
        'Zachowany cały żołądek z odźwiernikiem i 2–3 cm opuszki; zespolenie dwunastniczo-jelitowe (DJ) zamiast żołądkowo-jelitowego.',
        'Opóźnione opróżnianie żołądka (DGE): w metaanalizie Cochrane (2016, dowody niskiej jakości) częstsze niż po klasycznym Whipple’u; w badaniu randomizowanym PPPD vs resekcja samego odźwiernika (PROPP, 2018) bez istotnej różnicy.'
      ] : [
        'Usunięte en bloc: głowa trzustki, dwunastnica, dystalna część żołądka, dystalny odcinek przewodu żółciowego wspólnego z pęcherzykiem i początek jelita czczego.'
      ]).concat([
        pg ? 'Kikut trzustki wszyty w tylną ścianę żołądka (PG, zespolenie trzustkowo-żołądkowe); w endoskopii widoczny od strony światła żołądka.'
          : 'Zespolenie trzustkowo-jelitowe (PJ) przy ślepym końcu pętli, wyżej zespolenie żółciowo-jelitowe (HJ).',
        (pg ? 'Rekonstrukcja na jednej pętli: HJ, dalej ' + (pppd ? 'DJ' : 'GJ') + '.' : 'Rekonstrukcja na jednej pętli (sposobem Childa).') + ' Do HJ endoskopem prostym lub enteroskopem przez pętlę doprowadzającą.'
      ]),
      text: { normal: ['Anatomia prawidłowa', 'Żołądek, dwunastnica z brodawką, głowa trzustki, drogi żółciowe z pęcherzykiem i początek jelita czczego.'] },
      frames: {
        resect: ['Zakres resekcji', pppd ? 'Głowa trzustki z dwunastnicą (bez odźwiernika i mankietu opuszki), dystalny odcinek przewodu żółciowego wspólnego z pęcherzykiem i początek jelita czczego.'
          : 'Głowa trzustki z dwunastnicą, dystalna część żołądka, dystalny odcinek przewodu żółciowego wspólnego z pęcherzykiem i początek jelita czczego.', 'Zakres resekcji'],
        remove: ['Usunięcie preparatu', pppd ? 'Preparat usunięty en bloc; pozostaje cały żołądek z odźwiernikiem, trzon i ogon trzustki, przewód wątrobowy wspólny.'
          : 'Preparat usunięty en bloc; pozostaje kikut żołądka, trzon i ogon trzustki, przewód wątrobowy wspólny.', 'Usunięcie'],
        recon: ['Rekonstrukcja: ' + trio, (pg ? 'Kikut trzustki wszyty w tylną ścianę żołądka; pętla jelita czczego do przewodu wątrobowego (HJ), dalej ' : 'Pętla jelita czczego zaokrężniczo (przez krezkę poprzecznicy): zespolenie trzustkowo-jelitowe, wyżej żółciowo-jelitowe, dalej (przed- lub zaokrężniczo) ')
          + (pppd ? 'dwunastniczo-jelitowe.' : 'żołądkowo-jelitowe.'), 'Rekonstrukcja'],
        post: 'Żółta pętla doprowadzająca (żółć' + (pg ? '' : ' i sok trzustkowy') + '), niebieska pętla odprowadzająca.',
        endoPost: (pppd ? 'Przez odźwiernik i mankiet dwunastnicy do DJ' : 'Z kikuta żołądka przez GJ') + ': wybór pętli doprowadzającej (do HJ) albo odprowadzającej.'
      },
      objects: objs,
      marks: marks,
      papilla: { obj: 'duoSpec', near: PAP.near, dir: PAP.dir },
      routePost: { prefix: pre, branches: [
        { label: 'Pętla doprowadzająca', sub: 'do zespolenia żółciowo-jelitowego (HJ)', steps: [{ obj: 'bpl', from: 1, to: HJ_AT, note: 'Pętla doprowadzająca w górę — do HJ' }], target: CHD_END, endText: 'Zespolenie żółciowo-jelitowe (HJ) w polu widzenia' },
        { label: 'Pętla odprowadzająca', sub: 'dalej treść pokarmowa', steps: [{ obj: 'eff', to: pppd ? [1.0, -5.4, 2.6] : [1.2, -6.4, 2.6], note: 'Pętla odprowadzająca' }] }
      ] }
    };
  }

  /* ---------- Hepatikojejunostomia na pętli Roux ---------- */
  var ROUX_HJ = [[-2.1, 6.5, -0.3], [-2.95, 5.2, -0.95], [-2.9, 3.8, 1.0], [-2.2, 2.6, 2.6], [-1.1, 0.2, 3.4], [0.6, -2.8, 3.9], [1.6, -6.0, 3.4], [0.8, -8.2, 2.6], [2.6, -9.4, 1.9], [3.4, -9.9, 1.4]];
  var HJ = (function () {
    var sp = jejSplit([BP, ROUX_HJ, CC]);
    return {
      cat: 'hpb', id: 'hj', short: 'Hepatikojejunostomia',
      title: 'Hepatikojejunostomia na pętli Roux', sub: 'Tu: resekcja zewnątrzwątrobowych dróg żółciowych z cholecystektomią (np. torbiel przewodu żółciowego wspólnego); HJ (hepaticojejunostomy)',
      ctOverride: { stom: 'contrast', duo: 'contrast' },
      notes: [
        'Np. po uszkodzeniu dróg żółciowych, przy torbieli przewodu żółciowego wspólnego lub łagodnym zwężeniu. Po uszkodzeniu lub w zwężeniu zwykle bez resekcji przewodu: HJ powyżej zwężenia, często na wysokości konfluencji (Hepp–Couinaud); pęcherzyk zwykle już usunięty.',
        'Pętla Roux (typowo 40–60 cm) do przewodu wątrobowego wspólnego; zespolenie jelitowo-jelitowe (JJ) niżej.',
        'Brodawka Vatera pozostaje, ale dystalny kikut przewodu jest zamknięty. Do HJ endoskopowo przez pętlę Roux, wstecznie od JJ — zwykle enteroskopem wspomaganym, przy krótszej pętli także kolonoskopem pediatrycznym; alternatywnie dostęp EUS lub przezskórny.'
      ],
      text: { normal: ['Anatomia prawidłowa', 'Żołądek, dwunastnica z brodawką, drogi żółciowe z pęcherzykiem, trzustka i jelito czcze.'] },
      frames: {
        resect: ['Zakres resekcji', 'Zewnątrzwątrobowe drogi żółciowe od przewodu wątrobowego wspólnego do górnego brzegu trzustki, z pęcherzykiem żółciowym (przy torbieli wycięcie sięga też części wewnątrztrzustkowej przewodu); jelito czcze przecięte na pętlę Roux.', 'Zakres resekcji'],
        remove: ['Usunięcie preparatu', 'Drogi żółciowe usunięte; dystalny kikut przewodu zamknięty.', 'Usunięcie'],
        recon: ['Rekonstrukcja Roux-en-Y', 'Pętla Roux do przewodu wątrobowego wspólnego (HJ, koniec-do-boku); niżej zespolenie jelitowo-jelitowe (JJ).', 'Rekonstrukcja'],
        post: 'Zielona pętla Roux prowadzi żółć z HJ, żółta pętla doprowadzająca (dwunastniczo-czcza) — pokarm i sok trzustkowy, niebieski kanał wspólny.',
        endoPost: 'Przez żołądek i dwunastnicę do zespolenia JJ: wybór pętli Roux (wstecznie do HJ) albo kanału wspólnego.'
      },
      objects: [
        eso(),
        stomObj(),
        { id: 'duo', name: 'Dwunastnica', pre: { path: DUO, r: DUO_R }, colors: [[2.35, COL.bowel], [2.95, COL.bp]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Dwunastnica', 0.35, ALL)] },
        pancAllObj(),
        { id: 'chd', name: 'Przewód wątrobowy wspólny', pre: sub(C_CBD, CBD_R, 0, tCHD, 12), color: COL_H.bile, mucosa: 'smooth', tint: '#d8c07a', labels: [L('Przewód wątrobowy wspólny', 0.3, ALL)] },
        specOf({ id: 'cbd', name: 'Przewód żółciowy wspólny', pre: sub(C_CBD, CBD_R, tCHD - 0.005, tLow + 0.005, 16), color: COL_H.bile, mucosa: 'smooth', tint: '#d8c07a', labels: [L('Przewód żółciowy wspólny', 0.5, PRE)] }),
        { id: 'cbdLow', name: 'Kikut przewodu żółciowego', pre: sub(C_CBD, CBD_R, tLow, 1, 12), post: { path: sub(C_CBD, CBD_R, tLow, 1, 12).path, r: profile([[0, 0.05], [0.12, 0.4], [1, 0.4]]) }, morph: [2.0, 2.3],
          color: COL_H.bile, mucosa: 'smooth', tint: '#d8c07a' },
        specOf(gbObj()),
        { id: 'bp', name: 'Jelito czcze', postName: 'Pętla doprowadzająca (dwunastniczo-czcza)', pre: sp.parts[0], post: { path: BP, r: flat(1.0) }, morph: [2.35, 3],
          colors: [[2.35, COL.bowel], [2.95, COL.bp]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Pętla doprowadzająca (dwunastniczo-czcza)', 0.45, POST)] },
        { id: 'roux', name: 'Jelito czcze', postName: 'Pętla Roux', lenPost: 'typowo 40–60 cm', pre: sp.parts[1], post: { path: ROUX_HJ, r: BLIND }, morph: [2.35, 3],
          colors: [[2.35, COL.bowel], [2.95, COL.roux]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Jelito czcze', 0.5, PRE), L('Pętla Roux', 0.5, POST, 'typowo 40–60 cm')] },
        { id: 'cc', name: 'Jelito czcze', postName: 'Kanał wspólny', pre: sp.parts[2], post: { path: CC, r: flat(1.0) }, morph: [2.35, 3],
          colors: [[2.35, COL.bowel], [2.95, COL.common]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Kanał wspólny', 0.5, POST)] }
      ],
      marks: [
        ringOn(C_CBD, CBD_R, tCHD, { name: 'Przecięcie przewodu wątrobowego wspólnego', color: COL.cut, opacity: CUT_OP, noStapler: true }),
        ringOn(C_CBD, CBD_R, tLow, { name: 'Przecięcie przewodu nad trzustką', color: COL.cut, opacity: CUT_OP, noStapler: true }),
        ringOn(C.JEJ, flat(1.0), sp.cuts[0], { name: 'Przecięcie jelita czczego', color: COL.cut, opacity: CUT_OP_JEJ }),
        ringOn(C_CBD, CBD_R, tCHD, { name: 'Zespolenie żółciowo-jelitowe (HJ)', color: COL.anast, opacity: ANAST_OP }),
        ringAt(CC, flat(1.0), [3.6, -9.9, 1.2], { name: 'Zespolenie jelitowo-jelitowe (JJ)', color: COL.anast, opacity: ANAST_OP })
      ],
      papilla: { obj: 'duo', near: PAP.near, dir: PAP.dir },
      routePost: { prefix: [{ obj: 'eso' }, { obj: 'stom', from: GEJ_IN, note: 'Żołądek' }, { obj: 'duo', note: 'Dwunastnica — brodawka pozostaje, kikut przewodu nad nią zamknięty' },
        { obj: 'bp', note: 'Jelito czcze do zespolenia jelitowo-jelitowego' }], branches: [
        { label: 'Pętla Roux', sub: 'wstecznie do HJ', steps: [{ obj: 'roux', from: 1, to: [-2.95, 5.0, -0.6], note: 'Pętla Roux wstecznie — do zespolenia żółciowo-jelitowego' }], target: CHD_END, endText: 'Zespolenie żółciowo-jelitowe (HJ) w polu widzenia' },
        { label: 'Kanał wspólny', sub: 'dalej w dół', steps: [{ obj: 'cc', note: 'Kanał wspólny' }] }
      ] }
    };
  })();


  /* ---------- Pankreatektomia dystalna ze splenektomią ---------- */
  var SPLEEN = [[6.9, 0.6, -3.4], [7.9, 2.2, -3.0], [8.3, 3.9, -2.2]], SPLEEN_R = profile([[0, 0.3], [0.2, 1.3], [0.6, 1.5], [1, 0.3]]);
  var DP = (function () {
    var tDP = nearestT(C_PANC, [1.4, -2.4, -2.15]), OFF = [[1.15, [0, 0, 0]], [1.9, [6, 1, 5]]];
    var head = sub(C_PANC, PANC_R, 0, tDP, 24);
    return {
      cat: 'hpb', id: 'dp', short: 'Pankreatektomia dystalna', title: 'Pankreatektomia dystalna ze splenektomią',
      sub: 'Resekcja trzonu i ogona trzustki na lewo od żyły krezkowej górnej, ze śledzioną; kikut zamknięty staplerem liniowym',
      notes: ['Wskazania: nowotwory trzonu i ogona trzustki, nowotwory torbielowate, guzy neuroendokrynne; przy zmianach łagodnych możliwe zachowanie śledziony.',
        'Przewód pokarmowy bez zmian — endoskopia i ECPW (endoskopowa cholangiopankreatografia wsteczna) jak w anatomii prawidłowej; przewód trzustkowy krótki, zakończony w kikucie.',
        'Najczęstsze powikłanie: przetoka trzustkowa z kikuta; po splenektomii szczepienia przeciw bakteriom otoczkowym.'],
      text: { normal: ['Anatomia prawidłowa', 'Żołądek, dwunastnica z brodawką, drogi żółciowe, trzustka, śledziona i jelito czcze.'] },
      frames: {
        resect: ['Zakres resekcji', 'Trzon i ogon trzustki ze śledzioną; przecięcie trzustki staplerem liniowym na lewo od żyły krezkowej górnej.', 'Zakres resekcji'],
        remove: ['Usunięcie preparatu', 'Trzon i ogon trzustki ze śledzioną usunięte; kikut trzustki zamknięty linią zszywek.', 'Usunięcie'],
        post: 'Głowa i szyja trzustki z kikutem zamkniętym staplerem; brak śledziony. Przewód pokarmowy bez zmian.',
        endoPost: 'Anatomia przewodu pokarmowego bez zmian — do brodawki standardowo.'
      },
      skipRecon: true,
      objects: [eso(),
        stomObj(),
        duoObj(),
        { id: 'pancHead', name: 'Głowa i szyja trzustki', organ: true, pre: head, post: { path: head.path, r: function (t) { return t > 0.9 ? head.r(t) * (1 - 0.35 * sm01((t - 0.9) / 0.1)) : head.r(t); } }, morph: [1.6, 1.9],
          color: COL_H.panc, labels: [L('Głowa trzustki', 0.3, ALL), L('Kikut trzustki', 0.95, POST)] },
        specOf({ id: 'pancTail', name: 'Trzon i ogon trzustki', organ: true, pre: sub(C_PANC, PANC_R, tDP, 1, 20), color: COL_H.panc, labels: [L('Trzon i ogon trzustki', 0.5, PRE)] }),
        specOf({ id: 'spleen', name: 'Śledziona', organ: true, pre: { path: SPLEEN, r: SPLEEN_R }, color: '#8d3f4f', labels: [L('Śledziona', 0.5, PRE)] }),
        { id: 'chd', name: 'Drogi żółciowe', pre: { path: CBD, r: CBD_R }, color: COL_H.bile, mucosa: 'smooth', tint: '#d8c07a', labels: [L('Przewód żółciowy wspólny', 0.45, ALL)] },
        { id: 'gb', name: 'Pęcherzyk żółciowy', pre: { path: GB, r: GB_R }, color: COL_H.gb, mucosa: 'smooth', tint: '#9fae6a', labels: [L('Pęcherzyk żółciowy', 0.8, ALL)] },
        jejObj()],
      marks: [ringOn(C_PANC, PANC_R, tDP, { name: 'Przecięcie trzustki (stapler liniowy)', color: COL.cut, opacity: [[0.05, 0], [0.55, 1]] })],
      papilla: { obj: 'duo', near: PAP.near, dir: PAP.dir },
      routePost: [{ obj: 'eso' }, { obj: 'stom', from: GEJ_IN, note: 'Żołądek bez zmian' }, { obj: 'duo', to: 'papilla', note: 'Dwunastnica — brodawka w typowej orientacji' }]
    };
  })();

  /* ---------- Operacje drenujące przewód trzustkowy: Puestow (Partington–Rochelle) i Frey ---------- */
  function pancOn(t, dy, dz) { var p = C_PANC.getPointAt(t); return [p.x, p.y + dy, p.z + dz]; }
  function drainAnat(frey) {
    var tail = [0.94, 0.8, 0.65, 0.5, 0.38].map(function (t) { return pancOn(t, 0, 1.3); });
    // w obu operacjach przewód otwarty aż do głowy (Partington–Rochelle: bez wydrążenia), więc pętla Roux sięga głowy
    var ROUXP = tail.concat([pancOn(0.26, -0.3, 1.35), pancOn(0.14, -0.3, 1.45), pancOn(0.05, -0.4, 1.55), [-1.6, -5.6, 1.9], [0.0, -6.9, 2.9], [0.8, -8.2, 2.6], [2.6, -9.4, 1.9], [3.4, -9.9, 1.4]]);
    var sp = jejSplit([BP, ROUXP, CC]);
    var tEnd = nearestT(curveOf(ROUXP), pancOn(0.05, -0.4, 1.55));
    var ROUXP_R = function (t) { var r = t < tEnd ? 0.8 : t < tEnd + 0.08 ? 0.8 + 0.2 * sm01((t - tEnd) / 0.08) : 1.0; return t < 0.03 ? Math.max(0.06, r * sm01(t / 0.03)) : r; };
    // żołądek uniesiony (dostęp przez torbę sieciową), połączenia z przełykiem i odźwiernikiem bez zmian
    var STOM_UP = STOMACH.map(function (p, i) { var k = [0, 0.3, 0.8, 1, 1, 0.7, 0.2, 0][i] || 0; return [p[0], p[1] + 0.9 * k, p[2] + 0.5 * k]; });
    var duct = []; for (var t = frey ? 0.04 : 0.08; t <= 0.945; t += 0.05) duct.push(pancOn(t, -0.1, frey && t < 0.3 ? 1.2 : 0.95));
    var marks = [
      { kind: 'line', name: 'Otwarcie przewodu trzustkowego' + (frey ? ' (z wydrążeniem głowy)' : ''), noStapler: true, color: COL.cut, opacity: [[0.05, 0], [0.55, 1], [2.3, 1], [2.6, 0]], pts: duct },
      ringOn(C.JEJ, flat(1.0), sp.cuts[0], { name: 'Przecięcie jelita czczego', color: COL.cut, opacity: CUT_OP_JEJ }),
      { kind: 'line', name: 'Zespolenie trzustkowo-jelitowe bok-do-boku', color: SUT, opacity: ANAST_OP, pts: duct.map(function (p) { return [p[0], p[1] - 0.15, p[2] + 0.35]; }) },
      ringAt(CC, flat(1.0), [3.6, -9.9, 1.2], { name: 'Zespolenie jelitowo-jelitowe (JJ)', color: COL.anast, opacity: ANAST_OP })
    ];
    if (frey) { var hc = C_PANC.getPointAt(0.12), core = []; for (var i = 0; i < 40; i++) { var a = i / 40 * Math.PI * 2; core.push([hc.x + 1.0 * Math.cos(a), hc.y + 0.8 * Math.sin(a), hc.z + 1.25]); }
      marks.splice(1, 0, { kind: 'loop', name: 'Wydrążenie głowy trzustki (Frey)', color: COL.cut, dash: 0.2, opacity: [[0.05, 0], [0.55, 1], [2.3, 1], [2.6, 0]], pts: core }); }
    var an = {
      cat: 'hpb', id: frey ? 'frey' : 'puestow', short: frey ? 'Frey' : 'Puestow (Partington–Rochelle)',
      title: frey ? 'Operacja Freya: wydrążenie głowy trzustki i podłużne zespolenie trzustkowo-jelitowe' : 'Operacja Puestowa (modyfikacja Partingtona–Rochelle’a): podłużne zespolenie trzustkowo-jelitowe',
      sub: 'Przewlekłe zapalenie trzustki z poszerzonym przewodem trzustkowym; zespolenie bok-do-boku z pętlą Roux',
      notes: [frey ? 'Frey: miejscowe wydrążenie głowy trzustki (usunięcie zwapnień i tkanki zapalnej) i otwarcie przewodu na całej długości; jedno zespolenie z pętlą Roux obejmujące głowę, trzon i ogon.'
          : 'Puestow w modyfikacji Partingtona–Rochelle’a: przewód trzustkowy otwarty podłużnie od ogona przez trzon do głowy (do ok. 1 cm od dwunastnicy) i zespolony bok-do-boku z pętlą Roux; bez wydrążenia głowy i bez resekcji miąższu.',
        frey ? 'Leczy też ból z głowy trzustki (zwykle „rozrusznik” zapalenia), przy mniejszym zakresie niż resekcja głowy.' : 'Warunek: poszerzony przewód trzustkowy (zwykle ≥ 7 mm); nie usuwa zmian w głowie trzustki.',
        'Przewód pokarmowy do brodawki bez zmian; pętla Roux dostępna endoskopowo tylko wstecznie od zespolenia jelitowo-jelitowego (JJ).'],
      text: { normal: ['Przewlekłe zapalenie trzustki', 'Trzustka z poszerzonym przewodem trzustkowym (schemat); żołądek, dwunastnica, drogi żółciowe i jelito czcze.'] },
      frames: {
        resect: [frey ? 'Wydrążenie głowy i otwarcie przewodu' : 'Otwarcie przewodu', frey ? 'Przewód trzustkowy otwarty podłużnie od głowy do ogona, głowa trzustki miejscowo wydrążona; jelito czcze przecięte na pętlę Roux.' : 'Przewód trzustkowy otwarty podłużnie od ogona do głowy; jelito czcze przecięte na pętlę Roux.', 'Otwarcie'],
        remove: ['Ułożenie pętli Roux', 'Pętla Roux przeprowadzona zaokrężniczo i ułożona wzdłuż otwartego przewodu.', 'Ułożenie'],
        recon: ['Zespolenie bok-do-boku', 'Pętla otwarta na tej samej długości i zespolona z brzegami otwartej trzustki; niżej zespolenie jelitowo-jelitowe.', 'Zespolenie'],
        post: 'Zielona pętla Roux wzdłuż trzustki (ślepy koniec przy ogonie), żółta pętla doprowadzająca (dwunastniczo-czcza), niebieski kanał wspólny.',
        endoPost: 'Przez żołądek i dwunastnicę do zespolenia JJ: wybór pętli Roux (wstecznie wzdłuż trzustki) albo kanału wspólnego.'
      },
      objects: [eso(),
        { id: 'stom', name: 'Żołądek', pre: { path: STOMACH, r: STOMACH_R }, post: { path: STOM_UP, r: STOMACH_R }, morph: [1.2, 1.9], color: COL.stomach, mucosa: 'rugae', tint: MUC.stomach, labels: [L('Żołądek', 0.35, ALL)] },
        { id: 'duo', name: 'Dwunastnica', pre: { path: DUO, r: DUO_R }, colors: [[2.35, COL.bowel], [2.95, COL.bp]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Dwunastnica', 0.35, ALL)] },
        pancAllObj(),
        { id: 'chd', name: 'Drogi żółciowe', pre: { path: CBD, r: CBD_R }, color: COL_H.bile, mucosa: 'smooth', tint: '#d8c07a', labels: [L('Przewód żółciowy wspólny', 0.45, ALL)] },
        { id: 'gb', name: 'Pęcherzyk żółciowy', pre: { path: GB, r: GB_R }, color: COL_H.gb, mucosa: 'smooth', tint: '#9fae6a' },
        { id: 'bp', name: 'Jelito czcze', postName: 'Pętla doprowadzająca (dwunastniczo-czcza)', pre: sp.parts[0], post: { path: BP, r: flat(1.0) }, morph: [2.0, 3],
          colors: [[2.35, COL.bowel], [2.95, COL.bp]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Pętla doprowadzająca (dwunastniczo-czcza)', 0.45, POST)] },
        { id: 'roux', name: 'Jelito czcze', postName: 'Pętla Roux', lenPost: 'typowo 40–60 cm', pre: sp.parts[1], post: { path: ROUXP, r: ROUXP_R }, morph: [2.0, 3],
          colors: [[2.35, COL.bowel], [2.95, COL.roux]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Jelito czcze', 0.5, PRE), L('Pętla Roux', 0.3, POST, 'wzdłuż otwartego przewodu')] },
        { id: 'cc', name: 'Jelito czcze', postName: 'Kanał wspólny', pre: sp.parts[2], post: { path: CC, r: flat(1.0) }, morph: [2.0, 3],
          colors: [[2.35, COL.bowel], [2.95, COL.common]], mucosa: 'circular', tint: MUC.bowel, labels: [L('Kanał wspólny', 0.5, POST)] }],
      marks: marks, papilla: { obj: 'duo', near: PAP.near, dir: PAP.dir },
      routePost: { prefix: [{ obj: 'eso' }, { obj: 'stom', from: GEJ_IN, note: 'Żołądek' }, { obj: 'duo', note: 'Dwunastnica — brodawka bez zmian' }, { obj: 'bp', note: 'Jelito czcze do zespolenia jelitowo-jelitowego' }], branches: [
        { label: 'Pętla Roux', sub: 'wstecznie wzdłuż trzustki', steps: [{ obj: 'roux', from: 1, to: 0.04, note: 'Pętla Roux wstecznie — wzdłuż zespolenia z otwartym przewodem trzustkowym' }], target: ROUXP[0], endText: 'Ślepy koniec pętli przy ogonie trzustki' },
        { label: 'Kanał wspólny', sub: 'dalej w dół', steps: [{ obj: 'cc', note: 'Kanał wspólny' }] }
      ] }
    };
    return an;
  }

  /* ---------- Choledochoduodenostomia bok-do-boku ---------- */
  var CDD = (function () {
    var CBD_POST = [[-3.0, 7.6, -1.4], [-3.2, 5.4, -1.5], [-3.4, 3.2, -1.3], [-3.3, 1.35, -0.5], [-3.9, 0.0, -1.35], [-4.2, -1.4, -1.3], [-4.5, -2.5, -0.2]];
    var cA = V([-3.3, 1.35, -0.5]), dP = C.DUO.getPointAt(nearestT(C.DUO, cA.toArray())), n = dP.clone().sub(cA).normalize();
    var mid = cA.clone().lerp(dP, 0.42), u = new THREE.Vector3().crossVectors(n, new THREE.Vector3(0, 1, 0)).normalize(), v = new THREE.Vector3().crossVectors(n, u).normalize();
    var ring = [], ringE = []; for (var i = 0; i < 48; i++) { var a = i / 48 * Math.PI * 2; ring.push(mid.clone().addScaledVector(u, 0.62 * Math.cos(a)).addScaledVector(v, 0.62 * Math.sin(a)).toArray()); ringE.push(mid.clone().addScaledVector(u, 0.55 * Math.cos(a)).addScaledVector(v, 0.55 * Math.sin(a)).toArray()); }
    var tA2 = nearestT(curveOf(CBD_POST), cA.toArray());
    var an = {
      cat: 'hpb', id: 'cdd', short: 'Choledochoduodenostomia', title: 'Choledochoduodenostomia bok-do-boku',
      sub: 'Zespolenie przewodu żółciowego wspólnego z opuszką dwunastnicy powyżej jej górnego brzegu; zwykle z cholecystektomią',
      notes: ['Wskazania: poszerzony przewód żółciowy wspólny (zwykle ≥ 1,5 cm) z nawracającą kamicą przewodową lub łagodnym zwężeniem dystalnym, zwłaszcza u starszych chorych.',
        'Zespolenie szerokie (≥ 1,5–2 cm), jednowarstwowe; brodawka Vatera pozostaje.',
        'Zespół ślepego worka (sump syndrome): odcinek przewodu między zespoleniem a brodawką gromadzi złogi i resztki pokarmu — zapalenie dróg żółciowych, zapalenie trzustki. Leczenie z wyboru: ECPW ze sfinkterotomią i oczyszczeniem odcinka dystalnego.',
        'Endoskopowo: przez zespolenie w opuszce do dróg żółciowych (cholangioskopia, usuwanie złogów) albo standardowo do brodawki.'],
      text: { normal: ['Anatomia wyjściowa', 'Poszerzony przewód żółciowy wspólny za opuszką dwunastnicy; pęcherzyk żółciowy, trzustka, żołądek.'] },
      frames: {
        resect: ['Nacięcia', 'Podłużne nacięcie przedniej ściany przewodu żółciowego wspólnego nad dwunastnicą i poprzeczne opuszki; cholecystektomia.', 'Nacięcia'],
        remove: ['Cholecystektomia i zbliżenie', 'Pęcherzyk usunięty; przewód i opuszka zbliżone bez napięcia.', 'Zbliżenie'],
        recon: ['Zespolenie bok-do-boku', 'Szew jednowarstwowy; zespolenie szerokie, rombowate.', 'Zespolenie'],
        post: 'Przewód żółciowy uchodzi szeroko do opuszki; poniżej odcinek do brodawki (ślepy worek).',
        endoPost: 'Przez żołądek do opuszki: wybór — przez zespolenie do dróg żółciowych albo dalej do brodawki.'
      },
      objects: [eso(),
        stomObj(),
        duoObj(),
        pancAllObj(),
        { id: 'cbd', name: 'Przewód żółciowy wspólny', pre: { path: CBD, r: flat(0.62) }, post: { path: CBD_POST, r: flat(0.62) }, morph: [2.0, 2.9], color: COL_H.bile, mucosa: 'smooth', tint: '#d8c07a',
          labels: [L('Poszerzony przewód żółciowy wspólny', 0.35, PRE), L('Przewód żółciowy wspólny', 0.3, POST), L('Ślepy worek do brodawki', 0.82, POST)] },
        specOf(gbObj()),
        jejObj()],
      marks: [
        { kind: 'line', name: 'Nacięcie przewodu żółciowego', noStapler: true, color: COL.cut, opacity: CUT_OP, pts: [[-3.25, 2.4, -0.9], [-3.3, 1.6, -0.95], [-3.45, 0.8, -1.2]] },
        { kind: 'loop', name: 'Zespolenie żółciowo-dwunastnicze (bok-do-boku)', color: SUT, opacity: ANAST_OP, endo: true, dash: 0.2, pts: ring, endoPts: ringE }
      ],
      papilla: { obj: 'duo', near: PAP.near, dir: PAP.dir },
      routePost: { prefix: [{ obj: 'eso' }, { obj: 'stom', from: GEJ_IN, note: 'Żołądek' }, { obj: 'duo', to: dP.toArray(), note: 'Opuszka — zespolenie na tylnej ścianie' }], branches: [
        { label: 'Drogi żółciowe', sub: 'przez zespolenie', steps: [{ obj: 'cbd', from: tA2, to: 0.03, note: 'Przez zespolenie w górę przewodu żółciowego' }], target: CBD_POST[0], endText: 'Wnęka wątroby — przewód wątrobowy wspólny' },
        { label: 'Brodawka', sub: 'dalej dwunastnicą', steps: [{ obj: 'duo', from: dP.toArray(), to: 'papilla', note: 'Dwunastnica do brodawki' }], target: 'papilla', endText: 'Brodawka Vatera w polu widzenia' }
      ] }
    };
    return an;
  })();

