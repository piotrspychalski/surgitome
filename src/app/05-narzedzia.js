  /* ---------- narzędzia: stapler liniowy, stapler okrężny, szew V-Loc ---------- */
  function metal(col, rough) { return track(new THREE.MeshStandardMaterial({ color: col, metalness: 0.75, roughness: rough || 0.32, transparent: true })); }
  function basisQ(X, Y) { var Z = new V3().crossVectors(X, Y).normalize(); var m4 = new THREE.Matrix4().makeBasis(X, Y, Z); return new THREE.Quaternion().setFromRotationMatrix(m4); }
  function cyl(r, len, mat, seg) { var g = track(new THREE.CylinderGeometry(r, r, len, seg || 20)); g.rotateZ(Math.PI / 2); return new THREE.Mesh(g, mat); } // oś X
  function makeGia(d) {
    var X = new V3().fromArray(d.j).normalize(), Y = new V3().fromArray(d.s).normalize(); Y.sub(X.clone().multiplyScalar(Y.dot(X))).normalize();
    var grp = new THREE.Group(), jaws = new THREE.Group(); grp.add(jaws);
    grp.quaternion.copy(basisQ(X, Y)); grp.position.fromArray(d.at);
    var L = d.len, mMetal = metal('#c3cad1'), mCart = track(new THREE.MeshStandardMaterial({ color: '#6b3f99', roughness: 0.5, transparent: true })), mShaft = metal('#3b4148', 0.4);
    var anvil = new THREE.Mesh(track(new THREE.BoxGeometry(L, 0.16, 0.44)), mMetal);
    var cart = new THREE.Mesh(track(new THREE.BoxGeometry(L, 0.3, 0.5)), mCart);
    var strip = new THREE.Mesh(track(new THREE.BoxGeometry(L * 0.94, 0.02, 0.12)), metal('#e5e9ec'));
    var up = new THREE.Group(), lo = new THREE.Group();
    up.add(anvil); lo.add(cart, strip); strip.position.y = 0.16;
    jaws.add(up, lo);
    var knife = new THREE.Mesh(track(new THREE.BoxGeometry(0.22, 0.36, 0.08)), track(new THREE.MeshStandardMaterial({ color: '#ff3b30', emissive: '#7a0d08', transparent: true })));
    jaws.add(knife);
    var joint = new THREE.Mesh(track(new THREE.SphereGeometry(0.32, 16, 12)), mShaft); joint.position.x = -L / 2 - 0.25;
    var shaft = cyl(0.3, 12, mShaft); shaft.position.x = -L / 2 - 6.4;
    grp.add(joint, shaft);
    var mats = [mMetal, mCart, mShaft, knife.material, strip.material];
    var el = mkLabel(d.side ? 'Stapler liniowy — zespolenie bok-do-boku' : 'Stapler liniowy (typu Endo GIA)', '', '#c3cad1', 'seg');
    return { d: d, grp: grp, overlay: true, X: X, up: up, lo: lo, knife: knife, mats: mats, el: el, base: new V3().fromArray(d.at), L: L, anvil: anvil, cart: cart,
      update: function (m) {
        var tau = (m - d.w[0]) / (d.w[1] - d.w[0]), on = tau > 0 && tau < 1;
        grp.visible = on; this.alpha = on ? 1 : 0; if (!on) return;
        var close = 0.1, gap, slide = 0, fade = 1, kn = -1;
        if (tau < 0.22) { gap = d.open; slide = 1 - sm(tau / 0.22); fade = sm(tau / 0.08); }
        else if (tau < 0.42) gap = d.open + (close - d.open) * sm((tau - 0.22) / 0.2);
        else if (tau < 0.6) { gap = close; kn = (tau - 0.42) / 0.18; }
        else if (tau < 0.72) gap = close + (d.open * 0.8 - close) * sm((tau - 0.6) / 0.12);
        else { gap = d.open * 0.8; slide = sm((tau - 0.72) / 0.28); fade = 1 - sm((tau - 0.85) / 0.15); }
        up.position.y = gap + 0.08; lo.position.y = -gap - 0.15;
        knife.visible = kn >= 0; knife.position.x = -L / 2 + L * Math.max(0, kn);
        grp.position.copy(this.base).addScaledVector(this.X, -slide * (L + 4));
        var flash = tau > 0.56 && tau < 0.64 ? 0.5 : 0;
        this.anvil.material.emissive.setScalar(flash); 
        mats.forEach(function (mm) { mm.opacity = fade; });
        this.anchor = grp.position.clone().addScaledVector(this.X, -L / 2 - 1.2);
        this.alpha = fade;
      } };
  }
  function makeEea(d) {
    var dir = new V3().fromArray(d.dir).normalize(), face = new V3().fromArray(d.face);
    var grp = new THREE.Group(), head = new THREE.Group(), anv = new THREE.Group();
    grp.add(head, anv);
    var mBody = metal('#aeb6be'), mDark = metal('#4a525a', 0.4), mFace = metal('#dfe4e8');
    var hq = new THREE.Quaternion().setFromUnitVectors(new V3(0, 1, 0), dir);
    var hc = new THREE.Mesh(track(new THREE.CylinderGeometry(0.9, 0.78, 1.0, 32)), mBody); hc.position.y = -0.5;
    var ringF = new THREE.Mesh(track(new THREE.TorusGeometry(0.66, 0.08, 8, 40)), mFace); ringF.rotation.x = Math.PI / 2; ringF.position.y = 0.01;
    var troc = new THREE.Mesh(track(new THREE.CylinderGeometry(0.03, 0.08, 1.0, 12)), mFace); troc.position.y = 0.5;
    var trocG = new THREE.Group(); trocG.add(troc);
    head.add(hc, ringF, trocG); head.quaternion.copy(hq); head.position.copy(face);
    var aDisk = new THREE.Mesh(track(new THREE.CylinderGeometry(0.88, 0.88, 0.26, 32)), mDark); aDisk.position.y = 0.13;
    var aCone = new THREE.Mesh(track(new THREE.ConeGeometry(0.88, 0.45, 32)), mDark); aCone.position.y = 0.48;
    var aShaft = new THREE.Mesh(track(new THREE.CylinderGeometry(0.1, 0.1, 1.0, 12)), mBody); aShaft.position.y = -0.5;
    anv.add(aDisk, aCone, aShaft); anv.quaternion.copy(hq);
    var pts = [face.clone().addScaledVector(dir, -1.0)].concat(d.path.map(function (p) { return new V3().fromArray(p); }));
    var shaft = new THREE.Mesh(track(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'centripetal'), 80, 0.42, 12, false)), mDark);
    grp.add(shaft);
    var mats = [mBody, mDark, mFace];
    var anvilStart = face.clone().addScaledVector(dir, 1.5), anvilDock = face.clone().addScaledVector(dir, 0.28);
    var down = new V3().fromArray(d.path[d.path.length - 1]).sub(face).normalize();
    var el = mkLabel('Stapler okrężny (typu EEA)', '', '#aeb6be', 'seg'), el2 = mkLabel('Kowadełko', '', '#4a525a', 'seg');
    return { d: d, grp: grp, overlay: true, mats: mats, el: el, el2: el2,
      update: function (m) {
        var tau = (m - d.w[0]) / (d.w[1] - d.w[0]), on = tau > 0 && tau < 1;
        grp.visible = on; this.alpha = on ? 1 : 0; if (!on) return;
        var ins = 0, tro = 0, dock = 0, out = 0, fade = 1;
        if (tau < 0.18) { ins = 1 - sm(tau / 0.18); fade = sm(tau / 0.06); }
        tro = sm((tau - 0.18) / 0.14);
        dock = sm((tau - 0.34) / 0.16);
        if (tau > 0.72) { out = sm((tau - 0.72) / 0.28); fade = 1 - sm((tau - 0.86) / 0.14); }
        var off = down.clone().multiplyScalar(4 * ins + 4 * out);
        head.position.copy(face).add(off); grp.children.forEach(function (ch) { if (ch !== head && ch !== anv) ch.position.copy(off); });
        trocG.scale.set(1, Math.max(0.01, tro * (1 - dock * 0.7)), 1);
        var ap = anvilStart.clone().lerp(anvilDock, dock); if (tau > 0.72) ap = anvilDock.clone().add(off);
        anv.position.copy(ap); anv.visible = tau > 0.12;
        var flash = tau > 0.5 && tau < 0.6 ? 0.55 : 0; mBody.emissive.setScalar(flash);
        mats.forEach(function (mm) { mm.opacity = fade; });
        this.alpha = fade; this.anchor = face.clone().add(off).addScaledVector(down, 2.2); this.anchor2 = ap.clone().addScaledVector(dir, 1.0);
      } };
  }
  function makeVloc(d) {
    var pts = [], k = d.stitches, N = 60 * k, line, center;
    if (d.ring) {
      var c = new V3().fromArray(d.ring.c), ax = new V3().fromArray(d.ring.axis).normalize(), e1 = new V3(0, 0, 1); e1.sub(ax.clone().multiplyScalar(e1.dot(ax))).normalize();
      var e2 = new V3().crossVectors(ax, e1);
      for (var i = 0; i <= N; i++) {
        var u = i / N, th = u * Math.PI * 2, rad = e1.clone().multiplyScalar(Math.cos(th)).addScaledVector(e2, Math.sin(th));
        var tng = e1.clone().multiplyScalar(-Math.sin(th)).addScaledVector(e2, Math.cos(th));
        var base = c.clone().addScaledVector(rad, d.ring.r), ph = u * k * Math.PI * 2, bb = new V3().crossVectors(tng, rad);
        pts.push(base.addScaledVector(rad, 0.2 * Math.cos(ph)).addScaledVector(bb, 0.2 * Math.sin(ph)));
      }
      center = c;
    } else {
      line = new THREE.CatmullRomCurve3(d.pts.map(function (p) { return new V3().fromArray(p); }), false, 'centripetal');
      var nn = new V3().fromArray(d.n).normalize();
      for (var i2 = 0; i2 <= N; i2++) {
        var u2 = i2 / N, p = line.getPointAt(u2), tg = line.getTangentAt(u2), nl = nn.clone().sub(tg.clone().multiplyScalar(nn.dot(tg))).normalize(), bl = new V3().crossVectors(tg, nl);
        var ph2 = u2 * k * Math.PI * 2;
        pts.push(p.clone().addScaledVector(nl, 0.05 + 0.22 * Math.cos(ph2)).addScaledVector(bl, 0.22 * Math.sin(ph2)));
      }
    }
    var curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal'), TS = N, RS = 6;
    var mThread = track(new THREE.MeshStandardMaterial({ color: '#7b4fd0', roughness: 0.5 }));
    var thread = new THREE.Mesh(track(new THREE.TubeGeometry(curve, TS, 0.045, RS, false)), mThread);
    var needle = new THREE.Mesh(track(new THREE.TorusGeometry(0.3, 0.028, 6, 24, Math.PI * 1.15)), metal('#dfe4e8'));
    var loop = new THREE.Mesh(track(new THREE.TorusGeometry(0.12, 0.035, 6, 16)), mThread); loop.position.copy(pts[0]);
    var grp = new THREE.Group(), ov = new THREE.Group(); grp.add(thread, loop); ov.add(needle);
    var hole = null;
    if (d.hole && line) {
      hole = new THREE.Mesh(track(new THREE.CircleGeometry(1, 32)), track(new THREE.MeshBasicMaterial({ color: '#2a0707' })));
      var nH = new V3().fromArray(d.n).normalize();
      hole.userData = { line: line, n: nH };
      grp.add(hole);
    }
    var el = mkLabel(VLOC, '', '#7b4fd0', 'seg');
    return { d: d, grp: grp, ov: ov, el: el,
      update: function (m) {
        var tau = (m - d.w[0]) / (d.w[1] - d.w[0]);
        if (tau <= 0) { grp.visible = false; ov.visible = false; this.alpha = 0; return; }
        grp.visible = true; ov.visible = tau < 1; var p = Math.min(1, tau);
        thread.geometry.setDrawRange(0, Math.round(p * TS) * RS * 6);
        needle.visible = tau < 1;
        if (tau < 1) {
          var tip = curve.getPointAt(p), tg = curve.getTangentAt(p);
          needle.position.copy(tip); needle.quaternion.setFromUnitVectors(new V3(0, 0, 1), tg);
        }
        if (hole) {
          var hL = hole.userData.line, rem = 1 - p;
          hole.visible = rem > 0.02;
          if (hole.visible) {
            var a0 = p, mid = hL.getPointAt(Math.min(1, a0 + rem / 2)), tgh = hL.getTangentAt(Math.min(1, a0 + rem / 2));
            var n0 = hole.userData.n.clone(); n0.sub(tgh.clone().multiplyScalar(n0.dot(tgh))).normalize();
            hole.position.copy(mid).addScaledVector(n0, 0.06);
            hole.quaternion.copy(basisQ(new V3().crossVectors(tgh, n0).normalize(), tgh));
            hole.scale.set(0.28, Math.max(0.01, rem * hL.getLength() / 2), 1);
          }
        }
        this.alpha = tau < 1 ? 1 : 0;
        this.anchor = needle.position.clone().add(new V3(0.6, 0.6, 0.4));
      } };
  }
  var VLOC = 'Szew ciągły nicią z zadziorami (typu V-Loc)';
  function buildTools(an) {
    var list = [];
    (an.cutTools || []).concat(an.anastTools || []).forEach(function (d) {
      list.push(d.type === 'gia' ? makeGia(d) : d.type === 'eea' ? makeEea(d) : TOOL_EXT[d.type] ? TOOL_EXT[d.type](d) : makeVloc(d));
    });
    return list;
  }

