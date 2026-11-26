/* SURGITOME — panel autora. (c) 2026 Piotr Spychalski · MIT License
 * Pobieranie statystyk z API GoatCountera — wspólne dla publikacji (Node 20+, admin/zbierz.mjs) i przycisku „Odśwież dane” w panelu
 * (przeglądarka: API GoatCountera pozwala na zapytania z innych stron, nagłówek Authorization). Limit API: 4 zapytania na sekundę.
 * Klucz do odświeżania w przeglądarce trafia do zaszyfrowanych danych panelu tylko wtedy, gdy ma WYŁĄCZNIE prawo „Read statistics”
 * (decyzja autora 2026-11-26: odświeżanie na żywo bez wklejania klucza). */
(function (root) {
  'use strict';
  var LISTY = ['toprefs', 'campaigns', 'sizes', 'locations', 'browsers', 'systems'];
  var ZAKRESY = { '7': 7, '30': 30, '90': 90, all: 0 };
  var PERM_NIC = 1, PERM_STATY = 64;  // GoatCounter api_token.go: APIPermNothing = 1, APIPermStats = 64 (Count 2, Export 4, Site* 8/16/32)
  var ZAPYTAN = 1 + 1 + Object.keys(ZAKRESY).length * LISTY.length;  // hits (zwykle 1 strona) + total + listy

  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function iso(d) { return d.toISOString().slice(0, 19) + 'Z'; }
  function dzien(d) { return d.toISOString().slice(0, 10); }
  function dni(od, doDnia) {
    var out = [];
    for (var d = new Date(od + 'T00:00:00Z'); dzien(d) <= doDnia; d.setUTCDate(d.getUTCDate() + 1)) out.push(dzien(d));
    return out;
  }

  /* jedno zapytanie; błąd → wyjątek z polem status (401 zły klucz, 403 brak uprawnienia) */
  function klient(site, token, postep) {
    var k = { zapytan: 0 };
    k.api = async function (sciezka, params) {
      var u = new URL('https://' + site + '.goatcounter.com/api/v0' + sciezka);
      Object.keys(params || {}).forEach(function (p) { if (params[p] !== undefined && params[p] !== '') u.searchParams.set(p, params[p]); });
      for (var proba = 0; proba < 6; proba++) {
        var r = await fetch(u, { headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' } });
        k.zapytan++;
        if (postep) postep(Math.min(k.zapytan, ZAPYTAN), ZAPYTAN);
        if (r.status === 429) { await sleep((+r.headers.get('x-rate-limit-reset') || 1) * 1000 + 250); continue; }
        if (!r.ok) {
          var opis = '';
          try { var j = await r.json(); opis = j.error || JSON.stringify(j.errors || ''); } catch (e) { /* bez treści */ }
          var err = new Error('GoatCounter ' + sciezka + ': HTTP ' + r.status + (r.status === 401 ? ' (zły klucz)' : r.status === 403 ? ' (klucz bez uprawnienia „Read statistics”)' : '') + ' ' + String(opis).slice(0, 120));
          err.status = r.status;
          throw err;
        }
        await sleep(300);
        return r.json();
      }
      throw new Error('GoatCounter ' + sciezka + ': wciąż przekroczony limit zapytań');
    };
    return k;
  }

  /* uprawnienia klucza (GET /me): tylkoOdczyt = wyłącznie „Read statistics” */
  async function uprawnienia(site, token) {
    var me = await klient(site, token).api('/me');
    var p = (me.token && me.token.permissions) || 0;
    return { permissions: p, tylkoOdczyt: (p & PERM_STATY) !== 0 && (p & ~(PERM_STATY | PERM_NIC)) === 0 };
  }

  /* o: { site, start (RRRR-MM-DD), token, postep(n, razem) } → dane panelu (bez daty utworzenia) */
  async function pobierz(o) {
    var k = klient(o.site, o.token, o.postep);
    var teraz = new Date();
    var koniec = new Date(Date.UTC(teraz.getUTCFullYear(), teraz.getUTCMonth(), teraz.getUTCDate(), teraz.getUTCHours() + 1));
    var start = new Date(o.start + 'T00:00:00Z');
    var D = dni(o.start, dzien(teraz)), idx = {};
    D.forEach(function (d, i) { idx[d] = i; });
    var zero = function () { return D.map(function () { return 0; }); };

    // ścieżki i zdarzenia dzień po dniu (z tytułami — nazwy zabiegów w zdarzeniach zabieg/…)
    var hits = [], widziane = {};
    for (var strona = 0; strona < 20; strona++) {
      var r = await k.api('/stats/hits', { start: iso(start), end: iso(koniec), limit: 100, group: 'day', exclude_paths: Object.keys(widziane).join(',') });
      var nowe = (r.hits || []).filter(function (h) { return !widziane[h.path_id]; });
      nowe.forEach(function (h) { widziane[h.path_id] = 1; hits.push(h); });
      if (!r.more || !nowe.length) break;
    }
    var odwiedziny = zero(), zdarzenia = {}, tytuly = {}, sciezki = [];
    hits.forEach(function (h) {
      var seria = zero();
      (h.stats || []).forEach(function (s) { if (s.day in idx) seria[idx[s.day]] += s.daily || 0; });
      if (h.event) { zdarzenia[h.path] = seria; if (h.title) tytuly[h.path] = h.title; }
      else { seria.forEach(function (v, i) { odwiedziny[i] += v; }); sciezki.push({ path: h.path, title: h.title || '', count: h.count || 0 }); }
    });
    sciezki.sort(function (a, b) { return b.count - a.count; });

    var tot = await k.api('/stats/total', { start: iso(start), end: iso(koniec) });
    var lacznie = zero();
    (tot.stats || []).forEach(function (s) { if (s.day in idx) lacznie[idx[s.day]] += s.daily || 0; });

    // listy (źródła, urządzenia, kraje…) dla zakresów 7 / 30 / 90 dni i całości
    var listy = {};
    for (var z in ZAKRESY) {
      var n = ZAKRESY[z], od = n ? new Date(Date.UTC(teraz.getUTCFullYear(), teraz.getUTCMonth(), teraz.getUTCDate() - n + 1)) : start;
      listy[z] = {};
      for (var i = 0; i < LISTY.length; i++) {
        var rl = await k.api('/stats/' + LISTY[i], { start: iso(od < start ? start : od), end: iso(koniec), limit: 15 });
        listy[z][LISTY[i]] = (rl.stats || []).map(function (s) { return { name: s.name || '(brak)', count: s.count || 0 }; });
      }
    }
    return { dane: { dni: D, odwiedziny: odwiedziny, lacznie: lacznie, zdarzenia: zdarzenia, tytuly: tytuly, sciezki: sciezki.slice(0, 15), listy: listy,
      total: tot.total || 0, total_events: tot.total_events || 0 }, zapytan: k.zapytan };
  }

  var API = { LISTY: LISTY, ZAKRESY: ZAKRESY, dni: dni, dzien: dzien, pobierz: pobierz, uprawnienia: uprawnienia };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.GC = API;
})(typeof window !== 'undefined' ? window : globalThis);
