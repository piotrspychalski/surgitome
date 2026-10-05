  /* ---------- piśmiennictwo: źródła bieżącego zabiegu (panel „Opis” → „Piśmiennictwo”) i okno „Źródła” w stopce panelu („Jak cytować”: 12-cytowanie.js)
     dane: ANAT.BIB (src/core/12-bibliografia.js) — R: klucz → opis Vancouver z PMID/DOI/URL, P: id zabiegu lub wariantu → [[klucz, rola, twierdzenie]] ---------- */
  Object.assign(DICT, {
    'Piśmiennictwo': 'References', 'Źródła': 'Sources', 'Kod:': 'Code:', 'Treści:': 'Content:',
    'SURGITOME stworzyłem z pomocą asystenta AI (Claude, Anthropic), który wspierał programowanie modeli i redakcję opisów. Koncepcja, dobór zabiegów i treść medyczna są moje. Wszystkie modele, opisy i dane anatomiczne osobiście sprawdziłem i odpowiadam za ich poprawność. Narzędzie edukacyjne, schematyczne, nie jest wyrobem medycznym.':
      'SURGITOME was built with the help of an AI assistant (Claude, Anthropic) for programming the models and drafting the descriptions. The concept, choice of procedures and medical content are my own; I have personally reviewed all models, descriptions and anatomical data and take full responsibility for them. Schematic educational tool, not a medical device.',
    'Piśmiennictwo do każdego zabiegu: opisy oryginalne, aktualne wytyczne oraz źródła szczegółów pokazanych w modelach. Opisy wg stylu Vancouver, z odnośnikami do PubMed i DOI.':
      'References for each procedure: original descriptions, current guidelines and the sources of details shown in the models. Vancouver style, with links to PubMed and DOI.',
    'Opis oryginalny': 'Original description', 'Wytyczne / konsensus': 'Guideline / consensus', 'Anatomia': 'Anatomy', 'Technika': 'Technique',
    'Endoskopia': 'Endoscopy', 'Wyniki badań': 'Outcomes', 'Rejestr badania': 'Trial registry', 'Narzędzia': 'Instruments', 'online': 'online'
  });
  var BIB = A.BIB || { R: {}, P: {}, EXTRA: [] };
  var ROLES = ['original', 'guideline', 'anatomy', 'technique', 'endoscopy', 'outcomes', 'registry'];
  var ROLE_PL = { original: 'Opis oryginalny', guideline: 'Wytyczne / konsensus', anatomy: 'Anatomia', technique: 'Technika', endoscopy: 'Endoskopia', outcomes: 'Wyniki badań', registry: 'Rejestr badania' };

  // pozycje zabiegu i bieżącego wariantu, bez powtórzeń; kolejność: rola, potem rok
  function refsFor(ids) {
    var seen = {}, out = [];
    ids.forEach(function (id) { (BIB.P[id] || []).forEach(function (x) { if (!seen[x[0]] && BIB.R[x[0]]) { seen[x[0]] = 1; out.push(x); } }); });
    return out.sort(function (a, b) { return (ROLES.indexOf(a[1]) - ROLES.indexOf(b[1])) || (BIB.R[a[0]].y - BIB.R[b[0]].y); });
  }
  function procRefIds(P, V) { return V && V.id !== P.id ? [P.id, V.id] : [P.id]; }
  function refLink(li, href, text) {
    var a = document.createElement('a'); a.href = href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = text;
    li.appendChild(document.createTextNode(' ')); li.appendChild(a);
  }
  function refItem(x) {
    var r = BIB.R[x[0]], li = document.createElement('li');
    if (x[1] && ROLE_PL[x[1]]) { var s = document.createElement('span'); s.className = 'rrole'; s.textContent = tr(ROLE_PL[x[1]]); li.appendChild(s); }
    li.appendChild(document.createTextNode(r.c));
    if (r.pmid) refLink(li, 'https://pubmed.ncbi.nlm.nih.gov/' + r.pmid + '/', 'PubMed');
    if (r.doi) refLink(li, 'https://doi.org/' + r.doi, 'DOI');
    if (r.url && !r.pmid && !r.doi) refLink(li, r.url, tr('online'));
    if (r.book) li.className = 'rbook'; // książka bez wersji online
    return li;
  }
  function renderRefs() {
    var P = curProc(), list = refsFor(procRefIds(P, curVar())), ol = $('pRefsList');
    ol.innerHTML = ''; list.forEach(function (x) { ol.appendChild(refItem(x)); });
    $('pRefs').hidden = !list.length; $('pRefsN').textContent = list.length ? '(' + list.length + ')' : '';
  }

  // pełna lista: kategorie → zabiegi (warianty z własnymi pozycjami osobno); pozycje ogólne (np. narzędzia) na końcu
  function renderBibList() {
    var box = $('bibList'); box.innerHTML = '';
    var catName = {}; A.CATS.forEach(function (c) { catName[c.id] = c.name; });
    var lastCat = null;
    A.PROCS.forEach(function (P) {
      if (P.split && P.published === false) return;
      var ids = [P.id]; P.variants.forEach(function (v) { if (v.id !== P.id && BIB.P[v.id]) ids.push(v.id); });
      var list = refsFor(ids); if (!list.length) return;
      if (P.cat !== lastCat) { lastCat = P.cat; var h3 = document.createElement('h3'); h3.textContent = tr(catName[P.cat] || P.cat); box.appendChild(h3); }
      var h4 = document.createElement('h4'); h4.id = 'bib-' + P.id; h4.textContent = tr(P.title || P.short); box.appendChild(h4);
      var ol = document.createElement('ol'); ol.className = 'reflist'; list.forEach(function (x) { ol.appendChild(refItem(x)); }); box.appendChild(ol);
    });
    (BIB.EXTRA || []).forEach(function (g) {
      var list = refsFor([g.id]); if (!list.length) return;
      var h3 = document.createElement('h3'); h3.textContent = tr(g.name); box.appendChild(h3);
      var ol = document.createElement('ol'); ol.className = 'reflist'; list.forEach(function (x) { ol.appendChild(refItem(x)); }); box.appendChild(ol);
    });
  }
  var bibFrom = null;
  function bibShow(on) {
    $('bib').hidden = !on;
    if (!on) { if (bibFrom) bibFrom.focus(); bibFrom = null; return; }
    bibFrom = document.activeElement;
    renderBibList();
    var bx = $('bibBox'), tgt = $('bib-' + curProc().id);
    bx.scrollTop = 0; if (tgt) bx.scrollTop = tgt.getBoundingClientRect().top - bx.getBoundingClientRect().top - bx.querySelector('.introhead').offsetHeight - 10; // pod przyklejonym nagłówkiem okna
    setTimeout(function () { $('bibClose').focus({ preventScroll: true }); }, 0);
  }
  $('btnSources').onclick = function () { bibShow(true); };
  $('bibClose').onclick = function () { bibShow(false); };
  $('bib').addEventListener('click', function (e) { if (e.target === this) bibShow(false); });
