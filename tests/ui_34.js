// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Guz (hemikolektomia prawa): domyślnie na wstępnicy — usuwany z preparatem; zapisany na zstępnicy — zostaje; przełącznik w panelu; krezka: podwiązania zależnie od wariantu
const {JSDOM}=require('jsdom'); const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
const orbit=fs.readFileSync(path.join(path.dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8');
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); const errs=[], fails=[], sleep=ms=>new Promise(r=>setTimeout(r,ms));
function ok(c,m){ if(!c) fails.push(m); }
function boot(pos){ const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'});  const w=dom.window;
  w.localStorage.setItem('surgitome-intro','1'); w.localStorage.setItem('surgitome-tour','1'); if(pos) w.localStorage.setItem('surgitome-guz-pos',JSON.stringify(pos));
  w.matchMedia=()=>({matches:false,addEventListener(){}});
  w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
  w.THREE=T; w.eval(orbit); w.addEventListener('error',e=>errs.push(e.message||String(e.error))); w.eval(sc[0]); w.eval(sc[1]); return w; }
async function run(w, label){ const $=id=>w.document.getElementById(id), q=$('q');
  q.value='hemikolektomia prawa'; q.dispatchEvent(new w.Event('input')); q.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter'})); await sleep(600);
  const at0=w.__sgTest.tumour(); $('strip').querySelectorAll('.step')[4].click(); await sleep(300); $('btnNext').click(); await sleep(100);
  const at1=w.__sgTest.tumour(); console.log(label,'| start:',at0&&at0.map(x=>x.toFixed(1)).join(','),'| po zespoleniu:',at1?at1.map(x=>x.toFixed(1)).join(','):'niewidoczny', '| przełącznik:',!$('togGuz').hidden);
  return [at0,at1,$]; }
(async()=>{
  let w=boot(null); await sleep(300); let [a0,a1,$]=await run(w,'wstępnica');
  ok(a0&&a0[0]<-5,'domyślny guz nie na wstępnicy'); ok(!a1,'guz na wstępnicy nie znika z preparatem'); ok(!$('togGuz').hidden,'brak przełącznika guza');
  $('optGuz').click(); await sleep(50); $('strip').querySelectorAll('.step')[0].click(); await sleep(300);
  ok(!w.__sgTest.tumour(),'wyłączony guz nadal widoczny'); ok(w.localStorage.getItem('surgitome-guz')==='0','stan przełącznika nie zapisany');
  w=boot([8.9,1.0,0.4]); await sleep(300); [a0,a1,$]=await run(w,'zstępnica');
  ok(a0&&a0[0]>7,'zapisane położenie nie wczytane'); ok(a1&&a1[0]>7,'guz na zstępnicy zniknął po hemikolektomii prawej');
  // krezka: podwiązania
  const L=w.ANAT._lib; const rh=L.mesoRight('rh'), ex=L.mesoRight('ext'), tie=d=>d.vessels.filter(v=>v.tie!=null).map(v=>v.id).join(','), rem=d=>d.vessels.filter(v=>v.removed&&v.kind==='a').map(v=>v.id).join(',');
  ok(rh.vessels.filter(v=>v.fade).map(v=>v.id).join(',')==='sma,smv'&&!L.mesoRight('keep').vessels.some(v=>v.fade),'SMA/SMV: znikanie po resekcji tylko w ramieniu chirurgicznym');
  console.log('podwiązania — prawa:',tie(rh),'| usuwane:',rem(rh),'|| poszerzona:',tie(ex),'| usuwane:',rem(ex));
  ok(tie(rh)==='ic,rc,rbmc'&&rem(rh)==='ic,rc,rbmc','hemikolektomia prawa: złe podwiązania'); ok(tie(ex)==='ic,rc,mc'&&rem(ex)==='ic,rc,mc,rbmc,lbmc','poszerzona: złe podwiązania');
  console.log('errors',JSON.stringify(errs.concat(fails))); process.exit(0);
})();
