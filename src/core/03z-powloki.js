  /* =====================================================================
     POWŁOKI BRZUCHA — wspólny model przedniej ściany tułowia w układzie jelita grubego (x+ lewa strona chorego, y+ dogłowowo, z+ do przodu)
     Skóra jako powierzchnia z(x, y): połowa szerokości W(y) i głębokość D(y) od osi ciała (zc), zagłębienie pępka i bruzda kresy białej;
     głębokość w śródbrzuszu jak w konturze TK jelita grubego (zc 0,3, B 6,0). Punkty orientacyjne: wyrostek mieczykowaty, łuki żebrowe, pępek,
     kolce biodrowe przednie górne, grzebienie biodrowe, więzadła pachwinowe, spojenie łonowe. Pod skórą mięśnie proste brzucha (kresa biała,
     smugi ścięgniste) i naczynia nabrzuszne dolne (od pachwiny skośnie do pochewki mięśnia prostego, w jego bocznej części) i górne.
     lift — uniesienie powłok przy odmie otrzewnowej (0–1). ACCESS — dostęp operacyjny dla zabiegu: cięcia i trokary (współrzędne x, y na skórze).
     ===================================================================== */
  var BODY = (function () {
    var ZC = 0.3;
    function tab(T, y) { if (y >= T[0][0]) return T[0][1]; for (var i = 1; i < T.length; i++) if (y >= T[i][0]) { var a = T[i - 1], b = T[i], u = (y - b[0]) / (a[0] - b[0]); u = u * u * (3 - 2 * u); return b[1] + (a[1] - b[1]) * u; } return T[T.length - 1][1]; }
    var WT = [[13, 11.6], [8, 11.2], [2, 10.6], [-4, 10.9], [-9, 11.9], [-13, 11.7], [-18, 10.4]];   // połowa szerokości (do linii pachowej środkowej)
    var DT = [[13, 5.7], [9.5, 5.4], [7.5, 5.2], [4, 5.6], [-2, 6.05], [-6, 6.2], [-10, 5.85], [-13, 5.2], [-15.5, 4.6], [-18, 3.9]]; // głębokość od osi
    var Y0 = -17.6, Y1 = 12.5;
    function W(y) { return tab(WT, y); }
    function D(y) { return tab(DT, y); }
    function lift(x, y) { var q = (x / 9.5) * (x / 9.5) + ((y + 3.5) / 11) * ((y + 3.5) / 11); return q >= 1 ? 0 : 1.5 * (1 - q) * (1 - q); }
    function z(x, y, k) {
      var w = W(y), q = Math.max(0, 1 - (x / w) * (x / w)), r2 = x * x + (y + 5.5) * (y + 5.5);
      var zz = ZC + D(y) * Math.sqrt(q) - 0.42 * Math.exp(-r2 / 0.2) + 0.12 * Math.exp(-r2 / 0.9) * (1 - Math.exp(-r2 / 0.2)) * 2;  // pępek: zagłębienie z wałem
      if (y > -15 && y < 8) zz -= 0.07 * Math.exp(-x * x / 0.35);  // kresa biała
      return zz + (k ? k * lift(x, y) : 0);
    }
    // punkt na skórze (off — w głąb, wzdłuż normalnej) i normalna zewnętrzna
    function nrm(x, y, k) { var e = 0.02, dx = (z(x + e, y, k) - z(x - e, y, k)) / (2 * e), dy = (z(x, y + e, k) - z(x, y - e, k)) / (2 * e); var n = new THREE.Vector3(-dx, -dy, 1); return n.normalize(); }
    function at(x, y, off, k) { var p = new THREE.Vector3(x, y, z(x, y, k)); if (off) p.addScaledVector(nrm(x, y, k), -off); return p; }
    // punkty orientacyjne (x, y na skórze)
    var LM = {
      xiph: [0, 8.7], umb: [0, -5.5], pubis: [0, -15.4], asisL: [8.7, -10.4], asisR: [-8.7, -10.4],
      costalL: [[0.6, 8.5], [2.2, 7.6], [4.0, 6.1], [6.0, 4.4], [8.0, 2.4], [9.7, 0.3], [10.6, -1.2]],
      crestL: [[8.7, -10.4], [9.8, -9.2], [10.8, -8.2], [11.5, -7.6]],
      ingL: [[8.7, -10.4], [6.6, -12.3], [4.4, -14.0], [2.2, -15.5], [1.2, -15.7]]
    };
    function mir(a) { return a.map(function (p) { return [-p[0], p[1]]; }); }
    LM.costalR = mir(LM.costalL); LM.crestR = mir(LM.crestL); LM.ingR = mir(LM.ingL);
    // mięsień prosty brzucha: od spojenia (wąski) do łuku żebrowego (szerszy); brzeg przyśrodkowy przy kresie białej
    var RY0 = -15.2, RY1 = 7.0;
    function rectLat(y) { return 3.0 + (y - RY0) / (RY1 - RY0) * 3.4; }   // brzeg boczny (kresa półksiężycowata): ok. 5 cm od pośrodkowej przy spojeniu, ok. 10 cm przy łuku żebrowym
    var RECT_MED = 0.55, TEND = [4.6, 1.6, -1.9];   // smugi ścięgniste (nad pępkiem)
    // naczynia nabrzuszne: dolne — od tętnicy biodrowej zewnętrznej (punkt środkowy pachwiny) do pochewki mięśnia prostego (kresa łukowata) i w górę
    // w jego bocznej części; górne — od łuku żebrowego w dół; [x, y, głębokość pod skórą]
    var EPI_INF = [[5.6, -14.0, 1.6], [5.0, -11.6, 1.2], [4.6, -9.0, 0.95], [4.4, -5.5, 0.85], [4.35, -1.5, 0.85], [4.3, 1.4, 0.85]];
    var EPI_SUP = [[4.2, 6.6, 0.85], [4.25, 4.0, 0.85], [4.3, 1.4, 0.85]];
    var MCL = 6.9;   // linia środkowo-obojczykowa (x); na łuku żebrowym ok. y 3,5
    /* ---------- WARSTWY — jeden model ściany dla wszystkich widoków (slajd „Dostęp”, przekrój w herniologii, pachwina, przeszczepienie nerki).
       Głębokość pod skórą wzdłuż normalnej (at); x — odległość od linii pośrodkowej (znak bez znaczenia), stan prawidłowy (bez przepukliny).
       fat — grubość tkanki podskórnej (domyślnie T.fat; przepuklina pooperacyjna — grubsza, pachwina — T.fatGroin). Grubości schematyczne
       (1 j. ≈ 1,45 cm). Przyśrodkowo od kresy półksiężycowatej rozcięgno mięśnia skośnego zewnętrznego tworzy pochewkę przednią; nad kresą łukowatą
       (ARC) — pochewka tylna; w nadbrzuszu brzusiec mięśnia poprzecznego sięga za mięsień prosty (taMed). ---------- */
    function sm(v) { v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); }
    var T = { skin: 0.12, fat: 1.05, fatGroin: 0.88, scarpa: 0.035, ant: 0.06, rect: 0.62, post: 0.05, ta: 0.2, eo: 0.22, io: 0.24, tf: 0.045, pre: 0.16, per: 0.035 };
    var ARC = -8.8;   // kresa łukowata
    function taMed(y) { return 2.0 * sm((y + 6) / 8); }
    function eoApo(y) { return rectLat(y) + 1.4 + 0.12 * (y + 5); }   // m. skośny zewnętrzny: przyśrodkowo od tej linii rozcięgno, bocznie brzusiec
    // grubości względem dna tkanki podskórnej (DF)
    var WL = {
      eoTh: function (x, y) { return 0.06 + 0.16 * sm((x - rectLat(y) - 0.2) / 1.0); },
      rect: function (x, y) { var s0 = rectLat(y), q = Math.max(0.22, sm((x - RECT_MED) / 0.7) * sm((s0 - x) / 0.7)); return [0.37 - 0.31 * q, 0.37 + 0.31 * q]; },
      io: function (x, y) { var u = sm((x - rectLat(y)) / 0.8); return [0.06 + 0.16 * u, 0.66 - 0.18 * u]; },
      taTop: function (x, y) { return 0.48 + 0.27 * (1 - sm((x - (rectLat(y) - 0.3)) / 1.0)); },
      // powięź poprzeczna — nie płycej niż tylna powierzchnia mięśnia poprzecznego (przy kresie półksiężycowatej, zwłaszcza pod kresą łukowatą)
      tfD: function (x, y) { var s0 = rectLat(y), md = y > ARC ? (taMed(y) > 0.3 ? 0.95 : 0.78) : 0.7, d = md + (0.73 - md) * sm((x - s0 + 0.6) / 1.2);
        return x >= s0 - taMed(y) ? Math.max(d, WL.taTop(x, y) + 0.21 + 0.04 * sm(x - s0)) : d; },
      alba: [0.04, 0.7], post: [0.7, 0.75]
    };
    function DFo(fat) { return T.skin + (fat == null ? T.fat : fat); }
    // [głębokość przednia, tylna] warstwy w punkcie (x, y) albo null, gdy jej tam nie ma
    function layer(id, x, y, fat) {
      x = Math.abs(x); var D0 = DFo(fat), s0 = rectLat(y), r, b;
      switch (id) {
        case 'skin': return [0, T.skin];
        case 'fat': return [T.skin, D0];
        case 'scarpa': b = T.skin + 0.55 * (D0 - T.skin); return [b, b + T.scarpa];   // warstwa błoniasta tkanki podskórnej (najwyraźniejsza w podbrzuszu)
        case 'eo': return [D0, D0 + WL.eoTh(x, y)];
        case 'alba': return x < RECT_MED ? [D0 + WL.alba[0], D0 + WL.alba[1]] : null;
        case 'rect': if (x < RECT_MED || x > s0) return null; r = WL.rect(x, y); return [D0 + r[0], D0 + r[1]];
        case 'io': if (x <= s0) return null; r = WL.io(x, y); return [D0 + r[0], D0 + r[1]];
        case 'post': return y > ARC && x < s0 + 0.12 ? [D0 + WL.post[0], D0 + WL.post[1]] : null;
        case 'ta': if (x < s0 - taMed(y)) return null; b = D0 + WL.taTop(x, y); return [b, b + 0.2 + 0.04 * sm(x - s0)];
        case 'tf': b = D0 + WL.tfD(x, y); return [b, b + T.tf];
        case 'pre': b = D0 + WL.tfD(x, y) + T.tf; return [b, b + T.pre];
        case 'per': b = D0 + WL.tfD(x, y) + T.tf + T.pre; return [b, b + T.per];
      }
      return null;
    }
    // kotwica głębokości: liczba albo [warstwa, ułamek grubości, dodatkowo w głąb]; brak warstwy w punkcie — powięź poprzeczna
    function depth(a, x, y, fat) {
      if (typeof a === 'number') return a;
      var L = layer(a[0], x, y, fat) || layer('tf', x, y, fat), f = a[1] == null ? 0.5 : a[1];
      return L[0] + (L[1] - L[0]) * f + (a[2] || 0);
    }
    // opis warstw (kolejność od skóry); lod 0 — pokazywane także na slajdzie „Dostęp”, 1 — tylko w widokach herniologicznych
    var LAYERS = [['skin', 'Skóra', 0], ['fat', 'Tkanka podskórna', 1], ['scarpa', 'Powięź Scarpy', 1], ['eo', 'Mięsień skośny zewnętrzny', 1], ['alba', 'Kresa biała', 1],
      ['rect', 'Mięsień prosty brzucha', 0], ['io', 'Mięsień skośny wewnętrzny', 1], ['post', 'Pochewka tylna', 1], ['ta', 'Mięsień poprzeczny brzucha', 1],
      ['tf', 'Powięź poprzeczna', 1], ['pre', 'Tłuszcz przedotrzewnowy', 1], ['per', 'Otrzewna ścienna', 1]].map(function (q) { return { id: q[0], name: q[1], lod: q[2] }; });
    // wspólne kolory (przekrój, pachwina, slajd „Dostęp”); siatka — kolor niewystępujący w tkankach
    var COL = { skin: '#e2b59c', fat: '#f1d58a', scarpa: '#f7ecd0', apo: '#ece4d4', rect: '#b6473f', eo: '#c75d4f', io: '#ae4d45', ta: '#9a4540', tf: '#d6cdbd', pre: '#efd27c',
      per: '#8fb6d3', perLap: '#e8cdc4', art: '#c8342b', vein: '#3a64b6', nerve: '#ecc01f', mesh: '#1d5bff', meshCore: '#6fa8ff', meshEdge: '#0a2c80', suture: '#22305c', lm: '#7d6152' };
    /* naczynia i nerwy powłok (strona lewa, x > 0; prawa — odbicie): punkty [x, y, kotwica głębokości]. Nabrzuszne dolne: od tętnicy biodrowej zewnętrznej
       za powięzią poprzeczną, przy kresie łukowatej wchodzą do pochewki i biegną na tylnej powierzchni mięśnia prostego, w jego bocznej części;
       górne — z tętnicy piersiowej wewnętrznej, za mięśniem prostym; okalające biodra głębokie — za powięzią poprzeczną, wzdłuż więzadła pachwinowego
       ku kolcowi biodrowemu; nabrzuszne powierzchowne i okalające biodra powierzchowne — w tkance podskórnej (od naczyń udowych). Perforatory
       okołopępkowe — z naczyń nabrzusznych dolnych przez mięsień prosty i pochewkę przednią do skóry (przecinane przy płatach skórno-tłuszczowych). */
    var BH = ['post', 0, -0.03], PRE = ['pre', 0.5];   // BH — na tylnej powierzchni mięśnia prostego, przed pochewką tylną
    var VESSELS = [
      // dolne: początek na tętnicy biodrowej zewnętrznej tuż nad więzadłem pachwinowym, przyśrodkowo od pierścienia głębokiego (ten sam przebieg w pachwinie — GROIN.IEV)
      { id: 'epiInf', name: 'Naczynia nabrzuszne dolne', lod: 0, r: 0.075, pts: [[4.77, -13.58, PRE], [4.48, -12.5, PRE], [4.27, -11.07, PRE], [4.18, -9.02, ['tf', 0, -0.05]], [4.23, -7.01, BH], [4.3, -5.04, BH], [4.35, -1.5, BH], [4.3, 1.4, BH]] },
      { id: 'epiSup', name: 'Naczynia nabrzuszne górne', lod: 0, r: 0.055, pts: [[4.2, 6.6, BH], [4.25, 4.0, BH], [4.3, 1.4, BH]] },
      { id: 'dcia', name: 'Naczynia okalające biodra głębokie', lod: 1, r: 0.05, pts: [[5.7, -14.3, PRE], [6.9, -13.0, ['tf', 0, -0.04]], [8.1, -11.4, ['tf', 0, -0.04]], [9.2, -10.0, ['tf', 0, -0.04]]] },
      { id: 'sEpi', name: 'Naczynia nabrzuszne powierzchowne', lod: 1, r: 0.04, pts: [[3.3, -16.2, ['fat', 0.75]], [3.0, -14.0, ['fat', 0.7]], [2.6, -11.0, ['fat', 0.62]], [2.0, -8.0, ['fat', 0.55]], [1.4, -6.4, ['fat', 0.5]]] },
      { id: 'sCirc', name: 'Naczynia okalające biodra powierzchowne', lod: 1, r: 0.035, pts: [[3.6, -16.0, ['fat', 0.75]], [5.4, -14.6, ['fat', 0.7]], [7.2, -12.8, ['fat', 0.62]], [8.6, -11.4, ['fat', 0.55]]] }
    ];
    var PERF = [[2.55, -1.9], [2.9, -3.7], [2.4, -7.2]];   // perforatory okołopępkowe (x, y) — przez mięsień prosty do skóry
    // nerwy międzyżebrowe i podżebrowy: poziom y przy brzegu bocznym mięśnia prostego; biegną między m. skośnym wewnętrznym a poprzecznym, wnikają do pochewki
    var NV = [[5.4, 'T7'], [2.6, 'T8'], [-1.4, 'T9'], [-5.5, 'T10'], [-8.4, 'T11'], [-11.0, 'T12']];
    return { ZC: ZC, W: W, D: D, z: z, at: at, nrm: nrm, lift: lift, Y0: Y0, Y1: Y1, LM: LM, rectLat: rectLat, RECT_MED: RECT_MED, RY: [RY0, RY1], TEND: TEND, EPI_INF: EPI_INF, EPI_SUP: EPI_SUP, MCL: MCL,
      T: T, ARC: ARC, taMed: taMed, eoApo: eoApo, WL: WL, DF: DFo, layer: layer, depth: depth, LAYERS: LAYERS, COL: COL, VESSELS: VESSELS, PERF: PERF, NV: NV };
  })();

  /* ---------- Dostęp operacyjny (slajd „Dostęp” przed anatomią prawidłową) dla zabiegów jelitowych. Oś czasu kadru m: −1 → −0,02 (poza nią model powłok niewidoczny).
     Klucz ACCESS[k]: target — pole operacyjne (oś trokarów), cam — ujęcie kadru, xf — przeniesienie powłok do układu modelu (jelito cienkie: inny układ),
     open / lap / rob — zestawy (brak klucza = dostęp nieoferowany, np. robot w ileostomii). Zestaw: cuts — cięcia [x, y] na skórze z czasem rysowania (t)
     i otwierania rany (open), disc — trepanacja (okrągłe wycięcie skóry); ports — trokary: at [x, y], mm, rola; first — trokar wprowadzony techniką otwartą
     przed odmą; insuf — odma unosi powłoki; ext — planowane cięcie do wydobycia preparatu (linia przerywana); stoma — miejsce stomii oznaczone przed operacją;
     line — linia portów robota; side — mięsień prosty, przez który się wchodzi (+1 lewy, −1 prawy, 0 — linia pośrodkowa / oba); short — podpis w oknie wyboru.
     Zasady (praktyka autora): laparoskopia — zabiegi prawostronne: 2 × 12 mm przez lewy mięsień prosty (optyka w połowie wysokości między kolcem biodrowym
     przednim górnym a łukiem żebrowym, drugi wyżej), 5 mm w linii cięcia Pfannenstiela i 5 mm pod wyrostkiem mieczykowatym; lewostronne — odbicie lustrzane;
     wydobycie zawsze przez cięcie Pfannenstiela (APR — przez krocze). Otwarty — krótkie cięcia pośrodkowe, hemikolektomia prawa — cięcie poprzeczne.
     Robot da Vinci Xi (wytyczne producenta): prawostronna kolektomia — linia od lewej linii środkowo-obojczykowej na łuku żebrowym do spojenia łonowego;
     esica, odbytnica — linia od rzutu prawej głowy kości udowej (boczny brzeg trójkąta pachwinowego) do lewej linii
     środkowo-obojczykowej na łuku żebrowym, kamera na przecięciu z linią pośrodkową, porty co 7–8 cm, asystent bocznie od prawej linii
     środkowo-obojczykowej; zagięcie śledzionowe i hemikolektomia lewa — układ lustrzany do prawostronnej (robR); kolektomia całkowita — linia poprzeczna poniżej pępka. ---------- */
  var PFANN = [[-2.4, -13.35], [-1.2, -13.72], [0, -13.85], [1.2, -13.72], [2.4, -13.35]];
  var COLO_SITE = [3.0, -7.6], ILEO_SITE = [-2.8, -6.9];   // jak COLO_S i ileostomia (XS, YS) w 04-jelito-grube.js
  var CAM0 = { t: [-10.5, -4.6, 0.8], tp: [0, -4.6, 0.8], az: 0, el: 12, k: 1.14 };   // ciało przesunięte w prawo ekranu — po lewej podpis kadru; tp — ekran pionowy (wyśrodkowane)
  function midCut(y0, y1, name, sub, w) {   // cięcie pośrodkowe; przy pępku łukiem po lewej stronie chorego
    var pts = [[0, y0]];
    if (y0 > -5.5 && y1 < -5.5) {
      if (y0 > -4.2) pts.push([0, -4.2]);
      pts.push([0.46, -4.75], [0.66, -5.5], [0.46, -6.25]);
      if (y1 < -6.8) pts.push([0, -6.8]);
    } else pts.push([0, (y0 + y1) / 2]);
    pts.push([0, y1]);
    return { pts: pts, name: name, sub: sub, t: [-0.86, -0.46], open: [-0.42, -0.12], w: w || 0.85 };
  }
  function openSet(o) { return Object.assign({ title: 'Dostęp otwarty: laparotomia pośrodkowa', side: 0, ports: [] }, o); }
  var STOMA_C = { at: COLO_SITE, r: 0.9, name: 'Miejsce kolostomii', sub: 'oznaczone przed operacją, przez lewy mięsień prosty' };
  var STOMA_I = { at: ILEO_SITE, r: 0.8, name: 'Miejsce ileostomii', sub: 'oznaczone przed operacją, przez prawy mięsień prosty' };
  var EXT_P = { pts: PFANN, name: 'Cięcie Pfannenstiela', sub: 'wydobycie preparatu' };
  // laparoskopia: sd +1 — trokary przez lewy mięsień prosty (zabiegi prawostronne), −1 — przez prawy (lewostronne, odbicie lustrzane)
  function lapPorts(sd) {
    var mm = sd > 0 ? 'przez lewy mięsień prosty' : 'przez prawy mięsień prosty';
    return [{ at: [sd * 3.6, -3.6], mm: 12, name: '12 mm — optyka (kamera)', sub: mm },
      { at: [sd * 3.9, 2.4], mm: 12, name: '12 mm — narzędzie, stapler', sub: mm + ', wyżej' },
      { at: [sd * 0.9, -13.75], mm: 5, name: '5 mm — narzędzie', sub: 'w linii cięcia Pfannenstiela' },
      { at: [0, 6.9], mm: 5, name: '5 mm — pomocniczy', sub: 'pod wyrostkiem mieczykowatym' }];
  }
  var LAP_L_TXT = 'Dwa trokary 12 mm przez prawy mięsień prosty: optyka w połowie wysokości między kolcem biodrowym przednim górnym a łukiem żebrowym (wprowadzona techniką otwartą, potem odma otrzewnowa), drugi nieco wyżej; dwa trokary 5 mm — w linii cięcia Pfannenstiela i pod wyrostkiem mieczykowatym (układ lustrzany do hemikolektomii prawej). ';
  function lapL(end, o) { return Object.assign({ title: 'Dostęp laparoskopowy', short: '4 trokary, wydobycie przez cięcie Pfannenstiela', side: -1, text: LAP_L_TXT + end, first: 0, insuf: [-0.76, -0.62], ports: lapPorts(-1), ext: EXT_P }, o || {}); }
  // robot da Vinci Xi — esica i odbytnica (także Hartmann, APR): linia od rzutu prawej głowy kości udowej do lewej linii
  // środkowo-obojczykowej na łuku żebrowym; kamera na przecięciu z linią pośrodkową (tuż poniżej pępka), porty co ok. 7,5 cm; 12 mm pod stapler w prawym
  // dolnym kwadrancie; asystent 12 mm bocznie od prawej linii środkowo-obojczykowej, na wysokości między kamerą a kolejnym portem
  var ROB_L_TXT = 'Cztery porty robota w jednej linii od rzutu prawej głowy kości udowej (boczny brzeg trójkąta pachwinowego) do lewej linii środkowo-obojczykowej na wysokości łuku żebrowego, co 7–8 cm: kamera na przecięciu linii z linią pośrodkową, port 12 mm pod stapler w prawym dolnym kwadrancie, dwa porty 8 mm ku lewemu górnemu kwadrantowi; port asystenta 12 mm bocznie od prawej linii środkowo-obojczykowej. ';
  function robL(end, o) {
    return Object.assign({ title: 'Dostęp robotyczny (da Vinci Xi)', short: 'da Vinci Xi, porty w jednej linii', side: 0, text: ROB_L_TXT + end,
      first: 1, insuf: [-0.76, -0.62], robot: true, line: [[-5.6, -13.6], [6.9, 3.5]],
      ports: [{ at: [-3.06, -10.13], mm: 12, name: '12 mm — ramię robota, stapler', sub: 'prawy dolny kwadrant' },
        { at: [-0.35, -6.42], mm: 8, name: '8 mm — optyka (kamera)', sub: 'na przecięciu z linią pośrodkową' },
        { at: [2.36, -2.71], mm: 8, name: '8 mm — ramię robota', sub: '' },
        { at: [5.08, 1.0], mm: 8, name: '8 mm — ramię robota', sub: 'lewy górny kwadrant' },
        { at: [-8.3, -4.4], mm: 12, name: '12 mm — port asystenta', sub: 'bocznie od prawej linii środkowo-obojczykowej', assist: true }],
      ext: EXT_P }, o || {});
  }
  var ACCESS = {
    rh: {
      target: [-4.6, -3.2, 0.6], cam: { t: [-3.2, -4.4, 0.8], az: 0, el: 12, k: 1.08 },
      open: {
        title: 'Dostęp otwarty: cięcie poprzeczne', short: 'cięcie poprzeczne prawostronne', side: -1,
        text: 'Cięcie poprzeczne w prawej połowie brzucha, ok. 2–3 cm nad pępkiem, od linii pośrodkowej do prawej linii pachowej przedniej, z przecięciem prawego mięśnia prostego. Dobry dostęp do prawej połowy okrężnicy i zagięcia wątrobowego; jelito wyprowadzone przez ranę, zespolenie (FEEA) poza jamą brzuszną.',
        cuts: [{ pts: [[0.7, -3.55], [-1.6, -3.7], [-4.0, -3.72], [-6.4, -3.55], [-8.6, -3.15]], name: 'Cięcie poprzeczne prawostronne', sub: 'nad pępkiem, przez prawy mięsień prosty', t: [-0.86, -0.46], open: [-0.42, -0.12], w: 0.85 }],
        ports: []
      },
      lap: {
        title: 'Dostęp laparoskopowy', short: '4 trokary, wydobycie przez cięcie Pfannenstiela', side: 1,
        text: 'Dwa trokary 12 mm przez lewy mięsień prosty: optyka w połowie wysokości między kolcem biodrowym przednim górnym a łukiem żebrowym (wprowadzona techniką otwartą, potem odma otrzewnowa), drugi nieco wyżej; dwa trokary 5 mm — w linii cięcia Pfannenstiela i pod wyrostkiem mieczykowatym. Zespolenie wewnątrzbrzuszne (izoperystaltyczne), preparat wydobyty przez cięcie Pfannenstiela.',
        first: 0, insuf: [-0.76, -0.62], ports: lapPorts(1),
        ext: { pts: PFANN, name: 'Cięcie Pfannenstiela', sub: 'wydobycie preparatu po zespoleniu wewnątrzbrzusznym' }
      },
      rob: {
        title: 'Dostęp robotyczny (da Vinci Xi)', short: 'da Vinci Xi, porty w jednej linii', side: 1,
        text: 'Cztery porty robota w jednej linii od lewej linii środkowo-obojczykowej na wysokości łuku żebrowego do spojenia łonowego, co 6–10 cm: 12 mm pod stapler najwyżej, optyka w jednym ze środkowych portów, najniższy w linii cięcia Pfannenstiela; port asystenta 12 mm w lewym boku, między dolnymi portami. Zespolenie wewnątrzbrzuszne, preparat wydobyty przez cięcie Pfannenstiela.',
        first: 1, insuf: [-0.76, -0.62], robot: true, line: [[6.9, 3.5], [0, -15.4]],
        ports: [{ at: [6.21, 1.61], mm: 12, name: '12 mm — ramię robota, stapler', sub: 'pod lewym łukiem żebrowym, linia środkowo-obojczykowa' },
          { at: [4.35, -3.69], mm: 8, name: '8 mm — optyka (kamera)', sub: 'port środkowy' },
          { at: [2.48, -8.98], mm: 8, name: '8 mm — ramię robota', sub: '' },
          { at: [0.6, -13.75], mm: 8, name: '8 mm — ramię robota', sub: 'w linii cięcia Pfannenstiela' },
          { at: [8.4, -8.6], mm: 12, name: '12 mm — port asystenta', sub: 'lewy bok, między dolnymi portami', assist: true }],
        ext: { pts: PFANN, name: 'Cięcie Pfannenstiela', sub: 'wydobycie preparatu po zespoleniu wewnątrzbrzusznym' }
      }
    }
  };
  // hemikolektomia prawa poszerzona (do zagięcia śledzionowego, zespolenie izoperystaltyczne wewnątrzbrzuszne): otwarta — laparotomia pośrodkowa; laparoskopia i robot jak w rh
  ACCESS['rh-ext'] = Object.assign({}, ACCESS.rh, {
    open: openSet({ short: 'laparotomia pośrodkowa', text: 'Laparotomia pośrodkowa (pępek omijany łukiem) — dostęp do prawej połowy okrężnicy, poprzecznicy i zagięcia śledzionowego; zespolenie krętniczo-okrężnicze izoperystaltyczne przy zagięciu śledzionowym.',
      cuts: [midCut(4.2, -9.6, 'Laparotomia pośrodkowa', 'nad i pod pępkiem')] }) });
  // robot — układ lustrzany do prawostronnej kolektomii (linia od prawej linii środkowo-obojczykowej na łuku żebrowym do spojenia łonowego): zagięcie śledzionowe
  // i hemikolektomia lewa (okrężnica zstępująca: skośna linia portów od prawego podżebrza ku linii pośrodkowej w podbrzuszu pozwala mobilizować zarówno zagięcie
  // śledzionowe, jak i połączenie zstępniczo-esicze — Kumamoto i wsp., Asian J Endosc Surg 2026); esica i odbytnica — linia Intuitive ku prawej głowie kości udowej (robL)
  function robR(goal, end) {
    return { title: 'Dostęp robotyczny (da Vinci Xi)', short: 'da Vinci Xi, porty w jednej linii', side: -1,
      text: 'Cztery porty robota w jednej linii od prawej linii środkowo-obojczykowej na wysokości łuku żebrowego do spojenia łonowego, co 6–10 cm (układ lustrzany do prawostronnej kolektomii, cel — ' + goal + '): 12 mm pod stapler najwyżej, optyka w jednym ze środkowych portów, najniższy w linii cięcia Pfannenstiela; port asystenta 12 mm w prawym boku. ' + end,
      first: 1, insuf: [-0.76, -0.62], robot: true, line: [[-6.9, 3.5], [0, -15.4]],
      ports: [{ at: [-6.21, 1.61], mm: 12, name: '12 mm — ramię robota, stapler', sub: 'pod prawym łukiem żebrowym, linia środkowo-obojczykowa' },
        { at: [-4.35, -3.69], mm: 8, name: '8 mm — optyka (kamera)', sub: 'port środkowy' },
        { at: [-2.48, -8.98], mm: 8, name: '8 mm — ramię robota', sub: '' },
        { at: [-0.6, -13.75], mm: 8, name: '8 mm — ramię robota', sub: 'w linii cięcia Pfannenstiela' },
        { at: [-8.4, -8.6], mm: 12, name: '12 mm — port asystenta', sub: 'prawy bok, między dolnymi portami', assist: true }],
      ext: EXT_P };
  }
  ACCESS.sf = { target: [5.4, 2.6, 1.2], cam: CAM0,
    open: openSet({ short: 'laparotomia pośrodkowa górna', text: 'Laparotomia pośrodkowa górna, od wyrostka mieczykowatego do pępka. Dostęp do zagięcia śledzionowego i lewej części poprzecznicy; zespolenie koniec-do-końca.', cuts: [midCut(6.9, -4.4, 'Laparotomia pośrodkowa górna', 'od wyrostka mieczykowatego do pępka')] }),
    lap: lapL('Preparat wydobyty przez cięcie Pfannenstiela.'),
    rob: robR('zagięcie śledzionowe', 'Preparat wydobyty przez cięcie Pfannenstiela.') };
  ACCESS.lh = { target: [3, -3, 0.8], cam: CAM0,
    open: openSet({ short: 'laparotomia pośrodkowa', text: 'Laparotomia pośrodkowa nad- i podpępkowa (pępek omijany łukiem). Dostęp do lewej połowy okrężnicy, zagięcia śledzionowego i początku tętnicy krezkowej dolnej.', cuts: [midCut(1.8, -11.0, 'Laparotomia pośrodkowa', 'nad- i podpępkowa')] }),
    lap: lapL('Preparat wydobyty przez cięcie Pfannenstiela.'),
    rob: robR('okrężnica zstępująca z zagięciem śledzionowym i połączeniem zstępniczo-esiczym', 'Preparat wydobyty przez cięcie Pfannenstiela.') };
  var EEA_END = 'Preparat wydobyty przez cięcie Pfannenstiela, przez nie kowadełko staplera okrężnego wprowadza się do kikuta proksymalnego; zespolenie (EEA) staplerem wprowadzonym przez odbyt.';
  ACCESS.sig = { target: [3, -9.5, 0], cam: CAM0,
    open: openSet({ short: 'laparotomia pośrodkowa dolna', text: 'Laparotomia pośrodkowa dolna, od pępka do spojenia łonowego. Dostęp do esicy i górnej odbytnicy; zespolenie staplerem okrężnym przez odbyt.', cuts: [midCut(-4.4, -13.6, 'Laparotomia pośrodkowa dolna', 'od pępka do spojenia')] }),
    lap: lapL(EEA_END), rob: robL(EEA_END) };
  ACCESS.ar = { target: [1, -14, -0.5], cam: CAM0,
    open: openSet({ short: 'laparotomia pośrodkowa dolna', text: 'Laparotomia pośrodkowa dolna, od okolicy nadpępkowej do spojenia łonowego (pępek omijany łukiem). Dostęp do miednicy (TME / PME) i, w razie potrzeby, do zagięcia śledzionowego; zespolenie staplerem okrężnym przez odbyt.', cuts: [midCut(-2.4, -14.4, 'Laparotomia pośrodkowa dolna', 'od okolicy nadpępkowej do spojenia')] }),
    lap: lapL(EEA_END), rob: robL(EEA_END) };
  var APR_END = 'Preparat usuwany przez krocze (etap kroczowy); kolostomia końcowa w miejscu oznaczonym przed operacją.';
  ACCESS.apr = { target: [1, -14, -0.5], cam: CAM0,
    open: openSet({ short: 'laparotomia pośrodkowa dolna i krocze', text: 'Laparotomia pośrodkowa dolna (pępek omijany łukiem) i, w drugim etapie, cięcie kroczowe wokół odbytu. ' + APR_END, cuts: [midCut(-2.4, -14.4, 'Laparotomia pośrodkowa dolna', 'od okolicy nadpępkowej do spojenia')], stoma: STOMA_C }),
    // APR: bez cięcia Pfannenstiela (preparat przez krocze) — trokar 5 mm nadłonowo w linii pośrodkowej
    lap: lapL(APR_END, { short: '4 trokary, preparat przez krocze', ext: null, stoma: STOMA_C, text: LAP_L_TXT.replace('w linii cięcia Pfannenstiela', 'nadłonowo w linii pośrodkowej') + APR_END,
      ports: lapPorts(-1).map(function (p) { return p.sub === 'w linii cięcia Pfannenstiela' ? Object.assign({}, p, { sub: 'nadłonowo, w linii pośrodkowej' }) : p; }) }),
    rob: robL(APR_END, { short: 'da Vinci Xi, preparat przez krocze', ext: null, stoma: STOMA_C }) };
  var HART_END = 'Preparat wydobyty przez cięcie Pfannenstiela; kolostomia końcowa w miejscu oznaczonym przed operacją.';
  ACCESS.hartmann = { target: [3, -11, 0], cam: CAM0,
    open: openSet({ short: 'laparotomia pośrodkowa dolna', text: 'Laparotomia pośrodkowa dolna (pępek omijany łukiem). Po resekcji kikut odbytnicy zamknięty staplerem; kolostomia końcowa w miejscu oznaczonym przed operacją.', cuts: [midCut(-2.6, -14.2, 'Laparotomia pośrodkowa dolna', 'od okolicy nadpępkowej do spojenia')], stoma: STOMA_C }),
    lap: lapL(HART_END, { stoma: STOMA_C }), rob: robL(HART_END, { stoma: STOMA_C }) };
  // kolektomia całkowita (IRA, IPAA): wiele kwadrantów
  function totSets(end, openTxt, name) {
    return { target: [0, -5, 0], cam: CAM0,
      open: openSet({ short: 'laparotomia pośrodkowa pełna', text: openTxt, cuts: [midCut(6.7, -14.4, 'Laparotomia pośrodkowa', 'od wyrostka mieczykowatego do spojenia', 1.1)] }),
      lap: { title: 'Dostęp laparoskopowy', short: '5 trokarów, wydobycie przez cięcie Pfannenstiela', side: 0,
        text: name + ': układ z hemikolektomii prawej (2 × 12 mm przez lewy mięsień prosty, 5 mm w linii cięcia Pfannenstiela, 5 mm pod wyrostkiem mieczykowatym), uzupełniony trokarem 12 mm przez prawy mięsień prosty do lewej połowy okrężnicy i odbytnicy. ' + end,
        first: 0, insuf: [-0.76, -0.62], ports: lapPorts(1).concat([{ at: [-3.6, -3.6], mm: 12, name: '12 mm — narzędzie, stapler', sub: 'przez prawy mięsień prosty' }]), ext: EXT_P },
      rob: { title: 'Dostęp robotyczny (da Vinci Xi)', short: 'da Vinci Xi, porty w linii poprzecznej', side: 0,
        text: name + ' (kilka kwadrantów): cztery porty robota w linii poprzecznej poniżej pępka, co ok. 7,5 cm; kolejne kwadranty osiągane obrotem wysięgnika robota bez przestawiania wózka; 12 mm pod stapler w prawym dolnym kwadrancie; port asystenta 5 mm w linii cięcia Pfannenstiela. ' + end,
        first: 1, insuf: [-0.76, -0.62], robot: true, line: [[-9.4, -8.6], [9.4, -8.6]],
        ports: [{ at: [-6.9, -8.6], mm: 12, name: '12 mm — ramię robota, stapler', sub: 'prawy dolny kwadrant' },
          { at: [-2.3, -8.6], mm: 8, name: '8 mm — optyka (kamera)', sub: 'poniżej pępka' },
          { at: [2.3, -8.6], mm: 8, name: '8 mm — ramię robota', sub: '' },
          { at: [6.9, -8.6], mm: 8, name: '8 mm — ramię robota', sub: 'lewy dolny kwadrant' },
          { at: [0.9, -13.75], mm: 5, name: '5 mm — port asystenta', sub: 'w linii cięcia Pfannenstiela', assist: true }],
        ext: EXT_P } };
  }
  ACCESS.ira = totSets('Preparat wydobyty przez cięcie Pfannenstiela; zespolenie krętniczo-odbytnicze staplerem okrężnym przez odbyt.',
    'Laparotomia pośrodkowa od wyrostka mieczykowatego do spojenia łonowego (pępek omijany łukiem) — dostęp do całej okrężnicy; zespolenie krętniczo-odbytnicze staplerem okrężnym przez odbyt.', 'Kolektomia całkowita');
  ACCESS.ipaa = totSets('Preparat wydobyty przez cięcie Pfannenstiela; przez nie formuje się zbiornik J, zespolenie zbiornika z kanałem odbytu staplerem okrężnym przez odbyt.',
    'Laparotomia pośrodkowa od wyrostka mieczykowatego do spojenia łonowego (pępek omijany łukiem) — dostęp do całej okrężnicy i miednicy; zbiornik J i zespolenie z kanałem odbytu staplerem okrężnym przez odbyt.', 'Proktokolektomia odtwórcza');
  // kolektomia z ileostomią końcową (zwykle choroba zapalna, często w trybie pilnym): otwarta albo laparoskopowa, bez robota; trokar 12 mm w miejscu
  // oznaczonym na ileostomię; kolektomia subtotalna — preparat przez otwór ileostomii, proktokolektomia — przez krocze
  function endiSets(open, lapEnd, name) {
    return { target: [0, -5, 0], cam: CAM0,
      open: openSet({ short: 'laparotomia pośrodkowa pełna', text: open, cuts: [midCut(6.7, -14.4, 'Laparotomia pośrodkowa', 'od wyrostka mieczykowatego do spojenia', 1.1)], stoma: STOMA_I }),
      lap: { title: 'Dostęp laparoskopowy', short: '5 trokarów, jeden w miejscu ileostomii', side: 0,
        text: name + ': układ z hemikolektomii prawej (2 × 12 mm przez lewy mięsień prosty, 5 mm w linii cięcia Pfannenstiela, 5 mm pod wyrostkiem mieczykowatym), uzupełniony trokarem 12 mm w miejscu oznaczonym na ileostomię (prawy mięsień prosty). ' + lapEnd,
        first: 0, insuf: [-0.76, -0.62], ports: lapPorts(1).concat([{ at: ILEO_SITE, mm: 12, name: '12 mm — narzędzie, stapler', sub: 'w miejscu oznaczonym na ileostomię' }]) } };
  }
  ACCESS.tcei = endiSets('Laparotomia pośrodkowa od wyrostka mieczykowatego do spojenia łonowego (pępek omijany łukiem) — dostęp do całej okrężnicy; kikut odbytnicy zamknięty staplerem, ileostomia końcowa w miejscu oznaczonym przed operacją.',
    'Preparat wydobyty przez poszerzony otwór trokaru w miejscu ileostomii; przez ten otwór wyprowadza się następnie ileostomię końcową.', 'Kolektomia subtotalna');
  ACCESS.pce = endiSets('Laparotomia pośrodkowa od wyrostka mieczykowatego do spojenia łonowego (pępek omijany łukiem) i, w drugim etapie, cięcie kroczowe wokół odbytu; preparat usuwany przez krocze, ileostomia końcowa w miejscu oznaczonym przed operacją.',
    'Preparat usuwany przez krocze (etap kroczowy); ileostomia końcowa przez otwór trokaru w miejscu oznaczonym przed operacją.', 'Proktokolektomia');
  ACCESS.pce.open.short = 'laparotomia pośrodkowa i krocze';
  // odtworzenie ciągłości po Hartmannie: najpierw uwolnienie kolostomii (cięcie wokół stomii), potem laparotomia dolna albo laparoskopia z portem w otworze po stomii
  var STOMA_CUT_C = { disc: true, c: COLO_SITE, r: 1.0, name: 'Cięcie wokół kolostomii', sub: 'uwolnienie stomii z powłok', t: [-0.86, -0.62], open: [-0.6, -0.4] };
  ACCESS.hrev = { target: [3, -11, 0], cam: CAM0,
    open: openSet({ short: 'cięcie wokół kolostomii i laparotomia dolna', text: 'Najpierw okrężne cięcie wokół kolostomii i uwolnienie jej z powłok, w zstępnicy kowadełko staplera okrężnego. Laparotomia pośrodkowa dolna (pępek omijany łukiem): uwolnienie zrostów i kikuta odbytnicy, zespolenie staplerem okrężnym przez odbyt. Rana po kolostomii zamknięta na końcu.',
      cuts: [STOMA_CUT_C, midCut(-2.6, -14.2, 'Laparotomia pośrodkowa dolna', 'od okolicy nadpępkowej do spojenia')] }),
    lap: { title: 'Dostęp laparoskopowy', short: 'port w miejscu kolostomii i 3 trokary', side: -1,
      text: 'Kolostomia uwolniona z powłok, do zstępnicy wprowadzone kowadełko, jelito odłożone do jamy brzusznej; w otworze po stomii port 12 mm (szew kapciuchowy powięzi albo port jednootworowy), przez niego odma. Dwa trokary przez prawy mięsień prosty (12 mm — optyka, 5 mm) i 5 mm nadłonowo; zespolenie staplerem okrężnym przez odbyt. Rana po kolostomii zamknięta na końcu.',
      first: 0, insuf: [-0.76, -0.62], ports: [{ at: COLO_SITE, mm: 12, name: '12 mm — w miejscu kolostomii', sub: 'po uwolnieniu stomii' },
        { at: [-3.6, -3.6], mm: 12, name: '12 mm — optyka (kamera)', sub: 'przez prawy mięsień prosty' },
        { at: [-3.9, 2.4], mm: 5, name: '5 mm — narzędzie', sub: 'przez prawy mięsień prosty, wyżej' },
        { at: [0, -13.75], mm: 5, name: '5 mm — narzędzie', sub: 'nadłonowo, w linii pośrodkowej' }] } };
  // zamknięcie ileostomii: tylko przez miejsce stomii (bez laparotomii)
  ACCESS.iclo = { target: [-2.8, -6.9, 1], cam: CAM0,
    open: { title: 'Dostęp przez miejsce stomii', short: 'cięcie wokół stomii', side: -1,
      text: 'Okrężne cięcie skóry wokół ileostomii; pętla uwolniona z tkanki podskórnej, powięzi i otrzewnej i wydobyta przez otwór po stomii, bez laparotomii. Po zamknięciu i odłożeniu pętli powięź zszyta, skóra zamknięta szwem kapciuchowym.',
      cuts: [{ disc: true, c: ILEO_SITE, r: 1.1, name: 'Cięcie wokół stomii', sub: 'tuż przy brzegu stomii', t: [-0.86, -0.46], open: [-0.42, -0.12] }], ports: [] } };
  // appendektomia: cięcie Lanza (poprzeczne w linii skóry, przez punkt McBurneya — 1/3 odległości od prawego kolca biodrowego przedniego górnego do pępka);
  // laparoskopia — trzy trokary: pępek (optyka), nadłonowo i lewy dół biodrowy (bocznie od naczyń nabrzusznych dolnych); bez robota
  ACCESS.appy = { target: [-6, -11, 0.8], cam: CAM0,
    open: { title: 'Dostęp otwarty: cięcie w prawym dole biodrowym', short: 'cięcie Lanza (McBurneya)', side: -1,
      text: 'Cięcie poprzeczne w linii skóry (Lanza) przez punkt McBurneya — jedna trzecia odległości od prawego kolca biodrowego przedniego górnego do pępka; mięśnie skośne i poprzeczny rozwarstwione wzdłuż włókien (dostęp „zmienny”), bez przecinania mięśni. Klasycznie cięcie skośne McBurneya.',
      cuts: [{ pts: [[-7.0, -9.15], [-5.8, -8.85], [-4.7, -8.5]], name: 'Cięcie Lanza', sub: 'przez punkt McBurneya', t: [-0.86, -0.46], open: [-0.42, -0.12], w: 0.55 }], ports: [] },
    lap: { title: 'Dostęp laparoskopowy', short: '3 trokary: pępek, nadłonowo, lewy dół biodrowy', side: 0,
      text: 'Optyka 10–12 mm w pępku (technika otwarta, potem odma), trokary 5 mm nadłonowo w linii pośrodkowej i w lewym dole biodrowym, bocznie od naczyń nabrzusznych dolnych; ułożenie: Trendelenburg z przechyleniem na lewo. Wyrostek wydobyty w worku przez port w pępku.',
      first: 0, insuf: [-0.76, -0.62], ports: [{ at: [0, -6.1], mm: 12, name: '10–12 mm — optyka (kamera)', sub: 'w pępku, wydobycie wyrostka' },
        { at: [0, -13.6], mm: 5, name: '5 mm — narzędzie', sub: 'nadłonowo, w linii pośrodkowej' },
        { at: [6.4, -10.2], mm: 5, name: '5 mm — narzędzie', sub: 'lewy dół biodrowy' }] } };
  // jejunostomia odżywcza (Witzel): model żołądka i jelita czczego w układzie zgodnym z powłokami (bez przeniesienia); zwykle w trakcie innej operacji
  var WITZ_SITE = { at: [5.6, -5.0], r: 0.6, name: 'Wyprowadzenie zgłębnika', sub: 'lewe śródbrzusze, bocznie od mięśnia prostego' };
  ACCESS.witzel = { target: [4.5, -4.5, 0], cam: CAM0,
    open: openSet({ short: 'laparotomia pośrodkowa', text: 'Zwykle przez laparotomię operacji głównej (np. resekcji przełyku lub żołądka); samodzielnie — krótka laparotomia pośrodkowa górna, nad pępkiem. Zgłębnik wyprowadzony przez osobne nacięcie w lewym śródbrzuszu.',
      cuts: [midCut(2.6, -4.4, 'Laparotomia pośrodkowa górna', 'krótka, nad pępkiem', 0.6)], stoma: WITZ_SITE }),
    lap: { title: 'Dostęp laparoskopowy', short: '3 trokary, zgłębnik w lewym śródbrzuszu', side: -1,
      text: 'Optyka 12 mm w pępku (technika otwarta, potem odma), dwa trokary 5 mm w prawej połowie brzucha; pętla jelita czczego odnaleziona za więzadłem Treitza, przyszyta do powłok (szwy przezpowłokowe), zgłębnik wprowadzony przez powłoki w lewym śródbrzuszu.',
      first: 0, insuf: [-0.76, -0.62], ports: [{ at: [0, -6.1], mm: 12, name: '12 mm — optyka (kamera)', sub: 'w pępku' },
        { at: [-5.6, -2.8], mm: 5, name: '5 mm — narzędzie', sub: 'prawe śródbrzusze' }, { at: [-4.8, -9.6], mm: 5, name: '5 mm — narzędzie', sub: 'prawy dolny kwadrant' }], stoma: WITZ_SITE } };
  // ileostomia: trepanacja w miejscu oznaczonym przed operacją albo ileostomia wspomagana laparoskopowo; bez robota
  ACCESS.ileo = { target: [-2.8, -6.9, 1], cam: CAM0,
    open: { title: 'Dostęp otwarty: trepanacja', short: 'trepanacja w miejscu stomii', side: -1,
      text: 'Okrągłe wycięcie skóry (ok. 2,5 cm) w miejscu oznaczonym przed operacją, w prawym mięśniu prostym; rozszczepienie mięśnia, otwarcie otrzewnej i wyprowadzenie pętli jelita krętego bez laparotomii.',
      cuts: [{ disc: true, c: ILEO_SITE, r: 0.78, name: 'Trepanacja', sub: 'w miejscu oznaczonym przed operacją', t: [-0.86, -0.46], open: [-0.42, -0.12] }], ports: [] },
    lap: { title: 'Dostęp laparoskopowy', short: '2 trokary i trepanacja w miejscu stomii', side: 0,
      text: 'Ileostomia wspomagana laparoskopowo: optyka 12 mm przez lewy mięsień prosty (technika otwarta, odma), trokar 5 mm w linii cięcia Pfannenstiela; pętla jelita krętego odnaleziona i ustawiona pod kontrolą kamery, wyprowadzona przez trepanację w miejscu oznaczonym przed operacją (prawy mięsień prosty).',
      first: 0, insuf: [-0.76, -0.62], ports: [lapPorts(1)[0], lapPorts(1)[2]], stoma: STOMA_I } };
  // jelito cienkie: model w innym układzie — powłoki przeniesione (xf: skala, przesunięcie); laparoskopia jak w hemikolektomii prawej
  ACCESS.sb = { target: [0, -6, 0], cam: { t: [-12.4, -11.6, 1.2], tp: [0.2, -11.6, 1.2], az: 0, el: 12, k: 0.84 }, xf: { s: 1.2, d: [0.2, -6.1, 0.2] },
    open: openSet({ short: 'krótka laparotomia pośrodkowa', text: 'Krótka laparotomia pośrodkowa okołopępkowa (pępek omijany łukiem), poszerzana w razie potrzeby. Jelito wyprowadzone przez ranę, resekcja i zespolenie poza jamą brzuszną.', cuts: [midCut(-2.6, -8.8, 'Laparotomia pośrodkowa okołopępkowa', 'krótka, ok. 10 cm', 0.6)] }),
    lap: { title: 'Dostęp laparoskopowy', short: '4 trokary, wydobycie przez cięcie Pfannenstiela', side: 1,
      text: 'Trokary jak w hemikolektomii prawej: dwa 12 mm przez lewy mięsień prosty (optyka w połowie wysokości między kolcem biodrowym przednim górnym a łukiem żebrowym, drugi wyżej), 5 mm w linii cięcia Pfannenstiela i 5 mm pod wyrostkiem mieczykowatym. Odcinek jelita wyprowadzony przez cięcie Pfannenstiela, resekcja i zespolenie poza jamą brzuszną.',
      first: 0, insuf: [-0.76, -0.62], ports: lapPorts(1), ext: EXT_P } };
