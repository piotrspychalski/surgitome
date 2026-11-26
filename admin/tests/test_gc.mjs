// SURGITOME — panel autora. Test admin/src/gc.js na udawanych odpowiedziach API GoatCountera (bez sieci):
// zdarzenia i odwiedziny dzień po dniu, tytuły zdarzeń, listy dla zakresów, sprawdzenie uprawnień klucza (tylko „Read statistics”).
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const GC = require('../src/gc.js');
let bledy = 0;
const ok = (w, opis) => { if (!w) { bledy++; console.log('BŁĄD:', opis); } };

const dzis = new Date().toISOString().slice(0, 10);
const wczoraj = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
let perm = 64, zapytania = [];
globalThis.fetch = async (u, o) => {
  const url = new URL(u), p = url.pathname.replace('/api/v0', '');
  zapytania.push({ p, auth: o.headers.Authorization, q: Object.fromEntries(url.searchParams) });
  const json = (j, status = 200) => ({ ok: status < 300, status, headers: { get: () => null }, json: async () => j });
  if (o.headers.Authorization !== 'Bearer dobry') return json({ error: 'unknown token' }, 401);
  if (p === '/me') return json({ token: { name: 't', permissions: perm } });
  if (p === '/stats/hits') return json({ more: false, hits: [
    { path_id: 1, path: '/surgitome', title: 'SURGITOME', event: false, count: 7, stats: [{ day: wczoraj, daily: 3 }, { day: dzis, daily: 4 }] },
    { path_id: 2, path: 'zabieg/dg/b1', title: 'Resekcja dystalna — B-I', event: true, count: 2, stats: [{ day: dzis, daily: 2 }] },
    { path_id: 3, path: 'rola-wybor/student', title: 'Rola — wybór: student', event: true, count: 1, stats: [{ day: wczoraj, daily: 1 }, { day: '1999-01-01', daily: 9 }] }] });
  if (p === '/stats/total') return json({ total: 10, total_events: 3, stats: [{ day: wczoraj, daily: 4 }, { day: dzis, daily: 6 }] });
  if (p.startsWith('/stats/')) return json({ stats: [{ name: 'Polska', count: 5 }, { name: '', count: 1 }] });
  return json({ error: 'nie ma' }, 404);
};

const postep = [];
const w = await GC.pobierz({ site: 'surgitome', start: wczoraj, token: 'dobry', postep: (n, r) => postep.push([n, r]) });
const d = w.dane;
ok(d.dni.length === 2 && d.dni[0] === wczoraj && d.dni[1] === dzis, 'dni od startu do dziś');
ok(JSON.stringify(d.odwiedziny) === '[3,4]', 'odwiedziny bez zdarzeń: ' + JSON.stringify(d.odwiedziny));
ok(JSON.stringify(d.zdarzenia['zabieg/dg/b1']) === '[0,2]', 'zdarzenie zabiegu dzień po dniu');
ok(JSON.stringify(d.zdarzenia['rola-wybor/student']) === '[1,0]', 'zdarzenie roli; dzień spoza zakresu pominięty');
ok(d.tytuly['zabieg/dg/b1'] === 'Resekcja dystalna — B-I' && !d.tytuly['/surgitome'], 'tytuły tylko dla zdarzeń');
ok(JSON.stringify(d.lacznie) === '[4,6]' && d.total === 10 && d.total_events === 3, 'suma ze zdarzeniami');
ok(Object.keys(d.listy).join() === '7,30,90,all' && d.listy['7'].locations.length === 2 && d.listy.all.toprefs[1].name === '(brak)', 'listy dla zakresów');
ok(w.zapytan === 26 && zapytania.every((z) => z.auth === 'Bearer dobry'), 'liczba zapytań i nagłówek klucza: ' + w.zapytan);
ok(postep.length === 26 && postep[25][0] === 26 && postep[25][1] === 26, 'postęp 1…26');
ok(zapytania[0].q.start.endsWith('T00:00:00Z') && /T\d\d:00:00Z$/.test(zapytania[0].q.end), 'start i koniec zaokrąglone do pełnej godziny');

for (const [p, oczek] of [[64, true], [65, true], [64 | 2, false], [64 | 4, false], [4, false], [64 | 8, false], [0, false]]) {
  perm = p;
  ok((await GC.uprawnienia('surgitome', 'dobry')).tylkoOdczyt === oczek, `uprawnienia ${p} → tylko odczyt: ${oczek}`);
}
let blad = null;
try { await GC.pobierz({ site: 'surgitome', start: wczoraj, token: 'zly' }); } catch (e) { blad = e; }
ok(blad && blad.status === 401 && /zły klucz/.test(blad.message), 'zły klucz → wyjątek 401');
console.log(bledy ? 'BŁĘDY: ' + bledy : 'gc: errors []');
process.exit(bledy ? 1 : 0);
