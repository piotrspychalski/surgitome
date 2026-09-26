# Wdrożenie SURGITOME na GitHub Pages (ok. 5 minut)

1. github.com → **New repository** → nazwa `surgitome` → Public (darmowe Pages) lub Private (wymaga GitHub Pro) → **Create repository**.
2. Na stronie pustego repozytorium: **uploading an existing file** → przeciągnij **całą zawartość** tego folderu (także ukryty folder `.github`; w Finderze pokaż ukryte pliki: Cmd+Shift+.) → **Commit changes**.
3. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Zakładka **Actions**: po ok. 2–3 min zielony znacznik; adres strony pojawi się w **Settings → Pages** (np. `https://LOGIN.github.io/surgitome/`).
5. Nowy adres wyślij mi — wygeneruję nowy kod QR (`tools/make_qr.py`). W bit.ly możesz przekierować `bit.ly/surgitome` na nowy adres.

Każda kolejna zmiana wgrana do gałęzi `main` sama się złoży, przejdzie testy i opublikuje.
Plik `index.html` w katalogu głównym to gotowa strona (awaryjnie działa też jako Pages „Deploy from a branch”).
