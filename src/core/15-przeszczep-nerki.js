/* =====================================================================
   TRANSPLANTOLOGIA — PRZESZCZEPIENIE NERKI: model prawego dołu biodrowego (ANAT.KTX) i zabieg z wariantami zespoleń (TOOL_EXT.ktx, 12-nerka.js).
   Układ jak w ANAT.BODY: x+ lewa strona chorego, y+ dogłowowo, z+ do przodu; 1 j. ≈ 1,45 cm. Naczynia biorcy (aorta, IVC, tętnice i żyły biodrowe
   wspólne, zewnętrzne i wewnętrzne), mięsień lędźwiowy większy i biodrowy, pęcherz moczowy, moczowód własny, naczynia nabrzuszne dolne; nerka dawcy
   z szypułą i moczowodem (układ lokalny: u — oś długa ku biegunowi górnemu, v — ku wnęce (przyśrodkowo), w — ku przodowi). Cięcie Gibsona na skórze
   ANAT.BODY, warstwy powłok wg ANAT.WALL.T (13-przepukliny.js).
   Oś czasu m: 0 dostęp (planowane cięcie), 0–1 cięcie i warstwy, otrzewna odsunięta przyśrodkowo, 1 dół biodrowy, 1–2 nerka dawcy (stół, ułożenie),
   2–3 zespolenie żylne, 3–4 zespolenie tętnicze i reperfuzja, 4–5 moczowód, 5 stan po.
   Źródła: Merrill i wsp., JAMA 1956 (pierwszy udany przeszczep, bliźnięta); Rodríguez Faba i wsp., Eur Urol Focus 2025 (wytyczne EAU 2024);
   Carrel i Guthrie 1906 (łata); Benedetti i wsp., Ann Surg 1995; Barry i Fuchs, Arch Surg 1978 (przedłużenie żyły nerkowej prawej);
   Gregoir 1962; Politano i Leadbetter, J Urol 1958; Alberts i wsp., Transpl Int 2014; Patterson i wsp., Cochrane 2024 (cewnik JJ).
   ===================================================================== */
(function (root) {
  'use strict';
  var A = root.ANAT, V3 = THREE.Vector3;
  // nerka dawcy w dole biodrowym: środek, oś długa (ku biegunowi górnemu), kierunek wnęki (przyśrodkowo, ku naczyniom), półosie [j.]
  // w = u × v (układ prawoskrętny): w prawym dole biodrowym w wskazuje ku tyłowi, stąd ant = −1 (przód = ant · w)
  var KU = new V3(-0.3, 0.95, -0.06).normalize(), KV0 = new V3(0.92, 0.22, -0.32), KV = KV0.clone().addScaledVector(KU, -KV0.dot(KU)).normalize(), KW = new V3().crossVectors(KU, KV).normalize();
  var KANT = KW.z < 0 ? -1 : 1;
  var KTX = {
    // naczynia biorcy: [x, y, z], promień [początek, koniec]
    AO: { pts: [[0.5, -2.6, -0.15], [0.45, -4.1, -0.28], [0.4, -5.5, -0.4]], r: [0.62, 0.6] },
    IVC: { pts: [[-1.05, -2.6, -1.15], [-1.0, -4.4, -1.4], [-0.95, -6.2, -1.9]], r: [0.72, 0.7] },
    CIA: { pts: [[0.4, -5.5, -0.4], [-0.6, -6.4, -0.6], [-1.6, -7.3, -0.8], [-2.5, -8.2, -1.0]], r: [0.4, 0.36] },
    CIAL: { pts: [[0.4, -5.5, -0.4], [1.4, -6.5, -0.6], [2.4, -7.6, -0.95]], r: [0.4, 0.36] },
    EIA: { pts: [[-2.5, -8.2, -1.0], [-2.85, -9.4, -0.4], [-3.35, -10.7, 0.45], [-3.85, -11.9, 1.35], [-4.3, -12.8, 2.2], [-4.6, -13.5, 2.95]], r: [0.32, 0.3] },
    IIA: { pts: [[-2.5, -8.2, -1.0], [-2.45, -9.0, -1.75], [-2.3, -9.9, -2.5], [-2.15, -10.8, -3.1], [-1.95, -11.8, -3.4], [-1.7, -12.8, -3.4]], r: [0.28, 0.18] },
    CIV: { pts: [[-0.95, -6.2, -1.9], [-1.5, -7.2, -1.85], [-2.15, -8.4, -1.85], [-2.55, -9.3, -1.65]], r: [0.5, 0.48] },
    CIVL: { pts: [[-0.95, -6.2, -1.9], [0.4, -6.9, -2.2], [1.8, -7.9, -2.0]], r: [0.48, 0.46] },
    EIV: { pts: [[-2.55, -9.3, -1.65], [-2.75, -10.3, -0.85], [-3.05, -11.3, 0.0], [-3.4, -12.3, 0.95], [-3.75, -13.1, 1.85], [-4.0, -13.7, 2.6]], r: [0.46, 0.44] },
    IIV: { pts: [[-2.55, -9.3, -1.65], [-2.95, -10.1, -2.7], [-3.0, -11.0, -3.7], [-2.8, -12.0, -4.3]], r: [0.4, 0.32] },
    // naczynia nabrzuszne dolne: od tętnicy biodrowej zewnętrznej tuż nad więzadłem pachwinowym ku górze, za mięśniem prostym
    IEA: [[-4.45, -13.1, 2.75], [-4.4, -12.3, 3.35], [-4.35, -11.2, 3.7], [-4.3, -9.5, 3.9], [-4.25, -7.5, 4.05]],
    // moczowód własny: przez rozwidlenie tętnicy biodrowej wspólnej do dna pęcherza
    URN: [[-1.9, -3.6, -0.5], [-2.25, -6.2, -0.55], [-2.45, -8.2, -0.35], [-2.15, -10.3, -1.6], [-1.75, -12.2, -1.3], [-1.25, -13.4, -0.35]],
    // mięsień lędźwiowy większy (oś, promień) i mięsień biodrowy (powierzchnia dołu biodrowego z(x, y))
    PSOAS: { pts: [[-2.9, -3.6, -2.6], [-3.75, -7.3, -1.95], [-4.65, -10.4, -0.75], [-5.25, -12.5, 0.75], [-5.6, -13.8, 1.75]], r: [1.25, 0.85] },
    iliacZ: function (x, y) { var sm = function (u) { u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); }; return -1.0 + 3.6 * sm((-x - 3.8) / 5.0) + 1.7 * sm((-y - 11.6) / 2.2); },
    ILIAC: { x: [-10.6, -3.9], y: [-13.6, -4.6] },
    // kości (orientacja): grzebień biodrowy do kolca przedniego górnego, gałąź górna kości łonowej i spojenie
    CREST: [[-11.4, -7.6, 2.4], [-10.7, -8.2, 2.7], [-9.8, -9.2, 2.95], [-8.75, -10.35, 3.3]],
    PUBIS: [[0.0, -15.15, 3.75], [-1.3, -15.0, 3.45], [-2.7, -14.65, 2.75], [-3.9, -14.3, 1.75], [-4.7, -14.05, 0.9]],
    // pęcherz moczowy (wypełniony): środek, półosie
    BLAD: { c: [-0.25, -12.5, 1.15], r: [2.3, 2.0, 2.0] },
    // nerka dawcy: środek w dole biodrowym, osie (u, v, w), półosie: długość 11 cm, szerokość 6 cm, grubość 3 cm
    KID: { c: [-6.1, -8.5, 2.05], u: KU.toArray(), v: KV.toArray(), w: KW.toArray(), ant: KANT, a: 3.8, b: 2.05, t: 1.05 },
    BENCH: [-3.2, 2.6, 6.0],                                  // przesunięcie nerki na stole (przygotowanie poza raną)
    // cięcie Gibsona na skórze (x, y): od okolicy 2 cm nad spojeniem, równolegle do więzadła pachwinowego (ok. 2,5 cm nad nim), łukiem ku górze
    // przyśrodkowo od kolca biodrowego przedniego górnego; ok. 14 cm
    GIBSON: [[-1.3, -13.9], [-2.6, -13.15], [-4.5, -11.75], [-6.0, -10.4], [-7.0, -8.9], [-7.5, -7.2]],
    // miejsca zespoleń: t na krzywej naczynia biorcy
    AT: { eia: 0.46, eiv: 0.56, iiaCut: 0.36 },
    COL: { art: '#cf3b33', vein: '#3c63b4', kid0: '#c29487', kid1: '#8c3532', ure: '#e3c26a', blad: '#e6b2a6', mus: '#b07a6c', bone: '#ece2c8', per: '#efcfc6' }
  };
  A.KTX = KTX;

  /* ---------- zabieg ---------- */
  var COMMON = 'Schemat: przebieg i średnice naczyń uproszczone, warstwy powłok cieńsze; skala ok. 1 : 1,45 cm.';
  var NOTES = {
    base: ['Przeszczep heterotopowy: nerka w dole biodrowym, pozaotrzewnowo; nerki własne biorcy zwykle pozostają (usuwa się je m.in. przy nawracających zakażeniach, bardzo dużych nerkach torbielowatych, które nie zostawiają miejsca na przeszczep, albo przy ciężkim białkomoczu).',
      'Dół biodrowy prawy wybiera się częściej: żyła biodrowa zewnętrzna leży tu płycej i bardziej poziomo. Lewy — m.in. po wcześniejszym przeszczepie po prawej lub przy jednoczesnym przeszczepie trzustki (trzustka po prawej).',
      'Kolejność: zespolenie żylne, tętnicze, reperfuzja, moczowód. Czas zimnego niedokrwienia (od pobrania do reperfuzji) i ciepłego niedokrwienia w czasie zespoleń powinien być jak najkrótszy.',
      'Tętnice dodatkowe (u ok. 20–30% dawców) wymagają rekonstrukcji na stole albo osobnych zespoleń; tętnica bieguna dolnego zaopatruje moczowód i nie wolno jej podwiązać (Benedetti i wsp. 1995).',
      'Moczowód przeszczepu ukrwiony jest tylko od strony nerki: przy pobraniu zachowuje się tkankę okołomoczowodową, a przy zespoleniu skraca moczowód, by nie był za długi (niedokrwienie końca — przeciek, zwężenie).',
      'Wytyczne EAU (2024): zespolenie moczowodu z pęcherzem techniką zewnątrzpęcherzową typu Lich–Gregoir na cewniku JJ. Rutynowy cewnik JJ zmniejsza ryzyko poważnych powikłań urologicznych (przegląd Cochrane 2024); usuwa się go po kilku tygodniach.'],
    carrel: 'Łata Carrela (Carrel i Guthrie, 1906): owalny fragment ściany aorty wokół ujścia tętnicy nerkowej — szerokie zespolenie, mniejsze ryzyko zwężenia; tylko u dawcy zmarłego (u dawcy żywego aorty się nie nacina).',
    nopatch: 'Dawca żywy: tętnica nerkowa przecięta przy aorcie, bez łaty — krótsza i węższa; zespolenie koniec-do-boku z tętnicą biodrową zewnętrzną, otwór wycięty dziurkaczem naczyniowym. Od dawcy żywego zwykle pobiera się nerkę lewą (dłuższa żyła nerkowa).',
    iia: 'Zespolenie koniec-do-końca z tętnicą biodrową wewnętrzną — technika klasyczna z początków przeszczepiania nerek, dziś rzadziej stosowana; powikłania naczyniowe podobnie częste jak przy zespoleniu z tętnicą biodrową zewnętrzną (Benedetti i wsp. 1995). Bez zaciskania tętnicy biodrowej zewnętrznej i z dobrym dopasowaniem średnic przy tętnicy bez łaty, ale u mężczyzn ryzyko zaburzeń erekcji, zwłaszcza gdy obie tętnice biodrowe wewnętrzne są podwiązane (np. przy kolejnym przeszczepie — Gittes i Waters 1979); przeciwwskazanie — miażdżyca tętnicy biodrowej wewnętrznej.',
    rv: 'Prawa żyła nerkowa jest krótka (ok. 2–2,5 cm). U dawcy zmarłego nerkę prawą pobiera się z odcinkiem żyły głównej dolnej, który na stole zamyka się wzdłuż (szew lub stapler), tworząc przedłużenie żyły (Barry i Fuchs 1978; Corry i Kelley 1978). Inne możliwości: mobilizacja żyły biodrowej zewnętrznej z podwiązaniem żył biodrowych wewnętrznych albo przeszczep do lewego dołu biodrowego.',
    lg: 'Lich–Gregoir (zewnątrzpęcherzowo): bez otwierania pęcherza, krótszy zabieg, krótszy odcinek moczowodu; mięśniówka zszyta nad moczowodem tworzy tunel antyrefluksowy.',
    pl: 'Politano–Leadbetter (1958): technika wewnątrzpęcherzowa z tunelem podśluzówkowym, opracowana do leczenia odpływu pęcherzowo-moczowodowego. W przeszczepach w dużej mierze zastąpiona przez technikę zewnątrzpęcherzową: wg przeglądu systematycznego (Alberts i wsp. 2014) Lich–Gregoir daje mniej przecieków i krwiomoczu, bez różnicy w zwężeniach.'
  };
  // warianty: tętnica (carrel / nopatch / iia), żyła (std / ext), moczowód (lg / pl), nerka dawcy (L / R), dawca (zmarły / żywy)
  var VARS = {
    carrel: { art: 'carrel', vein: 'std', ure: 'lg', side: 'L', dd: true, vshort: 'Łata Carrela → t. biodrowa zewnętrzna' },
    nopatch: { art: 'nopatch', vein: 'std', ure: 'lg', side: 'L', dd: false, vshort: 'Bez łaty → t. biodrowa zewnętrzna' },
    iia: { art: 'iia', vein: 'std', ure: 'lg', side: 'L', dd: false, vshort: 'Koniec-do-końca → t. biodrowa wewnętrzna' },
    rv: { art: 'carrel', vein: 'ext', ure: 'lg', side: 'R', dd: true, vshort: 'Nerka prawa — wydłużenie żyły' },
    pl: { art: 'carrel', vein: 'std', ure: 'pl', side: 'L', dd: true, vshort: 'Politano–Leadbetter' }
  };
  var CAM_ACC = { t: [-3.5, -11.3, 4.0], tp: [-4.0, -10.6, 4.0], az: -15, el: 10, k: 1.0, kp: 0.95 },
    CAM_INC = { t: [-4.6, -11.0, 3.2], tp: [-4.8, -10.8, 3.2], az: -15, el: 22, k: 0.66, kp: 0.8 },
    CAM_FOS = { t: [-4.0, -11.0, 0.6], tp: [-3.4, -10.6, 0.6], az: 20, el: 22, k: 0.95, kp: 0.88 },
    CAM_BEN = { t: [-6.2, -7.6, 3.6], tp: [-6.0, -7.8, 3.6], az: -10, el: 16, k: 1.0, kp: 1.05 },
    CAM_VES = { t: [-3.2, -10.6, 0.6], tp: [-3.2, -10.6, 0.6], az: 25, el: 30, k: 0.55, kp: 0.62 },
    CAM_IIA = { t: [-2.9, -9.5, -0.4], tp: [-2.9, -9.5, -0.4], az: 32, el: 30, k: 0.55, kp: 0.62 },
    CAM_URE = { t: [-2.2, -11.8, 2.0], tp: [-2.2, -11.8, 2.0], az: -5, el: 35, k: 0.48, kp: 0.58 },
    CAM_POST = { t: [-3.8, -9.8, 1.4], tp: [-3.8, -9.8, 1.4], az: 25, el: 25, k: 0.8, kp: 0.88 };
  function ktxVar(key) {
    var o = VARS[key], L = o.side === 'L';
    var kidTxt = L ? (o.dd ? 'Nerka lewa od dawcy zmarłego' : 'Nerka lewa od dawcy żywego') : 'Nerka prawa od dawcy zmarłego';
    var benchCap = {
      carrel: 'Na stole: nerka oczyszczona z tłuszczu, tętnica nerkowa z owalną łatą ściany aorty (łata Carrela), żyła nerkowa, moczowód z zachowaną tkanką okołomoczowodową. Nerka lewa w prawym dole biodrowym leży „odwrócona”: miedniczka i moczowód z przodu, żyła z tyłu — moczowód łatwo dostępny w razie późniejszych zabiegów.',
      nopatch: 'Na stole: tętnica nerkowa bez łaty (u dawcy żywego przecięta przy aorcie), koniec przycięty skośnie — szerszy otwór zespolenia. Żyła nerkowa lewa jest długa. Nerka lewa w prawym dole biodrowym leży „odwrócona”: miedniczka i moczowód z przodu, żyła z tyłu.',
      iia: 'Na stole: tętnica nerkowa bez łaty (dawca żywy) — średnicą zbliżona do tętnicy biodrowej wewnętrznej, do zespolenia koniec-do-końca. Nerka lewa w prawym dole biodrowym leży „odwrócona”: miedniczka i moczowód z przodu, żyła z tyłu.',
      rv: 'Prawa żyła nerkowa jest krótka. Odcinek żyły głównej dolnej dawcy (pobrany z nerką) zamknięty wzdłuż staplerem tworzy przedłużenie żyły nerkowej. Tętnica z łatą Carrela. Nerka prawa w prawym dole biodrowym leży jak u dawcy: żyła z przodu, miedniczka z tyłu.',
      pl: 'Na stole: nerka oczyszczona z tłuszczu, tętnica nerkowa z łatą Carrela, żyła nerkowa, moczowód z zachowaną tkanką okołomoczowodową. Nerka lewa w prawym dole biodrowym leży „odwrócona”: miedniczka i moczowód z przodu, żyła z tyłu.'
    }[key];
    var veinCap = o.vein === 'ext'
      ? 'Żyła biodrowa zewnętrzna zaciśnięta i nacięta wzdłuż; przedłużenie z żyły głównej dolnej dawcy wszyte koniec-do-boku szwem ciągłym niewchłanialnym. Dzięki przedłużeniu zespolenie leży bez napięcia.'
      : 'Żyła biodrowa zewnętrzna zaciśnięta (zacisk boczny albo dwa zaciski) i nacięta wzdłuż; żyła nerkowa wszyta koniec-do-boku szwem ciągłym niewchłanialnym (np. 5-0–6-0).';
    var artT = { carrel: 'Zespolenie tętnicze z łatą Carrela i reperfuzja', nopatch: 'Zespolenie tętnicze bez łaty i reperfuzja', iia: 'Tętnica biodrowa wewnętrzna: koniec-do-końca, reperfuzja' }[o.art];
    var artCaps = {
      carrel: [[3, 'Tętnica biodrowa zewnętrzna zaciśnięta i nacięta podłużnie; łata Carrela wszyta koniec-do-boku szwem ciągłym (np. 6-0).'],
        [3.75, 'Reperfuzja: zaciski zdjęte (najpierw żylny, potem tętniczy) — nerka różowieje i napina się, z moczowodu zaczyna wypływać mocz.']],
      nopatch: [[3, 'Otwór w tętnicy biodrowej zewnętrznej wycięty dziurkaczem naczyniowym; tętnica nerkowa przycięta skośnie, zespolenie koniec-do-boku szwem ciągłym lub pojedynczymi (np. 6-0–7-0).'],
        [3.75, 'Reperfuzja: zaciski zdjęte (najpierw żylny, potem tętniczy) — nerka różowieje i napina się, z moczowodu zaczyna wypływać mocz.']],
      iia: [[3, 'Tętnica biodrowa wewnętrzna podwiązana obwodowo, przed podziałem, i przecięta; bliższy odcinek uwolniony i odwrócony ku nerce. Zespolenie koniec-do-końca z tętnicą nerkową; tętnica biodrowa zewnętrzna nie jest zaciskana.'],
        [3.75, 'Reperfuzja: zaciski zdjęte (najpierw żylny, potem tętniczy) — nerka różowieje i napina się, z moczowodu zaczyna wypływać mocz.']]
    }[o.art];
    var ureT = o.ure === 'lg' ? 'Moczowód: zespolenie z pęcherzem sposobem Lich–Gregoir' : 'Moczowód: ureteroneocystostomia sposobem Politano–Leadbettera';
    var ureCaps = o.ure === 'lg'
      ? [[4, 'Pęcherz wypełniony solą fizjologiczną przez cewnik. Na przednio-bocznej ścianie mięśniówka (wypieracz) nacięta na ok. 2–3 cm aż do błony śluzowej, która się uwypukla.'],
        [4.4, 'Moczowód skrócony i nacięty podłużnie (spatulacja); cewnik JJ wprowadzony jednym końcem do miedniczki, drugim do pęcherza. Śluzówka otwarta na dolnym końcu nacięcia, zespolenie śluzówki z moczowodem szwem wchłanialnym.'],
        [4.75, 'Mięśniówka zszyta nad moczowodem — odcinek moczowodu w tunelu w ścianie pęcherza zapobiega odpływowi wstecznemu.']]
      : [[4, 'Pęcherz wypełniony i otwarty od przodu (cystotomia). Od środka nacięta ściana tylno-boczna — nowe wejście (hiatus) dla moczowodu.'],
        [4.35, 'Moczowód wciągnięty przez hiatus do pęcherza i przeprowadzony tunelem podśluzówkowym (ok. 2–3 cm) ku trójkątowi pęcherza; cewnik JJ do miedniczki i pęcherza.'],
        [4.7, 'Koniec moczowodu wszyty w śluzówkę (nowe ujście); hiatus i cystotomia zamknięte (pęcherz dwuwarstwowo).']];
    var artPost = { carrel: 'tętnica z łatą Carrela koniec-do-boku do tętnicy biodrowej zewnętrznej', nopatch: 'tętnica koniec-do-boku do tętnicy biodrowej zewnętrznej', iia: 'tętnica koniec-do-końca do tętnicy biodrowej wewnętrznej' }[o.art];
    var notes = NOTES.base.slice(0, 2).concat([NOTES[o.art === 'carrel' ? 'carrel' : o.art]], o.vein === 'ext' ? [NOTES.rv] : [], NOTES.base.slice(2), [NOTES[o.ure], COMMON]);
    var sub = { carrel: 'Dawca zmarły: łata Carrela koniec-do-boku do tętnicy biodrowej zewnętrznej, moczowód sposobem Lich–Gregoir',
      nopatch: 'Dawca żywy: tętnica bez łaty koniec-do-boku do tętnicy biodrowej zewnętrznej', iia: 'Tętnica nerkowa koniec-do-końca do tętnicy biodrowej wewnętrznej',
      rv: 'Krótka żyła nerkowa prawa przedłużona odcinkiem żyły głównej dolnej dawcy', pl: 'Moczowód wszczepiony od środka pęcherza, w tunelu podśluzówkowym' }[key];
    return { cat: 'tx', id: 'ktx-' + key, vshort: o.vshort, short: 'Przeszczepienie nerki', title: 'Przeszczepienie nerki — ' + o.vshort, sub: sub,
      notes: notes, objects: [], marks: [], cutTools: [Object.assign({ type: 'ktx', key: key }, o)], anastTools: [], commonCuts: 0, mEnd: 5, single: true,
      box: [[-11, -15, -4], [3, -4, 7]],
      singleFrames: [
        { k: 'normal', kind: 'orbit', m0: 0, m1: 0, cam: 'custom', camP: CAM_ACC, short: 'Dostęp', title: 'Dostęp: cięcie Gibsona w prawym dole biodrowym',
          cap: 'Przeszczep umieszcza się pozaotrzewnowo w dole biodrowym. Cięcie Gibsona (łukowate): od okolicy 2 cm nad spojeniem łonowym, równolegle do więzadła pachwinowego i ok. 2–3 cm nad nim, łukiem ku górze przyśrodkowo od kolca biodrowego przedniego górnego; ok. 12–15 cm. Linia przerywana — planowane cięcie.' },
        { k: 'inc', kind: 'orbit', m0: 0, m1: 1, dur: 9, cam: 'custom', camP: CAM_INC, short: 'Cięcie', title: 'Cięcie Gibsona i dostęp pozaotrzewnowy',
          cap: 'Cięcie skóry i tkanki podskórnej.',
          caps: [[0, 'Cięcie skóry i tkanki podskórnej.'],
            [0.42, 'Rozcięgno i mięsień skośny zewnętrzny, potem mięśnie skośny wewnętrzny i poprzeczny przecięte w linii cięcia; przyśrodkowo nacięty brzeg pochewki mięśnia prostego. Powrózek nasienny zachowany i odsunięty przyśrodkowo (u kobiet więzadło obłe macicy przecina się).'],
            [0.72, 'Naczynia nabrzuszne dolne podwiązane i przecięte (albo zachowane — mogą zaopatrzyć dodatkową tętnicę bieguna dolnego). Powięź poprzeczna nacięta, otrzewna odsunięta tępo przyśrodkowo i ku górze — bez otwierania jamy otrzewnej.']] },
        { k: 'fossa', kind: 'orbit', m0: 1, m1: 1, cam: 'custom', camP: CAM_FOS, short: 'Dół biodrowy', title: 'Dół biodrowy: naczynia biodrowe i pęcherz',
          cap: 'Tętnica biodrowa wspólna dzieli się na zewnętrzną — wzdłuż przyśrodkowego brzegu mięśnia lędźwiowego większego do więzadła pachwinowego — i wewnętrzną, w głąb miednicy; żyła biodrowa zewnętrzna leży przyśrodkowo i ku tyłowi od tętnicy. Przyśrodkowo pęcherz moczowy, przez rozwidlenie przechodzi moczowód własny. Naczynia uwalnia się na odcinku potrzebnym do zespoleń, naczynia chłonne wzdłuż nich podwiązuje (zapobieganie torbieli chłonnej — lymphocele).' },
        { k: 'bench', kind: 'orbit', m0: 1, m1: 2, dur: 6, cam: 'custom', camP: CAM_BEN, short: 'Nerka dawcy', title: kidTxt + ' — przygotowanie',
          cap: benchCap, caps: [[1, benchCap], [1.62, 'Nerka ułożona w dole biodrowym, pozaotrzewnowo: wnęka zwrócona przyśrodkowo i ku dołowi, ku naczyniom biodrowym; biegun górny ku bocznie i ku górze.']] },
        { k: 'vein', kind: 'orbit', m0: 2, m1: 3, dur: 5.5, cam: 'custom', camP: CAM_VES, short: 'Zespolenie żylne', title: o.vein === 'ext' ? 'Zespolenie żylne: przedłużenie do żyły biodrowej zewnętrznej' : 'Zespolenie żylne: żyła nerkowa do żyły biodrowej zewnętrznej',
          cap: veinCap },
        { k: 'art', kind: 'orbit', m0: 3, m1: 4, dur: 6.5, cam: 'custom', camP: o.art === 'iia' ? CAM_IIA : CAM_VES, short: 'Tętnica, reperfuzja', title: artT,
          cap: artCaps[0][1], caps: artCaps },
        { k: 'ure', kind: 'orbit', m0: 4, m1: 5, dur: 7.5, cam: 'custom', camP: CAM_URE, short: 'Moczowód', title: ureT, cap: ureCaps[0][1], caps: ureCaps },
        { k: 'post', kind: 'orbit', m0: 5, m1: 5, cam: 'custom', camP: CAM_POST, short: 'Po przeszczepieniu', title: 'Stan po przeszczepieniu nerki',
          cap: 'Nerka w prawym dole biodrowym, pozaotrzewnowo: ' + (o.vein === 'ext' ? 'żyła nerkowa z przedłużeniem' : 'żyła nerkowa') + ' do żyły biodrowej zewnętrznej, ' + artPost + ', moczowód do pęcherza (' + (o.ure === 'lg' ? 'Lich–Gregoir' : 'Politano–Leadbetter') + ') na cewniku JJ, usuwanym cystoskopowo po kilku tygodniach. Nerki własne zostają. Powłoki zamknięte warstwowo, dren przy przeszczepie.' }
      ] };
  }
  var KTXP = { cat: 'tx', id: 'ktx', short: 'Przeszczepienie nerki', title: 'Przeszczepienie nerki — warianty zespoleń naczyniowych i moczowodu',
    variants: ['carrel', 'nopatch', 'iia', 'rv', 'pl'].map(ktxVar) };
  // kategoria „Transplantologia” po herniologii (przed badaniami); przeszczepienie nerki przed przeszczepieniem wątroby (OLTx, 10-watroba.js)
  var at = A.PROCS.length; A.PROCS.forEach(function (p, i) { if (p.id === 'oltx') at = i; });
  A.PROCS.splice(at, 0, KTXP);
  var ci = A.CATS.length; A.CATS.forEach(function (c, i) { if (c.id === 'trials') ci = i; });
  A.CATS.splice(ci, 0, { id: 'tx', name: 'Transplantologia' });
})(typeof window !== 'undefined' ? window : globalThis);
