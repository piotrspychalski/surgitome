  /* ---------- HERNIOLOGIA (TOOL_EXT.wall): warstwowy model powłok brzucha (ANAT.WALL na skórze ANAT.BODY) z przepukliną w linii pośrodkowej.
     Bryła powłok od dołu do poziomu przekroju (górna ściana bryły = przekrój poprzeczny przez środek ubytku); w kadrze TK — cała przepuklina.
     Warstwy to pasma między dwiema głębokościami pod skórą (punkt i normalna skóry z ANAT.BODY, głębokość wzdłuż normalnej), osobno po obu stronach
     linii pośrodkowej. x0 — położenie przed przemieszczeniem: ubytek powstaje przez odsunięcie warstw mięśniowo-powięziowych na boki (o połowę
     szerokości ubytku przyśrodkowo, malejąco ku linii pachowej). Stan zabiegu (szczeliny między warstwami, przesunięcie przyśrodkowe, cięcia, siatka,
     szwy) liczony z osi czasu m dla zabiegu d.op: 'tar', 'acs', 'umb' (siatka przedotrzewnowa), 'umbs' (szew). TK: własny rysunek przekroju
     (M.ctCustom) z pomiarem RDR i objętościami do oceny utraty domeny. ---------- */
  // kolory warstw, naczyń, nerwów i siatki — ze wspólnego modelu ściany (ANAT.BODY.COL); tu tylko kolory własne przekroju
  var HW_COL = Object.assign({}, A.BODY.COL, { space: '#29b6f6', bowel: '#e59aa0', drain: '#cfd6dc' });
  function makeWall(d) {
    var W = A.WALL, B = A.BODY, H = W.HER[d.her], T = W.T, op = d.op, UMB = op === 'umb' || op === 'umbs', NOMESH = !!d.noMesh;   // noMesh — Ramirez w wersji oryginalnej (bez siatki)
    var DF = T.skin + H.fat, RM = B.RECT_MED, KM = 1.6;
    // schemat: warstwy mięśniowo-powięziowe i głębsze pogrubione KM razy (czytelność przekroju); D2 — głębokość rysowana
    function D2(d) { return d > DF ? DF + (d - DF) * KM : d; }
    var Y0 = H.y0, YT = H.y1, NY = Math.round((YT - Y0) / (UMB ? 0.2 : 0.3)), ROWS = [];
    for (var ri = 0; ri <= NY; ri++) ROWS.push(Y0 + (YT - Y0) * ri / NY);
    // przekrój: bryła od wiersza iCutCut (poziom cut) w górę; widok od strony stóp
    var iCutCut = NY; for (var rc = NY; rc >= 0; rc--) if (ROWS[rc] >= H.cut - 1e-6) iCutCut = rc;
    var iTopCut = NY; for (var rt = NY; rt >= 0; rt--) if (ROWS[rt] >= H.cut + H.slab - 1e-6) iTopCut = rt;   // plaster nad przekrojem (kadry zabiegu)
    // skóra: punkt i normalna (tablica wzdłuż x dla każdego wiersza)
    var XS = 0.05, NXL = Math.round(26 / XS), LUT = ROWS.map(function (y) {
      var r = new Float32Array((NXL + 1) * 6);
      for (var j = 0; j <= NXL; j++) { var x = -13 + j * XS, p = B.at(x, y, 0, 0), n = B.nrm(x, y, 0); r.set([p.x, p.y, p.z, n.x, n.y, n.z], j * 6); }
      return r;
    });
    var BQ = new Float32Array(6);
    function base(X, i) { var f = (X + 13) / XS, j = Math.max(0, Math.min(NXL - 1, Math.floor(f))), u = Math.max(0, Math.min(1, f - j)), R = LUT[i], a = j * 6; for (var k = 0; k < 6; k++) BQ[k] = R[a + k] + (R[a + 6 + k] - R[a + k]) * u; return BQ; }
    function baseY(X, y) { var p = B.at(X, y, 0, 0), n = B.nrm(X, y, 0); BQ[0] = p.x; BQ[1] = p.y; BQ[2] = p.z; BQ[3] = n.x; BQ[4] = n.y; BQ[5] = n.z; return BQ; }
    // geometria przepukliny
    function semi(y) { return B.rectLat(y); }
    function Wd(y) { return B.W(y) * 0.975; }
    function hwAt(y) { var u = 1 - Math.pow((y - H.yc) / H.hl, 2); return u > 0 ? H.hw * Math.sqrt(u) : 0; }
    function gLat(x0, y) { var s0 = semi(y); return x0 <= s0 ? 1 : 1 - sm((x0 - s0) / (Wd(y) - s0)); }
    function domeE(x, y, ox, oy) { var e = 1 - Math.pow(x / (H.hw + ox), 2) - Math.pow((y - H.yc) / (H.hl + oy), 2); return e > 0 ? Math.pow(e, 0.55) : 0; }
    function bulge(x, y, st) { return H.bulge * st.k * domeE(x, y, UMB ? 1.5 : 2.2, UMB ? 1.5 : 2.2); }
    function fatBot(x, y, st) { var top = -bulge(x, y, st) + T.skin + (UMB ? 0.3 : 0.45); return DF + (Math.min(DF, top) - DF) * domeE(x, y, UMB ? 0.35 : 0.9, UMB ? 0.35 : 0.9) * st.k; }
    // warstwy w stanie prawidłowym — wspólny model ściany (BODY.WL, BODY.layer); tu przemieszczenia, szczeliny i cięcia zabiegu
    var ARC = W.ARC, WL = B.WL;
    function taMed(y) { return B.taMed(y); }
    function tarX(y) { return semi(y) - Math.min(0.6, Math.max(0.15, taMed(y))); }
    function eoCutX(y) { return semi(y) + 0.95; }
    var tfD = WL.tfD, taTop = WL.taTop, eoTh = WL.eoTh;
    // stan zabiegu z osi czasu m
    function stateAt(m) {
      var st = { k: 1, inc: 0, open: 0, sac: 1, rr: 0, tarCut: 0, tar: 0, cP: 0, mesh: 0, cA: 0, close: 0, drain: 0, flap: 0, eoCut: 0, eo: 0, pre: 0, fade: 0, full: false };
      if (op === 'tar' || op === 'acs') {
        st.inc = clamp01(m / 0.3); st.open = sm((m - 0.25) / 0.25); st.sac = 1 - sm((m - 0.55) / 0.3); st.k = 1 - sm((m - 0.5) / 0.45);
        if (op === 'tar') {
          st.rr = sm((m - 1.05) / 0.85); st.tarCut = clamp01((m - 2.0) / 0.3); st.tar = sm((m - 2.3) / 0.65); st.cP = sm((m - 3.05) / 0.8);
          st.mesh = sm((m - 4.05) / 0.6); st.cA = sm((m - 5.0) / 0.6); st.close = sm((m - 5.5) / 0.45); st.drain = sm((m - 5.7) / 0.25);
          st.fade = sm((m - 1.0) / 0.3) * (1 - sm((m - 5.4) / 0.3));
        } else {
          st.flap = sm((m - 1.05) / 0.85); st.eoCut = clamp01((m - 2.0) / 0.3); st.eo = sm((m - 2.3) / 0.65); st.cA = sm((m - 3.05) / 0.85); st.cP = st.cA;
          if (NOMESH) { st.close = sm((m - 4.05) / 0.6); st.drain = sm((m - 4.2) / 0.3); st.fade = sm((m - 1.6) / 0.3) * (1 - sm((m - 4.05) / 0.3)); }
          else { st.mesh = sm((m - 4.05) / 0.6); st.close = sm((m - 5.05) / 0.6); st.drain = sm((m - 5.2) / 0.3); st.fade = sm((m - 1.6) / 0.3) * (1 - sm((m - 5.05) / 0.3)); }
        }
      } else {
        var mesh = op === 'umb', mc = mesh ? 3 : 2;
        st.inc = clamp01(m / 0.35); st.open = sm((m - 0.3) / 0.3); st.sac = 1; st.k = 1 - sm((m - 1.0) / 0.6);
        st.pre = (mesh ? 1 : 0.35) * sm((m - 1.35) / 0.55); st.mesh = mesh ? sm((m - 2.05) / 0.6) : 0;
        st.cA = sm((m - mc - 0.05) / 0.6); st.cP = st.cA; st.close = sm((m - mc - 0.5) / 0.45);
        st.fade = sm((m - 0.6) / 0.3) * (1 - sm((m - mc - 0.45) / 0.3));
      }
      return st;
    }
    // przesunięcie boczne: przednia warstwa (mięśnie proste, linia biała, mięśnie boczne) i tylna (pochewka tylna, powięź poprzeczna, otrzewna)
    function hwA(y, st) { return hwAt(y) * (1 - st.cA); }
    function hwP(y, st) { return hwAt(y) * (1 - Math.max(st.cP, st.cA)); }
    // szczeliny: zamięśniowa (między mięśniem prostym a pochewką tylną) i przed powięzią poprzeczną (TAR); po zamknięciu zostaje miejsce na siatkę
    function gR(x0, y, st) { var reach = st.rr * (semi(y) - 0.15); return st.rr > 0 && x0 < reach + 0.4 ? 0.32 * st.rr * (1 - sm((x0 - reach) / 0.4)) * (1 - 0.8 * st.cA) * (x0 < semi(y) + 0.1 ? 1 : 0) : 0; }
    function gT(x0, y, st) { if (!st.tar) return 0; var x1 = tarX(y), reach = x1 + st.tar * (Wd(y) * 0.92 - x1); return x0 > x1 - 0.05 && x0 < reach + 0.5 ? 0.26 * st.tar * (1 - sm((x0 - reach) / 0.5)) * (1 - 0.8 * st.cA) : 0; }
    function gF(x0, y, st) { if (!st.flap) return 0; var reach = st.flap * (semi(y) + 2.6); return x0 < reach + 0.6 ? 0.5 * st.flap * (1 - sm((x0 - reach) / 0.6)) * (1 - 0.85 * st.close) : 0; }
    function gE(x0, y, st) { if (!st.eo) return 0; var x1 = eoCutX(y), reach = x1 + st.eo * (Wd(y) * 0.85 - x1); return x0 > x1 && x0 < reach + 0.5 ? 0.22 * st.eo * (1 - sm((x0 - reach) / 0.5)) * (1 - 0.5 * st.close) : 0; }
    function gPre(x0, y, st) { if (!st.pre) return 0; var r = Math.sqrt(x0 * x0 + Math.pow(y - H.yc, 2)), R = H.hw + 2.1; return 0.3 * st.pre * (1 - sm((r - R) / 0.6)); }
    var INC = [H.yc - H.hl - 0.8, H.yc + H.hl + 0.8];   // cięcie skóry w linii pośrodkowej (przepuklina w bliźnie)
    function skinGap(y, st) {
      if (UMB || y < INC[0] || y > INC[1]) return 0;
      var u = Math.min(1, (y - INC[0]) / 1.2, (INC[1] - y) / 1.2); return (st.open * 0.75 + st.flap * 1.4) * Math.sqrt(u) * (1 - st.close);
    }
    // warstwy: [x0a, x0b](y), głębokość [d0, d1](x0, y), przesunięcie boczne, kolor
    var LAY = {
      skin: { xa: function (y, st) { return skinGap(y, st); }, xb: Wd, dep: function (x0, y, st) { var b = bulge(x0, y, st), f = gF(x0, y, st); return [-b - f, -b - f + T.skin]; }, col: HW_COL.skin, nx: 34 },
      fat: { xa: function (y, st) { return skinGap(y, st); }, xb: Wd, dep: function (x0, y, st) { var b = bulge(x0, y, st), f = gF(x0, y, st); return [-b - f + T.skin, fatBot(x0, y, st) - f]; }, col: HW_COL.fat, nx: 34 },
      // powięź Scarpy (warstwa błoniasta tkanki podskórnej) — w podbrzuszu; płat skórno-tłuszczowy unosi się razem z nią
      scarpa: { xa: function (y, st) { return skinGap(y, st); }, xb: Wd, dep: function (x0, y, st) { var t0 = -bulge(x0, y, st) + T.skin, a = t0 + 0.55 * (fatBot(x0, y, st) - t0) - gF(x0, y, st); return [a, a + T.scarpa]; }, col: HW_COL.scarpa, nx: 34 },
      eoM: { xa: function () { return 0; }, xb: eoCutX, dep: function (x0, y) { return [DF, DF + eoTh(x0, y)]; }, disp: hwA, col: HW_COL.apo, vcol: function (x0, y) { return x0 > W.eoApo(y) ? HW_COL.eo : HW_COL.apo; }, nx: 16 },
      eoL: { xa: eoCutX, xb: function (y) { return Wd(y) * 0.995; }, dep: function (x0, y, st) { var g = gE(x0, y, st); return [DF - g, DF + eoTh(x0, y) - g]; },
        disp: function (y, st) { return op === 'acs' && st.eoCut > 0 ? hwAt(y) : hwA(y, st); }, col: HW_COL.eo, vcol: function (x0, y) { return x0 > W.eoApo(y) ? HW_COL.eo : HW_COL.apo; }, nx: 22 },
      alba: { xa: function () { return 0; }, xb: function () { return RM; }, dep: function () { return [DF + 0.04, DF + 0.7]; }, disp: hwA, col: HW_COL.apo, nx: 3 },
      rect: { xa: function () { return RM; }, xb: semi, dep: function (x0, y) { var r = WL.rect(x0, y); return [DF + r[0], DF + r[1]]; }, disp: hwA, col: HW_COL.rect, nx: 16 },
      io: { xa: function (y) { return semi(y) + 0.04; }, xb: function (y) { return Wd(y) * 0.99; }, dep: function (x0, y) { var r = WL.io(x0, y); return [DF + r[0], DF + r[1]]; }, disp: hwA, col: HW_COL.io, nx: 22 },
      postM: { y0: ARC, xa: function () { return 0; }, xb: tarX, dep: function (x0, y, st) { var g = gR(x0, y, st); return [DF + 0.7 + g, DF + 0.75 + g]; }, disp: hwP, col: HW_COL.apo, nx: 14 },
      postL: { y0: ARC, xa: tarX, xb: function (y) { return semi(y) + 0.12; }, dep: function (x0, y, st) { var g = gR(x0, y, st); return [DF + 0.7 + g, DF + 0.75 + g]; }, disp: function (y, st) { return st.tarCut > 0.5 ? hwA(y, st) : hwP(y, st); }, col: HW_COL.apo, nx: 4 },
      taM: { xa: function (y) { return Math.min(tarX(y), semi(y) - taMed(y)); }, xb: tarX, dep: function (x0, y, st) { var g = gR(x0, y, st), t0 = taTop(x0, y); return [DF + t0 + g, DF + t0 + 0.2 + g]; }, disp: hwP, col: HW_COL.ta, nx: 6 },
      taL: { xa: tarX, xb: function (y) { return Wd(y) * 0.99; }, dep: function (x0, y, st) { var g = x0 < semi(y) ? gR(x0, y, st) : 0, t0 = taTop(x0, y); return [DF + t0 + g, DF + t0 + 0.2 + 0.04 * sm(x0 - semi(y)) + g]; },
        disp: function (y, st) { return st.tarCut > 0.5 ? hwA(y, st) : hwP(y, st); }, col: HW_COL.ta, nx: 22 },
      tf: { xa: function () { return 0; }, xb: function (y) { return Wd(y) * 0.985; }, dep: function (x0, y, st) { var b = DF + tfD(x0, y) + gR(x0, y, st) + gT(x0, y, st); return [b, b + T.tf]; }, disp: hwP, col: HW_COL.tf, nx: 26 },
      pre: { xa: function () { return 0; }, xb: function (y) { return Wd(y) * 0.98; }, dep: function (x0, y, st) { var b = DF + tfD(x0, y) + gR(x0, y, st) + gT(x0, y, st) + T.tf, g = gPre(x0, y, st); return [b + g, b + T.pre + g]; }, disp: hwP, col: HW_COL.pre, nx: 26 },
      per: { xa: function () { return 0; }, xb: function (y) { return Wd(y) * 0.975; }, dep: function (x0, y, st) { var b = DF + tfD(x0, y) + gR(x0, y, st) + gT(x0, y, st) + T.tf + T.pre + gPre(x0, y, st); return [b, b + T.per]; }, disp: hwP, col: HW_COL.per, nx: 26 },
      // przestrzenie otwierane w czasie zabiegu (wypełnienie półprzezroczyste): zamięśniowa, przed powięzią poprzeczną (TAR), pod płatem skórnym, między mięśniami skośnymi, przedotrzewnowa
      spR: { space: 1, xa: function () { return 0; }, xb: function (y) { return semi(y) + 0.05; }, dep: function (x0, y, st) { return [DF + 0.7, DF + 0.7 + gR(x0, y, st)]; }, disp: hwA, nx: 18 },
      spT: { space: 1, xa: tarX, xb: function (y) { return Wd(y) * 0.95; }, dep: function (x0, y, st) { var a = DF + taTop(x0, y) + 0.2 + 0.04 * sm(x0 - semi(y)) + (x0 < semi(y) ? gR(x0, y, st) : 0); return [a, Math.max(a, DF + tfD(x0, y) + gR(x0, y, st) + gT(x0, y, st))]; }, disp: hwA, nx: 22 },
      spF: { space: 1, xa: function (y, st) { return skinGap(y, st); }, xb: function (y) { return semi(y) + 3.4; }, dep: function (x0, y, st) { return [DF - gF(x0, y, st), DF]; }, disp: hwA, nx: 20 },
      spE: { space: 1, xa: eoCutX, xb: function (y) { return Wd(y) * 0.9; }, dep: function (x0, y, st) { var th = eoTh(x0, y); return [DF + th - gE(x0, y, st), DF + th]; }, disp: function (y) { return hwAt(y); }, nx: 20 },
      spP: { space: 1, xa: function () { return 0; }, xb: function () { return H.hw + 2.6; }, dep: function (x0, y, st) { var b = DF + tfD(x0, y) + T.tf; return [b, b + gPre(x0, y, st)]; }, disp: hwP, nx: 14 }
    };
    if (UMB) { LAY.skin.nx = LAY.fat.nx = 26; }
    var grp = new THREE.Group(), labels = [], bands = [];
    function matOf(col, op0, vc) { var m = track(new THREE.MeshStandardMaterial({ color: vc ? '#ffffff' : col, vertexColors: !!vc, roughness: 0.72, metalness: 0, side: THREE.DoubleSide, transparent: true, opacity: op0 == null ? 1 : op0 })); m.userData.op = op0 == null ? 1 : op0; return m; }
    // pasmo: przód, tył, brzegi (x0a, x0b) i ściana przekroju (wiersz iCut); trójkąty uporządkowane wierszami — zakres rysowania obcina bryłę na poziomie przekroju
    function band(key, s) {
      var L = LAY[key], i0 = 0; if (L.y0 != null) { while (i0 < NY && ROWS[i0] < L.y0) i0++; }
      var nr = NY - i0 + 1, nx = L.nx, nv = nr * (nx + 1), vc = !!L.vcol;
      function geo(n, idx, colors) { var g = track(new THREE.BufferGeometry()); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3)); if (colors) g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3), 3)); g.setIndex(idx); return g; }
      var gi = []; for (var r = 0; r < nr - 1; r++) for (var j = 0; j < nx; j++) { var a = r * (nx + 1) + j, b = a + nx + 1; gi.push(a, b, a + 1, b, b + 1, a + 1); }
      var si = []; for (var r2 = 0; r2 < nr - 1; r2++) { var a2 = r2 * 2; si.push(a2, a2 + 2, a2 + 1, a2 + 2, a2 + 3, a2 + 1); }
      var ci = []; for (var j2 = 0; j2 < nx; j2++) { var a3 = j2 * 2; ci.push(a3, a3 + 2, a3 + 1, a3 + 2, a3 + 3, a3 + 1); }
      var G = { front: geo(nv, gi, vc), back: geo(nv, gi, vc), ea: geo(nr * 2, si), eb: geo(nr * 2, si), cut: geo((nx + 1) * 2, ci, vc) };
      var col = L.space ? HW_COL.space : L.col, mat = matOf(col, L.space ? 0.35 : 1, vc), g = new THREE.Group();
      // ściana przekroju: kolory płaskie (bez oświetlenia), jak na rycinie przekroju
      var cmat = track(new THREE.MeshBasicMaterial({ color: vc ? '#ffffff' : col, vertexColors: vc, side: THREE.DoubleSide, transparent: true, opacity: L.space ? 0.55 : 1, depthWrite: !L.space }));
      if (L.space) { mat.depthWrite = false; g.renderOrder = 2; }
      var emat = vc ? matOf(L.col, 1, false) : mat;   // brzegi (ea, eb) bez atrybutu koloru — materiał bez kolorów wierzchołków
      Object.keys(G).forEach(function (k) { g.add(new THREE.Mesh(G[k], k === 'cut' ? cmat : k === 'ea' || k === 'eb' ? emat : mat)); });
      grp.add(g);
      var o = { key: key, s: s, L: L, i0: i0, nr: nr, nx: nx, G: G, mat: mat, cmat: cmat, emat: emat, g: g, cols: vc ? {} : null };
      bands.push(o); return o;
    }
    var SPV = { spR: function (st) { return st.rr * (1 - st.cA); }, spT: function (st) { return st.tar * (1 - st.cA); }, spF: function (st) { return st.flap * (1 - st.close); }, spE: function (st) { return st.eo; }, spP: function (st) { return st.pre * (1 - st.mesh); } };
    var C3 = new THREE.Color();
    function bandUpdate(o, st, iCut, iTop) {
      var L = o.L, nx = o.nx, s = o.s, P = o.G.front.attributes.position.array, Q = o.G.back.attributes.position.array, EA = o.G.ea.attributes.position.array, EB = o.G.eb.attributes.position.array, CU = o.G.cut.attributes.position.array;
      var CF = o.cols ? o.G.front.attributes.color.array : null, CB = o.cols ? o.G.back.attributes.color.array : null, CC = o.cols ? o.G.cut.attributes.color.array : null;
      var rCut = Math.max(0, Math.min(o.nr - 1, iCut - o.i0));
      for (var r = 0; r < o.nr; r++) {
        var i = o.i0 + r, y = ROWS[i], xa = L.xa(y, st), xb = Math.max(xa + 1e-4, L.xb(y, st)), dsp = L.disp ? L.disp(y, st) : 0;
        for (var j = 0; j <= nx; j++) {
          var x0 = xa + (xb - xa) * j / nx, dd = L.dep(x0, y, st), X = s * (x0 + dsp * (L.disp ? gLat(x0, y) : 0)), q = base(X, i), k = (r * (nx + 1) + j) * 3;
          dd = [D2(dd[0]), D2(dd[1])];
          P[k] = q[0] - q[3] * dd[0]; P[k + 1] = q[1] - q[4] * dd[0]; P[k + 2] = q[2] - q[5] * dd[0];
          Q[k] = q[0] - q[3] * dd[1]; Q[k + 1] = q[1] - q[4] * dd[1]; Q[k + 2] = q[2] - q[5] * dd[1];
          if (CF) { C3.set(L.vcol(x0, y)); CF[k] = CB[k] = C3.r; CF[k + 1] = CB[k + 1] = C3.g; CF[k + 2] = CB[k + 2] = C3.b; }
          if (j === 0 || j === nx) { var E = j === 0 ? EA : EB, e = r * 6, mid = j === 0 && Math.abs(X) < 0.015, Z = mid ? P : Q; E[e] = P[k]; E[e + 1] = P[k + 1]; E[e + 2] = P[k + 2]; E[e + 3] = Z[k]; E[e + 4] = Z[k + 1]; E[e + 5] = Z[k + 2]; }   // brzeg przy linii pośrodkowej bez szczeliny — bez ściany
          if (r === rCut) { var c = j * 6; CU[c] = P[k]; CU[c + 1] = P[k + 1]; CU[c + 2] = P[k + 2]; CU[c + 3] = Q[k]; CU[c + 4] = Q[k + 1]; CU[c + 5] = Q[k + 2]; if (CC) { CC[c] = CC[c + 3] = CF[k]; CC[c + 1] = CC[c + 4] = CF[k + 1]; CC[c + 2] = CC[c + 5] = CF[k + 2]; } }
        }
      }
      ['front', 'back', 'ea', 'eb', 'cut'].forEach(function (k2) { var g = o.G[k2]; g.attributes.position.needsUpdate = true; if (g.attributes.color) g.attributes.color.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingSphere(); });
      var nRows = Math.max(0, Math.min(o.nr - 1, iTop - o.i0) - rCut);   // wiersze od przekroju w górę, do górnej granicy plastra
      o.G.front.setDrawRange(rCut * nx * 6, nRows * nx * 6); o.G.back.setDrawRange(rCut * nx * 6, nRows * nx * 6); o.G.ea.setDrawRange(rCut * 6, nRows * 6); o.G.eb.setDrawRange(rCut * 6, nRows * 6);
      o.g.visible = nRows > 0 && (!L.space || (L.space && SPV[o.key](st) > 0.01));
    }
    var KEYS = ['skin', 'fat', 'scarpa', 'eoM', 'eoL', 'alba', 'rect', 'io', 'postM', 'postL', 'taM', 'taL', 'tf', 'pre', 'per'].concat(op === 'tar' ? ['spR', 'spT'] : op === 'acs' ? ['spF', 'spE'] : ['spP']);
    [-1, 1].forEach(function (s) { KEYS.forEach(function (k) { band(k, s); }); });
    // worek przepuklinowy: kopuła między przyśrodkowymi brzegami otrzewnej (x = ±hwP) a tkanką podskórną; zawartość: pętle jelita (przepuklina w bliźnie) albo tłuszcz (pępkowa)
    var SNX = 16, sacNV = (NY + 1) * (SNX + 1), sacG = track(new THREE.BufferGeometry());
    sacG.setAttribute('position', new THREE.BufferAttribute(new Float32Array(sacNV * 3), 3));
    (function () { var idx = []; for (var r = 0; r < NY; r++) for (var j = 0; j < SNX; j++) { var a = r * (SNX + 1) + j, b = a + SNX + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); } sacG.setIndex(idx); })();
    var sacM = matOf(UMB ? '#f3d37a' : HW_COL.per, 0.9), sac = new THREE.Mesh(sacG, sacM); grp.add(sac);
    sacM.emissive = new THREE.Color(UMB ? '#5a4512' : '#1d3a52');
    // światło od dołu (widok od strony stóp): rozjaśnia worek i powierzchnie zwrócone ku kamerze
    var fill = new THREE.DirectionalLight('#ffffff', 0.45); fill.position.set(0, -12, 6); grp.add(fill);
    function sacUpdate(st, iCut, iTop) {
      var Pp = sacG.attributes.position.array;
      for (var i = 0; i <= NY; i++) {
        var y = ROWS[i], hp = Math.max(0, hwP(y, st) - 0.04), dE = DF + tfD(0, y) + T.tf + 0.05;
        for (var j = 0; j <= SNX; j++) {
          var u = -1 + 2 * j / SNX, sh = Math.pow(Math.max(0, 1 - u * u), 0.6), x = u * hp * (1 + (UMB ? 0.55 : 0.2) * Math.pow(sh, 0.7) * st.k), top = fatBot(x, y, st) + 0.04, dd = D2(dE) + (Math.min(D2(dE), top) - D2(dE)) * sh * st.k;
          var q = base(x, i), k = (i * (SNX + 1) + j) * 3; Pp[k] = q[0] - q[3] * dd; Pp[k + 1] = q[1] - q[4] * dd; Pp[k + 2] = q[2] - q[5] * dd;
        }
      }
      sacG.attributes.position.needsUpdate = true; sacG.computeVertexNormals(); sacG.computeBoundingSphere(); sacG.setDrawRange(iCut * SNX * 6, (iTop - iCut) * SNX * 6);
    }
    // pętle jelita: w worku (przed odprowadzeniem) i w jamie brzusznej
    var bowM = matOf(HW_COL.bowel, 1), bowels = [];
    function loopGeo(pts, r) { return track(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'centripetal'), 40, r, 10, false)); }
    if (!UMB) {
      [[-0.15, H.cut + 0.45, 0.3], [0.2, H.cut + 1.5, 0.28]].forEach(function (L0) {
        var y = L0[1], hw = hwAt(y) * 0.62, pts = [];
        for (var t = 0; t <= 8; t++) { var x = L0[0] + (-1 + 2 * t / 8) * hw, q = baseY(x, y), dd = DF - 0.1 - 0.75 * Math.sin(Math.PI * t / 8); pts.push(new V3(q[0] - q[3] * dd, y + 0.2 * Math.sin(t), q[2] - q[5] * dd)); }
        var mesh = new THREE.Mesh(loopGeo(pts, L0[2]), bowM); grp.add(mesh); bowels.push({ m: mesh, sac: true });
      });
      [[-4.4, H.cut + 0.7], [3.0, H.cut + 1.2], [-0.6, H.cut + 1.9]].forEach(function (c, ix) {
        var pts = [], R = 1.0; for (var t = 0; t <= 10; t++) { var a = t / 10 * Math.PI * 1.6; var q = baseY(c[0] + R * Math.cos(a), c[1]), dd = D2(DF + 2.0 + 0.35 * Math.sin(a + ix)); pts.push(new V3(q[0] - q[3] * dd, c[1] + R * 0.45 * Math.sin(a), q[2] - q[5] * dd)); }
        var mesh = new THREE.Mesh(loopGeo(pts, 0.32), bowM); grp.add(mesh); bowels.push({ m: mesh, sac: false, y: c[1] });
      });
    }
    // nerwy międzyżebrowe: między mięśniem skośnym wewnętrznym a poprzecznym, wnikają do mięśnia prostego przy jego brzegu bocznym
    var nerveM = matOf(HW_COL.nerve, 1), nerves = [];
    W.NV.forEach(function (nv) {
      var y = nv[0]; if (y < H.cut + 0.1 || y > YT - 0.1) return;
      [-1, 1].forEach(function (s) { var mesh = new THREE.Mesh(track(new THREE.BufferGeometry()), nerveM); grp.add(mesh); nerves.push({ m: mesh, y: y, s: s, name: nv[1] }); });
    });
    function nerveUpdate(st, cutY, topY) {
      nerves.forEach(function (N) {
        var y = N.y, s0 = semi(y), pts = [], X;
        N.m.visible = y >= cutY - 0.01 && y <= topY && !UMB;
        if (!N.m.visible) return;
        [[Wd(y) * 0.9, 0.48], [s0 + 2, 0.48], [s0 + 0.4, 0.5], [s0 - 0.25, 0.66], [s0 - 0.55, 0.5]].forEach(function (p) {
          var x0 = p[0], dd = D2(DF + p[1] + (x0 < s0 ? gR(x0, y, st) * (p[1] > 0.6 ? 1 : 0.3) : 0)); X = N.s * (x0 + hwA(y, st) * gLat(x0, y)); var q = baseY(X, y); pts.push(new V3(q[0] - q[3] * dd, y, q[2] - q[5] * dd));
        });
        if (N.m.geometry) N.m.geometry.dispose();
        N.m.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'centripetal'), 30, 0.07, 6, false);
      });
    }
    // siatka: pasmo cienkie z teksturą oczek
    // siatka: wspólny wyróżniony materiał (12-powloki: dzianina, świeci, obramowanie)
    var meshMat = wallMeshMat();
    var meshKind = op === 'tar' ? 'sub' : op === 'acs' ? (NOMESH ? null : 'on') : op === 'umb' ? 'pre' : null, meshG = [];
    function meshDomain(y, st) {
      if (meshKind === 'sub') return Wd(y) * 0.8;
      if (meshKind === 'on') return eoCutX(y) + 1.6;
      var R = H.hw + 2.0, dy = y - H.yc; return Math.abs(dy) < R ? Math.sqrt(R * R - dy * dy) : 0;
    }
    function meshDep(x0, y, st) {
      if (meshKind === 'sub') { var s0 = semi(y); if (x0 < tarX(y)) return DF + 0.7 + 0.45 * gR(x0, y, st) - 0.02; return DF + taTop(x0, y) + 0.22 + 0.4 * gT(x0, y, st); }
      if (meshKind === 'on') return DF - 0.035;
      return DF + tfD(x0, y) + T.tf + 0.1 * gPre(x0, y, st) + 0.03;
    }
    if (meshKind) [-1, 1].forEach(function (s) {
      var nx = 26, nv = (NY + 1) * (nx + 1), g = track(new THREE.BufferGeometry()), idx = [];
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nv * 3), 3)); g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(nv * 2), 2));
      for (var r = 0; r < NY; r++) for (var j = 0; j < nx; j++) { var a = r * (nx + 1) + j, b = a + nx + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
      g.setIndex(idx); var mesh = new THREE.Mesh(g, meshMat); mesh.renderOrder = 3; grp.add(mesh); meshG.push({ g: g, s: s, nx: nx, m: mesh });
    });
    var meshEdgeM = wallMeshEdgeMat(), meshEdge = meshKind ? [-1, 1].map(function (s) { var m = new THREE.Mesh(track(new THREE.BufferGeometry()), meshEdgeM), m2 = new THREE.Mesh(track(new THREE.BufferGeometry()), meshEdgeM); grp.add(m, m2); return { m: m, lat: m2, s: s }; }) : [];
    function meshUpdate(st, iCut, iTop) {
      meshEdgeM.opacity = st.mesh;
      meshEdge.forEach(function (E) {   // brzeg w płaszczyźnie przekroju i brzeg boczny siatki
        var y = ROWS[iCut], xb = meshDomain(y, st), dsp = meshKind === 'on' ? 0 : hwA(y, st), pts = [], lat = [];
        E.m.visible = E.lat.visible = st.mesh > 0.01 && xb > 0.05;
        if (!E.m.visible) return;
        for (var j = 0; j <= 20; j++) { var x0 = xb * j / 20; pts.push(ptAt(x0 + dsp * gLat(x0, y) * sm(x0 / 1.6), y + 0.02, meshDep(x0, y, st), E.s)); }
        for (var i = iCut; i <= iTop; i++) { var yi = ROWS[i], xl = meshDomain(yi, st), dl = meshKind === 'on' ? 0 : hwA(yi, st); if (xl > 0.05) lat.push(ptAt(xl + dl * gLat(xl, yi) * sm(xl / 1.6), yi, meshDep(xl, yi, st), E.s)); }
        wallMeshEdgeSet(E.m, pts, 0.07); wallMeshEdgeSet(E.lat, lat, 0.06);
      });
      meshG.forEach(function (o) {
        var Pp = o.g.attributes.position.array, U = o.g.attributes.uv.array;
        for (var i = 0; i <= NY; i++) {
          var y = ROWS[i], xb = meshDomain(y, st), dsp = meshKind === 'on' ? 0 : hwA(y, st);
          for (var j = 0; j <= o.nx; j++) {
            var x0 = xb * j / o.nx, X = o.s * (x0 + dsp * gLat(x0, y) * sm(x0 / 1.6)), dd = D2(meshDep(x0, y, st)), q = base(X, i), k = (i * (o.nx + 1) + j) * 3;
            Pp[k] = q[0] - q[3] * dd; Pp[k + 1] = q[1] - q[4] * dd; Pp[k + 2] = q[2] - q[5] * dd; U[(i * (o.nx + 1) + j) * 2] = X / 0.55; U[(i * (o.nx + 1) + j) * 2 + 1] = y / 0.55;
          }
        }
        o.g.attributes.position.needsUpdate = true; o.g.attributes.uv.needsUpdate = true; o.g.computeVertexNormals(); o.g.computeBoundingSphere();
        o.g.setDrawRange(iCut * o.nx * 6, (iTop - iCut) * o.nx * 6);
      });
    }
    /* naczynia ze wspólnego modelu ściany: nabrzuszne dolne i górne (tętnica i żyła) na tylnej powierzchni mięśnia prostego — przesuwają się z nim
       (w rozwarstwieniu zamięśniowym zostają na mięśniu); perforatory okołopępkowe — z mięśnia prostego przez pochewkę przednią do skóry;
       płat skórno-tłuszczowy (Ramirez) je przecina — zostają kikuty na powięzi i w płacie */
    var vesM = { a: wallVesselMat('a'), v: wallVesselMat('v') }, vesT = [], perfT = [];
    wallVesselsLod(0).forEach(function (v) { [-1, 1].forEach(function (s) { ['a', 'v'].forEach(function (kd) { var m = new THREE.Mesh(track(new THREE.BufferGeometry()), vesM[kd]); grp.add(m); vesT.push({ v: v, s: s, kd: kd, m: m }); }); }); });
    B.PERF.forEach(function (pf) { [-1, 1].forEach(function (s) { var a = new THREE.Mesh(track(new THREE.BufferGeometry()), vesM.a), b = new THREE.Mesh(track(new THREE.BufferGeometry()), vesM.a); grp.add(a, b); perfT.push({ p: pf, s: s, a: a, b: b }); }); });
    function vesPath(v, ya, yb) {   // odcinek naczynia w zakresie y: x i głębokość interpolowane między punktami ścieżki
      var P = v.pts.map(function (q) { return [q[0], q[1], B.depth(q[2], q[0], q[1], H.fat)]; }).sort(function (a, b) { return a[1] - b[1]; }), out = [];
      var y0 = Math.max(ya, P[0][1]), y1 = Math.min(yb, P[P.length - 1][1]); if (y1 - y0 < 0.05) return out;
      for (var n = 0, N = Math.max(2, Math.ceil((y1 - y0) / 0.25)); n <= N; n++) { var y = y0 + (y1 - y0) * n / N, i = 0; while (i < P.length - 2 && P[i + 1][1] < y) i++; var u = (y - P[i][1]) / Math.max(1e-6, P[i + 1][1] - P[i][1]); out.push([P[i][0] + (P[i + 1][0] - P[i][0]) * u, y, P[i][2] + (P[i + 1][2] - P[i][2]) * u]); }
      return out;
    }
    var perfCut = false;
    function vesUpdate(st, isCT, full, m) {
      var ya = ROWS[full || isCT ? 0 : iCutCut], yb = ROWS[full || isCT ? NY : iTopCut];
      vesT.forEach(function (T0) {
        var pts = isCT ? [] : vesPath(T0.v, ya, yb).map(function (q) { var x0 = q[0] + (T0.kd === 'v' ? 0.16 : 0); return at(x0, q[1], q[2], T0.s, st, 'A'); });
        T0.m.visible = pts.length > 1; if (T0.m.geometry) T0.m.geometry.dispose(); T0.m.geometry = pts.length > 1 ? wallTubeGeo(pts, T0.v.r * 1.6) : new THREE.BufferGeometry();
      });
      perfCut = false;
      perfT.forEach(function (P) {
        var x = P.p[0], y = P.p[1], on = !isCT && y >= ya && y <= yb; P.a.visible = P.b.visible = on; if (!on) return;
        var r = WL.rect(x, y), t0 = -bulge(x, y, st) + T.skin, fb = fatBot(x, y, st), f = gF(x, y, st), cut = f > 0.05;
        var p0 = at(x - 0.12, y, DF + r[0] + 0.85 * (r[1] - r[0]), P.s, st, 'A'), p1 = at(x - 0.04, y, DF + 0.03, P.s, st, 'A'), p2 = at(x + 0.06, y, t0 + 0.55 * (fb - t0) - f, P.s, st), p3 = at(x + 0.2, y, t0 + 0.12 * (fb - t0) - f, P.s, st);
        if (P.a.geometry) P.a.geometry.dispose(); if (P.b.geometry) P.b.geometry.dispose();
        if (!cut) { P.a.geometry = wallTubeGeo([p0, p1, p2, p3], 0.06, 24); P.b.geometry = new THREE.BufferGeometry(); return; }
        perfCut = true;   // płat uniesiony: kikut na powięzi i kikut w płacie
        P.a.geometry = wallTubeGeo([p0, p1, at(x - 0.02, y, DF - 0.12, P.s, st, 'A')], 0.06, 12); P.b.geometry = wallTubeGeo([at(x + 0.04, y, fb - f + 0.12, P.s, st), p2, p3], 0.06, 12);
      });
    }
    // linie: cięcie skóry, nacięcia (pochewka tylna w Rives–Stoppa i TAR, rozcięgno skośnego zewnętrznego), szwy (warstwa tylna, linia biała, skóra), dreny
    var lineM = matOf(A.COL.cut, 1), sutM = matOf(HW_COL.suture, 1), drainM = matOf(HW_COL.drain, 1);
    function tube(pts, r, mat) { var m = new THREE.Mesh(track(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'centripetal'), Math.max(16, pts.length * 4), r, 6, false)), mat); grp.add(m); return m; }
    function ptAt(x0, y, dd, s, dsp) { var X = s * (x0 + (dsp || 0)), q = baseY(X, y); dd = D2(dd); return new V3(q[0] - q[3] * dd, y, q[2] - q[5] * dd); }
    var st0 = stateAt(0), incLine, incYa = H.cut, incYb = UMB ? H.cut : Math.min(YT, INC[1], H.cut + H.slab);
    if (UMB) { var ap = []; for (var ai = 0; ai <= 24; ai++) { var th = Math.PI + Math.PI * ai / 24, xx = 1.35 * Math.cos(th), yy = H.yc + 1.35 * Math.sin(th); ap.push(ptAt(Math.abs(xx), yy, -bulge(xx, yy, st0) - 0.03, xx < 0 ? -1 : 1)); } incLine = tube(ap, 0.06, lineM); }
    else { var lp = []; for (var li = 0; li <= 20; li++) { var y1 = incYa + (incYb - incYa) * li / 20; lp.push(ptAt(0, y1, -bulge(0, y1, st0) - 0.03, 1)); } incLine = tube(lp, 0.06, lineM); }
    // pionowe linie (wzdłuż y) na danej głębokości: nacięcia i szwy ciągłe
    function vline(fx, fd, s, mat, r, zig) {
      var pts = [], n = 28; for (var i = 0; i <= n; i++) { var y = incYa + (incYb - incYa) * i / n; pts.push(ptAt(fx(y) + (zig ? zig * (i % 2 ? 1 : -1) : 0), y, fd(y), s)); }
      return tube(pts, r, mat);
    }
    var rrCut = [], tarCut = [], eoCut = [];
    [-1, 1].forEach(function (s) {
      if (op === 'tar') {
        rrCut.push(vline(function (y) { return RM + 0.15 + hwAt(y); }, function () { return DF + 0.69; }, s, lineM, 0.05));
        tarCut.push(vline(function (y) { return tarX(y) + hwAt(y); }, function () { return DF + 0.69; }, s, lineM, 0.05));
      }
      if (op === 'acs') eoCut.push(vline(function (y) { return eoCutX(y) + hwAt(y) * gLat(eoCutX(y), y); }, function () { return DF - 0.02; }, s, lineM, 0.05));
    });
    var postSut = null, albaSut = null, skinSut = null, drains = [];
    if (!UMB) {
      if (op === 'tar') postSut = vline(function () { return 0; }, function (y) { return DF + tfD(0, y) - 0.05; }, 1, sutM, 0.045, 0.12);
      albaSut = vline(function () { return 0; }, function () { return DF + 0.3; }, 1, sutM, 0.05, 0.14);
      skinSut = vline(function () { return 0; }, function () { return -0.02; }, 1, sutM, 0.04, 0.1);
      [-1, 1].forEach(function (s) {
        var y = H.cut + 1.6, dIn = op === 'tar' ? DF + 0.62 : DF - 0.3, pts = [ptAt(1.2, y + 1.0, dIn, s), ptAt(3.5, y + 0.4, dIn, s), ptAt(semi(y) + 1.2, y - 0.6, op === 'tar' ? DF + 0.3 : DF - 0.35, s), ptAt(semi(y) + 2.2, y - 1.0, -0.6, s)];
        drains.push(tube(pts, 0.11, drainM));
      });
    } else {
      albaSut = new THREE.Group(); grp.add(albaSut);   // szwy węzełkowe w poprzek zamkniętego pierścienia
      [0.12, 0.42, 0.72].forEach(function (dy) { var t = new THREE.Mesh(track(new THREE.TorusGeometry(0.17, 0.03, 6, 18)), sutM), y = H.yc + dy; t.position.copy(ptAt(0, y, DF + 0.3, 1)); t.rotation.x = Math.PI / 2; albaSut.add(t); });
      // pępkowa: szew skóry (łuk pod pępkiem) leży poniżej przekroju — niewidoczny w kadrach z przekrojem
    }
    // etykiety
    function lab(name, sub, col, kind, fn, when) { var L = { el: mkLabel(name, sub, col, kind), fn: fn, when: when, alpha: 0 }; labels.push(L); return L; }
    function at(x0, y, dd, s, st, lay) { var dsp = lay === 'A' ? hwA(y, st) * gLat(x0, y) : lay === 'P' ? hwP(y, st) * gLat(x0, y) : 0; return ptAt(x0, y, dd, s == null ? -1 : s, dsp); }
    var yL = function () { return H.cut + 0.02; }, NORM = function (st, m) { return m <= 0.001; };
    if (!UMB) {
      lab('Skóra', '', HW_COL.skin, 'ghost', function (st) { return at(8.6, yL(), 0.05, -1, st); }, NORM);
      lab('Tkanka podskórna', '', '#c9a640', 'ghost', function (st) { return at(7.2, yL(), DF * 0.55, -1, st); }, NORM);
      lab('Mięsień prosty brzucha', '', HW_COL.rect, 'seg', function (st) { var y = yL(); return at((RM + semi(y)) / 2, y, DF + 0.37, -1, st, 'A'); }, function (st, m) { return m < 1.05 || (m > 5.6); });
      lab('Pochewka przednia', '', '#9b8f78', 'ghost', function (st) { var y = yL(); return at(semi(y) - 0.6, y, DF + 0.02, 1, st, 'A'); }, NORM);
      lab('Linia biała — brzeg ubytku', '', '#9b8f78', 'ghost', function (st) { var y = yL(); return at(0.25, y, DF + 0.35, 1, st, 'A'); }, NORM);
      lab('Kresa półksiężycowata', '', '#9b8f78', 'ghost', function (st) { var y = yL(); return at(semi(y) + 0.05, y, DF + 0.4, 1, st, 'A'); }, NORM);
      lab('Mięsień skośny zewnętrzny', '', HW_COL.eo, 'ghost', function (st) { var y = yL(); return at(semi(y) + 3.2, y, DF + 0.08, 1, st, 'A'); }, function (st, m) { return m <= 0.001 || (op === 'acs' && m > 1.95 && m < 4.05); });
      lab('Mięsień skośny wewnętrzny', '', HW_COL.io, 'ghost', function (st) { var y = yL(); return at(semi(y) + 4.0, y, DF + 0.36, 1, st, 'A'); }, NORM);
      lab('Mięsień poprzeczny brzucha', '', HW_COL.ta, 'ghost', function (st) { var y = yL(); return at(semi(y) + 4.8, y, DF + 0.62, 1, st, 'A'); }, function (st, m) { return m <= 0.001 || (op === 'tar' && m > 1.95 && m < 3.05); });
      lab('Pochewka tylna', '', '#9b8f78', 'ghost', function (st) { var y = yL(); return at(2.2, y, DF + 0.73 + gR(2.2, y, st), -1, st, 'P'); }, function (st, m) { return m <= 0.001 || (m > 0.95 && m < 2.05); });
      lab('Otrzewna', '', HW_COL.per, 'ghost', function (st) { var y = yL(); return at(4.5, y, DF + tfD(4.5, y) + 0.25 + gR(4.5, y, st) + gT(4.5, y, st), -1, st, 'P'); }, NORM);
      lab('Worek przepuklinowy', 'z pętlami jelita', HW_COL.per, 'seg', function (st) { var y = yL(); return at(0, y, fatBot(0, y, st) + 0.1, 1, st); }, function (st, m) { return m < 0.6; });
      lab('Naczynia nabrzuszne dolne', 'zostają na mięśniu prostym', HW_COL.art, 'seg', function (st) { var y = yL() + 0.15, x = 4.35; return at(x, y, B.depth(['post', 0, -0.03], x, y, H.fat), 1, st, 'A'); }, function (st, m) { return op === 'tar' && m > 1.3 && m < 2.05; });
      lab('Perforatory okołopępkowe', 'przecięte przy uniesieniu płatów', HW_COL.art, 'seg', function (st) { var x = B.PERF[0][0], y = B.PERF[0][1]; return at(x, y, DF - 0.05, 1, st, 'A'); }, function (st, m) { return op === 'acs' && m > 1.5 && m < 2.05 && perfCut; });
      lab('Przestrzeń zamięśniowa', 'Rives–Stoppa', HW_COL.cut, 'seg', function (st) { var y = yL(); return at(2.4, y, DF + 0.7, 1, st, 'A'); }, function (st, m) { return op === 'tar' && m > 1.45 && m < 2.05; });
      lab('Nerwy międzyżebrowe', 'wnikają do mięśnia prostego przy jego brzegu bocznym', HW_COL.nerve, 'seg', function (st) { var y = -5.5; return at(semi(y) - 0.2, y, DF + 0.62 + gR(semi(y) - 0.2, y, st), 1, st, 'A'); }, function (st, m) { return op === 'tar' && m > 1.5 && m < 3.05; });
      lab('Mięsień poprzeczny przecięty', '', HW_COL.ta, 'seg', function (st) { var y = yL(); return at(tarX(y) + 0.3, y, DF + taTop(tarX(y), y) + 0.1, 1, st, 'A'); }, function (st, m) { return op === 'tar' && m > 2.5 && m < 3.05; });
      lab('Przestrzeń przed powięzią poprzeczną', '', HW_COL.cut, 'seg', function (st) { var y = yL(); return at(semi(y) + 3, y, DF + taTop(semi(y) + 3, y) + 0.32, 1, st, 'A'); }, function (st, m) { return op === 'tar' && m > 2.6 && m < 3.05; });
      lab('Szew warstwy tylnej', 'w linii pośrodkowej', HW_COL.suture, 'seg', function (st) { var y = yL(); return at(0, y, DF + tfD(0, y), 1, st); }, function (st, m) { return op === 'tar' && m > 3.7 && m < 4.05; });
      if (meshKind) lab('Siatka', meshKind === 'sub' ? 'za mięśniami (sublay)' : 'na powięzi (onlay)', HW_COL.mesh, 'seg', function (st) { var y = yL(); return at(3.2, y, meshDep(3.2, y, st), 1, st, 'A'); }, function (st, m) { return m > 4.4 && m < 5.05; });
      lab('Linia biała odtworzona', op === 'tar' ? 'szew nad siatką' : 'szew w linii pośrodkowej', HW_COL.suture, 'seg', function (st) { var y = yL(); return at(0, y, DF + 0.3, 1, st); }, function (st, m) { return (op === 'tar' && m > 5.55) || (op === 'acs' && m > 3.7 && m < 4.05); });
      lab('Płat skórno-tłuszczowy', '', '#c9a640', 'seg', function (st) { var y = yL(); return at(3.4, y, DF * 0.5 - gF(3.4, y, st), 1, st); }, function (st, m) { return op === 'acs' && m > 1.5 && m < 2.05; });
      lab('Nacięcie rozcięgna skośnego zewnętrznego', '1–2 cm bocznie od kresy półksiężycowatej', HW_COL.cut, 'seg', function (st) { var y = yL(); return at(eoCutX(y), y, DF - 0.02, 1, st, 'A'); }, function (st, m) { return op === 'acs' && m > 2.2 && m < 3.05; });
      lab('Szczelina po przecięciu rozcięgna', '', HW_COL.eo, 'seg', function (st) { var y = yL(); return at(eoCutX(y) + 0.3, y, DF - 0.02, 1, st, 'A'); }, function (st, m) { return op === 'acs' && m > 3.6 && m < 4.05; });
      lab('Dreny', '', '#7d8b96', 'seg', function (st) { return drains[0].geometry.parameters.path.getPointAt(0.85); }, function (st, m) { return m > (NOMESH ? 4.75 : 5.75); });
    } else {
      lab('Pępek', '', '#8a5f50', 'ghost', function (st) { return at(0.9, H.yc - 0.4, -bulge(0.9, H.yc - 0.4, st), -1, st); }, NORM);
      lab('Worek przepuklinowy', 'tłuszcz przedotrzewnowy i sieć', '#c9a640', 'seg', function (st) { var y = yL(); return at(0, y, fatBot(0, y, st) + 0.1, 1, st); }, function (st, m) { return m < 1.05; });
      lab('Pierścień pępkowy (ubytek)', '', '#9b8f78', 'seg', function (st) { var y = yL(); return at(0.2, y, DF + 0.3, 1, st, 'A'); }, NORM);
      lab('Mięsień prosty brzucha', '', HW_COL.rect, 'ghost', function (st) { var y = yL(); return at(2.6, y, DF + 0.37, -1, st, 'A'); }, NORM);
      lab('Tkanka podskórna', '', '#c9a640', 'ghost', function (st) { var y = yL(); return at(4.4, y, DF * 0.5, -1, st); }, NORM);
      lab('Otrzewna', '', HW_COL.per, 'ghost', function (st) { var y = yL(); return at(4.2, y, DF + tfD(4.2, y) + 0.25 + gPre(4.2, y, st), 1, st, 'P'); }, function (st, m) { return m <= 0.001 || (m > 1.6 && m < 2.05); });
      lab('Cięcie pod pępkiem', 'łukowate', HW_COL.cut, 'cut', function (st) { return at(0.6, H.yc - 1.45, -0.05, -1, st); }, function (st, m) { return m > 0.2 && m < 1.05; });
      lab('Przestrzeń przedotrzewnowa', '', HW_COL.cut, 'seg', function (st) { var y = yL(); return at(2.0, y, DF + tfD(2, y) + 0.2, -1, st, 'P'); }, function (st, m) { return op === 'umb' && m > 1.6 && m < 2.05; });
      lab('Siatka przedotrzewnowa', '', HW_COL.mesh, 'seg', function (st) { var y = yL(); return at(1.8, y, meshDep(1.8, y, st), 1, st); }, function (st, m) { return op === 'umb' && m > 2.4 && m < 3.05; });
      lab(op === 'umb' ? 'Szew powięzi nad siatką' : 'Szew ubytku', '', HW_COL.suture, 'seg', function (st) { var y = yL(); return at(0, y, DF + 0.3, 1, st); }, function (st, m) { return m > (op === 'umb' ? 3.5 : 2.5); });
    }
    var lastKey = '', cutY = H.cut;
    var tool = { d: d, grp: grp, overlay: false, labels: labels,
      update: function (m) {
        var fr = FR[S.frame] || {}, isCT = fr.kind === 'ct', full = isCT || fr.wall === 'full', st = stateAt(isCT ? 0 : m), iCut = full ? 0 : iCutCut, iTop = full ? NY : iTopCut;
        cutY = ROWS[iCut];
        var key = m.toFixed(4) + (isCT ? 't' : full ? 'f' : 'c');
        if (key !== lastKey) {
          lastKey = key;
          bands.forEach(function (o) { bandUpdate(o, st, iCut, iTop); });
          sacUpdate(st, iCut, iTop); meshUpdate(st, iCut, iTop); nerveUpdate(st, cutY, ROWS[iTop]); vesUpdate(st, isCT, fr.wall === 'full', m);
        }
        var fa = st.fade;
        bands.forEach(function (o) { if (o.L.space) { var fm = 1 - 0.85 * st.mesh; o.mat.opacity = 0.35 * fm; o.cmat.opacity = 0.55 * fm; return; } var f = o.L.fade != null ? 1 - (1 - o.L.fade) * fa : 1; o.mat.opacity = o.cmat.opacity = o.emat.opacity = f; o.mat.depthWrite = o.cmat.depthWrite = o.emat.depthWrite = f > 0.99; });
        sacM.opacity = 0.9 * st.sac; sac.visible = st.sac > 0.01;
        meshMat.opacity = st.mesh; meshG.forEach(function (o) { o.m.visible = st.mesh > 0.01; });
        bowels.forEach(function (b) {
          if (b.sac) { b.m.visible = st.k > 0.03; b.m.position.set(0, 0, -2.4 * (1 - st.k)); }
          else b.m.visible = !isCT && m < 1.0 && b.y >= cutY - 0.3 && b.y <= ROWS[iTop];
        });
        if (isCT) bowels.forEach(function (b) { b.m.visible = false; });
        incLine.visible = st.inc > 0 && (UMB ? m < 1.05 : st.open < 0.95) && !isCT; incLine.geometry.setDrawRange(0, Math.round(st.inc * incLine.geometry.parameters.tubularSegments) * 6 * 6);
        rrCut.forEach(function (t) { t.visible = op === 'tar' && m > 1.0 && m < 2.4; });
        tarCut.forEach(function (t) { t.visible = op === 'tar' && st.tarCut > 0 && m < 3.2; t.geometry.setDrawRange(0, Math.round(st.tarCut * t.geometry.parameters.tubularSegments) * 6 * 6); });
        eoCut.forEach(function (t) { t.visible = op === 'acs' && st.eoCut > 0 && m < 3.1; t.geometry.setDrawRange(0, Math.round(st.eoCut * t.geometry.parameters.tubularSegments) * 6 * 6); });
        if (postSut) postSut.visible = st.cP > 0.85 && !isCT;
        if (albaSut) albaSut.visible = st.cA > 0.85 && !isCT;
        if (skinSut) skinSut.visible = st.close > 0.9 && !isCT;
        drains.forEach(function (t) { t.visible = st.drain > 0.5 && !isCT; });
        labels.forEach(function (L) { L.anchor = L.fn(st); L.alpha = !isCT && L.when(st, m) ? 1 : 0; });
      } };
    // TK: przekrój poprzeczny (rysunek 2D), pomiar RDR, objętości worka i jamy brzusznej
    if (d.op === 'tar' || d.op === 'acs') M.ctCustom = { yMax: H.yc + H.hl + 1.8, yMin: -14.2, y0: H.yc, draw: function (g, cw, ch, dpr, y) { hwDrawCT(g, cw, ch, dpr, y, { H: H, DF: DF, D2: D2, semi: semi, Wd: Wd, hwAt: hwAt, gLat: gLat, fatBot: fatBot, bulge: bulge, tfD: tfD, taTop: taTop, eoTh: eoTh, st: stateAt(0) }); } };
    tool.test = { hwA: function (m) { return hwA(H.cut, stateAt(m)); }, cutY: H.cut };   // testy (ui_51)
    M.wall = tool;
    return tool;
  }
  TOOL_EXT.wall = makeWall;
  function hwFmt(x, n) { var s = x.toFixed(n == null ? 1 : n); return LANG === 'en' ? s : s.replace('.', ','); }
  var HW_VOL = null;
  function hwDrawCT(g, cw, ch, dpr, y, C) {
    var Bo = A.BODY, WL = A.WALL, H = C.H, DF = C.DF, st = C.st, zc = 0.3, BB = 6.0;
    var s = Math.min(cw / 27, ch / 15.5), cx = cw / 2, cy = ch / 2 - 0.6 * s;
    function P(x, z) { return [cx + x * s, cy - (z - zc) * s]; }
    function hu(v) { var q = Math.max(0, Math.min(1, (v + 160) / 400)), c = Math.round(q * 255); return 'rgb(' + c + ',' + c + ',' + c + ')'; }
    function pt(X, dd) { var p = Bo.at(X, y, 0, 0), n = Bo.nrm(X, y, 0); dd = C.D2(dd); return [p.x - n.x * dd, p.z - n.z * dd]; }
    function poly(arr, fill) { g.beginPath(); arr.forEach(function (q, i) { var p = P(q[0], q[1]); if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.closePath(); g.fillStyle = fill; g.fill(); }
    function E(x, z, a, b, fill) { var p = P(x, z); g.beginPath(); g.ellipse(p[0], p[1], Math.max(0.1, a * s), Math.max(0.1, b * s), 0, 0, Math.PI * 2); g.fillStyle = fill; g.fill(); }
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#000'; g.fillRect(0, 0, cw, ch);
    var Wy = Bo.W(y), hw = C.hwAt(y), s0 = C.semi(y);
    // obrys ciała: przód — skóra z uwypukleniem przepukliny, tył — półelipsa
    var outline = [];
    for (var i = 0; i <= 80; i++) { var x = -Wy + 2 * Wy * i / 80, b = C.bulge(x, y, st); outline.push(pt(x, -b)); }
    for (var j = 1; j < 40; j++) { var th = Math.PI * j / 40; outline.push([Wy * Math.cos(th), zc - BB * Math.sin(th)]); }
    poly(outline, hu(-100));
    // wnętrze jamy brzusznej (za otrzewną): tłuszcz krezki
    var cav = [];
    for (var k = 0; k <= 60; k++) { var x2 = -(Wy - 1.0) + 2 * (Wy - 1.0) * k / 60, xa = Math.abs(x2), dd = DF + C.tfD(Math.max(0, xa - hw), y) + 0.25; cav.push(pt(x2, dd)); }
    for (var j2 = 1; j2 < 40; j2++) { var th2 = Math.PI * j2 / 40; cav.push([(Wy - 1.0) * Math.cos(th2), zc - (BB - 1.4) * Math.sin(th2)]); }
    poly(cav, hu(-85));
    // mięśnie i powięzi (po obu stronach)
    [-1, 1].forEach(function (sd) {
      function band(xa, xb, fd, v, n) { var top = [], bot = []; for (var q = 0; q <= n; q++) { var x0 = xa + (xb - xa) * q / n, dd = fd(x0), X = sd * (x0 + hw * C.gLat(x0, y)); top.push(pt(X, dd[0])); bot.push(pt(X, dd[1])); } poly(top.concat(bot.reverse()), hu(v)); }
      band(0, Bo.RECT_MED, function () { return [DF + 0.04, DF + 0.7]; }, 70, 3);
      band(Bo.RECT_MED, s0, function (x0) { var q = Math.max(0.22, sm((x0 - Bo.RECT_MED) / 0.7) * sm((s0 - x0) / 0.7)); return [DF + 0.37 - 0.31 * q, DF + 0.37 + 0.31 * q]; }, 55, 20);
      band(0, Wy * 0.97, function (x0) { return [DF, DF + C.eoTh(x0, y)]; }, 60, 40);
      band(s0 + 0.04, Wy * 0.97, function (x0) { var u = sm((x0 - s0) / 0.8); return [DF + 0.06 + 0.16 * u, DF + 0.66 - 0.18 * u]; }, 55, 30);
      band(Math.min(s0 - 0.15, s0 - WL.taMed(y)), Wy * 0.97, function (x0) { var t0 = C.taTop(x0, y); return [DF + t0, DF + t0 + 0.2]; }, 52, 30);
      if (y > WL.ARC) band(0, s0 + 0.1, function () { return [DF + 0.7, DF + 0.75]; }, 70, 10);
    });
    // worek przepuklinowy z pętlami jelita (kontrast)
    if (hw > 0.05) {
      var sacP = [];
      for (var q2 = 0; q2 <= 30; q2++) { var u = -1 + 2 * q2 / 30, x3 = u * hw, dE = DF + C.tfD(0, y) + 0.1, top = C.fatBot(x3, y, st) + 0.05, sh = Math.pow(Math.max(0, 1 - u * u), 0.6); sacP.push(pt(x3, dE + (Math.min(dE, top) - dE) * sh)); }
      poly(sacP, hu(-85));
      var nL = Math.max(1, Math.round(hw / 1.4));
      for (var b2 = 0; b2 < nL; b2++) { var xb = -hw * 0.55 + (nL > 1 ? 1.1 * hw * b2 / (nL - 1) : hw * 0.55), zz = pt(xb, DF - 0.25 - 0.4 * Math.sin(b2 + 1)); E(zz[0], zz[1], 0.5, 0.42, hu(95)); E(zz[0], zz[1], 0.34, 0.27, hu(380)); }
    }
    // jama brzuszna: pętle jelita, kręgosłup, mięśnie lędźwiowe i przykręgosłupowe, aorta, IVC
    var zs = zc - BB + 2.4;
    [[-4.5, 1.2], [-1.5, 2.6], [2.0, 2.1], [5.0, 0.8], [-6.5, -1.0], [6.8, -1.2], [0.4, 0.2], [-3.0, -1.0], [3.2, -0.9]].forEach(function (c, ix) { var r = 0.62 + 0.08 * (ix % 3); E(c[0], c[1], r, r * 0.85, hu(95)); E(c[0], c[1], r * 0.68, r * 0.55, hu(ix % 2 ? 380 : 10)); });
    E(-2.6, zs - 1.0, 1.9, 1.3, hu(55)); E(2.6, zs - 1.0, 1.9, 1.3, hu(55)); E(0, zs, 1.7, 1.55, hu(650)); E(0, zs, 1.05, 0.95, hu(260)); E(0, zs - 1.9, 0.55, 0.9, hu(650));
    if (y < -2) { E(-2.9, zs + 0.7, 1.4, 1.1, hu(55)); E(2.9, zs + 0.7, 1.4, 1.1, hu(55)); }
    if (y > -6.5) { E(0.9, zs + 2.1, 0.7, 0.7, hu(190)); E(-1.8, zs + 2.4, 0.7, 0.6, hu(150)); }
    else { E(1.6, zs + 2.2, 0.45, 0.45, hu(190)); E(-1.6, zs + 2.2, 0.45, 0.45, hu(190)); }
    // pomiary: szerokość ubytku i obu mięśni prostych (RDR, Love i wsp. 2021) — na poziomie największej szerokości ubytku pokazane zawsze w tabelce
    var R0 = WL.rdr(H, H.yc), Rh = WL.rdr(H, y);
    g.lineWidth = Math.max(1, 1.6 * dpr); g.font = Math.round(12 * dpr) + 'px "Atkinson Hyperlegible", system-ui, sans-serif'; g.textBaseline = 'middle';
    function caliper(x1, x2, z, text, col) {
      var a = P(x1, z), b = P(x2, z); g.strokeStyle = col; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]);
      [a, b].forEach(function (p) { g.moveTo(p[0], p[1] - 5 * dpr); g.lineTo(p[0], p[1] + 5 * dpr); }); g.stroke();
      var w = g.measureText(text).width, mx = (a[0] + b[0]) / 2 - w / 2; g.fillStyle = 'rgba(0,0,0,0.6)'; g.fillRect(mx - 3 * dpr, a[1] - 20 * dpr, w + 6 * dpr, 15 * dpr); g.fillStyle = col; g.fillText(text, mx, a[1] - 12.5 * dpr);
    }
    if (hw > 0.05) {
      // pomiar na wysokości środka mięśni prostych (przekrój poziomy w schemacie): ubytek między przyśrodkowymi brzegami, mięśnie od brzegu przyśrodkowego do bocznego
      var zr = pt(hw + (Bo.RECT_MED + s0) / 2, DF + 0.37)[1], ze = pt(hw, DF + 0.3)[1];
      caliper(-hw, hw, ze, hwFmt(Rh.defect) + ' cm', '#ff8a65');
      caliper(-(hw + Bo.RECT_MED), -(hw + s0), zr, hwFmt(Rh.rectus) + ' cm', '#ffe066');
      caliper(hw + Bo.RECT_MED, hw + s0, zr, hwFmt(Rh.rectus) + ' cm', '#ffe066');
    }
    // objętości (raz): worek przepuklinowy i jama brzuszna z sumy pól przekrojów
    if (!HW_VOL) {
      var vS = 0, vC = 0, dy = 0.1, cm3 = Math.pow(WL.CM, 3);
      for (var yy = -15.2; yy <= 8.6; yy += dy) {
        var Wv = Bo.W(yy) - 1.0, dv = (Bo.D(yy) + BB) / 2 - 0.9; vC += Math.PI * Wv * dv * dy;
        var hv = C.hwAt(yy); if (hv > 0) { var hS = DF + C.tfD(0, yy) + 0.1 - C.fatBot(0, yy, st); vS += Math.PI / 4 * 2 * hv * Math.max(0, hS) * dy; }
      }
      HW_VOL = { sac: vS * cm3 / 1000, cav: vC * cm3 / 1000 };
    }
    var V = HW_VOL, sab = V.sac / (V.sac + V.cav) * 100, tan = V.sac / V.cav * 100;
    var lines = [
      [tr('RDR — szerokość obu mięśni prostych / szerokość ubytku'), '#ffe066'],
      ['(' + hwFmt(R0.rectus) + ' + ' + hwFmt(R0.rectus) + ') / ' + hwFmt(R0.defect) + ' = ' + hwFmt(R0.ratio, 2) + tr(' — na poziomie największej szerokości ubytku'), '#ffe066'],
      [tr('RDR < 1: w ok. 79% potrzebne dodatkowe uwolnienie (TAR, rozdzielenie komponentów); RDR > 2: w ok. 90% powięź zamyka się bez niego (Love i wsp. 2021)'), '#cfd8dc'],
      [tr('Utrata domeny (LoD) — metoda Sabbagha (konsensus Delphi): worek / (worek + jama brzuszna)'), '#9fd8ff'],
      [tr('Worek ≈ ') + hwFmt(V.sac, 2) + tr(' l, jama brzuszna ≈ ') + hwFmt(V.cav, 1) + ' l → ' + hwFmt(sab, 0) + '% ' + tr('(≥ 20%: zamknięcie powięzi bez napięcia mało prawdopodobne)'), '#9fd8ff'],
      [tr('Tanaka: worek / jama brzuszna = ') + hwFmt(tan, 0) + '% ' + tr('(≥ 25%: utrata domeny — rozważyć np. odmę przedoperacyjną, toksynę botulinową)'), '#9fd8ff']
    ];
    var fs = Math.round(11.5 * dpr), lh = 15 * dpr; g.font = fs + 'px "Atkinson Hyperlegible", system-ui, sans-serif';
    var maxW = cw - 70 * dpr;   // prawy margines: przycisk uwag nad widokiem
    function wrap(t) { var words = t.split(' '), out = [], cur = ''; words.forEach(function (w) { var c2 = cur ? cur + ' ' + w : w; if (g.measureText(c2).width > maxW && cur) { out.push(cur); cur = w; } else cur = c2; }); if (cur) out.push(cur); return out; }
    var rows = []; lines.forEach(function (L) { wrap(L[0]).forEach(function (t) { rows.push([t, L[1]]); }); });
    var y0 = ch - rows.length * lh - 8 * dpr; g.fillStyle = 'rgba(0,0,0,0.7)'; g.fillRect(0, y0 - 6 * dpr, cw, ch - y0 + 6 * dpr);
    rows.forEach(function (r, i) { g.fillStyle = r[1]; g.fillText(r[0], 8 * dpr, y0 + i * lh + lh / 2); });
    g.fillStyle = '#9aa'; g.font = Math.round(13 * dpr) + 'px "Atkinson Hyperlegible", system-ui, sans-serif'; g.fillText(tr('P'), 8 * dpr, 16 * dpr); g.fillText('L', cw - 16 * dpr, 16 * dpr);
  }
