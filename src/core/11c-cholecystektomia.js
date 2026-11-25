/* =====================================================================
   CHOLECYSTEKTOMIA LAPAROSKOPOWA — model wątroby, pęcherzyka i dróg żółciowych z ANAT.LIVER (10-watroba.js), narzędzie TOOL_EXT.chole (12-cholecystektomia.js).
   Dodane: tętnica pęcherzykowa (od tętnicy wątrobowej prawej w trójkącie wątrobowo-pęcherzykowym), tkanka trójkąta, węzeł pęcherzykowy (Mascagniego),
   płytka pęcherzykowa (łoże). Oś czasu m: 0 anatomia, 0–1 preparowanie trójkąta i oddzielenie dolnej części pęcherzyka od łoża (CVS w m = 1),
   1–2 klipsy i przecięcie przewodu i tętnicy, 2–3 wycięcie pęcherzyka z łoża, 3 stan po.
   Źródła: Strasberg, Hertl, Soper, J Am Coll Surg 1995 (krytyczny widok bezpieczeństwa); SAGES Safe Cholecystectomy; Brunt i wsp., Ann Surg 2020
   (wytyczne zapobiegania uszkodzeniom dróg żółciowych, MI 2020); Strasberg i wsp., J Am Coll Surg 2016 (cholecystektomia częściowa).
   ===================================================================== */
(function (root) {
  'use strict';
  var A = root.ANAT, LV = A.LIVER, V3 = THREE.Vector3;
  function ves(kind, id) { return LV.vessels[kind].filter(function (v) { return v.id === id; })[0]; }
  function cv(pts) { return new THREE.CatmullRomCurve3(pts.map(function (p) { return new V3().fromArray(p); }), false, 'centripetal'); }
  var CYD = ves('bd', 'cyd').pts, RHA = ves('ha', 'rha').pts, CHD = ves('bd', 'chd').pts, GBP = LV.vessels.gb.pts;
  // tętnica pęcherzykowa: od tętnicy wątrobowej prawej (za przewodem wątrobowym wspólnym) przez trójkąt do szyjki i trzonu pęcherzyka
  var cRHA = cv(RHA), tCA = A.nearestT(cRHA, [-1.25, -4.05, -0.35]), CA0 = cRHA.getPointAt(tCA).toArray();
  var CA = [CA0, [-1.5, -4.6, 0.2], [-1.8, -4.8, 0.55], [-2.0, -4.7, 0.85]];
  // klipsy: t na krzywej od pęcherzyka (0) do ujścia (1) dla przewodu; od tętnicy wątrobowej prawej (0) do pęcherzyka (1) dla tętnicy
  var CLIPS = { duct: { keep: [0.82, 0.71], spec: [0.36], cut: 0.53 }, art: { keep: [0.2, 0.32], spec: [0.78], cut: 0.55 } };
  A.CHOLE = {
    CYD: CYD, CA: CA, CHD: CHD, GB: GBP, CLIPS: CLIPS,
    node: [-2.25, -4.75, 1.05],                              // węzeł pęcherzykowy (Mascagniego / Calota) przy szyjce
    bedDir: [0.1, 0.72, -0.69],                              // od osi pęcherzyka ku łożu (ku wątrobie)
    lift: [-1.0, -0.45, 0.4],                                // kieszonka Hartmanna odciągnięta w bok i w dół (otwiera trójkąt), szyjka odsunięta od łoża
    retract: [-0.35, -0.05, 0.94],                           // oś pęcherzyka po uniesieniu dna (od szyjki ku dnu), poza miąższem
    specOff: [-1.2, -2.6, 5.2],                              // kierunek usunięcia pęcherzyka
    show: { pv: ['pv', 'rpv', 'lpv'], ha: ['cha', 'gda', 'pha', 'rha', 'lha'], bd: ['cbd', 'chd', 'rhd', 'lhd'] }
  };
  var NOTES = [
    'Najczęstsze wskazanie: objawowa kamica pęcherzyka żółciowego i jej powikłania (ostre zapalenie pęcherzyka, zapalenie trzustki pochodzenia żółciowego, kamica przewodowa po oczyszczeniu dróg żółciowych).',
    'Trójkąt wątrobowo-pęcherzykowy (Calota): ograniczony przewodem pęcherzykowym, przewodem wątrobowym wspólnym i dolną powierzchnią wątroby; zawiera tętnicę pęcherzykową i węzeł chłonny pęcherzykowy (Mascagniego).',
    'Krytyczny widok bezpieczeństwa (CVS, Strasberg 1995) przed założeniem klipsów: 1) trójkąt oczyszczony z tkanki tłuszczowej i włóknistej, 2) dolna część pęcherzyka (ok. 1/3) oddzielona od łoża — widoczna płytka pęcherzykowa, 3) do pęcherzyka wchodzą dwie i tylko dwie struktury: przewód i tętnica pęcherzykowa. CVS dokumentuje się zdjęciem lub nagraniem.',
    'Gdy CVS nie da się bezpiecznie uzyskać (ciężki stan zapalny, zatarte struktury): cholecystektomia częściowa (subtotalna), zaczynanie od dna pęcherzyka, cholangiografia śródoperacyjna, konwersja albo drenaż (cholecystostomia) — zamiast dalszego preparowania w trójkącie.',
    'Najgroźniejsze powikłanie: uszkodzenie dróg żółciowych — najczęściej pomylenie przewodu żółciowego wspólnego z pęcherzykowym. Klipsy tylko na strukturach jednoznacznie rozpoznanych; preparowanie powyżej rowka Rouvière’a.',
    'Schemat: proporcje uproszczone; odmiany przebiegu tętnicy pęcherzykowej (np. podwójna, od tętnicy wątrobowej właściwej lub lewej) i przewodu pęcherzykowego (krótki, uchodzący nisko lub do przewodu prawego) są częste.'
  ];
  var CAM = { t: [-1.5, -5.0, 0.6], az: 25, el: -12, k: 0.42 }, CAM_W = { t: [-1.5, -5.6, 0.6], az: 22, el: -14, k: 0.6 };
  var CH = { cat: 'hpb', id: 'chole', short: 'Cholecystektomia', title: 'Cholecystektomia laparoskopowa',
    sub: 'Trójkąt wątrobowo-pęcherzykowy (Calota), krytyczny widok bezpieczeństwa (CVS), klipsy na przewodzie i tętnicy pęcherzykowej, wycięcie pęcherzyka z łoża',
    notes: NOTES, objects: [], marks: [], cutTools: [{ type: 'chole' }], anastTools: [], commonCuts: 0, mEnd: 3, single: true, box: [[-6, -13, -3], [3, 0, 5]],
    singleFrames: [
      { k: 'normal', kind: 'orbit', m0: 0, m1: 0, cam: 'custom', camP: CAM_W, short: 'Anatomia', title: 'Anatomia: pęcherzyk i drogi żółciowe',
        cap: 'Widok od dołu i z przodu, pod dolną powierzchnię wątroby. Przewód pęcherzykowy łączy się z przewodem wątrobowym wspólnym w przewód żółciowy wspólny; tętnica pęcherzykowa odchodzi od tętnicy wątrobowej prawej i biegnie w trójkącie wątrobowo-pęcherzykowym, w tkance tłuszczowej.' },
      { k: 'dis', kind: 'orbit', m0: 0, m1: 1, dur: 5, cam: 'custom', camP: CAM, short: 'Trójkąt Calota', title: 'Preparowanie trójkąta wątrobowo-pęcherzykowego',
        cap: 'Kieszonka Hartmanna odciągnięta w bok i w dół, dno pęcherzyka ku górze. Tkanka tłuszczowa i włóknista trójkąta usuwana; dolna część pęcherzyka oddzielana od łoża (płytki pęcherzykowej).' },
      { k: 'cvs', kind: 'orbit', m0: 1, m1: 1, cam: 'custom', camP: CAM, short: 'CVS', title: 'Krytyczny widok bezpieczeństwa (CVS)',
        cap: 'Trzy warunki: trójkąt oczyszczony; dolna część pęcherzyka oddzielona od łoża (widoczna płytka pęcherzykowa); do pęcherzyka wchodzą dwie i tylko dwie struktury — przewód i tętnica pęcherzykowa. Dopiero wtedy klipsy.' },
      { k: 'clip', kind: 'orbit', m0: 1, m1: 2, dur: 6, cam: 'custom', camP: CAM, short: 'Klipsy', title: 'Klipsy i przecięcie',
        cap: 'Na przewodzie i tętnicy pęcherzykowej po dwa klipsy od strony chorego i jeden od strony pęcherzyka.',
        caps: [[1, 'Na przewodzie i tętnicy pęcherzykowej po dwa klipsy od strony chorego i jeden od strony pęcherzyka.'], [1.66, 'Przewód i tętnica przecięte nożyczkami między klipsami; na kikutach zostają po dwa klipsy.']] },
      { k: 'remove', kind: 'orbit', m0: 2, m1: 3, dur: 4.5, cam: 'custom', camP: CAM_W, short: 'Wycięcie z łoża', title: 'Wycięcie pęcherzyka z łoża',
        cap: 'Pęcherzyk oddzielony od łoża wątroby w warstwie między ścianą pęcherzyka a płytką pęcherzykową (koagulacja), od szyjki do dna; usunięty w worku przez port w pępku lub w nadbrzuszu.' },
      { k: 'post', kind: 'orbit', m0: 3, m1: 3, cam: 'custom', camP: CAM_W, short: 'Po operacji', title: 'Stan po cholecystektomii',
        cap: 'Kikut przewodu pęcherzykowego i kikut tętnicy pęcherzykowej z klipsami; przewód wątrobowy wspólny i żółciowy wspólny nienaruszone; łoże pęcherzyka na dolnej powierzchni wątroby.' }
    ] };
  var PROC = { cat: 'hpb', id: 'chole', short: CH.short, title: CH.title, variants: [CH] };
  var at = A.PROCS.length; A.PROCS.forEach(function (p, i) { if (p.cat === 'hpb' && i < at) at = i; });
  A.PROCS.splice(at, 0, PROC);
})(typeof window !== 'undefined' ? window : globalThis);
