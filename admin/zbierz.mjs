#!/usr/bin/env node
// SURGITOME — panel autora. (c) 2026 Piotr Spychalski · MIT License
// Pobiera statystyki SURGITOME z GoatCountera (API, klucz tylko do odczytu), szyfruje je hasłem panelu i składa stronę panelu.
// Uruchamiane przez automatyczną publikację SURGITOME na GitHubie (.github/workflows/pages.yml): codziennie, po zmianie w main
// i przyciskiem „Run workflow”; strona panelu trafia do dist/admin/ → https://piotrspychalski.pl/surgitome/admin/.
//
// Zmienne środowiskowe (na GitHubie: Settings → Secrets and variables → Actions; wpisuje je autor):
//   GOATCOUNTER_TOKEN — klucz API GoatCountera z uprawnieniem „Read statistics”,
//   PANEL_HASLO       — hasło panelu (co najmniej 12 znaków),
//   GC_SITE (surgitome), GC_START (2026-09-27) — opcjonalnie.
// --out <folder>: dokąd złożyć stronę (domyślnie admin/dist); --przyklad: dane WYMYŚLONE (bez GoatCountera), do sprawdzania
// wyglądu — strona pokazuje wtedy wyraźny baner.
//
// Odświeżanie na żywo (przycisk „Odśwież dane”, decyzja autora 2026-11-26): klucz GoatCountera trafia do ZASZYFROWANYCH danych panelu
// tylko wtedy, gdy ma wyłącznie prawo „Read statistics” (sprawdzane przez GET /me). Klucz z szerszymi prawami — panel bez odświeżania.
//
// UWAGA: dziennik automatycznej publikacji w publicznym repozytorium jest publiczny — skrypt nie wypisuje żadnych liczb ani danych.
import { mkdirSync, copyFileSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const TU = dirname(fileURLToPath(import.meta.url));
const Szyfr = require('./src/szyfr.js');
const GC = require('./src/gc.js');

const PRZYKLAD = process.argv.includes('--przyklad');
const iOut = process.argv.indexOf('--out');
const OUT = resolve(iOut > 0 && process.argv[iOut + 1] ? process.argv[iOut + 1] : join(TU, 'dist'));
const SITE = process.env.GC_SITE || 'surgitome';
const START = process.env.GC_START || '2026-09-27';
const TOKEN = process.env.GOATCOUNTER_TOKEN || '';
const HASLO = process.env.PANEL_HASLO || '';
const KODY_URL = 'https://raw.githubusercontent.com/piotrspychalski/surgitome-study/main/src/app/12-badanie-kody.js';
const PLIKI = ['index.html', 'panel.css', 'panel.js', 'study.js', 'szyfr.js', 'gc.js'];

function stop(msg) { console.error('BŁĄD: ' + msg); process.exit(1); }
if (HASLO.length < 12) stop('brak hasła panelu albo krótsze niż 12 znaków (sekret PANEL_HASLO).');
if (!PRZYKLAD && !TOKEN) stop('brak klucza GoatCountera (sekret GOATCOUNTER_TOKEN).');

/* dane WYMYŚLONE do sprawdzania wyglądu (deterministyczne) */
function przyklad() {
  let s = 7; const los = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const D = GC.dni(START, GC.dzien(new Date())), n = D.length;
  const odwiedziny = D.map((d, i) => Math.round(20 + 15 * Math.sin(i / 5) + 30 * los() + (new Date(d).getUTCDay() % 6 === 0 ? -10 : 10)));
  const role = { student: 0.45, pacjent: 0.15, lekarz: 0.3, pominieto: 0.1 }, zdarzenia = {}, tytuly = {};
  const od = Math.max(0, n - 40);  // okno wyboru roli działa od niedawna
  for (const [r, p] of Object.entries(role)) {
    zdarzenia['rola-wybor/' + r] = D.map((d, i) => (i < od ? 0 : Math.round(odwiedziny[i] * 0.4 * p * (0.6 + los()))));
    if (r !== 'pominieto') zdarzenia['rola-wizyta/' + r] = D.map((d, i) => (i < od ? 0 : Math.round(odwiedziny[i] * 0.8 * p * (0.6 + los()))));
  }
  // zabiegi (ścieżka zabieg/<id>[/<wariant>], tytuł jak w src/app/08-nawigacja-ui.js) — wymyślone nazwy i liczby
  const Z = [['dg', 'Resekcja dystalna żołądka', [['b1', 'B-I'], ['b2', 'B-II'], ['dgry', 'Roux-en-Y']], 0.5], ['rh', 'Hemikolektomia prawa', [['rh-iso', 'izoperystaltyczne'], ['rh-anti', 'antyperystaltyczne']], 0.4],
    ['whip', 'Whipple', [['whip-pj', 'zespolenie trzustkowo-jelitowe'], ['whip-pg', 'zespolenie trzustkowo-żołądkowe']], 0.35], ['sleeve', 'Sleeve', null, 0.3],
    ['rygb', 'RYGB', null, 0.25], ['zakres', 'Wybór zakresu resekcji', null, 0.45], ['liver', 'Anatomia wątroby', null, 0.2], ['hartmann', 'Hartmann', null, 0.12]];
  const seria = (w) => D.map((d, i) => Math.round(odwiedziny[i] * 0.15 * w * (0.4 + los())));
  for (const [id, nazwa, war, w] of Z) {
    if (!war) { zdarzenia['zabieg/' + id] = seria(w); tytuly['zabieg/' + id] = nazwa; continue; }
    war.forEach(([v, kr], k) => { zdarzenia[`zabieg/${id}/${v}`] = seria(w / (k + 1)); tytuly[`zabieg/${id}/${v}`] = nazwa + ' — ' + kr; });
  }
  zdarzenia['study/zabieg/dg/b1'] = seria(0.05); tytuly['study/zabieg/dg/b1'] = 'Resekcja dystalna żołądka — B-I';
  const L = (nazwy) => nazwy.map((name, i) => ({ name, count: Math.round(400 / (i + 1) * (0.7 + 0.6 * los())) }));
  const lista = () => ({ toprefs: L(['(bezpośrednio)', 'Google', 'piotrspychalski.pl', 'facebook.com', 'qr']), campaigns: L(['qr', 'wle']),
    sizes: L(['Phones', 'Computer monitors', 'Tablets']), locations: L(['Polska', 'Niemcy', 'Wielka Brytania', 'Stany Zjednoczone']),
    browsers: L(['Chrome', 'Safari', 'Firefox', 'Edge']), systems: L(['iOS', 'Android', 'Windows', 'macOS']) });
  return { dni: D, odwiedziny, lacznie: odwiedziny.map((v, i) => v + Object.values(zdarzenia).reduce((a, z) => a + z[i], 0)), zdarzenia, tytuly,
    sciezki: [{ path: '/surgitome/', title: 'SURGITOME', count: 1234 }, { path: '/surgitome/index.html', title: 'SURGITOME', count: 56 }],
    listy: Object.fromEntries(Object.keys(GC.ZAKRESY).map((z) => [z, lista()])), total: 1290, total_events: 400 };
}

async function kodyStudy() {
  try {
    const lokalny = process.env.STUDY_KODY;  // ścieżka do src/app/12-badanie-kody.js (bez sieci, np. lokalnie)
    const t = lokalny && existsSync(lokalny) ? readFileSync(lokalny, 'utf8') : await (await fetch(KODY_URL)).text();
    const m = t.match(/STUDY_CODES = (\{[\s\S]*?\});/);
    return m ? JSON.parse(m[1]) : null;
  } catch (e) { return null; }
}

let gc, zapytan = 0, odswiezanie = null, uwaga = '';
if (PRZYKLAD) { gc = przyklad(); odswiezanie = { site: SITE, start: START, klucz: 'przyklad-niepoprawny-klucz' }; }  // przycisk pokaże błąd 401
else {
  try {
    const w = await GC.pobierz({ site: SITE, start: START, token: TOKEN });
    gc = w.dane; zapytan = w.zapytan;
    const u = await GC.uprawnienia(SITE, TOKEN);
    if (u.tylkoOdczyt) odswiezanie = { site: SITE, start: START, klucz: TOKEN };
    else uwaga = ' UWAGA: klucz ma szersze prawa niż „Read statistics” — nie dołączam go, przycisk „Odśwież dane” prowadzi do GitHuba.';
  } catch (e) { stop(e.message); }
}
const dane = Object.assign({ format: 'surgitome-admin', wersja: 1, site: SITE, start: START, utworzono: new Date().toISOString(), przyklad: PRZYKLAD }, gc,
  { odswiezanie, study: { kody: await kodyStudy() } });
const klucz = await Szyfr.klucz(HASLO);
const paczka = await Szyfr.zaszyfruj(dane, klucz);

mkdirSync(OUT, { recursive: true });
for (const f of PLIKI) copyFileSync(join(TU, 'src', f), join(OUT, f));
writeFileSync(join(OUT, 'dane.enc.json'), JSON.stringify(paczka));
console.log(`OK: panel w ${relative(process.cwd(), OUT) || '.'}, dane zaszyfrowane${PRZYKLAD ? ' (PRZYKŁADOWE)' : ''}; zapytań do GoatCountera: ${zapytan}; ` +
  `kody STUDY: ${dane.study.kody ? 'są' : 'brak'}; odświeżanie na żywo: ${odswiezanie ? 'tak' : 'nie'}.${uwaga}`);
