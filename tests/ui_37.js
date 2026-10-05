// SURGITOME — (c) 2026 Piotr Spychalski, MD, PhD, Medical University of Gdańsk · piotr.spychalski@gumed.edu.pl · ORCID 0000-0001-7111-4660 · MIT License
// Przeszczepienie wątroby (OLTx): 4 warianty (klasyczna / piggyback × przewód–przewód / Roux-en-Y), 6 kadrów, zespolenia w stanie końcowym, EN
const {JSDOM}=require('jsdom'); const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../dist/surgitome.html'),'utf8').replace(/<script src[^>]*><\/script>/g,'');
const T=Object.assign({},require('three'));
T.WebGLRenderer=function(){return {clearDepth(){},setPixelRatio(){},setSize(){},capabilities:{getMaxAnisotropy:()=>8},setScissorTest(){},setViewport(){},setClearColor(){},clear(){},render(){},setScissor(){},getPixelRatio:()=>1}};
const orbit=fs.readFileSync(path.join(path.dirname(require.resolve('three')),'../examples/js/controls/OrbitControls.js'),'utf8');
const sc=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]); const errs=[], fails=[], sleep=ms=>new Promise(r=>setTimeout(r,ms));
function ok(c,m){ if(!c) fails.push(m); }
const mobile=process.argv[2]==='mobile';
function boot(){ const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://x.test/'}); Object.defineProperty(dom.window.navigator,'languages',{value:['pl-PL']}); Object.defineProperty(dom.window.navigator,'language',{value:'pl-PL'});  const w=dom.window;
  w.localStorage.setItem('surgitome-intro','1'); w.localStorage.setItem('surgitome-tour','1');
  w.matchMedia=q=>({matches:mobile&&/max-width/.test(q),addEventListener(){}});
  w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({},{get(_,k){ if(k==='createImageData') return (a,b)=>({data:new Uint8ClampedArray(a*b*4)}); if(k==='measureText') return ()=>({width:10}); return ()=>null; }, set(){return true}})};
  w.THREE=T; w.eval(orbit); w.addEventListener('error',e=>errs.push(e.message||String(e.error))); w.eval(sc[0]); w.eval(sc[1]); return w; }
(async()=>{
  const w=boot(); await sleep(300); const $=id=>w.document.getElementById(id), D=w.document;
  [...D.querySelectorAll('#cats .cat')].find(b=>/Wątroba/.test(b.textContent)).click(); await sleep(500);
  [...D.querySelectorAll('#tabs .tab')].find(b=>/Przeszczep/.test(b.textContent)).click(); await sleep(800);
  const vb=[...D.querySelectorAll('#variants .vbtn')].map(b=>b.textContent); ok(vb.length===4,'warianty: '+vb.join('|'));
  const WANT={0:['Zespolenie IVC nad wątrobą','Zespolenie IVC pod wątrobą','Zespolenie przewód–przewód'],1:['Zespolenie IVC nad wątrobą','Hepatikojejunostomia','Zespolenie jelitowo-jelitowe','Kikut przewodu żółciowego biorcy (zamknięty)','Pętla Roux-en-Y'],
    2:['Zespolenie kawo-kawalne bok-do-bokuprzednia ściana IVC biorcy – tylna ściana IVC dawcy','Zamknięty górny koniec IVC dawcy','Zamknięty dolny koniec IVC dawcy','Zamknięte ujścia żył wątrobowych biorcy','Zespolenie przewód–przewód','IVC biorcy (zachowana)'],3:['Zespolenie kawo-kawalne bok-do-bokuprzednia ściana IVC biorcy – tylna ściana IVC dawcy','Hepatikojejunostomia','Pętla Roux-en-Y','Kikut przewodu żółciowego biorcy (zamknięty)']};
  const NOT={0:['Hepatikojejunostomia','Zamknięty dolny koniec IVC dawcy'],1:['Zespolenie przewód–przewód'],2:['Zespolenie IVC pod wątrobą','Pętla Roux-en-Y'],3:['Zespolenie IVC nad wątrobą','Zespolenie przewód–przewód']};
  for(let v=0;v<4;v++){
    D.querySelectorAll('#variants .vbtn')[v].click(); await sleep(700);
    const steps=[...D.querySelectorAll('.srow1 .step')]; ok(steps.length===6,'wariant '+v+': kadrów '+steps.length);
    steps[0].click(); await sleep(400); let o=w.__sgTest.oltx(); ok(o&&o.m===0,'wariant '+v+': start m '+(o&&o.m));
    ok(o.rings.includes('Wątroba biorcy')&&!o.rings.some(x=>/Zespolenie/.test(x)),'wariant '+v+': kadr 1 '+o.rings.join('|'));
    steps[5].click(); await sleep(500); o=w.__sgTest.oltx(); ok(o.m===4,'wariant '+v+': koniec m '+o.m);
    const lab=o.rings.map(x=>x.replace(/(koniec-do-końca|przewód dawcy do boku pętli)$/,''));
    WANT[v].forEach(x=>ok(lab.includes(x),'wariant '+v+': brak „'+x+'”'));
    NOT[v].forEach(x=>ok(!lab.includes(x),'wariant '+v+': zbędne „'+x+'”'));
    ok(lab.includes('Przeszczep (wątroba dawcy)')&&!lab.includes('Wątroba biorcy'),'wariant '+v+': etykiety wątroby '+lab.join('|'));
    console.log('wariant',vb[v],'| etykiety:',lab.length);
  }
  // „Dalej” przez cały wariant: kadry po kolei, animacje do końca
  D.querySelectorAll('#variants .vbtn')[0].click(); await sleep(500); D.querySelectorAll('.srow1 .step')[0].click(); await sleep(300);
  for(let i=0;i<10;i++){ $('btnNext').click(); await sleep(120); }
  ok(w.__sgTest.state().frame>=4,'„Dalej” nie przechodzi przez kadry: '+w.__sgTest.state().frame);
  ok(!$('togLvGlass').hidden,'brak przełącznika miąższu');
  const leg=[...D.querySelectorAll('#legend .leg')].map(b=>b.dataset.id).join(','); ok(/sys:par.*sys:pv.*sys:ha.*sys:bd.*sys:hv/.test(leg),'legenda: '+leg);
  // EN
  $('btnLang').click(); await sleep(100);
  const txt=[$('capTitle').textContent,$('capText').textContent,$('pTitle').textContent,$('pSub').textContent,...[...D.querySelectorAll('#pNotes li,#legend .leg,#labels .lbl,#variants .vbtn,.srow1 .step')].filter(e=>e.style.display!=='none').map(e=>e.textContent)].join(' | ');
  const pl=txt.match(/[^|]*[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ][^|]*/g); ok(!pl,'polskie teksty w EN: '+(pl||[]).slice(0,4).join(' / '));
  console.log('errors',JSON.stringify(errs.concat(fails))); process.exit(0);
})();
