// Kompletność tłumaczeń: każdy polski tekst z danych anatomicznych musi mieć odpowiednik w słowniku DICT (EN)
globalThis.THREE = require('three');
const path = require('path'), fs = require('fs');
require(path.join(__dirname, '../dist/core.js'));
const app = fs.readFileSync(path.join(__dirname, '../dist/app.js'), 'utf8');
const line = app.split('\n').find(l => l.trim().startsWith('var DICT = '));
const DICT = JSON.parse(line.slice(line.indexOf('{'), line.lastIndexOf('}') + 1));
const line2 = app.split('\n').find(l => l.trim().startsWith('var DICT_TRIALS = '));
if (line2) Object.assign(DICT, JSON.parse(line2.slice(line2.indexOf('{'), line2.lastIndexOf('}') + 1)));
const seen = new Set(), S = new Set(); // ANAT.BIB (piśmiennictwo: opisy bibliograficzne, DOI, uzasadnienia) się nie tłumaczy
(function walk(o, d) { if (d > 12 || o == null) return; if (typeof o === 'string') { S.add(o); return; } if (typeof o !== 'object' || seen.has(o) || o === ANAT.BIB) return; seen.add(o); if (o.isVector3 || o.isCurve) return; for (const k in o) walk(o[k], d + 1); })(ANAT, 0);
// polskie teksty bez znaków diakrytycznych (np. „przez zespolenie”, „Kikut esicy”) też muszą mieć tłumaczenie
const PL = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]|\b(i|oraz|pętla|jelito|kikut|widok|do|na|w|z)\b/, ID = /^[a-z][A-Za-z0-9_-]*$/;
const PL2 = /\b(przez|od|ok|bez|za|przy|nad|pod|typowo|kikut|zespolenie|otwarcie|przewodu|dwunastnica|brodawka|esicy|poprzecznica|jelito|pętla|widok|oraz)\b/i;
const miss = [...S].filter(x => (PL.test(x) || PL2.test(x)) && !ID.test(x) && !(x in DICT));
console.log('Teksty w danych:', S.size, '| w słowniku EN:', Object.keys(DICT).length, '| brak tłumaczenia:', miss.length);
miss.forEach(m => console.log(' -', m));
process.exitCode = miss.length ? 1 : 0;
