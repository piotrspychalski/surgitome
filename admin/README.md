# SURGITOME — panel autora

Prywatny panel statystyk SURGITOME pod adresem **https://piotrspychalski.pl/surgitome/admin/** (dostęp na hasło).

- **Role** — ile osób wybrało w oknie „Kim jesteś?” rolę student / pacjent / lekarz (albo pominęło wybór) i ile jest wizyt w każdej roli, dzień po dniu lub tydzień po tygodniu.
- **Ruch na stronie** — odwiedziny SURGITOME, źródła wejść (np. kod QR), urządzenia, kraje, przeglądarki.
- **Zabiegi** — najczęściej oglądane operacje i ich warianty (zdarzenia `zabieg/…`, które strona wysyła przy otwarciu zabiegu), otwarcia w czasie; osobno kopia badawcza STUDY.
- **SURGITOME-STUDY** — wyniki ankiety ekspertów (CVI, SUS, role) z pliku eksportu Web3Forms, liczone w przeglądarce.

## Jak to chroni dane

Strona jest publicznie dostępna (darmowy GitHub nie ukrywa stron), ale **dane są zaszyfrowane hasłem** (AES-256-GCM, klucz z hasła przez PBKDF2, 600 000 iteracji). Bez hasła widać tylko pole do jego wpisania. Odszyfrowanie odbywa się wyłącznie w przeglądarce.

- Statystyki **nie są zapisywane w repozytorium**. Przy każdej automatycznej publikacji SURGITOME na GitHubie (codziennie i po każdej zmianie w main) skrypt `admin/zbierz.mjs` pobiera je z GoatCountera, szyfruje i dokłada do opublikowanej strony.
- Klucz GoatCountera i hasło panelu leżą w **sekretach GitHuba** repozytorium surgitome. Nie ma ich w kodzie ani w dzienniku publikacji, a dziennik nie wypisuje żadnych liczb.
- **Wyjątek, decyzja autora z 26.11.2026:** żeby „Odśwież dane” działało od razu, klucz GoatCountera jest dołączany do **zaszyfrowanych** danych panelu. Dzieje się tak tylko wtedy, gdy klucz ma wyłącznie prawo „Read statistics”, co sprawdza publikacja. Ktoś, kto zgadłby hasło, mógłby więc czytać statystyki także później. Klucz z szerszymi prawami nie jest dołączany, a przycisk prowadzi wtedy do GitHuba. Po zmianie hasła albo klucza wystarczy jedna publikacja.
- **Odpowiedzi z ankiety STUDY nigdy nie trafiają na GitHuba.** Plik CSV wskazujesz w panelu, czyta go tylko Twoja przeglądarka i nic nie jest wysyłane. Kopie danych trzymaj poza tym repozytorium (np. w prywatnym lab-tools).
- Strona ma znacznik `noindex`, więc wyszukiwarki jej nie indeksują. Nie ma na niej licznika GoatCountera.
- Bez sekretów (albo gdy GoatCounter nie odpowie) SURGITOME publikuje się normalnie, tylko bez panelu.

Hasło musi mieć co najmniej 12 znaków. Najlepsze są 4–5 przypadkowych słów, np. `kanapka-zegar-mokry-sztorm`. Zaszyfrowany plik jest publiczny, więc krótkie hasło dałoby się zgadnąć.

## Jak otworzyć

1. Wejdź na https://piotrspychalski.pl/surgitome/admin/ (na komputerze albo telefonie).
2. Wpisz hasło. Jeśli zaznaczysz **„Zapamiętaj na tym urządzeniu”**, przeglądarka zachowa klucz, którego nie da się z niej odczytać, i następnym razem panel otworzy się bez hasła.
3. **Wyloguj** usuwa zapamiętany klucz z tego urządzenia.

## Jak odświeżyć dane

- **Same:** codziennie ok. 5:17 (czasu polskiego zimą) i przy każdej publikacji SURGITOME.
- **Od razu:** kliknij w panelu **„Odśwież dane”**. Panel pobierze aktualne dane prosto z GoatCountera (kilkanaście sekund, postęp widać na przycisku), a przy dacie pojawi się „(pobrane teraz)”. Odświeżone dane są tylko w tym oknie; po ponownym otwarciu panel pokazuje znowu ostatnią publikację.
- Jeśli klucz nie został dołączony (ma szersze prawa niż „Read statistics”), przycisk otwiera GitHuba. Kliknij tam **Run workflow → Run workflow** i po kilku minutach przeładuj panel.
- Panel pokazuje datę danych. Jeśli są starsze niż półtorej doby, wyświetla ostrzeżenie. GitHub wyłącza harmonogram w repozytorium, w którym przez 60 dni nic się nie zmieniło. Wtedy wystarczy raz kliknąć „Run workflow” albo włączyć harmonogram w zakładce Actions.

## SURGITOME-STUDY w panelu

1. W panelu Web3Forms otwórz zgłoszenia i pobierz **eksport CSV**. Możesz też użyć plików JSON z „Pobierz odpowiedzi”.
2. W zakładce **SURGITOME-STUDY** kliknij „Wybierz pliki” (albo przeciągnij pliki).
3. W polu **„Pomiń kody (pilotaż)”** wpisz kody pilotażowe. Pole jest zapamiętywane tylko w tej przeglądarce.
4. Panel liczy wyniki według tych samych reguł co `tools/analiza_ankiety.py` z repozytorium surgitome-study. Zgodność sprawdza test `admin/tests/test_study.mjs` na wymyślonym przykładzie. Do artykułu nadal używaj pełnej analizy w Pythonie, bo zapisuje wszystkie tabele.

Kody zaproszeń są sprawdzane z listą skrótów z publicznego repozytorium surgitome-study. Lista jest dołączana do zaszyfrowanych danych przy publikacji.

## Pierwsze uruchomienie (raz)

1. **Klucz GoatCountera:** zaloguj się na surgitome.goatcounter.com → nazwa użytkownika (u góry) → **API** → nowy klucz, zaznacz **tylko „Read statistics”**.
2. **Sekrety na GitHubie:** repozytorium surgitome → **Settings → Secrets and variables → Actions → New repository secret**:
   - `GOATCOUNTER_TOKEN` — klucz z punktu 1,
   - `PANEL_HASLO` — hasło panelu.
3. Panel pojawi się po scaleniu gałęzi `panel-administratora` z main (albo po kolejnej publikacji, jeśli sekrety dodasz później).

**Zmiana hasła:** zmień sekret `PANEL_HASLO` i uruchom publikację. Zapamiętane klucze na urządzeniach przestaną działać i panel znowu zapyta o hasło.

## Dla programisty

- `admin/zbierz.mjs` — pobiera dane z API GoatCountera (`/stats/hits`, `/stats/total`, `/stats/{toprefs,campaigns,sizes,locations,browsers,systems}`), szyfruje je (`admin/src/szyfr.js`) i składa stronę w `--out` (w publikacji: `dist/admin`). Opcja `--przyklad` używa danych wymyślonych, a strona pokazuje wtedy baner. Krok w `.github/workflows/pages.yml`.
- `admin/src/gc.js` — pobieranie z API GoatCountera, wspólne dla publikacji i przycisku „Odśwież dane”. `admin/src/panel.js` — logowanie, wykresy (SVG, bez bibliotek), zakładki. `admin/src/study.js` — analiza ankiety (przeniesiona z `tools/analiza_ankiety.py`).
- Testy: `node admin/tests/test_szyfr.mjs`, `node admin/tests/test_study.mjs`, `node admin/tests/test_gc.mjs` (udawane odpowiedzi API). Po zmianie analizy w STUDY: `python3 admin/tests/fixture_study.py ../surgitome-study`, potem test.
- Podgląd lokalny: `PANEL_HASLO='…' node admin/zbierz.mjs --przyklad`, a potem `python3 -m http.server 8790 --directory admin/dist`.

(c) 2026 Piotr Spychalski, MD, PhD · kod: MIT License
