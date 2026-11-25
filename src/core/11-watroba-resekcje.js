/* =====================================================================
   WĄTROBA: resekcje (bisegmentektomia II/III, prawa i lewa hemihepatektomia, ALPPS) i slajd „Guz w wątrobie — zakres resekcji”
   Model: segmenty i naczynia z ANAT.LIVER (10-watroba.js). Każda resekcja: segmenty usuwane (rem), przecięcia naczyń (cuts: id odcinka, t, rodzaj),
   odcinki usuwane w całości z preparatem (gone), kierunek odsunięcia preparatu (dir).
   Oś czasu m: 0 plan, 0–1 kontrola dopływu (podwiązania, linia demarkacyjna), 1–2 przecięcie miąższu i żyły wątrobowej, 2–3 usunięcie preparatu, 3 stan po.
   ALPPS: 0–1 etap I (podwiązanie prawej gałęzi PV, podział miąższu in situ z przecięciem szypuł segmentu IV), 1–2 przerost FLR, 2–3 etap II (trisekcjonektomia prawa).
   Nazewnictwo: Brisbane 2000 (Strasberg 2005); ALPPS: Schnitzbauer i wsp., Ann Surg 2012; margines przy przerzutach raka jelita grubego:
   Pawlik i wsp., Ann Surg 2005 (każdy margines R0 ≥ 1 mm). Schemat: zakresy i kikuty uproszczone.
   Dostęp (slajd „Dostęp”, ANAT.ACCESS['lv-…']; m −1 → −0,02): decyzja autora 2026-11-25 — otwarty zawsze cięciem J (Makuuchiego, wersja
   zmodyfikowana bez wejścia w klatkę piersiową — Chang i wsp., Arch Surg 2010), laparoskopia w II/III i hemihepatektomiach (trokary w łuku
   przypominającym cięcie J, wydobycie przez cięcie Pfannenstiela — Herman i wsp., Surg Endosc 2013; zasada ośrodka), bez robota; ALPPS — tylko otwarty.
   ===================================================================== */
(function (root) {
  'use strict';
  var A = root.ANAT;
  function both(ids) { var o = []; ids.forEach(function (i) { o.push(i, 'ha_' + i, 'bd_' + i); }); return o; }
  var RIGHT = both(['rapv', 'p8', 'p5', 'rppv', 'p7', 'p6']), LEFT = both(['upv', 'p2', 'p3', 'p4b', 'p4a']);
  function cut3(id, t, name, on, kind) { return [{ id: id, t: t, name: name, on: on, kind: kind || 'lig' }, { id: 'ha_' + id, t: t, on: on + 0.02, kind: kind || 'lig' }, { id: 'bd_' + id, t: t, on: on + 0.04, kind: kind || 'lig' }]; }
  var RES = {
    b23: { rem: ['2', '3'], dir: [1, 0.35, 0.25], gone: [], keepGb: true,
      cuts: cut3('p2', 0.18, 'Szypuła segmentu II (podwiązana)', 0.3).concat(cut3('p3', 0.15, 'Szypuła segmentu III (podwiązana)', 0.45),
        [{ id: 'lhv', t: 0.36, name: 'Żyła wątrobowa lewa (stapler)', on: 1.55, kind: 'stap' }]),
      specimen: 'Preparat: segmenty II i III', remnant: 'Pozostała wątroba: I, IV–VIII' },
    rh: { rem: ['5', '6', '7', '8'], dir: [-1, 0.1, 0.25], gone: RIGHT.concat(['cyd', 'gb']),
      cuts: [{ id: 'rha', t: 0.55, name: 'Tętnica wątrobowa prawa (podwiązana)', on: 0.25, kind: 'lig' }, { id: 'rpv', t: 0.45, name: 'Prawa gałąź żyły wrotnej (podwiązana)', on: 0.4, kind: 'lig' },
        { id: 'rhd', t: 0.45, name: 'Przewód wątrobowy prawy (przecięty)', on: 0.55, kind: 'lig' }, { id: 'rhv', t: 0.12, name: 'Żyła wątrobowa prawa (stapler)', on: 1.6, kind: 'stap' }],
      specimen: 'Preparat: segmenty V–VIII (z pęcherzykiem)', remnant: 'Pozostała wątroba: I–IV' },
    lh: { rem: ['2', '3', '4a', '4b'], dir: [1, 0.15, 0.3], gone: LEFT.concat(['cyd', 'gb']),
      cuts: [{ id: 'lha', t: 0.6, name: 'Tętnica wątrobowa lewa (podwiązana)', on: 0.25, kind: 'lig' }, { id: 'lpv', t: 0.5, name: 'Lewa gałąź żyły wrotnej (podwiązana)', on: 0.4, kind: 'lig' },
        { id: 'lhd', t: 0.58, name: 'Przewód wątrobowy lewy (przecięty)', on: 0.55, kind: 'lig' }, { id: 'lhv', t: 0.12, name: 'Żyła wątrobowa lewa (stapler)', on: 1.6, kind: 'stap' }],
      specimen: 'Preparat: segmenty II–IV (z pęcherzykiem)', remnant: 'Pozostała wątroba: I, V–VIII' },
    alpps: { rem: ['4a', '4b', '5', '6', '7', '8'], dir: [-1, 0.1, 0.3], gone: RIGHT.concat(['cyd', 'gb']), hyper: ['2', '3'], split: true,
      // etap I: podwiązanie prawej gałęzi PV, potem w trakcie podziału miąższu przecięcie szypuł segmentu IV w płaszczyźnie podziału (technika oryginalna)
      cuts: [{ id: 'rpv', t: 0.45, name: 'Prawa gałąź żyły wrotnej (podwiązana — etap I)', on: 0.3, kind: 'lig' }]
        .concat(cut3('p4a', 0.12, 'Szypuły segmentu IV (przecięte — etap I)', 0.75), cut3('p4b', 0.12, null, 0.77),
          [{ id: 'rha', t: 0.55, name: 'Tętnica wątrobowa prawa', on: 2.05, kind: 'lig' }, { id: 'rhd', t: 0.45, name: 'Przewód wątrobowy prawy', on: 2.12, kind: 'lig' },
            { id: 'mhv', t: 0.12, name: 'Żyła wątrobowa pośrodkowa (stapler)', on: 2.28, kind: 'stap' }, { id: 'rhv', t: 0.12, name: 'Żyła wątrobowa prawa (stapler)', on: 2.34, kind: 'stap' }]),
      specimen: 'Preparat: segmenty IV–VIII', remnant: 'Przyszła pozostała wątroba (FLR): II, III (+ I)' }
  };
  /* ---------- dostęp: powłoki ANAT.BODY przeniesione do układu wątroby jak w adrenalektomii (14b-nadnercza.js: skala 1,45, wyrostek mieczykowaty ok. y 2,5);
     cięcia i trokary w układzie powłok (x+ lewa strona chorego, y+ dogłowowo; pępek [0, −5,5], wyrostek [0, 8,7]); target — pole operacyjne w układzie powłok ---------- */
  var LV_XF = { s: 1.45, d: [0, -10.115, -0.8] };
  function lvBodyPt(p) { return [p[0] / LV_XF.s, (p[1] - LV_XF.d[1]) / LV_XF.s, (p[2] - LV_XF.d[2]) / LV_XF.s]; }
  // ujęcie: cały brzuch od łuków żebrowych do spojenia (cięcie Pfannenstiela), ciało przesunięte w prawo ekranu — po lewej podpis kadru; tp — ekran pionowy
  var LV_ACAM = { t: [-18.2, -14.2, 1.0], tp: [0.2, -14.0, 1.0], az: 0, el: 12, k: 1.9, kp: 1.45 };
  // cięcie J (Makuuchiego): pośrodkowe od wyrostka mieczykowatego do ok. 2–3 cm nad pępkiem, łukiem w prawo i poprzecznie przez prawy mięsień prosty
  // ku linii pachowej przedniej (koniec XI żebra); wersja zmodyfikowana — bez przejścia w przestrzeń międzyżebrową
  var LV_J = { pts: [[0, 8.1], [0, 4.2], [0, 0.4], [0, -2.0], [-0.45, -3.05], [-1.5, -3.7], [-3.5, -3.95], [-5.9, -3.8], [-8.0, -3.35], [-9.5, -2.75]],
    name: 'Cięcie J (Makuuchiego)', sub: 'pośrodkowe i poprzeczne w prawo, nad pępkiem', t: [-0.86, -0.46], open: [-0.42, -0.12], w: 0.85 };
  var LV_J_TXT = 'Cięcie J (Makuuchiego): pośrodkowe od wyrostka mieczykowatego do okolicy 2–3 cm nad pępkiem, potem łukiem w prawo i poprzecznie, z przecięciem prawego mięśnia prostego, ku linii pachowej przedniej (koniec XI żebra). Wersja zmodyfikowana nie przechodzi w przestrzeń międzyżebrową. Retraktory unoszą prawy łuk żebrowy; cięcie odsłania całą wątrobę, wnękę, żyłę główną dolną i ujścia żył wątrobowych.';
  function lvOpen(end) { return { title: 'Dostęp otwarty: cięcie J (Makuuchiego)', short: 'cięcie J (Makuuchiego)', side: -1, text: LV_J_TXT + (end ? ' ' + end : ''), cuts: [LV_J], ports: [] }; }
  var LV_EXT = { pts: A.ACCESS.rh.lap.ext.pts, name: 'Cięcie Pfannenstiela', sub: 'wydobycie preparatu w worku' };
  var LV_POS = 'Chory na plecach, w pozycji anty-Trendelenburga, zwykle z rozsuniętymi nogami (operator między nimi). ';
  var LV_EXT_TXT = ' Preparat w worku wydobyty przez cięcie Pfannenstiela.';
  function lvLap(short, text, ports) { return { title: 'Dostęp laparoskopowy', short: short, side: 0, text: LV_POS + text + LV_EXT_TXT, first: 0, insuf: [-0.76, -0.62], ports: ports, ext: LV_EXT }; }
  // trokary w łuku wokół pola operacyjnego (układ przypominający cięcie J); lewa hemihepatektomia — odbicie lustrzane prawej
  var OPT = { mm: 12, name: '12 mm — optyka (kamera)' }, SUBX = { at: [0, 6.5], mm: 5, name: '5 mm — pomocniczy', sub: 'pod wyrostkiem mieczykowatym (odsysanie)' };
  function lvPorts(sd) {
    var R = sd < 0, nm = R ? 'prawej' : 'lewej', nm2 = R ? 'lewy' : 'prawy';
    return [Object.assign({ at: [sd * 1.2, -3.0], sub: 'nad pępkiem, na ' + (R ? 'prawo' : 'lewo') + ' od linii pośrodkowej' }, OPT),
      { at: [sd * 6.2, 0.2], mm: 12, name: '12 mm — narzędzie, stapler', sub: 'w ' + nm + ' linii środkowo-obojczykowej, pod łukiem żebrowym' },
      { at: [-sd * 3.4, 1.4], mm: 12, name: '12 mm — narzędzie', sub: 'w ' + (R ? 'lewym' : 'prawym') + ' nadbrzuszu, przez ' + nm2 + ' mięsień prosty' },
      { at: [sd * 9.4, -2.4], mm: 5, name: '5 mm — odciąganie', sub: 'w ' + nm + ' linii pachowej przedniej' }, SUBX];
  }
  var LV_TGT = { rh: lvBodyPt([-5.0, 0.2, 0]), lh: lvBodyPt([3.0, 1.0, 0]), b23: lvBodyPt([5.5, 1.2, 0.6]), alpps: lvBodyPt([-2.5, 0.6, 0]) };
  A.ACCESS['lv-rh'] = { target: LV_TGT.rh, cam: LV_ACAM, xf: LV_XF, open: lvOpen(),
    lap: lvLap('5 trokarów, wydobycie przez cięcie Pfannenstiela', 'Pięć trokarów w łuku pod prawym łukiem żebrowym (układ przypominający cięcie J): optyka 12 mm nad pępkiem, na prawo od linii pośrodkowej (wprowadzona techniką otwartą, potem odma otrzewnowa), 12 mm w prawej linii środkowo-obojczykowej (przecinanie miąższu, stapler na żyłę wątrobową prawą), 12 mm w lewym nadbrzuszu, 5 mm w prawej linii pachowej przedniej (odciąganie wątroby) i 5 mm pod wyrostkiem mieczykowatym.', lvPorts(-1)) };
  A.ACCESS['lv-lh'] = { target: LV_TGT.lh, cam: LV_ACAM, xf: LV_XF, open: lvOpen(),
    lap: lvLap('5 trokarów, wydobycie przez cięcie Pfannenstiela', 'Pięć trokarów w łuku pod lewym łukiem żebrowym (odbicie lustrzane układu do prawej hemihepatektomii): optyka 12 mm nad pępkiem, na lewo od linii pośrodkowej (wprowadzona techniką otwartą, potem odma otrzewnowa), 12 mm w lewej linii środkowo-obojczykowej (przecinanie miąższu, stapler na żyłę wątrobową lewą), 12 mm w prawym nadbrzuszu, 5 mm w lewej linii pachowej przedniej (odciąganie żołądka) i 5 mm pod wyrostkiem mieczykowatym.', lvPorts(1)) };
  // bisegmentektomia II/III: laparoskopia — postępowanie z wyboru (metaanaliza Macacari i wsp., Int J Surg 2019); cztery trokary (układ lewostronny bez portu pod wyrostkiem)
  A.ACCESS['lv-b23'] = { target: LV_TGT.b23, cam: LV_ACAM, xf: LV_XF, open: lvOpen(),
    lap: lvLap('4 trokary, wydobycie przez cięcie Pfannenstiela', 'Laparoskopia jest tu postępowaniem z wyboru (mniejsza utrata krwi i krótszy pobyt niż po operacji otwartej). Cztery trokary w łuku pod lewym łukiem żebrowym: optyka 12 mm nad pępkiem (wprowadzona techniką otwartą, potem odma otrzewnowa), 12 mm w lewej linii środkowo-obojczykowej (stapler na miąższ i żyłę wątrobową lewą), 5 mm w prawym nadbrzuszu i 5 mm w lewej linii pachowej przedniej.',
      lvPorts(1).slice(0, 4).map(function (p, i) { return i === 0 ? Object.assign({}, p, { at: [0.6, -3.0], sub: 'nad pępkiem' }) : i === 2 ? Object.assign({}, p, { mm: 5, name: '5 mm — narzędzie' }) : p; })) };
  // ALPPS: oba etapy przez to samo cięcie J; bez laparoskopii (decyzja autora)
  A.ACCESS['lv-alpps'] = { target: LV_TGT.alpps, cam: LV_ACAM, xf: LV_XF,
    open: lvOpen('Oba etapy ALPPS przez to samo cięcie: po etapie I rana zamknięta, w etapie II (po 7–14 dniach) otwierana ponownie.') };
  function fr(k, m0, m1, short, title, cap, camP) { return { k: k, kind: 'orbit', m0: m0, m1: m1, dur: m1 > m0 ? 4 : 0, cam: camP ? 'custom' : 'front', camP: camP, short: short, title: title, cap: cap }; }
  var HILUM = { t: [0.2, -4, 0], az: 18, el: -32, k: 0.62 };
  function resAn(op, short, title, sub, notes, caps) {
    var R = RES[op], alpps = op === 'alpps';
    var frames = alpps ? [
      fr('normal', 0, 0, 'Plan', 'ALPPS — plan', caps[0]),
      fr('st1', 0, 1, 'Etap I', 'Etap I: podwiązanie prawej gałęzi PV i podział miąższu', caps[1]),
      fr('hyper', 1, 2, 'Przerost FLR', 'Przerost przyszłej pozostałej wątroby (7–14 dni)', caps[2]),
      fr('st2', 2, 3, 'Etap II', 'Etap II: trisekcjonektomia prawa', caps[3]),
      fr('post', 3, 3, 'Po resekcji', 'Stan po ALPPS', caps[4])
    ] : [
      fr('normal', 0, 0, 'Plan', 'Zakres resekcji', caps[0]),
      fr('inflow', 0, 1, 'Dopływ', 'Kontrola dopływu i linia demarkacyjna', caps[1], op === 'b23' ? null : HILUM),
      fr('trans', 1, 2, 'Przecięcie miąższu', 'Przecięcie miąższu', caps[2]),
      fr('remove', 2, 3, 'Usunięcie', 'Usunięcie preparatu', caps[3]),
      fr('post', 3, 3, 'Po resekcji', 'Stan po resekcji', caps[4])
    ];
    return { cat: 'liver', id: 'lv-' + op, short: short, title: title, sub: sub, notes: notes, objects: [], marks: [], cutTools: [{ type: 'lvres', op: op, R: R }], anastTools: [], commonCuts: 0,
      mEnd: 3, single: true, box: [[-11.5, -10, -7], [11, 8.5, 6]], access: 'lv-' + op, singleFrames: frames };
  }
  var COMMON = 'Schemat: granice segmentów uproszczone; zakres ustala się indywidualnie (choroba, objętość i czynność pozostałej wątroby).';
  var P_B23 = resAn('b23', 'Bisegmentektomia II/III', 'Bisegmentektomia II/III', 'Usunięcie segmentów II i III (na lewo od więzadła obłego)',
    ['Usuwa się segmenty II i III leżące na lewo od więzadła obłego i szczeliny pępkowej (w nazewnictwie Brisbane 2000 — sekcjonektomia boczna lewa).',
      'Szypuły segmentów II i III podwiązuje się na lewo od więzadła obłego, poza szczeliną pępkową; preparowanie w szczelinie grozi odnaczynieniem segmentu IV, którego szypuły odchodzą w niej po prawej stronie.',
      'Żyłę wątrobową lewą przecina się staplerem w miąższu, blisko jej ujścia, ale obwodowo od dopływu żył z segmentu IV, by zachować odpływ segmentu IV.', COMMON],
    ['Planowany zakres: segmenty II i III (sekcja boczna lewa).', 'Szypuły segmentów II i III podwiązane na lewo od więzadła obłego; zmiana barwy wyznacza linię demarkacyjną.',
      'Przecięcie miąższu wzdłuż więzadła sierpowatego; żyła wątrobowa lewa przecięta staplerem.', 'Preparat (segmenty II i III) usunięty.', 'Pozostają segmenty I i IV–VIII; kikuty szypuł II i III oraz żyły wątrobowej lewej.']);
  var P_RH = resAn('rh', 'Prawa hemihepatektomia', 'Prawa hemihepatektomia', 'Usunięcie segmentów V–VIII',
    ['Usuwa się prawą wątrobę (segmenty V–VIII) w płaszczyźnie Cantliego; żyła wątrobowa pośrodkowa zostaje z lewą wątrobą.',
      'We wnęce podwiązuje się tętnicę wątrobową prawą, prawą gałąź żyły wrotnej i przewód wątrobowy prawy; pęcherzyk usuwa się.',
      'Po kontroli dopływu na powierzchni wątroby pojawia się linia demarkacyjna; wzdłuż niej przecina się miąższ, a na końcu żyłę wątrobową prawą (stapler).',
      'Pozostaje ok. 35% miąższu (I–IV); bezpieczna objętość zależy od czynności wątroby.', COMMON],
    ['Planowany zakres: segmenty V–VIII.', 'Podwiązanie tętnicy wątrobowej prawej, prawej gałęzi żyły wrotnej i przecięcie przewodu wątrobowego prawego; prawa wątroba zmienia barwę (linia demarkacyjna).',
      'Przecięcie miąższu wzdłuż linii Cantliego, po prawej stronie żyły wątrobowej pośrodkowej; żyła wątrobowa prawa przecięta staplerem.', 'Preparat (V–VIII z pęcherzykiem) usunięty.',
      'Pozostają segmenty I–IV z żyłą wątrobową pośrodkową i lewą; kikuty prawych struktur wnęki i żyły wątrobowej prawej.']);
  var P_LH = resAn('lh', 'Lewa hemihepatektomia', 'Lewa hemihepatektomia', 'Usunięcie segmentów II–IV',
    ['Usuwa się lewą wątrobę (segmenty II–IV) w płaszczyźnie Cantliego; płat ogoniasty (I) zostaje, jeśli nie jest objęty chorobą.',
      'We wnęce podwiązuje się tętnicę wątrobową lewą, lewą gałąź żyły wrotnej (za odejściem gałęzi do płata ogoniastego) i przewód wątrobowy lewy.',
      'Pokazany wariant zachowuje żyłę wątrobową pośrodkową z prawą wątrobą; żyłę wątrobową lewą przecina się staplerem. Pęcherzyk zwykle usuwa się.', COMMON],
    ['Planowany zakres: segmenty II–IV.', 'Podwiązanie tętnicy wątrobowej lewej, lewej gałęzi żyły wrotnej i przecięcie przewodu wątrobowego lewego; lewa wątroba zmienia barwę.',
      'Przecięcie miąższu wzdłuż linii Cantliego, po lewej stronie żyły wątrobowej pośrodkowej; żyła wątrobowa lewa przecięta staplerem.', 'Preparat (II–IV z pęcherzykiem) usunięty.',
      'Pozostają segmenty I i V–VIII z żyłą wątrobową prawą i pośrodkową; kikuty lewych struktur wnęki i żyły wątrobowej lewej.']);
  var P_ALPPS = resAn('alpps', 'ALPPS', 'ALPPS — podział wątroby i podwiązanie prawej gałęzi żyły wrotnej (resekcja dwuetapowa)', 'Dwuetapowa trisekcjonektomia prawa z szybkim przerostem segmentów II i III',
    ['ALPPS (Associating Liver Partition and Portal vein Ligation for Staged hepatectomy): gdy przyszła pozostała wątroba (FLR) jest za mała do jednoetapowej resekcji.',
      'Etap I: podwiązanie prawej gałęzi żyły wrotnej i podział miąższu wzdłuż więzadła sierpowatego (in situ split) z przecięciem szypuł segmentu IV w płaszczyźnie podziału; tętnica wątrobowa prawa, przewód wątrobowy prawy i żyły wątrobowe pozostają.',
      'W ciągu 7–14 dni segmenty II i III (z płatem ogoniastym) szybko się powiększają; ocena objętości w TK przed etapem II.',
      'Etap II: trisekcjonektomia prawa — usunięcie segmentów IV–VIII z przecięciem tętnicy wątrobowej prawej, przewodu wątrobowego prawego oraz żył wątrobowych pośrodkowej i prawej.',
      'Schnitzbauer i wsp., Ann Surg 2012. Większy odsetek powikłań niż w klasycznej resekcji dwuetapowej z embolizacją żyły wrotnej — kwalifikacja w ośrodkach referencyjnych. ' + COMMON],
    ['Planowany zakres: segmenty IV–VIII; przyszła pozostała wątroba (FLR) to segmenty II i III z płatem ogoniastym.',
      'Etap I: podwiązanie prawej gałęzi żyły wrotnej i podział miąższu wzdłuż więzadła sierpowatego z przecięciem szypuł segmentu IV; obie części zostają w jamie brzusznej.',
      'Po 7–14 dniach segmenty II i III wyraźnie się powiększają (krew wrotna płynie tylko do nich i do płata ogoniastego), a prawa część przestaje rosnąć i częściowo się zmniejsza.',
      'Etap II: przecięcie tętnicy wątrobowej prawej, przewodu wątrobowego prawego oraz żył wątrobowych pośrodkowej i prawej; usunięcie segmentów IV–VIII.',
      'Pozostają powiększone segmenty II i III z płatem ogoniastym oraz żyła wątrobowa lewa.']);

  // „Guz w wątrobie — zakres resekcji”: dwa warianty — metastazektomia i resekcja anatomiczna; kadr 1 — położenie guza (przeciąganie), kadr 2 — resekcja
  var T_NOTES = ['Resekcja nieanatomiczna (metastazektomia, resekcja oszczędzająca miąższ): wycięcie guza z marginesem zdrowego miąższu. Przy przerzutach raka jelita grubego liczy się margines R0 — za wystarczający uznaje się już ≥ 1 mm (Pawlik i wsp., Ann Surg 2005), zwykle planuje się ok. 1 cm; resekcja oszczędzająca miąższ daje przeżycie nie gorsze niż hemihepatektomia czy sekcjonektomia i częściej pozwala na ponowną resekcję przy nawrocie (Mise i wsp., Ann Surg 2016).',
    'Resekcja anatomiczna: usunięcie całego segmentu (lub segmentów) zaopatrywanego przez szypułę, w której obszarze leży guz; częściej przy raku wątrobowokomórkowym.',
    'Gdy guz leży na granicy segmentów lub blisko szypuły albo dużej żyły wątrobowej, zakres rośnie (bisegmentektomia, sekcjonektomia, hemihepatektomia).',
    'Pokazywany odsetek miąższu pozostającego po resekcji to średnie udziały segmentów u dorosłych bez choroby wątroby (Abdalla i wsp. 2004); różnice osobnicze są duże. ' + COMMON];
  function tumorAn(mode, vshort) {
    var meta = mode === 'meta';
    return { cat: 'liver', id: 'lv-guz-' + mode, vshort: vshort, short: 'Guz: zakres resekcji', title: 'Guz w wątrobie — ' + (meta ? 'metastazektomia' : 'resekcja anatomiczna'),
      sub: meta ? 'Przesuń przerzut, potem zobacz jego wycięcie z marginesem' : 'Przesuń guz, potem zobacz usunięcie segmentów z podwiązaniem szypuł',
      notes: T_NOTES, objects: [], marks: [], cutTools: [{ type: 'lvtumor', mode: mode }], anastTools: [], commonCuts: 0, mEnd: 1, single: true, box: [[-11.5, -9, -7], [11, 8.5, 6]],
      singleFrames: [
        { k: 'pos', kind: 'orbit', m0: 0, m1: 0, cam: 'front', short: meta ? 'Położenie przerzutu' : 'Położenie guza', title: meta ? 'Położenie przerzutu' : 'Położenie guza', cap: '' },
        { k: 'res', kind: 'orbit', m0: 0, m1: 1, dur: meta ? 4 : 6, cam: 'front', short: 'Resekcja', title: meta ? 'Metastazektomia' : 'Resekcja anatomiczna', cap: '' }
      ] };
  }
  var TUMOR = { cat: 'liver', id: 'lv-guz', short: 'Guz: zakres resekcji', title: 'Guz w wątrobie — resekcja nieanatomiczna lub anatomiczna', distinct: true,
    variants: [tumorAn('meta', 'Metastazektomia'), tumorAn('anat', 'Resekcja anatomiczna')] };
  // zakres resekcji anatomicznej dla zbioru segmentów objętych guzem z marginesem: nazwa (przedrostek + numery) i segmenty do usunięcia
  var ROM = { '1': 'I', '2': 'II', '3': 'III', '4a': 'IVa', '4b': 'IVb', '5': 'V', '6': 'VI', '7': 'VII', '8': 'VIII' };
  function resFor(list) {
    var set = list.filter(function (x, i) { return list.indexOf(x) === i; }), c1 = set.indexOf('1') >= 0, S = set.filter(function (x) { return x !== '1'; });
    // IVa + IVb razem liczą się jako segment IV
    var U = S.indexOf('4a') >= 0 && S.indexOf('4b') >= 0 ? S.filter(function (x) { return x[0] !== '4'; }).concat(['4']) : S;
    function ex(L) { var o = []; L.forEach(function (x) { if (x === '4') o.push('4a', '4b'); else o.push(x); }); return o; }
    function sub(L) { return ex(U).every(function (x) { return L.indexOf(x) >= 0; }); }
    function R(pre, suf, rem) { return { pre: pre, suf: suf, rem: c1 ? rem.concat(['1']) : rem, plus1: c1 && U.length > 0 }; }
    var N = function (x) { return x === '4' ? 'IV' : ROM[x]; };
    if (!U.length) return c1 ? { pre: 'Resekcja płata ogoniastego (segmentektomia I)', suf: '', rem: ['1'], plus1: false } : null;
    if (U.length === 1) return R('Segmentektomia', N(U[0]), ex(U));
    if (sub(['2', '3'])) return R('Bisegmentektomia', 'II/III', ['2', '3']);
    if (sub(['5', '8'])) return R('Sekcjonektomia przednia prawa', '(V, VIII)', ['5', '8']);
    if (sub(['6', '7'])) return R('Sekcjonektomia tylna prawa', '(VI, VII)', ['6', '7']);
    if (U.length === 2) return R('Bisegmentektomia', U.slice().sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); }).map(N).join('/'), ex(U));
    if (sub(['4a', '4b', '5', '8'])) return R('Hepatektomia centralna', '(IV, V, VIII)', ['4a', '4b', '5', '8']);
    if (sub(['5', '6', '7', '8'])) return R('Prawa hemihepatektomia', '(V–VIII)', ['5', '6', '7', '8']);
    if (sub(['2', '3', '4a', '4b'])) return R('Lewa hemihepatektomia', '(II–IV)', ['2', '3', '4a', '4b']);
    if (sub(['4a', '4b', '5', '6', '7', '8'])) return R('Prawa trisekcjonektomia', '(IV–VIII)', ['4a', '4b', '5', '6', '7', '8']);
    if (sub(['2', '3', '4a', '4b', '5', '8'])) return R('Lewa trisekcjonektomia', '(II–V, VIII)', ['2', '3', '4a', '4b', '5', '8']);
    return R('Rozległa resekcja — decyzja indywidualna', '', ex(U));
  }
  A.LIVER.resFor = resFor; A.LIVER.ROM = ROM;
  A.LIVER.RES_TXT = { meta: 'Wycięcie guza z marginesem zdrowego miąższu (R0); oszczędza pozostały miąższ. Guz z marginesem w segmentach:', anat: 'Segmenty objęte guzem z marginesem:',
    left: 'Pozostaje ok.', pct: '% miąższu.', plus1: 'z segmentem I', hintM: 'Przeciągnij przerzut po wątrobie; kolorem zaznaczony margines wycięcia.', hintA: 'Przeciągnij guz po wątrobie; kolorem zaznaczone segmenty do usunięcia.',
    metaRes: 'Przerzut wycięty z marginesem zdrowego miąższu; w wątrobie zostaje loża po resekcji. Guz z marginesem w segmentach:',
    // metastazektomia: naczynie (szypuła, żyła wątrobowa) w kuli guza z marginesem — przecięte i podwiązane na brzegu loży
    vesWarn: 'W marginesie leży szypuła lub żyła wątrobowa: jej przecięcie pozbawia dopływu lub odpływu miąższ obwodowo od guza — wtedy rozważa się resekcję anatomiczną.',
    anatRes: 'Podwiązanie szypuł usuwanych segmentów, linia demarkacyjna, przecięcie miąższu i usunięcie segmentów:' };
  function one(an) { return { cat: 'liver', id: an.id, short: an.short, title: an.title, variants: [an] }; }
  var at = 0; A.PROCS.forEach(function (p, i) { if (p.id === 'liver') at = i + 1; });
  A.PROCS.splice.apply(A.PROCS, [at, 0].concat([TUMOR], [P_B23, P_RH, P_LH, P_ALPPS].map(one)));
  A.LIVER.RES = RES;
})(typeof window !== 'undefined' ? window : globalThis);
