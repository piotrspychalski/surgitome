// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Jak cytować: link w stopce panelu i w menu na telefonie, okienko z cytowaniem (DOI koncepcyjny z Zenodo), kopiowanie, klawisze, Esc, EN
const {JSDOM}=require('jsdom'); const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'});  const w=dom.window;
w.localStorage.setItem('surgitome-intro','1'); w.localStorage.setItem('surgitome-tour','1');
w.matchMedia=()=>({matches:false,addEventListener(){}});
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
w.THREE=T; w.eval(fs.readFileSync(path.join(path.dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8'));
const errs=[]; w.addEventListener('error',e=>errs.push(e.message||String(e.error)));
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); w.eval(sc[0]); w.eval(sc[1]);
const $=id=>w.document.getElementById(id), sleep=ms=>new Promise(r=>setTimeout(r,ms)), fails=[];
function ok(c,m){ if(!c) fails.push(m); }
const pick=(cat,tab)=>{ [...$('cats').children].find(b=>b.textContent===cat).click(); [...$('tabs').children].find(b=>b.textContent.startsWith(tab)).click(); };
(async()=>{ await sleep(300);
  const b=$('fLn'); ok(b&&b.closest('#mFloat')&&b.textContent==='LNs','brak przycisku „LNs” w grupie przycisków przy ⓘ i etykietach');
  // zabieg z grupami węzłów: przycisk widoczny, domyślnie wyłączony (jak przełącznik w panelu)
  pick('Żołądek','Resekcja dystalna'); await sleep(400);
  ok(!b.hidden&&!$('togNodes').hidden,'resekcja dystalna: przycisk lub przełącznik węzłów ukryty');
  ok($('viewport').classList.contains('lnon'),'brak klasy lnon (przycisk uwag na telefonie przesunięty pod „LNs”)');
  ok(b.getAttribute('aria-pressed')==='false'&&!w.__sgTest.state().nodes&&!$('optNodes').checked,'węzły powinny być domyślnie wyłączone');
  b.click(); await sleep(100);
  ok(w.__sgTest.state().nodes&&$('optNodes').checked&&b.getAttribute('aria-pressed')==='true'&&w.localStorage.getItem('surgitome-wezly')==='1','„LNs” nie włącza węzłów (stan, przełącznik w panelu, zapis)');
  ok(w.__sgTest.state().meso,'włączenie węzłów powinno pokazać krezkę');
  ok(!$('nodeList').hidden,'lista grup węzłów w panelu niewidoczna po włączeniu');
  // przełącznik w panelu aktualizuje przycisk
  $('optNodes').click(); await sleep(100);
  ok(!w.__sgTest.state().nodes&&b.getAttribute('aria-pressed')==='false'&&w.localStorage.getItem('surgitome-wezly')==='0','przełącznik w panelu nie aktualizuje przycisku „LNs”');
  b.click(); await sleep(100); ok(w.__sgTest.state().nodes,'ponowne włączenie przyciskiem');
  // zabieg bez grup węzłów: przycisk ukryty
  pick('Jelito grube','Ileostomia'); await sleep(400);
  ok(b.hidden&&$('togNodes').hidden,'ileostomia: przycisk „LNs” widoczny bez grup węzłów');
  ok(!$('viewport').classList.contains('lnon'),'ileostomia: klasa lnon zostaje bez przycisku „LNs”');
  pick('Trzustka i drogi żółciowe','Whipple'); await sleep(400); ok(!b.hidden&&b.getAttribute('aria-pressed')==='true','Whipple: przycisk ukryty albo stan nie zachowany');
  // EN
  $('btnLang').click(); await sleep(100);
  ok(b.getAttribute('aria-label')==='Lymph node groups'&&b.title==='Lymph node groups'&&b.textContent==='LNs','opis przycisku nieprzetłumaczony: '+b.getAttribute('aria-label'));
  console.log('errors',JSON.stringify(errs.concat(fails)));
  process.exit(0);
})();
