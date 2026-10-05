  /* ---------- samouczek: raz na urządzenie (localStorage), po informacji startowej; wszystko przygaszone, kolejno podświetlane funkcje ----------
     cel kroku: d (komputer) / m (telefon) — lista grup selektorów, każda grupa = jedno wycięcie w przyciemnieniu (prostokąt obejmujący widoczne elementy);
     live — podświetlony element można kliknąć w trakcie samouczka; inside: 'top-end' — przy braku miejsca karta w prawym górnym rogu wycięcia (obok przycisków pływających), nie na środku */
  var TOUR_KEY = 'surgitome-tour', TOUR = { on: false, i: -1, shown: [], t: 0, key: '', focus: null };
  var TOUR_UI = {
    pl: { head: 'Samouczek', skip: 'Pomiń', prev: 'Wstecz', next: 'Dalej', done: 'Gotowe', tryD: 'Spróbuj: kliknij podświetlony przycisk.', tryM: 'Spróbuj: dotknij podświetlonego przycisku.' },
    en: { head: 'Tutorial', skip: 'Skip', prev: 'Back', next: 'Next', done: 'Done', tryD: 'Try it: click the highlighted button.', tryM: 'Try it: tap the highlighted button.' }
  };
  // teksty: [tytuł, opis na komputerze, opis na telefonie (opcjonalnie)]
  var TOUR_STEPS = [
    { d: [['#btnLang']], m: [['#fLang']], live: true,
      pl: ['Język', 'Przełącznik PL / EN zmienia język interfejsu, opisów i etykiet. Wybór zostaje zapamiętany.',
        'Przycisk PL / EN zmienia język interfejsu, opisów i etykiet. Wybór zostaje zapamiętany.'],
      en: ['Language', 'The PL / EN switch changes the language of the interface, descriptions and labels. Your choice is remembered.',
        'The PL / EN button changes the language of the interface, descriptions and labels. Your choice is remembered.'] },
    { d: [['#q']], m: [['#mq']],
      enter: function () { if (MOBILE) mMenu(true); }, leave: function () { if (MOBILE) mMenu(false); },
      pl: ['Wyszukiwarka', 'Wpisz nazwę zabiegu, wariantu lub badania — po polsku albo po angielsku, polskie znaki są opcjonalne. Strzałki wybierają wynik, Enter go otwiera; skrót klawiszowy: /. Stąd otworzysz też badania kliniczne.',
        'Wyszukiwarka jest w menu ☰. Wpisz nazwę zabiegu, wariantu lub badania — po polsku albo po angielsku, polskie znaki są opcjonalne. Stąd otworzysz też badania kliniczne.'],
      en: ['Search', 'Type the name of a procedure, variant or trial — in Polish or English, diacritics optional. Arrow keys pick a result, Enter opens it; keyboard shortcut: /. Clinical trials are opened from here too.',
        'Search lives in the ☰ menu. Type the name of a procedure, variant or trial — in Polish or English, diacritics optional. Clinical trials are opened from here too.'] },
    { d: [['.subbar'], ['#btnPrev', '#strip', '#btnNext']], m: [['#mMenuBtn'], ['#mDock']],
      pl: ['Nawigacja', 'U góry wybierasz kategorię, zabieg i wariant; gwiazdka ☆ dodaje zabieg do Ulubionych. Na dole przechodzisz przez kolejne kadry: Wstecz / Dalej, numery kadrów lub strzałki ← → (działa też pilot do prezentacji).',
        'Menu ☰ u góry: kategorie, zabiegi, warianty i Ulubione (gwiazdka ☆). Na dole przechodzisz przez kolejne kadry przyciskami ‹ › lub przesuwając palcem.'],
      en: ['Navigation', 'At the top, choose a category, procedure and variant; the star ☆ adds a procedure to Favourites. At the bottom, step through the frames: Back / Next, frame numbers or the ← → keys (a presentation clicker works too).',
        'The ☰ menu at the top: categories, procedures, variants and Favourites (star ☆). At the bottom, step through the frames with ‹ › or by swiping.'] },
    { d: [['#fLbl']], m: [['#fLbl']], live: true,
      pl: ['Etykiety', 'Pokazuje i ukrywa nazwy odcinków przy modelu. To samo robi kliknięcie w model lub klawisz L.',
        'Pokazuje i ukrywa nazwy odcinków przy modelu. To samo robi dotknięcie modelu.'],
      en: ['Labels', 'Shows and hides the segment names on the model. A click on the model or the L key does the same.',
        'Shows and hides the segment names on the model. A tap on the model does the same.'] },
    { d: [['#fInfo']], m: [['#fInfo']],
      pl: ['Informacje', 'Otwiera opis zabiegu: najważniejsze uwagi, legendę kolorów (kliknięcie odcinka go wyróżnia) i ustawienia widoku. Stamtąd uruchomisz też ponownie ten samouczek.',
        'Otwiera opis zabiegu: najważniejsze uwagi, legendę kolorów (dotknięcie odcinka go wyróżnia) i ustawienia widoku. Samouczek powtórzysz z opisu albo z menu ☰.'],
      en: ['Information', 'Opens the procedure description: key notes, the colour legend (click a segment to highlight it) and view settings. You can also replay this tutorial from there.',
        'Opens the procedure description: key notes, the colour legend (tap a segment to highlight it) and view settings. Replay this tutorial from there or from the ☰ menu.'] },
    { d: [['#viewport'], ['#btnPlay']], m: [['#viewport'], ['#btnPlay']], inside: 'top-end',
      pl: ['Animacje', 'Każdy kadr pokazuje kolejny etap operacji: resekcję, zespolenie, a w części zabiegów także widok endoskopowy i TK. Spacja lub przycisk „Pauza” wstrzymuje i powtarza animację. Model obracasz myszką, przybliżasz kółkiem.',
        'Każdy kadr pokazuje kolejny etap operacji: resekcję, zespolenie, a w części zabiegów także widok endoskopowy i TK. Przycisk „Pauza” pod modelem wstrzymuje i powtarza animację. Model obracasz palcem, przybliżasz dwoma palcami.'],
      en: ['Animations', 'Each frame shows the next stage of the operation: resection, anastomosis and, for some procedures, an endoscopic view and CT. Space or the “Pause” button pauses and replays the animation. Rotate the model with the mouse, zoom with the wheel.',
        'Each frame shows the next stage of the operation: resection, anastomosis and, for some procedures, an endoscopic view and CT. The “Pause” button below the model pauses and replays the animation. Rotate the model with a finger, zoom with two fingers.'] }
  ];

  function tourStep() { return TOUR_STEPS[TOUR.i]; }
  // wycięcia: prostokąty widocznych elementów z marginesem; zaokrąglenie jak element (przycisk okrągły → okrągłe wycięcie)
  function tourTargets(st) {
    var W = window.innerWidth, H = window.innerHeight, pad = 6, out = [];
    (MOBILE ? st.m : st.d).forEach(function (g) {
      var u = null, one = null;
      g.forEach(function (sel) {
        var el = document.querySelector(sel); if (!el) return;
        var r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return;
        one = u ? null : el;
        u = u ? { l: Math.min(u.l, r.left), t: Math.min(u.t, r.top), r: Math.max(u.r, r.right), b: Math.max(u.b, r.bottom) } : { l: r.left, t: r.top, r: r.right, b: r.bottom };
      });
      if (!u) return;
      var rad = 4;
      if (one) try { var br = getComputedStyle(one).borderTopLeftRadius || ''; rad = (parseFloat(br) || 0) * (/%$/.test(br) ? Math.min(u.r - u.l, u.b - u.t) / 100 : 1); } catch (e) {}
      var h = { l: Math.max(2, u.l - pad), t: Math.max(2, u.t - pad), r: Math.min(W - 2, u.r + pad), b: Math.min(H - 2, u.b + pad) };
      h.rx = one && rad >= (u.b - u.t) / 2 - 1 ? (h.b - h.t) / 2 : Math.min(12, rad + pad);
      out.push(h);
    });
    return out;
  }
  // przyciemnienie na canvas: pełne wypełnienie, wycięcia przez destination-out (maska SVG w ukrytym kontenerze bywa pomijana przez Chromium); obwódki — elementy z CSS
  function tourDraw(R, fa) {
    var W = window.innerWidth, H = window.innerHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var key = W + 'x' + H + '@' + dpr + '/' + fa.toFixed(2) + ':' + R.map(function (r) { return [r.l, r.t, r.r, r.b, r.rx].map(function (v) { return v.toFixed(1); }).join(','); }).join(';');
    if (key === TOUR.key) return; TOUR.key = key;
    var cv = $('tourCv'), cx = cv.getContext('2d');
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    if (cx) {
      cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.globalCompositeOperation = 'source-over'; cx.clearRect(0, 0, W, H);
      cx.globalAlpha = fa; cx.fillStyle = getComputedStyle($('tour')).getPropertyValue('--tdim').trim() || 'rgba(6,12,18,.66)'; cx.fillRect(0, 0, W, H);
      cx.globalAlpha = 1;
      cx.globalCompositeOperation = 'destination-out'; cx.fillStyle = '#000';
      R.forEach(function (r) {
        var w = r.r - r.l, h = r.b - r.t, q = Math.max(0, Math.min(r.rx, w / 2, h / 2));
        cx.beginPath(); cx.moveTo(r.l + q, r.t);
        cx.arcTo(r.r, r.t, r.r, r.b, q); cx.arcTo(r.r, r.b, r.l, r.b, q); cx.arcTo(r.l, r.b, r.l, r.t, q); cx.arcTo(r.l, r.t, r.r, r.t, q);
        cx.closePath(); cx.fill();
      });
      cx.globalCompositeOperation = 'source-over';
    }
    var rg = $('tourRings');
    while (rg.children.length < R.length) { var d = document.createElement('div'); d.className = 'tring'; rg.appendChild(d); }
    while (rg.children.length > R.length) rg.removeChild(rg.lastChild);
    R.forEach(function (r, i) {
      var s = rg.children[i].style;
      s.left = r.l.toFixed(1) + 'px'; s.top = r.t.toFixed(1) + 'px'; s.width = Math.max(0, r.r - r.l).toFixed(1) + 'px'; s.height = Math.max(0, r.b - r.t).toFixed(1) + 'px'; s.borderRadius = r.rx.toFixed(1) + 'px';
    });
  }
  // karta: pod wycięciem lub nad nim, potem z boku; gdy brak miejsca (kilka wycięć, cały model) — na środku albo w prawym górnym rogu wycięcia
  function tourPlace(tg, st) {
    var card = $('tourCard'), W = window.innerWidth, H = window.innerHeight, cw = card.offsetWidth, ch = card.offsetHeight, g = 14, e = 12, x, y;
    if (!tg.length) { x = (W - cw) / 2; y = (H - ch) / 2; }
    else {
      var u = { l: Infinity, t: Infinity, r: -Infinity, b: -Infinity };
      tg.forEach(function (r) { u.l = Math.min(u.l, r.l); u.t = Math.min(u.t, r.t); u.r = Math.max(u.r, r.r); u.b = Math.max(u.b, r.b); });
      var below = H - u.b - g - e >= ch, above = u.t - g - e >= ch, cy = (u.t + u.b) / 2;
      x = (u.l + u.r) / 2 - cw / 2;
      if (below && (cy < H * 0.6 || !above)) y = u.b + g;
      else if (above) y = u.t - g - ch;
      else if (W - u.r - g - e >= cw) { x = u.r + g; y = cy - ch / 2; }
      else if (u.l - g - e >= cw) { x = u.l - g - cw; y = cy - ch / 2; }
      else if (st.inside === 'top-end') { x = u.r - cw - 72; y = u.t + 16; } // model zwykle na środku — karta z boku, nie na nim
      else y = cy - ch / 2;
    }
    x = Math.round(Math.max(e, Math.min(W - e - cw, x))); y = Math.round(Math.max(e, Math.min(H - e - ch, y)));
    if (card.style.left !== x + 'px') card.style.left = x + 'px';
    if (card.style.top !== y + 'px') card.style.top = y + 'px';
  }
  function tourLoop(now) {
    if (!TOUR.on) return;
    var dt = TOUR.t ? Math.min(0.05, (now - TOUR.t) / 1000) : 0; TOUR.t = now;
    var st = tourStep(), tg = tourTargets(st), cur = TOUR.shown, nxt = [], k = reduced ? 1 : 1 - Math.exp(-dt * 14);
    // wycięcia płynnie przechodzą do nowych celów; nowe wyrastają z ostatniego dotychczasowego, nadmiarowe zlewają się z ostatnim nowym
    for (var i = 0; i < Math.max(tg.length, cur.length); i++) {
      var to = tg[Math.min(i, tg.length - 1)]; if (!to) break;
      var from = cur[i] || cur[cur.length - 1] || to, r = {};
      ['l', 't', 'r', 'b', 'rx'].forEach(function (p) { r[p] = from[p] + (to[p] - from[p]) * k; });
      if (i >= tg.length && Math.abs(r.l - to.l) + Math.abs(r.t - to.t) + Math.abs(r.r - to.r) + Math.abs(r.b - to.b) < 2) continue;
      nxt.push(r);
    }
    TOUR.fa = reduced ? 1 : Math.min(1, TOUR.fa + dt / 0.25); // płynne przygaszenie na starcie
    TOUR.shown = nxt; tourDraw(nxt, TOUR.fa); tourPlace(tg, st);
    var lv = $('tourLive'), h = st.live && tg[0];
    lv.hidden = !h;
    if (h) { lv.style.left = h.l + 'px'; lv.style.top = h.t + 'px'; lv.style.width = (h.r - h.l) + 'px'; lv.style.height = (h.b - h.t) + 'px'; lv.style.borderRadius = h.rx + 'px'; }
    if (TOUR.snap) { TOUR.snap = false; requestAnimationFrame(function () { $('tourCard').classList.remove('snap'); }); }
    requestAnimationFrame(tourLoop);
  }
  function tourRender() {
    var st = tourStep(), L = TOUR_UI[LANG] || TOUR_UI.pl, tx = st[LANG] || st.pl, n = TOUR_STEPS.length;
    $('tourNum').textContent = L.head + ' · ' + (TOUR.i + 1) + ' / ' + n;
    $('tourTitle').textContent = tx[0]; $('tourText').textContent = (MOBILE && tx[2]) || tx[1];
    $('tourHint').textContent = st.live ? (MOBILE ? L.tryM : L.tryD) : '';
    $('tourSkip').textContent = L.skip; $('tourPrev').textContent = L.prev; $('tourPrev').disabled = TOUR.i === 0;
    $('tourNext').textContent = TOUR.i === n - 1 ? L.done : L.next;
    var dots = $('tourDots'); if (dots.children.length !== n) { dots.innerHTML = ''; TOUR_STEPS.forEach(function () { dots.appendChild(document.createElement('i')); }); }
    [].forEach.call(dots.children, function (d, i) { d.className = i === TOUR.i ? 'on' : i < TOUR.i ? 'done' : ''; });
  }
  function tourGo(i) {
    if (!TOUR.on || i < 0) return;
    if (i >= TOUR_STEPS.length) { tourEnd(); return; }
    var cur = tourStep(); if (cur && cur.leave) cur.leave();
    TOUR.i = i; var st = tourStep(); if (st.enter) st.enter();
    tourRender();
    if (document.activeElement === $('tourPrev') && $('tourPrev').disabled) $('tourNext').focus();
  }
  function tourStart() {
    if (TOUR.on) return;
    mMenu(false); setPanel(false); // powtórka z opisu lub menu telefonu: zamknięte, żeby nie zasłaniały podświetleń
    TOUR.focus = document.activeElement; TOUR.on = true; TOUR.i = -1; TOUR.shown = []; TOUR.t = 0; TOUR.key = ''; TOUR.snap = true; TOUR.fa = 0;
    $('tourCard').classList.add('snap'); $('tour').hidden = false;
    tourGo(0); $('tourNext').focus();
    requestAnimationFrame(tourLoop);
  }
  function tourEnd() {
    if (!TOUR.on) return;
    var cur = tourStep(); if (cur && cur.leave) cur.leave();
    TOUR.on = false; TOUR.i = -1; $('tour').hidden = true;
    try { localStorage.setItem(TOUR_KEY, '1'); } catch (e) {}
    if (TOUR.focus && TOUR.focus.focus && TOUR.focus !== document.body) try { TOUR.focus.focus(); } catch (e) {}
  }
  // uruchomienie automatyczne: raz na urządzenie; bez dostępu do localStorage — wcale (nie przy każdym wejściu)
  function tourAuto(delay) {
    var seen = '1'; try { seen = localStorage.getItem(TOUR_KEY); } catch (e) {}
    if (seen !== '1') setTimeout(function () { if ($('intro').hidden && $('fb').hidden) tourStart(); }, delay);
  }
  // klawisze w trakcie samouczka (wywoływane z głównej obsługi klawiatury): → / Enter / PgDn dalej, ← / PgUp wstecz, Esc pomija; Tab zostaje w karcie
  function tourKey(e) {
    var k = e.key, onBtn = e.target && e.target.tagName === 'BUTTON' && $('tourCard').contains(e.target);
    if (k === 'Escape') { e.preventDefault(); tourEnd(); }
    else if (k === 'ArrowRight' || k === 'PageDown' || (k === 'Enter' && !onBtn)) { e.preventDefault(); tourGo(TOUR.i + 1); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); tourGo(TOUR.i - 1); }
    else if (k === 'Tab') {
      e.preventDefault();
      var f = [$('tourSkip'), $('tourPrev'), $('tourNext')].filter(function (b) { return !b.disabled; }), p = f.indexOf(document.activeElement);
      f[(p + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
    else if (k === ' ' && !onBtn) e.preventDefault();
  }
  $('tourNext').onclick = function () { tourGo(TOUR.i + 1); };
  $('tourPrev').onclick = function () { tourGo(TOUR.i - 1); };
  $('tourSkip').onclick = tourEnd;
  $('tourLive').onclick = function () {
    var st = tourStep(), g = st && (MOBILE ? st.m : st.d)[0], el = g && document.querySelector(g[0]);
    if (el) el.click(); tourRender();
  };
  $('btnTour').onclick = tourStart;
  if ($('intro').hidden) tourAuto(700);
