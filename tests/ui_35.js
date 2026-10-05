// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Wątroba: kategoria i zakładka, dwa kadry (anatomia, segmenty), suwak rozsunięcia, wyróżnianie segmentu i układu naczyń, przełącznik miąższu, EN
const {JSDOM}=require('jsdom'); const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
const orbit=fs.readFileSync(path.join(path.dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8');
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); const errs=[], fails=[], sleep=ms=>new Promise(r=>setTimeout(r,ms));
function ok(c,m){ if(!c) fails.push(m); }
const mobile=process.argv[2]==='mobile';
function boot(){ const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'});  const w=dom.window;
  w.localStorage.setItem('surgitome-intro','1'); w.localStorage.setItem('surgitome-tour','1');
  w.matchMedia=q=>({matches:mobile&&/max-width/.test(q),addEventListener(){}});
  w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
  w.THREE=T; w.eval(orbit); w.addEventListener('error',e=>errs.push(e.message||String(e.error))); w.eval(sc[0]); w.eval(sc[1]); return w; }
(async()=>{
  const w=boot(); await sleep(300); const $=id=>w.document.getElementById(id), D=w.document;
  // kategoria „Wątroba” w pasku, po trzustce i drogach żółciowych
  const cats=[...D.querySelectorAll('#cats .cat')].map(b=>b.textContent.replace('★','').trim());
  ok(cats.indexOf('Wątroba')===cats.indexOf('Trzustka i drogi żółciowe')+1,'kategoria Wątroba nie po HPB: '+cats.join('|'));
  [...D.querySelectorAll('#cats .cat')].find(b=>/Wątroba/.test(b.textContent)).click(); await sleep(600);
  ok($('pTitle').textContent==='Anatomia wątroby i segmenty Couinauda','zły tytuł panelu: '+$('pTitle').textContent);
  const steps=[...D.querySelectorAll('.srow1 .step')].map(b=>b.textContent); ok(steps.length===2,'liczba kadrów '+steps.length+': '+steps.join('|'));
  let L=w.__sgTest.liver(); ok(L&&L.segs.length===9,'brak 9 segmentów'); ok(L.segs.every(s=>!s[1]),'segmenty widoczne w kadrze Anatomia');
  ok($('ctxLiver').hidden,'suwak widoczny w kadrze Anatomia'); ok(!$('togLvGlass').hidden,'brak przełącznika miąższu');
  const leg0=[...D.querySelectorAll('#legend .leg')].map(b=>b.dataset.id).join(','); ok(leg0==='sys:pv,sys:ha,sys:bd,sys:hv','legenda układów: '+leg0);
  D.querySelector('#legend .leg[data-id="sys:pv"]').click(); await sleep(50); ok(w.__sgTest.state().highlight==='sys:pv','klik w legendzie nie wyróżnia PV');
  // kadr 2: segmenty, animacja rozsunięcia, suwak
  D.querySelectorAll('.srow1 .step')[1].click(); await sleep(5200);
  L=w.__sgTest.liver(); ok(L.segs.every(s=>s[1]),'segmenty niewidoczne w kadrze Segmenty'); ok(L.m>0.99,'animacja rozsunięcia nie doszła do końca: '+L.m);
  const far=L.segs.map(s=>Math.hypot(...s[3])); ok(far.every(d=>d>2.5),'segmenty nie rozsunięte: '+far.map(d=>d.toFixed(1)).join(','));
  ok(!$('ctxLiver').hidden&&!$('ctxRow').hidden,'brak suwaka w kadrze Segmenty');
  const sl=$('lvExplode'); sl.value=0; sl.dispatchEvent(new w.Event('input')); await sleep(50);
  L=w.__sgTest.liver(); ok(L.segs.every(s=>Math.hypot(...s[3])<1e-6),'suwak 0 nie zsuwa segmentów'); ok(!w.__sgTest.state().playing,'suwak nie zatrzymuje animacji');
  sl.value=500; sl.dispatchEvent(new w.Event('input')); await sleep(50); L=w.__sgTest.liver();
  ok(L.segs.every(s=>{const d=Math.hypot(...s[3]);return d>0.5&&d<2.5;}),'suwak 0,5: zła odległość');
  const leg1=[...D.querySelectorAll('#legend .leg')].length; ok(leg1===8,'legenda segmentów: '+leg1);
  // wyróżnienie segmentu: przycisk VIII; IV obejmuje IVa i IVb
  D.querySelector('#lvSegs button[data-s="8"]').click(); await sleep(50); L=w.__sgTest.liver();
  const op=Object.fromEntries(L.segs.map(s=>[s[0],s[2]]));
  ok(op['8']>0.8&&op['7']<0.2,'wyróżnienie VIII: '+JSON.stringify(op)); ok($('capTitle').textContent==='Segment VIII','podpis segmentu: '+$('capTitle').textContent);
  ok(D.querySelector('#lvSegs button[data-s="8"]').getAttribute('aria-pressed')==='true','przycisk VIII nie wciśnięty');
  D.querySelector('#lvSegs button[data-s="4a,4b"]').click(); await sleep(50); L=w.__sgTest.liver();
  const op4=Object.fromEntries(L.segs.map(s=>[s[0],s[2]])); ok(op4['4a']>0.8&&op4['4b']>0.8&&op4['8']<0.2,'wyróżnienie IV: '+JSON.stringify(op4));
  D.querySelector('#lvSegs button[data-s="4a,4b"]').click(); await sleep(50); ok(!w.__sgTest.state().highlight,'ponowny klik nie zdejmuje wyróżnienia');
  ok($('capTitle').textContent==='Segmenty Couinauda','podpis po zdjęciu wyróżnienia: '+$('capTitle').textContent);
  // przełącznik miąższu: zapis w localStorage
  $('optLvGlass').click(); await sleep(30); ok(w.localStorage.getItem('surgitome-lv-glass')==='0','stan miąższu nie zapisany');
  L=w.__sgTest.liver(); ok(L.segs.every(s=>s[2]===1),'miąższ nieprzezroczysty: krycie '+L.segs.map(s=>s[2]).join(','));
  // EN: podpisy, legenda i etykiety bez polskich znaków
  D.querySelector('#lvSegs button[data-s="1"]').click(); await sleep(30);
  $('btnLang').click(); await sleep(100);
  const txt=[$('capTitle').textContent,$('capText').textContent,$('pTitle').textContent,$('pSub').textContent,...[...D.querySelectorAll('#pNotes li,#legend .leg,#labels .lbl b,#ctxLiver label,#cats .cat,.srow1 .step')].map(e=>e.textContent)].join(' | ');
  const pl=txt.match(/[^|]*[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ][^|]*/g); ok(!pl,'polskie teksty w EN: '+(pl||[]).slice(0,4).join(' / '));
  ok(/caudate/.test($('capText').textContent+$('capTitle').textContent),'brak opisu segmentu I po angielsku: '+$('capTitle').textContent);
  // „Dalej” po ostatnim kadrze: następny zabieg (poza wątrobą)
  $('btnNext').click(); await sleep(50); $('btnNext').click(); await sleep(700);
  ok(w.__sgTest.state().an!==undefined&&!(w.__sgTest.liver()),'po „Dalej” nadal model wątroby');
  console.log('kadry:',steps.join(' | '),'| kategorie:',cats.length,'| legenda:',leg0);
  console.log('errors',JSON.stringify(errs.concat(fails))); process.exit(0);
})();
