// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Składanie SURGITOME: src/core/* → dist/core.js, src/app/* → dist/app.js, wstawienie do src/shell.html → dist/surgitome.html
// Użycie: node build.js   (bez zależności; wynik to jeden samodzielny plik HTML)
const fs = require('fs'), path = require('path');
const R = __dirname, rd = d => fs.readdirSync(path.join(R, d)).filter(f => f.endsWith('.js')).sort().map(f => fs.readFileSync(path.join(R, d, f), 'utf8')).join('');
const core = rd('src/core'), app = rd('src/app'), shell = fs.readFileSync(path.join(R, 'src/shell.html'), 'utf8');
fs.mkdirSync(path.join(R, 'dist'), { recursive: true });
fs.writeFileSync(path.join(R, 'dist/core.js'), core);
fs.writeFileSync(path.join(R, 'dist/app.js'), app);
const html = shell.replace('/*CORE*/', () => core).replace('/*APP*/', () => app);
fs.writeFileSync(path.join(R, 'dist/surgitome.html'), html);
console.log('dist/surgitome.html', Math.round(html.length / 1024) + ' KB');
