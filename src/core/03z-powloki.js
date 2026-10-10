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
    return { ZC: ZC, W: W, D: D, z: z, at: at, nrm: nrm, lift: lift, Y0: Y0, Y1: Y1, LM: LM, rectLat: rectLat, RECT_MED: RECT_MED, RY: [RY0, RY1], TEND: TEND, EPI_INF: EPI_INF, EPI_SUP: EPI_SUP, MCL: MCL };
  })();

  /* ---------- Dostęp operacyjny (slajd „Dostęp” przed anatomią prawidłową). Oś czasu kadru m: −1 → −0,02 (poza nią model powłok niewidoczny).
     open — cięcia [x, y] na skórze z czasem rysowania (t) i otwierania rany (open); lap / rob — trokary: at [x, y], mm, rola; first — trokar wprowadzony
     techniką otwartą przed odmą; odma (insuf) unosi powłoki; ext — planowane cięcie do wydobycia preparatu (linia przerywana).
     Hemikolektomia prawa: otwarty — cięcie poprzeczne prawostronne nad pępkiem; laparoskopia — 2 × 12 mm przez lewy mięsień prosty (optyka w połowie
     wysokości między kolcem biodrowym przednim górnym a łukiem żebrowym, drugi wyżej), 5 mm w linii cięcia Pfannenstiela i 5 mm pod wyrostkiem
     mieczykowatym (praktyka autora; porty laparoskopowe w brzuścu mięśnia prostego, przyśrodkowo od naczyń nabrzusznych), wydobycie przez cięcie Pfannenstiela; robot da Vinci Xi — porty w linii od lewej linii środkowo-obojczykowej
     na wysokości łuku żebrowego do spojenia łonowego, co 6–10 cm (najniższy w linii Pfannenstiela), port asystenta w lewym boku między dolnymi portami. ---------- */
  var PFANN = [[-2.4, -13.35], [-1.2, -13.72], [0, -13.85], [1.2, -13.72], [2.4, -13.35]];
  var ACCESS = {
    rh: {
      target: [-4.6, -3.2, 0.6],
      open: {
        title: 'Dostęp otwarty: cięcie poprzeczne',
        text: 'Cięcie poprzeczne w prawej połowie brzucha, ok. 2–3 cm nad pępkiem, od linii pośrodkowej do prawej linii pachowej przedniej, z przecięciem prawego mięśnia prostego. Dobry dostęp do prawej połowy okrężnicy i zagięcia wątrobowego; jelito wyprowadzone przez ranę, zespolenie (FEEA) poza jamą brzuszną.',
        cuts: [{ pts: [[0.7, -3.55], [-1.6, -3.7], [-4.0, -3.72], [-6.4, -3.55], [-8.6, -3.15]], name: 'Cięcie poprzeczne prawostronne', sub: 'nad pępkiem, przez prawy mięsień prosty', t: [-0.86, -0.46], open: [-0.42, -0.12], w: 0.85 }],
        ports: []
      },
      lap: {
        title: 'Dostęp laparoskopowy',
        text: 'Dwa trokary 12 mm przez lewy mięsień prosty: optyka w połowie wysokości między kolcem biodrowym przednim górnym a łukiem żebrowym (wprowadzona techniką otwartą, potem odma otrzewnowa), drugi nieco wyżej; dwa trokary 5 mm — w linii cięcia Pfannenstiela i pod wyrostkiem mieczykowatym. Zespolenie wewnątrzbrzuszne (izoperystaltyczne), preparat wydobyty przez cięcie Pfannenstiela.',
        first: 0, insuf: [-0.76, -0.62],
        ports: [{ at: [3.6, -3.6], mm: 12, name: '12 mm — optyka (kamera)', sub: 'przez lewy mięsień prosty' },
          { at: [3.9, 2.4], mm: 12, name: '12 mm — narzędzie, stapler', sub: 'przez lewy mięsień prosty, wyżej' },
          { at: [0.9, -13.75], mm: 5, name: '5 mm — narzędzie', sub: 'w linii cięcia Pfannenstiela' },
          { at: [0, 6.9], mm: 5, name: '5 mm — pomocniczy', sub: 'pod wyrostkiem mieczykowatym' }],
        ext: { pts: PFANN, name: 'Cięcie Pfannenstiela', sub: 'wydobycie preparatu po zespoleniu wewnątrzbrzusznym' }
      },
      rob: {
        title: 'Dostęp robotyczny (da Vinci Xi)',
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
