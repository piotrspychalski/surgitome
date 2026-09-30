  /* ---------- tekstury ---------- */
  var texCache = {};
  function baseTex(kind) {
    if (texCache[kind]) return texCache[kind];
    var S = 256, c = document.createElement('canvas'); c.width = c.height = S;
    var g = c.getContext('2d'), img = g.createImageData(S, S), d = img.data;
    for (var y = 0; y < S; y++) for (var x = 0; x < S; x++) {
      var u = x / S, v = y / S, f, w;
      if (kind === 'circular') { w = Math.sin(2 * Math.PI * (4 * u + 0.06 * Math.sin(2 * Math.PI * v) + 0.03 * Math.sin(6 * Math.PI * v))); f = Math.pow(0.5 + 0.5 * w, 3); }
      else if (kind === 'haustra') { w = Math.sin(2 * Math.PI * (2.5 * u + 0.08 * Math.sin(6 * Math.PI * v))); f = Math.pow(0.5 + 0.5 * w, 6) * (0.75 + 0.25 * Math.cos(6 * Math.PI * v)); }
      else if (kind === 'rugae') { w = Math.sin(2 * Math.PI * (7 * v + 0.18 * Math.sin(4 * Math.PI * u))); f = 0.9 * Math.pow(0.5 + 0.5 * w, 2.5); }
      else { f = 0.3 + 0.15 * Math.sin(2 * Math.PI * (3 * u + v)) * Math.sin(4 * Math.PI * v); }
      var val = Math.max(0, Math.min(1, 0.7 + 0.3 * f + (Math.random() - 0.5) * 0.07));
      var k = (y * S + x) * 4; d[k] = d[k + 1] = d[k + 2] = Math.round(val * 255); d[k + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    var t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.encoding = THREE.sRGBEncoding;
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return (texCache[kind] = t);
  }
  var dashTex = (function () {
    var c = document.createElement('canvas'); c.width = 64; c.height = 4; var g = c.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 0, 64, 4); g.fillStyle = '#fff'; g.fillRect(0, 0, 40, 4);
    var t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
  })();

  /* ---------- stan ---------- */
  var S = { cat: 'fav', an: 0, frame: 0, m: 0, playing: true, labels: true, captions: true, drift: true, highlight: null, meso: true };
  S.tumour = true;
  try { if (localStorage.getItem('surgitome-meso') === '0') S.meso = false; if (localStorage.getItem('surgitome-guz') === '0') S.tumour = false; } catch (e) {}
  var M = null, FR = [];
  var endo = { active: false, playing: false, s: 0, rate: 1, base: 3.2, route: null };
  var trash = [];
  function track(o) { trash.push(o); return o; }

  /* ---------- obiekty ---------- */
  function makeObj(def) {
    var pre = def.pre, post = def.post || def.pre;
    var a = A.curveOf(pre.path).getSpacedPoints(K - 1), b = A.curveOf(post.path).getSpacedPoints(K - 1), rA = [], rB = [];
    for (var i = 0; i < K; i++) { var t = i / (K - 1); rA.push(pre.r(t)); rB.push(post.r(t)); }
    var cols = (def.colors || [[0, def.color]]).map(function (c) { return [c[0], new THREE.Color(c[1])]; });
    var len = A.curveOf(pre.path).getLength();
    var tex = track(baseTex(def.mucosa).clone()); tex.needsUpdate = true;
    tex.repeat.set(Math.max(1, Math.round(len / (def.mucosa === 'circular' ? 3.4 : def.mucosa === 'haustra' ? 3.2 : def.mucosa === 'rugae' ? 5 : 6))), 1);
    var outerMat = track(new THREE.MeshStandardMaterial({ color: cols[0][1], roughness: def.solid ? 0.32 : def.organ ? 0.62 : 0.42, metalness: def.solid ? 0.55 : 0.02 }));
    var innerMat = track(new THREE.MeshStandardMaterial({ color: def.tint || '#e7a097', map: tex, bumpMap: tex, bumpScale: 0.05, roughness: 0.3, metalness: 0, side: THREE.BackSide }));
    var grp = new THREE.Group(), outer = new THREE.Mesh(new THREE.BufferGeometry(), outerMat), inner = new THREE.Mesh(outer.geometry, innerMat);
    grp.add(outer, inner);
    var o = { def: def, A: a, B: b, rA: rA, rB: rB, cols: cols, f: -1, grp: grp, outer: outer, inner: inner, cache: {}, op: 1, isT: false };
    o.labels = (def.labels || []).map(function (L) { return { L: L, el: mkLabel(L.text, L.sub, cols[cols.length - 1][1].getStyle(), 'seg') }; });
    return o;
  }
  function stateAt(o, f) {
    var key = f.toFixed(4);
    if (o.cache[key]) return o.cache[key];
    var lf = o.def.lift, s = lf ? Math.sin(Math.PI * f) : 0;
    var pts = o.A.map(function (p, i) {
      var q = p.clone().lerp(o.B[i], f);
      if (s) { var h = Math.min(lf.max, lf.k * p.distanceTo(o.B[i])) * s; q.x += lf.dir[0] * h; q.y += lf.dir[1] * h; q.z += lf.dir[2] * h; }
      return q;
    });
    var rs = o.rA.map(function (r, i) { return r + (o.rB[i] - r) * f; });
    var c = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    var rFn = function (t) { var x = t * (K - 1), i = Math.floor(x); return i >= K - 1 ? rs[K - 1] : rs[i] + (rs[i + 1] - rs[i]) * (x - i); };
    var st = { curve: c, r: rFn, len: c.getLength() };
    if (f === 0 || f === 1) o.cache[key] = st;
    return st;
  }
  // przebudowa rury w trakcie przemiany: stała liczba wierzchołków na obiekt, bufory GPU aktualizowane w miejscu
  function setF(o, f) {
    var step = MOBILE ? 0.012 : 0.004;
    if (o.f >= 0 && Math.abs(f - o.f) < step && !(f === 1 && o.f !== 1) && !(f === 0 && o.f !== 0)) return;
    o.f = f;
    var st = stateAt(o, f);
    if (!o.T) o.T = o.def.morph ? Math.max(40, Math.round(Math.max(stateAt(o, 0).len, stateAt(o, 1).len) * 5)) : Math.max(40, Math.round(st.len * 5));
    var g = A.buildTube(st.curve, st.r, o.T, 26), cur = o.geo;
    if (cur && cur.attributes.position.count === g.attributes.position.count) {
      ['position', 'normal', 'uv'].forEach(function (k) { if (cur.attributes[k] && g.attributes[k]) { cur.attributes[k].array.set(g.attributes[k].array); cur.attributes[k].needsUpdate = true; } });
      cur.computeBoundingSphere(); g.dispose();
    } else {
      if (cur) cur.dispose();
      o.geo = g; o.outer.geometry = g; o.inner.geometry = g;
    }
    o.st = st;
  }
  function morphF(o, m) { var w = o.def.morph; return w ? sm((m - w[0]) / (w[1] - w[0])) : 0; }

  function dashMat(color, len, dash, endoLook) {
    var at = track(dashTex.clone()); at.needsUpdate = true; at.repeat.set(Math.max(2, Math.round(len / (dash || 0.5))), 1);
    return endoLook ? track(new THREE.MeshStandardMaterial({ color: color, metalness: 0.6, roughness: 0.3, alphaMap: at, alphaTest: 0.5, side: THREE.DoubleSide }))
      : at;
  }
  function makeMark(d) {
    var defCol = d.color || (d.kind === 'wall' ? '#e2b59c' : d.kind === 'stoma' ? '#d0555a' : '#ffffff');
    var mk = { def: d, kind: d.kind, baseOp: 1, cols: (d.colors || [[0, defCol]]).map(function (c) { return [c[0], new THREE.Color(c[1])]; }) };
    if (d.kind === 'ring') {
      var mat = track(new THREE.MeshStandardMaterial({ color: mk.cols[0][1], emissive: mk.cols[0][1].clone().multiplyScalar(0.35), roughness: 0.4, transparent: true }));
      var mesh = new THREE.Mesh(track(new THREE.TorusGeometry(d.r, 0.11, 10, 56)), mat);
      mesh.position.fromArray(d.pos);
      mesh.quaternion.setFromUnitVectors(new V3(0, 0, 1), new V3().fromArray(d.tan).normalize());
      mk.mesh = mesh; mk.mat = mat; mk.anchor = mesh.position.clone(); mk.cut = d.color === A.COL.cut;
      if (d.endo) {
        var ri = d.r - 0.27;
        mk.endoMesh = new THREE.Mesh(track(new THREE.TorusGeometry(ri, 0.06, 8, 96)), dashMat(d.color, 2 * Math.PI * ri, d.dash || 0.2, true));
        mk.endoMesh.position.copy(mesh.position); mk.endoMesh.quaternion.copy(mesh.quaternion);
      }
    } else if (d.kind === 'line' || d.kind === 'loop') {
      var closed = d.kind === 'loop', curve = new THREE.CatmullRomCurve3(d.pts.map(function (p) { return new V3().fromArray(p); }), closed, 'centripetal'), len = curve.getLength();
      var solidLook = d.kind === 'loop' || d.endo;
      var lm = solidLook ? dashMat(mk.cols[0][1], len, d.dash || 0.3, true) : track(new THREE.MeshBasicMaterial({ color: mk.cols[0][1], alphaMap: dashMat(null, len, 0.55), transparent: true, depthTest: false, depthWrite: false }));
      if (solidLook) { lm.transparent = true; }
      mk.mesh = new THREE.Mesh(track(new THREE.TubeGeometry(curve, closed ? 144 : 120, solidLook ? 0.075 : 0.1, 6, closed)), lm);
      mk.mesh.renderOrder = 6; mk.mat = lm;
      var sum = new V3(); d.pts.forEach(function (p) { sum.add(new V3().fromArray(p)); }); mk.anchor = closed ? sum.multiplyScalar(1 / d.pts.length) : curve.getPointAt(0.5);
      if (d.endo && d.endoPts) {
        var ec = new THREE.CatmullRomCurve3(d.endoPts.map(function (p) { return new V3().fromArray(p); }), closed, 'centripetal');
        mk.endoMesh = new THREE.Mesh(track(new THREE.TubeGeometry(ec, closed ? 144 : 120, 0.05, 6, closed)), dashMat(d.color || '#8f99a3', ec.getLength(), d.dash || 0.14, true));
      }
    } else if (d.kind === 'wall') {
      var w = d.size[0], h = d.size[1], cx = d.center[0], cy = d.center[1];
      var shape = new THREE.Shape(); shape.moveTo(-w / 2, -h / 2); shape.lineTo(w / 2, -h / 2); shape.lineTo(w / 2, h / 2); shape.lineTo(-w / 2, h / 2); shape.closePath();
      d.holes.forEach(function (ho) { var p = new THREE.Path(); p.absellipse(ho.c[0] - cx, ho.c[1] - cy, ho.rx, ho.ry, 0, Math.PI * 2, true); shape.holes.push(p); });
      var sg = track(new THREE.ShapeGeometry(shape, 48));
      var wm = track(new THREE.MeshStandardMaterial({ color: mk.cols[0][1], roughness: 0.8, transparent: true, opacity: 0.28, depthWrite: false, side: THREE.DoubleSide }));
      mk.mesh = new THREE.Mesh(sg, wm); mk.mesh.position.fromArray(d.center); mk.mat = wm; mk.baseOp = 0.28;
      mk.endoMesh = new THREE.Mesh(sg, track(new THREE.MeshStandardMaterial({ color: mk.cols[0][1], roughness: 0.75, side: THREE.DoubleSide })));
      mk.endoMesh.position.fromArray(d.center);
      mk.anchor = new V3(cx + w / 2 - 1.2, cy + h / 2 - 0.8, d.center[2]);
    } else if (d.kind === 'stoma') {
      var sgm = track(new THREE.TorusGeometry(1, 0.3, 16, 64)), smat = track(new THREE.MeshStandardMaterial({ color: mk.cols[0][1], roughness: 0.35, transparent: true }));
      mk.mesh = new THREE.Mesh(sgm, smat); mk.mesh.position.fromArray(d.center); mk.mesh.scale.set(d.rx, d.ry, 1); mk.mat = smat;
      mk.endoMesh = new THREE.Mesh(sgm, track(new THREE.MeshStandardMaterial({ color: mk.cols[0][1], roughness: 0.3 })));
      mk.endoMesh.position.copy(mk.mesh.position); mk.endoMesh.scale.copy(mk.mesh.scale);
      mk.anchor = new V3(d.center[0] + d.rx + 0.4, d.center[1], d.center[2]);
    }
    var lk = d.kind === 'ring' && !mk.cut ? 'anast' : d.kind === 'wall' ? 'ghost' : d.kind === 'stoma' ? 'seg' : 'cut';
    mk.el = d.name ? mkLabel(d.name, '', mk.cols[0][1].getStyle(), lk) : null;
    if (d.postName) mk.el2 = mkLabel(d.postName, '', A.COL.staple, 'cut');
    return mk;
  }

  function mkLabel(text, sub, color, kind) {
    var el = document.createElement('div'); el.className = 'lbl lbl-' + kind;
    el.innerHTML = '<i></i><span><b></b>' + (sub ? '<small></small>' : '') + '</span>';
    el.querySelector('i').style.background = color;
    setT(el.querySelector('b'), text); if (sub) setT(el.querySelector('small'), sub);
    labelsEl.appendChild(el); return el;
  }


