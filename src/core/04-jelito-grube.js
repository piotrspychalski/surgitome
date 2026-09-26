  /* =====================================================================
     JELITO GRUBE
     ===================================================================== */
  var COLON = [[-7.0, -9.6, 0.6], [-7.4, -7.5, 0.4], [-7.6, -4, 0.2], [-7.4, -0.5, 0], [-7.0, 3, 0], [-6.2, 5.6, 0.2], [-4.4, 5.8, 1.6], [-2, 4.2, 2.6], [0.6, 3.4, 2.8],
    [3.2, 4.4, 2.4], [5.6, 6.6, 1], [7.2, 7.4, -0.4], [7.9, 5, -0.8], [8, 1, -0.8], [7.8, -3, -0.6], [7.2, -6.4, -0.2], [5.4, -8.8, 1], [2.6, -8.2, 2.2], [0.4, -9.6, 2.4],
    [0.6, -12, 1.4], [0.4, -14, -0.6], [0, -16.2, -1.4], [0, -18.2, -1.0], [0, -19.6, 0.4]];
  var C_COL = curveOf(COLON);
  function ct(p) { return nearestT(C_COL, p, 1500); }
  var COL_R = profile([[0, 0.05], [0.012, 1.7], [0.04, 1.9], [ct([-7.4, -0.5, 0]), 1.7], [ct([-6.2, 5.6, 0.2]), 1.5], [ct([0.6, 3.4, 2.8]), 1.35], [ct([7.2, 7.4, -0.4]), 1.25],
    [ct([8, 1, -0.8]), 1.15], [ct([7.2, -6.4, -0.2]), 1.05], [ct([2.6, -8.2, 2.2]), 1.0], [ct([0.6, -12, 1.4]), 1.05], [ct([0, -16.2, -1.4]), 1.6], [ct([0, -18.2, -1.0]), 0.9], [1, 0.5]]);
  var TI = [[4.0, -5.2, 0.8], [1.2, -6.2, 1.4], [-2.0, -7.2, 1.4], [-4.4, -7.8, 1.0], [-6.0, -7.9, 0.6]];
  var C_TI = curveOf(TI);
  var APP = [[-6.9, -9.2, 0.6], [-6.8, -10.8, 0.7], [-6.2, -12.2, 0.9], [-5.4, -13.2, 1.2]];
  var APP_R = profile([[0, 0.3], [0.85, 0.28], [1, 0.05]]);
  var MUC_C = '#eab9a3', COLC = { colon: '#c98f6b', ti: '#d9929f', app: '#c77f8e', rect: '#b9786a' };
  var ICV = [-5.9, -7.9, 0.6];
  var COL_LABELS = [['Kątnica', 0.02], ['Okrężnica wstępująca', ct([-7.4, -0.5, 0])], ['Poprzecznica', ct([0.6, 3.4, 2.8])], ['Okrężnica zstępująca', ct([8, 1, -0.8])],
    ['Esica', ct([2.6, -8.2, 2.2])], ['Odbytnica', ct([0, -16.2, -1.4])]];
  function colObj(id, t0, t1, extra) {
    var o = { id: id, name: extra.name, pre: sub(C_COL, COL_R, t0, t1, Math.max(12, Math.round(90 * (t1 - t0)))), color: COLC.colon, mucosa: 'haustra', tint: MUC_C, labels: [] };
    COL_LABELS.forEach(function (lb) { if (lb[1] > t0 + 0.01 && lb[1] < t1 - 0.01) o.labels.push(L(lb[0], (lb[1] - t0) / (t1 - t0), extra.win || ALL)); });
    for (var k in extra) if (k !== 'win') o[k] = extra[k];
    return o;
  }
  function tiObj(extra) {
    var o = { id: 'ti', name: 'Jelito kręte', pre: { path: TI, r: flat(0.9) }, color: COLC.ti, mucosa: 'circular', tint: MUC.bowel, labels: [L('Jelito kręte (końcowy odcinek)', 0.35, ALL)] };
    for (var k in extra) o[k] = extra[k]; return o;
  }
  function appObj(extra) {
    var o = { id: 'app', name: 'Wyrostek robaczkowy', pre: { path: APP, r: APP_R }, color: COLC.app, mucosa: 'smooth', tint: MUC_C, labels: [L('Wyrostek', 0.7, PRE)] };
    for (var k in extra) o[k] = extra[k]; return o;
  }
  var COL_TEXT = {
    normal: ['Jelito grube: anatomia prawidłowa', 'Końcowy odcinek jelita krętego, kątnica, okrężnica, esica i odbytnica.'],
    top: 'Z góry widać, które odcinki leżą z przodu (poprzecznica, esica), a które przy tylnej ścianie.'
  };

  /* ---------- Prawostronna hemikolektomia ---------- */
  var tR = ct([-2.0, 4.2, 2.6]), tI = nearestT(C_TI, [0.2, -6.6, 1.4]);
  var TI_KEEP = sub(C_TI, flat(0.9), 0, tI, 16), TI_CUT = sub(C_TI, flat(0.9), tI, 1, 12);
  var COL_KEEP = sub(C_COL, COL_R, tR, 1, 80);
  var ILE_ISO = [[4.0, -5.2, 0.8], [1.6, -3.8, 2.0], [-1.4, -2.0, 2.9], [-3.6, 0.6, 3.4], [-3.2, 2.5, 3.6], [-1.8, 3.0, 3.8], [0.6, 2.2, 4.0], [2.4, 2.8, 3.7]];
  var ILE_ANTI = [[4.0, -5.2, 0.8], [3.8, -2.4, 2.2], [3.0, 0.4, 3.4], [1.6, 2.2, 3.9], [-0.8, 2.9, 4.0], [-3.2, 3.2, 3.8]];
  var COL_ANTI = { path: [[-3.3, 4.6, 2.4]].concat(COL_KEEP.path), r: function (t) { return t < 0.02 ? 0.06 + (1.35 - 0.06) * sm01(t / 0.02) : COL_KEEP.r(t); } };
  var COL_ISO = { path: COL_KEEP.path, r: function (t) { return t < 0.02 ? 0.06 + (COL_KEEP.r(t) - 0.06) * sm01(t / 0.02) : COL_KEEP.r(t); } };
  var RH_OFF = [[1.15, [0, 0, 0]], [1.9, [-7, -1, 5]]];
  function rhAnat(iso) {
    var ile = iso ? ILE_ISO : ILE_ANTI;
    var marks = [
      ringOn(C_COL, COL_R, tR, { name: 'Przecięcie poprzecznicy', color: COL.cut, opacity: CUT_OP_JEJ }),
      ringOn(C_TI, flat(0.9), tI, { name: 'Przecięcie jelita krętego', color: COL.cut, opacity: CUT_OP_JEJ }),
      { kind: 'line', name: 'Linia zszywek (stapler liniowy)', color: STAPLE, opacity: ANAST_OP, pts: iso ? [[-1.8, 3.4, 4.3], [0, 3.0, 4.45], [1.4, 2.9, 4.4]] : [[-2.6, 3.9, 4.1], [-0.8, 3.5, 4.4], [1.0, 3.1, 4.3]] }
    ];
    if (iso) marks.push({ kind: 'line', name: 'Zamknięcie otworu po staplerze', color: SUT, opacity: ANAST_OP, pts: [[1.9, 4.6, 3.7], [2.0, 3.4, 4.5], [2.1, 2.0, 4.4]] });
    else marks.push({ kind: 'line', name: 'Zamknięcie poprzeczne końców (TA)', color: STAPLE, opacity: ANAST_OP, pts: [[-3.5, 5.7, 2.9], [-3.6, 4.3, 3.9], [-3.6, 2.8, 4.2]] });
    return {
      cat: 'colon', id: iso ? 'rh-iso' : 'rh-anti', short: iso ? 'Hemikolektomia prawa (izo)' : 'Hemikolektomia prawa (FEEA)',
      title: 'Prawostronna hemikolektomia: zespolenie krętniczo-poprzeczne ' + (iso ? 'izoperystaltyczne' : 'antyperystaltyczne (FEEA)'),
      sub: iso ? 'Bok-do-boku, stapler liniowy; typowe przy zespoleniu wewnątrzotrzewnowym' : 'FEEA (functional end-to-end), stapler liniowy + zamknięcie poprzeczne; typowe przy zespoleniu zewnątrzotrzewnowym',
      notes: iso ? [
        'Usunięte: końcowy odcinek jelita krętego, kątnica z wyrostkiem, okrężnica wstępująca, zagięcie wątrobowe i część poprzecznicy.',
        'Jelito kręte ułożone wzdłuż poprzecznicy zgodnie z kierunkiem perystaltyki; kikuty po przeciwnych stronach zespolenia.',
        'W kolonoskopii z poprzecznicy bokiem do jelita krętego, bez zawracania aparatu; kikut okrężnicy za zespoleniem.'
      ] : [
        'Usunięte: końcowy odcinek jelita krętego, kątnica z wyrostkiem, okrężnica wstępująca, zagięcie wątrobowe i część poprzecznicy.',
        'Końce jelita krętego i poprzecznicy ułożone obok siebie w tę samą stronę, zamknięte poprzeczną linią zszywek.',
        'W kolonoskopii wejście do jelita krętego wymaga zawrócenia o 180° we wspólnym świetle.'
      ],
      focus: { t: [-3, 0, 2], k: 0.72 },
      text: COL_TEXT,
      frames: {
        resect: ['Zakres resekcji', 'Końcowy odcinek jelita krętego, kątnica z wyrostkiem, okrężnica wstępująca i prawa część poprzecznicy.', 'Zakres resekcji'],
        remove: ['Usunięcie preparatu', 'Preparat usunięty; pozostaje koniec jelita krętego i poprzecznicy.', 'Usunięcie'],
        recon: iso ? ['Zespolenie izoperystaltyczne', 'Jelito kręte ułożone wzdłuż poprzecznicy zgodnie z perystaltyką; stapler liniowy tworzy wspólne światło, otwór po staplerze zamknięty.', 'Zespolenie']
          : ['Zespolenie antyperystaltyczne (FEEA)', 'Końce ułożone obok siebie w tę samą stronę; stapler liniowy tworzy wspólne światło, końce zamknięte poprzecznie.', 'Zespolenie'],
        post: iso ? 'Kikut jelita krętego i kikut poprzecznicy po przeciwnych stronach zespolenia.' : 'Oba kikuty po tej samej stronie, zamknięte jedną poprzeczną linią zszywek.',
        endoPost: iso ? 'Fragment kolonoskopii: z poprzecznicy bokiem do jelita krętego, bez zawracania aparatu.' : 'Fragment kolonoskopii: we wspólnym świetle zawrócenie o 180° z poprzecznicy do jelita krętego.'
      },
      endoTitles: ['Kolonoskopia: anatomia prawidłowa', 'Kolonoskopia po operacji'],
      objects: [
        tiObj({ pre: TI_KEEP, post: { path: ile, r: STUMP_END }, morph: [2, 2.9], labels: [L('Jelito kręte', 0.3, ALL)] }),
        { id: 'tiCut', name: 'Jelito kręte (usuwane)', pre: TI_CUT, colors: [[0, COLC.ti], [0.7, COL.spec]], opacity: SPEC_OP, offset: RH_OFF, mucosa: 'circular', tint: MUC.bowel },
        colObj('specR', 0, tR, { name: 'Prawa połowa okrężnicy', colors: [[0, COLC.colon], [0.7, COL.spec]], opacity: SPEC_OP, offset: RH_OFF, win: [-9, 1.4] }),
        appObj({ colors: [[0, COLC.app], [0.7, COL.spec]], opacity: SPEC_OP, offset: RH_OFF }),
        colObj('colon', tR, 1, { name: 'Okrężnica', post: iso ? COL_ISO : COL_ANTI, morph: [2, 2.9] })
      ],
      marks: marks,
      endTarget: { pre: ICV },
      endText: { pre: 'Zastawka krętniczo-kątnicza w polu widzenia' },
      routePost: iso ? [{ obj: 'colon', from: [5.6, 6.6, 1.0], to: [0.2, 3.5, 2.8], note: 'Poprzecznica w stronę zespolenia' }, { obj: 'ti', from: [-0.2, 2.5, 4.0], to: [-3.6, 0.6, 3.4], note: 'Bokiem do jelita krętego — bez zawracania' }]
        : [{ obj: 'colon', from: [5.6, 6.6, 1.0], to: [-2.4, 4.3, 2.6], note: 'Poprzecznica w stronę zespolenia' }, { obj: 'ti', from: [-2.4, 3.1, 3.9], to: [3.0, 0.4, 3.4], note: 'Zawrócenie o 180° do jelita krętego' }]
    };
  }

  var tA = ct([7.4, -6.0, -0.3]), tPJ = ct([7.9, -2.0, -0.6]);
  /* ---------- Kikut odbytnicy: kopuła zamknięcia i punkty na jej powierzchni ---------- */
  function stumpDome(t0, R, H) {
    var s = sub(C_COL, COL_R, t0, 1, 30), c = curveOf(s.path), len = c.getLength();
    var P0 = c.getPointAt(0), T0 = c.getTangentAt(0);
    var n = new THREE.Vector3(1, 0, 0); n.sub(T0.clone().multiplyScalar(n.dot(T0))).normalize();
    var b = new THREE.Vector3().crossVectors(T0, n).normalize(); if (b.z < 0) b.negate();
    var rPost = function (t) {
      var x = t * len; if (x < H) return Math.max(0.05, R * Math.sqrt(Math.max(0, 1 - (1 - x / H) * (1 - x / H))));
      return R + (s.r(t) - R) * sm01((x - H) / 2.5);
    };
    function dx(rho) { rho = Math.min(rho, R * 0.995); return H * (1 - Math.sqrt(Math.max(0, 1 - (rho / R) * (rho / R)))); }
    // punkt na kopule (od środka: inside=true, od zewnątrz: false)
    function pt(vn, vb, inside) {
      var rho = Math.sqrt(vn * vn + vb * vb), k = inside ? 0.975 : 1.03;
      return P0.clone().addScaledVector(T0, dx(rho) + (inside ? 0.05 : -0.06)).addScaledVector(n, vn * k).addScaledVector(b, vb * k).toArray();
    }
    // punkt na ścianie cylindrycznej poniżej kopuły, na wysokości x, kąt: składowa boczna vn
    function wall(x, vn, inside) {
      var Rw = rPost(x / len), k = inside ? 0.975 : 1.03, vb = Math.sqrt(Math.max(0, Rw * Rw - vn * vn));
      return P0.clone().addScaledVector(T0, x).addScaledVector(n, vn * k).addScaledVector(b, vb * k).toArray();
    }
    return { s: s, len: len, P0: P0, T0: T0, n: n, b: b, R: R, H: H, rPost: rPost, dx: dx, pt: pt, wall: wall };
  }
  // linia zszywek w poprzek kopuły (wzdłuż n, w odległości lb od środka), z pominięciem wnętrza pierścienia
  function domeLines(D, lb, ring, name, opacity) {
    var Rl = Math.sqrt(Math.max(0, D.R * D.R - lb * lb)) * 0.96, N = 40, segs = [], cur = null;
    for (var i = 0; i <= N; i++) {
      var vn = -Rl + 2 * Rl * i / N, inRing = ring && ((vn - ring.on) * (vn - ring.on) + (lb - ring.ob) * (lb - ring.ob) < ring.rc * ring.rc * 1.02);
      if (inRing) { if (cur && cur.length > 1) segs.push(cur); cur = null; continue; }
      if (!cur) cur = []; cur.push(vn);
    }
    if (cur && cur.length > 1) segs.push(cur);
    return segs.map(function (sg, i) {
      return { kind: 'line', stump: true, name: i === 0 ? name : '', color: STAPLE, opacity: opacity, endo: true, dash: 0.14,
        pts: sg.map(function (vn) { return D.pt(vn, lb, false); }), endoPts: sg.map(function (vn) { return D.pt(vn, lb, true); }) };
    });
  }
  function ringLoop(D, on, ob, rc, inside) {
    var out = [];
    for (var i = 0; i < 72; i++) { var a = i / 72 * Math.PI * 2; out.push(D.pt(on + rc * Math.cos(a), ob + rc * Math.sin(a), inside)); }
    return out;
  }
  function addV(p, d, k) { return [p[0] + d.x * k, p[1] + d.y * k, p[2] + d.z * k]; }

  /* ---------- Wspólny moduł zespoleń staplerem okrężnym (EEA) na kikucie zamkniętym staplerem liniowym ---------- */
  // o: { tD: t kikuta na C_COL, R, H: kopuła, kind: center|racket|side, rc: promień pierścienia,
  //      base: ścieżka zachowanej części proksymalnej, tail: punkty sprowadzenia, rBase(t), rEnd, sideX }
  var tL = ct([0.2, -15.1, -1.0]);
  var LAR_R = 1.7, LAR_H = 0.9, RC = 0.9, SIDE_X = 2.2;
  function eeaJoin(o) {
    var D = stumpDome(o.tD, o.R, o.H), T0 = D.T0, n = D.n, b = D.b, rc = o.rc || RC, kind = o.kind;
    var cfg = { center: { on: 0, ob: 0, lb: 0 }, racket: { on: o.R - rc - 0.02, ob: 0, lb: 0 }, side: null }[kind];
    var E, dIn, ringPts = null, ringEndo = null, stapTop, lines;
    var LINE_OP = [[1.3, 0], [1.6, 1]], RING_OP = [[2.8, 0], [2.95, 1]];
    var rEnd = o.rEnd || rc;
    if (cfg) {
      var rho = Math.sqrt(cfg.on * cfg.on + cfg.ob * cfg.ob);
      E = D.P0.clone().addScaledVector(T0, D.dx(rho) + 0.35).addScaledVector(n, cfg.on).addScaledVector(b, cfg.ob);
      dIn = T0.clone();
      ringPts = ringLoop(D, cfg.on, cfg.ob, rc, false); ringEndo = ringLoop(D, cfg.on, cfg.ob, rc, true);
      lines = domeLines(D, 0, null, 'Linia zszywek kikuta (stapler liniowy)', LINE_OP).map(function (l) { l.fullStump = true; return l; })
        .concat(domeLines(D, cfg.lb, { on: cfg.on, ob: cfg.ob, rc: rc }, '', LINE_OP).map(function (l) { l.stump = false; l.ringSeg = true; l.name = ''; return l; }));
      stapTop = D.P0.clone().addScaledVector(T0, D.dx(rho) + 0.25).addScaledVector(n, cfg.on).addScaledVector(b, cfg.ob);
    } else {
      var xs = o.sideX || SIDE_X, Rw = D.rPost(xs / D.len);
      dIn = b.clone().multiplyScalar(-0.72).addScaledVector(T0, 0.69).normalize();
      E = D.P0.clone().addScaledVector(T0, xs).addScaledVector(b, Rw - 0.35);
      lines = domeLines(D, 0, null, 'Linia zszywek kikuta (stapler liniowy)', LINE_OP);
      stapTop = D.P0.clone().addScaledVector(T0, xs).addScaledVector(b, Rw - 0.2);
    }
    var Ea = E.toArray(), proxPath = o.base.concat(o.tail);
    proxPath.push(addV(Ea, dIn, -3.0), addV(Ea, dIn, -1.5), Ea);
    var nB = o.base.length, proxR = (function () {
      var cc = curveOf(proxPath), tj = nB ? nearestT(cc, o.base[nB - 1]) : 0, rb0 = o.rBaseEnd || rEnd;
      return function (t) {
        if (nB && t <= tj) return o.rBase(t / tj);
        var u = nB ? (t - tj) / (1 - tj) : t, r = rb0 + (rEnd - rb0) * sm01(u);
        return r;
      };
    })();
    if (!ringPts) { // pierścień = linia przecięcia rzeczywistej ściany jelita proksymalnego ze ścianą kikuta
      var cc = curveOf(proxPath), rcv = curveOf(D.s.path), RS = [], CS = [];
      for (var j = 0; j <= 400; j++) { var tj = j / 400; RS.push([rcv.getPointAt(tj), D.rPost(tj)]); }
      for (var j2 = 0; j2 <= 300; j2++) { var tc = 0.85 + 0.15 * j2 / 300; CS.push([cc.getPointAt(tc), cc.getTangentAt(tc), proxR(tc)]); }
      var fOut = function (p) {
        var bi = 0, bd = 1e9; for (var j = 0; j < RS.length; j++) { var dd = RS[j][0].distanceToSquared(p); if (dd < bd) { bd = dd; bi = j; } }
        var ax = RS[bi][0], dir = p.clone().sub(ax), rad = dir.length(); return { v: rad - RS[bi][1], ax: ax, dir: dir.normalize(), r: RS[bi][1] };
      };
      ringPts = []; ringEndo = [];
      for (var i = 0; i < 72; i++) {
        var a = i / 72 * Math.PI * 2, prev = null, hit = null;
        for (var k = 0; k < CS.length; k++) {
          var T = CS[k][1], u2 = new THREE.Vector3().crossVectors(T, n).normalize(), n2 = new THREE.Vector3().crossVectors(u2, T).normalize();
          var g = CS[k][0].clone().addScaledVector(n2, CS[k][2] * Math.cos(a)).addScaledVector(u2, CS[k][2] * Math.sin(a)), f = fOut(g);
          if (prev && prev.v > 0 && f.v <= 0) { hit = f; break; }
          prev = f;
        }
        if (!hit) hit = prev;
        ringPts.push(hit.ax.clone().addScaledVector(hit.dir, hit.r * 1.03).toArray()); ringEndo.push(hit.ax.clone().addScaledVector(hit.dir, hit.r * 0.975).toArray());
      }
    }
    var marks = lines.concat([{ kind: 'loop', name: kind === 'side' ? 'Zespolenie EEA na przedniej ścianie odbytnicy' : 'Zespolenie okrężne staplerem (EEA)', color: STAPLE, opacity: RING_OP, endo: true, dash: 0.14, pts: ringPts, endoPts: ringEndo }]);
    var off = kind === 'side' ? (o.sideX || SIDE_X) : 1.2;
    var eeaPath = [stapTop.toArray()].concat(sub(C_COL, COL_R, o.tD + off / D.len * (1 - o.tD), 1, 14).path).concat([[0, -20.8, 1.4], [0, -22.6, 2.6]]);
    var eea = { face: stapTop.toArray(), dir: (cfg ? T0.clone().negate() : dIn.clone().negate()).toArray(), anvil: Ea, path: eeaPath.slice(1) };
    var stumpTo = kind === 'side' ? addV(D.P0.toArray(), T0, o.sideX || SIDE_X) : addV(D.P0.toArray(), T0, 1.3);
    return { D: D, E: E, proxPath: proxPath, proxR: proxR, marks: marks, eea: eea, stumpTo: stumpTo };
  }
  function colSpec(id, t0, t1, name, off) { return colObj(id, t0, t1, { name: name, colors: [[0, COLC.colon], [0.7, COL.spec]], opacity: SPEC_OP, offset: off || [[1.15, [0, 0, 0]], [1.9, [-6, 2, 6]]], win: [-9, 1.4] }); }
  var COL_BASE_A = sub(C_COL, COL_R, 0, tPJ, 70).path.concat([[7.2, -6.0, 0.0], [5.2, -9.0, 0.6]]);
  var rColA = function (u) { return COL_R(u * tPJ); };
  function colonEEA(o) {
    // o: id, short, title, sub, notes, frames, cutP (t), tD, R, H, kind, base, tail, rBase, rEnd, rc, specs, extraObjs, route, cutNames
    var J = eeaJoin({ tD: o.tD, R: o.R, H: o.H, kind: o.kind, rc: o.rc, base: o.base, tail: o.tail, rBase: o.rBase, rEnd: o.rEnd, rBaseEnd: o.rBaseEnd });
    var prox = o.proxObj(J);
    var marks = [
      o.cutPMark || ringOn(C_COL, COL_R, o.cutP, { name: o.cutNames[0], color: COL.cut, opacity: CUT_OP_JEJ }),
      ringOn(C_COL, COL_R, o.tD, { name: o.cutNames[1], stumpCut: true, color: COL.cut, opacity: [[0.05, 0], [0.55, 1], [1.2, 1], [1.4, 0]] })
    ].concat(J.marks);
    var route;
    route = [{ obj: 'rect', from: 1, to: J.stumpTo, note: o.routeNotes[0] }, { obj: 'prox', from: 1, to: o.routeTo || 0.93, note: o.routeNotes[1] }];
    return {
      eea: J.eea, cat: 'colon', id: o.id, short: o.short, title: o.title, sub: o.sub, notes: o.notes,
      focus: o.focus, text: COL_TEXT, frames: o.frames,
      endoTitles: ['Kolonoskopia: anatomia prawidłowa', o.endoTitle || 'Endoskopia po operacji'],
      objects: (o.keepObjs || []).concat([prox]).concat(o.specs).concat([
        colObj('rect', o.tD, 1, { name: o.stumpName || 'Odbytnica', postName: o.stumpPost || 'Kikut odbytnicy', color: COLC.rect, post: { path: J.D.s.path, r: J.D.rPost }, morph: [1.2, 1.6],
          opacity: [[2.05, 1], [2.2, 0.35], [2.85, 0.35], [3, 1]] })]),
      marks: marks, endTarget: { pre: ICV }, endText: { pre: 'Zastawka krętniczo-kątnicza w polu widzenia' },
      routePost: route
    };
  }
  var AR_TXT = {
    center: ['Linia zszywek kikuta przez środek pierścienia', 'Kolec staplera przebija środek linii zszywek kikuta; linia przecina pierścień, po obu stronach zostają „uszy”.',
      'Pierścień zszywek przecięty linią zamknięcia kikuta; po obu stronach dwa „uszy”.'],
    racket: ['Pierścień obejmuje jeden koniec linii zszywek', 'Kolec przebija kikut przy końcu linii zszywek; pierścień obejmuje ten koniec, linia wychodzi z pierścienia tylko z jednej strony — kształt rakiety tenisowej.',
      'Pierścień z jedną „rączką” linii zszywek; jedno „ucho”.'],
    side: ['Koniec okrężnicy do przedniej ściany odbytnicy', 'Kolec przebija przednią ścianę kikuta poniżej linii zszywek; zespolenie koniec (okrężnicy) do boku (odbytnicy), powyżej ślepy szczyt kikuta.',
      'Zespolenie na przedniej ścianie odbytnicy, nad nim ślepo zakończony szczyt kikuta z linią zszywek.']
  };
  function arVariant(kind) {
    var T = AR_TXT[kind];
    return colonEEA({
      id: 'ar-' + kind, short: 'Resekcja odbytnicy', title: 'Resekcja odbytnicy — ' + T[0].charAt(0).toLowerCase() + T[0].slice(1),
      sub: 'Przednia resekcja odbytnicy (wysoka lub niska — zależnie od poziomu zespolenia); EEA (end-to-end anastomosis) — stapler okrężny, technika podwójnego staplowania',
      notes: ['Usunięta esica z górną i środkową częścią odbytnicy oraz mezorektum (TME, całkowite wycięcie mezorektum); zstępnica po mobilizacji zagięcia śledzionowego sprowadzona do miednicy.',
        'Resekcja wysoka i niska różnią się poziomem przecięcia odbytnicy (odległością zespolenia od odbytu); geometria zespolenia jest taka sama.',
        'Kikut odbytnicy zamknięty poprzecznie staplerem liniowym; stapler okrężny przez odbyt, kowadełko w końcu okrężnicy.', T[1]],
      frames: {
        resect: ['Zakres resekcji', 'Esica z górną i środkową częścią odbytnicy; przecięcie na granicy zstępnicy i esicy oraz w odbytnicy.', 'Zakres resekcji'],
        remove: ['Usunięcie preparatu', 'Preparat usunięty; kikut odbytnicy zamknięty poprzecznie staplerem liniowym.', 'Usunięcie'],
        recon: ['Zespolenie staplerem okrężnym', 'Zstępnica z kowadełkiem sprowadzona do miednicy. ' + T[1], 'Zespolenie'],
        post: T[2],
        endoPost: kind === 'side' ? 'Od odbytu do kikuta: zespolenie na przedniej ścianie, powyżej ślepy szczyt kikuta; wejście do okrężnicy.' : 'Od odbytu przez kikut — pierścień zszywek i linia zamknięcia kikuta — tuż za zespolenie.'
      },
      focus: { t: [1.5, -13.5, 0], k: 0.5 }, kind: kind, tD: tL, R: LAR_R, H: LAR_H, cutP: tA, cutNames: ['Przecięcie okrężnicy', 'Przecięcie odbytnicy'],
      base: COL_BASE_A, tail: [[2.6, -11.4, 0.6]], rBase: rColA, rBaseEnd: 1.15, rEnd: RC,
      keepObjs: [tiObj({}), appObj({})],
      proxObj: function (J) { return colObj('prox', 0, tA, { name: 'Okrężnica', post: { path: J.proxPath, r: J.proxR }, morph: [2, 2.6] }); },
      specs: [colSpec('specS', tA, tL, 'Esica i odbytnica (preparat)')],
      routeNotes: [kind === 'side' ? 'Kikut odbytnicy — zespolenie na przedniej ścianie, powyżej ślepy szczyt kikuta' : 'Kikut odbytnicy — pierścień zszywek i linia zamknięcia kikuta', 'Za zespoleniem — początek okrężnicy zstępującej'],
      routeTo: [5.2, -9.0, 0.6]
    });
  }

  var tSig = ct([0.5, -12.8, 0.9]);
  /* ---------- Lewostronna hemikolektomia ---------- */
  var tTL = ct([2.4, 4.0, 2.5]), tSg2 = ct([2.6, -8.2, 2.2]);
  var LH = (function () {
    var rS = COL_R(tSg2), base = sub(C_COL, COL_R, 0, tTL, 70).path, tt = tTL;
    return colonEEA({
      id: 'lh', short: 'Hemikolektomia lewa', title: 'Lewostronna hemikolektomia: zespolenie poprzeczniczo-esicze koniec-do-końca (EEA)',
      sub: 'Resekcja lewej części poprzecznicy, zagięcia śledzionowego, zstępnicy i początku esicy; EEA (end-to-end anastomosis) przez odbyt',
      notes: ['Usunięte: lewa część poprzecznicy, zagięcie śledzionowe, okrężnica zstępująca i początkowa część esicy.',
        'Poprzecznica sprowadzona wzdłuż lewej ściany brzucha do kikuta esicy; zespolenie staplerem okrężnym wprowadzonym przez odbyt (alternatywnie ręczne lub bok-do-boku staplerem liniowym).',
        'W kolonoskopii zespolenie w okolicy esicy; dalej poprzecznica bez zagięcia śledzionowego.'],
      frames: {
        resect: ['Zakres resekcji', 'Lewa część poprzecznicy, zagięcie śledzionowe, zstępnica i początek esicy.', 'Zakres resekcji'],
        remove: ['Usunięcie preparatu', 'Preparat usunięty; kikut esicy zamknięty poprzecznie staplerem liniowym.', 'Usunięcie'],
        recon: ['Zespolenie poprzeczniczo-esicze', 'Poprzecznica z kowadełkiem sprowadzona do kikuta esicy; stapler okrężny przez odbyt, kolec przebija środek linii zszywek kikuta.', 'Zespolenie'],
        post: 'Poprzecznica połączona z esicą; zagięcie śledzionowe i zstępnica usunięte.',
        endoPost: 'Od odbytu przez odbytnicę i esicę do pierścienia zszywek, dalej poprzecznica.'
      },
      focus: { t: [3, -3, 2], k: 0.72 }, kind: 'center', tD: tSg2, R: rS, H: 0.6, rc: 0.78, cutP: tt,
      cutNames: ['Przecięcie poprzecznicy', 'Przecięcie esicy'],
      base: base, tail: [[4.4, 2.2, 3.0], [5.4, -1.6, 3.0], [5.6, -4.8, 2.8]], rBase: function (u) { return COL_R(u * tt); }, rBaseEnd: 1.3, rEnd: 0.78,
      keepObjs: [tiObj({}), appObj({})],
      proxObj: function (J) { return colObj('prox', 0, tt, { name: 'Okrężnica', post: { path: J.proxPath, r: J.proxR }, morph: [2, 2.7] }); },
      specs: [colSpec('specS', tt, tSg2, 'Lewa połowa okrężnicy (preparat)', [[1.15, [0, 0, 0]], [1.9, [7, 1, 5]]])],
      stumpName: 'Esica i odbytnica', stumpPost: 'Kikut esicy',
      routeNotes: ['Odbytnica i esica — pierścień zszywek przecięty linią kikuta', 'Za zespoleniem — poprzecznica'], routeTo: 0.9, endoTitle: 'Kolonoskopia po operacji'
    });
  })();


  /* ---------- Lewostronna hemikolektomia: zespolenia bok-do-boku (izoperystaltyczne, antyperystaltyczne FEEA) ---------- */
  function lhSide(iso) {
    var P0 = C_COL.getPointAt(tSg2), d = C_COL.getTangentAt(tSg2), s = new THREE.Vector3().crossVectors(d, new THREE.Vector3(0, 0, 1)).normalize();
    if (s.y < 0) s.negate();
    var q = function (kd, ks, kz) { return P0.clone().addScaledVector(d, kd).addScaledVector(s, ks).add(new THREE.Vector3(0, 0, kz || 0)).toArray(); };
    var SEP = 1.45, base = sub(C_COL, COL_R, 0, tTL, 70).path, tail = [[4.4, 2.2, 3.0], [5.4, -1.6, 3.0], [5.6, -4.8, 2.8]];
    var limb = iso ? [q(-2.0, SEP + 0.3, 0.2), q(-0.4, SEP), q(1.4, SEP), q(3.2, SEP)]
      : [q(-1.0, SEP + 1.2, 2.2), q(1.6, SEP + 1.0, 3.2), q(4.4, SEP + 0.4, 2.4), q(4.6, SEP, 0.4), q(3.0, SEP), q(1.2, SEP), q(-0.5, SEP)];
    var PX = base.concat(tail).concat(limb), cP = curveOf(PX), tj = nearestT(cP, tail[0]);
    var rProx = function (t) { var r = t <= tj ? COL_R(t / tj * tTL) : 1.15; return t > 0.97 ? Math.max(0.06, r * (1 - sm01((t - 0.97) / 0.03))) : r; };
    var dist = sub(C_COL, COL_R, tSg2, 1, 40), DP = iso ? dist.path : [q(-0.5, 0)].concat(dist.path);
    var lenD = curveOf(DP).getLength(), rDist = function (t) { var a = 1.0 / lenD; return t < a ? 0.06 + (dist.r(0) - 0.06) * sm01(t / a) : dist.r(Math.min(1, t)); };
    var LZ = [q(0.2, SEP / 2, 1.05), q(1.4, SEP / 2, 1.15), q(2.6, SEP / 2, 1.05)];
    var marks = [
      ringOn(C_COL, COL_R, tTL, { name: 'Przecięcie poprzecznicy', color: COL.cut, opacity: CUT_OP_JEJ }),
      ringOn(C_COL, COL_R, tSg2, { name: 'Przecięcie esicy', color: COL.cut, opacity: CUT_OP_JEJ }),
      { kind: 'line', name: 'Linia zszywek (stapler liniowy)', color: STAPLE, opacity: ANAST_OP, pts: LZ }
    ];
    if (iso) marks.push({ kind: 'line', name: 'Zamknięcie otworu po staplerze', color: SUT, opacity: ANAST_OP, pts: [q(3.0, -0.9, 0.7), q(3.1, SEP / 2, 1.2), q(3.0, SEP + 0.9, 0.7)] });
    else marks.push({ kind: 'line', name: 'Zamknięcie poprzeczne końców (TA)', color: STAPLE, opacity: ANAST_OP, pts: [q(-0.75, -1.0, 0.4), q(-0.8, SEP / 2, 0.9), q(-0.75, SEP + 1.0, 0.4)] });
    var sm = s.toArray(), dm = d.toArray(), zm = new THREE.Vector3(0, 0, 1).sub(d.clone().multiplyScalar(d.z)).normalize().toArray();
    return {
      cat: 'colon', id: iso ? 'lh-iso' : 'lh-anti', short: 'Hemikolektomia lewa',
      title: 'Lewostronna hemikolektomia: zespolenie poprzeczniczo-esicze bok-do-boku ' + (iso ? 'izoperystaltyczne' : 'antyperystaltyczne (FEEA)'),
      sub: iso ? 'Bok-do-boku, stapler liniowy; ramiona zgodnie z kierunkiem perystaltyki' : 'FEEA (functional end-to-end anastomosis) — stapler liniowy i zamknięcie poprzeczne końców',
      notes: ['Usunięte: lewa część poprzecznicy, zagięcie śledzionowe, okrężnica zstępująca i początkowa część esicy.',
        iso ? 'Poprzecznica sprowadzona wzdłuż lewej ściany brzucha i ułożona wzdłuż esicy zgodnie z kierunkiem perystaltyki; kikuty po przeciwnych stronach zespolenia.'
          : 'Końce poprzecznicy i esicy ułożone obok siebie w tę samą stronę; wspólny otwór zamknięty poprzeczną linią zszywek.',
        iso ? 'W kolonoskopii z esicy bokiem do poprzecznicy, bez zawracania aparatu; za zespoleniem ślepy kikut poprzecznicy.'
          : 'W kolonoskopii wejście do poprzecznicy wymaga zawrócenia o 180° we wspólnym świetle.'],
      focus: { t: [2.4, -6.5, 2.4], k: 0.6 }, text: COL_TEXT,
      frames: {
        resect: ['Zakres resekcji', 'Lewa część poprzecznicy, zagięcie śledzionowe, zstępnica i początek esicy.', 'Zakres resekcji'],
        remove: ['Usunięcie preparatu', 'Preparat usunięty; pozostają zamknięte staplerem końce poprzecznicy i esicy.', 'Usunięcie'],
        recon: iso ? ['Zespolenie izoperystaltyczne', 'Poprzecznica ułożona wzdłuż esicy zgodnie z perystaltyką; stapler liniowy tworzy wspólne światło, otwór po staplerze zamknięty szwem.', 'Zespolenie']
          : ['Zespolenie antyperystaltyczne (FEEA)', 'Końce ułożone obok siebie w tę samą stronę; stapler liniowy tworzy wspólne światło, końce zamknięte poprzecznie drugim staplerem.', 'Zespolenie'],
        post: iso ? 'Kikut poprzecznicy i kikut esicy po przeciwnych stronach zespolenia.' : 'Oba kikuty po tej samej stronie, zamknięte jedną poprzeczną linią zszywek.',
        endoPost: iso ? 'Od odbytu przez odbytnicę i esicę do zespolenia; bokiem do poprzecznicy bez zawracania.' : 'Od odbytu przez odbytnicę i esicę do wspólnego światła; zawrócenie o 180° do poprzecznicy.'
      },
      endoTitles: ['Kolonoskopia: anatomia prawidłowa', 'Kolonoskopia po operacji'],
      objects: [tiObj({}), appObj({}),
        colObj('prox', 0, tTL, { name: 'Okrężnica', post: { path: PX, r: rProx }, morph: [2, 2.9] }),
        colSpec('specS', tTL, tSg2, 'Lewa połowa okrężnicy (preparat)', [[1.15, [0, 0, 0]], [1.9, [7, 1, 5]]]),
        colObj('rect', tSg2, 1, { name: 'Esica i odbytnica', color: COLC.rect, post: { path: DP, r: rDist }, morph: [1.2, 1.6] })],
      marks: marks,
      sideGia: { at: q(1.3, SEP / 2), j: (iso ? d.clone().negate() : d).toArray(), s: sm, ta: iso ? null : { at: q(-0.75, SEP / 2), j: sm, s: dm } },
      sideSut: iso ? { pts: [q(3.0, -0.9, 0.7), q(3.1, SEP / 2, 1.2), q(3.0, SEP + 0.9, 0.7)], n: zm } : null,
      endTarget: { pre: ICV }, endText: { pre: 'Zastawka krętniczo-kątnicza w polu widzenia' },
      routePost: iso ? [{ obj: 'rect', from: 1, to: q(1.3, 0), note: 'Odbytnica i esica do zespolenia' }, { obj: 'prox', from: q(1.3, SEP), to: [5.4, -1.6, 3.0], note: 'Bokiem do poprzecznicy — bez zawracania' }]
        : [{ obj: 'rect', from: 1, to: q(1.3, 0), note: 'Odbytnica i esica do wspólnego światła' }, { obj: 'prox', from: q(1.3, SEP), to: [5.4, -1.6, 3.0], note: 'Zawrócenie o 180° do poprzecznicy' }]
    };
  }
  /* ---------- Kolektomia całkowita z zespoleniem krętniczo-odbytniczym (IRA) ---------- */
  var IRA = (function () {
    var tI2 = nearestT(C_TI, [-3.2, -7.5, 1.2]), tiBase = sub(C_TI, flat(0.9), 0, tI2, 20);
    return colonEEA({
      id: 'ira', short: 'Kolektomia całkowita (IRA)', title: 'Kolektomia całkowita z zespoleniem krętniczo-odbytniczym',
      sub: 'IRA (ileorectal anastomosis) — jelito kręte do górnej odbytnicy staplerem okrężnym',
      notes: ['Usunięta cała okrężnica od kątnicy do połączenia esiczo-odbytniczego; odbytnica zachowana.',
        'Wskazania m.in.: polipowatość z oszczędzeniem odbytnicy, zaparcie z inercją okrężnicy, zespół Lyncha, zapalenie okrężnicy z oszczędzoną odbytnicą.',
        'Zachowana odbytnica wymaga endoskopowego nadzoru (ryzyko nowotworzenia w polipowatości).'],
      frames: {
        resect: ['Zakres resekcji', 'Cała okrężnica z kątnicą i końcowym odcinkiem jelita krętego; przecięcie na wysokości połączenia esiczo-odbytniczego.', 'Zakres resekcji'],
        remove: ['Usunięcie okrężnicy', 'Okrężnica usunięta; kikut odbytnicy zamknięty poprzecznie staplerem liniowym.', 'Usunięcie'],
        recon: ['Zespolenie krętniczo-odbytnicze', 'Jelito kręte z kowadełkiem sprowadzone do miednicy; stapler okrężny przez odbyt, kolec przebija środek linii zszywek kikuta.', 'Zespolenie'],
        post: 'Jelito kręte połączone bezpośrednio z odbytnicą; brak okrężnicy.',
        endoPost: 'Od odbytu przez odbytnicę do pierścienia zszywek, dalej jelito kręte (fałdy okrężne, bez haustr).'
      },
      focus: { t: [0, -10, 1], k: 0.62 }, kind: 'center', tD: tSig, R: COL_R(tSig), H: 0.6, rc: 0.82,
      cutPMark: ringOn(C_TI, flat(0.9), tI2, { name: 'Przecięcie jelita krętego', color: COL.cut, opacity: CUT_OP_JEJ }),
      cutNames: ['', 'Przecięcie na wysokości połączenia esiczo-odbytniczego'],
      base: [[4.0, -5.2, 0.8], [2.6, -6.4, 1.4], [1.2, -8.0, 1.7]], tail: [[0.8, -10.0, 1.5]], rBase: flat(0.9), rBaseEnd: 0.9, rEnd: 0.82,
      keepObjs: [],
      proxObj: function (J) { return { id: 'prox', name: 'Jelito kręte', pre: tiBase, post: { path: J.proxPath, r: J.proxR }, morph: [2, 2.7], color: COLC.ti, mucosa: 'circular', tint: MUC.bowel,
        labels: [L('Jelito kręte', 0.3, ALL)] }; },
      specs: [colSpec('specC', 0, tSig, 'Okrężnica (preparat)', [[1.15, [0, 0, 0]], [1.9, [0, 3, 7]]]),
        { id: 'tiCut', name: 'Jelito kręte (usuwane)', pre: sub(C_TI, flat(0.9), tI2, 1, 8), colors: [[0, COLC.ti], [0.7, COL.spec]], opacity: SPEC_OP, offset: [[1.15, [0, 0, 0]], [1.9, [0, 3, 7]]], mucosa: 'circular', tint: MUC.bowel },
        appObj({ colors: [[0, COLC.app], [0.7, COL.spec]], opacity: SPEC_OP, offset: [[1.15, [0, 0, 0]], [1.9, [0, 3, 7]]] })],
      routeNotes: ['Odbytnica — pierścień zszywek przecięty linią kikuta', 'Za zespoleniem — jelito kręte'], routeTo: 0.8
    });
  })();


  /* ---------- Proktokolektomia ze zbiornikiem J i zespoleniem krętniczo-odbytowym (IPAA) ---------- */
  var IPAA = (function () {
    var tAn = ct([0, -18.2, -1.0]), J = eeaJoin({ tD: tAn, R: 0.95, H: 0.5, kind: 'center', rc: 0.72, base: [[4.0, -5.2, 0.8]], tail: [], rBase: flat(1), rEnd: 1 });
    var D = J.D, up = D.T0.clone().negate(), s = D.n.clone(); if (s.x < 0) s.negate();
    var Q = D.P0.clone().addScaledVector(up, 0.35), Lc = C_COL.getLength();
    // punkty zbiornika wzdłuż dawnego łoża odbytnicy (krzywizna kości krzyżowej), przesunięte bocznie o ks
    var qa = function (ks, ku) {
      if (ku <= 0.4) return Q.clone().addScaledVector(s, ks).addScaledVector(up, ku).toArray();
      var p = C_COL.getPointAt(Math.max(0, tAn - (ku + 0.35) / Lc)); p.z += 0.5; return p.addScaledVector(s, ks).toArray();
    };
    var AFFJ = [[4.0, -5.2, 0.8], [3.2, -8.0, 1.3], [2.0, -10.6, 1.0], qa(0.8, 5.2), qa(0.8, 2.2), qa(0.5, 0.5), qa(0.1, 0.0)];
    var JL = [qa(-0.1, 0.05), qa(-0.55, 0.55), qa(-0.8, 2.2), qa(-0.8, 4.8)];
    var tJ = 0.72, POUCH_R = profile([[0, 0.9], [0.55, 1.0], [0.72, 1.15], [1, 1.15]]), JL_R = profile([[0, 1.15], [0.9, 1.15], [1, 0.08]]);
    var LZ = [qa(0, 0.9), qa(0, 2.6), qa(0, 4.3)];
    return {
      eea: J.eea, cat: 'colon', id: 'ipaa', short: 'Zbiornik J (IPAA)', title: 'Proktokolektomia ze zbiornikiem J i zespoleniem krętniczo-odbytowym',
      sub: 'IPAA (ileal pouch–anal anastomosis) — zbiornik J z końcowego odcinka jelita krętego, zespolenie staplerem okrężnym z kanałem odbytu',
      notes: ['Usunięta cała okrężnica i odbytnica; zachowany kanał odbytu ze zwieraczami (przy staplowaniu krótki mankiet strefy przejściowej).',
        'Zbiornik J: dwa ramiona końcowego odcinka jelita krętego (po ok. 15–20 cm) zespolone bok-do-boku staplerem liniowym; szczyt J to ślepy koniec jelita.',
        'Najczęściej z ochronną ileostomią pętlową. Wskazania: wrzodziejące zapalenie jelita grubego, rodzinna polipowatość gruczolakowata.',
        'W endoskopii zbiornika (pouchoskopii): zespolenie, wspólne światło zbiornika, wlot pętli doprowadzającej i ślepy szczyt J; ocena zapalenia zbiornika i mankietu.'],
      focus: { t: [0.5, -14, 0.5], k: 0.55 }, text: COL_TEXT,
      frames: {
        resect: ['Zakres resekcji', 'Cała okrężnica i odbytnica; jelito kręte przecięte przy zastawce, odbytnica tuż nad kanałem odbytu.', 'Zakres resekcji'],
        remove: ['Usunięcie jelita grubego', 'Okrężnica i odbytnica usunięte; kanał odbytu zamknięty poprzecznie staplerem liniowym.', 'Usunięcie'],
        recon: ['Zbiornik J i zespolenie', 'Końcowy odcinek jelita krętego złożony w J; ramiona zespolone staplerem liniowym we wspólny zbiornik, szczyt zbiornika zespolony staplerem okrężnym z kanałem odbytu.', 'Zbiornik J'],
        post: 'Zbiornik J w miednicy nad kanałem odbytu: wlot jelita krętego z boku, u góry ślepy szczyt J.',
        endoPost: 'Od odbytu przez zespolenie do zbiornika; wybór: wlot pętli doprowadzającej albo ślepy szczyt J.'
      },
      endoTitles: ['Kolonoskopia: anatomia prawidłowa', 'Endoskopia zbiornika (pouchoskopia)'],
      objects: [
        { id: 'aff', name: 'Jelito kręte', postName: 'Pętla doprowadzająca i ramię zbiornika', pre: sub(C_TI, flat(0.9), 0, tJ * 0.985, 20), post: { path: AFFJ, r: POUCH_R }, morph: [2, 2.9],
          color: COLC.ti, mucosa: 'circular', tint: MUC.bowel, labels: [L('Jelito kręte', 0.3, ALL), L('Zbiornik J', 0.9, POST)] },
        { id: 'jl', name: 'Końcowy odcinek jelita krętego', postName: 'Ramię zbiornika ze ślepym szczytem J', pre: sub(C_TI, flat(0.9), tJ, 0.985, 10), post: { path: JL, r: JL_R }, morph: [2, 2.9],
          color: COLC.ti, mucosa: 'circular', tint: MUC.bowel, labels: [L('Szczyt J (ślepy)', 0.92, POST)] },
        colSpec('specC', 0, tAn, 'Okrężnica i odbytnica (preparat)', [[1.15, [0, 0, 0]], [1.9, [0, 3, 8]]]),
        appObj({ colors: [[0, COLC.app], [0.7, COL.spec]], opacity: SPEC_OP, offset: [[1.15, [0, 0, 0]], [1.9, [0, 3, 8]]] }),
        colObj('rect', tAn, 1, { name: 'Kanał odbytu', postName: 'Kanał odbytu', color: COLC.rect, post: { path: D.s.path, r: D.rPost }, morph: [1.2, 1.6],
          opacity: [[2.05, 1], [2.2, 0.35], [2.85, 0.35], [3, 1]] })
      ],
      marks: [
        ringOn(C_TI, flat(0.9), 0.985, { name: 'Przecięcie jelita krętego przy zastawce', color: COL.cut, opacity: CUT_OP_JEJ }),
        ringOn(C_COL, COL_R, tAn, { name: 'Przecięcie nad kanałem odbytu', stumpCut: true, color: COL.cut, opacity: [[0.05, 0], [0.55, 1], [1.2, 1], [1.4, 0]] }),
        { kind: 'line', name: 'Linia zszywek (stapler liniowy)', color: STAPLE, opacity: ANAST_OP, endo: true, dash: 0.14, pts: LZ, endoPts: LZ }
      ].concat(J.marks),
      pouchGia: { at: qa(0, 2.6), j: up.clone().negate().toArray(), s: s.toArray() },
      endTarget: { pre: ICV }, endText: { pre: 'Zastawka krętniczo-kątnicza w polu widzenia' },
      routePost: { prefix: [{ obj: 'rect', from: 1, to: J.stumpTo, note: 'Kanał odbytu — pierścień zszywek przecięty linią zamknięcia' }], branches: [
        { label: 'Pętla doprowadzająca', sub: 'wlot jelita krętego do zbiornika', steps: [{ obj: 'aff', from: 1, to: 0.62, note: 'Zbiornik, dalej wlot pętli doprowadzającej' }] },
        { label: 'Szczyt J', sub: 'ślepy koniec zbiornika', steps: [{ obj: 'jl', from: 0.02, to: 0.93, note: 'Ślepy szczyt J — miejsce możliwej nieszczelności' }], target: JL[JL.length - 1], endText: 'Ślepy szczyt J z linią zszywek' }
      ] }
    };
  })();

  /* ---------- Operacja Hartmanna ---------- */
  var tH = ct([0.5, -12.8, 0.9]);
  var HART = (function () {
    var rtop = COL_R(tH), D = stumpDome(tH, rtop, 0.6);
    var proxPath = sub(C_COL, COL_R, 0, tPJ, 70).path.concat([[7.8, -4.4, 0.4], [7.3, -6.3, 2.2], [6.4, -7.4, 3.9], [6.0, -7.6, 5.6]]);
    var proxR = (function () { var cc = curveOf(proxPath), tj = nearestT(cc, [7.9, -2.0, -0.6]); return function (t) { return t <= tj ? COL_R(t / tj * tPJ) : 1.15 + (1.05 - 1.15) * sm01((t - tj) / (1 - tj)); }; })();
    return {
      cat: 'colon', id: 'hartmann', short: 'Hartmann',
      title: 'Operacja Hartmanna', sub: 'Resekcja esicy, kolostomia końcowa, zamknięty kikut odbytnicy',
      notes: [
        'Najczęściej w trybie pilnym (perforacja, niedrożność, zapalenie uchyłków z zapaleniem otrzewnej) — bez zespolenia.',
        'Zstępnica wyprowadzona jako kolostomia końcowa w lewym dole biodrowym; kikut odbytnicy zamknięty i pozostawiony w miednicy.',
        'Endoskopia przez kolostomię w stronę kątnicy albo przez odbyt do ślepego kikuta (ocena przed odtworzeniem ciągłości).'
      ],
      focus: { t: [4, -9, 2], k: 0.62 }, text: COL_TEXT,
      frames: {
        resect: ['Zakres resekcji', 'Esica; przecięcie na granicy zstępnicy i esicy oraz na wysokości połączenia esiczo-odbytniczego.', 'Zakres resekcji'],
        remove: ['Usunięcie esicy', 'Esica usunięta; kikut odbytnicy zamknięty poprzecznie staplerem liniowym.', 'Usunięcie'],
        recon: ['Kolostomia końcowa', 'Koniec zstępnicy przeprowadzony przez powłoki w lewym dole biodrowym i wszyty w skórę.', 'Kolostomia'],
        post: 'Kolostomia końcowa w lewym dole biodrowym, ślepy kikut odbytnicy w miednicy.',
        endoPost: 'Wybierz drogę: przez kolostomię albo przez odbyt do kikuta odbytnicy.'
      },
      endoTitles: ['Kolonoskopia: anatomia prawidłowa', 'Endoskopia po operacji'],
      objects: [
        tiObj({}), appObj({}),
        colObj('prox', 0, tA, { name: 'Okrężnica', post: { path: proxPath, r: proxR }, morph: [2, 2.7], open: [false, true] }),
        colObj('specS', tA, tH, { name: 'Esica (preparat)', colors: [[0, COLC.colon], [0.7, COL.spec]], opacity: SPEC_OP, offset: [[1.15, [0, 0, 0]], [1.9, [-6, 2, 6]]], win: [-9, 1.4] }),
        colObj('rect', tH, 1, { name: 'Odbytnica', postName: 'Kikut odbytnicy', color: COLC.rect, post: { path: D.s.path, r: D.rPost }, morph: [1.2, 1.6] })
      ],
      marks: [
        ringOn(C_COL, COL_R, tA, { name: 'Przecięcie okrężnicy', color: COL.cut, opacity: CUT_OP_JEJ }),
        ringOn(C_COL, COL_R, tH, { name: 'Przecięcie na wysokości połączenia esiczo-odbytniczego', color: COL.cut, opacity: [[0.05, 0], [0.55, 1], [1.2, 1], [1.4, 0]] }),
        { kind: 'wall', name: 'Powłoki brzuszne', center: [5.0, -7.0, 5.6], size: [12, 11], holes: [{ c: [6.0, -7.6], rx: 1.15, ry: 1.15 }], opacity: [[0.3, 0], [0.8, 1]] },
        { kind: 'stoma', name: 'Kolostomia końcowa', center: [6.0, -7.6, 5.8], rx: 1.15, ry: 1.15, opacity: [[2.5, 0], [2.9, 1]] }
      ].concat(domeLines(D, 0, null, 'Zamknięcie kikuta (stapler liniowy)', [[1.3, 0], [1.6, 1]])),
      endTarget: { pre: ICV },
      endText: { pre: 'Zastawka krętniczo-kątnicza w polu widzenia' },
      routePost: { prefix: [], branches: [
        { label: 'Przez kolostomię', sub: 'do okrężnicy zstępującej', steps: [{ pt: [6.0, -7.6, 9.2], note: 'Kolostomia końcowa w lewym dole biodrowym' }, { obj: 'prox', from: 1, to: [7.9, -1.5, -0.7], note: 'Za stomią — okrężnica zstępująca' }] },
        { label: 'Przez odbyt', sub: 'do kikuta odbytnicy', steps: [{ obj: 'rect', from: 1, to: addV(D.P0.toArray(), D.T0, 1.3), note: 'Kikut odbytnicy — ślepo zakończony, u szczytu linia zszywek' }],
          target: D.P0.toArray(), endText: 'Szczyt kikuta z linią zszywek' }
      ] }
    };
  })();

  /* ---------- Ileostomia pętlowa / dwulufowa ---------- */
  var ILE = [[3.5, -0.5, 0.4], [0.5, -0.8, 1.0], [-2.8, -1.6, 1.2], [-3.6, -3.6, 1.4], [-1.0, -4.4, 1.6], [2.2, -4.0, 1.6], [4.2, -5.4, 1.0], [1.2, -6.2, 1.4], [-2.0, -7.2, 1.4], [-4.4, -7.8, 1.0], [-6.0, -7.9, 0.6]];
  var C_ILE = curveOf(ILE);
  // loop: pętlowa (ramiona zbiegają się w jedną stomię, wspólne światło) / dwulufowa (dwa osobne otwory)
  // up: ramię wydzielnicze (proksymalne) w górnej części stomii; inaczej w dolnej
  function ileoAnat(loop, up) {
    var X = -4.4, Z = 5.6, yc = -4.85, half = loop ? 0.65 : 1.7;
    var yP = up ? yc + half : yc - half, yD = up ? yc - half : yc + half;
    var sp = [X, yP, Z + 0.75], sd = [X, yD, Z + 0.15];   // ramię wydzielnicze wywinięte (wyżej nad skórą), odprowadzające płasko
    var P, Dd;
    if (up) {
      P = [[3.5, -0.5, 0.4], [0.5, -0.8, 1.0], [-2.2, -1.5, 1.4], [-3.0, -2.6, 2.4], [-3.7, yP + 0.8, 3.8], [X + 0.05, yP + 0.25, 4.8], [X, yP, 5.5], sp];
      Dd = [sd, [X, yD, 4.9], [X + 0.3, yD - 0.8, 3.8], [-3.8, -7.0, 2.6], [-3.6, -7.5, 1.6], [-4.4, -7.8, 1.0], [-6.0, -7.9, 0.6]];
    } else {
      P = [[3.5, -0.5, 0.4], [0.5, -0.8, 1.0], [-2.8, -1.6, 1.2], [-2.6, -3.6, 1.6], [-2.0, -5.6, 2.2], [-3.1, yP - 0.9, 3.6], [X + 0.1, yP - 0.1, 4.8], [X, yP, 5.5], sp];
      Dd = [sd, [X - 0.1, yD + 0.2, 4.9], [-5.1, yD - 0.3, 3.7], [-5.1, -5.9, 3.0], [-4.7, -7.2, 2.0], [-4.4, -7.8, 1.0], [-6.0, -7.9, 0.6]];
    }
    var split = splitBy(C_ILE, 0.9, [P, Dd]), cut = split.cuts[0];
    var holes = loop ? [{ c: [X, yc], rx: 1.25, ry: 1.75 }] : [{ c: [X, yP], rx: 1.1, ry: 1.1 }, { c: [X, yD], rx: 1.1, ry: 1.1 }];
    var ST = [[2.4, 0], [2.85, 1]];
    var stomas = loop ? [{ kind: 'stoma', name: 'Ileostomia pętlowa — jedna stomia, dwa światła', center: [X, yc, Z + 0.2], rx: 1.25, ry: 1.75, opacity: ST }]
      : [{ kind: 'stoma', name: 'Otwór wydzielniczy (proksymalny)', center: [X, yP, Z + 0.3], rx: 1.1, ry: 1.1, opacity: ST },
         { kind: 'stoma', name: 'Otwór odprowadzający (dystalny)', center: [X, yD, Z + 0.15], rx: 1.05, ry: 1.05, opacity: ST }];
    var pos = up ? 'górne' : 'dolne', posM = up ? 'górny' : 'dolny', posL = up ? 'górnym' : 'dolnym', posG = up ? 'górnej' : 'dolnej', posO = up ? 'dolnej' : 'górnej';
    var objs = [
      { id: 'colon', name: 'Jelito grube', pre: { path: COLON, r: COL_R }, color: COLC.colon, mucosa: 'haustra', tint: MUC_C,
        labels: COL_LABELS.map(function (lb) { return L(lb[0], lb[1], ALL); }) },
      appObj({}),
      { id: 'prox', name: 'Jelito kręte', postName: 'Ramię wydzielnicze (proksymalne)', pre: split.parts[0], post: { path: P, r: flat(0.9) }, morph: [1.1, 1.9], open: [false, true],
        color: COLC.ti, mucosa: 'circular', tint: MUC.bowel, labels: [L('Jelito kręte', 0.35, PRE), L('Ramię wydzielnicze', 0.62, POST)] },
      { id: 'dist', name: 'Jelito kręte (końcowy odcinek)', postName: 'Ramię odprowadzające (dystalne)', pre: split.parts[1], post: { path: Dd, r: flat(0.9) }, morph: [1.1, 1.9], open: [true, false],
        color: COLC.ti, mucosa: 'circular', tint: MUC.bowel, labels: [L('Ramię odprowadzające', 0.4, POST)] }
    ];
    // pętla wyprowadzona w całości (szczyt nad skórą) do chwili otwarcia — widać, że jelito nie jest przecięte
    if (loop) objs.push({ id: 'apex', name: 'Szczyt pętli', noEndo: true, pre: { path: [[X, yP, Z + 0.3], [X, yc + (yP - yc) * 0.3, Z + 1.35], [X, yc + (yD - yc) * 0.3, Z + 1.35], [X, yD, Z + 0.3]], r: flat(0.88) },
      color: COLC.ti, mucosa: 'circular', tint: MUC.bowel, opacity: [[1.7, 0], [1.95, 1], [2.45, 1], [2.75, 0]], labels: [L('Pętla wyprowadzona — nieprzecięta', 0.5, [1.95, 2.45])] });
    return {
      cat: 'colon', id: 'ileo-' + (loop ? 'loop' : 'double') + (up ? '-up' : '-dn'), short: loop ? 'Ileostomia pętlowa' : 'Ileostomia dwulufowa',
      title: (loop ? 'Ileostomia pętlowa' : 'Ileostomia dwulufowa') + ' — ramię wydzielnicze ' + pos,
      sub: loop ? 'Pętla jelita krętego nieprzecięta: wyprowadzona przez powłoki, otwarta od strony przeciwkrezkowej i wszyta jako jedna stomia'
        : 'Jelito kręte przecięte; oba końce wyprowadzone osobno, obok siebie, z mostkiem skóry między nimi',
      notes: (loop ? [
        'Najczęściej ochronna, np. przy niskim zespoleniu odbytnicy lub zbiorniku J; zamykana po wygojeniu zespolenia.',
        'Jelito nie jest przecięte: tylna (krezkowa) ściana pętli zostaje ciągła i tworzy ostrogę między dwoma światłami jednej stomii.',
        'Ramię wydzielnicze (proksymalne) wywinięte, odprowadzające (dystalne) płaskie.'
      ] : [
        'Jelito kręte przecięte; oba końce wszyte jako dwa osobne otwory obok siebie, z mostkiem skóry między nimi.',
        'Otwór wydzielniczy (proksymalny) wywinięty; odprowadzający (dystalny) płaski — przetoka śluzowa.',
        'Oba końce w jednym miejscu — łatwiejsze późniejsze odtworzenie ciągłości.'
      ]).concat(['Ramię wydzielnicze w ' + posG + ' części stomii, odprowadzające w ' + posO + '. Ułożenie zależy od obrotu pętli i preferencji ośrodka; ważne, by worek dobrze obejmował światło wydzielnicze.']),
      focus: { t: [-3.5, -4.5, 3], k: 0.6 }, text: COL_TEXT,
      frames: loop ? {
        resect: ['Wybór pętli', 'Pętla końcowego odcinka jelita krętego, ok. 20–30 cm od zastawki; otwór w powłokach w prawym dole biodrowym.', 'Wybór pętli'],
        remove: ['Wyprowadzenie pętli', 'Nieprzecięta pętla przeciągnięta przez powłoki; ramię wydzielnicze w ' + posG + ' części otworu, często podparta pręcikiem.', 'Wyprowadzenie'],
        recon: ['Otwarcie i wszycie', 'Pętla otwarta poprzecznie od strony przeciwkrezkowej; ramię wydzielnicze wywinięte, oba światła wszyte w skórę jako jedna stomia.', 'Wszycie'],
        post: 'Jedna stomia, dwa światła rozdzielone ostrogą: wydzielnicze (' + pos + ', wywinięte) i odprowadzające (płaskie).',
        endoPost: 'Wybierz światło: wydzielnicze (jelito kręte w górę strumienia) albo odprowadzające (do zastawki i jelita grubego).'
      } : {
        resect: ['Przecięcie jelita', 'Jelito kręte przecięte staplerem liniowym ok. 20–30 cm od zastawki.', 'Przecięcie'],
        remove: ['Wyprowadzenie końców', 'Oba końce przeciągnięte przez powłoki osobno, obok siebie; wydzielniczy w ' + posL + ' otworze.', 'Wyprowadzenie'],
        recon: ['Wszycie stomii', 'Koniec wydzielniczy wywinięty i wszyty, odprowadzający wszyty płasko obok; między nimi mostek skóry.', 'Wszycie'],
        post: 'Dwa osobne otwory z mostkiem skóry: wydzielniczy (' + posM + ', wywinięty) i odprowadzający (płaski).',
        endoPost: 'Wybierz otwór: wydzielniczy (jelito kręte) albo odprowadzający (do zastawki i jelita grubego).'
      },
      endoTitles: ['Kolonoskopia z wejściem do jelita krętego', 'Endoskopia przez stomię'],
      objects: objs,
      marks: [
        ringOn(C_ILE, flat(0.9), cut, loop ? { name: 'Pętla na stomię', color: COL.mark, opacity: [[0.05, 0], [0.55, 1], [1.4, 1], [1.7, 0]] }
          : { name: 'Przecięcie jelita krętego', color: COL.cut, opacity: [[0.05, 0], [0.55, 1], [1.4, 1], [1.7, 0]] }),
        { kind: 'wall', name: 'Powłoki brzuszne', center: [-4.0, -5.0, 5.6], size: [11, 11], holes: holes, opacity: [[0.3, 0], [0.8, 1]] }
      ].concat(stomas),
      endTarget: { pre: null },
      routePost: { prefix: [], branches: [
        { label: 'Ramię wydzielnicze', sub: 'proksymalne — jelito kręte', steps: [{ pt: [X, yP, 9.2], note: 'Stomia — światło wydzielnicze' }, { obj: 'prox', from: 1, to: 0.6, note: 'Jelito kręte, w górę strumienia treści' }] },
        { label: 'Ramię odprowadzające', sub: 'dystalne — do zastawki i jelita grubego', steps: [{ pt: [X, yD, 9.2], note: 'Stomia — światło odprowadzające' }, { obj: 'dist', note: 'Wyłączony odcinek jelita krętego do zastawki' }, { obj: 'colon', from: 0.035, to: 0.07, note: 'Kątnica' }] }
      ] }
    };
  }

  /* ---------- rozwidlenia tras endoskopowych po operacji ---------- */
  function branchify(an, k, first, second) {
    var r = an.routePost;
    an.routePost = { prefix: r.slice(0, k), branches: [
      { label: first[0], sub: first[1], steps: r.slice(k), target: 'papilla', endText: 'Brodawka Vatera w polu widzenia' },
      { label: second[0], sub: second[1], steps: second[2] } ] };
    return an;
  }
  var BIL = ['Pętla biliopankreatyczna', 'do brodawki Vatera'], AFFB = ['Pętla doprowadzająca', 'biliopankreatyczna, do brodawki'];
  var CCB = function (id) { return ['Kanał wspólny', 'dalej z treścią pokarmową', [{ obj: id, note: 'Kanał wspólny — dalej w dół' }]]; };
  var EFFB = function (id) { return ['Pętla odprowadzająca', 'alimentacyjna, dalej w dół', [{ obj: id, note: 'Pętla odprowadzająca' }]]; };
  var B2 = b2(false), B2BR = b2(true);
  branchify(TG, 2, BIL, CCB('cc')); branchify(RYGB, 3, BIL, CCB('cc')); branchify(DGRY, 3, BIL, CCB('cc'));
  branchify(OAGB, 2, AFFB, EFFB('eff')); branchify(B2, 2, AFFB, EFFB('eff')); branchify(B2BR, 2, AFFB, EFFB('eff'));



