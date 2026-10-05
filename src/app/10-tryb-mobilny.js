  /* ---------- tryb mobilny: pasek kadrów, menu ---------- */
  function updateMobile() {
    if (!FR || !FR.length) return;
    var P = curProc(), fr = FR[S.frame] || FR[0];
    $('mProcName').textContent = tr(P.short) + (P.variants.length > 1 && !P.split ? ' — ' + tr(curVar().vshort) : '');
    $('mFrameTxt').textContent = fr.num + ' / ' + FR.length + '  ' + tr(fr.short);
    var dots = $('mDots'); if (dots.children.length !== FR.length) { dots.innerHTML = ''; FR.forEach(function () { dots.appendChild(document.createElement('i')); }); }
    [].forEach.call(dots.children, function (dd, i) { dd.className = i === S.frame ? 'on' : i < S.frame ? 'done' : ''; });
    $('mPrev').disabled = $('btnPrev').disabled; $('mNext').disabled = $('btnNext').disabled;
  }
  function renderMobileMenu() {
    var box = $('mMenuBody'); box.innerHTML = '';
    var P = curProc();
    function sec(title) { var h = document.createElement('h4'); h.textContent = tr(title); box.appendChild(h); var r = document.createElement('div'); r.className = 'mrow'; box.appendChild(r); return r; }
    function btn(row, text, on, fn) { var b = document.createElement('button'); b.className = 'mchip'; b.textContent = text; b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.onclick = fn; row.appendChild(b); return b; }
    var rc = sec('Kategoria');
    uiCats().forEach(function (c) { btn(rc, (c.id === 'fav' ? '★ ' : '') + tr(c.name), c.id === S.cat, function () { if (c.id !== S.cat) pickCat(c.id); renderMobileMenu(); }); });
    var rp = sec('Zabieg'), L = catProcs(S.cat);
    if (!L.length) { var h = document.createElement('p'); h.className = 'favhint'; h.textContent = tr('Brak ulubionych — oznacz zabiegi gwiazdką ☆ w pozostałych zakładkach (lub klawiszem F).'); rp.appendChild(h); }
    L.forEach(function (i) {
      var w = document.createElement('span'); w.className = 'mfav';
      var b = btn(w, tr(A.PROCS[i].short), i === S.an, function () { if (i !== S.an) switchAn(i, 0); mMenu(false); });
      var st = document.createElement('button'); st.className = 'mstar' + (isFav(i) ? ' on' : ''); st.textContent = isFav(i) ? '★' : '☆';
      st.setAttribute('aria-label', tr(isFav(i) ? 'Usuń z ulubionych' : 'Dodaj do ulubionych')); st.onclick = function () { toggleFav(i); };
      w.appendChild(st); rp.appendChild(w);
    });
    if (P.variants.length > 1 && !P.split && L.indexOf(S.an) >= 0) { var rv = sec('Wariant'); P.variants.forEach(function (v, k) { btn(rv, tr(v.vshort), k === (S.vi || 0), function () { if (k !== (S.vi || 0)) switchVariant(k); mMenu(false); }); }); }
    var rs = sec('Ustawienia');
    btn(rs, tr(isDark() ? 'Jasny' : 'Ciemny'), false, function () { $('btnTheme').click(); renderMobileMenu(); });
    btn(rs, tr('Samouczek'), false, function () { tourStart(); });
  }
  $('fInfo').onclick = function () { setPanel(panel.classList.contains('closed')); };
  $('fLang').onclick = function () { setLang(LANG === 'pl' ? 'en' : 'pl'); };
  $('fLbl').onclick = function () { setLabels(!S.labels); };
  function mMenu(on) { $('mMenu').hidden = !on; if (on) { renderMobileMenu(); $('mq').value = ''; $('mqres').hidden = true; } }
  $('mMenuBtn').onclick = function () { mMenu($('mMenu').hidden); };
  $('mMenuClose').onclick = function () { mMenu(false); };
  $('mMenu').addEventListener('click', function (e) { if (e.target === $('mMenu')) mMenu(false); });
  $('mPrev').onclick = function () { prev(); };
  $('mNext').onclick = function () { next(); };
  var swX = null;
  $('mDock').addEventListener('touchstart', function (e) { swX = e.touches[0].clientX; }, { passive: true });
  $('mDock').addEventListener('touchend', function (e) {
    if (swX === null) return; var dx = e.changedTouches[0].clientX - swX; swX = null;
    if (Math.abs(dx) > 45) { if (dx < 0) next(); else prev(); }
  });
  $('cap').addEventListener('click', function () { if (MOBILE) $('cap').classList.toggle('open'); });
  function updateStrip() {
    document.querySelectorAll('.step').forEach(function (b) {
      var i = +b.dataset.i; b.classList.toggle('done', i < S.frame);
      if (i === S.frame) { b.setAttribute('aria-current', 'step'); if (b.scrollIntoView) try { b.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) {} } else b.removeAttribute('aria-current');
    });
    var NL = navList(), np = NL.indexOf(S.an), P = curProc(), lastV = P.split || (S.vi || 0) === P.variants.length - 1, firstV = P.split || !(S.vi || 0);
    $('btnPrev').disabled = S.frame === 0 && firstV && np <= 0;
    $('btnNext').disabled = S.frame === FR.length - 1 && lastV && (np < 0 || np === NL.length - 1);
    updateMobile();
  }
  function updateDock() {
    var fr = FR[S.frame]; if (!fr) return;
    var isEndo = fr.kind === 'endo', anim = fr.kind === 'orbit' && fr.m1 > fr.m0;
    var lvSeg = !!(M && M.liver && !SPLIT.on && fr.k === 'segs'); // wątroba: suwak rozsunięcia i przyciski segmentów
    $('ctxEndo').hidden = !isEndo; $('ctxLiver').hidden = !lvSeg; $('btnPlay').hidden = !(isEndo || anim); $('ctxRow').hidden = !(isEndo || anim || lvSeg);
    var t;
    if (isEndo) t = endo.playing ? 'Pauza' : (endo.route && endo.s >= endo.route.total - 0.01 ? 'Powtórz' : 'Dalej');
    else if (anim) t = S.m >= fr.m1 - 1e-4 ? 'Powtórz animację' : (S.playing ? 'Pauza' : 'Wznów');
    $('btnPlay').textContent = tr(t || '');
  }
  function renderPanel(an) {
    $('togMeso').hidden = !((an.cutTools || []).some(function (d) { return d.type === 'meso' && !d.always; }));
    $('togGuz').hidden = !an.tumour;
    $('togLvGlass').hidden = !(an.cutTools || []).some(function (d) { return d.type === 'liver' || d.type === 'oltx' || d.type === 'lvres' || d.type === 'lvtumor'; });
    if (curProc().split) renderTrialPanel();
    else {
      $('pTitle').textContent = tr(an.title); $('pSub').textContent = tr(an.sub);
      var ul = $('pNotes'); ul.innerHTML = '';
      an.notes.forEach(function (n) { var li = document.createElement('li'); li.textContent = tr(n); ul.appendChild(li); });
    }
    renderRefs();
    var lg = $('legend'); lg.innerHTML = '';
    M.objs.forEach(function (o) {
      if (o.def.solid || kfNum(o.def.opacity, M.an.mEnd, 1) < 0.5) return;
      var d = o.def, li = document.createElement('li'), b = document.createElement('button');
      b.className = 'leg'; b.dataset.id = d.id; b.setAttribute('aria-pressed', 'false');
      b.innerHTML = '<i></i><span><b></b>' + (d.lenPost ? '<small></small>' : '') + '</span>';
      b.querySelector('i').style.background = o.cols[o.cols.length - 1][1].getStyle();
      b.querySelector('b').textContent = tr(d.postName || d.name); if (d.lenPost) b.querySelector('small').textContent = tr(d.lenPost);
      b.onclick = function () { S.highlight = S.highlight === d.id ? null : d.id; applyM(); document.querySelectorAll('.leg').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.id === S.highlight); }); };
      li.appendChild(b); lg.appendChild(li);
    });
    if (M.liver) lvLegend(lg);
    if (M.oltx) oltLegend(lg);
  }

  $('btnNext').onclick = next; $('btnPrev').onclick = prev; $('btnPlay').onclick = togglePlay;
  $('speed').onchange = function () { endo.rate = parseFloat(this.value) || 1; };
  var scrub = $('scrub');
  scrub.addEventListener('input', function () {
    if (!endo.active || !endo.route) return; // trasa endoskopu jeszcze się buduje
    scrubbing = true; endo.s = scrub.value / 1000 * endo.route.total;
    if (endo.set.branched && endo.choice === null && endo.s > endo.route.prefixS) { endo.choice = 0; applyBranchMeta(); showChoice(false); }
    hudKey = null; updateEndoCam(0, true); updateDock();
  });
  $('btnOther').onclick = function () { if (endo.set && endo.set.branched && endo.choice !== null) choose(1 - endo.choice); };
  scrub.addEventListener('change', function () { scrubbing = false; });
  scrub.addEventListener('pointerdown', function () { endo.playing = false; updateDock(); });
  function setLabels(on) {
    S.labels = on; ct.labels = on; $('cap').hidden = !(on && S.captions); // podpis kadru znika razem z etykietami
    $('optLabels').checked = on; $('ctLabels').checked = on;
    $('btnLabels').setAttribute('aria-pressed', on ? 'true' : 'false'); $('fLbl').setAttribute('aria-pressed', on ? 'true' : 'false');
    try { localStorage.setItem('surgitome-labels', on ? '1' : '0'); } catch (e) {}
    if (ct.on) drawCT();
  }
  $('optLabels').onchange = function () { setLabels(this.checked); };
  $('btnLabels').onclick = function () { setLabels(!S.labels); };
  var clk = null;
  canvas.addEventListener('pointerdown', function (e) { clk = { x: e.clientX, y: e.clientY, t: Date.now() }; });
  canvas.addEventListener('pointerup', function (e) {
    if (!clk) return; var dx = e.clientX - clk.x, dy = e.clientY - clk.y, dt = Date.now() - clk.t; clk = null;
    if (panelTapClosed) { panelTapClosed = false; return; }
    if (dx * dx + dy * dy < 36 && dt < 450) { if (endo.active && MOBILE) viewport.classList.toggle('hidemap'); else setLabels(!S.labels); }
  });
  var lp = null; try { lp = localStorage.getItem('surgitome-labels'); } catch (e) {}
  if (lp === '0' || (lp === null && MOBILE)) setLabels(false);
  $('optCaps').onchange = function () { S.captions = this.checked; $('cap').hidden = !(this.checked && S.labels); };
  // podpis kadru (lewy dolny róg) przygasa pod kursorem myszy, żeby nie zasłaniał modelu; zdarzenia idą dalej do widoku (obrót kamery)
  viewport.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    var c = $('cap'), r = c.getBoundingClientRect(), inside = !c.hidden && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (inside !== c.classList.contains('faded')) c.classList.toggle('faded', inside);
  });
  viewport.addEventListener('pointerleave', function () { $('cap').classList.remove('faded'); });
  $('optMeso').checked = S.meso;
  $('optGuz').checked = S.tumour;
  $('optGuz').onchange = function () { S.tumour = this.checked; try { localStorage.setItem('surgitome-guz', S.tumour ? '1' : '0'); } catch (e) {} applyM(); };
  $('optMeso').onchange = function () { S.meso = this.checked; try { localStorage.setItem('surgitome-meso', S.meso ? '1' : '0'); } catch (e) {} applyM(); };
  $('optDrift').onchange = function () { S.drift = this.checked; controls.autoRotate = S.drift && !reduced && !endo.active && !tw; };

  var panel = $('panel');
  function setPanel(open) { panel.classList.toggle('closed', !open); $('btnPanel').setAttribute('aria-pressed', open); }
  $('btnPanel').onclick = function () { setPanel(panel.classList.contains('closed')); };
  $('panelClose').onclick = function () { setPanel(false); };
  // panel jako nakładka (telefon / wąski ekran): stuknięcie poza nim zamyka
  var panelTapClosed = false;
  document.addEventListener('pointerdown', function (e) {
    panelTapClosed = false;
    if (panel.classList.contains('closed') || getComputedStyle(panel).position !== 'absolute') return;
    if (panel.contains(e.target) || e.target.closest('#btnPanel, #mMenu, #mMenuBtn, #fInfo, #cite, #bib')) return;
    setPanel(false); panelTapClosed = true;
  }, true);
  setPanel(false);

  if (!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen)) $('btnFs').hidden = true;
  $('btnFs').onclick = function () {
    var d = document, el = d.documentElement;
    try {
      if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      else { var req = el.requestFullscreen || el.webkitRequestFullscreen; if (!req) throw 0; var p = req.call(el); if (p && p.catch) p.catch(fsFail); }
    } catch (e) { fsFail(); }
  };
  var toastT;
  function fsFail() { var t = $('toast'); t.textContent = tr('Pełny ekran jest tu zablokowany. Użyj F11 lub pełnego ekranu przeglądarki.'); t.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, 3800); }

  /* ---------- informacja przy pierwszym wejściu (raz na urządzenie, localStorage) ---------- */
  var INTRO_KEY = 'surgitome-intro';
  function introClose() {
    $('intro').hidden = true;
    try { localStorage.setItem(INTRO_KEY, '1'); } catch (e) {}
    tourAuto(250); // samouczek zaraz po informacji (raz na urządzenie)
  }
  $('introOk').onclick = introClose;
  $('intro').onclick = function (e) { if (e.target === this) introClose(); };
  $('introLang').onclick = function () { setLang(LANG === 'pl' ? 'en' : 'pl'); };
  try { if (localStorage.getItem(INTRO_KEY) !== '1') { $('intro').hidden = false; setTimeout(function () { $('introOk').focus(); }, 0); } } catch (e) {}

  function qrShow(on) {
    if (on) { var h = $('qrOverlay').querySelector('.qrhint'); h.dataset.pl = MOBILE ? 'Dotknij, aby zamknąć' : 'Kliknij, aby zamknąć'; h.textContent = tr(h.dataset.pl); }
    $('qrOverlay').hidden = !on;
  }
  $('qrBtn').onclick = function () { qrShow(true); };
  $('mQrBtn').onclick = function () { mMenu(false); qrShow(true); }; // telefon: kod QR z menu, do pokazania innej osobie
  $('qrOverlay').onclick = function () { qrShow(false); };
  document.addEventListener('keydown', function (e) {
    if (TOUR.on) { tourKey(e); return; } // samouczek: klawisze przechodzą między krokami
    if (!$('fb').hidden) { if (e.key === 'Escape') { e.preventDefault(); fbShow(false); } return; } // formularz uwag: klawisze do pisania
    if (!$('cite').hidden) { if (e.key === 'Escape') { e.preventDefault(); citeShow(false); } return; } // okienko cytowania: Tab/Enter na przyciskach
    if (!$('bib').hidden) { if (e.key === 'Escape') { e.preventDefault(); bibShow(false); } return; } // okno „Źródła”: klawisze do przewijania
    if (!$('intro').hidden) { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); introClose(); } return; }
    if (!$('qrOverlay').hidden) { if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); qrShow(false); } return; }
    var tg = e.target, tag = tg && tg.tagName;
    if (tag === 'INPUT' && tg.type === 'search') return;
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !MOBILE) { e.preventDefault(); $('q').focus(); return; }
    if (tag === 'SELECT' || (tag === 'INPUT' && tg.type === 'range' && /Arrow/.test(e.key))) return;
    var k = e.key;
    if (endo.active && !$('choice').hidden) {
      if (k === '1' || k === 'ArrowRight' || k === 'PageDown') { e.preventDefault(); choose(0); return; }
      if (k === '2') { e.preventDefault(); choose(1); return; }
    }
    if (ct.on && (k === 'ArrowUp' || k === 'ArrowDown')) { e.preventDefault(); ct.sweep = false; ct.y = Math.max(ct.yMin, Math.min(ct.yMax, ct.y + (k === 'ArrowUp' ? 0.5 : -0.5))); drawCT(); return; }
    if (ct.on && k === ' ') { e.preventDefault(); toggleSweep(); return; }
    if (k === 'ArrowRight' || k === 'PageDown' || k === 'Enter' && tag !== 'BUTTON') { e.preventDefault(); next(); }
    else if ((k === 'f' || k === 'F') && !e.ctrlKey && !e.metaKey) { e.preventDefault(); toggleFav(S.an); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); prev(); }
    else if (k === ' ') { e.preventDefault(); togglePlay(); }
    else if (k === 'Home') { e.preventDefault(); goTo(0); }
    else if (k === 'o' || k === 'O' || k === 'l' || k === 'L') { setLabels(!S.labels); }
    else if (k >= '1' && k <= '9') {
      var list = catProcs(S.cat), n = list[parseInt(k, 10) - 1]; if (n !== undefined && n !== S.an) switchAn(n, 0);
    }
  });

