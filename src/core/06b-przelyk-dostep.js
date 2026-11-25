  /* =====================================================================
     PRZEŁYK — dostęp operacyjny w esofagektomii: model tułowia (szyja, klatka piersiowa, nadbrzusze) i zestawy dostępów
     Układ jak w modelu przełyku i powłok brzucha (x+ lewa strona chorego, y+ dogłowowo, z+ do przodu). Skóra: przekroje poprzeczne o połowie
     szerokości a(y), głębokości przodu f(y) i tyłu b(y) od środka c(y), lekko „kanciaste” w klatce piersiowej (r(θ) = 1 + e·sin²2θ);
     w nadbrzuszu przód jak w ANAT.BODY (W, D, pępek, kresa biała, uniesienie przy odmie — lift).
     Punkty na skórze: [θ, y] — θ w stopniach wokół osi ciała: 0 — linia pośrodkowa przednia, −90 — prawa linia pachowa środkowa, +90 — lewa, ±180 — tył;
     fx(x, y) — θ dla punktu przedniej ściany o współrzędnej x. Żebra (II–XII, obustronnie: głowa przy kręgosłupie, kąt żebra, linie pachowe,
     koniec przedni; chrząstki II–VI do mostka, VII–X — łuk żebrowy z ANAT.BODY), mostek, obojczyki, łopatka prawa, mięśnie mostkowo-obojczykowo-sutkowe.
     Zestawy dostępów (ACCESS['eso-…'].torso = TORSO; decyzja autora 2026-11-25): Ivor Lewis i McKeown (oraz Akiyama) — otwarty (laparotomia
     + torakotomia tylno-boczna prawa: Ivor Lewis V, McKeown IV przestrzeń międzyżebrowa), hybrydowy (laparoskopia + torakotomia), małoinwazyjny
     (laparoskopia + torakoskopia; chory na lewym boku), robotyczny (RAMIE, da Vinci Xi; część piersiowa na lewym boku); McKeown i Akiyama — także
     cięcie na szyi po lewej; przezrozworowa — otwarty i laparoskopowy (+ szyja); interpozycja okrężnicy — otwarty (laparotomia + szyja).
     Zestaw: phases — etapy po kolei (part: abd | thx | neck), każdy z cięciami (cuts), trokarami (ports), wejściem przez przestrzeń międzyżebrową
     (ics), planowanym cięciem do wydobycia preparatu (ext) i schematem ułożenia (pose). Ujęcia kamery dla etapów: cams.
     ===================================================================== */
  var TORSO = (function () {
    var B = BODY, D2R = Math.PI / 180;
    function tab(T, y) { if (y >= T[0][0]) return T[0][1]; for (var i = 1; i < T.length; i++) if (y >= T[i][0]) { var a = T[i - 1], b = T[i], u = (y - b[0]) / (a[0] - b[0]); u = u * u * (3 - 2 * u); return b[1] + (a[1] - b[1]) * u; } return T[T.length - 1][1]; }
    var Y0 = -11, Y1 = 30.6;
    // szyja (y > 24,5), barki (ok. 21,5), klatka piersiowa, nadbrzusze (y < 8,5 — jak ANAT.BODY)
    var TA = [[31, 4.7], [27, 4.9], [25.2, 5.3], [24.3, 6.4], [23.4, 9.4], [22.4, 12.6], [21.4, 13.6], [19.5, 13.1], [16, 12.4], [12, 11.6], [9, 11.28]];
    var TF = [[31, 3.7], [25.2, 3.8], [23.8, 4.3], [22.4, 5.1], [20.5, 6.2], [17, 7.1], [13, 7.25], [10.5, 6.5], [8.5, 5.3]];
    var TC = [[31, -1.7], [25.2, -1.7], [23.6, -1.3], [22, -0.8], [19, -0.35], [14, 0.1], [9, 0.3]];
    var TB = [[31, 4.4], [25.2, 4.5], [23.6, 5.4], [22, 6.6], [19, 7.3], [14, 7.3], [9, 6.8], [2, 6.2], [-11, 6.0]];
    var TE = [[31, 0], [25.5, 0], [23.5, 0.05], [21, 0.08], [11, 0.08], [9, 0]];
    function a(y) { return y < 9 ? B.W(y) : tab(TA, y); }
    function f(y) { return y < 8.5 ? B.D(y) : tab(TF, y); }
    function c(y) { return y < 9 ? B.ZC : tab(TC, y); }
    function b(y) { return tab(TB, y); }
    function e(y) { return tab(TE, y); }
    function base(th, y) { var t = th * D2R, s = Math.sin(t), cs = Math.cos(t), r = 1 + e(y) * Math.pow(Math.sin(2 * t), 2); return [a(y) * s * r, c(y) + (cs >= 0 ? f(y) : b(y)) * cs * r, cs]; }
    function z0(th, y, k) {   // z skóry z detalami nadbrzusza (pępek, kresa biała) i odmą
      var p = base(th, y), z = p[1];
      if (p[2] > 0 && y < 9.5) {
        var w = sm01((9.5 - y) / 1.5) * sm01(p[2] / 0.3), x = p[0], W = B.W(y), q = Math.max(0, 1 - (x / W) * (x / W));
        z += w * (B.z(x, y, 0) - (B.ZC + B.D(y) * Math.sqrt(q)));
        if (k) z += k * w * B.lift(x, y);
      }
      return [p[0], z];
    }
    function pt(th, y, k) { var q = z0(th, y, k); return new THREE.Vector3(q[0], y, q[1]); }
    function nrm(th, y, k) {
      var d = 0.25, dy = 0.03, pa = pt(th + d, y, k).sub(pt(th - d, y, k)), pb = pt(th, y + dy, k).sub(pt(th, y - dy, k));
      return new THREE.Vector3().crossVectors(pa, pb).normalize();
    }
    function at(th, y, off, k) { var p = pt(th, y, k); if (off) p.addScaledVector(nrm(th, y, k), -off); return p; }
    // θ dla punktu przedniej ściany o współrzędnej x (bisekcja; |θ| ≤ 90)
    function fx(x, y) { var lo = -90, hi = 90; for (var i = 0; i < 40; i++) { var m = (lo + hi) / 2; if (base(m, y)[0] < x) lo = m; else hi = m; } return (lo + hi) / 2; }
    function F(pts) { return pts.map(function (p) { return [fx(p[0], p[1]), p[1]]; }); }
    // ---------- żebra (strona prawa, θ < 0; lewa — odbicie) ----------
    // H — głowa żebra przy kręgosłupie; dalej kąt żebra, linia pachowa tylna, środkowa, przednia; koniec przedni [x, y]; chrząstka do mostka (y) — II–VI
    var H = [0, 22.6, 21.2, 19.8, 18.4, 17.1, 15.8, 14.4, 12.9, 11.4, 9.9, 8.0, 6.2];
    var ANT = { 2: [5.8, 18.0, 19.7], 3: [7.0, 16.2, 18.2], 4: [7.8, 14.3, 16.7], 5: [8.3, 12.3, 15.1], 6: [8.4, 10.6, 13.3], 7: [5.0, 5.8], 8: [7.2, 3.6], 9: [8.8, 1.6], 10: [10.2, -0.4] };
    var LAT = [[-172, 0], [-150, 0.15], [-120, -0.8], [-90, -2.0], [-65, -3.2]];
    function ribLat(k) {   // część boczna i tylna: [θ, y]
      if (k === 11) return [[-172, H[11]], [-150, H[11] - 0.1], [-120, H[11] - 0.8], [-90, H[11] - 2.4], [-72, H[11] - 3.3]];
      if (k === 12) return [[-172, H[12]], [-150, H[12] - 0.2], [-128, H[12] - 0.9], [-114, H[12] - 1.3]];
      return LAT.map(function (q) { return [q[0], H[k] + q[1]]; });
    }
    function ribPath(k) {   // cała kość żebra [θ, y] (bez chrząstki)
      var p = ribLat(k), A = ANT[k];
      if (A) { if (k === 7) p.push([fx(8.6, 9.4), 9.4]); p.push([fx(A[0], A[1]), A[1]]); }
      return p;
    }
    function cartPath(k) {   // chrząstka żebrowa II–VI: od końca przedniego do brzegu mostka
      var A = ANT[k]; if (!A || A[2] == null) return null;
      return [[fx(A[0], A[1]), A[1]], [fx((A[0] + 1.3) / 2, (A[1] + A[2]) / 2 + 0.15), (A[1] + A[2]) / 2 + 0.15], [fx(1.35, A[2]), A[2]]];
    }
    function interp(p, th) { for (var i = 1; i < p.length; i++) if (th <= Math.max(p[i - 1][0], p[i][0]) && th >= Math.min(p[i - 1][0], p[i][0])) { var u = (th - p[i - 1][0]) / (p[i][0] - p[i - 1][0]); return p[i - 1][1] + (p[i][1] - p[i - 1][1]) * u; } return p[p.length - 1][1]; }
    function ribY(k, th) { return interp(ribLat(k).concat(k <= 10 && ANT[k] ? [[fx(ANT[k][0], ANT[k][1]), ANT[k][1]]] : []), th); }
    // przestrzeń międzyżebrowa k (między żebrem k i k+1) w punkcie θ (strona prawa)
    function ics(k, th) { return [th, (ribY(k, th) + ribY(k + 1, th)) / 2]; }
    function icsLine(k, th0, th1, n) { var out = []; n = n || 10; for (var i = 0; i <= n; i++) out.push(ics(k, th0 + (th1 - th0) * i / n)); return out; }
    function mirror(p) { return p.map(function (q) { return [-q[0], q[1]]; }); }
    // ---------- punkty orientacyjne ----------
    var STERN = { notch: 21.7, angle: 19.7, xs: 10.0, tip: 8.7 };
    function sternW(y) { return y > STERN.angle ? 1.6 + 0.6 * (y - STERN.angle) / (STERN.notch - STERN.angle) : y > STERN.xs ? 1.2 + 0.4 * (y - STERN.xs) / (STERN.angle - STERN.xs) : 0.35 + 0.85 * (y - STERN.tip) / (STERN.xs - STERN.tip); }
    var LM = {
      notch: [0, STERN.notch], xiph: [0, STERN.tip], umb: [0, -5.5],
      clavR: F([[-1.9, 22.05], [-4.6, 22.55], [-8.0, 22.35], [-11.6, 22.7]]),
      costalR: F(B.LM.costalR),
      // łopatka prawa (zarys), kąt dolny na wysokości ok. Th7, grzebień łopatki do wyrostka barkowego
      scapR: [[-158, 21.3], [-160.5, 18.6], [-155, 15.6], [-146, 14.2], [-136, 15.4], [-124, 17.6], [-113, 19.7], [-118, 21.1], [-140, 21.5], [-158, 21.3]],
      scapSpine: [[-160, 20.1], [-140, 20.7], [-120, 21.4], [-106, 21.9]],
      scapTip: [-146, 14.2],
      // mięsień mostkowo-obojczykowo-sutkowy (lewy; prawy — odbicie): brzeg przedni i tylny, od wyrostka sutkowatego do mostka i obojczyka
      scmAnt: [[112, 30.4], [84, 28.6], [56, 26.6], [34, 24.4], [16, 23.0], [8, 22.3]],
      scmPost: [[124, 30.4], [104, 28.6], [78, 26.6], [56, 24.4], [32, 23.0], [19, 22.4]],
      // linie pachowe po prawej stronie (θ)
      axAnt: -62, axMid: -90, axPost: -118
    };
    LM.clavL = mirror(LM.clavR); LM.costalL = mirror(LM.costalR);
    return { Y0: Y0, Y1: Y1, a: a, f: f, c: c, b: b, at: at, nrm: nrm, fx: fx, F: F, ribPath: ribPath, cartPath: cartPath, ribY: ribY, ics: ics, icsLine: icsLine,
      mirror: mirror, STERN: STERN, sternW: sternW, LM: LM, lift: B.lift };
  })();

  (function () {
    var T = TORSO, F = T.F;
    // etapy: kolejność ujęć i czas (oś m slajdu „Dostęp” dzielona równo między etapy)
    var CAMS = {
      all: { t: [-2.5, 9.5, 0.5], tp: [-2.5, 9.5, 0.5], az: -32, el: 10, k: 1.38, kp: 1.9 },
      abd: { t: [-5.0, -0.6, 2.0], tp: [-0.6, 1.0, 2.0], az: -8, el: 14, k: 0.86, kp: 1.25 },
      thx: { t: [-9.0, 12.0, -8.6], tp: [-7.4, 13.6, -2.4], az: -104, el: 8, k: 0.84, kp: 1.2 },
      neck: { t: [-1.2, 23.6, 2.2], tp: [2.6, 24.4, 0.6], az: 42, el: 10, k: 0.54, kp: 0.7 }
    };
    // ---------- jama brzuszna ----------
    var LAP_TXT = 'Pięć trokarów w nadbrzuszu: optyka 12 mm nad pępkiem, nieco w lewo od linii pośrodkowej (technika otwarta, potem odma otrzewnowa), 12 mm w lewym górnym kwadrancie (narzędzie, stapler — formowanie rury żołądkowej), 5 mm w prawym górnym kwadrancie, 5 mm pod wyrostkiem mieczykowatym (retraktor wątroby) i 5 mm w lewym boku (asystent). Mobilizacja żołądka z zachowaniem naczyń żołądkowo-sieciowych prawych, limfadenektomia wokół pnia trzewnego, rozwór przełykowy poszerzony.';
    function lapPh(end) {
      return { part: 'abd', name: 'etap brzuszny', title: 'laparoskopia', text: LAP_TXT + (end ? ' ' + end : ''), first: 0, insuf: true,
        ports: [{ at: [1.4, -2.8], mm: 12, name: '12 mm — optyka (kamera)', sub: 'nad pępkiem, nieco w lewo' },
          { at: [6.2, 1.2], mm: 12, name: '12 mm — narzędzie, stapler', sub: 'lewy górny kwadrant' },
          { at: [-5.6, 2.6], mm: 5, name: '5 mm — narzędzie', sub: 'prawy górny kwadrant' },
          { at: [0, 7.3], mm: 5, name: '5 mm — retraktor wątroby', sub: 'pod wyrostkiem mieczykowatym' },
          { at: [9.4, -2.4], mm: 5, name: '5 mm — asystent', sub: 'lewy bok' }] };
    }
    function openAbd(long) {
      var c = long ? midCut(8.4, -9.4, 'Laparotomia pośrodkowa', 'od wyrostka mieczykowatego do poniżej pępka', 0.9) : midCut(8.4, -4.6, 'Laparotomia pośrodkowa górna', 'od wyrostka mieczykowatego do pępka', 0.9);
      return { part: 'abd', name: 'etap brzuszny', title: long ? 'laparotomia pośrodkowa' : 'laparotomia pośrodkowa górna',
        text: long ? 'Laparotomia pośrodkowa od wyrostka mieczykowatego do poniżej pępka (pępek omijany łukiem): mobilizacja okrężnicy poprzecznej i zagięcia śledzionowego na szypule naczyniowej, dostęp do żołądka i rozworu przełykowego.'
          : 'Laparotomia pośrodkowa górna, od wyrostka mieczykowatego do pępka: mobilizacja żołądka z zachowaniem naczyń żołądkowo-sieciowych prawych, limfadenektomia wokół pnia trzewnego, rozwór przełykowy poszerzony.',
        cuts: [{ pts: F(c.pts), name: c.name, sub: c.sub, w: c.w }] };
    }
    function robAbd() {
      return { part: 'abd', name: 'etap brzuszny', title: 'robot (da Vinci Xi)', robot: true, first: 1, insuf: true,
        text: 'Cztery porty robota w linii poprzecznej nad pępkiem, co 6–8 cm: od prawego boku do lewego górnego kwadrantu, optyka nieco w lewo od linii pośrodkowej, 12 mm pod stapler po lewej; port asystenta 12 mm w lewym dolnym kwadrancie i 5 mm pod wyrostkiem mieczykowatym (retraktor wątroby). Mobilizacja żołądka, limfadenektomia, rura żołądkowa.',
        line: F([[-10.6, -1.6], [10.4, -1.6]]),
        ports: [{ at: [-8.4, -1.6], mm: 8, name: '8 mm — ramię robota', sub: 'prawy bok' },
          { at: [2.4, -1.6], mm: 8, name: '8 mm — optyka (kamera)', sub: 'nad pępkiem, nieco w lewo' },
          { at: [-3.0, -1.6], mm: 8, name: '8 mm — ramię robota', sub: '' },
          { at: [7.8, -1.6], mm: 12, name: '12 mm — ramię robota, stapler', sub: 'lewy górny kwadrant' },
          { at: [5.6, -8.0], mm: 12, name: '12 mm — port asystenta', sub: 'lewy dolny kwadrant', assist: true },
          { at: [0, 7.3], mm: 5, name: '5 mm — retraktor wątroby', sub: 'pod wyrostkiem mieczykowatym', assist: true }] };
    }
    // ---------- klatka piersiowa (strona prawa; chory na lewym boku) ----------
    var POSE_THX = { key: 'eso-thx', lie: 'L', thx: true, title: 'Ułożenie: na lewym boku', sub: 'etap piersiowy — dostęp z prawej strony',
      margin: 'Kąt dolny łopatki', ports: 'Prawa klatka piersiowa', rest: 'Wałek pod lewą pachą', table: 'Zgięcie stołu pod klatką' };
    // torakotomia tylno-boczna prawa: od linii pachowej przedniej, ok. 2 cm poniżej kąta dolnego łopatki, w górę między łopatką a kręgosłupem
    var THOR_CUT = [[-60, 12.7], [-90, 12.1], [-120, 12.2], [-142, 12.7], [-157, 14.4], [-165, 16.8]];
    var ROM = { 4: 'IV', 5: 'V' };
    function thorPh(k) {
      return { part: 'thx', name: 'etap piersiowy', title: 'torakotomia tylno-boczna prawa', pose: POSE_THX,
        text: 'Chory na lewym boku. Cięcie od linii pachowej przedniej, ok. 2 cm poniżej kąta dolnego łopatki, ku górze między łopatką a kręgosłupem; mięsień najszerszy grzbietu przecięty, zębaty przedni odsunięty. Wejście do klatki piersiowej przez ' + ROM[k] + ' przestrzeń międzyżebrową (rozwieracz żeber); wentylacja jednego płuca (lewego).',
        cuts: [{ pts: THOR_CUT, name: 'Torakotomia tylno-boczna prawa', sub: 'poniżej kąta dolnego łopatki', w: 0.7 }],
        ics: { k: k, pts: T.icsLine(k, -150, -64), name: ROM[k] + ' przestrzeń międzyżebrowa', sub: 'wejście do prawej jamy opłucnej' } };
    }
    function P(k, th) { return T.ics(k, th); }
    // punkt linii portów robota (A → B, [θ, y]) leżący w przestrzeni międzyżebrowej k (bisekcja)
    function onLine(k, A, B) { var lo = 0, hi = 1, q = function (s) { return [A[0] + (B[0] - A[0]) * s, A[1] + (B[1] - A[1]) * s]; }, d = function (s) { var p = q(s); return p[1] - T.ics(k, p[0])[1]; };
      for (var i = 0; i < 40; i++) { var m = (lo + hi) / 2; if ((d(lo) > 0) === (d(m) > 0)) lo = m; else hi = m; } return q((lo + hi) / 2); }
    function vatsPh(il) {
      return { part: 'thx', name: 'etap piersiowy', title: 'torakoskopia prawostronna', pose: POSE_THX, first: 0,
        text: 'Chory na lewym boku, wentylacja jednego płuca (lewego). Optyka 10 mm w VIII przestrzeni międzyżebrowej w linii pachowej środkowej, 10 mm w IX przestrzeni za linią pachową tylną (nożyce ultradźwiękowe), 10 mm w IV przestrzeni w linii pachowej przedniej (retraktor płuca), 5 mm tuż za kątem dolnym łopatki i 5 mm w VI przestrzeni w linii pachowej przedniej (ssak). ' +
          (il ? 'Otwór w IV przestrzeni poszerzony do ok. 4 cm: przez niego zespolenie w klatce piersiowej i wydobycie preparatu.' : 'Przełyk wypreparowany do otworu górnego klatki piersiowej; zespolenie później na szyi.'),
        ports: [{ at: P(8, -88), mm: 10, name: '10 mm — optyka (kamera)', sub: 'VIII przestrzeń, linia pachowa środkowa' },
          { at: P(9, -122), mm: 10, name: '10 mm — narzędzie', sub: 'IX przestrzeń, za linią pachową tylną' },
          { at: P(4, -62), mm: 10, name: '10 mm — retraktor płuca', sub: 'IV przestrzeń, linia pachowa przednia' },
          { at: P(7, -152), mm: 5, name: '5 mm — narzędzie', sub: 'tuż za kątem dolnym łopatki' },
          { at: P(6, -68), mm: 5, name: '5 mm — ssak', sub: 'VI przestrzeń, linia pachowa przednia' }],
        ext: il ? { pts: T.icsLine(4, -68, -55, 6), name: 'Poszerzenie otworu w IV przestrzeni', sub: 'zespolenie i wydobycie preparatu' } : null };
    }
    var RL = [T.ics(3, -110), T.ics(10, -126)];   // linia portów robota w klatce piersiowej: III → X przestrzeń, w okolicy linii pachowej tylnej
    function robThx(il) {
      return { part: 'thx', name: 'etap piersiowy', title: 'robot (da Vinci Xi)', pose: POSE_THX, robot: true, first: 1,
        text: 'Chory na lewym boku, wentylacja jednego płuca (lewego), odma w klatce piersiowej (ok. 8 mm Hg). Cztery porty robota w jednej linii w okolicy linii pachowej tylnej: III, VI (optyka), VIII i X przestrzeń międzyżebrowa; port asystenta 12 mm w VII przestrzeni w linii pachowej przedniej. ' +
          (il ? 'Zespolenie w klatce piersiowej; preparat wydobyty przez poszerzone cięcie (ok. 4 cm) w IV przestrzeni.' : 'Przełyk wypreparowany do otworu górnego klatki piersiowej; zespolenie później na szyi.'),
        line: [RL[0], RL[1]],
        ports: [{ at: RL[0], mm: 8, name: '8 mm — ramię robota', sub: 'III przestrzeń międzyżebrowa' },
          { at: onLine(6, RL[0], RL[1]), mm: 8, name: '8 mm — optyka (kamera)', sub: 'VI przestrzeń międzyżebrowa' },
          { at: onLine(8, RL[0], RL[1]), mm: 8, name: '8 mm — ramię robota', sub: 'VIII przestrzeń międzyżebrowa' },
          { at: RL[1], mm: 8, name: '8 mm — ramię robota', sub: 'X przestrzeń międzyżebrowa' },
          { at: P(7, -68), mm: 12, name: '12 mm — port asystenta', sub: 'VII przestrzeń, linia pachowa przednia', assist: true }],
        ext: il ? { pts: T.icsLine(4, -68, -55, 6), name: 'Cięcie w IV przestrzeni (ok. 4 cm)', sub: 'wydobycie preparatu' } : null };
    }
    // ---------- szyja ----------
    var NECK = { part: 'neck', name: 'etap szyjny', title: 'cięcie na szyi po lewej',
      text: 'Cięcie ok. 6 cm wzdłuż przedniego brzegu lewego mięśnia mostkowo-obojczykowo-sutkowego, od wcięcia szyjnego mostka ku górze. Mięsień i naczynia szyjne odsunięte bocznie, tchawica przyśrodkowo; nerw krtaniowy wsteczny w bruździe tchawiczo-przełykowej oszczędzony. Przez to cięcie podciągnięta rura (przeszczep) i zespolenie szyjne.',
      cuts: [{ pts: [[11, 22.9], [19, 23.8], [29, 24.8], [40, 25.9]], name: 'Cięcie na szyi po lewej', sub: 'wzdłuż przedniego brzegu mięśnia mostkowo-obojczykowo-sutkowego', w: 0.6 }] };
    function set(title, short, phases) { return { title: title, short: short, phases: phases }; }
    var ILE = 'Zespolenie w klatce piersiowej, powyżej żyły nieparzystej.';
    function base3(o) { return Object.assign({ torso: T, cams: CAMS, cam: CAMS.all, dur: 0, prompt: 'Wybierz dostęp: otwarty, hybrydowy, małoinwazyjny albo robotyczny.', labels: { lap: 'Małoinwazyjny (MIE)', hyb: 'Hybrydowy' } }, o); }
    function durOf(X) { var n = 1; ['open', 'hyb', 'lap', 'rob'].forEach(function (k) { if (X[k]) n = Math.max(n, X[k].phases.length); }); X.dur = 4 + 8 * n; return X; }
    // Ivor Lewis (także zespolenie bok-do-boku): najpierw jama brzuszna, potem prawa klatka piersiowa
    ACCESS['eso-il'] = durOf(base3({
      open: set('Dostęp otwarty', 'laparotomia i torakotomia prawostronna (V przestrzeń)', [openAbd(), thorPh(5)]),
      hyb: set('Dostęp hybrydowy', 'laparoskopia i torakotomia prawostronna', [lapPh(), thorPh(5)]),
      lap: set('Dostęp małoinwazyjny (MIE)', 'laparoskopia i torakoskopia prawostronna', [lapPh(), vatsPh(true)]),
      rob: set('Dostęp robotyczny (RAMIE)', 'da Vinci Xi: jama brzuszna i klatka piersiowa', [robAbd(), robThx(true)])
    }));
    // McKeown (z trzech dostępów) i Akiyama: najpierw prawa klatka piersiowa (chory na lewym boku), potem jama brzuszna i szyja (na plecach)
    function mck(name) {
      return durOf(base3({
        open: set('Dostęp otwarty', 'torakotomia prawostronna (IV przestrzeń), laparotomia, szyja', [thorPh(4), openAbd(), NECK]),
        hyb: set('Dostęp hybrydowy', 'torakotomia prawostronna, laparoskopia, szyja', [thorPh(4), lapPh(), NECK]),
        lap: set('Dostęp małoinwazyjny (MIE)', 'torakoskopia prawostronna, laparoskopia, szyja', [vatsPh(false), lapPh(), NECK]),
        rob: set('Dostęp robotyczny (RAMIE)', 'da Vinci Xi: klatka piersiowa i jama brzuszna; szyja', [robThx(false), robAbd(), NECK]),
        note: name }));
    }
    ACCESS['eso-mck'] = mck('McKeown'); ACCESS['eso-aki'] = mck('Akiyama');
    // przezrozworowa (bez torakotomii): jama brzuszna i szyja; laparoskopowo — także preparowanie przełyku przez rozwór
    ACCESS['eso-the'] = durOf(base3({ prompt: 'Wybierz dostęp: otwarty albo laparoskopowy.', labels: { lap: 'Laparoskopowy' },
      open: set('Dostęp otwarty (bez torakotomii)', 'laparotomia górna i cięcie na szyi', [Object.assign(openAbd(), { text: 'Laparotomia pośrodkowa górna, od wyrostka mieczykowatego do pępka: mobilizacja żołądka, rozwór przełykowy poszerzony; przełyk wypreparowany na tępo przez rozwór, ręką wprowadzoną do tylnego śródpiersia.' }), NECK]),
      lap: set('Dostęp laparoskopowy (bez torakotomii)', 'laparoskopia i cięcie na szyi', [lapPh('Przełyk wypreparowany przez poszerzony rozwór pod kontrolą kamery, możliwie wysoko w tylnym śródpiersiu; dalej od strony szyi.'), NECK])
    }));
    // interpozycja okrężnicy: tylko dostęp otwarty — dłuższa laparotomia i szyja
    ACCESS['eso-col'] = durOf(base3({ prompt: 'Jeden dostęp — kliknij „Otwarty”, aby zobaczyć cięcia.', labels: {},
      open: set('Dostęp otwarty', 'laparotomia pośrodkowa i cięcie na szyi', [openAbd(true), NECK])
    }));
    ACCESS['eso-il-ss'] = ACCESS['eso-il']; ACCESS['eso-mck-ss'] = ACCESS['eso-mck'];
    ACCESS.esoph = ACCESS['eso-il'];
  })();
