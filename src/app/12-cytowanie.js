  /* ---------- jak cytować: okienko z gotowym cytowaniem, link „Jak cytować” w stopce panelu i w menu na telefonie ----------
     CITE_DOI — DOI koncepcyjny z Zenodo (prowadzi do najnowszej wersji); pusty = cytowanie z adresem strony */
  var CITE_DOI = '10.5281/zenodo.23185125', CITE_URL = 'https://piotrspychalski.github.io/surgitome/';
  function citeParts() {
    return { head: 'Spychalski P. SURGITOME: interactive 3D atlas of postoperative gastrointestinal anatomy [software]. ' + (CITE_DOI ? 'Zenodo; 2026. ' : '2026. '),
      link: CITE_DOI ? 'https://doi.org/' + CITE_DOI : CITE_URL, linkText: CITE_DOI ? 'doi:' + CITE_DOI : CITE_URL };
  }
  function citeText() { var c = citeParts(); return c.head + c.linkText; }
  function citeShow(on) {
    $('cite').hidden = !on;
    if (!on) return;
    var c = citeParts(), el = $('citeRef'), a = document.createElement('a');
    el.textContent = c.head; a.href = c.link; a.target = '_blank'; a.rel = 'noopener'; a.textContent = c.linkText; el.appendChild(a);
    $('citeStatus').className = 'fbstatus'; $('citeStatus').textContent = '';
    setTimeout(function () { $('citeCopy').focus(); }, 0);
  }
  function citeCopy() {
    var t = citeText(), done = function (ok) {
      var st = $('citeStatus'); st.className = 'fbstatus ' + (ok ? 'ok' : 'err');
      st.textContent = tr(ok ? 'Skopiowano.' : 'Nie udało się skopiować. Zaznacz tekst i skopiuj ręcznie.');
    };
    try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(t).then(function () { done(true); }, function () { done(false); }); return; } } catch (e) {}
    // bez Clipboard API (np. strona otwarta z pliku): zaznaczenie tekstu i execCommand
    var ok = false;
    try { var r = document.createRange(), sel = window.getSelection(); r.selectNodeContents($('citeRef')); sel.removeAllRanges(); sel.addRange(r); ok = document.execCommand('copy'); } catch (e) {}
    done(ok);
  }
  [].forEach.call(document.querySelectorAll('.citeBtn'), function (b) { b.onclick = function () { if (!$('mMenu').hidden) mMenu(false); citeShow(true); }; });
  $('citeClose').onclick = $('citeOk').onclick = function () { citeShow(false); };
  $('cite').addEventListener('click', function (e) { if (e.target === this) citeShow(false); });
  $('citeCopy').onclick = citeCopy;
