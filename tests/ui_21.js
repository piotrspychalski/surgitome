// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
const {JSDOM}=require('jsdom'); const fs=require('fs');
const html=fs.readFileSync(require('path').join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'});  const w=dom.window;
w.matchMedia=(q)=>({matches:/max-width: 760px/.test(q),addEventListener(){}});
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
w.THREE=T; w.HTMLElement.prototype.setPointerCapture=function(){}; w.HTMLElement.prototype.releasePointerCapture=function(){}; w.eval(fs.readFileSync(require('path').join(require('path').dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8'));
const errs=[]; w.addEventListener('error',e=>errs.push(e.message||String(e.error)));
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); w.eval(sc[0]); w.eval(sc[1]);
const $=id=>w.document.getElementById(id); const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const pd=(el)=>{ const e=new w.Event('pointerdown',{bubbles:true}); e.clientX=10; e.clientY=10; el.dispatchEvent(e); };
(async()=>{ await sleep(300);
  $('panel').style.position='absolute'; // symulacja nakładki z reguły @media
  const open=()=>!$('panel').classList.contains('closed');
  $('btnPanel').click(); console.log('otwarty:',open());
  $('panelClose').click(); console.log('po ✕:',open());
  $('btnPanel').click(); pd($('pNotes')); console.log('stuknięcie w panel (zostaje):',open());
  const lbl=$('btnLabels').getAttribute('aria-pressed');
  pd($('c')); const e2=new w.Event('pointerup',{bubbles:true}); e2.clientX=10; e2.clientY=10; $('c').dispatchEvent(e2);
  console.log('stuknięcie w model (zamyka):',!open(),'| etykiety bez zmian:',lbl===$('btnLabels').getAttribute('aria-pressed'));
  console.log('errors',errs.filter(x=>!/setPointerCapture/.test(x))); process.exit(0); })();
