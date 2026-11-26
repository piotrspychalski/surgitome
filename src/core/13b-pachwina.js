/* =====================================================================
   HERNIOLOGIA — PACHWINA: model okolicy pachwinowej prawej (ANAT.GROIN) i zabiegi: Lichtenstein (przedni, otwarty), TAPP i TEP (tylne, laparoskopowe).
   Układ jak w ANAT.BODY (x+ lewa strona chorego, y+ dogłowowo, z+ do przodu; 1 j. ≈ 1,45 cm). Współrzędne w ścianie: (s, t) — s wzdłuż więzadła
   pachwinowego (0 — guzek łonowy, 1 — kolec biodrowy przedni górny), t — odległość od więzadła ku górze i przyśrodkowo [j.]; głębokość pod skórą wzdłuż
   normalnej (BODY.at). Za więzadłem (t < 0) — „dno” pachwiny od strony jamy brzusznej (więzadło Coopera, naczynia biodrowe zewnętrzne, mięsień
   biodrowo-lędźwiowy), w = −t — odległość ku tyłowi od zagięcia ściany. Widok laparoskopowy: model obrócony (przód u góry ekranu, stopy w głąb).
   Źródła: HerniaSurge Group, Hernia 2018 (wytyczne międzynarodowe); Lichtenstein i wsp., Am J Surg 1989; Bittner i wsp., Surg Endosc 2011
   (wytyczne IEHS TAPP/TEP); Spaw i wsp., J Laparoendosc Surg 1991 (trójkąt zagłady); Daes i Felix, Ann Surg 2017 (krytyczny widok otworu
   mięśniowo-łonowego); Arregui i wsp., Surg Laparosc Endosc 1992 (TAPP); McKernan i Laws, Surg Endosc 1993 (TEP).
   ===================================================================== */
(function (root) {
  'use strict';
  var A = root.ANAT, B = A.BODY;
  var PT = [-2.4, -15.45], ASIS = B.LM.asisR, LV = [ASIS[0] - PT[0], ASIS[1] - PT[1]], L = Math.hypot(LV[0], LV[1]);
  var ES = [LV[0] / L, LV[1] / L], ET = [ES[1], -ES[0]];   // ET — ku górze i przyśrodkowo (prostopadle do więzadła)
  function xy(s, t) { return [PT[0] + s * LV[0] + t * ET[0], PT[1] + s * LV[1] + t * ET[1]]; }
  function st(x, y) { var dx = x - PT[0], dy = y - PT[1]; return [(dx * ES[0] + dy * ES[1]) / L, dx * ET[0] + dy * ET[1]]; }
  function sm(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
  var GROIN = {
    PT: PT, ASIS: ASIS, L: L, ES: ES, ET: ET, xy: xy, st: st,
    S: [-0.45, 1.12], TW: 5.2, TF: 2.2, TP: 3.4, SL: [-0.5, 1.3], TWL: 4.9,   // zakres s; t ściany (góra), uda (dół, przód) i dna (tył); widok od tyłu — szerzej
    // głębokości pod skórą: skóra, tkanka podskórna (do rozcięgna m. skośnego zewnętrznego), m. skośny wewnętrzny, powięź poprzeczna, otrzewna (od powięzi)
    // skóra i tkanka podskórna ze wspólnego modelu ściany (BODY.T: nad kanałem pachwinowym cieńsza — fatGroin); fat — głębokość dna tkanki podskórnej
    D: { skin: B.T.skin, fat: B.T.skin + B.T.fatGroin, eo: 0.05, tf: 1.95, per: 0.32, lig: 1.36 },
    RING: [0.5, 0.9], SRING: [0.11, 0.36],
    // dolny wolny brzeg m. skośnego wewnętrznego: przyczep do więzadła bocznie, łuk nad powrózkiem, ścięgno łączące do guzka łonowego
    archIO: function (s) { if (s >= 0.5) return 0.08 + 1.37 * (1 - sm((s - 0.5) / 0.17)); if (s >= 0.18) return 1.35 + 0.1 * sm((s - 0.18) / 0.32); return 0.18 + 1.17 * sm(s / 0.18); },
    // linia nacięcia rozcięgna m. skośnego zewnętrznego wzdłuż włókien: od szczytu pierścienia powierzchownego bocznie, nad kanałem
    split: function (s) { return 0.36 + (s - 0.11) * (0.9 - 0.36) / (0.5 - 0.11) + 0.15 * sm((s - 0.5) / 0.4); },
    ringGap: function (s) { return s < -0.06 || s > 0.2 ? 0 : 0.36 * Math.sin(Math.PI * (s + 0.06) / 0.26); },   // szczelina pierścienia powierzchownego (odnogi)
    INC: { t: 1.25, s0: 0.06, s1: 0.6 },   // cięcie skóry w Lichtensteinie: 5–6 cm od guzka łonowego bocznie, ok. 2 cm nad więzadłem
    tInc: function (s) { return 3.1 - 0.9 * sm((s - 0.6) / 0.4); },   // nacięcie otrzewnej w TAPP (3–4 cm nad pierścieniem głębokim)
    TAPP_S: [0.27, 1.02],
    // przebiegi (s, t, głębokość pod skórą — ściana) / (s, t, odsunięcie od powierzchni wewnętrznej — widok od tyłu)
    CORD: [[0.5, 0.9, 2.02], [0.47, 0.84, 1.74], [0.4, 0.74, 1.5], [0.3, 0.6, 1.4], [0.2, 0.47, 1.3], [0.11, 0.36, 1.14], [0.06, 0.08, 1.08], [0.02, -0.5, 1.04], [-0.05, -1.2, 1.0], [-0.12, -2.1, 0.98]],
    IEV: B.VESSELS[0].pts.map(function (p) { return st(-p[0], p[1]); }),   // naczynia nabrzuszne dolne — ten sam przebieg co we wspólnym modelu ściany (BODY.VESSELS, strona prawa)
    DCIA: B.VESSELS.filter(function (v) { return v.id === 'dcia'; })[0].pts.map(function (p) { return st(-p[0], p[1]); }),   // naczynia okalające biodra głębokie
    UMBM: [[-0.1, -3.9], [-0.04, -2.6], [0.04, -1.1], [0.09, 0.0], [0.17, 1.4], [0.26, 2.75], [0.36, 5.27], [0.48, 7.7], [0.58, 9.9]],   // fałd pępkowy przyśrodkowy (tętnica pępkowa zarośnięta)
    EIA: [[0.37, 0.2], [0.39, -0.6], [0.43, -1.6], [0.48, -2.8], [0.52, -3.5]], EIV: [[0.29, 0.2], [0.31, -0.6], [0.35, -1.6], [0.4, -2.8], [0.44, -3.5]],
    VAS: [[0.5, 0.9], [0.46, 0.5], [0.41, -0.15], [0.34, -0.95], [0.2, -1.75], [0.03, -2.5], [-0.1, -3.2], [-0.14, -3.45]],
    TEST: [[0.5, 0.9], [0.52, 0.3], [0.54, -0.2], [0.58, -1.0], [0.63, -2.4], [0.67, -3.5]],
    COOPER: [[-0.36, -0.45], [-0.15, -0.42], [0.0, -0.5], [0.12, -0.75], [0.22, -0.95], [0.28, -1.05]],
    CORONA: [[0.37, 0.0], [0.33, -0.4], [0.24, -0.92], [0.18, -1.6], [0.14, -2.3]],
    LFCN: [[0.99, -3.5], [0.96, -2.2], [0.93, -0.6], [0.92, 0.06]], GFN: [[0.85, -3.5], [0.81, -2.3], [0.77, -0.7], [0.76, 0.06]], FEMN: [[0.77, -3.5], [0.72, -2.4], [0.67, -0.9], [0.65, 0.06]],
    // siatki: Lichtenstein (s, t na tylnej ścianie kanału), TAPP / TEP (s, t na powierzchni wewnętrznej, t < 0 — dno)
    MESH_L: { s: [-0.18, 0.97], t: [0.02, 4.3] }, MESH_P: { s: [-0.36, 0.98], t: [-1.95, 3.0] },
    TACKS: [[0.05, -0.62], [0.17, -0.85], [-0.18, 1.6], [0.12, 2.5], [0.78, 2.3]]
  };
  A.GROIN = GROIN;

  /* ---------- zabiegi ---------- */
  var COMMON = 'Schemat okolicy pachwinowej prawej u mężczyzny (u kobiety w kanale biegnie więzadło obłe macicy); grubości warstw uproszczone, skala ok. 1 : 1,45 cm.';
  var MPO = 'Otwór mięśniowo-łonowy (Fruchaud): od góry łuk mięśni skośnego wewnętrznego i poprzecznego, przyśrodkowo mięsień prosty, bocznie mięsień biodrowo-lędźwiowy, od dołu więzadło Coopera; więzadło pachwinowe i pasmo biodrowo-łonowe dzielą go na część pachwinową (przepukliny skośne i proste) i udową.';
  function groin(o) { return Object.assign({ cat: 'hernia', objects: [], marks: [], anastTools: [], commonCuts: 0, single: true, box: [[-10, -18, -1], [1, -8, 7]] }, o); }
  var CL = { t: [-4.4, -12.7, 4.2], tp: [-3.9, -13.0, 4.2], az: -10, el: -6, k: 0.85 }, CL2 = { t: [-3.75, -12.75, 3.9], tp: [-3.75, -12.75, 3.9], az: -10, el: -6, k: 0.38 };
  // widok laparoskopowy (model obrócony: x' = −x, y' = z, z' = y): kamera od strony pępka, w jamie brzusznej (powłoki uniesione odmą)
  var CP = { t: [4.8, 2.3, -12.6], tp: [4.8, 2.3, -12.6], az: -24, el: 28, k: 0.34, kp: 0.3 }, CP2 = { t: [4.7, 2.2, -12.7], tp: [4.7, 2.2, -12.7], az: -24, el: 30, k: 0.31, kp: 0.27 };   // optyka w jamie (sprawdzone: 2 j. pod otrzewną)
  var LICH_FR = [
    { k: 'normal', kind: 'orbit', m0: 0, m1: 0, cam: 'custom', camP: CL, short: 'Pachwina', title: 'Przepuklina pachwinowa skośna',
      cap: 'Okolica pachwinowa prawa od przodu. Więzadło pachwinowe biegnie od kolca biodrowego przedniego górnego do guzka łonowego; nad pierścieniem pachwinowym powierzchownym uwypuklenie przepukliny. Linia przerywana — planowane cięcie.' },
    { k: 'inc', kind: 'orbit', m0: 0, m1: 1, dur: 5, cam: 'custom', camP: CL, short: 'Cięcie', title: 'Cięcie skóry i tkanki podskórnej',
      cap: 'Cięcie 5–6 cm od guzka łonowego bocznie, równolegle do więzadła pachwinowego, ok. 2 cm nad nim. Po rozsunięciu tkanki podskórnej widać rozcięgno mięśnia skośnego zewnętrznego i pierścień pachwinowy powierzchowny, z którego wychodzi powrózek nasienny.' },
    { k: 'eoa', kind: 'orbit', m0: 1, m1: 2, dur: 6, cam: 'custom', camP: CL2, short: 'Kanał', title: 'Otwarcie kanału pachwinowego',
      cap: 'Rozcięgno mięśnia skośnego zewnętrznego nacięte wzdłuż włókien od pierścienia powierzchownego bocznie; płaty rozchylone. Widać powrózek nasienny z nerwem biodrowo-pachwinowym, nerw biodrowo-podbrzuszny na mięśniu skośnym wewnętrznym i brzeg więzadła pachwinowego. Nerwy rozpoznaje się i oszczędza.' },
    { k: 'sac', kind: 'orbit', m0: 2, m1: 3, dur: 6, cam: 'custom', camP: CL2, short: 'Worek', title: 'Worek przepuklinowy',
      cap: 'Powrózek uniesiony na tasiemce, mięsień dźwigacz jądra rozdzielony wzdłuż. Worek przepuklinowy skośny leży przednio-przyśrodkowo od nasieniowodu i naczyń jądrowych; oddzielony od nich aż do pierścienia głębokiego i odprowadzony do przestrzeni przedotrzewnowej (bez otwierania lub po otwarciu i podwiązaniu u podstawy).' },
    { k: 'mesh', kind: 'orbit', m0: 3, m1: 4, dur: 7, cam: 'custom', camP: CL2, short: 'Siatka', title: 'Siatka bez napięcia (Lichtenstein)',
      cap: 'Siatka polipropylenowa ok. 7 × 15 cm na tylnej ścianie kanału: przyśrodkowo zachodzi 2 cm na guzek łonowy, dolny brzeg przyszyty szwem ciągłym do więzadła pachwinowego, górny — kilkoma szwami do rozcięgna mięśnia skośnego wewnętrznego i pochewki mięśnia prostego. Boczny koniec rozcięty: ramiona otaczają powrózek i krzyżują się bocznie od niego, tworząc nowy pierścień głęboki.' },
    { k: 'close', kind: 'orbit', m0: 4, m1: 5, dur: 5, cam: 'custom', camP: CL, short: 'Zamknięcie', title: 'Zamknięcie rozcięgna i skóry',
      cap: 'Rozcięgno mięśnia skośnego zewnętrznego zszyte nad powrózkiem szwem ciągłym (odtworzony pierścień powierzchowny bez zwężenia), następnie tkanka podskórna i skóra.' }
  ];
  var LICH = groin({ id: 'lich', short: 'Lichtenstein', title: 'Plastyka przepukliny pachwinowej sposobem Lichtensteina',
    sub: 'Przedni dostęp otwarty, siatka bez napięcia na tylnej ścianie kanału pachwinowego',
    notes: ['Lichtenstein i wsp. (1989): naprawa bez napięcia — siatka polipropylenowa wzmacnia całą tylną ścianę kanału pachwinowego zamiast zszywania tkanek pod napięciem.',
      'Wytyczne HerniaSurge (2018): u dorosłych z objawową przepukliną pachwinową zalecana naprawa z siatką; Lichtenstein — technika otwarta z wyboru, możliwa w znieczuleniu miejscowym; technika laparoendoskopowa (TAPP, TEP) — porównywalna przy odpowiednim doświadczeniu.',
      'Siatka: przyśrodkowo 2 cm za guzkiem łonowym, bocznie 5–6 cm za pierścieniem głębokim, z luzem (w pozycji stojącej powłoki się rozciągają); ramiona skrzyżowane bocznie od powrózka. Nie wkłuwa się w okostną guzka łonowego.',
      'Nerwy (biodrowo-pachwinowy, biodrowo-podbrzuszny, gałąź płciowa nerwu płciowo-udowego) rozpoznaje się i oszczędza; uszkodzenie lub uwięźnięcie w szwie — przyczyna przewlekłego bólu pachwiny.',
      'Przepuklina prosta: uwypuklenie powięzi poprzecznej w trójkącie Hesselbacha (przyśrodkowo od naczyń nabrzusznych dolnych) — worek wpukla się, siatka pokrywa tę samą tylną ścianę.',
      COMMON],
    cutTools: [{ type: 'groin', op: 'lich' }], mEnd: 5, singleFrames: LICH_FR });

  var LAP_INTRO = 'Widok laparoskopowy prawej pachwiny od strony jamy brzusznej (optyka w pępku): u góry przednia ściana brzucha, w głębi więzadło pachwinowe, u dołu naczynia biodrowe i dno miednicy; przyśrodkowo — pęcherz moczowy.';
  var TAPP_FR = [
    { k: 'normal', kind: 'orbit', m0: 0, m1: 0, cam: 'custom', camP: CP, short: 'Wrota', title: 'Przepuklina skośna — widok od wewnątrz',
      cap: LAP_INTRO + ' Bocznie od fałdu z naczyniami nabrzusznymi dolnymi — wrota przepukliny skośnej (dół pachwinowy boczny); przyśrodkowo od nich dół przyśrodkowy (przepukliny proste).' },
    { k: 'inc', kind: 'orbit', m0: 0, m1: 1, dur: 5, cam: 'custom', camP: CP, short: 'Otrzewna', title: 'Nacięcie otrzewnej',
      cap: 'Trzy trokary: 10–12 mm w pępku (optyka), 2 × 5 mm na wysokości pępka po obu stronach. Otrzewna nacięta poprzecznie 3–4 cm nad wrotami przepukliny — od fałdu pępkowego przyśrodkowego do kolca biodrowego przedniego górnego.' },
    { k: 'flap', kind: 'orbit', m0: 1, m1: 2, dur: 6, cam: 'custom', camP: CP2, short: 'Przestrzeń', title: 'Przestrzeń przedotrzewnowa',
      cap: 'Płat otrzewnej odpreparowany ku dołowi: przyśrodkowo przestrzeń Retziusa do spojenia łonowego i więzadła Coopera, bocznie przestrzeń Bogrosa do kolca biodrowego. Widać pasmo biodrowo-łonowe i naczynia nabrzuszne dolne. Trójkąt zagłady (między nasieniowodem a naczyniami jądrowymi — naczynia biodrowe zewnętrzne) i trójkąt bólu (bocznie od naczyń jądrowych, pod pasmem biodrowo-łonowym — nerwy) — bez preparowania na ślepo i bez mocowania.' },
    { k: 'sac', kind: 'orbit', m0: 2, m1: 3, dur: 6, cam: 'custom', camP: CP2, short: 'Worek', title: 'Odprowadzenie worka i parietalizacja',
      cap: 'Worek przepuklinowy skośny wyciągnięty z pierścienia głębokiego i oddzielony od nasieniowodu i naczyń jądrowych. Parietalizacja: otrzewna odsunięta od elementów powrózka na tyle, by dolny brzeg siatki leżał płasko (ok. 5–6 cm). „Tłuszczak” powrózka usuwa się.' },
    { k: 'mesh', kind: 'orbit', m0: 3, m1: 4, dur: 6, cam: 'custom', camP: CP, short: 'Siatka', title: 'Siatka w przestrzeni przedotrzewnowej',
      cap: 'Siatka co najmniej 10 × 15 cm pokrywa cały otwór mięśniowo-łonowy: przyśrodkowo do spojenia (poza linię pośrodkową), od dołu poniżej więzadła Coopera i na sparietalizowanych elementach powrózka, bocznie do kolca biodrowego. Mocowanie zwykle zbędne; jeśli tak (np. duża przepuklina prosta) — do więzadła Coopera i przyśrodkowo nad pasmem biodrowo-łonowym, nigdy w trójkątach zagłady i bólu.' },
    { k: 'close', kind: 'orbit', m0: 4, m1: 5, dur: 5, cam: 'custom', camP: CP, short: 'Zamknięcie', title: 'Zamknięcie otrzewnej',
      cap: 'Płat otrzewnej ułożony z powrotem i zszyty szwem ciągłym (lub zszywkami / klejem) — siatka całkowicie oddzielona od trzewi. Zamknięcie powięzi w miejscu trokara 10–12 mm.' }
  ];
  var TAPP = groin({ id: 'tapp', short: 'TAPP', title: 'Przezbrzuszna przedotrzewnowa plastyka przepukliny pachwinowej (TAPP)',
    sub: 'Laparoskopia: nacięcie otrzewnej, siatka w przestrzeni przedotrzewnowej, zamknięcie otrzewnej',
    notes: ['TAPP: dostęp przez jamę otrzewnej — widać obie pachwiny (rozpoznanie przepukliny po drugiej stronie, przepukliny udowej i zasłonowej); siatka w przestrzeni przedotrzewnowej pod otrzewną.',
      MPO,
      'Wytyczne HerniaSurge (2018) i IEHS: siatka co najmniej 10 × 15 cm pokrywająca cały otwór mięśniowo-łonowy, parietalizacja elementów powrózka; mocowanie tylko przy dużych przepuklinach prostych (M3). Krytyczny widok otworu mięśniowo-łonowego (Daes i Felix 2017) przed założeniem siatki.',
      'Trójkąt zagłady (Spaw i wsp. 1991): między nasieniowodem a naczyniami jądrowymi, wierzchołek w pierścieniu głębokim — naczynia biodrowe zewnętrzne. Trójkąt bólu: bocznie od naczyń jądrowych, pod pasmem biodrowo-łonowym — nerw skórny boczny uda, gałąź udowa nerwu płciowo-udowego, nerw udowy. Corona mortis — połączenie naczyń zasłonowych z nabrzusznymi lub biodrowymi zewnętrznymi na więzadle Coopera (wariant).',
      COMMON],
    cutTools: [{ type: 'groin', op: 'tapp' }], mEnd: 5, singleFrames: TAPP_FR });

  var TEP_FR = [
    { k: 'normal', kind: 'orbit', m0: 0, m1: 0, cam: 'custom', camP: CP, short: 'Pachwina od tyłu', title: 'Pachwina od tyłu (schemat)',
      cap: LAP_INTRO + ' W TEP otrzewnej się nie otwiera — cały zabieg w przestrzeni przedotrzewnowej, między ścianą brzucha a otrzewną.' },
    { k: 'bal', kind: 'orbit', m0: 0, m1: 1, dur: 6, cam: 'custom', camP: CP, short: 'Przestrzeń', title: 'Wytworzenie przestrzeni przedotrzewnowej',
      cap: 'Cięcie pod pępkiem, nacięcie pochewki przedniej mięśnia prostego po stronie przepukliny, mięsień odsunięty bocznie; trokar z balonem do rozwarstwiania wprowadzony za mięsień prosty, na pochewkę tylną, do spojenia łonowego. Balon odsuwa otrzewną od ściany; dwa trokary 5 mm w linii pośrodkowej między pępkiem a spojeniem.' },
    { k: 'lat', kind: 'orbit', m0: 1, m1: 2, dur: 5, cam: 'custom', camP: CP2, short: 'Bocznie', title: 'Przestrzeń Retziusa i Bogrosa',
      cap: 'Przyśrodkowo odsłonięte spojenie i więzadło Coopera (przestrzeń Retziusa), bocznie przestrzeń poszerzona tępo do kolca biodrowego (przestrzeń Bogrosa) pod naczyniami nabrzusznymi dolnymi, które zostają na ścianie. Otrzewna (z tyłu) nienaruszona; jej rozdarcie powoduje odmę otrzewnową i zmniejsza przestrzeń roboczą.' },
    { k: 'sac', kind: 'orbit', m0: 2, m1: 3, dur: 6, cam: 'custom', camP: CP2, short: 'Worek', title: 'Odprowadzenie worka i parietalizacja',
      cap: 'Worek przepuklinowy skośny odciągnięty z pierścienia głębokiego i od elementów powrózka; otrzewna odsunięta ku tyłowi od nasieniowodu i naczyń jądrowych (parietalizacja), aż dolny brzeg siatki może leżeć płasko.' },
    { k: 'mesh', kind: 'orbit', m0: 3, m1: 4, dur: 6, cam: 'custom', camP: CP, short: 'Siatka', title: 'Siatka w przestrzeni przedotrzewnowej',
      cap: 'Siatka co najmniej 10 × 15 cm pokrywa otwór mięśniowo-łonowy, od spojenia do kolca biodrowego i poniżej więzadła Coopera; zwykle bez mocowania — utrzymuje ją otrzewna i ciśnienie w jamie brzusznej.' },
    { k: 'des', kind: 'orbit', m0: 4, m1: 5, dur: 5, cam: 'custom', camP: CP, short: 'Desuflacja', title: 'Desuflacja pod kontrolą wzroku',
      cap: 'CO₂ wypuszczany pod kontrolą wzroku: otrzewna wraca na siatkę i dociska ją do ściany; dolny brzeg siatki nie może się podwinąć (worek otrzewnej nie może wsunąć się pod siatkę). Zamknięcie pochewki przedniej w miejscu trokara.' }
  ];
  var TEP = groin({ id: 'tep', short: 'TEP', title: 'Całkowicie pozaotrzewnowa plastyka przepukliny pachwinowej (TEP)',
    sub: 'Laparoskopia w przestrzeni przedotrzewnowej, bez otwierania otrzewnej',
    notes: ['TEP: przestrzeń przedotrzewnowa wytworzona balonem lub optyką — bez wejścia do jamy otrzewnej (mniej ryzyka uszkodzenia trzewi i zrostów), ale mniejsza przestrzeń robocza i trudniejsza orientacja niż w TAPP.',
      MPO,
      'Wytyczne HerniaSurge (2018) i IEHS: siatka co najmniej 10 × 15 cm, parietalizacja elementów powrózka, mocowanie zwykle zbędne; wyniki TEP i TAPP porównywalne — wybór zależy od doświadczenia zespołu.',
      'Przeciwwskazania względne: wcześniejsze operacje w przestrzeni przedotrzewnowej (np. prostatektomia), duże przepukliny mosznowe, uwięźnięcie.',
      COMMON],
    cutTools: [{ type: 'groin', op: 'tep' }], mEnd: 5, singleFrames: TEP_FR });

  // pozycja: na początku kategorii „Herniologia” (najczęstsze zabiegi)
  var at = A.PROCS.length; A.PROCS.forEach(function (p, i) { if (p.cat === 'hernia' && at === A.PROCS.length) at = i; });
  A.PROCS.splice(at, 0, { cat: 'hernia', id: 'lich', short: LICH.short, title: LICH.title, variants: [LICH] },
    { cat: 'hernia', id: 'tapp', short: TAPP.short, title: TAPP.title, variants: [TAPP] }, { cat: 'hernia', id: 'tep', short: TEP.short, title: TEP.title, variants: [TEP] });
})(typeof window !== 'undefined' ? window : globalThis);
