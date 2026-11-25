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
// UWAGA: dziennik automatycznej publikacji w publicznym repozytorium jest publiczny — skrypt nie wypisuje żadnych liczb ani danych.
import { mkdirSync, copyFileSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const TU = dirname(fileURLToPath(import.meta.url));
const Szyfr = require('./src/szyfr.js');

const PRZYKLAD = process.argv.includes('--przyklad');
const iOut = process.argv.indexOf('--out');
const OUT = resolve(iOut > 0 && process.argv[iOut + 1] ? process.argv[iOut + 1] : join(TU, 'dist'));
const SITE = process.env.GC_SITE || 'surgitome';
const START = process.env.GC_START || '2026-09-27';
const TOKEN = process.env.GOATCOUNTER_TOKEN || '';
const HASLO = process.env.PANEL_HASLO || '';
const KODY_URL = 'https://raw.githubusercontent.com/piotrspychalski/surgitome-study/main/src/app/12-badanie-kody.js';
const LISTY = ['toprefs', 'campaigns', 'sizes', 'locations', 'browsers', 'systems'];
const ZAKRESY = { '7': 7, '30': 30, '90': 90, all: 0 };

function stop(msg) { console.error('BŁĄD: ' + msg); process.exit(1); }
if (HASLO.length < 12) stop('brak hasła panelu albo krótsze niż 12 znaków (sekret PANEL_HASLO).');
if (!PRZYKLAD && !TOKEN) stop('brak klucza GoatCountera (sekret GOATCOUNTER_TOKEN).');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const iso = (d) => d.toISOString().slice(0, 19) + 'Z';
const dzien = (d) => d.toISOString().slice(0, 10);

let zapytan = 0;
async function api(sciezka, params = {}) {
  const u = new URL(`https://${SITE}.goatcounter.com/api/v0${sciezka}`);
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') u.searchParams.set(k, v);
  for (let proba = 0; proba < 6; proba++) {
    const r = await fetch(u, { headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' } });
    zapytan++;
    if (r.status === 429) { await sleep((+r.headers.get('x-rate-limit-reset') || 1) * 1000 + 250); continue; }
    if (!r.ok) {
      let opis = ''; try { const j = await r.json(); opis = j.error || JSON.stringify(j.errors || ''); } catch (e) { /* bez treści */ }
      stop(`GoatCounter ${sciezka}: HTTP ${r.status}${r.status === 401 ? ' (zły klucz)' : r.status === 403 ? ' (klucz bez uprawnienia „Read statistics”)' : ''} ${String(opis).slice(0, 120)}`);
    }
    await sleep(300);  // limit API: 4 zapytania na sekundę
    return r.json();
  }
  stop(`GoatCounter ${sciezka}: wciąż przekroczony limit zapytań`);
}

function dni(od, doDnia) {
  const out = [];
  for (let d = new Date(od + 'T00:00:00Z'); dzien(d) <= doDnia; d.setUTCDate(d.getUTCDate() + 1)) out.push(dzien(d));
  return out;
}

async function zGoatCountera() {
  const teraz = new Date();
  const koniec = new Date(Date.UTC(teraz.getUTCFullYear(), teraz.getUTCMonth(), teraz.getUTCDate(), teraz.getUTCHours() + 1));
  const start = new Date(START + 'T00:00:00Z');
  const D = dni(START, dzien(teraz)), idx = Object.fromEntries(D.map((d, i) => [d, i]));
  const zero = () => D.map(() => 0);

  // ścieżki i zdarzenia dzień po dniu
  const hits = [], widziane = new Set();
  for (let strona = 0; strona < 20; strona++) {
    const r = await api('/stats/hits', { start: iso(start), end: iso(koniec), limit: 100, group: 'day', exclude_paths: [...widziane].join(',') });
    const nowe = (r.hits || []).filter((h) => !widziane.has(h.path_id));
    nowe.forEach((h) => { widziane.add(h.path_id); hits.push(h); });
    if (!r.more || !nowe.length) break;
  }
  const odwiedziny = zero(), zdarzenia = {}, sciezki = [];
  for (const h of hits) {
    const seria = zero();
    for (const s of h.stats || []) if (s.day in idx) seria[idx[s.day]] += s.daily || 0;
    if (h.event) zdarzenia[h.path] = seria;
    else { seria.forEach((v, i) => { odwiedziny[i] += v; }); sciezki.push({ path: h.path, title: h.title || '', count: h.count || 0 }); }
  }
  sciezki.sort((a, b) => b.count - a.count);

  const tot = await api('/stats/total', { start: iso(start), end: iso(koniec) });
  const lacznie = zero();
  for (const s of tot.stats || []) if (s.day in idx) lacznie[idx[s.day]] += s.daily || 0;

  // listy (źródła, urządzenia, kraje…) dla zakresów 7 / 30 / 90 dni i całości
  const listy = {};
  for (const [z, n] of Object.entries(ZAKRESY)) {
    const od = n ? new Date(Date.UTC(teraz.getUTCFullYear(), teraz.getUTCMonth(), teraz.getUTCDate() - n + 1)) : start;
    listy[z] = {};
    for (const p of LISTY) {
      const r = await api('/stats/' + p, { start: iso(od < start ? start : od), end: iso(koniec), limit: 15 });
      listy[z][p] = (r.stats || []).map((s) => ({ name: s.name || '(brak)', count: s.count || 0 }));
    }
  }
  return { dni: D, odwiedziny, lacznie, zdarzenia, sciezki: sciezki.slice(0, 15), listy, total: tot.total || 0, total_events: tot.total_events || 0 };
}

/* dane WYMYŚLONE do sprawdzania wyglądu (deterministyczne) */
function przyklad() {
  let s = 7; const los = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const D = dni(START, dzien(new Date())), n = D.length;
  const odwiedziny = D.map((d, i) => Math.round(20 + 15 * Math.sin(i / 5) + 30 * los() + (new Date(d).getUTCDay() % 6 === 0 ? -10 : 10)));
  const role = { student: 0.45, pacjent: 0.15, lekarz: 0.3, pominieto: 0.1 }, zdarzenia = {};
  const od = Math.max(0, n - 40);  // okno wyboru roli działa od niedawna
  for (const [r, p] of Object.entries(role)) {
    zdarzenia['rola-wybor/' + r] = D.map((d, i) => (i < od ? 0 : Math.round(odwiedziny[i] * 0.4 * p * (0.6 + los()))));
    if (r !== 'pominieto') zdarzenia['rola-wizyta/' + r] = D.map((d, i) => (i < od ? 0 : Math.round(odwiedziny[i] * 0.8 * p * (0.6 + los()))));
  }
  const L = (nazwy) => nazwy.map((name, i) => ({ name, count: Math.round(400 / (i + 1) * (0.7 + 0.6 * los())) }));
  const lista = () => ({ toprefs: L(['(bezpośrednio)', 'Google', 'piotrspychalski.pl', 'facebook.com', 'qr']), campaigns: L(['qr', 'wle']),
    sizes: L(['Phones', 'Computer monitors', 'Tablets']), locations: L(['Polska', 'Niemcy', 'Wielka Brytania', 'Stany Zjednoczone']),
    browsers: L(['Chrome', 'Safari', 'Firefox', 'Edge']), systems: L(['iOS', 'Android', 'Windows', 'macOS']) });
  return { dni: D, odwiedziny, lacznie: odwiedziny.map((v, i) => v + Object.values(zdarzenia).reduce((a, z) => a + z[i], 0)), zdarzenia,
    sciezki: [{ path: '/surgitome/', title: 'SURGITOME', count: 1234 }, { path: '/surgitome/index.html', title: 'SURGITOME', count: 56 }],
    listy: Object.fromEntries(Object.keys(ZAKRESY).map((z) => [z, lista()])), total: 1290, total_events: 400 };
}

async function kodyStudy() {
  try {
    const lokalny = process.env.STUDY_KODY;  // ścieżka do src/app/12-badanie-kody.js (bez sieci, np. lokalnie)
    const t = lokalny && existsSync(lokalny) ? readFileSync(lokalny, 'utf8') : await (await fetch(KODY_URL)).text();
    const m = t.match(/STUDY_CODES = (\{[\s\S]*?\});/);
    return m ? JSON.parse(m[1]) : null;
  } catch (e) { return null; }
}

const gc = PRZYKLAD ? przyklad() : await zGoatCountera();
const dane = Object.assign({ format: 'surgitome-admin', wersja: 1, site: SITE, utworzono: new Date().toISOString(), przyklad: PRZYKLAD }, gc,
  { study: { kody: await kodyStudy() } });
const klucz = await Szyfr.klucz(HASLO);
const paczka = await Szyfr.zaszyfruj(dane, klucz);

mkdirSync(OUT, { recursive: true });
for (const f of ['index.html', 'panel.css', 'panel.js', 'study.js', 'szyfr.js']) copyFileSync(join(TU, 'src', f), join(OUT, f));
writeFileSync(join(OUT, 'dane.enc.json'), JSON.stringify(paczka));
console.log(`OK: panel w ${relative(process.cwd(), OUT) || '.'}, dane zaszyfrowane${PRZYKLAD ? ' (PRZYKŁADOWE)' : ''}; zapytań do GoatCountera: ${zapytan}; kody STUDY: ${dane.study.kody ? 'są' : 'brak'}.`);
