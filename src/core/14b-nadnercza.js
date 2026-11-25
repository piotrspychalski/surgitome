/* =====================================================================
   ENDOKRYNOLOGIA — NADNERCZA: adrenalektomia laparoskopowa przezotrzewnowa boczna (Gagner), strona prawa i lewa.
   Model przestrzeni zaotrzewnowej w układzie modelu wątroby (ANAT.LIVER, 10-watroba.js): x+ lewa strona chorego, y+ dogłowowo, z+ do przodu, 1 j. ≈ 1 cm;
   żyła główna dolna w rowku wątroby (x −1,6, z −4,6). Nadnercza — pole odległości („ostrze” wzdłuż krzywej: szerokość hw, grubość th):
   prawe trójkątne, za żyłą główną dolną i nad górnym biegunem nerki; lewe półksiężycowate, przyśrodkowo od górnego bieguna nerki, bocznie od aorty,
   za trzustką. Żyła nadnerczowa prawa — krótka, do tylno-bocznej ściany żyły głównej dolnej; lewa — w dół do żyły nerkowej lewej, z żyłą przeponową dolną.
   Narzędzie TOOL_EXT.adrenal (src/app/12-nadnercza.js); dostęp: ANAT.ACCESS['adr-r' | 'adr-l'] (powłoki ANAT.BODY przeniesione: xf).
   Źródła: Gagner i wsp., Ann Surg 1997 (technika, trokary, żyły); Yip i wsp., JAMA Surg 2022 (AAES); Lenders i wsp., J Clin Endocrinol Metab 2014
   (guz chromochłonny); Cesmebasi i wsp., Clin Anat 2014 (anatomia nadnerczy i ich naczyń).
   ===================================================================== */
(function (root) {
  'use strict';
  var A = root.ANAT, N = A.NECK;
  // nadnercze: ostrze wzdłuż łamanej P, kierunek szerokości W (prostopadły do stycznej), połowa szerokości hw(u), grubość th(u)
  function blade(P, W, hw, th) {
    var Q = N.poly(P), Wn = Math.hypot(W[0], W[1], W[2]), W0 = [W[0] / Wn, W[1] / Wn, W[2] / Wn];
    return function (x, y, z) {
      var best = 1e9, bs = null, bt = 0;
      for (var i = 0; i < Q.S.length; i++) {
        var s = Q.S[i], t = ((x - s.a[0]) * s.d[0] + (y - s.a[1]) * s.d[1] + (z - s.a[2]) * s.d[2]) / (s.l * s.l); t = t < 0 ? 0 : t > 1 ? 1 : t;
        var px = s.a[0] + s.d[0] * t - x, py = s.a[1] + s.d[1] * t - y, pz = s.a[2] + s.d[2] * t - z, dd = px * px + py * py + pz * pz;
        if (dd < best) { best = dd; bs = s; bt = t; }
      }
      var u = (bs.s + bs.l * bt) / Q.L, T = [bs.d[0] / bs.l, bs.d[1] / bs.l, bs.d[2] / bs.l], k = W0[0] * T[0] + W0[1] * T[1] + W0[2] * T[2];
      var Wx = W0[0] - k * T[0], Wy = W0[1] - k * T[1], Wz = W0[2] - k * T[2], wl = Math.hypot(Wx, Wy, Wz); Wx /= wl; Wy /= wl; Wz /= wl;
      var vx = x - (bs.a[0] + bs.d[0] * bt), vy = y - (bs.a[1] + bs.d[1] * bt), vz = z - (bs.a[2] + bs.d[2] * bt), w = vx * Wx + vy * Wy + vz * Wz, rx = vx - w * Wx, ry = vy - w * Wy, rz = vz - w * Wz;
      return Math.sqrt(Math.pow(Math.max(Math.abs(w) - hw(u), 0), 2) + rx * rx + ry * ry + rz * rz) - th(u);
    };
  }
  function ellD(c, ax, r) {   // elipsoida o osiach ax[0..2] (jednostkowe) i półosiach r
    return function (x, y, z) { var v = [x - c[0], y - c[1], z - c[2]], s = 0; for (var i = 0; i < 3; i++) { var q = (v[0] * ax[i][0] + v[1] * ax[i][1] + v[2] * ax[i][2]) / r[i]; s += q * q; } return (Math.sqrt(s) - 1) * Math.min(r[0], r[1], r[2]); };
  }
  function nrm(v) { var l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function frame(long, hint) { var L = nrm(long), h = nrm(hint), d = h[0] * L[0] + h[1] * L[1] + h[2] * L[2], T = nrm([h[0] - d * L[0], h[1] - d * L[1], h[2] - d * L[2]]); return [T, L, cross(T, L)]; }

  /* ---------- nerki (elipsoidy, górny biegun przyśrodkowo i ku tyłowi), nadnercza ---------- */
  var KID = {
    R: { c: [-6.0, -8.8, -7.4], ax: frame([0.22, 1, -0.18], [1, 0, 0.35]), r: [2.6, 5.4, 2.0] },
    L: { c: [6.2, -7.6, -7.5], ax: frame([-0.22, 1, -0.18], [1, 0, -0.35]), r: [2.6, 5.4, 2.0] }
  };
  var ADR = {
    R: { P: [[-3.35, 0.9, -7.3], [-3.42, -1.0, -7.1], [-3.45, -2.8, -6.95]], W: [-0.5, 0, -0.87], hw: function (u) { return 0.35 + 0.95 * Math.pow(u, 0.8); }, th: function (u) { return 0.26 + 0.1 * u; } },
    L: { P: [[3.25, -0.4, -7.3], [3.0, -2.6, -6.9], [3.2, -4.8, -6.4], [3.65, -6.4, -5.95]], W: [-0.15, 0, -1], hw: function (u) { return 0.5 + 0.42 * Math.sin(Math.PI * u); }, th: function (u) { return 0.25 + 0.05 * Math.sin(Math.PI * u); } }
  };
  ['R', 'L'].forEach(function (k) { var D = ADR[k]; D.sdf = blade(D.P, D.W, D.hw, D.th); KID[k].sdf = ellD(KID[k].c, KID[k].ax, KID[k].r); });
  var SPLEEN = { c: [9.5, -0.6, -5.4], ax: frame([0.3, -0.5, 0.81], [1, 0.1, -0.45]), r: [1.9, 5.6, 3.3] };
  var V = {
    ivc: [[-1.6, -17, -4.4], [-1.6, -10, -4.6], [-1.6, -2, -4.6], [-1.6, 4, -4.6], [-1.3, 7.5, -3.6]],
    aorta: [[0.9, -17, -6.9], [1.0, -8, -7.0], [0.95, 0, -7.05], [0.6, 4.5, -6.8]],
    crusR: [[-1.25, -12, -8.4], [-1.35, -6, -8.0], [-0.95, -1, -7.35], [-0.2, 2.5, -6.5]], crusL: [[2.6, -11, -8.5], [2.5, -6, -8.2], [2.1, -1, -7.75], [1.2, 2.5, -6.6]],
    rrv: [[-4.15, -9.0, -6.3], [-3.0, -9.2, -5.55], [-2.3, -9.3, -5.0]], rra: [[0.4, -8.7, -7.5], [-1.6, -8.9, -6.45], [-3.4, -9.1, -6.65], [-4.3, -9.0, -6.95]],
    lrv: [[4.4, -8.0, -6.4], [3.0, -8.8, -5.65], [1.0, -9.4, -5.35], [-0.4, -9.6, -4.9], [-0.9, -9.7, -4.6]], lra: [[1.8, -8.6, -7.15], [3.2, -8.4, -6.95], [4.4, -8.0, -6.85]],
    lgv: [[4.1, -16, -5.4], [3.7, -11, -5.6], [3.45, -9.0, -5.6]],
    // żyły nadnerczowe: od gruczołu do żyły głównej dolnej (prawa) / nerkowej lewej (lewa); żyła przeponowa dolna lewa
    rav: [[-2.95, -1.4, -6.3], [-2.62, -1.35, -5.85], [-2.32, -1.3, -5.42]],
    lav: [[3.7, -6.55, -5.85], [3.5, -7.6, -5.65], [3.2, -8.55, -5.58]],
    lipv: [[1.9, 2.0, -6.9], [2.05, -1.5, -6.35], [2.35, -4.6, -5.85], [3.3, -6.95, -5.62]],
    // tętnice nadnerczowe: przeponowe dolne z gałęziami górnymi, środkowe z aorty, dolne z tętnic nerkowych
    ripa: [[0.6, -1.8, -7.7], [-0.9, -0.6, -8.0], [-2.8, 0.6, -8.05], [-4.6, 1.5, -7.7]], rmaa: [[0.3, -3.4, -7.65], [-1.6, -3.0, -7.45], [-2.75, -2.3, -7.05]], riaa: [[-3.4, -9.1, -6.65], [-3.55, -5.5, -7.1], [-3.45, -3.2, -7.05]],
    lipa: [[1.6, -1.8, -7.7], [2.4, -0.2, -8.0], [3.6, 1.4, -7.9]], lmaa: [[1.9, -4.4, -7.25], [2.9, -4.4, -6.85]], liaa: [[3.2, -8.4, -6.95], [3.55, -7.2, -6.75], [3.8, -6.6, -6.5]],
    // trzustka (głowa, trzon, ogon), naczynia śledzionowe, pień trzewny, tętnica krezkowa górna, dwunastnica, zagięcie śledzionowe okrężnicy
    panc: [[-2.6, -9.8, -1.9], [-0.5, -8.6, -2.2], [1.6, -7.4, -3.0], [4.4, -5.6, -4.0], [6.6, -3.6, -4.3], [7.3, -2.9, -4.4]],
    sv: [[7.5, -2.7, -5.1], [6.8, -3.5, -5.1], [4.4, -5.7, -4.85], [1.6, -7.5, -3.95], [-0.4, -8.4, -3.3]],
    sa: [[1.0, -4.2, -6.0], [1.0, -4.6, -4.6], [2.6, -4.4, -3.7], [4.6, -4.0, -3.3], [6.6, -2.2, -3.5], [8.0, -1.4, -4.2]],
    cha: [[1.0, -4.6, -4.6], [-1.0, -5.0, -3.2], [-2.0, -5.4, -2.0]], sma: [[1.0, -6.3, -6.0], [1.0, -7.3, -4.5], [0.8, -11, -3.4]],
    duo: [[-1.5, -6.8, -1.0], [-3.6, -7.0, -2.5], [-4.1, -9.5, -3.3], [-3.6, -12.5, -3.0], [-1.0, -13.4, -2.3], [1.6, -12.6, -2.2]],
    flex: [[2, -11, 2.0], [7, -9.5, 0.5], [9.8, -6.8, -2.6], [10.2, -10, -4.4], [9.8, -16, -4.9]],
    // linie nacięcia otrzewnej: prawa — wzdłuż dolnego brzegu wątroby i bocznego brzegu żyły głównej dolnej; lewa — więzadło śledzionowo-nerkowe
    cutR: [[-8.6, -6.6, -5.0], [-6.6, -4.4, -5.6], [-4.6, -3.2, -5.7], [-2.85, -4.8, -5.3], [-2.85, -1.0, -5.65], [-2.6, 2.6, -6.2]],
    cutL: [[10.6, -7.4, -6.8], [11.2, -3.4, -7.2], [10.8, 0.6, -7.8], [9.6, 3.6, -8.2]]
  };
  A.ADRENAL = { KID: KID, ADR: ADR, SPLEEN: SPLEEN, V: V, ellD: ellD,
    // fazy osi czasu m
    T: { R: { liver: [0, 1], ivc: [1, 2], vein: [2, 3], mob: [3, 4], rem: [4, 5] }, L: { spl: [0, 1], vein: [1, 2], mob: [2, 3], rem: [3, 4] } },
    clips: { R: { keep: [0.86, 0.72], spec: [0.18], cut: 0.45 }, L: { keep: [0.86, 0.72], spec: [0.15], cut: 0.42 } },
    box: [[-11, -15, -11], [11, 6, 4]] };

  /* ---------- dostęp (slajd „Dostęp”): powłoki ANAT.BODY przeniesione do układu wątroby (skala 1,45, wyrostek mieczykowaty ok. y 2,5);
     trokary wg Gagnera (Ann Surg 1997): ok. 2 cm poniżej łuku żebrowego; prawa — 4 × 10 mm, lewa — 3 × 10 mm ---------- */
  var XF = { s: 1.45, d: [0, -10.115, -0.8] };
  function bodyPt(p) { return [p[0] / XF.s, (p[1] - XF.d[1]) / XF.s, (p[2] - XF.d[2]) / XF.s]; }
  A.ACCESS['adr-r'] = { target: bodyPt([-3.4, -1.2, -7.0]), cam: { t: [-6.5, -9.5, 2.0], tp: [-7.5, -9.0, 2.0], az: -28, el: 16, k: 1.0 }, xf: XF,
    lap: { title: 'Dostęp laparoskopowy przezotrzewnowy boczny', short: '4 trokary 10 mm pod prawym łukiem żebrowym', side: 0,
      text: 'Chory na lewym boku (prawa strona ku górze), stół zgięty — poszerza to przestrzeń między łukiem żebrowym a grzebieniem biodrowym. Cztery trokary 10 mm ok. 2 cm poniżej prawego łuku żebrowego: pierwszy w linii pachowej przedniej, drugi w boku, poniżej końca żebra XI (optyka), dwa bardziej do przodu — najbardziej przyśrodkowy przy bocznym brzegu mięśnia prostego (retraktor wątroby). Nadnercze wydobyte w worku przez poszerzone miejsce trokara.',
      first: 0, insuf: [-0.76, -0.62], ports: [{ at: [-9.0, -0.2], mm: 10, name: '10 mm — pierwszy trokar', sub: 'linia pachowa przednia, 2 cm pod łukiem żebrowym' },
        { at: [-10.4, -3.0], mm: 10, name: '10 mm — optyka (kamera)', sub: 'w boku, poniżej końca żebra XI' },
        { at: [-7.3, 1.7], mm: 10, name: '10 mm — narzędzie', sub: '2 cm pod łukiem żebrowym' },
        { at: [-5.9, 3.1], mm: 10, name: '10 mm — retraktor wątroby', sub: 'przy bocznym brzegu mięśnia prostego' }] } };
  A.ACCESS['adr-l'] = { target: bodyPt([3.4, -3.4, -7.0]), cam: { t: [6.5, -9.5, 2.0], tp: [7.5, -9.0, 2.0], az: 28, el: 16, k: 1.0 }, xf: XF,
    lap: { title: 'Dostęp laparoskopowy przezotrzewnowy boczny', short: '3 trokary 10 mm pod lewym łukiem żebrowym', side: 0,
      text: 'Chory na prawym boku (lewa strona ku górze), stół zgięty. Trzy trokary 10 mm ok. 2 cm poniżej lewego łuku żebrowego: pierwszy tuż przyśrodkowo od linii pachowej przedniej, drugi w boku, poniżej końca żebra XI, trzeci bardziej do przodu i przyśrodkowo (optyka); w razie potrzeby czwarty (retraktor) bardziej ku tyłowi, po przecięciu więzadła śledzionowo-nerkowego. Nadnercze wydobyte w worku przez poszerzone miejsce trokara.',
      first: 0, insuf: [-0.76, -0.62], ports: [{ at: [8.6, 0.1], mm: 10, name: '10 mm — pierwszy trokar', sub: 'tuż przyśrodkowo od linii pachowej przedniej' },
        { at: [10.1, -3.2], mm: 10, name: '10 mm — narzędzie', sub: 'w boku, poniżej końca żebra XI' },
        { at: [6.6, 2.0], mm: 10, name: '10 mm — optyka (kamera)', sub: 'bardziej do przodu i przyśrodkowo' }] } };

  /* ---------- zabiegi ---------- */
  var CAMS = {
    R: { anat: { t: [-1.5, -5.5, -4.5], az: -14, el: 4, k: 0.72 }, lap: { t: [-3.2, -2.2, -6.6], az: -42, el: -8, k: 0.36 }, wide: { t: [-3.2, -3.0, -5.5], az: -32, el: -4, k: 0.5 } },
    L: { anat: { t: [2.2, -5.0, -4.5], az: 14, el: 4, k: 0.72 }, lap: { t: [3.3, -3.8, -6.6], az: 48, el: -8, k: 0.38 }, wide: { t: [3.6, -3.6, -5.5], az: 40, el: -4, k: 0.52 } }
  };
  function fr(s, k, m0, m1, cam, short, title, cap, dur) { var f = { k: k, kind: 'orbit', m0: m0, m1: m1, cam: 'custom', camP: CAMS[s][cam], short: short, title: title, cap: cap }; if (dur) f.dur = dur; return f; }
  var FR_R = [
    fr('R', 'anat', 0, 0, 'anat', 'Anatomia', 'Anatomia: nadnercze prawe', 'Nadnercze prawe leży nad górnym biegunem nerki, za wątrobą i bocznie od żyły głównej dolnej, której tylną ścianę częściowo przykrywa. Krótka (ok. 1 cm) żyła nadnerczowa prawa uchodzi bezpośrednio do tylno-bocznej ściany żyły głównej dolnej; tętnice nadnerczowe — górne (z tętnicy przeponowej dolnej), środkowa (z aorty) i dolna (z tętnicy nerkowej) — są drobne.'),
    fr('R', 'liver', 0, 1, 'wide', 'Wątroba', 'Mobilizacja płata prawego wątroby', 'Więzadło trójkątne prawe i otrzewna między wątrobą a nerką przecięte aż do przepony; płat prawy wątroby odciągnięty przyśrodkowo i ku górze retraktorem. Odsłania się przestrzeń zaotrzewnowa z nadnerczem i boczny brzeg żyły głównej dolnej.', 5),
    fr('R', 'ivc', 1, 2, 'lap', 'Żyła główna dolna', 'Brzeg żyły głównej dolnej', 'Otrzewna nacięta wzdłuż bocznego brzegu żyły głównej dolnej; przyśrodkowy brzeg nadnercza oddzielany od żyły. Drobne tętnice nadnerczowe zamykane koagulacją lub narzędziem energetycznym.', 5),
    fr('R', 'vein', 2, 3, 'lap', 'Żyła nadnerczowa', 'Żyła nadnerczowa prawa', 'Krótka, szeroka żyła odsłonięta przy tylno-bocznej ścianie żyły głównej dolnej; klipsy — co najmniej dwa, lepiej trzy od strony żyły głównej — i przecięcie. Jej uszkodzenie to najgroźniejsze krwawienie w tym zabiegu.', 5),
    fr('R', 'mob', 3, 4, 'lap', 'Uwolnienie', 'Uwolnienie nadnercza', 'Nadnercze uwalniane z otaczającą tkanką tłuszczową: od góry (gałęzie naczyń przeponowych dolnych), bocznie i od dołu — od górnego bieguna nerki. Gruczołu nie chwyta się narzędziami (ryzyko pęknięcia torebki); trzyma się tkankę tłuszczową wokół niego.', 5),
    fr('R', 'rem', 4, 5, 'wide', 'Usunięcie', 'Usunięcie nadnercza', 'Nadnercze w worku wydobyte przez poszerzone miejsce trokara; kontrola hemostazy w loży i na kikucie żyły; wątroba wraca na miejsce.', 5),
    fr('R', 'post', 5, 5, 'anat', 'Po operacji', 'Stan po adrenalektomii prawej', 'Loża nadnercza nad górnym biegunem nerki; kikut żyły nadnerczowej z klipsami na ścianie żyły głównej dolnej. Drenaż zwykle zbędny.')
  ];
  var FR_L = [
    fr('L', 'anat', 0, 0, 'anat', 'Anatomia', 'Anatomia: nadnercze lewe', 'Nadnercze lewe (półksiężycowate) leży przyśrodkowo od górnego bieguna nerki, bocznie od aorty i odnogi przepony, za trzonem i ogonem trzustki i żyłą śledzionową. Żyła nadnerczowa lewa (dłuższa, ok. 2 cm) biegnie w dół od dolnego bieguna gruczołu do żyły nerkowej lewej; uchodzi do niej żyła przeponowa dolna lewa.'),
    fr('L', 'spl', 0, 1, 'wide', 'Śledziona', 'Mobilizacja śledziony i ogona trzustki', 'Zagięcie śledzionowe okrężnicy odsunięte w dół; więzadło śledzionowo-nerkowe przecięte od dolnego bieguna śledziony do przepony. Śledziona z ogonem trzustki odchodzi przyśrodkowo — otwiera się przestrzeń między trzustką a nerką.', 5),
    fr('L', 'vein', 1, 2, 'lap', 'Żyła nadnerczowa', 'Żyła nadnerczowa lewa', 'Żyła odnaleziona przy dolno-przyśrodkowym brzegu nadnercza i wypreparowana na 1,5–2 cm w kierunku żyły nerkowej lewej (bez konieczności odsłaniania ujścia); klipsy i przecięcie. Od strony przyśrodkowej dochodzi do niej żyła przeponowa dolna.', 5),
    fr('L', 'mob', 2, 3, 'lap', 'Uwolnienie', 'Uwolnienie nadnercza', 'Preparowanie przyśrodkowo wzdłuż odnogi przepony i aorty, potem od górnego bieguna nerki i od góry (gałęzie naczyń przeponowych dolnych) — z tkanką tłuszczową, bez chwytania gruczołu.', 5),
    fr('L', 'rem', 3, 4, 'wide', 'Usunięcie', 'Usunięcie nadnercza', 'Nadnercze w worku wydobyte przez poszerzone miejsce trokara; kontrola hemostazy; śledziona z trzustką wracają na miejsce.', 5),
    fr('L', 'post', 4, 4, 'anat', 'Po operacji', 'Stan po adrenalektomii lewej', 'Loża nadnercza przyśrodkowo od górnego bieguna nerki; kikut żyły nadnerczowej z klipsami nad żyłą nerkową lewą.')
  ];
  var NOTES = [
    'Wskazania: guzy czynne hormonalnie (gruczolak w pierwotnym hiperaldosteronizmie, zespół Cushinga, guz chromochłonny) i guzy podejrzane o złośliwość. Incydentaloma powyżej 4 cm lub o gęstości ponad 20 j.H. w TK bez kontrastu wymaga oceny w kierunku raka kory nadnercza.',
    'Dostęp małoinwazyjny (laparoskopowy przezotrzewnowy boczny albo tylny zaotrzewnowy) jest metodą z wyboru w łagodnych guzach nadnerczy; przy podejrzeniu raka kory nadnercza preferuje się operację otwartą — usunięcie guza w całości (R0) bez naruszenia torebki (AAES 2022).',
    'Guz chromochłonny: przed operacją blokada receptorów alfa i wyrównanie objętości; w czasie preparowania możliwe gwałtowne wahania ciśnienia. Zespół Cushinga: po operacji substytucja glikokortykosteroidów (zahamowana czynność drugiego nadnercza). Hiperaldosteronizm: po operacji odstawienie spironolaktonu i potasu, kontrola potasu.',
    'Schemat: proporcje uproszczone; odmiany żył nadnerczowych (np. żyła prawa uchodząca do żyły wątrobowej prawej, żyły dodatkowe) są częste.'
  ];
  var VN = {
    R: 'Strona prawa: kluczowe jest uwolnienie płata prawego wątroby (więzadło trójkątne prawe) i odsłonięcie bocznego brzegu żyły głównej dolnej. Żyła nadnerczowa jest krótka i uchodzi do tylnej ściany żyły głównej — od jej strony co najmniej dwa, lepiej trzy klipsy.',
    L: 'Strona lewa: odsunięcie śledziony z ogonem trzustki po przecięciu więzadła śledzionowo-nerkowego. Żyła nadnerczowa jest dłuższa i uchodzi do żyły nerkowej lewej — nie mylić jej z żyłą nerkową ani śledzionową.'
  };
  function adrVar(s) {
    var R = s === 'R';
    return { cat: 'endo', id: R ? 'adr-r' : 'adr-l', vshort: R ? 'Laparoskopowa — prawa' : 'Laparoskopowa — lewa', short: 'Adrenalektomia',
      title: R ? 'Adrenalektomia laparoskopowa prawostronna (przezotrzewnowa boczna)' : 'Adrenalektomia laparoskopowa lewostronna (przezotrzewnowa boczna)',
      sub: R ? 'Mobilizacja wątroby, brzeg żyły głównej dolnej, żyła nadnerczowa prawa, uwolnienie nadnercza' : 'Mobilizacja śledziony i ogona trzustki, żyła nadnerczowa lewa do żyły nerkowej, uwolnienie nadnercza',
      notes: [VN[s]].concat(NOTES), objects: [], marks: [], cutTools: [{ type: 'adrenal', side: s }], anastTools: [], commonCuts: 0, mEnd: R ? 5 : 4, single: true,
      box: A.ADRENAL.box, access: R ? 'adr-r' : 'adr-l', singleFrames: R ? FR_R : FR_L };
  }
  var ADRP = { cat: 'endo', id: 'adr', short: 'Adrenalektomia', title: 'Adrenalektomia laparoskopowa — strona prawa i lewa', variants: [adrVar('R'), adrVar('L')] };
  var at = A.PROCS.length; A.PROCS.forEach(function (p, i) { if (p.cat === 'endo') at = i + 1; });
  A.PROCS.splice(at, 0, ADRP);
})(typeof window !== 'undefined' ? window : globalThis);
