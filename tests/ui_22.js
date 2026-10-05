// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
const {JSDOM}=require('jsdom'); const fs=require('fs');
const html=fs.readFileSync(require('path').join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'});  const w=dom.window;
w.matchMedia=(q)=>({matches:/max-width: 760px/.test(q),addEventListener(){}});
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
w.THREE=T; w.eval(fs.readFileSync(require('path').join(require('path').dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8'));
const errs=[]; w.addEventListener('error',e=>errs.push(e.message||String(e.error)));
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); w.eval(sc[0]); w.eval(sc[1]);
const $=id=>w.document.getElementById(id); const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{ await sleep(300);
  console.log('język:',$('fLang').textContent,'| etykiety:',$('fLbl').getAttribute('aria-pressed'));
  $('fInfo').click(); console.log('opis otwarty:',!$('panel').classList.contains('closed')); $('fInfo').click(); console.log('opis zamknięty:',$('panel').classList.contains('closed'));
  $('fLang').click(); await sleep(50); console.log('po zmianie języka:',$('fLang').textContent,'|',$('mProcName').textContent,'| aria:',$('fInfo').getAttribute('aria-label'));
  $('fLbl').click(); console.log('etykiety po stuknięciu:',$('fLbl').getAttribute('aria-pressed'));
  $('mMenuBtn').click(); console.log('ustawienia w menu:',[...$('mMenuBody').querySelectorAll('.mrow')].pop().textContent);
  console.log('errors',errs); process.exit(0); })();
