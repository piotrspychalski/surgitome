// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
const {JSDOM}=require('jsdom'); const fs=require('fs');
const html=fs.readFileSync(require('path').join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'});  const w=dom.window;
w.matchMedia=()=>({matches:false,addEventListener(){}});
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
w.THREE=T; w.eval(fs.readFileSync(require('path').join(require('path').dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8'));
const errs=[]; w.addEventListener('error',e=>errs.push(e.message||String(e.error)));
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); w.eval(sc[0]); w.eval(sc[1]);
const $=id=>w.document.getElementById(id); const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{ await sleep(300);
  [...$('cats').children].find(b=>b.textContent==='Żołądek').click(); await sleep(400);
  [...$('cats').children].find(b=>b.textContent==='Bariatria').click(); await sleep(400); [...$('tabs').children].find(b=>b.textContent.startsWith('Bypass Roux')).click(); await sleep(500);
  const st=$('strip').querySelectorAll('.step'); [...st].find(s=>s.textContent.includes('Endoskopia')).click(); await sleep(150);
  $('scrub').value='300'; $('scrub').dispatchEvent(new w.Event('input')); // za wcześnie: trasa jeszcze się buduje — nie może być błędu
  await sleep(900);
  $('speed').value='3'; $('speed').dispatchEvent(new w.Event('change'));
  $('scrub').value='450'; $('scrub').dispatchEvent(new w.Event('input')); $('scrub').dispatchEvent(new w.Event('change'));
  let t=0; while($('choice').hidden && t<15000){ await sleep(200); t+=200; }
  console.log('rozwidlenie:',!$('choice').hidden);
  $('choiceBtns').children[0].click(); const s0=+$('scrub').value;
  const samples=[]; for(let i=0;i<8;i++){ await sleep(500); samples.push(+$('scrub').value); }
  const d=[s0].concat(samples).map((v,i,arr)=>i?arr[i]-arr[i-1]:null).slice(1);
  console.log('przyrost pozycji co 0,5 s po wyborze:',d.join(', '));
  console.log('errors',errs); process.exit(0); })();
