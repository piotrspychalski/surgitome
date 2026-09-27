  /* ---------- start (po wszystkich modułach, także widoku podzielonego badań) ---------- */
  applyTheme(); resize();
  var F0 = favIdx(); if (F0.length) S.an = F0[0]; else S.cat = A.PROCS[S.an].cat;
  S.vi = 0; FR = framesFor(curProc(), 0); renderTabs(); renderStrip(); applyFrame(0, true); setLang(LANG);
  requestAnimationFrame(frame);
})();
