/* =====================================================================
   BADANIA RANDOMIZOWANE (projekt ECOPOP): ETHOS, SCAR
   Każde badanie = dwa ramiona (A, B) w formacie zabiegu, pokazywane obok siebie (split screen).
   Treść wyłącznie na poziomie rejestru badań; szczegóły wg aktualnej wersji protokołu.
   ===================================================================== */
(function (root) {
  'use strict';
  var A = root.ANAT, K = A._lib, THREE = root.THREE, V3 = THREE.Vector3;
  var C = K.colors(), W = K.windows(), COL = C.COL, COLC = C.COLC, C_COL = K.C_COL, COL_R = K.COL_R;
  var LESION = '#7d1a26', TATTOO = '#1d2433', SCAR = '#ece6dc', CLIP = '#aeb6be';

  // punkt na ścianie okrężnicy: oś, kierunek do ściany (prostopadły do osi, możliwie bliski pref), promień
  function wallAt(t, pref, rot) {
    var P = C_COL.getPointAt(t), T = C_COL.getTangentAt(t), n = new V3().fromArray(pref);
    n.sub(T.clone().multiplyScalar(n.dot(T))).normalize();
    if (rot) n.applyAxisAngle(T, rot);
    return { P: P, T: T, n: n, r: COL_R(t) };
  }
  // krótka rura wzdłuż promienia ściany: od powierzchni zewnętrznej (out) w głąb światła (depth); poza światłem przewodu (organ)
  function wallBump(id, name, w, out, depth, prof, color, extra) {
    var a = w.P.clone().addScaledVector(w.n, w.r + out), b = w.P.clone().addScaledVector(w.n, w.r - depth);
    var o = { id: id, name: name, organ: true, noEndo: true, hu: 60, pre: { path: [a.toArray(), a.clone().lerp(b, 0.5).toArray(), b.toArray()], r: K.profile(prof) }, color: color, labels: [] };
    for (var k in extra) o[k] = extra[k];
    return o;
  }
  var DOME = [[0, 0.05], [0.12, 0.62], [0.5, 0.56], [0.8, 0.38], [1, 0.05]];
  var FLAT = [[0, 0.05], [0.3, 0.36], [0.7, 0.36], [1, 0.05]];
  function lesion(w, extra) { return wallBump('lesion', 'Rak wczesny (T1)', w, 0.06, 0.5, DOME, LESION, extra); }
  function scar(w, name, extra) { return wallBump('scar', name, w, 0.03, 0.12, [[0, 0.05], [0.25, 0.55], [0.75, 0.55], [1, 0.05]], SCAR, extra); }
  function tattoos(w0, extra) {
    return [-0.9, 0.9].map(function (rot, i) {
      var o = wallBump('tattoo' + (i + 1), 'Tatuaż tuszem', wallAt(w0.t, w0.pref, rot), 0.03, 0.1, FLAT, TATTOO, extra);
      if (i === 0) o.labels = [K.L('Tatuaż (znakowanie tuszem)', 0.5, W.ALL)];
      return o;
    });
  }
  function clipMark(w, opacity) {
    return { kind: 'ring', name: 'Klips OTSC', color: CLIP, pos: w.P.clone().addScaledVector(w.n, w.r - 0.05).toArray(), tan: w.n.toArray(), r: 0.5, opacity: opacity };
  }
  // krezka z naczyniami i węzłami: wspólny generator (04-jelito-grube.js); w badaniach zawsze widoczna
  function mesoDef(removed) { var d = K.mesoRight(removed ? 'rh' : 'keep'); d.always = true; return d; }
  function wholeColon() {
    return [K.tiObj({}), K.appObj({}), K.colObj('colon', 0, 1, { name: 'Jelito grube' })];
  }

  /* ---------- ramię endoskopowe: EFTR (pełnościenna resekcja endoskopowa) ---------- */
  // czas m (po przygotowaniu): 0–3; narzędzie w oknie EFTR_W, klips zamyka ścianę w chwili CLIP_T
  var EFTR_W = [0.15, 2.85], CLIP_T = EFTR_W[0] + 0.6 * (EFTR_W[1] - EFTR_W[0]), CUT_T = EFTR_W[0] + 0.7 * (EFTR_W[1] - EFTR_W[0]);
  function eftrArm(o) {
    var w = o.w, objs = wholeColon().concat(o.target(w), tattoos(o.tat));
    var an = K.prepare({
      cat: 'colon', id: o.id, short: o.short, title: o.title, sub: o.sub, notes: o.notes, text: W.COL_TEXT,
      focus: { t: [-3.2, -1.2, 1.4], k: 1.12 }, focusVar: { t: w.P.clone().addScaledVector(w.n, 1.2).toArray(), k: 0.66 },
      frames: { resect: ['', '', ''], remove: ['', '', ''], post: '', endoPost: '' },
      objects: objs, marks: [clipMark(w, [[0, 0]])]
    });
    // klatki kluczowe w skali po przygotowaniu (0–3)
    an.objects.forEach(function (ob) { if (ob.id === 'lesion' || ob.id === 'scar') ob.opacity = [[CUT_T + 0.35, 1], [CUT_T + 0.75, 0]]; });
    an.marks[0].opacity = [[CLIP_T - 0.005, 0], [CLIP_T, 1]];
    an.cutTools = an.cutTools.concat([mesoDef(false), { type: 'eftr', w: EFTR_W, clipT: CLIP_T, cutT: CUT_T, target: o.targetId, at: w.P.toArray(), n: w.n.toArray(), r: w.r, t: o.w.t }]);
    an.trialCaps = o.caps;
    return an;
  }
  var EFTR_CAPS = function (what) {
    return [[0, 'Kolonoskop z nasadką FTRD (full-thickness resection device) prowadzony do ' + what + '.'],
      [EFTR_W[0] + 0.42 * (EFTR_W[1] - EFTR_W[0]), 'Ściana ' + (what === 'zmiany' ? 'ze zmianą' : 'z blizną') + ' wciągnięta do nasadki na całą grubość.'],
      [CLIP_T, 'Klips OTSC (over-the-scope clip) zaciśnięty u podstawy — zamyka ścianę.'],
      [CUT_T, 'Odcięcie pętlą nad klipsem; preparat w nasadce.'],
      [2.9, 'Okrężnica zachowana; krezka i węzły chłonne pozostają; w ścianie zostaje klips OTSC.']];
  };

  /* ---------- ramię chirurgiczne: resekcja segmentarna (hemikolektomia prawa) ---------- */
  function surgArm(o) {
    var B = K.rhAnat(true), sp = { offset: W.RH_OFF };
    var tgt = o.target(o.w, { offset: W.RH_OFF, opacity: [[1.6, 1], [1.9, 0]] });
    B.objects = B.objects.concat([tgt], tattoos(o.tat, { offset: W.RH_OFF, opacity: [[1.6, 1], [1.9, 0]] }));
    var an = K.prepare(B);
    an.cutTools = an.cutTools.concat([mesoDef(true)]);
    an.id = o.id; an.short = o.short; an.title = o.title; an.sub = o.sub; an.notes = o.notes;
    an.focus = { t: [-3.2, -1.2, 1.4], k: 1.12 }; an.focusVar = { t: o.w.P.clone().addScaledVector(o.w.n, 1.2).toArray(), k: 0.66 };
    an.trialCaps = [[0, 'Zakres resekcji: prawa połowa okrężnicy razem ' + o.withWhat + ' i krezką z węzłami chłonnymi (limfadenektomia).'],
      [1.2, 'Podwiązanie naczyń u odejścia (centralne podwiązanie); przecięcie jelita krętego i poprzecznicy staplerem liniowym.'],
      [2, 'Preparat usunięty razem z krezką i węzłami chłonnymi.'],
      [3, 'Zespolenie krętniczo-poprzeczne bok-do-boku staplerem liniowym.'], [4.95, 'Ciągłość przewodu odtworzona; odcinek okrężnicy usunięty.']];
    return an;
  }

  /* ---------- położenie zmian ---------- */
  var tL = K.colT([-7.45, -1.8, 0.05]), PREF = [0.55, 0, 1];
  var W_L = wallAt(tL, PREF); W_L.t = tL;
  var TAT = { t: K.colT([-7.25, 1.6, 0]), pref: PREF };

  var FUND = 'ECOPOP — Horizon Europe, umowa nr 101156165; sponsor wg rejestru: Norwegian Department of Health and Social Affairs';
  var NOTE = 'Schemat edukacyjny; szczegóły wg aktualnej wersji protokołu.';
  function trial(meta, arms) {
    arms[0].vshort = meta.arms[0]; arms[1].vshort = meta.arms[1];
    return { cat: 'trials', id: meta.id, short: meta.acronym, title: meta.title, split: true, trial: meta, keys: meta.keys, published: meta.published !== false, variants: arms };
  }

  var ETHOS = trial({
    id: 'ethos', acronym: 'ETHOS', title: 'ETHOS — leczenie endoskopowe czy operacja we wczesnym raku okrężnicy',
    full: 'Endoscopic THerapy Or Surgery for early colon cancer', nct: 'NCT06940947',
    pi: 'Michael Bretthauer (Oslo)', role: 'współkierownik badania (co-PI), Gdańsk',
    population: 'Wiek ≥ 40 lat; nowo rozpoznany rak okrężnicy (bez odbytnicy), makroskopowo podejrzenie naciekania podśluzówki, średnica ≤ 20 mm; w biopsji bez cech wysokiego ryzyka (G3, pączkowanie guza Bd2–Bd3, naciek naczyń chłonnych lub krwionośnych — LVI); w obrazowaniu cT1–2N0M0.',
    randomisation: 'Randomizacja 1:1.',
    arms: ['A: eFTR', 'B: Resekcja segmentarna'],
    armsLong: ['A: pełnościenna resekcja endoskopowa (eFTR) — nasadka FTRD, klips OTSC, odcięcie pętlą; narząd zachowany.', 'B: standardowa resekcja segmentarna okrężnicy z limfadenektomią (otwarta, laparoskopowa lub robotowa); tu: hemikolektomia prawa przy zmianie w okrężnicy wstępującej.'],
    primary: 'Współpierwszorzędowe: ciężkie zdarzenia niepożądane, ponowne hospitalizacje i zgony w ciągu 30 dni; nawrót raka, przerzuty (węzłowe lub odległe) lub zgon z powodu raka jelita grubego po 3 latach.',
    secondary: '',
    followUp: 'Oba ramiona wg ESMO 2020 (rak okrężnicy miejscowy): wywiad, badanie i CEA co 3–6 mies. przez 3 lata, potem co 6–12 mies. do 5 lat; kolonoskopia po roku, potem co 3–5 lat (w ramieniu A ocena blizny i klipsa); TK klatki piersiowej i brzucha co 6–12 mies. przez 3 lata — do rozważenia przy wyższym ryzyku nawrotu.',
    startCap: 'Rak okrężnicy wstępującej do 2 cm, uniesiony z zagłębieniem (Paris 0-IIa+IIc), z podejrzeniem naciekania podśluzówki; dystalnie dwa tatuaże tuszem.',
    postCap: 'A: okrężnica z krezką i węzłami chłonnymi zachowana, w ścianie klips OTSC. B: odcinek okrężnicy usunięty razem z krezką i węzłami chłonnymi, zespolenie krętniczo-poprzeczne.',
    keys: 'ECOPOP EFTR FTRD OTSC T1'
  }, [
    eftrArm({ id: 'ethos-a', short: 'ETHOS — ramię A', title: 'ETHOS, ramię A: pełnościenna resekcja endoskopowa (eFTR)', sub: 'Nasadka FTRD na kolonoskopie, klips OTSC, odcięcie pętlą; narząd zachowany',
      notes: [], w: W_L, tat: TAT, target: function (w) { return [lesion(w, { labels: [K.L('Rak wczesny (T1)', 0.3, W.ALL)] })]; }, targetId: 'lesion', caps: EFTR_CAPS('zmiany') }),
    surgArm({ id: 'ethos-b', short: 'ETHOS — ramię B', title: 'ETHOS, ramię B: resekcja segmentarna okrężnicy z limfadenektomią', sub: 'Tu: hemikolektomia prawa (zmiana w okrężnicy wstępującej)',
      notes: [], w: W_L, tat: TAT, target: function (w, ex) { var o = lesion(w, ex); o.labels = [K.L('Rak wczesny (T1)', 0.3, [-9, 2.4])]; return o; }, withWhat: 'ze zmianą' })
  ]);

  var SCAR_T = trial({
    id: 'scar', acronym: 'SCAR', title: 'SCAR — operacja czy resekcja endoskopowa po niedoszczętnym usunięciu wczesnego raka okrężnicy',
    full: 'Surgery versus Endoscopic Resection for incompletely removed early colon CAnceR', nct: 'NCT06057350',
    pi: 'Nastazja Dagny Pilonis (Warszawa)', role: 'ośrodek GUMed w konsorcjum (główny badacz ośrodka: Jarosław Kobiela)',
    population: 'Wiek ≥ 40 lat; rak okrężnicy pT1 usunięty endoskopowo niedoszczętnie (R1) lub z niepewnym marginesem (Rx), bez cech wysokiego ryzyka; miejsce resekcji identyfikowalne (tatuaż lub blizna); w TK bez choroby poza T1N0M0.',
    randomisation: 'Randomizacja 1:1 (stratyfikacja: R1 vs Rx, ASA).',
    arms: ['A: eFTR blizny', 'B: Resekcja segmentarna'],
    armsLong: ['A: pełnościenne wycięcie endoskopowe (eFTR) miejsca po resekcji endoskopowej z klipsem.', 'B: resekcja segmentarna okrężnicy (jak w ETHOS); tu: hemikolektomia prawa.'],
    primary: 'Współpierwszorzędowe: ciężkie zdarzenia niepożądane (Clavien-Dindo III–V) w ciągu 30 dni; nawrót lub przerzuty w ciągu 3 lat.',
    secondary: 'W rejestrze 11, m.in.: nawrót po 1 i 5 latach, przeżycie swoiste i całkowite po 1, 3 i 5 latach, ciężkie powikłania w ciągu roku, czas hospitalizacji, ponowne przyjęcia, sukces techniczny, ślad węglowy, jakość życia (EORTC QLQ-C30).',
    followUp: 'Obserwacja 5 lat, wizyty kontrolne wg protokołu; pierwszorzędowe punkty końcowe po 30 dniach i 3 latach.',
    startCap: 'Blizna po niedoszczętnym endoskopowym usunięciu raka pT1 (R1 lub Rx), oznaczona tatuażem.',
    postCap: 'A: miejsce po resekcji endoskopowej wycięte na całą grubość, krezka i węzły chłonne zachowane, klips w ścianie. B: odcinek okrężnicy usunięty razem z krezką i węzłami chłonnymi.',
    keys: 'ECOPOP EFTR eFTR R1 Rx T1'
  }, [
    eftrArm({ id: 'scar-a', short: 'SCAR — ramię A', title: 'SCAR, ramię A: pełnościenne wycięcie blizny (eFTR)', sub: 'Nasadka FTRD, klips OTSC, odcięcie pętlą; narząd zachowany',
      notes: [], w: W_L, tat: TAT, target: function (w) { return [scar(w, 'Blizna po resekcji endoskopowej', { labels: [K.L('Blizna po resekcji endoskopowej', 0.5, W.ALL)] })]; }, targetId: 'scar', caps: EFTR_CAPS('blizny') }),
    surgArm({ id: 'scar-b', short: 'SCAR — ramię B', title: 'SCAR, ramię B: resekcja segmentarna okrężnicy', sub: 'Tu: hemikolektomia prawa',
      notes: [], w: W_L, tat: TAT, target: function (w, ex) { var o = scar(w, 'Blizna po resekcji endoskopowej', ex); o.labels = [K.L('Blizna po resekcji endoskopowej', 0.5, [-9, 2.4])]; return o; }, withWhat: 'z blizną' })
  ]);

  var ALL_TRIALS = [ETHOS, SCAR_T];
  A.TRIALS = ALL_TRIALS;
  A.CATS.push({ id: 'trials', name: 'Badania' });
  ALL_TRIALS.forEach(function (t) { if (t.published || root.__SG_PREVIEW) A.PROCS.push(t); });
  A.TRIAL_NOTE = NOTE; A.TRIAL_FUND = FUND;
})(typeof window !== 'undefined' ? window : globalThis);
