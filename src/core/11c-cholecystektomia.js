/* =====================================================================
   CHOLECYSTEKTOMIA LAPAROSKOPOWA — własny model okolicy wnęki wątroby (układ i bryła jak ANAT.LIVER z 10-watroba.js, ale dłuższa powierzchnia
   trzewna płata prawego, dół pęcherzyka i rowek Rouvière’a), pęcherzyk w rzeczywistych proporcjach (ok. 7 × 2,6 cm, dno, trzon, kieszonka Hartmanna,
   szyjka), drogi żółciowe, tętnice i żyła wrotna w więzadle wątrobowo-dwunastniczym, dwunastnica. Narzędzie TOOL_EXT.chole (12-cholecystektomia.js).
   Widok laparoskopowy z optyki w pępku (układ amerykański): dno uniesione ponad wątrobę (płat prawy odchyla się ku górze), kieszonka Hartmanna
   odciągnięta w bok i w dół — trójkąt wątrobowo-pęcherzykowy otwiera się. Oś czasu m: 0 anatomia, 0–0,3 ekspozycja (odciągnięcie), 0,3–1 nacięcie
   otrzewnej, usunięcie tkanki tłuszczowej i włóknistej trójkąta, oddzielenie dolnej 1/3 pęcherzyka od łoża (CVS w m = 1), 1–2 klipsy i przecięcie
   przewodu i tętnicy, 2–2,8 wycięcie pęcherzyka z łoża od szyjki do dna, 2,8–3 usunięcie w worku, 3 stan po.
   Źródła: Strasberg, Hertl, Soper, J Am Coll Surg 1995 (krytyczny widok bezpieczeństwa); Brunt i wsp., Ann Surg 2020 (wytyczne SAGES/AHPBA/IHPBA/SSAT/EAES,
   MI 2020: CVS oceniany z przodu i z tyłu, rowek Rouvière’a); Strasberg i wsp., J Am Coll Surg 2016 (cholecystektomia częściowa).
   ===================================================================== */
(function (root) {
  'use strict';
  var A = root.ANAT, LV = A.LIVER, V3 = THREE.Vector3;
  function c01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function sm(x) { x = c01(x); return x * x * (3 - 2 * x); }
  function cv(pts) { return new THREE.CatmullRomCurve3(pts.map(function (p) { return new V3().fromArray(p); }), false, 'centripetal'); }
  // profil promienia: [[t, r], ...] z gładkim przejściem między węzłami
  function prof(T, t) { if (t <= T[0][0]) return T[0][1]; for (var i = 1; i < T.length; i++) if (t <= T[i][0]) { var a = T[i - 1], b = T[i], u = sm((t - a[0]) / (b[0] - a[0])); return a[1] + (b[1] - a[1]) * u; } return T[T.length - 1][1]; }

  /* ---------- wątroba: bryła jak w 10-watroba.js (te same elipsoidy), powierzchnia trzewna płata prawego niżej i dłuższa (E_INF, płaszczyzna VN/VP),
     dół pęcherzyka wg osi pęcherzyka poniżej, płytki rowek Rouvière’a na powierzchni trzewnej płata prawego, bocznie od szyjki pęcherzyka ---------- */
  function ell(x, y, z, c, r) { var a = (x - c[0]) / r[0], b = (y - c[1]) / r[1], d = (z - c[2]) / r[2]; return (Math.sqrt(a * a + b * b + d * d) - 1) * Math.min(r[0], r[1], r[2]); }
  function smin(a, b, k) { var h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; }
  function smax(a, b, k) { return -smin(-a, -b, k); }
  var E_RL = [[-4.6, 0.2, -0.3], [6.6, 6.4, 6.0]], E_DOME = [[-0.5, 2.0, -0.6], [5.5, 4.6, 5.3]], E_Q = [[0.5, -1.0, 1.5], [4.5, 3.2, 3.8]],
    E_LL = [[4.4, 1.6, 0.4], [5.8, 2.8, 4.4]], E_LT = [[8.6, 2.2, 0.4], [2.8, 1.4, 2.8]], E_INF = [[-3.6, -3.6, 1.6], [4.2, 4.0, 3.2]];
  var VN = (function (v) { var n = Math.hypot(v[0], v[1], v[2]); return [v[0] / n, v[1] / n, v[2] / n]; })([0.22, -0.92, -0.32]), VP = [-2, -4.9, 0.6];
  // pęcherzyk: oś od dna (t = 0) do szyjki (t = 1); dno wystaje poza dolny brzeg wątroby, trzon w dole pęcherzyka, kieszonka Hartmanna zwisa ku dołowi
  var GB = [[-3.6, -7.0, 4.9], [-3.3, -6.85, 3.4], [-2.9, -6.35, 2.0], [-2.5, -5.85, 0.6], [-2.2, -5.4, -0.3]];
  var GB_R = [[0, 1.25], [0.12, 1.33], [0.32, 1.35], [0.56, 1.27], [0.7, 1.1], [0.8, 1.02], [0.9, 0.72], [0.96, 0.42], [1, 0.3]];
  function gbR(t) { return prof(GB_R, t); }
  var cGB = cv(GB), GBS = []; for (var gi = 0; gi <= 48; gi++) GBS.push({ p: cGB.getPointAt(gi / 48), r: gbR(gi / 48) });
  function gbDist(x, y, z) {
    if (x < -6 || x > 0.5 || y < -9.5 || y > -3.5 || z < -2.5 || z > 7.5) return 9;
    var best = 9;
    for (var i = 0; i < GBS.length; i++) { var q = GBS[i], dx = x - q.p.x, dy = y - q.p.y, dz = z - q.p.z, d = Math.sqrt(dx * dx + dy * dy + dz * dz) - q.r; if (d < best) best = d; }
    return best;
  }
  var ROUV = [[-3.4, -4.82, -0.65], [-4.6, -4.99, -1.0], [-6.0, -5.15, -1.4]];
  function segDist(p, a, b) { var abx = b[0] - a[0], aby = b[1] - a[1], abz = b[2] - a[2], t = c01(((p[0] - a[0]) * abx + (p[1] - a[1]) * aby + (p[2] - a[2]) * abz) / (abx * abx + aby * aby + abz * abz)); return Math.hypot(p[0] - a[0] - abx * t, p[1] - a[1] - aby * t, p[2] - a[2] - abz * t); }
  function liverSDF(x, y, z) {
    var d = smin(ell(x, y, z, E_RL[0], E_RL[1]), ell(x, y, z, E_DOME[0], E_DOME[1]), 2.0);
    d = smin(d, ell(x, y, z, E_Q[0], E_Q[1]), 1.6); d = smin(d, ell(x, y, z, E_LL[0], E_LL[1]), 2.0); d = smin(d, ell(x, y, z, E_LT[0], E_LT[1]), 1.5);
    d = smin(d, ell(x, y, z, E_INF[0], E_INF[1]), 1.6);
    d = smax(d, (x - VP[0]) * VN[0] + (y - VP[1]) * VN[1] + (z - VP[2]) * VN[2], 1.2);
    var I = LV.IVC, dx = x - I[0], dz = z - I[1]; d = smax(d, -(Math.sqrt(dx * dx + dz * dz) - I[2] - 0.12), 0.35);
    if (x < -2.8 && x > -6.6 && y < -4 && y > -6 && z < 0 && z > -2) { var p = [x, y, z], rd = Math.min(segDist(p, ROUV[0], ROUV[1]), segDist(p, ROUV[1], ROUV[2])); d = smax(d, -(rd - 0.3), 0.12); }
    d = smax(d, -(gbDist(x, y, z) - 0.06), 0.25);
    return d;
  }

  /* ---------- więzadło wątrobowo-dwunastnicze: drogi żółciowe z przodu po prawej, tętnica wątrobowa z przodu po lewej, żyła wrotna z tyłu ---------- */
  var CYJ = [-1.5, -8.25, 0.12];                                    // ujście przewodu pęcherzykowego (boczna ściana przewodu wątrobowego wspólnego)
  var BD = [[-0.8, -14.2, -0.9], [-1.0, -12.0, -0.5], [-1.25, -10.2, -0.15], [-1.4, -8.3, 0.1], [-1.32, -6.6, 0.2], [-1.18, -4.9, 0.18], [-0.9, -2.75, 0.15]];
  var tCYJ = A.nearestT(cv(BD), CYJ);
  var VES = {
    bd: [{ id: 'bd', pts: BD, r: 0.33 }, { id: 'rhd', pts: [[-0.9, -2.75, 0.15], [-2.2, -2.6, -0.1], [-3.2, -2.4, -0.2]], r: 0.23, intra: true },
      { id: 'lhd', pts: [[-0.9, -2.75, 0.15], [0.6, -2.9, 0.5], [1.9, -2.5, 0.9]], r: 0.23, intra: true }],
    pv: [{ id: 'pv', pts: [[3.0, -12.2, -0.9], [1.7, -9.2, -1.0], [0.5, -6.4, -1.0], [-0.4, -4.2, -1.0], [-0.6, -3.0, -1.0]], r: 0.62 },
      { id: 'rpv', pts: [[-0.6, -3.0, -1.0], [-2.0, -2.9, -1.1], [-3.2, -2.7, -1.0]], r: 0.5, intra: true },
      { id: 'lpv', pts: [[-0.6, -3.0, -1.0], [0.6, -3.2, -0.7], [1.8, -3.0, -0.2]], r: 0.45, intra: true }],
    ha: [{ id: 'cha', pts: [[5.6, -9.8, -0.6], [3.9, -9.2, 1.0], [2.5, -8.4, 1.3]], r: 0.26 },
      { id: 'gda', pts: [[2.5, -8.4, 1.3], [2.2, -10.0, 0.4], [1.9, -12.0, 0.0]], r: 0.16 },   // za dwunastnicą
      { id: 'pha', pts: [[2.5, -8.4, 1.3], [1.4, -7.0, 0.9], [0.4, -5.7, 0.5]], r: 0.2 },
      { id: 'rha', pts: [[0.4, -5.7, 0.5], [-0.6, -5.3, -0.4], [-1.9, -4.95, -0.75], [-3.0, -4.4, -0.95]], r: 0.16 },
      { id: 'lha', pts: [[0.4, -5.7, 0.5], [1.3, -4.9, 0.6], [2.2, -4.0, 0.7]], r: 0.15 }]
  };
  var CA0 = cv(VES.ha[3].pts).getPointAt(A.nearestT(cv(VES.ha[3].pts), [-1.9, -4.95, -0.75])).toArray();   // odejście tętnicy pęcherzykowej od tętnicy wątrobowej prawej (na prawo od przewodu)
  var DUO = [[3.2, -10.6, 1.6], [1.2, -11.6, 1.5], [-1.0, -12.2, 1.2], [-2.8, -12.6, 0.7], [-3.4, -13.8, 0.3], [-3.4, -15.4, 0.0]];

  /* ---------- odciągnięcie (ret 0–1): płat prawy wątroby odchyla się ku górze wokół osi poprzecznej (zawias przy wnęce; waga rośnie ku dołowi wątroby),
     dno pęcherzyka uniesione ponad brzeg wątroby (PUSH), kieszonka Hartmanna w bok i w dół (PULL); oddzielenie od łoża — wzdłuż normalnej łoża ---------- */
  var RET = { hinge: [-3.6, -0.6], phi: -26 * Math.PI / 180, PULL: [-2.2, -2.0, 0.5], PUSH: [-0.2, 1.6, 0.9], LIFT: 0.85, SWING: [-1.9, -0.2, 0.7] };   // SWING — pęcherzyk odchylany w bok przy wycinaniu z łoża
  function rotYZ(p, a, out) { var dy = p[1] - RET.hinge[0], dz = p[2] - RET.hinge[1], c = Math.cos(a), s = Math.sin(a); out[0] = p[0]; out[1] = RET.hinge[0] + dy * c - dz * s; out[2] = RET.hinge[1] + dy * s + dz * c; return out; }
  function liverW(y) { return sm((-1.2 - y) / 2.6); }
  function retLiver(p, r, out) { return rotYZ(p, RET.phi * r * liverW(p[1]), out || [0, 0, 0]); }
  var NB = rotYZ([VN[0], VN[1] + RET.hinge[0], VN[2] + RET.hinge[1]], RET.phi, [0, 0, 0]); NB = [NB[0], NB[1] - RET.hinge[0], NB[2] - RET.hinge[1]];   // normalna łoża po odchyleniu (od wątroby)
  // oś czasu zabiegu
  function stage(m) {
    var sepA = sm((m - 0.55) / 0.4), sepB = c01((m - 2.0) / 0.75);
    return { ret: sm((m - 0.02) / 0.26), per: c01((m - 0.3) / 0.15), fat: c01((m - 0.38) / 0.5), thr: m < 2 ? 1 - 0.4 * sepA : 0.6 * (1 - sepB),
      sep: m < 2 ? sepA : 1, bed: sepB, out: sm((m - 2.78) / 0.2), cutD: m >= 1.7, cutA: m >= 1.85 };
  }
  // przemieszczenie punktu pęcherzyka (położenie spoczynkowe p, parametr osi t) w stanie st; lift — oddzielenie od łoża dla t powyżej frontu thr
  function gbMove(p, t, st, out) {
    out = retLiver(p, st.ret, out);
    var wN = sm((t - 0.5) / 0.45) * st.ret, wF = sm((0.45 - t) / 0.45) * st.ret, sep = sm((t - st.thr) / 0.08) * (st.thr < 0.999 ? 1 : 0), L = RET.LIFT * sep * (1 + 0.8 * (st.bed || 0)), W = sep * (st.bed || 0);
    for (var k = 0; k < 3; k++) out[k] += RET.PULL[k] * wN + RET.PUSH[k] * wF + NB[k] * L + RET.SWING[k] * W;
    return out;
  }

  A.CHOLE = {
    sdf: liverSDF, GB: GB, gbR: gbR, ROUV: ROUV, CYJ: CYJ, VES: VES, CA0: CA0, DUO: DUO, tCYJ: tCYJ, RET: RET, NB: NB,
    retLiver: retLiver, gbMove: gbMove, stage: stage,
    CLIPS: { duct: { keep: [0.82, 0.68], spec: [0.3], cut: 0.5, at: [1.08, 1.18, 1.28] }, art: { keep: [0.18, 0.32], spec: [0.8], cut: 0.56, at: [1.38, 1.48, 1.56] } },
    tArt: 0.74, tNode: 0.84,
    grid: { o: [-12.6, -9.6, -7.8], n: [24.6, 17.8, 15.4] }
  };

  var NOTES = [
    'Najczęstsze wskazanie: objawowa kamica pęcherzyka żółciowego i jej powikłania (ostre zapalenie pęcherzyka, zapalenie trzustki pochodzenia żółciowego, kamica przewodowa po oczyszczeniu dróg żółciowych).',
    'Trójkąt wątrobowo-pęcherzykowy (Calota): ograniczony przewodem pęcherzykowym, przewodem wątrobowym wspólnym i dolną powierzchnią wątroby; zawiera tętnicę pęcherzykową i węzeł chłonny pęcherzykowy (Mascagniego). Otwiera się dopiero przy odciągnięciu: dno pęcherzyka ku górze ponad wątrobę, kieszonka Hartmanna w bok i w dół.',
    'Krytyczny widok bezpieczeństwa (CVS, Strasberg 1995) przed założeniem klipsów: 1) trójkąt oczyszczony z tkanki tłuszczowej i włóknistej, 2) dolna część pęcherzyka (ok. 1/3) oddzielona od łoża — widoczna płytka pęcherzykowa, 3) do pęcherzyka wchodzą dwie i tylko dwie struktury: przewód i tętnica pęcherzykowa. CVS ocenia się z przodu i z tyłu (po odwróceniu kieszonki Hartmanna) i dokumentuje zdjęciem lub nagraniem.',
    'Rowek Rouvière’a na dolnej powierzchni płata prawego wyznacza poziom bezpiecznego preparowania: powyżej linii łączącej rowek z podstawą segmentu IV (R4U) i przy pęcherzyku — nie w głąb ku więzadłu wątrobowo-dwunastniczemu.',
    'Gdy CVS nie da się bezpiecznie uzyskać (ciężki stan zapalny, zatarte struktury): cholecystektomia częściowa (subtotalna), zaczynanie od dna pęcherzyka, cholangiografia śródoperacyjna, konwersja albo drenaż (cholecystostomia) — zamiast dalszego preparowania w trójkącie.',
    'Najgroźniejsze powikłanie: uszkodzenie dróg żółciowych — najczęściej pomylenie przewodu żółciowego wspólnego z pęcherzykowym. Klipsy tylko na strukturach jednoznacznie rozpoznanych.',
    'Schemat: proporcje uproszczone; odmiany przebiegu tętnicy pęcherzykowej (np. podwójna, od tętnicy wątrobowej właściwej lub lewej, przed przewodem wątrobowym wspólnym) i przewodu pęcherzykowego (krótki, uchodzący nisko lub do przewodu prawego) są częste.'
  ];
  // ujęcia: zewnętrzne (anatomia) i laparoskopowe — z optyki w pępku, ku górze pod wątrobę
  var CAM_EXT = { t: [-1.6, -7.4, 0.6], az: 30, el: 2, k: 0.9, kp: 1.25 },
    CAM_LAP = { t: [-2.6, -6.2, 1.4], tp: [-2.9, -5.2, 1.8], az: 16, el: -50, k: 0.62, kp: 0.86 },
    CAM_CVS = { t: [-2.6, -6.8, 0.8], tp: [-2.8, -6.0, 1.2], az: 16, el: -50, k: 0.46, kp: 0.68 },
    CAM_BED = { t: [-3.0, -5.8, 2.0], tp: [-3.2, -5.0, 2.4], az: 14, el: -48, k: 0.62, kp: 0.86 };
  var CH = { cat: 'hpb', id: 'chole', short: 'Cholecystektomia', title: 'Cholecystektomia laparoskopowa',
    sub: 'Odciągnięcie pęcherzyka, trójkąt wątrobowo-pęcherzykowy (Calota), krytyczny widok bezpieczeństwa (CVS), klipsy na przewodzie i tętnicy pęcherzykowej, wycięcie pęcherzyka z łoża',
    notes: NOTES, objects: [], marks: [], cutTools: [{ type: 'chole' }], anastTools: [], commonCuts: 0, mEnd: 3, single: true, box: [[-6, -13, -3], [3, 0, 5]],
    singleFrames: [
      { k: 'normal', kind: 'orbit', m0: 0, m1: 0, cam: 'custom', camP: CAM_EXT, short: 'Anatomia', title: 'Anatomia: pęcherzyk i drogi żółciowe',
        cap: 'Widok z przodu i od dołu, wątroba przezroczysta. Pęcherzyk leży w dole na dolnej powierzchni wątroby, dno wystaje poza jej brzeg. Przewód pęcherzykowy uchodzi do przewodu wątrobowego wspólnego, który dalej jest przewodem żółciowym wspólnym (za dwunastnicą); tętnica pęcherzykowa odchodzi od tętnicy wątrobowej prawej.' },
      { k: 'expo', lap: true, kind: 'orbit', m0: 0, m1: 0.3, dur: 4.5, cam: 'custom', camP: CAM_LAP, short: 'Ekspozycja', title: 'Odciągnięcie pęcherzyka — widok z optyki',
        cap: 'Widok laparoskopowy z optyki w pępku. Chwytak z bocznego trokaru unosi dno pęcherzyka ponad wątrobę (płat prawy odchyla się ku górze); drugi chwytak odciąga kieszonkę Hartmanna w bok i w dół. Przewód pęcherzykowy ustawia się prostopadle do przewodu wątrobowego wspólnego — trójkąt wątrobowo-pęcherzykowy się otwiera.' },
      { k: 'dis', lap: true, kind: 'orbit', m0: 0.3, m1: 1, dur: 7, cam: 'custom', camP: CAM_LAP, short: 'Trójkąt Calota', title: 'Preparowanie trójkąta wątrobowo-pęcherzykowego',
        cap: 'Otrzewna nacięta wzdłuż pęcherzyka z przodu i z tyłu; tkanka tłuszczowa i włóknista trójkąta usuwana tępo i koagulacją, przy pęcherzyku, powyżej rowka Rouvière’a. Dolna 1/3 pęcherzyka oddzielona od łoża — odsłania się płytka pęcherzykowa.',
        caps: [[0.3, 'Otrzewna nacięta wzdłuż pęcherzyka z przodu i z tyłu; tkanka tłuszczowa i włóknista trójkąta usuwana tępo i koagulacją, przy pęcherzyku, powyżej rowka Rouvière’a.'],
          [0.6, 'Dolna 1/3 pęcherzyka oddzielana od łoża — odsłania się płytka pęcherzykowa, a przez oczyszczony trójkąt widać wątrobę.']] },
      { k: 'cvs', lap: true, kind: 'orbit', m0: 1, m1: 1, cam: 'custom', camP: CAM_CVS, short: 'CVS', title: 'Krytyczny widok bezpieczeństwa (CVS)',
        cap: 'Trzy warunki: 1) trójkąt oczyszczony — przez „okno” widać wątrobę; 2) dolna 1/3 pęcherzyka oddzielona od łoża (widoczna płytka pęcherzykowa); 3) do pęcherzyka wchodzą dwie i tylko dwie struktury — przewód i tętnica pęcherzykowa. Ocena z przodu i z tyłu; dopiero wtedy klipsy.' },
      { k: 'clip', lap: true, kind: 'orbit', m0: 1, m1: 2, dur: 7, cam: 'custom', camP: CAM_CVS, short: 'Klipsy', title: 'Klipsy i przecięcie',
        cap: 'Na przewodzie i tętnicy pęcherzykowej po dwa klipsy od strony chorego i jeden od strony pęcherzyka.',
        caps: [[1, 'Na przewodzie i tętnicy pęcherzykowej po dwa klipsy od strony chorego i jeden od strony pęcherzyka.'], [1.66, 'Przewód i tętnica przecięte nożyczkami między klipsami; na kikutach zostają po dwa klipsy.']] },
      { k: 'remove', lap: true, kind: 'orbit', m0: 2, m1: 3, dur: 6, cam: 'custom', camP: CAM_BED, short: 'Wycięcie z łoża', title: 'Wycięcie pęcherzyka z łoża',
        cap: 'Pęcherzyk oddzielany od łoża wątroby w warstwie między ścianą pęcherzyka a płytką pęcherzykową (haczyk koagulacyjny), od szyjki do dna; potem w worku usunięty przez port w pępku.',
        caps: [[2, 'Pęcherzyk oddzielany od łoża wątroby w warstwie między ścianą pęcherzyka a płytką pęcherzykową (haczyk koagulacyjny), od szyjki do dna.'], [2.78, 'Pęcherzyk w worku usunięty przez port w pępku.']] },
      { k: 'post', lap: true, kind: 'orbit', m0: 3, m1: 3, cam: 'custom', camP: CAM_BED, short: 'Po operacji', title: 'Stan po cholecystektomii',
        cap: 'Łoże pęcherzyka (płytka pęcherzykowa) na dolnej powierzchni wątroby — kontrola hemostazy i żółci; kikut przewodu pęcherzykowego i kikut tętnicy pęcherzykowej z klipsami; przewód wątrobowy wspólny i żółciowy wspólny nienaruszone.' }
    ] };
  /* ---------- dostęp (slajd „Dostęp”): powłoki ANAT.BODY przeniesione do układu wątroby jak w adrenalektomii (skala 1,45); decyzja autora (2026-11-25):
     laparoskopia w układzie amerykańskim (4 trokary, operator po lewej stronie chorego) i konwersja — cięcie podżebrowe prawe (Kochera, jak w HJ) ---------- */
  var XF = { s: 1.45, d: [0, -10.115, -0.8] };
  function bodyPt(p) { return [p[0] / XF.s, (p[1] - XF.d[1]) / XF.s, (p[2] - XF.d[2]) / XF.s]; }
  var KOCH = A.ACCESS.hj.open;
  A.ACCESS.chole = { target: bodyPt([-1.6, -4.3, 0.8]), cam: { t: [-9.3, -12.4, 0.4], tp: [0, -12.7, 0.4], az: 0, el: 12, k: 2.8, kp: 3.9 }, xf: XF,
    lap: { title: 'Dostęp laparoskopowy (układ amerykański)', short: '4 trokary, operator po lewej stronie chorego', side: 0,
      text: 'Chory na plecach, w pozycji anty-Trendelenburga z przechyleniem na lewy bok; operator po lewej stronie chorego. Optyka 10–12 mm w pępku (technika otwarta, potem odma), 10–12 mm pod wyrostkiem mieczykowatym, na prawo od więzadła obłego (główny trokar roboczy: preparowanie, klipsy), 5 mm w prawym podżebrzu w linii środkowo-obojczykowej (chwytak kieszonki Hartmanna) i 5 mm w prawej linii pachowej przedniej (chwytak dna — uniesienie pęcherzyka ponad wątrobę). Pęcherzyk w worku wydobyty przez port w pępku.',
      first: 0, insuf: [-0.76, -0.62],
      ports: [{ at: [0, -5.95], mm: 12, name: '10–12 mm — optyka (kamera)', sub: 'w pępku, wydobycie pęcherzyka' },
        { at: [-0.9, 6.3], mm: 12, name: '10–12 mm — narzędzie główne', sub: 'pod wyrostkiem mieczykowatym, na prawo od więzadła obłego' },
        { at: [-6.6, 2.0], mm: 5, name: '5 mm — chwytak kieszonki Hartmanna', sub: 'prawe podżebrze, linia środkowo-obojczykowa' },
        { at: [-8.9, -1.4], mm: 5, name: '5 mm — chwytak dna pęcherzyka', sub: 'prawa linia pachowa przednia' }] },
    open: Object.assign({}, KOCH, { short: 'konwersja — cięcie Kochera',
      text: 'Konwersja do operacji otwartej (np. gdy nie da się bezpiecznie uzyskać krytycznego widoku bezpieczeństwa, przy krwawieniu albo podejrzeniu uszkodzenia dróg żółciowych) albo planowa cholecystektomia otwarta: cięcie podżebrowe prawe (Kochera), ok. 2–3 cm poniżej prawego łuku żebrowego i równolegle do niego, od linii pośrodkowej do linii pachowej przedniej, z przecięciem prawego mięśnia prostego. Pęcherzyk usuwany zwykle od dna ku szyjce.' }) };
  CH.access = 'chole';
  var PROC = { cat: 'hpb', id: 'chole', short: CH.short, title: CH.title, variants: [CH] };
  var at = A.PROCS.length; A.PROCS.forEach(function (p, i) { if (p.cat === 'hpb' && i < at) at = i; });
  A.PROCS.splice(at, 0, PROC);
})(typeof window !== 'undefined' ? window : globalThis);
