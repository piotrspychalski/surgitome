# SURGITOME — kod źródłowy

Interaktywna anatomia pooperacyjna 3D: widok z zewnątrz, animacja zabiegu, endoskopia wirtualna, schematyczne TK.
Autor: Spychalski P MD PhD | piotr.spychalski@gumed.edu.pl · wersja online: https://bit.ly/surgitome

## Budowa
Wynikiem jest **jeden samodzielny plik HTML** (three.js 0.147 z CDN).

    node build.js        → dist/surgitome.html (+ dist/core.js, dist/app.js)

Skrypt skleja pliki z `src/core/` i `src/app/` w kolejności nazw i wstawia je w `src/shell.html`
(`/*CORE*/`, `/*APP*/`). Nie ma bundlera ani transpilacji; kod to jeden wspólny zakres (IIFE), a podział na pliki służy czytelności.

## Moduły
**src/core — dane anatomiczne (globalny obiekt `ANAT`)**
- `01-podstawy-zoladek.js` — geometria rur, łączenie świateł (unionCut), górny odcinek, gastrektomia, RYGB, OAGB, rękaw
- `02-resekcje-dystalne.js` — Billroth I/II, Braun, Roux-en-Y
- `03-jelito-cienkie.js` — resekcja jelita cienkiego i warianty zespolenia
- `04-jelito-grube.js` — hemikolektomie (prawa: izo, FEEA, poszerzona z 2/3 poprzecznicy; `mesoRight` — krezka z naczyniami SMA/SMV, IC, RC, MC z gałęziami i węzłami: podwiązania zależnie od techniki), wspólny moduł EEA (`eeaJoin`, `colonEEA`), hemikolektomia lewa (EEA, izo, FEEA), resekcja odbytnicy, kolektomia z IRA, zbiornik J (IPAA), Hartmann, ileostomie; `mesoLeft` — krezka lewej połowy okrężnicy i mezorektum z IMA, LC, SB, SRA i węzłami w hemikolektomii lewej (LC i SB u odejścia), resekcji odbytnicy (IMA u odejścia, TME) i operacji Hartmanna (IMA poniżej LC, mezorektum zostaje); krezka odcinka sprowadzanego do miednicy lub stomii (`mob`) zanika przy przemieszczeniu jelita
- `05-trzustka-drogi-zolciowe.js` — Whipple, PPPD, hepatikojejunostomia, pankreatektomia dystalna, Puestow i Frey, choledochoduodenostomia
- `06-przelyk.js` — esofagektomie (Ivor Lewis i McKeown także z zespoleniem bok-do-boku i ślepym kikutem przełyku; rura żołądkowa z krzywizny większej), kontekst klatki piersiowej (w tym żyła nieparzysta)
- `07-gastroenterostomia-bpd-ds.js` — gastroenterostomia omijająca, BPD (Scopinaro), SADI-S, BPD-DS
- `08-narzedzia-os-czasu-lista.js` — staplery i szwy na osi czasu, łuki ruchu (LIFT), przygotowanie danych, lista zabiegów; `ANAT._lib` — klocki dla modułu badań
- `09-badania.js` — badania ECOPOP (`ANAT.TRIALS`): ETHOS, SCAR (flaga `published: false` ukrywa badanie; wtedy widoczne tylko przy `window.__SG_PREVIEW`); zmiana T1, tatuaże, blizna, klips OTSC, krezka z naczyniami i węzłami, narzędzie EFTR
- `10-watroba.js` — wątroba (`ANAT.LIVER`, kategoria `liver`): bryła z funkcji odległości (elipsoidy, powierzchnia trzewna, rowek IVC, dół pęcherzyka), segmenty Couinauda z płaszczyzn (Cantlie/MHV, RHV, szczelina pępkowa, LHV, płaszczyzna wrotna, płat ogoniasty), siatki metodą surface nets (liczone raz, leniwie, ok. 0,4 s); drzewo żyły wrotnej z gałęziami segmentowymi, tętnice i przewody wewnątrzwątrobowe jako szypuły Glissona (kopia drzewa PV z przesunięciem), pnie we wnęce, żyły wątrobowe i IVC; przynależność punktów naczyń do segmentów (`seg`) steruje rozsuwaniem
- `11-watroba-resekcje.js` — resekcje wątroby (`ANAT.LIVER.RES`: segmenty usuwane, przecięcia naczyń `cuts` z czasem i rodzajem — podwiązanie / stapler, odcinki usuwane w całości `gone`, kierunek odsunięcia preparatu; ALPPS z przerostem `hyper`) i reguła zakresu resekcji anatomicznej `ANAT.LIVER.resFor` (segmentektomia, bisegmentektomia, sekcjonektomie, hepatektomia centralna, hemihepatektomie, trisekcjonektomie; IVa + IVb = IV, segment I dopisywany)
- `12-bibliografia.js` — piśmiennictwo (`ANAT.BIB`): `R` — klucz → opis w stylu Vancouver (`c`), rok `y`, `pmid`/`doi`/`url`; `P` — id zabiegu lub wariantu → `[klucz, rola, uzasadnienie]` (role: original, guideline, anatomy, technique, endoscopy, outcomes, registry); `EXTRA` — pozycje tylko w pełnej liście. Teksty bibliograficzne nie są tłumaczone (`tests/i18n.js` pomija `ANAT.BIB`)

**src/app — aplikacja**
- `01` słownik PL→EN i pomocnicze · `02` motyw i renderer · `03` TK · `04` tekstury, stan, obiekty
- `05` narzędzia · `06` anatomia, kadry, oś czasu · `07` kamera i endoskop · `08` nawigacja i UI
- `09` wyszukiwarka zabiegów (badania — tylko po nazwie) · `10` tryb telefonu · `11` rozmiar, etykiety (z rozsuwaniem), pętla renderowania
- `12` badania: widok podzielony — dwa ramiona w jednej scenie, przy każdym przebiegu podmiana modelu `M`, kamery, obszaru widoku i warstwy etykiet (`withArm`); wspólny postęp kadru p ∈ [0, 1], ramię liczy m = p × mEnd; synchronizacja kamer; słownik `DICT_TRIALS`
- `12-guz` przesuwalny guz (hemikolektomie prawe, testowo): przeciąganie w kadrze „Prawidłowa”, położenie w localStorage (`surgitome-guz-pos`) we współrzędnych anatomii prawidłowej, przypinane do najbliższego odcinka · `12-uwagi` formularz uwag → e-mail do autora przez Web3Forms (klucz publiczny z założenia; zapasowo mailto), z kontekstem: zabieg, wariant, kadr, język, urządzenie · `12-cytowanie` okienko „Jak cytować” (link w stopce panelu i w menu na telefonie): gotowe cytowanie, kopiowanie do schowka; `CITE_DOI` — DOI koncepcyjny z Zenodo (pusty = cytowanie z adresem strony)
- `12-samouczek` samouczek po informacji startowej (raz na urządzenie, klucz `surgitome-tour`; stali użytkownicy dostają go przy najbliższym wejściu): 6 kroków — język, wyszukiwarka, nawigacja, etykiety, informacje, animacje; przyciemnienie na canvas z wycięciami (`destination-out`) na podświetlane elementy, osobne cele na komputerze i telefonie (na telefonie krok wyszukiwarki otwiera menu ☰); język i etykiety można kliknąć w trakcie; klawisze → / ← / Esc; powtórka przyciskiem „Pokaż samouczek” w opisie i „Samouczek” w menu telefonu
- `12-zakres` slajd „Wybór zakresu resekcji” (jelito grube): całe jelito z krezką i naczyniami (SMA/SMV, IC, RC, MC z RBMC i LBMC, IMA z LC, SB, SRA), przesunięcie guza podświetla zakres resekcji, krezkę i naczynia do podwiązania wg `ANAT.resectionFor` (04-jelito-grube.js; ASCRS 2022, odbytnica: PME/TME/APR); przy guzie blisko granicy odcinka okrężnicy zakres poszerzany tak, by margines od guza wynosił co najmniej ok. 6 cm (`MARGIN` = 0,055 t)
- `12-watroba` widok wątroby (`TOOL_EXT.liver`): kadr „Anatomia” (cały miąższ, przełącznik przezroczystości, wyróżnianie układów naczyń) i „Segmenty” (9 brył I–VIII z IVa/IVb, oś czasu m = rozsunięcie, suwak `lvExplode` i przyciski segmentów w doku, klik w segment wyróżnia go z jego szypułą i opisem); kadry z `singleFrames`, kadrowanie z `an.box`
- `12-watroba-przeszczep` przeszczepienie wątroby (`TOOL_EXT.oltx`, warianty w `10-watroba.js`): naczynia z `ANAT.LIVER` dzielone w punktach przecięcia na część biorcy (zostaje) i wątrobową (odjeżdża z wątrobą biorcy, wraca z przeszczepem); klasycznie zawątrobowa IVC idzie z wątrobą, w piggyback IVC biorcy zostaje, a przeszczep leży przed nią (przesunięcie `OLT_PB`, krótkie odcinki łączące w zespoleniach); pierścienie przecięć i zespoleń na osi czasu m 0–4; pętla Roux-en-Y; kadry z ujęciem `cam: 'custom'` + `camP` (preset w `07`)
- `12-watroba-resekcje` widok resekcji (`lrBuild` → `TOOL_EXT.lvres`: segmenty pozostające / usuwane, barwa niedokrwienia po kontroli dopływu, naczynia dzielone w punktach przecięcia, pierścienie podwiązań i staplera, preparat odsuwany i usuwany; ALPPS — podział in situ, skalowanie segmentów II/III wokół szczeliny pępkowej) i „Guz: zakres resekcji” (`TOOL_EXT.lvtumor`, dwa warianty: kadr 1 — guz przeciągany po miąższu, położenie w localStorage `surgitome-lv-guz`; kadr 2 — metastazektomia: preparat i wątroba z lożą wycięte z siatki (`ANAT.LIVER.carve`, kula guz + margines 1 cm), albo resekcja anatomiczna: `ltAnatR` buduje opis resekcji z reguły `resFor` — szypuły podwiązane na najwyższym poziomie w całości usuwanym (segment, sektor, prawa gałąź, część pępkowa), żyły wątrobowe przy hemihepatektomiach, pęcherzyk przy V/IVb)
- `12-bibliografia` panel „Opis” → „Piśmiennictwo”: źródła bieżącego zabiegu i wariantu (`refsFor`, kolejność: rola, rok) z odnośnikami PubMed/DOI; okno „Źródła” (`#bib`, cała lista, Esc zamyka); stopka panelu z oświadczeniem o autorstwie i udziale asystenta AI (PL/EN), licencjami i „Jak cytować” (`12-cytowanie`)
- `13` start aplikacji (po wszystkich modułach)

Badania są ukryte w nawigacji (kategoria `trials` poza paskiem kategorii i kolejką „Dalej”); dostępne z wyszukiwarki, po oznaczeniu gwiazdką — w Ulubionych (`localStorage`, klucz `surgitome-fav`). Kadry badań: punkt wyjścia → interwencja → stan po (bez endoskopii i TK).

## Konwencje danych
- Współrzędne: x+ = lewa strona pacjenta, y+ = dogłowowo, z+ = do przodu; 1 jednostka ≈ 1 cm (schemat).
- Oś czasu m: 0–1 zakres, 1–2 przecięcie staplerem, 2–3 usunięcie, 3–4 ułożenie, 4–5 zespolenie.
- Obiekt: `pre`/`post` (ścieżka + profil promienia), `morph` (okno przemiany), `open` (otwarte końce w endoskopii),
  `noEndo` (tylko widok z zewnątrz), `organ`/`solid` (poza światłem przewodu), `lift` (łuk ruchu).
- Każdy polski tekst w danych musi mieć tłumaczenie w `DICT` (`src/app/01-slownik-pomocnicze.js`).

## Wydania i archiwizacja

Od v1.0.0 każde wydanie na GitHubie (`gh release create vX.Y.Z`, nie szkic) trafia przez integrację do Zenodo jako ZIP drzewa plików z tagu, z metadanymi z `.zenodo.json` (`CITATION.cff` jest wtedy pomijany przez Zenodo, ale służy GitHubowi do „Cite this repository”). Przed wydaniem: `version` i `date-released` w `CITATION.cff`, `version` w `package.json`, `softwareVersion` w JSON-LD (`src/shell.html`), odbudowany `index.html`. DOI koncepcyjny (wszystkie wersje): `10.5281/zenodo.23185125` (v1.0.0: `10.5281/zenodo.23185126`); jest w README („How to cite” / „Jak cytować”), w `CITATION.cff` (`doi`) i w `CITE_DOI` (`src/app/12-cytowanie.js`). Licencje: kod MIT (`LICENSE`), treści CC BY 4.0 (`LICENSE-CONTENT`).

## Testy
    npm install
    npm test             (lub: bash tests/uruchom_wszystkie.sh)

- `i18n.js` — kompletność tłumaczeń (teksty z polskimi znakami lub typowymi słowami; resztę wyłapuje `ui_audyt.js ... en`)
- `kolizje_animacji.js` — pary narządów przenikające się w trakcie przemiany (z listą celowych połączeń)
- `endo_trasy.js [prefiks] [q]` — każda trasa endoskopowa: puste promienie (dziury w ścianie) i przejścia przez ścianę; bez `q` także nakładanie się narządów po operacji
- `ui_audyt.js desktop|mobile pl|en` — wszystkie kadry wszystkich wariantów w emulowanej przeglądarce; wyjątki i polskie teksty w wersji EN
- `ui_27.js` — kategorie i wyszukiwarka (komputer i telefon: `node tests/ui_27.js mobile`)
- `ui_28.js` — ulubione (start w zakładce, gwiazdki, zapis w localStorage, nawigacja po ulubionych, klawisz F); `node tests/ui_28.js stored` — wczytanie zapisanej listy
- `ui_30.js` — usunięcie wszystkich ulubionych: znika wiersz wariantów i sekcja wariantów w menu telefonu; ponowne dodanie klawiszem F
- `ui_29.js` — TK: pierwsze „Dalej” uruchamia przejazd, drugie przechodzi dalej
- `ui_31.js` — informacja przy pierwszym wejściu; `ui_32.js [mobile] [preview]` — badania: ukrycie w nawigacji, wyszukiwarka, widok podzielony, synchronizacja kamer, ulubione, „Dalej”, EN
- `klikany_chromium.py zakres` — slajd „Wybór zakresu resekcji”: guz przeciągany przez 9 odcinków jelita grubego
- `ui_33.js` — formularz uwag (kontekst, wysyłka, błąd → mailto, klawisze podczas pisania, EN); `ui_34.js` — guz (usuwany z preparatem / zostaje) i podwiązania naczyń w hemikolektomiach prawych
- `ui_35.js [mobile]` — wątroba: kategoria, dwa kadry, animacja i suwak rozsunięcia, wyróżnianie segmentu (VIII, IV = IVa + IVb) i układu naczyń, przełącznik miąższu (localStorage), EN
- `ui_36.js` — samouczek: start po informacji startowej i u stałych użytkowników, zapis w localStorage, kolejność kroków i liczba wycięć, klawisze (blokada skrótów pod spodem), klikalny przełącznik języka (EN), Esc i „Pomiń”, powtórka z opisu; telefon: wyszukiwarka w otwartym menu, powtórka z menu. Pozostałe testy interfejsu ustawiają `surgitome-intro` i `surgitome-tour`, żeby pominąć oba okna
- `ui_37.js [mobile]` — przeszczepienie wątroby: 4 warianty × 6 kadrów, zestaw zespoleń w stanie końcowym (i brak zbędnych), „Dalej”, legenda, EN
- `ui_38.js [mobile]` — resekcje wątroby: kolejność zakładek, 5 kadrów, preparat w planie i jego brak po resekcji, etykiety kikutów; slajd z guzem: reguły zakresu w kilku położeniach, odsetek miąższu, EN
- `ui_39.js` — język startowy: zapisany wybór (`surgitome-lang`) ma pierwszeństwo, bez niego pierwszy język przeglądarki — polski → PL, każdy inny → EN. Pozostałe testy jsdom ustawiają przeglądarkę na `pl-PL` (jsdom domyślnie zgłasza `en-US`)
- `ui_41.js` — „Jak cytować”: link w panelu i w menu na telefonie, treść cytowania z DOI koncepcyjnym, kopiowanie, klawisze i Esc przy otwartym okienku, EN
- `ui_43.js` — kod QR na telefonie: przycisk „Udostępnij” w menu, kod na pełnym ekranie, podpowiedź „Dotknij/Kliknij, aby zamknąć”, EN
- `ui_44.js` — krezka i mezorektum w resekcjach lewostronnych: podwiązania, części usuwane i pozostające, przełącznik, kadry, EN
- `ui_42.js` — piśmiennictwo: każdy zabieg i wariant ma źródła z odnośnikiem, stopka z oświadczeniem o autorstwie (PL/EN), okno „Źródła” (wszystkie zabiegi i badania, Esc), „Jak cytować” w stopce
- `klikany_chromium.py meso|guz` — zrzuty krezki z naczyniami i przeciągania guza
- `klikany_chromium.py trials [ethos,scar]` — zrzuty widoku podzielonego: komputer, telefon pionowo i poziomo
- `klikany_chromium.py` — test klikany w prawdziwej przeglądarce z renderowaniem 3D (Playwright), zrzuty ekranu w `zrzuty/`
- `ui_26.js` sprawdza też zbyt wczesne przesunięcie suwaka endoskopii (trasa jeszcze się buduje)
- `ui_40.js` — statystyki wyboru zabiegu (zdarzenia GoatCounter)
- `ui_18…26.js` — kod QR, warianty, menu i gesty na telefonie, przyciski, panel, rampa endoskopu po rozwidleniu

Narzędzie pomocnicze: `node tools/dumpgeo.js dist/core.js <id wariantu> > g.json && python3 tools/plotgeo.py g.json rzut.png post` — rzuty geometrii z przodu i z boku.

Piśmiennictwo: `python3 tools/pubmed_vancouver.py <PMID…>` — rekord PubMed (E-utilities) → wiersz do `ANAT.BIB.R` w stylu Vancouver (poprawki błędnych rekordów w `FIX`); potem klucz do `P`, `node build.js && node tools/bibliografia_md.js` — odtwarza `docs/BIBLIOGRAFIA.md` (zabiegi w kolejności nawigacji, rola i uzasadnienie każdej pozycji; ręcznie pisany blok `<!-- autor -->…<!-- /autor -->` zostaje).

Kod QR: `python3 tools/make_qr.py` — symbol `qrSym` z bezpośrednim linkiem do strony na GitHub Pages (https://piotrspychalski.github.io/surgitome/?ref=qr — źródło „qr” w statystykach GoatCounter, korekcja błędów Q, weryfikacja odczytu OpenCV; wymaga bibliotek qrcode, cairosvg z systemowym cairo, opencv-python); podpis pod kodem pozostaje „bit.ly/surgitome”. Wynik (`qrsym.txt`) wkleja się w `src/shell.html` w miejsce istniejącego `<symbol id="qrSym">`.

Statystyki zabiegów (od 5.10.2026): `gcView()` w `src/app/08-nawigacja-ui.js` — po każdej zmianie zakładki lub wariantu, jeśli widok trwa ≥ 2 s, wysyła do GoatCounter zdarzenie (`event: true`) o ścieżce `zabieg/<id zabiegu>` albo `zabieg/<id zabiegu>/<id wariantu>`. Domyślny zabieg przy starcie nie jest liczony (liczy się tylko wejście na stronę). Działa tylko tam, gdzie załadowano skrypt GoatCounter (GitHub Pages); w panelu GoatCounter zdarzenia są osobną sekcją obok odsłon stron.
