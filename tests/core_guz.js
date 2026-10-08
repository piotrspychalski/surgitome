// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Warianty z liniami cięcia dopasowanymi do guza (v.adapt) w kilku położeniach guza zamiast listy zabiegów — dla testów kolizji i tras:
// CORE=$PWD/tests/core_guz.js node tests/kolizje_animacji.js  ·  CORE=$PWD/tests/core_guz.js node tests/endo_trasy.js "" q
require('../dist/core.js');
const T = { 'rh-ext': [0.3, 0.36, 0.39], sf: [0.36, 0.42, 0.5, 0.58], sig: [0.69, 0.75, 0.82, 0.86], 'ar-side': [0.88, 0.9], 'ar-center': [0.93, 0.945], 'ar-racket': [0.945], 'ar-ular': [0.955, 0.965, 0.974] };
const add = [];
for (const p of ANAT.PROCS) for (const v of p.variants) if (v.adapt) for (const t of T[v.id] || []) { const a = v.adapt(t); if (a) { a.id = v.id + '@' + t; add.push({ cat: p.cat, id: a.id, short: a.id, variants: [a] }); } }
ANAT.PROCS.length = 0; ANAT.PROCS.push(...add);
console.error('wariantów dopasowanych:', add.length);
