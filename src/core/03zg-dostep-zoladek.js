  /* ---------- Dostęp operacyjny — zabiegi żołądka (slajd „Dostęp”, ANAT.ACCESS; model powłok ANAT.BODY w układzie zgodnym z żołądkiem, bez przeniesienia).
     Zakres (decyzja autora 2026-11-25): resekcja dystalna i gastrektomia całkowita — otwarty, laparoskopowy, robotyczny; gastroenterostomia omijająca
     i gastrostomia Stamma — otwarty i laparoskopowy; PEG bez slajdu (diafanoskopia i nakłucie pokazane w samym zabiegu, klucz tylko dla wariantu gstom-stamm).
     Laparoskopia resekcji: 5 trokarów — optyka 12 mm w pępku, po prawej stronie chorego 12 mm przy bocznym brzegu mięśnia prostego i 5 mm pod łukiem
     żebrowym (operator), po lewej układ lustrzany (asystent, 12 mm pod stapler); lewy płat wątroby unoszony retraktorem przez nacięcie pod wyrostkiem
     mieczykowatym. Preparat — jak w zabiegach jelitowych — wydobywany przez cięcie Pfannenstiela (laparoskopia i robot).
     Robot da Vinci Xi (wytyczne producenta dla górnego piętra jamy brzusznej): porty w jednej linii poprzecznej tuż nad pępkiem, co 6–10 cm, ok. 10–20 cm
     od pola operacyjnego; kamera nad pępkiem, jedno ramię po prawej, dwa po lewej; asystent 12 mm w prawym dolnym kwadrancie.
     Gastrektomia całkowita, dostęp otwarty — dwa warianty do wyboru (open: laparotomia pośrodkowa górna; open2: cięcie podżebrowe obustronne „rooftop”). ---------- */
  // ujęcie kadru jak CAM0 w zabiegach jelitowych; model żołądka (z przełykiem) jest wyższy, więc mniejsze k — powłoki tej samej wielkości na ekranie;
  // ekran pionowy (kp): model żołądka węższy niż jelita grubego — kamera dalej, żeby boczne porty robota mieściły się w kadrze
  function camUp(k) { return { t: [-10.5, -4.6, 0.8], tp: [0, -4.6, 0.8], az: 0, el: 12, k: k, kp: +(k * 1.15).toFixed(2) }; }
  var UP_CAMERA = { at: [0, -6.1], mm: 12, name: '12 mm — optyka (kamera)', sub: 'w pępku' };
  var UP_LIVER = { at: [0, 7.2], mm: 5, name: 'Retraktor wątroby', sub: 'nacięcie pod wyrostkiem mieczykowatym' };
  var UP_EXT = { pts: PFANN, name: 'Cięcie Pfannenstiela', sub: 'wydobycie preparatu w worku' };
  function upLap(end) {
    return { title: 'Dostęp laparoskopowy', short: '5 trokarów, wydobycie przez cięcie Pfannenstiela', side: 0,
      text: 'Optyka 12 mm w pępku (technika otwarta, potem odma otrzewnowa). Po prawej stronie chorego (operator): 12 mm przy bocznym brzegu mięśnia prostego, nieco powyżej pępka, i 5 mm pod łukiem żebrowym; po lewej (asystent) — układ lustrzany, 12 mm pod stapler. Lewy płat wątroby uniesiony retraktorem wprowadzonym przez nacięcie pod wyrostkiem mieczykowatym. ' + end,
      first: 0, insuf: [-0.76, -0.62],
      ports: [UP_CAMERA,
        { at: [-5.6, -3.0], mm: 12, name: '12 mm — narzędzie operatora', sub: 'prawa strona, przy bocznym brzegu mięśnia prostego' },
        { at: [-7.0, 1.4], mm: 5, name: '5 mm — narzędzie operatora', sub: 'pod prawym łukiem żebrowym' },
        { at: [5.6, -3.0], mm: 12, name: '12 mm — asystent, stapler', sub: 'lewa strona, przy bocznym brzegu mięśnia prostego' },
        { at: [7.0, 1.4], mm: 5, name: '5 mm — asystent', sub: 'pod lewym łukiem żebrowym' },
        UP_LIVER],
      ext: UP_EXT };
  }
  var UP_ROB_Y = -4.4;
  function upRob(end) {
    return { title: 'Dostęp robotyczny (da Vinci Xi)', short: 'da Vinci Xi, porty w linii poprzecznej', side: 0,
      text: 'Cztery porty robota w jednej linii poprzecznej tuż nad pępkiem, co 6–10 cm (wytyczne producenta: ok. 10–20 cm od pola operacyjnego): kamera nad pępkiem, jedno ramię po prawej stronie chorego, dwa po lewej (najbardziej boczne — do odciągania). Port asystenta 12 mm (stapler) w prawym dolnym kwadrancie; lewy płat wątroby uniesiony retraktorem przez nacięcie pod wyrostkiem mieczykowatym. ' + end,
      first: 1, insuf: [-0.76, -0.62], robot: true, line: [[-8.0, UP_ROB_Y], [10.0, UP_ROB_Y]],
      // lab — podpisy naprzemiennie nad i pod linią portów (w jednej linii poziomej nachodziłyby na siebie)
      ports: [{ at: [-5.0, UP_ROB_Y], mm: 8, name: '8 mm — ramię robota', sub: 'prawa strona', lab: [0, 1.4, 0] },
        { at: [0, UP_ROB_Y], mm: 8, name: '8 mm — optyka (kamera)', sub: 'nad pępkiem', lab: [0, -1.6, 0] },
        { at: [5.0, UP_ROB_Y], mm: 8, name: '8 mm — ramię robota', sub: 'lewa strona', lab: [0, 1.4, 0] },
        { at: [9.0, UP_ROB_Y], mm: 8, name: '8 mm — ramię robota', sub: 'lewy bok, do odciągania', lab: [0, -1.6, 0] },
        { at: [-3.4, -9.6], mm: 12, name: '12 mm — port asystenta', sub: 'prawy dolny kwadrant, stapler', assist: true },
        UP_LIVER],
      ext: UP_EXT };
  }
  // cięcie podżebrowe obustronne („rooftop”, Chevron): ok. 2–3 palce poniżej obu łuków żebrowych, od linii pachowej przedniej do linii pachowej przedniej,
  // szczyt w linii pośrodkowej poniżej wyrostka mieczykowatego
  var ROOFTOP = [[-8.2, -0.9], [-6.4, 0.9], [-4.6, 2.7], [-2.6, 4.4], [0, 5.6], [2.6, 4.4], [4.6, 2.7], [6.4, 0.9], [8.2, -0.9]];
  var DG_END = 'Zespolenie wewnątrzbrzuszne, preparat wydobyty w worku przez cięcie Pfannenstiela.';
  ACCESS.dg = { target: [1.8, 1.6, 0.6], cam: camUp(0.96),
    open: openSet({ title: 'Dostęp otwarty: laparotomia pośrodkowa górna', short: 'laparotomia pośrodkowa górna',
      text: 'Laparotomia pośrodkowa górna, od wyrostka mieczykowatego do pępka. Dostęp do żołądka, dwunastnicy i pól węzłowych (limfadenektomia D2); retraktor samotrzymający unosi łuki żebrowe.',
      cuts: [midCut(8.3, -4.6, 'Laparotomia pośrodkowa górna', 'od wyrostka mieczykowatego do pępka')] }),
    lap: upLap(DG_END), rob: upRob(DG_END) };
  var TG_END = 'Zespolenie przełykowo-jelitowe wewnątrzbrzuszne, preparat wydobyty w worku przez cięcie Pfannenstiela.';
  ACCESS.tg = { target: [2.2, 3.4, 0.4], cam: camUp(0.96),
    open: openSet({ title: 'Dostęp otwarty: laparotomia pośrodkowa górna', short: 'laparotomia pośrodkowa górna',
      text: 'Laparotomia pośrodkowa górna od wyrostka mieczykowatego do pępka, w razie potrzeby poniżej (pępek omijany łukiem); dla lepszego dostępu do rozworu przełykowego można wyciąć wyrostek mieczykowaty. Retraktor samotrzymający unosi łuki żebrowe.',
      cuts: [midCut(8.4, -7.0, 'Laparotomia pośrodkowa górna', 'od wyrostka mieczykowatego, pępek omijany łukiem')] }),
    open2: openSet({ title: 'Dostęp otwarty: cięcie podżebrowe obustronne', short: 'cięcie podżebrowe obustronne (rooftop)',
      text: 'Cięcie poprzeczne pod obydwoma łukami żebrowymi (typu „rooftop”, Chevron), ok. 2–3 palce poniżej łuków, od prawej do lewej linii pachowej przedniej, ze szczytem w linii pośrodkowej poniżej wyrostka mieczykowatego; przecina oba mięśnie proste. Szeroki dostęp do nadbrzusza i rozworu przełykowego, zwłaszcza przy szerokim kącie podżebrowym.',
      cuts: [{ pts: ROOFTOP, name: 'Cięcie podżebrowe obustronne', sub: 'poniżej obu łuków żebrowych', t: [-0.86, -0.46], open: [-0.42, -0.12], w: 0.75 }] }),
    lap: upLap(TG_END), rob: upRob(TG_END) };
  ACCESS.gebp = { target: [2.6, -1.8, 0.6], cam: camUp(0.95),
    open: openSet({ title: 'Dostęp otwarty: laparotomia pośrodkowa górna', short: 'krótka laparotomia pośrodkowa górna',
      text: 'Krótka laparotomia pośrodkowa górna, nad pępkiem. Dostęp do krzywizny większej trzonu żołądka i pętli jelita czczego za więzadłem Treitza; pętla podciągnięta przedokrężniczo, zespolenie bok-do-boku staplerem liniowym.',
      cuts: [midCut(6.6, -4.4, 'Laparotomia pośrodkowa górna', 'krótka, nad pępkiem', 0.7)] }),
    lap: { title: 'Dostęp laparoskopowy', short: '4 trokary, bez wydobywania preparatu', side: 0,
      text: 'Optyka 12 mm w pępku (technika otwarta, potem odma otrzewnowa); po lewej stronie chorego 12 mm (stapler) przy bocznym brzegu mięśnia prostego i 5 mm pod łukiem żebrowym, po prawej 5 mm. Pętla jelita czczego za więzadłem Treitza podciągnięta przedokrężniczo i zespolona z żołądkiem staplerem liniowym; otwór po staplerze zamknięty szwem. Bez wydobywania preparatu.',
      first: 0, insuf: [-0.76, -0.62],
      ports: [UP_CAMERA,
        { at: [5.6, -3.0], mm: 12, name: '12 mm — narzędzie, stapler', sub: 'lewa strona, przy bocznym brzegu mięśnia prostego' },
        { at: [7.0, 1.4], mm: 5, name: '5 mm — narzędzie', sub: 'pod lewym łukiem żebrowym' },
        { at: [-5.6, -3.0], mm: 5, name: '5 mm — narzędzie', sub: 'prawa strona' }] } };
  // gastrostomia Stamma: zgłębnik przez osobne nacięcie w lewym nadbrzuszu (GS w 07g-gastrostomia.js); PEG — bez slajdu „Dostęp”
  var GSTOM_SITE = { at: [3.4, 2.2], r: 0.6, name: 'Wyprowadzenie zgłębnika', sub: 'lewe nadbrzusze, przez lewy mięsień prosty' };
  ACCESS['gstom-stamm'] = { target: [3.4, 2.0, 0], cam: camUp(0.94),
    open: openSet({ title: 'Dostęp otwarty: krótka laparotomia górna', short: 'krótka laparotomia pośrodkowa górna',
      text: 'Krótka laparotomia pośrodkowa górna (ok. 6–8 cm) — samodzielnie albo przez laparotomię innej operacji. Zgłębnik wyprowadzony przez osobne nacięcie w lewym nadbrzuszu (przez lewy mięsień prosty), w miejscu przylegania przedniej ściany trzonu żołądka.',
      cuts: [midCut(6.6, 1.6, 'Laparotomia pośrodkowa górna', 'krótka, ok. 6–8 cm', 0.6)], stoma: GSTOM_SITE }),
    lap: { title: 'Dostęp laparoskopowy', short: '3 trokary, zgłębnik w lewym nadbrzuszu', side: 0,
      text: 'Optyka 12 mm w pępku (technika otwarta, potem odma otrzewnowa), trokary 5 mm w prawym i lewym śródbrzuszu. Na przedniej ścianie trzonu szwy kapciuchowe; zgłębnik wprowadzony przez powłoki w lewym nadbrzuszu do żołądka, żołądek przyszyty do otrzewnej ściennej wokół zgłębnika (gastropeksja).',
      first: 0, insuf: [-0.76, -0.62],
      ports: [UP_CAMERA,
        { at: [-5.6, -2.4], mm: 5, name: '5 mm — narzędzie', sub: 'prawe śródbrzusze' },
        { at: [6.2, -4.6], mm: 5, name: '5 mm — narzędzie', sub: 'lewe śródbrzusze' }], stoma: GSTOM_SITE } };
