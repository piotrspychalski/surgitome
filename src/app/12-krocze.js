  /* ---------- krocze w amputacji brzuszno-kroczowej (TOOL_EXT.krocze): skóra krocza, eliptyczne cięcie wokół odbytu, rana po wydobyciu preparatu
     i jej zamknięcie — rana zwęża się od przodu do tyłu, za nią linia szwu i szwy węzełkowe skóry.
     Układ lokalny: x — w bok, y — do przodu (oś przednio-tylna krocza), z — na zewnątrz (oś kanału odbytu). Skóra okołoodbytowa odchodzi z preparatem. */
  function makeKrocze(d) {
    var C = new V3().fromArray(d.c), N = new V3().fromArray(d.n).normalize(), AP = new V3().fromArray(d.ap).normalize(), LR = new V3().crossVectors(AP, N).normalize();
    var q = basisQ(LR, AP), a = d.a, b = d.b;
    function at(x, y, z) { return C.clone().addScaledVector(LR, x).addScaledVector(AP, y).addScaledVector(N, z || 0); }
    var grp = new THREE.Group(), plane = new THREE.Group(), specG = new THREE.Group();
    plane.position.copy(C); plane.quaternion.copy(q); specG.quaternion.copy(q); grp.add(plane, specG);
    function ell(rx, ry, hole) {
      var sh = new THREE.Shape(); sh.absellipse(0, 0, rx, ry, 0, Math.PI * 2, false);
      if (hole) { var h = new THREE.Path(); h.absellipse(0, 0, hole, hole, 0, Math.PI * 2, true); sh.holes.push(h); }
      return track(new THREE.ShapeGeometry(sh, 48));
    }
    // skóra krocza (półprzezroczysta, jak powłoki przy stomii) i skóra okołoodbytowa z otworem odbytu (odchodzi z preparatem)
    var skinM = track(new THREE.MeshStandardMaterial({ color: '#e2b59c', roughness: 0.8, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
    plane.add(new THREE.Mesh(ell(d.skin[0], d.skin[1]), skinM));
    var periM = track(new THREE.MeshStandardMaterial({ color: '#c98f7c', roughness: 0.7, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
    var peri = new THREE.Mesh(ell(b, a, d.anus), periM); peri.position.z = 0.02; specG.add(peri);
    // linia cięcia: elipsa rysowana w kadrze zakresu
    var incPts = []; for (var i = 0; i <= 96; i++) { var th = i / 96 * Math.PI * 2; incPts.push(new V3(b * 1.03 * Math.sin(th), a * 1.03 * Math.cos(th), 0.05)); }
    var incGeo = track(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(incPts, true), 192, 0.08, 6, true));
    var incM = track(new THREE.MeshStandardMaterial({ color: A.COL.cut, emissive: A.COL.cut, emissiveIntensity: 0.3, roughness: 0.5, transparent: true }));
    var inc = new THREE.Mesh(incGeo, incM); plane.add(inc);
    // rana: pas wzdłuż osi przednio-tylnej, szerokość b·√(1 − (y/a)²); zamykanie od przodu (y = a) do tyłu (y = −a)
    var K = 48, wPos = new Float32Array((K + 1) * 2 * 3), wIdx = [];
    for (var k = 0; k < K; k++) { var p0 = 2 * k; wIdx.push(p0, p0 + 1, p0 + 2, p0 + 1, p0 + 3, p0 + 2); }
    var wGeo = track(new THREE.BufferGeometry()); wGeo.setAttribute('position', new THREE.BufferAttribute(wPos, 3)); wGeo.setIndex(wIdx);
    var woundM = track(new THREE.MeshBasicMaterial({ color: '#5a1414', side: THREE.DoubleSide, transparent: true }));
    var wound = new THREE.Mesh(wGeo, woundM); plane.add(wound);
    var rimM = track(new THREE.MeshStandardMaterial({ color: '#b5524a', roughness: 0.6 }));
    var scarGeo = track(new THREE.TubeGeometry(new THREE.LineCurve3(new V3(0, a, 0.05), new V3(0, -a, 0.05)), 40, 0.07, 6, false));
    var scar = new THREE.Mesh(scarGeo, rimM); plane.add(scar);
    function setWound(open, yz) {
      for (var j = 0; j <= K; j++) {
        var y = a - 2 * a * j / K, w = b * Math.sqrt(Math.max(0, 1 - (y / a) * (y / a))) * open * (1 - sm((y - yz) / 0.5 + 0.5));
        wPos.set([-w, y, 0.04, w, y, 0.04], j * 6);
      }
      wGeo.attributes.position.needsUpdate = true; wGeo.computeBoundingSphere();
    }
    // szwy węzełkowe skóry: pętle w poprzek linii szwu, zakładane za zamykającą się raną
    var stM = track(new THREE.MeshStandardMaterial({ color: '#2b3a67', roughness: 0.45 })), stG = track(new THREE.TorusGeometry(0.42, 0.06, 6, 18, Math.PI));
    var st = [];
    for (var s = 0; s < d.stitches; s++) { var sm1 = new THREE.Mesh(stG, stM); sm1.rotation.x = Math.PI / 2; sm1.position.set(0, a - (s + 0.5) * 2 * a / d.stitches, 0.04); plane.add(sm1); st.push(sm1); }
    var L1 = { el: mkLabel('Cięcie krocza wokół odbytu', 'eliptyczne', A.COL.cut, 'cut'), p: at(b * 1.05, 0, 0.1) },
      L2 = { el: mkLabel('Rana krocza', 'po wydobyciu preparatu', '#5a1414', 'seg'), p: at(b * 0.6, 0, 0.1) },
      L3 = { el: mkLabel('Zamknięcie krocza', 'warstwowo, skóra szwami węzełkowymi', '#2b3a67', 'seg'), p: at(b * 1.15, -a * 0.35, 0.1) };
    var spec = null;
    return { d: d, grp: grp, overlay: false, labels: [L1, L2, L3],
      update: function (m) {
        var sk = sm((m - d.inc[0]) / 0.5);
        skinM.opacity = 0.42 * sk; plane.visible = sk > 0.01;
        // skóra okołoodbytowa: z preparatem (położenie i krycie obiektu preparatu)
        spec = spec || (M.byId && M.byId.specS);
        var so = spec ? spec.op : 1;
        specG.position.copy(C); if (spec) specG.position.add(spec.grp.position);
        periM.opacity = 0.55 * sk * Math.min(1, so * 1.4); specG.visible = periM.opacity > 0.01 && m < d.offT[1];
        var tInc = clamp01((m - d.inc[0]) / (d.inc[1] - d.inc[0]));
        inc.visible = tInc > 0 && m < d.open[1]; incGeo.setDrawRange(0, Math.round(tInc * 192) * 6 * 6);
        var open = sm((m - d.open[0]) / (d.open[1] - d.open[0])), tc = clamp01((m - d.close[0]) / (d.close[1] - d.close[0])), yz = a + 0.3 - (2 * a + 0.6) * tc;
        wound.visible = open > 0.01 && tc < 1; if (wound.visible) setWound(open, yz);
        scar.visible = tc > 0; scarGeo.setDrawRange(0, Math.round(tc * 40) * 6 * 6);
        st.forEach(function (sx) { var on = tc > 0 && sx.position.y > yz; sx.visible = on; if (on) sx.scale.setScalar(Math.max(0.05, sm((sx.position.y - yz) / 0.4))); });
        L1.anchor = L1.p; L1.alpha = inc.visible && m < d.open[0] + 0.05 ? 1 : 0;
        L2.anchor = L2.p; L2.alpha = open > 0.5 && tc <= 0 ? 1 : 0;
        L3.anchor = L3.p; L3.alpha = tc > 0 ? 1 : 0;
      } };
  }
  TOOL_EXT.krocze = makeKrocze;
