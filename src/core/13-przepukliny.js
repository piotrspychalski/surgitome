/* =====================================================================
   HERNIOLOGIA — warstwowy model powłok brzucha (rozbudowa ANAT.BODY z slajdu „Dostęp”) i zabiegi na przepuklinach.
   Układ jak w ANAT.BODY: x+ lewa strona chorego, y+ dogłowowo, z+ do przodu; 1 jednostka ≈ 1,45 cm (wyrostek mieczykowaty–spojenie 24 j. ≈ 35 cm).
   Warstwy liczone od skóry w głąb, wzdłuż normalnej (BODY.at): skóra, tkanka podskórna, dalej
   — przyśrodkowo od kresy półksiężycowatej (BODY.rectLat): pochewka przednia, mięsień prosty, blaszka tylna rozcięgna mięśnia skośnego wewnętrznego
     (pochewka tylna, nad kresą łukowatą), mięsień poprzeczny (w nadbrzuszu jego brzusiec sięga przyśrodkowo za mięsień prosty, niżej — rozcięgno);
   — bocznie: mięsień skośny zewnętrzny (przyśrodkowo rozcięgno), skośny wewnętrzny, poprzeczny;
   — pod nimi: powięź poprzeczna, tłuszcz przedotrzewnowy, otrzewna ścienna.
   Nerwy międzyżebrowe (T7–T12) biegną między mięśniem skośnym wewnętrznym a poprzecznym i wnikają do pochewki mięśnia prostego przy jego brzegu bocznym.
   Przepuklina: ubytek w linii pośrodkowej (eliptyczny), mięśnie proste odsunięte bocznie, worek (otrzewna z tłuszczem) uwypukla skórę.
   Źródła: Novitsky i wsp., Am J Surg 2012 (TAR); Ramirez i wsp., Plast Reconstr Surg 1990 (rozdzielenie komponentów); Love i wsp., Hernia 2021 (RDR);
   Parker i wsp., World J Surg 2020 (definicja utraty domeny, metoda Sabbagha); Sabbagh i wsp., Hernia 2011; Tanaka i wsp., Hernia 2010;
   Henriksen i wsp., Br J Surg 2020 (wytyczne EHS/AHS — przepukliny pępkowe i w kresie białej).
   ===================================================================== */
(function (root) {
  'use strict';
  var A = root.ANAT, B = A.BODY;
  function sm(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
  var WALL = {
    CM: 1.45,
    ARC: -8.8,   // kresa łukowata: poniżej niej rozcięgna wszystkich trzech mięśni bocznych przechodzą przed mięśniem prostym (pochewka tylna — tylko powięź poprzeczna)
    T: { skin: 0.12, fat: 1.05, ant: 0.06, rect: 0.62, post: 0.05, ta: 0.2, eo: 0.22, io: 0.24, tf: 0.045, pre: 0.16, per: 0.035 },
    // brzusiec mięśnia poprzecznego przyśrodkowo od kresy półksiężycowatej (w nadbrzuszu, za mięśniem prostym) — szerokość [j.]
    taMed: function (y) { return 2.0 * sm((y + 6) / 8); },
    // mięsień skośny zewnętrzny: przyśrodkowo od tej linii rozcięgno (od chrząstki IX żebra do kolca biodrowego przedniego górnego), bocznie brzusiec
    eoApo: function (y) { return B.rectLat(y) + 1.4 + 0.12 * (y + 5); },
    // nerwy międzyżebrowe i podżebrowy: [poziom y przy brzegu bocznym mięśnia prostego, nazwa]
    NV: [[5.4, 'T7'], [2.6, 'T8'], [-1.4, 'T9'], [-5.5, 'T10'], [-8.4, 'T11'], [-11.0, 'T12']],
    // przepukliny: yc — środek ubytku, hl/hw — połowa długości/szerokości ubytku, bulge — uwypuklenie skóry, fat — grubość tkanki podskórnej;
    // bryła powłok od y0 do y1, w kadrach zabiegu widoczna część nad poziomem przekroju cut (widok od strony stóp jak w TK: przód u góry, prawa strona chorego po lewej)
    HER: {
      inc: { yc: -4.2, hl: 4.9, hw: 4.3, bulge: 2.3, fat: 1.15, cut: -2.4, slab: 2.6, y0: -12.6, y1: 3.2 },
      umb: { yc: -5.5, hl: 0.78, hw: 0.78, bulge: 0.95, fat: 1.05, cut: -5.5, slab: 2.6, y0: -9.4, y1: -1.6 },
      umbS: { yc: -5.5, hl: 0.3, hw: 0.3, bulge: 0.5, fat: 1.05, cut: -5.5, slab: 2.6, y0: -9.4, y1: -1.6 }
    }
  };
  // szerokość ubytku i mięśni prostych w cm (do TK: RDR) — przepuklina pooperacyjna w modelu
  WALL.rdr = function (h, y) {
    var hy = h || WALL.HER.inc, yy = y == null ? hy.yc : y, u = 1 - Math.pow((yy - hy.yc) / hy.hl, 2), hw = u > 0 ? hy.hw * Math.sqrt(u) : 0;
    var rw = B.rectLat(yy) - B.RECT_MED;
    return { defect: 2 * hw * WALL.CM, rectus: rw * WALL.CM, ratio: hw > 0 ? (2 * rw) / (2 * hw) : Infinity };
  };
  A.WALL = WALL;

  /* ---------- zabiegi ---------- */
  var COMMON = 'Schemat: grubości warstw, szerokość mięśni i przebieg nerwów uproszczone; skala ok. 1 : 1,45 cm.';
  function ventral(o) {
    return Object.assign({ cat: 'hernia', objects: [], marks: [], anastTools: [], commonCuts: 0, single: true }, o);
  }
  var CAMV = { t: [-2.2, -2.4, 4.2], tp: [0, -2.4, 3.6], az: 0, el: -50, k: 0.72 }, CAMS = { t: [5.2, -2.4, 3.0], tp: [6.4, -2.4, 3.0], az: 0, el: -52, k: 0.46 }, CAMT = { t: [-2.0, -5.0, 5.4], tp: [0, -5.0, 5.4], az: 18, el: 10, k: 0.95 };   // widok od strony stóp na przekrój (przód u góry)
  var LAP_TXT = 'Cięcie pośrodkowe nad przepukliną (przez starą bliznę), otwarcie worka przepuklinowego, uwolnienie zrostów i odprowadzenie trzewi do jamy brzusznej; nadmiar worka i blizny wycięty.';
  var TAR_FR = [
    { k: 'normal', kind: 'orbit', m0: 0, m1: 0, cam: 'custom', camP: CAMV, short: 'Przepuklina', title: 'Przepuklina w bliźnie pośrodkowej',
      cap: 'Przekrój poprzeczny powłok na wysokości środka przepukliny. Mięśnie proste odsunięte bocznie, między nimi ubytek w linii białej; worek (otrzewna z tłuszczem przedotrzewnowym) z pętlami jelita uwypukla skórę.' },
    { k: 'lap', kind: 'orbit', m0: 0, m1: 1, dur: 5, cam: 'custom', camP: CAMV, short: 'Laparotomia', title: 'Laparotomia i otwarcie worka', cap: LAP_TXT },
    { k: 'rr', kind: 'orbit', m0: 1, m1: 2, dur: 5, cam: 'custom', camP: CAMS, short: 'Rives–Stoppa', title: 'Przestrzeń zamięśniowa (Rives–Stoppa)',
      cap: 'Pochewka tylna nacięta przy przyśrodkowym brzegu mięśnia prostego; przestrzeń między mięśniem a pochewką tylną rozwarstwiona bocznie aż do kresy półksiężycowatej. Przy brzegu bocznym widać pęczki nerwowo-naczyniowe wnikające do mięśnia — należy je zachować.' },
    { k: 'tar', kind: 'orbit', m0: 2, m1: 3, dur: 6, cam: 'custom', camP: CAMS, short: 'TAR', title: 'Uwolnienie mięśnia poprzecznego (TAR)',
      cap: 'Pochewka tylna nacięta 0,5–1 cm przyśrodkowo od kresy półksiężycowatej, przyśrodkowo od pęczków nerwowo-naczyniowych; pod nią mięsień poprzeczny brzucha przecięty na całej długości. Przestrzeń między mięśniem poprzecznym a powięzią poprzeczną rozwarstwiona bocznie (do mięśnia lędźwiowego).' },
    { k: 'post', kind: 'orbit', m0: 3, m1: 4, dur: 4, cam: 'custom', camP: CAMV, short: 'Warstwa tylna', title: 'Zamknięcie warstwy tylnej',
      cap: 'Uwolniona warstwa tylna (pochewka tylna, powięź poprzeczna, otrzewna) przesuwa się przyśrodkowo i zostaje zszyta w linii pośrodkowej szwem ciągłym — trzewia oddzielone od siatki.' },
    { k: 'mesh', kind: 'orbit', m0: 4, m1: 5, dur: 4, cam: 'custom', camP: CAMV, short: 'Siatka', title: 'Siatka w pozycji sublay',
      cap: 'Duża siatka (makroporowata, niewchłanialna) w przestrzeni zamięśniowej i przed powięzią poprzeczną, od jednego obszaru TAR do drugiego; mocowanie ograniczone lub bez mocowania — utrzymuje ją ciśnienie w jamie brzusznej.' },
    { k: 'close', kind: 'orbit', m0: 5, m1: 6, dur: 5, cam: 'custom', camP: CAMV, short: 'Linia biała', title: 'Odtworzenie linii białej',
      cap: 'Mięśnie proste przesunięte przyśrodkowo, pochewki przednie zszyte w linii pośrodkowej nad siatką — linia biała odtworzona. Dreny, zamknięcie tkanki podskórnej i skóry.' },
    { k: 'ct', kind: 'ct', m0: 0, m1: 0, cam: 'custom', camP: CAMT, short: 'TK', title: 'TK przed operacją: RDR i utrata domeny', cap: '' }
  ];
  var TAR = ventral({ id: 'tar', short: 'TAR (Novitsky)', title: 'Rekonstrukcja powłok z uwolnieniem mięśnia poprzecznego (TAR)',
    sub: 'Tylne rozdzielenie komponentów: Rives–Stoppa + TAR, siatka sublay',
    notes: ['Tylne rozdzielenie komponentów (Novitsky i wsp. 2012): przestrzeń zamięśniowa (Rives–Stoppa) poszerzona bocznie przez przecięcie mięśnia poprzecznego brzucha; pochewkę tylną nacina się 0,5–1 cm przyśrodkowo od kresy półksiężycowatej.',
      'Zachowane są pęczki nerwowo-naczyniowe (nerwy międzyżebrowe T7–T12), które wnikają do mięśnia prostego przy jego brzegu bocznym, i ukrwienie skóry (bez rozległych płatów skórno-tłuszczowych).',
      'Siatka leży za mięśniami (sublay), oddzielona od trzewi zszytą warstwą tylną; linię białą odtwarza się nad siatką.',
      'Wskazania: duże przepukliny w linii pośrodkowej, w których samo rozwarstwienie zamięśniowe nie pozwala zamknąć powięzi. W TK pomaga to przewidzieć RDR (zakładka TK).',
      COMMON],
    cutTools: [{ type: 'wall', op: 'tar', her: 'inc' }], mEnd: 6, box: [[-12, -3, 0], [12, 1, 9]], singleFrames: TAR_FR });

  var ACS_FLAP = { k: 'flap', kind: 'orbit', m0: 1, m1: 2, dur: 5, cam: 'custom', camP: CAMS, short: 'Płaty skórne', title: 'Płaty skórno-tłuszczowe',
      cap: 'Skóra z tkanką podskórną oddzielona od pochewki przedniej i rozcięgna mięśnia skośnego zewnętrznego, bocznie za kresę półksiężycowatą. Przecina to perforatory okołopępkowe; w odmianie oszczędzającej perforatory dochodzi się do rozcięgna przez krótkie tunele.' },
    ACS_EO = { k: 'eo', kind: 'orbit', m0: 2, m1: 3, dur: 5, cam: 'custom', camP: CAMS, short: 'Skośny zewnętrzny', title: 'Przecięcie rozcięgna mięśnia skośnego zewnętrznego',
      cap: 'Rozcięgno mięśnia skośnego zewnętrznego nacięte 1–2 cm bocznie od kresy półksiężycowatej, od łuku żebrowego do więzadła pachwinowego. Mięsień skośny zewnętrzny oddzielony od wewnętrznego w beznaczyniowej warstwie, bocznie aż do linii pachowej.' },
    ACS_ADV = { k: 'adv', kind: 'orbit', m0: 3, m1: 4, dur: 5, cam: 'custom', camP: CAMV, short: 'Przesunięcie', title: 'Przesunięcie mięśni prostych i zamknięcie linii białej',
      cap: 'Mięsień prosty z mięśniem skośnym wewnętrznym i poprzecznym przesuwa się przyśrodkowo jako jeden płat (według Ramireza ok. 10 cm na wysokości talii); mięsień skośny zewnętrzny zostaje bocznie, między brzegami jego rozcięgna powstaje szczelina. Linia biała zszyta w linii pośrodkowej.' },
    ACS_CT = { k: 'ct', kind: 'ct', m0: 0, m1: 0, cam: 'custom', camP: CAMT, short: 'TK', title: 'TK przed operacją: RDR i utrata domeny', cap: '' };
  // oryginał (Ramirez i wsp. 1990): naprawa z tkanek własnych, bez siatki
  var ACS0_FR = [TAR_FR[0], TAR_FR[1], ACS_FLAP, ACS_EO, ACS_ADV,
    { k: 'close', kind: 'orbit', m0: 4, m1: 5, dur: 4, cam: 'custom', camP: CAMV, short: 'Zamknięcie', title: 'Dreny i zamknięcie skóry — bez siatki',
      cap: 'Naprawa wyłącznie z tkanek własnych chorego, bez siatki — jak w oryginalnym opisie (Ramirez i wsp. 1990). Dreny pod płatami skórno-tłuszczowymi (ryzyko płynu i zaburzeń gojenia brzegów skóry), zamknięcie tkanki podskórnej i skóry.' },
    ACS_CT];
  var ACS_FR = [TAR_FR[0], TAR_FR[1], ACS_FLAP, ACS_EO, ACS_ADV,
    { k: 'mesh', kind: 'orbit', m0: 4, m1: 5, dur: 4, cam: 'custom', camP: CAMV, short: 'Siatka', title: 'Wzmocnienie siatką (onlay)',
      cap: 'Modyfikacja późniejsza niż oryginalny opis (Ramirez 1990 — bez siatki). Siatka na pochewce przedniej i rozcięgnie mięśnia skośnego zewnętrznego, przykrywa szew linii białej i obie szczeliny po przecięciu rozcięgna. Możliwa też siatka za mięśniami prostymi (sublay).' },
    { k: 'close', kind: 'orbit', m0: 5, m1: 6, dur: 4, cam: 'custom', camP: CAMV, short: 'Zamknięcie', title: 'Dreny i zamknięcie skóry',
      cap: 'Dreny pod płatami skórno-tłuszczowymi (ryzyko płynu i zaburzeń gojenia brzegów skóry), zamknięcie tkanki podskórnej i skóry.' },
    ACS_CT];
  var ACS_NOTES = ['Przednie rozdzielenie komponentów (Ramirez i wsp. 1990): mięsień skośny zewnętrzny oddziela się od wewnętrznego w beznaczyniowej warstwie po nacięciu jego rozcięgna bocznie od kresy półksiężycowatej; płat złożony z mięśnia prostego, skośnego wewnętrznego i poprzecznego przesuwa się przyśrodkowo.',
    'Ramirez opisał też oddzielenie mięśnia prostego od pochewki tylnej, co zwiększa przesunięcie.',
    'Wymaga rozległych płatów skórno-tłuszczowych — więcej powikłań rany niż w technice tylnej; odmiany oszczędzające perforatory (okołopępkowe) i endoskopowe ograniczają ten problem.'];
  var ACS0 = ventral({ id: 'acs-orig', vshort: 'Oryginał (bez siatki)', short: 'Ramirez (przednie)', title: 'Przednie rozdzielenie komponentów (Ramirez) — oryginał, bez siatki',
    sub: 'Przecięcie rozcięgna mięśnia skośnego zewnętrznego, przesunięcie mięśni prostych, zamknięcie bez siatki',
    notes: ['Oryginalny opis (Ramirez i wsp. 1990): badanie na 10 zwłokach i u 11 chorych z ubytkami od 4 × 4 do 18 × 35 cm; powłoki odtworzone z tkanek własnych chorego — bez siatki i bez przenoszenia odległych płatów.'].concat(ACS_NOTES,
      ['Siatkę dodano w późniejszych modyfikacjach; obecnie rozdzielenie komponentów zwykle łączy się ze wzmocnieniem siatką (wariant „Z siatką”).', COMMON]),
    cutTools: [{ type: 'wall', op: 'acs', her: 'inc', noMesh: true }], mEnd: 5, box: [[-12, -3, 0], [12, 1, 9]], singleFrames: ACS0_FR });
  var ACS = ventral({ id: 'acs-mesh', vshort: 'Z siatką (onlay)', short: 'Ramirez (przednie)', title: 'Przednie rozdzielenie komponentów (Ramirez) — wzmocnienie siatką (onlay)',
    sub: 'Przecięcie rozcięgna mięśnia skośnego zewnętrznego, przesunięcie mięśni prostych, siatka onlay',
    notes: ACS_NOTES.concat(['Siatka jako wzmocnienie — modyfikacja późniejsza niż oryginalny opis (Ramirez 1990 — bez siatki): onlay (pokazana) albo sublay; po przecięciu rozcięgna boczna ściana jest słabsza.', COMMON]),
    cutTools: [{ type: 'wall', op: 'acs', her: 'inc' }], mEnd: 6, box: [[-12, -3, 0], [12, 1, 9]], singleFrames: ACS_FR });

  function umbFrames(mesh) {
    var cam = { t: [0, -5.5, 4.9], az: 0, el: -48, k: 0.62 }, camC = { t: [0, -5.5, 4.7], az: 0, el: -50, k: 0.48 }, camF = { t: [0, -5.8, 6.0], az: 0, el: 6, k: 1.7 };
    var F = [
      { k: 'normal', kind: 'orbit', m0: 0, m1: 0, cam: 'custom', camP: cam, short: 'Przepuklina', title: 'Przepuklina pępkowa',
        cap: mesh ? 'Ubytek w pierścieniu pępkowym (ok. 2 cm); w worku tłuszcz przedotrzewnowy i sieć. Przekrój przez środek pępka.' : 'Mały ubytek w pierścieniu pępkowym (poniżej 1 cm); w worku tłuszcz przedotrzewnowy. Przekrój przez środek pępka.' },
      { k: 'inc', kind: 'orbit', m0: 0, m1: 1, dur: 4, cam: 'custom', camP: camF, wall: 'full', short: 'Cięcie', title: 'Cięcie pod pępkiem',
        cap: 'Cięcie łukowate pod pępkiem; worek przepuklinowy oddzielony od skóry pępka (zachowana jej łączność z powłokami) i od brzegów ubytku.' },
      { k: 'sac', kind: 'orbit', m0: 1, m1: 2, dur: 4, cam: 'custom', camP: camC, short: 'Worek', title: 'Odprowadzenie worka',
        cap: mesh ? 'Worek odprowadzony bez otwierania; za powięzią wytworzona przestrzeń przedotrzewnowa dookoła ubytku, o kilka centymetrów szersza niż on.' : 'Worek odprowadzony bez otwierania do jamy brzusznej (przestrzeń przedotrzewnowa).' }
    ];
    if (mesh) F.push({ k: 'mesh', kind: 'orbit', m0: 2, m1: 3, dur: 4, cam: 'custom', camP: camC, short: 'Siatka', title: 'Siatka przedotrzewnowa',
      cap: 'Płaska siatka w przestrzeni przedotrzewnowej, rozłożona bez fałdów, z zakładem kilku centymetrów (typowo ok. 3 cm) poza brzegi ubytku.' });
    F.push({ k: 'close', kind: 'orbit', m0: mesh ? 3 : 2, m1: mesh ? 4 : 3, dur: 4, cam: 'custom', camP: cam, short: 'Zamknięcie', title: mesh ? 'Zamknięcie powięzi nad siatką' : 'Zszycie ubytku',
      cap: mesh ? 'Brzegi ubytku zszyte nad siatką szwami niewchłanialnymi lub wolno wchłanialnymi; skóra pępka przyszyta do powięzi, zamknięcie skóry.' : 'Ubytek zszyty szwami niewchłanialnymi lub wolno wchłanialnymi (szew pierwotny — tylko przy ubytku poniżej 1 cm); skóra pępka przyszyta do powięzi, zamknięcie skóry.' });
    return F;
  }
  function umbVar(mesh) {
    return ventral({ id: mesh ? 'umb-mesh' : 'umb-sut', vshort: mesh ? 'Siatka przedotrzewnowa (≥ 1 cm)' : 'Szew (< 1 cm)', short: 'Przepuklina pępkowa',
      title: mesh ? 'Przepuklina pępkowa — siatka przedotrzewnowa' : 'Przepuklina pępkowa — szew pierwotny',
      sub: mesh ? 'Dostęp otwarty, płaska siatka przedotrzewnowa' : 'Dostęp otwarty, szew pierwotny ubytku',
      notes: ['Wytyczne EHS/AHS (Henriksen i wsp. 2020): siatka zmniejsza odsetek nawrotów i jest zalecana w naprawie przepuklin pępkowych i w kresie białej; większość można operować z dostępu otwartego z płaską siatką przedotrzewnową.',
        'Szew pierwotny bierze się pod uwagę przy małym ubytku (poniżej 1 cm).',
        'Dostęp laparoskopowy (np. IPOM) rozważa się przy dużym ubytku albo dużym ryzyku powikłań rany.',
        'Przy współistniejącym rozejściu mięśni prostych albo przepuklinie w bliźnie postępowanie jest inne (rekonstrukcja powłok).',
        COMMON],
      cutTools: [{ type: 'wall', op: mesh ? 'umb' : 'umbs', her: mesh ? 'umb' : 'umbS' }], mEnd: mesh ? 4 : 3, box: [[-6.5, -6, 2], [6.5, -2.5, 8]], singleFrames: umbFrames(mesh) });
  }
  var UMB = { cat: 'hernia', id: 'umb', short: 'Przepuklina pępkowa', title: 'Przepuklina pępkowa — naprawa otwarta', variants: [umbVar(true), umbVar(false)] };

  // pozycja na liście: kategoria „Herniologia” po jelicie grubym (przed badaniami)
  var at = A.PROCS.length; A.PROCS.forEach(function (p, i) { if (p.cat === 'trials' && at === A.PROCS.length) at = i; });
  A.PROCS.splice(at, 0, UMB, { cat: 'hernia', id: 'tar', short: TAR.short, title: TAR.title, variants: [TAR] }, { cat: 'hernia', id: 'acs', short: ACS.short, title: 'Przednie rozdzielenie komponentów (Ramirez)', variants: [ACS0, ACS] });
  var ci = A.CATS.length; A.CATS.forEach(function (c, i) { if (c.id === 'trials') ci = i; });
  A.CATS.splice(ci, 0, { id: 'hernia', name: 'Herniologia' });
})(typeof window !== 'undefined' ? window : globalThis);
