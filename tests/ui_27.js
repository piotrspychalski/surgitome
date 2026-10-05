// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
const {JSDOM}=require('jsdom'); const fs=require('fs');
const html=fs.readFileSync(require('path').join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'});  const w=dom.window;
const MOB=process.argv[2]==='mobile'; w.matchMedia=()=>({matches:MOB,addEventListener(){}});
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
w.THREE=T; w.eval(fs.readFileSync(require('path').join(require('path').dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8'));
const errs=[]; w.addEventListener('error',e=>errs.push(e.message||String(e.error)));
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); w.eval(sc[0]); w.eval(sc[1]);
const $=id=>w.document.getElementById(id), sleep=ms=>new Promise(r=>setTimeout(r,ms));
function type(el,v){ el.value=v; el.dispatchEvent(new w.Event('input')); }
function key(el,k){ el.dispatchEvent(new w.KeyboardEvent('keydown',{key:k,bubbles:true})); }
(async()=>{ await sleep(400);
  const cats=[...$('cats').children].map(b=>b.textContent); console.log('kategorie:',cats.join(' | '));
  const inp=MOB?$('mq'):$('q'), box=MOB?$('mqres'):$('qres');
  if(MOB){ $('mMenuBtn').click(); await sleep(100); }
  for(const q of ['izoperystaltyczne','feea lewostronna','whipple pg','zbiornik','scopinaro','frey','dwulufowa dolna','hartmann','pouch','xyzzy']){
    type(inp,q); await sleep(30);
    console.log(q.padEnd(12),'→',[...box.querySelectorAll('.qitem b')].slice(0,3).map(b=>b.textContent).join(' ; ')||box.textContent);
  }
  type(inp,'lewa izoperystaltyczne'); await sleep(30); key(inp,'Enter'); await sleep(600);
  console.log('po Enter:',$('pTitle').textContent,'| panel wariantów:',MOB?'-':[...$('variants').querySelectorAll('.vbtn')].map(b=>b.textContent+(b.getAttribute('aria-pressed')==='true'?'*':'')).join(', '));
  w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'/',bubbles:true})); await sleep(20);
  console.log('"/" ustawia fokus:', w.document.activeElement===$('q'));
  type(inp,'dwulufowa dolna'); await sleep(30); key(inp,'ArrowDown'); key(inp,'Enter'); await sleep(500); console.log('strzałka+Enter:',$('pTitle').textContent);
  console.log('errors',errs); process.exit(0);
})();
