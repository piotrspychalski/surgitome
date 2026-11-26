// SURGITOME — panel autora. Zgodność modułu STUDY (src/study.js) z analizą w Pythonie (tools/analiza_ankiety.py w surgitome-study):
// te same pliki (tests/dane — dane wymyślone), wyniki Pythona w tests/dane/oczekiwane.json (tworzy je tests/fixture_study.py).
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const S = require('../src/study.js');
const D = new URL('./dane/', import.meta.url);
const read = (n) => readFileSync(new URL(n, D), 'utf8');
const ocz = JSON.parse(read('oczekiwane.json'));
const kody = JSON.parse(read('kody_test.json'));
const pliki = ['ankieta_A_stare.json', 'ankieta_A.json', 'ankieta_web3forms.csv'].map((name) => ({ name, text: read(name) }));
const OPCJE = { domyslnie: {}, grupa_wszyscy: { grupa: 'wszyscy' }, dostep_wszyscy: { dostep: 'wszyscy' }, pomin_C: { pomin: 'cccccc' } };

let bledy = 0;
const blisko = (a, b) => (a === null || a === undefined) ? (b === null || b === undefined) : (typeof a === 'number' ? Math.abs(a - b) < 1e-9 : a === b);
function rowne(nazwa, js, py) {
  const ok = Array.isArray(py) ? py.length === js.length && py.every((v, i) => blisko(js[i], v)) : blisko(js, py);
  if (!ok) { bledy++; console.log('RÓŻNICA', nazwa, 'JS =', JSON.stringify(js), 'Python =', JSON.stringify(py)); }
}
const opis = (d) => [d.n, d.srednia, d.sd, d.mediana, d.q1, d.q3];

for (const [wariant, o] of Object.entries(OPCJE)) {
  const py = ocz[wariant];
  const { meta, res } = await S.analizuj(pliki, Object.assign({ kody }, o));
  const w = (n) => wariant + ': ' + n;
  rowne(w('wczytane'), meta.loaded, py.meta.loaded);
  rowne(w('błędne kody'), meta.invalid.sort(), py.meta.invalid);
  rowne(w('pominięte'), meta.skipped.sort(), py.meta.skipped);
  rowne(w('zastąpione'), meta.superseded, py.meta.superseded);
  rowne(w('duplikaty'), meta.duplicates, py.meta.duplicates);
  rowne(w('przekodowane dziedziny'), meta.recoded, py.meta.recoded);
  rowne(w('grupa CVI'), res.n_group, py.n_group);
  rowne(w('chirurdzy z otwartego dostępu'), res.n_open_surgeons, py.n_open_surgeons);
  rowne(w('oceny zrozumiałości'), res.n_comprehension, py.n_comprehension);
  py.items.forEach((r, i) => {
    const j = res.items[i];
    rowne(w(r.id + ' id'), j.id, r.id);
    [['N', 'oceniajacych_N'], ['A', 'ocen_3_4'], ['icvi', 'I_CVI'], ['kappa', 'kappa'], ['kappa_ocena', 'kappa_ocena'], ['n1', 'n1'], ['n2', 'n2'], ['n3', 'n3'], ['n4', 'n4'],
      ['n_poza', 'n_poza_dziedzina'], ['n_niewybrane', 'n_niewybrane'], ['n_brak', 'n_brak_oceny'], ['srednia', 'srednia_ocena'], ['komentarzy', 'komentarzy']]
      .forEach(([a, b]) => rowne(w(r.id + ' ' + a), j[a], r[b]));
  });
  rowne(w('S-CVI'), res.scvi_all, py.scvi_all);
  rowne(w('S-CVI operacje'), res.scvi_ops, py.scvi_ops);
  rowne(w('S-CVI N≥3'), res.scvi_n3, py.scvi_n3);
  for (const rl of Object.keys(py.scvi_roles)) rowne(w('S-CVI rola ' + rl), res.scvi_roles[rl], py.scvi_roles[rl]);
  rowne(w('zrozumiałość'), res.comprehension_ave, py.comprehension_ave);
  rowne(w('SUS'), opis(res.sus), opis(py.sus));
  for (const rl of Object.keys(py.sus_roles)) rowne(w('SUS ' + rl), opis(res.sus_roles[rl]), opis(py.sus_roles[rl]));
  const P = res.participants.slice().sort((a, b) => (a.kod < b.kod ? -1 : 1));
  rowne(w('uczestnicy'), P.length, py.participants.length);
  py.participants.forEach((p, i) => ['kod', 'rola', 'dostep', 'w_grupie_cvi', 'SUS', 'wybranych', 'ocenionych'].forEach((k) => rowne(w(p.kod + ' ' + k), P[i] && P[i][k], p[k])));
  rowne(w('komentarze'), res.comments.length, py.comments);
}
// bez skrótów kodów (weryfikacja wyłączona): kod spoza listy ZZZZZZ wchodzi do analizy
const bez = await S.analizuj(pliki, {});
rowne('bez weryfikacji: uczestnicy', bez.res.participants.length, ocz.domyslnie.participants.length + 1);
console.log(bledy ? 'BŁĘDY: ' + bledy : 'study: zgodne z analizą w Pythonie (' + Object.keys(OPCJE).length + ' warianty) — errors []');
process.exit(bledy ? 1 : 0);
