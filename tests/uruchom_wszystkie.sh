#!/usr/bin/env bash
# Pełny zestaw testów SURGITOME. Wymaga: node >= 18, npm install (three@0.147.0, jsdom).
# Trasy endoskopowe i audyt kadrów trwają kilka–kilkanaście minut.
set -u; cd "$(dirname "$0")/.."
node build.js || exit 1
echo "== 1. Tłumaczenia";              node tests/i18n.js
echo "== 2. Kolizje w trakcie animacji"; node tests/kolizje_animacji.js | tail -1
echo "== 3. Trasy endoskopowe (puste promienie / przejścia przez ścianę)"
node tests/endo_trasy.js "" q | grep routePost | awk '{v=0;c=0;for(i=1;i<=NF;i++){if($i=="voids"){split($(i+1),a,"/");v+=a[1]} if($i=="cross")c+=$(i+1)} if(v||c){bad++; print "  PROBLEM:",$0}} END{print "  tras:",NR,"| z problemem:",bad+0}'
echo "== 4. Audyt wszystkich kadrów";  for c in "desktop pl" "desktop en" "mobile en"; do node tests/ui_audyt.js $c | tail -2; done
echo "== 5. Funkcje interfejsu";       for t in tests/ui_[0-9]*.js; do printf "%s: " "$t"; node "$t" 2>&1 | tail -1; done
