  /* ---------- motyw ---------- */
  try { var saved = localStorage.getItem('anat-theme'); if (saved) root.dataset.theme = saved; } catch (e) {}
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  function isDark() { return root.dataset.theme ? root.dataset.theme === 'dark' : mq.matches; }
  var sceneBg = new THREE.Color('#0b1117');
  function applyTheme() { try { sceneBg.set(getComputedStyle(root).getPropertyValue('--scene').trim() || '#0b1117'); } catch (e) {} $('btnTheme').textContent = tr(isDark() ? 'Jasny' : 'Ciemny'); }
  if (mq.addEventListener) mq.addEventListener('change', applyTheme);
  $('btnTheme').onclick = function () { var n = isDark() ? 'light' : 'dark'; root.dataset.theme = n; try { localStorage.setItem('anat-theme', n); } catch (e) {} applyTheme(); };

  /* ---------- renderer ---------- */
  var renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, preserveDrawingBuffer: true }); }
  catch (e) { fail('Ta przeglądarka nie obsługuje WebGL — model 3D nie może się wyświetlić.'); return; }
  var mobMQ = window.matchMedia('(max-width: 760px), (pointer: coarse) and (max-height: 520px)');
  var MOBILE = mobMQ.matches;
  root.classList.toggle('mobile', MOBILE);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MOBILE ? 1.5 : 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.autoClear = false;

  var scene = new THREE.Scene();
  var orbitCam = new THREE.PerspectiveCamera(34, 1, 0.1, 800);
  orbitCam.position.set(8, 3, 55);
  var controls = new THREE.OrbitControls(orbitCam, canvas);
  window.__sgTest = { cam: orbitCam, controls: controls, state: function () { return S; } }; // punkt zaczepienia dla testów automatycznych
  controls.enableDamping = true; controls.dampingFactor = 0.08; controls.autoRotateSpeed = 0.3;
  var insetCam = new THREE.PerspectiveCamera(34, 0.75, 0.1, 800);
  var endoCam = new THREE.PerspectiveCamera(105, 1, 0.02, 80);
  scene.add(endoCam);
  var headlight = new THREE.PointLight(0xfff0e2, 0, 22, 1.5); endoCam.add(headlight);
  var endoAmb = new THREE.AmbientLight(0x6a2a24, 0);
  var hemi = new THREE.HemisphereLight(0xffffff, 0x3a4450, 0.9);
  var keyL = new THREE.DirectionalLight(0xffffff, 0.85); keyL.position.set(14, 24, 30);
  var rimL = new THREE.DirectionalLight(0xcfe0ff, 0.35); rimL.position.set(-20, -12, -25);
  scene.add(endoAmb, hemi, keyL, rimL);
  var fog = new THREE.Fog(0x140505, 1e4, 1e5); scene.fog = fog;
  // narzędzia rysowane w osobnym przebiegu po wyczyszczeniu głębi -> zawsze nad strukturami 3D
  var toolScene = new THREE.Scene();
  var tHemi = new THREE.HemisphereLight(0xffffff, 0x3a4450, 0.95), tKey = new THREE.DirectionalLight(0xffffff, 0.9); tKey.position.set(14, 24, 30);
  toolScene.add(tHemi, tKey);

