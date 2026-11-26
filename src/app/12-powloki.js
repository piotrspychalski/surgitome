  /* ---------- WSPÓLNY MODEL ŚCIANY — część rysunkowa (ANAT.BODY: warstwy, kolory, naczynia, nerwy; 03z-powloki.js). Używają go slajd „Dostęp”
     (12-dostep: tylko lod 0 — skóra, punkty orientacyjne, mięśnie proste, naczynia nabrzuszne), przekrój w herniologii (12-przepukliny), pachwina
     (12-pachwina) i przeszczepienie nerki (12-nerka). Tu: materiały w kolorach modelu, wybór struktur według poziomu szczegółu (lod), rury naczyń
     (tętnica i żyła obok siebie) w dowolnym odwzorowaniu (x, y, głębokość) → punkt, oraz wyróżniona siatka chirurgiczna (dzianina z oczkami,
     świecąca, z obramowaniem) — jedna dla wszystkich zabiegów. ---------- */
  function wallCol(id) { return A.BODY.COL[id] || id; }
  // struktury modelu do pokazania przy danym poziomie szczegółu (0 — slajd „Dostęp”, 1 — herniologia)
  function wallVesselsLod(lod, ids) { return A.BODY.VESSELS.filter(function (v) { return v.lod <= lod && (!ids || ids.indexOf(v.id) >= 0); }); }
  // punkty osi naczynia: map(x, y, d) → V3 (x ze znakiem strony); kind 'a' — tętnica, 'v' — żyła (obok, bocznie)
  function wallVesselPts(v, side, kind, map, fat) {
    var B = A.BODY, dx = kind === 'v' ? 0.16 : 0;
    return v.pts.map(function (p) { var x = p[0] + dx; return map(side * x, p[1], B.depth(p[2], x, p[1], fat)); });
  }
  function wallTubeGeo(pts, r, segs) { return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'centripetal'), segs || Math.max(16, pts.length * 8), r, 7, false); }
  function wallVesselMat(kind, op) { var m = track(new THREE.MeshStandardMaterial({ color: wallCol(kind === 'a' ? 'art' : 'vein'), roughness: 0.55, transparent: op != null && op < 1, opacity: op == null ? 1 : op, side: THREE.DoubleSide })); m.userData.op = op == null ? 1 : op; return m; }
  /* siatka chirurgiczna: dzianina (oczka rombowe) — włókna jasne z ciemnoniebieskim obrysem, oczka przezroczyste (alphaTest); świeci (emissiveMap),
     więc odróżnia się od tkanek także w przyciemnionym widoku laparoskopowym; kolor siatki nie występuje w żadnej tkance */
  var WALL_MESH_TEX = null;
  function wallMeshTex() {
    if (WALL_MESH_TEX) return WALL_MESH_TEX;
    var N = 128, c = document.createElement('canvas'); c.width = c.height = N; var g = c.getContext('2d'), C = A.BODY.COL;
    g.clearRect(0, 0, N, N); g.lineCap = 'round';
    function knit(w, col) { g.strokeStyle = col; g.lineWidth = w; for (var o = -N; o <= N; o += N) { g.beginPath(); g.moveTo(o, 0); g.lineTo(o + N, N); g.moveTo(o + N, 0); g.lineTo(o, N); g.stroke(); } }
    knit(22, C.mesh); knit(5, C.meshCore);
    g.fillStyle = C.mesh; [[0, 0], [N, 0], [0, N], [N, N], [N / 2, N / 2]].forEach(function (p) { g.beginPath(); g.arc(p[0], p[1], 12, 0, Math.PI * 2); g.fill(); });   // węzły dzianiny
    WALL_MESH_TEX = new THREE.CanvasTexture(c); WALL_MESH_TEX.wrapS = WALL_MESH_TEX.wrapT = THREE.RepeatWrapping; WALL_MESH_TEX.anisotropy = 4; return WALL_MESH_TEX;
  }
  function wallMeshMat() {
    var t = wallMeshTex(), m = track(new THREE.MeshStandardMaterial({ color: '#ffffff', map: t, emissive: A.BODY.COL.mesh, emissiveMap: t, emissiveIntensity: 0.9, roughness: 0.45, metalness: 0,
      transparent: true, opacity: 0, alphaTest: 0.18, side: THREE.DoubleSide, depthWrite: true, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
    return m;
  }
  // obramowanie siatki: rura wzdłuż brzegu (punkty V3); mesh.visible / opacity ustawia wywołujący
  function wallMeshEdgeMat() { return track(new THREE.MeshStandardMaterial({ color: wallCol('meshEdge'), emissive: wallCol('mesh'), emissiveIntensity: 0.35, roughness: 0.4, transparent: true, opacity: 0 })); }
  function wallMeshEdgeSet(mesh, pts, r, closed) {
    if (mesh.geometry) mesh.geometry.dispose();
    mesh.geometry = pts.length > 1 ? new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, !!closed, 'centripetal'), Math.max(24, pts.length * 3), r || 0.06, 6, !!closed) : new THREE.BufferGeometry();
  }
  // brzeg siatki wierzchołków (ns × nt, wiersze po ns + 1) z tablicy pozycji: obwód zamknięty
  function wallGridRim(P, ns, nt, row0, row1) {
    var out = [], r0 = row0 || 0, r1 = row1 == null ? nt : row1;
    function v(i, j) { var k = (j * (ns + 1) + i) * 3; return new V3(P[k], P[k + 1], P[k + 2]); }
    for (var i = 0; i <= ns; i++) out.push(v(i, r0));
    for (var j = r0 + 1; j <= r1; j++) out.push(v(ns, j));
    for (var i2 = ns - 1; i2 >= 0; i2--) out.push(v(i2, r1));
    for (var j2 = r1 - 1; j2 > r0; j2--) out.push(v(0, j2));
    return out;
  }
