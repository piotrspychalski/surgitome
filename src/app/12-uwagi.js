  /* ---------- zgłaszanie uwag: formularz → e-mail do autora (FormSubmit), kontekst: zabieg, wariant, kadr ---------- */
  var FB_URL = 'https://formsubmit.co/ajax/piotr.spychalski@gumed.edu.pl', FB_MAIL = 'piotr.spychalski@gumed.edu.pl';
  function fbContext() {
    var P = curProc(), fr = FR[S.frame] || {}, V = curVar(), multi = P.variants.length > 1 && !P.split;
    var wherePl = P.short + (multi ? ' — ' + V.vshort : '') + (fr.num ? ' · kadr ' + fr.num + ' (' + fr.short + ')' : '');
    var whereUi = tr(P.short) + (multi ? ' — ' + tr(V.vshort) : '') + (fr.num ? ' · ' + tr('Kadr ') + fr.num + ' (' + tr(fr.short) + ')' : '');
    return { wherePl: wherePl, whereUi: whereUi, ids: P.id + (multi ? ' / ' + V.id : '') + (fr.k ? ' / ' + fr.k : ''),
      lang: LANG, device: (MOBILE ? 'telefon' : 'komputer') + ', ' + window.innerWidth + '×' + window.innerHeight, url: location.href, time: new Date().toISOString() };
  }
  function fbStatus(text, cls, link) {
    var st = $('fbStatus'); st.className = 'fbstatus' + (cls ? ' ' + cls : ''); st.textContent = text;
    if (link) { st.appendChild(document.createTextNode(' ')); var a = document.createElement('a'); a.href = link; a.textContent = tr('Wyślij z programu pocztowego'); st.appendChild(a); }
  }
  function fbShow(on) {
    $('fb').hidden = !on;
    if (on) { $('fbCtx').textContent = fbContext().whereUi; fbStatus(''); $('fbSend').disabled = false; setTimeout(function () { $('fbMsg').focus(); }, 0); }
  }
  function fbMailto(msg, c) {
    var body = msg + '\n\n— ' + c.wherePl + '\n' + c.ids + ' · ' + c.lang + ' · ' + c.device + '\n' + c.url;
    return 'mailto:' + FB_MAIL + '?subject=' + encodeURIComponent('SURGITOME — uwaga: ' + c.wherePl) + '&body=' + encodeURIComponent(body);
  }
  $('fbBtn').onclick = function () { fbShow(true); };
  $('fbClose').onclick = $('fbCancel').onclick = function () { fbShow(false); };
  $('fb').addEventListener('click', function (e) { if (e.target === this) fbShow(false); });
  $('fbForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = $('fbMsg').value.trim(), mail = $('fbMail').value.trim(), c = fbContext();
    if (!msg) { fbStatus(tr('Wpisz treść uwagi.'), 'err'); $('fbMsg').focus(); return; }
    if ($('fbHoney').value) { fbStatus(tr('Dziękuję — uwaga wysłana.'), 'ok'); return; } // pułapka na boty
    var data = { _subject: 'SURGITOME — uwaga: ' + c.wherePl, _template: 'table', _captcha: 'false',
      'Uwaga': msg, 'Zabieg / wariant / kadr': c.wherePl, 'Identyfikatory': c.ids, 'Język': c.lang, 'Urządzenie': c.device, 'Adres strony': c.url, 'Czas (UTC)': c.time };
    if (mail) data.email = mail;
    $('fbSend').disabled = true; fbStatus(tr('Wysyłanie…'));
    var fail = function () { $('fbSend').disabled = false; fbStatus(tr('Nie udało się wysłać.'), 'err', fbMailto(msg, c)); };
    try {
      fetch(FB_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (res.ok && res.j && String(res.j.success) === 'true') {
            fbStatus(tr('Dziękuję — uwaga wysłana.'), 'ok'); $('fbMsg').value = '';
            setTimeout(function () { if (!$('fb').hidden) fbShow(false); }, 1800);
          } else fail();
        }, fail);
    } catch (err) { fail(); }
  });
