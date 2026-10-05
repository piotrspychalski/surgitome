// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
const {JSDOM}=require('jsdom'); const fs=require('fs');
const html=fs.readFileSync(require('path').join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'});  const w=dom.window;
w.matchMedia=(q)=>({matches:/max-width: 760px/.test(q),addEventListener(){}});
w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
const T=Object.assign({},require('three'));
let vps=[]; T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(x,y,ww,hh){vps.push([x,y,ww,hh])},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
w.THREE=T; w.eval(fs.readFileSync(require('path').join(require('path').dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8'));
const errs=[]; w.addEventListener('error',e=>errs.push(e.message||String(e.error)));
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
// układ: pole modelu 390x700, panel od y=300
w.Element.prototype.getBoundingClientRect=function(){ if(this.id==='viewport') return {left:0,top:0,right:390,bottom:700,width:390,height:700}; if(this.id==='panel') return {left:8,top:300,right:382,bottom:692,width:374,height:392}; return {left:0,top:0,right:0,bottom:0,width:0,height:0}; };
w.eval(sc[0]); w.eval(sc[1]);
const $=id=>w.document.getElementById(id); const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{ await sleep(300);
  $('panel').style.position='absolute';
  const lastVP=()=>vps[vps.length-1]; 
  console.log('zamknięty:',lastVP());
  $('fInfo').click(); await sleep(150); console.log('w trakcie otwierania:',lastVP()); await sleep(700); console.log('otwarty (model w wolnym miejscu u góry):',lastVP());
  $('panelClose').click(); await sleep(150); console.log('w trakcie zamykania:',lastVP()); await sleep(800); console.log('zamknięty:',lastVP());
  console.log('errors',errs); process.exit(0); })();
