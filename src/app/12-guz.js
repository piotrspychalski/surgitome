  /* ---------- guz: przesuwalny znacznik na jelicie (kadr „Prawidłowa”), położenie wspólne dla kolejnych kadrów, wariantów i zabiegów ----------
     Położenie zapisane we współrzędnych anatomii prawidłowej (localStorage); przy budowie modelu przypinane do najbliższego odcinka (obiekt, t, kierunek),
     więc guz przesuwa się i znika razem ze swoim odcinkiem (np. z preparatem). */
  var GUZ_KEY = 'surgitome-guz-pos', GUZ_DEF = [-6.64, -1.5, 1.57];
  function guzPos() { try { var p = JSON.parse(localStorage.getItem(GUZ_KEY)); if (Array.isArray(p) && p.length === 3) return p; } catch (e) {} return GUZ_DEF.slice(); }
  function guzBind(P0, only) {
    var p = new V3().fromArray(P0), best = null;
    M.objs.forEach(function (o) {
      if (o.def.solid || o.def.organ || (only && o !== only)) return;
      var st = stateAt(o, 0), t = A.nearestT(st.curve, p, 400), c = st.curve.getPointAt(t), d = Math.abs(c.distanceTo(p) - st.r(t));
      if (!best || d < best.d) { var n = p.clone().sub(c); if (n.lengthSq() < 1e-6) n.set(0, 0, 1); best = { d: d, o: o, t: t, n: n.normalize() }; }
    });
    return best;
  }
  function guzGeo() {
    var g = new THREE.IcosahedronGeometry(0.62, 3), pa = g.attributes.position, v = new V3();
    for (var i = 0; i < pa.count; i++) { v.fromBufferAttribute(pa, i); var k = 1 + 0.12 * Math.sin(v.x * 7.1) * Math.sin(v.y * 6.3 + 1) + 0.08 * Math.sin(v.z * 9.7); v.multiplyScalar(k); pa.setXYZ(i, v.x, v.y, v.z * 0.62); }
    g.computeVertexNormals(); return g;
  }
  function tumourAttach() {
    var mat = track(new THREE.MeshStandardMaterial({ color: '#7a1522', roughness: 0.55, transparent: true })), mesh = new THREE.Mesh(track(guzGeo()), mat);
    M.group.add(mesh);
    var el = mkLabel('Guz', 'przeciągnij, aby przesunąć', '#b3263a', 'seg'), el2 = mkLabel('Guz', '', '#b3263a', 'seg');
    var tool = { d: { type: 'guz' }, grp: new THREE.Group(), overlay: false, el: el, el2: el2, mesh: mesh, bind: guzBind(guzPos()),
      update: function (m) {
        var b = this.bind, o = b && b.o, on = S.tumour && !!o;
        if (!on) { mesh.visible = false; this.alpha = 0; return; }
        var st = o.st, P = st.curve.getPointAt(b.t);
        mesh.position.copy(P).addScaledVector(b.n, st.r(b.t) * 0.88).add(o.grp.position);
        mesh.quaternion.setFromUnitVectors(new V3(0, 0, 1), b.n);
        var op = M.an.single ? 1 : o.op; // na slajdzie wyboru zakresu jelito przygasa, guz nie
        mesh.visible = o.grp.visible && op > 0.05; mat.opacity = op;
        var drag = m < 1e-3 && !endo.active && !ct.on;
        this.alpha = mesh.visible ? op : 0;
        this.anchor = drag ? mesh.position.clone().addScaledVector(b.n, 0.5) : null;
        this.anchor2 = drag ? null : mesh.position.clone().addScaledVector(b.n, 0.5);
      } };
    M.tools.push(tool); M.tumour = tool;
  }
  // przeciąganie: tylko w kadrze z anatomią prawidłową (m = 0), poza endoskopią, TK i widokiem podzielonym
  window.__sgTest.tumour = function () { return M && M.tumour && M.tumour.mesh.visible ? M.tumour.mesh.position.toArray() : null; };
  var guzRay = new THREE.Raycaster(), guzNdc = new THREE.Vector2(), guzDrag = null;
  function guzPick(e, targets) {
    var r = viewport.getBoundingClientRect(), x = e.clientX - r.left - view.x, y = e.clientY - r.top - view.y;
    if (x < 0 || y < 0 || x > view.w || y > view.h) return [];
    guzNdc.set(x / view.w * 2 - 1, -(y / view.h) * 2 + 1); guzRay.setFromCamera(guzNdc, orbitCam);
    return guzRay.intersectObjects(targets, false);
  }
  function guzActive() { return M && M.tumour && S.tumour && !SPLIT.on && !endo.active && !ct.on && S.m < 1e-3 && M.tumour.mesh.visible; }
  function guzSurfaces() { return M.objs.filter(function (o) { return o.grp.visible && !o.def.solid && !o.def.organ; }).map(function (o) { return o.outer; }); }
  viewport.addEventListener('pointerdown', function (e) {
    if (!guzActive() || !guzPick(e, [M.tumour.mesh]).length) return;
    e.stopPropagation(); e.preventDefault(); // nie obracaj kamery
    guzDrag = { id: e.pointerId }; controls.enabled = false; viewport.style.cursor = 'grabbing'; viewport.classList.add('dragging');
    try { viewport.setPointerCapture(e.pointerId); } catch (err) {}
  }, true);
  viewport.addEventListener('pointermove', function (e) {
    if (!guzDrag) { if (guzActive() && e.pointerType === 'mouse') viewport.style.cursor = guzPick(e, [M.tumour.mesh]).length ? 'grab' : ''; return; }
    var hit = guzPick(e, guzSurfaces())[0]; if (!hit) return;
    var o = M.objs.filter(function (q) { return q.outer === hit.object; })[0], b = guzBind(hit.point.toArray(), o);
    if (b) { M.tumour.bind = b; M.tumour.last = hit.point.toArray(); applyM(); }
  }, true);
  function guzEnd() {
    if (!guzDrag) return;
    guzDrag = null; viewport.style.cursor = ''; viewport.classList.remove('dragging'); if (!tw) controls.enabled = true;
    if (M && M.tumour && M.tumour.last) try { localStorage.setItem(GUZ_KEY, JSON.stringify(M.tumour.last.map(function (x) { return +x.toFixed(3); }))); } catch (e) {}
  }
  viewport.addEventListener('pointerup', guzEnd, true);
  viewport.addEventListener('pointercancel', guzEnd, true);
