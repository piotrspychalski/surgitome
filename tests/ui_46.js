// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Grupy węzłów chłonnych: przełącznik w panelu „i” (domyślnie wyłączony), podpisy kodów stacji niezależne od etykiet; JSCCR w jelicie grubym, grupy opisowe w jelicie cienkim; EN
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
(async()=>{ await sleep(300);
  const A=w.ANAT, L=A._lib, nodeLbl=()=>[...$('labels').querySelectorAll('.lbl-node')].filter(e=>e.style.display!=='none').map(e=>e.querySelector('b').textContent);
  // dane: kody JSCCR w hemikolektomii prawej i resekcjach lewostronnych
  const g=d=>d.groups.list.map(x=>x.code+(x.removed?'*':'')).join(' ');
  ok(g(L.mesoRight('rh'))==='201* 202* 203* 211* 212* 213* 221* 221 222-rt* 222-lt 223','hemikolektomia prawa: złe grupy lub kolejność JSCCR: '+g(L.mesoRight('rh')));
  const has=(d,c)=>g(d).split(' ').includes(c);
  ok(['253*','252*','251*'].every(c=>has(L.mesoLeft('ar'),c)),'resekcja odbytnicy: 253/252/251 nie z preparatem: '+g(L.mesoLeft('ar')));
  ok(['253','252'].every(c=>has(L.mesoLeft('lh'),c)),'hemikolektomia lewa: 253/252 powinny zostać: '+g(L.mesoLeft('lh')));
  ok(L.mesoRight('rh').groups.system.startsWith('Numeracja JSCCR'),'brak nazwy systemu numeracji');
  ok(A.PROCS.filter(p=>!p.split).every(p=>p.variants.every(v=>!v.cutTools.some(t=>t.type==='meso')||v.cutTools.some(t=>t.type==='meso'&&t.groups&&t.groups.list.length))),'zabieg z krezką bez grup węzłów');
  // interfejs: domyślnie wyłączone, przełącznik widoczny przy krezce, podpisy niezależne od etykiet
  ok(!$('optNodes').checked&&w.localStorage.getItem('surgitome-wezly')===null,'grupy węzłów domyślnie włączone');
  [...$('cats').children].find(b=>b.textContent==='Jelito grube').click(); await sleep(400);
  [...$('tabs').children].find(b=>b.textContent.startsWith('Hemikolektomia prawa')).click(); await sleep(500);
  $('strip').querySelectorAll('.step')[1].click(); await sleep(400);
  ok(!$('togNodes').hidden&&!$('nodeSys').hidden&&/JSCCR/.test($('nodeSys').textContent),'brak przełącznika grup lub opisu numeracji');
  ok(nodeLbl().length===0,'podpisy grup widoczne przy wyłączonym przełączniku');
  $('optLabels').click(); await sleep(200); ok(!$('optLabels').checked,'etykiety nie wyłączone');
  $('optNodes').click(); await sleep(300);
  const on=nodeLbl(); ok(on.includes('203')&&on.includes('223')&&on.includes('222-rt')&&on.length>=9,'po włączeniu brak kodów grup: '+on);
  ok([...$('labels').querySelectorAll('.lbl:not(.lbl-node)')].every(e=>e.style.display==='none'),'zwykłe etykiety widoczne mimo wyłączenia');
  ok($('labels').style.display!=='none','warstwa etykiet ukryta mimo włączonych grup');
  ok(w.localStorage.getItem('surgitome-wezly')==='1','wybór nie zapisany');
  // lista grup w panelu (kod, nazwa; kolejność JSCCR; grupa rozdzielona — „częściowo z preparatem”), pigułki z linią odniesienia, nazwa po stuknięciu
  const rowsL=[...$('nodeList').querySelectorAll('li:not(.nkey)')];
  ok(!$('nodeList').hidden&&rowsL.length===10&&rowsL[0].querySelector('.nc').textContent==='201'&&rowsL[0].querySelector('.nc').classList.contains('r'),'lista grup w panelu: '+rowsL.map(r=>r.textContent).join(' / ').slice(0,200));
  ok(rowsL.find(r=>r.querySelector('.nc').textContent==='221').textContent.includes('częściowo z preparatem')&&!rowsL.find(r=>r.querySelector('.nc').textContent==='223').querySelector('.nc').classList.contains('r'),'lista: status grup 221 (częściowo) i 223 (zostaje)');
  const pill=[...$('labels').querySelectorAll('.lbl-node')].find(e=>e.textContent.startsWith('203'));
  ok(pill&&pill.querySelector('.ldr')&&pill.classList.contains('lbl-node-r'),'pigułka 203: brak linii odniesienia lub stylu „z preparatem”');
  pill.querySelector('span').dispatchEvent(new w.MouseEvent('click',{bubbles:true})); await sleep(50); ok(pill.classList.contains('open'),'stuknięcie nie pokazuje nazwy grupy');
  pill.querySelector('span').dispatchEvent(new w.MouseEvent('click',{bubbles:true})); await sleep(50); ok(!pill.classList.contains('open'),'ponowne stuknięcie nie chowa nazwy');
  $('optMeso').click(); await sleep(200); ok(nodeLbl().length===0,'grupy widoczne przy wyłączonej krezce');
  $('optMeso').click(); await sleep(200);
  $('optNodes').click(); await sleep(100); ok($('nodeList').hidden,'lista grup widoczna przy wyłączonym przełączniku'); $('optNodes').click(); await sleep(100);
  // zabieg bez krezki: przełącznik ukryty
  [...$('tabs').children].find(b=>b.textContent.startsWith('Ileostomia')).click(); await sleep(400); ok($('togNodes').hidden,'przełącznik grup przy zabiegu bez krezki');
  // jelito cienkie: grupy opisowe; wybór zakresu: JSCCR
  [...$('cats').children].find(b=>b.textContent==='Jelito cienkie').click(); await sleep(400);
  [...$('tabs').children].find(b=>b.textContent.startsWith('Resekcja jelita cienkiego')).click(); await sleep(500);
  $('strip').querySelectorAll('.step')[1].click(); await sleep(300);
  ok(nodeLbl().includes('Węzły centralne')&&/opisowe/.test($('nodeSys').textContent),'jelito cienkie: brak grup opisowych');
  [...$('cats').children].find(b=>b.textContent==='Jelito grube').click(); await sleep(400);
  [...$('tabs').children].find(b=>b.textContent.startsWith('Wybór zakresu')).click(); await sleep(500);
  ok(nodeLbl().includes('253')&&nodeLbl().includes('251'),'wybór zakresu: brak grup JSCCR: '+nodeLbl());
  // EN
  $('btnLang').click(); await sleep(300);
  const en=[...$('labels').querySelectorAll('.lbl-node')].filter(e=>e.style.display!=='none').map(e=>e.textContent).join(' | ');
  ok(/at the IMA origin \(main\)/.test(en)&&!/u odejścia/.test(en),'EN: nazwy grup nieprzetłumaczone: '+en.slice(0,200));
  ok(/Lymph node groups/.test($('togNodes').textContent)&&/JSCCR numbering/.test($('nodeSys').textContent),'EN: przełącznik lub opis numeracji nieprzetłumaczony');
  $('optLabels').click(); await sleep(200);
  console.log('errors',JSON.stringify(errs.concat(fails)));
  process.exit(0);
})();
