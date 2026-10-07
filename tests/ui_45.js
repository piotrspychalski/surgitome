// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Resekcja jelita cienkiego (jeden model, zastąpił model bez krezki): krezka z arkadami, naczyniami prostymi i węzłami, klin V z podwiązaniami, krezka podąża za końcami jelita, zamknięcie szczeliny krezki, EN
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
  const A=w.ANAT, NEW=A.PROCS.find(p=>p.id==='sb');
  ok(A.PROCS.filter(p=>p.cat==='sb').length===1&&!A.PROCS.some(p=>p.id==='sbm'),'w kategorii „Jelito cienkie” powinien być jeden model (stary usunięty)');
  ok(NEW&&NEW.short==='Resekcja jelita cienkiego'&&NEW.variants.map(v=>v.id).join()==='sb-e2e,sb-iso,sb-anti','zły model lub warianty jelita cienkiego');
  for(const v of NEW.variants){
    const d=v.cutTools.filter(t=>t.type==='meso'); ok(d.length===1,v.id+': brak krezki'); if(!d.length) continue;
    const m=d[0], V=m.vessels, id=v.id;
    ok(v.anastTools.length===({'sb-e2e':1,'sb-iso':2,'sb-anti':2})[id]&&v.anastText,id+': narzędzia lub opis zespolenia');
    ok(m.sag===0&&m.morph&&m.morph[0]===3,id+': krezka nie podąża za jelitem (morph) lub ma zwis');
    ok(m.sheets.filter(s=>s.removed).length===1&&m.sheets.filter(s=>!s.removed&&s.post).length>=2,id+': zły podział arkuszy (klin / pozostająca z położeniem po zespoleniu)');
    ok(['sma','smv'].every(k=>V.some(x=>x.id===k&&!x.removed&&x.tie==null)),id+': SMA/SMV usuwane lub podwiązane');
    const ties=V.filter(x=>x.tie!=null); ok(ties.length===3&&ties.some(x=>x.name==='Gałąź zaopatrująca odcinek')&&ties.filter(x=>/^arc0/.test(x.id)).length===2,id+': podwiązania: gałąź zaopatrująca + arkada po obu stronach klina, jest: '+ties.map(x=>x.id));
    ok(V.some(x=>x.removed&&x.kind==='r')&&V.some(x=>!x.removed&&x.kind==='r'&&x.segs.length>100),id+': brak naczyń prostych (usuwanych i pozostających)');
    ok(V.some(x=>x.kind==='m'&&/^arc1/.test(x.id))&&V.some(x=>x.kind==='m'&&/^arc2/.test(x.id)),id+': brak kolejnych rzędów arkad w jelicie krętym');
    ok(V.some(x=>x.post)&&m.nodes.some(n=>n.post),id+': naczynia lub węzły przy końcach jelita nie przechodzą do położenia po zespoleniu');
    ok(m.nodes.filter(n=>n.removed).length>=2&&m.nodes.filter(n=>!n.removed).length>20,id+': węzły usuwane / pozostające');
    const cl=v.marks.find(k=>k.name==='Zamknięcie szczeliny krezki'), vl=v.marks.find(k=>k.name==='Linia przecięcia krezki');
    ok(cl&&cl.opacity[0][0]>=4,id+': brak szwu szczeliny krezki po zespoleniu'); ok(vl&&vl.noStapler,id+': linia przecięcia krezki nie może tworzyć staplera');
    ok(v.cutTools.filter(t=>t.type==='gia').length===2,id+': przecięcie jelita: 2 odpalenia staplera');
  }
  // interfejs: zakładka, warianty, przełącznik krezki, wszystkie kadry bez błędów
  [...$('cats').children].find(b=>b.textContent==='Jelito cienkie').click(); await sleep(400);
  ok([...$('tabs').children].filter(b=>b.textContent.startsWith('Resekcja jelita cienkiego')).length===1,'więcej niż jedna zakładka resekcji jelita cienkiego');
  [...$('tabs').children].find(b=>b.textContent.startsWith('Resekcja jelita cienkiego')).click(); await sleep(500);
  const vb=[...$('variants').querySelectorAll('.vbtn')]; ok(vb.length===3,'zła liczba wariantów');
  for(let i=0;i<3;i++){ vb[i].click(); await sleep(400); ok(!$('togMeso').hidden,'wariant '+i+': brak przełącznika krezki'); for(const s of [...$('strip').querySelectorAll('.step')].slice(0,5)){ s.click(); await sleep(150); } }
  vb[0].click(); await sleep(400);
  $('strip').querySelectorAll('.step')[1].click(); await sleep(300);
  $('btnLang').click(); await sleep(300);
  const lab=[...$('labels').children].map(e=>e.textContent).join(' | ');
  ok(/Small bowel mesentery/.test(lab)&&/Vascular arcades/.test(lab)&&/Mesenteric division line/.test(lab),'podpisy krezki nieprzetłumaczone: '+lab.slice(0,300));
  ok(!/Krezka jelita|Arkady naczyniowe|Korzeń krezki/.test(lab),'polskie podpisy w EN');
  ok([...$('tabs').children].some(b=>b.textContent.startsWith('Small bowel resection')),'nazwa zakładki nieprzetłumaczona');
  console.log('errors',JSON.stringify(errs.concat(fails)));
  process.exit(0);
})();
