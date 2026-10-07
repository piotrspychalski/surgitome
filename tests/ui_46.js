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
  ok(g(L.mesoRight('rh'))==='203* 202* 201* 213* 212* 211* 223 222-rt* 221* 222-lt 221','hemikolektomia prawa: złe grupy: '+g(L.mesoRight('rh')));
  ok(/253\* 252\*/.test(g(L.mesoLeft('ar')))&&/251\*/.test(g(L.mesoLeft('ar'))),'resekcja odbytnicy: 253/252/251 nie z preparatem: '+g(L.mesoLeft('ar')));
  ok(/^253 252 /.test(g(L.mesoLeft('lh'))),'hemikolektomia lewa: 253/252 powinny zostać: '+g(L.mesoLeft('lh')));
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
  $('optMeso').click(); await sleep(200); ok(nodeLbl().length===0,'grupy widoczne przy wyłączonej krezce');
  $('optMeso').click(); await sleep(200);
  // zabieg bez krezki: przełącznik ukryty
  [...$('tabs').children].find(b=>b.textContent.startsWith('Ileostomia')).click(); await sleep(400); ok($('togNodes').hidden,'przełącznik grup przy zabiegu bez krezki');
  // jelito cienkie (nowy model): grupy opisowe; wybór zakresu: JSCCR
  [...$('cats').children].find(b=>b.textContent==='Jelito cienkie').click(); await sleep(400);
  [...$('tabs').children].find(b=>b.textContent.startsWith('Resekcja jelita cienkiego (nowy model)')).click(); await sleep(500);
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
