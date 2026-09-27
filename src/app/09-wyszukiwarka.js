  /* ---------- wyszukiwarka zabiegów (nazwy, warianty, opisy; PL i EN, bez polskich znaków) ---------- */
  function fold(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l'); }
  var SIDX = null;
  function searchIndex() {
    if (SIDX) return SIDX;
    SIDX = [];
    A.PROCS.forEach(function (p, i) {
      // badania: wyłącznie po nazwie (akronim, tytuł angielski, słowa kluczowe, numer rejestracji)
      if (p.split) { var tn = fold([p.short, p.trial.full, p.keys, p.trial.nct].join(' ')); SIDX.push({ i: i, k: 0, multi: false, head: tn, vname: '', text: tn }); return; }
      var base = [p.short, p.title, DICT[p.short], DICT[p.title]].join(' ');
      p.variants.forEach(function (v, k) {
        var vt = p.variants.length > 1 ? [v.vshort, v.title, v.sub, DICT[v.vshort], DICT[v.title], DICT[v.sub]].join(' ') : [v.sub, DICT[v.sub]].join(' ');
        SIDX.push({ i: i, k: k, multi: p.variants.length > 1, head: fold(base), vname: fold(v.vshort + ' ' + (DICT[v.vshort] || '')), text: fold(base + ' ' + vt) });
      });
    });
    return SIDX;
  }
  function searchRun(q) {
    var w = fold(q).split(/\s+/).filter(Boolean), out = [], seen = {};
    if (!w.length) return out;
    searchIndex().forEach(function (e) {
      if (!w.every(function (x) { return e.text.indexOf(x) >= 0; })) return;
      var procHit = w.every(function (x) { return e.head.indexOf(x) >= 0; }) && !(e.multi && w.some(function (x) { return e.vname.indexOf(x) >= 0; }));
      var key = procHit && e.multi ? e.i + ':' : e.i + ':' + e.k;
      if (seen[key]) return; seen[key] = 1;
      var vHit = e.multi && w.some(function (x) { return e.vname.indexOf(x) >= 0; });
      out.push({ i: e.i, k: procHit && e.multi ? 0 : e.k, variant: !procHit && e.multi, score: vHit ? 0 : procHit ? 1 : 2 });
    });
    var named = {}; out.forEach(function (r) { if (r.score === 0) named[r.i] = 1; });
    return out.filter(function (r) { return !(named[r.i] && !r.variant); }).sort(function (a, b) { return a.score - b.score; }).slice(0, 14);
  }
  function searchLabel(r) {
    var p = A.PROCS[r.i], cat = A.CATS.filter(function (c) { return c.id === p.cat; })[0];
    return { main: tr(p.short) + (r.variant ? ' — ' + tr(p.variants[r.k].vshort) : ''), cat: cat ? tr(cat.name) : '' };
  }
  function searchPick(r) { if (r.i !== S.an) switchAn(r.i, 0, r.k); else if (r.k !== (S.vi || 0)) switchVariant(r.k, 'first'); }
  function searchUI(input, box, onPick) {
    var res = [], sel = 0;
    function draw() {
      res = searchRun(input.value); box.innerHTML = ''; sel = Math.min(sel, Math.max(0, res.length - 1));
      box.hidden = !input.value.trim();
      if (!res.length) { var e = document.createElement('div'); e.className = 'qnone'; e.textContent = tr('Brak wyników'); box.appendChild(e); return; }
      res.forEach(function (r, n) {
        var L = searchLabel(r), b = document.createElement('button'); b.className = 'qitem'; b.setAttribute('role', 'option');
        b.setAttribute('aria-selected', n === sel ? 'true' : 'false');
        b.innerHTML = '<b></b><small></small>'; b.querySelector('b').textContent = L.main; b.querySelector('small').textContent = L.cat;
        b.onmousedown = function (ev) { ev.preventDefault(); }; b.onclick = function () { pick(n); };
        box.appendChild(b);
      });
    }
    function pick(n) { var r = res[n]; if (!r) return; input.value = ''; box.hidden = true; input.blur(); searchPick(r); if (onPick) onPick(); }
    input.addEventListener('input', function () { sel = 0; draw(); });
    input.addEventListener('focus', function () { if (input.value.trim()) draw(); });
    input.addEventListener('blur', function () { setTimeout(function () { box.hidden = true; }, 120); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + res.length) % Math.max(1, res.length); draw(); }
      else if (e.key === 'Enter') { e.preventDefault(); pick(sel); }
      else if (e.key === 'Escape') { input.value = ''; box.hidden = true; input.blur(); }
      e.stopPropagation();
    });
  }
  searchUI($('q'), $('qres'));
  searchUI($('mq'), $('mqres'), function () { mMenu(false); });

