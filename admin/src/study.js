/* SURGITOME — panel autora. (c) 2026 Piotr Spychalski · MIT License
 * Analiza ankiety SURGITOME-STUDY w przeglądarce — rdzeń przeniesiony z tools/analiza_ankiety.py (repozytorium surgitome-study),
 * te same reguły i wzory; zgodność sprawdza tests/test_study.mjs na przykładzie z tests/test_analiza.py (wyniki policzone w Pythonie).
 * Pliki (eksport CSV z Web3Forms, JSON z „Pobierz odpowiedzi”) czyta tylko ta przeglądarka — nic nie jest nigdzie wysyłane.
 *
 * Reguły (jak w analiza_ankiety.py):
 *  - każdy kod liczy się raz — ostatnie zgłoszenie (submitted, przy remisie numer zgłoszenia); identyczne zgłoszenia = duplikaty;
 *  - kody z zaproszeń sprawdzane ze skrótami PBKDF2 (STUDY_CODES z src/app/12-badanie-kody.js); kody otwarte E-… przyjmowane z postaci;
 *  - CVI w grupie eksperckiej (domyślnie chirurdzy: specjaliści i rezydenci) i tylko z zaproszonych (domyślnie), tylko oceny trafności;
 *  - I-CVI = odsetek ocen 3–4 wśród oceniających (bez „poza dziedziną”, braków, pozycji niewybranych); k* wg Polit, Beck, Owen 2007;
 *  - S-CVI/Ave = średnia I-CVI, S-CVI/UA = odsetek pozycji z I-CVI = 1; SUS wg Brooke 1996; kwartyle metodą „inclusive”. */
(function (root) {
  'use strict';
  var ITEMS = [['esoph', 'Esofagektomia'], ['dg', 'Resekcja dystalna'], ['tg', 'Gastrektomia całkowita'], ['gebp', 'Gastroenterostomia omijająca'],
    ['sleeve', 'Rękawowa resekcja (sleeve)'], ['rygb', 'Bypass Roux-en-Y (RYGB)'], ['oagb', 'Bypass jednozespoleniowy (OAGB)'], ['ds', 'Przełączenie dwunastnicze'],
    ['bpd', 'BPD (Scopinaro)'], ['whip', 'Whipple (klasyczny)'], ['pppd', 'Traverso-Longmire (PPPD)'], ['dp', 'Pankreatektomia dystalna'],
    ['hj', 'Hepatikojejunostomia (Roux-en-Y)'], ['cdd', 'Choledochoduodenostomia'], ['drain', 'Operacje drenujące (Puestow, Frey)'], ['liver', 'Anatomia wątroby'],
    ['lv-guz', 'Guz: zakres resekcji'], ['lv-b23', 'Bisegmentektomia II/III'], ['lv-rh', 'Prawa hemihepatektomia'], ['lv-lh', 'Lewa hemihepatektomia'], ['lv-alpps', 'ALPPS'],
    ['oltx', 'Przeszczepienie wątroby'], ['sb', 'Resekcja jelita cienkiego'], ['zakres', 'Wybór zakresu resekcji'], ['rh', 'Hemikolektomia prawa'],
    ['lh', 'Hemikolektomia lewa'], ['ar', 'Resekcja odbytnicy'], ['ira', 'Kolektomia całkowita (IRA)'], ['ipaa', 'Zbiornik J (IPAA)'], ['hartmann', 'Hartmann'], ['ileo', 'Ileostomia']];
  var MODULES = { liver: 1, zakres: 1 };
  var ROLES = [['surgeon', 'chirurg — specjalista'], ['resident', 'rezydent chirurgii'], ['physician', 'lekarz innej specjalności'],
    ['student', 'student medycyny'], ['professional', 'inny profesjonalista medyczny'], ['patient', 'pacjent']];
  var ROLE_SET = {}; ROLES.forEach(function (r) { ROLE_SET[r[0]] = r[1]; });
  var CVI_GROUPS = { chirurdzy: ['surgeon', 'resident'], specjalisci: ['surgeon'], wszyscy: ROLES.map(function (r) { return r[0]; }) };
  var FIELD_ALL = /^\s*(ka[zż]d[aąey]|wszystk\w*|r[oó][zż]n\w*|(chirurgia\s+)?og[oó]ln\w*|all|any|every\w*|various|mixed|general(\s+surgery)?)\s*[.!]?\s*$/i;
  var MARK = '{"study":"SURGITOME-STUDY"';
  var OPEN_CODE = /^E-[0-9a-f]{12}$/, INV_CODE = /^[A-HJ-NP-Z2-9]{6}$/;

  /* ---------- wczytywanie ---------- */
  function parseCSV(text) {  // RFC 4180: cudzysłowy, przecinki i nowe linie w polach, BOM
    text = String(text).replace(/^﻿/, '');
    var rows = [], row = [], f = '', q = false, i = 0, c;
    for (; i < text.length; i++) {
      c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(f); f = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; }
      else f += c;
    }
    if (f !== '' || row.length) { row.push(f); rows.push(row); }
    if (!rows.length) return [];
    var head = rows[0];
    return rows.slice(1).filter(function (r) { return r.length > 1 || r[0] !== ''; }).map(function (r) {
      var o = {}; head.forEach(function (h, k) { o[h] = r[k] === undefined ? '' : r[k]; }); return o;
    });
  }

  function jsonEnd(s, i) {  // koniec obiektu JSON zaczynającego się w s[i] (z uwzględnieniem napisów); -1 gdy niedomknięty
    var d = 0, str = false;
    for (var k = i; k < s.length; k++) {
      var c = s[k];
      if (str) { if (c === '\\') k++; else if (c === '"') str = false; }
      else if (c === '"') str = true;
      else if (c === '{') d++;
      else if (c === '}') { d--; if (d === 0) return k + 1; }
    }
    return -1;
  }
  function unescapeHtml(s) {
    return s.replace(/&#x([0-9a-f]+);/gi, function (_, h) { return String.fromCharCode(parseInt(h, 16)); })
      .replace(/&#(\d+);/g, function (_, d) { return String.fromCharCode(+d); })
      .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  }
  function payloadsFromText(text) {
    var variants = [text, unescapeHtml(text)];
    for (var v = 0; v < variants.length; v++) {
      var clean = variants[v].replace(/[\r\n]/g, ''), out = [], i = clean.indexOf(MARK);
      while (i >= 0) {
        var e = jsonEnd(clean, i), obj = null;
        if (e > 0) { try { obj = JSON.parse(clean.slice(i, e)); } catch (err) { obj = null; } }
        if (obj) { out.push(obj); i = clean.indexOf(MARK, e); } else i = clean.indexOf(MARK, i + 1);
      }
      if (out.length) return out;
    }
    return [];
  }
  function payloadFromCell(v) {
    var j;
    try { j = JSON.parse(v); } catch (e) { return payloadsFromText(v); }
    if (j && typeof j === 'object' && !Array.isArray(j)) {
      if (j.study === 'SURGITOME-STUDY') return [j];
      for (var k in j) if (k.toLowerCase() === 'data' && typeof j[k] === 'string') return payloadFromCell(j[k]);
    }
    return [];
  }
  /* jeden plik → lista {p, src, date} */
  function loadFile(name, text) {
    var low = name.toLowerCase(), out = [];
    if (/\.json$/.test(low)) {
      var obj = JSON.parse(text), objs = Array.isArray(obj) ? obj : [obj];
      objs.forEach(function (o) { if (o && typeof o === 'object' && o.study === 'SURGITOME-STUDY') out.push({ p: o, src: name, date: null }); });
    } else if (/\.csv$/.test(low)) {
      parseCSV(text).forEach(function (row, k) {
        var cells = [];
        Object.keys(row).forEach(function (key) { if (key && key.trim().toLowerCase() === 'data' && row[key]) cells.push(row[key]); });
        if (!cells.length) Object.keys(row).forEach(function (key) { if (typeof row[key] === 'string' && row[key].indexOf(MARK) >= 0) cells.push(row[key]); });
        cells.forEach(function (v) { payloadFromCell(v).forEach(function (p) { out.push({ p: p, src: name + '#' + (k + 2), date: row['Submitted At'] || null }); }); });
      });
    } else {
      payloadsFromText(text).forEach(function (p) { out.push({ p: p, src: name, date: null }); });  // np. treść maila zapisana jako tekst
    }
    return out;
  }

  /* ---------- kody ---------- */
  function hex(u8) { return Array.prototype.map.call(u8, function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); }
  async function pbkdf2Hex(code, salt, iter) {
    var s = (root.crypto || globalThis.crypto).subtle, te = new TextEncoder();
    var k = await s.importKey('raw', te.encode(code), 'PBKDF2', false, ['deriveBits']);
    return hex(new Uint8Array(await s.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: te.encode(salt), iterations: iter }, k, 256)));
  }
  async function validCode(code, cfg, cache) {
    if (OPEN_CODE.test(code || '')) return true;
    if (!(code in cache)) cache[code] = INV_CODE.test(code || '') && cfg.hashes.indexOf(await pbkdf2Hex(code, cfg.salt, cfg.iter)) >= 0;
    return cache[code];
  }

  function cmpKey(p) { return [p.submitted || '', p.submission || 0]; }
  function gt(a, b) { return a[0] > b[0] || (a[0] === b[0] && a[1] > b[1]); }
  function selectLatest(entries) {
    var uniq = new Map(), dup = 0;
    entries.forEach(function (e) {
      var key = JSON.stringify([e.p.code === undefined ? null : e.p.code, e.p.submitted === undefined ? null : e.p.submitted, e.p.submission === undefined ? null : e.p.submission]);
      if (uniq.has(key)) { dup++; return; }
      uniq.set(key, e);
    });
    var best = new Map();
    uniq.forEach(function (e) {
      var c = e.p.code;
      if (!best.has(c) || gt(cmpKey(e.p), cmpKey(best.get(c).p))) best.set(c, e);
    });
    return { chosen: Array.from(best.values()), superseded: uniq.size - best.size, duplicates: dup };
  }
  function recodeFields(parts) {
    var out = [];
    parts.forEach(function (p) {
      var d = p.demographics || {};
      if (d.field === 'other' && FIELD_ALL.test(d.fieldOther || '')) { d.field = 'general'; d.fieldRecoded = true; out.push(p.code); }
    });
    return out;
  }
  function accessOf(p) { return p.access || (OPEN_CODE.test(p.code || '') ? 'open' : 'invited'); }
  function measureOf(p) { return p.ratingMeasure || 'accuracy'; }
  function roleOf(p) {
    var d = p.demographics || {};
    if (ROLE_SET[d.role]) return d.role;
    return { specialist: 'surgeon', resident: 'resident' }[d.status] || 'unknown';
  }
  function itemRows(p) {  // id → [wybrana, ocena 1–4 albo null, poza dziedziną]
    var out = {};
    (p.items || []).forEach(function (x) {
      var sel = x.selected !== false, r = x.rating;
      out[x.id] = [sel, sel && Number.isInteger(r) && r >= 1 && r <= 4 && !x.na ? r : null, sel && !!x.na];
    });
    return out;
  }
  function rowOf(its, iid) { return its[iid] || [true, null, false]; }

  /* ---------- statystyka ---------- */
  function comb(n, k) { var r = 1; for (var i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; }
  function icvi(ratings) {
    var n = ratings.length, a = ratings.filter(function (r) { return r >= 3; }).length;
    if (!n) return { N: 0, A: 0, icvi: null, pc: null, kappa: null, kappa_ocena: '' };
    var i = a / n, pc = comb(n, a) * Math.pow(0.5, n), k = pc < 1 ? (i - pc) / (1 - pc) : null;
    var oc = k === null ? '' : k > 0.74 ? 'doskonała' : k >= 0.60 ? 'dobra' : k >= 0.40 ? 'dostateczna' : 'słaba';
    return { N: n, A: a, icvi: i, pc: pc, kappa: k, kappa_ocena: oc };
  }
  function scvi(list) {
    var v = list.filter(function (x) { return x !== null && x !== undefined; });
    if (!v.length) return [null, null, 0];
    return [v.reduce(function (s, x) { return s + x; }, 0) / v.length, v.filter(function (x) { return x === 1; }).length / v.length, v.length];
  }
  function susScore(a) {
    if (!Array.isArray(a) || a.length !== 10 || a.some(function (x) { return !Number.isInteger(x) || x < 1 || x > 5; })) return null;
    return a.reduce(function (s, x, i) { return s + (i % 2 === 0 ? x - 1 : 5 - x); }, 0) * 2.5;
  }
  function median(xs) { var s = xs.slice().sort(function (a, b) { return a - b; }), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; }
  function describe(xs) {
    xs = xs.filter(function (x) { return x !== null && x !== undefined; });
    var d = { n: xs.length, srednia: null, sd: null, mediana: null, q1: null, q3: null };
    if (!xs.length) return d;
    var m = xs.reduce(function (s, x) { return s + x; }, 0) / xs.length;
    d.srednia = m; d.mediana = median(xs);
    if (xs.length > 1) {
      d.sd = Math.sqrt(xs.reduce(function (s, x) { return s + (x - m) * (x - m); }, 0) / (xs.length - 1));
      var s = xs.slice().sort(function (a, b) { return a - b; }), mm = s.length - 1, q = [];  // statistics.quantiles(n=4, method='inclusive')
      for (var i = 1; i < 4; i++) { var j = Math.floor(i * mm / 4), del = i * mm - j * 4; q.push((s[j] * (4 - del) + s[j + 1] * del) / 4); }
      d.q1 = q[0]; d.q3 = q[2];
    } else { d.sd = 0; d.q1 = xs[0]; d.q3 = xs[0]; }
    return d;
  }

  /* ---------- analiza ---------- */
  function analyse(parts, cviRoles, cviAccess) {
    var res = { items: [], roles: {}, n_group: 0, comments: [] };
    var rows = parts.map(function (p) { return { p: p, role: roleOf(p), its: itemRows(p) }; });
    var acc = rows.filter(function (x) { return measureOf(x.p) === 'accuracy'; });
    var und = rows.filter(function (x) { return measureOf(x.p) === 'comprehensibility'; });
    var group = acc.filter(function (x) { return cviRoles.indexOf(x.role) >= 0 && cviAccess.indexOf(accessOf(x.p)) >= 0; });
    var openSurg = acc.filter(function (x) { return (x.role === 'surgeon' || x.role === 'resident') && accessOf(x.p) === 'open'; });
    res.n_group = group.length; res.n_open_surgeons = openSurg.length; res.n_comprehension = und.length;
    rows.forEach(function (x) {
      (x.p.items || []).forEach(function (it) {
        if ((it.comment || '').trim() && it.selected !== false) res.comments.push({ kod: x.p.code, rola: x.role, pozycja: it.id, ocena: it.na ? 'NA' : it.rating, komentarz: it.comment.trim() });
      });
      [['missing', 'czego brakuje'], ['incorrect', 'co jest błędne']].forEach(function (kl) {
        var t = ((x.p.open || {})[kl[0]] || '').trim();
        if (t) res.comments.push({ kod: x.p.code, rola: x.role, pozycja: 'pytanie: ' + kl[1], ocena: '', komentarz: t });
      });
    });
    var compr = [];
    ITEMS.forEach(function (item, n) {
      var iid = item[0];
      var g = group.map(function (x) { return rowOf(x.its, iid); });
      var ratings = g.filter(function (r) { return r[1] !== null; }).map(function (r) { return r[1]; });
      var na = g.filter(function (r) { return r[2]; }).length, unsel = g.filter(function (r) { return !r[0]; }).length;
      var st = icvi(ratings);
      var cnt = function (v) { return ratings.filter(function (r) { return r === v; }).length; };
      res.items.push({ n: n + 1, id: iid, nazwa: item[1], rodzaj: MODULES[iid] ? 'moduł' : 'operacja', N: st.N, A: st.A, icvi: st.icvi, pc: st.pc, kappa: st.kappa,
        kappa_ocena: st.kappa_ocena, n1: cnt(1), n2: cnt(2), n3: cnt(3), n4: cnt(4), n_poza: na, n_niewybrane: unsel, n_brak: g.length - ratings.length - na - unsel,
        srednia: ratings.length ? ratings.reduce(function (s, x) { return s + x; }, 0) / ratings.length : null,
        komentarzy: res.comments.filter(function (c) { return c.pozycja === iid; }).length });
      ROLES.forEach(function (rl) {
        var rr = acc.filter(function (x) { return x.role === rl[0]; }).map(function (x) { return rowOf(x.its, iid)[1]; }).filter(function (r) { return r !== null; });
        (res.roles[rl[0]] = res.roles[rl[0]] || {})[iid] = icvi(rr);
      });
      var ur = und.map(function (x) { return rowOf(x.its, iid)[1]; }).filter(function (r) { return r !== null; });
      if (ur.length) compr.push(ur.filter(function (r) { return r >= 3; }).length / ur.length);
    });
    var col = function (f) { return res.items.filter(f || function () { return true; }).map(function (r) { return r.icvi; }); };
    res.scvi_all = scvi(col());
    res.scvi_ops = scvi(col(function (r) { return r.rodzaj === 'operacja'; }));
    res.scvi_n3 = scvi(col(function (r) { return r.N >= 3; }));
    res.scvi_roles = {};
    ROLES.forEach(function (rl) { res.scvi_roles[rl[0]] = scvi(Object.keys(res.roles[rl[0]]).map(function (k) { return res.roles[rl[0]][k].icvi; })); });
    res.comprehension_ave = compr.length ? [compr.reduce(function (s, x) { return s + x; }, 0) / compr.length, compr.length] : [null, 0];
    res.participants = rows.map(function (x) {
      var d = x.p.demographics || {};
      return { kod: x.p.code, rola: x.role, dostep: accessOf(x.p), miara: measureOf(x.p), wyslano: x.p.submitted || null, kraj: d.country || null, dziedzina: d.field || null,
        urzadzenie: (x.p.device || {}).type || null, jezyk: x.p.lang || null,
        w_grupie_cvi: cviRoles.indexOf(x.role) >= 0 && measureOf(x.p) === 'accuracy' && cviAccess.indexOf(accessOf(x.p)) >= 0,
        wybranych: Object.keys(x.its).filter(function (k) { return x.its[k][0]; }).length,
        ocenionych: Object.keys(x.its).filter(function (k) { return x.its[k][1] !== null || x.its[k][2]; }).length,
        SUS: susScore(x.p.sus), minuty_aktywne: (x.p.activeMs || 0) / 60000 };
    });
    var P = res.participants;
    res.sus = describe(P.map(function (x) { return x.SUS; }));
    res.sus_roles = {};
    ROLES.forEach(function (rl) { res.sus_roles[rl[0]] = describe(P.filter(function (x) { return x.rola === rl[0]; }).map(function (x) { return x.SUS; })); });
    res.time_active = describe(P.map(function (x) { return x.minuty_aktywne; }));
    return res;
  }

  /* pliki: [{name, text}]; opcje: pomin (napis z kodami), grupa (chirurdzy | specjalisci | wszyscy), dostep (zaproszeni | wszyscy), kody (STUDY_CODES albo null) */
  async function analizuj(pliki, o) {
    o = o || {};
    var entries = [], bledy = [];
    pliki.forEach(function (f) {
      try { entries = entries.concat(loadFile(f.name, f.text)); } catch (e) { bledy.push(f.name + ': ' + e.message); }
    });
    var meta = { loaded: entries.length, invalid: [], skipped: [], bledy: bledy, weryfikacja: !!o.kody };
    var skip = {};
    String(o.pomin || '').split(/[\s,;]+/).forEach(function (x) { if (x.trim()) skip[x.trim().toUpperCase()] = 1; });
    var keep = [], cache = {};
    for (var i = 0; i < entries.length; i++) {
      var c = entries[i].p.code;
      if (skip[String(c || '').toUpperCase()]) { if (meta.skipped.indexOf(c) < 0) meta.skipped.push(c); continue; }
      if (o.kody && !(await validCode(c, o.kody, cache))) { if (meta.invalid.indexOf(String(c)) < 0) meta.invalid.push(String(c)); continue; }
      keep.push(entries[i]);
    }
    var sel = selectLatest(keep);
    meta.superseded = sel.superseded; meta.duplicates = sel.duplicates;
    var parts = sel.chosen.map(function (e) { return e.p; });
    meta.recoded = recodeFields(parts);
    var res = analyse(parts, CVI_GROUPS[o.grupa || 'chirurdzy'], (o.dostep || 'zaproszeni') === 'zaproszeni' ? ['invited'] : ['invited', 'open']);
    return { meta: meta, res: res };
  }

  var API = { ITEMS: ITEMS, ROLES: ROLES, CVI_GROUPS: CVI_GROUPS, parseCSV: parseCSV, loadFile: loadFile, payloadsFromText: payloadsFromText,
    icvi: icvi, scvi: scvi, susScore: susScore, describe: describe, analyse: analyse, analizuj: analizuj, accessOf: accessOf };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.Study = API;
})(typeof window !== 'undefined' ? window : globalThis);
