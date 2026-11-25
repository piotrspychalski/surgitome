// SURGITOME — panel autora. Test szyfrowania: dobre hasło odszyfrowuje, złe — nie; zaszyfrowany tekst nie zawiera danych jawnie.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const S = require('../src/szyfr.js');
let bledy = 0;
const ok = (warunek, opis) => { if (!warunek) { bledy++; console.log('BŁĄD:', opis); } };
const dane = { dni: ['2026-11-25'], zdarzenia: { 'rola-wybor/student': [3] }, tekst: 'zażółć gęślą jaźń' };
const k = await S.klucz('poprawne-haslo-testowe');
const p = await S.zaszyfruj(dane, k);
ok(p.iter === 600000 && p.sol === S.SOL && p.iv && p.dane, 'paczka ma iter, sól, iv i dane');
ok(!JSON.stringify(p).includes('rola-wybor') && !JSON.stringify(p).includes('student'), 'w paczce nie ma jawnych danych');
ok(JSON.stringify(await S.odszyfruj(p, await S.klucz('poprawne-haslo-testowe', p.iter, p.sol))) === JSON.stringify(dane), 'dobre hasło odszyfrowuje');
let odrzucone = false;
try { await S.odszyfruj(p, await S.klucz('zle-haslo-testowe!', p.iter, p.sol)); } catch (e) { odrzucone = true; }
ok(odrzucone, 'złe hasło jest odrzucane');
const p2 = await S.zaszyfruj(dane, k);
ok(p2.iv !== p.iv && p2.dane !== p.dane, 'każda paczka ma inny wektor IV');
const zmieniona = Object.assign({}, p, { dane: p.dane.slice(0, -8) + (p.dane.slice(-8, -7) === 'A' ? 'B' : 'A') + p.dane.slice(-7) });
let wykryte = false;
try { await S.odszyfruj(zmieniona, k); } catch (e) { wykryte = true; }
ok(wykryte, 'zmieniona paczka jest odrzucana (uwierzytelnienie AES-GCM)');
console.log(bledy ? 'BŁĘDY: ' + bledy : 'szyfr: errors []');
process.exit(bledy ? 1 : 0);
