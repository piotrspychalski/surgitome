// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Samouczek: start po informacji startowej (raz na urządzenie, localStorage), 6 kroków z wycięciami w przyciemnieniu, klawisze, podświetlony przycisk do kliknięcia (język), EN, powtórka z opisu i z menu telefonu
const {JSDOM}=require('jsdom'); const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
const orbit=fs.readFileSync(path.join(path.dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8');
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); const errs=[], fails=[], sleep=ms=>new Promise(r=>setTimeout(r,ms));
function ok(c,m){ if(!c) fails.push(m); }
// położenia elementów (JSDOM nie liczy układu): [x, y, szerokość, wysokość] w oknie 1024×768
const RD={btnLang:[930,12,78,32],q:[300,10,400,36],subbar:[0,56,1024,80],btnPrev:[16,690,92,38],strip:[118,690,700,38],btnNext:[826,690,92,38],fLbl:[970,206,42,42],fInfo:[970,110,42,42],viewport:[0,136,1024,540],btnPlay:[16,736,90,30]};
const RM={fLang:[970,160,42,42],mq:[24,330,976,40],mMenuBtn:[60,8,950,40],mDock:[0,700,1024,60],fLbl:[970,210,42,42],fInfo:[970,110,42,42],viewport:[0,56,1024,640]};
function boot(keys,mobile){ const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'});  const w=dom.window;
  for(const k in keys) w.localStorage.setItem(k,keys[k]);
  w.matchMedia=q=>({matches:!!mobile&&/max-width/.test(q),addEventListener(){}});
  w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
  const R=mobile?RM:RD;
  w.Element.prototype.getBoundingClientRect=function(){ const k=this.id||(this.classList.contains('subbar')?'subbar':''), r=R[k];
    if(!r||this.closest('[hidden]')) return {left:0,top:0,right:0,bottom:0,width:0,height:0,x:0,y:0};
    return {left:r[0],top:r[1],width:r[2],height:r[3],right:r[0]+r[2],bottom:r[1]+r[3],x:r[0],y:r[1]}; };
  w.THREE=T; w.eval(orbit); w.addEventListener('error',e=>errs.push(e.message||String(e.error))); w.eval(sc[0]); w.eval(sc[1]);
  const card=w.document.getElementById('tourCard'); Object.defineProperty(card,'offsetWidth',{get:()=>360}); Object.defineProperty(card,'offsetHeight',{get:()=>210});
  return w; }
const key=(w,k)=>w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:k,bubbles:true}));
const holes=w=>[...w.document.querySelectorAll('#tourRings .tring')].map(r=>['left','top','width','height'].map(a=>parseFloat(r.style[a])));
const overlap=(a,b)=>a[0]<b[0]+b[2]&&b[0]<a[0]+a[2]&&a[1]<b[1]+b[3]&&b[1]<a[1]+a[3];
(async()=>{
  // 1. pierwsze wejście: najpierw informacja, samouczek dopiero po „Rozumiem”
  let w=boot({}); const $=id=>w.document.getElementById(id); await sleep(1000);
  ok(!$('intro').hidden,'brak informacji startowej'); ok($('tour').hidden,'samouczek otwarty razem z informacją');
  $('introOk').click(); await sleep(500);
  ok(!$('tour').hidden,'samouczek nie wystartował po „Rozumiem”');
  ok($('tourTitle').textContent==='Język'&&$('tourNum').textContent==='Samouczek · 1 / 6','krok 1: '+$('tourTitle').textContent+' | '+$('tourNum').textContent);
  ok($('tourPrev').disabled,'„Wstecz” aktywne w kroku 1'); ok(w.document.activeElement===$('tourNext'),'fokus nie na „Dalej”');
  // 2. klawisze: strzałki przechodzą między krokami i nie zmieniają kadru pod spodem
  const cap0=$('capTitle').textContent; key(w,'ArrowRight'); await sleep(50);
  ok($('tourTitle').textContent==='Wyszukiwarka','→ nie przechodzi do kroku 2'); ok($('capTitle').textContent===cap0,'→ zmienia kadr pod samouczkiem');
  key(w,'ArrowLeft'); key(w,'l'); await sleep(50); ok($('tourTitle').textContent==='Język','← nie wraca'); ok(w.__sgTest.state().labels,'klawisz L działa pod samouczkiem');
  // 3. podświetlony przełącznik języka można kliknąć: samouczek przechodzi na EN i z powrotem
  ok(!$('tourLive').hidden,'brak klikalnego podświetlenia w kroku Język');
  $('tourLive').click(); await sleep(50);
  ok($('tourTitle').textContent==='Language'&&$('tourNext').textContent==='Next'&&w.document.documentElement.lang==='en','EN: '+$('tourTitle').textContent+' | '+$('tourNext').textContent);
  ok($('btnTour').textContent==='Show tutorial','przycisk powtórki bez tłumaczenia: '+$('btnTour').textContent);
  $('tourLive').click(); await sleep(50); ok($('tourTitle').textContent==='Język','powrót do PL');
  // 4. wszystkie kroki: tytuły, liczba wycięć, karta nie zasłania pojedynczego wycięcia
  const titles=[], counts=[]; $('ctxRow').hidden=false; $('btnPlay').hidden=false; // kadr z animacją: drugie wycięcie na „Pauza”
  for(let i=0;i<6;i++){ await sleep(650); titles.push($('tourTitle').textContent); const H=holes(w); counts.push(H.length);
    const c=$('tourCard'), cr=[parseFloat(c.style.left),parseFloat(c.style.top),360,210];
    if(H.length===1&&i<5) ok(!overlap(cr,H[0]),'karta zasłania podświetlenie w kroku '+(i+1)+': '+cr+' / '+H[0]);
    if(i<5) $('tourNext').click(); }
  console.log('kroki:',titles.join(' → '),'| wycięcia:',counts.join(','));
  ok(titles.join('|')==='Język|Wyszukiwarka|Nawigacja|Etykiety|Informacje|Animacje','kolejność kroków: '+titles.join('|'));
  ok(counts.join(',')==='1,1,2,1,1,2','liczba wycięć: '+counts.join(','));
  ok($('tourNext').textContent==='Gotowe','ostatni krok bez „Gotowe”');
  $('tourNext').click(); await sleep(50);
  ok($('tour').hidden,'„Gotowe” nie zamyka'); ok(w.localStorage.getItem('surgitome-tour')==='1','brak zapisu w localStorage');
  key(w,'ArrowRight'); await sleep(700); ok($('capTitle').textContent!==cap0,'→ nie działa po zamknięciu samouczka');
  // 5. informacja już potwierdzona wcześniej (stali użytkownicy): samouczek startuje sam; Esc pomija i zapisuje
  w=boot({'surgitome-intro':'1'}); await sleep(1000);
  ok(!w.document.getElementById('tour').hidden,'samouczek nie startuje po wcześniej potwierdzonej informacji');
  key(w,'Escape'); ok(w.document.getElementById('tour').hidden&&w.localStorage.getItem('surgitome-tour')==='1','Esc nie pomija / nie zapisuje');
  // 6. kolejne wejście: bez samouczka; powtórka z opisu zabiegu, „Pomiń”
  w=boot({'surgitome-intro':'1','surgitome-tour':'1'}); await sleep(1000); const $3=id=>w.document.getElementById(id);
  ok($3('tour').hidden,'samouczek pokazany ponownie');
  $3('fInfo').click(); $3('btnTour').click(); await sleep(50);
  ok(!$3('tour').hidden&&$3('tourTitle').textContent==='Język','powtórka z opisu nie działa'); ok($3('panel').classList.contains('closed'),'opis nie zamknięty przy powtórce');
  $3('tourSkip').click(); ok($3('tour').hidden,'„Pomiń” nie zamyka');
  // 7. telefon: wyszukiwarka w otwartym menu ☰, nawigacja = menu + pasek kadrów; powtórka z menu
  w=boot({'surgitome-intro':'1'},true); await sleep(1000); const $4=id=>w.document.getElementById(id);
  ok(!$4('tour').hidden,'telefon: samouczek nie wystartował'); ok($4('tourHint').textContent==='Spróbuj: dotknij podświetlonego przycisku.','telefon: zła podpowiedź');
  $4('tourNext').click(); await sleep(120);
  ok(!$4('mMenu').hidden,'telefon: menu nie otwarte w kroku Wyszukiwarka'); ok(/☰/.test($4('tourText').textContent),'telefon: opis bez menu ☰');
  ok(holes(w).length===1&&holes(w)[0][1]<340,'telefon: wycięcie nie na polu wyszukiwania: '+JSON.stringify(holes(w)));
  $4('tourNext').click(); await sleep(150);
  ok($4('mMenu').hidden,'telefon: menu nie zamknięte po kroku Wyszukiwarka'); ok(holes(w).length===2,'telefon: nawigacja — wycięcia '+holes(w).length);
  $4('tourPrev').click(); await sleep(50); ok(!$4('mMenu').hidden,'telefon: „Wstecz” nie otwiera menu');
  key(w,'Escape'); ok($4('mMenu').hidden&&$4('tour').hidden,'telefon: Esc nie zamyka menu i samouczka');
  $4('mMenuBtn').click(); const chip=[...w.document.querySelectorAll('#mMenuBody .mchip')].find(b=>b.textContent==='Samouczek');
  ok(chip,'telefon: brak „Samouczek” w menu'); if(chip){ chip.click(); await sleep(50); ok(!$4('tour').hidden&&$4('mMenu').hidden,'telefon: powtórka z menu'); }
  console.log('errors',JSON.stringify(errs.concat(fails))); process.exit(0);
})();
