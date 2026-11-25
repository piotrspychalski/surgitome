/* SURGITOME — panel autora. (c) 2026 Piotr Spychalski · MIT License
 * Odszyfrowanie danych (hasło → klucz, src/szyfr.js), wykresy ról i ruchu (GoatCounter), moduł SURGITOME-STUDY (src/study.js).
 * Zapamiętany klucz leży w IndexedDB tej przeglądarki jako klucz nieeksportowalny; „Wyloguj” go usuwa. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var PACZKA = null, DANE = null;
  var WYBOR = [{ id: 'student', nazwa: 'student', kolor: 'var(--s-student)' }, { id: 'pacjent', nazwa: 'pacjent', kolor: 'var(--s-pacjent)' },
    { id: 'lekarz', nazwa: 'lekarz', kolor: 'var(--s-lekarz)' }, { id: 'pominieto', nazwa: 'pominięto', kolor: 'var(--s-pominieto)' }];
  // warstwy słupków od dołu: pominięto, student, pacjent, lekarz — tylko w tej kolejności sąsiednie kolory są rozróżnialne przy daltonizmie
  var WARSTWY = ['pominieto', 'student', 'pacjent', 'lekarz'];
  var DN = ['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'sb'];
  var STAN = { zakres: '30', grupuj: 'dzien', tab: 'role' };
  try { Object.assign(STAN, JSON.parse(localStorage.getItem('surgitome-admin-widok') || '{}')); } catch (e) { /* bez pamięci widoku */ }
  function zapiszStan() { try { localStorage.setItem('surgitome-admin-widok', JSON.stringify(STAN)); } catch (e) { /* bez pamięci widoku */ } }

  /* ---------- drobiazgi ---------- */
  function esc(s) { return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmtN(v, nd) {
    if (v === null || v === undefined || (typeof v === 'number' && isNaN(v))) return '—';
    return Number(v).toLocaleString('pl-PL', { minimumFractionDigits: nd || 0, maximumFractionDigits: nd || 0 });
  }
  function pct(a, b) { return b ? fmtN(100 * a / b) + '%' : '—'; }
  function dzien(s) { return new Date(s + 'T00:00:00Z'); }
  function krotka(s) { var d = dzien(s); return d.getUTCDate() + '.' + ('0' + (d.getUTCMonth() + 1)).slice(-2); }
  function pelna(s) { var d = dzien(s); return DN[d.getUTCDay()] + ' ' + krotka(s) + '.' + d.getUTCFullYear(); }
  function przesun(s, n) { var d = dzien(s); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function poniedzialek(s) { return przesun(s, -((dzien(s).getUTCDay() + 6) % 7)); }
  function seria(nazwa) { return (DANE.zdarzenia && DANE.zdarzenia[nazwa]) || DANE.dni.map(function () { return 0; }); }
  function zlicz(s, idx) { return idx.reduce(function (a, i) { return a + (s[i] || 0); }, 0); }

  /* ---------- klucz zapamiętany w IndexedDB ---------- */
  function idb(tryb, fn) {
    return new Promise(function (ok, err) {
      var rq;
      try { rq = indexedDB.open('surgitome-admin', 1); } catch (e) { err(e); return; }
      rq.onupgradeneeded = function () { rq.result.createObjectStore('klucze'); };
      rq.onerror = function () { err(rq.error); };
      rq.onsuccess = function () {
        var db = rq.result, tx = db.transaction('klucze', tryb), r = fn(tx.objectStore('klucze'));
        tx.oncomplete = function () { db.close(); ok(r && r.result); };
        tx.onerror = function () { db.close(); err(tx.error); };
      };
    });
  }
  function kluczZapisz(k) { return idb('readwrite', function (st) { return st.put(k, 'klucz'); }); }
  function kluczWczytaj() { return idb('readonly', function (st) { return st.get('klucz'); }); }
  function kluczUsun() { return idb('readwrite', function (st) { return st.delete('klucz'); }); }

  /* ---------- logowanie ---------- */
  async function pobierz() {
    var r = await fetch('dane.enc.json', { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }
  function pokazLogin(msg) {
    $('app').hidden = true; $('login').hidden = false;
    $('loginMsg').hidden = !msg; $('loginMsg').textContent = msg || '';
    setTimeout(function () { $('haslo').focus(); }, 0);
  }
  async function start() {
    try { PACZKA = await pobierz(); } catch (e) { pokazLogin('Nie udało się pobrać danych (' + e.message + ').'); $('otworz').disabled = true; return; }
    var k = null;
    try { k = await kluczWczytaj(); } catch (e) { k = null; }
    if (k) {
      try { DANE = await Szyfr.odszyfruj(PACZKA, k); pokazApp(); return; } catch (e) { try { await kluczUsun(); } catch (e2) { /* nic */ } }
    }
    pokazLogin();
  }
  $('loginForm').addEventListener('submit', async function (ev) {
    ev.preventDefault();
    var b = $('otworz'), h = $('haslo').value;
    if (!PACZKA || !h) return;
    b.disabled = true; b.textContent = 'Odszyfrowuję…'; $('loginMsg').hidden = true;
    try {
      var k = await Szyfr.klucz(h, PACZKA.iter, PACZKA.sol);
      DANE = await Szyfr.odszyfruj(PACZKA, k);
      if ($('pamietaj').checked) { try { await kluczZapisz(k); } catch (e) { /* przeglądarka bez IndexedDB — bez zapamiętania */ } }
      $('haslo').value = '';
      pokazApp();
    } catch (e) {
      $('loginMsg').textContent = 'Nieprawidłowe hasło.'; $('loginMsg').hidden = false; $('haslo').select();
    }
    b.disabled = false; b.textContent = 'Otwórz';
  });
  $('wyloguj').onclick = async function () {
    try { await kluczUsun(); } catch (e) { /* nic */ }
    DANE = null; STUDY_PLIKI = []; $('studyWyniki').innerHTML = ''; $('studyStan').textContent = 'Nie wczytano plików.';
    pokazLogin();
  };

  /* ---------- widok ---------- */
  function pokazApp() {
    $('login').hidden = true; $('app').hidden = false;
    var t = new Date(DANE.utworzono), godz = (Date.now() - t) / 3600e3;
    $('meta').textContent = 'Dane z ' + t.toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'short' }) + ' · od ' + pelna(DANE.dni[0]).slice(3) + ' · GoatCounter: ' + DANE.site;
    var ban = [];
    if (DANE.przyklad) ban.push('DANE PRZYKŁADOWE — wymyślone, tylko do sprawdzenia wyglądu panelu.');
    if (godz > 36) ban.push('Dane mają ' + fmtN(godz / 24) + ' dni. Automatyczne odświeżanie mogło się zatrzymać (GitHub wyłącza harmonogram po 60 dniach bez zmian w repozytorium) — kliknij „Odśwież dane”, potem „Run workflow”.');
    $('baner').hidden = !ban.length; $('baner').textContent = ban.join(' ');
    $('weryf').disabled = !(DANE.study && DANE.study.kody);
    if ($('weryf').disabled) { $('weryf').checked = false; $('weryf').parentNode.title = 'Brak listy skrótów kodów STUDY w danych panelu.'; }
    ustawPrzyciski(); pokazTab(); rysujWszystko();
  }
  function ustawPrzyciski() {
    [['zakres', STAN.zakres], ['grupuj', STAN.grupuj]].forEach(function (p) {
      [].forEach.call($(p[0]).querySelectorAll('button'), function (b) { b.setAttribute('aria-pressed', b.dataset.v === p[1] ? 'true' : 'false'); });
    });
  }
  function pokazTab() {
    [].forEach.call(document.querySelectorAll('.tabs button'), function (b) {
      var on = b.dataset.tab === STAN.tab;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      $('tab-' + b.dataset.tab).hidden = !on;
    });
    $('filters').hidden = STAN.tab === 'study';
  }
  [].forEach.call(document.querySelectorAll('.tabs button'), function (b) {
    b.onclick = function () { STAN.tab = b.dataset.tab; zapiszStan(); pokazTab(); rysujWszystko(); };
  });
  ['zakres', 'grupuj'].forEach(function (id) {
    $(id).addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      STAN[id] = b.dataset.v; zapiszStan(); ustawPrzyciski(); rysujWszystko();
    });
  });

  function okno() {
    var n = DANE.dni.length, k = STAN.zakres === 'all' ? n : Math.min(n, +STAN.zakres), out = [];
    for (var i = n - k; i < n; i++) out.push(i);
    return out;
  }
  function okresy(idx) {
    var D = DANE.dni;
    if (STAN.grupuj === 'dzien') return idx.map(function (i) { return { kr: krotka(D[i]), pel: pelna(D[i]), idx: [i] }; });
    var out = [], mapa = {};
    idx.forEach(function (i) { var p = poniedzialek(D[i]); if (!mapa[p]) { mapa[p] = { p: p, idx: [] }; out.push(mapa[p]); } mapa[p].idx.push(i); });
    return out.map(function (o) {
      return { kr: krotka(o.p), pel: 'tydzień ' + krotka(o.p) + '–' + krotka(przesun(o.p, 6)) + '.' + dzien(o.p).getUTCFullYear() + (o.idx.length < 7 ? ' (' + o.idx.length + ' z 7 dni w zakresie)' : ''), idx: o.idx };
    });
  }

  function rysujWszystko() {
    if (!DANE) return;
    if (STAN.tab === 'role') rysujRole();
    else if (STAN.tab === 'ruch') rysujRuch();
  }

  /* ---------- zakładka: role ---------- */
  function kafelekRole(tytul, rolki, prefiks, idx, przypis) {
    var w = rolki.map(function (r) { return { r: r, v: zlicz(seria(prefiks + r.id), idx) }; }), suma = w.reduce(function (a, x) { return a + x.v; }, 0);
    return '<div class="card tile"><div class="lab">' + esc(tytul) + '</div><div class="big num">' + fmtN(suma) + '</div><div class="rows">' +
      w.map(function (x) { return '<span class="sw" style="background:' + x.r.kolor + '"></span><span>' + esc(x.r.nazwa) + '</span><span class="num">' + fmtN(x.v) + '</span><span class="pct num">' + pct(x.v, suma) + '</span>'; }).join('') +
      '</div>' + (przypis ? '<p class="note">' + przypis + '</p>' : '') + '</div>';
  }
  function rysujRole() {
    var idx = okno(), ok = okresy(idx), wiz = WYBOR.slice(0, 3);
    var zak = STAN.zakres === 'all' ? 'cały okres' : 'ostatnie ' + STAN.zakres + ' dni';
    $('roleTiles').innerHTML = kafelekRole('Wybory roli — ' + zak, WYBOR, 'rola-wybor/', idx, 'Okno „Kim jesteś?” działa od 25.11.2026; wcześniejsze dni nie mają tych danych.') +
      kafelekRole('Wizyty z wybraną rolą — ' + zak, wiz, 'rola-wizyta/', idx);
    var warstwy = function (prefiks, lista) {
      return WARSTWY.filter(function (id) { return lista.some(function (r) { return r.id === id; }); }).map(function (id) {
        var r = WYBOR.filter(function (x) { return x.id === id; })[0], s = seria(prefiks + id);
        return { nazwa: r.nazwa, kolor: r.kolor, w: ok.map(function (o) { return zlicz(s, o.idx); }) };
      });
    };
    slupki($('chWybor'), { okresy: ok, serie: warstwy('rola-wybor/', WYBOR), opis: 'Wybory roli w czasie' }, $('lgWybor'), $('tbWybor'));
    slupki($('chWizyta'), { okresy: ok, serie: warstwy('rola-wizyta/', wiz), opis: 'Wizyty według roli w czasie' }, $('lgWizyta'), $('tbWizyta'));
  }

  /* ---------- zakładka: ruch ---------- */
  var LISTY = [['toprefs', 'Źródła wejść'], ['campaigns', 'Kampanie (np. ?ref=qr)'], ['sizes', 'Urządzenia (szerokość ekranu)'], ['locations', 'Kraje'],
    ['browsers', 'Przeglądarki'], ['systems', 'Systemy']];
  var NAZWY = { 'Phones': 'telefony', 'Tablets': 'tablety', 'Computer monitors': 'komputery', 'Computer monitors larger than HD': 'duże monitory',
    'Larger computer monitors': 'duże monitory', '(unknown)': '(nieznane)', '': '(bezpośrednio / nieznane)', '(brak)': '(bezpośrednio / nieznane)' };
  function rysujRuch() {
    var idx = okno(), ok = okresy(idx), odw = DANE.odwiedziny, suma = zlicz(odw, idx), maxI = idx[0];
    idx.forEach(function (i) { if (odw[i] > odw[maxI]) maxI = i; });
    var zak = STAN.zakres === 'all' ? 'cały okres' : 'ostatnie ' + STAN.zakres + ' dni';
    $('ruchTiles').innerHTML =
      '<div class="card tile"><div class="lab">Odwiedziny — ' + zak + '</div><div class="big num">' + fmtN(suma) + '</div><div class="note">średnio ' + fmtN(suma / (idx.length || 1), 1) + ' dziennie</div></div>' +
      '<div class="card tile"><div class="lab">Najwięcej w jednym dniu</div><div class="big num">' + fmtN(odw[maxI]) + '</div><div class="note">' + esc(pelna(DANE.dni[maxI])) + '</div></div>';
    slupki($('chOdw'), { okresy: ok, serie: [{ nazwa: 'odwiedziny', kolor: 'var(--s-jeden)', w: ok.map(function (o) { return zlicz(odw, o.idx); }) }], opis: 'Odwiedziny strony w czasie' }, null, $('tbOdw'));
    var L = (DANE.listy || {})[STAN.zakres] || {};
    $('listyNote').textContent = 'Listy poniżej: ' + zak + ' (według GoatCountera, niezależnie od grupowania).';
    $('listy').innerHTML = LISTY.map(function (l) {
      var it = (L[l[0]] || []).slice().sort(function (a, b) { return b.count - a.count; }).slice(0, 10), max = it.reduce(function (a, x) { return Math.max(a, x.count); }, 0), sm = it.reduce(function (a, x) { return a + x.count; }, 0);
      return '<article class="card panel"><h3>' + esc(l[1]) + '</h3>' + (it.length ? '<ul class="lista">' + it.map(function (x) {
        var nm = NAZWY.hasOwnProperty(x.name) ? NAZWY[x.name] : x.name;
        return '<li><span class="nm" title="' + esc(nm) + '">' + esc(nm) + '</span><span class="ct">' + fmtN(x.count) + ' · ' + pct(x.count, sm) + '</span><span class="bar" style="width:' + (max ? Math.max(1, 100 * x.count / max) : 0) + '%"></span></li>';
      }).join('') + '</ul>' : '<div class="empty">Brak danych.</div>') + '</article>';
    }).join('') + '<article class="card panel"><h3>Najczęstsze adresy (cały okres)</h3><ul class="lista">' + (DANE.sciezki || []).slice(0, 10).map(function (x) {
      return '<li><span class="nm" title="' + esc(x.path) + '">' + esc(x.path) + '</span><span class="ct">' + fmtN(x.count) + '</span></li>';
    }).join('') + '</ul></article>';
  }

  /* ---------- wykres słupkowy (skumulowany), legenda, tabela, podpowiedź ---------- */
  function ticks(max) {
    var raw = max / 4, mag = Math.pow(10, Math.floor(Math.log10(raw || 1))), nrm = raw / mag;
    var st = Math.max(1, (nrm <= 1 ? 1 : nrm <= 2 ? 2 : nrm <= 2.5 ? 2.5 : nrm <= 5 ? 5 : 10) * mag);
    if (st % 1) st = Math.ceil(st);
    var out = []; for (var v = 0; v < max + st; v += st) { out.push(v); if (v >= max) break; }
    return out;
  }
  function seg(x, y, w, h, r, kolor) {
    if (h <= 0) return '';
    if (r <= 0) return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" style="fill:' + kolor + '"/>';
    return '<path d="M' + x.toFixed(1) + ',' + (y + h).toFixed(1) + 'V' + (y + r).toFixed(1) + 'Q' + x.toFixed(1) + ',' + y.toFixed(1) + ' ' + (x + r).toFixed(1) + ',' + y.toFixed(1) +
      'H' + (x + w - r).toFixed(1) + 'Q' + (x + w).toFixed(1) + ',' + y.toFixed(1) + ' ' + (x + w).toFixed(1) + ',' + (y + r).toFixed(1) + 'V' + (y + h).toFixed(1) + 'Z" style="fill:' + kolor + '"/>';
  }
  function slupki(host, cfg, legenda, tabela) {
    host.__cfg = cfg;
    var serie = cfg.serie, lego = serie.slice().reverse();  // legenda od góry słupka
    if (legenda) legenda.innerHTML = serie.length > 1 ? lego.map(function (s) {
      return '<span><span class="sw" style="background:' + s.kolor + '"></span>' + esc(s.nazwa) + ' <b class="num">' + fmtN(s.w.reduce(function (a, v) { return a + v; }, 0)) + '</b></span>';
    }).join('') : '';
    if (tabela) {
      var wiersze = cfg.okresy.map(function (o, i) { return { o: o, i: i }; }).reverse();
      tabela.innerHTML = '<table><thead><tr><th>Okres</th>' + lego.map(function (s) { return '<th>' + esc(s.nazwa) + '</th>'; }).join('') + (serie.length > 1 ? '<th>razem</th>' : '') + '</tr></thead><tbody>' +
        wiersze.map(function (r) {
          var sm = 0, td = lego.map(function (s) { sm += s.w[r.i]; return '<td>' + fmtN(s.w[r.i]) + '</td>'; }).join('');
          return '<tr><td>' + esc(r.o.pel) + '</td>' + td + (serie.length > 1 ? '<td><b>' + fmtN(sm) + '</b></td>' : '') + '</tr>';
        }).join('') + '</tbody></table>';
    }
    rysuj(host);
  }
  function rysuj(host) {
    var cfg = host.__cfg; if (!cfg || host.offsetParent === null) return;
    var W = Math.max(260, Math.round(host.clientWidth)), H = W < 520 ? 190 : 230, n = cfg.okresy.length, serie = cfg.serie;
    var sumy = cfg.okresy.map(function (o, i) { return serie.reduce(function (a, s) { return a + s.w[i]; }, 0); });
    var max = Math.max.apply(null, sumy.concat([0]));
    if (!n || !max) { host.innerHTML = '<div class="empty">Brak danych w wybranym okresie.</div>'; return; }
    var tk = ticks(max), ymax = tk[tk.length - 1];
    var L = 10 + 7 * fmtN(ymax).length, R = 4, T = 8, B = 24, pw = W - L - R, ph = H - T - B;
    var band = pw / n, bw = Math.max(1, Math.min(28, band * 0.72)), odstep = bw >= 6 ? 2 : 0;
    var y = function (v) { return T + ph - v / ymax * ph; };
    var s = ['<svg viewBox="0 0 ' + W + ' ' + H + '" height="' + H + '" role="img" aria-label="' + esc(cfg.opis) + '">'];
    tk.forEach(function (v) {
      var yy = Math.round(y(v)) + 0.5;
      s.push('<line class="' + (v === 0 ? 'base' : 'gl') + '" x1="' + L + '" x2="' + (W - R) + '" y1="' + yy + '" y2="' + yy + '"/><text class="tick" x="' + (L - 6) + '" y="' + (yy + 4) + '" text-anchor="end">' + fmtN(v) + '</text>');
    });
    s.push('<rect class="hov" x="0" y="' + T + '" width="' + band.toFixed(1) + '" height="' + ph + '" visibility="hidden"/>');
    for (var i = 0; i < n; i++) {
      var x = L + i * band + (band - bw) / 2, acc = 0, top = -1;
      for (var k = serie.length - 1; k >= 0; k--) if (serie[k].w[i] > 0) { top = k; break; }
      for (k = 0; k < serie.length; k++) {
        var v = serie[k].w[i]; if (!v) continue;
        var y1 = y(acc + v), h = y(acc) - y1 - (acc > 0 ? odstep : 0);
        acc += v;
        s.push(seg(x, y1, bw, Math.max(h, 1), k === top ? Math.min(4, bw / 2, Math.max(h, 1)) : 0, serie[k].kolor));
      }
    }
    var maxL = Math.max(2, Math.floor(pw / 54)), krok = Math.ceil(n / maxL);
    for (i = 0; i < n; i++) {
      if ((n - 1 - i) % krok) continue;
      var lx = L + (i + 0.5) * band, kot = 'middle';  // skrajne etykiety nie wychodzą poza wykres
      if (lx + 16 > W - R) { lx = W - R; kot = 'end'; } else if (lx - 16 < L) { lx = L; kot = 'start'; }
      s.push('<text class="tick" x="' + lx.toFixed(1) + '" y="' + (H - 6) + '" text-anchor="' + kot + '">' + esc(cfg.okresy[i].kr) + '</text>');
    }
    s.push('</svg>');
    host.innerHTML = s.join('');
    var svg = host.firstChild, hov = svg.querySelector('.hov');
    function pokaz(e) {
      var rc = svg.getBoundingClientRect(), px = (e.clientX - rc.left) * (W / rc.width), i = Math.floor((px - L) / band);
      if (i < 0 || i >= n || px > W - R) { ukryj(); return; }
      hov.setAttribute('x', (L + i * band).toFixed(1)); hov.setAttribute('visibility', 'visible');
      var tip = $('tip'), sm = 0, wiersze = serie.slice().reverse().map(function (se) {
        sm += se.w[i];
        return '<div class="r"><span class="sw" style="background:' + se.kolor + '"></span><span>' + esc(se.nazwa) + '</span><b class="num">' + fmtN(se.w[i]) + '</b></div>';
      }).join('');
      tip.innerHTML = '<b>' + esc(cfg.okresy[i].pel) + '</b>' + wiersze + (serie.length > 1 ? '<div class="r sum"><span></span><span>razem</span><b class="num">' + fmtN(sm) + '</b></div>' : '');
      tip.hidden = false;
      var tw = tip.offsetWidth, th = tip.offsetHeight, tx = e.clientX + 14, ty = e.clientY - th - 10;
      if (tx + tw > window.innerWidth - 8) tx = e.clientX - tw - 14;
      if (tx < 8) tx = 8;
      if (ty < 8) ty = e.clientY + 16;
      tip.style.left = tx + 'px'; tip.style.top = ty + 'px';
    }
    function ukryj() { hov.setAttribute('visibility', 'hidden'); $('tip').hidden = true; }
    svg.addEventListener('pointermove', pokaz);
    svg.addEventListener('pointerdown', pokaz);
    svg.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'touch') ukryj(); });
    host.__ukryj = ukryj;
  }
  document.addEventListener('pointerdown', function (e) {
    if (!e.target.closest || !e.target.closest('.chart svg')) { $('tip').hidden = true; [].forEach.call(document.querySelectorAll('.chart'), function (c) { if (c.__ukryj) c.__ukryj(); }); }
  });
  window.addEventListener('scroll', function () { $('tip').hidden = true; }, { passive: true });
  var rt = 0;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { [].forEach.call(document.querySelectorAll('.chart'), rysuj); }, 120); });
  document.addEventListener('toggle', function () { /* tabela nie zmienia wykresu */ }, true);

  /* ---------- zakładka: SURGITOME-STUDY ---------- */
  var STUDY_PLIKI = [];
  var ROLA_PL = { surgeon: 'chirurg — specjalista', resident: 'rezydent chirurgii', physician: 'lekarz innej specjalności', student: 'student medycyny',
    professional: 'inny profesjonalista medyczny', patient: 'pacjent', unknown: 'nieznana' };
  try { $('pomin').value = localStorage.getItem('surgitome-admin-pomin') || ''; } catch (e) { /* nic */ }
  $('wybierz').onclick = function () { $('pliki').click(); };
  $('pliki').onchange = function () { wczytajPliki(this.files); this.value = ''; };
  var drop = $('drop');
  ['dragenter', 'dragover'].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add('over'); }); });
  ['dragleave', 'drop'].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.remove('over'); }); });
  drop.addEventListener('drop', function (e) { if (e.dataTransfer && e.dataTransfer.files.length) wczytajPliki(e.dataTransfer.files); });
  ['grupa', 'dostep', 'weryf'].forEach(function (id) { $(id).onchange = liczStudy; });
  $('pomin').onchange = function () { try { localStorage.setItem('surgitome-admin-pomin', $('pomin').value); } catch (e) { /* nic */ } liczStudy(); };

  async function wczytajPliki(lista) {
    var nowe = await Promise.all([].map.call(lista, function (f) { return f.text().then(function (t) { return { name: f.name, text: t }; }); }));
    var nazwy = nowe.map(function (f) { return f.name; });
    STUDY_PLIKI = STUDY_PLIKI.filter(function (f) { return nazwy.indexOf(f.name) < 0; }).concat(nowe);
    liczStudy();
  }

  async function liczStudy() {
    if (!STUDY_PLIKI.length) return;
    $('studyStan').textContent = 'Liczę…';
    var o = { pomin: $('pomin').value, grupa: $('grupa').value, dostep: $('dostep').value, kody: $('weryf').checked && DANE && DANE.study ? DANE.study.kody : null };
    var w;
    try { w = await Study.analizuj(STUDY_PLIKI, o); } catch (e) { $('studyStan').textContent = 'Błąd analizy: ' + e.message; return; }
    rysujStudy(w, o);
  }

  function opisSUS(d) { return d.n ? fmtN(d.srednia, 1) + ' ± ' + fmtN(d.sd, 1) : '—'; }
  function rysujStudy(w, o) {
    var m = w.meta, r = w.res, P = r.participants;
    var info = ['Pliki: ' + STUDY_PLIKI.map(function (f) { return f.name; }).join(', '), 'zgłoszeń w plikach: ' + m.loaded, 'uczestników: ' + P.length];
    if (m.invalid.length) info.push('odrzucone kody (spoza listy): ' + m.invalid.join(', '));
    if (m.skipped.length) info.push('pominięte: ' + m.skipped.join(', '));
    if (m.superseded) info.push('zastąpione wcześniejsze zgłoszenia: ' + m.superseded);
    if (m.duplicates) info.push('duplikaty: ' + m.duplicates);
    if (m.recoded.length) info.push('dziedzina „inna” → chirurgia ogólna: ' + m.recoded.join(', '));
    if (!o.kody) info.push('kody NIE są sprawdzane');
    if (m.bledy.length) info.push('błędy plików: ' + m.bledy.join('; '));
    $('studyStan').textContent = info.join(' · ');

    // uczestnicy wg roli i dostępu
    var role = {}; P.forEach(function (p) { var k = p.rola; role[k] = role[k] || { invited: 0, open: 0 }; role[k][p.dostep === 'open' ? 'open' : 'invited']++; });
    var rTab = Object.keys(ROLA_PL).filter(function (k) { return role[k]; }).map(function (k) {
      return '<tr><td>' + esc(ROLA_PL[k]) + '</td><td>' + role[k].invited + '</td><td>' + role[k].open + '</td><td><b>' + (role[k].invited + role[k].open) + '</b></td></tr>';
    }).join('');
    var sc = r.scvi_all;
    var h = '<div class="tiles">' +
      '<div class="card tile"><div class="lab">Uczestnicy (po jednym zgłoszeniu na kod)</div><div class="big num">' + P.length + '</div><div class="note">w grupie CVI: ' + r.n_group + ' · chirurdzy z otwartego dostępu: ' + r.n_open_surgeons + ' · oceny zrozumiałości: ' + r.n_comprehension + '</div></div>' +
      '<div class="card tile"><div class="lab">S-CVI/Ave (grupa CVI)</div><div class="big num">' + fmtN(sc[0], 3) + '</div><div class="note">S-CVI/UA ' + fmtN(sc[1], 3) + ' · pozycji z ocenami: ' + sc[2] + ' · operacje: ' + fmtN(r.scvi_ops[0], 3) + ' · pozycje z N ≥ 3: ' + fmtN(r.scvi_n3[0], 3) + '</div></div>' +
      '<div class="card tile"><div class="lab">SUS (wszyscy)</div><div class="big num">' + (r.sus.n ? fmtN(r.sus.srednia, 1) : '—') + '</div><div class="note">n = ' + r.sus.n + (r.sus.n ? ' · SD ' + fmtN(r.sus.sd, 1) + ' · mediana ' + fmtN(r.sus.mediana, 1) + ' [' + fmtN(r.sus.q1, 1) + '–' + fmtN(r.sus.q3, 1) + ']' : '') + '</div></div>' +
      '</div>';
    h += '<article class="card panel"><header><h2>Odpowiedzi w czasie</h2></header><div class="chart" id="chStudy"></div></article>';
    h += '<div class="grid2"><article class="card panel"><h3>Uczestnicy według roli</h3><div class="tablewrap"><table><thead><tr><th>Rola</th><th>zaproszeni</th><th>otwarty</th><th>razem</th></tr></thead><tbody>' + rTab + '</tbody></table></div></article>' +
      '<article class="card panel"><h3>SUS według roli</h3><div class="tablewrap"><table><thead><tr><th>Rola</th><th>n</th><th>średnia ± SD</th><th>mediana [Q1–Q3]</th></tr></thead><tbody>' +
      Object.keys(r.sus_roles).filter(function (k) { return r.sus_roles[k].n; }).map(function (k) {
        var d = r.sus_roles[k];
        return '<tr><td>' + esc(ROLA_PL[k]) + '</td><td>' + d.n + '</td><td>' + opisSUS(d) + '</td><td>' + fmtN(d.mediana, 1) + ' [' + fmtN(d.q1, 1) + '–' + fmtN(d.q3, 1) + ']</td></tr>';
      }).join('') + '</tbody></table></div>' + (r.comprehension_ave[0] !== null ? '<p class="note">Zrozumiałość (pacjenci, studenci): średni odsetek ocen 3–4 = ' + fmtN(100 * r.comprehension_ave[0]) + '% (' + r.comprehension_ave[1] + ' pozycji).</p>' : '') + '</article></div>';
    h += '<article class="card panel"><header><h2>Trafność pozycji (I-CVI)</h2></header><p class="muted small">Grupa CVI: ' + esc($('grupa').selectedOptions[0].textContent) + ', ' + esc($('dostep').selectedOptions[0].textContent) +
      '. Czerwone: I-CVI &lt; 0,78; szare: mniej niż 3 oceniających. k* — zmodyfikowana kappa (Polit, Beck, Owen 2007).</p><div class="tablewrap" style="max-height:none"><table><thead><tr><th>#</th><th class="txt">Pozycja</th><th>N</th><th>3–4</th><th>I-CVI</th><th>k*</th><th>ocena k*</th><th>1/2/3/4</th><th>poza dz.</th><th>niewybr.</th><th>kom.</th></tr></thead><tbody>' +
      r.items.map(function (it) {
        var kl = it.icvi === null ? 'ok' : it.N < 3 ? 'ok' : it.icvi < 0.78 ? 'flag' : '';
        return '<tr><td>' + it.n + '</td><td class="txt">' + esc(it.nazwa) + (it.rodzaj === 'moduł' ? ' <span class="muted">(moduł)</span>' : '') + '</td><td>' + it.N + '</td><td>' + it.A + '</td><td class="' + kl + '">' + fmtN(it.icvi, 2) +
          '</td><td>' + fmtN(it.kappa, 2) + '</td><td>' + esc(it.kappa_ocena) + '</td><td>' + [it.n1, it.n2, it.n3, it.n4].join('/') + '</td><td>' + it.n_poza + '</td><td>' + it.n_niewybrane + '</td><td>' + it.komentarzy + '</td></tr>';
      }).join('') + '</tbody></table></div></article>';
    h += '<article class="card panel"><details><summary><b>Komentarze (' + r.comments.length + ')</b></summary><div class="tablewrap"><table><thead><tr><th>Kod</th><th>Rola</th><th>Pozycja</th><th>Ocena</th><th class="txt">Komentarz</th></tr></thead><tbody>' +
      r.comments.map(function (c) { return '<tr><td>' + esc(c.kod) + '</td><td>' + esc(ROLA_PL[c.rola] || c.rola) + '</td><td>' + esc(c.pozycja) + '</td><td>' + esc(c.ocena) + '</td><td class="txt">' + esc(c.komentarz) + '</td></tr>'; }).join('') +
      '</tbody></table></div></details></article>';
    $('studyWyniki').innerHTML = h;

    // oś czasu: zgłoszenia uczestników dzień po dniu
    var daty = P.map(function (p) { return (p.wyslano || '').slice(0, 10); }).filter(function (d) { return /^\d{4}-\d{2}-\d{2}$/.test(d); }).sort();
    if (daty.length) {
      var dni = []; for (var d = daty[0]; d <= daty[daty.length - 1]; d = przesun(d, 1)) dni.push(d);
      var ok = dni.map(function (x) { return { kr: krotka(x), pel: pelna(x), idx: [] }; });
      slupki($('chStudy'), { okresy: ok, serie: [{ nazwa: 'uczestnicy', kolor: 'var(--s-jeden)', w: dni.map(function (x) { return daty.filter(function (y) { return y === x; }).length; }) }], opis: 'Odpowiedzi z ankiety w czasie' });
    } else $('chStudy').innerHTML = '<div class="empty">Brak dat zgłoszeń.</div>';
  }

  start();
})();
