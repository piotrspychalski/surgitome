  /* ---------- nawigacja ---------- */
  var busy = false, queued = null;
  function curProc() { return A.PROCS[S.an]; }
  function curVar() { return curProc().variants[S.vi || 0]; }
  function goTo(i, opts) {
    opts = opts || {};
    if (busy) { queued = [i, opts]; return; }
    i = Math.max(0, Math.min(FR.length - 1, i));
    var cur = FR[S.frame], nxt = FR[i];
    var cut = opts.fade || !cur || cur.kind === 'endo' || nxt.kind === 'endo' || cur.kind === 'ct' || nxt.kind === 'ct';
    if (cut) {
      busy = true; $('fade').classList.add('on');
      setTimeout(function () {
        applyFrame(i, true);
        requestAnimationFrame(function () { $('fade').classList.remove('on'); busy = false; if (queued) { var q = queued; queued = null; goTo(q[0], q[1]); } });
      }, reduced ? 60 : 320);
    } else applyFrame(i, false);
  }
  function applyFrame(i, snap) {
    i = Math.max(0, Math.min(FR.length - 1, i));
    if (curProc().split) return splitApplyFrame(i, snap);
    var fr = FR[i], need = curVar();
    if (!M || M.an !== need) build(need);
    S.frame = i;
    S.m = fr.m0; S.playing = true;
    capHead();
    applyM();
    if (fr.kind === 'endo') { setCT(false); setEndo(true, fr.route); }
    else { setEndo(false); setCT(fr.kind === 'ct'); updateView(); camTo(preset(fr.cam, view.w / view.h), snap ? 0 : 1.6); }
    updateStrip(); updateDock();
  }
  function capHead() {
    var fr = FR[S.frame]; if (!fr) return;
    $('capNum').textContent = tr('Kadr ') + fr.num + (curProc().variants.length > 1 && !curProc().split ? tr(' — wariant: ') + tr(curVar().vshort) : '');
    $('capTitle').textContent = tr(fr.title); $('capText').textContent = tr(fr.cap); applyM();
  }
  function next() {
    var fr = FR[S.frame];
    if (fr.kind === 'ct' && ct.on && !ct.started) { ct.y = ct.yMax; toggleSweep(); updateDock(); return; }
    if (fr.kind === 'orbit' && S.m < fr.m1 - 1e-4) { S.m = fr.m1; applyM(); if (tw) { tw.time = tw.dur; camStep(0); } updateDock(); return; }
    if (S.frame < FR.length - 1) goTo(S.frame + 1);
    else if (!curProc().split && (S.vi || 0) < curProc().variants.length - 1) switchVariant((S.vi || 0) + 1, curProc().distinct ? 'first' : 'firstVar');
    else { var L = navList(), p = L.indexOf(S.an); if (p >= 0 && p < L.length - 1) switchAn(L[p + 1], 0); }
  }
  function prev() {
    if (S.frame > 0) goTo(S.frame - 1);
    else if (!curProc().split && (S.vi || 0) > 0) switchVariant(S.vi - 1, 'last');
    else { var L = navList(), p = L.indexOf(S.an); if (p > 0) switchAn(L[p - 1], 'last'); }
  }
  /* ---------- ulubione (localStorage): osobna zakładka, zabieg zostaje też w swojej kategorii ---------- */
  var FAV_KEY = 'surgitome-fav', FAV_DEFAULT = ['esoph', 'whip', 'rygb', 'rh', 'ar'], FAV;
  try { FAV = JSON.parse(localStorage.getItem(FAV_KEY)); } catch (e) { FAV = null; }
  if (!Array.isArray(FAV)) FAV = FAV_DEFAULT.slice();
  FAV = FAV.filter(function (id) { return A.PROCS.some(function (p) { return p.id === id; }); });
  function favIdx() { return FAV.map(function (id) { for (var i = 0; i < A.PROCS.length; i++) if (A.PROCS[i].id === id) return i; return -1; }).filter(function (i) { return i >= 0; }); }
  function isFav(i) { return FAV.indexOf(A.PROCS[i].id) >= 0; }
  function toggleFav(i) {
    var id = A.PROCS[i].id, k = FAV.indexOf(id);
    if (k >= 0) FAV.splice(k, 1); else FAV.push(id);
    try { localStorage.setItem(FAV_KEY, JSON.stringify(FAV)); } catch (e) {}
    renderTabs(); if (!$('mMenu').hidden) renderMobileMenu();
  }
  // lista zabiegów do „dalej/wstecz” po ostatnim kadrze: w zakładce Ulubione — kolejne ulubione, inaczej wszystkie
  // badania (kategoria „trials”) są ukryte: nie ma ich w pasku kategorii ani w kolejce „dalej”; dostępne z wyszukiwarki, po oznaczeniu gwiazdką — w Ulubionych
  function navList() { if (S.cat === 'fav' || S.cat === 'trials') return catProcs(S.cat); return A.PROCS.map(function (p, i) { return p.split ? -1 : i; }).filter(function (i) { return i >= 0; }); }
  function uiCats() { return [{ id: 'fav', name: 'Ulubione' }].concat(A.CATS.filter(function (c) { return c.id !== 'trials'; })); }
  function catProcs(cat) {
    if (cat === 'fav') return favIdx();
    return A.PROCS.map(function (p, i) { return p.cat === cat && (cat !== 'trials' || i === S.an || isFav(i)) ? i : -1; }).filter(function (i) { return i >= 0; });
  }
  function pickCat(id) {
    S.cat = id; var L = catProcs(id);
    if (L.length && L.indexOf(S.an) < 0) switchAn(L[0], 0); else renderTabs();
  }
  function switchAn(idx, frame, vi) {
    S.an = (idx + A.PROCS.length) % A.PROCS.length; S.highlight = null;
    if (S.cat !== A.PROCS[S.an].cat && !(S.cat === 'fav' && isFav(S.an))) S.cat = A.PROCS[S.an].cat;
    S.vi = vi != null ? vi : frame === 'last' ? curProc().variants.length - 1 : 0;
    FR = framesFor(curProc(), S.vi);
    renderTabs(); renderStrip();
    goTo(frame === 'last' ? FR.length - 1 : (frame || 0), { fade: true });
    gcView();
  }
  // Statystyki wyboru zabiegu/wariantu (GoatCounter, tylko gdy skrypt załadowany — GitHub Pages). Liczone dopiero po 2 s
  // na tym samym widoku, żeby szybkie przewijanie zakładek nie dawało fałszywych wyświetleń. Ścieżka: zabieg/<id>[/<wariant>].
  var gcT = null;
  function gcView() {
    clearTimeout(gcT);
    gcT = setTimeout(function () {
      var g = window.goatcounter; if (!g || typeof g.count !== 'function') return;
      var P = curProc(), v = P.variants[S.vi || 0], multi = P.variants.length > 1;
      try { g.count({ path: 'zabieg/' + P.id + (multi ? '/' + (v.id || S.vi) : ''), title: !multi || !v.short ? P.short : v.short.indexOf(P.short) === 0 ? v.short : P.short + ' — ' + v.short, event: true }); } catch (e) {}
    }, 2000);
  }
  function switchVariant(k, frame) {
    S.vi = k; S.highlight = null;
    var keep = S.frame;
    FR = framesFor(curProc(), S.vi);
    renderTabs(); renderStrip();
    var target = frame === 'first' ? 0 : frame === 'last' ? FR.length - 1 : frame === 'firstVar' ? Math.max(0, FR.findIndex(function (f) { return f.k === 'var' || f.k === 'endo'; })) : Math.min(keep, FR.length - 1);
    goTo(target, { fade: true });
    gcView();
  }
  function togglePlay() {
    var fr = FR[S.frame];
    if (fr.kind === 'endo') {
      if (!$('choice').hidden) return;
      if (!endo.playing && endo.s >= endo.route.total - 0.01) { resetEndo(); updateDock(); return; }
      endo.playing = !endo.playing;
    } else if (fr.m1 > fr.m0) {
      if (S.m >= fr.m1 - 1e-4) { S.m = fr.m0; applyM(); S.playing = true; }
      else S.playing = !S.playing;
    }
    updateDock();
  }

  /* ---------- UI ---------- */
  function renderTabs() {
    var cat = S.cat, cats = $('cats'), nav = $('tabs');
    cats.innerHTML = ''; nav.innerHTML = '';
    uiCats().forEach(function (c) {
      var b = document.createElement('button'); b.className = 'cat' + (c.id === 'fav' ? ' catfav' : ''); setT(b, c.name);
      if (c.id === 'fav') b.insertAdjacentHTML('afterbegin', '<span class="cstar" aria-hidden="true">★</span>');
      b.setAttribute('aria-pressed', c.id === cat ? 'true' : 'false');
      b.onclick = function () { if (c.id !== cat) pickCat(c.id); };
      cats.appendChild(b);
    });
    var L = catProcs(cat);
    if (!L.length) { var h = document.createElement('span'); h.className = 'favhint'; setT(h, 'Brak ulubionych — oznacz zabiegi gwiazdką ☆ w pozostałych zakładkach (lub klawiszem F).'); nav.appendChild(h); }
    L.forEach(function (i, n) {
      var an = A.PROCS[i], b = document.createElement('button'); b.className = 'tab'; b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', i === S.an ? 'true' : 'false');
      var t = document.createElement('span'); setT(t, an.short); b.appendChild(t);
      var st = document.createElement('span'); st.className = 'star' + (isFav(i) ? ' on' : ''); st.textContent = isFav(i) ? '★' : '☆';
      st.setAttribute('role', 'button'); st.title = tr(isFav(i) ? 'Usuń z ulubionych' : 'Dodaj do ulubionych') + ' (F)';
      st.onclick = function (ev) { ev.stopPropagation(); toggleFav(i); };
      b.appendChild(st); b.title = tr(an.title) + (n < 9 ? ' (' + (n + 1) + ')' : '');
      b.onclick = function () { if (i !== S.an) switchAn(i, 0); };
      nav.appendChild(b);
      if (i === S.an && b.scrollIntoView) try { b.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) {}
    });
    var P = curProc(), vb = $('variants'); vb.innerHTML = '';
    // warianty tylko dla zabiegu widocznego w bieżącej zakładce (np. po odgwiazdkowaniu go w Ulubionych — ukryte)
    var showV = P.variants.length > 1 && L.indexOf(S.an) >= 0;
    vb.hidden = !showV;
    if (showV && P.split) {
      // badanie: zamiast wariantów — nazwy ramion
      P.variants.forEach(function (v, k) {
        if (k) { var vs = document.createElement('span'); vs.className = 'armvs'; vs.textContent = 'vs'; vb.appendChild(vs); }
        var t = document.createElement('span'); t.className = 'armtag arm' + k; setT(t, v.vshort); vb.appendChild(t);
      });
    } else if (showV) {
      var lb = document.createElement('span'); lb.className = 'vlabel'; setT(lb, 'Wariant:'); vb.appendChild(lb);
      P.variants.forEach(function (v, k) {
        var b = document.createElement('button'); b.className = 'vbtn'; setT(b, v.vshort);
        b.setAttribute('aria-pressed', k === (S.vi || 0) ? 'true' : 'false'); b.title = tr(v.title);
        b.onclick = function () { if (k !== (S.vi || 0)) switchVariant(k); };
        vb.appendChild(b);
      });
    }
  }
  function renderStrip() {
    var st = $('strip'); st.innerHTML = '';
    var r1 = document.createElement('div'); r1.className = 'srow srow1';
    var r2 = document.createElement('div'); r2.className = 'srow srow2';
    FR.forEach(function (fr, i) {
      var b = document.createElement('button'); b.className = 'step'; b.dataset.i = i;
      b.innerHTML = '<em></em><span></span>'; b.querySelector('em').textContent = fr.num; setT(b.querySelector('span'), fr.short);
      b.title = tr(fr.title); b.onclick = function () { goTo(i); };
      (/[′″‴⁗]/.test(fr.num) ? r2 : r1).appendChild(b);
    });
    st.appendChild(r1);
    if (r2.children.length) { var lb = document.createElement('span'); lb.className = 'sgh'; lb.textContent = 'Warianty'; r2.insertBefore(lb, r2.firstChild); st.appendChild(r2); }
  }
