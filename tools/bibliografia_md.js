// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// docs/BIBLIOGRAFIA.md z danych src/core/12-bibliografia.js (ANAT.BIB): zabiegi w kolejności nawigacji, przy każdej pozycji rola i uzasadnienie
// Użycie: node build.js && node tools/bibliografia_md.js
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..');
globalThis.THREE = require('three');
require(path.join(R, 'dist/core.js'));
const A = globalThis.ANAT, B = A.BIB;
const ROLES = ['original', 'guideline', 'anatomy', 'technique', 'endoscopy', 'outcomes', 'registry'];
const ROLE_PL = { original: 'opis oryginalny', guideline: 'wytyczne / konsensus', anatomy: 'anatomia', technique: 'technika', endoscopy: 'endoskopia', outcomes: 'wyniki badań', registry: 'rejestr badania' };
const sortRefs = l => l.slice().sort((a, b) => (ROLES.indexOf(a[1]) - ROLES.indexOf(b[1])) || (B.R[a[0]].y - B.R[b[0]].y));
const link = r => [r.pmid && `[PubMed ${r.pmid}](https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/)`, r.doi && `[doi:${r.doi}](https://doi.org/${r.doi})`, !r.pmid && !r.doi && r.url && `[online](${r.url})`].filter(Boolean).join(' · ');
const keys = Object.keys(B.R), nPm = keys.filter(k => B.R[k].pmid).length;
const catName = {}; A.CATS.forEach(c => catName[c.id] = c.name);
const intro = fs.existsSync(path.join(R, 'docs/BIBLIOGRAFIA.md')) ? (fs.readFileSync(path.join(R, 'docs/BIBLIOGRAFIA.md'), 'utf8').match(/<!-- autor -->[\s\S]*?<!-- \/autor -->/) || [''])[0] : '';

let md = `# SURGITOME — piśmiennictwo do zabiegów

Źródła pokazywane w aplikacji: panel „Opis” → „Piśmiennictwo” (bieżący zabieg i wariant) oraz „Źródła” w stopce panelu (całość). Plik powstaje z \`src/core/12-bibliografia.js\` poleceniem \`node tools/bibliografia_md.js\`.

- **Pozycji:** ${keys.length}, w tym ${nPm} z PMID i ${keys.length - nPm} spoza PubMed. Styl Vancouver (NLM): do 6 autorów, potem „et al.”; skróty czasopism wg katalogu NLM; rok wydania drukowanego.
- **Dobór:** dla każdego zabiegu wyszukiwanie w PubMed (konektor PubMed): opis oryginalny, aktualne wytyczne lub konsensus, źródła liczb i szczegółów pokazanych w modelu, endoskopia po zabiegu, kluczowe RCT i metaanalizy. Włączono wszystkie źródła z audytu medycznego z 5.10.2026.
- **Weryfikacja:** każdy opis złożono z rekordu PubMed (E-utilities efetch), więc PMID, tytuł i DOI pochodzą z jednego rekordu. Pierwszy autor i rok podane przy wyborze porównano z rekordem dla wszystkich PMID. Pozycje spoza PubMed (rejestry ClinicalTrials.gov, CORDIS, FDA 510(k), Brisbane 2000, Radiopaedia, mp.pl, poradniki) sprawdzono w źródle; data dostępu: 2026-10-05.
- **Role:** ${ROLES.map(r => `*${ROLE_PL[r]}*`).join(', ')}. W aplikacji pozycje idą w tej kolejności, a w obrębie roli chronologicznie. Pozycje wariantu dochodzą do pozycji wspólnych dla zabiegu.
- **Uzasadnia:** co w modelu dane źródło uzasadnia. Uzasadnienie służy do przeglądu i w aplikacji się nie wyświetla.

${intro}
`;
let n = 0, lastCat = null;
function section(title, ids) {
  let out = '';
  ids.forEach((id, i) => {
    const l = sortRefs(B.P[id] || []); if (!l.length) return;
    if (i) out += `\n*Tylko wariant \`${id}\`:*\n\n`;
    l.forEach(([k, role, claim]) => { n++; const r = B.R[k]; out += `${n}. ${r.c} ${link(r)}  \n   *${ROLE_PL[role]}*${claim ? ' — ' + claim : ''}\n`; });
  });
  return out ? `### ${title}\n\n${out}\n` : '';
}
A.PROCS.forEach(P => {
  if (P.cat !== lastCat) { lastCat = P.cat; md += `## ${catName[P.cat] || P.cat}\n\n`; }
  md += section(`${P.title || P.short} (\`${P.id}\`)`, [P.id].concat(P.variants.filter(v => v.id !== P.id).map(v => v.id)));
});
(B.EXTRA || []).forEach(e => { md += `## ${e.name}\n\n` + section(e.name, [e.id]); });
fs.writeFileSync(path.join(R, 'docs/BIBLIOGRAFIA.md'), md);
console.log('docs/BIBLIOGRAFIA.md — pozycji:', keys.length, '| odwołań przy zabiegach:', n);
