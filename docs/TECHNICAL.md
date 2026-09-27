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
- `04-jelito-grube.js` — hemikolektomie, wspólny moduł EEA (`eeaJoin`, `colonEEA`), hemikolektomia lewa (EEA, izo, FEEA), resekcja odbytnicy, kolektomia z IRA, zbiornik J (IPAA), Hartmann, ileostomie
- `05-trzustka-drogi-zolciowe.js` — Whipple, PPPD, hepatikojejunostomia, pankreatektomia dystalna, Puestow i Frey, choledochoduodenostomia
- `06-przelyk.js` — esofagektomie (Ivor Lewis i McKeown także z zespoleniem bok-do-boku i ślepym kikutem przełyku; rura żołądkowa z krzywizny większej), kontekst klatki piersiowej (w tym żyła nieparzysta)
- `07-gastroenterostomia-bpd-ds.js` — gastroenterostomia omijająca, BPD (Scopinaro), SADI-S, BPD-DS
- `08-narzedzia-os-czasu-lista.js` — staplery i szwy na osi czasu, łuki ruchu (LIFT), przygotowanie danych, lista zabiegów; `ANAT._lib` — klocki dla modułu badań
- `09-badania.js` — badania ECOPOP (`ANAT.TRIALS`): ETHOS, SCAR, T-REX (flaga `published: false` ukrywa badanie; wtedy widoczne tylko przy `window.__SG_PREVIEW`); zmiana T1, tatuaże, blizna, klips OTSC, krezka z naczyniami i węzłami, narzędzie EFTR, pole napromieniania

**src/app — aplikacja**
- `01` słownik PL→EN i pomocnicze · `02` motyw i renderer · `03` TK · `04` tekstury, stan, obiekty
- `05` narzędzia · `06` anatomia, kadry, oś czasu · `07` kamera i endoskop · `08` nawigacja i UI
- `09` wyszukiwarka zabiegów (badania — tylko po nazwie) · `10` tryb telefonu · `11` rozmiar, etykiety (z rozsuwaniem), pętla renderowania
- `12` badania: widok podzielony — dwa ramiona w jednej scenie, przy każdym przebiegu podmiana modelu `M`, kamery, obszaru widoku i warstwy etykiet (`withArm`); wspólny postęp kadru p ∈ [0, 1], ramię liczy m = p × mEnd; synchronizacja kamer; słownik `DICT_TRIALS`
- `13` start aplikacji (po wszystkich modułach)

Badania są ukryte w nawigacji (kategoria `trials` poza paskiem kategorii i kolejką „Dalej”); dostępne z wyszukiwarki, po oznaczeniu gwiazdką — w Ulubionych (`localStorage`, klucz `surgitome-fav`). Kadry badań: punkt wyjścia → interwencja → stan po (bez endoskopii i TK).

## Konwencje danych
- Współrzędne: x+ = lewa strona pacjenta, y+ = dogłowowo, z+ = do przodu; 1 jednostka ≈ 1 cm (schemat).
- Oś czasu m: 0–1 zakres, 1–2 przecięcie staplerem, 2–3 usunięcie, 3–4 ułożenie, 4–5 zespolenie.
- Obiekt: `pre`/`post` (ścieżka + profil promienia), `morph` (okno przemiany), `open` (otwarte końce w endoskopii),
  `noEndo` (tylko widok z zewnątrz), `organ`/`solid` (poza światłem przewodu), `lift` (łuk ruchu).
- Każdy polski tekst w danych musi mieć tłumaczenie w `DICT` (`src/app/01-slownik-pomocnicze.js`).

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
- `klikany_chromium.py trials [ethos,scar,t-rex]` — zrzuty widoku podzielonego: komputer, telefon pionowo i poziomo
- `klikany_chromium.py` — test klikany w prawdziwej przeglądarce z renderowaniem 3D (Playwright), zrzuty ekranu w `zrzuty/`
- `ui_27.js` — kategorie i wyszukiwarka (komputer i telefon: `node tests/ui_27.js mobile`)
- `klikany_chromium.py` — test klikany w prawdziwej przeglądarce z renderowaniem 3D (Playwright), zrzuty ekranu w `zrzuty/`
- `ui_27.js` — kategorie i wyszukiwarka (komputer i telefon: `node tests/ui_27.js mobile`)
- `klikany_chromium.py` — test klikany w prawdziwej przeglądarce z renderowaniem 3D (Playwright), zrzuty ekranu w `zrzuty/`
- `ui_27.js` — kategorie i wyszukiwarka (komputer i telefon: `node tests/ui_27.js mobile`)
- `klikany_chromium.py` — test klikany w prawdziwej przeglądarce z renderowaniem 3D (Playwright), zrzuty ekranu w `zrzuty/`
- `ui_27.js` — kategorie i wyszukiwarka (komputer i telefon: `node tests/ui_27.js mobile`)
- `klikany_chromium.py` — test klikany w prawdziwej przeglądarce z renderowaniem 3D (Playwright), zrzuty ekranu w `zrzuty/`
- `ui_27.js` — kategorie i wyszukiwarka (komputer i telefon: `node tests/ui_27.js mobile`)
- `klikany_chromium.py` — test klikany w prawdziwej przeglądarce z renderowaniem 3D (Playwright), zrzuty ekranu w `zrzuty/`
- `ui_27.js` — kategorie i wyszukiwarka (komputer i telefon: `node tests/ui_27.js mobile`)
- `klikany_chromium.py` — test klikany w prawdziwej przeglądarce z renderowaniem 3D (Playwright), zrzuty ekranu w `zrzuty/`
- `ui_27.js` — kategorie i wyszukiwarka (komputer i telefon: `node tests/ui_27.js mobile`)
- `klikany_chromium.py` — test klikany w prawdziwej przeglądarce z renderowaniem 3D (Playwright), zrzuty ekranu w `zrzuty/`
- `ui_26.js` sprawdza też zbyt wczesne przesunięcie suwaka endoskopii (trasa jeszcze się buduje)
- `ui_27.js` — kategorie i wyszukiwarka (komputer i telefon: `node tests/ui_27.js mobile`)
- `klikany_chromium.py` — test klikany w prawdziwej przeglądarce z renderowaniem 3D (Playwright), zrzuty ekranu w `zrzuty/`
- `ui_27.js` — kategorie i wyszukiwarka (komputer i telefon: `node tests/ui_27.js mobile`)
- `klikany_chromium.py` — test klikany w prawdziwej przeglądarce z renderowaniem 3D (Playwright), zrzuty ekranu w `zrzuty/`
- `ui_27.js` — kategorie i wyszukiwarka (komputer i telefon: `node tests/ui_27.js mobile`)
- `klikany_chromium.py` — test klikany w prawdziwej przeglądarce z renderowaniem 3D (Playwright), zrzuty ekranu w `zrzuty/`
- `ui_27.js` — kategorie i wyszukiwarka (komputer i telefon: `node tests/ui_27.js mobile`)
- `klikany_chromium.py` — test klikany w prawdziwej przeglądarce z renderowaniem 3D (Playwright), zrzuty ekranu w `zrzuty/`
- `ui_18…26.js` — kod QR, warianty, menu i gesty na telefonie, przyciski, panel, rampa endoskopu po rozwidleniu

Narzędzie pomocnicze: `node tools/dumpgeo.js dist/core.js <id wariantu> > g.json && python3 tools/plotgeo.py g.json rzut.png post` — rzuty geometrii z przodu i z boku.

Kod QR: `python3 tools/make_qr.py` — symbol `qrSym` z bezpośrednim linkiem do strony na GitHub Pages (https://piotrspychalski.github.io/surgitome/?ref=qr — źródło „qr” w statystykach GoatCounter, korekcja błędów Q, weryfikacja odczytu OpenCV; wymaga bibliotek qrcode, cairosvg z systemowym cairo, opencv-python); podpis pod kodem pozostaje „bit.ly/surgitome”. Wynik (`qrsym.txt`) wkleja się w `src/shell.html` w miejsce istniejącego `<symbol id="qrSym">`.
