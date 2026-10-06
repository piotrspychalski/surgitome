  /* =====================================================================
     BADANIA: dwa ramiona obok siebie (split screen) ze wspólną osią czasu
     Oba ramiona w tej samej scenie; przy każdym przebiegu podmieniamy model (M), kamerę i obszar widoku,
     drugie ramię jest wtedy ukryte. Postęp kadru p ∈ [0, 1]; ramię przelicza go na własne m = p × mEnd.
     ===================================================================== */
  // słownik PL→EN badań (dołączany do DICT; tests/i18n.js czyta obie linie)
  var DICT_TRIALS = {"Badania": "Trials", "Punkt wyjścia": "Starting point", "Punkt wyjścia — oba ramiona": "Starting point — both arms", "Interwencja": "Intervention", "Interwencja: ramię A i ramię B": "Intervention: arm A and arm B", "Obie strategie w tym samym tempie, na wspólnej osi czasu.": "Both strategies at the same pace, on a shared timeline.", "Stan po": "After", "Stan po leczeniu": "After treatment", "Kamery zsynchronizowane — kliknij, aby rozłączyć": "Cameras linked — click to unlink", "Kamery niezależne — kliknij, aby połączyć": "Cameras independent — click to link", "Kierownik badania (PI)": "Principal investigator (PI)", "Rola autora (P. Spychalski)": "Author's role (P. Spychalski)", "Populacja": "Population", "Randomizacja": "Randomisation", "Ramiona": "Arms", "Pierwszorzędowy punkt końcowy": "Primary endpoint", "Drugorzędowy punkt końcowy": "Secondary endpoint", "Obserwacja": "Follow-up", "Finansowanie": "Funding", "Schemat edukacyjny; szczegóły wg aktualnej wersji protokołu.": "Educational schematic; details per the current protocol version.", "limfadenektomia": "lymphadenectomy", "bez limfadenektomii": "no lymphadenectomy", "Kolonoskop z nasadką FTRD": "Colonoscope with FTRD cap", "Rak wczesny (T1)": "Early cancer (T1)", "Klips OTSC": "OTSC clip", "Tatuaż tuszem": "Ink tattoo", "Tatuaż (znakowanie tuszem)": "Tattoo (ink marking)", "Krezka z węzłami chłonnymi — pozostaje": "Mesentery with lymph nodes — preserved", "Krezka z węzłami chłonnymi — usuwana": "Mesentery with lymph nodes — removed", "Jelito grube": "Large bowel", "B: Resekcja segmentarna": "B: Segmental resection", "A: eFTR blizny": "A: eFTR of the scar", "B: Chemioradioterapia": "B: Chemoradiotherapy", "ETHOS — leczenie endoskopowe czy operacja we wczesnym raku okrężnicy": "ETHOS — Endoscopic THerapy Or Surgery for early colon cancer", "współkierownik badania (co-PI), Gdańsk": "co-principal investigator (co-PI), Gdańsk", "Randomizacja 1:1.": "1:1 randomisation.", "B: standardowa resekcja segmentarna okrężnicy z limfadenektomią (otwarta, laparoskopowa lub robotowa); tu: hemikolektomia prawa przy zmianie w okrężnicy wstępującej.": "B: standard segmental colectomy with lymphadenectomy (open, laparoscopic or robotic); shown here: right hemicolectomy for a lesion in the ascending colon.", "A: okrężnica z krezką i węzłami chłonnymi zachowana, w ścianie klips OTSC. B: odcinek okrężnicy usunięty razem z krezką i węzłami chłonnymi, zespolenie krętniczo-poprzeczne.": "A: colon with its mesentery and lymph nodes preserved, OTSC clip in the wall. B: colon segment removed with its mesentery and lymph nodes, ileotransverse anastomosis.", "ETHOS — ramię A": "ETHOS — arm A", "Nasadka FTRD na kolonoskopie, klips OTSC, odcięcie pętlą; narząd zachowany": "FTRD cap on the colonoscope, OTSC clip, snare resection; organ preserved", "Kolonoskop z nasadką FTRD (full-thickness resection device) prowadzony do zmiany.": "Colonoscope with an FTRD (full-thickness resection device) cap advanced to the lesion.", "Ściana ze zmianą wciągnięta do nasadki na całą grubość.": "Full-thickness wall with the lesion pulled into the cap.", "Klips OTSC (over-the-scope clip) zaciśnięty u podstawy — zamyka ścianę.": "OTSC (over-the-scope clip) deployed at the base — closes the wall.", "Odcięcie pętlą nad klipsem; preparat w nasadce.": "Snare resection above the clip; specimen in the cap.", "Okrężnica zachowana; krezka i węzły chłonne pozostają; w ścianie zostaje klips OTSC.": "Colon preserved; mesentery and lymph nodes remain; the OTSC clip stays in the wall.", "ETHOS — ramię B": "ETHOS — arm B", "ETHOS, ramię B: resekcja segmentarna okrężnicy z limfadenektomią": "ETHOS, arm B: segmental colectomy with lymphadenectomy", "Tu: hemikolektomia prawa (zmiana w okrężnicy wstępującej)": "Shown here: right hemicolectomy (lesion in the ascending colon)", "Zakres resekcji: prawa połowa okrężnicy razem ze zmianą i krezką z węzłami chłonnymi (limfadenektomia).": "Extent of resection: right colon with the lesion and its mesentery with lymph nodes (lymphadenectomy).", "Preparat usunięty razem z krezką i węzłami chłonnymi.": "Specimen removed with its mesentery and lymph nodes.", "Zespolenie krętniczo-poprzeczne bok-do-boku staplerem liniowym.": "Side-to-side ileotransverse anastomosis with a linear stapler.", "Ciągłość przewodu odtworzona; odcinek okrężnicy usunięty.": "Bowel continuity restored; colon segment removed.", "SCAR — operacja czy resekcja endoskopowa po niedoszczętnym usunięciu wczesnego raka okrężnicy": "SCAR — Surgery versus Endoscopic Resection for incompletely removed early colon CAnceR", "Randomizacja 1:1 (stratyfikacja: R1 vs Rx, ASA).": "1:1 randomisation (stratified by R1 vs Rx and ASA).", "B: resekcja segmentarna okrężnicy (jak w ETHOS); tu: hemikolektomia prawa.": "B: segmental colectomy (as in ETHOS); shown here: right hemicolectomy.", "Blizna po niedoszczętnym endoskopowym usunięciu raka pT1 (R1 lub Rx), oznaczona tatuażem.": "Scar after incomplete endoscopic removal of a pT1 cancer (R1 or Rx), marked with a tattoo.", "SCAR — ramię A": "SCAR — arm A", "SCAR, ramię A: pełnościenne wycięcie blizny (eFTR)": "SCAR, arm A: full-thickness resection of the scar (eFTR)", "Nasadka FTRD, klips OTSC, odcięcie pętlą; narząd zachowany": "FTRD cap, OTSC clip, snare resection; organ preserved", "Kolonoskop z nasadką FTRD (full-thickness resection device) prowadzony do blizny.": "Colonoscope with an FTRD (full-thickness resection device) cap advanced to the scar.", "Ściana z blizną wciągnięta do nasadki na całą grubość.": "Full-thickness wall with the scar pulled into the cap.", "SCAR — ramię B": "SCAR — arm B", "SCAR, ramię B: resekcja segmentarna okrężnicy": "SCAR, arm B: segmental colectomy", "Tu: hemikolektomia prawa": "Shown here: right hemicolectomy", "Zakres resekcji: prawa połowa okrężnicy razem z blizną i krezką z węzłami chłonnymi (limfadenektomia).": "Extent of resection: right colon with the scar and its mesentery with lymph nodes (lymphadenectomy).", "Złożona ciężka chorobowość związana z leczeniem po 3 latach (stomia, duży LARS ≥ 30 pkt, Clavien-Dindo ≥ 3b, CTCAE ≥ 3) — przewaga (superiority); niepowodzenie leczenia związane z chorobą po 3 latach — nie gorsza skuteczność (non-inferiority).": "3-year composite severe treatment-related morbidity (stoma, major LARS ≥ 30 points, Clavien-Dindo ≥ 3b, CTCAE ≥ 3) — superiority; 3-year disease-related treatment failure — non-inferiority.", "Ramię A: badanie i CEA co 3 mies. przez 2 lata, potem co 6 mies. do 5 lat; rektoskopia co 3 mies. przez 2 lata, potem co 6 mies.; MRI miednicy lub EUS co 6 mies.; TK klatki piersiowej i brzucha co rok; kolonoskopia po roku.": "Arm A: examination and CEA every 3 months for 2 years, then every 6 months to 5 years; proctoscopy every 3 months for 2 years, then every 6 months; pelvic MRI or EUS every 6 months; chest and abdomen CT yearly; colonoscopy at 1 year.", "A: eFTR": "A: eFTR", "A: miejsce po resekcji endoskopowej wycięte na całą grubość, krezka i węzły chłonne zachowane, klips w ścianie. B: odcinek okrężnicy usunięty razem z krezką i węzłami chłonnymi.": "A: site of the endoscopic resection excised full-thickness, mesentery and lymph nodes preserved, clip in the wall. B: colon segment removed with its mesentery and lymph nodes.", "A: pełnościenna resekcja endoskopowa (eFTR) — nasadka FTRD, klips OTSC, odcięcie pętlą; narząd zachowany.": "A: endoscopic full-thickness resection (eFTR) — FTRD cap, OTSC clip, snare resection; organ preserved.", "A: pełnościenne wycięcie endoskopowe (eFTR) miejsca po resekcji endoskopowej z klipsem.": "A: endoscopic full-thickness resection (eFTR) of the endoscopic resection site with a clip.", "Blizna po resekcji endoskopowej": "Scar after endoscopic resection", "ECOPOP — Horizon Europe, umowa nr 101156165; sponsor wg rejestru: Norwegian Department of Health and Social Affairs": "ECOPOP — Horizon Europe, grant agreement no. 101156165; sponsor per registry: Norwegian Department of Health and Social Affairs", "ETHOS, ramię A: pełnościenna resekcja endoskopowa (eFTR)": "ETHOS, arm A: endoscopic full-thickness resection (eFTR)", "Oba ramiona wg ESMO 2020 (rak okrężnicy miejscowy): wywiad, badanie i CEA co 3–6 mies. przez 3 lata, potem co 6–12 mies. do 5 lat; kolonoskopia po roku, potem co 3–5 lat (w ramieniu A ocena blizny i klipsa); TK klatki piersiowej i brzucha co 6–12 mies. przez 3 lata — do rozważenia przy wyższym ryzyku nawrotu.": "Both arms per ESMO 2020 (localised colon cancer): history, examination and CEA every 3–6 months for 3 years, then every 6–12 months up to 5 years; colonoscopy at 1 year, then every 3–5 years (arm A: assessment of the scar and clip); chest and abdominal CT every 6–12 months for 3 years — to be considered at higher risk of recurrence.", "Obserwacja 5 lat, wizyty kontrolne wg protokołu; pierwszorzędowe punkty końcowe po 30 dniach i 3 latach.": "5-year follow-up, visits per protocol; primary endpoints at 30 days and 3 years.", "Podwiązanie naczyń u odejścia (centralne podwiązanie); przecięcie jelita krętego i poprzecznicy staplerem liniowym.": "Vessels ligated at their origin (central ligation); ileum and transverse colon divided with a linear stapler.", "Rak okrężnicy wstępującej do 2 cm, uniesiony z zagłębieniem (Paris 0-IIa+IIc), z podejrzeniem naciekania podśluzówki; dystalnie dwa tatuaże tuszem.": "Ascending colon cancer up to 2 cm, slightly elevated with a central depression (Paris 0-IIa+IIc), suspected submucosal invasion; two ink tattoos distally.", "W rejestrze 11, m.in.: nawrót po 1 i 5 latach, przeżycie swoiste i całkowite po 1, 3 i 5 latach, ciężkie powikłania w ciągu roku, czas hospitalizacji, ponowne przyjęcia, sukces techniczny, ślad węglowy, jakość życia (EORTC QLQ-C30).": "11 in the registry, including: recurrence at 1 and 5 years, cancer-specific and overall survival at 1, 3 and 5 years, severe complications within 1 year, length of stay, readmissions, technical success, carbon footprint, quality of life (EORTC QLQ-C30).", "Wiek ≥ 40 lat; nowo rozpoznany rak okrężnicy (bez odbytnicy), makroskopowo podejrzenie naciekania podśluzówki, średnica ≤ 20 mm; w biopsji bez cech wysokiego ryzyka (G3, pączkowanie guza Bd2–Bd3, naciek naczyń chłonnych lub krwionośnych — LVI); w obrazowaniu cT1–2N0M0.": "Age ≥ 40; newly diagnosed colon cancer (rectum excluded), macroscopically suspected submucosal invasion, diameter ≤ 20 mm; no high-risk features on biopsy (G3, tumour budding Bd2–Bd3, lymphatic or blood vessel invasion — LVI); cT1–2N0M0 on imaging.", "Wiek ≥ 40 lat; rak okrężnicy pT1 usunięty endoskopowo niedoszczętnie (R1) lub z niepewnym marginesem (Rx), bez cech wysokiego ryzyka; miejsce resekcji identyfikowalne (tatuaż lub blizna); w TK bez choroby poza T1N0M0.": "Age ≥ 40; pT1 colon cancer removed endoscopically with a positive (R1) or indeterminate (Rx) margin, without high-risk features; resection site identifiable (tattoo or scar); no disease beyond T1N0M0 on CT.", "Współpierwszorzędowe: ciężkie zdarzenia niepożądane (Clavien-Dindo III–V) w ciągu 30 dni; nawrót lub przerzuty w ciągu 3 lat.": "Co-primary: severe adverse events (Clavien-Dindo III–V) within 30 days; recurrence or metastases within 3 years.", "Współpierwszorzędowe: ciężkie zdarzenia niepożądane, ponowne hospitalizacje i zgony w ciągu 30 dni; nawrót raka, przerzuty (węzłowe lub odległe) lub zgon z powodu raka jelita grubego po 3 latach.": "Co-primary: severe adverse events, readmissions and deaths within 30 days; cancer recurrence, metastases (nodal or distant) or colorectal cancer death at 3 years.", "ośrodek GUMed w konsorcjum (główny badacz ośrodka: Jarosław Kobiela)": "Medical University of Gdańsk site in the consortium (site principal investigator: Jarosław Kobiela)"};
  Object.assign(DICT, DICT_TRIALS);
  var SPLIT = { on: false, proc: null, MA: null, MB: null, sync: true, views: [null, null] };
  // etykiety ramienia B w osobnej warstwie; każda warstwa przycięta do swojej połowy
  var labelsA = labelsEl, labelsB = $('labelsB');
  var camA = orbitCam, camB = new THREE.PerspectiveCamera(34, 1, 0.1, 800), controlsB = null;
  window.__sgTest.split = function () { return SPLIT; }; window.__sgTest.camB = camB;

  function trialFrames(Pr) {
    var T = Pr.trial;
    var F = [
      { k: 'start', kind: 'orbit', m0: 0, m1: 0, cam: 'focusVar', short: 'Punkt wyjścia', title: 'Punkt wyjścia — oba ramiona', cap: T.startCap },
      { k: 'interv', kind: 'orbit', m0: 0, m1: 1, dur: 22, cam: 'focus', short: 'Interwencja', title: 'Interwencja: ramię A i ramię B', cap: 'Obie strategie w tym samym tempie, na wspólnej osi czasu.' },
      { k: 'post', kind: 'orbit', m0: 1, m1: 1, cam: 'focus', short: 'Stan po', title: 'Stan po leczeniu', cap: T.postCap }
    ];
    F.forEach(function (f, i) { f.num = String(i + 1); f.vi = 0; });
    return F;
  }

  /* ---------- budowa i sprzątanie ---------- */
  function splitBuild(Pr) {
    build(Pr.variants[0]); var MA = M;
    labelsB.innerHTML = ''; labelsEl = labelsB;
    try { build(Pr.variants[1], true); } finally { labelsEl = labelsA; }
    var MB = M; M = MA; labelsB.hidden = false;
    SPLIT.on = true; SPLIT.proc = Pr; SPLIT.MA = MA; SPLIT.MB = MB;
    viewport.classList.add('split'); $('splitHdr').hidden = false;
    renderPanel(MA.an); splitHeaders();
  }
  function splitTeardown() {
    if (!SPLIT.on && !SPLIT.MB) return;
    if (SPLIT.MB) {
      var MB = SPLIT.MB;
      scene.remove(MB.group); if (MB.toolOv) toolScene.remove(MB.toolOv);
      MB.objs.forEach(function (o) { if (o.geo) o.geo.dispose(); });
      MB.endoTrash.forEach(function (x) { x.dispose(); });
    }
    if (SPLIT.MA) SPLIT.MA.group.visible = true;
    SPLIT.on = false; SPLIT.proc = null; SPLIT.MA = SPLIT.MB = null;
    if (controlsB) controlsB.enabled = false;
    if (!tw) controls.enabled = true;
    viewport.classList.remove('split'); $('splitHdr').hidden = true;
    labelsB.innerHTML = ''; labelsB.hidden = true; labelsA.style.clipPath = ''; hdrKey = '';
  }

  /* ---------- podmiana ramienia ---------- */
  function withArm(k, fn) {
    var sv = { M: M, cam: orbitCam, view: view, m: S.m, lb: labelsEl }, MM = k ? SPLIT.MB : SPLIT.MA;
    M = MM; orbitCam = k ? camB : camA; view = SPLIT.views[k] || view; S.m = sv.m * MM.an.mEnd; labelsEl = k ? labelsB : labelsA;
    try { fn(MM); } finally { M = sv.M; orbitCam = sv.cam; view = sv.view; S.m = sv.m; labelsEl = sv.lb; }
  }
  function splitApplyM() { withArm(0, applyMOne); withArm(1, applyMOne); splitHeaders(); }

  function splitViews() {
    var stacked = MOBILE && H > W * 1.05;
    SPLIT.stacked = stacked;
    SPLIT.views = stacked
      ? [{ x: 0, y: 0, w: W, h: Math.round(H / 2) }, { x: 0, y: Math.round(H / 2), w: W, h: H - Math.round(H / 2) }]
      : [{ x: 0, y: 0, w: Math.round(W / 2), h: H }, { x: Math.round(W / 2), y: 0, w: W - Math.round(W / 2), h: H }];
    var a = SPLIT.views[0].w / SPLIT.views[0].h;
    if (Math.abs(camA.aspect - a) > 1e-3) { camA.aspect = a; camA.updateProjectionMatrix(); }
    var b = SPLIT.views[1].w / SPLIT.views[1].h;
    if (Math.abs(camB.aspect - b) > 1e-3) { camB.aspect = b; camB.updateProjectionMatrix(); }
    layoutHeaders();
  }

  function splitApplyFrame(i, snap) {
    var Pr = curProc();
    if (!SPLIT.on || SPLIT.proc !== Pr) splitBuild(Pr);
    var fr = FR[i];
    S.frame = i; S.m = fr.m0; S.playing = true;
    setEndo(false); setCT(false);
    splitViews();
    capHead();
    var p = preset(fr.cam, SPLIT.views[0].w / SPLIT.views[0].h);
    camTo(p, snap ? 0 : 1.6);
    if (snap || !SPLIT.sync) placeB(p);
    updateStrip(); updateDock();
  }
  function placeB(p) {
    placeCam(camB, p.t, p.az, p.el, p.d);
    if (controlsB) { controlsB.target.copy(p.t); controlsB.update(); }
  }

  /* ---------- synchronizacja kamer; bez niej każda połowa ma własne sterowanie ---------- */
  function ensureControlsB() {
    if (controlsB) return;
    controlsB = new THREE.OrbitControls(camB, canvas);
    controlsB.enableDamping = true; controlsB.dampingFactor = 0.08; controlsB.enabled = false;
    controlsB.target.copy(controls.target);
    controlsB.addEventListener('start', function () { viewport.classList.add('dragging'); });
    controlsB.addEventListener('end', function () { viewport.classList.remove('dragging'); });
  }
  function pickSide(e) {
    if (!SPLIT.on || SPLIT.sync) return;
    var r = viewport.getBoundingClientRect(), v = SPLIT.views[1], x = e.clientX - r.left, y = e.clientY - r.top;
    var inB = !!v && x >= v.x && y >= v.y;
    ensureControlsB(); controlsB.enabled = inB; if (!tw) controls.enabled = !inB;
  }
  viewport.addEventListener('pointerdown', pickSide, true);
  viewport.addEventListener('wheel', pickSide, true);
  function setSync(on) {
    SPLIT.sync = on;
    var b = $('splitSync'); b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.title = tr(on ? 'Kamery zsynchronizowane — kliknij, aby rozłączyć' : 'Kamery niezależne — kliknij, aby połączyć');
    b.setAttribute('aria-label', b.title);
    if (on) { if (controlsB) controlsB.enabled = false; if (!tw) controls.enabled = true; }
    else { ensureControlsB(); controlsB.target.copy(controls.target); controlsB.update(); }
  }

  /* ---------- nagłówki ramion ---------- */
  (function () {
    var h = document.createElement('div'); h.id = 'splitHdr'; h.hidden = true;
    h.innerHTML = '<div class="sh sh0"><b></b><span></span></div><div class="sh sh1"><b></b><span></span></div><div id="splitDiv"></div>' +
      '<button id="splitSync" class="fbtn" aria-pressed="true"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>';
    viewport.insertBefore(h, $('mFloat'));
    $('splitSync').onclick = function () { setSync(!SPLIT.sync); };
    setSync(true);
  })();
  function armCap(an, m) {
    var fr = FR[S.frame]; if (fr && fr.k === 'start') return tr(an.sub); // kadr startowy: opis ramienia
    var t = '';
    (an.trialCaps || []).forEach(function (c) { if (m >= c[0] - 1e-4) t = c[1]; });
    t = tr(t);
    return t;
  }
  function splitHeaders() {
    if (!SPLIT.on) return;
    [SPLIT.MA, SPLIT.MB].forEach(function (MM, k) {
      var el = document.querySelector('.sh' + k), txt = tr(MM.an.vshort), cap = armCap(MM.an, S.m * MM.an.mEnd);
      var b = el.querySelector('b'), s = el.querySelector('span');
      if (b.textContent !== txt) b.textContent = txt;
      if (s.textContent !== cap) s.textContent = cap;
    });
  }
  var hdrKey = '';
  function layoutHeaders() {
    var v = SPLIT.views, key = JSON.stringify(v); if (key === hdrKey || !v[0]) return; hdrKey = key;
    [0, 1].forEach(function (k) {
      var el = document.querySelector('.sh' + k), st = el.style;
      st.left = v[k].x + 'px'; st.top = v[k].y + 'px'; st.width = v[k].w + 'px';
      (k ? labelsB : labelsA).style.clipPath = 'inset(' + v[k].y + 'px ' + (W - v[k].x - v[k].w) + 'px ' + (H - v[k].y - v[k].h) + 'px ' + v[k].x + 'px)';
    });
    var d = $('splitDiv').style, sb = $('splitSync').style;
    if (SPLIT.stacked) { d.left = '0'; d.width = '100%'; d.top = (v[1].y - 1) + 'px'; d.height = '2px'; sb.left = 'auto'; sb.right = '10px'; sb.top = (v[1].y - 21) + 'px'; }
    else { d.top = '0'; d.height = '100%'; d.left = (v[1].x - 1) + 'px'; d.width = '2px'; sb.right = 'auto'; sb.left = (v[1].x - 21) + 'px'; sb.top = 'auto'; sb.bottom = '96px'; }
  }

  /* ---------- panel „Opis” badania ---------- */
  function renderTrialPanel() {
    var P = curProc(), T = P.trial;
    $('pTitle').textContent = tr(P.title);
    var sub = $('pSub'); sub.textContent = T.full + ' · ';
    if (/^NCT\d+$/.test(T.nct)) {
      var a = document.createElement('a'); a.href = 'https://clinicaltrials.gov/study/' + T.nct; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'ClinicalTrials.gov ' + T.nct;
      sub.appendChild(a);
    } else sub.appendChild(document.createTextNode(tr(T.nct)));
    var ul = $('pNotes'); ul.innerHTML = '';
    [['Kierownik badania (PI)', T.pi], ['Rola autora (P. Spychalski)', T.role], ['Populacja', T.population], ['Randomizacja', T.randomisation],
      ['Ramiona', T.armsLong[0] + ' ' + T.armsLong[1]], ['Pierwszorzędowy punkt końcowy', T.primary], ['Drugorzędowy punkt końcowy', T.secondary],
      ['Obserwacja', T.followUp], ['Finansowanie', A.TRIAL_FUND]].forEach(function (row) {
      if (!row[1]) return;
      var li = document.createElement('li'), b = document.createElement('b');
      b.textContent = tr(row[0]) + ': ';
      li.appendChild(b);
      var body = row[0] === 'Ramiona' ? tr(T.armsLong[0]) + ' ' + tr(T.armsLong[1]) : tr(row[1]);
      li.appendChild(document.createTextNode(body)); ul.appendChild(li);
    });
    var li2 = document.createElement('li'); li2.className = 'trialnote'; li2.textContent = tr(A.TRIAL_NOTE); ul.appendChild(li2);
  }

  /* ---------- pętla renderowania w trybie podzielonym ---------- */
  function splitFrame(dt, now) {
    var fr = FR[S.frame];
    if (fr && fr.kind === 'orbit' && S.playing && S.m < fr.m1) {
      S.m = Math.min(fr.m1, S.m + (fr.m1 - fr.m0) * dt / fr.dur); applyM();
      if (S.m >= fr.m1) updateDock();
    }
    if (tw) camStep(dt);
    else {
      if (controls.autoRotate) { driftT += dt; if (driftT > 14) controls.autoRotate = false; }
      controls.update();
    }
    if (controlsB && !SPLIT.sync) controlsB.update();
    splitViews();
    if (SPLIT.sync) { camB.position.copy(camA.position); camB.quaternion.copy(camA.quaternion); if (controlsB) controlsB.target.copy(controls.target); }
    var MA = SPLIT.MA, MB = SPLIT.MB;
    renderer.setScissorTest(true); renderer.setClearColor(sceneBg, 1);
    [0, 1].forEach(function (k) {
      var own = k ? MB : MA, other = k ? MA : MB, v = SPLIT.views[k], gy = H - v.y - v.h;
      other.group.visible = false; if (other.toolOv) other.toolOv.visible = false; own.group.visible = true;
      withArm(k, function () {
        passOrbit(false);
        renderer.setViewport(v.x, gy, v.w, v.h); renderer.setScissor(v.x, gy, v.w, v.h);
        renderer.clear(); renderer.render(scene, orbitCam);
        if (M.toolOv && M.toolOv.children.some(function (c) { return c.visible; })) { renderer.clearDepth(); renderer.render(toolScene, orbitCam); }
      });
    });
    MA.group.visible = MB.group.visible = true;
    renderer.setScissorTest(false);
    withArm(0, function () { updateLabels(now); });
    withArm(1, function () { updateLabels(now); });
  }

  /* ---------- nowe elementy 3D: krezka z węzłami, EFTR (nasadka FTRD, klips OTSC) ---------- */
  function v3(a) { return new V3().fromArray(a); }
  // krezka z naczyniami i węzłami chłonnymi: część usuwana (z preparatem: przesunięcie i zanikanie) i część pozostająca; podwiązania u odejścia naczyń
  var MESO_COL = { a: '#b83227', v: '#3867b5', m: '#c9564b' };
  function makeMeso(d) {
    var all = new THREE.Group(), mov = new THREE.Group(), stay = new THREE.Group(), ties = new THREE.Group(), fadeG = new THREE.Group(), mobG = new THREE.Group(); all.add(mov, stay, ties, fadeG, mobG);
    var mSheet = track(new THREE.MeshStandardMaterial({ color: '#e8c25e', roughness: 0.7, transparent: true, opacity: 0.45, depthWrite: false, side: THREE.DoubleSide }));
    var mSheetR = mSheet.clone(), mSheetM = mSheet.clone(); track(mSheetR); track(mSheetM);
    var mats = {}, matsR = {}, matsF = {}, matsM = {};
    Object.keys(MESO_COL).forEach(function (k) { mats[k] = track(new THREE.MeshStandardMaterial({ color: MESO_COL[k], roughness: 0.45, transparent: true })); matsR[k] = track(mats[k].clone()); matsF[k] = track(mats[k].clone()); matsM[k] = track(mats[k].clone()); });
    var mNode = track(new THREE.MeshStandardMaterial({ color: '#4f9a6a', roughness: 0.5, transparent: true })), mNodeR = track(mNode.clone());
    d.sheets.forEach(function (sh) {
      var rows = sh.rows, R = 6, pos = [], idx = [];
      rows.forEach(function (row) { var e = v3(row[0]), b = v3(row[1]); for (var j = 0; j <= R; j++) { var f = j / R, p = b.clone().lerp(e, f), sg = Math.sin(Math.PI * f); p.z -= 0.25 * sg; p.y -= 0.5 * sg; pos.push(p.x, p.y, p.z); } });
      for (var i = 0; i < rows.length - 1; i++) for (var j = 0; j < R; j++) { var a0 = i * (R + 1) + j, b0 = a0 + R + 1; idx.push(a0, b0, a0 + 1, b0, b0 + 1, a0 + 1); }
      var g = track(new THREE.BufferGeometry()); g.setIndex(idx); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
      (sh.removed ? mov : sh.mob ? mobG : stay).add(new THREE.Mesh(g, sh.removed ? mSheetR : sh.mob ? mSheetM : mSheet));
    });
    var labels = [];
    d.vessels.forEach(function (v) {
      var c = new THREE.CatmullRomCurve3(v.pts.map(v3), false, 'centripetal'), r = v.kind === 'a' ? (v.id === 'sma' ? 0.16 : 0.085) : v.kind === 'v' ? 0.2 : 0.05;
      (v.removed ? mov : v.fade ? fadeG : v.mob ? mobG : stay).add(new THREE.Mesh(track(new THREE.TubeGeometry(c, v.pts.length * 12, r, 7, false)), (v.removed ? matsR : v.fade ? matsF : v.mob ? matsM : mats)[v.kind]));
      if (v.tie != null) {
        var tp = c.getPointAt(v.tie), tie = new THREE.Mesh(track(new THREE.TorusGeometry(r + 0.1, 0.06, 6, 16)), track(new THREE.MeshStandardMaterial({ color: '#2b3036', roughness: 0.4 })));
        tie.position.copy(tp); tie.quaternion.setFromUnitVectors(new V3(0, 0, 1), c.getTangentAt(v.tie)); ties.add(tie);
      }
      if (v.name) labels.push({ el: mkLabel(v.name, '', MESO_COL[v.kind], 'seg'), p: c.getPointAt(v.at || 0.5), removed: !!v.removed, fade: !!v.fade });
    });
    var sph = track(new THREE.SphereGeometry(0.2, 14, 10));
    d.nodes.forEach(function (n) { var s = new THREE.Mesh(sph, n.removed ? mNodeR : mNode); s.position.fromArray(n.p); (n.removed ? mov : stay).add(s); });
    // dodatkowe podpisy arkuszy (np. mezorektum)
    (d.labels || []).forEach(function (L) { labels.push({ el: mkLabel(L.name, L.sub || '', '#e8c25e', 'seg'), p: v3(L.p), removed: !!L.removed, fade: false }); });
    // podpis krezki przy części usuwanej (znika z preparatem), inaczej przy pozostającej; d.anchor — własny punkt podpisu
    var shR = d.sheets.filter(function (s) { return s.removed; })[0], ref = (shR || d.sheets[0]).rows, mid = ref[Math.round(ref.length / 2)], anchor0 = d.anchor ? v3(d.anchor) : v3(mid[1]).lerp(v3(mid[0]), 0.55);
    var el = mkLabel(d.name, d.sub, '#e8c25e', 'seg');
    var removedMats = [mSheetR, mNodeR].concat(Object.keys(matsR).map(function (k) { return matsR[k]; }));
    return { d: d, grp: all, overlay: false, el: el, labels: labels,
      update: function (m) {
        var on = d.always || S.meso, op = kfNum(d.opacity, m, 1);
        all.visible = on;
        kfVec(d.offset, m, mov.position); mov.visible = op > 0.01;
        removedMats.forEach(function (mm) { mm.opacity = (mm === mSheetR ? 0.45 : 1) * op; });
        Object.keys(matsF).forEach(function (k) { matsF[k].opacity = op; }); fadeG.visible = op > 0.01;
        var opM = kfNum(d.mobOpacity, m, 1); mSheetM.opacity = 0.45 * opM; Object.keys(matsM).forEach(function (k) { matsM[k].opacity = opM; }); mobG.visible = opM > 0.01; // krezka odcinka przemieszczanego
        ties.visible = m >= d.tieT && op > 0.01 && d.vessels.some(function (v) { return v.tie != null; }); // podwiązania znikają razem z SMA/SMV
        this.alpha = on ? (shR ? op : 1) : 0; this.anchor = shR ? anchor0.clone().add(mov.position) : anchor0;
        var self = this; labels.forEach(function (L) { L.anchor = L.removed ? L.p.clone().add(mov.position) : L.p; L.alpha = on ? (L.removed || L.fade ? op : 1) : 0; });
      } };
  }
  function makeEftr(d) {
    var col = M.byId.colon, cc = stateAt(col, 0).curve, n = v3(d.n), P = v3(d.at), tL = A.nearestT(cc, P.clone().addScaledVector(n, d.r));
    var pts = [];
    for (var u = 1; u > tL + 0.03; u -= 0.004) pts.push(cc.getPointAt(u));
    pts.push(P.clone().addScaledVector(n, 0.3), P.clone().addScaledVector(n, d.r - 1.05));
    var curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal'), TS = 500, RS = 8;
    var mScope = metal('#2d3339', 0.5), geo = track(new THREE.TubeGeometry(curve, TS, 0.3, RS, false));
    var scopeM = new THREE.Mesh(geo, mScope);
    var capG = new THREE.Group(), mCap = track(new THREE.MeshStandardMaterial({ color: '#bfe3f2', roughness: 0.2, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false }));
    var cap = new THREE.Mesh(track(new THREE.CylinderGeometry(0.62, 0.62, 0.9, 28, 1, true)), mCap); cap.position.y = 0.45;
    var mClip = metal('#aeb6be', 0.3), clip = new THREE.Mesh(track(new THREE.TorusGeometry(0.58, 0.1, 8, 36)), mClip); clip.rotation.x = Math.PI / 2; clip.position.y = 0.72;
    var mSn = track(new THREE.MeshStandardMaterial({ color: '#ff3b30', emissive: '#7a0d08', transparent: true })), snare = new THREE.Mesh(track(new THREE.TorusGeometry(0.5, 0.04, 6, 36)), mSn);
    snare.rotation.x = Math.PI / 2; snare.position.y = 0.95;
    capG.add(cap, clip, snare);
    var grp = new THREE.Group(); grp.add(scopeM, capG);
    var mats = [mScope, mClip, mSn], tipEnd = curve.getPointAt(1), Y = new V3(0, 1, 0), target = M.byId[d.target];
    var el = mkLabel('Kolonoskop z nasadką FTRD', '', '#bfe3f2', 'seg');
    return { d: d, grp: grp, overlay: true, el: el,
      update: function (m) {
        var tau = (m - d.w[0]) / (d.w[1] - d.w[0]), on = tau > 0 && tau < 1;
        grp.visible = on; this.alpha = on ? 1 : 0;
        if (target && on) {
          var suck = sm((tau - 0.42) / 0.16) * 0.55;
          target.grp.position.copy(n).multiplyScalar(-suck);
        }
        if (!on) return;
        var q, fade = 1;
        if (tau < 0.3) q = sm(tau / 0.3); else if (tau < 0.72) q = 1; else { q = 1 - 0.45 * sm((tau - 0.72) / 0.28); fade = 1 - sm((tau - 0.86) / 0.14); }
        q = Math.max(0.004, q);
        geo.setDrawRange(0, Math.round(q * TS) * RS * 6);
        var tip = curve.getPointAt(q), tg = curve.getTangentAt(q);
        capG.position.copy(tip); capG.quaternion.setFromUnitVectors(Y, tg);
        clip.visible = m < d.clipT; snare.visible = tau > 0.6 && tau < 0.74;
        mClip.emissive.setScalar(tau > 0.56 && tau < 0.6 ? 0.6 : 0);
        if (target && tau > 0.72) target.grp.position.add(tip.clone().sub(tipEnd));
        mats.forEach(function (mm) { mm.opacity = fade; }); mCap.opacity = 0.5 * fade;
        this.alpha = fade; this.anchor = curve.getPointAt(Math.max(0.004, q - 0.08)).add(new V3(0.8, 0.6, 0.6));
      } };
  }
  var TOOL_EXT = { meso: makeMeso, eftr: makeEftr };
