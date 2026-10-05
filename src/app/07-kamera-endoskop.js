  /* ---------- kamera ---------- */
  var tw = null, driftT = 0;
  function fitDist(aspect) {
    var size = M.box.getSize(new V3()), vfov = orbitCam.fov * Math.PI / 180, a = Math.max(0.45, aspect);
    var hfov = 2 * Math.atan(Math.tan(vfov / 2) * a);
    return Math.max(size.y / 2 / Math.tan(vfov / 2), size.x / 2 / Math.tan(hfov / 2)) * 1.1 + size.z / 2;
  }
  function preset(name, aspect) {
    var c = M.box.getCenter(new V3()), D = fitDist(aspect || orbitCam.aspect);
    switch (name) {
      case 'upper': return { t: c.clone().add(new V3(0.8, 2.2, 0)), az: 16, el: 8, d: D * 0.85 };
      case 'focus': return { t: new V3().fromArray(M.an.focus.t), az: 16, el: 8, d: D * M.an.focus.k };
      case 'focusVar': return { t: new V3().fromArray(M.an.focusVar.t), az: 16, el: 8, d: D * M.an.focusVar.k };
      case 'stomach': return { t: new V3(1.8, 3.0, 0.5), az: 18, el: 8, d: D * 0.55 };
      case 'full': return { t: c, az: 18, el: 8, d: D };
      case 'custom': var q = FR[S.frame] && FR[S.frame].camP; if (q) return { t: new V3().fromArray(q.t), az: q.az, el: q.el, d: D * q.k }; return { t: c, az: 10, el: 5, d: D }; // kadr z własnym ujęciem (wątroba)
      case 'lao': return { t: c, az: 58, el: 12, d: D * 1.02 };
      case 'top': return { t: c, az: -35, el: 40, d: D * 1.02 };
      default: return { t: c, az: 10, el: 5, d: D };
    }
  }
  function placeCam(cam, t, az, el, d) {
    var a = az * Math.PI / 180, e = el * Math.PI / 180;
    cam.position.set(t.x + d * Math.cos(e) * Math.sin(a), t.y + d * Math.sin(e), t.z + d * Math.cos(e) * Math.cos(a));
    cam.lookAt(t);
  }
  function camTo(p, dur) {
    controls.autoRotate = false;
    if (!dur) { tw = null; placeCam(orbitCam, p.t, p.az, p.el, p.d); controls.target.copy(p.t); controls.update(); startDrift(); return; }
    var t0 = controls.target.clone(), off = orbitCam.position.clone().sub(t0), d0 = off.length();
    var el0 = Math.asin(Math.max(-1, Math.min(1, off.y / d0))) * 180 / Math.PI, az0 = Math.atan2(off.x, off.z) * 180 / Math.PI;
    tw = { t0: t0, az0: az0, el0: el0, d0: d0, p: p, daz: ((p.az - az0 + 540) % 360) - 180, time: 0, dur: dur };
    controls.enabled = false;
  }
  function camStep(dt) {
    tw.time += dt; var k = sm(tw.time / tw.dur);
    var t = tw.t0.clone().lerp(tw.p.t, k);
    placeCam(orbitCam, t, tw.az0 + tw.daz * k, tw.el0 + (tw.p.el - tw.el0) * k, tw.d0 + (tw.p.d - tw.d0) * k);
    controls.target.copy(t);
    if (k >= 1) { tw = null; controls.enabled = true; controls.update(); startDrift(); }
  }
  function startDrift() { driftT = 0; controls.autoRotate = S.drift && !reduced && !endo.active; }
  controls.addEventListener('start', function () { controls.autoRotate = false; viewport.classList.add('dragging'); });
  controls.addEventListener('end', function () { viewport.classList.remove('dragging'); });

  /* ---------- endoskop ---------- */
  var tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), hudKey = null, scrubbing = false;
  function updateEndoCam(dt, snap) {
    var R = endo.route, u = clamp01(endo.s / R.total);
    var pos = R.curve.getPointAt(u), la = 1.8, ahead;
    var pend = endo.set && endo.set.branched && endo.choice === null;
    if (pend && endo.s + la > R.prefixS) ahead = pos.clone().add(R.curve.getTangentAt(u).multiplyScalar(la));
    else if (endo.s + la <= R.total) ahead = R.curve.getPointAt((endo.s + la) / R.total);
    else ahead = pos.clone().add(R.curve.getTangentAt(u).multiplyScalar(la));
    var target = endo.target ? ahead.clone().lerp(endo.target, sm(1 - (R.total - endo.s) / 3.2)) : ahead;
    tmpM.lookAt(pos, target, R.ups[Math.round(u * R.NF)]); tmpQ.setFromRotationMatrix(tmpM);
    endoCam.position.copy(pos);
    var turn = endo.ramp >= 0 && endo.ramp < 4 ? 0.8 + 5.2 * sm(endo.ramp / 4) : 6;
    if (snap) endoCam.quaternion.copy(tmpQ); else endoCam.quaternion.slerp(tmpQ, 1 - Math.exp(-dt * turn));
    M.scope.position.copy(pos); M.scope.quaternion.copy(endoCam.quaternion);
    var tt = R.curve.getUtoTmapping(u);
    R.range = Math.round(tt * R.TS) * R.per;
    var st = R.steps[R.stepOf[Math.min(R.n - 1, Math.round(tt * (R.n - 1)))]], seg = st.obj ? M.byId[st.obj] : null;
    if (hudKey !== st) {
      hudKey = st;
      if (seg) {
        var d = seg.def, name = (endo.which === 'post' && d.postName) ? d.postName : d.name;
        $('hudSw').style.background = seg.cols[endo.which === 'post' ? seg.cols.length - 1 : 0][1].getStyle();
        $('hudSeg').textContent = tr(name);
      } else { $('hudSw').style.background = '#e2b59c'; $('hudSeg').textContent = tr('Na zewnątrz — wejście przez stomię'); }
      $('hudNote').textContent = tr(st.note || '');
    }
    if (!scrubbing) $('scrub').value = Math.round(u * 1000);
    $('hudEnd').hidden = !endo.endText || endo.s < R.total - 0.8;
  }
  function buildEndoGroup(which) {
    if (M.endoG[which]) return M.endoG[which];
    var f = which === 'pre' ? 0 : 1, m = which === 'pre' ? 0 : M.an.mEnd, list = [], objs = [];
    M.objs.forEach(function (o) { if (o.def.solid || o.def.organ || o.def.noEndo || kfNum(o.def.opacity, m, 1) < 0.5) return; objs.push(o); var st0 = stateAt(o, o.def.morph ? f : 0), op0 = o.def.open || [false, false];
      list.push({ curve: st0.curve, r: st0.r, len: st0.len, caps: [!op0[0], !op0[1]] }); });
    var geos = A.endoGeometries(list), g = new THREE.Group();
    geos.forEach(function (geo, i) {
      var o = objs[i], im = o.inner.material;
      var mat = new THREE.MeshStandardMaterial({ color: im.color, map: im.map, bumpMap: im.map, bumpScale: 0.05, roughness: 0.3, metalness: 0, side: THREE.DoubleSide });
      g.add(new THREE.Mesh(geo, mat)); M.endoTrash.push(geo, mat);
    });
    g.visible = false; M.group.add(g);
    return (M.endoG[which] = g);
  }
  function applyBranchMeta() {
    var an = M.an, which = endo.which, RS = endo.set, et;
    if (RS.branched) {
      var b = endo.choice === null ? null : RS.meta[endo.choice];
      et = b && b.target ? (b.target === 'papilla' ? (M.pp ? M.pp.wall : null) : new V3().fromArray(b.target)) : null;
      endo.target = et; endo.endText = b && b.endText ? b.endText : '';
    } else {
      var t = an.endTarget && an.endTarget[which];
      endo.target = M.pp ? M.pp.wall : (t ? new V3().fromArray(t) : null);
      endo.endText = (an.endText && an.endText[which]) || (M.pp ? 'Brodawka Vatera w polu widzenia' : '');
    }
    $('hudEnd').textContent = tr(endo.endText);
    M.routeG.clear();
    RS.list.forEach(function (R, i) { if (!RS.branched || endo.choice === null || endo.choice === i) M.routeG.add(R.all); });
    M.routeG.add(endo.route.done);
    var ob = $('btnOther');
    if (RS.branched && endo.choice !== null) { ob.hidden = false; ob.textContent = tr('Druga droga: ') + tr(RS.meta[1 - endo.choice].label); } else ob.hidden = true;
  }
  function showChoice(on) {
    var box = $('choice'); box.hidden = !on; if (!on) return;
    var RS = endo.set, list = $('choiceBtns'); list.innerHTML = '';
    RS.meta.forEach(function (b, i) {
      var bt = document.createElement('button'); bt.className = 'btn choicebtn' + (i === 0 ? ' primary' : '');
      bt.innerHTML = '<em>' + (i + 1) + '</em><span><b></b><small></small></span>';
      bt.querySelector('b').textContent = tr(b.label); bt.querySelector('small').textContent = tr(b.sub || '');
      bt.onclick = function () { choose(i); };
      list.appendChild(bt);
    });
    $('choiceTitle').textContent = tr(endo.set.list[0].prefixS > 0 ? 'Rozwidlenie — którą drogą dalej?' : 'Którędy wejść?');
  }
  function choose(i) {
    var RS = endo.set; if (!RS.branched) return;
    var fromStart = RS.list[i].prefixS === 0;
    endo.choice = i; endo.route = RS.list[i]; endo.s = RS.list[i].prefixS; hudKey = null;
    endo.ramp = fromStart ? -1 : 0; // po wyborze na rozwidleniu: bardzo powolny start i powolny zwrot kamery
    applyBranchMeta(); showChoice(false);
    endo.playing = true; updateEndoCam(0, fromStart); updateDock();
  }
  function resetEndo() {
    var RS = endo.set; endo.ramp = -1;
    endo.choice = RS.branched ? null : 0; endo.route = RS.list[0]; endo.s = 0; hudKey = null;
    applyBranchMeta(); updateEndoCam(0, true);
    if (RS.branched && RS.list[0].prefixS === 0) { endo.playing = false; showChoice(true); } else { endo.playing = true; showChoice(false); }
  }
  function setEndo(on, which) {
    endo.active = on; viewport.classList.remove('hidemap');
    if (M.endoG.pre) M.endoG.pre.visible = false; if (M.endoG.post) M.endoG.post.visible = false;
    $('hud').hidden = !on; $('inset').hidden = !on; $('vignette').hidden = !on;
    viewport.classList.toggle('endo', on);
    M.routeG.clear(); showChoice(false); $('btnOther').hidden = true;
    if (on) {
      endo.which = which; endo.set = buildRoutes(which); endo.g = buildEndoGroup(which);
      controls.autoRotate = false;
      resetEndo();
    }
    labelsEl.style.display = on ? 'none' : '';
  }

