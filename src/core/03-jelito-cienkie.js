  /* =====================================================================
     JELITO CIENKIE — resekcja odcinka w anatomii całej jamy brzusznej
     ===================================================================== */
  var SB2 = [[3.1, -4.0, -1.6], [5.4, -5.2, -0.6], [6.4, -7.0, 0.4], [4.2, -7.8, 1.2], [1.4, -7.4, 1.4], [-1.6, -7.8, 1.2], [-4.4, -8.6, 1.0], [-5.2, -10.4, 0.8],
    [-2.4, -11.2, 1.4], [0.6, -11.0, 1.6], [3.6, -11.2, 1.4], [6.2, -11.8, 0.8], [6.6, -14.2, 0.6], [3.6, -14.8, 1.2], [0.6, -14.6, 1.6], [-2.6, -14.8, 1.4], [-5.2, -15.6, 0.8],
    [-4.8, -17.8, 0.8], [-1.4, -18.2, 1.4], [1.8, -18.0, 1.6], [4.8, -18.6, 1.2], [4.2, -21.0, 1.0], [1.0, -21.6, 1.4], [-2.0, -21.2, 1.2], [-4.6, -20.6, 0.8], [-6.8, -20.4, 0.6]];
  var C_SB2 = curveOf(SB2);
  var COLON_SB = [[-8.4, -22.8, 0.6], [-8.6, -20.4, 0.4], [-8.8, -15, 0.3], [-8.7, -9, 0.2], [-8.6, -4.8, 0.3], [-8.3, -2.6, 0.9], [-5.9, -3.0, 3.3], [-2.4, -5.0, 3.2], [0.6, -5.6, 3.4],
    [3.6, -4.8, 3.0], [6.2, -2.6, 1.4], [7.8, -1.0, -0.4], [9.1, -3.5, -0.8], [9.2, -9, -0.8], [9.2, -15, -0.6], [8.8, -19.4, -0.2], [6.6, -23.6, 1.2], [3.0, -24.4, 2.4],
    [0.4, -25.6, 2.0], [0.2, -27.6, -0.6], [0, -29.6, -1.3]];
  var C_CSB = curveOf(COLON_SB);
  function cst(p) { return nearestT(C_CSB, p, 1500); }
  var CSB_R = profile([[0, 0.05], [0.012, 1.7], [0.05, 1.9], [cst([-8.7, -9, 0.2]), 1.7], [cst([-8.3, -2.6, 0.9]), 1.5], [cst([0.6, -5.6, 3.4]), 1.35], [cst([7.8, -1.0, -0.4]), 1.25],
    [cst([9.2, -9, -0.8]), 1.15], [cst([8.8, -19.4, -0.2]), 1.05], [cst([3.0, -24.4, 2.4]), 1.0], [cst([0.2, -27.6, -0.6]), 1.3], [1, 1.5]]);
  var APP_SB = [[-8.2, -22.3, 0.6], [-8.0, -23.9, 0.7], [-7.4, -25.2, 0.9], [-6.6, -26.1, 1.2]];
  var ra = nearestT(C_SB2, [-2.0, -11.2, 1.45]), rb = nearestT(C_SB2, [3.2, -11.2, 1.45]);
  var rap = nearestT(C_SB2, [-5.2, -10.4, 0.8]), rbp = nearestT(C_SB2, [6.2, -11.8, 0.8]);
  var SBP_PRE = sub(C_SB2, flat(1.0), 0, ra, 60), SBS_PRE = sub(C_SB2, flat(1.0), ra, rb, 16), SBD_PRE = sub(C_SB2, flat(1.0), rb, 1, 70);
  var SBP_HEAD = sub(C_SB2, flat(1.0), 0, rap, 50).path, SBD_TAIL = sub(C_SB2, flat(1.0), rbp, 1, 60).path;
  var SB_COL2 = '#d9929f', SUT2 = '#7457c9', STAPLE2 = '#8f99a3';
  var LOC = {
    e2e: { tail: [[-3.6, -11.0, 1.3], [-1.8, -11.0, 1.5], [0.6, -11.0, 1.6]], head: [[0.6, -11.0, 1.6], [2.6, -11.0, 1.5], [4.8, -11.4, 1.2]] },
    iso: { tail: [[-3.8, -10.8, 1.3], [-1.8, -10.35, 1.6], [0.4, -10.35, 1.6], [2.6, -10.35, 1.6]], head: [[-1.8, -11.65, 1.6], [0.4, -11.65, 1.6], [2.4, -11.65, 1.6], [4.4, -11.8, 1.2]] },
    anti: { tail: [[-3.8, -10.8, 1.3], [-1.8, -10.35, 1.6], [0.4, -10.35, 1.6], [2.6, -10.35, 1.6]],
      head: [[2.6, -11.65, 1.6], [0.4, -11.65, 1.6], [-1.8, -11.65, 1.6], [-3.4, -12.2, 2.3], [-2.0, -12.6, 3.6], [1.0, -12.6, 3.9], [3.8, -12.3, 3.4], [5.4, -12.0, 2.0]] }
  };
  function sbAnat(kind) {
    var loc = LOC[kind], pPath = SBP_HEAD.concat(loc.tail), dPath = loc.head.concat(SBD_TAIL);
    var P = kind === 'e2e' ? { path: pPath, r: flat(1.0) } : { path: pPath, r: STUMP_END };
    var D = kind === 'e2e' ? { path: dPath, r: flat(1.0) } : { path: dPath, r: STUMP_START(lenOf(dPath)) };
    var t = {
      e2e: { id: 'sb-e2e', title: 'Resekcja jelita cienkiego: zespolenie koniec-do-końca', sub: 'Szew ręczny ciągły na całym obwodzie',
        notes: ['Oba końce zespolone bezpośrednio — ciągłość i kierunek perystaltyki zachowane.', 'Przy różnicy średnic końców pomaga nacięcie brzegu przeciwkrezkowego węższego końca (Cheatle).', 'W endoskopii: okrężna linia szwu, bez ślepych kikutów.'],
        recon: ['Zespolenie koniec-do-końca', 'Końce zbliżone do siebie bez napięcia; szew na całym obwodzie.'],
        post: 'Jedna linia szwu na obwodzie; brak ślepych końców.', endo: 'Przez linię szwu na wprost — światło ciągłe.' },
      iso: { id: 'sb-iso', title: 'Resekcja jelita cienkiego: zespolenie bok-do-boku izoperystaltyczne', sub: 'Stapler liniowy, ramiona ułożone zgodnie z kierunkiem perystaltyki',
        notes: ['Ramiona ułożone równolegle, zachodzą na siebie; kikuty po przeciwnych stronach zespolenia.', 'Kierunek perystaltyki w obu ramionach ten sam — treść przechodzi bez zawracania.', 'Otwór po wprowadzeniu staplera zamknięty szwem.'],
        recon: ['Zespolenie bok-do-boku izoperystaltyczne', 'Ramiona ułożone równolegle i zgodnie z perystaltyką, kikuty po przeciwnych stronach.'],
        post: 'Dwa ślepe kikuty po przeciwnych stronach zespolenia; treść płynie w jednym kierunku.', endo: 'Z ramienia doprowadzającego bokiem do odprowadzającego — bez zawracania aparatu.' },
      anti: { id: 'sb-anti', title: 'Resekcja jelita cienkiego: zespolenie bok-do-boku antyperystaltyczne', sub: 'FEEA (functional end-to-end anastomosis) — stapler liniowy i zamknięcie poprzeczne',
        notes: ['Końce ułożone obok siebie w tę samą stronę („dwulufowo”), stapler liniowy wprowadzony w oba światła.', 'Wspólny otwór końców zamknięty poprzecznie staplerem liniowym (TA).', 'Treść w zespoleniu zawraca o 180° — funkcjonalnie koniec-do-końca.'],
        recon: ['Zespolenie antyperystaltyczne (FEEA)', 'Końce ułożone równolegle w tę samą stronę; odcinek dystalny zawraca pętlą przed zespoleniem.'],
        post: 'Oba kikuty po tej samej stronie, zamknięte poprzeczną linią zszywek; ramiona biegną przeciwnie.', endo: 'We wspólnym świetle zawrócenie o 180° z ramienia doprowadzającego do odprowadzającego.' }
    }[kind];
    var marks = [
      ringOn(C_SB2, flat(1.0), ra, { name: 'Linia przecięcia', color: COL.cut, opacity: CUT_OP_JEJ }),
      ringOn(C_SB2, flat(1.0), rb, { name: 'Linia przecięcia', color: COL.cut, opacity: CUT_OP_JEJ })
    ];
    if (kind === 'e2e') marks.push(ringAt(dPath, flat(1.0), [0.6, -11.0, 1.6], { name: 'Szew ręczny koniec-do-końca', color: SUT2, opacity: ANAST_OP, endo: true, dash: 0.3 }));
    else {
      marks.push({ kind: 'line', name: 'Linia zszywek (stapler liniowy)', color: STAPLE2, opacity: ANAST_OP, pts: [[-1.8, -11.0, 2.45], [0, -11.0, 2.5], [1.8, -11.0, 2.45]] });
      if (kind === 'iso') marks.push({ kind: 'line', name: 'Zamknięcie otworu po staplerze', color: SUT2, opacity: ANAST_OP, pts: [[2.3, -9.7, 2.3], [2.3, -11.0, 2.8], [2.3, -12.3, 2.3]] });
      else marks.push({ kind: 'line', name: 'Zamknięcie poprzeczne końców (TA)', color: STAPLE2, opacity: ANAST_OP, pts: [[2.75, -9.5, 2.1], [2.8, -11.0, 2.7], [2.75, -12.5, 2.1]] });
    }
    var from = [-4.4, -8.6, 1.0];
    var route = kind === 'e2e' ? [{ obj: 'p', from: from, note: 'Jelito czcze — odcinek proksymalny' }, { obj: 'd', to: [6.2, -11.8, 0.8], note: 'Za linią szwu — odcinek dystalny' }]
      : kind === 'iso' ? [{ obj: 'p', from: from, to: [0.2, -10.35, 1.6], note: 'Odcinek proksymalny — wejście we wspólne światło' }, { obj: 'd', from: [0.6, -11.65, 1.6], to: [6.2, -11.8, 0.8], note: 'Bokiem do odcinka dystalnego, ten sam kierunek' }]
        : [{ obj: 'p', from: from, to: [0.6, -10.35, 1.6], note: 'Odcinek proksymalny — wejście we wspólne światło' }, { obj: 'd', from: [0.6, -11.65, 1.6], to: [5.4, -12.0, 2.0], note: 'Zawrócenie o 180° do odcinka dystalnego' }];
    return {
      cat: 'sb', id: t.id, short: t.title, title: t.title, sub: t.sub, notes: t.notes, focus: { t: [0.6, -11.2, 1.8], k: 0.4 },
      ctOverride: { stom: 'contrast', duo: 'contrast' },
      endoTitles: ['Widok endoskopowy: jelito prawidłowe', 'Widok endoskopowy po zespoleniu'],
      text: { normal: ['Anatomia prawidłowa', 'Jelito cienkie od więzadła Treitza do zastawki krętniczo-kątniczej: jelito czcze w lewym górnym kwadrancie, kręte w prawym dolnym i w miednicy; wokół rama jelita grubego.'],
        top: 'Z góry widać ułożenie ramion zespolenia względem pętli jelita.' },
      frames: {
        resect: ['Zakres resekcji', 'Odcinek jelita cienkiego z klinem krezki; przecięcie po obu stronach staplerem liniowym, podwiązanie naczyń krezkowych.', 'Zakres resekcji'],
        remove: ['Usunięcie odcinka', 'Odcinek usunięty; pozostają koniec proksymalny i dystalny.', 'Usunięcie'],
        recon: [t.recon[0], t.recon[1], 'Zespolenie'], post: t.post, endoPost: t.endo
      },
      objects: [
        eso(),
        stomObj(),
        duoObj(),
        { id: 'colon', name: 'Jelito grube', pre: { path: COLON_SB, r: CSB_R }, color: '#c98f6b', mucosa: 'haustra', tint: '#eab9a3',
          labels: [L('Kątnica', 0.02, ALL), L('Okrężnica poprzeczna', cst([0.6, -5.6, 3.4]), ALL), L('Okrężnica zstępująca', cst([9.2, -9, -0.8]), ALL), L('Esica', cst([3.0, -24.4, 2.4]), ALL)] },
        { id: 'app', name: 'Wyrostek robaczkowy', pre: { path: APP_SB, r: APP_R }, color: '#c77f8e', mucosa: 'smooth', tint: '#eab9a3' },
        { id: 'p', name: 'Jelito czcze', postName: 'Odcinek proksymalny', pre: SBP_PRE, post: P, morph: [2, 2.9], color: SB_COL2, mucosa: 'circular', tint: MUC.bowel,
          labels: [L('Jelito czcze', 0.3, PRE), L('Odcinek proksymalny', 0.85, POST)] },
        { id: 's', name: 'Odcinek resekowany', pre: SBS_PRE, colors: [[0, SB_COL2], [0.7, COL.spec]], opacity: SPEC_OP, offset: [[1.15, [0, 0, 0]], [1.9, [0, -2, 9]]], mucosa: 'circular', tint: MUC.bowel,
          labels: [L('Odcinek do resekcji', 0.5, [-9, 1.5])] },
        { id: 'd', name: 'Jelito kręte', postName: 'Odcinek dystalny', pre: SBD_PRE, post: D, morph: [2, 2.9], color: SB_COL2, mucosa: 'circular', tint: MUC.bowel,
          labels: [L('Jelito kręte', 0.75, ALL), L('Odcinek dystalny', 0.08, POST)] }
      ],
      marks: marks,
      routePost: route
    };
  }

