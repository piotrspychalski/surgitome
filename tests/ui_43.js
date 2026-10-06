// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Kod QR na telefonie: przycisk „Udostępnij” w menu otwiera kod QR na pełnym ekranie (podpowiedź „Dotknij”), zamykanie, EN; komputer bez zmian
const {JSDOM}=require('jsdom'); const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'});  const w=dom.window;
w.localStorage.setItem('surgitome-intro','1'); w.localStorage.setItem('surgitome-tour','1');
let mq=null; w.matchMedia=()=>(mq={matches:true,addEventListener(t,f){mq.f=f;}});
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
w.THREE=T; w.eval(fs.readFileSync(path.join(path.dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8'));
const errs=[]; w.addEventListener('error',e=>errs.push(e.message||String(e.error)));
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); w.eval(sc[0]); w.eval(sc[1]);
const $=id=>w.document.getElementById(id), sleep=ms=>new Promise(r=>setTimeout(r,ms)), fails=[];
function ok(c,m){ if(!c) fails.push(m); }
const key=(k,el)=>(el||w.document).dispatchEvent(new w.KeyboardEvent('keydown',{key:k,bubbles:true}));
(async()=>{ await sleep(300);
  ok(w.document.documentElement.classList.contains('mobile'),'brak trybu mobilnego');
  ok($('qrOverlay').hidden,'kod QR otwarty na starcie');
  const b=$('mQrBtn'); ok(b&&b.closest('#mMenu .mhead'),'brak przycisku kodu QR w nagłówku menu na telefonie');
  ok(b.querySelector('use')&&b.querySelector('use').getAttribute('href')==='#qrSym','przycisk w menu bez miniatury kodu QR');
  $('mMenuBtn').click(); await sleep(20); ok(!$('mMenu').hidden,'menu się nie otwiera');
  b.click(); await sleep(20);
  ok($('mMenu').hidden&&!$('qrOverlay').hidden,'przycisk w menu nie otwiera kodu QR albo nie zamyka menu');
  const hint=()=>$('qrOverlay').querySelector('.qrhint').textContent;
  ok(hint()==='Dotknij, aby zamknąć','na telefonie podpowiedź powinna brzmieć „Dotknij, aby zamknąć”: '+hint());
  ok($('qrOverlay').querySelector('svg use').getAttribute('href')==='#qrSym','w okienku brak kodu QR');
  $('qrOverlay').querySelector('.qrbox').dispatchEvent(new w.MouseEvent('click',{bubbles:true})); await sleep(20);
  ok($('qrOverlay').hidden,'dotknięcie nie zamyka kodu QR');
  // klawisze przy otwartym kodzie: Esc zamyka, strzałki nie przełączają kadrów
  $('mMenuBtn').click(); await sleep(20); b.click(); await sleep(20);
  const fr0=w.__sgTest.state().frame; key('ArrowRight'); await sleep(30);
  ok(!$('qrOverlay').hidden&&w.__sgTest.state().frame===fr0,'strzałka przy kodzie QR przełącza kadr albo go zamyka');
  key('Escape'); await sleep(20); ok($('qrOverlay').hidden,'Esc nie zamyka kodu QR');
  // EN
  $('btnLang').click(); await sleep(50);
  ok(b.textContent==='Share','przycisk nieprzetłumaczony: '+b.textContent);
  b.click(); await sleep(20); ok(hint()==='Tap to close','podpowiedź nieprzetłumaczona: '+hint()); key('Escape'); await sleep(20);
  // komputer: miniatura w pasku jak dotąd, podpowiedź „Click”
  mq.matches=false; mq.f&&mq.f(); await sleep(20);
  $('qrBtn').click(); await sleep(20); ok(!$('qrOverlay').hidden&&hint()==='Click to close','na komputerze zła podpowiedź: '+hint());
  $('btnLang').click(); await sleep(50); ok(hint()==='Kliknij, aby zamknąć','po zmianie języka podpowiedź nie wraca do PL: '+hint());
  console.log('errors',JSON.stringify(errs.concat(fails)));
  process.exit(0);
})();
