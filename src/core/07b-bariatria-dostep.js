  /* ---------- Dostęp operacyjny w bariatrii (slajd „Dostęp”, ANAT.ACCESS[sleeve | rygb | oagb | ds | bpd]). Powłoki ANAT.BODY są w układzie zgodnym
     z modelem żołądka (bez przeniesienia xf); wyrostek mieczykowaty y 8,7, pępek y −5,5; 1 jednostka ≈ 1,64 cm.
     Laparoskopia — układ typowy, 5 trokarów w nadbrzuszu: chory na plecach, odwrócony Trendelenburg; optyka 12 mm ok. 15 cm poniżej wyrostka
     mieczykowatego i 3 cm na lewo od linii pośrodkowej, wprowadzona pierwsza trokarem optycznym pod kontrolą wzroku (Clapp i wsp., JSLS 2018;
     SAGES Wiki — Laparoscopic Sleeve Gastrectomy); 5 mm pod wyrostkiem mieczykowatym — retraktor wątroby (Nathansona); 12 mm w lewej i 12 mm w prawej
     linii środkowo-obojczykowej pod łukiem żebrowym (narzędzia operatora, stapler); 5 mm w lewej linii pachowej przedniej (asystent).
     Przełączenie dwunastnicze i BPD — dodatkowy 5 mm w prawej linii pachowej przedniej (dwunastnica, odmierzanie jelita krętego).
     Robot da Vinci Xi (Bindal i wsp., Dig Med Res 2021): wózek od strony głowy lub lewego barku, cztery porty ok. 18–20 cm poniżej wyrostka
     mieczykowatego, co 6–10 cm — kamera nieco na lewo od linii pośrodkowej, 12 mm pod stapler w lewej linii środkowo-obojczykowej, ramię w lewej linii
     pachowej przedniej i ramię w prawej połowie nadbrzusza; port asystenta 12 mm niżej, między kamerą a prawym ramieniem (≥ 8 cm od obu);
     retraktor wątroby 5 mm pod wyrostkiem. Bez robota w BPD sposobem Scopinaro.
     Otwarty (laparotomia pośrodkowa górna) — tylko RYGB, BPD i przełączenie dwunastnicze (dawny standard, dziś konwersja i reoperacje);
     rękaw i OAGB powstały jako techniki laparoskopowe — bez dostępu otwartego. ---------- */
  (function () {
    var LIVER = { at: [0, 7.2], mm: 5, name: '5 mm — retraktor wątroby', sub: 'pod wyrostkiem mieczykowatym' };
    var LAP_PORTS = [
      { at: [1.8, -0.5], mm: 12, name: '12 mm — optyka (kamera)', sub: 'ok. 15 cm poniżej wyrostka mieczykowatego, 3 cm na lewo' },
      LIVER,
      { at: [6.2, 1.6], mm: 12, name: '12 mm — narzędzie, stapler', sub: 'lewa linia środkowo-obojczykowa, pod łukiem żebrowym' },
      { at: [-5.8, 2.2], mm: 12, name: '12 mm — narzędzie', sub: 'prawa linia środkowo-obojczykowa, pod łukiem żebrowym' },
      { at: [9.6, -1.4], mm: 5, name: '5 mm — asystent', sub: 'lewa linia pachowa przednia' }];
    var LAP_R = { at: [-9.6, -1.4], mm: 5, name: '5 mm — narzędzie', sub: 'prawa linia pachowa przednia' };
    var LAP_TXT = 'Chory na plecach, w odwróconym ułożeniu Trendelenburga. Pierwszy — trokar optyczny 12 mm pod kontrolą wzroku, ok. 15 cm poniżej wyrostka mieczykowatego (optyka), potem odma. Retraktor wątroby pod wyrostkiem mieczykowatym, po 12 mm w obu liniach środkowo-obojczykowych (narzędzia, stapler), 5 mm dla asystenta w lewym boku. ';
    function lap(end, extra) {
      return { title: 'Dostęp laparoskopowy', short: extra ? '6 trokarów w nadbrzuszu' : '5 trokarów w nadbrzuszu', side: 0, text: LAP_TXT + end,
        first: 0, insuf: [-0.76, -0.62], ports: extra ? LAP_PORTS.concat([LAP_R]) : LAP_PORTS };
    }
    var ROB_TXT = 'Da Vinci Xi, wózek od strony głowy lub lewego barku chorego. Cztery porty w jednej linii ok. 18–20 cm poniżej wyrostka mieczykowatego, co 6–10 cm: kamera nieco na lewo od linii pośrodkowej (pierwsza, trokar optyczny), 12 mm pod stapler w lewej linii środkowo-obojczykowej, ramiona w lewym boku i w prawej połowie nadbrzusza. Port asystenta 12 mm niżej, retraktor wątroby pod wyrostkiem. ';
    function rob(end) {
      return { title: 'Dostęp robotyczny (da Vinci Xi)', short: 'da Vinci Xi, 4 porty w linii nad pępkiem', side: 0, text: ROB_TXT + end,
        first: 1, insuf: [-0.76, -0.62], robot: true, line: [[-6.4, -2.6], [10.6, -2.6]],
        ports: [{ at: [-4.9, -2.6], mm: 8, name: '8 mm — ramię robota', sub: 'prawa połowa nadbrzusza' },
          { at: [1.2, -2.6], mm: 8, name: '8 mm — optyka (kamera)', sub: 'nieco na lewo od linii pośrodkowej' },
          { at: [6.0, -2.6], mm: 12, name: '12 mm — ramię robota, stapler', sub: 'lewa linia środkowo-obojczykowa' },
          { at: [9.9, -2.6], mm: 8, name: '8 mm — ramię robota', sub: 'lewa linia pachowa przednia' },
          { at: [-1.8, -7.6], mm: 12, name: '12 mm — port asystenta', sub: 'niżej, między kamerą a prawym ramieniem', assist: true },
          Object.assign({ assist: true }, LIVER)] };
    }
    var T_STOM = [2.2, 4.0, 0.2], T_DUO = [1.0, 2.6, 0.4], CAM_B = { t: [-11.5, 0.4, 0.8], tp: [0, 0.4, 0.8], az: 0, el: 12, k: 0.98, kp: 1.2 };
    var SLV_END = 'Rękaw na sondzie kalibracyjnej 36–40 Fr; preparat wydobyty przez poszerzone miejsce trokaru 12 mm.';
    var BYP_END = 'Zespolenia staplerem liniowym; bez preparatu do wydobycia.';
    ACCESS.sleeve = { target: T_STOM, cam: CAM_B, lap: lap(SLV_END), rob: rob(SLV_END) };
    ACCESS.rygb = { target: T_STOM, cam: CAM_B,
      open: openSet({ short: 'laparotomia pośrodkowa górna', text: 'Laparotomia pośrodkowa górna, od wyrostka mieczykowatego do okolicy pępka — klasyczny dostęp do pomostowania żołądkowego; dziś głównie przy konwersji i reoperacjach.',
        cuts: [midCut(8.0, -3.8, 'Laparotomia pośrodkowa górna', 'od wyrostka mieczykowatego do okolicy pępka')] }),
      lap: lap('Zbiornik żołądkowy ok. 30 ml, zespolenie żołądkowo-jelitowe i jelitowo-jelitowe. ' + BYP_END), rob: rob(BYP_END) };
    ACCESS.oagb = { target: T_STOM, cam: CAM_B,
      lap: lap('Długi wąski zbiornik i jedno zespolenie z pętlą jelita czczego ok. 150–200 cm od więzadła Treitza. ' + BYP_END), rob: rob(BYP_END) };
    var DS_OPEN = 'Laparotomia pośrodkowa od wyrostka mieczykowatego do tuż poniżej pępka — dostęp do żołądka, dwunastnicy i jelita krętego. ';
    ACCESS.ds = { target: T_DUO, cam: CAM_B,
      open: openSet({ short: 'laparotomia pośrodkowa górna', text: DS_OPEN + 'Klasyczny dostęp w przełączeniu dwunastniczym; dziś zwykle laparoskopia.',
        cuts: [midCut(8.0, -7.2, 'Laparotomia pośrodkowa', 'od wyrostka mieczykowatego do tuż poniżej pępka')] }),
      lap: lap('Szósty trokar, 5 mm w prawym boku — przecięcie dwunastnicy za odźwiernikiem, odmierzanie jelita krętego. Preparat przez poszerzone miejsce trokaru 12 mm.', true),
      rob: rob('Rękaw, przecięcie dwunastnicy i zespolenie dwunastniczo-krętnicze z tych samych portów; preparat przez poszerzone miejsce portu 12 mm.') };
    ACCESS.bpd = { target: T_DUO, cam: CAM_B,
      open: openSet({ short: 'laparotomia pośrodkowa górna', text: DS_OPEN + 'Klasyczny dostęp w operacji Scopinaro; dziś zwykle laparoskopia.',
        cuts: [midCut(8.0, -7.2, 'Laparotomia pośrodkowa', 'od wyrostka mieczykowatego do tuż poniżej pępka')] }),
      lap: lap('Szósty trokar, 5 mm w prawym boku — dwunastnica, odmierzanie jelita krętego. Preparat (dystalna część żołądka) przez poszerzone miejsce trokaru 12 mm.', true) };
  })();
