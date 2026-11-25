  /* ---------- start (po wszystkich modułach, także widoku podzielonego badań) ---------- */
  applyTheme(); resize();
  var F0 = favIdx(); if (F0.length) S.an = F0[0]; else S.cat = A.PROCS[S.an].cat;
  // pierwszy ekran po wejściu: bez okna „Dostęp?” (np. esofagektomia — pierwszy zabieg), od anatomii prawidłowej; slajd „Dostęp” zostaje kadrem 1
  S.vi = 0; FR = framesFor(curProc(), 0); renderTabs(); renderStrip(); applyFrame(FR[0] && FR[0].k === 'access' && FR.length > 1 ? 1 : 0, true); setLang(LANG);
  requestAnimationFrame(frame);
})();
